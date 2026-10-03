import assert from 'node:assert/strict';
import katex from 'katex';
import { examPapers } from '../src/data/senior-math/papers.mjs';
import { officialPaperInventory } from '../src/data/senior-math/paper-inventory.mjs';
const full=process.argv.includes('--full');
assert.equal(examPapers.length,12,'All six years and both codes must be indexed.');
assert.equal(new Set(examPapers.map(p=>p.id)).size,12,'Paper ids must be unique.');
if(full){assert(examPapers.every(p=>p.status==='complete'),'--full requires all twelve papers to be complete.');assert.equal(Object.keys(officialPaperInventory).length,12,'--full requires twelve independently transcribed inventories.');}
const ids=new Set(); let mathematicalExpressions=0;
for(const p of examPapers) {
  if(p.status!=='complete')continue;
  const raw=officialPaperInventory[p.id];assert(raw,`${p.id}: independent inventory missing`);
  assert.equal(p.questions.length,p.inventory.totalLeafItems,p.id);
  assert.deepEqual(p.questions.map(q=>q.source.question),p.inventory.parts,p.id);
  assert.deepEqual(p.inventory.parts,raw.parts,`${p.id}: official item/subpart inventory`);
  assert.equal(p.inventory.choice,raw.choice,p.id);assert.equal(p.inventory.writtenTopLevel,5,p.id);
  assert.deepEqual(p.questions.filter(q=>q.kind==='choice').map(q=>q.choices.length),raw.optionCounts,`${p.id}: official option counts`);
  if(raw.answerKey)assert.equal(p.questions.filter(q=>q.kind==='choice').map(q=>q.answer).join(''),raw.answerKey,`${p.id}: official MC key`);
  for(const q of p.questions) {
    assert(!ids.has(q.id),q.id);ids.add(q.id);
    assert(q.prompt.en&&q.prompt.zh&&q.result.en&&q.result.zh&&q.explanation.en&&q.explanation.zh,q.id);
    assert(q.hints.length===2&&q.hints.every(h=>h.en&&h.zh),q.id);
    assert(q.steps.length>=2&&q.steps.every(s=>s.body.en&&s.body.zh),q.id);
    assert(q.source.pdfPage>0&&q.source.answerPdfPage>0&&q.source.pdfPage<=raw.pdfPages&&q.source.answerPdfPage<=raw.pdfPages,q.id);
    assert.equal(q.source.paperId,p.id,q.id);assert.equal(q.verification.state,'verified',q.id);
    assert(q.skills.length>0&&q.skills.every(s=>typeof s==='string'&&s.length>0),q.id);
    if(q.kind==='choice')assert(q.choices.some(c=>c.id===q.answer),q.id);
    const maths=[q.expression,...q.steps.map(s=>s.math),...(q.choices||[]).map(c=>c.expression)].filter(Boolean);
    for(const expression of maths){katex.renderToString(expression,{throwOnError:true,strict:'error'});mathematicalExpressions++;}
    for(const svg of [q.promptSvg,q.solutionSvg].filter(Boolean)) {
      assert(svg.includes('<title>')&&svg.includes('viewBox='),q.id);
      assert(!/<script|<foreignObject|\son\w+\s*=|(?:href|src)\s*=/i.test(svg),q.id);
    }
  }
}
const main2026=examPapers.find(p=>p.id==='jm01-2026');
assert.equal(main2026.questions.filter(q=>q.kind==='choice').map(q=>q.answer).join(''),'ABCEDCBDEADADBC');
const near=(a,b,msg)=>assert(Math.abs(a-b)<1e-9,msg);
// Independent finite enumeration of the six Bernoulli trials.
let event=0;const distribution=[0,0,0,0],probs=[3/4,2/3,1/2,3/4,3/4,3/4];
for(let mask=0;mask<64;mask++){let pa=1,A=0,B=0;for(let j=0;j<6;j++){const hit=(mask>>j)&1;pa*=hit?probs[j]:1-probs[j];if(j<3)A+=hit;else B+=hit;}distribution[A]+=pa;if(A+B===3&&B>A)event+=pa;}
[1/24,1/4,11/24,1/4].forEach((v,i)=>near(distribution[i],v,'score distribution'));near(event,63/512,'joint event');
for(let n=1;n<=50;n++){let sum=0;for(let k=1;k<=n;k++)sum+=1/(4*k*(k+2));near(sum,3/16-(1/(n+1)+1/(n+2))/8,'telescoping');assert(sum>=1/12&&sum<3/16);}
let x=1.5;for(let n=1;n<=30;n++){near(x,3/(n+1),'recurrence');near(3*x/(x+3),3/(n+2),'printed f(x_n) wording');x=3*x/(x+3);}
const det3=m=>m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
for(const a of [-2,0,1,3])for(const b of [-1,0,2])for(const c of [-3,1,4])near(det3([[1,a,a**4],[1,b,b**4],[1,c,c**4]]),(b-a)*(c-a)*(c-b)*(a*a+b*b+c*c+a*b+a*c+b*c),'alternant determinant');
for(const sign of [-1,1]){const t=(1+sign*Math.sqrt(7))/6;const x=1+t,y=1-2*t,z=t;near(x+y+z,2,'system1');near(3*x+y-z,4,'system2');near(x*x+y*y+z*z,3,'sphere');}
for(const t of [-2,-1,0,.5,3])near(2*(1+t)**2+(1-2*t)**2-6*t*t,3,'identity on solution line');
const cubePoints=[[1,0,1],[0,1,1],[1,1,0]],M=[2/3,2/3,2/3];for(const v of cubePoints){near(v.reduce((s,a)=>s+a,0),2,'base plane');near(v.reduce((s,a,i)=>s+(a-M[i])**2,0),2/3,'circumradius');}
near((Math.PI/3)*(2/3)*(2/Math.sqrt(3)),4*Math.sqrt(3)*Math.PI/27,'cone volume');
const f=t=>t**3-t*t-t;near(f(-1/3),5/27,'maximum');near(f(1),-1,'minimum');near(f(1/3),-11/27,'inflection');
const F=t=>t**4/4-t**3/3-t*t;near(F(0)-F(-1)-(F(2)-F(0)),37/12,'two areas');
for(const [x,y] of [[3*Math.sqrt(5)/5,4*Math.sqrt(5)/5],[6*Math.sqrt(5)/5,-2*Math.sqrt(5)/5]]){near(x*x/9+y*y/4,1,'ellipse');near(y,-2*x+2*Math.sqrt(5),'secant');}
near(Math.cos(Math.PI/12),Math.sqrt(2+Math.sqrt(3))/2,'half angle');
await import('./senior-math-paper-math-check.mjs');
console.log(JSON.stringify({mode:full?'full-release':'authoring-diagnostic',completePapers:examPapers.filter(p=>p.status==='complete').length,verifiedItems:ids.size,mathematicalExpressions,papers:examPapers.map(p=>({id:p.id,status:p.status,leafItems:p.questions.length,topLevelItems:p.inventory?p.inventory.choice+p.inventory.writtenTopLevel:0})),status:'passed'}));
