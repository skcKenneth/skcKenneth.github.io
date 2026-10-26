import * as algebra from './g10-inquiries-algebra.mjs';
import * as functions from './g10-inquiries-functions.mjs';
import * as geometry from './g10-inquiries-geometry.mjs';

export const bi=(en,zh)=>({en,'zh-Hant':zh});
export const inquiryTitle=bi('Senior 1 · short mathematical inquiries','高一・數學短探究');
export const inquirySummary=bi('85 bilingual, 5–10 minute inquiries across 14 chapters. Predict, compare cases and explain on paper.','14 章、85 個雙語短探究。每項 5–10 分鐘，先預測、比較例子，再在紙上講清楚理由。');
const chapterData=[
 ['sets',4,'Sets','集合'],['logic',4,'Mathematical logic','常用邏輯用語'],['quadratic-inequality',4,'Quadratic inequalities','一元二次不等式'],['polynomial-division',4,'Polynomial division and remainders','多項式除法與餘式定理'],['function-properties',15,'Functions and their properties','函數概念與性質'],['exponential',9,'Exponential and logarithmic functions','指數函數與對數函數'],['trigonometry',12,'Trigonometric functions','三角函數'],['vectors',6,'Plane vectors','平面向量'],['solve-triangles',5,'Solving triangles','解三角形'],['solid',6,'Solid geometry','立體幾何初步'],['variation',4,'Variation','變數法'],['polynomial-gcd',3,'Polynomial factors and multiples','多項式公因式與公倍式'],['partial-fractions',4,'Partial fractions','部分分式'],['space-relations',5,'Parallelism and perpendicularity in space','空間中的平行與垂直'],
];
export const chapters=chapterData.map(([lesson,count,en,zh],i)=>({id:String(i+1).padStart(2,'0'),lesson,count,title:bi(en,zh),kind:i<7?'core':i<10?'supplement':'additional',kindLabel:i<7?bi('Core topics','核心課題'):i<10?bi('Syllabus supplement','大綱補充'):bi('Additional mathematics','附加數學')}));
const groups=[algebra,functions,geometry];
export const inquiries=groups.flatMap(group=>group.activities).sort((a,b)=>a.id.localeCompare(b.id));
export const inquiryBase=(locale='en')=>`${locale==='zh-Hant'?'/zh':''}/teaching/senior-math/inquiries/`;
export const inquiryUrl=(id,locale='en')=>inquiryBase(locale)+(id?`${id}/`:'');
export const inquiryActivityId=id=>`school:inquiry:${id}`;
export const inquiryNoteId=activity=>activity.nativeActivityId||inquiryActivityId(activity.id);
export function studentCases(activity){
 if(activity.cases.length<=3)return activity.cases;
 const chosen=activity.cases.slice(0,3);
 if(!chosen.some(c=>c.boundary))chosen[2]=activity.cases.find(c=>c.boundary)||chosen[2];
 if(chosen.every(c=>c.boundary))chosen[2]=activity.cases.find(c=>!c.boundary)||chosen[2];
 return activity.cases.filter(c=>chosen.includes(c));
}
export function evaluateInquiry(id,params,locale='en'){
 const group=groups.find(group=>group.activities.some(activity=>activity.id===id));
 if(!group)throw new RangeError('Unknown Senior 1 inquiry');
 return group.evaluate(id,params,locale);
}
export function coverageRows(){return chapters.map(chapter=>({...chapter,activities:inquiries.filter(activity=>activity.chapter===chapter.id),requiredIds:Array.from({length:chapter.count},(_,i)=>`g10-${chapter.id}-${String(i+1).padStart(2,'0')}`)}));}
export function createInquirySearchCatalog(locale='en'){
 const other=locale==='en'?'zh-Hant':'en',entry=(id,url,title,excerpt,aliases)=>({id,url,alternateUrl:url.replace(inquiryBase(locale),inquiryBase(other)),title,excerpt,aliases:[...aliases,'高一探究','高一互動探究','Senior 1 inquiries','Grade 10',id],kind:'teaching',archived:false,topicIds:['mathematical-thinking','teaching-research-practice']});
 return [entry('g10-inquiries',inquiryBase(locale),inquiryTitle[locale],inquirySummary[locale],Object.values(inquiryTitle)),...inquiries.map(activity=>entry(inquiryActivityId(activity.id),inquiryUrl(activity.id,locale),activity.title[locale],activity.question[locale],[...Object.values(activity.title),...Object.values(chapters.find(c=>c.id===activity.chapter).title)]))];
}
export {directStateForCase,directAction,directScene} from './g10-inquiries-functions.mjs';
