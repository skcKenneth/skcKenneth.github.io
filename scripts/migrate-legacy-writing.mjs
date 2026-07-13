import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = resolve(root, "_posts");
const outputDir = resolve(root, "src/content/writing/legacy");
const redirectMapPath = resolve(root, "src/data/generated/legacy-writing-map.json");
const scienceProjects = JSON.parse(await readFile(resolve(root, "src/data/generated/science-projects.json"), "utf8"));

function unquote(value = "") {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1);
  return trimmed;
}
function parseSource(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("missing Jekyll frontmatter");
  const [, yaml, rawBody] = match;
  const scalar = (key) => unquote(yaml.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]);
  const tags = [];
  const lines = yaml.split(/\r?\n/); let inTags = false;
  for (const line of lines) {
    if (/^tags:\s*$/.test(line)) { inTags = true; continue; }
    if (inTags && /^\s+-\s+/.test(line)) tags.push(unquote(line.replace(/^\s+-\s+/, "")));
    else if (inTags && /^\S/.test(line)) inTags = false;
  }
  return { title: scalar("title"), date: scalar("date"), permalink: scalar("permalink"), tags, body: rawBody.replaceAll("{{ site.baseurl }}", "") };
}
function plainSummary(body) {
  const cleaned = body
    .replace(/```[\s\S]*?```/g, " ").replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, " ").replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "").replace(/[*_`>|=]/g, " ");
  const paragraph = cleaned.split(/\r?\n\s*\r?\n/).map((part) => part.replace(/\s+/g, " ").trim()).find((part) => part.length >= 80 && !/^\d+[.)]\s/.test(part));
  const summary = paragraph || "A migrated article from the original Kenneth Cheng mathematical modeling archive.";
  return summary.length > 240 ? `${summary.slice(0, 237).replace(/\s+\S*$/, "")}...` : summary;
}
function articleType(title, tags) {
  const text = `${title} ${tags.join(" ")}`.toLowerCase();
  if (/heuristic|warhawk|darts simulation/.test(text)) return "Mathematical Curiosities";
  if (/numerical analysis|interpolation|gibbs|eigenvalue|linear systems|model fitting|differential equation/.test(text)) return "Technical Tutorials";
  if (/mcm|himcm|immc|school busing|bottle battles|modeling competition/.test(text)) return "Competition Case Studies";
  return "Research Notes";
}
function normalizedPermalink(value) {
  let path = value.startsWith("/") ? value : `/${value}`;
  if (!/\.[a-z0-9]+$/i.test(path) && !path.endsWith("/")) path += "/";
  return path;
}
function matchScienceProject(body) {
  const raw = body.match(/https?:\/\/skc(?:k)?enneth\.github\.io\/ScienceProject\/+([^/"'<>)\s]+)/i)?.[1];
  if (!raw) return null;
  const top = decodeURIComponent(raw);
  return scienceProjects.find((project) => project.project_root?.split("/")[0].toLowerCase() === top.toLowerCase()) || null;
}

await mkdir(outputDir, { recursive: true });
const files = (await readdir(sourceDir)).filter((file) => /\.md$/i.test(file)).sort();
const redirects = {};
const generated = [];
const localAssets = new Set();

for (const file of files) {
  const source = await readFile(resolve(sourceDir, file), "utf8");
  const post = parseSource(source);
  if (!post.title || !post.date || !post.permalink) throw new Error(`${file}: title, date, and permalink are required`);
  const slug = basename(file, ".md").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const science = matchScienceProject(post.body);
  const normalizedBody = post.body.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").replace(/\n\*\*Body\*\*\n={7,}\n/g, "\n## Body\n");
  for (const match of post.body.matchAll(/(?:src=["']|\]\()\/(assets\/[^"')\s]+)/gi)) localAssets.add(decodeURI(match[1]));
  const frontmatter = {
    title: post.title, slug, summary: plainSummary(post.body), date: post.date, lastUpdated: "2026-07-13", featured: false,
    topics: post.tags.length ? post.tags : ["legacy writing"], type: articleType(post.title, post.tags), archived: true, redirectFrom: [post.permalink],
    legacySource: `_posts/${file}`,
    ...(science ? { scienceProject: science.slug, technicalRepository: science.repository_url } : {})
  };
  const yaml = Object.entries(frontmatter).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n");
  await writeFile(resolve(outputDir, `${slug}.md`), `---\n${yaml}\n---\n\n${normalizedBody.trim()}\n`);
  redirects[normalizedPermalink(post.permalink)] = `/writing/${slug}/`;
  generated.push({ slug, source: `_posts/${file}`, permalink: post.permalink, scienceProject: science?.slug || null });
}

for (const asset of localAssets) {
  const source = resolve(root, asset); const destination = resolve(root, "public", asset);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

await writeFile(redirectMapPath, `${JSON.stringify(redirects, null, 2)}\n`);
await writeFile(resolve(root, "src/data/generated/legacy-writing-inventory.json"), `${JSON.stringify(generated, null, 2)}\n`);
console.log(`Migrated ${generated.length} published Markdown articles; ${generated.filter((entry) => entry.scienceProject).length} linked to ScienceProject; ${localAssets.size} local asset copied.`);
