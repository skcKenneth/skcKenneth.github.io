import {loadProgress} from '../lib/jae-math-model.mjs';
import {loadLearning} from '../lib/senior-math-learning.mjs';
const names=['search','level','kind','source','book','exam','school','skill','correction','wrong','completed','corrected'];
export async function initializeSeniorBank(root:HTMLElement){
 const zh=root.dataset.locale==='zh-Hant',base=(zh?'/zh':'')+'/teaching/senior-math/';
 const controls=root.querySelector<HTMLFormElement>('[data-bank-controls]')!;
 const fields=new Map(names.map(name=>[name,controls.querySelector<HTMLInputElement|HTMLSelectElement>(`[data-bank-${name}]`)]));
 let index:any[];try{const response=await fetch(base+'bank-index.json');if(!response.ok)throw Error('index');index=await response.json();}catch{root.querySelector('[data-bank-count]')!.textContent=zh?'搜尋未能載入；仍可使用下方逐頁題庫。':'Search could not load; the paginated questions below remain available.';return;}
 const params=new URLSearchParams(location.search);fields.forEach((field,name)=>{if(!field)return;if(field instanceof HTMLInputElement&&field.type==='checkbox')field.checked=params.get(name)==='1';else field.value=params.get(name)||'';});
 const pathPage=Number(location.pathname.match(/\/page\/(\d+)\//)?.[1]||1);let page=Math.max(1,Number(params.get('page'))||pathPage);
 const has=(values:any[],value:string)=>!value||values.includes(value);
 const update=(reset=false)=>{
  if(reset)page=1;let answers:any={},learning:any={everWrong:{}};try{answers=loadProgress(localStorage).progress.answers;learning=loadLearning(localStorage).learning;}catch{}
  const value=(name:string)=>{const f=fields.get(name);return f instanceof HTMLInputElement&&f.type==='checkbox'?(f.checked?'1':''):f?.value||'';};
  const query=value('search').normalize('NFKC').toLowerCase().trim();
  const filtered=index.filter(row=>{const entry=answers[row.id],current=entry&&(entry.checkedInput===undefined||entry.checkedInput===entry.input);
   return (!query||row.search.includes(query))&&(!value('level')||row.review!=='ungraded'&&row.level===value('level'))&&(!value('kind')||row.kind===value('kind'))&&(!value('source')||row.source===value('source'))&&has(row.books,value('book'))&&has(row.exams,value('exam'))&&has(row.schools,value('school'))&&has(row.skills,value('skill'))&&has(row.corrections,value('correction'))&&(!value('wrong')||current&&entry.lastResult==='incorrect')&&(!value('completed')||entry?.completed)&&(!value('corrected')||learning.everWrong[row.id]&&current&&entry?.lastResult==='correct');
  });
  const pages=Math.max(1,Math.ceil(filtered.length/50));page=Math.max(1,Math.min(pages,page));
  const list=root.querySelector('[data-bank-list]')!;list.replaceChildren();
  for(const row of filtered.slice((page-1)*50,page*50)){
   const wrapper=document.createElement('div');wrapper.className='senior-bank-entry';
   const a=document.createElement('a');a.className='senior-bank-row';a.href=row.url;a.dataset.bankRow='';a.dataset.id=row.id;
   const small=document.createElement('span');const levels:any={foundation:zh?'基礎':'Foundation',standard:zh?'鞏固':'Standard',transfer:zh?'遷移':'Transfer'};small.textContent=row.title+' · '+(row.review==='ungraded'?(zh?'未分級':'Ungraded'):(levels[row.level]||'')+(row.review==='provisional'?(zh?' · 暫定':' · provisional'):''));
   const strong=document.createElement('strong');strong.textContent=row.prompt;a.append(small,strong);wrapper.append(a);
   const button=document.createElement('button');button.type='button';button.dataset.classroomAdd=row.id;button.textContent=zh?'加入課堂清單':'Add to classroom list';wrapper.append(button);list.append(wrapper);
  }
  root.querySelector('[data-bank-count]')!.textContent=`${filtered.length} / ${index.length} · ${zh?'頁':'Page'} ${page} / ${pages}`;
  const url=new URL(location.href);url.pathname=base+'question-bank/';url.search='';fields.forEach((_f,name)=>{if(value(name))url.searchParams.set(name,value(name));});if(page>1)url.searchParams.set('page',String(page));history.replaceState(null,'',url);
  const language=document.querySelector<HTMLAnchorElement>('.language-switch a');if(language){const alternate=new URL(language.href);alternate.pathname=(zh?'':'/zh')+'/teaching/senior-math/question-bank/';alternate.search=url.search;language.href=alternate.href;}
  const pager=root.querySelector('[data-bank-pagination]')!;pager.replaceChildren();
  for(const [name,delta]of [[zh?'上一頁':'Previous',-1],[zh?'下一頁':'Next',1]]as const){const button=document.createElement('button');button.type='button';button.textContent=name;button.disabled=page+delta<1||page+delta>pages;button.addEventListener('click',()=>{page+=delta;update();list.querySelector<HTMLAnchorElement>('a')?.focus();});pager.append(button);}
 };
 controls.hidden=false;controls.addEventListener('submit',e=>e.preventDefault());let timer:number;
 controls.addEventListener('input',event=>{clearTimeout(timer);timer=0;if((event.target as HTMLInputElement).type==='search')timer=window.setTimeout(()=>{timer=0;update(true);},150);else update(true);});
 controls.addEventListener('change',()=>{clearTimeout(timer);timer=0;update(true);});
 document.addEventListener('click',event=>{if(timer&&(event.target as HTMLElement).closest('.language-switch a')){clearTimeout(timer);timer=0;update(true);}},true);
 window.addEventListener('storage',()=>update());window.addEventListener('pageshow',()=>update());update();
}
