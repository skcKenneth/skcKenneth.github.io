import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { parseContent } from '../scripts/check-publish.mjs';
import { canonicalId, getTopicIds, SITE_URL, TOPIC_IDS } from '../src/data/site-reader.mjs';
import { selectLatestWriting } from '../src/lib/latest-writing.mjs';
import { collections } from './helpers/reader-content.mjs';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const notes = [
  { id: 'after-a-good-fit-what-to-measure', sources: ['when-the-fit-is-not-the-model'] },
  { id: 'keep-the-result-that-changes-the-question', sources: ['how-many-equilibria-did-the-optimizer-miss', 'when-a-reduced-ventilation-model-leaves-its-training-regime'] },
  { id: 'choose-the-question-before-the-score', sources: ['when-a-traffic-solver-invents-a-jam', 'when-solar-power-changes-fast'] }
];
const locales = [
  { locale: 'en', collection: 'writing', directory: 'writing', prefix: '' },
  { locale: 'zh-Hant', collection: 'writingZh', directory: 'writing-zh', prefix: 'zh/' }
];
const note = (id, directory = 'writing') => parseContent(read(`src/content/${directory}/${id}.md`));
const words = body => body.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*#]/g, '').trim().split(/\s+/).length;
const normalize = text => text.replace(/\s+/g, ' ').trim();
const decode = text => text.replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
  .replace(/&#x([\da-f]+);/gi, (_, value) => String.fromCodePoint(parseInt(value, 16)))
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textContent = html => normalize(decode(html.replace(/<[^>]+>/g, ' ')));

test('three naturally short bilingual notes have a shared published identity, accurate dates and explicit current source dependencies', () => {
  for (const { id, sources } of notes) {
    const en = note(id), zh = note(id, 'writing-zh');
    assert.ok(words(en.body) >= 250 && words(en.body) <= 350, `${id}: English length`);
    const han = zh.body.match(/\p{Script=Han}/gu)?.length || 0;
    assert.ok(han >= 250 && han < 700, `${id}: concise substantive Chinese edition`);
    assert.equal(zh.data.sourceSlug, en.data.slug);
    assert.deepEqual(zh.data.topicIds, en.data.topicIds);
    for (const { directory, prefix, collection } of locales) {
      const { data, body } = note(id, directory);
      assert.equal(data.slug, id);
      assert.equal(data.date, '2026-10-11');
      assert.equal(data.lastUpdated, '2026-10-11');
      assert.equal(data.draft, false);
      assert.equal(data.archived, false);
      assert.equal(data.featured, false);
      assert.equal(data.type, prefix ? '教學筆記' : 'Teaching Notes');
      assert.ok(data.topicIds.length >= 1 && data.topicIds.length <= 3);
      assert.equal(new Set(data.topicIds).size, data.topicIds.length);
      assert.ok(data.topicIds.every(id => TOPIC_IDS.includes(id)));
      assert.deepEqual(data.relatedSlugs, sources);
      assert.equal(data.heroImage, undefined, 'short notes need no invented research figure');
      assert.equal(data.readingMinutes, undefined, 'reading time remains content-derived');
      assert.doesNotMatch(body, /<figure\b|!\[[^\]]*\]\(/);
      const citedArticles = [...body.matchAll(/\]\(\/(?:zh\/)?writing\/([^/]+)\/\)/g)].map(match => match[1]);
      const expectedSlugs = sources.map(sourceId => {
        const matches = collections[collection].filter(entry => canonicalId(entry.data) === sourceId);
        assert.equal(matches.length, 1, `${id}/${sourceId}: unique localized source`);
        assert.equal(Boolean(matches[0].data.draft || matches[0].data.archived), false);
        assert.ok(body.includes(`](/${prefix}writing/${matches[0].data.slug}/)`));
        return matches[0].data.slug;
      });
      assert.deepEqual(citedArticles, expectedSlugs, 'all research claims point to their declared public sources');
    }
  }
});

test('the fit note preserves practical versus structural identification and the demonstration limits from its actual source', () => {
  const source = note('when-the-fit-is-not-the-model').body;
  assert.match(source, /illustrates only the practical side/);
  assert.match(source, /deterministic pseudo-noise, a finite parameter grid/);
  assert.match(source, /visual diagnostic, not a confidence region/);
  const en = note(notes[0].id).body, zh = note(notes[0].id, 'writing-zh').body;
  assert.match(en, /practical identifiability.*experiment provides limited information/s);
  assert.match(en, /different from structural non-identifiability/);
  assert.match(en, /finite-grid demonstration, with deterministic pseudo-noise/);
  assert.match(en, /neither a confidence region nor a proof of structural non-identifiability/);
  assert.match(zh, /實務可識別性.*結構不可識別性/s);
  assert.match(zh, /有限網格與確定性偽雜訊.*不是置信區域.*不是結構證明/s);
  for (const { directory } of locales) assert.ok(note(notes[0].id, directory).body.includes('](/teaching/research-inquiry-studio/#identifiability)'));
  assert.match(zh, /英文互動實驗/);
});

