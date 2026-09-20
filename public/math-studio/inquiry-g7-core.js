/* Pure, deterministic mathematics shared by the interactive view and evidence. */
'use strict';
const G7InquiryCore = (() => {
  const version = 'g7-1';
  const spec = (label, min, max, step, value) => ({label,min,max,step,value});
  const choice = (label, options, value) => ({label,options,value});
  const definitions = {
    number:{lesson:'rational',controls:{h1:spec('住宅 A 位置',-8,8,1,-5),h2:spec('住宅 B 位置',-8,8,1,-1),h3:spec('住宅 C 位置',-8,8,1,7),a:spec('集合點位置',-8,8,.5,-1)}},
    powers:{lesson:'operations',controls:{a:spec('非負數 a',0,5,1,2),n:spec('正整數指數 n',1,6,1,2)}},
    matches:{lesson:'expressions',controls:{n:spec('正方形個數 n',0,10,1,3),joined:choice('排列方法',[[1,'排成一列，共用相鄰邊'],[0,'每個正方形分開']],1)}},
    magic:{lesson:'polynomial-add',controls:{x:spec('心中想的數 x',-10,10,1,4),a:spec('括號外倍數 a',-5,5,1,3),b:spec('先加的數 b',-5,5,1,2),c:spec('最後減去的倍數 c',-5,5,1,3)}},
    balance:{lesson:'linear-equation',controls:{a:spec('原式 x 的係數 a',-4,4,1,2),b:spec('原式左邊常數 b',-10,12,1,3),c:spec('原式右邊常數 c',-10,12,1,11),operation:choice('兩邊同做的運算',[['add','加'],['subtract','減'],['multiply','乘'],['divide','除']], 'add'),operand:spec('運算使用的數',-4,4,1,2),candidate:spec('代回檢查 x',-10,10,.5,4)}},
    angles:{lesson:'geometry',controls:{angle:spec('角的開口（度）',10,170,5,45),l1:spec('第一條射線顯示長度',1,5,1,3),l2:spec('第二條射線顯示長度',1,5,1,3),rotation:spec('整幅圖轉動（度）',0,330,30,0)}},
    parallels:{lesson:'parallel',controls:{alpha:spec('上方同位角 α（度）',20,160,5,60),beta:spec('下方同位角 β（度）',20,160,5,60),locked:choice('直線條件',[[1,'保持平行（β 跟隨 α）'],[0,'自由轉動']],1)}},
    roots:{lesson:'real',controls:{target:spec('正方形目標面積',0,25,1,2),digits:spec('細分到小數點後幾位',0,4,1,1),side:spec('試驗邊長',0,5,.0001,1.4)}},
    routes:{lesson:'coordinates',controls:{sx:spec('起點橫坐標',-5,5,1,-2),sy:spec('起點縱坐標',-5,5,1,1),tx:spec('目標橫坐標',-5,5,1,3),ty:spec('目標縱坐標',-5,5,1,4)}},
    tickets:{lesson:'systems',controls:{priceA:spec('A 票價（元）',1,10,1,2),priceB:spec('B 票價（元）',1,10,1,5),total:spec('售票總張數',0,20,1,10),revenue:spec('售票總收入（元）',0,200,1,32)}},
    tariffs:{lesson:'inequality',controls:{fixed:spec('B 固定費（元）',0,60,1,24),rate:spec('B 每次費用（元）',.5,3,.1,1.2),n:spec('使用次數',0,100,1,30),minimum:spec('最低需要次數',0,100,1,20),budget:spec('預算（元）',0,300,1,70)}},
    sampling:{lesson:'data-collection',controls:{size:spec('抽樣人數',5,40,5,20),method:choice('訪問對象',[['random','從全校隨機抽樣'],['club','只訪問某個課外活動小組']], 'random'),seed:spec('實驗種子',1,99999,1,2026),baseline:choice('圖表縱軸起點',[[0,'0%'],[40,'40%（截斷軸）']],0)}}
  };
  const has = id => Object.hasOwn(definitions,id);
  const defaults = id => ({...Object.fromEntries(Object.entries(definitions[id].controls).map(([k,s])=>[k,s.value])),...(id==='routes'?{path:''}:{})});
  function normalize(id,input={}) {
    const p=defaults(id);
    for(const [k,s] of Object.entries(definitions[id].controls)) {
      const v=input[k];
      if(s.options) { if(s.options.some(o=>o[0]===v))p[k]=v; }
      else if(typeof v==='number'&&Number.isFinite(v))p[k]=Number((s.min+Math.round((Math.max(s.min,Math.min(s.max,v))-s.min)/s.step)*s.step).toFixed(6));
    }
    if(id==='routes'&&typeof input.path==='string')p.path=input.path.replace(/[^UDLR]/g,'').slice(0,120);
    if(id==='parallels'&&p.locked)p.beta=p.alpha;
    return p;
  }
  const fmt=n=>Number.isInteger(n)?String(n):Number(n.toFixed(10)).toString();
  const equation=(a,b,c)=>`${fmt(a)}x + (${fmt(b)}) = ${fmt(c)}`;
  const solution=(a,b,c)=>a===0?{kind:b===c?'all':'none'}:{kind:'one',value:(c-b)/a,numerator:c-b,denominator:a};
  const solutionText=s=>s.kind==='all'?'全體實數':s.kind==='none'?'無解':Number.isInteger(s.value)?`x = ${s.value}`:`x = (${s.numerator})/(${s.denominator})`;
  function random(seed) { let n=seed>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;}; }
  // Entirely synthetic: 200 pupils, 100 choose A; club has 36 A and 4 B.
  const population=Array.from({length:200},(_,i)=>({id:i+1,club:i<40,a:i<36||(i>=40&&i<104)}));
  function sample(size,method,seed) {
    const pool=population.filter(p=>method!=='club'||p.club).slice(),rng=random(seed);
    if(!['random','club'].includes(method)||!Number.isInteger(size)||size<1||size>pool.length)throw new RangeError('抽樣方法或人數不在可用範圍。');
    for(let i=0;i<size;i++){const j=i+Math.floor(rng()*(pool.length-i));[pool[i],pool[j]]=[pool[j],pool[i]];}
    return pool.slice(0,size);
  }
  function calculate(id,input) {
    const p=normalize(id,input),rows=[];let summary='',m={};
    if(id==='number') {
      const homes=[p.h1,p.h2,p.h3],sorted=homes.slice().sort((a,b)=>a-b),distances=homes.map(x=>Math.abs(p.a-x));
      m={homes,distances,total:distances.reduce((a,b)=>a+b,0),max:Math.max(...distances),median:sorted[1],midpoint:(sorted[0]+sorted[2])/2};
      homes.forEach((h,i)=>rows.push([`住宅 ${'ABC'[i]}（${h}）`,`|${p.a} − (${h})| = ${fmt(distances[i])} 單位`]));
      summary=`集合點 ${p.a}：總路程 ${fmt(m.total)}，最遠路程 ${fmt(m.max)}。`;
    } else if(id==='powers') {
      m={left:-(p.a**p.n),right:(-p.a)**p.n};m.equal=m.left===m.right;
      rows.push(['−aⁿ',`−(${Array(p.n).fill(p.a).join(' × ')}) = ${m.left}`],['(−a)ⁿ',`${Array(p.n).fill(`(−${p.a})`).join(' × ')} = ${m.right}`]);
      summary=`a=${p.a}，n=${p.n}：兩式${m.equal?'相等':'不相等'}。`;
    } else if(id==='matches') {
      const shared=p.joined?Math.max(0,p.n-1):0;m={shared,total:4*p.n-shared,formulas:[4+3*(p.n-1),4*p.n-(p.n-1),3*p.n+1]};
      rows.push(['逐個分開計算',`${4*p.n} 支`],['重複計了的共邊',`${shared} 支`],['實際火柴數',`${m.total} 支`]);
      summary=`${p.n} 個${p.joined?'共邊':'分開'}正方形需 ${m.total} 支。${p.n===0?'空圖為 0；3n+1 在 n=0 不適用。':!p.joined?'分開排列用 4n；共邊公式不適用。':'共邊公式適用於 n≥1。'}`;
    } else if(id==='magic') {
      m={coefficient:p.a-p.c,constant:p.a*p.b,value:p.a*(p.x+p.b)-p.c*p.x};m.invariant=m.coefficient===0;
      rows.push(['先加',`${p.x} + (${p.b}) = ${p.x+p.b}`],['再乘',`${p.a} × (${p.x+p.b}) = ${p.a*(p.x+p.b)}`],['最後減',`${p.a*(p.x+p.b)} − (${p.c} × ${p.x}) = ${m.value}`]);
      summary=`${p.a}(x + (${p.b})) − (${p.c})x = (${m.coefficient})x + (${m.constant})；本次結果 ${m.value}。`;
    } else if(id==='balance') {
      const original=solution(p.a,p.b,p.c);let a=p.a,b=p.b,c=p.c,valid=true;
      if(p.operation==='add'){b+=p.operand;c+=p.operand;}
      if(p.operation==='subtract'){b-=p.operand;c-=p.operand;}
      if(p.operation==='multiply'){a*=p.operand;b*=p.operand;c*=p.operand;}
      if(p.operation==='divide'){if(p.operand===0)valid=false;else{a/=p.operand;b/=p.operand;c/=p.operand;}}
      const transformed=valid?solution(a,b,c):null;
      m={original,transformed,valid,a,b,c,equivalent:valid&&original.kind===transformed.kind&&(original.kind!=='one'||Math.abs(original.value-transformed.value)<1e-10),originalCheck:Math.abs(p.a*p.candidate+p.b-p.c)<1e-9,transformedCheck:valid&&Math.abs(a*p.candidate+b-c)<1e-9};
      const transformedEquation=p.operation==='divide'?`(${p.a}/${p.operand})x + (${p.b}/${p.operand}) = (${p.c}/${p.operand})`:equation(a,b,c);
      rows.push(['原式',equation(p.a,p.b,p.c)],['原式解集',solutionText(original)],['變形後',valid?transformedEquation:'不能除以 0'],['變形後解集',valid?solutionText(p.operation==='divide'?original:transformed):'此操作沒有定義'],[`代入 x=${p.candidate}`,`原式${m.originalCheck?'成立':'不成立'}；變形後${!valid?'不可檢查':m.transformedCheck?'成立':'不成立'}`]);
      summary=!valid?'除以 0 沒有定義，未建立新方程。':`兩式解集${m.equivalent?'相同':'不同'}。${p.operation==='multiply'&&p.operand===0?'乘零得到 0=0；是否等價仍須比較原解集。':''}`;
    } else if(id==='angles') {
      m={angle:p.angle,bisector:p.angle/2,complement:p.angle<90?90-p.angle:null,supplement:180-p.angle};
      rows.push(['開口',`${p.angle}°`],['角平分後',`${m.bisector}°、${m.bisector}°`],['正角的餘角',m.complement===null?'不存在正角的餘角':`${m.complement}°`],['補角',`${m.supplement}°`]);
      summary=`顯示長度 ${p.l1}、${p.l2}，整體轉動 ${p.rotation}°；角仍為 ${p.angle}°。`;
    } else if(id==='parallels') {
      m={parallel:p.alpha===p.beta,corresponding:[p.alpha,p.beta],alternate:[p.alpha,p.beta],vertical:[p.alpha,p.alpha],interior:[180-p.alpha,p.beta]};
      rows.push(['上交點的對頂角',`${p.alpha}° = ${p.alpha}°`],['同位角 α、β',`${p.alpha}°、${p.beta}°`],['內錯角 α′、β',`${p.alpha}°、${p.beta}°`],['同旁內角 γ、β',`${180-p.alpha}° + ${p.beta}° = ${180-p.alpha+p.beta}°`]);
      summary=`兩直線${m.parallel?'平行':'不平行'}。對頂角相等不需要兩直線平行。`;
    } else if(id==='roots') {
      // Scaled integer squares make the displayed brackets exact (at most 4 dp).
      const scale=10**p.digits,target=p.target*scale*scale;
      let lo=0,hi=5*scale;while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(mid*mid<=target)lo=mid;else hi=mid-1;}
      const exact=lo*lo===target,upper=exact?lo:lo+1,sideInt=Math.round(p.side*10000),squareInt=sideInt*sideInt;
      m={lower:lo/scale,upper:upper/scale,exact,area:squareInt/1e8,comparison:Math.sign(squareInt-p.target*1e8)};
      rows.push(['試驗面積',`${p.side}² = ${fmt(m.area)}`],['與目標比較',`${fmt(m.area)} ${m.comparison<0?'<':m.comparison>0?'>':'='} ${p.target}`],['可核對的界',exact?`√${p.target} = ${m.lower}`:`${m.lower}² < ${p.target} < ${m.upper}²`]);
      summary=exact?`√${p.target} = ${m.lower}（精確值）。`:`${m.lower} < √${p.target} < ${m.upper}，區間寬 ${fmt(m.upper-m.lower)}。`;
    } else if(id==='routes') {
      let x=p.sx,y=p.sy;const points=[[x,y]],vectors={U:[0,1],D:[0,-1],L:[-1,0],R:[1,0]};
      for(const s of p.path){const d=vectors[s];x+=d[0];y+=d[1];points.push([x,y]);}
      m={x,y,points,length:p.path.length,minimum:Math.abs(p.tx-p.sx)+Math.abs(p.ty-p.sy),reached:x===p.tx&&y===p.ty,dx:x-p.sx,dy:y-p.sy};
      rows.push(['目前終點',`(${x}, ${y})`],['橫、縱平移量',`(${m.dx}, ${m.dy})`],['已走路程',`${m.length} 格`],['至目標的最短格線路程',`${m.minimum} 格`]);
      summary=`${m.reached?'已到目標':'未到目標'}；走了 ${m.length} 格，終點 (${x}, ${y})。`;
    } else if(id==='tickets') {
      const pairs=Array.from({length:p.total+1},(_,x)=>[x,p.total-x]).filter(([x,y])=>p.priceA*x+p.priceB*y===p.revenue);
      const same=p.priceA===p.priceB,real=same?(p.priceA*p.total===p.revenue?'many':'none'):'one',y=same?null:(p.revenue-p.priceA*p.total)/(p.priceB-p.priceA);
      m={pairs,real,x:y===null?null:p.total-y,y};
      rows.push(['張數條件',`x+y=${p.total}`],['收入條件',`${p.priceA}x+${p.priceB}y=${p.revenue}`],['實數方程組',real==='many'?'無限多組實數解':real==='none'?'無解':`x=${fmt(m.x)}，y=${fmt(y)}（非整數時顯示近似值）`],['非負整數可行組合',pairs.length?pairs.map(([x,y])=>`(${x}, ${y})`).join('、'):'沒有']);
      summary=`售票情境有 ${pairs.length} 組可行方案。${pairs.length===0&&real==='one'?'實數解不符合非負整數張數。':''}`;
    } else if(id==='tariffs') {
      // Work in tenths of a dollar, including exact comparisons at endpoints.
      const rate=Math.round(p.rate*10),a=20*p.n,b=p.fixed*10+rate*p.n;
      const maxA=Math.floor(p.budget/2),maxB=Math.floor((p.budget*10-p.fixed*10)/rate);
      m={costA:a/10,costB:b/10,difference:(b-a)/10,maxA,maxB,feasibleA:p.n>=p.minimum&&p.n<=maxA,feasibleB:p.n>=p.minimum&&p.n<=maxB,threshold:rate===20?null:p.fixed*10/(20-rate)};
      const region=max=>max<p.minimum?'沒有可行整數用量':`${p.minimum}≤n≤${max}，n 為整數`;
      rows.push(['A：每次 2 元',`${m.costA} 元；${m.feasibleA?'可行':'不符合最低用量或預算'}`],['B：固定費＋按次',`${fmt(m.costB)} 元；${m.feasibleB?'可行':'不符合最低用量或預算'}`],['A 可行範圍',region(maxA)],['B 可行範圍',region(maxB)],['同價條件',rate===20?(p.fixed===0?'所有用量同價':'沒有同價用量'):m.threshold<0?'同價解為負數，不在情境中':`n=${fmt(m.threshold)}${Number.isInteger(m.threshold)?'':'（非整數，實際用量沒有同價點）'}`]);
      summary=`用 ${p.n} 次：${a===b?'兩方案同價':a<b?'A 較便宜':'B 較便宜'}。${!m.feasibleA&&!m.feasibleB?'但兩個方案都不可行。':'須同時檢查預算及最低用量。'}`;
    } else if(id==='sampling') {
      const selected=sample(p.size,p.method,p.seed),count=selected.filter(x=>x.a).length;
      const repeats=Array.from({length:30},(_,i)=>sample(p.size,p.method,p.seed+i).filter(x=>x.a).length/p.size*100);
      m={selected,count,percent:count/p.size*100,repeats,average:repeats.reduce((a,b)=>a+b,0)/30,populationPercent:50};
      rows.push(['合成全校資料','200 人；A：100 人，B：100 人（A 佔 50%）'],['特定小組','40 人；A：36 人，B：4 人（A 佔 90%）'],['本次樣本',`A：${count}，B：${p.size-count}；A 頻率 ${fmt(m.percent)}%`],['樣本編號',selected.map(x=>x.id).join('、')],['30 次重抽的 A 百分比',repeats.map(fmt).join('、')],['30 次平均',`${fmt(m.average)}%（不保證每次較大樣本都更接近 50%）`]);
      summary=`合成資料；${p.method==='random'?'全校隨機':'只訪問小組'}抽 ${p.size} 人，A 佔 ${fmt(m.percent)}%。種子 ${p.seed}。`;
    }
    return {id,version,params:p,summary,rows,metrics:m};
  }
  function snapshot(id,input) {
    const r=calculate(id,input),settings=Object.entries(r.params).map(([k,v])=>`${definitions[id].controls[k]?.label||'路線 U上 D下 L左 R右'}=${v}`).join('；');
    return {version,params:r.params,settings,result:[r.summary,...r.rows.map(row=>row.join('：'))].join('\n')};
  }
  return {version,definitions,has,defaults,normalize,calculate,snapshot,population,sample,fmt};
})();
