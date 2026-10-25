import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {TOPIC_IDS,TOPICS,START_HERE,getTopicIds} from '../src/data/site-reader.mjs';
import {EDITORIAL_ARTICLE_IDS,getReaderMedia} from '../src/data/reader-media.mjs';
import {collections} from './helpers/reader-content.mjs';
import assignments from '../src/data/topic-assignments.json' with {type:'json'};

test('stable bilingual topic registry and legacy assignments keep one primary and at most two related topics',()=>{
  assert.equal(TOPIC_IDS.length,8);
  assert.equal(new Set(TOPIC_IDS).size,8);
  for(const topic of TOPICS)for(const locale of ['en','zh-Hant']){
    assert.ok(topic.label[locale]);assert.ok(topic.description[locale]);
  }
  assert.equal(START_HERE.length,3);
  for(const [id,topics] of Object.entries(assignments)){
    assert.ok(topics.length>=1&&topics.length<=3,id);
    assert.equal(topics.length,new Set(topics).size,id);
    assert.ok(topics.every(topic=>TOPIC_IDS.includes(topic)),id);
    assert.deepEqual(getTopicIds({slug:id}),getTopicIds({slug:'translated-'+id,sourceSlug:id}));
  }
});

test('the share image is a real 1200 by 630 PNG, generated from the retained brand',()=>{
  const png=readFileSync(new URL('../public/images/og-reader.png',import.meta.url));
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
});

test('generated image receipt preserves reviewed PNG and thumbnail bytes across platforms',()=>{
  const receipt=JSON.parse(readFileSync(new URL('../public/images/reader-media-manifest.json',import.meta.url),'utf8'));
  assert.equal(receipt.version,1);assert.ok(receipt.images['images/og-reader.png']);
  for(const [path,record] of Object.entries(receipt.images)){
    assert.match(path,/^images\/(?:og-reader\.png|reader-thumbs\/[a-z0-9-]+\.webp|reader-covers\/[a-z0-9-]+\.(?:svg|webp)|reader-shares\/[a-z0-9-]+-(?:en|zh-Hant)\.png)$/);
    const bytes=readFileSync(new URL('../public/'+path,import.meta.url));
    assert.equal(bytes.length,record.bytes,path);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256,path);
    assert.match(record.inputSha256,/^[a-f0-9]{64}$/);
  }
});

