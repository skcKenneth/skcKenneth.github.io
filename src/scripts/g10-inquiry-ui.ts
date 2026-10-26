import {inquiries,evaluateInquiry,directStateForCase,directAction,directScene} from '../data/g10-inquiries.mjs';
import {SYSTEM_KEY,decodeNativeRecord} from '../lib/math-system-records.mjs';

export function initializeG10Inquiry(root:HTMLElement){
 const configNode=root.querySelector('[data-g10-config]');if(!configNode)return;
 const config=JSON.parse(configNode.textContent||'{}'),activity:any=inquiries.find(a=>a.id===config.id);if(!activity)return;
 const locale=config.locale,t=(en:string,zh:string)=>locale==='zh-Hant'?zh:en;
 const q=<T extends Element=HTMLElement>(selector:string)=>root.querySelector<T>(selector)!;
 const clone=(v:any)=>JSON.parse(JSON.stringify(v)),defaultSystem={version:1,activities:{},classroom:{title:'',ids:[]}};
 let storage:Storage|undefined;try{storage=window.localStorage;}catch{}
 const coordinator=(window as any).MathStorage,store=coordinator?.createStore({namespace:'math-system-v1',storage,defaults:{[SYSTEM_KEY]:defaultSystem},decode:decodeNativeRecord});
 let system:any=store?.snapshot()[SYSTEM_KEY]||clone(defaultSystem),saved=system.activities?.[config.noteId],lastRemoteConsent=saved?.consent===true;
 const draftKey='g10-inquiry-tab-drafts-v1';let drafts:any={};try{drafts=JSON.parse(sessionStorage.getItem(draftKey)||'{}');}catch{}
 const retained=drafts[config.noteId],newerDraft=retained&&(!saved||Number(retained.updatedAt||0)>=Number(saved.updatedAt||0));
 let note:any=clone((newerDraft?retained:saved)||{consent:false,prediction:'',observation:'',explanation:'',limitations:''}),caseIndex=0,params:any=clone(activity.cases[0].params),result:any,scene:any,selected='',revealed=false;
 let comparisons:any[]=Array.isArray(note.microComparisons)?clone(note.microComparisons).filter((row:any)=>row&&typeof row.summary==='string'&&row.params&&typeof row.params==='object'):[],pointer:any=null;
 const url=new URL(location.href);const requestedCase=Number(url.searchParams.get('case'));
 if(Number.isInteger(requestedCase)&&activity.cases[requestedCase]){caseIndex=requestedCase;params=clone(activity.cases[caseIndex].params);}
 if(url.searchParams.has('model'))try{const candidate=JSON.parse(url.searchParams.get('model')!);if(candidate&&typeof candidate==='object'&&!Array.isArray(candidate)&&JSON.stringify(candidate).length<12000){const checked:any=evaluateInquiry(activity.id,candidate,locale);if(!activity.nativeId||checked.metrics?.nativeState)params=candidate;}}catch{}
 revealed=url.searchParams.get('show')==='1';
 function writeDraft(){try{drafts[config.noteId]=note;sessionStorage.setItem(draftKey,JSON.stringify(drafts));}catch{}}
 function edit(path:string[],value:any,kind='set'){
  let base:any=system;for(const part of path)base=base?.[part];
  store?.edit({key:SYSTEM_KEY,path,kind,base,value});system=store?.snapshot()[SYSTEM_KEY]||system;
 }
 async function persist(field?:string){
  note.updatedAt=Date.now();writeDraft();if(!note.consent){q('[data-g10-save-status]').textContent=t('Draft stays in this tab. Export it before clearing browser data.','草稿暫存在本分頁，清除瀏覽器資料前可先匯出。');return;}
  const first=!system.activities?.[config.noteId]?.consent;
  edit(['activities',config.noteId],{},'seed');
  const keys=first||!field?['consent','prediction','observation','explanation','limitations']: field==='microComparisons'?[]:[field];
  for(const key of keys)edit(['activities',config.noteId,key],note[key]??'');
  const previous=system.activities?.[config.noteId]?.microComparisons||[];
  for(const record of comparisons){record.eventId||=crypto.randomUUID();if(!previous.some((row:any)=>row.eventId===record.eventId))edit(['activities',config.noteId,'microComparisons'],record,'append');}
  edit(['activities',config.noteId,'updatedAt'],Date.now(),'max');
  const outcome=await store?.flush();q('[data-g10-save-status]').textContent=outcome?.ok?t('Saved locally; included in complete backup.','已在本機保存，納入完整備份。'):t('Local saving unavailable or needs conflict review. Your draft is retained; export a copy.','本機保存未完成或有版本衝突。草稿已保留，可先匯出副本。');
 }
 function updateLink(){
  const next=new URL(location.href);next.searchParams.set('case',String(caseIndex));next.searchParams.set('show',revealed?'1':'0');
  const encoded=JSON.stringify(params);if(encoded!==JSON.stringify(activity.cases[caseIndex].params)&&encoded.length<12000)next.searchParams.set('model',encoded);else next.searchParams.delete('model');
  history.replaceState(null,'',next);
  const alternate=document.querySelector<HTMLAnchorElement>('[data-language-switch], .language-switch a');if(alternate){const other=new URL(alternate.href);other.search=next.search;alternate.href=other.href;}
 }
 function table(){
  const head=q<HTMLTableElement>('[data-g10-table]').tHead!,body=q<HTMLTableElement>('[data-g10-table]').tBodies[0];head.replaceChildren();body.replaceChildren();
  const hr=document.createElement('tr');for(const title of result.columns||[]){const th=document.createElement('th');th.scope='col';th.textContent=String(title);hr.append(th);}head.append(hr);
  for(const row of result.rows||[]){const tr=document.createElement('tr');for(const cell of row){const td=document.createElement('td');td.textContent=String(cell);tr.append(td);}body.append(tr);}
 }
 function nativeState(){return params.directState||directStateForCase(activity.id,params);}
 function act(action:any){params={...params,directState:directAction(activity.id,nativeState(),action)};update();}
 function directTools(){
  const tools=q('[data-g10-direct-tools]');tools.replaceChildren();if(!activity.nativeId||!result.metrics?.nativeState)return;
  scene=directScene(activity.id,nativeState(),locale);const svg=q<SVGSVGElement>('[data-g10-stage] svg'),NS='http://www.w3.org/2000/svg';svg.querySelectorAll('[data-direct-handle]').forEach(el=>el.remove());
  for(const handle of scene.handles||[]){const g=document.createElementNS(NS,'g');g.dataset.directHandle=handle.id;g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',handle.label);g.setAttribute('transform',`translate(${handle.x} ${handle.y})`);const card=['card','token'].includes(handle.kind),w=handle.w||(card?104:54),h=handle.h||(card?48:54),hit=document.createElementNS(NS,'rect');for(const[key,value]of Object.entries({x:-Math.max(64,w)/2,y:-Math.max(64,h)/2,width:Math.max(64,w),height:Math.max(64,h),fill:'transparent'}))hit.setAttribute(key,String(value));g.append(hit);const shape=document.createElementNS(NS,card?'rect':'circle');for(const[key,value]of Object.entries(card?{x:-w/2,y:-h/2,width:w,height:h,rx:8,fill:'#fffdf3',stroke:selected===handle.id?'#b26b35':'#166b57','stroke-width':3}:{r:18,fill:selected===handle.id?'#b26b35':'#166b57',stroke:'white','stroke-width':3}))shape.setAttribute(key,String(value));g.append(shape);const title=document.createElementNS(NS,'title');title.textContent=handle.label;g.append(title);if(card||handle.shortLabel){const label=document.createElementNS(NS,'text');label.setAttribute('x',card?'0':'25');label.setAttribute('y','7');label.setAttribute('text-anchor',card?'middle':'start');label.setAttribute('font-size','19');label.setAttribute('fill','#193f34');label.textContent=handle.shortLabel||handle.label;g.append(label);}svg.append(g);}
  const makeButton=(label:string,fn:()=>void)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);tools.append(b);return b;};
  for(const action of scene.buttons||[])makeButton(action.label,()=>act({type:'action',id:action.id}));
  for(const choice of scene.choices||[]){const label=document.createElement('label');label.textContent=choice.label;const select=document.createElement('select');select.setAttribute('aria-label',choice.label);for(const option of choice.options){const el=document.createElement('option');el.value=String(option.value);el.textContent=option.label;select.append(el);}select.value=String(choice.value);select.addEventListener('change',()=>act({type:'preset',id:choice.id,value:select.value}));label.append(select);tools.append(label);}
  if(scene.handles?.length){const label=document.createElement('label');label.textContent=t('Select an object','選取物件');const select=document.createElement('select');select.dataset.directSelect='';select.setAttribute('aria-label',t('Object to move','要移動的物件'));const empty=document.createElement('option');empty.value='';empty.textContent=t('Choose…','請選擇…');select.append(empty);for(const handle of scene.handles){const option=document.createElement('option');option.value=handle.id;option.textContent=handle.label;select.append(option);}select.value=selected;select.addEventListener('change',()=>{selected=select.value;directTools();});label.append(select);tools.append(label);
   for(const[dx,dy,label]of [[-1,0,'←'],[1,0,'→'],[0,-1,'↑'],[0,1,'↓']] as any[])makeButton(label,()=>{const h=scene.handles.find((h:any)=>h.id===selected);if(h)act({type:'drag',id:h.id,x:h.x+dx*(h.nudge?.x||12),y:h.y+dy*(h.nudge?.y||12),phase:'end'});});
   for(const zone of scene.zones||[])makeButton(t('Place: ','放到：')+zone.label,()=>{if(selected)act({type:'drag',id:selected,x:zone.x+zone.w/2,y:zone.y+zone.h/2,phase:'end',zone:zone.id});});
  }
 }
 function renderComparisons(){
  const area=q('[data-g10-comparisons]');area.replaceChildren();comparisons.slice(-12).forEach((record:any,i:number)=>{const card=document.createElement('article'),h=document.createElement('h3'),p=document.createElement('p'),button=document.createElement('button');h.textContent=t('Comparison ','對照 ')+String(Math.max(0,comparisons.length-12)+i+1);p.textContent=record.summary;button.type='button';button.textContent=t('Restore this model','重看這個設定');button.addEventListener('click',()=>{params=clone(record.params);revealed=true;update();});card.append(h,p,button);area.append(card);});
 }
 function update(){
  const focused=(document.activeElement as HTMLElement|null)?.closest<SVGElement>('[data-direct-handle]')?.dataset.directHandle;
  result=evaluateInquiry(activity.id,params,locale);q('[data-g10-stage]').innerHTML=result.svg;q('[data-g10-summary]').textContent=result.summary;table();directTools();
  if(focused)root.querySelector<SVGElement>(`[data-direct-handle="${CSS.escape(focused)}"]`)?.focus();
  q('[data-g10-model]').hidden=!revealed;root.dataset.g10Revealed=String(revealed);q('[data-g10-reveal]').textContent=revealed?t('Hide model; return to prediction','收起模型，返回預測'):t('Show model and compare','展示模型，開始比較');
  root.querySelectorAll<HTMLButtonElement>('[data-g10-case]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.g10Case)===caseIndex)));
  root.querySelectorAll<HTMLInputElement|HTMLSelectElement>('[data-g10-control]').forEach(control=>{const key=control.dataset.g10Control!;if(params[key]!==undefined)control.value=String(params[key]);q(`[data-g10-output="${key}"]`).textContent=control instanceof HTMLSelectElement?'':control.value;});
  q('[data-g10-work-state]').textContent=JSON.stringify({activityId:activity.id,params,caseIndex,metrics:result.metrics});updateLink();root.dataset.g10Ready='1';
 }
 root.addEventListener('click',event=>{
  const button=(event.target as Element).closest<HTMLButtonElement>('button');if(!button)return;
  if(button.hasAttribute('data-g10-reveal')){revealed=!revealed;update();return;}
  if(button.dataset.g10Case!==undefined){caseIndex=Number(button.dataset.g10Case);params=clone(activity.cases[caseIndex].params);revealed=true;selected='';update();return;}
  if(button.hasAttribute('data-g10-project')){const active=!root.classList.contains('g10-projecting');root.classList.toggle('g10-projecting',active);document.body.classList.toggle('g10-projection',active);button.setAttribute('aria-pressed',String(active));return;}
  if(button.hasAttribute('data-g10-capture')){comparisons.push({eventId:crypto.randomUUID(),params:clone(params),summary:result.summary,columns:result.columns,rows:result.rows,at:new Date().toISOString()});note.microComparisons=clone(comparisons);renderComparisons();void persist('microComparisons');q('[data-g10-capture-status]').textContent=t('Comparison retained. Choose another case to compare.','已保留對照，可選另一個例子比較。');return;}
  if(button.hasAttribute('data-g10-export')){const payload={format:'kenneth-g10-inquiry-notebook',version:1,id:activity.id,noteId:config.noteId,locale,params,notes:note,comparisons},objectUrl=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'})),anchor=document.createElement('a');anchor.href=objectUrl;anchor.download=`${activity.id}-${locale}-notebook.json`;anchor.click();setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);}
 });
 root.querySelectorAll<HTMLInputElement|HTMLSelectElement>('[data-g10-control]').forEach(control=>control.addEventListener(control instanceof HTMLSelectElement?'change':'input',()=>{params={...params,[control.dataset.g10Control!]:control instanceof HTMLSelectElement?control.value:Number(control.value)};delete params.directState;revealed=true;update();}));
 root.querySelectorAll<HTMLTextAreaElement>('[data-g10-note]').forEach(field=>{field.value=note[field.dataset.g10Note!]||'';field.addEventListener('input',()=>{note[field.dataset.g10Note!]=field.value;void persist(field.dataset.g10Note);});});
 q<HTMLInputElement>('[data-g10-consent]').checked=note.consent===true;q<HTMLInputElement>('[data-g10-consent]').addEventListener('change',async()=>{note.consent=q<HTMLInputElement>('[data-g10-consent]').checked;if(!note.consent&&system.activities?.[config.noteId]){edit(['activities',config.noteId],null);await store?.flush();}void persist();});
 const stage=q('[data-g10-stage]');
 function point(event:PointerEvent){const svg=stage.querySelector('svg')!,matrix=svg.getScreenCTM();return matrix?new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse()):{x:0,y:0};}
 stage.addEventListener('pointerdown',event=>{const handle=(event.target as Element).closest<SVGElement>('[data-direct-handle]');if(!handle)return;event.preventDefault();selected=handle.dataset.directHandle!;pointer={id:selected,point:point(event),pointerId:event.pointerId};stage.setPointerCapture(event.pointerId);});
 stage.addEventListener('pointerup',event=>{if(!pointer||pointer.pointerId!==event.pointerId)return;const pos=point(event),zone=scene.zones?.find((z:any)=>pos.x>=z.x&&pos.x<=z.x+z.w&&pos.y>=z.y&&pos.y<=z.y+z.h);const moved=Math.hypot(pos.x-pointer.point.x,pos.y-pointer.point.y)>4;if(moved)act({type:'drag',id:pointer.id,x:pos.x,y:pos.y,phase:'end',zone:zone?.id});else directTools();pointer=null;try{stage.releasePointerCapture(event.pointerId);}catch{}});
 stage.addEventListener('pointercancel',()=>{pointer=null;});
 stage.addEventListener('keydown',event=>{const h=(event.target as Element).closest<SVGElement>('[data-direct-handle]');if(!h||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(event.key))return;event.preventDefault();selected=h.dataset.directHandle!;const item=scene.handles.find((v:any)=>v.id===selected);if(event.key.startsWith('Arrow'))act({type:'drag',id:selected,x:item.x+(event.key==='ArrowLeft'?-1:event.key==='ArrowRight'?1:0)*(item.nudge?.x||12),y:item.y+(event.key==='ArrowUp'?-1:event.key==='ArrowDown'?1:0)*(item.nudge?.y||12),phase:'end'});else directTools();});
 store?.subscribe((state:any)=>{system=state.snapshot[SYSTEM_KEY]||system;const remote=system.activities?.[config.noteId];if(!state.pending&&!state.conflicts.length){const consent=remote?.consent===true;if(consent||lastRemoteConsent&&!consent){note.consent=consent;q<HTMLInputElement>('[data-g10-consent]').checked=consent;if(!consent){writeDraft();q('[data-g10-save-status]').textContent=t('Local saving was turned off in another view. This tab retains its draft.','另一個頁面已關閉本機保存，本分頁保留草稿。');}}lastRemoteConsent=consent;if(consent){const merged=new Map<string,any>();for(const row of [...(remote.microComparisons||[]),...comparisons])merged.set(row.eventId||JSON.stringify(row),row);comparisons=[...merged.values()];note={...note,...remote,microComparisons:clone(comparisons)};renderComparisons();for(const field of root.querySelectorAll<HTMLTextAreaElement>('[data-g10-note]'))if(document.activeElement!==field)field.value=note[field.dataset.g10Note!]||'';}}});
 (window as any).MathInquiryNotebookSnapshot=()=>({format:'kenneth-g10-inquiry-notebook',id:activity.id,noteId:config.noteId,params:clone(params),notes:clone(note),comparisons:clone(comparisons)});
 window.addEventListener('pagehide',writeDraft);renderComparisons();update();q('[data-g10-save-status]').textContent=newerDraft?t('Retained tab draft loaded. Export it or save your next edit locally.','已載入本分頁保留草稿，可先匯出或繼續編輯後保存。'):note.consent?t('Saved notebook loaded.','已載入保存筆記。'):t('Draft stays in this tab.','草稿暫存在本分頁。');
}
