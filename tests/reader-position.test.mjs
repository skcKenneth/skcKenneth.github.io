import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { POSITION_STORAGE_KEY, emptyPositionState, parsePositionState, mergePositionStates, positionGeneration,
  getReadingPosition, setReadingPosition, clearReadingPosition, headingOutline, resolveReadingPosition, mappedHeading } from '../src/lib/reading-position.mjs';
import { READER_SECTIONS, getReaderSections } from '../src/data/reader-sections.mjs';

const headings = [{slug:'first-section',text:'First section',depth:2},{slug:'second-section',text:'Second section',depth:2}];
const sections = [{id:'first',en:'first-section','zh-Hant':'第一節'}];
const value = (headingId='first-section') => ({headingId,locale:'en',sectionId:headingId==='first-section'?'first':null,outline:headingOutline(headings)});
const save = (state=emptyPositionState(), actor='tab-a',heading='first-section') => setReadingPosition(state,'an-article',value(heading),actor,1000);

test('Position key is independent and parser rejects unknown/unsafe data without admitting URLs or HTML',()=>{
  assert.equal(POSITION_STORAGE_KEY,'kenneth-reading-position:v1');
  const saved=save(); assert.deepEqual(parsePositionState(JSON.stringify(saved)),saved);
  for(const raw of ['{',JSON.stringify({...saved,version:2}),JSON.stringify({...saved,url:'javascript:alert(1)'}),'{"version":1,"records":[],"__proto__":{}}']) assert.deepEqual(parsePositionState(raw),emptyPositionState());
  const broken=structuredClone(saved); broken.records[0].position.headingId='bad\nheading'; assert.deepEqual(parsePositionState(broken),emptyPositionState());
  broken.records[0].position.headingId='first-section'; broken.records[0].position.url='/malicious/'; assert.deepEqual(parsePositionState(broken),emptyPositionState());
  assert.throws(()=>setReadingPosition(saved,'../../bad',value(),'tab'),/Invalid/);
});
test('Merges converge independently of tab order, including simultaneous writes and unrelated articles',()=>{
  const a=save(),b=save(emptyPositionState(),'tab-b','second-section');
  const c=setReadingPosition(emptyPositionState(),'other-article',value(),'tab-c',1001);
  assert.deepEqual(mergePositionStates(a,b),mergePositionStates(b,a));
  assert.deepEqual(mergePositionStates(mergePositionStates(a,b),c),mergePositionStates(a,mergePositionStates(b,c)));
  assert.deepEqual(mergePositionStates(a,a),a);
  assert.equal(getReadingPosition(mergePositionStates(a,b),'an-article').headingId,'second-section');
  assert.equal(mergePositionStates(a,b,c).records.length,2);
});
test('Clear generations reject a queued stale tab even when its position clock is much larger',()=>{
  const a=save(),oldGeneration=positionGeneration(a,'an-article'),cleared=clearReadingPosition(a,'an-article','tab-clear');
  let stale=a;for(let i=0;i<20;i++)stale=save(stale,'old-tab','second-section');
  assert.equal(getReadingPosition(mergePositionStates(cleared,stale),'an-article'),null);
  assert.deepEqual(setReadingPosition(cleared,'an-article',value(),'old-tab',2000,oldGeneration),cleared);
  const reopened=save(cleared,'new-tab');assert.equal(getReadingPosition(reopened,'an-article').headingId,'first-section');
  assert.equal(getReadingPosition(mergePositionStates(reopened,stale),'an-article').headingId,'first-section');
});
test('Positions survive an unrelated outline edit but reject removed headings and unmapped languages',()=>{
  const position=getReadingPosition(save(),'an-article');
  assert.equal(resolveReadingPosition(position,[...headings,{slug:'new-section',text:'New'}],sections,'en').status,'ready');
  assert.equal(resolveReadingPosition(position,[headings[1]],sections,'en').status,'stale');
  assert.deepEqual(resolveReadingPosition(position,[{slug:'第一節',text:'第一節'}],sections,'zh-Hant'),{status:'ready',headingId:'第一節',label:'第一節'});
  assert.equal(resolveReadingPosition({...position,sectionId:null},[{slug:'第一節',text:'第一節'}],sections,'zh-Hant').status,'unmapped');
  assert.equal(mappedHeading('second-section','en','zh-Hant',sections),null);
  assert.equal(mappedHeading('first-section','en','zh-Hant',sections),'第一節');
});
test('Explicit editorial registry validates real local IDs and never supplies an ordinal fallback',()=>{
  for(const [id,pairs]of Object.entries(READER_SECTIONS)){
    assert.equal(new Set(pairs.map(pair=>pair.id)).size,pairs.length);
    for(const locale of ['en','zh-Hant'])assert.deepEqual(getReaderSections(id,locale,pairs.map(pair=>({slug:pair[locale]}))),pairs);
    assert.throws(()=>getReaderSections(id,'en',[]),/rendered heading/);
  }
  assert.deepEqual(getReaderSections('unregistered','en',headings),[]);
  assert.equal(mappedHeading('先看見結果再問它支持甚麼','zh-Hant','en',READER_SECTIONS['what-must-a-traffic-model-remember']),null);
});
test('Article source integrates independent tools and retains print provenance outside hidden tools',async()=>{
  const source=await readFile(new URL('../src/components/ArticleReader.astro',import.meta.url),'utf8');
  assert.match(source,/ReadingPosition articleId=\{canonicalId\(entry\.data\)\}/);assert.match(source,/reader-print-url/);assert.match(source,/reader-print\.css/);
  const client=await readFile(new URL('../src/scripts/reading-position-client.ts',import.meta.url),'utf8');
  assert.equal(client.includes('kenneth-reading-list:'),false);assert.equal(client.includes('jae-math-'),false);
  assert.equal(client.includes('innerHTML'),false);
});
if(process.argv.includes('--built'))for(const [id,pairs]of Object.entries(READER_SECTIONS))for(const locale of ['en','zh-Hant'])test(`Built reader controls and explicit headings: ${id}/${locale}`,async()=>{
  const html=await readFile(new URL(`../dist/${locale==='en'?'':'zh/'}writing/${id}/index.html`,import.meta.url),'utf8');
  for(const pair of pairs)assert.ok(html.includes(`id="${pair[locale]}"`),`Missing ${pair[locale]}`);
  assert.match(html,new RegExp(`data-article-id="${id}"`));assert.match(html,/data-reading-position/);assert.match(html,/data-reader-print/);
  assert.match(html,/class="reader-print-url"/);assert.match(html,/https:\/\/skckenneth\.github\.io\//);
});
