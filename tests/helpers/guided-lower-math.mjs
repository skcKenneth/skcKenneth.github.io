/** Independent exact QA primitives. Never imports a production answer builder. */
import assert from 'node:assert/strict';
import {rational as F,add,subtract as sub,multiply as mul,divide as div,equal,format,number,evaluateMath,expressionIdentity,originalDomain} from './guided-upper-math.mjs';
export {F,add,sub,mul,div,equal,format,number};
export const compare=(a,b)=>{a=F(a);b=F(b);const n=a.n*b.d-b.n*a.d;return n<0n?-1:n>0n?1:0;};
export const sum=values=>values.reduce((a,b)=>add(a,b),F(0));
export function exactTree(actual,expected){
 if(expected&&typeof expected==='object'&&typeof expected.n==='bigint'&&typeof expected.d==='bigint'){try{return equal(actual,expected);}catch{return false;}}
 if(Array.isArray(expected)){if(!Array.isArray(actual)||actual.length!==expected.length)return false;return expected.every((value,i)=>exactTree(actual[i],value));}
 if(expected&&typeof expected==='object'){if(!actual||typeof actual!=='object')return false;return Object.keys(expected).every(key=>Object.hasOwn(actual,key)&&exactTree(actual[key],expected[key]));}
 if(typeof expected==='boolean'||expected===null)return actual===expected;
 try{return equal(actual,expected);}catch{return actual===expected;}
}
export function determinant(matrix){
 if(!matrix.length)return F(1);if(matrix.some(row=>row.length!==matrix.length))throw Error('Determinant needs a square matrix');
 return matrix[0].reduce((total,entry,column)=>add(total,mul(column%2?-1:1,mul(entry,determinant(matrix.slice(1).map(row=>row.filter((_,i)=>i!==column)))))),F(0));
}
/** Cramer's rule, deliberately independent of the authored elimination builder. */
export function solveMatrix(rows){
 const n=rows.length;if(n<2||n>3||rows.some(row=>row.length!==n+1))throw Error('Supported systems have two or three equations and unknowns');
 const coefficients=rows.map(row=>row.slice(0,n)),rhs=rows.map(row=>row[n]),d=determinant(coefficients);if(!d.n)throw Error('System is not uniquely solvable');
 const solution=coefficients[0].map((_,column)=>div(determinant(coefficients.map((row,i)=>row.map((entry,j)=>j===column?rhs[i]:entry))),d));
 if(rows.some(row=>!equal(sum(row.slice(0,n).map((entry,i)=>mul(entry,solution[i]))),row[n])))throw Error('Original equation substitution failed');return solution;
}
export function affine(expression,variable='x'){
 const b=evaluateMath(expression,{[variable]:0}),a=sub(evaluateMath(expression,{[variable]:1}),b);
 if(!expressionIdentity(expression,`(${format(a)})${variable}+(${format(b)})`))throw Error('Expression is not affine');return {a,b};
}
const empty=()=>({lo:null,hi:null,loClosed:false,hiClosed:false,empty:true});
const all=()=>({lo:null,hi:null,loClosed:false,hiClosed:false});
export function intersect(left,right){
 if(left.empty||right.empty)return empty();const result=all();
 for(const key of ['lo','hi']){const a=left[key],b=right[key],closed=key+'Closed';if(a===null){result[key]=b;result[closed]=b===null?false:right[closed];}else if(b===null){result[key]=a;result[closed]=left[closed];}else{const c=compare(a,b),pick=key==='lo'?c>0:c<0;result[key]=pick?a:b;result[closed]=c===0?left[closed]&&right[closed]:pick?left[closed]:right[closed];}}
 if(result.lo!==null&&result.hi!==null&&(compare(result.lo,result.hi)>0||compare(result.lo,result.hi)===0&&!(result.loClosed&&result.hiClosed)))return empty();return result;
}
export function solveInequality(left,right,operator){
 if(!['<','<=','>','>='].includes(operator))throw Error('Unknown inequality operator');const l=affine(left),r=affine(right),a=sub(l.a,r.a),b=sub(r.b,l.b);
 if(!a.n){const c=compare(0,b),valid=operator==='<'?c<0:operator==='<='?c<=0:operator==='>'?c>0:c>=0;return valid?all():empty();}
 if(a.n<0n)operator=({'<':'>','<=':'>=','>':'<','>=':'<='})[operator];const bound=format(div(b,a)),lower=operator.startsWith('>');return {lo:lower?bound:null,hi:lower?null:bound,loClosed:lower&&operator.includes('='),hiClosed:!lower&&operator.includes('=')};
}
export function solveConstraints(constraints){if(!constraints.length)throw Error('No inequality constraints');return constraints.reduce((interval,c)=>intersect(interval,solveInequality(c.left,c.right,c.operator)),all());}
export function integerBounds(interval){
 if(interval.empty)return [];if(interval.lo===null||interval.hi===null)throw Error('Integer range needs finite bounds');
 const lo=F(interval.lo),hi=F(interval.hi),floor=x=>x.n>=0n?x.n/x.d:-((-x.n+x.d-1n)/x.d),ceil=x=>-floor(F(-x.n,x.d));
 const first=ceil(lo)+(!interval.loClosed&&lo.n%lo.d===0n?1n:0n),last=floor(hi)-(!interval.hiClosed&&hi.n%hi.d===0n?1n:0n);return first>last?[]:[String(first),String(last)];
}
export function inInterval(value,interval){return !interval.empty&&(interval.lo===null||compare(value,interval.lo)>0||interval.loClosed&&equal(value,interval.lo))&&(interval.hi===null||compare(value,interval.hi)<0||interval.hiClosed&&equal(value,interval.hi));}
export function roundExact(value,places){const x=F(value),scale=10n**BigInt(places),abs=x.n<0n?-x.n:x.n,rounded=(abs*scale*2n+x.d)/(2n*x.d);return F(x.n<0n?-rounded:rounded,scale);}

