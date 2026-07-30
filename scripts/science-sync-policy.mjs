import { extname, isAbsolute, relative, resolve } from "node:path";

export const supportedScienceAssetExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
]);

export const scienceAssetFilenamePattern = /^[a-z0-9][a-z0-9._-]*$/;
export const scienceProjectSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function safeRelativePath(value, label = "path") {
  if (typeof value !== "string" || !value.length) {
    throw new Error(`${label} must be a non-empty relative path`);
  }
  if (isAbsolute(value) || /^[A-Za-z]:\//.test(value) || value.includes("\\") || value.includes("\0")) {
    throw new Error(`${label} must use a safe repository-relative path: ${value}`);
  }
  const segments = value.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw new Error(`${label} contains an unsafe path segment: ${value}`);
  }
  return value;
}

export function resolveWithin(base, relativePath, label = "path") {
  safeRelativePath(relativePath, label);
  const candidate = resolve(base, ...relativePath.split("/"));
  const rel = relative(resolve(base), candidate);
  if (!rel || rel === ".." || rel.startsWith(`..\\`) || rel.startsWith("../") || isAbsolute(rel)) {
    if (!rel) return candidate;
    throw new Error(`${label} escapes its approved root: ${relativePath}`);
  }
  return candidate;
}

export function validateScienceProjects(projects) {
  if (!Array.isArray(projects)) throw new Error("manifest root must be an array");

  const required = [
    "slug",
    "title",
    "summary",
    "status",
    "year",
    "topics",
    "methods",
    "featured",
    "technical_url",
    "repository_url",
    "code_available",
    "data_available",
    "student_suitable",
    "last_updated",
  ];
  const seen = new Set();

  return projects.map((item, index) => {
    for (const key of required) {
      if (!(key in item)) throw new Error(`projects[${index}].${key} is required`);
    }
    if (!scienceProjectSlugPattern.test(item.slug) || seen.has(item.slug)) {
      throw new Error(`invalid or duplicate slug: ${item.slug}`);
    }
    seen.add(item.slug);

    const hasPublishAssets = item.publish_assets !== undefined;
    const publishAssets = item.publish_assets ?? [];
    if (!Array.isArray(publishAssets)) {
      throw new Error(`publish_assets must be an array: ${item.slug}`);
    }
    const projectRoot = publishAssets.length || item.hero_image
      ? safeRelativePath(item.project_root, `${item.slug}.project_root`)
      : item.project_root;

    const filenames = new Set();
    const approvedPaths = new Set();
    const normalizedAssets = publishAssets.map((asset) => {
      if (!asset || typeof asset !== "object") {
        throw new Error(`invalid publish asset: ${item.slug}`);
      }
      if (!scienceAssetFilenamePattern.test(asset.filename ?? "")) {
        throw new Error(`unsafe publish filename: ${item.slug}/${asset.filename}`);
      }
      if (filenames.has(asset.filename)) {
        throw new Error(`duplicate publish filename: ${item.slug}/${asset.filename}`);
      }
      filenames.add(asset.filename);
      const extension = extname(asset.filename).toLowerCase();
      if (!supportedScienceAssetExtensions.has(extension)) {
        throw new Error(`unsupported publish format: ${item.slug}/${asset.filename}`);
      }
      for (const field of ["alt", "caption", "generated_by"]) {
        if (typeof asset[field] !== "string" || !asset[field].trim()) {
          throw new Error(`${item.slug}/${asset.filename}.${field} is required`);
        }
      }
      const sourcePath = `${projectRoot}/figures/publish/${asset.filename}`;
      safeRelativePath(sourcePath, `${item.slug}/${asset.filename}.source_path`);
      approvedPaths.add(sourcePath);
      return { ...asset, source_path: sourcePath };
    });

    if (item.hero_image && !approvedPaths.has(item.hero_image)) {
      throw new Error(`hero_image must exactly match a declared publish asset: ${item.slug}`);
    }

    return {
      ...item,
      ...(projectRoot ? { project_root: projectRoot } : {}),
      ...(hasPublishAssets ? { publish_assets: normalizedAssets } : {}),
    };
  });
}

export function collectStaleScienceAssets(previous, expectedDestinations) {
  const previousManaged = [...(previous.assets ?? []), ...(previous.stale ?? [])];
  return [...new Map(
    previousManaged
      .filter((asset) => !expectedDestinations.has(asset.public_path))
      .map((asset) => [asset.public_path, { ...asset, status: "stale-preserved" }]),
  ).values()];
}

export function svgTextIsExplicitlyBlack(svg) {
  const black = /^(?:#(?:000|111)(?:000|111)?|black)$/i;
  const styleBlocks = [...svg.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .join("\n");
  const classFill = new Map();
  for (const rule of styleBlocks.matchAll(/\.([A-Za-z0-9_-]+)\s*\{([^}]*)\}/g)) {
    const fill = rule[2].match(/(?:^|;)\s*fill\s*:\s*([^;!}\s]+)/i)?.[1];
    if (fill) classFill.set(rule[1], fill);
  }

  return [...svg.matchAll(/<text\b([^>]*)>/gi)].every((match) => {
    const attrs = match[1];
    const direct = attrs.match(/\bfill\s*=\s*["']([^"']+)["']/i)?.[1];
    if (direct) return black.test(direct.trim());
    const inline = attrs.match(/\bstyle\s*=\s*["']([^"']*)["']/i)?.[1];
    const inlineFill = inline?.match(/(?:^|;)\s*fill\s*:\s*([^;!}\s]+)/i)?.[1];
    if (inlineFill) return black.test(inlineFill.trim());
    const classes = attrs.match(/\bclass\s*=\s*["']([^"']+)["']/i)?.[1]?.split(/\s+/) ?? [];
    return classes.some((className) => black.test(classFill.get(className) ?? ""));
  });
}

export function validatePublishSvg(svg, label) {
  const title = svg.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = svg.match(/<desc\b[^>]*>([\s\S]*?)<\/desc>/i)?.[1]?.trim();
  if (!title) {
    throw new Error(`${label} is missing a non-empty SVG title`);
  }
  if (!description) {
    throw new Error(`${label} is missing a non-empty SVG description`);
  }
  if (!svgTextIsExplicitlyBlack(svg)) {
    throw new Error(`${label} contains text that is not explicitly black`);
  }
}
