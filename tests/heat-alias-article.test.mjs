import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import katex from 'katex';
import readingTime from 'reading-time';
import { readingMinutes } from '../src/data/site-reader.mjs';
import { EDITORIAL_ARTICLE_IDS, getReaderMedia } from '../src/data/reader-media.mjs';
import { READER_GUIDES } from '../src/data/reader-guides.mjs';
import { checkResearchArticles } from '../scripts/check-research-articles.mjs';
import { validatePublishSvg } from '../scripts/science-sync-policy.mjs';

const root = new URL('../', import.meta.url);
const slug = 'when-local-precision-hides-the-wrong-source';
const assetDirectory = 'public/images/heat-sensor-global-aliasing/';
const read = path => readFileSync(new URL(path, root), 'utf8').replace(/\r\n?/g, '\n');
// A missing paired manuscript or figure is a release failure, never an automatic skip.
const editions = ['writing', 'writing-zh'].map(collection => read(`src/content/${collection}/${slug}.md`));
const projects = ['projects', 'projects-zh'].map(collection => read(`src/content/${collection}/${slug}.md`));
const field = (text, key) => text.split(/^---\s*$/m)[1].match(new RegExp('^' + key + ':\\s*["\']?([^"\'\\r\\n]+)', 'm'))?.[1]?.trim();
const body = text => text.split(/^---\s*$/m).slice(2).join('---');
const sources = text => [...text.matchAll(/<figure\b[^>]*>[\s\S]*?<img\b[^>]*src="([^"]+)"[\s\S]*?<\/figure>/g)].map(match => match[1]);
const equations = text => [...text.matchAll(/\$\$\s*([\s\S]*?)\s*\$\$/g)].map(match => match[1].replace(/\s+/g, ''));
const links = text => [...new Set([...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(match => match[1]))].sort();
const figures = Array.from({ length: 10 }, (_, i) => `fig-${String(i + 1).padStart(2, '0')}.svg`);

test('heat-source study contains ten paired accessible vector figures in a scoped readable layout', () => {
  assert.deepEqual(checkResearchArticles([slug]), []);
  assert.deepEqual(readdirSync(new URL(assetDirectory, root)).sort(), figures);
  for (const name of figures) {
    const svg = read(assetDirectory + name);
    validatePublishSvg(svg, name);
    assert.match(svg, /<title\b/); assert.match(svg, /<desc\b/);
    assert.doesNotMatch(svg, /<\s*(?:[\w.-]+:)?(?:image|script|foreignObject)\b|\son[a-z]+\s*=|javascript\s*:/i);
  }
  for (const article of editions) {
    assert.deepEqual(sources(article), figures.map(name => '/images/heat-sensor-global-aliasing/' + name));
    assert.equal((article.match(/class="article-figure heat-alias-figure"/g) || []).length, 10);
  }
  assert.match(read('src/styles/global.css'), /figure\.heat-alias-figure img \{ max-width:480px;/);
});

test('heat-source bilingual metadata equations references and computed reading times agree', () => {
  assert.equal(field(editions[0], 'title'), 'When Local Precision Hides the Wrong Heat Source');
  assert.equal(field(editions[1], 'title'), '局部很精準，為甚麼仍會找錯熱源？');
  const publicationDate = field(editions[0], 'date');
  assert.match(publicationDate, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
  for (const text of [...editions, ...projects]) {
    assert.equal(field(text, 'slug'), slug); assert.equal(field(text, 'draft'), 'false');
    assert.equal(field(text, 'date'), publicationDate); assert.equal(field(text, 'lastUpdated'), publicationDate);
    assert.equal(field(text, 'heroImage'), '/images/heat-sensor-global-aliasing/fig-01.svg');
    assert.doesNotMatch(text, /^readingMinutes:/m);
    assert.doesNotMatch(text, /RESULT_PENDING|VERIFIED_RESULT_SLOT|CITATION NEEDED|FIGURE-PENDING|[\u0000-\u0009\u000b\u000c\u000e-\u001f]/);
  }
  for (const text of [editions[1], projects[1]]) assert.equal(field(text, 'sourceSlug'), slug);
  assert.ok(equations(editions[0]).length >= 8);
  assert.deepEqual(equations(editions[0]), equations(editions[1]));
  assert.deepEqual(links(editions[0]), links(editions[1]));
  assert.ok(links(editions[0]).length >= 8);
  for (const article of editions) for (const source of ['1310.5559', '1309.4652', '2504.19233', '2509.19679', '2603.09248']) assert.ok(article.includes(source), source);
  const en = readingTime(body(editions[0])).minutes;
  const zhBody = body(editions[1]);
  const zh = (zhBody.match(/\p{Script=Han}/gu) || []).length / 450 + (zhBody.match(/\b[A-Za-z][A-Za-z'-]*\b/g) || []).length / 220;
  for (const [locale, minutes] of [['EN', en], ['ZH', zh]]) assert.ok(minutes >= 22 && minutes <= 30, `${locale} raw reading time ${minutes}`);
  for (const [i, locale] of ['en', 'zh-Hant'].entries()) {
    const minutes = readingMinutes({ data: {}, body: body(editions[i]) }, locale);
    assert.ok(minutes >= 22 && minutes <= 30, `${locale} rendered reading time ${minutes}`);
  }
});

test('heat-source inline and display mathematics parse without unsafe KaTeX', () => {
  for (const article of editions) {
    const display = /^\$\$\s*\n([\s\S]*?)\n\$\$/gm;
    for (const line of article.split('\n')) if (line.includes('$$')) assert.equal(line.trim(), '$$');
    for (const match of article.matchAll(display)) katex.renderToString(match[1], { throwOnError: true, trust: false });
    const prose = article.replace(display, '');
    for (const line of prose.split('\n')) assert.equal((line.match(/\$/g) || []).length % 2, 0);
    for (const match of prose.matchAll(/\$([^$\n]+)\$/g)) katex.renderToString(match[1], { throwOnError: true, trust: false });
  }
});

test('heat-source project links stay reciprocal without private catalogue or technical-footer leakage', () => {
  for (const [i, prefix] of ['', '/zh'].entries()) {
    assert.ok(editions[i].includes(`](${prefix}/projects/${slug}/)`));
    assert.ok(projects[i].includes(`](${prefix}/writing/${slug}/)`));
    assert.equal(field(projects[i], 'status'), 'Reproducible study'); assert.equal(field(projects[i], 'featured'), 'true');
    for (const flag of ['codeAvailable', 'dataAvailable', 'studentSuitable']) assert.equal(field(projects[i], flag), 'false');
    assert.doesNotMatch(projects[i], /^repositoryUrl:|^technicalUrl:|^paperUrl:|^teachingUrl:/m);
  }
  // Require a directory component: the valid TeX fragment "\Theta:\|" is not a drive path.
  for (const text of [...editions, ...projects]) assert.doesNotMatch(text, /[a-f0-9]{40,}|\.venv|ScienceProject|PowerShell|Technical record|Exact reproduction boundary|Claims that remain blocked|The evidence boundary at a glance|\x60{3}|(?:\b[A-Za-z]:[\\/][^<>\s{},;:|]+[\\/]|file:\/\/)/i);
  assert.ok(!JSON.parse(read('src/data/generated/science-projects.json')).some(entry => ['heat-sensor-global-aliasing', slug].includes(entry.slug)));
});

test('heat-source explanation preserves matched budgets and distinct inference questions', () => {
  for (const article of editions) {
    for (const value of ['1,925', '61,440', '64', '32', '0.025', '0.05', '0.1', '0.2', '0.7', '1.3', '0.04', '0.06']) assert.ok(article.includes(value), value);
    for (const method of ['D-opt', 'E-opt', 'extended-E', 'maximin']) assert.ok(article.includes(method), method);
    assert.ok(article.includes('Clopper') && article.includes('Sobol'));
    assert.match(article, /unresolved/);
  }
  assert.match(editions[0], /fixed.{0,30}(?:known|specified).{0,30}(?:mean|hypoth)/i);
  assert.match(editions[0], /not.{0,40}(?:global uniqueness|global identifiability|injectivity)/i);
  assert.match(editions[0], /(?:not|no).{0,40}(?:new theorem|novel|new method|new optimal-design principle)/i);
  assert.match(editions[1], /固定|指定/); assert.match(editions[1], /全局唯一|全局識別|單射/);
});

test('heat-source editorial art uses Burgundy and separate alternative-source panels', () => {
  assert.ok(EDITORIAL_ARTICLE_IDS.includes(slug));
  assert.ok(READER_GUIDES[slug].en && READER_GUIDES[slug]['zh-Hant']);
  const manifest = JSON.parse(read('public/images/reader-media-manifest.json'));
  const record = manifest.editorial[slug]; assert.ok(record);
  const svg = read('public/' + record.coverSvg);
  assert.match(svg, /Two alternative source hypotheses.*separate panels/);
  assert.match(svg, /not two simultaneous sources/);
  assert.match(svg, /#7A1E3A/); assert.doesNotMatch(svg, /#1f6652|#a96d46/);
  assert.doesNotMatch(svg, /<(?:image|text|linearGradient|radialGradient)\b/i);
  for (const locale of ['en', 'zh-Hant']) {
    const media = getReaderMedia(slug, locale); assert.ok(media);
    assert.equal(media.cover.src, `/images/reader-covers/${slug}.webp`);
    assert.equal(media.share.src, `/images/reader-shares/${slug}-${locale}.png`);
  }
});

if (process.argv.includes('--built')) test('built heat-source pages preserve figures mathematics localization and discovery', () => {
  for (const [i, prefix] of ['', 'zh/'].entries()) {
    const article = read(`dist/${prefix}writing/${slug}/index.html`);
    assert.equal((article.match(/<figcaption>/g) || []).length, 10);
    assert.equal((article.match(/class="katex-display"/g) || []).length, equations(editions[i]).length);
    assert.doesNotMatch(article, /katex-error|Draft preview|草稿預覽|RESULT_PENDING/);
    for (const src of sources(editions[i])) assert.ok(article.includes(src));
    const project = read(`dist/${prefix}projects/${slug}/index.html`);
    assert.match(project, /class="heat-alias-figure"/);
    assert.doesNotMatch(project, /Technical record|private technical workspace|技術紀錄|私人技術工作區/);
    assert.ok(project.includes(`/${prefix}writing/${slug}/`));
    assert.ok(article.includes(`/${prefix}projects/${slug}/`));
    for (const section of ['writing', 'projects']) assert.ok(read(`dist/${prefix}${section}/index.html`).includes(slug));
  }
  const sitemap = read('dist/sitemap-0.xml');
  for (const prefix of ['', 'zh/']) for (const section of ['writing', 'projects']) assert.ok(sitemap.includes(`https://skckenneth.github.io/${prefix}${section}/${slug}/`));
});
