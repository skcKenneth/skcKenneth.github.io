// Actual disposable Chromium pages, native storage events, downloads and A4 PDFs.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {PRACTICE_PACKS} from '../src/data/guided-practice/index.mjs';

const require=createRequire(process.env.PLAYWRIGHT_RUNTIME||'C:/Users/kenneth/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=require('playwright');
const argument=name=>process.argv.includes(name)?process.argv[process.argv.indexOf(name)+1]:null;
let origin=argument('--base')||process.env.MATH_QA_ORIGIN||'http://127.0.0.1:4399',server;
const output=resolve(argument('--output')||'.tmp/guided-practice-browser-qa');
const executablePath=process.env.QA_BROWSER_EXECUTABLE||'C:/Users/kenneth/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
if(argument('--serve')){
 const directory=resolve(argument('--serve')),types={'.html':'text/html;charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
 server=createServer(async(request,response)=>{try{let file=resolve(directory,'.'+decodeURIComponent(new URL(request.url,'http://localhost').pathname));if(file!==directory&&!file.startsWith(directory+sep))throw Error('outside frozen directory');if((await stat(file)).isDirectory())file=resolve(file,'index.html');response.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});response.end(await readFile(file));}catch{response.writeHead(404);response.end('Not found');}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port;
}
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath,headless:true});
const report={startedAt:new Date().toISOString(),origin,browser:browser.version(),executablePath,isolation:'Disposable browser contexts with synthetic old records only; no app mocks or production user records.',cases:[],pageErrors:[]};
const manifest={origin,pdfs:[]};
const pathFor=(pack,locale,teacher=false)=>`${locale==='zh-Hant'?'/zh':''}/teaching/classroom-packs/${pack.id}/${teacher?'teacher/':''}`;
const coreRoles=['worked','guided','prior','independent','exit'];
const fixedCore=pack=>pack.questions.filter(q=>coreRoles.includes(q.role));
const snapshot=page=>page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(key=>[key,localStorage.getItem(key)])));
const oldBytes={
 'jae-math-v1':' '+JSON.stringify({version:1,answers:{'qa-future-question':{input:'5',notes:'QA_OLD_NOTE',attempts:2,unknownField:'retain'}},last:{question:'qa-future-question'}})+' ',
 'senior-math-study-v2':JSON.stringify({version:2,history:{'qa-future-question':[{eventId:'qa-original',notes:'QA_HISTORY'}]},classroom:{title:'QA_OLD_CLASS',ids:['qa-future-question']}}),
 'math-studio-practice-v2':JSON.stringify({'qa-future-exposure':1700000000000}),
 'math-studio-inquiry-v2':JSON.stringify({'qa-future-inquiry':{prediction:'QA_PREDICTION',unknownField:{keep:true}}}),
 'math-studio-inquiry-g7-v1':JSON.stringify({'qa-future-g7':{prediction:'QA_G7'}}),
 'math-studio-inquiry-g8-v1':JSON.stringify({'qa-future-g8':{prediction:'QA_G8',evidence:[{eventId:'qa-old-evidence',at:1}]}}),
 'qa-unrelated-record':'  opaque unrelated bytes  ',
};
const near=(a,b,tolerance=.03)=>Math.hypot(a[0]-b[0],a[1]-b[1])<tolerance;
function reflection(point,line){const u=[line[1][0]-line[0][0],line[1][1]-line[0][1]],v=[point[0]-line[0][0],point[1]-line[0][1]],scale=(u[0]*v[0]+u[1]*v[1])/(u[0]**2+u[1]**2);return [line[0][0]+2*scale*u[0]-v[0],line[0][1]+2*scale*u[1]-v[1]];}
function axisCount(vertices){const centre=vertices.reduce((sum,p)=>[sum[0]+p[0]/vertices.length,sum[1]+p[1]/vertices.length],[0,0]),directions=[];for(const p of [...vertices,...vertices.map((p,i)=>[(p[0]+vertices[(i+1)%vertices.length][0])/2,(p[1]+vertices[(i+1)%vertices.length][1])/2])]){const angle=Math.atan2(p[1]-centre[1],p[0]-centre[0]);if(Math.hypot(p[0]-centre[0],p[1]-centre[1])>1e-8&&!directions.some(a=>Math.abs(Math.sin(a-angle))<1e-6))directions.push(angle);}return directions.filter(angle=>vertices.every(p=>vertices.some(q=>near(reflection(p,[centre,[centre[0]+Math.cos(angle),centre[1]+Math.sin(angle)]]),q)))).length;}
async function seed(page,bytes){await page.goto(origin+'/teaching/',{waitUntil:'networkidle'});await page.evaluate(bytes=>{localStorage.clear();for(const[key,value]of Object.entries(bytes))localStorage.setItem(key,value);},bytes);}
async function ready(page,pack,locale='en',teacher=true){const response=await page.goto(origin+pathFor(pack,locale,teacher),{waitUntil:'networkidle'});assert.equal(response.status(),200);await page.locator(`[data-guided-practice="${pack.id}"]`).waitFor();await page.waitForFunction(()=>document.querySelector('[data-guided-practice]').dataset.practiceReady==='true'||document.querySelector('[data-practice-next]')?.hasAttribute('data-bound')||document.querySelector('[data-practice-current-index]'));
 await page.evaluate(()=>document.fonts.ready);}
