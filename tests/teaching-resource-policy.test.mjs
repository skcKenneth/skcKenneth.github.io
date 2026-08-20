import assert from "node:assert/strict";
import test from "node:test";
import { collectStaleManaged, lectureCatalogue, parseLectureManifest, parseManifest, publicLectureManifest, resolveWithin } from "../scripts/teaching-resource-policy.mjs";

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

const hash = "a".repeat(64);
const asset = (file, extras = {}) => ({ file, bytes: 100, sha256: hash, ...extras });
const lectureManifest = {
  schema_version: 2,
  slug: "mathematical-modeling-lecture-materials",
  revision_date: "2026-08-13",
  release_status: "public release",
  license: { name: "CC BY-NC-SA 4.0", url: "https://creativecommons.org/licenses/by-nc-sa/4.0/" },
  source_archives: [
    { name: "notes", source_path: "source/archives/notes.zip", sha256: "6e0413801c0c1d8e040e8004cdec22c177f9ee52c6019ac26b9b951ecfaa5b7a" },
    { name: "slides", source_path: "source/archives/slides.zip", sha256: "ea6f5e510ccfedfe3d64aefc2e98a1aff0e9c1319b4eda5c9b03870617995cfc" },
  ],
  units: [
    ...Array.from({ length: 12 }, (_, index) => ["lecture", index + 1]),
    ...Array.from({ length: 10 }, (_, index) => ["supplementary", index + 1]),
    ...Array.from({ length: 5 }, (_, index) => ["writing", index + 1]),
  ].map(([group, order]) => {
    const id = `${group}-${String(order).padStart(2, "0")}`;
    return {
      id, group, order, duration_minutes: 60,
      title: { en: `${id} title`, "zh-Hant": `${id} 標題` },
      summary: { en: `${id} summary`, "zh-Hant": `${id} 摘要` },
      prerequisites: { en: ["Algebra"], "zh-Hant": ["代數"] },
      objectives: { en: ["Build a model"], "zh-Hant": ["建立模型"] },
      further_reading: [{
        id: "gaimme",
        publisher: "SIAM / COMAP",
        title: { en: "GAIMME", "zh-Hant": "GAIMME 建模教育指引" },
        url: "https://www.siam.org/publications/reports/guidelines-for-assessment-and-instruction-in-mathematical-modeling-education/",
      }],
      documents: {
        notes_en: asset(`documents/notes-en/${id}-notes-en.pdf`, { pages: 10, locale: "en", document_type: "notes", watermarked: true }),
        notes_zh_hant: asset(`documents/notes-zh-hant/${id}-notes-zh-hant.pdf`, { pages: 10, locale: "zh-Hant", document_type: "notes", watermarked: true }),
        slides_en: asset(`documents/slides-en/${id}-slides-en.pdf`, { pages: 10, locale: "en", document_type: "slides", watermarked: false }),
      },
    };
  }),
  collections: [
    asset("collections/mathematical-modeling-notes-en.pdf", { pages: 270, locale: "en", document_type: "notes", watermarked: true }),
    asset("collections/mathematical-modeling-notes-zh-hant.pdf", { pages: 270, locale: "zh-Hant", document_type: "notes", watermarked: true }),
    asset("collections/mathematical-modeling-slides-en.pdf", { pages: 500, locale: "en", document_type: "slides", watermarked: false }),
  ],
  datasets: [
    asset("datasets/student-datasets.zip", { format: "zip", contents: 8, license: "CC BY-NC-SA 4.0" }),
    asset("datasets/data-dictionary.json", { format: "json", contents: 8, license: "CC BY-NC-SA 4.0" }),
    ...["spring-mass", "logistic-yeast", "sir-baseline", "sir-intervention", "braking-fit", "sensor-fit", "capacity-fit", "kepler-selected"].map((id) => asset(`datasets/${id}.csv`, {
      id,
      title: { en: `${id} dataset`, "zh-Hant": `${id} 資料集` },
      source_type: "synthetic teaching data",
      unit_ids: ["lecture-01"],
      units: { x: "index", y: "response" },
      license: "CC BY-NC-SA 4.0",
    })),
  ],
};

test("accepts the 27-unit, 84-PDF bilingual lecture boundary", () => {
  const parsed = parseLectureManifest(JSON.stringify(lectureManifest));
  assert.equal(parsed.units.length, 27);
  assert.equal(parsed.assets.filter((item) => item.file.endsWith(".pdf")).length, 84);
  assert.equal(lectureCatalogue(parsed).units[0].documents.notes_en.public_url, "/resources/mathematical-modeling-lecture-materials/documents/notes-en/lecture-01-notes-en.pdf");
  const published = publicLectureManifest(parsed);
  assert.equal(published.source_archives[0].file, undefined);
  assert.equal(published.source_archives[0].source_path, undefined);
  assert.equal(published.source_archives[0].name, undefined);
});

test("rejects interim releases, unstable document paths, and scalar learning metadata", () => {
  const interim = structuredClone(lectureManifest);
  interim.release_status = "english-only interim build";
  assert.throws(() => parseLectureManifest(JSON.stringify(interim)), /interim build/);

  const path = structuredClone(lectureManifest);
  path.units[0].documents.notes_en.file = "documents/notes-en/replacement.pdf";
  assert.throws(() => parseLectureManifest(JSON.stringify(path)), /stable public document path/);

  const metadata = structuredClone(lectureManifest);
  metadata.units[0].objectives.en = "Build a model";
  assert.throws(() => parseLectureManifest(JSON.stringify(metadata)), /non-empty list/);
});

test("rejects an unwatermarked Notes file", () => {
  const invalid = structuredClone(lectureManifest);
  invalid.units[0].documents.notes_en.watermarked = false;
  assert.throws(() => parseLectureManifest(JSON.stringify(invalid)), /watermark Notes only/);
});

test("rejects a hidden extra curriculum unit", () => {
  const invalid = structuredClone(lectureManifest);
  invalid.units.push(structuredClone(invalid.units[0]));
  assert.throws(() => parseLectureManifest(JSON.stringify(invalid)), /exactly 27 units/);
});

test("rejects missing or non-HTTPS further reading", () => {
  const missing = structuredClone(lectureManifest);
  missing.units[0].further_reading = [];
  assert.throws(() => parseLectureManifest(JSON.stringify(missing)), /further-reading/);

  const insecure = structuredClone(lectureManifest);
  insecure.units[0].further_reading[0].url = "http://example.com/reference";
  assert.throws(() => parseLectureManifest(JSON.stringify(insecure)), /HTTPS/);
});

test("rejects substituted source archives or an incomplete dataset pack", () => {
  const archives = structuredClone(lectureManifest);
  archives.source_archives[0].sha256 = "d".repeat(64);
  assert.throws(() => parseLectureManifest(JSON.stringify(archives)), /archive hashes/);

  const datasets = structuredClone(lectureManifest);
  datasets.datasets.pop();
  assert.throws(() => parseLectureManifest(JSON.stringify(datasets)), /eight CSV/);

  const renamedDataset = structuredClone(lectureManifest);
  renamedDataset.datasets.at(-1).file = "datasets/unreviewed.csv";
  assert.throws(() => parseLectureManifest(JSON.stringify(renamedDataset)), /reviewed public pack/);
});
