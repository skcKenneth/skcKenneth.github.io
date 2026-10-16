import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {transformSync} from 'esbuild';
import {READER_GUIDES,READER_GUIDE_IDS,getReaderGuide} from '../src/data/reader-guides.mjs';
import {EDITORIAL_ARTICLE_IDS} from '../src/data/reader-media.mjs';
import {collections} from './helpers/reader-content.mjs';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const body=id=>read(`src/content/writing/${id}.md`);
const count=(text,needle)=>text.split(needle).length-1;

test('editorial guides use shared article IDs with complete paired reader information',()=>{
 assert.equal(READER_GUIDE_IDS.length,EDITORIAL_ARTICLE_IDS.length);
 assert.deepEqual([...READER_GUIDE_IDS].sort(),[...EDITORIAL_ARTICLE_IDS].sort());
 for(const id of READER_GUIDE_IDS) {
  const en=collections.writing.find(entry=>entry.data.slug===id);
  const zh=collections.writingZh.find(entry=>entry.data.sourceSlug===id);
  assert.ok(en&&zh,id);
  for(const [entry,locale] of [[en,'en'],[zh,'zh-Hant']]) {
   const guide=getReaderGuide(entry.data,locale);
   assert.strictEqual(guide,READER_GUIDES[id][locale]);
   assert.ok(guide.question.endsWith(locale==='en'?'?':'？'));
   assert.ok(guide.takeaways.length>=2&&guide.takeaways.length<=3);
   for(const value of [guide.question,...guide.takeaways,guide.audience,guide.prerequisite,guide.evidence]) assert.ok(typeof value==='string'&&value.trim(),id);
   assert.notEqual(guide.question,entry.data.summary,'the core question must not repeat the abstract');
  }
  assert.strictEqual(getReaderGuide({slug:'different-translated-display-slug',sourceSlug:id},'zh-Hant'),READER_GUIDES[id]['zh-Hant']);
 }
 assert.equal(getReaderGuide({slug:'not-yet-edited'}),null);
 assert.equal(getReaderGuide(undefined),null);
 assert.equal(getReaderGuide(READER_GUIDE_IDS[0],'unknown-locale'),null);
});

