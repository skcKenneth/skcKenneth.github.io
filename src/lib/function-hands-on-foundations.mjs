/** Direct manipulation of the fixed Chapter 3 foundation examples.
 * Learner constructions never change the fixed data or execute expressions.
 */
import {C,t,fmt,clamp,snap,clone,text,line,circle,rect,plot,dragValue} from './function-hands-on-common.mjs';
import {functionValue} from './function-worksheet-models.mjs';

export const ids=Object.freeze(['01','02','03','04','05','06']);
const known=id=>{if(!ids.includes(id))throw new RangeError('Unknown foundation lesson.');return id;};
const finitePoint=a=>a&&typeof a.x==='number'&&Number.isFinite(a.x)&&typeof a.y==='number'&&Number.isFinite(a.y);
const validDrag=a=>a?.type==='drag'&&typeof a.id==='string'&&finitePoint(a)&&['move','end'].includes(a.phase);
const changed=(s,n)=>JSON.stringify(s)===JSON.stringify(n)?s:n;
const arrSet=a=>`{${a.map(fmt).join(', ')}}`;
const distinct=a=>[...new Set(a)].sort((x,y)=>x-y);
const included=(l,v)=>t(l,v?'included':'excluded',v?'包括':'不包括');
const result=(l,ok,lines)=>({status:ok?'success':'revise',title:t(l,ok?'Your claim fits the construction':'Revisit the construction',ok?'你的判斷符合這個構造':'請重新檢視構造'),lines});
const base=(title,task,svg,summary,headers,rows,handles=[],zones=[],buttons=[],choices=[],claims=[],custom=false)=>({title,task,svg,summary,headers,rows,handles,zones,buttons,choices,claims,custom});
const title=(id,l)=>({
 '01':t(l,'Build a mapping','建立對應'), '02':t(l,'One rule, two domains','同一法則，兩種定義域'),
 '03':t(l,'Paint the allowed inputs','塗出允許輸入'), '04':t(l,'Combine restrictions and find ranges','合併限制與求值域'),
 '05':t(l,'Place the table points','放置表格的點'), '06':t(l,'Move the two boundaries','移動兩段的邊界'),
})[id];
const selection=(id,label,value,options)=>({id,label,value,options:options.map(([value,label])=>({value,label}))});
const functionClaims=l=>[{value:'function',label:t(l,'This defines a function','這可定義函數')},{value:'not-function',label:t(l,'This does not define a function','這不能定義函數')}];
const axis=(Y,min=-2,max=6,x=100,w=760)=>{
 const X=v=>x+(v-min)/(max-min)*w;
 let svg=line(x,Y,x+w,Y,C.muted,3);
 for(let v=Math.ceil(min);v<=max;v++)svg+=line(X(v),Y-7,X(v),Y+7,C.muted)+text(X(v),Y+30,fmt(v),'text-anchor="middle" font-size="16"');
 return {X,svg};
};
const dot=(x,y,closed,color=C.green,r=8)=>circle(x,y,r,closed?color:C.paper,color);
const polyline=(points,color=C.green,width=3,attrs='')=>`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" ${attrs}/>`;
const graph=(p,fn,a,b,color=C.green)=>{
 const points=[];for(let i=0;i<=100;i++){const x=a+(b-a)*i/100,y=fn(x);if(Number.isFinite(y))points.push([p.X(x),p.Y(y)]);}
 return points.length?polyline(points,color):'';
};
const coordinateHandle=(id,x,y,label,shortLabel,nudge={x:24,y:0},kind='slider')=>({id,kind,x,y,label,shortLabel,nudge});

function initial01(preset='source'){
 const outputs=preset==='constant'?[6,8,10]:[5,7];
 const links=preset==='constant'?[[1,8],[2,8],[3,8]]:preset==='missing'?[[1,5],[2,5]]:preset==='multiple'?[[1,5],[2,5],[2,7],[3,7]]:[[1,5],[2,5],[3,7]];
 return {preset,outputs,links,custom:false};
}
function mappingState(raw){
 const source=raw&&typeof raw==='object'?raw:{},preset=['source','missing','multiple','constant'].includes(source.preset)?source.preset:'source',base=initial01(preset);
 if(Array.isArray(source.links)){
  base.links=[];
  for(const pair of source.links)if(Array.isArray(pair)&&pair.length===2&&[1,2,3].includes(pair[0])&&base.outputs.includes(pair[1])&&!base.links.some(([x,y])=>x===pair[0]&&y===pair[1]))base.links.push([...pair]);
 }
 base.custom=source.custom===true;
 return base;
}
function initial03(rule='interval'){
 return {rule,left:rule==='interval'?0:rule==='reciprocal'?2:3,right:4,regions:rule==='interval'?[false,true,false]:rule==='reciprocal'?[true,true]:[false,true],leftClosed:rule!=='reciprocal',rightClosed:false,integer:false,probe:2,custom:false};
}
function initial04(mode='combined'){
 return {mode,masks:[],probe:2,simplified:false,selected:[0,1,4],rangeLo:0,rangeHi:4,connected:mode==='range-interval',custom:false};
}
function initial06(model='rental'){
 return {model,firstEnd:model==='rental'?1:0,secondStart:model==='rental'?1:0,firstClosed:model==='rental',secondClosed:model!=='rental',probe:model==='rental'?1:0,custom:false};
}
export function create(id){
 known(id);
 if(id==='01')return initial01();
 if(id==='02')return {model:'projection',placements:{},custom:false};
 if(id==='03')return initial03();
 if(id==='04')return initial04();
 if(id==='05')return {kind:'continuous',points:[null,null,null,null,null],connected:false,probe:2.5,custom:false};
 return initial06();
}

