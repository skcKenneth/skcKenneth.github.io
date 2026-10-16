import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import katex from "katex";
import readingTime from "reading-time";
import { readingMinutes } from "../src/data/site-reader.mjs";
import { checkResearchArticles } from "../scripts/check-research-articles.mjs";
import { validatePublishSvg } from "../scripts/science-sync-policy.mjs";

const root = new URL("../", import.meta.url);
const slug = "do-more-test-time-steps-make-better-forecasts";
const assetDirectory = "public/images/test-time-forecasting/";
const read = path => readFileSync(new URL(path, root), "utf8").replace(/\r\n?/g, "\n");
// Missing manuscripts or assets are a release failure, not an automatically skipped test.
const editions = ["writing", "writing-zh"].map(collection => read("src/content/" + collection + "/" + slug + ".md"));
const projects = ["projects", "projects-zh"].map(collection => read("src/content/" + collection + "/" + slug + ".md"));
const field = (text, key) => text.split(/^---\s*$/m)[1]
  .match(new RegExp("^" + key + ":\\s*[\"']?([^\"'\\r\\n]+)", "m"))?.[1]?.trim();
const sources = text => [...text.matchAll(/<figure\b[^>]*>[\s\S]*?<img\b[^>]*src="([^"]+)"[\s\S]*?<\/figure>/g)]
  .map(match => match[1]);
