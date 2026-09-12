import {lessons} from "../data/workshop-lessons";
import type {LearnerProgress,WorkshopLesson,WorkshopLocale,WorkshopResult} from "../types/workshop";
import {ProgressStore,freshProgress,validateProgress,validateParams,validateResult,isRunStale,exportProgress,parseImport,pythonExport,notebookExport,reportExport,MAX_IMPORT_BYTES} from "../lib/workshop-state.mjs";

const metricZh:Record<string,string>={
 "Your Euler max error (g/L)":"你的 Euler 最大誤差（g/L）","Your half-step max error (g/L)":"你的半步長最大誤差（g/L）",
 "Euler max error (g/L)":"Euler 最大誤差（g/L）","Half-step max error (g/L)":"半步長最大誤差（g/L）","Residence time (min)":"停留時間（min）","Damkohler number":"Damkohler 數","h × decay rate":"h × 衰減速率",
 "Estimated r (1/day)":"估計 r（1/day）","Estimated K":"估計 K","Calibration RMSE":"校準 RMSE","Held-out RMSE":"保留資料 RMSE","Exponential held-out RMSE":"指數模型保留 RMSE","Full-data K (diagnostic only)":"全資料 K（僅供診斷）","Reference Jacobian condition number":"參照 Jacobian 條件數",
 "Initial effective reproduction ratio":"初始有效再生比值","Reference peak I":"參照感染高峰","Euler max error (persons)":"Euler 最大誤差（人）","RK4 max error (persons)":"RK4 最大誤差（人）","Half-step Euler max error":"半步長 Euler 最大誤差","Your population drift":"你的人口總量漂移",
 "Mean sequential − snapshot score":"逐次−快照的平均分數差","Approximate 95% CI lower":"近似 95% 區間下界","Approximate 95% CI upper":"近似 95% 區間上界","Replications":"重複試驗次數","Your final same-type fraction":"你的最終同類鄰居比例",
 "Optimal x":"最優 x","Optimal y":"最優 y","Optimal profit":"最優利潤","Your objective at optimum":"你的目標函數在最優點的值","Integer optimal profit":"整數最優利潤","Labor shadow price":"工時影子價格","One-sided finite-difference shadow price":"單側差分影子價格",
 "Effective diffusion number":"有效擴散比值","Your max error":"你的最大誤差","Reference max error":"參照最大誤差","Refined reference max error":"加密參照最大誤差","Backward Euler max error":"Backward Euler 最大誤差","Initial total amount":"初始總量","Your final total amount":"你的最終總量",
};
const download=(name:string,body:string|Blob,type="text/plain;charset=utf-8")=>{
 const blob=body instanceof Blob?body:new Blob([body],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
};
const getText=async(url:string)=>{const r=await fetch(url);if(!r.ok)throw new Error(`Download failed (${r.status}) / 下載失敗`);return r.text();};
export async function initializeWorkshopIndex(root:HTMLElement){
 const locale=root.dataset.locale as WorkshopLocale,zh=locale==="zh-Hant",base=`${zh?"/zh":""}/teaching/modeling-workshop`;
 const store=new ProgressStore();await store.open();const records:LearnerProgress[]=[];
 for(const l of lessons){try{const raw=await store.get(l.id);if(raw){const p=validateProgress(raw,l) as LearnerProgress;records.push(p);const label=root.querySelector(`[data-progress-for="${l.id}"]`);if(label)label.textContent=`${p.completed.length}/8 ${zh?"步驟已自行標記完成":"steps self-marked complete"}`;}}catch{/* Keep other lessons usable if one saved record is corrupt. */}}
 const recent=records.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];
 if(recent){const l=lessons.find(l=>l.id===recent.lessonId)!;const a=document.createElement("a");a.href=`${base}/${l.slug}/`;a.textContent=(zh?"繼續學習：":"Continue learning: ")+l.title[locale];root.querySelector("[data-resume]")?.append(a);}
 const notes=JSON.parse(root.querySelector("#workshop-index-notes")?.textContent||"[]") as {id:string;title:Record<string,string>}[];
 const update=()=>{const target=root.querySelector("[data-diagnostic-results]")!;target.replaceChildren();root.querySelectorAll<HTMLInputElement>("[data-refresh]:checked").forEach(input=>{const note=notes.find(n=>n.id===input.dataset.refresh);const a=document.createElement("a");a.style.display="block";a.href=note?`${zh?"/zh":""}/teaching/mathematical-modeling-lecture-programme/${note.id}/`:`${zh?"/zh":""}/teaching/python-labs/`;a.textContent=note?note.title[locale]:(zh?"Python 實驗室與入門指引":"Python laboratory & orientation");target.append(a);});};root.querySelectorAll("[data-refresh]").forEach(input=>input.addEventListener("change",update));
}

