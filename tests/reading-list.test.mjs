import test from 'node:test';
import assert from 'node:assert/strict';
import {READING_STORAGE_KEY,emptyReadingState,parseReadingState,mergeReadingStates,setReadingArticle,savedReadingArticles,exportReadingList,importReadingList} from '../src/lib/reading-list.mjs';
test('Reading references use a separate versioned key and canonical IDs without stored URLs',()=>{
  assert.equal(READING_STORAGE_KEY,'kenneth-reading-list:v1');
  const state=setReadingArticle(emptyReadingState(),'shared-source',true,100,'tab-a');
  assert.deepEqual(savedReadingArticles(parseReadingState(JSON.stringify(state))).map(item=>item.id),['shared-source']);
  assert.equal(JSON.stringify(state).includes('url'),false);
  assert.deepEqual(parseReadingState('{broken'),emptyReadingState());
  assert.deepEqual(parseReadingState('{"version":2,"records":[]}'),emptyReadingState());
});
test('Concurrent saves merge in either order, and a newer removal cannot resurrect from stale tabs',()=>{
  const a=setReadingArticle(emptyReadingState(),'article-a',true,100,'tab-a'),b=setReadingArticle(emptyReadingState(),'article-b',true,100,'tab-b');
  const merged=mergeReadingStates(a,b);assert.deepEqual(mergeReadingStates(b,a),merged);
  assert.equal(savedReadingArticles(merged).length,2);
  const removed=setReadingArticle(merged,'article-a',false,101,'tab-a');
  assert.deepEqual(savedReadingArticles(mergeReadingStates(a,b,removed)).map(item=>item.id),['article-b']);
  assert.deepEqual(mergeReadingStates(merged,merged),merged);
});
test('Equal-time removal wins deterministically and local operations advance past existing revisions',()=>{
  const saved={records:[{id:'article-a',saved:true,at:100,actor:'z'}]},removed={records:[{id:'article-a',saved:false,at:100,actor:'a'}]};
  assert.equal(mergeReadingStates(saved,removed).records[0].saved,false);
  assert.deepEqual(mergeReadingStates(saved,removed),mergeReadingStates(removed,saved));
  assert.equal(setReadingArticle(mergeReadingStates(saved),'article-a',false,90,'a').records[0].at,101);
});
test('Export/import preserves canonical references, merges existing items and reports unavailable articles',()=>{
  const source=setReadingArticle(emptyReadingState(),'article-a',true,100,'a');
  const target=setReadingArticle(emptyReadingState(),'article-b',true,110,'b');
  const result=importReadingList(exportReadingList(source),target,['article-a','article-b'],200,'b');
  assert.equal(result.imported,1);assert.equal(result.skipped,0);assert.equal(savedReadingArticles(result.state).length,2);
  assert.equal(importReadingList(exportReadingList(source),target,['article-b'],200,'b').skipped,1);
});
test('Malformed imports, arbitrary URLs, prototype keys and oversized input never modify the existing list',()=>{
  const state=setReadingArticle(emptyReadingState(),'article-a',true,100,'a'),before=JSON.stringify(state);
  for(const raw of ['{}','[]','{"format":"kenneth-reading-list","version":2,"items":[]}',
    '{"format":"kenneth-reading-list","version":1,"items":[{"id":"article-a","savedAt":100,"url":"javascript:alert(1)"}]}',
    '{"format":"kenneth-reading-list","version":1,"items":[{"id":"__proto__","savedAt":100}]}',
    '{"format":"kenneth-reading-list","version":1,"items":[{"id":"article-a","savedAt":-1}]}',' '.repeat(2000001)])assert.throws(()=>importReadingList(raw,state,['article-a']));
  assert.equal(JSON.stringify(state),before);assert.equal({}.polluted,undefined);
});
