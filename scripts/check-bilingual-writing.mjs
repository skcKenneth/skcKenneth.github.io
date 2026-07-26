import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const englishRoot = path.join(root, "src", "content", "writing");
const chineseRoot = path.join(root, "src", "content", "writing-zh");
const strict = process.argv.includes("--strict");

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

async function inventory(directory, key) {
  const files = await markdownFiles(directory);
  const entries = await Promise.all(files.map(async (file) => {
    const source = await readFile(file, "utf8");
    return {
      file: path.relative(root, file),
      slug: frontmatterValue(source, key),
    };
  }));
  return entries;
}

const english = await inventory(englishRoot, "slug");
const chinese = await inventory(chineseRoot, "sourceSlug");
const englishSlugs = new Set(english.map((entry) => entry.slug).filter(Boolean));
const chineseSlugs = new Set(chinese.map((entry) => entry.slug).filter(Boolean));

const missing = [...englishSlugs].filter((slug) => !chineseSlugs.has(slug)).sort();
const orphaned = [...chineseSlugs].filter((slug) => !englishSlugs.has(slug)).sort();

console.log(`Bilingual writing coverage: ${englishSlugs.size - missing.length}/${englishSlugs.size}`);
if (missing.length) console.log(`Missing Chinese articles (${missing.length}):\n- ${missing.join("\n- ")}`);
if (orphaned.length) console.log(`Chinese articles without an English source (${orphaned.length}):\n- ${orphaned.join("\n- ")}`);

if (strict && (missing.length || orphaned.length)) process.exitCode = 1;
