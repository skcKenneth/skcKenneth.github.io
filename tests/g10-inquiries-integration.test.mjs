import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {inquiries,chapters,coverageRows,evaluateInquiry,inquiryUrl,inquiryNoteId,createInquirySearchCatalog,studentCases} from '../src/data/g10-inquiries.mjs';
import {createMathCatalog} from '../src/lib/math-system-catalog.mjs';
import {requiredInquiryTargets} from '../src/data/g10-inquiry-coverage.mjs';
import {createSystemBackup,parseSystemBackup,SYSTEM_KEY} from '../src/lib/math-system-records.mjs';
const built=process.argv.includes('--built');

test('all 85 prescribed subsection identities are covered, not just chapter counts',()=>{
 assert.equal(inquiries.length,85);assert.equal(chapters.length,14);
 assert.equal(new Set(inquiries.map(a=>a.id)).size,85);
 assert.deepEqual(inquiries.map(a=>a.id),requiredInquiryTargets.map(a=>a.id));
 for(const row of coverageRows())assert.deepEqual(row.activities.map(a=>a.id),row.requiredIds);
 assert.deepEqual(chapters.map(c=>c.count),[4,4,4,4,15,9,12,6,5,6,4,3,4,5]);
});
test('complete bilingual teaching, independent exit answers and executable comparison cases',()=>{
 for(const activity of inquiries){
  for(const key of ['title','question','prediction','prerequisites','explanation','conditions','misconception','challenge','proof','teacherPrompt'])for(const locale of ['en','zh-Hant'])assert.ok(typeof activity[key]?.[locale]==='string'&&activity[key][locale].trim(),`${activity.id} ${key} ${locale}`);
  for(const key of ['prompt','answer'])for(const locale of ['en','zh-Hant'])assert.ok(activity.exit?.[key]?.[locale]?.trim(),`${activity.id} exit ${key} ${locale}`);
  assert.ok(activity.cases.length>=3,activity.id);assert.ok(activity.cases.some(c=>c.boundary),`${activity.id} boundary witness`);assert.ok(activity.controls.length,`${activity.id} controls`);
  for(const locale of ['en','zh-Hant']){
   const observations=[];
   for(const sample of activity.cases){
    assert.ok(sample.label[locale]);const result=evaluateInquiry(activity.id,sample.params,locale);
    assert.equal(typeof result.valid,'boolean',activity.id);assert.ok(result.summary?.trim(),activity.id);assert.ok(result.columns?.length&&result.rows?.length,`${activity.id} accessible quantities`);
    assert.match(result.svg,/<svg\b/);assert.match(result.svg,/viewBox=/);assert.match(result.svg,/<(?:path|line|circle|ellipse|rect|polygon|polyline)\b/);
    assert.doesNotMatch(result.svg,/(?:cx|cy|x|y|d|points)="[^"]*(?:NaN|Infinity)/,`${activity.id} finite SVG`);
    assert.doesNotMatch(result.svg,/<script|onload=|javascript:/i);
    observations.push(JSON.stringify([result.rows,result.summary]));
   }
   assert.ok(new Set(observations).size>=2,`${activity.id} meaningful contrast`);
  }
 }
});
test('unified catalog, search, legacy links and fourteen function notebook aliases',()=>{
 const catalog=createMathCatalog(),newItems=catalog.filter(a=>/^school:inquiry:g10-/.test(a.id));assert.equal(newItems.length,85);
 for(const item of newItems){assert.equal(item.group,'inquiry');assert.deepEqual(item.grades,['g10']);assert.match(item.sources.en,/\/inquiries\/g10-/);}
 for(const old of ['sets','quadratic','exponential','trig'])assert.ok(catalog.some(a=>a.id===`school:inquiry:${old}`));
 for(const activity of inquiries.filter(a=>a.chapter==='05'&&a.nativeId))assert.equal(inquiryNoteId(activity),`senior:function-worksheet:${activity.nativeId}`);
 assert.equal(inquiries.filter(a=>a.chapter==='05'&&a.nativeId).length,14);
 for(const locale of ['en','zh-Hant']){const search=createInquirySearchCatalog(locale);assert.equal(search.length,86);assert.equal(new Set(search.map(a=>a.url)).size,86);assert.ok(search.every(a=>a.title&&a.excerpt&&a.alternateUrl));}
 const notebook={version:1,activities:{[inquiryNoteId(inquiries[0])]:{consent:true,prediction:'synthetic prediction',observation:'two cases'}},classroom:{title:'QA',ids:[newItems[0].id]}};
 const backup=parseSystemBackup(JSON.stringify(createSystemBackup({[SYSTEM_KEY]:JSON.stringify(notebook)})));
 assert.deepEqual(JSON.parse(backup.localStorage[SYSTEM_KEY]),notebook);
});
test('short student sheets retain a normal contrast and boundary, including all SSA solution counts',()=>{
 for(const a of inquiries){const selected=studentCases(a);assert.ok(selected.length<=3);assert.ok(selected.some(c=>c.boundary),a.id);if(a.cases.some(c=>!c.boundary))assert.ok(selected.some(c=>!c.boundary),a.id);}
 const ssa=inquiries.find(a=>a.id==='g10-09-03');assert.deepEqual(studentCases(ssa).map(c=>c.params.a),[4,5,6]);
});
test('student print markup has no teacher explanations or answers',()=>{
 const component=readFileSync(new URL('../src/components/G10InquiryPrint.astro',import.meta.url),'utf8');
 assert.match(component,/teacher\?/);assert.match(component,/data-g10-paper-answer/);assert.match(component,/Math\.ceil\(activities\.length\/2\)/);
 if(existsSync(new URL('../dist/teaching/senior-math/inquiries/index.html',import.meta.url)))for(const locale of ['en','zh-Hant'])for(const chapter of chapters){
  const prefix=locale==='en'?'../dist/teaching/':'../dist/zh/teaching/';
  const student=readFileSync(new URL(`${prefix}senior-math/inquiries/print/${chapter.id}/index.html`,import.meta.url),'utf8');
  const teacher=readFileSync(new URL(`${prefix}senior-math/inquiries/print/${chapter.id}/teacher/index.html`,import.meta.url),'utf8');
  assert.doesNotMatch(student,/data-g10-paper-answer/);assert.doesNotMatch(student,/data-g10-teacher-case-label/);assert.match(teacher,/data-g10-paper-answer/);if(built)assert.match(student,/data-g10-student-case/);
  for(const activity of inquiries.filter(a=>a.chapter===chapter.id)){assert.ok(student.includes(activity.id));assert.ok(teacher.includes(activity.id));}
 }
});
test('student print case headings are neutral numbers rather than outcome labels',()=>{
 const component=readFileSync(new URL('../src/components/G10InquiryPrint.astro',import.meta.url),'utf8');
 assert.match(component,/data-g10-student-case/);assert.match(component,/teacher\|\|!control\.options/);
 if(existsSync(new URL('../dist/teaching/senior-math/inquiries/print/09/index.html',import.meta.url)))for(const prefix of ['../dist/teaching/','../dist/zh/teaching/']){
  const html=readFileSync(new URL(`${prefix}senior-math/inquiries/print/09/index.html`,import.meta.url),'utf8');
  // Only inspect newly built neutral-card markup; pre-build output is independently rechecked after build.
  if(built)assert.match(html,/data-g10-student-case/);if(html.includes('data-g10-student-case'))for(const label of ['太短：零解','相切，一解','雙解情況','90° 最大值'])assert.ok(!html.includes(label),label);
 }
});
