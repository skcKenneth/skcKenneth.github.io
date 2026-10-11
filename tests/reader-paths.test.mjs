import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { canonicalId, readingMinutes, TOPIC_IDS, SITE_URL } from '../src/data/site-reader.mjs';
import { READING_PATHS, READING_PATH_IDS, resolveReadingPath, getReadingPaths, getArticleReadingPaths } from '../src/data/reading-paths.mjs';

const root = new URL('../', import.meta.url);
const yaml = createRequire(import.meta.resolve('astro/package.json'))('yaml');
const normalize = text => text.replace(/\s+/g, ' ').trim();
const decode = text => text.replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
  .replace(/&#x([\da-f]+);/gi, (_, value) => String.fromCodePoint(parseInt(value, 16)))
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textContent = html => normalize(decode(html.replace(/<[^>]+>/g, ' ')));
const read = path => readFileSync(new URL(path, root), 'utf8');
function load(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(file => {
    const url = new URL(file.name, directory);
    if (file.isDirectory()) return load(new URL(`${file.name}/`, directory));
    if (!/\.mdx?$/.test(file.name)) return [];
    const source = readFileSync(url, 'utf8');
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    assert.ok(match, `${file.name}: frontmatter`);
    return [{ data: yaml.parse(match[1]), body: source.slice(match[0].length) }];
  });
}
const localized = [
  { locale: 'en', prefix: '', entries: load(new URL('src/content/writing/', root)) },
  { locale: 'zh-Hant', prefix: 'zh/', entries: load(new URL('src/content/writing-zh/', root)) }
];
const sequences = {
  'model-trust': ['when-the-fit-is-not-the-model', 'when-solar-power-changes-fast', 'random-stress-tests-are-not-certificates', 'two-networks-one-spectrum-different-alarms'],
  'city-models': ['when-the-timetable-lies', 'what-must-a-traffic-model-remember', 'when-a-traffic-solver-invents-a-jam', 'when-a-reduced-ventilation-model-leaves-its-training-regime']
};

test('the two curated paths use four published bilingual source IDs with three core articles and one optional extension', () => {
  assert.deepEqual(READING_PATH_IDS, ['model-trust', 'city-models']);
  for (const source of READING_PATHS) {
    assert.deepEqual(source.steps.map(step => step.articleId), sequences[source.id]);
    assert.deepEqual(source.steps.map(step => Boolean(step.optional)), [false, false, false, true]);
    assert.ok(source.topicIds.length > 0 && source.topicIds.every(id => TOPIC_IDS.includes(id)));
    for (const { locale, prefix, entries } of localized) {
      const path = resolveReadingPath(source.id, entries, locale);
      assert.ok(path, `${source.id}/${locale}`);
      assert.equal(path.title, source.title[locale]);
      assert.equal(path.description, source.description[locale]);
      assert.equal(path.href, `/${prefix}topics/routes/${source.id}/`);
      assert.equal(path.coreCount, 3);
      assert.equal(path.coreMinutes, path.steps.slice(0, 3).reduce((total, step) => total + readingMinutes(step.entry, locale), 0));
      assert.equal(path.totalMinutes, path.steps.reduce((total, step) => total + readingMinutes(step.entry, locale), 0));
      for (const step of path.steps) {
        assert.equal(entries.filter(entry => canonicalId(entry.data) === step.articleId).length, 1, 'source ID resolves unambiguously');
        assert.equal(Boolean(step.entry.data.draft || step.entry.data.archived), false);
        assert.equal(step.title, step.entry.data.title);
        assert.equal(step.href, `/${prefix}writing/${step.entry.data.slug}/`);
        for (const field of ['purpose', 'prerequisite', 'boundary']) assert.ok(step[field]?.trim(), `${step.articleId}/${locale}/${field}`);
      }
      assert.ok(path.boundary.trim());
    }
  }
});

test('localized titles, translated slugs and reading times come from content, not canonical ID or source order', () => {
  const entries = structuredClone(localized[1].entries).reverse();
  const entry = entries.find(item => canonicalId(item.data) === sequences['model-trust'][0]);
  entry.data.slug = 'a-distinct-translated-address';
  entry.data.title = '完整而不同的翻譯文章名稱';
  entry.data.readingMinutes = 37;
  const path = resolveReadingPath('model-trust', entries, 'zh-Hant');
  assert.equal(path.first.articleId, 'when-the-fit-is-not-the-model');
  assert.equal(path.first.href, '/zh/writing/a-distinct-translated-address/');
  assert.equal(path.first.title, entry.data.title);
  assert.equal(path.first.minutes, 37);
  assert.equal(path.coreMinutes, 37 + path.steps[1].minutes + path.steps[2].minutes);
  assert.deepEqual(path.steps.map(step => step.articleId), sequences['model-trust']);
  delete entry.data.readingMinutes;
  entry.body = 'word '.repeat(1100);
  assert.equal(resolveReadingPath('model-trust', entries, 'zh-Hant').first.minutes, readingMinutes(entry, 'zh-Hant'));
  assert.ok(resolveReadingPath('model-trust', entries, 'zh-Hant').first.minutes > 1);
});

test('a missing, draft or archived source removes the whole affected path, never leaves a broken or partial route', () => {
  const sourceId = sequences['model-trust'][2];
  const entries = localized[0].entries;
  assert.equal(resolveReadingPath('unknown', entries), null);
  assert.equal(resolveReadingPath('model-trust', entries, 'fr'), null);
  for (const condition of ['missing', 'draft', 'archived']) {
    const changed = structuredClone(entries).filter(entry => condition !== 'missing' || canonicalId(entry.data) !== sourceId);
    if (condition !== 'missing') changed.find(entry => canonicalId(entry.data) === sourceId).data[condition] = true;
    assert.equal(resolveReadingPath('model-trust', changed), null, condition);
    assert.deepEqual(getReadingPaths(changed).map(path => path.id), ['city-models']);
    assert.deepEqual(getArticleReadingPaths({ slug: sourceId }, changed), []);
  }
});

test('article continuation follows curated IDs in both languages and distinguishes the optional extension from the core', () => {
  for (const { entries, locale } of localized) {
    for (const source of READING_PATHS) {
      const path = resolveReadingPath(source.id, entries, locale);
      path.steps.forEach((step, index) => {
        const contexts = getArticleReadingPaths(step.entry.data, entries, locale);
        assert.equal(contexts.length, 1);
        assert.equal(contexts[0].id, path.id);
        assert.equal(contexts[0].current.articleId, step.articleId);
        assert.equal(contexts[0].next?.articleId || null, path.steps[index + 1]?.articleId || null);
        assert.equal(contexts[0].coreFinished, index >= 2);
      });
    }
    assert.deepEqual(getArticleReadingPaths({ slug: 'an-unrelated-article' }, entries, locale), []);
  }
});

if (process.argv.includes('--built')) {
  const built = path => read(`dist/${path}`);
  function assertMetadata(html, route, alternate, locale, title) {
    assert.ok(html.includes(`<link rel="canonical" href="${SITE_URL}${route}"`), `canonical ${route}`);
    assert.ok(html.includes(`<link rel="alternate" hreflang="${locale}" href="${SITE_URL}${route}"`));
    assert.ok(html.includes(`<link rel="alternate" hreflang="${locale === 'en' ? 'zh-Hant' : 'en'}" href="${SITE_URL}${alternate}"`));
    assert.match(html, /data-pagefind-filter="type\[content\]" content="Reading guides"/);
    assert.match(html, /data-pagefind-filter="search-kind\[content\]" content="guide"/);
    assert.equal(textContent(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] || ''), normalize(title));
  }
  test('all six bilingual path routes publish correct canonical pairs, complete steps, actual titles and first-article links without JavaScript', () => {
    for (const { locale, prefix, entries } of localized) {
      const alternatePrefix = prefix ? '' : 'zh/';
      const index = built(`${prefix}topics/routes/index.html`);
      assertMetadata(index, `/${prefix}topics/routes/`, `/${alternatePrefix}topics/routes/`, locale, prefix ? '沿著問題，一篇接一篇。' : 'Follow a question, one article at a time.');
      assert.equal([...index.matchAll(/data-reading-path="/g)].length, 2);
      for (const path of getReadingPaths(entries, locale)) {
        assert.ok(index.includes(`href="${path.href}"`));
        assert.ok(index.includes(`data-path-first href="${path.first.href}"`));
        const html = built(`${prefix}topics/routes/${path.id}/index.html`);
        assertMetadata(html, path.href, `/${alternatePrefix}topics/routes/${path.id}/`, locale, path.title);
        assert.ok(html.includes(`data-path-first href="${path.first.href}"`));
        assert.match(html, /href="#path-steps"/);
        const steps = [...html.matchAll(/<li\b[^>]*data-path-step="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)];
        assert.deepEqual(steps.map(match => match[1]), path.steps.map(step => step.articleId));
        assert.equal([...html.matchAll(/reader-path-step--optional/g)].length, 1);
        for (let i = 0; i < steps.length; i++) {
          const step = path.steps[i];
          const body = steps[i][2];
          assert.equal(textContent(body.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/)?.[1] || ''), normalize(step.title));
          assert.ok(body.includes(`href="${step.href}"`));
          for (const value of [step.purpose, step.prerequisite, step.boundary]) assert.ok(textContent(body).includes(normalize(value)), value);
          assert.ok(textContent(body).includes(locale === 'en' ? `About ${step.minutes} min` : `約 ${step.minutes} 分鐘`));
        }
        assert.ok(textContent(html).includes(normalize(path.boundary)));
      }
    }
  });
  test('home and topics expose the real routes, concepts and direct first-article links while preserving research entry points', () => {
    for (const { prefix, entries, locale } of localized) {
      const home = built(`${prefix}index.html`);
      assert.ok(home.match(/<a class="reader-path-shortcut"[^>]*>/)?.[0].includes(`href="/${prefix}topics/routes/model-trust/"`));
      const topics = built(`${prefix}topics/index.html`);
      assert.ok(topics.includes(`href="/${prefix}concepts/"`));
      assert.ok(topics.includes(`href="/${prefix}topics/routes/"`));
      assert.ok(topics.includes('id="research-programmes"'));
      assert.equal([...topics.matchAll(/href="[^\"]*\/research\/[^\"]+\/"/g)].length, 4, 'all four programme links remain');
      for (const path of getReadingPaths(entries, locale)) {
        assert.ok(topics.includes(`href="${path.first.href}" data-path-first`));
        for (const topicId of path.topicIds) {
          const topic = built(`${prefix}topics/${topicId}/index.html`);
          const card = topic.match(new RegExp(`<article\\b[^>]*data-reading-path="${path.id}"[^>]*>([\\s\\S]*?)<\\/article>`))?.[1];
          assert.ok(card, `${topicId}/${path.id}`);
          assert.ok(card.includes(`href="${path.href}"`));
          assert.ok(card.includes(`href="${path.first.href}" data-path-first`));
        }
      }
    }
  });
  test('all sixteen source article pages render the localized path and next step outside the Pagefind excerpt', () => {
    for (const { locale, prefix, entries } of localized) {
      for (const path of getReadingPaths(entries, locale)) {
        path.steps.forEach((step, index) => {
          const html = built(`${prefix}writing/${step.entry.data.slug}/index.html`);
          const nav = html.match(/<nav\b[^>]*class="reader-article-paths"[^>]*>([\s\S]*?)<\/nav>/)?.[0];
          assert.ok(nav, `${locale}/${step.articleId}`);
          assert.ok(nav.match(/^<nav[^>]*>/)[0].includes('data-pagefind-ignore'));
          assert.ok(nav.includes(`data-article-path="${path.id}"`));
          assert.ok(nav.includes(`href="${path.href}"`));
          const next = path.steps[index + 1];
          if (next) {
            assert.ok(nav.includes(`data-path-next href="${next.href}"`));
            assert.ok(textContent(nav).includes(normalize(next.title)));
          } else assert.doesNotMatch(nav, /data-path-next/);
        });
      }
    }
  });
}
