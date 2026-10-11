import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import * as pagefind from 'pagefind';

test('Layout emits supported Pagefind filter attributes for kind, topic and archive status',()=>{
  const source=readFileSync(new URL('../src/layouts/BaseLayout.astro',import.meta.url),'utf8');
  for(const name of ['search-kind','archived','topic'])assert.ok(new RegExp(`data-pagefind-filter=["']${name}\\[content\\]["']`).test(source),`Missing supported ${name} Pagefind filter attribute`);
});
test('The installed Pagefind engine captures current, archived and question filter values',async()=>{
  const {index,errors}=await pagefind.createIndex();assert.deepEqual(errors,[]);
  try{
    for(const [slug,kind,archived] of [['current','writing','false'],['archived','writing','true'],['question','question','false'],['lesson','lesson','false']]){
      const result=await index.addHTMLFile({url:`/${slug}/`,content:`<html lang="en"><head><meta data-pagefind-filter="search-kind[content]" content="${kind}"><meta data-pagefind-filter="archived[content]" content="${archived}"><meta data-pagefind-filter="topic[content]" content="data-ai"></head><body><main data-pagefind-body><h1>${slug} modeling</h1><p>Evidence and questions.</p></main></body></html>`});
      assert.deepEqual(result.errors,[]);
    }
    const {files}=await index.getFiles();const fragments=files.filter(file=>file.path.startsWith('fragment/')).map(file=>JSON.parse(gunzipSync(file.content).toString().replace(/^pagefind_dcd/,'')));
    assert.equal(fragments.length,4);
    for(const fragment of fragments){assert.deepEqual(fragment.filters.topic,['data-ai']);assert.ok(fragment.filters['search-kind'].length);assert.ok(fragment.filters.archived.length);}
    assert.deepEqual(fragments.find(fragment=>fragment.url==='/archived/').filters.archived,['true']);
    assert.deepEqual(fragments.find(fragment=>fragment.url==='/question/').filters['search-kind'],['question']);
    assert.deepEqual(fragments.find(fragment=>fragment.url==='/lesson/').filters['search-kind'],['lesson']);
  }finally{await pagefind.close();}
});
