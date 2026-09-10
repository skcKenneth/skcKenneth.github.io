import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { checkResearchArticles } from "../scripts/check-research-articles.mjs";

const root=new URL("../",import.meta.url);
const slug="when-taking-turns-makes-a-system-unstable";
const read=p=>readFileSync(new URL(p,root),"utf8");
const editions=["writing","writing-zh"].map(c=>read(`src/content/${c}/${slug}.md`));
const projects=["projects","projects-zh"].map(c=>read(`src/content/${c}/${slug}.md`));
const equations=t=>[...t.matchAll(/\$\$\s*([\s\S]*?)\s*\$\$/g)].map(m=>m[1].replace(/\s+/g,""));
const links=t=>[...new Set([...t.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(m=>m[1]))].sort();

test("FairChoice editions publish eight shared accessible vector figures",()=>{
  assert.deepEqual(checkResearchArticles([slug]),[]);
  for(const t of editions){
    assert.match(t,/^draft: false$/m);
    assert.doesNotMatch(t,/^readingMinutes:/m);
    assert.equal((t.match(/<figure class="fairchoice-figure">/g)||[]).length,8);
  }
  const assets=readdirSync(new URL("public/images/fairchoice-dynamics/",root));
  assert.equal(assets.length,8);
  for(const f of assets){
    assert.match(f,/\.svg$/);
    const svg=read(`public/images/fairchoice-dynamics/${f}`);
    assert.match(svg,/viewBox="0 0 252 /);
    assert.match(svg,/Arial/);
    assert.doesNotMatch(svg,/<image\b|<script\b|https?:[^"\s]*\.(?:png|jpg)/);
  }
  assert.match(read("src/styles/global.css"),/figure\.fairchoice-figure img \{ max-width:480px;/);
});

test("exact formulas, references and decisive numerical values agree bilingually",()=>{
  assert.equal(equations(editions[0]).length,15);
  assert.deepEqual(equations(editions[0]),equations(editions[1]));
  assert.deepEqual(links(editions[0]),links(editions[1]));
  for(const t of editions){
    for(const n of ["3.75","4.25","0.97159","0.90180","2,520","369,600","1,488","0.5001","6,000","2,000","0.85,0.95,1.05,1.15"])
      assert.ok(t.includes(n),n);
    const refs=t.split(/\n## (?:References|參考文獻)\n/)[1];
    assert.equal((refs.match(/^\d\. /gm)||[]).length,4);
    assert.doesNotMatch(t,/时间|历史|选择/);
  }
});

test("personal synthetic study retains its limits and reciprocal navigation",()=>{
  for(const [i,prefix] of ["","/zh"].entries()){
    assert.ok(editions[i].includes(`](${prefix}/projects/${slug}/)`));
    assert.ok(projects[i].includes(`](${prefix}/writing/${slug}/)`));
    assert.match(projects[i],/^status: Reproducible study$/m);
    assert.match(projects[i],/^codeAvailable: false$/m);
    assert.match(projects[i],/^dataAvailable: false$/m);
    assert.match(projects[i],/^studentSuitable: false$/m);
    assert.doesNotMatch(projects[i],/^repositoryUrl:|^paperUrl:|^teachingUrl:/m);
  }
  assert.match(editions[0],/not a global theorem/);
  assert.match(editions[0],/does not establish that the present construction is new/);
  assert.match(editions[1],/全域/);
  for(const t of [...editions,...projects]){
    assert.doesNotMatch(t,/[a-f0-9]{40,}|\.venv|ScienceProject|PowerShell|Technical record|Exact reproduction boundary|Claims that remain blocked|The evidence boundary at a glance|\x60{3}/i);
    assert.doesNotMatch(t,/\]\([^)]*\.(?:zip|docx|xlsx)(?:\?|\))/i);
  }
});

if(process.argv.includes("--built")){
  test("six production routes expose the article, project and updated homepages",()=>{
    for(const prefix of ["","zh/"]){
      const article=read(`dist/${prefix}writing/${slug}/index.html`);
      assert.equal((article.match(/<figcaption>/g)||[]).length,8);
      assert.equal((article.match(/class="katex-display"/g)||[]).length,15);
      assert.doesNotMatch(article,/katex-error|Draft preview|草稿預覽/);
      const project=read(`dist/${prefix}projects/${slug}/index.html`);
      assert.match(project,/data-status="Reproducible study"/);
      for(const path of ["index.html","writing/index.html","projects/index.html"])
        assert.ok(read(`dist/${prefix}${path}`).includes(slug),`${prefix}${path}`);
    }
    const sitemap=read("dist/sitemap-0.xml");
    for(const prefix of ["","zh/"])for(const type of ["writing","projects"])
      assert.ok(sitemap.includes(`https://skckenneth.github.io/${prefix}${type}/${slug}/`));
  });
}
