const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {loadSite}=require('./helpers/math-studio-runtime.cjs');
const context=vm.createContext({Math,Number,JSON,Object,Array});
for(const file of ['inquiry-g8-core.js','inquiry-g8-content.js'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../public/math-studio',file),'utf8'),context);
const C=vm.runInContext('G8BisectorCore',context),T=vm.runInContext('G8BisectorContent',context);
const plain=x=>JSON.parse(JSON.stringify(x));
const near=(a,b)=>assert(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const cross=(a,b)=>a.x*b.y-a.y*b.x;
const dot=(a,b)=>a.x*b.x+a.y*b.y;
const difference=(a,b)=>({x:a.x-b.x,y:a.y-b.y});

test('independent determinant and projection checks across the full allowed domain',()=>{
 for(let theta=30;theta<=90;theta+=3)for(const radius of [1,2.3,4,7])for(let bearing=1-theta/2;bearing<=theta/2-1;bearing+=1.7){
  const r=C.calculate({theta,radius,bearing,locked:false});
  near(r.pm,Math.abs(cross(r.A,r.P))/Math.hypot(r.A.x,r.A.y));
  near(r.pn,Math.abs(cross(r.B,r.P))/Math.hypot(r.B.x,r.B.y));
  near(cross(r.M,r.A),0);near(cross(r.N,r.B),0);
  near(dot(difference(r.P,r.M),r.A),0);near(dot(difference(r.P,r.N),r.B),0);
  near(r.pm*r.pm+r.om*r.om,r.params.radius**2);near(r.pn*r.pn+r.on*r.on,r.params.radius**2);
  assert(r.inside&&r.feetOnRays);assert(r.pm>0&&r.pn>0);assert(r.pq>r.pm);
  assert(!/NaN|Infinity/.test(JSON.stringify(r)));
 }
});
test('locked equality, exact 60-degree case, off-bisector ordering and reflection',()=>{
 near(C.calculate({theta:60,radius:4}).pm,2);near(C.calculate({theta:60,radius:4}).pn,2);
 for(let theta=30;theta<=90;theta++)for(const radius of [1,2,4,6,7]){
  const locked=C.calculate({theta,radius,bearing:20,locked:true});near(locked.pm,locked.pn);assert.equal(locked.params.bearing,0);
  for(const bearing of [1,theta/4]){const a=C.calculate({theta,radius,bearing,locked:false}),b=C.calculate({theta,radius,bearing:-bearing,locked:false});assert(a.pm<a.pn);near(a.pm,b.pn);near(a.pn,b.pm);assert.equal(a.onBisector,false);}
 }
});
test('normalization excludes degeneracy and pointer input shares the numeric domain',()=>{
 for(const raw of [null,[],{}, {theta:0,radius:0,bearing:999,locked:false}, {theta:Infinity,radius:NaN,bearing:-999,locked:false}]){
  const p=C.normalize(raw);assert(p.theta>=30&&p.theta<=90);assert(p.radius>=1&&p.radius<=7);assert(Math.abs(p.bearing)<p.theta/2);assert(C.calculate(p).feetOnRays);
 }
 for(const [x,y] of [[0,0],[-10,20],[100,100],[3,-1],[5,0]]){const p=C.fromPoint(x,y,C.defaults());assert.equal(p.locked,false);assert(C.calculate(p).inside);assert(C.calculate(p).feetOnRays);}
 const row=C.snapshot({theta:60,radius:4});assert(row.result.includes('PM≈2'));assert(row.result.includes('不是一般性證明'));assert.equal(row.version,C.version);
});
test('18-minute bilingual task keeps proof inputs and forward/converse distinct',()=>{
 assert.equal(T.stages.length,7);assert.equal(T.stages.reduce((s,x)=>s+x.minutes,0),18);
 assert.deepEqual(Array.from(T.stages,s=>s.minutes),[2,2,3,3,5,0,3]);
 assert.equal(T.stages[5].optional,true);assert.equal(T.teacherFlow.length,5);
 assert(T.teacherFlow[0][1].startsWith('Distance, 2 min'));
 for(const s of T.stages)for(const language of [0,1])assert(s.title[language]&&s.question[language]);
 assert.equal(T.hints.length,3);
 for(const list of [T.forward,T.converse,T.hints])for(const row of list)assert(row[0]&&row[1]);
 assert(T.forward[4][1].includes('AAS'));assert(T.converse[2][1].includes('HL'));
 assert(T.converse[0][1].includes('inside'));assert(T.exitAnswer[1].includes('perpendicular'));
 assert(!T.forward.slice(0,4).some(row=>row[1].includes('PM=PN')));
});

function input(site,field,value){const node={dataset:{g8Field:field},value,matches(){return false;}};for(const cb of site.listeners.input)cb({target:node});}
function click(site,dataset){const b={dataset,closest(){return null;}};for(const cb of site.listeners.click)cb({target:{closest(sel){return sel==='button'?b:null;}}});}
function open(site){site.evaluate("state.grade='g8';state.view='labs';state.lab='bisector-property';render()");}

test('G8 route, language, escaped written work, persistence and old keys',async()=>{
 const old='{"number":{"prediction":"KEEP OLD"}}',storage=new Map([['math-studio-inquiry-v2',old]]),site=loadSite(storage);
 const initially=[...storage.keys()];open(site);assert(site.app.innerHTML.includes('data-g8-inquiry="bisector-property"'));assert(site.app.innerHTML.includes('18 MIN'));
 input(site,'prediction','相等 <script>unsafe</script>');await site.flush();
 click(site,{g8Stage:'2'});click(site,{g8Action:'capture'});await site.flush();
 const record=JSON.parse(storage.get('math-studio-inquiry-g8-v1'))['bisector-property'];assert.equal(record.prediction,'相等 <script>unsafe</script>');assert.equal(record.evidence.length,1);assert.equal(record.stage,2);
 const reloaded=loadSite(storage);open(reloaded);assert.equal(reloaded.evaluate('G8BisectorUI.note().stage'),2);assert(reloaded.evaluate('G8BisectorUI.exportText()').includes('相等 <script>unsafe</script>'));
 click(reloaded,{g8Stage:'0'});assert(reloaded.app.innerHTML.includes('&lt;script&gt;'));assert(!reloaded.app.innerHTML.includes('<script>unsafe'));
 const beforeLanguage=storage.get('math-studio-inquiry-g8-v1');reloaded.evaluate("G8BisectorUI.applyRouteLanguage('en');render()");assert(reloaded.app.innerHTML.includes('Angle-bisector property'));assert.equal(storage.get('math-studio-inquiry-g8-v1'),beforeLanguage);
 reloaded.ctx.window.location={search:'?grade=g8&lab=bisector-property&lang=en',hash:'',pathname:'/math-studio/'};reloaded.evaluate('restoreRoute();render()');assert.equal(reloaded.evaluate('state.lab'),'bisector-property');assert(reloaded.app.innerHTML.includes('lang="en"'));
 reloaded.ctx.window.location.search='';reloaded.ctx.window.location.hash='#g8/bisector-property';reloaded.evaluate('restoreRoute();render()');assert.equal(reloaded.evaluate('state.grade'),'g8');
 assert.equal(storage.get('math-studio-inquiry-v2'),old);assert(!initially.includes('math-studio-inquiry-g8-v1'));
});
test('free movement, case records and distinct student/teacher print content',async()=>{
 const site=loadSite();open(site);input(site,'prediction','我猜 PM=PN');click(site,{g8Stage:'3'});await site.flush();
 assert.equal(site.evaluate('G8BisectorUI.note().params.locked'),false);assert.equal(site.evaluate('G8BisectorUI.note().params.bearing'),10);
 click(site,{g8Action:'capture'});click(site,{g8Case:'6'});click(site,{g8Action:'capture'});await site.flush();
 assert.equal(site.evaluate('G8BisectorUI.note().evidence.length'),2);
 const student=site.evaluate('G8BisectorUI.worksheetHTML(false)'),teacher=site.evaluate('G8BisectorUI.worksheetHTML(true)');
 assert(student.includes('學生學習單'));assert(teacher.includes('教師版'));assert(!student.includes('所以 PM=PN（全等三角形'));assert(teacher.includes('所以 PM=PN（全等三角形'));assert(student.includes('我猜 PM=PN'));
 assert(!site.evaluate('G8BisectorUI.graphic(G8BisectorCore.defaults(),0)').includes('PM ≈'));assert(site.evaluate('G8BisectorUI.graphic(G8BisectorCore.defaults(),2)').includes('PM ≈'));
});
test('unknown future records are preserved and denied storage still exports notes',async()=>{
 const seed={future:{notes:'PRESERVE'},'bisector-property':{prediction:'before',params:null}},storage=new Map([['math-studio-inquiry-g8-v1',JSON.stringify(seed)]]),site=loadSite(storage);open(site);input(site,'prediction','after');await site.flush();assert.deepEqual(JSON.parse(storage.get('math-studio-inquiry-g8-v1')).future,seed.future);
 const denied=loadSite(new Map(),true);open(denied);input(denied,'prediction','UNSAVED WORK');await denied.flush();assert(denied.evaluate('G8BisectorUI.exportText()').includes('UNSAVED WORK'));
});
test('first-use disjoint fields merge across tabs and same-field variants stay exportable',async()=>{
 const storage=new Map(),a=loadSite(storage),b=loadSite(storage);open(a);open(b);
 input(a,'prediction','PREDICTION A');input(b,'claim','CLAIM B');await Promise.all([a.flush(),b.flush()]);
 const saved=JSON.parse(storage.get('math-studio-inquiry-g8-v1'))['bisector-property'];assert.equal(saved.prediction,'PREDICTION A');assert.equal(saved.claim,'CLAIM B');assert(!b.evaluate('G8BisectorUI.exportText()').includes('"remote"'));
 const c=loadSite(storage),d=loadSite(storage);open(c);open(d);input(c,'prediction','FIRST VERSION');input(d,'prediction','SECOND VERSION');await Promise.all([c.flush(),d.flush()]);
 const exports=c.evaluate('G8BisectorUI.exportText()')+d.evaluate('G8BisectorUI.exportText()');assert(exports.includes('FIRST VERSION'));assert(exports.includes('SECOND VERSION'));assert(exports.includes('"remote"'));
});
