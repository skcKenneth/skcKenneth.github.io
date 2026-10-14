/** Independent QA mathematics. No production generators, answer keys, eval or CAS. */
const abs = n => n < 0n ? -n : n;
const gcd = (a,b) => { a=abs(a);b=abs(b);while(b){[a,b]=[b,a%b];}return a; };
export function rational(value, denominator) {
  if(value && typeof value==='object' && 'n' in value && 'd' in value)return rational(value.n,value.d);
  if(denominator!==undefined){let n=BigInt(value),d=BigInt(denominator);if(!d)throw Error('zero denominator');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return {n:n/g,d:d/g};}
  const text=String(value).trim();
  if(text.includes('/')){const parts=text.split('/');if(parts.length!==2)throw Error('invalid rational '+text);return divide(rational(parts[0]),rational(parts[1]));}
  const match=/^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(text);
  if(!match||!(match[2]||match[3]))throw Error('invalid exact number '+text);
  const places=(match[3]||'').length-Number(match[4]||0),digits=BigInt((match[2]||'0')+(match[3]||''))*(match[1]==='-'?-1n:1n);
  if(Math.abs(places)>100)throw Error('number exponent beyond QA bound');
  return places>=0?rational(digits,10n**BigInt(places)):rational(digits*10n**BigInt(-places),1n);
}
export const add=(a,b)=>{a=rational(a);b=rational(b);return rational(a.n*b.d+b.n*a.d,a.d*b.d);};
export const subtract=(a,b)=>{a=rational(a);b=rational(b);return rational(a.n*b.d-b.n*a.d,a.d*b.d);};
export const multiply=(a,b)=>{a=rational(a);b=rational(b);return rational(a.n*b.n,a.d*b.d);};
export const divide=(a,b)=>{a=rational(a);b=rational(b);return rational(a.n*b.d,a.d*b.n);};
export const equal=(a,b)=>{a=rational(a);b=rational(b);return a.n===b.n&&a.d===b.d;};
export const number=a=>{a=rational(a);return Number(a.n)/Number(a.d);};
export const format=a=>{a=rational(a);return a.d===1n?String(a.n):`${a.n}/${a.d}`;};
export function power(a,n){a=rational(a);if(!Number.isInteger(n)||Math.abs(n)>30)throw Error('power beyond QA bound');if(!a.n&&n<=0)throw Error('zero base with nonpositive exponent');return n>=0?rational(a.n**BigInt(n),a.d**BigInt(n)):rational(a.d**BigInt(-n),a.n**BigInt(-n));}

