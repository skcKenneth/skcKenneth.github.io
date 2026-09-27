import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { selectLatestWriting } from "../src/lib/latest-writing.mjs";
import { validatePublishSvg } from "../scripts/science-sync-policy.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const slug = "cut-audit-er";
const deferredWritingSlug = "when-the-highest-score-is-not-the-best-repair";
const hero = "/images/cut-audit-er/four-node-choice.svg";
const repository = "https://github.com/skcKenneth/cut-audit-er";
const read = path => readFileSync(join(root, path), "utf8");
const editions = ["projects", "projects-zh"].map(collection => read(`src/content/${collection}/${slug}.md`));
const field = (text, name) => text.split(/^---\s*$/m)[1]
  .match(new RegExp(`^${name}:\\s*["']?([^"'\\r\\n]+)`, "m"))?.[1]?.trim();
const externalLinks = text => [...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(match => match[1]);
const plainText = html => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function inventory(collection) {
  function visit(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap(item => {
      const path = join(directory, item.name);
      if (item.isDirectory()) return visit(path);
      if (!/\.mdx?$/.test(item.name)) return [];
      const text = readFileSync(path, "utf8");
      const date = field(text, "date");
      const updated = field(text, "lastUpdated");
      return [{ data: {
        slug: field(text, "slug"), sourceSlug: field(text, "sourceSlug"),
        title: field(text, "title"), date: date ? new Date(date) : undefined,
        lastUpdated: updated ? new Date(updated) : undefined,
        year: Number(field(text, "year")), featured: field(text, "featured") === "true",
        draft: field(text, "draft") === "true", archived: field(text, "archived") === "true"
      } }];
    });
  }
  return visit(join(root, "src/content", collection));
}

// Mirror the existing homepage policy, without permanently pinning CUT in a slot.
function selectedProjects(collection) {
  return inventory(collection).filter(({ data }) => data.featured && !data.draft)
    .sort((a, b) => b.data.lastUpdated.valueOf() - a.data.lastUpdated.valueOf()
      || b.data.year - a.data.year
      || (a.data.title < b.data.title ? -1 : a.data.title > b.data.title ? 1 : 0))
    .slice(0, 3);
}

function section(html, attribute, value) {
  const found = html.match(new RegExp(`<section\\b[^>]*${attribute}="${value}"[^>]*>([\\s\\S]*?)<\\/section>`));
  assert.ok(found, `missing ${attribute}=${value} section`);
  return found[1];
}

function cardFor(html, href) {
  const cards = [...html.matchAll(/<article\b[^>]*data-project-card[^>]*>[\s\S]*?<\/article>/g)]
    .map(match => match[0]);
  const found = cards.filter(card => card.includes(`href="${href}"`));
  assert.equal(found.length, 1, `expected one project card for ${href}`);
  return found[0];
}

test("CUT stage one has paired, public, in-preparation project metadata", () => {
  for (const text of editions) {
    assert.equal(field(text, "slug"), slug);
    assert.equal(field(text, "status"), "Manuscript in preparation");
    assert.equal(field(text, "featured"), "true");
    assert.equal(field(text, "draft"), "false");
    assert.equal(field(text, "codeAvailable"), "true");
    assert.equal(field(text, "studentSuitable"), "false");
    assert.equal(field(text, "repositoryUrl"), repository);
    assert.equal(field(text, "heroImage"), hero);
    assert.ok(field(text, "title")?.length > 12);
    assert.match(field(text, "lastUpdated"), /^\d{4}-\d{2}-\d{2}$/);
    assert.doesNotMatch(text, /^readingMinutes:|^paperUrl:|^teachingUrl:/m);
  }
  assert.equal(field(editions[1], "sourceSlug"), slug);
  assert.match(field(editions[1], "title"), /\p{Script=Han}/u);
  assert.equal(field(editions[0], "lastUpdated"), field(editions[1], "lastUpdated"));
  assert.equal(field(editions[0], "year"), field(editions[1], "year"));
});

test("CUT overview distinguishes public resources from deferred manuscript publication", () => {
  for (const text of editions) {
    const links = externalLinks(text);
    assert.ok(links.includes(repository), "body must provide the public source repository");
    const study = links.find(link => /^https:\/\/skckenneth\.github\.io\/cut-audit-er\//i.test(link));
    assert.ok(study, "body must provide the public research website");
    assert.match(text, /ACIIDS 2027/);
    assert.doesNotMatch(text, /[a-f0-9]{40,}|\.venv|ScienceProject|PowerShell|Technical record|Exact reproduction boundary|Claims that remain blocked|\x60{3}/i);
    assert.doesNotMatch(text, /(?:\b[A-Za-z]:[\\/]|file:\/\/)|\]\([^)]*\.(?:pdf|zip|docx|xlsx|ipynb|py)(?:\?|\))/i);
    assert.doesNotMatch(text, /\]\([^)]*\/writing\/(?:cut-audit-er|when-the-highest-score-is-not-the-best-repair)\//);
  }
  assert.match(editions[0], /(?:planned|intended|target|prepar)[\s\S]{0,100}ACIIDS 2027|ACIIDS 2027[\s\S]{0,100}(?:planned|intended|target|prepar)/i);
  assert.match(editions[1], /(?:擬|準備|計劃|目標)[\s\S]{0,60}ACIIDS 2027|ACIIDS 2027[\s\S]{0,60}(?:擬|準備|計劃|目標)/);
});

