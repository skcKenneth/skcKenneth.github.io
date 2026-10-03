import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';

const packageUrl=import.meta.resolve('astro/package.json');
const astroRequire=createRequire(packageUrl);
const remoteUrl=new URL('./dist/assets/build/remote.js',packageUrl);
const {loadRemoteImage,revalidateRemoteImage}=await import(remoteUrl);
const src='https://images.example.org/a.png';
const old={etag:'"old"',lastModified:'Mon, 01 Sep 2025 00:00:00 GMT'};
const policy={domains:['images.example.org'],remotePatterns:[]};
const capture=response=>{
  const requests=[];
  return {requests,fetch:async request=>{requests.push(request);return response();}};
};
const stale=result=>assert.ok(result.expires<=Date.now(),'new cache metadata must expire immediately');

test('patched pinned Astro and dependency removal are required, not an audit exclusion',()=>{
  assert.throws(()=>astroRequire.resolve('http-cache-semantics'),/Cannot find module/);
  const lock=readFileSync(new URL('../pnpm-lock.yaml',import.meta.url),'utf8');
  assert.doesNotMatch(lock,/^  http-cache-semantics@/m);
  const workspace=readFileSync(new URL('../pnpm-workspace.yaml',import.meta.url),'utf8');
  assert.match(workspace,/["']?astro@7\.2\.8>http-cache-semantics["']?:\s*["']-["']/);
  assert.match(workspace,/patchedDependencies:[\s\S]*astro@7\.2\.8/);
  const patch=readFileSync(new URL('../patches/astro@7.2.8.patch',import.meta.url));
  const attributes=readFileSync(new URL('../.gitattributes',import.meta.url),'utf8');
  assert.match(attributes,/^patches\/\*\.patch text eol=lf$/m,'Windows checkout must preserve the pinned patch hash');
  const hash=createHash('sha256').update(patch).digest('hex');
  assert.match(lock,new RegExp('patchedDependencies:[\\s\\S]*?astro@7\\.2\\.8: '+hash));
  const source=readFileSync(remoteUrl,'utf8');
  assert.doesNotMatch(source,/import CachePolicy|new CachePolicy/);
  assert.match(source,/expires: Date\.now\(\)/);
});

test('cache directives and cookies cannot grant a fresh lifetime; image and validators survive',async()=>{
  for(const directive of ['public, max-age=86400','private, max-age=86400','no-store','no-cache','immutable, max-age=999999','max-age=0, stale-if-error=86400']){
    const result=await loadRemoteImage(src,async()=>new Response('image',{headers:{'Cache-Control':directive,'Set-Cookie':'session=private','ETag':'"new"','Last-Modified':old.lastModified}}),policy);
    stale(result);assert.equal(result.data.toString(),'image');assert.equal(result.etag,'"new"');
    assert.equal(result.lastModified,old.lastModified);
    assert.deepEqual(Object.keys(result).sort(),['data','etag','expires','lastModified']);
  }
});

test('304 revalidation keeps content reference and old or updated validators',async()=>{
  for(const headers of [{},{ETag:'"updated"','Last-Modified':'Tue, 02 Sep 2025 00:00:00 GMT'}]){
    const mock=capture(()=>new Response(null,{status:304,headers}));
    const result=await revalidateRemoteImage(src,old,mock.fetch,policy);
    stale(result);assert.equal(result.data,null);
    assert.equal(result.etag,headers.ETag??old.etag);
    assert.equal(result.lastModified,headers['Last-Modified']??old.lastModified);
    assert.equal(mock.requests[0].headers.get('If-None-Match'),old.etag);
    assert.equal(mock.requests[0].headers.get('If-Modified-Since'),old.lastModified);
  }
});

test('changed 200 responses clear absent validators and empty 200 retries unconditionally',async()=>{
  const changed=await revalidateRemoteImage(src,old,async()=>new Response('new'),policy);
  stale(changed);assert.equal(changed.data.toString(),'new');assert.equal(changed.etag,undefined);assert.equal(changed.lastModified,undefined);
  const requests=[];
  const retried=await revalidateRemoteImage(src,old,async request=>{requests.push(request);return new Response(requests.length===1?'':'retry');},policy);
  stale(retried);assert.equal(retried.data.toString(),'retry');assert.equal(requests.length,2);
  assert.equal(requests[1].headers.get('If-None-Match'),null);
});

test('bad statuses and redirects remain rejected',async()=>{
  for(const status of [300,404,500]){
    await assert.rejects(loadRemoteImage(src,async()=>new Response('bad',{status}),policy));
    await assert.rejects(revalidateRemoteImage(src,old,async()=>new Response('bad',{status}),policy));
  }
  await assert.rejects(loadRemoteImage(src,async()=>new Response(null,{status:302,headers:{Location:'https://denied.example.net/x'}}),policy));
  await assert.rejects(loadRemoteImage(src,async()=>new Response(null,{status:302}),policy));
  await assert.rejects(loadRemoteImage(src,async()=>new Response(null,{status:302,headers:{Location:'/loop'}}),policy));
});

test('allowed relative redirects preserve conditional headers',async()=>{
  const requests=[];
  const result=await revalidateRemoteImage(src,old,async request=>{
    requests.push(request);
    return requests.length===1?new Response(null,{status:302,headers:{Location:'/next.png'}}):new Response(null,{status:304});
  },policy);
  stale(result);assert.equal(result.data,null);assert.equal(requests.length,2);
  assert.equal(requests[1].url,'https://images.example.org/next.png');
  assert.equal(requests[1].headers.get('If-None-Match'),old.etag);
});
