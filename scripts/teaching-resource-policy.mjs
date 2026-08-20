import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { basename, extname, posix, resolve, sep } from "node:path";

export const TEACHING_RESOURCE_SLUG = "macau-school-math-competition-2019-2026";
export const LECTURE_RESOURCE_SLUG = "mathematical-modeling-lecture-materials";
export const APPROVED_FILES = Object.freeze(["cover.svg", "manifest.json", "solution-companion.pdf"]);
const MACAU_SOURCE_HASH = "f5974b92a678641fdae32079ad922106e7e50f66f11b8fca92d754e1eedce723";
const LECTURE_SOURCE_HASHES = new Set([
  "ea6f5e510ccfedfe3d64aefc2e98a1aff0e9c1319b4eda5c9b03870617995cfc",
  "6e0413801c0c1d8e040e8004cdec22c177f9ee52c6019ac26b9b951ecfaa5b7a",
]);
const LECTURE_UNIT_IDS = Object.freeze([
  ...Array.from({ length: 12 }, (_, index) => `lecture-${String(index + 1).padStart(2, "0")}`),
  ...Array.from({ length: 10 }, (_, index) => `supplementary-${String(index + 1).padStart(2, "0")}`),
  ...Array.from({ length: 5 }, (_, index) => `writing-${String(index + 1).padStart(2, "0")}`),
]);
const LECTURE_COLLECTION_FILES = Object.freeze([
  "collections/mathematical-modeling-notes-en.pdf",
  "collections/mathematical-modeling-notes-zh-hant.pdf",
  "collections/mathematical-modeling-slides-en.pdf",
]);
const LECTURE_DATASET_FILES = Object.freeze([
  "datasets/student-datasets.zip",
  "datasets/data-dictionary.json",
  "datasets/spring-mass.csv",
  "datasets/logistic-yeast.csv",
  "datasets/sir-baseline.csv",
  "datasets/sir-intervention.csv",
  "datasets/braking-fit.csv",
  "datasets/sensor-fit.csv",
  "datasets/capacity-fit.csv",
  "datasets/kepler-selected.csv",
]);
const SAFE_FILE = /^(?!\/)(?!.*(?:^|\/)\.\.?(?:\/|$))[a-z0-9][a-z0-9._/-]*$/;
const ALLOWED_EXTENSIONS = new Set([".pdf", ".csv", ".zip", ".svg", ".png", ".json"]);

export const TEACHING_RESOURCE_REGISTRY = Object.freeze([
  {
    key: "macauCompetition",
    slug: TEACHING_RESOURCE_SLUG,
    siblingRelease: "macau-school-mathematics-competition-2019-2026/release/public",
    publicDirectory: `public/resources/${TEACHING_RESOURCE_SLUG}`,
    catalogue: false,
  },
  {
    key: "lectureMaterials",
    slug: LECTURE_RESOURCE_SLUG,
    siblingRelease: "mathematical-modeling-lecture-materials/release/public",
    publicDirectory: `public/resources/${LECTURE_RESOURCE_SLUG}`,
    catalogue: true,
  },
]);

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function resolveWithin(root, relative, label = relative) {
  const candidate = resolve(root, relative);
  const prefix = `${resolve(root)}${sep}`;
  if (candidate !== resolve(root) && !candidate.startsWith(prefix)) {
    throw new Error(`${label} escapes the approved teaching-resource directory.`);
  }
  return candidate;
}

