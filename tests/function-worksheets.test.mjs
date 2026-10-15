import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import katex from 'katex';
import {chapterTitle,chapterSubtitle,functionWorksheets,worksheetBase,worksheetUrl,worksheetActivityId} from '../src/data/function-worksheets.mjs';
import {lessonById} from '../src/data/senior-math/catalog.mjs';
import {seniorPages} from '../src/lib/senior-math-pages.mjs';
import {createMathCatalog} from '../src/lib/math-system-catalog.mjs';
import {createFunctionWorksheetSearchCatalog,FUNCTION_WORKSHEET_TOPIC_IDS} from '../src/lib/function-worksheet-search-catalog.mjs';
import {classifySearchUrl,createSearchCatalog,entryMatchesSearch,matchCatalog,mergeSearchResults,readSearchState,routeKey} from '../src/lib/search-catalog.mjs';
import {TOPIC_IDS} from '../src/data/site-reader.mjs';

const locales=['en','zh-Hant'];
const ids=Array.from({length:14},(_,i)=>String(i+1).padStart(2,'0'));
const sourceNames=[
 '01_從對應認識函數.docx','02_讀懂函數符號與三要素.docx','03_用區間寫出允許的輸入.docx',
 '04_定義域的多重限制與值域.docx','05_在表格圖像與公式之間轉換.docx','06_分段函數與臨界點.docx',
 '07_複合函數是依次完成兩個步驟.docx','08_從圖像看升降與最大最小值.docx','09_用定義說明單調性.docx',
 '10_用對稱理解奇函數與偶函數.docx','11_認識五種基本冪函數.docx','12_運用冪函數性質比較大小.docx',
 '13_複合規則與簡單換元.docx','14_用函數作出有根據的選擇.docx',
];
const bilingual=(value,path)=>{for(const locale of locales)assert.equal(typeof value?.[locale],'string',`${path}: ${locale}`);for(const locale of locales)assert.ok(value[locale].trim(),`${path}: empty ${locale}`);};

test('Chapter 3 covers the fourteen source worksheets in order and eight inquiry scenes',()=>{
 assert.deepEqual(functionWorksheets.map(lesson=>lesson.id),ids);
 assert.deepEqual(functionWorksheets.map(lesson=>lesson.sourceFilename),sourceNames);
 assert.equal(new Set(functionWorksheets.map(lesson=>lesson.scene)).size,8);
 for(const family of [['01','02'],['03','04'],['05','06'],['07','13'],['08','09'],['10'],['11','12'],['14']]){
  const scenes=family.map(id=>functionWorksheets.find(lesson=>lesson.id===id)?.scene);assert(scenes[0],family.join(',')+': missing scene');assert(scenes.every(scene=>scene===scenes[0]),family.join(',')+': paired lessons use one inquiry family');
 }
 assert.equal(chapterTitle['zh-Hant'],'第三章・函數');assert.equal(chapterTitle.en,'Chapter 3 · Functions');
 bilingual(chapterSubtitle,'chapterSubtitle');
 assert(!/01\s*[-–]\s*14|學習單/.test(chapterTitle['zh-Hant']),'The public chapter title is independent of the worksheet range');
 for(const lesson of functionWorksheets){
  assert.equal(typeof lesson.scene,'string');assert.ok(lesson.scene.trim(),lesson.id);
  assert.equal(typeof lesson.sourceSection,'string');assert.ok(lesson.sourceSection.trim(),lesson.id+': sourceSection');
  assert(!/[A-Z]:[\\/]|共用雲端硬碟/.test(JSON.stringify(lesson)),lesson.id+': private drive path');
 }
});

