import test from 'node:test';
import assert from 'node:assert/strict';
import { createReaderGuideCatalog } from '../src/lib/reader-guide-catalog.mjs';
import { matchCatalog, entryMatchesSearch, classifySearchUrl } from '../src/lib/search-catalog.mjs';

test('both languages discover the same ten named guides by their paired titles and aliases', () => {
  for (const locale of ['en', 'zh-Hant']) {
    const catalog = createReaderGuideCatalog(locale);
    assert.equal(catalog.length, 10);
    assert.equal(new Set(catalog.map(item => item.url)).size, 10);
    for (const item of catalog) {
      assert.equal(classifySearchUrl(item.url), 'guide');
      assert(item.title && item.excerpt && item.topicIds.length);
      assert(entryMatchesSearch(item, {type:'guide',topic:'',archive:false}));
      assert(matchCatalog(item.title, catalog).some(result => result.url === item.url));
      assert(item.alternateUrl.startsWith(locale === 'en' ? '/zh/' : '/'));
      assert.notEqual(item.alternateUrl, item.url);
    }
    const sensitivity = catalog.find(item => item.id === 'sensitivity');
    assert(matchCatalog(locale === 'en' ? '敏感度' : 'sensitivity', catalog).some(item => item.url === sensitivity.url));
  }
});
