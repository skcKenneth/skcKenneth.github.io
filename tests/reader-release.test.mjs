import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { LIVE_ROUTES, validateLivePayload } from '../scripts/publish-summary.mjs';
import { compatibilityDestination } from '../src/lib/compatibility-redirect.mjs';
import { EDITORIAL_ARTICLE_IDS } from '../src/data/reader-media.mjs';

test('release route checks cover distinct bilingual canonical and compatibility entrances', () => {
  assert.equal(new Set(LIVE_ROUTES.map(route => route.path)).size, LIVE_ROUTES.length);
  for (const prefix of ['', '/zh']) {
    for (const path of ['/writing/archive/', '/research/', '/teaching/jae-math/']) {
      const route = LIVE_ROUTES.find(route => route.path === prefix + path);
      assert.equal(route?.kind, 'alias');
      assert.equal(compatibilityDestination(route.destination), route.destination);
    }
    assert.ok(LIVE_ROUTES.some(route => route.path === prefix + '/teaching/senior-math/studios/jae/'));
  }
  const guides = LIVE_ROUTES.filter(route => route.kind === 'article');
  assert.equal(guides.length, 2 * EDITORIAL_ARTICLE_IDS.length);
  for (const articleId of EDITORIAL_ARTICLE_IDS) {
    for (const locale of ['en', 'zh-Hant']) {
      const path = `${locale === 'zh-Hant' ? '/zh' : ''}/writing/${articleId}/`;
      const route = guides.find(candidate => candidate.path === path);
      assert.ok(route, `${articleId}: missing ${locale} article route`);
      assert.equal(route.locale, locale);
      assert.equal(route.articleId, articleId);
      assert.ok(LIVE_ROUTES.some(asset => asset.kind === 'png' && asset.path === route.sharePath), `${articleId}: missing ${locale} share route`);
      assert.ok(existsSync(new URL('../public' + route.sharePath, import.meta.url)), `${articleId}: missing ${locale} share asset`);
    }
  }
  for (const route of guides) {
    assert.ok(LIVE_ROUTES.some(asset => asset.kind === 'png' && asset.path === route.sharePath));
  }
});

if (process.argv.includes('--built')) {
  test('publication payload checks accept the actual rendered bilingual release', () => {
    for (const route of LIVE_ROUTES) {
      const relative = route.path.slice(1) + (route.path.endsWith('/') ? 'index.html' : '');
      const bytes = readFileSync(new URL('../dist/' + relative, import.meta.url));
      const contentType = ({ png: 'image/png', svg: 'image/svg+xml', rss: 'application/rss+xml' })[route.kind] || 'text/html';
      assert.deepEqual(validateLivePayload(route, { status: 200, contentType, bytes }), [], route.path);
    }
  });
}
