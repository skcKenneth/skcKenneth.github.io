import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectStaleScienceAssets,
  resolveWithin,
  validateScienceProjects,
} from "./science-sync-policy.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectSnapshot = resolve(root, "src/data/generated/science-projects.json");
const assetSnapshot = resolve(root, "src/data/generated/science-assets.json");
const publicRoot = resolve(root, "public/science");
const publicManifest = resolve(publicRoot, "asset-manifest.json");
const sibling = resolve(process.env.SCIENCEPROJECT_DIR || resolve(root, "../ScienceProject"));
const localManifest = resolve(sibling, "site-manifest/projects.json");
const remoteBase = process.env.SCIENCEPROJECT_RAW_BASE || "";

async function exists(path) { try { await access(path); return true; } catch { return false; } }
function sha256(bytes) { return createHash("sha256").update(bytes).digest("hex"); }

let projects; let source = "committed fallback snapshot"; let sourceMode = "fallback";
if (await exists(localManifest)) {
  try {
    projects = validateScienceProjects(JSON.parse(await readFile(localManifest, "utf8")));
  } catch (error) {
    throw new Error(`Sibling ScienceProject manifest is invalid: ${error.message}`);
  }
  source = "sibling private ScienceProject";
  sourceMode = "local";
} else if (remoteBase) {
  try {
    const response = await fetch(`${remoteBase}site-manifest/projects.json`, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`manifest HTTP ${response.status}`);
    projects = validateScienceProjects(await response.json());
  } catch (error) {
    throw new Error(`Authenticated ScienceProject manifest is unavailable: ${error.message}`);
  }
  source = "authenticated remote manifest";
  sourceMode = "remote";
} else {
  console.warn("Sibling ScienceProject is unavailable; using the validated committed fallback snapshot.");
  projects = validateScienceProjects(JSON.parse(await readFile(projectSnapshot, "utf8")));
}

await mkdir(publicRoot, { recursive: true });
let previous = { assets: [] };
try { previous = JSON.parse(await readFile(publicManifest, "utf8")); } catch {}
const assets = []; const expectedDestinations = new Set();

for (const project of projects) {
  for (const asset of project.publish_assets || []) {
    const sourcePath = asset.source_path || `${project.project_root}/figures/publish/${asset.filename}`;
    const publicPath = `/science/${project.slug}/${asset.filename}`;
    const destination = resolve(publicRoot, project.slug, asset.filename);
    expectedDestinations.add(publicPath);
    const record = { project: project.slug, filename: asset.filename, public_path: publicPath, source_path: sourcePath, alt: asset.alt, caption: asset.caption, generated_by: asset.generated_by, status: "missing" };
    try {
      let bytes;
      if (sourceMode === "local") {
        bytes = await readFile(resolveWithin(sibling, sourcePath, `${project.slug}/${asset.filename}`));
      }
      else if (sourceMode === "remote") {
        const url = `${remoteBase}${sourcePath.split("/").map(encodeURIComponent).join("/")}`;
        const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        bytes = Buffer.from(await response.arrayBuffer());
      } else bytes = await readFile(destination);
      await mkdir(dirname(destination), { recursive: true });
      const hash = sha256(bytes); let existingHash;
      try { existingHash = sha256(await readFile(destination)); } catch {}
      if (existingHash !== hash) { await writeFile(destination, bytes); record.status = existingHash ? "updated" : "copied"; }
      else record.status = "current";
      record.sha256 = hash; record.bytes = bytes.length;
    } catch (error) {
      console.warn(`Missing approved asset ${project.slug}/${asset.filename}: ${error.message}`);
    }
    assets.push(record);
  }
  const heroName = project.hero_image?.split("/").pop();
  if (heroName && expectedDestinations.has(`/science/${project.slug}/${heroName}`)) project.local_hero_image = `/science/${project.slug}/${heroName}`;
}

const stale = collectStaleScienceAssets(previous, expectedDestinations);
for (const asset of stale) console.warn(`Stale managed asset preserved (not deleted): ${asset.public_path}`);
const updatedAt = projects.map((p) => p.last_updated).sort().at(-1) || null;
const manifest = { source, source_of_truth: "ScienceProject figures/publish only", editorial_policy: "Article bodies are manually authored in skcKenneth.github.io and are never generated or overwritten by sync.", updated_at: updatedAt, assets, stale };
await writeFile(publicManifest, `${JSON.stringify(manifest, null, 2)}\n`);
await mkdir(dirname(assetSnapshot), { recursive: true });
await writeFile(assetSnapshot, `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(projectSnapshot, `${JSON.stringify(projects, null, 2)}\n`);

const missing = assets.filter((asset) => asset.status === "missing").length;
console.log(`Synchronized ${assets.length - missing}/${assets.length} approved figures from ${source}; ${missing} missing; ${stale.length} stale assets preserved.`);
if (missing) {
  console.error(`Science asset sync failed: ${missing} declared publish asset${missing === 1 ? " is" : "s are"} missing.`);
  process.exitCode = 1;
}
