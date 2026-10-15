import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as registry from '../src/data/guided-practice/index.mjs';
import {UPPER_CHAPTERS,UPPER_NEW_PACK_IDS,UPPER_CORE_VERSION} from '../src/data/upper-core-plan.mjs';
import {rational,add,subtract,multiply,divide,equal,number,format,power,evaluateMath,expressionIdentity,proportionalExpressions,factorLeaves,integerFactorIsIrreducible,polynomialCoefficients,monomialDomainVariables,variablesIn,originalDomain,solveEquation,squaredDistance,near,checkCongruence} from './helpers/guided-upper-math.mjs';

const packs=registry.UPPER_PRACTICE_PACKS||[];
const all=[...registry.PRACTICE_PACKS,...packs];
const roles={worked:1,guided:1,prior:2,independent:4,exit:2,supplement:4,extension:2};
const locales=['en','zh-Hant'];
const lessonRanges={
 'g7-rational-number-line':[1,7],'g7-rational-operations':[8,20],'g7-expressions-values':[21,22],'g7-polynomial-add-subtract':[23,27],
 'g7-equations-meaning':[28,29],'g7-equations-brackets-fractions':[32,33],'g7-equations-applications':[34,39],'g7-geometry-segments':[40,45],'g7-geometry-angles':[46,50],
 'g8-triangles-sides':[1,2],'g8-triangles-angles':[3,6],'g8-congruence-sss-sas':[7,9],'g8-congruence-angle-hl':[10,12],'g8-reflection-coordinates':[18,19],'g8-isosceles-equilateral':[20,25],
 'g8-powers-multiplication':[26,31],'g8-products-division':[32,36],'g8-factorisation':[37,39],'g8-rational-expressions':[40,41],'g8-rational-operations':[42,48],'g8-rational-equations':[49,52],
};
const hiddenGeometryIds=[
 ...['prior:perimeter','independent:isosceles-perimeter','independent:median-half','supplement:decimal-perimeter','supplement:median-even'].map(suffix=>'g8-triangles-sides:'+suffix),
 ...['worked:triangle-model','guided:pentagon-model','prior:straight-angle','prior:right-complement','independent:third-angle','independent:remote-angles','independent:hexagon-sum','independent:regular-exterior','exit:adjacent-exterior','exit:exterior-sum','supplement:angle-equation','supplement:remote-unknown','supplement:octagon-sum','supplement:regular-interior','extension:sum-to-sides'].map(suffix=>'g8-triangles-angles:'+suffix),
 ...['worked:base-angle-model','prior:triangle-angle-check','prior:equilateral-angle','independent:base-angle-52','independent:thirty-leg','exit:equilateral-side','exit:thirty-hypotenuse','supplement:base-angle-84','supplement:equilateral-perimeter','supplement:thirty-decimal','supplement:isosceles-combined'].map(suffix=>'g8-isosceles-equilateral:'+suffix),
];
const numeric=(q,expected,label=q.id)=>{if(q.numericAnswer!==undefined)assert.ok(near(q.numericAnswer,number(expected)),label+'/numeric answer');};
const exact=(actual,expected,label)=>assert.ok(equal(actual,expected),`${label}: ${format(actual)} != ${format(expected)}`);
const rootSet=values=>[...new Set(values.map(format))].sort();
const sameRoots=(actual,expected,label)=>assert.deepEqual(rootSet(actual),rootSet(expected),label);
const bilingual=(value,label)=>{for(const locale of locales)assert.ok(typeof value?.[locale]==='string'&&value[locale].trim(),label+'/'+locale);assert.ok(!/[\u3400-\u9fff]/u.test(value.en),label+'/English contains Han');};
const vector=(a,b)=>a.map((value,i)=>value-b[i]);
const dot=(a,b)=>a.reduce((sum,value,i)=>sum+value*b[i],0);
const length=(a,b)=>Math.sqrt(squaredDistance(a,b));
const reflect=(p,line)=>{const v=vector(p,line.through),u=line.direction,scale=dot(v,u)/dot(u,u);assert.ok(dot(u,u)>0);return p.map((value,i)=>line.through[i]+2*scale*u[i]-v[i]);};
const closePoint=(a,b)=>a.length===b.length&&a.every((value,i)=>near(value,b[i]));

test('upper QA kernel independently handles exact signs, powers, multivariate identities and original domains',()=>{
  for(const[expression,expected]of [['-3^2','-9'],['(-3)^2','9'],['2^3^2','512'],['-2^-2','-1/4'],['\\frac{1}{3}+\\frac{1}{6}','1/2'],['0.1+0.2','3/10']])exact(evaluateMath(expression),expected,expression);
  assert.ok(expressionIdentity('(2x-3y)(2x+3y)','4x^2-9y^2'));
  assert.ok(!expressionIdentity('(x+y)^2','x^2+y^2'));
  assert.ok(integerFactorIsIrreducible('x^2+1'));assert.equal(integerFactorIsIrreducible('x^2-9'),false);assert.equal(integerFactorIsIrreducible('2x+2'),false);assert.deepEqual(factorLeaves('3x(x-2)^2'),['3','x','(x-2)','(x-2)']);
  assert.throws(()=>evaluateMath('0^0'),/domain/);sameRoots(originalDomain(['x^0']),['0'],'zero exponent retains nonzero base');
  assert.ok(expressionIdentity('(x^2-1)/(x-1)','x+1'));
  sameRoots(originalDomain(['(x^2-1)/(x-1)']),['1'],'cancellation retains original excluded point');
  sameRoots(originalDomain(['((x^2-4)/(x+1))/((x-2)/(x+1))']),['-1','2'],'division retains denominator and divisor-zero restrictions');
  assert.throws(()=>evaluateMath('(x^2-1)/(x-1)',{x:1}),/domain/);
  const equation=solveEquation('1/12+1/x','1/4');sameRoots(equation.solutions,['6'],'work rate');sameRoots(equation.excluded,['0'],'original time denominator');
  assert.equal(solveEquation('x+1','x+2').classification,'none');
  assert.equal(solveEquation('2(x+1)','2x+2').classification,'all');
  assert.equal(solveEquation('(x^2-1)/(x-1)','2').classification,'none','cleared candidate x=1 is extraneous');
});

