/** Fixed, deterministic classroom models. No expressions from user input are executed. */
const pair = (en, zh) => ({ en, 'zh-Hant': zh });
const lang = locale => locale === 'zh-Hant' || locale === 'zh' ? 'zh-Hant' : 'en';
const choose = (locale, en, zh) => lang(locale) === 'en' ? en : zh;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = value => Number.isFinite(value) ? String(Number(value.toFixed(4))) : '—';
const select = (key, en, zh, value, options) => ({key,type:'select',label:pair(en,zh),value,options:options.map(([value,en,zh])=>({value,label:pair(en,zh)}))});
const number = (key,en,zh,value,min,max,step=1) => ({key,type:'number',label:pair(en,zh),value,min,max,step});
const range = (key,en,zh,value,min,max,step=1) => ({...number(key,en,zh,value,min,max,step),type:'range'});
const MODES = {
  '01': () => [select('pattern','Arrow pattern','對應方式','bijective',[
    ['bijective','One to one','一對一'],['many','Many to one','多對一'],['missing','Missing arrow','漏配'],['multiple','Two different outputs','一個輸入、兩個不同輸出']])],
  '02': () => [select('domain','Allowed inputs','允許的輸入','finite',[
    ['finite','Finite set {−2, −1, 0, 1, 2}','有限集合 {−2, −1, 0, 1, 2}'],['continuous','Interval [−2, 2]','區間 [−2, 2]']]),number('x','Test input x','測試輸入 x',3,-4,4,.5)],
  '03': () => [select('rule','Restriction','限制','interval',[
    ['interval','Interval from 0 to 4','0 至 4 的區間'],['reciprocal','1/(x − 2)','1/(x − 2)'],['sqrt','√(x − 3)','√(x − 3)']]),select('left','Left endpoint','左端點','closed',[
    ['closed','Include 0','包括 0'],['open','Exclude 0','不包括 0']]),select('right','Right endpoint','右端點','open',[
    ['closed','Include 4','包括 4'],['open','Exclude 4','不包括 4']]),select('kind','Input kind','輸入種類','continuous',[
    ['continuous','Real numbers','實數'],['integer','Integers only','只限整數']]),number('x','Test input x','測試輸入 x',2,-2,6,.5)],
  '04': () => [select('rule','Model','模型','combined',[
    ['combined','√(x + 1)/(x − 2)','√(x + 1)/(x − 2)'],['inverse-root','1/√(x − 1)','1/√(x − 1)'],['hole','(x² − 1)/(x − 1)','(x² − 1)/(x − 1)'],['range-finite','x² on {−2, −1, 0, 1}','x²，輸入為 {−2, −1, 0, 1}'],['range-interval','x² on [−2, 1]','x²，輸入為 [−2, 1]']]),number('x','Test input x','測試輸入 x',2,-3,5,.5)],
  '05': () => [select('kind','Context','情境','continuous',[
    ['continuous','Rental time: real numbers','租借時數：實數'],['integer','Number of items: integers','物件數目：整數']]),number('x','Test input x','測試輸入 x',2.5,0,4,.5)],
  '06': () => [select('mode','Endpoint arrangement','分段端點安排','correct',[
    ['correct','Correct division at 1','在 1 正確分段'],['gap','Both pieces exclude 1','兩段都不包括 1'],['conflict','Overlap with different outputs','重疊處輸出不同'],['redundant','Both pieces include 1 with the same output','兩段包括 1，輸出相同']]),number('x','Rental time t','租借時間 t',1,0,4,.25)],
  '07': () => [select('rule','Machines','函數機器','linear',[
    ['linear','Double and add 3','乘 2 與加 3'],['square','Square and add 3','平方與加 3'],['sqrt','Subtract 1, then square root','減 1，再開平方']]),number('x','Starting input x','原來輸入 x',2,-3,5,.5)],
  '08': () => [select('rule','Graph','圖像','water',[
    ['water','Water level, 0 ≤ t ≤ 6','水位，0 ≤ t ≤ 6'],['line','y = x, from 0 to 2','y = x，由 0 至 2'],['quadratic','(x − 2)² + 1 on [0, 5]','(x − 2)² + 1，定義域 [0, 5]']]),select('left','Left endpoint for y = x','y = x 的左端點','open',[
    ['open','Exclude 0','不包括 0'],['closed','Include 0','包括 0']]),select('right','Right endpoint for y = x','y = x 的右端點','open',[
    ['open','Exclude 2','不包括 2'],['closed','Include 2','包括 2']]),range('x','Graph cursor','圖像游標',2,0,6,.25)],
  '09': () => [select('rule','Function and interval','函數與區間','reciprocal-positive',[
    ['reciprocal-positive','1/x on (0, ∞)','1/x，區間 (0, ∞)'],['reciprocal-negative','1/x on (−∞, 0)','1/x，區間 (−∞, 0)'],['reciprocal-whole','1/x on its whole domain','1/x，整個定義域'],['quadratic','2x² + 1 on (0, ∞)','2x² + 1，區間 (0, ∞)']]),number('x1','First input x₁','第一個輸入 x₁',1,-4,4,.25),number('x2','Second input x₂','第二個輸入 x₂',2,-4,4,.25)],
  '10': () => [select('rule','Function','函數','square',[
    ['square','x²','x²'],['cube','x³','x³'],['shift','x + 1','x + 1'],['reciprocal','1/x','1/x'],['zero','0','0']]),select('domain','Domain','定義域','symmetric',[
    ['symmetric','Symmetric domain','關於 0 對稱的定義域'],['restricted','Restricted to [0, 3]','限制為 [0, 3]']]),range('x','Choose x','選擇 x',2,-3,3,.5)],
  '11': () => [select('rule','Power function','冪函數','square',[
    ['linear','x','x'],['square','x²','x²'],['cube','x³','x³'],['sqrt','√x','√x'],['reciprocal','1/x','1/x']]),number('x','Test input x','測試輸入 x',-1,-3,3,.25)],
  '12': () => [number('x','Positive base x','正底數 x',.5,.1,3,.1),select('mode','Comparison','比較','powers',[
    ['powers','Compare x² and x³','比較 x² 與 x³'],['same','Compare two inputs of x²','比較 x² 的兩個輸入']]),number('other','Second positive input','另一個正輸入',1.5,.1,3,.1)],
  '13': () => [select('rule','Task','任務','discount',[
    ['discount','10% off and subtract 20','九折與減 20'],['substitution','Given f(2x + 1) = 6x + 5','已知 f(2x + 1) = 6x + 5']]),number('x','Original price / input','原價／輸入',100,0,300,5)],
  '14': () => [select('context','Decision','決策','printing',[
    ['printing','Printing plans','印刷方案'],['rental','Rental plans','租借方案']]),number('n','Booklets n (integers)','冊數 n（整數）',10,1,80,1),number('t','Rental hours t','租借時數 t',20,0,40,.5),select('budget','Budget','預算','200',[
    ['200','200','200'],['160','160','160'],['240','240','240']])],
};

