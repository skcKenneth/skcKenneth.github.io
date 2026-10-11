import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { collectReviewGraph, createReviewReport, normalizeReviewText, reviewFingerprint, normalizeReviewManifest,
  validateReviewGraph, contentReviewKey, translationReviewKey, dependencyFingerprints, validateReviewReceipt,
  recordReviewReceipt, appendReviewReceipt, writeReviewReports, runContentReviewCli, checkContentReview } from '../scripts/content-review.mjs';
import { CONTENT_REVIEW_REGISTRY, NOTE_REVIEW_DEPENDENCIES, editorialReviewNodes } from '../src/data/content-review-registry.mjs';
import { CLASSROOM_PACKS } from '../src/data/classroom-packs.mjs';

const root=resolve(import.meta.dirname,'..'), today='2026-10-11';
const registry=extra=>({version:1,nodes:[],notes:[],managed:[],milestones:[],receipts:[],...extra});
async function temporary(run) {
  const base=join(root,'.cache');await mkdir(base,{recursive:true});
  const directory=await mkdtemp(join(base,'content-review-test-'));
  try{return await run(directory);}finally{assert(resolve(directory).startsWith(resolve(base)+'\\content-review-test-')||resolve(directory).startsWith(resolve(base)+'/content-review-test-'));await rm(directory,{recursive:true,force:true});}
}
async function put(directory,path,value) {const full=join(directory,path);await mkdir(resolve(full,'..'),{recursive:true});await writeFile(full,value,'utf8');}
const source=(id='one',locale='en',body='Declared synthetic example.',domain='writing')=>`---\ntitle: ${locale==='en'?'One example':'一個例子'}\nslug: ${id}\n${locale==='en'?'':`sourceSlug: ${id}\n`}date: 2025-01-02\nlastUpdated: 2025-04-03\ndraft: false\n---\n${body}\n`;
async function pair(directory,id='one',domain='writing') {for(const locale of ['en','zh-Hant'])await put(directory,`src/content/${domain}${locale==='en'?'':'-zh'}/${id}.md`,source(id,locale));}
const node=(key,dependencies=[],value=key)=>({key,kind:'guide',id:key.split(':')[1],locale:'en',title:key,paths:['src/data/example.mjs'],fingerprint:reviewFingerprint(value),dependencies,pilot:true});
const graph=nodes=>({version:1,nodes,errors:validateReviewGraph(nodes),receipts:[]});
function receipt(graph,key,extra={}) {return {key,fingerprint:graph.nodes.find(node=>node.key===key).fingerprint,dependencies:dependencyFingerprints(graph,key),reviewedAt:today,
  reviewedBy:'Codex source audit',scope:'Public source and explicit dependency audit',conclusion:'consistent',reason:'Compared the stated synthetic example and limitations against the declared public source.',references:['src/content/writing/one.md'],...extra};}
async function tree(directory) {
  const entries={};async function walk(path=''){for(const item of await readdir(join(directory,path),{withFileTypes:true})){const next=path?`${path}/${item.name}`:item.name;if(item.isDirectory())await walk(next);else entries[next]=await readFile(join(directory,next),'utf8');}}
  await walk();return entries;
}