test('upper QA kernel distinguishes sufficient congruence givens from circular or ambiguous claims',()=>{
  const valid={points:{A:[0,0],B:[4,0],C:[0,3],D:[10,0],E:[14,0],F:[10,3]},triangles:[['A','B','C'],['D','E','F']],correspondence:['D','E','F'],criterion:'SAS',givens:{equalSides:[['AB','DE'],['AC','DF']],equalAngles:[['BAC','EDF']]}};
  assert.equal(checkCongruence(valid).sufficient,true);
  assert.equal(checkCongruence({...valid,givens:{equalSides:[['AB','DE'],['AC','DF']],equalAngles:[['ABC','DEF']]}}).sufficient,false,'equal angle must be included for SAS');
  assert.equal(checkCongruence({...valid,criterion:'AAA',givens:{equalAngles:[['BAC','EDF'],['ABC','DEF'],['ACB','DFE']]}}).sufficient,false,'three angles do not determine size');
  const ssa={points:{A:[0,0],B:[1.2,1.6],C:[5,0],D:[10,0],E:[12.4,3.2],F:[15,0]},triangles:valid.triangles,correspondence:valid.correspondence,criterion:'SSA',givens:{equalSides:[['AC','DF'],['BC','EF']],equalAngles:[['BAC','EDF']]}};
  const checked=checkCongruence(ssa);assert.equal(checked.sufficient,false);assert.equal(checked.coordinatesCongruent,false,'actual two distinct SSA triangles');
  assert.throws(()=>checkCongruence({...valid,givens:{equalSides:[['AB','DF']]}}),/correspondence/);
});

test('the original seven-pilot acceptance remains byte-for-byte unchanged',()=>{
  const sha=createHash('sha256').update(readFileSync(new URL('./guided-practice.test.mjs',import.meta.url))).digest('hex');
  assert.equal(sha,'ea7dadd4c9593b13682167b7158c0c0b4d17a9ef4e310f955f3b495835bacebb');
  assert.equal(registry.PRACTICE_PACKS.length,7);
});

test('closed approved inventory contains all 21 new packs, alongside the original seven',()=>{
  assert.equal(packs.length,21);assert.equal(all.length,28);assert.equal(packs.filter(p=>p.grade==='g7').length,9);assert.equal(packs.filter(p=>p.grade==='g8').length,12);
  assert.deepEqual(packs.map(p=>p.id).sort(),[...UPPER_NEW_PACK_IDS].sort(),'closed approved chapter-core pack inventory');
  assert.equal(packs.flatMap(p=>p.questions).length,336);assert.equal(new Set(all.map(p=>p.id)).size,28);assert.ok(!packs.some(p=>registry.PRACTICE_PACKS.some(old=>old.id===p.id)));
});
test('authored upper chapter-core packs preserve fixed bilingual 16-question paper contracts',()=>{
  assert.ok(packs.length>0);
  const ids=[];
  for(const pack of packs){
    assert.equal(registry.getPracticePack(pack.id),pack);assert.equal(pack.minutes,40);assert.equal(pack.questions.length,16);bilingual(pack.title,pack.id);
    assert.equal(pack.version,UPPER_CORE_VERSION);const chapter=UPPER_CHAPTERS.find(chapter=>chapter.packIds.includes(pack.id));assert.ok(chapter);assert.equal(pack.grade,chapter.grade);bilingual(pack.sourceNavigation,pack.id+'/textbook navigation');
    assert.deepEqual(Object.fromEntries(Object.keys(roles).map(role=>[role,pack.questions.filter(q=>q.role===role).length])),roles,pack.id);
    assert.ok(pack.source?.fileName?.endsWith('.pdf'));assert.ok(pack.source.chapter&&pack.source.section);
    for(const field of ['printedPages','pdfPages','foundationPages'])assert.ok(pack.source[field]?.length&&pack.source[field].every(value=>Number.isInteger(value)&&value>0),pack.id+'/'+field);
    assert.equal(pack.source.printedPages.length,pack.source.pdfPages.length);
    assert.ok(pack.source.foundationLessons?.length&&new Set(pack.source.foundationLessons).size===pack.source.foundationLessons.length);assert.ok(pack.source.foundationLessons.every(lesson=>Number.isInteger(lesson)&&lesson>=chapter.lessons[0]&&lesson<=chapter.lessons[1]),pack.id+'/verified chapter lesson range');
    const [first,last]=lessonRanges[pack.id];assert.deepEqual(pack.source.foundationLessons,Array.from({length:last-first+1},(_,i)=>first+i),pack.id+'/approved textbook selection');assert.ok(pack.source.printedPages.every((page,i)=>pack.source.pdfPages[i]===page+3),pack.id+'/verified source PDF page offset');
    for(const flow of [pack.ordinaryFlow,pack.inquiryFlow])assert.equal(flow.reduce((sum,step)=>sum+step[1],0),40);
    assert.equal(pack.coreIds.length,8);
    if(['geometry','triangles','congruence','symmetry'].includes(pack.nativeLesson))assert.ok(pack.questions.filter(q=>q.role==='independent'&&q.type==='proof').length<=1,pack.id+'/ordinary four-question independent set has at most one complete proof');
    for(const q of pack.questions){ids.push(q.id);assert.ok(q.id.startsWith(pack.id+':'));for(const field of ['prompt','answer'])bilingual(q[field],q.id+'/'+field);assert.equal(q.hints.length,3,q.id);q.hints.forEach((hint,i)=>bilingual(hint,q.id+'/hint'+i));assert.ok(q.steps.length>=2,q.id);q.steps.forEach((step,i)=>bilingual(step,q.id+'/step'+i));assert.ok(q.rubric.length);q.rubric.forEach((row,i)=>bilingual(row,q.id+'/rubric'+i));for(const row of q.options||[])bilingual(row,q.id+'/option');assert.ok(q.sourceLessons?.length&&q.sourceLessons.every(value=>pack.source.foundationLessons.includes(value)),q.id+'/actual source lesson tags within declared textbook selection');assert.ok(q.audit?.kind,q.id);}
    if(pack.questions.some(q=>q.options))for(const q of pack.questions.filter(q=>q.options)){assert.ok(Number.isInteger(q.correctChoice)&&q.correctChoice>=0&&q.correctChoice<q.options.length);assert.deepEqual(q.options[q.correctChoice],q.answer,q.id+'/fixed rotated correct option matches authored answer');}
  }
  assert.equal(new Set(ids).size,packs.length*16);
});

