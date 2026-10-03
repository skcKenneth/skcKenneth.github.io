import {lessonCheck} from '../lib/senior-math-check.mjs';
import {loadProgress} from '../lib/jae-math-model.mjs';
export function initializeSeniorChecks(root:HTMLElement){
 const zh=root.dataset.locale==='zh-Hant',questions=JSON.parse(root.querySelector('[data-lesson-questions]')!.textContent||'[]');
 const update=(progress?:any)=>{
  let answers:any=progress?.answers; if(!answers)try{answers=loadProgress(localStorage).progress.answers;}catch{answers={};}
  const summary=lessonCheck(questions,answers),c=summary.counts;
  root.querySelector('[data-lesson-status]')!.textContent=zh?`${summary.total} 道練習：${c.correct} 道數值／選擇題核對正確；${c.explained} 道書面題已自評能解釋；${c.incorrect} 道最近核對錯誤。其餘請完成、重新核對或自評。`:`${summary.total} exercises: ${c.correct} numeric/choice checks correct; ${c.explained} written tasks self-marked as explainable; ${c.incorrect} latest checks incorrect. Complete, recheck or review the remaining work.`;
  const list=root.querySelector('[data-lesson-revisit]')!;list.replaceChildren();
  for(const q of summary.revisit){const li=document.createElement('li'),a=document.createElement('a');a.href=q.url;a.textContent=q.prompt[zh?'zh':'en'];li.append(a);list.append(li);}
 };
 document.addEventListener('jae-progress',event=>update((event as CustomEvent).detail));window.addEventListener('storage',()=>update());update();
}
