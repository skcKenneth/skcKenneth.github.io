import test from 'node:test';
import assert from 'node:assert/strict';
import {matchCatalog,mergeSearchResults} from '../src/lib/search-catalog.mjs';
import {readFileSync} from 'node:fs';
const catalog=[{url:'/zh/teaching/modeling-workshop/',title:'數學建模學習工坊',aliases:['數學建模學習工坊','Mathematical Modeling Workshop']}];
test('Full Chinese course names and spaced bilingual queries match without word segmentation',()=>{
  for(const q of ['數學建模學習工坊','數學 建模 學習 工坊','Ｍａｔｈｅｍａｔｉｃａｌ modeling workshop'])assert.equal(matchCatalog(q,catalog).length,1);
  assert.equal(matchCatalog('不存在',catalog).length,0);assert.equal(matchCatalog('',catalog).length,0);
});
test('Title matches merge with full-text results without duplicate routes',()=>{
  const entries=mergeSearchResults(catalog,[{url:'https://example.com/zh/teaching/modeling-workshop/'},{url:'/zh/research/'}],'https://example.com');
  assert.equal(entries.length,2);assert.equal(entries[0].title,'數學建模學習工坊');
});
test('CUT research has explicit bilingual aliases before its Writing article exists',()=>{
  const source=readFileSync(new URL('../src/components/SiteSearch.astro',import.meta.url),'utf8');
  assert.ok(source.includes('/projects/cut-audit-er/'));
  for(const alias of ['CUT-AUDIT-ER','最高分，未必是最好的修復','When the Highest Score Is Not the Best Repair'])assert.ok(source.includes(alias));
  const entry={url:'/zh/projects/cut-audit-er/',aliases:['CUT-AUDIT-ER','CUT AUDIT ER','最高分，未必是最好的修復']};
  for(const query of ['cut-audit-er','CUT AUDIT ER','最高分，未必是最好的修復'])assert.equal(matchCatalog(query,[entry]).length,1);
});
