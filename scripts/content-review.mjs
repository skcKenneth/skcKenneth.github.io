import { readFile, readdir, lstat, mkdir, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { resolve, sep, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CONTENT_REVIEW_REGISTRY } from '../src/data/content-review-registry.mjs';

const yaml = createRequire(import.meta.resolve('astro/package.json'))('js-yaml');
const LOCALES = ['en','zh-Hant'], DOMAINS = ['writing','teaching','projects','research'];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KEY = /^[a-z][a-z-]*:[a-z0-9]+(?:-[a-z0-9]+)*(?::(?:en|zh-Hant|shared|en-to-zh-Hant|zh-Hant-to-en))$/;
const HASH = /^[a-f0-9]{64}$/;
const REGISTRY_PATH = 'src/data/content-review-registry.mjs';
const RECEIPT_START = '/* CONTENT_REVIEW_RECEIPTS_START */', RECEIPT_END = '/* CONTENT_REVIEW_RECEIPTS_END */';
export const normalizeReviewText = text => String(text).replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
const hash = value => createHash('sha256').update(value).digest('hex');
const sorted = values => [...values].sort((a,b)=>a.localeCompare(b,'en'));

export function canonicalReviewJson(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return JSON.stringify(value);
  if (typeof value === 'string') return JSON.stringify(normalizeReviewText(value));
  if (Array.isArray(value)) return `[${value.map(canonicalReviewJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${sorted(Object.keys(value)).map(key => `${JSON.stringify(key)}:${canonicalReviewJson(value[key])}`).join(',')}}`;
  throw Error('Review fingerprints require JSON values; undefined/functions are not permitted');
}
export const reviewFingerprint = value => hash(typeof value === 'string' ? normalizeReviewText(value) : canonicalReviewJson(value));
export function contentReviewKey(domain,id,locale) {
  if (!DOMAINS.includes(domain) || !SLUG.test(id) || !LOCALES.includes(locale)) throw Error('Invalid content review identity');
  return `${domain}:${id}:${locale}`;
}
export function translationReviewKey(domain,id,from,to) {
  if (from === to) throw Error('A translation direction needs different locales');
  contentReviewKey(domain,id,from); contentReviewKey(domain,id,to);
  return `translation-${domain}:${id}:${from}-to-${to}`;
}

/** Ignore only absolute machine source-root provenance, never version, dates, bytes or hashes. */
export function normalizeReviewManifest(value) {
  const clone = JSON.parse(JSON.stringify(value));
  const absolute = value => typeof value === 'string' && (/^[a-z]:[\\/]/i.test(value) || value.startsWith('\\\\') || value.startsWith('/'));
  for (const object of [clone,clone?.provenance]) if (object && typeof object === 'object' && !Array.isArray(object)) {
    for (const key of ['source_root','sourceRoot']) if (absolute(object[key])) delete object[key];
  }
  const machineSource = value => typeof value==='string' && (/^[a-z]:[\\/]|^\\\\/i.test(value) || /^\/(?:home|Users|mnt|tmp|workspace|workspaces|private|opt|var)\//.test(value));
  if(clone && typeof clone==='object' && machineSource(clone.source))delete clone.source;
  return clone;
}
async function safePath(root,path,{missing=false}={}) {
  if (typeof path !== 'string' || !path || path.includes('\\') || isAbsolute(path) || path.split('/').some(part=>!part || part==='.' || part==='..')) throw Error(`Unsafe workspace path: ${path}`);
  const absolute = resolve(root,path), base=resolve(root);
  if(!absolute.startsWith(base+sep))throw Error(`Path escapes workspace: ${path}`);
  // lstat also identifies Windows junctions; never traverse a link into a private tree.
  // Avoid realpath, which restricted Windows hosts deny even for readable workspace files.
  let check=base;
  if((await lstat(base)).isSymbolicLink())throw Error('Workspace root must not be a symlink');
  for(const part of path.split('/')) {
    check=resolve(check,part);
    try {if((await lstat(check)).isSymbolicLink())throw Error(`Symlink/junction is not read: ${path}`);}
    catch(error){if(missing&&error.code==='ENOENT')break;throw error;}
  }
  return absolute;
}
async function sourceText(root,path) { return normalizeReviewText(await readFile(await safePath(root,path),'utf8')); }
async function markdownFiles(root,path) {
  const full = await safePath(root,path,{missing:true});
  let children; try { children=await readdir(full,{withFileTypes:true}); } catch(error) { if(error.code==='ENOENT')return []; throw error; }
  const files=[];
  for(const child of children) {
    const next=`${path}/${child.name}`;
    if(child.isSymbolicLink())throw Error(`Content symlinks are not read: ${next}`);
    if(child.isDirectory())files.push(...await markdownFiles(root,next));
    else if(/\.mdx?$/.test(child.name))files.push(next);
  }
  return sorted(files);
}
function parseFrontmatter(source) {
  const match=source.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if(!match)throw Error('Missing frontmatter');
  const data=yaml.load(match[1],{schema:yaml.JSON_SCHEMA});
  if(!data || typeof data!=='object' || Array.isArray(data))throw Error('Invalid frontmatter');
  return data;
}

export function validateReviewGraph(nodes) {
  const errors=[], byKey=new Map();
  for(const node of nodes) {
    if(!KEY.test(node.key))errors.push(`Invalid review key: ${node.key}`);
    if(byKey.has(node.key))errors.push(`Duplicate review key: ${node.key}`);
    else byKey.set(node.key,node);
    if(!HASH.test(node.fingerprint))errors.push(`Invalid fingerprint: ${node.key}`);
    if(!Array.isArray(node.dependencies) || node.dependencies.some(key=>!KEY.test(key)) || new Set(node.dependencies).size!==node.dependencies.length)errors.push(`Invalid dependencies: ${node.key}`);
  }
  const visited=new Set(),active=new Set();
  function visit(key,chain=[]) {
    if(active.has(key)) { errors.push(`Dependency cycle: ${[...chain,key].join(' -> ')}`); return; }
    if(visited.has(key))return;
    const node=byKey.get(key);if(!node)return;
    active.add(key);
    for(const dep of node.dependencies || []) {
      if(!byKey.has(dep))errors.push(`Missing dependency: ${key} -> ${dep}`);
      else visit(dep,[...chain,key]);
    }
    active.delete(key);visited.add(key);
  }
  for(const key of sorted(byKey.keys()))visit(key);
  return [...new Set(errors)];
}
export async function collectReviewGraph(root,{registry=CONTENT_REVIEW_REGISTRY}={}) {
  const nodes=[],errors=[];
  const add=node=>nodes.push({...node,dependencies:sorted(new Set(node.dependencies||[])),paths:sorted(node.paths||[])});
  for(const domain of DOMAINS)for(const locale of LOCALES) {
    const directory=`src/content/${domain}${locale==='en'?'':'-zh'}`;
    for(const path of await markdownFiles(root,directory)) {
      try {
        const source=await sourceText(root,path),data=parseFrontmatter(source),id=data.sourceSlug || data.slug;
        const key=contentReviewKey(domain,id,locale);
        add({key,kind:domain,id,locale,title:String(data.title||id),paths:[path],fingerprint:reviewFingerprint(source),dependencies:[],
          draft:Boolean(data.draft),legacy:Boolean(data.legacySource || path.includes('/legacy/')),pilot:false,
          dates:{...(data.date?{published:String(data.date)}:{}),...(data.lastUpdated?{updated:String(data.lastUpdated)}:{})}});
      }catch(error){errors.push(`${path}: ${error.message}`);}
    }
  }
  const contentNodes=[...nodes],content=new Map(contentNodes.map(node=>[node.key,node]));
  for(const node of contentNodes) {
    const opposite=node.locale==='en'?'zh-Hant':'en',other=contentReviewKey(node.kind,node.id,opposite);
    if(!content.has(other)) { if(!node.draft)errors.push(`Missing translation edition: ${node.key} -> ${other}`); continue; }
    add({key:translationReviewKey(node.kind,node.id,node.locale,opposite),kind:'translation',id:node.id,locale:opposite,
      title:`${node.title} (${node.locale} → ${opposite})`,paths:[...node.paths,...content.get(other).paths],
      value:{domain:node.kind,source:node.key,target:other},fingerprint:reviewFingerprint({domain:node.kind,source:node.key,target:other}),
      dependencies:[node.key,other],pilot:false,draft:node.draft,legacy:node.legacy});
  }
  for(const note of registry.notes||[])for(const locale of LOCALES) {
    const key=contentReviewKey('writing',note.id,locale),node=content.get(key);
    if(!node){errors.push(`Missing registered note: ${key}`);continue;}
    node.pilot=true;node.dependencies=sorted(note.sources.map(id=>contentReviewKey('writing',id,locale)));
    for(const translation of nodes.filter(item=>item.kind==='translation'&&item.id===note.id&&item.value.domain==='writing'))translation.pilot=true;
  }
  for(const managed of registry.managed||[]) {
    try {
      const value=Object.fromEntries(await Promise.all(managed.paths.map(async path=>[path,normalizeReviewManifest(JSON.parse(await sourceText(root,path)))])));
      const key=`manifest:${managed.id}:shared`;
      add({key,kind:'manifest',id:managed.id,locale:'shared',title:`Managed teaching source: ${managed.id}`,paths:managed.paths,fingerprint:reviewFingerprint(value),dependencies:[],pilot:true});
      for(const id of managed.teachingIds||[])for(const locale of LOCALES) {
        const target=content.get(contentReviewKey('teaching',id,locale));
        if(!target)errors.push(`Missing managed teaching entrance: teaching:${id}:${locale}`);
        else {target.dependencies.push(key);target.dependencies=sorted(new Set(target.dependencies));target.pilot=true;}
      }
    }catch(error){errors.push(`Managed ${managed.id}: ${error.message}`);}
  }
  for(const descriptor of registry.nodes||[]) {
    try {
      const value=Object.hasOwn(descriptor,'value')?descriptor.value:Object.fromEntries(await Promise.all(descriptor.paths.map(async path=>[path,await sourceText(root,path)])));
      add({...descriptor,fingerprint:reviewFingerprint(value)});
    }catch(error){errors.push(`${descriptor.key}: ${error.message}`);}
  }
  for(const milestone of registry.milestones||[]) add({key:`milestone:${milestone.id}:shared`,kind:'milestone',id:milestone.id,locale:'shared',
    title:milestone.title.en,paths:['src/data/site-editorial.mjs'],value:milestone,fingerprint:reviewFingerprint(milestone),dependencies:[],pilot:true,
    reviewAfter:milestone.reviewAfter,retainedStatus:milestone.status,source:milestone.source});
  const sourceFingerprints={};
  for(const path of sorted(new Set(nodes.flatMap(node=>node.paths)))) {
    try{sourceFingerprints[path]=reviewFingerprint(await sourceText(root,path));}
    catch(error){errors.push(`Missing/unreadable registered public source ${path}: ${error.message}`);}
  }
  return {version:1,nodes:nodes.sort((a,b)=>a.key.localeCompare(b.key,'en')),errors:[...errors,...validateReviewGraph(nodes)],receipts:registry.receipts||[],sourceFingerprints};
}

export function dependencyFingerprints(graph,key) {
  const nodes=new Map(graph.nodes.map(node=>[node.key,node])),found=new Map(),active=new Set();
  function visit(current) {
    if(active.has(current))throw Error(`Dependency cycle at ${current}`);
    const node=nodes.get(current);if(!node)throw Error(`Missing dependency: ${current}`);
    active.add(current);
    for(const dep of node.dependencies)if(!found.has(dep)){const source=nodes.get(dep);if(!source)throw Error(`Missing dependency: ${dep}`);found.set(dep,source.fingerprint);visit(dep);}
    active.delete(current);
  }
  visit(key);return Object.fromEntries(sorted(found.keys()).map(id=>[id,found.get(id)]));
}
function isoDate(value) { return typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value; }
export function validateReviewReceipt(receipt) {
  const errors=[], allowed=['key','fingerprint','dependencies','reviewedAt','reviewedBy','scope','conclusion','reason','references'];
  if(!receipt || typeof receipt!=='object' || Array.isArray(receipt))return ['Receipt must be an object'];
  if(Object.keys(receipt).some(key=>!allowed.includes(key)))errors.push('Unknown receipt fields');
  if(!KEY.test(receipt.key))errors.push('Invalid receipt key');
  if(!HASH.test(receipt.fingerprint))errors.push('Invalid receipt fingerprint');
  if(!receipt.dependencies || typeof receipt.dependencies!=='object' || ![Object.prototype,null].includes(Object.getPrototypeOf(receipt.dependencies)) || Object.entries(receipt.dependencies).some(([key,value])=>!KEY.test(key)||!HASH.test(value)))errors.push('Invalid receipt dependency fingerprints');
  if(!isoDate(receipt.reviewedAt))errors.push('Invalid receipt review date');
  for(const key of ['reviewedBy','scope','reason'])if(typeof receipt[key]!=='string'||receipt[key].trim().length<8||receipt[key].length>4000||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(receipt[key]))errors.push(`Receipt requires a concrete ${key}`);
  if(!['consistent','needs-update','pending'].includes(receipt.conclusion))errors.push('Invalid receipt conclusion');
  if(!Array.isArray(receipt.references)||!receipt.references.length||receipt.references.some(ref=>typeof ref!=='string'||!ref||ref.length>2000||/^[a-z]:|^\\\\|[\r\n]/i.test(ref)||(!/^https:\/\//.test(ref)&&(!/^(?:src|public|design|scripts|docs)\//.test(ref)||ref.split('/').includes('..')))))errors.push('Receipt needs public/workspace source references');
  return errors;
}
export function recordReviewReceipt(graph,receipt,{today=new Date().toISOString().slice(0,10)}={}) {
  const errors=[...(graph.errors||[]),...validateReviewReceipt(receipt)];
  if(errors.length)throw Error(`Cannot record review: ${errors.join('; ')}`);
  const node=graph.nodes.find(node=>node.key===receipt.key);if(!node)throw Error(`Unknown review target: ${receipt.key}`);
  if(receipt.reviewedAt>today)throw Error('Review date is in the future');
  if(receipt.fingerprint!==node.fingerprint || canonicalReviewJson(receipt.dependencies)!==canonicalReviewJson(dependencyFingerprints(graph,node.key)))throw Error('Stale review fingerprint/dependencies: inspect the current versions before recording');
  return JSON.parse(JSON.stringify(receipt));
}

export function createReviewReport(graph,{receipts=graph.receipts||[],today=new Date().toISOString().slice(0,10)}={}) {
  if(!isoDate(today))throw Error('Invalid report date');
  const errors=[...(graph.errors||[])],latest=new Map();
  for(const receipt of receipts) {
    const invalid=validateReviewReceipt(receipt);
    if(invalid.length){errors.push(`Invalid receipt ${receipt?.key||'(unknown)'}: ${invalid.join('; ')}`);continue;}
    if(receipt.reviewedAt>today)errors.push(`Future review receipt: ${receipt.key}`);
    const old=latest.get(receipt.key);if(!old || receipt.reviewedAt>=old.reviewedAt)latest.set(receipt.key,receipt);
  }
  const keys=new Set(graph.nodes.map(node=>node.key));
  for(const key of latest.keys())if(!keys.has(key))errors.push(`Review target removed: ${key}`);
  const observations=graph.nodes.map(node=>{
    let dependencies={};try{dependencies=dependencyFingerprints(graph,node.key);}catch(error){errors.push(error.message);}
    const receipt=latest.get(node.key),reasons=[];
    let status='unreviewed';
    if(receipt) {
      if(receipt.fingerprint!==node.fingerprint)reasons.push('Reviewed target fingerprint changed');
      for(const key of new Set([...Object.keys(receipt.dependencies),...Object.keys(dependencies)]))if(receipt.dependencies[key]!==dependencies[key])reasons.push(`Dependency changed or removed: ${key}`);
      status=reasons.length?'needs-update':receipt.conclusion==='consistent'?'reviewed':receipt.conclusion;
      if(receipt.conclusion!=='consistent')reasons.push(receipt.reason);
    }else reasons.push(node.pilot?'No actual review receipt for this registered item':'No review receipt; initial observation is not a review');
    if(node.kind==='milestone' && node.reviewAfter<=today) {
      status='pending';reasons.push(`Review due since ${node.reviewAfter}; retained source status ${node.retainedStatus}. An elapsed date does not establish an outcome.`);
    }
    const actionable=!node.draft && (status==='needs-update'||status==='pending'||(status==='unreviewed'&&node.pilot));
    return {key:node.key,kind:node.kind,id:node.id,locale:node.locale,title:node.title,paths:node.paths,fingerprint:node.fingerprint,dependencies,
      status,actionable,reasons,...(node.dates?{dates:node.dates}:{}),...(node.retainedStatus?{retainedStatus:node.retainedStatus,reviewAfter:node.reviewAfter,source:node.source}:{}),
      ...(receipt?{review:{reviewedAt:receipt.reviewedAt,reviewedBy:receipt.reviewedBy,scope:receipt.scope,conclusion:receipt.conclusion,reason:receipt.reason,references:receipt.references}}:{})};
  });
  const summary={observed:observations.length,reviewed:observations.filter(item=>item.status==='reviewed').length,
    actionable:observations.filter(item=>item.actionable).length,needsUpdate:observations.filter(item=>item.status==='needs-update').length,
    pending:observations.filter(item=>item.status==='pending').length,unreviewedInformational:observations.filter(item=>item.status==='unreviewed'&&!item.actionable).length};
  return {schemaVersion:1,generatedOn:today,scope:'Local public-source/dependency audit only; no human approval, independent research verification or private-source access is implied.',
    summary,errors:[...new Set(errors)],actionable:observations.filter(item=>item.actionable),observations};
}
const markdown = value => String(value).replace(/[\\`\[\]*_|]/g,char=>`\\${char}`).replace(/[<>]/g,char=>({'<':'&lt;','>':'&gt;'}[char])).replace(/[\r\n]+/g,' ');
export function reviewReportMarkdown(report) {
  const lines=['# Local content review queue','',`Observed on ${report.generatedOn}. ${report.scope}`,'',
    `Observed ${report.summary.observed}; reviewed within their recorded scope ${report.summary.reviewed}; actionable ${report.summary.actionable}; informational unreviewed ${report.summary.unreviewedInformational}.`,
    '', 'Initial observations do not approve legacy content. Historical publication/update dates and pending event facts remain unchanged.',''];
  if(report.errors.length)lines.push('## Invalid registry or receipts','',...report.errors.map(error=>`- ${markdown(error)}`),'');
  lines.push('## Actionable review','');
  if(!report.actionable.length)lines.push('No actionable items for this snapshot. This does not mean all legacy material was reviewed.','');
  else lines.push('| Target | Status | Reason |','|---|---|---|',...report.actionable.map(item=>`| ${markdown(item.key)} | ${item.status} | ${markdown(item.reasons.join('; '))} |`),'');
  const reviewed=report.observations.filter(item=>item.review);
  lines.push('## Recorded audit scopes','');
  if(!reviewed.length)lines.push('No actual review receipts have been recorded.','');
  else lines.push('| Target | Date / reviewer | Scope and conclusion |','|---|---|---|',...reviewed.map(item=>`| ${markdown(item.key)} | ${item.review.reviewedAt} / ${markdown(item.review.reviewedBy)} | ${markdown(item.review.scope)}; ${item.review.conclusion}: ${markdown(item.review.reason)} |`),'');
  lines.push('Full fingerprints, source paths and dependency versions are in report.json. A review receipt applies only to its stated scope and exact versions.');
  return lines.join('\n')+'\n';
}
export async function checkContentReview(root,options={}) {
  const graph=await collectReviewGraph(root,options),report=createReviewReport(graph,options);
  return {errors:report.errors,warnings:report.actionable.map(item=>`${item.key}: ${item.reasons.join('; ')}`),checked:report.summary.observed,report};
}
export async function writeReviewReports(root,out,report) {
  if(typeof out!=='string'||!out)throw Error('Provide a report output directory');
  const clean=out.replaceAll('\\','/');
  if(/^(?:src|public|scripts|tests|node_modules|\.git)(?:\/|$)/i.test(clean))throw Error('Report output must not overwrite source or public files');
  const directory=await safePath(root,clean,{missing:true});await mkdir(directory,{recursive:true});
  for(const [file,value] of [['report.json',JSON.stringify(report,null,2)+'\n'],['report.md',reviewReportMarkdown(report)]]) {
    const path=await safePath(root,`${clean}/${file}`,{missing:true});await writeFile(path,value,'utf8');
  }
  return directory;
}
export async function appendReviewReceipt(root,graph,receipt,options={}) {
  for(const [source,fingerprint] of Object.entries(graph.sourceFingerprints||{}))if(reviewFingerprint(await sourceText(root,source))!==fingerprint)throw Error(`Stale observed source: ${source}; collect a fresh graph after inspection`);
  const validated=recordReviewReceipt(graph,receipt,options),path=await safePath(root,REGISTRY_PATH),source=await readFile(path,'utf8');
  const start=source.indexOf(RECEIPT_START),end=source.indexOf(RECEIPT_END);
  if(start<0||end<=start||source.indexOf(RECEIPT_START,start+1)>=0||source.indexOf(RECEIPT_END,end+1)>=0)throw Error('Receipt markers are missing or ambiguous');
  const existing=JSON.parse(source.slice(start+RECEIPT_START.length,end).trim());
  if(!Array.isArray(existing)||existing.some(item=>validateReviewReceipt(item).length))throw Error('Invalid existing receipt registry');
  if(existing.some(item=>canonicalReviewJson(item)===canonicalReviewJson(validated)))return false;
  const newline=source.includes('\r\n')?'\r\n':'\n';
  const replacement=(JSON.stringify([...existing,validated],null,2)+'\n').replace(/\n/g,newline);
  await writeFile(path,source.slice(0,start+RECEIPT_START.length)+newline+replacement+source.slice(end),'utf8');
  return true;
}
export async function runContentReviewCli(root,args,{stdout=console.log,stderr=console.error}={}) {
  try {
    let receiptPath,out,today;
    const command=args[0]==='record'?'record':'report';let rest=command==='record'?args.slice(1):args;
    for(let index=0;index<rest.length;index++) {
      const flag=rest[index],value=rest[++index];
      if(!value || !['--out','--receipt','--today'].includes(flag))throw Error('Usage: content-review.mjs [--out directory] [--today YYYY-MM-DD] | record --receipt workspace-file.json');
      if(flag==='--out'){if(out)throw Error('Duplicate --out');out=value;}
      if(flag==='--receipt'){if(receiptPath)throw Error('Duplicate --receipt');receiptPath=value;}
      if(flag==='--today'){if(today)throw Error('Duplicate --today');today=value;}
    }
    if(today&&!isoDate(today))throw Error('Invalid --today date');
    if(command==='record') {
      if(!receiptPath||out||today)throw Error('record requires only --receipt; its actual audit date is supplied in the receipt');
      const path=await safePath(root,receiptPath);if((await stat(path)).size>65536)throw Error('Receipt file is oversized');
      const receipt=JSON.parse(normalizeReviewText(await readFile(path,'utf8'))),graph=await collectReviewGraph(root);
      const added=await appendReviewReceipt(root,graph,receipt);stdout(`${added?'Recorded':'Already recorded'} scoped audit: ${receipt.key}`);return 0;
    }
    if(receiptPath)throw Error('--receipt requires explicit record command');
    const {report}=await checkContentReview(root,{...(today?{today}:{})});
    stdout(reviewReportMarkdown(report));if(out)await writeReviewReports(root,out,report);
    return report.errors.length?1:0;
  }catch(error){stderr(error.message);return 1;}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)process.exitCode=await runContentReviewCli(process.cwd(),process.argv.slice(2));
