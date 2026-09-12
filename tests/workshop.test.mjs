import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {transform} from 'esbuild';
import {freshProgress,validateProgress,validateParams,parseImport,exportProgress,isRunStale,ProgressStore,pythonExport,notebookExport,reportExport,validateResult} from '../src/lib/workshop-state.mjs';
import {validateManifest} from '../scripts/sync-workshop.mjs';
const source=await readFile(new URL('../src/data/workshop-lessons.ts',import.meta.url),'utf8');
const transformed=await transform(source,{loader:'ts',format:'esm'});
const {lessons}=await import('data:text/javascript;base64,'+Buffer.from(transformed.code).toString('base64'));
const root=resolve('public/resources/modeling-workshop');
const lesson=lessons[0];
const baseline=JSON.parse(await readFile(resolve(root,lesson.slug,'baseline.json'),'utf8'));

test('All six lessons have bilingual task flows, checked sources and supported parameters',()=>{
 assert.equal(lessons.length,6);assert.equal(new Set(lessons.map(l=>l.slug)).size,6);
 for(const l of lessons){assert.equal(l.steps.length,8);assert.equal(new Set(l.steps.map(s=>s.id)).size,8);for(const s of l.steps){for(const locale of ['en','zh-Hant']){assert.ok(s.body[locale].length>40);assert.ok(s.task[locale].length>10);}}assert.equal(l.hints.length,3);assert.ok(l.references.every(r=>r.pdfPages&&r.printedPages));validateParams(freshProgress(l).params,l);}
});
test('Draft roundtrip preserves Unicode, code, zeros and answers without executing imports',()=>{
 const p=freshProgress(lesson,'raise RuntimeError("must not execute")');p.modelCard.question='濃度如何變化？';p.answers.observe='質量守恆';p.seed=0;p.completed=['observe'];
 assert.deepEqual(parseImport(exportProgress(p),lesson),p);
});
test('Wrong lessons, unsupported schemas, unsafe seeds and invalid parameter values are rejected',()=>{
 const p=freshProgress(lesson);
 for(const bad of [{...p,schemaVersion:2},{...p,lessonId:'other'},{...p,step:8},{...p,seed:-1},{...p,params:{...p.params,volume:0}},{...p,completed:['fake']}])assert.throws(()=>validateProgress(bad,lesson));
 assert.throws(()=>parseImport('x'.repeat(8*1024*1024+1),lesson));
});
test('Checks become stale after code, settings, seed or lesson version changes',()=>{
 const p=freshProgress(lesson,'student_model=tank_rhs');p.lastRun={code:p.code,params:{...p.params},seed:p.seed,result:baseline,at:'2026-09-12T00:00:00Z',stale:false};
 assert.equal(isRunStale(p,lesson),false);
 for(const changed of [{...p,code:p.code+'\n'},{...p,seed:7},{...p,params:{...p.params,flow:3}}])assert.equal(isRunStale(changed,lesson),true);
 assert.equal(isRunStale(p,{...lesson,version:'2.0.0'}),true);
 const old={...p,lessonVersion:'0.9.0'};assert.equal(validateProgress(old,lesson).lastRun.stale,true);
});
test('Storage denial retains an in-session draft and reports nonpersistent status',async()=>{
 const store=new ProgressStore({open(){throw new Error('Denied');}});assert.equal(await store.open(),false);const p=freshProgress(lesson);p.answers.ask='test';assert.equal(await store.put(p),false);assert.deepEqual(await store.get(lesson.id),p);
});
test('Exports embed the exact draft and retain provenance for stale outputs',()=>{
 const p=freshProgress(lesson,'result = run_lesson(LESSON, PARAMS, SEED)');p.prediction='Before: $x$';p.lastRun={code:'old code',params:p.params,seed:12,result:baseline,at:'2026-09-12T00:00:00Z',stale:false};
 const py=pythonExport('# core',p,lesson);assert.ok(py.includes(p.code));assert.ok(py.includes('json.loads('));
 const nb=notebookExport('# core',p,lesson,'zh-Hant');assert.equal(nb.nbformat,4);assert.ok(nb.cells.filter(c=>c.cell_type==='code').every(c=>c.outputs.length===0&&c.execution_count===null));
 const report=reportExport(p,lesson,'en');assert.match(report,/Stale result/);assert.match(report,/old code/);assert.match(report,/Before: \$x\$/);
});
test('Malformed result images and metric objects cannot enter result rendering',()=>{
 validateResult(baseline,lesson);assert.throws(()=>validateResult({...baseline,figures:[{en:'x',zh:'x',png:'<script>alert(1)</script>'}]},lesson));assert.throws(()=>validateResult({...baseline,metrics:{error:Infinity}},lesson));
});
test('Public release is complete and rejects traversal, duplicate and non-allowlisted assets',async()=>{
 const manifest=JSON.parse(await readFile(resolve(root,'manifest.json'),'utf8'));validateManifest(manifest);
 for(const file of ['../private.pdf','/private.pdf','mixing-tank/../../private','worker.mjs','mixing-tank/secret.pdf'])assert.throws(()=>validateManifest({...manifest,assets:[...manifest.assets,{...manifest.assets[0],file}]}));
 assert.throws(()=>validateManifest({...manifest,assets:[...manifest.assets,manifest.assets[0]]}));
 const map=JSON.parse(await readFile(resolve(root,'source-map.json'),'utf8'));assert.equal(map.books.length,20);assert.equal(map.notes.length,27);assert.equal(map.books.filter(b=>b.internalOnly).length,1);
});
test('Each published reference has executable code, real baseline checks and CSV provenance',async()=>{
 for(const l of lessons){const b=JSON.parse(await readFile(resolve(root,l.slug,'baseline.json'),'utf8'));validateResult(b,l);assert.ok(b.checks.every(c=>c.passed));assert.equal(b.seed,2026);assert.equal(b.data_type,'synthetic teaching experiment');const ex=JSON.parse(await readFile(resolve(root,l.slug,'exercise.json'),'utf8'));assert.ok(ex.starter.includes('student_model'));assert.ok(ex.reference.includes('result = run_lesson'));assert.notEqual(ex.starter,ex.reference);const nb=JSON.parse(await readFile(resolve(root,l.slug,'reference.ipynb'),'utf8'));assert.ok(nb.cells.some(c=>c.source.join('').includes('def run_lesson(')));}
});
