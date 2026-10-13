import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {skills,skillFamilies,skillById,lessons,papers,questions,questionById,lessonById,sourceById,examinationCodesForQuestion} from '../src/data/senior-math/catalog.mjs';
import {topLevelQuestion} from '../src/lib/senior-math-context.mjs';
import {seniorPages} from '../src/lib/senior-math-pages.mjs';
import {bankIndex} from '../src/lib/senior-math-bank-index.mjs';
test('24 independent skills keep 312 unique lesson slots and 48 targeted diagnostics, without replacing legacy entries',()=>{
 assert.equal(skills.length,24);assert.equal(skillFamilies.length,6);assert(skillFamilies.every(f=>f.skills.length===4&&f.diagnostics.length===8));
 assert.equal(skills.flatMap(s=>s.questions).length,312);assert.equal(skills.flatMap(s=>s.diagnostics).length,48);assert.equal(questions.length,2074);assert.equal(lessons.length,87);
 for(const s of skills){assert.equal(s.questions.length,13,s.id);assert.equal(s.diagnostics.length,2,s.id);assert.deepEqual(s.questions.slice(0,3).map(q=>q.level),['foundation','standard','transfer']);assert.deepEqual(['foundation','standard','transfer'].map(level=>s.questions.slice(3).filter(q=>q.level===level).length),[4,4,2]);assert(new Set(s.questions.slice(3).map(q=>q.taskType)).size>=6,s.id);
  for(const parent of s.parentLessonIds)assert(lessonById.has(parent),parent);for(const prerequisite of s.prerequisites)assert(skillById.has(prerequisite)||lessonById.has(prerequisite),prerequisite);
  assert.deepEqual(s.teacher.timing.map(r=>r.minutes),[5,8,10,12,5]);for(const field of ['prompts','board','anticipated','followups','remediation','exit','rubric'])assert(s.teacher[field]?.length,s.id+':'+field);
  for(const c of s.concepts)for(const field of ['motivation','derivation','conditions','counterexample','representations'])assert(c[field]&&(Array.isArray(c[field])?c[field].length:true),s.id+':'+field);
  const source=sourceById.get(s.source.documentId);assert(source,s.id);assert(s.source.pdfPage>0&&s.source.pdfPage<=source.pdfPages,s.id);
  for(const q of [...s.questions,...s.diagnostics]){assert.equal(q.difficultyReview,'reviewed');assert.deepEqual(q.primarySkillIds,[s.id]);assert(Array.isArray(q.examScopes));assert(questionById.has(q.id));assert.equal(q.hints.length,2);}
  for(const q of s.diagnostics){assert.equal(q.kind,'choice');for(const choice of q.choices.filter(c=>c.id!==q.answer)){const explanation=choice.misconception||q.distractorMisconceptions?.[choice.id];assert(explanation?.en&&explanation?.zh,`${q.id}: ${choice.id} needs a specific bilingual misconception`);}}
 }
 assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
});
test('Rich bilingual concepts, tasks and teacher samples strictly render all decoded TeX',()=>{
 let fields=0;const inspect=(value,path)=>{
  if(Array.isArray(value))return value.forEach((v,i)=>inspect(v,path+'.'+i));if(!value||typeof value!=='object')return;
  if('en'in value||'zh'in value)for(const language of ['en','zh'])assert(typeof value[language]==='string'&&value[language].trim(),path+':'+language);
  for(const [key,v]of Object.entries(value))if(['expression','formula','math','resultMath'].includes(key)&&v){assert(!/[\u0000-\u001f§]/.test(v),path+':'+key);katex.renderToString(v,{throwOnError:true,strict:'error',trust:false});fields++;}else inspect(v,path+'.'+key);
 };inspect(skills,'skills');assert(fields>1000,`Only ${fields} math fields checked`);
});
test('All official leaves carry earlier same-question statements and conditions, without copied answers or future subparts',()=>{
 let dependent=0;for(const paper of papers)for(const [i,q]of paper.questions.entries()){
  const expected=paper.questions.slice(0,i).filter(p=>topLevelQuestion(p.source.question)===topLevelQuestion(q.source.question));
  assert.deepEqual(q.sharedStem.dependsOnIds,expected.map(p=>p.id));assert.equal(q.difficultyReview,'ungraded');
  const prior=q.sharedStem.segments.filter(segment=>expected.some(p=>p.id===segment.id));assert.equal(prior.length,expected.length);
  prior.forEach((segment,j)=>{assert.equal(segment.prompt,expected[j].prompt);assert.equal(segment.expression,expected[j].expression);assert.deepEqual(segment.conditions,expected[j].conditions?.length?expected[j].conditions:undefined);});
  for(const segment of q.sharedStem.segments)for(const field of ['answer','steps','result','resultMath','solutionSvg','rubric','hints'])assert(!(field in segment),q.id+': leaked '+field);
  if(expected.length)dependent++;
 }assert(dependent>100);
 const seq=questionById.get('paper-jm01-2026-ii-3b')||papers[0].questions.find(q=>q.source.question==='II.3(b)');assert(seq.sharedStem.segments.length);
});
test('Reviewed scope repairs exclude revolving volumes and correct calculus prerequisites; all older difficulty labels remain provisional',()=>{
 for(const id of ['sup-integrals-example-3','sup-integrals-number-11','sup-integrals-number-13'])assert.deepEqual(examinationCodesForQuestion(questionById.get(id)),[]);
 for(const q of questions.filter(q=>q.source?.type!=='official'&&!q.id.startsWith('skill-')&&!q.id.startsWith('diagnostic-')))assert.equal(q.difficultyReview,'provisional',q.id);
 for(const q of questions)assert(Array.isArray(q.examScopes),q.id);
 for(const l of lessons)assert(['native-model','matched-skill-model','targeted-reading'].includes(l.inquiryAudit.status));
 assert(lessons.filter(l=>l.inquiry.type==='reading').every(l=>l.inquiry.readingTasks.length===2));
});
test('Static bank metadata and every new bilingual route have stable navigation without an answer dump',()=>{
 const routes=new Set(seniorPages.map(p=>p.path));for(const s of skills)assert(routes.has('skills/'+s.id));for(const f of skillFamilies)assert(routes.has('diagnostics/'+f.id));assert(routes.has('classroom')&&routes.has('my-learning'));
 for(const locale of ['en','zh-Hant']){const index=bankIndex(locale);assert.equal(index.length,questions.length);for(const item of index){assert(item.search&&item.url&&item.prompt);assert(!('answer'in item)&&!('steps'in item));}assert(index.some(q=>q.nextUrl?.includes('/skills/')));}
 assert.equal(seniorPages.filter(p=>p.type==='bank').length,Math.ceil(questions.length/50));
});
