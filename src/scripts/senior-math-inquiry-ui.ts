import { inquiryScene,simulateBinomial } from '../lib/senior-math-inquiry.mjs';
export function initializeSeniorInquiries(root:HTMLElement,record:(id:string)=>any,save:()=>void,read:(id:string)=>any) {
  const zh=root.dataset.locale==='zh-Hant',ns='http://www.w3.org/2000/svg';
  root.querySelectorAll<HTMLElement>('[data-senior-lab]').forEach(lab=>{
    const inputs=Array.from(lab.querySelectorAll<HTMLInputElement>('[data-inquiry-param]'));
    const defaults=inputs.map(input=>input.value),svg=lab.querySelector<SVGSVGElement>('[data-inquiry-plot]')!;
    const update=()=>{
      const scene=inquiryScene(lab.dataset.seniorLab,Number(inputs[0].value),Number(inputs[1].value),lab.dataset.lessonId);
      svg.replaceChildren();
      const node=(tag:string,attributes:Record<string,string|number>,text?:string)=>{const el=document.createElementNS(ns,tag);for(const[key,value]of Object.entries(attributes))el.setAttribute(key,String(value));if(text)el.textContent=text;svg.append(el);};
      node('title',{},scene.summary[zh?'zh':'en']);
      scene.paths.forEach((p:any)=>node('path',{d:p.d,fill:'none',stroke:p.color,'stroke-width':p.width||2.5}));
      scene.circles.forEach((p:any)=>node('circle',{cx:p.x,cy:p.y,r:p.r,fill:'none',stroke:p.color,'stroke-width':2}));
      scene.labels.forEach((p:any)=>node('text',{x:p.x,y:p.y,'font-size':19,fill:'#314937'},p.text));
      lab.querySelector('[data-inquiry-summary]')!.textContent=scene.summary[zh?'zh':'en'];
      inputs.forEach(input=>{lab.querySelector(`[data-inquiry-value="${input.dataset.inquiryParam}"]`)!.textContent=input.value;});
      const simulation=lab.querySelector('[data-inquiry-simulation]');if(simulation)simulation.textContent=zh?'參數已改變；請重新模擬，再比較有限次頻率與精確概率。':'Parameters changed; simulate again to compare finite frequencies with the exact probabilities.';
    };
    inputs.forEach(input=>input.addEventListener('input',update));
    let simulationSeed=37;
    lab.querySelector('[data-inquiry-simulate]')?.addEventListener('click',()=>{
      const sample=simulateBinomial(Number(inputs[0].value),Number(inputs[1].value),simulationSeed++);
      lab.querySelector('[data-inquiry-simulation]')!.textContent=zh?`n=${inputs[0].value}、p=${inputs[1].value}：200 次模擬，種子 ${simulationSeed-1}；各成功次數頻數：${sample.counts.join('、')}；平均 ${sample.mean}。`:`n=${inputs[0].value}, p=${inputs[1].value}: 200 simulated trials, seed ${simulationSeed-1}; success-count frequencies: ${sample.counts.join(', ')}; mean ${sample.mean}.`;
    });
    lab.querySelector('[data-inquiry-reset]')!.addEventListener('click',()=>{inputs.forEach((input,index)=>input.value=defaults[index]);update();});
    const id=`${lab.dataset.lessonId}-inquiry-1`,note=lab.querySelector<HTMLTextAreaElement>('[data-inquiry-note]')!;
    note.value=read(id)?.notes||'';note.addEventListener('input',()=>{record(id).notes=note.value;save();});
  });
}
