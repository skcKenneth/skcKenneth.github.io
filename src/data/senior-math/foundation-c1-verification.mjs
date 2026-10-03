/** Independent compulsory-1 recalculation from published givens, never authored solutions. */
import assert from 'node:assert/strict';
const match=(text,re)=>{const m=text.match(re);assert(m,`Cannot read given ${re}: ${text}`);return m.slice(1).map(Number);};
const one=(text,re)=>match(text,re)[0];
const integers=(low,high)=>Array.from({length:Math.max(0,Math.floor(high)-Math.ceil(low)+1)},(_,i)=>Math.ceil(low)+i);
const finiteSet=(n,start=1)=>Array.from({length:n},(_,i)=>i+start);
const subsets=n=>integers(0,2**n-1).map(mask=>finiteSet(n,0).filter(i=>(mask>>i)&1));
const optimize=(f,lo,hi,max=false)=>{for(let i=0;i<180;i++){const a=(2*lo+hi)/3,b=(lo+2*hi)/3;if((f(a)<f(b))!==max)hi=b;else lo=a;}return f((lo+hi)/2);};
const fraction=(text,re)=>{const[a,b]=match(text,re);return a/b;};
const rad=degrees=>degrees*Math.PI/180;
const rules=[];
const rule=(prompt,method,compute)=>rules.push({matches:typeof prompt==='string'?p=>p===prompt:p=>prompt.test(p),method,compute});

