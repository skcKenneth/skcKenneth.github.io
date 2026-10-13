import {L} from '../data/senior-math/authoring.mjs';

const palette={axis:'#64748b',curve:'#2563eb',other:'#dc2626',aux:'#059669'};
const X=x=>320+32*x,Y=y=>180-32*y;
const point=(x,y,color=palette.other,r=4)=>({x:X(x),y:Y(y),r,color});
const label=(x,y,text)=>({x:X(x)+6,y:Y(y)-7,text});
const line=(a,b,color=palette.curve,width=2)=>({d:'M'+X(a[0])+','+Y(a[1])+' L'+X(b[0])+','+Y(b[1]),color,width});
const curve=(points,color=palette.curve)=>({d:points.map(([x,y],i)=>(i?'L':'M')+X(x)+','+Y(y)).join(' '),color,width:2});
const axes=()=>[line([-9,0],[9,0],palette.axis,1),line([0,-5],[0,5],palette.axis,1)];
const sample=(fn,n=180)=>Array.from({length:n+1},(_,i)=>fn(i/n));
const rounded=n=>Number.isFinite(n)?Math.round(n*1e8)/1e8:'undefined / 未定義';
const tableLabels={'Value':'Value / 數值','angle / degrees':'angle / degrees / 角度','Area':'Area / 面積','Collinear':'Collinear / 共線','a_horizontal':'a_horizontal / 水平半軸','b_vertical':'b_vertical / 垂直半軸','2 × major semiaxis':'2 × major semiaxis / 長半軸兩倍','valid standard equation':'valid standard equation / 標準式有效','slope':'slope / 斜率','offset':'offset / 截距','intersection count':'intersection count / 交點數','focus':'focus / 焦點','directrix x':'directrix x / 準線x坐標','distance to directrix':'distance to directrix / 到準線距離','discriminant':'discriminant / 判別式','intersections':'intersections / 交點數','midpoint':'midpoint / 中點'};
const displayCell=v=>typeof v==='number'?rounded(v):({none:'none / 無',undefined:'undefined / 未定義',true:'true / 是',false:'false / 否'}[v]||v);
const ctrl=(key,en,zh,min,max,step,value)=>({key,label:L(en,zh),min,max,step,value});
const definitions={
 'vectors-geometric':[ctrl('x','Horizontal component','水平分量',-5,5,.5,3),ctrl('y','Vertical component','垂直分量',-4,4,.5,2),ctrl('t','Scalar multiplier','數乘倍數',-2,2,.25,1)],
 'vectors-coordinates':[ctrl('t','Affine weight t','仿射權重t',-.5,1.5,.05,.5)],
 'vectors-dot':[ctrl('x','v horizontal component','v水平分量',-5,5,.5,3),ctrl('y','v vertical component','v垂直分量',-4,4,.5,4)],
 'vectors-proof-triangles':[ctrl('x','C horizontal coordinate','C水平坐標',-4,4,.25,1),ctrl('y','C vertical coordinate','C垂直坐標',-3,4,.25,3)],
 'conics-ellipse':[ctrl('a','Horizontal semiaxis','水平半軸',0,5,.25,4),ctrl('b','Vertical semiaxis','垂直半軸',0,4,.25,2)],
 'conics-hyperbola':[ctrl('a','Transverse semiaxis a','實半軸a',0,3,.25,2),ctrl('b','Conjugate parameter b','虛半軸參數b',0,3,.25,1),ctrl('k','Parallel-line offset','平行線截距',-3,3,.25,1)],
 'conics-parabola':[ctrl('a','Signed focal parameter a','有符號焦參數a',-2.5,2.5,.25,1),ctrl('h','Vertex horizontal coordinate','頂點水平坐標',-3,3,.25,0)],
 'conics-intersections':[ctrl('m','Line slope m','直線斜率m',-3,3,.25,.5),ctrl('b','Line intercept b','直線截距b',-4,4,.25,1),ctrl('vertical','Vertical mode: 0 no, 1 yes','垂直模式：0否，1是',0,1,1,0),ctrl('c','Vertical line x=c','垂直直線x＝c',-4,4,.25,0)],
};
export function controls(id){return (definitions[id]||[]).map(c=>({...c,label:{...c.label}}));}
export function scene(id,input={}){
 if(!definitions[id])throw Error('Unknown vector/conic inquiry: '+id);
 const p=Object.fromEntries(definitions[id].map(c=>[c.key,Number.isFinite(+input[c.key])?Math.min(c.max,Math.max(c.min,+input[c.key])):c.value]));
 const out={paths:axes(),circles:[],labels:[],values:{},summary:L('','')};
 const table=(en,zh,rows)=>{out.table={headers:[L(en,zh),L('Value','數值')],rows:rows.map(([k,v])=>[tableLabels[k]||k,displayCell(v)])};};
 if(id==='vectors-geometric'){
  const {x,y,t}=p,norm=Math.hypot(x,y),u=[x,y],v=[t*x,t*y],start=[-3,-2],end=[-3+v[0],-2+v[1]];
  const viewScale=Math.min(1,7/Math.max(1,Math.abs(x),Math.abs(start[0]),Math.abs(end[0])),4/Math.max(1,Math.abs(y),Math.abs(start[1]),Math.abs(end[1]))),plot=P=>P.map(v=>v*viewScale),up=plot(u),sp=plot(start),ep=plot(end);
  out.paths.push(line([0,0],up),line(sp,ep,palette.other));
  out.circles.push(point(...up,palette.curve),point(...ep));out.labels.push(label(...up,'u'),label(...ep,'tu'));
  out.values={x,y,t,norm,scaledNorm:Math.abs(t)*norm,scaledX:t*x,scaledY:t*y,unitDefined:norm>0&&t!==0,viewScale};
  out.summary=L('Blue is u; red is tu from a translated start. Both arrows use the same adaptive scale so their complete lengths stay visible. Length uses |t|; a zero arrow has no unit direction.','藍色為u；紅色為從平移起點畫出的tu。兩箭頭使用同一自動比例，令完整長度保持可見。長度使用|t|；零箭頭沒有單位方向。');
  table('Quantity','量',[['u',u.join(', ')],['tu',v.join(', ')],['|u|',norm],['|tu|',Math.abs(t)*norm]]);
 }else if(id==='vectors-coordinates'){
  const t=p.t,A=[-2,1],B=[4,3],P=[-2+6*t,1+2*t];
  out.paths.push(line(A,B),line(A,P,palette.other,3));out.circles.push(point(...A,palette.aux),point(...B,palette.aux),point(...P));out.labels.push(label(...A,'A'),label(...B,'B'),label(...P,'P'));
  out.values={t,x:P[0],y:P[1],internal:t>0&&t<1,endpoint:t===0||t===1,ratio:t===1?null:Math.abs(t)/Math.abs(1-t)};
  out.summary=L('P=(1−t)A+tB. Internal division requires 0<t<1; t outside [0,1] gives external division.','P＝(1−t)A＋tB。內分要求0<t<1；t在[0,1]外給外分。');
  table('Quantity','量',[['t',t],['P',P.map(rounded).join(', ')],['AP',Math.abs(t)*Math.sqrt(40)],['PB',Math.abs(1-t)*Math.sqrt(40)]]);
 }else if(id==='vectors-dot'){
  const {x,y}=p,u=[2,1],v=[x,y],dot=2*x+y,t=dot/5,projection=[2*t,t],residual=[x-2*t,y-t],n=Math.hypot(x,y);
  out.paths.push(line([-8,-4],[8,4],palette.axis),line([0,0],u),line([0,0],v,palette.other),line([0,0],projection,palette.aux,4),line(projection,v,palette.aux));
  out.circles.push(point(...projection,palette.aux));out.labels.push(label(...u,'u'),label(...v,'v'),label(...projection,'tu'));
  out.values={dot,t,projection,residual,residualDot:2*residual[0]+residual[1],angle:n?Math.acos(Math.max(-1,Math.min(1,dot/(Math.sqrt(5)*n))))*180/Math.PI:null};
  out.summary=L('The green vector is the projection tu. Its residual has dot product zero with u; the angle is undefined at v=0.','綠色向量為投影tu；其餘向量與u數量積零。v＝0時夾角未定義。');
  table('Quantity','量',[['u·v',dot],['t',t],['u·(v−tu)',out.values.residualDot],['angle / degrees',out.values.angle??'undefined']]);
 }else if(id==='vectors-proof-triangles'){
  const A=[-3,-1],B=[3,-1],C=[p.x,p.y],mid=(u,v)=>u.map((a,i)=>(a+v[i])/2),M=mid(B,C),N=mid(A,C),K=mid(A,B),G=[p.x/3,(p.y-2)/3];
  out.paths.push(line(A,B),line(B,C),line(C,A),line(A,M,palette.aux),line(B,N,palette.aux),line(C,K,palette.aux));out.circles.push(point(...G));out.labels.push(label(...A,'A'),label(...B,'B'),label(...C,'C'),label(...G,'G'));
  out.values={area:3*Math.abs(p.y+1),degenerate:p.y===-1,centroid:G,medianRatio:2};
  out.summary=L('The medians contain G=(A+B+C)/3 in ratio 2:1. At C_y=−1, the positions are collinear and area is zero.','中線均通過G＝(A＋B＋C)/3，比例2:1。C的縱坐標為−1時三點共線、面積零。');
  table('Quantity','量',[['G',G.map(rounded).join(', ')],['Area',out.values.area],['Collinear',String(out.values.degenerate)],['AG/GM',2]]);
 }else if(id==='conics-ellipse'){
  const {a,b}=p,major=Math.max(a,b),minor=Math.min(a,b),c=Math.sqrt(major*major-minor*minor),f1=a>=b?[-c,0]:[0,-c],f2=a>=b?[c,0]:[0,c];
  out.paths.push(curve(sample(t=>[a*Math.cos(2*Math.PI*t),b*Math.sin(2*Math.PI*t)])));out.circles.push(point(...f1),point(...f2));out.labels.push(label(...f1,'F1'),label(...f2,'F2'));
  const P=[a*Math.cos(Math.PI/3),b*Math.sin(Math.PI/3)],sum=Math.hypot(P[0]-f1[0],P[1]-f1[1])+Math.hypot(P[0]-f2[0],P[1]-f2[1]);
  out.circles.push(point(...P,palette.aux));out.values={a,b,c,e:major?c/major:null,focalSum:sum,degenerate:minor===0,circle:a===b&&a>0};
  out.summary=L('The major axis follows the larger semiaxis. A zero semiaxis is a boundary segment (both zero gives a point); equal positive axes give a circle.','長軸跟隨較大半軸。半軸零為邊界線段，兩者皆零為點；相等正半軸給圓。');
  table('Quantity','量',[['a_horizontal',a],['b_vertical',b],['c',c],['PF1+PF2',sum],['2 × major semiaxis',2*major]]);
 }else if(id==='conics-hyperbola'){
  const {a,b,k}=p;
  if(a===0||b===0){out.values={a,b,k,valid:false,intersectionCount:null};out.summary=L('The standard hyperbola equation is undefined when a or b is zero. No nondegenerate curve or intersection count is asserted.','a或b為零時，雙曲線標準方程未定義；此時不宣稱非退化曲線或交點數。');table('Parameter','參數',[['a',a],['b',b],['valid standard equation','false']]);return out;}
  for(const sign of [-1,1])out.paths.push(curve(sample(t=>{const z=-1.8+3.6*t;return [sign*a*Math.cosh(z),b*Math.sinh(z)];})));
  const m=b/a;
  out.paths.push(line([-9,-9*m],[9,9*m],palette.aux),line([-9,9*m],[9,-9*m],palette.aux),line([-9,-9*m+k],[9,9*m+k],palette.other));
  const ix=k?-(b*b+k*k)*a/(2*b*k):null,iy=k?m*ix+k:null;
  if(k&&Math.abs(ix)<10&&Math.abs(iy)<6){out.circles.push(point(ix,iy));out.labels.push(label(ix,iy,'P'));}
  out.values={a,b,k,valid:true,slope:m,intersectionCount:k===0?0:1,intersection:k===0?null:[ix,iy],leadingCoefficient:0};
  out.summary=L('The red line is parallel to the positive-slope asymptote. At zero offset it has no intersection; otherwise the cancelled quadratic leaves one linear solution, not a tangency test.','紅線平行於正斜率漸近線；截距零時無交點，否則二次項相消留下唯一線性解，這不是相切判斷。');
  table('Quantity','量',[['slope',m],['offset',k],['intersection count',out.values.intersectionCount],['P',k?[ix,iy].map(rounded).join(', '):'none']]);
 }else if(id==='conics-parabola'){
  const {a,h}=p,F=[h+a,0],P=a?[h+a,2*a]:[h+2,0];
  if(a)out.paths.push(curve(sample(t=>{const y=-5+10*t;return [h+y*y/(4*a),y];})));
  else out.paths.push(line([-9,0],[9,0]));
  out.paths.push(line([h-a,-5],[h-a,5],palette.aux),line(P,F,palette.other),line(P,[h-a,P[1]],palette.aux));
  out.circles.push(point(...F),point(...P,palette.aux));out.labels.push(label(...F,'F'),label(...P,'P'),label(h,0,'V'));
  const focalDistance=Math.hypot(P[0]-F[0],P[1]),directrixDistance=Math.abs(P[0]-(h-a));
  out.values={a,h,focus:F,directrixX:h-a,point:P,focalDistance,directrixDistance,degenerate:a===0};
  out.summary=L('The sampled point has equal distances to the focus and directrix. At a=0 the equation reduces to y²=0, a degenerate line.','取樣點到焦點及準線距離相等。a＝0時方程化為y²＝0，是退化直線。');
  table('Quantity','量',[['focus',F.join(', ')],['directrix x',h-a],['PF',focalDistance],['distance to directrix',directrixDistance]]);
 }else{
  const {m,b,c}=p,vertical=p.vertical>=.5,points=[];
  out.paths.push(curve(sample(t=>[3*Math.cos(2*Math.PI*t),2*Math.sin(2*Math.PI*t)])));
  let disc,A,B,C,midpoint=null;
  if(vertical){A=1/4;B=0;C=c*c/9-1;disc=-4*A*C;out.paths.push(line([c,-5],[c,5],palette.other));if(disc>=-1e-12){const y=2*Math.sqrt(Math.max(0,1-c*c/9));points.push([c,y]);if(y>1e-10)points.push([c,-y]);}}
  else {A=4+9*m*m;B=18*m*b;C=9*b*b-36;disc=B*B-4*A*C;out.paths.push(line([-9,-9*m+b],[9,9*m+b],palette.other));if(disc>=-1e-10){const root=Math.sqrt(Math.max(0,disc)),x1=(-B+root)/(2*A),x2=(-B-root)/(2*A);points.push([x1,m*x1+b]);if(root>1e-9)points.push([x2,m*x2+b]);}}
  for(const P of points)out.circles.push(point(...P));
  if(points.length){midpoint=points.length===1?points[0]:points[0].map((x,i)=>(x+points[1][i])/2);out.circles.push(point(...midpoint,palette.aux,5));out.labels.push(label(...midpoint,'M'));}
  out.values={vertical,A,B,C,discriminant:disc,intersectionCount:points.length,points,midpoint};
  out.summary=L('The actual quadratic always has positive leading coefficient for this ellipse. Zero discriminant merges the two endpoints; vertical lines are handled separately.','此橢圓的實際二次式首項係數總為正；判別式零時兩端點重合，垂直線另行處理。');
  table('Quantity','量',[['A',A],['B',B],['C',C],['discriminant',disc],['intersections',points.length],['midpoint',midpoint?midpoint.map(rounded).join(', '):'none']]);
 }
 // A fixed viewing window deliberately clips unbounded curves and long arrows;
 // exact coordinates remain in the table. Do not leave text labels clipped.
 if(out.labels.some(l=>l.x<8||l.x>600||l.y<16||l.y>345)){
  out.labels=out.labels.filter(l=>l.x>=8&&l.x<=600&&l.y>=16&&l.y<=345);
  out.summary=L(out.summary.en+' Some endpoints lie outside the viewing window; read their exact coordinates in the table.',out.summary.zh+' 部分端點在視窗外；請在表格讀取其精確坐標。');
 }
 return out;
}