function idOf(id) {
  const match = String(id).match(/(?:^|:)(\d{1,2})$/);
  const key = match ? match[1].padStart(2,'0') : '';
  if (!MODES[key]) throw new RangeError('Unknown function lesson.');
  return key;
}
export function worksheetControls(lessonId) {
  const id=idOf(lessonId),controls=MODES[id]();
  const conditions={
    '03':{left:{key:'rule',values:['interval']},right:{key:'rule',values:['interval']},kind:{key:'rule',values:['interval']}},
    '08':{left:{key:'rule',values:['line']},right:{key:'rule',values:['line']}},
    '14':{n:{key:'context',values:['printing']},t:{key:'context',values:['rental']},budget:{key:'context',values:['printing']}},
  }[id]||{};
  return controls.map(control=>conditions[control.key]?{...control,when:conditions[control.key]}:control);
}
export function normalizeWorksheetState(lessonId, raw = {}) {
  const state = {},controls=worksheetControls(lessonId);
  for (const control of controls) {
    const input = raw && typeof raw === 'object' ? raw[control.key] : undefined;
    if (control.type === 'select') state[control.key] = control.options.some(o=>o.value===input) ? input : control.value;
    else {
      const parsed = (typeof input === 'number' || typeof input === 'string' && input.trim() !== '') ? Number(input) : NaN;
      const bounded = Number.isFinite(parsed) ? Math.max(control.min,Math.min(control.max,parsed)) : control.value;
      // Integer controls represent counts. Decimal controls allow typed values between slider ticks.
      state[control.key] = control.step === 1 ? Math.round(bounded) : bounded;
    }
  }
  // Hidden controls cannot retain restrictions from a previously selected scene.
  for(const control of controls)if(control.when&&!control.when.values.includes(state[control.when.key]))state[control.key]=control.value;
  return state;
}

/** Domain-aware evaluation: an algebraic formula alone never overrides a domain. */
export function functionValue(rule, x, domain = 'natural') {
  if (!Number.isFinite(x)) return {valid:false,value:null};
  let valid = true, value;
  if (domain === 'finite') valid = [-2,-1,0,1,2].includes(x);
  if (domain === 'finite-short') valid = [-2,-1,0,1].includes(x);
  if (domain === 'interval') valid = x >= -2 && x <= 2;
  if (domain === 'range-interval') valid = x >= -2 && x <= 1;
  if (domain === 'restricted') valid = x >= 0 && x <= 3;
  switch(rule) {
    case 'square-plus': value=x*x+1; break;
    case 'square': value=x*x; break;
    case 'cube': value=x*x*x; break;
    case 'sqrt': valid &&= x>=0; value=Math.sqrt(x); break;
    case 'reciprocal': valid &&= x!==0; value=1/x; break;
    case 'combined': valid &&= x>=-1 && x!==2; value=Math.sqrt(x+1)/(x-2); break;
    case 'inverse-root': valid &&= x>1; value=1/Math.sqrt(x-1); break;
    case 'hole': valid &&= x!==1; value=x+1; break;
    case 'shift': value=x+1; break;
    case 'zero': value=0; break;
    case 'linear': value=x; break;
    default: throw new RangeError('Unknown fixed function.');
  }
  return {valid:valid && Number.isFinite(value),value:valid && Number.isFinite(value) ? (Object.is(value,-0)?0:value) : null};
}
export function rentalPieceValues(t, mode = 'correct') {
  if (!Number.isFinite(t) || t<=0 || t>4) return [];
  const outputs=[];
  if (t<=1 || mode==='conflict' && t<=1.5) outputs.push(6);
  if (mode==='gap' && t===1) outputs.length=0;
  if (t>1 || mode==='redundant' && t===1) outputs.push(6+4*(t-1));
  return outputs;
}
export function printingCosts(n) {
  if (!Number.isInteger(n) || n<1 || n>80) return null;
  return {P:20+3*n,Q:n<=20 ? 5*n : 2*n+60};
}
export function printingBudget(budget) {
  if (!Number.isFinite(budget)) return {P:0,Q:0};
  let P=0,Q=0;
  for(let n=1;n<=80;n++){const c=printingCosts(n);if(c.P<=budget)P=n;if(c.Q<=budget)Q=n;}
  return {P,Q};
}