test('the failure note keeps later verification separate from original method coverage and retains the failed nominal ROM control', () => {
  assert.match(note('how-many-equilibria-did-the-optimizer-miss').body, /quick shared event scan missed both small-phase folds/);
  assert.match(note('how-many-equilibria-did-the-optimizer-miss').body, /did not retroactively supply new seeds or change the original method coverage/);
  assert.match(note('when-a-reduced-ventilation-model-leaves-its-training-regime').body, /nominal control already violates the trust gate/);
  const en = note(notes[1].id).body, zh = note(notes[1].id, 'writing-zh').body;
  assert.match(en, /did not supply new seeds retroactively or change the original coverage score/);
  assert.match(en, /Both reduced models already fail.*nominal holdout gate/);
  assert.match(en, /cannot attribute those errors to the shift alone/);
  assert.match(en, /not evidence that all reduced models fail.*does not establish real-room performance/s);
  assert.match(zh, /沒有事後加入新初值.*沒有改寫原來的覆蓋分數/s);
  assert.match(zh, /兩個降階模型.*名義 holdout 已未過關.*不能把誤差歸因於轉移本身/s);
  assert.match(zh, /不代表所有降階模型都失敗.*未建立真實房間表現/s);
});

test('the score note preserves event-specific and absolute-reliability failures instead of promoting an aggregate improvement', () => {
  assert.match(note('when-a-traffic-solver-invents-a-jam').body, /final alignment rewards the state norm.*earlier event metric retains/s);
  assert.match(note('when-solar-power-changes-fast').body, /No deployable candidate clears even.*all-station reliability check/);
  const en = note(notes[2].id).body, zh = note(notes[2].id, 'writing-zh').body;
  assert.match(en, /final global error.*cell boundary.*sensor threshold late/s);
  assert.match(en, /dimensionless synthetic benchmark.*not evidence about real-road delays or a universal ranking/s);
  assert.match(en, /no deployable candidate clears.*all-station absolute criterion/);
  assert.match(en, /does not establish the value of a dispatch decision.*did not evaluate/s);
  assert.match(zh, /很小的整體誤差.*較遲才跨過固定感測器門檻/s);
  assert.match(zh, /無量綱合成基準.*不是真實道路延誤證據/s);
  assert.match(zh, /所有可部署候選方法仍未通過.*全站絕對準則/);
  assert.match(zh, /未建立研究沒有評估的調度決策效益/);
});

test('About adds a paired writing rationale and actual update date while preserving verified biography and milestones', () => {
  for (const { prefix } of locales) {
    const about = read(`src/pages/${prefix}about.astro`);
    assert.ok(about.includes('<time datetime="2026-10-11">'));
    assert.equal((about.match(/id="writing-approach"/g) || []).length, 1);
    assert.equal((about.match(/data-about-editorial/g) || []).length, 1);
    assert.ok(about.includes(`href="/${prefix}topics/routes/model-trust/"`));
    assert.ok(about.includes(`href="/${prefix}writing/choose-the-question-before-the-score/"`));
    const names = ['Hong U Lo', 'Zibo Gao', 'Peng Chi Lam', 'Sok Kin Cheng'].map(name => about.indexOf(name));
    assert.ok(names.every(index => index >= 0));
    assert.deepEqual(names, [...names].sort((a, b) => a - b));
    assert.ok(about.includes(prefix ? '研究指導老師及通訊作者' : 'research mentor and corresponding author'));
    assert.ok(about.includes('AI4Nature@AVSS 2026'));
    assert.ok(about.includes('<EditorialMilestones'));
    assert.ok(about.indexOf('<EditorialMilestones') < about.indexOf('id="cv"'));
    assert.ok(about.includes(prefix ? '可能改變答案的證據' : 'evidence that could change our answer'));
  }
});

