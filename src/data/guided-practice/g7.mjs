import { bi, question, makePack } from './shared.mjs';

const linear = (a, b, c, d) => ({ kind:'linear', left:{a,b}, right:{a:c,b:d} });
const equation = (role, suffix, fields) => question(role, suffix, {
  type:'numeric', space:'working',
  answer:bi(`x = ${fields.numericAnswer}.`, `x＝${fields.numericAnswer}。`),
  rubric:[bi('Combine only like terms and keep both sides equal.', '只合併同類項，並保持等式兩邊相等。'),bi('Find the stated value and check it in the original equation.', '求出所列數值，並代回原方程檢驗。')],
  ...fields,
});

export const G7_PACKS = [
  makePack({
    id:'g7-equations-collect', grade:'g7', nativeLesson:'linear-equation',
    title:bi('Linear equations: collect like terms', '一元一次方程：合併同類項'),
    summary:bi('Collect variable terms on the same side, handle negative coefficients and check each solution. A 40-minute projection and paper lesson.', '合併同一邊的字母項、處理負係數，再驗算解；40 分鐘投影與紙筆課堂。'),
    prerequisites:bi('Signed-number addition, the meaning of a coefficient, like terms and the equality rules.', '有理數加法、係數、同類項及等式的性質。'),
    concept:bi('For like terms, add their signed coefficients and keep the variable. After collecting terms, divide both sides by the nonzero coefficient.', '合併同類項時，把帶符號的係數相加，字母不變。合併後，等式兩邊同除以非零係數。'),
    inquiry:bi('Project 3x − 5x = 10. Ask for the combined coefficient before solving. Compare 3 − 5 with 5 − 3 and test the two proposed solutions in the original equation.', '投影 3x−5x＝10，先問合併後的係數，再求解。比較 3−5 與 5−3，把兩個候選解代回原方程。'),
    taskTeacher:bi('Keep the signs attached to the terms. Use the guided scaffold before independent work; ask learners to show the collected equation and a substitution check on paper. Brackets, denominator clearing and systems are outside this lesson.', '讓正負號跟隨各項。先帶做，再獨立練習；要求學生在紙上寫合併後的方程及代回檢驗。本節不涉及去括號、去分母或方程組。'),
    source:{fileName:'大湾区初中数学三维课堂（七年级上册）正文.pdf',chapter:'第三章 一元一次方程',section:'3.2',printedPages:[59,60],pdfPages:[62,63],foundationLesson:30,foundationPages:[30]},
    questions:[
      equation('worked','combine-positive',{
        skill:'collect-positive-coefficients', prompt:bi('Solve 3x + 2x = 25. Explain what is added when like terms are collected.', '解方程 3x＋2x＝25，並說明合併同類項時相加的是甚麼。'), expression:String.raw`3x+2x=25`, numericAnswer:5, audit:linear(5,0,0,25),
        steps:[bi('The terms are like terms: 3x + 2x = 5x. The coefficients are added.', '兩項是同類項：3x＋2x＝5x，相加的是係數。'),bi('The equation becomes 5x = 25. Divide both sides by 5 to get x = 5.', '方程成為 5x＝25，兩邊同除以 5，得 x＝5。'),bi('Check: 3 × 5 + 2 × 5 = 15 + 10 = 25.', '檢驗：3×5＋2×5＝15＋10＝25。')],
        hints:[bi('Compare the variables in the two terms.', '比較兩項的字母。'),bi('Add 3 and 2; keep x.', '把 3 與 2 相加，保留 x。'),bi('After collecting, solve 5x = 25.', '合併後解 5x＝25。')],
      }),
      equation('guided','collect-then-subtract',{
        skill:'collect-then-solve', prompt:bi('Solve 7x − 3x + 6 = 22. Complete the three lines on paper before checking.', '解方程 7x−3x＋6＝22。先在紙上補完三行，再核對。'), expression:String.raw`7x-3x+6=22`, numericAnswer:4, audit:linear(4,6,0,22),
        scaffold:[bi('7x − 3x = ____ x, so ____ x + 6 = 22.', '7x−3x＝____ x，所以 ____ x＋6＝22。'),bi('Subtract 6 from both sides: ____ x = ____.', '兩邊同減 6：____ x＝____。'),bi('Divide both sides by ____: x = ____. Then substitute.', '兩邊同除以 ____：x＝____，再代回檢驗。')],
        steps:[bi('Collect the variable terms: 7x − 3x = 4x, so 4x + 6 = 22.', '合併字母項：7x−3x＝4x，所以 4x＋6＝22。'),bi('Subtract 6 from both sides: 4x = 16. Divide both sides by 4: x = 4.', '兩邊同減 6，得 4x＝16；兩邊同除以 4，得 x＝4。'),bi('Check: 7 × 4 − 3 × 4 + 6 = 28 − 12 + 6 = 22.', '檢驗：7×4−3×4＋6＝28−12＋6＝22。')],
        hints:[bi('Collect 7x and −3x; leave the constant 6 separate.', '合併 7x 與 −3x，常數 6 另列。'),bi('Use the signed coefficients: 7 − 3 = 4.', '計算帶符號的係數：7−3＝4。'),bi('Solve 4x + 6 = 22 by subtracting 6, then dividing by 4.', '先同減 6，再同除以 4，解 4x＋6＝22。')],
      }),
      question('prior','signed-coefficients',{
        type:'numeric', skill:'signed-coefficient-addition', prompt:bi('Complete 3x − 5x = ____ x. Write only the coefficient.', '補上 3x−5x＝____ x，只寫係數。'), expression:String.raw`3x-5x=\underline{\qquad}x`, numericAnswer:-2, answer:bi('The coefficient is −2: 3x − 5x = −2x.', '係數是 −2：3x−5x＝−2x。'), audit:{kind:'sum',values:[3,-5],result:-2},
        steps:[bi('The signed coefficients are 3 and −5.', '帶符號的係數是 3 和 −5。'),bi('3 + (−5) = −2; keep x.', '3＋（−5）＝−2，保留 x。')],
        hints:[bi('Keep the minus sign with 5x.', '把負號保留在 5x 前。'),bi('The coefficient calculation is 3 − 5.', '係數的計算是 3−5。'),bi('The difference is negative because 5 is larger than 3.', '5 大於 3，所以差是負數。')],
        rubric:[bi('Identify −5 as the second signed coefficient.', '認出第二個帶符號的係數是 −5。'),bi('Give −2 and retain the variable in the completed expression.', '填 −2，補完的式子保留字母。')],
      }),
      equation('prior','negative-coefficient',{
        type:'short', skill:'divide-negative-coefficient', prompt:bi('For −4x = 20, what should both sides be divided by to make the coefficient of x equal to 1? State the solution and check it.', '對於 −4x＝20，兩邊應同除以甚麼數，才能使 x 的係數成為 1？寫出解並檢驗。'), expression:String.raw`-4x=20`, numericAnswer:-5, audit:linear(-4,0,0,20),
        answer:bi('Divide both sides by −4, not 4. Then x = −5 and −4 × (−5) = 20.', '兩邊同除以 −4，不是 4，得 x＝−5；檢驗 −4×（−5）＝20。'),
        steps:[bi('Divide both sides by −4: x = −5.', '兩邊同除以 −4，得 x＝−5。'),bi('Check: −4 × (−5) = 20.', '檢驗：−4×（−5）＝20。')],
        hints:[bi('The coefficient of x is −4, not 4.', 'x 的係數是 −4，不是 4。'),bi('Divide both sides by the whole signed coefficient.', '兩邊同除以完整的帶符號係數。'),bi('A positive number divided by a negative number is negative.', '正數除以負數，商是負數。')],
      }),
      equation('independent','positive-sum',{
        skill:'collect-positive-coefficients', prompt:bi('Solve 4x + 3x = 42.', '解方程 4x＋3x＝42。'), expression:String.raw`4x+3x=42`, numericAnswer:6, audit:linear(7,0,0,42),
        steps:[bi('Collect like terms: 7x = 42.', '合併同類項，得 7x＝42。'),bi('Divide both sides by 7: x = 6.', '兩邊同除以 7，得 x＝6。'),bi('Check: 4 × 6 + 3 × 6 = 42.', '檢驗：4×6＋3×6＝42。')],
        hints:[bi('The two terms have the same variable.', '兩項的字母相同。'),bi('Add the coefficients 4 and 3.', '把係數 4 和 3 相加。'),bi('Solve 7x = 42.', '解 7x＝42。')],
      }),
      equation('independent','constant-negative',{
        skill:'collect-then-solve', prompt:bi('Solve 9x − 5x − 3 = 13.', '解方程 9x−5x−3＝13。'), expression:String.raw`9x-5x-3=13`, numericAnswer:4, audit:linear(4,-3,0,13),
        steps:[bi('Collect the variable terms: 4x − 3 = 13.', '合併字母項，得 4x−3＝13。'),bi('Add 3 to both sides: 4x = 16. Divide by 4: x = 4.', '兩邊同加 3，得 4x＝16；同除以 4，得 x＝4。'),bi('Check: 9 × 4 − 5 × 4 − 3 = 13.', '檢驗：9×4−5×4−3＝13。')],
        hints:[bi('Do not combine the constant −3 with the x terms.', '不要把常數 −3 與含 x 的項合併。'),bi('9x − 5x = 4x.', '9x−5x＝4x。'),bi('Remove −3 by adding 3 to both sides.', '兩邊同加 3，消去左邊的 −3。')],
      }),
      equation('independent','negative-solution',{
        skill:'collect-negative-coefficients', prompt:bi('Solve 2x − 7x = 30.', '解方程 2x−7x＝30。'), expression:String.raw`2x-7x=30`, numericAnswer:-6, audit:linear(-5,0,0,30),
        steps:[bi('2 − 7 = −5, so −5x = 30.', '2−7＝−5，所以 −5x＝30。'),bi('Divide both sides by −5: x = −6.', '兩邊同除以 −5，得 x＝−6。'),bi('Check: 2 × (−6) − 7 × (−6) = −12 + 42 = 30.', '檢驗：2×（−6）−7×（−6）＝−12＋42＝30。')],
        hints:[bi('Keep the order 2 − 7.', '保留 2−7 的次序。'),bi('The combined coefficient is −5.', '合併後的係數是 −5。'),bi('Divide 30 by −5.', '計算 30 除以 −5。')],
      }),
      equation('independent','negative-terms-and-constant',{
        skill:'collect-negative-coefficients', prompt:bi('Solve −6x + x + 8 = −12.', '解方程 −6x＋x＋8＝−12。'), expression:String.raw`-6x+x+8=-12`, numericAnswer:4, audit:linear(-5,8,0,-12),
        steps:[bi('The coefficient of x alone is 1: −6x + x = −5x.', '單獨的 x 的係數是 1：−6x＋x＝−5x。'),bi('−5x + 8 = −12. Subtract 8: −5x = −20. Divide by −5: x = 4.', '−5x＋8＝−12；同減 8，得 −5x＝−20；同除以 −5，得 x＝4。'),bi('Check: −6 × 4 + 4 + 8 = −12.', '檢驗：−6×4＋4＋8＝−12。')],
        hints:[bi('Write x as 1x before collecting.', '先把 x 看成 1x。'),bi('−6 + 1 = −5.', '−6＋1＝−5。'),bi('After collecting, subtract 8 from both sides.', '合併後，兩邊同減 8。')],
      }),
      equation('exit','two-negative-terms',{
        skill:'collect-negative-coefficients', prompt:bi('Solve −3x − 2x = 15. Include a substitution check.', '解方程 −3x−2x＝15，並代回檢驗。'), expression:String.raw`-3x-2x=15`, numericAnswer:-3, audit:linear(-5,0,0,15),
        steps:[bi('−3x − 2x = −5x, so −5x = 15.', '−3x−2x＝−5x，所以 −5x＝15。'),bi('Divide both sides by −5: x = −3.', '兩邊同除以 −5，得 x＝−3。'),bi('Check: −3 × (−3) − 2 × (−3) = 9 + 6 = 15.', '檢驗：−3×（−3）−2×（−3）＝9＋6＝15。')],
        hints:[bi('Both signed coefficients are negative.', '兩個帶符號的係數都是負數。'),bi('Add −3 and −2.', '把 −3 和 −2 相加。'),bi('Divide 15 by the combined coefficient −5.', '把 15 除以合併後的係數 −5。')],
      }),
      equation('exit','diagnose-sign',{
        type:'short', skill:'diagnose-coefficient-sign', prompt:bi('For 4x − 7x = 18, a learner writes 3x = 18 and x = 6. Identify the first error, correct the solution and check it.', '解 4x−7x＝18 時，學生寫成 3x＝18，得 x＝6。指出第一個錯誤、改正並驗算。'), expression:String.raw`4x-7x=18`, numericAnswer:-6, audit:linear(-3,0,0,18),
        answer:bi('4 − 7 = −3, not 3. Thus −3x = 18 and x = −6. Substitution gives −24 + 42 = 18.', '4−7＝−3，不是 3。所以 −3x＝18，得 x＝−6；代回得 −24＋42＝18。'),
        steps:[bi('The first error is losing the sign when calculating 4 − 7.', '第一個錯誤是計算 4−7 時漏掉負號。'),bi('Correct it to −3x = 18, then divide both sides by −3: x = −6.', '改成 −3x＝18，兩邊同除以 −3，得 x＝−6。'),bi('Check the original equation: 4 × (−6) − 7 × (−6) = 18.', '檢驗原方程：4×（−6）−7×（−6）＝18。')],
        hints:[bi('Check the line before x = 6.', '先檢查 x＝6 之前的一行。'),bi('Is 4 − 7 positive or negative?', '4−7 是正數還是負數？'),bi('Use −3 as the coefficient and test the resulting solution.', '用 −3 作係數，再檢驗所得的解。')],
        rubric:[bi('Locate the error at 4x − 7x = 3x.', '指出錯誤出在把 4x−7x 寫成 3x。'),bi('Correct to −3x and x = −6, with a valid substitution check.', '改成 −3x，求得 x＝−6，並正確代回檢驗。')],
      }),
      equation('supplement','positive-coefficient-negative-rhs',{
        skill:'collect-then-solve', prompt:bi('Solve 8x − 2x = −24.', '解方程 8x−2x＝−24。'), expression:String.raw`8x-2x=-24`, numericAnswer:-4, audit:linear(6,0,0,-24),
        steps:[bi('Collect: 6x = −24.', '合併得 6x＝−24。'),bi('Divide both sides by 6: x = −4.', '兩邊同除以 6，得 x＝−4。'),bi('Check: 8 × (−4) − 2 × (−4) = −24.', '檢驗：8×（−4）−2×（−4）＝−24。')],
        hints:[bi('Subtract the signed coefficients.', '計算帶符號的係數。'),bi('8 − 2 = 6.', '8−2＝6。'),bi('A negative number divided by 6 remains negative.', '負數除以 6，商仍是負數。')],
      }),
      equation('supplement','negative-coefficient-positive-constant',{
        skill:'collect-negative-coefficients', prompt:bi('Solve 5x − 9x + 7 = 27.', '解方程 5x−9x＋7＝27。'), expression:String.raw`5x-9x+7=27`, numericAnswer:-5, audit:linear(-4,7,0,27),
        steps:[bi('Collect: −4x + 7 = 27.', '合併得 −4x＋7＝27。'),bi('Subtract 7: −4x = 20. Divide by −4: x = −5.', '同減 7，得 −4x＝20；同除以 −4，得 x＝−5。'),bi('Check: 5 × (−5) − 9 × (−5) + 7 = 27.', '檢驗：5×（−5）−9×（−5）＋7＝27。')],
        hints:[bi('Combine the x terms, keeping their signs.', '保留符號，合併含 x 的項。'),bi('5 − 9 = −4.', '5−9＝−4。'),bi('First remove +7, then divide by −4.', '先消去 ＋7，再同除以 −4。')],
      }),
      equation('supplement','all-negative-left',{
        skill:'collect-negative-coefficients', prompt:bi('Solve −2x − 5x − 9 = 12.', '解方程 −2x−5x−9＝12。'), expression:String.raw`-2x-5x-9=12`, numericAnswer:-3, audit:linear(-7,-9,0,12),
        steps:[bi('Collect: −7x − 9 = 12.', '合併得 −7x−9＝12。'),bi('Add 9: −7x = 21. Divide by −7: x = −3.', '同加 9，得 −7x＝21；同除以 −7，得 x＝−3。'),bi('Check: −2 × (−3) − 5 × (−3) − 9 = 12.', '檢驗：−2×（−3）−5×（−3）−9＝12。')],
        hints:[bi('The coefficients are −2 and −5.', '係數是 −2 和 −5。'),bi('Their sum is −7.', '它們的和是 −7。'),bi('Add 9 to both sides before dividing.', '同除之前，先兩邊同加 9。')],
      }),
      equation('supplement','three-variable-terms',{
        skill:'collect-three-terms', prompt:bi('Solve 10x − 6x + 3x = −14.', '解方程 10x−6x＋3x＝−14。'), expression:String.raw`10x-6x+3x=-14`, numericAnswer:-2, audit:linear(7,0,0,-14),
        steps:[bi('10 − 6 + 3 = 7, so 7x = −14.', '10−6＋3＝7，所以 7x＝−14。'),bi('Divide both sides by 7: x = −2.', '兩邊同除以 7，得 x＝−2。'),bi('Check: 10 × (−2) − 6 × (−2) + 3 × (−2) = −14.', '檢驗：10×（−2）−6×（−2）＋3×（−2）＝−14。')],
        hints:[bi('All three variable terms are like terms.', '三個字母項都是同類項。'),bi('Calculate 10 − 6 + 3 in order.', '按次序計算 10−6＋3。'),bi('Solve 7x = −14.', '解 7x＝−14。')],
      }),
      equation('extension','unit-coefficient-after-collecting',{
        skill:'collect-three-terms', prompt:bi('Solve 12x − 8x − 3x − 9 = 0. Explain why x remains after collecting the variable terms.', '解方程 12x−8x−3x−9＝0，說明合併字母項後為甚麼剩下 x。'), expression:String.raw`12x-8x-3x-9=0`, numericAnswer:9, audit:linear(1,-9,0,0),
        steps:[bi('12 − 8 − 3 = 1, so the variable terms combine to 1x = x.', '12−8−3＝1，所以字母項合併為 1x，即 x。'),bi('x − 9 = 0. Add 9 to both sides: x = 9.', 'x−9＝0；兩邊同加 9，得 x＝9。'),bi('Check: 12 × 9 − 8 × 9 − 3 × 9 − 9 = 0.', '檢驗：12×9−8×9−3×9−9＝0。')],
        hints:[bi('Do not omit the coefficient of −3x.', '不要漏掉 −3x 的係數。'),bi('Compute 12 − 8 − 3, not 12 − 8 + 3.', '計算 12−8−3，不是 12−8＋3。'),bi('The coefficient is 1; now solve x − 9 = 0.', '係數是 1，再解 x−9＝0。')],
      }),
      equation('extension','mixed-three-terms',{
        skill:'collect-three-terms', prompt:bi('Solve −2x − 4x + 3x + 17 = −1. Check without changing the original order of the terms.', '解方程 −2x−4x＋3x＋17＝−1；按原來各項的次序代回檢驗。'), expression:String.raw`-2x-4x+3x+17=-1`, numericAnswer:6, audit:linear(-3,17,0,-1),
        steps:[bi('−2 − 4 + 3 = −3, so −3x + 17 = −1.', '−2−4＋3＝−3，所以 −3x＋17＝−1。'),bi('Subtract 17: −3x = −18. Divide by −3: x = 6.', '同減 17，得 −3x＝−18；同除以 −3，得 x＝6。'),bi('Check: −2 × 6 − 4 × 6 + 3 × 6 + 17 = −12 − 24 + 18 + 17 = −1.', '檢驗：−2×6−4×6＋3×6＋17＝−12−24＋18＋17＝−1。')],
        hints:[bi('There are three signed variable coefficients.', '留意三個帶符號的字母係數。'),bi('Combine −2, −4 and +3.', '合併 −2、−4 和 ＋3。'),bi('After subtracting 17, both sides are negative.', '兩邊同減 17 後，兩邊都是負數。')],
      }),
    ],
  }),
  makePack({
    id:'g7-equations-transpose', grade:'g7', nativeLesson:'linear-equation',
    title:bi('Linear equations: transpose and verify', '一元一次方程：移項與驗算'),
    summary:bi('Solve equations with variable terms on both sides, explain each sign change and verify in the original equation. A 40-minute paper-first lesson.', '解兩邊含未知數的方程，解釋移項變號，再代回原方程；40 分鐘紙筆為主的課堂。'),
    prerequisites:bi('Collecting like terms, signed-number operations and applying the same operation to both sides of an equality.', '合併同類項、有理數運算及等式兩邊同做運算。'),
    concept:bi('Transposition abbreviates adding or subtracting the same term on both sides. A term changes sign when it is moved across the equality sign, not merely when it changes place on the same side.', '移項是等式兩邊同加或同減一項的簡寫。項跨過等號時要變號；只在同一邊改寫位置並不因此變號。'),
    inquiry:bi('Project 5x − 7 = 2x + 8. Ask the class to describe subtracting 2x on both sides, then adding 7 on both sides. Compare the full operations with the shorter transposition line.', '投影 5x−7＝2x＋8，讓全班說出兩邊同減 2x、再同加 7，比較完整運算與移項簡寫。'),
    taskTeacher:bi('Ask what was done to both sides before accepting a transposition line. Accept different valid orders. Verify using the original equation, not only the last simplified line. Do not introduce bracket removal, denominator clearing or systems.', '接受移項之前，先問等式兩邊做了甚麼。接受不同但正確的運算次序。必須代回原方程，不只檢查最後一行。本節不加入去括號、去分母或方程組。'),
    source:{fileName:'大湾区初中数学三维课堂（七年级上册）正文.pdf',chapter:'第三章 一元一次方程',section:'3.2',printedPages:[61,62],pdfPages:[64,65],foundationLesson:31,foundationPages:[31]},
    questions:[
      equation('worked','variables-on-both-sides',{
        skill:'transpose-both-sides', prompt:bi('Solve 5x − 7 = 2x + 8. Explain the operation behind each transposition.', '解方程 5x−7＝2x＋8，說明每次移項背後的運算。'), expression:String.raw`5x-7=2x+8`, numericAnswer:5, audit:linear(5,-7,2,8),
        steps:[bi('Subtract 2x from both sides: 3x − 7 = 8.', '兩邊同減 2x，得 3x−7＝8。'),bi('Add 7 to both sides: 3x = 15. The short line is 5x − 2x = 8 + 7.', '兩邊同加 7，得 3x＝15。移項簡寫為 5x−2x＝8＋7。'),bi('Divide both sides by 3: x = 5.', '兩邊同除以 3，得 x＝5。'),bi('Check: left side 5 × 5 − 7 = 18; right side 2 × 5 + 8 = 18.', '檢驗：左邊 5×5−7＝18；右邊 2×5＋8＝18。')],
        hints:[bi('Choose one side for the variable terms.', '先選一邊集中含未知數的項。'),bi('Remove +2x from the right by subtracting 2x on both sides.', '兩邊同減 2x，消去右邊的 ＋2x。'),bi('Remove −7 from the left by adding 7 on both sides.', '兩邊同加 7，消去左邊的 −7。')],
      }),
      equation('guided','negative-coefficient-after-transposing',{
        skill:'transpose-to-negative-coefficient', prompt:bi('Solve 4x + 9 = 7x − 6 by collecting the variable terms on the left. Complete each line.', '把含未知數的項集中在左邊，解 4x＋9＝7x−6，補完每一行。'), expression:String.raw`4x+9=7x-6`, numericAnswer:5, audit:linear(4,9,7,-6),
        scaffold:[bi('Subtract 7x on both sides: ____ x + 9 = −6.', '兩邊同減 7x：____ x＋9＝−6。'),bi('Subtract 9 on both sides: ____ x = ____.', '兩邊同減 9：____ x＝____。'),bi('Divide both sides by ____: x = ____.', '兩邊同除以 ____：x＝____。'),bi('Original left side = ____; original right side = ____.', '原方程左邊＝____；右邊＝____。')],
        steps:[bi('Subtract 7x: −3x + 9 = −6.', '兩邊同減 7x，得 −3x＋9＝−6。'),bi('Subtract 9: −3x = −15. Divide by −3: x = 5.', '兩邊同減 9，得 −3x＝−15；同除以 −3，得 x＝5。'),bi('Check: 4 × 5 + 9 = 29 and 7 × 5 − 6 = 29.', '檢驗：4×5＋9＝29，7×5−6＝29。')],
        hints:[bi('4x − 7x has a negative coefficient.', '4x−7x 的係數是負數。'),bi('The transposition line is 4x − 7x = −6 − 9.', '移項簡寫為 4x−7x＝−6−9。'),bi('Divide −15 by −3.', '計算 −15 除以 −3。')],
      }),
      equation('prior','undo-addition',{
        type:'short', skill:'equality-subtract-same-number', prompt:bi('For x + 7 = 2, which operation removes +7 while keeping both sides equal? Use it to find x.', '對於 x＋7＝2，甚麼運算能消去 ＋7 並保持兩邊相等？用它求出 x。'), expression:String.raw`x+7=2`, numericAnswer:-5, audit:linear(1,7,0,2),
        answer:bi('Subtract 7 from both sides, giving x = 2 − 7 = −5.', '兩邊同減 7，得 x＝2−7＝−5。'),
        steps:[bi('Subtract 7 from both sides: x = 2 − 7 = −5.', '兩邊同減 7：x＝2−7＝−5。'),bi('Check: −5 + 7 = 2.', '檢驗：−5＋7＝2。')],
        hints:[bi('Undo the +7.', '消去 ＋7。'),bi('Subtract 7 on the left and on the right.', '左邊和右邊都減 7。'),bi('Calculate 2 − 7.', '計算 2−7。')],
      }),
      equation('prior','undo-negative-coefficient',{
        skill:'divide-negative-coefficient', prompt:bi('Solve −3x = 12 and check the sign of your solution.', '解方程 −3x＝12，並檢查解的正負號。'), expression:String.raw`-3x=12`, numericAnswer:-4, audit:linear(-3,0,0,12),
        steps:[bi('Divide both sides by −3: x = −4.', '兩邊同除以 −3，得 x＝−4。'),bi('Check: −3 × (−4) = 12.', '檢驗：−3×（−4）＝12。')],
        hints:[bi('Use −3 as the divisor, including its sign.', '用 −3 作除數，保留它的負號。'),bi('A positive number divided by a negative number is negative.', '正數除以負數，商是負數。'),bi('Check the product of −3 and your answer.', '檢查 −3 與答案的乘積。')],
      }),
      equation('independent','positive-variable-difference',{
        skill:'transpose-both-sides', prompt:bi('Solve 6x − 5 = 3x + 10.', '解方程 6x−5＝3x＋10。'), expression:String.raw`6x-5=3x+10`, numericAnswer:5, audit:linear(6,-5,3,10),
        steps:[bi('Subtract 3x and add 5 on both sides: 6x − 3x = 10 + 5.', '兩邊同減 3x、同加 5：6x−3x＝10＋5。'),bi('3x = 15, so x = 5.', '3x＝15，所以 x＝5。'),bi('Check: 6 × 5 − 5 = 25 and 3 × 5 + 10 = 25.', '檢驗：6×5−5＝25，3×5＋10＝25。')],
        hints:[bi('Keep variable terms on one side and constants on the other.', '把含未知數的項集中一邊，常數項集中另一邊。'),bi('Moving +3x to the left gives −3x; moving −5 to the right gives +5.', '＋3x 移到左邊成為 −3x；−5 移到右邊成為 ＋5。'),bi('Solve 3x = 15.', '解 3x＝15。')],
      }),
      equation('independent','negative-variable-difference',{
        skill:'transpose-to-negative-coefficient', prompt:bi('Solve 2x + 11 = 5x − 7.', '解方程 2x＋11＝5x−7。'), expression:String.raw`2x+11=5x-7`, numericAnswer:6, audit:linear(2,11,5,-7),
        steps:[bi('Subtract 5x and 11 on both sides: 2x − 5x = −7 − 11.', '兩邊同減 5x、同減 11：2x−5x＝−7−11。'),bi('−3x = −18. Divide by −3: x = 6.', '−3x＝−18；同除以 −3，得 x＝6。'),bi('Check: 2 × 6 + 11 = 23 and 5 × 6 − 7 = 23.', '檢驗：2×6＋11＝23，5×6−7＝23。')],
        hints:[bi('Collecting x terms on the left is valid even if the coefficient becomes negative.', '即使係數成為負數，也可以把含 x 的項集中左邊。'),bi('2 − 5 = −3; −7 − 11 = −18.', '2−5＝−3；−7−11＝−18。'),bi('Divide both sides by −3.', '兩邊同除以 −3。')],
      }),
      equation('independent','negative-leading-term',{
        skill:'transpose-with-negative-terms', prompt:bi('Solve −4x + 3 = x − 12.', '解方程 −4x＋3＝x−12。'), expression:String.raw`-4x+3=x-12`, numericAnswer:3, audit:linear(-4,3,1,-12),
        steps:[bi('Subtract x and 3 on both sides: −4x − x = −12 − 3.', '兩邊同減 x、同減 3：−4x−x＝−12−3。'),bi('−5x = −15. Divide by −5: x = 3.', '−5x＝−15；同除以 −5，得 x＝3。'),bi('Check: −4 × 3 + 3 = −9 and 3 − 12 = −9.', '檢驗：−4×3＋3＝−9，3−12＝−9。')],
        hints:[bi('The coefficient of x on the right is 1.', '右邊 x 的係數是 1。'),bi('−4x − x = −5x.', '−4x−x＝−5x。'),bi('Subtract 3 from −12 before dividing.', '同除之前，先計算 −12−3。')],
      }),
      equation('independent','constant-before-variable',{
        skill:'transpose-with-negative-terms', prompt:bi('Solve 7 − 2x = 3x + 22.', '解方程 7−2x＝3x＋22。'), expression:String.raw`7-2x=3x+22`, numericAnswer:-3, audit:linear(-2,7,3,22),
        steps:[bi('Subtract 3x and 7 on both sides: −2x − 3x = 22 − 7.', '兩邊同減 3x、同減 7：−2x−3x＝22−7。'),bi('−5x = 15. Divide by −5: x = −3.', '−5x＝15；同除以 −5，得 x＝−3。'),bi('Check: 7 − 2 × (−3) = 13 and 3 × (−3) + 22 = 13.', '檢驗：7−2×（−3）＝13，3×（−3）＋22＝13。')],
        hints:[bi('Read 7 − 2x as a constant term 7 and a variable term −2x.', '把 7−2x 看成常數項 7 和字母項 −2x。'),bi('The left variable coefficient after transposition is −2 − 3.', '移項後，左邊字母項的係數是 −2−3。'),bi('The right side is 22 − 7 = 15.', '右邊是 22−7＝15。')],
      }),
      equation('exit','negative-solution-both-sides',{
        skill:'transpose-both-sides', prompt:bi('Solve 8x + 1 = 5x − 14 and verify in the original equation.', '解方程 8x＋1＝5x−14，並代回原方程驗算。'), expression:String.raw`8x+1=5x-14`, numericAnswer:-5, audit:linear(8,1,5,-14),
        steps:[bi('Subtract 5x and 1 on both sides: 3x = −15.', '兩邊同減 5x、同減 1，得 3x＝−15。'),bi('Divide by 3: x = −5.', '同除以 3，得 x＝−5。'),bi('Check: 8 × (−5) + 1 = −39 and 5 × (−5) − 14 = −39.', '檢驗：8×（−5）＋1＝−39，5×（−5）−14＝−39。')],
        hints:[bi('Move +5x to the left and +1 to the right.', '把 ＋5x 移到左邊，把 ＋1 移到右邊。'),bi('8x − 5x = −14 − 1.', '8x−5x＝−14−1。'),bi('A positive coefficient with a negative right side gives a negative solution here.', '本題係數為正、右邊為負，所以解是負數。')],
      }),
      equation('exit','verify-candidate',{
        type:'short', skill:'verify-in-original-equation', prompt:bi('A learner claims x = 7 solves 3x − 4 = x + 10. Verify by calculating both original sides. Is the claim correct?', '學生說 x＝7 是 3x−4＝x＋10 的解。分別計算原方程兩邊驗證，判斷說法是否正確。'), expression:String.raw`3x-4=x+10`, numericAnswer:7, audit:linear(3,-4,1,10),
        answer:bi('Yes. At x = 7, the left side is 3 × 7 − 4 = 17 and the right side is 7 + 10 = 17.', '正確。x＝7 時，左邊 3×7−4＝17，右邊 7＋10＝17，兩邊相等。'),
        steps:[bi('Use the original equation, including both constants.', '使用原方程，保留兩邊的常數項。'),bi('Left side: 3 × 7 − 4 = 17. Right side: 7 + 10 = 17.', '左邊：3×7−4＝17；右邊：7＋10＝17。'),bi('The two sides are equal, so x = 7 is a solution.', '兩邊相等，所以 x＝7 是方程的解。')],
        hints:[bi('Verification means substitution, not just repeating the final answer.', '驗算要代入，不只是重複答案。'),bi('Calculate 3 × 7 − 4 and 7 + 10 separately.', '分別計算 3×7−4 與 7＋10。'),bi('Compare the two results before deciding.', '先比較兩個結果，再下判斷。')],
        rubric:[bi('Calculate both original sides as 17.', '算出原方程兩邊都是 17。'),bi('Conclude that the equality holds at x = 7.', '由兩邊相等，判定 x＝7 是解。')],
      }),
      equation('supplement','move-positive-constant',{
        skill:'transpose-both-sides', prompt:bi('Solve 9x + 4 = 5x − 12.', '解方程 9x＋4＝5x−12。'), expression:String.raw`9x+4=5x-12`, numericAnswer:-4, audit:linear(9,4,5,-12),
        steps:[bi('Subtract 5x and 4 on both sides: 4x = −16.', '兩邊同減 5x、同減 4，得 4x＝−16。'),bi('Divide by 4: x = −4.', '同除以 4，得 x＝−4。'),bi('Check: 9 × (−4) + 4 = −32 and 5 × (−4) − 12 = −32.', '檢驗：9×（−4）＋4＝−32，5×（−4）−12＝−32。')],
        hints:[bi('Do not retain +4 on the right after moving it across the equality sign.', '＋4 跨過等號移到右邊後，不保留原來的正號。'),bi('9x − 5x = −12 − 4.', '9x−5x＝−12−4。'),bi('Solve 4x = −16.', '解 4x＝−16。')],
      }),
      equation('supplement','move-negative-constant',{
        skill:'transpose-with-negative-terms', prompt:bi('Solve −2x − 9 = 4x + 3.', '解方程 −2x−9＝4x＋3。'), expression:String.raw`-2x-9=4x+3`, numericAnswer:-2, audit:linear(-2,-9,4,3),
        steps:[bi('Subtract 4x and add 9 on both sides: −6x = 12.', '兩邊同減 4x、同加 9，得 −6x＝12。'),bi('Divide by −6: x = −2.', '同除以 −6，得 x＝−2。'),bi('Check: −2 × (−2) − 9 = −5 and 4 × (−2) + 3 = −5.', '檢驗：−2×（−2）−9＝−5，4×（−2）＋3＝−5。')],
        hints:[bi('Moving −9 to the right corresponds to adding 9 on both sides.', '−9 移到右邊，對應兩邊同加 9。'),bi('−2x − 4x = 3 + 9.', '−2x−4x＝3＋9。'),bi('Divide 12 by −6.', '計算 12 除以 −6。')],
      }),
      equation('supplement','constant-first-negative-term',{
        skill:'transpose-with-negative-terms', prompt:bi('Solve 12 − 5x = 2x − 9.', '解方程 12−5x＝2x−9。'), expression:String.raw`12-5x=2x-9`, numericAnswer:3, audit:linear(-5,12,2,-9),
        steps:[bi('Subtract 2x and 12 on both sides: −7x = −21.', '兩邊同減 2x、同減 12，得 −7x＝−21。'),bi('Divide by −7: x = 3.', '同除以 −7，得 x＝3。'),bi('Check: 12 − 5 × 3 = −3 and 2 × 3 − 9 = −3.', '檢驗：12−5×3＝−3，2×3−9＝−3。')],
        hints:[bi('The variable term on the left is −5x.', '左邊的字母項是 −5x。'),bi('−5x − 2x = −9 − 12.', '−5x−2x＝−9−12。'),bi('Both −7x and −21 contain a negative sign; divide by −7.', '−7x 和 −21 都有負號，兩邊同除以 −7。')],
      }),
      equation('supplement','negative-variable-on-right',{
        skill:'transpose-negative-variable', prompt:bi('Solve 6x − 11 = −3x + 7.', '解方程 6x−11＝−3x＋7。'), expression:String.raw`6x-11=-3x+7`, numericAnswer:2, audit:linear(6,-11,-3,7),
        steps:[bi('Add 3x and 11 on both sides: 9x = 18.', '兩邊同加 3x、同加 11，得 9x＝18。'),bi('Divide by 9: x = 2.', '同除以 9，得 x＝2。'),bi('Check: 6 × 2 − 11 = 1 and −3 × 2 + 7 = 1.', '檢驗：6×2−11＝1，−3×2＋7＝1。')],
        hints:[bi('Remove −3x from the right by adding 3x on both sides.', '兩邊同加 3x，消去右邊的 −3x。'),bi('6x + 3x = 7 + 11.', '6x＋3x＝7＋11。'),bi('Solve 9x = 18.', '解 9x＝18。')],
      }),
      equation('extension','collect-both-sides-before-transposing',{
        skill:'collect-and-transpose', prompt:bi('Solve 2x + 3x − 8 = 7x − 4x + 6. Collect like terms on each side before transposing.', '解方程 2x＋3x−8＝7x−4x＋6；先分別合併兩邊的同類項，再移項。'), expression:String.raw`2x+3x-8=7x-4x+6`, numericAnswer:7, audit:linear(5,-8,3,6),
        steps:[bi('Collect on each side: 5x − 8 = 3x + 6.', '分別合併兩邊同類項，得 5x−8＝3x＋6。'),bi('Subtract 3x and add 8 on both sides: 2x = 14.', '兩邊同減 3x、同加 8，得 2x＝14。'),bi('Divide by 2: x = 7.', '同除以 2，得 x＝7。'),bi('Check: 2 × 7 + 3 × 7 − 8 = 27 and 7 × 7 − 4 × 7 + 6 = 27.', '檢驗：2×7＋3×7−8＝27，7×7−4×7＋6＝27。')],
        hints:[bi('Collecting on the same side does not move terms across the equality sign.', '在同一邊合併，沒有把項移過等號。'),bi('The left coefficient is 5 and the right coefficient is 3.', '左邊的係數是 5，右邊的係數是 3。'),bi('Solve 5x − 8 = 3x + 6 using the same operation on both sides.', '兩邊同做運算，解 5x−8＝3x＋6。')],
      }),
      equation('extension','diagnose-transposition',{
        type:'short', skill:'diagnose-transposition-sign', prompt:bi('For 6x − 7 = 2x + 9, a learner writes 6x − 2x = 9 − 7 and then 4x = 2. Explain the first error and solve correctly.', '解 6x−7＝2x＋9 時，學生寫 6x−2x＝9−7，接着寫 4x＝2。解釋第一個錯誤，並正確求解。'), expression:String.raw`6x-7=2x+9`, numericAnswer:4, audit:linear(6,-7,2,9),
        answer:bi('Moving −7 to the right requires +7, corresponding to adding 7 on both sides. Thus 4x = 16 and x = 4; both original sides equal 17.', '−7 移到右邊應成為 ＋7，對應兩邊同加 7。所以 4x＝16，得 x＝4；原方程兩邊都是 17。'),
        steps:[bi('The wrong line keeps −7 after it crosses the equality sign.', '錯誤的一行把 −7 移過等號後仍寫成 −7。'),bi('Subtract 2x and add 7 on both sides: 6x − 2x = 9 + 7.', '兩邊同減 2x、同加 7：6x−2x＝9＋7。'),bi('4x = 16, so x = 4.', '4x＝16，所以 x＝4。'),bi('Check: 6 × 4 − 7 = 17 and 2 × 4 + 9 = 17.', '檢驗：6×4−7＝17，2×4＋9＝17。')],
        hints:[bi('Inspect the constant moved from the left to the right.', '檢查由左邊移到右邊的常數項。'),bi('Which operation removes −7 from the left?', '甚麼運算能消去左邊的 −7？'),bi('Add 7 on both sides, giving 9 + 7 on the right.', '兩邊同加 7，所以右邊是 9＋7。')],
        rubric:[bi('Identify the incorrect sign of the transposed constant and explain adding 7 on both sides.', '指出移項後常數的符號錯誤，並解釋兩邊同加 7。'),bi('Obtain x = 4 and check both original sides as 17.', '求得 x＝4，並算出原方程兩邊都是 17。')],
      }),
    ],
  }),
];
