import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import readingTime from "reading-time";

const root = fileURLToPath(new URL("..", import.meta.url));
const minimumMinutes = 21;
const portfolioSlugs = [
  "can-a-mesh-preserve-the-event",
  "when-effective-diffusivity-stops-being-effective",
  "how-rare-is-a-flip",
  "when-polynomial-chaos-crosses-a-fold",
  "when-a-reduced-ventilation-model-leaves-its-training-regime",
  "assimilating-what-you-can-observe",
  "random-stress-tests-are-not-certificates",
  "one-integrator-across-the-fast-slow-boundary",
  "from-simulation-to-certificate",
  "when-a-traffic-solver-invents-a-jam",
];
const researchArticleSlugs = [
  "when-early-warnings-cannot-tell-the-difference",
  "when-starting-over-finds-the-target-faster",
  "when-solar-power-changes-fast",
  "when-taking-turns-makes-a-system-unstable",
];
const checkedSlugs = [...portfolioSlugs, ...researchArticleSlugs];
const requestedSlugIndex = process.argv.indexOf("--slug");
const requestedSlug = requestedSlugIndex >= 0 ? process.argv[requestedSlugIndex + 1] : "";
if (requestedSlugIndex >= 0 && !checkedSlugs.includes(requestedSlug)) {
  throw new Error(`--slug must name one portfolio article; received ${requestedSlug || "<missing>"}`);
}
const selectedSlugs = requestedSlug ? [requestedSlug] : checkedSlugs;

const errors = [];
const rows = [];

function splitMarkdown(path) {
  let source;
  try {
    source = readFileSync(path, "utf8");
  } catch (error) {
    errors.push(`${relative(root, path)}: ${error.code === "ENOENT" ? "missing required article" : error.message}`);
    return null;
  }
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    errors.push(`${relative(root, path)}: missing readable frontmatter`);
    return null;
  }
  return { frontmatter: match[1], body: match[2] };
}

function articlePath(collection, slug) {
  const base = join(root, "src", "content", collection);
  const markdown = join(base, `${slug}.md`);
  const mdx = join(base, `${slug}.mdx`);
  if (existsSync(markdown)) return markdown;
  if (existsSync(mdx)) return mdx;
  return markdown;
}

function hasReadingOverride(frontmatter) {
  return /^readingMinutes\s*:/m.test(frontmatter);
}

function checkSuspiciousEscapes(path, body) {
  const tabLine = body.split(/\r?\n/).findIndex((line) => line.includes("\t"));
  if (tabLine >= 0) {
    errors.push(`${relative(root, path)}: literal tab on body line ${tabLine + 1}; check for a damaged LaTeX \\t escape`);
  }
  for (const command of ["mathrm", "texttt"]) {
    const malformed = new RegExp(`(^|[^\\\\])${command}\\{`, "m").exec(body);
    if (malformed) {
      errors.push(`${relative(root, path)}: suspicious ${command}{ without a leading LaTeX backslash`);
    }
  }
}

function frontmatterValue(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+)["']?\\s*$`, "m"));
  return match?.[1]?.trim();
}

for (const slug of selectedSlugs) {
  const englishPath = articlePath("writing", slug);
  const chinesePath = articlePath("writing-zh", slug);
  const english = splitMarkdown(englishPath);
  const chinese = splitMarkdown(chinesePath);
  if (!english || !chinese) continue;

  if (hasReadingOverride(english.frontmatter)) {
    errors.push(`${relative(root, englishPath)}: readingMinutes override is forbidden`);
  }
  if (hasReadingOverride(chinese.frontmatter)) {
    errors.push(`${relative(root, chinesePath)}: readingMinutes override is forbidden`);
  }
  if (frontmatterValue(english.frontmatter, "slug") !== slug) {
    errors.push(`${relative(root, englishPath)}: frontmatter slug must equal ${slug}`);
  }
  if (frontmatterValue(chinese.frontmatter, "sourceSlug") !== slug) {
    errors.push(`${relative(root, chinesePath)}: sourceSlug must equal ${slug}`);
  }
  checkSuspiciousEscapes(englishPath, english.body);
  checkSuspiciousEscapes(chinesePath, chinese.body);

  // These are the same formulas used by the two live writing routes.
  const englishMinutes = readingTime(english.body || "").minutes;
  const chineseCharacters = (chinese.body.match(/\p{Script=Han}/gu) || []).length;
  const latinWords = (chinese.body.match(/\b[A-Za-z][A-Za-z'-]*\b/g) || []).length;
  const chineseMinutes = chineseCharacters / 450 + latinWords / 220;

  rows.push({ slug, englishMinutes, chineseMinutes, chineseCharacters, latinWords });
  const requiredMinimum = researchArticleSlugs.includes(slug) ? 22 : minimumMinutes;
  if (researchArticleSlugs.includes(slug) && (englishMinutes > 30 || chineseMinutes > 30)) {
    errors.push(slug + ": both language editions must be at most 30 raw minutes");
  }
  if (englishMinutes < requiredMinimum) {
    errors.push(
      `${relative(root, englishPath)}: ${englishMinutes.toFixed(2)} raw minutes; requires at least ${requiredMinimum}`,
    );
  }
  if (chineseMinutes < requiredMinimum) {
    errors.push(
      `${relative(root, chinesePath)}: ${chineseMinutes.toFixed(2)} raw minutes `
      + `(${chineseCharacters} Han characters, ${latinWords} Latin words); requires at least ${requiredMinimum}`,
    );
  }
}

for (const row of rows) {
  console.log(
    `${row.slug}: EN ${row.englishMinutes.toFixed(2)} min; `
    + `ZH ${row.chineseMinutes.toFixed(2)} min (${row.chineseCharacters} Han, ${row.latinWords} Latin)`,
  );
}

if (errors.length) {
  console.error(`Portfolio reading-time check failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(`Portfolio reading-time check passed for ${selectedSlugs.length * 2} articles.`);