export async function initializeWorkshopLesson(root:HTMLElement){
 if(root.dataset.initialized)return;root.dataset.initialized="true";
 const lesson=JSON.parse(root.dataset.lesson!) as WorkshopLesson;const locale=root.dataset.locale as WorkshopLocale;const zh=locale==="zh-Hant";const t=(en:string,ch:string)=>zh?ch:en;
 const q=<T extends HTMLElement=HTMLElement>(selector:string)=>root.querySelector<T>(selector)!;
 const qa=<T extends HTMLElement=HTMLElement>(selector:string)=>Array.from(root.querySelectorAll<T>(selector));
 const store=new ProgressStore();let progress=freshProgress(lesson) as LearnerProgress;
 let exercise:{starter:string;reference:string}={starter:"",reference:""},core="",editor:import("@codemirror/view").EditorView|undefined;
 let worker:Worker|undefined;let ready=false;let busy=false;let request=0;let currentId=0;let timer:number|undefined;let animationTimer:number|undefined;let suppressEditor=false;let saveQueue=Promise.resolve();
 const confirmDraftChange=(message:string)=>new Promise<boolean>(resolve=>{const dialog=q<HTMLDialogElement>('[data-confirm-dialog]');q('[data-confirm-message]').textContent=message;dialog.returnValue='cancel';dialog.addEventListener('close',()=>resolve(dialog.returnValue==='confirm'),{once:true});dialog.showModal();});
 const setStatus=(message:string)=>{q("[data-runtime-status]").textContent=message;};
 const error=(e:unknown)=>{setStatus(t("Action could not finish. Your draft is retained.","未能完成操作；你的草稿仍然保留。"));q("[data-console]").textContent=String(e);};
 const resultStatus=()=>{const r=progress.lastRun;q("[data-result-status]").textContent=r?(isRunStale(progress,lesson)?t("Previous run: settings, code or version changed. Rerun to verify this draft.","上次運行：設定、程式或版本已改變，請重跑核證目前草稿。"):t("Completed run matches this draft. Checks verify specified properties, not research quality.","已完成運行與目前草稿相符。檢查只核證指定性質，不代表研究品質。")):t("Not run. The image below is a precomputed reference.","尚未執行；下方圖片是預先生成的參照結果。");};
 const save=()=>{progress.updatedAt=new Date().toISOString();const snapshot=structuredClone(progress);q("[data-save-status]").textContent=t("Saving…","正在保存…");saveQueue=saveQueue.then(async()=>{const persistent=await store.put(snapshot);q("[data-save-status]").textContent=persistent?t("Saved in this browser","已保存在此瀏覽器"):t("Session memory only — export JSON","僅限本次工作階段，請匯出 JSON");});resultStatus();};
 const updateMarks=()=>{qa("[data-step-mark]").forEach(el=>{el.textContent=progress.completed.includes(el.dataset.stepMark!)?"✓":"";});q<HTMLProgressElement>("[data-completion]").value=progress.completed.length;q("[data-completion-label]").textContent=`${progress.completed.length}/8 `+t("steps self-marked complete","步驟已自行標記完成");qa<HTMLButtonElement>("[data-complete]").forEach(el=>{el.textContent=progress.completed.includes(el.dataset.complete!)?t("Marked complete · undo","已標記完成 · 取消"):t("Mark step complete","標記本步完成");});};
 const tab=(name:string)=>{root.dataset.tab=name;qa("[data-tab-button]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.tabButton===name)));};
 const step=(index:number,focus=false)=>{progress.step=index;qa("[data-step]").forEach(el=>{el.hidden=Number(el.dataset.step)!==index;});qa("[data-step-button]").forEach(el=>{if(Number(el.dataset.stepButton)===index)el.setAttribute("aria-current","step");else el.removeAttribute("aria-current");});tab("task");if(focus)q(`[data-step="${index}"] h2`).focus({preventScroll:false});};
 const setCode=(code:string)=>{progress.code=code;q<HTMLTextAreaElement>("[data-code]").value=code;if(editor&&editor.state.doc.toString()!==code){suppressEditor=true;editor.dispatch({changes:{from:0,to:editor.state.doc.length,insert:code}});suppressEditor=false;}};
 const readControls=()=>{const params=Object.fromEntries(lesson.parameters.map(p=>{const el=q<HTMLInputElement|HTMLSelectElement>(`[data-param="${p.key}"]`);if(el instanceof HTMLInputElement&&!el.checkValidity())throw new Error(`${p.label[locale]}: `+t("check the allowed range","請核對容許範圍"));return[p.key,p.options?el.value:Number(el.value)];}));progress.params=validateParams(params,lesson);const seed=q<HTMLInputElement>("[data-seed]");if(!seed.checkValidity()||!Number.isSafeInteger(Number(seed.value)))throw new Error(t("Seed must be an integer from 0 to 2147483647","種子須為 0 至 2147483647 的整數"));progress.seed=Number(seed.value);};
 const drawFrame=()=>{const result=progress.lastRun?.result;if(!result?.frames)return;const index=Number(q<HTMLInputElement>("[data-frame]").value),grid=result.frames[index];const canvas=q<HTMLCanvasElement>("[data-animation] canvas"),ctx=canvas.getContext("2d")!;const size=canvas.width/grid.length;grid.forEach((row,r)=>row.forEach((v,c)=>{ctx.fillStyle=["#f5f3ed","#1f6652","#cf843b"][v];ctx.fillRect(c*size,r*size,size,size);if(grid.length<=16&&v){ctx.fillStyle=v===1?"#fff":"#17281f";ctx.font=`${Math.max(8,size*.5)}px sans-serif`;ctx.textAlign="center";ctx.fillText(String(v),(c+.5)*size,(r+.68)*size);}}));q("[data-frame-number]").textContent=String(index);};
 const renderResult=(r:WorkshopResult)=>{
   q<HTMLButtonElement>("[data-compare]").disabled=false;const target=q("[data-results]");target.replaceChildren();const dl=document.createElement("dl");dl.className="ws-metrics";
   Object.entries(r.metrics).forEach(([name,value])=>{const dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=zh?(metricZh[name]||name):name;dd.textContent=Number(value).toLocaleString(zh?"zh-Hant":"en",{maximumSignificantDigits:6});dl.append(dt,dd);});target.append(dl);
   const ul=document.createElement("ul");ul.className="ws-checks";r.checks.forEach(c=>{const li=document.createElement("li");li.dataset.pass=String(c.passed);li.textContent=`${c.passed?"✓":"!"} ${c.passed?t("PASS","通過"):t("CHECK FAILED","檢查失敗")} · ${zh?c.zh:c.en}`;if(c.detail)li.append(document.createTextNode(" — "+c.detail));ul.append(li);});target.append(ul);
   r.figures.forEach((fig,i)=>{const figure=document.createElement("figure");figure.className="ws-result-figure";const img=document.createElement("img");img.src="data:image/png;base64,"+fig.png;img.alt=zh?fig.zh:fig.en;const cap=document.createElement("figcaption");cap.textContent=img.alt;const a=document.createElement("a");a.href=img.src;a.download=`${lesson.slug}-my-figure-${i+1}.png`;a.textContent=t("Download PNG","下載 PNG");figure.append(img,cap,a);target.append(figure);});
   const animation=q("[data-animation]");animation.hidden=!r.frames;if(r.frames){q<HTMLInputElement>("[data-frame]").max=String(r.frames.length-1);q<HTMLInputElement>("[data-frame]").value="0";drawFrame();}resultStatus();
 };
 const populate=()=>{qa<HTMLTextAreaElement>("[data-card]").forEach(el=>el.value=progress.modelCard[el.dataset.card!]||"");qa<HTMLTextAreaElement>("[data-answer]").forEach(el=>el.value=progress.answers[el.dataset.answer!]||"");q<HTMLTextAreaElement>("[data-prediction]").value=progress.prediction;q<HTMLTextAreaElement>("[data-reflection]").value=progress.reflection;qa<HTMLInputElement|HTMLSelectElement>("[data-param]").forEach(el=>el.value=String(progress.params[el.dataset.param!]));q<HTMLInputElement>("[data-seed]").value=String(progress.seed);setCode(progress.code);step(progress.step);updateMarks();q("[data-results]").replaceChildren();q<HTMLButtonElement>("[data-compare]").disabled=true;q("[data-animation]").hidden=true;if(progress.lastRun)renderResult(progress.lastRun.result);resultStatus();q<HTMLButtonElement>("[data-restore-code]").disabled=!progress.answers._codeBackup;};
 const resetWorker=()=>{if(timer)window.clearTimeout(timer);worker?.terminate();worker=undefined;ready=false;busy=false;currentId=++request;q<HTMLButtonElement>("[data-run]").disabled=true;q<HTMLButtonElement>("[data-init]").disabled=false;q<HTMLButtonElement>("[data-stop]").disabled=true;};
 const init=()=>{
   if(worker||busy)return;try{worker=new Worker('/resources/modeling-workshop/worker.mjs',{type:'module'});}catch(e){resetWorker();error(e);return;}busy=true;currentId=++request;
   q<HTMLButtonElement>("[data-init]").disabled=true;q<HTMLButtonElement>("[data-stop]").disabled=false;setStatus(t("Loading Python and scientific packages… You can keep reading.","正在載入 Python 與科學套件…你可以繼續閱讀。"));
   timer=window.setTimeout(()=>{resetWorker();setStatus(t("Runtime loading timed out. Retry or download the notebook.","運算環境載入逾時；可重試或下載 notebook。"));},120000);
   worker.onerror=e=>{resetWorker();error(e.message);};
   worker.onmessage=({data})=>{
     if(data.id!==currentId)return;
     if(timer)window.clearTimeout(timer);
     if(data.type==='ready'){ready=true;busy=false;q<HTMLButtonElement>("[data-run]").disabled=false;q<HTMLButtonElement>("[data-stop]").disabled=true;setStatus(t("Python ready. Complete your function, then run the experiment.","Python 已就緒；完成函式後可執行實驗。"));}
     else if(data.type==='error'){busy=false;q<HTMLButtonElement>("[data-run]").disabled=!ready;q<HTMLButtonElement>("[data-stop]").disabled=true;if(!ready)resetWorker();setStatus(t("Python reported an error. Edit your code and rerun; your draft is saved.","Python 回報錯誤；修改後可重跑，草稿已保存。"));q("[data-console]").textContent=(data.stdout||"")+"\n"+data.message;}
   };
   worker.postMessage({type:'init',id:currentId});
 };
 const run=()=>{
   if(!ready||busy||!worker)return;
   try{readControls();}catch(e){error(e);return;}save();const submitted={code:progress.code,params:{...progress.params},seed:progress.seed};busy=true;currentId=++request;
   q<HTMLButtonElement>("[data-run]").disabled=true;q<HTMLButtonElement>("[data-stop]").disabled=false;setStatus(t("Running your experiment… (30-second limit)","正在執行你的實驗…（上限 30 秒）"));q("[data-console]").textContent="";
   const handle=({data}:MessageEvent)=>{if(data.id!==currentId)return;if(data.type==='error'){worker?.removeEventListener('message',handle);return;}if(data.type!=='result')return;worker?.removeEventListener('message',handle);if(timer)window.clearTimeout(timer);busy=false;q<HTMLButtonElement>("[data-run]").disabled=false;q<HTMLButtonElement>("[data-stop]").disabled=true;
     try{validateResult(data.result,lesson);progress.lastRun={...submitted,result:data.result,at:new Date().toISOString(),stale:false};renderResult(data.result);save();setStatus(t("Experiment complete. Inspect checks and compare against the prepared baseline.","實驗完成；請檢查結果並與預先生成的基準比較。"));q("[data-console]").textContent=data.stdout||t("Run completed.","運行完成。");}catch(e){error(e);}
   };
   worker.addEventListener('message',handle);
   timer=window.setTimeout(()=>{resetWorker();setStatus(t("Stopped after 30 seconds. Draft retained; start Python to try a smaller experiment.","已於 30 秒後停止。草稿仍在；重啟 Python 後可縮小實驗。"));},30000);
   worker.postMessage({type:'run',id:currentId,slug:lesson.slug,core,...submitted});
 };
 const exportFile=async(kind:string)=>{
   readControls();save();await saveQueue;
   if(kind==='json')download(`${lesson.slug}-draft.json`,exportProgress(progress),'application/json');
   if(kind==='python')download(`${lesson.slug}-my-model.py`,pythonExport(core,progress,lesson));
   if(kind==='notebook')download(`${lesson.slug}-my-model.ipynb`,JSON.stringify(notebookExport(core,progress,lesson,locale),null,2),'application/x-ipynb+json');
   if(kind==='report')download(`${lesson.slug}-report.md`,reportExport(progress,lesson,locale),'text/markdown;charset=utf-8');
   if(kind==='csv'||kind==='figures'){
     if(!progress.lastRun)throw new Error(t("Run your experiment first. The reference CSV is available separately.","請先執行自己的實驗。參照 CSV 可另外下載。"));
     if(isRunStale(progress,lesson))throw new Error(t("Rerun the changed draft before exporting current results. Your JSON/report preserves the old run.","草稿已改，請重跑後匯出目前結果；JSON／報告會保留旧運行。"));
     if(kind==='csv')download(`${lesson.slug}-my-data.csv`,progress.lastRun.result.csv,'text/csv;charset=utf-8');
     else {q("[data-results]").scrollIntoView({behavior:'auto'});tab('results');setStatus(t("Use the Download PNG link under each figure to save images individually.","請使用各圖下方的『下載 PNG』連結逐一保存圖像。"));}
   }
 };
 try{
   const [available,ex,c]=await Promise.all([store.open(),getText(`/resources/modeling-workshop/${lesson.slug}/exercise.json`),getText('/resources/modeling-workshop/workshop_core.py')]);
   exercise=JSON.parse(ex);core=c;if(typeof exercise.starter!=='string'||typeof exercise.reference!=='string')throw new Error('Invalid exercise assets');
   progress=freshProgress(lesson,exercise.starter) as LearnerProgress;const raw=await store.get(lesson.id);
   if(raw){try{progress=validateProgress(raw,lesson) as LearnerProgress;if(progress.lessonVersion!==lesson.version){progress.lessonVersion=lesson.version;if(progress.lastRun)progress.lastRun.stale=true;}}catch{q("[data-import-status]").textContent=t("A saved draft could not be read. It has not been deleted; use your exported backup.","未能讀取既有草稿；它未被刪除，可使用已匯出的備份。");}}
   q("[data-reference-code]").textContent=exercise.reference;populate();q("[data-save-status]").textContent=available?t("Ready · saved locally as you type","已就緒 · 輸入時本機保存"):t("Session memory only — export JSON","僅限本次工作階段，請匯出 JSON");root.classList.add('is-ready');tab('task');
 }catch(e){q("[data-save-status]").textContent=t("Interactive assets unavailable; reading and reference downloads remain available.","互動資產暫不可用；仍可閱讀及下載參照檔。");error(e);return;}
 qa<HTMLTextAreaElement>("[data-card]").forEach(el=>el.addEventListener('input',()=>{progress.modelCard[el.dataset.card!]=el.value;save();}));
 qa<HTMLTextAreaElement>("[data-answer]").forEach(el=>el.addEventListener('input',()=>{progress.answers[el.dataset.answer!]=el.value;save();}));
 q<HTMLTextAreaElement>("[data-prediction]").addEventListener('input',e=>{progress.prediction=(e.target as HTMLTextAreaElement).value;save();});q<HTMLTextAreaElement>("[data-reflection]").addEventListener('input',e=>{progress.reflection=(e.target as HTMLTextAreaElement).value;save();});
 qa<HTMLInputElement>("[data-param],[data-seed]").forEach(el=>el.addEventListener('change',()=>{try{readControls();save();}catch(e){error(e);}}));
 q<HTMLTextAreaElement>("[data-code]").addEventListener('input',e=>{progress.code=(e.target as HTMLTextAreaElement).value;save();});
 qa("[data-step-button]").forEach(el=>el.addEventListener('click',()=>{step(Number(el.dataset.stepButton),true);save();}));qa("[data-next]").forEach(el=>el.addEventListener('click',()=>{step(Number(el.dataset.next),true);save();}));qa("[data-tab-button]").forEach(el=>el.addEventListener('click',()=>tab(el.dataset.tabButton!)));
 qa("[data-complete]").forEach(el=>el.addEventListener('click',()=>{const id=el.dataset.complete!;progress.completed=progress.completed.includes(id)?progress.completed.filter(x=>x!==id):[...progress.completed,id];updateMarks();save();}));
 q("[data-use-reference]").addEventListener('click',()=>{progress.answers._codeBackup=progress.code;setCode(exercise.reference);q<HTMLButtonElement>("[data-restore-code]").disabled=false;save();tab('code');});
 q("[data-restore-code]").addEventListener('click',()=>{if(progress.answers._codeBackup){setCode(progress.answers._codeBackup);save();}});
 q("[data-reset-code]").addEventListener('click',()=>{progress.answers._codeBackup=progress.code;setCode(exercise.starter);q<HTMLButtonElement>("[data-restore-code]").disabled=false;save();});
 q("[data-enable-editor]").addEventListener('click',async()=>{if(editor)return;try{const [{EditorState},{EditorView,keymap,lineNumbers,highlightActiveLine},{defaultKeymap,history,historyKeymap},{python},{syntaxHighlighting,defaultHighlightStyle}]=await Promise.all([import('@codemirror/state'),import('@codemirror/view'),import('@codemirror/commands'),import('@codemirror/lang-python'),import('@codemirror/language')]);q('[data-editor]').hidden=false;editor=new EditorView({parent:q('[data-editor]'),state:EditorState.create({doc:progress.code,extensions:[lineNumbers(),history(),keymap.of([...defaultKeymap,...historyKeymap]),python(),syntaxHighlighting(defaultHighlightStyle),highlightActiveLine(),EditorView.lineWrapping,EditorView.contentAttributes.of({'aria-label':t('Your Python code editor','你的 Python 程式編輯器')}),EditorView.updateListener.of(update=>{if(update.docChanged&&!suppressEditor){progress.code=update.state.doc.toString();q<HTMLTextAreaElement>('[data-code]').value=progress.code;save();}})]})});q('.ws-plain-code').hidden=true;q<HTMLButtonElement>('[data-enable-editor]').disabled=true;editor.focus();}catch(e){error(e);}});
 q('[data-compare]').addEventListener('click',async()=>{try{
   if(!progress.lastRun)return;
   const baseline=JSON.parse(await getText(`/resources/modeling-workshop/${lesson.slug}/baseline.json`));validateResult(baseline,lesson);
   const target=q('[data-comparison]');target.replaceChildren();
   for(const [title,r,settings] of [[t('Precomputed baseline','預先生成的基準'),baseline,{params:baseline.params,seed:baseline.seed}],[t('My last completed run','我的最後完成運行')+(isRunStale(progress,lesson)?t(' · stale',' · 已過期'):''),progress.lastRun.result,{params:progress.lastRun.params,seed:progress.lastRun.seed}]] as [string,WorkshopResult,object][]){
     const col=document.createElement('section'),h=document.createElement('h3'),pre=document.createElement('pre');h.textContent=title;pre.textContent=JSON.stringify(settings,null,2);col.append(h,pre);
     for(const fig of r.figures){const image=document.createElement('img');image.src='data:image/png;base64,'+fig.png;image.alt=zh?fig.zh:fig.en;const caption=document.createElement('p');caption.textContent=image.alt;col.append(image,caption);}
     const metrics=document.createElement('dl');metrics.className='ws-metrics';for(const [key,value] of Object.entries(r.metrics)){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=zh?(metricZh[key]||key):key;dd.textContent=Number(value).toPrecision(6);metrics.append(dt,dd);}col.append(metrics);target.append(col);
   }
   q<HTMLDialogElement>('[data-compare-dialog]').showModal();
 }catch(e){error(e);}});
 q('[data-init]').addEventListener('click',init);q('[data-run]').addEventListener('click',run);q('[data-stop]').addEventListener('click',()=>{resetWorker();save();setStatus(t('Stopped. Draft retained. Start Python again to rerun.','已停止並保留草稿，重啟 Python 後可再執行。'));});
 qa('[data-export]').forEach(el=>el.addEventListener('click',()=>{exportFile(el.dataset.export!).catch(error);}));
 q<HTMLInputElement>('[data-import]').addEventListener('change',async e=>{const input=e.target as HTMLInputElement;const file=input.files?.[0];if(!file)return;try{if(file.size>MAX_IMPORT_BYTES)throw new Error(t('File exceeds 8 MB','檔案超過 8 MB'));const imported=parseImport(await file.text(),lesson) as LearnerProgress;if(!await confirmDraftChange(t('Replace this lesson draft? A backup of your current draft will be downloaded first.','取代此課草稿？會先下載目前草稿備份。')))return;download(`${lesson.slug}-before-import.json`,exportProgress(progress),'application/json');resetWorker();if(imported.lastRun)imported.lastRun.stale=true;progress=imported;populate();save();q('[data-import-status]').textContent=t('Imported without executing code. Re-run to verify imported results.','已匯入，沒有執行程式；重跑後才核證匯入結果。');}catch(err){q('[data-import-status]').textContent=String(err);}finally{input.value='';}});
 q('[data-reset-lesson]').addEventListener('click',async()=>{if(!await confirmDraftChange(t('Reset only this lesson? Downloaded files are not affected.','只重設此課？已下載檔案不受影響。')))return;download(`${lesson.slug}-before-reset.json`,exportProgress(progress),'application/json');resetWorker();progress=freshProgress(lesson,exercise.starter) as LearnerProgress;populate();save();});
 q('[data-frame]').addEventListener('input',drawFrame);q('[data-play]').addEventListener('click',()=>{if(animationTimer){clearInterval(animationTimer);animationTimer=undefined;return;}animationTimer=window.setInterval(()=>{const slider=q<HTMLInputElement>('[data-frame]');slider.value=String((Number(slider.value)+1)%(Number(slider.max)+1));drawFrame();},350);});
 window.addEventListener('pagehide',()=>{worker?.terminate();if(timer)clearTimeout(timer);if(animationTimer)clearInterval(animationTimer);editor?.destroy();});
}
