import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {initialProgress,loadProgress,saveProgress,STORAGE_KEY} from '../src/lib/jae-math-model.mjs';
import {parseExactNumeric} from '../src/lib/senior-math-numeric.mjs';
import {initialLearning,loadLearning,LEARNING_KEY,classroomUrl,mergeBackup,parseBackup,createBackup,recordLearningEvent,evidenceState,writeBackup} from '../src/lib/senior-math-learning.mjs';
async function client(file,nonce=''){const result=await build({entryPoints:[fileURLToPath(new URL('../src/scripts/'+file,import.meta.url))],bundle:true,write:false,format:'esm',platform:'browser',target:'es2022'});return import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text+'\n// '+nonce).toString('base64'));}
const jae=await client('jae-math-ui.ts');
const sharedSource=await readFile(new URL('../public/math-shared/storage.js',import.meta.url),'utf8');
let importNonce=0;
class Element{
 constructor(){this.dataset={};this.value='';this.checked=false;this.hidden=false;this.textContent='';this.children=[];this.listeners=new Map();this.nodes=new Map();this.lists=new Map();this.attributes={};this.parent=null;this.isConnected=false;this.type='';this._open=false;}
 addEventListener(type,fn){const entries=this.listeners.get(type)||[];entries.push(fn);this.listeners.set(type,entries);}
 fire(type,event={}){for(const fn of this.listeners.get(type)||[])fn({target:this,preventDefault(){},...event,detail:event.detail});}
 dispatchEvent(event){this.fire(event.type,event);return true;}
 setAttribute(k,v){this.attributes[k]=String(v);}
 removeAttribute(k){delete this.attributes[k];}
 append(...items){for(const item of items){if(item&&typeof item==='object'){item.parent=this;item.isConnected=this.isConnected;}this.children.push(item);}}
 replaceChildren(...items){this.children=[];this.append(...items);}
 querySelector(s){if(this.nodes.has(s))return this.nodes.get(s);if(s==='[data-correction-support]')return null;const e=new Element();e.parent=this;this.nodes.set(s,e);return e;}
 querySelectorAll(s){return this.lists.get(s)||[];}
 closest(s){if(s==='[data-classroom-add]')return this.dataset.classroomAdd?this:null;if(s==='[data-question]')return this.dataset.question?this:this.parent?.closest(s)||null;if(s==='.senior-math')return this.host||this.parent?.closest(s)||null;return null;}
 focus(){this.focused=true;}
 getBoundingClientRect(){return {width:0,height:0,top:0,left:0};}
 remove(){this.isConnected=false;this.parent?.children.splice(this.parent.children.indexOf(this),1);}
 click(){this.wasConnectedAtClick=this.isConnected;globalThis.document.downloadClicks?.push(this);this.fire('click');}
 set open(value){const changed=Boolean(value)!==this._open;this._open=Boolean(value);if(changed)queueMicrotask(()=>this.fire('toggle'));}
 get open(){return this._open;}
 get childElementCount(){return this.children.length;}
}
class Input extends Element{}
class Textarea extends Element{}
class Select extends Element{}
function memory(){const values=new Map();return {values,get length(){return values.size;},key:i=>[...values.keys()][i]??null,getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};}
const record=(input='',notes='',correction='')=>({input,notes,correction,completed:false,attempts:0,lastResult:null});
function browser(storage){
 const window=new Element(),document=new Element(),body=new Element();body.isConnected=true;document.body=body;document.downloadClicks=[];document.documentElement={dataset:{},lang:'en'};document.visibilityState='visible';document.querySelector=()=>null;document.createElement=()=>new Element();document.createTextNode=text=>text;document.createElementNS=()=>new Element();
 const location={href:'https://example.test/teaching/senior-math/skills/calculus-tangent/',origin:'https://example.test',search:'',hash:''},timers=new Map();let next=1;const setTimer=fn=>{const id=next++;timers.set(id,fn);return id;};window.setTimeout=setTimer;window.localStorage=storage;window.innerHeight=800;window.print=()=>{};
 let writerQueue=Promise.resolve();window.navigator={locks:{request(_name,work){const result=writerQueue.then(work);writerQueue=result.catch(()=>{});return result;}}};vm.runInNewContext(sharedSource,{window,Promise,Set,Map,Date,Math,JSON,Object,Array,Number,Error});
 const saved=new Map();const globals={window,document,location,localStorage:storage,history:{replaceState(_a,_b,value){const url=new URL(value);location.href=url.href;location.search=url.search;location.hash=url.hash;}},HTMLElement:Element,HTMLInputElement:Input,HTMLTextAreaElement:Textarea,HTMLSelectElement:Select,
  ResizeObserver:class{observe(){}},IntersectionObserver:class{observe(){}disconnect(){}},requestAnimationFrame:()=>0,setTimeout:setTimer,clearTimeout:id=>timers.delete(id)};
 for(const [k,v]of Object.entries(globals)){saved.set(k,Object.getOwnPropertyDescriptor(globalThis,k));Object.defineProperty(globalThis,k,{configurable:true,writable:true,value:v});}
 return {window,document,timers,async flush(){for(const [id,fn]of [...timers]){timers.delete(id);fn();}await window.MathStorage.flushAll();await Promise.resolve();},async settle(){await window.MathStorage.flushAll();await Promise.resolve();},restore(){for(const [k,descriptor]of saved)if(descriptor)Object.defineProperty(globalThis,k,descriptor);else delete globalThis[k];}};
}
function studio(id='peer-number-one',kind='number'){
 const root=new Element();root.dataset.locale='en';root.host=new Element();root.host.lists.set('.senior-teacher',[]);
 const question={id,kind,prompt:{en:'Original question',zh:'原創題'},answer:2,primarySkillIds:['calculus-tangent'],relatedSkills:[]};const data=new Element();data.textContent=JSON.stringify([{id:'peer-topic',title:{en:'Peer',zh:'覆核'},questions:[question]}]);root.nodes.set('[data-jae-data]',data);
 const card=new Element();card.dataset.question=id;card.dataset.questionTopic='peer-topic';card.parent=root;const answer=kind==='written'?new Textarea():new Input(),notes=new Textarea(),correction=new Textarea(),complete=new Input(),form=new Element(),details=[1,2,3].map(stage=>{const e=new Element();e.dataset.reveal=String(stage);e.parent=card;return e;}),retry=new Element();
 notes.dataset.record='notes';correction.dataset.record='correction';for(const e of [answer,notes,correction,complete,form,retry])e.parent=card;
 card.nodes.set('[data-number-answer], [data-written-answer]',answer);card.nodes.set('[data-number-answer], [data-written-answer], input[type=radio]',answer);card.nodes.set('[data-completed]',complete);card.nodes.set('form',form);card.nodes.set('[data-independent-retry]',retry);
 card.lists.set('input[type=radio], [data-number-answer], [data-written-answer]',[answer]);card.lists.set('[data-record]',[notes,correction]);card.lists.set('[data-reveal]',details);card.lists.set('[data-number-answer], [data-written-answer]',[answer]);card.lists.set('input[type=radio], [data-completed]',[complete]);
 const printRecord=new Element();printRecord.parent=card;const teacher=new Element();teacher.dataset.print='teacher';const work=new Element();work.dataset.print='work';
 root.nodes.set(`[data-question="${id}"]`,card);root.lists.set('[data-question]',[card]);root.lists.set('.jae-question details',details);root.lists.set('[data-topic], [data-question]',[card]);root.lists.set('[data-print]',[teacher,work]);root.lists.set('[data-print-record]',[printRecord]);
 return {root,card,answer,notes,correction,complete,form,details,retry,teacher,work,printRecord,question};
}
test('malformed version-one stored records stay protected from a subsequent save',async()=>{
 for(const answers of ['unreadable work',[],null,7]){const storage=memory(),raw=JSON.stringify({version:1,answers});storage.values.set(STORAGE_KEY,raw);assert.equal(loadProgress(storage).issue,'corrupt');assert.equal(saveProgress(storage,initialProgress(),new Set()),false);assert.equal(storage.getItem(STORAGE_KEY),raw);}
});
test('undefined zero power is rejected while valid arithmetic and exponent precedence remain intact',async()=>{
 assert.equal(parseExactNumeric('0^0'),null);assert.equal(parseExactNumeric('0^(-0)'),null);assert.equal(parseExactNumeric('0^2'),0);assert.equal(parseExactNumeric('2^0'),1);assert.equal(parseExactNumeric('-2^2'),-4);assert.equal(parseExactNumeric('2^3^2'),512);
});
test('cross-tab updates rehydrate clean answer and notes controls before submitting or printing',async()=>{
 const storage=memory(),p=initialProgress();p.answers['peer-number-one']=record('1','old notes');saveProgress(storage,p);const env=browser(storage);try{const f=studio();jae.initializeJaeMath(f.root);assert.equal(f.answer.value,'1');const other=loadProgress(storage).progress;other.answers['peer-number-one']=record('2','new notes from another tab','new correction');saveProgress(storage,other,new Set(['peer-number-one']));env.window.fire('storage',{key:STORAGE_KEY});await env.settle();assert.equal(f.answer.value,'2');assert.equal(f.notes.value,'new notes from another tab');f.form.fire('submit');await env.settle();assert.equal(loadProgress(storage).progress.answers['peer-number-one'].input,'2');f.work.fire('click');assert.match(f.printRecord.textContent,/new notes from another tab/);assert.match(f.printRecord.textContent,/new correction/);}finally{await env.settle();env.restore();}
});
test('cross-tab updates also rehydrate a clean inquiry or targeted-reading response',async()=>{
 const storage=memory(),p=initialProgress(),id='peer-lesson-inquiry-1';p.answers[id]=record('','initial inquiry reasoning');saveProgress(storage,p);const env=browser(storage);
 try{const f=studio(),lab=new Element(),note=new Textarea();lab.dataset.lessonId='peer-lesson';lab.nodes.set('[data-inquiry-note]',note);f.root.lists.set('[data-senior-reading]',[lab]);jae.initializeJaeMath(f.root);assert.equal(note.value,'initial inquiry reasoning');const other=loadProgress(storage).progress;other.answers[id].notes='new inquiry reasoning from another tab';saveProgress(storage,other,new Set([id]));env.window.fire('storage',{key:STORAGE_KEY});await env.settle();assert.equal(note.value,'new inquiry reasoning from another tab');}finally{await env.settle();env.restore();}
});
test('a failed save followed by a storage event preserves unsaved session work and metadata',async()=>{
 const storage=memory(),p=initialProgress();p.answers['peer-number-one']=record('1','old notes');saveProgress(storage,p);const env=browser(storage);
 try{const f=studio();jae.initializeJaeMath(f.root);f.answer.value='9';f.answer.fire('input');f.notes.value='unsaved session notes';f.notes.fire('input');storage.setItem=()=>{throw Error('quota');};env.window.fire('storage',{key:STORAGE_KEY});await env.settle();f.work.fire('click');assert.match(f.printRecord.textContent,/My answer: 9/);assert.match(f.printRecord.textContent,/unsaved session notes/);assert.equal(loadProgress(storage).progress.answers['peer-number-one'].input,'1','failed writes cannot claim persistence');}finally{await env.settle();env.restore();}
});
test('a failed second-document commit rolls back partial progress while retaining session evidence',async()=>{
 const storage=memory(),env=browser(storage);let snapshot;
 try{const f=studio('peer-written-one','written');f.root.addEventListener('jae-progress',e=>snapshot=e.detail);jae.initializeJaeMath(f.root);f.answer.value='My proof';f.answer.fire('input');f.notes.value='Because both sides have the same coefficients';f.notes.fire('input');const write=storage.setItem;storage.setItem=(key,value)=>{if(key===LEARNING_KEY)throw Error('quota');write(key,value);};f.complete.checked=true;f.complete.fire('change');await env.settle();assert.equal(loadProgress(storage).progress.answers[f.question.id],undefined,'partial progress commit is rolled back');assert.equal(snapshot.learning.selfAssessments[f.question.id].pending,false);env.window.fire('storage',{key:STORAGE_KEY});await env.settle();assert.equal(snapshot.learning.selfAssessments[f.question.id]?.pending,false);assert.equal(snapshot.learning.history[f.question.id].at(-1).result,'self-assessed');}finally{await env.settle();env.restore();}
});
test('a hint-only change does not overwrite another tab\'s correction categories for the same question',async()=>{
 const storage=memory(),id='peer-number-one',learning=initialLearning();learning.categories[id]=['conditions'];storage.values.set(LEARNING_KEY,JSON.stringify(learning));const env=browser(storage);
 try{const f=studio(id);jae.initializeJaeMath(f.root);const other=loadLearning(storage).learning;other.categories[id]=['algebra'];storage.values.set(LEARNING_KEY,JSON.stringify(other));f.details[0].open=true;await Promise.resolve();await env.flush();const merged=loadLearning(storage).learning;assert.deepEqual(merged.categories[id],['algebra']);assert.equal(merged.hints[id].stage,1);}finally{await env.settle();env.restore();}
});
test('a local answer edit merges rather than overwrites another tab\'s untouched reasoning field',async()=>{
 const storage=memory(),id='peer-number-one',p=initialProgress();p.answers[id]=record('1','initial notes');saveProgress(storage,p);const env=browser(storage);
 try{const f=studio(id);jae.initializeJaeMath(f.root);const other=loadProgress(storage).progress;other.answers[id].notes='new independent reasoning';saveProgress(storage,other,new Set([id]));f.answer.value='2';f.answer.fire('input');await env.flush();const merged=loadProgress(storage).progress.answers[id];assert.equal(merged.input,'2');assert.equal(merged.notes,'new independent reasoning');}finally{await env.settle();env.restore();}
});
test('a first reasoning draft does not clear another tab\'s answer on a previously absent record',async()=>{
 const storage=memory(),id='peer-number-one',env=browser(storage);
 try{const f=studio(id);jae.initializeJaeMath(f.root);f.notes.value='First reasoning draft';f.notes.fire('input');const other=loadProgress(storage).progress;other.answers[id]=record('2');saveProgress(storage,other,new Set([id]));await env.flush();const merged=loadProgress(storage).progress.answers[id];assert.equal(merged.input,'2');assert.equal(merged.notes,'First reasoning draft');env.window.fire('storage',{key:STORAGE_KEY});await env.settle();assert.equal(f.answer.value,'2');assert.equal(f.notes.value,'First reasoning draft');}finally{await env.settle();env.restore();}
});
test('a first answer draft does not clear another tab\'s reasoning on a previously absent record',async()=>{
 const storage=memory(),id='peer-number-one',env=browser(storage);
 try{const f=studio(id);jae.initializeJaeMath(f.root);f.answer.value='2';f.answer.fire('input');const other=loadProgress(storage).progress;other.answers[id]=record('','First reasoning from another tab');saveProgress(storage,other,new Set([id]));await env.flush();const merged=loadProgress(storage).progress.answers[id];assert.equal(merged.input,'2');assert.equal(merged.notes,'First reasoning from another tab');}finally{await env.settle();env.restore();}
});
test('independent retry clears current working but retains the historical answer and reasoning',async()=>{
 const storage=memory(),p=initialProgress(),id='peer-number-one';p.answers[id]={...record('2','earlier reasoning','earlier correction'),checkedInput:'2',lastResult:'correct'};saveProgress(storage,p);const learning=initialLearning();recordLearningEvent(learning,id,p.answers[id],'correct','2026-10-08T00:00:00Z','review-event-one');storage.values.set(LEARNING_KEY,JSON.stringify(learning));const env=browser(storage);
 try{const f=studio();jae.initializeJaeMath(f.root);f.retry.fire('click');await env.settle();const current=loadProgress(storage).progress.answers[id];assert.deepEqual([current.input,current.notes,current.correction],['','','']);assert.deepEqual([f.answer.value,f.notes.value,f.correction.value],['','','']);const prior=loadLearning(storage).learning.history[id][0];assert.equal(prior.notes,'earlier reasoning');assert.equal(prior.correction,'earlier correction');}finally{await env.settle();env.restore();}
});
test('independent retry resets the classroom hint button as well as the question details',async()=>{
 const storage=memory(),env=browser(storage);try{location.href+='?mode=classroom';location.search='?mode=classroom';const f=studio();jae.initializeJaeMath(f.root);const next=f.root.querySelector('[data-reveal-next]');next.fire('click');next.fire('click');next.fire('click');assert.equal(next.disabled,true);f.retry.fire('click');assert.equal(f.details.every(d=>!d.open),true);assert.equal(next.disabled,false);assert.match(next.textContent,/Reveal hint 1/);}finally{await env.settle();env.restore();}
});
test('teacher print opening solutions does not fabricate student hint-use evidence',async()=>{
 const storage=memory(),env=browser(storage);try{const f=studio();jae.initializeJaeMath(f.root);f.teacher.fire('click');await Promise.resolve();await env.flush();assert.equal(loadLearning(storage).learning.hints[f.question.id],undefined);env.window.fire('afterprint');await Promise.resolve();await env.flush();assert.equal(loadLearning(storage).learning.hints[f.question.id],undefined);}finally{await env.settle();env.restore();}
});
test('classroom fallback retains multiple selections when reads, writes or stored learning are unavailable',async()=>{
 for(const failure of ['read','write','corrupt']){const storage=memory();if(failure==='read')storage.getItem=()=>{throw Error('denied');};if(failure==='write')storage.setItem=()=>{throw Error('quota');};if(failure==='corrupt')storage.values.set(LEARNING_KEY,'{broken');const env=browser(storage);
  try{const workspace=await client('senior-math-workspace-ui.ts','selection-'+importNonce++);workspace.initializeClassroomSelection();const first=new Element(),second=new Element(),again=new Element();first.dataset.classroomAdd=again.dataset.classroomAdd='peer-item-first';second.dataset.classroomAdd='peer-item-second';env.document.fire('click',{target:first});env.document.fire('click',{target:second});env.document.fire('click',{target:again});assert.match(again.textContent,/Already selected/,failure);}finally{await env.settle();env.restore();}
 }
});
test('workspace backup download attaches its anchor before clicking',async()=>{
 const storage=memory(),env=browser(storage),previousFetch=globalThis.fetch;globalThis.fetch=async()=>({ok:true,json:async()=>[]});try{const workspace=await client('senior-math-workspace-ui.ts','download-'+importNonce++),root=new Element();root.dataset.locale='en';root.dataset.mathWorkspace='my-learning';await workspace.initializeMathWorkspace(root);root.querySelector('[data-backup-download]').fire('click');assert.equal(env.document.downloadClicks.length,1);assert.equal(env.document.downloadClicks[0].wasConnectedAtClick,true);}finally{await env.settle();globalThis.fetch=previousFetch;env.restore();}
});
test('a shared classroom query survives remote storage events and seeds its selection only on an explicit move',async()=>{
 const storage=memory(),env=browser(storage),previousFetch=globalThis.fetch,index=['peer-item-one','peer-item-two','peer-item-other'].map(id=>({id,url:'/questions/'+id+'/',prompt:id}));
 globalThis.fetch=async url=>String(url).endsWith('bank-index.json')?{ok:true,json:async()=>index}:{ok:false};
 try{location.search='?q=peer-item-one,peer-item-two&title=Shared%20selection';location.href=location.origin+'/teaching/senior-math/classroom/'+location.search;const stage=new Element();env.document.querySelector=selector=>selector==='[data-classroom-stage] [data-jae-studio]'?stage:null;
  const workspace=await client('senior-math-workspace-ui.ts','query-'+importNonce++),root=new Element();root.dataset.locale='en';root.dataset.mathWorkspace='classroom';await workspace.initializeMathWorkspace(root);
  const other=env.window.MathStorage.createStore({namespace:'senior-math',storage,defaults:{[STORAGE_KEY]:initialProgress(),[LEARNING_KEY]:initialLearning()}});other.edit({key:LEARNING_KEY,path:['classroom','ids'],kind:'array-add',value:'peer-item-other'});await other.flush();env.window.fire('storage',{key:LEARNING_KEY});await env.settle();
  assert.equal(root.querySelector('[data-classroom-title]').value,'Shared selection');assert.equal(new URL(root.querySelector('[data-classroom-link]').value).searchParams.get('q'),'peer-item-one,peer-item-two');assert.deepEqual(loadLearning(storage).learning.classroom.ids,['peer-item-other'],'opening the query never replaces the local list');
  root.querySelector('[data-classroom-list]').children[0].children[2].fire('click');await env.settle();assert.deepEqual(loadLearning(storage).learning.classroom.ids,['peer-item-other','peer-item-two','peer-item-one']);assert.equal(loadLearning(storage).learning.classroom.title,'Shared selection');
 }finally{await env.settle();globalThis.fetch=previousFetch;env.restore();}
});
test('default backup merge keeps local drafts and settings while adding evidence; share URL has only allowed fields',async()=>{
 const local=initialProgress(),incoming=initialProgress(),learning=initialLearning(),otherLearning=initialLearning();local.answers['peer-item-one']=record('private local','private notes');incoming.answers['peer-item-one']=record('incoming');learning.categories['peer-item-one']=['conditions'];otherLearning.categories['peer-item-one']=['algebra'];recordLearningEvent(otherLearning,'peer-item-one',incoming.answers['peer-item-one'],'incorrect','2026-10-08T00:00:00Z','backup-event-one');const result=mergeBackup(local,learning,parseBackup(createBackup(incoming,otherLearning)));assert.equal(result.progress.answers['peer-item-one'].input,'private local');assert.deepEqual(result.learning.categories['peer-item-one'],['conditions']);assert.equal(result.learning.history['peer-item-one'].length,1);
 const params=new URL(classroomUrl(['peer-item-one'],'Class','zh-Hant'),'https://example.test').searchParams;assert.deepEqual([...params.keys()],['q','title','mode']);assert.ok(!params.toString().includes('private'));
});
test('backup import rejects corrupt record containers instead of silently dropping their contents',async()=>{
 for(const map of ['history','everWrong','categories','reviews','hints','selfAssessments']){const body=createBackup(initialProgress(),initialLearning());body.learning[map]='unreadable records';assert.throws(()=>parseBackup(body),map);}
 const old={version:1,answers:{'peer-item-one':'unreadable answer'}};assert.throws(()=>parseBackup(old));
});
test('failed second-key import rolls the first key back and preserves the caller session',async()=>{
 const storage=memory(),local=initialProgress(),learning=initialLearning(),incoming=initialProgress();local.answers['peer-item-one']=record('original private draft');incoming.answers['peer-item-two']=record('incoming');storage.values.set(STORAGE_KEY,JSON.stringify(local));storage.values.set(LEARNING_KEY,JSON.stringify(learning));const before=[storage.getItem(STORAGE_KEY),storage.getItem(LEARNING_KEY)];let failed=false;const write=storage.setItem;storage.setItem=(key,value)=>{if(key===LEARNING_KEY&&!failed){failed=true;throw Error('quota');}write(key,value);};const result=writeBackup(storage,local,learning,parseBackup(createBackup(incoming,initialLearning())));assert.equal(result.ok,false);assert.equal(result.progress,local);assert.equal(result.learning,learning);assert.deepEqual([storage.getItem(STORAGE_KEY),storage.getItem(LEARNING_KEY)],before);
});
