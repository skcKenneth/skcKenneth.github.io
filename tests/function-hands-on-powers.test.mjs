import test from 'node:test';
import assert from 'node:assert/strict';
import {ids,create,reduce,render,check} from '../src/lib/function-hands-on-powers.mjs';

const move=(id,state,handle,x,y=400)=>reduce(id,state,{type:'drag',id:handle,x,y,phase:'move'});
const drop=(id,state,handle,zone)=>reduce(id,state,{type:'drag',id:handle,zone,x:480,y:470,phase:'end'});
const preset=(id,state,key,value)=>reduce(id,state,{type:'preset',id:key,value});
const baseX=x=>80+(x-.1)/2.9*800;
const probeX=x=>80+(x+3)/6*800;
const quantityX=n=>80+(n-1)/79*800;
const budgetY=b=>350-b/330*280;

test('all family scenes produce localized pure render data and safe finite handles',()=>{
  assert.deepEqual(ids,['11','12','13','14']);
  for(const id of ids){
    const state=create(id),before=JSON.stringify(state),en=render(id,state),zh=render(id,state,'zh-Hant');
    assert.equal(JSON.stringify(state),before);assert.notEqual(en.title,zh.title);assert.notEqual(en.task,zh.task);
    for(const scene of [en,zh]){
      for(const key of ['title','task','svg','summary'])assert.equal(typeof scene[key],'string');
      for(const row of scene.rows)for(const value of row)assert.equal(typeof value,'string');
      for(const handle of scene.handles){assert.ok(Number.isFinite(handle.x)&&Number.isFinite(handle.y));assert.ok(handle.x>=0&&handle.x<=960&&handle.y>=0&&handle.y<=540);assert.equal(typeof handle.label,'string');}
      assert.doesNotMatch(scene.svg,/<script|on(?:click|pointer|key)\w*=/i);
      assert.doesNotMatch(scene.summary,/cheaper|correct|winner|較便宜|正確|勝出/i);
    }
  }
  assert.throws(()=>create('99'),RangeError);
});

test('curve cards match independently; occupied formula targets displace rather than duplicate',()=>{
  let state=create('11');const initial=state;
  assert.equal(reduce('11',state,{type:'drag',id:'curve-A',zone:'formula-square',x:300,y:330,phase:'move'}),state);
  state=drop('11',state,'curve-A','formula-square');assert.equal(state.matches.A,'square');assert.equal(initial.matches.A,null);
  state=drop('11',state,'curve-B','formula-square');assert.equal(state.matches.A,null);assert.equal(state.matches.B,'square');
  const outside=drop('11',state,'curve-B','unknown-zone');assert.equal(outside,state);
  state=drop('11',state,'curve-B','bank');assert.equal(state.matches.B,null);
  for(const [card,rule]of [['A','square'],['B','reciprocal'],['C','linear'],['D','sqrt'],['E','cube']])state=drop('11',state,`curve-${card}`,`formula-${rule}`);
  assert.equal(check('11',state).status,'success');
  state=drop('11',state,'curve-A','formula-cube');assert.equal(check('11',state).status,'revise');
});

test('both probes expose the square-root boundary and reciprocal hole without formula evaluation',()=>{
  let state=create('11');
  state=move('11',state,'x',probeX(0));state=move('11',state,'other',probeX(-1));
  const rows=Object.fromEntries(render('11',state).rows.map(row=>[row[0],row]));
  assert.deepEqual(rows.A.slice(1,3),['0','1']);
  assert.deepEqual(rows.B.slice(1,3),['undefined','-1']);
  assert.deepEqual(rows.C.slice(1,3),['0','-1']);
  assert.deepEqual(rows.D.slice(1,3),['0','undefined']);
  assert.deepEqual(rows.E.slice(1,3),['0','-1']);
  state=move('11',state,'x',9999);assert.equal(state.x,3);
});

test('positive-base drag crosses exact one and checks the student placement in all three regions',()=>{
  let state=create('12');
  state=drop('12',state,'value-first','greater');state=drop('12',state,'value-second','less');
  assert.equal(check('12',state).status,'success'); // 0.25 > 0.125
  state=move('12',state,'x',baseX(1));assert.equal(state.x,1);
  assert.equal(check('12',state).status,'revise'); // retained student prediction
  state=drop('12',state,'value-first','equal');state=drop('12',state,'value-second','equal');
  assert.equal(check('12',state).status,'success');
  state=move('12',state,'x',baseX(2));assert.equal(state.x,2);
  state=drop('12',state,'value-first','less');state=drop('12',state,'value-second','greater');
  assert.equal(check('12',state).status,'success');assert.deepEqual(render('12',state).rows,[['2','4','8','-4']]);
  state=move('12',state,'x',-1000);assert.equal(state.x,.1);
});

test('same-power mode retains two independent positive inputs and requires ordering both cards',()=>{
  let state=preset('12',create('12'),'mode','same');
  assert.equal(check('12',state).status,'notice');
  state=move('12',state,'x',baseX(2.4));state=move('12',state,'other',baseX(2.1));
  state=drop('12',state,'value-first','greater');state=drop('12',state,'value-second','less');
  assert.equal(check('12',state).status,'success');assert.deepEqual(render('12',state).rows,[['2.4','5.76','2.1','4.41']]);
  state=drop('12',state,'value-second','bank');assert.equal(check('12',state).status,'notice');
});

