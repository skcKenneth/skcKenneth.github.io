import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {translateModelText,modelTranslations} from '../src/lib/model-translations.mjs';
const engines=[
 // Latest pre-R2 HEAD 472bb13 moved the directory filter into ModelDirectory.
 // Its remaining inline numerical script is byte-identical (after LF normalization).
 ['InteractiveModelLaboratory','model-laboratory','486cc692c8ecc69bc093647b7e1c3ede3b37fde6defbac7a5f661e671d0aad3c',3],
 ['FrontierModelStudio','frontier-model-studio','637526de7886867dc4f98430759c136c15f8b416aea6e221cf012dbf6f08c008',6],
 ['ResearchInquiryStudio','research-inquiry-studio','048f97d0f4a832d7d37f5e22dc29f4d37f540240a8f2a2e3ea0aea7cc6783698',3],
];
test('Both language routes use the same real workbenches and preserve all original numerical engines',async()=>{
 for(const[name,slug,hash,count]of engines){
  const source=await readFile(new URL(`../src/components/${name}.astro`,import.meta.url),'utf8');
  // Fingerprints use LF, matching the pre-refactor committed engines on Linux and Windows.
  const numerical=[...source.replace(/\r\n/g,'\n').matchAll(/<script is:inline[^>]*>([\s\S]*?)<\/script>/g)].map(match=>match[1]);
  assert.equal(createHash('sha256').update(JSON.stringify(numerical)).digest('hex'),hash,`${slug}: numerical engine changed`);
  for(const path of [`../src/pages/teaching/${slug}.astro`,`../src/pages/zh/teaching/${slug}.astro`])assert.ok((await readFile(new URL(path,import.meta.url),'utf8')).includes(`components/${name}.astro`));
  assert.equal((source.match(/<form class="model-controls"/g)||[]).length,count);
  assert.ok(source.includes('initializeModelLanguage(document)'));
 }
});
test('Every SSR-localized prompt and condition has an exact Traditional Chinese translation',async()=>{
 for(const[name]of engines){
  const source=await readFile(new URL(`../src/components/${name}.astro`,import.meta.url),'utf8');
  for(const match of source.matchAll(/\bt\("((?:\\.|[^"\\])*)"\)/g)){
   const english=JSON.parse('"'+match[1]+'"');assert.ok(modelTranslations.has(english),english);assert.notEqual(translateModelText(english),english);
  }
 }
});
test('Dynamic readings preserve numeric values, units, equation symbols and limitations',()=>{
 const cases=[
  ['With r = 1.20, the population overshoots K and corrects in later generations. The carrying capacity is an equilibrium, not a hard ceiling.',['1.20','K','並非不可超越']],
  ['The intervention changes β/γ from 2.40 to 0.96, below 1 in the fully susceptible approximation. Timing still matters because infections accumulated before day 25 cannot be undone.',['β/γ','2.40','0.96','25','全體易感']],
  ['At 60 km/h, braking contributes 74% of the modeled total. At 120 km/h the same baseline gives 140.5 m, not merely twice the distance.',['60','74','120','140.5','並非只是距離加倍']],
  ['The complex is connected and contains 1 independent loop. Persistence requires checking how long those loops survive as ε changes.',['1','ε','持續性']],
  ['The complex is connected and contains 2 independent loops. Persistence requires checking how long those loops survive as ε changes.',['2','ε','持續性']],
  ['The ambiguity set shifts the preferred capacity by -3 units. The nominal expected-cost premium is 1.25.',['-3','1.25','名義期望成本']],
 ];
 for(const[english,terms]of cases){const translated=translateModelText(english);assert.notEqual(translated,english);for(const term of terms)assert.ok(translated.includes(term),translated);}
 assert.equal(translateModelText('ε = 0.35 · two rings'),'ε = 0.35・兩個圓環');
 assert.equal(translateModelText('x′ = x − x³'),'x′ = x − x³');
 assert.equal(translateModelText('https://doi.org/10.1038/nature08227'),'https://doi.org/10.1038/nature08227');
});
