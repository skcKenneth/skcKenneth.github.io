import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { checkResearchArticles } from "../scripts/check-research-articles.mjs";
const root=new URL("../",import.meta.url);
const slug="did-the-hotspot-move-or-did-it-grow";
const read=p=>readFileSync(new URL(p,root),"utf8");
const editions=["writing","writing-zh"].map(c=>read("src/content/"+c+"/"+slug+".md"));
const projects=["projects","projects-zh"].map(c=>read("src/content/"+c+"/"+slug+".md"));
const equations=t=>[...t.matchAll(/\$\$\s*([\s\S]*?)\s*\$\$/g)].map(m=>m[1].replace(/\s+/g,""));
const links=t=>[...new Set([...t.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(m=>m[1]))].sort();

test("UOT editions share eight accessible safe vector figures",()=>{
  assert.deepEqual(checkResearchArticles([slug]),[]);
  const assets=readdirSync(new URL("public/images/uot-move-or-grow/",root));
  assert.equal(assets.length,8);
  for(const file of assets){
    assert.match(file,/\.svg$/);
    const svg=read("public/images/uot-move-or-grow/"+file);
    assert.match(svg,/viewBox="0 0 252 /);assert.match(svg,/Arial/);
    assert.ok(!/<image\b|<script\b/.test(svg),file+" must be vector-only and script-free");
  }
  for(const article of editions){
    assert.equal((article.match(/<figure class="uot-figure">/g)||[]).length,8);
    assert.match(article,/^draft: false$/m);
    assert.doesNotMatch(article,/^readingMinutes:|\\\(|\\\)/m);
  }
  assert.match(read("src/styles/global.css"),/figure\.uot-figure img \{ max-width:480px;/);
});

test("equations, numerical conclusions and references align",()=>{
  assert.equal(equations(editions[0]).length,10);
  assert.deepEqual(equations(editions[0]),equations(editions[1]));
  assert.deepEqual(links(editions[0]),links(editions[1]));
  for(const article of editions){
    for(const value of ["4,320","180","256","7,200","4,248","540","20,000",
      "62.50%","29.17%","99.29%","69.73%","15.66%","3.565%","89.14%",
      "0.50027","10.74 ms","10.99 ms","1,392","221","257","112","360"]){
      assert.ok(article.includes(value),value);
    }
    const refs=article.split(/\n## (?:References|參考文獻)\n/)[1];
    assert.equal((refs.match(/^\d+\. /gm)||[]).length,14);
    assert.match(refs,/WFR-FM: Simulation-Free Dynamic Unbalanced Optimal Transport/);
    assert.match(refs,/WFR-MFM: One-Step Inference for Dynamic Unbalanced Optimal Transport/);
    assert.match(refs,/Isobe, N\./);
  }
  assert.match(editions[0],/not exactly the dynamic Wasserstein–Fisher–Rao problem/);
  assert.match(editions[0],/not an estimator-error theorem for a common target/);
  assert.match(editions[0],/not 4,320 independent observations/);
  assert.match(editions[1],/不是對真實動態作用量的直接量測/);
  assert.match(editions[1],/粗網格例外仍保留/);
  assert.doesNotMatch(editions[1],/时间|历史|选择|数|减|转|别|图|汇|样|阶|项|设|输|这|条|没|读/);
});

test("personal study links projects without private reproduction instructions",()=>{
  for(const [i,prefix] of ["","/zh"].entries()){
    assert.ok(editions[i].includes("]("+prefix+"/projects/"+slug+"/)"));
    assert.ok(projects[i].includes("]("+prefix+"/writing/"+slug+"/)"));
    for(const flag of ["codeAvailable","dataAvailable","studentSuitable"])
      assert.match(projects[i],new RegExp("^"+flag+": false$","m"));
    assert.match(projects[i],/^status: Reproducible study$/m);
  }
  for(const text of [...editions,...projects])
    assert.doesNotMatch(text,/[a-f0-9]{40,}|\.venv|ScienceProject|PowerShell|Technical record|Exact reproduction boundary|Claims that remain blocked|The evidence boundary at a glance|\x60{3}/i);
});

if(process.argv.includes("--built"))test("built articles, projects, persistent lists and sitemap expose the study",()=>{
  for(const prefix of ["","zh/"]){
    const article=read("dist/"+prefix+"writing/"+slug+"/index.html");
    assert.equal((article.match(/<figcaption>/g)||[]).length,8);
    assert.equal((article.match(/class="katex-display"/g)||[]).length,10);
    assert.doesNotMatch(article,/katex-error|Draft preview|草稿預覽/);
    const project=read("dist/"+prefix+"projects/"+slug+"/index.html");
    assert.match(project,/data-status="Reproducible study"/);
    // Homepage membership changes with publication dates and is checked dynamically.
    for(const path of ["writing/index.html","projects/index.html"])
      assert.ok(read("dist/"+prefix+path).includes(slug),prefix+path);
  }
  const sitemap=read("dist/sitemap-0.xml");
  for(const prefix of ["","zh/"])for(const type of ["writing","projects"])
    assert.ok(sitemap.includes("https://skckenneth.github.io/"+prefix+type+"/"+slug+"/"));
});
