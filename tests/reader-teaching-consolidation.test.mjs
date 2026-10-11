import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {transformSync} from 'esbuild';
import {jaeTopics} from '../src/data/jae-math.mjs';
import {pilotQuestions,questionById,papers} from '../src/data/senior-math/catalog.mjs';
import {seniorPages} from '../src/lib/senior-math-pages.mjs';
import {pageTitle} from '../src/lib/senior-math-title.mjs';
import {compatibilityDestination} from '../src/lib/compatibility-redirect.mjs';
import {initialProgress,loadProgress,saveProgress,STORAGE_KEY} from '../src/lib/jae-math-model.mjs';
import {TEACHING_RESOURCES,filterTeachingResources,teachingHref} from '../src/data/teaching-directory.mjs';
const source=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const ids=jaeTopics.flatMap(topic=>topic.questions.map(question=>question.id));

test('one route registry renders the full JAE component in both languages',()=>{
 const studios=seniorPages.filter(page=>page.type==='studio');
 assert.deepEqual(studios,[{path:'studios/jae',type:'studio',id:'jae'}]);
 assert.equal(new Set(seniorPages.map(page=>page.path||'')).size,seniorPages.length);
 for(const [locale,prefix] of [['en',''],['zh-Hant','zh/']]) {
  assert.match(pageTitle(studios[0],locale),/JAE|四校聯考/);
  const page=source(`src/pages/${prefix}teaching/senior-math/[...path].astro`);
  assert.match(page,/seniorPages\.map/);
  assert.match(page,/page\.type === 'studio' \? <JaeMathStudio locale=/);
  const alias=source(`src/pages/${prefix}teaching/jae-math.astro`);
  assert.ok(alias.includes(`<CompatibilityRedirect destination="/${prefix}teaching/senior-math/studios/jae/"`));
  assert.ok(alias.includes("queryKeys={['mode']}"));
  assert.ok(!alias.includes('<JaeMathStudio'));
 }
});

test('legacy links preserve supported modes and every original topic, question and field fragment',()=>{
 assert.equal(ids.length,26);
 const fragments=['jae-topics','jae-directory','past-papers',...jaeTopics.map(topic=>topic.id),...ids,...ids.flatMap(id=>[`answer-${id}`,`notes-${id}`,`correction-${id}`]),'unknown-historical-fragment'];
 for(const base of ['', '/zh']) for(const mode of ['study','classroom']) for(const fragment of fragments) {
  const path=`${base}/teaching/senior-math/studios/jae/`;
  assert.equal(compatibilityDestination(path,`?mode=${mode}&q=unrelated&destination=https://outside.invalid`,`#${fragment}`,{queryKeys:['mode']}),`${path}?mode=${mode}#${fragment}`);
 }
 const component=source('src/components/JaeMathStudio.astro');
 for(const id of ['jae-topics','jae-directory','past-papers']) assert.ok(component.includes(`id="${id}"`));
 assert.ok(component.includes('questionIds={topics.flatMap'));
});

test('old JAE and Senior questions share IDs and record fields without migration',()=>{
 assert.equal(STORAGE_KEY,'jae-math-v1');
 assert.deepEqual(pilotQuestions.map(question=>question.id),ids);
 const saved=new Map(),storage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value)};
 const progress=initialProgress();
 for(const [index,id] of ids.entries()) progress.answers[id]={input:`${index+1}/2`,checkedInput:`${index+1}/2`,notes:`first attempt ${id}`,correction:`revised reasoning ${id}`,completed:index%2===0,attempts:index+1,lastResult:'incorrect'};
 progress.last={mode:'classroom',topic:'trigonometry',question:ids.at(-1)};
 assert.equal(saveProgress(storage,progress),true);
 const expected=structuredClone(progress.answers);
 for(const base of ['', '/zh']) {
  compatibilityDestination(`${base}/teaching/senior-math/studios/jae/`,'?mode=classroom',`#${ids.at(-1)}`,{queryKeys:['mode']});
  const loaded=loadProgress(storage).progress;
  assert.deepEqual(loaded.answers,expected);
  assert.deepEqual(loaded.last,progress.last);
  for(const id of ids) assert.equal(questionById.get(id).id,id);
 }
 // A Senior lesson update must keep all older JAE answers, including checked drafts.
 const current=loadProgress(storage).progress;
 const seniorQuestion=[...questionById.values()].find(question=>!question.legacy&&question.kind==='choice');
 assert.ok(seniorQuestion);
 current.answers[seniorQuestion.id]={input:'A',notes:'new course answer',correction:'',completed:false,attempts:1,lastResult:'correct',checkedInput:'A'};
 assert.equal(saveProgress(storage,current,new Set([seniorQuestion.id])),true);
 const loaded=loadProgress(storage).progress;
 for(const id of ids) assert.deepEqual(loaded.answers[id],expected[id]);
 assert.deepEqual([...saved.keys()],[STORAGE_KEY]);
});

