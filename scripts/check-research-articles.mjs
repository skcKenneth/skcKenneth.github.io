import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { validatePublishSvg } from "./science-sync-policy.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
export const researchArticles = {
  "when-early-warnings-cannot-tell-the-difference": 5,
  "when-starting-over-finds-the-target-faster": 8,
  "when-solar-power-changes-fast": 8,
  "when-taking-turns-makes-a-system-unstable": 8,
  "can-aggregate-observations-bound-an-epidemic": 8,
};

export function checkResearchArticles(slugs = Object.keys(researchArticles)) {
  const errors = [];
  for (const slug of slugs) {
    const editions = ["writing", "writing-zh"].map(collection =>
      readFileSync(join(root, "src/content", collection, slug + ".md"), "utf8"));
    const allImages = [];
    for (const [locale, text] of editions.entries()) {
      const prefix = `${slug} ${locale === 0 ? "EN" : "ZH"}`;
      const figures = [...text.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/g)];
      if (figures.length !== researchArticles[slug]) errors.push(`${prefix}: incorrect figure count`);
      const sources = [];
      for (const [, figure] of figures) {
        const src = figure.match(/src="([^"]+)"/)?.[1] ?? "";
        const alt = figure.match(/alt="([^"]+)"/)?.[1] ?? "";
        if (!/^\/images\/[\w/-]+\.svg$/.test(src)) { errors.push(`${prefix}: nonlocal vector asset`); continue; }
        if (alt.length < 20 || (locale === 1 && !/\p{Script=Han}/u.test(alt))) errors.push(`${prefix}: inaccessible alt text`);
        if (!/<figcaption>[^<]+<\/figcaption>/.test(figure)) errors.push(`${prefix}: missing caption`);
        try { validatePublishSvg(readFileSync(join(root, "public", src), "utf8"), src); }
        catch (error) { errors.push(`${prefix}: ${error.message}`); }
        sources.push(src);
      }
      if (new Set(sources).size !== researchArticles[slug]) errors.push(`${prefix}: duplicate or missing figures`);
      if (/Exact reproduction boundary|Technical record|\.venv|config.hash|C:\\|ScienceProject\/|\x60{3}/i.test(text)) {
        errors.push(`${prefix}: private reproduction material`);
      }
      allImages.push(sources);
    }
    if (JSON.stringify(allImages[0]) !== JSON.stringify(allImages[1])) errors.push(`${slug}: figure order differs`);
    console.log(`${slug}: EN/ZH ${researchArticles[slug]} local SVG figures checked`);
  }
  return errors;
}
