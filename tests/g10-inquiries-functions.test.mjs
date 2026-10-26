import test from 'node:test';
import assert from 'node:assert/strict';
import {activities,evaluate,directStateForCase,directAction,directScene,firstThresholdRound} from '../src/data/g10-inquiries-functions.mjs';
import {createDirectState,renderDirectScene} from '../src/lib/function-hands-on.mjs';

const id=(chapter,n)=>`g10-${chapter}-${String(n).padStart(2,'0')}`;
const calc=(n,p)=>evaluate(id('06',n),p);
const functionCase=(n,i)=>evaluate(id('05',n),{scenario:String(i)});
const close=(actual,expected,tolerance=1e-10)=>assert.ok(Math.abs(actual-expected)<=tolerance*Math.max(1,Math.abs(expected)),`${actual} != ${expected}`);

test('24 original bilingual microtasks have executable contrast cases and complete teacher fields',()=>{
 assert.equal(activities.length,24);
 assert.equal(activities.filter(a=>a.chapter==='05').length,15);
 assert.equal(activities.filter(a=>a.chapter==='06').length,9);
 assert.equal(new Set(activities.map(a=>a.id)).size,24);
 const fields=['title','question','prediction','prerequisites','explanation','conditions','misconception','challenge','proof','teacherPrompt'];
 for(const a of activities){
  assert.ok(a.cases.length>=3,a.id);assert.ok(a.cases.some(c=>c.boundary),a.id);
  assert.ok(a.controls.length,a.id);
  for(const value of [...fields.map(key=>a[key]),a.exit.prompt,a.exit.answer,...a.cases.map(c=>c.label)])for(const l of ['en','zh-Hant'])assert.ok(typeof value?.[l]==='string'&&value[l].length>1,`${a.id}/${l}`);
  for(const c of a.cases){
   const en=evaluate(a.id,c.params,'en'),zh=evaluate(a.id,c.params,'zh-Hant');
   assert.notEqual(en.summary,zh.summary,`${a.id} summary translation`);
   for(const result of [en,zh]){
    assert.ok(Array.isArray(result.columns)&&result.columns.length);assert.ok(result.rows.length);
    assert.match(result.svg,/viewBox="0 0 (?:720 340|960 540)"/);assert.match(result.svg,/<title>[^<]+<\/title>/);
    assert.match(result.svg,/<(?:path|line|circle|rect)\b/);
    assert.doesNotMatch(result.svg,/NaN|Infinity|<script|on(?:click|load|pointer)\w*=/i);
    assert.equal(typeof result.valid,'boolean');assert.equal(typeof result.metrics,'object');
   }
  }
 }
});

test('native worksheet identity and original source models remain intact',()=>{
 for(let n=1;n<=14;n++){
  const a=activities.find(a=>a.id===id('05',n)),native=String(n).padStart(2,'0');
  assert.equal(a.nativeId,native);assert.equal(a.nativeActivityId,`senior:function-worksheet:${native}`);
  const base=createDirectState(native),before=JSON.stringify(base);
  evaluate(a.id,{scenario:'0'});assert.equal(JSON.stringify(base),before);
  const scene=directScene(a.id,base,'en'),original=renderDirectScene(native,base,'en');
  assert.deepEqual(scene,original);
 }
 assert.throws(()=>directStateForCase('g10-05-15'),RangeError);
 assert.throws(()=>evaluate('g10-06-99'),RangeError);
});

test('scenario selection yields distinct mathematical constructions, not presentation-only variants',()=>{
 for(let n=1;n<=14;n++){
  const a=activities.find(a=>a.id===id('05',n)),states=a.cases.map(c=>directStateForCase(a.id,c.params));
  assert.equal(new Set(states.map(JSON.stringify)).size,states.length,a.id);
  const results=a.cases.map(c=>evaluate(a.id,c.params).rows);
  assert.ok(new Set(results.map(JSON.stringify)).size>1,`${a.id} table must change`);
 }
});

