import { readdir,readFile } from "node:fs/promises";import{resolve,dirname}from"node:path";import{fileURLToPath}from"node:url";
import { createRequire } from 'node:module';
import { readerAssets } from './selah-ocr-assets.mjs';

const require = createRequire(import.meta.url);
const verifiedReaderFiles = new Set();
for (const [asset, packageFile] of readerAssets) {
  const target = fileURLToPath(new URL('../dist/selah-ocr/' + asset, import.meta.url));
  const [published, original] = await Promise.all([readFile(target), readFile(require.resolve(packageFile))]);
  if (!published.equals(original)) throw new Error('Unexpected reader asset contents: ' + asset);
  verifiedReaderFiles.add(target);
}

const root=resolve(dirname(fileURLToPath(import.meta.url)),"../dist");async function walk(d){const output=[];for(const entry of await readdir(d,{withFileTypes:true})){const path=resolve(d,entry.name);if(entry.isDirectory())output.push(...await walk(path));else output.push(path);}return output;}const files=await walk(root);const bad=[];const patterns=[/[A-Za-z]:\\(?:Users|GitHub Projects)\\/i,/file:\/\//i,/lorem ipsum/i,/\bTODO\b/i,/href=["']https:\/\/(?:www\.)?github\.com\/skcKenneth\/ScienceProject(?:\/|["'])/i];for(const f of files.filter(x=>!verifiedReaderFiles.has(x)&&/\.(html|css|js|json|xml)$/.test(x))){const t=await readFile(f,"utf8");for(const p of patterns)if(p.test(t))bad.push(`${f.slice(root.length+1)} matches ${p}`);}if(bad.length){console.error(bad.join("\n"));process.exit(1);}console.log(`Checked ${files.length} output files for local paths, placeholders, and private-repository links.`);
