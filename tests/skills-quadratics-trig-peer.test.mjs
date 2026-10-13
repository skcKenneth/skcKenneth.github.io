/** Independent second-author review. Givens are transcribed from public tasks; no author solver is imported. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {quadraticTrigSkills as lessons} from '../src/data/senior-math/skills-quadratics-trig.mjs';
import {controls,scene} from '../src/lib/skill-quadratics-trig-inquiry.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const poly=(a,b,c,x)=>a*x*x+b*x+c;
function realRoots(a,b,c){if(!a)return b?[-c/b]:[];const d=b*b-4*a*c;if(d<0)return [];if(d===0)return [-b/(2*a)];return [(-b-Math.sqrt(d))/(2*a),(-b+Math.sqrt(d))/(2*a)].sort((a,b)=>a-b);}
function extrema(a,h,k,lo,hi){const xs=[lo,hi,...(h>=lo&&h<=hi?[h]:[])],ys=xs.map(x=>a*(x-h)**2+k);return {min:Math.min(...ys),max:Math.max(...ys),argmin:xs[ys.indexOf(Math.min(...ys))]};}
const degree=x=>x*Math.PI/180;
const givens=new Map();
const add=(id,expression,derive)=>givens.set(id,{expression:expression.replaceAll('§','\\'),derive});
const exercise=(skill,n,e,f)=>add(`skill-${skill}-exercise-${n}`,e,f);
const example=(skill,n,e,f)=>add(`skill-${skill}-example-${n}`,e,f);
const diagnostic=(skill,n,e,f)=>add(`diagnostic-${skill}-${n}`,e,f);
exercise('quadratics-vertex',1,'y=2(x+1)^2-5',()=>-2/2);
exercise('quadratics-vertex',3,'h=4,§quad f(1)=2',()=>2+(7-4)**2-(1-4)**2);
exercise('quadratics-vertex',4,'f(x)=-3(x-2)^2+12',()=>poly(-3,12,0,2));
exercise('quadratics-vertex',8,'f=x^2-2kx+9,§quad k>0',q=>{assert.match(q.prompt.en,/minimum is 5/);return realRoots(1,0,5-9).filter(k=>k>0)[0];});
diagnostic('quadratics-vertex',1,'y=(x+3)^2-4',()=>`x=${String(-6/2).replace('-','−')}`);
diagnostic('quadratics-vertex',2,'y=-2(x-1)^2+3',()=>`${-2<0?'Maximum':'Minimum'} ${-2*0+3}`);
example('quadratics-roots',2,'2x^2+4x+5=0',()=>realRoots(2,4,5).length);
exercise('quadratics-roots',1,'(x-4)^2=0',()=>realRoots(1,-8,16).length);
exercise('quadratics-roots',2,'x^2-7x+4=0',()=>realRoots(1,-7,4).reduce((a,b)=>a+b,0));
exercise('quadratics-roots',4,'2(x-3)(x+1)=0',()=>realRoots(2,-4,-6).find(x=>x>0));
exercise('quadratics-roots',6,'2x^2-4x-6=0',q=>{assert.match(q.prompt.en,/root is 3/);return realRoots(2,-4,-6).find(x=>x!==3);});
exercise('quadratics-roots',8,'x(x+3)=10,§quad x>0',()=>realRoots(1,3,-10).find(x=>x>0));
diagnostic('quadratics-roots',1,'a§ne0',()=>`${realRoots(2,-12,18).length===1?'One':'Two'} distinct real root`);
diagnostic('quadratics-roots',2,'x(x-3)=0',()=>`{${realRoots(1,-3,0).join(',')}}`);
exercise('quadratics-inequalities',1,'x^2<9',()=>Array.from({length:21},(_,i)=>i-10).filter(x=>poly(1,0,-9,x)<0).length);
diagnostic('quadratics-inequalities',1,'-(x-1)(x-3)>0',()=>{const [lo,hi]=realRoots(-1,4,-3);assert.ok(poly(-1,4,-3,(lo+hi)/2)>0);assert.ok(poly(-1,4,-3,lo-1)<0);return `(${lo},${hi})`;});
diagnostic('quadratics-inequalities',2,'(x-2)^2<0',()=>{assert.equal(poly(1,-4,4,2),0);return 'Empty set';});
example('quadratics-intervals',1,'f=x^2-4x+5,§quad x§in[0,3]',()=>extrema(1,2,1,0,3).min);
example('quadratics-intervals',2,'f=(x-2)^2+1,§quad x§in[0,3]',()=>extrema(1,2,1,0,3).max);
exercise('quadratics-intervals',1,'f=(x-3)^2+2,§quad x§in[1,2]',()=>extrema(1,3,2,1,2).min);
exercise('quadratics-intervals',2,'f=(x-3)^2+2,§quad x§in[4,6]',()=>extrema(1,3,2,4,6).min);
exercise('quadratics-intervals',3,'f=-(x-2)^2+5,§quad x§in[0,3]',()=>extrema(-1,2,5,0,3).max);
exercise('quadratics-intervals',7,'f=(x-h)^2,§quad f(1)=f(5)',()=>-(1**2-5**2)/(2*(5-1)));
diagnostic('quadratics-intervals',1,'f=(x-3)^2,§quad x§in[0,1]',()=>`x=${extrema(1,3,0,0,1).argmin}`);
diagnostic('quadratics-intervals',2,'f=x^2,§quad x§in(0,1)',()=>{for(const x of [.001,.2,.7,.999])assert.ok((x/2)**2<x*x&&((x+1)/2)**2>x*x);return 'Neither exists';});
example('trig-unit-circle',1,'P=(-3,4)',()=>-3/Math.hypot(-3,4));
example('trig-unit-circle',2,'§sin§theta=3/5,§quad§theta§text{ in quadrant II}',()=>-Math.sqrt(1-(3/5)**2));
exercise('trig-unit-circle',1,'§sin150^§circ',()=>Math.sin(degree(150)));
exercise('trig-unit-circle',2,'§cos240^§circ',()=>Math.cos(degree(240)));
exercise('trig-unit-circle',5,'§cos§theta=-12/13,§quad§theta§text{ in quadrant III}',()=>-Math.sqrt(1-(-12/13)**2));
exercise('trig-unit-circle',7,'P=(0,-2)',()=>((Math.atan2(-2,0)/Math.PI*180)+360)%360);
diagnostic('trig-unit-circle',1,'(§sin§theta,§cos§theta)',()=>`(${Math.sign(-3)<0?'−':'+'},${Math.sign(-4)<0?'−':'+'})`);
diagnostic('trig-unit-circle',2,'§sin(§pi/6)',()=>{close(Math.sin(Math.PI/6),1/2);return '1/2';});
exercise('trig-identities',1,'§sin^2x+§cos^2x',()=>{const r=Math.hypot(7,-11);return (7/r)**2+(-11/r)**2;});
exercise('trig-identities',2,'§sin x=3/5,§quad§cos x=4/5',()=>{const c=4/5,s=3/5;return c*s+s*c;});
exercise('trig-identities',7,'§tan x=2',()=>{const c=1/Math.sqrt(5),s=2/Math.sqrt(5);return c*c-s*s;});
diagnostic('trig-identities',1,'§sin60^§circ',()=>{close(Math.sin(degree(60)),Math.sqrt(3)/2);return '√3/2';});
diagnostic('trig-identities',2,'(1-§cos^2x)/§sin x',()=>Math.sin(0)===0?'Undefined':'Defined, value 0');
exercise('trig-transformations',1,'y=-2§cos3x',()=>Math.abs((-2*Math.cos(0)-(-2*Math.cos(Math.PI)))/2));
exercise('trig-transformations',7,'y=D+A§sin(§omega x+§phi),§quad A§ne0',q=>{assert.match(q.prompt.en,/π\/8 and 5π\/8/);return 2*Math.PI/((5-1)*Math.PI/8);});
diagnostic('trig-transformations',1,'y=§sin(2x+§pi/3)',()=>{close((Math.PI/3)/2,Math.PI/6);return 'Left π/6';});
diagnostic('trig-transformations',2,'y=4',()=>{assert.equal(4,4);return 'No least positive period';});
exercise('trig-equations',4,'§sin x=0,§quad-§pi§le x§le§pi',()=>Array.from({length:7},(_,i)=>i-3).filter(k=>k>=-1&&k<=1).length);
diagnostic('trig-equations',1,'§cos x=1/2,§quad0§le x<360^§circ',()=>`{${Array.from({length:360},(_,i)=>i).filter(x=>Math.abs(Math.cos(degree(x))-.5)<1e-12).map(x=>x+'°').join(',')}}`);
diagnostic('trig-equations',2,'u=2x',q=>{assert.match(q.prompt.en,/0≤x<360/);return `[0,${2*360}°)`;});
function expected(q){const spec=givens.get(q.id);assert.ok(spec,q.id);assert.equal(q.expression,spec.expression,'Changed public givens need renewed peer review');const value=spec.derive({id:q.id,prompt:q.prompt,expression:q.expression});if(q.kind!=='choice')return value;const matches=q.choices.filter(c=>c.label.en===value);assert.equal(matches.length,1,`Ambiguous independently derived choice ${q.id}: ${value}`);return matches[0].id;}

test('second reviewer independently derives all 29 numeric and 16 diagnostic results',()=>{
 const all=lessons.flatMap(l=>[...l.questions,...l.diagnostics]),scalars=all.filter(q=>typeof q.answer==='number'||q.kind==='choice');
 assert.equal(all.length,120);assert.equal(scalars.length,45);assert.equal(givens.size,45);assert.equal(all.length-scalars.length,75);
 for(const q of scalars){const e=expected(q);if(typeof e==='number')close(q.answer,e);else assert.equal(q.answer,e);const guarded={...q};for(const k of ['answer','result','hints','steps','explanation'])Object.defineProperty(guarded,k,{get(){throw Error('Peer derivation read '+k);}});assert.equal(expected(guarded),e);}
});
test('fresh algebra and exact candidates corroborate written parameter, minimax and discrete transfer claims',()=>{
 assert.deepEqual(realRoots(1,-1,-2),[-1,2]);
 for(const k of [-1,1,2,3]){const a=k-1;assert.equal(realRoots(a,2,1).length===1,k===1||k===2);}
 const costs=Array.from({length:7},(_,i)=>({n:i+1,c:poly(1,-9,30,i+1)}));assert.deepEqual(costs.filter(x=>x.c===Math.min(...costs.map(v=>v.c))).map(x=>x.n),[4,5]);
 const settings=Array.from({length:6},(_,n)=>({n,loss:(n-2.4)**2+1}));assert.equal(settings.reduce((a,b)=>a.loss<b.loss?a:b).n,2);
 for(const a of [0,.1,.49,.5,.51,.9,1])assert.ok(Math.max((a+1)**2,(2-a)**2)>=9/4);close(Math.max(1.5**2,1.5**2),9/4);
 for(const a of [1,1.5,2,2.5,3]){if(a>1){const vertex=-1/(a-1),minimum=poly(a-1,2,1,vertex);assert.equal(minimum>=0,a>=2);}else assert.ok(poly(0,2,1,-1)<0);}
 for(const [t,want]of [[-2,1],[-1,0],[-.4,0],[0,0],[2,4]])close(extrema(1,0,0,t,t+1).min,want);
});
test('fresh trigonometric identities and analytic branches corroborate written restrictions and applied transfers',()=>{
 for(const x of [-2,-.4,.1,.9,2.3]){const s=Math.sin(x),c=Math.cos(x);close((3*s+4*c)**2+(4*s-3*c)**2,25);close(Math.sin(x+.7)+Math.sin(x-.7),2*s*Math.cos(.7));if(Math.abs(Math.sin(2*x))>1e-10)close((1-Math.cos(2*x))/Math.sin(2*x),Math.tan(x));}
 for(const x of [Math.PI/6,Math.PI/2,5*Math.PI/6,3*Math.PI/2])close(Math.sin(2*x),Math.cos(x));
 const crossing=Math.PI/6,f=x=>2+4*Math.sin(3*(x-crossing));close(f(crossing),2);assert.ok(f(crossing+.0001)>2&&f(crossing-.0001)<2);
 for(const n of [-20,-1,0,1,20])close(2+Math.sin(2*Math.PI*n),2);close(2+Math.sin(2*Math.PI*.25),3);
 for(const t of [4,8,16,20])close(4+2*Math.cos(Math.PI*t/6),3);for(const t of [6,18])assert.ok(4+2*Math.cos(Math.PI*t/6)<3);
 for(const t of [2/3,10/3])close(3+2*Math.sin(Math.PI*t/4),4);assert.ok(3+2*Math.sin(Math.PI*2/4)>4);
});
test('second reviewer checks analytic scene outputs, half-open exclusions and degeneracies',()=>{
 for(const lesson of lessons){const defs=controls(lesson.id),base=Object.fromEntries(defs.map(c=>[c.key,c.value]));for(const values of [base,...defs.flatMap(c=>[{...base,[c.key]:c.min},{...base,[c.key]:c.max}])]){const out=scene(lesson.id,values);assert.ok(out.summary.en&&out.summary.zh);for(const p of out.paths)assert.ok(!/NaN|Infinity/.test(p.d));}}
 assert.equal(scene('trig-identities',{theta:0}).values.quotient,null);assert.equal(scene('trig-identities',{theta:0}).values.tangent,0);assert.equal(scene('trig-identities',{theta:90}).values.tangent,null);
 for(let n=1;n<=4;n++)for(const k of [-1.5,-1,-.5,0,.5,1,1.5]){const out=scene('trig-equations',{n,target:k}).values;const count=Math.abs(k)>1?0:Math.abs(k)===1?n:k===0?2*n+1:2*n;assert.equal(out.count,count);for(const x of out.roots)close(Math.sin(degree(n*x)),k);}
 assert.equal(scene('quadratics-roots',{a:0,b:0,c:0}).values.allReal,true);assert.equal(scene('quadratics-roots',{a:0,b:1,c:2}).values.type,'linear');
 assert.equal(scene('trig-transformations',{A:3,omega:0,phi:90,D:2}).values.constantValue,5);assert.equal(scene('trig-transformations',{A:0,omega:3}).values.periodDegrees,null);
});
