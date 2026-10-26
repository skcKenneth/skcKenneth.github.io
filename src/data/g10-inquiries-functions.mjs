/** Original short tasks. Native function constructions retain their worksheet identity. */
import {createDirectState, reduceDirectState, renderDirectScene} from '../lib/function-hands-on.mjs';

const bi=(en,zh)=>({en,'zh-Hant':zh});
const tr=(l,en,zh)=>l==='zh-Hant'?zh:en;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number.isFinite(n)?String(Number(n.toPrecision(8))):'—';
const clone=x=>JSON.parse(JSON.stringify(x));
const preset=(id,value)=>({type:'preset',id,value});
const action=id=>({type:'action',id});
const drag=(id,x,y=250,zone)=>({type:'drag',id,x,y,phase:'end',...(zone?{zone}:{})});
const px=(x,lo,hi,left=80,right=880)=>left+(x-lo)/(hi-lo)*(right-left);
const drop=(id,zone)=>drag(id,480,250,zone);
const c=(en,zh,actions=[],boundary=false)=>({label:bi(en,zh),actions,boundary});
const functionSpecs=[];
function functionTask(n,fields,cases){
 const nativeId=String(n).padStart(2,'0'),id=`g10-05-${nativeId}`;
 const item={id,chapter:'05',order:n,nativeId,nativeActivityId:`senior:function-worksheet:${nativeId}`,nativeRuntime:'function-hands-on',duration:bi('5–10 minutes','5–10 分鐘'),
  prerequisites:bi('Read function inputs, outputs and the stated domain; write your first prediction on paper.','能閱讀函數的輸入、輸出及所述定義域；先在紙上寫預測。'),...fields,
  cases:cases.map((row,i)=>({label:row.label,params:{scenario:String(i)},boundary:row.boundary})),
  controls:[{key:'scenario',label:bi('Compare these constructions','比較這些構造'),options:cases.map((row,i)=>({value:String(i),label:row.label}))}],
 };
 functionSpecs.push({activity:item,directCases:cases});return item;
}

const f01=functionTask(1,{
 title:bi('Repair one mapping arrow','修補一條對應箭頭'),
 question:bi('Can two inputs share an output? Which single input breaks the function rule?','兩個輸入可否共用輸出？哪一個輸入破壞函數條件？'),
 prediction:bi('Before changing the diagram, mark each input with 0, 1 or 2 distinct outputs.','改圖前，為每個輸入標示它有 0、1 或 2 個不同輸出。'),
 explanation:bi('A function gives every allowed input exactly one output. Many-to-one is permitted; a missing arrow or two different outputs from one input violates the rule.','函數給每個允許輸入恰好一個輸出。多對一是允許的；漏配或同一輸入有兩個不同輸出均違反條件。'),
 conditions:bi('The input set is {1,2,3}. Count distinct outputs from each input, not arrows arriving at an output.','輸入集合為 {1,2,3}；逐個數其不同輸出，不是數到達某輸出的箭頭。'),
 misconception:bi('Different inputs must have different outputs.','不同輸入必須有不同輸出。'),
 challenge:bi('Make every input map to 8. Explain why unused elements of the output set are harmless.','令每個輸入都對應 8；解釋輸出集合有元素未使用為何不影響條件。'),
 proof:bi('Check the defining statement for each of the three inputs. This exhausts this finite mapping; it does not prove a claim about every possible mapping.','逐一檢查三個輸入的定義條件，這已窮盡此有限對應；不能據此證明所有可能的對應。'),
 teacherPrompt:bi('Ask a student to repair the missing-arrow case, then ask another to justify allowing shared output 5.','請一人修補漏配，再請另一人解釋為何可共用輸出 5。'),
 exit:{prompt:bi('All three inputs map to 8. Function or not, and why?','三個輸入都對應 8，是函數嗎？說明理由。'),answer:bi('Yes: each input has exactly one output.','是；每個輸入恰有一個輸出。')},
},[c('Many-to-one','多對一'),c('Missing input 3','輸入 3 漏配',[preset('pattern','missing')],true),c('Input 2 has two outputs','輸入 2 有兩個輸出',[preset('pattern','multiple')],true),c('Constant output 8','固定輸出 8',[preset('pattern','constant')])]);

const f02=functionTask(2,{
 title:bi('Same formula: the same function?','公式相同就是同一函數？'),
 question:bi('Does x = 0.5 distinguish a finite domain from the interval [−2,2]?','x＝0.5 能否區分有限定義域與區間 [−2,2]？'),
 prediction:bi('Predict whether 0.5 is allowed before dropping its chip onto each domain.','把 0.5 卡片放進兩個定義域前，先猜它是否允許。'),
 explanation:bi('Formula arithmetic and defined function output are different questions. For x²+1, 0.5 gives arithmetic 1.25, but this is a function value only when 0.5 belongs to the domain.','公式算術與函數是否有定義是兩個問題。x²＋1 在 0.5 算得 1.25，但只有定義域允許 0.5 時才是函數值。'),
 conditions:bi('Compare both the rule and the complete input domain. The range contains attained outputs only.','須比較對應法則與完整定義域；值域只包括實際取得的輸出。'),
 misconception:bi('The same expression defines the same function on any domain.','相同解析式在任何定義域都表示同一函數。'),
 challenge:bi('For the two finite x² domains, explain how equal ranges {0,1} can coexist with different functions.','兩個有限 x² 定義域的值域均為 {0,1}，為何仍可表示不同函數？'),
 proof:bi('Exhibit one input contained in exactly one domain to refute equality. For a finite domain, evaluate every input to obtain its range.','找出只屬於其中一個定義域的輸入，即可反駁函數相等；有限定義域的值域可逐一代入求出。'),
 teacherPrompt:bi('Require two sentences: “the arithmetic is …” and “the input is allowed/rejected because …”.','要求分兩句：「公式算得……」及「此輸入允許／拒絕，因為……」。'),
 exit:{prompt:bi('Find the range of x²+1 on {−2,−1,0,1,2}.','求 x²＋1 在 {−2,−1,0,1,2} 上的值域。'),answer:bi('{1,2,5}; repeated outputs are listed once.','{1,2,5}；重複輸出只列一次。')},
},[c('0.5 in the finite domain','有限定義域測 0.5',[drop('chip-3','finite')],true),c('0.5 in the interval','區間定義域測 0.5',[drop('chip-3','other')]),c('−1 in the first paper domain','紙本第一個定義域測 −1',[preset('model','paper'),drop('chip-0','finite')]),c('−1 in the second paper domain','紙本第二個定義域測 −1',[preset('model','paper'),drop('chip-0','other')],true)]);

const f03=functionTask(3,{
 title:bi('Which endpoint belongs?','哪個端點屬於集合？'),
 question:bi('Why is 3 allowed in √(x−3), while 2 is forbidden in 1/(x−2)?','為何 √(x−3) 允許 3，但 1/(x−2) 不允許 2？'),
 prediction:bi('Draw the boundary point as open or closed before selecting each formula.','切換公式前，先把邊界畫成空心或實心點。'),
 explanation:bi('A real square root permits zero radicand, giving x ≥ 3. A denominator cannot be zero, giving x ≠ 2. In [0,4), 0 is included and 4 excluded.','實數平方根容許被開方數為零，故 x ≥ 3；分母不能為零，故 x ≠ 2。[0,4) 包括 0 而不包括 4。'),
 conditions:bi('Work over real inputs. Infinity is a direction, never an included endpoint; integers and real intervals are different domains.','使用實數輸入；無窮大表示方向，不是可包括的端點；整數集合與實數區間不同。'),
 misconception:bi('Every domain boundary must be excluded.','定義域的邊界必須全部排除。'),
 challenge:bi('Toggle integer inputs: identify a noninteger that leaves the domain even though it lies between the endpoints.','切換整數輸入，指出一個位於兩端之間卻被排除的非整數。'),
 proof:bi('Translate the defining restrictions: x−3 ≥ 0 and x−2 ≠ 0. These algebraic conditions justify all inputs; plotted examples only illustrate them.','把限制翻成 x−3 ≥ 0 及 x−2 ≠ 0；這些代數條件涵蓋所有輸入，圖中例子只是說明。'),
 teacherPrompt:bi('Ask “what operation fails here?” before naming an interval bracket.','先問「這裡哪一個運算無法進行？」再選區間括號。'),
 exit:{prompt:bi('Write the domain of 1/√(x−3).','寫出 1/√(x−3) 的定義域。'),answer:bi('(3,∞): the radicand must be positive because the root is also a denominator.','(3,∞)；根式同時是分母，被開方數必須大於零。')},
},[c('Included endpoint 0','包括的端點 0',[drag('probe',px(0,-2,6,100,860))]),c('Excluded endpoint 4','排除的端點 4',[drag('probe',px(4,-2,6,100,860))],true),c('Reciprocal at 2','倒數在 2',[preset('rule','reciprocal')],true),c('Square root at 3','平方根在 3',[preset('rule','sqrt'),drag('probe',px(3,-2,6,100,860))],true)]);

const masks=[drop('mask-root','common-axis'),drop('mask-denominator','common-axis')];
const f04=functionTask(4,{
 title:bi('Keep every restriction after simplification','化簡後仍要保留每項限制'),
 question:bi('Does cancelling x−1 restore the missing input x=1?','約去 x−1 後，原本缺少的輸入 x＝1 會回來嗎？'),
 prediction:bi('Predict whether the original and simplified formulas both have value 2 at x=1.','先猜原式與化簡式在 x＝1 是否都有函數值 2。'),
 explanation:bi('For √(x+1)/(x−2), take x ≥ −1 and x ≠ 2 together. For (x²−1)/(x−1), cancellation gives x+1 only on x ≠ 1. The original graph retains its hole.','√(x+1)/(x−2) 須同時滿足 x ≥ −1 及 x ≠ 2；(x²−1)/(x−1) 只在 x ≠ 1 時可約成 x＋1，原圖仍有空缺。'),
 conditions:bi('The original formula fixes the domain. Finite output sets are not filled in between their elements.','定義域由原公式決定；有限值域的元素之間不會自動補滿。'),
 misconception:bi('A simpler expression automatically enlarges the original function domain.','解析式化簡後，原函數的定義域會自動擴大。'),
 challenge:bi('Compare the ranges of x² on {−2,−1,0,1} and on [−2,1]. Why is only one a full interval?','比較 x² 在 {−2,−1,0,1} 與 [−2,1] 上的值域；為何只有一個是完整區間？'),
 proof:bi('Factor x²−1=(x−1)(x+1); division by x−1 is equivalent only if x≠1. Separately, x² on [−2,1] attains every y∈[0,4] via x=−√y.','因 x²−1＝(x−1)(x＋1)，除以 x−1 只在 x≠1 時等價。另外 [−2,1] 上的 x² 以 x＝−√y 取得每個 y∈[0,4]。'),
 teacherPrompt:bi('Let students overlay both restriction masks, then compare arithmetic and domain membership at the hole.','先讓學生疊上兩個限制遮罩，再比較空缺處的算術值與定義域。'),
 exit:{prompt:bi('Is (1,2) on the original graph of (x²−1)/(x−1)?','(1,2) 是否在 (x²−1)/(x−1) 的原圖上？'),answer:bi('No. At x=1 the original denominator is zero.','否；x＝1 令原分母為零。')},
},[c('Intersect two restrictions','兩項限制取交集',[...masks,drag('probe',px(0,-3,5,100,860))]),c('Root in the denominator at 1','根式分母在 1',[preset('mode','inverse-root'),...masks,drag('probe',px(1,-3,5,100,860))],true),c('Cancel at the hole x=1','在空缺 x＝1 約分',[preset('mode','hole'),drop('mask-denominator','common-axis'),drag('probe',px(1,-3,5,100,860)),action('simplify')],true),c('Finite range','有限值域',[preset('mode','range-finite')]),c('Interval range','區間值域',[preset('mode','range-interval')])]);

