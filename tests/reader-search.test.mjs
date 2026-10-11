import test from 'node:test';
import assert from 'node:assert/strict';
import {readSearchState,searchParams,allowedSearchKinds,pagefindFilters,entryMatchesSearch,paginateSearch,matchCatalog,mergeSearchResults,createSearchCatalog,classifySearchUrl} from '../src/lib/search-catalog.mjs';

test('Search URL round trips pagination, topics and explicit inclusion choices',()=>{
  const state=readSearchState('?q=%E6%95%B8%E5%AD%B8&type=writing&topic=data-ai&page=3&archive=1&questions=1&technical=1',['data-ai']);
  assert.deepEqual(readSearchState(searchParams(state),['data-ai']),state);
  assert.equal(readSearchState('?page=-8&type=bad&topic=bad').page,1);
  assert.equal(readSearchState('?page=999999999').page,100000);
  assert.equal(readSearchState('?topic=bad',['data-ai']).topic,'');
});
test('Default search excludes archive, questions and technical catalogue with official compound OR filters',()=>{
  const state=readSearchState('');
  assert.deepEqual(allowedSearchKinds(state),['writing','project','teaching']);
  assert.deepEqual(pagefindFilters(state),{'search-kind':{any:['writing','project','teaching']},archived:'false'});
  assert.equal(entryMatchesSearch({kind:'writing',archived:true,topicIds:[]},state),false);
  assert.equal(entryMatchesSearch({kind:'question',archived:false,topicIds:[]},state),false);
  assert.equal(entryMatchesSearch({kind:'lesson',archived:false,topicIds:[]},state),false);
  const advanced=readSearchState('?archive=1&questions=1&technical=1&topic=data-ai',['data-ai']);
  assert.equal(entryMatchesSearch({kind:'question',archived:false,topicIds:['data-ai']},advanced),true);
  assert.equal(entryMatchesSearch({kind:'lesson',archived:false,topicIds:['data-ai']},advanced),true);
  assert.equal(entryMatchesSearch({kind:'research',archived:false,topicIds:['other']},advanced),false);
  assert.equal(pagefindFilters(advanced).archived,undefined);
  assert.deepEqual(allowedSearchKinds(readSearchState('?type=question')),['question']);
  assert.deepEqual(allowedSearchKinds(readSearchState('?type=lesson')),['lesson']);
  assert.equal(readSearchState(searchParams(readSearchState('?type=lesson&page=2'))).type,'lesson');
});
test('Deep teaching units are opt-in lessons while studio entrances remain in default search',()=>{
  for(const base of ['','/zh']){
    for(const path of ['/teaching/senior-math/lessons/foundation-01/','/teaching/senior-math/chapters/algebra/','/teaching/senior-math/books/core/','/teaching/jae-math/lessons/quadratics/','/teaching/modeling-workshop/mixing-tank/','/teaching/mathematical-modeling-lecture-programme/lecture-01/'])assert.equal(classifySearchUrl(base+path),'lesson',path);
    for(const path of ['/teaching/senior-math/','/teaching/senior-math/studios/jae/','/teaching/jae-math/','/teaching/modeling-workshop/','/teaching/mathematical-modeling-lecture-programme/'])assert.equal(classifySearchUrl(base+path),'teaching',path);
    assert.equal(classifySearchUrl(base+'/teaching/senior-math/questions/question-01/'),'question');
    assert.equal(classifySearchUrl(base+'/teaching/senior-math/papers/jm01-2026/'),'question');
    assert.equal(classifySearchUrl(base+'/teaching/modeling-workshop/sources/'),'catalogue');
  }
});
test('Pagination exposes results beyond the old twenty-result cap and clamps stale pages',()=>{
  const entries=Array.from({length:37},(_,index)=>({url:`/writing/article-${index}/`}));
  const third=paginateSearch(entries,3);
  assert.equal(third.total,37);assert.equal(third.pages,4);assert.equal(third.entries[0].url,'/writing/article-24/');
  assert.equal(paginateSearch(entries,999).page,4);
  assert.equal(paginateSearch([],1).pages,1);
});
test('Exact titles and normalized aliases outrank substring matches; duplicate and external routes are removed',()=>{
  const entries=[{title:'Long Modeling Guide',url:'/writing/guide/',aliases:[]},{title:'Modeling',url:'/writing/modeling/',aliases:['建 模']}];
  assert.equal(matchCatalog('modeling',entries)[0].title,'Modeling');
  assert.equal(matchCatalog('建模',entries)[0].title,'Modeling');
  assert.equal(mergeSearchResults(entries,[{url:'https://skckenneth.github.io/writing/modeling'},{url:'https://evil.example/writing/guide/'}],'https://skckenneth.github.io').length,2);
});
test('Catalog pairs actual translated slugs using sourceSlug, omits drafts, and includes curated project aliases',()=>{
  const collections={writing:[{data:{slug:'original',title:'An original',summary:'A description',draft:false}},{data:{slug:'draft',title:'Draft',draft:true}}],
    writingZh:[{data:{sourceSlug:'original',slug:'different-translated-slug',title:'中文標題',summary:'中文摘要',draft:false}}],
    projects:[{data:{slug:'technical',title:'Technical project',status:'Catalogue entry'}}]};
  const catalog=createSearchCatalog(collections,'en',{getTopicIds:()=>['data-ai']});
  assert.equal(catalog.length,2);assert.equal(catalog[0].alternateUrl,'/zh/writing/different-translated-slug/');
  assert.ok(catalog[0].aliases.includes('中文標題'));assert.equal(catalog[1].kind,'catalogue');
  const translated=createSearchCatalog(collections,'zh-Hant');
  assert.equal(translated[0].url,'/zh/writing/different-translated-slug/');assert.equal(translated[0].id,'original');
});
