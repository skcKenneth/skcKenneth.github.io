import test from 'node:test';
import assert from 'node:assert/strict';
import {activities,evaluate,solveSSA,lineRelation} from '../src/data/g10-inquiries-geometry.mjs';
const close=(actual,expected,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} differs from ${expected}`);
const metrics=(chapter,order,params={})=>evaluate(`g10-${chapter}-${String(order).padStart(2,'0')}`,params).metrics;
test('34 complete bilingual geometry inquiries, every preset in both languages',()=>{
 assert.equal(activities.length,34);
 assert.deepEqual(Object.fromEntries(['07','08','09','10','14'].map(ch=>[ch,activities.filter(a=>a.chapter===ch).length])),{'07':12,'08':6,'09':5,'10':6,'14':5});
 assert.equal(new Set(activities.map(a=>a.id)).size,34);
 for(const a of activities){
  for(const field of ['title','question','prediction','prerequisites','explanation','conditions','misconception','proof','teacherPrompt','challenge'])for(const locale of ['en','zh-Hant'])assert.ok(a[field][locale]?.trim(),`${a.id}.${field}.${locale}`);
  for(const locale of ['en','zh-Hant'])assert.ok(a.exit.prompt[locale]&&a.exit.answer[locale]);
  assert.ok(a.cases.length>=3);assert.ok(a.cases.some(c=>c.boundary));assert.ok(a.controls.length);
  for(const scenario of a.cases)for(const locale of ['en','zh-Hant']){
   const r=evaluate(a.id,scenario.params,locale);
   assert.ok(r.svg.includes('viewBox="0 0 720 340"'));
   assert.ok(r.svg.includes('<title>'));assert.ok(!/NaN|Infinity/.test(r.svg),a.id);
   assert.ok(r.rows.length&&r.columns.length&&r.summary);
   for(const row of r.rows)assert.equal(row.length,r.columns.length,`${a.id} rectangular table`);
  }
 }
});
test('every advertised numeric endpoint and select option is renderable without nonfinite SVG data',()=>{
 for(const a of activities)for(const c of a.controls){
  const values=c.options?c.options.map(o=>o.value):[c.min,c.max];
  for(const value of values){const r=evaluate(a.id,{...a.cases[0].params,[c.key]:value});assert.ok(!/NaN|Infinity/.test(r.svg),`${a.id}.${c.key}=${value}`);assert.ok(r.rows.length);}
 }
});
test('malformed numerical parameters and unlisted choices are rejected explicitly',()=>{
 for(const a of activities){
  const numeric=a.controls.find(c=>!c.options);
  if(numeric)for(const bad of[NaN,Infinity,-Infinity,'bad','',null,undefined]){const r=evaluate(a.id,{[numeric.key]:bad});assert.equal(r.valid,false,`${a.id}.${numeric.key}=${bad}`);assert.ok(!/NaN|Infinity/.test(r.svg));}
  const choice=a.controls.find(c=>c.options);if(choice)assert.equal(evaluate(a.id,{[choice.key]:'not-listed'}).valid,false);
 }
});
test('drawn vectors use equal coordinate units and surface nets share one length scale',()=>{
 const image=evaluate('g10-08-05',{lengthA:3,lengthB:3,angle:45}).svg;
 const arrow=/<line x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)" stroke="#247f69" stroke-width="4"/.exec(image);
 assert.ok(arrow);close(Math.abs(Number(arrow[3])-Number(arrow[1])),Math.abs(Number(arrow[4])-Number(arrow[2])),1e-4);
 const cone=evaluate('g10-10-03',{shape:'cone',r:3,h:4}).svg;
 const baseRadius=Number(/<circle cx="555" cy="185" r="([^"]+)"/.exec(cone)[1]);close(baseRadius,125*3/5);
 const cylinder=evaluate('g10-10-03',{shape:'cylinder',r:3,h:4}).svg;
 const width=Number(/<rect x="90" y="90" width="([^"]+)"/.exec(cylinder)[1]),radius=Number(/<circle cx="570" cy="100" r="([^"]+)"/.exec(cylinder)[1]);close(width,2*Math.PI*radius,1e-4);
});
test('radian ratio, quadrants, reflections and sign lost after squaring',()=>{
 const arc1=metrics('07',1,{angle:60,r:3}),arc2=metrics('07',1,{angle:60,r:6});close(arc1.arcLength,Math.PI);close(arc2.arcLength,2*Math.PI);close(arc1.ratio,arc2.ratio);
 assert.equal(evaluate('g10-07-01',{r:0}).valid,false);
 const a=metrics('07',2,{angle:150});close(a.sine,.5);close(a.cosine,-Math.sqrt(3)/2);
 for(const angle of[-150,-30,0,30,90,150,270,450]){const m=metrics('07',3,{angle});close(m.reflectedSine,m.sine);close(m.reflectedCosine,-m.cosine);close(metrics('07',4,{angle}).squareSum,1);}
 const square=metrics('07',4,{angle:150});assert.ok(square.cosine<0&&square.nonnegativeRoot>0);
 close(metrics('07',5,{angle:360}).theta,2*Math.PI);
});
test('tangent excludes poles, angle formulas reject naive addition, wave degeneracies remain explicit',()=>{
 for(const angle of[-90,90,270]){const m=metrics('07',6,{angle});assert.equal(m.defined,false);assert.equal(m.tangent,null);}
 close(metrics('07',6,{angle:45}).tangent,1);close(metrics('07',6,{angle:225}).tangent,1);
 const sum=metrics('07',7,{alpha:30,beta:30});close(sum.lhs,Math.sqrt(3)/2);close(sum.rhs,Math.sqrt(3)/2);close(sum.naiveSum,1);assert.notEqual(sum.lhs,sum.naiveSum);
 const doubled=metrics('07',8,{angle:45});close(doubled.lhs,1);close(doubled.cosDouble,0);
 const amplitude=metrics('07',9,{A:-3});assert.equal(amplitude.amplitude,3);close(amplitude.period,2*Math.PI);
 assert.equal(metrics('07',9,{A:0}).period,null);assert.equal(metrics('07',10,{omega:0}).period,null);
 assert.equal(metrics('07',10,{omega:0}).amplitude,0);assert.equal(metrics('07',11,{omega:0,phase:90}).amplitude,0);
 close(metrics('07',10,{omega:-3}).period,2*Math.PI/3);
 close(metrics('07',11,{omega:2,phase:90}).shift,-Math.PI/4);assert.equal(metrics('07',11,{omega:0}).shift,null);
 const wheel={R:5,H:6,T:40,phase:0};close(metrics('07',12,{...wheel,t:10}).height,11);close(metrics('07',12,{...wheel,t:30}).height,1);close(metrics('07',12,{...wheel,t:0}).initialHeight,6);
 assert.equal(evaluate('g10-07-12',{T:0}).valid,false);assert.equal(evaluate('g10-07-12',{H:4,R:5}).valid,false);
});
test('vector translation, sum, scalar, independent basis and midpoint are checked from coordinates',()=>{
 const original=metrics('08',1,{x:0,y:0,dx:3,dy:4}),moved=metrics('08',1,{x:2,y:-1,dx:3,dy:4});close(original.magnitude,5);assert.deepEqual(moved.components,[3,4]);assert.deepEqual(moved.end,[5,3]);
 assert.equal(metrics('08',1,{dx:0,dy:0}).directionDefined,false);
 assert.deepEqual(metrics('08',2,{ax:2,ay:1,bx:-1,by:3,operation:'subtract'}).result,[3,-2]);
 const zero=metrics('08',2,{ax:2,ay:1,bx:-2,by:-1});assert.deepEqual(zero.result,[0,0]);assert.ok(zero.pathLength>0);
 const scaled=metrics('08',3,{ax:1,ay:-2,lambda:-3});assert.deepEqual(scaled.product,[-3,6]);close(scaled.magnitude,3*Math.sqrt(5));
 const basis=metrics('08',4,{e1x:1,e1y:1,e2x:-1,e2y:1,x:3,y:2});close(basis.coefficients[0],2.5);close(basis.coefficients[1],-.5);assert.equal(basis.basis,true);
 const dependent=metrics('08',4,{e1x:1,e1y:0,e2x:2,e2y:0,x:3,y:2});assert.equal(dependent.basis,false);assert.equal(dependent.coefficients,null);
 const translated=metrics('08',6,{ax:-1,ay:0,bx:3,by:2,tx:2,ty:1});assert.deepEqual(translated.midpoint,[1,1]);assert.deepEqual(translated.translatedMidpoint,[3,2]);close(translated.distance,Math.sqrt(20));close(translated.translatedDistance,Math.sqrt(20));
});
test('dot product distinguishes a right angle from the zero-vector case',()=>{
 const right=metrics('08',5,{lengthA:3,lengthB:2,angle:90});close(right.dot,0);assert.equal(right.perpendicular,true);
 const zero=metrics('08',5,{lengthA:0,lengthB:2,angle:90});assert.equal(zero.dot,0);assert.equal(zero.angleDefined,false);assert.equal(zero.perpendicular,false);
 assert.ok(metrics('08',5,{angle:60}).dot>0);assert.ok(metrics('08',5,{angle:120}).dot<0);
 assert.match(evaluate('g10-08-05',{angle:0}).summary,/Same direction/);assert.match(evaluate('g10-08-05',{angle:180}).summary,/Opposite directions/);
});
test('sine and cosine laws, area maximum and survey projection independently recover the givens',()=>{
 const s=metrics('09',1,{A:30,B:90,a:3});close(s.b,6);close(s.c,3*Math.sqrt(3));close(s.ratio,6);
 const c=metrics('09',2,{a:5,b:7,C:60});close(c.cSquared,39);
 close(metrics('09',2,{a:3,b:4,C:90}).c,5);
 assert.equal(evaluate('g10-09-02',{C:180}).valid,false);
 close(metrics('09',4,{a:4,b:6,C:90}).area,12);close(metrics('09',4,{a:5,b:7,C:30}).area,metrics('09',4,{a:5,b:7,C:150}).area);
 const survey=metrics('09',5,{baseline:20,A:45,B:45});close(survey.width,10);close(survey.sightline,10*Math.sqrt(2));assert.equal(evaluate('g10-09-05',{A:90,B:90}).valid,false);
});
test('SSA0/1/2/1 cases obey both angle sums and independently reconstructed side lengths',()=>{
 for(const[a,count]of[[4,0],[5,1],[6,2],[10,1]]){
  const solutions=solveSSA(30,a,10);assert.equal(solutions.length,count);assert.equal(metrics('09',3,{A:30,a,b:10}).solutionCount,count);
  for(const s of solutions){close(s.A+s.B+s.C,180);assert.ok(s.C>0);const A=30*Math.PI/180,Cpoint=[10*Math.cos(A),10*Math.sin(A)];close(Math.hypot(Cpoint[0]-s.c,Cpoint[1]),a);}
 }
 assert.equal(solveSSA(120,5,10).length,0);assert.equal(solveSSA(120,12,10).length,1);assert.equal(solveSSA(0,12,10).length,0);
});
test('solid classification, foreshortening, cone net and volumes include their actual boundaries',()=>{
 assert.equal(metrics('10',1,{shape:'sphere'}).bases,0);assert.equal(metrics('10',1,{shape:'sphere'}).apex,false);assert.equal(metrics('10',1,{shape:'cone'}).apex,true);
 const projection=metrics('10',2,{a:4,b:4,q:.5,angle:45});assert.equal(projection.drawnFront,4);assert.equal(projection.drawnDepth,2);assert.equal(evaluate('g10-10-02',{angle:0}).valid,false);
 const cone=metrics('10',3,{shape:'cone',r:3,h:4});close(cone.slant,5);close(cone.lateralArea,15*Math.PI);close(cone.totalArea,24*Math.PI);
 const cylinder=metrics('10',3,{shape:'cylinder',r:3,h:4});close(cylinder.totalArea,42*Math.PI);
 assert.equal(evaluate('g10-10-03',{h:0}).valid,false);
 close(metrics('10',4,{shape:'cone',S:12,h:5}).volume,20);close(metrics('10',4,{shape:'prism',S:12,h:5}).volume,60);
 const frustum=metrics('10',5,{R:3,r:1,h:4});close(frustum.volume,52*Math.PI/3);close(frustum.overestimate,Math.PI*4*(3-1)**2/6);
 close(metrics('10',5,{R:3,r:3,h:4}).volume,36*Math.PI);close(metrics('10',5,{R:3,r:0,h:4}).volume,12*Math.PI);assert.equal(evaluate('g10-10-05',{R:1,r:2}).valid,false);
 const sphere=metrics('10',6,{r:1,k:3});assert.equal(sphere.areaFactor,9);assert.equal(sphere.volumeFactor,27);assert.equal(evaluate('g10-10-06',{k:0}).valid,false);
});
test('space relations are invariant under viewpoint and the criterion counterexamples remain genuine',()=>{
 assert.equal(lineRelation([0,0,0],[1,0,0],[1,1,0],[0,0,1]),'skew');assert.equal(lineRelation([0,0,0],[1,0,0],[0,0,1],[1,0,0]),'parallel');assert.equal(lineRelation([0,0,0],[1,0,0],[0,0,0],[0,1,0]),'intersect');assert.equal(lineRelation([0,0,0],[0,0,0],[0,0,1],[1,0,0]),'invalid');
 for(const view of[0,45,90,180,270,360])assert.equal(metrics('14',1,{relation:'skew',view}).relation,'skew');
 assert.equal(metrics('14',2,{height:1,tilt:0}).relation,'parallel');assert.equal(metrics('14',2,{height:0,tilt:0}).relation,'contained');close(metrics('14',2,{height:1,tilt:-1}).intersectionParameter,1);
 const missedTilt=metrics('14',3,{height:1,sx:0,sy:1});assert.equal(missedTilt.xTestsPass,true);assert.equal(missedTilt.parallel,false);assert.equal(missedTilt.relation,'intersect');assert.equal(metrics('14',3,{height:0,sx:0,sy:0}).xTestsPass,false);
 const repeated=metrics('14',4,{vx:0,vy:1,vz:0,tests:'parallel'});assert.equal(repeated.bothTestsPass,true);assert.equal(repeated.perpendicular,false);assert.equal(metrics('14',4,{vx:0,vy:0,vz:1,tests:'intersecting'}).perpendicular,true);assert.equal(evaluate('g10-14-04',{vx:0,vy:0,vz:0}).valid,false);
 const hinge=metrics('14',5,{fold:90,direction:0});assert.equal(hinge.planePerpendicular,true);assert.equal(hinge.linePerpendicular,false);assert.equal(metrics('14',5,{fold:90,direction:90}).linePerpendicular,true);assert.equal(metrics('14',5,{fold:0}).coincident,true);
 assert.match(evaluate('g10-14-03',{height:2,sx:1,sy:1}).svg,/data-scene-fit="true"/);assert.match(evaluate('g10-14-02',{height:2,tilt:1}).svg,/data-scene-fit="true"/);
});
