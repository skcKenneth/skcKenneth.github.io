import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { LIVE_ROUTES, READER_NOTE_IDS, validateLivePayload, groupChanges, createPublishSummary, verifyLiveSite } from '../scripts/publish-summary.mjs';
import {ALL_CLASSROOM_PACKS} from '../src/data/classroom-packs.mjs';
import { EDITORIAL_ARTICLE_IDS } from '../src/data/reader-media.mjs';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
function payload(spec) {
  if (spec.kind === 'png') return { contentType: 'image/png', bytes: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]) };
  if (spec.kind === 'svg') return { contentType: 'image/svg+xml', bytes: Buffer.from('<svg viewBox="0 0 1 1"></svg>') };
  if (spec.kind === 'rss') return { contentType: 'application/rss+xml', bytes: Buffer.from(`<rss version="2.0"><channel><language>${spec.locale}</language>${READER_NOTE_IDS.map(id=>`<item>/${spec.locale==='en'?'':'zh/'}writing/${id}/</item>`).join('')}</channel></rss>`) };
  if (spec.kind === 'alias') return { contentType: 'text/html', bytes: Buffer.from(`<html lang="${spec.locale}" data-pagefind-ignore="all"><meta name="robots" content="noindex,follow"><noscript><meta http-equiv="refresh" content="0; url=${spec.destination}"></noscript><main data-compatibility-redirect data-destination="${spec.destination}"></main></html>`) };
  if (spec.kind === 'article') return { contentType: 'text/html', bytes: Buffer.from(`<html lang="${spec.locale}"><img src="/images/kenneth-woven-knot.svg"/><meta property="og:image" content="https://skckenneth.github.io${spec.sharePath}"/><section data-reader-guide="${spec.articleId}"><p data-reader-guide-question>Question</p></section><article data-article-reader></article><section data-reading-position></section><button data-reader-print></button></html>`) };
  if (spec.kind === 'guide') return {contentType: 'text/html', bytes: Buffer.from(`<html lang="${spec.locale}"><img src="/images/kenneth-woven-knot.svg"/><meta data-pagefind-filter="search-kind[content]" content="guide"/><link rel="canonical" href="https://skckenneth.github.io${spec.path}"/><link rel="alternate" hreflang="${spec.locale === 'en' ? 'zh-Hant' : 'en'}" href="https://skckenneth.github.io${spec.alternatePath}"/><h1>Guide</h1></html>`)};
  if (['note','about','classroomIndex','classroomStudent','classroomTeacher'].includes(spec.kind)) {
    const kind=spec.kind==='note'?'writing':spec.kind==='classroomTeacher'?'lesson':spec.kind.startsWith('classroom')?'teaching':'other';
    const markers={note:`data-article-reader data-reading-position data-reader-print data-article-id="${spec.articleId}"`,about:'data-about-editorial id="writing-approach"',classroomIndex:'data-classroom-index',classroomStudent:`data-classroom-pack="${spec.packId}"`,classroomTeacher:`data-classroom-teacher="${spec.packId}"`};
    return {contentType:'text/html',bytes:Buffer.from(`<html lang="${spec.locale}"><img src="/images/kenneth-woven-knot.svg"/><meta data-pagefind-filter="search-kind[content]" content="${kind}"/><link rel="canonical" href="https://skckenneth.github.io${spec.path}"/><link rel="alternate" hreflang="${spec.locale==='en'?'zh-Hant':'en'}" href="https://skckenneth.github.io${spec.alternatePath}"/><main ${markers[spec.kind]}></main></html>`)};
  }
  const markers = { home: 'reader-home-hero id="latest-writing" id="start-here"', writing: 'data-writing-index reader-pagination', topics: 'reader-topics-grid mathematical-thinking teaching-research-practice id="research-programmes"', teaching: 'data-teaching-directory data-teaching-filters id="math-inquiry-lab"', search: 'data-site-search data-search-pagination name="technical"', studio: 'id="jae-topics" id="quadratics" id="trigonometry" id="past-papers"', models: 'id="model-index" data-catalog-kind="model" data-model-library' };
  return { contentType: 'text/html', bytes: Buffer.from(`<html lang="${spec.locale}"><img src="/images/kenneth-woven-knot.svg"/>${markers[spec.kind]}</html>`) };
}
test('live route validation rejects old markup, wrong language, invalid formats and changed asset hashes', () => {
  for (const spec of LIVE_ROUTES) assert.deepEqual(validateLivePayload(spec, { status: 200, ...payload(spec) }), []);
  const enHome = LIVE_ROUTES.find(spec => spec.path === '/');
  assert(validateLivePayload(enHome, { status: 200, contentType: 'text/html', bytes: Buffer.from('<html lang="zh-Hant">old home</html>') }).length > 1);
  assert.deepEqual(validateLivePayload(enHome, { status: 404, ...payload(enHome) }), ['HTTP 404']);
  const png = LIVE_ROUTES.find(spec => spec.kind === 'png');
  assert(validateLivePayload(png, { status: 200, contentType: 'text/html', bytes: Buffer.from('404 page') }, 'abc').some(error => error.includes('SHA-256')));
  assert(validateLivePayload(png, { status: 200, ...payload(png) }, sha256(payload(png).bytes)).length === 0);
  const article = LIVE_ROUTES.find(spec => spec.kind === 'article');
  const paired = payload(article);
  const wrongGuide = Buffer.from(paired.bytes.toString().replace(`data-reader-guide="${article.articleId}"`, 'data-reader-guide="different-article"'));
  assert(validateLivePayload(article, { status: 200, ...paired, bytes: wrongGuide }).includes('Missing paired reading guide'));
  const wrongShare = Buffer.from(paired.bytes.toString().replace(article.sharePath, '/images/og-reader.png'));
  assert(validateLivePayload(article, { status: 200, ...paired, bytes: wrongShare }).includes('Missing article sharing image'));
});

