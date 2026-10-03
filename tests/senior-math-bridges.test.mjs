import test from 'node:test';
import assert from 'node:assert/strict';
import {algebraBridgeLessons} from '../src/data/senior-math/algebra-bridges.mjs';

// Read givens from the rendered questions, not the authoring bank's seed or answers.
// Substitution/composition and exhaustive boundary grids independently check claims.
const questions = id => algebraBridgeLessons.find(l => l.id === id).questions;
const near = (a,b,message='') => assert(Math.abs(a-b)<1e-9*Math.max(1,Math.abs(a),Math.abs(b)),`${message}: ${a} != ${b}`);
const value = (text,pattern,group=1) => {const m=text.match(pattern);assert(m,`Missing given: ${text}`);return Number(m[group]);};
const claims = q => q.steps.map(s=>s.math||'').join(';');
const contains = (q,text) => assert(q.result.en.includes(text),`${q.id}: expected result to include ${text}; got ${q.result.en}`);
const grid = Array.from({length:121},(_,i)=>(i-40)/4);

test('All 13 real-algebra tasks satisfy original equations, including rejected radical candidates and holes',()=>{
 const seen=new Set();
 for(const q of questions('sup-real-algebra')){
  const e=q.expression,p=q.prompt.en;seen.add(q.id);
  if(p==='Simplify the radical.'){
   const radicand=value(e,/\\sqrt\{(\d+)\}/),factor=value(q.result.en,/^(\d+)√2/);
   assert(factor>=0);near(factor*Math.SQRT2,Math.sqrt(radicand),q.id);
  }else if(p==='Solve the rational equation.'){
   const excluded=value(e,/\{x-(\d+)\}/),root=q.answer;
   assert.notEqual(root,excluded);near((root+1)/(root-excluded),2,q.id);
   assert(claims(q).includes(`x\\ne${excluded}`));
  }else if(p.startsWith('Solve the radical equation')||p.startsWith('Explain why squaring')){
   const shift=value(e,/\\sqrt\{x\+(\d+)\}/),negative=e.endsWith('=-x');
   const d=value(q.result.en,/√(\d+)/),direction=q.result.en.includes('1−')?-1:1;
   const root=(1+direction*Math.sqrt(d))/2,other=1-root;
   near(d,1+4*shift);assert.equal(direction,negative?-1:1);
   assert(root+shift>=0);near(Math.sqrt(root+shift),negative?-root:root,q.id);
   assert(Math.abs(Math.sqrt(other+shift)-(negative?-other:other))>1);
   assert(claims(q).includes(negative?'x\\le0':'x\\ge0'));
  }else if(p.startsWith('Solve the linear system')){
   const a=value(e,/x\+y=(\d+)/),b=value(e,/2x-y=(\d+)/),x=q.answer,y=a-x;
   near(x+y,a);near(2*x-y,b,q.id);near(y,1);
  }else if(p.startsWith('Solve the linear–quadratic system')){
   const offset=value(e,/y=x\+(\d+)/),d=value(q.result.en,/√(\d+)/);
   assert(q.result.en.includes('±'));near(d,1+4*offset);
   for(const sign of [-1,1]){const x=(1+sign*Math.sqrt(d))/2;near(x*x,x+offset,q.id);}
  }else if(p.startsWith('Is cancelling')){
   const excluded=value(e,/\{x-(\d+)\}/),constant=value(e,/x\^2-(\d+)/);
   contains(q,`except ${excluded}`);near(constant,excluded**2);
   for(const x of grid)if(x!==excluded)near((x*x-constant)/(x-excluded),x+excluded,q.id);
   assert(Number.isNaN((excluded**2-constant)/(excluded-excluded)));
   assert(claims(q).includes(`x\\ne${excluded}`));
  }else assert.fail(`Unaudited task: ${q.id}`);
 }
 assert.equal(seen.size,13);
});

