/** Synthetic DOM regressions execute the real TypeScript UI; browser QA remains separate. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {webcrypto} from 'node:crypto';
import vm from 'node:vm';
import {activities,evaluate,directStateForCase,directAction,directScene} from '../src/data/g10-inquiries-functions.mjs';
import {SYSTEM_KEY,decodeNativeRecord} from '../src/lib/math-system-records.mjs';

const clone=value=>structuredClone(value);
// CSSOM's identifier escaping, including leading digits and control characters.
const CSS={escape(value){const string=String(value);let result='';for(let i=0;i<string.length;i++){const code=string.charCodeAt(i),character=string[i];if(code===0){result+='\uFFFD';continue;}if(code<32||code===127||i===0&&code>=48&&code<=57||i===1&&code>=48&&code<=57&&string[0]==='-'){result+='\\'+code.toString(16)+' ';continue;}if(i===0&&character==='-'&&string.length===1){result+='\\-';continue;}result+=code>=128||character==='-'||character==='_'||code>=48&&code<=57||code>=65&&code<=90||code>=97&&code<=122?character:'\\'+character;}return result;}};
const source=stripTypeScriptTypes(readFileSync(new URL('../src/scripts/g10-inquiry-ui.ts',import.meta.url),'utf8').replace(/^import[^\n]*\n/gm,''),{mode:'strip'}).replace('export function initializeG10Inquiry','function initializeG10Inquiry')+'\nglobalThis.initializeG10Inquiry=initializeG10Inquiry;';

function harness({activityId='g10-05-15',saved,draft,query=''}={}){
 const activity=activities.find(a=>a.id===activityId),noteId=activity.nativeActivityId||`school:inquiry:${activity.id}`;
 let document;
 class Element{
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.dataset={};this.attributes={};this.children=[];this.listeners=new Map();this.textContent='';this.value='';this.hidden=false;this.checked=false;this.parentElement=null;this.isConnected=true;this.classList={toggle:()=>true,contains:()=>false};}
  append(...children){for(const child of children){child.parentElement=this;child.isConnected=this.isConnected;this.children.push(child);}}
  replaceChildren(...children){for(const child of this.children)this.disconnect(child);this.children=[];this.append(...children);}
  disconnect(child){child.isConnected=false;for(const sub of child.children)this.disconnect(sub);if(document?.activeElement===child)document.activeElement=document.body;}
  set innerHTML(value){this._html=value;this.replaceChildren();if(this.dataset.g10Stage!==undefined){this.svg=new Element('svg');this.append(this.svg);}}
  get innerHTML(){return this._html||'';}
  setAttribute(name,value){this.attributes[name]=String(value);}
  getAttribute(name){return this.attributes[name]??null;}
  hasAttribute(name){return Object.hasOwn(this.attributes,name);}
  addEventListener(name,fn){if(!this.listeners.has(name))this.listeners.set(name,[]);this.listeners.get(name).push(fn);}
  fire(name,event){for(const fn of this.listeners.get(name)||[])fn(event);}
  matches(selector){
   if(selector==='svg')return this.tagName==='SVG';
   if(selector==='button')return this.tagName==='BUTTON';
   const match=/^\[([a-z0-9-]+)(?:="([^"]*)")?\]$/.exec(selector);
   if(match){const key=match[1].replace(/^data-/,'').replace(/-([a-z])/g,(_,c)=>c.toUpperCase());return Object.hasOwn(this.dataset,key)&&(match[2]===undefined||this.dataset[key]===match[2]);}
   return false;
  }
  querySelectorAll(selector){const result=[];const visit=node=>{for(const child of node.children){if(child.matches(selector))result.push(child);visit(child);}};visit(this);return result;}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  closest(selector){return this.matches(selector)?this:this.parentElement?.closest(selector)||null;}
  remove(){if(this.parentElement){this.parentElement.children=this.parentElement.children.filter(c=>c!==this);this.disconnect(this);}}
  focus(){document.activeElement=this;}
  click(){const event={target:this,preventDefault(){}};this.fire('click',event);let parent=this.parentElement;while(parent){parent.fire('click',event);parent=parent.parentElement;}}
 }
 class Input extends Element{constructor(){super('input');}}
 class Select extends Element{constructor(){super('select');}}
 class Textarea extends Element{constructor(){super('textarea');}}
 const body=new Element('body');document={body,activeElement:body,createElement:tag=>tag==='input'?new Input():tag==='select'?new Select():tag==='textarea'?new Textarea():new Element(tag),createElementNS:(_ns,tag)=>new Element(tag),querySelector:()=>null};
 const root=new Element(),elements=new Map();
 const attach=(selector,element=new Element())=>{const match=/^\[data-([^\]]+)\]$/.exec(selector);if(match)element.dataset[match[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]='';elements.set(selector,element);root.append(element);return element;};
 attach('[data-g10-config]').textContent=JSON.stringify({id:activity.id,locale:'en',noteId});
 for(const name of ['save-status','stage','summary','model','work-state','direct-tools','comparisons','capture-status'])attach(`[data-g10-${name}]`);
 const table=attach('[data-g10-table]');table.tHead=new Element('thead');table.tBodies=[new Element('tbody')];table.append(table.tHead,...table.tBodies);
 const fields=['prediction','observation','explanation','limitations'].map(key=>{const element=new Textarea();element.dataset.g10Note=key;root.append(element);return element;});
 const consent=attach('[data-g10-consent]',new Input());
 const reveal=attach('[data-g10-reveal]',new Element('button'));reveal.setAttribute('data-g10-reveal','');
 const capture=attach('[data-g10-capture]',new Element('button'));capture.setAttribute('data-g10-capture','');
 const controls=activity.controls.map(control=>{const element=control.options?new Select():new Input();element.dataset.g10Control=control.key;root.append(element);const output=new Element();elements.set(`[data-g10-output="${control.key}"]`,output);root.append(output);return element;});
 const realQuery=root.querySelector.bind(root),realAll=root.querySelectorAll.bind(root);
 root.querySelector=selector=>selector==='[data-g10-stage] svg'?elements.get('[data-g10-stage]').svg:elements.get(selector)||realQuery(selector);
 root.querySelectorAll=selector=>selector==='[data-g10-note]'?fields:selector==='[data-g10-control]'?controls:realAll(selector);
 let system={version:1,activities:saved?{[noteId]:clone(saved)}:{},classroom:{title:'',ids:[]}},subscriber;
 const edits=[],session=new Map(draft?[['g10-inquiry-tab-drafts-v1',JSON.stringify({[noteId]:draft})]]:[]);
 const store={snapshot:()=>({[SYSTEM_KEY]:clone(system)}),edit(operation){edits.push(clone(operation));let target=system;for(const part of operation.path.slice(0,-1))target=target[part]??={};const key=operation.path.at(-1);if(operation.kind==='seed')target[key]??=clone(operation.value);else if(operation.kind==='max')target[key]=Math.max(target[key]||0,operation.value);else if(operation.kind==='append'){const events=Array.isArray(target[key])?target[key].slice():[];if(!events.some(event=>event?.eventId===operation.value.eventId))events.push(clone(operation.value));target[key]=events;}else target[key]=clone(operation.value);},flush:async()=>({ok:false,status:'session-only'}),subscribe:fn=>{subscriber=fn;}};
 const location={href:'https://example.test/teaching/senior-math/inquiries/'+activityId+'/'+query};
 const window={localStorage:{},MathStorage:{createStore:()=>store},addEventListener(){}};
 const sandbox={inquiries:activities,evaluateInquiry:evaluate,directStateForCase,directAction,directScene,SYSTEM_KEY,decodeNativeRecord,window,document,sessionStorage:{getItem:key=>session.get(key)??null,setItem:(key,value)=>session.set(key,value)},location,history:{replaceState(_a,_b,url){location.href=String(url);}},crypto:webcrypto,CSS,URL,Blob,DOMPoint:class{},Element,HTMLElement:Element,SVGElement:Element,HTMLSelectElement:Select,HTMLInputElement:Input,HTMLTextAreaElement:Textarea,Date,JSON,Math,Map,Set,console,setTimeout,clearTimeout};
 vm.createContext(sandbox);vm.runInContext(source,sandbox);
 return {start:()=>sandbox.initializeG10Inquiry(root),root,fields,consent,capture,stage:elements.get('[data-g10-stage]'),document,edits,system:()=>system,noteId,snapshot:()=>window.MathInquiryNotebookSnapshot(),emitRemote(note){system.activities[noteId]=clone(note);subscriber({snapshot:{[SYSTEM_KEY]:clone(system)},pending:0,conflicts:[]});},session};
}

test('a newer tab draft survives reload even when an older local note exists',()=>{
 const saved={consent:true,prediction:'older saved prediction',observation:'saved evidence'},draft={consent:true,prediction:'latest unsaved prediction',observation:'retained draft evidence'};
 const ui=harness({saved,draft});ui.start();
 assert.equal(ui.fields.find(f=>f.dataset.g10Note==='prediction').value,draft.prediction);
 assert.equal(ui.snapshot().notes.observation,draft.observation);
});

test('remote comparison evidence survives the next local capture',()=>{
 const ui=harness({saved:{consent:true,prediction:'prediction',microComparisons:[]}});ui.start();
 const remote={params:{x:-1},summary:'Other tab preserved boundary',rows:[[-1,'extraneous']],columns:['x','status'],at:'2026-10-26T00:00:00Z'};
 ui.emitRemote({consent:true,prediction:'prediction',microComparisons:[remote]});ui.capture.click();
 assert.ok(ui.snapshot().comparisons.some(row=>row.summary===remote.summary));
 assert.ok(ui.system().activities[ui.noteId].microComparisons.some(row=>row.summary===remote.summary));
});

test('malformed native model links recover without a page exception',()=>{
 const query='?model='+encodeURIComponent(JSON.stringify({scenario:'99'}));
 const ui=harness({activityId:'g10-05-01',query});
 assert.doesNotThrow(()=>ui.start());
 assert.ok(ui.snapshot());
});

test('native handle focus survives each update so repeated arrow keys keep moving it',()=>{
 const ui=harness({activityId:'g10-05-12'});ui.start();
 const first=ui.stage.querySelector('[data-direct-handle="x"]');first.focus();
 const press=()=>ui.stage.fire('keydown',{target:ui.document.activeElement,key:'ArrowRight',preventDefault(){}});
 press();const afterFirst=ui.snapshot().params.directState.x;
 assert.equal(ui.document.activeElement.dataset.directHandle,'x','native handle focus was lost during redraw');
 press();const afterSecond=ui.snapshot().params.directState.x;
 assert.ok(afterSecond>afterFirst,'second arrow key must move the selected native object again');
});

test('native alias reuses the original worksheet note and does not create a parallel microtask note',()=>{
 const ui=harness({activityId:'g10-05-04',saved:{consent:true,prediction:'original worksheet note'}});ui.start();
 assert.equal(ui.noteId,'senior:function-worksheet:04');assert.equal(ui.snapshot().notes.prediction,'original worksheet note');
 assert.equal(Object.keys(ui.system().activities).length,1);
});

test('external save consent and revocation sync the checkbox without silently recreating a revoked record',()=>{
 const ui=harness();ui.start();assert.equal(ui.consent.checked,false);
 ui.emitRemote({consent:true,prediction:'Saved by the shared workspace',updatedAt:100});
 assert.equal(ui.consent.checked,true,'child must reflect external opt-in');
 assert.equal(ui.snapshot().notes.consent,true);
 ui.emitRemote(null);
 assert.equal(ui.consent.checked,false,'external deletion/revocation must switch off child saving');
 assert.equal(ui.snapshot().notes.consent,false);
 const editsBefore=ui.edits.length,field=ui.fields.find(f=>f.dataset.g10Note==='prediction');
 field.value='Private draft after revocation';field.fire('input',{target:field});
 assert.equal(ui.snapshot().notes.prediction,field.value,'typing still retains a tab draft');
 assert.equal(ui.edits.length,editsBefore,'typing after revocation must not write to the shared store');
 assert.equal(ui.system().activities[ui.noteId],null,'revoked saved record must not reappear');
});