const mappingY=(s,output)=>s.outputs.length===2?(output===s.outputs[0]?200:350):150+s.outputs.indexOf(output)*120;
function reduce01(s,a){
 if(a.type==='preset'&&a.id==='pattern'&&['source','missing','multiple','constant'].includes(a.value))return initial01(a.value);
 if(!validDrag(a)||a.phase!=='end')return s;
 const fresh=/^new-([123])$/.exec(a.id),existing=/^edge-([123])-(\d+)$/.exec(a.id);
 if(!fresh&&!existing)return s;
 const input=Number((fresh||existing)[1]),out=/^output-(\d+)$/.exec(a.zone||'');
 if(a.zone==='remove'&&existing){if(!s.links.some(([x,y])=>x===input&&y===Number(existing[2])))return s;const n=clone(s);n.links=n.links.filter(([x,y])=>x!==input||y!==Number(existing[2]));n.custom=true;return changed(s,n);}
 if(!out||!s.outputs.includes(Number(out[1])))return s;
 const output=Number(out[1]),n=clone(s);
 if(fresh&&s.links.some(([x,y])=>x===input&&y===output))return s;
 if(existing){if(!s.links.some(([x,y])=>x===input&&y===Number(existing[2])))return s;n.links=n.links.filter(([x,y])=>x!==input||y!==Number(existing[2]));}
 if(!n.links.some(([x,y])=>x===input&&y===output))n.links.push([input,output]);
 n.links.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);n.custom=true;return changed(s,n);
}
const chips=s=>s.model==='paper'?[-1,0,.5,1,2]:[-2,-1,0,.5,1,2,3];
const domains02=s=>s.model==='paper'?[[-1,0,1],[0,1]]:[[-2,-1,0,1,2],[-2,2]];
const accepts02=(s,board,x)=>board==='finite'?domains02(s)[0].includes(x):s.model==='paper'?domains02(s)[1].includes(x):x>=-2&&x<=2;
const value02=(s,x)=>x*x+(s.model==='projection'?1:0);
function reduce02(s,a){
 if(a.type==='preset'&&a.id==='model'&&['projection','paper'].includes(a.value))return {model:a.value,placements:{},custom:false};
 if(!validDrag(a)||a.phase!=='end'||!['finite','other','tray'].includes(a.zone))return s;
 const match=/^chip-(\d+)$/.exec(a.id),i=match?Number(match[1]):-1;
 if(i<0||i>=chips(s).length)return s;
 const n=clone(s);if(a.zone==='tray')delete n.placements[i];else n.placements[i]=a.zone;return changed(s,n);
}
function reduce03(s,a){
 if(a.type==='preset'&&a.id==='rule'&&['interval','reciprocal','sqrt'].includes(a.value))return initial03(a.value);
 const n=clone(s);
 if(a.type==='action'){
  if(a.id==='toggle-left')n.leftClosed=!n.leftClosed;
  else if(a.id==='toggle-right'&&s.rule==='interval')n.rightClosed=!n.rightClosed;
  else if(a.id==='toggle-integer')n.integer=!n.integer;
  else if(/^region-[012]$/.test(a.id)&&Number(a.id.at(-1))<n.regions.length)n.regions[Number(a.id.at(-1))]=!n.regions[Number(a.id.at(-1))];
  else return s;
  n.custom=true;return changed(s,n);
 }
 if(a.type==='paint'&&Number.isFinite(a.x1)&&Number.isFinite(a.x2)&&Number.isFinite(a.y1)&&Number.isFinite(a.y2)&&s.rule==='interval'){
  if(a.y1<160||a.y1>365||a.y2<160||a.y2>365)return s;
  n.left=snap(clamp(-2+(Math.min(a.x1,a.x2)-100)/760*8,-2,6),.25);n.right=snap(clamp(-2+(Math.max(a.x1,a.x2)-100)/760*8,-2,6),.25);n.regions=[false,true,false];n.custom=true;return changed(s,n);
 }
 if(!validDrag(a))return s;
 if(a.id==='probe'){n.probe=dragValue(a,-2,6,100,860,'x',.25);return changed(s,n);}
 if(a.id==='left'){n.left=Math.min(dragValue(a,-2,6,100,860,'x',.25),s.rule==='interval'?s.right:6);n.custom=true;return changed(s,n);}
 if(a.id==='right'&&s.rule==='interval'){n.right=Math.max(dragValue(a,-2,6,100,860,'x',.25),s.left);n.custom=true;return changed(s,n);}
 if(a.id==='paint'&&a.phase==='end'&&/^paint-[012]$/.test(a.zone||'')){const i=Number(a.zone.at(-1));if(i<n.regions.length){n.regions[i]=!n.regions[i];n.custom=true;return changed(s,n);}}
 return s;
}
const maskSpecs=mode=>mode==='combined'?[['root','x + 1 ≥ 0',x=>x>=-1],['denominator','x − 2 ≠ 0',x=>x!==2]]:mode==='inverse-root'?[['root','x − 1 ≥ 0',x=>x>=1],['denominator','x − 1 ≠ 0',x=>x!==1]]:[['denominator','x − 1 ≠ 0',x=>x!==1]];
const formula04=s=>({'combined':'√(x + 1)/(x − 2)','inverse-root':'1/√(x − 1)',hole:'(x² − 1)/(x − 1)','range-finite':'x²','range-interval':'x²'})[s.mode];
const isRange=s=>s.mode.startsWith('range-');
function reduce04(s,a){
 if(a.type==='preset'&&a.id==='mode'&&['combined','inverse-root','hole','range-finite','range-interval'].includes(a.value))return initial04(a.value);
 const n=clone(s);
 if(a.type==='action'){
  if(a.id==='simplify'&&s.mode==='hole')n.simplified=!s.simplified;
  else if(a.id==='connect'&&isRange(s)){n.connected=!n.connected;n.custom=true;}
  else return s;
  return changed(s,n);
 }
 if(!validDrag(a))return s;
 if(a.id==='probe'){n.probe=dragValue(a,-3,5,100,860,'x',.25);return changed(s,n);}
 if(isRange(s)){
  if(s.mode==='range-interval'&&['range-low','range-high'].includes(a.id)){
   const v=dragValue(a,0,5,365,75,'y',.25);if(a.id==='range-low')n.rangeLo=Math.min(v,s.rangeHi);else n.rangeHi=Math.max(v,s.rangeLo);n.custom=true;return changed(s,n);
  }
  const match=/^output-([0-4])$/.exec(a.id);
  if(match&&a.phase==='end'&&['range-set','range-tray'].includes(a.zone)){
   const y=Number(match[1]);n.selected=s.selected.filter(v=>v!==y);if(a.zone==='range-set')n.selected.push(y);n.selected.sort((a,b)=>a-b);n.custom=true;return changed(s,n);
  }
  return s;
 }
 const key=a.id?.replace(/^mask-/,''),valid=maskSpecs(s.mode).some(m=>m[0]===key);
 if(valid&&a.phase==='end'&&['common-axis','mask-tray'].includes(a.zone)){
  n.masks=s.masks.filter(m=>m!==key);if(a.zone==='common-axis')n.masks.push(key);n.custom=true;return changed(s,n);
 }
 return s;
}
const plot05=()=>plot({xmin:0,xmax:4,ymin:0,ymax:14,x:120,y:75,w:700,h:310});
function reduce05(s,a){
 if(a.type==='preset'&&a.id==='kind'&&['continuous','integer'].includes(a.value))return {...s,kind:a.value};
 if(a.type==='action'&&a.id==='connect')return {...s,connected:!s.connected,custom:true};
 if(!validDrag(a))return s;
 const n=clone(s);
 if(a.id==='probe'){n.probe=dragValue(a,0,4,120,820,'x',.25);return changed(s,n);}
 const m=/^point-([0-4])$/.exec(a.id);
 if(!m||a.x<120||a.x>820||a.y<75||a.y>385)return s;
 const p=plot05();n.points[Number(m[1])]=[snap(clamp(p.toX(a.x),0,4),.25),snap(clamp(p.toY(a.y),0,14),.5)];n.custom=true;return changed(s,n);
}
const bounds06=s=>s.model==='rental'?[0,4]:[-2,2];
function reduce06(s,a){
 if(a.type==='preset'&&a.id==='model'&&['rental','paper'].includes(a.value))return initial06(a.value);
 if(a.type==='preset'&&a.id==='arrangement'&&['source','gap','overlap','same'].includes(a.value)){
  const n=initial06(s.model);
  if(a.value==='gap'){n.firstClosed=false;n.secondClosed=false;}
  if(a.value==='same'){n.firstClosed=true;n.secondClosed=true;}
  if(a.value==='overlap'){n.firstEnd=s.model==='rental'?1.5:.5;n.secondClosed=true;}
  n.custom=a.value!=='source';return n;
 }
 const n=clone(s);
 if(a.type==='action'){
  if(a.id==='toggle-first')n.firstClosed=!s.firstClosed;else if(a.id==='toggle-second')n.secondClosed=!s.secondClosed;else return s;
  n.custom=true;return changed(s,n);
 }
 if(!validDrag(a))return s;
 const [lo,hi]=bounds06(s);
 if(a.id==='probe'){n.probe=dragValue(a,lo,hi,100,860,'x',.05);return changed(s,n);}
 if(a.id==='first-end'||a.id==='second-start'){
  n[a.id==='first-end'?'firstEnd':'secondStart']=dragValue(a,lo,hi,100,860,'x',.05);n.custom=true;return changed(s,n);
 }
 return s;
}
const reducers={'01':reduce01,'02':reduce02,'03':reduce03,'04':reduce04,'05':reduce05,'06':reduce06};
export function reduce(id,state,action){known(id);if(!action||typeof action!=='object'||action.type!=='paint'&&typeof action.id!=='string')return state;const safe=id==='01'?changed(state,mappingState(state)):state;return reducers[id](safe,action);}

