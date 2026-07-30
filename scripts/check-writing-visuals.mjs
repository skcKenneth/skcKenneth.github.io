import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { validatePublishSvg } from "./science-sync-policy.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const writingDirectories = [
  { directory: join(root, "src", "content", "writing"), locale: "en" },
  { directory: join(root, "src", "content", "writing-zh"), locale: "zh" },
];
const publicDir = join(root, "public");
const rolloutDate = "2026-07-16";
const allowedRoots = ["/images/", "/science/"];
const errors = [];

function frontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp("^" + key + ":\\s*(.+?)\\s*$", "m"));
  return match?.[1]?.replace(/^['"]|['"]$/g, "") ?? "";
}

function countWords(markdown) {
  return markdown
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[$*_>#|~-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(target);
    return [".md", ".mdx"].includes(extname(entry.name).toLowerCase()) ? [target] : [];
  });
}

function imageReferences(body) {
  const images = [];
  for (const match of body.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^)]*)?\)/g)) {
    images.push({ src: match[2], alt: match[1].trim() });
  }
  for (const match of body.matchAll(/<img\b([^>]*?)\bsrc\s*=\s*["']([^"']+)["']([^>]*)>/gi)) {
    const attrs = match[1] + " " + match[3];
    const alt = attrs.match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1]?.trim() ?? "";
    images.push({ src: match[2], alt });
  }
  return images;
}

for (const { directory, locale } of writingDirectories) {
 for (const file of markdownFiles(directory)) {
  const name = relative(root, file);
  const source = readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    errors.push(name + ": missing readable frontmatter");
    continue;
  }

  const [, frontmatter, body] = match;
  const date = frontmatterValue(frontmatter, "date");
  const archived = frontmatterValue(frontmatter, "archived") === "true";
  if (archived || !date || date < rolloutDate) continue;

  const words = countWords(body);
  const hanCharacters = body.match(/\p{Script=Han}/gu)?.length ?? 0;
  const required = locale === "zh"
    ? hanCharacters >= 1000 ? 2 : hanCharacters >= 700 ? 1 : 0
    : words >= 1200 ? 2 : words >= 900 ? 1 : 0;
  if (!required) continue;

  const images = imageReferences(body);
  const localImages = images.filter(({ src }) => allowedRoots.some((prefix) => src.startsWith(prefix)));
  if (localImages.length < required) {
    const measure = locale === "zh" ? `${hanCharacters} Han characters` : `${words} words`;
    errors.push(name + ": " + measure + " require " + required + " local figure(s), found " + localImages.length);
  }

  const figureCount = (body.match(/<figure\b/gi) ?? []).length;
  const captionCount = (body.match(/<figcaption\b/gi) ?? []).length;
  if (figureCount < required || captionCount < required) {
    errors.push(name + ": " + required + " semantic figure/caption pair(s) required, found " + figureCount + "/" + captionCount);
  }

  for (const { src, alt } of localImages) {
    const cleanSrc = decodeURIComponent(src.split(/[?#]/, 1)[0]);
    const assetPath = join(publicDir, ...cleanSrc.split("/").filter(Boolean));
    if (!alt) errors.push(name + ": " + src + " has empty alt text");
    if (!existsSync(assetPath)) {
      errors.push(name + ": missing local figure " + src);
      continue;
    }
    if (extname(assetPath).toLowerCase() === ".svg") {
      const svg = readFileSync(assetPath, "utf8");
      try { validatePublishSvg(svg, `${name}: ${src}`); }
      catch (error) { errors.push(error.message); }
    }
  }
 }
}

if (errors.length) {
  console.error("Writing visual check failed:\n" + errors.map((error) => "- " + error).join("\n"));
  process.exit(1);
}

console.log("Writing visual check passed.");
