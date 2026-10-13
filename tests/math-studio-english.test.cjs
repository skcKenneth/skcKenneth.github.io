const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ctx=vm.createContext({console,Map,WeakMap,Set,Math,Object,Array,JSON,document:{}});
for(const f of ['data.js','i18n.js','english-lessons.js'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../public/math-studio',f),'utf8'),ctx,{filename:f});
const evaluate=script=>vm.runInContext(script,ctx),I=evaluate('MathStudioI18n'),lessons=evaluate('lessons');
test('all 38 chapter teaching texts, examples, checks, scope and source have English counterparts',()=>{
 assert.equal(lessons.length,38);const missing=[];
 function visit(value,at){if(typeof value==='string'&&/[\u3400-\u9fff]/.test(I.english(value)))missing.push([at,value]);else if(value&&typeof value==='object')for(const [k,v] of Object.entries(value))if(!['id','grade','lab','num','answer'].includes(k))visit(v,at+'.'+k);}
 for(const lesson of lessons)visit(lesson,lesson.id);assert.deepEqual(missing,[]);
});
test('translation switches locally and preserves captured numeric/formula content',()=>{
 I.template('目前有 {0} 筆；公式 {1}。','There are {0} records; formula {1}.');I.setLanguage('en');assert.equal(I.translate('目前有 12 筆；公式 x²−4=0。'),'There are 12 records; formula x²−4=0.');I.setLanguage('zh-Hant');assert.equal(I.translate('目前有 12 筆；公式 x²−4=0。'),'目前有 12 筆；公式 x²−4=0。');
});
test('all 21 existing inquiries include English tasks, hints, criteria, teacher notes and live followups',()=>{
 const {loadSite}=require('./helpers/math-studio-runtime.cjs'),site=loadSite();
 for(const file of ['i18n.js','english-lessons.js','english-ui.js','english-inquiry.js','english-inquiry-ui.js','english-sources.js'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../public/math-studio',file),'utf8'),site.ctx,{filename:file});
 const service=site.evaluate('MathStudioI18n'),units=site.evaluate('G7InquiryContent'),core=site.evaluate('G7InquiryCore'),missing=[];
 function visit(value,at){if(typeof value==='string'&&/[\u3400-\u9fff]/.test(service.english(value)))missing.push(at+': '+value);else if(value&&typeof value==='object')for(const[k,v]of Object.entries(value))if(!['params','id','version','primaryLessonId','grades','cases'].includes(k))visit(v,at+'.'+k);}
 visit(units,'g7');service.setLanguage('en');
 for(const[id,u]of Object.entries(units))for(const[,params]of u.cases){const result=core.calculate(id,params);visit(result.rows,id+'.rows');visit(result.summary,id+'.summary');visit(core.snapshot(id,params),id+'.snapshot');for(const[title,answer]of u.followups){visit(title,id+'.question');visit(answer(result),id+'.answer');}}
 for(const id of ['linear','pythagoras','exponential','trig','sets','triangle','area','outlier','quadratic'])visit(site.evaluate(`Inquiry.units['${id}']`),id);
 assert.deepEqual(missing,[]);
 assert.equal(site.storage.has('math-studio-inquiry-g8-v1'),false);
});
test('English inquiry downloads translate authored labels while retaining student text exactly',async()=>{
 const {loadSite}=require('./helpers/math-studio-runtime.cjs'),storage=new Map([['math-studio-inquiry-g7-v1',JSON.stringify({number:{prediction:'學生原文：預測與理由',params:{h1:-5,h2:-1,h3:7,a:-1}}})],['math-studio-inquiry-v2',JSON.stringify({linear:{prediction:'另一份學生原文：主張與證據'}})]]),site=loadSite(storage);
 for(const file of ['i18n.js','english-lessons.js','english-ui.js','english-inquiry.js','english-inquiry-ui.js','english-sources.js'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../public/math-studio',file),'utf8'),site.ctx,{filename:file});
 site.evaluate("MathStudioI18n.setLanguage('en')");const g7=site.evaluate("Inquiry.exportText('number')"),generic=site.evaluate("Inquiry.exportText('linear')");
 assert(g7.includes('Prediction and reason'));assert(g7.includes('學生原文：預測與理由'));assert(generic.includes('Prediction and reason'));assert(generic.includes('另一份學生原文：主張與證據'));assert(g7.includes('Meeting-point position'));
});
test('inquiry controls, diagrams, authored scaffolds and sources have English text for every specified case',()=>{
 const {loadSite}=require('./helpers/math-studio-runtime.cjs'),site=loadSite();for(const file of ['i18n.js','english-lessons.js','english-ui.js','english-inquiry.js','english-inquiry-ui.js','english-sources.js'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../public/math-studio',file),'utf8'),site.ctx,{filename:file});
 site.evaluate("state.language='en';MathStudioI18n.setLanguage('en')");const service=site.evaluate('MathStudioI18n'),missing=new Set();
 function inspect(html){const clean=html.replace(/<textarea\b[^>]*>[\s\S]*?<\/textarea>/g,'');for(const chunk of clean.split(/<\/?[A-Za-z][^>]*>/)){const value=chunk.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'").trim();if(value&&value!=='繁體中文'&&/[\u3400-\u9fff]/.test(service.english(value)))missing.add(value);}}
 for(const[id,u]of Object.entries(site.evaluate('G7InquiryContent')))for(const[,params]of u.cases){site.ctx.auditParams=params;site.evaluate(`state.grade='g7';state.lab='${id}';state.params['${id}']=G7InquiryCore.normalize('${id}',auditParams);state.view='labs';render();updateLab('${id}')`);inspect(site.app.innerHTML);inspect(site.elements['lab-stage'].innerHTML);inspect(site.elements['lab-result'].innerHTML);}
 for(const id of ['linear','pythagoras','exponential','trig','sets','triangle','area','outlier','quadratic']){site.evaluate(`state.lab='${id}';state.view='labs';render();updateLab('${id}')`);inspect(site.app.innerHTML);inspect(site.elements['lab-stage'].innerHTML);inspect(site.elements['lab-result'].innerHTML);}
 inspect(site.evaluate('sourcesView()'));assert.deepEqual([...missing],[]);
});
