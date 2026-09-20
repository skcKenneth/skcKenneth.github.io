/* Session-only scaffolding. Auxiliary answers never enter the practice score. */
const LearningUI = (() => {
  const records=new Map(), opened=new Map();
  const esc=s=>escapeHTML(s);
  const btn=(label,attrs='',cls='secondary-button')=>button(label,attrs,cls);
  const details=(key,label,body)=>`<details data-support-details="${esc(key)}" ${opened.get(key)?'open':''}><summary>${esc(label)}</summary>${body}</details>`;
  function exerciseState(key){if(!records.has(key))records.set(key,{seed:71,draft:'',checked:false});return records.get(key);}
  function pairState(key,lesson){if(!records.has(key))records.set(key,{lesson,open:false,kind:0,attempts:[{seed:0,prediction:'',left:'',right:'',checked:false}]});return records.get(key);}
  function feedback(value,answer){const check=PracticeBank.gradeNumeric({answer},value);return !check.valid?'請輸入有效整數、小數或分數，分母不可為 0。':check.correct?'數值正確。':'數值未吻合，請對照下方步驟再想一次。';}
  function exercise(lesson,section,index,kind){
    const key=`${lesson}:${section.id}:${kind}`,s=exerciseState(key),q=section.make(s.seed+(kind==='completion'?0:1009));
    return `<div class="support-exercise" data-support-exercise="${key}"><h4>${kind==='completion'?'補做最後一步':'獨立變式'}</h4><p>${esc(q.prompt)}</p>${kind==='completion'?`<ol>${q.steps.slice(0,-1).map(x=>`<li>${esc(x.doing)}</li>`).join('')}<li>下一步由你完成。</li></ol>`:''}<form data-support-check="${key}"><label for="support-${key}">你的數值答案</label><div class="answer-row"><input id="support-${key}" data-support-draft="${key}" value="${esc(s.draft)}" autocomplete="off" inputmode="text" placeholder="可輸入分數，例如 −3/4"><button class="primary-button" type="submit">核對這一步</button></div></form>${details(key+':hint','需要提示',`<p>${esc(q.hint)}</p>`)}${s.checked?`<div class="support-feedback" role="status"><p>${esc(feedback(s.draft,q.answer))}</p>${s.valid?`<ol>${q.steps.map(x=>`<li>${esc(x.doing)}<p class="step-why">${esc(x.why)}</p></li>`).join('')}</ol>${btn('換一題再試',`data-support-next="${key}"`)}`:''}</div>`:''}</div>`;
  }
  function panel(lesson){
    const blocks=LearningContent.chapters[lesson];if(!blocks)return '';
    return `<section class="lesson-section learning-foundations" id="foundations"><h2>由基礎開始</h2><p>逐段理解，再由補做一步走到獨立作答。以下練習獨立於隨機練習分數；草稿只保留於本次頁面。</p>${blocks.map((s,i)=>{
      const q=s.make(17+i*131);
      return details(`${lesson}:${s.id}:section`,`${i+1}. ${s.title}`,`<div class="learning-block">${s.concepts.map(x=>`<p>${esc(x)}</p>`).join('')}<div class="support-diagram" role="note">${esc(s.diagram)}</div>${details(`${lesson}:${s.id}:worked`,'看完整示範',`<p class="example-question">${esc(q.prompt)}</p><ol class="worked-steps">${q.steps.map(x=>`<li><strong>${esc(x.doing)}</strong><p class="step-why">為甚麼：${esc(x.why)}</p></li>`).join('')}</ol>`)}${exercise(lesson,s,i,'completion')}${exercise(lesson,s,i,'independent')}</div>`);
    }).join('')}</section><section class="lesson-section" id="compare"><h2>比較容易混淆的做法</h2><p>先預測，再算兩邊。每次只改關鍵條件，看看結果與方法有甚麼不同。</p>${compareLauncher(lesson,'lesson-'+lesson)}</section>`;
  }
  function compareLauncher(lesson,key){
    if(!LearningContent.comparisons[lesson])return '';
    const s=pairState(key,lesson);
    return `<div class="comparison-launcher" data-comparison-key="${esc(key)}">${btn(s.open?'收起比較題':'比較一題容易混淆的',`data-compare-toggle="${esc(key)}" aria-expanded="${s.open}"`)}${s.open?comparePanel(key,s):''}</div>`;
  }
  function comparePanel(key,s){
    const options=LearningContent.comparisons[s.lesson],a=s.attempts.at(-1),pair=options[s.kind].make(a.seed);
    return `<div class="comparison-panel"><label for="kind-${key}">比較主題</label><select id="kind-${key}" data-compare-kind="${key}">${options.map((o,i)=>`<option value="${i}" ${s.kind===i?'selected':''}>${esc(o.title)}</option>`).join('')}</select><h4>${esc(pair.title)}</h4><div class="contrast-grid"><div><b>A</b><p>${esc(pair.left.prompt)}</p></div><div><b>B</b><p>${esc(pair.right.prompt)}</p></div></div><label for="prediction-${key}">先預測：兩個數值答案會相同嗎？</label><select id="prediction-${key}" data-compare-input="prediction" data-compare-record="${key}" ${a.checked?'disabled':''}><option value="">請先選擇</option>${[['same','相同'],['different','不同'],['unsure','未肯定，想算一算']].map(([v,label])=>`<option value="${v}" ${a.prediction===v?'selected':''}>${label}</option>`).join('')}</select>${a.prediction?`<form data-compare-check="${key}"><div class="contrast-grid">${['left','right'].map((side,i)=>`<label for="${side}-${key}">${i?'B':'A'} 的數值答案<input id="${side}-${key}" data-compare-input="${side}" data-compare-record="${key}" value="${esc(a[side])}" autocomplete="off" ${a.checked?'disabled':''}></label>`).join('')}</div><button type="submit" class="primary-button" ${a.checked?'disabled':''}>看差異與做法</button></form>`:'<p class="storage-note">選好預測後便可分別作答，不計入原題分數。</p>'}${a.error?`<p role="alert">${esc(a.error)}</p>`:''}${a.checked?`<div class="support-feedback" role="status"><p>${Math.abs(pair.left.answer-pair.right.answer)<1e-9?'兩個數值相同。':'兩個數值不同。'}${a.prediction==='unsure'?'由計算檢查剛才未確定的地方。':(a.prediction==='same')===(Math.abs(pair.left.answer-pair.right.answer)<1e-9)?'與你的預測一致。':'與你的預測不同，留意下方關鍵差異。'}</p><div class="contrast-grid"><div><b>A：${esc(feedback(a.left,pair.left.answer))}</b><p>${esc(pair.left.working)}</p></div><div><b>B：${esc(feedback(a.right,pair.right.answer))}</b><p>${esc(pair.right.working)}</p></div></div><div class="contrast-table"><table><caption>改變了甚麼？</caption><thead><tr><th scope="col">比較項目</th><th scope="col">A</th><th scope="col">B</th></tr></thead><tbody>${pair.rows.map(row=>`<tr>${row.map((v,i)=>i?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table></div><p>${esc(pair.explanation)}</p>${btn('換一組再試',`data-compare-next="${key}"`)}<p class="storage-note">補充作答不影響原題答案或分數。</p></div>`:''}${s.attempts.length>1?details(key+':previous','查看先前比較紀錄',`<ol>${s.attempts.slice(0,-1).map(old=>{const p=options[old.kind??s.kind].make(old.seed);return `<li>${esc(p.title)}；預測：${esc(({same:'相同',different:'不同',unsure:'未肯定'})[old.prediction]||'未選')}；A：${esc(old.left||'未答')}；B：${esc(old.right||'未答')}；${old.checked?'已核對':'未核對'}。</li>`;}).join('')}</ol>`):''}</div>`;
  }
  function followups(q,index,key){return (q.followups||[]).filter(f=>f.step===index).map((f,i)=>details(`${key}:follow:${index}:${i}`,f.label,`<p>${esc(f.text)}</p>`)).join('');}
  function redraw(){const y=window.scrollY,active=document.activeElement?.id;render();window.scrollTo(0,y);if(active)document.getElementById(active)?.focus({preventScroll:true});}
  function restore(root){root.querySelectorAll('[data-support-details]').forEach(d=>{d.open=!!opened.get(d.dataset.supportDetails);});}
  function bind(root){
    root.addEventListener('toggle',e=>{const key=e.target.dataset?.supportDetails;if(key)opened.set(key,e.target.open);},true);
    root.addEventListener('input',e=>{
      const t=e.target;if(t.dataset.supportDraft){const s=exerciseState(t.dataset.supportDraft);s.draft=t.value;s.checked=false;}
      if(t.dataset.compareInput&&t.dataset.compareInput!=='prediction'){const a=records.get(t.dataset.compareRecord)?.attempts.at(-1);if(a&&!a.checked)a[t.dataset.compareInput]=t.value;}
    });
    root.addEventListener('change',e=>{
      const t=e.target;
      if(t.dataset.compareInput==='prediction'){const s=records.get(t.dataset.compareRecord);if(s&&!s.attempts.at(-1).checked){s.attempts.at(-1).prediction=t.value;redraw();}}
      if(t.dataset.compareKind){const s=records.get(t.dataset.compareKind);s.attempts.at(-1).kind=s.kind;s.kind=+t.value;s.attempts.push({seed:s.attempts.length,prediction:'',left:'',right:'',checked:false});redraw();}
    });
    root.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b||b.disabled)return;
      if(b.dataset.compareToggle){const s=records.get(b.dataset.compareToggle);s.open=!s.open;redraw();}
      if(b.dataset.compareNext){const s=records.get(b.dataset.compareNext);s.attempts.at(-1).kind=s.kind;s.attempts.push({seed:s.attempts.at(-1).seed+1,prediction:'',left:'',right:'',checked:false});redraw();}
      if(b.dataset.supportNext){const s=exerciseState(b.dataset.supportNext);s.seed+=313;s.draft='';s.checked=false;redraw();}
    });
    root.addEventListener('submit',e=>{
      const key=e.target.dataset.supportCheck,compare=e.target.dataset.compareCheck;if(!key&&!compare)return;e.preventDefault();
      if(key){const s=exerciseState(key);s.checked=true;s.valid=PracticeBank.parseNumber(s.draft)!==null;}
      if(compare){const s=records.get(compare),a=s.attempts.at(-1);if(a.checked)return;a.error='';if(!a.prediction)a.error='請先作預測。';else if(PracticeBank.parseNumber(a.left)===null||PracticeBank.parseNumber(a.right)===null)a.error='請在 A、B 兩欄輸入有效整數、小數或分數。';else a.checked=true;}
      redraw();
    });
  }
  return {panel,compareLauncher,followups,bind,restore};
})();
