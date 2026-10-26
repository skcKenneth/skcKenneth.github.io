import test from 'node:test';
import assert from 'node:assert/strict';
import {activities,evaluate} from '../src/data/g10-inquiries-algebra.mjs';

const E=(id,params={},locale='en')=>evaluate(`g10-${id}`,params,locale);
const close=(actual,expected,message='')=>assert.ok(Math.abs(actual-expected)<1e-8*Math.max(1,Math.abs(expected)),`${message}: ${actual} != ${expected}`);
const value=(coeff,x)=>coeff.map((c,i)=>c*x**(coeff.length-1-i)).reduce((a,b)=>a+b,0);
function multiply(a,b){const out=Array(a.length+b.length-1).fill(0);for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++)out[i+j]+=a[i]*b[j];return out;}
function add(a,b){const n=Math.max(a.length,b.length),out=Array(n).fill(0);for(let i=0;i<a.length;i++)out[n-a.length+i]+=a[i];for(let i=0;i<b.length;i++)out[n-b.length+i]+=b[i];return out;}
function coefficientsEqual(a,b){const n=Math.max(a.length,b.length);for(let i=0;i<n;i++)close(a[a.length-n+i]||0,b[b.length-n+i]||0,'coefficient identity');}
const factorPower=(root,count)=>{let out=[1];for(let i=0;i<count;i++)out=multiply(out,[1,-root]);return out;};
const intervalContains=(parts,x)=>parts.some(p=>(p.lower===null||x>p.lower||p.lowerClosed&&x===p.lower)&&(p.upper===null||x<p.upper||p.upperClosed&&x===p.upper));

test('27 authored activities retain exact chapter counts and complete bilingual teaching fields',()=>{
 assert.equal(activities.length,27);
 assert.equal(new Set(activities.map(a=>a.id)).size,27);
 for(const [chapter,count] of Object.entries({'01':4,'02':4,'03':4,'04':4,'11':4,'12':3,'13':4}))assert.equal(activities.filter(a=>a.chapter===chapter).length,count);
 for(const a of activities){
  assert.match(a.id,/^g10-(01|02|03|04|11|12|13)-\d\d$/);
  for(const field of ['title','question','prediction','prerequisites','explanation','conditions','misconception','challenge','proof','teacherPrompt'])for(const l of ['en','zh-Hant'])assert.ok(a[field]?.[l]?.trim(),`${a.id} ${field} ${l}`);
  for(const field of ['prompt','answer'])for(const l of ['en','zh-Hant'])assert.ok(a.exit[field][l].trim());
  assert.ok(a.cases.length>=3);assert.ok(a.cases.some(c=>c.boundary));assert.ok(a.controls.length>0);
 }
});

test('every authored case renders actual accessible finite SVG and separate bilingual observations',()=>{
 for(const a of activities)for(const c of a.cases){
  const en=evaluate(a.id,c.params,'en'),zh=evaluate(a.id,c.params,'zh-Hant');
  for(const result of [en,zh]){
   assert.match(result.svg,/viewBox="0 0 720 340"/);assert.match(result.svg,/<title>.+<\/title>/);
   assert.doesNotMatch(result.svg,/NaN|Infinity|undefined|<script|foreignObject/);
   assert.ok(result.columns.length);assert.ok(result.rows.length);assert.ok(result.summary);
   assert.equal(typeof result.valid,'boolean');assert.ok(result.metrics);
   for(const row of result.rows)assert.equal(row.length,result.columns.length,a.id);
   assert.ok((result.svg.match(/<(?:path|circle|rect|line|ellipse)\b/g)||[]).length>=(result.valid?3:1),a.id+' '+JSON.stringify(c.params));
  }
  assert.notEqual(en.summary,zh.summary,a.id);
 }
});

test('controls accept numeric strings and reject invalid values without throwing or clipping',()=>{
 assert.equal(E('11-01',{n:'2',x:'1.5',k:'2'}).metrics.identityMultiplier,4);
 for(const x of [NaN,Infinity,'',null,true,100,.13]){const r=E('11-01',{x});assert.equal(r.valid,false);assert.ok(r.summary);assert.doesNotMatch(r.svg,/NaN|Infinity/);}
 assert.equal(E('01-03',{op:'unknown'}).valid,false);
 assert.equal(E('13-01',{a:1,b:1}).valid,false);
 assert.throws(()=>evaluate('missing'),RangeError);
});

