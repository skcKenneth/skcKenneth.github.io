import {extraInquiryTypes,inquiryOverrides,extraInquiryControls,extraInquiryScene} from './senior-math-inquiry-extra.mjs';
export function binomialMass(n,p,k) {
  if (!Number.isInteger(n)||n<0||!Number.isInteger(k)||k<0||k>n||p<0||p>1) return 0;
  let c=1; for(let j=1;j<=k;j++) c=c*(n-j+1)/j;
  return c*p**k*(1-p)**(n-k);
}
export function simulateBinomial(n,p,seed=37,trials=200){
  let state=seed>>>0;const counts=Array(n+1).fill(0);
  for(let i=0;i<trials;i++){let successes=0;for(let j=0;j<n;j++){state=(Math.imul(state,1664525)+1013904223)>>>0;if(state/4294967296<p)successes++;}counts[successes]++;}
  return {counts,trials,mean:counts.reduce((s,count,k)=>s+k*count,0)/trials};
}
export function regression(points) {
  const n=points.length, mx=points.reduce((s,p)=>s+p[0],0)/n, my=points.reduce((s,p)=>s+p[1],0)/n;
  const xx=points.reduce((s,p)=>s+(p[0]-mx)**2,0), yy=points.reduce((s,p)=>s+(p[1]-my)**2,0), xy=points.reduce((s,p)=>s+(p[0]-mx)*(p[1]-my),0);
  return {slope:xx?xy/xx:null,intercept:xx?my-xy/xx*mx:null,r:xx&&yy?xy/Math.sqrt(xx*yy):null};
}
export const inquiryTypes=['sets','functions','trigonometry','vectors','solids','conics','sequences','probability','statistics','calculus','complex','algebra',...extraInquiryTypes];
export function normalizeInquiryType(type,lessonId='') {
  if(inquiryOverrides[lessonId])return inquiryOverrides[lessonId];
  const word=String(type||'algebra').toLowerCase();
  if(inquiryTypes.includes(word))return word;
  const aliases={set:'sets',venn:'sets',function:'functions',quadratics:'functions',trig:'trigonometry',vector:'vectors',solid:'solids',geometry:'solids',conic:'conics',sequence:'sequences',counting:'probability',distribution:'probability',regression:'statistics',derivative:'calculus',integration:'calculus',matrix:'algebra',matrices:'algebra'};
  return aliases[word]||'algebra';
}
export function inquiryControls(type,lessonId='') {
  type=normalizeInquiryType(type,lessonId);
  const extra=extraInquiryControls(type);if(extra)return extra;
  const definitions={
    sets:[['a','Element n','元素 n',1,7,1,3],['b','Operation: 0 intersection, 1 union, 2 A−B, 3 complement A','運算：0 交集、1 聯集、2 A−B、3 A 的補集',0,3,1,0]],
    functions:[['a','Horizontal shift','水平平移',-3,3,.5,0],['b','Vertical shift','垂直平移',-3,3,.5,0]],
    trigonometry:[['a','Angle θ (degrees)','角 θ（度）',0,360,15,45],['b','Added angle φ (degrees)','附加角 φ（度）',0,180,15,0]],
    vectors:[['a','Horizontal component','水平分量',-4,4,.5,2],['b','Vertical component','垂直分量',-4,4,.5,1]],
    solids:[['a','Length','長',1,5,.5,3],['b','Height (depth is 4)','高（深固定為 4）',1,5,.5,2]],
    conics:[['a','Parameter a','參數 a',lessonId==='s1-3-3'?-4:.5,4,.5,2],['b',lessonId==='s1-3-3'?'Horizontal shift b':'Parameter b',lessonId==='s1-3-3'?'水平平移 b':'參數 b',lessonId==='s1-3-3'?-3:.5,lessonId==='s1-3-3'?3:4,.5,1]],
    sequences:[['a','First term','首項',-3,5,1,2],['b',['s2-4-3','sup-infinite-series'].includes(lessonId)?'Common ratio':'Common difference',['s2-4-3','sup-infinite-series'].includes(lessonId)?'公比':'公差',lessonId==='sup-infinite-series'?-.9:-2,lessonId==='sup-infinite-series'?.9:2,lessonId==='sup-infinite-series'?.1:.5,lessonId==='sup-infinite-series'?.5:1]],
    probability:[['a','Number of independent trials n','獨立試驗次數 n',1,10,1,5],['b','Success probability p','成功概率 p',0,1,.05,.5]],
    statistics:[['a','Change in last y-value','最後一個 y 值的改變',-8,8,1,0],['b','Common vertical shift','整體垂直平移',-3,3,1,0]],
    calculus:[['a','Coefficient a','係數 a',-2,2,.5,1],['b','Point / integration limit t','切點／積分上限 t',-3,3,.5,1]],
    complex:[['a','Real part','實部',-4,4,.5,2],['b','Imaginary part','虛部',-4,4,.5,1]],
    algebra:[['a','First real number a','第一個實數 a',-3,3,.5,2],['b','Second real number b','第二個實數 b',-3,3,.5,1]],
  };
  return definitions[normalizeInquiryType(type)].map(([key,en,zh,min,max,step,value])=>({key,label:{en,zh},min,max,step,value}));
}
export function inquiryScene(type,a,b,lessonId='') {
  type=normalizeInquiryType(type,lessonId);
  const extra=extraInquiryScene(type,a,b);if(extra)return extra;
  const paths=[], circles=[], labels=[]; let values={}, en='',zh='';
  const num=v=>v===null?'undefined':Number(v.toFixed(4)).toString();
  const point=(x,y)=>[320+(['conics','vectors','complex'].includes(type)?28:52)*x,180-28*y];
  const line=(x1,y1,x2,y2,color='#426b4b')=>{const p=point(x1,y1),q=point(x2,y2);paths.push({d:`M${p[0]},${p[1]}L${q[0]},${q[1]}`,color});};
  const plot=(f,color='#426b4b',start=-5.3,end=5.3)=>{let d='',up=false;for(let x=start;x<=end;x+=.04){const y=f(x);if(!Number.isFinite(y)||Math.abs(y)>6){up=false;continue;}const p=point(x,y);d+=`${up?'L':'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`;up=true;}paths.push({d,color});};
  line(-5.3,0,5.3,0,'#a5b6aa');line(0,-5.3,0,5.3,'#a5b6aa');
  if(type==='sets') {
    const A=[1,2,3],B=[3,4,5],U=[1,2,3,4,5,6,7];
    const result=b===0?A.filter(x=>B.includes(x)):b===1?[...new Set([...A,...B])]:b===2?A.filter(x=>!B.includes(x)):U.filter(x=>!A.includes(x));
    circles.push({x:260,y:170,r:85,color:'#547e60'},{x:375,y:170,r:85,color:'#ae7e4c'});
    labels.push({x:225,y:155,text:'A: 1,2'},{x:317,y:175,text:'3'},{x:380,y:155,text:'B: 4,5'},{x:510,y:290,text:'6,7'});
    values={members:result,contained:result.includes(a)};
    en=`U={1,…,7}; A={1,2,3}; B={3,4,5}. Result={${result.join(',')}}. ${a} ${result.includes(a)?'belongs':'does not belong'} to the result.`;
    zh=`全集 U={1,…,7}；A={1,2,3}；B={3,4,5}。結果={${result.join(',')}}；${a}${result.includes(a)?'屬於':'不屬於'}結果集合。`;
  } else if(type==='functions') {
    const exponential=lessonId.startsWith('c1-4')||lessonId==='sup-exponential-log-equations', cubic=lessonId==='c1-3-3',inverse=lessonId==='sup-inverse-functions';
    const f=x=>exponential?Math.exp(x-a)+b:cubic?(x-a)**3+b:(x-a)**2+b;plot(f);
    en=`${exponential?'Exponential':cubic?'Cubic':'Quadratic'} graph: horizontal shift ${a}, vertical shift ${b}. Input is replaced by x−${a}.`;
    zh=`${exponential?'指數':cubic?'三次':'二次'}圖像：水平平移 ${a}，垂直平移 ${b}；自變量改成 x−${a}。`;values={atShift:f(a)};
    if(inverse){paths.pop();plot(x=>x>=a?f(x):NaN);plot(x=>x>=b?a+Math.sqrt(x-b):NaN,'#aa613f');line(-5.3,-5.3,5.3,5.3,'#a5b6aa');en=`Restrict y=(x−${a})²+${b} to x≥${a}. Its inverse is y=${a}+√(x−${b}), x≥${b}. The graphs reflect in y=x; their domain and range exchange.`;zh=`把 y=(x−${a})²+${b} 限制於 x≥${a}；反函數為 y=${a}+√(x−${b})，x≥${b}。兩圖關於 y=x 對稱，定義域與值域互換。`;values={atShift:f(a),inverseAtMinimum:a};}
  } else if(type==='trigonometry') {
    const theta=(a+b)*Math.PI/180,x=Math.cos(theta),y=Math.sin(theta);circles.push({x:320,y:180,r:100,color:'#547e60'});paths.push({d:`M320,180L${320+100*x},${180-100*y}`,color:'#aa613f'});
    values={sin:y,cos:x,radians:theta};en=`θ+φ=${a+b}° = ${num(theta)} rad; sin=${num(y)}, cos=${num(x)}. The circle has radius 1.`;zh=`θ+φ=${a+b}° = ${num(theta)} 弧度；sin=${num(y)}，cos=${num(x)}。圓的半徑為 1。`;
  } else if(type==='vectors'||type==='complex') {
    line(0,0,a,b);const p=point(a,b);circles.push({x:p[0],y:p[1],r:5,color:'#aa613f'});
    const space=type==='vectors'&&(lessonId.startsWith('s1-1')||lessonId==='sup-spatial-equations'),magnitude=Math.hypot(a,b,space?1:0);
    values={magnitude,dot:2*a+b+(space?3:0),argument:magnitude?Math.atan2(b,a):null};
    en=type==='vectors'?`v=(${a},${b}); |v|=${num(magnitude)}; v·(2,1)=${2*a+b}.`:`z=${a}+(${b})i; |z|=${num(magnitude)}; argument=${num(values.argument)} rad (undefined at zero).`;
    zh=type==='vectors'?`v=(${a},${b})；模長=${num(magnitude)}；v·(2,1)=${2*a+b}。`:`z=${a}+(${b})i；模長=${num(magnitude)}；幅角=${num(values.argument)} 弧度（零的幅角未定義）。`;
    if(space){en=`Space vector v=(${a},${b},1); |v|=${num(magnitude)}; v·(2,1,3)=${values.dot}. The drawing shows the xy-projection, not its full spatial length.`;zh=`空間向量 v=(${a},${b},1)；模長=${num(magnitude)}；v·(2,1,3)=${values.dot}。圖像只顯示 xy 投影，不是完整空間長度。`;}
  } else if(type==='solids') {
    const vertices=[[0,0],[a,0],[a,b],[0,b],[.9,.8],[a+.9,.8],[a+.9,b+.8],[.9,b+.8]];
    for(const [i,j]of[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]])line(vertices[i][0]-2,vertices[i][1]-2,vertices[j][0]-2,vertices[j][1]-2);
    values={volume:4*a*b,area:2*(4*a+4*b+a*b)};en=`Schematic cuboid (not to scale): ${a}×4×${b}; volume=${num(values.volume)}, surface area=${num(values.area)}.`;zh=`長方體示意圖（非按比例）：${a}×4×${b}；體積=${num(values.volume)}，表面積=${num(values.area)}。`;
  } else if(type==='conics') {
    if(lessonId==='s1-3-2'){plot(x=>Math.abs(x)>=a?b*Math.sqrt(x*x/a/a-1):NaN);plot(x=>Math.abs(x)>=a?-b*Math.sqrt(x*x/a/a-1):NaN);en=`Hyperbola x²/${a*a}−y²/${b*b}=1; a,b>0.`;zh=`雙曲線 x²/${a*a}−y²/${b*b}=1；a,b>0。`;}
    else if(lessonId==='s1-3-3'){if(a===0){line(-5.3,0,5.3,0);en='When a=0, y²=0 is the repeated line y=0, not a nondegenerate parabola.';zh='a=0 時 y²=0 退化為重直線 y=0，並非非退化拋物線。';}else{let d='';for(let y=-5;y<=5;y+=.03){const x=b+y*y/(4*a);if(Math.abs(x)>5.3)continue;const p=point(x,y);d+=`${d?'L':'M'}${p[0]},${p[1]}`;}paths.push({d,color:'#426b4b'});en=`Parabola y²=4a(x−b), a=${a}≠0. Vertex=(${b},0), focus=(${a+b},0); there is no centre of symmetry.`;zh=`拋物線 y²=4a(x−b)，a=${a}≠0；頂點=(${b},0)，焦點=(${a+b},0)，沒有對稱中心。`;}}
    else{let d='';for(let t=0;t<=2*Math.PI+.03;t+=.03){const p=point(a*Math.cos(t),b*Math.sin(t));d+=`${d?'L':'M'}${p[0]},${p[1]}`;}paths.push({d,color:'#426b4b'});en=`Ellipse with semiaxes ${a},${b}. A circle occurs when a=b; focus distance=${num(Math.sqrt(Math.abs(a*a-b*b)))}.`;zh=`半軸為 ${a}、${b} 的橢圓；a=b 時為圓；焦距參數=${num(Math.sqrt(Math.abs(a*a-b*b)))}。`;}
  } else if(type==='sequences') {
    const geometric=['s2-4-3','sup-infinite-series'].includes(lessonId),terms=Array.from({length:6},(_,i)=>geometric?a*b**i:a+i*b);
    const yScale=Math.min(28,140/Math.max(1,...terms.map(Math.abs)));
    terms.forEach((y,i)=>{const p=point(i-2.5,0);circles.push({x:p[0],y:180-yScale*y,r:4,color:'#426b4b'});});values={terms,sum:terms.reduce((s,v)=>s+v,0)};en=`First six ${geometric?'geometric':'arithmetic'} terms: ${terms.map(num).join(', ')}; sum=${num(values.sum)}. The vertical display scale adjusts to include all six terms.`;zh=`前六個${geometric?'等比':'等差'}項：${terms.map(num).join('、')}；和=${num(values.sum)}。縱向顯示尺度自動調整，讓六項均可見。`;
    if(lessonId==='sup-infinite-series'){values.infiniteSum=a/(1-b);en+=` Infinite sum=${num(values.infiniteSum)} because |r|<1.`;zh+=` 因 |r|<1，無窮和=${num(values.infiniteSum)}。`;}
  } else if(type==='probability') {
    const n=Math.round(a),masses=Array.from({length:n+1},(_,k)=>binomialMass(n,b,k));masses.forEach((p,k)=>{const x=60+k*500/(n+1);paths.push({d:`M${x},310V${310-p*260}`,color:'#547e60',width:16});});values={masses,mean:n*b,variance:n*b*(1-b)};en=`Binomial model: fixed n=${n}, independent trials, common p=${b}. E(X)=${num(values.mean)}, Var(X)=${num(values.variance)}. Bars show exact probabilities.`;zh=`二項模型：固定 n=${n}、試驗獨立、共同 p=${b}。E(X)=${num(values.mean)}，Var(X)=${num(values.variance)}；長條顯示精確概率。`;
  } else if(type==='statistics') {
    const points=Array.from({length:5},(_,i)=>[i+1,2*(i+1)+1+b+(i===4?a:0)]),r=regression(points);points.forEach(([x,y])=>{const p=point(x-3,(y-6)/2);circles.push({x:p[0],y:p[1],r:5,color:'#aa613f'});});plot(x=>(r.intercept+r.slope*(x+3)-6)/2);values=r;en=`Synthetic data: slope=${num(r.slope)}, intercept=${num(r.intercept)}, r=${num(r.r)}. Correlation alone does not establish causation.`;zh=`自編示例資料：斜率=${num(r.slope)}、截距=${num(r.intercept)}、r=${num(r.r)}。相關本身不能證明因果。`;
  } else if(type==='calculus') {
    plot(x=>a*x*x);plot(x=>a*b*b+2*a*b*(x-b),'#aa613f');values={slope:2*a*b,signedIntegral:a*b**3/3};en=`y=ax²; tangent slope at x=t is ${num(values.slope)}; signed integral from 0 to t is ${num(values.signedIntegral)}. Signed integral can be negative.`;zh=`y=ax²；在 x=t 的切線斜率=${num(values.slope)}；從 0 至 t 的定積分=${num(values.signedIntegral)}。定積分為有向量，可能為負。`;
  } else {
    values={squareSum:(a+b)**2,sumSquares:a*a+b*b,difference:2*a*b};labels.push({x:100,y:120,text:`(a+b)² = ${num(values.squareSum)}`},{x:100,y:200,text:`a²+b² = ${num(values.sumSquares)}`});en=`The difference is 2ab=${num(values.difference)}. Equality holds exactly when ab=0.`;zh=`兩者相差 2ab=${num(values.difference)}；恰在 ab=0 時相等。`;
  }
  return {paths,circles,labels,values,summary:{en,zh}};
}