function render01(s,l){
 let svg=text(140,65,'A = {1, 2, 3}','text-anchor="middle"')+text(760,65,`B = ${arrSet(s.outputs)}`,'text-anchor="middle"');
 const handles=[],zones=s.outputs.map(output=>({id:`output-${output}`,x:690,y:mappingY(s,output)-38,w:140,h:76,label:t(l,`Output ${output}`,`輸出 ${output}`)}));
 for(const input of [1,2,3]){
  const y=135+(input-1)*125;
  svg+=circle(140,y,30,C.paper,C.ink)+text(140,y+7,String(input),'text-anchor="middle"');
  handles.push({id:`new-${input}`,kind:'wire',x:190,y,label:t(l,`Add an arrow from input ${input}; drop at an output`,`由輸入 ${input} 加箭頭；放至輸出`),shortLabel:'+',nudge:{x:30,y:30}});
 }
 for(const output of s.outputs)svg+=rect(690,mappingY(s,output)-38,140,76)+text(760,mappingY(s,output)+7,String(output),'text-anchor="middle"');
 for(const [input,output] of s.links){
  const iy=135+(input-1)*125,oy=mappingY(s,output);
  svg+=line(180,iy,688,oy,C.muted,3)+line(688,oy,673,oy-8,C.muted,3)+line(688,oy,673,oy+8,C.muted,3);
  handles.push({id:`edge-${input}-${output}`,kind:'wire',x:560,y:iy+(oy-iy)*(380/508),label:t(l,`Reconnect or remove ${input} → ${output}`,`改接或刪除 ${input} → ${output}`),shortLabel:`${input}→${output}`,nudge:{x:30,y:30}});
 }
 svg+=rect(345,455,270,60)+text(480,492,t(l,'Drop an arrow to remove it','放入箭頭以刪除'),'text-anchor="middle"');
 zones.push({id:'remove',x:345,y:455,w:270,h:60,label:t(l,'Remove this arrow','刪除這條箭頭')});
 const range=distinct(s.links.map(p=>p[1]));
 return base(title('01',l),t(l,'Drag + to add an arrow. Drag an existing wire to reconnect it or put it in the removal box.','把 + 拖至輸出以加箭頭；拖動現有箭頭改接，或放進刪除框。'),svg,t(l,`A = {1, 2, 3}; B = ${arrSet(s.outputs)}; attained range = ${arrSet(range)}.`,`A = {1, 2, 3}；B = ${arrSet(s.outputs)}；實際值域 = ${arrSet(range)}。`),[t(l,'Input','輸入'),t(l,'Distinct outputs','不同輸出'),t(l,'Count','數目')],[1,2,3].map(x=>{const values=distinct(s.links.filter(p=>p[0]===x).map(p=>p[1]));return [String(x),arrSet(values),String(values.length)];}),handles,zones,[],[selection('pattern',t(l,'Fixed example','固定例子'),s.preset,[['source',t(l,'Source: 1 → 5, 2 → 5, 3 → 7','原例：1 → 5、2 → 5、3 → 7')],['missing',t(l,'Remove the arrow from 3','刪去 3 的箭頭')],['multiple',t(l,'Add 2 → 7','加入 2 → 7')],['constant',t(l,'All inputs → 8','全部輸入 → 8')]])],functionClaims(l),s.custom);
}
function render02(s,l){
 const ds=domains02(s),rule=s.model==='paper'?'x²':'x² + 1',other=s.model==='paper'?arrSet(ds[1]):'[−2, 2]';
 let svg=text(480,45,`f(x) = ${rule}`,'text-anchor="middle"');
 const zones=[{id:'finite',x:60,y:85,w:390,h:295,label:t(l,'Test in the first domain','在第一個定義域測試')},{id:'other',x:510,y:85,w:390,h:295,label:t(l,'Test in the second domain','在第二個定義域測試')},{id:'tray',x:50,y:420,w:860,h:100,label:t(l,'Return an input chip','放回輸入卡')}];
 svg+=rect(60,85,390,295)+rect(510,85,390,295)+text(255,120,arrSet(ds[0]),'text-anchor="middle"')+text(705,120,other,'text-anchor="middle"');
 const rows=[],handles=chips(s).map((x,i)=>{
  const board=s.placements[i],offset=Object.entries(s.placements).filter(([j,b])=>b===board&&Number(j)<i).length;
  const cx=board?(board==='finite'?160:610)+(offset%3)*95:100+i*(760/(chips(s).length-1));
  const cy=board?190+Math.floor(offset/3)*80:470;
  if(board){const valid=accepts02(s,board,x);rows.push([board==='finite'?arrSet(ds[0]):other,fmt(x),t(l,valid?'allowed':'rejected',valid?'允許':'拒絕'),fmt(value02(s,x)),valid?fmt(value02(s,x)):'—']);}
  return {id:`chip-${i}`,kind:'token',x:cx,y:cy,w:75,h:48,label:t(l,`Input ${fmt(x)}`,`輸入 ${fmt(x)}`),shortLabel:fmt(x)};
 });
 if(!rows.length)rows.push(['—','—','—','—','—']);
 return base(title('02',l),t(l,'Drop an input chip on either domain. Compare formula arithmetic with the output actually defined there.','把輸入卡放進其中一個定義域；比較公式計算值與該函數實際有定義的輸出。'),svg,t(l,`Same fixed rule ${rule}. First range: ${s.model==='paper'?'{0, 1}':'{1, 2, 5}'}. Second range: ${s.model==='paper'?'{0, 1}':'[1, 5]'}.`,`同一固定法則 ${rule}。第一個值域：${s.model==='paper'?'{0, 1}':'{1, 2, 5}'}；第二個值域：${s.model==='paper'?'{0, 1}':'[1, 5]'}。`),[t(l,'Domain','定義域'),'x',t(l,'Input','輸入'),t(l,'Formula calculation','公式計算'),t(l,'Function output','函數輸出')],rows,handles,zones,[],[selection('model',t(l,'Fixed pair','固定函數對'),s.model,[['projection',t(l,'Projection: x² + 1','投影：x² + 1')],['paper',t(l,'Paper: two x² functions','紙本：兩個 x² 函數')]])],[{value:'same',label:t(l,'They are the same function','它們是同一函數')},{value:'different',label:t(l,'They are different functions','它們是不同函數')}]);
}

