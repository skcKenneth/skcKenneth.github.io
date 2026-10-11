import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {jaeTopics,jaeSyllabus} from '../src/data/jae-math.mjs';
import {papers} from '../src/data/senior-math/catalog.mjs';
const read=path=>readFileSync(new URL('../dist/'+path,import.meta.url),'utf8');
for(const [locale,prefix] of [['en',''],['zh-Hant','zh/']]) {
 test(`Built ${locale} canonical JAE studio retains the full lessons and one paper entrance`,()=>{
  const canonical=`/${prefix}teaching/senior-math/studios/jae/`,html=read(canonical.slice(1)+'index.html');
  assert.ok(html.includes(`lang="${locale}"`));
  const questionCount=jaeTopics.reduce((sum,topic)=>sum+topic.questions.length,0);
  assert.equal(questionCount,26);
  assert.equal((html.match(/data-question="/g)||[]).length,questionCount);
  assert.equal((html.match(/data-reveal="/g)||[]).length,questionCount*3);
  assert.equal((html.match(/<main\b/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.equal((html.match(/data-teaching-toolbar\b/g)||[]).length,1);
  assert.ok(html.includes('data-print="student"'));
  assert.equal((html.match(/data-graph="/g)||[]).length,2);
  assert.ok(html.includes('data-graph="quadratics"')&&html.includes('data-graph="trigonometry"'));
  assert.ok(html.includes('class="katex-mathml"'));
  for(const topic of jaeTopics) {
   assert.ok(html.includes(`id="${topic.id}"`));
   for(const question of topic.questions) for(const id of [question.id,`notes-${question.id}`,`correction-${question.id}`]) assert.ok(html.includes(`id="${id}"`),id);
  }
  assert.ok(html.includes('id="past-papers"'));
  assert.ok(html.includes(`href="/${prefix}teaching/senior-math/papers/"`));
  assert.ok(!html.includes('class="jae-paper-card"'),'past-paper cards live in the shared archive');
  assert.ok(html.includes(jaeSyllabus.url));
  for(const paper of papers) {
   const paperHtml=read(`${prefix}teaching/senior-math/papers/${paper.id}/index.html`);
   assert.ok(paperHtml.includes(paper.url),paper.id);
   assert.ok(paperHtml.includes(paper.verified),paper.id);
  }
  assert.ok(html.includes(locale==='en'?'/zh/teaching/senior-math/studios/jae/':'/teaching/senior-math/studios/jae/'));
  const home=read(`${prefix}teaching/senior-math/index.html`);
  assert.ok(home.includes(`href="${canonical}"`));
  const entry=read(`${prefix}teaching/index.html`);
  assert.ok(entry.includes(`href="/${prefix}teaching/senior-math/"`));
  assert.ok(!entry.includes(`href="/${prefix}teaching/jae-math/"`));
  for(const id of ['jae-math','frontier-model-studio','research-inquiry-studio']) assert.ok(entry.includes(`id="${id}"`),'legacy directory anchor '+id);
  for(const path of ['frontier-model-studio','research-inquiry-studio']) assert.ok(!entry.includes(`href="/${prefix}teaching/${path}/"`));
  for(const topic of jaeTopics) for(const question of topic.questions) {
   const questionHtml=read(`${prefix}teaching/senior-math/questions/${question.id}/index.html`);
   assert.ok(questionHtml.includes(`href="${canonical}#${question.id}"`),question.id);
  }
 });
 test(`Built ${locale} former JAE route is a non-indexed compatibility entrance`,()=>{
  const html=read(`${prefix}teaching/jae-math/index.html`);
  assert.ok(html.includes('name="robots" content="noindex,follow"'));
  assert.ok(html.includes(`data-destination="/${prefix}teaching/senior-math/studios/jae/"`));
  assert.match(html,/data-query-keys="(?:&#34;|&quot;|\[)/);
  assert.ok(html.includes('mode')&&html.includes('data-preserve-hash="true"'));
  assert.ok(!html.includes('data-question="'));
 });
}
