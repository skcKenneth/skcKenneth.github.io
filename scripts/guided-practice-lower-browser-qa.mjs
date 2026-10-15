// Actual disposable browser, native downloads, storage events and all new A4 editions.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {LOWER_PRACTICE_PACKS as packs,PRACTICE_PACKS} from '../src/data/guided-practice/index.mjs';
import {LOWER_NEW_PACK_IDS,LOWER_CHAPTERS} from '../src/data/lower-core-plan.mjs';
import {splitAuthoredMath} from '../src/lib/authored-math.mjs';
import katex from 'katex';

const ALL_PRACTICE_PACKS=packs;
assert.deepEqual(packs.map(p=>p.id).sort(),[...LOWER_NEW_PACK_IDS].sort(),'Frozen data matches the closed approved inventory');
const require=createRequire(process.env.PLAYWRIGHT_RUNTIME||'C:/Users/kenneth/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=require('playwright');
const arg=name=>process.argv.includes(name)?process.argv[process.argv.indexOf(name)+1]:null;
let origin=arg('--base')||process.env.MATH_QA_ORIGIN||'http://127.0.0.1:4399',server;
const output=resolve(arg('--output')||'.tmp/guided-practice-lower-browser-qa');
const executablePath=process.env.QA_BROWSER_EXECUTABLE||'C:/Users/kenneth/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
if(arg('--serve')){
 const directory=resolve(arg('--serve')),types={'.html':'text/html;charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
 server=createServer(async(req,res)=>{try{let file=resolve(directory,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(file!==directory&&!file.startsWith(directory+sep))throw Error('outside frozen directory');if((await stat(file)).isDirectory())file=resolve(file,'index.html');res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(file));}catch{res.writeHead(404);res.end('Not found');}});
 await new Promise(done=>server.listen(0,'127.0.0.1',done));origin='http://127.0.0.1:'+server.address().port;
}
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath,headless:true});
const report={startedAt:new Date().toISOString(),origin,browser:browser.version(),executablePath,approvedPackIds:LOWER_NEW_PACK_IDS,isolation:'Disposable contexts with synthetic records only; no application mocks.',cases:[],pageErrors:[],printIssues:[]};
const manifest={origin,expectedPackIds:LOWER_NEW_PACK_IDS,locales:['en','zh-Hant'],editions:['student','teacher','supplement'],pdfs:[]};
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
const plainParts=text=>splitAuthoredMath(text).filter(part=>part.kind==='text').map(part=>part.value.trim()).filter(Boolean);
const requiredText=rows=>rows.flatMap(plainParts);
function authoredRows(questions,locale,edition){
 const rows=[],add=(selector,text,mathOnly=false)=>{const parts=mathOnly?[{kind:'math',value:text}]:splitAuthoredMath(text);rows.push({selector,text:parts.filter(p=>p.kind==='text').map(p=>p.value).join(''),expressions:parts.filter(p=>p.kind==='math').map(p=>p.value),markup:parts.filter(p=>p.kind==='math').map(p=>katex.renderToString(p.value,{output:'htmlAndMathml',displayMode:mathOnly,throwOnError:true,trust:false})),mathOnly});};
 for(const q of questions){const base='[data-question-id="'+q.id+'"] ';
  add(base+'.guided-prompt',q.prompt[locale]);
  for(const [key,selector]of [['options','.guided-options > li'],['scaffold','.guided-scaffold > li']])for(const[v,i]of (q[key]||[]).map((v,i)=>[v,i]))add(base+selector+':nth-child('+(i+1)+')',v[locale]);
  if(q.expression)add(base+'.guided-question-text > .math-expression--display',q.expression,true);
  if(edition==='teacher'||edition==='screen'){
   add(base+'.guided-answer > p',q.answer[locale]);if(q.answerExpression)add(base+'.guided-answer > .math-expression--display',q.answerExpression,true);
   for(const[v,i]of q.steps.map((v,i)=>[v,i]))add(base+(edition==='screen'?'.guided-solution-steps > li':'.guided-answer > ol > li')+':nth-child('+(i+1)+')',v[locale]);
   for(const[v,i]of q.rubric.map((v,i)=>[v,i]))add(base+(edition==='screen'?'.guided-rubric li':'.guided-teacher-rubric > li')+':nth-child('+(i+1)+')',v[locale]);
   if(edition==='screen')for(const[v,i]of q.hints.map((v,i)=>[v,i]))add(base+'.guided-hints > li:nth-child('+(i+1)+')',v[locale]);
  }
 }return rows;
}
async function auditAuthoredMath(root,questions,locale,edition){
 const rows=authoredRows(questions,locale,edition),result=await root.evaluate((root,rows)=>{
  const problems=[],compact=s=>s.replace(/\s+/g,''),normalMath=markup=>{const box=document.createElement('div');box.innerHTML=markup;return box.querySelector('math')?.innerHTML;};
  for(const row of rows){const nodes=root.querySelectorAll(row.selector);if(nodes.length!==1){problems.push({selector:row.selector,reason:'expected exactly one source field',count:nodes.length});continue;}const node=nodes[0],math=[...node.querySelectorAll('math')],annotations=math.map(m=>m.querySelector('annotation[encoding="application/x-tex"]')?.textContent);
   if(JSON.stringify(annotations)!==JSON.stringify(row.expressions))problems.push({selector:row.selector,reason:'source TeX annotation sequence differs',expected:row.expressions,actual:annotations});
   for(let i=0;i<math.length;i++){if(math[i].innerHTML!==normalMath(row.markup[i]))problems.push({selector:row.selector,reason:'actual MathML structure differs from independent KaTeX rendering',index:i});if(!math[i].querySelector('semantics')?.firstElementChild?.textContent.trim())problems.push({selector:row.selector,reason:'empty semantic mathematics'});}
   if(!row.mathOnly){const clone=node.cloneNode(true);clone.querySelectorAll('[data-authored-math]').forEach(el=>el.remove());if(compact(clone.textContent)!==compact(row.text))problems.push({selector:row.selector,reason:'authored plain text differs after removing only explicit math spans'});}
  }return {fields:rows.length,expectedExpressions:rows.reduce((n,r)=>n+r.expressions.length,0),problems};
 },rows);assert.deepEqual(result.problems,[],questions[0]?.id+'/'+edition+'/authored text and actual MathML');return {...result,passed:true};
}
async function auditTeacherIntro(root,pack,locale){
 const source=[pack.taskTeacher?.[locale]||'',pack.prerequisites[locale],...(pack.inquiryStages?pack.inquiryStages.map(s=>s.task[locale]):[pack.inquiry[locale]])],expressions=source.flatMap(text=>splitAuthoredMath(text).filter(p=>p.kind==='math').map(p=>p.value)),markup=expressions.map(value=>katex.renderToString(value,{output:'htmlAndMathml',displayMode:false,throwOnError:true,trust:false}));
 const result=await root.locator(':scope > header').evaluate((header,{expressions,markup})=>{const maths=[...header.querySelectorAll('math')],actual=maths.map(m=>m.querySelector('annotation[encoding="application/x-tex"]')?.textContent),problems=[];if(JSON.stringify(actual)!==JSON.stringify(expressions))problems.push('Teacher introduction source TeX sequence differs');for(let i=0;i<maths.length;i++){const box=document.createElement('div');box.innerHTML=markup[i]||'';if(maths[i].innerHTML!==box.querySelector('math')?.innerHTML)problems.push('Teacher introduction actual MathML differs at '+i);}return {expectedExpressions:expressions.length,problems};},{expressions,markup});assert.deepEqual(result.problems,[],pack.id+'/'+locale+'/teacher prerequisites and inquiry actual MathML');return {...result,passed:true};
}
function forbiddenPrintAnswers(questions,locale){
 // A choice task necessarily prints every option, including the correct one.
 // Exempt only complete answer text already authored as question content.
 const authored=questions.flatMap(q=>[q.prompt[locale],...(q.options||[]).map(row=>row[locale]),...(q.scaffold||[]).map(row=>row[locale])]);
 return ['Reference answer','參考答案',...questions.flatMap(q=>plainParts(q.answer[locale])).filter(answer=>answer.length>25&&!authored.some(text=>text.includes(answer)))];
}
function hiddenDerivedInput(pack,q){return q.audit.kind==='word-model'||q.audit.kind==='linear-system'&&Boolean(q.audit.context)||q.type==='construction'&&!q.expression;}
async function printPdf(page,pack,locale,edition){
 const root=page.locator(`[data-practice-print-root][data-edition="${edition}"]`);assert.equal(await root.count(),1);
 const questions=pack.questions.filter(q=>edition==='teacher'||(edition==='supplement'?['supplement','extension'].includes(q.role):['worked','guided','prior','independent','exit'].includes(q.role)));
 const ids=await root.locator('[data-question-id]').evaluateAll(nodes=>nodes.map(node=>node.dataset.questionId));assert.deepEqual(ids,questions.map(q=>q.id));
 if(edition!=='teacher')assert.equal(await root.locator('[data-practice-answer-content],[data-practice-solution],.guided-answer').count(),0,'Blank print data has no answer markup');
 else{assert.equal(await root.locator('.guided-answer').count(),16,'Teacher print contains all sixteen solution blocks');assert.equal(await root.locator('.guided-teacher-rubric').count(),16);}
 for(const q of questions.filter(q=>hiddenDerivedInput(pack,q)))assert.equal(await root.locator(`[data-question-id="${q.id}"] .guided-question-body .math-expression--display`).count(),0,q.id+'/'+edition+'/requested model or derived output is absent from the printed question givens');
 await page.locator('[data-practice-print-edition]').selectOption(edition);await page.emulateMedia({media:'print'});
 const overflow=await root.locator('.math-expression .katex-html').evaluateAll(nodes=>nodes.flatMap(node=>{const card=node.closest('[data-question-id]'),container=card||node.closest('header')||node.closest('[data-practice-print-root]'),a=node.getBoundingClientRect(),b=container.getBoundingClientRect();return a.width&&b.width&&(a.left<b.left-1||a.right>b.right+1)?[{id:card?.dataset.questionId||'teacher-introduction',formula:[a.left,a.right],card:[b.left,b.right]}]:[];}));
 if(edition==='student')overflow.push(...await root.locator('.guided-paper-page').evaluateAll(nodes=>nodes.flatMap((node,index)=>{const footer=node.querySelector(':scope > footer').getBoundingClientRect(),bottom=Math.max(...[...node.querySelectorAll('[data-question-id]')].map(card=>card.getBoundingClientRect().bottom));return bottom>footer.top+.01?[{type:'footer-card-overlap',page:index+1,cardBottom:bottom,footerTop:footer.top}]:[];})));
 if(overflow.length)report.printIssues.push({packId:pack.id,locale,edition,overflow});
 await page.emulateMedia({media:null});
 const file=`${pack.id}-${locale}-${edition}.pdf`;await page.pdf({path:resolve(output,file),format:'A4',preferCSSPageSize:true,printBackground:true,tagged:true});
 const record={file,packId:pack.id,locale,edition,questionIds:ids,printLayoutIssues:overflow,requiredText:requiredText(questions.map(q=>q.prompt[locale])),mathmlAudit:await auditAuthoredMath(root,questions,locale,edition),forbiddenText:edition==='teacher'?[]:forbiddenPrintAnswers(questions,locale),expectedPages:edition==='student'?2:undefined};
 if(edition==='student'){record.pageOneText=requiredText(questions.slice(0,4).map(q=>q.prompt[locale]));record.pageTwoText=requiredText(questions.slice(4).map(q=>q.prompt[locale]));}
 if(edition==='teacher'){record.teacherIntroductionMath=await auditTeacherIntro(root,pack,locale);record.requiredGroups={
  allReferenceAnswers:requiredText(questions.map(q=>q.answer[locale])),
  taskTeacher:plainParts(pack.taskTeacher?.[locale]||''),
  prerequisites:plainParts(pack.prerequisites[locale]),
  actualInquiryPlan:requiredText(pack.inquiryStages?pack.inquiryStages.map(s=>s.task[locale]):[pack.inquiry[locale]]),
  bothFortyMinuteRoutes:[locale==='en'?'Ordinary route: prerequisites 4, short inquiry 5, worked/guided 8, independent 15, correction 5, exit 3 minutes. Advanced route: inquiry 18, organise 4, selected practice 13, exit 5 minutes.':'普通班：先備4、短探究5、示範帶做8、獨立15、訂正5、離堂3分鐘。進階班：探究18、整理4、精選練習13、離堂5分鐘。']
 };}
 manifest.pdfs.push(record);await persist();
 await page.waitForFunction(()=>document.querySelector('[data-practice-print-edition]').value==='student');assert.equal(await page.locator('[data-guided-practice]').getAttribute('data-print-edition'),'student');
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('[data-practice-print-root]:visible').count(),1);assert.ok(await page.locator('[data-practice-print-root][data-edition="student"]').isVisible());await page.emulateMedia({media:null});
}

