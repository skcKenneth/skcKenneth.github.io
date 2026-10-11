import { getClassroomPack, normalizeClassroomSettings, classroomSharePath, classroomSettingRows } from '../data/classroom-packs.mjs';

export function copyClassroomLink(urlField: HTMLInputElement, status: HTMLElement, zh: boolean): Promise<void> {
  status.textContent=zh?'正在複製連結…':'Copying link…';
  return new Promise(resolve=>{
    let finished=false;
    const finish=(copied:boolean)=>{
      if(finished)return;
      finished=true;window.clearTimeout(timer);
      if(copied)status.textContent=zh?'已複製；連結只有情境及種子，沒有學生回答。':'Copied. The link contains only the preset and seed, with no learner responses.';
      else{
        urlField.focus();urlField.select();
        status.textContent=zh?'未能自動複製，請複製已選取的網址。':'Automatic copy did not finish. Copy the selected URL.';
      }
      resolve();
    };
    const timer=window.setTimeout(()=>finish(false),1500);
    try{navigator.clipboard.writeText(urlField.value).then(()=>finish(true),()=>finish(false));}
    catch{finish(false);}
  });
}

export function initializeClassroomPage(root: HTMLElement) {
  if(root.dataset.classroomReady)return;
  root.dataset.classroomReady='true';
  root.querySelector<HTMLButtonElement>('[data-classroom-print]')?.addEventListener('click',()=>window.print());
  const projection=root.querySelector<HTMLButtonElement>('[data-classroom-projection-toggle]');
  const projectionBar=root.querySelector<HTMLElement>('[data-classroom-projection-bar]');
  const projectionExit=root.querySelector<HTMLButtonElement>('[data-classroom-projection-exit]');
  const setProjection=(active:boolean)=>{
    root.dataset.classroomProjection=String(active);
    projection?.setAttribute('aria-pressed',String(active));
    if(projectionBar)projectionBar.hidden=!active;
    if(active)projectionExit?.focus();else projection?.focus();
  };
  projection?.addEventListener('click',()=>setProjection(root.dataset.classroomProjection!=='true'));
  projectionExit?.addEventListener('click',()=>setProjection(false));
  root.addEventListener('keydown',event=>{if(event.key==='Escape'&&root.dataset.classroomProjection==='true'){event.preventDefault();setProjection(false);}});
  const settingsRoot=root.querySelector<HTMLElement>('[data-classroom-settings]');
  if(!settingsRoot)return;
  const id=settingsRoot.dataset.classroomSettings!;
  const pack=getClassroomPack(id);
  const form=settingsRoot.querySelector<HTMLFormElement>('[data-classroom-settings-form]');
  if(!pack||!form)return;
  const locale=root.dataset.locale==='zh-Hant'?'zh-Hant':'en';
  const zh=locale==='zh-Hant';
  const preset=form.elements.namedItem('preset') as HTMLSelectElement;
  const seed=form.elements.namedItem('seed') as HTMLInputElement;
  const link=settingsRoot.querySelector<HTMLAnchorElement>('[data-classroom-share-link]')!;
  const urlField=settingsRoot.querySelector<HTMLInputElement>('[data-classroom-share-url]')!;
  const status=settingsRoot.querySelector<HTMLElement>('[data-classroom-share-status]')!;
  const language=document.querySelector<HTMLAnchorElement>('[data-language-switch]');
  if(language)language.dataset.classroomSettingsLanguageManaged='true';
  const render=(raw:{preset?:string|null;seed?:string|null},write=false)=>{
    const settings=normalizeClassroomSettings(id,raw);
    preset.value=settings.preset;seed.value=String(settings.seed);
    for(const row of classroomSettingRows(id,settings,locale)){
      const target=settingsRoot.querySelector<HTMLElement>(`[data-classroom-value="${row.key}"]`);
      if(target)target.textContent=row.value;
    }
    const path=classroomSharePath(id,settings,locale);
    link.href=path;urlField.value=new URL(path,location.origin).href;
    if(language)language.href=classroomSharePath(id,settings,zh?'en':'zh-Hant');
    if(write)history.pushState(null,'',path);
  };
  const restore=()=>{const query=new URLSearchParams(location.search);render({preset:query.get('preset'),seed:query.get('seed')});};
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    render({preset:preset.value,seed:seed.value},true);
    status.textContent=zh?'設定連結已更新；請在原工具手動套用。':'Settings link updated. Apply the settings manually in the original tool.';
  });
  const copy=settingsRoot.querySelector<HTMLButtonElement>('[data-classroom-copy]');
  copy?.addEventListener('click',async()=>{
    copy.disabled=true;
    try{await copyClassroomLink(urlField,status,zh);}
    finally{copy.disabled=false;}
  });
  window.addEventListener('popstate',restore);
  restore();
}
