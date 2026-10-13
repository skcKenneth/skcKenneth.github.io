import {SYSTEM_KEY,NATIVE_KEYS,decodeNativeRecord,readNativeRecords,readNativeRecoveryBytes,retainedRecoveryCount,collectDraftVariants,recordSummary,createSystemBackup,parseSystemBackup,previewSystemBackup,mergeNativeBackup,readWorkshopRecords,restoreWorkshopRecords,rollbackWorkshopRecords} from '../lib/math-system-records.mjs';
import {validateProgress} from '../lib/workshop-state.mjs';

type Activity={id:string;group:string;grades:string[];title:Record<string,string>;summary:Record<string,string>;topic:Record<string,string>;runtime:string;nativeId:string;sources:Record<string,string>};
export function initializeMathSystem(root:HTMLElement){
 const configuration=JSON.parse(root.querySelector('[data-system-configuration]')!.textContent||'{}');
 const locale=configuration.locale,zh=locale==='zh-Hant',t=(en:string,ch:string)=>zh?ch:en;
 const catalog=configuration.catalog as Activity[],byId=new Map(catalog.map(x=>[x.id,x])),workshops=configuration.workshops as any[];
 const query=<T extends Element=HTMLElement>(selector:string)=>root.querySelector<T>(selector)!;
 const all=<T extends Element=HTMLElement>(selector:string)=>Array.from(root.querySelectorAll<T>(selector));
 const coordinator=(window as any).MathStorage;
 const workshopFactory=()=>{try{return window.indexedDB;}catch{return undefined;}};
 let storage:Storage|undefined;try{storage=window.localStorage;}catch{/* Readable teaching remains available. */}
 const defaultSystem={version:1,activities:{},classroom:{title:'',ids:[]}};
 const systemStore=coordinator?.createStore({namespace:'math-system-v1',storage,defaults:{[SYSTEM_KEY]:defaultSystem},decode:decodeNativeRecord,normalize:(_key:string,value:any)=>value});
 let system:any=systemStore?.snapshot()[SYSTEM_KEY]||structuredClone(defaultSystem);
 let active:Activity|undefined,frame:HTMLIFrameElement|undefined,displayLimit=24,view='catalog',incoming:any,previewRaw:Record<string,string>={},workshopPreview:any[]=[];
 const sessionNotes=new Map<string,any>();
 const noteDirty=new Map<string,Set<string>>(),composingFields=new Set<string>();
 const frames=new Map<string,HTMLIFrameElement>();
 let classroom={title:'',ids:[] as string[]},classroomShared=false;
 let classroomTitleDirty=false,classroomTitleBaseline=system.classroom?.title||'';
 const text=(selector:string,value:string)=>{query(selector).textContent=value;};
 const link=(id:string)=>`${location.pathname}?activity=${encodeURIComponent(id)}`;
 const status=(message:string)=>text('[data-system-status]',message);
 function edit(path:string[],value:any,kind='set'){
  let previous:any=system;for(const part of path)previous=previous?.[part];
  if(systemStore){systemStore.edit({key:SYSTEM_KEY,path,kind,base:previous,value});system=systemStore.snapshot()[SYSTEM_KEY]||structuredClone(defaultSystem);void systemStore.flush();}
  else{let target=system;for(const part of path.slice(0,-1))target=target[part]??={};const key=path.at(-1)!,current=target[key];if(kind==='array-add')target[key]=[...new Set([...(Array.isArray(current)?current:[]),value])];else if(kind==='array-remove')target[key]=(Array.isArray(current)?current:[]).filter((id:string)=>id!==value);else if(kind==='array-move'){const ids=(Array.isArray(current)?current:[]).filter((id:string)=>id!==value.id),at=value.beforeId===null?ids.length:ids.indexOf(value.beforeId);ids.splice(at<0?ids.length:at,0,value.id);target[key]=ids;}else if(kind==='seed')target[key]=current??structuredClone(value);else if(kind==='max')target[key]=Math.max(Number(current)||0,Number(value)||0);else target[key]=value;status(t('Changes are held in this session. Download a backup before leaving.','更改暫存於本次頁面，離開前請下載備份。'));}
 }
 function download(name:string,value:string,type='application/json;charset=utf-8'){
  const url=URL.createObjectURL(new Blob([value],{type})),anchor=document.createElement('a');anchor.href=url;anchor.download=name;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 async function flushAll(){
  const results=await coordinator?.flushAll?.()||[];
  for(const item of frames.values())try{const child=item.contentWindow as any;if(child?.MathStorage&&child.MathStorage!==coordinator)results.push(...await child.MathStorage.flushAll());await child?.MathWorkshopStore?.flush?.();if(child?.MathWorkshopStore?.variants?.size&&[...child.MathWorkshopStore.variants.values()].some((v:any)=>v.length))results.push({ok:false});}catch{/* Original page can still export its own records. */}
  return results.every((result:any)=>result.ok);
 }
 async function backup(){
  // A backup is a read, including drafts. Never wait behind another tab's writer
  // lock: its original canonical bytes and the pending alternatives are separate.
  const native=storage?readNativeRecords(storage):{records:{},issues:[]};
  const result:any=createSystemBackup(native.records,[]);
  result.sessionRecovery=systemStore?.exportRecovery?.()||null;
  result.openPageRecovery=coordinator?.exportAllRecovery?.()||[];
  result.openPageDrafts=coordinator?.snapshotAll?.()||[];
  result.sessionNotes={version:1,activities:Object.fromEntries(sessionNotes)};
  result.nativeRecoveryBytes=storage?readNativeRecoveryBytes(storage):{};
  result.openActivities=[];const openFrames=new Map<HTMLIFrameElement,string>([...frames.entries()].map(([id,item])=>[item,id]));for(const item of all<HTMLIFrameElement>('iframe'))if(!openFrames.has(item))openFrames.set(item,'native-learning');
  for(const[item,id]of openFrames)try{const child=item.contentWindow as any;result.openActivities.push({id,recovery:child?.MathStorage?.exportAllRecovery?.()||[],drafts:child?.MathStorage?.snapshotAll?.()||[],workshop:child?.MathWorkshopStore?.exportRecovery?.()||null,workshopDraft:child?.MathWorkshopDraft?.(),labDraft:child?.MathInquiryNotebookSnapshot?.()});}catch{}
  if(!storage||!systemStore||systemStore.state().status!=='saved')result.sessionDraft={key:SYSTEM_KEY,value:system};
  let timer:number|undefined;result.indexedDB.records=await Promise.race([readWorkshopRecords(workshopFactory()),new Promise<any[]>(resolve=>{timer=window.setTimeout(()=>{result.workshopReadStatus='timed-out: open draft alternatives remain included';resolve([]);},750);})]);if(timer)clearTimeout(timer);
  result.draftVariants=collectDraftVariants(result);
  if(new TextEncoder().encode(JSON.stringify(result)).length>16*1024*1024)throw Error(t('Complete backup exceeds 16 MiB. Export the original activities separately before leaving.','完整備份超過 16 MiB，離開前請分別匯出原有活動。'));
  text('[data-system-backup-status]',result.workshopReadStatus?t('Backup includes saved browser records and open drafts. Saved Python records could not be read in time; retry the backup to include their canonical copies.','備份包括瀏覽器已保存紀錄及開啟中的草稿。未能及時讀取已保存 Python 紀錄，請重試備份以包含它們的正式副本。'):t('Backup includes original saved records and selectable open draft versions. Restore defaults to saved records.','備份包括原有已保存紀錄及可選的開啟草稿版本；還原預設採用已保存紀錄。'));
  return result;
 }
 function pushUrl(values:Record<string,string|null>,replace=false){
  const url=new URL(location.href);for(const[key,value]of Object.entries(values))value?url.searchParams.set(key,value):url.searchParams.delete(key);
  (replace?history.replaceState:history.pushState).call(history,{},'',url);updateLocaleLink();
 }
 function updateLocaleLink(){
  const target=document.querySelector<HTMLAnchorElement>('[data-language-switch], .language-switch a');if(!target)return;
  target.href=(zh?'/teaching/math/':'/zh/teaching/math/')+location.search;
 }
 function showPanel(name:string){
  view=name;all('[data-system-panel]').forEach(panel=>panel.hidden=panel.dataset.systemPanel!==name);
  all<HTMLAnchorElement>('[data-system-view]').forEach(anchor=>anchor.setAttribute('aria-current',anchor.dataset.systemView===name?'page':'false'));
 }
 function filterCatalog(){
  const term=query<HTMLInputElement>('[data-filter-query]').value.trim().toLocaleLowerCase(),grade=query<HTMLSelectElement>('[data-filter-grade]').value,group=query<HTMLSelectElement>('[data-filter-group]').value;
  const matches=catalog.filter(item=>(grade==='all'||item.grades.includes(grade))&&(group==='all'||item.group===group)&&(!term||[item.title.en,item.title['zh-Hant'],item.summary.en,item.summary['zh-Hant'],item.topic.en,item.topic['zh-Hant'],item.id].join(' ').toLocaleLowerCase().includes(term)));
  const visible=new Set(matches.slice(0,displayLimit).map(x=>x.id));all('[data-catalog-id]').forEach(card=>card.hidden=!visible.has(card.dataset.catalogId!));
  text('[data-catalog-count]',t(`${matches.length} matching activities · showing ${Math.min(displayLimit,matches.length)}`,`找到 ${matches.length} 項活動・顯示 ${Math.min(displayLimit,matches.length)} 項`));query('[data-catalog-more]').hidden=matches.length<=displayLimit;
 }
 function currentNotebook(){
  if(!active)return {};return sessionNotes.get(active.id)||system.activities?.[active.id]||{consent:false,prediction:'',observation:'',explanation:'',limitations:''};
 }
 function hydrateNotebook(){
  if(!active)return;const note=currentNotebook();query<HTMLInputElement>('[data-notebook-consent]').checked=note.consent===true;
  all<HTMLTextAreaElement>('[data-notebook-field]').forEach(field=>{if(document.activeElement===field&&composingFields.has(field.dataset.notebookField!))return;const value=note[field.dataset.notebookField!]||'';if(field.value!==value)field.value=value;});
  text('[data-notebook-status]',note.consent?t('These notes use local browser storage.','這份筆記已選擇使用本機瀏覽器儲存。'):t('Notes stay in this open session unless you choose to save them.','未選擇保存時，筆記只留在本次開啟頁面。'));
 }
 function notebookInput(field:string,value:any){
  if(!active)return;const id=active.id,note={...currentNotebook(),[field]:value,updatedAt:Date.now()};sessionNotes.set(id,note);const dirty=noteDirty.get(id)||new Set<string>();dirty.add(field);noteDirty.set(id,dirty);
  if(note.consent){
   const first=!system.activities?.[id]?.consent;
   edit(['activities',id],{consent:false,prediction:'',observation:'',explanation:'',limitations:'',updatedAt:0},'seed');
   if(first){edit(['activities',id,'consent'],true);for(const name of ['prediction','observation','explanation','limitations'])if(note[name]){dirty.add(name);edit(['activities',id,name],note[name]);}}
   else edit(['activities',id,field],value);
   edit(['activities',id,'updatedAt'],note.updatedAt,'max');
  }else if(field==='consent'&&system.activities?.[id])edit(['activities',id],null);
  hydrateNotebook();
 }
 function prepareFrame(loaded:HTMLIFrameElement,activity:Activity){
  let doc:Document;try{doc=loaded.contentDocument!;if(!doc?.body)throw Error();}catch{text('[data-frame-status]',t('Open the original page if your browser blocks embedded activities.','如瀏覽器阻擋內嵌活動，請使用上方原有頁面連結。'));return;}
  const sourceUrl=new URL(loaded.src,location.origin),anchor=sourceUrl.hash.slice(1);
  if(activity.runtime==='model'&&zh&&anchor&&!doc.getElementById(anchor)&&!sourceUrl.searchParams.has('runtime-fallback')){
   // Older Chinese guide routes do not contain an interactive workbench.
   const fallback=new URL(activity.sources.en,location.origin);fallback.searchParams.set('runtime-fallback','1');fallback.searchParams.set('embedded','1');loaded.src=fallback.href;
   text('[data-activity-language]',t('','此活動原有中文頁面是導覽，現載入可操作的原有模型；模型內文的語言會依已完成的翻譯顯示。'));return;
  }
  const style=doc.createElement('style');style.dataset.mathSystemEmbedded='';style.textContent='.site-header,.site-footer,body>footer,.skip-link,.math-system-embedded-hidden{display:none!important}body{margin:0!important}html{scroll-behavior:auto!important}.container{width:min(1180px,calc(100% - 1.5rem))!important}.page-head{padding-top:1rem!important}';doc.head.append(style);
  doc.documentElement.dataset.mathSystemEmbedded='true';
  if(anchor){const destination=doc.getElementById(anchor);if(destination)requestAnimationFrame(()=>destination.scrollIntoView({block:'start'}));}
  doc.addEventListener('click',event=>{
   const target=(event.target as Element).closest<HTMLElement>('[data-lesson],[data-open-lab],a[href]');if(!target)return;
   let next:Activity|undefined;
   if(target.dataset.lesson)next=byId.get(`school:lesson:${target.dataset.lesson}`);
   else if(target.dataset.openLab)next=byId.get(target.dataset.openLab==='bisector-property'?'school:inquiry:angle-bisector':`school:inquiry:${target.dataset.openLab}`);
   else if(target.tagName==='A'){
    const href=new URL((target as HTMLAnchorElement).href,location.origin);
    if(href.origin===location.origin)next=catalog.find(item=>{const other=new URL(item.sources[locale],location.origin);return other.pathname===href.pathname&&other.search===href.search&&other.hash===href.hash;});
   }
   if(next&&next.id!==active?.id){event.preventDefault();event.stopPropagation();void openActivity(next.id,true);}
  },true);
  loaded.removeAttribute('aria-busy');if(frame===loaded){query('[data-frame-mount]').setAttribute('aria-busy','false');
  text('[data-frame-status]',t('Activity loaded. Its original records are shared with the original page in this browser.','活動已載入，與此瀏覽器的原有頁面共用相同紀錄。'));}
 }
 async function openActivity(id:string,updateUrl=false){
  const selected=byId.get(id);if(!selected){status(t('This activity is not in the current catalog. Your saved records are retained.','目前目錄未有這項活動，已保存紀錄仍會保留。'));showPanel('catalog');return;}
  // Frames remain mounted, so flushing can finish in the background. Change the
  // visible notebook synchronously with the selection, including cached visits.
  void flushAll();active=selected;showPanel('activity');if(updateUrl)pushUrl({activity:id,view:null});
  document.title=selected.title[locale]+' · '+t('Mathematics Learning Space','數學互動研習室');
  text('#math-activity-title',selected.title[locale]);text('[data-activity-topic]',selected.topic[locale]);text('[data-activity-summary]',selected.summary[locale]);text('[data-activity-language]','');
  query<HTMLAnchorElement>('[data-source-link]').href=selected.sources[locale];query('[data-frame-mount]').setAttribute('aria-busy','true');text('[data-frame-status]',t('Loading the selected activity…','正在載入所選活動…'));
  const position=classroom.ids.indexOf(id);query('[data-classroom-prev]').hidden=position<=0;query('[data-classroom-next]').hidden=position<0||position===classroom.ids.length-1;
  for(const item of frames.values())item.hidden=true;
  const cached=frames.get(id);if(cached){frame=cached;frame.hidden=false;query('[data-frame-mount]').setAttribute('aria-busy','false');text('[data-frame-status]',t('Your open activity and its session drafts are retained.','已保留開啟中的活動及本次頁面的草稿。'));hydrateNotebook();return;}
  frame=document.createElement('iframe');frame.title=selected.title[locale];frame.loading='lazy';frame.allow='fullscreen; clipboard-write';frame.referrerPolicy='same-origin';frame.setAttribute('aria-busy','true');
  const href=new URL(selected.sources[locale],location.origin);href.searchParams.set('embedded','1');frame.src=href.href;
  const currentFrame=frame;frames.set(id,frame);frame.addEventListener('load',()=>prepareFrame(currentFrame,selected));query('[data-frame-mount]').append(frame);hydrateNotebook();
 }
 function seedClassroomSelection(){
  if(!classroomShared)return;
  const shared={title:classroom.title,ids:classroom.ids.slice()};classroomShared=false;
  if(shared.title){classroomTitleDirty=true;classroom.title=shared.title;}
  edit(['classroom'],{title:'',ids:[]},'seed');
  for(const id of shared.ids)edit(['classroom','ids'],id,'array-add');
  if(shared.title){classroom.title=shared.title;writeClassroomTitle(shared.title);}
  if(!systemStore)classroom.ids=Array.from(new Set([...(system.classroom?.ids||[]),...shared.ids]));
 }
 function writeClassroomTitle(value:string){
  classroomTitleDirty=true;classroom.title=value;
  if(systemStore){systemStore.edit({key:SYSTEM_KEY,path:['classroom','title'],kind:'set',base:classroomTitleBaseline,value});system=systemStore.snapshot()[SYSTEM_KEY]||system;classroomTitleBaseline=value;void systemStore.flush().then((result:any)=>{if(result.ok&&query<HTMLInputElement>('[data-system-classroom-title]').value===value)classroomTitleDirty=false;});}
  else{edit(['classroom','title'],value);classroomTitleBaseline=value;}
 }
 function persistClassroom(){if(!systemStore)classroom={title:classroom.title,ids:(system.classroom?.ids||classroom.ids).slice(0,30)};void systemStore?.flush();renderClassroom();}
 function addClassroom(id:string){
  if(!byId.has(id))return;if(classroom.ids.includes(id)){status(t('This activity is already in your classroom sequence.','這項活動已在課堂流程內。'));return;}
  if(classroom.ids.length>=30){status(t('A classroom sequence can contain up to 30 activities.','課堂流程最多 30 項活動。'));return;}
  seedClassroomSelection();edit(['classroom','ids'],id,'array-add');persistClassroom();status(t('Added to your classroom sequence.','已加入課堂流程。'));
 }
 function classroomUrl(){const url=new URL(location.pathname,location.origin);url.searchParams.set('view','classroom');if(classroom.title)url.searchParams.set('title',classroom.title);for(const id of classroom.ids)url.searchParams.append('a',id);return url.href;}
 function renderClassroom(){
  const title=query<HTMLInputElement>('[data-system-classroom-title]');if(!classroomTitleDirty&&title.value!==classroom.title)title.value=classroom.title;
  const list=query('[data-system-classroom-list]');list.replaceChildren();
  classroom.ids.forEach((id,index)=>{const item=byId.get(id);if(!item)return;const row=document.createElement('li'),anchor=document.createElement('a');anchor.href=link(id);anchor.dataset.activity=id;anchor.textContent=item.title[locale];row.append(anchor);const controls=document.createElement('div');controls.className='math-activity-actions';
   for(const[action,label]of [['up',t('Move up','上移')],['down',t('Move down','下移')],['remove',t('Remove','移除')]]){const button=document.createElement('button');button.type='button';button.dataset.classroomAction=action;button.dataset.classroomIndex=String(index);button.textContent=label;button.disabled=(action==='up'&&index===0)||(action==='down'&&index===classroom.ids.length-1);controls.append(button);}row.append(controls);list.append(row);
  });
  if(!classroom.ids.length){const row=document.createElement('li');row.textContent=t('Add an activity from the catalog or the activity toolbar.','由目錄或活動工具列加入活動。');list.append(row);}
  query<HTMLInputElement>('[data-system-classroom-link]').value=classroomUrl();
 }
 async function renderLearning(){
  const loaded:any=storage?readNativeRecords(storage):{records:{},issues:[{key:'localStorage',issue:'unavailable'}]},summary=recordSummary(loaded.records),workshop=await readWorkshopRecords(workshopFactory());
  const labels=[['answers',t('Latest answer records','最新作答紀錄')],['checked',t('Records with an answer check','帶有答案核對紀錄')],['writtenSelfAssessments',t('Current written self-assessments','目前書面自評紀錄')],['histories',t('Assessment history entries','歷次評核紀錄')],['exposures',t('Previously seen practice variants','曾抽取的練習變式')],['inquiries',t('School inquiry notebooks','中學探究筆記')],['notebooks',t('Opt-in laboratory notebooks','已選保存的探究室筆記')],['sharedNotes',t('Shared activity notebooks','共用活動筆記')]];
  const cards=query('[data-system-learning-summary]');cards.replaceChildren();
  for(const[key,name]of [...labels,['workshop',t('Python workshop drafts','Python 工坊草稿')],['modelRuns',t('Saved workshop model runs','已保存的工坊模型運行')]]){const card=document.createElement('div');card.className='math-learning-stat';const number=document.createElement('strong');number.textContent=String(key==='workshop'?workshop.length:key==='modelRuns'?workshop.filter((row:{lastRun?:unknown})=>row.lastRun).length:(summary as any)[key]);card.append(number,document.createTextNode(name));cards.append(card);}
  text('[data-system-record-status]',loaded.issues.length?t(`${loaded.issues.length} store(s) could not be read normally. Their raw bytes are preserved in exports; existing bytes are not overwritten.`,`有 ${loaded.issues.length} 個紀錄庫未能正常讀取。匯出會保留原始內容，不會覆寫原有資料。`):t('Native record stores are readable. Counts describe saved records, not learning attainment.','原有紀錄庫可以讀取。數量只描述已保存紀錄，不代表學習成效。'));
  query('[data-system-record-status]').classList.toggle('math-record-issue',!!loaded.issues.length);
  if(storage&&retainedRecoveryCount(readNativeRecoveryBytes(storage)))query('[data-system-record-status]').append(document.createTextNode(t(' Retained unsaved drafts are available in complete backup; select a version in the restore preview.',' 完整備份包含保留的未儲存草稿；可在還原預覽選擇版本。')));
  query('[data-system-raw-recovery]').hidden=!loaded.issues.some((issue:any)=>loaded.records[issue.key]);text('[data-system-raw-bytes]',loaded.issues.filter((issue:any)=>loaded.records[issue.key]).map((issue:any)=>issue.key+'\n'+loaded.records[issue.key]).join('\n\n'));
  const list=query('[data-system-saved-activities]');list.replaceChildren();
  const saved=new Set<string>(Object.entries(system.activities||{}).filter(([,note]:any)=>note?.consent).map(([id])=>id));
  for(const nativeKey of ['math-studio-inquiry-v2','math-studio-inquiry-g7-v1','math-studio-inquiry-g8-v1'])try{for(const[id,note]of Object.entries(JSON.parse(loaded.records[nativeKey]||'{}')))if(note&&typeof note==='object')saved.add(id==='bisector-property'?'school:inquiry:angle-bisector':`school:inquiry:${id}`);}catch{}
  for(const draft of workshop){const item=catalog.find(activity=>activity.runtime==='workshop'&&activity.nativeId===draft.lessonId);if(item)saved.add(item.id);}
  for(const id of ['quadratic','probability','regression'])try{if(JSON.parse(loaded.records[`math-inquiry-lab:v1:${id}`]||'{}').consent)saved.add(`lab:${id}`);}catch{}
  for(const id of saved){const item=byId.get(id),row=document.createElement('li');if(item){const anchor=document.createElement('a');anchor.href=link(id);anchor.dataset.activity=id;anchor.textContent=item.title[locale];row.append(anchor);}else row.textContent=t(`Retained record: ${id}`,`保留紀錄：${id}`);list.append(row);}
  if(!saved.size){const row=document.createElement('li');row.textContent=t('No saved activity notebooks yet.','目前未有已保存活動筆記。');list.append(row);}
 }
 async function previewImport(file:File){
  try{
   if(file.size>16*1024*1024)throw Error(t('Backup exceeds 16 MiB.','備份超過 16 MiB。'));
   incoming=parseSystemBackup(await file.text());
   for(const record of [...incoming.indexedDB.records,...incoming.draftVariants.filter((v:any)=>v.type==='workshop').map((v:any)=>v.record)]){const lesson=workshops.find(w=>w.id===record.lessonId);if(lesson)validateProgress(record,lesson);}
   previewRaw=storage?readNativeRecords(storage).records as Record<string,string>:{};workshopPreview=await readWorkshopRecords(workshopFactory());
   const list=query('[data-system-import-rows]');list.replaceChildren();
   for(const row of previewSystemBackup(previewRaw,incoming)){const li=document.createElement('li');
    if(incoming.corruptStores?.includes(row.key)){li.textContent=t(`${row.key}: unreadable raw bytes retained in the file; this store will be skipped.`,`${row.key}：檔案保留未能讀取的原始內容，還原時略過此紀錄庫。`);list.append(li);continue;}
    if(incoming.requiresConsent?.includes(row.key)){const label=document.createElement('label'),checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.dataset.importConsent=row.key;label.append(checkbox,document.createTextNode(t(` Save imported laboratory notes in this browser: ${row.key}`,` 在此瀏覽器保存匯入的探究室筆記：${row.key}`)));li.append(label);}
    else if(row.state==='conflict'){const label=document.createElement('label'),checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.dataset.importOverwrite=row.key;label.append(checkbox,document.createTextNode(t(` Replace local conflicts in ${row.key} (unchecked: merge new records and keep local conflicts)`,` 覆蓋 ${row.key} 的本機衝突（未勾選：合併新紀錄並保留本機衝突）`)));li.append(label);}else li.textContent=`${row.key} — ${row.state==='new'?t('new store','新紀錄庫'):t('identical','相同')}`;list.append(li);}
   for(const record of incoming.indexedDB.records){const existing=workshopPreview.find(row=>row.lessonId===record.lessonId),li=document.createElement('li');if(existing&&JSON.stringify(existing)!==JSON.stringify(record)){const label=document.createElement('label'),checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.dataset.importWorkshop=record.lessonId;label.append(checkbox,document.createTextNode(t(` Replace workshop draft: ${record.lessonId}`,` 覆蓋工坊草稿：${record.lessonId}`)));li.append(label);}else li.textContent=t(`Workshop ${record.lessonId}: ${existing?'identical':'new'}`,`工坊 ${record.lessonId}：${existing?'相同':'新增'}`);if(!workshops.some(w=>w.id===record.lessonId))li.append(document.createTextNode(t(' — unknown lesson; retained as data without running code',' — 未知課節；只保留資料，不執行程式')));list.append(li);}
   const groups=new Map<string,any[]>();for(const variant of incoming.draftVariants){const target=variant.type+':'+(variant.key||variant.lessonId),group=groups.get(target)||[];group.push(variant);groups.set(target,group);}
   for(const[target,variants]of groups){const li=document.createElement('li'),fieldset=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=t('Choose one version: ','選擇一個版本：')+(variants[0].key||variants[0].lessonId);fieldset.append(legend);const canonical=document.createElement('label'),keep=document.createElement('input');keep.type='radio';keep.style.cssText='display:inline-block;width:auto;margin-right:.5rem';keep.name='draft-'+target;keep.checked=true;canonical.append(keep,document.createTextNode(t(' Use saved records; keep local conflicts by default',' 採用已保存紀錄；預設保留本機衝突')));fieldset.append(canonical);
    for(const variant of variants){const label=document.createElement('label'),radio=document.createElement('input');radio.type='radio';radio.style.cssText=keep.style.cssText;radio.name=keep.name;radio.dataset.importDraft=variant.id;label.append(radio,document.createTextNode(t(' Restore draft: ',' 還原草稿：')+variant.source+' ('+variant.status+')'));fieldset.append(label);const details=document.createElement('details'),summary=document.createElement('summary'),pre=document.createElement('pre');summary.textContent=t('Inspect this draft','檢視此草稿');pre.textContent=(variant.raw||JSON.stringify(variant.record,null,2)).slice(0,12000);details.append(summary,pre);fieldset.append(details);}
    if(variants.some(v=>v.requiresConsent)){const label=document.createElement('label'),checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.dataset.importConsent=variants[0].key;label.append(checkbox,document.createTextNode(t(' Save the selected session-only laboratory notes in this browser',' 在此瀏覽器保存所選的暫存探究室筆記')));fieldset.append(label);}li.append(fieldset);list.append(li);}
   if(Object.keys(incoming.nativeRecoveryBytes||{}).length){const li=document.createElement('li');li.textContent=t('Historical recovery raw bytes are retained in this file for download and inspection. Partial snapshots and past operations are not automatically replayed.','檔案已保留歷史復原原始內容，供下載及檢視；不會自動套用局部快照或重播過往操作。');list.append(li);}
   if(incoming.sessionNotes?.activities&&Object.keys(incoming.sessionNotes.activities).length){const li=document.createElement('li');li.textContent=t('Unpersisted activity notes will be restored only in this open session. They are not automatically opted in to browser saving.','尚未保存的活動筆記只會還原到本次開啟頁面，不會自動選擇本機保存。');list.append(li);}
   query('[data-system-import-preview]').hidden=false;text('[data-system-backup-status]',t('Preview ready. Existing conflicts are kept by default.','預覽已就緒，衝突預設保留本機紀錄。'));
  }catch(error){incoming=undefined;query('[data-system-import-preview]').hidden=true;text('[data-system-backup-status]',String(error));}
 }
 async function applyImport(){
  if(!incoming||!storage||!coordinator?.restoreRaw){text('[data-system-backup-status]',t('Coordinated restore is unavailable. Download your backup and use the original activity import tools.','協調還原暫不可用，請下載備份並使用原有活動的匯入工具。'));return;}
  query<HTMLButtonElement>('[data-system-backup-apply]').disabled=true;
  if(!await flushAll()){text('[data-system-backup-status]',t('An open activity has unresolved edits. Both versions are retained. Download a complete backup, resolve the activity conflict and preview the import again.','有開啟中的活動仍有未處理更改，兩個版本均已保留。請下載完整備份、處理活動衝突，再重新預覽匯入。'));query<HTMLButtonElement>('[data-system-backup-apply]').disabled=false;return;}
  const selected=new Set(all<HTMLInputElement>('[data-import-overwrite]').filter(x=>x.checked).map(x=>x.dataset.importOverwrite!));
  const overwriteWorkshop=new Set(all<HTMLInputElement>('[data-import-workshop]').filter(x=>x.checked).map(x=>x.dataset.importWorkshop!));
  const consent=new Set(all<HTMLInputElement>('[data-import-consent]').filter(x=>x.checked).map(x=>x.dataset.importConsent!));
  const chosenDrafts=new Set(all<HTMLInputElement>('[data-import-draft]').filter(x=>x.checked).map(x=>x.dataset.importDraft!)),sources={...incoming.localStorage},workshopSources=new Map<string,any>(incoming.indexedDB.records.map((row:any)=>[row.lessonId,row])),draftKeys=new Set<string>();
  for(const variant of incoming.draftVariants)if(chosenDrafts.has(variant.id)){if(variant.type==='localStorage'){if(variant.requiresConsent&&!consent.has(variant.key))continue;sources[variant.key]=variant.raw;selected.add(variant.key);draftKeys.add(variant.key);}else{workshopSources.set(variant.lessonId,variant.record);overwriteWorkshop.add(variant.lessonId);}}
  const replacements:Record<string,string>={},expected:Record<string,string|null>={};
  for(const row of previewSystemBackup(previewRaw,{localStorage:sources})){
   if(row.state==='same'||incoming.corruptStores?.includes(row.key)&&!draftKeys.has(row.key)||(incoming.requiresConsent?.includes(row.key)&&!consent.has(row.key)))continue;
   try{let raw=sources[row.key];if(consent.has(row.key))raw=JSON.stringify({...JSON.parse(raw),consent:true});
    const merged=mergeNativeBackup(row.key,previewRaw[row.key],raw,selected.has(row.key));if(merged!==previewRaw[row.key]){replacements[row.key]=merged;expected[row.key]=previewRaw[row.key]??null;}
   }catch{if(selected.has(row.key)){replacements[row.key]=sources[row.key];expected[row.key]=previewRaw[row.key]??null;}else{text('[data-system-backup-status]',t('A local store is unreadable. Export it and explicitly select replacement before restoring.','有本機紀錄庫未能讀取。請先匯出，並明確選擇覆蓋後再還原。'));query<HTMLButtonElement>('[data-system-backup-apply]').disabled=false;return;}}
  }
  const importedWorkshop=[...workshopSources.values()].filter((row:any)=>!workshopPreview.some(old=>old.lessonId===row.lessonId)||overwriteWorkshop.has(row.lessonId));
  let idbApplied=false,rollbackFailed=false;
  try{
   const result=await coordinator.restoreRaw({storage,replacements,expected,before:async()=>{
    const currentWorkshop=await readWorkshopRecords(workshopFactory());if(JSON.stringify(currentWorkshop)!==JSON.stringify(workshopPreview))throw Error(t('Workshop drafts changed after preview. Preview the file again.','工坊草稿在預覽後已改變，請重新預覽。'));
    const fresh=readNativeRecords(storage!);download(`mathematics-before-import-${Date.now()}.json`,JSON.stringify(createSystemBackup(fresh.records,currentWorkshop),null,2));
   },applyOther:async()=>{if(importedWorkshop.length){await restoreWorkshopRecords(workshopFactory(),importedWorkshop,overwriteWorkshop);idbApplied=true;}},rollbackOther:async()=>{
    if(idbApplied){try{await rollbackWorkshopRecords(workshopFactory(),workshopPreview,importedWorkshop);}catch{rollbackFailed=true;}}
   }});
   if(!result.ok)throw Error(t(`Restore did not complete (${result.status}). Existing work is retained; the downloaded backup is available.`,`還原未完成（${result.status}），原有工作已保留，可使用已下載備份。`));
   system=systemStore?.snapshot()[SYSTEM_KEY]||system;for(const[id,note]of Object.entries(incoming.sessionNotes?.activities||{}))if(!sessionNotes.has(id))sessionNotes.set(id,{...(note as any),consent:false});incoming=undefined;query('[data-system-import-preview]').hidden=true;text('[data-system-backup-status]',t('Selected records restored. Unselected conflicts were kept.','已還原所選紀錄，未選取衝突已保留。'));await renderLearning();
  }catch(error){text('[data-system-backup-status]',String(error)+(rollbackFailed?t(' Workshop rollback was incomplete; use the downloaded pre-import backup.',' 工坊回復未完成，請使用匯入前下載的備份。'):''));}
  finally{query<HTMLButtonElement>('[data-system-backup-apply]').disabled=false;}
 }
 function readLocation(){
  const params=new URLSearchParams(location.search),id=params.get('activity');
  updateLocaleLink();
  if(id){void openActivity(id);return;}
  const nextView=params.get('view');showPanel(nextView==='classroom'||nextView==='learning'?nextView:'catalog');
  if(view==='catalog'){query<HTMLInputElement>('[data-filter-query]').value=params.get('q')||'';query<HTMLSelectElement>('[data-filter-grade]').value=params.get('grade')||'all';query<HTMLSelectElement>('[data-filter-group]').value=params.get('group')||'all';filterCatalog();}
  if(view==='classroom')renderClassroom();if(view==='learning')void renderLearning();
 }
 const initialParams=new URLSearchParams(location.search),sharedIds=initialParams.getAll('a').filter(id=>byId.has(id)).slice(0,30);
 if(sharedIds.length){classroom={title:(initialParams.get('title')||'').slice(0,120),ids:[...new Set(sharedIds)]};classroomShared=true;}else classroom={title:system.classroom?.title||'',ids:(system.classroom?.ids||[]).filter((id:string)=>byId.has(id)).slice(0,30)};
 root.addEventListener('click',event=>{
  const target=(event.target as Element).closest<HTMLElement>('button,a');if(!target)return;
  if(target.dataset.activity){event.preventDefault();void openActivity(target.dataset.activity,true);return;}
  if(target.dataset.systemView){event.preventDefault();pushUrl({activity:null,view:target.dataset.systemView==='catalog'?null:target.dataset.systemView!});readLocation();void flushAll();return;}
  if(target.dataset.addId){addClassroom(target.dataset.addId);return;}
  if(target.hasAttribute('data-add-classroom')){if(active)addClassroom(active.id);return;}
  if(target.hasAttribute('data-classroom-prev')||target.hasAttribute('data-classroom-next')){if(active){const index=classroom.ids.indexOf(active.id),next=classroom.ids[index+(target.hasAttribute('data-classroom-prev')?-1:1)];if(next)void openActivity(next,true);}return;}
  if(target.hasAttribute('data-system-project')){document.body.classList.toggle('math-system-projection');target.setAttribute('aria-pressed',String(document.body.classList.contains('math-system-projection')));return;}
  if(target.hasAttribute('data-system-print')){void flushAll().then(()=>{try{frame?.contentWindow?.print();}catch{window.print();}});return;}
  if(target.hasAttribute('data-filter-reset')){query<HTMLInputElement>('[data-filter-query]').value='';query<HTMLSelectElement>('[data-filter-grade]').value='all';query<HTMLSelectElement>('[data-filter-group]').value='all';displayLimit=24;filterCatalog();pushUrl({q:null,grade:null,group:null},true);return;}
  if(target.hasAttribute('data-catalog-more')){displayLimit+=24;filterCatalog();return;}
  if(target.hasAttribute('data-notebook-export')){if(active)download(`mathematics-${active.nativeId}-notes.json`,JSON.stringify({activityId:active.id,title:active.title[locale],createdAt:new Date().toISOString(),notes:currentNotebook()},null,2));return;}
  if(target.hasAttribute('data-notebook-capture')){try{
   const doc=frame?.contentDocument;if(!doc)throw Error();const controls=Array.from(doc.querySelectorAll<HTMLInputElement|HTMLSelectElement>('input[type=range],input[type=number],select')).slice(0,40).map(el=>({control:el.getAttribute('aria-label')||el.labels?.[0]?.textContent?.trim()||el.id,value:el.value}));
   notebookInput('observation',[currentNotebook().observation||'',t('Current controls','目前操作設定')+':\n'+JSON.stringify(controls,null,2)].filter(Boolean).join('\n\n').slice(0,6000));
  }catch{text('[data-notebook-status]',t('Control capture is unavailable. You can record observations manually.','暫時無法擷取操作設定，可自行記錄觀察。'));}return;}
  if(target.dataset.classroomAction){const index=Number(target.dataset.classroomIndex),action=target.dataset.classroomAction,id=classroom.ids[index],desired=classroom.ids.slice();if(!id)return;seedClassroomSelection();if(action==='remove')edit(['classroom','ids'],id,'array-remove');else{const other=index+(action==='up'?-1:1);if(other>=0&&other<desired.length){[desired[index],desired[other]]=[desired[other],desired[index]];edit(['classroom','ids'],{id,beforeId:desired[desired.indexOf(id)+1]||null},'array-move');}}persistClassroom();return;}
  if(target.hasAttribute('data-classroom-copy')){void navigator.clipboard?.writeText(classroomUrl()).then(()=>status(t('Classroom link copied.','已複製課堂連結。'))).catch(()=>status(t('Select and copy the classroom link above.','請選取並複製上方課堂連結。')));return;}
  if(target.hasAttribute('data-classroom-start')){if(classroom.ids[0])void openActivity(classroom.ids[0],true);return;}
  if(target.hasAttribute('data-classroom-export')){download('mathematics-classroom.json',JSON.stringify({title:classroom.title,activities:classroom.ids,url:classroomUrl()},null,2));return;}
  if(target.hasAttribute('data-open-senior-learning')){event.preventDefault();const mount=query('[data-native-learning-mount]');if(!mount.childElementCount){const learningFrame=document.createElement('iframe');learningFrame.title=t('Detailed original learning records','原有學習紀錄詳情');learningFrame.src=(target as HTMLAnchorElement).href+'?embedded=1';learningFrame.addEventListener('load',()=>{try{const doc=learningFrame.contentDocument!,style=doc.createElement('style');style.textContent='.site-header,.site-footer,.senior-hero{display:none!important}';doc.head.append(style);}catch{}});mount.append(learningFrame);}return;}
  if(target.hasAttribute('data-system-backup-download')){void backup().then(value=>download(`mathematics-backup-${Date.now()}.json`,JSON.stringify(value,null,2))).catch(error=>text('[data-system-backup-status]',String(error)));return;}
  if(target.hasAttribute('data-system-backup-apply')){void applyImport();return;}
  if(target.dataset.systemResolve){const conflict=systemStore?.conflicts().find((item:any)=>item.id===target.dataset.systemResolve);if(conflict?.path[0]==='classroom'&&conflict.path[1]==='title')classroomTitleDirty=false;if(target.dataset.systemChoice==='remote'&&conflict?.path[0]==='activities'){const id=conflict.path[1];if(conflict.path.length<=2){sessionNotes.delete(id);noteDirty.delete(id);}else noteDirty.get(id)?.delete(conflict.path[2]);}void systemStore?.resolve(target.dataset.systemResolve,target.dataset.systemChoice).then(()=>hydrateNotebook());return;}
 });
 query('[data-math-filters]').addEventListener('submit',event=>event.preventDefault());
 for(const field of all<HTMLInputElement|HTMLSelectElement>('[data-filter-query],[data-filter-grade],[data-filter-group]'))field.addEventListener('input',()=>{displayLimit=24;filterCatalog();pushUrl({q:query<HTMLInputElement>('[data-filter-query]').value||null,grade:query<HTMLSelectElement>('[data-filter-grade]').value==='all'?null:query<HTMLSelectElement>('[data-filter-grade]').value,group:query<HTMLSelectElement>('[data-filter-group]').value==='all'?null:query<HTMLSelectElement>('[data-filter-group]').value},true);});
 all<HTMLTextAreaElement>('[data-notebook-field]').forEach(field=>{field.addEventListener('input',()=>notebookInput(field.dataset.notebookField!,field.value));field.addEventListener('compositionstart',()=>composingFields.add(field.dataset.notebookField!));field.addEventListener('compositionend',()=>{composingFields.delete(field.dataset.notebookField!);notebookInput(field.dataset.notebookField!,field.value);});});
 query<HTMLInputElement>('[data-notebook-consent]').addEventListener('change',event=>notebookInput('consent',(event.target as HTMLInputElement).checked));
 query<HTMLInputElement>('[data-system-classroom-title]').addEventListener('input',event=>{const value=(event.target as HTMLInputElement).value.slice(0,120);classroomTitleDirty=true;seedClassroomSelection();writeClassroomTitle(value);persistClassroom();});
 query<HTMLInputElement>('[data-system-backup-file]').addEventListener('change',event=>{const file=(event.target as HTMLInputElement).files?.[0];if(file)void previewImport(file);});
 systemStore?.subscribe((state:any)=>{
  system=state.snapshot[SYSTEM_KEY]||structuredClone(defaultSystem);
  for(const[id,note]of sessionNotes)if(note.consent){const dirty=noteDirty.get(id)||new Set<string>(),persisted=system.activities?.[id]||{},merged={...persisted};for(const field of dirty)merged[field]=note[field];merged.consent=note.consent;merged.updatedAt=note.updatedAt;
   if(!state.pending&&!state.conflicts.some((conflict:any)=>conflict.path[0]==='activities'&&conflict.path[1]===id)){sessionNotes.delete(id);noteDirty.delete(id);}else sessionNotes.set(id,merged);
  }hydrateNotebook();
  if(!classroomShared){classroom={title:classroomTitleDirty?classroom.title:system.classroom?.title||'',ids:(system.classroom?.ids||[]).filter((id:string)=>byId.has(id)).slice(0,30)};if(!classroomTitleDirty)classroomTitleBaseline=classroom.title;if(view==='classroom')renderClassroom();}
  if(state.status==='conflict'||state.status==='external-change')status(t('Another tab changed the same notes. Both versions are retained in recovery; export a backup before resolving.','另一分頁更改了相同筆記。兩個版本已保留於復原資料，處理前請先匯出備份。'));
  else if(state.status==='session-only')status(t('Browser saving is unavailable. Keep this tab open and download a backup.','瀏覽器保存不可用，請保持分頁開啟並下載備份。'));
  const conflictPanel=query('[data-system-note-conflicts]');conflictPanel.replaceChildren();conflictPanel.hidden=!state.conflicts.length;for(const variant of state.conflicts){const row=document.createElement('article'),title=document.createElement('h4'),content=document.createElement('pre');title.textContent=t('Retained versions','保留的版本');content.textContent=variant.path.join('.')+'\n'+t('This tab: ','本分頁：')+JSON.stringify(variant.local)+'\n'+t('Other tab: ','另一分頁：')+JSON.stringify(variant.remote);row.append(title,content);if(!variant.external)for(const[choice,label]of [['local',t('Keep this tab','保留本分頁')],['remote',t('Use other version','採用另一版本')]]){const button=document.createElement('button');button.type='button';button.dataset.systemResolve=variant.id;button.dataset.systemChoice=choice;button.textContent=label;row.append(button);}conflictPanel.append(row);}
 });
 window.addEventListener('storage',event=>{if(event.key&&NATIVE_KEYS.includes(event.key)&&view==='learning')void renderLearning();});
 window.addEventListener('focus',()=>{if(view==='learning')void renderLearning();});window.addEventListener('popstate',readLocation);
 window.addEventListener('pagehide',()=>{systemStore?.checkpoint?.();});
 readLocation();
}
