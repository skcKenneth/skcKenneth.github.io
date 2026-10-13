import {paperSharedStems} from '../data/senior-math/paper-shared-stems.mjs';
/** Context contains authored question statements only; it never copies solutions. */
export const topLevelQuestion=label=>String(label||'').match(/^(?:(?:I|II)\.\d+|\d+)/)?.[0]||String(label||'');
export function paperContext(paper,question){
 const label=topLevelQuestion(question.source?.question),index=paper.questions.findIndex(q=>q.id===question.id);
 const earlier=paper.questions.slice(0,index).filter(q=>topLevelQuestion(q.source?.question)===label);
 const explicit=(paperSharedStems[paper.id]||[]).filter(s=>s.appliesTo.includes(question.source.question)).map(s=>({id:s.id,label:s.label||label,prompt:s.prompt,...(s.expression?{expression:s.expression}:{}),...(s.promptSvg?{promptSvg:s.promptSvg}:{}),source:s.source}));
 return {parentLabel:label,dependsOnIds:earlier.map(q=>q.id),segments:[...explicit,...earlier.map(q=>({
  id:q.id,label:q.source.question,prompt:q.prompt,...(q.expression?{expression:q.expression}:{}),...(q.promptSvg?{promptSvg:q.promptSvg}:{}),...(q.conditions?.length?{conditions:q.conditions}:{}),
 }))]};
}
export function contextualizePaper(paper){
 return {...paper,questions:paper.questions.map(q=>({...q,paperParentId:paper.id+'-'+topLevelQuestion(q.source.question).toLowerCase().replaceAll('.','-'),sharedStem:paperContext(paper,q),difficultyReview:'ungraded'}))};
}