test('registered editorial covers have distinct geometry, exact sizes and explicit decorative provenance',async()=>{
  const sharp=createRequire(import.meta.resolve('astro/package.json'))('sharp');
  const manifest=JSON.parse(readFileSync(new URL('../public/images/reader-media-manifest.json',import.meta.url),'utf8'));
  assert.deepEqual(Object.keys(manifest.editorial).sort(),[...EDITORIAL_ARTICLE_IDS].sort());assert.equal(new Set(EDITORIAL_ARTICLE_IDS).size,EDITORIAL_ARTICLE_IDS.length);
  const drawings=new Set();
  for(const id of EDITORIAL_ARTICLE_IDS){
    const record=manifest.editorial[id];assert.equal(record.purpose,'decorative-editorial-cover-not-research-data');
    const svg=readFileSync(new URL('../public/'+record.coverSvg,import.meta.url),'utf8');
    assert.match(svg,/width="640" height="400"/);assert.match(svg,/<desc>Decorative editorial cover, not a research figure or data\./);
    assert.doesNotMatch(svg,/<(?:script|foreignObject)|\b(?:href|src)="(?:https?:|\/)/i);assert.equal(svg.includes('\r'),false);
    if(['do-more-test-time-steps-make-better-forecasts','when-local-precision-hides-the-wrong-source'].includes(id)){assert.match(svg,/#7A1E3A/);assert.match(svg,/#FAF8F7/);assert.doesNotMatch(svg,/#1f6652|#a96d46/);}
    else {assert.match(svg,/#1f6652/);assert.match(svg,/#f5f3ed/);}
    drawings.add(svg.replace(/<title>.*?<\/title>|<desc>.*?<\/desc>/g,''));
    const media=getReaderMedia(id);assert.deepEqual(media.cover,{src:'/'+record.cover,width:640,height:400});
    const dimensions=await sharp(readFileSync(new URL('../public'+media.cover.src,import.meta.url))).metadata();assert.equal(dimensions.width,640);assert.equal(dimensions.height,400);
  }
  assert.equal(drawings.size,EDITORIAL_ARTICLE_IDS.length);assert.equal(getReaderMedia('modeling-workflow'),null);assert.equal(getReaderMedia('__proto__'),null);assert.equal(getReaderMedia(EDITORIAL_ARTICLE_IDS[0],'unknown'),null);
});

test('all registered share PNGs carry exact localized titles, readable-font receipts and canonical bilingual IDs',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../public/images/reader-media-manifest.json',import.meta.url),'utf8'));
  for(const id of EDITORIAL_ARTICLE_IDS)for(const locale of ['en','zh-Hant']){
    const entries=collections[locale==='en'?'writing':'writingZh'];
    const entry=entries.find(entry=>(entry.data.sourceSlug||entry.data.slug)===id);
    assert.ok(entry&&!entry.data.draft,id);assert.equal(manifest.editorial[id].titles[locale],entry.data.title);
    const media=getReaderMedia(id,locale);assert.ok(media.share.alt.includes(entry.data.title));assert.equal(media.share.width,1200);assert.equal(media.share.height,630);
    const bytes=readFileSync(new URL('../public'+media.share.src,import.meta.url));
    assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);assert.equal(bytes.readUInt32BE(16),1200);assert.equal(bytes.readUInt32BE(20),630);
    const receipt=manifest.images[media.share.src.slice(1)];assert.equal(receipt.rendering.title,entry.data.title);assert.equal(receipt.rendering.locale,locale);
    assert.match(receipt.rendering.fontFamily,/Noto Sans/);assert.match(receipt.rendering.fontSha256,/^[a-f0-9]{64}$/);
  }
});

test('test-time forecasting homepage art stays separate from its quantitative research figures',()=>{
  const id='do-more-test-time-steps-make-better-forecasts';
  assert.ok(EDITORIAL_ARTICLE_IDS.includes(id));
  const manifest=JSON.parse(readFileSync(new URL('../public/images/reader-media-manifest.json',import.meta.url),'utf8'));
  const record=manifest.editorial[id];assert.ok(record);
  const svg=readFileSync(new URL('../public/'+record.coverSvg,import.meta.url),'utf8');
  assert.match(svg,/shared context.*repeated-update loop.*diverging forecast paths/i);
  assert.match(svg,/not measured trajectories or performance results/);
  assert.match(svg,/#7A1E3A/);assert.doesNotMatch(svg,/#1f6652|#a96d46/);
  assert.doesNotMatch(svg,/<(?:image|text|linearGradient|radialGradient)\b/i);
  for(const locale of ['en','zh-Hant']){
    const entry=collections[locale==='en'?'writing':'writingZh'].find(item=>(item.data.sourceSlug||item.data.slug)===id);
    assert.equal(entry.data.heroImage,'/images/test-time-forecasting/fig-01.svg');
    const media=getReaderMedia(id,locale);
    assert.equal(media.cover.src,'/images/reader-covers/'+id+'.webp');
    assert.equal(media.share.src,'/images/reader-shares/'+id+'-'+locale+'.png');
  }
});

test('matching receipts reuse all reviewed raster bytes instead of rerendering fonts on every build',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../public/images/reader-media-manifest.json',import.meta.url),'utf8'));
  const paths=Object.keys(manifest.images).map(path=>new URL('../public/'+path,import.meta.url));
  const before=paths.map(path=>({hash:createHash('sha256').update(readFileSync(path)).digest('hex'),modified:statSync(path).mtimeMs}));
  execFileSync(process.execPath,['scripts/generate-reader-media.mjs'],{cwd:new URL('../',import.meta.url),stdio:'pipe'});
  paths.forEach((path,index)=>{assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),before[index].hash);assert.equal(statSync(path).mtimeMs,before[index].modified);});
});

if(process.argv.includes('--built')){
  for(const prefix of ['','zh/'])test(`built ${prefix||'English'} homepage exposes four primary destinations and locale RSS`,()=>{
    const html=readFileSync(new URL(`../dist/${prefix}index.html`,import.meta.url),'utf8');
    const nav=html.match(/<nav class="primary-navigation"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(nav);
    const hrefs=[...nav.matchAll(/href="([^"]+)"/g)].map(match=>match[1]);
    assert.deepEqual(hrefs,['writing','topics','teaching','about'].map(section=>`/${prefix}${section}/`));
    assert.ok(html.includes(`href="/${prefix}rss.xml"`));
    assert.ok(html.includes('data-site-refresh="reader-20261011"'));
  });
  for(const prefix of ['','zh/'])test(`built ${prefix||'English'} article has valid share metadata and structured dates`,()=>{
    const html=readFileSync(new URL(`../dist/${prefix}writing/modeling-workflow/index.html`,import.meta.url),'utf8');
    const json=JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1]);
    assert.equal(json['@type'],'BlogPosting');
    assert.ok(json.headline);assert.ok(Number.isFinite(Date.parse(json.datePublished)));
    assert.ok(json.url.endsWith(`/${prefix}writing/modeling-workflow/`));
    assert.ok(json.image.endsWith('/images/og-reader.png'));
    assert.ok(html.includes('data-pagefind-filter="search-kind[content]" content="writing"'));
    assert.ok(html.includes('data-pagefind-filter="archived[content]" content="false"'));
  });
  for(const id of EDITORIAL_ARTICLE_IDS)for(const locale of ['en','zh-Hant'])test(`built ${locale} ${id} publishes its localized editorial sharing image`,()=>{
    const prefix=locale==='en'?'':'zh/';
    const html=readFileSync(new URL(`../dist/${prefix}writing/${id}/index.html`,import.meta.url),'utf8');
    const metadata=Object.fromEntries([...html.matchAll(/<meta\b[^>]*(?:property|name)="([^"]+)"[^>]*content="([^"]*)"[^>]*>/g)].map(match=>[match[1],match[2]]));
    const media=getReaderMedia(id,locale);const shareUrl='https://skckenneth.github.io'+media.share.src;
    assert.equal(metadata['og:image'],shareUrl);assert.equal(metadata['twitter:image'],shareUrl);assert.equal(metadata['og:image:width'],'1200');assert.equal(metadata['og:image:height'],'630');
    const decode=value=>value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
    assert.equal(decode(metadata['og:image:alt']),media.share.alt);
    const json=JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1]);assert.equal(json.image,shareUrl);assert.ok(media.share.alt.includes(json.headline));
  });
}
