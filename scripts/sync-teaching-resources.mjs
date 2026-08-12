import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  APPROVED_FILES,
  TEACHING_RESOURCE_SLUG,
  collectStaleManaged,
  sha256,
  validateReleaseDirectory,
} from "./teaching-resource-policy.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sibling = resolve(process.env.SCIENCEPROJECT_DIR || resolve(root, "../ScienceProject"));
const siblingRelease = resolve(sibling, "macau-school-mathematics-competition-2019-2026/release/public");
const publicDir = resolve(root, `public/resources/${TEACHING_RESOURCE_SLUG}`);
const syncManifestPath = resolve(publicDir, "managed-assets.json");

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

let sourceDir;
let source;
let allowManagedReceipt = false;
if (await exists(siblingRelease)) {
  sourceDir = siblingRelease;
  source = "sibling private ScienceProject release/public allowlist";
} else {
  sourceDir = publicDir;
  source = "committed public teaching-resource snapshot";
  allowManagedReceipt = true;
  console.warn("Sibling ScienceProject teaching release is unavailable; validating the committed public snapshot.");
}

const manifest = await validateReleaseDirectory(sourceDir, { allowManagedReceipt });
await mkdir(publicDir, { recursive: true });

let previous = { assets: [] };
try { previous = JSON.parse((await readFile(syncManifestPath, "utf8")).replace(/^\uFEFF/, "")); } catch {}

const assets = [];
const expected = new Set();
for (const filename of APPROVED_FILES) {
  const publicPath = `/resources/${TEACHING_RESOURCE_SLUG}/${filename}`;
  const sourcePath = resolve(sourceDir, filename);
  const destination = resolve(publicDir, filename);
  expected.add(publicPath);
  const bytes = await readFile(sourcePath);
  let existingHash;
  try { existingHash = sha256(await readFile(destination)); } catch {}
  const hash = sha256(bytes);
  let status = "current";
  if (existingHash !== hash) {
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, bytes);
    status = existingHash ? "updated" : "copied";
  }
  assets.push({ filename, public_path: publicPath, sha256: hash, bytes: bytes.length, status, managed: true });
}

const stale = collectStaleManaged(previous, expected);
for (const asset of stale) console.warn(`Stale managed teaching asset preserved (not deleted): ${asset.public_path}`);

const syncManifest = {
  source,
  source_of_truth: "ScienceProject release/public allowlist only",
  editorial_policy: "Teaching page bodies remain manually authored in skcKenneth.github.io and are never generated or overwritten by sync.",
  resource: { slug: manifest.slug, coverage: manifest.coverage, publication_boundary: manifest.publication_boundary },
  assets,
  stale,
};
await writeFile(syncManifestPath, `${JSON.stringify(syncManifest, null, 2)}\n`);

console.log(`Synchronized ${assets.length}/${APPROVED_FILES.length} approved teaching assets from ${source}; ${stale.length} stale asset(s) preserved.`);
