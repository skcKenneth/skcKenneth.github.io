import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { APPROVED_FILES, TEACHING_RESOURCE_SLUG, parseManifest, sha256 } from "./teaching-resource-policy.mjs";

const root = process.cwd();
const publicDir = resolve(root, `public/resources/${TEACHING_RESOURCE_SLUG}`);
const manifest = parseManifest(await readFile(resolve(publicDir, "manifest.json"), "utf8"));
const managed = JSON.parse((await readFile(resolve(publicDir, "managed-assets.json"), "utf8")).replace(/^\uFEFF/, ""));

for (const filename of [...APPROVED_FILES, "managed-assets.json"]) await access(resolve(publicDir, filename));
for (const asset of manifest.assets) {
  const bytes = await readFile(resolve(publicDir, asset.file));
  if (bytes.length !== asset.bytes || sha256(bytes) !== asset.sha256) throw new Error(`Published asset mismatch: ${asset.file}`);
}
if (managed.assets.length !== APPROVED_FILES.length || managed.assets.some((asset) => !asset.managed)) {
  throw new Error("Managed teaching-resource receipt is incomplete.");
}

for (const contentPath of [
  "src/content/teaching/macau-school-math-competition.mdx",
  "src/content/teaching-zh/macau-school-math-competition.mdx",
]) {
  const source = await readFile(resolve(root, contentPath), "utf8");
  for (const required of [
    `/resources/${TEACHING_RESOURCE_SLUG}/solution-companion.pdf`,
    "https://www.dsedj.gov.mo/cre/science/comp/info.html",
  ]) if (!source.includes(required)) throw new Error(`${contentPath} is missing ${required}`);
  if (/ScienceProject|technicalRepository|source-papers|\.tex\b/.test(source)) throw new Error(`${contentPath} exposes a private technical boundary.`);
}

console.log(`Validated ${manifest.coverage.questions} published solutions and ${managed.assets.length} managed teaching assets.`);
