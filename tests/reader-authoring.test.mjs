import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, access } from 'node:fs/promises';
import { statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { build } from 'esbuild';
import { parseDraftArgs, createDrafts } from '../scripts/content-new.mjs';
import { parseContent, checkPublication } from '../scripts/check-publish.mjs';
import { TEACHING_AUDIENCES, TEACHING_FORMATS, TEACHING_RESOURCES, filterTeachingResources, teachingHref } from '../src/data/teaching-directory.mjs';
import { downloadMetadata } from '../src/lib/download-metadata.mjs';
const root = resolve(import.meta.dirname, '..');
async function temporary(run) { const dir = await mkdtemp(join(tmpdir(), 'site-authoring-test-')); try { return await run(dir); } finally { assert(dir.startsWith(join(tmpdir(), 'site-authoring-test-'))); await rm(dir, { recursive: true, force: true }); } }
test('audience and format combinations return matching resources in both languages', () => {
  for (const audience of TEACHING_AUDIENCES) {
    const result = filterTeachingResources({ audience: audience.id }); assert(result.length > 0);
    assert(result.every(item => item.audiences.includes(audience.id)));
  }
  for (const format of TEACHING_FORMATS) assert(filterTeachingResources({ format: format.id }).length > 0);
  const seniorPapers = filterTeachingResources({ audience: 'senior', format: 'past-papers' });
  assert(seniorPapers.some(item => item.id === 'senior-math'));
  assert(!seniorPapers.some(item => item.id === 'lecture-library'));
  assert.equal(filterTeachingResources({ query: '不存在的測試資源', locale: 'zh-Hant' }).length, 0);
  const pythonIds=filterTeachingResources({ query: ' Python ' }).map(item=>item.id);assert(pythonIds.includes('modeling-workshop'));assert(pythonIds.includes('math-system'));
  assert.equal(filterTeachingResources({ query: '投影片', locale: 'zh-Hant' })[0].id, 'lecture-library');
});
test('bilingual resources expose both editions and retain existing deep anchors', () => {
  const studio = TEACHING_RESOURCES.find(item => item.id === 'math-studio');
  assert.equal(studio.chineseOnly,false); assert.equal(teachingHref(studio, 'en'), '/math-studio/?lang=en'); assert.equal(teachingHref(studio, 'zh-Hant'), '/math-studio/?lang=zh-Hant');
  assert(TEACHING_RESOURCES.some(item => item.id === 'math-inquiry-lab'));
  assert.equal(teachingHref(TEACHING_RESOURCES.find(item => item.id === 'senior-math'), 'zh-Hant'), '/zh/teaching/senior-math/');
  assert.equal(new Set(TEACHING_RESOURCES.map(item => item.id)).size, TEACHING_RESOURCES.length);
});
test('download metadata comes from actual files and only existing release licence declarations', () => {
  const path = '/resources/mathematical-modeling-lecture-materials/documents/notes-en/lecture-01-notes-en.pdf';
  const info = downloadMetadata(path); assert.equal(info.bytes, statSync(join(root, 'public', path)).size);
  assert.equal(info.locale, 'en'); assert.equal(info.license, 'CC BY-NC-SA 4.0'); assert.equal(info.version, '2026-08-20');
  const competition = downloadMetadata('/resources/macau-school-math-competition-2019-2026/solution-companion.pdf');
  assert.equal(competition.bytes, 1702857); assert.equal(competition.license, undefined); assert.equal(competition.officialSource, 'https://www.dsedj.gov.mo/cre/science/comp/info.html');
  assert.equal(downloadMetadata('/../package.json').bytes, undefined);
});
test('paired draft creation uses valid shared identity and refuses invalid input or overwrites', async () => temporary(async dir => {
  const options = parseDraftArgs(['--kind', 'writing', '--slug', 'test-new-entry', '--topic', 'data-ai', '--date', '2026-10-11']);
  const paths = await createDrafts(dir, options);
  const en = parseContent(await readFile(paths[0], 'utf8')).data, zh = parseContent(await readFile(paths[1], 'utf8')).data;
  assert.equal(en.draft, true); assert.equal(zh.sourceSlug, en.slug); assert.deepEqual(en.topicIds, ['data-ai']);
  assert.deepEqual(zh.topicIds, en.topicIds); assert.equal(en.date, zh.date);
  await assert.rejects(createDrafts(dir, options), /Refusing to overwrite/);
  assert.throws(() => parseDraftArgs(['--kind', 'writing', '--slug', '../oops', '--topic', 'data-ai']), /--slug/);
  assert.throws(() => parseDraftArgs(['--kind', 'teaching', '--slug', 'valid', '--topic', 'wrong']), /--topic/);
  assert.throws(() => parseDraftArgs(['--kind', 'writing', '--slug', 'valid', '--topic', 'data-ai', '--date', '2026-02-30']), /--date/);
}));
test('dry-run makes no directories and teaching drafts have a paired valid schema', async () => temporary(async dir => {
  const options = parseDraftArgs(['--kind', 'teaching', '--slug', 'test-teaching', '--topic', 'teaching-research-practice', '--dry-run']);
  const paths = await createDrafts(dir, options); await assert.rejects(access(paths[0]));
  await createDrafts(dir, { ...options, dryRun: false });
  const en = parseContent(await readFile(paths[0], 'utf8')).data; assert.equal(en.level, 'Beginner'); assert.equal(en.resourceType, 'Course pathway'); assert.equal(en.date, undefined);
}));
test('an existing MDX edition blocks draft creation without creating a duplicate Markdown file', async () => temporary(async dir => {
  const folder = join(dir, 'src/content/teaching'); await mkdir(folder, { recursive: true });
  const path = join(folder, 'existing-unit.mdx'); await writeFile(path, 'existing authored resource');
  const options = parseDraftArgs(['--kind', 'teaching', '--slug', 'existing-unit', '--topic', 'mathematical-thinking']);
  await assert.rejects(createDrafts(dir, options), /Refusing to overwrite/); assert.equal(await readFile(path, 'utf8'), 'existing authored resource'); await assert.rejects(access(path.replace(/\.mdx$/, '.md')));
}));
const fixtureSource = ({ locale = 'en', topic = 'data-ai', date = '2026-10-03T16:20:00+08:00', updated = '2026-10-04', body = 'A useful reviewed article.' } = {}) => `---\ntitle: Test article\nslug: test-article\n${locale === 'zh-Hant' ? 'sourceSlug: test-article\n' : ''}summary: A sufficiently detailed summary for this article.\ndate: ${date}\nlastUpdated: ${updated}\ntopicIds: [${topic}]\ndraft: false\n---\n${body}\n`;
test('publication gate detects missing editions, classification drift, dates and local assets', async () => temporary(async dir => {
  for (const name of ['writing', 'writing-zh', 'teaching', 'teaching-zh', 'projects', 'projects-zh', 'research', 'research-zh']) await mkdir(join(dir, 'src/content', name), { recursive: true });
  const en = join(dir, 'src/content/writing/test-article.md'), zh = join(dir, 'src/content/writing-zh/test-article.md');
  await writeFile(en, fixtureSource()); let report = await checkPublication(dir, { today: '2026-10-11' }); assert(report.errors.some(item => item.includes('missing zh-Hant')));
  await writeFile(zh, fixtureSource({ locale: 'zh-Hant', updated: '2026-10-05' })); report = await checkPublication(dir, { today: '2026-10-11' }); assert.deepEqual(report.errors, [], 'translation updates can legitimately differ');
  await writeFile(zh, fixtureSource({ locale: 'zh-Hant', topic: 'wrong', date: '2026-10-12', body: '![Figure](/images/not-present.png)' }));
  report = await checkPublication(dir, { today: '2026-10-11' });
  for (const expected of ['bilingual topicIds differ', 'future date', 'require one primary topicId', 'missing local asset']) assert(report.errors.some(item => item.includes(expected)), expected);
  assert(report.warnings.some(item => item.includes('retained status programme-listed')));
}));
test('learning toolbar forwards existing exports, mirrors status and resumes only known question IDs', async () => {
  const bundled = await build({ entryPoints: [join(root, 'src/scripts/teaching-toolbar.ts')], bundle: true, write: false, format: 'esm', platform: 'node' });
  const { initializeTeachingToolbar } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
  const previous = { window: globalThis.window, MutationObserver: globalThis.MutationObserver, CSS: globalThis.CSS };
  let writes = 0, forwarded = 0, observed;
  globalThis.window = { localStorage: { getItem: () => JSON.stringify({ version: 1, answers: {}, last: { question: 'test-question', mode: 'study', topic: 'test' } }), setItem: () => { writes++; } } };
  globalThis.CSS = { escape: value => value };
  globalThis.MutationObserver = class { constructor(callback) { observed = callback; } observe() {} };
  try {
    const status = { textContent: '' }, original = { textContent: 'Session only; export JSON' }, resume = { href: '#fallback' }, button = { hidden: true, addEventListener: (_, handler) => button.handler = handler };
    const exportButton = { disabled: false, click: () => { forwarded++; } };
    const scope = { querySelector: selector => selector === '[data-save-status]' ? original : selector === '[data-export="json"]' ? exportButton : selector.includes('test-question') ? {} : null, addEventListener: (_, callback) => scope.progress = callback };
    const toolbar = { dataset: { kind: 'jae', locale: 'en', questionIds: 'test-question' }, closest: () => scope, querySelector: selector => selector === '[data-teaching-save-status]' ? status : selector === '[data-teaching-export]' ? button : resume };
    initializeTeachingToolbar(toolbar); assert.equal(status.textContent, original.textContent); assert.equal(resume.href, '#test-question');
    button.handler(); assert.equal(forwarded, 1); assert.equal(writes, 0, 'toolbar must not change existing learning storage');
    original.textContent = 'Saved in this browser'; observed(); assert.equal(status.textContent, original.textContent);
    scope.progress({ detail: { last: { question: 'unrecognised-question' } } }); assert.equal(resume.href, '#test-question');
  } finally { Object.assign(globalThis, previous); }
});
test('standalone mathematics toolbar exports through existing controls and honestly disables unavailable export', async () => {
  const source = await readFile(join(root, 'public/math-studio/site-toolbar.js'), 'utf8');
  const { runInNewContext } = await import('node:vm');
  let available = false, exported = 0, callback;
  const button = { disabled: true, addEventListener: (_, handler) => button.handler = handler }, status = { textContent: '' };
  const links=[{textContent:'',href:''},{textContent:'',href:''}],strong={textContent:''};
  const toolbar = { setAttribute(){},querySelectorAll:()=>links,querySelector: selector => selector === '[data-site-export]' ? button : selector==='strong'?strong:status };
  const document={documentElement:{lang:'zh-Hant'},querySelector:()=>toolbar,getElementById:()=>app};
  const original = { click: () => { exported++; } };
  const app = { querySelector: selector => selector.includes('data-g7-action') ? available ? original : null : available ? { textContent: '本機保存不可用；可繼續操作並下載紀錄。' } : null };
  runInNewContext(source, { document, MutationObserver: class { constructor(fn) { callback = fn; } observe() {} } });
  assert.equal(button.disabled, true); assert(status.textContent.includes('作答與分數限本次頁面'));
  available = true; callback(); assert.equal(button.disabled, false); assert(status.textContent.includes('本機保存不可用'));
  button.handler(); assert.equal(exported, 1);
  document.documentElement.lang='en';available=false;callback();assert.equal(button.disabled,true);assert(status.textContent.includes('session'));assert.equal(links[0].href,'/teaching/');assert.equal(strong.textContent,'English');
});
