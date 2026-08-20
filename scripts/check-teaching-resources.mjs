import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  APPROVED_FILES,
  LECTURE_RESOURCE_SLUG,
  TEACHING_RESOURCE_SLUG,
  lectureCatalogue,
  parseLectureManifest,
  parseManifest,
  sha256,
  validateLectureReleaseDirectory,
} from "./teaching-resource-policy.mjs";

const root = process.cwd();
const macauDir = resolve(root, `public/resources/${TEACHING_RESOURCE_SLUG}`);
const macau = parseManifest(await readFile(resolve(macauDir, "manifest.json"), "utf8"));
const macauManaged = JSON.parse((await readFile(resolve(macauDir, "managed-assets.json"), "utf8")).replace(/^\uFEFF/, ""));
for (const filename of [...APPROVED_FILES, "managed-assets.json"]) await access(resolve(macauDir, filename));
for (const asset of macau.assets) {
  const bytes = await readFile(resolve(macauDir, asset.file));
  if (bytes.length !== asset.bytes || sha256(bytes) !== asset.sha256) throw new Error(`Published asset mismatch: ${asset.file}`);
}
if (macauManaged.assets.length !== APPROVED_FILES.length || macauManaged.assets.some((asset) => !asset.managed)) throw new Error("Managed Macau teaching-resource receipt is incomplete.");

const lectureDir = resolve(root, `public/resources/${LECTURE_RESOURCE_SLUG}`);
const lecture = parseLectureManifest(await readFile(resolve(lectureDir, "manifest.json"), "utf8"));
await validateLectureReleaseDirectory(lectureDir, { allowManagedReceipt: true });
const lectureManaged = JSON.parse((await readFile(resolve(lectureDir, "managed-assets.json"), "utf8")).replace(/^\uFEFF/, ""));
const expectedLecturePaths = new Set(["manifest.json", ...lecture.assets.map((asset) => asset.file)].map((file) => `/resources/${LECTURE_RESOURCE_SLUG}/${file}`));
if (lectureManaged.assets.length !== expectedLecturePaths.size || lectureManaged.assets.some((asset) => !asset.managed || !expectedLecturePaths.has(asset.public_path))) throw new Error("Managed lecture-resource receipt is incomplete.");
for (const asset of lecture.assets) {
  const bytes = await readFile(resolve(lectureDir, asset.file));
  if (bytes.length !== asset.bytes || sha256(bytes) !== asset.sha256) throw new Error(`Published lecture asset mismatch: ${asset.file}`);
}

const catalogue = JSON.parse(await readFile(resolve(root, "src/data/generated/teaching-lecture-catalogue.json"), "utf8"));
if (catalogue.units.length !== 27 || catalogue.collections.length !== 3 || !catalogue.datasets.some((asset) => asset.file.endsWith("student-datasets.zip"))) throw new Error("Generated lecture catalogue is incomplete.");
if (JSON.stringify(catalogue) !== JSON.stringify(lectureCatalogue(lecture))) throw new Error("Generated lecture catalogue does not match the synchronized public manifest.");
const lectureManifestText = await readFile(resolve(lectureDir, "manifest.json"), "utf8");
if (/source_path|source[\\/]archives|[A-Z]:\\|ScienceProject|\.tex\b/i.test(lectureManifestText)) throw new Error("Published lecture manifest exposes a private source boundary.");
for (const contentPath of ["src/content/teaching/macau-school-math-competition.mdx", "src/content/teaching-zh/macau-school-math-competition.mdx"]) {
  const source = await readFile(resolve(root, contentPath), "utf8");
  for (const required of [`/resources/${TEACHING_RESOURCE_SLUG}/solution-companion.pdf`, "https://www.dsedj.gov.mo/cre/science/comp/info.html"]) if (!source.includes(required)) throw new Error(`${contentPath} is missing ${required}`);
  if (/ScienceProject|technicalRepository|source-papers|\.tex\b/.test(source)) throw new Error(`${contentPath} exposes a private technical boundary.`);
}
const publicText = [
  "src/components/LectureLibrary.astro", "src/components/LectureUnitReader.astro",
  "src/pages/teaching/mathematical-modeling-lecture-programme/[unit].astro",
  "src/pages/zh/teaching/mathematical-modeling-lecture-programme/[unit].astro",
].map((path) => readFile(resolve(root, path), "utf8"));
for (const source of await Promise.all(publicText)) if (/ScienceProject|[A-Z]:\\|\.tex\b|CDSJ5/i.test(source)) throw new Error("Lecture library exposes a private source boundary or institution identifier.");

console.log(`Validated ${macau.coverage.questions} competition solutions, ${lecture.units.length} bilingual lecture units, and ${lecture.assets.length} lecture assets.`);