test('Each lesson includes a complete bilingual inquiry, worked example, exit check and teacher guidance',()=>{
 let pairs=0;
 const visit=(value,path)=>{
  if(!value||typeof value!=='object')return;
  if(Array.isArray(value))return value.forEach((item,i)=>visit(item,`${path}[${i}]`));
  if('en'in value||'zh-Hant'in value){bilingual(value,path);pairs++;}
  for(const [key,item]of Object.entries(value))visit(item,`${path}.${key}`);
 };
 visit(functionWorksheets,'lessons');assert(pairs>=14*20,`Only ${pairs} bilingual teaching fields checked`);
 for(const lesson of functionWorksheets){
  for(const field of ['title','focus','question','prediction','explanation','transfer'])bilingual(lesson[field],`${lesson.id}.${field}`);
  assert(lesson.evidence.length>=2,`${lesson.id}: at least two pieces of paper evidence`);
  assert.equal(lesson.hints.length,2,`${lesson.id}: layered hints`);
  assert(lesson.workedExamples.length>=1,`${lesson.id}: worked example`);
  for(const example of lesson.workedExamples){bilingual(example.prompt,lesson.id+': example prompt');assert(example.steps.length>=2,lesson.id+': example reasoning');assert.equal(typeof example.expression,'string');assert.ok(example.expression.trim());}
  bilingual(lesson.exit.prompt,lesson.id+': exit prompt');bilingual(lesson.exit.answer,lesson.id+': exit answer');assert(lesson.exit.rubric.length>=2,lesson.id+': exit reasoning rubric');
  for(const field of ['prompts','anticipated','pitfalls','board'])assert(lesson.teacher[field]?.length>=2,`${lesson.id}: teacher.${field}`);
  bilingual(lesson.teacher.timing,lesson.id+': teacher timing');
 }
});

test('All authored TeX expressions and inline mathematics render strictly',()=>{
 let expressions=0;
 const render=(math,path)=>{assert(!/[\u0000-\u001f§]/.test(math),path);katex.renderToString(math,{throwOnError:true,strict:'error',trust:false});expressions++;};
 const visit=(value,path,key='')=>{
  if(typeof value==='string'){
   if(['expression','formula','math','resultMath'].includes(key)){render(value,path);return;}
   for(const match of value.matchAll(/\$([^$\n]+)\$|\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g))render(match[1]??match[2]??match[3],path);
   return;
  }
  if(!value||typeof value!=='object')return;
  for(const [child,item]of Object.entries(value))visit(item,`${path}.${child}`,child);
 };
 visit(functionWorksheets,'lessons');assert(expressions>=14,`Only ${expressions} mathematical expressions checked`);
});

test('Lesson cross-references resolve to the existing compulsory function chapter',()=>{
 for(const lesson of functionWorksheets){
  assert(lesson.relatedLessons.length>=1,lesson.id+': related lessons');
  assert.equal(new Set(lesson.relatedLessons).size,lesson.relatedLessons.length,lesson.id+': duplicate reference');
  for(const id of lesson.relatedLessons){assert.match(id,/^c1-3-/);assert(lessonById.has(id),`${lesson.id}: unknown related lesson ${id}`);}
 }
 const nativeRoutes=new Set(seniorPages.map(page=>page.path));
 for(const id of ['',...ids])assert(!nativeRoutes.has('function-worksheets'+(id?'/'+id:'')),'Explicit worksheet route collides with existing generated route');
});

