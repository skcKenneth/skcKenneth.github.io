import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const root=new URL('../',import.meta.url);
const astroRequire=createRequire(import.meta.resolve('astro/package.json'));
const dependency=async name=>import(pathToFileURL(astroRequire.resolve(name)).href);
const minima={astro:'7.3.3',vite:'8.1.6',undici:'8.12.2',zod:'4.6.6',sharp:'0.35.5','js-yaml':'4.3.2',svgo:'4.1.0','smol-toml':'1.9.0',devalue:'5.9.4','fast-uri':'3.1.9',katex:'0.18.2','source-map-js':'1.2.2'};
const atLeast=(version,min)=>{const a=version.split('.').map(Number),b=min.split('.').map(Number);for(let i=0;i<3;i++){if(a[i]!==b[i])return a[i]>b[i];}return true;};

test('every locked copy meets the verified advisory patch floor',()=>{
  const lock=readFileSync(new URL('pnpm-lock.yaml',root),'utf8').split('\npackages:')[1]?.split('\nsnapshots:')[0];
  assert.ok(lock,'locked package declarations are required');
  for(const [name,min] of Object.entries(minima)){
    const versions=[...lock.matchAll(new RegExp('^  '+name+'@([^:]+):','gm'))].map(m=>m[1]);
    assert.ok(versions.length,name+' missing from lock');
    for(const v of versions)assert.ok(/^\d+\.\d+\.\d+$/.test(v)&&atLeast(v,min),name+' '+v+' < '+min);
  }
});

test('oversized constrained Zod collections stop before accumulating element issues',async()=>{
  const {z}=await dependency('zod');
  const hostile=z.array(z.string()).max(2).safeParse(Array(10000).fill(17));
  assert.equal(hostile.success,false);
  assert.equal(hostile.error.issues.length,1);
  assert.equal(hostile.error.issues[0].code,'too_big');
  const ordinary=z.array(z.string()).max(2).safeParse(['heat','source']);
  assert.equal(ordinary.success,true);
  assert.deepEqual(ordinary.data,['heat','source']);
});

test('Astro JSX escapes dynamic script and style terminators while retaining trusted compiler literals',async()=>{
  const {jsx}=await import('astro/jsx-runtime');
  const {renderJSX}=await import('astro/runtime/server/jsx.js');
  const {markHTMLString}=await import('astro/runtime/server/index.js');
  for(const tag of ['script','style'])for(const ending of [tag,tag.toUpperCase()]){
    const payload=`</${ending}><script>UNTRUSTED_MARKER</script>`;
    const html=String(await renderJSX({},jsx(tag,{children:payload})));
    assert.doesNotMatch(html,/<\/(?:script|style)>\s*<script>/i);
    assert.equal((html.match(/<script>/g)||[]).length,tag==='script'?1:0);
    assert.match(html,/UNTRUSTED_MARKER/,'escape, do not silently discard dynamic text');
  }
  const literal=String(await renderJSX({},jsx('script',{children:markHTMLString('const ok = 2 < 3;')})));
  assert.equal(literal,'<script>const ok = 2 < 3;</script>');
  assert.equal(String(await renderJSX({},jsx('style',{children:'p { color: red; }'}))),'<style>p { color: red; }</style>');
});

