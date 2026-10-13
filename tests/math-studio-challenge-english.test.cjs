const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'../public/math-studio');
function runtime(){const context={console,document:{documentElement:{lang:'en'}}};vm.createContext(context);for(const file of ['i18n.js','challenge-bank.js','english-challenge.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});return code=>vm.runInContext(code,context);}
test('Every challenge family has complete English prompts, reasoning, hints, follow-ups and rubrics across seeds',()=>{
 const evaluate=runtime(),result=evaluate(`(()=>{const missing=new Set();const rng=seed=>({int(a,b){seed=(Math.imul(1664525,seed>>>0)+1013904223)>>>0;return a+Math.floor(seed/4294967296*(b-a+1));},pick(values){return values[this.int(0,values.length-1)];}});const walk=value=>{if(typeof value==='string'){if(/[\\u3400-\\u9fff]/.test(MathStudioI18n.english(value)))missing.add(value);}else if(value&&typeof value==='object')Object.values(value).forEach(walk);};const families=Object.values(ChallengeBank.registry).flat();for(const family of families){walk(family.name);walk(family.concept);walk(family.misconceptions);for(let seed=0;seed<128;seed++)walk(family.make(rng(seed)));}return {count:families.length,missing:[...missing]};})()`);
 assert.equal(result.count,36);assert.deepEqual(Array.from(result.missing),[]);
});
test('Challenge localization preserves generated numerical answers, parameters and marking tolerances',()=>{
 const evaluate=runtime();const source=`(()=>{const rng=seed=>({int(a,b){seed=(Math.imul(1664525,seed>>>0)+1013904223)>>>0;return a+Math.floor(seed/4294967296*(b-a+1));},pick(values){return values[this.int(0,values.length-1)];}});return JSON.stringify(Object.values(ChallengeBank.registry).flat().flatMap(family=>[0,7,38,127].map(seed=>{const q=family.make(rng(seed));return {family:family.family,type:q.type,answer:q.answer,answerText:q.answerText,tolerance:q.tolerance,params:q.params};})));})()`;
 const before=evaluate(source);evaluate("MathStudioI18n.setLanguage('en')");assert.equal(evaluate(source),before);
});
test('Joined follow-up labels and zero-divisor explanations retain mathematical conditions',()=>{
 const evaluate=runtime();assert.equal(evaluate("MathStudioI18n.english('−5 本身可以取嗎？')"),'Can −5 itself be included?');assert.equal(evaluate("MathStudioI18n.english('可以寫成 x² 減 4² 嗎？')"),'Can we write this as x² minus 4²?');
 const translated=evaluate("MathStudioI18n.english('a=0 時原式為 0<24，所有實數成立，但不能除以 0。')");assert.match(translated,/a=0/);assert.match(translated,/0<24/);assert.match(translated,/every real x/);assert.match(translated,/division by 0 is not allowed/);
});
