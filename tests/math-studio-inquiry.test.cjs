const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loadSite}=require('./helpers/math-studio-runtime.cjs');
const site=loadSite(),C=site.evaluate('G7InquiryCore'),U=site.evaluate('G7InquiryContent');
const plain=x=>JSON.parse(JSON.stringify(x));
const near=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
function result(id,p){return C.calculate(id,{...C.defaults(id),...p});}
test('12 chapter-aligned inquiries, 21 total; every case, prompt and graphic renders',()=>{
 assert.equal(site.evaluate('Object.keys(labInfo).length'),21);
 const lessons=site.evaluate('lessons.filter(l=>l.grade==="g7").map(l=>l.id)');
 assert.deepEqual(Object.values(C.definitions).map(d=>d.lesson).sort(),plain(lessons).sort());
 for(const [id,u] of Object.entries(U)){
  assert(u.cases.length>=3);assert.equal(u.hints.length,3);assert.equal(u.followups.length,3);assert.equal(u.teacher.questions.length,3);assert.equal(u.rubric.length,3);
  assert(u.transfer&&u.model.length&&u.teacher.exitAnswer&&u.conjecture&&u.misconception);
  assert.equal(u.extension.length,2);
  for(const [,p] of u.cases){const r=result(id,p);assert(!/NaN|undefined|Infinity/.test(JSON.stringify(r)));u.followups.forEach(([title,fn])=>{assert(title);assert(fn(r).trim());assert(!/NaN|undefined|Infinity/.test(fn(r)));});const svg=site.evaluate('G7InquiryUI').graphic(id,r);assert(svg.startsWith('<svg'));assert(svg.includes('role="img"'));assert(!/NaN|undefined|Infinity/.test(svg));}
  site.evaluate(`state.view='labs';state.lab='${id}';render();updateLab('${id}')`);
  assert(site.app.innerHTML.includes(`data-g7-inquiry="${id}"`));assert(site.app.innerHTML.includes('本機')||site.app.innerHTML.includes('此瀏覽器'));
  assert(site.elements['lab-stage'].innerHTML.includes('<svg'));
 }
});
test('distance objectives, signed powers, shared edges and algebraic invariance',()=>{
 for(let h1=-7;h1<=7;h1+=2)for(let h2=-6;h2<=6;h2+=3){const r=result('number',{h1,h2,h3:7,a:1}),m=r.metrics;
  const points=Array.from({length:33},(_,i)=>-8+i/2),sums=points.map(x=>m.homes.reduce((s,h)=>s+Math.abs(x-h),0)),maxs=points.map(x=>Math.max(...m.homes.map(h=>Math.abs(x-h))));
  near(result('number',{h1,h2,h3:7,a:m.median}).metrics.total,Math.min(...sums));near(result('number',{h1,h2,h3:7,a:m.midpoint}).metrics.max,Math.min(...maxs));
 }
 for(let a=0;a<=5;a++)for(let n=1;n<=6;n++){let value=1;for(let i=0;i<n;i++)value*=-a;const m=result('powers',{a,n}).metrics;near(m.right,value);assert.equal(m.equal,a===0||n%2===1);}
 for(let n=0;n<=10;n++)for(const joined of [0,1]){const edges=new Set();for(let i=0;i<n;i++){const x=i*(joined?1:2);for(const e of [[x,0,x+1,0],[x,1,x+1,1],[x,0,x,1],[x+1,0,x+1,1]])edges.add(e.join(','));}assert.equal(result('matches',{n,joined}).metrics.total,edges.size);}
 for(let a=-5;a<=5;a++)for(let c=-5;c<=5;c++){const r=result('magic',{a,b:-2,c,x:4});near(r.metrics.value,a*2-c*4);assert.equal(r.metrics.invariant,a===c);near(result('magic',{a,b:-2,c,x:5}).metrics.value-r.metrics.value,a-c);}
});
test('equivalent equations include zero coefficient, multiply-zero and forbidden divide-zero',()=>{
 for(const a of [-2,0,3])for(const b of [0,3])for(const c of [0,3,11])for(const operation of ['add','subtract','multiply','divide'])for(const operand of [-2,0,2]){
  const r=result('balance',{a,b,c,operation,operand}),m=r.metrics;
  assert.equal(m.valid,!(operation==='divide'&&operand===0));
  if(!m.valid){assert.equal(m.transformed,null);continue;}
  const originallyAll=a===0&&b===c;
  assert.equal(m.equivalent,operation==='multiply'&&operand===0?originallyAll:true);
  if(m.original.kind==='one')near(a*m.original.value+b,c);
  if(m.transformed.kind==='one')near(m.a*m.transformed.value+m.b,m.c);
 }
});
test('angle invariants, conditional parallel properties and exact decimal root brackets',()=>{
 for(let angle=10;angle<=170;angle+=5){const a=result('angles',{angle,l1:1,l2:1,rotation:0}),b=result('angles',{angle,l1:5,l2:3,rotation:270});assert.deepEqual(plain(a.metrics),plain(b.metrics));assert.equal(a.metrics.complement===null,angle>=90);}
 for(let alpha=20;alpha<=160;alpha+=10)for(let beta=20;beta<=160;beta+=10){const m=result('parallels',{alpha,beta,locked:0}).metrics;assert.equal(m.parallel,alpha===beta);assert.equal(m.interior.reduce((a,b)=>a+b,0)===180,alpha===beta);assert.equal(m.vertical[0],m.vertical[1]);assert.equal(result('parallels',{alpha,beta,locked:1}).params.beta,alpha);}
 for(let target=0;target<=25;target++)for(let digits=0;digits<=4;digits++){
  const m=result('roots',{target,digits}).metrics,scale=10**digits,l=BigInt(Math.round(m.lower*scale)),h=BigInt(Math.round(m.upper*scale)),t=BigInt(target)*BigInt(scale)**2n;
  assert(l*l<=t&&h*h>=t);if(m.exact)assert.equal(l*l,t);else {assert(l*l<t&&h*h>t);assert.equal(h-l,1n);}
 }
 const r=result('roots',{side:1.4142});assert(r.rows[0][1].includes('1.99996164'));assert.equal(r.metrics.comparison,-1);
});
test('grid routes measure length, not displacement; tickets require integer feasibility',()=>{
 const a=result('routes',{path:'RRRRRUUU'}).metrics,b=result('routes',{path:'LRRRRRRUUU'}).metrics;
 assert(a.reached&&b.reached);assert.equal(a.minimum,8);assert.equal(a.length,8);assert.equal(b.length,10);
 assert.equal(result('routes',{path:'UDLR'}).metrics.length,4);assert.equal(result('routes',{path:'UDLR'}).metrics.dx,0);
 for(let priceA=1;priceA<=5;priceA++)for(let priceB=1;priceB<=5;priceB++)for(let revenue=0;revenue<=60;revenue++){
  const m=result('tickets',{priceA,priceB,total:10,revenue}).metrics;
  const expected=[];for(let x=0;x<=10;x++)for(let y=0;y<=10;y++)if(x+y===10&&priceA*x+priceB*y===revenue)expected.push([x,y]);
  assert.deepEqual(plain(m.pairs),expected);
 }
 assert.equal(result('tickets',{priceA:3,priceB:3,total:10,revenue:30}).metrics.pairs.length,11);
 assert.equal(result('tickets',{revenue:31}).metrics.pairs.length,0);
});
test('tariff endpoints and feasibility use exact money comparisons',()=>{
 for(const fixed of [0,24,60])for(const rate of [.5,1.2,2,2.5,3])for(const budget of [0,25,70,180])for(let n=0;n<=100;n++){
  const m=result('tariffs',{fixed,rate,budget,n,minimum:20}).metrics;
  assert.equal(m.feasibleA,n>=20&&20*n<=budget*10);
  assert.equal(m.feasibleB,n>=20&&fixed*10+Math.round(rate*10)*n<=budget*10);
 }
 const m=result('tariffs',{n:40}).metrics;assert(m.costB<m.costA);assert(!m.feasibleA&&!m.feasibleB);
});
test('synthetic sampling is reproducible, without replacement and correctly labelled',()=>{
 assert.equal(C.population.length,200);assert.equal(C.population.filter(x=>x.a).length,100);assert.equal(C.population.filter(x=>x.club&&x.a).length,36);
 for(const method of ['random','club'])for(let size=5;size<=40;size+=5)for(let seed=1;seed<=35;seed++){
  const a=C.sample(size,method,seed),b=C.sample(size,method,seed);assert.deepEqual(plain(a),plain(b));assert.equal(new Set(a.map(x=>x.id)).size,size);if(method==='club')assert(a.every(x=>x.club));
  const r=result('sampling',{method,size,seed});near(r.metrics.percent,100*a.filter(x=>x.a).length/size);assert(r.summary.includes('合成'));assert.equal(r.metrics.repeats.length,30);
 }
 assert.equal(result('sampling',{method:'club',size:40}).metrics.percent,90);
 assert.deepEqual(plain(result('sampling',{baseline:0}).metrics),plain(result('sampling',{baseline:40}).metrics));
});
function input(s,dataset,value){const node={dataset,value,matches(){return false;},setAttribute(){},removeAttribute(){}};for(const cb of s.listeners.input)cb({target:node});}
function click(s,id,dataset){const panel={dataset:{g7Inquiry:id,inquiry:id},querySelector(){return null;}};const node={dataset,closest(sel){return sel==='[data-inquiry]'||sel==='[data-g7-inquiry]'?panel:null;}};for(const cb of s.listeners.click)cb({target:{closest(sel){return sel==='button'?node:null;}}});}
test('old evidence remains verbatim, new parameters/steps/drafts/checks persist across reload',()=>{
 const old={number:{prediction:'舊預測 <script>bad</script>',evidence:[{settings:'a=-3',result:'相反數=3；|a|=3'}]}};
 const storage=new Map([['math-studio-inquiry-v2',JSON.stringify(old)]]),s=loadSite(storage);
 s.evaluate("state.view='labs';state.lab='number';render();updateLab('number')");
 assert(s.app.innerHTML.includes('legacy-v2'));assert(!s.app.innerHTML.includes('<script>bad'));
 assert(s.evaluate("Inquiry.exportText('number')").includes('相反數=3；|a|=3'));
 input(s,{g7Id:'number',g7Field:'prediction'},'兩種目標可能不同');
 input(s,{g7Id:'number',g7Param:'a'},'1');
 input(s,{g7Draft:''},'6');
 for(const cb of s.listeners.change)cb({target:{dataset:{g7Stage:''},value:'4',closest(){return null;}}});
 click(s,'number',{g7Action:'capture'});click(s,'number',{g7Action:'check'});
 assert.equal(s.elements['g7-check-message'].textContent,'這項數值正確。再用自己的話解釋原因。');
 const stored=JSON.parse(storage.get('math-studio-inquiry-g7-v1')).number;
 assert.equal(stored.evidence.length,2);assert.equal(stored.evidence[0].version,'legacy-v2');assert.equal(stored.evidence[1].params.a,1);assert.equal(stored.stage,4);
 const next=loadSite(storage);next.evaluate("state.view='labs';state.lab='number';render();updateLab('number')");
 assert.equal(next.evaluate('state.params.number.a'),1);assert(next.app.innerHTML.includes('兩種目標可能不同'));assert(next.app.innerHTML.includes('value="6"'));
 assert.equal(storage.get('math-studio-inquiry-v2'),JSON.stringify(old));
 assert(next.evaluate("Inquiry.exportText('number')").includes('學生答案：6'));
});
test('prediction gate, comparison limits, draft retention, invalid controls and denied storage',()=>{
 const s=loadSite();s.evaluate("state.view='labs';state.lab='powers';render();updateLab('powers')");
 click(s,'powers',{g7Action:'capture'});assert(s.elements['g7-message'].textContent.includes('先留下'));
 input(s,{g7Id:'powers',g7Field:'prediction'},'平方不同，立方可能相同');input(s,{g7Draft:''},'4');
 click(s,'powers',{g7Action:'capture'});click(s,'powers',{g7Action:'capture'});assert(s.elements['g7-message'].textContent.includes('已記錄'));
 click(s,'powers',{g7Case:'1'});click(s,'powers',{g7Action:'capture'});click(s,'powers',{g7Case:'2'});click(s,'powers',{g7Action:'capture'});
 for(const i of ['0','1','2'])click(s,'powers',{g7Compare:i});assert(s.elements['g7-message'].textContent.includes('同時比較兩筆'));
 const record=JSON.parse(s.storage.get('math-studio-inquiry-g7-v1')).powers;assert.equal(record.evidence.length,3);assert.equal(record.selected.length,2);assert.equal(record.draft,'4');
 input(s,{g7Id:'powers',g7Param:'n'},'0');assert.equal(s.evaluate('state.params.powers.n'),4);assert(s.elements['g7-control-message'].textContent.includes('有效數值'));
 const broken=loadSite(new Map(),true);broken.evaluate("state.view='labs';state.lab='matches';render();updateLab('matches')");input(broken,{g7Id:'matches',g7Field:'prediction'},'每次多三支');click(broken,'matches',{g7Action:'capture'});
 assert(broken.elements['g7-save-status'].textContent.includes('保存失敗'));assert(broken.evaluate("Inquiry.exportText('matches')").includes('每次多三支'));
});