test('All 13 absolute-value tasks preserve unions, intersections, equality boundaries and the proof coefficient',()=>{
 const seen=new Set();
 for(const q of questions('sup-absolute-inequalities')){
  const e=q.expression,p=q.prompt.en,k=value(e,/x-(\d+)/);seen.add(q.id);
  if(p==='Solve the strict absolute-value inequality.'){
   contains(q,`(${k-3},${k+3})`);
   for(const x of grid)assert.equal(Math.abs(x-k)<3,x>k-3&&x<k+3,q.id);
  }else if(p==='Solve the exterior distance inequality.'){
   contains(q,`x≤${k-2} or x≥${k+2}`);
   for(const x of grid)assert.equal(Math.abs(x-k)>=2,x<=k-2||x>=k+2,q.id);
  }else if(p==='Solve the simultaneous inequalities.'){
   contains(q,`(${k},${k+3}]`);
   for(const x of grid)assert.equal(Math.abs(x-k)<=3&&x>k,x>k&&x<=k+3,q.id);
  }else if(p==='Count the integer solutions.'){
   const candidates=Array.from({length:101},(_,i)=>i-50).filter(x=>Math.abs(x-k)<2);
   assert.equal(q.answer,candidates.length);assert.deepEqual(candidates,[k-1,k,k+1]);
  }else if(p==='Solve the inequality with a negative right side.'){
   contains(q,'No solution');assert(grid.every(x=>!(Math.abs(x-k)<=-1)));
   assert(claims(q).includes(`|x-${k}|\\ge0>-1`));
  }else if(p.startsWith('Find the minimum of the sum')){
   contains(q,`Minimum ${k}, attained on [0,${k}]`);
   for(const x of grid){const sum=Math.abs(x)+Math.abs(x-k);assert(sum>=k);assert.equal(sum===k,x>=0&&x<=k,q.id);}
  }else if(p.startsWith('Solve by comparing distances')){
   contains(q,`x<${k}/2`);
   // A previous typo emitted "23x" when it intended 2*3*x. Check the printed proof too.
   const coefficient=value(claims(q),/\\iff (\d+)x/),rhs=value(claims(q),/\\iff \d+x<(\d+)/);
   near(coefficient,2*k);near(rhs,k*k);
   for(const x of [...grid,k/2-1e-6,k/2,k/2+1e-6]){
    assert.equal(Math.abs(x)<Math.abs(x-k),x<k/2,q.id);
    assert.equal(Math.abs(x)<Math.abs(x-k),coefficient*x<rhs,q.id);
   }
  }else assert.fail(`Unaudited task: ${q.id}`);
 }
 assert.equal(seen.size,13);
});

test('All 13 inverse-function tasks exchange domains/ranges and choose the correct branch',()=>{
 const seen=new Set();
 for(const q of questions('sup-inverse-functions')){
  const e=q.expression,p=q.prompt.en;seen.add(q.id);
  if(p==='Find the inverse of the linear function.'){
   const slope=value(e,/f\(x\)=(\d+)x/),denominator=value(q.result.en,/\/(\d+)/);
   assert.notEqual(slope,0);near(denominator,slope);
   contains(q,'(x−3)');for(const x of grid)near(((slope*x+3)-3)/denominator,x,q.id);
  }else if(p==='Find the inverse and its domain.'){
   const excluded=value(e,/x-(\d+)/),shift=value(q.result.en,/=(\d+)\+1\/x/);
   near(shift,excluded);contains(q,'x≠0');
   for(const x of grid)if(x!==excluded){const y=1/(x-excluded);assert.notEqual(y,0);near(shift+1/y,x,q.id);}
   for(const y of grid)if(y!==0){const x=shift+1/y;assert.notEqual(x,excluded);near(1/(x-excluded),y,q.id);}
  }else if(p.startsWith('Find the inverse on the stated')){
   const vertex=value(e,/\(x-(\d+)\)/),shift=value(q.result.en,/=(\d+)\+√x/);
   contains(q,'x≥0');near(shift,vertex);assert(e.includes(`x\\ge${vertex}`));
   for(const y of [0,.01,.25,1,4,9,100]){const x=shift+Math.sqrt(y);assert(x>=vertex);near((x-vertex)**2,y,q.id);}
   for(const x of grid.filter(x=>x>=vertex))near(shift+Math.sqrt((x-vertex)**2),x,q.id);
   assert.notEqual(shift+Math.sqrt((vertex-1-vertex)**2),vertex-1,'The unrestricted negative branch must not be inverted by +sqrt');
  }else if(p==='Evaluate the inverse composition at 5.'){
   const slope=value(e,/f\(x\)=(\d+)x/),image=slope*5+3;
   near(q.answer,(image-3)/slope);near(q.answer,5);
  }else if(p.startsWith('Can f(x)=x²')){
   contains(q,'No: f(1)=f(−1)=1');assert.notEqual(1,-1);near(1**2,(-1)**2);
  }else if(p.startsWith('Find both inverse branches')){
   const vertex=value(e,/\(x-(\d+)\)/);
   contains(q,`x≤${vertex}: f⁻¹(y)=${vertex}−√y`);contains(q,`x≥${vertex}: f⁻¹(y)=${vertex}+√y, y≥0`);
   for(const y of [0,.01,.25,1,4,9,100])for(const sign of [-1,1]){
    const x=vertex+sign*Math.sqrt(y);near((x-vertex)**2,y,q.id);assert(sign*(x-vertex)>=0);
    if(y>0)assert.notEqual(vertex-Math.sqrt(y),vertex+Math.sqrt(y),'The unrestricted inverse relation has two values');
   }
  }else if(p.startsWith('Find the inverse of the fractional')){
   const offset=value(e,/x\+(\d+)/),claimed=value(q.result.en,/\(x\+(\d+)\)/);
   near(claimed,offset);contains(q,'/(x−1), x≠1');assert.notEqual(offset,-1);
   const f=x=>(x+offset)/(x-1);
   for(const x of grid)if(x!==1){const y=f(x);assert.notEqual(y,1);near((y+claimed)/(y-1),x,q.id);}
   // f(x)=1 would imply offset=-1. For the actual positive offset this output is absent.
   assert.notEqual(offset+1,0);
  }else assert.fail(`Unaudited task: ${q.id}`);
 }
 assert.equal(seen.size,13);
});

