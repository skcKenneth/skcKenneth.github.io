/** Reading references only: independent of every teaching/learning storage key. */
export const READING_STORAGE_KEY='kenneth-reading-list:v1';
export const READING_VERSION=1;
const ID=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ACTOR=/^[a-zA-Z0-9-]{1,80}$/;
const timestamp=value=>Number.isSafeInteger(value)&&value>=0&&value<=8640000000000000;
const validId=id=>typeof id==='string'&&id.length<=180&&ID.test(id);
export const emptyReadingState=()=>({version:READING_VERSION,records:[]});
function validRecord(record) {
  return record&&typeof record==='object'&&!Array.isArray(record)&&validId(record.id)&&typeof record.saved==='boolean'&&timestamp(record.at)&&typeof record.actor==='string'&&ACTOR.test(record.actor);
}
export function parseReadingState(raw) {
  if(!raw)return emptyReadingState();
  try {
    const data=typeof raw==='string'?JSON.parse(raw):raw;
    if(!data||data.version!==READING_VERSION||!Array.isArray(data.records)||data.records.length>20000||!data.records.every(validRecord))return emptyReadingState();
    return mergeReadingStates(emptyReadingState(),{version:READING_VERSION,records:data.records});
  }catch{return emptyReadingState();}
}
/** Tombstones survive imports and cross-tab updates, preventing stale saves from reappearing. */
export function mergeReadingStates(...states) {
  const records=new Map();
  for(const state of states)for(const candidate of state.records||[]) {
    if(!validRecord(candidate))continue;
    const previous=records.get(candidate.id);
    if(!previous||candidate.at>previous.at||candidate.at===previous.at&&(Number(!candidate.saved)>Number(!previous.saved)||candidate.saved===previous.saved&&candidate.actor>previous.actor)) {
      records.set(candidate.id,{id:candidate.id,saved:candidate.saved,at:candidate.at,actor:candidate.actor});
    }
  }
  return {version:READING_VERSION,records:[...records.values()].sort((a,b)=>a.id.localeCompare(b.id))};
}
export function setReadingArticle(state,id,saved,at=Date.now(),actor='local') {
  if(!validId(id)||typeof saved!=='boolean'||!timestamp(at)||!ACTOR.test(actor))throw new Error('Invalid reading-list operation');
  const latest=Math.max(-1,...state.records.filter(item=>item.id===id).map(item=>item.at));
  return mergeReadingStates(state,{records:[{id,saved,at:Math.max(at,latest+1),actor}]});
}
export const savedReadingArticles=state=>state.records.filter(record=>record.saved).sort((a,b)=>b.at-a.at||a.id.localeCompare(b.id));
export function exportReadingList(state) {
  return JSON.stringify({format:'kenneth-reading-list',version:READING_VERSION,items:savedReadingArticles(state).map(record=>({id:record.id,savedAt:record.at}))},null,2);
}
export function importReadingList(raw,state,knownIds,now=Date.now(),actor='import') {
  if(typeof raw!=='string'||raw.length>2000000)throw new Error('Invalid reading-list file');
  const data=JSON.parse(raw);
  if(!data||data.format!=='kenneth-reading-list'||data.version!==READING_VERSION||!Array.isArray(data.items)||data.items.length>10000)throw new Error('Unsupported reading-list file');
  if(!data.items.every(item=>item&&typeof item==='object'&&!Array.isArray(item)&&validId(item.id)&&timestamp(item.savedAt)&&Object.keys(item).every(key=>['id','savedAt'].includes(key))))throw new Error('Invalid reading-list entries');
  const allowed=new Set(knownIds),seen=new Set();let next=state,imported=0,skipped=0;
  for(const item of data.items) {
    if(seen.has(item.id))continue;seen.add(item.id);
    if(!allowed.has(item.id)){skipped++;continue;}
    next=setReadingArticle(next,item.id,true,Math.max(now,item.savedAt),actor);imported++;
  }
  return {state:next,imported,skipped};
}
