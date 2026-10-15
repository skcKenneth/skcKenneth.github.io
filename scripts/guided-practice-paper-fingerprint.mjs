// Bind a lower-paper collection to its actual authored data and frozen print build.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {LOWER_PRACTICE_PACKS} from '../src/data/guided-practice/index.mjs';
const sha=value=>createHash('sha256').update(value).digest('hex');
export async function lowerPaperFingerprint(){
 const rows=[];
 for(const pack of LOWER_PRACTICE_PACKS)for(const locale of ['en','zh-Hant'])for(const teacher of [false,true]){
  const path=`${locale==='zh-Hant'?'/zh':''}/teaching/classroom-packs/${pack.id}/${teacher?'teacher/':''}`;
  const html=await readFile(new URL('../dist'+path+'index.html',import.meta.url),'utf8');
  const start=html.indexOf('<section class="guided-print-root"'),at=html.indexOf('data-practice-configuration'),end=html.lastIndexOf('<script',at);
  assert.ok(start>=0&&end>start,'Missing current print roots: '+path);
  const css=[];
  for(const match of html.matchAll(/href="(\/_astro\/[^"?]+\.css)"/g))css.push(sha(await readFile(new URL('../dist'+match[1],import.meta.url))));
  rows.push({path,printHTMLSHA256:sha(html.slice(start,end)),css});
 }
 assert.equal(rows.length,100);
 return {schema:'lower-paper-v1',sourceSHA256:sha(JSON.stringify(LOWER_PRACTICE_PACKS)),printBuildSHA256:sha(JSON.stringify(rows)),routes:rows.length};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await lowerPaperFingerprint()));
