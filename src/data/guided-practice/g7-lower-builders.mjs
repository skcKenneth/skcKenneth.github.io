/** Original fixed Year 7 lower-volume practice. No textbook exercise or answer is copied.
 * Closed audit contracts (exact scalars are integer/rational strings):
 * angle-relation: relation,given,expected,parallelGiven; optional actual points/lines.
 * geometry-fact: rule,facts,valid; concrete coordinates/counterexample where relevant.
 * translation: points,shift,images,pairs; coordinates independently verify every displacement.
 * coordinate: point,request ('quadrant'|'axis'|'map'),expected, optional unit/origin.
 * root: operation,radicand/input,expected/solutions/lower/upper,valid; principal >= 0.
 * real-classification: expression,category,rationalValue?; finite/repeating explicitly defined.
 * arithmetic: expression,expected. root-arithmetic: terms [{coefficient,radicand}],result.
 * linear-system: variables,matrix (last column RHS),solution,method,context?.
 * linear-system-check: matrix,candidate,satisfies,variables.
 * linear-inequality: constraints [{left,right,operator}],interval {lo,hi,loClosed,hiClosed},
 *   optional integerRange,context; original expressions are retained.
 * statistics: counts,request,index,totalPopulation?,expected.
 * survey: rule,facts,valid; mechanism is explicit, no empirical representativeness guarantee.
 * histogram: values?,bins [{lo,hi,frequency,hiClosed?}],height,heights,request,expected.
 * Every numeric/geometric original and every answer remains separate from student display.
 */
