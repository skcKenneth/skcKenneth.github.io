import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';
import katex from 'katex';
import { CLASSROOM_PACKS, ALL_CLASSROOM_PACKS, getClassroomPack, classroomPackHref, classroomEngineHref, normalizeClassroomSettings, classroomSharePath, classroomSettingRows } from '../src/data/classroom-packs.mjs';
import { PRACTICE_PACKS } from '../src/data/guided-practice/index.mjs';
import { createMathCatalog } from '../src/lib/math-system-catalog.mjs';
import { TOPIC_IDS } from '../src/data/site-reader.mjs';
import { TEACHING_RESOURCES } from '../src/data/teaching-directory.mjs';
const root=resolve(import.meta.dirname,'..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const occurrences=(text,part)=>text.split(part).length-1;
const locales=['en','zh-Hant'];
async function bundle(path){const result=await build({entryPoints:[resolve(root,path)],bundle:true,write:false,format:'esm',platform:'node'});return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);}

test('two bilingual classroom packs have complete single-class sequences and valid paired routes',()=>{
  assert.deepEqual(CLASSROOM_PACKS.map(pack=>[pack.id,pack.minutes]),[['sampling-bias',45],['mixing-tank',50]]);
  for(const pack of CLASSROOM_PACKS){
    assert.equal(pack.stages.reduce((sum,item)=>sum+item.minutes,0),pack.minutes);
    assert.equal(new Set(pack.stages.map(item=>item.id)).size,pack.stages.length);
    assert.ok(pack.topicIds.length<=3&&pack.topicIds.every(id=>TOPIC_IDS.includes(id)));
    for(const locale of locales){
      for(const field of ['title','question','summary','audience','prerequisites','scope','exit','exitAnswer','records','provenance'])assert.ok(pack[field][locale]?.trim(),`${pack.id}/${locale}/${field}`);
      for(const item of pack.stages)for(const field of ['title','task','teacher'])assert.ok(item[field][locale]?.trim());
      assert.ok(pack.worksheet.length>=4&&pack.deliverables.length>=2&&pack.prepare.length>=2);
      assert.ok(pack.engine.launch.every(item=>item[locale]));
      assert.equal(classroomPackHref(pack.id,locale,true),`${classroomPackHref(pack.id,locale)}teacher/`);
    }
  }
  assert.equal(getClassroomPack('__proto__'),null);
  assert.throws(()=>classroomPackHref('unknown'),/Unknown classroom pack/);
  assert.equal(classroomEngineHref(CLASSROOM_PACKS[0],'zh-Hant'),'/math-studio/?lang=zh-Hant');
  assert.equal(classroomEngineHref(CLASSROOM_PACKS[0],'en'),'/math-studio/?lang=en');
  assert.equal(classroomEngineHref(CLASSROOM_PACKS[1],'zh-Hant'),'/zh/teaching/modeling-workshop/mixing-tank/');
});

test('presets and evidence boundaries agree with the actual inquiry and workshop definitions',async()=>{
  const context={};runInNewContext(`${read('public/math-studio/inquiry-g7-core.js')};globalThis.core=G7InquiryCore;`,context);
  const sampling=getClassroomPack('sampling-bias');
  for(const preset of sampling.presets){
    const raw={...preset.params,seed:sampling.seed.value};
    assert.deepEqual(JSON.parse(JSON.stringify(context.core.normalize('sampling',raw))),raw);
  }
  const fullGroup=context.core.calculate('sampling',{...sampling.presets.find(item=>item.id==='club-40').params,seed:2026});
  assert.equal(fullGroup.metrics.count,36);assert.equal(fullGroup.metrics.percent,90);assert.equal(fullGroup.metrics.populationPercent,50);
  assert.match(sampling.scope.en,/invented, not a real school survey/);
  assert.match(sampling.stages.find(item=>item.id==='repeat').teacher.en,/single draw need not improve/);
  assert.match(sampling.engine.language.en,/support Traditional Chinese and English/);
  const {lessons}=await bundle('src/data/workshop-lessons.ts');
  const lesson=lessons.find(item=>item.slug==='mixing-tank');
  assert.equal(lesson.id,'workshop-01');assert.equal(lesson.version,'1.0.0');
  const tank=getClassroomPack('mixing-tank');
  const defaults=Object.fromEntries(lesson.parameters.map(item=>[item.key,item.value]));
  assert.deepEqual(tank.presets[0].params,defaults);
  for(const preset of tank.presets)for(const [key,value]of Object.entries(preset.params)){
    const def=lesson.parameters.find(item=>item.key===key);assert.ok(def&&value>=def.min&&value<=def.max);
  }
  assert.match(tank.prerequisites.en,/50-minute introduction.*150-minute workshop, not its completion/);
  assert.match(tank.exitAnswer.en,/chosen equation’s implementation.*physical observation/);
  assert.match(tank.engine.runtime.en,/not a learner’s own run/);
  assert.match(tank.stages.find(item=>item.id==='compare').teacher.en,/some displayed baseline checks refer to prepared reference calculations/);
  for(const stage of tank.stages)for(const formula of stage.math)assert.match(katex.renderToString(formula,{throwOnError:true,output:'htmlAndMathml'}),/<math/);
  assert.match(sampling.engine.launch[0].en,/Choose Year 7.*first/);
  assert.match(sampling.engine.launch[1].en,/Open Interactive exploration/);
  assert.ok(existsSync(resolve(root,'public/resources/modeling-workshop/mixing-tank/baseline.csv')));
  assert.ok(existsSync(resolve(root,'public/resources/modeling-workshop/mixing-tank/reference.ipynb')));
});

