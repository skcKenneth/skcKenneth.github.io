import { access, readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projects = JSON.parse(await readFile(resolve(root, "src/data/generated/science-projects.json"), "utf8"));
const errors = [];
const slugs = new Set();

for (const project of projects) {
  if (slugs.has(project.slug)) errors.push(`duplicate slug: ${project.slug}`);
  slugs.add(project.slug);
  if (!project.project_root) errors.push(`${project.slug} has no project_root`);
  if (project.catalog_only) {
    if (project.status !== "Catalogue entry") errors.push(`${project.slug} inventory entry has misleading status ${project.status}`);
    if (!project.inventory || !Number.isInteger(project.inventory.files)) errors.push(`${project.slug} has no tracked-file inventory`);
    if (!project.limitations?.length) errors.push(`${project.slug} has no catalogue limitation`);
  }
  try { await access(resolve(root, "dist/projects", project.slug, "index.html")); }
  catch { errors.push(`built project route is missing: /projects/${project.slug}/`); }
}

const editorialFiles = (await readdir(resolve(root, "src/content/projects"))).filter((file) => /\.mdx?$/.test(file));
const catalogueCount = projects.filter((project) => project.catalog_only).length;
const editorialCount = projects.length - catalogueCount;
if (editorialCount !== editorialFiles.length) errors.push(`manifest has ${editorialCount} editorial entries but content has ${editorialFiles.length} files`);

if (errors.length) {
  console.error(`Science catalogue check failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Checked ${projects.length} ScienceProject routes: ${editorialCount} editorial overviews and ${catalogueCount} inventory entries.`);
