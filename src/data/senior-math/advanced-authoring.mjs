import { L, S, Q, lesson, chapterReview } from './authoring.mjs';
export const p = L;
export const choose = (n,k) => { if (k<0||k>n) return 0; let x=1; for(let i=1;i<=k;i++) x=x*(n-i+1)/i; return x; };
export const factorial = n => { let x=1; for(let i=2;i<=n;i++) x*=i; return x; };
export const clean = x => Number(x.toPrecision(12));
export function mathematicalResult(raw,formula) {
  let math=formula.replaceAll('′',String.raw`\prime`).replaceAll('²','^2').replaceAll('³','^3').replaceAll('%',String.raw`\%`);
  // Narrative conclusions stay in the explanation; the summary introduces the displayed relation.
  if(!/[=<>≤≥≠^{}\\+*/|·]/.test(math)) math=String.raw`\text{${math}}`;
  raw.result=p('The requested relation or conclusion is shown below.','所求關係或結論如下。');
  raw.resultMath=math;
  return raw;
}
const bridgeTranslations = new Map([
 ['Group the equally likely outcomes with one head.','把只有一個正面的等可能結果合併。'],
 ['Count faces strictly above d.','計算嚴格大於 d 的骰子點數。'],
 ['All third components are zero.','所有第三分量均為零。'],['Subtract the equations.','把兩個方程相減。'],
 ['Handle k=0 before using a discriminant.','使用判別式前，先獨立處理 k=0。'],['Compare consecutive terms.','比較相鄰兩項。'],
 ['Try an index related to the constant term.','嘗試與常數項有關的下標。'],['Treat A,B as one block.','把 A、B 視為一個區塊。'],
 ['Terms with r≥2 contain 100.','r≥2 的各項均含因子100。'],['Substitute x=1.','代入 x=1。'],['Substitute x=-1 in (1+x)^m.','在 (1+x)^m 中代入 x=−1。'],
 ['Use Bayes with P(red)=1/2.','以 P(紅)=1/2 運用貝葉斯公式。'],['After a red draw, total=t+1 and blue=2.','抽出紅球後，總數為 t+1，藍球仍為2。'],
 ['Compare the intersection with the product.','比較交集概率與兩概率的乘積。'],['X=0 corresponds to faces 1,3,5.','X=0 對應骰子點數1、3、5。'],
 ['Add probabilities at t and t+1.','把取值 t、t+1 的概率相加。'],['Outcomes HT and TH give X=1.','正反及反正兩個結果均給 X=1。'],
 ['Map each support value through Y=2X+1.','把每個可能取值代入 Y=2X+1。'],['Check nonnegativity as well as the total.','除了總和，亦須檢查非負性。'],
 ['Net gain=payment-2.','淨收益＝派發額−2。'],['Square the outcomes before averaging.','先把取值平方，再取加權平均。'],
 ['Standardise each bound.','把每個界限分別標準化。'],['A continuous distribution assigns zero mass to a point.','連續分佈的單點概率為零。'],
 ['Consider confounding and study design.','考慮混雜因素及研究設計。'],['Compare the target x with the observed interval.','比較目標 x 與觀察區間。'],
 ['All expected cells are 3u/2.','全部期望格數均為3u/2。'],['Check whether rows share participants.','檢查各列是否包含相同參與者。'],
 ['Divide each term by x.','把每項分別除以 x。'],['Opposite angles sum to 180^\\circ.','對角之和為180°。'],
 ['The perpendicular from center bisects the chord.','圓心到弦的垂線平分此弦。'],['Area ratio=(2/3)^2','面積比為 (2/3)²。'],
 ['Substitute both coordinates.','代入兩個座標。'],['Try the feasible ray (x,y)=(s,0).','嘗試可行射線 (x,y)=(s,0)。'],
 ['Vertices (0,0),(t,0),(0,2t).','頂點為 (0,0)、(t,0)、(0,2t)。'],['The objective equals the bounded constraint.','目標式與受界限的限制式相同。'],
 ['Evaluate vertices (0,0),(t,0),(0,t).','計算頂點 (0,0)、(t,0)、(0,t) 的目標值。'],['The lower boundary is feasible.','下方邊界是可行的。'],
 ['A triangular determinant is the diagonal product.','三角矩陣的行列式為對角元素乘積。'],['Compute both products separately.','把兩個乘積分別計算。'],
 ['Add equations to eliminate y.','把兩式相加以消去 y。'],['Use the triangular inverse and verify AA^{-1}=I.','求三角矩陣的逆，並驗證 AA⁻¹=I。'],
 ['The second equation is twice the first.','第二式為第一式的兩倍。'],['Multiply by r and use r²=x²+y².','兩邊乘 r，再使用 r²=x²+y²。'],
 ['The point is on the negative x-axis.','此點位於負 x 軸。'],['Raise the power and divide by the new exponent.','提高次方，並除以新的指數。'],
 ['Use odd symmetry or the antiderivative.','使用奇函數對稱性或原函數。'],['Use the oriented determinant formula.','使用帶方向的行列式公式。'],
 ['Equate all three coordinates.','令全部三個座標分別相等。'],['Area=|u×v|','面積＝|u×v|。'],
 ['Add equations and translate the parameter interval.','把兩式相加，並轉換參數區間。'],['x=1/s cannot equal zero.','x=1/s 不可能等於零。'],
 ['sin s≥0 on the stated interval.','在所指定區間中 sin s≥0。'],['Tail=a q³/(1−q)','餘項和為 aq³/(1−q)。'],
 ['Finite partial sum=t(1−1/(N+1)).','有限部分和為 t(1−1/(N+1))。'],['Inspect even and odd partial sums.','比較偶數及奇數項的部分和。'],
 ['Reflect A to A\\prime=(0,-1).','把 A 對稱至 A′=(0,−1)。'],
 ['n·u=0 and the initial point is in the plane.','n·u=0，且起點在平面上。'],
 ['Both the constant part and parameter coefficient vanish.','常數部分及參數係數須同時為零。'],
 ['The radius is normal to the tangent.','半徑是切線的法向量。'],
 ['Substitution cancels the quadratic terms.','代入後二次項會相消。'],['Try n=t.','嘗試 n=t。'],
]);
export function n(en,zh,expression,answer,strategy,bridge,derivation,explanation,conditions=[]) {
  if (!Number.isFinite(answer)) throw new Error(`Invalid advanced answer: ${en}`);
  return {kind:'number',prompt:p(en,zh),expression,answer:clean(answer),strategy,bridge,derivation,
    result:p(`The requested value is ${clean(answer)}.`,`所求值為 ${clean(answer)}。`),explanation,conditions};
}
export function w(en,zh,expression,result,strategy,bridge,derivation,explanation,conditions=[]) {
  return {kind:'written',prompt:p(en,zh),expression,answer:result,result,strategy,bridge,derivation,explanation,conditions};
}
const levels=['foundation','standard','transfer','foundation','foundation','foundation','foundation','standard','standard','standard','standard','transfer','transfer'];
// Worked examples and subsequent practice use different values and seven distinct task families.
const families=[0,4,6,0,1,2,3,3,4,5,6,5,6];
export function makeQuestion(raw,kind,level,skill) {
  const translated=bridgeTranslations.get(raw.bridge);
  const hint=translated?p(raw.bridge,translated):typeof raw.bridge==='object'?raw.bridge:{...p('Use this intermediate relation.','使用此中間關係式。'),math:raw.bridge};
  const steps=[S(raw.strategy.en,raw.strategy.zh),...raw.derivation.map(math=>S('Apply the stated relation and retain its conditions.','運用所列關係式，並保留適用條件。',math)),S(raw.explanation.en,raw.explanation.zh)];
  return Q(kind||raw.kind,level,raw.prompt.en,raw.prompt.zh,raw.expression,raw.answer,
    [raw.strategy,hint],steps,raw.result,raw.explanation,
    {conditions:raw.conditions,misconceptions:raw.misconceptions||[],skills:[skill],tolerance:1e-7,...(raw.resultMath?{resultMath:raw.resultMath}:{}),...(raw.kind==='written'?{rubric:[p('State a valid definition or model and its assumptions.','寫出有效的定義或模型及其假設。'),p('Show the intermediate mathematical relations, not only the final claim.','展示中間數學關係，不只寫出結論。'),p('Check exclusions, units or the interpretation of the result.','檢查排除值、單位或結果的意義。')]}:{})});
}
export function build(meta,bank) {
  return lesson({...meta,questions:levels.map((level,i)=>{
    const raw=bank(families[i],i+2); if(!raw.conditions.length) raw.conditions=[meta.concepts.at(-1).body]; raw.misconceptions=meta.misconceptions;
    return makeQuestion(raw,i<3?'example':undefined,level,meta.id);
  })});
}
export function review(chapter,banks) {
  const questions=Array.from({length:15},(_,i)=>{
    const level=i<6?'foundation':i<12?'standard':'transfer';
    const family=i<6?i%4:i<12?3+i%3:5+i%2;
    const entry=banks[i%banks.length];
    const raw=entry.bank(family,20+i); if(!raw.conditions.length) raw.conditions=[entry.meta.concepts.at(-1).body]; raw.misconceptions=entry.meta.misconceptions;
    return makeQuestion(raw,undefined,level,entry.id);
  });
  return chapterReview(chapter.id,p(`${chapter.title.en}: mixed review`,`${chapter.title.zh}：混合複習`),questions);
}
export function meta(id,title,page,focus,concepts,misconceptions,prerequisites,inquiry,source) {
  const [bookId,chapter,section]=id.split('-');
  const chapterId=`${bookId}-${chapter}`;
  return {id,bookId,chapterId,section:`${chapter}.${section}`,title,
    summary:focus,source:source||{documentId:`textbook-${bookId}`,pdfPage:page+5,printedPage:page,section:`${chapter}.${section}`},
    objectives:[focus,p('Justify the method and check the conditions in a new situation.','在新情境中說明方法的理由，並檢查適用條件。')],concepts,misconceptions,prerequisites,
    teacher:{prompts:[focus,p(`Which condition is essential in ${title.en.toLowerCase()}?`,`「${title.zh}」中哪一個條件不可缺少？`),inquiry.prediction],
      board:concepts.map(c=>({...p(`${c.title.en}: ${c.body.en}`,`${c.title.zh}：${c.body.zh}`),...(c.formula?{math:c.formula}:{})})),
      anticipated:misconceptions,rubric:[p('1 mark: choose the correct representation and conditions.','1分：選取正確表示法及條件。'),p('1 mark: establish the intermediate relation.','1分：建立中間關係式。'),p('1 mark: complete a connected calculation or proof.','1分：完成連貫的計算或證明。'),p('1 mark: interpret and check the conclusion.','1分：解釋並檢查結論。')]},inquiry};
}
export const c=(en,zh,bodyEn,bodyZh,formula)=>({title:p(en,zh),body:p(bodyEn,bodyZh),...(formula?{formula}: {})});
export const inquiry=(type,pEn,pZh,eEn,eZh,tEn,tZh)=>({type,prediction:p(pEn,pZh),explanation:p(eEn,eZh),transfer:p(tEn,tZh)});
