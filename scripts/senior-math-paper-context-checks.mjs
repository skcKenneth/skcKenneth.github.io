import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import katex from 'katex';
import {examPapers} from '../src/data/senior-math/papers.mjs';
import {paperSharedStems} from '../src/data/senior-math/paper-shared-stems.mjs';
import {contextualizePaper,paperContext,topLevelQuestion} from '../src/lib/senior-math-context.mjs';
const manifest=JSON.parse(readFileSync(new URL('../src/data/senior-math/paper-context-audit.json',import.meta.url),'utf8'));
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const publicPart=q=>({id:q.id,prompt:q.prompt,expression:q.expression,conditions:q.conditions,promptSvg:q.promptSvg,choices:q.choices});
const privateFields=['answer','steps','hints','result','explanation','solutionSvg'];
const reviewById=new Map(manifest.records.map(r=>[r.id,r]));
const seen=new Set(),stemIds=new Set();let explicitApplications=0,withEarlierParts=0,formulae=0,diagrams=0,localSources=0;
assert.equal(examPapers.length,12);assert.equal(manifest.records.length,287);assert.equal(reviewById.size,287);
function checkPublicTree(value){
 if(!value||typeof value!=='object')return;
 for(const [key,item]of Object.entries(value)){
  assert.ok(!privateFields.includes(key),'Private field in context: '+key);
  if(key==='expression'){katex.renderToString(item,{strict:'error',throwOnError:true});formulae++;}
  if(key==='promptSvg'){
   assert.match(item,/<svg\b/);assert.match(item,/<title>/);assert.match(item,/viewBox=/);
   assert.ok(!/<script|<foreignObject|\bon\w+\s*=|\b(?:href|src)\s*=\s*["']https?:/i.test(item),'Unsafe diagram');
   assert.ok(!/NaN|Infinity/.test(item));diagrams++;
  }
  if(item&&typeof item==='object')checkPublicTree(item);
 }
}
for(const [paperId,stems]of Object.entries(paperSharedStems)){
 const paper=examPapers.find(p=>p.id===paperId);assert.ok(paper,paperId);
 for(const s of stems){
  assert.ok(!stemIds.has(s.id));stemIds.add(s.id);
  assert.match(s.id,/^context-[a-z0-9-]+$/);assert.ok(s.prompt.en&&s.prompt.zh);
  assert.equal(s.source.paperId,paperId);assert.equal(s.source.url,paper.url);
  assert.ok(paper.inventory.questionPdfPages.includes(s.source.pdfPage));
  assert.ok(s.appliesTo.length);assert.equal(new Set(s.appliesTo).size,s.appliesTo.length);
  for(const label of s.appliesTo)assert.ok(paper.questions.some(q=>q.source.question===label),s.id+' unknown target '+label);
  assert.equal(hash(s),manifest.stems.find(x=>x.id===s.id)?.sha256,s.id+' changed after review');
 }
}
assert.equal(stemIds.size,19);assert.equal(manifest.stems.length,19);
for(const raw of examPapers){
 const paper=contextualizePaper(raw);
 assert.equal(paper.questions.length,raw.questions.length);
 for(const [i,q]of paper.questions.entries()){
  assert.ok(!seen.has(q.id));seen.add(q.id);
  const reviewed=reviewById.get(q.id);assert.ok(reviewed,q.id);
  assert.equal(reviewed.paperId,paper.id);assert.equal(reviewed.question,q.source.question);assert.equal(reviewed.pdfPage,q.source.pdfPage);
  assert.equal(reviewed.sourceSha256,paper.sha256);
  assert.equal(hash(publicPart(raw.questions[i])),reviewed.publicStatementSha256,q.id+' public statement changed');
  assert.equal(hash(q.answer),reviewed.answerSha256,q.id+' answer changed');
  const earlier=raw.questions.slice(0,i).filter(p=>topLevelQuestion(p.source.question)===topLevelQuestion(q.source.question));
  assert.deepEqual(q.sharedStem.dependsOnIds,reviewed.earlierIds);
  assert.deepEqual(earlier.map(x=>x.id),reviewed.earlierIds);
  assert.deepEqual(q.sharedStem.segments.map(s=>s.id),[...reviewed.explicitStemIds,...reviewed.earlierIds]);
  if(reviewed.explicitStemIds.length)explicitApplications++;
  if(earlier.length)withEarlierParts++;
  const explicit=(paperSharedStems[paper.id]||[]).filter(s=>s.appliesTo.includes(q.source.question));
  assert.deepEqual(explicit.map(s=>s.id),reviewed.explicitStemIds);
  checkPublicTree(q.sharedStem);
 }
 // Put throwing getters on every hidden solution field. Context construction
 // must never touch them, even though the full page retains solutions elsewhere.
 const guarded={...raw,questions:raw.questions.map(q=>{
  const copy={...q};for(const field of privateFields)Object.defineProperty(copy,field,{get(){throw Error('Context read '+field+' for '+q.id);},enumerable:true});return copy;
 })};
 for(const q of guarded.questions)paperContext(guarded,q);
 if(process.argv.includes('--local-sources')){
  const bytes=readFileSync(new URL('../.tmp/senior-math/papers/'+raw.id+'.pdf',import.meta.url));
  assert.equal(bytes.length,raw.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),raw.sha256,raw.id+' source PDF changed');localSources++;
 }
}
assert.equal(seen.size,287);assert.equal(explicitApplications,37);assert.equal(withEarlierParts,137);
// Proof targets belong to their own and later relevant leaves only.
const sum=paperSharedStems['jm02-2025'].find(s=>s.id.endsWith('4-c-sum-target'));
assert.deepEqual(sum.appliesTo,['4(c)','4(d)']);
const factor=paperSharedStems['jm02-2026'].find(s=>s.id.endsWith('4-b-factorization-target'));
assert.deepEqual(factor.appliesTo,['4(b)(i)','4(b)(ii)']);
const cube=paperSharedStems['jm02-2026'].find(s=>s.id.endsWith('1-cube'));
assert.deepEqual(cube.appliesTo,['1(a)','1(b)','1(c)']);
for(const vertex of ['A','B','C','D','E','F','G','H','M'])assert.ok(cube.promptSvg.includes('>'+vertex+'</text>'));
assert.ok(!cube.expression,'The cube context must not state computed coordinates for M');
console.log(JSON.stringify({papers:examPapers.length,reviewedLeaves:seen.size,explicitStems:stemIds.size,supplementedLeaves:explicitApplications,leavesWithEarlierParts:withEarlierParts,contextFormulae:formulae,contextDiagramApplications:diagrams,solutionAccessGuards:seen.size,localSources}));
