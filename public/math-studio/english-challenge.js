/* Authored English for every challenge family, explanation, hint and follow-up. */
'use strict';
(()=>{
 const entries=[
  [
    "拆項相消",
    "Telescoping a sum"
  ],
  [
    "分數恆等變形",
    "Equivalent fraction identities"
  ],
  [
    "相消前未展開",
    "Cancelling before expanding"
  ],
  [
    "求 1/({0}×{1}) + 1/({2}×{3}) + … + 1/({4}×{5}) 的值。可輸入分數。",
    "Find 1/({0}×{1}) + 1/({2}×{3}) + … + 1/({4}×{5}). Fractions are accepted."
  ],
  [
    "每項 1/[k(k+1)] = 1/k − 1/(k+1)。",
    "Each term satisfies 1/[k(k+1)] = 1/k − 1/(k+1)."
  ],
  [
    "展開為 (1/{0}−1/{1}) + (1/{2}−1/{3}) + … + (1/{4}−1/{5})。",
    "Expand as (1/{0}−1/{1}) + (1/{2}−1/{3}) + … + (1/{4}−1/{5})."
  ],
  [
    "相鄰項抵消，剩 1/{0} − 1/{1} = {2}/{3}。",
    "Adjacent terms cancel, leaving 1/{0} − 1/{1} = {2}/{3}."
  ],
  [
    "先把第一項寫成兩個分數的差，再展開第二項。",
    "Write the first term as a difference of fractions, then expand the second term."
  ],
  [
    "為甚麼可以拆成兩個分數？",
    "Why can we split a term into two fractions?"
  ],
  [
    "通分：1/{0}−1/{1} = (({2})−{3})/({4}×{5}) = 1/({6}×{7})。對每個正整數 k 都同樣成立。",
    "Use a common denominator: 1/{0}−1/{1} = (({2})−{3})/({4}×{5}) = 1/({6}×{7}). This holds for every positive integer k."
  ],
  [
    "究竟哪幾項抵消？",
    "Which terms actually cancel?"
  ],
  [
    "第一括號的 −1/{0} 與第二括號的 +1/{1} 抵消。中間各項都有一正一負，只有最前 +1/{2} 和最後 −1/{3} 沒有配對。",
    "The −1/{0} in the first brackets cancels with +1/{1} in the second. Every middle term has a positive and a negative copy; only the first +1/{2} and last −1/{3} remain unmatched."
  ],
  [
    "起點不是 1，結果會怎樣？",
    "What changes if the starting number is not 1?"
  ],
  [
    "本題從 {0} 開始，所以保留下來的是 1/{1}，不能一律寫成 1。可用只有兩項的 1/(2×3)+1/(3×4)=1/2−1/4=1/4 核對方法。",
    "This sum starts at {0}, so the surviving first term is 1/{1}, not always 1. Check the method on 1/(2×3)+1/(3×4)=1/2−1/4=1/4."
  ],
  [
    "符號與乘方的結構比較",
    "Compare the structure of signs and powers"
  ],
  [
    "乘方的底數",
    "The base of a power"
  ],
  [
    "負號被錯誤平方",
    "Incorrectly squaring the minus sign"
  ],
  [
    "令 A = (−{0})² − {1}，B = −{2}² − {3}。求 A − B。",
    "Let A = (−{0})² − {1} and B = −{2}² − {3}. Find A − B."
  ],
  [
    "先辨認兩個乘方各自的底數。",
    "First identify the base of each power."
  ],
  [
    "括號改變了甚麼？",
    "What do the brackets change?"
  ],
  [
    "(−{0})² 的底數是 −{1}，展開 (−{2})×(−{3})={4}；兩個負因數相乘得正。",
    "The base of (−{0})² is −{1}; expanding gives (−{2})×(−{3})={4}. The product of two negative factors is positive."
  ],
  [
    "沒有括號時，負號放在哪裡？",
    "Where does the minus sign act without brackets?"
  ],
  [
    "−{0}² = −({1}×{2}) = −{3}。乘方先作用於 {4}，再取相反數。",
    "−{0}² = −({1}×{2}) = −{3}. The power acts on {4} first, then we take its opposite."
  ],
  [
    "為甚麼最後不受減去的數影響？",
    "Why does the subtracted number not affect the final difference?"
  ],
  [
    "A−B 中的 −{0} 和減去 (−{1}) 正好抵消，所以剩 {2}−(−{3})={4}。",
    "In A−B, −{0} and the subtraction of (−{1}) cancel, leaving {2}−(−{3})={4}."
  ],
  [
    "由最低餘額逆推",
    "Work backwards from the lowest balance"
  ],
  [
    "有理數的累積變化",
    "Cumulative changes of rational numbers"
  ],
  [
    "只看最終淨額",
    "Checking only the final net change"
  ],
  [
    "賬戶依次支出 {0} 元、存入 {1} 元、支出 {2} 元。每次交易後餘額都不可為負。起初最少要有多少元？",
    "An account pays out {0} dollars, receives {1} dollars, then pays out {2} dollars. Its balance must be nonnegative after every transaction. What is the minimum starting balance?"
  ],
  [
    "相對起初的累積變化依次為 −{0}、{1}、{2} 元。",
    "The cumulative changes from the starting balance are −{0}, {1} and {2} dollars."
  ],
  [
    "因 {0}<{1}，中間仍是淨支出；最大累積支出是 max({2}, {3})。",
    "Since {0}<{1}, the intermediate balance still reflects a net outflow. The largest cumulative outflow is max({2}, {3})."
  ],
  [
    "起初最少須有 {0} 元，才能抵銷最深的負值。",
    "At least {0} dollars are needed initially to offset the deepest negative change."
  ],
  [
    "逐筆列出相對起初的餘額，不只算收入減支出。",
    "List the balance relative to the starting amount after each transaction; do more than subtract total expenses from income."
  ],
  [
    "累積變化與每次交易有何不同？",
    "How does cumulative change differ from an individual transaction?"
  ],
  [
    "第二次交易是存入 {0}，但已先支出 {1}，故累積變化是 −{2}+{3}={4}。",
    "The second transaction adds {0}, but {1} was already spent, so the cumulative change is −{2}+{3}={4}."
  ],
  [
    "最少起始金額如何決定？",
    "How is the minimum starting amount determined?"
  ],
  [
    "要同時保證起初金額 ≥ {0} 及 ≥ {1}，所以取較大的 {2}。途中透支也不符合題意。",
    "The starting amount must be both ≥ {0} and ≥ {1}, so choose the larger value {2}. An overdraft along the way also violates the condition."
  ],
  [
    "如何逐筆檢查？",
    "How can we check every transaction?"
  ],
  [
    "用 {0} 元起步，餘額依次為 {1}、{2}、{3}，均不小於 0。",
    "Starting with {0} dollars gives balances {1}, {2} and {3}, all at least 0."
  ],
  [
    "帶符號偏差的加權計算",
    "Weighted calculation of signed deviations"
  ],
  [
    "基準量與總偏差",
    "A baseline and total deviation"
  ],
  [
    "把兩批偏差直接平均",
    "Averaging two batch deviations directly"
  ],
  [
    "標準每袋 {0} kg。第一批 {1} 袋各比標準少 {2} kg，第二批 {3} 袋各比標準多 {4} kg。兩批合共多少 kg？",
    "The standard mass is {0} kg per bag. Each of {1} bags in the first batch is {2} kg below standard; each of {3} bags in the second is {4} kg above it. Find their combined mass in kg."
  ],
  [
    "共 {0} 袋，按標準計是 {1} kg。",
    "There are {0} bags; at the standard mass they would total {1} kg."
  ],
  [
    "總偏差 = {0}×(−{1}) + {2}×{3} = {4} kg。",
    "Total deviation = {0}×(−{1}) + {2}×{3} = {4} kg."
  ],
  [
    "實際總質量 = {0} + ({1}) = {2} kg。",
    "Actual total mass = {0} + ({1}) = {2} kg."
  ],
  [
    "先分別計算兩批的總偏差。",
    "Calculate the total deviation of each batch separately."
  ],
  [
    "為甚麼先用標準乘總袋數？",
    "Why multiply the standard mass by the total number of bags first?"
  ],
  [
    "把 {0} 袋都暫當成 {1} kg，可得到統一基準，再補上每袋的差額。",
    "Temporarily treat all {0} bags as {1} kg each to establish a common baseline, then add each bag's difference."
  ],
  [
    "兩個偏差可以直接平均嗎？",
    "Can the two deviations be averaged directly?"
  ],
  [
    "不可以忽略袋數。少 {0} kg 出現 {1} 次，多 {2} kg 出現 {3} 次，總偏差要分別乘次數。",
    "Do not ignore the bag counts. A deficit of {0} kg occurs {1} times and an excess of {2} kg occurs {3} times; multiply each deviation by its frequency."
  ],
  [
    "可以不用偏差法檢查嗎？",
    "Can we check without using deviations?"
  ],
  [
    "直接算第一批 {0}×{1}={2}，第二批 {3}×{4}={5}，相加亦得 {6} kg。",
    "Calculate the batches directly: {0}×{1}={2} and {3}×{4}={5}. Adding them also gives {6} kg."
  ],
  [
    "跨數量級的倍數",
    "Ratios across orders of magnitude"
  ],
  [
    "科學記數法與比例",
    "Scientific notation and ratios"
  ],
  [
    "指數與係數混算",
    "Mixing up exponents and coefficients"
  ],
  [
    "A = {0}×10^{1}，B = {2}×10^{3}。A 是 B 的多少倍？",
    "A = {0}×10^{1} and B = {2}×10^{3}. How many times B is A?"
  ],
  [
    "倍數是 A÷B = ({0}/{1})×(10^{2}/10^{3})。",
    "The ratio is A÷B = ({0}/{1})×(10^{2}/10^{3})."
  ],
  [
    "消去共同的 {0} 個因數 10，留下 10^{1}。",
    "Cancel the {0} common factors of 10, leaving 10^{1}."
  ],
  [
    "倍數 = ({0}/{1})×{2} ≈ {3}。",
    "Ratio = ({0}/{1})×{2} ≈ {3}."
  ],
  [
    "倍數用除法，分開處理係數與 10 的乘積。",
    "Use division for a multiplicative comparison. Handle the coefficients and the products of 10 separately."
  ],
  [
    "為甚麼用 A 除以 B？",
    "Why divide A by B?"
  ],
  [
    "若 A 是 B 的 t 倍，便有 A=B×t，故 t=A÷B。只減兩個量會得到差，不是倍數。",
    "If A is t times B, then A=B×t, so t=A÷B. Subtracting gives a difference, not a ratio."
  ],
  [
    "不記指數公式也能計嗎？",
    "Can we calculate without memorising the exponent rule?"
  ],
  [
    "10^{0} 是 {1} 個 10 相乘，分母有 {2} 個 10。逐個約去後還有 {3} 個 10。",
    "10^{0} is a product of {1} factors of 10; the denominator has {2}. Cancelling them leaves {3} factors of 10."
  ],
  [
    "怎樣檢查倍數的方向？",
    "How can we check which ratio is intended?"
  ],
  [
    "本題 {0}>{1}，且係數介乎 2 與 8，故 A>B，所得倍數約 {2} 應大於 1。",
    "Here {0}>{1} and both coefficients lie between 2 and 8, so A>B. The resulting ratio, about {2}, should exceed 1."
  ],
  [
    "定位同級運算錯誤",
    "Locate an error in equal-priority operations"
  ],
  [
    "乘除由左至右",
    "Multiplication and division from left to right"
  ],
  [
    "見乘法就先乘",
    "Always multiplying before dividing"
  ],
  [
    "小明把 {0}÷{1}×{2} 算成 {3}÷({4}×{5})。指出第一個不合法的改寫，求正確值，並說明甚麼時候才應先算 {6}×{7}。",
    "Ming rewrites {0}÷{1}×{2} as {3}÷({4}×{5}). Identify the first invalid rewrite, find the correct value, and explain when {6}×{7} should be calculated first."
  ],
  [
    "原式沒有括號，乘除同級，應由左至右。",
    "The original expression has no brackets. Multiplication and division have equal priority and are evaluated from left to right."
  ],
  [
    "{0}÷{1}={2}，再乘 {3}，得 {4}。",
    "{0}÷{1}={2}; multiplying by {3} then gives {4}."
  ],
  [
    "只有原題本來寫成 {0}÷({1}×{2})，才能先算括號。兩式通常不同。",
    "Only when the original expression is {0}÷({1}×{2}) should the brackets be evaluated first. The two expressions usually differ."
  ],
  [
    "乘法和除法有沒有高低先後？",
    "Does multiplication have priority over division?"
  ],
  [
    "乘法不是應該先做嗎？",
    "Should multiplication not come first?"
  ],
  [
    "乘法只先於加減，並不先於除法。{0}÷{1}×{2} 的第一步是左邊的除法。",
    "Multiplication precedes addition and subtraction, but not division. The first operation in {0}÷{1}×{2} is the left-hand division."
  ],
  [
    "怎樣用分數寫清楚？",
    "How can fractions make the distinction clear?"
  ],
  [
    "原式是 ({0}/{1})×{2}={3}；錯寫的式子是 {4}/({5}×{6})= {7}/{8}。後者把 {9} 放到分母，意思改變了。",
    "The original expression is ({0}/{1})×{2}={3}; the incorrect rewrite is {4}/({5}×{6})= {7}/{8}. It moves {9} into the denominator and changes the meaning."
  ],
  [
    "用小數字再看一次？",
    "Can small numbers illustrate it?"
  ],
  [
    "12÷3×2=(12÷3)×2=8；12÷(3×2)=2。添加括號會改變運算結構，不能隨意添加。",
    "12÷3×2=(12÷3)×2=8, whereas 12÷(3×2)=2. Brackets change the structure and cannot be inserted arbitrarily."
  ],
  [
    "指出擅自加括號這一步",
    "Identify the step that inserts unsupported brackets"
  ],
  [
    "算出正確值並列運算次序",
    "Calculate the correct value and state the operation order"
  ],
  [
    "說明有括號時除數是整個乘積",
    "Explain that with brackets the divisor is the whole product"
  ],
  [
    "距離和的最小值",
    "Minimum sum of distances"
  ],
  [
    "數軸上的距離",
    "Distances on a number line"
  ],
  [
    "最小值只在中點",
    "Assuming the minimum occurs only at the midpoint"
  ],
  [
    "A、B 在數軸上分別表示 {0}、{1}。P 可在數軸上移動，PA+PB 的最小值是多少？",
    "A and B represent {0} and {1} on a number line. P can move along the line. Find the minimum of PA+PB."
  ],
  [
    "P 在 A、B 之間（含端點）時，PA+PB=AB。",
    "When P lies between A and B, including the endpoints, PA+PB=AB."
  ],
  [
    "P 在區間外時，多走一段折返距離，和更大；最小值為 {0}。",
    "Outside that interval, an extra out-and-back distance makes the sum larger. The minimum is {0}."
  ],
  [
    "分別想像 P 在兩點之間及外面。",
    "Consider P between the two points and outside them separately."
  ],
  [
    "跨過原點的距離怎樣求？",
    "How do we find a distance crossing the origin?"
  ],
  [
    "A 到 0 是 {0}，0 到 B 是 {1}，所以 AB={2}+{3}={4}。",
    "A to 0 is {0} and 0 to B is {1}, so AB={2}+{3}={4}."
  ],
  [
    "只有中點才達到最小嗎？",
    "Does only the midpoint attain the minimum?"
  ],
  [
    "不是。取 P=A 時，PA=0、PB={0}；取 P=0 時，PA={1}、PB={2}，總和亦一樣。",
    "No. At P=A, PA=0 and PB={0}; at P=0, PA={1} and PB={2}. Both give the same total."
  ],
  [
    "區間外為甚麼會更大？",
    "Why is the sum larger outside the interval?"
  ],
  [
    "取 P={0}，PA=1、PB={1}，總和 {2}，比 AB 多 2。向外走一步，兩個距離都加 1。",
    "Take P={0}: PA=1 and PB={1}, so the total is {2}, which is 2 more than AB. Moving one step out increases both distances by 1."
  ],
  [
    "由負數的次序逆推",
    "Work backwards from the order of negative numbers"
  ],
  [
    "負數比較與距離",
    "Comparing negative numbers and distances"
  ],
  [
    "絕對值較大就是較大",
    "Assuming a greater absolute value means a greater number"
  ],
  [
    "兩個負數 x、y 滿足 |x|={0}、|y|={1}。求「較大的數減去較小的數」。",
    "Two negative numbers x and y satisfy |x|={0} and |y|={1}. Find the larger number minus the smaller number."
  ],
  [
    "兩數均為負，故 x=−{0}、y=−{1}。",
    "Both numbers are negative, so x=−{0} and y=−{1}."
  ],
  [
    "−{0} 在 −{1} 右方，x 較大。",
    "−{0} lies to the right of −{1}, so x is larger."
  ],
  [
    "所求 = −{0}−(−{1})={2}。",
    "The required difference is −{0}−(−{1})={2}."
  ],
  [
    "先由符號條件還原兩個數。",
    "First recover the two numbers using the sign conditions."
  ],
  [
    "絕對值為甚麼不直接給出正數？",
    "Why does an absolute value not directly specify a positive number?"
  ],
  [
    "|x|={0} 只說距原點 {1}，可能是 ±{2}；題目另外給 x<0 才選 −{3}。",
    "|x|={0} specifies a distance of {1} from the origin, allowing ±{2}. The additional condition x<0 selects −{3}."
  ],
  [
    "為甚麼絕對值大的反而小？",
    "Why is the number with greater absolute value smaller?"
  ],
  [
    "在原點左邊，離 0 越遠越靠左；−{0}<−{1}，數軸右方的數才較大。",
    "To the left of the origin, a point farther from 0 lies farther left. Thus −{0}<−{1}; the number farther right is larger."
  ],
  [
    "用距離核對差的符號？",
    "How can distance check the sign of the difference?"
  ],
  [
    "較大減較小是兩點之間的正距離：{0}−{1}={2}。若得負值，通常是把減數次序倒轉了。",
    "Larger minus smaller is the positive distance between the points: {0}−{1}={2}. A negative result usually means the subtraction order was reversed."
  ],
  [
    "絕對值條件與整數計數",
    "Absolute-value conditions and counting integers"
  ],
  [
    "距離範圍的交集",
    "Intersection of distance intervals"
  ],
  [
    "漏掉零或重算零",
    "Omitting zero or counting it twice"
  ],
  [
    "整數 x 同時滿足 |x|≤{0} 及 x>−{1}。共有多少個可能值？",
    "An integer x satisfies both |x|≤{0} and x>−{1}. How many possible values are there?"
  ],
  [
    "|x|≤{0} 表示 −{1}≤x≤{2}。",
    "|x|≤{0} means −{1}≤x≤{2}."
  ],
  [
    "再加 x>−{0}，整數由 {1} 到 {2}。",
    "Combining this with x>−{0}, the integers run from {1} to {2}."
  ],
  [
    "包括兩端的個數 = {0}−({1})+1={2}。",
    "Counting both endpoints gives {0}−({1})+1={2}."
  ],
  [
    "把絕對值寫成數軸上的區間，再取公共部分。",
    "Express the absolute-value condition as an interval, then take the common part."
  ],
  [
    "為甚麼要有正負兩個端點？",
    "Why are there negative and positive endpoints?"
  ],
  [
    "距離原點最多 {0}，左邊最遠是 −{1}，右邊最遠是 {2}，兩端都符合等號。",
    "A distance of at most {0} from the origin reaches −{1} on the left and {2} on the right. Both endpoints satisfy the equality."
  ],
  [
    " 本身可以取嗎？",
    "Can the boundary value itself be included?"
  ],
  [
    "不能，因為 x>−{0} 沒有等號。第一個整數是 {1}。",
    "No: x>−{0} has no equality sign. The first integer is {1}."
  ],
  [
    "計數為甚麼還要加 1？",
    "Why add 1 when counting?"
  ],
  [
    "例如 2、3、4 共 3 個，而 4−2 只有 2，是間隔數。本題也要將首項計入。",
    "For example, 2, 3, 4 are three numbers, but 4−2 is only 2, the number of gaps. The first number must also be counted."
  ],
  [
    "由相反數條件還原",
    "Recover a number from its opposite"
  ],
  [
    "相反數與絕對值條件",
    "Opposites and absolute-value conditions"
  ],
  [
    "把符號限制省略",
    "Omitting sign restrictions"
  ],
  [
    "x 的相反數是 −{0}；y 是負數且 |y|={1}。求 |x+y|。",
    "The opposite of x is −{0}; y is negative and |y|={1}. Find |x+y|."
  ],
  [
    "−x=−{0}，故 x={1}。",
    "−x=−{0}, so x={1}."
  ],
  [
    "y<0，且距原點 {0}，故 y=−{1}。",
    "y<0 and its distance from the origin is {0}, so y=−{1}."
  ],
  [
    "x+y=−{0}，所以 |x+y|={1}。",
    "x+y=−{0}, so |x+y|={1}."
  ],
  [
    "先分別確定 x、y，再求和的絕對值。",
    "Determine x and y separately before taking the absolute value of their sum."
  ],
  [
    "相反數是負數，原數也負嗎？",
    "If the opposite is negative, is the original number negative too?"
  ],
  [
    "不是。{0} 的相反數才是 −{1}；兩數相加為 0。",
    "No. The opposite of {0} is −{1}; their sum is 0."
  ],
  [
    "為甚麼 y 不能取正值？",
    "Why can y not be positive?"
  ],
  [
    "絕對值條件單獨容許 ±{0}，但題目的「y 是負數」排除了正值。",
    "The absolute-value condition alone allows ±{0}, but the statement that y is negative excludes the positive value."
  ],
  [
    "可以把絕對值直接分開相加嗎？",
    "Can we split the absolute value and add the two values?"
  ],
  [
    "不可以：|x+y|={0}，但 |x|+|y|={1}。本題 x、y 方向相反，先相加會抵消一部分。",
    "No: |x+y|={0}, whereas |x|+|y|={1}. Here x and y have opposite signs, so adding them first causes partial cancellation."
  ],
  [
    "改變基準的數量表示",
    "Represent quantities using a changed baseline"
  ],
  [
    "基準量與正負號",
    "A baseline and signed quantities"
  ],
  [
    "把零點當成絕對零量",
    "Treating the reference zero as an absolute absence"
  ],
  [
    "以海平面為 0，A 高於海平面 {0} m，B 低於海平面 {1} m。改以海平面上方 {2} m 為新零點後，A 與 B 的高度差是多少 m？",
    "Taking sea level as 0, A is {0} m above it and B is {1} m below it. After choosing a new zero {2} m above sea level, what is the height difference between A and B in m?"
  ],
  [
    "新坐標：A={0}，B={1}。",
    "New coordinates: A={0} and B={1}."
  ],
  [
    "A 減 B = ({0})−({1})={2}。",
    "A minus B = ({0})−({1})={2}."
  ],
  [
    "改變零點只同時平移兩個坐標，不改變兩點距離。",
    "Changing the zero shifts both coordinates equally and does not change the distance between the points."
  ],
  [
    "所有坐標都減去新零點原來的高度。",
    "Subtract the original height of the new zero from every coordinate."
  ],
  [
    "為甚麼兩個高度都減同一個數？",
    "Why subtract the same number from both heights?"
  ],
  [
    "新零點在原來 {0} m 處；原高度 h 與它相差 h−{1}。A、B 都用這個新基準。",
    "The new zero was at {0} m; an original height h differs from it by h−{1}. Both A and B use that new reference."
  ],
  [
    "新坐標變負就代表掉到海底嗎？",
    "Does a negative new coordinate mean a point has moved below sea level?"
  ],
  [
    "新坐標的負號只代表在新零點之下。海平面的新坐標也是 −{0}，不能混用兩個基準。",
    "A negative new coordinate only means below the new zero. Sea level itself now has coordinate −{0}; do not mix the two references."
  ],
  [
    "用原本的基準檢查？",
    "Can the original reference check the result?"
  ],
  [
    "原本高度差 {0}−(−{1})={2} m，與新坐標算出的差一樣。",
    "The original difference is {0}−(−{1})={2} m, matching the difference using the new coordinates."
  ],
  [
    "檢驗含絕對值的主張",
    "Test a claim involving absolute values"
  ],
  [
    "反例與成立條件",
    "Counterexamples and sufficient conditions"
  ],
  [
    "由距離大小推原數大小",
    "Inferring number order from distances"
  ],
  [
    "小華說：「|u|<|v| 就一定 u<v。」用 |u|={0}、|v|={1}，找一個反例，再補充一個令結論成立的符號條件。",
    "Wah claims that |u|<|v| always implies u<v. Using |u|={0} and |v|={1}, give a counterexample, then add a sign condition that makes the conclusion hold."
  ],
  [
    "取 u=−{0}、v=−{1}，滿足 {2}<{3}。",
    "Take u=−{0} and v=−{1}; they satisfy {2}<{3}."
  ],
  [
    "但 −{0}>−{1}，所以原主張並非一定成立。",
    "However, −{0}>−{1}, so the original claim does not always hold."
  ],
  [
    "若另知 u、v 均為非負，則 u=|u|<|v|=v，結論成立。",
    "If u and v are additionally known to be nonnegative, u=|u|<|v|=v and the conclusion holds."
  ],
  [
    "反例必須符合已知條件，同時令結論不成立。",
    "A counterexample must satisfy the assumptions and make the conclusion false."
  ],
  [
    "反例可否隨便選兩個數？",
    "Can we choose any two numbers for a counterexample?"
  ],
  [
    "不可以。必須滿足絕對值為 {0}、{1}，否則沒有檢驗題目的主張。",
    "No. Their absolute values must be {0} and {1}; otherwise we have not tested the stated claim."
  ],
  [
    "一個反例已經足夠嗎？",
    "Is one counterexample enough?"
  ],
  [
    "「一定」包括所有符合條件的情況；−{0}、−{1} 這一組就已推翻全稱主張。",
    "Always includes every case satisfying the conditions. The pair −{0}, −{1} already disproves the universal claim."
  ],
  [
    "加上非負條件有何作用？",
    "What does the nonnegative condition achieve?"
  ],
  [
    "當 u≥0、v≥0，去掉絕對值不改數值，已知的 {0}<{1} 就是原數的次序。",
    "When u≥0 and v≥0, removing the absolute-value signs leaves their values unchanged. The given {0}<{1} is then the order of the numbers themselves."
  ],
  [
    "反例符合兩個絕對值條件",
    "Give a counterexample satisfying both absolute-value conditions"
  ],
  [
    "比較原數並否定必然性",
    "Compare the original numbers and disprove the universal claim"
  ],
  [
    "給出足夠的符號條件",
    "State a sufficient sign condition"
  ],
  [
    "辨認整體代入",
    "Recognise substitution of a whole expression"
  ],
  [
    "已知代數式的倍數",
    "A multiple of a known expression"
  ],
  [
    "以為要先求每個未知數",
    "Assuming every unknown must first be found separately"
  ],
  [
    "已知 {0}x+{1}y={2}。不求 x、y，求 {3}x+{4}y+{5}。",
    "Given {0}x+{1}y={2}, find {3}x+{4}y+{5} without solving for x or y."
  ],
  [
    "前兩項是 {0}({1}x+{2}y)。",
    "The first two terms equal {0}({1}x+{2}y)."
  ],
  [
    "將已知整體代入，得 {0}×{1}+{2}。",
    "Substitute the whole known expression to obtain {0}×{1}+{2}."
  ],
  [
    "結果為 {0}。",
    "The result is {0}."
  ],
  [
    "比較兩個式子中各項係數的倍數。",
    "Compare the ratios of corresponding coefficients in the two expressions."
  ],
  [
    "怎樣認出整體？",
    "How can we recognise the whole known expression?"
  ],
  [
    "{0}/{1}={2}，{3}/{4}={5}，兩個係數都放大同樣倍數，所以能一起提出 {6}。",
    "{0}/{1}={2} and {3}/{4}={5}. Both coefficients are multiplied by the same factor, so we can factor out {6} from both terms."
  ],
  [
    "不知道 x、y 也能求值嗎？",
    "Can we find the value without knowing x and y?"
  ],
  [
    "雖然單獨的 x、y 未確定，但 {0}x+{1}y 已確定為 {2}。題目只需要這個整體。",
    "Although x and y are not individually determined, {0}x+{1}y is known to equal {2}. Only that complete expression is needed."
  ],
  [
    "如果只有一個係數加倍呢？",
    "What if just one coefficient is doubled?"
  ],
  [
    "便不能把整個已知式乘同一倍數。例如只改 x 項，還會留下未知的 y 項，本題的直接代入法就不適用。",
    "Then the whole expression cannot be multiplied by one common factor. Changing only the x term leaves an unknown y term, so this direct substitution method no longer applies."
  ],
  [
    "區分兩種收費結構",
    "Distinguish two pricing structures"
  ],
  [
    "固定量與變動量",
    "Fixed and variable quantities"
  ],
  [
    "一次費用重複計算",
    "Counting a one-off charge repeatedly"
  ],
  [
    "租 {0} 件器材。方案 A 每件 {1} 元，整單另收 {2} 元；方案 B 每件收 {3} 元，不另收費。B 比 A 多收多少元？",
    "Rent {0} items. Plan A charges {1} dollars per item plus {2} dollars once per order. Plan B charges {3} dollars per item with no other charge. How many more dollars does B charge than A?"
  ],
  [
    "固定費只出現一次，每件費出現多次。",
    "The fixed charge occurs once; the per-item charge occurs repeatedly."
  ],
  [
    "整單另收與每件另收差在哪？",
    "How do a per-order and a per-item extra charge differ?"
  ],
  [
    "A 的 {0} 元只收一次，B 把這 {1} 元收了 {2} 次。",
    "A charges {0} dollars only once, whereas B charges that {1} dollars {2} times."
  ],
  [
    "為甚麼 B 的整個和要乘件數？",
    "Why multiply the entire sum in B by the number of items?"
  ],
  [
    "每件的單價是 {0}，所以 {1} 件要乘整個單價，等於 ({2}+{3})×{4}。",
    "The price per item is {0}, so {1} items cost that whole price multiplied by the count: ({2}+{3})×{4}."
  ],
  [
    "不算兩個總價也可以嗎？",
    "Can we compare without finding both totals?"
  ],
  [
    "共同的 {0} 元單價抵消，B 比 A 多收 {1} 次 {2} 元，故多 {3} 元。",
    "The common {0}-dollar unit price cancels. B charges {1} extra copies of {2} dollars, so the excess is {3} dollars."
  ],
  [
    "共享邊的規律建模",
    "Model a pattern with shared edges"
  ],
  [
    "圖形增量與初始量",
    "Initial quantity and growth of a pattern"
  ],
  [
    "每個圖形都算四邊",
    "Counting four separate sides for every square"
  ],
  [
    "火柴排成一列 {0} 個相鄰正方形，共用的邊只放一根。由最右端拆掉 {1} 個正方形，並保留餘下圖形所需的邊。還有多少根火柴？",
    "A row contains {0} adjacent matchstick squares; each shared side uses one match. Remove {1} squares from the right, keeping every side needed by the remaining figure. How many matches remain?"
  ],
  [
    "餘下 {0} 個正方形。",
    "There are {0} squares left."
  ],
  [
    "第一個用 4 根，之後每個新增 3 根：4+3({0}−1)。",
    "The first square uses 4 matches and each additional square adds 3: 4+3({0}−1)."
  ],
  [
    "合共 {0} 根。",
    "The total is {0} matches."
  ],
  [
    "共用邊不能重複計算，拆除後還要保留新的最右邊。",
    "Do not count shared sides twice. After removal, keep the new rightmost boundary."
  ],
  [
    "為甚麼不能每拆一格就減四根？",
    "Why can we not subtract four matches for each removed square?"
  ],
  [
    "邊界的共用邊還是餘下最後一格的右邊。每拆去最右一格，真正少的是三根。",
    "The shared boundary is still the right side of the last remaining square. Removing the rightmost square actually removes only three matches."
  ],
  [
    "3n+1 中的 1 是甚麼？",
    "What does the 1 in 3n+1 represent?"
  ],
  [
    "每格計上、下、右三邊，共 3n 根；最左邊還要補一根，所以是 3n+1。",
    "Counting the top, bottom and right of each square gives 3n matches. Add the leftmost side to obtain 3n+1."
  ],
  [
    "可以由原來總數核對嗎？",
    "Can we check using the original total?"
  ],
  [
    "原來 {0} 根，拆去 {1}×3={2} 根，餘 {3}。",
    "Originally there were {0} matches. Remove {1}×3={2}, leaving {3}."
  ],
  [
    "負數代入與差的平方",
    "Substitute a negative value into a squared difference"
  ],
  [
    "代入的括號與結構",
    "Brackets and structure during substitution"
  ],
  [
    "把平方分配到減法",
    "Distributing a square across subtraction"
  ],
  [
    "當 x=−{0}，求 (x−{1})²−x²。",
    "For x=−{0}, find (x−{1})²−x²."
  ],
  [
    "先算 x−{0}=−{1}−{2}=−{3}。",
    "First calculate x−{0}=−{1}−{2}=−{3}."
  ],
  [
    "平方得 {0}²={1}，而 x²={2}。",
    "Squaring gives {0}²={1}, while x²={2}."
  ],
  [
    "相減得 {0}。",
    "The difference is {0}."
  ],
  [
    "先代入並算括號，再平方。",
    "Substitute and calculate the brackets before squaring."
  ],
  [
    "代入負數為甚麼加括號？",
    "Why put brackets around a substituted negative number?"
  ],
  [
    "寫成 ((−{0})−{1})² 能清楚保留 x 的整個值，避免把負號誤認成平方外的符號。",
    "Writing ((−{0})−{1})² retains the whole value of x and prevents confusing its minus sign with a sign outside the square."
  ],
  [
    "可以寫成 x² 減 ",
    "Can we write this as x² minus"
  ],
  [
    "² 嗎？",
    "squared?"
  ],
  [
    "不可以。先算差再平方：本題 ({0})²={1}，而 x²−{2}²={3}，兩者不相等。",
    "No. Calculate the difference before squaring: here ({0})²={1}, whereas x²−{2}²={3}. They are not equal."
  ],
  [
    "結果的正負是否合理？",
    "Does the sign of the result make sense?"
  ],
  [
    "x−{0} 比 x 更遠離 0，平方較大，故 (x−{1})²−x² 應為正，本題得 {2}。",
    "x−{0} is farther from 0 than x, so its square is larger. Thus (x−{1})²−x² should be positive; here it equals {2}."
  ],
  [
    "由單位建立剩餘量",
    "Use units to formulate a remaining quantity"
  ],
  [
    "不同單位的列式",
    "Equations with different units"
  ],
  [
    "把不同單位直接相減",
    "Subtracting quantities with incompatible units"
  ],
  [
    "水箱原有 {0} L，每分鐘流出 {1} L。經過 {2} 小時 {3} 分鐘，且期間沒有補水，還剩多少 L？",
    "A tank initially holds {0} L and drains at {1} L per minute. After {2} hours and {3} minutes, with no inflow, how many litres remain?"
  ],
  [
    "時間 = {0}×60+{1}={2} 分鐘。",
    "Time = {0}×60+{1}={2} minutes."
  ],
  [
    "流出量 = {0}×{1}={2} L。",
    "Outflow volume = {0}×{1}={2} L."
  ],
  [
    "剩餘量 = {0}−{1}={2} L。",
    "Remaining volume = {0}−{1}={2} L."
  ],
  [
    "先把時間統一成流量使用的分鐘。",
    "First express time in minutes, the unit used by the flow rate."
  ],
  [
    "為甚麼不直接把小時加分鐘？",
    "Why not simply add the hours and minutes?"
  ],
  [
    "1 小時是 60 分鐘；{0}+{1} 把不同單位混在一起，不能表示總分鐘數。",
    "One hour is 60 minutes. {0}+{1} combines different units and does not represent the total number of minutes."
  ],
  [
    "如何用單位檢查乘法？",
    "How can units check the multiplication?"
  ],
  [
    "(L/分鐘)×分鐘=L，正好是流出的體積；速度不能直接與原有體積相減。",
    "(L/minute)×minutes=L, the volume that flows out. A rate cannot be subtracted directly from the initial volume."
  ],
  [
    "如果算出負水量怎辦？",
    "What if the calculated water volume is negative?"
  ],
  [
    "表示等速流出模型已超出水箱可供的範圍，水早已流光。本題參數保證流出量小於原有量。",
    "The constant-outflow model has exceeded the tank's available supply; it emptied earlier. The parameters here ensure the outflow is less than the initial volume."
  ],
  [
    "翻譯語句並檢驗錯式",
    "Translate wording and test an incorrect expression"
  ],
  [
    "先後關係與括號",
    "Order of operations and brackets"
  ],
  [
    "先減再乘和先乘再減混淆",
    "Confusing subtract-then-multiply with multiply-then-subtract"
  ],
  [
    "「把 x 減去 {0} 後，再乘 {1}」應寫成 {2}(x−{3}) 還是 {4}x−{5}？用 x={6} 比較兩式，並解釋語句與括號的關係。",
    "Should “subtract {0} from x, then multiply by {1}” be {2}(x−{3}) or {4}x−{5}? Compare both at x={6} and explain how the brackets represent the wording."
  ],
  [
    "「減去後，再乘」表示先算括號，正確式為 {0}(x−{1})。",
    "Subtracting first and then multiplying means calculate the brackets first: the correct expression is {0}(x−{1})."
  ],
  [
    "x={0} 時正確式得 {1}，另一式得 {2}。",
    "At x={0}, the correct expression gives {1}; the other gives {2}."
  ],
  [
    "兩式相差 {0}；括號把減法的整個結果作為乘數。",
    "Their difference is {0}. The brackets make the entire result of the subtraction a factor."
  ],
  [
    "先找語句中哪一步先做。",
    "Identify which operation the wording asks you to do first."
  ],
  [
    "這個括號包住甚麼量？",
    "What quantity do these brackets enclose?"
  ],
  [
    "包住 x 減 {0} 後剩餘的整個量，不是只把 x 乘 {1}。",
    "The whole quantity remaining after subtracting {0} from x, not just x multiplied by {1}."
  ],
  [
    "另一式對應甚麼語句？",
    "What wording corresponds to the other expression?"
  ],
  [
    "{0}x−{1} 是「先把 x 乘 {2}，再減 {3}」。本題兩式在 x={4} 時分別是 {5} 與 {6}。",
    "{0}x−{1} means multiply x by {2}, then subtract {3}. At x={4}, the two expressions give {5} and {6}."
  ],
  [
    "一次代值能證明兩式恆等嗎？",
    "Can one substitution prove two expressions identical?"
  ],
  [
    "不能；但找到一次不同就能證明兩式不恆等。本題代值已有不同，足以否定兩式相同。",
    "No, but one differing value proves they are not identical. This substitution already gives different results and disproves their identity."
  ],
  [
    "選對含括號的式子",
    "Choose the expression with the correct brackets"
  ],
  [
    "正確計算兩式",
    "Evaluate both expressions correctly"
  ],
  [
    "把括號與語句次序連結",
    "Connect the brackets to the stated operation order"
  ],
  [
    "由與變數無關求參數",
    "Find a parameter from independence of a variable"
  ],
  [
    "零係數與恆定量",
    "Zero coefficient and a constant value"
  ],
  [
    "只代一個 x 就下結論",
    "Drawing a conclusion from just one x value"
  ],
  [
    "式子 ({0}m+{1})x−({2})x+7 的值對所有 x 都一樣。求 m。",
    "The expression ({0}m+{1})x−({2})x+7 has the same value for every x. Find m."
  ],
  [
    "合併 x 項：({0}m+{1}−({2}))x+7。",
    "Collect the x terms: ({0}m+{1}−({2}))x+7."
  ],
  [
    "要對所有 x 不變，x 的係數必須為 0。",
    "For the value to stay fixed for every x, the coefficient of x must be 0."
  ],
  [
    "{0}m={1}，所以 m={2}。",
    "{0}m={1}, so m={2}."
  ],
  [
    "令變數項的係數為零。",
    "Set the variable term's coefficient equal to zero."
  ],
  [
    "為甚麼合併時 x 不變？",
    "Why does x remain unchanged when collecting terms?"
  ],
  [
    "各項都有相同的 x，只把係數 {0}m+{1} 與 −({2}) 相加。",
    "Every term has the same x; add only the coefficients {0}m+{1} and −({2})."
  ],
  [
    "係數非零會怎樣？",
    "What happens if the coefficient is nonzero?"
  ],
  [
    "假設係數是 K，x 從 0 變 1，式子由 7 變 K+7；兩者相等便要求 K=0。",
    "Call the coefficient K. Changing x from 0 to 1 changes the expression from 7 to K+7. Equality requires K=0."
  ],
  [
    "求得參數後如何驗證？",
    "How can we verify the parameter found?"
  ],
  [
    "代 m={0}，x 係數為 {1}×({2})+{3}−({4})=0，所以任何 x 都只剩 7。",
    "Substitute m={0}: the coefficient of x is {1}×({2})+{3}−({4})=0. The expression is therefore 7 for every x."
  ],
  [
    "由和求未知整式的值",
    "Use a known sum to find an unknown polynomial value"
  ],
  [
    "加減互逆與負括號",
    "Inverse addition and subtraction with negative brackets"
  ],
  [
    "減去整式只變第一項符號",
    "Changing only the first sign when subtracting a polynomial"
  ],
  [
    "已知 A={0}x−{1}，A+B={2}x+{3}。當 x={4}，求 B。",
    "Given A={0}x−{1} and A+B={2}x+{3}, find B when x={4}."
  ],
  [
    "去括號得 ({0}−{1})x+{2}+{3}。",
    "Removing the brackets gives ({0}−{1})x+{2}+{3}."
  ],
  [
    "代入 x={0}，B={1}。",
    "Substitute x={0} to obtain B={1}."
  ],
  [
    "由總和減去已知部分，減號作用於整個 A。",
    "Subtract the known part from the total; the minus sign acts on all of A."
  ],
  [
    "為甚麼是總和減 A？",
    "Why subtract A from the total?"
  ],
  [
    "A+B 包含 A 和 B，減去整個 A 後才剩 B。不要把 A 和 A+B 相加。",
    "A+B contains A and B. Only after subtracting the whole of A is B left. Do not add A to A+B."
  ],
  [
    "常數為甚麼由負變正？",
    "Why does the negative constant become positive?"
  ],
  [
    "減去 ({0}x−{1}) 等於加上其相反式 −{2}x+{3}，裡面每一項都變號。",
    "Subtracting ({0}x−{1}) means adding its opposite, −{2}x+{3}; every term inside changes sign."
  ],
  [
    "可直接代值核對嗎？",
    "Can direct substitution check the result?"
  ],
  [
    "A={0}，A+B={1}，所以 B={2}−({3})={4}。",
    "A={0} and A+B={1}, so B={2}−({3})={4}."
  ],
  [
    "多層括號的符號傳遞",
    "Track signs through nested brackets"
  ],
  [
    "由內到外去括號",
    "Remove brackets from inside to outside"
  ],
  [
    "減去負項仍寫負",
    "Keeping a minus when subtracting a negative term"
  ],
  [
    "先化簡再求值：{0}x−[{1}x−({2}−x)]，其中 x={3}。",
    "Simplify, then evaluate {0}x−[{1}x−({2}−x)] for x={3}."
  ],
  [
    "中括號內 {0}x−({1}−x)={2}x−{3}+x。",
    "Inside the square brackets, {0}x−({1}−x)={2}x−{3}+x."
  ],
  [
    "減去整個中括號後：{0}x−{1}x+{2}−x。",
    "Subtracting the whole square bracket gives {0}x−{1}x+{2}−x."
  ],
  [
    "合併為 ({0})x+{1}，代入得 {2}。",
    "Collecting terms gives ({0})x+{1}; substitution yields {2}."
  ],
  [
    "每次只去一層括號，標記負號作用的範圍。",
    "Remove one bracket layer at a time and mark the scope of each minus sign."
  ],
  [
    "最裡面的 −x 為甚麼變 +x？",
    "Why does the innermost −x become +x?"
  ],
  [
    "−({0}−x)=−{1}+x，因為括號前的 −1 要乘到兩項。",
    "−({0}−x)=−{1}+x because the −1 before the brackets multiplies both terms."
  ],
  [
    "剛變成 +x，為甚麼又變 −x？",
    "Why does the newly obtained +x become −x again?"
  ],
  [
    "現在去的是外面的減號，它作用於整個 [{0}x−{1}+x]，所以其中 +x 再變成 −x。",
    "We are now removing the outer minus sign, which acts on all of [{0}x−{1}+x], so its +x becomes −x."
  ],
  [
    "怎樣避免一次變太多符號？",
    "How can we avoid changing too many signs at once?"
  ],
  [
    "先代 x={0}：最內括號為 {1}，中括號為 {2}，最後得 {3}，可檢查化簡結果。",
    "Substitute x={0} first: the innermost bracket is {1}, the square bracket is {2}, and the final value is {3}. Use this to check the simplification."
  ],
  [
    "由同類項條件求指數",
    "Find exponents from the like-term condition"
  ],
  [
    "同類項的字母與指數",
    "Variables and exponents in like terms"
  ],
  [
    "把係數也要求相同",
    "Requiring coefficients to be equal too"
  ],
  [
    "若 {0}x^(m+{1})y^{2} 與 −{3}x^{4}y^n 是同類項，求 m+n。",
    "If {0}x^(m+{1})y^{2} and −{3}x^{4}y^n are like terms, find m+n."
  ],
  [
    "同類項要求 x 的指數相同：m+{0}={1}。",
    "Like terms require equal exponents of x: m+{0}={1}."
  ],
  [
    "y 的指數也相同：n={0}。",
    "The exponents of y must also match: n={0}."
  ],
  [
    "m={0}，故 m+n={1}。",
    "m={0}, so m+n={1}."
  ],
  [
    "逐個字母比較指數，係數可以不同。",
    "Compare the exponent of each variable separately; coefficients may differ."
  ],
  [
    "係數不同仍是同類項嗎？",
    "Can terms with different coefficients still be like terms?"
  ],
  [
    "可以，{0} 與 −{1} 不影響字母部分是否相同。判準是每個相同字母的指數。",
    "Yes. The coefficients {0} and −{1} do not affect whether the variable parts match. Compare the exponent of each corresponding variable."
  ],
  [
    "只看總次數夠嗎？",
    "Is equal total degree enough?"
  ],
  [
    "不夠。x²y 和 xy² 的總次數都是 3，卻不是同類項；每個字母的指數要分別相等。",
    "No. x²y and xy² both have total degree 3 but are not like terms; each variable's exponent must match separately."
  ],
  [
    "代回怎樣確認？",
    "How does substitution confirm the conditions?"
  ],
  [
    "m={0} 時 m+{1}={2}，n={3}，兩項字母部分都為 x^{4}y^{5}。",
    "For m={0}, m+{1}={2}, and n={3}. Both terms then have variable part x^{4}y^{5}."
  ],
  [
    "由周長組合整式",
    "Form a polynomial from a perimeter"
  ],
  [
    "幾何數量與整式合併",
    "Geometric quantities and collecting terms"
  ],
  [
    "只計一條長與寬",
    "Counting just one length and one width"
  ],
  [
    "長方形長為 ({0}x+{1}) cm、寬為 ({2}x+{3}) cm。當 x={4}，周長是多少 cm？",
    "A rectangle has length ({0}x+{1}) cm and width ({2}x+{3}) cm. Find its perimeter in cm when x={4}."
  ],
  [
    "周長=2[({0}x+{1})+({2}x+{3})]。",
    "Perimeter = 2[({0}x+{1})+({2}x+{3})]."
  ],
  [
    "先合併同類項，得 {0}x+{1}。",
    "Collecting like terms first gives {0}x+{1}."
  ],
  [
    "代 x={0}，周長={1} cm。",
    "Substitute x={0}: perimeter={1} cm."
  ],
  [
    "周長包括兩條長及兩條寬。",
    "A perimeter includes two lengths and two widths."
  ],
  [
    "為甚麼外面還有 2？",
    "Why is there an outer factor of 2?"
  ],
  [
    "長方形兩組對邊各相等，一次長加寬只走了周界的一半。",
    "Both pairs of opposite sides of a rectangle are equal. One length plus one width covers only half the boundary."
  ],
  [
    "能否把 x 項與常數合併？",
    "Can the x term be combined with the constant?"
  ],
  [
    "不能，{0}x 與 {1} 沒有相同字母部分。只先合併 x 項，再合併常數。",
    "No. {0}x and {1} do not have the same variable part. Combine the x terms, then the constants."
  ],
  [
    "直接算四邊如何檢查？",
    "How can adding the four sides directly check it?"
  ],
  [
    "長={0}、寬={1}，四邊相加 {2}+{3}+{4}+{5}={6}。",
    "Length={0} and width={1}. Adding all four sides gives {2}+{3}+{4}+{5}={6}."
  ],
  [
    "用代值反駁錯誤化簡",
    "Use substitution to disprove an incorrect simplification"
  ],
  [
    "恆等變形與反例",
    "Equivalent identities and counterexamples"
  ],
  [
    "負括號只改首項",
    "Changing only the first sign after a negative bracket"
  ],
  [
    "小明說 {0}x−({1}x−{2})=({3})x−{4}。指出錯誤並改正，再用 x=0 檢查兩邊。",
    "Ming claims {0}x−({1}x−{2})=({3})x−{4}. Identify and correct the error, then check both sides at x=0."
  ],
  [
    "減去括號時，{0}x 和 −{1} 都要變號。",
    "When subtracting the brackets, both {0}x and −{1} must change sign."
  ],
  [
    "正確化簡是 {0}x−{1}x+{2}=({3})x+{4}。",
    "The correct simplification is {0}x−{1}x+{2}=({3})x+{4}."
  ],
  [
    "x=0 時原式為 {0}，錯式為 −{1}；兩者不同，錯式不恆等於原式。",
    "At x=0, the original expression is {0} and the incorrect one is −{1}. Their difference proves the claimed identity false."
  ],
  [
    "負號要作用於括號內每一項。",
    "The minus sign must act on every term in the brackets."
  ],
  [
    "為甚麼第二項也要變號？",
    "Why must the second term also change sign?"
  ],
  [
    "只改常數的正負可以嗎？",
    "Can we correct only the sign of the constant?"
  ],
  [
    "本題小明的 x 係數 {0} 已正確，錯在把常數仍寫成 −{1}。改成 +{2} 即可。",
    "Yes here: Ming's x coefficient {0} is already correct. The error is retaining −{1} as the constant; change it to +{2}."
  ],
  [
    "為甚麼選 x=0 檢查？",
    "Why choose x=0 for the check?"
  ],
  [
    "x 項都消失，能單獨比較常數 {0} 與 −{1}，讓這個符號錯誤清楚顯現。",
    "All x terms vanish, isolating the constants {0} and −{1} and revealing the sign error clearly."
  ],
  [
    "指出負號未乘到常數項",
    "Identify the minus sign not being applied to the constant"
  ],
  [
    "寫出正確化簡",
    "Write the correct simplification"
  ],
  [
    "用反例核對不恆等",
    "Use a counterexample to check the failed identity"
  ],
  [
    "去分母而不漏項",
    "Clear denominators without omitting a term"
  ],
  [
    "等式兩邊同乘",
    "Multiply both sides of an equation by the same quantity"
  ],
  [
    "未乘無分母項",
    "Failing to multiply a term with no denominator"
  ],
  [
    "解 ({0}x+{1})/{2}−x={3}/{4}，輸入 x。",
    "Solve ({0}x+{1})/{2}−x={3}/{4}. Enter x."
  ],
  [
    "兩邊每一項都乘 {0}：{1}x+{2}−{3}x={4}。",
    "Multiply every term on both sides by {0}: {1}x+{2}−{3}x={4}."
  ],
  [
    "合併得 {0}x={1}。",
    "Collecting terms gives {0}x={1}."
  ],
  [
    "兩邊除以 {0}，x={1}。",
    "Divide both sides by {0}: x={1}."
  ],
  [
    "去分母時，沒有分母的 −x 也要乘。",
    "When clearing denominators, multiply the denominator-free term −x too."
  ],
  [
    "為甚麼 −x 也要乘？",
    "Why must −x also be multiplied?"
  ],
  [
    "等式兩邊各乘 {0}，左邊是整個差乘 {1}，分配後 −x 變成 −{2}x。",
    "Multiplying both sides by {0} multiplies the whole difference on the left by {1}. Distribution changes −x to −{2}x."
  ],
  [
    "常數怎樣移到右邊？",
    "How is the constant moved to the right?"
  ],
  [
    "兩邊都減 {0}，右邊 {1}−{2}={3}。移項只是這一步的簡寫。",
    "Subtract {0} from both sides. On the right, {1}−{2}={3}. Moving a term is shorthand for this operation."
  ],
  [
    "如何代回原方程？",
    "How can we substitute into the original equation?"
  ],
  [
    "左邊 ({0}×({1})+{2})/{3}−({4})={5}/{6}，與右邊相同。",
    "The left side is ({0}×({1})+{2})/{3}−({4})={5}/{6}, matching the right side."
  ],
  [
    "辨認百分率的基準",
    "Identify the reference quantity of a percentage"
  ],
  [
    "利潤與成本模型",
    "Profit and cost models"
  ],
  [
    "以售價作利潤率分母",
    "Using selling price as the denominator of the profit rate"
  ],
  [
    "商品以成本加 {0}% 定價後售出，實收 {1} 元。求成本。",
    "An item sells for its cost plus {0}%, bringing in {1} dollars. Find the cost."
  ],
  [
    "設成本為 x，利潤是 ({0}/100)x。",
    "Let the cost be x; the profit is ({0}/100)x."
  ],
  [
    "售價 x+({0}/100)x={1}。",
    "Selling price x+({0}/100)x={1}."
  ],
  [
    "x={0}÷{1}={2} 元。",
    "x={0}÷{1}={2} dollars."
  ],
  [
    "先確認百分率是以哪個量作基準。",
    "First identify which quantity is the percentage base."
  ],
  [
    "為甚麼利潤不是售價的百分比？",
    "Why is the profit not this percentage of the selling price?"
  ],
  [
    "題目說「成本加 {0}%」，故基準是未知的成本 x，而不是已知售價 {1}。",
    "The statement says cost plus {0}%, so the reference is the unknown cost x, not the known selling price {1}."
  ],
  [
    "為甚麼不能售價乘 ",
    "Why not multiply the selling price by"
  ],
  [
    "加價後售價是原成本的 {0}%。返回成本要除以 {1}，直接打 {2}% 折扣會換了基準。",
    "After the markup, the selling price is {0}% of the original cost. Recover the cost by dividing by {1}; applying a {2}% discount changes the reference quantity."
  ],
  [
    "代回情境如何驗算？",
    "How does the context check the answer?"
  ],
  [
    "成本 {0} 加利潤 {1}，合共 {2}，與售價吻合。",
    "Cost {0} plus profit {1} gives {2}, matching the selling price."
  ],
  [
    "由相對速度建方程",
    "Form an equation using relative speed"
  ],
  [
    "同向追趕",
    "Catching up in the same direction"
  ],
  [
    "使用速度和",
    "Using the sum of the speeds"
  ],
  [
    "甲以 {0} m/s 前行，乙在甲後方 {1} m，以 {2} m/s 同向追趕。兩人同時開始計時且速度不變，乙多久追上？",
    "A travels at {0} m/s. B starts {1} m behind A and follows in the same direction at {2} m/s. They start timing together and keep constant speeds. How long until B catches A?"
  ],
  [
    "設 t 秒追上；甲的位置為 {0}+{1}t，乙為 {2}t。",
    "Let the catch-up time be t seconds. A's position is {0}+{1}t and B's is {2}t."
  ],
  [
    "{0}t={1}+{2}t，所以 {3}t={4}。",
    "{0}t={1}+{2}t, so {3}t={4}."
  ],
  [
    "t={0} 秒。",
    "t={0} seconds."
  ],
  [
    "以乙的起點為共同位置零點。",
    "Use B's starting point as the common position zero."
  ],
  [
    "為甚麼甲的式子多一個數？",
    "Why does A's expression include an extra constant?"
  ],
  [
    "計時開始時甲已領先 {0} m，所以甲從共同零點量的位置是原有領先量加走過的距離。",
    "A is already {0} m ahead when timing starts. Its position from the common origin is that head start plus the distance travelled."
  ],
  [
    "同向追趕為甚麼用速度差？",
    "Why subtract speeds when catching up in the same direction?"
  ],
  [
    "每秒乙走 {0} m，甲也向前走 {1} m，距離只縮短 {2} m。速度和用於相向接近的情況。",
    "Each second B travels {0} m while A advances {1} m, so their gap closes by only {2} m. Add speeds when they approach each other from opposite directions."
  ],
  [
    "如何檢查追上時位置相同？",
    "How can we check their positions coincide when they meet?"
  ],
  [
    "t={0}，乙位置={1}；甲位置={2}+{3}={4}，兩者相同。",
    "At t={0}, B's position is {1}; A's is {2}+{3}={4}. The positions match."
  ],
  [
    "由已知解反求參數",
    "Find a parameter from a known solution"
  ],
  [
    "解的代入定義",
    "The substitution definition of a solution"
  ],
  [
    "求錯未知量",
    "Solving for the wrong unknown"
  ],
  [
    "x={0} 是方程 {1}x+{2}=k 的解。求 k，再問：固定此 k 後，這個方程是否只有一個解？（答案欄輸入 k）",
    "x={0} solves {1}x+{2}=k. Find k, then decide whether the equation with this fixed k has only one solution. Enter k in the answer field."
  ],
  [
    "把已知的解代入：k={0}×({1})+{2}。",
    "Substitute the known solution: k={0}×({1})+{2}."
  ],
  [
    "故 k={0}。",
    "Therefore k={0}."
  ],
  [
    "因 x 係數 {0} 不為 0，可唯一解出 x=(k−{1})/{2}，所以只有一解。",
    "The coefficient {0} of x is nonzero, so x=(k−{1})/{2} is uniquely determined. There is only one solution."
  ],
  [
    "「是方程的解」表示代入後兩邊相等。",
    "A solution makes both sides equal when substituted."
  ],
  [
    "這次要解的是 x 還是 k？",
    "Are we solving for x or for k this time?"
  ],
  [
    "x 已知為 {0}；未知的是使等式成立的右邊常數 k。先讀清所求量。",
    "x is already given as {0}; the unknown is the right-hand constant k that makes the equality true. Read the required quantity carefully."
  ],
  [
    "根是負數時怎樣代入？",
    "How should a negative root be substituted?"
  ],
  [
    "把整個 {0} 放進括號，計算 {1}×({2})={3}，再加 {4}。",
    "Put the whole value {0} in brackets. Calculate {1}×({2})={3}, then add {4}."
  ],
  [
    "為甚麼能說解唯一？",
    "Why is the solution unique?"
  ],
  [
    "若兩個 x 都成立，它們的差乘 {0} 必須為 0。{1}≠0，所以兩個 x 必須相同。",
    "If two x values solve the equation, their difference multiplied by {0} is 0. Since {1}≠0, the two x values must be equal."
  ],
  [
    "由兩個總價消去共同費用",
    "Eliminate a common charge using two totals"
  ],
  [
    "共同固定費與一次方程",
    "A common fixed charge and a linear equation"
  ],
  [
    "把總價比當數量比",
    "Treating a price ratio as a quantity ratio"
  ],
  [
    "同店購物，每單包裝費相同。買 {0} 本簿共 {1} 元，買 {2} 本共 {3} 元。求每本價格。",
    "A shop charges the same packaging fee per order. Buying {0} notebooks costs {1} dollars; buying {2} costs {3} dollars. Find the price per notebook."
  ],
  [
    "第二單比第一單多 {0} 本，包裝費相同。",
    "The second order has {0} more notebooks and the same packaging fee."
  ],
  [
    "總價差 {0}−{1}={2} 元，全是增加簿本的費用。",
    "The price difference {0}−{1}={2} dollars is entirely the cost of those extra notebooks."
  ],
  [
    "每本 {0} 元；共同包裝費 {1} 元。",
    "Each notebook costs {0} dollars; the common packaging fee is {1} dollars."
  ],
  [
    "先比較兩單之間多出的數量與費用。",
    "First compare the extra quantity and extra cost between the orders."
  ],
  [
    "為甚麼可以消去包裝費？",
    "Why can the packaging fee be eliminated?"
  ],
  [
    "兩單各付一次相同包裝費。相減時，一正一負的同額費用抵消。",
    "Each order pays the same fee once. Subtracting the totals cancels equal positive and negative copies of that fee."
  ],
  [
    "為甚麼不直接總價除本數？",
    "Why not divide each total directly by the number of notebooks?"
  ],
  [
    "例如第一單 {0} 元還包含 {1} 元包裝費，直接除 {2} 會把固定費攤進單價。",
    "For example, the first total of {0} dollars includes a {1}-dollar packaging fee. Dividing directly by {2} spreads that fixed fee into the unit price."
  ],
  [
    "如何同時核對兩單？",
    "How can both orders be checked together?"
  ],
  [
    "{0}×{1}+{2}={3}；{4}×{5}+{6}={7}，兩筆均吻合。",
    "{0}×{1}+{2}={3} and {4}×{5}+{6}={7}; both totals match."
  ],
  [
    "辨別無解與無限多解",
    "Distinguish no solution from infinitely many solutions"
  ],
  [
    "化簡後的等式判讀",
    "Interpret the equation after simplification"
  ],
  [
    "以為每個方程都得一個 x",
    "Assuming every equation gives one value of x"
  ],
  [
    "比較方程 A：{0}(x+{1})={2}x+{3}；B：{4}(x+{5})={6}x+{7}。各有多少個解？解釋化簡後的數字等式。",
    "Compare equation A: {0}(x+{1})={2}x+{3}, and B: {4}(x+{5})={6}x+{7}. How many solutions does each have? Explain the numerical equalities after simplification."
  ],
  [
    "A 展開後兩邊相同，消去 {0}x 得 {1}={2}，所有實數 x 都成立。",
    "Expanding A gives identical sides. Cancelling {0}x leaves {1}={2}, true for every real x."
  ],
  [
    "B 消去 {0}x 得 {1}={2}，矛盾，無解。",
    "Cancelling {0}x in B leaves {1}={2}, a contradiction, so there is no solution."
  ],
  [
    "兩者整理後 x 項均消失，不能假定一定得到唯一解；此時不再是非零一次係數的方程。",
    "The x terms disappear in both equations. A unique solution cannot be assumed; the simplified equations no longer have a nonzero linear coefficient."
  ],
  [
    "先展開，再看消去 x 後剩下真等式還是假等式。",
    "Expand first, then decide whether the remaining equality after cancelling x is true or false."
  ],
  [
    "沒有 x 留下來代表 x=0 嗎？",
    "If no x term remains, does that mean x=0?"
  ],
  [
    "不是。x 項抵消表示條件已不依賴 x，要判斷剩下的常數等式是否成立。",
    "No. Cancellation means the condition no longer depends on x. Decide whether the remaining constant equality is true."
  ],
  [
    "為甚麼 B 不是負數解？",
    "Why does B not have a negative solution?"
  ],
  [
    "不論代哪個 x，右邊都比左邊多 {0}。改變 x 會同時改變兩邊同樣大小，不能消掉差額。",
    "Whatever x is substituted, the right side exceeds the left by {0}. Changing x changes both sides equally and cannot remove that gap."
  ],
  [
    "可以代數字確認嗎？",
    "Can substituting numbers confirm it?"
  ],
  [
    "代 x=0，A 是 {0}={1}；B 是 {2}={3}。一般性的結論則由消去 x 的推理保證。",
    "At x=0, A gives {0}={1} and B gives {2}={3}. The general conclusions follow from the reasoning that eliminates x."
  ],
  [
    "A 判為所有實數",
    "Classify A as true for all real numbers"
  ],
  [
    "B 判為無解",
    "Classify B as having no solution"
  ],
  [
    "用恆真或矛盾等式說明",
    "Explain using an always-true equality or a contradiction"
  ],
  [
    "含負係數的不等式",
    "An inequality with a negative coefficient"
  ],
  [
    "乘除負數反向",
    "Reverse the inequality when multiplying or dividing by a negative number"
  ],
  [
    "移項和除負數混淆",
    "Confusing moving a term with dividing by a negative number"
  ],
  [
    "解 {0}−{1}x≥{2}，寫成 x≤k。求 k。",
    "Solve {0}−{1}x≥{2} in the form x≤k. Find k."
  ],
  [
    "兩邊減 {0}：−{1}x≥{2}。",
    "Subtract {0} from both sides: −{1}x≥{2}."
  ],
  [
    "兩邊除以負數 −{0}，方向反轉。",
    "Divide both sides by the negative number −{0}, reversing the inequality."
  ],
  [
    "x≤{0}，故 k={1}。",
    "x≤{0}, so k={1}."
  ],
  [
    "分清減常數與除以負數這兩步。",
    "Distinguish subtracting a constant from dividing by a negative number."
  ],
  [
    "移項時也要反轉嗎？",
    "Does moving a term also reverse the inequality?"
  ],
  [
    "不用。兩邊同減 {0} 只是平移，不改次序；反轉發生在下一步除以 −{1}。",
    "No. Subtracting {0} from both sides shifts both equally and preserves their order. Reversal occurs in the next step when dividing by −{1}."
  ],
  [
    "負數乘法為甚麼改方向？",
    "Why does multiplication by a negative number reverse the order?"
  ],
  [
    "2<3，但乘 −1 後 −2>−3。數軸被反向，原本較右的數變成較左。",
    "2<3, but multiplying by −1 gives −2>−3. It reverses the number line, moving the previously right-hand point to the left."
  ],
  [
    "怎樣挑數驗證方向？",
    "How can selected values check the direction?"
  ],
  [
    "取 x={0}，左邊 {1}≥{2} 成立；取 x={3}，左邊 {4}<{5} 不成立。端點 x={6} 恰好相等。",
    "At x={0}, the left side satisfies {1}≥{2}; at x={3}, it gives {4}<{5} and fails. At the endpoint x={6}, equality holds."
  ],
  [
    "交集與整數端點",
    "Intersections and integer endpoints"
  ],
  [
    "嚴格與非嚴格界限",
    "Strict and inclusive bounds"
  ],
  [
    "把不包含端點算入",
    "Counting an excluded endpoint"
  ],
  [
    "整數 x 同時滿足 x>{0} 及 2x≤{1}。共有多少個解？",
    "An integer x satisfies both x>{0} and 2x≤{1}. How many solutions are there?"
  ],
  [
    "第二個條件除以正數 2 得 x≤{0}。",
    "Dividing the second condition by the positive number 2 gives x≤{0}."
  ],
  [
    "公共整數由 {0} 至 {1}。",
    "The common integers run from {0} to {1}."
  ],
  [
    "個數 {0}−({1})+1={2}。",
    "Their number is {0}−({1})+1={2}."
  ],
  [
    "兩條限制要同時成立，先標記端點是否包含。",
    "Both restrictions must hold. First mark whether each endpoint is included."
  ],
  [
    "除以 2 為甚麼不反向？",
    "Why does division by 2 not reverse the inequality?"
  ],
  [
    "2 是正數，等比例縮小數軸仍保留左右次序。只有乘除負數才反向。",
    "2 is positive, so scaling down the number line preserves left-to-right order. Only multiplication or division by a negative number reverses it."
  ],
  [
    "兩端點的取捨有何不同？",
    "How are the two endpoints treated differently?"
  ],
  [
    "左端 {0} 因嚴格 > 被排除；右端 {1} 因 ≤ 被包含，所以第一個是 {2}，最後是 {3}。",
    "The left endpoint {0} is excluded by strict >; the right endpoint {1} is included by ≤. Thus the first integer is {2} and the last is {3}."
  ],
  [
    "零需要特別排除嗎？",
    "Must zero be excluded specially?"
  ],
  [
    "零也是整數，只要同時符合兩條不等式就要計入；不要因為只想到正負整數而漏掉它。",
    "Zero is an integer too. Count it whenever it satisfies both inequalities; do not omit it by thinking only of positive and negative integers."
  ],
  [
    "預算上限與取整",
    "A budget bound and rounding down"
  ],
  [
    "不等式情境模型",
    "An inequality model in context"
  ],
  [
    "四捨五入超出預算",
    "Rounding to the nearest integer exceeds the budget"
  ],
  [
    "有 {0} 元，先付固定運費 {1} 元，每件 {2} 元。最多買多少件？",
    "You have {0} dollars, pay a fixed delivery charge of {1} dollars, then {2} dollars per item. What is the maximum number of items you can buy?"
  ],
  [
    "設買整數 x≥0 件：{0}+{1}x≤{2}。",
    "Let x≥0 be an integer number of items: {0}+{1}x≤{2}."
  ],
  [
    "x≤({0}−{1})/{2}；這個上界約為 {3}。",
    "x≤({0}−{1})/{2}; this upper bound is approximately {3}."
  ],
  [
    "取不超過上界的最大整數，最多 {0} 件。",
    "Choose the largest integer not exceeding the bound: at most {0} items."
  ],
  [
    "件數必須是整數，且不能超出上界。",
    "The item count must be an integer and must not exceed the bound."
  ],
  [
    "為甚麼用 ≤ 而不是 =？",
    "Why use ≤ instead of =?"
  ],
  [
    "可以有剩餘款項，不要求剛好花光；總支出不得高於預算。",
    "Money may remain; there is no requirement to spend it all. Total spending must not exceed the budget."
  ],
  [
    "為甚麼不能四捨五入？",
    "Why not round to the nearest integer?"
  ],
  [
    "四捨五入可能取 {0}，支出會是 {1}>{2}。必須向下取整。",
    "Rounding could give {0}, costing {1}>{2}. We must round down instead."
  ],
  [
    "怎樣證明已經是最多？",
    "How can we prove this is the maximum?"
  ],
  [
    "{0} 件需 {1}，買得起；多一件需 {2}，買不起。相鄰兩個整數就確認了最大值。",
    "{0} items cost {1} and are affordable; one more costs {2} and is not. Checking adjacent integers establishes the maximum."
  ],
  [
    "由整數解個數逆推",
    "Work backwards from the number of integer solutions"
  ],
  [
    "開區間的端點關係",
    "Endpoints of an open interval"
  ],
  [
    "少算兩端排除",
    "Failing to exclude both endpoints correctly"
  ],
  [
    "x>{0} 且 x<m 恰有 {1} 個整數解，m 也是整數。求 m。",
    "x>{0} and x<m have exactly {1} integer solutions, and m is also an integer. Find m."
  ],
  [
    "最小整數解為 {0}，最大為 m−1。",
    "The smallest integer solution is {0} and the largest is m−1."
  ],
  [
    "個數 (m−1)−({0})+1=m−({1})−1。",
    "Count = (m−1)−({0})+1=m−({1})−1."
  ],
  [
    "令個數為 {0}，得 m={1}。",
    "Set this count equal to {0} to obtain m={1}."
  ],
  [
    "先用 m 表示最後一個整數，再列個數。",
    "First express the last integer in terms of m, then formulate the count."
  ],
  [
    "為甚麼最後一個是 m−1？",
    "Why is the last integer m−1?"
  ],
  [
    "因 m 是整數，而條件 x<m 不含 m，所以最接近的整數是 m−1。若 m 非整數，這個說法就不能直接用。",
    "m is an integer and x<m excludes m, so the nearest smaller integer is m−1. If m were nonintegral, this statement would not apply directly."
  ],
  [
    "減端點與計個數有何分別？",
    "How does subtracting endpoints differ from counting values?"
  ],
  [
    "從 {0} 到 m−1 包括首尾，間隔數之後要加 1，才得到實際整數數量。",
    "The integers from {0} to m−1 include both ends. Add 1 to the number of gaps to obtain the number of integers."
  ],
  [
    "如何列出端點核對？",
    "How can listing the endpoints check it?"
  ],
  [
    "代 m={0}，整數由 {1} 到 {2}，個數 {3}−({4})+1={5}。",
    "Substitute m={0}: the integers run from {1} to {2}, giving {3}−({4})+1={5} values."
  ],
  [
    "比較方案的臨界值",
    "Find a threshold when comparing plans"
  ],
  [
    "兩個費用模型的不等式",
    "An inequality between two cost models"
  ],
  [
    "較低單價一定較便宜",
    "Assuming a lower unit price always means a cheaper total"
  ],
  [
    "方案 A 固定費 {0} 元，另每次 {1} 元；方案 B 無固定費，每次 {2} 元。使用整數次數，最少用幾次 A 才嚴格較便宜？",
    "Plan A charges a fixed {0} dollars plus {1} dollars per use. Plan B has no fixed charge and costs {2} dollars per use. For an integer number of uses, what is the minimum that makes A strictly cheaper?"
  ],
  [
    "A<B 要求 {0}+{1}x<{2}x。",
    "A<B requires {0}+{1}x<{2}x."
  ],
  [
    "整理得 {0}<{1}x，所以 x>{2}。",
    "Rearranging gives {0}<{1}x, so x>{2}."
  ],
  [
    "次數為整數，最少 {0} 次。",
    "The count is an integer, so at least {0} uses are needed."
  ],
  [
    "「嚴格較便宜」不包含同價的臨界值。",
    "Strictly cheaper excludes the break-even value."
  ],
  [
    "A 的單價低，為甚麼未必划算？",
    "Why can A's lower unit price still be poor value?"
  ],
  [
    "A 還有 {0} 元固定費；次數少時，節省的單價未能抵銷這筆費用。",
    "A also has a fixed fee of {0} dollars. For few uses, the unit-price saving has not offset that charge."
  ],
  [
    "臨界次數可以選嗎？",
    "Can the break-even count be selected?"
  ],
  [
    "x={0} 時 A={1}，B={2}，只是同價，還不符合嚴格較便宜。",
    "At x={0}, A costs {1} and B costs {2}. They are equal, so A is not yet strictly cheaper."
  ],
  [
    "多用一次會差多少？",
    "What difference does one additional use make?"
  ],
  [
    "每次 A 比 B 省 {0} 元，超過同價點一次，A 就少付 {1} 元，所以 {2} 是首個可行整數。",
    "A saves {0} dollars per use compared with B. One use beyond break-even saves {1} dollars, so {2} is the first feasible integer."
  ],
  [
    "檢查除法的符號條件",
    "Check the sign condition before division"
  ],
  [
    "參數符號與不等式",
    "Parameter signs and inequalities"
  ],
  [
    "除未知數卻不討論正負",
    "Dividing by an unknown without considering its sign"
  ],
  [
    "由 ax<{0}，小明直接寫 x<{1}/a。說明何時成立、何時要反向，並用 a=−{2} 求出正確解集；也討論 a=0。",
    "From ax<{0}, Ming directly writes x<{1}/a. Explain when this holds and when the inequality must reverse. Find the correct solution set for a=−{2}, and also discuss a=0."
  ],
  [
    "a>0 時可以除以 a，得 x<{0}/a。",
    "For a>0, divide by a to obtain x<{0}/a."
  ],
  [
    "a<0 時應反向；代 a=−{0}，得 x>−{1}。",
    "For a<0, reverse the inequality. At a=−{0}, the solution is x>−{1}."
  ],
  [
    "a=0 時原式為 0<{0}，所有實數成立，但不能除以 0。",
    "At a=0, the original inequality is 0<{0}, true for every real x, but division by 0 is not allowed."
  ],
  [
    "先確定作除數的量是正、負還是零。",
    "First determine whether the divisor is positive, negative or zero."
  ],
  [
    "字母 a 為甚麼不能當正數？",
    "Why can the letter a not simply be treated as positive?"
  ],
  [
    "沒有額外條件時，字母可以代表正、負或零；不同符號的除法會有不同結果。",
    "Without an extra condition, a letter can represent a positive, negative or zero value. Division by different signs has different consequences."
  ],
  [
    "取 a=−",
    "Take a=−"
  ],
  [
    "，怎樣反駁原做法？",
    "how does this refute the original method?"
  ],
  [
    "正確解 x>−{0} 包含 x=0，且原式 0<{1} 成立；錯解 x<−{2} 卻排除 0。",
    "The correct solution x>−{0} includes x=0, which satisfies the original 0<{1}. The incorrect x<−{2} excludes 0."
  ],
  [
    "a=0 為甚麼不是無解？",
    "Why does a=0 not give no solution?"
  ],
  [
    "原式是 0×x<{0}，因右邊正數，所以任何 x 都成立。不能除以 0 不等於原不等式無解。",
    "The original inequality is 0×x<{0}. Its right side is positive, so every x satisfies it. Inability to divide by 0 does not mean the original inequality has no solution."
  ],
  [
    "區分正、負、零三種情況",
    "Distinguish positive, negative and zero cases"
  ],
  [
    "給出負參數的正確方向",
    "Give the correct inequality direction for a negative parameter"
  ],
  [
    "不除以零並判斷原式",
    "Avoid division by zero and evaluate the original inequality"
  ],
  [
    "−{0} 本身可以取嗎？",
    "Can −{0} itself be included?"
  ],
  [
    "可以寫成 x² 減 {0}² 嗎？",
    "Can we write this as x² minus {0}²?"
  ],
  [
    "為甚麼不能售價乘 {0}%？",
    "Why not multiply the selling price by {0}%?"
  ],
  [
    "取 a=−{0}，怎樣反駁原做法？",
    "For a=−{0}, how can we refute the original method?"
  ]
];
 for(const [source,english]of entries){if(/\{\d+\}/.test(source))MathStudioI18n.template(source,english);else MathStudioI18n.register([[source,english]]);}
})();
