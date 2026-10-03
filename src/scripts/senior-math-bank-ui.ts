import { loadProgress } from '../lib/jae-math-model.mjs';
import { isCurrentChecked } from '../lib/senior-math-check.mjs';
export function initializeSeniorBank(root:HTMLElement){
  const rows=Array.from(root.querySelectorAll<HTMLElement>('[data-bank-row]'));
  const controls=root.querySelector<HTMLFormElement>('[data-bank-controls]')!;
  controls.hidden=false;controls.addEventListener('submit',event=>event.preventDefault());
  const search=root.querySelector<HTMLInputElement>('[data-bank-search]')!,level=root.querySelector<HTMLSelectElement>('[data-bank-level]')!,kind=root.querySelector<HTMLSelectElement>('[data-bank-kind]')!,source=root.querySelector<HTMLSelectElement>('[data-bank-source]')!,wrong=root.querySelector<HTMLInputElement>('[data-bank-wrong]')!,completed=root.querySelector<HTMLInputElement>('[data-bank-completed]')!;
  wrong.checked=new URLSearchParams(location.search).get('wrong')==='1';
  const book=root.querySelector<HTMLSelectElement>('[data-bank-book]')!,exam=root.querySelector<HTMLSelectElement>('[data-bank-exam]')!,school=root.querySelector<HTMLSelectElement>('[data-bank-school]')!;
  const update=()=>{let answers:any={};try{answers=loadProgress(localStorage).progress.answers;}catch{/* Filtering content still works. */}let count=0;
    const query=search.value.normalize('NFKC').toLowerCase().trim();
    const has=(values:string|undefined,value:string)=>!value||(values||'').split(' ').includes(value);
    rows.forEach(row=>{const entry=answers[row.dataset.id!];const visible=(!query||(row.dataset.search||'').normalize('NFKC').toLowerCase().includes(query))&&(!level.value||row.dataset.level===level.value)&&(!kind.value||row.dataset.kind===kind.value)&&(!source.value||row.dataset.source===source.value)&&has(row.dataset.books,book.value)&&has(row.dataset.exams,exam.value)&&has(row.dataset.schools,school.value)&&(!wrong.checked||isCurrentChecked(entry)&&entry?.lastResult==='incorrect')&&(!completed.checked||entry?.completed===true);row.hidden=!visible;if(visible)count++;});
    root.querySelector('[data-bank-count]')!.textContent=`${count} / ${rows.length}`;
  };
  controls.addEventListener('input',update);window.addEventListener('pageshow',update);update();
  window.addEventListener('storage',update);
}
