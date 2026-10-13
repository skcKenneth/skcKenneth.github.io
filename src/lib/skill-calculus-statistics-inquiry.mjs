/** Deterministic, original mathematical scenes. Coordinates are clipped to the plot box. */
const L=(en,zh)=>({en,zh});
const green='#237153',blue='#245ba7',orange='#b35619',red='#a93345',gray='#59636c';
const definitions={
 'calculus-tangent':[['a','Contact input','切點自變量',-2,2,.1,1],['h','Secant increment','割線增量',-1,1,.05,.5]],
 'calculus-rules':[['k','Inner multiplier','內層倍數',-2,2,.1,2],['x','Evaluation input','求值自變量',-2,2,.1,0]],
 'calculus-extrema':[['k','Cubic parameter','三次函數參數',-6,6,.25,3],['left','Closed interval left','閉區間左端',-2,0,.1,-2],['right','Closed interval right','閉區間右端',0,2,.1,1]],
 'calculus-inflection':[['k','Quartic parameter','四次函數參數',-6,6,.25,-6],['x','Curvature input','凹凸性自變量',-2,2,.1,0]],
 'probability-conditional':[['prior','Defective prior','次品先驗',0,1,.01,.1],['alpha','Flag likelihood for defective','次品標示似然',0,1,.01,.9],['beta','Flag likelihood for good','良品標示似然',0,1,.01,.1]],
 'probability-moments':[['a','Outcome multiplier','取值倍數',-3,3,.1,1],['b','Outcome shift','取值平移',-4,4,.1,0]],
 'probability-models':[['K','Red objects in a bag of six','六件袋中的紅件',0,6,1,3],['n','Number of draws','抽取數目',0,6,1,2]],
 'statistics-regression':[['delta','Change in final response','最後反應改變量',-8,8,.25,0],['shift','Shift every response','所有反應平移',-3,3,.25,0]],
};
export function controls(id){if(!definitions[id])throw Error(`Unknown calculus/statistics inquiry ${id}`);return definitions[id].map(([key,en,zh,min,max,step,value])=>({key,label:L(en,zh),min,max,step,value}));}
const fmt=x=>Math.abs(x)<1e-10?'0':Number(x.toFixed(5)).toString();
function parameters(id,input={}){const supplied=input&&typeof input==='object'?input:{};return Object.fromEntries(controls(id).map(c=>{const raw=supplied[c.key],n=typeof raw==='number'||typeof raw==='string'&&raw.trim()?Number(raw):NaN,value=Number.isFinite(n)?Math.min(c.max,Math.max(c.min,n)):c.value;return [c.key,c.step===1?Math.round(value):value];}));}
function frame(xmin,xmax,ymin,ymax){const sx=x=>56+(x-xmin)*564/(xmax-xmin),sy=y=>310-(y-ymin)*286/(ymax-ymin);return {xmin,xmax,ymin,ymax,sx,sy};}
// Liang–Barsky clipping preserves crossing segments without drawing false boundary plateaus.
function segment(x1,y1,x2,y2,m,color,width=2){const a=m.sx(x1),b=m.sy(y1),dx=m.sx(x2)-a,dy=m.sy(y2)-b;let lo=0,hi=1;
 for(const [p,q] of [[-dx,a-56],[dx,620-a],[-dy,b-24],[dy,310-b]]){if(p===0){if(q<0)return null;}else{const t=q/p;if(p<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>hi)return null;}}
 return {d:`M${fmt(a+lo*dx)},${fmt(b+lo*dy)}L${fmt(a+hi*dx)},${fmt(b+hi*dy)}`,color,width};}
function curve(fn,m,color,width=2.5){const pieces=[];let prev=null;for(let i=0;i<=240;i++){const x=m.xmin+(m.xmax-m.xmin)*i/240,y=fn(x);if(Number.isFinite(y)){if(prev){const p=segment(prev[0],prev[1],x,y,m,color,width);if(p)pieces.push(p.d);}prev=[x,y];}else prev=null;}return {d:pieces.join(''),color,width};}
function plotBase(m){const paths=[],labels=[];const xAxis=m.ymin<=0&&m.ymax>=0?0:m.ymin,yAxis=m.xmin<=0&&m.xmax>=0?0:m.xmin;
 paths.push(segment(m.xmin,xAxis,m.xmax,xAxis,m,gray,1),segment(yAxis,m.ymin,yAxis,m.ymax,m,gray,1));
 for(let i=0;i<=4;i++){const x=m.xmin+(m.xmax-m.xmin)*i/4,y=m.ymin+(m.ymax-m.ymin)*i/4;labels.push({x:m.sx(x),y:330,text:fmt(x)},{x:4,y:m.sy(y)+4,text:fmt(y)});}
 labels.push({x:606,y:350,text:'x'});return {paths:paths.filter(Boolean),circles:[],labels};}
