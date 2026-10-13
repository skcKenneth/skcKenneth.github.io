import {evidenceState,scheduleReview,errorCategories,recordLearningEvent} from '../lib/senior-math-learning.mjs';
import {correctionGuidance} from '../lib/senior-math-remediation.mjs';
export const evidenceLabels:any={
 'unattempted':['Not attempted','尚未作答'],'pending':['Needs a fresh check','待重新核對'],
 'incorrect':['Latest check incorrect','最近核對未正確'],'independent-correct':['Correct independently','獨立答對'],
 'assisted-correct':['Correct after hints / solution','使用提示／解答後答對'],'legacy-correct':['Correct; earlier hint use unknown','已核對正確；舊提示紀錄不詳'],
 'self-assessed':['Written self-assessment','書面自評'],'self-review-pending':['Awaiting fresh self-assessment','待重新自評'],
};
export const categoryLabels:any={conditions:['Conditions / domain','條件／定義域'],method:['Method selection','方法選擇'],algebra:['Algebra / signs','代數符號'],'missing-solutions':['Missing solutions','漏解'],diagram:['Graphs / diagrams','圖像'],expression:['Explanation','表達']};
export function initializeStudyTools(root:HTMLElement,api:any){
 const zh=root.dataset.locale==='zh-Hant',l=(pair:any)=>pair[zh?1:0],{questions,learning,dirty,record,read,saveNow}=api;
 const update=()=>{
  for(const q of questions){const card=root.querySelector<HTMLElement>(`[data-question="${q.id}"]`)!;
   const status=card.querySelector('[data-evidence]');if(status)status.textContent=l(evidenceLabels[evidenceState(q,read(q.id),learning)]);
   const history=card.querySelector('[data-attempt-history]');if(history){history.replaceChildren();for(const event of [...(learning.history[q.id]||[])].reverse()){
    const li=document.createElement('li');li.textContent=new Date(event.at).toLocaleString(zh?'zh-Hant':'en')+' · '+l(evidenceLabels[event.result==='correct'?(event.hints?'assisted-correct':'independent-correct'):event.result==='incorrect'?'incorrect':event.result==='self-assessed'?'self-assessed':event.result==='self-review-pending'?'self-review-pending':'pending'])+' · '+event.input;
    const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=zh?'作答與訂正':'Work and correction';details.append(summary);const pre=document.createElement('pre');pre.textContent=[event.input,event.notes,event.correction].filter(Boolean).join('\n\n');details.append(pre);li.append(details);history.append(li);
   }}
   const due=card.querySelector('[data-review-due]');if(due){const r=learning.reviews[q.id];due.textContent=r&&!r.done?(zh?'重做日期：':'Retry on: ')+new Date(r.dueAt).toLocaleDateString(zh?'zh-Hant':'en'):'';}
   const support=card.querySelector('[data-correction-support]');if(support){support.replaceChildren();for(const category of learning.categories[q.id]||[]){const p=document.createElement('p');p.textContent=correctionGuidance[category][zh?'zh':'en'];support.append(p);const skill=(q.relatedSkills||[])[0];if(skill){const a=document.createElement('a');const url=new URL((zh?'/zh':'')+'/teaching/senior-math/question-bank/',location.origin);url.searchParams.set('skill',q.primarySkillIds[0]);url.searchParams.set('correction',category);a.href=url.href;a.textContent=zh?'練習相應任務類型':'Practise the corresponding task family';support.append(a);}}}
  }
 };
 for(const q of questions){const card=root.querySelector<HTMLElement>(`[data-question="${q.id}"]`)!;
  card.querySelectorAll<HTMLInputElement>('[data-error-category]').forEach(input=>{
   input.checked=(learning.categories[q.id]||[]).includes(input.value);
   input.addEventListener('change',()=>{learning.categories[q.id]=Array.from(card.querySelectorAll<HTMLInputElement>('[data-error-category]:checked')).map(e=>e.value).filter(c=>errorCategories.includes(c));dirty.add(q.id);saveNow();});
  });
  card.querySelectorAll<HTMLButtonElement>('[data-review-days]').forEach(button=>button.addEventListener('click',()=>{scheduleReview(learning,q.id,Number(button.dataset.reviewDays));dirty.add(q.id);saveNow();}));
  card.querySelector('[data-independent-retry]')?.addEventListener('click',()=>{
   const entry=record(q.id),last=(learning.history[q.id]||[]).at(-1);
   if((entry.input||entry.notes||entry.correction)&&(!last||last.input!==entry.input||last.notes!==entry.notes||last.correction!==entry.correction))recordLearningEvent(learning,q.id,entry,'reviewed');
   entry.input='';entry.notes='';entry.correction='';entry.checkedInput='';entry.lastResult=null;entry.completed=false;
   learning.hints[q.id]={stage:0,at:new Date().toISOString()};if(learning.reviews[q.id])learning.reviews[q.id].done=true;
   if(learning.selfAssessments[q.id])learning.selfAssessments[q.id].pending=true;dirty.add(q.id);
   card.querySelectorAll<HTMLDetailsElement>('[data-reveal]').forEach(e=>e.open=false);
   card.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('[data-number-answer], [data-written-answer]').forEach(e=>e.value='');
   card.querySelectorAll<HTMLTextAreaElement>('[data-record]').forEach(e=>e.value='');
   card.querySelectorAll<HTMLInputElement>('input[type=radio], [data-completed]').forEach(e=>e.checked=false);
   const feedback=card.querySelector('[data-answer-feedback]');if(feedback)feedback.textContent=zh?'新一輪獨立嘗試；以往評核保留在紀錄。':'New independent attempt; earlier assessments remain in history.';
   api.onRetry?.(q.id);saveNow();card.querySelector<HTMLElement>('[data-number-answer], [data-written-answer], input[type=radio]')?.focus();
  });
  card.addEventListener('input',()=>{window.setTimeout(update,0);});
 }
 root.addEventListener('jae-progress',update);update();
}