const placedPoints=Array.from({length:5},(_,x)=>drag(`point-${x}`,120+x/4*700,385-(2*x+4)/14*310));
const f05=functionTask(5,{
 title:bi('Should the points be joined?','這些點應該連線嗎？'),
 question:bi('The same cost formula y=2x+4 describes time or item count. Which graph permits x=2.5?','同一費用公式 y＝2x＋4 表示時數或件數；哪個圖容許 x＝2.5？'),
 prediction:bi('Draw five table points. Predict whether connecting them preserves the intended inputs.','先畫表中五點，再猜連線是否保留原本允許的輸入。'),
 explanation:bi('On the real interval [0,4], the affine model gives a line segment. On {0,1,2,3,4}, it gives five separate points. The point (2.5,9) belongs only to the time model.','實數區間 [0,4] 的一次模型給線段；{0,1,2,3,4} 給五個離散點。(2.5,9) 只屬於時數模型。'),
 conditions:bi('Linearity is a stated model assumption. A finite table alone does not establish a unique formula.','直線關係是已指定的模型假設；有限表格本身不能確立唯一公式。'),
 misconception:bi('All plotted data points should be connected.','所有數據點都應連線。'),
 challenge:bi('Give another formula agreeing with y=2x+4 at x=0 and 1 but differing elsewhere.','找另一個公式，在 x＝0、1 與 y＝2x＋4 相同，但其他地方不同。'),
 proof:bi('For each permitted x the formula gives one point. The domain decides which x occur. The rule 2x+4+x(x−1) matches two given points but is not the same rule.','每個允許的 x 由公式給一點；哪些 x 出現由定義域決定。2x＋4＋x(x−1) 符合那兩點，卻是不同法則。'),
 teacherPrompt:bi('Ask what half an item means before toggling the joining segments.','切換連線前，先問情境中的半件物品是甚麼意思。'),
 exit:{prompt:bi('For 0–4 whole tickets costing 2x+4, is (2.5,9) on the graph?','0 至 4 張整數門票按 2x＋4 收費，圖上有 (2.5,9) 嗎？'),answer:bi('No: 2.5 is outside the ticket-count domain.','沒有；2.5 不屬於門票張數的定義域。')},
},[c('Continuous hours, joined','連續時數並連線',[...placedPoints,action('connect')]),c('Whole items, joining is misleading','整數件數，連線會誤導',[...placedPoints,preset('kind','integer'),action('connect')],true),c('Whole items, separate points','整數件數，保留離散點',[...placedPoints,preset('kind','integer')])]);

const f06=functionTask(6,{
 title:bi('A missing boundary or two outputs?','分界漏配還是一個輸入有兩個輸出？'),
 question:bi('If both pieces include the boundary, is the relation always invalid?','兩段都包括分界點，就一定不符合函數條件嗎？'),
 prediction:bi('At t=1, count distinct outputs for the open, single-closed and double-closed versions.','在 t＝1，比較兩端開、單端閉及兩端閉時不同輸出的數目。'),
 explanation:bi('Both open endpoints omit the boundary. Both closed endpoints are harmless if both formulas give the same value there. An overlap giving two distinct values violates uniqueness.','兩端都開會漏去分界；兩端都閉但公式值相同仍可定義函數；重疊處有兩個不同值才違反唯一性。'),
 conditions:bi('For the rental model, the values 6 and 6+4(t−1) agree at t=1. Equality at one point does not justify an interval of overlap.','租借模型的 6 與 6＋4(t−1) 在 t＝1 相同；單點相等不代表整段重疊都可行。'),
 misconception:bi('A function must never have overlapping piece conditions, even with identical outputs.','分段條件一旦重疊，即使輸出相同也不是函數。'),
 challenge:bi('Use the paper model x+2 and x² at x=0 to explain why closing both ends now fails.','以紙本 x＋2 與 x² 在 x＝0 的值，解釋為何這次兩端閉會失敗。'),
 proof:bi('At a shared input, form the set of distinct outputs. A function requires cardinality exactly one. The four constructions exhibit zero, one and two outputs.','在共同輸入列出不同輸出的集合；函數要求其元素數恰為一。四種構造展示零、一、兩個輸出。'),
 teacherPrompt:bi('Have students state both formulas at the boundary before judging the brackets.','判斷括號前，先讓學生算出分界點的兩個公式值。'),
 exit:{prompt:bi('Both formulas give 6 at t=1 and both include it. How many function values occur?','兩式在 t＝1 都得 6 並同時包括該點，有幾個函數值？'),answer:bi('One distinct value, 6.','一個不同值：6。')},
},[c('Source boundary','原分界'),c('Both ends open','兩端均開',[preset('arrangement','gap')],true),c('Both ends closed, same output','兩端均閉，輸出相同',[preset('arrangement','same')],true),c('Overlap with distinct outputs','重疊處輸出不同',[preset('arrangement','overlap'),drag('probe',px(1.25,0,4,100,860))],true)]);

const f07=functionTask(7,{
 title:bi('Swap two function machines','交換兩部函數機器'),
 question:bi('Does doubling then adding 3 give the same result as adding 3 then doubling?','先乘 2 再加 3，與先加 3 再乘 2 相同嗎？'),
 prediction:bi('For input 2, predict both intermediate values and final outputs before sending the token.','送入 2 前，先猜兩個次序的中間值與最後輸出。'),
 explanation:bi('The orders give 2x+3 and 2(x+3)=2x+6, differing by 3. With square roots, order can also change which inputs are allowed.','兩次序給 2x＋3 及 2(x＋3)＝2x＋6，相差 3；有平方根時，次序亦可改變允許輸入。'),
 conditions:bi('Every intermediate result must belong to the next machine’s domain. Stop when a stage is undefined.','每個中間結果都須屬於下一部機器的定義域；某步未定義時必須停止。'),
 misconception:bi('The same two rules always commute.','同樣兩個運算交換次序必定不變。'),
 challenge:bi('Compare √(x−1) and √x−1 at x=0 and 1; explain why one equal sample does not prove equality.','在 x＝0、1 比較 √(x−1) 與 √x−1，說明單個相同例子為何不能證明函數相等。'),
 proof:bi('Algebra gives (2x+6)−(2x+3)=3 for every real x. For the root pair, the domains are x≥1 and x≥0, so they cannot be equal functions.','代數給 (2x＋6)−(2x＋3)＝3，對每個實數 x 都成立；根式對的定義域分別為 x≥1、x≥0，故不是同一函數。'),
 teacherPrompt:bi('Read the pipeline left to right; require the intermediate value as well as the final answer.','由左至右讀流程，要求說出中間值及最後答案。'),
 exit:{prompt:bi('At x=0, which is defined: √(x−1) or √x−1?','x＝0 時，√(x−1) 與 √x−1 哪一個有定義？'),answer:bi('Only √x−1, whose value is −1.','只有 √x−1，有值 −1。')},
},[c('Double, then add','先乘 2 再加 3',[action('send')]),c('Add, then double','先加 3 再乘 2',[action('swap'),action('send')]),c('Square-root pair at 0','根式對在 0',[preset('rule','sqrt'),drag('input',px(0,-3,5)),action('send')],true),c('Square-root pair at 1','根式對在 1',[preset('rule','sqrt'),drag('input',px(1,-3,5)),action('send')],true)]);

const f08=functionTask(8,{
 title:bi('Can the largest value be reached?','最大值真的取得了嗎？'),
 question:bi('Does y=x on (0,2) have a maximum just because the graph approaches 2?','y＝x 在 (0,2) 趨近 2，就有最大值嗎？'),
 prediction:bi('Write a candidate maximum; predict what happens when the endpoint is closed.','先寫一個候選最大值，再猜把右端點包括後會怎樣。'),
 explanation:bi('On (0,2), every allowed x has a larger allowed input (x+2)/2. Thus 2 is a bound but no maximum is attained. On (0,2], the maximum is 2.','在 (0,2)，每個允許的 x 都有較大的允許輸入 (x＋2)/2，故 2 是上界但不是取得的最大值；在 (0,2]，最大值為 2。'),
 conditions:bi('Extrema depend on the complete stated domain; local peaks or a finite graph window do not establish global extrema.','最值依賴完整的指定定義域；局部峰谷或有限圖窗不能確立全域最值。'),
 misconception:bi('A curve reaching the top of the visible window has a maximum.','曲線到達圖窗頂部就有最大值。'),
 challenge:bi('Trim the water graph to [3,6]. Explain why its earlier peak no longer counts.','把水位圖限制在 [3,6]，解釋為何較早的峰值不再計算。'),
 proof:bi('For 0<x<2, x<(x+2)/2<2. This defeats every proposed maximum, not merely the sampled candidates.','若 0<x<2，則 x<(x＋2)/2<2；這反駁每個候選最大值，而非只反駁已測的幾個。'),
 teacherPrompt:bi('Ask a student to propose a largest value and another to construct a strictly larger allowed value.','請一人提出最大值，另一人構造仍被允許且更大的值。'),
 exit:{prompt:bi('State maximum and minimum of y=x on (0,2].','寫出 y＝x 在 (0,2] 的最大值及最小值。'),answer:bi('Maximum 2; no minimum, because any allowed x has smaller allowed x/2.','最大值 2；沒有最小值，因任何允許的 x 都有更小的允許值 x/2。')},
},[c('Water: local versus global','水位：局部與全域'),c('Open interval: build a larger value','開區間：構造更大值',[preset('rule','line'),action('construct-larger')],true),c('Close the right endpoint','包括右端點',[preset('rule','line'),action('toggle-right'),drag('max-marker',px(2,0,2))],true)]);

