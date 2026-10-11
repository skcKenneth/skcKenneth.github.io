import { access, mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { TOPIC_IDS } from '../src/data/site-reader.mjs';
const scriptRoot = fileURLToPath(new URL('../', import.meta.url));
export function parseDraftArgs(args) {
  const values = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dry-run') { values.dryRun = true; continue; }
    if (!/^--(?:kind|slug|topic|title-en|title-zh|date)$/.test(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Unknown or incomplete option: ${args[i]}`);
    values[args[i].slice(2)] = args[++i];
  }
  if (!['writing', 'teaching'].includes(values.kind)) throw new Error('--kind must be writing or teaching');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug || '')) throw new Error('--slug must use lowercase letters, numbers and hyphens');
  if (!TOPIC_IDS.includes(values.topic)) throw new Error(`--topic must be one of: ${TOPIC_IDS.join(', ')}`);
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  values.date ||= today;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || !Number.isFinite(Date.parse(values.date)) || new Date(values.date).toISOString().slice(0, 10) !== values.date) throw new Error('--date must be a valid YYYY-MM-DD date');
  return values;
}
export async function createDrafts(root, options) {
  const filenames = [join(root, 'src/content', options.kind, `${options.slug}.md`), join(root, 'src/content', `${options.kind}-zh`, `${options.slug}.md`)];
  for (const file of filenames.flatMap(file => [file, file.replace(/\.md$/, '.mdx')])) { try { await access(file); throw new Error(`Refusing to overwrite ${file}`); } catch (error) { if (error.code !== 'ENOENT') throw error; } }
  const content = await Promise.all(['en', 'zh-Hant'].map(async locale => {
    const template = await readFile(join(scriptRoot, 'templates/content', `${options.kind}.${locale}.md`), 'utf8');
    const values = { slug: options.slug, topic: options.topic, date: options.date, title: JSON.stringify(options[locale === 'en' ? 'title-en' : 'title-zh'] || `${locale === 'en' ? 'Draft' : '草稿'}: ${options.slug}`) };
    return template.replace(/\{\{(slug|topic|date|title)\}\}/g, (_, key) => values[key]);
  }));
  if (options.dryRun) return filenames;
  await Promise.all(filenames.map(file => mkdir(resolve(file, '..'), { recursive: true })));
  await writeFile(filenames[0], content[0], { flag: 'wx' });
  try { await writeFile(filenames[1], content[1], { flag: 'wx' }); } catch (error) { await unlink(filenames[0]); throw error; }
  return filenames;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { const options = parseDraftArgs(process.argv.slice(2)); const files = await createDrafts(process.cwd(), options); console.log(`${options.dryRun ? 'Would create' : 'Created'} paired draft files:\n${files.join('\n')}`); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
