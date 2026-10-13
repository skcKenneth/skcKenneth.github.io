// Isolated browser acceptance. Synthetic records only; never connects to a personal profile.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const arg=name=>process.argv.includes(name)?process.argv[process.argv.indexOf(name)+1]:null;
const directory=resolve(repo,arg('--root')||'dist'),output=resolve(repo,arg('--output')||'.tmp/math-system-browser-qa');
const require=createRequire(process.env.PLAYWRIGHT_RUNTIME||'C:/Users/kenneth/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=require('playwright');
const report={startedAt:new Date().toISOString(),root:directory,isolation:'Disposable Edge contexts; synthetic learning records; no personal profile.',cases:[],pageErrors:[],pdfs:[]};
await mkdir(output,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.wasm':'application/wasm'};
const server=createServer(async(req,res)=>{try{let file=resolve(directory,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(directory+sep))throw Error('outside root');if((await stat(file)).isDirectory())file=resolve(file,'index.html');res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(file));}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=arg('--base')||'http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({executablePath:process.env.QA_BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});report.browser=browser.version();
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function test(name,run,options={}){if(process.env.QA_CASES&&!process.env.QA_CASES.split(',').includes(name))return;const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true,...options});context.on('page',p=>p.on('pageerror',e=>report.pageErrors.push({case:name,url:p.url(),error:String(e)})));const page=await context.newPage();try{const evidence=await run(page,context);report.cases.push({name,status:'passed',evidence});console.log('PASS '+name);}catch(error){await page.screenshot({path:resolve(output,name+'-failure.png'),fullPage:true}).catch(()=>{});report.cases.push({name,status:'failed',error:String(error),stack:error.stack});console.error('FAIL '+name+' '+error.message);}finally{await context.close();await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));}}
async function openG8(page,lang='zh-Hant'){await page.goto(origin+'/math-studio/?lang='+lang+'#g8/bisector-property',{waitUntil:'networkidle'});await page.locator('[data-g8-inquiry="bisector-property"]').waitFor();}
async function flush(page){await page.evaluate(()=>MathStorage.flushAll());}
async function downloaded(page,trigger,name){const promise=page.waitForEvent('download');await trigger();const file=await promise;const path=resolve(output,name);await file.saveAs(path);return readFile(path,'utf8');}
try {
await test('g8-projection-observe-and-prove',async page=>{
 await openG8(page);assert((await page.locator('#g8-result').innerText()).includes('第 3 步'));
 await page.locator('#g8-prediction').fill('QA: I predict equal perpendicular distances because of symmetry.');
 await page.locator('[data-g8-stage="2"]').click();await page.locator('[data-g8-action="capture"]').click();
 for(const r of ['2','6']){await page.locator('[data-g8-case="'+r+'"]').click();await page.locator('[data-g8-action="capture"]').click();}
 assert.equal(await page.locator('#g8-evidence tbody tr').count(),3);
 await page.locator('.g8-stages [data-g8-stage="3"]').click();const m=await page.evaluate(()=>G8BisectorCore.calculate(G8BisectorUI.note().params));assert(m.inside&&m.feetOnRays);assert(m.pm<m.pn);
 await page.locator('.g8-stages [data-g8-stage="4"]').click();assert.equal(await page.locator('details[data-g8-answer][open]').count(),0);await page.locator('details[data-g8-answer] summary').click();assert((await page.locator('details[data-g8-answer]').innerText()).includes('AAS'));
 await flush(page);await page.reload({waitUntil:'networkidle'});assert((await page.evaluate(()=>G8BisectorUI.note().prediction)).includes('QA:'));assert.equal((await page.evaluate(()=>G8BisectorUI.note().evidence)).length,3);
 await page.screenshot({path:resolve(output,'g8-projection.png'),fullPage:true});return {cases:3,proof:'AAS',reloadPreserved:true};
});
await test('g8-mobile-keyboard-invalid-and-bilingual',async page=>{
 await openG8(page,'en');assert.equal(await page.locator('[data-g8-inquiry]').getAttribute('lang'),'en');
 await page.locator('[data-g8-stage="3"]').click();await page.locator('[data-g8-point]').focus();const before=await page.evaluate(()=>G8BisectorUI.note().params.bearing);await page.keyboard.press('ArrowLeft');assert.equal(await page.evaluate(()=>G8BisectorUI.note().params.bearing),before-1);
 const radius=await page.evaluate(()=>G8BisectorUI.note().params.radius);await page.locator('#g8-radius-number').fill('99');assert.equal(await page.evaluate(()=>G8BisectorUI.note().params.radius),radius);assert.equal(await page.locator('#g8-radius-number').getAttribute('aria-invalid'),'true');
 await page.locator('[data-g8-action="language"]').click();assert.equal(await page.locator('[data-g8-inquiry]').getAttribute('lang'),'zh-Hant');const width=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));assert(width.scroll<=width.client+1);await page.screenshot({path:resolve(output,'g8-mobile.png'),fullPage:true});return {width,keyboard:true,invalidRetained:true};
},{viewport:{width:390,height:844}});
await test('g8-two-tabs-history-unknown-and-locale',async(page,context)=>{
 const key='math-studio-inquiry-g8-v1';await context.addInitScript(({key})=>{if(location.protocol!=='http:'&&location.protocol!=='https:')return;if(!localStorage.getItem('__qaSeed')){localStorage.setItem(key,JSON.stringify({'future-activity':{draft:'preserve unknown'},'bisector-property':{prediction:'original',evidence:[]}}));localStorage.setItem('__qaSeed','1');}},{key});
 await openG8(page);const other=await context.newPage();await openG8(other,'en');
 await page.locator('#g8-prediction').fill('QA_A_PREDICTION');await flush(page);await other.waitForFunction(()=>G8BisectorUI.note().prediction==='QA_A_PREDICTION');
 await other.locator('[data-g8-stage="6"]').click();await other.locator('#g8-exit').fill('QA_B_EXIT_PERPENDICULAR');await flush(other);await page.waitForFunction(()=>G8BisectorUI.note().exit==='QA_B_EXIT_PERPENDICULAR');
 const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);assert.equal(saved['future-activity'].draft,'preserve unknown');assert.equal(saved['bisector-property'].prediction,'QA_A_PREDICTION');assert.equal(saved['bisector-property'].exit,'QA_B_EXIT_PERPENDICULAR');assert.equal(await page.locator('[data-g8-inquiry]').getAttribute('lang'),'zh-Hant');assert.equal(await other.locator('[data-g8-inquiry]').getAttribute('lang'),'en');return {unknownPreserved:true,twoFields:true,localesIndependent:true};
});
await test('g8-immediate-export-and-storage-denied',async(page,context)=>{
 await context.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('QA quota','QuotaExceededError');};});await openG8(page,'en');
 const text=await downloaded(page,()=>page.evaluate(()=>{const input=document.querySelector('#g8-prediction');input.value='QA_IMMEDIATE_UNSAVED';input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[data-g8-action="export"]').click();}),'g8-denied-export.txt');assert(text.includes('QA_IMMEDIATE_UNSAVED'));await flush(page);const status=await page.locator('#g8-save-status').innerText();assert(/retained in this page|目前紀錄保留/i.test(status));return {immediateDraftExported:true,deniedWorkUsable:true,status};
});
await test('legacy-g7-native-two-tab-events',async(page,context)=>{
 const open=async p=>{await p.goto(origin+'/math-studio/?lab=number&grade=g7',{waitUntil:'networkidle'});await p.locator('[data-g7-inquiry="number"]').waitFor();};await open(page);const other=await context.newPage();await open(other);
 await context.addInitScript(()=>window.__trusted=[]);await page.evaluate(()=>{window.__trusted=[];addEventListener('storage',e=>window.__trusted.push(e.isTrusted));});
 await Promise.all([page.locator('[data-g7-field="prediction"]').fill('QA_FIRST_PREDICTION'),other.locator('[data-g7-field="claim"]').fill('QA_OTHER_REASONING')]);await Promise.all([flush(page),flush(other)]);
 await page.waitForFunction(()=>{const r=JSON.parse(localStorage.getItem('math-studio-inquiry-g7-v1'));return r?.number?.prediction==='QA_FIRST_PREDICTION'&&r.number.claim==='QA_OTHER_REASONING';});await page.waitForFunction(()=>document.querySelector('[data-g7-field="claim"]').value==='QA_OTHER_REASONING');assert((await page.evaluate(()=>window.__trusted)).some(Boolean));return {trustedStorageEvents:true,differentFieldsPreserved:true};
});
await test('g8-real-a4-student-and-teacher',async page=>{
 for(const lang of ['zh-Hant','en']){await openG8(page,lang);for(const edition of ['student','teacher']){await page.evaluate(()=>{window.print=()=>document.documentElement.dataset.printRequested='true';});await page.locator('[data-g8-action="print-'+edition+'"]').click();await page.waitForFunction(()=>document.documentElement.dataset.printRequested==='true');const filename='g8-'+lang+'-'+edition+'.pdf';await page.pdf({path:resolve(output,filename),format:'A4',printBackground:true});report.pdfs.push(filename);await page.evaluate(()=>{window.dispatchEvent(new Event('afterprint'));delete document.documentElement.dataset.printRequested;});assert.equal(await page.locator('#g8-print-root').count(),0);}}
 return {actualA4:report.pdfs.length};
});
} finally {await browser.close();await new Promise(r=>server.close(r));report.finishedAt=new Date().toISOString();report.summary={cases:report.cases.length,passed:report.cases.filter(c=>c.status==='passed').length,failed:report.cases.filter(c=>c.status==='failed').length,pageErrors:report.pageErrors.length};await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report.summary));if(report.summary.failed||report.summary.pageErrors)process.exitCode=1;}
