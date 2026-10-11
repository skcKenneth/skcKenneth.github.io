import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {READING_STORAGE_KEY,setReadingArticle} from '../src/lib/reading-list.mjs';

const compiled=await build({entryPoints:[fileURLToPath(new URL('../src/scripts/reading-list-client.ts',import.meta.url))],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022'});
const code=compiled.outputFiles[0].text;
class Element {
  constructor(tag='div'){this.tag=tag;this.children=[];this.dataset={};this.attributes={};this.listeners=new Map();this.textContent='';this.disabled=false;this.value='';}
  append(...children){this.children.push(...children);}prepend(...children){this.children.unshift(...children);}replaceChildren(...children){this.children=children;}
  setAttribute(name,value){this.attributes[name]=value;}
  addEventListener(type,listener){this.listeners.set(type,[...(this.listeners.get(type)||[]),listener]);}
  async emit(type){for(const listener of this.listeners.get(type)||[])await listener({});}
  querySelector(selector){return this.selectors?.[selector]||null;}
  querySelectorAll(selector){const result=[];const walk=node=>{for(const child of node.children){if(child.tag===selector)result.push(child);walk(child);}};walk(this);return result;}
  focus(){this.focused=true;}
}
function fixture({blocked=false}={}){
  const storage=new Map([['existing-learning-key','preserve this']]),listeners=new Map();
  const button=new Element('button'),saveStatus=new Element('span'),save=new Element();save.dataset={articleId:'article-a',locale:'en'};save.selectors={'button':button,'[data-save-status]':saveStatus};
  const list=new Element(),count=new Element('p'),status=new Element('p'),storageStatus=new Element('p'),exportButton=new Element('button'),importInput=new Element('input'),reading=new Element();
  reading.dataset={locale:'en',articles:JSON.stringify([{id:'article-a',title:'An article',url:'/writing/article-a/'}])};
  reading.selectors={'[data-reading-items]':list,'[data-reading-count]':count,'[data-reading-status]':status,'[data-reading-storage-status]':storageStatus,'[data-reading-export]':exportButton,'[data-reading-import]':importInput};
  const context=vm.createContext({document:{querySelectorAll:selector=>selector==='[data-save-article]'?[save]:selector==='[data-reading-list]'?[reading]:[],createElement:tag=>new Element(tag)},
    localStorage:{getItem:key=>{if(blocked)throw new Error('SecurityError');return storage.get(key)||null;},setItem:(key,value)=>{if(blocked)throw new Error('SecurityError');storage.set(key,value);}},
    window:{addEventListener:(type,listener)=>listeners.set(type,[...(listeners.get(type)||[]),listener])},crypto:{randomUUID:()=> 'test-tab'},setTimeout,Blob,URL,console});
  vm.runInContext(code,context);
  return {button,saveStatus,list,status,storageStatus,count,storage,importInput,context,emit:async(type,event)=>{for(const listener of listeners.get(type)||[])await listener(event);}};
}
test('Blocked localStorage keeps working in memory and never hides its warning after removal',async()=>{
  const page=fixture({blocked:true});
  await page.button.emit('click');assert.equal(page.button.attributes['aria-pressed'],'true');assert.equal(page.list.children.length,1);
  assert.match(page.saveStatus.textContent,/unavailable/);assert.match(page.storageStatus.textContent,/unavailable/);
  await page.list.querySelectorAll('button')[0].emit('click');
  assert.equal(page.button.attributes['aria-pressed'],'false');assert.equal(page.status.textContent,'Article removed.');
  assert.match(page.storageStatus.textContent,/unavailable/);assert.equal(page.importInput.focused,true);
  assert.equal(page.storage.get('existing-learning-key'),'preserve this');
});
test('Re-entering a document does not attach duplicate article or list handlers',async()=>{
  const page=fixture();vm.runInContext(code,page.context);
  assert.equal(page.button.listeners.get('click').length,1);
  assert.equal(page.importInput.listeners.get('change').length,1);
  await page.button.emit('click');assert.equal(page.button.attributes['aria-pressed'],'true');
  assert.equal(JSON.parse(page.storage.get(READING_STORAGE_KEY)).records.length,1);
});
test('Cross-tab removal and BFCache restores refresh canonical saved state',async()=>{
  const page=fixture();await page.button.emit('click');
  const saved=JSON.parse(page.storage.get(READING_STORAGE_KEY));
  const removed=setReadingArticle(saved,'article-a',false,Date.now()+100,'another-tab');
  await page.emit('storage',{key:READING_STORAGE_KEY,newValue:JSON.stringify(removed)});
  assert.equal(page.button.attributes['aria-pressed'],'false');
  const restored=setReadingArticle(removed,'article-a',true,Date.now()+200,'another-tab');
  page.storage.set(READING_STORAGE_KEY,JSON.stringify(restored));await page.emit('pageshow',{persisted:true});
  assert.equal(page.button.attributes['aria-pressed'],'true');
  assert.equal(page.storage.get('existing-learning-key'),'preserve this');
});
test('Invalid imported JSON retains the original visible and stored list',async()=>{
  const page=fixture();await page.button.emit('click');const before=page.storage.get(READING_STORAGE_KEY);
  page.importInput.files=[{size:40,text:async()=>'{"format":"wrong","items":[]}'}];await page.importInput.emit('change');
  assert.equal(page.storage.get(READING_STORAGE_KEY),before);assert.equal(page.button.attributes['aria-pressed'],'true');
  assert.match(page.status.textContent,/existing list was kept/);
});