test('publication checks all 24 new paired guide routes and rejects incorrect counterparts', () => {
  const guides = LIVE_ROUTES.filter(spec => spec.kind === 'guide');
  assert.equal(guides.length, 24);
  assert.equal(new Set(LIVE_ROUTES.map(spec => spec.path)).size, LIVE_ROUTES.length);
  for (const spec of guides) {
    const fixture = payload(spec);
    const wrongCanonical = Buffer.from(fixture.bytes.toString().replace(`rel="canonical" href="https://skckenneth.github.io${spec.path}"`, 'rel="canonical" href="https://skckenneth.github.io/"'));
    assert(validateLivePayload(spec, {status:200,...fixture,bytes:wrongCanonical}).includes('Incorrect guide canonical URL'));
    const other = spec.locale === 'en' ? 'zh-Hant' : 'en';
    const wrongPair = Buffer.from(fixture.bytes.toString().replace(`rel="alternate" hreflang="${other}" href="https://skckenneth.github.io${spec.alternatePath}"`, `rel="alternate" hreflang="${other}" href="https://skckenneth.github.io/wrong-guide/"`));
    assert(validateLivePayload(spec, {status:200,...fixture,bytes:wrongPair}).includes('Incorrect guide language counterpart'));
  }
});
test('release requires paired notes, about updates, distinct classroom audiences and RSS discovery', () => {
  const additions=LIVE_ROUTES.filter(spec=>['note','about','classroomIndex','classroomStudent','classroomTeacher'].includes(spec.kind));
  assert.equal(additions.length,14+4*ALL_CLASSROOM_PACKS.length);
  assert.equal(LIVE_ROUTES.length,62+4*EDITORIAL_ARTICLE_IDS.length+4*ALL_CLASSROOM_PACKS.length);
  for(const spec of additions){
    const fixture=payload(spec);
    const wrongPair=Buffer.from(fixture.bytes.toString().replace(`href="https://skckenneth.github.io${spec.alternatePath}"`,'href="https://skckenneth.github.io/wrong/"'));
    assert(validateLivePayload(spec,{status:200,...fixture,bytes:wrongPair}).includes('Incorrect content language counterpart'));
  }
  const teacher=additions.find(spec=>spec.kind==='classroomTeacher'),fixture=payload(teacher);
  const wrongKind=Buffer.from(fixture.bytes.toString().replace('content="lesson"','content="teaching"'));
  assert(validateLivePayload(teacher,{status:200,...fixture,bytes:wrongKind}).includes('Incorrect content search classification'));
  const rss=LIVE_ROUTES.find(spec=>spec.kind==='rss'),feed=payload(rss);
  assert(validateLivePayload(rss,{status:200,...feed,bytes:Buffer.from(feed.bytes.toString().replace(READER_NOTE_IDS[0],'missing'))}).some(error=>error.includes('Missing new note')));
});

test('publication report uses actual diff groups and does not invent deployment or manual verification', () => {
  const files = ['src/components/TeachingDirectory.astro', 'src/components/HomePage.astro', 'scripts/content-new.mjs', 'src/pages/rss.xml.ts'];
  assert.equal(groupChanges(files).reduce((total, group) => total + group.files.length, 0), files.length);
  const draft = createPublishSummary({ sha: 'abc123', files, workflowVerified: false });
  assert(draft.includes('實際變更 4 個檔案')); assert(draft.includes('不聲稱已完成發布')); assert(draft.includes('沒有執行線上驗證')); assert(draft.includes('沒有代替實際瀏覽器操作'));
  const released = createPublishSummary({ sha: 'abc123', base: 'previous', files, workflowVerified: true, live: [{ path: '/', ok: true }, { path: '/rss.xml', ok: false, errors: ['HTTP 404'] }] });
  assert(released.includes('已完成本次建置及 Pages 部署')); assert(released.includes('✗ `/rss.xml`：HTTP 404')); assert(released.includes('src/components/HomePage.astro'));
});
test('CDN retry checks only failed routes and verifies both asset hashes within a bounded attempt count', async () => {
  const calls = new Map(), expectedHashes = {};
  for (const spec of LIVE_ROUTES.filter(spec => ['png', 'svg'].includes(spec.kind))) expectedHashes[spec.path] = sha256(payload(spec).bytes);
  const fetcher = async url => {
    const spec = LIVE_ROUTES.find(route => route.path === url.pathname); const count = (calls.get(spec.path) || 0) + 1; calls.set(spec.path, count);
    const body = payload(spec);
    return { status: spec.path === '/zh/topics/' && count === 1 ? 404 : 200, headers: { get: () => body.contentType }, arrayBuffer: async () => body.bytes };
  };
  const result = await verifyLiveSite('https://skckenneth.github.io/', { fetcher, expectedHashes, retryDelayMs: 1, timeoutMs: 2000 });
  assert.equal(result.length, LIVE_ROUTES.length); assert(result.every(item => item.ok)); assert.equal(calls.get('/zh/topics/'), 2); assert.equal(calls.get('/'), 1);
  await assert.rejects(verifyLiveSite('https://unrelated.example/', { fetcher }), /configured/);
});
