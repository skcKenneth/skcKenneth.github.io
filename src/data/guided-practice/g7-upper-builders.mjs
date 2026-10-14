import { bi, question, makePack } from './shared.mjs';

export const B=bi;
export const ROLES=['worked','guided','prior','prior','independent','independent','independent','independent','exit','exit','supplement','supplement','supplement','supplement','extension','extension'];
export const PDF='大湾区初中数学三维课堂（七年级上册）正文.pdf';
export const text = value => String(value).replaceAll('-', '−');
export const number = value => {
  if(typeof value==='number')return value;
  const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);
};
export const scalar = value => String(value).includes('/')?`\\frac{${String(value).split('/')[0]}}{${String(value).split('/')[1]}}`:String(value);

export function item(role,suffix,fields){
  const result=question(role,suffix,{type:'short',space:'working',...fields});
  if(!result.sourceLessons?.length)throw new Error(`Missing source lesson for ${suffix}`);
  if(result.hints?.length!==3)throw new Error(`Three hints required for ${suffix}`);
  if(role==='guided'&&!result.scaffold)result.scaffold=[B('Write the relevant rule or relation: ____.','寫出適用規則或關係：____。'),B('Show an intermediate line: ____.','寫出中間一步：____。'),B('State the answer and check it: ____.','寫答案並檢查：____。')];
  return result;
}

export function arithmetic(role,suffix,{en,zh,expression,expected,steps,hints,lessons,skill='signed-arithmetic',showExpression=true,...extra}){
  return item(role,suffix,{type:'numeric',skill,sourceLessons:lessons,prompt:B(en,zh),...(showExpression?{expression}:{}),numericAnswer:number(expected),answerExpression:showExpression?scalar(expected):expression,answer:B(`The value is ${text(expected)}.`,`結果是 ${text(expected)}。`),steps,hints,audit:{kind:'arithmetic',expression,expected:String(expected)},rubric:[B('Apply the relevant sign and order rules to every operation.','每一步都正確使用符號及運算次序規則。'),B('Show an intermediate calculation and obtain the exact stated value.','寫出中間計算，求得所列精確結果。')],...extra});
}

export function equation(role,suffix,{en,zh,left,right,solution,steps,hints,lessons,skill='linear-equation',denominators=[],show=true,context,...extra}){
  return item(role,suffix,{type:'numeric',skill,sourceLessons:lessons,prompt:B(en,zh),...(show?{expression:`${left}=${right}`}:{ }),numericAnswer:number(solution),answerExpression:`x=${scalar(solution)}`,answer:B(`x = ${text(solution)}.`,`x＝${text(solution)}。`),steps,hints,audit:{kind:'equation',left,right,variable:'x',solutions:[String(solution)],classification:'finite',denominators,excluded:[],...(context?{context}:{})},rubric:[B('Use the original equality and apply each operation to both sides.','以原方程為準，每項運算都作用於等式兩邊。'),B('Obtain the solution and check it in the original equation or situation.','求出解，並代回原方程或情境檢查。')],...extra});
}

export function polynomial(role,suffix,{en,zh,original,result,variables=['x'],values,expected,steps,hints,lessons,skill='polynomial-simplification',...extra}){
  const display=text(result).replace(/\^(\d)/g,(_,n)=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(n)]);
  return item(role,suffix,{type:values?'numeric':'short',skill,sourceLessons:lessons,prompt:B(en,zh),expression:original,...(values?{numericAnswer:number(expected),answerExpression:scalar(expected)}:{answerExpression:result}),answer:B(values?`The value is ${text(expected)}.`:`${display}.`,values?`結果是 ${text(expected)}。`:`${display}。`),steps,hints,audit:{kind:'polynomial',original,result,variables,...(values?{values,expected:String(expected)}:{})},rubric:[B('Keep each sign and collect only terms with the same variable powers.','保留各項符號，只合併字母及其指數相同的項。'),B(values?'Substitute the stated values into the complete expression and calculate.':'Give an equivalent simplified expression.',values?'把指定數值代入完整式子，再計算。':'寫出與原式等值的化簡式。')],...extra});
}

export function concept(role,suffix,{en,zh,answer,steps,hints,lessons,rule,facts,valid=true,skill=rule,...extra}){
  return item(role,suffix,{skill,sourceLessons:lessons,prompt:B(en,zh),answer,steps,hints,audit:{kind:'concept',rule,facts,valid},rubric:[B('State the applicable definition or condition accurately.','準確寫出適用定義或條件。'),B('Support the conclusion with the given numbers, a check or a concrete counterexample.','用已知數值、檢查或具體反例支持結論。')],...extra});
}