test('01 functions allow many-to-one but reject missing or multiple distinct outputs',()=>{
 for(const [scenario,expected]of [[0,true],[1,false],[2,false],[3,true]]){
  const state=directStateForCase(id('05',1),{scenario:String(scenario)});
  const independent=[1,2,3].every(x=>new Set(state.links.filter(pair=>pair[0]===x).map(pair=>pair[1])).size===1);
  assert.equal(independent,expected);
  for(const row of functionCase(1,scenario).rows){const input=Number(row[0]);assert.equal(Number(row[2]),new Set(state.links.filter(pair=>pair[0]===input).map(pair=>pair[1])).size);}
 }
});

test('02 same expression distinguishes permitted inputs and finite versus interval ranges',()=>{
 const finite=functionCase(2,0),interval=functionCase(2,1);
 assert.equal(Number(finite.rows[0][1]),.5);assert.equal(finite.rows[0][2],'rejected');
 assert.equal(Number(finite.rows[0][3]),.5**2+1);assert.equal(finite.rows[0][4],'—');
 assert.equal(interval.rows[0][2],'allowed');close(Number(interval.rows[0][4]),1.25);
 assert.equal(functionCase(2,2).rows[0][2],'allowed');assert.equal(functionCase(2,3).rows[0][2],'rejected');
});

test('03 root boundary can be included while a denominator zero is excluded',()=>{
 assert.equal(functionCase(3,0).rows[0][2],'yes');
 assert.equal(functionCase(3,1).rows[0][2],'no');
 assert.equal(functionCase(3,2).rows[0][2],'no');
 assert.equal(functionCase(3,3).rows[0][2],'yes');
});

test('04 mask intersection and cancellation retain the original forbidden point',()=>{
 const combined=functionCase(4,0);close(Number(combined.rows[0][2]),Math.sqrt(0+1)/(0-2));
 assert.equal(functionCase(4,1).rows[0][2],'undefined');
 const hole=functionCase(4,2);assert.equal(hole.rows[0][2],'undefined');assert.equal(Number(hole.rows[0][3]),2);
 assert.match(hole.summary,/x ≠ 1/);
 const finiteOutputs=new Set([-2,-1,0,1].map(x=>x*x));assert.deepEqual([...finiteOutputs].sort((a,b)=>a-b),[0,1,4]);
 assert.notEqual(functionCase(4,3).summary,functionCase(4,4).summary);
});

test('05 continuous and integer domains change the output at x=2.5',()=>{
 const continuous=functionCase(5,0),integer=functionCase(5,1),separate=functionCase(5,2);
 assert.deepEqual(continuous.rows.at(-1),['Probe x = 2.5','9','source input allowed']);
 assert.deepEqual(integer.rows.at(-1),['Probe x = 2.5','undefined','source input rejected']);
 assert.notEqual(continuous.summary,integer.summary);
 assert.equal(directStateForCase(id('05',5),{scenario:'1'}).connected,true);
 assert.equal(directStateForCase(id('05',5),{scenario:'2'}).connected,false);
 assert.notEqual(integer.svg,separate.svg);
});

test('06 boundary overlap is acceptable exactly when its distinct output set is a singleton',()=>{
 const one=functionCase(6,0),none=functionCase(6,1),same=functionCase(6,2),two=functionCase(6,3);
 const rowAt=(result,x)=>result.rows.find(row=>Number(row[0])===x);
 assert.equal(Number(rowAt(one,1).at(-1)),1);
 assert.equal(Number(rowAt(none,1).at(-1)),0);
 assert.equal(Number(rowAt(same,1).at(-1)),1);
 assert.ok(two.rows.some(row=>Number(row.at(-1))===2));
});

test('07 compositions retain intermediate values, noncommutativity and root domain rejection',()=>{
 const ab=functionCase(7,0),ba=functionCase(7,1),root0=functionCase(7,2),root1=functionCase(7,3);
 assert.deepEqual(ab.rows[0].slice(1),['2','4','7']);
 assert.deepEqual(ba.rows[0].slice(1),['2','5','10']);
 assert.equal(Number(ba.rows[0].at(-1))-Number(ab.rows[0].at(-1)),3);
 assert.equal(root0.rows[0].at(-1),'Undefined');assert.equal(root0.rows[1].at(-1),'-1');
 assert.equal(root1.rows[0].at(-1),'0');assert.equal(root1.rows[1].at(-1),'0');
});