test('membership, singleton inclusion and empty-set inclusion use different object types',()=>{
 for(const n of [1,2,3,4,5,6,7,8])for(const set of ['even','first']){
  const expected=set==='even'?n%2===0:n<=4;
  assert.equal(E('01-01',{n,set,object:'number'}).metrics.member,expected);
  assert.equal(E('01-01',{n,set,object:'number'}).metrics.subset,null);
  const singleton=E('01-01',{n,set,object:'singleton'}).metrics;
  assert.equal(singleton.member,false);assert.equal(singleton.subset,expected);
  assert.equal(E('01-01',{n,set,object:'empty'}).metrics.subset,true);
 }
 const sameEmpty=E('01-02',{a:0,b:0}).metrics;
 assert.equal(sameEmpty.included,true);assert.equal(sameEmpty.proper,false);assert.equal(sameEmpty.equal,true);
 assert.equal(E('01-02',{a:8,b:2}).metrics.witness,8);
});

test('set operations agree with elementwise truth tables, including empty and disjoint sets',()=>{
 for(const a of [0,2,5,8])for(const b of [1,3,8,9])for(const op of ['intersection','union','difference','complement']){
  const result=E('01-03',{a,b,op}).metrics.result;
  for(let x=1;x<=8;x++){
   const inA=x<=a,inB=x>=b,expect={intersection:inA&&inB,union:inA||inB,difference:inA&&!inB,complement:!inA}[op];
   assert.equal(result.includes(x),expect,`${a},${b},${op},${x}`);
  }
 }
});

test('survey feasibility follows four independent nonnegative cell counts',()=>{
 for(const total of [10,20])for(const a of [0,8,15])for(const b of [0,8,15])for(const overlap of [0,3,8,15]){
  const r=E('01-04',{total,a,b,overlap});const independent=[overlap,a-overlap,b-overlap,total-a-b+overlap];
  assert.equal(r.valid,independent.every(x=>x>=0));
  assert.equal(r.metrics.counts.reduce((a,b)=>a+b,0),total);
  if(r.valid)assert.ok(r.metrics.union<=total);
 }
});

test('implication refutations have true premise and false conclusion',()=>{
 for(let c=-3;c<=3;c++)for(let x=-4;x<=4;x++){
  const r=E('02-01',{x,c}).metrics;
  assert.equal(r.isCounterexample,x>c&&x<=0);assert.equal(r.implication,!(x>c&&x<=0));
 }
});

test('necessary/sufficient classification is checked with explicit witnesses in every failing direction',()=>{
 for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){
  const r=E('02-02',{a,b}).metrics;
  if(r.forward){for(const x of [a+.1,a+1,a+10])assert.ok(x>b);}else assert.ok(r.witness>a&&r.witness<=b);
  if(r.reverse){for(const x of [b+.1,b+1,b+10])assert.ok(x>a);}else assert.ok(r.witness>b&&r.witness<=a);
  assert.equal(r.forward&&r.reverse,a===b);
 }
});

test('finite quantifiers are exhaustively enumerated, real claims use exact square bounds',()=>{
 for(const n of [1,2,5])for(const k of [-2,0,1,4,5,25,26])for(const strict of ['no','yes']){
  const values=Array.from({length:2*n+1},(_,i)=>i-n).map(x=>strict==='yes'?x*x>k:x*x>=k),r=E('02-03',{n,k,strict,domain:'finite'}).metrics;
  assert.equal(r.all,values.every(Boolean));assert.equal(r.exists,values.some(Boolean));
  const real=E('02-03',{n,k,strict,domain:'real'}).metrics;
  assert.equal(real.all,strict==='yes'?k<0:k<=0);assert.equal(real.exists,true);
  const witness=Math.sqrt(Math.max(k,0)+1);assert.ok(witness*witness>k);
 }
});

test('quantifier negation includes equality and reverses the truth value on a closed interval',()=>{
 for(const n of [1,2,5])for(const k of [-1,0,1,4,25,26])for(const quantifier of ['all','exists']){
  const r=E('02-04',{n,k,quantifier}).metrics;
  const direct=quantifier==='all'?0>k:n*n>k;
  assert.equal(r.original,direct);assert.equal(r.negation,!direct);
 }
 assert.equal(E('02-04',{n:2,k:0,quantifier:'all'}).metrics.witness,0);
});