test('requested models and literal outputs are not preprinted as student givens',()=>{
 const questions=packs.flatMap(pack=>pack.questions);
 for(const q of questions.filter(q=>q.audit.kind==='word-model'||q.audit.context))assert.equal(q.expression,undefined,q.id+'/learners construct the requested model before revealing it');
 for(const id of ['g8-rational-equations:prior:daily-rate','g8-triangles-angles:exit:exterior-sum','g7-rational-number-line:prior:signed-loss','g7-rational-number-line:independent:compare-negatives','g7-rational-number-line:supplement:compare-fractions']){const q=questions.find(q=>q.id===id);assert.ok(q);assert.equal(q.expression,undefined,id+'/the requested output or ordering decision must stay hidden');}
 const geometryCalculations=packs.filter(pack=>pack.grade==='g8').flatMap(pack=>pack.questions).filter(q=>q.numericAnswer!==undefined&&['triangle-sides','triangle-angles','polygon','special-triangle','concept'].includes(q.audit.kind));assert.deepEqual(geometryCalculations.map(q=>q.id).sort(),[...hiddenGeometryIds].sort(),'Closed 31-item inventory: five side/median, fifteen triangle/polygon angle and eleven special-triangle outputs');for(const q of geometryCalculations){assert.equal(q.expression,undefined,q.id+'/the learner retrieves the geometry relation from the complete prose givens');if(q.id!=='g8-triangles-angles:exit:exterior-sum')assert.ok(q.answerExpression,q.id+'/derived calculation is retained only in the hidden reference');else{exact(q.numericAnswer,360,q.id+'/literal output remains a teacher reference');assert.ok(q.answer.en.includes('360')&&q.answer['zh-Hant'].includes('360'));}}
 const scientific=questions.find(q=>q.id==='g8-rational-operations:extension:scientific-product');assert.ok(scientific?.expression?.includes('0.0003')&&scientific.expression.includes('0.0002'),'The scientific-product task displays its actual input factors, not the already-computed product');exact(evaluateMath(scientific.expression),scientific.audit.value,scientific.id+'/input product independently checked');
});

