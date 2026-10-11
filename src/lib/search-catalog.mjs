/** Shared, dependency-free search rules. Pagefind remains the full-text engine. */
export const SEARCH_PAGE_SIZE = 12;
export const SEARCH_KINDS = ['writing','project','teaching','research','question','lesson','catalogue'];
const normalize = text => String(text || '').normalize('NFKC').toLocaleLowerCase().replace(/\s+/gu, '');
export function matchCatalog(query, catalog) {
  const term = normalize(query);
  return term.length < 2 ? [] : catalog
    .map((entry,index)=>({entry,index,score:Math.max(...[entry.title,...(entry.aliases||[])].filter(Boolean).map(alias=>{
      const value=normalize(alias);return value===term?3:value.startsWith(term)?2:value.includes(term)?1:0;
    }),0)}))
    .filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.index-b.index).map(item=>item.entry);
}
export function routeKey(url, origin='https://skckenneth.github.io') {
  try { const parsed=new URL(url,origin);return parsed.origin===new URL(origin).origin?parsed.pathname.replace(/\/$/,''):null; }
  catch { return null; }
}
export function mergeSearchResults(named, indexed, origin) {
  const seen = new Set();
  return [...named, ...indexed].filter(entry => {
    const key=routeKey(entry.url,origin);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
export function readSearchState(search, topicIds=[]) {
  const p=new URLSearchParams(search);
  return {q:(p.get('q')||'').trim().slice(0,300),type:SEARCH_KINDS.includes(p.get('type'))?p.get('type'):'',
    topic:topicIds.includes(p.get('topic'))?p.get('topic'):'',page:Math.min(100000,Math.max(1,Number.parseInt(p.get('page')||'1',10)||1)),
    archive:p.get('archive')==='1',questions:p.get('questions')==='1',technical:p.get('technical')==='1'};
}
export function searchParams(state) {
  const p=new URLSearchParams();
  for(const key of ['q','type','topic'])if(state[key])p.set(key,state[key]);
  for(const key of ['archive','questions','technical'])if(state[key])p.set(key,'1');
  if(state.page>1)p.set('page',String(state.page));
  return p;
}
export function allowedSearchKinds(state) {
  // Selecting an advanced type is itself an explicit opt-in.
  if(state.type)return [state.type];
  const kinds=['writing','project','teaching'];
  if(state.questions)kinds.push('question','lesson');
  if(state.technical)kinds.push('research','catalogue');
  return kinds;
}
export function pagefindFilters(state) {
  const filters={'search-kind':{any:allowedSearchKinds(state)}};
  if(!state.archive)filters.archived='false';
  if(state.topic)filters.topic=state.topic;
  return filters;
}
export function entryMatchesSearch(entry,state) {
  return allowedSearchKinds(state).includes(entry.kind) && (state.archive||!entry.archived) && (!state.topic||(entry.topicIds||[]).includes(state.topic));
}
export function paginateSearch(entries,requestedPage=1,size=SEARCH_PAGE_SIZE) {
  const total=entries.length,pages=Math.max(1,Math.ceil(total/size)),page=Math.min(pages,Math.max(1,requestedPage));
  return {entries:entries.slice((page-1)*size,page*size),total,pages,page};
}
export function classifySearchUrl(url) {
  const path=new URL(url,'https://skckenneth.github.io').pathname.replace(/^\/zh\//,'/');
  if(/^\/writing\/[^/]+\/$/.test(path))return 'writing';
  if(/^\/projects\/[^/]+\/$/.test(path))return 'project';
  if(path.startsWith('/research/'))return 'research';
  if(path.startsWith('/science/')||path==='/projects/')return 'catalogue';
  if(/\/(question|questions|papers|practice|exercises|question-bank)(\/|$)/.test(path)||/\/senior-math\/(bank|paper)(\/|$)/.test(path))return 'question';
  if(/^\/teaching\/(?:senior-math|jae-math|modeling-workshop)\/sources\/?$/.test(path))return 'catalogue';
  if(/^\/teaching\/(?:senior-math|jae-math)\/(?:lessons|chapters|books)\//.test(path)||/^\/teaching\/(?:modeling-workshop|mathematical-modeling-lecture-programme)\/[^/]+\/?$/.test(path))return 'lesson';
  return path.startsWith('/teaching/')||path==='/math-studio/'?'teaching':'other';
}
/**
 * Build paired routes from sourceSlug, never from a translated title or guessed slug.
 * @param {Record<string, any[]>} collections
 * @param {string} locale
 * @param {{getTopicIds?:(data:any)=>string[],extras?:any[]}} options
 */
export function createSearchCatalog(collections,locale,{getTopicIds=()=>[],extras=[]}={}) {
  const zh=locale==='zh-Hant',base=zh?'/zh':'',entries=[];
  for(const [collection,route,kind] of [['writing','writing','writing'],['projects','projects','project'],['teaching','teaching','teaching'],['research','research','research']]) {
    const published=entry=>!entry.data.draft && (collection!=='writing'||(entry.data.sourceSlug||entry.data.slug)!=='legacy-archive');
    const originals=(collections[collection]||[]).filter(published);
    const translated=(collections[`${collection}Zh`]||[]).filter(published);
    const selected=zh?translated:originals;
    for(const entry of selected) {
      const data=entry.data,id=data.sourceSlug||data.slug;
      const pair=(zh?originals:translated).find(item=>(item.data.sourceSlug||item.data.slug)===id);
      entries.push({url:`${base}/${route}/${data.slug}/`,id,kind:kind==='project'&&data.status==='Catalogue entry'?'catalogue':kind,
        title:data.title,excerpt:data.summary,aliases:[data.title,data.slug,id,...(data.searchAliases||[]),...(pair?[pair.data.title,pair.data.slug,...(pair.data.searchAliases||[])]:[])],
        archived:Boolean(data.archived),topicIds:getTopicIds(data),date:data.date?new Date(data.date).toISOString().slice(0,10):undefined,
        alternateUrl:pair?`${zh?'':'/zh'}/${route}/${pair.data.slug}/`:undefined});
    }
  }
  return mergeSearchResults(extras,entries,'https://skckenneth.github.io');
}
