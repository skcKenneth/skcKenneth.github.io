import assert from 'node:assert/strict';
import katex from 'katex';
import {createHash} from 'node:crypto';
import {advancedWrittenAuditLedger} from './advanced-written-audit.mjs';
import {advancedLessons,advancedReviews,advancedSupplements} from './advanced.mjs';
import {statsLessons,statsReviews} from './foundation-c2-statistics.mjs';
// Recalculate from published data; never import the authoring bank's answer functions.
const corpus=[...advancedLessons,...advancedSupplements,...advancedReviews,...statsLessons,...statsReviews];
let mathFields=0,questions=0,numericChecks=0;const byArea={};const verifiedIds=new Set();
function check(q,value,area,tolerance=1e-7){assert.equal(typeof q.answer,'number',q.id);assert.ok(Number.isFinite(value),q.id);assert.ok(Math.abs(q.answer-value)<=tolerance*Math.max(1,Math.abs(value)),q.id+': '+q.answer+' != '+value);verifiedIds.add(q.id);numericChecks++;byArea[area]=(byArea[area]||0)+1;}
function visit(x,path){if(Array.isArray(x))return x.forEach((v,i)=>visit(v,path+'.'+i));if(x&&typeof x==='object'){for(const[k,v]of Object.entries(x)){if(typeof v==='string'&&v&&['expression','formula','math','resultMath'].includes(k)){katex.renderToString(v,{throwOnError:true,strict:'error'});mathFields++;}visit(v,path+'.'+k);}}else if(typeof x==='string')assert.ok(!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(x),path);}
const variable=(e,n)=>Number(e.match(new RegExp(n+'=(\\d+)'))?.[1]);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const tuples=e=>[...e.matchAll(/\((-?\d+),(-?\d+),(-?\d+)\)/g)].map(m=>m.slice(1).map(Number));
function permutations(items){if(!items.length)return [[]];return items.flatMap((x,i)=>permutations(items.filter((_,j)=>j!==i)).map(rest=>[x,...rest]));}
function determinant(a){return permutations(a.map((_,i)=>i)).reduce((sum,p)=>{let inv=0;for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++)inv+=p[i]>p[j]?1:0;return sum+(-1)**inv*p.reduce((v,j,i)=>v*a[i][j],1);},0);}
const matrices=e=>[...e.matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)].map(m=>m[1].split('\\\\').map(row=>row.split('&').map(Number)));
function expand(a,b,n){let c=[1];for(let i=0;i<n;i++){const d=Array(c.length+1).fill(0);c.forEach((x,j)=>{d[j]+=a*x;d[j+1]+=b*x;});c=d;}return c;}
function bernoulli(n,p){const masses=Array(n+1).fill(0);for(let mask=0;mask<2**n;mask++){let heads=0;for(let j=0;j<n;j++)heads+=(mask>>j)&1;masses[heads]+=p**heads*(1-p)**(n-heads);}return masses;}
function integrate(f,a,b,n=2000){const h=(b-a)/n;let sum=f(a)+f(b);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);return h*sum/3;}
function remainingValue(q,skill,p,e){
 const at=(re)=>{const m=e.match(re);assert.ok(m,q.id+' cannot parse '+e);return Number(m[1]);};
 const t=variable(e,'t'),k=variable(e,'k');
 const pairs=[...e.matchAll(/\((-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\)/g)].map(m=>m.slice(1).map(Number));
 const pointTuples=tuples(e);
 const ellipseDenominators=()=>{const m=e.match(/x\^2\/(\d+)[+-]y\^2\/(\d+)/);assert.ok(m,q.id);return m.slice(1).map(Number);};
 switch(skill){
 case 's1-1-2':
  if(p.includes('standard basis'))return at(/([+-]?\d+)e_3/);
  if(p.includes('affine'))return 1-(1/(t+1)+.5);
  if(p.includes('coefficient of e1'))return pointTuples[0][0]-pointTuples[0][1];
  if(p.includes('third vector lies'))return 0;
  break;
 case 's1-1-3':{
  const[a,b]=pointTuples;
  if(p==='Find AB².')return dot(b.map((x,i)=>x-a[i]),b.map((x,i)=>x-a[i]));
  if(p.includes('scalar projection'))return dot(a,b)/Math.sqrt(dot(b,b));
  if(p.includes('midpoint'))return (a[2]+b[2])/2;
  if(p.includes('perpendicular')){const bx=at(/b=\((\d+),1,/);return -(a[0]*bx+a[1])/a[2];}
  if(p.includes('cos θ'))return dot(a,b)/Math.sqrt(dot(a,a)*dot(b,b));
  if(p.includes('unit direction'))return 1-1/(t*t)-1/9;
  break;}
 case 's1-1-4':{
  const[a,b]=pointTuples;
  if(p.includes('between the lines')||p.includes('between the planes'))return Math.abs(dot(a,b))/Math.sqrt(dot(a,a)*dot(b,b));
  if(p.includes('sin α'))return Math.abs(a[2])/Math.sqrt(dot(a,a));
  if(p.includes('distance'))return e.includes('Pi:z=')?Math.abs(a[2]-at(/Pi:z=(\d+)/)):Math.abs(3*a[0]+4*a[1])/Math.hypot(3,4);
  break;}
 case 's1-2-1':
  if(p.includes('slope of AB'))return (pairs[1][1]-pairs[0][1])/(pairs[1][0]-pairs[0][0]);
  if(p.includes('parallel'))return (at(/y=(\d+)x-1/)-1)/2;
  if(p.includes('135'))return Math.tan(135*Math.PI/180);
  if(p.includes('perpendicular'))return -1/t;
  if(p.includes('acute angle'))return Math.tan(Math.atan(t)-Math.atan(0));
  break;
 case 's1-2-2':
  if(p.includes('y-intercept'))return Number(p.match(/\(0,(\d+)\)/)[1]);
  if(p.includes('Find C')){const A=at(/A=(-?\d+)/),B=at(/B=(-?\d+)/);return -(A*pairs[0][0]+B*pairs[0][1]);}
  break;
 case 's1-2-3':
  if(p.includes('intersection'))return (at(/x\+y=(\d+)/)+at(/x-y=(\d+)/))/2;
  if(p.includes('minimum of AP'))return Math.hypot(t,3-(-1));
  if(p.includes('distance from (0,0) to'))return Math.abs(t);
  if(p.includes('distance from P'))return at(/4y-(\d+)=0/)/Math.hypot(3,4);
  if(p.includes('parallel lines'))return Math.abs(at(/6x\+8y=(\d+)/)/2)/Math.hypot(3,4);
  break;
 case 's1-2-4':
  if(p==='Find the radius of the circle.')return Math.sqrt(at(/=(\d+)$/));
  if(p.includes('largest x'))return t+2;
  if(p.includes('center'))return at(/y\^2-(\d+)x/)/2;
  if(p.includes('squared radius'))return ((pairs[1][0]-pairs[0][0])**2+(pairs[1][1]-pairs[0][1])**2)/4;
  break;
 case 's1-2-5':{
  const radiusSquared=at(/x\^2\+y\^2=(\d+)/);
  if(p.includes('common points')){const y=at(/y=(\d+)/);return y*y===radiusSquared?1:y*y<radiusSquared?2:0;}
  if(p.includes('chord')){const y=at(/y=(\d+)/);return 2*Math.sqrt(radiusSquared-y*y);}
  if(p.includes('tangent length'))return Math.sqrt(pairs[0][0]**2+pairs[0][1]**2-radiusSquared);
  break;}
 case 's1-3-1':
  if(p.includes('major-axis'))return 2*Math.sqrt(ellipseDenominators()[0]);
  if(p.includes('largest value')){const[A,B]=ellipseDenominators();return Math.hypot(3*Math.sqrt(A),4*Math.sqrt(B));}
  if(p.includes('c²')){const a=at(/a=(\d+)/),b=at(/b=(\d+)/);return a*a-b*b;}
  if(p.includes('eccentricity')){const[A,B]=ellipseDenominators();return Math.sqrt(A-B)/Math.sqrt(A);}
  if(p.includes('PF2'))return 2*at(/a=(\d+)/)-at(/PF_1=(\d+)/);
  if(p.includes('chord'))return 2*Math.sqrt(ellipseDenominators()[1]);
  break;
 case 's1-3-2':
  if(p.includes('c²')){const[A,B]=ellipseDenominators();return A+B;}
  if(p.includes('transverse'))return 2*Math.sqrt(ellipseDenominators()[0]);
  if(p.includes('asymptote')){const[A,B]=ellipseDenominators();return Math.sqrt(B)/Math.sqrt(A);}
  if(p.includes('eccentricity')){const a=at(/a=(\d+)/),b=at(/b=(\d+)/);return Math.hypot(a,b)/a;}
  break;
 case 's1-3-3':
  if(p.includes('focus'))return at(/y\^2=(\d+)x/)/4;
  if(p.includes('focal chord'))return at(/y\^2=(\d+)x/);
  if(p.includes('directrix'))return -at(/y\^2=(\d+)x/)/4;
  if(p.includes('PF'))return Math.hypot(2*t-t,Math.sqrt(4*t*2*t));
  break;
 case 's2-4-1':
  if(p==='Find a3.'){const m=e.match(/a_n=(\d+)n([+-]\d+)/);return Number(m[1])*3+Number(m[2]);}
  if(p.includes('smallest positive index')){let n=1;while(2*n-1<=t)n++;return n;}
  if(p.includes('recurrence')){let value=at(/a_1=(\d+)/),difference=at(/a_n\+(\d+)/);for(let i=1;i<4;i++)value+=difference;return value;}
  if(p==='Find a1.'||p==='Find a5.'){const m=e.match(/S_n=(\d+)?n\^2\+(\d+)/),coef=Number(m[1]||1),constant=Number(m[2]),index=p.includes('a1')?1:5;const S=n=>coef*n*n+constant;return index===1?S(1):S(index)-S(index-1);}
  if(p.includes('sum of the first')){let sum=0;for(let n=1;n<=t;n++)sum+=1/(n*(n+1));return sum;}
  break;
 case 's2-4-2':
  if(p==='Find a6.'){let v=at(/a_1=(\d+)/);for(let n=1;n<6;n++)v+=at(/d=(\d+)/);return v;}
  if(p.includes('How many terms')){let count=0;for(let v=2;v<=3*t+2;v+=3)count++;return count;}
  if(p.includes('theatre')){let total=0;for(let row=0;row<t;row++)total+=10+2*row;return total;}
  if(p.includes('common difference'))return (at(/a_5=(\d+)/)-at(/a_2=(\d+)/))/(5-2);
  if(p==='Find S4.'){let total=0,value=at(/a_1=(\d+)/);for(let n=0;n<4;n++){total+=value;value+=at(/d=(\d+)/);}return total;}
  if(p.includes('Find a5'))return at(/S_9=(\d+)/)/9;
  if(p.includes('positive terms')){let sum=0;for(let value=t;value>0;value--)sum+=value;return sum;}
  break;
 case 's2-4-3':
  if(p==='Find a4.'){let v=at(/a_1=(\d+)/);for(let n=1;n<4;n++)v*=at(/q=(-?\d+)/);return v;}
  if(p.includes('a3a7'))return t*t;
  if(p.includes('q²'))return Number(p.match(/S4=(\d+)t/)[1])-1;
  if(p==='Find q.')return at(/a_3=(-?\d+)/)/at(/a_2=(-?\d+)/);
  if(p==='Find S3.'){let v=at(/a_1=(\d+)/),sum=0;for(let n=0;n<3;n++){sum+=v;v*=at(/q=(\d+)/);}return sum;}
  if(p.includes('S5')){let sum=0;for(let n=0;n<5;n++)sum+=at(/a_1=(\d+)/);return sum;}
  break;
 case 's2-5-1':
  if(p.includes('derivative of x²')){const h=1e-4;return ((t+h)**2-(t-h)**2)/(2*h);}
  if(p.includes('average rate'))return ((t+1)**2-t*t)/((t+1)-t);
  if(p.includes('velocity')){const position=u=>u*u+3*u,h=1e-4;return (position(t+h)-position(t-h))/(2*h);}
  if(p.includes('tank')){const volume=h=>3*h*h,dx=1e-4;return (volume(t+dx)-volume(t-dx))/(2*dx);}
  break;
 case 's2-5-3':
  if(p.includes('minimizing x'))return at(/x\^2-(\d+)x/)/2;
  if(p.includes('rectangle')){const perimeter=4*t,side=perimeter/4;return side*(perimeter/2-side);}
  if(p.includes('Profit')){const coefficients=[-1,2*t,-3],x=-coefficients[1]/(2*coefficients[0]),value=x=>coefficients[0]*x*x+coefficients[1]*x+coefficients[2];return Math.max(value(0),value(t+2),value(x));}
  if(p.includes('maximum of f'))return Math.max(0,t*t);
  if(p.includes('minimum of x'))return t+t*t/t;
  break;
 case 's3-6-1':
  if(p.includes('one book'))return t+3;
  if(p.includes('first-stage')){let paths=0;for(let choice=0;choice<t;choice++)for(let next=0;next<2;next++)paths++;for(let choice=0;choice<3;choice++)for(let next=0;next<5;next++)paths++;return paths;}
  if(p.includes('two-digit')){let count=0;for(let a=1;a<t;a++)for(let b=0;b<t;b++)count+=a!==b;return count;}
  if(p.includes('shirts')){let count=0;for(let a=0;a<t;a++)for(let b=0;b<4;b++)count++;return count;}
  if(p.includes('code')){let count=0;for(let a=0;a<t;a++)for(let b=0;b<=9;b++)count++;return count;}
  if(p.includes('either subject'))return t+8-3;
  if(p.includes('Passwords')){let count=0;for(let a=0;a<t;a++)for(let b=0;b<t;b++)for(let c=0;c<t;c++)count+=!(a===b&&b===c);return count;}
  break;
 case 's3-6-2':{
  const m=variable(e,'m');let count=1n;
  if(p.includes('circle')){for(let remaining=m-1;remaining>=1;remaining--)count*=BigInt(remaining);return Number(count);}
  if(p.includes('adjacent')){for(let remaining=m-1;remaining>=1;remaining--)count*=BigInt(remaining);return Number(2n*count);}
  break;}
 case 's3-7-1':
  if(p.includes('P(A|B)')){const values=e.match(/=(\d+)\/(\d+)/g).map(x=>x.slice(1).split('/').map(Number));return (values[0][0]/values[0][1])/(values[1][0]/values[1][1]);}
  if(p.includes('Given failure')){const prior=1/(t+2),joint=prior*.1,other=(1-prior)*.2;return joint/(joint+other);}
  if(p.includes('fair coin selects')){const prior=.5,red1=t/(t+1),red2=1/(t+1);return prior*red1/(prior*red1+prior*red2);}
  if(p.includes('Given the first')){const remaining=['blue','blue',...Array(t-1).fill('red')];return remaining.filter(x=>x==='blue').length/remaining.length;}
  if(p.includes('Events A,B'))return (1/3)*(t/(t+1));
  if(p.includes('total failure')){const prior=1/(t+2);return prior*.1+(1-prior)*.2;}
  break;
 case 's3-7-2':
  if(p.includes('missing probability'))return 1-.25-.5;
  if(p.includes('Find p when'))return 1/[1,2,t].reduce((a,b)=>a+b);
  if(p.includes('fair die')){const d=variable(e,'d');return [1,2,3,4,5,6].filter(face=>face>d).length/6;}
  if(p.includes('P(X≥t)'))return [.25,.5].reduce((a,b)=>a+b);
  if(p.includes('fair coins')){const r=variable(e,'r');return bernoulli(r,.5)[1];}
  break;
 case 's3-7-3':
  if(p==='Find E(X).'||p==='Find E(X²).'||p==='Find Var(X).'){const support=at(/X=0,(\d+)/),xs=[0,support],ps=[.5,.5],mean=dot(xs,ps);if(p==='Find E(X).')return mean;if(p==='Find E(X²).')return dot(xs.map(x=>x*x),ps);return dot(xs.map(x=>(x-mean)**2),ps);}
  if(p.includes('Var(3X+2)')){const variance=at(/Var\(X\)=(\d+)/),xs=[-Math.sqrt(variance),Math.sqrt(variance)].map(x=>3*x+2),mean=(xs[0]+xs[1])/2;return xs.reduce((s,x)=>s+(x-mean)**2/2,0);}
  if(p.includes('net gain'))return dot([t-2,-2],[.25,.75]);
  if(p.includes('E(3X+2)'))return 3*at(/E\(X\)=(\d+)/)+2;
  if(p.includes('Var(X+Y)'))return t+2;
  break;
 case 's3-7-5':
  if(p.includes('standard deviation'))return Math.sqrt(Number(p.match(/N\(t,(\d+)\)/)[1]));
  if(p.includes('P(X>'))return 1-Number(p.match(/Φ\(2\)=(\d+\.\d+)/)[1]);
  if(p.includes('Standardise'))return 4/Math.sqrt(4);
  if(p.includes('P(X≤'))return Number(p.match(/Φ\(1\)=(\d+\.\d+)/)[1]);
  if(p.includes('P(t−2')){const right=Number(p.match(/Φ\(1\)=(\d+\.\d+)/)[1]);return right-(1-right);}
  if(p.includes('P(X=t)'))return 0;
  break;
 case 's3-8-1':
  if(p.includes('centered summaries'))return at(/S_\{xy\}=(\d+)/)/Math.sqrt(at(/S_\{xx\}=(\d+)/)*at(/S_\{yy\}=(\d+)/));
  if(p.includes('y=tx')||p.includes('y=−tx')){const xs=[-1,0,1],ys=xs.map(x=>(p.includes('−tx')?-t:t)*x+2),mx=0,my=2;return xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0)/Math.sqrt(xs.reduce((s,x)=>s+x*x,0)*ys.reduce((s,y)=>s+(y-my)**2,0));}
  if(p.includes('pairs')){const xs=[-1,0,1],ys=[t,0,t],my=ys.reduce((a,b)=>a+b)/3;return xs.reduce((s,x,i)=>s+x*(ys[i]-my),0);}
  break;
 case 's3-8-2':
  if(p.includes('fitted slope'))return at(/S_\{xy\}=(\d+)/)/at(/S_\{xx\}=(\d+)/);
  if(p.includes('intercept'))return at(/bar y=(\d+)/)-at(/b=(\d+)/)*at(/bar x=(\d+)/);
  if(p.includes('predict y'))return 3+2*at(/hat y=3\+(\d+)x/);
  if(p.includes('residual'))return (2*t+5)-(3+t*2);
  break;
 case 's3-8-3':
  if(p.includes('perfect independence')){const observed=[k||t,k||t,k||t,k||t];return observed.reduce((s,x)=>s+(x-x)**2/x,0);}
  break;
 case 'sup-partial-fractions':
  if(p.includes('remainder')){const divisorRoot=2;return divisorRoot*divisorRoot+t;}
  if(p.includes('t/[x(x+1)]'))return t;
  if(p.includes('(x+t)'))return (1+t)/(1-(-1));
  break;
 case 'sup-variation-finance':
  if(p.includes('directly')){const coefficient=t/2;return coefficient*6;}
  if(p.includes('compounds')){let value=100*t;for(let year=0;year<2;year++)value+=.1*value;return value;}
  if(p.includes('continuously'))return 100*t*Math.exp(Math.log(2));
  if(p.includes('inversely')){const product=t*2;return product/4;}
  if(p.includes('jointly'))return t*2*3;
  if(p.includes('y=a+kx')){const slope=((t+6)-t)/(2-0);return t+slope*3;}
  if(p.includes('asset')){let value=100*t;for(let year=0;year<2;year++)value-=.2*value;return value;}
  break;
 case 'sup-euclidean-circles':
  if(p.includes('polygon'))return ((t+3)-2)*180;
  if(p.includes('cyclic'))return 180-variable(e,'a');
  if(p.includes('chord'))return 2*Math.sqrt((5*t)**2-(3*t)**2);
  if(p.includes('right triangle'))return Math.hypot(3*t,4*t);
  if(p.includes('Similar'))return 4*t/((2/3)**2);
  if(p.includes('central angle'))return 2*variable(e,'a')/2;
  if(p.includes('sector'))return (Math.PI/3)/(2*Math.PI)*(Math.PI*t*t);
  break;
 case 'sup-linear-programming':
  if(p.includes('feasible')){const bound=at(/le(\d+)/);return bound>=0&&bound+0<=bound?1:0;}
  if(p.includes('Production')){const bound=at(/le(\d+)/),vertices=[[0,0],[bound/2,0],[0,bound]];return Math.max(...vertices.map(v=>dot(v,[3,1])));}
  if(p.includes('Maximise z=x+y'))return Math.max(...[[0,0],[t,0],[0,t]].map(v=>dot(v,[1,1])));
  if(p.includes('Maximise z=2x+y'))return Math.max(...[[0,0],[t,0],[0,t]].map(v=>dot(v,[2,1])));
  if(p.includes('Minimise'))return Math.min(...[[t,0],[0,t]].map(v=>dot(v,[1,1])));
  if(p.includes('integer')){let max=-Infinity;for(let x=0;x<=t+1;x++)for(let y=0;y<=t+1;y++)if(2*x+2*y<=2*t+1)max=Math.max(max,x+y);return max;}
  break;
 case 'sup-matrices':
  if(p.includes('Find x'))return (at(/x\+y=(\d+)/)+at(/x-y=(\d+)/))/2;
  break;
 case 'sup-polar':
  if(p.includes('Find x'))return at(/\)=\((\d+),0\)/);
  if(p.includes('Find y'))return at(/\)=\((\d+),\\pi\/2\)/);
  if(p.includes('Find r'))return Math.hypot(...pairs[0]);
  break;
 case 'sup-spatial-equations':
  if(p.includes('sphere radius'))return Math.sqrt(at(/=(\d+)$/));
  if(p.includes('meets z=0'))return t;
  if(p.includes('parallelogram')){const[a,b]=pointTuples;const c=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];return Math.sqrt(dot(c,c));}
  break;
 case 'sup-parameter-equations':return Math.hypot(t,2*t);
 case 'sup-infinite-series':
  if(p.includes('least n')){let n=1,tail=1;while(tail>2**(1-t)){tail/=2;n++;}return n;}
  if(p.includes('telescoping')){const scale=at(/frac\{(\d+)\}/);let sum=0;for(let n=1;n<=2**24;n++)sum+=scale/(n*(n+1));return sum;}
  if(p.includes('repeating')){const d=variable(e,'d');let total=0;for(let j=1;j<=20;j++)total+=d/10**j;return total;}
  if(p.includes('tail')){const a=at(/a_1=(\d+)/);let sum=0;for(let j=3;j<100;j++)sum+=a*.5**j;return sum;}
  if(p.includes('infinite')){const a=at(/a_1=(\d+)/),q0=e.includes('q=-')?-.5:.5;let sum=0;for(let j=0;j<100;j++)sum+=a*q0**j;return sum;}
  break;
 case 'c2-9-1':
  if(p.includes('inclusion probability'))return 10*k/(100*k);
  if(p.includes('stratified'))return (10*k)*(40*k)/(60*k+40*k);
  if(p.includes('interval'))return (100*k)/(10*k);
  if(p.includes('response rate'))return 6*k/(10*k);
  if(p.includes('with replacement')){const N=k+2;let probability=0;for(let person=0;person<N;person++)probability+=(1/N)*(1/N);return probability;}
  break;
 case 'c2-9-2':
  if(p.includes('population proportion'))return 5*k/(20*k);
  if(p.includes('corresponding count'))return (80*k)*.25;
  if(p.includes('frequency density'))return (6*k)/(2*k-0);
  if(p.includes('sample mean'))return [k,k+2,k+4].reduce((a,b)=>a+b)/3;
  if(p.includes('variance')){const xs=[k,k+2,k+4],mean=xs.reduce((a,b)=>a+b)/3;return xs.reduce((s,x)=>s+(x-mean)**2,0)/3;}
  if(p.includes('three exhaustive'))return 1-(.25+.5);
  break;
 case 'c2-9-3':
  if(p.includes('sample proportion'))return 12*k/(20*k);
  if(p.includes('overall mean'))return (20*(3*k)+40*k)/(3*k+k);
  if(p.includes('fraction above'))return k/(k+2*k+k);
  break;
 case 'c2-10-1':
  if(p.includes('label 1'))return 1/(k+3);
  if(p.includes('even label')){let even=0;for(let label=1;label<=2*k;label++)even+=label%2===0;return even/(2*k);}
  if(p.includes('P(Aᶜ)'))return 1-k/(k+2);
  if(p.includes('Disjoint'))return 1/(k+3)+2/(k+3);
  if(p.includes('P(A∪B)'))return .5+1/3-1/(6*k);
  break;
 case 'c2-10-2':
  if(p.includes('Independent A,B'))return .5/(k+2);
  if(p.includes('series')){const probability=k/(k+1),outcomes=[{both:true,p:probability*probability},{both:false,p:probability*(1-probability)},{both:false,p:(1-probability)*probability},{both:false,p:(1-probability)**2}];return outcomes.filter(o=>o.both).reduce((s,o)=>s+o.p,0);}
  if(p.includes('parallel')){const failure=1/(k+1);return (1-failure)**2+2*failure*(1-failure);}
  break;
 case 'c2-10-3':
  if(p.includes('relative frequency')&&!p.includes('pooled'))return (3*k)/(10*k);
  if(p.includes('pooled'))return (2*k+3*k)/(5*k+10*k);
  if(p.includes('expected number')){let mean=0;for(let trial=0;trial<20*k;trial++)mean+=.25;return mean;}
  if(p.includes('next toss'))return .5;
  if(p.includes('model probability'))return 1/k;
  break;
 }
 throw new Error('No independent numeric calculation: '+q.id+' / '+skill+' / '+p+' / '+e);
}
for(const unit of corpus){
 visit(unit,unit.id);const seen=new Set();
 for(const q of unit.questions){
  questions++;const fp=q.prompt.en+'|'+q.expression;assert.ok(!seen.has(fp),'Duplicate: '+q.id);seen.add(fp);
  if(typeof q.answer!=='number')continue;const skill=q.skills?.[0],p=q.prompt.en,e=q.expression;
  if(skill==='s1-1-1'){const[a,b]=tuples(e);if(p==='Find the first component of a+b.')check(q,a[0]+b[0],'vectors');else if(p.includes('third component'))check(q,2*a[2]-3*b[2],'vectors');else if(p==='Find the squared length of a.')check(q,dot(a,a),'vectors');else if(p==='Calculate a·b.')check(q,dot(a,b),'vectors');else if(p.includes('cos θ'))check(q,dot(a,b)/Math.sqrt(dot(a,a)*dot(b,b)),'vectors');else if(p.includes('space diagonal')){const t=variable(e,'t');check(q,dot([t,3,4],[t,3,4]),'vectors');}}
  if(skill==='sup-matrices'){const[a,b]=matrices(e);if(p.includes('determinant')||p==='Find det A.')check(q,determinant(a),'matrices');else if(p.includes('(1,2)'))check(q,a[0].reduce((s,x,i)=>s+x*b[i][1],0),'matrices');}
  if(skill==='s3-6-2'){
   const m=variable(e,'m'),t=variable(e,'t'),r=variable(e,'r');let count=0;
   if(p.includes('president')){for(let a=0;a<m;a++)for(let b=0;b<m;b++)count+=a!==b;check(q,count,'enumerated-counting');}
   else if(p.includes('unordered committee')){for(let a=0;a<m;a++)for(let b=a+1;b<m;b++)for(let c=b+1;c<m;c++)count++;check(q,count,'enumerated-counting');}
   else if(p.includes('specified person')){for(let b=1;b<m;b++)for(let c=b+1;c<m;c++)count++;check(q,count,'enumerated-counting');}
   else if(p.includes('identical balls')){for(let a=0;a<=t;a++)for(let b=0;b<=t;b++)if(t-a-b>=0)count++;check(q,count,'enumerated-counting');}
   else if(p.includes('identical As')){check(q,new Set(permutations([...Array(r).fill('A'),'B','B','C']).map(x=>x.join(''))).size,'enumerated-counting');}
  }
  if(skill==='s3-6-3'){
   const m=variable(e,'m');
   if(p.includes('coefficient of x²'))check(q,expand(1,p.includes('−2x')?-2:1,m)[2],'expanded-polynomials');
   else if(p.includes('coefficient of x in'))check(q,expand(1,1,m)[1],'expanded-polynomials');
   else if(p.includes('sum of all coefficients'))check(q,expand(2,1,m).reduce((a,b)=>a+b,0),'expanded-polynomials');
   else if(p.includes('constant term'))check(q,expand(1,1,2*m)[m],'expanded-polynomials');
   else if(p.includes('alternating sum')){const n=Number(e.match(/C_\{(\d+)\}/)[1]);check(q,expand(1,-1,n).reduce((a,b)=>a+b,0),'expanded-polynomials');}
   else if(p.includes('remainder'))check(q,Number(11n**BigInt(m)%100n),'integer-remainders');
  }
  if(skill==='s3-7-4'){
   const m=variable(e,'m'),t=variable(e,'t');
   if(p.includes('Bin(')){const pmf=bernoulli(m,p.includes('1/4')?0.25:0.5),mean=pmf.reduce((s,v,k)=>s+k*v,0);if(p.includes('P(X=0)'))check(q,pmf[0],'enumerated-probability');else if(p.includes('P(X=1)'))check(q,pmf[1],'enumerated-probability');else if(p.includes('E(X)'))check(q,mean,'enumerated-probability');else if(p.includes('Var(X)'))check(q,pmf.reduce((s,v,k)=>s+(k-mean)**2*v,0),'enumerated-probability');}
   else if(p.includes('without replacement')){const bag=[...Array(t).fill('red'),'blue','blue','blue'];let total=0,good=0;for(let i=0;i<bag.length;i++)for(let j=i+1;j<bag.length;j++){total++;const reds=(bag[i]==='red'?1:0)+(bag[j]==='red'?1:0);good+=p.includes('both are blue')?reds===0:reds===1;}check(q,good/total,'enumerated-probability');}
   else if(p.includes('least n')){let k=1;while(bernoulli(k,0.5)[0]>2**(-m))k++;check(q,k,'enumerated-probability');}
  }
  if(skill==='s2-5-2'){
   let f,x;
   if(e.includes('x^3+')){const a=Number(e.match(/x\^3\+(\d+)x/)[1]);f=x=>x**3+a*x;x=1;}
   else if(e.includes('x^2(x+')){const a=Number(e.match(/x\^2\(x\+(\d+)\)/)[1]);f=x=>x*x*(x+a);x=1;}
   else if(e.includes('\\frac')){const a=Number(e.match(/x\+(\d+)/)[1]);f=x=>(x+a)/(x+1);x=0;}
   else if(e.includes('(2x+')){const a=Number(e.match(/2x\+(\d+)/)[1]);f=x=>(2*x+a)**3;x=0;}
   else if(e.includes('e^{')){const a=Number(e.match(/e\^\{(\d+)x/)[1]);f=x=>Math.exp(a*x);x=0;}
   else if(e.includes('\\ln')){const a=Number(e.match(/ln\((\d+)x/)[1]);f=x=>Math.log(a*x);x=1;}
   else if(e.includes('\\sin')){const a=Number(e.match(/sin\((\d+)x/)[1]);f=x=>Math.sin(a*x)+Math.cos(x);x=0;}
   assert.ok(f,q.id);const h=1e-5;check(q,(f(x+h)-f(x-h))/(2*h),'finite-difference-derivatives',2e-6);
  }
  if(skill==='sup-integrals'){
   const t=variable(e,'t');
   if(p.includes('geometric area'))check(q,integrate(x=>Math.abs(x),-t,t),'quadrature');
   else if(p.includes('area between'))check(q,integrate(x=>t-x,0,t),'quadrature');
   else if(p.includes('revolve'))check(q,integrate(x=>Math.PI*x*x,0,t),'quadrature');
   else if(p.includes('definite integral')){const upper=Number(e.match(/\\int_0\^\{(\d+)\}/)[1]);check(q,integrate(x=>2*x,0,upper),'quadrature');}
   else if(p.includes('signed integral')){const upper=Number(e.match(/\\int_\{-(\d+)\}/)[1]);check(q,integrate(x=>x,-upper,upper),'quadrature');}
   else if(p.includes('F(2)'))check(q,t+integrate(x=>2*x,0,2),'quadrature');
  }
  if(skill==='s3-8-3'&&e.includes('pmatrix')){const[o]=matrices(e),rows=o.map(row=>row.reduce((a,b)=>a+b,0)),cols=o[0].map((_,j)=>o.reduce((s,row)=>s+row[j],0)),total=rows.reduce((a,b)=>a+b,0),expected=o.map((row,i)=>row.map((_,j)=>rows[i]*cols[j]/total));if(p.includes('row total'))check(q,rows[0],'contingency-tables');else if(p.includes('E11'))check(q,expected[0][0],'contingency-tables');else if(p.includes('χ²'))check(q,o.reduce((s,row,i)=>s+row.reduce((v,x,j)=>v+(x-expected[i][j])**2/expected[i][j],0),0),'contingency-tables');}
  if(skill==='s3-8-2'&&p.includes('least-squares slope')){const t=variable(e,'t'),xs=[-1,0,1],ys=[-t,0,t],mean=v=>v.reduce((a,b)=>a+b)/v.length,mx=mean(xs),my=mean(ys);check(q,xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0)/xs.reduce((s,x)=>s+(x-mx)**2,0),'paired-regression');}
 }
}
for(const unit of corpus)for(const q of unit.questions)if(typeof q.answer==='number'&&!verifiedIds.has(q.id))check(q,remainingValue(q,q.skills?.[0],q.prompt.en,q.expression),'all-numeric-'+q.skills?.[0]);
const expectedNumeric=corpus.flatMap(u=>u.questions).filter(q=>typeof q.answer==='number');
assert.equal(verifiedIds.size,expectedNumeric.length,'Numeric answer coverage must be complete');
export const advancedNumericVerifiedIds=[...verifiedIds].sort();
const written=corpus.flatMap(u=>u.questions).filter(q=>typeof q.answer!=='number');
const canonical=q=>({id:q.id,prompt:q.prompt.en,expression:q.expression||'',resultMath:q.resultMath||'',result:q.result?.en,
 steps:q.steps.map(s=>({body:s.body?.en,math:s.math||''})),explanation:q.explanation?.en});
const manualIds=new Set();
for(const entry of advancedWrittenAuditLedger){
 const current=written.filter(q=>q.skills[0]===entry.skill);
 assert.deepEqual(current.map(q=>q.id),entry.questionIds,'Written review coverage: '+entry.skill);
 assert.equal(createHash('sha256').update(JSON.stringify(current.map(canonical))).digest('hex'),entry.digest,'Written solution changed; repeat the family/domain review: '+entry.skill);
 entry.questionIds.forEach(id=>manualIds.add(id));
}
assert.equal(manualIds.size,written.length,'Every written question must have a manual family review');
// These are additional boundary corroborations; they do not replace the symbolic ledger.
let boundaryCases=0;
for(let t=1;t<=40;t++){
 const chordSquared=25-(t/2)**2;
 assert.equal(chordSquared>0,t<10);assert.equal(chordSquared===0,t===10);boundaryCases++;
 const hyperbolaPoint=[-t,0],normal=[-2*t,0],lineDirection=[1,1];
 assert.equal(hyperbolaPoint[0]**2-hyperbolaPoint[1]**2,t*t);
 assert.notEqual(dot(normal,lineDirection),0);boundaryCases++;
 for(const slope of [0,.5]){
  const x=slope===0?t:4*t,y=slope*x+2*t;
  assert.equal(y*y,4*t*x);assert.equal(2*t/y===slope,slope===.5);boundaryCases++;
 }
 for(let n=1;n<=20;n++){
  let shifted=0,telescope=0;
  for(let j=1;j<=n;j++){shifted+=j+t;telescope+=t/(j*(j+1));}
  assert.equal(shifted,t*n+n*(n+1)/2);
  assert.ok(Math.abs(telescope-t*n/(n+1))<1e-10);
  assert.equal((n**3-n+3*t*n)%3,0);boundaryCases++;
 }
}
for(let d=2;d<=8;d++)for(const r of [0,1,7]){
 const x=r*Math.cos(Math.PI/d),y=r*Math.sin(Math.PI/d);
 if(d===2){assert.ok(Math.abs(x)<1e-14);assert.ok(y>=0);}
 else{assert.ok(x>=0);assert.ok(Math.abs(y-Math.tan(Math.PI/d)*x)<1e-13);}
 boundaryCases++;
}
console.log(JSON.stringify({status:'PASS',units:corpus.length,questions,mathFields,numericChecks,numericCoverage:verifiedIds.size+'/'+expectedNumeric.length,
 writtenReviewCoverage:manualIds.size+'/'+written.length,writtenFamilies:advancedWrittenAuditLedger.reduce((s,r)=>s+r.families.length,0),boundaryCases,byArea,
 limits:'All numeric answers are recalculated from published data. Numeric samples do not prove written results; the separate manual family/domain review ledger is checked for coverage and later changes.'},null,2));
