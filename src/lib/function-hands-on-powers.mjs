/** Direct manipulation of the fixed Chapter 3 power, substitution and decision models. */
import {C,t,fmt,clamp,snap,text,line,circle,rect,plot,dragValue} from './function-hands-on-common.mjs';
import {functionValue,printingCosts,printingBudget} from './function-worksheet-models.mjs';

export const ids=['11','12','13','14'];
const RULES=['linear','square','cube','sqrt','reciprocal'];
const FORM={linear:'x',square:'x²',cube:'x³',sqrt:'√x',reciprocal:'1/x'};
const CURVES=[['A','square'],['B','reciprocal'],['C','linear'],['D','sqrt'],['E','cube']];
const PICK=['first','second','tie'];
const isNum=value=>typeof value==='number'&&Number.isFinite(value);
function lesson(id){const key=String(id);if(!ids.includes(key))throw new RangeError('Unknown power/comparison lesson.');return key;}
export function create(id){
  switch(lesson(id)){
    case '11':return {matches:{A:null,B:null,C:null,D:null,E:null},x:-1,other:2};
    case '12':return {mode:'powers',x:.5,other:1.5,placements:{first:null,second:null}};
    case '13':return {rule:'discount',price:100,u:3,discountOrder:[null,null],substitutionOrder:[null,null]};
    case '14':return {context:'printing',objective:'cost',n:10,t:20,budget:200,quote:null};
  }
}
function stateOf(id,raw){
  const s=create(id),r=raw&&typeof raw==='object'?raw:{};
  const bounded=(key,lo,hi,step=0)=>{if(isNum(r[key]))s[key]=step?clamp(snap(r[key],step),lo,hi):clamp(r[key],lo,hi);};
  if(id==='11'){
    bounded('x',-3,3,.25);bounded('other',-3,3,.25);
    const used=new Set();
    for(const [card]of CURVES){const rule=r.matches?.[card];if(RULES.includes(rule)&&!used.has(rule)){s.matches[card]=rule;used.add(rule);}}
  }else if(id==='12'){
    if(['powers','same'].includes(r.mode))s.mode=r.mode;
    bounded('x',.1,3,.05);bounded('other',.1,3,.05);
    for(const key of ['first','second'])if(['less','equal','greater'].includes(r.placements?.[key]))s.placements[key]=r.placements[key];
  }else if(id==='13'){
    if(['discount','substitution'].includes(r.rule))s.rule=r.rule;
    bounded('price',0,300,5);bounded('u',-5,11,.25);
    for(const [key,cards]of [['discountOrder',['discount','subtract']],['substitutionOrder',['subtract-one','halve']]]){
      const used=new Set();for(let i=0;i<2;i++){const card=r[key]?.[i];if(cards.includes(card)&&!used.has(card)){s[key][i]=card;used.add(card);}}
    }
  }else{
    if(['printing','rental'].includes(r.context))s.context=r.context;
    if(['cost','budget'].includes(r.objective))s.objective=r.objective;
    bounded('n',1,80,1);bounded('t',0,40,.5);bounded('budget',0,330,5);
    if(PICK.includes(r.quote))s.quote=r.quote;
  }
  return s;
}
const unchanged=(raw,next)=>JSON.stringify(raw)===JSON.stringify(next)?raw:next;
function setNumber(s,key,a,lo,hi,p0,p1,axis='x',step=0){const value=dragValue(a,lo,hi,p0,p1,axis,step);if(value!==null)s[key]=value;}
function orderDrop(order,card,zone){
  const from=order.indexOf(card),to=zone==='slot-1'?0:zone==='slot-2'?1:-1;
  if(zone==='bank'){if(from>=0)order[from]=null;return;}
  if(to<0||from===to)return;
  const old=order[to];order[to]=card;if(from>=0)order[from]=old;
}
export function reduce(id,raw,action){
  id=lesson(id);const s=stateOf(id,raw),a=action&&typeof action==='object'?action:{};
  if(a.type==='preset'){
    if(id==='12'&&a.id==='mode'&&['powers','same'].includes(a.value)){s.mode=a.value;s.placements={first:null,second:null};}
    if(id==='13'&&a.id==='rule'&&['discount','substitution'].includes(a.value))s.rule=a.value;
    if(id==='14'&&a.id==='context'&&['printing','rental'].includes(a.value)){s.context=a.value;s.quote=null;}
    if(id==='14'&&a.id==='objective'&&['cost','budget'].includes(a.value)){s.objective=a.value;s.quote=null;}
  }
  if(a.type==='action'){
    if(a.id==='clear'){
      if(id==='11')s.matches={A:null,B:null,C:null,D:null,E:null};
      if(id==='12')s.placements={first:null,second:null};
      if(id==='13')s[s.rule==='discount'?'discountOrder':'substitutionOrder']=[null,null];
      if(id==='14')s.quote=null;
    }
    if(id==='13'&&a.id==='reverse')s[s.rule==='discount'?'discountOrder':'substitutionOrder'].reverse();
  }
  if(a.type==='drag'&&['move','end'].includes(a.phase)&&isNum(a.x)&&isNum(a.y)){
    if(id==='11'){
      if(['x','other'].includes(a.id))setNumber(s,a.id,a,-3,3,80,880,'x',.25);
      if(a.phase==='end'&&CURVES.some(([card])=>a.id===`curve-${card}`)){
        const card=a.id.slice(6),rule=typeof a.zone==='string'&&a.zone.startsWith('formula-')?a.zone.slice(8):null;
        if(a.zone==='bank')s.matches[card]=null;
        else if(RULES.includes(rule)){for(const [other]of CURVES)if(s.matches[other]===rule)s.matches[other]=null;s.matches[card]=rule;}
      }
    }else if(id==='12'){
      if(a.id==='x'||a.id==='other'&&s.mode==='same')setNumber(s,a.id,a,.1,3,80,880,'x',.05);
      if(a.phase==='end'&&['value-first','value-second'].includes(a.id)){
        const key=a.id.slice(6);if(a.zone==='bank')s.placements[key]=null;
        if(['less','equal','greater'].includes(a.zone))s.placements[key]=a.zone;
      }
    }else if(id==='13'){
      if(a.id==='input')setNumber(s,s.rule==='discount'?'price':'u',a,s.rule==='discount'?0:-5,s.rule==='discount'?300:11,80,880,'x',s.rule==='discount'?5:.25);
      const cards=s.rule==='discount'?['discount','subtract']:['subtract-one','halve'];
      if(a.phase==='end'&&cards.includes(a.id))orderDrop(s[s.rule==='discount'?'discountOrder':'substitutionOrder'],a.id,a.zone);
    }else{
      if(a.id==='quantity'&&s.context==='printing')setNumber(s,'n',a,1,80,80,880,'x',1);
      if(a.id==='quantity'&&s.context==='rental')setNumber(s,'t',a,0,40,80,880,'x',.5);
      if(a.id==='budget'&&s.context==='printing')setNumber(s,'budget',a,0,330,350,70,'y',5);
      if(a.id==='quote'&&a.phase==='end'){
        if(a.zone==='bank')s.quote=null;
        for(const key of PICK)if(a.zone===`quote-${key}`)s.quote=key;
      }
    }
  }
  return unchanged(raw,s);
}
const center=(x,y,label,attrs='')=>text(x,y,label,`text-anchor="middle" ${attrs}`);
function path(p,fn,segments,color=C.green,width=3){
  return segments.map(([lo,hi])=>{let d='',drawing=false;for(let i=0;i<=140;i++){const x=lo+(hi-lo)*i/140,y=fn(x);if(!Number.isFinite(y)||p.Y(y)<p.top||p.Y(y)>p.bottom){drawing=false;continue;}d+=`${drawing?'L':'M'}${fmt(p.X(x))},${fmt(p.Y(y))} `;drawing=true;}return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"/>`;}).join('');
}
function board(options){const p=plot(options);return {...p,top:options.y,bottom:options.y+options.h};}
function slider(id,value,lo,hi,y,label,step=1){return {id,kind:'slider',x:80+(value-lo)/(hi-lo)*800,y,label,shortLabel:id==='other'?'b':id==='quantity'?'n':'x',value,min:lo,max:hi,step,nudge:{x:800/(hi-lo)*step,y:0}};}
function rail(y,lo,hi,label,marks=[]){let svg=line(80,y,880,y,C.muted,3)+text(80,y-18,label,'font-size="17"');for(const value of [lo,...marks,hi]){const x=80+(value-lo)/(hi-lo)*800;svg+=line(x,y-7,x,y+7,C.muted)+center(x,y+26,fmt(value),'font-size="16"');}return svg;}
function zone(z){return rect(z.x,z.y,z.w,z.h,C.paper,C.muted)+center(z.x+z.w/2,z.y+24,z.label,'font-size="18"');}
function base(title,task){return {title,task,svg:'',summary:'',headers:[],rows:[],handles:[],zones:[],buttons:[],choices:[],claims:[],custom:false};}
const out=(rule,x,l)=>{const r=functionValue(rule,x);return r.valid?fmt(r.value):t(l,'undefined','未定義');};
function renderPowers(s,l){
  const r=base(t(l,'Match five power curves','配對五種冪函數圖像'),t(l,'Move each curve card to a formula. Drag either probe to compare all five outputs.','把各圖像卡移到相應公式，再拖動兩個輸入探針比較五種輸出。'));
  for(let i=0;i<CURVES.length;i++){
    const [card,rule]=CURVES[i],x=20+i*184;
    r.svg+=rect(x,30,176,200)+center(x+88,53,t(l,`Curve ${card}`,`圖像 ${card}`),'font-size="18"');
    const p=board({xmin:-3,xmax:3,ymin:-5,ymax:5,x:x+18,y:70,w:140,h:140});
    const segments=rule==='sqrt'?[[0,3]]:rule==='reciprocal'?[[-3,-.2],[.2,3]]:[[-3,3]];
    r.svg+=line(p.X(-3),p.Y(0),p.X(3),p.Y(0),C.line)+line(p.X(0),p.Y(-5),p.X(0),p.Y(5),C.line);
    r.svg+=path(p,x=>functionValue(rule,x).value??NaN,segments,C.ink,2.5);
    for(const [value,color]of [[s.x,C.green],[s.other,C.amber]]){const v=functionValue(rule,value);if(v.valid&&v.value>=-5&&v.value<=5)r.svg+=circle(p.X(value),p.Y(v.value),5,color,color);}
    r.svg+=center(x+88,225,t(l,'x: −3 to 3; y: −5 to 5','x：−3 至 3；y：−5 至 5'),'font-size="11"');
  }
  r.zones=RULES.map((rule,i)=>({id:`formula-${rule}`,x:20+i*184,y:292,w:176,h:82,label:`y = ${FORM[rule]}`}));
  r.zones.push({id:'bank',x:20,y:236,w:912,h:48,label:t(l,'Unmatched curve cards','尚未配對的圖像卡')});
  r.svg+=r.zones.map(zone).join('');
  r.handles=CURVES.map(([card],i)=>{const assigned=r.zones.find(z=>z.id===`formula-${s.matches[card]}`);return {id:`curve-${card}`,kind:'card',x:assigned?assigned.x+88:108+i*184,y:assigned?346:260,w:154,h:32,label:t(l,`Curve ${card}`,`圖像 ${card}`)};});
  r.svg+=rail(426,-3,3,t(l,'Probe a','探針 a'),[-1,0,1])+rail(494,-3,3,t(l,'Probe b','探針 b'),[-1,0,1]);
  r.handles.push({...slider('x',s.x,-3,3,426,t(l,`Probe a = ${fmt(s.x)}`,`探針 a＝${fmt(s.x)}`),.25),shortLabel:'a'},slider('other',s.other,-3,3,494,t(l,`Probe b = ${fmt(s.other)}`,`探針 b＝${fmt(s.other)}`),.25));
  r.summary=t(l,`Probe a = ${fmt(s.x)}; b = ${fmt(s.other)}. ${Object.values(s.matches).filter(Boolean).length}/5 cards placed. The window shows only part of each graph.`,`探針 a＝${fmt(s.x)}；b＝${fmt(s.other)}。已放置 ${Object.values(s.matches).filter(Boolean).length}/5 張卡；圖窗只顯示各圖像的一部分。`);
  r.headers=[t(l,'Curve','圖像'),`a = ${fmt(s.x)}`,`b = ${fmt(s.other)}`,t(l,'Student match','學生配對')];
  r.rows=CURVES.map(([card,rule])=>[card,out(rule,s.x,l),out(rule,s.other,l),s.matches[card]?`y = ${FORM[s.matches[card]]}`:t(l,'unplaced','未放置')]);
  r.buttons=[{id:'clear',label:t(l,'Return all cards','收回所有卡')}];return r;
}
function comparisonValues(s){return s.mode==='powers'?[s.x*s.x,s.x**3]:[s.x*s.x,s.other*s.other];}
function renderComparison(s,l){
  const r=base(t(l,'Place the comparison','放置大小比較'),t(l,'Drag positive inputs, then place both value cards in the smaller, equal or larger area.','拖動正輸入，再把兩張數值卡放到較小、相等或較大區域。'));
  const p=board({xmin:0,xmax:3,ymin:0,ymax:28,x:80,y:45,w:800,h:230});
  r.svg=p.svg+path(p,x=>x*x,[[0,3]],C.green);
  if(s.mode==='powers')r.svg+=path(p,x=>x**3,[[0,3]],C.amber);
  const values=comparisonValues(s),labels=s.mode==='powers'?['x²','x³']:['a²','b²'];
  r.svg+=circle(p.X(s.x),p.Y(values[0]),7,C.green,C.green)+circle(p.X(s.mode==='powers'?s.x:s.other),p.Y(values[1]),7,C.amber,C.amber)+text(100,65,'x²',`style="fill:${C.green}" font-size="17"`);
  if(s.mode==='powers')r.svg+=text(150,65,'x³',`style="fill:${C.amber}" font-size="17"`);
  r.svg+=rail(326,.1,3,t(l,s.mode==='powers'?'Positive base x':'Positive input a',s.mode==='powers'?'正底數 x':'正輸入 a'),[1]);
  r.handles=[slider('x',s.x,.1,3,326,t(l,`Positive input = ${fmt(s.x)}`,`正輸入＝${fmt(s.x)}`),.05)];
  if(s.mode==='same'){r.svg+=rail(386,.1,3,t(l,'Positive input b','正輸入 b'),[1]);r.handles.push(slider('other',s.other,.1,3,386,t(l,`Positive input b = ${fmt(s.other)}`,`正輸入 b＝${fmt(s.other)}`),.05));}
  r.zones=[{id:'bank',x:20,y:423,w:350,h:107,label:t(l,'Value cards','數值卡')},...['less','equal','greater'].map((id,i)=>({id,x:402+i*180,y:423,w:170,h:107,label:t(l,['Smaller','Equal','Larger'][i],['較小','相等','較大'][i])}))];
  r.svg+=r.zones.map(zone).join('');
  for(let i=0;i<2;i++){const key=i?'second':'first',z=r.zones.find(z=>z.id===s.placements[key]);const shared=i&&s.placements.first===s.placements.second; r.handles.push({id:`value-${key}`,kind:'card',x:z?z.x+85:108+i*172,y:z?472+(shared?35:0):480,w:150,h:32,label:`${labels[i]} = ${fmt(values[i])}`});}
  r.summary=t(l,`Positive inputs only. ${labels[0]} = ${fmt(values[0])}; ${labels[1]} = ${fmt(values[1])}; difference = ${fmt(values[0]-values[1])}.`,`只使用正輸入。${labels[0]}＝${fmt(values[0])}；${labels[1]}＝${fmt(values[1])}；差＝${fmt(values[0]-values[1])}。`);
  r.headers=[s.mode==='powers'?'x':'a',s.mode==='powers'?'x²':'a²',s.mode==='powers'?'x³':'b',s.mode==='powers'?'x² − x³':'b²'];
  r.rows=[s.mode==='powers'?[fmt(s.x),fmt(values[0]),fmt(values[1]),fmt(values[0]-values[1])]:[fmt(s.x),fmt(values[0]),fmt(s.other),fmt(values[1])]];
  r.choices=[{id:'mode',label:t(l,'Comparison task','比較任務'),value:s.mode,options:[{value:'powers',label:t(l,'x² and x³ at one positive base','同一正底數的 x² 與 x³')},{value:'same',label:t(l,'Two positive inputs of x²','x² 的兩個正輸入')}]}];
  r.buttons=[{id:'clear',label:t(l,'Return value cards','收回數值卡')}];return r;
}
const applyCard=(card,x)=>card==='discount'?.9*x:card==='subtract'?x-20:card==='subtract-one'?x-1:card==='halve'?x/2:x;
function stages(order,x){if(order.some(card=>card===null))return null;const middle=applyCard(order[0],x);return {middle,final:applyCard(order[1],middle)};}
function renderSubstitution(s,l){
  const discount=s.rule==='discount',order=discount?s.discountOrder:s.substitutionOrder,input=discount?s.price:s.u,cards=discount?['discount','subtract']:['subtract-one','halve'];
  const labels=discount?{'discount':'× 0.9',subtract:'− 20'}:{'subtract-one':'− 1',halve:'÷ 2'};
  const result=stages(order,input),reverse=stages([...order].reverse(),input),eligible=s.price>=100;
  const r=base(t(l,discount?'Arrange the discount cards':'Undo the affine input',discount?'排列優惠卡':'還原一次式輸入'),t(l,discount?'Place both operation cards in order to obtain the lowest eligible price. Drag the original price.':'Starting with the whole input u = 2x + 1, arrange operations that recover x, then read 6x + 5.',discount?'排列兩張運算卡，取得適用優惠中的最低價格；拖動原價作測試。':'由完整輸入 u＝2x＋1 開始，排列運算還原 x，再讀取 6x＋5。'));
  r.svg=text(35,35,discount?t(l,'Eligibility is checked once: original price ≥ 100','只按原價一次過檢查資格：原價 ≥ 100'):t(l,'Given f(2x + 1) = 6x + 5 for every real x','已知對所有實數 x，f(2x＋1)＝6x＋5'),'font-size="21"');
  r.svg+=rail(94,discount?0:-5,discount?300:11,discount?t(l,'Original price','原價'):t(l,'Whole input u','完整輸入 u'),discount?[100]:[0,3]);
  r.handles=[{...slider('input',input,discount?0:-5,discount?300:11,94,t(l,`${discount?'Original price':'Whole input u'} = ${fmt(input)}`,`${discount?'原價':'完整輸入 u'}＝${fmt(input)}`),discount?5:.25),shortLabel:discount?'x':'u'}];
  r.zones=[{id:'slot-1',x:280,y:166,w:200,h:104,label:t(l,'First operation','第一步')},{id:'slot-2',x:564,y:166,w:200,h:104,label:t(l,'Second operation','第二步')},{id:'bank',x:136,y:392,w:688,h:74,label:t(l,'Operation cards','運算卡')}];
  r.svg+=r.zones.map(zone).join('')+text(52,227,`${discount?'x':'u'} = ${fmt(input)}`)+line(199,218,275,218,C.muted,3)+line(484,218,560,218,C.muted,3)+line(768,218,873,218,C.muted,3);
  for(let i=0;i<2;i++){const index=order.indexOf(cards[i]);r.handles.push({id:cards[i],kind:'card',x:index<0?320+i*320:r.zones[index].x+100,y:index<0?440:229,w:160,h:38,label:labels[cards[i]]});}
  if(result){
    r.svg+=center(380,308,t(l,`Intermediate: ${fmt(result.middle)}`,`中間值：${fmt(result.middle)}`),'font-size="19"');
    r.svg+=center(664,308,discount?t(l,`Final price: ${eligible?fmt(result.final):'ineligible'}`,`最後價格：${eligible?fmt(result.final):'不適用'}`):`x = ${fmt(result.final)}`,'font-size="19"');
    if(!discount)r.svg+=center(480,358,`2x + 1 = ${fmt(2*result.final+1)}; 6x + 5 = ${fmt(6*result.final+5)}`,'font-size="22"');
  }
  r.summary=discount?t(l,`Original price = ${fmt(s.price)}. ${eligible?'Original-price eligibility met.':'Original price is below 100; neither sequence is eligible.'}`,`原價＝${fmt(s.price)}。${eligible?'符合原價資格。':'原價少於 100，兩種次序均不適用。'}`):t(l,`u = ${fmt(s.u)}. Your cards propose how to obtain x from the whole input 2x + 1.`,`u＝${fmt(s.u)}。你排列的卡片表示由完整輸入 2x＋1 求 x 的構想。`);
  r.headers=discount?[t(l,'Order','次序'),t(l,'Intermediate amount','中間金額'),t(l,'Final price','最後價格')]:['u',t(l,'Constructed x','所構造 x'),'2x + 1','6x + 5'];
  r.rows=discount?[[t(l,'Student order','學生次序'),result?fmt(result.middle):'—',result&&eligible?fmt(result.final):eligible?'—':t(l,'ineligible','不適用')],[t(l,'Reverse order','相反次序'),reverse?fmt(reverse.middle):'—',reverse&&eligible?fmt(reverse.final):eligible?'—':t(l,'ineligible','不適用')]]:[[fmt(s.u),result?fmt(result.final):'—',result?fmt(2*result.final+1):'—',result?fmt(6*result.final+5):'—']];
  r.choices=[{id:'rule',label:t(l,'Task','任務'),value:s.rule,options:[{value:'discount',label:t(l,'Discount order','優惠次序')},{value:'substitution',label:t(l,'Recover f from f(2x + 1)','由 f(2x＋1) 還原 f')}]}];
  r.buttons=[{id:'reverse',label:t(l,'Reverse the cards','交換卡片次序')},{id:'clear',label:t(l,'Return operation cards','收回運算卡')}];return r;
}
function renderDecision(s,l){
  const rental=s.context==='rental',budgetTask=!rental&&s.objective==='budget',valid=!rental||s.t>0;
  const value=rental?s.t:s.n,costs=rental?{P:16*s.t,Q:120+10*s.t}:printingCosts(s.n),limits=printingBudget(s.budget),names=rental?['A','B']:['P','Q'];
  const r=base(t(l,'Choose a quote','選擇報價'),t(l,budgetTask?'Drag the budget line, then place your quote token with the plan allowing the most whole booklets.':'Drag the quantity or time, then place your quote token with the lowest cost or equal cost.',budgetTask?'拖動預算線，再把報價標記放到可印最多整數冊數的方案。':'拖動冊數或時間，再把報價標記放到最低費用或同價區域。'));
  const p=board({xmin:0,xmax:rental?40:80,ymin:0,ymax:rental?680:330,x:80,y:70,w:800,h:280});
  r.svg=text(35,34,rental?'A(t) = 16t; B(t) = 120 + 10t':'P(n) = 20 + 3n; Q(n) = 5n (n ≤ 20), 2n + 60 (n > 20)','font-size="20"')+p.svg;
  if(rental){r.svg+=path(p,t=>16*t,[[0,40]],C.green)+path(p,t=>120+10*t,[[0,40]],C.amber)+circle(p.X(0),p.Y(0),6,C.paper,C.green)+circle(p.X(0),p.Y(120),6,C.paper,C.amber)+circle(p.X(40),p.Y(640),5,C.green,C.green)+circle(p.X(40),p.Y(520),5,C.amber,C.amber);}
  else for(let n=1;n<=80;n++){const c=printingCosts(n);r.svg+=circle(p.X(n),p.Y(c.P),2.5,C.green,C.green)+circle(p.X(n),p.Y(c.Q),2.5,C.amber,C.amber);}
  if(valid)r.svg+=line(p.X(value),70,p.X(value),350,C.muted,1,'stroke-dasharray="4 5"')+circle(p.X(value),p.Y(costs.P),7,C.green,C.green)+circle(p.X(value),p.Y(costs.Q),7,C.amber,C.amber);
  r.svg+=text(108,91,names[0],`style="fill:${C.green}" font-size="18"`)+text(148,91,names[1],`style="fill:${C.amber}" font-size="18"`);
  r.handles=[{...slider('quantity',value,rental?0:1,rental?40:80,405,t(l,rental?`Rental time t = ${fmt(value)}`:`Booklets n = ${value}`,rental?`租借時數 t＝${fmt(value)}`:`冊數 n＝${value}`),rental?.5:1),shortLabel:rental?'t':'n'}];
  r.svg+=rail(405,rental?0:1,rental?40:80,rental?t(l,'Rental time: 0 < t ≤ 40','租借時數：0 < t ≤ 40'):t(l,'Booklets: integers 1 to 80','冊數：1 至 80 的整數'),rental?[20]:[10,20,40]);
  if(!rental){r.svg+=line(80,p.Y(s.budget),880,p.Y(s.budget),C.muted,2,'stroke-dasharray="7 5"')+text(590,p.Y(s.budget)-10,t(l,`Budget = ${s.budget}`,`預算＝${s.budget}`),'font-size="17"');r.handles.push({id:'budget',kind:'slider',x:900,y:p.Y(s.budget),label:t(l,`Budget = ${s.budget}; move vertically`,`預算＝${s.budget}；上下移動`),shortLabel:'$',value:s.budget,min:0,max:330,step:5,nudge:{x:0,y:280/330*5}});}
  r.zones=[{id:'bank',x:20,y:452,w:240,h:78,label:t(l,'Quote token','報價標記')},...PICK.map((key,i)=>({id:`quote-${key}`,x:280+i*220,y:452,w:210,h:78,label:key==='tie'?t(l,budgetTask?'Equal capacity':'Equal cost',budgetTask?'冊數相同':'同價'):t(l,`Plan ${names[i]}`,`${names[i]} 方案`)}))];
  r.svg+=r.zones.map(zone).join('');const chosen=r.zones.find(z=>z.id===`quote-${s.quote}`)||r.zones[0];
  r.handles.push({id:'quote',kind:'token',x:chosen.x+chosen.w/2,y:503,w:160,h:32,label:t(l,'My choice','我的選擇')});
  const observation=valid?`${names[0]} = ${fmt(costs.P)}; ${names[1]} = ${fmt(costs.Q)}; ${names[0]} − ${names[1]} = ${fmt(costs.P-costs.Q)}`:t(l,'t = 0 is outside the stated domain; both costs are undefined.','t＝0 不屬於所述定義域；兩個費用均未定義。');
  r.summary=(rental?t(l,'Time is continuous on 0 < t ≤ 40. ','時間在 0 < t ≤ 40 連續變化。 '):t(l,`Integer quantities only. Budget ${s.budget}: P permits ${limits.P} booklets; Q permits ${limits.Q}. `,`只限整數冊數。預算 ${s.budget}：P 可印 ${limits.P} 冊；Q 可印 ${limits.Q} 冊。 `))+observation;
  r.headers=[rental?'t':'n',names[0],names[1],`${names[0]} − ${names[1]}`];
  r.rows=rental?[[fmt(s.t),valid?fmt(costs.P):'—',valid?fmt(costs.Q):'—',valid?fmt(costs.P-costs.Q):'—']]:[...new Set([s.n,10,20,40])].map(n=>{const c=printingCosts(n);return [String(n),String(c.P),String(c.Q),String(c.P-c.Q)];});
  r.choices=[{id:'context',label:t(l,'Context','情境'),value:s.context,options:[{value:'printing',label:t(l,'Printing plans','印刷方案')},{value:'rental',label:t(l,'Rental plans','租借方案')}]}];
  if(!rental)r.choices.push({id:'objective',label:t(l,'Decision question','決策問題'),value:s.objective,options:[{value:'cost',label:t(l,'Lowest cost at this quantity','這個冊數的最低費用')},{value:'budget',label:t(l,'Most booklets within this budget','這個預算可印的最多冊數')}]});
  r.buttons=[{id:'clear',label:t(l,'Return quote token','收回報價標記')}];return r;
}
export function render(id,raw,locale='en'){id=lesson(id);const s=stateOf(id,raw);return id==='11'?renderPowers(s,locale):id==='12'?renderComparison(s,locale):id==='13'?renderSubstitution(s,locale):renderDecision(s,locale);}
function feedback(status,l,en,zh,lines){return {status,title:t(l,en,zh),lines};}
export function check(id,raw,claim,locale='en'){
  id=lesson(id);const s=stateOf(id,raw),l=locale;
  if(id==='11'){
    const missing=CURVES.filter(([card])=>!s.matches[card]),wrong=CURVES.filter(([card,rule])=>s.matches[card]&&s.matches[card]!==rule);
    if(missing.length||wrong.length)return feedback('revise',l,'Review the curve matches','再檢查圖像配對',[t(l,`${missing.length} cards unplaced; ${wrong.length} placed matches need revision. Test −1, 0 and 2, including undefined outputs.`,`有 ${missing.length} 張卡未放置；${wrong.length} 個已放置配對須修改。測試 −1、0、2，並留意未定義輸出。`),t(l,'The square curve has two equal outputs at ±x; the reciprocal excludes 0; the square root allows only nonnegative inputs.','平方圖像在 ±x 輸出相同；倒數排除 0；平方根只允許非負輸入。')]);
    return feedback('success',l,'All five curves matched','五種圖像全部配對',[CURVES.map(([card,rule])=>`${card}: y = ${FORM[rule]}`).join('; '),t(l,'x and x³ are odd and increasing on ℝ. x² is even; it falls up to 0 and rises after 0. √x has domain and range [0, ∞). 1/x excludes 0 and decreases on each side separately.','x 與 x³ 在 ℝ 為奇函數且遞增；x² 為偶函數，先遞減至 0 再遞增；√x 的定義域和值域均為 [0,∞)；1/x 排除 0，並在零的兩側各自遞減。'),t(l,'The plotted window does not bound the full range. This worksheet uses the coefficient-one convention y = xᵃ.','圖窗不限制完整值域；本學習單採用係數為一的 y＝xᵃ 約定。')]);
  }
  if(id==='12'){
    const [a,b]=comparisonValues(s),expected=a===b?['equal','equal']:a<b?['less','greater']:['greater','less'];
    if(!s.placements.first||!s.placements.second)return feedback('notice',l,'Place both value cards','先放置兩張數值卡',[t(l,'Use smaller and larger for unequal values, or put both in equal.','不同值分別放於較小及較大；相同值則兩張均放於相等。')]);
    const correct=s.placements.first===expected[0]&&s.placements.second===expected[1];
    const lines=[t(l,`The current values are ${fmt(a)} ${a===b?'=':a<b?'<':'>'} ${fmt(b)}.`,`目前數值為 ${fmt(a)} ${a===b?'＝':a<b?'＜':'＞'} ${fmt(b)}。`),s.mode==='powers'?t(l,'For every positive x, x² − x³ = x²(1 − x): positive below 1, zero at 1, negative above 1. A sample alone does not prove all three regions.','對每個正 x，x²−x³＝x²(1−x)：小於 1 時為正，等於 1 時為零，大於 1 時為負；單一樣本不足以證明三個範圍。'):t(l,'On positive inputs, b² − a² = (b − a)(b + a), and b + a > 0; this sign argument proves that squaring preserves their order.','對正輸入，b²−a²＝(b−a)(b＋a)，而 b＋a>0；這個符號論證證明平方保持大小次序。')];
    return feedback(correct?'success':'revise',l,correct?'Current ordering matches':'Revise the value placement',correct?'目前排列相符':'修改數值卡的位置',lines);
  }
  if(id==='13'){
    const discount=s.rule==='discount',order=discount?s.discountOrder:s.substitutionOrder;
    if(order.some(card=>!card))return feedback('notice',l,'Place both operation cards','先放置兩張運算卡',[t(l,'Read the two operation slots from left to right.','由左至右讀取兩個運算位置。')]);
    if(discount&&s.price<100)return feedback('notice',l,'Original price is ineligible','原價不符合資格',[t(l,'Both sequences require the original price to be at least 100. Eligibility is checked once on the original price, not on the intermediate amount.','兩種次序都要求原價至少 100；只按原價檢查一次資格，中間金額不用重驗。')]);
    const correct=order[0]===(discount?'discount':'subtract-one');
    return feedback(correct?'success':'revise',l,correct?(discount?'This order gives the lower eligible price':'The whole input has been recovered'):'Review the operation order',correct?(discount?'這個次序的適用價格較低':'已還原完整輸入'):'再檢查運算次序',discount?[t(l,'10% off then subtract 20 gives 0.9x − 20. The reverse gives 0.9x − 18, exactly 2 more for every eligible original x ≥ 100.','先九折再減 20 得 0.9x−20；相反次序得 0.9x−18，對每個適用原價 x≥100 均多 2 元。'),t(l,'At original price 100, an intermediate amount below 100 does not remove eligibility.','原價 100 時，中間金額少於 100 仍不影響資格。')]:[t(l,'Subtract 1, then divide by 2: x = (u − 1)/2. Hence 6x + 5 = 3u + 2 and f(u) = 3u + 2.','先減 1 再除以 2：x＝(u−1)/2。因此 6x＋5＝3u＋2，得 f(u)＝3u＋2。'),t(l,'This reverses the affine input 2x + 1. Since x ranges over ℝ, u covers ℝ and the recovered rule has the full real domain.','這是還原一次式輸入 2x＋1；由於 x 遍及 ℝ，u 也遍及 ℝ，因此還原規則的定義域為全體實數。')]);
  }
  const rental=s.context==='rental',budgetTask=!rental&&s.objective==='budget';
  if(rental&&s.t===0)return feedback('notice',l,'Choose an allowed rental time','選擇允許的租借時數',[t(l,'The rental domain is 0 < t ≤ 40. t = 0 has no quoted cost in this model.','租借定義域為 0 < t ≤ 40；本模型沒有 t＝0 的報價。')]);
  if(!s.quote)return feedback('notice',l,'Place your quote token','先放置報價標記',[t(l,'Choose one plan, or the equal option when both results match.','選擇一個方案；兩者結果相同時選相等選項。')]);
  const c=rental?{P:16*s.t,Q:120+10*s.t}:printingCosts(s.n),b=printingBudget(s.budget),left=budgetTask?b.P:c.P,right=budgetTask?b.Q:c.Q;
  const expected=left===right?'tie':(budgetTask?left>right:left<right)?'first':'second',correct=s.quote===expected;
  const lines=budgetTask?[t(l,`Budget ${s.budget}: P allows at most ${b.P} and Q at most ${b.Q} whole booklets in 1…80.`,`預算 ${s.budget}：在 1…80 冊內，P 最多 ${b.P} 冊，Q 最多 ${b.Q} 冊。`),t(l,'If the maximum is below 80, verify that one more whole booklet exceeds the budget. Fractional booklets are outside this domain. A maximum of 0 means no allowed quantity is affordable.','若最多冊數少於 80，須確認再多一整冊便超出預算。小數冊數不屬於定義域。最大值為 0 表示沒有可負擔的允許冊數。')]:[t(l,`${rental?'A':'P'} = ${fmt(c.P)}, ${rental?'B':'Q'} = ${fmt(c.Q)}.`,`${rental?'A':'P'}＝${fmt(c.P)}，${rental?'B':'Q'}＝${fmt(c.Q)}。`)];
  lines.push(rental?t(l,'A − B = 6t − 120. Equal cost at t = 20; A costs less for 0 < t < 20 and B for 20 < t ≤ 40.','A−B＝6t−120；t＝20 同價；0<t<20 時 A 較便宜，20<t≤40 時 B 較便宜。'):t(l,'P − Q = 20 − 2n for n ≤ 20 and n − 40 for n > 20. Both branch-valid ties are n = 10 and n = 40; Q costs less below 10 and above 40, while P costs less between them.','n≤20 時 P−Q＝20−2n；n>20 時 P−Q＝n−40。兩個段內有效同價點為 n＝10 及 n＝40；小於 10 或大於 40 時 Q 較便宜，兩者之間 P 較便宜。'));
  return feedback(correct?'success':'revise',l,correct?'Your quote matches this decision':'Review the quote choice',correct?'報價符合這個決策':'再檢查報價選擇',lines);
}