const clean=map=>new Map([...map].filter(([,value])=>value.n));
const scalar=value=>{const x=F(value);return new Map(x.n?[[1n,x]]:[]);};
export const radicalAdd=(a,b)=>{const out=new Map(a);for(const[k,v]of b)out.set(k,add(out.get(k)||0,v));return clean(out);};
const negative=a=>new Map([...a].map(([k,v])=>[k,mul(-1,v)]));
function extractSquare(n){if(n<0n)throw Error('Negative real radicand');let outside=1n,inside=1n;if(n>10n**12n)throw Error('Radicand exceeds bounded exact factor audit');for(let p=2n;p*p<=n;p++){let count=0;while(n%p===0n){n/=p;count++;}outside*=p**BigInt(Math.floor(count/2));if(count%2)inside*=p;}if(n>1n)inside*=n;return {outside,inside};}
export function radicalRoot(value){const x=F(value);if(x.n<0n)throw Error('Negative real radicand');if(!x.n)return new Map();const perfect=integerRoot(x.n*x.d,2);if(perfect!==null)return new Map([[1n,F(perfect,x.d)]]);const {outside,inside}=extractSquare(x.n*x.d);return new Map([[inside,F(outside,x.d)]]);}
export function radicalMultiply(a,b){let out=new Map();for(const[x,u]of a)for(const[y,v]of b){const r=radicalRoot(x*y);out=radicalAdd(out,new Map([...r].map(([k,w])=>[k,mul(mul(u,v),w)])));}return out;}
export function radicalDivide(a,b){
 if(!b.size)throw Error('Zero original radical denominator');
 if(b.size===1){const [[k,v]]=b;return radicalMultiply(a,new Map([[k,div(1,mul(v,k))]]));}
 if(b.size===2){const entries=[...b],u=new Map([entries[0]]),v=new Map([entries[1]]),den=radicalAdd(radicalMultiply(u,u),negative(radicalMultiply(v,v)));if(den.size!==1||!den.has(1n))throw Error('Unsupported radical denominator');return radicalDivide(radicalMultiply(a,radicalAdd(u,negative(v))),den);}
 throw Error('Unsupported radical denominator');
}
export const radicalEqual=(a,b)=>a.size===b.size&&[...a].every(([k,v])=>b.has(k)&&equal(v,b.get(k)));
export const radicalNumber=a=>[...a].reduce((total,[k,v])=>total+Math.sqrt(Number(k))*number(v),0);
export function normalizeRootTeX(input){
 let text=String(input).replaceAll('−','-').replace(/\\(?:left|right)/g,'').replace(/\\(?:times|cdot)\s*/g,'*').replace(/\s+/g,'');
 const group=start=>{if(text[start]!=='{')throw Error('Expected TeX group');let depth=1,end=start+1;while(end<text.length&&depth){if(text[end]==='{')depth++;if(text[end]==='}')depth--;end++;}if(depth)throw Error('Unclosed TeX group');return {value:text.slice(start+1,end-1),end};};
 let result='';for(let i=0;i<text.length;){if(text.startsWith('\\sqrt[3]',i)){const a=group(i+8);result+='cbrt('+normalizeRootTeX(a.value)+')';i=a.end;}else if(text.startsWith('\\sqrt',i)){const a=group(i+5);result+='sqrt('+normalizeRootTeX(a.value)+')';i=a.end;}else if(text.startsWith('\\frac',i)){const a=group(i+5),b=group(a.end);result+='(('+normalizeRootTeX(a.value)+')/('+normalizeRootTeX(b.value)+'))';i=b.end;}else result+=text[i++];}
 return result.replaceAll('{','(').replaceAll('}',')').replace(/\|([^|]+)\|/g,'abs($1)');
}
export function evaluateRadical(expression){
 const source=normalizeRootTeX(expression),tokens=source.match(/sqrt|abs|\d+(?:\.\d+)?|[()+\-*/^]/g)||[];if(tokens.join('')!==source)throw Error('Unsupported exact radical expression '+source);let at=0;
 const take=token=>tokens[at]===token?(at++,true):false;
 function atom(){if(take('(')){const value=addition();if(!take(')'))throw Error('Unclosed radical group');return value;}if(tokens[at]==='sqrt'||tokens[at]==='abs'){const fn=tokens[at++];if(!take('('))throw Error('Expected function group');const arg=addition();if(!take(')'))throw Error('Unclosed root');if(fn==='sqrt'){if(arg.size>1||arg.size===1&&!arg.has(1n))throw Error('Nested irrational radicand unsupported');return radicalRoot(arg.get(1n)||0);}if(arg.size>1)throw Error('Absolute sign needs independent ordering');return [...arg.values()].some(v=>v.n<0n)?negative(arg):arg;}const token=tokens[at++];if(!/^\d/.test(token||''))throw Error('Expected radical scalar');return scalar(token);}
 function exponent(){let value=atom();if(take('^')){let wrapped=take('('),sign=take('-')?-1:take('+')?1:1,n=Number(tokens[at++])*sign;if(!Number.isInteger(n)||Math.abs(n)>30)throw Error('Unsupported root power');if(wrapped&&!take(')'))throw Error('Unclosed exponent');if(!value.size&&n<=0)throw Error('Zero with nonpositive exponent');let out=scalar(1);for(let i=0;i<Math.abs(n);i++)out=radicalMultiply(out,value);value=n<0?radicalDivide(scalar(1),out):out;}return value;}
 function unary(){return take('-')?negative(unary()):take('+')?unary():exponent();}
 function product(){let value=unary();while(at<tokens.length){if(take('*'))value=radicalMultiply(value,unary());else if(take('/'))value=radicalDivide(value,unary());else if(tokens[at]==='('||tokens[at]==='sqrt'||tokens[at]==='abs')value=radicalMultiply(value,unary());else break;}return value;}
 function addition(){let value=product();while(at<tokens.length){if(take('+'))value=radicalAdd(value,product());else if(take('-'))value=radicalAdd(value,negative(product()));else break;}return value;}
 const value=addition();if(at!==tokens.length)throw Error('Trailing radical tokens');return value;
}
export function radicalIdentity(original,result,variable){
 if(variable){const left=normalizeRootTeX(original),right=normalizeRootTeX(result),a=left.match(/^sqrt\((.+)\^\(?2\)?\)$/),b=right.match(/^abs\((.+)\)$/);if(!a||!b)throw Error('Unsupported symbolic radical identity');return expressionIdentity(a[1],b[1]);}
 return radicalEqual(evaluateRadical(original),evaluateRadical(result));
}
/** Rank classification uses exact row reduction, independent of Cramer's rule above. */
export function classifyMatrix(rows){
 const n=rows[0].length-1,m=rows.map(row=>row.map(v=>F(v)));let rank=0;
 for(let column=0;column<n;column++){const pivot=m.findIndex((row,i)=>i>=rank&&row[column].n);if(pivot<0)continue;[m[rank],m[pivot]]=[m[pivot],m[rank]];const divisor=m[rank][column];m[rank]=m[rank].map(v=>div(v,divisor));for(let i=0;i<m.length;i++)if(i!==rank){const factor=m[i][column];m[i]=m[i].map((v,j)=>sub(v,mul(factor,m[rank][j])));}rank++;}
 return m.some(row=>row.slice(0,n).every(v=>!v.n)&&row[n].n)?'none':rank===n?'unique':'infinite';
}
export function dataSummary(values,frequencies){
 if(!values?.length)throw Error('Empty data');const weights=frequencies||values.map(()=>1);if(weights.length!==values.length||weights.some(value=>compare(value,0)<0||F(value).d!==1n)||compare(sum(weights),0)<=0)throw Error('Invalid frequency');
 const total=sum(weights),mean=div(sum(values.map((value,i)=>mul(value,weights[i]))),total),variance=div(sum(values.map((value,i)=>mul(weights[i],mul(sub(value,mean),sub(value,mean))))),total),expanded=[];for(let i=0;i<values.length;i++){if(number(weights[i])>10000)throw Error('Frequency beyond QA bound');for(let j=0;j<number(weights[i]);j++)expanded.push(F(values[i]));}expanded.sort(compare);
 const middle=Math.floor(expanded.length/2),median=expanded.length%2?expanded[middle]:div(add(expanded[middle-1],expanded[middle]),2),counts=new Map();expanded.forEach(value=>counts.set(format(value),(counts.get(format(value))||0)+1));const highest=Math.max(...counts.values()),modes=[...counts].filter(([,count])=>count===highest).map(([value])=>F(value)).sort(compare);
 return {mean,variance,median,modes,total,highest,range:sub(expanded.at(-1),expanded[0])};
}
export function checkHistogram(audit){
 const {bins,values,height,heights}=audit;if(!bins?.length||!['density','frequency'].includes(height))throw Error('Invalid histogram');
 for(let i=0;i<bins.length;i++){const bin=bins[i];if(compare(bin.hi,bin.lo)<=0||compare(bin.frequency,0)<0||F(bin.frequency).d!==1n)throw Error('Invalid histogram bin');if(i&&(!equal(bins[i-1].hi,bin.lo)||bins[i-1].hiClosed))throw Error('Overlapping or discontinuous bins');if(!equal(heights[i],height==='density'?div(bin.frequency,sub(bin.hi,bin.lo)):bin.frequency))throw Error('Histogram height/frequency mismatch');}
 if(values){const counts=bins.map(()=>0);for(const value of values){const matches=bins.map((bin,i)=>compare(value,bin.lo)>=0&&(compare(value,bin.hi)<0||bin.hiClosed&&equal(value,bin.hi))?i:-1).filter(i=>i>=0);if(matches.length!==1)throw Error('Observation is not assigned exactly once');counts[matches[0]]++;}if(!exactTree(counts,bins.map(bin=>bin.frequency)))throw Error('Bin frequency disagrees with original observations');}
 return {frequencies:bins.map(bin=>F(bin.frequency)),heights:bins.map(bin=>height==='density'?div(bin.frequency,sub(bin.hi,bin.lo)):F(bin.frequency)),total:sum(bins.map(bin=>bin.frequency))};
}
export const vector=(points,side)=>{const[a,b]=Array.isArray(side)?side:[...side];if(!points[a]||!points[b])throw Error('Unknown segment endpoint');return points[b].map((v,i)=>Number(v)-Number(points[a][i]));};
export const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
export const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
export const length2=(points,side)=>dot(vector(points,side),vector(points,side));
export const close=(a,b)=>Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
export const parallel=(points,a,b)=>close(cross(vector(points,a),vector(points,b)),0);
export const perpendicular=(points,a,b)=>close(dot(vector(points,a),vector(points,b)),0);
export const midpoint=(points,m,side)=>{const[a,b]=[...side];return points[m].every((v,i)=>close(2*v,Number(points[a][i])+Number(points[b][i])));};
export function angleDegrees(points,label){const[a,b,c]=[...label],u=vector(points,[b,a]),v=vector(points,[b,c]),den=Math.sqrt(dot(u,u)*dot(v,v));if(!den)throw Error('Degenerate angle');return Math.acos(Math.max(-1,Math.min(1,dot(u,v)/den)))*180/Math.PI;}
export function polygonArea(points,labels='ABCD'){return Math.abs([...labels].reduce((area,label,i)=>{const a=points[label],b=points[labels[(i+1)%labels.length]];return area+a[0]*b[1]-a[1]*b[0];},0))/2;}