test('the teaching directory exposes one Senior entrance and one complete model entrance',()=>{
 const resourceById=new Map(TEACHING_RESOURCES.map(item=>[item.id,item]));
 for(const id of ['jae-math','frontier-model-studio','research-inquiry-studio']) assert.equal(resourceById.has(id),false);
 const senior=resourceById.get('senior-math'),models=resourceById.get('model-laboratory');
 assert.deepEqual(senior.anchorAliases,['jae-math']);
 assert.deepEqual(models.anchorAliases,['frontier-model-studio','research-inquiry-studio']);
 const allAnchors=TEACHING_RESOURCES.flatMap(item=>[item.id,...item.anchorAliases]);
 assert.equal(new Set(allAnchors).size,allAnchors.length);
 assert.equal(filterTeachingResources({query:'四校聯考',locale:'zh-Hant'})[0].id,'senior-math');
 for(const format of ['interactive','practice','past-papers','notes']) assert.ok(senior.formats.includes(format));
 for(const locale of ['en','zh-Hant']) {
  const found=filterTeachingResources({audience:'senior',format:'past-papers',locale});
  assert.equal(found.filter(item=>item.id==='senior-math').length,1);
  assert.equal(teachingHref(senior,locale),`${locale==='zh-Hant'?'/zh':''}/teaching/senior-math/`);
  assert.match(models.purpose[locale],/14/);
 }
 for(const id of ['math-studio','math-inquiry-lab','lecture-library','modeling-workshop','macau-competition','student-research-studio']) assert.ok(resourceById.has(id));
});

test('the JAE paper anchor leads to the canonical archive while official sources remain accessible',()=>{
 const component=source('src/components/JaeMathStudio.astro');
 assert.ok(!component.includes('papers.map('));
 assert.ok(component.includes("'/zh/teaching/senior-math/papers/' : '/teaching/senior-math/papers/'"));
 assert.equal(papers.length,12);
 for(const paper of papers) { assert.match(paper.url,/^https:\/\/(?:www\.)?(?:must|utm)\.edu\.mo\/.+\.pdf$/); assert.match(paper.verified,/^\d{4}-\d{2}-\d{2}$/); }
 const senior=source('src/components/SeniorMathPage.astro');
 assert.ok(senior.includes("href={root+'studios/jae/'}"));
 assert.ok(senior.includes("item.legacy?root+'studios/jae/#'+item.id"));
 assert.ok(senior.includes('href={item.url}')&&senior.includes('{item.verified}'));
});

test('retained model workbenches have a route back to the complete model directory',()=>{
 for(const prefix of ['', 'zh/']) for(const workbench of ['frontier-model-studio','research-inquiry-studio']) {
  assert.ok(source(`src/pages/${prefix}teaching/${workbench}.astro`).includes(`/${prefix}teaching/model-laboratory/#model-index`));
 }
});

test('the JAE toolbar sits below the measured header using a fixed pixel correction',()=>{
 const css=source('src/styles/jae-math.css');
 const declaration=css.match(/\.jae-commandbar\{([^}]+)\}/)?.[1];
 assert.ok(declaration);
 assert.match(declaration,/top:calc\(var\(--reader-header-offset,96px\) - 16px\)/);
 // The shared header adds exactly 16 CSS pixels, including when text is enlarged.
 const layout=source('src/layouts/BaseLayout.astro');
 assert.ok(layout.includes("(header.getBoundingClientRect().height+16)+'px'"));
});

test('the actual JAE language synchronizer preserves the current mode and fragment on the header link',()=>{
 const ui=source('src/scripts/jae-math-ui.ts');
 const body=ui.match(/const syncLanguage = \(\) => \{([\s\S]*?)\n  \};/)?.[1];
 assert.ok(body);
 const {code}=transformSync(`(() => {${body}})();`,{loader:'ts'});
 for(const prefix of ['', '/zh']) for(const mode of ['classroom','study']) for(const hash of ['#trigonometry-number-2','#past-papers']) {
  const link={href:`https://skckenneth.github.io${prefix}/teaching/senior-math/studios/jae/`};
  const selectors=[];
  runInNewContext(code,{URL,location:{search:`?mode=${mode}`,hash},document:{querySelector:selector=>{selectors.push(selector);return selector==='[data-language-switch]'?link:null;}}});
  assert.deepEqual(selectors,['[data-language-switch]']);
  assert.equal(link.href,`https://skckenneth.github.io${prefix}/teaching/senior-math/studios/jae/?mode=${mode}${hash}`);
 }
 // Missing a counterpart must leave reading usable rather than throw.
 assert.doesNotThrow(()=>runInNewContext(code,{document:{querySelector:()=>null}}));
});

test('long mathematical choices can shrink within the page and scroll only the formula',()=>{
 const css=source('src/styles/jae-math.css');
 const declarations=selector=>css.match(new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\{([^}]+)\\}'))?.[1]||'';
 for(const selector of ['.jae-answer-form','.jae-answer-form fieldset','.jae-options','.jae-options label']) {
  assert.match(declarations(selector),/min-width:0/,selector);
  assert.match(declarations(selector),/max-width:100%/,selector);
 }
 assert.match(declarations('.jae-options'),/grid-template-columns:minmax\(0,1fr\)/);
 assert.match(declarations('.jae-options label>span'),/min-width:0;flex:1/);
 assert.match(declarations('.jae-options label .math-expression'),/display:block;max-width:100%;overflow-x:auto/);
 const question=jaeTopics.flatMap(topic=>topic.questions).find(question=>question.id==='trigonometry-choice-4');
 assert.equal(question.choices.length,4);
 assert.ok(question.choices.every(choice=>choice.expression.includes('cos')));
});
