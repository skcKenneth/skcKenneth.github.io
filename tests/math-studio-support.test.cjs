const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..','public','math-studio');
const ctx=vm.createContext({console,Map,Set,Math});
for(const f of ['data.js','learning-content.js','challenge-bank.js','question-bank.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
const bank=vm.runInContext('PracticeBank',ctx),content=vm.runInContext('LearningContent',ctx),registry=vm.runInContext('ChallengeBank.registry',ctx);
const near=(a,b,label)=>assert(Math.abs(a-b)<1e-7,label||`${a} != ${b}`);
function random(seed){let x=seed>>>0;return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
const ints=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const oracles={
 operations:{
  telescope:p=>ints(p.a,p.b).reduce((s,k)=>s+1/(k*(k+1)),0),
  power:p=>(-p.a)*(-p.a)-p.b-(-(p.a*p.a)-p.b),
  balance:p=>ints(0,150).find(start=>[start-p.a,start-p.a+p.b,start-p.a+p.b-p.c].every(x=>x>=0)),
  weighted:p=>[...Array(p.u).fill(p.w-p.a),...Array(p.v).fill(p.w+p.b)].reduce((a,b)=>a+b),
  scientific:p=>(p.a*10**p.p)/(p.b*10**p.q),
  'order-error':p=>{assert.notEqual((p.a*p.b)/p.b*p.c,(p.a*p.b)/(p.b*p.c));}
 },
 rational:{
  distance:p=>Math.min(...ints(p.a-10,p.b+10).map(x=>Math.abs(x-p.a)+Math.abs(x-p.b))),
  'negative-order':p=>Math.max(-p.a,-p.b)-Math.min(-p.a,-p.b),
  'absolute-count':p=>ints(-50,50).filter(x=>Math.abs(x)<=p.a&&x>-p.b).length,
  inverse:p=>Math.abs(p.a+(-p.a-p.b)),
  reference:p=>Math.abs((p.a-p.c)-(-p.b-p.c)),
  counterexample:p=>{assert(Math.abs(-p.a)<Math.abs(-p.b));assert(!(-p.a<-p.b));assert(p.a<p.b);}
 },
 expressions:{
  whole:p=>p.k*p.a*(p.c/p.a)+p.k*p.b*0+p.d,
  fee:p=>Array(p.t).fill(p.a+p.b).reduce((a,b)=>a+b)-(Array(p.t).fill(p.a).reduce((a,b)=>a+b)+p.b),
  pattern:p=>4+Array(p.count-p.remove-1).fill(3).reduce((a,b)=>a+b,0),
  'signed-substitution':p=>(-p.a-p.b)*(-p.a-p.b)-(-p.a)*(-p.a),
  units:p=>p.total-Array(p.hours*60+p.minutes).fill(p.speed).reduce((a,b)=>a+b),
  'bracket-meaning':p=>{assert.notEqual(p.a*(p.x-p.b),p.a*p.x-p.b);}
 },
 'polynomial-add':{
  independent:(p,q)=>{for(const x of [-13,0,2.5,19])near((p.a*q.answer+p.b)*x-p.c*x+7,7);return q.answer;},
  recover:p=>(p.c*p.x+p.d)-(p.a*p.x-p.b),
  nested:p=>p.a*p.x-(p.b*p.x-(p.c-p.x)),
  like:p=>ints(0,15).find(m=>m+p.k===p.u)+p.v,
  perimeter:p=>[p.a*p.x+p.b,p.c*p.x+p.d,p.a*p.x+p.b,p.c*p.x+p.d].reduce((a,b)=>a+b),
  error:p=>{assert.notEqual(p.a*0-(p.b*0-p.c),(p.a-p.b)*0-p.c);for(const x of [-3,0,7])near(p.a*x-(p.b*x-p.c),(p.a-p.b)*x+p.c);}
 },
 'linear-equation':{
  denominator:(p,q)=>{near((p.a*q.answer+p.b)/p.d-q.answer,p.rhs/p.d);return q.answer;},
  profit:(p,q)=>{near(q.answer+q.answer*p.p/100,p.sale);return q.answer;},
  catch:p=>ints(0,200).find(t=>p.b*t===p.gap+p.a*t),
  'given-root':p=>p.a*p.root+p.b,
  'shared-fee':p=>ints(1,100).find(x=>p.a*p.x+p.fee-p.a*x===p.b*p.x+p.fee-p.b*x),
  identity:p=>{for(const x of [-100,-1,0,3,13]){near(p.a*(x+p.b),p.a*x+p.a*p.b);assert.notEqual(p.a*(x+p.b),p.a*x+p.a*p.b+p.d);}}
 },
 inequality:{
  negative:(p,q)=>{for(const x of [q.answer-1,q.answer,q.answer+1])assert.equal(p.c-p.a*x>=p.rhs,x<=q.answer);return q.answer;},
  integer:p=>ints(-100,100).filter(x=>x>p.a&&2*x<=2*p.b).length,
  budget:p=>Math.max(...ints(0,100).filter(x=>p.fee+p.price*x<=p.budget)),
  parameter:p=>ints(-30,60).find(m=>ints(-50,100).filter(x=>x>p.a&&x<m).length===p.count),
  tariffs:p=>ints(0,100).find(x=>p.fee+p.rate*x<(p.rate+p.gap)*x),
  'unknown-sign':p=>{for(const x of [-p.b-1,-p.b,0,p.b])assert.equal(-p.a*x<p.a*p.b,x>-p.b);assert(0<p.a*p.b);}
 }
};

test('36 substantive families have >=10 unique variants and independently checked mathematics',()=>{
 let checked=0;
 for(const [lesson,families] of Object.entries(registry)){
  assert.equal(families.length,6);
  for(const f of families){
   assert.equal(f.level,3);assert(f.concept&&f.support&&f.misconceptions.length);
   const qs=bank.pool(lesson).filter(q=>q.family===f.family);assert(qs.length>=10,`${f.family}: ${qs.length}`);
   const kind=f.family.split('-challenge-')[1],oracle=oracles[lesson][kind];assert(oracle,f.family);
   for(const q of qs){checked++;const expected=oracle(q.params,q);if(q.type==='numeric'){near(q.answer,expected,q.prompt);assert(q.steps.join(' ').includes(q.answerText),q.family+' answer missing from explanation');}
    assert(q.followups.length>=3);assert.equal(new Set(q.followups.map(f=>f.label)).size,q.followups.length);
    assert(!/undefined|NaN|Infinity/.test(JSON.stringify(q)));
    for(const follow of q.followups){assert(follow.step>=0&&follow.step<q.steps.length);assert(follow.text.length>20);}
   }
  }
 }
 assert(checked>3500);
});

test('challenge draws respect caps regardless of history; basic practice remains full',()=>{
 for(const lesson of Object.keys(registry))for(const count of [5,10,15]){
  const config={grade:'g7',lesson,level:'3',count},pool=bank.candidates(config);
  const histories=[{},Object.fromEntries(pool.map((q,i)=>[q.key,i+1])),Object.fromEntries(pool.filter(q=>q.type==='written').map(q=>[q.key,1])),Object.fromEntries(pool.filter(q=>q.type!=='written').map(q=>[q.key,1]))];
  for(const h of histories)for(let seed=1;seed<=100;seed++){
   const out=bank.select(config,h,random(seed));assert.equal(out.questions.length,count);assert.equal(out.shortage,null);assert.equal(out.coverage,count===5?5:6);assert.equal(new Set(out.questions.map(q=>q.key)).size,count);
   const freq={};for(const q of out.questions){assert.equal(q.level,3);freq[q.family]=(freq[q.family]||0)+1;}assert(Object.values(freq).every(n=>n<=count/5));
  }
  for(const level of ['1','2','mix'])assert.equal(bank.select({...config,level}).questions.length,count);
 }
});

test('unexpanded chapters disclose shortfall and supplementation preserves selected items',()=>{
 const c={grade:'g8',lesson:'triangles',level:'3',count:5};
 const out=bank.select(c,{},random(1));assert.equal(out.questions.length,2);assert.equal(out.coverage,2);assert.equal(out.shortage,'family-cap');
 const supplement=bank.supplement(c,out.questions,{},random(2));assert.equal(supplement.length,3);const all=[...out.questions,...supplement];assert.equal(new Set(all.map(q=>q.key)).size,5);assert(all.every(q=>q.level===3));
 const repeat=bank.select(c,Object.fromEntries(out.questions.map(q=>[q.key,1])),random(4));assert.equal(repeat.coverage,2);assert.equal(repeat.repeats,1,'fixed written family must remain available even after being seen');
 assert.equal(bank.select({...c,lesson:'all'}).questions.length,5);
});

const foundationOracles={
 operations:{'signed-add':p=>-p.a+p.b+p.c,'power-base':p=>(-p.a)*(-p.a)-p.b,order:p=>(p.a*p.b)/p.b*p.c-p.d,scientific:p=>Math.round(Math.log10((p.a*10**p.p)/p.a))},
 rational:{classification:p=>p.base-p.below,line:p=>Math.abs(-p.a-p.b),opposite:p=>-(-p.a)+p.b},
 expressions:{translate:p=>p.a*p.x+p.b,substitute:p=>p.a*p.x*p.x-p.b,pattern:p=>4+3*(p.count-1)},
 'polynomial-add':{terms:p=>p.u+p.v,combine:p=>p.a*p.x-p.b*p.x+p.c,brackets:p=>p.a*p.x-(p.b*p.x-p.c)},
 'linear-equation':{balance:(p,q)=>{near(p.a*q.answer+p.b,p.rhs);return q.answer;},fraction:(p,q)=>{near((q.answer+p.b)/p.d-p.c,p.rhs);return q.answer;},model:(p,q)=>{near(p.a*q.answer+p.fee,p.total);return q.answer;}},
 inequality:{direction:(p,q)=>{for(const x of [p.b-1,p.b,p.b+1])assert.equal(-p.a*x>-p.a*p.b,x<q.answer);return q.answer;},intersection:p=>ints(-50,50).filter(x=>x>p.a&&x<=p.b).length,application:p=>Math.max(...ints(0,100).filter(x=>p.fee+p.a*x<=p.budget))}
};
test('foundation examples reproduce, cover all six chapters, and pass independent checks',()=>{
 for(const [lesson,sections] of Object.entries(content.chapters)){assert(sections.length>=3);
  for(const section of sections){assert(section.concepts.length>=3&&section.diagram);
   for(let seed=0;seed<160;seed++){const q=section.make(seed);near(q.answer,foundationOracles[lesson][section.id](q.params,q));assert.equal(JSON.stringify(q),JSON.stringify(section.make(seed)));assert(q.steps.every(s=>s.doing&&s.why));assert(!/NaN|undefined/.test(JSON.stringify(q)));}
  }
 }
});

test('contrast templates check negative powers, zero, parentheses, endpoints and wrong-equation warnings',()=>{
 for(const [lesson,pairs] of Object.entries(content.comparisons)){assert(pairs.length>=2);for(const pair of pairs){const variants=new Set();for(let seed=0;seed<60;seed++){const p=pair.make(seed);variants.add(JSON.stringify(p));assert(p.rows.length>=2&&p.explanation);assert(Number.isFinite(p.left.answer)&&Number.isFinite(p.right.answer));assert.equal(JSON.stringify(p),JSON.stringify(pair.make(seed)));assert(!/undefined|NaN/.test(JSON.stringify(p)));}assert(variants.size>=10,lesson+':'+pair.title);}}
 const pow=content.comparisons.operations[0];near(pow.make(0).left.answer,-4);near(pow.make(0).right.answer,4);near(pow.make(1).left.answer,-9);near(pow.make(1).right.answer,9);near(pow.make(2).left.answer,-64);near(pow.make(2).right.answer,-64);
 for(let seed=0;seed<60;seed++){
  const subtraction=content.comparisons.operations[1].make(seed);assert(subtraction.left.answer>subtraction.right.answer);
  const abs=content.comparisons.rational[0].make(seed);assert(abs.right.answer>=0);near(Math.abs(abs.left.answer),abs.right.answer);
  const bounds=content.comparisons.inequality[1].make(seed);near(bounds.right.answer-bounds.left.answer,1);
  for(const p of content.comparisons['linear-equation']){const q=p.make(seed);assert.notEqual(q.left.answer,q.right.answer);assert(q.explanation.includes('等式')||q.explanation.includes('錯誤'));}
 }
});
