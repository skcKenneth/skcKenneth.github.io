/** Reproducible structure/rendering checks, complete numeric recalculation and bounded proof audit. */
import assert from 'node:assert/strict';
import katex from 'katex';
import {auditFoundationC1} from './foundation-c1-verification.mjs';
import {auditFoundationC2} from './foundation-c2-verification.mjs';
import {auditFoundationC1Proofs} from './foundation-c1-proof-verification.mjs';
import {auditFoundationC2Proofs} from './foundation-c2-proof-verification.mjs';
import {foundationLessons as lessons,foundationChapters as chapters,foundationReviews as reviews} from './foundations.mjs';
assert.equal(lessons.length,43);assert.equal(chapters.length,10);assert.equal(reviews.length,10);
assert.equal(lessons.filter(l=>l.bookId==='c1').length,24);assert.equal(lessons.filter(l=>l.bookId==='c2').length,19);
let formulaChecks=0,questionCount=0;
const ids=new Set(),signatures=new Set();
const bilingual=x=>assert.ok(typeof x?.en==='string'&&x.en.trim()&&typeof x?.zh==='string'&&x.zh.trim());
const walk=o=>{if(!o||typeof o!=='object')return;for(const [key,v]of Object.entries(o)){
 if(typeof v==='string'){assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v),'Control character');
  if(['expression','math','formula'].includes(key)){assert.ok(!v.includes('§'),'Undecoded authoring marker');katex.renderToString(v,{throwOnError:true,strict:'error'});formulaChecks++;}
 }else if(v&&typeof v==='object')walk(v);
}};
for(const unit of [...lessons,...reviews]){
 bilingual(unit.title);bilingual(unit.summary);
 assert.ok(unit.teacher.prompts.length&&unit.teacher.board.length&&unit.teacher.anticipated.length&&unit.teacher.rubric.length);
 const practice=unit.questions.filter(q=>q.kind!=='example'),worked=unit.questions.filter(q=>q.kind==='example');
 if(unit.id.startsWith('review-')){assert.equal(unit.questions.length,15);assert.deepEqual(['foundation','standard','transfer'].map(l=>practice.filter(q=>q.level===l).length),[6,6,3]);}
 else{assert.equal(unit.questions.length,13);assert.equal(worked.length,3);assert.deepEqual(['foundation','standard','transfer'].map(l=>worked.filter(q=>q.level===l).length),[1,1,1]);assert.deepEqual(['foundation','standard','transfer'].map(l=>practice.filter(q=>q.level===l).length),[4,4,2]);assert.equal(unit.source.pdfPage,unit.source.printedPage+7);assert.equal(unit.source.documentId,`textbook-${unit.bookId}`);for(const key of ['prediction','explanation','transfer'])bilingual(unit.inquiry[key]);}
 for(const q of unit.questions){questionCount++;assert.ok(!ids.has(q.id),q.id);ids.add(q.id);const sig=q.prompt.en+'|'+(q.expression||'');assert.ok(!signatures.has(sig),`Exact duplicate ${q.id}`);signatures.add(sig);bilingual(q.prompt);bilingual(q.result);bilingual(q.explanation);assert.equal(q.hints.length,2);q.hints.forEach(bilingual);assert.ok(q.steps.length>=2);q.steps.forEach(s=>bilingual(s.body));assert.ok(q.conditions.length);assert.ok(q.skills.every(s=>lessons.some(l=>l.id===s)));if(q.kind==='number')assert.ok(Number.isFinite(q.answer));if(q.kind==='written')assert.ok(q.rubric.length>=2);}
 walk(unit);
}
assert.equal(questionCount,709);

// Independent full coverage: every scalar answer, including examples and reviews.
const units=[...lessons,...reviews],numericReports=[auditFoundationC1(units),auditFoundationC2(units)];
const numerical=units.flatMap(u=>u.questions).filter(q=>typeof q.answer==='number');
const verifiedIds=numericReports.flatMap(r=>r.verifiedIds),verified=new Set(verifiedIds);
assert.equal(verified.size,verifiedIds.length,'A numerical question was counted twice');
const uncovered=numerical.filter(q=>!verified.has(q.id)).map(q=>q.id);
assert.deepEqual(uncovered,[],'Every foundational numerical answer needs an independent recalculation');
assert.equal(verified.size,numerical.length);
const proofReports=[auditFoundationC1Proofs(units),auditFoundationC2Proofs(units)];
const writtenIds=units.flatMap(u=>u.questions).filter(q=>typeof q.answer!=='number').map(q=>q.id);
const reviewedIds=new Set(proofReports.flatMap(r=>r.reviewedIds));
assert.deepEqual(writtenIds.filter(id=>!reviewedIds.has(id)),[],'Written answers missing from the reviewed snapshot');
assert.equal(reviewedIds.size,writtenIds.length);
// Adversarial validation of the validators: solution fields cannot be consulted,
// and corrupting each scalar answer in turn must cause a mismatch.
let rejectedMutations=0;
for(const unit of units){
 const audit=unit.bookId==='c1'?auditFoundationC1:auditFoundationC2;
 for(const q of unit.questions.filter(q=>typeof q.answer==='number')){
  const blind=answer=>{
   const item={id:q.id,kind:q.kind,prompt:q.prompt,expression:q.expression,answer};
   for(const field of ['steps','result','explanation','hints'])Object.defineProperty(item,field,{get(){throw Error(`Verifier read solution field ${field} for ${q.id}`);}});
   return item;
  };
  audit([{bookId:unit.bookId,questions:[blind(q.answer)]}]);
  assert.throws(()=>audit([{bookId:unit.bookId,questions:[blind(q.answer+1)]}]),/published .*independently derived/,`${q.id}: corrupted answer escaped recalculation`);
  rejectedMutations++;
 }
}
console.log(JSON.stringify({lessons:lessons.length,chapters:chapters.length,reviews:reviews.length,questions:questionCount,formulaChecks,
 numericChecks:verified.size,numericByBook:Object.fromEntries(['c1','c2'].map((id,i)=>[id,numericReports[i].verifiedIds.length])),
 numericMethods:numericReports.reduce((sum,r)=>sum+Object.keys(r.methods).length,0),uncovered,rejectedMutations,
 writtenReviewed:reviewedIds.size,writtenByBook:Object.fromEntries(['c1','c2'].map((id,i)=>[id,proofReports[i].reviewedIds.length]))}));
