import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {createHash} from 'node:crypto';
import {calculusStatisticsSkills as lessons} from '../src/data/senior-math/skills-calculus-statistics.mjs';
import {auditCalculusStatisticsSkills} from '../src/data/senior-math/skills-calculus-statistics-checks.mjs';
import {calculusStatisticsReviewLedger} from '../src/data/senior-math/skills-calculus-statistics-review-ledger.mjs';
import {controls,scene,simulate} from '../src/lib/skill-calculus-statistics-inquiry.mjs';
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
test('every scalar, diagnostic and written derivation family has an independent check',()=>{
 const r=auditCalculusStatisticsSkills();assert.deepEqual([r.scalar,r.choice,r.written,r.total],[57,16,47,120]);assert.equal(new Set(r.verifiedIds).size,120);
});
test('reviewed prompt/data/answer/derivation payloads stay tied to the explicit 120-record ledger',()=>{
 const questions=lessons.flatMap(l=>[...l.questions,...l.diagnostics]);assert.equal(Object.keys(calculusStatisticsReviewLedger).length,questions.length);
 for(const q of questions){const row=calculusStatisticsReviewLedger[q.id];assert.ok(row,q.id);assert.equal(row.calc,q.verification.calc);assert.equal(row.sha256,createHash('sha256').update(JSON.stringify(q)).digest('hex'),`${q.id} requires renewed review`);}
});
test('eight micro-lessons retain their exact scope, balanced practice and actionable bilingual pedagogy',()=>{
 const ids=new Set(lessons.map(l=>l.id));
 for(const l of lessons){assert.equal(l.questions.length,13);assert.equal(l.diagnostics.length,2);assert.deepEqual(l.questions.slice(0,3).map(q=>q.level),['foundation','standard','transfer']);
  assert.deepEqual(l.questions.slice(3).map(q=>q.level),['foundation','foundation','foundation','foundation','standard','standard','standard','standard','transfer','transfer']);
  assert.ok(new Set(l.questions.map(q=>q.taskType)).size>=6);assert.ok(l.prerequisites.every(id=>ids.has(id)));assert.equal(l.source.pdfPage,l.source.printedPage+5);
  assert.deepEqual(l.teacher.timing.map(t=>t.minutes),[5,8,10,12,5]);assert.ok(l.teacher.anticipated.some(x=>x.en.startsWith('Correct sample:')));assert.ok(l.teacher.anticipated.some(x=>x.en.startsWith('Anticipated wrong response:')));
  assert.ok(l.teacher.rubric.every(r=>r.en&&r.zh&&r.sample.en&&r.sample.zh));
  for(const c of l.concepts){for(const k of ['motivation','counterexample'])assert.ok(c[k].en&&c[k].zh);assert.ok(c.derivation.length&&c.conditions.length&&c.representations.length);}
  for(const q of [...l.questions,...l.diagnostics]){assert.deepEqual(q.primarySkillIds,[l.id]);assert.equal(q.difficultyReview,'reviewed');assert.equal(q.source.type,'original');assert.equal(q.hints.length,2);assert.ok(q.steps.length>=3);assert.ok(q.examScopes.length);assert.ok(q.examScopeNote.en&&q.examScopeNote.zh);}
  for(const q of l.diagnostics){assert.equal(q.choices.length,4);for(const c of q.choices)if(c.id!==q.answer)assert.ok(c.misconception.en&&c.misconception.zh);}
 }
 assert.deepEqual(lessons[1].questions[6].examScopes,['JM02']);assert.ok(lessons.filter(l=>/moments|models|regression/.test(l.id)).every(l=>l.questions.every(q=>q.examScopes.includes('extension'))));
});
test('decoded math is strictly renderable and bilingual text has no TeX/control-character corruption',()=>{
 let count=0;function walk(v,key){if(typeof v==='string'){assert.ok(!/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(v));if(['math','formula','expression','resultMath'].includes(key)){katex.renderToString(v,{throwOnError:true,strict:'error'});assert.ok(!v.includes('§'));count++;}}
  else if(Array.isArray(v))v.forEach(x=>walk(x,key));else if(v&&typeof v==='object'){if(Object.hasOwn(v,'en')||Object.hasOwn(v,'zh'))assert.ok(v.en&&v.zh);Object.entries(v).forEach(([k,x])=>walk(x,k));}}
 walk(lessons);assert.ok(count>=500);
});
function finiteScene(s){assert.ok(s.summary.en&&s.summary.zh);assert.ok(s.table.headers.every(h=>h.en&&h.zh));assert.ok(s.table.rows.every(r=>r.length===s.table.headers.length));
 for(const value of Object.values(s.values))assert.ok(value===null||typeof value==='number'&&Number.isFinite(value));
 for(const c of s.circles)assert.ok([c.x,c.y,c.r].every(Number.isFinite)&&c.x>=0&&c.x<=640&&c.y>=0&&c.y<=360);
 for(const p of s.paths){assert.ok(!/NaN|Infinity|undefined/.test(p.d));const tokens=p.d.match(/[MLHVhvZ]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi)||[];let i=0,x=0,y=0;
  while(i<tokens.length){const command=tokens[i++];if(command==='M'||command==='L'){x=Number(tokens[i++]);y=Number(tokens[i++]);}else if(command==='H')x=Number(tokens[i++]);else if(command==='V')y=Number(tokens[i++]);else if(command==='h')x+=Number(tokens[i++]);else if(command==='v')y+=Number(tokens[i++]);else assert.equal(command,'Z');assert.ok(Number.isFinite(x)&&Number.isFinite(y)&&x>=-1e-4&&x<=640.0001&&y>=-1e-4&&y<=360.0001,`${p.d}: (${x},${y})`);}
 }
 JSON.stringify(s);assert.ok(s.labels.every(l=>l.x>=0&&l.x<=640&&l.y>=0&&l.y<=360));
}
test('all scenes are bounded and serializable at defaults, control endpoints and invalid supplied values',()=>{
 for(const l of lessons){finiteScene(scene(l.id));finiteScene(scene(l.id,null));const cs=controls(l.id);for(const c of cs){assert.ok(c.label.en&&c.label.zh);for(const v of [c.min,c.max,NaN,Infinity,'invalid',null])finiteScene(scene(l.id,{[c.key]:v}));}
  function edges(i,p){if(i===cs.length){finiteScene(scene(l.id,p));return;}for(const value of [cs[i].min,cs[i].max])edges(i+1,{...p,[cs[i].key]:value});}edges(0,{});
 }
});
test('secants, chain rates, extrema and concavity preserve their genuine boundary distinctions',()=>{
 for(const a of [-2,0,2])for(const h of [-1,0,1]){const s=scene('calculus-tangent',{a,h});close(s.values.tangentSlope,2*a);close(s.values.verticalError,((a+h)**2)-(a*a+2*a*h));if(h===0){assert.equal(s.values.secantSlope,null);assert.ok(s.summary.en.includes('undefined'));}else close(s.values.secantSlope,((a+h)**2-a*a)/h);}
 for(const k of [-2,0,2]){const s=scene('calculus-rules',{k,x:.3}),h=1e-6,f=x=>(k*x+1)**3;close(s.values.correctDerivative,(f(.3+h)-f(.3-h))/(2*h),1e-8);}
 for(const k of [-6,0,6]){const s=scene('calculus-extrema',{k,left:-2,right:2});assert.equal(s.values.localExtremaCount,k>0?2:0);const f=x=>x**3-k*x,candidates=[-2,2,...(k>0?[-Math.sqrt(k/3),Math.sqrt(k/3)]:[])];close(s.values.intervalMaximum,Math.max(...candidates.map(f)));close(s.values.intervalMinimum,Math.min(...candidates.map(f)));assert.equal(scene('calculus-inflection',{k}).values.inflectionCount,k<0?2:0);}
 const singleton=scene('calculus-extrema',{left:0,right:0});close(singleton.values.intervalMaximum,0);close(singleton.values.intervalMinimum,0);
});
test('conditioning and transformations preserve probability totals and degenerate cases',()=>{
 for(const prior of [0,.1,.5,1])for(const alpha of [0,.9,1])for(const beta of [0,.1,1]){const v=scene('probability-conditional',{prior,alpha,beta}).values,den=prior*alpha+(1-prior)*beta;close(v.flagProbability,den);if(den===0)assert.equal(v.posterior,null);else close(v.posterior,prior*alpha/den);}
 for(const a of [-3,0,3])for(const b of [-4,0,4]){const s=scene('probability-moments',{a,b}),out=[b,2*a+b],mu=(out[0]+out[1])/2;close(s.values.mean,mu);close(s.values.variance,((out[0]-mu)**2+(out[1]-mu)**2)/2);assert.equal(s.table.rows.length,a===0?1:2);}
});
test('all 49 finite-bag models agree with independent subset and sequence enumeration',()=>{
 for(let K=0;K<=6;K++)for(let n=0;n<=6;n++){const s=scene('probability-models',{K,n}),hg=Array(n+1).fill(0),bin=Array(n+1).fill(0);let total=0;
  for(let mask=0;mask<64;mask++){const selected=Array.from({length:6},(_,i)=>i).filter(i=>(mask>>i)&1);if(selected.length!==n)continue;total++;hg[selected.filter(i=>i<K).length]++;}
  for(let mask=0;mask<2**n;mask++){let successes=0,weight=1;for(let j=0;j<n;j++){const success=(mask>>j)&1;successes+=success;weight*=success?K/6:1-K/6;}bin[successes]+=weight;}
  for(let k=0;k<=n;k++){close(Number(s.table.rows[k][1]),hg[k]/total,6e-6);close(Number(s.table.rows[k][2]),bin[k],6e-6);}
  const mu=hg.reduce((a,v,k)=>a+k*v/total,0),variance=hg.reduce((a,v,k)=>a+(k-mu)**2*v/total,0);close(s.values.mean,mu);close(s.values.withoutReplacementVariance,variance);close(bin.reduce((a,v)=>a+v,0),1);
 }
});
test('probability simulation really samples both mechanisms and preserves deterministic endpoints',()=>{
 const a=simulate('probability-models',{K:3,n:2},37,2000),b=simulate('probability-models',{K:3,n:2},37,2000);assert.deepEqual(a,b);assert.notDeepEqual(a.withReplacement.counts,simulate('probability-models',{K:3,n:2},38,2000).withReplacement.counts);
 // Independent exact enumeration gives HG masses .2,.6,.2 and binomial .25,.5,.25.
 for(let k=0;k<3;k++){close(a.withoutReplacement.counts[k]/a.trials,[.2,.6,.2][k],.035);close(a.withReplacement.counts[k]/a.trials,[.25,.5,.25][k],.035);}
 for(let K=0;K<=6;K++)for(let n=0;n<=6;n++){const s=simulate('probability-models',{K,n},0,31);assert.deepEqual(s.params,{N:6,K,n});assert.equal(s.seed,0);assert.equal(s.trials,31);
  for(const sample of [s.withReplacement,s.withoutReplacement]){assert.equal(sample.counts.reduce((a,b)=>a+b,0),31);close(sample.mean,sample.counts.reduce((a,b,k)=>a+k*b,0)/31);assert.equal(sample.counts.length,n+1);}
  const lo=Math.max(0,n-(6-K)),hi=Math.min(n,K);s.withoutReplacement.counts.forEach((count,k)=>{if(k<lo||k>hi)assert.equal(count,0);});
  if(n===6)assert.equal(s.withoutReplacement.counts[K],31);if(n===0)assert.equal(s.withReplacement.counts[0],31);if(K===0)assert.equal(s.withReplacement.counts[0],31);if(K===6)assert.equal(s.withReplacement.counts[n],31);
 }
 const adjusted=simulate('probability-models',{K:99,n:-3},Infinity,Infinity);assert.deepEqual(adjusted.params,{N:6,K:6,n:0});assert.equal(adjusted.seed,37);assert.equal(adjusted.trials,200);assert.throws(()=>simulate('calculus-tangent'),/unavailable/);
});
test('regression response shifts preserve residuals; altered pairing changes fit with independent normal equations',()=>{
 for(const delta of [-8,0,8])for(const shift of [-3,0,3]){const s=scene('statistics-regression',{delta,shift}),v=s.values;close(v.slope,2+delta/5);close(v.intercept,shift-2*delta/5);close(v.squaredError,2*delta*delta/5);close(v.residualSum,0);const es=s.table.rows.map(r=>Number(r[3]));close(es.reduce((a,b)=>a+b,0),0,1e-5);close(s.table.rows.reduce((a,r,i)=>a+(i+1)*es[i],0),0,1e-5);}
 assert.throws(()=>scene('not-a-skill'),/Unknown/);
});