function checkAlgebra(q){
 const a=q.audit;
 if(a.kind==='arithmetic'){const result=evaluateMath(a.expression);exact(result,a.expected,q.id);numeric(q,result);if(q.expression)assert.ok(expressionIdentity(q.expression,a.expression),q.id+'/actual displayed arithmetic');if(q.answerExpression)exact(evaluateMath(q.answerExpression),result,q.id+'/hidden arithmetic reference expression');return true;}
 if(a.kind==='scientific-notation'){const mantissa=rational(a.mantissa);assert.ok(Math.abs(number(mantissa))>=1&&Math.abs(number(mantissa))<10,q.id+'/normalised mantissa');assert.ok(Number.isInteger(a.exponent));exact(multiply(mantissa,power(10,a.exponent)),a.value,q.id+'/scientific equality');if(q.expression)exact(evaluateMath(q.expression),a.value,q.id+'/actual scientific input');if(q.answerExpression)exact(evaluateMath(q.answerExpression),a.value,q.id+'/rendered scientific reference');numeric(q,a.value);return true;}
 if(a.kind==='polynomial'||a.kind==='factorization'){
  assert.deepEqual(monomialDomainVariables(a.original),[...(a.nonzeroVariables||[])].sort(),q.id+'/original monomial divisor or zero-power base remains nonzero');if(!a.nonzeroVariables)polynomialCoefficients(a.original);polynomialCoefficients(a.result);assert.ok(expressionIdentity(a.original,a.result),q.id+'/exact coefficient identity');assert.ok(new Set(a.variables).size===a.variables.length&&[...new Set([...variablesIn(a.original),...variablesIn(a.result)])].every(variable=>a.variables.includes(variable)),q.id+'/every used variable belongs to the declared polynomial ring');
  if(a.kind==='factorization'){assert.ok(['common-factor','difference-of-squares','perfect-square'].includes(a.method),q.id+'/supported factor method');for(const expression of [a.result,...(q.answerExpression?[q.answerExpression]:[])])for(const factor of factorLeaves(expression))assert.ok(integerFactorIsIrreducible(factor),q.id+'/complete primitive irreducible integer factor '+factor);}
  if(a.values){const result=evaluateMath(a.original,a.values);exact(result,a.expected,q.id+'/substitution');numeric(q,result);}
  if(a.context){const c=a.context;let expected;if(c.kind==='unit-cost')expected=`(${c.unitPrice})${c.variable}+(${c.fixed})`;else if(c.kind==='rectangle-perimeter')expected=`2(${c.length})+2(${c.width})`;else assert.fail(q.id+'/unsupported polynomial context '+c.kind);assert.ok(expressionIdentity(a.original,expected),q.id+'/context independently builds original expression');}
  if(a.counterexample){assert.ok(!equal(evaluateMath(a.original,a.counterexample.values),evaluateMath(a.counterexample.wrongResult,a.counterexample.values)),q.id+'/concrete wrong-expansion counterexample');}
  if(q.expression)assert.ok(expressionIdentity(q.expression,a.original),q.id+'/actual displayed polynomial');if(q.answerExpression)assert.ok(expressionIdentity(q.answerExpression,a.values?a.expected:a.result),q.id+'/rendered algebra answer expression');return true;
 }
 if(a.kind==='rational-expression'){
  assert.ok(expressionIdentity(a.original,a.result),q.id+'/exact rational identity');sameRoots(originalDomain([a.original],a.variable||'x'),a.excluded,q.id+'/original denominator and divisor domain');
  assert.ok(originalDomain([a.result],a.variable||'x').every(value=>a.excluded.some(excluded=>equal(value,excluded))),q.id+'/simplification cannot introduce an additional undefined point');
  sameRoots(a.denominators.flatMap(expression=>originalDomain(['1/('+expression+')'],a.variable||'x')),a.excluded,q.id+'/declared nonzero factors');
  if(q.expression){assert.ok(expressionIdentity(q.expression,a.original),q.id+'/actual displayed rational expression');sameRoots(originalDomain([q.expression],a.variable||'x'),a.excluded,q.id+'/displayed original expression retains all domain restrictions');}if(q.answerExpression)assert.ok(expressionIdentity(q.answerExpression,a.result),q.id+'/rendered rational answer expression');return true;
 }
 if(a.kind==='equation'||a.kind==='word-model'){
  const solved=solveEquation(a.left,a.right,a.variable||'x');assert.equal(solved.classification,a.classification||'finite',q.id+'/solution classification');assert.equal(new Set(a.solutions.map(format)).size,a.solutions.length,q.id+'/unique candidate list');sameRoots(solved.solutions,a.solutions,q.id+'/complete real solutions');sameRoots(solved.excluded,a.excluded||[],q.id+'/original equation exclusions');
  if(a.denominators)sameRoots(a.denominators.flatMap(expression=>originalDomain(['1/('+expression+')'],a.variable||'x')),a.excluded||[],q.id+'/declared denominator factors');
  if(solved.solutions.length===1)numeric(q,solved.solutions[0]);
  if(q.expression){const sides=q.expression.split('=');assert.equal(sides.length,2,q.id+'/actual displayed equation');assert.ok(expressionIdentity(sides[0],a.left)&&expressionIdentity(sides[1],a.right),q.id+'/displayed sides retain original equation');sameRoots(originalDomain(sides,a.variable||'x'),a.excluded||[],q.id+'/displayed original equation domain');}
  if(a.kind==='word-model'){checkWordModel(q,solved);assert.ok(q.answerExpression,q.id+'/hidden teacher model');const sides=q.answerExpression.split('=');assert.equal(sides.length,2);assert.ok(expressionIdentity(sides[0],a.left)&&expressionIdentity(sides[1],a.right),q.id+'/hidden model matches independently reconstructed original equation');sameRoots(originalDomain(sides,a.variable||'x'),a.excluded||[],q.id+'/hidden model original domain');}if(a.context)checkLinearContext(q,solved);return true;
 }
 return false;
}
function checkLinearContext(q,solved){
 const a=q.audit,c=a.context,x=a.variable||'x';let left,right;
 switch(c.kind){
  case 'unit-cost':left=`(${c.unitPrice??c.count})${x}+(${c.fixed||0})`;right=String(c.total);assert.ok(['count','unitPrice'].includes(c.unknown));break;
  case 'sum-difference':assert.ok(['smaller','single-addend'].includes(c.unknown));left=c.unknown==='smaller'?`${x}+(${x}+(${c.difference}))`:`${x}+(${c.difference})`;right=String(c.total);break;
  case 'catch-up':left=`(${c.fastSpeed})${x}`;right=c.headStartTime!==undefined?`(${c.slowSpeed})(${x}+(${c.headStartTime}))`:`(${c.slowSpeed})${x}+(${c.headStartDistance})`;assert.ok(number(c.fastSpeed)>number(c.slowSpeed)&&number(c.slowSpeed)>0);break;
  case 'work-rate':left=`${x}/(${c.aTime})+${x}/(${c.bTime})`;right='1';assert.ok(number(c.aTime)>0&&number(c.bTime)>0);break;
  case 'profit':left=`${x}(1+(${c.profitPercent})/100)`;right=String(c.sale);break;
  case 'ratio-part':assert.ok(c.parts.length>=2&&c.parts.every(v=>number(v)>0)&&Number.isInteger(c.target)&&c.target>=0&&c.target<c.parts.length);left=`(${format(c.parts.reduce(add,rational(0)))})${x}`;right=`(${c.total})(${c.parts[c.target]})`;break;
  case 'discount-profit':left=`${x}(1+(${c.profitPercent})/100)`;right=`(${c.marked})(1-(${c.discountPercent})/100)`;assert.ok(number(c.discountPercent)>=0&&number(c.discountPercent)<100);break;
  case 'tiered-bill':assert.ok(['lower','upper'].includes(c.branch)&&number(c.threshold)>0&&number(c.baseRate)>0&&number(c.excessRate)>0);left=c.branch==='lower'?`(${c.baseRate})${x}`:`(${c.threshold})(${c.baseRate})+(${x}-(${c.threshold}))(${c.excessRate})`;right=String(c.bill);for(const root of solved.solutions)assert.ok(number(root)>=0&&(c.branch==='lower'?number(root)<=number(c.threshold):number(root)>number(c.threshold)),q.id+'/billing branch admissibility');break;
  case 'rectangle-perimeter':left=`2${x}+2(${x}+(${c.difference}))`;right=String(c.perimeter);assert.ok(number(c.difference)>=0);break;
  case 'ticket-mix':left=`(${c.firstPrice})${x}+(${c.secondPrice})((${c.count})-${x})`;right=String(c.total);for(const root of solved.solutions)assert.ok(root.d===1n&&number(root)>=0&&number(root)<=number(c.count),q.id+'/whole ticket counts within total');break;
  default:assert.fail(q.id+'/unsupported contextual equation '+c.kind);
 }
 assert.ok(proportionalExpressions(`(${a.left})-(${a.right})`,`(${left})-(${right})`),q.id+'/equation independently reconstructed from context');const independent=solveEquation(left,right,x);sameRoots(solved.solutions,independent.solutions,q.id+'/independent contextual solution');assert.ok(solved.solutions.every(root=>number(root)>0),q.id+'/positive quantity');if(c.kind==='unit-cost'&&c.unknown==='count')assert.ok(solved.solutions.every(root=>root.d===1n),q.id+'/whole item count');
}
function checkWordModel(q,solved){
 const a=q.audit,f=a.quantities,x=a.variable||'x';let left,right;
 if(a.model==='work-rate'){
  assert.ok(number(f.aDays)>0);if(f.unknown==='bDays'){assert.ok(number(f.togetherDays)>0);left=`1/(${f.aDays})+1/${x}`;right=`1/(${f.togetherDays})`;}
  else if(f.unknown==='togetherDays'){assert.ok(number(f.bDays)>0);left=`${x}/(${f.aDays})+${x}/(${f.bDays})`;right='1';}else assert.fail(q.id+'/unknown work quantity');
 }else if(a.model==='travel'){
  if(f.unknown==='slowSpeed'&&f.equalTime){assert.ok(number(f.slowDistance)>0&&number(f.fastDistance)>0&&number(f.speedIncrease)>0);left=`(${f.slowDistance})/${x}`;right=`(${f.fastDistance})/(${x}+(${f.speedIncrease}))`;}
  else if(f.unknown==='slowSpeed'&&f.speedMultiplier){assert.ok(number(f.distance)>0&&number(f.speedMultiplier)>1&&number(f.delay)>0);left=`(${f.distance})/${x}`;right=`(${f.distance})/((${f.speedMultiplier})${x})+(${f.delay})`;}
  else assert.fail(q.id+'/unsupported travel model');
 }else assert.fail(q.id+'/unsupported word model');
 assert.ok(expressionIdentity(left,a.left)&&expressionIdentity(right,a.right),q.id+'/equation independently reconstructed from contextual quantities');assert.ok(solved.solutions.every(value=>number(value)>0),q.id+'/positive contextual solution');
}

