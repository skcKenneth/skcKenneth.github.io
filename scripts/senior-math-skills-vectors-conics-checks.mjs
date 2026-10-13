import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import katex from 'katex';
import {vectorConicSkills as units} from '../src/data/senior-math/skills-vectors-conics.mjs';
import {auditVectorConicAnswers,deriveVectorConicAnswer,writtenDigest} from '../src/data/senior-math/skills-vectors-conics-verification.mjs';
import {controls,scene} from '../src/lib/skill-vectors-conics-inquiry.mjs';

const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(a),Math.abs(b)),a+' != '+b);
const ids=new Set();let mathFields=0,sceneChecks=0,mutationChecks=0;
function allFinite(x){
 if(typeof x==='number')assert.ok(Number.isFinite(x),'nonfinite scene value');
 else if(x&&typeof x==='object')Object.values(x).forEach(allFinite);
}
function renderMath(x){
 if(!x||typeof x!=='object')return;
 for(const [k,v]of Object.entries(x)){
  if(['formula','math','expression'].includes(k)&&typeof v==='string'){katex.renderToString(v,{throwOnError:true,strict:'error'});mathFields++;}
  else renderMath(v);
 }
}
assert.equal(units.length,8);
for(const unit of units){
 assert.equal(unit.questions.length,13);assert.equal(unit.diagnostics.length,2);
 assert.equal(unit.questions.filter(q=>q.kind==='example').length,3);
 const practice=unit.questions.filter(q=>q.kind!=='example');
 assert.deepEqual(['foundation','standard','transfer'].map(l=>practice.filter(q=>q.level===l).length),[4,4,2]);
 assert.ok(new Set(unit.questions.map(q=>q.taskType)).size>=6);
 assert.equal(unit.teacher.timing.reduce((a,b)=>a+b.minutes,0),40);
 assert.deepEqual(unit.teacher.timing.map(x=>x.minutes),[5,8,10,12,5]);
 assert.ok(unit.teacher.anticipated.some(x=>x.en.startsWith('Correct:')));
 assert.ok(unit.teacher.anticipated.some(x=>x.en.startsWith('Incorrect:')));
 assert.ok(unit.teacher.rubric.every(x=>x.sample?.en&&x.sample.zh));
 assert.ok(unit.source.documentId&&unit.source.pdfPage>0&&unit.parentLessonIds.length);
 for(const c of unit.concepts)for(const key of ['motivation','derivation','conditions','counterexample','representations'])assert.ok(c[key]);
 for(const q of [...unit.questions,...unit.diagnostics]){
  assert.ok(!ids.has(q.id),q.id);ids.add(q.id);
  assert.equal(q.source.type,'original');assert.deepEqual(q.primarySkillIds,[unit.id]);assert.equal(q.difficultyReview,'reviewed');
  assert.ok(q.examScopes.length);assert.ok(q.examScopes.every(x=>['JM01','JM02'].includes(x)));
  assert.equal(q.hints.length,2);assert.ok(q.steps.length>=2);
  for(const t of [q.prompt,q.result,q.explanation,...q.hints,...q.steps.map(s=>s.body)])assert.ok(t.en&&t.zh);
  if(q.kind==='choice')assert.deepEqual(Object.keys(q.distractorMisconceptions).sort(),q.choices.filter(c=>c.id!==q.answer).map(c=>c.id).sort());
 }
 renderMath(unit);
 const options=controls(unit.id);assert.ok(options.length);
 const grids=options.reduce((rows,c)=>rows.flatMap(p=>[...new Set([c.min,c.value,c.max,...(c.min<=0&&c.max>=0?[0]:[])])].map(v=>({...p,[c.key]:v}))),[{}]);
 for(const params of grids){
  const actual=scene(unit.id,params);allFinite(actual);
  assert.ok(actual.summary.en&&actual.summary.zh);assert.ok(actual.table?.rows.length);
  for(const path of actual.paths)assert.ok(!/NaN|Infinity|undefined/.test(path.d));
  for(const label of actual.labels)assert.ok(label.x>=8&&label.x<=600&&label.y>=16&&label.y<=345);
  const v=actual.values;
  if(unit.id==='vectors-geometric'){
   near(v.scaledNorm,Math.abs(params.t)*Math.hypot(params.x,params.y));
   for(const c of actual.circles)assert.ok(c.x>=0&&c.x<=640&&c.y>=0&&c.y<=360);
  }
  if(unit.id==='vectors-dot')near(v.residualDot,0);
  if(unit.id==='conics-ellipse')near(v.focalSum,2*Math.max(params.a,params.b));
  if(unit.id==='conics-hyperbola'&&v.valid){
   if(params.k===0)assert.equal(v.intersectionCount,0);
   else{const[x,y]=v.intersection;near(x*x/(params.a*params.a)-y*y/(params.b*params.b),1);near(y,params.b/params.a*x+params.k);}
  }
  if(unit.id==='conics-parabola'){near(v.focalDistance,v.directrixDistance);near(v.point[1]**2,4*params.a*(v.point[0]-params.h));}
  if(unit.id==='conics-intersections'){
   for(const [x,y]of v.points){near(x*x/9+y*y/4,1);if(v.vertical)near(x,params.c);else near(y,params.m*x+params.b);}
   if(v.midpoint&&v.points.length===2)near(v.midpoint[0],(v.points[0][0]+v.points[1][0])/2);
  }
  sceneChecks++;
 }
}
assert.equal(ids.size,120);
const numeric=auditVectorConicAnswers(units);assert.equal(numeric.verifiedIds.length,58);
for(const unit of units)for(const q of [...unit.questions,...unit.diagnostics]){
 if(typeof q.answer!=='number'&&q.kind!=='choice')continue;
 const guarded={prompt:q.prompt,expression:q.expression,choices:q.choices};
 for(const field of ['answer','steps','hints','result','explanation'])Object.defineProperty(guarded,field,{get(){throw Error('Private solution field read: '+field);}});
 const derived=deriveVectorConicAnswer(q.taskType,guarded);
 typeof q.answer==='number'?near(derived,q.answer):assert.equal(derived,q.answer);
 const changed={...q,answer:typeof q.answer==='number'?q.answer+1:q.choices.find(c=>c.id!==q.answer).id};
 assert.throws(()=>auditVectorConicAnswers([{questions:[changed],diagnostics:[]}]),/derived/);
 mutationChecks++;
}
const written=JSON.parse(readFileSync(new URL('../src/data/senior-math/skills-vectors-conics-written-audit.json',import.meta.url),'utf8'));
const actualWritten=units.flatMap(u=>u.questions.filter(q=>typeof q.answer!=='number'));
assert.equal(written.records.length,62);assert.equal(actualWritten.length,62);
assert.equal(new Set(written.records.map(x=>x.id)).size,62);
for(const q of actualWritten){
 const record=written.records.find(x=>x.id===q.id);assert.ok(record,q.id);
 assert.equal(writtenDigest(q),record.sha256,q.id+' changed after manual review');
 assert.notEqual(writtenDigest({...q,result:{en:q.result.en+' altered',zh:q.result.zh}}),record.sha256);
}
// Nontrivial transfer and exact boundary regressions, separate from proof review.
for(const m of [-100,-4,-1,0,.5,3,100]){
 const h=-9*m/(4+9*m*m),k=4/(4+9*m*m);
 near(h*h/(9/16)+(k-.5)**2/.25,1);
 const intersections=scene('conics-intersections',{m:Math.max(-3,Math.min(3,m)),b:1,vertical:0,c:0});
 assert.equal(intersections.values.intersectionCount,2);
}
near(0/(9/16)+(-.5)**2/.25,1); // restored vertical midpoint
for(const sign of [-1,1]){
 const y=1+sign*Math.sqrt(7),x=2+sign*Math.sqrt(7)/2;
 near(y*y,4*x);near(2*x-y,3);
}
const maxPoint=[2/Math.sqrt(5),6/Math.sqrt(5)];
near(maxPoint[0]**2/4+maxPoint[1]**2/9,1);
near(3*maxPoint[0]+4*maxPoint[1],6*Math.sqrt(5));
for(const y of [-8,-4,-1,0,1,4,8]){
 const x=y*y/8,value=Math.hypot(x-2,y)+Math.hypot(x-8,y);
 assert.ok(value>=10-1e-10);assert.equal(Math.abs(value-10)<1e-10,y===0);
}
assert.equal(scene('conics-intersections',{vertical:1,c:3}).values.intersectionCount,1);
assert.equal(scene('conics-intersections',{vertical:1,c:4}).values.intersectionCount,0);
assert.equal(scene('conics-intersections',{vertical:0,m:0,b:2}).values.intersectionCount,1);
assert.equal(scene('conics-hyperbola',{a:2,b:1,k:0}).values.intersectionCount,0);
assert.equal(scene('vectors-dot',{x:0,y:0}).values.angle,null);
assert.equal(scene('vectors-proof-triangles',{x:1,y:-1}).values.area,0);
console.log(JSON.stringify({skills:units.length,records:ids.size,independentScalarChoice:numeric.verifiedIds.length,writtenReviewed:written.records.length,mathFields,sceneChecks,mutationChecks,uncovered:numeric.uncovered}));