test('legacy icon helper pins the patched Pillow floor without rewriting published artwork',()=>{
  const requirement=readFileSync(new URL('../scripts/requirements-personal-icon.txt',import.meta.url),'utf8');
  assert.match(requirement,/^Pillow==13\.0\.0\s*$/m);
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

test('indexed source maps reject invalid or amplified offsets while preserving ordinary mappings',()=>{
  const postcssRequire=createRequire(astroRequire.resolve('postcss'));
  const {SourceMapConsumer,SourceMapGenerator}=postcssRequire('source-map-js');
  const flat={version:3,sources:['lesson.js'],names:[],mappings:'AAAA'};
  const indexed=(line,column=0,map=flat)=>({version:3,sections:[{offset:{line,column},map}]});
  for(const value of [-1,0.5,Infinity,NaN,'2',Number.MAX_SAFE_INTEGER+1]){
    assert.throws(()=>new SourceMapConsumer(indexed(value)),/offset|integer/i);
    assert.throws(()=>new SourceMapConsumer(indexed(0,value)),/offset|integer/i);
  }
  assert.throws(()=>new SourceMapConsumer(indexed(10000001)),/exceed/i);
  assert.throws(()=>new SourceMapConsumer(indexed(4000000,0,indexed(4000000,0,indexed(4000000)))),/nested|exceed/i);
  const consumer=new SourceMapConsumer(indexed(2));
  const mappings=[];consumer.eachMapping(mapping=>mappings.push(mapping));
  assert.equal(mappings.length,1);assert.equal(mappings[0].generatedLine,3);
  const generator=new SourceMapGenerator({file:'lesson-built.js'});
  mappings.forEach(mapping=>generator.addMapping({generated:{line:mapping.generatedLine,column:mapping.generatedColumn},original:{line:mapping.originalLine,column:mapping.originalColumn},source:mapping.source}));
  const copied=generator.toJSON();
  assert.equal(copied.mappings,';;AAAA');assert.deepEqual(copied.sources,['lesson.js']);
});

test('KaTeX ignores inherited trust settings and preserves explicit safe rendering',async()=>{
  const {default:katex}=await import('katex');
  const expression=String.raw`\htmlClass{trusted-marker}{x}`;
  const inherited=Object.assign(Object.create({trust:true}),{throwOnError:true,strict:'ignore'});
  const untrusted=katex.renderToString(expression,inherited);
  assert.doesNotMatch(untrusted,/class="[^"]*\btrusted-marker\b/);
  assert.match(untrusted,/katex/);
  const explicitlyTrusted=katex.renderToString(expression,{trust:true,throwOnError:true,strict:'ignore'});
  assert.match(explicitlyTrusted,/class="[^"]*\btrusted-marker\b/);
  const formula=katex.renderToString(String.raw`\frac{1}{2}+\sqrt{x^2}`,{output:'htmlAndMathml',throwOnError:true,strict:'error',trust:false});
  assert.match(formula,/<math\b/);assert.match(formula,/katex-html/);
});

test('devalue rejects out-of-range references and round-trips valid state',async()=>{
  const {parse,stringify}=await dependency('devalue');
  for(const input of ['[{"x":999999999}]','[[999999999]]'])assert.throws(()=>parse(input));
  const control={title:'Math',values:[1,2,3],missing:null};
  assert.deepEqual(parse(stringify(control)),control);
});

test('KaTeX ignores inherited trust but preserves ordinary math',()=>{
  const katex=createRequire(import.meta.url)('katex');
  const options=Object.create({trust:true});
  options.throwOnError=false;
  const expression=String.raw`\href{https://example.org/}{x}`;
  const html=katex.renderToString(expression,options);
  assert.doesNotMatch(html,/<a\s/);
  assert.match(katex.renderToString(expression,{trust:true}),/<a\s/);
  assert.match(katex.renderToString('x^2+1'),/katex/);
});

test('flat valid TOML and table arrays finish in bounded subprocess time',()=>{
  const moduleUrl=pathToFileURL(astroRequire.resolve('smol-toml')).href;
  const code=`import {parse} from ${JSON.stringify(moduleUrl)};const s=Array.from({length:32000},(_,i)=>'k'+i+' = 1').join('\\n');if(Object.keys(parse(s)).length!==32000)throw Error('flat keys lost');if(parse('[[a]]\\nx=1\\n[[a]]\\nx=2').a.length!==2)throw Error('tables broken');`;
  const result=spawnSync(process.execPath,['--input-type=module','-e',code],{timeout:5000,encoding:'utf8',windowsHide:true});
  assert.equal(result.error,undefined,result.error?.message);assert.equal(result.status,0,result.stderr);
});

test('indexed source maps reject amplified and invalid offsets, retaining ordinary maps',()=>{
  const {SourceMapConsumer}=astroRequire('source-map-js');
  const flat={version:3,sources:['input.js'],names:[],mappings:'AAAA'};
  const indexed=(line,column=0)=>({version:3,sections:[{offset:{line,column},map:flat}]});
  for(const line of [10000001,Infinity,NaN,-1,.5])assert.throws(()=>new SourceMapConsumer(indexed(line)),/offset/i);
  for(const column of [Infinity,NaN,-1,.5])assert.throws(()=>new SourceMapConsumer(indexed(0,column)),/offset/i);
  const nested={version:3,sections:[{offset:{line:6000000,column:0},map:indexed(6000000)}]};
  assert.throws(()=>new SourceMapConsumer(nested),/offset/i);
  const map=new SourceMapConsumer(indexed(2));
  assert.equal(map.originalPositionFor({line:3,column:1}).line,1);
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
  assert.ok(ci.indexOf('pnpm run check:security')>=0,'CI must include the security gate');
  assert.ok(ci.indexOf('Build, index, and validate')>=0,'CI must include the full build gate');
  assert.ok(ci.indexOf('pnpm run check:security')<ci.indexOf('Build, index, and validate'));
  assert.doesNotMatch(ci,/continue-on-error/);
});
