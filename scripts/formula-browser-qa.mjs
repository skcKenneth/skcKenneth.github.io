import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const require=createRequire(process.env.PLAYWRIGHT_RUNTIME||'C:/Users/kenneth/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=require('playwright');
const arg=key=>process.argv.includes(key)?process.argv[process.argv.indexOf(key)+1]:null;
const output=resolve(arg('--output')||'.tmp/formula-browser-qa');
let origin=arg('--base')||'http://127.0.0.1:4399',server;
if(arg('--serve')){
 const directory=resolve(arg('--serve')),types={'.html':'text/html;charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
 server=createServer(async(req,res)=>{try{let file=resolve(directory,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(file!==directory&&!file.startsWith(directory+sep))throw Error('Outside build');if((await stat(file)).isDirectory())file=resolve(file,'index.html');res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(file));}catch{res.writeHead(404);res.end('Not found');}});
 await new Promise(done=>server.listen(0,'127.0.0.1',done));origin='http://127.0.0.1:'+server.address().port;
}
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE||'C:/Users/kenneth/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe'});
const report={startedAt:new Date().toISOString(),origin,browser:browser.version(),isolation:'Disposable contexts and synthetic legacy records; no application mocks.',cases:[],pageErrors:[],fontFailures:[]};
const legacy={
 'jae-math-v1':' '+JSON.stringify({version:1,answers:{'formula-old':{notes:'KEEP 原樣',unknown:7}}})+' ',
 'math-studio-practice-v2':JSON.stringify({'OLD_UNRECOGNIZED_PROMPT':1700000000000}),
 'math-studio-inquiry-g7-v1':' '+JSON.stringify({'future-id':{prediction:'USER ^(3+4)',extra:{keep:true}}})+' ',
 'math-studio-inquiry-g8-v1':JSON.stringify({'future-id':{prediction:'KEEP'}}),
 'qa-unrelated':'  opaque bytes  '
};
const snap=page=>page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(key=>[key,localStorage.getItem(key)])));
async function seed(page){await page.goto(origin+'/teaching/',{waitUntil:'networkidle'});await page.evaluate(data=>{localStorage.clear();for(const[key,value]of Object.entries(data))localStorage.setItem(key,value);},legacy);}
async function go(page,url){const response=await page.goto(origin+url,{waitUntil:'networkidle'});assert.equal(response.status(),200,url);await page.evaluate(()=>document.fonts.ready);}
const question=(page,id)=>page.locator(`[data-practice-question][data-question-id="${id}"]`);
async function exponentTexts(locator){return locator.locator('msup').evaluateAll(nodes=>nodes.map(node=>node.children[1].textContent.replaceAll('−','-').replace(/[×∗⋅·]/g,'*')));}
async function noCaretProse(locator){const rows=await locator.evaluate(root=>{const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),bad=[];let node;while(node=walker.nextNode())if(!node.parentElement.closest('.katex,math,[data-authored-math],textarea,input,[data-user-content],script,style')&&/\^|\\[A-Za-z]+/.test(node.nodeValue))bad.push(node.nodeValue);return bad;});assert.deepEqual(rows,[]);}
async function download(page,button,file){assert.equal(await button.count(),1,'Requested download control exists');await page.bringToFront();const[item]=await Promise.all([page.waitForEvent('download'),button.click()]);await item.saveAs(resolve(output,file));return JSON.parse(await readFile(resolve(output,file),'utf8'));}
async function persist(){await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));}
async function check(name,run){if(process.env.QA_CASES&&!process.env.QA_CASES.split(',').includes(name))return;const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});context.on('page',page=>{page.on('pageerror',error=>report.pageErrors.push({case:name,url:page.url(),error:String(error)}));page.on('response',response=>{if(/\.(?:woff2?|ttf)(?:\?|$)/.test(response.url())&&response.status()>=400)report.fontFailures.push({url:response.url(),status:response.status()});});});const page=await context.newPage();try{const evidence=await run(page,context);report.cases.push({name,status:'passed',evidence});console.log('PASS '+name);}catch(error){report.cases.push({name,status:'failed',error:String(error),stack:error.stack});await page.screenshot({path:resolve(output,name+'-failure.png'),fullPage:true}).catch(()=>{});console.error('FAIL '+name+' '+error.message);}finally{await context.close();await persist();}}
try{
 await check('bilingual-rendered-exponent-semantics-fonts-and-mobile',async page=>{
  let routes=0;
  for(const locale of ['en','zh-Hant'])for(const pack of ['g8-rational-operations','g8-powers-multiplication']){
   await go(page,`${locale==='en'?'':'/zh'}/teaching/classroom-packs/${pack}/teacher/`);routes++;
   if(pack==='g8-rational-operations'){
    for(const [suffix,expected]of [['prior:negative-power','-3'],['independent:negative-base-power','-2'],['supplement:negative-fraction-base','-2']])assert.ok((await exponentTexts(question(page,pack+':'+suffix).locator('.guided-question-body'))).includes(expected),suffix);
    assert.ok((await exponentTexts(question(page,pack+':extension:scientific-product').locator('[data-practice-answer-content]'))).includes('-8'));
   }else{
    assert.ok((await exponentTexts(question(page,pack+':prior:same-base').locator('.guided-solution-steps'))).includes('3+4'));
    assert.ok((await exponentTexts(question(page,pack+':prior:power-of-power').locator('.guided-solution-steps'))).includes('3*4'));
    assert.ok((await exponentTexts(question(page,pack+':prior:power-of-power').locator('[data-practice-answer-content]'))).includes('12'));
    assert.ok((await exponentTexts(question(page,pack+':guided:product-power-fill').locator('.guided-scaffold'))).some(value=>value.includes('□')));
   }
   await noCaretProse(page.locator('.guided-question-stack'));await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const fonts=await page.evaluate(()=>[...document.fonts].filter(font=>font.family==='KaTeX_Main').some(font=>font.status==='loaded'));assert.ok(fonts,'Used KaTeX main font loaded');await page.setViewportSize({width:1440,height:1000});
  }return {routes,negative:true,compound:true,multiDigit:true,blankExponent:true,bothLanguages:true,mobileWidth:390};
 });
 await check('native-foundations-language-and-legacy-bytes',async page=>{
  await seed(page);const before=await snap(page);
  for(const lesson of ['operations','polynomial-add']){
   await go(page,'/math-studio/?lesson='+lesson+'&lang=zh-Hant');assert.equal(await page.evaluate(()=>typeof MathAuthoredMath.render),'function');
   const section=page.locator(`[data-support-details="${lesson}:${lesson==='operations'?'scientific':'terms'}:section"]`);await section.locator('summary').first().click();const worked=section.locator('[data-support-details$=":worked"]');await worked.locator('summary').first().click();assert.ok((await exponentTexts(worked)).length>=1);
   await noCaretProse(section);const annotations=await worked.locator('annotation').allTextContents();await page.locator('[data-action="language"]').click();await page.waitForFunction(()=>document.documentElement.lang==='en');assert.deepEqual(await page.locator(`[data-support-details="${lesson}:${lesson==='operations'?'scientific':'terms'}:worked"] annotation`).allTextContents(),annotations);await noCaretProse(page.locator('#foundations'));
   await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.setViewportSize({width:1440,height:1000});
  }assert.deepEqual(await snap(page),before);return {foundationSections:2,languageSwitches:2,oldBytesExact:true,userNotesUntouched:true};
 });
 await check('native-generated-scientific-grading-and-draft-privacy',async page=>{
  await seed(page);await go(page,'/math-studio/?lesson=operations&lang=zh-Hant');const panel=page.locator('[data-practice-scope="operations"]');await panel.locator('[data-practice-config="level"]').selectOption('3');await panel.locator('[data-practice-config="count"]').selectOption('15');await panel.locator('[data-practice-action="start"]').click();
  const science=panel.locator('.random-question').filter({has:page.locator('.question-prompt').filter({hasText:/多少倍|How many times/})}).first();await science.waitFor();assert.ok((await exponentTexts(science)).length>=2);await noCaretProse(science);
  const input=science.locator('input[data-answer-draft]');const draft='USER \\(x^2\\) <b>原樣</b>';await input.fill(draft);await page.locator('[data-action="language"]').click();await page.waitForFunction(()=>document.documentElement.lang==='en');assert.equal(await input.inputValue(),draft);assert.equal(await science.locator('input .katex,textarea .katex').count(),0);
  const numbers=await science.locator('.question-prompt').evaluate(node=>({a:Number(node.textContent.match(/A\s*=\s*(\d+)×/)[1]),b:Number(node.textContent.match(/B\s*=\s*(\d+)×/)[1])}));const powers=await exponentTexts(science.locator('.question-prompt'));assert.equal(powers.length,2);const answer=numbers.a/numbers.b*10**(Number(powers[0])-Number(powers[1]));await input.fill(String(answer));await science.locator('.numeric-form button').click();assert.ok(await science.locator('.answer-feedback').count());assert.equal(await science.locator('.answer-feedback.is-wrong').count(),0);await noCaretProse(science);
  const after=await snap(page);for(const[key,value]of Object.entries(legacy))if(key!=='math-studio-practice-v2')assert.equal(after[key],value);assert.equal(JSON.parse(after['math-studio-practice-v2']).OLD_UNRECOGNIZED_PROMPT,1700000000000);
  return {trustedRandomDraw:true,independentScientificAnswer:answer,gradeCorrect:true,rawDraftPreserved:true,oldHistoryEntryPreserved:true};
 });
 await check('function-power-hints-render-fractional-and-negative-exponents',async page=>{
  const routes=[];
  for(const locale of ['en','zh-Hant']){
   const route=`${locale==='en'?'':'/zh'}/teaching/senior-math/function-worksheets/11/`;
   await go(page,route);await page.locator('[data-fw-stage-button="2"]').click();
   const hint=page.locator('[data-fw-hint]').first();await hint.locator('summary').click();
   assert.deepEqual(await exponentTexts(hint),['1/2','-1']);await noCaretProse(hint);
   assert.deepEqual(await hint.locator('annotation').allTextContents(),['x^{1/2}','\\sqrt{x}','x^{-1}','\\frac{1}{x}']);
   await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:resolve(output,'function-power-hint-'+locale+'.png'),fullPage:true});
   await page.setViewportSize({width:1440,height:1000});routes.push(route);
  }
  return {routes,renderedExponents:['1/2','-1'],authoredFormulaOnly:true,mobileWidth:390};
 });
 await check('guided-reveal-student-export-and-default-print-privacy',async page=>{
  await seed(page);const before=await snap(page);let pdfs=0;
  for(const locale of ['en','zh-Hant'])for(const pack of ['g8-rational-operations','g8-powers-multiplication']){
   await go(page,`${locale==='en'?'':'/zh'}/teaching/classroom-packs/${pack}/`);const prep=page.locator('[data-guided-teacher-preparation]');if(await prep.getAttribute('open')===null)await prep.locator('summary').first().click();await page.locator('[data-practice-reveal-all]').click();
   const exported=await download(page,page.locator('[data-practice-export="student"]'),pack+'-'+locale+'-student.json');const walk=value=>{if(!value||typeof value!=='object')return;for(const[key,item]of Object.entries(value)){assert.ok(!['answer','answerExpression','steps','numericAnswer','correctChoice','audit'].includes(key)&&!/^solution/i.test(key),key);walk(item);}};walk(exported);
   const root=page.locator('[data-practice-print-root][data-edition="student"]');assert.equal(await root.locator('[data-practice-answer-content],.guided-answer').count(),0);await noCaretProse(root);assert.equal(await page.locator('[data-guided-practice]').getAttribute('data-print-edition'),'student');await page.emulateMedia({media:null});await page.pdf({path:resolve(output,pack+'-'+locale+'-student.pdf'),format:'A4',preferCSSPageSize:true,printBackground:true});pdfs++;
  }assert.deepEqual(await snap(page),before);return {revealAllBeforeOutput:true,studentExports:4,pdfProbes:pdfs,studentDefault:true,noAnswerMarkup:true,legacyBytesExact:true,limit:'Full physical pagination is checked separately by the existing 168-edition collectors/auditors.'};
 });
}finally{report.completedAt=new Date().toISOString();report.passed=report.cases.length>0&&report.cases.every(row=>row.status==='passed')&&!report.pageErrors.length&&!report.fontFailures.length;await persist();await browser.close();if(server)await new Promise(done=>server.close(done));}
assert.ok(report.passed,JSON.stringify({failed:report.cases.filter(row=>row.status==='failed'),pageErrors:report.pageErrors,fontFailures:report.fontFailures}));
