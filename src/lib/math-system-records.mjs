/** Record adapters retain native keys and their different evidence meanings. */
import {parseBackup,mergeBackup} from './senior-math-learning.mjs';
import {normalizeProgress} from './jae-math-model.mjs';
export const SYSTEM_KEY='math-system-notebook-v1';
export const NATIVE_KEYS=[
 'jae-math-v1','senior-math-study-v2','math-studio-practice-v2',
 'math-studio-inquiry-v2','math-studio-inquiry-g7-v1','math-studio-inquiry-g8-v1',
 'math-inquiry-lab:v1:quadratic','math-inquiry-lab:v1:probability','math-inquiry-lab:v1:regression',SYSTEM_KEY,
];
export const WORKSHOP_DATABASE='kenneth-modeling-workshop';
export const MAX_BACKUP_BYTES=16*1024*1024;
const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
export function readNativeRecords(storage){
 const records={},issues=[];
 for(const key of NATIVE_KEYS){
  try{const raw=storage.getItem(key);if(raw===null)continue;records[key]=raw;try{decodeNativeRecord(key,raw);}catch{issues.push({key,issue:'corrupt'});}}
  catch{issues.push({key,issue:'unavailable'});}
 }
 return {records,issues};
}
export function decodeNativeRecord(key,raw){
 if(!NATIVE_KEYS.includes(key))throw new Error('Unrecognized record store');
 const value=JSON.parse(raw);
 if(!object(value))throw new Error('Record store must be an object');
 if(key==='jae-math-v1'&&(value.version!==1||!object(value.answers)||Object.values(value.answers).some(record=>!object(record))))throw new Error('Invalid answer store');
 if(key==='senior-math-study-v2'&&(value.version!==2||['history','everWrong','categories','reviews','hints','selfAssessments'].some(field=>value[field]!==undefined&&!object(value[field]))||Object.values(value.history||{}).some(rows=>!Array.isArray(rows))))throw new Error('Invalid learning store');
 if(key===SYSTEM_KEY&&(value.version!==1||!object(value.activities)||!object(value.classroom)||!Array.isArray(value.classroom.ids)))throw new Error('Invalid shared notebook');
 return value;
}
export function recordSummary(rawRecords){
 const parse=key=>{try{return JSON.parse(rawRecords[key]||'{}');}catch{return {};}};
 const answers=parse('jae-math-v1').answers||{},learning=parse('senior-math-study-v2');
 const system=parse(SYSTEM_KEY),school={...parse('math-studio-inquiry-v2'),...parse('math-studio-inquiry-g7-v1'),...parse('math-studio-inquiry-g8-v1')};
 return {
  answers:Object.keys(answers).length,
  checked:Object.values(answers).filter(r=>r&&r.lastResult).length,
  writtenSelfAssessments:Object.values(learning.selfAssessments||{}).filter(r=>r&&!r.pending).length,
  histories:Object.values(learning.history||{}).reduce((sum,rows)=>sum+(Array.isArray(rows)?rows.length:0),0),
  exposures:Object.keys(parse('math-studio-practice-v2')).length,
  inquiries:Object.values(school).filter(r=>object(r)&&(r.evidence?.length||Object.values(r).some(v=>typeof v==='string'&&v.trim()))).length,
  notebooks:['quadratic','probability','regression'].filter(id=>parse(`math-inquiry-lab:v1:${id}`).consent===true).length,
  sharedNotes:Object.values(system.activities||{}).filter(r=>r?.consent).length,
  unknown:Object.keys(answers),
 };
}
export function createSystemBackup(native,workshop=[],at=new Date().toISOString()){
 return {format:'kenneth-mathematics-backup',version:1,createdAt:at,localStorage:{...native},indexedDB:{name:WORKSHOP_DATABASE,store:'progress',records:workshop}};
}
const recoveryPrefix='math-learning-sync-v1:recovery:';
function nativeRecoveryKey(key,raw){if(typeof key!=='string'||!key.startsWith(recoveryPrefix))return false;const namespace=key.slice(recoveryPrefix.length).split(':')[0];if(namespace==='math-workshop'){try{const value=JSON.parse(raw);return value.version===1&&value.namespace==='math-workshop'&&object(value.workshopDraft)&&typeof value.workshopDraft.lessonId==='string';}catch{return false;}}if(/^(math-system-v1|math-studio(?:-[a-z0-9]+)*|math-inquiry-(quadratic|probability|regression)|senior-math(?:-[a-z0-9]+)*|jae-math(?:-[a-z0-9]+)*)$/.test(namespace))return true;try{const value=JSON.parse(raw);return Object.keys(value.snapshot||{}).some(key=>NATIVE_KEYS.includes(key))||(value.pending||[]).some(op=>NATIVE_KEYS.includes(op.key));}catch{return false;}}
export function readNativeRecoveryBytes(storage){const result={};try{for(let i=0;i<storage.length;i++){const key=storage.key(i);if(!key?.startsWith(recoveryPrefix))continue;const raw=storage.getItem(key);if(typeof raw==='string'&&nativeRecoveryKey(key,raw))result[key]=raw;}}catch{/* Canonical raw bytes and open drafts remain available. */}return result;}
export function retainedRecoveryCount(raws){let count=0;for(const raw of Object.values(raws||{}))try{const value=JSON.parse(raw);if(value.version===1&&((value.pending||[]).length||(value.conflicts||[]).length||value.namespace==='math-workshop'&&value.workshopDraft&&!value.committed))count++;}catch{}return count;}
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
/** Explicit alternatives never replace the canonical bytes in an export. */
export function validateDraftVariant(value){
 if(!object(value)||!['localStorage','workshop'].includes(value.type))throw Error('Invalid draft variant / 草稿版本格式不正確');
 const result={type:value.type,source:String(value.source||'open session').slice(0,300),status:String(value.status||'draft').slice(0,80)};
 if(value.type==='localStorage'){
  if(typeof value.raw!=='string')throw Error('Invalid draft bytes');const document=decodeNativeRecord(value.key,value.raw);
  if(value.key.startsWith('math-inquiry-lab:')){const lab=value.key.split(':').at(-1);if(document.schema!==1||document.lab!==lab||!object(document.answers)||Object.values(document.answers).some(answer=>typeof answer!=='string'||answer.length>6000)||!Array.isArray(document.records)||document.records.length>1000)throw Error('Invalid laboratory draft');}
  return {...result,key:value.key,raw:value.raw,requiresConsent:value.key.startsWith('math-inquiry-lab:')&&document.consent!==true};
 }
 if(!object(value.record)||typeof value.record.lessonId!=='string'||!value.record.lessonId||value.record.lessonId.length>200)throw Error('Invalid workshop draft');
 return {...result,lessonId:value.record.lessonId,record:clone(value.record)};
}
/** Adapts current exports and older envelopes containing raw coordinator recovery. */
export function collectDraftVariants(backup){
 const result=[],seen=new Set(),canonical=backup.localStorage||{},saved=backup.indexedDB?.records||[];
 const add=(value,strict=false)=>{try{const item=validateDraftVariant(value),bytes=item.type==='localStorage'?item.raw:JSON.stringify(item.record),target=item.key||item.lessonId,signature=item.type+'\n'+target+'\n'+bytes;if(seen.has(signature))return;
   if(item.type==='localStorage'&&canonical[item.key]===bytes||item.type==='workshop'&&saved.some(row=>row.lessonId===item.lessonId&&JSON.stringify(row)===bytes))return;
   seen.add(signature);result.push({...item,id:'draft-'+(result.length+1)});
  }catch(error){if(strict)throw error;}};
 if(backup.draftVariants!==undefined){if(!Array.isArray(backup.draftVariants))throw Error('Invalid draft alternatives');for(const item of backup.draftVariants)add(item,true);}
 const snapshots=(entries,source)=>{for(const entry of Array.isArray(entries)?entries:[]){const state=entry.state||{},snapshot=entry.snapshot||{};
   if(state.status!=='saved'||state.pending||state.conflicts?.length)for(const[key,document]of Object.entries(snapshot))if(NATIVE_KEYS.includes(key)&&document!==undefined)add({type:'localStorage',key,raw:JSON.stringify(document),source:source+' / '+(entry.namespace||key),status:state.status||'draft'});
   for(const conflict of state.conflicts||[]){const key=conflict.key;if(!NATIVE_KEYS.includes(key)||!Array.isArray(conflict.path)||conflict.path.some(part=>typeof part!=='string'||['__proto__','prototype','constructor'].includes(part)))continue;let document=clone(snapshot[key]);if(!conflict.path.length)document=clone(conflict.remote);else if(object(document)){let node=document;for(const part of conflict.path.slice(0,-1))node=node[part]??={};node[conflict.path.at(-1)]=clone(conflict.remote);}if(document!==undefined)add({type:'localStorage',key,raw:JSON.stringify(document),source:source+' / other version '+conflict.path.join('.'),status:'conflict'});}
  }};
 snapshots(backup.openPageDrafts,'workspace');snapshots(backup.activeActivityDrafts,'active activity');
 const workshop=(recovery,source)=>{for(const record of recovery?.records||[])add({type:'workshop',record,source,status:Object.keys(recovery.conflicts||{}).length?'conflict':'session'});for(const[id,conflicts]of Object.entries(recovery?.conflicts||{})){const base=recovery.records?.find(row=>row.lessonId===id);for(const conflict of Array.isArray(conflicts)?conflicts:[]){if(!base||!Array.isArray(conflict.path)||conflict.path.some(part=>typeof part!=='string'||['__proto__','prototype','constructor'].includes(part)))continue;const record=clone(base);let node=record;for(const part of conflict.path.slice(0,-1))node=node[part]??={};node[conflict.path.at(-1)]=clone(conflict.remote);add({type:'workshop',record,source:source+' / other version '+conflict.path.join('.'),status:'conflict'});}}};
 workshop(backup.activeWorkshopRecovery,'active workshop');
 for(const activity of backup.openActivities||[]){snapshots(activity.drafts,activity.id||'activity');workshop(activity.workshop,activity.id||'workshop');if(activity.workshopDraft)add({type:'workshop',record:activity.workshopDraft,source:activity.id||'workshop',status:'session'});if(activity.labDraft)add({type:'localStorage',key:'math-inquiry-lab:v1:'+activity.labDraft.lab,raw:JSON.stringify(activity.labDraft),source:activity.id||'laboratory',status:'session'});}
 if(backup.sessionDraft?.key)add({type:'localStorage',key:backup.sessionDraft.key,raw:JSON.stringify(backup.sessionDraft.value),source:'workspace',status:'session-only'});
 // A closed tab has no full live snapshot. Reconstruct only retained field
 // edits over the full canonical document; never replay counters or defaults
 // copied into a partial recovery snapshot.
 for(const bytes of Object.values(backup.nativeRecoveryBytes||{}))try{const recovery=JSON.parse(bytes);if(recovery.version===1&&recovery.namespace==='math-workshop'&&recovery.workshopDraft&&!recovery.committed){workshop({records:[recovery.workshopDraft],conflicts:recovery.conflicts||{}},'closed tab retained workshop draft');continue;}const operations=[...(recovery.pending||[]),...(recovery.conflicts||[]).filter(item=>!item.external).map(item=>({key:item.key,path:item.path,kind:'set',value:item.local}))];if(recovery.version!==1||!operations.length)continue;
  for(const key of new Set(operations.map(op=>op.key).filter(key=>NATIVE_KEYS.includes(key)))){
   let document;if(canonical[key]){try{document=decodeNativeRecord(key,canonical[key]);}catch{continue;}}
   else if(key==='jae-math-v1')document={version:1,answers:{},last:{}};
   else if(key==='senior-math-study-v2')document={version:2,history:{},everWrong:{},categories:{},reviews:{},hints:{},selfAssessments:{},classroom:{title:'',ids:[]}};
   else if(key===SYSTEM_KEY)document={version:1,activities:{},classroom:{title:'',ids:[]}};
   else if(key.startsWith('math-inquiry-lab:'))document={schema:1,lab:key.split(':').at(-1),consent:false,answers:{prediction:'',explanation:'','exit-answer':''},records:[]};else document={};
   document=clone(document);const before=JSON.stringify(document);let applied=false;
   const fill=(target,source)=>{for(const[name,value]of Object.entries(source||{})){if(['__proto__','prototype','constructor'].includes(name))continue;if(target[name]===undefined)target[name]=clone(value);else if(object(target[name])&&object(value))fill(target[name],value);}};
   for(const operation of operations.filter(op=>op.key===key)){
    const path=operation.path;if(!Array.isArray(path)||path.length>10||path.some(part=>typeof part!=='string'||['__proto__','prototype','constructor'].includes(part)))continue;
    if(operation.kind==='seed'){if(object(operation.value)){let target=document;for(const part of path){if(!object(target[part]))target[part]={};target=target[part];}fill(target,operation.value);}continue;}
    if(!path.length||!['set','append'].includes(operation.kind))continue;
    let node=document;for(const part of path.slice(0,-1)){if(!object(node[part]))node[part]={};node=node[part];}const field=path.at(-1);
    if(operation.kind==='append'){if(!object(operation.value)||typeof operation.value.eventId!=='string')continue;node[field]=unionEvents(Array.isArray(node[field])?node[field]:[],[operation.value]);}
    else if(operation.value===undefined)delete node[field];else node[field]=clone(operation.value);applied=true;
   }
   if(applied&&JSON.stringify(document)!==before)add({type:'localStorage',key,raw:JSON.stringify(document),source:'closed tab retained draft / '+(recovery.namespace||key),status:recovery.conflicts?.length?'conflict':'pending'});
  }
 }catch{/* Unsupported or corrupt recovery bytes remain download-only. */}
 return result;
}
export function parseSystemBackup(raw){
 if(new TextEncoder().encode(raw).length>MAX_BACKUP_BYTES)throw new Error('Backup exceeds 16 MiB / 備份超過 16 MiB');
 const value=JSON.parse(raw.replace(/^\uFEFF/,''));
 if((value?.version===1&&object(value.answers))||(value?.version===2&&object(value.progress))){
  const old=parseBackup(value),native={'jae-math-v1':JSON.stringify(old.progress)};if(old.version===2)native['senior-math-study-v2']=JSON.stringify(old.learning);
  return {...createSystemBackup(native),legacyFormat:'senior-jae',corruptStores:[],draftVariants:[]};
 }
 if(value?.schemaVersion===1&&typeof value.lessonId==='string')return {...createSystemBackup({},[value]),legacyFormat:'workshop',corruptStores:[],draftVariants:[]};
 if(value?.schema===1&&['quadratic','probability','regression'].includes(value.lab)&&object(value.answers)&&Array.isArray(value.records)){
  // Concurrent tabs can legitimately record beyond the single-tab eight-row
  // limit. Preserve those events when importing a native notebook export.
  if(Object.values(value.answers).some(answer=>typeof answer!=='string'||answer.length>6000)||value.records.length>1000)throw new Error('Invalid laboratory notebook / 探究室筆記格式不正確');
  return {...createSystemBackup({[`math-inquiry-lab:v1:${value.lab}`]:JSON.stringify({...value,consent:value.consent===true})}),legacyFormat:'lab',requiresConsent:value.consent!==true?[`math-inquiry-lab:v1:${value.lab}`]:[],corruptStores:[],draftVariants:[]};
 }
 if(value?.format!=='kenneth-mathematics-backup'||value.version!==1||!object(value.localStorage)||!object(value.indexedDB)||value.indexedDB.name!==WORKSHOP_DATABASE||value.indexedDB.store!=='progress'||!Array.isArray(value.indexedDB.records))throw new Error('Unsupported backup / 不支援的備份格式');
 const corruptStores=[];
 for(const [key,bytes]of Object.entries(value.localStorage)){
  if(!NATIVE_KEYS.includes(key)||typeof bytes!=='string')throw new Error('Unrecognized record store / 無法辨識的紀錄');
  // Corrupt legacy bytes remain in the envelope for recovery, but are skipped on restore.
  try{decodeNativeRecord(key,bytes);}catch{corruptStores.push(key);}
 }
 if(value.indexedDB.records.length>80||value.indexedDB.records.some(r=>!object(r)||typeof r.lessonId!=='string'))throw new Error('Invalid workshop records / 工坊紀錄格式不正確');
 if(value.sessionNotes!==undefined){
  if(value.sessionNotes?.version!==1||!object(value.sessionNotes.activities))throw new Error('Invalid session notes / 工作階段筆記格式不正確');
  for(const [id,note]of Object.entries(value.sessionNotes.activities))if(id.length>200||!object(note)||['prediction','observation','explanation','limitations'].some(field=>note[field]!==undefined&&(typeof note[field]!=='string'||note[field].length>6000)))throw new Error('Invalid session activity note / 活動草稿格式不正確');
 }
 if(value.nativeRecoveryBytes!==undefined&&(!object(value.nativeRecoveryBytes)||Object.entries(value.nativeRecoveryBytes).some(([key,raw])=>typeof raw!=='string'||!nativeRecoveryKey(key,raw))))throw Error('Invalid native recovery bytes');
 const requiresConsent=[...new Set([...(value.requiresConsent||[]),...Object.entries(value.localStorage).filter(([key,raw])=>key.startsWith('math-inquiry-lab:')&&!corruptStores.includes(key)&&JSON.parse(raw).consent!==true).map(([key])=>key)])];
 return {...value,corruptStores,requiresConsent,draftVariants:collectDraftVariants(value)};
}
function unionEvents(current=[],incoming=[]){const result=clone(current),ids=new Set(current.filter(row=>row?.eventId).map(row=>row.eventId)),counts=new Map(),visits=new Map();for(const row of current)if(!row?.eventId){const token=JSON.stringify(row);counts.set(token,(counts.get(token)||0)+1);}for(const row of incoming){if(row?.eventId){if(!ids.has(row.eventId)){result.push(clone(row));ids.add(row.eventId);}}else{const token=JSON.stringify(row),count=(visits.get(token)||0)+1;visits.set(token,count);if(count>(counts.get(token)||0))result.push(clone(row));}}return result;}
export function mergeNativeBackup(key,currentRaw,incomingRaw,overwrite=false){
 if(currentRaw===undefined||currentRaw===null)return incomingRaw;
 const current=decodeNativeRecord(key,currentRaw),incoming=decodeNativeRecord(key,incomingRaw);
 const combine=(left,right)=>overwrite?{...left,...right}:{...right,...left};
 if(key==='jae-math-v1')return JSON.stringify({...combine(current,incoming),answers:combine(current.answers,incoming.answers)});
 if(key==='senior-math-study-v2'){
  const ids=new Set(overwrite?['history','categories','reviews','hints','selfAssessments'].flatMap(field=>Object.keys(incoming[field]||{})):[]),merged=mergeBackup(normalizeProgress({version:1,answers:{}}),current,{progress:normalizeProgress({version:1,answers:{}}),learning:incoming},ids,overwrite).learning;
  for(const field of ['categories','reviews','hints','selfAssessments'])merged[field]=combine(current[field]||{},incoming[field]||{});
  merged.history={};for(const id of new Set([...Object.keys(current.history||{}),...Object.keys(incoming.history||{})]))merged.history[id]=unionEvents(current.history?.[id]||[],incoming.history?.[id]||[]);
  merged.everWrong={...current.everWrong,...incoming.everWrong};for(const[id,flag]of Object.entries(current.everWrong||{}))if(flag===true)merged.everWrong[id]=true;
  const preferred=overwrite?incoming.classroom:current.classroom,other=overwrite?current.classroom:incoming.classroom;merged.classroom={...other,...preferred,ids:[...new Set([...(preferred?.ids||[]),...(other?.ids||[])])]};return JSON.stringify({...combine(current,incoming),...merged});
 }
 if(key==='math-studio-practice-v2'){const merged={...current};for(const[id,stamp]of Object.entries(incoming))if(typeof stamp==='number'&&Number.isFinite(stamp))merged[id]=Math.max(typeof merged[id]==='number'?merged[id]:0,stamp);return JSON.stringify(merged);}
 if(key===SYSTEM_KEY){const preferred=overwrite?incoming.classroom:current.classroom,other=overwrite?current.classroom:incoming.classroom;return JSON.stringify({...combine(current,incoming),activities:combine(current.activities,incoming.activities),classroom:{...other,...preferred,ids:[...new Set([...(preferred?.ids||[]),...(other?.ids||[])])]}});}
 if(key.startsWith('math-inquiry-lab:'))return JSON.stringify({...combine(current,incoming),answers:combine(current.answers||{},incoming.answers||{}),records:unionEvents(current.records||[],incoming.records||[])});
 return JSON.stringify(combine(current,incoming));
}
export function previewSystemBackup(current,incoming){
 return Object.entries(incoming.localStorage).map(([key,raw])=>({key,state:current[key]===undefined?'new':current[key]===raw?'same':'conflict'}));
}
async function existingWorkshopDatabase(factory){
 if(!factory)return null;
 try{if(typeof factory.databases==='function'&&!(await factory.databases()).some(db=>db.name===WORKSHOP_DATABASE))return null;}catch{/* Older browsers can probe without creating a database. */}
 return new Promise(resolve=>{
  let request;try{request=factory.open(WORKSHOP_DATABASE);}catch{return resolve(null);}
  let completed=false;const done=value=>{if(completed){value?.close?.();return;}completed=true;clearTimeout(timer);resolve(value);};
  const timer=setTimeout(()=>done(null),3000);
  request.onupgradeneeded=()=>{request.transaction?.abort();};
  request.onsuccess=()=>request.result.objectStoreNames.contains('progress')?done(request.result):(request.result.close(),done(null));
  request.onerror=request.onblocked=()=>done(null);
 });
}
export async function readWorkshopRecords(factory){
 const db=await existingWorkshopDatabase(factory);if(!db)return [];
 try{return await new Promise((resolve,reject)=>{const transaction=db.transaction('progress','readonly'),request=transaction.objectStore('progress').getAll();request.onsuccess=()=>resolve(request.result||[]);request.onerror=()=>reject(request.error);});}
 catch{return [];}finally{db.close();}
}
export async function restoreWorkshopRecords(factory,records,overwriteIds=new Set()){
 if(!records.length)return {written:0,kept:0};
 if(!factory)throw new Error('Workshop storage unavailable / 工坊儲存不可用');
 const db=await new Promise((resolve,reject)=>{
  const request=factory.open(WORKSHOP_DATABASE,1);request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('progress'))request.result.createObjectStore('progress',{keyPath:'lessonId'});};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('Close other workshop tabs / 請先關閉其他工坊分頁'));
 });
 try{return await new Promise((resolve,reject)=>{
  const transaction=db.transaction('progress','readwrite'),store=transaction.objectStore('progress');let written=0,kept=0;
  for(const record of records){const lookup=store.get(record.lessonId);lookup.onsuccess=()=>{if(lookup.result&&!overwriteIds.has(record.lessonId)){kept++;return;}store.put(record);written++;};}
  transaction.oncomplete=()=>resolve({written,kept});transaction.onerror=transaction.onabort=()=>reject(transaction.error||new Error('Workshop import failed / 工坊匯入失敗'));
 });}finally{db.close();}
}
export async function rollbackWorkshopRecords(factory,previous,owned){
 const db=await existingWorkshopDatabase(factory);if(!db)throw new Error('Workshop rollback unavailable');
 try{return await new Promise((resolve,reject)=>{
  const transaction=db.transaction('progress','readwrite'),store=transaction.objectStore('progress');
  for(const imported of owned){const request=store.get(imported.lessonId);request.onsuccess=()=>{
   if(JSON.stringify(request.result)!==JSON.stringify(imported))return;
   const old=previous.find(record=>record.lessonId===imported.lessonId);if(old)store.put(old);else store.delete(imported.lessonId);
  };}
  transaction.oncomplete=()=>resolve(true);transaction.onerror=transaction.onabort=()=>reject(transaction.error||new Error('Workshop rollback failed'));
 });}finally{db.close();}
}
