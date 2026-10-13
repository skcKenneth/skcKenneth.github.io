import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { build, transform } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { catalogFilterUrl, matchesCatalogFilters, projectFilterOptions, readCatalogFilters, translatedCatalogFilters } from '../src/lib/catalog-filters.mjs';
import { modelDirectory } from '../src/data/model-directory.mjs';
import { workshopIndexSummary } from '../src/lib/workshop-index-summary.mjs';
import { freshProgress } from '../src/lib/workshop-state.mjs';

const compiled = await build({entryPoints:[fileURLToPath(new URL('../src/scripts/catalog-filter-controller.ts',import.meta.url))], bundle:true, write:false, format:'iife', globalName:'CatalogFilters', platform:'browser', target:'es2022', metafile:true});
const code = compiled.outputFiles[0].text;
class Element {
  constructor(dataset={}) { this.dataset=dataset; this.listeners=new Map(); this.value=''; this.hidden=false; this.textContent=''; }
  addEventListener(type, listener) { this.listeners.set(type,[...(this.listeners.get(type)||[]),listener]); }
  emit(type, event={}) { for(const listener of this.listeners.get(type)||[]) listener({preventDefault(){},...event}); }
  focus() { this.focused=true; }
  replaceChildren(...children) { this.children=children; }
}
function fixture({kind='model',locale='en',search='',hash='#model-index',alternateOptions}={}) {
  let current = new URL(`https://example.com/${locale==='en'?'':'zh/'}${kind==='model'?'teaching/model-laboratory/':'projects/'}${search}${hash}`);
  const history=[],window=new Element(),language=new Element();
  language.href=`https://example.com/${locale==='en'?'zh/':''}${kind==='model'?'teaching/model-laboratory/':'projects/'}`;
  const options = kind==='model' ? {purpose:['','systems','data','emergence','structure','decision'],stage:['','foundation','frontier','research']} : {topic:['','Graph repair','Graph theory'],status:['','Catalogue entry','Manuscript in preparation'],method:['','Structural analysis','Analysis'],availability:['','code','data','student']};
  const selects=Object.entries(options).map(([name,values])=>Object.assign(new Element(),{name,options:values.map(value=>({value}))}));
  const form=new Element(),count=new Element(),empty=new Element();
  form.querySelectorAll=()=>selects;
  const cards=(kind==='model'?modelDirectory:[{topic:'Graph repair',status:'Manuscript in preparation',method:'Structural analysis',code:'true',data:'false',student:'false'},{topic:'Graph theory',status:'Catalogue entry',method:'Analysis',code:'false',data:'false',student:'true'}]).map(data=>new Element(data));
  const root=new Element({catalogKind:kind,locale,...alternateOptions&&{alternateOptions:JSON.stringify(alternateOptions)}});
  root.querySelector=selector=>({'[data-catalog-filters]':form,'[data-catalog-count]':count,'[data-catalog-empty]':empty})[selector];
  root.querySelectorAll=()=>cards;
  const context=vm.createContext({document:{querySelector:()=>language},window,URL,URLSearchParams,get location(){return current;},history:{pushState(_state,_title,url){history.push(String(url));current=new URL(url);}}});
  vm.runInContext(code,context);context.CatalogFilters.initializeCatalogFilters(root);
  return {root,form,count,empty,cards,selects,history,language,context,window,get url(){return current;},restore(search,hash='#model-index',type='popstate'){current=new URL(`${current.origin}${current.pathname}${search}${hash}`);window.emit(type,{persisted:true});},select(name,value){selects.find(select=>select.name===name).value=value;form.emit('change');}};
}

