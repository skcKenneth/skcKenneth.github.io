import test from 'node:test';
import assert from 'node:assert/strict';
import {ids,create,reduce,render,check} from '../src/lib/function-hands-on-foundations.mjs';

const act=(id,s,key)=>reduce(id,s,{type:'action',id:key});
const preset=(id,s,key,value)=>reduce(id,s,{type:'preset',id:key,value});
const drag=(id,s,key,x,y=300,phase='move',zone)=>reduce(id,s,{type:'drag',id:key,x,y,phase,zone});
const drop=(id,s,key,zone)=>drag(id,s,key,480,250,'end',zone);
const X03=x=>100+(x+2)/8*760;
const X04=x=>100+(x+3)/8*760;
const X06=x=>100+x/4*760;
function freeze(value){Object.freeze(value);for(const v of Object.values(value))if(v&&typeof v==='object')freeze(v);return value;}

test('all foundation scenes expose safe localized rendering and immutable state transitions',()=>{
 assert.deepEqual(ids,['01','02','03','04','05','06']);
 for(const id of ids){
  const state=freeze(create(id)),before=JSON.stringify(state);
  for(const locale of ['en','zh-Hant']){
   const r=render(id,state,locale);
   for(const key of ['title','task','summary','svg'])assert.equal(typeof r[key],'string',`${id}: ${key}`);
   assert(r.headers.every(v=>typeof v==='string'));
   assert(r.rows.every(row=>row.every(v=>typeof v==='string')));
   for(const handle of r.handles){assert(Number.isFinite(handle.x)&&Number.isFinite(handle.y));assert.equal(typeof handle.label,'string');}
   for(const list of [r.zones,r.buttons,r.choices,r.claims])for(const item of list)assert.equal(typeof item.label,'string');
   assert(!/NaN|Infinity|<script|onpointer|onclick/.test(r.svg));
   assert(!/does not define a function|fails to define|this is a function/i.test(r.summary));
   assert(['success','revise','notice'].includes(check(id,state,'function',locale).status));
  }
  assert.equal(reduce(id,state,{type:'drag',id:'unknown',x:NaN,y:200,phase:'move'}),state);
  assert.equal(reduce(id,state,{type:'drag',id:'unknown',x:200,y:Infinity,phase:'end'}),state);
  assert.equal(reduce(id,state,{type:'action',id:'unknown'}),state);
  assert.equal(reduce(id,state,{type:'drag',id:42,x:480,y:250,phase:'end',zone:'common-axis'}),state,'numeric action IDs are rejected');
  assert.equal(reduce(id,state,{type:'action',id:42}),state);
  assert.equal(JSON.stringify(state),before);
 }
 assert.throws(()=>create('15'),RangeError);
});

test('01 malformed persisted links fall back safely and malformed edges are discarded',()=>{
 const broken={...create('01'),links:null},before=JSON.stringify(broken);
 assert.deepEqual(render('01',broken).rows,[['1','{5}','1'],['2','{5}','1'],['3','{7}','1']]);
 assert.equal(check('01',broken,'function').status,'success');
 assert.equal(JSON.stringify(broken),before,'normalization does not mutate persisted input');
 const malformed={...create('01'),links:[[1,5],[1,5],null,[2,999],['3',7],[3,7],42]};
 assert.deepEqual(render('01',malformed).rows,[['1','{5}','1'],['2','{}','0'],['3','{7}','1']]);
 assert.equal(check('01',malformed,'not-function').status,'success');
});

test('01 changes actual arrows, prevents duplicate outputs, reconnects and removes',()=>{
 const source=freeze(create('01'));
 assert.equal(check('01',source,'function').status,'success');
 assert.equal(drop('01',source,'new-1','output-5'),source,'a duplicate arrow is not another output');
 let s=drop('01',source,'edge-3-7','remove');
 assert.deepEqual(s.links,[[1,5],[2,5]]);
 assert.equal(check('01',s,'function').status,'revise');
 assert.equal(check('01',s,'not-function').status,'success');
 s=drop('01',s,'new-3','output-7');
 s=drop('01',s,'new-2','output-7');
 assert.deepEqual(render('01',s).rows[1],['2','{5, 7}','2']);
 assert.equal(check('01',s,'not-function').status,'success');
 s=drop('01',s,'edge-2-5','output-7');
 assert.deepEqual(render('01',s).rows[1],['2','{7}','1']);
 assert.equal(check('01',s,'function').status,'success');
 assert.equal(drop('01',s,'edge-1-5','outside'),s);
 assert.equal(drop('01',s,'edge-1-5','output-999'),s);
 assert.equal(drag('01',s,'new-1',760,350,'move','output-7'),s,'wire effects happen on release');
 assert.deepEqual(source.links,[[1,5],[2,5],[3,7]],'source was not mutated');
 const constant=preset('01',s,'pattern','constant');
 assert.match(render('01',constant).summary,/B = \{6, 8, 10\}; attained range = \{8\}/);
 assert.equal(check('01',constant,'function').status,'success');
});

