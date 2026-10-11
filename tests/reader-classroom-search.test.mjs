import test from 'node:test';
import assert from 'node:assert/strict';
import {createClassroomSearchCatalog} from '../src/lib/classroom-search-catalog.mjs';
import {allowedSearchKinds,classifySearchUrl,entryMatchesSearch,matchCatalog,readSearchState} from '../src/lib/search-catalog.mjs';

test('classroom search exposes paired student entries and explicitly opted-in teacher references',()=>{
  for(const locale of ['en','zh-Hant']){
    const catalog=createClassroomSearchCatalog(locale);
    assert.equal(catalog.length,4);
    const state=readSearchState('');
    assert.equal(catalog.filter(entry=>entryMatchesSearch(entry,state)).length,2);
    const teacherState=readSearchState('?type=lesson');
    assert.equal(catalog.filter(entry=>entryMatchesSearch(entry,teacherState)).length,2);
    for(const entry of catalog){
      assert.equal(classifySearchUrl(entry.url),entry.kind);
      assert.equal(classifySearchUrl(entry.alternateUrl),entry.kind);
      assert.notEqual(entry.url,entry.alternateUrl);
      assert.equal(entry.url.includes('/teacher/'),entry.kind==='lesson');
    }
    assert.equal(matchCatalog('一節課活動',catalog).length,2);
  }
  assert(!allowedSearchKinds(readSearchState('')).includes('lesson'));
  assert(allowedSearchKinds(readSearchState('?questions=1')).includes('lesson'));
});
