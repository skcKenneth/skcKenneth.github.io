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
 if(key==='jae-math-v1'&&(value.version!==1||!object(value.answers)))throw new Error('Invalid answer store');
 if(key==='senior-math-study-v2'&&value.version!==2)throw new Error('Invalid learning store');
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
export function parseSystemBackup(raw){
 if(new TextEncoder().encode(raw).length>MAX_BACKUP_BYTES)throw new Error('Backup exceeds 16 MiB / 備份超過 16 MiB');
 const value=JSON.parse(raw.replace(/^\uFEFF/,''));
 if((value?.version===1&&object(value.answers))||(value?.version===2&&object(value.progress))){
  const old=parseBackup(value),native={'jae-math-v1':JSON.stringify(old.progress)};if(old.version===2)native['senior-math-study-v2']=JSON.stringify(old.learning);
  return {...createSystemBackup(native),legacyFormat:'senior-jae',corruptStores:[]};
 }
 if(value?.schemaVersion===1&&typeof value.lessonId==='string')return {...createSystemBackup({},[value]),legacyFormat:'workshop',corruptStores:[]};
 if(value?.schema===1&&['quadratic','probability','regression'].includes(value.lab)&&object(value.answers)&&Array.isArray(value.records)){
  // Concurrent tabs can legitimately record beyond the single-tab eight-row
  // limit. Preserve those events when importing a native notebook export.
  if(Object.values(value.answers).some(answer=>typeof answer!=='string'||answer.length>6000)||value.records.length>1000)throw new Error('Invalid laboratory notebook / 探究室筆記格式不正確');
  return {...createSystemBackup({[`math-inquiry-lab:v1:${value.lab}`]:JSON.stringify({...value,consent:value.consent===true})}),legacyFormat:'lab',requiresConsent:value.consent!==true?[`math-inquiry-lab:v1:${value.lab}`]:[],corruptStores:[]};
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
 return {...value,corruptStores};
}
export function mergeNativeBackup(key,currentRaw,incomingRaw){
 if(currentRaw===undefined||currentRaw===null)return incomingRaw;
 const current=decodeNativeRecord(key,currentRaw),incoming=decodeNativeRecord(key,incomingRaw);
 if(key==='jae-math-v1')return JSON.stringify({...incoming,...current,answers:{...incoming.answers,...current.answers}});
 if(key==='senior-math-study-v2')return JSON.stringify(mergeBackup(normalizeProgress({version:1,answers:{}}),current,{progress:normalizeProgress({version:1,answers:{}}),learning:incoming}).learning);
 if(key==='math-studio-practice-v2'){const merged={...current};for(const[id,stamp]of Object.entries(incoming))if(typeof stamp==='number'&&Number.isFinite(stamp))merged[id]=Math.max(typeof merged[id]==='number'?merged[id]:0,stamp);return JSON.stringify(merged);}
 if(key===SYSTEM_KEY)return JSON.stringify({...incoming,...current,activities:{...incoming.activities,...current.activities}});
 if(key.startsWith('math-inquiry-lab:'))return currentRaw;
 return JSON.stringify({...incoming,...current});
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
