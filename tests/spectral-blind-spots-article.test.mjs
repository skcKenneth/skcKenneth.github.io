import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import katex from "katex";
import { checkResearchArticles } from "../scripts/check-research-articles.mjs";
import { validatePublishSvg } from "../scripts/science-sync-policy.mjs";

const root = new URL("../", import.meta.url);
const slug = "two-networks-one-spectrum-different-alarms";
const assetDirectory = "public/images/spectral-blind-spots/";
const read = path => readFileSync(new URL(path, root), "utf8");
const editions = ["writing", "writing-zh"].map(collection => read("src/content/" + collection + "/" + slug + ".md"));
const projects = ["projects", "projects-zh"].map(collection => read("src/content/" + collection + "/" + slug + ".md"));
const field = (text, key) => text.split(/^---\s*$/m)[1]
  .match(new RegExp("^" + key + ":\\s*[\"']?([^\"'\\r\\n]+)", "m"))?.[1]?.trim();
const sources = text => [...text.matchAll(/<figure\b[^>]*>[\s\S]*?<img\b[^>]*src="([^"]+)"[\s\S]*?<\/figure>/g)]
  .map(match => match[1]);
const equations = text => [...text.matchAll(/\$\$\s*([\s\S]*?)\s*\$\$/g)].map(match => match[1].replace(/\s+/g, ""));
const links = text => [...new Set([...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(match => match[1]))].sort();

test("spectral blind-spots release contains ten safe and accessible paired vector figures", () => {
  assert.deepEqual(checkResearchArticles([slug]), []);
  const expected = Array.from({ length: 10 }, (_, index) => "fig-" + String(index + 1).padStart(2, "0") + ".svg");
  assert.deepEqual(readdirSync(new URL(assetDirectory, root)).sort(), expected);
  for (const file of expected) {
    const svg = read(assetDirectory + file);
    validatePublishSvg(svg, file);
    assert.doesNotMatch(svg, /<\s*(?:[\w.-]+:)?(?:image|script|foreignObject)\b/i);
    assert.doesNotMatch(svg, /\s(?:on[a-z]+)\s*=|javascript\s*:|data\s*:\s*image/i);
    assert.match(svg, /<title\b/);
    assert.match(svg, /<desc\b/);
  }
  for (const article of editions) {
    assert.deepEqual(sources(article), expected.map(file => "/images/spectral-blind-spots/" + file));
    assert.equal((article.match(/class="article-figure spectral-blind-spots-figure"/g) || []).length, 10);
  }
  assert.match(read("src/styles/global.css"), /figure\.spectral-blind-spots-figure img \{ max-width:480px;/);
});

test("spectral blind-spots metadata, formulas and primary references agree across editions", () => {
  for (const text of [...editions, ...projects]) {
    assert.equal(field(text, "slug"), slug);
    assert.equal(field(text, "draft"), "false", "release requires completed scientific and editorial acceptance");
    assert.doesNotMatch(text, /^readingMinutes:/m);
    assert.doesNotMatch(text, /VERIFIED_RESULT_SLOT|CITATION NEEDED|RESULTS-PENDING|FIGURE-PENDING/i);
    assert.doesNotMatch(text, /[\u0000-\u0009\u000b\u000c\u000e-\u001f]/);
    assert.equal(field(text, "heroImage"), "/images/spectral-blind-spots/fig-01.svg");
  }
  assert.equal(field(editions[0], "title"), "Two Networks, One Spectrum, Different Alarms");
  assert.equal(field(editions[1], "title"), "兩個網絡，同一組特徵值，不同警報");
  for (const text of [editions[1], projects[1]]) assert.equal(field(text, "sourceSlug"), slug);
  const publicationDate = field(editions[0], "date");
  assert.match(publicationDate, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
  for (const text of [...editions, ...projects]) {
    assert.equal(field(text, "date"), publicationDate);
    assert.equal(field(text, "lastUpdated"), publicationDate);
  }
  assert.ok(equations(editions[0]).length >= 10);
  assert.deepEqual(equations(editions[0]), equations(editions[1]));
  assert.ok(links(editions[0]).length >= 4);
  assert.deepEqual(links(editions[0]), links(editions[1]));
  for (const article of editions) assert.ok(article.includes("https://arxiv.org/abs/2510.19481"));
});

test("spectral project keeps public privacy and reciprocal navigation without a catalogue entry", () => {
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
  assert.ok(!JSON.parse(read("src/data/generated/science-projects.json")).some(entry => entry.slug === slug),
    "the private research directory must not enter the public catalogue-only sync");
});

test("spectral inline and display mathematics parse without escaped-control or nested-dollar damage", () => {
  for (const article of editions) {
    assert.ok(article.includes("$x(t)$"));
    assert.ok(article.includes("$P_A(T)>\\theta$"));
    assert.ok(article.includes("$e^{-dt}F_m(t)$"));
    for (const line of article.split(/\r?\n/))
      if (line.includes("$$")) assert.equal(line.trim(), "$$", "display delimiters must be on their own lines");
    const display = /^\$\$\s*\n([\s\S]*?)\n\$\$/gm;
    for (const match of article.matchAll(display)) katex.renderToString(match[1], { throwOnError: true, trust: false });
    const prose = article.replace(display, "");
    for (const line of prose.split(/\r?\n/)) assert.equal((line.match(/\$/g) || []).length % 2, 0, "inline math delimiters must balance");
    for (const match of prose.matchAll(/\$([^$\n]+)\$/g)) katex.renderToString(match[1], { throwOnError: true, trust: false });
  }
});

test("spectral editions retain the verified counts, certificate fractions and numerical tolerances", () => {
  const numbers = [
    "6,912", "6,740", "2,880", "2,304", "172", "6,473", "3,147", "4,029", "4,284",
    "439", "267", "45.53%", "46.69%", "58.29%", "59.78%", "61.98%", "63.56%",
    "93.65%", "96.04%", "27.38", "13.69", "11.47", "1.00045", "48.50",
    "36.24", "89.45", "7.06",
  ];
  for (const article of editions) {
    for (const number of numbers) assert.ok(article.includes(number), "missing paired scientific value: " + number);
    assert.ok(article.includes("$10^{-9}$"));
    assert.ok(article.includes("$10^{-8}$"));
    assert.ok(article.includes("$7.33\\times10^{-15}$"));
  }
  for (const project of projects) {
    for (const number of ["6,912", "6,740", "2,880", "2,304", "172", "6,473", "267"])
      assert.ok(project.includes(number), "missing project result: " + number);
  }
});

test("spectral article preserves the distinction between classical methods, synthetic amounts and conditional decisions", () => {
  assert.match(editions[0], /not a novel theorem|not a new theorem|not a new research result/i);
  assert.match(editions[0], /not a calibrated|not calibrated/i);
  assert.match(editions[0], /inconclusive|unresolved/i);
  assert.match(editions[0], /vacuity|vacuous/i);
  assert.match(editions[1], /不是新定理|不是新的研究/);
  assert.match(editions[1], /不是經過校準|不是經校準/);
  assert.match(editions[1], /空泛/);
  for (const article of editions) {
    assert.ok(article.includes("/writing/positive-conservative-time-stepping/"));
    assert.ok(article.includes("/writing/from-simulation-to-certificate/"));
  }
});

if (process.argv.includes("--built")) test("built spectral articles and projects preserve mathematics, captions and discoverability", () => {
  for (const [index, prefix] of ["", "zh/"].entries()) {
    const article = read("dist/" + prefix + "writing/" + slug + "/index.html");
    assert.equal((article.match(/<figcaption>/g) || []).length, 10);
    assert.equal((article.match(/class="katex-display"/g) || []).length, equations(editions[index]).length);
    assert.doesNotMatch(article, /katex-error|Draft preview|草稿預覽|VERIFIED_RESULT_SLOT/);
    for (const src of sources(editions[index])) assert.ok(article.includes(src));
    const project = read("dist/" + prefix + "projects/" + slug + "/index.html");
    assert.doesNotMatch(project, /Technical record|private technical workspace|技術紀錄|私人技術工作區/);
    assert.match(project, /class="spectral-blind-spots-figure"/);
    assert.ok(project.includes("/" + prefix + "writing/" + slug + "/"));
    assert.ok(article.includes("/" + prefix + "projects/" + slug + "/"));
    for (const section of ["writing", "projects"])
      assert.ok(read("dist/" + prefix + section + "/index.html").includes(slug));
  }
  const sitemap = read("dist/sitemap-0.xml");
  for (const prefix of ["", "zh/"]) for (const section of ["writing", "projects"])
    assert.ok(sitemap.includes("https://skckenneth.github.io/" + prefix + section + "/" + slug + "/"));
  // The existing dynamic homepage gate validates both current latest-three placements.
});