const f09=functionTask(9,{
 title:bi('Decreasing on each piece or the whole domain?','各段遞減等於整個定義域遞減嗎？'),
 question:bi('Is 1/x decreasing on all nonzero real numbers?','1/x 在所有非零實數上都是遞減嗎？'),
 prediction:bi('Predict the order of f(−1) and f(1), then compare it with the order of the inputs.','先猜 f(−1) 與 f(1) 的大小，再與輸入的大小比較。'),
 explanation:bi('1/x decreases separately on (−∞,0) and (0,∞). Across zero, −1<1 but f(−1)=−1<f(1)=1, which refutes decrease on the whole domain.','1/x 分別在 (−∞,0) 及 (0,∞) 遞減；跨零時 −1<1 但 f(−1)＝−1<f(1)＝1，反駁整個定義域遞減。'),
 conditions:bi('For strict decrease, every allowed pair x₁<x₂ must satisfy f(x₁)>f(x₂). x=0 is not allowed.','嚴格遞減要求每對允許的 x₁<x₂ 都有 f(x₁)>f(x₂)；x＝0 不允許。'),
 misconception:bi('Two decreasing branches imply decrease on their union.','兩段各自遞減，聯集上就一定遞減。'),
 challenge:bi('For 2x²+1 on (0,∞), use a difference of squares to prove increase.','對 (0,∞) 上的 2x²＋1，用平方差證明遞增。'),
 proof:bi('For same-sign x₁<x₂, 1/x₁−1/x₂=(x₂−x₁)/(x₁x₂)>0. A crossing-zero pair has negative denominator and reverses this sign.','同號的 x₁<x₂ 滿足 1/x₁−1/x₂＝(x₂−x₁)/(x₁x₂)>0；跨零時分母為負，符號相反。'),
 teacherPrompt:bi('Keep x₁<x₂ visible and ask which word in “for every pair” the counterexample defeats.','保持 x₁<x₂ 可見，追問反例否定了「任意一對」的甚麼意思。'),
 exit:{prompt:bi('Give one pair refuting whole-domain decrease of 1/x.','給一對輸入反駁 1/x 在整個定義域遞減。'),answer:bi('x₁=−1, x₂=1 gives −1<1 and f(x₁)<f(x₂).','x₁＝−1、x₂＝1；輸入遞增，輸出亦由 −1 增至 1。')},
},[c('Both inputs positive','兩輸入為正'),c('Both inputs negative','兩輸入為負',[preset('rule','reciprocal-negative')]),c('Cross zero','跨越零',[preset('rule','reciprocal-whole'),drag('x1',px(-1,-4,4)),drag('x2',px(1,-4,4))],true),c('Forbidden input zero','不允許的輸入零',[preset('rule','reciprocal-whole'),drag('x1',px(0,-4,4))],true)]);

const f10=functionTask(10,{
 title:bi('Symmetry needs the matching input','對稱需要配對輸入'),
 question:bi('Is x² still even when its domain is restricted to [0,3]?','x² 的定義域限制為 [0,3] 後，仍是偶函數嗎？'),
 prediction:bi('For x=2, first ask whether −2 is allowed; only then compare f(−x) and f(x).','對 x＝2，先問 −2 是否允許，再比較 f(−x) 與 f(x)。'),
 explanation:bi('Odd/even definitions require a domain symmetric about zero. x² on [0,3] fails that requirement. On a symmetric domain, x² is even, x³ odd, and the zero function both.','奇偶性的定義要求定義域關於零對稱；[0,3] 上的 x² 不符合。對稱定義域上，x² 為偶、x³ 為奇，零函數兩者皆是。'),
 conditions:bi('Check domain symmetry before the identities f(−x)=f(x) or f(−x)=−f(x).','檢查 f(−x)＝f(x) 或 f(−x)＝−f(x) 前，先檢查定義域對稱。'),
 misconception:bi('The formula alone decides parity; odd and even are mutually exclusive.','只靠解析式便可判斷奇偶；奇函數與偶函數不能重疊。'),
 challenge:bi('Compare the mirrored point with the actual value for x+1. Identify a numerical failure of evenness.','對 x＋1 比較鏡像點與實際函數值，找一個否定偶性的數值。'),
 proof:bi('On a symmetric domain, (−x)²=x², (−x)³=−x³, and 0=−0. The restricted interval lacks −2 while containing 2.','在對稱定義域，(−x)²＝x²、(−x)³＝−x³、0＝−0；限制區間包含 2 卻不包含 −2。'),
 teacherPrompt:bi('Ask for the domain test and identity test as two separate decisions.','要求把定義域檢查與恆等式檢查分成兩步。'),
 exit:{prompt:bi('Can a function be both odd and even on a symmetric nonempty domain?','在非空對稱定義域，函數可同時為奇及偶嗎？'),answer:bi('Yes: f(x)=0. If both identities hold, f(x)=−f(x), so every value is zero.','可以，f(x)＝0；若兩恆等式同時成立，f(x)＝−f(x)，故每個值皆為零。')},
},[c('Square on symmetric domain','對稱定義域上的平方'),c('Square on [0,3]','[0,3] 上的平方',[preset('domain','restricted')],true),c('Shifted line','平移直線',[preset('rule','shift')],true),c('Zero function','零函數',[preset('rule','zero')],true)]);

const f11=functionTask(11,{
 title:bi('Five powers, different forbidden inputs','五種冪函數，不同的禁用輸入'),
 question:bi('Which of x, x², x³, √x and 1/x are defined at −1 and at 0?','x、x²、x³、√x、1/x 哪些在 −1 及 0 有定義？'),
 prediction:bi('On paper, mark allowed/rejected before matching each curve to its formula.','配對圖線與公式前，先在紙上標示輸入允許或拒絕。'),
 explanation:bi('Real √x requires x≥0; 1/x requires x≠0. The integer positive powers x, x² and x³ accept every real input.','實數 √x 要求 x≥0；1/x 要求 x≠0；正整數冪 x、x²、x³ 接受每個實數。'),
 conditions:bi('These are the five specified real-valued rules, not a claim that all real powers have the same domain.','此處只討論指定的五種實函數，並非所有實指數冪都有相同定義域。'),
 misconception:bi('Every power function is defined on all real numbers.','每種冪函數的定義域都是全部實數。'),
 challenge:bi('Explain why x² and x³ agree at 0 and 1 but disagree at −1.','解釋為何 x² 與 x³ 在 0、1 相同，在 −1 卻不同。'),
 proof:bi('Apply each operation’s real-domain condition. Polynomial integer powers require no divisions or roots; √x and 1/x do.','逐一使用實數運算條件；整數正冪無須除法或開根，√x 與 1/x 則有相應限制。'),
 teacherPrompt:bi('Use the zero case to distinguish “output zero” from “undefined”.','用零的案例區分「輸出為零」與「未定義」。'),
 exit:{prompt:bi('List the five outputs at x=0, using “undefined” where needed.','列五種函數在 x＝0 的值，必要時寫「未定義」。'),answer:bi('0, 0, 0, 0, undefined, in the given order.','依次為 0、0、0、0、未定義。')},
},[c('Negative versus positive input','負與正輸入'),c('Zero versus negative input','零與負輸入',[drag('x',px(0,-3,3)),drag('other',px(-1,-3,3))],true),c('Positive fractional input','正分數輸入',[drag('x',px(.25,-3,3)),drag('other',px(2,-3,3))])]);

const f12=functionTask(12,{
 title:bi('When does the larger exponent give less?','較大指數何時反而較小？'),
 question:bi('For positive x, does x³ always exceed x²?','對正數 x，x³ 一定大於 x² 嗎？'),
 prediction:bi('Predict the ordering for x=0.5, 1 and 2 before moving the probe.','移動游標前，先猜 x＝0.5、1、2 的大小關係。'),
 explanation:bi('x³−x²=x²(x−1). Since x²>0 for x>0, the sign is determined by x−1: less below 1, equal at 1, greater above 1.','x³−x²＝x²(x−1)；x>0 時 x²>0，故符號由 x−1 決定：小於 1 時較小，等於 1 時相同，大於 1 時較大。'),
 conditions:bi('The comparison here assumes x>0 and compares powers of the same base. Comparing two bases is a different question.','此比較假設 x>0，並使用同一底數；比較不同底數是另一個問題。'),
 misconception:bi('A larger exponent always produces a larger positive value.','正數的指數愈大，值一定愈大。'),
 challenge:bi('In same-power mode, compare a² and b² for positive a<b using factorisation.','在相同指數模式，對正數 a<b 以因式分解比較 a² 與 b²。'),
 proof:bi('Factor the difference rather than extrapolating three samples. For positive a<b, b²−a²=(b−a)(b+a)>0.','應因式分解差值，而非由三次測試推廣；正數 a<b 時 b²−a²＝(b−a)(b＋a)>0。'),
 teacherPrompt:bi('Keep the equality case x=1 between the two opposite inequalities.','把 x＝1 的等號案例放在兩種相反不等式之間比較。'),
 exit:{prompt:bi('Compare 0.8² and 0.8³ without decimal multiplication.','不做小數乘法，比較 0.8² 與 0.8³。'),answer:bi('0.8²>0.8³ because multiplication by 0.8 reduces a positive value.','0.8²>0.8³；正數再乘 0.8 會減小。')},
},[c('Base 0.5','底數 0.5'),c('Boundary base 1','邊界底數 1',[drag('x',px(1,.1,3))],true),c('Base 2','底數 2',[drag('x',px(2,.1,3))])]);

