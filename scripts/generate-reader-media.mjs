import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.resolve('astro/package.json'));
const sharp=require('sharp'),{parse}=require('yaml');
const root=resolve(import.meta.dirname,'..'),publicRoot=resolve(root,'public');
const output=resolve(publicRoot,'images/reader-thumbs');await mkdir(output,{recursive:true});
const receiptPath=resolve(publicRoot,'images/reader-media-manifest.json');
let previous={};try{previous=JSON.parse(await readFile(receiptPath,'utf8')).images||{};}catch{}
const images={},hash=bytes=>createHash('sha256').update(bytes).digest('hex');
// Keep reviewed output bytes across operating systems, whose font renderers can differ.
async function generateOnce(key,input,render){
 const fingerprint=hash(input),destination=resolve(publicRoot,key);let bytes;
 try{bytes=await readFile(destination);}catch{}
 if(!bytes||previous[key]?.inputSha256!==fingerprint||previous[key]?.sha256!==hash(bytes)){
  await render(destination);bytes=await readFile(destination);
 }
 images[key]={inputSha256:fingerprint,sha256:hash(bytes),bytes:bytes.length};
}
// SVG text may be checked out with Windows line endings; use one semantic input.
const mark=Buffer.from((await readFile(resolve(publicRoot,'images/kenneth-woven-knot.svg'),'utf8')).replace(/\r\n/g,'\n'));
const markUrl='data:image/svg+xml;base64,'+mark.toString('base64');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f5f3ed"/><rect x="0" y="0" width="24" height="630" fill="#1f6652"/><image href="${markUrl}" x="850" y="185" width="230" height="230"/><text x="100" y="235" font-family="Georgia,serif" font-size="72" fill="#18201d">Kenneth Cheng</text><text x="105" y="315" font-family="Arial,sans-serif" font-size="30" fill="#1f6652">Mathematics · models · ideas</text><path d="M105 370H700" stroke="#c6cec3"/><text x="105" y="430" font-family="Arial,sans-serif" font-size="24" fill="#5e6964">skckenneth.github.io</text></svg>`;
await generateOnce('images/og-reader.png',Buffer.from(svg),destination=>sharp(Buffer.from(svg)).png().toFile(destination));
const walk=async dir=>(await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?walk(resolve(dir,e.name)):/\.mdx?$/.test(e.name)?[resolve(dir,e.name)]:[]))).flat();
let count=0;
for(const file of await walk(resolve(root,'src/content/writing'))){
 const text=await readFile(file,'utf8'),fm=text.match(/^---\r?\n([\s\S]*?)\r?\n---/);if(!fm)continue;
 const data=parse(fm[1]);if(data.draft||!data.heroImage||!data.slug||!data.heroImage.startsWith('/'))continue;
 const source=resolve(publicRoot,'.'+data.heroImage),rel=relative(publicRoot,source);
 if(rel.startsWith('..'+sep)||rel==='..')throw new Error('Image escapes public directory: '+data.slug);
 const sourceBytes=await readFile(source);
 await generateOnce('images/reader-thumbs/'+data.slug+'.webp',Buffer.concat([Buffer.from('reader-thumb-v1:640x400-inside-q86:'),sourceBytes]),destination=>sharp(sourceBytes,{limitInputPixels:64000000}).resize({width:640,height:400,fit:'inside',withoutEnlargement:true}).webp({quality:86}).toFile(destination));count++;
}
await writeFile(receiptPath,JSON.stringify({version:1,images},null,2)+'\n','utf8');
console.log(`Generated ${count} reader thumbnails and the 1200×630 sharing image.`);