// Finite sets are constructed and counted; inclusion/exclusion answers are checked on actual witnesses.
rule('Count the distinct elements.','enumerate distinct set members',(p,e)=>new Set(e.match(/-?\d+/g).map(Number)).size);
rule('Count the integers satisfying the condition.','enumerate strict/inclusive integer interval',(p,e)=>{const[a,b]=match(e,/(-?\d+)<x\\le(-?\d+)/);return integers(a-1,b+1).filter(x=>a<x&&x<=b).length;});
rule('How many elements are in this set?','construct nested set objects',(p,e)=>{assert.equal(e,'A=\\{\\varnothing,\\{0\\}\\}');return new Set([new Set(),new Set([0])]).size;});
rule('How many elements are in this real solution set?','discriminant excludes all real roots',(p,e)=>{assert.equal(e,'A=\\{x\\in\\mathbb R:x^2+1=0\\}');const discriminant=0**2-4*1*1;return discriminant<0?0:discriminant===0?1:2;});
rule(/^How many (?:proper )?subsets does A have\?$/,'enumerate the power set',(p,e)=>{const n=one(e,/\|A\|=(\d+)/);return subsets(n).filter(s=>!p.includes('proper')||s.length<n).length;});
rule('How many subsets must contain one specified element?','enumerate subsets containing fixed member',(p,e)=>subsets(one(e,/\|A\|=(\d+)/)).filter(s=>s.includes(0)).length);
rule('Count the nonempty subsets that omit one specified element.','enumerate nonempty subsets omitting fixed member',(p,e)=>subsets(one(e,/\|A\|=(\d+)/)).filter(s=>s.length&&!s.includes(0)).length);
rule('Find the cardinality of the intersection.','construct both consecutive integer sets',(p,e)=>{const[a,b,c]=match(e,/A=\\\{1,\\ldots,(\d+)\\\},\\ B=\\\{(\d+),\\ldots,(\d+)\\\}/);return finiteSet(a).filter(x=>new Set(integers(b,c)).has(x)).length;});
const overlapping=(e)=>{const[a,b,c]=match(e,/\|A\|=(\d+),\\ \|B\|=(\d+),\\ \|A\\cap B\|=(\d+)/);return[finiteSet(a),finiteSet(b,a-c+1)];};
rule('Find the cardinality of the union.','construct and deduplicate overlapping sets',(p,e)=>new Set(overlapping(e).flat()).size);
rule('How many elements belong to exactly one of A and B?','enumerate symmetric difference',(p,e)=>{const[a,b]=overlapping(e),A=new Set(a),B=new Set(b);return [...A].filter(x=>!B.has(x)).length+[...B].filter(x=>!A.has(x)).length;});
rule('Find the cardinality of the complement.','construct universe and remove subset',(p,e)=>{const[u,a]=match(e,/\|U\|=(\d+),\\ \|A\|=(\d+)/);return finiteSet(u).filter(x=>!new Set(finiteSet(a)).has(x)).length;});
rule(/^A group has /,'construct disjoint Venn regions',(p)=>{const[n,a,b,c]=match(p,/has (\d+) people; (\d+) take music, (\d+) sport, and (\d+) both/),taken=new Set([...finiteSet(a),...finiteSet(b,a-c+1)]);return finiteSet(n).filter(x=>!taken.has(x)).length;});
rule('Count the possible integer witnesses.','enumerate open integer interval',(p,e)=>{const[a,b]=match(e,/(-?\d+)<x<(-?\d+)/);return integers(a,b).filter(x=>a<x&&x<b).length;});
rule('Find the least integer greater than every admissible sum a+b.','open supremum and integer minimality',(p,e)=>{const[a,b]=match(e,/a<(-?\d+),\\ b<(-?\d+)/),upper=a+b;assert(Number.isInteger(upper));assert((a-.1)+(b-.1)>upper-1);return upper;});
rule('Find the minimum for x>0.','independent convex one-dimensional minimization',(p,e)=>{const c=one(e,/\\frac\{(\d+)\}x/);return optimize(x=>x+c/x,1e-6,c+1);});
rule(/^Positive a,b have sum /,'maximize product on the feasible segment',(p)=>{const sum=one(p,/sum (\d+)/);return optimize(a=>a*(sum-a),0,sum,true);});
rule(/^A rectangle has perimeter /,'maximize rectangle area under perimeter constraint',(p)=>{const perimeter=one(p,/perimeter (\d+)/);return optimize(a=>a*(perimeter/2-a),0,perimeter/2,true);});
rule('Minimize the expression over positive x.','independent convex one-dimensional minimization',(p,e)=>{const[a,b]=match(e,/(\d+)x\+\\frac\{(\d+)\}x/);return optimize(x=>a*x+b/x,1e-6,b+1);});
rule('Minimize the sum of two positive numbers with this product.','minimize after enforcing product constraint',(p,e)=>{const product=one(e,/ab=(\d+)/);return optimize(x=>x+product/x,1e-6,product+1);});
rule('Count the integer solutions.','enumerate and substitute the original quadratic inequality',(p,e)=>{const[a,b]=match(e,/\(x\+(\d+)\)\(x-(\d+)\)<0/);return integers(-a-2,b+2).filter(x=>(x+a)*(x-b)<0).length;});
rule('Calculate the discriminant and interpret its sign.','coefficient discriminant',(p,e)=>{const[b,c]=match(e,/x\^2-(\d+)x\+(\d+)=0/);return b*b-4*c;});
rule('Find the length of the x-interval where the line is above or on the parabola.','solve the two intersection coordinates',(p,e)=>{const[b,c]=match(e,/y=\((\d+)\)x-(\d+)/),d=Math.sqrt(b*b-4*c),left=(b-d)/2,right=(b+d)/2;assert(left<=right);return right-left;});