test('08 open interval witness defeats every interior maximum; closing changes attainment',()=>{
 const state=directStateForCase(id('05',8),{scenario:'1'}),w=state.witness.x;
 assert.ok(state.maxAt<w&&w<2);close(w,(state.maxAt+2)/2);
 for(const x of [.0001,.25,1,1.9999]){const y=(x+2)/2;assert.ok(x<y&&y<2);}
 const closed=directStateForCase(id('05',8),{scenario:'2'});assert.equal(closed.rightClosed,true);assert.equal(closed.maxAt,2);
});

test('09 crossing zero refutes whole-domain decrease without changing input order',()=>{
 const result=functionCase(9,2);assert.deepEqual(result.rows[0],['-1','1','-1','1','2']);
 const negative=directStateForCase(id('05',9),{scenario:'1'});assert.ok(negative.x1<negative.x2&&negative.x2<0);
 assert.ok(1/negative.x1>1/negative.x2);
 assert.equal(functionCase(9,3).rows[0][2],'Undefined');
});

test('10 parity requires symmetric domain; zero is both odd and even',()=>{
 const symmetric=directStateForCase(id('05',10),{scenario:'0'}),restricted=directStateForCase(id('05',10),{scenario:'1'});
 assert.equal(symmetric.domain,'symmetric');assert.equal(restricted.domain,'restricted');assert.equal(restricted.lo,0);
 for(const x of [-3,-1,0,2,3]){assert.equal((-x)**2,x**2);assert.ok(0===-0);}
 assert.equal(directStateForCase(id('05',10),{scenario:'3'}).rule,'zero');
 assert.notEqual(functionCase(10,0).summary,functionCase(10,1).summary);
});

test('11 power curves expose reciprocal zero and real-root negative rejection',()=>{
 const atZero=functionCase(11,1),rows=Object.fromEntries(atZero.rows.map(row=>[row[0],row]));
 assert.deepEqual(rows.A.slice(1,3),['0','1']);
 assert.deepEqual(rows.B.slice(1,3),['undefined','-1']);
 assert.deepEqual(rows.C.slice(1,3),['0','-1']);
 assert.deepEqual(rows.D.slice(1,3),['0','undefined']);
 assert.deepEqual(rows.E.slice(1,3),['0','-1']);
});

test('12 sign of x³−x² changes only across the positive-base boundary 1',()=>{
 for(const [scenario,x]of [[0,.5],[1,1],[2,2]]){
  const row=functionCase(12,scenario).rows[0];assert.equal(Number(row[0]),x);close(Number(row[1]),x*x);close(Number(row[2]),x*x*x);
  assert.equal(Math.sign(Number(row[2])-Number(row[1])),Math.sign(x-1));
 }
});

test('13 inverse affine-input steps and discount composition orders give independent outputs',()=>{
 const inverse=functionCase(13,0),wrong=functionCase(13,1),discount=functionCase(13,2),reverse=functionCase(13,3);
 assert.deepEqual(inverse.rows,[['3','1','3','11']]);assert.deepEqual(wrong.rows,[['3','0.5','2','8']]);
 assert.equal(Number(discount.rows[0].at(-1)),.9*100-20);
 assert.equal(Number(reverse.rows[0].at(-1)),.9*(100-20));
});

test('14 tie counts, cheapest quotes and integer budget capacities are independently enumerated',()=>{
 const costs=n=>[20+3*n,n<=20?5*n:2*n+60];
 assert.deepEqual(costs(10),[50,50]);assert.deepEqual(costs(40),[140,140]);
 for(const [scenario,n]of [[1,30],[2,50]]){const row=functionCase(14,scenario).rows.find(r=>Number(r[0])===n);assert.deepEqual(row.slice(1,3).map(Number),costs(n));}
 const maxima=[0,1].map(j=>Math.max(0,...Array.from({length:80},(_,i)=>i+1).filter(n=>costs(n)[j]<=160)));
 assert.deepEqual(maxima,[46,50]);assert.match(functionCase(14,3).summary,/P permits 46 booklets; Q permits 50/);
 assert.deepEqual(functionCase(14,4).rows,[['0','—','—','—']]);
});

