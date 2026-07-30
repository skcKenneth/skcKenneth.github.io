import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const strict = process.argv.includes("--strict");
const collections = [
  ["projects", "projects-zh"],
  ["research", "research-zh"],
  ["writing", "writing-zh"],
  ["teaching", "teaching-zh"],
];
const errors = [];

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(target);
    return /\.(md|mdx)$/i.test(entry.name) ? [target] : [];
  }));
  return nested.flat();
}

function frontmatterValue(source, field) {
  const match = source.match(new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+)["']?\\s*$`, "m"));
  return match?.[1]?.trim();
}

async function inventory(directory, key, requireChinese = false) {
  const files = await markdownFiles(directory);
  return Promise.all(files.map(async (file) => {
    const source = await readFile(file, "utf8");
    const slug = frontmatterValue(source, key);
    if (!slug) errors.push(`${path.relative(root, file)}: missing ${key}`);
    const hanCharacters = source.match(/\p{Script=Han}/gu)?.length ?? 0;
    if (requireChinese && hanCharacters < 40) {
      errors.push(`${path.relative(root, file)}: Chinese edition has only ${hanCharacters} Han characters`);
    }
    return { file: path.relative(root, file), slug };
  }));
}

for (const [englishName, chineseName] of collections) {
  const englishRoot = path.join(root, "src", "content", englishName);
  const chineseRoot = path.join(root, "src", "content", chineseName);
  const english = await inventory(englishRoot, "slug");
  const chinese = await inventory(chineseRoot, "sourceSlug", true);
  const englishSlugs = new Set();
  const chineseSlugs = new Set();

  for (const entry of english) {
    if (englishSlugs.has(entry.slug)) errors.push(`${entry.file}: duplicate English slug ${entry.slug}`);
    englishSlugs.add(entry.slug);
  }
  for (const entry of chinese) {
    if (chineseSlugs.has(entry.slug)) errors.push(`${entry.file}: duplicate Chinese sourceSlug ${entry.slug}`);
    chineseSlugs.add(entry.slug);
  }

  const missing = [...englishSlugs].filter((slug) => !chineseSlugs.has(slug)).sort();
  const orphaned = [...chineseSlugs].filter((slug) => !englishSlugs.has(slug)).sort();
  if (missing.length) errors.push(`${englishName}: missing Chinese editions: ${missing.join(", ")}`);
  if (orphaned.length) errors.push(`${chineseName}: editions without English sources: ${orphaned.join(", ")}`);

  console.log(
    `${englishName}: ${englishSlugs.size - missing.length}/${englishSlugs.size} English entries have Chinese editions; `
    + `${orphaned.length} orphaned translation${orphaned.length === 1 ? "" : "s"}.`,
  );
}

if (errors.length) {
  const message = `Bilingual content check failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join("\n")}`;
  if (strict) {
    console.error(message);
    process.exit(1);
  }
  console.warn(message);
}