test('02 distinguishes formula arithmetic from domain-aware output on both boards',()=>{
 let s=create('02');
 s=drop('02',s,'chip-3','finite'); // 0.5
 assert.deepEqual(render('02',s).rows[0],['{-2, -1, 0, 1, 2}','0.5','rejected','1.25','—']);
 s=drop('02',s,'chip-3','other');
 assert.deepEqual(render('02',s).rows[0],['[−2, 2]','0.5','allowed','1.25','1.25']);
 s=drop('02',s,'chip-6','other'); // 3
 assert.deepEqual(render('02',s).rows[1],['[−2, 2]','3','rejected','10','—']);
 assert.equal(check('02',s,'same').status,'revise');
 assert.equal(check('02',s,'different').status,'success');
 s=preset('02',s,'model','paper');
 s=drop('02',s,'chip-0','finite'); // -1
 assert.equal(render('02',s).rows[0].at(-1),'1');
 s=drop('02',s,'chip-0','other');
 assert.equal(render('02',s).rows[0].at(-1),'—');
 assert.match(check('02',s,'different').lines[0],/−?\-?1/);
 assert.match(render('02',s).summary,/First range: \{0, 1\}. Second range: \{0, 1\}/);
});

test('03 paints real intervals with continuous endpoints, boundary toggles and probe membership',()=>{
 let s=create('03');
 assert.equal(check('03',s).status,'success');
 assert.match(render('03',s).summary,/Painted set: \[0, 4\)\./,'contiguous intervals use canonical brackets');
 s=drag('03',s,'left',X03(1));
 assert.equal(s.left,1);assert.equal(s.right,4);assert.equal(s.custom,true);
 assert.equal(check('03',s).status,'revise');
 s=drag('03',s,'probe',X03(1));
 assert.deepEqual(render('03',s).rows[0],['1','yes','yes']);
 s=act('03',s,'toggle-left');
 assert.deepEqual(render('03',s).rows[0],['1','no','yes']);
 s=drop('03',s,'paint','paint-0');
 s=drag('03',s,'probe',X03(0));
 assert.equal(render('03',s).rows[0][1],'yes','painting a region changes membership');
 s=reduce('03',s,{type:'paint',x1:X03(2),x2:X03(3.5),y1:220,y2:220});
 assert.equal(s.left,2);assert.equal(s.right,3.5);assert.deepEqual(s.regions,[false,true,false]);
 s=drag('03',s,'left',X03(6));
 assert.equal(s.left,s.right,'endpoints do not invert');
 s=drag('03',s,'right',X03(-2));
 assert(Number.isFinite(s.right));
 s=drag('03',s,'left',X03(-2));s=drag('03',s,'right',X03(-2));s=drag('03',s,'left',X03(-2));
 assert.equal(s.left,-2);assert.equal(s.right,-2,'zero-length intervals stay finite');
});

test('03 canonical brackets preserve excluded holes, merged regions and isolated endpoints',()=>{
 let s=create('03');
 s=act('03',s,'toggle-right');
 assert.match(render('03',s).summary,/Painted set: \[0, 4\]\./);
 s=act('03',s,'toggle-left');
 assert.match(render('03',s).summary,/Painted set: \(0, 4\]\./);
 s=act('03',s,'region-0');
 assert.match(render('03',s).summary,/Painted set: \(−∞, 0\) ∪ \(0, 4\]\./,'an excluded interior endpoint is a hole');
 s=act('03',s,'toggle-left');
 assert.match(render('03',s).summary,/Painted set: \(−∞, 4\]\./,'an included shared endpoint merges adjacent regions');
 s=create('03');s=act('03',s,'region-1');s=act('03',s,'toggle-right');
 assert.match(render('03',s).summary,/Painted set: \{0\} ∪ \{4\}\./,'isolated endpoints remain finite sets');
});

