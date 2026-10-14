/** Original, fixed paper-first lessons. Textbook pages are references, not copied exercises. */
export const bi = (en, zh) => ({ en, 'zh-Hant': zh });
export const PRACTICE_VERSION = '2026-10-14-guided-practice-v1';
export const ORDINARY_FLOW = [
  ['prior',4,bi('Check prerequisites','先備檢查')],
  ['inquiry',5,bi('Observe and predict','短探究／概念示範')],
  ['model',8,bi('Worked example and guided attempt','示範與帶做')],
  ['independent',15,bi('Independent practice','獨立練習')],
  ['correction',5,bi('Discuss and correct','訂正')],
  ['exit',3,bi('Exit questions','離堂題')],
];
export const INQUIRY_FLOW = [
  ['inquiry',18,bi('Investigate','探究')],['model',4,bi('Organise the reasoning','整理')],
  ['independent',13,bi('Selected practice and extension','精選練習')],['exit',5,bi('Exit questions','離堂題')],
];
/** Each question carries bilingual prompt/answer, 3 hints, steps and a paper-assessment rubric.
 * role: worked | guided | prior | independent | exit | supplement | extension.
 * Optional expression is KaTeX; diagram is structured SVG data, never learner-authored markup.
 * audit is evidence for independent arithmetic/geometry checks, not an automatic paper marker.
 */
export function question(role, suffix, fields) { return { role, suffix, type:'short', space:'short', ...fields }; }
export function makePack(fields) {
  const questions=fields.questions.map((q,index)=>{
    // A fixed rotation varies answer positions without randomising the lesson or its IDs.
    const count=q.options?.length,shift=count?index%count:0;
    const choices=count?{options:q.options.map((_,i)=>q.options[(i-shift+count)%count]),correctChoice:(q.correctChoice+shift)%count}:{};
    return {...q,...choices,id:`${fields.id}:${q.role}:${q.suffix}`};
  });
  const core=questions.filter(q=>['prior','independent','exit'].includes(q.role));
  return {
    kind:'guided-practice', version:PRACTICE_VERSION, minutes:40,
    topicIds:['mathematical-thinking','teaching-research-practice'],
    audience:bi('Years 7–8 · projection and paper','初一／初二・投影與紙筆'),
    scope:bi('Original practice aligned to the referenced skills. Use your own textbook for the cited pages.','按所列技能編寫的原創練習；教材頁碼供使用自己的課本時對照。'),
    ...fields, questions, coreIds:core.map(q=>q.id),
    advancedIds:[...questions.filter(q=>q.role==='independent').slice(0,2),...questions.filter(q=>q.role==='exit'),...questions.filter(q=>q.role==='extension').slice(0,1)].map(q=>q.id),
    ordinaryFlow:ORDINARY_FLOW, inquiryFlow:INQUIRY_FLOW,
  };
}
