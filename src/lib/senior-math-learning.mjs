import {normalizeProgress,loadProgress,STORAGE_KEY} from './jae-math-model.mjs';
export const LEARNING_KEY='senior-math-study-v2';
export const HISTORY_LIMIT=1024*1024;
export const errorCategories=['conditions','method','algebra','missing-solutions','diagram','expression'];
const safeId=id=>typeof id==='string'&&id.length<=160&&/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(id);
const bytes=value=>new TextEncoder().encode(JSON.stringify(value)).length;
const iso=value=>typeof value==='string'&&Number.isFinite(Date.parse(value))?new Date(value).toISOString():null;
const text=(value,max=10000)=>typeof value==='string'?value.slice(0,max):'';
/** @typedef {{version:number,history:Record<string,any[]>,everWrong:Record<string,boolean>,categories:Record<string,string[]>,reviews:Record<string,any>,hints:Record<string,any>,selfAssessments:Record<string,any>,classroom:{title:string,ids:string[]},updatedAt:string|null,trimmed:number}} LearningState */
/** @returns {LearningState} */
export function initialLearning(){return {version:2,history:{},everWrong:{},categories:{},reviews:{},hints:{},selfAssessments:{},classroom:{title:'',ids:[]},updatedAt:null,trimmed:0};}
export function normalizeLearning(value){
 const result=initialLearning();if(!value||value.version!==2||typeof value!=='object')return result;
 result.updatedAt=iso(value.updatedAt);result.trimmed=Number.isSafeInteger(value.trimmed)&&value.trimmed>0?value.trimmed:0;
 for(const [id,events]of Object.entries(value.history||{})){
  if(!safeId(id)||!Array.isArray(events))continue;
  const seen=new Set();result.history[id]=events.filter(e=>e&&iso(e.at)&&typeof e.eventId==='string'&&!seen.has(e.eventId)&&(seen.add(e.eventId),true)).map(e=>({
   eventId:text(e.eventId,160),at:iso(e.at),input:text(e.input,6000),notes:text(e.notes),correction:text(e.correction),
   result:['correct','incorrect','reviewed','self-assessed','self-review-pending'].includes(e.result)?e.result:'reviewed',
   hints:Number.isSafeInteger(e.hints)?Math.min(3,Math.max(0,e.hints)):0,
   categories:Array.isArray(e.categories)?e.categories.filter(c=>errorCategories.includes(c)):[],
  })).sort((a,b)=>a.at.localeCompare(b.at)).slice(-5);
 }
 for(const [id,flag]of Object.entries(value.everWrong||{}))if(safeId(id)&&flag===true)result.everWrong[id]=true;
 for(const [id,categories]of Object.entries(value.categories||{}))if(safeId(id)&&Array.isArray(categories))result.categories[id]=[...new Set(categories.filter(c=>errorCategories.includes(c)))];
 for(const [id,review]of Object.entries(value.reviews||{}))if(safeId(id)&&review&&iso(review.dueAt))result.reviews[id]={dueAt:review.dueAt,createdAt:iso(review.createdAt),done:review.done===true};
 for(const [id,hint]of Object.entries(value.hints||{}))if(safeId(id)&&hint&&Number.isInteger(hint.stage))result.hints[id]={stage:Math.min(3,Math.max(0,hint.stage)),at:iso(hint.at)};
 for(const [id,assessment]of Object.entries(value.selfAssessments||{}))if(safeId(id)&&assessment)result.selfAssessments[id]={input:text(assessment.input,6000),notes:text(assessment.notes),at:iso(assessment.at),pending:assessment.pending===true};
 result.classroom={title:text(value.classroom?.title,120),ids:[...new Set((Array.isArray(value.classroom?.ids)?value.classroom.ids:[]).filter(safeId))].slice(0,30)};
 const ordered=Object.entries(result.history).flatMap(([id,events])=>events.map(event=>({id,event}))).sort((a,b)=>a.event.at.localeCompare(b.event.at));
 let size=bytes(result.history),count=0;
 while(size>HISTORY_LIMIT&&count<ordered.length){const {id,event}=ordered[count++];size-=bytes(event)+1;result.history[id]=result.history[id].filter(e=>e.eventId!==event.eventId);if(!result.history[id].length){size-=bytes(id)+3;delete result.history[id];}result.trimmed++;}
 // The incremental estimate is conservative at empty-array boundaries.
 while(bytes(result.history)>HISTORY_LIMIT&&count<ordered.length){const {id,event}=ordered[count++];if(!result.history[id])continue;result.history[id]=result.history[id].filter(e=>e.eventId!==event.eventId);if(!result.history[id].length)delete result.history[id];result.trimmed++;}
 return result;
}
export function loadLearning(storage){
 try{const raw=storage.getItem(LEARNING_KEY);if(!raw)return {learning:initialLearning(),available:true,issue:null};const value=JSON.parse(raw);if(value?.version!==2||['history','everWrong','categories','reviews','hints','selfAssessments'].some(f=>value[f]!==undefined&&(!value[f]||typeof value[f]!=='object'||Array.isArray(value[f]))))return {learning:initialLearning(),available:true,issue:'corrupt'};return {learning:normalizeLearning(value),available:true,issue:null};}
 catch(error){return {learning:initialLearning(),available:false,issue:error instanceof SyntaxError?'corrupt':'unavailable'};}
}
export function mergeLearning(latest,current,ids=new Set(),includeClassroom=false,changedFields){
 const merged=normalizeLearning(latest),incoming=normalizeLearning(current);
 for(const id of ids){
  if(!safeId(id))continue;
  if(incoming.history[id])merged.history[id]=[...(merged.history[id]||[]),...incoming.history[id]];
  if(incoming.everWrong[id])merged.everWrong[id]=true;
  for(const field of ['categories','reviews','hints','selfAssessments'])if(incoming[field][id]&&(!changedFields||changedFields.get(id)?.has(field)))merged[field][id]=incoming[field][id];
 }
 if(includeClassroom)merged.classroom=incoming.classroom;
 merged.trimmed=Math.max(merged.trimmed,incoming.trimmed);
 return normalizeLearning(merged);
}
export function saveLearning(storage,learning,ids=new Set(),includeClassroom=false,changedFields){
 try{const loaded=loadLearning(storage);if(!loaded.available||loaded.issue)return false;const merged=mergeLearning(loaded.learning,learning,ids,includeClassroom,changedFields);merged.updatedAt=new Date().toISOString();storage.setItem(LEARNING_KEY,JSON.stringify(merged));Object.assign(learning,merged);return true;}catch{return false;}
}
export function recordLearningEvent(learning,id,record,result,at=new Date().toISOString(),eventId){
 if(!safeId(id))return;
 const event={eventId:eventId||at+'-'+Math.random().toString(36).slice(2),at,input:record.input||'',notes:record.notes||'',correction:record.correction||'',result,hints:learning.hints[id]?.stage||0,categories:learning.categories[id]||[]};
 learning.history[id]=[...(learning.history[id]||[]),event];
 if(result==='incorrect')learning.everWrong[id]=true;
 if(result==='self-assessed')learning.selfAssessments[id]={input:record.input||'',notes:record.notes||'',at,pending:false};
 if(result==='self-review-pending'&&learning.selfAssessments[id])learning.selfAssessments[id].pending=true;
 Object.assign(learning,normalizeLearning(learning));
}
export function markWrittenDraftChanged(learning,id,record){
 const assessment=learning.selfAssessments[id];
 if(record.completed||assessment&&!assessment.pending&&(assessment.input!==record.input||assessment.notes!==record.notes)){
  record.completed=false;recordLearningEvent(learning,id,record,'self-review-pending');
 }return record;
}
export function scheduleReview(learning,id,days,now=new Date()){
 if(!safeId(id)||![3,7].includes(days))return false;
 const due=new Date(now);due.setDate(due.getDate()+days);learning.reviews[id]={createdAt:now.toISOString(),dueAt:due.toISOString(),done:false};return true;
}
export function evidenceState(question,record,learning=initialLearning()){
 if(!record)return 'unattempted';
 if(!record.input&&!record.notes&&!record.correction&&!record.completed&&!record.lastResult&&!(learning.history[question.id]?.length))return 'unattempted';
 if(question.kind==='written'||question.kind==='example'){
  const assessment=learning.selfAssessments[question.id];
  return record.completed&&(!assessment||!assessment.pending&&assessment.input===record.input&&assessment.notes===record.notes)?'self-assessed':'self-review-pending';
 }
 const current=record.checkedInput===undefined||record.checkedInput===record.input;
 if(!current||!['correct','incorrect'].includes(record.lastResult))return 'pending';
 if(record.lastResult==='incorrect')return 'incorrect';
 const recent=(learning.history[question.id]||[]).filter(e=>e.result==='correct'&&e.input===record.input).at(-1);
 if(!recent)return 'legacy-correct';
 return recent.hints>0?'assisted-correct':'independent-correct';
}
export function createBackup(progress,learning,at=new Date().toISOString()){
 return {version:2,exportedAt:at,progress:normalizeProgress(progress),learning:normalizeLearning(learning)};
}
export function parseBackup(raw){
 if(typeof raw==='string'&&new TextEncoder().encode(raw).length>16*1024*1024)throw Error('Backup exceeds 16 MiB');
 const data=typeof raw==='string'?JSON.parse(raw.replace(/^\uFEFF/,'')):raw;
 const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
 const answers=value=>object(value)&&Object.values(value).every(object);
 const learning=value=>object(value)&&['history','everWrong','categories','reviews','hints','selfAssessments'].every(f=>value[f]===undefined||object(value[f]))&&(!value.history||Object.values(value.history).every(events=>Array.isArray(events)&&events.every(object)))&&(!value.categories||Object.values(value.categories).every(Array.isArray));
 if(!object(data))throw Error('Invalid backup');
 if(data.version===1&&answers(data.answers))return {version:1,progress:normalizeProgress(data),learning:initialLearning()};
 if(data.version===2&&data.progress?.version===1&&answers(data.progress.answers)&&learning(data.learning)&&data.learning.version===2)return {version:2,progress:normalizeProgress(data.progress),learning:normalizeLearning(data.learning)};
 throw Error('Unsupported backup');
}
export function backupPreview(current,incoming,knownIds=new Set(),learning=initialLearning()){
 const rows=[],ids=new Set([...Object.keys(incoming.progress.answers),...['history','everWrong','categories','reviews','hints','selfAssessments'].flatMap(f=>Object.keys(incoming.learning[f]))]);
 for(const id of ids){
  const record=incoming.progress.answers[id],existing=current.answers[id];
  const hasLocal=existing||['categories','reviews','hints','selfAssessments'].some(f=>learning[f][id]);
  const conflict=existing&&record&&JSON.stringify(existing)!==JSON.stringify(record)||['categories','reviews','hints','selfAssessments'].some(f=>incoming.learning[f][id]&&learning[f][id]&&JSON.stringify(incoming.learning[f][id])!==JSON.stringify(learning[f][id]));
  rows.push({id,status:conflict?'conflict':hasLocal?'same':'new',known:knownIds.has(id)});
 }return rows;
}
export function mergeBackup(progress,learning,incoming,overwriteIds=new Set(),overwriteClassroom=false){
 const next=normalizeProgress(progress),merged=normalizeLearning(learning),ids=new Set();
 for(const row of backupPreview(next,incoming,new Set(),merged)){
  const id=row.id,record=incoming.progress.answers[id],overwrite=overwriteIds.has(id);
  if(record&&(!next.answers[id]||overwrite)){next.answers[id]=record;ids.add(id);}
  // History and ever-wrong are additive evidence; current drafts stay local by default.
  if(incoming.learning.history[id])merged.history[id]=[...(merged.history[id]||[]),...incoming.learning.history[id]];
  if(incoming.learning.everWrong[id])merged.everWrong[id]=true;
  for(const field of ['categories','reviews','hints','selfAssessments'])if(incoming.learning[field][id]&&(!merged[field][id]||overwrite))merged[field][id]=incoming.learning[field][id];
 }
 if(!merged.classroom.ids.length||overwriteClassroom)merged.classroom=incoming.learning.classroom;
 if(!next.last.question&&incoming.progress.last.question)next.last=incoming.progress.last;
 return {progress:next,learning:normalizeLearning(merged),ids};
}
export function writeBackup(storage,current,learning,incoming,overwriteIds=new Set(),overwriteClassroom=false){
 let oldProgress,oldLearning;
 try{
  oldProgress=storage.getItem(STORAGE_KEY);oldLearning=storage.getItem(LEARNING_KEY);
  const fresh=loadProgress(storage),freshLearning=loadLearning(storage);if(!fresh.available||fresh.issue||!freshLearning.available||freshLearning.issue)throw Error('Existing storage is unreadable');
  const result=mergeBackup(fresh.progress,freshLearning.learning,incoming,overwriteIds,overwriteClassroom);
  storage.setItem(STORAGE_KEY,JSON.stringify(result.progress));storage.setItem(LEARNING_KEY,JSON.stringify(result.learning));return {ok:true,...result};
 }
 catch(error){
  try{if(oldProgress===null)storage.removeItem(STORAGE_KEY);else if(oldProgress!==undefined)storage.setItem(STORAGE_KEY,oldProgress);if(oldLearning===null)storage.removeItem(LEARNING_KEY);else if(oldLearning!==undefined)storage.setItem(LEARNING_KEY,oldLearning);}catch{/* Caller preserves and exports the in-memory original. */}
  return {ok:false,error,progress:current,learning};
 }
}
export function classroomUrl(ids,title='',locale='en'){
 const safe=[...new Set(ids.filter(safeId))].slice(0,30),params=new URLSearchParams({q:safe.join(','),title:title.slice(0,120),mode:'classroom'});
 return (locale==='zh-Hant'?'/zh':'')+'/teaching/senior-math/classroom/?'+params;
}
