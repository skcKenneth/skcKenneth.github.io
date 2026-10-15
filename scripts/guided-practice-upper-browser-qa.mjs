// Actual disposable browser, native downloads, storage events and all new A4 editions.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {UPPER_PRACTICE_PACKS as packs,PRACTICE_PACKS} from '../src/data/guided-practice/index.mjs';
import {UPPER_NEW_PACK_IDS,UPPER_CHAPTERS} from '../src/data/upper-core-plan.mjs';

const ALL_PRACTICE_PACKS=[...PRACTICE_PACKS,...packs];
assert.deepEqual(packs.map(p=>p.id).sort(),[...UPPER_NEW_PACK_IDS].sort(),'Frozen data matches the closed approved inventory');
const require=createRequire(process.env.PLAYWRIGHT_RUNTIME||'C:/Users/kenneth/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=require('playwright');
const arg=name=>process.argv.includes(name)?process.argv[process.argv.indexOf(name)+1]:null;
let origin=arg('--base')||process.env.MATH_QA_ORIGIN||'http://127.0.0.1:4399',server;
const output=resolve(arg('--output')||'.tmp/guided-practice-upper-browser-qa');
const executablePath=process.env.QA_BROWSER_EXECUTABLE||'C:/Users/kenneth/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
if(arg('--serve')){
 const directory=resolve(arg('--serve')),types={'.html':'text/html;charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
 server=createServer(async(req,res)=>{try{let file=resolve(directory,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(file!==directory&&!file.startsWith(directory+sep))throw Error('outside frozen directory');if((await stat(file)).isDirectory())file=resolve(file,'index.html');res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(file));}catch{res.writeHead(404);res.end('Not found');}});
 await new Promise(done=>server.listen(0,'127.0.0.1',done));origin='http://127.0.0.1:'+server.address().port;
}
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath,headless:true});
const report={startedAt:new Date().toISOString(),origin,browser:browser.version(),executablePath,approvedPackIds:UPPER_NEW_PACK_IDS,isolation:'Disposable contexts with synthetic records only; no application mocks.',cases:[],pageErrors:[],printIssues:[]};
const manifest={origin,expectedPackIds:UPPER_NEW_PACK_IDS,locales:['en','zh-Hant'],editions:['student','teacher','supplement'],pdfs:[]};
const pathFor=(pack,locale,teacher=false)=>`${locale==='zh-Hant'?'/zh':''}/teaching/classroom-packs/${pack.id}/${teacher?'teacher/':''}`;
const snapshot=page=>page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(key=>[key,localStorage.getItem(key)])));
const oldBytes={
 'jae-math-v1':' '+JSON.stringify({version:1,answers:{'qa-unknown':{input:'5',notes:'QA_OLD',unknownField:'retain'}},last:{question:'qa-unknown'}})+' ',
 'senior-math-study-v2':JSON.stringify({version:2,history:{'qa-unknown':[{eventId:'qa-old',notes:'QA_HISTORY'}]}}),
 'math-studio-practice-v2':JSON.stringify({'qa-future':1700000000000}),
 'math-studio-inquiry-v2':JSON.stringify({'qa-unknown':{prediction:'QA_PREDICTION',unknownField:{keep:true}}}),
 'math-studio-inquiry-g7-v1':JSON.stringify({'qa-unknown':{prediction:'QA_G7'}}),
 'math-studio-inquiry-g8-v1':JSON.stringify({'qa-unknown':{prediction:'QA_G8',evidence:[{eventId:'qa-original',at:1}]}}),
 'qa-unrelated-record':'  opaque unrelated bytes  ',
};
async function seed(page,bytes=oldBytes){await page.goto(origin+'/teaching/',{waitUntil:'networkidle'});await page.evaluate(bytes=>{localStorage.clear();for(const[key,value]of Object.entries(bytes))localStorage.setItem(key,value);},bytes);}
async function ready(page,pack,locale='en',teacher=true){const response=await page.goto(origin+pathFor(pack,locale,teacher),{waitUntil:'networkidle'});assert.equal(response.status(),200);await page.locator(`[data-guided-practice="${pack.id}"][data-locale="${locale}"]`).waitFor();await page.waitForFunction(()=>document.querySelector('[data-practice-current-index]'));await page.evaluate(()=>document.fonts.ready);}
async function download(page,trigger,file){await page.bringToFront();const[item]=await Promise.all([page.waitForEvent('download',{timeout:10000}),trigger()]);await item.saveAs(resolve(output,file));return JSON.parse(await readFile(resolve(output,file),'utf8'));}
async function revealAll(page){const prep=page.locator('[data-guided-teacher-preparation]');if(await prep.getAttribute('open')===null)await prep.locator('summary').first().click();await page.locator('[data-practice-reveal-all]').click();}
async function persist(){await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));await writeFile(resolve(output,'pdf-manifest.json'),JSON.stringify(manifest,null,2));}
async function test(name,run){if(process.env.QA_CASES&&!process.env.QA_CASES.split(',').includes(name))return;const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});context.on('page',page=>page.on('pageerror',error=>report.pageErrors.push({case:name,url:page.url(),error:String(error)})));const page=await context.newPage();try{const evidence=await run(page,context);report.cases.push({name,status:'passed',evidence});console.log('PASS '+name);}catch(error){await page.screenshot({path:resolve(output,name+'-failure.png'),fullPage:true}).catch(()=>{});report.cases.push({name,status:'failed',error:String(error),stack:error.stack});console.error('FAIL '+name+' '+error.message);}finally{await context.close();await persist();}}
function scrubSolutions(value){if(Array.isArray(value))return value.map(scrubSolutions);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!/^solution/i.test(key)).map(([key,item])=>[key,scrubSolutions(item)]));return value;}
function assertScrubbed(value){if(!value||typeof value!=='object')return;for(const[key,item]of Object.entries(value)){assert.ok(!['answer','answerExpression','steps','numericAnswer','correctChoice','audit'].includes(key)&&!/^solution/i.test(key),'Student export leaks '+key);assertScrubbed(item);}}
function forbiddenPrintAnswers(questions,locale){
 // A choice task necessarily prints every option, including the correct one.
 // Exempt only complete answer text already authored as question content.
 const authored=questions.flatMap(q=>[q.prompt[locale],...(q.options||[]).map(row=>row[locale]),...(q.scaffold||[]).map(row=>row[locale])]);
 return ['Reference answer','參考答案',...questions.map(q=>q.answer[locale]).filter(answer=>answer.length>25&&!authored.some(text=>text.includes(answer)))];
}
function hiddenDerivedInput(pack,q){return q.audit.kind==='word-model'||Boolean(q.audit.context)||['g8-rational-equations:prior:daily-rate','g7-rational-number-line:prior:signed-loss','g7-rational-number-line:independent:compare-negatives','g7-rational-number-line:supplement:compare-fractions'].includes(q.id)||(pack.grade==='g8'&&q.numericAnswer!==undefined&&['triangle-sides','triangle-angles','polygon','special-triangle','concept'].includes(q.audit.kind));}
async function printPdf(page,pack,locale,edition){
 const root=page.locator(`[data-practice-print-root][data-edition="${edition}"]`);assert.equal(await root.count(),1);
 const questions=pack.questions.filter(q=>edition==='teacher'||(edition==='supplement'?['supplement','extension'].includes(q.role):['worked','guided','prior','independent','exit'].includes(q.role)));
 const ids=await root.locator('[data-question-id]').evaluateAll(nodes=>nodes.map(node=>node.dataset.questionId));assert.deepEqual(ids,questions.map(q=>q.id));
 if(edition!=='teacher')assert.equal(await root.locator('[data-practice-answer-content],[data-practice-solution],.guided-answer').count(),0,'Blank print data has no answer markup');
 else{assert.equal(await root.locator('.guided-answer').count(),16,'Teacher print contains all sixteen solution blocks');assert.equal(await root.locator('.guided-teacher-rubric').count(),16);}
 for(const q of questions.filter(q=>hiddenDerivedInput(pack,q)))assert.equal(await root.locator(`[data-question-id="${q.id}"] .guided-question-body .math-expression`).count(),0,q.id+'/'+edition+'/requested model or derived output is absent from the printed question givens');
 await page.locator('[data-practice-print-edition]').selectOption(edition);await page.emulateMedia({media:'print'});
 const overflow=await root.locator('.katex-display > .katex').evaluateAll(nodes=>nodes.flatMap(node=>{const card=node.closest('[data-question-id]'),a=node.getBoundingClientRect(),b=card.getBoundingClientRect();return a.width&&b.width&&(a.left<b.left-1||a.right>b.right+1)?[{id:card.dataset.questionId,formula:[a.left,a.right],card:[b.left,b.right]}]:[];}));
 if(edition==='student')overflow.push(...await root.locator('.guided-paper-page').evaluateAll(nodes=>nodes.flatMap((node,index)=>{const footer=node.querySelector(':scope > footer').getBoundingClientRect(),bottom=Math.max(...[...node.querySelectorAll('[data-question-id]')].map(card=>card.getBoundingClientRect().bottom));return bottom>footer.top+.01?[{type:'footer-card-overlap',page:index+1,cardBottom:bottom,footerTop:footer.top}]:[];})));
 if(overflow.length)report.printIssues.push({packId:pack.id,locale,edition,overflow});
 await page.emulateMedia({media:null});
 const file=`${pack.id}-${locale}-${edition}.pdf`;await page.pdf({path:resolve(output,file),format:'A4',preferCSSPageSize:true,printBackground:true,tagged:true});
 const record={file,packId:pack.id,locale,edition,questionIds:ids,printLayoutIssues:overflow,requiredText:questions.map(q=>q.prompt[locale]),forbiddenText:edition==='teacher'?[]:forbiddenPrintAnswers(questions,locale),expectedPages:edition==='student'?2:undefined};
 if(edition==='student'){record.pageOneText=questions.slice(0,4).map(q=>q.prompt[locale]);record.pageTwoText=questions.slice(4).map(q=>q.prompt[locale]);}
 if(edition==='teacher')record.requiredGroups={allReferenceAnswers:questions.map(q=>q.answer[locale])};
 manifest.pdfs.push(record);await persist();
 await page.waitForFunction(()=>document.querySelector('[data-practice-print-edition]').value==='student');assert.equal(await page.locator('[data-guided-practice]').getAttribute('data-print-edition'),'student');
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('[data-practice-print-root]:visible').count(),1);assert.ok(await page.locator('[data-practice-print-root][data-edition="student"]').isVisible());await page.emulateMedia({media:null});
}