function paintedMembership(s,x){
 if(s.integer&&!Number.isInteger(x))return false;
 if(x===s.left){if(s.rule==='interval'&&s.left===s.right)return s.leftClosed&&s.rightClosed;return s.leftClosed;}
 if(s.rule==='interval'&&x===s.right)return s.rightClosed;
 return s.regions[s.rule==='interval'?(x<s.left?0:x>s.right?2:1):x<s.left?0:1];
}
function paintedNotation(s){
 const pieces=[],bounds=s.rule==='interval'?[s.left,s.right]:[s.left];
 const add=(lo,hi,lc=false,rc=false)=>pieces.push({lo,hi,lc,rc});
 if(s.regions[0])add(-Infinity,bounds[0]);
 if(s.rule==='interval'&&s.regions[1]&&s.left<s.right)add(s.left,s.right);
 if(s.regions.at(-1))add(bounds.at(-1),Infinity);
 if(s.leftClosed&&(s.rule!=='interval'||s.left!==s.right||s.rightClosed))add(s.left,s.left,true,true);
 if(s.rule==='interval'&&s.rightClosed&&s.left!==s.right)add(s.right,s.right,true,true);
 pieces.sort((a,b)=>a.lo-b.lo||a.hi-b.hi);
 const merged=[];
 for(const piece of pieces){
  const last=merged.at(-1);
  if(last&&(piece.lo<last.hi||piece.lo===last.hi&&(last.rc||piece.lc))){
   if(piece.lo===last.lo)last.lc||=piece.lc;
   if(piece.hi>last.hi){last.hi=piece.hi;last.rc=piece.rc;}else if(piece.hi===last.hi)last.rc||=piece.rc;
  }else merged.push({...piece});
 }
 const boundary=v=>v===-Infinity?'−∞':v===Infinity?'∞':fmt(v);
 const segments=merged.map(p=>p.lo===p.hi?arrSet([p.lo]):`${p.lc?'[':'('}${boundary(p.lo)}, ${boundary(p.hi)}${p.rc?']':')'}`);
 const notation=segments.join(' ∪ ')||'∅';
 return s.integer?`${segments.length>1?`(${notation})`:notation} ∩ ℤ`:notation;
}
function render03(s,l){
 const ax=axis(275),b=s.rule==='interval'?[s.left,s.right]:[s.left],edges=[-2,...b,6],zones=[],handles=[];
 let svg=ax.svg+text(480,45,s.rule==='interval'?t(l,'Source target: [0, 4)','原例目標：[0, 4)'):s.rule==='reciprocal'?'1/(x − 2)':'√(x − 3)','text-anchor="middle"');
 for(let i=0;i<s.regions.length;i++){
  const a=ax.X(edges[i]),z=ax.X(edges[i+1]);
  if(s.regions[i]&&!s.integer)svg+=line(a,275,z,275,C.green,12);
  const zx=Math.max(65,a+8),zw=Math.max(25,z-a-16);
  zones.push({id:`paint-${i}`,x:zx,y:190,w:zw,h:62,label:t(l,`Toggle region ${i+1}`,`切換區域 ${i+1}`)});
  svg+=rect(zx,190,zw,62)+text(zx+zw/2,227,t(l,s.regions[i]?'painted':'paint',s.regions[i]?'已塗色':'塗色'),'text-anchor="middle" font-size="16"');
 }
 if(s.integer)for(let x=-2;x<=6;x++)if(paintedMembership(s,x))svg+=dot(ax.X(x),275,true);
 for(let i=0;i<b.length;i++){
  const closed=(i?s.rightClosed:s.leftClosed)&&(!s.integer||Number.isInteger(b[i]));svg+=dot(ax.X(b[i]),275,closed);
  handles.push(coordinateHandle(i?'right':'left',ax.X(b[i]),320,t(l,`${i?'Right':'Left'} endpoint ${fmt(b[i])}`,`${i?'右':'左'}端點 ${fmt(b[i])}`),fmt(b[i]),{x:23.75,y:0}));
 }
 handles.push({id:'paint',kind:'token',x:480,y:120,w:180,h:48,label:t(l,'Paint: drop on a region to toggle it','塗色：放至區域以切換'),shortLabel:t(l,'Paint / erase','塗色／擦除')});
 handles.push(coordinateHandle('probe',ax.X(s.probe),410,t(l,`Test input ${fmt(s.probe)}`,`測試輸入 ${fmt(s.probe)}`),'x',{x:23.75,y:0}));
 svg+=text(100,385,t(l,'Probe the painted set','測試已塗集合'))+line(ax.X(s.probe),265,ax.X(s.probe),400,C.amber,2,'stroke-dasharray="5 5"');
 const buttons=[{id:'toggle-left',label:t(l,`Left endpoint: ${included(l,s.leftClosed)} (toggle)`,`左端點：${included(l,s.leftClosed)}（切換）`)},...(s.rule==='interval'?[{id:'toggle-right',label:t(l,`Right endpoint: ${included(l,s.rightClosed)} (toggle)`,`右端點：${included(l,s.rightClosed)}（切換）`)}]:[]),{id:'toggle-integer',label:t(l,s.integer?'Inputs: integers (toggle)':'Inputs: real numbers (toggle)',s.integer?'輸入：整數（切換）':'輸入：實數（切換）')},...s.regions.map((_,i)=>({id:`region-${i}`,label:t(l,`Paint / erase region ${i+1}`,`塗色／擦除區域 ${i+1}`)}))];
 const originalValid=s.rule==='interval'?s.probe>=0&&s.probe<4:s.rule==='reciprocal'?s.probe!==2:s.probe>=3;
 return base(title('03',l),t(l,'Drag the boundary handles and paint regions; toggle endpoints, then test the boundary. Check against the fixed source target.','拖動邊界並塗色；切換端點後測試邊界，最後核對固定原例目標。'),svg,t(l,`Painted set: ${paintedNotation(s)}. Infinity is a direction and always uses an open bracket.`,`已塗集合：${paintedNotation(s)}。無窮大表示方向，必須用圓括號。`),['x',t(l,'In painted set','屬於已塗集合'),t(l,'Allowed by source target','原例目標允許')],[[fmt(s.probe),t(l,paintedMembership(s,s.probe)?'yes':'no',paintedMembership(s,s.probe)?'是':'否'),t(l,originalValid?'yes':'no',originalValid?'是':'否')]],handles,zones,buttons,[selection('rule',t(l,'Fixed source target','固定原例目標'),s.rule,[['interval','[0, 4)'],['reciprocal','1/(x − 2)'],['sqrt','√(x − 3)']])],[],s.custom);
}