function checkGeometry(q){
 const a=q.audit;
 if(a.kind==='triangle-sides'){assert.equal(a.sides.length,3);const sides=a.sides.map(value=>rational(value)),valid=sides.every(v=>v.n>0n)&&sides.every((v,i)=>subtract(add(sides[(i+1)%3],sides[(i+2)%3]),v).n>0n);assert.equal(valid,a.valid,q.id);if(a.expectedPerimeter!==undefined){assert.ok(valid);const perimeter=a.sides.reduce(add,rational(0));exact(perimeter,a.expectedPerimeter,q.id);numeric(q,perimeter);}return true;}
 if(a.kind==='triangle-angles'){
  const angles=a.angles.map(value=>value===null?null:number(value));assert.equal(angles.length,3);
  if(a.missingIndex!==undefined){assert.equal(angles[a.missingIndex],null);const missing=180-angles.reduce((sum,value)=>sum+(value||0),0);assert.ok(near(missing,number(a.expected)));angles[a.missingIndex]=missing;numeric(q,a.expected);}
  assert.equal(angles.every(v=>v>0)&&near(angles.reduce((sum,n)=>sum+n,0),180),a.valid??true,q.id+'/triangle interior angles');
  if(a.exterior!==undefined){assert.ok(near(number(a.exterior)+angles[a.exteriorAdjacentIndex],180),q.id+'/adjacent exterior angle');const remote=angles.filter((_,i)=>i!==a.exteriorAdjacentIndex);assert.ok(near(number(a.exterior),remote.reduce((sum,v)=>sum+v,0)));if(a.request==='remote'){assert.ok(remote.some(value=>near(value,number(a.expected))),q.id+'/requested remote angle');numeric(q,a.expected);}else numeric(q,a.exterior);}
  if(a.request==='scale'){assert.equal(a.coefficients.length,3);const scale=divide(180,a.coefficients.reduce(add,rational(0)));exact(scale,a.expected,q.id+'/independent angle scale');angles.forEach((angle,i)=>assert.ok(near(angle,number(multiply(a.coefficients[i],scale))),q.id+'/each scaled angle'));numeric(q,scale);}return true;
 }
 if(a.kind==='polygon'){assert.ok(Number.isInteger(a.sides)&&a.sides>=3);assert.equal(a.convex,true);if(a.interiorSum!==undefined)exact(a.interiorSum,180*(a.sides-2),q.id);if(a.exteriorSum!==undefined)exact(a.exteriorSum,360,q.id);if(a.exteriorAngle!==undefined)exact(a.exteriorAngle,divide(360,a.sides),q.id);if(a.interiorAngle!==undefined)exact(a.interiorAngle,divide(180*(a.sides-2),a.sides),q.id);const request=a.request||'interiorSum';assert.ok(['interiorSum','exteriorSum','exteriorAngle','interiorAngle','sides'].includes(request));numeric(q,a[request]);return true;}
 if(a.kind==='segment'){
  const points=a.points;assert.ok(points&&Object.keys(points).length>=2);
  if(a.check==='midpoint'){const names=a.segment||['A','B'],m=points[a.midpoint||'M'];assert.ok(closePoint(m,points[names[0]].map((value,i)=>(value+points[names[1]][i])/2)),q.id+'/actual midpoint');}
  else assert.ok(['distance','sum'].includes(a.check),q.id+'/segment operation');
  const result=(a.segments||[a.segment||'AB']).reduce((sum,segment)=>{const names=Array.isArray(segment)?segment:[...segment];return sum+length(points[names[0]],points[names[1]]);},0);
  if(a.expected!==undefined){assert.ok(near(result,number(a.expected)),q.id+'/actual segment length');numeric(q,a.expected);}return true;
 }
 if(a.kind==='angle'){
  const values=a.degrees.map(value=>rational(value));let result;if(a.operation==='sum')result=values.reduce(add,rational(0));else if(a.operation==='difference')result=values.slice(1).reduce(subtract,values[0]);else if(a.operation==='complement')result=subtract(90,values[0]);else if(a.operation==='supplement')result=subtract(180,values[0]);else if(a.operation==='bisect')result=divide(values[0],2);else assert.fail(q.id+'/unknown angle operation');exact(result,a.expected,q.id);numeric(q,result);
  if(a.displayAngles){assert.equal(a.displayAngles.length,values.length);a.displayAngles.forEach((v,i)=>exact(add(v.degrees,divide(v.minutes||0,60)),values[i],q.id+'/sexagesimal operand'));}if(a.displayAnswer)exact(add(a.displayAnswer.degrees,divide(a.displayAnswer.minutes||0,60)),result,q.id+'/sexagesimal answer');return true;
 }
 if(a.kind==='congruence'){
  if(['g8-congruence-sss-sas:independent:third-side','g8-congruence-angle-hl:extension:criterion-comparison'].includes(q.id))assert.ok(a.providedGivens&&a.requestedAdditional,q.id+'/regression: the task asks for a condition not already supplied');
  if(q.id==='g8-congruence-angle-hl:extension:criterion-comparison')assert.equal(checkCongruence({...a,criterion:'SAS',givens:a.providedGivens}).sufficient,true,q.id+'/baseline already proves congruence by SAS; only the requested direct SSS proof needs an extra side');
  const check=checkCongruence(a);assert.equal(check.sufficient,a.valid,q.id+'/given-only congruence criterion');if(a.valid)assert.ok(check.coordinatesCongruent,q.id+'/coordinate congruence corroboration');else if(['AAA','SSA'].includes(a.criterion))assert.equal(check.coordinatesCongruent,false,q.id+'/actual noncongruent counterexample');
  const normalSides=groups=>groups.map(group=>group.map(side=>(Array.isArray(side)?side:[...side]).sort().join('')).sort().join('=')).sort(),normalAngles=groups=>groups.map(group=>group.map(angle=>{const [u,v,w]=Array.isArray(angle)?angle:[...angle];return [u,w].sort()[0]+v+[u,w].sort()[1];}).sort().join('=')).sort();
  if(a.providedGivens){
   assert.equal(checkCongruence({...a,givens:a.providedGivens}).sufficient,false,q.id+'/the supplied partial conditions are not already sufficient');assert.ok(a.requestedAdditional,q.id+'/explicit requested extra condition');
   const completed=Object.fromEntries(['equalSides','equalAngles','rightAngles'].map(field=>[field,[...(a.providedGivens[field]||[]),...(a.requestedAdditional[field]||[])]]));assert.ok(checkCongruence({...a,givens:completed}).sufficient,q.id+'/requested extra condition completes the criterion');assert.deepEqual(normalSides(completed.equalSides),normalSides(a.givens.equalSides||[]));assert.deepEqual(normalAngles(completed.equalAngles),normalAngles(a.givens.equalAngles||[]));assert.deepEqual([...completed.rightAngles].sort(),[...(a.givens.rightAngles||[])].sort());
   for(const pair of a.requestedAdditional.equalSides||[]){const equation=pair.join('=');assert.equal(q.options[q.correctChoice].en.replace(/\s+/g,''),equation,q.id+'/the selected option is exactly the independently required side equality');}
  }
  if(q.diagram?.kind==='geometry'){const d=q.diagram,shown=a.providedGivens||a.givens;for(const point of d.points)assert.ok(closePoint([point.x,point.y],a.points[point.id]),q.id+'/proof diagram uses audited actual vertices');assert.deepEqual(normalSides(d.equalSegments||[]),normalSides(shown.equalSides||[]),q.id+'/only original supplied side ticks, not the requested additional condition');assert.deepEqual(normalAngles(d.equalAngles||[]),normalAngles(shown.equalAngles||[]),q.id+'/only original supplied angle arcs');assert.deepEqual((d.rightAngles||[]).map(angle=>angle.join('')).sort(),[...(shown.rightAngles||[])].sort(),q.id+'/right-angle givens exactly match proof');}
  return true;
 }
 if(a.kind==='special-triangle'){
  const names=a.triangle||['A','B','C'],points=a.points;assert.equal(names.length,3);const p=names.map(name=>points[name]);assert.ok(Math.abs((p[1][0]-p[0][0])*(p[2][1]-p[0][1])-(p[1][1]-p[0][1])*(p[2][0]-p[0][0]))>1e-8,q.id+'/noncollinear special triangle');
  const vertex=a.vertex||names[0],base=a.base||names.filter(name=>name!==vertex);
  if(q.type==='proof'||a.proofDirection==='converse'){
   const d=q.diagram;assert.equal(d?.kind,'geometry',q.id+'/proof givens drawn explicitly');const sourcePoints=Object.fromEntries(d.points.map(point=>[point.id,[point.x,point.y]])),key=side=>(Array.isArray(side)?side:[...side]).sort().join(''),legKeys=base.map(name=>key([vertex,name])),givenLegs=(d.equalSegments||[]).some(group=>legKeys.every(leg=>group.some(side=>key(side)===leg))),givenBaseAngles=(d.equalAngles||[]).some(group=>base.every(name=>group.some(angle=>angle[1]===name)));
   if(a.proofDirection==='converse'){
    assert.ok(givenBaseAngles,q.id+'/equal base angles are the actual premise');assert.equal(givenLegs,false,q.id+'/converse cannot assume its target equal legs');
    if(q.type==='proof'){const auxiliary=d.auxiliary?.find(side=>side.includes(vertex)),foot=auxiliary?.find(name=>name!==vertex);assert.ok(foot&&sourcePoints[foot],q.id+'/constructed angle-bisector foot');const check=checkCongruence({points:sourcePoints,triangles:[[vertex,base[0],foot],[vertex,base[1],foot]],correspondence:[vertex,base[1],foot],criterion:'AAS',givens:{equalSides:[[vertex+foot,vertex+foot]],equalAngles:[[vertex+base[0]+foot,vertex+base[1]+foot],[base[0]+vertex+foot,foot+vertex+base[1]]]}});assert.ok(check.sufficient&&check.coordinatesCongruent,q.id+'/independent AAS converse proof');}
   }else if(a.proofDirection==='equilateral-from-isosceles-60'){
    assert.ok(givenLegs);assert.ok((d.equalSegments||[]).every(group=>!group.some(side=>key(side)===key(base))),q.id+'/do not assume third equal side');const u=vector(points[base[0]],points[vertex]),v=vector(points[base[1]],points[vertex]);assert.ok(near(dot(u,v)/Math.sqrt(dot(u,u)*dot(v,v)),.5),q.id+'/given60 degree vertex plus equal legs entails all60 angles');
   }else if(a.proofDirection==='three-lines'){
    assert.ok(givenLegs);assert.equal((d.rightAngles||[]).length,0,q.id+'/three-lines proof derives perpendicularity');assert.equal((d.equalAngles||[]).length,0,q.id+'/three-lines proof derives angle bisection');const mid=d.auxiliary?.find(side=>side.includes(vertex))?.find(name=>name!==vertex);assert.ok(mid&&closePoint(sourcePoints[mid],points[base[0]].map((value,i)=>(value+points[base[1]][i])/2)));assert.ok((d.equalSegments||[]).some(group=>[base[0]+mid,mid+base[1]].every(segment=>group.some(side=>key(side)===key(segment)))),q.id+'/midpoint is an actual given');const check=checkCongruence({points:sourcePoints,triangles:[[vertex,base[0],mid],[vertex,base[1],mid]],correspondence:[vertex,base[1],mid],criterion:'SSS',givens:{equalSides:[[vertex+base[0],vertex+base[1]],[base[0]+mid,base[1]+mid],[vertex+mid,vertex+mid]]}});assert.ok(check.sufficient&&check.coordinatesCongruent,q.id+'/independent SSS derives equal adjacent supplementary angles');
   }else assert.fail(q.id+'/full special-triangle proof needs an explicit supported direction');
  }
  if(a.property==='isosceles'||a.property==='equilateral')assert.ok(near(squaredDistance(points[vertex],points[base[0]]),squaredDistance(points[vertex],points[base[1]])),q.id+'/equal legs');
  if(a.property==='equilateral')assert.ok(near(squaredDistance(points[base[0]],points[base[1]]),squaredDistance(points[vertex],points[base[0]])),q.id+'/third equal side');
  if(a.property==='right-30'){assert.ok(names.includes(a.rightAt)&&names.includes(a.angle30At)&&a.rightAt!==a.angle30At);const rightOthers=names.filter(name=>name!==a.rightAt),u=vector(points[rightOthers[0]],points[a.rightAt]),v=vector(points[rightOthers[1]],points[a.rightAt]);assert.ok(near(dot(u,v),0),q.id+'/actual right angle');const opposite=[...a.oppositeSide],hypotenuse=[...a.hypotenuse];assert.ok(!opposite.includes(a.angle30At)&&!hypotenuse.includes(a.rightAt),q.id+'/named opposite leg and hypotenuse');assert.ok(near(4*squaredDistance(points[opposite[0]],points[opposite[1]]),squaredDistance(points[hypotenuse[0]],points[hypotenuse[1]])),q.id+'/opposite30 leg is half hypotenuse');}
  else assert.ok(['isosceles','equilateral'].includes(a.property));
  if(a.vertexAngle!==undefined){const u=vector(points[base[0]],points[vertex]),v=vector(points[base[1]],points[vertex]);assert.ok(near(dot(u,v)/Math.sqrt(dot(u,u)*dot(v,v)),Math.cos(number(a.vertexAngle)*Math.PI/180)),q.id+'/stated vertex angle');if(a.baseAngle!==undefined)exact(add(a.vertexAngle,multiply(2,a.baseAngle)),180,q.id+'/two base angles');}
  if(a.requestedAngle){assert.ok(names.includes(a.requestedAngle));const other=names.filter(name=>name!==a.requestedAngle),u=vector(points[other[0]],points[a.requestedAngle]),v=vector(points[other[1]],points[a.requestedAngle]);assert.ok(near(dot(u,v)/Math.sqrt(dot(u,u)*dot(v,v)),Math.cos(number(a.expectedAngle)*Math.PI/180)),q.id+'/actual requested angle');numeric(q,a.expectedAngle);}
  if(a.requestedSide){const [u,v]=[...a.requestedSide];assert.ok(names.includes(u)&&names.includes(v));assert.ok(near(length(points[u],points[v]),number(a.expectedSide)),q.id+'/actual requested side');numeric(q,a.expectedSide);}
  if(a.expectedPerimeter!==undefined)assert.ok(near(p.reduce((sum,point,i)=>sum+length(point,p[(i+1)%3]),0),number(a.expectedPerimeter)),q.id+'/actual perimeter');
  if(q.numericAnswer!==undefined&&!a.requestedSide&&!a.requestedAngle){assert.ok(a.expectedPerimeter!==undefined,q.id+'/explicit requested special triangle value');numeric(q,a.expectedPerimeter);}return true;
 }
 if(a.kind==='construction-axis'){assert.ok(a.pairs?.length);const valid=a.pairs.every(([p,q])=>closePoint(reflect(p,a.line),q));assert.equal(valid,a.valid,q.id+'/actual reflection pairs');return true;}
 return false;
}

