import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createMarkdownProcessor, rehypeHeadingIds } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { CONCEPTS, CONCEPT_IDS, CONCEPT_PLACEMENTS, conceptHref, conceptPlacementsFor, getConcept, getConceptCopy, getConceptArticleLinks } from '../src/data/reader-concepts.mjs';
import rehypeReaderConcepts, { resolveConceptArticleContext } from '../scripts/rehype-reader-concepts.mjs';
import { TOPIC_IDS } from '../src/data/site-reader.mjs';
import { collections } from './helpers/reader-content.mjs';

const root = new URL('../',import.meta.url);
const read = path => readFileSync(new URL(path,root),'utf8');
const yaml = createRequire(import.meta.resolve('astro/package.json'))('yaml');
const locales = ['en','zh-Hant'];
const pilotIds = Object.keys(CONCEPT_PLACEMENTS);
const notePattern = /<details\b(?=[^>]*\bdata-reader-concept=)[\s\S]*?<\/details>/g;
const count = (value,needle) => value.split(needle).length-1;
const sourceFor = (id,locale) => {
  const fileURL = new URL(`src/content/${locale==='en'?'writing':'writing-zh'}/${id}.md`,root);
  const source = readFileSync(fileURL,'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  return {source,body:source.slice(frontmatter[0].length),data:yaml.parse(frontmatter[1]),fileURL};
};
const processors = Promise.all([
  createMarkdownProcessor({remarkPlugins:[remarkMath],rehypePlugins:[rehypeKatex],syntaxHighlight:false}),
  createMarkdownProcessor({remarkPlugins:[remarkMath],rehypePlugins:[rehypeKatex,rehypeHeadingIds,rehypeReaderConcepts],syntaxHighlight:false})
]);
const rendered = new Map();
async function renderPair(id,locale) {
  const key = `${id}/${locale}`;
  if (!rendered.has(key)) rendered.set(key,(async()=>{
    const article = sourceFor(id,locale);
    const [baseline,enhanced] = await processors;
    const options = {fileURL:article.fileURL,frontmatter:article.data};
    return {article,before:await baseline.render(article.body,options),after:await enhanced.render(article.body,options)};
  })());
  return rendered.get(key);
}

test('eight bilingual concepts have stable IDs, scoped sources and resolvable article links',()=>{
  assert.deepEqual(CONCEPT_IDS,['baseline','assumption','sensitivity','identifiability','calibration','validation','robustness','uncertainty']);
  assert.equal(new Set(CONCEPT_IDS).size,8);
  for (const concept of CONCEPTS) {
    assert.ok(concept.topicIds.length>0&&concept.topicIds.length<=3);
    for (const id of concept.topicIds) assert.ok(TOPIC_IDS.includes(id));
    for (const locale of locales) {
      assert.ok(concept.label[locale]);
      assert.ok(concept.aliases[locale].length);
      assert.strictEqual(getConceptCopy(concept.id,locale),concept.copy[locale]);
      for (const field of ['definition','example','misconception','scope']) assert.ok(concept.copy[locale][field]?.trim(),`${concept.id}/${locale}/${field}`);
      const entries = locale==='en'?collections.writing:collections.writingZh;
      const links = getConceptArticleLinks(concept,entries,locale);
      assert.equal(links.length,concept.articleIds.length);
      for (const link of links) assert.ok(entries.some(entry=>entry.data.title===link.title&&link.href===`${locale==='en'?'':'/zh'}/writing/${entry.data.slug}/`));
    }
    assert.ok(concept.sources.length);
    for (const source of concept.sources) {
      assert.equal(new URL(source.url).protocol,'https:');
      assert.ok(source.publisher&&source.scope&&source.title);
    }
  }
  assert.equal(getConcept('unknown'),null);
  assert.equal(getConceptCopy('unknown'),null);
  assert.deepEqual(conceptPlacementsFor('__proto__'),[]);
  const translated = getConceptArticleLinks({articleIds:['original-id']},[{data:{sourceSlug:'original-id',slug:'translated-address',title:'翻譯標題',summary:'摘要'}}],'zh-Hant');
  assert.equal(translated[0].href,'/zh/writing/translated-address/');
  const laboratory = getConcept('identifiability').resources[0];
  assert.equal(laboratory.href['zh-Hant'],'/teaching/research-inquiry-studio/#identifiability');
  assert.match(laboratory.label['zh-Hant'],/英文互動/);
});

test('examples preserve scientific evidence boundaries rather than expanding the findings',()=>{
  const network = sourceFor('two-networks-one-spectrum-different-alarms','en').body;
  assert.match(network,/Each of the first five compartments transfers material onward at total rate/);
  assert.match(network,/Suppose the nominal routing matrix is \$A\$.*gives \$B\$/);
  assert.match(network,/This implication is one-way/);
  assert.match(getConceptCopy('assumption').example,/equal total transfer rates at transient nodes/);
  assert.match(getConceptCopy('robustness').example,/For two admitted routes.*response-difference bound.*nominal decision margin/);
  assert.match(getConceptCopy('robustness').scope,/pairwise.*whole-family.*uniform/);
  assert.match(getConceptCopy('robustness','zh-Hant').scope,/一對路由.*整個路由族.*一致成立/);
  const folding = sourceFor('how-many-equilibria-did-the-optimizer-miss','en').body;
  assert.match(folding,/a baseline for the pointwise atlas, not a branch-aware optimizer initialization/);
  assert.match(folding,/Agreement of known roots does not enumerate unknown branches/);
  assert.match(getConceptCopy('sensitivity').scope,/numerical sensitivity.*not a global variance decomposition.*does not enumerate unknown/);
  const fit = sourceFor('when-the-fit-is-not-the-model','en').body;
  assert.match(fit,/illustrates only the practical side/);
  assert.match(fit,/near-optimal.*visual diagnostic, not a confidence region/);
  assert.match(getConceptCopy('identifiability').scope,/visual diagnostic.*not a confidence region or a structural proof/);
  const traffic = sourceFor('what-must-a-traffic-model-remember','en').body;
  assert.match(traffic,/Splitting occurs by complete trajectory before constructing lagged training rows/);
  assert.match(traffic,/Test trajectories do not select regularization, lag order, or stability labels/);
  assert.match(getConceptCopy('validation').scope,/different roles.*synthetic.*not evaluated/);
  const solar = sourceFor('when-solar-power-changes-fast','en').body;
  assert.match(solar,/holds the underlying forecaster fixed/);
  assert.match(solar,/Their theoretical results depend on their stated methods and assumptions; they are not inherited automatically/);
  assert.match(getConceptCopy('calibration').scope,/exchangeability.*marginal coverage.*not automatically inherited.*deployable candidates all still fail/);
  assert.match(getConceptCopy('calibration','zh-Hant').scope,/交換性.*邊際覆蓋.*不會自動承繼.*全部未通過/);
  const stress = sourceFor('random-stress-tests-are-not-certificates','en').body;
  assert.match(stress,/The box is a deterministic set/);
  assert.match(stress,/No probability measure is attached/);
  assert.match(getConceptCopy('uncertainty').example,/deterministic parameter box.*no probability distribution/);
  assert.match(getConceptCopy('uncertainty').scope,/synthetic mathematical maximum.*no general miss probability or reactor-safety claim/);
});

test('filename context admits only curated original writing and resolves paired source IDs on either platform',()=>{
  const id = 'what-must-a-traffic-model-remember';
  const file = (path,data={slug:id}) => ({path,data:{astro:{frontmatter:data}}});
  assert.deepEqual(resolveConceptArticleContext(file(`C:\\repo\\src\\content\\writing\\${id}.md`)),{articleId:id,locale:'en'});
  assert.deepEqual(resolveConceptArticleContext(file(`/repo/src/content/writing-zh/${id}.md`,{slug:'translated-slug',sourceSlug:id})),{articleId:id,locale:'zh-Hant'});
  for (const path of [`/repo/src/content/teaching/${id}.md`,`/repo/src/content/writing/legacy/${id}.md`,`/repo/src/pages/${id}.md`,`/repo/src/content/writing/${id}.mdx`]) assert.equal(resolveConceptArticleContext(file(path)),null,path);
  for (const data of [{slug:id,draft:true},{slug:id,archived:true},{slug:id,legacySource:'original.md'},{slug:'not-a-pilot'}]) assert.equal(resolveConceptArticleContext(file(`/repo/src/content/writing/${id}.md`,data)),null);
  assert.equal(resolveConceptArticleContext({path:`/repo/src/content/writing/${id}.md`}),null);
});

test('the real Markdown pipeline adds only eight native prompts per language and preserves every original byte of rendered prose',async()=>{
  assert.equal(pilotIds.length,6);
  for (const locale of locales) {
    let total = 0;
    for (const id of pilotIds) {
      const {before,after} = await renderPair(id,locale);
      const notes = after.code.match(notePattern)||[];
      const placements = conceptPlacementsFor(id,locale);
      assert.equal(notes.length,placements.length,`${id}/${locale}`);
      total += notes.length;
      assert.equal(after.code.replace(notePattern,''),before.code,`scientific prose, formulas, figures and captions changed in ${id}/${locale}`);
      assert.deepEqual(after.metadata.headings,before.metadata.headings,`heading IDs or TOC changed in ${id}/${locale}`);
      for (const placement of placements) {
        assert.ok(before.metadata.headings.some(heading=>heading.slug===placement.headingId));
        const note = notes.find(note=>note.includes(`data-reader-concept="${placement.conceptId}"`));
        assert.ok(note);
        assert.match(note,/<summary>/);
        assert.match(note,/data-pagefind-ignore/);
        assert.doesNotMatch(note,/<h[1-6]\b|<script\b|\bonclick=|\bonmouseover=/);
        assert.ok(note.includes(`href="${conceptHref(placement.conceptId,locale)}"`));
        const heading = after.code.indexOf(`id="${placement.headingId}"`);
        assert.ok(after.code.indexOf(note)>heading);
      }
    }
    assert.equal(total,8);
  }
});

test('stale or ambiguous placements fail clearly, while repeated transforms do not duplicate prompts',()=>{
  const id = 'what-must-a-traffic-model-remember';
  const headingId = conceptPlacementsFor(id)[0].headingId;
  const file = {path:`/repo/src/content/writing/${id}.md`,data:{astro:{frontmatter:{slug:id}}}};
  const transform = rehypeReaderConcepts();
  assert.throws(()=>transform({type:'root',children:[]},file),/requires one heading.*found 0/);
  const heading = () => ({type:'element',tagName:'h2',properties:{id:headingId},children:[{type:'text',value:'Original heading'}]});
  assert.throws(()=>transform({type:'root',children:[heading(),heading()]},file),/found 2/);
  const tree = {type:'root',children:[heading()]};
  transform(tree,file);
  const once = JSON.stringify(tree);
  transform(tree,file);
  assert.equal(JSON.stringify(tree),once);
  const teaching = {type:'root',children:[heading()]};
  const untouched = JSON.stringify(teaching);
  transform(teaching,{...file,path:`/repo/src/content/teaching/${id}.md`});
  assert.equal(JSON.stringify(teaching),untouched);
});

if (process.argv.includes('--built')) {
  test('all eighteen built concept routes expose paired metadata and usable actual article links',()=>{
    for (const locale of locales) {
      const prefix = locale==='en'?'':'zh/';
      const index = read(`dist/${prefix}concepts/index.html`);
      assert.equal(count(index,'data-concept-card='),8);
      assert.equal(count(index,'aria-label="'+(locale==='en'?'Breadcrumb':'所在位置')+'"'),1);
      for (const concept of CONCEPTS) {
        assert.ok(index.includes(`href="${conceptHref(concept.id,locale)}"`));
        const html = read(`dist/${prefix}concepts/${concept.id}/index.html`);
        assert.equal(count(html,`data-concept-entry="${concept.id}"`),1);
        assert.match(html,/<meta data-pagefind-filter="type\[content\]" content="Concept guides"/);
        assert.ok(html.includes(`hreflang="${locale==='en'?'zh-Hant':'en'}" href="https://skckenneth.github.io${conceptHref(concept.id,locale==='en'?'zh-Hant':'en')}"`));
        assert.equal((html.match(/<h1\b/g)||[]).length,1);
        assert.equal(count(html,'aria-label="'+(locale==='en'?'Breadcrumb':'所在位置')+'"'),1);
        const entries = locale==='en'?collections.writing:collections.writingZh;
        for (const article of getConceptArticleLinks(concept,entries,locale)) {
          assert.ok(html.includes(`href="${article.href}"`));
          assert.ok(existsSync(new URL(`dist${article.href}index.html`,root)));
        }
        for (const source of concept.sources) assert.ok(html.includes(`href="${source.url}"`));
        for (const resource of concept.resources||[]) {
          assert.ok(html.includes(`href="${resource.href[locale]}"`),`${concept.id}/${locale}: resource link`);
          assert.ok(html.includes(resource.label[locale]),`${concept.id}/${locale}: resource language label`);
          const [path,hash] = resource.href[locale].split('#');
          const destination = read(`dist${path}index.html`);
          if (hash) assert.ok(destination.includes(`id="${hash}"`));
        }
      }
    }
  });

  test('built pilot prompts remain at the exact paired headings with original scientific structure',async()=>{
    for (const locale of locales) for (const id of pilotIds) {
      const {article,before} = await renderPair(id,locale);
      const prefix = locale==='en'?'':'zh/';
      const html = read(`dist/${prefix}writing/${article.data.slug}/index.html`);
      const prose = html.match(/<article\b[^>]*class="prose reader-prose"[^>]*>([\s\S]*?)<\/article>/)?.[1];
      assert.ok(prose,`${id}/${locale}`);
      const placements = conceptPlacementsFor(id,locale);
      assert.equal((prose.match(notePattern)||[]).length,placements.length);
      const actualHeadings = [...prose.matchAll(/<h([23])\b[^>]*id="([^"]+)"/g)].map(match=>match[2]);
      assert.deepEqual(actualHeadings,before.metadata.headings.filter(heading=>heading.depth===2||heading.depth===3).map(heading=>heading.slug));
      assert.equal(count(prose,'<figcaption'),count(before.code,'<figcaption'));
      assert.equal(count(prose,'class="katex"'),count(before.code,'class="katex"'));
      for (const placement of placements) {
        const headingEnd = prose.indexOf('</h',prose.indexOf(`id="${placement.headingId}"`));
        const immediatelyAfterHeading = prose.slice(prose.indexOf('>',headingEnd)+1);
        assert.match(immediatelyAfterHeading,new RegExp(`^\\s*<details[^>]*data-reader-concept="${placement.conceptId}"`));
      }
    }
    for (const route of ['writing/did-the-hotspot-move-or-did-it-grow/','zh/writing/did-the-hotspot-move-or-did-it-grow/','teaching/model-laboratory/','zh/teaching/model-laboratory/']) {
      assert.ok(!read(`dist/${route}index.html`).includes('data-reader-concept='),route);
    }
  });
}
