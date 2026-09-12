import test from 'node:test';
import assert from 'node:assert/strict';
import {matchCatalog,mergeSearchResults} from '../src/lib/search-catalog.mjs';
const catalog=[{url:'/zh/teaching/modeling-workshop/',title:'數學建模學習工坊',aliases:['數學建模學習工坊','Mathematical Modeling Workshop']}];
test('Full Chinese course names and spaced bilingual queries match without word segmentation',()=>{
  for(const q of ['數學建模學習工坊','數學 建模 學習 工坊','Ｍａｔｈｅｍａｔｉｃａｌ modeling workshop'])assert.equal(matchCatalog(q,catalog).length,1);
  assert.equal(matchCatalog('不存在',catalog).length,0);assert.equal(matchCatalog('',catalog).length,0);
});
test('Title matches merge with full-text results without duplicate routes',()=>{
  const entries=mergeSearchResults(catalog,[{url:'https://example.com/zh/teaching/modeling-workshop/'},{url:'/zh/research/'}],'https://example.com');
  assert.equal(entries.length,2);assert.equal(entries[0].title,'數學建模學習工坊');
});
