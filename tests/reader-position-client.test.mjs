import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
import {build} from 'esbuild';
import {POSITION_STORAGE_KEY,emptyPositionState,setReadingPosition,clearReadingPosition,getReadingPosition,headingOutline} from '../src/lib/reading-position.mjs';

const bundled=await build({entryPoints:[fileURLToPath(new URL('../src/scripts/reading-position-client.ts',import.meta.url))],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022'});
const code=bundled.outputFiles[0].text;
class Surface {
  constructor(){this.listeners=new Map();this.dataset={};this.hidden=false;this.textContent='';this.tabIndex=0;}
  addEventListener(type,handler,options={}){this.listeners.set(type,[...(this.listeners.get(type)||[]),{handler,signal:options.signal}]);}
  async emit(type,event={}){for(const {handler,signal}of this.listeners.get(type)||[])if(!signal?.aborted)await handler({target:this,...event});}
  active(type){return(this.listeners.get(type)||[]).filter(item=>!item.signal?.aborted).length;}
  focus(){this.focused=true;}closest(){return null;}
}
const headings=[{slug:'first',text:'First',depth:2},{slug:'second',text:'Second',depth:2}];
function initial(heading='first',locale='en',sectionId='first-pair'){
  return setReadingPosition(emptyPositionState(),'an-article',{headingId:heading,locale,sectionId,outline:headingOutline(headings)},'initial-tab',1000);
}
function fixture({blocked=false,seed=null,hash='',locale='en',shared,sectionPairs=[{id:'first-pair',en:'first','zh-Hant':'第一節'}]}={}){
  const storage=shared||new Map([['kenneth-reading-list:v1','bookmarks-kept'],['jae-math-v1','learning-kept']]);
  if(seed)storage.set(POSITION_STORAGE_KEY,JSON.stringify(seed));
  const window=new Surface(),document=new Surface(),timers=new Map();let timerId=0;
  const headingElements=new Map(headings.map((heading,index)=>{const element=new Surface();element.top=index===0?-30:500;element.getBoundingClientRect=()=>({top:element.top});element.scrollIntoView=()=>{element.scrolled=true;};return[heading.slug,element];}));
  const prose={contains:element=>[...headingElements.values()].includes(element)},reader=new Surface();reader.querySelector=()=>prose;
  const language=new Surface();language.href='https://example.test/zh/writing/translated/';
  const controls=()=>Object.fromEntries(['message','continue','clear','storage','status'].map(key=>[key,new Surface()]));
  let elements=controls(),root;
  const newRoot=(articleId='an-article')=>{root=new Surface();root.dataset={articleId,locale,headings:JSON.stringify(headings),sections:JSON.stringify(sectionPairs),outline:headingOutline(headings)};root.querySelector=selector=>elements[selector.match(/data-position-(\w+)/)?.[1]];return root;};
  newRoot();document.visibilityState='visible';document.getElementById=id=>headingElements.get(id)||null;
  document.querySelector=selector=>({'[data-article-reader]':reader,'[data-reading-position]':root,'[data-language-switch]':language,'.site-header':{getBoundingClientRect:()=>({height:80})}})[selector]||null;
  const location=new URL('https://example.test/writing/an-article/?from=topic'+hash),history={state:null,calls:[],replaceState(state,_,url){this.calls.push(String(url));location.href=String(url);}};
  const context=vm.createContext({window,document,location,history,AbortController,URL,crypto:{randomUUID:()=> 'test-tab'},
    localStorage:{getItem:key=>{if(blocked)throw Error('SecurityError');return storage.get(key)||null;},setItem:(key,value)=>{if(blocked)throw Error('SecurityError');storage.set(key,value);}},
    setTimeout:handler=>{timers.set(++timerId,handler);return timerId;},clearTimeout:id=>timers.delete(id),console});
  vm.runInContext(code,context);
  return{window,document,reader,storage,language,location,history,context,headingElements,get root(){return root;},get elements(){return elements;},
    async tick(){for(const[id,handler]of [...timers]){timers.delete(id);await handler();}},
    reenter(){vm.runInContext(code,context);},navigate(){elements=controls();newRoot('another-article');vm.runInContext(code,context);}};
}
test('Explicit continuation preserves incoming hash on load and focuses only after activation',async()=>{
  const page=fixture({seed:initial(),hash:'#second'});
  assert.equal(page.location.hash,'#second');assert.equal(page.history.calls.length,0);assert.equal(page.headingElements.get('first').focused,undefined);
  assert.equal(page.elements.continue.hidden,false);await page.elements.continue.emit('click');
  assert.equal(page.headingElements.get('first').focused,true);assert.equal(page.headingElements.get('first').scrolled,true);
  assert.equal(page.location.hash,'#first');assert.equal(page.location.search,'?from=topic');
});
test('No implicit saving during restoration; genuine reading persists a canonical chapter only',async()=>{
  const page=fixture();await page.window.emit('scroll');await page.tick();assert.equal(page.storage.has(POSITION_STORAGE_KEY),false);
  await page.window.emit('wheel');await page.window.emit('scroll');await page.tick();
  const state=JSON.parse(page.storage.get(POSITION_STORAGE_KEY));assert.equal(getReadingPosition(state,'an-article').headingId,'first');
  assert.equal(page.history.calls.length,0);assert.equal(page.storage.get('kenneth-reading-list:v1'),'bookmarks-kept');assert.equal(page.storage.get('jae-math-v1'),'learning-kept');
});
test('Pointer interaction followed by scrolling also tracks scrollbar-driven reading',async()=>{
  const page=fixture();await page.window.emit('pointerdown');await page.tick();assert.equal(page.storage.has(POSITION_STORAGE_KEY),false);
  await page.window.emit('scroll');await page.tick();assert.equal(getReadingPosition(JSON.parse(page.storage.get(POSITION_STORAGE_KEY)),'an-article').headingId,'first');
});
test('Blocked storage remains useful in memory and its warning survives clearing',async()=>{
  const page=fixture({blocked:true});await page.window.emit('wheel');await page.window.emit('scroll');await page.tick();
  assert.equal(page.elements.continue.hidden,false);assert.match(page.elements.storage.textContent,/page only/);
  await page.elements.clear.emit('click');assert.equal(page.elements.continue.hidden,true);assert.match(page.elements.storage.textContent,/unavailable/);
  assert.equal(page.elements.message.focused,true);assert.match(page.elements.message.textContent,/cleared/);
});
test('Cross-tab clear cancels pending writes and stale tab generations cannot resurrect a position',async()=>{
  const page=fixture({seed:initial()});await page.window.emit('wheel');await page.window.emit('scroll');
  const cleared=clearReadingPosition(JSON.parse(page.storage.get(POSITION_STORAGE_KEY)),'an-article','other-tab');
  page.storage.set(POSITION_STORAGE_KEY,JSON.stringify(cleared));await page.window.emit('storage',{key:POSITION_STORAGE_KEY,newValue:JSON.stringify(cleared)});await page.tick();
  await page.window.emit('pagehide');assert.equal(getReadingPosition(JSON.parse(page.storage.get(POSITION_STORAGE_KEY)),'an-article'),null);
  assert.match(page.elements.message.textContent,/cleared/);
});
test('Pre-write reconciliation handles a clear before its storage event arrives',async()=>{
  const page=fixture({seed:initial()});await page.window.emit('wheel');await page.window.emit('scroll');
  const cleared=clearReadingPosition(JSON.parse(page.storage.get(POSITION_STORAGE_KEY)),'an-article','other-tab');page.storage.set(POSITION_STORAGE_KEY,JSON.stringify(cleared));
  await page.tick();assert.equal(getReadingPosition(JSON.parse(page.storage.get(POSITION_STORAGE_KEY)),'an-article'),null);assert.equal(page.elements.continue.hidden,true);
});
test('Removed headings and untranslated sections show a clear status without snapping',()=>{
  const stale=fixture({seed:initial('removed')});assert.equal(stale.elements.continue.hidden,true);assert.match(stale.elements.message.textContent,/no longer/);assert.equal(stale.history.calls.length,0);
  const unmapped=fixture({seed:initial('額外章節','zh-Hant',null)});assert.match(unmapped.elements.message.textContent,/no verified/);assert.equal(unmapped.elements.continue.hidden,true);
});
test('Language handler preserves query and uses explicit mappings, never stale or ordinal hashes',async()=>{
  const page=fixture({seed:initial(),hash:'#first'});assert.equal(page.language.dataset.readingPositionLanguageManaged,'true');
  let url=new URL(page.language.href);assert.equal(decodeURIComponent(url.hash),'#第一節');assert.equal(url.search,'?from=topic');
  page.location.hash='#second';await page.window.emit('hashchange');await page.language.emit('focus');assert.equal(new URL(page.language.href).hash,'');
  page.location.hash='#removed';await page.window.emit('hashchange');await page.language.emit('click');assert.equal(new URL(page.language.href).hash,'');
  page.location.hash='#%E0%A4%A';await page.window.emit('hashchange');await page.language.emit('focus');assert.equal(new URL(page.language.href).hash,'');
});
test('A resumed section survives header focus/autoscroll until a genuine reading scroll chooses another section',async()=>{
  const page=fixture({seed:initial('second','en','second-pair'),sectionPairs:[{id:'first-pair',en:'first','zh-Hant':'第一節'},{id:'second-pair',en:'second','zh-Hant':'第二節'}]});
  await page.elements.continue.emit('click');assert.equal(page.location.hash,'#second');
  page.language.closest=selector=>selector==='.site-header'?page.language:null;
  await page.window.emit('pointerdown',{type:'pointerdown',target:page.language});await page.window.emit('focusin',{target:page.language});
  page.headingElements.get('first').top=50;page.headingElements.get('second').top=500;
  await page.window.emit('scroll');await page.language.emit('focus');await page.language.emit('click');await page.window.emit('pagehide');
  assert.equal(decodeURIComponent(new URL(page.language.href).hash),'#第二節');
  assert.equal(getReadingPosition(JSON.parse(page.storage.get(POSITION_STORAGE_KEY)),'an-article').headingId,'second');
  await page.window.emit('wheel');await page.window.emit('scroll');await page.tick();await page.language.emit('focus');
  assert.equal(decodeURIComponent(new URL(page.language.href).hash),'#第一節');
});
test('Explicit TOC selection survives hashchange and pagehide, while history restoration alone never saves',async()=>{
  const restored=fixture({hash:'#second'});await restored.window.emit('hashchange');await restored.window.emit('pagehide');
  assert.equal(restored.storage.has(POSITION_STORAGE_KEY),false);
  const page=fixture(),link=new Surface();link.hash='#second';link.closest=selector=>selector==='a[href^="#"]'?link:selector==='.reader-desktop-toc,.reader-mobile-toc'?link:null;
  await page.window.emit('pointerdown',{type:'pointerdown',target:link});await page.reader.emit('click',{target:link});
  page.location.hash='#second';await page.window.emit('hashchange');await page.window.emit('pagehide');
  assert.equal(getReadingPosition(JSON.parse(page.storage.get(POSITION_STORAGE_KEY)),'an-article').headingId,'second');
  // A jump-induced viewport position must not replace the explicit chosen chapter.
  await page.window.emit('scroll');await page.tick();
  assert.equal(getReadingPosition(JSON.parse(page.storage.get(POSITION_STORAGE_KEY)),'an-article').headingId,'second');
});
test('Repeated initialization and a second page retain exactly one active set of document handlers',()=>{
  const page=fixture();page.reenter();assert.equal(page.elements.clear.active('click'),1);assert.equal(page.window.active('storage'),1);
  page.navigate();assert.equal(page.window.active('storage'),1);assert.equal(page.window.active('pagehide'),1);assert.equal(page.language.active('click'),1);
});
test('BFCache re-reads external positions without overwriting browser history or saved records',async()=>{
  const page=fixture({seed:initial()});page.storage.set(POSITION_STORAGE_KEY,JSON.stringify(initial('second','en',null)));
  await page.window.emit('pageshow',{persisted:true});assert.match(page.elements.message.textContent,/Second/);assert.equal(page.history.calls.length,0);
  await page.window.emit('scroll');await page.tick();assert.equal(getReadingPosition(JSON.parse(page.storage.get(POSITION_STORAGE_KEY)),'an-article').headingId,'second');
});
test('Print CSS removes screen clipping while retaining figures, references and A4 provenance',async()=>{
  const css=await readFile(new URL('../src/styles/reader-print.css',import.meta.url),'utf8');
  assert.match(css,/@page\{size:A4/);assert.match(css,/table-layout:fixed/);assert.match(css,/white-space:pre-wrap/);assert.match(css,/display:table-header-group/);assert.match(css,/\.reader-print-url\{display:block/);
  assert.match(css,/\.reader-mobile-sources\{display:block/);assert.equal(css.includes('overflow-x:hidden'),false);
});
test('Print preparation fits formulas, expands disclosures and restores the exact screen state',async()=>{
  const built=await build({entryPoints:[fileURLToPath(new URL('../src/scripts/reader-print-client.ts',import.meta.url))],bundle:true,write:false,format:'iife',globalName:'ReaderPrintTest',platform:'browser',target:'es2022'});
  const window=new Surface(),button=new Surface(),detail=new Surface();detail.open=false;button.disabled=true;
  const math=new Surface();math.style={};math.getAttribute=()=> 'font-weight:400';math.setAttribute=(key,value)=>{math.restored=value;};math.scrollWidth=900;math.getBoundingClientRect=()=>({width:900});math.parentElement={getBoundingClientRect:()=>({width:500})};
  const scope={querySelectorAll:selector=>selector==='details'?[detail]:selector==='.reader-prose .katex'?[math]:[]},header={querySelectorAll:()=>[]};
  const document=new Surface();document.documentElement=new Surface();document.body={append(){}};document.createElement=()=>({style:{},getBoundingClientRect:()=>({width:680}),remove(){}});
  document.querySelector=selector=>({'[data-reader-print]':button,'[data-article-reader]':scope,'.reader-article-head':header})[selector];
  const context=vm.createContext({window,document,AbortController,getComputedStyle:()=>({fontSize:'20px'}),console});vm.runInContext(built.outputFiles[0].text,context);
  const table={rows:[{cells:[{colSpan:1},{colSpan:1},{colSpan:1}]}],getBoundingClientRect:()=>({width:900})};
  const cell={colSpan:1,closest:()=>table},tableMath={parentElement:{getBoundingClientRect:()=>({width:500})},closest:()=>cell};
  assert.equal(context.ReaderPrintTest.availablePrintMathWidth(tableMath,680),680/3-12);
  cell.colSpan=2;assert.equal(context.ReaderPrintTest.availablePrintMathWidth(tableMath,680),680*2/3-12);
  assert.equal(button.disabled,false);await window.emit('beforeprint');assert.equal(detail.open,true);assert.ok(parseFloat(math.style.fontSize)<12);
  assert.equal(document.documentElement.dataset.readerPrinting,'true');await window.emit('afterprint');assert.equal(detail.open,false);assert.equal(math.restored,'font-weight:400');assert.equal(document.documentElement.dataset.readerPrinting,undefined);
  vm.runInContext(built.outputFiles[0].text,context);assert.equal(window.active('beforeprint'),1);assert.equal(button.active('click'),1);
});
