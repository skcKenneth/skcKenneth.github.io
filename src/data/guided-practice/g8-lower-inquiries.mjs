import {bi as B} from './shared.mjs';
const M=tex=>`\\(${tex}\\)`;
const lesson=(...tasks)=>({stages:tasks.map((task,i)=>({minutes:[3,8,5,2][i],task})),text:B(tasks.map((task,i)=>`${[3,8,5,2][i]} min: ${task.en}`).join(' '),tasks.map((task,i)=>`${[3,8,5,2][i]}分鐘：${task['zh-Hant']}`).join(' '))});
/** Fixed classroom investigations. Paper tasks do not imply a new interactive engine. */
export const G8_LOWER_INQUIRIES={
 'g8-radicals-meaning':lesson(
  B(`Predict the values of ${M('\\sqrt{x^{2}}')} for x=3, −3 and 0. Does the original sign survive? Write a reason before calculating.`,`預測 x＝3、−3、0 時 ${M('\\sqrt{x^{2}}')} 的值；原來的符號會保留嗎？先寫理由。`),
  B('On paper, make columns for x, its square and the principal root of that square. Then test the expression √(x−3) at x=1,3,7; mark which inputs are allowed over the reals.','紙上列表記錄 x、x的平方及該平方的算術平方根，再用 x＝1、3、7 檢查 √(x−3)，標記哪些輸入在實數範圍有意義。'),
  B(`Explain ${M('\\sqrt{x^{2}}=|x|')} and the condition ${M('x-3\\geq0')}. A few examples suggest the rule; justify it using the definition of the nonnegative root.`,`解釋 ${M('\\sqrt{x^{2}}=|x|')} 及條件 ${M('x-3\\geq0')}。例子只協助猜想，須用非負算術平方根的定義說明。`),
  B(`Individually simplify ${M('\\sqrt{(-5)^{2}}')} and distinguish it from solving ${M('x^{2}=25')}.`,`獨立化簡 ${M('\\sqrt{(-5)^{2}}')}，並分辨它與解 ${M('x^{2}=25')} 的要求。`)),
 'g8-radicals-operations':lesson(
  B('Predict whether adding square roots obeys the same rule as multiplying them. Give one test case.','預測根式加法是否跟乘法有同一規律，先舉一個測試例子。'),
  B(`On paper compare ${M('\\sqrt8\\sqrt2=4')} with ${M('\\sqrt8+\\sqrt2=3\\sqrt2')}. Draw rectangles with sides √8 and √2 to interpret the product. Test ${M('\\sqrt9+\\sqrt{16}')} against ${M('\\sqrt{9+16}')}.`,`紙上比較 ${M('\\sqrt8\\sqrt2=4')} 與 ${M('\\sqrt8+\\sqrt2=3\\sqrt2')}；畫邊長為 √8、√2 的長方形解釋乘積，再比較 ${M('\\sqrt9+\\sqrt{16}')} 與 ${M('\\sqrt{9+16}')}。`),
  B(`Explain why 7≠5 refutes the proposed addition rule. State a,b≥0 for ${M('\\sqrt a\\sqrt b=\\sqrt{ab}')}; combine only like radical terms after simplification.`,`說明 7≠5 如何反駁所猜加法規律。${M('\\sqrt a\\sqrt b=\\sqrt{ab}')} 須有 a、b≥0；化簡後只合併同類根式。`),
  B(`Individually simplify ${M('\\sqrt{18}+\\sqrt8')} and explain each transformation.`,`獨立化簡 ${M('\\sqrt{18}+\\sqrt8')}，交代每次變形理由。`)),
 'g8-pythagoras-lengths':lesson(
  B('Predict how the hypotenuse and its square change when both legs double. Name the hypotenuse first.','預測兩直角邊同時加倍時，斜邊及其平方如何改變；先指出斜邊。'),
  B('In the existing Pythagoras inquiry, record legs (3,4) then (6,8): c=5,10 and c²=25,100. Next change only the first leg from 3 to 6 while the second stays 4; keep exact square relations separate from decimal readouts.','在現有勾股探究記錄直角邊 (3,4)、(6,8)：c＝5、10，c²＝25、100。再只把第一邊由3改6，第二邊維持4；分開記錄精確平方關係與小數顯示。'),
  B('Explain the length factor 2 and square factor 4 using the theorem. Why does changing only one leg fail to produce the same scale factor?','用勾股定理解釋長度2倍、平方4倍；為何只改一條邊不會得到相同比例？'),
  B('Individually find the hypotenuse for legs 9 and 12, stating the right-angle condition and units.','獨立求直角邊9、12的斜邊，寫出直角條件及單位。')),
 'g8-pythagoras-converse':lesson(
  B('Predict which length cards make right triangles: (5,12,13), (5,12,14), (2,3,5). Do not rely on appearance.','預測 (5,12,13)、(5,12,14)、(2,3,5) 哪些能組成直角三角形，不憑外觀判斷。'),
  B('On paper, first check positive lengths and the strict triangle inequality. For each valid triangle identify its longest side, then compare its square with the sum of the other two squares. The existing right-triangle engine cannot test three arbitrary sides for this converse.','紙上先檢查邊長為正及嚴格三角形不等式；對能組成三角形的組別，找最長邊並比較平方。現有直角三角形引擎不能用來測試任意三邊的逆定理。'),
  B('Explain why the first is right, the second is not right, and the third is degenerate. Distinguish triangle existence from the square equality.','解釋第一組是直角、第二組非直角、第三組退化；分清「能組成三角形」與「平方相等」。'),
  B('Individually test (8,15,17), and name the angle opposite the longest side in the conclusion.','獨立判斷 (8,15,17)，結論指出最長邊所對的角。')),
 'g8-parallelograms-tests':lesson(
  B('Predict which of the four half-diagonals in a parallelogram must be equal. Must all four be equal?','預測平行四邊形兩對角線分成的四段中，哪些必相等；四段一定全相等嗎？'),
  B('Draw A(0,0), B(4,0), C(6,2), D(2,2); join the diagonals and find their common midpoint. Compare a trapezium with vertices (0,0),(4,0),(3,2),(1,2), whose diagonals are equal but do not bisect each other. In a separate triangle, join two side midpoints and predict the new segment’s direction and length.','畫 A(0,0)、B(4,0)、C(6,2)、D(2,2)，連對角線並找共同中點；再比較頂點 (0,0)、(4,0)、(3,2)、(1,2) 的梯形：對角線等長卻不互相平分。另畫三角形連接兩邊中點，預測中位線方向及長度。'),
  B('Separate “each diagonal is bisected” from “the diagonals are equal”. Use stated parallelism and triangle congruence or an established criterion to justify the claim; measurement alone is not proof.','分清「每條對角線被平分」與「兩對角線等長」；用已知平行條件、全等或已學判定交代理由，量度不能代替證明。'),
  B('Individually state the two conditions and length relation for a triangle midsegment.','獨立寫出三角形中位線的兩個中點條件及長度關係。')),
 'g8-rectangles-rhombi':lesson(
  B('Predict which diagonal properties a non-square rectangle and a non-square rhombus share.','預測非正方形的矩形與菱形有哪些共同對角線性質。'),
  B('On paper compare a 4-by-3 rectangle (diagonals 5) with the rhombus (0,0),(3,4),(6,0),(3,−4) (diagonals 6 and 8). Record bisection, equal lengths and perpendicularity separately. Use the stated shapes as premises, not their apparent outlines.','紙上比較4×3矩形（對角線5）與頂點 (0,0)、(3,4)、(6,0)、(3,−4) 的菱形（對角線6、8）；分開記錄互相平分、等長及垂直，使用已知圖形條件，不從外觀推斷。'),
  B('Identify the shared bisection property and the differing equal/perpendicular properties. Keep the parallelogram premise when using diagonal criteria.','指出共同的互相平分性質，以及等長、垂直的差異；用對角線判定矩形或菱形時保留平行四邊形前提。'),
  B('Individually judge whether perpendicular diagonals alone force an arbitrary quadrilateral to be a rhombus; give a missing condition.','獨立判斷任意四邊形僅有對角線垂直是否必為菱形，指出欠缺條件。')),
 'g8-squares-classification':lesson(
  B('Predict the strongest conclusion from three cards: parallelogram plus equal diagonals; plus perpendicular diagonals; plus both.','預測三張條件卡的最強結論：平行四邊形加對角線等長、加對角線垂直、同時加兩項。'),
  B('Sort the cards using a non-square 4-by-3 rectangle, a non-square rhombus with diagonals 6 and 8, and a square as examples. Label which conditions each actually satisfies. Keep a square inside the rectangle, rhombus and parallelogram families.','用非正方形的4×3矩形、對角線6和8的非正方形菱形及正方形分類，逐一標記實際符合的條件；正方形同時保留在矩形、菱形及平行四邊形類別內。'),
  B('Explain why either diagonal condition alone is insufficient for a square and why both suffice for a parallelogram. Give a counterexample to the stronger unsupported claim.','解釋為何單一對角線條件不足以判定正方形，而平行四邊形同時具兩項則足夠；對過強結論給反例。'),
  B('Individually complete: a rhombus with one right angle is a ____, because ____.','獨立完成：有一個直角的菱形是____，理由是____。')),
 'g8-functions-representations':lesson(
  B('Predict whether repeated inputs or repeated outputs prevent a relation from being a function.','預測重複輸入或重複輸出會否令對應不成函數。'),
  B('On paper compare tables {−1→1,0→0,1→1}, {0→0,0→1}, and {0→0,0→0,1→1}. Then model a tank filled at 3 L/min up to 60 L; test times 0,20,21 minutes.','紙上比較三表 {−1→1,0→0,1→1}、{0→0,0→1}、{0→0,0→0,1→1}；再用每分鐘注水3 L、容量60 L的水箱，檢查0、20、21分鐘。'),
  B('A repeated identical pair adds no second output; conflicting outputs for the same input do. Explain why the filling relation applies only for 0≤t≤20 even though its algebraic expression can be evaluated later.','重複相同數對沒有增加另一輸出；同一輸入配不同輸出才破壞函數條件。說明注水模型只適用0≤t≤20，雖然代數式在其後仍可計算。'),
  B('Individually give a function with two distinct inputs sharing one output, and explain why it is valid.','獨立舉出兩個不同輸入配同一輸出的函數例子，說明理由。')),
 'g8-linear-functions-properties':lesson(
  B('With b=1 fixed, predict the stationary point as k changes in y=kx+b.','固定 b＝1，預測 y＝kx＋b 中改變 k 時哪個點不動。'),
  B('In the existing one-line inquiry, save k=1,2,−1 with b=1. Then fix k=2 and save b=−2,0,3. Compare the saved cases and draw their lines on paper; the engine shows one line at a time.','現有單一直線探究中固定 b＝1，逐次保存 k＝1、2、−1；再固定 k＝2，保存 b＝−2、0、3。比較記錄並在紙上疊畫直線，引擎每次只顯示一條。'),
  B('Explain the common point (0,1) in the first set and parallel lines in the second. Use x=−1 to test “a larger k always gives a larger y”. Treat k=0 as a constant-function boundary; in this course a linear function requires k≠0.','說明首組共同點 (0,1) 及次組平行關係；用 x＝−1 檢查「k越大，y一定越大」。k＝0作常數函數邊界，本課一次函數要求 k≠0。'),
  B('Individually state the intercept and increasing/decreasing behaviour of y=−2x+3.','獨立寫出 y＝−2x＋3 的縱截距及增減性。')),
 'g8-linear-functions-models':lesson(
  B('Predict when plans A=2n and B=n+6 cost the same and which is cheaper for small whole-number usage.','預測收費 A＝2n、B＝n＋6 何時相同，以及整數用量較少時哪個便宜。'),
  B('Use the existing two-plan tariffs inquiry: fixed fee 6, rate 1, minimum usage 0 and budget 100; or draw both given lines on paper. Record n=4,6,8 and costs (8,10),(12,12),(16,14). The one-line inquiry cannot display both plans simultaneously and its intercept control does not reach 6.','使用現有雙方案 tariffs 探究：固定費6、每次費1、最低用量0、預算100；或紙上畫兩條已知直線。記錄 n＝4、6、8 及費用 (8,10)、(12,12)、(16,14)。單一直線探究不能同時顯示兩方案，其截距控制亦未到6。'),
  B('Explain the crossing (6,12), the cost inequality on each side and n as a nonnegative whole number. Connecting lines help comparison; a fractional use is not a valid count.','解釋交點 (6,12)、兩側的費用不等式，以及 n 是非負整數；連線協助比較，分數次使用不符合計數情境。'),
  B('Individually choose the cheaper plan at n=7, with both calculated costs and units.','獨立選 n＝7 時較便宜方案，列兩項費用及單位。')),
 'g8-data-centres':lesson(
  B('Predict whether moving just one extreme value changes the mean and median equally.','預測只改一個極端值時，平均數與中位數會否同樣改變。'),
  B('In the existing outlier inquiry keep 4,5,6,7 fixed and record fifth values 0,8,40. Sort each set: means 4.4,6,12.4; medians 5,6,6. Record every value, not only the preferred summary.','現有極端值探究中固定4、5、6、7，第五值依次0、8、40。每組先排序：平均數4.4、6、12.4；中位數5、6、6。保留每個值，不只記偏好的指標。'),
  B('Choose a summary for a stated purpose and explain its sensitivity. Include the extreme value when describing the data; do not remove it merely to improve a summary.','按指定用途選代表指標，說明敏感程度；描述資料時保留極端值，不能只為美化指標刪去它。'),
  B('Individually explain which of these summaries changes most and why, without claiming one is always best.','獨立解釋哪個指標改變最多及原因，不聲稱某一指標永遠最好。')),
 'g8-data-variance':lesson(
  B('Predict which is more spread out: A={4,5,6} or B={1,5,9}, both with mean 5.','預測 A＝{4,5,6} 與 B＝{1,5,9} 哪組較分散，兩組平均數同為5。'),
  B(`On paper compute every deviation and squared deviation. Divide by n=3: variances ${M('\\frac23')} and ${M('\\frac{32}{3}')}. Add 3 to every value of A, then separately double every original value of A. The existing outlier engine does not calculate variance.`,`紙上逐項算離均差及平方，除以 n＝3，方差為 ${M('\\frac23')}、${M('\\frac{32}{3}')}。把A各值加3；另一次把原A各值乘2。現有極端值引擎不計方差。`),
  B(`Explain unchanged variance after adding 3 and variance ${M('\\frac83')} after doubling, four times the original. State squared units and retain the course convention of dividing by n.`,`說明全加3後方差不變，全乘2後方差 ${M('\\frac83')} 是原來4倍；保留平方單位及本課除以n的約定。`),
  B('Individually state how multiplying every value by −2 changes the variance, with a squared-deviation reason.','獨立說明各值乘−2後方差如何改變，用離均差平方解釋。')),
};
