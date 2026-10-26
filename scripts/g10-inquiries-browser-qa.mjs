import {createServer} from 'node:http';
import {readFile,mkdir,writeFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {inquiries,chapters,inquiryUrl,inquiryNoteId,inquiryBase,directAction,directScene} from '../src/data/g10-inquiries.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),output=resolve(root,'.tmp/g10-inquiries-qa'+(process.env.G10_QA_ORIGIN?'-production':''));
await mkdir(output,{recursive:true});
await writeFile(resolve(output,'print-expectations.json'),JSON.stringify(inquiries.map(a=>({id:a.id,chapter:a.chapter,title:a.title,exit:a.exit})),null,2));
const external=process.env.G10_QA_ORIGIN;
if(external&&!/^https:\/\/skckenneth\.github\.io\/?$/i.test(external)&&!/^http:\/\/127\.0\.0\.1:\d+\/?$/.test(external))throw Error('Unexpected QA origin');
const directory=resolve(root,'dist'),mime={'.html':'text/html;charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{try{let path=resolve(directory,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!path.startsWith(directory+sep))throw Error('Outside build');if((await stat(path)).isDirectory())path=resolve(path,'index.html');res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream'});res.end(await readFile(path));}catch{res.writeHead(404);res.end('Not found');}});
if(!external)await new Promise(done=>server.listen(0,'127.0.0.1',done));
const origin=external?.replace(/\/$/,'')||`http://127.0.0.1:${server.address().port}`;
const require=createRequire('C:/Users/kenneth/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.QA_BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={startedAt:new Date().toISOString(),origin,browser:browser.version(),mode:external?'production':'local-static',cases:[],errors:[],pdfs:[]};
async function save(){await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));}
async function run(name,fn,options={}){
 if(process.env.G10_QA_FILTER&&!new RegExp(process.env.G10_QA_FILTER).test(name))return;
 const context=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true,...options}),page=await context.newPage();context.setDefaultTimeout(12000);
 page.on('pageerror',error=>report.errors.push({name,error:String(error)}));
 page.on('console',message=>{const location=message.location().url;if(message.type()==='error'&&(!location||location.startsWith(origin)))report.errors.push({name,consoleError:message.text(),location});});
 page.on('requestfailed',request=>{if(request.url().startsWith(origin))report.errors.push({name,requestFailed:request.url(),error:request.failure()?.errorText});});
 try{const evidence=await fn(page,context);report.cases.push({name,status:'passed',evidence});}
 catch(error){report.cases.push({name,status:'failed',url:page.url(),error:String(error),stack:error.stack});await page.screenshot({path:resolve(output,name.replace(/[^a-z0-9-]/gi,'_')+'-failure.png'),fullPage:true}).catch(()=>{});console.error('FAIL '+name+' '+error.message);}
 finally{await context.close();await save();}
}
async function open(page,activity,locale){const response=await page.goto(origin+inquiryUrl(activity.id,locale),{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);await page.locator('[data-g10-ready="1"]').waitFor();}
async function state(page){return JSON.parse(await page.locator('[data-g10-work-state]').textContent());}
async function nativePointer(page,id){
 const before=await state(page),native=before.metrics.nativeState,scene=directScene(id,native,'en'),signature=JSON.stringify([scene.rows,scene.summary]);let chosen;
 for(const handle of scene.handles||[]){
  const destinations=(scene.zones||[]).map(zone=>({x:zone.x+zone.w/2,y:zone.y+zone.h/2,zone:zone.id}));
  for(const[dx,dy]of [[95,0],[-95,0],[0,-160],[0,80],[150,-80]])destinations.push({x:Math.max(25,Math.min(935,handle.x+dx)),y:Math.max(25,Math.min(515,handle.y+dy))});
  for(const destination of destinations){const action={type:'drag',id:handle.id,...destination,phase:'end'},next=directAction(id,native,action),nextScene=directScene(id,next,'en');if(JSON.stringify(next)!==JSON.stringify(native)&&JSON.stringify([nextScene.rows,nextScene.summary])!==signature){chosen={handle,...destination};break;}}
  if(chosen)break;
 }
 assert.ok(chosen,`${id} has no meaningful pointer operation`);
 const point=async(x,y)=>page.locator('[data-g10-stage]>svg').evaluate((svg,p)=>{const v=new DOMPoint(p.x,p.y).matrixTransform(svg.getScreenCTM());return{x:v.x,y:v.y};},{x,y});
 await page.locator('[data-g10-stage]').scrollIntoViewIfNeeded();const from=await point(chosen.handle.x,chosen.handle.y),to=await point(chosen.x,chosen.y);
 await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:8});await page.mouse.up();
 assert.notEqual(JSON.stringify((await state(page)).metrics.nativeState),JSON.stringify(native),'real native pointer operation did not change state');
}
async function noOverflow(page){assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'horizontal page overflow');const svg=page.locator('[data-g10-stage]>svg');assert.ok(await svg.evaluate(el=>el.getBoundingClientRect().width<=el.parentElement.getBoundingClientRect().width+2),'SVG overflow');}
const filter=process.env.G10_QA_FILTER?new RegExp(process.env.G10_QA_FILTER):null;
if(!process.env.G10_QA_PRINT_ONLY)for(const locale of ['zh-Hant','en']){
 for(const activity of inquiries){const name=`activity-${locale}-${activity.id}`;if(filter&&!filter.test(name))continue;
  await run(name,async page=>{
   await open(page,activity,locale);assert.equal(await page.locator('[data-g10-model]').isVisible(),false);
   await page.locator('[data-g10-reveal]').click();await page.locator('[data-g10-stage]>svg').waitFor();
   const readings=[];for(let i=0;i<activity.cases.length;i++){assert.match(await page.locator(`[data-g10-case="${i}"]`).textContent(),new RegExp('^'+(i+1)+'\\.'));await page.locator(`[data-g10-case="${i}"]`).click();readings.push(await page.locator('[data-g10-table]').textContent());}
   assert.ok(new Set(readings).size>=2,'cases did not change readings');
   const control=page.locator('[data-g10-control]').first(),tag=await control.evaluate(el=>el.tagName),before=await state(page);
   if(tag==='SELECT'){const values=await control.locator('option').evaluateAll(options=>options.map(o=>o.value)),current=await control.inputValue();await control.selectOption(values.find(value=>value!==current));}
   else{await control.focus();const value=Number(await control.inputValue()),max=Number(await control.getAttribute('max'));await page.keyboard.press(value<max?'ArrowRight':'ArrowLeft');}
   assert.notEqual(JSON.stringify((await state(page)).params),JSON.stringify(before.params),'keyboard/select control unchanged');
   await page.locator('[data-g10-case="0"]').click();await page.locator('[data-g10-capture]').click();const different=readings.findIndex(value=>value!==readings[0]);assert.ok(different>0);await page.locator(`[data-g10-case="${different}"]`).click();await page.locator('[data-g10-capture]').click();assert.equal(await page.locator('[data-g10-comparisons] article').count(),2);
   await page.locator('[data-g10-project]').click();assert.equal(await page.locator('[data-g10-project]').getAttribute('aria-pressed'),'true');await noOverflow(page);
   if(activity.nativeId)await nativePointer(page,activity.id);
   if(['g10-03-02','g10-05-04','g10-09-03','g10-14-04'].includes(activity.id))await page.screenshot({path:resolve(output,`${locale}-${activity.id}-projection.png`),fullPage:true});
   return {cases:readings.length,keyboard:true,comparisons:2,projection:true,nativeModel:!!activity.nativeId};
  });
  if(activity.order===1)console.log('Checked '+locale+' chapter '+activity.chapter);
 }
}
if(!process.env.G10_QA_PRINT_ONLY){
 await run('native-repeated-keyboard',async page=>{
  const activity=inquiries.find(a=>a.id==='g10-05-08');await open(page,activity,'en');await page.locator('[data-g10-reveal]').click();const handle=page.locator('[data-direct-handle="cursor"]');await handle.focus();const before=JSON.stringify((await state(page)).metrics.nativeState);await page.keyboard.press('ArrowRight');const afterOne=JSON.stringify((await state(page)).metrics.nativeState);assert.notEqual(afterOne,before);assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-direct-handle')),'cursor');await page.keyboard.press('ArrowRight');assert.notEqual(JSON.stringify((await state(page)).metrics.nativeState),afterOne);return {twoConsecutiveMoves:true,focusRetained:true};
 });
 await run('saved-notes-language-reload-backup',async(page,context)=>{
  const activity=inquiries.find(a=>a.id==='g10-05-04');await open(page,activity,'zh-Hant');await page.locator('.g10-notebook summary').click();await page.locator('[data-g10-note="prediction"]').fill('Synthetic QA prediction — 保留');await page.locator('[data-g10-consent]').check();
  await page.waitForFunction(id=>JSON.parse(localStorage.getItem('math-system-notebook-v1')||'{}').activities?.[id]?.prediction?.includes('Synthetic QA'),inquiryNoteId(activity));
  await page.locator('[data-g10-reveal]').click();await page.locator('[data-g10-case="1"]').click();const before=await state(page);await page.locator('[data-language-switch]').click();await page.locator('[data-g10-ready="1"]').waitFor();assert.ok(page.url().includes('/teaching/'));assert.deepEqual((await state(page)).params,before.params);await page.locator('.g10-notebook summary').click();assert.equal(await page.locator('[data-g10-note="prediction"]').inputValue(),'Synthetic QA prediction — 保留');await page.reload();await page.locator('[data-g10-ready="1"]').waitFor();assert.deepEqual((await state(page)).params,before.params);
  await page.locator('.g10-notebook summary').click();const download=page.waitForEvent('download');await page.locator('[data-g10-export]').click();const file=await download;await file.saveAs(resolve(output,'synthetic-notebook.json'));
  const original=await page.evaluate(()=>localStorage.getItem('math-system-notebook-v1'));assert.equal(Object.keys(JSON.parse(original).activities).filter(id=>id.includes('function-worksheet:04')).length,1);
  return {sharedFunctionIdentity:true,language:true,reload:true,download:file.suggestedFilename(),savedStore:JSON.parse(original)};
 });
 await run('complete-backup-restore-g10-and-legacy',async page=>{
  const activity=inquiries.find(a=>a.id==='g10-03-01'),noteId=inquiryNoteId(activity),legacy=' {"sets":{"prediction":"QA original legacy evidence","version":"original"},"future-id":{"draft":"retain exact bytes"}} ';
  await page.goto(origin+'/');await page.evaluate(value=>localStorage.setItem('math-studio-inquiry-v2',value),legacy);await open(page,activity,'en');await page.locator('[data-g10-reveal]').click();await page.locator('.g10-notebook summary').click();await page.locator('[data-g10-note="prediction"]').fill('QA_G10_RESTORE');await page.locator('[data-g10-consent]').check();await page.locator('[data-g10-capture]').click();await page.locator('[data-g10-case="1"]').click();await page.locator('[data-g10-capture]').click();await page.waitForFunction(id=>JSON.parse(localStorage.getItem('math-system-notebook-v1')||'{}').activities?.[id]?.microComparisons?.length===2,noteId);
  await page.goto(origin+'/teaching/math/?view=learning');await page.locator('[data-system-backup-download]').waitFor();const downloading=page.waitForEvent('download');await page.locator('[data-system-backup-download]').click();const download=await downloading,path=resolve(output,'synthetic-complete-backup.json');await download.saveAs(path);const bytes=await readFile(path),backup=JSON.parse(bytes);assert.equal(backup.localStorage['math-studio-inquiry-v2'],legacy);assert.equal(JSON.parse(backup.localStorage['math-system-notebook-v1']).activities[noteId].microComparisons.length,2);
  const restoredContext=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});try{const restored=await restoredContext.newPage();restored.on('pageerror',error=>report.errors.push({name:'complete-backup-restore-g10-and-legacy',error:String(error)}));await restored.goto(origin+'/teaching/math/?view=learning');await restored.locator('[data-system-backup-file]').setInputFiles({name:'synthetic-complete-backup.json',mimeType:'application/json',buffer:bytes});await restored.locator('[data-system-import-preview]').waitFor({state:'visible'});const beforeImport=restored.waitForEvent('download');await restored.locator('[data-system-backup-apply]').click();await beforeImport;await restored.waitForFunction(id=>JSON.parse(localStorage.getItem('math-system-notebook-v1')||'{}').activities?.[id]?.prediction==='QA_G10_RESTORE',noteId);assert.equal(await restored.evaluate(()=>localStorage.getItem('math-studio-inquiry-v2')),legacy);
   await open(restored,activity,'en');await restored.locator('.g10-notebook summary').click();assert.equal(await restored.locator('[data-g10-note="prediction"]').inputValue(),'QA_G10_RESTORE');assert.equal(await restored.locator('[data-g10-comparisons] article').count(),2);return {actualCompleteDownload:true,actualRestore:true,freshBrowserContext:true,comparisons:2,legacyBytesPreserved:true};
  }finally{await restoredContext.close();}
 });
 for(const viewport of [{width:1024,height:768},{width:390,height:844}])await run(`viewport-${viewport.width}`,async page=>{
  for(const id of ['g10-01-04','g10-05-01','g10-07-10','g10-09-03','g10-10-05','g10-14-04']){const activity=inquiries.find(a=>a.id===id);await open(page,activity,'zh-Hant');await page.locator('[data-g10-reveal]').tap();await noOverflow(page);if(viewport.width===1024)await page.locator('[data-g10-project]').tap();await page.locator('[data-g10-case="1"]').tap();}
  await page.screenshot({path:resolve(output,`viewport-${viewport.width}.png`),fullPage:true});return {activities:6,touch:true};
 },{viewport,hasTouch:true,isMobile:viewport.width===390});
 await run('original-studio-and-unified-filter',async page=>{
  await page.goto(origin+'/math-studio/?lab=exponential&grade=g10&lang=en');await page.locator('[data-g10-inquiry-link]').first().waitFor();assert.equal(await page.locator('[data-g10-inquiry-link]').count(),85);
  await page.goto(origin+'/zh/teaching/math/?activity=school%3Ainquiry%3Ag10-09-03');const frame=page.frameLocator('[data-frame-mount] iframe');await frame.locator('[data-g10-ready="1"]').waitFor();await frame.locator('[data-g10-reveal]').click();await frame.locator('[data-g10-case="2"]').click();assert.match(await frame.locator('[data-g10-summary]').textContent(),/2|兩/);return {originalLinks:85,unifiedEmbedding:true};
 });
 await run('storage-denied-readable-and-exportable',async(page,context)=>{
  await context.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError');}});Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('Denied','SecurityError');}});});await open(page,inquiries[0],'en');await page.locator('[data-g10-reveal]').click();await page.locator('.g10-notebook summary').click();await page.locator('[data-g10-note="explanation"]').fill('Session-only QA');await page.locator('[data-g10-consent]').check();const download=page.waitForEvent('download');await page.locator('[data-g10-export]').click();await download;return {interactive:true,export:true};
 });
}
if(!process.env.G10_QA_SKIP_PRINT)for(const locale of ['zh-Hant','en'])for(const chapter of chapters)for(const teacher of [false,true])await run(`print-${locale}-${chapter.id}-${teacher?'teacher':'student'}`,async page=>{
 const url=origin+inquiryBase(locale)+`print/${chapter.id}/${teacher?'teacher/':''}`;const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});assert.equal(response.status(),200);await page.locator('[data-g10-paper-id]').first().waitFor({state:'visible'});await page.emulateMedia({media:'print'});await page.evaluate(async()=>{await document.fonts.ready;});assert.equal(await page.locator('[data-g10-paper-id]').count(),chapter.count);assert.equal(await page.locator('[data-g10-paper-answer]').count(),teacher?chapter.count:0);
 assert.equal(await page.locator('[data-g10-teacher-case-label]').count()>0,teacher);if(!teacher){assert.ok(await page.locator('[data-g10-student-case]').count()>0);for(const label of await page.locator('[data-g10-student-case]').allTextContents())assert.match(label,/^(Case|例子)\s+\d+$/);}
 const name=`${locale}-${chapter.id}-${teacher?'teacher':'student'}.pdf`;await page.pdf({path:resolve(output,name),format:'A4',printBackground:true,preferCSSPageSize:true});report.pdfs.push({file:name,locale,chapter:chapter.id,teacher,count:chapter.count});return {cards:chapter.count,pdf:name,answers:teacher};
});
await browser.close();if(!external)await new Promise(done=>server.close(done));if(!report.cases.length)report.errors.push({error:'No QA cases matched the requested filter.'});report.finishedAt=new Date().toISOString();await save();
const failures=report.cases.filter(c=>c.status!=='passed');console.log(JSON.stringify({cases:report.cases.length,passed:report.cases.length-failures.length,failed:failures.length,pageErrors:report.errors.length,pdfs:report.pdfs.length,report:resolve(output,'report.json')}));if(failures.length||report.errors.length)process.exitCode=1;
