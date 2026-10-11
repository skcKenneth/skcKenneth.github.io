import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {TOPIC_IDS,TOPICS,START_HERE,getTopicIds} from '../src/data/site-reader.mjs';
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
    assert.match(path,/^images\/(?:og-reader\.png|reader-thumbs\/[a-z0-9-]+\.webp)$/);
    const bytes=readFileSync(new URL('../public/'+path,import.meta.url));
    assert.equal(bytes.length,record.bytes,path);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256,path);
    assert.match(record.inputSha256,/^[a-f0-9]{64}$/);
  }
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
}
