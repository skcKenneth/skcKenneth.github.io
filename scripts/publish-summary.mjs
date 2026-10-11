import { appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { EDITORIAL_ARTICLE_IDS, getReaderMedia } from '../src/data/reader-media.mjs';
import { CONCEPT_IDS } from '../src/data/reader-concepts.mjs';
import { READING_PATH_IDS } from '../src/data/reading-paths.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export const LIVE_ROUTES = ['', '/zh', '/writing', '/zh/writing', '/topics', '/zh/topics', '/teaching', '/zh/teaching', '/search', '/zh/search'].map(prefix => ({ path: `${prefix}/`, locale: prefix.startsWith('/zh') ? 'zh-Hant' : 'en', kind: prefix.endsWith('writing') ? 'writing' : prefix.endsWith('topics') ? 'topics' : prefix.endsWith('teaching') ? 'teaching' : prefix.endsWith('search') ? 'search' : 'home' })).concat([
  { path: '/rss.xml', locale: 'en', kind: 'rss' }, { path: '/zh/rss.xml', locale: 'zh-Hant', kind: 'rss' },
  { path: '/images/og-reader.png', kind: 'png' }, { path: '/images/kenneth-woven-knot.svg', kind: 'svg' },
], ['', '/zh'].flatMap(base => [
  { path: `${base}/writing/archive/`, locale: base ? 'zh-Hant' : 'en', kind: 'alias', destination: `${base}/writing/?archive=1` },
  { path: `${base}/research/`, locale: base ? 'zh-Hant' : 'en', kind: 'alias', destination: `${base}/topics/#research-programmes` },
  { path: `${base}/teaching/jae-math/`, locale: base ? 'zh-Hant' : 'en', kind: 'alias', destination: `${base}/teaching/senior-math/studios/jae/` },
  { path: `${base}/teaching/senior-math/studios/jae/`, locale: base ? 'zh-Hant' : 'en', kind: 'studio' },
  { path: `${base}/teaching/model-laboratory/`, locale: base ? 'zh-Hant' : 'en', kind: 'models' },
]), EDITORIAL_ARTICLE_IDS.flatMap(articleId => ['en', 'zh-Hant'].flatMap(locale => {
  const media = getReaderMedia(articleId, locale);
  if (!media) throw new Error(`Missing reviewed editorial media: ${articleId}/${locale}`);
  return [
    { path: `${locale === 'zh-Hant' ? '/zh' : ''}/writing/${articleId}/`, locale, kind: 'article', articleId, sharePath: media.share.src },
    { path: media.share.src, kind: 'png' },
  ];
})), ['en', 'zh-Hant'].flatMap(locale => {
  const base = locale === 'zh-Hant' ? '/zh' : '';
  const alternateBase = locale === 'zh-Hant' ? '' : '/zh';
  return ['/concepts/', '/topics/routes/', ...CONCEPT_IDS.map(id => `/concepts/${id}/`), ...READING_PATH_IDS.map(id => `/topics/routes/${id}/`)]
    .map(path => ({path: `${base}${path}`, locale, kind: 'guide', alternatePath: `${alternateBase}${path}`}));
}));
const MARKERS = { guide: ['data-pagefind-filter="search-kind[content]" content="guide"', '<h1'], home: ['reader-home-hero', 'id="latest-writing"', 'id="start-here"'], writing: ['data-writing-index', 'reader-pagination'], topics: ['reader-topics-grid', 'mathematical-thinking', 'teaching-research-practice', 'id="research-programmes"'], teaching: ['data-teaching-directory', 'data-teaching-filters', 'id="math-inquiry-lab"'], search: ['data-site-search', 'data-search-pagination', 'name="technical"'], studio: ['id="jae-topics"', 'id="quadratics"', 'id="trigonometry"', 'id="past-papers"'], models: ['id="model-index"', 'data-catalog-kind="model"', 'data-model-library'], article: ['data-reader-guide=', 'data-reader-guide-question', 'data-article-reader', 'data-reading-position', 'data-reader-print'] };
export function validateLivePayload(spec, { status, contentType = '', bytes }, expectedHash) {
  const errors = [];
  if (status !== 200) return [`HTTP ${status}`];
  const body = Buffer.from(bytes).toString('utf8');
  if (MARKERS[spec.kind]) {
    if (!contentType.includes('text/html')) errors.push('Expected HTML content type');
    if (!new RegExp(`<html\\b[^>]*lang=["']${spec.locale}["']`).test(body)) errors.push(`Missing ${spec.locale} page language`);
    for (const marker of MARKERS[spec.kind]) if (!body.includes(marker)) errors.push(`Missing marker ${marker}`);
    if (!body.includes('/images/kenneth-woven-knot.svg')) errors.push('Missing woven site icon');
    if (spec.kind === 'article') {
      if (!body.includes(`data-reader-guide="${spec.articleId}"`)) errors.push('Missing paired reading guide');
      if (!body.includes(`property="og:image" content="https://skckenneth.github.io${spec.sharePath}"`)) errors.push('Missing article sharing image');
    }
    if (spec.kind === 'guide') {
      if (!body.includes(`rel="canonical" href="https://skckenneth.github.io${spec.path}"`)) errors.push('Incorrect guide canonical URL');
      const other = spec.locale === 'en' ? 'zh-Hant' : 'en';
      if (!body.includes(`rel="alternate" hreflang="${other}" href="https://skckenneth.github.io${spec.alternatePath}"`)) errors.push('Incorrect guide language counterpart');
    }
  } else if (spec.kind === 'alias') {
    if (!contentType.includes('text/html')) errors.push('Expected HTML content type');
    if (!new RegExp(`<html\\b[^>]*lang=["']${spec.locale}["']`).test(body)) errors.push(`Missing ${spec.locale} alias language`);
    for (const marker of ['noindex,follow', 'data-pagefind-ignore="all"', 'data-compatibility-redirect', '<noscript>', `data-destination="${spec.destination}"`]) if (!body.includes(marker)) errors.push(`Missing alias marker ${marker}`);
  } else if (spec.kind === 'rss') {
    if (!/xml/.test(contentType)) errors.push('Expected XML content type');
    if (!body.includes('<rss version="2.0"') || !body.includes('<channel>') || !body.includes('<item>')) errors.push('RSS feed is missing channel or items');
    if (!body.includes(`<language>${spec.locale}</language>`)) errors.push('Incorrect RSS language');
  } else if (spec.kind === 'png') {
    if (!contentType.includes('image/png')) errors.push('Expected PNG content type');
    if (!Buffer.from(bytes).subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) errors.push('Invalid PNG signature');
  } else if (spec.kind === 'svg' && !body.includes('<svg')) errors.push('Invalid SVG');
  if (expectedHash && hash(bytes) !== expectedHash) errors.push('Asset SHA-256 differs from the deployed commit');
  return errors;
}
export function groupChanges(files) {
  const rules = [
    ['導覽、首頁與閱讀介面', /(?:BaseLayout|HomePage|WritingIndex|ReaderCard|ArticleReader|reader\.css|src\/pages\/(?:zh\/)?(?:index|writing))|global\.css/],
    ['主題、內容分類與雙語資料', /(?:site-reader|topic-assignments|TopicsIndex|TopicPage|\/topics\/|src\/content\/|content\.config)/],
    ['搜尋與結果篩選', /(?:[Ss]earch|pagefind)/],
    ['教學入口、學習工具與下載資訊', /(?:[Tt]eaching|[Tt]oolbar|[Ll]ecture|[Ww]orkshop|[Jj]ae|[Ss]eniorMath|MacauCompetition|[Dd]ownloadMetadata|download-metadata|math-studio)/],
    ['回訪、分享與內容時效', /(?:rss|reading-list|reader-utils|og-reader|share|site-editorial|about|404)/],
    ['發布流程、內容模板與檢查', /(?:scripts\/|tests\/|templates\/|CONTENT_GUIDE|package\.json|pnpm-lock|\.github\/|\.gitattributes|tsconfig)/],
  ];
  const groups = [];
  for (const file of files) { const title = rules.find(([, pattern]) => pattern.test(file))?.[0] || '其他實際變更'; let group = groups.find(item => item.title === title); if (!group) { group = { title, files: [] }; groups.push(group); } group.files.push(file); }
  return groups;
}
const escape = text => String(text).replace(/[<>`]/g, character => ({ '<': '&lt;', '>': '&gt;', '`': '&#96;' }[character]));
export function createPublishSummary({ sha, base, files, siteUrl, workflowVerified = false, live = [] }) {
  const lines = ['## 網站發布摘要', '', `提交：\`${escape(sha)}\``, base ? `比較起點：\`${escape(base)}\`` : '比較起點：首個可取得的提交', '', `實際變更 ${files.length} 個檔案：`, ...groupChanges(files).map(group => `- ${group.title}：${group.files.length} 個檔案`), '', '### 驗證紀錄', ''];
  lines.push(workflowVerified ? '- GitHub Actions 已完成本次建置及 Pages 部署。' : '- 未從已成功的 GitHub Actions 建置及部署上下文確認發布；此摘要不聲稱已完成發布。');
  if (live.length) for (const result of live) lines.push(`- ${result.ok ? '✓' : '✗'} \`${escape(result.path)}\`：${result.ok ? result.hash ? 'HTTP、格式與提交資產 SHA-256 通過' : 'HTTP、語言與內容標記通過' : escape(result.errors.join('; '))}`);
  else lines.push('- 本次沒有執行線上驗證。');
  lines.push('', '上述自動檢查沒有代替實際瀏覽器操作、鍵盤測試或完整 WCAG 審核。');
  if (siteUrl) lines.push('', `[查看網站](${siteUrl})`);
  lines.push('', '<details><summary>實際變更檔案</summary>', '', ...files.map(file => `- \`${escape(file)}\``), '', '</details>', '');
  return lines.join('\n');
}
export async function verifyLiveSite(siteUrl, { sha = '', fetcher = fetch, expectedHashes = {}, timeoutMs = 60000, retryDelayMs = 1000 } = {}) {
  const origin = new URL(siteUrl); if (origin.protocol !== 'https:' || origin.hostname !== 'skckenneth.github.io') throw new Error('Live verification requires the configured skckenneth.github.io HTTPS site');
  const deadline = Date.now() + Math.min(60000, timeoutMs), completed = new Map();
  for (let attempt = 0; attempt < 6 && Date.now() < deadline; attempt++) {
    const pending = LIVE_ROUTES.filter(spec => !completed.get(spec.path)?.ok);
    await Promise.all(pending.map(async spec => {
      const remaining = deadline - Date.now(); if (remaining <= 0) return;
      const url = new URL(spec.path, origin); if (sha) url.searchParams.set('verify', sha.slice(0, 12));
      try {
        const response = await fetcher(url, { signal: AbortSignal.timeout(Math.max(1, Math.min(8000, remaining))), headers: { 'Cache-Control': 'no-cache' } });
        const bytes = Buffer.from(await response.arrayBuffer());
        const errors = validateLivePayload(spec, { status: response.status, contentType: response.headers.get('content-type') || '', bytes }, expectedHashes[spec.path]);
        completed.set(spec.path, { path: spec.path, ok: errors.length === 0, errors, hash: expectedHashes[spec.path] });
      } catch (error) { completed.set(spec.path, { path: spec.path, ok: false, errors: [error.message] }); }
    }));
    if (LIVE_ROUTES.every(spec => completed.get(spec.path)?.ok)) break;
    const remaining = deadline - Date.now(); if (attempt < 5 && remaining > 0) await new Promise(done => setTimeout(done, Math.min(10000, retryDelayMs, remaining)));
  }
  return LIVE_ROUTES.map(spec => completed.get(spec.path) || { path: spec.path, ok: false, errors: ['Verification deadline exceeded'] });
}
function git(args) { const result = spawnSync('git', args, { encoding: 'utf8' }); if (result.status !== 0) throw new Error(result.stderr.trim() || 'Git command failed'); return result.stdout.trim(); }
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2); if (args.some(arg => arg !== '--live')) throw new Error('Usage: node scripts/publish-summary.mjs [--live]');
    const sha = git(['rev-parse', 'HEAD']);
    const candidate = process.env.PUBLISH_BASE_SHA || '';
    let base = /^[a-f0-9]{40}$/i.test(candidate) && !/^0+$/.test(candidate) ? candidate : '';
    if (!base) { try { base = git(['rev-parse', 'HEAD^']); } catch { /* First commit has no parent. */ } }
    const files = (base ? git(['diff', '--name-only', base, sha]) : git(['diff-tree', '--no-commit-id', '--name-only', '--root', '-r', sha])).split(/\r?\n/).filter(Boolean);
    const siteUrl = process.env.PUBLISH_SITE_URL || 'https://skckenneth.github.io/';
    const expectedHashes = {};
    for (const path of LIVE_ROUTES.filter(route => ['png', 'svg'].includes(route.kind)).map(route => route.path)) {
      // Compare immutable commit bytes, unaffected by a local autocrlf checkout.
      const asset = spawnSync('git', ['show', `${sha}:public${path}`], { maxBuffer: 5 * 1024 * 1024 });
      if (asset.status !== 0) throw new Error(`Cannot read committed asset ${path}`);
      expectedHashes[path] = hash(asset.stdout);
    }
    const workflowVerified = process.env.GITHUB_ACTIONS === 'true' && process.env.PUBLISH_BUILD_RESULT === 'success' && process.env.PUBLISH_DEPLOY_RESULT === 'success' && process.env.GITHUB_SHA === sha;
    const live = args.includes('--live') ? await verifyLiveSite(siteUrl, { sha, expectedHashes }) : [];
    const summary = createPublishSummary({ sha, base, files, siteUrl, workflowVerified, live });
    console.log(summary); if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary, 'utf8');
    if (live.some(result => !result.ok)) process.exitCode = 1;
  } catch (error) { console.error(`Publish summary failed: ${error.message}`); process.exitCode = 1; }
}
