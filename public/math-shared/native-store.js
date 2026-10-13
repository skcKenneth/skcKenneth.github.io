/* Native document adapters share the writer with the bilingual mathematics apps. */
(function (global) {
  'use strict';
  const copy = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  const at = (value,path) => path.reduce((v,k) => v == null ? undefined : v[k],value);
  function differences(before,after,path=[],out=[]) {
    if(same(before,after)) return out;
    if(object(after) && (object(before) || before === undefined)) {
      for(const key of Object.keys(after)) if(!['__proto__','constructor','prototype'].includes(key)) differences(before?.[key],after[key],[...path,key],out);
    } else out.push({path,value:copy(after)});
    return out;
  }
  function create(options) {
    const {key,onChange=()=>{},onStatus=()=>{}}=options;
    let current=copy(options.initial||{}),baseline=copy(current),nativeBaseline={},lastStatus='session',editing=false;
    let storage; try { storage=global.localStorage; } catch {}
    const store=global.MathStorage?.createStore({namespace:options.namespace||key,storage,defaults:{[key]:{}},decode(_key,raw){const parsed=JSON.parse(raw);if(!object(parsed))throw Error('Invalid stored document');return parsed;}});
    if(store)nativeBaseline=copy(store.snapshot()[key]||{});
    function conflictPanel(){
      if(!global.document?.body?.append)return;
      const panelId='math-sync-'+(options.namespace||key).replace(/[^a-z0-9-]/gi,'-');
      let panel=global.document.getElementById(panelId),variants=store?.conflicts()||[];
      if(!variants.length){panel?.remove();return;}
      const en=global.document.documentElement.lang==='en'||new URLSearchParams(global.location?.search||'').get('lang')==='en';
      if(!panel){panel=global.document.createElement('aside');panel.id=panelId;panel.className='math-sync-conflicts';panel.setAttribute('role','status');panel.style.cssText='margin:1rem;padding:1.2rem;border:2px solid #a77734;background:#fffaf0;color:#183c38;';global.document.body.append(panel);}
      panel.replaceChildren();const title=global.document.createElement('h2');title.textContent=en?'Both drafts are preserved':'兩份草稿已保留';panel.append(title);
      for(const variant of variants){const row=global.document.createElement('div'),label=global.document.createElement('p');label.textContent=variant.external?(en?'An older tab changed this record. Refresh the older tabs before continuing.':'舊版分頁改動咗紀錄；繼續前請先重新載入舊分頁。'):variant.path.join(' / ');row.append(label);
        const preview=global.document.createElement('details'),summary=global.document.createElement('summary'),text=global.document.createElement('pre');summary.textContent=en?'Compare the two versions':'比較兩份內容';text.style.whiteSpace='pre-wrap';text.textContent=JSON.stringify({local:variant.local,otherTab:variant.remote},null,2);preview.append(summary,text);row.append(preview);
        for(const choice of variant.external?['resume']:['local','remote']){const b=global.document.createElement('button');b.type='button';b.style.cssText='margin:.5rem;padding:.7rem;';b.textContent=choice==='resume'?(en?'Download both and reread':'下載兩份並重新讀取'):choice==='local'?(en?'Keep this tab':'保留本分頁'):(en?'Keep other tab':'保留另一分頁');b.addEventListener('click',async()=>{if(choice==='resume'){const url=URL.createObjectURL(new Blob([JSON.stringify(store.exportRecovery(),null,2)],{type:'application/json'})),a=global.document.createElement('a');a.href=url;a.download='math-conflict-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);await store.resume();}else await store.resolve(variant.id,choice);});row.append(b);}panel.append(row);
      }
    }
    const updateStatus=result=>{lastStatus=result?.status||(result?.ok?'saved':'session');onStatus(result||{ok:false,status:lastStatus});conflictPanel();};
    const notify=event=>{
      if(editing)return;
      const raw=copy(store.snapshot()[key]||{});
      if(!same(raw,nativeBaseline)){nativeBaseline=raw;onChange(copy(raw));}
      const conflicts=store.conflicts();
      if(conflicts.length)updateStatus({ok:false,status:'conflict',conflicts});
      else if(event)updateStatus({ok:event.status==='saved',status:event.status});
    };
    store?.subscribe(notify);
    function save(value) {
      current=value;
      const changes=differences(baseline,value);
      if(!changes.length)return Promise.resolve({ok:lastStatus==='saved',status:lastStatus});
      if(!store){baseline=copy(value);updateStatus({ok:false,status:'session'});return Promise.resolve({ok:false,status:'session'});}
      editing=true;
      const seeded=new Set();
      for(const change of changes){
        const id=change.path[0];
        if(options.fallbackRecords?.[id] && nativeBaseline[id]===undefined && !seeded.has(id)){
          store.edit({key,path:[id],kind:'seed',value:copy(baseline[id])});seeded.add(id);nativeBaseline[id]=copy(baseline[id]);
        }
        const before=at(baseline,change.path),nativeBefore=at(nativeBaseline,change.path);
        // Additive evidence is merged by identity; edits/removals remain explicit conflicts.
        if(Array.isArray(before)&&Array.isArray(change.value)&&change.value.length>before.length&&before.every((x,i)=>same(x,change.value[i]))&&change.value.slice(before.length).every(x=>object(x)&&typeof x.eventId==='string')) {
          for(const event of change.value.slice(before.length))store.edit({key,path:change.path,kind:'append',value:event});
        } else if(options.exposure && typeof change.value==='number') {
          // Exposure time is monotonic, never a score or an answer.
          store.edit({key,path:change.path,kind:'max',value:change.value});
        } else store.edit({key,path:change.path,kind:'set',base:copy(nativeBefore),value:change.value});
      }
      baseline=copy(value);nativeBaseline=copy(store.snapshot()[key]||{});
      editing=false;
      return store.flush().then(result=>{updateStatus(result);notify();return result;}).catch(()=>{const result={ok:false,status:'session'};updateStatus(result);return result;});
    }
    function adopt(value){current=value;baseline=copy(value);nativeBaseline=copy(store?.snapshot()[key]||{});}
    return {save,adopt,snapshot:()=>copy(current),native:()=>copy(store?.snapshot()[key]||nativeBaseline),store,status:()=>lastStatus};
  }
  function hydrateFields(selector,fieldAttribute,records,idAttribute) {
    if(!global.document?.querySelectorAll)return;
    global.document.querySelectorAll(selector).forEach(input=>{
      if(input===global.document.activeElement)return;
      const id=idAttribute?input.dataset[idAttribute]:input.closest('[data-inquiry]')?.dataset.inquiry;
      const value=records[id]?.[input.dataset[fieldAttribute]];
      if(typeof value==='string'&&input.value!==value)input.value=value;
    });
  }
  global.MathNativeStore={create,hydrateFields,eventId:()=>global.crypto?.randomUUID?.()||'e-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)};
})(globalThis);
