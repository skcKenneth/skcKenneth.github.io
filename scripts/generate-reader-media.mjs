import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {EDITORIAL_ARTICLE_IDS} from '../src/data/reader-media.mjs';
const require=createRequire(import.meta.resolve('astro/package.json'));
const sharp=require('sharp'),{parse}=require('yaml');
const root=resolve(import.meta.dirname,'..'),publicRoot=resolve(root,'public');
const output=resolve(publicRoot,'images/reader-thumbs');await mkdir(output,{recursive:true});
const receiptPath=resolve(publicRoot,'images/reader-media-manifest.json');
let previous={};try{previous=JSON.parse(await readFile(receiptPath,'utf8')).images||{};}catch{}
const images={},hash=bytes=>createHash('sha256').update(bytes).digest('hex');
// Keep reviewed output bytes across operating systems, whose font renderers can differ.
async function generateOnce(key,input,render){
 const fingerprint=hash(input),destination=resolve(publicRoot,key);let bytes;let rendering=previous[key]?.rendering;
 try{bytes=await readFile(destination);}catch{}
 if(!bytes||previous[key]?.inputSha256!==fingerprint||previous[key]?.sha256!==hash(bytes)){
  await mkdir(resolve(destination,'..'),{recursive:true});
  const details=await render(destination);if(details?.fontFamily)rendering=details;bytes=await readFile(destination);
 }
 images[key]={inputSha256:fingerprint,sha256:hash(bytes),bytes:bytes.length,...rendering?{rendering}:{}};
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
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const forest='#1f6652',sage='#b8cbbb',sand='#e7ddcb',copper='#a96d46',ivory='#f5f3ed';
const ttfSlug='do-more-test-time-steps-make-better-forecasts';
const ttfPalette={ink:'#7A1E3A',paper:'#FAF8F7',soft:'#EFE4E8',line:'#CBB3BC',secondary:'#5A4E52'};
const shapes={
 'do-more-test-time-steps-make-better-forecasts':`<rect x="46" y="164" width="157" height="91" rx="20" fill="${ttfPalette.soft}" stroke="none"/><path d="M65 220C86 180 109 180 130 220S170 260 187 213"/><path d="M211 210H244M231 197L244 210 231 223"/><path d="M336 133C289 112 249 156 255 203S313 282 357 254 399 184 368 156" stroke="${ttfPalette.line}" stroke-width="28"/><path d="M336 133C289 112 249 156 255 203S313 282 357 254 399 184 368 156M352 159L368 156 367 174"/><path d="M390 210H429C479 210 499 112 578 112"/><path d="M429 210C479 210 501 306 578 306" stroke="${ttfPalette.secondary}" stroke-dasharray="18 12"/><circle cx="429" cy="210" r="12" fill="${ttfPalette.ink}" stroke="none"/><circle cx="578" cy="112" r="18" fill="${ttfPalette.ink}" stroke="none"/><circle cx="578" cy="306" r="18" fill="${ttfPalette.secondary}" stroke="none"/>`,
 'two-networks-one-spectrum-different-alarms':`<path d="M84 220 184 106 278 250Z M372 220 474 106 568 250Z M372 220Q460 310 568 250"/><path d="M184 106Q278 110 278 250" stroke="${copper}"/><g fill="${forest}"><circle cx="84" cy="220" r="17"/><circle cx="184" cy="106" r="17"/><circle cx="278" cy="250" r="17"/><circle cx="372" cy="220" r="17"/><circle cx="474" cy="106" r="17"/></g><circle cx="568" cy="250" r="20" fill="${copper}"/><circle cx="474" cy="106" r="39" stroke="${sage}" stroke-width="12"/>`,
 'how-many-equilibria-did-the-optimizer-miss':`<path d="M67 250C65 94 199 66 277 142S397 330 496 232 607 129 574 90" stroke="${sage}" stroke-width="34"/><path d="M69 259C142 271 136 141 232 166S342 310 408 240 463 115 571 130"/><path d="M70 319C180 319 215 257 311 293S485 352 571 273" stroke="${sand}" stroke-width="24"/><g fill="${forest}"><circle cx="183" cy="180" r="18"/><circle cx="351" cy="269" r="18"/><circle cx="505" cy="147" r="18"/></g><circle cx="183" cy="180" r="39" stroke="${copper}" stroke-width="8"/>`,
 'what-must-a-traffic-model-remember':`<path d="M65 282C186 282 199 113 330 113S459 282 575 282" stroke="${sage}" stroke-width="44"/><path d="M65 282C186 282 199 113 330 113S459 282 575 282"/><path d="M64 328C206 328 222 159 330 159S445 328 576 328" stroke="${sand}" stroke-width="12"/><g fill="${forest}" stroke="none"><rect x="165" y="214" width="34" height="24" rx="8" transform="rotate(-52 182 226)"/><rect x="246" y="117" width="42" height="27" rx="9" transform="rotate(-20 267 130)"/><circle cx="354" cy="116" r="21"/></g><path d="M354 116Q355 62 409 63" stroke="${copper}"/><circle cx="413" cy="63" r="13" fill="${copper}"/>`,
 'when-the-fit-is-not-the-model':`<path d="M76 289C151 112 236 107 316 195S463 309 567 102" stroke="${sage}" stroke-width="32"/><path d="M76 289C151 112 236 107 316 195S463 309 567 102"/><path d="M316 195C399 225 451 188 564 288" stroke="${copper}"/><g fill="${ivory}" stroke="${forest}"><circle cx="130" cy="191" r="16"/><circle cx="229" cy="141" r="16"/><circle cx="316" cy="195" r="20"/></g><circle cx="564" cy="288" r="20" fill="${copper}"/><circle cx="567" cy="102" r="20" fill="${forest}"/>`,
 'random-stress-tests-are-not-certificates':`<path d="M453 111C400 59 224 59 153 132S113 305 245 327 438 309 467 223" stroke="${sage}" stroke-width="25"/><path d="M453 111C400 59 224 59 153 132S113 305 245 327 438 309 467 223"/><g fill="${forest}" stroke="none"><circle cx="214" cy="174" r="15"/><circle cx="305" cy="126" r="15"/><circle cx="376" cy="211" r="15"/><circle cx="269" cy="270" r="15"/></g><path d="M376 211Q432 175 523 159" stroke="${copper}"/><circle cx="535" cy="156" r="22" fill="${copper}"/>`,
 'when-solar-power-changes-fast':`<circle cx="466" cy="118" r="46" fill="${sand}" stroke="none"/><circle cx="466" cy="118" r="27" fill="${copper}" stroke="none"/><path d="M70 288C135 288 158 198 216 211S307 290 363 251 449 197 574 224" stroke="${sage}" stroke-width="66"/><path d="M70 288C135 288 158 198 216 211S307 290 363 251 449 197 574 224"/><path d="M70 288C135 288 158 198 216 211S289 291 350 177 426 271 574 224" stroke="${copper}"/><circle cx="350" cy="177" r="14" fill="${copper}"/>`
};
const descriptions={
 'do-more-test-time-steps-make-better-forecasts':'A shared context feeds a repeated-update loop and two diverging forecast paths. The curves are conceptual marks, not measured trajectories or performance results.',
 'two-networks-one-spectrum-different-alarms':'Two geometric networks with different connecting curves.',
 'how-many-equilibria-did-the-optimizer-miss':'Three nodes along a winding landscape; one has a copper ring.',
 'what-must-a-traffic-model-remember':'A curved lane, a sequence of marks and a returning memory branch.',
 'when-the-fit-is-not-the-model':'Two curves share a beginning and then separate.',
 'random-stress-tests-are-not-certificates':'Sample nodes inside an open boundary, with another node beyond it.',
 'when-solar-power-changes-fast':'A sun and two changing curves over a broad band.'
};
const contentMap=async directory=>{
 const records=new Map();
 for(const file of await walk(resolve(root,directory))){const source=await readFile(file,'utf8'),fm=source.match(/^---\r?\n([\s\S]*?)\r?\n---/);if(!fm)continue;const data=parse(fm[1]);if(!data.draft)records.set(data.sourceSlug||data.slug,data);}
 return records;
};
const english=await contentMap('src/content/writing'),chinese=await contentMap('src/content/writing-zh');
let font;
const titleFont=async()=>{
 if(font)return font;
 for(const file of [process.env.READER_CJK_FONT_FILE,'C:/Windows/Fonts/NotoSansTC-VF.ttf','/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','/usr/share/fonts/truetype/noto/NotoSansTC-Regular.ttf'].filter(Boolean)){
  try{const bytes=await readFile(file);return font={file,family:file.endsWith('.ttc')?'Noto Sans CJK TC':'Noto Sans TC',sha256:hash(bytes)};}catch{}
 }
 throw new Error('Changed editorial sharing images require a readable Noto Traditional Chinese font. Set READER_CJK_FONT_FILE; reviewed images with matching receipts are reused without fonts.');
};
async function renderShare(destination,title,locale,coverSvg,palette=null){
 const face=await titleFont();
 const ink=palette?.ink??forest,paper=palette?.paper??ivory,panel=palette?.soft??'#e8eee7',rule=palette?.line??sage;
 const text=async(value,size,width)=>sharp({text:{text:`<span foreground="${ink}">${escape(value)}</span>`,font:`${face.family} Medium ${size}`,fontfile:face.file,width,wrap:'word-char',rgba:true,spacing:8}}).png().toBuffer();
 let size=52,titlePng=await text(title,size,700);
 while((await sharp(titlePng).metadata()).height>330&&size>34)titlePng=await text(title,size-=2,700);
 if((await sharp(titlePng).metadata()).height>330)throw new Error('Sharing title exceeds the safe layout: '+title);
 const base=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${paper}"/><path d="M0 0V630" stroke="${ink}" stroke-width="24"/><rect x="804" y="140" width="352" height="342" rx="28" fill="${panel}"/><path d="M64 520H1156" stroke="${rule}" stroke-width="2"/></svg>`);
 await sharp(base).composite([
  {input:await text('Kenneth Cheng',30,1050),left:64,top:45},
  {input:await text(locale==='zh-Hant'?'數學・模型・思考':'Mathematics · models · ideas',22,700),left:64,top:100},
  {input:titlePng,left:64,top:157},
  {input:await sharp(Buffer.from(coverSvg)).resize(352,220).png().toBuffer(),left:804,top:200},
  {input:await text(locale==='zh-Hant'?'編輯示意插畫・非研究數據':'Editorial illustration · not research data',19,680),left:64,top:550},
  {input:await text('skckenneth.github.io',19,350),left:804,top:550}
 ]).png({compressionLevel:9}).toFile(destination);
 return {fontFamily:face.family,fontSha256:face.sha256,title,locale};
}
const editorial={};
for(const id of EDITORIAL_ARTICLE_IDS){
 const titles={en:english.get(id)?.title,'zh-Hant':chinese.get(id)?.title};
 if(Object.values(titles).some(title=>typeof title!=='string'||!title.trim()))throw new Error('Editorial media needs both published titles: '+id);
 const palette=id===ttfSlug?ttfPalette:null;
 const coverSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><title>${escape(titles.en)} — editorial illustration</title><desc>Decorative editorial cover, not a research figure or data. ${descriptions[id]}</desc><rect width="640" height="400" fill="${palette?.paper??ivory}"/><g fill="none" stroke="${palette?.ink??forest}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">${shapes[id]}</g></svg>\n`;
 const svgKey=`images/reader-covers/${id}.svg`,coverKey=`images/reader-covers/${id}.webp`;
 await generateOnce(svgKey,Buffer.from('reader-cover-svg-v1:'+coverSvg),destination=>writeFile(destination,coverSvg,'utf8'));
 await generateOnce(coverKey,Buffer.from('reader-cover-webp-v1:640x400-q90:'+coverSvg),destination=>sharp(Buffer.from(coverSvg)).webp({quality:90}).toFile(destination));
 const shares={};
 for(const locale of ['en','zh-Hant']){
  const key=`images/reader-shares/${id}-${locale}.png`;shares[locale]=key;
  const input=JSON.stringify({profile:'reader-editorial-share-v1:1200x630-noto-title',id,locale,title:titles[locale],coverSvg,...palette?{palette}:{}});
  await generateOnce(key,Buffer.from(input),destination=>renderShare(destination,titles[locale],locale,coverSvg,palette));
 }
 editorial[id]={titles,cover:coverKey,coverSvg:svgKey,shares,purpose:'decorative-editorial-cover-not-research-data'};
}
await writeFile(receiptPath,JSON.stringify({version:1,images,editorial},null,2)+'\n','utf8');
console.log(`Generated ${count} reader thumbnails, ${EDITORIAL_ARTICLE_IDS.length} editorial SVG/WebP covers, ${EDITORIAL_ARTICLE_IDS.length*2} bilingual sharing PNGs and the common sharing image.`);
