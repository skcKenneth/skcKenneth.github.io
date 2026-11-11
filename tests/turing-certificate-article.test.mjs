import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { validatePublishSvg } from '../scripts/science-sync-policy.mjs';

const root = process.cwd();
const slug = 'when-sparsification-invents-a-turing-instability';
const read = p => readFileSync(resolve(root,p),'utf8');
const records = JSON.parse(read('src/data/turing-certificate-audit.json'));
const source = read('public/resources/turing-certificate-audit/results.csv').trim().split(/\r?\n/);
const fields = source.shift().split(',');
const rows = source.map(line => Object.fromEntries(line.split(',').map((value,i)=>[fields[i],value])));
const yes = value => value==='True'||value==='true'||value==='1';

test('public frozen data preserve the byte hashes in the source provenance',()=>{
  const provenance=JSON.parse(read('public/resources/turing-certificate-audit/source-provenance.json'));
  for(const [name,key] of [['results.csv','resultsSha256'],['summary.json','summarySha256']]){
    const bytes=readFileSync(resolve(root,'public/resources/turing-certificate-audit/'+name));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),provenance[key]);
  }
});

test('recorded outcomes preserve reference-conditional denominators and dependence',()=>{
  assert.equal(rows.length,2520);
  assert.equal(records.length,14);
  let conclusive=0;
  for(const record of records){
    const group=rows.filter(r=>r.method===record.method&&Number(r.draws)===record.draws);
    const samplingInstances=new Set(group.map(r=>r.graph_seed+':'+r.replicate));
    const stable=group.filter(r=>r.original_verdict==='stable');
    const unstable=group.filter(r=>r.original_verdict==='unstable');
    assert.equal(group.length,record.evaluations);
    assert.equal(samplingInstances.size,record.samplingInstances);
    assert.equal(stable.length,record.stableDenominator);
    assert.equal(unstable.length,record.unstableDenominator);
    assert.equal(record.samplingInstances*record.scalesPerInstance,record.evaluations);
    const falseUnstable=stable.filter(r=>r.sparse_verdict==='unstable').length;
    const falseStable=unstable.filter(r=>r.sparse_verdict==='stable').length;
    assert.equal(falseUnstable,record.falseUnstableCount);
    assert.equal(falseStable,record.falseStableCount);
    assert.equal(falseUnstable+falseStable,record.disagreementCount);
    assert.equal(group.filter(r=>yes(r.certificate_conclusive)).length,record.conclusiveCount);
    assert.ok(group.every(r=>!yes(r.certificate_conclusive)||r.certificate===r.original_verdict));
    conclusive+=record.conclusiveCount;
  }
  assert.equal(conclusive,193);
  const sample=records.find(r=>r.method==='effective_resistance'&&r.draws===110);
  assert.equal(sample.disagreementCount,63);
  assert.equal(sample.falseUnstableCount/sample.stableDenominator,0.65625);
  assert.equal(sample.falseStableCount,0);
  assert.equal(sample.conclusiveCount,0);
});

test('both substantive editions contain static evidence, accessible explorer and public record',()=>{
  for(const collection of ['writing','writing-zh']){
    const article=read('src/content/'+collection+'/'+slug+'.mdx');
    assert.match(article,/date: 2026-11-11/);
    assert.match(article,/<TuringAuditExplorer locale="(?:en|zh-Hant)"\s*\/>/);
    assert.equal((article.match(/<figure\b/g)||[]).length,4);
    for(const figure of ['band-certificate','budget-outcomes','conditional-errors','spectral-distortion']){
      const svg=read('public/images/turing-certificate-audit/'+figure+'.svg');
      assert.doesNotThrow(()=>validatePublishSvg(svg));
      assert.match(article,new RegExp(figure+'\\.svg'));
    }
    for(const name of ['results.csv','summary.json','source-code.zip','validation.json'])
      assert.ok(article.includes('/resources/turing-certificate-audit/'+name));
  }
  const component=read('src/components/TuringAuditExplorer.astro');
  assert.match(component,/aria-live="polite"/);
  assert.match(component,/<noscript>/);
  assert.match(component,/<caption>/);
});

if(process.argv.includes('--built'))test('built article routes and both homepages expose the publication',()=>{
  for(const locale of ['', 'zh/']){
    const article=read('dist/'+locale+'writing/'+slug+'/index.html');
    assert.match(article,/data-turing-audit/);
    assert.match(article,/63\/180/);
    assert.match(article,/application\/ld\+json/);
    assert.match(article,/katex-mathml/);
    assert.match(article,/budget-outcomes-mobile\.svg/);
    const home=read('dist/'+locale+'index.html');
    assert.ok(home.includes('/'+locale+'writing/'+slug+'/'));
  }
  assert.ok(existsSync(resolve(root,'dist/resources/turing-certificate-audit/source-code.zip')));
});
