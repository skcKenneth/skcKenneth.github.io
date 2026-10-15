import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {transformSync} from 'esbuild';
import {LOWER_PRACTICE_PACKS} from '../src/data/guided-practice/index.mjs';

const source=fs.readFileSync(new URL('../src/components/LowerPracticeDiagram.astro',import.meta.url),'utf8');
const frontmatter=source.split('---')[1].replace(/^import .*;$/gm,'');
// Extract production frontmatter, including its real tableRows selection, plus endpoint markup pipeline.
const endpointExpression=source.match(/\{(lines\.filter\([\s\S]+?)\.map\(\(p:any\)=><circle data-line-endpoint/)[1];
assert.ok(source.includes('<tbody>{tableRows.map('),'The template must use the selected production table rows');
const js=transformSync(frontmatter+`\nglobalThis.qa={clipLine,lines,points,intervals,bins,heights,binMin,binMax,maxValue,density,BX,barY,binTicks,barTicks,label,endpoints:${endpointExpression},tableRows};`,{loader:'ts'}).code;
const renderState=(diagram,solution=false,locale='en')=>{const context=vm.createContext({Astro:{props:{diagram,locale,solution}}});vm.runInContext(js,context);return context.qa;};
const plain=value=>JSON.parse(JSON.stringify(value));
const close=(a,b)=>Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
/** Independent interval intersection in x; does not use candidate boundary points. */
function independentClip(line,bounds){
 let[lo,hi,ymin,ymax]=bounds;const k=Number(line.k),b=Number(line.b);lo=Math.max(lo,line.domain?.[0]??lo);hi=Math.min(hi,line.domain?.[1]??hi);
 if(k>0){lo=Math.max(lo,(ymin-b)/k);hi=Math.min(hi,(ymax-b)/k);}else if(k<0){lo=Math.max(lo,(ymax-b)/k);hi=Math.min(hi,(ymin-b)/k);}else if(b<ymin||b>ymax)return null;
 return lo<hi?[[lo,k*lo+b],[hi,k*hi+b]]:null;
}
const assertClip=(actual,expected,label)=>{assert.equal(!!actual,!!expected,label);if(actual)assert.ok(actual.length===2&&actual.every(p=>expected.some(e=>close(p[0],e[0])&&close(p[1],e[1]))),label);};

test('actual Astro clipping agrees with independent feasible intervals for every authored line in both views',()=>{
 let count=0;for(const pack of LOWER_PRACTICE_PACKS)for(const q of pack.questions)if(q.diagram?.kind==='function-graph')for(const solution of[false,true]){
  const d=q.diagram,state=renderState(d,solution);for(const line of state.lines){assertClip(state.clipLine(line),independentClip(line,d.bounds||[-4,4,-4,4]),q.id+'/'+line.id+'/'+solution);count++;}
 }assert.equal(count,30);
});
test('actual clipping handles horizontal, negative-slope, partially clipped and wholly outside finite domains',()=>{
 const bounds=[-4,4,-4,4],state=renderState({kind:'function-graph',bounds});
 for(const line of [{k:0,b:1},{k:0,b:5},{k:-2,b:1},{k:3,b:-10},{k:1,b:0,domain:[-5,0]},{k:0,b:1,domain:[10,20]},{k:-1,b:0,domain:[-20,-10]},{k:1,b:0,domain:[-2,2]}])assertClip(state.clipLine(line),independentClip(line,bounds),JSON.stringify(line));
 assert.equal(state.clipLine({k:0,b:1,domain:[10,20]}),null,'Outside-domain regression: never draw x=10 back to the viewport edge x=4');
});
test('actual finite endpoint pipeline retains open/closed semantics and does not invent viewport endpoints',()=>{
 const d={kind:'function-graph',bounds:[-4,4,-4,4],lines:[{id:'given',k:1,b:0,domain:[-2,3],domainClosed:[false,true]}],solutionLines:[{id:'answer',k:-1,b:0,domain:[-1,2],domainClosed:[true,false]}]};
 const student=renderState(d),teacher=renderState(d,true);assert.deepEqual(plain(student.endpoints).map(p=>[p.line.id,p.x,p.y,p.closed]),[['given',-2,-2,false],['given',3,3,true]]);assert.deepEqual(plain(teacher.endpoints).map(p=>[p.line.id,p.x,p.y,p.closed]),[['given',-2,-2,false],['given',3,3,true],['answer',-1,1,true],['answer',2,-2,false]]);assert.ok(teacher.endpoints.filter(p=>p.line.id==='answer').every(p=>p.line.isSolution));
 assert.equal(renderState({kind:'function-graph',bounds:d.bounds,lines:[{k:1,b:0,domain:[-10,10]}]}).endpoints.length,0,'Clipping a viewing window does not create closed domain endpoints');
 assert.equal(renderState({kind:'function-graph',bounds:d.bounds,lines:[{k:0,b:1,domain:[10,20]}]}).endpoints.length,0);
});
test('actual histogram bars preserve original density, unequal widths and frequency mass in SVG coordinates',()=>{
 let count=0;for(const pack of LOWER_PRACTICE_PACKS)for(const q of pack.questions)if(q.diagram?.kind==='statistics'&&q.diagram.chart==='histogram')for(const solution of[false,true]){
  const d=q.diagram,state=renderState(d,solution);for(let i=0;i<state.bins.length;i++){const bin=state.bins[i],width=bin.hi-bin.lo,height=d.height==='density'?bin.frequency/width:bin.frequency;assert.ok(close(state.heights[i],height),q.id+'/actual height');if(d.height==='density'){assert.ok(close(width*state.heights[i],bin.frequency),q.id+'/density area equals frequency');const pixelArea=(state.BX(bin.hi)-state.BX(bin.lo))*(185-state.barY(state.heights[i])),unitArea=275/(state.binMax-state.binMin)*145/state.maxValue;assert.ok(close(pixelArea/unitArea,bin.frequency),q.id+'/SVG area proportional to original frequency');}count++;}
 }assert.equal(count,12);
 const d={kind:'statistics',chart:'histogram',height:'density',bins:[{lo:0,hi:1,frequency:2},{lo:1,hi:3,frequency:4},{lo:3,hi:7,frequency:8}]},state=renderState(d);assert.deepEqual(plain(state.heights),[2,2,2]);assert.ok(state.bins.every((b,i)=>close((b.hi-b.lo)*state.heights[i],b.frequency)),'Equal heights in unequal-width bins have unequal frequencies');
});
test('student diagram state contains no solution layers while blank histogram axes remain meaningful',()=>{
 let count=0;for(const pack of LOWER_PRACTICE_PACKS)for(const q of pack.questions){const d=q.diagram;if(!d||!['function-graph','interval','statistics','data-table'].includes(d.kind))continue;const student=renderState(d),teacher=renderState(d,true);for(const key of ['lines','points','intervals','bins'])assert.ok(student[key].every(value=>!value.isSolution),q.id+'/'+key+' student privacy');assert.equal(teacher.lines.length,(d.lines?.length||0)+(d.solutionLines?.length||0));assert.equal(teacher.points.length,(d.points?.length||0)+(d.solutionPoints?.length||0));assert.equal(teacher.intervals.length,(d.intervals?.length||0)+(d.solutionIntervals?.length||0));assert.equal(teacher.bins.length,(d.bins?.length||0)+(d.solutionBins?.length||0));
  if(d.solutionBins){assert.deepEqual(plain(student.bins),[]);assert.deepEqual([student.binMin,student.binMax],d.xRange);assert.equal(student.maxValue,d.maxHeight);assert.ok(student.binTicks.includes(d.xRange[0])&&student.binTicks.includes(d.xRange[1]));assert.ok(student.barTicks.includes(0)&&student.barTicks.some(y=>y>0));assert.equal(student.density,true);}
  // This static release's four interval diagrams keep every finite endpoint inside the view.
  // Rendering arbitrary outside finite intervals is not certified by this scoped gate.
  if(d.kind==='interval')for(const value of [...d.intervals||[],...d.solutionIntervals||[]])for(const key of ['lo','hi'])if(value[key]!==null)assert.ok(value[key]>=d.min&&value[key]<=d.max,q.id+'/authored interval endpoint in bounds');count++;
 }assert.equal(count,36);
});
test('actual bin table pipeline retains half-open labels and localises authored category labels',()=>{
 const given={kind:'statistics',chart:'table',bins:[{lo:0,hi:2,frequency:4},{lo:2,hi:4,frequency:6},{lo:4,hi:6,frequency:2,hiClosed:true}]};for(const locale of ['en','zh-Hant']){const state=renderState(given,false,locale);assert.deepEqual(plain(state.tableRows),[['[0,2)',4],['[2,4)',6],['[4,6]',2]]);}
 const category=LOWER_PRACTICE_PACKS.flatMap(p=>p.questions).find(q=>q.id==='g7-statistical-surveys:guided:sector-model');assert.deepEqual(renderState(category.diagram,false,'en').tableRows.map(row=>renderState(category.diagram,false,'en').label(row[0])),['Walk','Cycle','Bus']);assert.deepEqual(renderState(category.diagram,false,'zh-Hant').tableRows.map(row=>renderState(category.diagram,false,'zh-Hant').label(row[0])),['步行','單車','巴士']);
});
test('worked histogram table shows only blanks to students and answers exclusively in the teacher layer',()=>{
 const q=LOWER_PRACTICE_PACKS.flatMap(p=>p.questions).find(q=>q.id==='g7-frequency-histograms:worked:histogram-model');
 const blanks=[['[0,2)','____','____'],['[2,4)','____','____'],['[4,6]','____','____']],answers=[['[0,2)',4,2],['[2,4)',6,3],['[4,6]',2,1]];
 assert.equal(q.diagram.kind,'data-table');assert.deepEqual(q.diagram.rows,blanks);assert.deepEqual(q.diagram.solutionRows,answers);assert.ok(!q.diagram.bins,'Requested counts are not supplied as student bin frequencies');
 for(const locale of ['en','zh-Hant']){assert.deepEqual(plain(renderState(q.diagram,false,locale).tableRows),blanks);assert.deepEqual(plain(renderState(q.diagram,true,locale).tableRows),answers);}
 const synthetic={kind:'data-table',rows:[['given','____']],solutionRows:[['given',42]]};assert.deepEqual(plain(renderState(synthetic).tableRows),[['given','____']]);assert.deepEqual(plain(renderState(synthetic,true).tableRows),[['given',42]]);
 // Evaluate the actual recursive student export function; do not manufacture an export adapter.
 const ui=fs.readFileSync(new URL('../src/scripts/guided-practice.ts',import.meta.url),'utf8'),start=ui.indexOf('export function studentDiagram'),end=ui.indexOf('export function initializeGuidedPractice');assert.ok(start>=0&&end>start);
 const exportCode=transformSync(ui.slice(start,end).replace('export function','function')+'\nglobalThis.qaStudentDiagram=studentDiagram;',{loader:'ts'}).code,context=vm.createContext({});vm.runInContext(exportCode,context);
 const saved=structuredClone(q.diagram),student=context.qaStudentDiagram(q.diagram);assert.deepEqual(plain(student.rows),blanks);assert.ok(!Object.hasOwn(student,'solutionRows'));assert.ok(!JSON.stringify(student).includes('solution'));assert.deepEqual(q.diagram,saved,'Export does not mutate the teacher source');
});