export function parseManifest(source) {
  const manifest = JSON.parse(source.replace(/^\uFEFF/, ""));
  if (manifest.schema_version !== 1) throw new Error("Unsupported teaching-resource manifest schema.");
  if (manifest.slug !== TEACHING_RESOURCE_SLUG) throw new Error(`Unexpected teaching-resource slug: ${manifest.slug}`);
  if (manifest.source_zip_sha256 !== MACAU_SOURCE_HASH) throw new Error("Frozen source ZIP hash does not match the approved import.");
  if (manifest.coverage?.cycles !== 8 || manifest.coverage?.divisions !== 16 || manifest.coverage?.questions !== 214 || manifest.coverage?.figures !== 46) {
    throw new Error("Teaching-resource coverage does not match the audited 2019-2026 inventory.");
  }
  const boundary = manifest.publication_boundary || {};
  if (boundary.official_papers_embedded !== false || boundary.transcribed_problem_statements_included !== false || boundary.raw_source_included !== false) {
    throw new Error("Public teaching resource violates the official-paper publication boundary.");
  }
  const names = manifest.assets?.map((asset) => asset.file).sort() || [];
  if (JSON.stringify(names) !== JSON.stringify(["cover.svg", "solution-companion.pdf"])) {
    throw new Error(`Manifest asset allowlist is invalid: ${names.join(", ")}`);
  }
  return manifest;
}

function descriptorFrom(value, label) {
  if (!value || typeof value !== "object") throw new Error(`${label} must be an asset descriptor.`);
  const file = String(value.file || "").replaceAll("\\", "/");
  if (!SAFE_FILE.test(file) || basename(file) === "manifest.json") throw new Error(`Unsafe teaching-resource filename: ${file}`);
  if (!ALLOWED_EXTENSIONS.has(extname(file))) throw new Error(`Unsupported teaching-resource format: ${file}`);
  if (!Number.isSafeInteger(value.bytes) || value.bytes <= 0) throw new Error(`${label} has an invalid byte count.`);
  if (!/^[a-f0-9]{64}$/.test(value.sha256 || "")) throw new Error(`${label} has an invalid SHA-256.`);
  if (extname(file) === ".pdf" && (!Number.isSafeInteger(value.pages) || value.pages <= 0)) throw new Error(`${label} has an invalid PDF page count.`);
  return { ...value, file };
}

function textPair(value, fallback = "") {
  if (typeof value === "string") return { en: value, "zh-Hant": value };
  return {
    en: value?.en || fallback,
    "zh-Hant": value?.["zh-Hant"] || value?.zh_hant || value?.zh || fallback,
  };
}

function stringPair(value, label) {
  const pair = textPair(value, "");
  if (typeof pair.en !== "string" || typeof pair["zh-Hant"] !== "string" || !pair.en.trim() || !pair["zh-Hant"].trim()) {
    throw new Error(`${label} requires non-empty English and Traditional Chinese text.`);
  }
  return { en: pair.en.trim(), "zh-Hant": pair["zh-Hant"].trim() };
}

function listPair(value, label) {
  const pair = {
    en: value?.en,
    "zh-Hant": value?.["zh-Hant"] || value?.zh_hant || value?.zh,
  };
  for (const locale of ["en", "zh-Hant"]) {
    if (!Array.isArray(pair[locale]) || pair[locale].length === 0 || pair[locale].some((item) => typeof item !== "string" || !item.trim())) {
      throw new Error(`${label}.${locale} requires a non-empty list of text items.`);
    }
  }
  return { en: pair.en.map((item) => item.trim()), "zh-Hant": pair["zh-Hant"].map((item) => item.trim()) };
}

function documentMap(unit) {
  if (Array.isArray(unit.documents)) {
    const map = {};
    for (const document of unit.documents) {
      const key = document.key || document.id || `${document.document_type || document.type}_${document.locale || ""}`;
      map[key] = document;
    }
    return {
      notes_en: map.notes_en || unit.notes_en,
      notes_zh_hant: map.notes_zh_hant || map.notes_zh || unit.notes_zh_hant,
      slides_en: map.slides_en || unit.slides_en,
    };
  }
  return unit.documents || { notes_en: unit.notes_en, notes_zh_hant: unit.notes_zh_hant, slides_en: unit.slides_en };
}

function descriptorList(value, label) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item, index) => descriptorFrom(item, `${label}[${index}]`));
  return Object.entries(value).map(([key, item]) => descriptorFrom(item, `${label}.${key}`));
}

