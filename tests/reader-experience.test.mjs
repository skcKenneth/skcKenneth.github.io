import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { filterArticles, paginateArticles, readArticleQuery, writeArticleQuery, selectRelatedArticles, createWritingFeed } from '../src/data/reader-utils.mjs';
import { getTopicIds, TOPIC_IDS } from '../src/data/site-reader.mjs';
import { collections } from './helpers/reader-content.mjs';
const root = new URL('../', import.meta.url);
const fixture = (slug, topicIds, extra = {}) => ({ data: { slug, title: slug, summary: 'A readable summary & evidence.', topicIds, date: new Date('2026-10-01'), ...extra } });
test('writing filters combine normalized keyword, topic, type, year and explicit archive choice', () => {
  const items = [{ search: 'ＡＩ Evidence Guide', topicIds: ['data-ai'], type: 'Research Notes', year: 2026, archived: false }, { search: 'AI Evidence Guide', topicIds: ['data-ai'], type: 'Research Notes', year: 2026, archived: true }];
  const state = readArticleQuery('?q=ai+evidence&topic=data-ai&type=Research+Notes&year=2026&archive=0&page=2', { archive: true });
  assert.equal(filterArticles(items, state).length, 1);
  assert.equal(filterArticles(items, { ...state, archive: true }).length, 2);
  assert.deepEqual(readArticleQuery(writeArticleQuery(state), { archive: true }), state);
  assert.equal(filterArticles(items, { ...state, year: '2025' }).length, 0);
  assert.equal(filterArticles(items, { ...state, topic: 'life-environment' }).length, 0);
});
test('pagination keeps more than twenty results reachable and clamps stale URL pages', () => {
  const items = Array.from({ length: 29 }, (_, id) => ({ id }));
  assert.equal(paginateArticles(items).items.length, 12);
  assert.deepEqual(paginateArticles(items, 3).items.map(item => item.id), [24, 25, 26, 27, 28]);
  assert.equal(paginateArticles(items, 99).page, 3);
  assert.deepEqual(paginateArticles([], 99), { items: [], page: 1, pageCount: 1, total: 0 });
  assert.equal(readArticleQuery('?page=-5').page, 1);
});
test('related articles use canonical translation IDs, manual choices, shared topics then date', () => {
  const current = fixture('translated-current', ['data-ai'], { sourceSlug: 'current', relatedSlugs: ['manual'] });
  const manual = fixture('translated-manual', ['risk-decisions'], { sourceSlug: 'manual' });
  const same = fixture('same-topic', ['data-ai']);
  const older = fixture('old-topic', ['data-ai'], { date: new Date('2024-01-01') });
  const unrelated = fixture('new-unrelated', ['cities-engineering'], { date: new Date('2026-10-10') });
  const archived = fixture('archived', ['data-ai'], { archived: true });
  const draft = fixture('draft', ['data-ai'], { draft: true });
  assert.deepEqual(selectRelatedArticles(current, [current, unrelated, older, same, manual, archived, draft]).map(item => item.data.slug), ['translated-manual', 'same-topic', 'old-topic']);
});
test('RSS exposes actual localized URLs, valid escaped text and published current articles only', () => {
  const translated = fixture('actual-localized-slug', ['data-ai'], { sourceSlug: 'english-id', title: 'A < B & C' });
  const feed = createWritingFeed([translated, fixture('hidden', ['data-ai'], { draft: true }), fixture('old', ['data-ai'], { archived: true })], 'zh-Hant');
  assert.match(feed, /<title>A &lt; B &amp; C<\/title>/);
  assert.match(feed, /https:\/\/skckenneth\.github\.io\/zh\/writing\/actual-localized-slug\//);
  assert.match(feed, /<language>zh-Hant<\/language>/);
  assert.doesNotMatch(feed, /writing\/(?:hidden|old)\//);
  assert.equal((feed.match(/<item>/g) || []).length, 1);
});
test('article reader preserves semantic figures and offers keyboard native figure controls', () => {
  const component = readFileSync(new URL('src/components/ArticleReader.astro', root), 'utf8');
  assert.match(component, /<dialog/);
  assert.match(component, /dialog\.showModal\(\)/);
  assert.match(component, /trigger\?\.focus/);
  assert.match(component, /publicRepositoryUrl/);
  assert.match(component, /data-pagefind-ignore/);
  assert.match(component, /relatedSlugs|selectRelatedArticles/);
  assert.match(component, /headings\.filter/);
});

if (process.argv.includes('--built')) {
  const read = path => readFileSync(new URL(`dist/${path}`, root), 'utf8');
  test('built writing lists expose one URL-compatible archive switch and old archive URLs are aliases', () => {
    for (const prefix of ['', 'zh/']) {
      const html = read(`${prefix}writing/index.html`);
      for (const field of ['q', 'topic', 'type', 'year', 'archive']) assert.ok(html.includes(`name="${field}"`), field);
      assert.match(html, /data-default-archive="false"/);
      assert.match(html, /data-archive-notice/);
      assert.doesNotMatch(html, /href="\/(?:zh\/)?writing\/archive\//);
      const alias = read(`${prefix}writing/archive/index.html`);
      assert.ok(alias.includes(`data-destination="/${prefix}writing/?archive=1"`));
      assert.match(alias, /name="robots" content="noindex,follow"/);
      assert.doesNotMatch(alias, /data-article-card/);
      assert.ok((html.match(/data-article-card/g) || []).length > 20);
      assert.ok(html.includes(`href="/${prefix}rss.xml"`));
    }
  });
  test('topics contain every real research programme and former research indexes point to the shared section', () => {
    for (const [prefix, name] of [['', 'research'], ['zh/', 'researchZh']]) {
      const html = read(`${prefix}topics/index.html`);
      assert.match(html, /id="research-programmes"/);
      for (const entry of collections[name].filter(entry => !entry.data.draft)) {
        assert.ok(html.includes(`href="/${prefix}research/${entry.data.slug}/"`), entry.data.slug);
        assert.ok(read(`${prefix}research/${entry.data.slug}/index.html`).includes(entry.data.title));
      }
      assert.ok(html.indexOf('reader-topics-grid') < html.indexOf('id="research-programmes"'));
      const alias = read(`${prefix}research/index.html`);
      assert.ok(alias.includes(`data-destination="/${prefix}topics/#research-programmes"`));
      assert.match(alias, /name="robots" content="noindex,follow"/);
    }
  });
  test('built search catalogs use the canonical JAE studio and omit the nonexistent archive landing', () => {
    for (const prefix of ['', 'zh/']) {
      const html = read(`${prefix}search/index.html`);
      const encoded = html.match(/data-catalog="([^"]+)"/)[1];
      const catalog = JSON.parse(encoded.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'));
      assert.equal(catalog.some(entry => entry.id === 'legacy-archive'), false);
      const studio = catalog.find(entry => entry.url === `/${prefix}teaching/senior-math/studios/jae/`);
      assert.ok(studio);
      for (const alias of ['jae-math', 'Macao JAE Mathematics Studio', '澳門四校聯考數學研習室']) assert.ok(studio.aliases.includes(alias));
      assert.equal(catalog.some(entry => entry.url === `/${prefix}teaching/jae-math/`), false);
      const studioHtml = read(`${prefix}teaching/senior-math/studios/jae/index.html`);
      const breadcrumbs = studioHtml.match(/<nav class="breadcrumbs container"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
      assert.ok(breadcrumbs);
      assert.deepEqual([...breadcrumbs.matchAll(/href="([^"]+)"/g)].map(match => match[1]), [`/${prefix}`, `/${prefix}teaching/`, `/${prefix}teaching/senior-math/`]);
    }
  });
  test('all eight topics have bilingual article-first landing pages and valid detail links', () => {
    for (const prefix of ['', 'zh/']) for (const id of TOPIC_IDS) {
      const html = read(`${prefix}topics/${id}/index.html`);
      assert.ok(html.includes(`href="/${prefix}writing/?topic=${id}"`));
      assert.ok(html.includes(`href="/${prefix}topics/"`));
      const articlesAt = html.indexOf('reader-card-grid');
      const researchAt = html.indexOf('reader-topic-research');
      if (articlesAt >= 0 && researchAt >= 0) assert.ok(articlesAt < researchAt);
    }
  });
  test('every related project remains reachable from its topic, including overflow lists', () => {
    for (const [prefix, directory] of [['', 'projects'], ['zh/', 'projects-zh']]) {
      for (const file of readdirSync(new URL(`src/content/${directory}/`, root)).filter(file => /\.mdx?$/.test(file))) {
        const markdown = readFileSync(new URL(`src/content/${directory}/${file}`, root), 'utf8').replace(/\r\n/g, '\n');
        const frontmatter = markdown.split('\n---\n')[0];
        if (/^draft:\s*true\s*$/m.test(frontmatter)) continue;
        const slug = frontmatter.match(/^slug:\s*(.+)$/m)?.[1]?.trim();
        assert.ok(slug, file);
        const sourceSlug = frontmatter.match(/^sourceSlug:\s*(.+)$/m)?.[1]?.trim();
        const explicit = frontmatter.match(/^topicIds:\s*\[([^\]]+)\]/m)?.[1]?.split(',').map(topic => topic.trim());
        for (const topic of getTopicIds({ slug, sourceSlug, topicIds: explicit })) {
          const html = read(`${prefix}topics/${topic}/index.html`);
          assert.ok(html.includes(`href="/${prefix}projects/${slug}/"`), `${prefix}${file} missing from ${topic}`);
        }
      }
    }
  });
  test('built long articles retain headings and figures with usable table-of-contents targets', () => {
    for (const prefix of ['', 'zh/']) {
      const html = read(`${prefix}writing/did-the-hotspot-move-or-did-it-grow/index.html`);
      const links = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]).filter(id => id !== 'main');
      assert.ok(links.length > 3);
      for (const id of links) assert.ok(html.includes(`id="${id}"`), id);
      assert.match(html, /class="prose reader-prose"/);
      assert.match(html, /data-article-id="did-the-hotspot-move-or-did-it-grow"/);
      assert.equal((html.match(/<figcaption>/g) || []).length, 8);
      assert.match(html, /mailto:sokkincheng@gmail\.com\?subject=/);
      assert.match(html, /<dialog class="reader-image-dialog"/);
    }
  });
  test('RSS files are emitted with localized canonical URLs and no draft or archive entries', () => {
    for (const prefix of ['', 'zh/']) {
      const xml = read(`${prefix}rss.xml`);
      assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
      assert.ok(xml.includes(`https://skckenneth.github.io/${prefix}/writing/`.replace('//writing', '/writing')));
      assert.match(xml, /<item><title>/);
      assert.doesNotMatch(xml, /writing\/legacy-archive\//);
    }
  });
}