test('discount order uses original-price eligibility once, including original price exactly 100',()=>{
  let state=create('13');
  state=drop('13',state,'subtract','slot-1');state=drop('13',state,'discount','slot-2');
  assert.equal(check('13',state).status,'revise');assert.deepEqual(render('13',state).rows[0],['Student order','80','72']);
  state=drop('13',state,'discount','slot-1'); // swap the two occupied operation slots
  assert.deepEqual(state.discountOrder,['discount','subtract']);
  assert.deepEqual(render('13',state).rows[0],['Student order','90','70']);
  assert.equal(check('13',state).status,'success'); // intermediate 90 remains eligible
  state=move('13',state,'input',80+95/300*800);
  assert.equal(state.price,95);assert.equal(check('13',state).status,'notice');
  assert.equal(render('13',state).rows[0][2],'ineligible');
  state=move('13',state,'input',880);assert.equal(state.price,300);
  const rows=render('13',state).rows;assert.equal(Number(rows[1][2])-Number(rows[0][2]),2);
});

test('affine-input undo cards recover x and the value f(u), without reversing f',()=>{
  let state=preset('13',create('13'),'rule','substitution');
  state=drop('13',state,'halve','slot-1');state=drop('13',state,'subtract-one','slot-2');
  assert.equal(check('13',state).status,'revise');
  assert.deepEqual(render('13',state).rows,[['3','0.5','2','8']]);
  state=reduce('13',state,{type:'action',id:'reverse'});
  assert.deepEqual(state.substitutionOrder,['subtract-one','halve']);
  assert.equal(check('13',state).status,'success');assert.deepEqual(render('13',state).rows,[['3','1','3','11']]);
  state=move('13',state,'input',80+(-3+5)/16*800);
  assert.equal(state.u,-3);assert.deepEqual(render('13',state).rows,[['-3','-2','-3','-7']]);
  state=preset('13',state,'rule','discount');assert.deepEqual(state.substitutionOrder,['subtract-one','halve']);
  assert.deepEqual(state.discountOrder,[null,null]);
});

test('printing count snaps to an integer and both exact ties can be chosen',()=>{
  let state=create('14');
  state=drop('14',state,'quote','quote-tie');assert.equal(check('14',state).status,'success');
  state=move('14',state,'quantity',quantityX(40));assert.equal(state.n,40);assert.equal(check('14',state).status,'success');
  state=move('14',state,'quantity',quantityX(30.4));assert.equal(state.n,30);
  assert.equal(check('14',state).status,'revise');
  state=drop('14',state,'quote','quote-first');assert.equal(check('14',state).status,'success');
  assert.deepEqual(render('14',state).rows[0],['30','110','120','-10']);
  state=move('14',state,'quantity',quantityX(50));state=drop('14',state,'quote','quote-second');assert.equal(check('14',state).status,'success');
  state=move('14',state,'quantity',5000);assert.equal(state.n,80);
});

test('draggable budget line changes exact integer capacity; budget and cheapest quantity are different decisions',()=>{
  let state=preset('14',create('14'),'objective','budget');
  state=drop('14',state,'quote','quote-second');assert.equal(check('14',state).status,'success');
  assert.match(render('14',state).summary,/P permits 60 booklets; Q permits 70/);
  state=move('14',state,'budget',900,budgetY(160));assert.equal(state.budget,160);
  assert.match(render('14',state).summary,/P permits 46 booklets; Q permits 50/);
  state=move('14',state,'budget',900,budgetY(330));state=drop('14',state,'quote','quote-tie');assert.equal(check('14',state).status,'success');
  state=move('14',state,'budget',900,budgetY(0));assert.equal(check('14',state).status,'success');
  assert.match(check('14',state).lines.join(' '),/no allowed quantity is affordable/);
});

test('rental is continuous, excludes t=0, and handles the t=20 tie and closed endpoint 40',()=>{
  let state=preset('14',create('14'),'context','rental');
  state=drop('14',state,'quote','quote-tie');assert.equal(check('14',state).status,'success');
  state=move('14',state,'quantity',80+10.5/40*800);assert.equal(state.t,10.5);
  state=drop('14',state,'quote','quote-first');assert.equal(check('14',state).status,'success');
  assert.deepEqual(render('14',state).rows,[['10.5','168','225','-57']]);
  state=move('14',state,'quantity',880);state=drop('14',state,'quote','quote-second');assert.equal(check('14',state).status,'success');
  assert.deepEqual(render('14',state).rows,[['40','640','520','120']]);
  state=move('14',state,'quantity',80);assert.equal(check('14',state).status,'notice');
  assert.deepEqual(render('14',state).rows,[['0','—','—','—']]);
  assert.equal(render('14',state).handles.some(handle=>handle.id==='budget'),false);
});

test('outside drops, nonfinite coordinates, unknown card IDs and invalid presets cannot mutate state',()=>{
  for(const id of ids){
    const state=create(id),before=JSON.stringify(state);
    assert.equal(reduce(id,state,{type:'drag',id:'x',x:NaN,y:100,phase:'move'}),state);
    assert.equal(reduce(id,state,{type:'drag',id:'x',x:100,y:Infinity,phase:'move'}),state);
    assert.equal(drop(id,state,'untrusted-token','slot-1'),state);
    assert.equal(reduce(id,state,{type:'preset',id:'mode',value:'<script>'}),state);
    assert.equal(JSON.stringify(state),before);
    assert.equal(JSON.stringify(JSON.parse(JSON.stringify(state))),before);
  }
  const state=create('11');
  assert.equal(reduce('11',state,{type:'drag',id:'curve-A',zone:42,x:480,y:470,phase:'end'}),state);
});

test('render/check sanitize a persisted state while leaving the caller untouched',()=>{
  const raw={context:'printing',objective:'cost',n:10.4,t:-1,budget:Infinity,quote:'first'};
  const before={...raw};const scene=render('14',raw);
  assert.deepEqual(raw,before);assert.deepEqual(scene.rows[0],['10','50','50','0']);
  assert.equal(check('14',raw).status,'revise');
});
