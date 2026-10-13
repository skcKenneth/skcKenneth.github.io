import test from 'node:test';
import assert from 'node:assert/strict';
import {routeKey,createSearchCatalog,matchCatalog,mergeSearchResults} from '../src/lib/search-catalog.mjs';
test('Mathematics activity aliases survive generic workspace and Pagefind route deduplication',()=>{
 for(const[locale,prefix,query,title]of [['en','','angle-bisector property','Angle-bisector property'],['zh-Hant','/zh','角的平分線','角的平分線的性質']]){
  const generic={url:prefix+'/teaching/math/',title:'Mathematics Learning Space',kind:'teaching'},activity={url:prefix+'/teaching/math/?activity=school%3Ainquiry%3Aangle-bisector',title,kind:'teaching',aliases:['角的平分線','angle-bisector property']};
  const catalog=createSearchCatalog({},locale,{extras:[generic,activity]});assert.equal(catalog.length,2);assert.equal(matchCatalog(query,catalog)[0].url,activity.url);
  assert.equal(mergeSearchResults([generic,activity],[{...activity,url:activity.url+'&q=other#fragment'}],'https://skckenneth.github.io').length,2);
  assert.notEqual(routeKey(generic.url),routeKey(activity.url));
 }
});
test('Only safe Mathematics activity selectors change existing route keys',()=>{
 for(const path of ['/teaching/math/','/zh/teaching/math/']){
  assert.equal(routeKey(path+'?activity=lab%3Aquadratic&view=learning#x'),path.slice(0,-1)+'?activity=lab%3Aquadratic');
  for(const suffix of ['?activity=javascript%3Aalert','?activity=school%3Ainquiry%3A..%2Fsecret','?activity=school%3Ainquiry%3Aangle-bisector&activity=lab%3Aquadratic','?activity='+('a'.repeat(200)),'?view=learning#fragment'])assert.equal(routeKey(path+suffix),path.slice(0,-1));
 }
 assert.equal(routeKey('/writing/modeling/?activity=lab%3Aquadratic#fragment'),'/writing/modeling');assert.equal(routeKey('/teaching/math/?q=old-query#fragment'),'/teaching/math');
 assert.equal(routeKey('https://outside.invalid/teaching/math/?activity=lab%3Aquadratic'),null);
});
