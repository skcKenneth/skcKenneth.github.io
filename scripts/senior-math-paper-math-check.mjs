// Independent arithmetic/property checks supplement, not replace, the source-by-source derivations.
import assert from 'node:assert/strict';
const near=(a,b,label)=>assert(Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b)),label);
const det=m=>m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const angleCos=(a,b,c)=>dot(sub(a,b),sub(c,b))/(dist(a,b)*dist(c,b));
const combinations=(n,k)=>{let x=1;for(let i=1;i<=k;i++)x=x*(n-i+1)/i;return x;};
// 2021 JM01: independent combinatorial counts, sharp extrema, tangent and triangle checks.
near(4*2*3/combinations(9,3),2/7,'2021 book sample');
const factorial=n=>n<2?1:n*factorial(n-1);near(factorial(3)*factorial(4)*factorial(2)*factorial(3)/factorial(9),1/210,'2021 book blocks');
for(const m of [.5,2])near((4*m-4)**2/(m*m+1),16/5,'2021 circle tangents');
for(const a of [-3,-1,1,4])for(const m of [.1,.4,.9]){const y=Math.abs(a)/Math.sqrt(1-m*m),x=m*y;near(y*y-2*m*x*y+x*x,a*a,'2021 ellipse-like constrained max');assert(x>0&&y>0);}
for(let n=1;n<=30;n++){let sum=0;for(let k=1;k<=n;k++)sum+=1/((2*k-1)*(2*k+1));near(sum,n/(2*n+1),'2021 telescoping');}
const B2021=Math.acos(2*Math.sqrt(2)/3),C2021=(1.5*Math.PI-B2021)/2,A2021=C2021-Math.PI/2;near(A2021+B2021+C2021,Math.PI,'2021 triangle angles');near(Math.sin(C2021)**2,2/3,'2021 sine squared');near(.5*5*(5*Math.sin(A2021)/Math.sin(B2021))*Math.sin(C2021),25*Math.sqrt(2)/2,'2021 triangle area');
const f2021=x=>2*x**3-9*x*x+12*x-5;near(f2021(1),0,'2021 cubic max');near(f2021(2),-1,'2021 cubic min');near(f2021(1.5),-.5,'2021 cubic inflection');near(f2021(-1),-28,'2021 cubic left endpoint');near(f2021(3),4,'2021 cubic right endpoint');
for(const m of [-3,1/3]){near(Math.abs((2-m)/(1+2*m)),1,'2021 tangent angle');const h=2*(2+m),k=4*m;near(k,2*h-8,'2021 tangent1');near(k,m*h-2*m*m,'2021 tangent2');}
for(const j of [1,2,3,4,5,7,8,9,10,11]){const x=j*Math.PI/6;near(Math.cos(x)+Math.cos(3*x)+Math.cos(5*x),0,'2021 trig roots');}
for(const t of [-2,-.5,0,3]){const x=3+t,y=-1-t,z=t;near(2*x+y-z,5,'2021 singular row1');near(x+2*y+z,1,'2021 singular row2');near(-x+y+2*z,-4,'2021 singular row3');}
for(let n=1;n<=8;n++)for(const x of [-2,-.4,0,.7,Math.PI]){let s=0;for(let j=1;j<=n;j++)s+=Math.cos((2*j-1)*x);near(2*Math.sin(x)*s,Math.sin(2*n*x),'2021 induction identity');}
// 2025: enumerate all six-shot outcomes; independently convolve the binomial coefficient term.
let p4=0;for(let mask=0;mask<64;mask++){let hits=0,p=1;for(let j=0;j<6;j++){const q=j<3?1/3:2/3,hit=(mask>>j)&1;hits+=hit;p*=hit?q:1-q;}if(hits===4)p4+=p;}near(p4,58/243,'2025 JM01 I.12');
near(combinations(8,5)+combinations(8,2),84,'2025 JM01 I.9');
for(let n=1;n<=25;n++){let sum=0;for(let k=1;k<=n;k++)sum+=(2*k+1)*2*3**(k-1);near(sum,2*n*3**n,'2025 JM01 II.1');}
for(const x of [-3,-1,0,1,2])near((4*x*x-3*x+3)*(2*x*x+6*x+3),8*x**4+18*x**3+9*x+9,'2025 JM01 factorisation');
const A=[0,3],B=[-3,0],D=[-1,2],E=[1,2],F=[2,1],G=[.2,1.6];
near(angleCos(A,F,D),angleCos(D,E,B),'2025 JM01 angle construction');near(dist(D,E)**2,dist(D,G)*dist(D,F),'2025 JM01 similarity1');near(dist(D,E)**2,dist(D,B)*dist(E,F),'2025 JM01 similarity2');
near(Math.sin(2*(Math.PI-Math.PI/4-Math.acos(4/5))),-7/25,'2025 JM01 double-angle');
for(const t of [-2,0,.5,3]){near(2*(1+t)**2+(1-2*t)**2-6*t*t,3,'2026 system identity');}
for(const a of [-2,0,1,3])for(const b of [-1,0,2])for(const c of [-3,1,4]){
 near(det([[a+b,b+c,c+a],[a-b,b-c,c-a],[c,a,b]]),2*(a**3+b**3+c**3-3*a*b*c),'2025 JM02 determinant');
 near(det([[a,b,c],[b+c,c+a,a+b],[1+b,1+c,1+a]]),(a+b+c)*(a*a+b*b+c*c-a*b-b*c-c*a),'2024 JM02 determinant');
 near(det([[a,b+c,b*b+c*c],[b,a+c,a*a+c*c],[c,a+b,a*a+b*b]]),(a-b)*(b-c)*(c-a)*(a+b+c),'2022 JM02 determinant');
 near(det([[a,a*a+1,b*c],[b,b*b+1,a*c],[c,c*c+1,a*b]]),(a-b)*(b-c)*(c-a)*(a*b+b*c+c*a-1),'2021 JM02 determinant');
}
for(const k of [-3,-1,0,1,2,4]){near(det([[k,2,-1],[0,k,1],[k,3,0]]),k*(k-1),'2025 JM02 unique system');near(det([[1,1,1],[k,5,1],[1,k,-1]]),k*k-9,'2024 JM02 unique system');near(det([[1,1,k],[k,1,1],[1,k,1]]),(k-1)**2*(k+2),'2022 JM02 unique system');}
// 2024: enumerate all 210 equally likely four-item samples.
const counts=[0,0,0,0];for(let a=0;a<7;a++)for(let b=a+1;b<8;b++)for(let c=b+1;c<9;c++)for(let d=c+1;d<10;d++)counts[[a,b,c,d].filter(v=>v<3).length]++;
assert.equal(counts.reduce((s,v)=>s+v,0),210);near((counts[2]+counts[3])/210,1/3,'2024 at least2');near(counts.reduce((s,v,i)=>s+i*v,0)/210,6/5,'2024 expectation');
near(Math.tan(Math.atan(1/5)+Math.atan(2/3)),1,'2024 angle sum');near(Math.cos(Math.atan(1/5)+2*Math.atan(2/3)),Math.sqrt(26)/26,'2024 angle cosine');
for(const a of [10-2*Math.sqrt(2),10+2*Math.sqrt(2)]){const x=(10-a)/4;assert(x>=-1&&x<=1);near(2*x*x+(a-10)*x,-1,'2024 quadratic min');}
const V2=x=>Math.PI**2/9*(x**4-x**6);near(V2(Math.sqrt(2/3)),4*Math.PI**2/243,'2024 cone extremum');near(V2(Math.sqrt(2/5)),4*Math.PI**2/375,'2024 cone inflection');
for(const m of [-2/Math.sqrt(11),2/Math.sqrt(11)]){const a=m*m-4,b=-2*Math.sqrt(5)*m*m,c=5*m*m+4,disc=b*b-4*a*c;const x1=(-b+Math.sqrt(disc))/(2*a),x2=(-b-Math.sqrt(disc))/(2*a);near(x1*x2+m*m*(x1-Math.sqrt(5))*(x2-Math.sqrt(5)),0,'2024 perpendicular hyperbola');}
for(const t of [-2.1,-.2,0,.7,1.3,2.5]){near(16*Math.sin(t)**2*Math.cos(t)**3,2*Math.cos(t)-Math.cos(3*t)-Math.cos(5*t),'2024 product identity');near(det([[1,1,1],[Math.sin(2*t),Math.sin(4*t),Math.sin(8*t)],[Math.cos(2*t),Math.cos(4*t),Math.cos(8*t)]]),-4*Math.sin(t)*Math.sin(2*t)*Math.sin(3*t),'2023 trig determinant');}
// 2023: enumerate all ten-toss outcomes and distinguish first/third head times.
let atMost=0,first10=0,third10=0;for(let mask=0;mask<1024;mask++){let hits=0,prob=1;for(let j=0;j<10;j++){const h=(mask>>j)&1;hits+=h;prob*=h?.25:.75;}if(hits<=1)atMost+=prob;if(mask===512)first10+=prob;if(hits===3&&(mask&512))third10+=prob;}
near(atMost,13/4*(3/4)**9,'2023 at most1');near(first10,3**9/4**10,'2023 first10');near(third10,(3/4)**9,'2023 third10');
for(let n=1;n<=30;n++){let sum=0;for(let k=1;k<=n;k++)sum+=1/(2*3**k)+Math.log2(2*3**k);near(sum,(1-3**(-n))/4+n+n*(n+1)/2*Math.log2(3),'2023 reciprocal log sum');}
for(const x of [Math.tan(-2*Math.PI/9),Math.tan(Math.PI/9),Math.tan(4*Math.PI/9)])near(x**3-3*Math.sqrt(3)*x*x-3*x+Math.sqrt(3),0,'2023 cubic trig roots');
for(const h of [-3,-2,0,2,3]){const k=Math.sqrt(13-h*h);assert(h*h/9+k*k/4>1);if(Math.abs(h)!==3)near((k*k-4)/(h*h-9),-1,'2023 director circle');}
// 2022: finite-state maximum seating and direct finite-sum/induction checks.
let states=[0,-Infinity,-Infinity,-Infinity,-Infinity];for(let seat=0;seat<32;seat++){const next=[Math.max(...states),-Infinity,-Infinity,-Infinity,-Infinity];for(let run=0;run<4;run++)next[run+1]=states[run]+1;states=next;}assert.equal(Math.max(...states),26,'2022 maximum seats per row');
for(let n=1;n<=30;n++){let s=0,t=0;for(let k=1;k<=n;k++){s+=4**(1-k);t+=k/4**k;}near(s,4/3*(1-4**(-n)),'2022 geometric sum');near(t,4/9-(3*n+4)/(9*4**n),'2022 weighted sum');}
for(let n=1n;n<=40n;n++)assert.equal((3n**(4n*n+2n)+5n**(2n*n+1n))%14n,0n,'2022 induction integers');
for(const m of [2-Math.sqrt(2),2+Math.sqrt(2)])near(m/(2+m*m),1/4,'2022 tangent angle');
near([1,2,3].reduce((s,n)=>s+Math.cos(2*n*Math.PI/7)**2,0),5/4,'2022 seventh roots cosine sum');
near(84-48*Math.sqrt(3),12/(7+4*Math.sqrt(3)),'2022 tangent circles');
// Independent antiderivative evaluations of each area question (2022–2025).
const area2022=x=>-2*x**3/3+8*x*x-24*x;near(area2022(6)-area2022(2),64/3,'2022 bounded area');
const area2023=x=>4*x-x**4/4-x**3;near(area2023(1)-area2023(-2),27/4,'2023 bounded area');
const area2025=x=>-(x**3)-1.5*x*x+6*x;near(area2025(1)-area2025(-2),27/2,'2025 bounded area');
