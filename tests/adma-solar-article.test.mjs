import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { checkResearchArticles } from "../scripts/check-research-articles.mjs";

const root = new URL("../", import.meta.url);
const slug = "when-solar-power-changes-fast";
const read = path => readFileSync(new URL(path, root), "utf8");
const editions = ["writing", "writing-zh"].map(c => read(`src/content/${c}/${slug}.md`));
const projects = ["projects", "projects-zh"].map(c => read(`src/content/${c}/${slug}.md`));
const teaching = ["teaching", "teaching-zh"].map(c => read(`src/content/${c}/student-research-studio.md`));
const equations = text => [...text.matchAll(/\$\$\s*([\s\S]*?)\s*\$\$/g)].map(m => m[1].replace(/\s+/g,""));
const externalLinks = text => [...new Set([...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(m => m[1]))].sort();
const numericTableRows = text => text.split(/\r?\n/).filter(l => /^\| \d/.test(l)).map(l => l.match(/-?\d+(?:\.\d+)?/g));

test("ADMA has two published editions and eight accessible shared SVGs", () => {
  assert.deepEqual(checkResearchArticles([slug]), []);
  for (const text of editions) {
    assert.match(text,/^draft: false$/m);
    assert.doesNotMatch(text,/^readingMinutes:/m);
  }
  assert.equal(readdirSync(new URL("public/images/adma-solar-intervals/",root)).length,8);
  assert.ok(readdirSync(new URL("public/images/adma-solar-intervals/",root)).every(f => f.endsWith(".svg")));
  for (const filename of readdirSync(new URL("public/images/adma-solar-intervals/",root))) {
    const svg = read(`public/images/adma-solar-intervals/${filename}`);
    const families = [...svg.matchAll(/font-family:\s*([^;"<>]+)/g)].map(m => m[1]);
    assert.ok(families.length > 0);
    assert.ok(families.every(family => family.includes("Arial") && family.includes("sans-serif")), filename);
  }
});

test("equations, comparison rows and eight references align", () => {
  assert.equal(equations(editions[0]).length,9);
  assert.deepEqual(equations(editions[0]),equations(editions[1]));
  assert.deepEqual(numericTableRows(editions[0]),numericTableRows(editions[1]));
  assert.equal(numericTableRows(editions[0]).length,6);
  assert.deepEqual(externalLinks(editions[0]),externalLinks(editions[1]));
  for (const text of editions) {
    const referenceSection=text.split(/\n## (?:References|參考文獻)\n/)[1];
    assert.ok(referenceSection);
    assert.equal((referenceSection.match(/^\d\. /gm)||[]).length,8);
    for (const value of ["0.110","0.080","0.430","0.363","0.470","0.537","0.040","0.253","0.175",
      "110,425","110,302","110,043","108,954","1,348","4,189","3,767","614","12,928","8,269","3,946","24,267","13,718","6,903"]) {
      assert.ok(text.includes(value),value);
    }
  }
});

test("coverage arithmetic and permissive floor remain correctly distinguished", () => {
  assert.equal((86/183).toFixed(3),"0.470");
  assert.equal((124/231).toFixed(3),"0.537");
  assert.equal((.9-86/183).toFixed(3),"0.430");
  assert.equal((.9-124/231).toFixed(3),"0.363");
  assert.equal((.9-.1).toFixed(2),"0.80");
  assert.equal(5*4*2,40);
  assert.equal(5*4*2*4*2,320);
  assert.match(editions[0],/not nearest-neighbour calibration/);
  assert.match(editions[1],/不是近鄰校準/);
  assert.match(editions[0],/No deployable candidate meets the absolute criterion/);
  assert.match(editions[1],/所有可部署候選，都沒有符合絕對可靠性準則/);
});

test("Accepted is a distinct schema value with a Traditional Chinese badge", () => {
  const schema=read("src/content.config.ts");
  const values=[...schema.match(/const status = z.enum\(\[([\s\S]+?)\]\)/)[1].matchAll(/"([^"]+)"/g)].map(m=>m[1]);
  for (const status of ["Submitted","Accepted","Published","Teaching case"]) assert.ok(values.includes(status));
  assert.equal(values.filter(s=>s==="Accepted").length,1);
  assert.match(read("src/components/StatusBadge.astro"),/"Accepted": "已接納"/);
  for (const text of projects) assert.match(text,/^status: Accepted$/m);
});

test("author order, acceptance scope and reciprocal links survive integration", () => {
  for (const text of [...editions,...projects,...teaching]) {
    const indices=["Hong U Lo","Zibo Gao","Peng Chi Lam","Sok Kin Cheng"].map(name=>text.indexOf(name));
    assert.ok(indices.every(i=>i>=0));
    assert.deepEqual(indices,[...indices].sort((a,b)=>a-b));
    assert.match(text,/Short Paper/);
    assert.match(text,/camera-ready/);
    assert.doesNotMatch(text,/Full Paper/);
    assert.ok(text.includes(slug));
  }
  for (const [i,prefix] of ["","/zh"].entries()) {
    assert.ok(editions[i].includes(`](${prefix}/projects/${slug}/)`));
    assert.ok(projects[i].includes(`](${prefix}/writing/${slug}/)`));
    assert.ok(teaching[i].includes(`](${prefix}/writing/${slug}/)`));
    assert.ok(teaching[i].includes("AI4Nature@AVSS 2026"));
  }
});

test("public prose excludes private package material and administrative downloads", () => {
  for (const text of [...editions,...projects]) {
    const prose=text.replace(/https:\/\/[^\s)]+/g,"");
    assert.doesNotMatch(prose,/[a-f0-9]{40,}|\.venv|ScienceProject|PowerShell|Technical record|Exact reproduction boundary|Claims that remain blocked|The evidence boundary at a glance/i);
    assert.doesNotMatch(text,/\]\([^)]*\.(?:pdf|zip|docx|xlsx)(?:\?|\))/i);
    assert.doesNotMatch(text,/[A-Z]:\\|@gmail\.com|@cdsj5\.edu\.mo|LTP|CMT screenshot/i);
  }
});

if (process.argv.includes("--built")) {
  test("six production pages include correct publication and navigation state", () => {
    for (const prefix of ["","zh/"]) {
      const article=read(`dist/${prefix}writing/${slug}/index.html`);
      assert.equal((article.match(/<figcaption>/g)||[]).length,8);
      assert.equal((article.match(/class="katex-display"/g)||[]).length,9);
      assert.doesNotMatch(article,/katex-error|Draft preview|草稿預覽/);
      const project=read(`dist/${prefix}projects/${slug}/index.html`);
      assert.match(project,/data-status="Accepted"/);
      assert.ok(project.includes(prefix ? "已接納" : "Accepted"));
      assert.ok(read(`dist/${prefix}teaching/student-research-studio/index.html`).includes(slug));
      assert.ok(read(`dist/${prefix}writing/index.html`).includes(slug));
      assert.ok(read(`dist/${prefix}projects/index.html`).includes(slug));
    }
    const sitemap=read("dist/sitemap-0.xml");
    for(const path of [`writing/${slug}/`,`projects/${slug}/`,`teaching/student-research-studio/`]) {
      for(const prefix of ["","zh/"]) assert.ok(sitemap.includes(`https://skckenneth.github.io/${prefix}${path}`));
    }
  });
}
