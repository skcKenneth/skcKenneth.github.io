import {initialProgress,loadProgress,normalizeProgress,STORAGE_KEY} from './jae-math-model.mjs';
import {initialLearning,loadLearning,normalizeLearning,LEARNING_KEY} from './senior-math-learning.mjs';

let shared:any,sharedHost:any;
/** The old pure loaders remain available for legacy backups and non-browser tests. */
export function seniorStore():any {
  const coordinator=(globalThis as any).window?.MathStorage||(globalThis as any).MathStorage;
  if(!coordinator)return null;
  let storage:Storage|undefined;try{storage=window.localStorage;}catch{}
  if(shared&&sharedHost===window&&shared.storage===storage)return shared;
  shared=coordinator.createStore({namespace:'senior-math',storage,defaults:{[STORAGE_KEY]:initialProgress(),[LEARNING_KEY]:initialLearning()},
    decode(key:string,raw:string){const loaded:any=key===STORAGE_KEY?loadProgress({getItem:()=>raw}):loadLearning({getItem:()=>raw});if(loaded.issue)throw Error('Unreadable earlier mathematics records');return key===STORAGE_KEY?loaded.progress:loaded.learning;},
    normalize(key:string,value:any){return key===STORAGE_KEY?normalizeProgress(value):normalizeLearning(value);}});
  sharedHost=window;return shared;
}
export const seniorKeys={progress:STORAGE_KEY,learning:LEARNING_KEY};
export function seniorBackupRecovery(){return seniorStore()?.exportRecovery();}

/** One shared, accessible conflict panel. Both versions also remain in the JSON export. */
export function storageConflictPanel(root:HTMLElement,store:any,zh:boolean){
  if(!store||root.querySelector('[data-storage-conflicts]'))return;
  const panel=document.createElement('section');panel.dataset.storageConflicts='true';panel.setAttribute('aria-live','polite');panel.hidden=true;root.append(panel);
  const render=(state:any)=>{const recoverable=store.recoveries().filter((r:any)=>r.writer!==store.writer&&(r.pending?.length||r.conflicts?.length));panel.replaceChildren();panel.hidden=!state.conflicts.length&&state.status!=='external-change'&&!recoverable.length;if(panel.hidden)return;
    const heading=document.createElement('h3');heading.textContent=zh?'多分頁紀錄需要選擇':'Choose between tab versions';panel.append(heading);
    const info=document.createElement('p');info.textContent=zh?'兩個版本均已保留；匯出備份亦包含衝突版本。':'Both versions are retained and included in the JSON backup.';panel.append(info);
    for(const recovery of recoverable){const p=document.createElement('p');p.textContent=(zh?'另一次瀏覽有未完成保存的紀錄：':'An earlier visit has recoverable unsaved work: ')+recovery.at;const button=document.createElement('button');button.type='button';button.textContent=zh?'下載可還原備份，再到「我的學習」預覽匯入':'Download recovery backup, then preview it in My learning';button.addEventListener('click',()=>{const snapshot=recovery.snapshot,body={version:2,exportedAt:new Date().toISOString(),progress:snapshot[STORAGE_KEY]||initialProgress(),learning:snapshot[LEARNING_KEY]||initialLearning(),sync:{recovery}},url=URL.createObjectURL(new Blob([JSON.stringify(body,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='senior-math-recoverable-work.json';a.hidden=true;document.body.append(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),10000);});panel.append(p,button);}
    for(const conflict of state.conflicts){if(conflict.external)continue;const row=document.createElement('div'),name=document.createElement('p');name.textContent=conflict.path.join(' / ');row.append(name);
      for(const [choice,label,value]of [['local',zh?'保留本分頁版本':'Keep this tab',conflict.local],['remote',zh?'採用另一分頁版本':'Use other tab',conflict.remote]]){const pre=document.createElement('pre');pre.textContent=typeof value==='string'?value:JSON.stringify(value,null,2);const button=document.createElement('button');button.type='button';button.textContent=label as string;button.addEventListener('click',()=>store.resolve(conflict.id,choice));row.append(pre,button);}panel.append(row);}
    if(state.status==='external-change'){const p=document.createElement('p');p.textContent=zh?'偵測到舊版分頁或其他程式改寫紀錄。請先匯出備份，重新整理其他數學分頁，再恢復保存。':'An older tab or another writer changed these records. Export first, refresh the other mathematics tabs, then resume saving.';const button=document.createElement('button');button.type='button';button.textContent=zh?'其他分頁已重新整理，恢復保存':'Other tabs refreshed; resume saving';button.addEventListener('click',async()=>{await store.resume();await store.flush();});panel.append(p,button);}
  };store.subscribe(render);render(store.state());
}
