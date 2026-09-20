const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');const root=path.resolve(__dirname,'..');
function loadSite(storage=new Map(),broken=false){
 const listeners={},elements={};function element(){return {innerHTML:'',textContent:'',dataset:{},querySelector(){return null;},querySelectorAll(){return [];},setAttribute(){},focus(){},addEventListener(t,fn){(listeners[t]??=[]).push(fn);}};}
 const app=elements.app=element();const ctx=vm.createContext({console,Intl,Date,Math,Set,Map,JSON,Blob,URL,setTimeout,AbortController,localStorage:{getItem(k){if(broken)throw Error('denied');return storage.get(k)||null;},setItem(k,v){if(broken)throw Error('denied');storage.set(k,v);}},window:{scrollY:0,scrollTo(){},addEventListener(){}},document:{title:'',getElementById(id){return elements[id]??=element();},querySelectorAll(){return [];},createElement(){return {click(){}};}}});
 for(const f of ['data.js','learning-content.js','challenge-bank.js','question-bank.js','learning-ui.js','practice.js','inquiry.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,'public','math-studio',f),'utf8'),ctx,{filename:f});
 const evaluate=s=>vm.runInContext(s,ctx);return {ctx,app,elements,listeners,storage,evaluate};
}
const s=loadSite(),ev=s.evaluate,bank=ev('PracticeBank'),lessons=ev('lessons');let checked=0;
assert.equal(lessons.length,38);assert.equal(ev('Object.keys(labInfo).length'),12);
for(const l of lessons){const pool=bank.pool(l.id);assert(pool.length>=30,l.id+' pool');assert.equal(new Set(pool.map(q=>q.key)).size,pool.length);assert(pool.some(q=>q.type==='written'));assert.equal(new Set(pool.map(q=>q.family)).size,ev('!!ChallengeBank.registry['+JSON.stringify(l.id)+']')?12:8);
 for(const q of pool){checked++;assert(q.prompt&&q.steps?.length,q.family);assert([1,2,3].includes(q.level));assert(!/undefined|NaN/.test(JSON.stringify(q)),q.prompt);
 if(q.type==='numeric'){assert(Number.isFinite(q.answer));assert(bank.gradeNumeric(q,String(q.answer)).correct);assert(bank.gradeNumeric(q,q.answerText).correct);assert(!bank.gradeNumeric(q,String(q.answer+1)).correct);if(q.prompt.includes('保留 3 位小數'))assert(bank.gradeNumeric(q,q.answer.toFixed(3)).correct);}
 if(q.type==='choice'){assert.equal(q.options.length,4,q.prompt);assert.equal(new Set(q.options).size,4,q.prompt);assert(q.answer>=0&&q.answer<4);}
 if(q.type==='written'){assert.equal(q.rubric.length,3);assert(q.steps.length>=2);}
 }
 // Every difficulty scope returns only matching grade/chapter, no same-set duplicates.
 for(const level of ['mix','1','2','3']){
 const c={grade:l.grade,lesson:l.id,level,count:15},history={};let first;
 for(let round=0;round<3;round++){const out=bank.select(c,history);if(level!=='3'||ev('!!ChallengeBank.registry['+JSON.stringify(l.id)+']'))assert.equal(out.questions.length,15,l.id+' / level '+level);else assert.equal(out.shortage,'family-cap');assert.equal(new Set(out.questions.map(q=>q.key)).size,out.questions.length);for(const q of out.questions){assert.equal(q.lessonId,l.id);assert.equal(q.grade,l.grade);assert(level==='mix'||q.level===+level);if(!history[q.key]){}else assert(out.repeats>0);if(q.type==='choice'){const original=pool.find(p=>p.key===q.key);assert.equal(q.options[q.answer],original.options[original.answer]);}history[q.key]=round+1;}if(!first)first=out.questions;}
 }
 // Exhaustion is disclosed and never creates duplicate prompts within a set.
 const allHistory=Object.fromEntries(pool.map((q,i)=>[q.key,i+1]));const result=bank.select({grade:l.grade,lesson:l.id,level:'mix',count:15},allHistory);assert.equal(result.repeats,15);assert.equal(new Set(result.questions.map(q=>q.key)).size,15);
 ev(`openLesson(${JSON.stringify(l.id)})`);assert(s.app.innerHTML.includes('data-practice-scope="'+l.id+'"'));
}
for(const grade of ['g7','g8','g10']){const c={grade,lesson:'all',level:'mix',count:15},a=bank.select(c),h=Object.fromEntries(a.questions.map(q=>[q.key,1])),b=bank.select(c,h);assert(!b.questions.some(q=>h[q.key]));assert.equal(b.repeats,0);}
for(const [input,answer] of [['−３／４',-.75],['.5',.5],['-1/-2',.5],['2.5/0.5',5],[' +8 ',8]])assert.equal(bank.parseNumber(input),answer,input);
for(const input of ['', '1/0','1/2/3','2x','Infinity','NaN','2**3','<script>','0x10','1e309'])assert.equal(bank.parseNumber(input),null,input);
// Prompt-independent domain checks for geometry and sensitive parameter branches.
for(const q of bank.pool('congruence'))if(q.family.endsWith('v3')){const m=q.prompt.match(/AB=(\d+)、BC=(\d+)、CA=(\d+)/);const [a,b,c]=m.slice(1).map(Number);assert(a+b>c&&a+c>b&&b+c>a);assert.equal(q.answer,2*(a+b+c));}
for(const q of bank.pool('symmetry'))if(q.family.endsWith('v4')){const [a,b]=q.prompt.match(/為 (\d+)、(\d+)/).slice(1).map(Number);assert(2*b<=a);assert.equal(q.answer,2*a+b);}
for(const q of bank.pool('linear-equation'))if(q.family.endsWith('v4')){const [a,b,d,rhs]=q.prompt.match(/\((\d+)x \+ (\d+)\)\/(\d+) − x = ([\d.−-]+)/).slice(1).map(x=>Number(x.replace('−','-')));assert(Math.abs((a*q.answer+b)/d-q.answer-rhs)<1e-8);assert.notEqual(a,d);}
for(const q of bank.pool('multiply'))if(q.family.endsWith('v4')){const [sum,prod]=q.prompt.match(/a\+b=(\d+)，ab=(\d+)/).slice(1).map(Number);assert(sum*sum>=4*prod,'real roots');}
for(const q of bank.pool('quadratic-inequality'))if(q.family.endsWith('v1')){const [a,b]=q.prompt.match(/x−\(([\d−-]+)\)\)\(x−\(([\d−-]+)\)/).slice(1).map(x=>Number(x.replace('−','-')));let count=0;for(let x=-30;x<=30;x++)if((x-a)*(x-b)<0)count++;assert.equal(count,q.answer);}
const inquiry=ev('Inquiry');assert.equal(inquiry.quadraticInterval({a:0,r1:2,r2:2}),'全體實數');assert.equal(inquiry.quadraticInterval({a:1,r1:2,r2:2}),'{2}');assert.equal(inquiry.quadraticInterval({a:-1,r1:2,r2:2}),'全體實數');assert.equal(inquiry.quadraticInterval({a:1,r1:3,r2:-2}),'[−2, 3]'.replace('−','-'));
assert.equal(inquiry.triangleValid({a:4,b:5,c:9}),false);assert.equal(inquiry.triangleValid({a:4,b:5,c:1}),false);assert.equal(inquiry.triangleValid({a:4,b:5,c:1.5}),true);
assert.equal(inquiry.snapshot('outlier',{v:40}).result,'平均數=12.4；中位數=6；極差=36');assert.equal(inquiry.tariffVerdict({fixed:30,rate:1.5,n:60}),'兩方案同價');
// Render every lab and all slider endpoint combinations without invalid SVG values.
for(const type of ev('Object.keys(labInfo)')){ev(`state.view='labs';state.lab=${JSON.stringify(type)};render();updateLab(state.lab);`);assert(s.app.innerHTML.includes('data-inquiry="'+type+'"'));assert(s.elements['lab-stage'].innerHTML.includes('<svg'));assert(s.elements['lab-result'].innerHTML.length>10);const controls=[...s.app.innerHTML.matchAll(/<input[^>]*type="range"[^>]*>/g)].map(m=>{const a=Object.fromEntries([...m[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));return {key:a['data-param'],values:[+a.min,+a.max,+a.value]};});const initial=JSON.parse(ev(`JSON.stringify(state.params['${type}'])`));for(const slider of controls)for(const value of slider.values){ev(`state.params['${type}']['${slider.key}']=${value};updateLab('${type}');`);assert(!/NaN|Infinity|undefined/.test(s.elements['lab-stage'].innerHTML),type+' bad SVG');ev(`state.params['${type}']=JSON.parse(${JSON.stringify(JSON.stringify(initial))});`);}assert.equal(inquiry.units[type].rubric.length,3);assert(inquiry.exportText(type).includes('成功準則'));}
for(const view of ['courses','practice','sources']){ev(`state.view='${view}';state.lesson=null;render()`);assert(!s.app.innerHTML.includes('undefined'));}
// UI event flow: start, answer, typed draft retention, saved history, new session.
function click(site,dataset,panel){const button={dataset,disabled:false,closest(sel){return sel==='[data-practice-scope]'||sel==='[data-inquiry]'?panel:null;}};for(const fn of site.listeners.click)fn({target:{closest(sel){return sel==='button'?button:null;}}});}
function input(site,el){el.matches??=()=>false;for(const fn of site.listeners.input)fn({target:el});}
const practicePanel={dataset:{practiceScope:'rational'}};ev("openLesson('rational')");click(s,{practiceAction:'start'},practicePanel);assert(s.app.innerHTML.includes('random-q-0'));const history=JSON.parse(s.storage.get('math-studio-practice-v2'));assert.equal(Object.keys(history).length,10);const beforeKeys=Object.keys(history);
// Exercise real delegated handlers against rendered numeric, choice and written questions.
const articles=[...s.app.innerHTML.matchAll(/<article class="random-question" id="random-q-(\d+)">([\s\S]*?)<\/article>/g)];
for(const article of articles){const i=Number(article[1]),html=article[2],q=bank.pool('rational').find(q=>html.includes(ev('escapeHTML('+JSON.stringify(q.prompt)+')')));assert(q,'rendered prompt maps to bank');
 if(q.type==='numeric'){input(s,{dataset:{answerDraft:String(i)},value:q.answerText,closest(){return practicePanel;}});for(const fn of s.listeners.submit)fn({target:{dataset:{numericQuestion:String(i)},closest(){return practicePanel;}},preventDefault(){}});assert(s.app.innerHTML.includes('id="feedback-'+i+'"'));}
 if(q.type==='choice'){const escaped=ev('escapeHTML('+JSON.stringify(q.options[q.answer])+')');const choice=[...html.matchAll(/data-choice="(\d+)"[^>]*>([\s\S]*?)<\/button>/g)].find(m=>m[2].includes('<span>'+escaped+'</span>'));assert(choice);click(s,{practiceChoice:String(i),choice:choice[1]},practicePanel);assert(s.app.innerHTML.includes('id="feedback-'+i+'"'));}
 if(q.type==='written'){click(s,{practiceWritten:String(i)},practicePanel);assert(s.elements['answer-error-'+i].textContent.includes('先寫下'));input(s,{dataset:{answerDraft:String(i)},value:'最小值為8，P在線段上時等號成立；區間外更大。',closest(){return practicePanel;}});click(s,{practiceWritten:String(i)},practicePanel);assert(s.app.innerHTML.includes('由你、同伴或教師評量'));assert(!s.app.innerHTML.includes('全部答對'));}
}
const writtenCount=articles.filter(a=>a[2].includes('data-practice-written')).length;assert(s.app.innerHTML.includes('客觀題：答對 '+(articles.length-writtenCount)+' / 已答 '+(articles.length-writtenCount)+' 題'));assert(s.app.innerHTML.includes('書面題已展開評量 '+writtenCount+' 題'));
// Switching practice grades must keep home navigation within that grade's valid term.
for(const fn of s.listeners.change)fn({target:{dataset:{},value:'g10',closest(){return practicePanel;},matches(selector){return selector==='[data-practice-grade]';}}});assert.equal(ev('state.term'),'核心課題');

ev("openLesson('rational')");click(s,{practiceAction:'start'},practicePanel);assert.equal(Object.keys(JSON.parse(s.storage.get('math-studio-practice-v2'))).length,20);
// Freshly loaded app still prioritises unseen questions.
const second=loadSite(s.storage);second.evaluate("openLesson('rational')");click(second,{practiceAction:'start'},practicePanel);assert.equal(Object.keys(JSON.parse(s.storage.get('math-studio-practice-v2'))).length,30);
// Capture requires a prediction, stores derived evidence, blocks duplicates and survives reload.
const evidenceNode={innerHTML:''},inquiryPanel={dataset:{inquiry:'triangle'},querySelector(){return evidenceNode;}};ev("state.view='labs';state.lab='triangle';render()");click(s,{inquiryAction:'capture'},inquiryPanel);assert(s.elements['inquiry-message'].textContent.includes('先寫下'));
input(s,{dataset:{inquiryField:'prediction',inquiryType:'triangle'},value:'我預測等號時不能圍成。'});click(s,{inquiryAction:'capture'},inquiryPanel);assert(evidenceNode.innerHTML.includes('實驗 1'));click(s,{inquiryAction:'capture'},inquiryPanel);assert(s.elements['inquiry-message'].textContent.includes('已記錄'));const third=loadSite(s.storage);third.evaluate("state.view='labs';state.lab='triangle';render()");assert(third.app.innerHTML.includes('我預測等號時不能圍成。'));assert(third.app.innerHTML.includes('實驗 1'));
// Restricted / malformed localStorage must not break the site.
const blocked=loadSite(new Map(),true);blocked.evaluate("openLesson('rational')");click(blocked,{practiceAction:'start'},practicePanel);assert(blocked.app.innerHTML.includes('未能保存'));const corrupt=loadSite(new Map([['math-studio-practice-v2','{bad'],['math-studio-inquiry-v2','[]']]));assert(corrupt.app.innerHTML.includes('數學研習室'));
console.log(JSON.stringify({status:'passed',questionsChecked:checked,...bank.stats(),labs:12,checks:'All pools and scopes, domains, numeric parser, choice remapping, exhaustion, rendering, input history and inquiry persistence'},null,2));

const publicRoot=path.join(root,'public','math-studio');
const html=fs.readFileSync(path.join(publicRoot,'index.html'),'utf8');
for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 const url=m[1];if(url.startsWith('#')||/^(?:https?:|data:)/.test(url))continue;
 assert(!url.startsWith('/'),'assets must work under /math-studio/');
 assert(fs.existsSync(path.join(publicRoot,url.split('?')[0])),url);
}
assert(!/chatgpt\.site|\/signin-with-chatgpt/.test(html));
assert(html.includes('https://skckenneth.github.io/math-studio/'));
for(const page of ['src/pages/teaching/index.astro','src/pages/zh/teaching/index.astro'])assert(fs.readFileSync(path.join(root,page),'utf8').includes('/math-studio/'));
console.log('GitHub Pages relative assets, canonical URL and bilingual teaching links passed.');

// New support handlers keep comparison work separate from scored practice and escape drafts.
const support=loadSite();support.evaluate("openLesson('operations')");
const cp='lesson-operations';click(support,{compareToggle:cp});
assert(support.app.innerHTML.includes('先預測：兩個數值答案會相同嗎？'));
assert(!support.app.innerHTML.includes('id="left-'+cp+'"'));
const prediction={dataset:{compareInput:'prediction',compareRecord:cp},value:'different',closest(){return null;},matches(){return false;}};
for(const fn of support.listeners.change)fn({target:prediction});
input(support,{dataset:{compareInput:'left',compareRecord:cp},value:'-4',closest(){return null;}});
input(support,{dataset:{compareInput:'right',compareRecord:cp},value:'1/0',closest(){return null;}});
const submitCompare=()=>{for(const fn of support.listeners.submit)fn({target:{dataset:{compareCheck:cp}},preventDefault(){}});};
submitCompare();assert(support.app.innerHTML.includes('兩欄輸入有效'));assert(!support.app.innerHTML.includes('與你的預測一致'));
input(support,{dataset:{compareInput:'right',compareRecord:cp},value:'4',closest(){return null;}});submitCompare();
assert(support.app.innerHTML.includes('與你的預測一致'));assert(support.app.innerHTML.includes('(−2)×(−2)=4'));
click(support,{compareNext:cp});assert(support.app.innerHTML.includes('−3²'));assert(support.app.innerHTML.includes('A：-4；B：4；已核對'));
const ep='operations:signed-add:completion';input(support,{dataset:{supportDraft:ep},value:'10',closest(){return null;}});
for(const fn of support.listeners.submit)fn({target:{dataset:{supportCheck:ep}},preventDefault(){}});
assert(support.app.innerHTML.includes('數值正確。'));
click(support,{compareToggle:cp});assert(support.app.innerHTML.includes('value="10"'));
input(support,{dataset:{supportDraft:ep},value:'<script>alert(1)</script>',closest(){return null;}});
click(support,{compareToggle:cp});assert(!support.app.innerHTML.includes('<script>alert(1)</script>'));assert(support.app.innerHTML.includes('&lt;script&gt;'));
assert(!support.app.innerHTML.includes('客觀題：答對'),'support alone must not start or score a practice session');
console.log('Support UI: prediction gate, invalid input, contrast history, completion, draft retention, escaping and independent scores passed.');