try{
 await test('all-new-bilingual-fixed-editions-exports-and-legacy-preservation',async page=>{
  await seed(page);const before=await snapshot(page);let pdfs=0,exports=0;
  for(const pack of packs)for(const locale of ['en','zh-Hant']){
   await ready(page,pack,locale);assert.equal(await page.locator('[data-practice-question]').count(),16);assert.equal(await page.locator('[data-practice-answer-content]:visible,[data-practice-step-content]:visible,[data-practice-hint-content]:visible').count(),0);for(const q of pack.questions.filter(q=>hiddenDerivedInput(pack,q)))assert.equal(await page.locator(`[data-practice-question][data-question-id="${q.id}"] .guided-question-body .math-expression`).count(),0,q.id+'/screen question does not preprint the requested model or derived answer');
   await revealAll(page);for(const edition of ['student','teacher','supplement']){await printPdf(page,pack,locale,edition);pdfs++;}
   const teacher=await download(page,()=>page.locator('[data-practice-export="teacher"]').click(),`${pack.id}-${locale}-teacher.json`);assert.deepEqual(teacher.questions,JSON.parse(JSON.stringify(pack.questions)),'Built JSON export matches every serializable frozen source field and fixed choice rotation');exports++;
   await ready(page,pack,locale,false);const student=await download(page,()=>page.locator('[data-practice-export="student"]').click(),`${pack.id}-${locale}-student.json`);assertScrubbed(student);exports++;
   assert.deepEqual(student.questions.map(q=>q.id),pack.questions.map(q=>q.id));for(let i=0;i<16;i++){assert.deepEqual(student.questions[i].prompt,teacher.questions[i].prompt);assert.deepEqual(student.questions[i].diagram,scrubSolutions(teacher.questions[i].diagram));assert.deepEqual(student.questions[i].expression,teacher.questions[i].expression);}
   assert.deepEqual(await snapshot(page),before,pack.id+'/'+locale+'/presentation must preserve exact legacy bytes');
  }
  assert.equal(pdfs,UPPER_NEW_PACK_IDS.length*6);assert.deepEqual(report.printIssues,[],'All printed formulas must fit their own question columns; every failure remains in the complete PDF collection');return {packs:packs.length,languages:2,pdfs,jsonDownloads:exports,studentPrintAfterRevealAll:true,studentExportHasNoAnswersOrSolutionGeometry:true,oldCanonicalBytesUnchanged:true};
 });
 await test('all-new-teacher-pacing-and-session-only-reveals',async page=>{
  await seed(page);const before=await snapshot(page);
  for(const pack of packs){await ready(page,pack);const active=()=>page.locator('[data-practice-question][data-current="true"]'),first=await active().getAttribute('data-question-id');await page.locator('[data-practice-next]').click();assert.notEqual(await active().getAttribute('data-question-id'),first);await page.locator('[data-practice-prev]').click();assert.equal(await active().getAttribute('data-question-id'),first);await page.locator('[data-practice-hint]').click();assert.equal(await active().locator('[data-practice-hint-content]:visible').count(),1);await page.locator('[data-practice-answer]').click();assert.equal(await active().locator('[data-practice-answer-content]:visible').count(),1);await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('[data-practice-answer-content]:visible,[data-practice-hint-content]:visible,[data-practice-step-content]:visible').count(),0);assert.equal(await page.locator('[data-practice-print-edition]').inputValue(),'student');}
  assert.deepEqual(await snapshot(page),before);return {packs:packs.length,controlsAndReloadVerified:true,noNewLocalStorageKey:true};
 });
 await test('all-new-mobile-language-and-keyboard',async page=>{
  await page.setViewportSize({width:390,height:844});let layouts=0,switches=0;
  for(const pack of packs)for(const locale of ['en','zh-Hant']){await ready(page,pack,locale);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),pack.id+'/'+locale+'/390px horizontal overflow');layouts++;
   await page.locator('[data-practice-route]').selectOption('inquiry');await page.locator('[data-language-switch]').click();const target=locale==='en'?'zh-Hant':'en';await page.locator(`[data-guided-practice="${pack.id}"][data-locale="${target}"]`).waitFor();assert.equal(await page.locator('[data-practice-route]').inputValue(),'inquiry');assert.equal(new URL(page.url()).searchParams.get('route'),'inquiry');assert.equal(await page.locator('[data-practice-answer-content]:visible,[data-practice-step-content]:visible,[data-practice-hint-content]:visible').count(),0);switches++;
   await page.locator('[data-practice-route]').selectOption('practice');const active=()=>page.locator('[data-practice-question][data-current="true"]'),first=await active().getAttribute('data-question-id');await active().focus();await page.keyboard.press('ArrowRight');assert.notEqual(await active().getAttribute('data-question-id'),first);await page.keyboard.press('ArrowLeft');assert.equal(await active().getAttribute('data-question-id'),first);
   await page.locator('[data-practice-phase]').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-guided-practice]').getAttribute('data-practice-current-index'),'0','Focused native select must not invoke custom next-question navigation');
  }
  return {viewport:[390,844],packLanguageLayouts:layouts,trustedLanguageSwitches:switches,inquiryRouteRetained:true,keyboardVerified:true};
 });
 await test('all-new-native-chapter-links',async page=>{
  await seed(page);const before=await snapshot(page);let clicks=0;
  for(const locale of ['en','zh-Hant'])for(const pack of packs){
   await page.goto(origin+`/math-studio/?lesson=${pack.nativeLesson}&lang=${locale}`,{waitUntil:'networkidle'});
   const link=page.locator(`[data-guided-practice-link="${pack.id}"]`);await link.waitFor();
   const chapter=UPPER_CHAPTERS.find(c=>c.packIds.includes(pack.id)),heading=await page.locator('.lesson-sub').innerText(),navigation=await page.locator('[data-practice-source-navigation]').innerText();
   assert.ok(heading.includes(chapter.title[locale])&&heading.includes(locale==='en'?`Chapter ${chapter.number}`:`第${chapter.number}章`),pack.id+'/native heading uses the supplied textbook chapter');
   assert.ok(heading.includes(chapter.pages.join('–')),pack.id+'/correct chapter printed pages');assert.ok(navigation.includes(chapter.title[locale]),pack.id+'/native source navigation');
   assert.ok((await link.locator('..').innerText()).includes(pack.sourceNavigation[locale]),pack.id+'/per-pack bilingual source navigation');
   assert.equal(await link.getAttribute('href'),pathFor(pack,locale));assert.equal(/[\u3400-\u9fff]/u.test(await link.innerText()),locale==='zh-Hant');
   await link.click();await page.locator(`[data-guided-practice="${pack.id}"][data-locale="${locale}"]`).waitFor();assert.deepEqual(await snapshot(page),before);clicks++;
  }return {trustedNativeChapterClicks:clicks,correctSuppliedTextbookChapterAndPages:true,bilingualSourceNavigation:true,canonicalRecordsUnchanged:true};
 });
 await test('closed-curriculum-and-valid-inquiry-entries',async(page,context)=>{
  let curriculumClicks=0,inquiryLinks=0;const checked=new Set();
  for(const locale of ['en','zh-Hant']){const curriculum=origin+(locale==='zh-Hant'?'/zh':'')+'/teaching/classroom-packs/curriculum/';await page.goto(curriculum,{waitUntil:'networkidle'});await page.locator('[data-upper-core-curriculum][data-classroom-index]').waitFor();assert.deepEqual((await page.locator('[data-upper-chapter]').evaluateAll(nodes=>nodes.map(node=>node.dataset.upperChapter))).sort(),UPPER_CHAPTERS.map(c=>c.id).sort());assert.deepEqual((await page.locator('[data-upper-pack]').evaluateAll(nodes=>nodes.map(node=>node.dataset.upperPack))).sort(),ALL_PRACTICE_PACKS.map(p=>p.id).sort());
   for(const pack of packs){await page.goto(curriculum,{waitUntil:'networkidle'});const row=page.locator(`[data-upper-pack="${pack.id}"]`);assert.equal(await row.locator('a').count(),3);await row.locator(`a[href="${pathFor(pack,locale)}"]`).click();await page.locator(`[data-guided-practice="${pack.id}"][data-locale="${locale}"]`).waitFor();curriculumClicks++;
    const links=await page.locator('[data-practice-inquiry] a[href*="/math-studio/"]').evaluateAll(nodes=>nodes.map(node=>({href:node.getAttribute('href'),native:node.hasAttribute('data-practice-native')})));
    for(const link of links.filter(link=>!link.native)){const url=new URL(link.href,origin);assert.equal(url.searchParams.get('lang'),locale);assert.ok(url.hash.startsWith('#g8/')||url.searchParams.has('lab'),'Inquiry link must identify an actual lab rather than the general home');if(!checked.has(url.href)){const response=await context.request.get(url.href);assert.equal(response.status(),200,url.href);checked.add(url.href);}inquiryLinks++;}
   }
  }return {chapterCount:UPPER_CHAPTERS.length,curriculumPacks:ALL_PRACTICE_PACKS.length,trustedNewPackClicks:curriculumClicks,inquiryAnchors:inquiryLinks,uniqueInquiryDestinations:checked.size,allDestinationsHTTP200:true,limit:'Checks entry URLs and chapter navigation; it does not claim to rerun every existing inquiry engine.'};
 });
 await test('malformed-legacy-records-remain-exact-through-new-pack-output',async page=>{
  await seed(page,{...oldBytes,'math-studio-practice-v2':' { damaged practice bytes ','math-studio-inquiry-g7-v1':'[invalid old inquiry'});const before=await snapshot(page);
  for(const grade of ['g7','g8']){const pack=packs.find(p=>p.grade===grade);await ready(page,pack,'zh-Hant',false);await revealAll(page);await download(page,()=>page.locator('[data-practice-export="student"]').click(),grade+'-corrupt-legacy-student.json');await page.emulateMedia({media:null});await page.pdf({path:resolve(output,grade+'-corrupt-legacy-student.pdf'),format:'A4',preferCSSPageSize:true});assert.deepEqual(await snapshot(page),before);}return {invalidJSONAndUnknownWhitespaceBytesPreserved:true,bothGrades:true};
 });
 await test('new-catalog-forced-overlap-classroom-and-native-backup-roundtrip',async(page,context)=>{
  await seed(page);const other=await context.newPage();await Promise.all([page.goto(origin+'/teaching/math/',{waitUntil:'networkidle'}),other.goto(origin+'/teaching/math/',{waitUntil:'networkidle'})]);
  await Promise.all([page,other].map(target=>target.evaluate(()=>{window.__upperQaEvents=0;addEventListener('storage',()=>window.__upperQaEvents++);})));
  const chosen=[packs.find(p=>p.grade==='g7'),packs.find(p=>p.grade==='g8')],ids=chosen.map(p=>'classroom:'+p.id);
  for(const[target,pack]of [[page,chosen[0]],[other,chosen[1]]])await target.locator('[data-filter-query]').fill(pack.id);
  const locker=await context.newPage();await locker.goto(origin+'/teaching/',{waitUntil:'networkidle'});await locker.evaluate(()=>{void navigator.locks.request('math-learning:writer:v1',async()=>{window.__upperQaHeld=true;await new Promise(done=>window.__upperQaRelease=done);});});await locker.waitForFunction(()=>window.__upperQaHeld);
  try{await Promise.all([page.locator(`[data-add-id="${ids[0]}"]`).click(),other.locator(`[data-add-id="${ids[1]}"]`).click()]);assert.equal(await page.evaluate(()=>localStorage.getItem('math-system-notebook-v1')),null,'Both new additions must still wait behind the common writer lock');}finally{await locker.evaluate(()=>window.__upperQaRelease());await locker.close();}
  await Promise.all([page.evaluate(()=>MathStorage.flushAll()),other.evaluate(()=>MathStorage.flushAll())]);
  await page.waitForFunction(ids=>{const saved=JSON.parse(localStorage.getItem('math-system-notebook-v1')||'{}');return ids.every(id=>saved.classroom?.ids.includes(id));},ids);
  await Promise.all([page.locator('[data-system-view="classroom"]').click(),other.locator('[data-system-view="classroom"]').click()]);
  await page.locator('[data-system-classroom-title]').fill('QA_UPPER_CORE_40_MIN');await page.evaluate(()=>MathStorage.flushAll());await other.waitForFunction(()=>document.querySelector('[data-system-classroom-title]').value==='QA_UPPER_CORE_40_MIN');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('math-system-notebook-v1')).classroom);assert.ok(ids.every(id=>saved.ids.includes(id)));
  await page.locator('[data-system-view="learning"]').click();const backup=await download(page,()=>page.locator('[data-system-backup-download]').click(),'upper-system-backup.json');
  const fresh=await browser.newContext({acceptDownloads:true});try{const target=await fresh.newPage();await target.goto(origin+'/teaching/math/?view=learning',{waitUntil:'networkidle'});await target.locator('[data-system-backup-file]').setInputFiles({name:'upper-system-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await target.locator('[data-system-import-preview]').waitFor();await download(target,()=>target.locator('[data-system-backup-apply]').click(),'before-upper-import.json');await target.waitForFunction(()=>document.querySelector('[data-system-backup-status]').textContent.includes('Selected records restored'));assert.deepEqual(await target.evaluate(()=>JSON.parse(localStorage.getItem('math-system-notebook-v1')).classroom),saved);for(const[key,value]of Object.entries(oldBytes).filter(([key])=>key!=='qa-unrelated-record'))assert.equal(await target.evaluate(key=>localStorage.getItem(key),key),value);}finally{await fresh.close();}
  const events=await Promise.all([page,other].map(target=>target.evaluate(()=>window.__upperQaEvents)));assert.ok(events.every(n=>n>0));return {newCatalogIds:ids,forcedSharedWriterOverlap:true,classroomTitleBothTabs:true,storageEvents:events,nativeBackupRestoredIntoFreshContext:true,legacyBytesExact:true};
 });
 await test('rendered-new-geometry-givens-coordinates-and-solution-privacy',async page=>{
  let diagrams=0,geometry=0,numberLines=0,angleDiagrams=0,solids=0;
  for(const pack of packs){await ready(page,pack);for(const q of pack.questions.filter(q=>q.diagram)){
   const d=q.diagram,svg=page.locator(`[data-practice-question][data-question-id="${q.id}"] svg`).first();assert.equal(await svg.count(),1,q.id);const drawing=await svg.evaluate(svg=>({dots:[...svg.querySelectorAll('circle[r="2.8"]')].map(el=>[Number(el.getAttribute('cx')),Number(el.getAttribute('cy'))]),labels:[...svg.querySelectorAll('text')].map(el=>({text:el.textContent,p:[Number(el.getAttribute('x')),Number(el.getAttribute('y'))]})),right:svg.querySelectorAll('path.right').length,ticks:svg.querySelectorAll('line.mark').length,arcs:svg.querySelectorAll('path.construction').length,lines:[...svg.querySelectorAll('line')].map(el=>[[Number(el.getAttribute('x1')),Number(el.getAttribute('y1'))],[Number(el.getAttribute('x2')),Number(el.getAttribute('y2'))]]),ellipses:svg.querySelectorAll('ellipse').length}));
   const named=id=>{const label=drawing.labels.find(label=>label.text===id);assert.ok(label,q.id+'/actual SVG label '+id);const dot=drawing.dots.toSorted((a,b)=>Math.hypot(a[0]-label.p[0],a[1]-label.p[1])-Math.hypot(b[0]-label.p[0],b[1]-label.p[1]))[0];assert.ok(dot,q.id+'/actual dot '+id);return dot;};
   if(['geometry','coordinate'].includes(d.kind)){
    const raw=d.points;assert.ok(raw.length>=(d.kind==='coordinate'?1:2));let scale;
    for(let i=0;i<raw.length;i++)for(let j=i+1;j<raw.length;j++){const distance=(raw[i].x-raw[j].x)**2+(raw[i].y-raw[j].y)**2;if(distance<1e-10)continue;const a=named(raw[i].label||raw[i].id),b=named(raw[j].label||raw[j].id),ratio=((a[0]-b[0])**2+(a[1]-b[1])**2)/distance;if(scale===undefined)scale=ratio;else assert.ok(Math.abs(ratio-scale)<1e-7*Math.max(1,scale),q.id+'/rendered distances preserve authored coordinates');}
    if(d.kind==='coordinate'){const grid=await svg.locator('line.axis,line.grid').evaluateAll(nodes=>nodes.map(node=>({axis:node.classList.contains('axis'),a:[Number(node.getAttribute('x1')),Number(node.getAttribute('y1'))],b:[Number(node.getAttribute('x2')),Number(node.getAttribute('y2'))]}))),vertical=grid.filter(line=>Math.abs(line.a[0]-line.b[0])<1e-8),horizontal=grid.filter(line=>Math.abs(line.a[1]-line.b[1])<1e-8),origin=[vertical.find(line=>line.axis).a[0],horizontal.find(line=>line.axis).a[1]],xs=vertical.map(line=>line.a[0]).sort((a,b)=>a-b),unit=xs.slice(1).map((x,i)=>x-xs[i]).filter(n=>n>1e-8).sort((a,b)=>a-b)[0];assert.ok(unit>0);for(const point of raw){const actual=named(point.label||point.id);assert.ok(Math.abs((actual[0]-origin[0])/unit-point.x)<1e-7&&Math.abs((origin[1]-actual[1])/unit-point.y)<1e-7,q.id+'/actual plotted point matches signed coordinates relative to real axes');}}
    assert.equal(drawing.right,(d.rightAngles||[]).length,q.id+'/only given perpendicular marks');assert.equal(drawing.arcs,(d.equalAngles||[]).reduce((sum,group)=>sum+group.length,0),q.id+'/only given equal angle arcs');assert.equal(drawing.ticks,(d.equalSegments||[]).reduce((sum,group,i)=>sum+group.length*(i+1),0),q.id+'/only given equal length ticks');
    for(const point of d.solutionPoints||[])assert.ok(!drawing.labels.some(label=>label.text===(point.label||point.id)),q.id+'/requested solution point hidden on screen');geometry++;
   }else if(d.kind==='number-line'){for(const p of d.points||[]){const point=named(p.id||String(p.value));assert.ok(Math.abs(point[0]-(40+(p.value-d.min)/(d.max-d.min)*300))<1e-8&&point[1]===150,q.id+'/number line point is actually at correct value');}numberLines++;}
   else if(d.kind==='angle'){const origin=named(d.origin||'O');for(const ray of d.rays){const p=named(ray.id),dx=p[0]-origin[0],dy=origin[1]-p[1],angle=Math.atan2(dy,dx)*180/Math.PI,delta=(angle-ray.degrees)*Math.PI/180;assert.ok(Math.abs(Math.sin(delta))<1e-8&&Math.cos(delta)>0,q.id+'/actual ray direction, including bearing orientation');}assert.equal(drawing.right,(d.rightPairs||[]).length);angleDiagrams++;}
   else if(d.kind==='solid'){if(d.shape==='cylinder')assert.equal(drawing.ellipses,2);else assert.equal(drawing.lines.length,12);solids++;}
   else assert.ok(['construction','shape','mirror-pair','bisector','perpendicular-bisector'].includes(d.kind),q.id+'/unsupported actual SVG audit '+d.kind);
   diagrams++;
  }}assert.ok(diagrams>0&&geometry>0&&numberLines>0&&angleDiagrams>0&&solids>0,'All new renderer families need real SVG checks');return {diagrams,geometry,numberLines,angleDiagrams,solids,coordinateAndGivenMarksVerified:true,solutionPointsHidden:true};
 });
}finally{report.completedAt=new Date().toISOString();report.passed=report.cases.length>0&&report.cases.every(c=>c.status==='passed')&&report.pageErrors.length===0;await persist();await browser.close();if(server)await new Promise(done=>server.close(done));}
assert.ok(report.passed,JSON.stringify({failed:report.cases.filter(c=>c.status!=='passed'),pageErrors:report.pageErrors}));