function readingList(value, unitId) {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`${unitId} requires at least one reviewed further-reading reference.`);
  const seen = new Set();
  return value.map((reference, index) => {
    const label = `${unitId}.further_reading[${index}]`;
    if (!reference || typeof reference !== "object") throw new Error(`${label} must be a reference descriptor.`);
    const id = String(reference.id || "");
    if (!/^[a-z0-9][a-z0-9-]*$/.test(id) || seen.has(id)) throw new Error(`${label} has an invalid or duplicate reference ID.`);
    seen.add(id);
    const publisher = String(reference.publisher || "").trim();
    const title = stringPair(reference.title, `${label}.title`);
    if (!publisher) throw new Error(`${label} requires a publisher and bilingual title.`);
    let url;
    try {
      url = new URL(String(reference.url || ""));
    } catch {
      throw new Error(`${label} has an invalid URL.`);
    }
    if (url.protocol !== "https:") throw new Error(`${label} must use an HTTPS source URL.`);
    return { ...reference, id, publisher, title, url: url.href };
  });
}

export function parseLectureManifest(source) {
  const raw = JSON.parse(source.replace(/^\uFEFF/, ""));
  if (raw.schema_version !== 2) throw new Error("Unsupported lecture-resource manifest schema.");
  if (raw.slug !== LECTURE_RESOURCE_SLUG) throw new Error(`Unexpected lecture-resource slug: ${raw.slug}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.revision_date || "")) throw new Error("Lecture release requires an ISO revision date.");
  if (raw.release_status !== "public release") throw new Error("Lecture sync accepts only a completed public release, never an interim build.");
  const licenseName = typeof raw.license === "string" ? raw.license : raw.license?.name;
  if (licenseName !== "CC BY-NC-SA 4.0") throw new Error("Lecture release must use the approved CC BY-NC-SA 4.0 licence.");
  const sourceArchives = raw.source_archives;
  const archiveDescriptors = Array.isArray(sourceArchives) ? sourceArchives : Object.values(sourceArchives || {});
  if (archiveDescriptors.length !== 2 || archiveDescriptors.some((item) => !/^[a-f0-9]{64}$/i.test(item?.sha256 || item?.source_zip_sha256 || ""))) {
    throw new Error("Lecture release must freeze both source archive hashes.");
  }
  const archiveHashes = new Set(archiveDescriptors.map((item) => String(item.sha256 || item.source_zip_sha256).toLowerCase()));
  if (archiveHashes.size !== LECTURE_SOURCE_HASHES.size || [...LECTURE_SOURCE_HASHES].some((hash) => !archiveHashes.has(hash))) {
    throw new Error("Lecture source archive hashes do not match the audited Notes and slides imports.");
  }
  if (!Array.isArray(raw.units) || raw.units.length !== 27) throw new Error("Lecture release must contain exactly 27 units.");
  const ids = raw.units.map((unit) => unit.id).sort();
  if (JSON.stringify(ids) !== JSON.stringify([...LECTURE_UNIT_IDS].sort())) throw new Error("Lecture unit IDs do not match the frozen 12 + 10 + 5 curriculum.");

  const units = raw.units.map((unit) => {
    const documents = documentMap(unit);
    const normalizedDocuments = {
      notes_en: descriptorFrom(documents.notes_en, `${unit.id}.documents.notes_en`),
      notes_zh_hant: descriptorFrom(documents.notes_zh_hant, `${unit.id}.documents.notes_zh_hant`),
      slides_en: descriptorFrom(documents.slides_en, `${unit.id}.documents.slides_en`),
    };
    if (normalizedDocuments.notes_en.locale !== "en" || normalizedDocuments.notes_zh_hant.locale !== "zh-Hant" || normalizedDocuments.slides_en.locale !== "en") {
      throw new Error(`${unit.id} document locales must be en, zh-Hant, and en.`);
    }
    if (normalizedDocuments.notes_en.document_type !== "notes" || normalizedDocuments.notes_zh_hant.document_type !== "notes" || normalizedDocuments.slides_en.document_type !== "slides") {
      throw new Error(`${unit.id} document types must identify notes and slides.`);
    }
    if (normalizedDocuments.notes_en.watermarked !== true || normalizedDocuments.notes_zh_hant.watermarked !== true || normalizedDocuments.slides_en.watermarked !== false) {
      throw new Error(`${unit.id} must watermark Notes only.`);
    }
    const expectedDocumentFiles = {
      notes_en: `documents/notes-en/${unit.id}-notes-en.pdf`,
      notes_zh_hant: `documents/notes-zh-hant/${unit.id}-notes-zh-hant.pdf`,
      slides_en: `documents/slides-en/${unit.id}-slides-en.pdf`,
    };
    for (const [key, file] of Object.entries(expectedDocumentFiles)) {
      if (normalizedDocuments[key].file !== file) throw new Error(`${unit.id}.${key} must use the stable public document path ${file}.`);
    }
    const inferredGroup = unit.id.startsWith("lecture-") ? "lecture" : unit.id.startsWith("supplementary-") ? "supplementary" : "writing";
    if ((unit.group || inferredGroup) !== inferredGroup) throw new Error(`${unit.id} has an invalid curriculum group.`);
    const expectedOrder = Number(unit.id.slice(-2));
    if (!Number.isSafeInteger(unit.order) || unit.order !== expectedOrder) throw new Error(`${unit.id} must use curriculum order ${expectedOrder}.`);
    if (!Number.isSafeInteger(unit.duration_minutes) || unit.duration_minutes <= 0) throw new Error(`${unit.id} requires a positive duration in minutes.`);
    const title = stringPair(unit.title || unit.titles, `${unit.id}.title`);
    const summary = stringPair(unit.summary || unit.summaries, `${unit.id}.summary`);
    const prerequisites = listPair(unit.prerequisites, `${unit.id}.prerequisites`);
    const objectives = listPair(unit.objectives, `${unit.id}.objectives`);
    const furtherReading = readingList(unit.further_reading, unit.id);
    return {
      id: unit.id,
      group: inferredGroup,
      order: expectedOrder,
      title,
      summary,
      prerequisites,
      objectives,
      duration_minutes: unit.duration_minutes,
      further_reading: furtherReading,
      documents: normalizedDocuments,
    };
  });
  const collections = descriptorList(raw.collections, "collections");
  const datasets = descriptorList(raw.datasets, "datasets");
  if (collections.length !== 3 || collections.some((asset) => extname(asset.file) !== ".pdf")) throw new Error("Lecture release must provide exactly three PDF collections.");
  const collectionKinds = collections.map((asset) => `${asset.document_type}:${asset.locale}`).sort();
  if (JSON.stringify(collectionKinds) !== JSON.stringify(["notes:en", "notes:zh-Hant", "slides:en"])) throw new Error("Lecture collections must include bilingual Notes and English slides.");
  if (collections.some((asset) => asset.document_type === "notes" ? asset.watermarked !== true : asset.watermarked !== false)) throw new Error("Lecture collections must watermark Notes only.");
  if (JSON.stringify(collections.map((asset) => asset.file).sort()) !== JSON.stringify([...LECTURE_COLLECTION_FILES].sort())) throw new Error("Lecture collection filenames do not match the stable public contract.");
  const allDescriptors = [...units.flatMap((unit) => Object.values(unit.documents)), ...collections, ...datasets];
  const pdfs = allDescriptors.filter((asset) => extname(asset.file) === ".pdf");
  if (pdfs.length !== 84 || units.flatMap((unit) => Object.values(unit.documents)).length !== 81) {
    throw new Error(`Lecture release must expose exactly 81 unit PDFs and 3 collections; found ${pdfs.length} PDFs.`);
  }
  const datasetExtensions = datasets.map((asset) => extname(asset.file));
  if (datasets.length !== 10 || datasetExtensions.filter((extension) => extension === ".csv").length !== 8 || datasetExtensions.filter((extension) => extension === ".json").length !== 1 || datasetExtensions.filter((extension) => extension === ".zip").length !== 1) {
    throw new Error("Lecture release must provide eight CSV files, one data dictionary, and one student archive.");
  }
  if (JSON.stringify(datasets.map((asset) => asset.file).sort()) !== JSON.stringify([...LECTURE_DATASET_FILES].sort())) throw new Error("Lecture dataset filenames do not match the reviewed public pack.");
  if (datasets.some((dataset) => typeof dataset.license !== "string" || !dataset.license.trim())) throw new Error("Every lecture dataset asset requires an explicit public licence or source-credit statement.");
  const csvDatasets = datasets.filter((asset) => extname(asset.file) === ".csv");
  for (const dataset of csvDatasets) {
    dataset.title = stringPair(dataset.title, `${dataset.file}.title`);
    if (typeof dataset.source_type !== "string" || !/(?:synthetic|simulated|derived)/i.test(dataset.source_type)) throw new Error(`${dataset.file} requires an explicit synthetic, simulated, or derived source type.`);
    if (!Array.isArray(dataset.unit_ids) || dataset.unit_ids.length === 0 || dataset.unit_ids.some((id) => !LECTURE_UNIT_IDS.includes(id))) throw new Error(`${dataset.file} must identify its related curriculum units.`);
    if (!dataset.units || typeof dataset.units !== "object" || Array.isArray(dataset.units) || Object.keys(dataset.units).length === 0 || Object.values(dataset.units).some((unit) => typeof unit !== "string" || !unit.trim())) throw new Error(`${dataset.file} requires a non-empty data-unit dictionary.`);
    if (/derived/i.test(dataset.source_type)) {
      let provenanceUrl;
      try { provenanceUrl = new URL(String(dataset.provenance?.url || "")); } catch { throw new Error(`${dataset.file} requires HTTPS provenance for derived data.`); }
      if (!dataset.provenance?.publisher || provenanceUrl.protocol !== "https:" || !/^\d{4}-\d{2}-\d{2}$/.test(dataset.provenance?.checked_on || "")) throw new Error(`${dataset.file} requires HTTPS provenance for derived data.`);
    }
  }
  const dictionary = datasets.find((asset) => asset.file === "datasets/data-dictionary.json");
  const archive = datasets.find((asset) => asset.file === "datasets/student-datasets.zip");
  if (dictionary?.format !== "json" || dictionary?.contents !== 8 || archive?.format !== "zip" || archive?.contents !== 8) throw new Error("Lecture data dictionary and student archive must each describe all eight datasets.");
  const unique = new Set(allDescriptors.map((asset) => asset.file));
  if (unique.size !== allDescriptors.length) throw new Error("Lecture release contains duplicate public asset paths.");
  return { ...raw, source_archives: archiveDescriptors, units, collections, datasets, assets: allDescriptors };
}

export function publicLectureManifest(manifest) {
  return {
    schema_version: 2,
    slug: manifest.slug,
    revision_date: manifest.revision_date,
    source_archives: manifest.source_archives.map((archive) => ({
      role: archive.role || archive.name || "frozen source archive",
      sha256: String(archive.sha256 || archive.source_zip_sha256).toLowerCase(),
    })),
    license: manifest.license,
    sources: manifest.sources || {},
    units: manifest.units,
    collections: manifest.collections,
    datasets: manifest.datasets,
    release_status: "public release",
  };
}

async function walkFiles(directory, relative = "") {
  const found = [];
  for (const entry of await readdir(resolveWithin(directory, relative), { withFileTypes: true })) {
    const child = posix.join(relative.replaceAll("\\", "/"), entry.name);
    if (entry.isDirectory()) found.push(...await walkFiles(directory, child));
    else if (entry.isFile()) found.push(child);
    else throw new Error(`Unsupported filesystem entry in teaching release: ${child}`);
  }
  return found.sort();
}

async function validateAsset(directory, asset) {
  const path = resolveWithin(directory, asset.file);
  const bytes = await readFile(path);
  if ((await stat(path)).size !== asset.bytes) throw new Error(`Byte count mismatch for ${asset.file}.`);
  if (sha256(bytes) !== asset.sha256) throw new Error(`SHA-256 mismatch for ${asset.file}.`);
  if (asset.file.endsWith(".pdf") && bytes.subarray(0, 5).toString("ascii") !== "%PDF-") throw new Error(`${asset.file} is not a valid PDF.`);
  if (asset.file.endsWith(".zip") && bytes.subarray(0, 2).toString("ascii") !== "PK") throw new Error(`${asset.file} is not a valid ZIP.`);
  if (asset.file.endsWith(".svg")) {
    const text = bytes.toString("utf8");
    if (!/<svg\b/.test(text) || /<script\b|javascript:|\b(?:href|src)\s*=\s*["']https?:/i.test(text)) throw new Error(`${asset.file} contains unsafe SVG content.`);
  }
}

export async function validateReleaseDirectory(directory, { allowManagedReceipt = false } = {}) {
  const names = (await readdir(directory)).sort();
  const allowed = allowManagedReceipt ? [...APPROVED_FILES, "managed-assets.json"] : [...APPROVED_FILES];
  if (JSON.stringify(names) !== JSON.stringify(allowed.sort())) throw new Error(`Release directory must contain only ${allowed.join(", ")}; found ${names.join(", ")}.`);
  const manifest = parseManifest(await readFile(resolveWithin(directory, "manifest.json"), "utf8"));
  for (const asset of manifest.assets) await validateAsset(directory, asset);
  return manifest;
}

export async function validateLectureReleaseDirectory(directory, { allowManagedReceipt = false } = {}) {
  const manifest = parseLectureManifest(await readFile(resolveWithin(directory, "manifest.json"), "utf8"));
  const expected = new Set(["manifest.json", ...manifest.assets.map((asset) => asset.file), ...(allowManagedReceipt ? ["managed-assets.json"] : [])]);
  if (allowManagedReceipt) {
    try {
      const receipt = JSON.parse((await readFile(resolveWithin(directory, "managed-assets.json"), "utf8")).replace(/^\uFEFF/, ""));
      for (const asset of [...(receipt.assets || []), ...(receipt.stale || [])]) {
        if (asset.managed && asset.public_path?.startsWith(`/resources/${LECTURE_RESOURCE_SLUG}/`)) expected.add(asset.public_path.slice(`/resources/${LECTURE_RESOURCE_SLUG}/`.length));
      }
    } catch (error) {
      throw new Error(`Invalid managed lecture-resource receipt: ${error.message}`);
    }
  }
  const actual = await walkFiles(directory);
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort())) {
    const unexpected = actual.filter((file) => !expected.has(file));
    const missing = [...expected].filter((file) => !actual.includes(file));
    throw new Error(`Lecture release allowlist mismatch. Unexpected: ${unexpected.join(", ") || "none"}; missing: ${missing.join(", ") || "none"}.`);
  }
  for (const asset of manifest.assets) await validateAsset(directory, asset);
  return manifest;
}

export function lectureCatalogue(manifest) {
  const publicUrl = (asset) => ({ ...asset, public_url: `/resources/${LECTURE_RESOURCE_SLUG}/${asset.file}` });
  return {
    schema_version: 2,
    slug: manifest.slug,
    revision_date: manifest.revision_date,
    license: manifest.license || "CC BY-NC-SA 4.0",
    units: manifest.units.map((unit) => ({ ...unit, documents: Object.fromEntries(Object.entries(unit.documents).map(([key, asset]) => [key, publicUrl(asset)])) })),
    collections: manifest.collections.map(publicUrl),
    datasets: manifest.datasets.map(publicUrl),
  };
}

export function collectStaleManaged(previous, expected) {
  const candidates = [...(previous?.assets || []), ...(previous?.stale || [])];
  return [...new Map(candidates.filter((asset) => asset.managed && !expected.has(asset.public_path)).map((asset) => [asset.public_path, asset])).values()];
}