test("the four-node cover is accessible, self-contained vector artwork", () => {
  const svg = read(`public${hero}`);
  validatePublishSvg(svg, hero);
  assert.match(svg, /viewBox\s*=/);
  assert.match(svg, /<text\b/, "labels must remain text, not inaccessible path outlines");
  assert.match(svg, /(?:fill[\s:=]+["']?\s*(?:#fff(?:fff)?|white)|background(?:-color)?\s*:\s*(?:#fff(?:fff)?|white))/i,
    "white figure background must be explicit");
  assert.match(svg, /stroke-dasharray/, "line style must supplement colour");
  assert.doesNotMatch(svg, /<\s*(?:[\w.-]+:)?(?:image|feImage|script|foreignObject|iframe|object|embed)\b/i);
  assert.doesNotMatch(svg, /\s(?:on[a-z]+)\s*=|javascript\s*:|data\s*:\s*image/i);
  assert.doesNotMatch(svg, /@import\b|<!ENTITY\b|url\(\s*["']?(?!#)[a-z][a-z0-9+.-]*:/i);
  assert.doesNotMatch(svg, /(?:xlink:)?href\s*=\s*["'](?!#)/i,
    "figure references must not fetch external assets or execute links");
});

test("the stage-one project does not publish or displace a Writing article", () => {
  const latest = [];
  for (const collection of ["writing", "writing-zh"]) {
    const entries = inventory(collection);
    assert.ok(!entries.some(({ data }) => [slug, deferredWritingSlug].includes(data.slug)),
      "the long-form article is reserved for verified submission, not stage one");
    latest.push(selectLatestWriting(entries).map(({ data }) => data.sourceSlug ?? data.slug));
  }
  assert.deepEqual(latest[0], latest[1]);
  assert.equal(latest[0].length, 3);
  const home = read("src/components/HomePage.astro");
  assert.match(home, /const writing = selectLatestWriting\(writingCollection\)/);
  assert.doesNotMatch(home, /cut-audit-er|when-the-highest-score-is-not-the-best-repair/,
    "CUT participates through ordinary collection metadata, not a hard-coded homepage slot");
  assert.match(home, /data\.featured && !data\.draft/);
  assert.match(home, /b\.data\.lastUpdated\.valueOf\(\) - a\.data\.lastUpdated\.valueOf\(\)/);
});

if (process.argv.includes("--built")) {
  test("six built stage-one routes preserve public links, status, figures and homepage policies", () => {
    for (const [index, prefix] of ["", "zh/"].entries()) {
      const isZh = index === 1;
      const href = `/${prefix}projects/${slug}/`;
      const project = read(`dist/${prefix}projects/${slug}/index.html`);
      const catalogue = read(`dist/${prefix}projects/index.html`);
      const home = read(`dist/${prefix}index.html`);
      const statusLabel = isZh ? "論文撰寫中" : "Manuscript in preparation";
      assert.match(project, /data-status="Manuscript in preparation"/);
      assert.ok(project.includes(statusLabel));
      assert.match(project, /data-evidence-scope/);
      assert.ok(project.includes(isZh ? "公開研究程式庫" : "Public research repository"));
      assert.doesNotMatch(project, /Technical research records are maintained privately|技術研究紀錄存放於私人工作區/);
      assert.ok(project.includes(`href="${repository}"`));
      for (const link of externalLinks(editions[index])) assert.ok(project.includes(`href="${link}"`), link);
      assert.doesNotMatch(project, /Private technical record|私人技術紀錄|<h2[^>]*>Technical record|<h2[^>]*>技術紀錄|Detailed source, calculations, generated figures, and reproduction instructions are maintained in a private|詳細程式、計算、生成圖像及重現說明存放於私人/);
      assert.doesNotMatch(project, /katex-error|Draft preview|草稿預覽/);

      const figures = [...project.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/g)]
        .map(match => match[0]).filter(figure => figure.includes(`src="${hero}"`));
      assert.equal(figures.length, 1, "the project must have one semantic, captioned cover");
      const alt = figures[0].match(/<img\b[^>]*\balt="([^"]+)"/)?.[1];
      const caption = plainText(figures[0].match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/)?.[1] ?? "");
      assert.ok(alt?.length >= 30, "cover alt text must explain the comparison");
      assert.ok(caption.length >= 60, "caption must explain the constructed example independently");
      assert.match(alt, isZh ? /\p{Script=Han}/u : /(?:four|node|score|gain|repair)/i);
      assert.match(caption, isZh ? /構造|構建|合成|示意/ : /construct|synthetic|schematic/i);
      assert.doesNotMatch(caption, /synchronized from the private|由私人技術工作區同步/i);

      const projectCard = cardFor(catalogue, href);
      assert.ok(projectCard.includes(`src="${hero}"`));
      assert.ok(projectCard.includes(statusLabel));
      assert.match(projectCard, /data-code="true"/);
      assert.match(projectCard, /data-evidence-scope/);
      assert.match(projectCard, /<img\b[^>]*style="height:\s*auto"/,
        "CUT cover height must scale with its card instead of retaining the 500px attribute");
      const selected = section(home, "class", "home-selected");
      const expected = selectedProjects(isZh ? "projects-zh" : "projects")
        .map(({ data }) => `/${prefix}projects/${data.slug}/`);
      const actual = [...selected.matchAll(/<h3\b[^>]*>\s*<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]);
      assert.deepEqual(actual, expected);
      if (expected.includes(href)) {
        const selectedCard = cardFor(selected, href);
        assert.ok(selectedCard.includes(`src="${hero}"`));
        assert.ok(selectedCard.includes(statusLabel));
        assert.match(selectedCard, /<img\b[^>]*style="height:\s*auto"/);
      }

      const latest = section(home, "id", "latest-writing");
      const expectedWriting = selectLatestWriting(inventory(isZh ? "writing-zh" : "writing"))
        .map(({ data }) => `/${prefix}writing/${data.slug}/`);
      const actualWriting = [...latest.matchAll(/<h3\b[^>]*>\s*<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]);
      assert.deepEqual(actualWriting, expectedWriting);
      assert.doesNotMatch(latest, /cut-audit-er|when-the-highest-score-is-not-the-best-repair/);
      assert.ok(!existsSync(join(root, `dist/${prefix}writing/${deferredWritingSlug}/index.html`)));
    }
    assert.equal(read(`dist${hero}`), read(`public${hero}`), "built cover must match the reviewed source bytes");
    const sitemap = read("dist/sitemap-0.xml");
    for (const prefix of ["", "zh/"]) assert.ok(sitemap.includes(`https://skckenneth.github.io/${prefix}projects/${slug}/`));
    assert.doesNotMatch(sitemap, /\/writing\/when-the-highest-score-is-not-the-best-repair\//);
  });
}