const equations = text => [...text.matchAll(/\$\$\s*([\s\S]*?)\s*\$\$/g)].map(match => match[1].replace(/\s+/g, ""));
const links = text => [...new Set([...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(match => match[1]))].sort();
const body = text => text.split(/^---\s*$/m).slice(2).join("---");
const expectedFigures = Array.from({ length: 10 }, (_, index) => "fig-" + String(index + 1).padStart(2, "0") + ".svg");

test("test-time forecasting contains ten safe accessible paired vector figures", () => {
  assert.deepEqual(checkResearchArticles([slug]), []);
  assert.deepEqual(readdirSync(new URL(assetDirectory, root)).sort(), expectedFigures);
  for (const file of expectedFigures) {
    const svg = read(assetDirectory + file);
    validatePublishSvg(svg, file);
    assert.doesNotMatch(svg, /<\s*(?:[\w.-]+:)?(?:image|script|foreignObject)\b/i);
    assert.doesNotMatch(svg, /\s(?:on[a-z]+)\s*=|javascript\s*:|data\s*:\s*image/i);
    assert.match(svg, /<title\b/);
    assert.match(svg, /<desc\b/);
  }
  for (const article of editions) {
    assert.deepEqual(sources(article), expectedFigures.map(file => "/images/test-time-forecasting/" + file));
    assert.equal((article.match(/class="article-figure ttf-figure"/g) || []).length, 10);
  }
  assert.match(read("src/styles/global.css"), /figure\.ttf-figure img \{ max-width:480px;/);
});

test("test-time forecasting metadata mathematics references and actual reading time agree", () => {
  for (const text of [...editions, ...projects]) {
    assert.equal(field(text, "slug"), slug);
    assert.equal(field(text, "draft"), "false", "release requires completed scientific and editorial acceptance");
    assert.doesNotMatch(text, /^readingMinutes:/m);
    assert.doesNotMatch(text, /VERIFIED_RESULT_SLOT|RESULT_PENDING|CITATION NEEDED|RESULTS-PENDING|FIGURE-PENDING/i);
    assert.doesNotMatch(text, /[\u0000-\u0009\u000b\u000c\u000e-\u001f]/);
    assert.equal(field(text, "heroImage"), "/images/test-time-forecasting/fig-01.svg");
  }
  assert.equal(field(editions[0], "title"), "Do More Test-Time Steps Make Better Forecasts?");
  assert.equal(field(editions[1], "title"), "多算幾步，就會預測得更準嗎？");
  for (const text of [editions[1], projects[1]]) assert.equal(field(text, "sourceSlug"), slug);
  const publicationDate = field(editions[0], "date");
  assert.match(publicationDate, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
  for (const text of [...editions, ...projects]) {
    assert.equal(field(text, "date"), publicationDate);
    assert.equal(field(text, "lastUpdated"), publicationDate);
  }
  assert.ok(equations(editions[0]).length >= 8);
  assert.deepEqual(equations(editions[0]), equations(editions[1]));
  assert.ok(links(editions[0]).length >= 6);
  assert.deepEqual(links(editions[0]), links(editions[1]));
  for (const article of editions) {
    assert.ok(article.includes("https://arxiv.org/abs/2610.19552v1"));
    assert.ok(article.includes("https://proceedings.mlr.press/v202/von-oswald23a.html"));
    assert.ok(article.includes("https://arxiv.org/abs/1502.03854"));
  }
  const enMinutes = readingTime(body(editions[0])).minutes;
  const zhBody = body(editions[1]);
  const zhMinutes = (zhBody.match(/\p{Script=Han}/gu) || []).length / 450
    + (zhBody.match(/\b[A-Za-z][A-Za-z'-]*\b/g) || []).length / 220;
  for (const [locale, minutes] of [["EN", enMinutes], ["ZH", zhMinutes]])
    assert.ok(minutes >= 22 && minutes <= 30, locale + " actual reading time outside 22–30 minutes: " + minutes);
  for (const [index, locale] of ["en", "zh-Hant"].entries()) {
    const renderedMinutes = readingMinutes({ data: {}, body: body(editions[index]) }, locale);
    assert.ok(renderedMinutes >= 22 && renderedMinutes <= 30, locale + " rendered reader time outside 22–30 minutes: " + renderedMinutes);
  }
});

test("test-time forecasting project has reciprocal navigation without private catalogue leakage", () => {
  for (const [index, prefix] of ["", "/zh"].entries()) {
    assert.ok(editions[index].includes("](" + prefix + "/projects/" + slug + "/)"));
    assert.ok(projects[index].includes("](" + prefix + "/writing/" + slug + "/)"));
    assert.equal(field(projects[index], "featured"), "true");
    assert.equal(field(projects[index], "status"), "Reproducible study");
    for (const flag of ["codeAvailable", "dataAvailable", "studentSuitable"]) assert.equal(field(projects[index], flag), "false");
    assert.doesNotMatch(projects[index], /^repositoryUrl:|^technicalUrl:|^paperUrl:|^teachingUrl:/m);
  }
  for (const text of [...editions, ...projects]) {
    assert.doesNotMatch(text, /[a-f0-9]{40,}|\.venv|ScienceProject|PowerShell|Technical record|Exact reproduction boundary|Claims that remain blocked|The evidence boundary at a glance|\x60{3}/i);
    assert.doesNotMatch(text, /(?:\b[A-Za-z]:[\\/]|file:\/\/)|\]\([^)]*\.(?:zip|docx|xlsx|ipynb|py)(?:\?|\))/i);
  }
  assert.ok(!JSON.parse(read("src/data/generated/science-projects.json")).some(entry => entry.slug === "test-time-forecasting-audit" || entry.slug === slug),
    "the private research directory must not enter the public catalogue-only sync");
});

test("test-time forecasting inline and display mathematics parse safely", () => {
  for (const article of editions) {
    for (const line of article.split("\n"))
      if (line.includes("$$")) assert.equal(line.trim(), "$$", "display delimiters must be on their own lines");
    const display = /^\$\$\s*\n([\s\S]*?)\n\$\$/gm;
    for (const match of article.matchAll(display)) katex.renderToString(match[1], { throwOnError: true, trust: false });
    const prose = article.replace(display, "");
    for (const line of prose.split("\n")) assert.equal((line.match(/\$/g) || []).length % 2, 0, "inline math delimiters must balance");
    for (const match of prose.matchAll(/\$([^$\n]+)\$/g)) katex.renderToString(match[1], { throwOnError: true, trust: false });
  }
});

test("test-time forecasting retains declared budgets and parameter-count distinctions", () => {
  for (const article of editions) {
    for (const number of ["620", "5,000", "3,000", "2,048", "56", "128", "17", "15"])
      assert.ok(article.includes(number), "missing paired protocol value: " + number);
    assert.match(article, /AdamW/);
    assert.match(article, /SOAP/);
    assert.match(article, /1%/);
    assert.match(article, /5%/);
    assert.ok(article.includes("20") && article.includes("84") && article.includes("64"), "sampling-aliasing control must be retained");
  }
});

test("test-time forecasting distinguishes fitting prediction identification and restricted reimplementation", () => {
  assert.match(editions[0], /small-scale independent reimplementation/i);
  assert.match(editions[0], /not (?:a |an )?(?:complete|full|official) (?:code )?reproduction/i);
  assert.match(editions[0], /null.space/i);
  assert.match(editions[0], /unresolved|nonfinite|non-finite/i);
  assert.match(editions[0], /aliasing/i);
  assert.match(editions[0], /held-out system generalisation|held-out system generalization/i);
  assert.match(editions[1], /小規模獨立重實作/);
  assert.match(editions[1], /不是完整重現|不等於完整重現|並非完整重現/);
  assert.match(editions[1], /零空間/);
  assert.match(editions[1], /未決|未能判定|非有限/);
  assert.match(editions[1], /混疊/);
  for (const article of editions) assert.ok(article.includes("unresolved"));
});

test("test-time forecasting paired numbers retain complete failure denominators and initialization-specific contrasts", () => {
  const numbers = ["77,184", "28,761", "62,400", "2,558", "4,608", "92", "6,720", "2,084",
    "0.0692118", "0.0636388", "0.0722670", "0.881126", "0.830133", "0.876996",
    "0.0683804", "0.0207394", "0.0258472", "0.0103202", "0.0796871",
    "0.0381882", "0.0334018", "0.0306020", "0.0183728", "7.9693", "244.0531", "1.1153",
    "0.527004", "0.491229", "0.482726"];
  for (const article of editions) {
    for (const number of numbers) assert.ok(article.includes(number), "missing paired verified result: " + number);
    for (const exact of ["$1.0954\\times10^{-14}$", "$1.6307\\times10^{-5}$", "$3.3437\\times10^{-6}$", "$1.55\\times10^{-15}$"])
      assert.ok(article.includes(exact), "missing paired verified numerical reference: " + exact);
  }
  assert.match(editions[0], /all from random initialization, none from identity or pretrained starts/i);
  assert.match(editions[0], /not clean isolated inference latency/i);
  assert.match(editions[1], /全部來自 random initialization，identity 和 pretrained 都沒有/);
  assert.match(editions[1], /不是乾淨、隔離的推論 latency/);
});

if (process.argv.includes("--built")) test("built test-time forecasting preserves equations captions discoverability and localized Projects", () => {
  for (const [index, prefix] of ["", "zh/"].entries()) {
    const article = read("dist/" + prefix + "writing/" + slug + "/index.html");
    assert.equal((article.match(/<figcaption>/g) || []).length, 10);
    assert.equal((article.match(/class="katex-display"/g) || []).length, equations(editions[index]).length);
    assert.doesNotMatch(article, /katex-error|Draft preview|草稿預覽|VERIFIED_RESULT_SLOT|RESULT_PENDING/);
    for (const src of sources(editions[index])) assert.ok(article.includes(src));
    const project = read("dist/" + prefix + "projects/" + slug + "/index.html");
    assert.doesNotMatch(project, /Technical record|private technical workspace|技術紀錄|私人技術工作區/);
    assert.match(project, /class="ttf-figure"/);
    assert.ok(project.includes("/" + prefix + "writing/" + slug + "/"));
    assert.ok(article.includes("/" + prefix + "projects/" + slug + "/"));
    for (const section of ["writing", "projects"])
      assert.ok(read("dist/" + prefix + section + "/index.html").includes(slug));
  }
  const sitemap = read("dist/sitemap-0.xml");
  for (const prefix of ["", "zh/"]) for (const section of ["writing", "projects"])
    assert.ok(sitemap.includes("https://skckenneth.github.io/" + prefix + section + "/" + slug + "/"));
  // Both current latest-three homepage selections are validated dynamically by the existing homepage gate.
});
