/** Original fixed lower-volume tasks. Display TeX and independent audit inputs are separate.
 * Closed audits: radical {original,result,valid,variable?,restrictions:[]};
 * radical-domain {radicands:[{a,b,denominator}],interval:{min,max,minInclusive,maxInclusive}};
 * pythagoras {known:{a?,b?,c?},request,expected,sides?,valid?};
 * quadrilateral {points,givens,request,expected,classification?,valid?};
 * linear-function {k,b,request,expected,x?,points?,lines?,domain?};
 * function-relation {pairs,valid}; statistics {values?,frequencies?,midpoints?,statistic,expected,denominator:'n',estimate?}.
 * Exact audit values are integers or rational strings; geometry coordinates are given evidence,
 * not an instruction to infer unmarked conditions from an illustration.
 */
import {bi,question,makePack} from './shared.mjs';
export const B=bi;
export const M=tex=>`\\(${tex}\\)`;
export const ROLES=['worked','guided','prior','prior','independent','independent','independent','independent','exit','exit','supplement','supplement','supplement','supplement','extension','extension'];
export const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
export const VERSION='2026-10-15-lower-core-v1';
const PDF='大湾区初中数学三维课堂（八年级下册）正文.pdf';
const chapters={16:B('Square-root expressions','二次根式'),17:B('Pythagorean theorem','勾股定理'),18:B('Parallelograms','平行四邊形'),19:B('Linear functions','一次函數'),20:B('Analysing data','數據的分析')};
const pairs=rows=>rows.map(row=>Array.isArray(row)?B(...row):row);
export function Q(role,suffix,sourceLessons,prompt,answer,steps,hints,audit,fields={}){
 if(hints.length!==3)throw Error(`Three hints required: ${suffix}`);
 const result=question(role,suffix,{type:'short',space:'working',sourceLessons,prompt,answer,steps:pairs(steps),hints:pairs(hints),rubric:[B('Use the stated conditions and justify the relation before calculating.','先使用所述條件，交代關係後才計算。'),B('Give an exact answer where possible, with units and any domain restrictions.','盡量寫精確答案，附上單位及取值限制。')],audit,...fields});
 if(role==='guided'&&!result.scaffold)result.scaffold=[B('Given condition: ____.','已知條件：____。'),B('Relevant relation: ____.','適用關係：____。'),B('Answer and check: ____.','答案及檢查：____。')];
 return result;
}
export function pack(id,nativeLesson,chapter,first,last,title,summary,prerequisites,concept,inquiry,questions){
 const textLessons=range(first,last),printedPages=[2*first-1,2*last],sourceNavigation=B(`Year 8, lower volume · Chapter ${chapter}: ${chapters[chapter].en} · lessons ${first}–${last}`,`八下第${chapter}章 ${chapters[chapter]['zh-Hant']}・第${first}–${last}課時`);
 return makePack({id,grade:'g8',nativeLesson,volume:'lower',version:VERSION,title,summary,prerequisites,concept,inquiry,sourceNavigation,printLayout:['pythagoras','quadrilaterals','function-intro','linear-function'].includes(nativeLesson)?'geometry-grid':'working-grid',
  source:{volume:'lower',fileName:PDF,chapter:B(`Chapter ${chapter}: ${chapters[chapter].en}`,`第${chapter}章 ${chapters[chapter]['zh-Hant']}`),section:B(`Textbook lessons ${first}–${last}`,`正文第${first}–${last}課時`),textLessons,printedPages,pdfPages:printedPages.map(n=>n+8),sections:textLessons.map(n=>({lesson:n,printedPages:[2*n-1,2*n],pdfPages:[2*n+7,2*n+8]}))},
  scope:B('Original chapter-core practice after the cited lower-volume textbook lessons. References identify skills; textbook exercises are not reproduced.','配合所列下冊正文課時學習後使用的原創章節核心練習。教材頁碼只作技能對照，不重刊教材習題。'),
  taskTeacher:B('Use the two prerequisite checks to choose support. Project the worked and guided tasks, then collect the eight paper core questions. Follow-ups and extensions are optional; accept other complete valid methods. This page does not save learners’ paper answers.','以兩題先備判斷支援需要；投影示範及帶做，再收集八題紙筆核心作答。補練及進階按需要選用，接受其他完整正確方法；本頁不保存學生紙筆答案。'),questions});
}
export const geom=(points,extra={})=>({kind:'geometry',points:Object.entries(points).map(([id,[x,y]])=>({id,x,y})),polygons:[Object.keys(points).slice(0,4)],...extra});
export const graph=(lines=[],points=[],bounds=[-5,5,-5,5],extra={})=>({kind:'function-graph',lines,points,bounds,...extra});
export function R(role,suffix,ls,{original,result,tex,answerTex,reason,intermediate,valid=true,variable,restrictions=[],...fields}){
 const rule=reason||B('Extract square factors first. The square-root symbol denotes the nonnegative root.','先提出完全平方因數；根號表示非負的算術平方根。');
 return Q(role,suffix,ls,fields.prompt||B('Simplify exactly. State any restriction that is needed.','精確化簡，並寫出所需限制。'),fields.answer||B(M(answerTex),M(answerTex)),[
  rule,B(intermediate?`An intermediate form is ${M(intermediate)}.`:`The simplified form is ${M(answerTex)}.`,intermediate?`中間一步為 ${M(intermediate)}。`:`化簡式為 ${M(answerTex)}。`),B('Check the original expression and the sign of the square-root value.','核對原式及算術平方根的正負號。')],
 [rule,B('Use products or quotients of square roots only under their real-domain conditions.','根式乘除法須符合實數範圍的條件。'),B(`Compare your result with ${M(answerTex)} and explain the simplification.`,`核對 ${M(answerTex)}，並解釋化簡步驟。`)],{kind:'radical',original,result,valid,restrictions,...(variable?{variable}:{})},{expression:tex,answerExpression:answerTex,...fields});
}
export function D(role,suffix,ls,{radicands,tex,interval,answerTex,...fields}){
 const denominator=radicands.some(r=>r.denominator);
 return Q(role,suffix,ls,B('Find all real values of x for which the expression is defined.','求使式子在實數範圍有意義的全部 x 值。'),B(M(answerTex),M(answerTex)),[
  B(denominator?'Every radicand must be nonnegative; a square root in a denominator must be strictly positive.':'Every radicand must be nonnegative.','每個被開方數須非負；位於分母的根式更須嚴格大於零。'),
  B('Solve the resulting linear inequalities, then take their common part.','解所得的一次不等式，再取共同部分。'),B(`The complete permitted set is ${M(answerTex)}.`,`全部允許取值為 ${M(answerTex)}。`)],
 [B('Start with the original radicands.','由原式的被開方數開始。'),B(denominator?'Do not allow a zero denominator.':'Zero is allowed under a square-root sign.','根號內可以為零，但分母不能為零。'),B('Check every endpoint in the original expression.','把每個端點代回原式檢查。')],{kind:'radical-domain',radicands,interval},{expression:tex,answerExpression:answerTex,...fields});
}
export function P(role,suffix,ls,{a,b,c,request,expected,answerTex,unit='cm',prompt,steps,diagram,...fields}){
 const squareTex=request==='leg'?`${c}^{2}-${a??b}^{2}`:`${a}^{2}+${b}^{2}`;
 return Q(role,suffix,ls,prompt,B(`${M(answerTex||String(expected))} ${unit}.`,`${M(answerTex||String(expected))} ${unit==='units'?'個單位':unit}。`),steps||[
  B(request==='leg'?'The hypotenuse is known; subtract the square of the known leg from its square.':'The right angle is given; add the two leg squares to find the hypotenuse square.','已知直角及斜邊位置；求斜邊時平方相加，求直角邊時從斜邊平方減去另一邊平方。'),
  B(`The required square is ${M(squareTex)}; take the positive square root.`,`所求邊的平方為 ${M(squareTex)}；取正平方根。`)],
 [B('Locate the right angle and the opposite hypotenuse.','先找直角及其對面的斜邊。'),B('Write the square relation before substituting.','先列平方關係，再代入。'),B('A length is positive; retain the stated unit.','邊長為正，並保留指定單位。')],{kind:'pythagoras',known:{...(a!==undefined?{a}:{}),...(b!==undefined?{b}:{}),...(c!==undefined?{c}:{})},request,expected:String(expected)},
 {type:Number.isFinite(Number(expected))?'numeric':'short',...(Number.isFinite(Number(expected))?{numericAnswer:Number(expected)}:{}),answerExpression:answerTex||String(expected),...(diagram?{diagram}:{}),...fields});
}
export function G(role,suffix,ls,{prompt,answer,points,givens,request,expected,steps,classification,valid=true,diagram,proof=false,...fields}){
 return Q(role,suffix,ls,prompt,answer,steps,[
  B('Separate the given conditions from the conclusion being requested.','分清已知條件及待證／待求結論。'),B('Choose the exact property or criterion; a picture alone cannot supply a condition.','選用準確性質或判定；不能從圖形外觀補上條件。'),B('Explain the conclusion using that relation and the original givens.','用該關係及原有條件交代結論。')],
 {kind:'quadrilateral',points,givens,request,expected,...(classification?{classification}:{}),valid},{type:proof?'proof':'short',space:proof?'proof':'working',diagram:diagram||geom(points),...fields});
}
export function F(role,suffix,ls,{k,b,request,expected,prompt,answer,steps,x,points,lines,domain,context,relation,expression,answerExpression,diagram,...fields}){
 return Q(role,suffix,ls,prompt,answer,steps,[B('Read the variables, axes and domain before using a formula.','先讀變量、坐標軸及取值範圍，再用公式。'),B('Substitute known coordinates or identify the intercept or common value that the task requests.','代入已知坐標，或辨認題目所求截距／共同值。'),B('Check the result in the original relation and retain any endpoint condition.','代回原關係檢查，並保留端點條件。')],
 {kind:'linear-function',k,b,request,expected,...(x!==undefined?{x}:{}),...(points?{points}:{}),...(lines?{lines}:{}),...(domain?{domain}:{}),...(context?{context}:{}),...(relation?{relation}:{})},{...(expression?{expression}:{}),...(answerExpression?{answerExpression}:{}),...(diagram?{diagram}:{}),...fields});
}
export function S(role,suffix,ls,{values,frequencies,midpoints,statistic,expected,prompt,answer,steps,estimate=false,groups,transform,bins,modeConvention,diagram,...fields}){
 return Q(role,suffix,ls,prompt,answer,steps,[B('Identify the observations and any frequencies or weights.','辨認原數據及頻數或權重。'),B(statistic==='variance'?'Use the mean, square each deviation, sum, and divide by the number of observations.':statistic==='median'?'Sort the data and locate the central position or positions.':statistic==='modes'?'Compare all frequencies and retain every tied highest value.':'Form a weighted total and divide by the total weight.','按所求指標處理：平均數看總量與權重，中位數先排序，眾數看最高頻數，方差看離均差平方。'),B(estimate?'Group midpoints give an estimate; original observations are not known exactly.':'Check the original data; do not discard a value merely because it is extreme.','用組中值所得只是估計；不能因數值極端而隨意刪去。')],
 {kind:'statistics',...(values?{values}:{}),...(frequencies?{frequencies}:{}),...(midpoints?{midpoints}:{}),statistic,expected,denominator:'n',estimate,...(groups?{groups}:{}),...(transform?{transform}:{}),...(bins?{bins}:{}),...(modeConvention?{modeConvention}:{})},{...(diagram?{diagram}:{}),...fields});
}
