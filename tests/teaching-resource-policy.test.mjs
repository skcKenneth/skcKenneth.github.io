import assert from "node:assert/strict";
import test from "node:test";
import { collectStaleManaged, parseManifest, resolveWithin } from "../scripts/teaching-resource-policy.mjs";

const valid = {
  schema_version: 1,
  slug: "macau-school-math-competition-2019-2026",
  source_zip_sha256: "f5974b92a678641fdae32079ad922106e7e50f66f11b8fca92d754e1eedce723",
  coverage: { cycles: 8, divisions: 16, questions: 214, figures: 46 },
  publication_boundary: { official_papers_embedded: false, transcribed_problem_statements_included: false, raw_source_included: false },
  assets: [{ file: "cover.svg" }, { file: "solution-companion.pdf" }],
};

test("accepts the frozen public teaching-resource boundary", () => {
  assert.equal(parseManifest(JSON.stringify(valid)).coverage.questions, 214);
});

test("rejects embedded official papers", () => {
  const invalid = structuredClone(valid);
  invalid.publication_boundary.official_papers_embedded = true;
  assert.throws(() => parseManifest(JSON.stringify(invalid)), /publication boundary/);
});

test("rejects path traversal", () => {
  assert.throws(() => resolveWithin("C:/safe", "../private.zip"), /escapes/);
});

test("reports stale managed assets without deleting them", () => {
  const stale = collectStaleManaged({ assets: [{ managed: true, public_path: "/old.pdf" }, { managed: false, public_path: "/user.pdf" }] }, new Set());
  assert.deepEqual(stale.map((asset) => asset.public_path), ["/old.pdf"]);
});
