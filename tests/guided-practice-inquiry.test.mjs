import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import katex from 'katex';
import {G8_LOWER_INQUIRIES} from '../src/data/guided-practice/g8-lower-inquiries.mjs';
import {LOWER_CHAPTERS} from '../src/data/lower-core-plan.mjs';
import {LOWER_PRACTICE_PACKS} from '../src/data/guided-practice/index.mjs';
import {splitAuthoredMath,assertCanonicalDisplayMath} from '../src/lib/authored-math.mjs';
import {F,add,sub,mul,div,equal,format,dataSummary,radicalIdentity,radicalNumber,evaluateRadical,parallel,perpendicular,length2,midpoint,quadrilateralProperties} from './helpers/guided-lower-math.mjs';

const ids=LOWER_CHAPTERS.filter(c=>c.grade==='g8').flatMap(c=>c.packIds);
const stages=id=>G8_LOWER_INQUIRIES[id].stages.map(s=>s.task);
const nativePath=new URL('../public/math-studio/',import.meta.url);
function native(){
 let writes=0;const context=vm.createContext({console,localStorage:{getItem:()=>null,setItem:()=>{writes++;}},setTimeout,clearTimeout});
 const app=fs.readFileSync(new URL('app.js',nativePath),'utf8'),fmt=app.match(/^const fmt=.*$/m);assert.ok(fmt,'Read the actual native formatter without booting a UI');vm.runInContext(fmt[0],context);
 for(const file of ['inquiry-g7-core.js','inquiry.js'])vm.runInContext(fs.readFileSync(new URL(file,nativePath),'utf8'),context,{filename:file});
 return {run:code=>vm.runInContext(code,context),writes:()=>writes};
}
const coords=text=>[...text.replaceAll('−','-').matchAll(/\((-?\d+),(-?\d+)\)/g)].map(match=>match.slice(1).map(Number));
const points=rows=>Object.fromEntries(rows.map((p,i)=>['ABCD'[i],p]));
const midpointOf=(p,a,b)=>p[a].map((v,i)=>(v+p[b][i])/2);
const bilingualIncludes=(task,en,zh)=>{assert.ok(task.en.includes(en),en);assert.ok(task['zh-Hant'].includes(zh),zh);};