test('03 reciprocal and square-root presets keep exact exclusions, inclusion and unrestricted real sides',()=>{
 let s=preset('03',create('03'),'rule','reciprocal');
 s=drag('03',s,'probe',X03(2));
 assert.deepEqual(render('03',s).rows[0],['2','no','no']);
 assert.equal(check('03',s).status,'success');
 s=act('03',s,'toggle-left');assert.equal(check('03',s).status,'revise');
 s=preset('03',s,'rule','sqrt');s=drag('03',s,'probe',X03(3));
 assert.deepEqual(render('03',s).rows[0],['3','yes','yes']);
 assert.equal(check('03',s).status,'success');
 s=act('03',s,'toggle-integer');s=drag('03',s,'probe',X03(3.5));
 assert.deepEqual(render('03',s).rows[0],['3.5','no','yes']);
 assert.equal(check('03',s).status,'revise','the source natural domain includes non-integers');
});

test('03 integer-only painting never fills a noninteger boundary guide',()=>{
 let s=drag('03',create('03'),'left',X03(.25));
 s=act('03',s,'toggle-integer');s=drag('03',s,'probe',X03(.25));
 const scene=render('03',s);
 assert.equal(scene.rows[0][1],'no');
 const marker=scene.svg.match(/<circle cx="313\.75" cy="275"[^>]*fill="([^"]+)"/);
 assert(marker,'the draggable noninteger boundary remains a visible guide');
 assert.equal(marker[1],'#faf8f1','the excluded noninteger guide is hollow');
 s=drag('03',s,'left',X03(1));
 assert.equal(render('03',s).rows[0][1],'no'); // probe still at 0.25
 s=drag('03',s,'probe',X03(1));assert.equal(render('03',s).rows[0][1],'yes');
});

test('04 requires the intersection of original masks and retains the canceled hole',()=>{
 let s=create('04');
 assert.equal(check('04',s).status,'revise');
 s=drop('04',s,'mask-root','common-axis');
 assert.equal(check('04',s).status,'revise');
 s=drop('04',s,'mask-denominator','common-axis');
 assert.equal(check('04',s).status,'success');
 assert.deepEqual(render('04',s).rows[0],['2','rejected','undefined']);
 s=drag('04',s,'probe',X04(-1));
 assert.deepEqual(render('04',s).rows[0],['-1','accepted','0']);
 s=drop('04',s,'mask-root','mask-tray');
 assert.equal(check('04',s).status,'revise');
 s=preset('04',s,'mode','inverse-root');
 s=drop('04',s,'mask-root','common-axis');s=drop('04',s,'mask-denominator','common-axis');
 s=drag('04',s,'probe',X04(1));
 assert.deepEqual(render('04',s).rows[0],['1','rejected','undefined']);
 assert.equal(check('04',s).status,'success');
 s=preset('04',s,'mode','hole');s=drop('04',s,'mask-denominator','common-axis');
 s=drag('04',s,'probe',X04(1));s=act('04',s,'simplify');
 assert.deepEqual(render('04',s).rows[0],['1','rejected','undefined','2']);
 assert.match(render('04',s).summary,/retaining original exclusion/);
 assert.equal(check('04',s).status,'success');
});

test('04 range modes separate a finite output set from every attainable interval output',()=>{
 let s=preset('04',create('04'),'mode','range-finite');
 assert.equal(check('04',s).status,'success');
 s=drop('04',s,'output-2','range-set');assert.equal(check('04',s).status,'revise');
 s=drop('04',s,'output-2','range-tray');assert.equal(check('04',s).status,'success');
 s=act('04',s,'connect');assert.equal(check('04',s).status,'revise');
 s=drag('04',s,'probe',X04(.5));assert.equal(render('04',s).rows[0].at(-1),'—');
 s=preset('04',s,'mode','range-interval');
 assert.equal(check('04',s).status,'success');
 s=drag('04',s,'probe',X04(.5));assert.equal(render('04',s).rows[0].at(-1),'0.25');
 s=drag('04',s,'range-low',800,307);assert.equal(s.rangeLo,1);assert.equal(check('04',s).status,'revise');
 assert.match(check('04',s).lines[1],/every y in \[0, 4\]/,'range check includes a full attainability argument');
});

