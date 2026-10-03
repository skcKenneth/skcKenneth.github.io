import test from 'node:test';
import assert from 'node:assert/strict';
import { quadraticSummary, quadraticValue, trigValue, trigSummary, parseNumeric, checkAnswer, initialProgress, loadProgress, saveProgress, STORAGE_KEY } from '../src/lib/jae-math-model.mjs';
const near = (a,b,tolerance=1e-10) => assert.ok(Math.abs(a-b) < tolerance, `${a} != ${b}`);

test('Quadratic roots, vertex and discriminant agree with independent substitutions', () => {
  for (let a=-3; a<=3; a++) for(let b=-5; b<=5; b++) for(let c=-5; c<=5; c++) {
    const s=quadraticSummary(a,b,c);
    for(const root of s.roots) near(quadraticValue(root,a,b,c),0);
    if(a!==0) {
      near(s.vertex.x,-b/(2*a)); near(s.vertex.y,c-b*b/(4*a));
      near(quadraticValue(s.axis-2,a,b,c),quadraticValue(s.axis+2,a,b,c));
      assert.equal(s.roots.length,s.discriminant>0?2:s.discriminant===0?1:0);
    } else assert.equal(s.vertex,null);
  }
  assert.equal(quadraticSummary(0,2,-4).type,'linear');
  assert.deepEqual(quadraticSummary(0,2,-4).roots,[2]);
  assert.equal(quadraticSummary(0,0,1).type,'constant');
  assert.equal(quadraticSummary(0,0,0).allReal,true);
  assert.equal(quadraticSummary(0,0,1).allReal,false);
  assert.throws(()=>quadraticSummary(NaN,1,2));
});
test('Sine/cosine transformation uses explicit degrees and handles constants', () => {
  near(trigValue(90,2,1,0),2); near(trigValue(0,3,1,0,'cos'),3);
  near(trigValue(0,2,1,90),2); near(trigValue(45,2,2,0),2);
  for(const kind of ['sin','cos']) for(const f of [-3,-.5,.5,2,3]) {
    const s=trigSummary(-2,f,30); near(s.periodDegrees,360/Math.abs(f));
    near(trigValue(47,-2,f,30,kind),trigValue(47+s.periodDegrees,-2,f,30,kind));
  }
  assert.equal(trigSummary(0,1,0).periodDegrees,null);
  assert.equal(trigSummary(1,0,0).periodRadians,null);
  assert.throws(()=>trigSummary(1,Infinity,0));
});
test('Numeric checks accept fractions and reject expressions or division by zero', () => {
  for(const [text,result] of [['.5',.5],['−2',-2],[' -3 / 4 ',-.75],['0',0]]) assert.equal(parseNumeric(text),result);
  for(const text of ['','1/0','Infinity','NaN','2+3','Math.PI','1/2/3','1e309','<script>']) assert.equal(parseNumeric(text),null);
  assert.equal(parseNumeric('1/'+'9'.repeat(400)),null);
  const q={kind:'number',answer:.5,tolerance:1e-8};
  assert.equal(checkAnswer(q,'1/2').status,'correct');
  assert.equal(checkAnswer(q,'').status,'empty');
  assert.equal(checkAnswer(q,'1/0').status,'invalid');
  assert.equal(checkAnswer(q,'0').status,'incorrect');
  const choice={kind:'choice',answer:'B',choices:[{id:'A'},{id:'B'}]};
  assert.equal(checkAnswer(choice,' b ').status,'correct');
  assert.equal(checkAnswer(choice,'C').status,'invalid');
});
test('Records survive reload without language keys; denied and corrupt storage are recoverable', () => {
  const values=new Map(), storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
  const p=initialProgress(); p.answers['quadratics-choice-1']={input:'B',notes:'配方',correction:'vertex',completed:true,attempts:2,lastResult:'correct'};
  p.answers['trigonometry-number-1']={input:'180',notes:'角度',correction:'units',completed:false,attempts:1,lastResult:'incorrect'};
  p.last={mode:'classroom',topic:'quadratics',question:'quadratics-choice-1'};
  assert.equal(saveProgress(storage,p),true);
  const loaded=loadProgress(storage); assert.equal(loaded.available,true);
  assert.deepEqual(loaded.progress.answers,p.answers); assert.equal(loaded.progress.last.mode,'classroom');
  values.set(STORAGE_KEY,'{broken'); assert.equal(loadProgress(storage).issue,'corrupt');
  values.set(STORAGE_KEY,JSON.stringify({version:1,answers:{'quadratics-practice-1':{attempts:-4,completed:'yes',notes:5}}}));
  const sanitized=loadProgress(storage).progress.answers['quadratics-practice-1']; assert.equal(sanitized.attempts,0); assert.equal(sanitized.completed,false);
  const denied={getItem(){throw new Error('denied')},setItem(){throw new Error('denied')}};
  assert.equal(loadProgress(denied).available,false); assert.equal(saveProgress(denied,p),false);
});