async function download(page,trigger,name){await page.bringToFront();const[item]=await Promise.all([page.waitForEvent('download',{timeout:10000}),trigger()]),path=resolve(output,name);await item.saveAs(path);return JSON.parse(await readFile(path,'utf8'));}
async function revealAll(page){const prep=page.locator('[data-guided-teacher-preparation]');if(await prep.getAttribute('open')===null)await prep.locator('summary').first().click();await page.locator('[data-practice-reveal-all]').click();}
async function test(name,run){if(process.env.QA_CASES&&!process.env.QA_CASES.split(',').includes(name))return;const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});context.on('page',page=>page.on('pageerror',error=>report.pageErrors.push({case:name,url:page.url(),error:String(error)})));const page=await context.newPage();try{const evidence=await run(page,context);report.cases.push({name,status:'passed',evidence});console.log('PASS '+name);}catch(error){await page.screenshot({path:resolve(output,name+'-failure.png'),fullPage:true}).catch(()=>{});report.cases.push({name,status:'failed',error:String(error),stack:error.stack});console.error('FAIL '+name+' '+error.message);}finally{await context.close();await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));await writeFile(resolve(output,'pdf-manifest.json'),JSON.stringify(manifest,null,2));}}
async function roots(page,edition){return page.locator(`[data-practice-print-root][data-edition="${edition}"]`);}
function forbiddenAnswers(pack,locale,printed){const prompts=printed.map(q=>q.prompt[locale]).join(' ');return ['Reference answer','參考答案',...pack.questions.map(q=>q.answer[locale]).filter(answer=>answer.length>25&&!prompts.includes(answer))];}
async function printPdf(page,pack,locale,edition){
 const printRoot=await roots(page,edition);assert.equal(await printRoot.count(),1);
 const questions=edition==='teacher'?pack.questions:edition==='supplement'?pack.questions.filter(q=>['supplement','extension'].includes(q.role)):fixedCore(pack);
 const ids=await printRoot.locator('[data-question-id]').evaluateAll(cards=>cards.map(card=>card.dataset.questionId));
 assert.deepEqual(ids,questions.map(q=>q.id),pack.id+'/'+locale+'/'+edition+'/fixed printed IDs');
 if(edition!=='teacher')assert.equal(await printRoot.locator('[data-practice-answer-content],[data-practice-solution]').count(),0,'Student print is dedicated data, not hidden answer markup');
 for(const q of questions.filter(q=>['construction','shape'].includes(q.diagram?.kind))){const svg=printRoot.locator(`[data-question-id="${q.id}"] svg`).first(),count=await svg.locator('line.axis').count();if(edition!=='teacher')assert.equal(count,0,q.id+'/blank printed construction/shape omits answer axes');else if(q.diagram.kind==='construction')assert.equal(count,1,q.id+'/teacher top diagram shows construction solution');else if(q.audit.kind==='axis-count')assert.equal(count,q.audit.shape==='circle'?3:q.audit.expected,q.id+'/teacher top diagram shows correct symmetry axes');}
 await page.locator('[data-practice-print-edition]').selectOption(edition);
 const file=`${pack.id}-${locale}-${edition}.pdf`;
 await page.emulateMedia({media:null});
 await page.pdf({path:resolve(output,file),format:'A4',preferCSSPageSize:true,printBackground:true,tagged:true});
 const record={file,packId:pack.id,locale,edition,questionIds:ids,requiredText:questions.map(q=>q.prompt[locale]),forbiddenText:edition==='teacher'?[]:forbiddenAnswers(pack,locale,questions),expectedPages:edition==='student'?2:undefined};
 if(edition==='student'){record.pageOneText=questions.slice(0,4).map(q=>q.prompt[locale]);record.pageTwoText=questions.slice(4).map(q=>q.prompt[locale]);}
 if(edition==='teacher')record.requiredGroups={referenceAnswers:questions.map(q=>q.answer[locale]).filter(text=>text.length>25&&!questions.some(q=>q.prompt[locale].includes(text)))};
 manifest.pdfs.push(record);
 await page.waitForFunction(()=>document.querySelector('[data-practice-print-edition]').value==='student');assert.equal(await page.locator('[data-guided-practice]').getAttribute('data-print-edition'),'student','After a print, subsequent Ctrl+P defaults to the blank student edition');
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('[data-practice-print-root]:visible').count(),1);assert.equal(await page.locator('[data-practice-print-root][data-edition="student"]').isVisible(),true);await page.emulateMedia({media:null});
 return record;
}

