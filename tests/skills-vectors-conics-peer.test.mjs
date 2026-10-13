/** Peer check by the calculus/statistics author: freshly transcribed problem data, no bank helper. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {vectorConicSkills as lessons} from '../src/data/senior-math/skills-vectors-conics.mjs';
import {scene as vectorScene} from '../src/lib/skill-vectors-conics-inquiry.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<=1e-10*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const subtract=(a,b)=>a.map((v,i)=>v-b[i]);
const length=v=>Math.hypot(...v);
const det=(u,v)=>u[0]*v[1]-u[1]*v[0];
test('adaptive geometric arrows preserve a common equal-aspect scale at every extreme combination',()=>{
 for(const x of [-5,0,5])for(const y of [-4,0,4])for(const t of [-2,0,2]){
  const out=vectorScene('vectors-geometric',{x,y,t}),paths=out.paths.slice(-2).map(p=>p.d.match(/-?\d+(?:\.\d+)?/g).map(Number));
  for(const [x1,y1,x2,y2]of paths){assert.ok(x1>=0&&x1<=640&&x2>=0&&x2<=640);assert.ok(y1>=0&&y1<=360&&y2>=0&&y2<=360);}
  const [u,v]=paths;close(v[2]-v[0],t*(u[2]-u[0]));close(v[3]-v[1],t*(u[3]-u[1]));
  close(out.values.scaledNorm,Math.abs(t)*Math.hypot(x,y));assert.ok(out.summary.en.includes('same adaptive scale'));assert.ok(out.summary.zh.includes('同一自動比例'));
 }
});
function scalar(type){switch(type){
 case 'resultant-length':return length([3,4]);
 case 'norm':return length([-6,8]);
 case 'scaling':return Math.abs(-3)*2;
 case 'distance-displacement':return length([3-3,4]);
 case 'opposite-direction':return Math.acos(-1)*180/Math.PI;
 case 'route-optimization':return length([2+1,1+3]);
 case 'midpoint':return (-2+6)/2;
 case 'point-distance':return length(subtract([4,5],[1,1]));
 case 'parallel-parameter':return 3*(4/2);
 case 'centroid':return (0+0+9)/3;
 case 'coordinate-dot':return dot([2,1],[3,-4]);
 case 'angle':return Math.acos(dot([1,0],[1,1])/(length([1,0])*length([1,1])))*180/Math.PI;
 case 'projection-minimum':return dot([3,4],[2,0])/dot([2,0],[2,0]);
 case 'orthogonal-parameter':return -(2*3)/1;
 case 'squared-norm':return 3**2+4**2+2*2;
 case 'work':return dot([3,4],[2,-1]);
 case 'signed-projection':return dot([-3,4],[1,0]);
 case 'cosine-from-norms':return (2**2+3**2-4**2)/2;
 case 'projection-coefficient':return dot([4,3],[1,2])/dot([1,2],[1,2]);
 case 'triangle-area':return Math.abs(det([6,0],[2,4]))/2;
 case 'included-angle-length':return 3**2+5**2-2*3*5*Math.cos(Math.PI/3);
 case 'centroid-ratio':return 9*2/3;
 case 'oriented-area':return Math.abs(det([1,3],[4,2]))/2;
 case 'median-numerical':return Math.sqrt(5**2-(6/2)**2);
 case 'focal-extremum':return Math.sqrt(25)+Math.sqrt(25-9);
 case 'focal-parameter':return Math.sqrt(16-7);
 case 'focal-sum':return 2*Math.sqrt(36);
 case 'point-substitution':return 16*(1-3**2/25);
 case 'eccentricity':return Math.sqrt(100-36)/Math.sqrt(100);
 case 'hyperbola-focus':return Math.sqrt(16+9);
 case 'hyperbola-eccentricity':return Math.sqrt(9+16)/Math.sqrt(9);
 case 'hyperbola-point':return 16*(5**2/9-1);
 case 'rectangular-hyperbola':return Math.sqrt(3**2);
 case 'nearest-focus':return 8/4;
 case 'focal-coefficient':return 20/4;
 case 'parabola-point':return 4**2/8;
 case 'latus-rectum':{const focus=8/4,y=Math.sqrt(8*focus);return y-(-y);}
 case 'focal-distance':return Math.abs(6-(-8/4));
 case 'horizontal-chord':return 2*Math.sqrt(9);
 case 'intersection-count':{const rhs=1-3**2/4;return rhs<0?0:rhs===0?1:2;}
 case 'tangent-parameter':return 9*1**2+4;
 case 'chord-square':return (2*Math.sqrt(9*(1-1**2/4)))**2;
 default:throw Error(`Missing peer scalar derivation: ${type}`);
}}
const vector=expr=>{const match=expr.match(/^\((-?[\d.]+),(-?[\d.]+)\)$/);return match?match.slice(1).map(Number):null;};
function choice(q){const find=predicate=>{const matches=q.choices.filter(c=>predicate(c.expression));assert.equal(matches.length,1,q.id);return matches[0].id;},number=value=>find(s=>Number(s)===value),pair=value=>find(s=>JSON.stringify(vector(s))===JSON.stringify(value));
 switch(q.taskType){
 case 'diagnostic-direction':return pair([2,-1]);
 case 'diagnostic-scaling':return number(Math.abs(-2)*4);
 case 'diagnostic-subtraction':return pair(subtract([-1,3],[2,-1]));
 case 'diagnostic-division':return number(9*2/(2+1));
 case 'diagnostic-dot-type':return number(dot([1,2],[3,4]));
 case 'diagnostic-projection':return number(dot([3,4],[2,0])/dot([2,0],[2,0]));
 case 'diagnostic-midline':{const u=[2,1],v=[-1,3],expected=subtract(v,u).map(x=>x/2),operations={'(v-u)/2':subtract(v,u).map(x=>x/2),'(u+v)/2':u.map((x,i)=>(x+v[i])/2),'v-u':subtract(v,u),'(u-v)/2':subtract(u,v).map(x=>x/2)};return find(s=>JSON.stringify(operations[s])===JSON.stringify(expected));}
 case 'diagnostic-cosine':return number(Math.sqrt(3**2+4**2));
 case 'diagnostic-axis':return number(Math.sqrt(Math.max(9,25)));
 case 'diagnostic-foci':return number(25-9);
 case 'diagnostic-hyperbola-relation':return number(9+16);
 case 'diagnostic-asymptote':return find(s=>s===`y=${Math.sqrt(16)}x/${Math.sqrt(9)}`);
 case 'diagnostic-four-factor':return pair([8/4,0]);
 case 'diagnostic-translated-vertex':return pair([-3,2]);
 case 'diagnostic-zero-root':{const roots=[0,4];return find(s=>s===roots.map(x=>`(${x},${x})`).join(','));}
 case 'diagnostic-discriminant':{const a=0,b=2,c=-4;return number(a===0?(b===0?(c===0?Infinity:0):1):2);}
 default:throw Error(`Missing peer diagnostic derivation: ${q.taskType}`);
}}
test('peer independently recalculates every 42 scalar and 16 diagnostic answer from stated data',()=>{let numbers=0,choices=0,written=0;const seen=new Set();
 for(const l of lessons)for(const q of [...l.questions,...l.diagnostics]){assert.ok(!seen.has(q.id));seen.add(q.id);if(q.kind==='choice'){const expected=choice(q);assert.equal(q.answer,expected,q.id);choices++;}else if(typeof q.answer==='number'){const expected=scalar(q.taskType);close(q.answer,expected);numbers++;}else written++;}
 assert.deepEqual([numbers,choices,written,seen.size],[42,16,62,120]);
});
test('vector identities, constrained projection, triangle proofs and physical transfer have independent witnesses',()=>{
 for(const u of [[1,0],[2,-3],[-1,4]])for(const v of [[0,1],[-2,5],[3,1]]){const plus=u.map((x,i)=>x+v[i]),minus=subtract(u,v);close(dot(plus,minus),dot(u,u)-dot(v,v));close(dot(plus,plus)+dot(minus,minus),2*(dot(u,u)+dot(v,v)));}
 for(const [A,B,C] of [[[0,0],[6,0],[2,4]],[[1,-2],[3,5],[-4,3]]]){const G=A.map((a,i)=>(a+B[i]+C[i])/3),M=B.map((b,i)=>(b+C[i])/2);subtract(G,A).forEach((x,i)=>close(x,2/3*subtract(M,A)[i]));}
 const H=[2,2];close(dot(subtract(H,[2,4]),[6,0]),0);close(dot(H,[-4,4]),0);close(dot(subtract(H,[6,0]),[2,4]),0);
 const C=[2*3-0-4,3*3-1-0];assert.deepEqual(C,[2,8]);close(Math.abs(det([4,-1],subtract(C,[0,1])))/2,15);
 const t=dot([3,4],[2,0])/dot([2,0],[2,0]);assert.ok(t>1);close(length(subtract([3,4],[2,0])),Math.sqrt(17));
 const relative=[-3,Math.sqrt(5**2-3**2)],ground=[relative[0]+3,relative[1]];close(length(relative),5);close(ground[0],0);close(20/ground[1],5);
});
test('conic transfer bounds and focal degeneracies agree with independent geometric calculations',()=>{
 const maximum=Math.hypot(3*2,4*3),attaining=[2*(3*2)/maximum,3*(4*3)/maximum];close(attaining[0]**2/4+attaining[1]**2/9,1);close(3*attaining[0]+4*attaining[1],maximum);
 for(let i=0;i<=360;i++){const t=i*Math.PI/180,x=2*Math.cos(t),y=3*Math.sin(t);assert.ok(3*x+4*y<=maximum+1e-10);}
 for(const x of [-3,-1,0,2,3])close(Math.abs(x+3)+Math.abs(x-3),6);assert.ok(5<length(subtract([3,0],[-3,0])));
 for(const x of [-10,-5,5,10])close(Math.abs(Math.abs(x+5)-Math.abs(x-5)),10);assert.ok(Math.abs(length(subtract([0,3],[-5,0]))-length(subtract([0,3],[5,0])))<1e-10);
 for(const y of [-10,-2,0,2,10]){const x=y*y/8,PF=length([x-2,y]),PQ=length([x-8,y]);close(PF,x+2);assert.ok(PF+PQ>=10-1e-10);if(y!==0)assert.ok(PF+PQ>10);}
 close(length([-2,0])+length([-8,0]),10);
});
test('degree loss, midpoint locus including vertical line, and recovered parabola chord are independently checked',()=>{
 for(const k of [-3,-1,.5,2]){const x=-(1+k*k)/(2*k),y=x+k;close(x*x-y*y,1);assert.notEqual(x,y);}assert.equal(0**2-0**2,0);
 for(const m of [-8,-2,-1,0,1,2,8]){const A=4+9*m*m,B=18*m,C=-27,D=B*B-4*A*C,roots=[(-B-Math.sqrt(D))/(2*A),(-B+Math.sqrt(D))/(2*A)],mid=[(roots[0]+roots[1])/2,m*(roots[0]+roots[1])/2+1];close(mid[0]**2/(9/16)+(mid[1]-.5)**2/(1/4),1);for(const x of roots)close(x*x/9+(m*x+1)**2/4,1);}
 close(0**2/(9/16)+(0-.5)**2/(1/4),1);/* vertical chord midpoint */
 const endpoints=[-1,1].map(sign=>[2+sign*Math.sqrt(7)/2,1+sign*Math.sqrt(7)]);for(const [x,y] of endpoints){close(y*y,4*x);close(2*x-y,3);}close((endpoints[0][0]+endpoints[1][0])/2,2);close((endpoints[0][1]+endpoints[1][1])/2,1);
});
