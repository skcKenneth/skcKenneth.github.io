import test from 'node:test';
import assert from 'node:assert/strict';
import {worksheetControls,worksheetScene,normalizeWorksheetState,functionValue,rentalPieceValues,printingCosts,printingBudget} from '../src/lib/function-worksheet-models.mjs';

const ids=Array.from({length:14},(_,i)=>String(i+1).padStart(2,'0'));
const text=scene=>[scene.summary,...scene.headers,...scene.rows.flat(),...scene.facts].join(' ');
const chinese=/[\u3400-\u9fff]/u;

test('all 14 lessons produce deterministic substantive bilingual scenes with finite SVG coordinates',()=>{
  for(const id of ids) {
    const controls=worksheetControls(id);
    assert.ok(controls.length>=1);
    assert.equal(new Set(controls.map(c=>c.key)).size,controls.length);
    for(const control of controls){
      assert.ok(control.label.en&&control.label['zh-Hant']);
      assert.equal(chinese.test(control.label.en),false);
      assert.ok(['select','number','range'].includes(control.type));
      if(control.type==='select')assert.ok(control.options.some(o=>o.value===control.value));
    }
    const en=worksheetScene(id),zh=worksheetScene(`senior:function-worksheet:${id}`,{},'zh-Hant');
    assert.deepEqual(en,worksheetScene(id));
    assert.ok(en.svg.length>1000,`substantive scene ${id}`);
    assert.match(en.svg,/<(?:path|circle|line)\b/);
    assert.doesNotMatch(en.svg,/NaN|Infinity/);
    assert.ok(en.summary&&en.headers.length&&en.rows.length&&en.facts.length);
    assert.equal(chinese.test(text(en)+en.svg),false,`English scene ${id}`);
    assert.ok(chinese.test(text(zh)),`Chinese scene ${id}`);
    assert.equal(en.svg.includes('<script'),false);
  }
});

test('all selectable branches have complete local-language scenes and safe coordinates',()=>{
  for(const id of ids)for(const control of worksheetControls(id).filter(c=>c.type==='select'))for(const option of control.options) {
    assert.equal(chinese.test(option.label.en),false);
    const scene=worksheetScene(id,{[control.key]:option.value});
    assert.ok(scene.svg&&scene.summary&&scene.rows.length&&scene.facts.length);
    assert.equal(chinese.test(text(scene)+scene.svg),false,`${id}.${control.key}.${option.value}`);
    assert.doesNotMatch(scene.svg,/(?:cx|cy|x|y|x1|x2|y1|y2)="(?:NaN|Infinity|undefined)"/);
    assert.doesNotMatch(scene.svg,/d="[^"]*(?:NaN|Infinity|undefined)/);
  }
});

test('raw state is bounded and validated without accepting code, unknown options or malformed counts',()=>{
  assert.equal(normalizeWorksheetState('14',{n:2.8}).n,3);
  assert.equal(normalizeWorksheetState('14',{n:1000}).n,80);
  assert.equal(normalizeWorksheetState('14',{n:-10}).n,1);
  assert.equal(normalizeWorksheetState('14',{n:Infinity}).n,10);
  assert.equal(normalizeWorksheetState('14',{n:''}).n,10);
  assert.equal(normalizeWorksheetState('01',{pattern:'<script>alert(1)</script>'}).pattern,'bijective');
  assert.deepEqual(worksheetScene('01',{pattern:'<script>alert(1)</script>'}),worksheetScene('01'));
  assert.throws(()=>worksheetScene('15'),RangeError);
  assert.throws(()=>functionValue('arbitrary-expression',1),RangeError);
});

test('conditional controls are explicit and inactive values cannot change a new scene',()=>{
  const conditional=(id,key)=>worksheetControls(id).find(c=>c.key===key).when;
  assert.deepEqual(conditional('03','kind'),{key:'rule',values:['interval']});
  assert.deepEqual(conditional('08','left'),{key:'rule',values:['line']});
  assert.deepEqual(conditional('14','n'),{key:'context',values:['printing']});
  assert.deepEqual(conditional('14','t'),{key:'context',values:['rental']});
  assert.deepEqual(conditional('14','budget'),{key:'context',values:['printing']});
  assert.equal(normalizeWorksheetState('03',{rule:'sqrt',kind:'integer'}).kind,'continuous');
  assert.equal(worksheetScene('03',{rule:'sqrt',kind:'integer',x:3.5}).rows[0][1],'Allowed');
  assert.equal(normalizeWorksheetState('14',{context:'rental',n:80,budget:'240'}).n,10);
  assert.equal(normalizeWorksheetState('14',{context:'rental',n:80,budget:'240'}).budget,'200');
  assert.doesNotMatch(worksheetScene('14',{context:'rental'}).svg,/Budget/);
});

