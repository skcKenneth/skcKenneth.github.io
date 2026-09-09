import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";
import { checkResearchArticles } from "../scripts/check-research-articles.mjs";

const slug = "when-starting-over-finds-the-target-faster";
const root = new URL("../", import.meta.url);
const editions = ["writing", "writing-zh"].map(collection =>
  readFileSync(new URL(`src/content/${collection}/${slug}.md`, root), "utf8"));
const equations = text => [...text.matchAll(/\$\$\s*([\s\S]*?)\s*\$\$/g)].map(m => m[1].replace(/\s+/g,""));
const citations = text => [...new Set(text.match(/https:\/\/doi\.org\/[^)\s]+/g))].sort();
const numberRows = text => text.split(/\r?\n/).filter(line => /^\| \d/.test(line))
  .map(line => line.match(/\d+(?:\.\d+)?/g));

test("published editions have eight shared accessible vector figures", () => {
  assert.deepEqual(checkResearchArticles([slug]), []);
  for (const text of editions) {
    assert.match(text, /^draft: false$/m);
    assert.doesNotMatch(text, /^readingMinutes:/m);
    assert.equal((text.match(/<figcaption>/g) || []).length,8);
  }
});

test("equations, numeric tables and literature agree in both languages", () => {
  assert.equal(equations(editions[0]).length,21);
  assert.deepEqual(equations(editions[0]),equations(editions[1]));
  assert.deepEqual(numberRows(editions[0]),numberRows(editions[1]));
  assert.deepEqual(citations(editions[0]),citations(editions[1]));
  assert.equal(citations(editions[0]).length,3);
  for (const text of editions) {
    for (const value of ["1,050,000","50,000","1.545443","0.006903","1.544195","0.04018","0.00166","3.864080","22.588180"]) {
      assert.ok(text.includes(value),value);
    }
  }
});

test("displayed analytic optima satisfy the mean formula and stationary condition", () => {
  for (const text of editions) {
    const rows = [...text.matchAll(/^\| (\d+(?:\.\d+)?) \| (\d+\.\d{6}) \| (\d+\.\d{6}) \|$/gm)];
    assert.equal(rows.length,4);
    for (const [,cc,rr,mm] of rows) {
      const c=Number(cc), r=Number(rr), z=Math.sqrt(r), mean=Math.expm1(z)*(1/r+c);
      assert.ok(Math.abs(mean-Number(mm))<1e-6);
      const derivative=Math.exp(z)/(2*z)*(1/r+c)-Math.expm1(z)/(r*r);
      assert.ok(Math.abs(derivative)<3e-6);
    }
  }
});

test("draft previews remain development-only", () => {
  for (const path of ["src/pages/writing/[slug].astro","src/pages/zh/writing/[slug].astro"]) {
    assert.match(readFileSync(new URL(path,root),"utf8"),/!data\.draft \|\| import\.meta\.env\.DEV/);
  }
});

if (process.env.CHECK_BUILT_ARTICLE === "1") {
  test("production output includes both published editions and their discovery links", () => {
    assert.ok(existsSync(new URL("dist/index.html",root)),"build first");
    for (const prefix of ["writing","zh/writing"]) {
      const html = readFileSync(new URL(`dist/${prefix}/${slug}/index.html`,root),"utf8");
      assert.doesNotMatch(html,/Draft preview|草稿預覽|katex-error/);
      assert.equal((html.match(/<figcaption>/g) || []).length,8);
      assert.equal((html.match(/class="katex-display"/g) || []).length,21);
      assert.match(html,/katex-mathml/);
      assert.ok(readFileSync(new URL(`dist/${prefix}/index.html`,root),"utf8").includes(slug));
    }
    assert.ok(readFileSync(new URL("dist/sitemap-0.xml",root),"utf8").includes(slug));
  });
}
