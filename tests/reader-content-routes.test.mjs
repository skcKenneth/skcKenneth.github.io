import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveContentRoute } from '../src/lib/content-routes.mjs';
import { createSearchCatalog } from '../src/lib/search-catalog.mjs';
import { canonicalId, getTopicIds } from '../src/data/site-reader.mjs';
import { collections } from './helpers/reader-content.mjs';

test('real stories and project overviews sharing a slug resolve within their own collection', () => {
  const overlaps = collections.writing.filter(story => collections.projects.some(project => project.data.slug === story.data.slug));
  assert.ok(overlaps.length > 0, 'real cross-collection collisions must be exercised');
  for (const story of overlaps) {
    const slug = story.data.slug;
    const project = collections.projects.find(entry => entry.data.slug === slug);
    assert.equal(resolveContentRoute(`/writing/${slug}/`, collections).entry, story);
    assert.equal(resolveContentRoute(`/projects/${slug}/`, collections).entry, project);
    for (const section of ['writing', 'projects']) {
      const translated = collections[`${section}Zh`].find(entry => entry.data.sourceSlug === slug);
      assert.equal(resolveContentRoute(`/zh/${section}/${translated.data.slug}/`, collections).entry, translated);
    }
  }
});
test('every real content translation is paired by canonical ID in its own collection', () => {
  for (const section of ['writing', 'projects', 'research', 'teaching']) {
    for (const entry of collections[section].filter(entry => !entry.data.draft)) {
      const translated = collections[`${section}Zh`].find(item => canonicalId(item.data) === canonicalId(entry.data) && !item.data.draft);
      assert.ok(translated, `${section}/${entry.data.slug}`);
      assert.equal(resolveContentRoute(`/${section}/${entry.data.slug}/`, collections).alternatePath, `/zh/${section}/${translated.data.slug}/`);
      assert.equal(resolveContentRoute(`/zh/${section}/${translated.data.slug}/`, collections).alternatePath, `/${section}/${entry.data.slug}/`);
    }
  }
});

test('a renamed translation pairs correctly despite a competing display slug, and deep tools do not inherit content metadata', () => {
  const project = collections.projects.find(entry => entry.data.slug === 'how-many-equilibria-did-the-optimizer-miss');
  const translated = collections.projectsZh.find(entry => entry.data.sourceSlug === project.data.slug);
  const renamed = { data: { ...translated.data, slug: 'actual-translated-overview' } };
  const wrong = { data: { ...translated.data, sourceSlug: 'different-project' } };
  const changed = { ...collections, projectsZh: [wrong, renamed] };
  assert.equal(resolveContentRoute(`/projects/${project.data.slug}/`, changed).alternatePath, '/zh/projects/actual-translated-overview/');
  assert.equal(resolveContentRoute('/zh/projects/actual-translated-overview/', changed).entry, renamed);
  assert.equal(resolveContentRoute('/teaching/senior-math/studios/jae/', changed).entry, undefined);
  assert.equal(resolveContentRoute(`/teaching/tools/${project.data.slug}/`, changed).entry, undefined);
  assert.equal(resolveContentRoute(`/projects/${project.data.slug}/`, { ...collections, projectsZh: [] }).alternatePath, undefined);
});

test('real search and reading-list catalogs omit the ungenerated archive landing while retaining every archived article', () => {
  for (const locale of ['en', 'zh-Hant']) {
    const catalog = createSearchCatalog(collections, locale, { getTopicIds });
    assert.equal(catalog.some(entry => entry.id === 'legacy-archive'), false);
    const articles = collections[locale === 'en' ? 'writing' : 'writingZh'].filter(entry => !entry.data.draft && canonicalId(entry.data) !== 'legacy-archive');
    assert.equal(catalog.filter(entry => entry.kind === 'writing').length, articles.length);
    for (const entry of articles.filter(entry => entry.data.archived)) {
      const item = catalog.find(item => item.kind === 'writing' && item.id === canonicalId(entry.data));
      assert.ok(item, entry.data.slug);
      assert.equal(item.archived, true);
      assert.equal(resolveContentRoute(item.url, collections).entry, entry);
    }
  }
});
