import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { checkResearchArticles } from "../scripts/check-research-articles.mjs";
const root=new URL("../",import.meta.url);
const slug="can-aggregate-observations-bound-an-epidemic";
const read=p=>readFileSync(new URL(p,root),"utf8");
const editions=["writing","writing-zh"].map(c=>read(`src/content/${c}/${slug}.md`));
const projects=["projects","projects-zh"].map(c=>read(`src/content/${c}/${slug}.md`));
const equations=t=>[...t.matchAll(/\$\$\s*([\s\S]*?)\s*\$\$/g)].map(m=>m[1].replace(/\s+/g,""));
const links=t=>[...new Set([...t.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(m=>m[1]))].sort();
test("epidemic study has eight shared accessible vector figures",()=>{
  assert.deepEqual(checkResearchArticles([slug]),[]);
  const assets=readdirSync(new URL("public/images/set-membership-epidemic-bounds/",root));
  assert.equal(assets.length,8);
  for(const f of assets){
    assert.match(f,/\.svg$/);
    const svg=read(`public/images/set-membership-epidemic-bounds/${f}`);
    assert.match(svg,/viewBox="0 0 252 /);assert.match(svg,/Arial/);
    assert.doesNotMatch(svg,/<image\b|<script\b/);
  }
  for(const t of editions){
    assert.match(t,/^draft: false$/m);assert.doesNotMatch(t,/^readingMinutes:/m);
    assert.equal((t.match(/<figure class="epibounds-figure">/g)||[]).length,8);
    assert.doesNotMatch(t,/<!-- (?:RESULTS|FIGURE)-/);
  }
  assert.match(read("src/styles/global.css"),/figure\.epibounds-figure img \{ max-width:480px;/);
});
test("equations, references, experiment counts and limitations align",()=>{
  assert.equal(equations(editions[0]).length,9);
  assert.deepEqual(equations(editions[0]),equations(editions[1]));
  assert.deepEqual(links(editions[0]),links(editions[1]));
  for(const t of editions){
    for(const n of ["1,100","500","2,000","0.36,0.34,0.38,0.33,0.35,0.37","900","1,100","6,000"])
      assert.ok(t.includes(n),n);
    for(const value of ["48.40%","0.951%","94.05%","47.64%","90.03%","92.67%","92.50%","53.06","0.44","1,424.32","1,063.63","5.0 ms","15.7 ms"])
      assert.ok(t.includes(value),value);
    const refs=t.split(/\n## (?:References|參考文獻)\n/)[1];
    assert.equal((refs.match(/^\d+\. /gm)||[]).length,10);
  }
  assert.match(editions[0],/not public-health advice/);
  assert.match(editions[0],/not a proof that the entire dynamical system is unobservable/);
  assert.match(editions[0],/not deterministic enclosures/);
  assert.match(editions[1],/不是公共衞生建議/);
  assert.doesNotMatch(editions[1],/时间|历史|选择|数|减|转|别|图|汇|样|阶|项/);
});
test("personal study connects projects and avoids private instructions",()=>{
  for(const [i,prefix] of ["","/zh"].entries()){
    assert.ok(editions[i].includes(`](${prefix}/projects/${slug}/)`));
    assert.ok(projects[i].includes(`](${prefix}/writing/${slug}/)`));
    for(const flag of ["codeAvailable","dataAvailable","studentSuitable"])
      assert.match(projects[i],new RegExp(`^${flag}: false$`,"m"));
    assert.match(projects[i],/^status: Reproducible study$/m);
    assert.doesNotMatch(projects[i],/^repositoryUrl:|^paperUrl:|^teachingUrl:/m);
  }
  for(const t of [...editions,...projects])assert.doesNotMatch(t,/[a-f0-9]{40,}|\.venv|ScienceProject|PowerShell|Technical record|Exact reproduction boundary|Claims that remain blocked|The evidence boundary at a glance|\x60{3}/i);
});
if(process.argv.includes("--built"))test("six production routes, recommendations and sitemap expose this study",()=>{
  for(const prefix of ["","zh/"]){
    const article=read(`dist/${prefix}writing/${slug}/index.html`);
    assert.equal((article.match(/<figcaption>/g)||[]).length,8);
    assert.equal((article.match(/class="katex-display"/g)||[]).length,9);
    assert.doesNotMatch(article,/katex-error|Draft preview|草稿預覽/);
    const project=read(`dist/${prefix}projects/${slug}/index.html`);
    assert.match(project,/data-status="Reproducible study"/);
    assert.doesNotMatch(project,/Technical record|private technical workspace|技術紀錄|人工審閱|私人技術工作區/);
    for(const path of ["index.html","writing/index.html","projects/index.html"])
      assert.ok(read(`dist/${prefix}${path}`).includes(slug),`${prefix}${path}`);
    const home=read(`dist/${prefix}index.html`);
    for(const section of [/id="latest-writing"[\s\S]*?<\/section>/,/class="home-dossier"[\s\S]*?<\/aside>/])
      assert.ok(home.match(section)?.[0].includes(slug));
  }
  const sitemap=read("dist/sitemap-0.xml");
  for(const prefix of ["","zh/"])for(const type of ["writing","projects"])
    assert.ok(sitemap.includes(`https://skckenneth.github.io/${prefix}${type}/${slug}/`));
});