test('native adapter honors directState, accepts native reducer actions and stays pure',()=>{
 const micro=id('05',7),start=directStateForCase(micro,{scenario:'0'}),before=JSON.stringify(start);
 const next=directAction(micro,start,{type:'action',id:'swap'}),result=evaluate(micro,{scenario:'0',directState:next});
 assert.equal(JSON.stringify(start),before);assert.deepEqual(next.order,['b','a']);assert.equal(result.rows[0].at(-1),'10');
 assert.deepEqual(result.metrics.nativeState,next);
 assert.equal(evaluate(micro,{directState:{x:Infinity}}).valid,false);
 assert.equal(evaluate(micro,{scenario:'99'}).valid,false);
});

test('15 squaring creates −1 as an extraneous candidate, while only x=2 satisfies the original equation',()=>{
 const bad=evaluate(id('05',15),{x:-1}),good=evaluate(id('05',15),{x:2}),outside=evaluate(id('05',15),{x:-3});
 assert.equal(bad.metrics.squared,true);assert.equal(bad.metrics.original,false);assert.equal(bad.metrics.lhs,1);assert.equal(bad.metrics.extraneous,true);
 assert.equal(good.metrics.original,true);assert.equal(good.metrics.lhs,2);assert.equal(good.metrics.extraneous,false);
 assert.equal(outside.valid,false);assert.equal(outside.metrics.lhs,null);assert.match(outside.summary,/undefined/);
 for(const x of [-2,-1,0,1,2,3]){const result=evaluate(id('05',15),{x});assert.equal(result.metrics.original,x===2);}
});

test('negative and rational powers obey reciprocal/root laws within declared real domains',()=>{
 close(calc(1,{a:2,n:-3}).metrics.value,1/8);close(calc(1,{a:-2,n:-3}).metrics.value,-1/8);assert.equal(calc(1,{a:0,n:-1}).valid,false);assert.equal(calc(1,{a:0,n:0}).valid,false);assert.equal(calc(1,{a:2,n:1.5}).valid,false);
 assert.equal(calc(2,{a:16,p:3,q:4}).metrics.value,8);close(calc(2,{a:16,p:-3,q:4}).metrics.value,1/8);close(calc(2,{a:27,p:2,q:3}).metrics.value,9);
 assert.equal(calc(2,{a:-1,p:1,q:2}).valid,false);assert.equal(calc(2,{a:1,p:1,q:0}).valid,false);assert.equal(calc(2,{a:0,p:2,q:3}).valid,false);
});

test('fixed additions and ratios separate after one matching step',()=>{
 for(const r of [.2,.8,1,1.2,2])for(const n of [0,1,2,3]){
  const result=calc(3,{r,n});let quantity=100;for(let k=0;k<n;k++)quantity*=r;
  close(result.metrics.exponential,quantity);close(result.metrics.linear,100+n*100*(r-1));
 }
 assert.equal(calc(3,{r:1.2,n:2}).metrics.linear,140);close(calc(3,{r:1.2,n:2}).metrics.exponential,144);
 assert.equal(calc(3,{r:.8,n:1.5}).valid,false);
});

test('base one and nonpositive bases are explicit exponential/logarithmic boundaries',()=>{
 assert.equal(calc(4,{a:2,x:-1}).metrics.kind,'increasing');assert.equal(calc(4,{a:.5,x:-1}).metrics.kind,'decreasing');
 const constant=calc(4,{a:1,x:2});assert.equal(constant.metrics.value,1);assert.equal(constant.metrics.kind,'constant');assert.equal(constant.valid,false);
 assert.equal(calc(4,{a:0,x:1}).valid,false);
 close(calc(5,{a:2,b:8}).metrics.value,3);close(calc(5,{a:2,b:.25}).metrics.value,-2);
 for(const p of [{a:1,b:8},{a:2,b:0},{a:2,b:-1},{a:0,b:2}])assert.equal(calc(5,p).valid,false);
});

