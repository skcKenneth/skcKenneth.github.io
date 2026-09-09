import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";

const slug = "when-early-warnings-cannot-tell-the-difference";
const root = new URL("../", import.meta.url);
const editions = ["writing", "writing-zh"].map(collection =>
  readFileSync(new URL("src/content/" + collection + "/" + slug + ".md", root), "utf8"));
const equations = text => [...text.matchAll(/\$\$\s*([\s\S]*?)\s*\$\$/g)]
  .map(match => match[1].replace(/\s+/g, ""));
const images = text => [...text.matchAll(/<img[^>]*src="([^"]+)"/g)].map(match => match[1]);
const citations = text => [...new Set(text.match(/https:\/\/(?:doi\.org|arxiv\.org)\/[^)\s]+/g))].sort();

test("published editions use actual reading time and no private reproduction material", () => {
  for (const text of editions) {
    assert.match(text, /^draft: false$/m);
    assert.doesNotMatch(text, /^readingMinutes:/m);
    assert.doesNotMatch(text, /Exact reproduction boundary|Technical record|\.venv|config.hash|HUMAN_REVIEW_REQUIRED|C:\\|ScienceProject\/|\x60{3}/i);
    assert.equal((text.match(/<figcaption>/g) || []).length, 5);
  }
});

test("all displayed equations and literature links align between languages", () => {
  assert.equal(equations(editions[0]).length, 21);
  assert.deepEqual(equations(editions[0]), equations(editions[1]));
  assert.deepEqual(citations(editions[0]), citations(editions[1]));
  for (const text of editions) {
    assert.match(text, /\+\s*\\frac\{2\}\{N\^2\}/);
    assert.match(text, /C_X\(\\tau\)=v_X\\rho_X\(\\tau\)/);
  }
});

test("both numerical tables agree with independently evaluated analytic formulas", () => {
  for (const text of editions) {
    const rows = [...text.matchAll(/^\| (\d+\.\d+) \| (\d+\.\d+) \| (\d+\.\d+) \|$/gm)];
    assert.equal(rows.length, 5);
    for (const [, label, variance, ac1] of rows) {
      const k = Number(label), a = 1, q = 0.2, dt = 0.25;
      const v = q * q / (2 * a * k * (a + k));
      const ac = k === a ? (1 + k * dt) * Math.exp(-k * dt)
        : (a * Math.exp(-k * dt) - k * Math.exp(-a * dt)) / (a - k);
      assert.equal(variance, v.toFixed(6));
      assert.equal(ac1, ac.toFixed(6));
    }
    for (const value of ["0.182640", "0.181439", "0.001239", "0.001207",
      "0.174160", "0.175033", "0.173840", "511.75"]) assert.ok(text.includes(value), value);
  }
});

test("five local vector figures are shared with localized accessible descriptions", () => {
  assert.deepEqual(images(editions[0]), images(editions[1]));
  assert.equal(new Set(images(editions[0])).size, 5);
  for (const text of editions) {
    for (const img of text.matchAll(/<img[^>]+>/g)) assert.match(img[0], /alt="[^"]{30,}"/);
  }
  for (const path of images(editions[0])) {
    const svg = readFileSync(new URL("public" + path, root), "utf8");
    assert.match(svg, /<svg/);
    assert.match(svg, /<title/);
    assert.match(svg, /<desc/);
    assert.doesNotMatch(svg, /<script|<foreignObject/i);
  }
});

test("draft preview inclusion is explicitly development-only", () => {
  for (const path of ["src/pages/writing/[slug].astro", "src/pages/zh/writing/[slug].astro"]) {
    const source = readFileSync(new URL(path, root), "utf8");
    assert.match(source, /!data\.draft \|\| import\.meta\.env\.DEV/);
  }
});

if (process.env.CHECK_BUILT_ARTICLE === "1") {
  test("production output includes both published article routes", () => {
    assert.ok(existsSync(new URL("dist/index.html", root)), "build first");
    for (const prefix of ["writing", "zh/writing"]) {
      const html = readFileSync(new URL("dist/" + prefix + "/" + slug + "/index.html", root), "utf8");
      assert.doesNotMatch(html, /Draft preview|草稿預覽|katex-error/);
      assert.equal((html.match(/<figcaption>/g) || []).length, 5);
      assert.match(html, /katex-mathml/);
    }
    for (const path of ["dist/writing/index.html", "dist/zh/writing/index.html", "dist/sitemap-0.xml"]) {
      assert.ok(readFileSync(new URL(path, root), "utf8").includes(slug), path);
    }
  });
}