test('guides preserve the articles’ critical negative findings and evidence domains',()=>{
 const ttf='do-more-test-time-steps-make-better-forecasts';
 assert.match(getReaderGuide(ttf).question,/observed context.*unseen future/);
 assert.match(getReaderGuide(ttf,'zh-Hant').question,/已觀測片段.*尚未看見的未來/);
 assert.match(getReaderGuide(ttf).takeaways.join(' '),/source-norm.*fails.*128-loop.*least squares.*sampling-alias.*unique transport speed/);
 assert.match(getReaderGuide(ttf,'zh-Hant').takeaways.join(' '),/原文範數.*128 次循環.*失敗.*最小平方.*採樣混疊.*唯一辨識/);
 assert.match(getReaderGuide(ttf).evidence,/small-scale independent.*synthetic.*three training seeds.*AdamW.*separate failure counts.*not establish universal.*refute the original paper/);
 assert.match(getReaderGuide(ttf,'zh-Hant').evidence,/合成.*小規模獨立重實作.*三個訓練 seeds.*AdamW.*失敗數量.*未建立.*一般優勢.*不構成.*原論文.*否定/);
 const spectral='two-networks-one-spectrum-different-alarms';
 assert.match(body(spectral),/equal exit-rate assumption/);
 assert.match(body(spectral),/Cycles introduce arbitrarily long walks/);
 assert.match(getReaderGuide(spectral).evidence,/synthetic.*acyclic.*equal transient holding rates.*uniform removal/);
 assert.match(getReaderGuide(spectral,'zh-Hant').evidence,/合成.*無環.*暫態節點.*總轉移率.*均勻移除/);
 const folding='how-many-equilibria-did-the-optimizer-miss';
 assert.match(body(folding),/All five workflows recover every stable reference/);
 assert.match(body(folding),/Extra deflated anchor searches accept no new roots/);
 assert.match(getReaderGuide(folding).takeaways.join(' '),/tested settings.*every stable reference state/);
 assert.match(getReaderGuide(folding,'zh-Hant').takeaways.join(' '),/受測設定.*全部穩定參考態/);
 for(const [locale,patterns] of [['en',[/two-mode/,/local checks/,/does not validate physical/]],['zh-Hant',[/兩模態/,/局部檢查/,/未驗證.*物理/]]]) for(const pattern of patterns) assert.match(getReaderGuide(folding,locale).evidence,pattern);
 const traffic='what-must-a-traffic-model-remember';
 assert.match(body(traffic),/There are 24 cars/);
 assert.match(body(traffic),/Four real coordinates determine its future/);
 assert.match(body(traffic),/Both scores concern two headway coordinates; neither belongs in a ranking of the four-coordinate predictors/);
 assert.match(read(`src/content/writing-zh/${traffic}.md`),/基礎比較使用四維 VAR/);
 assert.match(getReaderGuide(traffic).question,/only part of the state/);
 assert.match(getReaderGuide(traffic,'zh-Hant').question,/部分狀態/);
 assert.match(getReaderGuide(traffic).takeaways[0],/headway-only control.*main comparison retaining both headway and velocity modes/);
 assert.match(getReaderGuide(traffic,'zh-Hant').takeaways[0],/只觀察車距的控制例子.*同時保留車距、速度模態的主要比較/);
 assert.match(body(traffic),/not estimates certified to equal the exact coordinate-elimination kernel/);
 assert.match(getReaderGuide(traffic).evidence,/synthetic 24-car.*approximations.*no road-control/);
 assert.match(getReaderGuide(traffic,'zh-Hant').evidence,/合成.*24 車.*近似.*未評估道路控制/);
 const fit='when-the-fit-is-not-the-model';
 assert.match(body(fit),/near-optimal.*visual diagnostic, not a confidence region/);
 assert.match(getReaderGuide(fit).evidence,/deterministic pseudo-noise.*finite grid.*not a confidence region/);
 assert.match(getReaderGuide(fit,'zh-Hant').evidence,/偽雜訊.*有限網格.*並非置信區域.*未證明結構不可識別/);
 const stress='random-stress-tests-are-not-certificates';
 assert.match(body(stress),/4\.1264291805731546/);
 assert.match(body(stress),/not an estimated miss probability/);
 assert.match(getReaderGuide(stress).evidence,/synthetic dimensionless.*below 10⁻⁶.*no general miss probability.*no physical reactor-safety/);
 assert.match(getReaderGuide(stress,'zh-Hant').evidence,/合成無量綱.*10⁻⁶.*未建立一般漏檢機率.*未提供實體反應器安全/);
 const solar='when-solar-power-changes-fast';
 assert.match(body(solar),/2019–2020/);
 assert.match(body(solar),/five stations describe the available external replication/);
 assert.match(body(solar),/does not evaluate complete current-power outages/);
 assert.match(getReaderGuide(solar).evidence,/public 2019–2020.*five confirmation stations.*every deployable candidate still fails.*without current power are excluded/);
 assert.match(getReaderGuide(solar,'zh-Hant').evidence,/五個確認站點.*2019–2020 公開觀測.*未通過.*缺少當前功率.*排除/);
});

test('the reader replaces the abstract only when a guide exists and retains reading tools',()=>{
 const reader=read('src/components/ArticleReader.astro');
 assert.match(reader,/getReaderGuide\(entry\.data, locale\)/);
 assert.match(reader,/guide \? <ReaderGuide[^\n]+: <p class="lead" data-pagefind-meta="description">\{entry\.data\.summary\}/);
 assert.equal(count(reader,'<ReaderGuide '),1);
 for(const retained of ['<SaveArticle','headings.filter','<ReadingNav','selectRelatedArticles','publicRepositoryUrl','<slot />']) assert.ok(reader.includes(retained),retained);
 assert.match(reader,/entry\.data\.scienceProject && !guide/,'guide evidence replaces the duplicated generic source prompt');
 const component=read('src/components/ReaderGuide.astro');
 const question=component.indexOf('data-reader-guide-question'),disclosure=component.indexOf('<details');
 assert.ok(question>0&&question<disclosure,'the question stays outside the collapsible details');
 assert.equal(count(component,'{guide.question}'),1);
 assert.match(component,/<details[^>]*open>/,'native fallback remains readable without JavaScript');
 assert.match(component,/<summary>/);
 assert.match(component,/data-pagefind-meta="description"/);
 assert.doesNotMatch(component,/localStorage|sessionStorage/);
});

