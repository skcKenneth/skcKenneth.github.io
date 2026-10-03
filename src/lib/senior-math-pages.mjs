import { books,chapters,lessons,reviews,papers,questions,schoolRoutes } from '../data/senior-math/catalog.mjs';
export const seniorPages=[
  {path:undefined,type:'home'}, {path:'question-bank',type:'bank'}, {path:'papers',type:'papers'},
  {path:'paths/remedial',type:'remedial'}, {path:'paths/exam',type:'exam'},
  {path:'paths/diagnostic',type:'diagnostic'}, {path:'teacher',type:'teacher'}, {path:'sources',type:'sources'},
  ...books.map(book=>({path:`books/${book.id}`,type:'book',id:book.id})),
  ...chapters.map(chapter=>({path:`chapters/${chapter.id}`,type:'chapter',id:chapter.id})),
  ...[...lessons,...reviews].map(lesson=>({path:`lessons/${lesson.id}`,type:'lesson',id:lesson.id})),
  ...questions.map(question=>({path:`questions/${question.id}`,type:'question',id:question.id})),
  ...papers.map(paper=>({path:`papers/${paper.id}`,type:'paper',id:paper.id})),
  ...schoolRoutes.map(route=>({path:`paths/${route.id}`,type:'school',id:route.id})),
];