if (process.argv.includes('--built')) {
  const built = path => read(`dist/${path}`);
  test('all six built notes expose full localized prose, paired article metadata, source links and valid related articles', async () => {
    const markdown = await createMarkdownProcessor({ syntaxHighlight: false });
    for (const { directory, prefix, locale, collection } of locales) for (const { id, sources } of notes) {
      const { data, body } = note(id, directory);
      const href = `/${prefix}writing/${data.slug}/`;
      const alternate = `/${prefix ? '' : 'zh/'}writing/${id}/`;
      const html = built(`${prefix}writing/${data.slug}/index.html`);
      assert.equal(textContent(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] || ''), normalize(data.title));
      assert.ok(html.includes(`<link rel="canonical" href="${SITE_URL}${href}"`));
      assert.ok(html.includes(`hreflang="${locale === 'en' ? 'zh-Hant' : 'en'}" href="${SITE_URL}${alternate}"`));
      assert.ok(html.includes('property="og:type" content="article"'));
      const json = JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([^<]+)<\/script>/)?.[1] || '{}');
      assert.equal(json['@type'], 'BlogPosting');
      assert.equal(json.headline, data.title);
      assert.equal(json.datePublished, '2026-10-11T00:00:00.000Z');
      assert.equal(json.dateModified, '2026-10-11T00:00:00.000Z');
      assert.equal(json.inLanguage, locale);
      for (const topicId of getTopicIds(data)) assert.ok(html.includes(`data-pagefind-filter="topic[content]" content="${topicId}"`));
      const prose = html.match(/<article\b[^>]*class="prose reader-prose"[^>]*>([\s\S]*?)<\/article>/)?.[1] || '';
      for (const heading of body.matchAll(/^## (.+)$/gm)) assert.ok(textContent(prose).includes(normalize(heading[1])));
      const paragraphs = body.split(/\r?\n\s*\r?\n/).filter(paragraph => paragraph.trim() && !paragraph.startsWith('#'));
      const opening = await markdown.render(paragraphs[0]);
      const renderedOpening = prose.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1] || '';
      assert.equal(textContent(renderedOpening), textContent(opening.code), `${id}/${locale}: complete rendered opening`);
      const related = html.match(/<section\b[^>]*reader-related[^>]*>([\s\S]*?)<\/section>/)?.[1] || '';
      for (const sourceId of sources) {
        const source = collections[collection].find(entry => canonicalId(entry.data) === sourceId);
        const sourceHref = `/${prefix}writing/${source.data.slug}/`;
        assert.ok(prose.includes(`href="${sourceHref}"`));
        assert.ok(related.includes(`href="${sourceHref}"`), `${id}: declared source remains related`);
        assert.ok(built(`${prefix}writing/${source.data.slug}/index.html`).length > 0);
      }
      if (id === 'after-a-good-fit-what-to-measure') {
        const laboratory = built('teaching/research-inquiry-studio/index.html');
        assert.ok(laboratory.includes('id="identifiability"'));
        assert.ok(prose.includes('href="/teaching/research-inquiry-studio/#identifiability"'));
      }
    }
  });
  test('new notes enter both Writing lists and RSS, with homepage selection derived from actual publication dates', () => {
    for (const { prefix, collection } of locales) {
      const listing = built(`${prefix}writing/index.html`), feed = built(`${prefix}rss.xml`), home = built(`${prefix}index.html`);
      for (const { id } of notes) {
        assert.ok(listing.includes(`href="/${prefix}writing/${id}/"`));
        assert.ok(feed.includes(`<link>${SITE_URL}/${prefix}writing/${id}/</link>`));
      }
      // The source inventory uses raw YAML strings; Astro's content schema coerces dates.
      const latest = selectLatestWriting(collections[collection].map(entry => ({
        ...entry, data: { ...entry.data, date: entry.data.date ? new Date(entry.data.date) : undefined }
      })));
      const section = home.match(/<section\b[^>]*id="latest-writing"[^>]*>([\s\S]*?)<\/section>/)?.[1] || '';
      assert.equal((section.match(/<article\b/g) || []).length, 3);
      const actual = [...section.matchAll(/<h3\b[^>]*>\s*<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]);
      assert.deepEqual(actual, latest.map(entry => `/${prefix}writing/${entry.data.slug}/`));
    }
  });
  test('both built About pages expose the writing approach, actual date and original mentoring record', () => {
    for (const { prefix } of locales) {
      const html = built(`${prefix}about/index.html`);
      assert.ok(html.includes('<time datetime="2026-10-11">'));
      assert.ok(html.includes('id="writing-approach"'));
      assert.ok(html.includes('data-about-editorial'));
      assert.ok(html.includes(`href="/${prefix}topics/routes/model-trust/"`));
      assert.ok(html.includes(`href="/${prefix}writing/choose-the-question-before-the-score/"`));
      assert.ok(html.includes('Hong U Lo') && html.includes('Sok Kin Cheng'));
      assert.ok(html.includes('id="milestone-ai4nature-2026"'));
      assert.ok(html.includes('id="cv"'));
    }
  });
}
