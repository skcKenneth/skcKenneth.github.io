import { books,chapters,lessons,reviews,papers,questions,schoolRoutes,skills,skillFamilies } from '../data/senior-math/catalog.mjs';
export const seniorPages=[
  {path:undefined,type:'home'}, {path:'question-bank',type:'bank'}, {path:'papers',type:'papers'},
  {path:'studios/jae',type:'studio',id:'jae'},
  {path:'paths/remedial',type:'remedial'}, {path:'paths/exam',type:'exam'},
  {path:'paths/diagnostic',type:'diagnostic'}, {path:'teacher',type:'teacher'}, {path:'sources',type:'sources'},
  {path:'skills',type:'skills'}, {path:'my-learning',type:'my-learning'}, {path:'classroom',type:'classroom'},
  ...Array.from({length:Math.ceil(questions.length/50)-1},(_,i)=>({path:`question-bank/page/${i+2}`,type:'bank',pageNumber:i+2})),
  ...skills.map(skill=>({path:`skills/${skill.id}`,type:'skill',id:skill.id})),
  ...skillFamilies.map(family=>({path:`diagnostics/${family.id}`,type:'skill-diagnostic',id:family.id})),
  ...books.map(book=>({path:`books/${book.id}`,type:'book',id:book.id})),
  ...chapters.map(chapter=>({path:`chapters/${chapter.id}`,type:'chapter',id:chapter.id})),
  ...[...lessons,...reviews].map(lesson=>({path:`lessons/${lesson.id}`,type:'lesson',id:lesson.id})),
  ...questions.map(question=>({path:`questions/${question.id}`,type:'question',id:question.id})),
  ...papers.map(paper=>({path:`papers/${paper.id}`,type:'paper',id:paper.id})),
  ...schoolRoutes.map(route=>({path:`paths/${route.id}`,type:'school',id:route.id})),
];
