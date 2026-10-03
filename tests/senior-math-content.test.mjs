import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {books,chapters,coreLessons,lessons,reviews,papers,questions,schoolRoutes,lessonById,questionById,sourceById,examCoverage,relatedLessonIds,examinationCodesForQuestion} from '../src/data/senior-math/catalog.mjs';
import {seniorPages} from '../src/lib/senior-math-pages.mjs';

// Independent source-page inventory: printed starts from the five supplied books' contents pages.
const expected={
 c1:[[2,7,10,17,26],[37,44,50],[60,76,89,93],[104,111,122,130,142],[168,177,188,196,215,231,242]],
 c2:[[2,7,25,38],[68,75,83],[97,107,114,124,133,146],[173,193,220],[228,249,254]],
 s1:[[2,11,16,26],[51,59,70,82,91],[105,118,130]],
 s2:[[2,12,27,44],[59,72,84]],
 s3:[[2,14,29],[44,56,62,72,83],[93,105,124]],
};
const chapterStart={c1:1,c2:6,s1:1,s2:4,s3:6};
test('Every supplied textbook section maps to its verified start page, without missing entries',()=>{
 assert.equal(books.length,5);assert.equal(chapters.length,18);assert.equal(coreLessons.length,73);
 for(const [bookId,groups] of Object.entries(expected)){
  const actual=coreLessons.filter(l=>l.bookId===bookId);assert.equal(actual.length,groups.flat().length,bookId);
  groups.forEach((pages,index)=>pages.forEach((printed,section)=>{
   const id=`${bookId}-${chapterStart[bookId]+index}-${section+1}`,item=lessonById.get(id);assert(item,id);
   assert.equal(item.source.documentId,`textbook-${bookId}`,id);assert.equal(item.source.printedPage,printed,id);
   assert.equal(item.source.pdfPage,printed+(bookId.startsWith('c')?7:5),id);
  }));
 }
});
test('Every lesson has three complete examples, ten graded tasks and teacher preparation; reviews contain fifteen mixed tasks',()=>{
 for(const lesson of lessons){
  assert.equal(lesson.questions.length,13,lesson.id);
  const examples=lesson.questions.filter(q=>q.kind==='example'),practice=lesson.questions.filter(q=>q.kind!=='example');
  assert.deepEqual(examples.map(q=>q.level),['foundation','standard','transfer'],lesson.id);
  assert.deepEqual(['foundation','standard','transfer'].map(l=>practice.filter(q=>q.level===l).length),[4,4,2],lesson.id);
  for(const key of ['objectives','concepts','misconceptions'])assert(lesson[key]?.length,`${lesson.id}:${key}`);
  for(const key of ['prompts','board','anticipated','rubric'])assert(lesson.teacher?.[key]?.length,`${lesson.id}:${key}`);
  for(const field of ['prediction','explanation','transfer'])assert(lesson.inquiry?.[field],`${lesson.id}:${field}`);
  for(const id of lesson.prerequisites||[])assert(lessonById.has(id),`${lesson.id}:missing prerequisite ${id}`);
  const source=sourceById.get(lesson.source.documentId);assert(source,`${lesson.id}:source`);assert(lesson.source.pdfPage>=1&&lesson.source.pdfPage<=source.pdfPages,lesson.id);
  const signatures=lesson.questions.map(q=>JSON.stringify([q.prompt,q.expression]));assert.equal(new Set(signatures).size,13,`${lesson.id}:duplicate exact task`);
 }
 assert.equal(reviews.length,18);
 for(const chapter of chapters){const review=lessonById.get(`review-${chapter.id}`);assert(review,chapter.id);assert.equal(review.questions.length,15);assert.deepEqual(['foundation','standard','transfer'].map(l=>review.questions.filter(q=>q.level===l).length),[6,6,3]);}
});
test('Bilingual text, mathematical rendering, IDs and links are valid throughout the complete corpus',()=>{
 const inspect=(value,path)=>{
  if(Array.isArray(value))return value.forEach((v,i)=>inspect(v,`${path}[${i}]`));
  if(!value||typeof value!=='object')return;
  if('en' in value||'zh' in value)for(const lang of ['en','zh']){assert(typeof value[lang]==='string'&&value[lang].trim(),`${path}:${lang}`);assert(!value[lang].includes('§'),`${path}:unconverted TeX sentinel`);}
  for(const [key,item]of Object.entries(value)){
   if(['formula','expression','math','resultMath'].includes(key)&&item){assert(!/[\u0000-\u001f§]/.test(item),`${path}.${key}:escaped control character`);assert.doesNotThrow(()=>katex.renderToString(item,{throwOnError:true,strict:'error',trust:false}),`${path}.${key}: ${item}`);}
   else inspect(item,`${path}.${key}`);
  }
 };
 inspect([...lessons,...reviews,...papers], 'corpus');
 assert.equal(questionById.size,questions.length,'duplicate question IDs');
 assert.equal(lessonById.size,lessons.length+reviews.length,'duplicate lesson IDs');
 for(const q of questions){assert.match(q.id,/^[a-z][a-z0-9-]{0,159}$/);assert.equal(q.hints.length,2,q.id);assert(q.steps.length>=2,q.id);assert(relatedLessonIds(q).length||q.legacy,`${q.id}:missing related lesson`);if(q.kind==='number')assert(Number.isFinite(q.answer),q.id);if(q.kind==='written')assert(q.rubric?.length,q.id);}
 const paths=seniorPages.map(page=>page.path||'');assert.equal(new Set(paths).size,paths.length,'duplicate route');
 for(const q of questions)assert(paths.includes(`questions/${q.id}`),q.id);
});
test('Six school routes and separate examination scopes resolve to actual content',()=>{
 assert.deepEqual(schoolRoutes.map(r=>r.id),['g1-arts','g1-science','g2-arts','g2-science','g3-arts','g3-science']);
 for(const route of schoolRoutes)for(const group of route.groups){assert(group.pdfPage>=1&&group.pdfPage<=route.pdfPages);if(group.role!=='school-practice')assert(group.lessonIds.length,route.id);for(const id of group.lessonIds)assert(lessonById.has(id),`${route.id}:${id}`);}
 assert.deepEqual(examCoverage.map(e=>e.areas.length),[16,9]);assert.deepEqual(examCoverage[1].inherits,['JM01']);
 for(const exam of examCoverage)for(const area of exam.areas)for(const id of area.lessonIds)assert(lessonById.has(id),`${exam.code}:${area.number}:${id}`);
 assert(lessonById.has('sup-matrices')&&schoolRoutes.find(r=>r.id==='g3-arts').groups.some(g=>g.lessonIds.includes('sup-matrices')));
 const matrixBank=lessonById.get('sup-matrices').questions;
 assert.deepEqual(examinationCodesForQuestion(matrixBank.find(q=>q.prompt.en==='Find det A.')),['JM02']);
 assert.deepEqual(examinationCodesForQuestion(matrixBank.find(q=>q.prompt.en==='Find x in the system.')),['JM01','JM02']);
 const exponentialDerivative=lessonById.get('s2-5-2').questions.find(q=>q.expression?.includes('e^{'));
 assert(exponentialDerivative);assert.deepEqual(examinationCodesForQuestion(exponentialDerivative),[],'Elementary transcendental derivatives are curriculum extensions, not the 2027 polynomial calculus minimum');
 assert.equal(papers.length,12);for(const year of [2021,2022,2023,2024,2025,2026])for(const code of ['JM01','JM02'])assert(papers.some(p=>p.year===year&&p.code===code));
});
