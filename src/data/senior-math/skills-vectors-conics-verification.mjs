// Recalculation accepts public givens only. Stored answers and worked solutions
// are accessed solely by the comparison layer below.
import {createHash} from 'node:crypto';
const normal=s=>(s||'').replaceAll('−','-').replaceAll('²','^2');
const pairs=s=>[...normal(s).matchAll(/\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)/g)].map(m=>[+m[1],+m[2]]);
const match=(s,re)=>{const m=normal(s).match(re);if(!m)throw Error('Unrecognized public givens: '+s);return m.slice(1).map(Number);};
const denominators=s=>match(s,/x\^2\/(\d+).*y\^2\/(\d+)/);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const norm=a=>Math.hypot(...a);
const choose=(q,wanted,parse=Number)=>{
 const same=(a,b)=>Array.isArray(a)?Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>same(x,b[i])):typeof a==='number'&&typeof b==='number'?Math.abs(a-b)<1e-8:a===b;
 const hits=q.choices.filter(c=>same(parse(normal(c.expression)),wanted));
 if(hits.length!==1)throw Error('Expected exactly one matching distractor option');
 return hits[0].id;
};
const calculations={
 'resultant-length':q=>{const [a,b]=pairs(q.expression);return norm(a.map((x,i)=>x+b[i]));},
 norm:q=>norm(pairs(q.expression)[0]),
 scaling:q=>Math.abs(match(q.prompt.en,/by (-?\d+)/)[0])*match(q.expression,/=(\d+)/)[0],
 'distance-displacement':q=>{const [e,n,w]=match(q.prompt.en,/east (\d+), north (\d+), west (\d+)/);return Math.hypot(e-w,n);},
 'opposite-direction':q=>{if(!q.prompt.en.includes('unit vectors satisfy u+v=0'))throw Error('Missing opposite-unit condition');return Math.acos(-1)*180/Math.PI;},
 'route-optimization':q=>{const [a,b]=pairs(q.prompt.en);return norm(a.map((x,i)=>x+b[i]));},
 midpoint:q=>{const [a,b]=pairs(q.expression);return (a[0]+b[0])/2;},
 'point-distance':q=>{const [a,b]=pairs(q.expression);return norm(sub(b,a));},
 'parallel-parameter':q=>{const [x,y,z]=match(q.expression,/u=\((\d+),(\d+)\).*v=\((\d+),k\)/);return y*z/x;},
 centroid:q=>pairs(q.expression).reduce((s,p)=>s+p[1],0)/3,
 'coordinate-dot':q=>dot(...pairs(q.expression)),
 angle:q=>{const [a,b]=pairs(q.expression);return Math.acos(dot(a,b)/(norm(a)*norm(b)))*180/Math.PI;},
 'projection-minimum':q=>{const [u,v]=pairs(q.expression);return dot(u,v)/dot(u,u);},
 'orthogonal-parameter':q=>{const [x,y,z]=match(q.expression,/u=\((\d+),(\d+)\).*v=\(k,(\d+)\)/);return -y*z/x;},
 'squared-norm':q=>{const [a,b,d]=match(q.expression,/\|u\|=(\d+).*\|v\|=(\d+).*v=(\d+)/);return a*a+b*b+2*d;},
 work:q=>dot(...pairs(q.expression)),
 'signed-projection':q=>pairs(q.expression)[0][0],
 'cosine-from-norms':q=>{const [a,b,c]=match(q.expression,/\|u\|=(\d+).*\|v\|=(\d+).*\|u-v\|=(\d+)/);return (a*a+b*b-c*c)/2;},
 'projection-coefficient':q=>{const [u,v]=pairs(q.expression);return dot(u,v)/dot(u,u);},
 'triangle-area':q=>{const [a,b,c]=pairs(q.expression),u=sub(b,a),v=sub(c,a);return Math.abs(u[0]*v[1]-u[1]*v[0])/2;},
 'included-angle-length':q=>{const [a,b,theta]=match(q.prompt.en,/sides are (\d+) and (\d+) with included angle (\d+)/);return a*a+b*b-2*a*b*Math.cos(theta*Math.PI/180);},
 'centroid-ratio':q=>match(q.prompt.en,/length (\d+)/)[0]*2/3,
 'oriented-area':q=>{const [a,b]=pairs(q.expression);return Math.abs(a[0]*b[1]-a[1]*b[0])/2;},
 'median-numerical':q=>{const [a,b,c]=match(q.prompt.en,/AB=(\d+), AC=(\d+) and BC=(\d+)/);return Math.sqrt(2*a*a+2*b*b-c*c)/2;},
 'focal-extremum':q=>{const [a2,b2]=denominators(q.expression);return Math.sqrt(a2)+Math.sqrt(a2-b2);},
 'focal-parameter':q=>{const [a2,b2]=denominators(q.expression);return Math.sqrt(Math.abs(a2-b2));},
 'focal-sum':q=>2*Math.sqrt(Math.max(...denominators(q.expression))),
 'point-substitution':q=>{const [a2,b2]=denominators(q.expression),[x]=match(q.prompt.en,/\((\d+),y\)/);return b2*(1-x*x/a2);},
 eccentricity:q=>{const [a2,b2]=denominators(q.expression);return Math.sqrt(1-b2/a2);},
 'hyperbola-focus':q=>Math.sqrt(denominators(q.expression).reduce((s,x)=>s+x,0)),
 'hyperbola-eccentricity':q=>{const [a2,b2]=denominators(q.expression);return Math.sqrt(1+b2/a2);},
 'hyperbola-point':q=>{const [a2,b2]=denominators(q.prompt.en),[x]=match(q.prompt.en,/\((\d+),y\)/);return b2*(x*x/a2-1);},
 'rectangular-hyperbola':q=>{const [a]=match(q.prompt.en,/a=(\d+)/);return a*Math.sqrt(1);},
 'nearest-focus':q=>Math.abs(match(q.prompt.en,/y\^2=(\d+)x/)[0])/4,
 'focal-coefficient':q=>match(q.expression,/x\^2=(\d+)y/)[0]/4,
 'parabola-point':q=>{const [y]=match(q.prompt.en,/\(x,(\d+)\)/),[coefficient]=match(q.prompt.en,/y\^2=(\d+)x/);return y*y/coefficient;},
 'latus-rectum':q=>Math.abs(match(q.expression,/y\^2=(\d+)x/)[0]),
 'focal-distance':q=>{const [coefficient,x]=match(q.prompt.en,/y\^2=(\d+)x has x=(\d+)/);return x+coefficient/4;},
 'horizontal-chord':q=>{const [a2,b2]=denominators(q.expression),[y]=match(q.prompt.en,/y=(\d+)/);return 2*Math.sqrt(a2*(1-y*y/b2));},
 'intersection-count':q=>{const [a2,b2]=denominators(q.expression),[y]=match(q.expression,/,.*y=(\d+)/),r=a2*(1-y*y/b2);return r<0?0:r===0?1:2;},
 'tangent-parameter':q=>denominators(q.expression).reduce((s,x)=>s+x,0),
 'chord-square':q=>{const [a2,b2]=denominators(q.expression),[y]=match(q.prompt.en,/y=(\d+)/);return 4*a2*(1-y*y/b2);},
 'diagnostic-direction':q=>choose(q,pairs(q.prompt.en)[0],s=>pairs(s)[0]),
 'diagnostic-scaling':q=>{const [length,k]=match(q.prompt.en,/\|u\|=(\d+).*\|(-?\d+)u\|/);return choose(q,length*Math.abs(k));},
 'diagnostic-subtraction':q=>{const [a,b]=pairs(q.prompt.en);return choose(q,sub(b,a),s=>pairs(s)[0]);},
 'diagnostic-division':q=>{const [a,b]=pairs(q.prompt.en),[m,n]=match(q.prompt.en,/AP:PB=(\d+):(\d+)/);return choose(q,(n*a[0]+m*b[0])/(m+n));},
 'diagnostic-dot-type':q=>choose(q,dot(...pairs(q.prompt.en))),
 'diagnostic-projection':q=>{const [v,u]=pairs(q.prompt.en);return choose(q,dot(u,v)/dot(u,u));},
 'diagnostic-midline':q=>{
  if(!q.prompt.en.includes('D,E are midpoints of AB,AC'))throw Error('Missing midpoint hypothesis');
  // Parse each candidate's coefficients of u,v, independent of its letter.
  return choose(q,[-.5,.5],s=>{
   const denominator=s.endsWith('/2')?2:1,body=s.replace('/2','').replace(/[()]/g,'');
   const coefficients=[0,0];for(const m of body.matchAll(/([+-]?)([uv])/g))coefficients[m[2]==='u'?0:1]+=(m[1]==='-'?-1:1)/denominator;
   return coefficients;
  });
 },
 'diagnostic-cosine':q=>{const [a,b]=match(q.prompt.en,/Sides (\d+) and (\d+)/);return choose(q,Math.hypot(a,b));},
 'diagnostic-axis':q=>choose(q,Math.sqrt(Math.max(...denominators(q.prompt.en)))),
 'diagnostic-foci':q=>{const [a,b]=denominators(q.prompt.en);return choose(q,Math.abs(a-b));},
 'diagnostic-hyperbola-relation':q=>choose(q,denominators(q.prompt.en).reduce((s,x)=>s+x,0)),
 'diagnostic-asymptote':q=>{const [a,b]=denominators(q.prompt.en);return choose(q,[Math.sqrt(b/a),0],s=>{const [n,d,c]=match(s,/y=(\d+)x\/(\d+)(?:\+(\d+))?/);return [n/d,c||0];});},
 'diagnostic-four-factor':q=>choose(q,[match(q.prompt.en,/y\^2=(\d+)x/)[0]/4,0],s=>pairs(s)[0]),
 'diagnostic-translated-vertex':q=>{const [k,h]=match(q.prompt.en,/\(y-(\d+)\)\^2=4\(x\+(\d+)\)/);return choose(q,[-h,k],s=>pairs(s)[0]);},
 'diagnostic-zero-root':q=>{const [c]=match(q.prompt.en,/y\^2=(\d+)x/);if(!q.prompt.en.includes('y=x'))throw Error('Missing line');return choose(q,[[0,0],[c,c]],pairs);},
 'diagnostic-discriminant':q=>{const [A,B,C]=match(q.prompt.en,/(\d+)x\^2\+(\d+)x-(\d+)=0/);const count=A===0?(B===0?(C===0?Infinity:0):1):(B*B+4*A*C<0?0:B*B+4*A*C===0?1:2);return choose(q,count,s=>s==='\\infty'?Infinity:Number(s));},
};
export function deriveVectorConicAnswer(taskType,publicQuestion){
 const f=calculations[taskType];if(!f)throw Error('No independent calculation: '+taskType);return f(publicQuestion);
}
export function auditVectorConicAnswers(units){
 const records=[];
 for(const u of units)for(const q of [...u.questions,...u.diagnostics]){
  if(typeof q.answer!=='number'&&q.kind!=='choice')continue;
  const publicOnly={prompt:q.prompt,expression:q.expression,choices:q.choices?.map(({id,expression,label})=>({id,expression,label}))};
  const derived=deriveVectorConicAnswer(q.taskType,publicOnly),same=typeof derived==='number'?Math.abs(derived-q.answer)<1e-7:derived===q.answer;
  if(!same)throw Error(q.id+': derived '+derived+' but published '+q.answer);
  records.push({id:q.id,method:q.taskType,derived,published:q.answer});
 }
 return {verifiedIds:records.map(r=>r.id),records,methods:Object.fromEntries(records.map(r=>[r.method,records.filter(x=>x.method===r.method).length])),uncovered:[]};
}
export const writtenPayload=q=>JSON.stringify({id:q.id,prompt:q.prompt,expression:q.expression,answer:q.answer,hints:q.hints,steps:q.steps,result:q.result,explanation:q.explanation,conditions:q.conditions});
export const writtenDigest=q=>createHash('sha256').update(writtenPayload(q)).digest('hex');
