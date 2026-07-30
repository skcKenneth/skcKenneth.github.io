import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  resolveWithin,
  safeRelativePath,
  scienceAssetFilenamePattern,
  scienceProjectSlugPattern,
  supportedScienceAssetExtensions,
  validatePublishSvg,
} from "./science-sync-policy.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicRoot = resolve(root, "public/science");
const manifestPath = resolve(publicRoot, "asset-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const errors = [];
const warnings = [];
const managed = new Set();

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = resolve(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(target));
    else output.push(target);
  }
  return output;
}

if (!Array.isArray(manifest.assets) || !Array.isArray(manifest.stale)) {
  errors.push("asset manifest must contain assets and stale arrays");
}

for (const asset of manifest.assets ?? []) {
  const label = `${asset.project}/${asset.filename}`;
  const extension = extname(asset.filename ?? "").toLowerCase();
  if (!scienceProjectSlugPattern.test(asset.project ?? "")) {
    errors.push(`${label}: unsafe project slug`);
  }
  if (!scienceAssetFilenamePattern.test(asset.filename ?? "")) {
    errors.push(`${label}: unsafe filename`);
  }
  if (!supportedScienceAssetExtensions.has(extension)) {
    errors.push(`${label}: unsupported format`);
  }
  const expectedPublicPath = `/science/${asset.project}/${asset.filename}`;
  if (asset.public_path !== expectedPublicPath) {
    errors.push(`${label}: public_path must be ${expectedPublicPath}`);
  }
  try {
    safeRelativePath(asset.source_path, `${label}.source_path`);
    if (asset.source_path !== `${asset.source_path.split("/figures/publish/")[0]}/figures/publish/${asset.filename}`) {
      errors.push(`${label}: source_path is not an exact figures/publish path`);
    }
  } catch (error) {
    errors.push(`${label}: ${error.message}`);
  }
  if (asset.status === "missing") errors.push(`${label}: status is missing`);

  managed.add(asset.public_path);
  try {
    const relativeAssetPath = asset.public_path.replace(/^\/science\//, "");
    const file = resolveWithin(publicRoot, relativeAssetPath, `${label}.public_path`);
    const bytes = await readFile(file);
    if (asset.bytes !== bytes.length) errors.push(`${label}: byte count does not match manifest`);
    if (asset.sha256 !== sha256(bytes)) errors.push(`${label}: SHA-256 does not match manifest`);
    if (extension === ".svg") validatePublishSvg(bytes.toString("utf8"), label);
  } catch (error) {
    errors.push(`${label}: ${error.message}`);
  }
}

for (const asset of manifest.stale ?? []) {
  if (asset.status !== "stale-preserved") {
    errors.push(`${asset.public_path}: stale record has invalid status`);
  }
  if (managed.has(asset.public_path)) {
    errors.push(`${asset.public_path}: cannot be both current and stale`);
  }
  managed.add(asset.public_path);
}

for (const file of await walk(publicRoot)) {
  const rel = relative(publicRoot, file).split("\\").join("/");
  if (rel === "asset-manifest.json") continue;
  const publicPath = `/science/${rel}`;
  if (!managed.has(publicPath)) warnings.push(`Unmanaged public asset preserved for review: ${publicPath}`);
}

if (warnings.length) console.warn(warnings.join("\n"));
if (errors.length) {
  console.error(`Science asset check failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(
  `Checked ${manifest.assets.length} current and ${manifest.stale.length} stale science assets; `
  + `${warnings.length} unmanaged file${warnings.length === 1 ? "" : "s"} preserved.`,
);
