import test from 'node:test';
import {lessonCheck} from '../src/lib/senior-math-check.mjs';
import {isCurrentChecked} from '../src/lib/senior-math-check.mjs';
import {progressForExport,readableProgress} from '../src/lib/jae-math-export.mjs';
import assert from 'node:assert/strict';
import {binomialMass,simulateBinomial,regression,inquiryScene,inquiryControls,inquiryTypes} from '../src/lib/senior-math-inquiry.mjs';
import {initialProgress,saveProgress,loadProgress,checkAnswer,STORAGE_KEY} from '../src/lib/jae-math-model.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('Finite probability simulations preserve trial counts and deterministic endpoints',()=>{
 assert.deepEqual(simulateBinomial(3,0).counts,[200,0,0,0]);assert.deepEqual(simulateBinomial(3,1).counts,[0,0,0,200]);
 const sample=simulateBinomial(5,.4,37,10000);assert.equal(sample.counts.reduce((a,b)=>a+b,0),10000);assert(Math.abs(sample.mean-2)<.05);assert.deepEqual(simulateBinomial(5,.4,37,10000),sample);
});
test('Specialised explorations preserve matrix, polar, sampling and geometric conditions',()=>{
 const matrix=inquiryScene('matrices',2,3).values;assert.equal(matrix.determinant,-5);assert.deepEqual(matrix.AB,[[7,2],[3,1]]);assert.deepEqual(matrix.BA,[[1,2],[3,7]]);
 const polar=inquiryScene('polar',-2,90).values;near(polar.x,0);near(polar.y,-2);
 for(let n=0;n<=10;n++)for(let K=0;K<=10;K++){const {masses,mean,variance}=inquiryScene('hypergeometric',n,K).values;near(masses.reduce((s,p)=>s+p,0),1);near(masses.reduce((s,p,k)=>s+k*p,0),mean);near(masses.reduce((s,p,k)=>s+(k-mean)**2*p,0),variance);}
 assert.equal(inquiryScene('circles',2,2).values.count,1);assert.equal(inquiryScene('circles',2,3).values.count,0);near(inquiryScene('circles',2,0).values.chord,4);
 assert.equal(inquiryScene('counting',5,2).values.permutations,20);assert.equal(inquiryScene('counting',5,2).values.combinations,10);assert.equal(inquiryScene('counting',2,3).values.combinations,0);
 near(inquiryScene('contingency',2,3).values.chiSquare,4.8);near(inquiryScene('finance',10,1).values.reversal,99);
 assert.match(inquiryScene('conics',0,1,'s1-3-3').summary.en,/not a nondegenerate/);near(inquiryScene('sequences',2,-.5,'sup-infinite-series').values.infiniteSum,4/3);
});
test('Lesson checks distinguish unattempted work, changed drafts, checked answers and written self-assessment',()=>{
 const qs=[{id:'example',kind:'example'},...['wrong','edited','correct','written','empty'].map(id=>({id,kind:id==='written'?'written':'number',level:'foundation'}))];
 const answers={wrong:{input:'2',checkedInput:'2',lastResult:'incorrect'},edited:{input:'3',checkedInput:'2',lastResult:'correct'},correct:{input:'2',checkedInput:'2',lastResult:'correct'},written:{input:'A proof',lastResult:'reviewed',completed:false}};
 let result=lessonCheck(qs,answers);assert.equal(result.total,5);assert.deepEqual(result.counts,{correct:1,incorrect:1,explained:0,manual:1,pending:1,unattempted:1});assert.deepEqual(result.revisit.map(q=>q.id),['wrong','edited','empty','written']);
 answers.written.completed=true;result=lessonCheck(qs,answers);assert.equal(result.counts.explained,1);assert.equal(result.counts.correct,1);
});
test('Binomial exploration includes deterministic endpoint distributions and exact moments',()=>{
  for(let n=1;n<=10;n++)for(const p of [0,.05,.25,.5,.8,1]){
    const masses=Array.from({length:n+1},(_,k)=>binomialMass(n,p,k));
    near(masses.reduce((s,v)=>s+v,0),1);near(masses.reduce((s,v,k)=>s+k*v,0),n*p);
    near(masses.reduce((s,v,k)=>s+(k-n*p)**2*v,0),n*p*(1-p));
  }
});
test('Regression responds to shifts and does not invent a correlation for constant responses',()=>{
  assert.deepEqual(regression([[1,3],[2,5],[3,7]]),{slope:2,intercept:1,r:1});
  const shifted=regression([[1,13],[2,15],[3,17]]);near(shifted.slope,2);near(shifted.intercept,11);
  assert.equal(regression([[1,4],[2,4],[3,4]]).r,null);
});
test('Every lab control boundary renders finite diagram coordinates and preserves mathematical exceptions',()=>{
  for(const type of inquiryTypes){const controls=inquiryControls(type);for(const a of [controls[0].min,controls[0].value,controls[0].max])for(const b of [controls[1].min,controls[1].value,controls[1].max]){
    const scene=inquiryScene(type,a,b);assert.ok(scene.summary.en&&scene.summary.zh);
    for(const path of scene.paths)assert.ok(!/NaN|Infinity/.test(path.d),`${type}: ${path.d}`);
    for(const circle of scene.circles)assert.ok([circle.x,circle.y,circle.r].every(Number.isFinite));
  }}
  assert.equal(inquiryScene('complex',0,0).values.argument,null);
  near(inquiryScene('calculus',2,-3).values.signedIntegral,-18);
  assert.deepEqual(inquiryScene('outcome-scaling',0,2).values.outcomeDistribution,[{value:2,probability:1}]);
  for(const [type,a,b,id]of [['outcome-scaling',3,3,'s3-7-3'],['sequences',5,2,'s2-4-3']])for(const point of inquiryScene(type,a,b,id).circles)assert(point.x>=5&&point.x<=635&&point.y>=5&&point.y<=355,'Every discrete outcome/term stays visible at the control boundary');
  assert.deepEqual(inquiryScene('sets',3,0).values.members,[3]);
});
test('Exports include other-page and inquiry records while preserving session work and unreadable storage',()=>{
 const values=new Map(),storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
 const current=initialProgress();current.answers['quadratics-number-1']={input:'-7',notes:'original reasoning'};saveProgress(storage,current);
 const other=loadProgress(storage).progress;other.answers['c1-1-1-inquiry-1']={notes:'Prediction from another page'};saveProgress(storage,other,new Set(['c1-1-1-inquiry-1']));
 current.answers['quadratics-number-1'].correction='Unsaved session correction';
 const snapshot=progressForExport(storage,current,new Set(['quadratics-number-1']));
 assert.equal(snapshot.answers['c1-1-1-inquiry-1'].notes,'Prediction from another page');assert.equal(snapshot.answers['quadratics-number-1'].correction,'Unsaved session correction');
 const text=readableProgress(snapshot,[],'en','TEST-DATE');assert(text.includes('c1-1-1-inquiry-1')&&text.includes('Prediction from another page')&&text.includes('Unsaved session correction'));
 values.set(STORAGE_KEY,'{broken');assert.equal(progressForExport(storage,current).answers['quadratics-number-1'].input,'-7');assert.equal(values.get(STORAGE_KEY),'{broken');
 assert.equal(isCurrentChecked({input:'7',checkedInput:'8',lastResult:'incorrect'}),false);assert.equal(isCurrentChecked({input:'8',checkedInput:'8',lastResult:'incorrect'}),true);
});
test('A page save preserves other pages and old IDs, and retains the last checked answer after editing',()=>{
  const values=new Map(),storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
  const first=initialProgress();first.answers['quadratics-choice-1']={input:'A',lastResult:'incorrect',checkedInput:'A',notes:'original',attempts:1};saveProgress(storage,first);
  const tab1=loadProgress(storage).progress,tab2=loadProgress(storage).progress;
  tab1.answers['c1-1-1-number-4']={input:'2',lastResult:'correct',checkedInput:'2'};saveProgress(storage,tab1,new Set(['c1-1-1-number-4']));
  tab2.answers['quadratics-choice-1'].input='B';saveProgress(storage,tab2,new Set(['quadratics-choice-1']));
  const result=loadProgress(storage).progress.answers;
  assert.equal(result['c1-1-1-number-4'].input,'2');assert.equal(result['quadratics-choice-1'].checkedInput,'A');assert.equal(result['quadratics-choice-1'].lastResult,'incorrect');
  assert.equal(checkAnswer({kind:'written'},'A proof').status,'reviewed');
  values.set(STORAGE_KEY,'{broken');assert.equal(saveProgress(storage,tab2,new Set()),false);assert.equal(values.get(STORAGE_KEY),'{broken');
  let writes=0;const unreadable={getItem(){throw Error('Denied read');},setItem(){writes++;}};
  assert.equal(saveProgress(unreadable,tab2,new Set(['quadratics-choice-1'])),false);assert.equal(writes,0,'Unknown prior records must not be overwritten');
});