test('BOM and CRLF normalization is stable; substantive text and historical dates remain fingerprinted',()=>{
  const text=source();assert.equal(normalizeReviewText('\uFEFF'+text.replace(/\n/g,'\r\n')),text);
  assert.equal(reviewFingerprint(text),reviewFingerprint('\uFEFF'+text.replace(/\n/g,'\r\n')));
  assert.notEqual(reviewFingerprint(text),reviewFingerprint(text.replace('2025-04-03','2025-04-04')));
  assert.notEqual(reviewFingerprint(text),reviewFingerprint(text.replace('synthetic','field')));
});
test('Content identity separates domains and uses sourceSlug for translated display slugs',async()=>temporary(async directory=>{
  await pair(directory);await pair(directory,'one','projects');
  await put(directory,'src/content/writing-zh/one.md',source('one','zh-Hant').replace('slug: one','slug: translated-one'));
  const observed=await collectReviewGraph(directory,{registry:registry()});assert.deepEqual(observed.errors,[]);
  for(const domain of ['writing','projects'])for(const locale of ['en','zh-Hant'])assert(observed.nodes.some(node=>node.key===contentReviewKey(domain,'one',locale)));
  assert(observed.nodes.some(node=>node.key===translationReviewKey('writing','one','en','zh-Hant')));
  assert.throws(()=>contentReviewKey('writing','../one','en'),/identity/);
  assert.throws(()=>translationReviewKey('writing','one','en','en'),/different/);
}));
test('Initial snapshot is unreviewed and never manufactures legacy acceptance',async()=>temporary(async directory=>{
  await pair(directory);const observed=await collectReviewGraph(directory,{registry:registry()});
  const report=createReviewReport(observed,{today});assert.equal(report.summary.reviewed,0);assert.equal(report.summary.actionable,0);assert.equal(report.summary.unreviewedInformational,4);
  assert(report.observations.every(item=>item.status==='unreviewed'&&!item.review));
}));
test('Duplicate identities, missing edges and cycles are structural errors, not approvals',()=>{
  assert(validateReviewGraph([node('guide:one:en'),node('guide:one:en')]).some(error=>error.includes('Duplicate')));
  assert(validateReviewGraph([node('guide:one:en',['writing:absent:en'])]).some(error=>error.includes('Missing dependency')));
  const cyclic=graph([node('guide:one:en',['path:two:en']),node('path:two:en',['guide:one:en'])]);
  assert(cyclic.errors.some(error=>error.includes('cycle')));assert(createReviewReport(cyclic,{today}).errors.length>0);
});
test('Registry-declared notes require their actual source nodes and editions',async()=>temporary(async directory=>{
  await pair(directory,'note-one');
  const observed=await collectReviewGraph(directory,{registry:registry({notes:[{id:'note-one',sources:['missing-source']}]})});
  assert(observed.errors.some(error=>error.includes('writing:note-one:en -> writing:missing-source:en')));
  const absent=await collectReviewGraph(directory,{registry:registry({notes:[{id:'not-written',sources:['one']}]})});
  assert(absent.errors.some(error=>error.includes('Missing registered note')));
}));
test('Directional translation and transitive guide/path/concept/note reviews become stale when a source changes',async()=>temporary(async directory=>{
  await pair(directory);await pair(directory,'note-one');
  const registered=registry({notes:[{id:'note-one',sources:['one']}],nodes:[
    {...node('guide:one:en',['writing:one:en']),paths:[],value:{question:'What does this example establish?'}},
    {...node('path:one:en',['guide:one:en']),paths:[],value:{order:['one']}},
    {...node('concept:one:en',['writing:one:en']),paths:[],value:{scope:'Declared synthetic example only.'}}
  ]});
  const before=await collectReviewGraph(directory,{registry:registered});
  const targets=[translationReviewKey('writing','one','en','zh-Hant'),translationReviewKey('writing','one','zh-Hant','en'),'guide:one:en','path:one:en','concept:one:en','writing:note-one:en'];
  const receipts=targets.map(key=>receipt(before,key));assert(targets.every(key=>Object.keys(dependencyFingerprints(before,key)).includes('writing:one:en')));
  assert.equal(createReviewReport(before,{today,receipts}).summary.reviewed,targets.length);
  await put(directory,'src/content/writing/one.md',source('one','en','A changed source with the limitation preserved.'));
  const after=await collectReviewGraph(directory,{registry:registered}),report=createReviewReport(after,{today,receipts});
  for(const key of targets)assert.equal(report.observations.find(item=>item.key===key).status,'needs-update',key);
  assert.equal(report.observations.find(item=>item.key==='writing:one:zh-Hant').status,'unreviewed');
}));
test('Manifest source-root paths alone are ignored; versions, hashes, bytes, licences and review scope are retained',()=>{
  const manifest={version:'1',source:'C:\\private-a\\release',source_root:'C:\\private-a',provenance:{sourceRoot:'/tmp/private-a',description:'approved release'},assets:[{bytes:100,sha256:'a'.repeat(64)}],license:'Declared licence',scope:'Selected passages only',date:'2026-09-12'};
  const moved={...manifest,source:'/home/private-b/release',source_root:'D:\\private-b',provenance:{...manifest.provenance,sourceRoot:'/other/private-b'}};
  assert.equal(reviewFingerprint(normalizeReviewManifest(manifest)),reviewFingerprint(normalizeReviewManifest(moved)));
  for(const changed of [{...manifest,version:'2'},{...manifest,assets:[{bytes:101,sha256:'a'.repeat(64)}]},{...manifest,assets:[{bytes:100,sha256:'b'.repeat(64)}]},{...manifest,license:'Other licence'},{...manifest,scope:'Full-book review'},{...manifest,date:'2026-09-13'}])assert.notEqual(reviewFingerprint(normalizeReviewManifest(manifest)),reviewFingerprint(normalizeReviewManifest(changed)));
  assert.equal(normalizeReviewManifest({source_root:'not a machine path'}).source_root,'not a machine path');
  assert.equal(normalizeReviewManifest({source:'https://official.example/release'}).source,'https://official.example/release');
  assert.equal(normalizeReviewManifest({source:'relative/release'}).source,'relative/release');
  assert.equal(normalizeReviewManifest({source:'/resources/public-source.json'}).source,'/resources/public-source.json');
});
test('Managed manifest revisions propagate into the editorial teaching entrance and its translation receipt',async()=>temporary(async directory=>{
  await pair(directory,'lecture','teaching');const path='public/resources/example/manifest.json';await put(directory,path,JSON.stringify({version:1,bytes:100}));
  const registered=registry({managed:[{id:'lecture',paths:[path],teachingIds:['lecture']}]});
  const before=await collectReviewGraph(directory,{registry:registered}),key=translationReviewKey('teaching','lecture','en','zh-Hant'),review=receipt(before,key);
  await put(directory,path,JSON.stringify({version:2,bytes:100}));
  const after=await collectReviewGraph(directory,{registry:registered});assert.equal(createReviewReport(after,{today,receipts:[review]}).observations.find(item=>item.key===key).status,'needs-update');
}));
test('Explicit receipt recording rejects stale target or dependency hashes and incomplete audit fields',()=>{
  const observed=graph([node('writing:one:en'),node('guide:one:en',['writing:one:en'])]),valid=receipt(observed,'guide:one:en');
  assert.deepEqual(recordReviewReceipt(observed,valid,{today}),valid);
  assert.throws(()=>recordReviewReceipt(observed,{...valid,fingerprint:'a'.repeat(64)},{today}),/Stale/);
  assert.throws(()=>recordReviewReceipt(observed,{...valid,dependencies:{}},{today}),/Stale/);
  for(const invalid of [{...valid,reason:''},{...valid,scope:''},{...valid,reviewedAt:'2026-02-30'},{...valid,reviewedAt:'2027-01-01'},{...valid,conclusion:'approved'},{...valid,humanApproved:true},{...valid,references:['C:/private/file.pdf']},{...valid,dependencies:{'__proto__':'a'.repeat(64)}}])assert.throws(()=>recordReviewReceipt(observed,invalid,{today}));
  assert(validateReviewReceipt({...valid,references:['javascript:alert(1)']}).length>0);
});
test('A pending receipt and overdue programme milestone remain pending without inferring an outcome',async()=>temporary(async directory=>{
  await put(directory,'src/data/site-editorial.mjs','// Public milestone fixture.\n');
  const milestone={id:'ai4nature-2026',title:{en:'Programme listing','zh-Hant':'議程'},date:'2026-08-31',reviewAfter:'2026-09-01',status:'programme-listed',source:'https://www.ai4nature.tech/program.html'};
  const observed=await collectReviewGraph(directory,{registry:registry({milestones:[milestone]})}),key='milestone:ai4nature-2026:shared';
  const reviewed=receipt(observed,key,{conclusion:'pending',reason:'Programme listing is known; presentation and publication outcomes remain unconfirmed.'});
  const report=createReviewReport(observed,{today,receipts:[reviewed]});assert.equal(report.observations[0].status,'pending');assert.equal(report.observations[0].retainedStatus,'programme-listed');assert.equal(report.summary.actionable,1);
  assert.equal(milestone.status,'programme-listed');assert.match(report.actionable[0].reasons.join(' '),/does not establish/);
}));
test('Classroom pack fingerprints isolate each localized editorial value while sharing explicit source edges',()=>{
  const before=editorialReviewNodes(),pack=CLASSROOM_PACKS.find(item=>item.id==='sampling-bias'),title=pack.title['zh-Hant'];
  try {
    pack.title['zh-Hant']+='（局部覆核測試）';const after=editorialReviewNodes();
    const fingerprint=(nodes,key)=>reviewFingerprint(nodes.find(node=>node.key===key).value);
    assert.equal(fingerprint(before,'classroom-pack:sampling-bias:en'),fingerprint(after,'classroom-pack:sampling-bias:en'));
    assert.notEqual(fingerprint(before,'classroom-pack:sampling-bias:zh-Hant'),fingerprint(after,'classroom-pack:sampling-bias:zh-Hant'));
    assert.equal(fingerprint(before,'classroom-pack:mixing-tank:zh-Hant'),fingerprint(after,'classroom-pack:mixing-tank:zh-Hant'));
  }finally{pack.title['zh-Hant']=title;}
});
test('Read-only CLI creates no files; --out writes only reports and cannot target source or escape workspace',async()=>temporary(async directory=>{
  await pair(directory);const before=await tree(directory),printed=[];
  await runContentReviewCli(directory,[],{stdout:value=>printed.push(value),stderr:()=>{}});assert.deepEqual(await tree(directory),before);assert.match(printed[0],/Initial observations do not approve/);
  const {report}=await checkContentReview(directory,{registry:registry(),today});await writeReviewReports(directory,'design/review',report);
  const after=await tree(directory);assert.deepEqual(Object.keys(after).filter(key=>!Object.hasOwn(before,key)).sort(),['design/review/report.json','design/review/report.md']);
  for(const[key,value]of Object.entries(before))assert.equal(after[key],value);
  for(const out of ['src/reports','SRC/reports','public/reports','../escape','design/../src'])await assert.rejects(writeReviewReports(directory,out,report));
}));
test('Receipt persistence modifies only its explicit registry block, preserves content dates and is idempotent',async()=>temporary(async directory=>{
  await pair(directory);const path='src/data/content-review-registry.mjs';const original='// Leave this exact code untouched.\nexport const REVIEW_RECEIPTS = /* CONTENT_REVIEW_RECEIPTS_START */\n[]\n/* CONTENT_REVIEW_RECEIPTS_END */;\n';await put(directory,path,original);
  const observed=await collectReviewGraph(directory,{registry:registry()}),review=receipt(observed,'writing:one:en'),before=await tree(directory);
  assert.equal(await appendReviewReceipt(directory,observed,review,{today}),true);assert.equal(await appendReviewReceipt(directory,observed,review,{today}),false);
  const after=await tree(directory);for(const[key,value]of Object.entries(before))if(key!==path)assert.equal(after[key],value);
  assert((await readFile(join(directory,path),'utf8')).startsWith('// Leave this exact code untouched.\nexport const REVIEW_RECEIPTS = /* CONTENT_REVIEW_RECEIPTS_START */'));
  await put(directory,'src/content/writing/one.md',source('one','en','Changed after the audit snapshot.'));
  await assert.rejects(appendReviewReceipt(directory,observed,review,{today}),/Stale observed source/);
}));
test('Removed receipt targets and invalid receipt fields cannot disappear silently from publication checks',()=>{
  const observed=graph([node('guide:one:en')]),review=receipt(observed,'guide:one:en');
  const report=createReviewReport(graph([]),{today,receipts:[review]});assert(report.errors.some(error=>error.includes('target removed')));
  assert(createReviewReport(observed,{today,receipts:[{...review,extra:true}]}).errors.some(error=>error.includes('Unknown receipt fields')));
});
test('Current public registry has all explicit note/dependent/managed edges and retains AI4Nature source status',async()=>{
  const observed=await collectReviewGraph(root),report=createReviewReport(observed,{today});assert.deepEqual(observed.errors,[]);
  for(const note of NOTE_REVIEW_DEPENDENCIES)for(const locale of ['en','zh-Hant']) {
    const entry=observed.nodes.find(node=>node.key===contentReviewKey('writing',note.id,locale));assert(entry?.pilot);assert.deepEqual(entry.dependencies,note.sources.map(id=>contentReviewKey('writing',id,locale)).sort());
  }
  for(const kind of ['guide','path','concept','manifest','teaching-interface','classroom-pack','teaching-source'])assert(observed.nodes.some(node=>node.kind===kind));
  const sampling=observed.nodes.find(node=>node.key==='classroom-pack:sampling-bias:en');assert(sampling.dependencies.includes('teaching-source:math-studio-sampling:shared'));
  const mixing=observed.nodes.find(node=>node.key==='classroom-pack:mixing-tank:zh-Hant');assert(mixing.dependencies.includes('concept:validation:zh-Hant'));
  const event=report.observations.find(item=>item.key==='milestone:ai4nature-2026:shared');assert.equal(event.retainedStatus,'programme-listed');assert.equal(event.status,'pending');
  assert.equal(CONTENT_REVIEW_REGISTRY.version,1);
});