const correctDiscount=[drop('discount','slot-1'),drop('subtract','slot-2')];
const f13=functionTask(13,{
 title:bi('Undo the input rule in the right order','用正確次序還原輸入'),
 question:bi('If f(2x+1)=6x+5, how do you obtain f(u) rather than f((u−1)/2)?','若 f(2x＋1)＝6x＋5，怎樣求 f(u)，而非 f((u−1)/2)？'),
 prediction:bi('For u=3, place “subtract 1” and “halve” in the order that recovers x.','對 u＝3，把「減 1」及「除 2」按還原 x 的次序排列。'),
 explanation:bi('Set u=2x+1, so x=(u−1)/2. Substitution yields f(u)=6(u−1)/2+5=3u+2. Undoing the input is not inverting f.','設 u＝2x＋1，則 x＝(u−1)/2；代入得 f(u)＝6(u−1)/2＋5＝3u＋2。還原輸入不等於求 f 的反函數。'),
 conditions:bi('The affine input rule is invertible over real numbers. In the discount context, eligibility is checked using the original price.','一次輸入規則在實數上可逆；折扣情境的資格按原價判定。'),
 misconception:bi('Halve then subtract 1 is the inverse of doubling then adding 1.','先除 2 再減 1，就是先乘 2 再加 1 的逆步驟。'),
 challenge:bi('Compare “10% off then subtract 20” with the reverse order at an eligible original price of 100.','原價 100 符合資格時，比較「九折再減 20」與相反次序。'),
 proof:bi('Substitute x=(u−1)/2 into the stated identity; then 2x+1=u exactly. For prices, 0.9p−20 differs from 0.9(p−20) by −2.','把 x＝(u−1)/2 代回指定恆等式，左邊輸入恰為 u；價錢方面，0.9p−20 與 0.9(p−20) 相差 −2。'),
 teacherPrompt:bi('After each rearrangement, run the recovered x forward through 2x+1 and check whether it returns u.','每次排列後，把所得 x 再代入 2x＋1，檢查能否回到 u。'),
 exit:{prompt:bi('From f(2x+1)=6x+5, find f(−3).','由 f(2x＋1)＝6x＋5 求 f(−3)。'),answer:bi('x=−2, hence f(−3)=−12+5=−7.','x＝−2，故 f(−3)＝−12＋5＝−7。')},
},[c('Subtract 1, then halve','先減 1 再除 2',[preset('rule','substitution'),drop('subtract-one','slot-1'),drop('halve','slot-2')]),c('Wrong inverse order','錯誤的還原次序',[preset('rule','substitution'),drop('halve','slot-1'),drop('subtract-one','slot-2')],true),c('Discount then subtract','九折再減 20',correctDiscount),c('Reverse discount order','交換折扣次序',[...correctDiscount,action('reverse')],true)]);

const f14=functionTask(14,{
 title:bi('Cheapest at this quantity or most within budget?','指定冊數最便宜，還是預算內印最多？'),
 question:bi('Can the best plan change when the decision question changes?','決策問題改變時，最佳方案會改變嗎？'),
 prediction:bi('At n=10, 30 and 50, predict the cheaper plan; then use budget 160 to predict the greatest affordable count.','在 n＝10、30、50 先猜較便宜的方案，再用預算 160 猜最多可印冊數。'),
 explanation:bi('P(n)=20+3n. Q(n)=5n for n≤20 and 2n+60 for n>20. Ties occur at integer counts 10 and 40. With budget 160, P allows 46 booklets and Q allows 50.','P(n)＝20＋3n；Q 在 n≤20 為 5n，n>20 為 2n＋60。整數同價點為 10、40；預算 160 時 P 可印 46 冊、Q 可印 50 冊。'),
 conditions:bi('Printing counts are integers 1–80. Rental time uses 0<t≤40 and different cost rules; t=0 is excluded.','印刷冊數為 1 至 80 的整數；租借時間使用 0<t≤40 及不同費用規則，排除 t＝0。'),
 misconception:bi('The plan cheaper at one quantity must always be the best choice.','某冊數較便宜的方案在所有問題都最優。'),
 challenge:bi('Explain the two printing tie points using the two Q branches instead of just spotting crossings.','利用 Q 的兩段規則說明兩個同價點，不只看交點。'),
 proof:bi('On n≤20, P−Q=20−2n, giving n=10; on n>20, P−Q=n−40, giving n=40. Budget counts follow integer inequalities, not rounded real solutions.','n≤20 時 P−Q＝20−2n，得 n＝10；n>20 時 P−Q＝n−40，得 n＝40。預算冊數須解整數不等式，不能把實數解四捨五入。'),
 teacherPrompt:bi('State the objective and domain aloud before students choose a quote token.','學生放報價標記前，先清楚說出目標及定義域。'),
 exit:{prompt:bi('With budget 160, why is P limited to 46 rather than 47?','預算 160 時，為何 P 最多 46 冊而非 47 冊？'),answer:bi('P(46)=158≤160, but P(47)=161>160.','P(46)＝158≤160，但 P(47)＝161>160。')},
},[c('Tie at 10 booklets','10 冊同價'),c('30 booklets','30 冊',[drag('quantity',px(30,1,80))]),c('50 booklets','50 冊',[drag('quantity',px(50,1,80))]),c('Budget 160','預算 160',[preset('objective','budget'),drag('budget',900,350-160/330*280)],true),c('Rental at excluded time zero','租借的禁用時間零',[preset('context','rental'),drag('quantity',px(0,0,40))],true)]);

const nativeById=new Map(functionSpecs.map(row=>[row.activity.id,row]));
/** Accept only state produced by these fixed native engines; never evaluate expressions. */
export function directStateForCase(id,params={}){
 const spec=nativeById.get(id);if(!spec)throw new RangeError('Unknown native function micro-inquiry.');
 if(params.directState!==undefined){
  const check=value=>{if(typeof value==='number'&&!Number.isFinite(value))throw new TypeError('Nonfinite native state');if(value&&typeof value==='object'){for(const[key,v]of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(key))throw new TypeError('Invalid native state');check(v);}}};
  if(!params.directState||typeof params.directState!=='object'||Array.isArray(params.directState))throw new TypeError('Invalid native state');check(params.directState);return clone(params.directState);
 }
 const index=String(params.scenario??'0');if(!/^\d+$/.test(index)||!spec.directCases[Number(index)])throw new RangeError('Unknown function scenario.');
 return spec.directCases[Number(index)].actions.reduce((s,a)=>reduceDirectState(spec.activity.nativeId,s,clone(a)),createDirectState(spec.activity.nativeId));
}
export function directAction(id,state,nativeAction){const spec=nativeById.get(id);if(!spec)throw new RangeError('Unknown native function micro-inquiry.');return reduceDirectState(spec.activity.nativeId,state,nativeAction);}
export function directScene(id,state,locale='en'){const spec=nativeById.get(id);if(!spec)throw new RangeError('Unknown native function micro-inquiry.');return renderDirectScene(spec.activity.nativeId,state,locale);}

const number=(key,en,zh,min,max,step=1)=>({key,label:bi(en,zh),min,max,step});
const select=(key,en,zh,options)=>({key,label:bi(en,zh),options:options.map(([value,en,zh])=>({value,label:bi(en,zh)}))});
const testCase=(en,zh,params,boundary=false)=>({label:bi(en,zh),params,boundary});
function ordinary(chapter,n,fields,controls,cases){return {id:`g10-${chapter}-${String(n).padStart(2,'0')}`,chapter,order:n,duration:bi('5–10 minutes','5–10 分鐘'),prerequisites:bi('Real-number operations and reading coordinates; write a prediction on paper.','實數運算及閱讀坐標；先在紙上寫預測。'),...fields,controls,cases};}

const radical=ordinary('05',15,{
 title:bi('Squaring can create a false root','平方可能產生增根'),
 question:bi('Why does squaring √(x+2)=x produce two candidates but only one solution?','為何 √(x＋2)＝x 平方後有兩個候選根，卻只有一個解？'),
 prediction:bi('Predict whether x=−1 and x=2 satisfy the original equation before checking either graph.','看圖前先猜 x＝−1、2 是否滿足原方程。'),
 explanation:bi('Squaring gives x²=x+2, with candidates −1 and 2. The original square root is nonnegative, so its right side must satisfy x≥0. Substitution rejects −1 and accepts 2.','平方得 x²＝x＋2，候選根為 −1、2；原根式非負，右邊須有 x≥0，代回拒絕 −1、接受 2。'),
 conditions:bi('Real radicand requires x≥−2; equality with the principal square root additionally requires x≥0.','實數被開方數要求 x≥−2；與主平方根相等另要求 x≥0。'),
 misconception:bi('Squaring an equation always preserves exactly its solutions.','方程兩邊平方一定完整保留解集。'),
 challenge:bi('Compare the intersections of y=√(x+2), y=x, and y=x² versus y=x+2.','比較 y＝√(x＋2) 與 y＝x 的交點，以及 y＝x² 與 y＝x＋2 的交點。'),
 proof:bi('For real A≥0, √A=B is equivalent to A=B² together with B≥0. Here x²−x−2=(x−2)(x+1)=0; retaining x≥0 leaves x=2 only.','實數 A≥0 時，√A＝B 等價於 A＝B² 且 B≥0。此處 x²−x−2＝(x−2)(x＋1)＝0，再保留 x≥0，只有 x＝2。'),
 teacherPrompt:bi('Write an implication arrow for squaring, then ask what added condition makes it equivalence.','平方時先寫單向推出，再問加甚麼條件才能改成等價。'),
 exit:{prompt:bi('Solve √(x+2)=x and identify the extraneous candidate.','解 √(x＋2)＝x，指出增根。'),answer:bi('Solution x=2; candidate x=−1 is extraneous because 1≠−1.','解為 x＝2；候選根 −1 是增根，因為 1≠−1。')},
},[number('x','Test input x','測試輸入 x',-4,4,.5)],[testCase('Accepted root 2','接受的根 2',{x:2}),testCase('Extraneous candidate −1','增根候選 −1',{x:-1},true),testCase('Outside radical domain −3','超出根式定義域 −3',{x:-3},true),testCase('Radicand boundary −2','被開方數邊界 −2',{x:-2},true)]);

const expTasks=[];
function exponent(n,fields,controls,cases){const a=ordinary('06',n,fields,controls,cases);expTasks.push(a);return a;}
exponent(1,{
 title:bi('A negative exponent is a reciprocal','負指數表示倒數'),question:bi('Does 2⁻³ mean a negative number or a reciprocal?','2⁻³ 是負數還是倒數？'),
 prediction:bi('Continue the sequence 2³,2²,2¹,2⁰ one step at a time to exponent −3.','把 2³、2²、2¹、2⁰ 的序列逐步延伸至指數 −3。'),
 explanation:bi('Reducing the exponent by one divides by the nonzero base. Thus a⁰=1 and a⁻ⁿ=1/aⁿ for a≠0. The minus sign in the exponent does not negate the value.','指數每減一，便除以非零底數；故 a≠0 時 a⁰＝1、a⁻ⁿ＝1/aⁿ，指數的負號不是把值取負。'),
 conditions:bi('The exponent here is an integer. Zero to a negative exponent and 0⁰ are not defined in this task.','此處指數為整數；本課不定義零的負整數冪及 0⁰。'),
 misconception:bi('a⁻ⁿ=−aⁿ.','a⁻ⁿ＝−aⁿ。'),challenge:bi('For a=−2, compare odd and even negative exponents.','令 a＝−2，比較奇數與偶數負指數。'),
 proof:bi('For a≠0, preserving aⁿa⁻ⁿ=a⁰=1 forces a⁻ⁿ=1/aⁿ. This algebra, rather than a few sequence terms, establishes the identity.','a≠0 時，保持 aⁿa⁻ⁿ＝a⁰＝1，必得 a⁻ⁿ＝1/aⁿ；這是一般代數理由，並非只靠幾項序列。'),
 teacherPrompt:bi('Ask students to name the repeated operation when the exponent decreases.','請學生說出指數每減一時重複了甚麼運算。'),
 exit:{prompt:bi('Find 5⁻².','求 5⁻²。'),answer:bi('1/25.','1/25。')},
},[number('a','Base a','底數 a',-4,4,.5),number('n','Integer exponent n','整數指數 n',-4,4)],[testCase('Reciprocal 2⁻³','倒數 2⁻³',{a:2,n:-3}),testCase('Odd negative exponent','奇數負指數',{a:-2,n:-3}),testCase('Zero base forbidden','禁用零底數',{a:0,n:-1},true),testCase('Zero exponent','零指數',{a:2,n:0},true)]);

