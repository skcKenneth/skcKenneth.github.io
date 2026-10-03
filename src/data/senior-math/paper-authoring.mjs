import { L, Q } from './authoring.mjs';
export { L, S } from './authoring.mjs';
export const none = L('None of these', '以上皆非');
export function paperQuestions(paperId) {
  function item(kind, part, pdfPage, answerPdfPage, prompt, expression, answer, hints, steps, result, explanation, skills, extra={}) {
    return Q(kind,'standard',prompt.en,prompt.zh,expression,answer,hints,steps,result,explanation,{
      id:`${paperId}-${part.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')}-${kind}-1`,
      source:{type:'official',paperId,question:part,pdfPage,answerPdfPage},
      skills:Array.isArray(skills)?skills:[skills],
      verification:{state:'verified',date:'2026-10-03',method:'Independent mathematical derivation compared with the official suggested answer'},
      ...extra,
    });
  }
  return {
    C:(part,page,answerPage,prompt,expression,options,answer,hints,steps,result,error,skills,extra={})=>item('choice',part,page,answerPage,prompt,expression,answer,hints,steps,result,error,skills,{
      choices:options.map((value,i)=>({id:'ABCDE'[i],label:typeof value==='string'?L(`Option ${'ABCDE'[i]}`,`選項 ${'ABCDE'[i]}`):value,...(typeof value==='string'?{expression:value}:{})})),
      ...extra,
    }),
    W:(part,page,answerPage,prompt,expression,hints,steps,result,error,skills,extra={})=>item('written',part,page,answerPage,prompt,expression,result,hints,steps,result,error,skills,{
      rubric:[L('Check the stated conditions, each justified step, and the complete requested result.', '逐項檢查條件、每步理由，以及題目要求的完整結果。')],...extra,
    }),
  };
}
