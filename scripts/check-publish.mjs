import { readFile, readdir, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, relative, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { TOPIC_IDS, getTopicIds, canonicalId } from '../src/data/site-reader.mjs';
import { MILESTONES } from '../src/data/site-editorial.mjs';
import { checkContentReview } from './content-review.mjs';
const require = createRequire(import.meta.resolve('astro/package.json'));
const yaml = require('js-yaml');
async function files(directory) { const result = []; for (const entry of await readdir(directory, { withFileTypes: true })) { const full = resolve(directory, entry.name); if (entry.isDirectory()) result.push(...await files(full)); else if (/\.(?:md|mdx)$/.test(entry.name)) result.push(full); } return result; }
export function parseContent(source) { const match = source.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/); if (!match) throw new Error('Missing YAML frontmatter'); return { data: yaml.load(match[1], { schema: yaml.JSON_SCHEMA }) || {}, body: source.slice(match[0].length) }; }
export async function checkPublication(root, { today = new Date().toISOString().slice(0, 10) } = {}) {
  const errors = [], warnings = [], entries = [];
  for (const [en, zh, route] of [['writing', 'writing-zh', 'writing'], ['teaching', 'teaching-zh', 'teaching'], ['projects', 'projects-zh', 'projects'], ['research', 'research-zh', 'research']]) {
    for (const [collection, locale] of [[en, 'en'], [zh, 'zh-Hant']]) for (const file of await files(resolve(root, 'src/content', collection))) {
      try { const parsed = parseContent(await readFile(file, 'utf8')); entries.push({ ...parsed, file, collection, locale, route }); } catch (error) { errors.push(`${relative(root, file)}: ${error.message}`); }
    }
  }
  const pathLabel = entry => relative(root, entry.file);
  const published = entries.filter(entry => !entry.data.draft);
  const routes = new Set(published.map(entry => `${entry.locale === 'zh-Hant' ? '/zh' : ''}/${entry.route}/${entry.data.slug}/`));
  for (const entry of entries) {
    const data = entry.data, id = canonicalId(data), opposite = entry.locale === 'en' ? 'zh-Hant' : 'en';
    const pair = entries.find(other => other.route === entry.route && other.locale === opposite && canonicalId(other.data) === id);
    if (!pair) errors.push(`${pathLabel(entry)}: missing ${opposite} edition for ${id}`);
    else {
      if (Boolean(pair.data.draft) !== Boolean(data.draft)) errors.push(`${pathLabel(entry)}: bilingual draft state differs`);
      if (entry.route === 'writing' && Date.parse(pair.data.date) !== Date.parse(data.date)) errors.push(`${pathLabel(entry)}: bilingual publication dates differ`);
      if (JSON.stringify(getTopicIds(data)) !== JSON.stringify(getTopicIds(pair.data))) errors.push(`${pathLabel(entry)}: bilingual topicIds differ`);
    }
    if (data.draft) continue;
    for (const field of ['date', 'lastUpdated']) {
      if (!data[field]) { if (field === 'lastUpdated' || (field === 'date' && entry.route === 'writing')) errors.push(`${pathLabel(entry)}: missing ${field}`); continue; }
      const value = String(data[field]);
      if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value.slice(0, 10)).toISOString().slice(0, 10) !== value.slice(0, 10)) errors.push(`${pathLabel(entry)}: invalid ${field}`);
      else if (value.slice(0, 10) > today) errors.push(`${pathLabel(entry)}: future ${field}; keep future content as a draft`);
    }
    if (data.date && data.lastUpdated && Date.parse(data.lastUpdated) < Date.parse(data.date)) errors.push(`${pathLabel(entry)}: update precedes publication`);
    const legacy = Boolean(data.legacySource || /[\\/]legacy[\\/]/.test(entry.file));
    if (['writing', 'teaching'].includes(entry.route) && !legacy) {
      if (!Array.isArray(data.topicIds) || data.topicIds.length < 1 || data.topicIds.length > 3 || new Set(data.topicIds).size !== data.topicIds.length || data.topicIds.some(id => !TOPIC_IDS.includes(id))) errors.push(`${pathLabel(entry)}: require one primary topicId and up to two related topics`);
    }
    for (const slug of data.relatedSlugs || []) if (!published.some(other => other.route === 'writing' && other.locale === entry.locale && canonicalId(other.data) === slug && canonicalId(other.data) !== id)) errors.push(`${pathLabel(entry)}: invalid related article ${slug}`);
    if (legacy) continue;
    const refs = [data.heroImage, data.downloadUrl, ...(data.downloads || []).map(item => item.url), ...[...entry.body.matchAll(/(?:!\[[^\]]*\]|\[[^\]]+\])\((\/[^\s)]+)(?:\s+[^)]*)?\)|(?:href|src)=["'](\/[^"']+)["']/g)].map(match => match[1] || match[2])].filter(Boolean);
    for (const ref of new Set(refs)) {
      if (!ref.startsWith('/') || ref.startsWith('//') || /[{}]/.test(ref)) continue;
      const clean = decodeURI(ref.split(/[?#]/)[0]); if (!clean) continue;
      if (extname(clean)) { try { await access(resolve(root, 'public', '.' + clean)); } catch { errors.push(`${pathLabel(entry)}: missing local asset ${clean}`); } }
      else if (/^\/(?:zh\/)?(?:writing|projects|research)\/[^/]+\/$/.test(clean) && !routes.has(clean)) errors.push(`${pathLabel(entry)}: missing content link ${clean}`);
    }
  }
  for (const milestone of MILESTONES) if (milestone.reviewAfter <= today) warnings.push(`Milestone ${milestone.id}: review due since ${milestone.reviewAfter}; retained status ${milestone.status}. Source: ${milestone.source}`);
  return { errors: [...new Set(errors)], warnings, checked: published.length };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const options = process.argv.slice(2); const allowed = new Set(['--checks-only', '--built']);
  if (options.some(option => !allowed.has(option))) { console.error('Usage: node scripts/check-publish.mjs [--checks-only] [--built]'); process.exitCode = 1; }
  else {
    const report = await checkPublication(process.cwd()); report.warnings.forEach(warning => console.warn(`Review: ${warning}`));
    const reviews = await checkContentReview(process.cwd());
    report.errors.push(...reviews.errors);
    console.log(`Content review queue: ${reviews.checked} observed; ${reviews.report.summary.reviewed} scoped reviews; ${reviews.report.summary.actionable} pending actions. Run pnpm review:content for source fingerprints and reasons. Unknown legacy reviews remain informational.`);
    if (report.errors.length) { console.error(`Publication checks failed (${report.errors.length}):\n${report.errors.map(error => `- ${error}`).join('\n')}`); process.exitCode = 1; }
    else {
      console.log(`Publication metadata, bilingual topics, dates and local references checked in ${report.checked} published entries.`);
      if (!options.includes('--checks-only')) {
        const gates = [['scripts/check-bilingual-content.mjs', '--strict'], ['scripts/check-portfolio-reading-time.mjs'], ['scripts/check-portfolio-publication.mjs'], ['scripts/check-writing-visuals.mjs'], ['scripts/check-teaching-resources.mjs']];
        if (options.includes('--built')) { if (!existsSync(resolve(process.cwd(), 'dist/index.html'))) throw new Error('Build the site before --built'); gates.push(['scripts/check-built-links.mjs'], ['scripts/check-output.mjs']); }
        for (const args of gates) { const result = spawnSync(process.execPath, args, { cwd: process.cwd(), stdio: 'inherit' }); if (result.status !== 0) { process.exitCode = result.status || 1; break; } }
      }
    }
  }
}
