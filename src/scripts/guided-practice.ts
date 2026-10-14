type Pair={en:string;'zh-Hant':string};
type Question={id:string;role:string;[key:string]:any};
export function initializeGuidedPractice(root:HTMLElement){
 if(root.dataset.guidedReady)return;
 const {pack,locale,teacher}=JSON.parse(root.querySelector('[data-practice-configuration]')!.textContent!);
 const zh=locale==='zh-Hant',t=(en:string,ch:string)=>zh?ch:en;
 const query=<T extends Element=HTMLElement>(selector:string)=>root.querySelector<T>(selector)!;
 const cards=[...root.querySelectorAll<HTMLElement>('[data-practice-question]')];
 const route=query<HTMLSelectElement>('[data-practice-route]'),phaseSelect=query<HTMLSelectElement>('[data-practice-phase]'),printSelect=query<HTMLSelectElement>('[data-practice-print-edition]');
 let mode=new URLSearchParams(location.search).get('route')==='inquiry'?'inquiry':'practice',phase=mode==='inquiry'?'inquiry':'prior',index=0;
 const flow=()=>mode==='inquiry'?pack.inquiryFlow:pack.ordinaryFlow;
 const questions=():Question[]=>pack.questions.filter((q:Question)=>{
  if(phase==='model')return q.role==='worked'||q.role==='guided';
  if(phase==='correction')return q.role==='independent';
  if(phase==='independent'&&mode==='inquiry')return pack.advancedIds.includes(q.id)&&(q.role==='independent'||q.role==='extension');
  return q.role===phase;
 });
 const close=(card:HTMLElement)=>card.querySelectorAll<HTMLElement>('[data-practice-answer-content],[data-practice-step-content],[data-practice-hint-content]').forEach(el=>el.hidden=true);
 const active=()=>cards.find(c=>c.dataset.current==='true');
 const resetEdition=()=>{printSelect.value='student';root.dataset.printEdition='student';};
 const updateLanguage=()=>{const anchor=document.querySelector<HTMLAnchorElement>('[data-language-switch]');if(anchor){anchor.dataset.classroomSettingsLanguageManaged='true';anchor.href=`${zh?'':'/zh'}/teaching/classroom-packs/${pack.id}/${teacher?'teacher/':''}?route=${mode}`;}};
 function render(){
  const list=questions();index=Math.max(0,Math.min(index,Math.max(0,list.length-1)));
  for(const card of cards){const current=card.dataset.questionId===list[index]?.id;card.hidden=!current;card.dataset.current=String(current);close(card);}
  query('[data-practice-inquiry]').hidden=phase!=='inquiry';
  root.querySelectorAll<HTMLElement>('[data-practice-flow]').forEach(el=>el.hidden=el.dataset.practiceFlow!==mode);
  phaseSelect.value=phase;route.value=mode;root.dataset.practiceCurrentIndex=String(index);
  const title=(flow().find((item:any[])=>item[0]===phase)?.[2] as Pair)?.[locale as keyof Pair]||({supplement:t('Further practice','補練／家課'),extension:t('Extension','進階')} as Record<string,string>)[phase];
  query('[data-practice-status]').textContent=`${title}${list.length?` · ${index+1}/${list.length}`:''}`;
  for(const selector of ['[data-practice-hint]','[data-practice-step]','[data-practice-answer]','[data-practice-reset]'])query<HTMLButtonElement>(selector).disabled=!list.length;
  updateLanguage();
 }
 function phases(){phaseSelect.replaceChildren();for(const item of [...flow(),['supplement',0,{en:'Further practice','zh-Hant':'補練／家課'}],['extension',0,{en:'Extension','zh-Hant':'進階'}]]){const option=document.createElement('option');option.value=item[0];option.textContent=item[2][locale]+(item[1]?` · ${item[1]}′`:'');phaseSelect.append(option);}}
 function move(delta:number){const list=questions(),next=index+delta;if(list.length&&next>=0&&next<list.length)index=next;else{const ids=flow().map((item:any[])=>item[0]),at=ids.indexOf(phase),target=at+delta;if(target>=0&&target<ids.length){phase=ids[target];index=delta>0?0:Math.max(0,questions().length-1);}}render();active()?.focus({preventScroll:true});}
 route.addEventListener('change',()=>{mode=route.value==='inquiry'?'inquiry':'practice';phase=mode==='inquiry'?'inquiry':'prior';index=0;phases();const url=new URL(location.href);url.search='?route='+mode;history.replaceState(null,'',url);render();});
 phaseSelect.addEventListener('change',()=>{phase=phaseSelect.value;index=0;render();});
 query('[data-practice-next]').addEventListener('click',()=>move(1));query('[data-practice-prev]').addEventListener('click',()=>move(-1));
 query('[data-practice-hint]').addEventListener('click',()=>{const el=active()?.querySelector<HTMLElement>('[data-practice-hint-content][hidden]');if(el)el.hidden=false;});
 query('[data-practice-step]').addEventListener('click',()=>{const el=active()?.querySelector<HTMLElement>('[data-practice-step-content][hidden]');if(el)el.hidden=false;});
 query('[data-practice-answer]').addEventListener('click',()=>{const el=active()?.querySelector<HTMLElement>('[data-practice-answer-content]');if(el)el.hidden=false;});
 query('[data-practice-reset]').addEventListener('click',()=>{const card=active();if(card)close(card);});
 query('[data-practice-reveal-all]').addEventListener('click',()=>cards.forEach(card=>card.querySelectorAll<HTMLElement>('[data-practice-answer-content],[data-practice-step-content],[data-practice-hint-content]').forEach(el=>el.hidden=false)));
 const projection=query<HTMLButtonElement>('[data-practice-projection]');projection.addEventListener('click',()=>{const on=root.dataset.classroomProjection!=='true';root.dataset.classroomProjection=String(on);projection.setAttribute('aria-pressed',String(on));});
 root.addEventListener('keydown',event=>{if(event.key==='Escape'){root.dataset.classroomProjection='false';projection.setAttribute('aria-pressed','false');}if(event.target instanceof HTMLElement&&event.target.closest('input,textarea,select,[contenteditable],details'))return;if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}});
 printSelect.addEventListener('change',()=>{root.dataset.printEdition=printSelect.value;});
 root.querySelectorAll<HTMLButtonElement>('[data-practice-print]').forEach(button=>button.addEventListener('click',()=>{printSelect.value=button.dataset.practicePrint!;root.dataset.printEdition=printSelect.value;window.print();}));
 window.addEventListener('beforeprint',()=>{root.dataset.printEdition=['student','teacher','supplement'].includes(printSelect.value)?printSelect.value:'student';});window.addEventListener('afterprint',resetEdition);
 query('[data-practice-export]').addEventListener('click',()=>{const includeAnswers=teacher;const selected=pack.questions.map((q:Question)=>{if(includeAnswers)return q;const {id,role,type,skill,prompt,expression,options,diagram,scaffold,space}=q;return {id,role,type,skill,prompt,expression,options,diagram,scaffold,space};});const data={version:pack.version,packId:pack.id,route:mode,edition:includeAnswers?'teacher':'student',source:pack.source,questions:selected};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=pack.id+'-'+locale+'-'+data.edition+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);query('[data-practice-output-status]').textContent=t('Downloaded the fixed lesson questions. No paper answers were collected.','已下載固定課堂題目；沒有收集紙筆答案。');});
 cards.forEach(card=>card.tabIndex=-1);root.dataset.guidedReady='true';phases();resetEdition();render();
}
