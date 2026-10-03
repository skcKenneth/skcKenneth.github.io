import {loadProgress,normalizeProgress} from './jae-math-model.mjs';
export function progressForExport(storage,current,changedIds=new Set()){
 const snapshot=normalizeProgress(current);
 if(!storage)return snapshot;
 const latest=loadProgress(storage);
 if(!latest.available||latest.issue)return snapshot;
 snapshot.answers={...latest.progress.answers};
 for(const id of changedIds)if(current.answers[id])snapshot.answers[id]=normalizeProgress({version:1,answers:{[id]:current.answers[id]}}).answers[id];
 return snapshot;
}
export function readableProgress(progress,questions=[],locale='en',date=new Date().toISOString()){
 const zh=locale==='zh-Hant',t=(en,ch)=>zh?ch:en,known=new Map(questions.map(q=>[q.id,q]));
 const lines=[t('Senior mathematics · My learning record','高中數學 · 我的學習紀錄'),date,t('All local lesson records; self-assessment, not a teacher assessment.','全部本機課節紀錄；屬於自評，並非教師評核。')];
 for(const [id,entry]of Object.entries(progress.answers).sort(([a],[b])=>a.localeCompare(b))){
  const question=known.get(id),prompt=question?.prompt?.[zh?'zh':'en'];
  lines.push('',`[${id}]${prompt?' '+prompt:''}`,`${t('Answer','答案')}: ${entry.input||'—'}`,`${t('Reasoning','思路')}: ${entry.notes||'—'}`,`${t('Correction','訂正')}: ${entry.correction||'—'}`,`${t('Checked attempts','已核對次數')}: ${entry.attempts}`,`${t('Can explain','能解釋')}: ${entry.completed?t('Yes','是'):t('Not marked','未標記')}`);
 }
 return '\uFEFF'+lines.join('\n\n');
}
