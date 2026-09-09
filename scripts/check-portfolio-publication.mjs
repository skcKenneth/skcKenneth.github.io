import { existsSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { validatePublishSvg } from "./science-sync-policy.mjs";
import { checkResearchArticles, researchArticles } from "./check-research-articles.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
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
const requestedSlugIndex = process.argv.indexOf("--slug");
const requestedSlug = requestedSlugIndex >= 0 ? process.argv[requestedSlugIndex + 1] : "";
if (requestedSlugIndex >= 0 && ![...portfolioSlugs, ...Object.keys(researchArticles)].includes(requestedSlug)) {
  throw new Error(`--slug must name one portfolio project; received ${requestedSlug || "<missing>"}`);
}
const selectedSlugs = requestedSlug ? portfolioSlugs.filter(slug => slug === requestedSlug) : portfolioSlugs;
const minimumFigures = 4;
const errors = [];
const inventory = [];

function articlePath(collection, slug) {
  const directory = join(root, "src", "content", collection);
  for (const extension of [".md", ".mdx"]) {
    const candidate = join(directory, `${slug}${extension}`);
    if (existsSync(candidate)) return candidate;
  }
  return join(directory, `${slug}.md`);
}

function splitMarkdown(path) {
  if (!existsSync(path)) {
    errors.push(`${relative(root, path)}: missing required article`);
    return null;
  }
  const source = readFileSync(path, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    errors.push(`${relative(root, path)}: missing readable frontmatter`);
    return null;
  }
  return { path, frontmatter: match[1], body: match[2] };
}

function frontmatterValue(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+)["']?\\s*$`, "m"));
  return match?.[1]?.trim() ?? "";
}

function semanticFigures(body) {
  return [...body.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/gi)].flatMap((figureMatch) => {
    const figure = figureMatch[1];
    const image = figure.match(/<img\b([^>]*)>/i);
    const caption = figure.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1]?.trim() ?? "";
    if (!image) return [{ src: "", alt: "", caption }];
    const src = image[1].match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]?.trim() ?? "";
    const alt = image[1].match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1]?.trim() ?? "";
    return [{ src, alt, caption }];
  });
}

const projectSnapshotPath = join(root, "src", "data", "generated", "science-projects.json");
const assetSnapshotPath = join(root, "public", "science", "asset-manifest.json");
const projects = JSON.parse(readFileSync(projectSnapshotPath, "utf8"));
const assetSnapshot = JSON.parse(readFileSync(assetSnapshotPath, "utf8"));
const projectsBySlug = new Map(projects.map((project) => [project.slug, project]));
const currentAssets = new Map(
  (assetSnapshot.assets ?? []).map((asset) => [asset.public_path, asset]),
);

