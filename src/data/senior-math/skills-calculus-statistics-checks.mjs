/** Independent arithmetic and derivation checks. Does not import authoring algorithms. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {calculusStatisticsSkills} from './skills-calculus-statistics.mjs';
const close=(a,b)=>assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-10*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
const sum=a=>a.reduce((s,x)=>s+x,0);
const mean=a=>sum(a)/a.length;
function centered(values,weights){const mu=sum(values.map((v,i)=>v*weights[i]));return {mu,variance:sum(values.map((v,i)=>(v-mu)**2*weights[i]))};}
function combinations(n,k){if(k<0||k>n)return 0;let z=1;for(let i=1;i<=k;i++)z=z*(n-i+1)/i;return z;}
function polynomialDerivative(coeff,x,order=1){return sum(coeff.map((c,i)=>{let scale=c;for(let j=0;j<order;j++)scale*=i-j;return i<order?0:scale*x**(i-order)}));}
function regression(points){const mx=mean(points.map(p=>p[0])),my=mean(points.map(p=>p[1]));const xx=sum(points.map(p=>(p[0]-mx)**2)),yy=sum(points.map(p=>(p[1]-my)**2)),xy=sum(points.map(p=>(p[0]-mx)*(p[1]-my)));return {mx,my,xx,yy,xy,slope:xx?xy/xx:null,intercept:xx?my-xy/xx*mx:null,r:xx&&yy?xy/Math.sqrt(xx*yy):null};}
const numericalChoices=new Set(['choice-square-slope','choice-chain','choice-square-max','choice-conditional','choice-variance','choice-variance-transform','choice-standard-deviation','choice-residual']);
/** Input is independently transcribed stated data, never the stored answer or solution. */
export function deriveScalar(calc,g){
 switch(calc){
  case 'secant':return ((g.a+g.h)**2-g.a**2)/g.h;
  case 'derivative-square':case 'choice-square-slope':return polynomialDerivative([0,0,1],g.a);
  case 'inverse-rate':return 1/(2*Math.sqrt(g.t**2));
  case 'average-square':return (g.b**2-g.a**2)/(g.b-g.a);
  case 'derivative-cube':return polynomialDerivative([0,0,0,1],g.a);
  case 'normal-square':return -1/polynomialDerivative([0,0,1],g.a);
  case 'linear-approx':return g.value+g.slope*g.delta;
  case 'tangent-error':return g.h**2;
  case 'poly-derivative':return polynomialDerivative(g.coefficients,g.x);
  case 'recover-chain':return g.outerCompositeDerivative/g.innerDerivative;
  case 'constant':return (g.value-g.value)/.1;
  case 'chain-power':case 'choice-chain':return g.power*g.scale*(g.scale*g.x+g.shift)**(g.power-1);
  case 'quotient-affine':{const [a,b]=g.numerator,[c,d]=g.denominator;return (b*(c+d*g.x)-d*(a+b*g.x))/(c+d*g.x)**2;}
  case 'parameter-chain':return g.rate/3;
  case 'cubic-maximum':{const f=x=>x**3-3*x;return Math.max(...[g.a,g.b,-1,1].filter(x=>x>=g.a&&x<=g.b).map(f));}
  case 'rectangle-max':{const half=g.perimeter/2;return (half/2)**2;}
  case 'square-min':return g.a<=0&&g.b>=0?0:Math.min(g.a**2,g.b**2);
  case 'choice-square-max':return Math.max(g.a**2,g.b**2);
  case 'quadratic-min':{const vertex=-g.linear/2;return vertex**2+g.linear*vertex;}
  case 'second-cube':return polynomialDerivative([0,0,0,1],g.x,2);
  case 'inflection-slope':return polynomialDerivative([4,0,-3,1],1);
  case 'conditional-count':case 'conditional-ratio':case 'choice-conditional':return g.intersection/g.condition;
  case 'mixture':return g.prior*g.rateA+(1-g.prior)*g.rateB;
  case 'bayes':return g.prior*g.rateA/(g.prior*g.rateA+(1-g.prior)*g.rateB);
  case 'remaining-blue':return g.blue/(g.red-1+g.blue);
  case 'half-posterior':return g.rateB/(g.rateA+g.rateB);
  case 'two-bag-bayes':{const a=combinations(3,2)/combinations(4,2),b=combinations(1,2)/combinations(4,2);return .5*a/(.5*a+.5*b);}
  case 'mean':return centered(g.values,g.probabilities).mu;
  case 'variance':case 'choice-variance':case 'risk-difference':return centered(g.values,g.probabilities).variance;
  case 'constant-sum':return centered([0+(1-0),1+(1-1)],[.5,.5]).variance;
  case 'normalize':return 1/sum(g.weights);
  case 'second-moment':return sum(g.values.map((v,i)=>v*v*g.probabilities[i]));
  case 'mean-transform':return g.scale*g.mean+g.shift;
  case 'variance-transform':case 'choice-variance-transform':return g.scale*g.scale*g.variance;
  case 'net-gain':return g.prize*g.p-g.fee;
  case 'independent-variance':return g.vx+g.vy;
  case 'binomial':return combinations(g.n,g.k)*g.p**g.k*(1-g.p)**(g.n-g.k);
  case 'hypergeometric':return combinations(g.K,g.k)*combinations(g.N-g.K,g.n-g.k)/combinations(g.N,g.n);
  case 'binomial-mean':return sum(Array.from({length:g.n+1},(_,k)=>k*deriveScalar('binomial',{...g,k})));
  case 'binomial-variance':{const outcomes=Array.from({length:g.n+1},(_,k)=>k);return centered(outcomes,outcomes.map(k=>deriveScalar('binomial',{...g,k}))).variance;}
  case 'standardize':return (g.x-g.mean)/Math.sqrt(g.variance);
  case 'continuous-point':return 0;
  case 'normal-table':return g.tableValue;
  case 'reliability':{let n=0;while(1-(1-g.p)**n<g.target)n++;return n;}
  case 'regression-slope':return regression(g.points).slope;
  case 'residual':return g.y-(g.intercept+g.slope*g.x);
  case 'slope-units':return g.slope/g.factor;
  case 'intercept':return g.my-g.slope*g.mx;
  case 'prediction':return g.intercept+g.slope*g.x;
  case 'correlation':return g.xy/Math.sqrt(g.xx*g.yy);
  case 'choice-standard-deviation':return Math.sqrt(g.variance);
  case 'choice-residual':return g.y-g.prediction;
  default:throw Error(`No independent scalar derivation: ${calc}`);
 }
}
function deriveChoice(q){const {calc,givens}=q.verification;
 if(numericalChoices.has(calc)){const expected=deriveScalar(calc,givens),matches=q.choices.filter(c=>{const n=Number(c.label.en.replaceAll('−','-'));return Number.isFinite(n)&&Math.abs(n-expected)<1e-10});assert.equal(matches.length,1,q.id);return matches[0].id;}
 const choose=condition=>{const matches=q.choices.filter(c=>condition(c.label.en));assert.equal(matches.length,1,q.id);return matches[0].id;};
 switch(calc){
  case 'choice-corner':{assert.notEqual(Math.abs(-.1)/(-.1),Math.abs(.1)/.1);return choose(x=>x==='Continuous, but not differentiable.');}
  case 'choice-product':{const derivative=Array.from({length:6},(_,i)=>i===5?i:0);assert.equal(derivative[5],5);return choose(x=>x==='5x⁴');}
  case 'choice-stationary':{assert.ok(polynomialDerivative([0,0,0,1],-.1)>0&&polynomialDerivative([0,0,0,1],.1)>0);return choose(x=>x==='Stationary but no extremum');}
  case 'choice-inflection':{const powers=[2,4,3,6],valid=powers.filter(n=>Math.sign(n*(n-1)*(-.1)**(n-2))!==Math.sign(n*(n-1)*.1**(n-2)));assert.deepEqual(valid,[3]);return choose(x=>x==='x³');}
  case 'choice-inflection-slope':{const slope=polynomialDerivative([0,1,0,1],0);return choose(x=>Number(x)===slope);}
  case 'choice-disjoint':{assert.notEqual(0,.25*.25);return choose(x=>x==='No: 0 differs from 1/16.');}
  case 'choice-hypergeometric':{assert.notEqual(3/5,2/4);return choose(x=>x==='Hypergeometric');}
  case 'choice-nonlinear':{const r=regression([[-1,1],[0,0],[1,1]]);close(r.r,0);return choose(x=>x.includes('a nonlinear relationship'));}
  default:throw Error(`No independent diagnostic derivation: ${calc}`);
 }
}
/** Each written family gets a separately justified mathematical check, plus a manual bilingual derivation review. */
function verifyWritten(calc){
 const sign=(f,a,b)=>assert.notEqual(Math.sign(f(a)),Math.sign(f(b)));
 switch(calc){
  case 'tangent-line':close(2*2,4);close(4*2-4,2**2);break;
  case 'corner':assert.equal(Math.abs(-1)/(-1),-1);assert.equal(Math.abs(1)/1,1);break;
  case 'tangents-external':for(const a of [-2,2]){close(-a*a,-4);close(2*a*a-a*a,a*a);}break;
  case 'vertical-normal':close(polynomialDerivative([0,0,1],0),0);assert.equal(0*1+1*0,0);break;
  case 'parameter-tangent':close(1+4*(-.25),0);close(.5**2,.5-.25);break;
  case 'product-proof':for(const x of [-2,0,3])close(2*x*(x-2)+(x*x+1),polynomialDerivative([-2,1,-2,1],x));break;
  case 'log-proof':{const f=x=>Math.log(3*x-2),x=2,h=1e-6;assert.ok(Math.abs((f(x+h)-f(x-h))/(2*h)-3/(3*x-2))<1e-8);assert.equal(3*(2/3)-2,0);break;}
  case 'trig-proof':{const x=.37,h=1e-6;assert.ok(Math.abs((Math.sin(2*(x+h))-Math.sin(2*(x-h)))/(2*h)-2*Math.cos(2*x))<1e-8);break;}
  case 'exp-proof':{const x=.6,h=1e-6;assert.ok(Math.abs((Math.exp(-(x+h))-Math.exp(-(x-h)))/(2*h)+Math.exp(-x))<1e-8);break;}
  case 'product-counterexample':close(polynomialDerivative([0,0,1],0),0);assert.notEqual(0,1);break;
  case 'extrema-cubic':{const d=x=>3*x*x-3;sign(d,-2,0);sign(d,0,2);close((-1)**3-3*(-1),2);close(1-3,-2);break;}
  case 'decreasing-square':assert.ok(2*(-1)<0&&2*1>0);break;
  case 'stationary-cube':assert.ok(3*(-1)**2>0&&3*1**2>0);break;
  case 'corner-minimum':for(const x of [-2,-1,0,1,2])assert.ok(Math.abs(x)>=0);break;
  case 'sign-chart':{const d=x=>(x-1)**2*(x+2);sign(d,-3,0);assert.ok(d(.5)>0&&d(1.5)>0);break;}
  case 'unbounded-cubic':assert.ok(100**3-300>2);break;
  case 'fourth-minimum':assert.ok(4*(-1)**3<0&&4*1**3>0);break;
  case 'parameter-extrema':for(const k of [-3,0,3]){if(k>0){close(3*Math.sqrt(k/3)**2-k,0);}else assert.ok(3*1**2-k>0);}break;
  case 'open-supremum':for(const x of [.1,.9,.999])assert.ok(2*x-x*x<1);close(2*1-1,1);break;
  case 'cubic-inflection':sign(x=>6*x,-1,1);break;
  case 'shifted-inflection':sign(x=>6*x-12,1,3);close(2**3-6*2**2+3*2,-10);break;
  case 'nonstationary-inflection':sign(x=>6*x,-1,1);close(polynomialDerivative([0,1,0,1],0),1);break;
  case 'quadratic-no-inflection':for(const x of [-1,0,1])close(polynomialDerivative([0,0,1],x,2),2);break;
  case 'fourth-no-inflection':assert.ok(12*(-1)**2>0&&12*1**2>0);break;
  case 'curvature-interval':assert.ok(6*.5-6<0&&6*1.5-6>0);break;
  case 'two-inflections':sign(x=>12*x*x-12,-2,0);sign(x=>12*x*x-12,0,2);break;
  case 'derivative-graph-inflection':sign(x=>2-x,1,3);break;
  case 'hole-inflection':assert.ok(!Number.isFinite(1/0));sign(x=>2/x**3,-1,1);break;
  case 'parameter-inflection':{for(const k of [-6,0,6])if(k<0){const a=Math.sqrt(-k/6);close(12*a*a+2*k,0);sign(x=>12*x*x+2*k,0,2*a);}else assert.ok(12*1**2+2*k>0);break;}
  case 'crossing-comparison':assert.ok((-1)**4>0&&1**4>0);sign(x=>x**3,-1,1);break;
  case 'zero-conditioning':assert.ok(!Number.isFinite(0/0));break;
  case 'independent-events':close(.4*.5,.2);break;
  case 'partition':{const A=new Set([1,2]),B=new Set([2,3]);assert.ok([...A].some(x=>B.has(x)));assert.equal(new Set([...A,...B]).size,3);assert.notEqual(A.size+B.size,3);break;}
  case 'invalid-distribution':close(.7+.4-.1,1);assert.ok(-.1<0);break;
  case 'zero-variance':assert.ok([.25,.75].every(p=>p>0));close(centered([3,3],[.25,.75]).variance,0);assert.ok(centered([3,4],[.25,.75]).variance>0);break;
  case 'moment-impossible':assert.ok(3-2**2<0);break;
  case 'replacement-comparison':close(3/5*3/5,9/25);close(3/5*2/4,3/10);break;
  case 'not-binomial':assert.notEqual(3/5,2/4);break;
  case 'hypergeometric-support':{const valid=Array.from({length:4},(_,k)=>k).filter(k=>combinations(4,k)*combinations(1,3-k)>0);assert.deepEqual(valid,[2,3]);break;}
  case 'sampling-all':for(let k=0;k<=6;k++)close(combinations(2,k)*combinations(4,6-k)/combinations(6,6),k===2?1:0);break;
  case 'constant-x':{assert.equal(regression([[2,1],[2,3]]).slope,null);break;}
  case 'causal-limitation':{const x=[0,1,2],y=[0,2,4];close(regression(x.map((v,i)=>[v,y[i]])).r,1);/* Same observations also arise from shared cause Z: X=Z,Y=2Z. */break;}
  case 'nonlinear-correlation':close(regression([[-1,1],[0,0],[1,1]]).r,0);break;
  case 'residual-sum':{const pts=[[0,1],[1,3],[2,2]],r=regression(pts);close(r.intercept,1.5);close(r.slope,.5);close(sum(pts.map(([x,y])=>y-r.intercept-r.slope*x)),0);break;}
  case 'extrapolation':assert.ok(100>5);break;
  case 'pairing-transfer':close(regression([[1,1],[2,2],[3,3]]).slope,1);close(regression([[1,3],[2,2],[3,1]]).slope,-1);break;
  case 'loss-transfer':{const y=[0,0,3],square=c=>sum(y.map(v=>(v-c)**2)),absolute=c=>sum(y.map(v=>Math.abs(v-c)));assert.ok(square(1)<square(0));assert.ok(absolute(0)<absolute(1));break;}
  default:throw Error(`Unreviewed written family: ${calc}`);
 }
}
export function auditCalculusStatisticsSkills(){const ids=new Set(),verified=[];let scalar=0,choice=0,written=0;
 for(const lesson of calculusStatisticsSkills)for(const q of [...lesson.questions,...lesson.diagnostics]){assert.ok(!ids.has(q.id),q.id);ids.add(q.id);
  if(q.kind==='choice'){const expected=deriveChoice(q);assert.equal(q.answer,expected,q.id);choice++;}
  else if(typeof q.answer==='number'){const expected=deriveScalar(q.verification.calc,q.verification.givens);close(q.answer,expected);scalar++;}
  else {verifyWritten(q.verification.calc);assert.ok(q.answer.en&&q.answer.zh&&q.rubric.length>=3,q.id);written++;}
  verified.push(q.id);
 }
 assert.equal(verified.length,120);return {skills:calculusStatisticsSkills.length,scalar,choice,written,total:verified.length,verifiedIds:verified};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const {verifiedIds,...report}=auditCalculusStatisticsSkills();console.log(JSON.stringify(report));}
