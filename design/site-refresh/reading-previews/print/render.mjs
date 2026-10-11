// Local document rendering only: a fresh headless profile, never the user's browser session.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
const directory=fileURLToPath(new URL('.',import.meta.url));
const workspace=fileURLToPath(new URL('../../../../',import.meta.url));
const base=new URL(process.argv[2]||'http://127.0.0.1:8767/');
if(!['127.0.0.1','localhost'].includes(base.hostname)||base.protocol!=='http:')throw Error('Use a local HTTP preview only');
const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const cases=[['traffic','what-must-a-traffic-model-remember'],['solar','when-solar-power-changes-fast'],['certificate','random-stress-tests-are-not-certificates'],['code','climate-driven-dengue']];
const run=new Date().toISOString().replace(/[^0-9]/g,'');
const results=[];
await mkdir(directory,{recursive:true});
for(const[name,slug]of cases)for(const locale of ['en','zh-Hant']){
  const route=`/${locale==='en'?'':'zh/'}writing/${slug}/`,url=new URL(route,base).href;
  const html=await readFile(path.join(workspace,'dist',route,'index.html'),'utf8');
  if(!html.includes('data-reader-print'))throw Error(`Build the new reader before rendering ${route}`);
  const output=path.join(directory,`${name}-${locale}.pdf`);
  const profile=path.join(workspace,'.cache','reader-print-edge',run,`${name}-${locale}`);
  await mkdir(profile,{recursive:true});
  const args=['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update',
    '--no-pdf-header-footer','--virtual-time-budget=6000',`--user-data-dir=${profile}`,`--print-to-pdf=${output}`,url];
  const rendered=spawnSync(edge,args,{encoding:'utf8',windowsHide:true,timeout:60000});
  if(rendered.error||rendered.status!==0)throw Error(`${name}/${locale}: ${rendered.error||rendered.stderr}`);
  const pdf=await readFile(output);
  if(pdf.subarray(0,5).toString()!=='%PDF-')throw Error(`Invalid PDF ${output}`);
  const result={name,slug,locale,route,filename:path.basename(output),bytes:pdf.length,sha256:createHash('sha256').update(pdf).digest('hex'),
    builtHtmlSha256:createHash('sha256').update(html).digest('hex')};
  results.push(result);console.log(`${result.filename}: ${pdf.length} bytes`);
}
const git=spawnSync('git',['rev-parse','HEAD'],{cwd:workspace,encoding:'utf8',windowsHide:true});
await writeFile(path.join(directory,'render-manifest.json'),JSON.stringify({renderedAt:new Date().toISOString(),base:base.href,sourceBaseCommit:git.stdout.trim(),
  sourceState:'working-tree',renderer:edge,method:'Fresh isolated headless document render; no user browser control; local preview only',documents:results},null,2)+'\n');
