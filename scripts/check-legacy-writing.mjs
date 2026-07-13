import { access, readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceFiles = (await readdir(resolve(root, "_posts"))).filter((file) => /\.md$/i.test(file));
const generatedFiles = (await readdir(resolve(root, "src/content/writing/legacy"))).filter((file) => /\.md$/i.test(file));
const inventory = JSON.parse(await readFile(resolve(root, "src/data/generated/legacy-writing-inventory.json"), "utf8"));
const redirects = JSON.parse(await readFile(resolve(root, "src/data/generated/legacy-writing-map.json"), "utf8"));
const errors = [];

if (sourceFiles.length !== generatedFiles.length || sourceFiles.length !== inventory.length) errors.push(`source=${sourceFiles.length}, generated=${generatedFiles.length}, inventory=${inventory.length}`);
const normalizedPermalink = (value) => { let path=value.startsWith("/")?value:`/${value}`; if(!/\.[a-z0-9]+$/i.test(path)&&!path.endsWith("/"))path+="/"; return path; };
const uniquePermalinks = new Set(inventory.map((article) => normalizedPermalink(article.permalink)));
if (Object.keys(redirects).length !== uniquePermalinks.size) errors.push(`redirect map has ${Object.keys(redirects).length} entries for ${uniquePermalinks.size} unique former URLs`);

for (const article of inventory) {
  const generatedPath = resolve(root, "src/content/writing/legacy", `${article.slug}.md`);
  const generated = await readFile(generatedPath, "utf8");
  if (generated.length < 500) errors.push(`${article.slug} appears truncated`);
  try { await access(resolve(root, "dist/writing", article.slug, "index.html")); }
  catch { errors.push(`missing article route: /writing/${article.slug}/`); }
  const oldPath = normalizedPermalink(article.permalink);
  if (redirects[oldPath] !== `/writing/${article.slug}/`) continue;
  const redirectFile = resolve(root, "dist", oldPath.replace(/^\//, ""), "index.html");
  try {
    const redirectHtml = await readFile(redirectFile, "utf8");
    if (!redirectHtml.includes(`/writing/${article.slug}/`)) errors.push(`${oldPath} does not target migrated article`);
  } catch { errors.push(`missing former-URL redirect: ${oldPath}`); }
}

if (errors.length) {
  console.error(`Legacy writing check failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Checked ${inventory.length} migrated Markdown articles and ${uniquePermalinks.size} former public URLs; ${inventory.filter((item) => item.scienceProject).length} link to ScienceProject.`);