exponent(2,{
 title:bi('A fractional exponent names a root','分數指數表示根式'),question:bi('What does 16^(3/4) ask you to do?','16^(3/4) 要求做甚麼運算？'),
 prediction:bi('Take a fourth root and cube it; predict whether reversing those two operations changes the result.','先開四次根再立方，猜交換兩步是否改變結果。'),
 explanation:bi('For positive a, a^(p/q)=(q√a)ᵖ with integer p and positive integer q. Here 16^(3/4)=2³=8. Negative p then takes a reciprocal.','對 a>0，整數 p、正整數 q 滿足 a^(p/q)＝(q 次根 a)ᵖ；故 16^(3/4)＝2³＝8，p 為負時再取倒數。'),
 conditions:bi('Use a>0 so all rational exponents have one consistent real definition. This activity rejects a≤0 rather than extending selected odd-root cases.','採 a>0，使所有有理指數有一致的實數定義；本活動拒絕 a≤0，不擴展個別奇次根情況。'),
 misconception:bi('a^(p/q)=(aᵖ)/q.','a^(p/q)＝aᵖ/q。'),challenge:bi('Explain why 16^(−3/4)=1/8.','解釋為何 16^(−3/4)＝1/8。'),
 proof:bi('The positive qth root is the unique positive r with r^q=a. Define a^(p/q)=rᵖ; reducing p/q preserves the same positive value.','正 q 次根是滿足 r^q＝a 的唯一正數 r；定義 a^(p/q)＝rᵖ，約分不改變所得正值。'),
 teacherPrompt:bi('Label numerator “power” and denominator “root”; keep the positive-base condition beside the rule.','把分子標「次方」、分母標「開根」，並把正底數條件寫在公式旁。'),
 exit:{prompt:bi('Evaluate 27^(2/3).','求 27^(2/3)。'),answer:bi('9, since the cube root of 27 is 3.','9；27 的三次根是 3。')},
},[number('a','Positive base a','正底數 a',-2,81,1),number('p','Integer numerator p','整數分子 p',-4,4),number('q','Positive denominator q','正整數分母 q',1,5)],[testCase('Fourth root cubed','四次根再立方',{a:16,p:3,q:4}),testCase('Negative numerator','負分子',{a:16,p:-3,q:4}),testCase('Unit base','單位底數',{a:1,p:3,q:4},true),testCase('Nonpositive base rejected','拒絕非正底數',{a:-1,p:1,q:2},true)]);

exponent(3,{
 title:bi('Equal additions or equal ratios?','固定增量還是固定倍率？'),question:bi('Does adding 20 each round match growing by 20% each round?','每輪加 20 等於每輪增長 20% 嗎？'),
 prediction:bi('Starting at 100, predict both quantities after two rounds before reading the graph.','由 100 開始，看圖前先猜兩輪後兩種模型的量。'),
 explanation:bi('Fixed increments give L(n)=100+20n. Fixed ratios give E(n)=100×1.2ⁿ. They agree after one round but differ after two: 140 and 144.','固定增量給 L(n)＝100＋20n，固定倍率給 E(n)＝100×1.2ⁿ；一輪後相同，兩輪後分別為 140、144。'),
 conditions:bi('Rounds n are nonnegative integers. A constant ratio is an assumption. A negative linear-model prediction is not a meaningful remaining quantity.','輪數 n 為非負整數；固定比率是模型假設。一次模型若預測負數，不能當成實際剩餘量。'),
 misconception:bi('A fixed percentage means the same absolute change each round.','固定百分比等於每輪改變固定數量。'),challenge:bi('Set multiplier 0.8 and compare repeated 20% removal with subtracting 20 each round.','把倍率設為 0.8，比較反覆減去 20% 與每輪減 20。'),
 proof:bi('The recurrence E(n+1)=rE(n), E(0)=100 gives E(n)=100rⁿ by induction. L(n+1)−L(n)=100(r−1) is constant, while exponential differences depend on n.','遞推 E(n＋1)＝rE(n)、E(0)＝100，以歸納得 E(n)＝100rⁿ；L 的差固定為 100(r−1)，指數模型的差則依 n 改變。'),
 teacherPrompt:bi('Ask for the next increment and next ratio in each model, not just the final values.','除最後數值外，追問兩模型下一步的增量及比率。'),
 exit:{prompt:bi('After three rounds retaining 80% of 100, what remains?','100 每輪保留 80%，三輪後剩多少？'),answer:bi('100×0.8³=51.2.','100×0.8³＝51.2。')},
},[number('r','Multiplier r','倍率 r',.2,2,.1),number('n','Number of rounds n','輪數 n',0,8)],[testCase('Two growth rounds','兩輪增長',{r:1.2,n:2}),testCase('Three decay rounds','三輪衰減',{r:.8,n:3}),testCase('No change ratio 1','不變倍率 1',{r:1,n:3},true),testCase('Initial round zero','起始輪數零',{r:1.2,n:0},true)]);

exponent(4,{
 title:bi('Crossing the base 1 reverses growth','底數越過 1，增減方向改變'),question:bi('What changes in aˣ when a passes through 1?','a 越過 1 時，aˣ 有甚麼改變？'),
 prediction:bi('Compare outputs at x=−1,0,1 for bases 0.5,1,2.','先比較底數 0.5、1、2 在 x＝−1、0、1 的輸出。'),
 explanation:bi('For a>1, aˣ is increasing; for 0<a<1 it is decreasing. Every positive base gives a⁰=1. At a=1 the rule is constant, not an exponential function in this course.','a>1 時 aˣ 遞增；0<a<1 時遞減；每個正底數都有 a⁰＝1；a＝1 為常數，本課不把它稱為指數函數。'),
 conditions:bi('The real exponential family requires a>0 and a≠1. Its domain is all real numbers and its range is (0,∞).','實指數函數要求 a>0 且 a≠1，定義域為實數，值域為 (0,∞)。'),
 misconception:bi('A larger base always gives a larger output for every x.','底數較大時，對每個 x 的輸出都較大。'),challenge:bi('Compare 2ˣ and 3ˣ for x<0; explain why their ordering reverses.','比較 x<0 時的 2ˣ 與 3ˣ，解釋為何大小相反。'),
 proof:bi('For x₂>x₁, a^x₂/a^x₁=a^(x₂−x₁). This ratio exceeds 1 if a>1 and is below 1 if 0<a<1.','x₂>x₁ 時，a^x₂/a^x₁＝a^(x₂−x₁)；a>1 時比率大於 1，0<a<1 時小於 1。'),
 teacherPrompt:bi('Keep the point (0,1) fixed while comparing a positive and a negative input.','保持 (0,1) 固定，並比較正、負兩種輸入。'),
 exit:{prompt:bi('Is (1/2)ˣ increasing or decreasing, and can its value be zero?','(1/2)ˣ 遞增還是遞減？函數值可等於零嗎？'),answer:bi('Decreasing; every finite real input has positive output.','遞減；每個有限實數輸入的輸出均大於零。')},
},[number('a','Base a','底數 a',-1,3,.25),number('x','Input x','輸入 x',-3,3,.5)],[testCase('Growth base 2','增長底數 2',{a:2,x:1}),testCase('Decay base 0.5','衰減底數 0.5',{a:.5,x:1}),testCase('Constant boundary 1','常數邊界 1',{a:1,x:1},true),testCase('Nonpositive base','非正底數',{a:0,x:1},true)]);

exponent(5,{
 title:bi('A logarithm asks for an exponent','對數是在問指數'),question:bi('What number does log₂8 ask for, and why is log₂0 impossible?','log₂8 問的是哪個數？為何 log₂0 不可能？'),
 prediction:bi('Complete 2^?=8 and 2^?=1/4 before selecting logarithm inputs.','選對數輸入前，先完成 2^?＝8 及 2^?＝1/4。'),
 explanation:bi('logₐb is the exponent y satisfying aʸ=b. Thus log₂8=3 and log₂(1/4)=−2. A positive exponential never equals zero or a negative number.','logₐb 是滿足 aʸ＝b 的指數 y；故 log₂8＝3、log₂(1/4)＝−2；正底數的指數值不會等於零或負數。'),
 conditions:bi('A real logarithm requires a>0, a≠1 and argument b>0. A negative logarithm value is allowed.','實對數要求 a>0、a≠1 及真數 b>0；對數值本身可以為負。'),
 misconception:bi('The logarithm value must be positive; logₐ0=0.','對數值必須為正；logₐ0＝0。'),challenge:bi('Explain why base 1 gives either no exponent or infinitely many, not a logarithm function.','解釋底數 1 為何會沒有指數解或有無限多個，而不能定義對數函數。'),
 proof:bi('The exponential aʸ is positive and strictly monotone for a>0,a≠1; it therefore has exactly one exponent for each positive output.','a>0、a≠1 時 aʸ 為正且嚴格單調，因此每個正輸出恰對應一個指數。'),
 teacherPrompt:bi('Always read logₐb aloud as “a to what exponent equals b?”.','每次把 logₐb 讀成「a 的多少次方等於 b？」'),
 exit:{prompt:bi('Evaluate log₃(1/9).','求 log₃(1/9)。'),answer:bi('−2 because 3⁻²=1/9.','−2，因為 3⁻²＝1/9。')},
},[number('a','Logarithm base a','對數底數 a',0,4,.5),number('b','Argument b','真數 b',-2,16,.25)],[testCase('Positive logarithm','正對數值',{a:2,b:8}),testCase('Negative logarithm','負對數值',{a:2,b:.25}),testCase('Zero argument','零真數',{a:2,b:0},true),testCase('Forbidden base 1','禁用底數 1',{a:1,b:8},true)]);

