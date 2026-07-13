import { readFile } from "node:fs/promises";
const source=await readFile(new URL("../src/data/redirects.ts",import.meta.url),"utf8");
const pairs=[...source.matchAll(/"([^"\n]+)"\s*:\s*"([^"\n]+)"/g)].map(m=>[m[1],m[2]]);
const seen=new Set(); const errors=[];
for(const [from,to] of pairs){if(seen.has(from))errors.push(`duplicate source: ${from}`);seen.add(from);if(!from.startsWith("/"))errors.push(`source is not root-relative: ${from}`);if(!to.startsWith("/"))errors.push(`destination is not local: ${to}`);if(from===to)errors.push(`redirect loop: ${from}`);}
if(errors.length){console.error(errors.join("\n"));process.exit(1);} console.log(`Validated ${pairs.length} explicit redirects; legacy collection redirects are generated at build time.`);
