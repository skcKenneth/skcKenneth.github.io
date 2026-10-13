/** Eight skill-specific SVG scenes; no browser, storage or external dependency. */
const L=(en,zh)=>({en,zh});
const control=(key,en,zh,min,max,step,value)=>({key,label:L(en,zh),min,max,step,value});
const definitions={
 'quadratics-vertex':[control('a','Square coefficient a','平方係數 a',-3,3,.5,1),control('h','Vertex input h','頂點輸入 h',-4,4,.5,1),control('k','Vertex height k','頂點高度 k',-3,3,.5,-1)],
 'quadratics-roots':[control('a','Quadratic coefficient a','二次項係數 a',-2,2,.5,1),control('b','Linear coefficient b','一次項係數 b',-4,4,.5,-2),control('c','Constant c','常數 c',-4,4,.5,0)],
 'quadratics-inequalities':[control('a','Leading coefficient a','首項係數 a',-2,2,.5,1),control('r1','First factor root','第一因式根',-4,4,.5,-1),control('r2','Second factor root','第二因式根',-4,4,.5,2),control('weak','Include equality (1=yes, 0=no)','包含等號（1 是、0 否）',0,1,1,1)],
 'quadratics-intervals':[control('a','Square coefficient a','平方係數 a',-2,2,.5,1),control('h','Vertex input h','頂點輸入 h',-4,4,.5,1),control('L','Endpoint L','端點 L',-5,5,.5,-2),control('U','Endpoint U','端點 U',-5,5,.5,3)],
 'trig-unit-circle':[control('theta','Angle θ (degrees)','角 θ（度）',-720,720,15,120),control('radius','Radius r','半徑 r',.5,4,.5,2)],
 'trig-identities':[control('theta','Angle x (degrees)','角 x（度）',-360,360,15,45)],
 'trig-transformations':[control('A','Signed coefficient A','帶符號係數 A',-4,4,.5,2),control('omega','Angular frequency ω','角頻率 ω',-3,3,.25,1),control('phi','Phase φ (degrees)','相位 φ（度）',-180,180,15,0),control('D','Midline D','中線 D',-3,3,.5,0)],
 'trig-equations':[control('n','Integer frequency n','整數頻率 n',1,4,1,1),control('target','Target height k','目標高度 k',-1.5,1.5,.25,.5)]
};
export function controls(id){if(!definitions[id])throw Error('Unknown quadratic/trigonometric skill: '+id);return definitions[id].map(c=>({...c,label:{...c.label}}));}
const fmt=n=>Math.abs(n)<1e-10?'0':Number(n.toFixed(5)).toString();
const rad=d=>d*Math.PI/180;
const unique=xs=>[...xs].sort((a,b)=>a-b).filter((x,i,all)=>!i||Math.abs(x-all[i-1])>1e-8);
function params(id,given){
 return Object.fromEntries(controls(id).map(c=>{let v=Number(given?.[c.key]);if(!Number.isFinite(v))v=c.value;
  v=Math.max(c.min,Math.min(c.max,v));if(['n','weak'].includes(c.key))v=Math.round(v);return[c.key,v];}));
}
function drawing(xMin=-6,xMax=6,yMin=-5,yMax=5){
 const paths=[],circles=[],labels=[];
 const point=(x,y)=>({x:50+(x-xMin)/(xMax-xMin)*550,y:310-(y-yMin)/(yMax-yMin)*260});
 function line(x1,y1,x2,y2,color='#899b88',width=1){const p=point(x1,y1),q=point(x2,y2);paths.push({d:'M'+p.x+','+p.y+'L'+q.x+','+q.y,color,width});}
 function plot(fn,color='#356447',lo=xMin,hi=xMax){let d='',active=false,previousY=null;for(let i=0;i<=480;i++){const x=lo+(hi-lo)*i/480,y=fn(x);if(!Number.isFinite(y)||y<yMin||y>yMax){active=false;previousY=null;continue;}const p=point(x,y);if(previousY!==null&&Math.abs(y-previousY)>(yMax-yMin)*.65)active=false;d+=(active?'L':'M')+p.x.toFixed(2)+','+p.y.toFixed(2);active=true;previousY=y;}if(d)paths.push({d,color,width:2.5});}
 function dot(x,y,color='#a45d38',r=4){if(x<xMin||x>xMax||y<yMin||y>yMax)return;circles.push({...point(x,y),r,color});}
 if(yMin<=0&&yMax>=0)line(xMin,0,xMax,0);
 if(xMin<=0&&xMax>=0)line(0,yMin,0,yMax);
 labels.push({x:50,y:332,text:fmt(xMin)},{x:575,y:332,text:fmt(xMax)},{x:10,y:54,text:fmt(yMax)},{x:10,y:312,text:fmt(yMin)});
 return {paths,circles,labels,point,line,plot,dot};
}
function rootFacts(a,b,c){
 if(a===0){if(b===0)return {type:'constant',discriminant:null,roots:[],allReal:c===0};return {type:'linear',discriminant:null,roots:[-c/b],allReal:false};}
 const discriminant=b*b-4*a*c;
 const roots=discriminant<0?[]:discriminant===0?[-b/(2*a)]:unique([(-b-Math.sqrt(discriminant))/(2*a),(-b+Math.sqrt(discriminant))/(2*a)]);
 return {type:'quadratic',discriminant,roots,allReal:false};
}
function inequalitySet(a,r1,r2,weak){
 if(a===0)return weak?'ℝ':'∅';
 const [u,v]=[r1,r2].sort((x,y)=>x-y),left=weak?'[':'(',right=weak?']':')';
 if(u===v)return a>0?(weak?'ℝ':'ℝ ∖ {'+fmt(u)+'}'):(weak?'{'+fmt(u)+'}':'∅');
 return a>0?'(−∞,'+fmt(u)+(weak?']':')')+' ∪ '+(weak?'[':'(')+fmt(v)+',∞)':left+fmt(u)+','+fmt(v)+right;
}
function trigRoots(n,k){
 if(Math.abs(k)>1)return [];
 const alpha=Math.asin(k)*180/Math.PI,bases=[alpha,180-alpha],out=[];
 for(const base of bases)for(let m=-n-1;m<=n+1;m++){const x=(base+360*m)/n;if(x>=-1e-9&&x<=360+1e-9)out.push(Math.max(0,Math.min(360,x)));}
 return unique(out);
}
export function scene(id,given={}){
 const p=params(id,given),trig=id.startsWith('trig-'),circle=id==='trig-unit-circle';
 const d=circle?drawing(-4.5,4.5,-4.5,4.5):trig?drawing(id==='trig-equations'?0:-360,360,-5,5):drawing();
 let values={},summary=L('',''),table;
 if(id==='quadratics-vertex'){
  const {a,h,k}=p,f=x=>a*(x-h)**2+k;d.plot(f);if(a!==0){d.dot(h,k);d.line(h,-5,h,5,'#b58a69');}
  values={...p,type:a===0?'constant':'quadratic',vertex:a===0?null:{x:h,y:k},extremumType:a>0?'minimum':a<0?'maximum':'constant'};
  table={headers:[L('Input','輸入'),L('Output','輸出'),L('Distance from h','到 h 距離')],rows:[h-2,h-1,h,h+1,h+2].map(x=>[fmt(x),fmt(f(x)),fmt(Math.abs(x-h))])};
  summary=a===0?L('a=0: y='+fmt(k)+' is constant; every input attains the same value, with no unique vertex.','a=0：y='+fmt(k)+' 為常數；每個輸入同值，沒有唯一頂點。'):
   L('Vertex ('+fmt(h)+','+fmt(k)+'); '+(a>0?'minimum':'maximum')+' '+fmt(k)+'. Equal distances give equal outputs.','頂點 ('+fmt(h)+','+fmt(k)+')；'+(a>0?'最小':'最大')+'值 '+fmt(k)+'。等距給等值。');
 }else if(id==='quadratics-roots'){
  const {a,b,c}=p,f=x=>a*x*x+b*x+c,facts=rootFacts(a,b,c);d.plot(f);facts.roots.forEach(x=>d.dot(x,0));values={...p,...facts};
  table={headers:[L('Root','根'),L('Substitution residual','代入餘值')],rows:facts.roots.map(x=>[fmt(x),fmt(f(x))])};
  const rootText=facts.allReal?'all real inputs':facts.roots.length?facts.roots.map(fmt).join(', '):'none';
  summary=L('Equation type: '+facts.type+'. Real zeros: '+rootText+'. '+(a===0?'The quadratic discriminant rule is not used.':'Discriminant = '+fmt(facts.discriminant)+'.'),
   '方程類型：'+(facts.type==='quadratic'?'二次':facts.type==='linear'?'一次':'常數')+'。實零點：'+(facts.allReal?'全體實輸入':facts.roots.length?facts.roots.map(fmt).join('、'):'沒有')+'。'+(a===0?'不使用二次判別式規則。':'判別式 = '+fmt(facts.discriminant)+'。'));
 }else if(id==='quadratics-inequalities'){
  const {a,r1,r2,weak}=p,[u,v]=[r1,r2].sort((x,y)=>x-y),f=x=>a*(x-u)*(x-v);d.plot(f);d.dot(u,0);d.dot(v,0);
  const probes=unique([u-1,u,(u+v)/2,v,v+1]),solution=inequalitySet(a,u,v,weak===1);values={...p,solution,roots:unique([u,v]),constant:a===0};
  table={headers:[L('Probe input','檢查輸入'),L('Value','值'),L('Satisfies target?','符合目標？')],rows:probes.map(x=>[fmt(x),fmt(f(x)),(weak?f(x)>=0:f(x)>0)?'✓':'×'])};
  summary=L('Target f(x) '+(weak?'≥':' >')+' 0. Solution: '+solution+'. Repeated roots and a=0 are treated separately.',
   '目標 f(x) '+(weak?'≥':'>')+' 0。解集：'+solution+'。重根及 a=0 另作處理。');
 }else if(id==='quadratics-intervals'){
  const {a,h}=p,[lo,hi]=[p.L,p.U].sort((x,y)=>x-y),f=x=>a*(x-h)**2,candidates=unique([lo,hi,...(h>=lo&&h<=hi?[h]:[])]);
  d.plot(f,'#b2bca9');d.plot(f,'#356447',lo,hi);candidates.forEach(x=>d.dot(x,f(x)));
  const heights=candidates.map(f),minimum=Math.min(...heights),maximum=Math.max(...heights);
  values={...p,lower:lo,upper:hi,minimum,maximum,minimisingInputs:a===0?'all interval inputs':candidates.filter(x=>Math.abs(f(x)-minimum)<1e-10),maximisingInputs:a===0?'all interval inputs':candidates.filter(x=>Math.abs(f(x)-maximum)<1e-10)};
  table={headers:[L('Allowed candidate','允許候選值'),L('Output','輸出')],rows:candidates.map(x=>[fmt(x),fmt(f(x))])};
  summary=L('Closed interval ['+fmt(lo)+','+fmt(hi)+']. Minimum '+fmt(minimum)+', maximum '+fmt(maximum)+'. '+(a===0?'Every interval input attains both.':'Compare endpoints and only an admissible vertex.'),
   '閉區間 ['+fmt(lo)+','+fmt(hi)+']。最小值 '+fmt(minimum)+'，最大值 '+fmt(maximum)+'。'+(a===0?'區間內每個輸入均取得兩者。':'比較端點及可行頂點。'));
 }else if(id==='trig-unit-circle'){
  const {theta,radius}=p,s=Math.sin(rad(theta)),c=Math.cos(rad(theta)),x=radius*c,y=radius*s,tangent=Math.abs(c)<1e-12?null:s/c;
  // Use equal pixel scales for an actual circle, rather than a stretched world-coordinate oval.
  const cx=320,cy=180,scale=30;d.paths.length=0;d.circles.length=0;d.labels.length=0;
  d.paths.push({d:'M170,180H470M320,30V330',color:'#899b88',width:1});
  d.circles.push({x:cx,y:cy,r:radius*scale,color:'#66825c'});
  d.paths.push({d:'M320,180L'+(cx+x*scale)+','+(cy-y*scale),color:'#a45d38',width:3});
  d.circles.push({x:cx+x*scale,y:cy-y*scale,r:5,color:'#a45d38'});
  d.labels.push({x:475,y:185,text:'x'},{x:327,y:30,text:'y'});
  values={...p,x,y,sine:s,cosine:c,tangent,radians:rad(theta),squaredNorm:s*s+c*c};
  table={headers:[L('Quantity','量'),L('Value','值')],rows:[['θ (rad)',fmt(rad(theta))],['x',fmt(x)],['y',fmt(y)],['cos θ',fmt(c)],['sin θ',fmt(s)],['tan θ',tangent===null?'undefined / 未定義':fmt(tangent)]]};
  summary=L('Physical point ('+fmt(x)+','+fmt(y)+'); divide by positive r='+fmt(radius)+' for the unit-circle coordinates. Positive angles turn counterclockwise.',
   '實際點 ('+fmt(x)+','+fmt(y)+')；除以正半徑 r='+fmt(radius)+' 得單位圓坐標。正角逆時針。');
 }else if(id==='trig-identities'){
  const {theta}=p,s=Math.sin(rad(theta)),c=Math.cos(rad(theta)),denominator=Math.sin(rad(2*theta)),quotientDefined=Math.abs(denominator)>1e-12,tangentDefined=Math.abs(c)>1e-12;
  const numerator=1-Math.cos(rad(2*theta)),quotient=quotientDefined?numerator/denominator:null,tangent=tangentDefined?s/c:null;
  d.plot(x=>Math.abs(Math.cos(rad(x)))<.035?NaN:Math.tan(rad(x)));
  for(let x=-360;x<=360;x+=180){d.dot(x,0,'#a45d38',6);d.dot(x,0,'#fbfcf7',3);}
  if(tangent!==null)d.dot(theta,tangent,'#6e5291',4);
  values={...p,numerator,denominator,quotientDefined,tangentDefined,quotient,tangent};
  table={headers:[L('Expression','式子'),L('Value at selected angle','所選角的值')],rows:[['sin 2x',fmt(denominator)],['(1−cos 2x)/sin 2x',quotient===null?'undefined / 未定義':fmt(quotient)],['tan x',tangent===null?'undefined / 未定義':fmt(tangent)]]};
  summary=L('The quotient equals tan x only when sin 2x≠0. Ring markers at multiples of 180° are extra holes in the original quotient; at odd multiples of 90° both expressions are undefined.',
   '分式只在 sin 2x≠0 時等於 tan x。180° 倍數的圓環標示原分式的額外缺點；奇數倍 90° 處兩式均未定義。');
 }else if(id==='trig-transformations'){
  const {A,omega,phi,D}=p,f=x=>D+A*Math.sin(rad(omega*x+phi)),constant=A===0||omega===0;
  d.plot(f);d.line(-360,D,360,D,'#b58a69');
  const period=constant?null:360/Math.abs(omega),shift=constant?null:-phi/omega,constantValue=constant?f(0):null;
  values={...p,amplitude:constant?0:Math.abs(A),coefficientMagnitude:Math.abs(A),periodDegrees:period,periodRadians:period===null?null:rad(period),shiftDegrees:shift,shiftRadians:shift===null?null:rad(shift),constant,constantValue,minimum:constant?constantValue:D-Math.abs(A),maximum:constant?constantValue:D+Math.abs(A)};
  const xs=constant?[-180,0,180]:[shift,shift+period/4,shift+period/2,shift+3*period/4,shift+period];
  table={headers:[L('Input (degrees)','輸入（度）'),L('Output','輸出')],rows:xs.map(x=>[fmt(x),fmt(f(x))])};
  summary=constant?L('Constant function y='+fmt(constantValue)+'. Every positive period works, so there is no least positive period. With ω=0, D alone need not be the constant height.',
   '常數函數 y='+fmt(constantValue)+'。每個正週期均成立，故沒有最小正週期。ω=0 時，常數高度不一定只等於 D。'):
   L('Amplitude '+fmt(Math.abs(A))+', period '+fmt(period)+'° ('+fmt(rad(period))+' rad), actual horizontal shift '+fmt(shift)+'°. Phase φ='+fmt(phi)+'°; midline D='+fmt(D)+'.',
   '振幅 '+fmt(Math.abs(A))+'，週期 '+fmt(period)+'°（'+fmt(rad(period))+' 弧度），實際水平平移 '+fmt(shift)+'°。相位 φ='+fmt(phi)+'°；中線 D='+fmt(D)+'。');
 }else if(id==='trig-equations'){
  const {n,target}=p,roots=trigRoots(n,target);d.plot(x=>Math.sin(rad(n*x)));d.line(0,target,360,target,'#a45d38',2);roots.forEach(x=>d.dot(x,target));
  values={...p,roots,count:roots.length,domain:[0,360],closed:true};
  table={headers:[L('Solution x (degrees)','解 x（度）'),L('sin(nx)−k','sin(nx)−k')],rows:roots.map(x=>[fmt(x),fmt(Math.sin(rad(n*x))-target)])};
  summary=L('Solve sin('+n+'x)='+fmt(target)+' on the closed interval [0°,360°]. '+roots.length+' distinct solutions: '+(roots.length?roots.map(fmt).join(', '):'none')+'. Endpoint inputs count separately; coincident branches are deduplicated.',
   '在閉區間 [0°,360°] 解 sin('+n+'x)='+fmt(target)+'。'+roots.length+' 個相異解：'+(roots.length?roots.map(fmt).join('、'):'沒有')+'。端點輸入分別計數；重合分支去重。');
 }
 return {paths:d.paths,circles:d.circles,labels:d.labels,values,summary,...(table?{table}:{})};
}