test('the actual disclosure initializer opens desktop and collapses mobile without hiding the question',()=>{
 const component=read('src/components/ReaderGuide.astro');
 const script=component.match(/<script>([\s\S]*?)<\/script>/)?.[1];
 assert.ok(script);
 const {code}=transformSync(script,{loader:'ts'});
 for(const desktop of [false,true]) {
  const details={open:true},listeners={};
  const media={matches:desktop,addEventListener:(name,callback)=>{listeners[name]=callback;}};
  const selectors=[];
  runInNewContext(code,{window:{matchMedia:query=>{assert.equal(query,'(min-width: 768px)');return media;}},document:{querySelectorAll:selector=>{selectors.push(selector);return [details];}}});
  assert.equal(details.open,desktop);
  assert.deepEqual(selectors,['[data-reader-guide-details]']);
  listeners.change({matches:!desktop}); assert.equal(details.open,!desktop);
 }
 const css=read('src/styles/reader-guide.css');
 assert.match(css,/grid-template-columns:minmax\(0,1fr\)/);
 assert.match(css,/summary:focus-visible/);
 assert.doesNotMatch(css,/\.reader-guide-question[^}]*display:none/);
});

if(process.argv.includes('--built')) {
 test('all paired editorial pages have one built guide and question without a repeated visible abstract',()=>{
  for(const id of READER_GUIDE_IDS) for(const [prefix,locale,collection] of [['','en','writing'],['zh/','zh-Hant','writingZh']]) {
   const entry=collections[collection].find(entry=>(entry.data.sourceSlug||entry.data.slug)===id);
   const html=read(`dist/${prefix}writing/${entry.data.slug}/index.html`);
   const header=html.match(/<header class="page-head reader-article-head">([\s\S]*?)<\/header>/)?.[1];
   assert.ok(header,id);
   assert.equal((header.match(/data-reader-guide="/g)||[]).length,1,id);
   assert.equal((header.match(/data-reader-guide-question\b/g)||[]).length,1,id);
   assert.equal(count(header,getReaderGuide(id,locale).question.replace(/&/g,'&amp;')),1,id);
   assert.ok(header.includes('data-reader-guide-details'));
   assert.ok(!header.includes('class="lead"'),id);
   assert.ok(!header.includes(entry.data.summary),id);
   for(const text of getReaderGuide(id,locale).takeaways) assert.ok(header.includes(text),id);
   assert.ok(html.includes('data-article-reader')&&html.includes('data-article-id="'+id+'"'),id);
   assert.equal((html.match(/<h1\b/g)||[]).length,1,id);
  }
 });
 test('a built article without an edited guide keeps its existing abstract',()=>{
  for(const [prefix,locale,collection] of [['','en','writing'],['zh/','zh-Hant','writingZh']]) {
   const id='did-the-hotspot-move-or-did-it-grow';
   const entry=collections[collection].find(entry=>(entry.data.sourceSlug||entry.data.slug)===id);
   const html=read(`dist/${prefix}writing/${entry.data.slug}/index.html`);
   const header=html.match(/<header class="page-head reader-article-head">([\s\S]*?)<\/header>/)?.[1];
   assert.ok(header.includes('class="lead"'));
   assert.ok(header.includes(entry.data.summary));
   assert.equal(getReaderGuide(entry.data,locale),null);
   assert.ok(!header.includes('data-reader-guide='));
  }
 });
}
