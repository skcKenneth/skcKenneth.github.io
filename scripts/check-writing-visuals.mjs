import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const writingDir = join(root, "src", "content", "writing");
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

function svgTextIsBlack(svg) {
  const styleBlocks = [...svg.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .join("\n");
  const blackClasses = new Set();
  for (const match of styleBlocks.matchAll(/\.([A-Za-z0-9_-]+)\s*\{[^}]*?fill\s*:\s*(?:#(?:000|111)(?:000|111)?|black)\b[^}]*\}/gi)) {
    blackClasses.add(match[1]);
  }

  const textElements = [...svg.matchAll(/<text\b([^>]*)>/gi)];
  return textElements.every((match) => {
    const attrs = match[1];
    if (/\bfill\s*=\s*["'](?:#(?:000|111)(?:000|111)?|black)["']/i.test(attrs)) return true;
    if (/\bstyle\s*=\s*["'][^"']*fill\s*:\s*(?:#(?:000|111)(?:000|111)?|black)\b/i.test(attrs)) return true;
    const classes = attrs.match(/\bclass\s*=\s*["']([^"']+)["']/i)?.[1]?.split(/\s+/) ?? [];
    return classes.some((className) => blackClasses.has(className));
  });
}

for (const name of readdirSync(writingDir)) {
  if (![".md", ".mdx"].includes(extname(name))) continue;

  const source = readFileSync(join(writingDir, name), "utf8");
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
  const required = words >= 1200 ? 2 : words >= 900 ? 1 : 0;
  if (!required) continue;

  const images = imageReferences(body);
  const localImages = images.filter(({ src }) => allowedRoots.some((prefix) => src.startsWith(prefix)));
  if (localImages.length < required) {
    errors.push(name + ": " + words + " words require " + required + " local figure(s), found " + localImages.length);
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
      if (!/<title\b/i.test(svg) || !/<desc\b/i.test(svg)) {
        errors.push(name + ": " + src + " must contain SVG title and description elements");
      }
      if (!svgTextIsBlack(svg)) {
        errors.push(name + ": " + src + " contains figure text that is not explicitly black");
      }
    }
  }
}

if (errors.length) {
  console.error("Writing visual check failed:\n" + errors.map((error) => "- " + error).join("\n"));
  process.exit(1);
}

console.log("Writing visual check passed.");