test('seven paper-first packs join all bilingual classroom routes without changing legacy preset contracts',()=>{
  assert.equal(CLASSROOM_PACKS.length,2);assert.equal(PRACTICE_PACKS.length,7);assert.equal(ALL_CLASSROOM_PACKS.length,9);
  const catalog=createMathCatalog([],ALL_CLASSROOM_PACKS);
  for(const pack of PRACTICE_PACKS){
    assert.equal(getClassroomPack(pack.id),pack);
    const activity=catalog.find(item=>item.id===`classroom:${pack.id}`);
    assert.deepEqual(activity.grades,[pack.grade]);
    assert.deepEqual(activity.aliases,pack.aliases);
    for(const locale of locales){
      assert.equal(classroomPackHref(pack.id,locale,true),`${classroomPackHref(pack.id,locale)}teacher/`);
      assert.equal(activity.sources[locale],classroomPackHref(pack.id,locale));
      assert.match(classroomEngineHref(pack,locale),new RegExp(`^/math-studio/\\?lesson=${pack.nativeLesson}&lang=${locale}$`));
    }
    assert.throws(()=>normalizeClassroomSettings(pack.id,{preset:'school-20',seed:2026}),/Unknown classroom pack/,'fixed paper questions must not enter legacy preset/seed engine settings');
  }
});

test('share paths whitelist preset and bounded integer seed while excluding answers, names and teacher mode',()=>{
  for(const pack of CLASSROOM_PACKS)for(const locale of locales){
    const input={preset:pack.presets.at(-1).id,seed:pack.seed.max,answers:'secret answer',name:'Student name',code:'print(42)',teacher:true,mode:'teacher',hash:'student-record'};
    const url=new URL(classroomSharePath(pack.id,input,locale),'https://example.test');
    assert.deepEqual([...url.searchParams.keys()],['preset','seed']);
    assert.equal(url.pathname,classroomPackHref(pack.id,locale));assert.equal(url.hash,'');
    assert.equal(url.searchParams.get('preset'),input.preset);assert.equal(Number(url.searchParams.get('seed')),pack.seed.max);
    for(const secret of ['secret','Student','print','teacher','student-record'])assert.ok(!url.href.includes(secret));
    assert.deepEqual(normalizeClassroomSettings(pack.id,{preset:'../teacher',seed:-1}),{preset:pack.presets[0].id,seed:2026});
    for(const seed of ['NaN','1.5','1e3','Infinity','<script>',pack.seed.max+1])assert.equal(normalizeClassroomSettings(pack.id,{seed}).seed,2026);
    assert.equal(normalizeClassroomSettings(pack.id,{seed:pack.seed.min}).seed,pack.seed.min);
    const rows=classroomSettingRows(pack.id,input,locale);assert.equal(rows.at(-1).value,String(pack.seed.max));
  }
});

