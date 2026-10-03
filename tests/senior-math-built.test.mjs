import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {seniorPages} from '../src/lib/senior-math-pages.mjs';
import {lessons,reviews,papers,questions,lessonById,questionById} from '../src/data/senior-math/catalog.mjs';
const output=new URL('../dist/',import.meta.url);
const read=path=>readFileSync(new URL(path,output),'utf8');
const topicData=html=>JSON.parse(html.match(/<script\b[^>]*data-jae-data[^>]*>([\s\S]*?)<\/script>/)?.[1]||'[]');
for(const [locale,prefix] of [['en',''],['zh-Hant','zh/']]){
 test(`Every ${locale} course route is readable, paired and free of render errors`,()=>{
  for(const page of seniorPages){
   const suffix=page.path?`${page.path}/`:'',path=`${prefix}teaching/senior-math/${suffix}index.html`,html=read(path);
   assert(html.includes(`lang="${locale}"`),path);
   assert.equal((html.match(/<main\b/g)||[]).length,1,path);
   assert.equal((html.match(/<h1\b/g)||[]).length,1,path);
   assert(!html.includes('class="katex-error"'),path);
   assert(!/G:[\\/]+共用|\.tmp[\\/]senior-math|共用雲端硬碟/.test(html),`${path}: private source location`);
   assert(html.includes(`${prefix?'':'zh/'}teaching/senior-math/${suffix}`),`${path}: language pair`);
   for(const [,href] of html.matchAll(/href="([^"?#]+)(?:[?#][^"]*)?"/g)){
    if(!href.startsWith('/')||href.startsWith('//'))continue;
    const relative=decodeURIComponent(href.slice(1)),target=relative.endsWith('/')?relative+'index.html':relative;
    assert(existsSync(new URL(target,output)),`${path}: broken ${href}`);
   }
   if(['lesson','question','paper'].includes(page.type)){
    const topics=topicData(html);assert.equal(topics.length,1,path);
    const expected=page.type==='lesson'?lessonById.get(page.id).questions:page.type==='question'?[questionById.get(page.id)]:papers.find(p=>p.id===page.id).questions;
    assert.deepEqual(topics[0].questions.map(q=>q.id),expected.map(q=>q.id),`${path}: only this page's content`);
    assert.equal((html.match(/data-question="/g)||[]).length,expected.length,path);
    assert.equal((html.match(/data-reveal="/g)||[]).length,3*expected.length,path);
    for(const q of expected){assert(html.includes(`id="${q.id}"`),path);assert(html.includes('完整解答')||html.includes('Worked solution'),path);}
   }
   if(page.type==='lesson'){
    assert(html.includes('id="teacher"'),path);assert(html.includes('data-lesson-check'),path);
    assert(topicData(html)[0].inquiry||page.id.startsWith('review-'),`${path}: inquiry`);
   }
   if(page.type==='paper'){
    const paper=papers.find(p=>p.id===page.id);assert.equal(paper.status,'complete',path);
    assert(html.includes(paper.url),path);
    const records=topicData(html)[0].questions;
    assert(records.every(q=>q.officialUrl===paper.url&&q.source.answerPdfPage>0),path);
    assert(records.every(q=>q.rubric[0][locale==='en'?'en':'zh'].includes(locale==='en'?'independently authored':'自編')),`${path}: official marks distinguished`);
   }
  }
 });
 test(`${locale} navigation and search expose the complete course`,()=>{
  const home=read(`${prefix}teaching/senior-math/index.html`);
  assert(home.includes('73')&&home.includes('18'));
  const index=read(`${prefix}teaching/index.html`),search=read(`${prefix}search/index.html`);
  assert(index.includes(`/${prefix}teaching/senior-math/`));
  assert(search.includes('高中數學研習室')&&search.includes('Senior Mathematics Studio')&&search.includes('JM02'));
  const bank=read(`${prefix}teaching/senior-math/question-bank/index.html`);
  assert.equal((bank.match(/data-bank-row\b/g)||[]).length,questions.length);
  for(const filter of ['level','kind','source','book','exam','school','wrong','completed'])assert(bank.includes(`data-bank-${filter}`));
  const exam=read(`${prefix}teaching/senior-math/paths/exam/index.html`);
  assert(exam.includes('JM01_Exam_Syllabus_2027.pdf')&&exam.includes('JM02_Exam_Syllabus_2027.pdf'));
 });
}
test('Print styles and preparation retain the teacher edition in classroom mode',()=>{
 const css=readFileSync(new URL('../src/styles/senior-math.css',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../src/scripts/jae-math-ui.ts',import.meta.url),'utf8');
 assert(css.includes('[data-print=teacher]) .senior-teacher{display:block!important}'));
 assert(css.includes('[data-print=student]) .senior-teacher{display:none!important}'));
 assert(ui.includes('...teacherDetails')&&ui.includes("element.open = edition === 'teacher'"));
 assert.equal(lessons.length,87);assert.equal(reviews.length,18);assert.equal(papers.length,12);
});