try{
 await test('teacher-pacing-hidden-answers-and-session-reset',async page=>{
  const pack=PRACTICE_PACKS[0];await seed(page,oldBytes);const before=await snapshot(page);await ready(page,pack);
  const root=page.locator('[data-guided-practice]'),active=()=>root.locator('[data-practice-question][data-current="true"]');
  assert.equal(await root.locator('[data-practice-question]').count(),16);
  assert.equal(await root.locator('[data-practice-answer-content]:visible,[data-practice-step-content]:visible,[data-practice-hint-content]:visible').count(),0);
  const first=await active().getAttribute('data-question-id');await page.locator('[data-practice-next]').click();assert.notEqual(await active().getAttribute('data-question-id'),first);await page.locator('[data-practice-prev]').click();assert.equal(await active().getAttribute('data-question-id'),first);
  await page.locator('[data-practice-hint]').click();assert.equal(await active().locator('[data-practice-hint-content]:visible').count(),1);
  await page.locator('[data-practice-step]').click();assert.equal(await active().locator('[data-practice-step-content]:visible').count(),1);
  await page.locator('[data-practice-answer]').click();assert.equal(await active().locator('[data-practice-answer-content]:visible').count(),1);
  await page.locator('[data-practice-route]').selectOption('inquiry');assert.equal(await root.locator('[data-practice-answer-content]:visible').count(),0,'Changing route hides previously revealed answers');
  await page.locator('[data-practice-route]').selectOption('practice');await revealAll(page);assert.ok(await root.locator('[data-practice-answer-content]:visible').count()>0);
  await page.screenshot({path:resolve(output,'teacher-en-after-reveal.png'),fullPage:true});
  await page.locator('[data-practice-projection]').click();assert.equal(await page.locator('[data-classroom-projection="true"]').count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'English projection overflows horizontally');await page.screenshot({path:resolve(output,'teacher-en-projection.png'),fullPage:true});await page.keyboard.press('Escape');
  await page.evaluate(()=>{window.__guidedQaPrintEditions=[];addEventListener('beforeprint',()=>window.__guidedQaPrintEditions.push(document.querySelector('[data-guided-practice]').dataset.printEdition));});await page.locator('[data-practice-print="teacher"]').click();await page.waitForFunction(()=>window.__guidedQaPrintEditions.includes('teacher'));assert.equal(await page.locator('[data-practice-print-edition]').inputValue(),'student','A real teacher print/cancel returns to student edition');
  await page.reload({waitUntil:'networkidle'});assert.equal(await root.locator('[data-practice-answer-content]:visible,[data-practice-step-content]:visible,[data-practice-hint-content]:visible').count(),0);
  assert.deepEqual(await snapshot(page),before);
  return {nextPrevious:true,oneHintAndStepAtATime:true,explicitAnswer:true,routeResetsReveal:true,reloadResetsReveal:true,oldRecordBytesUnchanged:true};
 });

 await test('all-fixed-bilingual-paper-editions-and-scrubbed-exports',async page=>{
  await seed(page,oldBytes);const before=await snapshot(page);let editions=0,exports=0;
  for(const pack of PRACTICE_PACKS)for(const locale of ['en','zh-Hant']){
   await ready(page,pack,locale);await revealAll(page);
   for(const edition of ['student','teacher','supplement']){await printPdf(page,pack,locale,edition);editions++;}
   const teacher=await download(page,()=>page.locator('[data-practice-export="teacher"]').click(),`${pack.id}-${locale}-teacher.json`);exports++;
   assert.deepEqual(teacher.questions,pack.questions,'The frozen built page must match every authored question field and rotated option');
   await ready(page,pack,locale,false);
   const student=await download(page,()=>page.locator('[data-practice-export="student"]').click(),`${pack.id}-${locale}-student.json`);exports++;
   const forbidden=(value)=>{if(!value||typeof value!=='object')return;for(const[key,item]of Object.entries(value)){assert.ok(!['answer','steps','numericAnswer','correctChoice','audit'].includes(key),'student export leaks '+key);forbidden(item);}};forbidden(student);
   assert.deepEqual(student.questions.map(q=>q.id),pack.questions.map(q=>q.id));assert.deepEqual(teacher.questions.map(q=>q.id),student.questions.map(q=>q.id));
   for(let i=0;i<pack.questions.length;i++){assert.deepEqual(student.questions[i].prompt,teacher.questions[i].prompt);assert.deepEqual(student.questions[i].diagram,teacher.questions[i].diagram);assert.ok(teacher.questions[i].answer);}
   assert.deepEqual(await snapshot(page),before,pack.id+'/'+locale+' changed old browser records');
  }
  return {fixedPacks:7,languages:2,pdfs:editions,jsonDownloads:exports,allPrintedQuestionIdsFixed:true,studentExportHasNoSolutions:true,oldNativeBytesUnchanged:true};
 });

 await test('corrupt-legacy-bytes-survive-presentation-and-print',async page=>{
  const bytes={...oldBytes,'math-studio-practice-v2':' { damaged practice bytes ','math-studio-inquiry-g7-v1':'[invalid old inquiry'};await seed(page,bytes);const before=await snapshot(page),pack=PRACTICE_PACKS[2];await ready(page,pack,'zh-Hant',false);await revealAll(page);await page.locator('[data-practice-print-edition]').selectOption('student');await page.pdf({path:resolve(output,'corrupt-records-student.pdf'),format:'A4',preferCSSPageSize:true});await download(page,()=>page.locator('[data-practice-export="student"]').click(),'corrupt-records-student.json');assert.deepEqual(await snapshot(page),before);return {malformedStoresUntouched:true,unknownRecordsAndWhitespaceUntouched:true};
 });

 await test('original-native-chapters-open-all-seven-bilingual-packs',async page=>{
  await seed(page,oldBytes);const before=await snapshot(page);let clicks=0;
  for(const locale of ['en','zh-Hant'])for(const pack of PRACTICE_PACKS){
   await page.goto(origin+`/math-studio/?lesson=${pack.nativeLesson}&lang=${locale}`,{waitUntil:'networkidle'});
   const link=page.locator(`[data-guided-practice-link="${pack.id}"]`);await link.waitFor();assert.equal(await link.getAttribute('href'),pathFor(pack,locale));
   const label=await link.innerText();assert.equal(/[\u3400-\u9fff]/u.test(label),locale==='zh-Hant','Authored native entry uses the requested language');
   await link.click();await page.locator(`[data-guided-practice="${pack.id}"]`).waitFor();assert.equal(await page.locator('[data-guided-practice]').getAttribute('data-locale'),locale);assert.deepEqual(await snapshot(page),before);clicks++;
  }
  return {trustedNativeChapterClicks:clicks,allSevenMapped:true,bothLanguages:true,oldNativeBytesUnchanged:true};
 });

 await test('rendered-geometric-polygons-and-symmetry-axes',async page=>{
  let polygons=0,axes=0,circles=0,constructions=0,mirrorPairs=0;
  for(const pack of PRACTICE_PACKS.filter(pack=>pack.grade==='g8')){await ready(page,pack);await revealAll(page);
   for(const question of pack.questions.filter(q=>q.audit.kind==='axis-count'&&q.diagram?.kind==='shape')){
    const card=page.locator(`[data-practice-question][data-question-id="${question.id}"]`);
    const drawings=await card.locator('svg').evaluateAll(nodes=>nodes.map(svg=>({polygons:[...svg.querySelectorAll('polygon')].map(el=>el.getAttribute('points').trim().split(/\s+/).map(p=>p.split(',').map(Number))),circles:[...svg.querySelectorAll('circle[r]')].filter(el=>Number(el.getAttribute('r'))>10).map(el=>Number(el.getAttribute('r'))),axes:[...svg.querySelectorAll('line.axis')].map(el=>[[Number(el.getAttribute('x1')),Number(el.getAttribute('y1'))],[Number(el.getAttribute('x2')),Number(el.getAttribute('y2'))]])})));
    assert.ok(drawings.length>=2,question.id+'/student and answer diagram');
    if(question.audit.shape==='circle'){assert.equal(question.audit.expected,'infinite');assert.ok(drawings.every(drawing=>drawing.circles.length===1&&drawing.circles[0]>0));circles++;continue;}
    for(const drawing of drawings){assert.equal(drawing.polygons.length,1,question.id);assert.equal(axisCount(drawing.polygons[0]),question.audit.expected,question.id+'/rendered polygon symmetry count');for(const axis of drawing.axes){assert.ok(drawing.polygons[0].every(point=>drawing.polygons[0].some(other=>near(reflection(point,axis),other))),question.id+'/drawn axis must reflect actual polygon');axes++;}}
    assert.equal(drawings.at(-1).axes.length,question.audit.expected,question.id+'/all answer axes');polygons++;
   }
   for(const q of pack.questions.filter(q=>q.audit.kind==='construction-axis'&&['construction','mirror-pair'].includes(q.diagram?.kind))){
    const drawings=await page.locator(`[data-practice-question][data-question-id="${q.id}"] svg`).evaluateAll(nodes=>nodes.map(svg=>{const dots=[...svg.querySelectorAll('circle')].filter(el=>Number(el.getAttribute('r'))<5).map(el=>[Number(el.getAttribute('cx')),Number(el.getAttribute('cy'))]),labels={};for(const text of svg.querySelectorAll('text')){const position=[Number(text.getAttribute('x')),Number(text.getAttribute('y'))];labels[text.textContent]=dots.toSorted((a,b)=>Math.hypot(a[0]-position[0],a[1]-position[1])-Math.hypot(b[0]-position[0],b[1]-position[1]))[0];}return {labels,axes:[...svg.querySelectorAll('line.axis')].map(el=>[[Number(el.getAttribute('x1')),Number(el.getAttribute('y1'))],[Number(el.getAttribute('x2')),Number(el.getAttribute('y2'))]])};}));
    if(q.diagram.kind==='mirror-pair'){const drawing=drawings[0];assert.equal(drawing.axes.length,1);for(const point of q.diagram.vertices){assert.ok(near(reflection(drawing.labels[point.label],drawing.axes[0]),drawing.labels[point.primeLabel||point.label+'′']),q.id+'/rendered corresponding mirror vertices');}mirrorPairs++;continue;}
    assert.equal(drawings.length,2,q.id+'/blank and solution construction');assert.equal(drawings[0].axes.length,0,q.id+'/student construction does not draw the requested axis');assert.equal(drawings[1].axes.length,1,q.id+'/answer construction draws one candidate axis');const drawing=drawings[1],axis=drawing.axes[0];
    if(q.diagram.tool==='angle-bisector'){const label=key=>drawing.labels[q.diagram.labels?.[key]||key];assert.ok(near(reflection(label('A'),axis),label('B')),q.id+'/actual constructed angle axis interchanges rays');assert.ok(near(reflection(label('O'),axis),label('O')),q.id+'/actual angle axis passes vertex');}
    else{const matches=q.diagram.pairs.map(([a,b])=>near(reflection(drawing.labels[q.diagram.points[a].label],axis),drawing.labels[q.diagram.points[b].label]));if(q.audit.valid||q.audit.error==='joining-line')assert.ok(matches.every(Boolean),q.id+'/constructed solution reflects every required pair');else{assert.ok(matches.some(Boolean)&&matches.some(value=>!value),q.id+'/inconsistent pairs cannot share the drawn candidate axis');}}
    constructions++;axes++;
   }
  }
  assert.ok(polygons>=5&&constructions>=8&&mirrorPairs>=1,'Actual polygons, ruler-and-compass constructions and a mirror pair must be checked');return {polygons,axes,circles,constructions,mirrorPairs,svgCoordinatesIndependentlyReflected:true,tolerancePixels:.03};
 });

 await test('rendered-perpendicular-feet-and-noncircular-proof-marks',async page=>{
  let bisectors=0,perpendicularBisectors=0,obliqueSegments=0,forwardProofs=0,converseProofs=0,sssProofs=0,maxPerpendicularCosine=0;
  const vector=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],length=a=>Math.hypot(...a);
  for(const pack of PRACTICE_PACKS.filter(pack=>pack.grade==='g8')){await ready(page,pack);
   for(const q of pack.questions.filter(q=>['bisector','perpendicular-bisector'].includes(q.diagram?.kind))){
    const svg=page.locator(`[data-practice-question][data-question-id="${q.id}"] svg`).first();
    const drawing=await svg.evaluate(svg=>{const dots=[...svg.querySelectorAll('circle')].filter(el=>Number(el.getAttribute('r'))<5).map(el=>[Number(el.getAttribute('cx')),Number(el.getAttribute('cy'))]),labels={};for(const text of svg.querySelectorAll('text')){const position=[Number(text.getAttribute('x')),Number(text.getAttribute('y'))];labels[text.textContent]=dots.toSorted((a,b)=>Math.hypot(a[0]-position[0],a[1]-position[1])-Math.hypot(b[0]-position[0],b[1]-position[1]))[0];}return {labels,marks:svg.querySelectorAll('line.mark').length,rightAngles:svg.querySelectorAll('path.right').length,angleArcs:svg.querySelectorAll('path.construction').length};});
    const named=key=>{const name=q.diagram.labels?.[key]||key;assert.ok(drawing.labels[name],q.id+'/rendered label '+name);return drawing.labels[name];};
    if(q.diagram.kind==='bisector'){
     const O=named('O'),A=named('A'),B=named('B'),P=named('P'),M=named('M'),N=named('N');
     for(const[foot,end]of [[M,A],[N,B]]){const side=vector(end,O),fromO=vector(foot,O),fromFoot=vector(P,foot),fraction=dot(fromO,side)/dot(side,side),cosine=Math.abs(dot(fromFoot,side)/(length(fromFoot)*length(side))),cross=Math.abs(fromO[0]*side[1]-fromO[1]*side[0])/(length(fromO)*length(side));assert.ok(fraction>0&&fraction<1,q.id+'/foot on the actual side');assert.ok(cross<1e-9,q.id+'/foot lies on side');assert.ok(cosine<1e-9,q.id+'/distance segment actually perpendicular');maxPerpendicularCosine=Math.max(maxPerpendicularCosine,cosine);}
     assert.ok(Math.abs(length(vector(P,M))-length(vector(P,N)))<1e-7,q.id+'/rendered equal perpendicular lengths');assert.equal(drawing.rightAngles,2,q.id+'/two given perpendiculars');
     if(q.audit.kind==='bisector-forward-proof'){assert.equal(drawing.marks,0,q.id+'/do not mark target distances as given');assert.equal(drawing.angleArcs,2,q.id+'/mark given equal vertex angles');forwardProofs++;}
     if(q.audit.kind==='bisector-converse-proof'){assert.equal(drawing.angleArcs,0,q.id+'/do not mark target bisected angle as given');assert.equal(drawing.marks,2,q.id+'/mark given equal perpendicular legs');converseProofs++;}
     if(q.diagram.slanted||q.prompt.en.includes('PQ')){const Q=named('Q'),side=vector(A,O),fromO=vector(Q,O),segment=vector(P,Q);assert.ok(Math.abs(fromO[0]*side[1]-fromO[1]*side[0])/(length(fromO)*length(side))<1e-9,q.id+'/Q actually on OA');assert.ok(Math.abs(dot(segment,side))/(length(segment)*length(side))>.01,q.id+'/PQ is genuinely oblique');obliqueSegments++;}
     bisectors++;
    }else{
     const A=named('A'),B=named('B'),M=named('M'),P=named('P'),midpoint=[(A[0]+B[0])/2,(A[1]+B[1])/2];assert.ok(near(midpoint,M,1e-7),q.id+'/actual midpoint');assert.ok(Math.abs(dot(vector(B,A),vector(P,M)))<1e-7,q.id+'/actual perpendicular line');
     assert.equal(drawing.rightAngles,q.diagram.givenPerpendicular===false?0:1,q.id+'/only given right-angle marker');
     if(q.audit.kind==='perpendicular-bisector-proof'&&q.audit.method==='SSS'){assert.equal(drawing.rightAngles,0,q.id+'/SSS must derive perpendicularity');assert.equal(drawing.marks,6,q.id+'/given midpoint and endpoint distance ticks');sssProofs++;}
     perpendicularBisectors++;
    }
   }
  }
  assert.ok(bisectors>=8&&perpendicularBisectors>=5&&obliqueSegments>=2&&forwardProofs>=2&&converseProofs>=2&&sssProofs>=1,'Actual proof and non-proof geometric setups must all be covered');
  return {bisectors,perpendicularBisectors,obliqueSegments,forwardProofs,converseProofs,sssProofs,maxPerpendicularCosine,footMembershipAndOrthogonality:true,noConclusionMarkedAsGiven:true};
 });

 await test('existing-classroom-two-tab-selection-and-backup-roundtrip',async(page,context)=>{
  await seed(page,oldBytes);const other=await context.newPage();await Promise.all([page.goto(origin+'/teaching/math/',{waitUntil:'networkidle'}),other.goto(origin+'/teaching/math/',{waitUntil:'networkidle'})]);await Promise.all([page,other].map(target=>target.evaluate(()=>{window.__guidedQaStorageEvents=0;addEventListener('storage',()=>window.__guidedQaStorageEvents++);})));
  const ids=PRACTICE_PACKS.slice(0,2).map(pack=>'classroom:'+pack.id);
  for(const [target,id]of [[page,ids[0]],[other,ids[1]]])await target.locator('[data-filter-query]').fill(id.split(':').at(-1));
  const locker=await context.newPage();await locker.goto(origin+'/teaching/',{waitUntil:'networkidle'});await locker.evaluate(()=>{void navigator.locks.request('math-learning:writer:v1',async()=>{window.__guidedQaHeld=true;await new Promise(resolve=>window.__guidedQaRelease=resolve);});});await locker.waitForFunction(()=>window.__guidedQaHeld);
  try{await Promise.all([page.locator(`[data-add-id="${ids[0]}"]`).click(),other.locator(`[data-add-id="${ids[1]}"]`).click()]);assert.equal(await page.evaluate(()=>localStorage.getItem('math-system-notebook-v1')),null,'Both pack additions should still be waiting behind the writer lock');}finally{await locker.evaluate(()=>window.__guidedQaRelease());await locker.close();}
  await Promise.all([page.evaluate(()=>MathStorage.flushAll()),other.evaluate(()=>MathStorage.flushAll())]);
  await page.waitForFunction(ids=>{const saved=JSON.parse(localStorage.getItem('math-system-notebook-v1')||'{}');return ids.every(id=>saved.classroom?.ids.includes(id));},ids);
  await Promise.all([page.locator('[data-system-view="classroom"]').click(),other.locator('[data-system-view="classroom"]').click()]);
  await page.locator('[data-system-classroom-title]').fill('QA_FIXED_40_MINUTE_PACKS');await page.evaluate(()=>MathStorage.flushAll());
  await other.waitForFunction(()=>document.querySelector('[data-system-classroom-title]').value==='QA_FIXED_40_MINUTE_PACKS');
  const beforeMove=await page.evaluate(()=>JSON.parse(localStorage.getItem('math-system-notebook-v1')).classroom.ids);
  await other.locator('[data-classroom-action="up"][data-classroom-index="1"]').click();await other.evaluate(()=>MathStorage.flushAll());
  await page.waitForFunction(id=>JSON.parse(localStorage.getItem('math-system-notebook-v1')).classroom.ids[0]===id,beforeMove[1]);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('math-system-notebook-v1')).classroom);
  for(const[key,value]of Object.entries(oldBytes))assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),value);
  await page.locator('[data-system-view="learning"]').click();const backup=await download(page,()=>page.locator('[data-system-backup-download]').click(),'classroom-system-backup.json');
  assert.deepEqual(JSON.parse(backup.localStorage['math-system-notebook-v1']).classroom,saved);
  const fresh=await browser.newContext({acceptDownloads:true});try{const target=await fresh.newPage();await target.goto(origin+'/teaching/math/?view=learning',{waitUntil:'networkidle'});await target.locator('[data-system-backup-file]').setInputFiles({name:'classroom-system-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await target.locator('[data-system-import-preview]').waitFor();await download(target,()=>target.locator('[data-system-backup-apply]').click(),'before-classroom-backup-import.json');await target.waitForFunction(()=>document.querySelector('[data-system-backup-status]').textContent.includes('Selected records restored'));assert.deepEqual(await target.evaluate(()=>JSON.parse(localStorage.getItem('math-system-notebook-v1')).classroom),saved);for(const[key,value]of Object.entries(oldBytes).filter(([key])=>key!=='qa-unrelated-record'))assert.equal(await target.evaluate(key=>localStorage.getItem(key),key),value);}finally{await fresh.close();}
  const events=await Promise.all([page,other].map(target=>target.evaluate(()=>window.__guidedQaStorageEvents)));assert.ok(events.every(count=>count>0),'Real native storage events must cross both tabs');return {nativeStorageEvents:events,forcedOverlapDisjointPackAddsRetained:true,titleSynced:true,moveSynced:true,oldNativeBytesUntouched:true,backupIncludesFixedPackIds:true,freshContextRestore:true};
 });

 await test('mobile-bilingual-route-and-keyboard-controls',async page=>{
  await page.setViewportSize({width:390,height:844});let pages=0,switches=0;
  for(const pack of PRACTICE_PACKS)for(const locale of ['en','zh-Hant']){
   await ready(page,pack,locale);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),pack.id+'/'+locale+'/390px horizontal overflow');pages++;
   await page.locator('[data-practice-route]').selectOption('inquiry');
   const language=page.locator('[data-language-switch]');assert.equal(await language.count(),1);const targetLocale=locale==='en'?'zh-Hant':'en';await language.click();await page.locator(`[data-guided-practice="${pack.id}"][data-locale="${targetLocale}"]`).waitFor();assert.equal(await page.locator('[data-practice-route]').inputValue(),'inquiry');assert.equal(new URL(page.url()).searchParams.get('route'),'inquiry');assert.equal(await page.locator('[data-practice-answer-content]:visible,[data-practice-step-content]:visible,[data-practice-hint-content]:visible').count(),0);switches++;
   await page.locator('[data-practice-route]').selectOption('practice');const active=()=>page.locator('[data-practice-question][data-current="true"]'),first=await active().getAttribute('data-question-id');await active().focus();await page.keyboard.press('ArrowRight');assert.notEqual(await active().getAttribute('data-question-id'),first);await page.keyboard.press('ArrowLeft');assert.equal(await active().getAttribute('data-question-id'),first);
   await page.locator('[data-practice-phase]').focus();await page.evaluate(()=>{window.__guidedQaIndexTransitions=[];window.__guidedQaIndexObserver=new MutationObserver(records=>window.__guidedQaIndexTransitions.push(...records.map(record=>record.oldValue)));window.__guidedQaIndexObserver.observe(document.querySelector('[data-guided-practice]'),{attributes:true,attributeFilter:['data-practice-current-index'],attributeOldValue:true});});await page.keyboard.press('ArrowRight');
   const focused=await page.evaluate(()=>{window.__guidedQaIndexObserver.disconnect();return {index:document.querySelector('[data-guided-practice]').dataset.practiceCurrentIndex,transitions:window.__guidedQaIndexTransitions,phase:document.querySelector('[data-practice-phase]').value,active:document.querySelectorAll('[data-practice-question][data-current="true"]').length};});assert.equal(focused.index,'0');assert.ok(focused.transitions.every(value=>value==='0'),'Focused native phase selection must not invoke custom next-question navigation');if(focused.phase==='inquiry')assert.equal(focused.active,0,'Concept phase intentionally has no active question');
   if(pack===PRACTICE_PACKS[2]&&locale==='en')await page.screenshot({path:resolve(output,'mobile-bisector-bilingual.png'),fullPage:true});
  }
  return {viewport:[390,844],fixedPackLanguageLayouts:pages,trustedGlobalLanguageSwitches:switches,inquiryRouteRetained:true,answersHiddenAfterLanguageChange:true,questionArrowNavigation:true,focusedNativeSelectDoesNotInvokeQuestionNavigation:true};
 });
}finally{
 report.completedAt=new Date().toISOString();report.passed=report.cases.length>0&&report.cases.every(item=>item.status==='passed')&&report.pageErrors.length===0;
 await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));await writeFile(resolve(output,'pdf-manifest.json'),JSON.stringify(manifest,null,2));await browser.close();if(server)await new Promise(resolve=>server.close(resolve));
}
assert.ok(report.passed,JSON.stringify({failed:report.cases.filter(item=>item.status!=='passed'),pageErrors:report.pageErrors}));