import {bi,question,makePack} from './shared.mjs';
export const B=bi;
export const M=s=>'\\('+s+'\\)';
export const VERSION='2026-10-15-lower-core-v1';
export const PDF='大湾区初中数学三维课堂（七年级下册）正文.pdf';
export const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
export const ROLES=['worked','guided','prior','prior','independent','independent','independent','independent','exit','exit','supplement','supplement','supplement','supplement','extension','extension'];
const titles=['相交線','垂線（1）','垂線（2）','同位角、內錯角、同旁內角','平行線','平行線的判定（1）','平行線的判定（2）','平行線的判定（3）','平行線的性質（1）','平行線的性質（2）','平行線的判定、性質（綜合）','命題 定理','平移（1）','平移（2）','平方根（1）','平方根（2）','立方根','實數（1）','實數（2）','有序數對','平面直角坐標系（1）','平面直角坐標系（2）','用坐標表示地理位置','用坐標表示平移（1）','用坐標表示平移（2）','二元一次方程組','消元——解二元一次方程組（1）','消元——解二元一次方程組（2）','加減消元——二元一次方程組的解法（1）','加減消元——二元一次方程組的解法（2）','實際問題與二元一次方程組（1）','實際問題與二元一次方程組（2）','實際問題與二元一次方程組（3）','三元一次方程組（1）','三元一次方程組（2）','不等式及其解集','不等式的性質（1）','不等式的性質（2）','不等式的性質（3）','實際問題與一元一次不等式（1）','實際問題與一元一次不等式（2）','實際問題與一元一次不等式（3）','一元一次不等式組（1）','一元一次不等式組（2）','統計調查（1）','統計調查（2）','統計調查（3）','直方圖（1）','直方圖（2）'];
export function tex(s){return String(s).replace(/\^(-?\d+)/g,'^{$1}').replaceAll('*','\\cdot ');}
export const scalar=s=>String(s).includes('/')?'\\frac{'+String(s).split('/')[0]+'}{'+String(s).split('/')[1]+'}':String(s);
export const num=s=>{const [a,b=1]=String(s).split('/').map(Number);return a/b;};
const pairs=rows=>rows.map(r=>Array.isArray(r)?B(r[0],r[1]):r);
const defaultHints=[
 B('Separate the given information from what you must find.','分清已知資料與所求。'),
 B('Write the relevant definition or relation before calculating.','計算前先寫適用定義或關係。'),
 B('Check the result against every original condition, including units and endpoints.','用全部原條件核對，保留單位及端點條件。')
];
export function Q(role,suffix,lessons,prompt,answer,steps,fields={}){
 const q=question(role,suffix,{sourceLessons:lessons,prompt,answer,steps:pairs(steps),hints:defaultHints,
  rubric:[B('Use the given conditions and show a justified intermediate step.','使用已知條件，寫出有根據的中間步驟。'),B('State and check the requested result accurately.','準確寫出所求，並核對結果。')],space:'working',...fields});
 if(q.hints.length!==3)throw Error('Exactly three hints required: '+suffix);
 if(role==='guided'&&!q.scaffold)q.scaffold=[B('Relevant relation: ____.','適用關係：____。'),B('Intermediate calculation or deduction: ____.','中間計算或推論：____。'),B('Result and check: ____.','結果及核對：____。')];
 return q;
}
export function C(role,suffix,lessons,prompt,options,steps,audit,fields={}){
 return Q(role,suffix,lessons,prompt,options[0],steps,{type:'choice',options,correctChoice:0,audit,space:'short',...fields});
}
export function calc(role,suffix,lessons,prompt,expression,expected,steps,fields={}){
 return Q(role,suffix,lessons,prompt,B(M(scalar(expected))+(fields.unit?' '+fields.unit:'')+'.',M(scalar(expected))+(fields.unit?' '+fields.unit:'')+'。'),steps,
  {type:'numeric',numericAnswer:num(expected),answerExpression:tex(expression),audit:{kind:'arithmetic',expression,expected:String(expected)},...fields});
}
export function fact(role,suffix,lessons,prompt,answer,steps,rule,facts,valid=true,fields={}){
 return Q(role,suffix,lessons,prompt,answer,steps,{audit:{kind:'geometry-fact',rule,facts,valid},...fields});
}
export function angle(role,suffix,lessons,relation,given,fields={}){
 const names={vertical:B('vertically opposite','對頂'),supplementary:B('adjacent supplementary','鄰補'),corresponding:B('corresponding','同位'),alternate:B('alternate interior','內錯'),cointerior:B('same-side interior','同旁內'), 'perpendicular-split':B('other part of the right','直角內另一部分的')};
 const needParallel=['corresponding','alternate','cointerior'].includes(relation),total=relation==='perpendicular-split'?90:180;
 const expected=['vertical','corresponding','alternate'].includes(relation)?given:total-given;
 const prompt=fields.prompt||B((needParallel?'Two parallel coplanar lines are cut by a transversal. ':'')+'One angle is '+M(given+'^{\\circ}')+'. Find its '+names[relation].en+' angle; state the reason.',(needParallel?'同一平面內兩條平行線被截線所截。':'')+'一角為 '+M(given+'^{\\circ}')+'。求'+names[relation]['zh-Hant']+'角，寫出根據。');
 const method=expected===given?String(given):total+'-'+given;
 return calc(role,suffix,lessons,prompt,method,expected,[
  [needParallel?'Use the stated parallel condition before applying this angle relation.':'Use the angle relation stated in the question.',needParallel?'先使用題目給定的平行條件，再套用角關係。':'使用題目指定的角關係。'],
  ['The required angle is '+M(method+'='+expected)+' degrees.','所求角為 '+M(method+'='+expected)+' 度。']
 ],{unit:'°',skill:'angle-'+relation,audit:{kind:'angle-relation',relation,given:String(given),expected:String(expected),parallelGiven:needParallel},hints:[
  B('Locate both angles and identify their shared lines or vertex.','找出兩角所屬直線或公共頂點。'),
  B(expected===given?'This relation gives equal angles.':'The two relevant parts have a fixed total of '+total+' degrees.',expected===given?'本關係給出兩角相等。':'這兩部分的角度和固定為 '+total+' 度。'),
  B(needParallel?'Check that parallelism is given; then use the equality or supplementary sum.':'Use the defining equality or angle sum and check the unit.',needParallel?'確認已知平行，再用相等或互補關係。':'用定義中的相等或角度和，並核對單位。')
 ],...fields});
}
export function geom(points,edges,fields={}){return {kind:'geometry',points:Object.entries(points).map(([id,[x,y]])=>({id,x,y})),edges,...fields};}
export function translation(role,suffix,lessons,points,shift,fields={}){
 const images=Object.fromEntries(Object.entries(points).map(([id,p])=>[id+"'",p.map((v,i)=>v+shift[i])])),pairs2=Object.keys(points).map(id=>[id,id+"'"]);
 const givens=Object.entries(points).map(([id,p])=>M(id+'('+p.join(',')+')')).join(', ');
 const answers=Object.entries(images).map(([id,p])=>M(id+'('+p.join(',')+')')).join(', ');
 const direction=(shift[0]===0?'':Math.abs(shift[0])+' units '+(shift[0]>0?'right':'left'))+(shift[0]&&shift[1]?', then ':'')+(shift[1]===0?'':Math.abs(shift[1])+' units '+(shift[1]>0?'up':'down'));
 const directionZh=(shift[0]===0?'':'向'+(shift[0]>0?'右':'左')+' '+Math.abs(shift[0])+' 格')+(shift[0]&&shift[1]?'，再':'')+(shift[1]===0?'':'向'+(shift[1]>0?'上':'下')+' '+Math.abs(shift[1])+' 格');
 const diagram={kind:'coordinate',bounds:[-7,7,-7,7],points:Object.entries(points).map(([id,[x,y]])=>({id,x,y})),edges:Object.keys(points).length===3?[['A','B'],['B','C'],['C','A']]:[],solutionPoints:Object.entries(images).map(([id,[x,y]])=>({id,x,y})),solutionEdges:Object.keys(points).length===3?[["A'","B'"],["B'","C'"],["C'","A'"]]:[]};
 return Q(role,suffix,lessons,fields.prompt||B('Translate '+givens+' '+direction+'. Give every image coordinate and plot it.','把 '+givens+' '+directionZh+'。寫出各像點坐標，並在圖上標出。'),B(answers+'.',answers+'。'),[
  ['Every point uses the same change '+M('(x,y)\\mapsto(x+('+shift[0]+'),y+('+shift[1]+'))')+'.','每點使用相同變化 '+M('(x,y)\\mapsto(x+('+shift[0]+'),y+('+shift[1]+'))')+'。'],
  ['The image coordinates are '+answers+'.','各像點坐標為 '+answers+'。'],
  ['Check that corresponding coordinate differences all equal '+M('('+shift.join(',')+')')+'.','核對各對應點的坐標差都等於 '+M('('+shift.join(',')+')')+'。']
 ],{type:'construction',space:'drawing',skill:'translation',diagram,audit:{kind:'translation',points,shift,images,pairs:pairs2},hints:[
  B('A horizontal move changes only the first coordinate.','水平移動只改第一個坐標。'),B('A vertical move changes only the second coordinate.','垂直移動只改第二個坐標。'),B('Apply the same two changes to every vertex; do not reflect or rotate.','各頂點使用相同兩個改變，不能反射或旋轉。')
 ],...fields});
}
const gcd=(a,b)=>b===0n?(a<0n?-a:a):gcd(b,a%b);
const F=v=>{if(Array.isArray(v))return v;const [n,d='1']=String(v).split('/');let a=BigInt(n),b=BigInt(d);if(!b)throw Error('Zero denominator');if(b<0n){a=-a;b=-b;}const g=gcd(a,b);return [a/g,b/g];};
const fs=v=>{const[a,b]=F(v);return b===1n?String(a):a+'/'+b;};
const plus=(a,b)=>{a=F(a);b=F(b);return F([a[0]*b[1]+b[0]*a[1],a[1]*b[1]]).map((v,i,arr)=>v/gcd(arr[0],arr[1]));};
const times=(a,b)=>{a=F(a);b=F(b);return F(fs([a[0]*b[0],a[1]*b[1]]));};
const div=(a,b)=>{a=F(a);b=F(b);return F(fs([a[0]*b[1],a[1]*b[0]]));};
const minus=(a,b)=>plus(a,times('-1',b));
function linear(row,variables){const terms=variables.map((v,i)=>'('+scalar(fs(row[i]))+')'+v);return terms.join('+').replaceAll('+-','-');}
export function systemTex(matrix,vars){return '\\begin{cases}'+matrix.map(row=>linear(row,vars)+'='+scalar(fs(row.at(-1)))).join('\\\\')+'\\end{cases}';}
export function systemSteps(matrix,variables){
 const a=matrix.map(row=>row.map(F)),steps=[];
 for(let k=0;k<variables.length;k++){
  let p=k;while(p<a.length&&a[p][k][0]===0n)p++;if(p===a.length)throw Error('Singular authored system');
  if(p!==k){[a[p],a[k]]=[a[k],a[p]];steps.push(B('Interchange equations '+(p+1)+' and '+(k+1)+'.','交換第 '+(p+1)+'、'+(k+1)+' 條方程。'));}
  for(let i=k+1;i<a.length;i++)if(a[i][k][0]!==0n){const factor=div(a[i][k],a[k][k]);a[i]=a[i].map((v,j)=>minus(v,times(factor,a[k][j])));steps.push(B('Equation '+(i+1)+' minus '+M(scalar(fs(factor)))+' times equation '+(k+1)+' gives '+M(linear(a[i],variables)+'='+scalar(fs(a[i].at(-1))))+'.','第 '+(i+1)+' 式減去第 '+(k+1)+' 式的 '+M(scalar(fs(factor)))+' 倍，得 '+M(linear(a[i],variables)+'='+scalar(fs(a[i].at(-1))))+'。'));}
 }
 const solution=Array(variables.length).fill(F(0));
 for(let i=variables.length-1;i>=0;i--){let rhs=a[i].at(-1);for(let j=i+1;j<variables.length;j++)rhs=minus(rhs,times(a[i][j],solution[j]));solution[i]=div(rhs,a[i][i]);steps.push(B('Back-substitute to obtain '+M(variables[i]+'='+scalar(fs(solution[i])))+'.','回代得 '+M(variables[i]+'='+scalar(fs(solution[i])))+'。'));}
 steps.push(B('Substitute the complete tuple into every original equation; each left side equals its stated right side.','把完整解代回每條原方程，各左邊都等於原右邊。'));
 return {steps,solution:solution.map(fs)};
}
export function system(role,suffix,lessons,matrix,fields={}){
 const variables=matrix[0].length===4?['x','y','z']:['x','y'],solved=systemSteps(matrix,variables),answerExpression=variables.map((v,i)=>v+'='+scalar(solved.solution[i])).join(',\\quad ');
 return Q(role,suffix,lessons,fields.prompt||B('Solve the system. Show elimination and check every original equation.','解方程組，寫出消元過程，並驗算每條原方程。'),B(M(answerExpression)+'.',M(answerExpression)+'。'),solved.steps,{type:'short',space:'working',skill:variables.length===3?'three-variable-elimination':'two-variable-elimination',expression:systemTex(matrix,variables),answerExpression,audit:{kind:'linear-system',variables,matrix:matrix.map(row=>row.map(String)),solution:solved.solution,method:fields.method||'elimination'},hints:[
  B('Choose one unknown to eliminate from the other equations.','選一個未知數，從其餘方程消去它。'),B('If you multiply an equation, multiply every term and its right side.','倍乘一條方程時，每項及右邊都要乘。'),B('Eliminate the same unknown consistently, solve the reduced system, then back-substitute and check all original equations.','一致地消去同一未知數，解較少未知數的方程組，再回代並驗算全部原式。')
 ],...fields});
}
export function inequalityData(a,b,c,d,operator){
 const coefficient=minus(a,c),rhs=minus(d,b),zero=coefficient[0]===0n;
 if(zero){const r=num(fs(rhs)),valid=operator==='<'?0<r:operator==='<='?0<=r:operator==='>'?0>r:0>=r;return {interval:valid?{lo:null,hi:null,loClosed:false,hiClosed:false}:{lo:null,hi:null,loClosed:false,hiClosed:false,empty:true},coefficient:fs(coefficient),rhs:fs(rhs),valid};}
 const flip={'<':'>','<=':'>=','>':'<','>=':'<='},op=coefficient[0]<0n?flip[operator]:operator,bound=fs(div(rhs,coefficient)),closed=op.includes('='),lower=op.startsWith('>');
 return {interval:{lo:lower?bound:null,hi:lower?null:bound,loClosed:lower&&closed,hiClosed:!lower&&closed},coefficient:fs(coefficient),rhs:fs(rhs),bound,operator:op};
}
export function intervalTex(i){
 if(i.empty)return '\\varnothing';
 if(i.lo===null&&i.hi===null)return 'x\\in\\mathbb{R}';
 if(i.lo!==null&&i.hi!==null&&num(i.lo)===num(i.hi))return 'x='+scalar(i.lo);
 if(i.lo!==null&&i.hi!==null)return scalar(i.lo)+(i.loClosed?'\\leq ':'<')+'x'+(i.hiClosed?'\\leq ':'<')+scalar(i.hi);
 return 'x'+(i.lo!==null?(i.loClosed?'\\geq':'>' ):(i.hiClosed?'\\leq':'<'))+scalar(i.lo??i.hi);
}
export function intervalDiagram(interval,fields={}){
 const finite=[interval.lo,interval.hi].filter(v=>v!==null).map(v=>Math.abs(num(v))),extent=Math.max(5,Math.ceil(Math.max(0,...finite))+2);
 return {kind:'interval',min:-extent,max:extent,step:extent>12?Math.ceil(extent/6):1,intervals:[],solutionIntervals:interval.empty?[]:[{...interval,lo:interval.lo===null?null:num(interval.lo),hi:interval.hi===null?null:num(interval.hi)}],...fields};
}
export function inequality(role,suffix,lessons,coefficients,operator,fields={}){
 const [a,b,c,d]=coefficients,solved=inequalityData(a,b,c,d,operator),left=fields.left||'('+a+')x+('+b+')',right=fields.right||'('+c+')x+('+d+')',opTex={'<':'<','<=':'\\leq','>':'>','>=':'\\geq'}[operator],result=intervalTex(solved.interval);
 const steps=[B('Collect variable terms on the left and constants on the right: '+M(scalar(solved.coefficient)+'x'+opTex+scalar(solved.rhs))+'.','把未知數項集中左邊、常數項右邊：'+M(scalar(solved.coefficient)+'x'+opTex+scalar(solved.rhs))+'。')];
 if(solved.bound!==undefined)steps.push(B(num(solved.coefficient)<0?'Divide by a negative coefficient and reverse the inequality.':'Divide by the positive coefficient; the direction stays the same.',num(solved.coefficient)<0?'除以負係數，不等號反向。':'除以正係數，不等號方向不變。'));
 else steps.push(B(solved.valid?'The resulting constant statement is always true.':'The resulting constant statement is false.',solved.valid?'所得常數不等式恆真。':'所得常數不等式不成立。'));
 steps.push(B('The solution set is '+M(result)+'.','解集是 '+M(result)+'。'));
 return Q(role,suffix,lessons,fields.prompt||B('Solve the inequality'+(fields.draw?' and show its solution on the blank number line.':'.'),'解不等式'+(fields.draw?'，並在空白數軸表示解集。':'。')),B(M(result)+'.',M(result)+'。'),steps,{skill:'linear-inequality',expression:fields.display||tex(left)+opTex+tex(right),answerExpression:result,audit:{kind:'linear-inequality',constraints:[{left,right,operator}],interval:solved.interval},...(fields.draw?{diagram:intervalDiagram(solved.interval)}:{}),hints:[B('Collect unknown terms and constants using the same operation on both sides.','兩邊使用相同運算，集中未知數項及常數。'),B('Decide whether the coefficient you divide by is positive or negative.','判斷所除係數是正還是負。'),B('Reverse only for negative multiplication or division; then check strict versus included endpoints.','只在乘除負數時反向，再核對嚴格或包含端點。')],...fields});
}
export function inequalitySystem(role,suffix,lessons,constraints,interval,fields={}){
 const op={'<':'<','<=':'\\leq','>':'>','>=':'\\geq'},display='\\begin{cases}'+constraints.map(c=>tex(c.left)+op[c.operator]+tex(c.right)).join('\\\\')+'\\end{cases}',result=intervalTex(interval),integer=fields.integerRange;
 const answer=integer?(integer.length?M(integer[0]===integer[1]?'x='+integer[0]:integer[0]+'\\leq x\\leq'+integer[1])+', '+M('x\\in\\mathbb{Z}'):'No feasible integer.') :M(result);
 return Q(role,suffix,lessons,fields.prompt||B('Solve the system of inequalities; require every condition to hold.','解不等式組，各條件須同時成立。'),B(answer+'.',integer?(integer.length?M(integer[0]===integer[1]?'x='+integer[0]:integer[0]+'\\leq x\\leq'+integer[1])+'，'+M('x\\in\\mathbb{Z}')+'。':'沒有可行整數。'):M(result)+'。'),fields.steps||[
  B('Solve each original inequality separately, reversing direction only when dividing by a negative number.','逐條解原不等式，只在除以負數時反向。'),
  B('Take their common part: '+M(result)+'.','取公共部分：'+M(result)+'。'),
  B(integer?'Apply the stated integer restriction and check the extreme allowed integers.':'Check every included boundary in the original inequalities.',integer?'再用題目整數限制，核對最小及最大可行整數。':'把每個包含的邊界代回原不等式核對。')
 ],{skill:'inequality-intersection',expression:display,answerExpression:result,audit:{kind:'linear-inequality',constraints,interval,...(integer?{integerRange:integer}:{})},...(fields.draw?{diagram:intervalDiagram(interval)}:{}),hints:[B('“And” means the conditions hold at the same time.','「且」表示條件同時成立。'),B('Mark each restriction separately before taking their overlap.','先分別標各限制，再找重疊。'),B('Preserve open/closed endpoints and impose an integer restriction only when the situation requires it.','保留開閉端點，只在情境要求時加上整數限制。')],...fields});
}
export function lowerPack(id,nativeLesson,chapter,sourceLessons,title,summary,questions,fields={}){
 const pages=sourceLessons.flatMap(n=>[2*n-1,2*n]),chapters={5:B('Intersecting and parallel lines','相交線與平行線'),6:B('Real numbers','實數'),7:B('Cartesian coordinates','平面直角坐標系'),8:B('Simultaneous linear equations','二元一次方程組'),9:B('Inequalities and systems of inequalities','不等式與不等式組'),10:B('Collecting, organising and displaying data','數據的收集、整理與描述')},name=chapters[chapter],r=sourceLessons[0]+'–'+sourceLessons.at(-1);
 return makePack({id,grade:'g7',volume:'lower',nativeLesson,version:VERSION,title,summary,
  prerequisites:B('Review signed arithmetic, simple equations and the definitions stated in the prerequisite items.','重溫有理數運算、簡單方程及先備題所用定義。'),
  concept:summary,inquiry:B('Predict before checking a fixed case. Change one condition, explain what survives, then complete an independent paper task.','先預測，再核對指定案例；只改一項條件，解釋哪些結論仍成立，最後獨立完成紙筆題。'),
  taskTeacher:B('Use the worked and guided tasks selectively. The eight core paper tasks are prerequisites, independent tasks and exits; further practice and extensions are optional.','按需要選示範與帶做。八題學生核心為先備、獨立及離堂題；補練與延伸按程度選用。'),
  scope:B('Original 40-minute core consolidation after the mapped textbook lessons; not a replacement for every first-teaching period. Only the supplied text has been mapped.','對應教材教學後使用的 40 分鐘原創核心鞏固，並非代替每節新授課；來源對照只限已提供正文。'),
  sourceNavigation:B('Year 7 lower · Chapter '+chapter+' '+name.en+' · text lessons '+r,'七下第'+chapter+'章 '+name['zh-Hant']+'・正文第'+r+'課時'),
  source:{volume:'lower',fileName:PDF,chapter:'第'+chapter+'章 '+name['zh-Hant'],chapterNumber:chapter,textLessons:sourceLessons,section:sourceLessons.map(n=>'第'+n+'課時 '+titles[n-1]).join('；'),printedPages:pages,pdfPages:pages.map(n=>n+8),sections:sourceLessons.map(n=>({lesson:n,title:titles[n-1],printedPages:[2*n-1,2*n],pdfPages:[2*n+7,2*n+8]}))},questions,...fields});
}
