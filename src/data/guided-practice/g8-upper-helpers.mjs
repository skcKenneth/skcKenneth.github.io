/** Fixed, original upper-volume practice; helpers assemble content, never randomise it. */
import { bi, question, makePack } from './shared.mjs';
export const B=bi;
export const VERSION='2026-10-14-upper-core-v1';
export const PDF='大湾区初中数学三维课堂（八年级上册）正文.pdf';
const titles=['與三角形有關的線段（1）','與三角形有關的線段（2）','與三角形有關的角（1）','三角形的外角','多邊形及其內角和（1）','多邊形及其內角和（2）','全等三角形','三角形全等的判定（SSS）','三角形全等的判定（SAS）','三角形全等的判定（ASA 和 AAS）','三角形全等的判定（HL）','三角形全等的判定（複習課）','角平分線的性質（1）','角平分線的性質（2）','軸對稱圖形','軸對稱圖形的性質','畫圖形的對稱軸','作軸對稱圖形','用坐標表示軸對稱','等腰三角形的性質','等腰三角形的判定','等邊三角形的性質與判定（1）','等邊三角形的性質與判定（2）','等腰三角形（綜合）','課題學習 最短路徑問題','同底數冪的乘法','冪的乘方','積的乘方','單項式與單項式相乘','單項式與多項式相乘','多項式與多項式相乘','平方差公式','完全平方公式','乘法公式（綜合）','整式的除法（1）','整式的除法（2）','因式分解（1）','因式分解（2）','因式分解（3）','從分數到分式','分式的基本性質與約分','分式乘除法（1）','分式乘除法（2）','分式的基本性質與通分','分式的加減','分式的混合運算','整數指數冪','科學記數法','分式方程（1）','分式方程（2）','分式方程（3）','分式方程（4）'];
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
export const lessons=range;
export function pack(id,nativeLesson,chapter,sourceLessons,title,summary,prerequisites,concept,inquiry,questions){
 const printedPages=sourceLessons.flatMap(n=>[2*n-1,2*n]);
 const chapterEn={'第十一章 三角形':'Chapter 11: triangles','第十二章 全等三角形':'Chapter 12: congruent triangles','第十三章 軸對稱':'Chapter 13: reflection symmetry','第十四章 整式的乘除與因式分解':'Chapter 14: polynomial operations and factorisation','第十五章 分式':'Chapter 15: rational expressions'}[chapter];
 const lessonRange=`${sourceLessons[0]}–${sourceLessons.at(-1)}`;
 return makePack({id,grade:'g8',nativeLesson,version:VERSION,title,summary,prerequisites,concept,inquiry,
  sourceNavigation:B(`Year 8, upper · ${chapterEn} · lessons ${lessonRange}`,`八上${chapter}・第${lessonRange}課時`),
  scope:B('Chapter-core practice after the mapped textbook lessons; these tasks do not replace every first-teaching period.','對應課本課時教學後的章節核心練習；這些題目不代替每一節新授課。'),
  taskTeacher:B('Use the worked model and guided attempt selectively, then the eight core questions. Keep further practice and extensions optional. Ask for a reason and an original-equation or expansion check.','按需要使用示範及帶做，再完成八題核心；補練及進階按程度選用。要求學生交代理由，並驗算原方程或展開核對。'),
  source:{fileName:PDF,foundationFileName:PDF.replace('正文','基础训练'),answerFileName:PDF.replace('正文','答案'),chapter,section:sourceLessons.map(n=>`第${n}課時 ${titles[n-1]}`).join('；'),foundationLessons:sourceLessons,foundationPages:sourceLessons,printedPages,pdfPages:printedPages.map(n=>n+3),sections:sourceLessons.map(n=>({lesson:n,title:titles[n-1],printedPages:[2*n-1,2*n],pdfPages:[2*n+2,2*n+3],foundationPages:[n],foundationPdfPages:[n+2]}))},questions});
}
export const pairs=rows=>rows.map(([en,zh])=>B(en,zh));
// Prose is rendered as text. Keep TeX only in dedicated MathExpression fields.
export function proseMath(input){
 const text=String(input);
 const group=start=>{if(text[start]!=='{')return null;let depth=1,end=start+1;while(end<text.length&&depth){if(text[end]==='{')depth++;if(text[end]==='}')depth--;end++;}return depth?null:{value:text.slice(start+1,end-1),end};};
 let result='';
 for(let i=0;i<text.length;){
  if(text.startsWith('\\frac',i)){const numerator=group(i+5),denominator=numerator&&group(numerator.end);if(numerator&&denominator){result+=`(${proseMath(numerator.value)})/(${proseMath(denominator.value)})`;i=denominator.end;continue;}}
  result+=text[i++];
 }
 const superscripts={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻','+':'⁺'};
 const power=value=>/^[+-]?\d+$/.test(value)?[...value].map(c=>superscripts[c]).join(''):`^(${value.replaceAll('*','×')})`;
 return result.replace(/\^\{([^{}]+)\}|\^([+-]?\d+)/g,(_,a,b)=>power(a??b)).replaceAll('\\times','×').replaceAll('\\cdot','·').replaceAll('\\div','÷').replaceAll('\\left','').replaceAll('\\right','').replaceAll('*','×');
}
const readable=value=>value&&typeof value==='object'&&typeof value.en==='string'?B(proseMath(value.en),proseMath(value['zh-Hant'])):value;
export function Q(role,suffix,sourceLessons,prompt,answer,steps,hints,rubric,fields={}){
 const result=question(role,suffix,{sourceLessons,prompt,answer,steps:pairs(steps),hints:pairs(hints),rubric:pairs(rubric),space:'short',...fields});
 for(const key of ['prompt','answer'])result[key]=readable(result[key]);
 for(const key of ['steps','hints','rubric','options','scaffold'])if(result[key])result[key]=result[key].map(readable);
 return result;
}
export function calc(role,suffix,sourceLessons,prompt,expression,expected,steps,fields={}){
 const geometryMethod=['triangle-sides','triangle-angles','polygon','special-triangle','concept'].includes(fields.audit?.kind);
 const displayFields=geometryMethod?{...fields,expression:undefined,answerExpression:expression}:fields;
 return Q(role,suffix,sourceLessons,prompt,B(`${expected}${fields.unit?' '+fields.unit:''}.`,`${expected}${fields.unit?' '+fields.unit:''}。`),steps,
  [['Identify the known quantities and the required quantity.','先辨認已知量及所求量。'],['Write the relevant equality before calculating.','計算前先寫出適用的等量關係。'],['Substitute carefully, retain signs and units, and check the result.','小心代入，保留正負號與單位，最後核對結果。']],
  [['Use the stated relationship and show the calculation.','使用題目所述關係並列出計算。'],['State the result with its unit where appropriate.','按題意寫出答案及單位。']],{type:'numeric',numericAnswer:String(expected).includes('/')?String(expected).split('/').map(Number).reduce((a,b)=>a/b):Number(expected),expression,audit:{kind:'arithmetic',expression,expected:String(expected)},...displayFields});
}
export function C(role,suffix,sourceLessons,prompt,options,steps,audit,diagram,fields={}){
 const answer=options[0];
 return Q(role,suffix,sourceLessons,prompt,answer,steps,
  [steps[0],steps[1]||steps[0],[`Compare with: ${answer.en}`,`核對：${answer['zh-Hant']}`]],
  [['Choose the statement justified by the stated conditions and explain why.','選出符合題目條件的敘述，並說明理由。']],{type:'choice',options,correctChoice:0,audit,...(diagram?{diagram}:{}),...fields});
}
export function poly(role,suffix,sourceLessons,original,result,rule,intermediate,fields={}){
 const steps=[ [rule.en,rule['zh-Hant']], [`${original} = ${intermediate||result}.`,`${original} = ${intermediate||result}。`] ];
 if(intermediate)steps.push([`Collect like terms to obtain ${result}.`,`合併同類項，得 ${result}。`]);
 steps.push(['Check the signs, coefficients and exponents in every term.','逐項核對正負號、係數及指數。']);
 return Q(role,suffix,sourceLessons,fields.prompt||B('Simplify completely, showing the relevant rule.','寫出所用法則，並完全化簡。'),B(`${result}.`,`${result}。`),steps,
 [[rule.en,rule['zh-Hant']],['Write one intermediate line without skipping products or signs.','寫出一行中間步驟，不要略去乘積或正負號。'],[`The simplified form is ${result}; explain each term.`,`化簡結果是 ${result}；交代每一項的來源。`]],
  [['Show the rule and a complete intermediate line.','寫出法則及完整中間步驟。'],['Give an algebraically equivalent simplified expression.','答案為代數上等值的最簡式。']],{type:'short',space:'working',expression:original,answerExpression:result,audit:{kind:'polynomial',original,result,variables:['x','y','a','b']},...fields});
}
export function factor(role,suffix,sourceLessons,original,result,method,reason,intermediate,fields={}){
 return Q(role,suffix,sourceLessons,fields.prompt||B('Factorise completely over the integers. Verify by expansion.','在整數範圍內完全因式分解，並展開核對。'),B(`${result}.`,`${result}。`),
 [[reason.en,reason['zh-Hant']],[`${original} = ${intermediate||result}.`,`${original} = ${intermediate||result}。`],[`The complete product is ${result}.`,`完整乘積為 ${result}。`],[`Expanding the product gives ${original}, the original expression.`,`展開所得乘積回到原式 ${original}。`]],
 [['Look for a common factor before choosing a formula.','套公式前先找公因式。'],[reason.en,reason['zh-Hant']],[`Write ${result}, then expand it to check.`,`寫成 ${result}，再展開核對。`]],
  [['Finish as a product of integer-coefficient factors.','最後寫成整係數因式的乘積。'],['Continue factoring when possible and verify the expansion.','可再分解時須繼續，並以展開核對。']],{type:'short',space:'working',expression:original,answerExpression:result,audit:{kind:'factorization',original,result,variables:['x','y','a','b'],method},...fields});
}
export function rational(role,suffix,sourceLessons,original,result,denominators,excluded,reason,intermediate,fields={}){
 const restriction=excluded.length?`x≠${excluded.join(', ')}`:'no variable restriction';
 const zhRestriction=excluded.length?`x≠${excluded.join('、')}`:'沒有字母禁值';
 return Q(role,suffix,sourceLessons,fields.prompt||B('Simplify and retain every restriction from the original expression.','化簡，並保留原式的所有取值限制。'),B(`${result}; ${restriction}.`,`${result}；${zhRestriction}。`),
 [[`First record ${restriction} from the original denominators and any divisor.`,`先由原分母及除式記錄 ${zhRestriction}。`],[reason.en,reason['zh-Hant']],[`${original} = ${intermediate||result}.`,`${original} = ${intermediate||result}。`],[`Therefore ${result}, with ${restriction} still required.`,`所以為 ${result}，仍須保留 ${zhRestriction}。`]],
 [['Find values that make an original denominator or a divisor zero.','先找使原分母或除式為零的取值。'],[reason.en,reason['zh-Hant']],[`The simplified expression is ${result}; keep ${restriction}.`,`化簡式為 ${result}；保留 ${zhRestriction}。`]],
  [['Use factor cancellation or a correct common denominator.','使用因式約分或正確通分。'],['Retain all original restrictions, including a nonzero divisor.','保留所有原限制，包括除式不為零。']],{type:'short',space:'working',expression:original,answerExpression:result,audit:{kind:'rational-expression',original,result,variable:'x',denominators,excluded:excluded.map(String)},...fields});
}
export function equation(role,suffix,sourceLessons,left,right,solutions,denominators,excluded,work,fields={}){
 const solutionText=solutions.length?solutions.map(x=>`x=${x}`).join(' or '):'No solution';
 const zhSolution=solutions.length?solutions.map(x=>`x=${x}`).join(' 或 '):'無解';
 return Q(role,suffix,sourceLessons,fields.prompt||B('Solve the equation. State the restrictions and check every candidate in the original equation.','解方程，寫出限制，並把每個候選值代回原方程檢驗。'),B(`${solutionText}.`,`${zhSolution}。`),work,
 [['Start with the forbidden values from the original denominators.','先列出原分母的禁值。'],['Multiply every term by the least common denominator, including standalone terms.','每一項均乘最簡公分母，包括沒有分母的整數項。'],['A candidate is a solution only when the original equation is defined and both sides agree.','候選值必須令原方程有意義，且兩邊相等，才是解。']],
 [['Show a complete equation after clearing denominators.','寫出完整的去分母方程。'],['Check original denominators and the original equality.','檢查原分母及原等式。']],{type:'short',space:'working',expression:`${left}=${right}`,audit:{kind:'equation',left,right,variable:'x',solutions:solutions.map(String),classification:solutions.length?'finite':'none',denominators,excluded:excluded.map(String)},...fields});
}
export function geometry(points,polygons=[['A','B','C']],extra={}){return {kind:'geometry',points:Object.entries(points).map(([id,[x,y]])=>({id,x,y})),polygons,...extra};}
export const BASE={A:[0,0],B:[4,0],C:[1,3],D:[7,1],E:[7,5],F:[4,2]};
export const RIGHT={A:[0,0],B:[3,0],C:[0,4],D:[7,1],E:[7,4],F:[3,1]};
const sidePoints=s=>[s[0],s[1]],anglePoints=s=>[s[0],s[1],s[2]];
export function congruenceAudit(criterion,givens,valid=true,points=BASE){return {kind:'congruence',points,triangles:[['A','B','C'],['D','E','F']],correspondence:['D','E','F'],criterion,givens,valid};}
export function congruenceDiagram(a){return geometry(a.points,a.triangles,{equalSegments:(a.givens.equalSides||[]).map(p=>p.map(sidePoints)),equalAngles:(a.givens.equalAngles||[]).map(p=>p.map(anglePoints)),rightAngles:(a.givens.rightAngles||[]).map(anglePoints)});}
export function congruence(role,suffix,sourceLessons,prompt,criterion,givens,proofLines,fields={}){
 const audit=congruenceAudit(criterion,givens,fields.valid??true,fields.points||BASE);
 const answer=fields.answer||B(`△ABC≅△DEF by ${criterion}, with A↔D, B↔E and C↔F.`,`△ABC≅△DEF（${criterion}），A↔D、B↔E、C↔F。`);
 return Q(role,suffix,sourceLessons,prompt,answer,proofLines,
 [['List the given equal sides and angles; preserve vertex correspondence.','列出已知等邊與等角，保持頂點對應。'],[`Check the exact conditions of ${criterion}; do not assume an unmarked fact.`,`檢查 ${criterion} 的完整條件，不可假設未標示的事實。`],['Write a criterion with reasons, followed by a corresponding-side or angle conclusion.','寫出有理由的全等判定，再推出對應邊或對應角結論。']],
 [['Use only given or independently proved facts.','只使用已知或已獨立證明的事實。'],['Keep the vertex order consistent. Other complete justified proofs are accepted.','頂點順序一致；其他完整且有據的證法亦接受。']],{type:'proof',space:'proof',audit,diagram:congruenceDiagram(audit),...fields});
}
export const isoPoints=(angle,side=5)=>({A:[0,side*Math.cos(angle*Math.PI/360)],B:[-side*Math.sin(angle*Math.PI/360),0],C:[side*Math.sin(angle*Math.PI/360),0]});
export const equilateralPoints=(side=6)=>({A:[0,Math.sqrt(3)*side/2],B:[-side/2,0],C:[side/2,0]});
export const right30Points=(hyp=10)=>({A:[0,0],B:[hyp,0],C:[3*hyp/4,Math.sqrt(3)*hyp/4]});
export function specialAudit(points,property,extra={}){return {kind:'special-triangle',points,triangle:['A','B','C'],property,proofDirection:'property',...extra};}
export function coordinateDiagram(points,axis,extra={}){
 const mirror=([x,y])=>axis==='x'?[x,-y]:[-x,y];
 return {kind:'coordinate',points:points.map(([id,x,y])=>({id,x,y})),solutionPoints:points.map(([id,x,y])=>{const [u,v]=mirror([x,y]);return {id:id+'′',x:u,y:v};}),bounds:[-6,6,-6,6],...extra};
}
export const commonProofRubric=[B('State all hypotheses and justify each deduction.','寫出所有前提，逐步交代理由。'),B('Do not assume the conclusion. Accept another complete justified proof.','不可先假設結論；其他完整且有據的證法亦接受。')];
