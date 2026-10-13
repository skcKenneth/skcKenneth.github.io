import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../public/math-shared/storage.js',import.meta.url),'utf8');
const plain=value=>JSON.parse(JSON.stringify(value));
function memory(seed={}){const values=new Map(Object.entries(seed));return {values,get length(){return values.size;},key:i=>[...values.keys()][i]??null,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};}
function locks(){let queue=Promise.resolve();return {request(_name,work){const next=queue.then(work);queue=next.catch(()=>{});return next;}};}
function runtime(storage,lock=locks()){const handlers=new Map(),host={navigator:{locks:lock},crypto:{randomUUID:()=>Math.random().toString(36).slice(2)},addEventListener(name,fn){const list=handlers.get(name)||[];list.push(fn);handlers.set(name,list);},removeEventListener(){}};vm.runInNewContext(source,{window:host,Promise,Set,Map,Date,Math,JSON,Object,Array,Number,Error});return {...host.MathStorage,fire(name,event){for(const fn of handlers.get(name)||[])fn(event||{});},store(options={}){return host.MathStorage.createStore({namespace:'test-math',storage,defaults:{progress:{answers:{}},learning:{history:{},classroom:{title:'',ids:[]}}},...options});}};}
test('overlapping distinct-field writers retain both first drafts and additive assessment evidence',async()=>{
 const storage=memory(),lock=locks(),a=runtime(storage,lock).store(),b=runtime(storage,lock).store();
 a.edit({key:'progress',path:['answers','q','input'],base:'',defaultValue:'',value:'2'});a.edit({key:'progress',path:['answers','q','attempts'],kind:'increment',value:1});a.edit({key:'learning',path:['history','q'],kind:'append',value:{eventId:'assessment-a',input:'2'}});
 b.edit({key:'progress',path:['answers','q','notes'],base:'',defaultValue:'',value:'because'});
 const results=await Promise.all([a.flush(),b.flush()]);assert(results.every(result=>result.ok));assert.deepEqual(JSON.parse(storage.getItem('progress')).answers.q,{input:'2',attempts:1,notes:'because'});assert.equal(JSON.parse(storage.getItem('learning')).history.q.length,1);
 await b.flush();assert.equal(JSON.parse(storage.getItem('learning')).history.q.length,1,'a clean save cannot erase evidence');
});
test('event IDs deduplicate while independent checks increment rather than overwrite',async()=>{
 const storage=memory(),lock=locks(),a=runtime(storage,lock).store(),b=runtime(storage,lock).store();
 for(const store of [a,b]){store.edit({key:'progress',path:['answers','q','attempts'],kind:'increment',value:1});store.edit({key:'learning',path:['history','q'],kind:'append',value:{eventId:'same-event'}});}
 await Promise.all([a.flush(),b.flush()]);assert.equal(JSON.parse(storage.getItem('progress')).answers.q.attempts,2);assert.equal(JSON.parse(storage.getItem('learning')).history.q.length,1);
});

