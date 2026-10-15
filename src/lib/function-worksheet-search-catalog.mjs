import {chapterTitle,chapterSubtitle,functionWorksheets,worksheetBase,worksheetUrl,worksheetActivityId} from '../data/function-worksheets.mjs';

export const FUNCTION_WORKSHEET_TOPIC_IDS = ['mathematical-thinking','teaching-research-practice'];
const chapterAliases = [
 ...Object.values(chapterTitle), '第三章 函數', 'Chapter 3 Functions', '第三章', 'Chapter 3',
 '函數', 'functions', 'function inquiry', '函數探究', '高一', '高一文組', 'Senior 1', 'Senior 1 arts',
];

/** Public teaching entrances only; worked answers and private source metadata stay out of search records. */
export function createFunctionWorksheetSearchCatalog(locale='en') {
 const other=locale==='en'?'zh-Hant':'en';
 const entry=(id,url,alternateUrl,title,excerpt,aliases)=>({
  id,url,alternateUrl,title,excerpt,aliases:[...new Set([id,...aliases,...chapterAliases])],
  kind:'teaching',archived:false,topicIds:[...FUNCTION_WORKSHEET_TOPIC_IDS],
 });
 return [
  entry('senior:function-worksheets',worksheetBase(locale),worksheetBase(other),chapterTitle[locale],chapterSubtitle[locale],['function-worksheets']),
  ...functionWorksheets.map(lesson=>entry(worksheetActivityId(lesson.id),worksheetUrl(lesson.id,locale),worksheetUrl(lesson.id,other),lesson.title[locale],lesson.focus[locale],Object.values(lesson.title))),
 ];
}
