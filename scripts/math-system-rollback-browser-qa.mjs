// Real IndexedDB transactions in a disposable browser context; synthetic records only.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const require=createRequire(process.env.PLAYWRIGHT_RUNTIME||'C:/Users/kenneth/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=require('playwright');
const base=process.env.MATH_QA_ORIGIN||'http://127.0.0.1:4398';
const browser=await chromium.launch({executablePath:process.env.QA_BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const context=await browser.newContext(),page=await context.newPage();
try{
 await page.goto(base+'/teaching/math/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!window.MathStorage);
 const evidence=await page.evaluate(async()=>{
  const {readWorkshopRecords,restoreWorkshopRecords,rollbackWorkshopRecords}=await import('/src/lib/math-system-records.mjs');
  const old={lessonId:'qa-existing-draft',code:'original code',prediction:'old prediction'},unrelated={lessonId:'qa-unrelated-draft',code:'keep unrelated'};
  const importedOld={...old,code:'imported replacement'},inserted={lessonId:'qa-new-draft',code:'new imported code'};
  await restoreWorkshopRecords(indexedDB,[old,unrelated],new Set([old.lessonId,unrelated.lessonId]));
  const before=await readWorkshopRecords(indexedDB),owned=[importedOld,inserted];
  await restoreWorkshopRecords(indexedDB,owned,new Set([old.lessonId]));
  await rollbackWorkshopRecords(indexedDB,before,owned);
  const rolled=await readWorkshopRecords(indexedDB);
  if(rolled.some(record=>record.lessonId===inserted.lessonId))throw Error('New IDB insert survived rollback');
  if(rolled.find(record=>record.lessonId===old.lessonId)?.code!==old.code)throw Error('Existing IDB record was not restored');
  if(rolled.find(record=>record.lessonId===unrelated.lessonId)?.code!==unrelated.code)throw Error('Unrelated IDB record changed');

  await restoreWorkshopRecords(indexedDB,owned,new Set([old.lessonId]));
  const later={...importedOld,code:'a later writer owns this value'};await restoreWorkshopRecords(indexedDB,[later],new Set([old.lessonId]));
  await rollbackWorkshopRecords(indexedDB,before,owned);
  const guarded=await readWorkshopRecords(indexedDB);
  if(guarded.find(record=>record.lessonId===old.lessonId)?.code!==later.code)throw Error('Rollback overwrote a later writer');
  await restoreWorkshopRecords(indexedDB,before,new Set(before.map(record=>record.lessonId)));

  const key='qa-coordinated-restore',original=' {"original":true} ';localStorage.setItem(key,original);
  let secondaryCommitted=false;
  const result=await MathStorage.restoreRaw({storage:localStorage,replacements:{[key]:'{"imported":true}'},expected:{[key]:original},applyOther:async()=>{await restoreWorkshopRecords(indexedDB,owned,new Set([old.lessonId]));secondaryCommitted=true;throw Error('QA failure after secondary transaction committed');},rollbackOther:async()=>{if(secondaryCommitted)await rollbackWorkshopRecords(indexedDB,before,owned);}});
  const after=await readWorkshopRecords(indexedDB);
  if(result.ok)throw Error('Failed coordinated import was reported successful');
  if(localStorage.getItem(key)!==original)throw Error('Native raw bytes were not restored exactly');
  if(after.some(record=>record.lessonId===inserted.lessonId)||after.find(record=>record.lessonId===old.lessonId)?.code!==old.code)throw Error('Coordinated rollback failed to undo IDB writes');
  return {newInsertRemoved:true,existingRestored:true,unrelatedPreserved:true,laterWriterPreserved:true,nativeBytesExact:true,failedCombinedImport:result.status};
 });
 assert.equal(evidence.newInsertRemoved,true);assert.equal(evidence.failedCombinedImport,'restore-failed');
 await mkdir('.tmp',{recursive:true});await writeFile('.tmp/math-system-idb-rollback.json',JSON.stringify({browser:browser.version(),isolation:'Disposable browser, synthetic records',evidence},null,2));
 console.log(JSON.stringify(evidence));
}finally{await context.close();await browser.close();}