function mark(s,m,x,y,color){if(x>=m.xmin&&x<=m.xmax&&y>=m.ymin&&y<=m.ymax)s.circles.push({x:m.sx(x),y:m.sy(y),r:4,color});}
const rect=(x,y,w,h,color)=>({d:`M${fmt(x)},${fmt(y)}h${fmt(w)}v${fmt(h)}h${fmt(-w)}Z`,color,width:1});
function choose(n,k){if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-i+1)/i;return r;}
export function scene(id,input={}){const p=parameters(id,input);
 if(id==='calculus-tangent'){
  const {a,h}=p,m=frame(-3,3,-2,10),s=plotBase(m),slope=2*a,secant=h===0?null:2*a+h;
  s.paths.push(curve(x=>x*x,m,blue),curve(x=>a*a+slope*(x-a),m,green));
  if(secant!==null)s.paths.push(curve(x=>a*a+secant*(x-a),m,orange));
  mark(s,m,a,a*a,green);mark(s,m,a+h,(a+h)**2,orange);
  s.labels.push({x:64,y:16,text:'f=x² 藍/blue; tangent 切線 綠/green; secant 割線 橙/orange'});
  return {...s,values:{a,h,tangentSlope:slope,secantSlope:secant,verticalError:h*h},
   summary:h===0?L('At h=0 the two secant points coincide: its quotient is undefined. The derivative and tangent still exist.','h=0 時割線兩點重合，差商未定義；導數及切線仍存在。'):L(`Secant slope ${fmt(secant)} tends to ${fmt(slope)}. The tangent error is h²=${fmt(h*h)}.`,`割線斜率 ${fmt(secant)} 趨向 ${fmt(slope)}，切線誤差 h²=${fmt(h*h)}。`),
   table:{headers:[L('Increment','增量'),L('Secant slope','割線斜率'),L('Tangent error','切線誤差')],rows:[h,h/2,h/10].map(v=>[fmt(v),v===0?'undefined / 未定義':fmt(2*a+v),fmt(v*v)])}};
 }
 if(id==='calculus-rules'){
  const {k,x}=p,f=z=>(k*z+1)**3,d=z=>3*k*(k*z+1)**2,wrong=z=>3*(k*z+1)**2;
  const sample=Array.from({length:81},(_,i)=>-2+i/20).flatMap(z=>[f(z),d(z),wrong(z)]),low=Math.min(-2,...sample),high=Math.max(3,...sample),margin=(high-low)*.05,m=frame(-2,2,low-margin,high+margin),s=plotBase(m);
  s.paths.push(curve(f,m,blue),curve(d,m,green),curve(wrong,m,orange));mark(s,m,x,d(x),green);
  s.labels.push({x:64,y:16,text:'f 藍/blue; f′ 綠/green; missing k 漏 k 橙/orange'});
  return {...s,values:{k,x,functionValue:f(x),correctDerivative:d(x),missingInnerFactor:wrong(x)},
   summary:k===0?L('The function is constant 1, so its derivative is 0. Omitting k incorrectly gives 3.','函數為常數 1，導數為 0；漏掉 k 會錯得 3。'):L(`The chain rule multiplies by k=${fmt(k)}; the derivative at x=${fmt(x)} is ${fmt(d(x))}.`,`鏈式法則須乘 k=${fmt(k)}；x=${fmt(x)} 時導數為 ${fmt(d(x))}。`),
   table:{headers:[L('Input','自變量'),L('Function','函數'),L('Derivative','導數'),L('Missing factor result','漏因子結果')],rows:[-1,0,1].map(z=>[z,fmt(f(z)),fmt(d(z)),fmt(wrong(z))])}};
 }
 if(id==='calculus-extrema'){
  const {k,left,right}=p,f=x=>x**3-k*x,m=frame(-3,3,-46,46),s=plotBase(m),critical=k>0?[-Math.sqrt(k/3),Math.sqrt(k/3)]:k===0?[0]:[];
  s.paths.push(curve(f,m,blue));for(const x of critical)mark(s,m,x,f(x),green);for(const x of [left,right])mark(s,m,x,f(x),orange);
  const candidates=[...new Set([left,right,...critical.filter(x=>x>=left&&x<=right)])].sort((a,b)=>a-b),values=candidates.map(f),min=Math.min(...values),max=Math.max(...values);
  s.labels.push({x:64,y:16,text:'f=x³−kx; stationary 駐點 綠/green; endpoints 端點 橙/orange'});
  return {...s,values:{k,left,right,localExtremaCount:k>0?2:0,intervalMinimum:min,intervalMaximum:max},
   summary:left===right?L('The allowed interval is a single point: minimum and maximum coincide.','容許區間只有一點，最小值及最大值相同。'):k===0?L('Zero is stationary but not an extremum. Compare the closed endpoints for global interval extrema.','零為駐點但非極值點，閉區間全域極值須比較端點。'):k<0?L('The derivative is positive everywhere. The interval extrema occur at its endpoints.','導數處處為正，區間極值出現在兩端。'):L('There are two local extrema, but only in-range candidates and endpoints determine the interval optimum.','有兩個局部極值，但區間最佳值只由域內候選點及端點決定。'),
   table:{headers:[L('Candidate input','候選自變量'),L('Function value','函數值'),L('Role','角色')],rows:candidates.map(x=>[fmt(x),fmt(f(x)),x===left||x===right?'Endpoint / 端點':k===0?'Stationary, no extremum / 駐點非極值':x<0?'Local maximum / 局部極大':'Local minimum / 局部極小'])}};
 }
 if(id==='calculus-inflection'){
  const {k,x}=p,f=z=>z**4+k*z*z,d2=z=>12*z*z+2*k,m=frame(-2,2,-14,64),s=plotBase(m),roots=k<0?[-Math.sqrt(-k/6),Math.sqrt(-k/6)]:[];
  s.paths.push(curve(f,m,blue),curve(d2,m,orange));for(const z of roots)mark(s,m,z,f(z),green);mark(s,m,x,f(x),blue);
  s.labels.push({x:64,y:16,text:'f 藍/blue; f″ 橙/orange; inflections 拐點 綠/green'});
  return {...s,values:{k,x,functionValue:f(x),secondDerivative:d2(x),inflectionCount:roots.length},
   summary:k===0?L('f″=12x² vanishes at zero but stays nonnegative. There is no inflection.','f″=12x² 在零消失但維持非負，沒有拐點。'):k>0?L('The second derivative is positive everywhere: no inflection.','二階導數處處為正，沒有拐點。'):L('Two simple second-derivative roots change concavity. They need not have horizontal tangents.','兩個二階導數單根使凹凸性改變，切線不必水平。'),
   table:{headers:[L('Input','自變量'),L('Second derivative','二階導數'),L('Concavity','凹凸性')],rows:[-1.5,0,1.5].map(z=>[z,fmt(d2(z)),d2(z)>0?'Up / 向上':d2(z)<0?'Down / 向下':'Zero: test sides / 零：檢查兩側'])}};
 }
 if(id==='probability-conditional'){
  const {prior,alpha,beta}=p,a=prior*alpha,b=(1-prior)*beta,total=a+b,posterior=total>0?a/total:null;
  const paths=[rect(150,60,430,45,'#e4e9ee'),rect(150,60,430*prior,45,blue),rect(150,160,430,45,'#e4e9ee')];if(posterior!==null)paths.push(rect(150,160,430*posterior,45,green));
  paths.push(rect(150,260,430*a,35,blue),rect(150+430*a,260,430*b,35,orange));
  return {paths,circles:[],labels:[{x:12,y:87,text:'Prior 先驗 P(D)'},{x:12,y:187,text:'P(D|flag 標示)'},{x:12,y:282,text:'Flags 標示聯合'},{x:150,y:330,text:'Defective 次品 藍/blue; good 良品 橙/orange; full 全寬 = 1'}],values:{prior,alpha,beta,defectiveFlagJoint:a,goodFlagJoint:b,flagProbability:total,posterior},
   summary:posterior===null?L('A flag has probability zero, so the elementary posterior ratio is undefined.','標示概率為零，基本後驗比值未定義。'):L(`The flagged group includes both joint contributions; posterior is ${fmt(posterior)}, rather than the likelihood ${fmt(alpha)}.`,`標示組包含兩種聯合貢獻；後驗為 ${fmt(posterior)}，不等於似然 ${fmt(alpha)}。`),
   table:{headers:[L('State','狀態'),L('Flag joint probability','標示聯合概率'),L('No-flag joint probability','未標示聯合概率')],rows:[['Defective / 次品',fmt(a),fmt(prior*(1-alpha))],['Good / 良品',fmt(b),fmt((1-prior)*(1-beta))],['Total / 合計',fmt(total),fmt(1-total)]]}};
 }
 if(id==='probability-moments'){
  const {a,b}=p,mu=a+b,variance=a*a,m=frame(-12,12,0,1.2),s=plotBase(m),distribution=a===0?[[b,1]]:[[b,.5],[2*a+b,.5]].sort((x,y)=>x[0]-y[0]);
  for(const [x,probability] of distribution){s.paths.push(rect(m.sx(x)-8,m.sy(probability),16,m.sy(0)-m.sy(probability),blue));mark(s,m,x,probability,blue);}mark(s,m,mu,0,orange);
  s.labels.push({x:64,y:16,text:'Y=aX+b; P(X=0)=P(X=2)=1/2; E(Y) 橙/orange'});
  return {...s,values:{a,b,mean:mu,variance},summary:a===0?L('Both outcomes merge at b with probability one; variance is zero.','兩結果合併於 b，概率為一，方差為零。'):L(`Mean a+b=${fmt(mu)}; variance a²=${fmt(variance)}. A shift changes location only.`,`期望 a+b=${fmt(mu)}，方差 a²=${fmt(variance)}；平移只改變位置。`),
   table:{headers:[L('Outcome','取值'),L('Probability','概率'),L('Squared deviation','離均平方'),L('Weighted deviation','加權離均平方')],rows:distribution.map(([x,probability])=>[fmt(x),probability,fmt((x-mu)**2),fmt(probability*(x-mu)**2)])}};
 }
 if(id==='probability-models'){
  const N=6,{K,n}=p,probability=K/N,counts=Array.from({length:n+1},(_,k)=>k),hg=k=>choose(K,k)*choose(N-K,n-k)/choose(N,n),bin=k=>choose(n,k)*probability**k*(1-probability)**(n-k),paths=[{d:'M56,80V300H620',color:gray,width:1}],labels=[{x:64,y:16,text:'No replacement 不放回 綠/green; replacement 放回 藍/blue'},{x:12,y:84,text:'P=1'},{x:12,y:194,text:'0.5'},{x:12,y:304,text:'0'}];
  const step=500/(n+1),width=Math.min(18,step*.22);for(const k of counts){const x=80+step*(k+.5);paths.push(rect(x-width-2,300-220*hg(k),width,220*hg(k),green),rect(x+2,300-220*bin(k),width,220*bin(k),blue));labels.push({x:x-5,y:326,text:String(k)});}
  const vb=n*probability*(1-probability),vh=vb*(N-n)/(N-1);
  return {paths,circles:[],labels:[...labels,{x:540,y:347,text:'Count 計數'}],values:{N,K,n,mean:n*probability,withoutReplacementVariance:vh,withReplacementVariance:vb,supportMin:Math.max(0,n-(N-K)),supportMax:Math.min(n,K)},
   summary:n===N?L(`Drawing the full bag gives exactly K=${K} red objects without replacement. Replacement still has variance unless the bag is monochrome.`,`不放回抽全袋必有 K=${K} 紅件；放回時除單色袋外仍有方差。`):n===0?L('No draws gives count zero with probability one in both models.','不抽取時，兩模型均以概率一得到零。'):K===0||K===N?L('A monochrome bag makes the count deterministic in both models.','單色袋使兩模型的計數均確定。'):L('Without replacement the finite population reduces count variance; support can exclude some binomial counts.','不放回時有限母體使計數方差減少，可能值範圍可排除部分二項計數。'),
   table:{headers:[L('Red count','紅件數'),L('Without replacement','不放回'),L('With replacement','放回')],rows:counts.map(k=>[k,fmt(hg(k)),fmt(bin(k))])}};
 }
 if(id==='statistics-regression'){
  const {delta,shift}=p,points=[1,2,3,4,5].map(x=>[x,2*x+shift+(x===5?delta:0)]),mx=3,my=points.reduce((t,q)=>t+q[1],0)/5,xx=10,xy=points.reduce((t,[x,y])=>t+(x-mx)*(y-my),0),slope=xy/xx,intercept=my-slope*mx,m=frame(0,6,-10,24),s=plotBase(m),residuals=points.map(([x,y])=>y-intercept-slope*x),sse=residuals.reduce((t,e)=>t+e*e,0);
  s.paths.push(curve(x=>intercept+slope*x,m,green));for(const [x,y] of points){mark(s,m,x,y,blue);const line=segment(x,y,x,intercept+slope*x,m,red,2);if(line)s.paths.push(line);}mark(s,m,mx,my,orange);
  s.labels.push({x:64,y:16,text:'Pairs 點 藍/blue; fit 線 綠/green; residuals 殘差 紅/red'});
  s.labels.push({x:376,y:350,text:'Centroid 中心點 橙/orange'});
  return {...s,values:{delta,shift,slope,intercept,squaredError:sse,residualSum:residuals.reduce((a,b)=>a+b,0)},
   summary:L(`Fitted ŷ=${fmt(intercept)}+${fmt(slope)}x. Shifting every response changes the intercept only; changing the last pair also changes slope.`,`回歸式 ŷ=${fmt(intercept)}+${fmt(slope)}x；整體反應平移只改截距，改最後一組配對亦會改斜率。`),
   table:{headers:[L('Input','自變量'),L('Observed','觀察'),L('Predicted','預測'),L('Residual','殘差')],rows:points.map(([x,y],i)=>[x,fmt(y),fmt(intercept+slope*x),fmt(residuals[i])])}};
 }
 throw Error(`Unknown calculus/statistics inquiry ${id}`);
}
/** A repeatable simulation of the sampling mechanisms, separate from exact probabilities. */
export function simulate(id,input={},seed=37,trials=200){
 if(id!=='probability-models')throw Error(`Simulation is unavailable for ${id}`);
 const {K,n}=parameters(id,input),N=6,effectiveSeed=Number.isFinite(Number(seed))?Number(seed)>>>0:37,effectiveTrials=Number.isFinite(Number(trials))?Math.max(1,Math.min(2000,Math.floor(Number(trials)))):200;
 let state=effectiveSeed;
 const random=()=>{state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
 const replacement=Array(n+1).fill(0),finite=Array(n+1).fill(0);
 for(let i=0;i<effectiveTrials;i++){
  let red=0;for(let draw=0;draw<n;draw++)if(Math.floor(random()*N)<K)red++;replacement[red]++;
  const bag=Array.from({length:N},(_,j)=>j);red=0;
  for(let draw=0;draw<n;draw++){const position=Math.floor(random()*bag.length),[object]=bag.splice(position,1);if(object<K)red++;}finite[red]++;
 }
 const mean=counts=>counts.reduce((total,count,k)=>total+k*count,0)/effectiveTrials;
 return {seed:effectiveSeed,trials:effectiveTrials,params:{N,K,n},withReplacement:{counts:replacement,mean:mean(replacement)},withoutReplacement:{counts:finite,mean:mean(finite)},
  summary:L(`Simulation of ${effectiveTrials} samples: bag N=6, K=${K}, draws n=${n}, seed=${effectiveSeed}. Frequencies vary by seed and are not exact probabilities.`,`模擬 ${effectiveTrials} 個樣本：袋 N=6、K=${K}、抽取 n=${n}、種子 ${effectiveSeed}。頻數隨種子改變，並非精確概率。`),
  table:{headers:[L('Red count','紅件數'),L('No-replacement frequency','不放回頻數'),L('Replacement frequency','放回頻數')],rows:finite.map((count,k)=>[k,count,replacement[k]])}};
}