test('quadratic interval solutions match direct factor signs across signs, repeated roots and equality',()=>{
 for(const a of [-2,-1,0,1,2])for(const [r,s] of [[-2,3],[1,1],[4,-1]])for(const relation of ['lt','le','gt','ge']){
  const result=E('03-03',{a,r,s,relation}).metrics;
  for(let x=-6;x<=6;x+=.25){const y=a*(x-r)*(x-s),expected={lt:y<0,le:y<=0,gt:y>0,ge:y>=0}[relation];assert.equal(intervalContains(result.intervals,x),expected,`${a},${r},${s},${relation},${x}`);}
 }
 assert.equal(E('03-03',{a:1,r:2,s:2,relation:'lt'}).metrics.solution,'∅');
 assert.equal(E('03-03',{a:1,r:2,s:2,relation:'le'}).metrics.solution,'{2}');
});

test('root classification validates actual roots and linear/constant degeneracies',()=>{
 for(const a of [-2,-1,0,1,2])for(const b of [-2,0,2])for(const c of [-2,0,2]){
  const m=E('03-02',{a,b,c}).metrics;
  for(const root of m.roots)close(a*root*root+b*root+c,0,'root substitution');
  if(a!==0){const vertex=-b/(2*a),minimumSigned=(a*vertex*vertex+b*vertex+c)*Math.sign(a);assert.equal(m.roots.length,minimumSigned>0?0:minimumSigned===0?1:2);}
  else if(b!==0){assert.equal(m.kind,'linear');assert.equal(m.roots.length,1);}
  else assert.equal(m.kind,c===0?'all-real':'constant-no-zero');
 }
});

test('contextual integer choices satisfy profit, capacity and integrality together',()=>{
 for(const a of [-1,0,1])for(const [r,s] of [[2,8],[3,3],[-1,4],[2.5,3.5]]){
  const result=E('03-04',{a,r,s,d:6,integer:'yes'}).metrics;
  const expected=[];for(let x=0;x<=6;x++)if(a*(x-r)*(x-s)>=0)expected.push(x);
  assert.deepEqual(result.integers,expected);
 }
 assert.deepEqual(E('03-04',{a:-1,r:2,s:8,d:6,integer:'yes'}).metrics.integers,[2,3,4,5,6]);
});

test('division reconstructs coefficients independently, including every missing zero slot',()=>{
 for(const id of ['04-01','04-02','04-03','04-04'])for(const a of [-3,-1,0,2]){
  const m=E(id,{a}).metrics,reconstructed=add(multiply([1,-a],m.quotient),[m.remainder]);
  coefficientsEqual(reconstructed,m.coefficients);
  close(value(m.coefficients,a),m.remainder,'remainder by direct powers');
  assert.equal(m.quotient.length,m.coefficients.length-1);
 }
 const missing=E('04-02',{b:2,c:-1,a:2}).metrics;
 assert.deepEqual(missing.coefficients,[1,0,2,0,-1]);
 assert.equal(missing.remainder,16+8-1);
});

test('factor repair gives an exact root for negative, zero and positive requested roots',()=>{
 for(const a of [-3,-1,0,1,3])for(const k of [-3,0,3]){
  const m=E('04-04',{a,k,c:0}).metrics;
  close(a*a*a+k*a+m.requiredConstant,0);
  const repaired=E('04-04',{a,k,c:m.requiredConstant});
  assert.equal(repaired.metrics.isFactor,true);
 }
});

test('variation identities retain their zero and domain cases instead of inventing ratios',()=>{
 for(const n of [1,2,3])for(const k of [-2,0,2]){
  const m=E('11-01',{n,k,x:1.5}).metrics;
  close(m.outputs[1],2**n*m.outputs[0]);assert.equal(m.ratio,k===0?null:2**n);
 }
 for(const k of [-4,0,4])for(const x of [-2,1,3])for(const t of [.5,2,3]){
  const m=E('11-02',{k,x,t}).metrics;close(m.outputs[0]*m.inputs[0],k);close(m.outputs[1]*m.inputs[1],k);close(m.outputs[1],m.outputs[0]/t);
 }
 assert.equal(E('11-02',{k:0,x:0,t:2}).valid,false);
 for(const x of [-2,0,2])for(const z of [-2,0,2]){const m=E('11-03',{k:2,x,z}).metrics;assert.deepEqual(m.outputs,[2*x*z,4*x*z,8*x*z]);assert.equal(m.ratiosDefined,x*z!==0);}
 for(const a of [-3,0,3]){const m=E('11-04',{a,b:2,x:1.5}).metrics;close(m.doublingDifference,-a);assert.equal(m.proportional,a===0);}
 assert.equal(E('11-04',{a:3,b:2,x:0}).metrics.ratioAtX,null);
});