function checkConcept(q){
 const a=q.audit;if(a.kind!=='concept')return false;const f=a.facts;let actual;
 switch(a.rule){
  case 'rational-classification':{const v=rational(f.value);const checks={integer:v.d===1n,rational:true,positive:v.n>0n,negative:v.n<0n,zero:v.n===0n};assert.ok(f.claim in checks);actual=checks[f.claim];break;}
  case 'absolute-value':{const v=rational(f.value),value=rational(v.n<0n?-v.n:v.n,v.d);actual=equal(value,f.claimed);if(a.valid)numeric(q,value);break;}
  case 'division-defined':{const denominator=rational(f.denominator);actual=denominator.n!==0n&&equal(divide(f.numerator,denominator),f.claimed);break;}
  case 'monomial-data':{const powers=Object.values(f.powers);assert.ok(powers.every(n=>Number.isInteger(n)&&n>=0));const original=f.expression||q.expression;assert.ok(original,q.id+'/actual displayed monomial');const expected=`(${f.coefficient})`+Object.entries(f.powers).map(([variable,power])=>`${variable}^${power}`).join('');assert.ok(expressionIdentity(original,expected),q.id+'/actual monomial coefficient and powers');const value=f.request==='degree'?powers.reduce((s,n)=>s+n,0):f.request==='coefficient'?f.coefficient:assert.fail('unknown monomial request');actual=equal(value,f.claimed);if(a.valid)numeric(q,value);break;}
  case 'decimal-rounding':{assert.ok(Number.isInteger(f.places)&&f.places>=0&&f.places<=8);const v=rational(f.value),scale=10n**BigInt(f.places),n=v.n<0n?-v.n:v.n,rounded=(2n*n*scale+v.d)/(2n*v.d);actual=equal(rational(v.n<0n?-rounded:rounded,scale),f.claimed);break;}
  case 'equation-definition':{const hasEquality=String(f.expression).split('=').length===2,hasUnknown=/[A-Za-z]/.test(String(f.expression).replace(/\\[a-z]+/gi,''));assert.equal(f.hasEquality,hasEquality);assert.equal(f.hasUnknown,hasUnknown);assert.equal(f.claim,'equation');actual=hasEquality&&hasUnknown;break;}
  case 'equality-preserving-operation':{assert.ok(['add','subtract','multiply','divide'].includes(f.operation));const operation={add:'+',subtract:'-',multiply:'*',divide:'/'}[f.operation];let transforms=false;try{transforms=expressionIdentity(`(${f.left})${operation}(${f.operand})`,f.resultLeft)&&expressionIdentity(`(${f.right})${operation}(${f.operand})`,f.resultRight);}catch{}let preserves=false;try{const before=solveEquation(f.left,f.right),after=solveEquation(f.resultLeft,f.resultRight);preserves=before.classification===after.classification&&JSON.stringify(rootSet(before.solutions))===JSON.stringify(rootSet(after.solutions))&&JSON.stringify(rootSet(before.excluded))===JSON.stringify(rootSet(after.excluded));}catch{}actual=transforms&&preserves;break;}
  case 'geometry-object':{const expected={ray:[1,1],line:[0,2],segment:[2,0]};assert.ok(expected[f.object]);actual=f.endpoints===expected[f.object][0]&&f.extendsDirections===expected[f.object][1];break;}
  case 'segment-additivity':{const {A,M,B}=f.points;const equality=near(length(A,M)+length(M,B),length(A,B));actual=equality===f.claimSumEqualsWhole;break;}
  case 'angle-pair':{assert.equal(f.angles.length,2);const target={complementary:90,supplementary:180}[f.claim];assert.ok(target);actual=equal(f.angles.reduce(add,rational(0)),target);break;}
  case 'coordinate-reflection':{assert.ok(['x','y'].includes(f.axis));const expected=f.point.map((v,i)=>f.axis==='x'?(i===1?-v:v):(i===0?-v:v));actual=closePoint(expected,f.image);break;}
  case 'triangle-median':{const side=f.side.map(name=>f.points[name]),m=f.points[f.midpoint];actual=closePoint(m,side[0].map((value,i)=>(value+side[1][i])/2));assert.ok(f.points[f.vertex]);if(f.wholeLength!==undefined){exact(divide(f.wholeLength,2),f.halfLength,q.id+'/stated midpoint lengths');numeric(q,f.halfLength);}break;}
  case 'triangle-altitude':{const [b,c]=f.side.map(name=>f.points[name]),h=f.points[f.foot],v=f.points[f.vertex],direction=vector(c,b);actual=near(dot(vector(v,h),direction),0)&&near((h[0]-b[0])*direction[1]-(h[1]-b[1])*direction[0],0);break;}
  case 'median-not-necessarily-altitude':{const [b,c]=f.side.map(name=>f.points[name]),m=f.points[f.midpoint],v=f.points[f.vertex];assert.ok(closePoint(m,b.map((value,i)=>(value+c[i])/2)),q.id+'/counterexample is actually a median');actual=near(dot(vector(v,m),vector(c,b)),0);break;}
  case 'angle-bisector-not-necessarily-median':{const [b,c]=f.side.map(name=>f.points[name]),v=f.points[f.vertex],lb=length(v,b),lc=length(v,c);assert.ok(lb>0&&lc>0);const ratio=lb/(lb+lc),bisector=b.map((value,i)=>value+ratio*(c[i]-value)),median=b.map((value,i)=>(value+c[i])/2);actual=closePoint(bisector,median);break;}
  case 'reflection-shortest-path':{assert.equal(f.axis,'x');assert.ok(closePoint(f.mirrorA,[f.A[0],-f.A[1]]),q.id+'/actual reflected endpoint');assert.ok(near(f.meeting[1],0),q.id+'/meeting on mirror line');const segment=vector(f.B,f.mirrorA),offset=vector(f.meeting,f.mirrorA);assert.ok(near(offset[0]*segment[1]-offset[1]*segment[0],0)&&dot(offset,segment)>0&&dot(offset,segment)<dot(segment,segment),q.id+'/meeting on interior straight reflected path');const distance=length(f.mirrorA,f.B);actual=near(distance,number(f.minimum))&&near(length(f.A,f.meeting)+length(f.meeting,f.B),distance);numeric(q,f.minimum);break;}
  case 'cube-counts':{assert.ok(f.vertices?.length&&f.faces?.length);const edges=new Set();for(const face of f.faces){assert.equal(face.length,4);assert.ok(new Set(face).size===4&&face.every(i=>Number.isInteger(i)&&f.vertices[i]));for(let i=0;i<4;i++)edges.add([face[i],face[(i+1)%4]].sort((a,b)=>a-b).join(':'));}const distances=[...edges].map(edge=>{const[i,j]=edge.split(':').map(Number);return squaredDistance(f.vertices[i],f.vertices[j]);});assert.ok(distances[0]>0&&distances.every(d=>near(d,distances[0])),q.id+'/cube equal edges');for(const face of f.faces){const[a,b,c]=face.map(i=>f.vertices[i]);assert.ok(near(dot(vector(a,b),vector(c,b)),0),q.id+'/cube square face');}const counts={vertices:f.vertices.length,edges:edges.size,faces:f.faces.length};assert.equal(counts.vertices-counts.edges+counts.faces,2);if(f.request){actual=equal(counts[f.request],f.claimed);if(a.valid)numeric(q,counts[f.request]);}else{assert.ok(f.claimed&&typeof f.claimed==='object',q.id+'/explicit cube counts claim');actual=Object.entries(f.claimed).every(([key,value])=>counts[key]===value);}break;}
  default:assert.fail(q.id+'/concept rule has no independent checker: '+a.rule);
 }
 assert.equal(actual,a.valid,q.id+'/'+a.rule);return true;
}

