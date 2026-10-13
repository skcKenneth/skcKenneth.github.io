// Production verification is separate from the source and local-built checks.
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seniorPages } from '../src/lib/senior-math-pages.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const base = option('--base', 'https://skckenneth.github.io');
const output = resolve(root, option('--output', '.tmp/senior-math-v2/live-verification.json'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const report = { startedAt: new Date().toISOString(), base, scope: 'Every senior-math non-question route, every new skill/diagnostic question, all 287 official-paper leaves, legacy JAE entry points, both bank indexes, and every built JS/CSS asset.', routes: [], assets: [], failures: [] };
const routes = seniorPages.filter(page => page.type !== 'question' || /^(?:skill-|diagnostic-|jm01-|jm02-)/.test(page.id));
const jobs = [];
for (const prefix of ['', 'zh/']) {
  for (const page of routes) jobs.push({ kind: 'route', path: `/${prefix}teaching/senior-math/${page.path ? page.path + '/' : ''}`, release: true });
  jobs.push({ kind: 'route', path: `/${prefix}teaching/jae-math/`, release: false });
  jobs.push({ kind: 'asset', path: `/${prefix}teaching/senior-math/bank-index.json` });
}
for (const name of await readdir(resolve(root, 'dist/_astro'))) if (/\.(?:js|css)$/.test(name)) jobs.push({ kind: 'asset', path: `/_astro/${name}` });
let cursor = 0, completed = 0;
async function run(job) {
  const local = await readFile(resolve(root, 'dist', job.path.slice(1) + (job.path.endsWith('/') ? 'index.html' : '')));
  let record;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(new URL(job.path, base), { signal: AbortSignal.timeout(30000), headers: { 'Cache-Control': 'no-cache' } });
      const bytes = Buffer.from(await response.arrayBuffer());
      const release = !job.release || bytes.toString('utf8').includes('data-senior-release="2026-10-13-classroom-v1"');
      record = { path: job.path, status: response.status, bytes: bytes.length, localSha256: hash(local), liveSha256: hash(bytes), release, attempts: attempt };
      if (response.ok && release && record.localSha256 === record.liveSha256) break;
    } catch (error) { record = { path: job.path, attempts: attempt, error: String(error) }; }
    if (attempt < 3) await new Promise(done => setTimeout(done, 1500));
  }
  report[job.kind === 'route' ? 'routes' : 'assets'].push(record);
  if (record.status !== 200 || !record.release && job.release || record.localSha256 !== record.liveSha256) report.failures.push(record);
  completed++;
  if (completed % 100 === 0) process.stdout.write(`Verified ${completed}/${jobs.length}; failures ${report.failures.length}\n`);
}
await Promise.all(Array.from({ length: 6 }, async () => {
  while (cursor < jobs.length) await run(jobs[cursor++]);
}));
report.finishedAt = new Date().toISOString();
report.routes.sort((a, b) => a.path.localeCompare(b.path));
report.assets.sort((a, b) => a.path.localeCompare(b.path));
report.summary = { routes: report.routes.length, assets: report.assets.length, failures: report.failures.length };
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(report.summary));
if (report.failures.length) { console.error(JSON.stringify(report.failures.slice(0, 8), null, 2)); process.exitCode = 1; }
