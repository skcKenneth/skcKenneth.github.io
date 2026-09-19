import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const root=new URL('../',import.meta.url);
const astroRequire=createRequire(import.meta.resolve('astro/package.json'));
const dependency=async name=>import(pathToFileURL(astroRequire.resolve(name)).href);
const minima={astro:'7.2.8',sharp:'0.35.4','js-yaml':'4.3.2',svgo:'4.1.0','smol-toml':'1.7.1',devalue:'5.9.2'};
const atLeast=(version,min)=>{const a=version.split('.').map(Number),b=min.split('.').map(Number);for(let i=0;i<3;i++){if(a[i]!==b[i])return a[i]>b[i];}return true;};

test('every locked copy meets the verified advisory patch floor',()=>{
  const lock=readFileSync(new URL('pnpm-lock.yaml',root),'utf8').split('\nsnapshots:')[0];
  for(const [name,min] of Object.entries(minima)){
    const versions=[...lock.matchAll(new RegExp('^  '+name+'@([^:]+):','gm'))].map(m=>m[1]);
    assert.ok(versions.length,name+' missing from lock');
    for(const v of versions)assert.ok(/^\d+\.\d+\.\d+$/.test(v)&&atLeast(v,min),name+' '+v+' < '+min);
  }
});

test('YAML merge budget counts empty sources and preserves ordinary frontmatter',async()=>{
  const {load}=await dependency('js-yaml');
  const hostile='arr: &arr [{}, {}, {}, {}]\ntargets:\n'+ '  - <<: *arr\n'.repeat(8);
  assert.throws(()=>load(hostile,{maxTotalMergeKeys:8}),/merge|limit/i);
  const ordinary=load('title: A study\ndraft: false\ntags: [math, research]\n');
  assert.equal(ordinary.title,'A study');assert.equal(ordinary.draft,false);
  assert.deepEqual(ordinary.tags,['math','research']);
});

test('malformed TOML comment endings terminate instead of looping',()=>{
  const moduleUrl=pathToFileURL(astroRequire.resolve('smol-toml')).href;
  const code=`import {parse} from ${JSON.stringify(moduleUrl)}; for(const s of ['a=[1 #','a={b=1 #']){let rejected=false;try{parse(s)}catch{rejected=true}if(!rejected)throw Error('malformed input accepted');}if(parse('a=[1,2]').a.length!==2)throw Error('valid TOML broken');`;
  const result=spawnSync(process.execPath,['--input-type=module','-e',code],{timeout:3000,encoding:'utf8',windowsHide:true});
  assert.equal(result.error,undefined,result.error?.message);assert.equal(result.status,0,result.stderr);
});

test('devalue rejects out-of-range references and round-trips valid state',async()=>{
  const {parse,stringify}=await dependency('devalue');
  for(const input of ['[{"x":999999999}]','[[999999999]]'])assert.throws(()=>parse(input));
  const control={title:'Math',values:[1,2,3],missing:null};
  assert.deepEqual(parse(stringify(control)),control);
});

test('SVGO opt-in script removal covers namespaces and obfuscated schemes',async()=>{
  const {optimize}=await dependency('svgo');
  const input='<svg xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg"><s:a href="javascript:alert(1)"><text>x</text></s:a><a href="java&#9;script:alert(2)"><text>y</text></a><a href="https://example.org/"><text>safe</text></a></svg>';
  const output=optimize(input,{plugins:['removeScripts']}).data;
  assert.doesNotMatch(output,/alert\(|java(?:&#9;|\s)*script/i);assert.match(output,/https:\/\/example.org\//);
});

test('SVGO opt-in script removal covers executable foreignObject HTML',async()=>{
  const {optimize}=await dependency('svgo');
  const input='<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><div xmlns="http://www.w3.org/1999/xhtml" onload="alert(1)"><iframe srcdoc="&lt;script&gt;alert(2)&lt;/script&gt;"/><a href="javascript:alert(3)">x</a></div></foreignObject><rect width="2" height="2"/></svg>';
  const output=optimize(input,{plugins:['removeScripts']}).data;
  assert.doesNotMatch(output,/onload=|srcdoc=|javascript:|alert\(/i);assert.match(output,/<rect/);
});

test('patched Sharp preserves benign image decoding and rejects malformed input',async()=>{
  const sharp=astroRequire('sharp');
  const svg=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><rect width="2" height="2" fill="white"/></svg>');
  const png=await sharp(svg).png().toBuffer();const metadata=await sharp(png).metadata();
  assert.equal(metadata.width,2);assert.equal(metadata.height,2);
  await assert.rejects(sharp(Buffer.from('not an image')).metadata());
});

test('Astro base matching respects path segments, including alternate prefixes',async()=>{
  const {Router}=await import(new URL('./dist/core/routing/router.js',import.meta.resolve('astro/package.json')));
  const route={pattern:/^\/admin\/?$/,fallbackRoutes:[],params:[],segments:[],type:'page',route:'/admin',prerender:true};
  const router=new Router([route],{base:'/app',trailingSlash:'ignore',buildFormat:'directory'});
  assert.equal(router.match('/app/admin').type,'match');
  for(const value of ['/appX/admin','/app2/admin','/app-/admin']){
    assert.deepEqual(router.match(value),{type:'none',reason:'outside-base'});
    assert.deepEqual(router.matchAll(value),[]);
  }
});

test('publication gate audits every dependency scope and fails closed',()=>{
  const pkg=JSON.parse(readFileSync(new URL('package.json',root),'utf8'));
  assert.equal(pkg.engines.node,'>=22.19.0');
  assert.ok(atLeast(process.versions.node,'22.19.0'),'runtime must satisfy the updated dependency engine floor');
  assert.match(pkg.scripts['check:security'],/pnpm audit --audit-level low$/);
  assert.doesNotMatch(pkg.scripts['check:security'],/--prod|--ignore|\|\|/);
  const ci=readFileSync(new URL('.github/workflows/pages.yml',root),'utf8');
  assert.ok(ci.indexOf('pnpm run check:security')<ci.indexOf('Build, index, and validate'));
  assert.doesNotMatch(ci,/continue-on-error/);
});