test('The unified classroom catalog exposes fifteen unique native Senior 1 activities with bilingual sources',()=>{
 const catalog=createMathCatalog();assert.equal(new Set(catalog.map(item=>item.id)).size,catalog.length);
 const items=catalog.filter(item=>item.id==='senior:function-worksheets'||item.id.startsWith('senior:function-worksheet:'));
 assert.equal(items.length,15);
 assert.deepEqual(catalog.slice(0,15).map(item=>item.id),['senior:function-worksheets',...ids.map(worksheetActivityId)]);
 const overview=items[0];assert.deepEqual(overview.title,chapterTitle);assert.deepEqual(overview.summary,chapterSubtitle);
 const oldNativeIds=new Set(catalog.filter(item=>!items.includes(item)&&item.runtime==='senior').map(item=>item.nativeId));
 for(const item of items){
  assert.equal(item.group,'senior');assert.equal(item.runtime,'senior');assert.deepEqual(item.grades,['g10']);assert(!oldNativeIds.has(item.nativeId),item.nativeId);
  for(const locale of locales){bilingual(item.title,item.id);bilingual(item.summary,item.id);assert.match(item.sources[locale],/^\/(?:zh\/)?teaching\/senior-math\/function-worksheets\//);}
 }
 for(const lesson of functionWorksheets){const item=items.find(activity=>activity.id===worksheetActivityId(lesson.id));assert.deepEqual(item.title,lesson.title);assert.deepEqual(item.summary,lesson.focus);assert.equal(item.nativeId,`function-worksheet-${lesson.id}`);for(const locale of locales)assert.equal(item.sources[locale],worksheetUrl(lesson.id,locale));}
 for(const locale of locales)assert.equal(overview.sources[locale],worksheetBase(locale));
});

test('Named search exposes fifteen paired native teaching entrances with valid public metadata',()=>{
 for(const locale of locales){
  const catalog=createFunctionWorksheetSearchCatalog(locale),other=locale==='en'?'zh-Hant':'en';
  assert.deepEqual(catalog.map(item=>item.id),['senior:function-worksheets',...ids.map(worksheetActivityId)]);
  assert.equal(new Set(catalog.map(item=>routeKey(item.url))).size,15);
  for(const [index,item]of catalog.entries()){
   const id=index?ids[index-1]:undefined;
   assert.equal(item.url,id?worksheetUrl(id,locale):worksheetBase(locale));
   assert.equal(item.alternateUrl,id?worksheetUrl(id,other):worksheetBase(other));
   assert.equal(item.title,index?functionWorksheets[index-1].title[locale]:chapterTitle[locale]);
   assert.equal(item.excerpt,index?functionWorksheets[index-1].focus[locale]:chapterSubtitle[locale]);
   assert.equal(item.kind,'teaching');assert.equal(classifySearchUrl(item.url),item.kind);assert.equal(classifySearchUrl(item.alternateUrl),item.kind);assert.equal(item.archived,false);
   assert.deepEqual(item.topicIds,FUNCTION_WORKSHEET_TOPIC_IDS);assert(item.topicIds.every(topic=>TOPIC_IDS.includes(topic)));
   assert(entryMatchesSearch(item,readSearchState('')),item.id+': hidden from everyday search');
   for(const topic of item.topicIds)assert(entryMatchesSearch(item,readSearchState('?topic='+topic,TOPIC_IDS)),item.id+': topic filter');
   for(const field of ['sourceFilename','sourceSection','teacher','workedExamples','exit','hints','answer'])assert(!(field in item),item.id+': private/answer field '+field);
   assert(!/\.docx|[A-Z]:[\\/]|共用雲端硬碟/.test(JSON.stringify(item)),item.id+': private source metadata in search');
  }
 }
});

test('Chapter and lesson names are discoverable in either language without punctuation or locale assumptions',()=>{
 for(const locale of locales){
  const catalog=createFunctionWorksheetSearchCatalog(locale);
  for(const query of ['第三章 函數','Chapter 3 Functions','Ｃｈａｐｔｅｒ　３　Ｆｕｎｃｔｉｏｎｓ','函數','functions','高一文組']){
   const found=matchCatalog(query,catalog);assert.equal(found.length,15,query);assert.equal(found[0].id,'senior:function-worksheets',query+': chapter entrance first');
  }
  for(const lesson of functionWorksheets)for(const language of locales)assert.equal(matchCatalog(lesson.title[language],catalog)[0]?.id,worksheetActivityId(lesson.id),`${locale}: ${lesson.title[language]}`);
 }
});

test('Named chapter activities retain aliases and stay distinct when merged with workspace and Pagefind results',()=>{
 for(const locale of locales){
  const catalog=createFunctionWorksheetSearchCatalog(locale),generic={url:`${locale==='zh-Hant'?'/zh':''}/teaching/math/`,title:'Mathematics Learning Space',kind:'teaching'};
  const named=createSearchCatalog({},locale,{extras:[generic,...catalog]});assert.equal(named.length,16);
  const indexed=catalog.map(item=>({url:item.url+'?from=pagefind',title:'Indexed page',kind:'teaching'}));
  const merged=mergeSearchResults(named,indexed,'https://skckenneth.github.io');assert.equal(merged.length,16);assert.deepEqual(merged.slice(1),catalog);
  assert.equal(matchCatalog('senior:function-worksheet:14',merged)[0]?.url,worksheetUrl('14',locale));
 }
});

if(process.argv.includes('--built')||process.env.FUNCTION_WORKSHEETS_BUILT==='1'){
 const output=new URL('../dist/',import.meta.url);
 for(const locale of locales)test(`Fresh ${locale} output contains all fifteen readable, paired chapter pages`,()=>{
  for(const id of ['',...ids]){
   const url=id?worksheetUrl(id,locale):worksheetBase(locale),path=url.slice(1)+'index.html';
   assert(existsSync(new URL(path,output)),path+' missing: build the current checkout first');
   const html=readFileSync(new URL(path,output),'utf8');
   assert(html.includes(`lang="${locale}"`),path);assert.equal((html.match(/<main\b/g)||[]).length,1,path);assert.equal((html.match(/<h1\b/g)||[]).length,1,path);
   for(const topic of FUNCTION_WORKSHEET_TOPIC_IDS)assert(html.includes(`data-pagefind-filter="topic[content]" content="${topic}"`),path+': topic metadata');
   assert(html.includes('data-pagefind-filter="search-kind[content]" content="teaching"'),path+': teaching search kind');
   assert(!/class="katex-error"|[A-Z]:[\\/]+共用|共用雲端硬碟/.test(html),path);
   assert(html.includes(id?`data-function-worksheet="${id}"`:'data-function-chapter'),path+': correct chapter content');
   if(id){
    const lesson=functionWorksheets.find(item=>item.id===id);
    const student=html.match(/<section\b[^>]*\bdata-fw-print-student\b[^>]*>([\s\S]*?)<section\b[^>]*\bdata-fw-print-teacher\b/)?.[1];assert(student,path+': student print edition');
    const text=student.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
    assert(text.includes(lesson.transfer[locale]),path+': student record includes transfer task');
    assert(text.includes(lesson.exit.prompt[locale]),path+': student record includes exit prompt');
    assert(!text.includes(lesson.exit.answer[locale]),path+': student record contains an answer');
   }
   const otherLocale=locale==='en'?'zh-Hant':'en',alternate=id?worksheetUrl(id,otherLocale):worksheetBase(otherLocale);
   assert(html.includes(`hreflang="${otherLocale}"`),path+': alternate language');assert(html.includes(alternate),path+': matching alternate route');
   for(const [,href]of html.matchAll(/href="([^"?#]+)(?:[?#][^"]*)?"/g)){
    if(!href.startsWith('/')||href.startsWith('//'))continue;
    const relative=decodeURIComponent(href.slice(1)),target=relative.endsWith('/')?relative+'index.html':relative;
    assert(existsSync(new URL(target,output)),`${path}: broken local link ${href}`);
   }
  }
 });
 for(const locale of locales)test(`Fresh ${locale} search page includes the complete named chapter catalog`,()=>{
  const prefix=locale==='zh-Hant'?'zh/':'',html=readFileSync(new URL(prefix+'search/index.html',output),'utf8');
  const raw=html.match(/data-catalog="([^"]*)"/)?.[1];assert(raw,'Missing search catalog');
  const catalog=JSON.parse(raw.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
  for(const item of createFunctionWorksheetSearchCatalog(locale))assert.deepEqual(catalog.find(entry=>entry.id===item.id),item,item.id);
 });
}
