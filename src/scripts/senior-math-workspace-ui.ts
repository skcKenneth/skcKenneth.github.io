import {loadProgress,initialProgress} from '../lib/jae-math-model.mjs';
import {loadLearning,initialLearning,createBackup,parseBackup,backupPreview,mergeBackup,classroomUrl,evidenceState} from '../lib/senior-math-learning.mjs';
import {seniorStore,seniorKeys,storageConflictPanel} from '../lib/senior-math-storage';
import {evidenceLabels} from './senior-math-study-ui';
import {initializeJaeMath} from './jae-math-ui';
const indexCache=new Map<string,Promise<any[]>>();
export function getBankIndex(base:string){if(!indexCache.has(base))indexCache.set(base,fetch(base+'bank-index.json').then(r=>{if(!r.ok)throw Error('index');return r.json();}));return indexCache.get(base)!;}
function download(body:any,name='senior-math-backup.json'){
 const url=URL.createObjectURL(new Blob([JSON.stringify(body,null,2)],{type:'application/json;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
function storageAccess(){try{return localStorage;}catch{return undefined;}}
let sessionLearning=initialLearning();
let sessionClassroomDirty=false;
export function initializeClassroomSelection(){
 if(document.documentElement.dataset.classroomSelection)return;document.documentElement.dataset.classroomSelection='true';
 document.addEventListener('click',event=>{
  const button=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-classroom-add]');if(!button)return;
  const id=button.dataset.classroomAdd!;if(!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(id)||id.length>160)return;
   const store=seniorStore(),storage=storageAccess(),loaded=storage?loadLearning(storage):{learning:sessionLearning,available:false,issue:'unavailable'};const learning=store?store.snapshot()[seniorKeys.learning]:sessionClassroomDirty||!loaded.available||loaded.issue?sessionLearning:loaded.learning;
  if(learning.classroom.ids.includes(id)){button.textContent=document.documentElement.lang.startsWith('zh')?'已在清單':'Already selected';return;}
  if(learning.classroom.ids.length>=30){button.textContent=document.documentElement.lang.startsWith('zh')?'清單已滿（30 題）':'List full (30 questions)';return;}
  learning.classroom.ids.push(id);sessionLearning=learning;
   const show=(saved:boolean)=>{sessionClassroomDirty=!saved;button.textContent=document.documentElement.lang.startsWith('zh')?(saved?'已加入課堂清單':'僅本次瀏覽，請匯出備份'):(saved?'Added to classroom list':'Session only; export a backup');};
   if(store){store.edit({key:seniorKeys.learning,path:['classroom','ids'],kind:'array-add',value:id});void store.flush().then((result:any)=>show(result.ok));}else show(false);
  document.dispatchEvent(new CustomEvent('classroom-list-change'));
 });
}
export async function initializeMathWorkspace(root:HTMLElement){
 const zh=root.dataset.locale==='zh-Hant',locale=zh?'zh-Hant':'en',base=(zh?'/zh':'')+'/teaching/senior-math/',t=(en:string,ch:string)=>zh?ch:en;
 const status=root.querySelector('[data-workspace-status]')!;let index:any[];
 try{index=await getBankIndex(base);}catch{status.textContent=t('Question index could not load. Try reloading this page.','題目索引未能載入，請重新載入此頁。');return;}
 const metadata=new Map(index.map(item=>[item.id,item]));const storage=storageAccess(),store=seniorStore();storageConflictPanel(root,store,zh);
 const load=()=>{if(store){const snapshot=store.snapshot();return {progress:snapshot[seniorKeys.progress],learning:snapshot[seniorKeys.learning]};}return {progress:storage?loadProgress(storage).progress:initialProgress(),learning:sessionClassroomDirty?sessionLearning:storage?loadLearning(storage).learning:sessionLearning};};
 if(root.dataset.mathWorkspace==='my-learning'){
  const render=()=>{
   const {progress,learning}=load();const p=storage?loadProgress(storage):{available:false,issue:'unavailable'},s=storage?loadLearning(storage):{available:false,issue:'unavailable'};
    status.textContent=store&&store.state().status!=='saved'?t('Pending or session work retained. Export a backup; resolve any tab conflicts below.','待保存或本次紀錄已保留，請匯出備份，並處理下方分頁衝突。'):p.available&&s.available&&!p.issue&&!s.issue?t('Records loaded from this browser.','已讀取此瀏覽器紀錄。'):t('Local records are unavailable or unreadable; stored bytes are preserved.','本機紀錄未能讀取；原資料已保留。');
   root.querySelectorAll('[data-learning-list]').forEach(list=>list.replaceChildren());
   const add=(key:string,id:string,extra='')=>{const list=root.querySelector(`[data-learning-list="${key}"]`)!;const li=document.createElement('li'),m=metadata.get(id),a=document.createElement('a');a.href=m?.url||base+'question-bank/';a.textContent=(m?.prompt||t('Unknown retained record: ','已保留的未知題目：')+id).slice(0,160);li.append(a,document.createTextNode(extra?' · '+extra:''));list.append(li);};
   if(progress.last.question)add('resume',progress.last.question);
   const counts:any={},ordered=Object.entries(progress.answers).sort(([a],[b])=>(learning.history[b]?.at(-1)?.at||'').localeCompare(learning.history[a]?.at(-1)?.at||''));for(const [id,record]of ordered as any){const m=metadata.get(id);if(!m){add('unknown',id);continue;}const state=evidenceState(m,record,learning);counts[state]=(counts[state]||0)+1;
    if(state==='incorrect')add('wrong',id,(learning.categories[id]||[]).join(' / '));if(learning.everWrong[id]&&['independent-correct','assisted-correct','legacy-correct'].includes(state))add('corrected',id);
   }
   root.querySelector('[data-learning-summary]')!.textContent=Object.entries(counts).map(([key,n])=>evidenceLabels[key][zh?1:0]+': '+n).join(' · ');
   for(const [id,review]of Object.entries(learning.reviews)as any){if(!review.done)add('due',id,new Date(review.dueAt).toLocaleDateString(locale)+(Date.parse(review.dueAt)<=Date.now()?t(' · due',' · 到期'):''));}
   const recent=metadata.get(progress.last.question);if(recent?.nextUrl){const li=document.createElement('li'),a=document.createElement('a');a.href=recent.nextUrl;a.textContent=recent.nextTitle;li.append(a);root.querySelector('[data-learning-list="next"]')!.append(li);}
   else{const li=document.createElement('li'),a=document.createElement('a');a.href=base+'skills/';a.textContent=t('Choose a targeted skill and its short check','選擇技能小課及短檢核');li.append(a);root.querySelector('[data-learning-list="next"]')!.append(li);}
   root.querySelectorAll('[data-learning-list]').forEach(list=>{if(!list.childElementCount){const li=document.createElement('li');li.textContent=t('No items yet.','暫未有項目。');list.append(li);}});
  };render();window.addEventListener('storage',()=>{if(store)store.refresh();else render();});window.addEventListener('pageshow',render);store?.subscribe(render);
  root.querySelector('[data-backup-download]')!.addEventListener('click',()=>{const s=load();download({...createBackup(s.progress,s.learning),...(store?{sync:store.exportRecovery()}: {})});});
  let incoming:any;
  root.querySelector<HTMLInputElement>('[data-backup-file]')!.addEventListener('change',async event=>{
   const file=(event.target as HTMLInputElement).files?.[0];if(!file)return;
   try{if(file.size>16*1024*1024)throw Error('size');incoming=parseBackup(await file.text());const local=load(),rows=backupPreview(local.progress,incoming,new Set(metadata.keys()),local.learning);
    root.querySelector<HTMLElement>('[data-backup-preview]')!.hidden=false;const list=root.querySelector('[data-backup-rows]')!;list.replaceChildren();
    root.querySelector('[data-backup-info]')!.textContent=t(`v${incoming.version}: ${rows.length} retained question records.`,`v${incoming.version}：${rows.length} 個題目紀錄。`);
    for(const row of rows){const li=document.createElement('li');li.textContent=row.id+' · '+t(({new:'New',same:'Same / additive history',conflict:'Conflict; keep local'}as any)[row.status],({new:'新增',same:'相同／合併歷史',conflict:'衝突；保留本機'}as any)[row.status])+(row.known?'':t(' · unknown record retained',' · 未知題目保留'));
     if(row.status==='conflict'){const label=document.createElement('label'),checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.dataset.importOverwrite=row.id;label.append(checkbox,document.createTextNode(t(' Overwrite this local draft and settings',' 覆蓋此題本機草稿及設定')));li.append(label);}list.append(li);
    }root.querySelector<HTMLInputElement>('[data-backup-classroom]')!.checked=false;
   }catch{incoming=undefined;root.querySelector<HTMLElement>('[data-backup-preview]')!.hidden=true;status.textContent=t('Invalid or oversized JSON backup. No data changed.','JSON 備份格式錯誤或過大，未有更改資料。');}
  });
  root.querySelector('[data-backup-apply]')!.addEventListener('click',async()=>{
   if(!incoming||!storage||!store){status.textContent=t('Saving is unavailable. No import was applied.','未能本機保存，未有套用匯入。');return;}
   const ids=new Set(Array.from(root.querySelectorAll<HTMLInputElement>('[data-import-overwrite]:checked')).map(e=>e.dataset.importOverwrite!));
   await store.flush();const backup=incoming,overwriteClassroom=root.querySelector<HTMLInputElement>('[data-backup-classroom]')!.checked;
   const result=await store.transact((fresh:any)=>{download({...createBackup(fresh[seniorKeys.progress],fresh[seniorKeys.learning]),sync:store.exportRecovery()},'senior-math-before-import.json');const merged=mergeBackup(fresh[seniorKeys.progress],fresh[seniorKeys.learning],backup,ids,overwriteClassroom);return {[seniorKeys.progress]:merged.progress,[seniorKeys.learning]:merged.learning};});
   if(result.ok){render();status.textContent=t('Imported. Earlier history merged; selected conflicts overwritten.','已匯入，歷史合併；只有所選衝突紀錄被覆蓋。');root.querySelector<HTMLElement>('[data-backup-preview]')!.hidden=true;incoming=undefined;}
   else status.textContent=t('Import could not be saved. Original work was backed up; no successful import is claimed.','匯入未能保存，原紀錄已下載備份，尚未完成匯入。');
  });
 }else{
  const query=new URLSearchParams(location.search),local=load();let ids:string[]=query.has('q')?(query.get('q')||'').split(',').filter(id=>metadata.has(id)).slice(0,30):local.learning.classroom.ids.filter((id:string)=>metadata.has(id));ids=[...new Set(ids)];
  const title=root.querySelector<HTMLInputElement>('[data-classroom-title]')!,link=root.querySelector<HTMLInputElement>('[data-classroom-link]')!;title.value=query.has('title')?(query.get('title')||'').slice(0,120):local.learning.classroom.title;
  let titleBaseline=load().learning.classroom.title,titleDirty=false,queryView=query.has('q');
  const seedSelection=()=>{if(!queryView)return;const selected=ids.slice();queryView=false;titleDirty=titleDirty||query.has('title');if(store){for(const id of selected)store.edit({key:seniorKeys.learning,path:['classroom','ids'],kind:'array-add',value:id});ids=store.snapshot()[seniorKeys.learning].classroom.ids.filter((id:string)=>metadata.has(id));}};
  const persist=()=>{const fresh=load().learning;fresh.classroom={title:title.value,ids:[...ids]};sessionLearning=fresh;
    if(store){if(titleDirty){store.edit({key:seniorKeys.learning,path:['classroom','title'],kind:'set',base:titleBaseline,value:title.value});titleBaseline=title.value;titleDirty=false;}void store.flush().then((result:any)=>{sessionClassroomDirty=!result.ok;status.textContent=result.ok?t('List saved locally. Reload to apply changes to the questions below.','清單已保存；重新載入以套用下方題目。'):t('Session or conflicting work retained. Export a backup or copy the link.','本次或衝突紀錄已保留，請匯出備份或複製連結。');});}
    else{sessionClassroomDirty=true;status.textContent=t('Session only; saving unavailable. Copy the share link.','僅本次瀏覽，未能保存；請複製分享連結。');}};
  const render=()=>{
   link.value=new URL(classroomUrl(ids,title.value,locale),location.origin).href;const list=root.querySelector('[data-classroom-list]')!;list.replaceChildren();
   ids.forEach((id,i)=>{const li=document.createElement('li'),a=document.createElement('a');a.href=metadata.get(id).url;a.textContent=metadata.get(id).prompt;li.append(a);
    for(const [text,delta]of [[t('Move up','上移'),-1],[t('Move down','下移'),1]]as const){const button=document.createElement('button');button.type='button';button.textContent=text;button.disabled=i+delta<0||i+delta>=ids.length;button.addEventListener('click',()=>{const desired=ids.slice();[desired[i],desired[i+delta]]=[desired[i+delta],desired[i]];seedSelection();if(store)store.edit({key:seniorKeys.learning,path:['classroom','ids'],kind:'array-move',value:{id,beforeId:desired[desired.indexOf(id)+1]||null}});else ids=desired;persist();render();list.querySelectorAll('li')[i+delta]?.querySelector<HTMLButtonElement>('button')?.focus();});li.append(button);}
    const remove=document.createElement('button');remove.type='button';remove.textContent=t('Remove','移除');remove.addEventListener('click',()=>{seedSelection();ids=ids.filter(value=>value!==id);store?.edit({key:seniorKeys.learning,path:['classroom','ids'],kind:'array-remove',value:id});persist();render();title.focus();});li.append(remove);list.append(li);
   });
  };render();let timer:number;title.addEventListener('input',()=>{titleDirty=true;seedSelection();render();clearTimeout(timer);timer=window.setTimeout(persist,250);});
  store?.subscribe((state:any)=>{if(queryView)return;const classroom=state.snapshot[seniorKeys.learning].classroom;if(!titleDirty){title.value=classroom.title;titleBaseline=classroom.title;}ids=classroom.ids.filter((id:string)=>metadata.has(id));render();});
  const flush=()=>{if(timer){clearTimeout(timer);timer=0;persist();}};window.addEventListener('pagehide',flush);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush();});root.addEventListener('click',event=>{if((event.target as HTMLElement).closest('a'))flush();},true);
  root.querySelector('[data-classroom-copy]')!.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(link.value);status.textContent=t('Link copied.','已複製連結。');}catch{link.select();status.textContent=t('Select and copy the link above.','請選取及複製上方連結。');}});
  root.querySelector('[data-classroom-teach]')!.addEventListener('click',()=>{clearTimeout(timer);persist();location.assign(link.value);if(location.href===link.value)location.reload();});
  if(!ids.length){status.textContent=t('Your list is empty. Add questions from the question bank or a lesson.','清單仍未有題目，請由題庫或課節加入。');return;}
  status.textContent=t('Loading only the selected questions…','正在載入所選題目…');
  const studio=document.querySelector<HTMLElement>('[data-classroom-stage] [data-jae-studio]')!,topics:any[]=[];
  const target=studio.querySelector('.jae-main')!,directory=studio.querySelector('[data-directory]')!;
  for(const id of ids){
   const fallback=document.createElement('a');fallback.href=metadata.get(id).url;fallback.textContent=metadata.get(id).prompt;root.querySelector('[data-classroom-fallback]')!.append(fallback,document.createElement('br'));
   try{const response=await fetch(metadata.get(id).url);if(!response.ok)throw Error('question');const documentPart=new DOMParser().parseFromString(await response.text(),'text/html'),data=JSON.parse(documentPart.querySelector('[data-jae-data]')!.textContent!),question=data[0].questions.find((q:any)=>q.id===id),article=documentPart.querySelector<HTMLElement>(`[data-question="${id}"]`)!,topicId='classroom-'+id;
    if(!question||!article)throw Error('question');article.dataset.questionTopic=topicId;const section=document.createElement('section');section.className='jae-topic';section.dataset.topic=topicId;section.id=topicId;section.append(article);target.append(section);
    topics.push({id:topicId,title:data[0].title,summary:data[0].summary,objectives:[],concepts:[],misconceptions:[],questions:[question]});const option=document.createElement('option');option.value=id;option.textContent=metadata.get(id).prompt.slice(0,100);directory.append(option);
   }catch{status.textContent=t('Some selected questions could not load. Use the direct links above.','部分所選題目未能載入，可使用上方題目連結。');}
  }
  studio.querySelector('[data-jae-data]')!.textContent=JSON.stringify(topics);if(topics.length){initializeJaeMath(studio);status.textContent=t(`Loaded ${topics.length} / ${ids.length} selected questions.`, `已載入 ${topics.length}／${ids.length} 題。`);}
 }
}