test('all twelve G8 inquiries have four bilingual stages totaling eighteen minutes and bind to registry',()=>{
 assert.equal(ids.length,12);assert.deepEqual(Object.keys(G8_LOWER_INQUIRIES).sort(),[...ids].sort());
 for(const id of ids){const inquiry=G8_LOWER_INQUIRIES[id],pack=LOWER_PRACTICE_PACKS.find(p=>p.id===id);assert.ok(pack);assert.deepEqual(inquiry.stages.map(s=>s.minutes),[3,8,5,2]);assert.equal(inquiry.stages.reduce((n,s)=>n+s.minutes,0),18);assert.deepEqual(pack.inquiryStages,inquiry.stages);assert.deepEqual(pack.inquiry,inquiry.text);
  for(const locale of ['en','zh-Hant']){assert.ok(inquiry.stages.every(s=>s.task[locale]?.trim()));assert.ok(inquiry.stages.every(s=>inquiry.text[locale].includes(s.task[locale])));}
 }
});
test('every bilingual inquiry formula is canonical KaTeX and English contains no untranslated Han',()=>{
 let formulas=0;for(const inquiry of Object.values(G8_LOWER_INQUIRIES))for(const value of [...inquiry.stages.map(s=>s.task),inquiry.text])for(const locale of ['en','zh-Hant']){
  const text=value[locale];if(locale==='en')assert.ok(!/\p{Script=Han}/u.test(text),text);
  for(const part of splitAuthoredMath(text)){if(part.kind==='text')assert.ok(!/\^|\\[A-Za-z]+/.test(part.value),'Unmarked authored formula '+part.value);else{assertCanonicalDisplayMath(part.value);const html=katex.renderToString(part.value,{throwOnError:true,trust:false,strict:'error',output:'htmlAndMathml'});assert.ok(html.includes('<math'));formulas++;}}
 }assert.equal(formulas,56,'Four copies of all fourteen authored formula occurrences checked (two locales, stage plus combined text)');
});
test('new radical and Pythagoras inquiry examples follow exact identities and strict triangle existence',()=>{
 const root=stages('g8-radicals-meaning');bilingualIncludes(root[0],'x=3, −3 and 0','x＝3、−3、0');for(const x of [3,-3,0])assert.ok(radicalIdentity(`sqrt((${x})^2)`,String(Math.abs(x))));
 bilingualIncludes(root[1],'x=1,3,7','x＝1、3、7');assert.deepEqual([1,3,7].map(x=>x-3>=0),[false,true,true]);assert.ok(root[2].en.includes('x-3\\geq0'));assert.ok(root[3].en.includes('(-5)^{2}')&&root[3].en.includes('x^{2}=25'));
 const operations=stages('g8-radicals-operations');assert.ok(operations[1].en.includes('\\sqrt8\\sqrt2=4'));assert.ok(radicalIdentity('sqrt(8)*sqrt(2)','4'));assert.ok(radicalIdentity('sqrt(8)+sqrt(2)','3*sqrt(2)'));assert.ok(!radicalIdentity('sqrt(9)+sqrt(16)','sqrt(9+16)'));assert.ok(radicalIdentity('sqrt(18)+sqrt(8)','5*sqrt(2)'));
 const lengths=stages('g8-pythagoras-lengths');bilingualIncludes(lengths[1],'(3,4) then (6,8): c=5,10 and c²=25,100','(3,4)、(6,8)：c＝5、10，c²＝25、100');assert.equal(3**2+4**2,25);assert.equal(6**2+8**2,100);assert.equal((6**2+8**2)/(3**2+4**2),4);assert.notEqual((6**2+4**2)/(3**2+4**2),4);assert.equal(9**2+12**2,15**2);
 const converse=stages('g8-pythagoras-converse'),cards=[...converse[0].en.matchAll(/\((\d+),(\d+),(\d+)\)/g)].map(m=>m.slice(1).map(Number));assert.equal(cards.length,3);assert.deepEqual(cards.map(s=>{const[a,b,c]=s.sort((a,b)=>a-b);return a+b>c?(a*a+b*b===c*c?'right':'not-right'):'degenerate';}),['right','not-right','degenerate']);assert.ok(converse[1].en.includes('cannot test three arbitrary sides'));assert.equal(8**2+15**2,17**2);
});
test('new geometry investigations verify source coordinates and retain missing-premise counterexamples',()=>{
 const pTasks=stages('g8-parallelograms-tests'),rows=coords(pTasks[1].en);assert.equal(rows.length,8);const p=points(rows.slice(0,4)),t=points(rows.slice(4));assert.ok(parallel(p,'AB','CD')&&parallel(p,'AD','BC'));assert.deepEqual(midpointOf(p,'A','C'),midpointOf(p,'B','D'));assert.notEqual(length2(p,'AC'),length2(p,'BD'));
 assert.equal(length2(t,'AC'),length2(t,'BD'));assert.notDeepEqual(midpointOf(t,'A','C'),midpointOf(t,'B','D'));assert.ok(!parallel(t,'AD','BC'));assert.equal(quadrilateralProperties({equalSegments:[['AC','BD']]}).parallelogram,false);
 const special=stages('g8-rectangles-rhombi'),match=special[1].en.match(/(\d+)-by-(\d+) rectangle \(diagonals (\d+)\)/);assert.ok(match);const[w,h,d]=match.slice(1).map(Number);assert.equal(w*w+h*h,d*d);const r=points([[0,0],[w,0],[w,h],[0,h]]);assert.deepEqual(midpointOf(r,'A','C'),midpointOf(r,'B','D'));assert.equal(length2(r,'AC'),length2(r,'BD'));assert.ok(!perpendicular(r,'AC','BD'));
 const rh=points(coords(special[1].en));assert.equal(Object.keys(rh).length,4);assert.ok(['BC','CD','DA'].every(s=>length2(rh,s)===length2(rh,'AB')));assert.equal(length2(rh,'AC'),36);assert.equal(length2(rh,'BD'),64);assert.ok(perpendicular(rh,'AC','BD'));assert.deepEqual(midpointOf(rh,'A','C'),midpointOf(rh,'B','D'));assert.ok(!perpendicular(rh,'AB','AD'));
 assert.equal(quadrilateralProperties({parallelogram:true,equalSegments:[['AC','BD']]}).square,false);assert.equal(quadrilateralProperties({parallelogram:true,perpendicular:[['AC','BD']]}).square,false);assert.equal(quadrilateralProperties({parallelogram:true,equalSegments:[['AC','BD']],perpendicular:[['AC','BD']]}).square,true);assert.ok(stages('g8-squares-classification')[1].en.includes('rectangle, rhombus and parallelogram families'));
 const kite={A:[0,3],B:[2,0],C:[0,-1],D:[-2,0]};assert.ok(perpendicular(kite,'AC','BD'));assert.notEqual(length2(kite,'AB'),length2(kite,'BC'));assert.equal(quadrilateralProperties({perpendicular:[['AC','BD']]}).rhombus,false);
});
test('tariff inquiry parameters are reachable in the actual native engine and reproduce authored costs',()=>{
 const task=stages('g8-linear-functions-models'),setting=task[1].en.match(/fixed fee (\d+), rate (\d+), minimum usage (\d+) and budget (\d+)/);assert.ok(setting);const[fixed,rate,minimum,budget]=setting.slice(1).map(Number);assert.deepEqual([fixed,rate,minimum,budget],[6,1,0,100]);const usages=task[1].en.match(/n=(\d+),(\d+),(\d+)/).slice(1).map(Number),authored=[...task[1].en.matchAll(/\((\d+),(\d+)\)/g)].map(m=>m.slice(1).map(Number));assert.deepEqual(usages,[4,6,8]);
 const r=native();for(const[n,i]of usages.map((n,i)=>[n,i])){const input={fixed,rate,minimum,budget,n};r.run('globalThis.qaInput='+JSON.stringify(input));const result=r.run('G7InquiryCore.calculate("tariffs",qaInput)'),independent=[2*n,fixed+rate*n];assert.deepEqual(JSON.parse(JSON.stringify(result.params)),input);assert.deepEqual([result.metrics.costA,result.metrics.costB],independent);assert.deepEqual(authored[i],independent);assert.equal(result.metrics.threshold,fixed/(2-rate));assert.ok(result.metrics.feasibleA&&result.metrics.feasibleB);}
 assert.ok(task[2].en.includes('(6,12)'));assert.deepEqual([2*7,fixed+rate*7],[14,13]);assert.equal(r.writes(),0,'Calculation verification does not write learning records');
});
test('outlier and variance investigation values are independently derived, including native snapshots',()=>{
 const centre=stages('g8-data-centres'),text=centre[1].en;const fixed=text.match(/keep ([\d,]+) fixed/).at(1).split(',').map(Number),fifth=text.match(/fifth values ([\d,]+)\./).at(1).split(',').map(Number),means=text.match(/means ([\d.,]+);/).at(1).split(',').map(v=>F(v)),medians=text.match(/medians ([\d,]+)\./).at(1).split(',').map(v=>F(v));assert.deepEqual(fixed,[4,5,6,7]);assert.deepEqual(fifth,[0,8,40]);const r=native();for(let i=0;i<fifth.length;i++){const data=dataSummary([...fixed,fifth[i]]);assert.ok(equal(data.mean,means[i]));assert.ok(equal(data.median,medians[i]));const snapshot=r.run(`Inquiry.snapshot('outlier',{v:${fifth[i]}})`);assert.ok(snapshot.result.includes(`平均數=${Number(data.mean.n)/Number(data.mean.d)}`));assert.ok(snapshot.result.includes(`中位數=${format(data.median)}`));}
 const variance=stages('g8-data-variance'),groups=[...variance[0].en.matchAll(/[AB]=\{([\d,]+)\}/g)].map(m=>m[1].split(',').map(Number));assert.deepEqual(groups,[[4,5,6],[1,5,9]]);const[a,b]=groups.map(v=>dataSummary(v));assert.ok(equal(a.mean,5)&&equal(b.mean,5));assert.ok(equal(a.variance,'2/3')&&equal(b.variance,'32/3'));assert.ok(variance[1].en.includes('\\frac23')&&variance[1].en.includes('\\frac{32}{3}'));assert.ok(equal(dataSummary(groups[0].map(v=>v+3)).variance,a.variance));assert.ok(equal(dataSummary(groups[0].map(v=>v*2)).variance,mul(4,a.variance)));assert.ok(equal(dataSummary(groups[0].map(v=>v*-2)).variance,mul(4,a.variance)));assert.ok(variance[2].en.includes('\\frac83'));assert.equal(r.writes(),0);
});
