import test from 'node:test';
import assert from 'node:assert/strict';
import {initialProgress,loadProgress,saveProgress,STORAGE_KEY} from '../src/lib/jae-math-model.mjs';
import {parseExactNumeric} from '../src/lib/senior-math-numeric.mjs';
import {LEARNING_KEY,HISTORY_LIMIT,initialLearning,normalizeLearning,loadLearning,saveLearning,recordLearningEvent,markWrittenDraftChanged,evidenceState,scheduleReview,createBackup,parseBackup,backupPreview,mergeBackup,writeBackup,classroomUrl} from '../src/lib/senior-math-learning.mjs';
const store=()=>{const values=new Map();return {values,getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};};
const rec=(input='')=>({input,notes:'',correction:'',completed:false,attempts:0,lastResult:null});
test('Bounded arithmetic respects precedence, constants and radical expressions without code execution',()=>{
 for(const [input,expected]of [['2+3*4',14],['(2+3)*4',20],['-2^2',-4],['(-2)^2',4],['2^3^2',512],['sqrt(2)^2',2],['√9',3],['2π/3',2*Math.PI/3],['1/2/3',1/6],['3(2+1)',9],['2sqrt(4)',4],['−3×2÷4',-1.5]])assert(Math.abs(parseExactNumeric(input)-expected)<1e-10,input);
 for(const input of ['', '1/0','0^0','0^-1','sqrt(-1)','1e309','Math.PI','process.exit()','globalThis.x=1','2;3','2 3','2**3','pi.constructor','9^101','('.repeat(17)+'1'+')'.repeat(17),'1'.repeat(201),'<img>'])assert.equal(parseExactNumeric(input),null,input);
});
test('Changing or clearing a self-assessed written draft preserves earlier assessment and requires another review',()=>{
 const learning=initialLearning(),id='written-example-test',entry=rec('proof');entry.completed=true;
 recordLearningEvent(learning,id,entry,'self-assessed','2026-10-08T01:00:00Z','assessment-1');
 assert.equal(evidenceState({id,kind:'written'},entry,learning),'self-assessed');entry.input='';markWrittenDraftChanged(learning,id,entry);
 assert.equal(entry.completed,false);assert.equal(evidenceState({id,kind:'written'},entry,learning),'self-review-pending');assert.equal(learning.history[id][0].input,'proof');
 const n=learning.history[id].length;markWrittenDraftChanged(learning,id,entry);assert.equal(learning.history[id].length,n,'typing does not repeatedly append pending assessments');
 entry.completed=true;recordLearningEvent(learning,id,entry,'self-assessed');entry.notes='revised reasoning';markWrittenDraftChanged(learning,id,entry);assert.equal(entry.completed,false);
});
test('Independent, assisted and legacy correct answers remain separate; reading a solution later does not rewrite an earlier assessment',()=>{
 const id='numeric-example-test',question={id,kind:'number'},entry={...rec('2'),lastResult:'correct',checkedInput:'2'},learning=initialLearning();
 assert.equal(evidenceState(question,entry,learning),'legacy-correct');recordLearningEvent(learning,id,entry,'correct');assert.equal(evidenceState(question,entry,learning),'independent-correct');
 learning.hints[id]={stage:3,at:new Date().toISOString()};assert.equal(evidenceState(question,entry,learning),'independent-correct');recordLearningEvent(learning,id,entry,'correct');assert.equal(evidenceState(question,entry,learning),'assisted-correct');entry.input='3';assert.equal(evidenceState(question,entry,learning),'pending');
});
test('History enforces five events per item and a global byte cap without removing ever-wrong or retry metadata',()=>{
 const raw=initialLearning();for(let j=0;j<200;j++){const id='history-item-'+j;raw.history[id]=Array.from({length:8},(_,i)=>({eventId:id+'-'+i,at:new Date(Date.UTC(2026,0,1,i)).toISOString(),input:'x'.repeat(6000),notes:'y'.repeat(10000),result:i?'correct':'incorrect'}));raw.everWrong[id]=true;}
 raw.reviews['history-item-0']={dueAt:'2026-10-12T00:00:00Z'};const clean=normalizeLearning(raw);
 assert(new TextEncoder().encode(JSON.stringify(clean.history)).length<=HISTORY_LIMIT);assert(Object.values(clean.history).every(events=>events.length<=5));assert.equal(Object.keys(clean.everWrong).length,200);assert(clean.reviews['history-item-0']);assert(clean.trimmed>0);
});
test('Disjoint multi-tab writes merge histories, drafts and classroom lists',()=>{
 const storage=store(),a=initialLearning(),b=initialLearning();recordLearningEvent(a,'tab-item-a',rec('A'),'incorrect');recordLearningEvent(b,'tab-item-b',rec('B'),'correct');
 a.classroom={title:'Class A',ids:['tab-item-a']};assert(saveLearning(storage,a,new Set(['tab-item-a']),true));assert(saveLearning(storage,b,new Set(['tab-item-b'])));
 const merged=loadLearning(storage).learning;assert(merged.everWrong['tab-item-a']);assert(merged.history['tab-item-b']);assert.deepEqual(merged.classroom,a.classroom);
 const pa=initialProgress(),pb=initialProgress();pa.answers['tab-item-a']=rec('A');pb.answers['tab-item-b']=rec('B');assert(saveProgress(storage,pa,new Set(['tab-item-a'])));assert(saveProgress(storage,pb,new Set(['tab-item-b'])));assert.equal(Object.keys(loadProgress(storage).progress.answers).length,2);
});
test('Old backups import, unknown records survive, metadata histories merge and conflicting drafts default to local',()=>{
 const p=initialProgress();p.answers['known-item-one']=rec('local');const learning=initialLearning();learning.classroom={title:'Local class',ids:['known-item-one']};learning.categories['known-item-one']=['conditions'];
 const old=initialProgress();old.answers['known-item-one']=rec('incoming');old.answers['unknown-item-two']=rec('retained');assert.equal(parseBackup(JSON.stringify(old)).version,1);
 const incomingLearning=initialLearning();incomingLearning.categories['known-item-one']=['algebra'];incomingLearning.everWrong['known-item-one']=true;recordLearningEvent(incomingLearning,'known-item-one',rec('incoming'),'incorrect');incomingLearning.classroom={title:'Incoming',ids:['unknown-item-two']};
 const incoming=parseBackup(createBackup(old,incomingLearning));const preview=backupPreview(p,incoming,new Set(['known-item-one']),learning);assert.equal(preview[0].status,'conflict');assert.equal(preview[1].known,false);
 const merged=mergeBackup(p,learning,incoming);assert.equal(merged.progress.answers['known-item-one'].input,'local');assert.equal(merged.progress.answers['unknown-item-two'].input,'retained');assert(merged.learning.everWrong['known-item-one']);assert(merged.learning.history['known-item-one']);assert.deepEqual(merged.learning.categories['known-item-one'],['conditions']);assert.equal(merged.learning.classroom.title,'Local class');
 const selected=mergeBackup(p,learning,incoming,new Set(['known-item-one']),true);assert.equal(selected.progress.answers['known-item-one'].input,'incoming');assert.equal(selected.learning.classroom.title,'Incoming');
 for(const raw of ['{}','[]','{broken',JSON.stringify({version:1,answers:[]}),JSON.stringify({version:2,progress:old,learning:{version:3}})])assert.throws(()=>parseBackup(raw));
});
test('Import rereads concurrent local work and restores original bytes when the second write fails',()=>{
 const storage=store(),current=initialProgress(),learning=initialLearning();current.answers['local-item-one']=rec('stale');saveProgress(storage,current);saveLearning(storage,learning);
 const fresh=loadProgress(storage).progress;fresh.answers['local-item-one'].input='new other-tab draft';saveProgress(storage,fresh);
 const incoming=initialProgress();incoming.answers['local-item-one']=rec('backup');incoming.answers['new-item-two']=rec('new');
 const result=writeBackup(storage,current,learning,parseBackup(incoming));assert(result.ok);assert.equal(result.progress.answers['local-item-one'].input,'new other-tab draft');
 const beforeProgress=storage.getItem(STORAGE_KEY),beforeLearning=storage.getItem(LEARNING_KEY);let fail=true;const set=storage.setItem;storage.setItem=(key,value)=>{if(key===LEARNING_KEY&&fail){fail=false;throw Error('quota');}set(key,value);};
 assert.equal(writeBackup(storage,result.progress,result.learning,parseBackup(incoming),new Set(['local-item-one'])).ok,false);assert.equal(storage.getItem(STORAGE_KEY),beforeProgress);assert.equal(storage.getItem(LEARNING_KEY),beforeLearning);
 const denied={getItem(){throw Error('denied');},setItem(){throw Error('denied');}};assert.equal(writeBackup(denied,current,learning,parseBackup(incoming)).ok,false);assert.equal(loadLearning(denied).available,false);
 storage.values.set(LEARNING_KEY,'{broken');assert.equal(saveLearning(storage,learning),false);assert.equal(storage.getItem(LEARNING_KEY),'{broken');
});
test('Retry dates are exactly three or seven calendar days and sharing includes no answers',()=>{
 const l=initialLearning();assert(scheduleReview(l,'review-item-one',3,new Date('2026-10-08T01:00:00Z')));assert.equal(l.reviews['review-item-one'].dueAt,'2026-10-11T01:00:00.000Z');assert.equal(scheduleReview(l,'review-item-one',2),false);
 const url=classroomUrl(Array.from({length:40},(_,i)=>'classroom-item-'+i),'Class title','zh-Hant');const params=new URL(url,'https://example.test').searchParams;assert.equal(params.get('q').split(',').length,30);assert.deepEqual([...params.keys()],['q','title','mode']);assert(url.startsWith('/zh/teaching/senior-math/classroom/'));
});
