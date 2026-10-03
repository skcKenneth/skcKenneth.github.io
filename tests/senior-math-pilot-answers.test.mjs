import test from 'node:test';
import assert from 'node:assert/strict';
import {jaeTopics} from '../src/data/jae-math.mjs';
const questions=jaeTopics.flatMap(t=>t.questions),byId=new Map(questions.map(q=>[q.id,q]));
test('Every numeric pilot answer agrees with an independent calculation from its stated problem',()=>{
 const expected=new Map([
  ['quadratics-example-1',13-12**2/(4*2)],['quadratics-example-2',6**2/4],['quadratics-example-3',Math.max(...Array.from({length:139},(_,i)=>{const x=(i+1)/10;return x*(14-x)}))],
  ['quadratics-number-1',5-12**2/(4*3)],['quadratics-number-2',5**2-2*2],['quadratics-number-3',Math.sqrt(16)],['quadratics-number-4',8],['quadratics-number-5',2**2-4*5],
  ['trigonometry-example-1',Math.sin(150*Math.PI/180)],['trigonometry-example-2',Math.abs(-2)],['trigonometry-example-3',2+(Math.PI/2)/(Math.PI/6)],
  ['trigonometry-number-1',360/4],['trigonometry-number-2',(Math.PI/2+Math.PI/3)/(2*Math.PI)],['trigonometry-number-3',60/180],['trigonometry-number-4',Math.sin(Math.PI/6)],['trigonometry-number-5',2/3],
 ]);
 assert.equal(expected.size,questions.filter(q=>typeof q.answer==='number').length);
 for(const [id,value]of expected)assert(Math.abs(byId.get(id).answer-value)<1e-10,id);
});
test('Pilot choices and parameter proofs retain all exceptions and correct transformations',()=>{
 const selected=id=>{const q=byId.get(id);return q.choices.find(c=>c.id===q.answer)};
 assert.equal(selected('quadratics-choice-1').expression,'(-2,7)');assert.equal(selected('quadratics-choice-2').label.en,'None');assert(4**2-4*8<0);
 for(const x of [.5,3])assert.equal(2*x*x-7*x+3,0);assert(selected('quadratics-choice-3').expression.includes('tfrac12'));
 assert.equal(selected('quadratics-choice-4').expression,'y=(x+2)^2-2');
 assert.equal(selected('trigonometry-choice-1').expression,'-\\tfrac12');assert(Math.abs(Math.cos(2*Math.PI/3)+.5)<1e-10);
 assert.equal(selected('trigonometry-choice-2').expression,'\\pi');assert.equal(selected('trigonometry-choice-3').label.en,'Right π/4 and up 1');
 assert.equal(selected('trigonometry-choice-4').expression,'y=3\\cos\\left(\\frac x2\\right)+5');assert.equal(3*Math.cos(0)+5,8);assert.equal(3*Math.cos(Math.PI)+5,2);
 assert.equal((-.375)*4**2+3*4-6,0);assert.equal(3*2-6,0);
 for(const x of [-2,-1,0,1,2])assert(Math.abs(Math.sin(x+Math.PI)+Math.sin(x))<1e-10);
});