for (const slug of selectedSlugs) {
  const project = projectsBySlug.get(slug);
  const english = splitMarkdown(articlePath("writing", slug));
  const chinese = splitMarkdown(articlePath("writing-zh", slug));
  const englishProject = splitMarkdown(articlePath("projects", slug));
  const chineseProject = splitMarkdown(articlePath("projects-zh", slug));
  if (!project) {
    errors.push(`science-projects.json: missing portfolio project ${slug}`);
    continue;
  }

  const publishAssets = project.publish_assets ?? [];
  const approvedPaths = publishAssets.map((asset) => `/science/${slug}/${asset.filename}`);
  const approvedSet = new Set(approvedPaths);
  const figureQa = project.figure_qa ?? {};
  if (
    figureQa.status !== "PASS"
    || figureQa.original_size_reviewed !== true
    || figureQa.overlap_checked !== true
    || figureQa.clipping_checked !== true
    || typeof figureQa.artifact !== "string"
    || !figureQa.artifact.endsWith("/figures/visual_qa.json")
  ) {
    errors.push(
      `${slug}: missing PASS figure_qa evidence for original-size overlap and clipping review`,
    );
  }
  if (publishAssets.length < minimumFigures) {
    errors.push(`${slug}: ${publishAssets.length} approved assets; requires at least ${minimumFigures}`);
  }
  if (publishAssets.some((asset) => extname(asset.filename).toLowerCase() !== ".svg")) {
    errors.push(`${slug}: every portfolio publish asset must be an SVG`);
  }
  if (!project.local_hero_image || !approvedSet.has(project.local_hero_image)) {
    errors.push(`${slug}: generated local hero is not an approved publish asset`);
  }

  for (const publicPath of approvedPaths) {
    const record = currentAssets.get(publicPath);
    if (!record || record.status === "missing") {
      errors.push(`${slug}: asset manifest lacks current record ${publicPath}`);
      continue;
    }
    const path = join(root, "public", ...publicPath.split("/").filter(Boolean));
    if (!existsSync(path)) {
      errors.push(`${slug}: missing public SVG ${publicPath}`);
      continue;
    }
    try {
      validatePublishSvg(readFileSync(path, "utf8"), `${slug}/${record.filename}`);
    } catch (error) {
      errors.push(error.message);
    }
  }

  for (const [locale, article] of [["EN", english], ["ZH", chinese]]) {
    if (!article) continue;
    const figures = semanticFigures(article.body);
    const admitted = figures.filter((figure) => approvedSet.has(figure.src));
    const uniqueSources = new Set(admitted.map((figure) => figure.src));
    if (admitted.length < minimumFigures || uniqueSources.size < minimumFigures) {
      errors.push(
        `${relative(root, article.path)}: requires ${minimumFigures} unique approved semantic figures; `
        + `found ${admitted.length} admitted references and ${uniqueSources.size} unique sources`,
      );
    }
    for (const figure of admitted) {
      if (!figure.alt) errors.push(`${relative(root, article.path)}: ${figure.src} has empty alt text`);
      if (!figure.caption) errors.push(`${relative(root, article.path)}: ${figure.src} has empty figcaption`);
      if (locale === "ZH" && (figure.alt.match(/\p{Script=Han}/gu)?.length ?? 0) < 5) {
        errors.push(`${relative(root, article.path)}: ${figure.src} lacks localized Chinese alt text`);
      }
    }
    const hero = frontmatterValue(article.frontmatter, "heroImage");
    if (!approvedSet.has(hero)) {
      errors.push(`${relative(root, article.path)}: heroImage is not an approved ${slug} asset`);
    }
  }

  for (const projectEntry of [englishProject, chineseProject]) {
    if (!projectEntry) continue;
    const hero = frontmatterValue(projectEntry.frontmatter, "heroImage");
    if (!approvedSet.has(hero)) {
      errors.push(`${relative(root, projectEntry.path)}: heroImage is not an approved ${slug} asset`);
    }
    if (frontmatterValue(projectEntry.frontmatter, "codeAvailable") !== "true") {
      errors.push(`${relative(root, projectEntry.path)}: codeAvailable must be true for the two-repository portfolio`);
    }
    for (const field of ["technicalUrl", "repositoryUrl"]) {
      if (frontmatterValue(projectEntry.frontmatter, field)) {
        errors.push(`${relative(root, projectEntry.path)}: ${field} must stay unset while the technical repository is private`);
      }
    }
  }

  inventory.push({
    slug,
    approved: publishAssets.length,
    englishFigures: english ? new Set(semanticFigures(english.body).map((figure) => figure.src).filter((src) => approvedSet.has(src))).size : 0,
    chineseFigures: chinese ? new Set(semanticFigures(chinese.body).map((figure) => figure.src).filter((src) => approvedSet.has(src))).size : 0,
  });
}

for (const row of inventory) {
  console.log(`${row.slug}: approved ${row.approved}; EN figures ${row.englishFigures}; ZH figures ${row.chineseFigures}`);
}

errors.push(...checkResearchArticles(requestedSlug ? Object.keys(researchArticles).filter(slug => slug === requestedSlug) : undefined));

if (errors.length) {
  console.error(`Portfolio publication check failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(`Portfolio publication check passed for ${selectedSlugs.length} bilingual project articles.`);
