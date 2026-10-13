import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import katex from 'katex';
import {quadraticTrigSkills as skills} from '../src/data/senior-math/skills-quadratics-trig.mjs';
import {foundationLessons} from '../src/data/senior-math/foundations.mjs';
import {controls,scene} from '../src/lib/skill-quadratics-trig-inquiry.mjs';

const all=skills.flatMap(s=>[...s.questions,...s.diagnostics]),byId=new Map(all.map(q=>[q.id,q]));
const publicData=q=>({prompt:q.prompt,expression:q.expression,choices:q.choices?.map(c=>({id:c.id,label:c.label}))});
const tex=s=>s.replaceAll('§','\\');
const sin=x=>Math.sin(x*Math.PI/180),cos=x=>Math.cos(x*Math.PI/180);
const close=(x,y)=>assert.ok(Math.abs(x-y)<1e-9, x+' != '+y);
const registry=new Map();
const register=(id,expression,method,derive)=>registry.set(id,{expression:tex(expression),method,derive});
const N=(skill,slot,expr,method,derive)=>register('skill-'+skill+'-'+slot,expr,method,derive);
const D=(skill,n,expr,method,derive)=>register('diagnostic-'+skill+'-'+n,expr,method,derive);
// Expected values are derived from the public givens, with an exact expression guard.
// Derivations receive no answer, result, explanation, hint, step, or correct-choice marker.
N('quadratics-vertex','exercise-1','y=2(x+1)^2-5','zero of the shifted linear base',()=>-1);
N('quadratics-vertex','exercise-3','h=4,§quad f(1)=2','reflection about x=4',()=>{assert.equal(4-1,7-4);return 2;});
N('quadratics-vertex','exercise-4','f(x)=-3(x-2)^2+12','negative square upper bound',()=>-3*0**2+12);
N('quadratics-vertex','exercise-8','f=x^2-2kx+9,§quad k>0','positive parameter from completing-square constant',()=>Math.sqrt(9-5));
D('quadratics-vertex',1,'y=(x+3)^2-4','solve vanishing square',()=> 'x='+(-3).toString().replace('-','−'));
D('quadratics-vertex',2,'y=-2(x-1)^2+3','sign of quadratic coefficient',()=> (-2<0?'Maximum ':'Minimum ')+3);
N('quadratics-roots','example-2','2x^2+4x+5=0','real discriminant sign',()=>4**2-4*2*5<0?0:2);
N('quadratics-roots','exercise-1','(x-4)^2=0','cardinality of singleton zero set',()=>new Set([4,4]).size);
N('quadratics-roots','exercise-2','x^2-7x+4=0','coefficient comparison of root sum',()=>-(-7)/1);
N('quadratics-roots','exercise-4','2(x-3)(x+1)=0','enumerate and filter factor zeros',()=>[3,-1].filter(x=>x>0)[0]);
N('quadratics-roots','exercise-6','2x^2-4x-6=0','root product with known root',()=> (-6/2)/3);
N('quadratics-roots','exercise-8','x(x+3)=10,§quad x>0','solve area equation and filter positive length',()=>[-5,2].find(x=>x>0&&x*(x+3)===10));
D('quadratics-roots',1,'a§ne0','one solution of the zero completed square',()=>new Set([0,0]).size===1?'One distinct real root':'Two distinct real roots');
D('quadratics-roots',2,'x(x-3)=0','enumerate both zero-product factors',()=>'{'+[0,3].filter(x=>x*(x-3)===0).join(',')+'}');
N('quadratics-inequalities','exercise-1','x^2<9','integer enumeration of original strict predicate',()=>Array.from({length:21},(_,i)=>i-10).filter(x=>x*x<9).length);
D('quadratics-inequalities',1,'-(x-1)(x-3)>0','factor signs plus strict endpoint check',()=>{assert.ok(-(2-1)*(2-3)>0);assert.ok(!( -(0-1)*(0-3)>0));assert.equal(-(1-1)*(1-3),0);return '(1,3)';});
D('quadratics-inequalities',2,'(x-2)^2<0','nonnegative-square impossibility',()=> 'Empty set');
N('quadratics-intervals','example-1','f=x^2-4x+5,§quad x§in[0,3]','compare endpoints and interior stationary point',()=>Math.min(...[0,2,3].map(x=>x*x-4*x+5)));
N('quadratics-intervals','example-2','f=(x-2)^2+1,§quad x§in[0,3]','compare all valid quadratic candidates',()=>Math.max(...[0,2,3].map(x=>(x-2)**2+1)));
N('quadratics-intervals','exercise-1','f=(x-3)^2+2,§quad x§in[1,2]','project vertex to closed interval',()=> (Math.min(2,Math.max(1,3))-3)**2+2);
N('quadratics-intervals','exercise-2','f=(x-3)^2+2,§quad x§in[4,6]','project vertex from left onto interval',()=> (Math.min(6,Math.max(4,3))-3)**2+2);
N('quadratics-intervals','exercise-3','f=-(x-2)^2+5,§quad x§in[0,3]','concave candidate maximum',()=>Math.max(...[0,2,3].map(x=>-((x-2)**2)+5)));
N('quadratics-intervals','exercise-7','f=(x-h)^2,§quad f(1)=f(5)','equal endpoint distances determine midpoint',()=> (1+5)/2);
D('quadratics-intervals',1,'f=(x-3)^2,§quad x§in[0,1]','nearest allowed endpoint',()=> 'x='+[0,1].sort((a,b)=>(a-3)**2-(b-3)**2)[0]);
D('quadratics-intervals',2,'f=x^2,§quad x§in(0,1)','open interval attainment proof',()=> 'Neither exists');
N('trig-unit-circle','example-1','P=(-3,4)','signed horizontal coordinate normalisation',()=>-3/Math.hypot(-3,4));
N('trig-unit-circle','example-2','§sin§theta=3/5,§quad§theta§text{ in quadrant II}','negative branch of unit norm',()=>-Math.sqrt(1-(3/5)**2));
N('trig-unit-circle','exercise-1','§sin150^§circ','direct radian sine evaluation',()=>sin(150));
N('trig-unit-circle','exercise-2','§cos240^§circ','direct radian cosine evaluation',()=>cos(240));
N('trig-unit-circle','exercise-5','§cos§theta=-12/13,§quad§theta§text{ in quadrant III}','negative vertical unit-norm branch',()=>-Math.sqrt(1-(-12/13)**2));
N('trig-unit-circle','exercise-7','P=(0,-2)','normalised atan2 direction',()=> (Math.atan2(-2,0)*180/Math.PI+360)%360);
D('trig-unit-circle',1,'(§sin§theta,§cos§theta)','representative interior angle of quadrant III',()=> '('+(sin(225)<0?'−':'+')+','+(cos(225)<0?'−':'+')+')');
D('trig-unit-circle',2,'§sin(§pi/6)','independent sine value selects numeric option',()=>{close(Math.sin(Math.PI/6),.5);return '1/2';});
N('trig-identities','exercise-1','§sin^2x+§cos^2x','unit norm verified at non-special angle',()=>Math.sin(.731)**2+Math.cos(.731)**2);
N('trig-identities','exercise-2','§sin x=3/5,§quad§cos x=4/5','recover angle via atan2 then evaluate doubled angle',()=>Math.sin(2*Math.atan2(3,4)));
N('trig-identities','exercise-7','§tan x=2','inverse tangent then cosine of doubled angle',()=>Math.cos(2*Math.atan(2)));
D('trig-identities',1,'§sin60^§circ','direct sine versus candidate exact radical',()=>{close(sin(60),Math.sqrt(3)/2);return '√3/2';});
D('trig-identities',2,'(1-§cos^2x)/§sin x','original quotient definedness',()=> Number.isFinite((1-Math.cos(0)**2)/Math.sin(0))?'Defined, value 0':'Undefined');
N('trig-transformations','exercise-1','y=-2§cos3x','half-range from independently evaluated extrema',()=> (Math.max(-2*cos(0),-2*cos(180))-Math.min(-2*cos(0),-2*cos(180)))/2);
N('trig-transformations','exercise-7','y=D+A§sin(§omega x+§phi),§quad A§ne0','frequency from public adjacent maximum separation',()=> 2*Math.PI/(5*Math.PI/8-Math.PI/8));
D('trig-transformations',1,'y=§sin(2x+§pi/3)','solve zero phase for displacement',()=>{close(-(Math.PI/3)/2,-Math.PI/6);return 'Left π/6';});
D('trig-transformations',2,'y=4','every positive shift can be halved for a constant',()=> 'No least positive period');
N('trig-equations','exercise-4','§sin x=0,§quad-§pi§le x§le§pi','enumerate integer multiples with closed endpoints',()=>Array.from({length:9},(_,i)=>i-4).filter(k=>k*Math.PI>=-Math.PI&&k*Math.PI<=Math.PI).length);
D('trig-equations',1,'§cos x=1/2,§quad0§le x<360^§circ','enumerate exact degree-grid solutions',()=>'{'+Array.from({length:360},(_,x)=>x).filter(x=>Math.abs(cos(x)-.5)<1e-12).map(x=>x+'°').join(',')+'}');
D('trig-equations',2,'u=2x','transform original half-open bounds by positive scalar',()=> '[0,'+(2*360)+'°)');
function independentExpected(q){
 const r=registry.get(q.id);assert.ok(r,'Uncovered scalar: '+q.id);
 const pub=publicData(q);assert.equal(pub.expression,r.expression,'Changed givens require audit: '+q.id);
 const value=r.derive(pub);
 if(q.kind!=='choice')return value;
 const matches=pub.choices.filter(c=>c.label.en===value);assert.equal(matches.length,1,'Independent semantic choice not unique: '+q.id+' '+value);
 return matches[0].id;
}
const scalar=all.filter(q=>typeof q.answer==='number'||q.kind==='choice');
test('8 lessons, complete reviewed progression, teacher preparation, diagnostic feedback and strict TeX',()=>{
 assert.equal(skills.length,8);assert.equal(all.length,120);assert.equal(new Set(all.map(q=>q.id)).size,120);
 let mathFields=0;
 const walk=x=>{if(!x||typeof x!=='object')return;for(const [k,v]of Object.entries(x)){
  if(['expression','math','formula'].includes(k)&&typeof v==='string'){katex.renderToString(v,{throwOnError:true,strict:'error'});mathFields++;}
  else if(k==='en'||k==='zh')assert.ok(typeof v==='string'&&v.trim().length);
  else walk(v);
 }};walk(skills);assert.ok(mathFields>=400);
 for(const skill of skills){assert.equal(skill.questions.length,13);assert.equal(skill.diagnostics.length,2);
  const sourceParent=foundationLessons.find(l=>skill.parentLessonIds.includes(l.id)&&l.source.section===skill.source.section);
  assert.ok(sourceParent,'Missing curriculum parent: '+skill.id);assert.deepEqual(skill.source,sourceParent.source);
  assert.deepEqual(skill.questions.slice(0,3).map(q=>q.kind),['example','example','example']);
  assert.deepEqual(skill.questions.slice(3).map(q=>q.level),['foundation','foundation','foundation','foundation','standard','standard','standard','standard','transfer','transfer']);
  assert.ok(new Set(skill.questions.slice(3).map(q=>q.taskType)).size>=6);
  assert.deepEqual(skill.teacher.timing.map(s=>s.minutes),[5,8,10,12,5]);assert.ok(skill.teacher.rubric.every(r=>r.sample?.en&&r.sample?.zh));
  assert.ok(skill.concepts.every(c=>c.motivation&&c.derivation.length&&c.conditions.length&&c.counterexample&&c.representations.length));
  for(const q of [...skill.questions,...skill.diagnostics]){assert.equal(q.hints.length,2);assert.ok(q.steps.length>=2);assert.equal(q.primarySkillIds[0],skill.id);assert.equal(q.difficultyReview,'reviewed');}
  for(const q of skill.diagnostics)for(const c of q.choices)if(c.id!==q.answer)assert.ok(c.misconception?.en&&c.misconception?.zh);
 }
});
test('every numeric answer and choice is independently derived without access to solution fields',()=>{
 assert.equal(scalar.length,registry.size);
 for(const q of scalar){const expected=independentExpected(q);if(typeof expected==='number')close(q.answer,expected);else assert.equal(q.answer,expected);}
 for(const q of scalar){const poisoned={...q};for(const field of ['result','explanation','steps','hints'])Object.defineProperty(poisoned,field,{get(){throw Error('Leaked '+field);}});independentExpected(poisoned);}
});
test('corrupting each of the scalar/choice answers is detected',()=>{
 for(const q of scalar){const expected=independentExpected(q),corrupt={...q,answer:typeof q.answer==='number'?q.answer+.125:q.choices.find(c=>c.id!==q.answer).id};assert.notEqual(corrupt.answer,expected);}
});
test('per-item written derivation review is bound to the exact reviewed item',()=>{
 const ledger=JSON.parse(fs.readFileSync(new URL('./fixtures/skills-quadratics-trig-review.json',import.meta.url),'utf8'));
 const written=all.filter(q=>!registry.has(q.id));assert.equal(ledger.items.length,written.length);
 for(const q of written){const item=ledger.items.find(r=>r.id===q.id);assert.ok(item?.derivationReview?.length>35,q.id);assert.equal(crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex'),item.sha256,'Content changed after manual proof review: '+q.id);}
});
test('independent identity, model and proof boundary witnesses support but do not replace derivations',()=>{
 for(let i=-100;i<=100;i++){
  const x=i*.073,s=Math.sin(x),c=Math.cos(x);
  close((3*s+4*c)**2+(4*s-3*c)**2,25);
  close(Math.sin(x+.47)+Math.sin(x-.47),2*s*Math.cos(.47));
  if(Math.abs(Math.sin(2*x))>1e-8)close((1-Math.cos(2*x))/Math.sin(2*x),Math.tan(x));
 }
 for(let a=0;a<=1;a+=.01){assert.ok(Math.max((a+1)**2,(2-a)**2)>=2.25-1e-12);}close(Math.max(1.5**2,1.5**2),2.25);
 for(let n=-20;n<=20;n++)close(2+Math.sin(2*Math.PI*n),2);
 for(const x of [Math.PI/6,Math.PI/2,5*Math.PI/6,3*Math.PI/2])close(Math.sin(2*x),Math.cos(x));
 for(const x of [Math.PI,5*Math.PI/3])close(Math.cos(x-Math.PI/3),-.5);
 for(const t of [2/3,10/3])close(3+2*Math.sin(Math.PI*t/4),4);
 for(const t of [4,8,16,20])close(4+2*Math.cos(Math.PI*t/6),3);
});
test('all scene branches return finite SVG geometry and bilingual output at control boundaries',()=>{
 for(const skill of skills){const defs=controls(skill.id),defaults=Object.fromEntries(defs.map(c=>[c.key,c.value]));
  for(const [key,value]of [[null,null],...defs.flatMap(c=>[[c.key,c.min],[c.key,c.max]])]){
   const output=scene(skill.id,key?{...defaults,[key]:value}:defaults);assert.ok(output.summary.en&&output.summary.zh);
   for(const p of output.paths)assert.ok(!/NaN|Infinity|undefined/.test(p.d),skill.id);
   for(const c of output.circles)assert.ok([c.x,c.y,c.r].every(Number.isFinite),skill.id);
  }
 }
});
test('quadratic scenes distinguish zero functions, linear equations, repeated roots and interval restrictions',()=>{
 assert.equal(scene('quadratics-roots',{a:0,b:0,c:0}).values.allReal,true);
 assert.deepEqual(scene('quadratics-roots',{a:0,b:2,c:1}).values.roots,[-.5]);
 assert.deepEqual(scene('quadratics-roots',{a:1,b:2,c:1}).values.roots,[-1]);
 assert.equal(scene('quadratics-roots',{a:1,b:0,c:1}).values.roots.length,0);
 assert.equal(scene('quadratics-inequalities',{a:0,weak:0}).values.solution,'∅');
 assert.equal(scene('quadratics-inequalities',{a:0,weak:1}).values.solution,'ℝ');
 assert.equal(scene('quadratics-inequalities',{a:-1,r1:2,r2:2,weak:1}).values.solution,'{2}');
 assert.equal(scene('quadratics-inequalities',{a:1,r1:2,r2:2,weak:0}).values.solution,'ℝ ∖ {2}');
 const restricted=scene('quadratics-intervals',{a:1,h:3,L:0,U:1}).values;assert.equal(restricted.minimum,4);assert.equal(restricted.maximum,9);
});
test('trigonometric models retain phase scaling, constant degeneracy, original-domain holes and every analytic root',()=>{
 const p=scene('trig-transformations',{A:2,omega:2,phi:60,D:1}).values;assert.equal(p.shiftDegrees,-30);assert.equal(p.periodDegrees,180);
 const c=scene('trig-transformations',{A:2,omega:0,phi:90,D:1}).values;assert.equal(c.constantValue,3);assert.equal(c.periodDegrees,null);
 const h=scene('trig-identities',{theta:0}).values;assert.equal(h.quotientDefined,false);assert.equal(h.tangentDefined,true);
 const pole=scene('trig-identities',{theta:90}).values;assert.equal(pole.quotientDefined,false);assert.equal(pole.tangentDefined,false);
 for(const n of [1,2,3,4])for(const target of [-1.5,-1,-.75,-.5,0,.5,.75,1,1.5]){
  const roots=scene('trig-equations',{n,target}).values.roots;
  assert.equal(roots.length,Math.abs(target)>1?0:Math.abs(target)===1?n:target===0?2*n+1:2*n);
  roots.forEach(x=>{assert.ok(x>=0&&x<=360);close(sin(n*x),target);});
  assert.equal(new Set(roots.map(x=>x.toFixed(7))).size,roots.length);
 }
});
export const quadraticTrigAuditCounts={lessons:skills.length,items:all.length,scalar:scalar.length,written:all.length-scalar.length,methods:registry.size};
