export const isCurrentChecked=record=>Boolean(record&&(record.checkedInput===undefined||record.checkedInput===record.input));
export function lessonCheck(questions,answers={}) {
 const practice=questions.filter(q=>q.kind!=='example');
 const states=practice.map(q=>{
  const record=answers[q.id];
  const current=isCurrentChecked(record);
  const status=!record?'unattempted':q.kind==='written'?(record.completed?'explained':'manual'):current&&record.lastResult==='correct'?'correct':current&&record.lastResult==='incorrect'?'incorrect':'pending';
  return {...q,status};
 });
 const counts=Object.fromEntries(['correct','incorrect','explained','manual','pending','unattempted'].map(state=>[state,states.filter(q=>q.status===state).length]));
 const rank={incorrect:0,pending:1,unattempted:2,manual:3,correct:4,explained:5};
 const level={foundation:0,standard:1,transfer:2};
 return {total:practice.length,counts,revisit:states.filter(q=>!['correct','explained'].includes(q.status)).sort((a,b)=>(rank[a.status]-rank[b.status])||(level[a.level]-level[b.level])).slice(0,5)};
}
