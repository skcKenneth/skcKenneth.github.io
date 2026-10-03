import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {jaeTopics,jaePapers,jaeSyllabus} from '../src/data/jae-math.mjs';
import {initialProgress,saveProgress,loadProgress,checkAnswer} from '../src/lib/jae-math-model.mjs';

test('Both lessons provide complete bilingual text and valid mathematical rendering',()=>{
  const ids=new Set();
  const inspect=value=>{
    if(Array.isArray(value)) return value.forEach(inspect);
    if(!value || typeof value!=='object') return;
    if('en' in value || 'zh' in value) for(const locale of ['en','zh']) assert.ok(typeof value[locale]==='string' && value[locale].trim());
    for(const [key,item] of Object.entries(value)){
      if(['formula','expression','math'].includes(key)) assert.doesNotThrow(()=>katex.renderToString(item,{throwOnError:true,trust:false}));
      else inspect(item);
    }
  };
  assert.equal(jaeTopics.length,2); inspect(jaeTopics);
  for(const topic of jaeTopics){
    assert.equal(topic.questions.filter(q=>q.kind==='example').length,3);
    assert.equal(topic.questions.filter(q=>q.kind!=='example').length,6);
    for(const q of topic.questions){
      assert.ok(!ids.has(q.id)); ids.add(q.id); assert.equal(q.hints.length,2); assert.ok(q.steps.length>=2);
      if(q.kind==='choice') { assert.equal(q.choices.filter(choice=>choice.id===q.answer).length,1); assert.equal(new Set(q.choices.map(choice=>choice.id)).size,q.choices.length); }
      if(q.kind==='number') assert.equal(checkAnswer(q,String(q.answer)).status,'correct');
    }
  }
});
test('Every actual exercise record survives browser-local save/load',()=>{
  let json=null; const storage={getItem:()=>json,setItem:(_key,value)=>{json=value;}};
  const progress=initialProgress();
  for(const topic of jaeTopics) for(const q of topic.questions) progress.answers[q.id]={input:String(q.answer),notes:'first attempt',correction:'revised reasoning',completed:true,attempts:1,lastResult:q.kind==='example'?null:'correct'};
  assert.equal(saveProgress(storage,progress),true); assert.deepEqual(loadProgress(storage).progress.answers,progress.answers);
});
test('Official archive is the selected five JM01 years with explicit check dates',()=>{
  assert.deepEqual(jaePapers.map(p=>p.year).sort(),[2021,2022,2023,2024,2025]);
  for(const source of [...jaePapers,jaeSyllabus]){
    assert.ok(['www.must.edu.mo','www.utm.edu.mo'].includes(new URL(source.url).hostname));
    assert.match(source.url,/\.pdf$/); assert.match(source.verified,/^\d{4}-\d{2}-\d{2}$/);
  }
  assert.equal(jaeSyllabus.year,2027);
});
