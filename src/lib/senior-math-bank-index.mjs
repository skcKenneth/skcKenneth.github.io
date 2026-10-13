import {questions,questionUrl,relatedLessonIds,lessonById,examinationCodesForQuestion,schoolPathIds,label,skills,skillById,skillUrl,lessonUrl,coreLessons} from '../data/senior-math/catalog.mjs';
import {taskCorrections} from './senior-math-remediation.mjs';
export const BANK_PAGE_SIZE=50;
export function bankIndex(locale='en'){
 return questions.map(q=>{
  const lessons=relatedLessonIds(q);
  const skill=skillById.get(q.lessonId),siblings=skill?skills.filter(s=>s.familyId===skill.familyId):coreLessons.filter(l=>l.bookId===q.bookId);
  const position=siblings.findIndex(l=>l.id===q.lessonId),next=position>=0?siblings[position+1]:undefined;
  const chapter=[q.chapterId,...(skill?.parentLessonIds||[]).map(id=>lessonById.get(id)?.chapterId)].find(id=>id&&lessonById.has('review-'+id));
  return {id:q.id,url:questionUrl(q.id,locale),title:label(q.lessonTitle,locale),prompt:label(q.prompt,locale),
   level:q.level,review:q.difficultyReview||'provisional',kind:q.kind,source:q.source?.type||'original',paperId:q.paperId,
   books:[...new Set([...(skill?['skills']:[]),q.bookId,...lessons.map(id=>lessonById.get(id)?.bookId)].filter(Boolean))],
   exams:examinationCodesForQuestion(q),schools:[...new Set(lessons.flatMap(schoolPathIds))],
   skills:q.primarySkillIds||q.skills||[],remediation:q.remediation||[],
   corrections:taskCorrections(q.taskType),taskType:q.taskType||'',
   ...(next?{nextUrl:skill?skillUrl(next.id,locale):lessonUrl(next.id,locale),nextTitle:label(next.title,locale)}:chapter?{nextUrl:lessonUrl('review-'+chapter,locale),nextTitle:label(lessonById.get('review-'+chapter).title,locale)}:{}),
   search:[q.id,q.prompt.en,q.prompt.zh,q.lessonTitle.en,q.lessonTitle.zh,...(q.primarySkillIds||q.skills||[])].join(' ').normalize('NFKC').toLowerCase()};
 });
}