test('Layout and catalogue language handlers commute in either registration order',async()=>{
  const layout=await readFile(new URL('../src/layouts/BaseLayout.astro',import.meta.url),'utf8');
  const languageScript=layout.slice(layout.lastIndexOf('const language='),layout.lastIndexOf('</script>'));
  const {code:layoutCode}=await transform(languageScript,{loader:'ts'});
  for(const order of ['layout-first','catalogue-first']) {
    const page=fixture({search:'?purpose=decision&stage=research&utm_source=ignored'});
    if(order==='layout-first') {
      const catalogueHandlers=new Map(page.language.listeners);page.language.listeners.clear();
      // Restore the pre-controller state to exercise the layout's initial write too.
      delete page.language.dataset.catalogLanguageManaged;
      vm.runInContext(layoutCode,page.context);
      page.language.dataset.catalogLanguageManaged='true';
      for(const [event,listeners] of catalogueHandlers)for(const listener of listeners)page.language.addEventListener(event,listener);
    } else vm.runInContext(layoutCode,page.context);
    for(const event of ['focus','click']) { page.language.emit(event);const href=new URL(page.language.href);assert.equal(href.search,'?purpose=decision&stage=research');assert.equal(href.hash,'#model-index'); }
  }
});

test('Model finder restores deep links, pushes distinct changes and restores back/BFCache without extra history',()=>{
  const page=fixture({search:'?purpose=data&stage=frontier&utm_source=lesson'});
  assert.equal(page.cards.filter(card=>!card.hidden).length,2);assert.equal(page.history.length,0);
  assert.equal(page.count.textContent,'Showing 2 of 14 experiments.');
  page.select('stage','research');assert.equal(page.history.length,1);assert.equal(page.url.searchParams.get('stage'),'research');
  assert.equal(page.url.searchParams.get('utm_source'),'lesson');assert.equal(page.url.hash,'#model-index');
  page.form.emit('change');assert.equal(page.history.length,1);
  page.restore('?purpose=structure&stage=foundation');assert.equal(page.cards.filter(card=>!card.hidden).length,0);assert.equal(page.empty.hidden,false);
  assert.equal(page.count.textContent,'Showing 0 of 14 experiments.');assert.equal(page.history.length,1);
  page.restore('?purpose=decision', '#model-index','pageshow');assert.equal(page.cards.filter(card=>!card.hidden).length,3);assert.equal(page.empty.hidden,true);
});
test('Reset preserves unrelated parameters and hash, focuses first control, and initialization stays single',()=>{
  const page=fixture({search:'?purpose=structure&stage=foundation&utm_source=test'});
  page.context.CatalogFilters.initializeCatalogFilters(page.root);
  assert.equal(page.form.listeners.get('change').length,1);assert.equal(page.window.listeners.get('popstate').length,1);
  page.form.emit('reset');assert.equal(page.url.search,'?utm_source=test');assert.equal(page.url.hash,'#model-index');
  assert.equal(page.cards.filter(card=>!card.hidden).length,14);assert.equal(page.selects[0].focused,true);
});
test('Chinese model filters keep stable values and hash through language focus and click',()=>{
  const page=fixture({locale:'zh-Hant',search:'?purpose=decision&stage=research'});
  assert.equal(page.count.textContent,'顯示 1 / 14 個實驗');
  for(const event of ['focus','click']) { page.language.emit(event);const link=new URL(page.language.href);assert.equal(link.pathname,'/teaching/model-laboratory/');assert.equal(link.searchParams.get('purpose'),'decision');assert.equal(link.searchParams.get('stage'),'research');assert.equal(link.hash,'#model-index'); }
  assert.equal(page.language.dataset.catalogLanguageManaged,'true');
});
test('Project filtering matches full metadata values and translation keeps only destination-supported conditions',()=>{
  const alternateOptions={topic:['','Graph theory'],status:['','Catalogue entry','Manuscript in preparation'],method:['','分析'],availability:['','code','data','student']};
  const page=fixture({kind:'project',search:'?topic=Graph%20repair&method=Structural%20analysis&status=Manuscript%20in%20preparation&availability=code',hash:'#project-grid',alternateOptions});
  assert.equal(page.cards.filter(card=>!card.hidden).length,1);
  page.language.emit('click');const translated=new URL(page.language.href);
  assert.equal(translated.searchParams.has('topic'),false);assert.equal(translated.searchParams.has('method'),false);assert.equal(translated.searchParams.get('status'),'Manuscript in preparation');assert.equal(translated.searchParams.get('availability'),'code');assert.equal(translated.hash,'#project-grid');
  page.restore('?topic=Graph%20theory&availability=student','#project-grid');assert.equal(page.cards[1].hidden,false);assert.equal(page.cards[0].hidden,true);
  assert.equal(matchesCatalogFilters('project',{topic:'Graph theory',method:'Analysis'},{topic:'Graph',method:''}),false);
  assert.equal(matchesCatalogFilters('project',{topic:'Graph theory',method:'Analysis'},{topic:'',method:'Anal'}),false);
});
test('Untrusted filter values cannot select arbitrary dataset properties or inject a destination',()=>{
  const options={purpose:['','systems'],stage:['','foundation']};
  assert.deepEqual(readCatalogFilters('?purpose=javascript%3Aalert(1)&stage=foundation&redirect=https://evil.example',options),{purpose:'',stage:'foundation'});
  assert.deepEqual(translatedCatalogFilters({purpose:'systems',stage:'no-such-stage'},options),{purpose:'systems',stage:''});
  assert.equal(matchesCatalogFilters('project',{constructor:'true'},{availability:'constructor'}),false);
  assert.equal(catalogFilterUrl('https://example.com/projects/?status=old#project-grid',{status:'',method:'A&B'}).href,'https://example.com/projects/?method=A%26B#project-grid');
  assert.deepEqual(projectFilterOptions([{data:{topics:['圖'],methods:['方法'],status:'Catalogue entry'}},{topics:['Graph'],methods:['Method'],status:'Catalogue entry'}]),{topic:['','圖','Graph'],status:['','Catalogue entry'],method:['','方法','Method'],availability:['','code','data','student']});
});
test('The bilingual finder shares fourteen entrances while runtime imports remain independent',async()=>{
  assert.equal(modelDirectory.length,14);assert.equal(new Set(modelDirectory.map(model=>model.id)).size,14);
  for(const model of modelDirectory) { assert.ok(model.title.en&&model.title['zh-Hant']);assert.ok(model.question.en&&model.question['zh-Hant']);const path=model.path.split('#')[0];await readFile(new URL(`../src/pages${path.slice(0,-1)}.astro`,import.meta.url));await readFile(new URL(`../src/pages/zh${path.slice(0,-1)}.astro`,import.meta.url)); }
  assert.equal(Object.keys(compiled.metafile.inputs).some(path=>/model-laboratory|workshop-client|frontier-model|inquiry-studio/.test(path)),false);
  const css=await readFile(new URL('../src/styles/catalog-filters.css',import.meta.url),'utf8');assert.match(css,/\[data-catalog-kind\] \[hidden\]\s*\{\s*display:none !important/);
  for(const locale of ['teaching','zh/teaching']){const route=await readFile(new URL(`../src/pages/${locale}/model-laboratory.astro`,import.meta.url),'utf8');assert.match(route,/components\/InteractiveModelLaboratory\.astro/);}
  const workbench=await readFile(new URL('../src/components/InteractiveModelLaboratory.astro',import.meta.url),'utf8');assert.match(workbench,/<ModelDirectory locale=\{locale\}/);assert.match(workbench,/data-model="logistic"/);assert.match(workbench,/data-model="sir"/);assert.match(workbench,/data-model="stopping"/);
});
test('Workshop summary distinguishes missing/blocked records and self-marked steps without changing records',()=>{
  const lessons=[{id:'a',title:{en:'First','zh-Hant':'第一課'},steps:Array(8)},{id:'b',title:{en:'Second','zh-Hant':'第二課'},steps:Array(8)}];
  const records=[{lessonId:'a',updatedAt:'2026-10-10T00:00:00Z',completed:['observe','ask']},{lessonId:'b',updatedAt:'2026-10-11T00:00:00Z',completed:[]}];
  const before=JSON.stringify(records);
  assert.match(workshopIndexSummary(records,lessons,'en',true),/2 of 2 lessons; 2 of 16 steps self-marked complete. Last edited: Second/);
  assert.match(workshopIndexSummary(records,lessons,'zh-Hant',true),/2 \/ 16 個步驟已自行標記完成。最近編輯：第二課/);
  assert.match(workshopIndexSummary([],lessons,'en',true),/No readable local drafts/);
  assert.match(workshopIndexSummary([],lessons,'en',false),/Local progress is unavailable/);
  assert.equal(JSON.stringify(records),before);
});

test('Workshop index reads existing records into one toolbar action and a text-only summary',async()=>{
  const source=await readFile(new URL('../src/data/workshop-lessons.ts',import.meta.url),'utf8');
  const transformed=await transform(source,{loader:'ts',format:'esm'});
  const {lessons}=await import('data:text/javascript;base64,'+Buffer.from(transformed.code).toString('base64'));
  const statePath=fileURLToPath(new URL('../src/lib/workshop-state.mjs',import.meta.url));
  const workshop=await build({entryPoints:[fileURLToPath(new URL('../src/scripts/workshop-client.ts',import.meta.url))],bundle:true,write:false,format:'iife',globalName:'WorkshopClient',platform:'browser',target:'es2022',plugins:[{name:'readonly-store-fixture',setup(builder){
    builder.onResolve({filter:/workshop-state\.mjs$/},args=>args.namespace==='readonly-store' ? {path:statePath} : {path:statePath,namespace:'readonly-store'});
    builder.onLoad({filter:/.*/,namespace:'readonly-store'},()=>({contents:`export * from ${JSON.stringify(statePath)}; export class ProgressStore { constructor(){this.persistent=true;} async open(){return true;} async get(id){return globalThis.__records[id];} async put(){throw new Error('Index must not write progress');} }`,loader:'js'}));
  }}]});
  const record=freshProgress(lessons[1]);record.completed=['observe'];record.updatedAt='2026-10-11T00:00:00Z';
  const original=JSON.stringify(record),summary=new Element(),status=new Element(),resume=new Element(),exportButton=new Element(),diagnostic=new Element(),toolbar=new Element();
  toolbar.querySelector=selector=>({'[data-teaching-save-status]':status,'[data-teaching-continue]':resume,'[data-teaching-export]':exportButton})[selector];
  const root=new Element({locale:'zh-Hant'});
  root.querySelector=selector=>({'[data-teaching-toolbar]':toolbar,'[data-workshop-summary]':summary,'#workshop-index-notes':{textContent:'[]'},'[data-diagnostic-results]':diagnostic})[selector]||null;
  root.querySelectorAll=()=>[];
  const context=vm.createContext({__records:{[record.lessonId]:record},URL,Blob,console,setTimeout,clearTimeout});
  vm.runInContext(workshop.outputFiles[0].text,context);
  await context.WorkshopClient.initializeWorkshopIndex(root);await context.WorkshopClient.initializeWorkshopIndex(root);
  assert.equal(resume.href,`/zh/teaching/modeling-workshop/${lessons[1].slug}/`);
  assert.match(summary.textContent,/1 \/ 48 個步驟已自行標記完成/);
  assert.match(summary.textContent,new RegExp(lessons[1].title['zh-Hant']));
  assert.equal(summary.children,undefined);assert.equal(exportButton.listeners.get('click').length,1);
  assert.equal(JSON.stringify(record),original);
  const component=await readFile(new URL('../src/components/WorkshopIndex.astro',import.meta.url),'utf8');assert.equal(component.includes('data-resume'),false);
});