function rangeResult(s){return functionValue('square',s.probe,s.mode==='range-finite'?'finite-short':'range-interval');}
function renderRange04(s,l){
 const p=plot({xmin:-3,xmax:5,ymin:0,ymax:5,x:85,y:75,w:550,h:290}),finite=s.mode==='range-finite',r=rangeResult(s);
 let svg=p.svg+text(360,45,`x²; x ∈ ${finite?'{−2, −1, 0, 1}':'[−2, 1]'}`,'text-anchor="middle"');
 if(finite)for(const x of [-2,-1,0,1])svg+=dot(p.X(x),p.Y(x*x),true);
 else svg+=graph(p,x=>x*x,-2,1)+dot(p.X(-2),p.Y(4),true)+dot(p.X(1),p.Y(1),true);
 if(r.valid)svg+=dot(p.X(s.probe),p.Y(r.value),true,C.amber);
 const handles=[coordinateHandle('probe',100+(s.probe+3)/8*760,435,t(l,`Test input ${fmt(s.probe)}`,`測試輸入 ${fmt(s.probe)}`),'x',{x:23.75,y:0})],zones=[];
 svg+=axis(435,-3,5).svg;
 if(finite){
  svg+=rect(680,80,170,300)+text(765,65,t(l,'Learner range','學生所選值域'),'text-anchor="middle" font-size="16"');
  if(s.connected&&s.selected.length>1)svg+=line(765,112+Math.min(...s.selected)*57,765,112+Math.max(...s.selected)*57,C.muted,5);
  zones.push({id:'range-set',x:680,y:80,w:170,h:300,label:t(l,'Include this output','包括此輸出')},{id:'range-tray',x:860,y:80,w:90,h:300,label:t(l,'Remove this output','移除此輸出')});
  for(let y=0;y<=4;y++)handles.push({id:`output-${y}`,kind:'token',x:s.selected.includes(y)?765:900,y:112+y*57,w:65,h:42,label:t(l,`Output ${y}`,`輸出 ${y}`),shortLabel:String(y)});
 }else{
  svg+=line(800,75,800,365,C.muted,3)+text(800,52,'y','text-anchor="middle"');
  for(let y=0;y<=5;y++)svg+=text(835,372-y*58,String(y),'font-size="16"');
  if(s.connected)svg+=line(800,365-s.rangeLo*58,800,365-s.rangeHi*58,C.green,12);
  svg+=dot(800,365-s.rangeLo*58,true)+dot(800,365-s.rangeHi*58,true);
  handles.push(coordinateHandle('range-low',800,365-s.rangeLo*58,t(l,`Lower output ${fmt(s.rangeLo)}`,`輸出下界 ${fmt(s.rangeLo)}`),'a',{x:0,y:14.5}),coordinateHandle('range-high',800,365-s.rangeHi*58,t(l,`Upper output ${fmt(s.rangeHi)}`,`輸出上界 ${fmt(s.rangeHi)}`),'b',{x:0,y:14.5}));
 }
 const selectionText=finite?arrSet(s.selected):`${s.connected?'[':'{'}${fmt(s.rangeLo)}, ${fmt(s.rangeHi)}${s.connected?']':'}'}`;
 return {svg,summary:t(l,`Learner output set: ${selectionText}${finite&&s.connected?' with joining segments':''}. x = ${fmt(s.probe)}; output = ${r.valid?fmt(r.value):'—'}.`,`學生所選輸出集合：${selectionText}${finite&&s.connected?'，並連線':''}。x = ${fmt(s.probe)}；輸出 = ${r.valid?fmt(r.value):'—'}。`),handles,zones,headers:['x',t(l,'Source input membership','原例輸入是否允許'),t(l,'Source output','原例輸出')],rows:[[fmt(s.probe),t(l,r.valid?'allowed':'rejected',r.valid?'允許':'拒絕'),r.valid?fmt(r.value):'—']],buttons:[{id:'connect',label:t(l,s.connected?'Joining outputs: on (toggle)':'Joining outputs: off (toggle)',s.connected?'連接輸出：開啟（切換）':'連接輸出：關閉（切換）')}]};
}
function renderRestrictions04(s,l){
 const specs=maskSpecs(s.mode),ax=axis(340,-3,5),handles=[],zones=[{id:'common-axis',x:75,y:160,w:810,h:215,label:t(l,'Overlay the restriction masks','疊加限制遮罩')},{id:'mask-tray',x:70,y:65,w:820,h:80,label:t(l,'Return a restriction mask','放回限制遮罩')}];
 let svg=text(480,40,formula04(s),'text-anchor="middle"')+rect(75,160,810,215)+ax.svg;
 const pass=x=>specs.every(([id,,f])=>!s.masks.includes(id)||f(x));
 // Each visible open segment has exact gate decisions; no sampling is used for checks.
 const cuts=distinct([-3,5,...(s.mode==='combined'?[-1,2]:[1])]);
 for(let i=1;i<cuts.length;i++)if(pass((cuts[i-1]+cuts[i])/2))svg+=line(ax.X(cuts[i-1]),340,ax.X(cuts[i]),340,C.green,10);
 for(const x of cuts.slice(1,-1))svg+=dot(ax.X(x),340,pass(x));
 specs.forEach(([id,label],i)=>{
  const placed=s.masks.includes(id),cy=placed?205+i*65:105;
  handles.push({id:`mask-${id}`,kind:'card',x:placed?480:280+i*370,y:cy,w:240,h:48,label:t(l,`Restriction mask: ${label}`,`限制遮罩：${label}`),shortLabel:label});
 });
 handles.push(coordinateHandle('probe',ax.X(s.probe),430,t(l,`Test input ${fmt(s.probe)}`,`測試輸入 ${fmt(s.probe)}`),'x',{x:23.75,y:0}));
 svg+=line(ax.X(s.probe),330,ax.X(s.probe),415,C.amber,2,'stroke-dasharray="5 5"');
 const r=functionValue(s.mode,s.probe),assembled=pass(s.probe);
 let summary=t(l,`Overlaid masks: ${s.masks.length}/${specs.length}. Current intersection ${assembled?'accepts':'rejects'} x = ${fmt(s.probe)}.`,`已疊加遮罩：${s.masks.length}/${specs.length}。目前交集${assembled?'接受':'拒絕'} x = ${fmt(s.probe)}。`);
 if(s.simplified)summary+=t(l,' Simplified formula: x + 1, retaining original exclusion x ≠ 1.',' 化簡式：x + 1，保留原限制 x ≠ 1。');
 const headers=['x',t(l,'Current mask intersection','目前遮罩交集'),t(l,'Original function output','原函數輸出')],row=[fmt(s.probe),t(l,assembled?'accepted':'rejected',assembled?'接受':'拒絕'),r.valid?fmt(r.value):t(l,'undefined','未定義')];
 if(s.mode==='hole'){headers.push(t(l,'x + 1 arithmetic','x + 1 計算值'));row.push(fmt(s.probe+1));svg+=text(480,495,t(l,`Original hole: (1, 2), x ≠ 1${s.simplified?'; simplified expression x + 1':''}`,`原式空缺：(1, 2)，x ≠ 1${s.simplified?'；化簡式 x + 1':''}`),'text-anchor="middle"')+line(700,290,830,185,C.muted,3)+dot(765,237.5,false,C.ink)+text(785,260,'(1, 2)','font-size="16"');}
 return {svg,summary,headers,rows:[row],handles,zones,buttons:s.mode==='hole'?[{id:'simplify',label:t(l,s.simplified?'Hide simplified arithmetic':'Compare the simplified expression',s.simplified?'隱藏化簡計算':'比較化簡式')}]:[]};
}
function render04(s,l){
 const r=isRange(s)?renderRange04(s,l):renderRestrictions04(s,l);
 return base(title('04',l),isRange(s)?t(l,'Probe the fixed input domain. Construct its output set with cards or the two output endpoints; decide whether to join.','測試固定定義域；用卡片或兩個輸出端點構造輸出集合，再決定是否連接。'):t(l,'Drop every required restriction mask onto the common axis. Test inputs against the intersection and original formula.','把每個必要限制遮罩放至共同數線，測試輸入是否通過交集及原公式。'),r.svg,r.summary,r.headers,r.rows,r.handles,r.zones,r.buttons,[selection('mode',t(l,'Fixed task','固定任務'),s.mode,[['combined','√(x + 1)/(x − 2)'],['inverse-root','1/√(x − 1)'],['hole','(x² − 1)/(x − 1)'],['range-finite',t(l,'Range: x² on {−2, −1, 0, 1}','值域：x²，定義域 {−2, −1, 0, 1}')],['range-interval',t(l,'Range: x² on [−2, 1]','值域：x²，定義域 [−2, 1]')]])],[],s.custom);
}