test('overlapping event removal and append preserve unrelated events and every unidentified legacy row',async()=>{
 for(const appendFirst of [true,false]){
  const legacy={at:'2026-09-01',notes:'legacy duplicate'},target={eventId:'remove-me',notes:'selected'},keep={eventId:'keep-me',notes:'earlier'};
  const storage=memory({learning:JSON.stringify({history:{q:[legacy,legacy,target,keep]},classroom:{title:'',ids:[]}})}),lock=locks(),a=runtime(storage,lock).store(),b=runtime(storage,lock).store();
  let release,entered;const enteredPromise=new Promise(resolve=>entered=resolve),gate=lock.request('math-learning:writer:v1',async()=>{entered();await new Promise(resolve=>release=resolve);});await enteredPromise;
  a.edit({key:'learning',path:['history','q'],kind:'event-remove',value:{eventId:'remove-me'}});b.edit({key:'learning',path:['history','q'],kind:'append',value:{eventId:'new-peer-event',notes:'added while delete waits'}});
  const writes=appendFirst?[b.flush(),a.flush()]:[a.flush(),b.flush()];release();await gate;assert((await Promise.all(writes)).every(result=>result.ok));
  const expected=[legacy,legacy,keep,{eventId:'new-peer-event',notes:'added while delete waits'}];assert.deepEqual(JSON.parse(storage.getItem('learning')).history.q,expected);
  a.edit({key:'learning',path:['history','q'],kind:'event-remove',value:{eventId:'remove-me'}});await a.flush();assert.deepEqual(JSON.parse(storage.getItem('learning')).history.q,expected,'repeated deletion is idempotent');
  assert.throws(()=>a.edit({key:'learning',path:['history','q'],kind:'event-remove',value:legacy}),/stable event ID/);assert.throws(()=>a.edit({key:'learning',path:[],kind:'event-remove',value:{eventId:'keep-me'}}),/stable event ID/);assert.deepEqual(JSON.parse(storage.getItem('learning')).history.q,expected,'unidentified legacy records are never guessed or rewritten');
 }
});
test('same-field conflict preserves both versions and requires a selected resolution',async()=>{
 const storage=memory({progress:JSON.stringify({answers:{q:{input:'old'}}})}),lock=locks(),a=runtime(storage,lock).store(),b=runtime(storage,lock).store();
 a.edit({key:'progress',path:['answers','q','input'],base:'old',value:'A'});b.edit({key:'progress',path:['answers','q','input'],base:'old',value:'B'});await a.flush();const result=await b.flush();assert.equal(result.status,'conflict');assert.equal(JSON.parse(storage.getItem('progress')).answers.q.input,'A');assert.equal(b.snapshot().progress.answers.q.input,'B');assert.equal(b.conflicts()[0].remote,'A');assert(b.exportRecovery().recoveries.length>=2);
 await b.resolve(b.conflicts()[0].id,'local');assert.equal(JSON.parse(storage.getItem('progress')).answers.q.input,'B');assert.equal(b.conflicts().length,0);
});
test('classroom operations use the latest list and a title edit retains remote additions',async()=>{
 const storage=memory(),lock=locks(),a=runtime(storage,lock).store(),b=runtime(storage,lock).store();
 a.edit({key:'learning',path:['classroom','ids'],kind:'array-add',value:'one'});b.edit({key:'learning',path:['classroom','ids'],kind:'array-add',value:'two'});await Promise.all([a.flush(),b.flush()]);a.edit({key:'learning',path:['classroom','title'],base:'',value:'Tomorrow'});await a.flush();assert.deepEqual(JSON.parse(storage.getItem('learning')).classroom,{title:'Tomorrow',ids:['one','two']});
 a.edit({key:'learning',path:['classroom','ids'],kind:'array-move',value:{id:'two',beforeId:'one'}});b.edit({key:'learning',path:['classroom','ids'],kind:'array-add',value:'three'});await Promise.all([a.flush(),b.flush()]);assert.deepEqual(JSON.parse(storage.getItem('learning')).classroom.ids,['two','one','three']);
});
test('without Web Locks originals are read but never rewritten; immediate export retains pending work',async()=>{
 const raw=JSON.stringify({answers:{q:{input:'old'}}}),storage=memory({progress:raw}),r=runtime(storage,null),store=r.store();store.edit({key:'progress',path:['answers','q','input'],base:'old',value:'session'});r.fire('pagehide');assert.equal((await store.flush()).ok,false);assert.equal(storage.getItem('progress'),raw);assert.equal(store.snapshot().progress.answers.q.input,'session');assert.equal(store.exportRecovery().pending.length,1);assert(store.recoveries().length>0);
});
test('a second-document failure rolls back owned bytes and retains the session snapshot',async()=>{
 const p=JSON.stringify({answers:{}}),l=JSON.stringify({history:{},classroom:{title:'',ids:[]}}),storage=memory({progress:p,learning:l}),store=runtime(storage).store(),write=storage.setItem;store.edit({key:'progress',path:['answers','q','input'],value:'new'});store.edit({key:'learning',path:['history','q'],kind:'append',value:{eventId:'new-event'}});storage.setItem=(key,value)=>{if(key==='learning')throw Error('quota');write(key,value);};const result=await store.flush();assert.equal(result.ok,false);assert.equal(storage.getItem('progress'),p);assert.equal(storage.getItem('learning'),l);assert.equal(store.snapshot().progress.answers.q.input,'new');assert.equal(store.exportRecovery().pending.length,2);
});
test('an uncoordinated legacy writer is detected and neither version is silently overwritten',async()=>{
 const storage=memory(),r=runtime(storage),store=r.store();store.edit({key:'progress',path:['answers','q','input'],value:'new-client'});await store.flush();storage.setItem('progress',JSON.stringify({answers:{q:{input:'old-tab'}}}));store.refresh();await store.flush();assert.equal(store.state().status,'external-change');assert.equal(storage.getItem('progress'),JSON.stringify({answers:{q:{input:'old-tab'}}}));assert(store.conflicts().some(conflict=>conflict.external));assert(store.recoveries().some(recovery=>recovery.snapshot.progress.answers.q.input==='new-client'));
});
test('edits arriving while an import awaits remain pending and visible',async()=>{
 const storage=memory(),store=runtime(storage).store();let release,entered;const enteredPromise=new Promise(resolve=>entered=resolve),gate=new Promise(resolve=>release=resolve);
 const transaction=store.transact(async docs=>{entered();await gate;docs.progress.answers.imported={input:'backup'};return docs;});await enteredPromise;store.edit({key:'progress',path:['answers','current','notes'],value:'typed during import'});release();assert.equal((await transaction).ok,true);assert.equal(store.snapshot().progress.answers.current.notes,'typed during import');await store.flush();assert.equal(JSON.parse(storage.getItem('progress')).answers.current.notes,'typed during import');
});
test('raw restoration stamps per-key commits for stores in other namespaces and preserves exact bytes',async()=>{
 const storage=memory(),lock=locks(),a=runtime(storage,lock),b=runtime(storage,lock),store=a.store(),other=b.store({namespace:'other-math'});store.edit({key:'progress',path:['answers','q','input'],value:'first'});await store.flush();const raw='{ "answers": { "q": { "input": "restored", "unknown": true } } }';assert.equal((await b.restoreRaw({storage,replacements:{progress:raw},expected:{progress:storage.getItem('progress')}})).ok,true);store.refresh();await store.flush();assert.equal(store.state().status,'saved');assert.equal(storage.getItem('progress'),raw);assert.equal(other.snapshot().progress.answers.q.unknown,true);
});
test('legacy seeds fill only missing fields, max counters are monotonic, and opt-out removes recovery',async()=>{
 const storage=memory(),lock=locks(),a=runtime(storage,lock).store(),b=runtime(storage,lock).store();for(const store of [a,b])store.edit({key:'progress',path:['answers','q'],kind:'seed',value:{input:'legacy',unknown:{retained:true}}});a.edit({key:'progress',path:['answers','q','notes'],value:'A'});b.edit({key:'progress',path:['answers','q','correction'],value:'B'});await Promise.all([a.flush(),b.flush()]);assert.deepEqual(JSON.parse(storage.getItem('progress')).answers.q,{input:'legacy',unknown:{retained:true},notes:'A',correction:'B'});
 a.edit({key:'progress',path:['exposure'],kind:'max',value:20});b.edit({key:'progress',path:['exposure'],kind:'max',value:10});await Promise.all([a.flush(),b.flush()]);assert.equal(JSON.parse(storage.getItem('progress')).exposure,20);assert(a.recoveries().some(recovery=>recovery.writer===a.writer));a.setRecoveryEnabled(false);assert(!a.recoveries().some(recovery=>recovery.writer===a.writer));
 const isolated=memory({progress:'{"answers":{}}'}),r=runtime(isolated),optout=r.store({recovery:false});optout.edit({key:'progress',path:[],kind:'remove-key',base:{answers:{}}});await optout.flush();assert.equal(isolated.getItem('progress'),null);assert.equal(optout.recoveries().length,0);
});