try{
 await test('all-new-bilingual-fixed-editions-exports-and-legacy-preservation',async page=>{
  await seed(page);const before=await snapshot(page);let pdfs=0,exports=0;
  for(const pack of packs)for(const locale of ['en','zh-Hant']){
   await ready(page,pack,locale);assert.equal(await page.locator('[data-practice-question]').count(),16);assert.equal(await page.locator('[data-practice-answer-content]:visible,[data-practice-step-content]:visible,[data-practice-hint-content]:visible').count(),0);for(const q of pack.questions.filter(q=>hiddenDerivedInput(pack,q)))assert.equal(await page.locator(`[data-practice-question][data-question-id="${q.id}"] .guided-question-body .math-expression--display`).count(),0,q.id+'/screen question does not preprint the requested model or derived answer');
   await auditAuthoredMath(page.locator('.guided-question-stack'),pack.questions,locale,'screen');await revealAll(page);for(const edition of ['student','teacher','supplement']){await printPdf(page,pack,locale,edition);pdfs++;}
   const teacher=await download(page,()=>page.locator('[data-practice-export="teacher"]').click(),`${pack.id}-${locale}-teacher.json`);assert.deepEqual(teacher.questions,JSON.parse(JSON.stringify(pack.questions)),'Built JSON export matches every serializable frozen source field and fixed choice rotation');exports++;
   await ready(page,pack,locale,false);const student=await download(page,()=>page.locator('[data-practice-export="student"]').click(),`${pack.id}-${locale}-student.json`);assertScrubbed(student);exports++;
   assert.deepEqual(student.questions.map(q=>q.id),pack.questions.map(q=>q.id));for(let i=0;i<16;i++){assert.deepEqual(student.questions[i].prompt,teacher.questions[i].prompt);assert.deepEqual(student.questions[i].diagram,scrubSolutions(teacher.questions[i].diagram));assert.deepEqual(student.questions[i].expression,teacher.questions[i].expression);}
   assert.deepEqual(await snapshot(page),before,pack.id+'/'+locale+'/presentation must preserve exact legacy bytes');
  }
  assert.equal(pdfs,LOWER_NEW_PACK_IDS.length*6);assert.deepEqual(report.printIssues,[],'All printed formulas must fit their own question columns; every failure remains in the complete PDF collection');return {packs:packs.length,languages:2,pdfs,jsonDownloads:exports,studentPrintAfterRevealAll:true,studentExportHasNoAnswersOrSolutionGeometry:true,oldCanonicalBytesUnchanged:true};
 });
 await test('all-new-teacher-pacing-and-session-only-reveals',async page=>{
  await seed(page);const before=await snapshot(page);
  for(const pack of packs){await ready(page,pack);const active=()=>page.locator('[data-practice-question][data-current="true"]'),first=await active().getAttribute('data-question-id');await page.locator('[data-practice-next]').click();assert.notEqual(await active().getAttribute('data-question-id'),first);await page.locator('[data-practice-prev]').click();assert.equal(await active().getAttribute('data-question-id'),first);await page.locator('[data-practice-hint]').click();assert.equal(await active().locator('[data-practice-hint-content]:visible').count(),1);await page.locator('[data-practice-answer]').click();assert.equal(await active().locator('[data-practice-answer-content]:visible').count(),1);await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('[data-practice-answer-content]:visible,[data-practice-hint-content]:visible,[data-practice-step-content]:visible').count(),0);assert.equal(await page.locator('[data-practice-print-edition]').inputValue(),'student');}
  assert.deepEqual(await snapshot(page),before);return {packs:packs.length,controlsAndReloadVerified:true,noNewLocalStorageKey:true};
 });
 await test('all-new-mobile-language-and-keyboard',async page=>{
  await page.setViewportSize({width:390,height:844});let layouts=0,switches=0;
  for(const pack of packs)for(const locale of ['en','zh-Hant']){await ready(page,pack,locale);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),pack.id+'/'+locale+'/390px horizontal overflow');layouts++;
   await page.locator('[data-practice-route]').selectOption('inquiry');await page.locator('[data-language-switch]').click();const target=locale==='en'?'zh-Hant':'en';await page.locator(`[data-guided-practice="${pack.id}"][data-locale="${target}"]`).waitFor();await page.waitForFunction(()=>document.querySelector('[data-guided-practice]')?.dataset.guidedReady==='true');assert.equal(await page.locator('[data-practice-route]').inputValue(),'inquiry',pack.id+'/'+locale+'/initialised route retained at '+page.url());assert.equal(new URL(page.url()).searchParams.get('route'),'inquiry');assert.equal(await page.locator('[data-practice-answer-content]:visible,[data-practice-step-content]:visible,[data-practice-hint-content]:visible').count(),0);switches++;
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
   const chapter=LOWER_CHAPTERS.find(c=>c.packIds.includes(pack.id)),heading=await page.locator('.lesson-sub').innerText(),navigation=await page.locator('[data-practice-source-navigation]').innerText();
   assert.ok(heading.includes(chapter.title[locale])&&heading.includes(locale==='en'?`Chapter ${chapter.number}`:`第${chapter.number}章`),pack.id+'/native heading uses the supplied textbook chapter');
   assert.ok(heading.includes(chapter.pages.join('–')),pack.id+'/correct chapter printed pages');assert.ok(navigation.includes(chapter.title[locale]),pack.id+'/native source navigation');
   assert.ok((await link.locator('..').innerText()).includes(pack.sourceNavigation[locale]),pack.id+'/per-pack bilingual source navigation');
   assert.equal(await link.getAttribute('href'),pathFor(pack,locale));assert.equal(/[\u3400-\u9fff]/u.test(await link.innerText()),locale==='zh-Hant');
   await link.click();await page.locator(`[data-guided-practice="${pack.id}"][data-locale="${locale}"]`).waitFor();assert.deepEqual(await snapshot(page),before);clicks++;
  }return {trustedNativeChapterClicks:clicks,correctSuppliedTextbookChapterAndPages:true,bilingualSourceNavigation:true,canonicalRecordsUnchanged:true};
 });
 await test('closed-curriculum-and-valid-inquiry-entries',async(page,context)=>{
  let curriculumClicks=0,inquiryLinks=0;const checked=new Set();
  for(const locale of ['en','zh-Hant']){const curriculum=origin+(locale==='zh-Hant'?'/zh':'')+'/teaching/classroom-packs/curriculum/lower/';await page.goto(curriculum,{waitUntil:'networkidle'});await page.locator('[data-lower-core-curriculum][data-classroom-index]').waitFor();assert.deepEqual((await page.locator('[data-lower-chapter]').evaluateAll(nodes=>nodes.map(node=>node.dataset.lowerChapter))).sort(),LOWER_CHAPTERS.map(c=>c.id).sort());assert.deepEqual((await page.locator('[data-lower-pack]').evaluateAll(nodes=>nodes.map(node=>node.dataset.lowerPack))).sort(),ALL_PRACTICE_PACKS.map(p=>p.id).sort());
   for(const pack of packs){await page.goto(curriculum,{waitUntil:'networkidle'});const row=page.locator(`[data-lower-pack="${pack.id}"]`);assert.equal(await row.locator('a').count(),3);await row.locator(`a[href="${pathFor(pack,locale)}"]`).click();await page.locator(`[data-guided-practice="${pack.id}"][data-locale="${locale}"]`).waitFor();curriculumClicks++;
    const links=await page.locator('[data-practice-inquiry] a[href*="/math-studio/"]').evaluateAll(nodes=>nodes.map(node=>({href:node.getAttribute('href'),native:node.hasAttribute('data-practice-native')})));
    for(const link of links.filter(link=>!link.native)){const url=new URL(link.href,origin);assert.equal(url.searchParams.get('lang'),locale);assert.ok(url.hash.startsWith('#g8/')||url.searchParams.has('lab'),'Inquiry link must identify an actual lab rather than the general home');if(!checked.has(url.href)){const response=await context.request.get(url.href);assert.equal(response.status(),200,url.href);checked.add(url.href);}inquiryLinks++;}
   }
  }return {chapterCount:LOWER_CHAPTERS.length,curriculumPacks:ALL_PRACTICE_PACKS.length,trustedNewPackClicks:curriculumClicks,inquiryAnchors:inquiryLinks,uniqueInquiryDestinations:checked.size,allDestinationsHTTP200:true,limit:'Checks entry URLs and chapter navigation; it does not claim to rerun every existing inquiry engine.'};
 });
 await test('malformed-legacy-records-remain-exact-through-new-pack-output',async page=>{
  await seed(page,{...oldBytes,'math-studio-practice-v2':' { damaged practice bytes ','math-studio-inquiry-g7-v1':'[invalid old inquiry'});const before=await snapshot(page);
  for(const grade of ['g7','g8']){const pack=packs.find(p=>p.grade===grade);await ready(page,pack,'zh-Hant',false);await revealAll(page);await download(page,()=>page.locator('[data-practice-export="student"]').click(),grade+'-corrupt-legacy-student.json');await page.emulateMedia({media:null});await page.pdf({path:resolve(output,grade+'-corrupt-legacy-student.pdf'),format:'A4',preferCSSPageSize:true});assert.deepEqual(await snapshot(page),before);}return {invalidJSONAndUnknownWhitespaceBytesPreserved:true,bothGrades:true};
 });
 await test('new-catalog-forced-overlap-classroom-and-native-backup-roundtrip',async(page,context)=>{
  await seed(page);const other=await context.newPage();await Promise.all([page.goto(origin+'/teaching/math/',{waitUntil:'networkidle'}),other.goto(origin+'/teaching/math/',{waitUntil:'networkidle'})]);
  await Promise.all([page,other].map(target=>target.evaluate(()=>{window.__lowerQaEvents=0;addEventListener('storage',()=>window.__lowerQaEvents++);})));
  const chosen=[packs.find(p=>p.grade==='g7'),packs.find(p=>p.grade==='g8')],ids=chosen.map(p=>'classroom:'+p.id);
  for(const[target,pack]of [[page,chosen[0]],[other,chosen[1]]])await target.locator('[data-filter-query]').fill(pack.id);
  const locker=await context.newPage();await locker.goto(origin+'/teaching/',{waitUntil:'networkidle'});await locker.evaluate(()=>{void navigator.locks.request('math-learning:writer:v1',async()=>{window.__lowerQaHeld=true;await new Promise(done=>window.__lowerQaRelease=done);});});await locker.waitForFunction(()=>window.__lowerQaHeld);
  try{await Promise.all([page.locator(`[data-add-id="${ids[0]}"]`).click(),other.locator(`[data-add-id="${ids[1]}"]`).click()]);assert.equal(await page.evaluate(()=>localStorage.getItem('math-system-notebook-v1')),null,'Both new additions must still wait behind the common writer lock');}finally{await locker.evaluate(()=>window.__lowerQaRelease());await locker.close();}
  await Promise.all([page.evaluate(()=>MathStorage.flushAll()),other.evaluate(()=>MathStorage.flushAll())]);
  await page.waitForFunction(ids=>{const saved=JSON.parse(localStorage.getItem('math-system-notebook-v1')||'{}');return ids.every(id=>saved.classroom?.ids.includes(id));},ids);
  await Promise.all([page.locator('[data-system-view="classroom"]').click(),other.locator('[data-system-view="classroom"]').click()]);
  await page.locator('[data-system-classroom-title]').fill('QA_LOWER_CORE_40_MIN');await page.evaluate(()=>MathStorage.flushAll());await other.waitForFunction(()=>document.querySelector('[data-system-classroom-title]').value==='QA_LOWER_CORE_40_MIN');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('math-system-notebook-v1')).classroom);assert.ok(ids.every(id=>saved.ids.includes(id)));
  await page.locator('[data-system-view="learning"]').click();const backup=await download(page,()=>page.locator('[data-system-backup-download]').click(),'lower-system-backup.json');
  const fresh=await browser.newContext({acceptDownloads:true});try{const target=await fresh.newPage();await target.goto(origin+'/teaching/math/?view=learning',{waitUntil:'networkidle'});await target.locator('[data-system-backup-file]').setInputFiles({name:'lower-system-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await target.locator('[data-system-import-preview]').waitFor();await download(target,()=>target.locator('[data-system-backup-apply]').click(),'before-lower-import.json');await target.waitForFunction(()=>document.querySelector('[data-system-backup-status]').textContent.includes('Selected records restored'));assert.deepEqual(await target.evaluate(()=>JSON.parse(localStorage.getItem('math-system-notebook-v1')).classroom),saved);for(const[key,value]of Object.entries(oldBytes).filter(([key])=>key!=='qa-unrelated-record'))assert.equal(await target.evaluate(key=>localStorage.getItem(key),key),value);}finally{await fresh.close();}
  const events=await Promise.all([page,other].map(target=>target.evaluate(()=>window.__lowerQaEvents)));assert.ok(events.every(n=>n>0));return {newCatalogIds:ids,forcedSharedWriterOverlap:true,classroomTitleBothTabs:true,storageEvents:events,nativeBackupRestoredIntoFreshContext:true,legacyBytesExact:true};
 });
 await test('rendered-lower-geometry-intervals-statistics-functions-and-solution-privacy',async page=>{
  const counts={};let diagrams=0,teacherLayers=0;
  const close=(a,b,label)=>assert.ok(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b)),label+' '+a+' versus '+b);
  for(const pack of packs){await ready(page,pack);for(const q of pack.questions.filter(q=>q.diagram)){
   const d=q.diagram,article=page.locator('[data-practice-question][data-question-id="'+q.id+'"]'),figure=article.locator('.guided-question-body > figure');assert.equal(await figure.count(),1,q.id+'/given figure');
   const family=d.kind==='statistics'?'statistics:'+d.chart:d.kind;counts[family]=(counts[family]||0)+1;diagrams++;
   if(d.kind==='data-table'||(d.kind==='statistics'&&d.chart==='table')){
    assert.equal(await figure.locator('table').count(),1,q.id+'/real table');const rows=await figure.locator('tbody tr').evaluateAll(nodes=>nodes.map(n=>[...n.querySelectorAll('td')].map(c=>c.textContent.trim())));
    if(d.bins){assert.equal(rows.length,d.bins.length,q.id+'/all supplied bin rows rendered');for(let i=0;i<rows.length;i++){const bin=d.bins[i],numbers=rows[i][0].match(/-?\d+(?:\.\d+)?/g)?.map(Number);assert.deepEqual(numbers,[bin.lo,bin.hi],q.id+'/interval label');assert.equal(rows[i][0],`[${bin.lo},${bin.hi}${bin.hiClosed?']':')'}`,q.id+'/actual class boundary inclusion');close(Number(rows[i][1]),bin.frequency,q.id+'/frequency cell');}}
    else{const expected=d.rows||d.categories.map(c=>[c.label,c.count]);assert.deepEqual(rows,expected.map(r=>r.map(v=>String(typeof v==='object'?v.en??v['zh-Hant']:v))),q.id+'/actual data cells');}
    continue;
   }
   const svg=figure.locator('svg');assert.equal(await svg.count(),1,q.id+'/real SVG');
   if(['geometry','coordinate'].includes(d.kind)){
    const drawing=await svg.evaluate(svg=>({dots:[...svg.querySelectorAll('circle[r="2.8"]')].map(el=>[+el.getAttribute('cx'),+el.getAttribute('cy')]),labels:[...svg.querySelectorAll('text')].map(el=>({text:el.textContent,p:[+el.getAttribute('x'),+el.getAttribute('y')]})),right:svg.querySelectorAll('path.right').length,ticks:svg.querySelectorAll('line.mark').length,parallel:svg.querySelectorAll('path.mark').length,arcs:svg.querySelectorAll('path.construction').length,grid:[...svg.querySelectorAll('line.axis,line.grid')].map(el=>({axis:el.classList.contains('axis'),a:[+el.getAttribute('x1'),+el.getAttribute('y1')],b:[+el.getAttribute('x2'),+el.getAttribute('y2')]}))}));
    const named=id=>{const label=drawing.labels.find(l=>l.text===id);assert.ok(label,q.id+'/actual vertex '+id);const dot=drawing.dots.toSorted((a,b)=>Math.hypot(a[0]-label.p[0],a[1]-label.p[1])-Math.hypot(b[0]-label.p[0],b[1]-label.p[1]))[0];assert.ok(dot,q.id+'/actual point '+id);return dot;};
    const raw=d.points;assert.ok(raw.length>=1);let scale;
    for(let i=0;i<raw.length;i++)for(let j=i+1;j<raw.length;j++){const ds=(raw[i].x-raw[j].x)**2+(raw[i].y-raw[j].y)**2;if(!ds)continue;const a=named(raw[i].label||raw[i].id),b=named(raw[j].label||raw[j].id),ratio=((a[0]-b[0])**2+(a[1]-b[1])**2)/ds;if(scale===undefined)scale=ratio;else close(ratio,scale,q.id+'/actual isometric geometry');}
    if(d.kind==='coordinate'){
     const vertical=drawing.grid.filter(l=>Math.abs(l.a[0]-l.b[0])<1e-8),horizontal=drawing.grid.filter(l=>Math.abs(l.a[1]-l.b[1])<1e-8),xs=vertical.map(l=>l.a[0]).sort((a,b)=>a-b),ys=horizontal.map(l=>l.a[1]).sort((a,b)=>a-b),unit=xs[1]-xs[0];assert.ok(unit>0);close(ys[1]-ys[0],unit,q.id+'/square grid');
     let ox,oy;if(d.showAxes===false){assert.equal(drawing.grid.filter(l=>l.axis).length,0,q.id+'/no premature axes');assert.ok(!drawing.labels.some(l=>['x','y','O'].includes(l.text)),q.id+'/no coordinate labels');const [xmin,, ,ymax]=d.bounds;ox=xs[0]-Math.ceil(xmin)*unit;oy=ys[0]+Math.floor(ymax)*unit;}else{ox=vertical.find(l=>l.axis).a[0];oy=horizontal.find(l=>l.axis).a[1];}
     for(const p of raw){const actual=named(p.label||p.id);close((actual[0]-ox)/unit,p.x,q.id+'/actual horizontal coordinate');close((oy-actual[1])/unit,p.y,q.id+'/actual vertical coordinate');}
    }
    assert.equal(drawing.right,(d.rightAngles||[]).length,q.id+'/only given right angles');assert.equal(drawing.arcs,(d.equalAngles||[]).reduce((n,g)=>n+g.length,0),q.id+'/only given equal-angle arcs');assert.equal(drawing.ticks,(d.equalSegments||[]).reduce((n,g,i)=>n+g.length*(i+1),0),q.id+'/only given side ticks');assert.equal(drawing.parallel,(d.parallelSegments||[]).reduce((n,g,i)=>n+g.length*(i+1),0),q.id+'/only given parallel marks');
    for(const p of d.solutionPoints||[])assert.ok(!drawing.labels.some(l=>l.text===(p.label||p.id)),q.id+'/requested vertex is hidden');
    if(d.solutionPoints?.length){const teacher=article.locator('.guided-answer svg').first();for(const p of d.solutionPoints)assert.equal(await teacher.locator('text').evaluateAll((nodes,label)=>nodes.filter(n=>n.textContent===label).length,p.label||p.id),1,q.id+'/teacher requested vertex');teacherLayers++;}
   }else if(d.kind==='function-graph'){
    const frame=await svg.locator('rect.graph-frame').evaluate(n=>({x:+n.getAttribute('x'),y:+n.getAttribute('y'),w:+n.getAttribute('width'),h:+n.getAttribute('height')})),[xmin,xmax,ymin,ymax]=d.bounds,inverse=(x,y)=>[xmin+(x-frame.x)/frame.w*(xmax-xmin),ymax-(y-frame.y)/frame.h*(ymax-ymin)];
    const actual=await svg.locator('line.function-line').evaluateAll(nodes=>nodes.map(n=>({id:n.dataset.lineId,k:+n.dataset.k,b:+n.dataset.b,p:[[+n.getAttribute('x1'),+n.getAttribute('y1')],[+n.getAttribute('x2'),+n.getAttribute('y2')]]})));assert.equal(actual.length,(d.lines||[]).length,q.id+'/no requested line preprinted');
    for(const line of actual){const given=d.lines.find(l=>l.id===line.id);close(line.k,given.k,q.id+'/line parameter k');close(line.b,given.b,q.id+'/line parameter b');const p=line.p.map(([x,y])=>inverse(x,y));let lo=Math.max(xmin,given.domain?.[0]??xmin),hi=Math.min(xmax,given.domain?.[1]??xmax);if(given.k){const a=(ymin-given.b)/given.k,b=(ymax-given.b)/given.k;lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));}for(const[x,y]of p){close(y,given.k*x+given.b,q.id+'/painted line satisfies equation');assert.ok(x>=lo-1e-7&&x<=hi+1e-7,q.id+'/given domain clipping');}close(Math.min(...p.map(v=>v[0])),lo,q.id+'/full visible left endpoint');close(Math.max(...p.map(v=>v[0])),hi,q.id+'/full visible right endpoint');}
    const checkEndpoints=async(target,lines)=>{const expected=lines.flatMap(line=>(line.domain||[]).map((x,i)=>({id:line.id,x,y:line.k*x+line.b,closed:line.domainClosed?.[i]!==false}))).filter(p=>p.x>=xmin&&p.x<=xmax&&p.y>=ymin&&p.y<=ymax),ends=await target.locator('circle[data-line-endpoint]').evaluateAll(ns=>ns.map(n=>({id:n.dataset.lineEndpoint,x:+n.dataset.x,y:+n.dataset.y,closed:n.dataset.closed,p:[+n.getAttribute('cx'),+n.getAttribute('cy')],fill:n.getAttribute('fill'),stroke:getComputedStyle(n).stroke,strokeWidth:parseFloat(getComputedStyle(n).strokeWidth)})));assert.equal(ends.length,expected.length,q.id+'/only visible finite-domain endpoints');for(let i=0;i<ends.length;i++){const a=ends[i],e=expected[i],[x,y]=inverse(...a.p);assert.equal(a.id,e.id);close(a.x,e.x,q.id+'/endpoint x metadata');close(a.y,e.y,q.id+'/endpoint y metadata');close(x,e.x,q.id+'/painted endpoint x');close(y,e.y,q.id+'/painted endpoint y');assert.equal(a.closed,String(e.closed));assert.equal(a.fill,e.closed?'currentColor':'white',q.id+'/domain endpoint inclusion fill');assert.ok(a.stroke!=='none'&&a.strokeWidth>0,q.id+'/endpoint boundary visible');}};
    await checkEndpoints(svg,d.lines||[]);
    assert.equal(await svg.locator('[data-solution-layer]').count(),0,q.id+'/student graph solution layers absent');
    if(d.solutionLines?.length){const teacher=article.locator('.guided-answer svg').first();assert.equal(await teacher.locator('line.function-line[data-solution-layer]').count(),d.solutionLines.length,q.id+'/teacher goal lines present');await checkEndpoints(teacher,[...d.lines||[],...d.solutionLines]);teacherLayers++;}
   }else if(d.kind==='interval'){
    const check=async(target,expected)=>{const groups=await target.locator('g[data-interval-lo]').evaluateAll(nodes=>nodes.map(n=>({lo:n.dataset.intervalLo,hi:n.dataset.intervalHi,lc:n.dataset.loClosed,hc:n.dataset.hiClosed,line:[+n.querySelector('line').getAttribute('x1'),+n.querySelector('line').getAttribute('x2')],ends:[...n.querySelectorAll('circle')].map(c=>({x:+c.getAttribute('cx'),fill:c.getAttribute('fill'),stroke:getComputedStyle(c).stroke,strokeWidth:parseFloat(getComputedStyle(c).strokeWidth)})),arrows:n.querySelectorAll('path').length})));assert.equal(groups.length,expected.length,q.id+'/interval count');for(let i=0;i<groups.length;i++){const a=groups[i],e=expected[i],X=v=>35+(v-d.min)/(d.max-d.min)*290;assert.equal(a.lo,e.lo===null?'-infinity':String(e.lo));assert.equal(a.hi,e.hi===null?'infinity':String(e.hi));assert.equal(a.lc,String(e.loClosed));assert.equal(a.hc,String(e.hiClosed));close(a.line[0],X(e.lo===null?d.min:Math.max(d.min,e.lo)),q.id+'/painted lower bound');close(a.line[1],X(e.hi===null?d.max:Math.min(d.max,e.hi)),q.id+'/painted upper bound');const ends=[[e.lo,e.loClosed],[e.hi,e.hiClosed]].filter(([v])=>v!==null);assert.equal(a.ends.length,ends.length);ends.forEach(([v,c],j)=>{close(a.ends[j].x,X(v),q.id+'/actual endpoint');assert.equal(a.ends[j].fill,c?'currentColor':'white',q.id+'/actual open/closed fill');assert.ok(a.ends[j].stroke!=='none'&&a.ends[j].strokeWidth>0,q.id+'/finite boundary remains visible');});assert.equal(a.arrows,Number(e.lo===null)+Number(e.hi===null),q.id+'/infinity arrows');}};
    await check(svg,d.intervals||[]);if(d.solutionIntervals?.length){await check(article.locator('.guided-answer svg').first(),[...d.intervals||[],...d.solutionIntervals]);teacherLayers++;}
   }else if(d.kind==='statistics'&&d.chart==='histogram'){
    const check=async(target,expected)=>{const bars=await target.locator('rect[data-bin-lo]').evaluateAll(ns=>ns.map(n=>({lo:+n.dataset.binLo,hi:+n.dataset.binHi,f:+n.dataset.frequency,h:+n.dataset.height,kind:n.dataset.heightKind,x:+n.getAttribute('x'),y:+n.getAttribute('y'),w:+n.getAttribute('width'),height:+n.getAttribute('height')})));assert.equal(bars.length,expected.length,q.id+'/no requested histogram bars preprinted');const geometry=await target.evaluate(svg=>({ticks:[...svg.querySelectorAll('text[y="205"]')].map(n=>({v:Number(n.textContent),x:+n.getAttribute('x')})),ys:[...svg.querySelectorAll('text[x="38"]')].map(n=>({v:Number(n.textContent),y:+n.getAttribute('y')-5}))})),zero=geometry.ys.find(t=>t.v===0),positive=geometry.ys.find(t=>t.v>0),unitY=(zero.y-positive.y)/positive.v;assert.ok(zero&&positive&&unitY>0,q.id+'/visible labelled histogram height scale');const xRange=d.xRange||[Math.min(...expected.map(b=>b.lo)),Math.max(...expected.map(b=>b.hi))];assert.ok(geometry.ticks.some(t=>t.v===xRange[0])&&geometry.ticks.some(t=>t.v===xRange[1]),q.id+'/blank or filled histogram full x range labelled');if(!bars.length){assert.ok(d.maxHeight>0&&geometry.ys.some(t=>t.v===d.maxHeight),q.id+'/blank histogram given maximum height visible');return;}
     for(let i=0;i<bars.length;i++){const a=bars[i],e=expected[i],density=d.height==='density'||new Set(expected.map(b=>b.hi-b.lo)).size>1,h=density?e.frequency/(e.hi-e.lo):e.frequency,x0=geometry.ticks.find(t=>t.v===e.lo).x,x1=geometry.ticks.find(t=>t.v===e.hi).x;close(a.lo,e.lo,q.id+'/class lower');close(a.hi,e.hi,q.id+'/class upper');close(a.f,e.frequency,q.id+'/frequency');close(a.h,h,q.id+'/height data');assert.equal(a.kind,density?'density':'frequency');close(a.x,x0,q.id+'/bar starts at labelled boundary');close(a.w,x1-x0,q.id+'/actual bin width');close(a.height/unitY,h,q.id+'/painted height matches labelled vertical scale');close(a.y,zero.y-h*unitY,q.id+'/bar top');}}
    await check(svg,d.bins||[]);if(d.solutionBins?.length){await check(article.locator('.guided-answer svg').first(),[...d.bins||[],...d.solutionBins]);teacherLayers++;}
   }else if(d.kind==='statistics'&&d.chart==='sector'){
    const total=d.categories.reduce((n,c)=>n+c.count,0),paths=await svg.locator('path[data-sector-angle]').evaluateAll(ns=>ns.map(n=>({angle:+n.dataset.sectorAngle,f:+n.dataset.frequency,values:n.getAttribute('d').match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi).map(Number)})));assert.equal(paths.length,d.categories.length);for(let i=0;i<paths.length;i++){const a=paths[i],e=d.categories[i],v=a.values;close(a.f,e.count,q.id+'/sector count');close(a.angle,e.count/total*360,q.id+'/sector angle');const start=Math.atan2(v[3]-v[1],v[2]-v[0]),end=Math.atan2(v[10]-v[1],v[9]-v[0]),turn=(end-start+2*Math.PI)%(2*Math.PI);close(turn*180/Math.PI,a.angle,q.id+'/actual painted sector angle');assert.equal(v[7],a.angle>180?1:0,q.id+'/actual large-arc flag');}
   }else throw Error(q.id+'/unhandled actual diagram family '+family);
  }}
  const expected={};for(const pack of packs)for(const q of pack.questions)if(q.diagram){const family=q.diagram.kind==='statistics'?'statistics:'+q.diagram.chart:q.diagram.kind;expected[family]=(expected[family]||0)+1;}assert.deepEqual(counts,expected,'Every authored lower diagram audited, no skipped family');assert.ok(counts.geometry&&counts.coordinate&&counts.interval&&counts['statistics:histogram']&&counts['function-graph']&&counts['data-table']);return {diagrams,counts,teacherLayers,actualCoordinatesEndpointsAreasAndLinesVerified:true,studentSolutionLayersHidden:true};
 });

}finally{report.completedAt=new Date().toISOString();report.passed=report.cases.length>0&&report.cases.every(c=>c.status==='passed')&&report.pageErrors.length===0;await persist();await browser.close();if(server)await new Promise(done=>server.close(done));}
assert.ok(report.passed,JSON.stringify({failed:report.cases.filter(c=>c.status!=='passed'),pageErrors:report.pageErrors}));