test('every new arithmetic, algebraic, geometric and conceptual answer has an independent check',()=>{
 assert.ok(packs.length>0,'Authored expansion packs are required');
 const kinds=new Set(),errors=[];for(const pack of packs)for(const q of pack.questions){kinds.add(q.audit.kind);try{assert.ok(checkAlgebra(q)||checkGeometry(q)||checkConcept(q),q.id+'/unsupported independent audit kind '+q.audit.kind);if(q.audit.kind!=='concept'&&q.numericAnswer!==undefined&&q.expression&&!q.expression.includes('=')&&!variablesIn(q.expression).length)numeric(q,evaluateMath(q.expression),q.id+'/actual displayed numeric calculation');if(q.numericAnswer!==undefined&&q.answerExpression&&!q.answerExpression.includes('=')&&!variablesIn(q.answerExpression).length)numeric(q,evaluateMath(q.answerExpression),q.id+'/hidden reference calculation');}catch(error){errors.push(q.id+': '+error.message);}}assert.deepEqual(errors,[],'Every authored question must independently pass; all failures are retained');
 if(packs.length===21)assert.ok(kinds.has('arithmetic')&&kinds.has('polynomial')&&kinds.has('equation')&&kinds.has('congruence')&&kinds.has('rational-expression')&&kinds.has('word-model'),'All upper-volume mathematical domains must be audited');
});
