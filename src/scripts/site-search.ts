import {matchCatalog,mergeSearchResults,readSearchState,searchParams,pagefindFilters,entryMatchesSearch,paginateSearch,classifySearchUrl,routeKey,SEARCH_PAGE_SIZE} from '../lib/search-catalog.mjs';

type Entry={url:string;title:string;excerpt:string;kind:string;archived:boolean;topicIds:string[];aliases?:string[];date?:string};
type SearchState={q:string;type:string;topic:string;page:number;archive:boolean;questions:boolean;technical:boolean};
type IndexedData={url:string;meta:Record<string,string>;plain_excerpt:string;filters?:Record<string,string[]>};
type Reference={id:string;data:()=>Promise<IndexedData>};
type Pagefind={search:(query:string|null,options:unknown)=>Promise<{results:Reference[]}>;options?:(options:unknown)=>Promise<unknown>;init?:()=>Promise<unknown>};
type ResultSet={refs:Reference[];named:Entry[];merged?:Entry[];fallback?:boolean};
const textExcerpt=(value:string)=>value.replace(/&#(x[0-9a-f]+|[0-9]+);/gi,(_,n)=>{const code=n[0].toLowerCase()==='x'?Number.parseInt(n.slice(1),16):Number(n);return code<=0x10ffff?String.fromCodePoint(code):'';}).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');

for(const root of document.querySelectorAll<HTMLElement>('[data-site-search]')){
  if(root.dataset.searchInitialized==='true')continue;
  root.dataset.searchInitialized='true';
  const zh=root.dataset.locale==='zh-Hant',t=(en:string,ch:string)=>zh?ch:en;
  const form=root.querySelector<HTMLFormElement>('[data-search-form]')!,input=form.elements.namedItem('q') as HTMLInputElement;
  const status=root.querySelector<HTMLElement>('[data-search-status]')!,results=root.querySelector<HTMLElement>('[data-search-results]')!,pagination=root.querySelector<HTMLElement>('[data-search-pagination]')!;
  const catalog=JSON.parse(root.dataset.catalog||'[]') as Entry[],byRoute=new Map(catalog.map(entry=>[routeKey(entry.url,location.origin),entry]));
  const topicIds=Array.from(form.querySelectorAll<HTMLOptionElement>('select[name=topic] option')).map(option=>option.value).filter(Boolean);
  let state=readSearchState(location.search,topicIds) as SearchState,request=0,timer:ReturnType<typeof setTimeout>,pagefindPromise:Promise<Pagefind>|undefined;
  const dataCache=new Map<string,Promise<Entry>>(),searchCache=new Map<string,ResultSet>();
  const kindLabel=(kind:string)=>({writing:t('Article','文章'),project:t('Project overview','專案概覽'),teaching:t('Teaching entrance','教學入口'),research:t('Research','研究方向'),question:t('Question / paper','練習題／舊卷'),lesson:t('Lesson','教學單元'),catalogue:t('Technical catalogue','技術目錄')}[kind]||t('Page','頁面'));
  function applyForm(){input.value=state.q;for(const name of ['type','topic'])(form.elements.namedItem(name) as HTMLSelectElement).value=state[name as 'type'|'topic'];for(const name of ['archive','questions','technical'])(form.elements.namedItem(name) as HTMLInputElement).checked=state[name as 'archive'|'questions'|'technical'];}
  function readForm(){return {...state,q:input.value.trim().slice(0,300),type:(form.elements.namedItem('type') as HTMLSelectElement).value,topic:(form.elements.namedItem('topic') as HTMLSelectElement).value,archive:(form.elements.namedItem('archive') as HTMLInputElement).checked,questions:(form.elements.namedItem('questions') as HTMLInputElement).checked,technical:(form.elements.namedItem('technical') as HTMLInputElement).checked};}
  function updateUrl(mode:'push'|'replace'){
    const params=searchParams(state).toString(),url=`${location.pathname}${params?'?'+params:''}`;
    if(url!==`${location.pathname}${location.search}`)history[mode==='push'?'pushState':'replaceState'](null,'',url);
    for(const link of document.querySelectorAll<HTMLAnchorElement>('.language-switch a,[data-language-switch]')){
      const target=new URL(link.href,location.origin);if(/\/(?:zh\/)?search\/$/.test(target.pathname)){target.search=params;link.href=target.pathname+target.search;}
    }
  }
  async function loadPagefind(){
    pagefindPromise??=(async()=>{const url='/pagefind/pagefind.js';const module=await import(/* @vite-ignore */url) as Pagefind;
      await module.options?.({ranking:{metaWeights:{title:8,aliases:6}}});await module.init?.();return module;
    })().catch(error=>{pagefindPromise=undefined;throw error;});return pagefindPromise;
  }
  function indexedEntry(ref:Reference){
    if(!dataCache.has(ref.id))dataCache.set(ref.id,ref.data().then(data=>{
      const key=routeKey(data.url,location.origin);if(!key)throw new Error('Invalid search result URL');const known=byRoute.get(key);
      return {url:data.url,title:data.meta.title||known?.title||data.url,excerpt:textExcerpt(data.plain_excerpt||known?.excerpt||''),
        kind:known?.kind||data.meta['search-kind']||data.filters?.['search-kind']?.[0]||classifySearchUrl(data.url),
        archived:known?.archived||data.meta.archived==='true'||data.filters?.archived?.includes('true')||false,
        topicIds:known?.topicIds||data.filters?.topic||[],date:known?.date};
    }).catch(error=>{dataCache.delete(ref.id);throw error;}));return dataCache.get(ref.id)!;
  }
  async function loadAll(refs:Reference[],id:number){
    const entries:Entry[]=new Array(refs.length);let cursor=0;
    await Promise.all(Array.from({length:Math.min(8,refs.length)},async()=>{while(cursor<refs.length){if(id!==request)throw new Error('Superseded');const index=cursor++;entries[index]=await indexedEntry(refs[index]);}}));return entries;
  }
  function render(entries:Entry[]){
    results.replaceChildren();
    for(const entry of entries){
      const article=document.createElement('article'),type=document.createElement('p'),heading=document.createElement('h2'),link=document.createElement('a'),excerpt=document.createElement('p'),path=document.createElement('p');
      article.className='search-result';type.className='eyebrow';type.textContent=kindLabel(entry.kind)+(entry.archived?t(' · Archive',' · 典藏'):'')+(entry.date?' · '+entry.date:'');
      link.href=entry.url;link.textContent=entry.title;heading.append(link);excerpt.textContent=entry.excerpt;path.className='search-result-path';path.textContent=new URL(entry.url,location.origin).pathname;
      article.append(type,heading,excerpt,path);results.append(article);
    }
    if(!entries.length){const p=document.createElement('p');p.textContent=t('No matching pages. Try a shorter phrase or include more content.','沒有相符頁面，請嘗試較短的關鍵字，或擴闊搜尋範圍。');results.append(p);}
  }
  function renderPagination(page:number,pages:number){
    pagination.replaceChildren();if(pages<2)return;
    const add=(target:number,label:string,current=false)=>{const link=document.createElement('a'),params=searchParams({...state,page:target});link.href=location.pathname+'?'+params;link.textContent=label;if(current)link.setAttribute('aria-current','page');link.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();state.page=target;updateUrl('push');void search(true);});pagination.append(link);};
    if(page>1)add(page-1,t('Previous','上一頁'));
    const visible=new Set([1,pages,...Array.from({length:5},(_,i)=>page+i-2).filter(n=>n>=1&&n<=pages)]);let previous=0;
    for(const n of [...visible].sort((a,b)=>a-b)){if(n-previous>1){const dots=document.createElement('span');dots.textContent='…';pagination.append(dots);}add(n,String(n),n===page);previous=n;}
    if(page<pages)add(page+1,t('Next','下一頁'));
  }
  async function search(focusResults=false){
    const id=++request;updateUrl('replace');
    if(state.q.length===1||!state.q&&!state.type&&!state.topic&&!state.archive&&!state.questions&&!state.technical){results.replaceChildren();pagination.replaceChildren();results.setAttribute('aria-busy','false');status.textContent=t('Type at least two characters, or choose a topic.','請輸入至少兩個字元，或選擇主題。');return;}
    results.setAttribute('aria-busy','true');status.textContent=t('Searching…','搜尋中…');
    const key=searchParams({...state,page:1}).toString();let set=searchCache.get(key);
    try{
      if(!set){
        const named=(state.q?matchCatalog(state.q,catalog):catalog).filter((entry:Entry)=>entryMatchesSearch(entry,state)) as Entry[];
        try{
          const pagefind=await loadPagefind();if(id!==request)return;
          const indexed=await pagefind.search(state.q||null,{filters:pagefindFilters(state)});if(id!==request)return;
          set={refs:indexed.results,named};
          // When title/alias matches must be promoted, load once to deduplicate and count accurately.
          // Pure full-text queries hydrate only the twelve results being displayed.
          if(named.length)set.merged=mergeSearchResults(named,(await loadAll(indexed.results,id)).filter(entry=>entryMatchesSearch(entry,state)),location.origin);
        }catch(error){if(id!==request)return;set={refs:[],named,merged:named,fallback:true};}
        if(id!==request)return;searchCache.set(key,set);if(searchCache.size>20)searchCache.delete(searchCache.keys().next().value!);
      }
      const total=set.merged?set.merged.length:set.refs.length,pages=Math.max(1,Math.ceil(total/SEARCH_PAGE_SIZE));state.page=Math.min(state.page,pages);updateUrl('replace');
      const entries=set.merged?paginateSearch(set.merged,state.page).entries:await Promise.all(set.refs.slice((state.page-1)*SEARCH_PAGE_SIZE,state.page*SEARCH_PAGE_SIZE).map(indexedEntry));
      if(id!==request)return;render(entries);renderPagination(state.page,pages);
      const summary=t(`${total} result${total===1?'':'s'}${pages>1?` · Page ${state.page} of ${pages}`:''}`,`找到 ${total} 個結果${pages>1?` · 第 ${state.page}／${pages} 頁`:''}`);
      status.textContent=set.fallback?t(`Full-text search could not load. Showing title and alias matches. ${summary}` ,`全文搜尋暫時無法載入，以下為名稱及別名相符的頁面。${summary}`):summary;
      if(focusResults){status.tabIndex=-1;status.focus({preventScroll:true});status.scrollIntoView({block:'start',behavior:'instant'});}
    }catch{if(id!==request)return;render([]);pagination.replaceChildren();status.textContent=t('Search is temporarily unavailable. Please browse topics or articles below.','搜尋暫時無法使用，請使用下方主題或文章入口。');}
    finally{if(id===request)results.setAttribute('aria-busy','false');}
  }
  input.addEventListener('focus',()=>{void loadPagefind().catch(()=>{});},{once:true});
  input.addEventListener('input',()=>{clearTimeout(timer);request++;state={...readForm(),page:1};updateUrl('replace');timer=setTimeout(()=>void search(),250);});
  form.addEventListener('change',event=>{if(event.target===input)return;clearTimeout(timer);state={...readForm(),page:1};updateUrl('push');void search();});
  form.addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);state={...readForm(),page:1};updateUrl('push');void search();});
  form.addEventListener('reset',event=>{event.preventDefault();clearTimeout(timer);state=readSearchState('',topicIds) as SearchState;applyForm();updateUrl('push');void search();input.focus();});
  for(const suggestion of root.querySelectorAll<HTMLButtonElement>('[data-search-suggestion]'))suggestion.addEventListener('click',()=>{clearTimeout(timer);state={...readForm(),q:suggestion.dataset.searchSuggestion!,page:1};applyForm();updateUrl('push');void search();});
  window.addEventListener('popstate',()=>{clearTimeout(timer);state=readSearchState(location.search,topicIds) as SearchState;applyForm();void search();});
  applyForm();void search();
}
