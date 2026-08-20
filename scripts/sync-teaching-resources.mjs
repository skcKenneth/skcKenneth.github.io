import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  APPROVED_FILES,
  LECTURE_RESOURCE_SLUG,
  TEACHING_RESOURCE_REGISTRY,
  TEACHING_RESOURCE_SLUG,
  collectStaleManaged,
  lectureCatalogue,
  publicLectureManifest,
  sha256,
  validateLectureReleaseDirectory,
  validateReleaseDirectory,
} from "./teaching-resource-policy.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sibling = resolve(process.env.SCIENCEPROJECT_DIR || resolve(root, "../ScienceProject"));
const generatedCatalogue = resolve(root, "src/data/generated/teaching-lecture-catalogue.json");

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function syncResource(resource) {
  const siblingRelease = resolve(sibling, resource.siblingRelease);
  const publicDir = resolve(root, resource.publicDirectory);
  const syncManifestPath = resolve(publicDir, "managed-assets.json");
  let sourceDir;
  let source;
  let allowManagedReceipt = false;
  if (await exists(siblingRelease)) {
    sourceDir = siblingRelease;
    source = "sibling private ScienceProject release/public allowlist";
  } else if (await exists(resolve(publicDir, "manifest.json"))) {
    sourceDir = publicDir;
    source = "committed public teaching-resource snapshot";
    allowManagedReceipt = true;
    console.warn(`Sibling ScienceProject release is unavailable for ${resource.slug}; validating the committed public snapshot.`);
  } else {
    console.warn(`Teaching resource ${resource.slug} is not available yet; sync skipped.`);
    return null;
  }

  const manifest = resource.slug === TEACHING_RESOURCE_SLUG
    ? await validateReleaseDirectory(sourceDir, { allowManagedReceipt })
    : await validateLectureReleaseDirectory(sourceDir, { allowManagedReceipt });
  const approved = resource.slug === TEACHING_RESOURCE_SLUG
    ? APPROVED_FILES
    : ["manifest.json", ...manifest.assets.map((asset) => asset.file)];
  await mkdir(publicDir, { recursive: true });

  let previous = { assets: [] };
  try { previous = JSON.parse((await readFile(syncManifestPath, "utf8")).replace(/^\uFEFF/, "")); } catch {}
  const assets = [];
  const expected = new Set();
  for (const filename of approved) {
    const publicPath = `/resources/${resource.slug}/${filename}`;
    const sourcePath = resolve(sourceDir, filename);
    const destination = resolve(publicDir, filename);
    expected.add(publicPath);
    const bytes = resource.slug === LECTURE_RESOURCE_SLUG && filename === "manifest.json"
      ? Buffer.from(`${JSON.stringify(publicLectureManifest(manifest), null, 2)}\n`, "utf8")
      : await readFile(sourcePath);
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
    resource: { slug: manifest.slug, coverage: manifest.coverage, revision_date: manifest.revision_date, unit_count: manifest.units?.length },
    assets,
    stale,
  };
  await writeFile(syncManifestPath, `${JSON.stringify(syncManifest, null, 2)}\n`);
  if (resource.slug === LECTURE_RESOURCE_SLUG) {
    await mkdir(dirname(generatedCatalogue), { recursive: true });
    await writeFile(generatedCatalogue, `${JSON.stringify(lectureCatalogue(manifest), null, 2)}\n`);
  }
  console.log(`Synchronized ${assets.length}/${approved.length} approved teaching assets for ${resource.slug}; ${stale.length} stale asset(s) preserved.`);
  return manifest;
}

for (const resource of TEACHING_RESOURCE_REGISTRY) await syncResource(resource);