// Function tasks: use inputs and stated domains, including breakpoints and attained extrema.
rule('Evaluate the function at the stated input.','direct polynomial substitution',(p,e)=>{const[b,x]=match(e,/x\^2-(\d+)x\+1;\\quad f\((\d+)\)/);return x*x-b*x+1;});
rule('Find the greatest value on the stated closed interval.','evaluate convex quadratic at interval endpoints',(p,e)=>{const[c,a,b]=match(e,/\(x-(\d+)\)\^2;\\quad x\\in\[(\d+),(\d+)\]/);return Math.max((a-c)**2,(b-c)**2);});
rule('Evaluate the piecewise rule at the breakpoint.','select the inclusive branch at the breakpoint',(p,e)=>{const boundary=one(e,/x<(\d+)/),x=one(e,/;\\quad f\((\d+)\)/);return x<boundary?x+1:2*x;});
rule('An even function has the stated value. Find the reflected value.','apply evenness on the stated symmetric pair',(p,e)=>{const[a,v,b]=match(e,/f\((\d+)\)=(\d+);\\quad f\((-\d+)\)/);assert.equal(a,-b);return v;});
rule('Find the minimum on the stated interval.','minimize the quadratic on its closed feasible interval',(p,e)=>{const[c,d,a,b]=match(e,/\(x-(\d+)\)\^2\+(\d+);\\quad x\\in\[(\d+),(\d+)\]/),x=Math.min(b,Math.max(a,c));return(x-c)**2+d;});
rule('Evaluate the power.','repeated multiplication',(p,e)=>{const[a,n]=match(e,/^(\d+)\^(\d+)$/);return Array.from({length:n}).reduce(v=>v*a,1);});
rule('Evaluate the real cube root.','standard-library signed real cube root',(p,e)=>Math.cbrt(one(e,/\((-\d+)\)\^\{1\/3\}/)));
rule('Find m so that this is a power function with coefficient one.','solve the coefficient-one linear constraint',(p,e)=>one(e,/\(m-(\d+)\)/)+1);
rule(/^A taxi charges /,'accumulate base charge and each kilometre',(p)=>{const[base,rate,distance]=match(p,/charges (\d+) units initially and (\d+) per kilometre.*for (\d+) km/);return finiteSet(distance).reduce(sum=>sum+rate,base);});
rule('Find the maximum profit under the continuous model.','attain the vertex on nonnegative domain',(p,e)=>{const[vertex,height]=match(e,/-\(q-(\d+)\)\^2\+(\d+)/);assert(vertex>=0);return height;});
rule(/^A journey covers equal distances/,'divide total distance by total travel time',(p)=>{const[a,b]=match(p,/speeds (\d+) and (\d+)/),distance=a*b;return 2*distance/(distance/a+distance/b);});
rule(/^A service costs /,'enumerate whole item counts against bill',(p)=>{const[base,rate,bill]=match(p,/C=(\d+)\+(\d+)n.*bill is (\d+)/);const possible=integers(0,bill).filter(n=>base+rate*n===bill);assert.equal(possible.length,1);return possible[0];});
rule(/^A budget is /,'enumerate affordable whole-item counts',(p)=>{const[budget,cost]=match(p,/budget is (\d+) and each item costs (\d+)/);return Math.max(...integers(0,budget).filter(n=>n*cost<=budget));});
rule(/^A fare is 8 /,'evaluate piecewise fare and check continuity',(p)=>{assert(p.includes('d=5'));const f=d=>d<=2?8:8+3*(d-2);assert.equal(f(2),8+3*(2-2));return f(5);});