test('browser settings restore, share, switch language and print without touching learning storage',async()=>{
  const {initializeClassroomPage}=await bundle('src/scripts/classroom-packs.ts');
  const descriptors=Object.fromEntries(['window','document','location','history','navigator','localStorage','sessionStorage','indexedDB'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  let storageTouches=0,prints=0,copied='',pushes=[];const listeners={};
  const preset={value:''},seed={value:''};const status={textContent:''};const link={href:''};const language={href:'',dataset:{}};
  const urlField={value:'',focus(){},select(){}};
  const form={elements:{namedItem:name=>name==='preset'?preset:seed},reportValidity:()=>true,addEventListener:(name,handler)=>listeners[`form:${name}`]=handler};
  const copy={addEventListener:(_,handler)=>listeners.copy=handler};
  const values=new Map();for(const row of classroomSettingRows('sampling-bias'))values.set(row.key,{textContent:''});
  const settings={dataset:{classroomSettings:'sampling-bias'},querySelector:selector=>{
    const direct={'[data-classroom-settings-form]':form,'[data-classroom-share-link]':link,'[data-classroom-share-url]':urlField,'[data-classroom-share-status]':status,'[data-classroom-copy]':copy};
    return direct[selector]||values.get(selector.match(/data-classroom-value="([^"]+)"/)?.[1])||null;
  }};
  const print={addEventListener:(_,handler)=>listeners.print=handler};
  const projection={pressed:'false',focused:false,setAttribute(_key,value){this.pressed=value;},focus(){this.focused=true;},addEventListener:(_,handler)=>listeners.projection=handler};
  const projectionBar={hidden:true};
  const projectionExit={focused:false,focus(){this.focused=true;},addEventListener:(_,handler)=>listeners.exit=handler};
  const page={dataset:{classroomPack:'sampling-bias',locale:'zh-Hant'},addEventListener:(name,handler)=>listeners[`page:${name}`]=handler,querySelector:selector=>({'[data-classroom-settings]':settings,'[data-classroom-print]':print,'[data-classroom-projection-toggle]':projection,'[data-classroom-projection-bar]':projectionBar,'[data-classroom-projection-exit]':projectionExit}[selector]||null)};
  try{
    for(const key of ['localStorage','sessionStorage','indexedDB'])Object.defineProperty(globalThis,key,{configurable:true,get(){storageTouches++;throw new Error('Learning records must not be accessed');}});
    Object.defineProperty(globalThis,'window',{configurable:true,value:{print:()=>prints++,setTimeout,clearTimeout,addEventListener:(name,handler)=>listeners[name]=handler}});
    Object.defineProperty(globalThis,'document',{configurable:true,value:{querySelector:()=>language}});
    Object.defineProperty(globalThis,'location',{configurable:true,value:{origin:'https://example.test',search:'?preset=club-40&seed=2027&answers=private&teacher=1&name=private'}});
    Object.defineProperty(globalThis,'history',{configurable:true,value:{pushState:(_state,_title,path)=>pushes.push(path)}});
    Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async value=>copied=value}}});
    initializeClassroomPage(page);
    assert.equal(preset.value,'club-40');assert.equal(seed.value,'2027');assert.equal(values.get('method').textContent,'只訪問活動小組');
    assert.equal(language.href,'/teaching/classroom-packs/sampling-bias/?preset=club-40&seed=2027');
    assert.equal(language.dataset.classroomSettingsLanguageManaged,'true');
    await listeners.copy();assert.equal(copied,'https://example.test/zh/teaching/classroom-packs/sampling-bias/?preset=club-40&seed=2027');
    preset.value='school-40';seed.value='2028';listeners['form:submit']({preventDefault(){}});
    assert.deepEqual(pushes,['/zh/teaching/classroom-packs/sampling-bias/?preset=school-40&seed=2028']);
    globalThis.location.search='?preset=school-20&seed=2030';listeners.popstate();assert.equal(seed.value,'2030');assert.equal(preset.value,'school-20');
    listeners.projection();assert.equal(page.dataset.classroomProjection,'true');assert.equal(projection.pressed,'true');assert.equal(projectionBar.hidden,false);assert.equal(projectionExit.focused,true);
    listeners['page:keydown']({key:'Escape',preventDefault(){}});assert.equal(page.dataset.classroomProjection,'false');assert.equal(projection.pressed,'false');assert.equal(projectionBar.hidden,true);assert.equal(projection.focused,true);
    listeners.projection();listeners.exit();assert.equal(page.dataset.classroomProjection,'false');
    listeners.print();assert.equal(prints,1);assert.equal(storageTouches,0);
    assert.ok(!read('src/scripts/classroom-packs.ts').match(/localStorage|sessionStorage|indexedDB|ProgressStore|fetch\(/));
  }finally{for(const [key,descriptor]of Object.entries(descriptors))descriptor?Object.defineProperty(globalThis,key,descriptor):delete globalThis[key];}
});

test('a pending clipboard request reaches a bounded selectable-URL fallback and ignores late success',async()=>{
  const {copyClassroomLink}=await bundle('src/scripts/classroom-packs.ts');
  const descriptors=Object.fromEntries(['window','navigator'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  try{
    for(const zh of [false,true]){
      let timeout,delay,cleared=0,focused=0,selected=0,lateSuccess;
      const field={value:'https://example.test/teaching/classroom-packs/sampling-bias/?preset=school-20&seed=2026',focus:()=>focused++,select:()=>selected++};
      const status={textContent:''};
      Object.defineProperty(globalThis,'window',{configurable:true,value:{setTimeout:(callback,ms)=>{timeout=callback;delay=ms;return 17;},clearTimeout:id=>{assert.equal(id,17);cleared++;}}});
      Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:()=>new Promise(resolve=>lateSuccess=resolve)}}});
      const pending=copyClassroomLink(field,status,zh);
      assert.match(status.textContent,zh?/正在複製/:/Copying link/);
      assert.ok(delay>=1000&&delay<=2000);
      assert.equal(focused,0);assert.equal(selected,0);
      timeout();await pending;
      assert.equal(focused,1);assert.equal(selected,1);assert.equal(cleared,1);
      assert.match(status.textContent,zh?/請複製已選取的網址/:/Copy the selected URL/);
      const fallback=status.textContent;
      lateSuccess();await Promise.resolve();await Promise.resolve();
      assert.equal(status.textContent,fallback,'late clipboard completion must not replace manual-copy guidance');
      assert.equal(focused,1);assert.equal(cleared,1);
      Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:()=>Promise.reject(new Error('Denied'))}}});
      await copyClassroomLink(field,status,zh);
      assert.equal(focused,2);assert.equal(selected,2);assert.equal(cleared,2,'rejection clears timeout immediately');
    }
  }finally{for(const [key,descriptor]of Object.entries(descriptors))descriptor?Object.defineProperty(globalThis,key,descriptor):delete globalThis[key];}
});

