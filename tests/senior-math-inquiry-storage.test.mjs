import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {initialProgress,loadProgress,saveProgress} from '../src/lib/jae-math-model.mjs';

// Exercise the actual client initializer, including its event callbacks. No
// browser storage or real DOM is changed; the stub supplies only used DOM APIs.
const bundled=await build({
  entryPoints:[fileURLToPath(new URL('../src/scripts/senior-math-inquiry-ui.ts',import.meta.url))],
  bundle:true,write:false,format:'esm',platform:'browser',target:'es2022',
});
const {initializeSeniorInquiries}=await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);

class Element {
  constructor(value=''){this.value=value;this.textContent='';this.dataset={};this.listeners=new Map();this.children=[];this.attributes={};}
  addEventListener(type,listener){const handlers=this.listeners.get(type)||[];handlers.push(listener);this.listeners.set(type,handlers);}
  fire(type){for(const listener of this.listeners.get(type)||[])listener({target:this});}
  setAttribute(key,value){this.attributes[key]=value;}
  append(child){this.children.push(child);}
  replaceChildren(...children){this.children=children;}
}
function fixture(locale='en'){
  const first=new Element('5'),second=new Element('0.5');
  first.dataset.inquiryParam='a';second.dataset.inquiryParam='b';
  const nodes=new Map([
    ['[data-inquiry-plot]',new Element()],['[data-inquiry-summary]',new Element()],
    ['[data-inquiry-reset]',new Element()],['[data-inquiry-note]',new Element()],
    ['[data-inquiry-simulate]',new Element()],['[data-inquiry-simulation]',new Element()],
    ['[data-inquiry-value="a"]',new Element()],['[data-inquiry-value="b"]',new Element()],
  ]);
  const lab={dataset:{seniorLab:'probability',lessonId:'c2-10-3'},
    querySelector:selector=>nodes.get(selector)||null,
    querySelectorAll:selector=>selector==='[data-inquiry-param]'?[first,second]:[],
  };
  return {root:{dataset:{locale},querySelectorAll:selector=>selector==='[data-senior-lab]'?[lab]:[]},first,second,nodes};
}
function session(progress,storage){
  const dirty=new Set();let reads=0,mutations=0,saves=0;
  return {
    dirty,
    read:id=>{reads++;return progress.answers[id];},
    record:id=>{mutations++;dirty.add(id);return progress.answers[id]??={input:'',notes:'',correction:'',completed:false,attempts:0,lastResult:null};},
    save:()=>{saves++;assert.equal(saveProgress(storage,progress,dirty),true);dirty.clear();},
    counts:()=>({reads,mutations,saves}),
  };
}
const memoryStorage=()=>{let value=null;return {getItem:()=>value,setItem:(_key,next)=>{value=next;}};};
const withDocument=fn=>{const previous=globalThis.document;globalThis.document={createElementNS:()=>new Element()};try{return fn();}finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}};

test('Restoring inquiry notes does not dirty stale data or overwrite another language tab',()=>{
  const id='c2-10-3-inquiry-1',storage=memoryStorage(),base=initialProgress();
  base.answers[id]={notes:'Original prediction'};assert(saveProgress(storage,base));
  const oldTab=loadProgress(storage).progress,f=fixture(),s=session(oldTab,storage);
  initializeSeniorInquiries(f.root,s.record,s.save,s.read);
  assert.equal(f.nodes.get('[data-inquiry-note]').value,'Original prediction');
  assert.deepEqual(s.counts(),{reads:1,mutations:0,saves:0});assert.equal(s.dirty.size,0);
  const otherTab=loadProgress(storage).progress;otherTab.answers[id].notes='New prediction from Chinese tab';
  assert(saveProgress(storage,otherTab,new Set([id])));
  // Mode and directory saves are allowed to merge a page with no changed items.
  assert(saveProgress(storage,oldTab,s.dirty));
  assert.equal(loadProgress(storage).progress.answers[id].notes,'New prediction from Chinese tab');
  f.nodes.get('[data-inquiry-note]').value='I revised my prediction';f.nodes.get('[data-inquiry-note]').fire('input');
  assert.equal(loadProgress(storage).progress.answers[id].notes,'I revised my prediction');
  assert.deepEqual(s.counts(),{reads:1,mutations:1,saves:1});
});

test('An absent inquiry record stays absent until the student actually writes',()=>{
  const progress=initialProgress(),storage=memoryStorage(),f=fixture('zh-Hant'),s=session(progress,storage);
  initializeSeniorInquiries(f.root,s.record,s.save,s.read);
  assert.equal(f.nodes.get('[data-inquiry-note]').value,'');assert.deepEqual(progress.answers,{});
  f.nodes.get('[data-inquiry-note]').value='先預測，再以概率檢查。';f.nodes.get('[data-inquiry-note]').fire('input');
  assert.equal(loadProgress(storage).progress.answers['c2-10-3-inquiry-1'].notes,'先預測，再以概率檢查。');
  assert.equal(s.counts().saves,1);
});

test('Simulation output records its parameters and is invalidated by changes and reset',()=>withDocument(()=>{
  const progress=initialProgress(),storage=memoryStorage(),f=fixture(),s=session(progress,storage);
  initializeSeniorInquiries(f.root,s.record,s.save,s.read);
  const simulation=f.nodes.get('[data-inquiry-simulation]'),simulate=f.nodes.get('[data-inquiry-simulate]');
  f.second.value='1';simulate.fire('click');
  assert.match(simulation.textContent,/n=5, p=1: 200 simulated trials, seed 37/);
  assert.match(simulation.textContent,/0, 0, 0, 0, 0, 200; mean 5/);
  f.second.value='0';f.second.fire('input');
  assert.match(simulation.textContent,/Parameters changed; simulate again/);
  assert.doesNotMatch(simulation.textContent,/seed 37/);
  simulate.fire('click');assert.match(simulation.textContent,/n=5, p=0/);
  assert.match(simulation.textContent,/200, 0, 0, 0, 0, 0; mean 0/);
  f.nodes.get('[data-inquiry-reset]').fire('click');
  assert.equal(f.first.value,'5');assert.equal(f.second.value,'0.5');
  assert.match(simulation.textContent,/Parameters changed; simulate again/);
  assert.deepEqual(s.counts(),{reads:1,mutations:0,saves:0});
}));

test('Chinese simulation labels retain n, p and the bounded trial count',()=>{
  const f=fixture('zh-Hant');initializeSeniorInquiries(f.root,()=>({}),()=>{},()=>undefined);
  f.second.value='1';f.nodes.get('[data-inquiry-simulate]').fire('click');
  assert.match(f.nodes.get('[data-inquiry-simulation]').textContent,/n=5、p=1：200 次模擬/);
});
