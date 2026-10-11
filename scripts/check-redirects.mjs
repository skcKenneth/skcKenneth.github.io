import { readFile } from "node:fs/promises";
const source=await readFile(new URL("../src/data/redirects.ts",import.meta.url),"utf8");
const pairs=[...source.matchAll(/"([^"\n]+)"\s*:\s*"([^"\n]+)"/g)].map(m=>[m[1],m[2]]);
const seen=new Set(); const errors=[];
const routes = new Map(pairs);
for(const [from,to] of pairs){
  if(seen.has(from))errors.push(`duplicate source: ${from}`);
  seen.add(from);
  if(!from.startsWith("/") || from.startsWith('//'))errors.push(`source is not root-relative: ${from}`);
  if(!to.startsWith("/") || to.startsWith('//') || /[\\\u0000-\u0020]/.test(to))errors.push(`destination is not local: ${to}`);
  const visited = new Set([from]);
  let next = new URL(to, 'https://site.invalid').pathname;
  while (routes.has(next)) {
    if (visited.has(next)) { errors.push(`redirect cycle: ${[...visited, next].join(' -> ')}`); break; }
    visited.add(next);
    next = new URL(routes.get(next), 'https://site.invalid').pathname;
  }
  if (next === from && !errors.some(error => error.includes(`redirect cycle: ${from}`))) errors.push(`redirect loop: ${from}`);
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);} console.log(`Validated ${pairs.length} explicit redirects; legacy collection redirects are generated at build time.`);
