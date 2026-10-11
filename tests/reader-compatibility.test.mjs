import test from 'node:test';
import assert from 'node:assert/strict';
import { compatibilityDestination as resolve } from '../src/lib/compatibility-redirect.mjs';

test('archive alias preserves supported filters, page and fragment', () => {
  const target = resolve('/writing/?archive=1', '?q=模型&topic=risk-decisions&type=Essay&year=2025&page=3&destination=https://outside.invalid', '#results');
  const parsed = new URL(target, 'https://site.invalid');
  assert.equal(parsed.pathname, '/writing/');
  assert.equal(parsed.searchParams.get('archive'), '1');
  assert.equal(parsed.searchParams.get('q'), '模型');
  assert.equal(parsed.searchParams.get('topic'), 'risk-decisions');
  assert.equal(parsed.searchParams.get('type'), 'Essay');
  assert.equal(parsed.searchParams.get('year'), '2025');
  assert.equal(parsed.searchParams.get('page'), '3');
  assert.equal(parsed.hash, '#results');
  assert.equal(parsed.searchParams.has('destination'), false);
});
test('explicit archive choices override alias defaults in both languages', () => {
  for (const base of ['', '/zh']) {
    assert.equal(resolve(`${base}/writing/?archive=1`, '?archive=0'), `${base}/writing/?archive=0`);
    assert.equal(resolve(`${base}/writing/?archive=1`), `${base}/writing/?archive=1`);
  }
});
test('route aliases preserve trusted fragments and can map old lesson anchors', () => {
  assert.equal(resolve('/topics/#research-programmes'), '/topics/#research-programmes');
  assert.equal(resolve('/teaching/senior-math/', '', '#official-papers', { hashMap: { 'official-papers': 'jae-papers' } }), '/teaching/senior-math/#jae-papers');
  assert.equal(resolve('/topics/#research-programmes', '', '#unmatched', { preserveHash: false }), '/topics/#research-programmes');
  assert.equal(resolve('/writing/', '', '#constructor', { hashMap: {} }), '/writing/#constructor');
});
test('a caller may only forward parameters with matching meaning', () => {
  assert.equal(resolve('/teaching/model-laboratory/', '?stage=frontier&purpose=data&type=Essay', '', { queryKeys: ['stage', 'purpose'] }), '/teaching/model-laboratory/?stage=frontier&purpose=data');
});
test('rejects external, protocol-relative, escaped and malformed destinations', () => {
  for (const target of ['https://outside.invalid', '//outside.invalid', '/\\outside.invalid', '/\nmalformed', '/..//outside.invalid', '/.//outside.invalid', '/%2e//outside.invalid']) {
    assert.throws(() => resolve(target), TypeError);
  }
});
