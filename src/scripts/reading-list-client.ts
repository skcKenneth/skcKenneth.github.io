import {READING_STORAGE_KEY,parseReadingState,mergeReadingStates,setReadingArticle,savedReadingArticles,exportReadingList,importReadingList} from '../lib/reading-list.mjs';

type RecordEntry={id:string;saved:boolean;at:number;actor:string};
type State={version:number;records:RecordEntry[]};
type Article={id:string;title:string;url:string;alternateUrl?:string};
let state:State=parseReadingState(null),persistent=true;
const actor=globalThis.crypto?.randomUUID?.()||`tab-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const subscribers=new Set<()=>void>();
const notify=()=>{for(const subscriber of subscribers)subscriber();};
function readStorage(){try{return parseReadingState(localStorage.getItem(READING_STORAGE_KEY));}catch{persistent=false;return parseReadingState(null);}}
state=readStorage();
function persist(){try{localStorage.setItem(READING_STORAGE_KEY,JSON.stringify(state));persistent=true;}catch{persistent=false;}notify();}
function save(id:string,value:boolean){state=setReadingArticle(mergeReadingStates(state,readStorage()),id,value,Date.now(),actor);persist();}
window.addEventListener('storage',event=>{
  if(event.key!==READING_STORAGE_KEY||!event.newValue)return;
  const merged=mergeReadingStates(state,parseReadingState(event.newValue));
  const serialized=JSON.stringify(merged),changed=serialized!==JSON.stringify(state);state=merged;
  if(serialized!==event.newValue){try{localStorage.setItem(READING_STORAGE_KEY,serialized);}catch{persistent=false;}}
  if(changed)notify();
});
window.addEventListener('pageshow',event=>{
  if(!event.persisted)return;
  state=mergeReadingStates(state,readStorage());notify();
});

for(const root of document.querySelectorAll<HTMLElement>('[data-save-article]')){
  if(root.dataset.readingInitialized==='true')continue;
  root.dataset.readingInitialized='true';
  const button=root.querySelector<HTMLButtonElement>('button')!,status=root.querySelector<HTMLElement>('[data-save-status]')!;
  const id=root.dataset.articleId!,zh=root.dataset.locale==='zh-Hant';
  const render=()=>{
    const saved=state.records.some(item=>item.id===id&&item.saved);
    button.disabled=false;button.setAttribute('aria-pressed',String(saved));
    button.textContent=zh?(saved?'已加入稍後閱讀':'加入稍後閱讀'):(saved?'Saved for later':'Save for later');
    status.textContent=persistent?'':zh?'瀏覽器未允許儲存；清單暫存於本頁。':'Browser storage is unavailable; this list lasts for this page only.';
  };
  button.addEventListener('click',()=>{
    save(id,!state.records.some(item=>item.id===id&&item.saved));
    if(persistent)status.textContent=zh?'清單已更新，只儲存在這個瀏覽器。':'List updated, in this browser only.';
  });subscribers.add(render);render();
}

for(const root of document.querySelectorAll<HTMLElement>('[data-reading-list]')){
  if(root.dataset.readingInitialized==='true')continue;
  root.dataset.readingInitialized='true';
  const zh=root.dataset.locale==='zh-Hant',t=(en:string,ch:string)=>zh?ch:en;
  const catalog=JSON.parse(root.dataset.articles||'[]') as Article[],byId=new Map(catalog.map(article=>[article.id,article]));
  const list=root.querySelector<HTMLElement>('[data-reading-items]')!,count=root.querySelector<HTMLElement>('[data-reading-count]')!,status=root.querySelector<HTMLElement>('[data-reading-status]')!,storageStatus=root.querySelector<HTMLElement>('[data-reading-storage-status]')!;
  const exportButton=root.querySelector<HTMLButtonElement>('[data-reading-export]')!,importInput=root.querySelector<HTMLInputElement>('[data-reading-import]')!;
  const render=()=>{
    list.replaceChildren();const records=savedReadingArticles(state);exportButton.disabled=records.length===0;
    count.textContent=t(`${records.length} saved article${records.length===1?'':'s'}`,`已收藏 ${records.length} 篇文章`);
    storageStatus.textContent=persistent?'':t('Browser storage is unavailable. Export the list before closing this page.','瀏覽器未允許儲存，請在關閉本頁前匯出清單。');
    if(!records.length){const p=document.createElement('p');p.className='reading-empty';p.textContent=t('Your list is empty. Save an article to return to it later.','清單暫時未有文章。在文章頁按「加入稍後閱讀」，便可在這裡繼續閱讀。');list.append(p);}
    for(const record of records){
      const article=byId.get(record.id),row=document.createElement('article'),heading=document.createElement('h2'),remove=document.createElement('button');row.className='reading-item';
      if(article){const link=document.createElement('a');link.href=article.url;link.textContent=article.title;heading.append(link);}
      else{heading.textContent=record.id;const note=document.createElement('p');note.textContent=t('This article is no longer in the current catalogue.','目前文章目錄已沒有這篇文章。');row.append(note);}
      const date=document.createElement('p');date.className='small';date.textContent=t('Saved ','收藏於 ')+new Intl.DateTimeFormat(zh?'zh-Hant':'en-GB',{dateStyle:'medium'}).format(record.at);
      remove.type='button';remove.className='button secondary';remove.textContent=t('Remove','移除');remove.setAttribute('aria-label',t(`Remove ${article?.title||record.id}`,`移除 ${article?.title||record.id}`));
      remove.addEventListener('click',()=>{const index=Array.from(list.children).indexOf(row);save(record.id,false);status.textContent=t('Article removed.','已移除文章。');const buttons=list.querySelectorAll<HTMLButtonElement>('button');(buttons[Math.min(index,buttons.length-1)]||importInput).focus();});
      row.prepend(heading);row.append(date,remove);list.append(row);
    }
  };
  exportButton.addEventListener('click',()=>{
    const blob=new Blob([exportReadingList(state)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='kenneth-reading-list.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    status.textContent=t('Reading list exported.','已匯出閱讀清單。');
  });
  importInput.addEventListener('change',async()=>{
    const file=importInput.files?.[0];if(!file)return;
    try{
      if(file.size>2000000)throw new Error('File too large');
      const imported=importReadingList(await file.text(),mergeReadingStates(state,readStorage()),[...byId.keys()],Date.now(),actor);state=imported.state;persist();
      status.textContent=t(`Imported ${imported.imported} articles${imported.skipped?`; ${imported.skipped} unavailable entries skipped`:''}.`,`已匯入 ${imported.imported} 篇文章${imported.skipped?`，略過 ${imported.skipped} 個已無法提供的項目`:''}。`);
    }catch{status.textContent=t('This is not a supported reading-list JSON file. The existing list was kept.','這不是支援的閱讀清單 JSON 檔案，原有清單已保留。');}
    finally{importInput.value='';}
  });subscribers.add(render);render();
}
