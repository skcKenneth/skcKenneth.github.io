import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const destination=resolve(root,'public/resources/modeling-workshop');
const sibling=resolve(process.env.SCIENCEPROJECT_DIR||resolve(root,'../ScienceProject'),'modeling-workshop/release/public');
const exists=async p=>{try{await access(p);return true;}catch{return false;}};
const allowedSlugs=['mixing-tank','population-inference','sir-dynamics','agent-simulation','resource-allocation','diffusion'];
export function validateManifest(m){
  if(m.schemaVersion!==1||m.version!=='1.0.0'||JSON.stringify(m.slugs)!==JSON.stringify(allowedSlugs)||!Array.isArray(m.assets))throw new Error('Invalid workshop manifest');
  const seen=new Set();
  for(const a of m.assets){
    if(typeof a.file!=='string'||a.file.includes('..')||a.file.includes('\\')||a.file.startsWith('/')||seen.has(a.file)||!Number.isSafeInteger(a.bytes)||a.bytes<1||! /^[a-f0-9]{64}$/.test(a.sha256))throw new Error('Unsafe or invalid workshop asset');
    const fixed=['workshop_core.py','README.txt','source-map.json'];
    const match=a.file.match(/^([a-z-]+)\/(exercise\.json|baseline\.json|baseline\.csv|reference\.ipynb|reference\.py|figure-[1-9]\.png)$/);
    if(!fixed.includes(a.file)&&!(match&&allowedSlugs.includes(match[1])))throw new Error('Asset is not on workshop allowlist');
    seen.add(a.file);
  }
  for(const slug of allowedSlugs)for(const name of ['exercise.json','baseline.json','baseline.csv','reference.ipynb','reference.py','figure-1.png'])if(!seen.has(`${slug}/${name}`))throw new Error('Missing required workshop asset');
  for(const f of ['workshop_core.py','source-map.json'])if(!seen.has(f))throw new Error('Missing core or source map');
  return m;
}
export async function syncWorkshop(){
  const source=await exists(resolve(sibling,'manifest.json'))?sibling:destination;
  const manifest=validateManifest(JSON.parse(await readFile(resolve(source,'manifest.json'),'utf8')));
  // Validate every byte before writing any snapshot files.
  const files=[];
  for(const asset of manifest.assets){
    const path=resolve(source,asset.file);if(!path.startsWith(source+sep))throw new Error('Path escapes release');
    const bytes=await readFile(path);
    if(bytes.length!==asset.bytes||createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw new Error(`Workshop hash mismatch: ${asset.file}`);
    files.push([asset.file,bytes]);
  }
  if(source!==destination){
    for(const [name,bytes]of files){const target=resolve(destination,name);await mkdir(dirname(target),{recursive:true});if(!await exists(target)||!bytes.equals(await readFile(target)))await writeFile(target,bytes);}
    await writeFile(resolve(destination,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  }
  const map=files.find(([name])=>name==='source-map.json')[1];
  const generated=resolve(root,'src/data/generated/workshop-source-map.json');
  await mkdir(dirname(generated),{recursive:true});if(!await exists(generated)||!map.equals(await readFile(generated)))await writeFile(generated,map);
  console.log(`Workshop: verified ${files.length} public assets (${source===destination?'committed snapshot':'sibling release'}).`);
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await syncWorkshop();