test('function definition counts distinct outputs and allows many inputs to share an output',()=>{
  assert.match(worksheetScene('01',{pattern:'many'}).facts[0],/This is a function/);
  assert.match(worksheetScene('01',{pattern:'missing'}).facts[0],/not a function/);
  assert.match(worksheetScene('01',{pattern:'multiple'}).facts[0],/not a function/);
  assert.equal(worksheetScene('01',{pattern:'many'}).rows[1][1],'1');
});

test('domain membership precedes calculation, including finite and continuous domains',()=>{
  assert.deepEqual(functionValue('square-plus',3,'finite'),{valid:false,value:null});
  assert.deepEqual(functionValue('square-plus',.5,'finite'),{valid:false,value:null});
  assert.deepEqual(functionValue('square-plus',.5,'interval'),{valid:true,value:1.25});
  assert.match(worksheetScene('02').summary,/Not allowed/);
  assert.match(worksheetScene('02').facts[0],/= 10/);
  assert.match(worksheetScene('02',{domain:'finite'}).facts[1],/\{1, 2, 5\}/);
  assert.match(worksheetScene('02',{domain:'continuous'}).facts[1],/\[1, 5\]/);
});

test('interval endpoints, integer restriction, denominator and radical have correct boundaries',()=>{
  assert.equal(worksheetScene('03',{x:0,left:'open'}).rows[0][1],'Not allowed');
  assert.equal(worksheetScene('03',{x:0,left:'closed'}).rows[0][1],'Allowed');
  assert.equal(worksheetScene('03',{x:4,right:'open'}).rows[0][1],'Not allowed');
  assert.equal(worksheetScene('03',{x:4,right:'closed'}).rows[0][1],'Allowed');
  assert.equal(worksheetScene('03',{x:2.5,kind:'integer'}).rows[0][1],'Not allowed');
  assert.equal(worksheetScene('03',{rule:'reciprocal',x:2}).rows[0][1],'Not allowed');
  assert.equal(worksheetScene('03',{rule:'sqrt',x:3}).rows[0][1],'Allowed');
  assert.equal(worksheetScene('03',{rule:'sqrt',x:2.5}).rows[0][1],'Not allowed');
});

test('combined restrictions preserve the original hole and distinguish finite from interval ranges',()=>{
  assert.deepEqual(functionValue('combined',-1),{valid:true,value:0});
  assert.equal(functionValue('combined',-1.001).valid,false);
  assert.equal(functionValue('combined',2).valid,false);
  assert.equal(functionValue('inverse-root',1).valid,false);
  assert.equal(functionValue('inverse-root',2).value,1);
  assert.equal(functionValue('hole',1).valid,false);
  assert.equal(functionValue('hole',2).value,3);
  const hole=worksheetScene('04',{rule:'hole',x:1});
  assert.match(hole.rows[0][1],/Undefined/);
  assert.match(hole.svg,/fill="#f6faf6" stroke="#b63b43"/);
  assert.equal((hole.svg.match(/data-plot-segment=/g)||[]).length,2);
  assert.equal((worksheetScene('04',{rule:'combined'}).svg.match(/data-plot-segment=/g)||[]).length,2);
  assert.match(worksheetScene('04',{rule:'range-finite'}).facts[0],/\{0, 1, 4\}/);
  assert.match(worksheetScene('04',{rule:'range-interval'}).facts[0],/\[0, 4\]/);
});

test('discrete items never connect graph points and reject fractional item input',()=>{
  const discrete=worksheetScene('05',{kind:'integer',x:2.5});
  assert.match(discrete.facts[0],/Not allowed/);
  assert.doesNotMatch(discrete.svg,/data-plot-segment=/);
  assert.match(worksheetScene('05',{kind:'continuous',x:2.5}).facts[0],/Allowed/);
  assert.match(discrete.facts[1],/linear relationship is assumed/);
});