const ensure=(condition,label)=>assert.ok(condition,label);
const expect=(actual,expected,label)=>ensure(exactTree(actual,expected),label+'; got '+JSON.stringify(actual,(_k,v)=>typeof v==='bigint'?String(v):v));
function integerRoot(n,degree){let sign=n<0n?-1n:1n;if(sign<0n&&degree%2===0)return null;n*=sign;let low=0n,high=n+1n;while(high-low>1n){const m=(low+high)/2n;if(m**BigInt(degree)>n)high=m;else low=m;}return low**BigInt(degree)===n?low*sign:null;}
function rationalRoot(value,degree){const x=F(value),a=integerRoot(x.n,degree),b=integerRoot(x.d,degree);return a===null||b===null?null:F(a,b);}
function originalSystemContext(a){
 const c=a.context;if(!c)return;let rows;
 switch(c.kind){
  case 'two-purchases':rows=c.quantities.map((row,i)=>[...row,c.bills[i]]);break;
  case 'count-cost':rows=[[1,1,c.total],[...c.unitPrices,c.totalCost]];break;
  case 'boat-speed':rows=[[1,1,c.downstream],[1,-1,c.upstream]];break;
  case 'ratio-total':rows=[[1,mul(-1,c.ratio),0],[1,1,c.total]];break;
  case 'rectangle':rows=[[1,1,div(c.perimeter,2)],[1,-1,c.difference]];break;
  case 'three-count-cost':rows=[[1,1,1,c.total],[...c.unitPrices,c.totalCost],[1,1,0,c.firstTwoTotal]];break;
  default:throw Error('Unknown system context '+c.kind);
 }
 expect(a.matrix,rows,'Original contextual quantities produce the stated equations');const solution=solveMatrix(rows),admissible=solution.every(v=>compare(v,0)>=0)&&(!c.integerCounts||solution.every(v=>v.d===1n));
 if(c.positivePrices||c.positiveLengths||c.positiveSpeeds)ensure(solution.every(v=>compare(v,0)>0),'Positive contextual solution');if(c.admissible!==undefined)expect(admissible,c.admissible,'Contextual admissibility');else ensure(admissible,'Contextual solution meets count/sign restrictions');
}
function checkStatistics(a){
 const request=a.request||a.statistic;let actual;
 if(a.counts){const total=sum(a.counts);ensure(compare(total,0)>0&&a.counts.every(v=>F(v).d===1n&&compare(v,0)>=0),'Valid original counts');const frequency=a.index===undefined?null:div(a.counts[a.index],total);
  switch(request){case 'total':actual=total;break;case 'frequency':actual=frequency;break;case 'percent':actual=mul(100,frequency);break;case 'sector-angle':actual=mul(360,frequency);break;case 'estimate':actual=mul(a.totalPopulation,frequency);break;case 'allocation':actual=a.counts.map(v=>mul(a.sampleSize,div(v,total)));break;case 'missing-count':actual=sub(a.total,sum(a.counts.filter((_,i)=>i!==a.missingIndex)));break;default:throw Error('Unknown count statistic '+request);}
 }else{
  if(a.denominator!==undefined)ensure(a.denominator==='n','Population variance denominator n');
  const values=a.values||a.midpoints;
  if(a.midpoints){ensure(a.estimate===true&&a.bins?.length===a.midpoints.length,'Grouped midpoint estimate is explicitly labelled');a.bins.forEach((bin,i)=>{expect(a.midpoints[i],div(add(bin.lo,bin.hi),2),'Actual bin midpoint');expect(a.frequencies[i],bin.frequency,'Original bin frequency');});}
  const data=dataSummary(values,a.frequencies);
  if(a.transform){expect(values,a.transform.original.map(v=>add(mul(v,a.transform.scale),a.transform.shift)),'Actual transformed observations');}
  switch(request){case 'mean':case 'weighted-mean':actual=data.mean;break;case 'median':actual=data.median;break;case 'range':actual=data.range;break;case 'variance':actual=data.variance;break;case 'modes':actual=a.modeConvention==='repeated-only'&&data.highest===1?[]:data.modes;break;case 'summary':actual={mean:data.mean,median:data.median};break;case 'compare-variance':{const variances=a.groups.map(group=>dataSummary(group).variance);actual={variances,moreStable:variances.reduce((best,value,i)=>compare(value,variances[best])<0?i:best,0)};break;}default:throw Error('Unknown statistic '+request);}
 }
 expect(actual,a.expected,'Original data statistic');return actual;
}
function checkFunction(a){
 const k=F(a.k),b=F(a.b),value=x=>add(mul(k,x),b);for(const[x,y]of a.points||[])expect(value(x),y,'Original point lies on line');
 if(a.context){const c=a.context;switch(c.kind){case 'filling':expect(k,c.rate,'Filling rate');expect(b,c.initial,'Initial volume');expect(a.domain.max,div(sub(c.capacity,c.initial),c.rate),'Time when full');break;case 'filling-stage':expect(k,c.rate,'Stage rate');expect(b,c.initial,'Initial stage volume');expect(a.domain.max,c.duration,'Stage duration');break;case 'ticket-count':expect(k,c.unitPrice,'Unit price');expect(b,0,'No fixed fee');expect(a.domain.max,c.maximum,'Maximum ticket count');ensure(a.domain.integer===true,'Ticket counts integral');break;case 'fixed-plus-rate':expect(k,c.rate,'Variable rate');expect(b,c.fixed,'Fixed cost');expect(a.x,c.count,'Actual count');break;case 'profit':expect(k,c.rate,'Contribution per item');expect(b,mul(-1,c.fixedCost),'Fixed cost deducted');break;default:throw Error('Unknown function context '+c.kind);}}
 const interval=a.domain?{lo:a.domain.min,hi:a.domain.max,loClosed:a.domain.minInclusive,hiClosed:a.domain.maxInclusive}:all();let actual;
 switch(a.request){
  case 'value':actual=value(a.x);break;
  case 'context-value':actual=a.expected&&typeof a.expected==='object'?{formulaValue:value(a.x),allowed:inInterval(a.x,interval)&&(!a.domain?.integer||F(a.x).d===1n)}:value(a.x);break;
  case 'zero':ensure(k.n,'Nonconstant line for a unique zero');actual=div(mul(-1,b),k);break;
  case 'classification':actual=!k.n?'constant-function':!b.n?'direct-proportion':'linear-function';break;
  case 'formula':ensure(a.points?.length>=2&&compare(a.points[0][0],a.points[1][0])!==0,'Two distinct inputs determine the formula');actual={k:div(sub(a.points[1][1],a.points[0][1]),sub(a.points[1][0],a.points[0][0])),b};break;
  case 'slope':ensure(a.points?.length,'Point and given intercept determine slope');actual=div(sub(a.points[0][1],b),a.points[0][0]);break;
  case 'graph':actual={k,b};break;
  case 'monotonicity':actual=k.n>0n?'increasing':k.n<0n?'decreasing':'constant';break;
  case 'common-point':{ensure(a.lines?.length>=2,'At least two lines');const x=a.lines[0].k===a.lines[1].k?F(0):div(sub(a.lines[1].b,a.lines[0].b),sub(a.lines[0].k,a.lines[1].k)),y=add(mul(a.lines[0].k,x),a.lines[0].b);a.lines.forEach(line=>expect(add(mul(line.k,x),line.b),y,'Common point on every original line'));actual=[x,y];break;}
  case 'intersection':{const[u,v]=a.lines;const d=sub(u.k,v.k);if(!d.n)actual={classification:equal(u.b,v.b)?'all':'none'};else{const x=div(sub(v.b,u.b),d);actual={classification:'finite',x,y:add(mul(u.k,x),u.b)};}break;}
  case 'domain':ensure(a.context,'Domain requires original context');actual={min:a.domain.min,max:a.domain.max,integer:!!a.domain.integer};break;
  case 'inequality':{if(a.lines){expect(k,sub(a.lines[0].k,a.lines[1].k),'Compared line slope difference');expect(b,sub(a.lines[0].b,a.lines[1].b),'Compared line intercept difference');}const solved=solveInequality(`(${format(k)})x+(${format(b)})`,'0',a.relation),endpoint=solved.lo??solved.hi,lower=solved.lo!==null,inclusive=lower?solved.loClosed:solved.hiClosed;ensure(endpoint!==null,'Finite inequality endpoint');actual={endpoint,direction:lower?(inclusive?'\\geq':'>'):(inclusive?'\\leq':'<'),inclusive};if(a.expected.smallestInteger!==undefined){const bound=F(endpoint);actual.smallestInteger=String(Math.floor(number(bound))+1-(inclusive&&bound.d===1n?1:0));}break;}
  default:throw Error('Unknown function request '+a.request);
 }
 expect(actual,a.expected,'Original function relation');return actual;
}
function checkTranslation(a){
 ensure(a.shift.length===2&&Object.keys(a.points).length>0,'Nonempty planar translation');const pairs=a.pairs||Object.keys(a.points).map(label=>[label,label+"'"]);ensure(pairs.length===Object.keys(a.points).length,'Every original vertex has an image');
 for(const[from,to]of pairs){ensure(a.points[from]&&a.images[to],'Translation correspondence is explicit');expect(a.images[to],a.points[from].map((v,i)=>add(v,a.shift[i])),'Each image uses the same displacement');}
 for(let i=0;i<pairs.length;i++)for(let j=i+1;j<pairs.length;j++){const[from,to]=pairs[i],[other,image]=pairs[j];expect(a.images[image].map((v,k)=>sub(v,a.images[to][k])),a.points[other].map((v,k)=>sub(v,a.points[from][k])),'Translation preserves the full segment vector');}
 return true;
}
function checkGeometryFact(a,q){
 const f=a.facts;let valid;
 switch(a.rule){
  case 'vertical-pair':{ensure(f.lines.length===2&&f.lines.every(line=>line.length===3),'Two intersecting straight lines');const[[x,o,y],[z,p,w]]=f.lines;ensure(o===p&&new Set([x,y,z,w]).size===4,'Distinct opposite rays with common vertex');const opposite={[x]:y,[y]:x,[z]:w,[w]:z},[u,v]=f.pair.map(s=>[...s]);valid=u[1]===o&&v[1]===o&&((opposite[u[0]]===v[0]&&opposite[u[2]]===v[2])||(opposite[u[0]]===v[2]&&opposite[u[2]]===v[0]));break;}
  case 'point-line-distance':{const p={P:f.P,A:f.A,B:f.B,H:f.H};ensure(length2(p,'AB')>0&&parallel(p,'AH','AB'),'Foot is on nondegenerate line');ensure(perpendicular(p,'PH','AB'),'Distance is perpendicular');expect(f.expected,Math.sqrt(length2(p,'PH')),'Perpendicular distance');valid=true;break;}
  case 'construct-perpendicular':{const p={P:f.P,A:f.line[0],B:f.line[1],H:f.foot};valid=length2(p,'AB')>0&&parallel(p,'AH','AB')&&perpendicular(p,'PH','AB');break;}
  case 'oblique-not-distance':{const p={P:f.P,H:f.H,A:f.A};ensure(perpendicular(p,'PH','HA'),'Given foot perpendicular');ensure(close(length2(p,'PH'),Number(f.perpendicularLength)**2)&&close(length2(p,'PA'),Number(f.obliqueLength)**2),'Actual perpendicular and oblique lengths');valid=equal(f.perpendicularLength,f.obliqueLength);break;}
  case 'alternate-position-only':ensure(f.inside&&f.oppositeSides&&!f.parallelGiven&&!equal(...f.counterexampleAngles),'Alternate position has a concrete unequal-angle example without parallelism');valid=true;break;
  case 'distance-definition':valid=f.perpendicular===true;break;
  case 'parallel-test':{ensure(f.coplanar&&f.angles.every(v=>compare(v,0)>0&&compare(v,180)<0),'Coplanar nondegenerate transversal angles');let parallel;if(['corresponding','alternate'].includes(f.relation))parallel=equal(...f.angles);else if(f.relation==='cointerior')parallel=equal(sum(f.angles),180);else throw Error('Unknown parallel criterion');valid=parallel===f.conclusionParallel;break;}
  case 'statement-direction':valid=f.hypothesis==='parallel'&&f.conclusion==='corresponding-equal';break;
  case 'vertical-without-parallel':ensure(f.counterexampleCorresponding.every(v=>v>0&&v<180)&&!equal(...f.counterexampleCorresponding),'Unequal corresponding angles disprove an automatic parallel conclusion');valid=true;break;
  case 'common-perpendicular':valid=f.coplanar&&f.perpendicularTo&&new Set(f.lines).size===2&&f.angles.length===2&&f.angles.every(v=>equal(v,90));break;
  case 'circular-parallel-proof':ensure(equal(...f.repairAngles),'Repair supplies equality independently');valid=f.parallelGiven===true||f.equalityGiven===true;break;
  case 'equal-not-vertical':ensure(equal(...f.angles),'The counterexample angles actually equal');valid=exactTree(f.vertices[0],f.vertices[1]);break;
  case 'translation-motion':valid=f.motion==='straight-slide'&&!f.rotates;break;
  case 'translation-displacement':expect(f.expected,f.shift[0],'Horizontal displacement');ensure(equal(f.shift[1],0),'Pure horizontal movement');valid=true;break;
  case 'translation-match':valid=checkTranslation(f);break;
  case 'translation-invariants':valid=equal(f.length,f.imageLength)&&equal(f.angle,f.imageAngle);break;
  case 'common-translation':valid=f.moves.every(move=>exactTree(move,f.moves[0]));break;
  case 'translation-midpoint':{const p={A:f.A,M:f.M,B:f.B};ensure(midpoint(p,'M','AB'),'Original midpoint');const image=Object.fromEntries(Object.entries(p).map(([k,v])=>[k,v.map((x,i)=>number(add(x,f.shift[i])))]));valid=midpoint(image,'M','AB');break;}
  case 'translation-collinear':{checkTranslation({points:{A:f.A,B:f.B},images:f.images,shift:f.shift});const p={A:f.A,B:f.B,C:f.images["A'"],D:f.images["B'"]};valid=parallel(p,'AC','BD')&&!parallel(p,'AB','AC');break;}
  case 'translation-compose':expect(f.expected,[sum(f.shifts.map(s=>s[0])),sum(f.shifts.map(s=>s[1]))],'Composed displacement sum');valid=true;break;
  case 'finite-display-insufficient':{ensure(!equal(...f.examples),'Different exact numbers');const digits=f.display.split('.')[1].length,scale=10n**BigInt(digits),display=F(f.display);ensure(f.examples.every(v=>F(v).n*scale/F(v).d===display.n*scale/display.d),'Both values have the same finite truncation');valid=false;break;}
  case 'grid-route':expect(f.endpoint,f.start.map((v,i)=>add(v,sum(f.moves.map(m=>m[i])))),'Endpoint from vector sum');ensure(f.moves.every(move=>move.some(v=>equal(v,0))),'Axis-aligned route');expect(f.routeLength,sum(f.moves.flat().map(v=>F(Math.abs(number(v))))),'Grid route uses sum of absolute moves');valid=true;break;
  case 'change-origin':expect(f.expected,f.point.map((v,i)=>sub(v,f.newOrigin[i])),'Coordinates subtract new origin');valid=true;break;
  case 'equation-scale':valid=exactTree(f.result,f.original.map(v=>mul(v,f.factor)))&&!equal(f.factor,0);break;
  case 'quantity-total':valid=f.units.length===2&&f.units[0]===f.units[1]&&expressionIdentity(f.result,f.variables.join('+'));break;
  case 'unit-product':valid=f.unitPrice==='dollars/ticket'&&f.count==='tickets'&&f.resultUnit==='dollars';break;
  case 'consistent-elimination':valid=exactTree(f.remaining,f.originalVariables.filter(v=>v!==f.eliminate))&&f.originalVariables.includes(f.eliminate);break;
  case 'negative-inequality-scale':ensure(compare(f.left,f.right)<0&&compare(f.factor,0)<0,'Negative factor and original order');expect(f.resultLeft,mul(f.left,f.factor),'Scaled left');expect(f.resultRight,mul(f.right,f.factor),'Scaled right');valid=f.resultOperator==='>'&&compare(f.resultLeft,f.resultRight)>0;break;
  case 'budget-decision':{const costs=f.plans.map(p=>add(p.fixed,mul(p.rate,f.n)));expect(f.costs,costs,'Actual plan costs');expect(f.feasible,costs.map(cost=>compare(cost,f.budget)<=0),'Budget feasibility for each plan');valid=true;break;}
  default:throw Error('Unknown concrete geometry rule '+a.rule);
 }
 expect(!!valid,a.valid,'Concrete rule '+a.rule);if(q.numericAnswer!==undefined){ensure(f.expected!==undefined,'Numeric concrete rule has a derived expected value');ensure(close(q.numericAnswer,number(f.expected)),'Numeric concrete result');}return true;
}
function checkSurvey(a){const f=a.facts;let valid;
 switch(a.rule){
  case 'population-sample':valid=Number.isInteger(f.populationSize)&&Number.isInteger(f.sampleSize)&&f.sampleSize>0&&f.sampleSize<=f.populationSize&&['travel-mode','height'].includes(f.variable);if(f.selection)ensure(f.selection.includes('uniformly without replacement from complete list'),'Explicit equal-opportunity sample');break;
  case 'selection-bias':ensure(f.clubSize>0&&f.clubSize<f.populationSize,'Strict subpopulation');ensure(f.excluded===`${f.populationSize-f.clubSize} nonmembers`&&f.selection.includes('sports club only')&&f.repair===`uniform sample from all${f.populationSize}`,'Concrete exclusion and repaired frame');valid=false;break;
  case 'chart-purpose':valid=f.orderedTime&&f.variable==='daily-temperature'&&f.selectedChart==='line';break;
  case 'estimate-uncertainty':expect(f.estimate,mul(f.populationSize,div(f.samplePercent,100)),'Sample-proportion estimate');ensure(f.possibleTrueCount>=0&&f.possibleTrueCount<=f.populationSize&&!equal(f.possibleTrueCount,f.estimate),'A different feasible population count');valid=false;break;
  case 'destructive-sampling':valid=f.destructive&&f.population==='production-batch'&&f.selection==='random across complete batch'&&f.alternative==='one convenient box';break;
  case 'truncated-axis':expect(f.visibleHeights,f.values.map(v=>sub(v,f.baseline)),'Visible heights after baseline truncation');expect(f.trueRatio,div(f.values[1],f.values[0]),'True untruncated ratio');valid=equal(div(f.visibleHeights[1],f.visibleHeights[0]),f.trueRatio);break;
  case 'sampling-variation':{ensure(f.selection==='uniform without replacement on each repeat','Explicit sampling frame');const lo=Math.max(0,f.sampleSize-(f.populationSize-f.populationSuccesses)),hi=Math.min(f.sampleSize,f.populationSuccesses);valid=f.sampleSuccesses.every(n=>Number.isInteger(n)&&n>=lo&&n<=hi);break;}
  default:throw Error('Unknown survey rule '+a.rule);
 }expect(!!valid,a.valid,'Survey rule '+a.rule);return true;
}
function checkPythagoras(a,q){let actual;const k=a.known||{},sq=v=>mul(v,v),root=v=>radicalRoot(v);
 switch(a.request){
  case 'hypotenuse':case 'leg':{ensure(compare(k.a,0)>0&&compare(a.request==='leg'?k.c:k.b,0)>0,'Positive supplied lengths');const squared=a.request==='leg'?sub(sq(k.c),sq(k.a)):add(sq(k.a),sq(k.b));ensure(compare(squared,0)>0,'Nondegenerate positive missing length');actual=root(squared);ensure(radicalEqual(actual,evaluateRadical(a.expected)),'Missing length derived by Pythagoras');ensure(/right|rectang|square|vertical wall/i.test(q.prompt.en),'Original prompt supplies right-angle premise');break;}
  case 'hypotenuse-name':ensure(['A','B','C'].includes(a.rightAt),'Named right vertex');actual=[...'ABC'].filter(v=>v!==a.rightAt).join('');expect(actual,a.expected,'Side opposite the right angle');expect(sq(k.c),add(sq(k.a),sq(k.b)),'Actual right triangle');break;
  case 'converse':{const[x,y,z]=a.sides.map(v=>F(v)).sort(compare);actual=compare(x,0)>0&&compare(add(x,y),z)>0&&equal(add(sq(x),sq(y)),sq(z));expect(actual,a.valid,'Strict triangle existence and longest-side equality');expect(actual,a.expected,'Converse conclusion');break;}
  case 'isosceles-area':{ensure(compare(k.equalSide,div(k.base,2))>0,'Isosceles triangle exists');const height=root(sub(sq(k.equalSide),sq(div(k.base,2))));ensure(radicalEqual(height,evaluateRadical(a.expected.height)),'Apex median is perpendicular, exact height');ensure(radicalEqual(radicalMultiply(height,scalar(div(k.base,2))),evaluateRadical(a.expected.area)),'Half base times height');break;}
  case 'coordinate-converse':{const p=a.points,segments=['AB','AC','BC'];expect(a.sides,segments.map(s=>Math.sqrt(length2(p,s))),'Lengths from original coordinates');ensure(perpendicular(p,[a.expected,'ABC'.split('').find(v=>v!==a.expected)],[a.expected,'ABC'.split('').filter(v=>v!==a.expected)[1]]),'Original coordinate vectors perpendicular');expect(a.valid,true,'Coordinate converse');break;}
  case 'rectangle-converse':ensure(/parallelogram/.test(q.prompt.en),'Parallelogram premise retained for rectangle converse');ensure(equal(add(sq(k.a),sq(k.b)),sq(k.c)),'Converse gives a right angle');expect(a.expected,'rectangle','One right angle in a parallelogram');expect(a.valid,true,'Rectangle converse');break;
  default:throw Error('Unknown Pythagoras request '+a.request);
 }
 if(q.answerExpression&&actual instanceof Map)ensure(radicalEqual(actual,evaluateRadical(q.answerExpression)),'Teacher length expression');if(q.numericAnswer!==undefined&&actual instanceof Map)ensure(close(q.numericAnswer,radicalNumber(actual)),'Numeric missing length');return true;
}
const segment=s=>[...s].sort().join('');
/** Derives shape properties only from declared givens; coordinates corroborate or refute. */
export function quadrilateralProperties(g){
 const parent=new Map(),find=s=>{s=segment(s);if(!parent.has(s))parent.set(s,s);if(parent.get(s)!==s)parent.set(s,find(parent.get(s)));return parent.get(s);},join=(a,b)=>parent.set(find(a),find(b));
 for(const[a,b]of g.equalSegments||[])join(a,b);const eq=(a,b)=>find(a)===find(b),has=(list,a,b)=>list?.some(([x,y])=>segment(x)===segment(a)&&segment(y)===segment(b)||segment(x)===segment(b)&&segment(y)===segment(a));
 const opposite=[['AB','CD'],['AD','BC']],twoParallel=opposite.every(([a,b])=>has(g.parallel,a,b)),twoEqual=opposite.every(([a,b])=>eq(a,b)),sameParallelEqual=opposite.some(([a,b])=>has(g.parallel,a,b)&&eq(a,b));
 const bothBisected=Object.entries(g.intersection||{}).some(([o,lines])=>lines.map(segment).includes('AC')&&lines.map(segment).includes('BD')&&eq('A'+o,o+'C')&&eq('B'+o,o+'D'));
 const allSidesEqual=['BC','CD','DA'].every(s=>eq('AB',s)),adjacentEqual=[['AB','BC'],['BC','CD'],['CD','DA'],['DA','AB']].some(([a,b])=>eq(a,b));
 const p=!!(g.parallelogram||g.rectangle||g.rhombus||g.square||twoParallel||twoEqual||sameParallelEqual||bothBisected||allSidesEqual),r=!!(g.rectangle||g.square||p&&(g.rightAngles?.length||eq('AC','BD'))),h=!!(g.rhombus||g.square||allSidesEqual||p&&(adjacentEqual||has(g.perpendicular,'AC','BD')));
 return {parallelogram:p,rectangle:r,rhombus:h,square:!!(g.square||r&&h),eq};
}
function checkQuadrilateral(a,q){
 const p=a.points,g=a.givens,properties=quadrilateralProperties(g);ensure(p.A&&p.B&&p.C&&!close(cross(vector(p,'AB'),vector(p,'AC')),0),'Original figure is nondegenerate');
 if(p.D&&a.request!=='midsegment'&&!g.midpoints){const turns=[...'ABCD'].map((v,i)=>cross(vector(p,[v,'ABCD'[(i+1)%4]]),vector(p,['ABCD'[(i+1)%4],'ABCD'[(i+2)%4]])));ensure(turns.every(v=>v>1e-8)||turns.every(v=>v< -1e-8),'Simple convex ordered quadrilateral');}
 const actualP=p.D&&parallel(p,'AB','CD')&&parallel(p,'AD','BC'),actualR=actualP&&perpendicular(p,'AB','AD'),actualH=actualP&&['BC','CD','DA'].every(s=>close(length2(p,'AB'),length2(p,s))),actualShapes={parallelogram:!!actualP,rectangle:!!actualR,rhombus:!!actualH,square:!!(actualR&&actualH)};
 for(const name of ['parallelogram','rectangle','rhombus','square'])if(g[name])ensure(actualShapes[name],'Declared '+name+' matches coordinates');
 for(const[x,y]of g.parallel||[])ensure(parallel(p,x,y),'Declared parallel segments');for(const[x,y]of g.perpendicular||[])ensure(perpendicular(p,x,y),'Declared perpendicular segments');for(const[x,y]of g.equalSegments||[])ensure(close(length2(p,x),length2(p,y)),'Declared equal segments '+x+'/'+y);for(const angle of g.rightAngles||[])ensure(close(angleDegrees(p,angle),90),'Declared right angle');
 for(const[m,side]of Object.entries(g.midpoints||{}))ensure(midpoint(p,m,side),'Declared midpoint');for(const[o,lines]of Object.entries(g.intersection||{}))for(const side of lines){const[u]=[...side];ensure(parallel(p,[u,o],side),'Declared diagonal intersection');}
 for(const labels of g.collinear||[])ensure(close(cross(vector(p,labels.slice(0,2)),vector(p,[labels[0],labels[2]])),0),'Declared collinearity');
 for(const[s,value]of Object.entries(g.lengths||{})){const v=radicalNumber(evaluateRadical(value));ensure(v>0&&close(v*v,length2(p,s)),'Exact given length matches original points '+s);}for(const[label,degrees]of Object.entries(g.angles||{}))ensure(close(angleDegrees(p,label),Number(degrees)),'Given angle matches original points');
 if(a.request==='classification'){ensure(Object.hasOwn(actualShapes,a.classification),'Known quadrilateral class');expect(a.expected,a.classification,'Requested class');if(a.valid){ensure(properties[a.classification],'Declared hypotheses suffice for '+a.classification);ensure(actualShapes[a.classification],'Coordinates satisfy proved class');}else{ensure(!properties[a.classification],'Rejected claim is not already forced by the givens');ensure(!actualShapes[a.classification],'Concrete counterexample fails the claimed class');}return true;}
 ensure(a.valid===true,'Property requests need valid hypotheses');
 const links=[],link=(x,y,factor=1)=>{links.push([segment(x),segment(y),F(factor)],[segment(y),segment(x),div(1,factor)]);};
 for(const[x,y]of g.equalSegments||[])link(x,y);if(properties.parallelogram){link('AB','CD');link('AD','BC');for(const[o,lines]of Object.entries(g.intersection||{})){if(lines.map(segment).includes('AC')&&lines.map(segment).includes('BD')){link('AC','A'+o,2);link('A'+o,o+'C');link('BD','B'+o,2);link('B'+o,o+'D');}}}if(properties.rectangle)link('AC','BD');if(properties.rhombus)for(const s of ['BC','CD','DA'])link('AB',s);
 if(g.midpoints?.D==='AB'&&g.midpoints?.E==='AC')link('BC','DE',2);
 if(g.midpoints?.M==='BC'&&g.rightAngles?.some(label=>label[1]==='A')){link('BC','AM',2);link('AM','BM');link('BM','CM');}
 const known=new Map(Object.entries(g.lengths||{}).map(([s,v])=>[segment(s),evaluateRadical(v)]));
 const propagate=()=>{let changed=true;while(changed){changed=false;for(const[x,y,factor]of links)if(known.has(y)){const value=radicalMultiply(known.get(y),scalar(factor));if(known.has(x))ensure(radicalEqual(value,known.get(x)),'Consistent theorem-derived lengths');else{known.set(x,value);changed=true;}}}};propagate();
 if(properties.square&&known.has('AB')&&!known.has('AC'))known.set('AC',radicalMultiply(known.get('AB'),radicalRoot(2)));
 if(properties.rhombus&&known.has('AC')&&known.has('BD')&&!known.has('AB')&&a.request==='length'&&['AB','BC','CD','AD'].includes(segment(a.expected.segment))){const squared=radicalAdd(radicalMultiply(known.get('AC'),known.get('AC')),radicalMultiply(known.get('BD'),known.get('BD')));ensure(squared.size===1&&squared.has(1n),'Rational diagonal square sum');known.set('AB',radicalRoot(div(squared.get(1n),4)));}propagate();
 let actual;
 switch(a.request){
  case 'length':actual=known.get(segment(a.expected.segment));ensure(actual,'Length must follow from declared lengths and theorem conditions');ensure(radicalEqual(actual,evaluateRadical(a.expected.value)),'Requested exact length');ensure(close(radicalNumber(actual)**2,length2(p,a.expected.segment)),'Derived length corroborated by coordinates');if(q.answerExpression){const parts=q.answerExpression.split('=');if(parts.length===2)expect(segment(parts[0]),segment(a.expected.segment),'Teacher names requested segment');ensure(parts.length<=2&&radicalEqual(actual,evaluateRadical(parts.at(-1))),'Teacher exact length');}break;
  case 'angle':{let degrees;if(properties.square&&g.intersection&&[...a.expected.angle][1]in g.intersection)degrees=90;else if(properties.parallelogram){const entries=Object.entries(g.angles||{});ensure(entries.length===1,'One supplied parallelogram angle');const[label,value]=entries[0],from=label[1],to=a.expected.angle[1],distance=Math.abs('ABCD'.indexOf(from)-'ABCD'.indexOf(to));degrees=distance%2?number(sub(180,value)):Number(value);}ensure(degrees!==undefined,'Angle follows from explicit shape theorem');expect(degrees,a.expected.degrees,'Derived angle');ensure(close(angleDegrees(p,a.expected.angle),degrees),'Derived angle agrees with coordinates');break;}
  case 'midsegment':ensure(g.midpoints?.D==='AB'&&g.midpoints?.E==='AC','Two distinct side midpoints required');ensure(g.collinear?.some(labels=>labels.join('')==='DEF')&&properties.eq('DE','EF'),'Construction extension is explicit');ensure(parallel(p,'DE','BC')&&close(length2(p,'DE')/length2(p,'BC'),1/4),'Midpoint theorem direction and half length');expect(a.expected,{parallel:['DE','BC'],ratio:'1/2'},'Midsegment conclusion');ensure(close(length2(p,'AD'),length2(p,'CF'))&&parallel(p,'DB','CF')&&parallel(p,'DF','BC'),'SAS construction creates the required parallelogram');break;
  case 'right-angle':ensure(g.midpoints?.M==='BC'&&properties.eq('AM','BM'),'Hypotenuse median converse requires midpoint and equal radius');expect(a.expected,'A','Apex angle');ensure(perpendicular(p,'AB','AC'),'Converse result corroborated by coordinates');break;
  case 'area':ensure(properties.rhombus&&known.has('AC')&&known.has('BD'),'Area needs rhombus and both given diagonals');actual=radicalMultiply(radicalMultiply(known.get('AC'),known.get('BD')),scalar('1/2'));ensure(radicalEqual(actual,evaluateRadical(a.expected)),'Half diagonal product');ensure(close(radicalNumber(actual),polygonArea(p)),'Area matches coordinates');break;
  case 'area-perimeter':ensure(properties.square&&known.has('AB'),'Square and supplied side');actual={area:radicalMultiply(known.get('AB'),known.get('AB')),perimeter:radicalMultiply(known.get('AB'),scalar(4))};for(const key of ['area','perimeter'])ensure(radicalEqual(actual[key],evaluateRadical(a.expected[key])),'Square '+key);ensure(close(radicalNumber(actual.area),polygonArea(p)),'Square area coordinates');break;
  default:throw Error('Unknown quadrilateral request '+a.request);
 }return true;
}
function checkRealClassification(a){
 if(a.rule==='root-order'){ensure(a.radicands.length===2&&a.radicands.every(v=>compare(v,0)>0)&&[1,-1].includes(a.sign),'Positive radicands and explicit sign');const match=a.expression.match(/^(-?)sqrt\((.+)\)([<>])(-?)sqrt\((.+)\)$/);ensure(match,'Explicit ordered square roots');expect(match[2],a.radicands[0],'First radicand');expect(match[5],a.radicands[1],'Second radicand');ensure((match[1]? -1:1)===a.sign&&(match[4]? -1:1)===a.sign,'Both signs');const order=compare(...a.radicands)*a.sign;expect(match[3]==='>'?order>0:order<0,a.valid,'Monotonic square root and sign reversal');return true;}
 let rationalValue;const recurring=a.expression.match(/^0\.\\overline\{(\d+)\}$/);if(recurring)rationalValue=F(recurring[1],String(10n**BigInt(recurring[1].length)-1n));else if(a.expression.startsWith('\\sqrt[3]')){const expression=normalizeRootTeX(a.expression),match=expression.match(/^cbrt\((.+)\)$/);ensure(match,'Canonical cube root');rationalValue=rationalRoot(match[1],3);}else{const value=evaluateRadical(a.expression);if(!value.size)rationalValue=F(0);else if(value.size===1&&value.has(1n))rationalValue=value.get(1n);}
 expect(rationalValue?'rational':'irrational',a.category,'Exact rational/irrational classification');if(a.rationalValue!==undefined)expect(rationalValue,a.rationalValue,'Exact rational value');return true;
}
function displayConstraints(expression){
 const text=String(expression).replace(/\\begin\{cases\}|\\end\{cases\}/g,'').replace(/\\(?:leq|le)(?![A-Za-z])/g,'<=').replace(/\\(?:geq|ge)(?![A-Za-z])/g,'>=').replace(/\s+/g,'');
 const result=[];for(const row of text.split('\\\\')){const parts=row.split(/(<=|>=|<|>|=)/);ensure(parts.length>=3&&parts.length%2===1,'Displayed relation has complete sides');for(let i=1;i<parts.length;i+=2){const left=parts[i-1],right=parts[i+1],operator=parts[i];if(operator==='=')result.push({left,right,operator:'<='},{left,right,operator:'>='});else result.push({left,right,operator});}}return result;
}
/** Checks readable input/output math separately from the audit object's calculations. */
export function checkLowerDisplays(q){
 const a=q.audit;
 if(a.kind==='linear-inequality'){
  const expected=solveConstraints(a.constraints);if(q.expression)expect(solveConstraints(displayConstraints(q.expression)),expected,'Displayed original inequality has the same feasible set');if(a.candidate!==undefined)expect(inInterval(a.candidate,expected),a.satisfies,'Candidate satisfies every original inequality');
  if(q.answerExpression){if(q.answerExpression==='\\varnothing')ensure(expected.empty,'Empty solution display');else if(q.answerExpression==='x\\in\\mathbb{R}')ensure(!expected.empty&&expected.lo===null&&expected.hi===null,'All-real solution display');else expect(solveConstraints(displayConstraints(q.answerExpression)),expected,'Displayed solution retains strict/closed endpoints');}
 }
 if(a.kind==='linear-function'){
  const checkLine=expression=>{const match=expression.match(/^([yCV])=(.+)$/);ensure(match,'Displayed dependent variable and formula');const variable=match[2].includes('n')?'n':match[2].includes('t')?'t':'x',coefficients=affine(match[2],variable);expect(coefficients.a,a.k,'Displayed function slope');expect(coefficients.b,a.b,'Displayed function intercept');};
  if(q.expression)checkLine(q.expression);
  if(q.answerExpression){const first=q.answerExpression.split(',\\quad')[0];if(['formula','domain','context-value'].includes(a.request))checkLine(first);else if(['value','zero','slope'].includes(a.request)){const match=first.match(/^[yxk]=(.+)$/);ensure(match,'Teacher scalar result has explicit requested symbol');expect(evaluateMath(match[1]),a.expected,'Teacher scalar function result');}else if(a.request==='inequality'&&/^x/.test(first)){const original=solveInequality(`(${a.k})x+(${a.b})`,'0',a.relation);expect(solveConstraints(displayConstraints(first)),original,'Teacher inequality solution');}}
 }
 if(a.kind==='arithmetic'&&q.answerExpression)expect(evaluateMath(q.answerExpression),a.expected,'Teacher arithmetic result');
 return true;
}
/** Every accepted audit family has an independent calculation; unknown kinds fail closed. */
/** Returns false only for an audit family not yet supported; unknown requests throw. */
export function checkLowerNumerical(q){
 const a=q.audit;let actual;
 switch(a.kind){
  case 'arithmetic':actual=evaluateMath(a.expression);expect(actual,a.expected,'Original arithmetic');break;
  case 'angle-relation':{ensure(compare(a.given,0)>0&&compare(a.given,180)<0,'Nondegenerate angle');const eq=['vertical','corresponding','alternate'].includes(a.relation),right=a.relation==='perpendicular-split';ensure(eq||right||['supplementary','cointerior'].includes(a.relation),'Known angle relation');if(['corresponding','alternate','cointerior'].includes(a.relation))ensure(a.parallelGiven===true,'Parallel hypothesis is required');actual=eq?F(a.given):sub(right?90:180,a.given);ensure(compare(actual,0)>0,'Positive angle remainder');expect(actual,a.expected,'Angle relation');break;}
  case 'linear-system':{const classification=classifyMatrix(a.matrix);if(a.classification){expect(classification,a.classification,'Original system rank');if(a.parameter){ensure(classification==='infinite','Parametric system must be dependent');a.matrix.forEach(row=>{const left=a.variables.map((v,i)=>`(${row[i]})*(${a.parameter[v]})`).join('+');ensure(expressionIdentity(left,String(row.at(-1))),'Parametric solution satisfies every original equation for all parameter values');});}break;}ensure(classification==='unique','Unique system required');actual=solveMatrix(a.matrix);expect(actual,a.solution,'Original system solution');originalSystemContext(a);if(q.expression){const rows=q.expression.replace(/\\begin\{cases\}|\\end\{cases\}/g,'').split('\\\\');ensure(rows.length===a.matrix.length,'Displayed system row count');rows.forEach((row,i)=>{const[left,right]=row.split('=');ensure(right!==undefined,'Displayed equation');const values=Object.fromEntries(a.variables.map((v,j)=>[v,actual[j]]));expect(evaluateMath(left,values),evaluateMath(right,values),'Displayed original equation');a.variables.forEach((v,j)=>{const zero=Object.fromEntries(a.variables.map(v=>[v,0])),one={...zero,[v]:1};expect(sub(evaluateMath(left,one),evaluateMath(left,zero)),a.matrix[i][j],'Displayed original coefficient');});expect(evaluateMath(right),a.matrix[i].at(-1),'Displayed right-hand side');});}break;}
  case 'linear-system-check':actual=a.matrix.every(row=>equal(sum(a.candidate.map((v,i)=>mul(v,row[i]))),row.at(-1)));expect(actual,a.satisfies,'Every original equation checked');break;
  case 'linear-inequality':actual=solveConstraints(a.constraints);expect(actual,a.interval,'Original inequality intersection');if(a.integerRange)expect(integerBounds(actual),a.integerRange,'Feasible integer endpoints');if(a.context){const c=a.context;ensure(c.kind==='fixed-budget','Known inequality context');expect(a.constraints.length,2,'Budget and minimum both included');ensure(expressionIdentity(a.constraints[0].left,`(${c.rate})x+(${c.fixed})`),'Budget costs reconstructed from original quantities');expect(a.constraints[0].right,c.budget,'Original budget');expect(a.constraints[0].operator,'<=','Budget is an upper limit');ensure(expressionIdentity(a.constraints[1].left,'x'),'Minimum applies to count');expect(a.constraints[1].right,c.minimum,'Minimum count');expect(a.constraints[1].operator,'>=','Minimum restriction');}break;
  case 'root':{switch(a.operation){case 'principal':case 'square-roots':{actual=rationalRoot(a.radicand,2);ensure(actual!==null,'Expected exact rational square root');expect(actual,a.expected,'Nonnegative principal root');if(a.operation==='square-roots'){const solutions=actual.n?[actual,mul(-1,actual)]:[F(0)];expect(a.solutions.length,solutions.length,'All square roots');ensure(a.solutions.every(v=>solutions.some(s=>equal(v,s))),'Both signed roots');}break;}case 'cube-root':actual=rationalRoot(a.radicand,3);ensure(actual!==null,'Exact real cube root');expect(actual,a.expected,'Unique signed cube root');break;case 'sqrt-square':expect(mul(a.input,a.input),a.radicand,'Squared input');actual=F(a.input);if(actual.n<0n)actual=mul(-1,actual);expect(actual,a.expected,'Absolute value of input');break;case 'domain':if(a.variable){const interval=solveInequality(a.radicand,'0','>=');expect(interval,a.interval,'Original radicand domain');actual=!interval.empty;}else actual=compare(a.radicand,0)>=0;expect(actual,a.valid,'Real square-root domain');break;case 'bounds':ensure(compare(a.lower,0)>=0&&compare(mul(a.lower,a.lower),a.radicand)<0&&compare(mul(a.upper,a.upper),a.radicand)>0,'Exact squared lower/upper bounds');break;case 'square-root-equation':{ensure(a.solutions.length===2,'Both square-root branches');const values=a.solutions.map(evaluateRadical);values.forEach(value=>ensure(radicalEqual(radicalMultiply(value,value),scalar(a.radicand)),'Original square equation'));ensure(!radicalEqual(values[0],values[1]),'Distinct roots');break;}case 'absolute-opposite':ensure(a.inputSign===-1,'Stated negative root');ensure(radicalIdentity(a.expected,`sqrt(${a.radicand})`),'Absolute value of negative root');break;case 'approximation':{const digits=String(a.givenApproximation).split('.')[1].length,tolerance=F(1,2n*10n**BigInt(digits)),lo=sub(a.givenApproximation,tolerance),hi=add(a.givenApproximation,tolerance);ensure(compare(mul(lo,lo),a.radicand)<=0&&compare(mul(hi,hi),a.radicand)>=0,'Given rounded root is consistent');actual=roundExact(evaluateMath(a.substitution),a.digits);expect(actual,a.expected,'Requested rounded substituted value');break;}default:throw Error('Unknown root operation '+a.operation);}break;}
  case 'radical':actual=radicalIdentity(a.original,a.result,a.variable);expect(actual,a.valid,'Exact radical identity and sign');for(const restriction of a.restrictions||[]){ensure(['>','>='].includes(restriction.relation),'Known radical restriction');const c=compare(evaluateMath(restriction.expression),restriction.value);ensure(restriction.relation==='>'?c>0:c>=0,'Original radical restriction');}if(a.valid&&q.expression){if(a.variable){const left=normalizeRootTeX(q.expression).match(/^sqrt\((.+)\)$/),right=normalizeRootTeX(a.original).match(/^sqrt\((.+)\)$/);ensure(left&&right&&expressionIdentity(left[1],right[1]),'Displayed symbolic radicand');}else ensure(radicalIdentity(q.expression,a.original),'Displayed original radical');}if(a.valid&&q.answerExpression)ensure(a.variable?normalizeRootTeX(q.answerExpression)===normalizeRootTeX(a.result):radicalIdentity(q.answerExpression,a.result),'Displayed radical answer');break;
  case 'radical-domain':actual=a.radicands.reduce((i,r)=>intersect(i,solveInequality(`(${r.a})x+(${r.b})`,'0',r.denominator?'>':'>=')),all());expect(actual,{lo:a.interval.min??null,hi:a.interval.max??null,loClosed:!!a.interval.minInclusive,hiClosed:!!a.interval.maxInclusive,...(a.interval.empty?{empty:true}:{})},'All original radicand/denominator conditions');break;
  case 'root-arithmetic':{let original=new Map();a.terms.forEach(term=>original=radicalAdd(original,radicalMultiply(scalar(term.coefficient),radicalRoot(term.radicand))));ensure(radicalEqual(original,radicalMultiply(scalar(a.result.coefficient),radicalRoot(a.result.radicand))),'Exact root arithmetic');break;}
  case 'rational-expression':ensure(expressionIdentity(a.original,a.result),'Original rational identity');expect(originalDomain([a.original],a.variable),a.excluded,'Original forbidden values');break;
  case 'statistics':actual=checkStatistics(a);break;
  case 'histogram':{const h=checkHistogram(a);switch(a.request){case 'heights':actual=h.heights;break;case 'frequencies':actual=h.frequencies;break;case 'tail-frequency':expect(a.bins[a.fromBin].lo,a.threshold,'Requested tail boundary');actual=div(sum(h.frequencies.slice(a.fromBin)),h.total);break;case 'frequency':ensure(a.bins.length===1,'One stated bin');actual=h.frequencies[0];break;case 'midpoints':actual=a.bins.map((bin,i)=>[div(add(bin.lo,bin.hi),2),h.frequencies[i]]);break;case 'group-count':ensure(a.bins.every(bin=>equal(sub(bin.hi,bin.lo),sub(a.bins[0].hi,a.bins[0].lo))),'Common group width');actual={groups:a.bins.length,width:sub(a.bins[0].hi,a.bins[0].lo)};break;case 'larger-frequency':actual=h.frequencies.reduce((best,v,i)=>compare(v,h.frequencies[best])>0?i:best,0);break;default:throw Error('Unknown histogram request '+a.request);}expect(actual,a.expected,'Original histogram');break;}
  case 'function-relation':{const outputs=new Map();actual=true;for(const[x,y]of a.pairs){const key=format(x);if(outputs.has(key)&&!equal(outputs.get(key),y))actual=false;outputs.set(key,F(y));}expect(actual,a.valid,'Each input has one output');break;}
  case 'linear-function':actual=checkFunction(a);break;
  case 'translation':return checkTranslation(a);
  case 'geometry-fact':return checkGeometryFact(a,q);
  case 'survey':return checkSurvey(a);
  case 'pythagoras':return checkPythagoras(a,q);
  case 'quadrilateral':return checkQuadrilateral(a,q);
  case 'real-classification':return checkRealClassification(a);
  case 'coordinate':switch(a.request){case 'quadrant':{const[x,y]=a.point.map(v=>compare(v,0));ensure(x&&y,'A quadrant excludes axes');actual=x>0?(y>0?'I':'IV'):(y>0?'II':'III');break;}case 'axis':{const[x,y]=a.point.map(v=>compare(v,0));ensure(!x||!y,'Point lies on an axis');actual=!x&&!y?'origin':!x?'y':'x';break;}case 'map':ensure(compare(a.unit,0)>0,'Positive coordinate unit');actual=a.displacementMetres.map(v=>div(v,a.unit));expect(actual,a.point,'Original map displacement');break;case 'plot':actual=a.points;ensure(Object.values(a.points).every(v=>v.length===2),'Ordered planar coordinates');break;default:throw Error('Unknown coordinate request '+a.request);}expect(actual,a.expected,'Original coordinate task');break;
  default:throw Error('Unknown lower audit kind '+a.kind);
 }
 if(q.numericAnswer!==undefined&&actual!==undefined&&typeof actual!=='boolean'&&!Array.isArray(actual)){try{const expected=actual instanceof Map?radicalNumber(actual):number(actual);ensure(close(Number(q.numericAnswer),expected),'Numeric answer matches independently derived value');}catch(error){if(actual&&typeof actual==='object'&&!('n'in actual))return true;throw error;}}
 return true;
}