export function segment(role,suffix,{en,zh,points,check='distance',segments,expected,steps,hints,lessons,...extra}){
  const vertices=Object.entries(points).map(([id,[x,y]])=>({id,x,y}));
  return item(role,suffix,{type:'numeric',skill:`segment-${check}`,sourceLessons:lessons,prompt:B(en,zh),numericAnswer:number(expected),answer:B(`${text(expected)} cm.`,`${text(expected)} cm。`),steps,hints,diagram:{kind:'geometry',points:vertices,edges:[['A','B']],caption:B('Points are shown in the stated order; use the given lengths.','圖中點依所述次序排列；以已知長度計算。')},audit:{kind:'segment',points,check,segments,expected:String(expected)},rubric:[B('Use the stated order or midpoint condition before adding or halving.','相加或取一半之前，先用題目指定的點次序或中點條件。'),B('Give the correct length with its unit.','寫出正確長度及單位。')],...extra});
}

export function angle(role,suffix,{en,zh,degrees,operation,expected,steps,hints,lessons,diagram,answer,...extra}){
  return item(role,suffix,{type:'numeric',skill:`angle-${operation}`,sourceLessons:lessons,prompt:B(en,zh),numericAnswer:number(expected),answer:answer||B(`${text(expected)}°.`,`${text(expected)}°。`),steps,hints,...(diagram?{diagram}:{}),audit:{kind:'angle',degrees:degrees.map(String),operation,expected:String(expected)},rubric:[B('Identify the correct angle relation and retain all stated position conditions.','辨認正確角度關係，並保留題目所述的位置條件。'),B('Show the calculation and give the angle with its unit.','寫出計算，並附上角度單位。')],...extra});
}

export function upperPack({id,title,summary,chapter,section,first,last,nativeLesson,questions,...fields}){
  const foundationLessons=Array.from({length:last-first+1},(_,i)=>first+i);
  return makePack({id,grade:'g7',nativeLesson,version:'2026-10-14-upper-core-v1',title,summary,
    source:{fileName:PDF,chapter,section,printedPages:[2*first-1,2*last],pdfPages:[2*first+2,2*last+3],foundationLessons,foundationPages:[first,last]},
    sourceNavigation:B(`Year 7, upper volume · ${chapter.en}`,`七上・${chapter['zh-Hant']}`),
    scope:B('A 40-minute selection of original core practice after studying the cited textbook lessons. It is not a replacement for every lesson in the chapter.','學過所列教材課時後使用的 40 分鐘原創核心練習；並非取代本章逐課時教學。'),
    taskTeacher:B('Use the prerequisite checks to choose support, project the worked and guided items, then let learners work on paper. Select supplements or extensions as needed. No learner answers are saved by this presentation.','以先備題判斷支援需要，投影示範及帶做，再讓學生紙筆練習。按需要選補練或延伸；此展示不保存學生答案。'),
    ...fields,questions});
}

export function opposite(role,suffix,value,lesson){
  const expected=String(-number(value));
  return arithmetic(role,suffix,{en:`Write the opposite of ${text(value)} and explain its position relative to 0.`,zh:`寫出 ${text(value)} 的相反數，並說明它與 0 的位置關係。`,expression:`-(${scalar(value)})`,expected,lessons:[lesson],skill:'opposite-number',
    steps:[B(`The two points have the same distance from 0.`,`兩點到 0 的距離相同。`),B(`The opposite of ${text(value)} is ${text(expected)}.`,`${text(value)} 的相反數是 ${text(expected)}。`)],
    hints:[B('Use the definition of opposite numbers.','使用相反數的定義。'),B('Keep the distance from 0 and reverse the direction.','到 0 的距離不變，方向相反。'),B('Change the sign; 0 is its own opposite.','改變符號；0 的相反數仍是 0。')],
    diagram:{kind:'number-line',min:-8,max:8,step:2,points:[{id:'P',value:number(value)}]},
  });
}