exponent(6,{
 title:bi('Swap coordinates for inverse graphs','交換坐標看反函數圖像'),question:bi('If (2,4) lies on y=2ˣ, which point lies on y=log₂x?','若 (2,4) 在 y＝2ˣ 上，哪一點在 y＝log₂x 上？'),
 prediction:bi('Reflect the point across y=x before plotting its inverse partner.','畫反函數配對點前，先把點對 y＝x 反射。'),
 explanation:bi('The relation y=aˣ is equivalent to x=logₐy. Swapping coordinates reflects the graph in y=x. Domain and range exchange: real inputs/positive outputs become positive inputs/real outputs.','y＝aˣ 等價於 x＝logₐy；交換坐標使圖像關於 y＝x 對稱；實數輸入及正輸出交換為正輸入及實數輸出。'),
 conditions:bi('Require a>0,a≠1. The inverse graph has no point with input zero, even when its output is negative.','須 a>0、a≠1；反函數沒有輸入為零的點，即使其輸出可以為負。'),
 misconception:bi('An inverse graph is obtained by changing y to −y.','反函數圖像是把 y 改成 −y。'),challenge:bi('Repeat for a=1/2 and input −1. Explain why both inverse functions decrease.','對 a＝1/2、輸入 −1 重做，解釋為何兩個互逆函數都遞減。'),
 proof:bi('Applying logₐ to aˣ gives x and exponentiating logₐu gives u for u>0. These identities establish inversion beyond the displayed points.','logₐ(aˣ)＝x，而 u>0 時 a^(logₐu)＝u；這些恆等式證明互逆，不只依靠圖中幾點。'),
 teacherPrompt:bi('Have students label each coordinate as input or output before swapping it.','交換前先讓學生把每個坐標標成輸入或輸出。'),
 exit:{prompt:bi('Reflect (−2,1/4) from y=2ˣ into its inverse graph.','把 y＝2ˣ 的 (−2,1/4) 反射至反函數圖像。'),answer:bi('(1/4,−2), on y=log₂x.','(1/4,−2)，在 y＝log₂x 上。')},
},[number('a','Base a','底數 a',.25,3,.25),number('x','Exponential input x','指數函數輸入 x',-2,2,.5)],[testCase('Point (2,4)','點 (2,4)',{a:2,x:2}),testCase('Point with negative exponent','負指數的點',{a:2,x:-2}),testCase('Decreasing inverse pair','遞減的互逆函數對',{a:.5,x:-1}),testCase('Base 1 has no inverse','底數 1 沒有反函數',{a:1,x:1},true)]);

exponent(7,{
 title:bi('Products become sums of logarithms','乘積化成對數的和'),question:bi('Is logₐ(u+v)=logₐu+logₐv?','logₐ(u＋v)＝logₐu＋logₐv 嗎？'),
 prediction:bi('For base 2 and u=v=2, predict the logarithms of the product and of the sum.','底數 2、u＝v＝2 時，先猜乘積與和的對數。'),
 explanation:bi('For positive u,v, logₐ(uv)=logₐu+logₐv. There is no corresponding sum rule. With u=2,v=4, the right side is 3 while log₂6 differs.','u,v>0 時 logₐ(uv)＝logₐu＋logₐv；沒有相同的加法規則。u＝2、v＝4 時右邊為 3，log₂6 卻不同。'),
 conditions:bi('Require a>0,a≠1 and u,v>0 separately. A positive product of two negative numbers does not make their separate real logarithms exist.','須 a>0、a≠1，並逐一要求 u,v>0；兩個負數乘積為正，不代表它們各自有實對數。'),
 misconception:bi('A rule for the logarithm of a product also works for a sum.','乘積的對數公式也適用於相加。'),challenge:bi('Use the product rule to derive quotient, power and change-of-base formulas, stating all domain conditions.','由乘積法則推出商、冪及換底公式，並說明各自條件。'),
 proof:bi('Write u=aʳ,v=aˢ. Then uv=a^(r+s), u/v=a^(r−s), and uᵏ=a^(kr). For valid base c, logₐu=log_cu/log_ca.','設 u＝aʳ、v＝aˢ，則 uv＝a^(r＋s)、u/v＝a^(r−s)、uᵏ＝a^(kr)。合法底數 c 下，logₐu＝log_cu/log_ca。'),
 teacherPrompt:bi('First use u=v=2 to expose an accidental agreement; then change v to 4 to demand a true counterexample.','先用 u＝v＝2 展示偶然相同，再把 v 改為 4，要求找出真正反例。'),
 exit:{prompt:bi('Evaluate log₂8−log₂2 and explain the single-log form.','求 log₂8−log₂2，並寫成單一對數。'),answer:bi('2, equal to log₂(8/2)=log₂4.','2，即 log₂(8/2)＝log₂4。')},
},[number('a','Base a','底數 a',.5,4,.5),number('u','First argument u','第一真數 u',-4,8,.5),number('v','Second argument v','第二真數 v',-4,8,.5)],[testCase('Accidental equality at 2 and 2','2 與 2 的偶然相同',{a:2,u:2,v:2},true),testCase('Counterexample at 2 and 4','2 與 4 的反例',{a:2,u:2,v:4},true),testCase('Positive quotient','正數商',{a:2,u:8,v:2}),testCase('Positive product, forbidden factors','乘積為正但因數禁用',{a:2,u:-2,v:-4},true)]);

exponent(8,{
 title:bi('The threshold between two integer rounds','兩個整數輪次之間的臨界值'),question:bi('When does 100rⁿ first reach a target, and why might rounding a logarithm fail?','100rⁿ 何時首次達到目標？為何把對數四捨五入可能錯？'),
 prediction:bi('For growth r=1.2 and target 150, predict the first whole round that reaches the target.','r＝1.2 增長至目標 150，先猜首次達標的整數輪次。'),
 explanation:bi('For growth r>1 and target above 100, the real crossing is n*=log(target/100)/log r, but the first integer round is the least integer ≥n*. For decay 0<r<1, use the first round at or below the target.','r>1 且目標大於 100 時，實數臨界為 n*＝log(目標/100)/log r，首次整數輪次須取不小於 n* 的最小整數；0<r<1 衰減時改問首次不超過目標。'),
 conditions:bi('n is a nonnegative integer and the target is positive. The question is at-or-above for growth and at-or-below for decay. At r=1 only a target already met at n=0 is reachable.','n 為非負整數且目標為正；增長問不少於，衰減問不多於；r＝1 時只有 n＝0 已達到的目標可行。'),
 misconception:bi('Round the real logarithmic answer to the nearest integer.','把對數所得實數解四捨五入即可。'),challenge:bi('For r=0.8 and target 50, check the two integer rounds on either side of the real crossing.','r＝0.8、目標 50 時，檢查臨界實數兩側的整數輪次。'),
 proof:bi('Monotonicity converts the threshold to an inequality in n; evaluate the candidate round and its predecessor to certify first attainment. A logarithmic approximation alone is insufficient.','單調性把達標條件轉成 n 的不等式；代入候選輪次及其前一輪，才能證明首次達標；對數近似本身不足。'),
 teacherPrompt:bi('Require both a failed preceding round and a successful first round in the written explanation.','書面解釋須同時列前一輪未達標及本輪達標。'),
 exit:{prompt:bi('100×1.2ⁿ reaches at least 150 first at which integer n?','100×1.2ⁿ 首次不少於 150 的整數 n 是多少？'),answer:bi('3: round 2 gives 144 and round 3 gives 172.8.','3；第 2 輪為 144，第 3 輪為 172.8。')},
},[number('r','Multiplier r','倍率 r',.2,2,.1),number('target','Positive target','正目標量',-20,300,10)],[testCase('Growth to 150','增長至 150',{r:1.2,target:150}),testCase('Decay to 50','衰減至 50',{r:.8,target:50}),testCase('Target at the initial value','目標等於起始值',{r:1.2,target:100},true),testCase('Constant cannot reach 150','常數無法到達 150',{r:1,target:150},true),testCase('Nonpositive target rejected','拒絕非正目標',{r:.8,target:0},true)]);

exponent(9,{
 title:bi('A decreasing base reverses the inequality','遞減底數會反轉不等號'),question:bi('Does logₐx<logₐb always imply x<b?','logₐx<logₐb 一定推出 x<b 嗎？'),
 prediction:bi('Solve log₂x<log₂4 and log_(1/2)x<log_(1/2)4 before testing a value.','先解 log₂x<log₂4 及 log_(1/2)x<log_(1/2)4，再代入測試。'),
 explanation:bi('For a>1, logₐx<logₐb gives 0<x<b and aˣ<aᵇ gives x<b. For 0<a<1, both functions decrease and both comparisons instead give x>b. Equality x=b is excluded.','a>1 時，logₐx<logₐb 給 0<x<b，aˣ<aᵇ 給 x<b；0<a<1 時兩種函數均遞減，兩種比較均改為 x>b，並排除 x＝b。'),
 conditions:bi('Require a>0,a≠1. Logarithmic arguments x,b must be positive; exponential inputs x,b may be any real numbers. Base 1 is excluded here.','須 a>0、a≠1；對數的真數 x、b 須為正，指數函數的輸入 x、b 可為任何實數；本課排除底數 1。'),
 misconception:bi('Taking logarithms always preserves the inequality direction.','取對數一定保留不等號方向。'),challenge:bi('State the corresponding rule for aˣ<aᵇ and compare the domain restrictions.','寫出 aˣ<aᵇ 的相應規則，並比較定義域限制。'),
 proof:bi('Strict monotonicity gives equivalence with x<b for an increasing log and x>b for a decreasing log. The positive-argument restriction must be intersected with the result.','由嚴格單調性，遞增對數等價於 x<b，遞減對數等價於 x>b；最後須與正真數限制取交集。'),
 teacherPrompt:bi('Keep the same test input while switching only the base from 2 to 1/2.','保持測試輸入不變，只把底數由 2 換成 1/2。'),
 exit:{prompt:bi('Solve log_(1/2)x<log_(1/2)4.','解 log_(1/2)x<log_(1/2)4。'),answer:bi('x>4.','x>4。')},
},[select('family','Function family','函數族',[['log','Logarithmic comparison','對數比較'],['exponential','Exponential comparison','指數比較']]),number('a','Base a','底數 a',.25,3,.25),number('x','Test input x','測試輸入 x',-3,8,.5),number('b','Comparison input b','比較輸入 b',-3,8,.5)],[testCase('Increasing logarithm','遞增對數',{family:'log',a:2,x:2,b:4}),testCase('Decreasing logarithm, same inputs','遞減對數，相同輸入',{family:'log',a:.5,x:2,b:4},true),testCase('Equality boundary','等號邊界',{family:'log',a:.5,x:4,b:4},true),testCase('Forbidden logarithm input zero','對數的禁用零輸入',{family:'log',a:2,x:0,b:4},true),testCase('Increasing exponential at negative input','負輸入的遞增指數',{family:'exponential',a:2,x:-1,b:0}),testCase('Decreasing exponential, same inputs','遞減指數，相同輸入',{family:'exponential',a:.5,x:-1,b:0},true)]);

