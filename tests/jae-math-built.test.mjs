import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {jaeTopics,jaePapers} from '../src/data/jae-math.mjs';
const pages=[['en','teaching/jae-math/index.html'],['zh-Hant','zh/teaching/jae-math/index.html']];
for(const [locale,path] of pages) test(`Built ${locale} lesson is complete, paired and searchable`,()=>{
  const html=readFileSync(new URL('../dist/'+path,import.meta.url),'utf8');
  assert.ok(html.includes(`lang="${locale}"`));
  const questionCount=jaeTopics.reduce((sum,topic)=>sum+topic.questions.length,0);
  assert.equal((html.match(/data-question="/g)||[]).length,questionCount);
  assert.equal((html.match(/data-reveal="/g)||[]).length,questionCount*3);
  assert.equal((html.match(/<main\b/g)||[]).length,1);
  assert.ok(html.includes('data-print="student"'));
  assert.ok(html.includes('data-graph="quadratics"')&&html.includes('data-graph="trigonometry"'));
  assert.ok(html.includes('class="katex-mathml"'));
  for(const topic of jaeTopics) for(const question of topic.questions) assert.ok(html.includes(`id="${question.id}"`));
  for(const paper of jaePapers) { assert.ok(html.includes(paper.url)); assert.ok(html.includes(paper.verified)); }
  assert.ok(html.includes(locale==='en'?'/zh/teaching/jae-math/':'/teaching/jae-math/'));
  const entry=readFileSync(new URL('../dist/'+(locale==='en'?'':'zh/')+'teaching/index.html',import.meta.url),'utf8');
  assert.ok(entry.includes('/teaching/jae-math/'));
  const search=readFileSync(new URL('../dist/'+(locale==='en'?'':'zh/')+'search/index.html',import.meta.url),'utf8');
  for(const alias of ['澳門四校聯考數學研習室','JAE Mathematics','JM01']) assert.ok(search.includes(alias));
});
