import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { selectLatestWriting } from "../src/lib/latest-writing.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = path => readFileSync(join(root, path), "utf8");
const entry = (slug, date, options = {}) => ({ data: { slug, date: date ? new Date(date) : undefined, ...options } });
const slugs = entries => entries.map(({ data }) => data.slug);

test("new public articles appear without featured flags", () => {
  const entries = [entry("old-feature", "2026-08-01", { featured: true }),
    entry("new-study", "2026-09-09", { featured: false }), entry("another", "2026-09-08")];
  assert.deepEqual(slugs(selectLatestWriting(entries, 2)), ["new-study", "another"]);
});

test("drafts and archives never occupy homepage recommendations", () => {
  assert.deepEqual(slugs(selectLatestWriting([
    entry("draft", "2026-09-10", { draft: true, featured: true }),
    entry("archive", "2026-09-11", { archived: true }), entry("public", "2026-09-09")
  ])), ["public"]);
});

test("same-day order uses shared slugs, not translated titles or collection order", () => {
  const en = [entry("beta", "2026-09-09", { title: "A" }), entry("alpha", "2026-09-09", { title: "Z" })];
  const zh = [entry("alpha", "2026-09-09", { sourceSlug: "alpha", title: "乙" }),
    entry("beta", "2026-09-09", { sourceSlug: "beta", title: "甲" })];
  assert.deepEqual(slugs(selectLatestWriting(en)), ["alpha", "beta"]);
  assert.deepEqual(slugs(selectLatestWriting(zh)), slugs(selectLatestWriting(en)));
});

test("selection is bounded and does not reorder its input", () => {
  const entries = Object.freeze([entry("d", "2026-09-06"), entry("c", "2026-09-07"),
    entry("b", "2026-09-08"), entry("a", "2026-09-09")]);
  assert.deepEqual(slugs(selectLatestWriting(entries)), ["a", "b", "c"]);
  assert.deepEqual(slugs(entries), ["d", "c", "b", "a"]);
  assert.deepEqual(selectLatestWriting([]), []);
});

test("missing dates cannot outrank dated articles; editing an old article does not republish it", () => {
  assert.deepEqual(slugs(selectLatestWriting([entry("undated"), entry("new", "2026-09-09"),
    entry("old-edited", "2026-08-01", { lastUpdated: new Date("2026-09-10") })])),
    ["new", "old-edited", "undated"]);
});

test("homepage uses automatic selection for both recommendation placements", () => {
  const home = read("src/components/HomePage.astro");
  assert.match(home, /const writing = selectLatestWriting\(writingCollection\)/);
  assert.doesNotMatch(home, /writingCollection\.filter\([^;]*featured/s);
  assert.equal((home.match(/writing\.map\(/g) || []).length, 2);
});

const names = ["Hong U Lo", "Zibo Gao", "Peng Chi Lam", "Sok Kin Cheng"];
test("About records the ADMA mentoring role, author order and accepted-paper milestones in both languages", () => {
  for (const prefix of ["", "zh/"]) {
    const about = read(`src/pages/${prefix}about.astro`);
    const positions = names.map(name => about.indexOf(name));
    assert.ok(positions.every(position => position >= 0));
    assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
    for (const text of ["ADMA 2026", "Research Track", "Short Paper", "camera-ready", "AI4Nature@AVSS 2026"]) {
      assert.ok(about.includes(text), text);
    }
    assert.ok(about.includes(prefix ? "研究指導老師及通訊作者" : "research mentor and corresponding author"));
    for (const section of ["writing", "projects"]) assert.ok(about.includes(`/${prefix}${section}/when-solar-power-changes-fast/`));
    assert.doesNotMatch(about, /Full Paper|award-winning|已正式出版/);
  }
});

function inventory(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(item => {
    const path = join(directory, item.name);
    if (item.isDirectory()) return inventory(path);
    if (!/\.mdx?$/.test(item.name)) return [];
    const fm = readFileSync(path, "utf8").split(/^---\s*$/m)[1];
    const value = name => fm.match(new RegExp(`^${name}:\\s*["']?([^"'\\r\\n]+)`, "m"))?.[1]?.trim();
    return [entry(value("slug"), value("date"), { sourceSlug: value("sourceSlug"),
      draft: value("draft") === "true", archived: value("archived") === "true" })];
  });
}

if (process.argv.includes("--built")) {
  test("both built homepages match the newest eligible source articles", () => {
    const orders = [];
    for (const [prefix, collection] of [["", "writing"], ["zh/", "writing-zh"]]) {
      const expected = selectLatestWriting(inventory(join(root, "src/content", collection)));
      const urls = expected.map(({ data }) => `/${prefix}writing/${data.slug}/`);
      const home = read(`dist/${prefix}index.html`);
      const latest = home.match(/<section\b[^>]*id="latest-writing"[^>]*>([\s\S]*?)<\/section>/)[1];
      const actual = [...latest.matchAll(/<h3\b[^>]*>\s*<a\b[^>]*href="([^"]+)"/g)].map(m => m[1]);
      assert.deepEqual(actual, urls);
      const dossier = home.match(/<aside\b[^>]*class="home-dossier"[^>]*>([\s\S]*?)<\/aside>/)[1];
      assert.deepEqual([...dossier.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m => m[1]), urls);
      assert.equal((latest.match(/class="writing-feature-image"/g) || []).length, expected.length);
      assert.doesNotMatch(latest + dossier, /src="undefined"/);
      orders.push(slugs(expected));
    }
    assert.deepEqual(orders[0], orders[1]);
  });
  test("both built About pages expose the ADMA evidence and local links", () => {
    for (const prefix of ["", "zh/"]) {
      const about = read(`dist/${prefix}about/index.html`);
      for (const text of ["ADMA 2026", "Short Paper", "camera-ready", ...names]) assert.ok(about.includes(text));
      assert.ok(about.includes(`/${prefix}writing/when-solar-power-changes-fast/`));
      assert.ok(about.includes(`/${prefix}projects/when-solar-power-changes-fast/`));
    }
  });
}
