/** Independent peer calculations. Givens were transcribed from public questions;
 * no author verification helper, answer, hint, or worked step derives an expectation.
 * Frozen bilingual public hashes require fresh review when a stated problem changes. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {calculusStatisticsSkills as skills} from '../src/data/senior-math/skills-calculus-statistics.mjs';
import {controls,scene,simulate} from '../src/lib/skill-calculus-statistics-inquiry.mjs';
const questions=skills.flatMap(s=>[...s.questions,...s.diagnostics]);
const ledger=JSON.parse(readFileSync(new URL('./fixtures/skills-calculus-statistics-peer-review.json',import.meta.url),'utf8'));
const close=(a,b,tol=1e-10)=>assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol*Math.max(1,Math.abs(a),Math.abs(b)),a+' != '+b);
const sum=a=>a.reduce((s,x)=>s+x,0),mean=a=>sum(a)/a.length;
const moments=(x,p)=>{const mu=sum(x.map((v,i)=>v*p[i]));return {mean:mu,variance:sum(x.map((v,i)=>p[i]*(v-mu)**2))};};
const regression=points=>{const mx=mean(points.map(p=>p[0])),my=mean(points.map(p=>p[1]));const xx=sum(points.map(p=>(p[0]-mx)**2)),yy=sum(points.map(p=>(p[1]-my)**2)),xy=sum(points.map(p=>(p[0]-mx)*(p[1]-my)));const b=xy/xx,a=my-b*mx,e=points.map(([x,y])=>y-a-b*x);return {a,b,xx,yy,xy,r:xy/Math.sqrt(xx*yy),e,sse:sum(e.map(x=>x*x))};};
// Coefficients are ascending powers; differentiate by formal polynomial algebra.
const derivative=c=>c.slice(1).map((v,i)=>v*(i+1));
const value=(c,x)=>c.reduceRight((s,a)=>s*x+a,0);
const choose=(n,k)=>k<0||k>n?0:Array.from({length:k},(_,i)=>(n-i)/(i+1)).reduce((a,b)=>a*b,1);
const binomial=(n,p,k)=>choose(n,k)*p**k*(1-p)**(n-k);
const firstSuccess=(p,target)=>{let n=0;while(1-(1-p)**n<target)n++;return n;};
function scalar(q){switch(q.taskType){
 case 'difference-quotient':return ((1+.5)**2-1**2)/.5;
 case 'inverse-rate':return 1/value(derivative([0,0,1]),2);
 case 'instantaneous-rate':return value(derivative([0,0,1]),-2);
 case 'average-rate':return (3**2-1**2)/(3-1);
 case 'point-versus-slope':return value(derivative([0,0,0,1]),2);
 case 'normal-line':return -1/value(derivative([0,0,1]),1);
 case 'measured-rate':return 7+(-3)*(2.04-2);
 case 'tangent-local-error':return (-.2)**2;
 case 'power-sum':return value(derivative([5,-2,0,0,3]),2);
 case 'composite-recovery':return 24/value(derivative([0,0,1]),2);
 case 'constant':return value(derivative([7]),0);
 case 'power-evaluation':return value(derivative([0,0,0,0,0,1]),-1);
 case 'chain-value':return value(derivative([1,6,12,8]),0);
 case 'quotient-value':return ((2-1)-(2+1))/(2-1)**2;
 case 'product-at-point':return value(derivative([0,0,-3,1]),1);
 case 'parameter-chain':return 12/3;
 case 'closed-interval':return Math.max(...[-2,-1,1].map(x=>value([0,-3,0,1],x)));
 case 'constraint-optimization':return (20/4)**2;
 case 'endpoint-optimum':return Math.min(1**2,3**2);
 case 'second-derivative-test':{const c=[0,-4,1],x=-c[1]/(2*c[2]);return value(c,x);}
 case 'second-derivative-value':return value(derivative(derivative([0,0,0,1])),-1);
 case 'cubic-slope-inflection':{const c=[4,0,-3,1],d2=derivative(derivative(c)),x=-d2[0]/d2[1];return value(derivative(c),x);}
 case 'restricted-denominator':return 5/12;
 case 'total-probability':return .4*.1+(1-.4)*.2;
 case 'base-rate-transfer':return .1*.9/(.1*.9+(1-.1)*.1);
 case 'conditional-ratio':return .12/.3;
 case 'reverse-condition':return .12/.2;
 case 'without-replacement':return 3/(4+3-1);
 case 'posterior-machine':return .4*.1/(.4*.1+.6*.2);
 case 'table-conditional':return 12/(10+12);
 case 'posterior-design':{const a=.5*(3/4)*(2/3),b=.5*(1/4)*(0/3);return a/(a+b);}
 case 'posterior-parameter':return .2/(.8+.2);
 case 'weighted-mean':return moments([0,2],[3/4,1/4]).mean;
 case 'variance-definition':return moments([0,2],[.5,.5]).variance;
 case 'dependence-transfer':return moments([0+(1-0),1+(1-1)],[.5,.5]).variance;
 case 'normalization':return 1/(1+2+1);
 case 'second-moment':return moments([(-1)**2,2**2],[2/3,1/3]).mean;
 case 'mean-shift':return 2*3-5;
 case 'variance-scale':return (-2)**2*3;
 case 'net-payoff':return moments([8-3,0-3],[1/4,3/4]).mean;
 case 'independent-sum':return 1**2*2+(-1)**2*5;
 case 'equal-mean-risk':return moments([0,4],[.5,.5]).variance-moments([2],[1]).variance;
 case 'binomial-mass':return binomial(3,.5,2);
 case 'hypergeometric-mass':return choose(3,2)*choose(2,0)/choose(5,2);
 case 'binomial-mean':return sum(Array.from({length:6},(_,k)=>k*binomial(5,.2,k)));
 case 'binomial-zero':return binomial(4,.5,0);
 case 'binomial-variance':{const x=[0,1,2,3,4];return moments(x,x.map(k=>binomial(4,.25,k))).variance;}
 case 'normal-standardize':return (14-10)/Math.sqrt(4);
 case 'normal-symmetry':return 0; // A singleton has zero integral for a continuous density.
 case 'supplied-normal-table':assert.equal((12-10)/Math.sqrt(4),1);return .8413;
 case 'reliability-design':return firstSuccess(.5,.95);
 case 'least-squares-slope':return regression([[1,1],[2,3],[3,2]]).b;
 case 'residual':return 8-(1+2*3);
 case 'unit-transfer':return 2/60;
 case 'centroid-intercept':return 8-3*2;
 case 'prediction':return 2+3*4;
 case 'correlation-coefficient':return 3/Math.sqrt(4*9);
 default:throw Error('No independent scalar derivation: '+q.taskType);
}}
const numericLabel=c=>Number(c.label.en.replaceAll('−','-'));
function choice(q){
 let expected,predicate;
 switch(q.taskType){
  case 'diagnostic-slope':expected=value(derivative([0,0,1]),3);break;
  case 'diagnostic-corner':assert.notEqual(Math.abs(-1)/-1,Math.abs(1)/1);predicate=c=>/^Continuous, but not differentiable\./.test(c.label.en);break;
  case 'diagnostic-chain':expected=value(derivative([1,6,9]),0);break;
  case 'diagnostic-product':predicate=c=>c.label.en===(2+3)+'x⁴';break;
  case 'diagnostic-stationary':assert.ok((-1)**3<0&&1**3>0);predicate=c=>c.label.en==='Stationary but no extremum';break;
  case 'diagnostic-endpoint':expected=Math.max((-1)**2,0**2,2**2);break;
  case 'diagnostic-false-candidate':predicate=c=>{const power={'x²':2,'x³':3,'x⁴':4,'x⁶':6}[c.label.en];return power*(power-1)*(-1)**(power-2)<0;};break;
  case 'diagnostic-slope-at-inflection':expected=value(derivative([0,1,0,1]),0);break;
  case 'diagnostic-denominator':expected=8/20;break;
  case 'diagnostic-independence':assert.notEqual(0,(1/4)**2);predicate=c=>c.label.en==='No: 0 differs from 1/16.';break;
  case 'diagnostic-moment':expected=moments([0,2],[.5,.5]).variance;break;
  case 'diagnostic-scaling':expected=3**2*2;break;
  case 'diagnostic-replacement':predicate=c=>c.label.en==='Hypergeometric';break;
  case 'diagnostic-normal-scale':expected=Math.sqrt(9);break;
  case 'diagnostic-residual':expected=8-6;break;
  case 'diagnostic-correlation':close(regression([[-1,1],[0,0],[1,1]]).r,0);predicate=c=>c.label.en==='No; a nonlinear relationship can remain.';break;
  default:throw Error('No independent choice derivation: '+q.taskType);
 }
 const matches=q.choices.filter(predicate??(c=>Math.abs(numericLabel(c)-expected)<1e-12));
 assert.equal(matches.length,1,q.id+' unique independently justified choice');return matches[0].id;
}
const publicPayload=q=>({id:q.id,taskType:q.taskType,prompt:q.prompt,expression:q.expression,conditions:q.conditions,choices:q.choices?.map(c=>({id:c.id,label:c.label,expression:c.expression}))});
const writtenPayload=q=>({id:q.id,prompt:q.prompt,expression:q.expression,answer:q.answer,hints:q.hints,steps:q.steps,result:q.result,explanation:q.explanation,conditions:q.conditions});
const hash=o=>createHash('sha256').update(JSON.stringify(o)).digest('hex');
const publicOnly=q=>new Proxy(publicPayload(q),{get(target,key){assert.ok(Object.hasOwn(target,key),'Expectation tried to access private field '+String(key));return target[key];}});
test('all 120 bilingual public statements are bound to this independent review',()=>{
 assert.equal(questions.length,120);assert.equal(ledger.records.length,120);assert.equal(new Set(ledger.records.map(r=>r.id)).size,120);
 for(const q of questions){const r=ledger.records.find(r=>r.id===q.id);assert.ok(r,q.id);assert.equal(hash(publicPayload(q)),r.publicSha256,q.id+' changed public givens');}
});
test('independently recalculate all 57 scalar and 16 choice answers, reject every answer mutation',()=>{
 let numbers=0,choices=0,mutations=0;
 for(const q of questions){
  if(q.kind==='choice'){const got=choice(publicOnly(q));assert.equal(got,q.answer,q.id);assert.notEqual(got,q.choices.find(c=>c.id!==q.answer).id);choices++;mutations++;}
  else if(typeof q.answer==='number'){const got=scalar(publicOnly(q));close(got,q.answer);assert.ok(Math.abs(got-(q.answer+1))>.5);numbers++;mutations++;}
 }
 assert.deepEqual({numbers,choices,mutations},{numbers:57,choices:16,mutations:73});
});
test('all 47 written items retain individually reviewed derivations and conditions',()=>{
 const written=questions.filter(q=>q.kind!=='choice'&&typeof q.answer!=='number');assert.equal(written.length,47);
 for(const q of written){const r=ledger.records.find(r=>r.id===q.id);assert.ok(r.review.length>35,q.id);assert.equal(hash(writtenPayload(q)),r.writtenSha256,q.id+' requires a new manual review');assert.notEqual(hash(writtenPayload({...q,answer:{en:'Altered',zh:'已改'}})),r.writtenSha256);}
});
test('independent analytic corroboration of written transfer and domain arguments',()=>{
 for(const x of [-5,-2,-.1,0,.1,2,5]){close(value(derivative([-2,1,-2,1]),x),3*x*x-4*x+1);close((x+.125)**2-(x*x+2*x*.125),.125**2);assert.ok(x**4>=0);assert.equal(Math.sign(3*x*x),x===0?0:1);}
 for(const a of [-2,2]){close(2*a*0-a*a,-4);close(a*a,2*a*a-a*a);}close((.5)**2-(.5-.25),0);
 for(const k of [-6,-1,0,1,6]){if(k>0){const r=Math.sqrt(k/3);close(3*r*r-k,0);assert.ok(3*(r+.1)**2-k>0&&-k<0);}if(k<0){const r=Math.sqrt(-k/6);close(12*r*r+2*k,0);assert.ok(12*(r+.1)**2+2*k>0&&2*k<0);}}
 const r=regression([[0,1],[1,3],[2,2]]);close(r.a,1.5);close(r.b,.5);close(sum(r.e),0);
 close(regression([[1,1],[2,2],[3,3]]).b,1);close(regression([[1,3],[2,2],[3,1]]).b,-1);
 const y=[0,0,3];close(sum(y.map(v=>(v-1)**2)),6);close(sum(y.map(v=>v*v)),9);close(sum(y.map(v=>Math.abs(v))),3);close(sum(y.map(v=>Math.abs(v-1))),4);
 for(const c of [-2,-.5,0,.5,1,2,4]){assert.ok(sum(y.map(v=>(v-c)**2))>=6);assert.ok(sum(y.map(v=>Math.abs(v-c)))>=3);}
 assert.deepEqual([0,1,2,3].filter(k=>choose(4,k)*choose(1,3-k)>0),[2,3]);
});
test('eight inquiry models agree with independent equations at all control boundaries',()=>{
 let checked=0;
 for(const skill of skills){
  const cc=controls(skill.id);let samples=[{}];const combinations=(i,p)=>{if(i===cc.length){samples.push(p);return;}const c=cc[i];for(const v of new Set([c.min,c.value,c.max,Math.min(c.max,Math.max(c.min,0))]))combinations(i+1,{...p,[c.key]:v});};combinations(0,{});
  for(const p of samples){const s=scene(skill.id,p),v=s.values;checked++;
   for(const label of s.labels){assert.ok(Number.isFinite(label.x)&&Number.isFinite(label.y));assert.ok(label.x>=0&&label.x<=640&&label.y>=0&&label.y<=360);}
   for(const path of s.paths)assert.ok(!/NaN|Infinity/.test(path.d));
   for(const circle of s.circles)assert.ok([circle.x,circle.y,circle.r].every(Number.isFinite));
   assert.ok(s.summary.en&&s.summary.zh&&s.table.rows.length);
   switch(skill.id){
    case 'calculus-tangent':close(v.tangentSlope,value(derivative([0,0,1]),v.a));close(v.verticalError,(v.a+v.h)**2-(v.a**2+2*v.a*v.h));if(v.h===0)assert.equal(v.secantSlope,null);else close(v.secantSlope,((v.a+v.h)**2-v.a**2)/v.h);break;
    case 'calculus-rules':{const polynomial=[1,3*v.k,3*v.k*v.k,v.k**3];close(v.functionValue,value(polynomial,v.x));close(v.correctDerivative,value(derivative(polynomial),v.x));break;}
    case 'calculus-extrema':{const xs=[v.left,v.right];if(v.k>=0)for(const x of [-Math.sqrt(v.k/3),Math.sqrt(v.k/3)])if(x>=v.left&&x<=v.right)xs.push(x);const yy=xs.map(x=>x**3-v.k*x);close(v.intervalMinimum,Math.min(...yy));close(v.intervalMaximum,Math.max(...yy));assert.equal(v.localExtremaCount,v.k>0?2:0);break;}
    case 'calculus-inflection':close(v.secondDerivative,value(derivative(derivative([0,0,v.k,0,1])),v.x));assert.equal(v.inflectionCount,v.k<0?2:0);break;
    case 'probability-conditional':{const joint=[v.prior*v.alpha,(1-v.prior)*v.beta];close(v.flagProbability,sum(joint));if(sum(joint)===0)assert.equal(v.posterior,null);else close(v.posterior,joint[0]/sum(joint));break;}
    case 'probability-moments':{const m=moments([v.b,2*v.a+v.b],[.5,.5]);close(v.mean,m.mean);close(v.variance,m.variance);break;}
    case 'probability-models':{const xx=Array.from({length:v.n+1},(_,k)=>k),h=xx.map(k=>choose(v.K,k)*choose(v.N-v.K,v.n-k)/choose(v.N,v.n)),b=xx.map(k=>binomial(v.n,v.K/v.N,k)),mh=moments(xx,h),mb=moments(xx,b);close(sum(h),1);close(sum(b),1);close(v.mean,mh.mean);close(v.withoutReplacementVariance,mh.variance);close(v.withReplacementVariance,mb.variance);const support=xx.filter((_,i)=>h[i]>0);assert.equal(v.supportMin,Math.min(...support));assert.equal(v.supportMax,Math.max(...support));for(const row of s.table.rows){close(Number(row[1]),h[row[0]],1e-5);close(Number(row[2]),b[row[0]],1e-5);}break;}
    case 'statistics-regression':{const r=regression([1,2,3,4,5].map(x=>[x,2*x+v.shift+(x===5?v.delta:0)]));close(v.slope,r.b);close(v.intercept,r.a);close(v.squaredError,r.sse);close(v.residualSum,sum(r.e));break;}
   }
  }
 }
 assert.ok(checked>=100);
});
test('sampling simulation preserves exact finite-population support and deterministic boundaries',()=>{
 for(let K=0;K<=6;K++)for(let n=0;n<=6;n++){
  const s=simulate('probability-models',{K,n},20261008,97);assert.deepEqual(s,simulate('probability-models',{K,n},20261008,97));
  for(const model of [s.withReplacement,s.withoutReplacement]){assert.equal(sum(model.counts),97);assert.ok(model.counts.every(Number.isInteger));}
  s.withoutReplacement.counts.forEach((count,k)=>{if(k<Math.max(0,n-(6-K))||k>Math.min(K,n))assert.equal(count,0);});
  if(n===6)assert.equal(s.withoutReplacement.counts[K],97);
  if(n===0||K===0)assert.equal(s.withReplacement.counts[0],97);
  if(K===6)assert.equal(s.withReplacement.counts[n],97);
 }
});