test('piecewise rental handles zero, split point, last point, gaps, conflicts and redundant equal values',()=>{
  assert.deepEqual(rentalPieceValues(0),[]);
  assert.deepEqual(rentalPieceValues(1),[6]);
  assert.deepEqual(rentalPieceValues(4),[18]);
  assert.deepEqual(rentalPieceValues(1,'gap'),[]);
  assert.deepEqual(rentalPieceValues(1.25,'conflict'),[6,7]);
  assert.deepEqual(rentalPieceValues(1,'redundant'),[6,6]);
  assert.match(worksheetScene('06',{mode:'redundant'}).facts[0],/defines a function/);
  assert.match(worksheetScene('06',{mode:'redundant'}).summary,/1 distinct output/);
  assert.match(worksheetScene('06',{mode:'gap'}).facts[0],/fails to define/);
  assert.match(worksheetScene('06',{mode:'conflict',x:1.25}).summary,/2 distinct/);
  for(const mode of ['correct','conflict','redundant'])assert.match(worksheetScene('06',{mode,x:2}).svg,/<g data-boundary="rental-1" data-included="true"><circle[^>]+fill="#27866c"/);
  assert.match(worksheetScene('06',{mode:'gap',x:2}).svg,/<g data-boundary="rental-1" data-included="false"><circle[^>]+fill="#f6faf6"/);
});

test('composition exposes intermediate values and checks square-root entry domains',()=>{
  const scene=worksheetScene('07',{x:2});
  assert.deepEqual(scene.rows,[['× 2 → + 3','4','7'],['+ 3 → × 2','5','10']]);
  const root=worksheetScene('07',{rule:'sqrt',x:.5});
  assert.equal(root.rows[0][1],'-0.5');
  assert.equal(root.rows[0][2],'undefined');
  assert.equal(root.rows[1][2],'-0.2929');
});

test('extrema distinguish approaching a boundary from attaining an extremum',()=>{
  const open=worksheetScene('08',{rule:'line',left:'open',right:'open'});
  assert.match(open.facts[0],/No minimum/);
  assert.match(open.facts[1],/No maximum/);
  const closed=worksheetScene('08',{rule:'line',left:'closed',right:'closed'});
  assert.match(closed.facts[0],/Minimum 0 is attained/);
  assert.match(closed.facts[1],/Maximum 2 is attained/);
  assert.match(worksheetScene('08').facts[1],/maximum 5 at t = 2/);
  assert.match(worksheetScene('08',{rule:'quadratic'}).facts[1],/maximum 10 at x = 5/);
});

test('monotonicity provides a whole-domain counterexample without joining across zero',()=>{
  const scene=worksheetScene('09',{rule:'reciprocal-whole',x1:-1,x2:1});
  assert.deepEqual(scene.rows,[[-1,1,'-1','1','2']]);
  assert.equal((scene.svg.match(/data-plot-segment=/g)||[]).length,2);
  assert.match(scene.facts[1],/not decreasing on its whole domain/);
  assert.match(worksheetScene('09',{rule:'quadratic',x1:1,x2:2}).facts[0],/arbitrary/);
  assert.match(worksheetScene('09',{rule:'reciprocal-positive',x1:-1,x2:1}).summary,/Choose distinct/);
  assert.match(worksheetScene('09',{x1:2,x2:2}).summary,/Choose distinct/);
});

test('parity requires a symmetric domain and the zero function is both odd and even',()=>{
  assert.match(worksheetScene('10',{rule:'square'}).summary,/Even/);
  assert.match(worksheetScene('10',{rule:'square',domain:'restricted'}).summary,/Neither odd nor even/);
  assert.match(worksheetScene('10',{rule:'zero'}).summary,/Both odd and even/);
  assert.match(worksheetScene('10',{rule:'zero',domain:'restricted'}).summary,/Neither odd nor even/);
  assert.match(worksheetScene('10',{rule:'shift'}).summary,/Neither odd nor even/);
  assert.match(worksheetScene('10',{rule:'reciprocal'}).summary,/Odd/);
  assert.equal(worksheetScene('10',{rule:'reciprocal',x:0}).rows[0][1],'Undefined for this domain');
});