export const activities=[...functionSpecs.map(s=>s.activity),radical,...expTasks];
const allById=new Map(activities.map(a=>[a.id,a]));
const svg=(title,body,w=720,h=340)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${body}</svg>`;
const text=(x,y,value,color='#243e36',size=15)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}">${esc(value)}</text>`;
const line=(x1,y1,x2,y2,color='#8b9f95',extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" ${extra}/>`;
const dot=(x,y,color='#27866c',r=5)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
function plot({xmin=-3,xmax=4,ymin=-3,ymax=8,curves=[],points=[],diagonal=false,caption='',equalScale=false}){
 const left=equalScale?235:60,width=equalScale?250:600;
 const X=x=>left+(x-xmin)/(xmax-xmin)*width,Y=y=>285-(y-ymin)/(ymax-ymin)*250;
 const ix=Math.max(xmin,Math.min(xmax,0)),iy=Math.max(ymin,Math.min(ymax,0));
 let body=line(left,Y(iy),left+width,Y(iy))+line(X(ix),35,X(ix),285)+text(left+width+6,Y(iy)+5,'x')+text(X(ix)+8,25,'y');
 for(let i=0;i<=6;i++){const x=xmin+(xmax-xmin)*i/6;body+=line(X(x),Y(iy)-4,X(x),Y(iy)+4)+text(X(x)-10,308,fmt(x),'#52685d',11);}
 for(let i=0;i<=5;i++){const y=ymin+(ymax-ymin)*i/5;body+=line(X(ix)-4,Y(y),X(ix)+4,Y(y))+text(left-48,Y(y)+4,fmt(y),'#52685d',11);}
 if(diagonal)curves=[...curves,{fn:x=>x,color:'#8b8b8b',dash:true}];
 for(const curve of curves){let d='',open=false;for(let i=0;i<=300;i++){const x=xmin+(xmax-xmin)*i/300,y=curve.fn(x);if(!Number.isFinite(y)||y<ymin||y>ymax){open=false;continue;}d+=`${open?'L':'M'}${X(x).toFixed(2)},${Y(y).toFixed(2)} `;open=true;}body+=`<path d="${d}" fill="none" stroke="${curve.color||'#27866c'}" stroke-width="3"${curve.dash?' stroke-dasharray="5 4"':''}/>`;}
 for(const p of points)if(Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=xmin&&p.x<=xmax&&p.y>=ymin&&p.y<=ymax)body+=dot(X(p.x),Y(p.y),p.color)+ (p.label?text(X(p.x)+7,Y(p.y)-8,p.label,p.color||'#27866c',12):'');
 return body+text(60,332,caption,'#243e36',13);
}
const finiteInputs=(p,keys)=>keys.every(k=>typeof p[k]==='number'&&Number.isFinite(p[k]));
const baseOK=a=>a>0&&a!==1;
const log=(a,b)=>Math.log(b)/Math.log(a);
function failure(a,l,message,metrics={}){return {svg:svg(a.title[l]||a.title.en,text(45,140,message,'#a3333d',17)+line(45,180,660,180)),columns:[tr(l,'Condition','條件')],rows:[[message]],summary:message,valid:false,metrics};}
function output(a,l,body,columns,rows,summary,metrics={},valid=true){return {svg:svg(a.title[l]||a.title.en,body),columns,rows,summary,valid,metrics};}
function nativeEvaluation(id,params,l){
 const a=allById.get(id),state=directStateForCase(id,params),scene=directScene(id,state,l);
 const isFiniteSvg=!/(?:NaN|Infinity|undefined(?=[,\s"<]))/.test(scene.svg);
 if(!isFiniteSvg)throw new TypeError('Native scene coordinates are invalid');
 return {svg:svg(a.title[l]||a.title.en,scene.svg,960,540),columns:scene.headers,rows:scene.rows,summary:scene.summary,valid:true,metrics:{nativeId:a.nativeId,nativeState:state,nativeScene:scene}};
}
/** Returns an exact integer threshold certified against the original recurrence. */
export function firstThresholdRound(r,target){
 if(!Number.isFinite(r)||!Number.isFinite(target)||r<=0||target<=0)return null;
 // Interpret entered finite decimals exactly: 100×0.8² is exactly 64, despite
 // binary floating-point multiplication sometimes producing 64.00000000000001.
 const rational=value=>{const [coefficient,exponent='0']=String(value).toLowerCase().split('e'),parts=coefficient.split('.'),digits=(parts[0]+(parts[1]||'')).replace(/^\+/,''),scale=(parts[1]||'').length-Number(exponent);return scale>=0?[BigInt(digits),10n**BigInt(scale)]:[BigInt(digits)*10n**BigInt(-scale),1n];};
 const [rn,rd]=rational(r),[tn,td]=rational(target);
 const met=n=>{const left=100n*rn**BigInt(n)*td,right=tn*rd**BigInt(n);return r>=1?left>=right:left<=right;};
 if(met(0))return 0;if(r===1)return null;
 const crossing=Math.log(target/100)/Math.log(r);let n=Math.max(0,Math.ceil(crossing));
 while(n>0&&met(n-1))n--;while(!met(n)&&n<100000)n++;
 return n<100000?n:null;
}
export function evaluate(id,params={},locale='en'){
 const a=allById.get(id);if(!a)throw new RangeError('Unknown function/exponential inquiry.');const l=locale==='zh-Hant'?'zh-Hant':'en';
 if(nativeById.has(id)){try{return nativeEvaluation(id,params,l);}catch{return failure(a,l,tr(l,'This construction is invalid; choose a named case to start again.','此構造資料無效；請選指定案例重新開始。'));}}
 const p={...a.cases[0].params,...params};
 const invalid=msg=>failure(a,l,msg);
 for(const control of a.controls)if(!control.options&&(!Number.isFinite(p[control.key])||typeof p[control.key]!=='number'||p[control.key]<control.min||p[control.key]>control.max))return invalid(tr(l,'Use finite numeric values within the displayed control ranges.','請使用顯示範圍內的有限數值。'));
 if(id==='g10-05-15'){
  if(!finiteInputs(p,['x']))return invalid(tr(l,'Enter a finite real x.','請輸入有限實數 x。'));
  const {x}=p,domain=x>=-2,lhs=domain?Math.sqrt(x+2):null,original=domain&&Math.abs(lhs-x)<1e-10,squared=Math.abs(x*x-(x+2))<1e-10;
  const summary=tr(l,domain?`At x=${fmt(x)}: √(x+2)=${fmt(lhs)}, x=${fmt(x)}; original equation ${original?'holds':'fails'}, squared equation ${squared?'holds':'fails'}.`:`At x=${fmt(x)}, x+2<0: the real radical is undefined.`,domain?`x＝${fmt(x)}：√(x＋2)＝${fmt(lhs)}，x＝${fmt(x)}；原方程${original?'成立':'不成立'}，平方後方程${squared?'成立':'不成立'}。`:`x＝${fmt(x)} 時 x＋2<0，實數根式未定義。`);
  return output(a,l,plot({xmin:-3,xmax:4,ymin:-3,ymax:5,curves:[{fn:x=>x>=-2?Math.sqrt(x+2):NaN},{fn:x=>x,color:'#b66b24'}],points:domain?[{x,y:lhs},{x,y:x,color:'#b66b24'}]:[],caption:'y = √(x + 2); y = x'}),['x','√(x + 2)',tr(l,'Original equality','原方程等式'),tr(l,'Squared equality','平方後等式')],[[x,lhs===null?tr(l,'undefined','未定義'):fmt(lhs),tr(l,original?'yes':'no',original?'是':'否'),tr(l,squared?'yes':'no',squared?'是':'否')]],summary,{x,lhs,domain,original,squared,extraneous:squared&&!original},domain);
 }
 const n=a.order;
 if(n===1){
  if(!finiteInputs(p,['a','n'])||!Number.isInteger(p.n))return invalid(tr(l,'Use a finite base and an integer exponent.','請用有限底數及整數指數。'));
  if(p.a===0&&p.n<=0)return invalid(tr(l,'Zero to a nonpositive exponent is undefined here.','本課零的非正整數冪未定義。'));
  const value=p.a**p.n,rows=[...new Set([-3,-2,-1,0,1,2,3,p.n])].sort((a,b)=>a-b).map(k=>[k,p.a===0&&k<=0?tr(l,'undefined','未定義'):fmt(p.a**k)]);
  return output(a,l,plot({xmin:-4,xmax:4,ymin:-9,ymax:9,points:rows.filter(r=>r[1]!=='—'&&Number.isFinite(Number(r[1]))).map(r=>({x:r[0],y:Number(r[1])})),caption:`a = ${fmt(p.a)}; ${tr(l,'integer powers only','只顯示整數冪')}`}),[tr(l,'Exponent','指數'),tr(l,'Value','值')],rows,tr(l,`${fmt(p.a)}^${p.n} = ${fmt(value)}. A negative exponent takes a reciprocal.`,`${fmt(p.a)}^${p.n}＝${fmt(value)}；負指數表示取倒數。`),{value,reciprocal:p.a!==0?1/p.a**(-p.n):null});
 }
 if(n===2){
  if(!finiteInputs(p,['a','p','q'])||p.a<=0||!Number.isInteger(p.p)||!Number.isInteger(p.q)||p.q<=0)return invalid(tr(l,'This rational-power model requires a>0, integer p and positive integer q.','本有理冪模型要求 a>0、整數 p 及正整數 q。'));
  const root=p.a**(1/p.q),value=p.a**(p.p/p.q),max=Math.max(2,p.a*1.1,root*1.1,value*1.1);
  return output(a,l,plot({xmin:0,xmax:Math.max(2,p.a*1.1),ymin:0,ymax:max,curves:[{fn:x=>x**(p.p/p.q)}],points:[{x:p.a,y:value}],caption:`y = x^(${p.p}/${p.q}); x > 0`}),[tr(l,'Base','底數'),tr(l,'Root','根式值'),tr(l,'Power','冪值')],[[p.a,fmt(root),fmt(value)]],tr(l,`The positive ${p.q}th root is ${fmt(root)}; raising it to ${p.p} gives ${fmt(value)}.`,`正 ${p.q} 次根為 ${fmt(root)}，再取 ${p.p} 次方得 ${fmt(value)}。`),{root,value,exponent:p.p/p.q});
 }
 if(n===3){
  if(!finiteInputs(p,['r','n'])||p.r<=0||!Number.isInteger(p.n)||p.n<0)return invalid(tr(l,'Use r>0 and a nonnegative integer round.','請用 r>0 及非負整數輪數。'));
  const increment=100*(p.r-1),linear=100+increment*p.n,exponential=100*p.r**p.n,rows=Array.from({length:p.n+1},(_,k)=>[k,fmt(100+increment*k),fmt(100*p.r**k)]),values=rows.flatMap(r=>r.slice(1).map(Number)),ymin=Math.min(0,...values)*1.1,ymax=Math.max(120,...values)*1.1;
  return output(a,l,plot({xmin:0,xmax:Math.max(3,p.n),ymin,ymax,points:rows.flatMap(r=>[{x:r[0],y:Number(r[1]),color:'#b66b24'},{x:r[0],y:Number(r[2])}]),caption:tr(l,'Green: fixed ratio; amber: fixed increment','綠：固定倍率；啡：固定增量')}),['n',tr(l,'Fixed increment','固定增量'),tr(l,'Fixed ratio','固定倍率')],rows,tr(l,`Round ${p.n}: fixed increment ${fmt(linear)}, fixed ratio ${fmt(exponential)}.`,`第 ${p.n} 輪：固定增量模型 ${fmt(linear)}，固定倍率模型 ${fmt(exponential)}。`),{linear,exponential,increment,ratio:p.r});
 }
 if(n===4){
  if(!finiteInputs(p,['a','x'])||p.a<=0)return invalid(tr(l,'A real exponential model requires a positive base.','實指數模型要求正底數。'));
  const value=p.a**p.x,kind=p.a===1?'constant':p.a>1?'increasing':'decreasing',summary=tr(l,`a=${fmt(p.a)}: ${kind}; a^${fmt(p.x)}=${fmt(value)}.${p.a===1?' Base 1 is the constant boundary, excluded from this course’s exponential family.':''}`,`a＝${fmt(p.a)}：${p.a===1?'常數':p.a>1?'遞增':'遞減'}；a^${fmt(p.x)}＝${fmt(value)}。${p.a===1?'底數 1 是常數邊界，不屬於本課指數函數族。':''}`);
  return output(a,l,plot({xmin:-3,xmax:3,ymin:0,ymax:Math.min(100,Math.max(4,value*1.2)),curves:[{fn:x=>p.a**x}],points:[{x:0,y:1},{x:p.x,y:value}],caption:`y = ${fmt(p.a)}^x`}),['x','aˣ'],[-1,0,1,p.x].map(x=>[x,fmt(p.a**x)]),summary,{value,kind,isExponential:p.a!==1},p.a!==1);
 }
 if(n===5){
  if(!finiteInputs(p,['a','b'])||!baseOK(p.a)||p.b<=0)return invalid(tr(l,'Require a>0, a≠1 and positive argument b.','須 a>0、a≠1 及正真數 b。'));
  const value=log(p.a,p.b),maxX=Math.max(3,p.b*1.15);
  return output(a,l,plot({xmin:0,xmax:maxX,ymin:Math.min(-3,value-1),ymax:Math.max(4,value+1),curves:[{fn:x=>x>0?log(p.a,x):NaN}],points:[{x:p.b,y:value},{x:1,y:0}],caption:`y = log_${fmt(p.a)} x; x > 0`}),[tr(l,'Base','底數'),tr(l,'Argument','真數'),tr(l,'Required exponent','所需指數'),tr(l,'Power check','次方核對')],[[p.a,p.b,fmt(value),fmt(p.a**value)]],tr(l,`${fmt(p.a)}^${fmt(value)} = ${fmt(p.b)}, so log_${fmt(p.a)}(${fmt(p.b)})=${fmt(value)}.`,`${fmt(p.a)}^${fmt(value)}＝${fmt(p.b)}，故 log_${fmt(p.a)}(${fmt(p.b)})＝${fmt(value)}。`),{value,powerCheck:p.a**value});
 }
 if(n===6){
  if(!finiteInputs(p,['a','x'])||!baseOK(p.a))return invalid(tr(l,'An invertible exponential needs a>0 and a≠1.','可逆指數函數須 a>0 且 a≠1。'));
  const y=p.a**p.x,max=Math.max(4,y+1,Math.abs(p.x)+1),min=Math.min(-3,p.x-1);
  return output(a,l,plot({xmin:min,xmax:max,ymin:min,ymax:max,diagonal:true,equalScale:true,curves:[{fn:x=>p.a**x},{fn:x=>x>0?log(p.a,x):NaN,color:'#b66b24'}],points:[{x:p.x,y,label:`(${fmt(p.x)}, ${fmt(y)})`},{x:y,y:p.x,color:'#b66b24',label:`(${fmt(y)}, ${fmt(p.x)})`}],caption:tr(l,'Green: exponential; amber: logarithm; grey: y=x','綠：指數；啡：對數；灰：y＝x')}),[tr(l,'Graph','圖像'),tr(l,'Input','輸入'),tr(l,'Output','輸出')],[[tr(l,'Exponential','指數'),p.x,fmt(y)],[tr(l,'Logarithm','對數'),fmt(y),fmt(log(p.a,y))]],tr(l,`(${fmt(p.x)},${fmt(y)}) reflects to (${fmt(y)},${fmt(p.x)}).`,`(${fmt(p.x)},${fmt(y)}) 反射至 (${fmt(y)},${fmt(p.x)})。`),{x:p.x,y,inverseX:y,inverseY:log(p.a,y)});
 }
 if(n===7){
  if(!finiteInputs(p,['a','u','v'])||!baseOK(p.a)||p.u<=0||p.v<=0)return invalid(tr(l,'Each argument u,v must be positive, even when their product is positive.','u、v 各自均須為正，即使乘積為正亦然。'));
  const lu=log(p.a,p.u),lv=log(p.a,p.v),sum=lu+lv,productLog=log(p.a,p.u*p.v),sumLog=log(p.a,p.u+p.v),quotientLog=log(p.a,p.u/p.v),powerLog=log(p.a,p.u**2),changeOfBase=Math.log(p.u)/Math.log(p.a),same=Math.abs(sumLog-sum)<1e-10;
  const xmax=Math.max(4,p.u*p.v+1,p.u+p.v+1),ymin=Math.min(-3,lu-1,lv-1,sum-1),ymax=Math.max(4,sum+1,sumLog+1);
  return output(a,l,plot({xmin:0,xmax,ymin,ymax,curves:[{fn:x=>x>0?log(p.a,x):NaN}],points:[{x:p.u,y:lu,label:'u'},{x:p.v,y:lv,label:'v'},{x:p.u*p.v,y:productLog,label:'uv'},{x:p.u+p.v,y:sumLog,color:'#b66b24',label:'u+v'}],caption:'y = log_a x; uv versus u+v'}),[tr(l,'Expression','式子'),tr(l,'Value','值')],[['logₐu+logₐv',fmt(sum)],['logₐ(uv)',fmt(productLog)],['logₐ(u+v)',fmt(sumLog)],['logₐ(u/v)',fmt(quotientLog)],['logₐ(u²)',fmt(powerLog)],['ln(u)/ln(a)',fmt(changeOfBase)]],tr(l,`Product rule: ${fmt(sum)}=${fmt(productLog)}. Sum claim: ${fmt(sumLog)} ${same?'happens to equal':'differs from'} ${fmt(sum)}; one accidental equality is not a general law.`,`乘積公式：${fmt(sum)}＝${fmt(productLog)}；相加猜想：${fmt(sumLog)} ${same?'偶然等於':'不同於'} ${fmt(sum)}；單次相同不是一般法則。`),{lu,lv,sum,productLog,sumLog,quotientLog,powerLog,changeOfBase,sumClaim:same});
 }
 if(n===8){
  if(!finiteInputs(p,['r','target'])||p.r<=0||p.target<=0)return invalid(tr(l,'The multiplier and target must both be positive.','倍率與目標均須為正。'));
  const first=firstThresholdRound(p.r,p.target),crossing=p.r===1?null:Math.log(p.target/100)/Math.log(p.r),last=first===null?5:Math.max(3,first+1),rounds=first===null?[0,1,2,3,4,5]:[...new Set([0,Math.max(0,first-1),first,first+1])].sort((a,b)=>a-b),rows=rounds.map(k=>[k,fmt(100*p.r**k)]),points=Array.from({length:Math.min(last,100)+1},(_,k)=>({x:k,y:100*p.r**k})),max=Math.max(120,p.target,...points.map(p=>p.y))*1.1;
  const summary=first===null?tr(l,'The constant model cannot reach this target in the stated direction.','常數模型無法依指定方向達到此目標。'):tr(l,`First round: ${first}. ${first>0?`Previous value ${fmt(100*p.r**(first-1))}; `:''}at round ${first}: ${fmt(100*p.r**first)}.`,`首次輪數：${first}；${first>0?`前一輪 ${fmt(100*p.r**(first-1))}；`:''}第 ${first} 輪為 ${fmt(100*p.r**first)}。`);
  return output(a,l,plot({xmin:0,xmax:Math.max(3,Math.min(last,100)),ymin:0,ymax:max,curves:[{fn:()=>p.target,color:'#b66b24',dash:true}],points,caption:tr(l,'Integer rounds; amber line is the target','整數輪次；啡線為目標')}),['n',tr(l,'Quantity','數量')],rows,summary,{first,crossing,previous:first>0?100*p.r**(first-1):null,current:first===null?null:100*p.r**first},first!==null);
 }
 if(n===9){
  const exponential=p.family==='exponential';
  if(!['log','exponential'].includes(p.family)||!finiteInputs(p,['a','x','b'])||!baseOK(p.a)||!exponential&&(p.x<=0||p.b<=0))return invalid(tr(l,'Require a>0,a≠1; logarithms additionally need both arguments positive.','須 a>0、a≠1；對數另要求兩個真數為正。'));
  const fn=x=>exponential?p.a**x:x>0?log(p.a,x):NaN,left=fn(p.x),right=fn(p.b),satisfies=left<right,solution=p.a>1?`${exponential?'x':'0 < x'} < ${fmt(p.b)}`:`x > ${fmt(p.b)}`;
  return output(a,l,plot({xmin:exponential?Math.min(-3,p.x-1,p.b-1):0,xmax:Math.max(5,p.x+1,p.b+1),ymin:exponential?0:Math.min(-4,left-1,right-1),ymax:Math.max(4,left+1,right+1),curves:[{fn}],points:[{x:p.x,y:left,label:'x'},{x:p.b,y:right,color:'#b66b24',label:'b'}],caption:`${exponential?'a^x < a^b':'log_a x < log_a b'}; ${solution}`}),[tr(l,'Input','輸入'),tr(l,'Function value','函數值')],[['x='+fmt(p.x),fmt(left)],['b='+fmt(p.b),fmt(right)]],tr(l,`Solution: ${solution}. Current input ${satisfies?'satisfies':'does not satisfy'} the strict inequality.`,`解集：${solution}；目前輸入${satisfies?'符合':'不符合'}嚴格不等式。`),{left,right,satisfies,solution,increasing:p.a>1,family:p.family});
 }
 throw new RangeError('Missing function/exponential evaluator.');
}