test('05 the fixed table survives misplaced learner points and connection choice follows the domain',()=>{
 let s=create('05'),sourceRows=render('05',s).rows.map(r=>r.slice(0,2));
 s=drag('05',s,'point-2',120+2*175,385-7/14*310);
 assert.deepEqual(s.points[2],[2,7]);
 assert.deepEqual(render('05',s).rows.map(r=>r.slice(0,2)),sourceRows,'learner placement never rewrites the given data');
 assert.equal(check('05',s).status,'revise');
 for(let i=0;i<=4;i++)s=drag('05',s,`point-${i}`,120+i*175,385-(2*i+4)/14*310);
 assert.deepEqual(s.points,[[0,4],[1,6],[2,8],[3,10],[4,12]]);
 assert.equal(check('05',s).status,'revise','continuous model still needs joining');
 s=act('05',s,'connect');assert.equal(check('05',s).status,'success');
 assert.equal(render('05',s).rows.at(-1)[1],'9');
 s=preset('05',s,'kind','integer');
 assert.equal(render('05',s).rows.at(-1)[1],'undefined');
 assert.equal(check('05',s).status,'revise');
 s=act('05',s,'connect');assert.equal(check('05',s).status,'success');
 assert.equal(drag('05',s,'point-2',900,490,'end'),s,'an outside drop does not alter a point');
});

test('05 every unplaced point can enter the graph with its first keyboard nudge',()=>{
 for(let i=0;i<=4;i++){
  const source=create('05'),h=render('05',source).handles.find(h=>h.id===`point-${i}`);
  assert.equal(source.points[i],null);assert.equal(h.shortLabel,`${i+1}?`);
  const placed=drag('05',source,h.id,h.x,h.y-h.nudge.y);
  assert.deepEqual(placed.points[i],[i,.5],'one up-arrow creates a valid learner point');
  assert.equal(render('05',placed).rows[i][1],String(2*i+4),'keyboard placement preserves fixed source data');
  assert.equal(drag('05',source,h.id,900,490,'end'),source,'arbitrary outside pointer drops remain ignored');
 }
});

test('06 same-valued overlap has one distinct output while paper boundary overlap has two',()=>{
 let s=create('06');
 assert.equal(check('06',s,'function').status,'success');
 s=act('06',s,'toggle-second');
 assert.deepEqual(render('06',s).rows[0],['1','6, 6','{6}','1']);
 assert.equal(check('06',s,'function').status,'success');
 s=act('06',s,'toggle-first');s=act('06',s,'toggle-second');
 assert.deepEqual(render('06',s).rows[0],['1','—','{}','0']);
 assert.equal(check('06',s,'not-function').status,'success');
 s=preset('06',s,'model','paper');
 assert.equal(check('06',s,'function').status,'success','a jump is allowed');
 s=act('06',s,'toggle-first');
 assert.deepEqual(render('06',s).rows[0],['0','2, 0','{0, 2}','2']);
 assert.equal(check('06',s,'not-function').status,'success');
});

test('06 boundaries move independently and whole-domain checks find gaps and conflicts away from the probe',()=>{
 let s=create('06');
 s=drag('06',s,'first-end',X06(1.5));
 assert.equal(s.firstEnd,1.5);assert.equal(s.secondStart,1);
 s=drag('06',s,'probe',X06(3)); // one output at the probe, but conflict elsewhere
 assert.equal(render('06',s).rows.find(r=>r[0]==='3').at(-1),'1');
 assert.equal(check('06',s,'function').status,'revise');
 assert.match(check('06',s,'not-function').lines[0],/At 1.25.*\{6, 7\}/);
 s=drag('06',s,'second-start',X06(2));
 assert.equal(s.firstEnd,1.5);assert.equal(s.secondStart,2);
 assert.match(check('06',s,'not-function').lines[0],/At 1.75, no branch/);
 s=drag('06',s,'first-end',X06(0));s=drag('06',s,'second-start',X06(0));
 assert.equal(check('06',s,'function').status,'success','0 is outside the fixed rental domain');
 s=drag('06',s,'probe',X06(0));
 assert.deepEqual(render('06',s).rows[0],['0','—','{}','0']);
});

test('06 equality of the paper formulas at a moved boundary remains valid',()=>{
 let s=preset('06',create('06'),'model','paper');
 s=drag('06',s,'first-end',860);s=drag('06',s,'second-start',860);s=act('06',s,'toggle-first');
 s=drag('06',s,'probe',860);
 assert.deepEqual(render('06',s).rows[0],['2','4, 4','{4}','1']);
 assert.equal(check('06',s,'function').status,'success');
});