// Exponents are recalculated by multiplication / real roots; logarithms use natural logs.
rule('Simplify the product.','multiply the two independently evaluated powers',(p,e)=>{const[a,b]=match(e,/2\^\{(\d+)\}\\cdot2\^(\d+)/);return 2**a*2**b;});
rule('Evaluate the negative power.','reciprocal of repeated multiplication',(p,e)=>{const[base,power]=match(e,/(\d+)\^\{-(\d+)\}/);return 1/Array.from({length:power}).reduce(v=>v*base,1);});
rule('Evaluate the rational power.','signed cube root followed by squaring',(p,e)=>Math.cbrt(one(e,/(\d+)\^\{2\/3\}/))**2);
rule('Find the positive exponential base.','positive root and exclusion of zero/negative base',(p,e)=>Math.sqrt(one(e,/f\(2\)=(\d+)/)));
rule('Solve the exponential equation.','natural-log inversion of the numeric right side',(p,e)=>Math.log(2**one(e,/=2\^\{(\d+)\}/))/Math.log(2));
rule('Find the y-intercept.','evaluate exponential model at zero',(p,e)=>{const[a,b]=match(e,/y=(\d+)\\cdot(\d+)\^x/);return a*b**0;});
rule(/^A quantity starts at /,'iterate stated hourly doublings',(p)=>{const[n,hours]=match(p,/starts at (\d+).*after (\d+) hours/);return Array.from({length:hours}).reduce(v=>v*2,n);});
rule('Evaluate the logarithm.','natural-log change of base',(p,e)=>Math.log(one(e,/\\log_2(\d+)$/))/Math.log(2));
rule('Simplify using the product rule.','evaluate both original logarithms separately',(p,e)=>{const[a,b]=match(e,/\\log_2(\d+)\+\\log_2 (\d+)/);return Math.log(a)/Math.log(2)+Math.log(b)/Math.log(2);});
rule('Evaluate by change of base.','natural-log ratio',(p,e)=>{const[a,b]=match(e,/\\log_\{(\d+)\}(\d+)/);return Math.log(b)/Math.log(a);});
rule('Evaluate the logarithm with a base below one.','natural-log ratio with negative denominator',(p,e)=>{const[a,b]=match(e,/\\log_\{1\/(\d+)\}(\d+)/);return Math.log(b)/Math.log(1/a);});
rule('Solve the logarithmic equation.','exponentiate then enforce positive argument',(p,e)=>{const[shift,power]=match(e,/\\log_2\(x\+(\d+)\)=(\d+)/),root=Math.exp(power*Math.log(2))-shift;assert(root+shift>0);return root;});
rule('Find the x-intercept.','solve log-zero by argument equal to one',(p,e)=>one(e,/x-(\d+)/)+1);
rule(/^A population is /,'compound the stated yearly growth twice',(p)=>{const[n,percent]=match(p,/population is (\d+).*by (\d+)%/);let v=n;for(let year=0;year<2;year++)v+=v*percent/100;return v;});
rule(/^A sample starts at /,'iterate each complete half-life',(p)=>{const[n,period,days]=match(p,/starts at (\d+) mg.*every (\d+) days.*after (\d+) days/);assert.equal(days%period,0);return Array.from({length:days/period}).reduce(v=>v/2,n);});
rule(/^An exponential amount grows /,'count complete doublings from starting quantity',(p)=>{const[start,end,period]=match(p,/from (\d+) to (\d+).*every (\d+) hours/);let n=start,t=0;while(n<end){n*=2;t+=period;}assert.equal(n,end);return t;});
rule(/^Find the base-10 logarithmic increase/,'evaluate the original log difference at positive test input',(p,e)=>{const multiplier=one(e,/\\log_\{10\}\((\d+)x\)/),x=7;return Math.log10(multiplier*x)-Math.log10(x);});

