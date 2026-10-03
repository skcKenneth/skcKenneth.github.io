import {L} from '../data/senior-math/authoring.mjs';
export const extraInquiryTypes=['lines','circles','counting','normal','contingency','matrices','polar','linear-programming','finance','hypergeometric','outcome-scaling','induction'];
export const inquiryOverrides={
 'c1-2-3':'functions','sup-exponential-log-equations':'functions','sup-inverse-functions':'functions',
 's1-2-1':'lines','s1-2-2':'lines','s1-2-3':'lines','s1-2-4':'circles','s1-2-5':'circles',
 's3-6-1':'counting','s3-6-2':'counting','s3-6-3':'counting','s3-7-3':'outcome-scaling','s3-7-4':'hypergeometric','s3-7-5':'normal','s3-8-3':'contingency',
 'sup-euclidean-circles':'circles','sup-matrices':'matrices','sup-polar':'polar','sup-linear-programming':'linear-programming','sup-variation-finance':'finance','s2-4-4':'induction',
};
const choose=(n,r)=>{if(r<0||r>n)return 0;let value=1;for(let j=1;j<=r;j++)value=value*(n-j+1)/j;return value;};
export function extraInquiryControls(type){
 const controls={
  lines:[['Slope m','斜率 m',-3,3,.5,1],['Intercept c','截距 c',-3,3,.5,1]],
  circles:[['Radius r','半徑 r',.5,4,.5,2],['Horizontal line y=h','水平直線 y=h',0,5,.5,1]],
  counting:[['Number of objects n','物件數目 n',1,10,1,5],['Number selected r','選取數目 r',0,10,1,2]],
  normal:[['Mean μ','均值 μ',-2,2,.5,0],['Standard deviation σ','標準差 σ',.5,2.5,.5,1]],
  contingency:[['Association parameter k','關聯參數 k',-4,4,1,2],['Table scale s','頻數倍數 s',1,5,1,1]],
  matrices:[['Entry a','元素 a',-3,3,.5,1],['Entry b','元素 b',-3,3,.5,2]],
  polar:[['Radius r','極徑 r',-3,3,.5,2],['Angle θ (degrees)','極角 θ（度）',0,360,15,45]],
  'linear-programming':[['Coefficient a','係數 a',1,5,1,2],['Coefficient b','係數 b',1,5,1,1]],
  finance:[['Annual percentage r','年利率 r（百分數）',0,20,1,10],['Years t','年數 t',0,10,1,3]],
  hypergeometric:[['Draws n from ten objects','從十個物件抽取 n 個',0,10,1,4],['Successes K in the population','總體的成功物件數 K',0,10,1,4]],
  'outcome-scaling':[['Outcome scale a','結果倍數 a',-3,3,.5,2],['Outcome shift b','結果平移 b',-3,3,.5,0]],
  induction:[['Test up to n','檢查至 n',1,8,1,4],['Deliberate missing constant c','故意遗漏的常數 c',0,3,1,1]],
 };
 return controls[type]?.map(([en,zh,min,max,step,value],i)=>({key:i?'b':'a',label:L(en,zh),min,max,step,value}));
}
export function extraInquiryScene(type,a,b){
 if(!extraInquiryTypes.includes(type))return null;
 const paths=[],circles=[],labels=[];let values={},en='',zh='';const num=x=>Number(x.toFixed(4));
 const point=(x,y)=>[320+(['circles','matrices','polar'].includes(type)?28:48)*x,180-28*y];
 const line=(x,y,u,v,color='#547e60')=>{const p=point(x,y),q=point(u,v);paths.push({d:`M${p[0]},${p[1]}L${q[0]},${q[1]}`,color});};
 const plot=(f,color='#547e60')=>{let d='',active=false;for(let x=-5.5;x<=5.5;x+=.025){const y=f(x);if(!Number.isFinite(y)||Math.abs(y)>5.8){active=false;continue;}const p=point(x,y);d+=`${active?'L':'M'}${p[0]},${p[1]}`;active=true;}paths.push({d,color});};
 const dot=(x,y)=>{const p=point(x,y);circles.push({x:p[0],y:p[1],r:5,color:'#aa613f'});};
 const bars=(masses)=>masses.forEach((p,k)=>{const x=55+k*520/(masses.length||1);paths.push({d:`M${x},310V${310-p*260}`,color:'#547e60',width:15});});
 line(-5.5,0,5.5,0,'#a5b6aa');line(0,-5.5,0,5.5,'#a5b6aa');
 if(type==='lines'){
  plot(x=>a*x+b);const distance=Math.abs(b)/Math.hypot(a,1);values={slope:a,intercept:b,distance};
  en=`y=${a}x+${b}. Angle is measured modulo 180°; distance from the origin=${num(distance)}. This slope form excludes vertical lines.`;
  zh=`y=${a}x+${b}；傾斜角以 180° 為週期；原點至直線距離=${num(distance)}。斜截式不包括垂直直線。`;
 }else if(type==='circles'){
  let d='';for(let t=0;t<=2*Math.PI+.025;t+=.025){const p=point(a*Math.cos(t),a*Math.sin(t));d+=`${d?'L':'M'}${p[0]},${p[1]}`;}paths.push({d,color:'#547e60'});line(-5.5,b,5.5,b,'#aa613f');
  const count=b>a?0:b===a?1:2,chord=count===2?2*Math.sqrt(a*a-b*b):0;values={count,chord};
  en=`Circle x²+y²=${a*a}; line y=${b}. ${count} intersections; chord length=${num(chord)}. Tangency occurs exactly when h=r.`;
  zh=`圓 x²+y²=${a*a}，直線 y=${b}；交點數=${count}，弦長=${num(chord)}。恰在 h=r 時相切。`;
 }else if(type==='counting'){
  const n=Math.round(a),r=Math.round(b),combinations=choose(n,r),permutations=combinations*Array.from({length:r},(_,i)=>i+1).reduce((x,y)=>x*y,1);values={combinations,permutations};
  labels.push({x:80,y:130,text:`C(${n},${r}) = ${combinations}`},{x:80,y:210,text:`P(${n},${r}) = ${permutations}`});
  en=`Choosing ${r} distinct objects from ${n}: ${combinations} unordered choices, ${permutations} ordered arrangements. If r>n both counts are zero; choosing none gives one empty choice.`;
  zh=`从 ${n} 個不同物件選 ${r} 個：不計次序 ${combinations} 種，計次序 ${permutations} 種。r>n 時均為零；不選任何物件仍有一種空選擇。`;
 }else if(type==='normal'){
  plot(x=>4*Math.exp(-.5*((x-a)/b)**2)/(b*Math.sqrt(2*Math.PI)));line(a-b,0,a-b,5,'#aa613f');line(a+b,0,a+b,5,'#aa613f');values={mean:a,sd:b,oneSdMass:.682689492137};
  en=`Normal density with μ=${a}, σ=${b}; the vertical scale is multiplied by four for display. P(μ−σ≤X≤μ+σ)≈0.6827, unchanged by location or scale.`;
  zh=`正態密度：μ=${a}、σ=${b}；為方便顯示，縱軸放大四倍。P(μ−σ≤X≤μ+σ)≈0.6827，不隨位置或尺度改變。`;
 }else if(type==='contingency'){
  const O=[[(10+a)*b,(10-a)*b],[(10-a)*b,(10+a)*b]],expected=10*b,chi=4*(a*b)**2/expected;values={observed:O,expected,chiSquare:chi};
  labels.push({x:90,y:110,text:`O = [${O[0].join(', ')}; ${O[1].join(', ')}]`},{x:90,y:185,text:`E per cell = ${expected}`},{x:90,y:260,text:`χ² = ${num(chi)}`});
  en=`Independent-observation model: every expected count=${expected}; χ²=${num(chi)}. Scaling the table scales χ²; association is not a causal conclusion.`;
  zh=`獨立觀察模型：每格期望頻數=${expected}，χ²=${num(chi)}。把全表放大同時放大 χ²；關聯不能推出因果結論。`;
 }else if(type==='matrices'){
  const det=1-a*b,AB=[[1+a*b,a],[b,1]],BA=[[1,a],[b,1+a*b]];values={determinant:det,AB,BA};
  line(0,0,1,b);line(0,0,a,1);line(1,b,1+a,1+b);line(a,1,1+a,1+b);
  en=`A=[1,a;0,1], B=[1,0;b,1]. AB=[${AB[0]};${AB[1]}], BA=[${BA[0]};${BA[1]}]. The plotted columns belong to M=[1,a;b,1], with determinant ${num(det)} and area |det M|.`;
  zh=`A=[1,a;0,1]，B=[1,0;b,1]；AB=[${AB[0]};${AB[1]}]，BA=[${BA[0]};${BA[1]}]。圖中兩列向量屬於 M=[1,a;b,1]，行列式=${num(det)}，面積=|det M|。`;
 }else if(type==='polar'){
  const angle=b*Math.PI/180,x=a*Math.cos(angle),y=a*Math.sin(angle);line(0,0,x,y);dot(x,y);values={x,y};
  en=`(r,θ)=(${a},${b}°) gives (${num(x)},${num(y)}). (−r,θ+180°) describes the same point; at r=0 the angle is not unique.`;
  zh=`(r,θ)=(${a},${b}°) 對應 (${num(x)},${num(y)})；(−r,θ+180°) 表示同一點。r=0 時極角不唯一。`;
 }else if(type==='linear-programming'){
  const verts=[[0,0],[6,0],[0,6]],objective=verts.map(([x,y])=>a*x+b*y),maximum=Math.max(...objective);values={vertices:verts,objective,maximum};
  line(0,0,6,0);line(6,0,0,6);line(0,6,0,0);verts.forEach(([x,y])=>dot(x,y));labels.push({x:65,y:70,text:`max(ax+by) = ${maximum}`});
  en=`x≥0, y≥0, x+y≤6; maximise ${a}x+${b}y. Vertex values: ${objective.join(', ')}; maximum=${maximum}. If a=b, the whole sloping edge is optimal. Additional integer constraints must be checked separately.`;
  zh=`x≥0、y≥0、x+y≤6，最大化 ${a}x+${b}y。頂點值：${objective.join('、')}；最大值=${maximum}。a=b 時整條斜邊均最優；整數限制須另行檢查。`;
 }else if(type==='finance'){
  const simple=100*(1+a*b/100),compound=100*(1+a/100)**b,reversal=100*(1+a/100)*(1-a/100);values={simple,compound,reversal};
  labels.push({x:70,y:110,text:`Simple: ${num(simple)}`},{x:70,y:190,text:`Compound: ${num(compound)}`},{x:70,y:270,text:`Increase then decrease: ${num(reversal)}`});
  en=`Illustrative principal 100, annual rate ${a}%, ${b} years: simple=${num(simple)}, annually compounded=${num(compound)}. A ${a}% rise followed by a ${a}% fall gives ${num(reversal)}. This model excludes fees and taxes.`;
  zh=`示例本金 100，年利率 ${a}%，${b} 年：單利=${num(simple)}，每年複利=${num(compound)}。先升 ${a}% 再跌 ${a}% 得 ${num(reversal)}。模型不計費用與稅項。`;
 }else if(type==='hypergeometric'){
  const n=Math.round(a),K=Math.round(b),mass=Array.from({length:n+1},(_,k)=>choose(K,k)*choose(10-K,n-k)/choose(10,n));bars(mass);values={masses:mass,mean:n*K/10,variance:n*K/10*(1-K/10)*(10-n)/9};
  en=`Draw n=${n} without replacement from ten objects, K=${K} successes. Exact hypergeometric probabilities; E(X)=${num(values.mean)}, Var(X)=${num(values.variance)}. Trials are not independent.`;
  zh=`從十個物件不放回抽 n=${n} 個，其中 K=${K} 個成功。長條為精確超幾何概率；E(X)=${num(values.mean)}，Var(X)=${num(values.variance)}。各次抽取不獨立。`;
 }else if(type==='outcome-scaling'){
  const outcomes=[b,a+b,2*a+b],masses=new Map();outcomes.forEach((x,i)=>masses.set(x,(masses.get(x)||0)+[.25,.5,.25][i]));
  const outcomeDistribution=[...masses].sort(([x],[y])=>x-y).map(([value,probability])=>({value,probability})),xScale=Math.min(48,270/Math.max(1,...outcomes.map(Math.abs)));outcomeDistribution.forEach(({value,probability})=>circles.push({x:320+xScale*value,y:180-28*probability*6,r:5,color:'#aa613f'}));values={outcomes,outcomeDistribution,mean:a+b,variance:.5*a*a};
  en=`P(X=0,1,2)=(1/4,1/2,1/4); Y=aX+b has E(Y)=${num(values.mean)}, Var(Y)=${num(values.variance)}. Plotted heights represent six times the probability; the horizontal display scale adjusts to include every outcome. At a=0, one outcome b has probability 1.`;
  zh=`P(X=0,1,2)=(1/4,1/2,1/4)；Y=aX+b 的 E(Y)=${num(values.mean)}，Var(Y)=${num(values.variance)}。圖中高度為概率的六倍，橫向顯示尺度自動調整，讓全部結果可見；a=0 時唯一結果 b 的概率為 1。`;
 }else{
  const n=Math.round(a),sum=n*n;values={sum,trueFormula:sum,wrongFormula:sum+b};labels.push({x:80,y:110,text:`1+3+…+(2n−1) = ${sum}`},{x:80,y:190,text:`n² = ${sum}; n²+c = ${sum+b}`});
  en=`For n=${n}, the odd-number sum equals n². The false formula n²+${b} has exactly the same increment 2n+1 but fails its base case when c≠0. Finite checks alone are not an induction proof.`;
  zh=`n=${n} 時奇數和等於 n²。錯式 n²+${b} 仍有相同增量 2n+1，但 c≠0 時起始步已錯。有限次檢查本身不構成歸納證明。`;
 }
 return {paths,circles,labels,values,summary:L(en,zh)};
}