test('basic power functions keep natural domains and reciprocal discontinuity',()=>{
  assert.equal(functionValue('sqrt',-1).valid,false);
  assert.deepEqual(functionValue('sqrt',0),{valid:true,value:0});
  assert.equal(functionValue('reciprocal',0).valid,false);
  assert.equal((worksheetScene('11',{rule:'reciprocal'}).svg.match(/data-plot-segment=/g)||[]).length,2);
  assert.match(worksheetScene('11',{rule:'sqrt'}).summary,/\[0, ∞\)/);
});

test('comparison reverses across one and includes the equality case',()=>{
  assert.equal(worksheetScene('12',{x:.5}).rows[0][3],'x² > x³');
  assert.equal(worksheetScene('12',{x:1}).rows[0][3],'x² = x³');
  assert.equal(worksheetScene('12',{x:2}).rows[0][3],'x² < x³');
  assert.match(worksheetScene('12',{mode:'same'}).facts[0],/positive inputs/);
});

test('discount eligibility uses original price and substitution recovers the whole input',()=>{
  assert.equal(worksheetScene('13',{x:95}).rows[0][1],'ineligible');
  const eligible=worksheetScene('13',{x:100});
  assert.deepEqual(eligible.rows.map(r=>r[1]),['70','72']);
  assert.match(eligible.facts[0],/original price once/);
  const substitution=worksheetScene('13',{rule:'substitution',x:5});
  assert.deepEqual(substitution.rows,[[5,11,35,35]]);
  assert.match(substitution.facts[0],/every real u/);
});

test('printing has exactly two crossovers, integer input and correct 200 budget maxima',()=>{
  assert.equal(printingCosts(2.5),null);
  assert.equal(printingCosts(0),null);
  assert.equal(printingCosts(81),null);
  const ties=[];
  for(let n=1;n<=80;n++){const c=printingCosts(n);if(c.P===c.Q)ties.push(n);}
  assert.deepEqual(ties,[10,40]);
  assert.deepEqual(printingCosts(20),{P:80,Q:100});
  assert.deepEqual(printingCosts(21),{P:83,Q:102});
  assert.deepEqual(printingBudget(200),{P:60,Q:70});
  assert.ok(printingCosts(61).P>200);
  assert.ok(printingCosts(71).Q>200);
  const scene=worksheetScene('14',{context:'printing',budget:'200'});
  assert.doesNotMatch(scene.svg,/data-plot-segment=/);
  assert.match(scene.facts[2],/P allows at most 60 booklets; Q allows at most 70/);
});

test('rental plans meet at 20 hours and 320 with zero excluded',()=>{
  const scene=worksheetScene('14',{context:'rental',t:20});
  assert.deepEqual(scene.rows[0],[20,'320','320','0']);
  assert.deepEqual(worksheetScene('14',{context:'rental',t:0}).rows[0],[0,'Undefined','Undefined','Undefined']);
  assert.deepEqual(worksheetScene('14',{context:'rental',t:40}).rows[0],[40,'640','520','120']);
  assert.match(scene.facts[0],/0 < t ≤ 40/);
});

test('decision tables and captured summaries use consistent signed cost differences',()=>{
  for(const [n,delta]of [[10,0],[20,-20],[40,0],[41,1]]){
    const scene=worksheetScene('14',{context:'printing',n});
    const current=scene.rows.at(-1),costs=printingCosts(n);
    assert.deepEqual(current,[n,costs.P,costs.Q,delta]);
    assert.equal(scene.headers.at(-1),'P − Q');
    assert.ok(scene.summary.includes(`n = ${n}: P = ${costs.P}, Q = ${costs.Q}; P − Q = ${delta}.`));
  }
  for(const [t,delta]of [[10,-60],[20,0],[30,60]]){
    const scene=worksheetScene('14',{context:'rental',t});
    assert.equal(scene.rows[0].at(-1),String(delta));
    assert.equal(scene.headers.at(-1),'A − B');
    assert.ok(scene.summary.includes(`t = ${t}: A = ${16*t}, B = ${120+10*t}; A − B = ${delta}.`));
  }
  const zh=worksheetScene('14',{context:'printing',n:41},'zh-Hant');
  assert.ok(zh.summary.includes('甲 = 143，乙 = 142；甲 − 乙 = 1'));
});