const ink='#193b33', green='#27866c', amber='#b66b24', red='#b63b43', muted='#60736d', paper='#f6faf6';
const txt=(x,y,text,opts='')=>`<text x="${x}" y="${y}" fill="${ink}" font-family="system-ui,sans-serif" ${/font-size=/.test(opts)?'':'font-size="17"'} ${opts}>${esc(text)}</text>`;
const line=(x1,y1,x2,y2,color=muted,width=2,opts='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${opts}/>`;
const circle=(x,y,filled=true,color=green,r=6)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${filled?color:paper}" stroke="${color}" stroke-width="3"/>`;
const box=(x,y,w,h,label,color=green)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="13" fill="${paper}" stroke="${color}" stroke-width="2"/>${txt(x+w/2,y+h/2+6,label,'text-anchor="middle"')}`;
const frame=(title,inside)=>`<rect width="800" height="440" rx="16" fill="${paper}"/>${txt(32,34,title,'font-weight="700" font-size="20"')}${inside}`;
function chart({xmin=-3,xmax=3,ymin=-3,ymax=9,xlabel='x',ylabel='y',title='',locale='en'}={}) {
  const X=x=>80+(x-xmin)/(xmax-xmin)*650,Y=y=>365-(y-ymin)/(ymax-ymin)*280;
  const zeroX=X(Math.max(xmin,Math.min(xmax,0))),zeroY=Y(Math.max(ymin,Math.min(ymax,0)));
  const ticks=(lo,hi)=>{
    const target=(hi-lo)/6,scale=10**Math.floor(Math.log10(target));
    const step=[1,2,5,10].map(v=>v*scale).sort((a,b)=>Math.abs(Math.log(a/target))-Math.abs(Math.log(b/target)))[0];
    const values=[];
    for(let v=Math.ceil(lo/step)*step;v<=hi+step*1e-8;v+=step)values.push(Number(v.toPrecision(10)));
    return values;
  };
  let svg='';
  for(const x of ticks(xmin,xmax))svg+=line(X(x),85,X(x),365,'#dce8e0',1)+txt(X(x),389,fmt(x),'text-anchor="middle" font-size="15"');
  for(const y of ticks(ymin,ymax))svg+=line(80,Y(y),730,Y(y),'#dce8e0',1)+txt(69,Y(y)+5,fmt(y),'text-anchor="end" font-size="15"');
  svg+=line(80,zeroY,745,zeroY,muted)+line(zeroX,75,zeroX,365,muted)+txt(750,zeroY+7,xlabel)+txt(zeroX+9,72,ylabel);
  const point=(x,y,filled=true,color=green,r=6)=>Number.isFinite(x)&&Number.isFinite(y)&&x>=xmin&&x<=xmax&&y>=ymin&&y<=ymax?circle(X(x),Y(y),filled,color,r):'';
  const plot=(fn,segments,color=green)=>segments.map(([lo,hi])=>{
    let path='',drawing=false;
    for(let i=0;i<=160;i++){
      const x=lo+(hi-lo)*i/160,y=fn(x);
      if(!Number.isFinite(y)||y<ymin||y>ymax){drawing=false;continue;}
      path+=`${drawing?'L':'M'}${X(x).toFixed(2)},${Y(y).toFixed(2)} `;drawing=true;
    }
    return `<path data-plot-segment="${esc(`${lo}:${hi}`)}" d="${path}" fill="none" stroke="${color}" stroke-width="3"/>`;
  }).join('');
  return {X,Y,svg,point,plot,finish:inside=>frame(title,svg+inside)};
}
function numberLine(intervals,excluded=[],integers=null,locale='en') {
  const X=x=>100+(x+3)/10*600,y=200;
  let s=line(75,y,735,y)+txt(735,y+32,choose(locale,'input x','輸入 x'));
  for(let n=-3;n<=7;n++)s+=line(X(n),y-5,X(n),y+5)+txt(X(n),y+29,n,'text-anchor="middle"');
  if(integers) {
    for(const n of integers)s+=circle(X(n),y,true,green,8);
    if(intervals.some(i=>i[2]===null))s+=`<path d="M87,190 L75,200 L87,210" fill="none" stroke="${green}" stroke-width="3"/>`;
    if(intervals.some(i=>i[3]===null))s+=`<path d="M723,190 L735,200 L723,210" fill="none" stroke="${green}" stroke-width="3"/>`;
  }
  else for(const [lo,hi,left,right]of intervals){
    s+=line(X(lo),y,X(hi),y,green,8);
    if(left!==null)s+=circle(X(lo),y,left,green,8);
    else s+=`<path d="M${X(lo)+12},${y-10} L${X(lo)},${y} L${X(lo)+12},${y+10}" fill="none" stroke="${green}" stroke-width="3"/>`;
    if(right!==null)s+=circle(X(hi),y,right,green,8);
    else s+=`<path d="M${X(hi)-12},${y-10} L${X(hi)},${y} L${X(hi)-12},${y+10}" fill="none" stroke="${green}" stroke-width="3"/>`;
  }
  for(const x of excluded)s+=circle(X(x),y,false,red,9);
  s+=txt(80,330,choose(locale,'Filled point: included · Open point: excluded','實心點：包括 · 空心點：不包括'));
  return s;
}
const status=(valid,locale)=>choose(locale,valid?'Allowed':'Not allowed',valid?'允許':'不允許');
const outcome=(valid,value,locale)=>valid?fmt(value):choose(locale,'Undefined for this domain','在此定義域未定義');

function arrows(s,l) {
  const links={bijective:[[0,0],[1,1],[2,2]],many:[[0,0],[1,0],[2,2]],missing:[[0,0],[2,2]],multiple:[[0,0],[1,1],[1,2],[2,2]]}[s.pattern];
  const valid=!['missing','multiple'].includes(s.pattern),outputs=[...new Set(links.map(a=>a[1]+1))].sort();
  let graphic=txt(195,85,choose(l,'Inputs A','輸入 A'),'text-anchor="middle"')+txt(580,85,choose(l,'Outputs B','輸出 B'),'text-anchor="middle"');
  for(let i=0;i<3;i++)graphic+=box(135,115+i*85,120,50,['a','b','c'][i])+box(520,115+i*85,120,50,i+1);
  for(const [from,to]of links){const x=270,y=140+from*85,ex=505,ey=140+to*85;graphic+=line(x,y,ex,ey,green,3)+`<path d="M${ex-12},${ey-7} L${ex},${ey} L${ex-12},${ey+7}" fill="none" stroke="${green}" stroke-width="3"/>`;}
  return {svg:frame(choose(l,'Which arrow patterns define a function?','哪些對應方式可定義函數？'),graphic),summary:choose(l,valid?'Every allowed input has exactly one output.':'At least one allowed input has zero or two different outputs.',valid?'每個允許輸入都有唯一輸出。':'至少一個允許輸入沒有輸出，或有兩個不同輸出。'),headers:[choose(l,'Input','輸入'),choose(l,'Outputs','輸出')],rows:['a','b','c'].map((x,i)=>[x,links.filter(a=>a[0]===i).map(a=>a[1]+1).join(', ')||'—']),facts:[choose(l,valid?'This is a function.':'This is not a function.',valid?'這是函數。':'這不是函數。'),choose(l,`Actual range: {${outputs.join(', ')}}.`,`實際值域：{${outputs.join(', ')}}。`),choose(l,'Many inputs may share one output; one input may not have two different outputs.','多個輸入可以有同一輸出；一個輸入不能有兩個不同輸出。')]};
}
function notation(s,l) {
  const r=functionValue('square-plus',s.x,s.domain==='finite'?'finite':'interval'),finite=s.domain==='finite';
  const c=chart({xmin:-3,xmax:3,ymin:0,ymax:6,title:choose(l,'f(x) = x² + 1','f(x) = x² + 1'),locale:l});
  let g=finite?[-2,-1,0,1,2].map(x=>c.point(x,x*x+1)).join(''):c.plot(x=>x*x+1,[[-2,2]])+c.point(-2,5)+c.point(2,5);
  if(r.valid)g+=c.point(s.x,r.value,true,amber,9);
  return {svg:c.finish(g),summary:choose(l,`Domain: ${finite?'{−2, −1, 0, 1, 2}':'[−2, 2]'}. x = ${fmt(s.x)}: ${status(r.valid,l)}.`,`定義域：${finite?'{−2, −1, 0, 1, 2}':'[−2, 2]'}。x = ${fmt(s.x)}：${status(r.valid,l)}。`),headers:['x','f(x)'],rows:[-2,-1,0,1,2,s.x].map(x=>[x,outcome(functionValue('square-plus',x,finite?'finite':'interval').valid,x*x+1,l)]),facts:[choose(l,`Formula calculation: ${fmt(s.x)}² + 1 = ${fmt(s.x*s.x+1)}; domain membership must still be checked.`,`按公式計算：${fmt(s.x)}² + 1 = ${fmt(s.x*s.x+1)}；仍須檢查是否屬於定義域。`),choose(l,finite?'Range: {1, 2, 5}.':'Range: [1, 5].',finite?'值域：{1, 2, 5}。':'值域：[1, 5]。'),choose(l,'The same formula with a different domain can define a different function.','同一公式配不同定義域，可以定義不同函數。')]};
}
function intervals(s,l) {
  let domain,valid,allowed,excluded=[],ints=null;
  if(s.rule==='interval'){
    valid=(s.x>0||s.x===0&&s.left==='closed')&&(s.x<4||s.x===4&&s.right==='closed');
    domain=`${s.left==='closed'?'[':'('}0, 4${s.right==='closed'?']':')'}`;
    allowed=[[0,4,s.left==='closed',s.right==='closed']];
  } else if(s.rule==='reciprocal'){valid=s.x!==2;domain='(−∞, 2) ∪ (2, ∞)';allowed=[[-3,2,null,false],[2,7,false,null]];excluded=[2];}
  else {valid=s.x>=3;domain='[3, ∞)';allowed=[[3,7,true,null]];}
  if(s.kind==='integer'){
    valid&&=Number.isInteger(s.x);ints=[];
    for(let x=-3;x<=7;x++)if(s.rule==='reciprocal'?x!==2:s.rule==='sqrt'?x>=3:(x>0||x===0&&s.left==='closed')&&(x<4||x===4&&s.right==='closed'))ints.push(x);
    domain+=choose(l,' ∩ ℤ (only dots shown are allowed)',' ∩ ℤ（只允許實心整數點）');
  }
  return {svg:frame(choose(l,'Which inputs pass the restriction?','哪些輸入能通過限制？'),numberLine(allowed,excluded,ints,l)+txt(80,110,domain)),summary:choose(l,`Allowed inputs: ${domain}.`,`允許輸入：${domain}。`),headers:[choose(l,'Test input','測試輸入'),choose(l,'Membership','是否屬於定義域')],rows:[[s.x,status(valid,l)]],facts:[choose(l,s.rule==='reciprocal'?'A denominator must not be zero.':s.rule==='sqrt'?'A real square root requires x − 3 ≥ 0.':'An open endpoint is excluded; a closed endpoint is included.',s.rule==='reciprocal'?'分母不能等於 0。':s.rule==='sqrt'?'實數平方根要求 x − 3 ≥ 0。':'開端點不包括；閉端點包括。'),choose(l,s.kind==='integer'?'This picture shows integers in the visible window only; arrows indicate that the restriction continues.':'A segment represents every real number between its endpoints.',s.kind==='integer'?'圖中只顯示視窗內的整數；箭頭表示限制繼續延伸。':'線段表示端點之間的每一個實數。')]};
}
function restrictions(s,l) {
  const finite=s.rule==='range-finite',continuous=s.rule==='range-interval';
  const rule=finite||continuous?'square':s.rule;
  const result=functionValue(rule,s.x,finite?'finite-short':continuous?'range-interval':'natural');
  const domains={combined:'[−1, 2) ∪ (2, ∞)','inverse-root':'(1, ∞)',hole:'(−∞, 1) ∪ (1, ∞)','range-finite':'{−2, −1, 0, 1}','range-interval':'[−2, 1]'};
  const title={combined:'√(x + 1)/(x − 2)','inverse-root':'1/√(x − 1)',hole:'(x² − 1)/(x − 1)','range-finite':'x²','range-interval':'x²'}[s.rule];
  const c=chart({xmin:-3,xmax:5,ymin:s.rule==='combined'?-6:0,ymax:7,title,locale:l});
  let g='';
  if(finite)g=[-2,-1,0,1].map(x=>c.point(x,x*x)).join('');
  if(continuous)g=c.plot(x=>x*x,[[-2,1]])+c.point(-2,4)+c.point(1,1);
  if(s.rule==='combined')g=c.plot(x=>Math.sqrt(x+1)/(x-2),[[-1,1.999],[2.001,5]])+c.point(-1,0)+line(c.X(2),85,c.X(2),365,red,1,'stroke-dasharray="7 6"');
  if(s.rule==='inverse-root')g=c.plot(x=>1/Math.sqrt(x-1),[[1.001,5]])+line(c.X(1),85,c.X(1),365,red,1,'stroke-dasharray="7 6"');
  if(s.rule==='hole')g=c.plot(x=>x+1,[[-3,.999],[1.001,5]])+c.point(1,2,false,red,8);
  if(result.valid)g+=c.point(s.x,result.value,true,amber,9);
  let facts;
  if(finite||continuous)facts=[choose(l,finite?'Range: {0, 1, 4}.':'Range: [0, 4].',finite?'值域：{0, 1, 4}。':'值域：[0, 4]。'),choose(l,'The square is least at 0; the largest output here comes from input −2.','平方在 0 取得最小值；這裏最大輸出來自輸入 −2。')];
  else if(s.rule==='hole')facts=[choose(l,'The formula simplifies to x + 1 only when x ≠ 1.','只有在 x ≠ 1 時，原式才可化簡為 x + 1。'),choose(l,'At x = 1, the original expression is undefined; the simplified formula would give 2. The hole stays.','當 x = 1，原式未定義；化簡式會得到 2。原函數的空缺仍須保留。')];
  else facts=[choose(l,s.rule==='combined'?'Both restrictions must hold: x + 1 ≥ 0 and x − 2 ≠ 0.':'The denominator square root must be strictly positive: x − 1 > 0.',s.rule==='combined'?'兩項限制須同時成立：x + 1 ≥ 0 且 x − 2 ≠ 0。':'分母的平方根必須嚴格大於 0：x − 1 > 0。'),choose(l,'Dashed vertical lines mark excluded inputs, not part of the function graph.','虛線標示被排除的輸入，並非函數圖像的一部分。')];
  return {svg:c.finish(g),summary:choose(l,`Domain: ${domains[s.rule]}.`,`定義域：${domains[s.rule]}。`),headers:['x',choose(l,'Function value','函數值')],rows:[[s.x,outcome(result.valid,result.value,l)]],facts};
}
function representations(s,l) {
  const valid=s.x>=0&&s.x<=4&&(s.kind==='continuous'||Number.isInteger(s.x));
  const c=chart({xmin:0,xmax:4,ymin:0,ymax:13,title:'y = 2x + 4',locale:l});
  let g=s.kind==='integer'?[0,1,2,3,4].map(x=>c.point(x,2*x+4)).join(''):c.plot(x=>2*x+4,[[0,4]])+c.point(0,4)+c.point(4,12);
  if(valid)g+=c.point(s.x,2*s.x+4,true,amber,9);
  return {svg:c.finish(g),summary:choose(l,s.kind==='integer'?'Domain: {0, 1, 2, 3, 4}. Only plotted dots belong to this graph.':'Domain: [0, 4]. Every point along the segment belongs to this graph.',s.kind==='integer'?'定義域：{0, 1, 2, 3, 4}。圖像只包括所示實心點。':'定義域：[0, 4]。線段上的每一點都屬於圖像。'),headers:['x','y'],rows:[0,1,2,3,4,s.x].map(x=>[x,outcome(s.kind==='continuous'||Number.isInteger(x),2*x+4,l)]),facts:[choose(l,`Input ${fmt(s.x)}: ${status(valid,l)}.`,`輸入 ${fmt(s.x)}：${status(valid,l)}。`),choose(l,'Two sample points determine a line only when a linear relationship is assumed. Other functions can pass through both points.','只有先假設線性關係，兩點才可決定一直線。其他函數也可以通過這兩點。')]};
}
function piecewise(s,l) {
  const values=rentalPieceValues(s.x,s.mode),distinct=[...new Set(values)],isFunction=s.mode!=='gap'&&s.mode!=='conflict';
  const c=chart({xmin:0,xmax:4,ymin:0,ymax:20,xlabel:'t',title:choose(l,'Rental charge by time','按時間計算租借費用'),locale:l});
  const firstEnd=s.mode==='conflict'?1.5:1;
  let g=c.plot(()=>6,[[.001,firstEnd]])+c.point(0,6,false)+c.point(firstEnd,6,s.mode!=='gap');
  g+=c.plot(t=>6+4*(t-1),[[1,4]],amber)+c.point(1,6,s.mode==='redundant',amber)+c.point(4,18,true,amber);
  // A graph is the union of the branches: an open marker from one branch must
  // not erase a point included by another branch at the same coordinates.
  g+=`<g data-boundary="rental-1" data-included="${s.mode!=='gap'}">${c.point(1,6,s.mode!=='gap',s.mode==='gap'?red:green,8)}</g>`;
  if(s.mode==='gap')g+=c.point(1,6,false,red,9);
  for(const y of distinct)g+=c.point(s.x,y,true,red,8);
  return {svg:c.finish(g),summary:choose(l,`Stated domain: 0 < t ≤ 4. t = ${fmt(s.x)} gives ${distinct.length} distinct output(s).`,`所述定義域：0 < t ≤ 4。t = ${fmt(s.x)} 有 ${distinct.length} 個不同輸出。`),headers:['t',choose(l,'Outputs from applicable pieces','適用分段所得輸出')],rows:[0,1,1.25,4,s.x].map(t=>[t,rentalPieceValues(t,s.mode).map(fmt).join(', ')||choose(l,'Undefined','未定義')]),facts:[choose(l,isFunction?'This arrangement defines a function on the stated domain.':'This arrangement fails to define a function on the stated domain.',isFunction?'這個安排在所述定義域可定義函數。':'這個安排不能在所述定義域定義函數。'),choose(l,s.mode==='redundant'?'Two applicable pieces at t = 1 both give 6, so there is still exactly one distinct output.':s.mode==='conflict'?'For 1 < t ≤ 1.5, the two pieces give different outputs.':s.mode==='gap'?'At t = 1 no piece applies, although 1 is in the stated domain.':'Charge is 6 for 0 < t ≤ 1, and 6 + 4(t − 1) for 1 < t ≤ 4.',s.mode==='redundant'?'在 t = 1，兩段都得到 6，因此仍只有一個不同輸出。':s.mode==='conflict'?'在 1 < t ≤ 1.5，兩段得到不同輸出。':s.mode==='gap'?'t = 1 屬於所述定義域，但沒有分段適用。':'0 < t ≤ 1 收費 6；1 < t ≤ 4 收費 6 + 4(t − 1)。')]};
}
function machineRow(y,x,first,second,mid,end,color=green) {
  return box(32,y,95,55,`x = ${fmt(x)}`,color)+box(165,y,155,55,first,color)+box(365,y,95,55,mid,color)+box(500,y,155,55,second,color)+box(695,y,90,55,end,color)+line(128,y+27,161,y+27,color)+line(321,y+27,361,y+27,color)+line(461,y+27,496,y+27,color)+line(656,y+27,691,y+27,color);
}
function composition(s,l) {
  let a,b,midA,midB,endA,endB;
  if(s.rule==='linear'){a='× 2';b='+ 3';midA=2*s.x;midB=s.x+3;endA=midA+3;endB=2*midB;}
  else if(s.rule==='square'){a=choose(l,'square','平方');b='+ 3';midA=s.x*s.x;midB=s.x+3;endA=midA+3;endB=midB*midB;}
  else {a='− 1';b='√';midA=s.x-1;midB=s.x>=0?Math.sqrt(s.x):NaN;endA=midA>=0?Math.sqrt(midA):NaN;endB=midB-1;}
  const val=v=>Number.isFinite(v)?fmt(v):choose(l,'undefined','未定義');
  const g=txt(32,92,choose(l,'Top: first machine, then second','上：先第一部，再第二部'))+machineRow(115,s.x,a,b,val(midA),val(endA))+txt(32,230,choose(l,'Bottom: reverse the order','下：交換次序'))+machineRow(252,s.x,b,a,val(midB),val(endB),amber);
  return {svg:frame(choose(l,'Follow the intermediate input','跟進中間輸入'),g),summary:choose(l,'Read each row from left to right; the output of one machine becomes the input of the next.','每行由左至右讀；上一部機器的輸出，成為下一部的輸入。'),headers:[choose(l,'Order','次序'),choose(l,'Intermediate value','中間值'),choose(l,'Final value','最後值')],rows:[[`${a} → ${b}`,val(midA),val(endA)],[`${b} → ${a}`,val(midB),val(endB)]],facts:[choose(l,'Changing the order usually changes the composite function. One matching test input does not prove that two functions are equal.','交換次序通常會改變複合函數。一個測試輸入得到相同結果，不足以證明兩個函數相等。'),choose(l,s.rule==='sqrt'?'Subtract 1 then square root requires x ≥ 1; square root then subtract 1 requires x ≥ 0.':'The intermediate value must belong to the domain of the second machine.',s.rule==='sqrt'?'先減 1 再開平方要求 x ≥ 1；先開平方再減 1 要求 x ≥ 0。':'中間值必須屬於第二部機器的定義域。')]};
}
function waterValue(x){const points=[[0,1],[2,5],[4,2],[6,4]];for(let i=1;i<points.length;i++)if(x<=points[i][0]){const [a,b]=points[i-1],[c,d]=points[i];return b+(d-b)*(x-a)/(c-a);}return 4;}
function extrema(s,l) {
  const water=s.rule==='water',quad=s.rule==='quadratic',last=water?6:quad?5:2;
  const fn=water?waterValue:quad?x=>(x-2)**2+1:x=>x;
  const c=chart({xmin:0,xmax:water?6:quad?5:2,ymin:0,ymax:quad?11:6,xlabel:water?'t':'x',title:water?choose(l,'Water level h(t)','水位 h(t)'):quad?'y = (x − 2)² + 1':'y = x',locale:l});
  let g=c.plot(fn,[[0,last]])+c.point(0,fn(0),water||quad||s.left==='closed')+c.point(last,fn(last),water||quad||s.right==='closed');
  const valid=s.x<=last&&(water||quad||(s.x>0||s.left==='closed')&&(s.x<2||s.right==='closed'));
  if(valid)g+=c.point(s.x,fn(s.x),true,amber,9);
  const facts=water?[choose(l,'Rises on [0, 2] and [4, 6]; falls on [2, 4].','在 [0, 2] 及 [4, 6] 上升；在 [2, 4] 下降。'),choose(l,'Global maximum 5 at t = 2; global minimum 1 at t = 0.','全域最大值為 5，在 t = 2 取得；全域最小值為 1，在 t = 0 取得。')]:quad?[choose(l,'Falls on [0, 2]; rises on [2, 5].','在 [0, 2] 下降；在 [2, 5] 上升。'),choose(l,'Minimum 1 at x = 2; maximum 10 at x = 5.','最小值為 1，在 x = 2 取得；最大值為 10，在 x = 5 取得。')]:[choose(l,s.left==='closed'?'Minimum 0 is attained at x = 0.':'No minimum: outputs approach 0, but 0 is excluded.',s.left==='closed'?'在 x = 0 取得最小值 0。':'沒有最小值：輸出可接近 0，但不包括 0。'),choose(l,s.right==='closed'?'Maximum 2 is attained at x = 2.':'No maximum: outputs approach 2, but 2 is excluded.',s.right==='closed'?'在 x = 2 取得最大值 2。':'沒有最大值：輸出可接近 2，但不包括 2。')];
  return {svg:c.finish(g),summary:choose(l,`Domain: ${water?'[0, 6]':quad?'[0, 5]':`${s.left==='closed'?'[':'('}0, 2${s.right==='closed'?']':')'}`}.`,`定義域：${water?'[0, 6]':quad?'[0, 5]':`${s.left==='closed'?'[':'('}0, 2${s.right==='closed'?']':')'}`}。`),headers:[water?'t':'x',water?'h(t)':'y'],rows:[[s.x,outcome(valid,fn(s.x),l)]],facts};
}
function monotonicity(s,l) {
  const quad=s.rule==='quadratic',a=Math.min(s.x1,s.x2),b=Math.max(s.x1,s.x2),fn=quad?x=>2*x*x+1:x=>1/x;
  const valid=a<b&&(quad||s.rule==='reciprocal-positive'?a>0:s.rule==='reciprocal-negative'?b<0:a!==0&&b!==0);
  const seg=quad||s.rule==='reciprocal-positive'?[[.08,4]]:s.rule==='reciprocal-negative'?[[-4,-.08]]:[[-4,-.08],[.08,4]];
  const c=chart({xmin:-4,xmax:4,ymin:-5,ymax:quad?34:5,title:quad?'f(x) = 2x² + 1':'f(x) = 1/x',locale:l});
  let g=c.plot(fn,seg);if(valid)g+=c.point(a,fn(a),true,amber,8)+c.point(b,fn(b),true,red,8)+line(c.X(a),c.Y(fn(a)),c.X(b),c.Y(fn(b)),amber,1,'stroke-dasharray="5 6"');
  return {svg:c.finish(g),summary:choose(l,`Ordered inputs: x₁ = ${fmt(a)}, x₂ = ${fmt(b)}. ${valid?'Both belong to the selected domain.':'Choose distinct inputs in the selected domain.'}`,`排序後輸入：x₁ = ${fmt(a)}，x₂ = ${fmt(b)}。${valid?'兩者都屬於所選定義域。':'請選擇所選定義域內兩個不同輸入。'}`),headers:['x₁','x₂','f(x₁)','f(x₂)','f(x₂) − f(x₁)'],rows:[[a,b,...(valid?[fmt(fn(a)),fmt(fn(b)),fmt(fn(b)-fn(a))]:['—','—','—'])]],facts:quad?[choose(l,'For arbitrary 0 < x₁ < x₂: f(x₂) − f(x₁) = 2(x₂ − x₁)(x₂ + x₁) > 0, so the function is increasing.','對任意 0 < x₁ < x₂：f(x₂) − f(x₁) = 2(x₂ − x₁)(x₂ + x₁) > 0，因此函數遞增。')]:[choose(l,'For arbitrary x₁ < x₂ in the same sign interval: f(x₂) − f(x₁) = (x₁ − x₂)/(x₁x₂) < 0.','同一正負區間內，對任意 x₁ < x₂：f(x₂) − f(x₁) = (x₁ − x₂)/(x₁x₂) < 0。'),choose(l,'On the whole domain, x₁ = −1 and x₂ = 1 give f(x₁) = −1 < 1 = f(x₂); hence 1/x is not decreasing on its whole domain.','在整個定義域，x₁ = −1、x₂ = 1 得 f(x₁) = −1 < 1 = f(x₂)；因此 1/x 並非在整個定義域遞減。'),choose(l,'A sample illustrates a claim; arbitrary-input sign reasoning proves monotonicity on the stated interval.','樣本只作示例；任意輸入的符號推理才證明所述區間的單調性。')]};
}
function parity(s,l) {
  const restricted=s.domain==='restricted',fn=x=>functionValue(s.rule,x,restricted?'restricted':'natural');
  const a=fn(s.x),b=fn(-s.x),formula={square:'x²',cube:'x³',shift:'x + 1',reciprocal:'1/x',zero:'0'}[s.rule];
  const c=chart({xmin:-3,xmax:3,ymin:-9,ymax:9,title:`f(x) = ${formula}`,locale:l});
  const segments=restricted?(s.rule==='reciprocal'?[[.08,3]]:[[0,3]]):s.rule==='reciprocal'?[[-3,-.08],[.08,3]]:[[-3,3]];
  let g=c.plot(x=>fn(x).value??NaN,segments);if(a.valid)g+=c.point(s.x,a.value,true,amber,8);if(b.valid)g+=c.point(-s.x,b.value,true,red,8);
  const kind=restricted?choose(l,'Neither odd nor even: the domain is not symmetric.','既非奇函數亦非偶函數：定義域不對稱。'):s.rule==='zero'?choose(l,'Both odd and even.','同時是奇函數及偶函數。'):s.rule==='square'?choose(l,'Even.','偶函數。'):['cube','reciprocal'].includes(s.rule)?choose(l,'Odd.','奇函數。'):choose(l,'Neither odd nor even.','既非奇函數亦非偶函數。');
  return {svg:c.finish(g),summary:choose(l,`Domain: ${restricted?(s.rule==='reciprocal'?'(0, 3]':'[0, 3]'):s.rule==='reciprocal'?'ℝ ∖ {0}':'ℝ'}. ${kind}`,`定義域：${restricted?(s.rule==='reciprocal'?'(0, 3]':'[0, 3]'):s.rule==='reciprocal'?'ℝ ∖ {0}':'ℝ'}。${kind}`),headers:['x','f(x)','−x','f(−x)'],rows:[[s.x,outcome(a.valid,a.value,l),-s.x,outcome(b.valid,b.value,l)]],facts:[choose(l,'First check that x and −x both belong to the domain for every allowed x. Then test f(−x) = f(x) or f(−x) = −f(x).','先檢查每個允許的 x 及 −x 都屬於定義域，再判斷 f(−x) = f(x) 或 f(−x) = −f(x)。'),choose(l,'Matching values for one pair alone do not establish oddness or evenness.','只有一對輸入得到相符數值，不足以證明奇偶性。')]};
}
function powers(s,l) {
  const r=functionValue(s.rule,s.x),form={linear:'x',square:'x²',cube:'x³',sqrt:'√x',reciprocal:'1/x'}[s.rule];
  const c=chart({xmin:-3,xmax:3,ymin:-9,ymax:9,title:`y = ${form}`,locale:l}),segments=s.rule==='sqrt'?[[0,3]]:s.rule==='reciprocal'?[[-3,-.08],[.08,3]]:[[-3,3]];
  let g=c.plot(x=>functionValue(s.rule,x).value??NaN,segments);if(s.rule==='sqrt')g+=c.point(0,0);if(r.valid)g+=c.point(s.x,r.value,true,amber,9);
  const data={linear:['ℝ','ℝ','Increasing on ℝ; odd.','在 ℝ 遞增；奇函數。'],square:['ℝ','[0, ∞)','Decreasing on (−∞, 0]; increasing on [0, ∞); even.','在 (−∞, 0] 遞減、[0, ∞) 遞增；偶函數。'],cube:['ℝ','ℝ','Increasing on ℝ; odd.','在 ℝ 遞增；奇函數。'],sqrt:['[0, ∞)','[0, ∞)','Increasing on [0, ∞); neither odd nor even.','在 [0, ∞) 遞增；既非奇函數亦非偶函數。'],reciprocal:['ℝ ∖ {0}','ℝ ∖ {0}','Decreasing on each of (−∞, 0) and (0, ∞); odd.','在 (−∞, 0) 及 (0, ∞) 各自遞減；奇函數。']}[s.rule];
  return {svg:c.finish(g),summary:choose(l,`Domain: ${data[0]}; range: ${data[1]}.`,`定義域：${data[0]}；值域：${data[1]}。`),headers:['x',`y = ${form}`],rows:[-2,-1,0,1,2,s.x].map(x=>{const e=functionValue(s.rule,x);return[x,outcome(e.valid,e.value,l)];}),facts:[choose(l,data[2],data[3]),choose(l,'The displayed window is only part of the full graph. Check the stated domain before using a point.','畫面只顯示完整圖像的一部分。使用某點前先核對所述定義域。')]};
}
function comparison(s,l) {
  const c=chart({xmin:0,xmax:3,ymin:0,ymax:28,title:s.mode==='powers'?choose(l,'Compare x² and x³','比較 x² 與 x³'):choose(l,'Two positive inputs of x²','x² 的兩個正輸入'),locale:l});
  let g=c.plot(x=>x*x,[[0,3]])+c.point(s.x,s.x*s.x,true,green,8),facts,rows;
  if(s.mode==='powers'){
    g+=c.plot(x=>x*x*x,[[0,3]],amber)+c.point(s.x,s.x**3,true,amber,8)+txt(100,115,'x²',`style="fill:${green}"`)+txt(160,115,'x³',`style="fill:${amber}"`);
    const relation=s.x<1?'>':s.x>1?'<':'=';rows=[[s.x,fmt(s.x*s.x),fmt(s.x**3),`x² ${relation} x³`]];
    facts=[choose(l,'x³ − x² = x²(x − 1): its sign changes at x = 1.','x³ − x² = x²(x − 1)：符號在 x = 1 改變。'),choose(l,'For 0 < x < 1, x² > x³; at x = 1 they are equal; for x > 1, x² < x³.','當 0 < x < 1，x² > x³；x = 1 時相等；x > 1 時，x² < x³。')];
  }else{
    g+=c.point(s.other,s.other*s.other,true,amber,8);rows=[[s.x,fmt(s.x*s.x),s.other,fmt(s.other*s.other)]];
    facts=[choose(l,'For 0 < a < b, b² − a² = (b − a)(b + a) > 0. Thus squaring preserves the order of positive inputs.','當 0 < a < b，b² − a² = (b − a)(b + a) > 0。因此平方保持正輸入的大小次序。')];
  }
  return {svg:c.finish(g),summary:choose(l,'All test inputs are positive. Compare within the correct interval.','所有測試輸入均為正數。須在正確區間內比較。'),headers:s.mode==='powers'?['x','x²','x³',choose(l,'Comparison','比較')]:['a','a²','b','b²'],rows,facts};
}
function substitution(s,l) {
  if(s.rule==='substitution'){
    const u=2*s.x+1,result=6*s.x+5;
    const g=box(70,115,250,70,'u = 2x + 1')+box(455,115,270,70,'x = (u − 1)/2')+line(322,150,452,150,green,3)+box(135,260,530,75,'f(u) = 3u + 2');
    return {svg:frame(choose(l,'Replace the whole input','替換完整輸入'),g),summary:choose(l,'Given f(2x + 1) = 6x + 5 for every real x. Set u = 2x + 1.','已知對所有實數 x，f(2x + 1) = 6x + 5。設 u = 2x + 1。'),headers:['x','u = 2x + 1','6x + 5','f(u) = 3u + 2'],rows:[[s.x,u,result,3*u+2]],facts:[choose(l,'As x ranges over ℝ, u also ranges over ℝ, so f(u) = 3u + 2 for every real u.','當 x 遍及 ℝ，u 也遍及 ℝ，因此所有實數 u 都有 f(u) = 3u + 2。'),choose(l,'The new letter represents the entire input 2x + 1, not only x.','新字母代表整個輸入 2x + 1，並非只替換 x。')]};
  }
  const valid=s.x>=100,a=.9*s.x-20,b=.9*(s.x-20),disabled=choose(l,'ineligible','不適用');
  const g=txt(32,90,choose(l,'Eligibility: original price x ≥ 100','適用資格：原價 x ≥ 100'))+machineRow(120,s.x,'× 0.9','− 20',fmt(.9*s.x),valid?fmt(a):disabled)+machineRow(270,s.x,'− 20','× 0.9',fmt(s.x-20),valid?fmt(b):disabled,amber);
  return {svg:frame(choose(l,'Does the order of discounts matter?','優惠次序重要嗎？'),g),summary:choose(l,valid?'Both promotions apply because the original price is at least 100.':'The original price is below 100; neither promotion sequence is eligible.',valid?'原價不少於 100，兩種優惠次序均適用。':'原價少於 100，兩種優惠次序均不適用。'),headers:[choose(l,'Order','次序'),choose(l,'Final price','最後價格')],rows:[[choose(l,'10% off, then subtract 20','先九折，再減 20'),valid?fmt(a):disabled],[choose(l,'Subtract 20, then 10% off','先減 20，再九折'),valid?fmt(b):disabled]],facts:[choose(l,'Eligibility is checked against the original price once, before either sequence.','先按原價一次過判斷適用資格，再依次進行優惠。'),choose(l,'For eligible inputs, the first sequence costs 2 less: (0.9x − 18) − (0.9x − 20) = 2.','對適用輸入，第一種次序便宜 2：(0.9x − 18) − (0.9x − 20) = 2。')]};
}
function decisions(s,l) {
  const budget=Number(s.budget),rental=s.context==='rental';
  const c=chart({xmin:0,xmax:rental?40:80,ymin:0,ymax:rental?680:330,xlabel:rental?'t':'n',ylabel:choose(l,'cost','費用'),title:choose(l,rental?'Rental: A = 16t, B = 120 + 10t':'Printing: P = 20 + 3n; Q is piecewise',rental?'租借：甲 = 16t，乙 = 120 + 10t':'印刷：甲 = 20 + 3n；乙分段計算'),locale:l});
  let g='',rows,facts,headers,observation;
  if(rental){
    const valid=s.t>0;
    g=c.plot(t=>16*t,[[.001,40]])+c.plot(t=>120+10*t,[[.001,40]],amber)+c.point(0,0,false)+c.point(0,120,false,amber)+c.point(40,640,true)+c.point(40,520,true,amber)+c.point(20,320,true,red,8);
    if(valid)g+=c.point(s.t,16*s.t,true,green,8)+c.point(s.t,120+10*s.t,true,amber,8);
    headers=['t',choose(l,'Plan A','甲方案'),choose(l,'Plan B','乙方案'),'A − B'];rows=[[s.t,valid?fmt(16*s.t):choose(l,'Undefined','未定義'),valid?fmt(120+10*s.t):choose(l,'Undefined','未定義'),valid?fmt(6*s.t-120):choose(l,'Undefined','未定義')],[20,320,320,0]];
    observation=valid?choose(l,`t = ${fmt(s.t)}: A = ${fmt(16*s.t)}, B = ${fmt(120+10*s.t)}; A − B = ${fmt(6*s.t-120)}.`,`t = ${fmt(s.t)}：甲 = ${fmt(16*s.t)}，乙 = ${fmt(120+10*s.t)}；甲 − 乙 = ${fmt(6*s.t-120)}。`):choose(l,`t = ${fmt(s.t)} is outside the stated domain; both costs and their difference are undefined.`,`t = ${fmt(s.t)} 不屬於所述定義域；兩個費用及差額均未定義。`);
    facts=[choose(l,'Domain: 0 < t ≤ 40. The plans cost the same at t = 20 hours, cost 320.','定義域：0 < t ≤ 40。t = 20 小時同價，費用 320。'),choose(l,'A is cheaper for 0 < t < 20; B is cheaper for 20 < t ≤ 40.','0 < t < 20 甲較便宜；20 < t ≤ 40 乙較便宜。')];
  }else{
    for(let n=1;n<=80;n++){const p=printingCosts(n);g+=c.point(n,p.P,true,green,2.7)+c.point(n,p.Q,true,amber,2.7);}
    const p=printingCosts(s.n),max=printingBudget(budget);
    g+=c.point(s.n,p.P,true,green,8)+c.point(s.n,p.Q,true,amber,8)+c.point(10,50,true,red,7)+c.point(40,140,true,red,7);
    headers=['n',choose(l,'Plan P','甲方案'),choose(l,'Plan Q','乙方案'),'P − Q'];rows=[10,20,40,s.n].map(n=>{const v=printingCosts(n);return[n,v.P,v.Q,v.P-v.Q];});
    observation=choose(l,`n = ${s.n}: P = ${p.P}, Q = ${p.Q}; P − Q = ${p.P-p.Q}.`,`n = ${s.n}：甲 = ${p.P}，乙 = ${p.Q}；甲 − 乙 = ${p.P-p.Q}。`);
    facts=[choose(l,'Domain: integers 1 to 80. Q(n) = 5n for n ≤ 20, and 2n + 60 for n > 20.','定義域：1 至 80 的整數。n ≤ 20 時乙 = 5n；n > 20 時乙 = 2n + 60。'),choose(l,'Same price at n = 10 and n = 40. Q is cheaper for n < 10 or n > 40; P is cheaper for 10 < n < 40.','n = 10 及 n = 40 同價。n < 10 或 n > 40 時乙較便宜；10 < n < 40 時甲較便宜。'),choose(l,`Budget ${budget}: P allows at most ${max.P} booklets; Q allows at most ${max.Q}.`,`預算 ${budget}：甲最多 ${max.P} 本；乙最多 ${max.Q} 本。`)];
  }
  if(!rental)g+=line(80,c.Y(budget),730,c.Y(budget),red,2,'stroke-dasharray="6 5"')+txt(92,c.Y(budget)-10,choose(l,`Budget ${budget}`,`預算 ${budget}`));
  g+=line(570,60,600,60,green,3)+txt(608,66,rental?'A':'P')+line(660,60,690,60,amber,3)+txt(698,66,rental?'B':'Q');
  return {svg:c.finish(g),summary:choose(l,rental?'Time can vary continuously. Compare the plans at the same allowed time.':'Booklets are whole numbers: individual dots, without connecting segments.',rental?'時間可連續變化；須在同一允許時數比較。':'冊數只取整數：以獨立實心點表示，不連成線段。')+' '+observation,headers,rows,facts};
}
const SCENES={'01':arrows,'02':notation,'03':intervals,'04':restrictions,'05':representations,'06':piecewise,'07':composition,'08':extrema,'09':monotonicity,'10':parity,'11':powers,'12':comparison,'13':substitution,'14':decisions};
export function worksheetScene(lessonId,rawState={},locale='en') {
  const id=idOf(lessonId),state=normalizeWorksheetState(id,rawState);
  return SCENES[id](state,lang(locale));
}