test('factor-count GCD and LCM satisfy divisibility and the monic product identity',()=>{
 for(const [m,n,p,q] of [[2,1,1,3],[2,0,0,2],[0,0,2,1],[3,3,1,2],[0,0,0,0]]){
  const g=E('12-01',{m,n,p,q}).metrics,l=E('12-02',{m,n,p,q}).metrics;
  const polynomial=(r,s)=>multiply(factorPower(1,r),factorPower(-1,s));
  const G=polynomial(...g.gcdExponents),M=polynomial(...l.lcmExponents),A=polynomial(m,n),B=polynomial(p,q);
  coefficientsEqual(multiply(G,M),multiply(A,B));
  for(const root of [1,-1]){
   const i=root===1?0:1;assert.ok(g.gcdExponents[i]<=[m,n][i]&&g.gcdExponents[i]<=[p,q][i]);
   assert.ok(l.lcmExponents[i]>=[m,n][i]&&l.lcmExponents[i]>=[p,q][i]);
   assert.ok(g.gcdExponents[i]===[m,n][i]||g.gcdExponents[i]===[p,q][i],'common divisor cannot gain another factor');
  }
 }
});

test('Euclidean steps are actual polynomial identities and discover the extra common factor',()=>{
 for(const r of [-2,0,2])for(const u of [-1,0,1,4])for(const v of [-2,0,1,2]){
  const m=E('12-03',{r,u,v}).metrics;
  for(const step of m.steps){coefficientsEqual(step.dividend,add(multiply(step.divisor,step.quotient),step.remainder));assert.ok(step.remainder.length<step.divisor.length||step.remainder.every(c=>c===0));}
  assert.equal(m.gcd[0],1);
  assert.equal(m.gcdDegree,v*v+u===0?2:1);
  for(const x of [-3,-.5,0,1,3]){if(m.gcdDegree===1)close(value(m.gcd,x),x-r);else close(value(m.gcd,x),(x-r)*(x+v));}
 }
});

test('distinct and repeated partial fractions satisfy independent numerator coefficient equations',()=>{
 for(const [a,b,m,n] of [[0,-1,0,1],[1,-1,1,-1],[-2,3,2,-3],[2,-3,-1,2]]){
  const out=E('13-01',{a,b,m,n}).metrics;close(out.A+out.B,m);close(-out.A*b-out.B*a,n);
  for(const x of [-4,-.5,.5,4])if(x!==a&&x!==b)close(out.A/(x-a)+out.B/(x-b),(m*x+n)/((x-a)*(x-b)));
 }
 for(const a of [-2,0,2])for(const m of [-2,0,2])for(const n of [-2,0,2]){
  const out=E('13-02',{a,m,n}).metrics;close(out.A,m);close(out.B-out.A*a,n);
 }
 assert.equal(E('13-01',{a:1,b:1}).valid,false);
});

test('improper fractions retain their polynomial part and exact original exclusions',()=>{
 for(const [p,q,a,b] of [[2,3,1,-1],[0,-1,1,-1],[0,0,0,1],[-2,4,-2,3]]){
  const m=E('13-03',{p,q,a,b}).metrics;
  const denominator=multiply([1,-a],[1,-b]),remainder=[m.A+m.B,-m.A*b-m.B*a];
  coefficientsEqual(add(denominator,remainder),[1,p,q]);assert.equal(m.quotient,1);assert.deepEqual(m.excluded,[a,b]);
 }
 const constant=E('13-03',{p:0,q:-1,a:1,b:-1}).metrics;
 assert.equal(constant.A,0);assert.equal(constant.B,0);assert.equal(constant.holes.length,2);
 assert.ok(constant.holes.every(h=>h.y===1));
});

test('cancellation displays removable holes and preserves original versus simplified domains',()=>{
 const ordinary=E('13-04',{a:1,b:-1,c:2,x:0}).metrics;
 assert.equal(ordinary.originalDefined,true);assert.equal(ordinary.simplifiedDefined,true);close(ordinary.originalValue,ordinary.simplifiedValue);
 const hole=E('13-04',{a:1,b:-1,c:2,x:1}).metrics;
 assert.equal(hole.originalDefined,false);assert.equal(hole.simplifiedDefined,true);assert.equal(hole.originalValue,null);close(hole.simplifiedValue,1.5);assert.deepEqual(hole.hole,{x:1,y:1.5});
 const two=E('13-04',{a:1,b:-1,c:1,x:-1}).metrics;
 assert.equal(two.originalDefined,false);assert.equal(two.simplifiedDefined,false);assert.equal(two.holes.length,2);assert.ok(two.holes.every(h=>h.y===1));
 const zero=E('13-02',{a:1,m:0,n:0}).metrics;assert.deepEqual(zero.holes,[{x:1,y:0}]);
});
