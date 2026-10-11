import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

test('offline asset reports count static imports once and keep potential/dynamic/share assets separate',async()=>{
  const workspace=resolve(import.meta.dirname,'..'),cache=resolve(workspace,'.cache');
  await mkdir(cache,{recursive:true});const temporary=await mkdtemp(resolve(cache,'reader-assets-test-'));
  try {
    const dist=resolve(temporary,'dist'),out=resolve(temporary,'report');await mkdir(dist,{recursive:true});
    const files={
      'index.html':'<link rel="stylesheet" href="/style.css"><script type="module" src="/start.js"></script><script>window.example=1</script><img src="/cover.webp?v=1" srcset="/cover.webp 1x, /cover-large.webp 2x" width="640" height="400" loading="lazy"><meta property="og:image" content="https://skckenneth.github.io/share.png"><img src="https://external.invalid/image.png">',
      'style.css':'@import "./secondary.css"; @font-face{font-family:Example;src:url("/font.woff2")}',
      'secondary.css':'body{color:green}',
      'start.js':'import {value} from "./shared.js"; import "./shared.js"; window.value=value; import("./later.js");',
      'shared.js':'export const value=1;',
      'later.js':'console.log("only after interaction")',
      'font.woff2':'font-candidate',
      'cover.webp':'small-cover',
      'cover-large.webp':'large-cover-candidate',
      'share.png':'sharing-metadata-only'
    };
    for(const [path,source] of Object.entries(files))await writeFile(resolve(dist,path),source);
    const routes=resolve(temporary,'routes.json');await writeFile(routes,'["/"]');
    execFileSync(process.execPath,['scripts/measure-reader-assets.mjs','--dist',dist,'--out',out,'--routes',routes,'--label','Uncommitted candidate fixture'],{cwd:workspace,stdio:'pipe'});
    const report=JSON.parse(await readFile(resolve(out,'assets.json'),'utf8')),page=report.routes[0];
    assert.equal(report.label,'Uncommitted candidate fixture');assert.ok(['working-tree','clean'].includes(report.sourceState));
    assert.match(report.method,/no HTTP requests.*Web Vitals/);assert.equal(page.totals.initialJsBytes,Buffer.byteLength(files['start.js']+files['shared.js']));
    assert.equal(page.totals.cssBytes,Buffer.byteLength(files['style.css']+files['secondary.css']));assert.equal(page.totals.declaredImageBytes,Buffer.byteLength(files['cover.webp']));
    assert.equal(page.initialScriptGraph.length,2);assert.deepEqual(page.dynamicImportTargets.map(item=>item.path),['/later.js']);assert.deepEqual(page.shareMetadataImages.map(item=>item.path),['/share.png']);
    assert.ok(page.candidateAssets.some(item=>item.path==='/font.woff2'));assert.ok(page.candidateAssets.some(item=>item.path==='/cover-large.webp'));assert.equal(page.inlineScriptBytesIncludedInHtml,Buffer.byteLength('window.example=1'));
    assert.deepEqual(page.externalReferences,['https://external.invalid/image.png']);assert.equal(page.declaredImages[0].declared.loading,'lazy');
    const markdown=await readFile(resolve(out,'README.md'),'utf8');assert.ok(markdown.startsWith('# Uncommitted candidate fixture'));if(report.sourceState==='working-tree')assert.match(markdown,/HEAD is the base revision/);
  } finally {
    if(!temporary.startsWith(cache+sep+'reader-assets-test-'))throw new Error('Refusing to remove a fixture outside the intended workspace cache');
    await rm(temporary,{recursive:true,force:true});
  }
});
