// Each original lesson is reviewed against the quantities its existing model shows.
const native=new Set(['c1-1-1','c1-1-2','c1-1-3','c1-3-3','c1-4-2','c2-7-1','c2-7-3','c2-8-1','c2-8-2','c2-8-3','c2-10-3','s1-2-1','s1-2-2','s1-2-3','s1-2-4','s1-2-5','s2-4-1','s2-4-2','s2-4-3','s3-7-5','s3-8-3','sup-variation-finance','sup-linear-programming','sup-matrices','sup-polar','sup-infinite-series','sup-inverse-functions']);
export const matchedSkillModels={
 'c1-2-3':'quadratics-inequalities','c1-3-2':'quadratics-intervals',
 'c1-5-1':'trig-unit-circle','c1-5-2':'trig-unit-circle','c1-5-3':'trig-unit-circle','c1-5-4':'trig-transformations','c1-5-5':'trig-identities','c1-5-6':'trig-transformations',
 'c2-6-1':'vectors-geometric','c2-6-2':'vectors-geometric','c2-6-3':'vectors-dot','c2-6-4':'vectors-proof-triangles',
 's1-3-1':'conics-ellipse','s1-3-2':'conics-hyperbola','s1-3-3':'conics-parabola',
 's2-5-1':'calculus-tangent','s2-5-2':'calculus-rules','s2-5-3':'calculus-extrema',
 's3-7-1':'probability-conditional','s3-7-3':'probability-moments','s3-7-4':'probability-models','s3-8-1':'statistics-regression','s3-8-2':'statistics-regression',
};
export function inquiryAudit(lesson){
 if(matchedSkillModels[lesson.id])return {id:lesson.id,status:'matched-skill-model',model:matchedSkillModels[lesson.id],reason:{en:'A dedicated model now exposes quantities used by this lesson.',zh:'改用專用模型，顯示本課實際使用的量。'}};
 if(native.has(lesson.id))return {id:lesson.id,status:'native-model',model:lesson.inquiry.type,reason:{en:'The existing model demonstrates one stated objective; its displayed assumptions define its scope.',zh:'原模型示範本課其中一項目標，其範圍以顯示的假設為準。'}};
 return {id:lesson.id,status:'targeted-reading',reason:{en:'The former generic model did not represent the lesson task closely enough. Compare the actual tasks and their conditions.',zh:'原通用模型未能充分對應本課任務，改為比較實際題目及成立條件。'}};
}
export function alignInquiry(lesson){
 const audit=inquiryAudit(lesson);if(audit.status==='native-model')return {...lesson,inquiryAudit:audit,inquiry:{...lesson.inquiry,scopeNote:lesson.id==='c2-7-3'?{en:'This model explores modulus and argument only. Products, quotients and powers are covered in the worked tasks.',zh:'此模型只探索模長與幅角；乘法、除法及乘方請見本課例題及練習。'}:audit.reason}};
 if(audit.status==='matched-skill-model')return {...lesson,inquiryAudit:audit,inquiry:{...lesson.inquiry,type:'skill',skillId:audit.model}};
 return {...lesson,inquiryAudit:audit,inquiry:{type:'reading',
  prediction:{en:`Before solving, identify the givens needed for: ${lesson.objectives[0].en}`,zh:`作答前，指出完成以下目標需要哪些已知條件：${lesson.objectives[0].zh}`},
  explanation:{en:'Compare the two tasks below: explain which definitions or restrictions permit each first step. Identify a condition that cannot be dropped.',zh:'比較下列兩題：解釋哪些定義或限制令首步成立，指出一項不可刪去的條件。'},
  transfer:lesson.inquiry.transfer,readingTasks:lesson.questions.slice(0,2).map(q=>({id:q.id,prompt:q.prompt,expression:q.expression,conditions:q.conditions,promptSvg:q.promptSvg}))}};
}