test('classroom directory remains compact and uses the original engines once per resource directory',()=>{
  const component=read('src/components/TeachingDirectory.astro');
  assert.equal(occurrences(component,'<ClassroomPackCards '),1);
  assert.ok(!TEACHING_RESOURCES.some(item=>CLASSROOM_PACKS.some(pack=>item.id===pack.id)),'packs belong to their own compact section, not duplicated engine cards');
  for(const id of ['math-studio','modeling-workshop'])assert.equal(TEACHING_RESOURCES.filter(item=>item.id===id).length,1);
  const page=read('src/components/ClassroomPackPage.astro');
  assert.match(page,/<details class="classroom-preset-list">/);assert.match(page,/<section class="classroom-worksheet"/);assert.match(page,/<noscript>/);
  assert.match(read('src/styles/classroom-packs.css'),/@media print/);
  assert.match(read('src/styles/classroom-packs.css'),/@page\{size:A4 portrait/);
  assert.match(page,/classroom-print-source/);
});

if(process.argv.includes('--built')){
  test('ten built classroom routes have bilingual metadata, native tasks and separate teacher reasoning',()=>{
    for(const locale of locales){
      const base=locale==='zh-Hant'?'/zh':'';
      const overview=read(`dist${base}/teaching/index.html`);
      const index=read(`dist${base}/teaching/classroom-packs/index.html`);
      assert.equal(occurrences(index,'data-classroom-card='),ALL_CLASSROOM_PACKS.length);
      for(const pack of CLASSROOM_PACKS){
        const student=read(`dist${classroomPackHref(pack.id,locale)}index.html`);
        const teacher=read(`dist${classroomPackHref(pack.id,locale,true)}index.html`);
        assert.equal(occurrences(overview,`data-classroom-card="${pack.id}"`),1);
        assert.ok(overview.includes(`href="${classroomPackHref(pack.id,locale)}"`),'teacher reference within two clicks from Teaching');
        assert.ok(student.includes(`href="${classroomPackHref(pack.id,locale,true)}"`));
        assert.equal(occurrences(student,`data-classroom-pack="${pack.id}"`),1);
        assert.equal(occurrences(teacher,`data-classroom-teacher="${pack.id}"`),1);
        for(const html of [student,teacher]){
          assert.equal((html.match(/<h1\b/g)||[]).length,1);
          assert.equal(occurrences(html,`aria-label="${locale==='en'?'Breadcrumb':'所在位置'}"`),1);
          assert.equal(occurrences(html,'data-classroom-stage='),pack.stages.length);
          assert.ok(html.includes(pack.engine.language[locale]));
          assert.ok(html.includes(`href="${classroomEngineHref(pack,locale)}"`));
          for(const item of pack.stages)assert.ok(html.includes(item.task[locale]));
        }
        assert.ok(student.includes('class="classroom-worksheet"'));
        assert.ok(student.includes('class="classroom-preset-list"'));
        assert.ok(student.includes('<noscript>'));
        assert.ok(!student.includes(pack.exitAnswer[locale]),'reference answer is not repeated on the student page');
        assert.ok(teacher.includes(pack.exitAnswer[locale]));
        if(pack.id==='mixing-tank'){assert.ok(student.includes('<math'));assert.ok(teacher.includes('<math'));}
        assert.ok(student.includes('data-classroom-projection-toggle'));
        assert.ok(student.includes(`https://skckenneth.github.io${classroomPackHref(pack.id,locale)}`));
        assert.ok(!teacher.includes('data-classroom-share-link'),'teacher page does not offer a teacher-mode share URL');
        const alternate=classroomPackHref(pack.id,locale==='en'?'zh-Hant':'en');
        assert.ok(student.includes(`href="https://skckenneth.github.io${alternate}"`));
        for(const item of pack.background)assert.ok(existsSync(resolve(root,`dist${base}${item.path}index.html`)));
      }
    }
  });
}
