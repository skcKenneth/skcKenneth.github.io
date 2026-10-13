import {lessonCheck} from '../lib/senior-math-check.mjs';
import {loadProgress} from '../lib/jae-math-model.mjs';
import {loadLearning,initialLearning,evidenceState} from '../lib/senior-math-learning.mjs';
import {evidenceLabels} from './senior-math-study-ui';
export function initializeSeniorChecks(root:HTMLElement){
 const zh=root.dataset.locale==='zh-Hant',questions=JSON.parse(root.querySelector('[data-lesson-questions]')!.textContent||'[]');
 const update=(progress?:any)=>{
  let answers:any=progress?.answers; if(!answers)try{answers=loadProgress(localStorage).progress.answers;}catch{answers={};}
  const summary=lessonCheck(questions,answers);
  let learning=progress?.learning||initialLearning();if(!progress?.learning)try{learning=loadLearning(localStorage).learning;}catch{}
  const counts:any={};questions.filter((q:any)=>q.kind!=='example').forEach((q:any)=>{const state=evidenceState(q,answers[q.id],learning);counts[state]=(counts[state]||0)+1;});
  root.querySelector('[data-lesson-status]')!.textContent=Object.entries(counts).map(([state,count])=>evidenceLabels[state][zh?1:0]+': '+count).join(' · ');
  const list=root.querySelector('[data-lesson-revisit]')!;list.replaceChildren();
  for(const q of summary.revisit){const li=document.createElement('li'),a=document.createElement('a');a.href=q.url;a.textContent=q.prompt[zh?'zh':'en'];li.append(a);list.append(li);}
 };
 document.addEventListener('jae-progress',event=>update((event as CustomEvent).detail));window.addEventListener('storage',()=>update());update();
}