function render05(s,l){
 const p=plot05();let svg=p.svg+text(470,40,t(l,'Fixed source model: y = 2x + 4','固定原例模型：y = 2x + 4'),'text-anchor="middle"');
 const placed=s.points.filter(Boolean).slice().sort((a,b)=>a[0]-b[0]);
 if(s.connected&&placed.length>1)svg+=polyline(placed.map(([x,y])=>[p.X(x),p.Y(y)]),C.muted);
 const handles=s.points.map((point,i)=>({id:`point-${i}`,kind:'point',x:point?p.X(point[0]):p.X(i),y:point?p.Y(point[1]):385,label:t(l,`${point?'Place':'Unplaced handle for'} table row ${i+1}: (${i}, ${2*i+4})`,`${point?'放置':'尚未放置的'}表格第 ${i+1} 行：(${i}, ${2*i+4})`),shortLabel:point?String(i+1):`${i+1}?`,nudge:{x:43.75,y:310/28}}));
 handles.push(coordinateHandle('probe',p.X(s.probe),435,t(l,`Test input ${fmt(s.probe)}`,`測試輸入 ${fmt(s.probe)}`),'x',{x:43.75,y:0}));
 svg+=line(p.X(s.probe),75,p.X(s.probe),415,C.amber,2,'stroke-dasharray="5 5"')+text(470,525,t(l,'Numbered ? handles are unplaced; move them from the bottom edge.','編號 ? 控點尚未放置，請由圖像下邊緣移入。'),'text-anchor="middle" font-size="16"');
 const valid=s.kind==='continuous'||Number.isInteger(s.probe),rows=[0,1,2,3,4].map(i=>[String(i),String(2*i+4),s.points[i]?`(${s.points[i].map(fmt).join(', ')})`:t(l,'unplaced','未放置')]);
 rows.push([t(l,`Probe x = ${fmt(s.probe)}`,`測試 x = ${fmt(s.probe)}`),valid?fmt(2*s.probe+4):t(l,'undefined','未定義'),t(l,valid?'source input allowed':'source input rejected',valid?'原例允許輸入':'原例拒絕輸入')]);
 return base(title('05',l),t(l,'Read the fixed table and drag each numbered point to its coordinates. Choose whether connecting adds permitted inputs.','閱讀固定表格，把各編號點拖到相應座標；判斷連線加入的輸入是否允許。'),svg,t(l,`Fixed domain: ${s.kind==='continuous'?'[0, 4]':'{0, 1, 2, 3, 4}'}. Learner placements: ${placed.length}/5. Joining: ${s.connected?'on':'off'}. The straight-line model is given.`,`固定定義域：${s.kind==='continuous'?'[0, 4]':'{0, 1, 2, 3, 4}'}。學生已放置：${placed.length}/5。連線：${s.connected?'開啟':'關閉'}。題目已給定直線模型。`),[t(l,'Fixed input','固定輸入'),t(l,'Fixed output','固定輸出'),t(l,'Learner placement','學生放置')],rows,handles,[],[{id:'connect',label:t(l,s.connected?'Join the points: on (toggle)':'Join the points: off (toggle)',s.connected?'連接各點：開啟（切換）':'連接各點：關閉（切換）')}],[selection('kind',t(l,'Fixed source context','固定原例情境'),s.kind,[['continuous',t(l,'Continuous rental hours','連續租借時數')],['integer',t(l,'Whole-number item counts','整數件數')]])],[],s.custom);
}