const monomial=entries=>Object.entries(entries).filter(([,n])=>n).sort(([a],[b])=>a.localeCompare(b)).map(([v,n])=>`${v}:${n}`).join(',');
const exponents=key=>Object.fromEntries(key?key.split(',').map(part=>{const[v,n]=part.split(':');return[v,Number(n)];}):[]);
const constant=value=>{const a=rational(value);return new Map(a.n?[['',a]]:[]);};
const variable=name=>new Map([[name+':1',rational(1)]]);
function polyAdd(a,b,negative=false){const out=new Map(a);for(const[key,value]of b){const sum=add(out.get(key)||0,negative?multiply(value,-1):value);if(sum.n)out.set(key,sum);else out.delete(key);}return out;}
function polyMultiply(a,b){let out=new Map();for(const[ka,va]of a)for(const[kb,vb]of b){const powers=exponents(ka);for(const[v,n]of Object.entries(exponents(kb)))powers[v]=(powers[v]||0)+n;out=polyAdd(out,new Map([[monomial(powers),multiply(va,vb)]]));}if(out.size>1000)throw Error('polynomial expansion beyond QA bound');return out;}
function polyPower(a,n){let out=constant(1);for(let i=0;i<n;i++)out=polyMultiply(out,a);return out;}
function polyEqual(a,b){return a.size===b.size&&[...a].every(([key,value])=>b.has(key)&&equal(value,b.get(key)));}
function polyEvaluate(poly,values){let sum=rational(0);for(const[key,coefficient]of poly){let value=coefficient;for(const[v,n]of Object.entries(exponents(key))){if(!(v in values))throw Error('missing value for '+v);value=multiply(value,power(values[v],n));}sum=add(sum,value);}return sum;}
const fraction=(p,q=constant(1),denominators=[])=>({p,q,denominators});
function combine(a,b,operator){
  const denominators=[...a.denominators,...b.denominators];
  if(operator==='+')return fraction(polyAdd(polyMultiply(a.p,b.q),polyMultiply(b.p,a.q)),polyMultiply(a.q,b.q),denominators);
  if(operator==='-')return fraction(polyAdd(polyMultiply(a.p,b.q),polyMultiply(b.p,a.q),true),polyMultiply(a.q,b.q),denominators);
  if(operator==='*')return fraction(polyMultiply(a.p,b.p),polyMultiply(a.q,b.q),denominators);
  if(!b.p.size)throw Error('division by the zero expression');
  return fraction(polyMultiply(a.p,b.q),polyMultiply(a.q,b.p),[...denominators,b.p]);
}
function tokenize(input){
  let text=String(input).replace(/\\(?:left|right)/g,'').replace(/\\(?:,|;|!|quad|qquad)/g,' ').replace(/\\(?:times|cdot)/g,'*').replace(/\\div/g,'/').replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/\\\(|\\\)|\$/g,'');
  const tokens=[];
  while(text.length){const spaces=/^\s+/.exec(text);if(spaces){text=text.slice(spaces[0].length);continue;}const token=/^(\\frac|\d+(?:\.\d+)?|\.\d+|[A-Za-z]|[+\-*/^(){}])/.exec(text);if(!token)throw Error('unsupported mathematical token: '+text.slice(0,35));tokens.push(token[0]);text=text.slice(token[0].length);}
  if(tokens.length>500)throw Error('expression beyond QA bound');return tokens;
}
/** Powers precede unary signs: -3^2=-9, while (-3)^2=9. */
export function parseMath(input){
  const tokens=tokenize(input);let position=0;
  const current=()=>tokens[position];
  function group(){const open=current();if(!['(','{'].includes(open))throw Error('expected group');position++;const value=sum(),close=open==='('?')':'}';if(current()!==close)throw Error('unclosed group');position++;return value;}
  function atom(){const token=current();if(token==='('||token==='{')return group();if(token==='\\frac'){position++;const a=group(),b=group();return combine(a,b,'/');}if(/^\d|^\./.test(token||'')){position++;return fraction(constant(token));}if(/^[A-Za-z]$/.test(token||'')){position++;return fraction(variable(token));}throw Error('expected mathematical atom at '+position);}
  function exponent(){let a=atom();if(current()==='^'){position++;const b=unary();const value=evaluateParsed(b,{}),n=number(value);if(value.d!==1n||Math.abs(n)>12)throw Error('integer exponent required within QA bound');a=n>0?fraction(polyPower(a.p,n),polyPower(a.q,n),a.denominators):n===0?fraction(constant(1),constant(1),[...a.denominators,a.p]):fraction(polyPower(a.q,-n),polyPower(a.p,-n),[...a.denominators,a.p]);}return a;}
  function unary(){if(current()==='+'){position++;return unary();}if(current()==='-'){position++;const a=unary();return fraction(polyMultiply(a.p,constant(-1)),a.q,a.denominators);}return exponent();}
  const startsAtom=token=>token==='('||token==='{'||token==='\\frac'||/^\d|^\./.test(token||'')||/^[A-Za-z]$/.test(token||'');
  function product(){let a=unary();while(current()==='*'||current()==='/'||startsAtom(current())){const explicit=current()==='*'||current()==='/',operator=explicit?tokens[position++]:'*';a=combine(a,unary(),operator);}return a;}
  function sum(){let a=product();while(current()==='+'||current()==='-'){const operator=tokens[position++];a=combine(a,product(),operator);}return a;}
  if(!tokens.length)throw Error('empty expression');const result=sum();if(position!==tokens.length)throw Error('unexpected token '+current());return result;
}
export function evaluateParsed(parsed,values={}){for(const denominator of parsed.denominators)if(!polyEvaluate(denominator,values).n)throw Error('outside original expression domain');return divide(polyEvaluate(parsed.p,values),polyEvaluate(parsed.q,values));}
export const evaluateMath=(expression,values={})=>evaluateParsed(parseMath(expression),values);
export function expressionIdentity(left,right){const a=parseMath(left),b=parseMath(right);return polyEqual(polyMultiply(a.p,b.q),polyMultiply(b.p,a.q));}
export function proportionalExpressions(left,right){const a=parseMath(left),b=parseMath(right),p=polyMultiply(a.p,b.q),q=polyMultiply(b.p,a.q);if(!p.size||!q.size)return !p.size&&!q.size;if(p.size!==q.size)return false;let ratio;for(const[key,value]of p){if(!q.has(key))return false;const next=divide(value,q.get(key));if(ratio&&!equal(ratio,next))return false;ratio=next;}return true;}
export function polynomialCoefficients(expression){const a=parseMath(expression);if(a.q.size!==1||!a.q.has(''))throw Error('not a polynomial');const scalar=a.q.get('');return new Map([...a.p].map(([key,value])=>[key,divide(value,scalar)]));}
export function monomialDomainVariables(expression){const parsed=parseMath(expression),variables=new Set();for(const denominator of parsed.denominators){if(denominator.size!==1)throw Error('declared monomial-division audit has a nonmonomial divisor');for(const variable of Object.keys(exponents([...denominator.keys()][0])))variables.add(variable);}return [...variables].sort();}
export function variablesIn(expression){return [...new Set(tokenize(expression).filter(token=>/^[A-Za-z]$/.test(token)))].sort();}
export function factorLeaves(expression){
 const tokens=tokenize(expression),factors=[];let i=0;
 if(tokens[i]==='-'||tokens[i]==='+'){if(tokens[i++]==='-')factors.push('-1');}
 while(i<tokens.length){if(tokens[i]==='*'){i++;continue;}let factor;
  if(['(','{'].includes(tokens[i])){const start=i,stack=[];do{const token=tokens[i++];if(['(','{'].includes(token))stack.push(token);else if([')','}'].includes(token)){const open=stack.pop();if(!open||(open==='(')!==(token===')'))throw Error('invalid factored grouping');}}while(stack.length&&i<tokens.length);if(stack.length)throw Error('unclosed factor');factor=tokens.slice(start,i).join('');}
  else if(/^\d|^\./.test(tokens[i]||'')||/^[A-Za-z]$/.test(tokens[i]||''))factor=tokens[i++];
  else throw Error('result is not a product of factors');
  let exponent=1;if(tokens[i]==='^'){i++;let text;if(tokens[i]==='{'){i++;text=tokens[i++];if(tokens[i++]!=='}')throw Error('invalid factor exponent');}else text=tokens[i++];exponent=Number(text);if(!Number.isInteger(exponent)||exponent<1||exponent>12)throw Error('invalid factor exponent');}
  for(let n=0;n<exponent;n++)factors.push(factor);
 }
 return factors;
}
/** Completeness for the authored integer linear/quadratic factor families. */
export function integerFactorIsIrreducible(expression){
 const poly=polynomialCoefficients(expression);if(!poly.size)return false;
 if([...poly.values()].some(value=>value.d!==1n))throw Error('integer factorisation requires integer coefficients');
 const degrees=[...poly.keys()].map(key=>Object.values(exponents(key)).reduce((sum,n)=>sum+n,0)),degree=Math.max(...degrees);
 if(degree===0)return true;
 const content=[...poly.values()].reduce((common,value)=>gcd(common,value.n),0n);if(content!==1n)return false;
 const variables=variablesIn(expression);
 if(degree===1)return true;
 if(variables.length===1&&degree===2){try{return polynomialRoots(poly,variables[0]).classification==='none';}catch(error){if(/irrational roots/.test(error.message))return true;throw error;}}
 // A primitive polynomial linear in one variable with nonzero constant leading
 // coefficient is irreducible over the remaining integer polynomial ring.
 for(const variable of variables){const involving=[...poly].filter(([key])=>(exponents(key)[variable]||0)>0);if(involving.length===1){const[key,coefficient]=involving[0],powers=exponents(key);if(powers[variable]===1&&Object.keys(powers).length===1&&abs(coefficient.n)===1n)return true;}}
 throw Error('factor irreducibility exceeds the explicitly supported authored families');
}
function integerSqrt(n){if(n<0n)throw Error('negative square root');if(n<2n)return n;let a=n,b=(a+1n)/2n;while(b<a){a=b;b=(a+n/a)/2n;}return a;}
function sqrtRational(a){a=rational(a);if(a.n<0n)return null;const n=integerSqrt(a.n),d=integerSqrt(a.d);if(n*n!==a.n||d*d!==a.d)throw Error('irrational roots need an explicitly extended independent audit');return rational(n,d);}
function univariateCoefficients(poly,variableName){const coefficients=[];for(const[key,value]of poly){const powers=exponents(key),degree=powers[variableName]||0;if(Object.keys(powers).some(v=>v!==variableName))throw Error('root audit supports one variable');coefficients[degree]=add(coefficients[degree]||0,value);}return Array.from({length:coefficients.length},(_,i)=>coefficients[i]||rational(0));}
function divideLinear(poly,root,variableName){const coefficients=univariateCoefficients(poly,variableName),out=Array(Math.max(0,coefficients.length-1)).fill(null);if(!out.length)throw Error('cannot divide constant polynomial');out[out.length-1]=coefficients.at(-1);for(let i=out.length-2;i>=0;i--)out[i]=add(coefficients[i+1],multiply(root,out[i+1]));if(!equal(add(coefficients[0],multiply(root,out[0])),0))throw Error('linear factor has nonzero remainder');return new Map(out.flatMap((value,i)=>value.n?[[i?variableName+':'+i:'',value]]:[]));}
function positiveDivisors(value){value=abs(value);if(value>1000000n)throw Error('rational-root search exceeds independent QA bound');const out=[];for(let n=1n;n*n<=value;n++)if(value%n===0n){out.push(n);if(n*n!==value)out.push(value/n);}return out;}
export function polynomialRoots(poly,variableName='x'){
  const raw=univariateCoefficients(poly,variableName);
  if(raw.length>3){
    if(!raw[0].n){const remainder=polynomialRoots(divideLinear(poly,rational(0),variableName),variableName);return {classification:'finite',roots:[rational(0),...remainder.roots.filter(value=>value.n)]};}
    const common=raw.reduce((d,value)=>d/gcd(d,value.d)*value.d,1n),integers=raw.map(value=>value.n*(common/value.d));
    for(const numerator of positiveDivisors(integers[0]))for(const denominator of positiveDivisors(integers.at(-1)))for(const sign of [-1n,1n]){const root=rational(sign*numerator,denominator);if(!polyEvaluate(poly,{[variableName]:root}).n){const remainder=polynomialRoots(divideLinear(poly,root,variableName),variableName);return {classification:'finite',roots:[root,...remainder.roots.filter(value=>!equal(value,root))]};}}
    throw Error('unfactored higher-degree real roots exceed independent audit support');
  }
  const coefficients=[raw[0]||rational(0),raw[1]||rational(0),raw[2]||rational(0)];
  const[c,b,a]=coefficients;if(!a.n){if(!b.n)return {classification:c.n?'none':'all',roots:[]};return {classification:'finite',roots:[divide(multiply(c,-1),b)]};}
  const discriminant=subtract(multiply(b,b),multiply(4,multiply(a,c))),root=sqrtRational(discriminant);if(root===null)return {classification:'none',roots:[]};const roots=[divide(add(multiply(b,-1),root),multiply(2,a)),divide(subtract(multiply(b,-1),root),multiply(2,a))];return {classification:'finite',roots:roots.filter((value,i)=>!roots.slice(0,i).some(other=>equal(value,other)))};
}
export function originalDomain(expressions,variableName='x'){
  const roots=[];for(const expression of expressions){const parsed=typeof expression==='string'?parseMath(expression):expression;for(const denominator of parsed.denominators){const found=polynomialRoots(denominator,variableName);if(found.classification==='all')throw Error('zero original denominator');for(const root of found.roots)if(!roots.some(value=>equal(value,root)))roots.push(root);}}
  return roots.sort((a,b)=>number(a)-number(b));
}
export function solveEquation(left,right,variableName='x'){
  const a=parseMath(left),b=parseMath(right),domain=originalDomain([a,b],variableName);let cross=polyAdd(polyMultiply(a.p,b.q),polyMultiply(b.p,a.q),true);
  for(const root of domain)while(cross.size&&univariateCoefficients(cross,variableName).length>1&&!polyEvaluate(cross,{[variableName]:root}).n)cross=divideLinear(cross,root,variableName);
  const solved=polynomialRoots(cross,variableName);
  const roots=solved.roots.filter(root=>!domain.some(excluded=>equal(root,excluded))).filter(root=>equal(evaluateParsed(a,{[variableName]:root}),evaluateParsed(b,{[variableName]:root})));
  return {classification:solved.classification==='finite'&&!roots.length?'none':solved.classification,solutions:roots,excluded:domain};
}
export const squaredDistance=(a,b)=>a.reduce((sum,value,i)=>sum+(Number(value)-Number(b[i]))**2,0);
export const near=(a,b,tolerance=1e-8)=>Math.abs(a-b)<=tolerance*Math.max(1,Math.abs(a),Math.abs(b));
const labels=value=>Array.isArray(value)?value:[...value];
const sideKey=side=>labels(side).sort().join('|');
const angleVertex=angle=>labels(angle)[1];
function cosine(points,angle){const[a,b,c]=labels(angle).map(label=>points[label]);if(!a||!b||!c)throw Error('angle references absent point');const u=a.map((value,i)=>value-b[i]),v=c.map((value,i)=>value-b[i]),length=Math.sqrt(u.reduce((s,n)=>s+n*n,0)*v.reduce((s,n)=>s+n*n,0));if(!length)throw Error('degenerate angle');return u.reduce((s,n,i)=>s+n*v[i],0)/length;}
/** Check only declared givens for sufficiency, then independently verify their coordinates. */
export function checkCongruence(audit){
  const {points,triangles,correspondence,criterion,givens}=audit,[first,second]=triangles;
  if(first.length!==3||second.length!==3||correspondence.length!==3||new Set(correspondence).size!==3||!correspondence.every(v=>second.includes(v)))throw Error('invalid triangle correspondence');
  const map=Object.fromEntries(first.map((v,i)=>[v,correspondence[i]])),sides=new Set(),angles=new Set(),rightVertices=new Set();
  for(const triangle of triangles){const[a,b,c]=triangle.map(label=>points[label]);if(!a||!b||!c||near((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]),0))throw Error('degenerate triangle');}
  for(const[left,right]of givens.equalSides||[]){const u=labels(left),v=labels(right);if(u.length!==2||v.length!==2||!u.every(label=>label in map)||sideKey(u.map(label=>map[label]))!==sideKey(v))throw Error('side given contradicts named correspondence');if(!near(squaredDistance(points[u[0]],points[u[1]]),squaredDistance(points[v[0]],points[v[1]])))throw Error('declared equal sides disagree with coordinates');sides.add(sideKey(u));}
  for(const[left,right]of givens.equalAngles||[]){const u=labels(left),v=labels(right);if(u.length!==3||v.length!==3||map[u[1]]!==v[1]||sideKey([map[u[0]],map[u[2]]])!==sideKey([v[0],v[2]]))throw Error('angle given contradicts named correspondence');if(!near(cosine(points,u),cosine(points,v)))throw Error('declared equal angles disagree with coordinates');angles.add(u[1]);}
  const right=new Set((givens.rightAngles||[]).map(angle=>{if(!near(cosine(points,angle),0))throw Error('declared right angle disagrees with coordinates');return angleVertex(angle);}));
  for(const vertex of first)if(right.has(vertex)&&right.has(map[vertex]))rightVertices.add(vertex);
  const includesSide=(a,b)=>sides.has(sideKey([a,b]));
  let sufficient=false;
  if(criterion==='SSS')sufficient=sides.size===3;
  if(criterion==='SAS')sufficient=first.some(v=>angles.has(v)&&first.filter(w=>w!==v).every(w=>includesSide(v,w)));
  if(criterion==='ASA')sufficient=[...angles].some((v,i,array)=>array.slice(i+1).some(w=>includesSide(v,w)));
  if(criterion==='AAS')sufficient=angles.size>=2&&[...sides].some(side=>{const[a,b]=side.split('|');return !angles.has(a)||!angles.has(b);});
  if(criterion==='HL')sufficient=[...rightVertices].some(v=>{const[a,b]=first.filter(w=>w!==v);return includesSide(a,b)&&(includesSide(v,a)||includesSide(v,b));});
  if(!['SSS','SAS','ASA','AAS','HL','AAA','SSA'].includes(criterion))throw Error('unsupported congruence criterion '+criterion);
  const coordinatesCongruent=first.every((v,i)=>first.every((w,j)=>near(squaredDistance(points[v],points[w]),squaredDistance(points[correspondence[i]],points[correspondence[j]]))));
  return {sufficient,coordinatesCongruent,equalGivenSideCount:sides.size,equalGivenAngleCount:angles.size,rightVertexCount:rightVertices.size};
}
