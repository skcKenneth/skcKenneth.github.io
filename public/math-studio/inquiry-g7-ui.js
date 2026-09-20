'use strict';
const G7InquiryUI = (() => {
  const C=G7InquiryCore,U=G7InquiryContent,key='math-studio-inquiry-g7-v1';
  const ids=Object.keys(C.definitions),labels={prediction:'預測與理由',peer:'另一種想法',claim:'主張與證據',revision:'修訂與條件',transfer:'獨立遷移',extension:'延伸研究紀錄',observation:'教師觀察',nextLesson:'下次教學調整'};
  let records={},persistent=true;
  const copy=x=>JSON.parse(JSON.stringify(x));
  function sanitize(raw,id) {
    const n={version:C.version,stage:0,params:C.defaults(id),evidence:[],selected:[],draft:'',checks:[],opened:[]};
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return n;
    for(const field of Object.keys(labels))if(typeof raw[field]==='string')n[field]=raw[field].slice(0,6000);
    n.params=C.normalize(id,raw.params||{});n.stage=Number.isInteger(raw.stage)?Math.max(0,Math.min(5,raw.stage)):0;
    if(typeof raw.draft==='string')n.draft=raw.draft.slice(0,100);
    if(Array.isArray(raw.evidence))n.evidence=raw.evidence.filter(e=>e&&typeof e.settings==='string'&&typeof e.result==='string').slice(0,12).map(e=>({version:typeof e.version==='string'?e.version.slice(0,50):'legacy-v2',settings:e.settings.slice(0,8000),result:e.result.slice(0,12000),...(e.params&&e.version===C.version?{params:C.normalize(id,e.params)}:{})}));
    if(Array.isArray(raw.selected))n.selected=raw.selected.filter(i=>Number.isInteger(i)&&i>=0&&i<n.evidence.length).slice(0,2);
    if(Array.isArray(raw.checks))n.checks=raw.checks.filter(x=>x&&typeof x.prompt==='string'&&typeof x.answer==='string'&&typeof x.correct==='boolean').slice(-20);
    if(Array.isArray(raw.opened))n.opened=raw.opened.filter(x=>typeof x==='string').slice(0,30);
    return n;
  }
  function readStored(storageKey){
    let value;try{value=localStorage.getItem(storageKey);}catch{persistent=false;return {};}
    try{const parsed=JSON.parse(value||'{}');return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};}catch{return {};}
  }
  const current=readStored(key),old=readStored('math-studio-inquiry-v2');
  for(const id of ids)records[id]=sanitize(current[id]||old[id],id);
  const note=id=>records[id]??=(sanitize(null,id));
  function save() {
    try{localStorage.setItem(key,JSON.stringify(records));persistent=true;}catch{persistent=false;}
    const el=document.getElementById('g7-save-status');if(el)el.textContent=persistent?'探究紀錄已保存在此瀏覽器。':'本機保存失敗；本次操作仍保留，請下載紀錄。';
  }
  function restoreParameters(){return Object.fromEntries(ids.map(id=>[id,copy(note(id).params)]));}
  function inputField(id,field) {return `<label class="g7-field" for="g7-${field}">${labels[field]}<textarea id="g7-${field}" rows="3" maxlength="6000" data-g7-field="${field}" data-g7-id="${id}">${escapeHTML(note(id)[field]||'')}</textarea></label>`;}
  function controls(id,p) {
    return Object.entries(C.definitions[id].controls).map(([k,s])=>s.options?`<label class="g7-control" for="g7-param-${k}">${s.label}<select id="g7-param-${k}" data-g7-param="${k}" data-g7-id="${id}">${s.options.map(([v,t])=>`<option value="${v}"${p[k]===v?' selected':''}>${t}</option>`).join('')}</select></label>`:`<div class="g7-control"><label for="g7-param-${k}">${s.label}</label><div class="g7-input-pair"><input id="g7-param-${k}" aria-label="${s.label}（滑桿）" type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${p[k]}" data-g7-param="${k}" data-g7-id="${id}"><input aria-label="${s.label}（數值）" type="number" min="${s.min}" max="${s.max}" step="${s.step}" value="${p[k]}" data-g7-param="${k}" data-g7-id="${id}"></div></div>`).join('')+(id==='routes'?`<div class="g7-directions" role="group" aria-label="編排格線路線">${[['U','↑ 上'],['D','↓ 下'],['L','← 左'],['R','→ 右'],['undo','復原一步'],['clear','清空路線']].map(([v,t])=>button(t,`data-g7-route="${v}"`,'secondary-button')).join('')}</div><p id="g7-route-text"></p>`:'')+(id==='sampling'?button('換下一個種子重抽','data-g7-next-seed','secondary-button'):'');
  }
  function labPanel(id,large) {
    const u=U[id],p=state.params[id];return `<section class="lab-panel g7-lab" data-lab-panel="${id}" aria-label="${u.short}"><div class="lab-panel-header"><p class="eyebrow">初一核心探究 / ${large?'INVESTIGATE':'TRY IT'}</p><h2>${u.title}</h2><p>${u.intro}</p></div><div class="lab-stage" id="lab-stage"></div><div class="lab-controls"><div class="g7-controls">${controls(id,p)}</div><p id="g7-control-message" role="status"></p><div class="lab-result" id="lab-result" aria-live="polite"></div></div>${large?'':button('開始預測與記錄 →',`data-open-lab="${id}"`,'lab-foot')}</section>`;
  }
  const lineSVG=(x1,y1,x2,y2,color='#177d70',dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="3"${dash?' stroke-dasharray="'+dash+'"':''}/>`;
  const label=(x,y,text,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#183c38" font-size="14">${escapeHTML(text)}</text>`;
  const dot=(x,y,color='#177d70')=>`<circle cx="${x}" cy="${y}" r="5" fill="${color}"/>`;
  function graphic(id,r) {
    const p=r.params,m=r.metrics;let g='';
    if(id==='number') {
      const X=x=>250+x*25;g=lineSVG(30,140,470,140);
      for(let x=-8;x<=8;x+=2)g+=lineSVG(X(x),136,X(x),144,'#a9bbb4')+label(X(x),166,x);
      m.homes.forEach((x,i)=>{g+=lineSVG(X(x),40+i*27,X(p.a),40+i*27,['#177d70','#a77734','#5369a6'][i])+label(20,44+i*27,'ABC'[i])+label(480,44+i*27,C.fmt(m.distances[i]));g+=dot(X(x),140,['#177d70','#a77734','#5369a6'][i])+label(X(x),190+i*17,'ABC'[i]);});
      g+=lineSVG(X(p.a),112,X(p.a),148,'#183c38','4 3')+label(X(p.a),240,`集合點 ${p.a}`);
    } else if(id==='powers') {
      g=label(250,35,'先看結構，再看結果');
      [85,185].forEach((y,i)=>{g+=`<rect x="20" y="${y-30}" width="460" height="80" rx="12" fill="${i?'#fff4df':'#eaf4f0'}"/>`+label(250,y,i?`(−${p.a}) 的 ${p.n} 次方`:`${p.a} 的 ${p.n} 次方，再取相反數`)+label(250,y+30,i?m.right:m.left);});
    } else if(id==='matches') {
      const cell=35,gap=p.joined?0:7,w=p.n*(cell+gap)-gap,left=(500-w)/2;
      for(let i=0;i<p.n;i++){const x=left+i*(cell+gap);g+=lineSVG(x,90,x+cell,90)+lineSVG(x,125,x+cell,125)+lineSVG(x,90,x,125,'#a77734','4 2');if(!p.joined||i===p.n-1)g+=lineSVG(x+cell,90,x+cell,125,'#a77734','4 2');}
      g+=label(250,190,`${p.n} 個正方形 · ${m.total} 支`)+label(250,225,'實線：上下邊；虛線：直邊；共邊只畫一次');
    } else if(id==='magic') {
      [p.x,p.x+p.b,p.a*(p.x+p.b),m.value].forEach((v,i)=>{g+=`<rect x="${20+i*122}" y="100" width="90" height="60" rx="8" fill="#eaf4f0"/>`+label(65+i*122,136,v);if(i<3)g+=label(126+i*122,135,'→');});
      g+=label(250,65,`x → 加 (${p.b}) → 乘 (${p.a}) → 減 (${p.c})x`)+label(250,210,`化簡：(${m.coefficient})x + (${m.constant})`);
    } else if(id==='balance') {
      g=label(250,55,`原式：${p.a}x + (${p.b}) = ${p.c}`)+label(250,110,`兩邊同${{add:'加',subtract:'減',multiply:'乘',divide:'除以'}[p.operation]} ${p.operand}`)+label(250,165,m.valid?`新式：${r.rows[2][1]}`:'除以 0 沒有定義')+label(250,225,m.valid?(m.equivalent?'解集相同':'解集不同'):'不建立新方程');
    } else if(id==='angles') {
      const cx=250,cy=140,point=(a,length)=>[cx+length*Math.cos(a*Math.PI/180),cy-length*Math.sin(a*Math.PI/180)],a=point(p.rotation,p.l1*23),b=point(p.rotation+p.angle,p.l2*23),mid=point(p.rotation+p.angle/2,105),arc1=point(p.rotation,36),arc2=point(p.rotation+p.angle,36);
      g=lineSVG(cx,cy,...a)+lineSVG(cx,cy,...b)+lineSVG(cx,cy,...mid,'#a77734','5 4')+`<path d="M${arc1} A36 36 0 0 0 ${arc2}" fill="none" stroke="#5369a6" stroke-width="2"/>`+dot(cx,cy)+label(250,280,`開口 ${p.angle}°；虛線平分為 ${m.bisector}°`);
    } else if(id==='parallels') {
      const segment=(y,alpha)=>{const dx=110*Math.sin(alpha*Math.PI/180),dy=-110*Math.cos(alpha*Math.PI/180);return lineSVG(250-dx,y-dy,250+dx,y+dy);};
      const arc=(y,start,end,text)=>{const xy=(t,r)=>[250+r*Math.cos(t*Math.PI/180),y-r*Math.sin(t*Math.PI/180)],a=xy(start,28),b=xy(end,28),c=xy((start+end)/2,48);return `<path d="M${a} A28 28 0 0 0 ${b}" stroke="#a77734" fill="none" stroke-width="2"/>`+label(c[0],c[1]+4,text);};
      g=lineSVG(250,5,250,295,'#5369a6')+segment(85,p.alpha)+segment(215,p.beta)+arc(85,90-p.alpha,90,'α')+arc(85,270-p.alpha,270,'α′')+arc(85,270,450-p.alpha,'γ')+arc(215,90-p.beta,90,'β')+label(38,85,'上線')+label(38,215,'下線')+label(445,145,'截線');
    } else if(id==='roots') {
      const scale=32,side=p.side*scale,targetSide=Math.sqrt(p.target)*scale;
      g=`<rect x="50" y="${215-side}" width="${side}" height="${side}" fill="#eaf4f0" stroke="#177d70" stroke-width="2"/><rect x="280" y="${215-targetSide}" width="${targetSide}" height="${targetSide}" fill="none" stroke="#a77734" stroke-width="2" stroke-dasharray="5 3"/>`+label(130,245,`試驗邊長 ${p.side}`)+label(360,245,`目標面積 ${p.target}`)+label(250,275,'圖形供比較；精確界以平方運算核對');
    } else if(id==='routes') {
      const points=[...m.points,[p.tx,p.ty]],xmin=Math.min(...points.map(x=>x[0]))-1,xmax=Math.max(...points.map(x=>x[0]))+1,ymin=Math.min(...points.map(x=>x[1]))-1,ymax=Math.max(...points.map(x=>x[1]))+1,scale=Math.min(410/(xmax-xmin),220/(ymax-ymin)),X=x=>45+(x-xmin)*scale,Y=y=>255-(y-ymin)*scale;
      for(let x=xmin;x<=xmax;x++)g+=lineSVG(X(x),Y(ymin),X(x),Y(ymax),'#dbe5df')+(xmax-xmin<20?label(X(x),Y(ymin)+18,x):'');
      for(let y=ymin;y<=ymax;y++)g+=lineSVG(X(xmin),Y(y),X(xmax),Y(y),'#dbe5df')+(ymax-ymin<20?label(X(xmin)-15,Y(y)+4,y):'');
      g+=`<polyline points="${m.points.map(([x,y])=>`${X(x)},${Y(y)}`).join(' ')}" fill="none" stroke="#177d70" stroke-width="3"/><rect x="${X(p.tx)-7}" y="${Y(p.ty)-7}" width="14" height="14" fill="none" stroke="#a77734" stroke-width="3"/>`+dot(X(m.x),Y(m.y))+label(250,18,'線：已走路線　方框：目標　圓點：目前位置');
    } else if(id==='tickets') {
      g=label(250,30,'每個點代表一組整數張數：x 張 A，餘下 B');
      for(let x=0;x<=p.total;x++){const i=x%11,j=Math.floor(x/11),income=p.priceA*x+p.priceB*(p.total-x),yes=income===p.revenue;g+=`<${yes?'rect':'circle'} ${yes?`x="${25+i*44}" y="${65+j*78}" width="24" height="24"`:`cx="${37+i*44}" cy="${77+j*78}" r="8"`} fill="${yes?'#177d70':'#dbe5df'}"/>`+label(37+i*44,110+j*78,x);}
      g+=label(250,265,`橫標籤：x　方塊：收入符合　圓點：不符合`);
    } else if(id==='tariffs') {
      const max=Math.max(100,p.n,m.maxA,m.maxB),X=n=>45+Math.max(0,n)/max*405;
      [[m.maxA,'A',90],[m.maxB,'B',185]].forEach(([end,name,y])=>{g+=lineSVG(45,y,450,y,'#dbe5df')+label(20,y+5,name);if(end>=p.minimum)g+=lineSVG(X(p.minimum),y,X(end),y)+dot(X(p.minimum),y)+dot(X(end),y)+label((X(p.minimum)+X(end))/2,y-18,`${p.minimum} ≤ n ≤ ${end}`);else g+=label(250,y-18,'沒有可行整數用量');g+=lineSVG(X(p.n),y-10,X(p.n),y+10,'#a77734')+label(X(p.n),y+32,`本次 ${p.n}`);});
      g+=label(250,275,'實心端點包含；只取整數次數；金色短線為本次用量');
    } else if(id==='sampling') {
      const bottom=220,Y=v=>bottom-(v-p.baseline)/(100-p.baseline)*165;
      g=lineSVG(70,55,70,bottom,'#5369a6')+lineSVG(70,bottom,455,bottom,'#5369a6');
      for(let v=p.baseline;v<=100;v+=20)g+=label(48,Y(v)+5,`${v}%`);
      [[150,m.percent,'樣本 A'],[320,50,'全校 A']].forEach(([x,v,t])=>{g+=`<rect x="${x}" y="${Y(Math.max(v,p.baseline))}" width="65" height="${bottom-Y(Math.max(v,p.baseline))}" fill="${x===150?'#177d70':'#a77734'}"/>`+label(x+32,Y(Math.max(v,p.baseline))-10,`${C.fmt(v)}%`)+label(x+32,245,t);if(v<p.baseline)g+=label(x+32,270,'低於圖窗');});
      if(p.baseline)g+=label(250,28,'注意：縱軸從 40% 開始；柱高不是完整比例');
    }
    return `<svg viewBox="0 0 500 300" role="img" aria-label="${escapeHTML(r.summary)}"><title>${escapeHTML(r.summary)}</title>${g}</svg>`;
  }
  function evidenceHTML(id) {
    const n=note(id);return n.evidence.length?n.evidence.map((e,i)=>`<article class="g7-evidence"><h4>實驗 ${i+1} · ${e.version===C.version?'本版':`舊版 ${escapeHTML(e.version)}（保留原紀錄）`}</h4><p>${escapeHTML(e.settings)}</p><pre>${escapeHTML(e.result)}</pre><div>${button(n.selected.includes(i)?'取消比較':'加入並排比較',`data-g7-compare="${i}" aria-pressed="${n.selected.includes(i)}"`,'secondary-button')}${button('移除這筆',`data-g7-remove="${i}"`,'text-button')}</div></article>`).join(''):'<p>先留下預測，再把目前實驗保存到這裏。最多保留12筆。</p>';
  }
  function comparisonHTML(id) {const n=note(id);return n.selected.length?`<h3>並排比較已保存證據</h3><div class="g7-comparison">${n.selected.map(i=>{const e=n.evidence[i];return `<article><h4>實驗 ${i+1} · ${escapeHTML(e.version)}</h4><p>${escapeHTML(e.settings)}</p><pre>${escapeHTML(e.result)}</pre></article>`;}).join('')}</div><p>對照兩次改了哪個條件；舊版紀錄按當時版本閱讀。</p>`:'';}
  function followupsHTML(id,r) {const n=note(id);return U[id].followups.map(([title,answer],i)=>`<details data-g7-detail="follow-${i}"${n.opened.includes('follow-'+i)?' open':''}><summary>${title}</summary><p>${escapeHTML(answer(r))}</p></details>`).join('');}
  function panel(id) {
    const u=U[id],n=note(id),stages=['理解問題','留下預測','操作與記錄','比較及找反例','解釋與修訂','獨立遷移'];
    return `<section class="inquiry-workspace g7-workspace" data-inquiry="${id}" data-g7-inquiry="${id}"><div class="inquiry-intro"><p class="eyebrow">初一 / 核心 25–35 分鐘 · 延伸 10–20 分鐘</p><h2>${u.title}</h2><p>個人先想，再操作。課堂可2至4人輪流擔任操作、記錄及提問者；自學可比較下方明確標示的假想觀點。</p><label for="g7-stage">我目前做到<select id="g7-stage" data-g7-stage>${stages.map((s,i)=>`<option value="${i}"${n.stage===i?' selected':''}>${i+1}. ${s}</option>`).join('')}</select></label><p>步驟可自由返回，不以完成字數或答案關鍵字評分。</p></div><div class="g7-task-grid"><article class="inquiry-step"><span class="step-kicker">01–02 / 問題與預測</span><h3>先留下想法</h3><p>${u.predict}</p>${inputField(id,'prediction')}</article><article class="inquiry-step"><span class="step-kicker">03 / 操作與記錄</span><h3>一次改一個條件</h3><p>套用案例只改參數；文字與既有證據保留。套用後可回到上方查看圖表。</p><div class="g7-case-buttons">${u.cases.map(([title],i)=>button(title,`data-g7-case="${i}"`,'secondary-button')).join('')}</div><a href="#lab-stage">回到實驗圖表 ↑</a><p>${button('記錄目前實驗結果','data-g7-action="capture"','primary-button')}</p><p id="g7-message" role="status" tabindex="-1"></p><div id="g7-evidence">${evidenceHTML(id)}</div></article><article class="inquiry-step"><span class="step-kicker">04 / 比較與反例</span><h3>檢查一句猜想</h3><p>${u.conjecture}</p><div id="g7-comparison">${comparisonHTML(id)}</div><p><b>假想觀點（教學示例）</b>：${u.peer}</p>${inputField(id,'peer')}</article><article class="inquiry-step"><span class="step-kicker">05 / 解釋與修訂</span><h3>把證據連到理由</h3>${inputField(id,'claim')}${inputField(id,'revision')}<div class="g7-hints">${u.hints.map((hint,i)=>`<details data-g7-detail="hint-${i}"${n.opened.includes('hint-'+i)?' open':''}><summary>${['先試小例子','提示怎樣整理','查看參考推理'][i]}</summary><p>${hint}</p></details>`).join('')}</div><h4>針對目前實驗追問</h4><p>回答會跟上方目前參數更新；已保存的實驗維持原值。</p><div id="g7-followups">${followupsHTML(id,C.calculate(id,state.params[id]))}</div><div class="g7-check"><label for="g7-quick-answer" id="g7-quick-label"></label><input id="g7-quick-answer" inputmode="decimal" type="text" value="${escapeHTML(n.draft)}" data-g7-draft maxlength="100">${button('核對小步驟','data-g7-action="check"','secondary-button')}<p id="g7-check-message" role="status" tabindex="-1"></p><small>只核對這項數值，不計入章節練習分數。推理請按成功準則自評。</small></div></article><article class="inquiry-step g7-transfer"><span class="step-kicker">06 / 獨立遷移</span><h3>換一個情境再解釋</h3><p>${u.transfer}</p>${inputField(id,'transfer')}<details data-g7-detail="transfer"${n.opened.includes('transfer')?' open':''}><summary>自行嘗試後，對照參考思路</summary><ol>${u.model.map(x=>`<li>${x}</li>`).join('')}</ol></details><h4>成功準則 · 自評／同伴／教師檢視</h4><ul>${u.rubric.map(x=>`<li>${x}</li>`).join('')}</ul><p>逐項判斷「未呈現／部分達成／有完整證據」，並指向自己的實驗或理由。</p></article></div><section class="inquiry-step g7-research"><h3>繼續研究 · 10–20分鐘</h3><p>${u.extension[0]}</p>${inputField(id,'extension')}<details data-g7-detail="extension"${n.opened.includes('extension')?' open':''}><summary>需要時，查看延伸方向</summary><p>${u.extension[1]}</p></details></section><div class="inquiry-actions">${button('下載完整探究紀錄','data-g7-action="export"','secondary-button')}${button('列印學習單','data-g7-action="print"','secondary-button')}<span id="g7-save-status" class="storage-note">${persistent?'紀錄限此瀏覽器；清除瀏覽器資料會移除紀錄。':'本機保存不可用；可繼續操作並下載紀錄。'}</span></div><details class="teacher-alignment" data-g7-detail="teacher"${n.opened.includes('teacher')?' open':''}><summary>教師備課與離堂檢查</summary><p><b>先備：</b>${u.teacher.prerequisites}</p><p><b>時間：</b>問題與預測5分鐘、實驗10分鐘、比較與解釋10分鐘、遷移5分鐘；延伸10–20分鐘。可按討論需要分兩課。</p><h4>三個討論問題</h4><ol>${u.teacher.questions.map(x=>`<li>${x}</li>`).join('')}</ol><p><b>預期策略：</b>${u.teacher.strategies}</p><p><b>常見迷思：</b>${u.misconception}</p><p><b>離堂題：</b>${u.teacher.exit}</p><details><summary>離堂題參考</summary><p>${u.teacher.exitAnswer}</p></details>${inputField(id,'observation')}${inputField(id,'nextLesson')}</details></section>`;
  }
  function update(id) {
    const r=C.calculate(id,state.params[id]);state.params[id]=r.params;
    const stage=document.getElementById('lab-stage'),result=document.getElementById('lab-result');
    if(stage)stage.innerHTML=graphic(id,r);
    const resultOpen=result?.querySelector('details')?.open;
    if(result)result.innerHTML=`<p><b>${escapeHTML(r.summary)}</b></p><details${resultOpen?' open':''}><summary>展開數值與文字紀錄</summary><dl class="g7-results">${r.rows.map(([a,b])=>`<dt>${escapeHTML(a)}</dt><dd>${escapeHTML(b)}</dd>`).join('')}</dl></details>`;
    app.querySelectorAll('[data-g7-param]').forEach(el=>{el.value=String(r.params[el.dataset.g7Param]);el.disabled=id==='parallels'&&el.dataset.g7Param==='beta'&&r.params.locked===1;});
    const follow=document.getElementById('g7-followups');if(follow)follow.innerHTML=followupsHTML(id,r);
    const prompt=document.getElementById('g7-quick-label');if(prompt)prompt.textContent=U[id].quick(r).prompt;
    const route=document.getElementById('g7-route-text');if(route)route.textContent='指令（U上 D下 L左 R右）：'+(r.params.path||'尚未移動');
  }
  function change(id,p) {state.params[id]=C.normalize(id,p);note(id).params=copy(state.params[id]);save();update(id);const el=document.getElementById('g7-check-message');if(el)el.textContent=note(id).draft?'參數已更新，原答案保留；請重新核對目前實驗。':'';}
  function exportText(id) {
    const u=U[id],n=note(id);return [`數學研習室｜${u.title}`,`內容版本 ${C.version}；目前步驟 ${n.stage+1}`,`目前參數\n${C.snapshot(id,n.params).settings}`,...Object.entries(labels).map(([k,label])=>`${label}\n${n[k]||'（未填）'}`),'實驗證據',...n.evidence.map((e,i)=>`${i+1}. 版本 ${e.version}\n${e.settings}\n${e.result}`),'小步驟核對（不計章節分數）',...n.checks.map(c=>`${c.prompt}\n學生答案：${c.answer}；${c.correct?'正確':'需再檢查'}\n版本 ${c.version||'舊版'}；參數 ${JSON.stringify(c.params||{})}`),'成功準則',...u.rubric].join('\n\n');
  }
  function message(text,focus=false){const el=document.getElementById('g7-message')||document.getElementById('g7-control-message');if(el){el.textContent=text;if(focus)el.focus();}}
  function refreshEvidence(id){document.getElementById('g7-evidence').innerHTML=evidenceHTML(id);document.getElementById('g7-comparison').innerHTML=comparisonHTML(id);}
  function bind(root) {
    root.addEventListener('input',e=>{
      const el=e.target;
      if(el.dataset.g7Field){note(el.dataset.g7Id)[el.dataset.g7Field]=el.value.slice(0,6000);save();return;}
      if(el.dataset.g7Draft!==undefined){note(state.lab).draft=el.value;save();return;}
      if(el.dataset.g7Param){const id=el.dataset.g7Id,k=el.dataset.g7Param,s=C.definitions[id].controls[k];let v;
        if(s.options){v=s.options.find(o=>String(o[0])===el.value)?.[0];if(v===undefined)return;}
        else{v=Number(el.value);if(el.value.trim()===''||!Number.isFinite(v)||v<s.min||v>s.max||Math.abs((v-s.min)/s.step-Math.round((v-s.min)/s.step))>1e-6){el.setAttribute('aria-invalid','true');document.getElementById('g7-control-message').textContent=`請輸入 ${s.min} 至 ${s.max}，每次 ${s.step} 的有效數值。`;return;}}
        el.removeAttribute('aria-invalid');document.getElementById('g7-control-message').textContent='';change(id,{...state.params[id],[k]:v});
      }
    });
    root.addEventListener('change',e=>{if(e.target.dataset.g7Stage!==undefined){note(state.lab).stage=Number(e.target.value);save();}});
    root.addEventListener('toggle',e=>{const el=e.target;if(el.dataset?.g7Detail===undefined)return;const panel=el.closest('[data-g7-inquiry]');if(!panel)return;const n=note(panel.dataset.g7Inquiry),name=el.dataset.g7Detail;n.opened=n.opened.filter(x=>x!==name);if(el.open)n.opened.push(name);save();},true);
    root.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;
      const scope=b.closest('[data-g7-inquiry]')||b.closest('[data-lab-panel]');if(!scope)return;const id=scope.dataset.g7Inquiry||scope.dataset.labPanel;if(!C.has(id))return;const n=note(id);
      if(b.dataset.g7Case!==undefined){const item=U[id].cases[Number(b.dataset.g7Case)];if(!item)return;change(id,{...state.params[id],...item[1]});message('已套用「'+item[0]+'」。預測、草稿與已保存證據保留。');}
      if(b.dataset.g7Route){let path=state.params[id].path;const action=b.dataset.g7Route;if(action==='undo')path=path.slice(0,-1);else if(action==='clear')path='';else if(path.length<120)path+=action;else{message('已達120步；可復原一步或清空路線，已保存的證據不會刪除。');return;}change(id,{...state.params[id],path});}
      if(b.dataset.g7NextSeed!==undefined)change(id,{...state.params[id],seed:state.params[id].seed===99999?1:state.params[id].seed+1});
      if(b.dataset.g7Action==='capture'){
        if(!(n.prediction||'').trim()){message('先留下預測，再記錄實驗。');document.getElementById('g7-prediction').focus();return;}
        const row=C.snapshot(id,state.params[id]);if(n.evidence.some(e=>e.version===row.version&&e.settings===row.settings)){message('這組設定已記錄；請改一個條件再比較。');return;}
        if(n.evidence.length>=12){message('已有12筆；請先下載，或移除一筆再記錄。');return;}
        n.evidence.push(row);save();refreshEvidence(id);message(`已保存實驗 ${n.evidence.length}。`,true);
      }
      if(b.dataset.g7Compare!==undefined){const i=Number(b.dataset.g7Compare);if(!n.evidence[i])return;if(n.selected.includes(i))n.selected=n.selected.filter(x=>x!==i);else if(n.selected.length<2)n.selected.push(i);else{message('先取消其中一筆，再選另一筆；同時比較兩筆。',true);return;}save();refreshEvidence(id);message('已更新並排比較。',true);}
      if(b.dataset.g7Remove!==undefined){const i=Number(b.dataset.g7Remove);n.evidence.splice(i,1);n.selected=n.selected.filter(x=>x!==i).map(x=>x>i?x-1:x);save();refreshEvidence(id);message('已移除選定紀錄，其他草稿保留。',true);}
      if(b.dataset.g7Action==='check'){
        const q=U[id].quick(C.calculate(id,state.params[id])),raw=n.draft||'',value=Number(raw.replace(/−/g,'-')),el=document.getElementById('g7-check-message');
        if(!raw.trim()||!Number.isFinite(value)){el.textContent='請先輸入有效數值；不要留空。';el.focus();return;}
        const correct=Math.abs(value-q.answer)<=1e-8;n.checks.push({version:C.version,prompt:q.prompt,answer:raw,correct,params:copy(state.params[id])});n.checks=n.checks.slice(-20);save();el.textContent=correct?'這項數值正確。再用自己的話解釋原因。':`目前實驗的參考值是 ${C.fmt(q.answer)}。可展開「先試小例子」檢查步驟；單一錯誤答案不能判斷你的思考原因。`;el.focus();
      }
      if(b.dataset.g7Action==='export'){const url=URL.createObjectURL(new Blob(['\uFEFF'+exportText(id)],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=`初一探究-${id}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
      if(b.dataset.g7Action==='print'){
        const worksheet=b.closest('[data-g7-inquiry]'),areas=[...worksheet.querySelectorAll('textarea')];
        areas.forEach(a=>{const p=document.createElement('pre');p.className='g7-print-answer';p.textContent=a.value||'（留空作答）';a.after(p);});
        const clean=()=>worksheet.querySelectorAll('.g7-print-answer').forEach(x=>x.remove());
        window.addEventListener('afterprint',clean,{once:true});try{window.print();}catch{clean();message('此瀏覽器未能開啟列印；可下載完整紀錄。');}
      }
    });
  }
  function catalog() {
    const all=Object.entries(labInfo),grade=state.grade;
    const core=grade==='g7'?ids:all.filter(([id])=>(!C.has(id)&&Inquiry.units[id].grade.includes(grades[grade].name))||(id==='tariffs'&&grade==='g8')).map(([id])=>id);
    const extension=grade==='g7'?['triangle','area','outlier']:[];
    const cards=list=>list.map(id=>button(`<small>${C.has(id)?'CH. '+String(ids.indexOf(id)+1).padStart(2,'0'):Inquiry.units[id].grade}</small>${labInfo[id].short}`,`data-open-lab="${id}" aria-pressed="${state.lab===id}"`,state.lab===id?'active':'')).join('');
    return `<div class="segmented g7-grade-filter" role="group" aria-label="探究年級">${Object.entries(grades).map(([id,g])=>button(g.name,`data-lab-grade="${id}" aria-pressed="${grade===id}"`,grade===id?'active':'')).join('')}</div><h2>${grades[grade].name}${grade==='g7'?' · 12章核心探究':'探究'}</h2><div class="lab-selector" role="group" aria-label="選擇探索主題">${cards(core)}</div>${extension.length?`<details class="g7-extensions"><summary>跨年級延伸：三角形、乘法面積與平均數</summary><p>按先備知識選用；以下不取代初一各章的核心活動。</p><div class="lab-selector">${cards(extension)}</div></details>`:''}`;
  }
  function install() {
    const oldPanel=Inquiry.panel,oldSnapshot=Inquiry.snapshot,oldGraphic=Inquiry.graphic,oldExport=Inquiry.exportText,oldBind=Inquiry.bind;
    for(const id of ids){Inquiry.units[id]=U[id];Inquiry.extraLabs[id]={title:U[id].title,short:U[id].short,description:U[id].intro,question:U[id].conjecture,explain:U[id].hints[2],tag:'YEAR 7 / INQUIRY',related:[...new Set([C.definitions[id].lesson,...(Inquiry.extraLabs[id]?.related||[])])]};Inquiry.params[id]=C.defaults(id);}
    Inquiry.panel=id=>C.has(id)?panel(id):oldPanel(id);
    Inquiry.snapshot=(id,p)=>C.has(id)?C.snapshot(id,p):oldSnapshot(id,p);
    Inquiry.graphic=(id,p)=>C.has(id)?{graphic:graphic(id,C.calculate(id,p)),result:C.calculate(id,p).summary}:oldGraphic(id,p);
    Inquiry.exportText=id=>C.has(id)?exportText(id):oldExport(id);
    Inquiry.bind=root=>{oldBind(root);bind(root);};
  }
  install();
  return {restoreParameters,labPanel,update,catalog,sanitize,exportText,graphic};
})();
