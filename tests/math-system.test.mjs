import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
import {createMathCatalog} from '../src/lib/math-system-catalog.mjs';
import {NATIVE_KEYS,SYSTEM_KEY,readNativeRecords,readNativeRecoveryBytes,collectDraftVariants,recordSummary,createSystemBackup,parseSystemBackup,mergeNativeBackup,previewSystemBackup} from '../src/lib/math-system-records.mjs';
test('Learning summaries keep checks, current written self-assessments, history and exposure distinct',()=>{
 const native={'jae-math-v1':JSON.stringify({version:1,answers:{checked:{lastResult:'correct'},draft:{input:'unfinished'}}}),'senior-math-study-v2':JSON.stringify({version:2,history:{checked:[{eventId:'one'},{eventId:'two'}]},selfAssessments:{current:{pending:false},revised:{pending:true}}}),'math-studio-practice-v2':JSON.stringify({variant:20261013})};
 const summary=recordSummary(native);assert.equal(summary.answers,2);assert.equal(summary.checked,1);assert.equal(summary.writtenSelfAssessments,1);assert.equal(summary.histories,2);assert.equal(summary.exposures,1);assert.equal(summary.sharedNotes,0);
});
import {freshProgress,mergeWorkshopDraft,validateProgress} from '../src/lib/workshop-state.mjs';
const transformed=await transform(await readFile(new URL('../src/data/workshop-lessons.ts',import.meta.url),'utf8'),{loader:'ts',format:'esm'});
const {lessons}=await import('data:text/javascript;base64,'+Buffer.from(transformed.code).toString('base64'));
const copy=value=>structuredClone(value);
test('Unified catalog contains working activity adapters for every original collection',()=>{
 const catalog=createMathCatalog(lessons);assert.equal(new Set(catalog.map(a=>a.id)).size,catalog.length);
 for(const item of catalog){for(const locale of ['en','zh-Hant']){assert.ok(item.title[locale]);assert.match(item.sources[locale],/^\//);}assert.ok(item.runtime);}
 for(const [group,count]of [['school',38],['inquiry',110],['model',14],['workshop',6]])assert.equal(catalog.filter(a=>a.group===group).length,count);
 assert.equal(catalog.filter(a=>a.group==='inquiry'&&!a.id.startsWith('school:inquiry:g10-')).length,25,'all original inquiries remain alongside the 85 new subsection entries');
 assert.ok(catalog.find(a=>a.id==='school:inquiry:angle-bisector').sources.en.includes('lab=bisector-property'));
 assert.ok(catalog.filter(a=>a.runtime==='lab').every(a=>a.sources.en.startsWith('/math-labs/inquiry/')));
 assert.ok(catalog.some(a=>a.id==='resource:competition'));
 const packs=createMathCatalog(lessons,[{id:'sampling-bias',minutes:45,title:{en:'Sampling', 'zh-Hant':'抽樣'},summary:{en:'Compare frames','zh-Hant':'比較抽樣框'}},{id:'mixing-tank',minutes:50,title:{en:'Mixing', 'zh-Hant':'混合'},summary:{en:'Verify','zh-Hant':'核證'}}]);assert.equal(packs.filter(a=>a.group==='classroom').length,4);assert.equal(packs.find(a=>a.id==='classroom:mixing-tank:teacher').sources['zh-Hant'],'/zh/teaching/classroom-packs/mixing-tank/teacher/');
});
test('Complete backup keeps exact native bytes, unknown IDs, opt-in state and workshop code',()=>{
 const bytes=' {"version":1,"answers":{"future-id":{"notes":"舊紀錄"}},"last":{"mode":"study","topic":"quadratics","question":"future-id"}} ';
 const lab=JSON.stringify({schema:1,lab:'quadratic',consent:true,answers:{prediction:'先想'},records:[]});
 const native={'jae-math-v1':bytes,'math-inquiry-lab:v1:quadratic':lab},workshop=[freshProgress(lessons[0],'raise RuntimeError("never execute imports")')];
 const parsed=parseSystemBackup(JSON.stringify(createSystemBackup(native,workshop)));
 assert.equal(parsed.localStorage['jae-math-v1'],bytes);assert.equal(parsed.localStorage['math-inquiry-lab:v1:quadratic'],lab);assert.deepEqual(parsed.indexedDB.records,workshop);
});
test('Legacy v1/v2 JAE, laboratory and workshop exports adapt without automatic lab consent',()=>{
 const v1=parseSystemBackup(JSON.stringify({version:1,answers:{'unknown-future':{notes:'保持'}},last:{mode:'study',topic:'quadratics',question:'unknown-future'}}));assert.equal(v1.legacyFormat,'senior-jae');assert.ok(JSON.parse(v1.localStorage['jae-math-v1']).answers['unknown-future']);
 const lab=parseSystemBackup(JSON.stringify({schema:1,lab:'regression',version:'0.1.0',answers:{prediction:'x'},records:[]}));assert.deepEqual(lab.requiresConsent,['math-inquiry-lab:v1:regression']);assert.equal(JSON.parse(lab.localStorage[lab.requiresConsent[0]]).consent,false);
 const simultaneous=Array.from({length:9},(_,i)=>({eventId:'concurrent-'+i,level:'核心',summary:'record '+i,detail:'retained'}));const crowded=parseSystemBackup(JSON.stringify({schema:1,lab:'regression',answers:{prediction:''},records:simultaneous}));assert.deepEqual(JSON.parse(crowded.localStorage['math-inquiry-lab:v1:regression']).records,simultaneous);
 const workshop=parseSystemBackup(JSON.stringify(freshProgress(lessons[1])));assert.equal(workshop.legacyFormat,'workshop');assert.equal(workshop.indexedDB.records.length,1);
});
test('Corrupt raw native stores are exported and recoverable without blocking valid stores',()=>{
 const values=new Map([['jae-math-v1','{bad'],['math-studio-practice-v2','{"old-variant":123}']]);const read=readNativeRecords({getItem:key=>values.get(key)??null});assert.equal(read.issues.length,1);assert.equal(read.records['jae-math-v1'],'{bad');
 const parsed=parseSystemBackup(JSON.stringify(createSystemBackup(read.records)));assert.deepEqual(parsed.corruptStores,['jae-math-v1']);assert.equal(parsed.localStorage['jae-math-v1'],'{bad');assert.equal(recordSummary(read.records).exposures,1);
 const malformed='{"version":1,"activities":{},"classroom":null}';const syntactic=readNativeRecords({getItem:key=>key===SYSTEM_KEY?malformed:null});assert.deepEqual(syntactic.issues,[{key:SYSTEM_KEY,issue:'corrupt'}]);assert.equal(syntactic.records[SYSTEM_KEY],malformed);
});
test('Native restore merges novel IDs and keeps local conflicts by default',()=>{
 const current=JSON.stringify({version:1,answers:{same:{notes:'local'},old:{notes:'old'}},last:{mode:'study',topic:'x',question:'old'}}),incoming=JSON.stringify({version:1,answers:{same:{notes:'incoming'},new:{notes:'new'}},last:{mode:'study',topic:'y',question:'new'}});
 const merged=JSON.parse(mergeNativeBackup('jae-math-v1',current,incoming));assert.equal(merged.answers.same.notes,'local');assert.equal(merged.answers.new.notes,'new');assert.equal(merged.answers.old.notes,'old');assert.equal(merged.last.question,'old');
 assert.deepEqual(previewSystemBackup({'jae-math-v1':current},createSystemBackup({'jae-math-v1':incoming})),[{key:'jae-math-v1',state:'conflict'}]);
 assert.equal(JSON.parse(mergeNativeBackup('math-studio-practice-v2','{"x":200}','{"x":100,"y":50}')).x,200);
});
test('Pending and conflicting draft alternatives restore explicitly while preserving local-only unknown IDs',()=>{
 const key='jae-math-v1',saved={version:1,answers:{same:{notes:'saved'},'future-saved-id':{notes:'unknown saved'}},last:{}},local={...copy(saved),answers:{...saved.answers,same:{notes:'pending draft'},'future-draft-id':{notes:'unknown pending'}}};
 const envelope={...createSystemBackup({[key]:JSON.stringify(saved)}),openPageDrafts:[{namespace:'jae-math',snapshot:{[key]:local},state:{status:'conflict',pending:1,conflicts:[{key,path:['answers','same'],remote:{notes:'other tab'}}]}}]};
 const parsed=parseSystemBackup(JSON.stringify(envelope));assert.equal(parsed.localStorage[key],JSON.stringify(saved));assert.equal(parsed.draftVariants.length,2);const chosen=parsed.draftVariants.find(v=>JSON.parse(v.raw).answers.same.notes==='pending draft');
 const existing={...copy(saved),answers:{...saved.answers,'future-local-id':{notes:'local only'}}};const restored=JSON.parse(mergeNativeBackup(key,JSON.stringify(existing),chosen.raw,true));assert.equal(restored.answers.same.notes,'pending draft');for(const id of ['future-saved-id','future-draft-id','future-local-id'])assert.ok(restored.answers[id]);
 assert.throws(()=>parseSystemBackup(JSON.stringify({...envelope,draftVariants:[{type:'localStorage',key:'unrelated-secret',raw:'{}'}]})));
 const lab={schema:1,lab:'quadratic',consent:false,answers:{prediction:'session only'},records:[]};const notes=collectDraftVariants({...createSystemBackup({}),openActivities:[{id:'lab:quadratic',labDraft:lab}]});assert.equal(notes[0].requiresConsent,true);assert.equal(JSON.parse(notes[0].raw).consent,false);
});
test('Historical recovery bytes are retained without replaying partial snapshots or another app',()=>{
 const prefix='math-learning-sync-v1:recovery:',math=prefix+'math-studio-g8:old',other=prefix+'other-app:old',bytes=' {"namespace":"math-studio-g8","committed":true,"snapshot":{"math-studio-inquiry-g8-v1":{"old":{"prediction":"keep"}}}} ',map=new Map([[math,bytes],[other,'{"secret":"omit"}']]),storage={length:2,key:i=>[...map.keys()][i],getItem:key=>map.get(key)};
 const raw=readNativeRecoveryBytes(storage);assert.deepEqual(raw,{[math]:bytes});const parsed=parseSystemBackup(JSON.stringify({...createSystemBackup({}),nativeRecoveryBytes:raw}));assert.equal(parsed.nativeRecoveryBytes[math],bytes);assert.deepEqual(parsed.draftVariants,[]);
});
test('Closed-tab field drafts overlay canonical records without replaying counters or partial defaults',()=>{
 const key='jae-math-v1',learning='senior-math-study-v2',saved={version:1,answers:{'future-question':{input:'5',notes:'saved',attempts:2},'local-unknown':{notes:'keep'}},last:{question:'future-question'}},study={version:2,history:{'future-question':[{eventId:'old-event',notes:'keep history'}]},classroom:{title:'Keep lesson',ids:['future-classroom-id']}};
 const recovery={version:1,namespace:'jae-math',committed:false,snapshot:{[key]:{version:1,answers:{},last:{}},[learning]:{version:2,classroom:{title:'',ids:[]}}},pending:[{key,path:['answers','future-question','notes'],kind:'set',value:'closed draft'},{key,path:['answers','future-question','attempts'],kind:'increment',value:99}]};
 const envelope={...createSystemBackup({[key]:JSON.stringify(saved),[learning]:JSON.stringify(study)}),nativeRecoveryBytes:{'math-learning-sync-v1:recovery:jae-math:closed':JSON.stringify(recovery)}};const variants=collectDraftVariants(envelope);assert.equal(variants.length,1);const draft=JSON.parse(variants[0].raw);assert.equal(draft.answers['future-question'].notes,'closed draft');assert.equal(draft.answers['future-question'].attempts,2);assert.equal(draft.answers['future-question'].input,'5');assert.equal(draft.answers['local-unknown'].notes,'keep');assert.equal(envelope.localStorage[learning],JSON.stringify(study));
 const counterOnly={...recovery,pending:[recovery.pending[1]]};assert.deepEqual(collectDraftVariants({...envelope,nativeRecoveryBytes:{'math-learning-sync-v1:recovery:jae-math:closed':JSON.stringify(counterOnly)}}),[]);
 const workshop=freshProgress(lessons[0]);workshop.prediction='closed workshop';const workshopEnvelope={...createSystemBackup({}),nativeRecoveryBytes:{'math-learning-sync-v1:recovery:math-workshop:closed':JSON.stringify({version:1,namespace:'math-workshop',committed:false,workshopDraft:workshop})}};assert.equal(collectDraftVariants(workshopEnvelope)[0].record.prediction,'closed workshop');
});
test('Backup parser excludes unrelated storage, malformed containers and oversized files',()=>{
 assert.throws(()=>parseSystemBackup(JSON.stringify({...createSystemBackup({}),localStorage:{'unrelated-key':'{}'}})));
 assert.throws(()=>parseSystemBackup(JSON.stringify({...createSystemBackup({}),indexedDB:{name:'other',store:'progress',records:[]}})));
 assert.throws(()=>parseSystemBackup('x'.repeat(16*1024*1024+1)));
 assert.ok(NATIVE_KEYS.includes(SYSTEM_KEY));
 const pending={...createSystemBackup({}),sessionNotes:{version:1,activities:{'model:identifiability':{consent:false,prediction:'Unpersisted private draft'}}}};const parsed=parseSystemBackup(JSON.stringify(pending));assert.equal(parsed.sessionNotes.activities['model:identifiability'].prediction,'Unpersisted private draft');assert.equal(parsed.sessionNotes.activities['model:identifiability'].consent,false);assert.deepEqual(parsed.localStorage,{});
 assert.throws(()=>parseSystemBackup(JSON.stringify({...pending,sessionNotes:{version:1,activities:{x:{prediction:{unexpected:'object'}}}}})));
});
test('Workshop field merge keeps two-tab first-record notes and a complete valid schema',()=>{
 const base=freshProgress(lessons[0],'starter'),a=copy(base),b=copy(base);a.answers.ask='第一分頁問題';b.modelCard.boundary='第二分頁邊界';const first=mergeWorkshopDraft(base,a,undefined).document,second=mergeWorkshopDraft(base,b,first);
 assert.equal(second.conflicts.length,0);assert.equal(second.document.answers.ask,a.answers.ask);assert.equal(second.document.modelCard.boundary,b.modelCard.boundary);validateProgress(second.document,lessons[0]);
});
test('Workshop same-field and immutable run conflicts retain both variants',()=>{
 const base=freshProgress(lessons[0]),remote=copy(base),local=copy(base);remote.prediction='remote';local.prediction='local';local.reflection='independent edit';const merged=mergeWorkshopDraft(base,local,remote);
 assert.equal(merged.document.prediction,'remote');assert.equal(merged.localView.prediction,'local');assert.equal(merged.document.reflection,'independent edit');assert.equal(merged.conflicts.length,1);
 const runA={at:'A',code:'code A',result:{metrics:{x:1}}},runB={at:'B',code:'code B',result:{metrics:{x:2}}};const runs=mergeWorkshopDraft(base,{...base,lastRun:runB},{...base,lastRun:runA});assert.deepEqual(runs.document.lastRun,runA);assert.deepEqual(runs.localView.lastRun,runB);assert.deepEqual(runs.conflicts[0].path,['lastRun']);
});
test('Workshop independent completion toggles merge and later retractions survive',()=>{
 const base=freshProgress(lessons[0]),a={...copy(base),completed:['observe']},b={...copy(base),completed:['ask']};assert.deepEqual(new Set(mergeWorkshopDraft(base,b,a).document.completed),new Set(['observe','ask']));
 const remove=mergeWorkshopDraft(a,{...a,completed:[]},{...a,completed:['observe','ask']});assert.deepEqual(remove.document.completed,['ask']);
});
