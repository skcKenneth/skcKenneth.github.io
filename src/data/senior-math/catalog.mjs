import { L } from './authoring.mjs';
import { foundationLessons, foundationChapters, foundationReviews } from './foundations.mjs';
import { advancedLessons, advancedChapters, advancedReviews, advancedSupplements } from './advanced.mjs';
import { examPapers } from './papers.mjs';
import { algebraBridgeLessons } from './algebra-bridges.mjs';
import { curriculumSourceManifest } from './curriculum-source-manifest.mjs';
export { curriculumSourceManifest };
import { examCoverage, lessonsForSkills } from './exam-coverage.mjs';
export { examCoverage, lessonsForSkills };
import { jaeTopics } from '../jae-math.mjs';

export const books = [
  { id:'c1', title:L('Compulsory volume 1','必修第一冊'), chapters:5, sections:24, documentId:'textbook-c1', filename:'高一必修 第一册(A版).pdf', pdfPages:270 },
  { id:'c2', title:L('Compulsory volume 2','必修第二冊'), chapters:5, sections:19, documentId:'textbook-c2', filename:'高一必修 第二册(A版).pdf', pdfPages:282 },
  { id:'s1', title:L('Selective compulsory volume 1','選擇性必修第一冊'), chapters:3, sections:12, documentId:'textbook-s1', filename:'高二選擇性必修 第一册(A版).pdf', pdfPages:154 },
  { id:'s2', title:L('Selective compulsory volume 2','選擇性必修第二冊'), chapters:2, sections:7, documentId:'textbook-s2', filename:'高二選擇性必修 第二册(A版).pdf', pdfPages:114 },
  { id:'s3', title:L('Selective compulsory volume 3','選擇性必修第三冊'), chapters:3, sections:11, documentId:'textbook-s3', filename:'高三選擇性必修 第三册(A版).pdf', pdfPages:154 },
];
export const chapters = [...foundationChapters, ...advancedChapters];
export const coreLessons = [...foundationLessons, ...advancedLessons];
export const lessons = [...coreLessons, ...advancedSupplements, ...algebraBridgeLessons];
export const reviews = [...foundationReviews, ...advancedReviews];
export const papers = examPapers;
export const lessonById = new Map([...lessons, ...reviews].map(item=>[item.id,item]));
export const label = (pair, locale) => pair?.[locale === 'zh-Hant' ? 'zh' : 'en'] || '';
export const base = locale => `${locale === 'zh-Hant' ? '/zh' : ''}/teaching/senior-math/`;
export const lessonUrl = (id, locale='en') => `${base(locale)}lessons/${id}/`;
export const questionUrl = (id, locale='en') => `${base(locale)}questions/${id}/`;
export const paperUrl = (id, locale='en') => `${base(locale)}papers/${id}/`;
export const pilotQuestions = jaeTopics.flatMap(topic=>topic.questions.map(question=>({...question, lessonId:topic.id, lessonTitle:topic.title, legacy:true, source:{type:'original',lessonId:topic.id}})));
export const questions = [
  ...[...lessons,...reviews].flatMap(item=>item.questions.map(question=>({...question,lessonId:item.id,lessonTitle:item.title,bookId:item.bookId,chapterId:item.chapterId}))),
  ...papers.flatMap(paper=>paper.questions.map(question=>({...question,paperId:paper.id,lessonId:paper.id,lessonTitle:L(`${paper.year} ${paper.code}`,`${paper.year} ${paper.code}`)}))),
  ...pilotQuestions,
];
export const questionById = new Map(questions.map(question=>[question.id,question]));
const chapterLessons = (...ids) => ids.flatMap(id=>coreLessons.filter(item=>item.chapterId===id).map(item=>item.id));
const supplemental = (...ids) => ids;
const group = (en,zh,pdfPage,lessonIds,role='study') => ({title:L(en,zh),pdfPage,lessonIds:[...new Set(lessonIds)],role});
export const schoolRoutes = [
  {id:'g1-arts',grade:1,stream:'arts',documentId:'school-t01',filename:'T01高一文組數學思維本(2026).pdf',pdfPages:58,title:L('Senior 1 · Arts','高一・文組'),groups:[
    group('Sets, inequalities and algebra','集合、不等式與代數',4,['c1-1-1','c1-1-2','c1-1-3','c1-2-3',...supplemental('sup-partial-fractions','sup-real-algebra','sup-absolute-inequalities')]),
    group('Functions, exponents and logarithms','函數、指數與對數',8,['c1-3-1','c1-3-2','c1-3-4',...chapterLessons('c1-4'),...supplemental('sup-inverse-functions','sup-exponential-log-equations')]),
    group('Trigonometry and vectors','三角與向量',20,chapterLessons('c1-5','c2-6')),
    group('Solid geometry, including surface area','立體幾何，包括表面積',38,chapterLessons('c2-8')),
  ]},
  {id:'g1-science',grade:1,stream:'science',documentId:'school-t02',filename:'T02高一理組數學思維本(2026).pdf',pdfPages:60,title:L('Senior 1 · Science','高一・理組'),groups:[
    group('Sets, logic and algebra','集合、邏輯與代數',4,[...chapterLessons('c1-1'),'c1-2-3',...supplemental('sup-partial-fractions','sup-real-algebra','sup-absolute-inequalities')]),
    group('Functions, powers, exponents and logarithms','函數、冪、指數與對數',9,chapterLessons('c1-3','c1-4')),
    group('Vectors before trigonometry','向量先行，再學三角',21,chapterLessons('c2-6','c1-5')),
    group('Solids, parallelism and perpendicularity','立體、平行與垂直',38,chapterLessons('c2-8')),
  ]},
  {id:'g2-arts',grade:2,stream:'arts',documentId:'school-t03',filename:'T03高二文組數學思維本(2026).pdf',pdfPages:56,title:L('Senior 2 · Arts','高二・文組'),groups:[
    group('Inequalities and optimisation','不等式與最值',4,chapterLessons('c1-2')),
    group('Lines, circles and linear programming','直線、圓與線性規劃',10,[...chapterLessons('s1-2'),...supplemental('sup-linear-programming')]),
    group('Conics and intersections','圓錐曲線與交截',18,chapterLessons('s1-3')),
    group('Sequences, series and induction','數列、級數與歸納法',26,[...chapterLessons('s2-4'),'sup-infinite-series']),
    group('Counting, binomial theorem and probability','計數、二項式與概率',39,chapterLessons('s3-6','c2-10')),
  ]},
  {id:'g2-science',grade:2,stream:'science',documentId:'school-t04',filename:'T04高二理組數學思維本(2026).pdf',pdfPages:54,title:L('Senior 2 · Science','高二・理組'),groups:[
    group('Inequalities with parameters','含參數不等式',4,chapterLessons('c1-2')),
    group('Lines, circles and loci','直線、圓與軌跡',9,[...chapterLessons('s1-2'),...supplemental('sup-linear-programming')]),
    group('Conics, translation and parameterisation','圓錐曲線、平移與參數化',15,[...chapterLessons('s1-3'),...supplemental('sup-parameter-equations')]),
    group('Sequences and induction','數列與歸納法',29,[...chapterLessons('s2-4'),'sup-infinite-series']),
    group('Counting, probability and expectation','計數、概率與期望',36,[...chapterLessons('s3-6','c2-10'),'s3-7-1','s3-7-2','s3-7-3','s3-7-4']),
  ]},
  {id:'g3-arts',grade:3,stream:'arts',documentId:'school-t05',filename:'T05高三文組數學思維本(2026).pdf',pdfPages:60,title:L('Senior 3 · Arts','高三・文組'),groups:[
    group('Derivatives and applications','導數與應用',4,chapterLessons('s2-5')),
    group('Algebra review','代數總複習',6,chapterLessons('c1-1','c1-2','c1-3','c1-4','c1-5','s2-4','s3-6'),'review'),
    group('Plane and solid geometry review','平面與立體幾何複習',27,[...chapterLessons('c2-8'),...supplemental('sup-euclidean-circles')],'review'),
    group('Determinants','行列式',31,supplemental('sup-matrices')),
    group('Vectors and analytic geometry review','向量與解析幾何複習',32,chapterLessons('c2-6','s1-2','s1-3'),'review'),
    group('Complex numbers review','複數複習',46,chapterLessons('c2-7'),'review'),
    group('Matrices','矩陣',51,supplemental('sup-matrices')),
    group('School JAE-style practice','校本聯考類題練習',53,[], 'school-practice'),
  ]},
  {id:'g3-science',grade:3,stream:'science',documentId:'school-t06',filename:'T06高三理組數學思維本(2026).pdf',pdfPages:58,title:L('Senior 3 · Science','高三・理組'),groups:[
    group('Differentiation and integration','微分與積分',4,[...chapterLessons('s2-5'),...supplemental('sup-integrals')]),
    group('Space vectors and analytic geometry','空間向量與解析幾何',10,[...chapterLessons('s1-1'),...supplemental('sup-spatial-equations')]),
    group('Whole-course review','全課程總複習',18,lessons.map(item=>item.id),'review'),
  ]},
];
export const curriculumSources = [...books.map(book=>({...book,type:'textbook'})),...schoolRoutes.map(route=>({...route,type:'school-workbook',id:route.documentId}))];
export const syllabusSources = [
  {id:'jae-jm01-2027',code:'JM01',year:2027,pdfPages:6,filename:'2027 JM01 考試大綱',url:'https://www.must.edu.mo/images/JAE/JM01_Exam_Syllabus_2027.pdf'},
  {id:'jae-jm02-2027',code:'JM02',year:2027,pdfPages:5,filename:'2027 JM02 考試大綱',url:'https://www.must.edu.mo/images/JAE/JM02_Exam_Syllabus_2027.pdf'},
];
export const sourceById=new Map([...books.map(b=>({...b,id:b.documentId})),...schoolRoutes.map(r=>({...r,id:r.documentId})),...syllabusSources].map(source=>[source.id,source]));
export const relatedLessonIds=question=>lessonsForSkills(question.skills||[]).filter(id=>lessonById.has(id));
export const examinationCodes=id=>examCoverage.filter(exam=>exam.areas.some(a=>a.lessonIds.includes(id))||exam.inherits.some(code=>examCoverage.find(e=>e.code===code).areas.some(a=>a.lessonIds.includes(id)))).map(e=>e.code);
export function examinationCodesForQuestion(question){
 if(question.paperId)return [papers.find(p=>p.id===question.paperId)?.code].filter(Boolean);
 if(question.legacy)return ['JM01','JM02'];
 const ids=relatedLessonIds(question);
 if(ids.includes('s2-5-2')&&/e\^\{|\\(?:sin|cos|tan|ln|log)/.test(question.expression||''))return [];
 if(ids.includes('sup-matrices')){
  const systemOnly=/system/i.test(question.prompt.en)&&!/(?:pmatrix|vmatrix|det|A\^\{-1\})/.test(question.expression||'');
  return systemOnly?['JM01','JM02']:['JM02'];
 }
 return [...new Set(ids.flatMap(examinationCodes))];
}
export const schoolPathIds=id=>schoolRoutes.filter(route=>route.groups.some(g=>g.lessonIds.includes(id))).map(r=>r.id);
export function questionTopic(question) {
  const parent = lessonById.get(question.lessonId);
  if (parent) return {...parent, concepts:[], questions:[question], inquiry:undefined};
  return {id:question.lessonId,title:question.lessonTitle,summary:question.explanation,objectives:[],concepts:[],misconceptions:[],questions:[question]};
}