// Trigonometry is evaluated through radians / coordinates, not copied identities or stored answers.
rule('Write the angle as cπ radians; find c.','degree-radian conversion',(p,e)=>rad(one(e,/(\d+)\^/))/Math.PI);
rule('Convert to degrees.','radian-degree conversion',(p,e)=>{const[a,b]=match(e,/\\frac\{(\d+)\\pi\}\{(\d+)\}/);return(a*Math.PI/b)*180/Math.PI;});
rule('How many coterminal representatives of 30° lie in this closed interval?','enumerate integer turns including both endpoints',(p,e)=>{const[a,b]=match(e,/\[(-?\d+)\^\{\\circ\},(-?\d+)\^/),limit=Math.ceil(Math.max(Math.abs(a),Math.abs(b))/360)+2;return integers(-limit,limit).filter(n=>a<=30+360*n&&30+360*n<=b).length;});
rule('A circle has radius r and angle θ radians. Find the arc length for these values.','circle circumference multiplied by angular fraction',(p,e)=>{const[r,t]=match(e,/r=(\d+),\\quad\\theta=(\d+)/);return 2*Math.PI*r*(t/(2*Math.PI));});
rule('Find the sector area for the stated radian angle.','circle area multiplied by angular fraction',(p,e)=>{const[r,t]=match(e,/r=(\d+),\\quad\\theta=(\d+)/);return Math.PI*r*r*(t/(2*Math.PI));});
rule('Give the coterminal angle in [0°,360°).','remove complete positive/negative turns',(p,e)=>{let a=one(e,/(-?\d+)\^/);while(a>=360)a-=360;while(a<0)a+=360;return a;});
rule('Find sin θ from the terminal-ray point.','coordinate angle via atan2',(p,e)=>{const[x,y]=match(e,/P=\((-?\d+),(-?\d+)\)/);return Math.sin(Math.atan2(y,x));});
rule(/^Find cos θ when θ is in quadrant /,'select quadrant on the unit circle',(p,e)=>{const s=fraction(e,/=(-?\d+)\/(\d+)/),angle=Math.PI-Math.asin(s);assert(p.includes('III')?s<0:s>0);return Math.cos(angle);});
rule('Find tan θ from the terminal-ray point.','coordinate angle via atan2',(p,e)=>{const[x,y]=match(e,/P=\((-?\d+),(-?\d+)\)/);return Math.tan(Math.atan2(y,x));});
rule('Find the radius of this terminal-ray point.','Euclidean norm',(p,e)=>Math.hypot(...match(e,/P=\((-?\d+),(-?\d+)\)/)));
rule('Find the transformed sine value.','evaluate sine after a full radian turn',(p,e)=>Math.sin(2*Math.PI+Math.asin(fraction(e,/=(-?\d+)\/(\d+)/))));
rule('Find the reflected cosine value.','evaluate cosine of reflected angle',(p,e)=>Math.cos(Math.PI-Math.acos(fraction(e,/=(-?\d+)\/(\d+)/))));
rule('Evaluate cos 420° without a calculator.','library cosine in radians',()=>Math.cos(rad(420)));
rule('Find tangent after a half turn.','library tangent after a half turn',(p,e)=>Math.tan(Math.PI+Math.atan(one(e,/\\tan\\alpha=(-?\d+)/))));
rule('Evaluate sine at the opposite angle.','library sine of negative angle',(p,e)=>Math.sin(-Math.asin(fraction(e,/=(-?\d+)\/(\d+)/))));
rule('Evaluate without a calculator.','evaluate both sine terms',(p,e)=>{assert.equal(e,'\\sin(\\pi)+\\sin(0)');return Math.sin(Math.PI)+Math.sin(0);});
rule('Evaluate tan(−π/4).','library tangent at negative quarter turn',()=>Math.tan(-Math.PI/4));
rule('The least positive period is cπ. Find c.','full phase revolution divided by frequency',(p,e)=>{const frequency=one(e,/\\sin\((\d+)x\)/);return(2*Math.PI/frequency)/Math.PI;});
rule('Count the zeros on the closed interval.','enumerate zero phases and both endpoints',(p,e)=>{const endpoint=one(e,/x\\le(\d+)\\pi/);return integers(-1,endpoint+1).filter(n=>n>=0&&n<=endpoint&&Math.abs(Math.sin(n*Math.PI))<1e-12).length;});
rule(/^Find the least positive period of sin²x/,'squared-sine period with rejected half-period',()=>{for(const x of [0,.1,.5,1])assert(Math.abs(Math.sin(x+Math.PI)**2-Math.sin(x)**2)<1e-12);assert.notEqual(Math.sin(Math.PI/2)**2,Math.sin(0)**2);return Math.PI/Math.PI;});
rule('Given an acute angle, find sin 2α.','library double-angle evaluation',(p,e)=>Math.sin(2*Math.asin(fraction(e,/=(\d+)\/(\d+)/))));
rule('Find cos 2α using the given sine.','library cosine of twice an arcsine',(p,e)=>Math.cos(2*Math.asin(fraction(e,/=(\d+)\/(\d+)/))));
rule('For an acute α with sin α=5/13, find sin 2α.','library sine of twice acute arcsine',(p,e)=>Math.sin(2*Math.asin(fraction(e,/=(\d+)\/(\d+)/))));
rule('Given cos α=3/5, find cos 2α.','library cosine of twice an arccosine',(p,e)=>Math.cos(2*Math.acos(fraction(e,/=(\d+)\/(\d+)/))));
rule('Find tan(α+β), assuming both tangents have the stated values.','library tangent of sum of arctangents',(p,e)=>{const[a,b]=match(e,/\\tan\\alpha=(-?\d+),\\quad\\tan\\beta=(-?\d+)/);return Math.tan(Math.atan(a)+Math.atan(b));});
rule('Find the amplitude of the combined sinusoid.','maximize sinusoid via phase determined by atan2',(p,e)=>{const[a,b]=match(e,/y=(\d+)\\sin x\+(\d+)\\cos x/),phase=Math.atan2(a,b);return a*Math.sin(phase)+b*Math.cos(phase);});
rule('For acute α and β, find sin(α−β) from the given values.','library sine of acute angle difference',(p,e)=>{const[a,b,c,d]=match(e,/\\sin\\alpha=(\d+)\/(\d+).*\\sin\\beta=(\d+)\/(\d+)/);return Math.sin(Math.asin(a/b)-Math.asin(c/d));});
rule('Given tan α=2, find tan 2α.','library tangent of twice arctangent',(p,e)=>Math.tan(2*Math.atan(one(e,/\\tan\\alpha=(-?\d+)/))));
rule('Find the amplitude.','evaluate extrema rather than signed coefficient',(p,e)=>{const a=one(e,/y=(-?\d+)\\sin/),max=a*Math.sin(a>=0?Math.PI/2:-Math.PI/2),min=a*Math.sin(a>=0?-Math.PI/2:Math.PI/2);return(max-min)/2;});
rule('Write the least positive period as cπ; find c.','full phase revolution with phase offset preserved',(p,e)=>{const f=one(e,/\\sin\((\d+)x\+/),period=2*Math.PI/f;for(const x of [0,.2,1])assert(Math.abs(Math.sin(f*(x+period)+Math.PI/4)-Math.sin(f*x+Math.PI/4))<1e-12);return period/Math.PI;});
rule('Find the value at x=0.','direct sinusoid substitution',(p,e)=>{const[a,c]=match(e,/y=(\d+)\\sin\(2x\+\\pi\/2\)\+(\d+)/);return a*Math.sin(Math.PI/2)+c;});
rule('Find A>0 from the maximum and minimum.','half distance between extrema',(p,e)=>{const[hi,lo]=match(e,/y_\{\\max\}=(\d+),\\quad y_\{\\min\}=(\d+)/);return Math.abs(hi-lo)/2;});
rule(/^A \d+-metre ladder/,'right-triangle height from library sine',(p)=>one(p,/A (\d+)-metre/)*Math.sin(rad(one(p,/makes (\d+)°/))));
rule('Find the period in hours.','one phase revolution under time scaling',(p,e)=>2*Math.PI/(Math.PI/one(e,/\\pi t\/(\d+)/)));
rule(/^A wheel has radius /,'top point of vertical circle',(p)=>{const[r,h]=match(p,/radius (\d+) m.*is (\d+) m above/);return h+r*Math.sin(Math.PI/2);});
rule('At which first nonnegative time does the model reach its maximum?','first nonnegative sine maximum phase',(p,e)=>(Math.PI/2)/(Math.PI/one(e,/\\pi t\/(\d+)/)));
rule(/^A tide has maximum /,'symmetric midpoint of sinusoid extrema',(p)=>{const[a,b]=match(p,/maximum (\d+) m and minimum (\d+) m/);return(a+b)/2;});

export function auditFoundationC1(units){
 const records=[],uncovered=[];
 for(const unit of units.filter(u=>u.bookId==='c1'))for(const q of unit.questions){
  if(typeof q.answer!=='number')continue;
  const applicable=rules.filter(r=>r.matches(q.prompt.en));
  if(!applicable.length){uncovered.push(q.id);continue;}
  assert.equal(applicable.length,1,`${q.id}: ambiguous verification method`);
  const r=applicable[0],derived=r.compute(q.prompt.en,q.expression||'');
  assert(Number.isFinite(derived),`${q.id}: nonfinite independent calculation`);
  assert(Math.abs(derived-q.answer)<=1e-7,`${q.id}: published ${q.answer}, independently derived ${derived}`);
  records.push({id:q.id,method:r.method,derived,published:q.answer});
 }
 assert.deepEqual(uncovered,[],`Unverified compulsory-1 numerical answers: ${uncovered.join(', ')}`);
 return{verifiedIds:records.map(r=>r.id),methods:Object.fromEntries([...new Set(records.map(r=>r.method))].map(m=>[m,records.filter(r=>r.method===m).length])),records,uncovered};
}
