export const SCHEMA_VERSION = 1;
export const MAX_IMPORT_BYTES = 8 * 1024 * 1024;
const textMap = (v) => v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length <= 80 && Object.entries(v).every(([k,s])=>!['__proto__','constructor','prototype'].includes(k) && typeof s==='string' && s.length<=100000);
export function defaults(lesson) { return Object.fromEntries(lesson.parameters.map(p=>[p.key,p.value])); }
export function freshProgress(lesson,code='') {
  return {schemaVersion:1,lessonId:lesson.id,lessonVersion:lesson.version,step:0,modelCard:{},answers:{},code,params:defaults(lesson),seed:2026,completed:[],prediction:'',reflection:'',updatedAt:new Date().toISOString()};
}
export function validateParams(params,lesson) {
  if (!params || typeof params!=='object' || Array.isArray(params)) throw new Error('Invalid parameters / 參數格式不正確');
  if (Object.keys(params).length!==lesson.parameters.length) throw new Error('Parameter set differs / 參數組合不符');
  for (const p of lesson.parameters) {
    const v=params[p.key];
    if(p.options) { if(!p.options.some(o=>o.value===v)) throw new Error(`Invalid ${p.key} / 選项不正確`); }
    else if(typeof v!=='number'||!Number.isFinite(v)||v<p.min||v>p.max||(p.step===1&&!Number.isInteger(v))) throw new Error(`Invalid ${p.key} / 數值超出範圍`);
  }
  return {...params};
}
export function validateProgress(input,lesson) {
  if(!input||input.schemaVersion!==1||input.lessonId!==lesson.id||typeof input.lessonVersion!=='string') throw new Error('Wrong lesson or unsupported file version / 單元或檔案版本不符');
  if(!Number.isInteger(input.step)||input.step<0||input.step>=lesson.steps.length) throw new Error('Invalid step / 步驟不正確');
  if(!textMap(input.modelCard)||!textMap(input.answers)||typeof input.code!=='string'||input.code.length>200000||typeof input.prediction!=='string'||typeof input.reflection!=='string'||input.prediction.length>100000||input.reflection.length>100000) throw new Error('Invalid or oversized draft / 草稿格式不正確或過大');
  if(!Number.isSafeInteger(input.seed)||input.seed<0||input.seed>2147483647||!Array.isArray(input.completed)||!input.completed.every(s=>lesson.steps.some(t=>t.id===s))) throw new Error('Invalid progress / 進度不正確');
  const p={...freshProgress(lesson),lessonVersion:input.lessonVersion,step:input.step,modelCard:{...input.modelCard},answers:{...input.answers},code:input.code,params:validateParams(input.params,lesson),seed:input.seed,completed:[...new Set(input.completed)],prediction:input.prediction,reflection:input.reflection,updatedAt:typeof input.updatedAt==='string'?input.updatedAt:new Date().toISOString()};
  if(input.lastRun) {
    const r=input.lastRun;validateResult(r.result,lesson);
    if(typeof r.code!=='string'||r.code.length>200000||typeof r.at!=='string'||!Number.isSafeInteger(r.seed)||r.seed<0||r.seed>2147483647) throw new Error('Invalid run record / 運行紀錄不正確');
    p.lastRun={result:r.result,code:r.code,params:validateParams(r.params,lesson),seed:r.seed,at:r.at,stale:!!r.stale||input.lessonVersion!==lesson.version||r.result.version!==lesson.version};
  }
  return p;
}
export function validateResult(r,lesson) {
  if(!r||r.slug!==lesson.slug||typeof r.version!=='string'||!r.metrics||typeof r.metrics!=='object'||Array.isArray(r.metrics)||Object.values(r.metrics).some(v=>typeof v!=='number'||!Number.isFinite(v))) throw new Error('Invalid experiment result / 實驗結果格式不正確');
  if(!Array.isArray(r.checks)||r.checks.length>50||!r.checks.every(c=>typeof c.en==='string'&&typeof c.zh==='string'&&typeof c.passed==='boolean')) throw new Error('Invalid checks / 檢查格式不正確');
  if(!Array.isArray(r.figures)||r.figures.length>10||!r.figures.every(f=>typeof f.en==='string'&&typeof f.zh==='string'&&typeof f.png==='string'&&f.png.length<2000000&&/^[A-Za-z0-9+/=]+$/.test(f.png))) throw new Error('Invalid figures / 圖像格式不正確');
  if(typeof r.csv!=='string'||r.csv.length>2000000) throw new Error('Invalid data export / 資料格式不正確');
  if(r.frames && (!Array.isArray(r.frames)||r.frames.length>41||!r.frames.every(g=>Array.isArray(g)&&g.length<=24&&g.every(row=>Array.isArray(row)&&row.length===g.length&&row.every(v=>v===0||v===1||v===2))))) throw new Error('Invalid animation / 動畫格式不正確');
  return r;
}
export function isRunStale(progress,lesson) {
  const r=progress.lastRun;
  return !r||r.stale||r.result.version!==lesson.version||r.code!==progress.code||r.seed!==progress.seed||JSON.stringify(r.params)!==JSON.stringify(progress.params);
}
export function exportProgress(progress) { return JSON.stringify(progress,null,2); }
export function parseImport(text,lesson) {
  if(new TextEncoder().encode(text).length>MAX_IMPORT_BYTES) throw new Error('File exceeds 8 MB / 檔案超過 8 MB');
  return validateProgress(JSON.parse(text),lesson);
}
export function pythonExport(core,progress,lesson) {
  // JSON is data, never interpolated as executable Python syntax.
  return core+'\n\nLESSON = '+JSON.stringify(lesson.slug)+'\nPARAMS = json.loads('+JSON.stringify(JSON.stringify(progress.params))+')\nSEED = '+progress.seed+'\n\n'+progress.code+'\n\nprint(json.dumps(result["metrics"], ensure_ascii=False, indent=2))\n';
}
export function notebookExport(core,progress,lesson,locale) {
  let cellIndex=0;
  const cell=(type,source)=>({id:'workshop-cell-'+(++cellIndex),cell_type:type,metadata:{},source:source.split(/(?<=\n)/),...(type==='code'?{execution_count:null,outputs:[]}:{})});
  return {nbformat:4,nbformat_minor:5,metadata:{kernelspec:{name:'python3',display_name:'Python 3',language:'python'},language_info:{name:'python'}},cells:[
    cell('markdown','# '+lesson.title[locale]+'\n\nSynthetic teaching experiment / 合成教學實驗\n\n'+reportExport(progress,lesson,locale)),
    cell('code',pythonExport(core,progress,lesson)),
    cell('code','from IPython.display import Image, display\nfor figure in result["figures"]:\n    display(Image(data=base64.b64decode(figure["png"])))\n')
  ]};
}
export function reportExport(progress,lesson,locale) {
  const zh=locale==='zh-Hant';const r=progress.lastRun;const stale=isRunStale(progress,lesson);
  return ['# '+lesson.title[locale],`${zh?'教材版本':'Lesson version'}: ${lesson.version}`,`${zh?'資料類型：合成教學實驗':'Data: synthetic teaching experiment'}`,
    `## ${zh?'模型卡':'Model card'}`, ...Object.entries(progress.modelCard).map(([k,v])=>`### ${k}\n${v}`),
    `## ${zh?'學習紀錄':'Learning responses'}`,...lesson.steps.map(s=>`### ${s.title[locale]}\n${progress.answers[s.id]||''}`),
    `## ${zh?'執行前預測':'Prediction before execution'}\n${progress.prediction}`,
    `## ${zh?'執行後反思與限制':'Reflection and limitations'}\n${progress.reflection}`,
    `## ${zh?'目前草稿設定':'Current draft settings'}\n\n\`\`\`json\n${JSON.stringify({params:progress.params,seed:progress.seed},null,2)}\n\`\`\``,
    `## ${zh?'最後完成的運行':'Last completed run'}\n${r?`${r.at}\n${stale?(zh?'過期結果：草稿或教材已改變，請重跑。':'Stale result: draft or lesson changed; rerun required.'):(zh?'結果與目前草稿相符。':'Result matches the current draft.')}\n\n\`\`\`json\n${JSON.stringify({params:r.params,seed:r.seed,version:r.result.version,metrics:r.result.metrics,checks:r.result.checks},null,2)}\n\`\`\`\n\n### ${zh?'此運行使用的程式':'Code used in this run'}\n\`\`\`python\n${r.code}\n\`\`\``:(zh?'尚未執行':'Not executed')}`,
    `## ${zh?'參考資料':'References'}`,...lesson.references.map(s=>`${s.book}; ${s.chapter}; PDF ${s.pdfPages}; ${zh?'印刷頁':'printed pages'} ${s.printedPages}.`),
    zh?'\n自動檢查僅核證指定性質；研究判斷由學生依評量準則審核。':'\nAutomated checks verify specified properties; research judgments require the rubric.'
  ].join('\n\n');
}
const cloneDraft=value=>value===undefined?undefined:structuredClone(value);
const sameDraft=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const plainDraft=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
/** Three-way draft merge. A completed run is an atomic evidence record. */
export function mergeWorkshopDraft(base,incoming,latest){
 latest=latest??base??{};
 const document=cloneDraft(latest||{}),localView=cloneDraft(latest||{}),conflicts=[],accepted=[];
 const assign=(target,path,value)=>{let node=target;for(const key of path.slice(0,-1))node=node[key]??={};if(value===undefined)delete node[path.at(-1)];else node[path.at(-1)]=cloneDraft(value);};
 const walk=(before,next,current,path)=>{
  if(sameDraft(before,next))return;
  if(path.at(-1)==='updatedAt')return;
  if(path.length===1&&path[0]==='completed'&&Array.isArray(next)){
   const previous=new Set(Array.isArray(before)?before:[]),wanted=new Set(next),merged=new Set(Array.isArray(current)?current:[]);
   for(const id of wanted)if(!previous.has(id))merged.add(id);for(const id of previous)if(!wanted.has(id))merged.delete(id);
   assign(document,path,[...merged]);assign(localView,path,[...merged]);accepted.push(path);return;
  }
  if(path[0]!=='lastRun'&&plainDraft(next)&&(plainDraft(before)||before===undefined)&&(plainDraft(current)||current===undefined)){
   for(const key of new Set([...Object.keys(before||{}),...Object.keys(next)]))if(!['__proto__','prototype','constructor'].includes(key))walk(before?.[key],next[key],current?.[key],[...path,key]);return;
  }
  if(sameDraft(current,before)||sameDraft(current,next)){assign(document,path,next);assign(localView,path,next);accepted.push(path);}
  else{conflicts.push({path,base:cloneDraft(before),local:cloneDraft(next),remote:cloneDraft(current)});assign(localView,path,next);}
 };
 for(const key of new Set([...Object.keys(base||{}),...Object.keys(incoming||{})]))if(!['__proto__','prototype','constructor'].includes(key))walk(base?.[key],incoming?.[key],latest?.[key],[key]);
 if(incoming?.updatedAt){document.updatedAt=incoming.updatedAt;localView.updatedAt=incoming.updatedAt;}
 return {document,localView,conflicts,accepted};
}
export class ProgressStore {
  constructor(factory) {try{this.factory=arguments.length&&factory!==undefined?factory:globalThis.indexedDB;}catch{this.factory=undefined;}this.memory=new Map();this.baselines=new Map();this.inputs=new Map();this.variants=new Map();this.lessons=new Map();this.blocked=new Set();this.listeners=new Set();this.queue=Promise.resolve();this.db=null;this.persistent=false;this.channel=null;}
  registerLesson(lesson,initial){this.lessons.set(lesson.id,lesson);if(!this.baselines.has(lesson.id))this.baselines.set(lesson.id,cloneDraft(initial||freshProgress(lesson)));}
  subscribe(listener){this.listeners.add(listener);return()=>this.listeners.delete(listener);}
  notify(id,source,input){const state={lessonId:id,source,input:cloneDraft(input),progress:cloneDraft(this.memory.get(id)),conflicts:cloneDraft(this.variants.get(id)||[]),persistent:this.persistent};for(const listener of this.listeners)listener(state);}
  exportRecovery(){return {format:'kenneth-workshop-session',version:1,records:[...this.memory.values()].map(cloneDraft),conflicts:Object.fromEntries(this.variants),blocked:[...this.blocked]};}
  flush(){return this.queue;}
  async open() {
    if(!this.factory)return false;
    try {this.db=await new Promise((resolve,reject)=>{const req=this.factory.open('kenneth-modeling-workshop',1);const timer=setTimeout(()=>reject(new Error('Storage timed out')),3000);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('progress'))req.result.createObjectStore('progress',{keyPath:'lessonId'});};req.onsuccess=()=>{clearTimeout(timer);resolve(req.result);};req.onerror=()=>{clearTimeout(timer);reject(req.error);};req.onblocked=()=>{clearTimeout(timer);reject(new Error('Storage blocked'));};});this.persistent=true;
      if(typeof window!=='undefined'&&typeof BroadcastChannel!=='undefined'){this.channel=new BroadcastChannel('kenneth-modeling-workshop:v1');this.channel.onmessage=event=>{if(typeof event.data?.lessonId==='string')void this.refresh(event.data.lessonId);};}
      return true;}catch{this.persistent=false;return false;}
  }
  async get(id) {
    if(!this.persistent)return this.memory.get(id);
    try{const record=await new Promise((resolve,reject)=>{const req=this.db.transaction('progress','readonly').objectStore('progress').get(id);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});if(record){const lesson=this.lessons.get(id);try{if(lesson)validateProgress(record,lesson);}catch{this.blocked.add(id);}this.memory.set(id,cloneDraft(record));this.baselines.set(id,cloneDraft(record));this.inputs.set(id,cloneDraft(record));}return record;}catch{this.persistent=false;return this.memory.get(id);}
  }
  async put(progress,displayBaseline) {
    const snapshot=cloneDraft(progress),id=snapshot.lessonId;this.memory.set(id,snapshot);
    const task=this.queue.then(async()=>{
     if(!this.persistent||this.blocked.has(id)){this.notify(id,'local',snapshot);return false;}
     const work=async()=>{
      const base=cloneDraft(displayBaseline||this.baselines.get(id)||{});
      // A displayed conflicting value is still unaccepted. Preserve its original
      // baseline until resolution, even when a later edit changes another field.
      for(const conflict of this.variants.get(id)||[]){let node=base;for(const part of conflict.path.slice(0,-1))node=node[part]??={};if(conflict.base===undefined)delete node[conflict.path.at(-1)];else node[conflict.path.at(-1)]=cloneDraft(conflict.base);}
      const merged=await new Promise((resolve,reject)=>{const tx=this.db.transaction('progress','readwrite'),store=tx.objectStore('progress'),request=store.get(id);let result;
       request.onsuccess=()=>{try{const latest=request.result,lesson=this.lessons.get(id);if(latest&&lesson)validateProgress(latest,lesson);result=mergeWorkshopDraft(base,snapshot,latest);if(lesson)validateProgress(result.document,lesson);store.put(result.document);}catch(error){this.blocked.add(id);tx.abort();reject(error);}};
       tx.oncomplete=()=>resolve(result);tx.onerror=tx.onabort=()=>reject(tx.error||new Error('Workshop write aborted'));
      });
      this.memory.set(id,merged.localView);this.inputs.set(id,snapshot);this.variants.set(id,merged.conflicts);
      // Keep the original baseline for a conflicting field; unrelated changes advance.
      const nextBase=cloneDraft(snapshot);for(const conflict of merged.conflicts){let node=nextBase;for(const part of conflict.path.slice(0,-1))node=node[part]??={};if(conflict.base===undefined)delete node[conflict.path.at(-1)];else node[conflict.path.at(-1)]=cloneDraft(conflict.base);}
      this.baselines.set(id,nextBase);this.channel?.postMessage({lessonId:id});this.notify(id,'local',snapshot);return merged.conflicts.length===0;
     };
     try{const locks=globalThis.navigator?.locks;if(typeof window!=='undefined'&&(!locks||typeof locks.request!=='function')){this.notify(id,'local',snapshot);return false;}return locks?.request?await locks.request(globalThis.MathStorage?.lockName||'math-learning:writer:v1',work):await work();}
     catch{this.persistent=false;this.memory.set(id,snapshot);this.notify(id,'local',snapshot);return false;}
    });this.queue=task.catch(()=>false);return task;
  }
  async refresh(id){
   if(!this.persistent||!this.memory.has(id)||this.blocked.has(id))return;
   await this.queue;
   try{const latest=await new Promise((resolve,reject)=>{const request=this.db.transaction('progress','readonly').objectStore('progress').get(id);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});if(!latest)return;const lesson=this.lessons.get(id);if(lesson)validateProgress(latest,lesson);const previous=this.memory.get(id),local=this.inputs.get(id)||previous,base=this.baselines.get(id)||local,merged=mergeWorkshopDraft(base,local,latest);this.memory.set(id,merged.localView);this.variants.set(id,merged.conflicts);this.notify(id,'remote',previous);}catch{this.blocked.add(id);this.notify(id,'remote');}
  }
  async resolve(id,choice){
   const variants=this.variants.get(id)||[];if(!variants.length)return true;
   const local=cloneDraft(this.memory.get(id));const canonical=await new Promise((resolve,reject)=>{const request=this.db.transaction('progress','readonly').objectStore('progress').get(id);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
   this.baselines.set(id,cloneDraft(canonical));this.variants.delete(id);if(choice==='remote'){this.memory.set(id,canonical);this.inputs.set(id,cloneDraft(canonical));this.notify(id,'resolved-remote',local);return true;}return this.put(local);
  }
  dispose(){this.channel?.close();this.db?.close();this.listeners.clear();}
}
