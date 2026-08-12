import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { basename, resolve, sep } from "node:path";

export const TEACHING_RESOURCE_SLUG = "macau-school-math-competition-2019-2026";
export const APPROVED_FILES = Object.freeze(["cover.svg", "manifest.json", "solution-companion.pdf"]);
const SOURCE_HASH = "f5974b92a678641fdae32079ad922106e7e50f66f11b8fca92d754e1eedce723";

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
  if (manifest.source_zip_sha256 !== SOURCE_HASH) throw new Error("Frozen source ZIP hash does not match the approved import.");
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

export async function validateReleaseDirectory(directory, { allowManagedReceipt = false } = {}) {
  const names = (await readdir(directory)).sort();
  const allowed = allowManagedReceipt ? [...APPROVED_FILES, "managed-assets.json"] : [...APPROVED_FILES];
  if (JSON.stringify(names) !== JSON.stringify(allowed.sort())) {
    throw new Error(`Release directory must contain only ${allowed.join(", ")}; found ${names.join(", ")}.`);
  }
  const manifest = parseManifest(await readFile(resolveWithin(directory, "manifest.json"), "utf8"));
  for (const asset of manifest.assets) {
    if (basename(asset.file) !== asset.file) throw new Error(`Unsafe teaching-resource filename: ${asset.file}`);
    const path = resolveWithin(directory, asset.file);
    const bytes = await readFile(path);
    if ((await stat(path)).size !== asset.bytes) throw new Error(`Byte count mismatch for ${asset.file}.`);
    if (sha256(bytes) !== asset.sha256) throw new Error(`SHA-256 mismatch for ${asset.file}.`);
    if (asset.file.endsWith(".pdf") && bytes.subarray(0, 5).toString("ascii") !== "%PDF-") throw new Error("Solution companion is not a valid PDF.");
    if (asset.file.endsWith(".svg")) {
      const text = bytes.toString("utf8");
      if (!/<svg\b/.test(text) || /<script\b|javascript:|\b(?:href|src)\s*=\s*["']https?:/i.test(text)) throw new Error("Cover SVG is missing or contains active/external content.");
    }
  }
  return manifest;
}

export function collectStaleManaged(previous, expected) {
  return (previous?.assets || []).filter((asset) => asset.managed && !expected.has(asset.public_path));
}