const domain06=(s,x)=>s.model!=='rental'||x>0&&x<=4;
const values06=(s,x)=>{
 if(!domain06(s,x))return [];
 const values=[];
 if(x<s.firstEnd||x===s.firstEnd&&s.firstClosed)values.push(s.model==='rental'?6:x+2);
 if(x>s.secondStart||x===s.secondStart&&s.secondClosed)values.push(s.model==='rental'?6+4*(x-1):x*x);
 return values;
};
const outputs06=(s,x)=>distinct(values06(s,x));
function classify06(s){
 const a=s.firstEnd,b=s.secondStart;
 if(a<b)return {ok:false,kind:'gap',x:(a+b)/2};
 if(a===b&&domain06(s,a)&&!s.firstClosed&&!s.secondClosed)return {ok:false,kind:'gap',x:a};
 if(a>b){let x=(a+b)/2;if(outputs06(s,x).length===1)x=b+(a-b)/3;return {ok:false,kind:'conflict',x};}
 if(a===b&&domain06(s,a)&&s.firstClosed&&s.secondClosed&&outputs06(s,a).length>1)return {ok:false,kind:'conflict',x:a};
 return {ok:true,kind:'function',x:a};
}
function render06(s,l){
 const [lo,hi]=bounds06(s),p=plot({xmin:lo,xmax:hi,ymin:0,ymax:s.model==='rental'?20:6,x:100,y:85,w:760,h:280}),f=x=>s.model==='rental'?6:x+2,g=x=>s.model==='rental'?6+4*(x-1):x*x;
 let svg=p.svg+text(480,40,s.model==='rental'?'6 ; 6 + 4(t − 1)':'x + 2 ; x²','text-anchor="middle"');
 if(s.firstEnd>lo)svg+=graph(p,f,lo,s.firstEnd,C.green);
 if(s.secondStart<hi)svg+=graph(p,g,s.secondStart,hi,C.amber);
 svg+=dot(p.X(s.firstEnd),p.Y(f(s.firstEnd)),s.firstClosed&&domain06(s,s.firstEnd),C.green)+dot(p.X(s.secondStart),p.Y(g(s.secondStart)),s.secondClosed&&domain06(s,s.secondStart),C.amber);
 if(s.model==='rental')svg+=dot(p.X(0),p.Y(6),false,C.green)+dot(p.X(4),p.Y(18),s.secondStart<4||s.secondStart===4&&s.secondClosed,C.amber);
 // Draw the graph union last so an excluded marker cannot erase an included value.
 for(const x of distinct([s.firstEnd,s.secondStart]))for(const y of outputs06(s,x))svg+=dot(p.X(x),p.Y(y),true,C.ink,6);
 for(const y of outputs06(s,s.probe))svg+=dot(p.X(s.probe),p.Y(y),true,C.amber,9);
 const ax=axis(435,lo,hi);svg+=ax.svg+text(100,405,t(l,'Move each boundary independently','獨立移動兩個邊界'),'font-size="17"');
 const handles=[coordinateHandle('first-end',p.X(s.firstEnd),380,t(l,`First branch ends at ${fmt(s.firstEnd)}`,`第一段終於 ${fmt(s.firstEnd)}`),'A',{x:760/(hi-lo)*.05,y:0}),coordinateHandle('second-start',p.X(s.secondStart),485,t(l,`Second branch begins at ${fmt(s.secondStart)}`,`第二段始於 ${fmt(s.secondStart)}`),'B',{x:760/(hi-lo)*.05,y:0}),coordinateHandle('probe',p.X(s.probe),435,t(l,`Test input ${fmt(s.probe)}`,`測試輸入 ${fmt(s.probe)}`),'x',{x:760/(hi-lo)*.05,y:0})];
 const vals=values06(s,s.probe),outs=distinct(vals),range=s.model==='rental'?'0 < t ≤ 4':'ℝ';
 const windowNote=s.model==='rental'?'':t(l,' Visible graph window: [−2, 2]; the domain remains ℝ.',' 圖像視窗：[−2, 2]；定義域仍為 ℝ。');
 return base(title('06',l),t(l,'Drag A and B independently. Toggle their endpoint inclusion and probe gaps or overlaps in the fixed total domain.','獨立拖動 A、B；切換端點是否包括，再於固定總定義域測試漏配或重疊。'),svg,t(l,`Fixed total domain: ${range}. First branch ${s.model==='rental'?'0 < t':'x'} ${s.firstClosed?'≤':'<'} ${fmt(s.firstEnd)}; second branch ${s.model==='rental'?'t':'x'} ${s.secondClosed?'≥':'>'} ${fmt(s.secondStart)}${s.model==='rental'?', t ≤ 4':''}. At ${fmt(s.probe)}: ${vals.length} applicable branch(es), ${outs.length} distinct output(s).`,`固定總定義域：${range}。第一段 ${s.model==='rental'?'0 < t':'x'} ${s.firstClosed?'≤':'<'} ${fmt(s.firstEnd)}；第二段 ${s.model==='rental'?'t':'x'} ${s.secondClosed?'≥':'>'} ${fmt(s.secondStart)}${s.model==='rental'?'，t ≤ 4':''}。輸入 ${fmt(s.probe)}：${vals.length} 段適用，${outs.length} 個不同輸出。`)+windowNote,[s.model==='rental'?'t':'x',t(l,'Applicable branch values','適用分段值'),t(l,'Distinct outputs','不同輸出'),t(l,'Count','數目')],distinct([s.probe,s.firstEnd,s.secondStart]).map(x=>[fmt(x),values06(s,x).map(fmt).join(', ')||'—',arrSet(outputs06(s,x)),String(outputs06(s,x).length)]),handles,[],[{id:'toggle-first',label:t(l,`First endpoint: ${included(l,s.firstClosed)} (toggle)`,`第一段端點：${included(l,s.firstClosed)}（切換）`)},{id:'toggle-second',label:t(l,`Second endpoint: ${included(l,s.secondClosed)} (toggle)`,`第二段端點：${included(l,s.secondClosed)}（切換）`)}],[selection('model',t(l,'Fixed source formulas','固定原例公式'),s.model,[['rental',t(l,'Rental: 6 and 6 + 4(t − 1)','租借：6 與 6 + 4(t − 1)')],['paper',t(l,'Paper h(x): x + 2 and x²','紙本 h(x)：x + 2 與 x²')]]),selection('arrangement',t(l,'Starting arrangement','起始安排'),s.custom?'custom':'source',[['source',t(l,'Source endpoints','原例端點')],['gap',t(l,'Both endpoints open','兩端均開')],['same',t(l,'Both endpoints closed','兩端均閉')],['overlap',t(l,'Overlap interval','重疊區間')],...(s.custom?[['custom',t(l,'Current student design','目前學生設計')]]:[])])],functionClaims(l),s.custom);
}
const renderers={'01':render01,'02':render02,'03':render03,'04':render04,'05':render05,'06':render06};
export function render(id,state,locale='en'){known(id);return renderers[id](id==='01'?mappingState(state):state,locale);}

