import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");

test("built lecture libraries expose all bilingual unit routes", async () => {
  const catalogue = JSON.parse(await readFile(resolve(root, "src/data/generated/teaching-lecture-catalogue.json"), "utf8"));
  assert.equal(catalogue.units.length, 27);
  for (const localePrefix of ["", "zh/"]) {
    const library = await readFile(resolve(root, `dist/${localePrefix}teaching/mathematical-modeling-lecture-programme/index.html`), "utf8");
    assert.match(library, /lecture-unit-grid/);
    assert.match(library, /student-datasets\.zip/);
    assert.match(library, /data-dictionary\.json/);
    for (const unit of catalogue.units) {
      const html = await readFile(resolve(root, `dist/${localePrefix}teaching/mathematical-modeling-lecture-programme/${unit.id}/index.html`), "utf8");
      assert.match(html, /data-lecture-reader/);
      assert.match(html, /loading="lazy"/);
      assert.match(html, /<noscript>/);
      assert.match(html, /aria-controls="lecture-pdf-reader"/);
      assert.equal((html.match(/<iframe\b/g) || []).length, 1, `${unit.id} must lazy-load only one PDF reader`);
      const initial = localePrefix ? unit.documents.notes_zh_hant.public_url : unit.documents.notes_en.public_url;
      assert.ok(html.includes(`src="${initial}#view=FitH"`), `${unit.id} has the wrong locale-default PDF`);
      assert.doesNotMatch(html, /ScienceProject|[A-Z]:\\|source[\\/]archives|\.tex\b|CDSJ5/i);
      for (const asset of Object.values(unit.documents)) assert.ok(html.includes(asset.public_url), `${unit.id} is missing ${asset.public_url}`);
    }
  }
});
