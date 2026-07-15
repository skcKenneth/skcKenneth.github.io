import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectSnapshot = resolve(root, "src/data/generated/science-projects.json");
const assetSnapshot = resolve(root, "src/data/generated/science-assets.json");
const publicRoot = resolve(root, "public/science");
const publicManifest = resolve(publicRoot, "asset-manifest.json");
const sibling = resolve(process.env.SCIENCEPROJECT_DIR || resolve(root, "../ScienceProject"));
const localManifest = resolve(sibling, "site-manifest/projects.json");
const remoteBase = process.env.SCIENCEPROJECT_RAW_BASE || "";
const supported = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg"]);
const filenamePattern = /^[a-z0-9][a-z0-9._-]*$/;

async function exists(path) { try { await access(path); return true; } catch { return false; } }
function sha256(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
function validate(projects) {
  if (!Array.isArray(projects)) throw new Error("manifest root must be an array");
  const seen = new Set();
  for (const [index, item] of projects.entries()) {
    for (const key of ["slug", "title", "summary", "status", "year", "topics", "methods", "featured", "technical_url", "repository_url", "code_available", "data_available", "student_suitable", "last_updated"]) if (!(key in item)) throw new Error(`projects[${index}].${key} is required`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || seen.has(item.slug)) throw new Error(`invalid or duplicate slug: ${item.slug}`);
    seen.add(item.slug);
    for (const asset of item.publish_assets || []) {
      const ext = asset.filename.slice(asset.filename.lastIndexOf(".")).toLowerCase();
      if (!filenamePattern.test(asset.filename)) throw new Error(`unsafe publish filename: ${item.slug}/${asset.filename}`);
      if (!supported.has(ext)) throw new Error(`unsupported publish format: ${item.slug}/${asset.filename}`);
      if (!item.project_root) throw new Error(`project_root required for ${item.slug}`);
      const approvedPath = `${item.project_root}/figures/publish/${asset.filename}`;
      if (item.hero_image && !item.hero_image.includes("/figures/publish/")) throw new Error(`hero_image must be approved: ${item.slug}`);
      asset.source_path = approvedPath;
    }
  }
  return projects;
}

let projects; let source = "committed fallback snapshot"; let sourceMode = "fallback";
try {
  if (await exists(localManifest)) {
    projects = validate(JSON.parse(await readFile(localManifest, "utf8"))); source = "sibling private ScienceProject"; sourceMode = "local";
  } else if (remoteBase) {
    const response = await fetch(`${remoteBase}site-manifest/projects.json`, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`manifest HTTP ${response.status}`);
    projects = validate(await response.json()); source = "authenticated remote manifest"; sourceMode = "remote";
  } else {
    throw new Error("private ScienceProject is unavailable and SCIENCEPROJECT_RAW_BASE is not configured");
  }
} catch (error) {
  console.warn(`ScienceProject manifest unavailable (${error.message}); using the validated fallback snapshot.`);
  projects = validate(JSON.parse(await readFile(projectSnapshot, "utf8")));
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
      if (sourceMode === "local") bytes = await readFile(resolve(sibling, sourcePath));
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

const stale = (previous.assets || []).filter((asset) => !expectedDestinations.has(asset.public_path)).map((asset) => ({ ...asset, status: "stale-preserved" }));
for (const asset of stale) console.warn(`Stale managed asset preserved (not deleted): ${asset.public_path}`);
const updatedAt = projects.map((p) => p.last_updated).sort().at(-1) || null;
const manifest = { source, source_of_truth: "ScienceProject figures/publish only", editorial_policy: "Article bodies are manually authored in skcKenneth.github.io and are never generated or overwritten by sync.", updated_at: updatedAt, assets, stale };
await writeFile(publicManifest, `${JSON.stringify(manifest, null, 2)}\n`);
await mkdir(dirname(assetSnapshot), { recursive: true });
await writeFile(assetSnapshot, `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(projectSnapshot, `${JSON.stringify(projects, null, 2)}\n`);

const missing = assets.filter((asset) => asset.status === "missing").length;
console.log(`Synchronized ${assets.length - missing}/${assets.length} approved figures from ${source}; ${missing} missing; ${stale.length} stale assets preserved.`);
