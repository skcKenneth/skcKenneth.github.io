import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routes = [
  ["en", new URL("../dist/teaching/melt-pond-topology-lab/index.html", import.meta.url)],
  ["zh-Hant", new URL("../dist/zh/teaching/melt-pond-topology-lab/index.html", import.meta.url)],
];

const compactRoutes = [
  new URL("../dist/writing/topology-at-the-edge-of-resolution/index.html", import.meta.url),
  new URL("../dist/zh/writing/topology-at-the-edge-of-resolution/index.html", import.meta.url),
];

function duplicateIds(html) {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  return [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
}

for (const [locale, url] of routes) {
  test(`${locale} built lab preserves the interactive and accessible contract`, async () => {
    const html = await readFile(url, "utf8");
    assert.match(html, /<melt-pond-topology-lab\b/);
    assert.match(html, new RegExp(`data-locale="${locale}"`));
    assert.equal((html.match(/<canvas\b/g) ?? []).length, 2);
    assert.match(html, /aria-live="polite"/);
    assert.match(html, /<noscript>/);
    assert.match(html, /name="connectivity"/);
    assert.match(html, /pond-4-ice-8/);
    assert.match(html, /pond-8-ice-4/);
    assert.doesNotMatch(html, /technicalRepository|notebookUrl|reproductionUrl|C:\\Users\\|C:\/Users\//i);
    assert.deepEqual(duplicateIds(html), []);
  });
}

test("the built English route exposes all twelve canonical fixture choices", async () => {
  const html = await readFile(routes[0][1], "utf8");
  const expected = [
    "matern-broad-isotropic",
    "matern-fine-isotropic",
    "matern-horizontal-ridges",
    "matern-vertical-ridges",
    "germ-grain-sparse-round",
    "germ-grain-dense-round",
    "germ-grain-horizontal",
    "germ-grain-mixed-scale",
    "ising-cool-clusters",
    "ising-warm-fragments",
    "ising-horizontal-shift",
    "ising-disordered-shift",
  ];
  for (const id of expected) assert.match(html, new RegExp(`value="${id}"`), id);
});

test("both compact article embeds have one isolated lab instance and no duplicate ids", async () => {
  for (const url of compactRoutes) {
    const html = await readFile(url, "utf8");
    assert.equal((html.match(/<melt-pond-topology-lab\b/g) ?? []).length, 1, url.pathname);
    assert.match(html, /data-mode="compact"/);
    assert.deepEqual(duplicateIds(html), [], url.pathname);
  }
});

test("custom-element listeners and selectors are instance-scoped and registration is guarded", async () => {
  const source = await readFile(new URL("../src/components/MeltPondTopologyLab.astro", import.meta.url), "utf8");
  assert.match(source, /if \(this\.dataset\.ready === "true"\) return;/);
  assert.match(source, /if \(!customElements\.get\("melt-pond-topology-lab"\)\)/);
  assert.doesNotMatch(source, /document\.querySelector/);
});
