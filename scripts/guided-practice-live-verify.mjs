// Read-only production routes and exact built asset verification after Actions succeeds.
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {LIVE_ROUTES,validateLivePayload} from './publish-summary.mjs';
import {ALL_PRACTICE_PACKS} from '../src/data/guided-practice/index.mjs';
import {LOWER_CORE_VERSION} from '../src/data/lower-core-plan.mjs';
import {FORMULA_RENDER_VERSION} from '../src/lib/authored-math.mjs';
const arg=name=>process.argv.includes(name)?process.argv[process.argv.indexOf(name)+1]:null;
const commit=arg('--commit');if(!/^[a-f0-9]{40}$/.test(commit||''))throw Error('Supply the confirmed deployed --commit SHA');
const base=arg('--base')||'https://skckenneth.github.io',out=resolve(arg('--output')||'.tmp/lower-production-verification.json');
const hash=b=>createHash('sha256').update(b).digest('hex');
const packs=new Map(ALL_PRACTICE_PACKS.map(pack=>[pack.id,pack]));
const routes=[...LIVE_ROUTES,{path:'/math-studio/',kind:'native'},...['en','zh-Hant'].map(locale=>({path:`${locale==='zh-Hant'?'/zh':''}/teaching/math/`,kind:'mathSystem',locale}))],assets=new Set();
const native=['index.html','app.js','i18n.js','learning-content.js','learning-ui.js','practice.js','question-bank.js','challenge-bank.js','guided-practice-catalog.js'];
native.forEach(file=>assets.add('/math-studio/'+file));
for(const file of await readdir('dist/math-shared/formulas'))if(file!=='fonts'&&file!=='LICENSE.txt')assets.add('/math-shared/formulas/'+file);
for(const file of await readdir('dist/math-shared/formulas/fonts'))assets.add('/math-shared/formulas/fonts/'+file);
const report={commit,version:LOWER_CORE_VERSION,formulaVersion:FORMULA_RENDER_VERSION,at:new Date().toISOString(),routes:[],assets:[],passed:false};
for(let i=0;i<routes.length;i+=8)report.routes.push(...await Promise.all(routes.slice(i,i+8).map(async spec=>{
 try{const response=await fetch(base+spec.path,{cache:'no-store'}),bytes=Buffer.from(await response.arrayBuffer()),body=bytes.toString('utf8');
 const errors=spec.kind==='native'?(response.status===200&&body.includes(`data-math-release="${FORMULA_RENDER_VERSION}"`)?[]:['Native formula version missing']):validateLivePayload(spec,{status:response.status,contentType:response.headers.get('content-type')||'',bytes});
 const pack=packs.get(spec.packId);if(pack){for(const marker of [`data-practice-version="${pack.version}"`,`data-formula-render-version="${FORMULA_RENDER_VERSION}"`])if(!body.includes(marker))errors.push('Missing '+marker);}
 let configurationHash;
 if(pack){const configuration=html=>html.match(/<script\b[^>]*data-practice-configuration[^>]*>([\s\S]*?)<\/script>/)?.[1];const local=configuration(await readFile('dist'+spec.path+'index.html','utf8')),remote=configuration(body);if(!local||!remote||hash(local)!==hash(remote))errors.push('Authored pack configuration differs from the accepted build');configurationHash={local:local?hash(local):null,remote:remote?hash(remote):null};}
 if(spec.path.includes('/curriculum/lower/')&&!body.includes(`data-lower-core-version="${LOWER_CORE_VERSION}"`))errors.push('Lower curriculum version missing');
 if(['/teaching/math/','/zh/teaching/math/'].includes(spec.path)&&!body.includes(`data-math-release="${LOWER_CORE_VERSION}"`))errors.push('Learning space release version missing');
 if(spec.kind==='mathSystem'){if(!body.includes(`<html lang="${spec.locale}"`))errors.push('Learning space language missing');for(const pack of ALL_PRACTICE_PACKS)if(!body.includes(`classroom:${pack.id}`))errors.push('Missing catalog activity '+pack.id);}
 for(const match of body.matchAll(/(?:src|href)="(\/_astro\/[^"?]+\.(?:js|css))"/g))assets.add(match[1]);
 return {path:spec.path,status:response.status,passed:errors.length===0,errors,...(configurationHash?{configurationHash}:{})};
 }catch(error){return {path:spec.path,passed:false,errors:[String(error)]};}
})));
for(let i=0,list=[...assets];i<list.length;i+=8)report.assets.push(...await Promise.all(list.slice(i,i+8).map(async path=>{
 try{const response=await fetch(base+path,{cache:'no-store'}),remote=Buffer.from(await response.arrayBuffer()),local=await readFile('dist'+path);return {path,status:response.status,localHash:hash(local),remoteHash:hash(remote),passed:response.status===200&&hash(local)===hash(remote)};}
 catch(error){return {path,passed:false,error:String(error)};}
})));
report.passed=report.routes.every(row=>row.passed)&&report.assets.every(row=>row.passed);await mkdir(resolve(out,'..'),{recursive:true});await writeFile(out,JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:report.passed,routes:report.routes.length,assets:report.assets.length,failed:[...report.routes,...report.assets].filter(row=>!row.passed)}));
if(!report.passed)process.exitCode=1;
