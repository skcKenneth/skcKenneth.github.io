import { G7_PACKS } from './g7.mjs';
import { G8_PACKS } from './g8.mjs';
import { G7_UPPER_PACKS } from './g7-upper.mjs';
import { G8_UPPER_PACKS } from './g8-upper.mjs';
import { G7_LOWER_PACKS } from './g7-lower.mjs';
import { G8_LOWER_PACKS } from './g8-lower.mjs';
import { G8_LOWER_INQUIRIES } from './g8-lower-inquiries.mjs';
import { bi } from './shared.mjs';

const aliases = {
  'g7-equations-collect':['合併同類項','合并同类项','解一元一次方程','初一第三章3.2','七上第三章第二節','初一第三章第二節','collect like terms','combining like terms','Year 7 equations','Year 7 upper Chapter 3 section 3.2'],
  'g7-equations-transpose':['移項','移项','驗算','解一元一次方程','初一第三章3.2','七上第三章第二節','初一第三章第二節','transposition','transpose equations','verify a solution','Year 7 equations','Year 7 upper Chapter 3 section 3.2'],
  'g8-bisector-distances':['角的平分線的性質','角平分線','垂直距離','角的平分线的性质','angle-bisector property','angle bisector distances','perpendicular distance'],
  'g8-bisector-converse':['角的平分線的性質','角平分線逆命題','HL','條件辨析','角平分线逆命题','angle-bisector converse','hypotenuse leg','angle bisector conditions'],
  'g8-symmetry-recognition':['軸對稱圖形','軸對稱','對稱軸數目','轴对称图形','reflection symmetry','line symmetry','recognise symmetry'],
  'g8-perpendicular-bisector':['軸對稱的性質','線段垂直平分線','等距','线段垂直平分线','perpendicular bisector','equidistant points','properties of reflection'],
  'g8-symmetry-axis-construction':['畫對稱軸','作對稱軸','對稱軸作圖','画对称轴','construct symmetry axes','draw a symmetry axis','symmetry axis construction'],
};

const sourceNavigation = pack => pack.grade==='g7'
  ? bi('Year 7, upper volume · Chapter 3 §3.2','七上第三章第二節')
  : pack.nativeLesson==='congruence'
    ? bi('Year 8, upper volume · congruent triangles · angle bisectors','八上全等三角形・角平分線')
    : bi('Year 8, upper volume · reflection symmetry','八上軸對稱');

export const PRACTICE_PACKS = [...G7_PACKS, ...G8_PACKS].map(pack=>({ ...pack, aliases:aliases[pack.id]||[], sourceNavigation:sourceNavigation(pack) }));
/** The original seven remain a stable regression set; all routes use the complete registry. */
export const UPPER_PRACTICE_PACKS=[...G7_UPPER_PACKS,...G8_UPPER_PACKS].map(pack=>{const navigation=pack.sourceNavigation||pack.source.sourceNavigation;return {...pack,aliases:[...(pack.aliases||[]),...Object.values(navigation||{})],sourceNavigation:navigation};});
export const LOWER_PRACTICE_PACKS=[...G7_LOWER_PACKS,...G8_LOWER_PACKS].map(pack=>{const navigation=pack.sourceNavigation||pack.source.sourceNavigation,inquiry=G8_LOWER_INQUIRIES[pack.id];return {...pack,...(inquiry?{inquiry:inquiry.text,inquiryStages:inquiry.stages}:{}),aliases:[...(pack.aliases||[]),...Object.values(navigation||{})],sourceNavigation:navigation};});
export const ALL_PRACTICE_PACKS=[...PRACTICE_PACKS,...UPPER_PRACTICE_PACKS,...LOWER_PRACTICE_PACKS];
export const getPracticePack = id => ALL_PRACTICE_PACKS.find(pack=>pack.id===id)||null;
export { G7_PACKS, G8_PACKS };