function check01(s,claim,l){
 const counts=[1,2,3].map(x=>({x,values:distinct(s.links.filter(p=>p[0]===x).map(p=>p[1]))})),isFunction=counts.every(p=>p.values.length===1),good=claim===(isFunction?'function':'not-function');
 return result(l,good,[t(l,`Distinct output counts: ${counts.map(p=>`${p.x}: ${p.values.length}`).join('; ')}.`,`不同輸出數目：${counts.map(p=>`${p.x}：${p.values.length}`).join('；')}。`),t(l,isFunction?'Every allowed input has exactly one output. Shared outputs are permitted.':`Input(s) ${counts.filter(p=>p.values.length!==1).map(p=>p.x).join(', ')} need exactly one distinct output.`,isFunction?'每個允許輸入恰有一個輸出；不同輸入可共用輸出。':`輸入 ${counts.filter(p=>p.values.length!==1).map(p=>p.x).join('、')} 須恰有一個不同輸出。`)]);
}
function check02(s,claim,l){
 const witness=s.model==='paper'?-1:.5;
 return result(l,claim==='different',[t(l,`The formulas match, but input ${fmt(witness)} is allowed in ${s.model==='paper'?'the first domain only':'the second domain only'}.`,`公式相同，但輸入 ${fmt(witness)} 只在${s.model==='paper'?'第一個':'第二個'}定義域內。`),t(l,'A function includes its domain. Matching formulas, or even matching ranges, do not make these functions equal.','函數包括其定義域；公式相同，甚至值域相同，也不足以令它們成為同一函數。')]);
}
function check03(s,l){
 const ok=!s.integer&&(s.rule==='interval'?s.left===0&&s.right===4&&!s.regions[0]&&s.regions[1]&&!s.regions[2]&&s.leftClosed&&!s.rightClosed:s.rule==='reciprocal'?s.left===2&&s.regions[0]&&s.regions[1]&&!s.leftClosed:s.left===3&&!s.regions[0]&&s.regions[1]&&s.leftClosed);
 const target=s.rule==='interval'?'[0, 4)':s.rule==='reciprocal'?'(−∞, 2) ∪ (2, ∞)':'[3, ∞)';
 return result(l,ok,[t(l,`Fixed source target: ${target}; your painted set: ${paintedNotation(s)}.`,`固定原例目標：${target}；你的已塗集合：${paintedNotation(s)}。`),t(l,s.rule==='reciprocal'?'The denominator excludes exactly 2; both real sides remain.':s.rule==='sqrt'?'The radicand is nonnegative exactly when x ≥ 3; zero is permitted.':'The left endpoint 0 is included, the right endpoint 4 excluded, with every real input between them.',s.rule==='reciprocal'?'分母只排除 2，兩邊實數仍允許。':s.rule==='sqrt'?'被開方數非負恰等於 x ≥ 3；可以等於零。':'包括左端點 0，不包括右端點 4，並包括兩者之間每個實數。')]);
}
function check04(s,l){
 if(isRange(s)){
  const finite=s.mode==='range-finite',ok=finite?s.selected.length===3&&[0,1,4].every(y=>s.selected.includes(y))&&!s.connected:s.rangeLo===0&&s.rangeHi===4&&s.connected;
  return result(l,ok,[t(l,finite?'The four fixed inputs attain exactly {0, 1, 4}; do not join the gaps.':'The complete range is [0, 4]. Minimum 0 is attained at x = 0; maximum 4 at x = −2.',finite?'四個固定輸入恰好取得 {0, 1, 4}；不可連接空隙。':'完整值域為 [0, 4]。x = 0 取得最小值 0，x = −2 取得最大值 4。'),t(l,finite?'Repeated outputs are listed once.':'For every y in [0, 4], x = −√y lies in [−2, 0], so every stated output is attained.',finite?'重複輸出只列一次。':'對每個 y ∈ [0, 4]，x = −√y 屬於 [−2, 0]，所以每個所列輸出均可取得。')]);
 }
 const ok=maskSpecs(s.mode).every(([id])=>s.masks.includes(id)),domain=s.mode==='combined'?'[−1, 2) ∪ (2, ∞)':s.mode==='inverse-root'?'(1, ∞)':'(−∞, 1) ∪ (1, ∞)';
 return result(l,ok,[t(l,`All original restrictions must hold together. The domain is ${domain}.`,`原式所有限制須同時成立；定義域為 ${domain}。`),t(l,s.mode==='hole'?'Cancellation is valid only for x ≠ 1. The original input 1 remains undefined, even though x + 1 gives 2.':s.mode==='inverse-root'?'The square root must exist and the denominator must be nonzero: x − 1 > 0.':'Use intersection: x ≥ −1 and x ≠ 2. The value −1 is included.',s.mode==='hole'?'只有 x ≠ 1 才可約去因子；原輸入 1 仍未定義，即使 x + 1 得 2。':s.mode==='inverse-root'?'平方根須有定義，分母亦不可為零，因此 x − 1 > 0。':'取交集：x ≥ −1 且 x ≠ 2；包括 −1。')]);
}
function check05(s,l){
 const errors=s.points.flatMap((p,i)=>!p||p[0]!==i||p[1]!==2*i+4?[String(i+1)]:[]),join=s.connected===(s.kind==='continuous'),ok=!errors.length&&join;
 return result(l,ok,[errors.length?t(l,`Revisit table row(s) ${errors.join(', ')}. The fixed table has (0,4), (1,6), (2,8), (3,10), (4,12).`,`請重新放置表格第 ${errors.join('、')} 行；固定數對為 (0,4)、(1,6)、(2,8)、(3,10)、(4,12)。`):t(l,'All five learner placements match the fixed table.','五個學生放置點均符合固定表格。'),t(l,s.kind==='continuous'?'Join the points: the given linear model includes every real input in [0, 4], including (2.5, 9).':'Keep separate dots: 2.5 is not a whole-number input, so (2.5, 9) is not on this graph.',s.kind==='continuous'?'應連接各點：已給定直線模型，包括 [0, 4] 內每個實數輸入及 (2.5, 9)。':'保留離散點：2.5 不是整數輸入，所以 (2.5, 9) 不在此圖像。'),t(l,'The straight-line assumption is given here; a short table alone does not prove that an unknown rule is linear.','此處已給定直線假設；少量表格資料不足以證明未知法則必為直線。')]);
}
function check06(s,claim,l){
 const c=classify06(s),ok=claim===(c.ok?'function':'not-function');
 return result(l,ok,[t(l,c.ok?'Every input in the fixed total domain is covered and has exactly one distinct output.':c.kind==='gap'?`At ${fmt(c.x)}, no branch applies although the input belongs to the fixed total domain.`:`At ${fmt(c.x)}, overlapping branches give distinct outputs ${arrSet(outputs06(s,c.x))}.`,c.ok?'固定總定義域內每個輸入都有覆蓋，並恰有一個不同輸出。':c.kind==='gap'?`輸入 ${fmt(c.x)} 屬於固定總定義域，但沒有分段適用。`:`輸入 ${fmt(c.x)} 的重疊分段得到不同輸出 ${arrSet(outputs06(s,c.x))}。`),t(l,'Count distinct values, not applicable formulas. Equal overlap can define a function; a jump alone does not violate uniqueness.','須數不同數值，不是適用公式數目；重疊同值可以是函數，單憑跳躍並不違反唯一性。')]);
}
export function check(id,state,claim,locale='en'){
 known(id);
 if(id==='01')return check01(mappingState(state),claim,locale);
 if(id==='02')return check02(state,claim,locale);
 if(id==='03')return check03(state,locale);
 if(id==='04')return check04(state,locale);
 if(id==='05')return check05(state,locale);
 return check06(state,claim,locale);
}
