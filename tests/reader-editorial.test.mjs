import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { articleType, canonicalId, getTopicIds, TOPIC_IDS } from '../src/data/site-reader.mjs';
import { collections } from './helpers/reader-content.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const normalize = text => text.replace(/\s+/g, ' ').trim();
const decode = text => text.replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
  .replace(/&#x([\da-f]+);/gi, (_, number) => String.fromCodePoint(parseInt(number, 16)))
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textContent = html => normalize(decode(html.replace(/<[^>]+>/g, ' ')));
function attributes(html) {
  return Object.fromEntries([...html.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map(([, name, value]) => [name, decode(value || '')]));
}
function cards(html) {
  return [...html.matchAll(/<article\b([^>]*class="[^"]*\breader-card\b[^"]*"[^>]*)>([\s\S]*?)<\/article>/g)].map(([, opening, body]) => ({ attributes: attributes(opening), body }));
}
function assertCompleteCard(card, entry, prefix, level) {
  assert.ok(card, entry.data.slug);
  const title = card.body.match(new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`))?.[1];
  assert.equal(textContent(title || ''), normalize(entry.data.title), `full title: ${entry.data.slug}`);
  assert.ok(title.includes(`href="/${prefix}writing/${entry.data.slug}/"`));
  const summary = card.body.match(/<p class="reader-card-summary"[^>]*>([\s\S]*?)<\/p>/)?.[1];
  assert.equal(textContent(summary || ''), normalize(entry.data.summary), `full summary: ${entry.data.slug}`);
  assert.ok(textContent(card.body).includes(articleType(entry.data.type, prefix ? 'zh-Hant' : 'en')));
  assert.match(card.body, /class="reader-card-meta"/);
  if (entry.data.date) assert.ok(card.body.includes(`datetime="${new Date(entry.data.date).toISOString().slice(0, 10)}"`));
}

test('eight topic illustrations share a small, self-contained SVG format and a consistent palette', () => {
  const directory = new URL('public/images/topics/', root);
  assert.deepEqual(readdirSync(directory).sort(), TOPIC_IDS.map(id => `${id}.svg`).sort());
  const unique = new Set();
  for (const id of TOPIC_IDS) {
    const source = read(`public/images/topics/${id}.svg`);
    assert.match(source, /^<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(source, /width="96" height="96" viewBox="0 0 96 96"/);
    assert.match(source, /stroke="#1f6652" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/);
    assert.match(source, /<\/svg>\s*$/);
    assert.doesNotMatch(source, /<(?:script|foreignObject|text|image|linearGradient|radialGradient)\b|\son\w+=|\s(?:href|xlink:href)=/i);
    for (const color of source.match(/#[\da-f]{6}/gi) || []) assert.ok(['#1f6652', '#f5f3ed', '#cdddc9', '#b87950'].includes(color), color);
    assert.ok(Buffer.byteLength(source) < 1200, id);
    unique.add(source);
  }
  assert.equal(unique.size, 8, 'each subject has its own silhouette');
});

if (process.argv.includes('--built')) {
  const built = path => read(`dist/${path}`);
  const { getReaderMedia } = await import('../src/data/reader-media.mjs');
  test('writing list cards retain real filtering data and complete localized text after the reusable card change', () => {
    for (const [prefix, key] of [['', 'writing'], ['zh/', 'writingZh']]) {
      const entries = collections[key].filter(entry => !entry.data.draft && canonicalId(entry.data) !== 'legacy-archive');
      const output = cards(built(`${prefix}writing/index.html`));
      assert.equal(output.length, entries.length);
      for (const entry of entries) {
        const card = output.find(item => item.body.includes(`href="/${prefix}writing/${entry.data.slug}/"`));
        assertCompleteCard(card, entry, prefix, 2);
        assert.ok(Object.hasOwn(card.attributes, 'data-article-card'));
        assert.equal(card.attributes['data-topic-ids'], getTopicIds(entry.data).join(' '));
        assert.equal(card.attributes['data-type'], articleType(entry.data.type, 'en'));
        assert.equal(card.attributes['data-year'], entry.data.date ? String(new Date(entry.data.date).getFullYear()) : '');
        assert.equal(card.attributes['data-archived'], String(Boolean(entry.data.archived)));
        assert.ok(card.attributes['data-search'].includes(entry.data.title));
        assert.ok(card.attributes['data-search'].includes(entry.data.summary));
        assert.doesNotMatch(card.attributes.class, /editorial-card--/);
        assert.doesNotMatch(card.body, /<img\b/);
      }
    }
  });
  test('home editorial variants show full titles, summaries and the registered cover or a guaranteed brand fallback', () => {
    for (const [prefix, key, locale] of [['', 'writing', 'en'], ['zh/', 'writingZh', 'zh-Hant']]) {
      const output = cards(built(`${prefix}index.html`));
      const featured = output.filter(card => card.attributes.class.includes('editorial-card--feature'));
      const compact = output.filter(card => card.attributes.class.includes('editorial-card--compact'));
      assert.ok(featured.length >= 1);
      assert.ok(compact.length >= 2);
      for (const card of [...featured, ...compact]) {
        const entry = collections[key].find(item => card.body.includes(`href="/${prefix}writing/${item.data.slug}/"`));
        assert.ok(entry);
        assertCompleteCard(card, entry, prefix, 3);
        if (card.attributes.class.includes('editorial-card--compact')) {
          assert.doesNotMatch(card.body, /<img\b/);
        } else {
          const image = attributes(card.body.match(/<img\b([^>]+)>/)?.[1] || '');
          const cover = getReaderMedia(canonicalId(entry.data), locale)?.cover;
          assert.equal(image.src, cover?.src || '/images/kenneth-woven-knot.svg');
          assert.equal(image.alt, '');
          assert.equal(image.width, String(cover?.width || 96));
          assert.equal(image.height, String(cover?.height || 96));
          assert.equal(image.loading, 'eager');
          assert.ok(readFileSync(new URL(`dist${image.src}`, root)).length > 0);
        }
      }
    }
  });
  test('each bilingual topic index and detail uses its decorative icon without replacing its content links', () => {
    for (const [prefix, key] of [['', 'writing'], ['zh/', 'writingZh']]) {
      const index = built(`${prefix}topics/index.html`);
      const icons = [...index.matchAll(/<img\b([^>]*src="\/images\/topics\/[^>]+)>/g)].map(match => attributes(match[1]));
      assert.equal(icons.length, 8);
      for (const id of TOPIC_IDS) {
        const icon = icons.find(item => item.src === `/images/topics/${id}.svg`);
        assert.deepEqual([icon?.alt, icon?.['aria-hidden'], icon?.width, icon?.height], ['', 'true', '64', '64']);
        const html = built(`${prefix}topics/${id}/index.html`);
        const hero = attributes(html.match(new RegExp(`<img\\b([^>]*src="/images/topics/${id}\\.svg"[^>]*)>`))?.[1] || '');
        assert.deepEqual([hero.alt, hero['aria-hidden'], hero.width, hero.height], ['', 'true', '112', '112']);
        assert.ok(html.includes(`href="/${prefix}writing/?topic=${id}"`));
        const articles = collections[key].filter(entry => !entry.data.draft && !entry.data.archived && getTopicIds(entry.data).includes(id));
        const output = cards(html);
        assert.equal(output.length, Math.min(6, articles.length));
        assert.equal(output.filter(card => card.attributes.class.includes('editorial-card--feature')).length, articles.length ? 1 : 0);
        for (const card of output) {
          const entry = articles.find(item => card.body.includes(`href="/${prefix}writing/${item.data.slug}/"`));
          assert.ok(entry);
          assertCompleteCard(card, entry, prefix, 3);
        }
      }
      const programmes = collections[prefix ? 'researchZh' : 'research'].filter(entry => !entry.data.draft);
      for (const entry of programmes) assert.ok(index.includes(`href="/${prefix}research/${entry.data.slug}/"`));
      assert.ok(index.includes('id="research-programmes"'));
    }
  });
}