test('inverse graphs exchange exact coordinates, domain and range',()=>{
 for(const a of [.5,2,3])for(const x of [-2,0,2]){const result=calc(6,{a,x});close(result.metrics.y,a**x);close(result.metrics.inverseX,a**x);close(result.metrics.inverseY,x);}
 assert.equal(calc(6,{a:1,x:1}).valid,false);
});

test('log product, quotient, power and change-of-base laws keep individual positive-argument conditions',()=>{
 const accidental=calc(7,{a:2,u:2,v:2}),counterexample=calc(7,{a:2,u:2,v:4});
 assert.equal(accidental.metrics.sumClaim,true);assert.equal(counterexample.metrics.sumClaim,false);close(counterexample.metrics.productLog,3);close(counterexample.metrics.sumLog,Math.log2(6));
 for(const a of [.5,2,3])for(const [u,v]of [[.5,2],[2,4],[8,2]]){const m=calc(7,{a,u,v}).metrics;close(m.productLog,m.lu+m.lv);close(m.quotientLog,m.lu-m.lv);close(m.powerLog,2*m.lu);close(m.changeOfBase,m.lu);}
 assert.equal(calc(7,{a:2,u:-2,v:-4}).valid,false);
});

test('thresholds check the candidate and predecessor, including exact decimal equality',()=>{
 assert.equal(firstThresholdRound(1.2,150),3);assert.equal(firstThresholdRound(.8,50),4);
 assert.equal(firstThresholdRound(1.2,144),2);assert.equal(firstThresholdRound(.8,64),2);
 assert.equal(firstThresholdRound(1.1,121),2);assert.equal(firstThresholdRound(.9,81),2);
 assert.equal(firstThresholdRound(1,150),null);assert.equal(firstThresholdRound(1,100),0);
 assert.equal(firstThresholdRound(1.2,90),0);assert.equal(firstThresholdRound(.8,150),0);
 for(const r of [.2,.5,.8,.9,1.1,1.2,1.5,2])for(const target of [10,50,100,150,200,300]){
  let expected=0;const meets=q=>r>1?q>=target:q<=target;
  let quantity=100;while(!meets(quantity)&&expected<100){quantity*=r;expected++;}
  const actual=firstThresholdRound(r,target);assert.equal(actual,expected,`${r}/${target}`);
  const rendered=calc(8,{r,target});assert.equal(rendered.metrics.first,expected);
  assert.ok(rendered.rows.some(row=>row[0]===expected));
  if(expected>0)assert.ok(rendered.rows.some(row=>row[0]===expected-1));
 }
 assert.equal(calc(8,{r:1,target:150}).valid,false);assert.equal(calc(8,{r:.8,target:0}).valid,false);
});

test('logarithmic inequalities reverse exactly for decreasing bases and exclude equality',()=>{
 assert.equal(calc(9,{a:2,x:2,b:4}).metrics.satisfies,true);
 assert.equal(calc(9,{a:.5,x:2,b:4}).metrics.satisfies,false);
 assert.equal(calc(9,{a:.5,x:6,b:4}).metrics.satisfies,true);
 assert.equal(calc(9,{a:.5,x:4,b:4}).metrics.satisfies,false);
 assert.equal(calc(9,{a:2,x:0,b:4}).valid,false);
 for(const a of [.25,.5,2,3])for(const x of [.5,2,4,6])assert.equal(calc(9,{a,x,b:4}).metrics.satisfies,a>1?x<4:x>4);
 assert.equal(calc(9,{family:'exponential',a:2,x:-1,b:0}).metrics.satisfies,true);
 assert.equal(calc(9,{family:'exponential',a:.5,x:-1,b:0}).metrics.satisfies,false);
 assert.equal(calc(9,{family:'exponential',a:2,x:0,b:0}).metrics.satisfies,false);
});

test('bad finite-number inputs return explanatory failures without SVG coordinate leakage',()=>{
 for(const a of activities.filter(a=>!a.nativeId))for(const key of a.controls.filter(c=>!c.options).map(c=>c.key))for(const bad of [NaN,Infinity,'2',null]){
  const result=evaluate(a.id,{...a.cases[0].params,[key]:bad});assert.equal(result.valid,false,`${a.id}/${key}/${bad}`);assert.doesNotMatch(result.svg,/NaN|Infinity/);
 }
});
