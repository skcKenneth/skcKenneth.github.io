// Lower-volume search gate for a final local build or a confirmed production deployment.
// Source modules supply fixed titles/IDs; interactions use the real Pagefind UI and browser clicks.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile,readdir,realpath} from 'node:fs/promises';
import {resolve,sep,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {G7_LOWER_PACKS} from '../src/data/guided-practice/g7-lower.mjs';
import {G8_LOWER_PACKS} from '../src/data/guided-practice/g8-lower.mjs';
const option=name=>process.argv.includes(name)?process.argv[process.argv.indexOf(name)+1]:null;
if(process.argv.includes('--help')){console.log('node scripts/guided-practice-lower-search-qa.mjs --base URL [--output .tmp/FRESH_DIRECTORY] [--commit SHA] [--actions URL] [--native] [--ids ID,ID]');process.exit(0);}
const url=new URL(option('--base')||'http://127.0.0.1:4399');assert.ok(['http:','https:'].includes(url.protocol)&&!url.username&&!url.password&&!url.search&&!url.hash,'Base must be an HTTP(S) site URL without credentials/query/hash');
const base=url.href.replace(/\/$/,''),project=await realpath(resolve(dirname(fileURLToPath(import.meta.url)),'..')),temporaryRoot=resolve(project,'.tmp');
const output=resolve(option('--output')||resolve(temporaryRoot,'lower-search-'+new Date().toISOString().replace(/[:.]/g,'-')));
const key=path=>process.platform==='win32'?path.toLowerCase():path;
assert.ok(key(output).startsWith(key(temporaryRoot)+sep),'Use a fresh output directory inside the project .tmp directory');
await mkdir(temporaryRoot,{recursive:true});assert.equal(key(await realpath(temporaryRoot)),key(temporaryRoot),'The output root must not be a symbolic link');
let ancestor=dirname(output);while(true){try{assert.ok(key(await realpath(ancestor))===key(temporaryRoot)||key(await realpath(ancestor)).startsWith(key(temporaryRoot)+sep),'Output parent resolves outside .tmp');break;}catch(error){if(error.code!=='ENOENT')throw error;ancestor=dirname(ancestor);}}
try{const entries=await readdir(output);assert.equal(entries.length,0,'Output contains prior evidence; choose a new directory');assert.ok(key(await realpath(output)).startsWith(key(temporaryRoot)+sep),'Output resolves outside .tmp');}catch(error){if(error.code!=='ENOENT')throw error;}
const targetCommit=option('--commit'),actionsURL=option('--actions'),native=process.argv.includes('--native');
const selected=option('--ids')?.split(','),packs=[...G7_LOWER_PACKS,...G8_LOWER_PACKS].filter(p=>!selected||selected.includes(p.id));
if(selected){assert.equal(new Set(selected).size,selected.length,'Duplicate requested pack ID');assert.ok(selected.every(id=>packs.some(pack=>pack.id===id)),'Unknown requested pack ID');}
assert.equal(new Set(packs.map(p=>p.id)).size,packs.length);if(!selected)assert.equal(packs.length,25);assert.ok(packs.length);
const require=createRequire(process.env.PLAYWRIGHT_RUNTIME||'C:/Users/kenneth/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'),{chromium}=require('playwright');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE||'C:/Users/kenneth/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe'});
const report={startedAt:new Date().toISOString(),base,targetCommit,actionsURL,browser:browser.version(),scope:'Lower-volume registered Pagefind results; both locales and 390/1440 px widths on search and landing pages.',isolation:'Disposable contexts and synthetic legacy raw bytes; actual site browser interactions, no application mocks.',nativeChapterClicks:native,cases:[],pageErrors:[]};
const legacy={'math-studio-practice-v2':' '+JSON.stringify({FUTURE_RECORD:1700000000000})+' ','math-studio-inquiry-g7-v1':JSON.stringify({'future-id':{prediction:'KEEP 原樣 ^(3+4)'}}),'math-studio-inquiry-g8-v1':JSON.stringify({'future-id':{prediction:'KEEP ^(-2)'}}),'jae-math-v1':' '+JSON.stringify({version:1,answers:{'future-id':{notes:'KEEP'}}})+' ','qa-unrelated':' opaque bytes '};
async function widths(page){const result=[];for(const width of [1440,390]){await page.setViewportSize({width,height:width===390?844:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Horizontal overflow at '+width);result.push(width);}return result;}
async function persist(){await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));}
try{
 for(const locale of ['zh-Hant','en'])for(const pack of packs){
  const name=pack.id+'-'+locale,prefix=locale==='zh-Hant'?'/zh':'',context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  context.on('page',page=>page.on('pageerror',error=>report.pageErrors.push({case:name,url:page.url(),error:String(error)})));
  const page=await context.newPage();
  try{
   let response=await page.goto(base+prefix+'/search/',{waitUntil:'networkidle'});assert.equal(response.status(),200);
   await page.evaluate(data=>{for(const[key,value]of Object.entries(data))localStorage.setItem(key,value);},legacy);
   const query=pack.title[locale];await page.locator('#search-input').fill(query);await page.locator('[data-search-form] button[type="submit"]').click();
   const expected=prefix+'/teaching/classroom-packs/'+pack.id+'/',link=page.locator(`[data-search-results] a[href$="${expected}"]`).first();
   await link.waitFor({state:'visible',timeout:25000});await page.waitForFunction(()=>document.querySelector('[data-search-results]')?.getAttribute('aria-busy')==='false'&&!/Searching|搜尋中/.test(document.querySelector('[data-search-status]')?.textContent||''));
   const status=await page.locator('[data-search-status]').innerText();assert.ok(!/could not load|temporarily unavailable|暫時無法載入|暫時無法使用/i.test(status),'Pagefind must load rather than use fallback: '+status);
   const href=new URL(await link.getAttribute('href'),base);assert.equal(href.pathname,expected);const searchWidths=await widths(page);
   await link.click();await page.locator(`[data-guided-practice="${pack.id}"]`).waitFor();await page.waitForFunction(()=>document.querySelector('[data-guided-practice]')?.dataset.guidedReady==='true');assert.equal(new URL(page.url()).pathname,expected);
   assert.equal(await page.locator('[data-guided-practice]').getAttribute('data-locale'),locale);
   const source=await page.locator('.classroom-meta').innerText();assert.ok(!/upper|[七八]上|基訓|foundation/i.test(source),'Lower source must not be labelled upper/foundation: '+source);assert.ok(locale==='en'?/lower/i.test(source):new RegExp(pack.grade==='g7'?'七下':'八下').test(source));
   assert.equal(await page.locator('[data-guided-practice]').getAttribute('data-print-edition'),'student');
   const landingWidths=await widths(page);await page.screenshot({path:resolve(output,name+'-mobile.png'),fullPage:true});
   const nativeAnchor=page.locator('[data-practice-native]'),nativeHref=new URL(await nativeAnchor.getAttribute('href'),base);assert.equal(nativeHref.pathname,'/math-studio/');assert.equal(nativeHref.searchParams.get('lesson'),pack.nativeLesson);assert.equal(nativeHref.searchParams.get('lang'),locale);
   let nativeEvidence=null;
   if(native){await page.locator('[data-practice-phase]').selectOption('inquiry');await nativeAnchor.waitFor({state:'visible'});const[tab]=await Promise.all([context.waitForEvent('page'),nativeAnchor.click()]);await tab.waitForLoadState('networkidle');await tab.waitForFunction(l=>document.documentElement.lang===l,locale);await tab.locator(`[data-guided-practice-link="${pack.id}"]`).waitFor({state:'visible',timeout:15000});assert.equal(new URL(tab.url()).searchParams.get('lesson'),pack.nativeLesson);const back=tab.locator(`[data-guided-practice-link="${pack.id}"]`);assert.equal(new URL(await back.getAttribute('href'),base).pathname,expected);await back.click();await tab.locator(`[data-guided-practice="${pack.id}"][data-locale="${locale}"]`).waitFor();assert.equal(new URL(tab.url()).pathname,expected);nativeEvidence={phase:'inquiry',lesson:pack.nativeLesson,locale,registeredPackLink:true,trustedReturnClick:true};await tab.close();}
   const raw=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),Object.keys(legacy));assert.deepEqual(raw,legacy,'Legacy synthetic bytes unchanged');
   report.cases.push({name,status:'passed',evidence:{id:pack.id,locale,query,href:href.href,searchStatus:status,source,searchWidths,landingWidths,nativeHref:nativeHref.href,nativeEvidence,legacyBytesExact:true}});console.log('PASS '+name);
  }catch(error){report.cases.push({name,status:'failed',error:String(error),diagnostics:await page.evaluate(()=>({url:location.href,status:document.querySelector('[data-search-status]')?.textContent,results:[...document.querySelectorAll('[data-search-results] a')].map(a=>({text:a.textContent,href:a.href}))})).catch(()=>null)});await page.screenshot({path:resolve(output,name+'-failure.png'),fullPage:true}).catch(()=>{});console.error('FAIL '+name+' '+error.message);}
  finally{await context.close();await persist();}
 }
}finally{report.completedAt=new Date().toISOString();report.expectedCases=packs.length*2;report.passed=report.cases.length===report.expectedCases&&report.cases.every(c=>c.status==='passed')&&!report.pageErrors.length;await persist();await browser.close();}
console.log(JSON.stringify({passed:report.passed,cases:report.cases.length,expected:report.expectedCases,failed:report.cases.filter(c=>c.status==='failed').length,pageErrors:report.pageErrors.length}));if(!report.passed)process.exitCode=1;
