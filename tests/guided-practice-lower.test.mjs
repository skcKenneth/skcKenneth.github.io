import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {G7_LOWER_PACKS} from '../src/data/guided-practice/g7-lower.mjs';
import {G8_LOWER_PACKS} from '../src/data/guided-practice/g8-lower.mjs';
import {LOWER_NEW_PACK_IDS,LOWER_CHAPTERS,LOWER_CORE_VERSION} from '../src/data/lower-core-plan.mjs';
import {splitAuthoredMath,assertCanonicalDisplayMath} from '../src/lib/authored-math.mjs';
import {ALL_PRACTICE_PACKS,PRACTICE_PACKS,UPPER_PRACTICE_PACKS,LOWER_PRACTICE_PACKS,getPracticePack} from '../src/data/guided-practice/index.mjs';
import {solveMatrix,classifyMatrix,solveConstraints,integerBounds,radicalIdentity,evaluateRadical,radicalEqual,dataSummary,checkHistogram,exactTree,format,checkLowerNumerical,checkLowerDisplays,quadrilateralProperties,perpendicular,parallel,length2,close} from './helpers/guided-lower-math.mjs';
const packs=[...G7_LOWER_PACKS,...G8_LOWER_PACKS];
test('independent exact systems reject singular cases and substitute original equations',()=>{
 assert.deepEqual(solveMatrix([[1,1,7],[-2,1,1]]).map(format),['2','5']);
 assert.deepEqual(solveMatrix([[1,1,1,9],[2,3,5,33],[1,1,0,5]]).map(format),['2','3','4']);
 assert.throws(()=>solveMatrix([[1,1,2],[2,2,4]]),/not uniquely/);
 assert.equal(classifyMatrix([[1,1,2],[2,2,4]]),'infinite');assert.equal(classifyMatrix([[1,1,2],[2,2,5]]),'none');
});
test('all 400 lower questions are independently recomputed from their original givens',()=>{
 const errors=[];for(const p of packs)for(const q of p.questions){try{assert.equal(checkLowerNumerical(q),true);assert.equal(checkLowerDisplays(q),true);}catch(error){errors.push(q.id+': '+error.message);}}assert.deepEqual(errors,[]);assert.equal(packs.flatMap(p=>p.questions).length,400);
});
test('negative probes reject unknown rules, lost hypotheses, wrong arithmetic and changed displays',()=>{
 const question=suffix=>structuredClone(packs.flatMap(p=>p.questions).find(q=>q.id.endsWith(suffix))),reject=(q,pattern)=>assert.throws(()=>{checkLowerNumerical(q);checkLowerDisplays(q);},pattern);
 reject({audit:{kind:'unsupported-answer-only',expected:42}},/Unknown lower audit/);
 reject({audit:{kind:'root',operation:'invented'}},/Unknown root/);
 reject({audit:{kind:'geometry-fact',rule:'looks-correct',facts:{},valid:true}},/Unknown concrete/);
 let q=question(':alternate-retry');if(!q)q=structuredClone(packs.flatMap(p=>p.questions).find(q=>q.audit.kind==='angle-relation'&&q.audit.relation==='corresponding'));q.audit.parallelGiven=false;reject(q,/Parallel hypothesis/);
 q=question(':perpendicular-diagonals-criterion');delete q.audit.givens.parallelogram;reject(q,/hypotheses suffice/);
 q=question(':equal-diagonals-criterion');delete q.audit.givens.parallelogram;reject(q,/hypotheses suffice/);
 q=question(':square-other-diagonal');q.audit.givens.lengths.AC='5.656854249492381';reject(q,/Requested exact length/);
 q=question(':five-twelve');q.prompt.en='Two segments have lengths 5 and 12. Find a third side.';reject(q,/right-angle premise/);
 q=question(':triangle-right-up');q.audit.images["A'"][0]++;reject(q,/same displacement/);
 q=question(':negative-coefficient');q.answerExpression='x>-2';reject(q,/Displayed solution/);
 q=question(':dependent-equations');q.audit.parameter.y='7-t';reject(q,/Parametric solution/);
 q=question(':water-domain');q.audit.domain.max='21';reject(q,/Time when full/);
 q=question(':perpendicular-distance');q.numericAnswer=5;reject(q,/Numeric concrete result/);
 q=question(':population-model');if(!q)q=structuredClone(packs.flatMap(p=>p.questions).find(q=>q.audit.kind==='statistics'&&q.audit.statistic==='variance'));q.audit.denominator='n-1';reject(q,/denominator n/);
 q=question(':table-model');q.audit.pairs[0][0]=q.audit.pairs[1][0];q.audit.valid=true;reject(q,/one output/);
});
test('quadrilateral criteria require the complete declared premise, including inclusive classes',()=>{
 assert.equal(quadrilateralProperties({equalSegments:[['AC','BD']]}).rectangle,false);
 assert.equal(quadrilateralProperties({perpendicular:[['AC','BD']]}).rhombus,false);
 assert.equal(quadrilateralProperties({parallel:[['AB','CD']],equalSegments:[['AD','BC']]}).parallelogram,false);
 assert.equal(quadrilateralProperties({parallel:[['AB','CD']],equalSegments:[['AB','CD']]}).parallelogram,true);
 assert.equal(quadrilateralProperties({intersection:{O:['AC','BD']},equalSegments:[['AO','OC']]}).parallelogram,false);
 assert.equal(quadrilateralProperties({intersection:{O:['AC','BD']},equalSegments:[['AO','OC'],['BO','OD']]}).parallelogram,true);
 assert.equal(quadrilateralProperties({parallelogram:true,equalSegments:[['AC','BD']],perpendicular:[['AC','BD']]}).square,true);
 for(const key of ['parallelogram','rectangle','rhombus','square'])assert.equal(quadrilateralProperties({square:true})[key],true);
});
test('all 53 routes preserve the frozen original 28 packs and unique question identities',()=>{
 assert.equal(PRACTICE_PACKS.length,7);assert.equal(UPPER_PRACTICE_PACKS.length,21);assert.equal(LOWER_PRACTICE_PACKS.length,25);assert.equal(ALL_PRACTICE_PACKS.length,53);assert.equal(new Set(ALL_PRACTICE_PACKS.map(p=>p.id)).size,53);
 const questions=ALL_PRACTICE_PACKS.flatMap(p=>p.questions);assert.equal(questions.length,848);assert.equal(new Set(questions.map(q=>q.id)).size,848);
 // Captured from the production formula-release source at 42e269e0, before lower wiring.
 assert.equal(createHash('sha256').update(JSON.stringify([...PRACTICE_PACKS,...UPPER_PRACTICE_PACKS])).digest('hex'),'469b2e4ab6e2a985a86442b518a37023814b9b5f4d16175512f86147d598560f');
 for(const p of ALL_PRACTICE_PACKS)assert.equal(getPracticePack(p.id),p);assert.equal(getPracticePack('nonexistent-pack'),null);
});
test('histogram requested frequencies and densities stay blank in student question data',()=>{
 const id='g7-frequency-histograms:worked:histogram-model',q=packs.flatMap(p=>p.questions).find(q=>q.id===id),d=q.diagram;
 assert.equal(d.kind,'data-table');assert.ok(!Object.hasOwn(d,'bins'),'Do not reclassify requested frequency answers as supplied bin data');assert.equal(d.rows.length,3);assert.ok(d.rows.every(row=>row.length===3&&row.slice(1).every(value=>typeof value==='string'&&/^_+$/.test(value))),'Both requested columns are genuinely blank');
 assert.deepEqual(d.rows.map(row=>row[0]),['[0,2)','[2,4)','[4,6]']);
 // Recount the original observations and divide by each stated width for teacher-only rows.
 const bins=q.audit.bins,values=q.audit.values,teacher=bins.map(bin=>{const count=values.filter(v=>Number(v)>=Number(bin.lo)&&(Number(v)<Number(bin.hi)||bin.hiClosed&&Number(v)===Number(bin.hi))).length;return [`[${bin.lo},${bin.hi}${bin.hiClosed?']':')'}`,count,count/(Number(bin.hi)-Number(bin.lo))];});assert.deepEqual(d.solutionRows,teacher);assert.deepEqual(teacher,[['[0,2)',4,2],['[2,4)',6,3],['[4,6]',2,1]]);
 const frozen=packs.flatMap(p=>p.questions).map(q=>q.id===id?{...q,diagram:undefined}:q);assert.equal(createHash('sha256').update(JSON.stringify(frozen)).digest('hex'),'b8cc459b9a4d1246700849aef67505e50e5c59964ce175ba142f3a461b04c793','Every other question plus this question’s prompt, audit and answers remain unchanged');
});
test('lower mappings cover every supplied section and retain complete 40-minute routes and guided blanks',()=>{
 for(const chapter of LOWER_CHAPTERS){const chapterPacks=LOWER_PRACTICE_PACKS.filter(p=>chapter.packIds.includes(p.id)),covered=new Set(chapterPacks.flatMap(p=>p.source.textLessons));assert.deepEqual([...covered].sort((a,b)=>a-b),Array.from({length:chapter.lessons[1]-chapter.lessons[0]+1},(_,i)=>chapter.lessons[0]+i));}
 for(const p of LOWER_PRACTICE_PACKS){const c=LOWER_CHAPTERS.find(c=>c.packIds.includes(p.id));assert.equal(p.minutes,40);assert.deepEqual(p.ordinaryFlow.map(row=>row.slice(0,2)),[['prior',4],['inquiry',5],['model',8],['independent',15],['correction',5],['exit',3]]);assert.deepEqual(p.inquiryFlow.map(row=>row.slice(0,2)),[['inquiry',18],['model',4],['independent',13],['exit',5]]);
  assert.equal(p.source.sections.length,p.source.textLessons.length);assert.deepEqual(p.source.sections.map(s=>s.lesson),p.source.textLessons);const pages=[];for(const s of p.source.sections){assert.deepEqual(s.printedPages,[2*s.lesson-1,2*s.lesson]);assert.deepEqual(s.pdfPages,s.printedPages.map(n=>n+8));assert.ok(s.lesson>=c.lessons[0]&&s.lesson<=c.lessons[1]);pages.push(...s.printedPages);}assert.equal(p.source.printedPages[0],Math.min(...pages));assert.equal(p.source.printedPages.at(-1),Math.max(...pages));assert.equal(p.source.pdfPages[0],Math.min(...pages)+8);assert.equal(p.source.pdfPages.at(-1),Math.max(...pages)+8);
  assert.deepEqual(p.coreIds,p.questions.filter(q=>['prior','independent','exit'].includes(q.role)).map(q=>q.id));assert.equal(p.coreIds.length,8);assert.ok(p.advancedIds.every(id=>p.questions.some(q=>q.id===id)));
  const guided=p.questions.find(q=>q.role==='guided');assert.ok(guided.scaffold.length>=2,p.id);for(const locale of ['en','zh-Hant']){assert.ok(guided.scaffold.filter(row=>/\\square|_{2,}/.test(row[locale])).length>=2,p.id+'/'+locale+' concrete blanks');assert.ok(guided.hints.every(row=>!/^Separate the given information|^Write the relevant definition|^Check the result against every original/.test(row.en)),p.id+'/question-specific hints');}
 }
});
test('source diagram givens are geometrically true and construction solutions remain separate',()=>{
 for(const p of packs)for(const q of p.questions){const d=q.diagram;if(!d)continue;const points=Object.fromEntries((d.points||[]).map(v=>[v.id,[v.x,v.y]]));
  if(['geometry','coordinate'].includes(d.kind))for(const angle of d.rightAngles||[]){assert.ok(perpendicular(points,[angle[1],angle[0]],[angle[1],angle[2]]),q.id+'/true right marker');assert.ok(length2(points,[angle[1],angle[0]])>0&&length2(points,[angle[1],angle[2]])>0,q.id+'/nondegenerate marker');}
  if(q.audit.kind==='quadrilateral'){assert.ok(exactTree(points,q.audit.points),q.id+'/diagram uses audited points');for(const angle of d.rightAngles||[])assert.ok(q.audit.givens.rightAngles?.includes(angle.join(''))||q.audit.givens.rectangle||q.audit.givens.square,q.id+'/right angle must be given');}
  if(q.audit.kind==='translation'){assert.ok(d.solutionPoints?.length,q.id+'/separate solution vertices');assert.ok(!d.points.some(v=>q.audit.images[v.id]),q.id+'/student grid excludes image answers');for(const v of d.solutionPoints)assert.ok(exactTree([v.x,v.y],q.audit.images[v.id]),q.id+'/correct teacher image');}
  if(d.solutionIntervals){assert.deepEqual(d.intervals,[],q.id+'/no solution interval on student baseline');assert.ok(exactTree(d.solutionIntervals[0],q.audit.interval),q.id+'/correct interval solution');}
  if(d.solutionBins){assert.deepEqual(d.bins,[],q.id+'/blank student histogram');const normalized=rows=>rows.map(row=>({...row,hiClosed:!!row.hiClosed}));assert.ok(exactTree(normalized(d.solutionBins),normalized(q.audit.bins)),q.id+'/teacher bin data');}
  for(const line of [...(d.lines||[]),...(d.solutionLines||[])])if(line.domain){assert.ok(line.domain.length===2&&line.domain[0]<line.domain[1],q.id+'/finite graph range');}
 }
});
test('independent inequalities retain negative scaling, empty intersections and integer endpoints',()=>{
 assert.ok(exactTree(solveConstraints([{left:'3-2x',right:'7',operator:'>='}]),{lo:null,hi:'-2',loClosed:false,hiClosed:true}));
 assert.ok(solveConstraints([{left:'x',right:'2',operator:'>'},{left:'x',right:'2',operator:'<='}]).empty);
 assert.deepEqual(integerBounds({lo:'2',hi:'5',loClosed:false,hiClosed:false}),['3','4']);
 assert.throws(()=>solveConstraints([{left:'x^2',right:'4',operator:'<'}]),/not affine/);
});
test('independent radical ring proves exact identities and rejects invalid real-domain claims',()=>{
 for(const[a,b]of [['sqrt(12)+sqrt(27)','5*sqrt(3)'],['(sqrt(3)+sqrt(2))^2','5+2*sqrt(6)'],['sqrt(3/4)','sqrt(3)/2'],['3/sqrt(3)','sqrt(3)']])assert.ok(radicalIdentity(a,b));
 assert.equal(radicalIdentity('sqrt(9+16)','sqrt(9)+sqrt(16)'),false);
 assert.equal(radicalIdentity('sqrt((-2)^2)','-2'),false);
 assert.ok(radicalIdentity('sqrt(x^2)','abs(x)','x'));
 assert.throws(()=>evaluateRadical('sqrt(-1)'),/Negative/);assert.throws(()=>evaluateRadical('1/sqrt(0)'),/Zero original/);
 assert.ok(radicalEqual(evaluateRadical('\\sqrt{50}'),evaluateRadical('5*sqrt(2)')));
});
test('independent statistics and histograms distinguish variance conventions and bin boundaries',()=>{
 assert.equal(format(dataSummary([2,4,4,6]).variance),'2');assert.ok(exactTree(dataSummary([2,3,3,4,4]).modes,[3,4]));
 const h={values:[0,1,2,2,3,4,5,6],bins:[{lo:0,hi:2,frequency:2},{lo:2,hi:4,frequency:3},{lo:4,hi:6,frequency:3,hiClosed:true}],height:'density',heights:[1,'3/2','3/2']};assert.ok(exactTree(checkHistogram(h).frequencies,[2,3,3]));
 assert.throws(()=>checkHistogram({...h,heights:[2,3,3]}),/height\/frequency/);
});
test('closed lower-volume scope contains 25 bilingual fixed packs and exactly 400 questions',()=>{
 assert.equal(G7_LOWER_PACKS.length,13);assert.equal(G8_LOWER_PACKS.length,12);assert.deepEqual(packs.map(p=>p.id).sort(),[...LOWER_NEW_PACK_IDS].sort());assert.equal(new Set(packs.map(p=>p.id)).size,25);
 const roles={worked:1,guided:1,prior:2,independent:4,exit:2,supplement:4,extension:2};
 const walk=value=>{if(typeof value==='string'){for(const p of splitAuthoredMath(value))if(p.kind==='text')assert.ok(!/\^|\\[A-Za-z]+/.test(p.value),'Unmarked prose formula '+value);}else if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')Object.values(value).forEach(walk);};
 for(const p of packs){assert.equal(p.version,LOWER_CORE_VERSION);assert.equal(p.questions.length,16);const chapter=LOWER_CHAPTERS.find(c=>c.packIds.includes(p.id));assert.ok(chapter);assert.equal(p.grade,chapter.grade);assert.equal(p.volume,'lower');const covered=new Set();
  for(const[role,count]of Object.entries(roles))assert.equal(p.questions.filter(q=>q.role===role).length,count,p.id+'/'+role);
  assert.ok(p.questions.filter(q=>q.role==='independent'&&q.type==='proof').length<=1,p.id+'/at most one full independent proof');
  for(const q of p.questions){assert.ok(q.audit&&q.audit.kind);assert.equal(q.hints.length,3);assert.ok(q.steps.length>=1&&q.rubric.length>=1);for(const key of ['prompt','answer'])for(const locale of ['en','zh-Hant'])assert.ok(q[key]?.[locale]?.trim(),q.id+'/'+key+'/'+locale);for(const key of ['steps','hints','rubric','scaffold','options'])for(const row of q[key]||[])for(const locale of ['en','zh-Hant'])assert.ok(row[locale]?.trim(),q.id+'/'+key+'/'+locale);for(const n of q.sourceLessons){assert.ok(Number.isInteger(n)&&n>=chapter.lessons[0]&&n<=chapter.lessons[1]);covered.add(n);}for(const key of ['expression','answerExpression'])if(q[key])assertCanonicalDisplayMath(q[key]);for(const key of ['prompt','answer','steps','hints','rubric','scaffold','options'])walk(q[key]);}
  for(const n of p.source.textLessons)assert.ok(covered.has(n),p.id+'/source lesson '+n+' has a tagged question');
 }
});
