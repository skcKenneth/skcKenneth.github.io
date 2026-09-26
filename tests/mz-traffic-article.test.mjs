import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { checkResearchArticles } from "../scripts/check-research-articles.mjs";
import { validatePublishSvg } from "../scripts/science-sync-policy.mjs";

const root = new URL("../", import.meta.url);
const slug = "what-must-a-traffic-model-remember";
const assetDirectory = "public/images/mori-zwanzig-traffic-memory/";
const read = path => readFileSync(new URL(path, root), "utf8");
const editions = ["writing", "writing-zh"].map(collection => read(`src/content/${collection}/${slug}.md`));
const projects = ["projects", "projects-zh"].map(collection => read(`src/content/${collection}/${slug}.md`));
const field = (text, key) => text.split(/^---\s*$/m)[1]
  .match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+)`, "m"))?.[1]?.trim();
const sources = text => [...text.matchAll(/<figure\b[^>]*>[\s\S]*?<img\b[^>]*src="([^"]+)"[\s\S]*?<\/figure>/g)]
  .map(match => match[1]);
const equations = text => [...text.matchAll(/\$\$\s*([\s\S]*?)\s*\$\$/g)]
  .map(match => match[1].replace(/\s+/g, ""));
const links = text => [...new Set([...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)]
  .map(match => match[1]))].sort();

test("traffic-memory editions share ten accessible vector figures", () => {
  assert.deepEqual(checkResearchArticles([slug]), []);
  const assets = readdirSync(new URL(assetDirectory, root));
  assert.equal(assets.length, 10);
  for (const file of assets) {
    assert.match(file, /^[a-z0-9][a-z0-9_-]*\.svg$/);
    const svg = read(assetDirectory + file);
    validatePublishSvg(svg, file);
    assert.doesNotMatch(svg, /<\s*(?:[\w.-]+:)?(?:image|script|foreignObject)\b/i,
      `${file}: public figures must remain vector-only and script-free`);
    assert.doesNotMatch(svg, /\s(?:on[a-z]+)\s*=|javascript\s*:|data\s*:\s*image/i);
  }
  const expected = assets.map(file => "/images/mori-zwanzig-traffic-memory/" + file).sort();
  for (const article of editions) assert.deepEqual([...sources(article)].sort(), expected);
  assert.deepEqual(sources(editions[0]), sources(editions[1]));
});

test("paired traffic-memory metadata, equations and references agree", () => {
  for (const text of [...editions, ...projects]) {
    assert.equal(field(text, "slug"), slug);
    assert.ok(field(text, "title")?.length >= 10, "a substantive title is required");
    assert.equal(field(text, "draft"), "false");
    assert.doesNotMatch(text, /^readingMinutes:/m);
    assert.doesNotMatch(text, /<!--\s*(?:RESULTS|FIGURE)-/i);
    assert.ok(sources(editions[0]).includes(field(text, "heroImage")), "hero must be an article figure");
  }
  for (const text of [editions[1], projects[1]]) {
    assert.equal(field(text, "sourceSlug"), slug);
    assert.match(field(text, "title"), /\p{Script=Han}/u);
  }
  assert.equal(field(editions[0], "date"), field(editions[1], "date"));
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(field(editions[0], "date")), "paired publication date is required");
  assert.equal(field(editions[0], "heroImage"), field(editions[1], "heroImage"));
  assert.ok(equations(editions[0]).length > 0, "the mathematical explanation needs rendered equations");
  assert.deepEqual(equations(editions[0]), equations(editions[1]));
  assert.ok(links(editions[0]).length > 0, "verified references are required");
  assert.deepEqual(links(editions[0]), links(editions[1]));
});

test("traffic-memory pages retain public privacy and reciprocal navigation", () => {
  for (const [index, prefix] of ["", "/zh"].entries()) {
    assert.ok(editions[index].includes(`](${prefix}/projects/${slug}/)`));
    assert.ok(projects[index].includes(`](${prefix}/writing/${slug}/)`));
    for (const flag of ["codeAvailable", "dataAvailable", "studentSuitable"])
      assert.equal(field(projects[index], flag), "false");
    assert.doesNotMatch(projects[index], /^repositoryUrl:|^technicalUrl:|^paperUrl:|^teachingUrl:/m);
  }
  for (const text of [...editions, ...projects]) {
    assert.doesNotMatch(text, /[a-f0-9]{40,}|\.venv|ScienceProject|PowerShell|Technical record|Exact reproduction boundary|Claims that remain blocked|The evidence boundary at a glance|\x60{3}/i);
    assert.doesNotMatch(text, /(?:\b[A-Za-z]:[\\/]|file:\/\/)|\]\([^)]*\.(?:zip|docx|xlsx|ipynb|py)(?:\?|\))/i);
  }
});

if (process.argv.includes("--built")) test("built traffic-memory pages preserve figures, navigation and discoverability", () => {
  for (const [index, prefix] of ["", "zh/"].entries()) {
    const article = read(`dist/${prefix}writing/${slug}/index.html`);
    assert.equal((article.match(/<figcaption>/g) || []).length, 10);
    assert.equal((article.match(/class="katex-display"/g) || []).length, equations(editions[index]).length);
    assert.doesNotMatch(article, /katex-error|Draft preview|草稿預覽/);
    for (const src of sources(editions[index])) assert.ok(article.includes(src));
    const project = read(`dist/${prefix}projects/${slug}/index.html`);
    assert.ok(project.includes(`/${prefix}writing/${slug}/`));
    assert.ok(article.includes(`/${prefix}projects/${slug}/`));
    for (const path of ["writing/index.html", "projects/index.html"])
      assert.ok(read(`dist/${prefix}${path}`).includes(slug));
  }
  const sitemap = read("dist/sitemap-0.xml");
  for (const prefix of ["", "zh/"]) for (const type of ["writing", "projects"])
    assert.ok(sitemap.includes(`https://skckenneth.github.io/${prefix}${type}/${slug}/`));
  // tests/homepage-publication.test.mjs checks both current recommendation slots dynamically.
});
