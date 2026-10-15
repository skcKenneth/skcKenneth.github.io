import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {splitAuthoredMath,assertCanonicalDisplayMath} from '../src/lib/authored-math.mjs';
import {PRACTICE_PACKS,UPPER_PRACTICE_PACKS} from '../src/data/guided-practice/index.mjs';
import {functionWorksheets} from '../src/data/function-worksheets.mjs';

const native = new URL('../public/math-studio/',import.meta.url);
function runtime() {
 const context={console,document:{compatMode:'CSS1Compat',documentElement:{lang:'zh-Hant'}},localStorage:{getItem:()=>null,setItem(){}},Intl,Date,Math,JSON,Map,Set};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(new URL('../public/math-shared/formulas/authored-math.js',import.meta.url),'utf8'),context);
 vm.runInContext(`const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const state={grade:'g7'};const button=(text,attrs='',cls='')=>'<button '+attrs+'>'+text+'</button>';`,context);
 for(const file of ['i18n.js','data.js','challenge-bank.js','question-bank.js','learning-content.js','english-lessons.js','english-learning.js','english-practice.js','english-challenge.js','learning-ui.js','practice.js']){
  let source=fs.readFileSync(new URL(file,native),'utf8');
  if(file==='practice.js')source=source.replace('return {panel,view,bind};','return {_questionHTML:questionHTML,panel,view,bind};');
  vm.runInContext(source,context,{filename:file});
 }
 return {context,run:code=>vm.runInContext(code,context)};
}
// Read the rendered MathML tree, not the input annotation or HTML text order.
function exponents(html) {
 const result=[];
 for(const math of html.matchAll(/<math\b[^>]*>([\s\S]*?)<\/math>/g)){
  const root={name:'root',children:[]},stack=[root];
  for(const token of math[1].matchAll(/<\/?[a-z][^>]*>|[^<]+/gi)){
   const value=token[0];
   if(value.startsWith('</'))stack.pop();
   else if(value.startsWith('<')){const node={name:value.match(/^<([a-z]+)/i)[1],children:[]};stack.at(-1).children.push(node);if(!value.endsWith('/>'))stack.push(node);}
   else stack.at(-1).children.push(value);
  }
  const text=node=>typeof node==='string'?node:node.children.map(text).join('');
  const visit=node=>{if(typeof node==='string')return;if(node.name==='msup')result.push(text(node.children[1]).replaceAll('−','-'));node.children.forEach(visit);};visit(root);
 }
 return result;
}
test('shared rendering groups complete negative, compound, symbolic and multi-digit exponents',()=>{
 const r=runtime();
 for(const [tex,expected] of [['2^{-3}','-3'],['(-2)^{-2}','-2'],['x^{3+4}','3+4'],['x^{m+2}','m+2'],['x^{12}','12'],['6\\times10^{-8}','-8']]){
  r.context.input='\\('+tex+'\\)';assert.deepEqual(exponents(r.run('MathAuthoredMath.render(input)')),[expected],tex);
 }
 for(const bad of ['2^(-3)','x^-3','x^12'])assert.throws(()=>assertCanonicalDisplayMath(bad),/Group the complete superscript/);
 assert.throws(()=>splitAuthoredMath('\\(x^2'),/Unclosed/);
 assert.throws(()=>splitAuthoredMath('\\(\\(x^2\\)\\)'),/nested/);
 const system=String.raw`\(\begin{cases}(2)x+(3)y=16\\(4)x+(1)y=12\end{cases}\)`;
 assert.deepEqual(splitAuthoredMath(system),[{kind:'math',value:system.slice(2,-2)}],'a row break before a parenthesised coefficient remains inside one formula');
 r.context.input='<img src=x onerror=alert(1)> \\(x^{12}\\)';
 const html=r.run('MathAuthoredMath.render(input)');assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img'));assert.deepEqual(exponents(html),['12']);
});
test('all 28 existing packs use canonical dedicated TeX and explicit inline formula boundaries',()=>{
 const packs=[...PRACTICE_PACKS,...UPPER_PRACTICE_PACKS];assert.equal(packs.length,28);
 const walk=value=>{if(typeof value==='string'){for(const part of splitAuthoredMath(value))if(part.kind==='text')assert.ok(!part.value.includes('^')&&!/\\[A-Za-z]+/.test(part.value),'Unmarked authored formula: '+value);}else if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')Object.values(value).forEach(walk);};
 for(const pack of packs){for(const key of ['title','summary','concept','inquiry','prerequisites','taskTeacher','taskStudent'])walk(pack[key]);for(const q of pack.questions){for(const key of ['expression','answerExpression'])if(q[key])assertCanonicalDisplayMath(q[key]);for(const key of ['prompt','answer','steps','hints','options','scaffold','rubric'])walk(q[key]);}}
});

test('all fourteen function worksheets render canonical bilingual hints with correct fractional and negative exponent semantics',()=>{
 assert.equal(functionWorksheets.length,14);assert.deepEqual(functionWorksheets.map(worksheet=>worksheet.id),Array.from({length:14},(_,i)=>String(i+1).padStart(2,'0')));
 const r=runtime();for(const worksheet of functionWorksheets){assert.ok(worksheet.hints?.length);for(const hint of worksheet.hints)for(const locale of ['en','zh-Hant']){const text=hint[locale];assert.ok(typeof text==='string'&&text.trim(),worksheet.id+'/'+locale);for(const part of splitAuthoredMath(text)){if(part.kind==='text')assert.ok(!/\^|\\[A-Za-z]+/.test(part.value),'Unmarked function hint formula '+worksheet.id+'/'+locale+': '+part.value);else assertCanonicalDisplayMath(part.value);}r.context.input=text;r.run('MathAuthoredMath.render(input)');}}
 const worksheet=functionWorksheets.find(worksheet=>worksheet.id==='11');for(const locale of ['en','zh-Hant']){const hint=worksheet.hints[0][locale];assert.deepEqual(splitAuthoredMath(hint).filter(part=>part.kind==='math').map(part=>part.value),['x^{1/2}','\\sqrt{x}','x^{-1}','\\frac{1}{x}']);r.context.input=hint;const html=r.run('MathAuthoredMath.render(input)');assert.deepEqual(exponents(html),['1/2','-1'],'Read both complete second-child exponents from actual MathML: '+locale);assert.ok(/<msqrt>\s*<mi>x<\/mi>\s*<\/msqrt>/.test(html),'Root applies to x: '+locale);assert.ok(/<mfrac>\s*<mn>1<\/mn>\s*<mi>x<\/mi>\s*<\/mfrac>/.test(html),'Reciprocal numerator 1 and denominator x: '+locale);}
 const component=fs.readFileSync(new URL('../src/components/FunctionWorksheetPage.astro',import.meta.url),'utf8');assert.ok(/<MathText\s+text=\{l\(hint\)\}\s*\/>/.test(component),'Worksheet hint markup must call the authored-math renderer');
});
test('native annotation-only changes preserve every selectable key, answer and legacy authored string',()=>{
 const r=runtime();
 const raw=r.run(`JSON.stringify({bank:lessons.flatMap(l=>PracticeBank.pool(l.id).map(q=>({key:q.key,prompt:q.prompt,answer:q.answer,type:q.type,answerText:q.answerText,tolerance:q.tolerance,params:q.params}))),foundations:Object.entries(LearningContent.chapters).flatMap(([id,rows])=>rows.flatMap(row=>[1,17,71,127].map(seed=>({id,section:row.id,seed,...row.make(seed)}))))},(key,value)=>key==='math'?undefined:value)`);
 // Frozen immediately before this hotfix from the published 7b789f5 native data.
 assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'9bce6682246c8d4082eb6798a22a575d4ddcf95989f4a5eb17b24f21a08677bc');
});
test('every annotated native variant renders both languages without residual caret prose',()=>{
 const r=runtime();const records=r.run(`(()=>{const rows=lessons.flatMap(l=>PracticeBank.pool(l.id).filter(q=>q.math));for(const sections of Object.values(LearningContent.chapters))for(const section of sections)for(let seed=0;seed<128;seed++){const q=section.make(seed);if(q.math)rows.push(q);}return rows;})()`);
 assert.ok(records.length>500);
 for(const lang of ['zh-Hant','en']){
  r.context.lang=lang;r.run('MathStudioI18n.setLanguage(lang)');
  for(const q of records){r.context.q=q;const fields=[q.prompt,q.hint,...q.steps.flatMap(step=>typeof step==='string'?[step]:[step.doing,step.why]),...(q.followups||[]).map(row=>row.text)].filter(Boolean);
   for(const text of fields){r.context.text=text;const marked=r.run('MathStudioMath.mark(MathStudioI18n.translate(text),q.math)');for(const part of splitAuthoredMath(marked))if(part.kind==='text'){assert.ok(!part.value.includes('^'),marked);if(lang==='en')assert.ok(!/[\u3400-\u9fff]/.test(part.value),marked);}r.run('MathStudioMath.render(text,q.math)');}
  }
 }
});
test('native UI renders authored math but keeps learner drafts escaped and verbatim',()=>{
 const r=runtime();r.run("MathStudioI18n.setLanguage('en')");
 const html=r.run(`(()=>{const q=PracticeBank.pool('operations').find(q=>q.family==='operations-challenge-scientific');return PracticeUI._questionHTML(q,0,{runId:1,drafts:{0:'USER ^(3+4) <b>原樣</b>'},answers:{0:{type:'numeric',correct:true}}});})()`);
 assert.ok(exponents(html).length>=3);assert.ok(html.includes('USER ^(3+4) &lt;b&gt;原樣&lt;/b&gt;'));assert.ok(!html.includes('<b>原樣</b>'));
 const foundation=r.run("LearningUI.panel('operations')");assert.ok(exponents(foundation).length>=2);assert.ok(!foundation.replace(/<math\b[\s\S]*?<\/math>/g,'').includes('10^'));
});
