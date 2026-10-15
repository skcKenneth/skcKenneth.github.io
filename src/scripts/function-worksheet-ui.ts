import {worksheetControls,worksheetScene} from '../lib/function-worksheet-models.mjs';

/** Projection state is session-only. Learning records remain with the common notebook. */
export function initializeFunctionWorksheets(root:HTMLElement){
 const id=root.dataset.functionWorksheet!,locale=root.dataset.fwLocale||'en',zh=locale==='zh-Hant',t=(en:string,ch:string)=>zh?ch:en;
 const lesson=root.querySelector<HTMLElement>('[data-fw-lesson]')!;
 if(window.parent!==window){const workspaceLink=root.querySelector<HTMLElement>('[data-fw-open-workspace]');if(workspaceLink)workspaceLink.hidden=true;}
 const controls=worksheetControls(id),inputs=Array.from(root.querySelectorAll<HTMLInputElement|HTMLSelectElement>('[data-fw-control]'));
 const defaults=Object.fromEntries(controls.map((c:any)=>[c.key,c.value]));
 let state={...defaults},stage=0,observations:any[]=[];
 const query=<T extends Element=HTMLElement>(selector:string)=>root.querySelector<T>(selector)!;
 const stages=[t('Predict','先預測'),t('Explore','操作與記錄'),t('Explain','整理與說理'),t('Transfer','遷移與檢核')];
 let scene=worksheetScene(id,state,locale);
 function setStage(next:number){
  const focused=document.activeElement;
  stage=Math.max(0,Math.min(3,next));lesson.dataset.fwStage=String(stage);
  root.querySelectorAll<HTMLElement>('[data-fw-show-stages]').forEach(el=>el.hidden=!el.dataset.fwShowStages!.split(',').includes(String(stage)));
  root.querySelectorAll<HTMLButtonElement>('[data-fw-stage-button]').forEach(button=>{if(Number(button.dataset.fwStageButton)===stage)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
  query<HTMLButtonElement>('[data-fw-prev]').disabled=stage===0;query<HTMLButtonElement>('[data-fw-advance]').disabled=stage===3;
  query('[data-fw-stage-status]').textContent=`${stage+1} / 4 · ${stages[stage]}`;
  if(focused instanceof HTMLElement&&root.contains(focused)&&focused.closest('[hidden]'))query<HTMLButtonElement>(`[data-fw-stage-button="${stage}"]`).focus();
 }
 function update(){
  scene=worksheetScene(id,state,locale);query('[data-fw-svg]').innerHTML=scene.svg;
  query('[data-fw-summary]').textContent=scene.summary;
  const table=query<HTMLTableElement>('[data-fw-table]'),head=table.tHead!,body=table.tBodies[0];head.replaceChildren();body.replaceChildren();
  const row=document.createElement('tr');for(const value of scene.headers){const th=document.createElement('th');th.scope='col';th.textContent=String(value);row.append(th);}head.append(row);
  for(const values of scene.rows){const tr=document.createElement('tr');for(const value of values){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}body.append(tr);}
  const facts=root.querySelector('[data-fw-reasoning-facts]');if(facts){facts.replaceChildren();for(const fact of scene.facts){const li=document.createElement('li');li.textContent=fact;facts.append(li);}}
  for(const input of inputs){const output=root.querySelector(`[data-fw-output="${input.dataset.fwControl}"]`);if(output)output.textContent=input.value;}
  for(const control of controls as any[]){const label=root.querySelector<HTMLElement>(`[data-fw-control-label="${control.key}"]`);if(label)label.hidden=!!control.when&&!control.when.values.includes(String(state[control.when.key]));}
 }
 for(const input of inputs)input.addEventListener('input',()=>{
  if(input instanceof HTMLInputElement&&(!input.value.trim()||!Number.isFinite(Number(input.value))||!input.checkValidity())){input.setAttribute('aria-invalid','true');query('[data-fw-error]').textContent=t('Use a number within the displayed limits. The last valid diagram is retained.','請輸入顯示範圍內嘅數值；圖像暫時保留上一次有效設定。');return;}
  input.removeAttribute('aria-invalid');query('[data-fw-error]').textContent='';
  state={...state,[input.dataset.fwControl!]:input instanceof HTMLSelectElement?input.value:Number(input.value)};update();
 });
 root.querySelectorAll<HTMLElement>('[data-fw-stage-button]').forEach(button=>button.addEventListener('click',()=>setStage(Number(button.dataset.fwStageButton))));
 root.querySelectorAll('[data-fw-next]').forEach(button=>button.addEventListener('click',()=>setStage(stage+1)));
 query('[data-fw-prev]').addEventListener('click',()=>setStage(stage-1));query('[data-fw-advance]').addEventListener('click',()=>setStage(stage+1));
 function renderObservations(){const list=query('[data-fw-observations]');list.replaceChildren();for(const observation of observations){const li=document.createElement('li'),summary=document.createElement('p'),settings=document.createElement('p'),values=document.createElement('div');summary.textContent=observation.summary;settings.className='fw-small';settings.textContent=(controls as any[]).filter(control=>!control.when||control.when.values.includes(String(observation.state[control.when.key]))).map(control=>{const value=observation.state[control.key],option=control.options?.find((candidate:any)=>String(candidate.value)===String(value));return `${control.label[locale]}: ${option?option.label[locale]:value}`;}).join(' · ');values.className='fw-table-wrap';const table=document.createElement('table');table.className='fw-table';const header=document.createElement('tr');for(const value of observation.headers){const cell=document.createElement('th');cell.scope='col';cell.textContent=String(value);header.append(cell);}table.append(header);for(const row of observation.rows){const tr=document.createElement('tr');for(const value of row){const cell=document.createElement('td');cell.textContent=String(value);tr.append(cell);}table.append(tr);}values.append(table);li.append(summary,settings,values);list.append(li);}}
 query('[data-fw-capture]').addEventListener('click',()=>{if(observations.length>=12){query('[data-fw-error]').textContent=t('The board holds 12 observations. Download them before resetting.','畫面最多保留 12 筆觀察，請先下載再重設。');return;}observations.push({state:{...state},summary:scene.summary,headers:scene.headers,rows:scene.rows});renderObservations();});
 query('[data-fw-export]').addEventListener('click',()=>{const text=[query('h1').textContent,t('Teacher board observations; session notes, not individual student assessment.','教師課堂觀察；屬本次課堂記錄，並非個別學生評核。'),...observations.map((observation,i)=>`${i+1}. ${observation.summary}\n${observation.headers.join(' | ')}\n${observation.rows.map((row:any[])=>row.join(' | ')).join('\n')}`)].join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const anchor=document.createElement('a');anchor.href=url;anchor.download=`chapter3-${id}-${locale}-observations.txt`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 query('[data-fw-reset]').addEventListener('click',()=>{state={...defaults};observations=[];for(const input of inputs){input.value=String(defaults[input.dataset.fwControl!]);input.removeAttribute('aria-invalid');}root.querySelectorAll<HTMLDetailsElement>('details').forEach(details=>details.open=false);query('[data-fw-error]').textContent='';renderObservations();update();setStage(0);});
 const project=query<HTMLButtonElement>('[data-fw-project]');function setProjection(on:boolean){root.classList.toggle('fw-projecting',on);document.documentElement.toggleAttribute('data-fw-projection',on);project.setAttribute('aria-pressed',String(on));project.textContent=on?t('Leave projection','退出投影'):t('Projection mode','投影模式');}
 project.addEventListener('click',()=>setProjection(!root.classList.contains('fw-projecting')));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){setProjection(false);return;}if(event.altKey||event.ctrlKey||event.metaKey||(event.target instanceof Element&&event.target.closest('input,select,textarea,details')))return;if(event.key==='ArrowRight'){event.preventDefault();setStage(stage+1);}else if(event.key==='ArrowLeft'){event.preventDefault();setStage(stage-1);}});
 root.querySelectorAll<HTMLElement>('[data-fw-print]').forEach(button=>button.addEventListener('click',()=>{document.documentElement.dataset.functionWorksheetPrint=button.dataset.fwPrint;window.print();}));
 window.addEventListener('beforeprint',()=>{document.documentElement.dataset.functionWorksheetPrint||='student';});
 window.addEventListener('afterprint',()=>{delete document.documentElement.dataset.functionWorksheetPrint;});
 update();setStage(0);
}
