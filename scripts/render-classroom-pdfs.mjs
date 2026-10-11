// Document rendering only: a fresh headless Edge profile, never the user's browser session.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {CLASSROOM_PACKS,classroomPackHref} from '../src/data/classroom-packs.mjs';
const workspace=path.resolve(import.meta.dirname,'..');
const directory=path.join(workspace,'design/site-refresh/classroom-previews/print');
const base=new URL(process.argv[2]||'http://127.0.0.1:8767/');
if(!['127.0.0.1','localhost'].includes(base.hostname)||base.protocol!=='http:')throw Error('Use a local HTTP preview only');
const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const digest=value=>createHash('sha256').update(value).digest('hex');
const sourceFiles=['src/data/classroom-packs.mjs','src/components/ClassroomPackPage.astro','src/styles/classroom-packs.css','src/scripts/classroom-packs.ts'];
const sourceHashes=Object.fromEntries(await Promise.all(sourceFiles.map(async file=>[file,digest(await readFile(path.join(workspace,file)))])));
const run=new Date().toISOString().replace(/[^0-9]/g,'');
const documents=[];
await mkdir(directory,{recursive:true});
for(const pack of CLASSROOM_PACKS)for(const locale of ['en','zh-Hant'])for(const teacher of [false,true]){
  const route=classroomPackHref(pack.id,locale,teacher),role=teacher?'teacher':'student',url=new URL(route,base).href;
  const html=await readFile(path.join(workspace,'dist',route,'index.html'));
  const marker=`data-classroom-${teacher?'teacher':'pack'}="${pack.id}"`;
  if(!html.toString('utf8').includes(marker)||!html.toString('utf8').includes('classroom-print-source'))throw Error(`Build the current classroom pages before rendering ${route}`);
  const output=path.join(directory,`${pack.id}-${role}-${locale}.pdf`);
  const profile=path.join(workspace,'.cache','classroom-print-edge',run,`${pack.id}-${role}-${locale}`);
  await mkdir(profile,{recursive:true});
  const args=['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update',
    '--no-pdf-header-footer','--virtual-time-budget=6000',`--user-data-dir=${profile}`,`--print-to-pdf=${output}`,url];
  const rendered=spawnSync(edge,args,{encoding:'utf8',windowsHide:true,timeout:60000});
  if(rendered.error||rendered.status!==0)throw Error(`${pack.id}/${role}/${locale}: ${rendered.error||rendered.stderr}`);
  const pdf=await readFile(output);
  if(pdf.subarray(0,5).toString()!=='%PDF-')throw Error(`Invalid PDF ${output}`);
  documents.push({packId:pack.id,role,locale,route,filename:path.basename(output),bytes:pdf.length,sha256:digest(pdf),builtHtmlSha256:digest(html)});
  console.log(`${path.basename(output)}: ${pdf.length} bytes`);
}
const git=spawnSync('git',['rev-parse','HEAD'],{cwd:workspace,encoding:'utf8',windowsHide:true});
await writeFile(path.join(directory,'render-manifest.json'),JSON.stringify({renderedAt:new Date().toISOString(),base:base.href,sourceBaseCommit:git.stdout.trim(),
  sourceState:'working-tree',sourceHashes,renderer:edge,method:'Fresh isolated headless document render; no user browser control; local preview only',documents},null,2)+'\n');