export function absolute(role,suffix,value,lesson){
  const expected=String(Math.abs(number(value)));
  return concept(role,suffix,{en:`Find the absolute value of ${text(value)}. Explain why a distance cannot be negative.`,zh:`求 ${text(value)} 的絕對值，並說明為甚麼距離不會是負數。`,lessons:[lesson],rule:'absolute-value',facts:{value:String(value),claimed:expected},answer:B(`|${text(value)}| = ${text(expected)}.`,`|${text(value)}|＝${text(expected)}。`),type:'numeric',numericAnswer:number(expected),
    steps:[B('Absolute value is distance from 0 on a number line.','絕對值是數軸上到 0 的距離。'),B(`That distance is ${text(expected)}, so the absolute value is ${text(expected)}.`,`該距離是 ${text(expected)}，所以絕對值是 ${text(expected)}。`)],
    hints:[B('Locate the number relative to 0.','先找出該數與 0 的位置。'),B('Measure distance, not direction.','量度距離，不記方向。'),B('A positive input stays positive; a negative input gives its opposite.','正數的絕對值是本身，負數的絕對值是其相反數。')],
  });
}

export function scientific(role,suffix,value,mantissa,exponent,lesson){
  const superscript=String(exponent).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]).join('');
  return item(role,suffix,{skill:'scientific-notation',sourceLessons:[lesson],prompt:B(`Write ${value} in scientific notation. State the allowed range of the coefficient.`,`把 ${value} 寫成科學記數法，並指出係數的範圍。`),expression:String(value),answer:B(`${mantissa} × 10${superscript}; the coefficient is at least 1 and less than 10.`,`${mantissa}×10${superscript}；本題係數大於或等於 1、小於 10。`),
    steps:[B(`Move the decimal point ${exponent} places left to obtain ${mantissa}.`,`把小數點向左移 ${exponent} 位，得到 ${mantissa}。`),B(`Compensate by multiplying by 10${superscript}; check the original value.`,`乘回 10${superscript} 補償，再核對原數。`)],
    hints:[B('Put the decimal point after the first nonzero digit.','把小數點放在第一個非零數字後。'),B('Count how many places the decimal point moves.','數清楚小數點移動的位數。'),B('For these positive large numbers, use a positive whole-number exponent.','本題是正的大數，使用正整數指數。')],
    rubric:[B('Use a coefficient from 1 inclusive to 10 exclusive.','係數大於或等於 1、小於 10。'),B('Give an exponent that restores the original number exactly.','指數能把式子還原成原來的數。')],audit:{kind:'scientific-notation',value:String(value),mantissa:String(mantissa),exponent},
  });
}

export function monomial(role,suffix,{expression,coefficient,powers,request,lesson}){
  const degree=Object.values(powers).reduce((a,b)=>a+b,0),claimed=request==='degree'?String(degree):String(coefficient);
  return concept(role,suffix,{en:`For the monomial below, find its ${request}. Explain which part of the term is counted.`,zh:`求下列單項式的${request==='degree'?'次數':'係數'}，並說明所看的是哪一部分。`,expression,lessons:[lesson],rule:'monomial-data',facts:{expression,coefficient:String(coefficient),powers,request,claimed},type:'numeric',numericAnswer:number(claimed),answer:B(`The ${request} is ${text(claimed)}.`,`${request==='degree'?'次數':'係數'}是 ${text(claimed)}。`),
    steps:[B(request==='degree'?'Add the exponents of the variables; do not include the numerical coefficient.':'The coefficient is the complete numerical factor, including its sign.',request==='degree'?'把所有字母的指數相加，不計數字係數。':'係數是完整的數字因數，須保留符號。'),B(request==='degree'?(Object.keys(powers).length?`The exponent sum is ${Object.values(powers).join(' + ')} = ${degree}.`:`There are no variable factors. The nonzero constant ${text(coefficient)} has degree 0.`):`The numerical factor is ${text(coefficient)}.`,request==='degree'?(Object.keys(powers).length?`指數和是 ${Object.values(powers).join('＋')}＝${degree}。`:`沒有字母因數；非零常數 ${text(coefficient)} 的次數是 0。`):`數字因數是 ${text(coefficient)}。`)],
    hints:[B('Separate the numerical factor from the variable factors.','分清數字因數與字母因數。'),B(request==='degree'?(Object.keys(powers).length?'An unwritten variable exponent is 1.':'This term contains no variable factors.'):'For −x, the coefficient is −1, not 1.',request==='degree'?(Object.keys(powers).length?'字母沒有寫出的指數是 1。':'本項沒有字母因數。'):'−x 的係數是 −1，不是 1。'),B(request==='degree'?(Object.keys(powers).length?'Add all variable exponents.':'A nonzero constant has degree 0.'):'Keep a fractional or negative numerical factor intact.',request==='degree'?(Object.keys(powers).length?'把全部字母指數相加。':'非零常數的次數是 0。'):'把分數或負數係數完整保留。')],
  });
}