test('All 13 exponential/log tasks solve the original expressions and retain positive-argument restrictions',()=>{
 const seen=new Set();
 for(const q of questions('sup-exponential-log-equations')){
  const e=q.expression,p=q.prompt.en;seen.add(q.id);
  if(p==='Solve the exponential equation.'){
   const exponent=value(e,/=2\^\{(\d+)\}/);near(2**(q.answer+1),2**exponent,q.id);
  }else if(p==='Solve the logarithmic equation.'){
   const shift=value(e,/x-(\d+)/);assert(q.answer>shift);near(Math.log2(q.answer-shift),3,q.id);
   assert(claims(q).includes(`x>${shift}`));
  }else if(p==='Solve the equation, with the domain restriction.'){
   const offsets=[...e.matchAll(/x-(\d+)/g)].map(m=>Number(m[1]));assert.equal(offsets.length,2);
   const [a,b]=offsets,root=q.answer;assert(root>Math.max(a,b));
   near(Math.log2(root-a)+Math.log2(root-b),1,q.id);
   // Derive both roots of (x-a)(x-b)=2 independently; the second fails both log domains.
   const discriminant=(a+b)**2-4*(a*b-2),roots=[(a+b-Math.sqrt(discriminant))/2,(a+b+Math.sqrt(discriminant))/2];
   const admitted=roots.filter(x=>x>a&&x>b);assert.equal(admitted.length,1);near(admitted[0],root);
   assert(roots[0]-a<0&&roots[0]-b<0);assert(claims(q).includes(`x>${b}`));
  }else if(p==='Solve the exponential quadratic completely.'){
   // Explicit multiplication is essential: "42^x" means a different exponential.
   const m=e.match(/^4\^x-(\d+)\\cdot2\^x\+(\d+)=0$/);assert(m,e);
   const coefficient=Number(m[1]),constant=Number(m[2]);
   const claimed=value(q.result.en,/log₂\((\d+)\)/);contains(q,'x=0 or');near(claimed,constant);
   const discriminant=coefficient**2-4*constant,positiveRoots=[(coefficient-Math.sqrt(discriminant))/2,(coefficient+Math.sqrt(discriminant))/2];
   assert(positiveRoots.every(t=>t>0));assert.equal(new Set(positiveRoots).size,2);
   near(positiveRoots[0],1);near(positiveRoots[1],claimed);
   for(const x of [0,Math.log2(claimed)])near(4**x-coefficient*2**x+constant,0,q.id);
  }else if(p.startsWith('Solve the logarithmic inequality')){
   const exponent=value(e,/x>(\d+)/),denominator=value(q.result.en,/0<x<1\/(\d+)/),boundary=1/denominator;
   near(boundary,.5**exponent);
   for(const x of [1e-5,boundary/2,boundary,boundary*2,1,2])assert.equal(Math.log(x)/Math.log(.5)>exponent,x>0&&x<boundary,q.id);
   assert(claims(q).includes('x>0'));assert(Number.isNaN(Math.log(-boundary)));
  }else if(p.startsWith('A population doubles')){
   const years=value(e,/t\/(\d+)/);near(2**(q.answer/years),8,q.id);assert(q.prompt.en.includes(`every ${years} years`));
  }else if(p.startsWith('Use x=−')){
   const x=-value(e,/x=-(\d+)/);assert(Number.isFinite(Math.log2(x*x)));assert(Number.isNaN(Math.log2(x)));
   near(Math.log2(x*x),2*Math.log2(Math.abs(x)),q.id);
   contains(q,'undefined');contains(q,'2 log₂|x| for x≠0');assert(claims(q).includes('x\\ne0'));
  }else assert.fail(`Unaudited task: ${q.id}`);
 }
 assert.equal(seen.size,13);
});

test('Numeric bridge questions leave no undeclared template parameter in prose or mathematics',()=>{
 assert.equal(algebraBridgeLessons.flatMap(l=>l.questions).length,52);
 for(const lesson of algebraBridgeLessons)for(const q of lesson.questions){
  assert(!/\bk\b/.test(JSON.stringify(q)),`${q.id}: an undeclared literal k escaped authoring`);
 }
});
