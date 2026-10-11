import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const option = (key, fallback) => { const index = args.indexOf(key); return index < 0 ? fallback : args[index + 1]; };
const dist = resolve(root, option('--dist', 'dist'));
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const gitStatus = execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' });
const sourceState = gitStatus.trim() ? 'working-tree' : 'clean';
const expected = option('--expected-commit', '');
if (expected && !commit.startsWith(expected)) throw new Error(`Expected source commit ${expected}; found ${commit}`);
const output = resolve(root, option('--out', `design/site-refresh/performance/${commit.slice(0, 7)}`));
const ids = ['two-networks-one-spectrum-different-alarms', 'how-many-equilibria-did-the-optimizer-miss', 'what-must-a-traffic-model-remember', 'when-the-fit-is-not-the-model', 'random-stress-tests-are-not-certificates', 'when-solar-power-changes-fast'];
const routeFile = option('--routes', '');
const routes = routeFile ? JSON.parse(await readFile(resolve(root, routeFile), 'utf8')) : ['/', '/zh/', '/topics/dynamics-networks/', '/zh/topics/dynamics-networks/', ...ids.flatMap(id => [`/writing/${id}/`, `/zh/writing/${id}/`])];
if (!Array.isArray(routes) || !routes.length || routes.some(route => typeof route !== 'string' || !/^\/(?:[a-z0-9-]+\/)*$/.test(route))) throw new Error('Routes must be a nonempty array of local directory paths.');
const origin = 'https://skckenneth.github.io';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const attributes = source => Object.fromEntries([...source.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(match => [match[1].toLowerCase(), (match[2] ?? match[3] ?? match[4] ?? '').replace(/&amp;/g, '&')]));
const localUrl = (value, parent) => {
  if (!value || /^(?:data|blob|javascript):/i.test(value)) return null;
  const url = new URL(value, origin + parent);
  return url.origin === origin ? url.pathname : null;
};
const fileFor = path => {
  const file = resolve(dist, '.' + decodeURIComponent(path));
  const rel = relative(dist, file);
  if (rel === '..' || rel.startsWith('..' + sep)) throw new Error(`Asset escapes dist: ${path}`);
  return file;
};
const cache = new Map();
const asset = async path => {
  if (!cache.has(path)) cache.set(path, (async () => {
    const bytes = await readFile(fileFor(path));
    const textLike = /\.(?:html|css|js|mjs|svg|json)$/.test(path);
    return { path, bytes: bytes.length, sha256: hash(bytes), ...(textLike ? { gzipBytesEstimate: gzipSync(bytes, { level: 9 }).length, brotliBytesEstimate: brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length } : {}), content: bytes };
  })());
  return cache.get(path);
};
const publicRecord = ({ content, ...record }) => record;
const reports = [];
for (const route of routes) {
  const htmlPath = route + 'index.html';
  const htmlAsset = await asset(htmlPath);
  const html = htmlAsset.content.toString('utf8');
  const styles = new Set(), scripts = new Set(), images = new Map(), candidates = new Set(), dynamic = new Set(), icons = new Set(), shares = new Set(), external = new Set();
  const add = (set, value, parent = route) => { const path = localUrl(value, parent); if (path) set.add(path); else if (/^https?:/i.test(value || '')) external.add(value); };
  for (const match of html.matchAll(/<(script|link|img|source|meta)\b([^>]+)>/gi)) {
    const tag = match[1].toLowerCase(), attrs = attributes(match[2]);
    if (tag === 'script' && attrs.src) add(scripts, attrs.src);
    if (tag === 'link') {
      if (attrs.rel === 'stylesheet') add(styles, attrs.href);
      else if (attrs.rel === 'modulepreload' || attrs.rel === 'preload' && attrs.as === 'script') add(scripts, attrs.href);
      else if (/icon/.test(attrs.rel || '')) add(icons, attrs.href);
      else if (attrs.rel === 'preload' && attrs.href) add(candidates, attrs.href);
    }
    if (tag === 'img' && attrs.src) {
      const path = localUrl(attrs.src, route);
      if (path) images.set(path, { width: Number(attrs.width) || null, height: Number(attrs.height) || null, loading: attrs.loading || 'default', decoding: attrs.decoding || 'default', srcset: attrs.srcset || null, sizes: attrs.sizes || null });
      else if (/^https?:/i.test(attrs.src)) external.add(attrs.src);
    }
    if ((tag === 'img' || tag === 'source') && attrs.srcset) for (const candidate of attrs.srcset.split(',')) add(candidates, candidate.trim().split(/\s+/)[0]);
    if (tag === 'meta' && (attrs.property === 'og:image' || attrs.name === 'twitter:image')) add(shares, attrs.content);
  }
  // These are declared dependency graphs, not browser network measurements.
  for (const path of styles) {
    const css = (await asset(path)).content.toString('utf8');
    for (const match of css.matchAll(/@import\s*(?:url\()?\s*["']([^"']+)["']/g)) add(styles, match[1], path);
    for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) add(candidates, match[1], path);
  }
  for (const path of scripts) {
    const source = ts.createSourceFile(path, (await asset(path)).content.toString('utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    const visit = node => {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) add(scripts, node.moduleSpecifier.text, path);
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && ts.isStringLiteral(node.arguments[0])) add(dynamic, node.arguments[0].text, path);
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  const records = async paths => Promise.all([...paths].sort().map(async path => publicRecord(await asset(path))));
  const imageRecords = await Promise.all([...images].map(async ([path, declared]) => ({ ...publicRecord(await asset(path)), declared })));
  const styleRecords = await records(styles), scriptRecords = await records(scripts);
  const sum = records => records.reduce((total, item) => total + item.bytes, 0);
  reports.push({ route, html: publicRecord(htmlAsset), declaredStyles: styleRecords, initialScriptGraph: scriptRecords, declaredImages: imageRecords, candidateAssets: await records(candidates), dynamicImportTargets: await records(dynamic), icons: await records(icons), shareMetadataImages: await records(shares), externalReferences: [...external].sort(), inlineScriptBytesIncludedInHtml: [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match => !attributes(match[1]).src).reduce((total, match) => total + Buffer.byteLength(match[2]), 0), totals: { htmlBytes: htmlAsset.bytes, cssBytes: sum(styleRecords), initialJsBytes: sum(scriptRecords), declaredImageBytes: sum(imageRecords), declaredHtmlCssJsImageBytes: htmlAsset.bytes + sum(styleRecords) + sum(scriptRecords) + sum(imageRecords) } });
}
const packageData = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const report = { version: 1, label: option('--label', 'Local static asset baseline'), capturedAt: new Date().toISOString(), sourceCommit: commit, sourceState, workingTreeStatusSha256: hash(gitStatus), dist: relative(root, dist).replaceAll('\\', '/'), runtime: { node: process.version, platform: process.platform, arch: process.arch, astro: packageData.dependencies.astro }, method: 'Offline reads of a frozen built dist. Declared local asset bytes and static JS imports; no HTTP requests, browser timings, cache behaviour, Web Vitals or real-user measurements. gzip/Brotli values are estimates. Lazy images are declared bytes, not necessarily initial downloads. CSS fonts, responsive candidates and dynamic imports are separate potential dependencies.', routes: reports };
await mkdir(output, { recursive: true });
await writeFile(resolve(output, 'assets.json'), JSON.stringify(report, null, 2) + '\n');
const markdown = [`# ${report.label}`, '', `Source HEAD: \`${commit}\``, `Source state: ${sourceState}`, sourceState === 'working-tree' ? 'HEAD is the base revision; the measured output belongs to an uncommitted working tree, not a release at that commit. Page and asset hashes identify the measured dist snapshot.' : 'The source checkout was clean at capture time. Page and asset hashes identify the measured dist snapshot.', `Captured: ${report.capturedAt}`, '', report.method, '', '| Route | HTML | CSS | Initial JS graph | Declared images |', '|---|---:|---:|---:|---:|', ...reports.map(item => `| ${item.route} | ${item.totals.htmlBytes} | ${item.totals.cssBytes} | ${item.totals.initialJsBytes} | ${item.totals.declaredImageBytes} |`), '', 'All counts are bytes. Unique paths are counted once per route. Inline scripts are already included in HTML. Sharing metadata images, favicon alternatives, CSS/font candidates and dynamic import targets are excluded from the displayed totals.', ''];
await writeFile(resolve(output, 'README.md'), markdown.join('\n'));
console.log(`Captured ${reports.length} routes at ${commit.slice(0, 7)} into ${relative(root, output)} without network requests.`);
