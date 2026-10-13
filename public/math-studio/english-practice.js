/* Authored English practice labels and bounded question-generator templates. */
(function(I){
 I.template('同組題目不重複。綜合挑戰先平衡題型，每 5 題同類最多 1 題，再優先選該類未見過的變式；基礎與應用保留同類鞏固。{0}清除瀏覽器資料或轉裝置後，紀錄不會延續。作答草稿及本組分數只保留於本次頁面。','Questions do not repeat within a set. Combined challenges balance families first, with at most one from each family per five questions, then prioritise unseen variations. Foundation and application sets retain related practice for fluency. {0} Records do not continue after clearing browser data or changing devices. Drafts and this set\'s score last only for this page session.');
 for(const pair of [['本組 {0} 題 · 涵蓋 {1} 類題型','{0} questions in this set · {1} question families'],['你的答案（{0}）','Your answer ({0})'],['正確答案是 {0}。','The correct answer is {0}.'],['參考數值：{0}。','Reference value: {0}.'],['{0} · {1}','{0} · {1}'],['{0} / {1}','{0} / {1}'],['{0}；{1}','{0}; {1}'],['{0} ✓','{0} ✓'],['{0} ✕','{0} ✕'],['{0} 秒','{0} seconds'],['{0} 度','{0} degrees'],['{0} 張','{0} tickets'],['{0} 本','{0} books'],['{0} 人','{0} people'],['{0} 分鐘','{0} minutes'],['{0} 分','{0} points'],['· 每類最多 {0} 題','· at most {0} per family']])I.template(...pair);
 I.register([['· 已接受同類變式補足','· related variations accepted to fill the set']]);
 I.register([
 ['本章隨機練習','Random practice for this chapter'],['選一個範圍，開始練習','Choose a scope and start practising'],['年級','Year group'],['課題','Topic'],['全年級混合','Mixed topics for this year'],['層次','Level'],['每組題數','Questions per set'],
 ['分層混合','Mixed levels'],['基礎鞏固','Build fluency'],['應用理解','Apply understanding'],['綜合挑戰','Combined challenge'],['抽取新一組','Draw a new set'],['開始抽題','Draw questions'],
 ['出題紀錄保存在此瀏覽器。','Question exposure is saved in this browser.'],['此瀏覽器未能保存紀錄，目前只在本次開啟頁面避重。','Saving is unavailable; repeated questions are avoided only during this page session.'],
 ['從基本方法，練到解釋與應用。','Practise basic methods, explanations and applications.'],
 ['選擇題、數值題及書面推理按所選層次抽取。作答後可查看逐步解析；數值可輸入整數、小數或分數，例如 −3/4。無指定精度時，小數請保留至少 6 位。','Multiple-choice, numerical and written tasks follow the selected level. After answering, inspect the worked steps. Enter integers, decimals or fractions such as −3/4. Unless precision is specified, retain at least 6 decimal places.'],
 ['抽題設定已改變；按「抽取新一組」套用。目前仍顯示上一組題目。','The settings have changed. Choose Draw a new set to apply them; the previous set is still shown.'],
 ['此範圍的題型或各類變式不足以符合多樣性上限','This scope has too few families or variations to meet the diversity limit'],['此範圍不同題目不足','This scope has too few distinct questions'],['接受同類變式，補足本組','Allow related variations to fill the set'],['改用全年級同難度練習','Use this level across the whole year'],
 ['基礎','Foundation'],['應用','Application'],['挑戰','Challenge'],['書面推理','Written reasoning'],['數值作答','Numerical response'],['選擇辨析','Multiple-choice reasoning'],
 ['你的答案','Your answer'],['例：−3/4 或 0.75','Example: −3/4 or 0.75'],['核對答案','Check answer'],['寫下你的推理、例子或證明','Write your reasoning, examples or proof'],['先自行嘗試，再對照評量準則。','Attempt it independently, then compare against the criteria.'],['查看參考推理與評量','See reference reasoning and criteria'],['需要一點提示','Need a hint'],['回到本章概念，列出已知及未知。','Return to the chapter concepts and list what is known and unknown.'],
 ['參考推理 · 由你、同伴或教師評量','Reference reasoning · review by you, a peer or a teacher'],['答對了。','Correct.'],['正確答案是 ','The correct answer is '],['參考數值：','Reference value: '],
 ['看看常見錯法','Inspect a common error'],['檢視自己的答案（勾選不代表教師評分）','Review your answer (ticking a box is not a teacher grade)'],['請先寫下想法，或記錄你卡住的地方。','Write an initial idea or record where you got stuck first.'],['請輸入有效整數、小數或分數（分母不可為0），毋須寫單位。','Enter a valid integer, decimal or fraction with a nonzero denominator. Do not include units.'],
 ['每天，練出新的理解','Build new understanding through daily practice'],['按年級與課題抽題，從運算走到推理。','Draw questions by year and topic, moving from calculation to reasoning.'],
 ['同組題目不重複。綜合挑戰先平衡題型，每 5 題同類最多 1 題，再優先選該類未見過的變式；基礎與應用保留同類鞏固。','Questions do not repeat within a set. Combined challenges balance families first, with at most one from a family per five questions, then prioritise unseen variations. Foundation and application sets retain related practice for fluency.'],
 ['清除瀏覽器資料或轉裝置後，紀錄不會延續。作答草稿及本組分數只保留於本次頁面。','Records do not follow you after clearing browser data or changing devices. Answer drafts and this set\'s score last only for this page session.']
 ]);
 for(const pair of [
 ['{0} 類題型 · {1} 道數值／條件變式','{0} question families · {1} numerical/condition variations'],['{0} 題','{0} questions'],
 ['客觀題：答對 {0} / 已答 {1} 題','Objective questions: {0} correct / {1} answered'],['本組客觀題共 {0} 題 · 書面題已展開評量 {1} 題（不自動評分）','This set has {0} objective questions · {1} written tasks opened for review (no automatic grading)'],
 ['本組 {0} 題 · 涵蓋 {1} 類題型{2}','{0} questions in this set · {1} question families{2}'],[' · 每類最多 {0} 題',' · at most {0} per family'],[' · 已接受同類變式補足',' · related variations accepted to fill the set'],
 ['此範圍未見題目不足，已加入 {0} 道較早出現的題目作重溫。','There are too few unseen questions in this scope; {0} earlier questions were included for revision.'],
 ['{0}：要求 {1} 題，目前提供 {2} 題，仍維持原難度。','{0}: {1} requested, {2} currently available, with the original difficulty retained.'],
 ['第{0}題選項','Question {0} options'],['你的答案{0}','Your answer{0}'],['正確答案是 {0}','The correct answer is {0}'],['參考數值：{0}','Reference value: {0}'],
 ['{0}。這是本類題目的常見混淆，不代表已判定你的錯誤原因。','{0}. This is a common confusion for this family; it does not establish the cause of your error.']
 ])I.template(...pair);
 I.register([
 [
  "保留 3 位小數",
  "to 3 decimal places"
 ],
 [
  "距離是右端數值減左端數值。",
  "Distance is the right endpoint minus the left endpoint."
 ],
 [
  "先根據符號條件確定 x。",
  "Use the sign condition to identify x first."
 ],
 [
  "中點距兩端相同，坐標取平均。",
  "The midpoint is equidistant from the endpoints, so average their coordinates."
 ],
 [
  "中點的坐標是兩端坐標的平均。",
  "The midpoint coordinate is the average of the endpoint coordinates."
 ],
 [
  "把兩個絕對值看成到兩個固定點的距離。",
  "Interpret the absolute values as distances to two fixed points."
 ],
 [
  "先乘方，再乘法，最後相加。",
  "Powers first, then multiplication, then addition."
 ],
 [
  "平均偏差須乘袋數，不能只減一次。",
  "Multiply the average deviation by the bag count; do not subtract it only once."
 ],
 [
  "計算每一筆交易後的餘額，不只看最後結果。",
  "Calculate the balance after every transaction, rather than just the final balance."
 ],
 [
  "元",
  "currency units"
 ],
 [
  "用 1/[k(k+1)] = 1/k − 1/(k+1)。",
  "Use 1/[k(k+1)] = 1/k − 1/(k+1)."
 ],
 [
  "把每一項拆成兩個相鄰分數之差。",
  "Split each term into the difference of two neighbouring fractions."
 ],
 [
  "負數代入乘方時，底數加括號。",
  "Put parentheses around a negative substituted base."
 ],
 [
  "把固定部分與隨時間改變的部分分開。",
  "Separate the fixed component from the time-dependent component."
 ],
 [
  "第一個用 4 根；之後每個只增加 3 根。",
  "The first needs 4 matches; each further square adds only 3."
 ],
 [
  "先算第一個，再看每增加一個要添幾根。",
  "Count the first square, then the increase for each additional square."
 ],
 [
  "留意整體是已知代數式的倍數。",
  "Look for a multiple of the complete known expression."
 ],
 [
  "括號前的負號要乘到每一項。",
  "The negative multiplier applies to every term inside the parentheses."
 ],
 [
  "同類項的相同字母指數相等，n = 5。",
  "Matching variable exponents gives n = 5."
 ],
 [
  "係數不同不影響是否為同類項。",
  "Different coefficients do not prevent terms from being alike."
 ],
 [
  "先由內到外去括號。",
  "Remove parentheses from the inside out."
 ],
 [
  "與 x 無關表示 x 的係數為 0。",
  "Independence from x means its coefficient is zero."
 ],
 [
  "讓變量的係數為零。",
  "Set the variable's coefficient to zero."
 ],
 [
  "等式兩邊做相同運算。",
  "Perform the same operation on both sides of the equality."
 ],
 [
  "利潤率的分母是成本，並非售價。",
  "The profit-rate denominator is cost, not selling price."
 ],
 [
  "同向追趕用速度差。",
  "Use the speed difference for pursuit in the same direction."
 ],
 [
  "秒",
  "seconds"
 ],
 [
  "先去分母，並乘遍每一項。",
  "Clear denominators first, multiplying every term."
 ],
 [
  "先求原角，再求補角。",
  "Find the original angle before its supplement."
 ],
 [
  "度",
  "degrees"
 ],
 [
  "中點可能在 B 的左方或右方，距離須取絕對值。",
  "The midpoint may be on either side of B; take an absolute value for distance."
 ],
 [
  "圓錐體積是同底同高圓柱的三分之一。",
  "A cone has one-third the volume of a cylinder with the same base and height."
 ],
 [
  "先明確各條射線在角內的位置。",
  "Establish where each ray lies inside the angle first."
 ],
 [
  "同旁內角互補。",
  "Same-side interior angles are supplementary."
 ],
 [
  "確認角在截線同側且兩線之間。",
  "Check that the angles are on the same side of the transversal and between the lines."
 ],
 [
  "平行線的內錯角相等。",
  "Alternate interior angles formed by parallel lines are equal."
 ],
 [
  "分別列出對頂角和鄰補角。",
  "List the vertically opposite and adjacent supplementary angles separately."
 ],
 [
  "過 P 作與 l、m 平行的水平線。",
  "Through P, draw a horizontal parallel to l and m."
 ],
 [
  "過轉折點作平行線，將折角拆開。",
  "Draw a parallel through the turning point to split the angle."
 ],
 [
  "平方與算術平方根互為逆運算。",
  "Squaring and taking the principal square root are inverse operations."
 ],
 [
  "找相鄰兩個完全平方數。",
  "Find two consecutive perfect squares."
 ],
 [
  "平方根符號取非負值，立方根可以為負。",
  "A square-root symbol gives the nonnegative root; a cube root may be negative."
 ],
 [
  "兩項均非負，和為 0 時必須各自為 0。",
  "Both terms are nonnegative, so each must be zero when their sum is zero."
 ],
 [
  "非負數之和為零，則每項均為零。",
  "If nonnegative terms sum to zero, each is zero."
 ],
 [
  "右移改橫坐標，下移改縱坐標。",
  "Moving right changes x; moving down changes y."
 ],
 [
  "關於 x 軸對稱時，縱坐標變號。",
  "Reflection in the x-axis reverses the sign of y."
 ],
 [
  "OA、OB 分別位於兩坐標軸，互相垂直。",
  "OA and OB lie on perpendicular coordinate axes."
 ],
 [
  "把坐標軸上的線段看成底與高。",
  "Use the segments on the axes as base and height."
 ],
 [
  "等距點位於 AB 的垂直平分線。",
  "Equidistant points lie on the perpendicular bisector of AB."
 ],
 [
  "利用垂直平分線，不必分別計算距離。",
  "Use the perpendicular bisector instead of calculating both distances."
 ],
 [
  "加減消元。",
  "Eliminate by adding or subtracting equations."
 ],
 [
  "同時使用張數與總價兩個等量關係。",
  "Use both the ticket-count and revenue equations."
 ],
 [
  "張",
  "tickets"
 ],
 [
  "每個未知數在三式中各出現兩次。",
  "Each unknown occurs twice across the three equations."
 ],
 [
  "先利用額外條件確定 x、y，再求參數。",
  "Use the extra condition to find x and y before the parameter."
 ],
 [
  "除以負數需反向。",
  "Division by a negative number reverses the inequality."
 ],
 [
  "留意兩端是否包含。",
  "Check whether each endpoint is included."
 ],
 [
  "先解不等式，再按情境取整數。",
  "Solve the inequality, then choose an integer appropriate to the context."
 ],
 [
  "本",
  "books"
 ],
 [
  "先列出最小與最大的整數解。",
  "Identify the smallest and largest integer solutions first."
 ],
 [
  "先算部分佔整體的比例。",
  "Find the part-to-whole ratio first."
 ],
 [
  "全圓 360° 對應全部。",
  "The full 360° circle represents the whole."
 ],
 [
  "比例乘 360°。",
  "Multiply the proportion by 360°."
 ],
 [
  "這是抽樣估計，並非精確普查值。",
  "This is a sampling estimate, not an exact census count."
 ],
 [
  "把樣本比例用於同一總體。",
  "Apply the sample proportion to the same population."
 ],
 [
  "人",
  "people"
 ],
 [
  "先把比的各項相加求總份數。",
  "Add the ratio entries to find the total number of parts."
 ],
 [
  "內角和是 180°。",
  "The interior angles sum to 180°."
 ],
 [
  "使用內角和。",
  "Use the triangle angle sum."
 ],
 [
  "同時考慮兩邊之差與兩邊之和。",
  "Use both the difference and the sum of the other two sides."
 ],
 [
  "外角等於兩個不相鄰內角之和。",
  "An exterior angle equals the sum of the two nonadjacent interior angles."
 ],
 [
  "用外角定理。",
  "Use the exterior-angle theorem."
 ],
 [
  "在小三角形 BIC 中使用內角和。",
  "Use the angle sum in the smaller triangle BIC."
 ],
 [
  "先看全等式的頂點對應順序。",
  "Check the vertex order in the congruence statement first."
 ],
 [
  "PM=PN，OP 公共，兩直角三角形由 HL 全等，故 OM=ON。",
  "PM=PN and OP is shared. The right triangles are congruent by HL, giving OM=ON."
 ],
 [
  "角平分線性質配合直角三角形全等。",
  "Combine the angle-bisector property with right-triangle congruence."
 ],
 [
  "全等三角形周長相等。",
  "Congruent triangles have equal perimeters."
 ],
 [
  "利用對應邊相等。",
  "Use equality of corresponding sides."
 ],
 [
  "AB=AC、BD=CD、AD 公共，由 SSS，△ABD≅△ACD。",
  "AB=AC, BD=CD and AD is shared, so △ABD≅△ACD by SSS."
 ],
 [
  "先以 SSS 證明 AD 是角平分線。",
  "First prove by SSS that AD bisects the angle."
 ],
 [
  "區分頂角與底角。",
  "Distinguish the vertex angle from a base angle."
 ],
 [
  "每次只改對應的那個坐標符號。",
  "Reverse only the appropriate coordinate sign at each reflection."
 ],
 [
  "AP+BP=AP+PB′≥AB′；AB′ 經原點，等號可取。",
  "AP+BP=AP+PB′≥AB′. AB′ passes through the origin, so equality is attainable."
 ],
 [
  "反射一個端點，把折線轉成直線。",
  "Reflect one endpoint to turn the broken path into a straight line."
 ],
 [
  "分別討論哪個數是腰長，再用三角形不等式。",
  "Try each length as the equal sides and apply the triangle inequality."
 ],
 [
  "不要漏掉交叉項。",
  "Do not omit the cross term."
 ],
 [
  "用分配律展開並比較係數。",
  "Expand by distribution and compare coefficients."
 ],
 [
  "把兩數看成某個中間數加減同一數。",
  "Express the numbers as a common midpoint plus and minus the same amount."
 ],
 [
  "由完全平方公式反向整理。",
  "Rearrange the perfect-square identity."
 ],
 [
  "展開右式，常數項是 mn。",
  "Expanding the right side gives constant term mn."
 ],
 [
  "找積與和。",
  "Identify the product and sum."
 ],
 [
  "先用平方差分解。",
  "Factor the difference of squares first."
 ],
 [
  "先提公因式，再平方差。",
  "Take out the common factor, then use a difference of squares."
 ],
 [
  "同時比較一次項與常數項。",
  "Compare both the linear and constant coefficients."
 ],
 [
  "先找讓分母等於零的值。",
  "Find the value that makes the denominator zero first."
 ],
 [
  "先記錄限制，再驗根。",
  "Record the restriction first, then check the root."
 ],
 [
  "先因式分解，保留分母限制。",
  "Factor first and retain the denominator restriction."
 ],
 [
  "此時原方程無解，因為候選根使分母為零。",
  "The original equation then has no solution because the candidate makes its denominator zero."
 ],
 [
  "增根必使原式的分母為零。",
  "An extraneous root makes an original denominator zero."
 ],
 [
  "提出完全平方因數。",
  "Extract the perfect-square factor."
 ],
 [
  "先化簡，再合併同類根式。",
  "Simplify first, then combine like radicals."
 ],
 [
  "乘積為平方差。",
  "The product is a difference of squares."
 ],
 [
  "用共軛式與平方差。",
  "Use conjugates and a difference of squares."
 ],
 [
  "√(u²)=|u|，根據區間判斷符號。",
  "√(u²)=|u|; use the interval to determine the signs."
 ],
 [
  "確認所求是斜邊。",
  "Check that the requested side is the hypotenuse."
 ],
 [
  "梯子是斜邊，不是直角邊。",
  "The ladder is the hypotenuse, not a leg."
 ],
 [
  "先用勾股定理求對角線，再與周長比較。",
  "Use Pythagoras for the diagonal, then compare with the perimeter."
 ],
 [
  "等腰三角形底邊上的高也是中線。",
  "The base altitude of an isosceles triangle is also a median."
 ],
 [
  "內角和=(n−2)×180°。",
  "Interior-angle sum=(n−2)×180°."
 ],
 [
  "可由一頂點分成 n−2 個三角形。",
  "One vertex divides it into n−2 triangles."
 ],
 [
  "菱形的對角線互相垂直平分。",
  "The diagonals of a rhombus bisect one another perpendicularly."
 ],
 [
  "可把菱形分成四個直角三角形。",
  "Divide the rhombus into four right triangles."
 ],
 [
  "兩底和乘高，再除以二。",
  "Multiply the sum of the parallel sides by the height, then halve it."
 ],
 [
  "AE=AB/2，DF=CD/2，且 AE∥DF，故 AEFD 佔原圖一半底、同高。",
  "AE=AB/2 and DF=CD/2, with AE∥DF. AEFD has half the base and the same height."
 ],
 [
  "比較底與高，或利用兩個全等的平行四邊形。",
  "Compare base and height, or use two congruent parallelograms."
 ],
 [
  "輸入決定唯一輸出。",
  "Each input determines one output."
 ],
 [
  "初始量是常數項。",
  "The initial quantity is the constant term."
 ],
 [
  "由情境限制自變量。",
  "Use the context to restrict the independent variable."
 ],
 [
  "分鐘",
  "minutes"
 ],
 [
  "基本收費不能重複計算。",
  "Do not count the basic charge repeatedly."
 ],
 [
  "在 y 軸上 x=0。",
  "On the y-axis, x=0."
 ],
 [
  "截距由 x=0 求得。",
  "Find the intercept by setting x=0."
 ],
 [
  "縱坐標增量除以橫坐標增量。",
  "Divide the change in y by the change in x."
 ],
 [
  "在 x 軸上 y=0。",
  "On the x-axis, y=0."
 ],
 [
  "零點對應 y=0。",
  "A zero corresponds to y=0."
 ],
 [
  "把兩個收費模型的函數值設為相等。",
  "Set the two cost functions equal."
 ],
 [
  "次",
  "uses"
 ],
 [
  "五個數已排序。",
  "The five values are already ordered."
 ],
 [
  "中位數取決於排序後的位置。",
  "The median depends on position after sorting."
 ],
 [
  "權重總和須為 1。",
  "The weights must sum to 1."
 ],
 [
  "分",
  "points"
 ],
 [
  "先求平均數，再求離均差平方的平均。",
  "Find the mean, then average the squared deviations."
 ],
 [
  "平均數乘個數得到總和。",
  "Mean multiplied by count gives the sum."
 ],
 [
  "交集取共同部分。",
  "An intersection contains the common part."
 ],
 [
  "兩項人數相加時，共同部分被算兩次。",
  "Adding the two counts includes the overlap twice."
 ],
 [
  "用容斥原理。",
  "Use inclusion–exclusion."
 ],
 [
  "補集須相對於已知全集。",
  "A complement is relative to the stated universal set."
 ],
 [
  "把包含關係轉成左右端點的限制。",
  "Turn containment into conditions on both endpoints."
 ],
 [
  "反例要使原來的不等式不成立，邊界也要計算。",
  "A counterexample makes the original inequality false; include the boundary."
 ],
 [
  "充分但不必要",
  "Sufficient but not necessary"
 ],
 [
  "必要但不充分",
  "Necessary but not sufficient"
 ],
 [
  "充要",
  "Necessary and sufficient"
 ],
 [
  "既不充分也不必要",
  "Neither necessary nor sufficient"
 ],
 [
  "正向成立。",
  "The forward implication holds."
 ],
 [
  "分別檢驗兩個方向。",
  "Check the two implication directions separately."
 ],
 [
  "全稱量詞改為存在量詞。",
  "Change the universal quantifier to an existential quantifier."
 ],
 [
  "同時把 > 否定為 ≤。",
  "Also negate > to ≤."
 ],
 [
  "否定量詞與條件，兩者都要改。",
  "Negate both the quantifier and the condition."
 ],
 [
  "必要但不充分表示反方向成立而正方向不總成立。",
  "Necessary but not sufficient means the reverse implication holds, while the forward implication need not."
 ],
 [
  "先確定兩根之間，再排除端點。",
  "Locate the interval between the roots, then exclude the endpoints."
 ],
 [
  "令二次式的最小值不小於零。",
  "Require the quadratic's minimum to be nonnegative."
 ],
 [
  "兩邊乘 −1 要反向，得到乘積≤0。",
  "Multiplying by −1 reverses the inequality, giving product≤0."
 ],
 [
  "先處理負的首項係數。",
  "Handle the negative leading coefficient first."
 ],
 [
  "端點是方程的兩根。",
  "The endpoints are roots of the equation."
 ],
 [
  "把解集邊界當作方程的根。",
  "Use the solution-set boundaries as roots of the equation."
 ],
 [
  "一次除式 x−a 對應代入 a。",
  "The divisor x−a corresponds to substituting a."
 ],
 [
  "令 f(a)=0。",
  "Set f(a)=0."
 ],
 [
  "餘式定理可直接作用於整體。",
  "Apply the remainder theorem directly to the complete expression."
 ],
 [
  "二次除式的餘式最多一次，先設 px+q。",
  "A quadratic divisor has a remainder of degree at most one; start with px+q."
 ],
 [
  "先算括號內的平方。",
  "Evaluate the square of the parenthesised value first."
 ],
 [
  "複合函數由內到外。",
  "Evaluate a composition from the inside out."
 ],
 [
  "取所有限制的交集。",
  "Intersect all the restrictions."
 ],
 [
  "使用奇函數定義；由題式可知 f(0) 存在。",
  "Use the definition of oddness; the question ensures f(0) exists."
 ],
 [
  "把對數式改寫成指數式。",
  "Rewrite the logarithmic equation as an exponential equation."
 ],
 [
  "先列真數條件。",
  "State the positive-argument condition first."
 ],
 [
  "可直接求對數，也可用商法則。",
  "Evaluate directly or use the quotient rule for logarithms."
 ],
 [
  "將倍增過程寫成指數模型，再比較指數。",
  "Model repeated multiplication exponentially, then compare exponents."
 ],
 [
  "度數乘 π/180。",
  "Multiply degrees by π/180."
 ],
 [
  "180° 對應 π 弧度。",
  "180° corresponds to π radians."
 ],
 [
  "周期=2π/|ω|。",
  "Period=2π/|ω|."
 ],
 [
  "振幅不影響周期。",
  "Amplitude does not affect the period."
 ],
 [
  "題目求平方，毋須開根。",
  "The question asks for a square, so no square root is needed."
 ],
 [
  "以 cos²x=1−sin²x 代入。",
  "Substitute cos²x=1−sin²x."
 ],
 [
  "把兩個三角函數平方化成一個變量。",
  "Express both squared trigonometric terms using one variable."
 ],
 [
  "內積為对應坐標乘積之和。",
  "The dot product is the sum of corresponding coordinate products."
 ],
 [
  "內積結果是一個數。",
  "A dot product is a scalar."
 ],
 [
  "用內積等於零。",
  "Set the dot product to zero."
 ],
 [
  "非零向量共線時坐標成比例。",
  "Collinear nonzero vectors have proportional coordinates."
 ],
 [
  "展開內積：c²|u|²−2c(u·v)+|v|²。",
  "Expand the dot product: c²|u|²−2c(u·v)+|v|²."
 ],
 [
  "向量模的平方可展開成內積。",
  "A vector's squared magnitude expands through dot products."
 ],
 [
  "兩邊與夾角可求面積。",
  "Two sides and their included angle determine the area."
 ],
 [
  "餘弦定理 c²=a²+b²−2ab cos C。",
  "Cosine rule: c²=a²+b²−2ab cos C."
 ],
 [
  "分清角與對邊。",
  "Match each angle with its opposite side."
 ],
 [
  "用餘弦定理反求角的餘弦，先找最長邊。",
  "Identify the longest side, then use the cosine rule to find its opposite angle's cosine."
 ],
 [
  "高度必須垂直底面。",
  "The height must be perpendicular to the base."
 ],
 [
  "球表面積=4πr²。",
  "Sphere surface area=4πr²."
 ],
 [
  "區分球表面積與球體積。",
  "Distinguish sphere surface area from volume."
 ],
 [
  "側面積用母線，體積用高。",
  "Curved area uses slant height; volume uses perpendicular height."
 ],
 [
  "長度、面積、體積的倍率分別是一、二、三次方。",
  "Lengths, areas and volumes scale with the first, second and third powers respectively."
 ],
 [
  "先求比例常數。",
  "Find the constant of proportionality first."
 ],
 [
  "反變保持乘積不變。",
  "Inverse variation keeps the product constant."
 ],
 [
  "把聯變寫成兩變量的乘積。",
  "Write joint variation as a product of the two variables."
 ],
 [
  "先用兩組數據求固定部分與變動部分。",
  "Use both data pairs to find the fixed and varying components."
 ],
 [
  "共有因式 x 的次數取較小值。",
  "Take the smaller exponent of the common factor x."
 ],
 [
  "公因式須同時整除兩式。",
  "A common factor must divide both expressions."
 ],
 [
  "最小公倍式需包含每式所有因式。",
  "The least common multiple contains all factors required by either expression."
 ],
 [
  "不共有的因式不取。",
  "Do not include factors that are not common."
 ],
 [
  "首一化後，GCD×LCM 等於兩式乘積的首一版本。",
  "After making them monic, GCD×LCM equals their monic product."
 ],
 [
  "用乘積的因式次數關係。",
  "Use the relationship between the factor degrees of the product."
 ],
 [
  "清分母後再代特殊值。",
  "Clear denominators before substituting a special value."
 ],
 [
  "左邊 x 項係數為 0，因此 A+B=0。",
  "The left-side x-coefficient is zero, so A+B=0."
 ],
 [
  "比較 x 項係數。",
  "Compare coefficients of x."
 ],
 [
  "在恆等式代入其中一個根。",
  "Substitute one root into the identity."
 ],
 [
  "重複因式分解須包括一次和二次分母。",
  "A repeated factor requires terms with both first and second power denominators."
 ],
 [
  "AB 同時垂直平面內相交的 BC 與 BB′，因此 AB 垂直該平面。",
  "AB is perpendicular to intersecting lines BC and BB′ in the plane, so it is perpendicular to the plane."
 ],
 [
  "點到平面距離是垂線段的長度。",
  "Point-to-plane distance is the perpendicular segment's length."
 ],
 [
  "先在底面用勾股，再與垂直高度組成直角三角形。",
  "Use Pythagoras in the base, then combine that diagonal with the perpendicular height."
 ],
 [
  "異面",
  "Skew"
 ],
 [
  "平行",
  "Parallel"
 ],
 [
  "相交",
  "Intersecting"
 ],
 [
  "重合",
  "Coincident"
 ],
 [
  "AB 在底面，CC′ 是不經 A、B 的豎直棱。",
  "AB lies in the base; CC′ is a vertical edge through neither A nor B."
 ],
 [
  "兩線既不相交又不平行，因此異面。",
  "The lines neither intersect nor are parallel, so they are skew."
 ],
 [
  "判定是否共面，不能只看兩線不相交。",
  "Check coplanarity; nonintersection alone is insufficient."
 ],
 [
  "把最短距離轉成垂線段，或用坐標。",
  "Find a perpendicular segment or use coordinates."
 ],
 [
  "已知 a<0，以下哪個結論必定成立？",
  "Given a<0, which statement must hold?"
 ],
 [
  "負數的絕對值是它的相反數，所以 |a|=−a>0。",
  "A negative number's absolute value is its opposite, so |a|=−a>0."
 ],
 [
  "用 a=−2 試驗，再回到定義。",
  "Try a=−2, then justify using the definition."
 ],
 [
  "兩個固定點 A、B 在數軸上，坐標為 −3、5。點 P 可任意選。小明說：「只有中點才能令 PA+PB 最小。」判斷並完整說明最小值何時取得。",
  "Fixed points A and B have number-line coordinates −3 and 5. P is arbitrary. A student claims only the midpoint minimises PA+PB. Assess the claim and explain every position giving the minimum."
 ],
 [
  "A、B 間距為 8。",
  "The distance between A and B is 8."
 ],
 [
  "P 在 [−3,5] 上時，PA+PB=(x+3)+(5−x)=8。",
  "For P in [−3,5], PA+PB=(x+3)+(5−x)=8."
 ],
 [
  "P 在區間外時，距離和為 8 加上到較近端點距離的兩倍，故大於 8。",
  "Outside the interval, the sum is 8 plus twice the distance to the nearer endpoint, hence greater than 8."
 ],
 [
  "所有位於線段 AB 上的 P 都可取最小值，不只有中點。",
  "Every P on segment AB minimises the sum, not just the midpoint."
 ],
 [
  "指出最小值為 8",
  "State the minimum value 8"
 ],
 [
  "給出整個區間（含端點）",
  "Give the whole interval, including endpoints"
 ],
 [
  "解釋區間外為何更大",
  "Explain why the sum is greater outside it"
 ],
 [
  "把數軸分成三段討論。",
  "Discuss the three regions of the number line."
 ],
 [
  "甲說 −4²=16；乙說 (−4)²=16。誰的計算正確？",
  "Student A says −4²=16; student B says (−4)²=16. Who is correct?"
 ],
 [
  "只有乙",
  "Only B"
 ],
 [
  "只有甲",
  "Only A"
 ],
 [
  "兩人都正確",
  "Both are correct"
 ],
 [
  "兩人都不正確",
  "Neither is correct"
 ],
 [
  "辨認乘方的底數。",
  "Identify the base of the power."
 ],
 [
  "某商店三天的收支淨額依次為 −120、+200、−50 元。小組認為「合共增加 30 元，所以每天都賺錢」。請檢查運算及結論，並提出一個更準確的描述。",
  "A shop's daily net transactions are −120, +200 and −50 currency units. A group says 'The total increased by 30, so the shop made money every day.' Check the calculation and conclusion, and give a more accurate description."
 ],
 [
  "淨變動=−120+200−50=30 元。",
  "Net change=−120+200−50=30 currency units."
 ],
 [
  "第一、三天為負淨額；總和為正不代表每項都為正。",
  "Days one and three have negative net changes; a positive total does not make every term positive."
 ],
 [
  "可說三天合計淨增加 30 元，其中兩天淨減少。",
  "The net increase over three days is 30, with net decreases on two days."
 ],
 [
  "算出有符號的總和",
  "Calculate the signed total"
 ],
 [
  "區分總量與每日數據",
  "Distinguish the total from individual daily data"
 ],
 [
  "以具體數據修正說法",
  "Use specific data to correct the claim"
 ],
 [
  "正的總和能決定每一項的符號嗎？",
  "Does a positive sum determine the sign of every term?"
 ],
 [
  "甲買 x 本每本 6 元的筆記本，再用一張全單減 5 元券。應付金額（x≥1）是？",
  "A student buys x notebooks at 6 each, then uses one voucher reducing the whole order by 5. What is the amount payable for x≥1?"
 ],
 [
  "減 5 元只發生一次，故總額是 6x−5。",
  "The reduction of 5 occurs once, so the total is 6x−5."
 ],
 [
  "區分「每本減」與「全單減」。",
  "Distinguish a discount per book from one for the whole order."
 ],
 [
  "校慶租桌，甲方案每張 12 元；乙方案固定運送費 40 元，每張 8 元。請列出兩個模型，給出一個乙較便宜的整數張數例子，並說明為何不能只比較每張單價。",
  "For a school event, table hire A costs 12 per table; B charges delivery of 40 plus 8 per table. Form both models, give an integer table count for which B is cheaper, and explain why unit prices alone are insufficient."
 ],
 [
  "設張數 n 為正整數，甲 A=12n，乙 B=40+8n。",
  "Let n be the positive integer table count: A=12n, B=40+8n."
 ],
 [
  "乙較便宜須 40+8n<12n，即 n>10。",
  "B is cheaper when 40+8n<12n, namely n>10."
 ],
 [
  "例如 11 張：甲132元，乙128元；少量租用時固定費影響選擇。",
  "For 11 tables, A costs 132 and B 128. For small orders, the fixed fee affects the choice."
 ],
 [
  "清楚定義張數與費用",
  "Define the table count and costs clearly"
 ],
 [
  "兩式保留固定費",
  "Retain the fixed fee in the models"
 ],
 [
  "用具體數據支持建議",
  "Support a recommendation with specific data"
 ],
 [
  "先用 1 張與 20 張測試想法。",
  "Test your idea with 1 and 20 tables first."
 ],
 [
  "若 3x²y 與 axʳyˢ 是非零同類項，必須有？",
  "If 3x²y and axʳyˢ are nonzero like terms, what must hold?"
 ],
 [
  "r+s=3 就足夠",
  "r+s=3 is sufficient"
 ],
 [
  "同類項要求相同字母的指數逐一相等，係數不必相等。",
  "Like terms require each variable exponent to match; coefficients need not match."
 ],
 [
  "同類項比較的不是係數。",
  "Coefficients do not determine whether terms are alike."
 ],
 [
  "有人把 2x−(3x−4) 化簡為 −x−4。指出錯誤，寫出正確化簡，並用一個數值代入檢查。",
  "Someone simplifies 2x−(3x−4) to −x−4. Identify the error, simplify correctly, and check with one numerical substitution."
 ],
 [
  "括號前的負號乘到兩項：2x−3x+4=−x+4。",
  "The minus multiplies both terms: 2x−3x+4=−x+4."
 ],
 [
  "例如 x=0，原式=4，正確化簡=4，錯誤式=−4。",
  "At x=0, the original and correct expressions both give 4; the incorrect one gives −4."
 ],
 [
  "代一個值可推翻錯式；一般等式由去括號法則保證。",
  "One substitution can refute an incorrect identity; the general identity follows from the bracket-expansion rule."
 ],
 [
  "負號分配到每一項",
  "Distribute the minus sign to every term"
 ],
 [
  "寫出 −x+4",
  "Obtain −x+4"
 ],
 [
  "以代入作檢查並分清檢查與證明",
  "Use substitution as a check and distinguish checking from proof"
 ],
 [
  "把減去整個括號改成加其相反式。",
  "Replace subtraction of the bracket by addition of its opposite expression."
 ],
 [
  "解 2(x−3)=2x+1 時得到 −6=1，表示？",
  "Solving 2(x−3)=2x+1 produces −6=1. What does this mean?"
 ],
 [
  "方程無解",
  "The equation has no solution"
 ],
 [
  "任意實數皆為解",
  "Every real number is a solution"
 ],
 [
  "消去 x 後得到矛盾，沒有任何 x 可成立。",
  "Eliminating x produces a contradiction, so no x can satisfy the equation."
 ],
 [
  "若未知數消失，要判斷餘下等式真偽。",
  "If the unknown disappears, decide whether the remaining equality is true."
 ],
 [
  "一件商品標價 250 元，打八折後仍比成本高 25%。學生把成本算成 200×75%=150 元。請糾正，並解釋兩個百分率的基準。",
  "An item marked at 250 is sold at 80% of that price, still 25% above cost. A student calculates cost as 200×75%=150. Correct this and explain the reference amount for each percentage."
 ],
 [
  "售價=250×80%=200 元，折扣以標價為基準。",
  "Selling price=250×80%=200; the discount is based on the marked price."
 ],
 [
  "設成本 x，200=1.25x，故 x=160 元。",
  "For cost x, 200=1.25x, giving x=160."
 ],
 [
  "利潤率 25% 以成本為基準，不能把售價直接減去25%。",
  "The 25% profit uses cost as its reference, so it cannot be removed by taking 25% off selling price."
 ],
 [
  "計出售價200",
  "Calculate selling price 200"
 ],
 [
  "列式並求成本160",
  "Form an equation and find cost 160"
 ],
 [
  "分清標價與成本兩個基準",
  "Distinguish the marked-price and cost reference amounts"
 ],
 [
  "「比成本高25%」應先寫成等量關係。",
  "First express '25% above cost' as an equality."
 ],
 [
  "兩條不同射線有同一端點，形成的角為 40°。其角平分線把它分成？",
  "Two distinct rays with a shared endpoint form a 40° angle. Its bisector divides it into what?"
 ],
 [
  "兩個20°角",
  "Two 20° angles"
 ],
 [
  "兩個40°角",
  "Two 40° angles"
 ],
 [
  "一個10°及一個30°角",
  "One 10° and one 30° angle"
 ],
 [
  "兩條互相垂直的射線",
  "Two perpendicular rays"
 ],
 [
  "角平分線使兩部分角相等，且總和仍是40°。",
  "A bisector gives equal parts whose sum remains 40°."
 ],
 [
  "同時檢查「相等」與「總和」。",
  "Check both equality and the total."
 ],
 [
  "A、B、C 共線，AB=4、BC=6，沒有給出三點順序。能否斷定 AC=10？列出全部可能並說明。",
  "A, B and C are collinear with AB=4 and BC=6, but their order is unspecified. Must AC=10? Give every possibility and explain."
 ],
 [
  "若 B 在 A、C 之間，AC=4+6=10。",
  "If B lies between A and C, AC=4+6=10."
 ],
 [
  "若 A 在 B、C 之間，AC=6−4=2。",
  "If A lies between B and C, AC=6−4=2."
 ],
 [
  "C 不可能在 A、B 之間，因為 BC>BA。",
  "C cannot lie between A and B because BC>BA."
 ],
 [
  "故 AC 可為10或2，缺少順序條件不能唯一決定。",
  "Thus AC may be 10 or 2; without an order condition it is not unique."
 ],
 [
  "討論點的順序",
  "Discuss the point order"
 ],
 [
  "列出10與2",
  "List 10 and 2"
 ],
 [
  "排除不可能的位置",
  "Exclude the impossible arrangement"
 ],
 [
  "先畫不同順序的數軸。",
  "Sketch different point orders on a number line."
 ],
 [
  "兩直線被第三條直線所截，一對內錯角相等，可推出？",
  "Two lines are cut by a third. If a pair of alternate interior angles is equal, what follows?"
 ],
 [
  "兩直線平行",
  "The two lines are parallel"
 ],
 [
  "兩直線垂直",
  "The two lines are perpendicular"
 ],
 [
  "兩角必為90°",
  "Both angles must be 90°"
 ],
 [
  "任意兩角都相等",
  "Every pair of angles is equal"
 ],
 [
  "內錯角相等是判定兩直線平行的充分條件。",
  "Equal alternate interior angles are sufficient to establish parallel lines."
 ],
 [
  "區分平行線的判定與性質。",
  "Distinguish a criterion for parallelism from a consequence of it."
 ],
 [
  "兩直線被截線所截，一對同旁內角分別為 72° 和 108°。先判斷是否平行，再說明若第二角改成 110°，判斷會有何改變。",
  "Same-side interior angles are 72° and 108°. Decide whether the lines are parallel, then explain what changes if the second angle becomes 110°."
 ],
 [
  "72°+108°=180°，同旁內角互補，故平行。",
  "72°+108°=180°; the same-side interior angles are supplementary, so the lines are parallel."
 ],
 [
  "改為110°時，角和182°，不互補。",
  "With 110°, the sum is 182°, not supplementary."
 ],
 [
  "若仍平行則同旁內角必互補，產生矛盾，因此不平行。",
  "Parallel lines would require supplementary angles, giving a contradiction; therefore the lines are not parallel."
 ],
 [
  "辨認指定的角對",
  "Identify the specified angle pair"
 ],
 [
  "用互補判定平行",
  "Use supplementarity to establish parallelism"
 ],
 [
  "能以平行的必要性解釋改動後結論",
  "Use a necessary property of parallelism to explain the changed conclusion"
 ],
 [
  "角對的位置與角度都要確認。",
  "Check both angle positions and measures."
 ],
 [
  "對任何實數 a，√(a²) 等於？",
  "For every real a, what is √(a²)?"
 ],
 [
  "算術平方根非負，故是 |a|；a<0 時不等於 a。",
  "The principal root is nonnegative, so it equals |a|, not a when a<0."
 ],
 [
  "用 a=−3 檢查。",
  "Check with a=−3."
 ],
 [
  "同學說：「√2≈1.414，所以 √2=1.414。」說明錯在哪裡，並只用平方比較證明 1.41<√2<1.42。",
  "A student says '√2≈1.414, so √2=1.414.' Explain the error and prove 1.41<√2<1.42 using only comparisons of squares."
 ],
 [
  "近似值不等於精確值，1.414²=1.999396≠2。",
  "Approximation is not equality: 1.414²=1.999396≠2."
 ],
 [
  "正數上平方保持大小關係，故1.41<√2<1.42。",
  "Squaring preserves order for positive numbers, giving 1.41<√2<1.42."
 ],
 [
  "區分等號與約等號",
  "Distinguish equality from approximation"
 ],
 [
  "算出兩端平方",
  "Calculate the endpoint squares"
 ],
 [
  "解釋正數範圍內比較有效",
  "Explain why the comparison is valid for positive numbers"
 ],
 [
  "用相鄰正數的平方夾住2。",
  "Bracket 2 between squares of neighbouring positive decimals."
 ],
 [
  "點 P 到 x 軸距離是3，到 y 軸距離是2，且在第二象限。P 是？",
  "P is 3 units from the x-axis and 2 units from the y-axis, in quadrant II. What is P?"
 ],
 [
  "到x軸距離=|y|，到y軸距離=|x|；第二象限x<0、y>0。",
  "Distance to the x-axis is |y| and to the y-axis is |x|; quadrant II has x<0 and y>0."
 ],
 [
  "距離與坐標值的符號分開考慮。",
  "Consider distances separately from coordinate signs."
 ],
 [
  "矩形的三個頂點 A(−2,1)、B(4,1)、C(4,5) 按相鄰順序排列。求第四頂點 D 及面積，並解釋平移整個矩形後面積為何不變。",
  "Three consecutive vertices of a rectangle are A(−2,1), B(4,1), C(4,5). Find D and the area, and explain why translating the entire rectangle preserves area."
 ],
 [
  "AB水平長6，BC垂直長4，D=(−2,5)。",
  "AB is horizontal of length 6 and BC vertical of length 4; D=(−2,5)."
 ],
 [
  "面積=6×4=24。",
  "Area=6×4=24."
 ],
 [
  "每個點加相同位移，坐標差不變，因此邊長與面積不變。",
  "Adding the same displacement to every point preserves coordinate differences, hence lengths and area."
 ],
 [
  "求D及兩邊長",
  "Find D and both side lengths"
 ],
 [
  "算出面積24",
  "Calculate area 24"
 ],
 [
  "用坐標差說明平移不改面積",
  "Use coordinate differences to explain translation-invariant area"
 ],
 [
  "平移改坐標，但兩點之間的差怎樣變？",
  "Translation changes coordinates. What happens to the differences between two points?"
 ],
 [
  "方程組 x+y=4、2x+2y=8 的解有多少組？",
  "How many solution pairs satisfy x+y=4 and 2x+2y=8?"
 ],
 [
  "無限多組",
  "Infinitely many"
 ],
 [
  "恰一組",
  "Exactly one"
 ],
 [
  "恰兩組",
  "Exactly two"
 ],
 [
  "沒有",
  "None"
 ],
 [
  "第二式是第一式的兩倍，沒有增加新限制。",
  "The second equation is twice the first and adds no new restriction."
 ],
 [
  "兩個方程是否提供獨立條件？",
  "Do the equations provide independent conditions?"
 ],
 [
  "雞兔共12隻、共34隻腳。請用方程組及「假設全是雞」兩種方法求解，並解釋兩方法的共同想法。",
  "There are 12 chickens and rabbits with 34 legs in total. Solve using simultaneous equations and by assuming all are chickens, then explain the shared idea."
 ],
 [
  "設雞x、兔y：x+y=12，2x+4y=34；消去x得2y=10，y=5、x=7。",
  "Let chicken count x and rabbit count y: x+y=12, 2x+4y=34. Eliminating x gives 2y=10, so y=5 and x=7."
 ],
 [
  "若全是雞則24腳，比34少10腳；每改一隻為兔多2腳，因此5隻兔。",
  "All chickens would give 24 legs, 10 short of 34. Replacing one by a rabbit adds 2 legs, so there are 5 rabbits."
 ],
 [
  "兩法都先扣除每隻2腳的共同部分，再找多出的腳。",
  "Both methods remove the shared two legs per animal before analysing the excess."
 ],
 [
  "列兩個獨立等量關係",
  "Form two independent equalities"
 ],
 [
  "兩法都得雞7兔5",
  "Both methods give 7 chickens and 5 rabbits"
 ],
 [
  "連結消元與假設法",
  "Connect elimination with the all-chickens assumption"
 ],
 [
  "把第二式減去第一式的兩倍。",
  "Subtract twice the first equation from the second."
 ],
 [
  "若 a<b，以下必定成立的是？",
  "If a<b, which statement must hold?"
 ],
 [
  "乘負數使不等號反向；其餘需要額外條件（倒數還須非零）。",
  "Multiplication by a negative reverses the inequality. Other statements need extra conditions; reciprocals also require nonzero values."
 ],
 [
  "先檢查運算是否會改變大小方向。",
  "Check whether the operation changes order direction."
 ],
 [
  "租巴士每輛40座，老師2人，學生人數n不超過118。有人說「總是要3輛」。請寫出需要剛好3輛（以最少車數為準）的學生整數人數範圍。",
  "Each bus seats 40. There are 2 teachers and n students, with n≤118. Someone says 'We always need 3 buses.' Find the integer student counts requiring exactly 3 buses, using the minimum number possible."
 ],
 [
  "剛好3輛表示2輛不夠而3輛足夠：80<n+2≤120。",
  "Exactly 3 means 2 are insufficient but 3 suffice: 80<n+2≤120."
 ],
 [
  "故78<n≤118，整數n為79至118。",
  "Thus 78<n≤118, so integer n runs from 79 to 118."
 ],
 [
  "例如n=50時只需2輛，故原說法太廣。",
  "For n=50 only 2 buses are needed, so the original claim is too broad."
 ],
 [
  "同時表達不足與足夠",
  "Express both insufficiency and sufficiency"
 ],
 [
  "含正確開閉端點",
  "Use correct open and closed endpoints"
 ],
 [
  "轉為學生整數範圍79–118",
  "Convert to integer student counts 79–118"
 ],
 [
  "「最多3輛」與「剛好3輛」有何不同？",
  "How do 'at most 3 buses' and 'exactly 3 buses' differ?"
 ],
 [
  "想估計全校學生每日閱讀時間，哪個抽樣方案較合適？",
  "Which sampling plan best estimates the daily reading time of the whole school's students?"
 ],
 [
  "從各年級名冊按比例隨機抽人",
  "Sample randomly from each year's list in proportion to its size"
 ],
 [
  "只問圖書館內的學生",
  "Ask only students in the library"
 ],
 [
  "只問讀書會成員",
  "Ask only reading-club members"
 ],
 [
  "只問最早到校的人",
  "Ask only the earliest arrivals"
 ],
 [
  "按年級涵蓋總體並隨機抽樣，較能減少明顯選取偏差。",
  "Covering all years with random sampling reduces obvious selection bias."
 ],
 [
  "樣本是否涵蓋想了解的總體？",
  "Does the sample cover the population you want to understand?"
 ],
 [
  "校刊在籃球隊訪問20人，有18人喜歡籃球，便刊登「全校90%學生喜歡籃球」。請檢查比例和推論，提出一個可行的改良調查。",
  "A school magazine interviews 20 basketball-team members; 18 like basketball. It reports '90% of all students like basketball.' Check the proportion and inference, and propose a practical improved survey."
 ],
 [
  "18/20=90%，樣本比例計算正確。",
  "18/20=90%, so the sample proportion is calculated correctly."
 ],
 [
  "籃球隊成員不是全校的代表性樣本，不能直接推廣。",
  "Basketball-team members are not representative of the whole school; the result cannot be extended directly."
 ],
 [
  "可從各年級名冊按比例隨機抽樣，統一問題，記錄未回覆情況，再將結果標作估計。",
  "Sample randomly in proportion from each year's list, ask the same question, record nonresponse and label the result an estimate."
 ],
 [
  "分清計算正確與推論可靠",
  "Distinguish a correct calculation from a reliable inference"
 ],
 [
  "指出選取偏差",
  "Identify selection bias"
 ],
 [
  "提出明確可行的改良方法",
  "Propose a specific, feasible improvement"
 ],
 [
  "只增加籃球隊受訪人數能解決偏差嗎？",
  "Would interviewing more basketball-team members remove the bias?"
 ],
 [
  "兩邊長為4、7，第三邊為x。正確限制是？",
  "Two sides have lengths 4 and 7, and the third is x. What is the correct restriction?"
 ],
 [
  "三角形任意兩邊和大於第三邊，整理為兩邊差<x<兩邊和。",
  "The sum of any two sides exceeds the third: difference of two sides < x < their sum."
 ],
 [
  "等號會令三點共線。",
  "Equality would make the three points collinear."
 ],
 [
  "用長度3、4、7的木條能否圍成三角形？若只可把7的木條剪短成正整數長度，列出所有可行長度並說明邊界。",
  "Can rods of lengths 3, 4 and 7 form a triangle? If only the 7-unit rod may be shortened to a positive integer, list every feasible length and explain the boundaries."
 ],
 [
  "3+4=7，原來只能共線，不能圍成三角形。",
  "Since 3+4=7, the original rods lie in a line and cannot form a triangle."
 ],
 [
  "剪短後長度c須 |4−3|<c<4+3，即1<c<7。",
  "The shortened length c requires |4−3|<c<4+3, namely 1<c<7."
 ],
 [
  "正整數c為2、3、4、5、6；1和7都是退化邊界。",
  "The positive integers are 2, 3, 4, 5, 6. Both 1 and 7 are degenerate boundaries."
 ],
 [
  "判斷原組不成立",
  "Reject the original arrangement"
 ],
 [
  "寫出嚴格不等式",
  "State the strict inequality"
 ],
 [
  "列出全部五個整數長度",
  "List all five integer lengths"
 ],
 [
  "不只檢查上限，還要檢查兩邊之差。",
  "Check both the upper bound and the difference of the other sides."
 ],
 [
  "以下哪組資料足以判定兩個三角形全等？",
  "Which data suffice to prove two triangles congruent?"
 ],
 [
  "兩邊及其夾角分別相等",
  "Two corresponding sides and their included angle are equal"
 ],
 [
  "三個角分別相等",
  "Three corresponding angles are equal"
 ],
 [
  "兩邊及其中一邊對角分別相等",
  "Two sides and an angle opposite one of them are equal"
 ],
 [
  "面積相等",
  "Equal areas"
 ],
 [
  "SAS要求角是已知兩邊的夾角；AAA只保證相似，SSA一般不夠。",
  "SAS requires the included angle. AAA proves only similarity; SSA is generally insufficient."
 ],
 [
  "角的位置是關鍵。",
  "The angle's position is crucial."
 ],
 [
  "AB=AC，D是BC中點。證明AD⊥BC，並指出證明中哪一步利用D是中點。",
  "AB=AC and D is the midpoint of BC. Prove AD⊥BC and identify where the midpoint condition is used."
 ],
 [
  "AB=AC、BD=CD（D是中點）、AD公共，故△ABD≅△ACD（SSS）。",
  "AB=AC, BD=CD because D is the midpoint, and AD is shared. Hence △ABD≅△ACD by SSS."
 ],
 [
  "對應角∠ADB=∠ADC。",
  "Corresponding angles give ∠ADB=∠ADC."
 ],
 [
  "B、D、C共線，兩角和180°，故各90°，AD⊥BC。",
  "B, D and C are collinear, so the angles sum to 180°; each is 90°, giving AD⊥BC."
 ],
 [
  "列完整SSS條件",
  "State every SSS condition"
 ],
 [
  "由全等得對應角相等",
  "Use congruence to obtain equal corresponding angles"
 ],
 [
  "配合平角推出垂直",
  "Combine with a straight angle to prove perpendicularity"
 ],
 [
  "等角還須配合甚麼條件才能各是90°？",
  "What condition, besides equal angles, makes each angle 90°?"
 ],
 [
  "線段AB的垂直平分線上的任意點P，都滿足？",
  "Every point P on the perpendicular bisector of AB satisfies which condition?"
 ],
 [
  "P是AB的中點",
  "P is the midpoint of AB"
 ],
 [
  "垂直平分線上各點到兩端點等距，但不一定在線段上。",
  "Points on the perpendicular bisector are equidistant from the endpoints, but need not lie on the segment."
 ],
 [
  "性質描述的是距離。",
  "The property concerns distances."
 ],
 [
  "A(2,3)、B(6,3)，P在x軸。設計從A經P到B的最短路徑，求P及最短長，並解釋反射為何有效。",
  "A(2,3), B(6,3), and P lies on the x-axis. Find the shortest route A–P–B, its point P and length, explaining why reflection works."
 ],
 [
  "把B反射為B′(6,−3)，對x軸上P有PB=PB′。",
  "Reflect B to B′(6,−3). For P on the x-axis, PB=PB′."
 ],
 [
  "AP+PB=AP+PB′≥AB′；線段AB′與x軸交於P(4,0)。",
  "AP+PB=AP+PB′≥AB′; segment AB′ meets the x-axis at P(4,0)."
 ],
 [
  "最短長=√(4²+6²)=√52=2√13。",
  "Shortest length=√(4²+6²)=√52=2√13."
 ],
 [
  "反射並說明等距",
  "Reflect and explain equal distances"
 ],
 [
  "用兩點之間線段最短",
  "Use the shortest segment between two points"
 ],
 [
  "求P及精確最短長",
  "Find P and the exact shortest length"
 ],
 [
  "反射後把折線拉直。",
  "After reflection, straighten the broken path."
 ],
 [
  "由 (a+b)²=a²+2ab+b² 可知 (a+b)²=a²+b² 何時成立？",
  "Using (a+b)²=a²+2ab+b², when does (a+b)²=a²+b² hold?"
 ],
 [
  "所有a、b",
  "For all a and b"
 ],
 [
  "兩邊之差為2ab，須等於0，故a或b為0。",
  "The difference is 2ab, which must be zero, so a or b is zero."
 ],
 [
  "比較缺少的交叉項。",
  "Consider the missing cross term."
 ],
 [
  "同學說「邊長增加2，正方形面積只增加4」。以原邊長x>0畫想像中的分割，列式並解釋新增面積的每一部分。",
  "A student says 'Increasing a square's side by 2 increases its area only by 4.' For original side x>0, describe a partition, form an expression and explain each part of the extra area."
 ],
 [
  "新面積(x+2)²，舊面積x²，差為4x+4。",
  "New area=(x+2)²; old area=x²; difference=4x+4."
 ],
 [
  "增加兩個x×2的長方形及一個2×2小正方形。",
  "Add two x×2 rectangles and one 2×2 square."
 ],
 [
  "因此一般增加4x+4，並非只有角落的4。",
  "The general increase is 4x+4, not just the corner area 4."
 ],
 [
  "正確展開與相減",
  "Expand and subtract correctly"
 ],
 [
  "兩個長方形加一個正方形",
  "Identify two rectangles and one square"
 ],
 [
  "把各面積連到代數項",
  "Connect each area with an algebraic term"
 ],
 [
  "沿原正方形兩側加寬。",
  "Widen along two sides of the original square."
 ],
 [
  "把 3x²−12 完整因式分解，結果是？",
  "What is the complete factorisation of 3x²−12?"
 ],
 [
  "先提3，再把x²−4用平方差分解。",
  "Factor out 3, then factor x²−4 as a difference of squares."
 ],
 [
  "完整分解要逐層檢查。",
  "Check each factorisation layer for completeness."
 ],
 [
  "解釋為甚麼對每個整數n，(n+1)²−(n−1)²都能被4整除。能否由只測試n=1、2、3就當作證明？",
  "Explain why (n+1)²−(n−1)² is divisible by 4 for every integer n. Is testing only n=1, 2 and 3 a proof?"
 ],
 [
  "平方差分解為[(n+1)−(n−1)][(n+1)+(n−1)]=2×2n=4n。",
  "Difference of squares gives [(n+1)−(n−1)][(n+1)+(n−1)]=2×2n=4n."
 ],
 [
  "n為整數，所以結果是4的整數倍。",
  "Since n is an integer, the result is an integer multiple of 4."
 ],
 [
  "有限例子只能支持猜想，恆等分解才涵蓋每個整數。",
  "Finite examples support a conjecture; the identity covers every integer."
 ],
 [
  "以恆等式得4n",
  "Use an identity to obtain 4n"
 ],
 [
  "使用整數條件",
  "Use the integer condition"
 ],
 [
  "區分例證與一般證明",
  "Distinguish examples from a general proof"
 ],
 [
  "用平方差，比逐項展開更短。",
  "A difference of squares is shorter than expanding every term."
 ],
 [
  "把 (x²−1)/(x−1) 約分後，正確敘述是？",
  "After cancelling factors in (x²−1)/(x−1), which statement is correct?"
 ],
 [
  "等於x+1，但須x≠1",
  "It equals x+1, with x≠1"
 ],
 [
  "等於x+1且x可任意",
  "It equals x+1 for every x"
 ],
 [
  "等於x−1且x≠1",
  "It equals x−1, with x≠1"
 ],
 [
  "原式在x=1時等於2",
  "The original expression equals 2 at x=1"
 ],
 [
  "約掉因式不會使原式的禁值重新可用。",
  "Cancelling a factor does not restore an excluded value to the original expression's domain."
 ],
 [
  "化簡前先記分母限制。",
  "Record the denominator restriction before simplifying."
 ],
 [
  "解方程 (x+1)/(x−2)=3/(x−2)。有人去分母得x=2便作答案。請完成檢驗，說明是否有解。",
  "Solve (x+1)/(x−2)=3/(x−2). Someone clears denominators and answers x=2. Complete the check and decide whether a solution exists."
 ],
 [
  "先要求x≠2。",
  "First require x≠2."
 ],
 [
  "去分母得x+1=3，候選根x=2。",
  "Clearing denominators gives x+1=3, with candidate x=2."
 ],
 [
  "它使原分母為0，必須捨去，所以原方程無解。",
  "This makes the original denominator zero and must be rejected; the equation has no solution."
 ],
 [
  "先列定義限制",
  "State the domain restriction first"
 ],
 [
  "求候選根",
  "Find the candidate root"
 ],
 [
  "代回原限制排除增根",
  "Use the original restriction to reject the extraneous root"
 ],
 [
  "等價變形要保留原定義域。",
  "Equivalent transformations must retain the original domain."
 ],
 [
  "對 a<0，√(9a²) 等於？",
  "For a<0, what is √(9a²)?"
 ],
 [
  "√(9a²)=3|a|，而a<0，所以=−3a。",
  "√(9a²)=3|a|, and a<0, so the result is −3a."
 ],
 [
  "根式的結果必須非負。",
  "A principal square root must be nonnegative."
 ],
 [
  "當1<x<4，化簡√((x−1)²)+√((x−4)²)。再說明x移到4右方後，結果是否仍為同一常數。",
  "For 1<x<4, simplify √((x−1)²)+√((x−4)²). Explain whether it remains the same constant when x moves to the right of 4."
 ],
 [
  "在(1,4)內，|x−1|+|x−4|=(x−1)+(4−x)=3。",
  "Inside (1,4), |x−1|+|x−4|=(x−1)+(4−x)=3."
 ],
 [
  "若x>4，兩項均為正，結果=(x−1)+(x−4)=2x−5>3。",
  "For x>4, both inner expressions are positive, giving (x−1)+(x−4)=2x−5>3."
 ],
 [
  "化簡要根據每個被取絕對值式子的符號。",
  "Simplify according to each inner expression's sign."
 ],
 [
  "先轉絕對值",
  "Convert to absolute values first"
 ],
 [
  "區間內得3",
  "Obtain 3 inside the interval"
 ],
 [
  "區間外得2x−5並比較",
  "Obtain 2x−5 outside and compare"
 ],
 [
  "開平方不能直接刪去平方符號。",
  "Taking a square root does not simply erase the square sign."
 ],
 [
  "三邊長6、8、10的三角形，哪項是判斷它為直角三角形的正確理由？",
  "A triangle has sides 6, 8 and 10. Which is a correct reason that it is right-angled?"
 ],
 [
  "6²+8²=10²，最大邊是10",
  "6²+8²=10², and 10 is the longest side"
 ],
 [
  "最大邊平方等於另兩邊平方和，使用勾股定理逆定理。",
  "The longest side's square equals the sum of the other squares; apply the converse of Pythagoras."
 ],
 [
  "辨認斜邊候選者。",
  "Identify the candidate hypotenuse."
 ],
 [
  "一張長方形海報長80 cm、寬60 cm，要沿對角線加一條支撐條。小明以80+60=140 cm作長度。求正確長度，並說明若長寬都增大50%，支撐條變成多少。",
  "An 80 cm by 60 cm poster needs a diagonal support. A student uses 80+60=140 cm. Find the correct length and its new length if both dimensions increase by 50%."
 ],
 [
  "支撐條是直角三角形斜邊，長√(80²+60²)=100 cm。",
  "The support is a hypotenuse: √(80²+60²)=100 cm."
 ],
 [
  "長寬同乘1.5，對角線也同乘1.5，變成150 cm。",
  "Both dimensions scale by 1.5, so the diagonal also scales by 1.5 to 150 cm."
 ],
 [
  "沿兩條邊走140 cm是折線，並非對角線。",
  "The 140 cm route follows two edges, not the diagonal."
 ],
 [
  "使用勾股而非邊長相加",
  "Use Pythagoras rather than adding side lengths"
 ],
 [
  "算出100 cm",
  "Calculate 100 cm"
 ],
 [
  "以相似或平方和說明150 cm",
  "Use similarity or the square-sum calculation to justify 150 cm"
 ],
 [
  "比較直路與沿邊折路。",
  "Compare the straight route with the broken route along the edges."
 ],
 [
  "平行四邊形再加上哪個條件，一定是矩形？",
  "Which additional condition guarantees that a parallelogram is a rectangle?"
 ],
 [
  "一個內角是90°",
  "One interior angle is 90°"
 ],
 [
  "一組鄰邊相等",
  "A pair of adjacent sides is equal"
 ],
 [
  "對角線互相垂直",
  "The diagonals are perpendicular"
 ],
 [
  "一組對邊相等",
  "A pair of opposite sides is equal"
 ],
 [
  "鄰角互補、對角相等，因此一個直角使四角皆直角。",
  "Adjacent angles are supplementary and opposite angles equal, so one right angle makes all four right angles."
 ],
 [
  "矩形要求的是角。",
  "A rectangle requires a condition on angles."
 ],
 [
  "某四邊形對角線互相平分且垂直。能否必定判定它是正方形？說明至少能判定的形狀，並給一個反例。",
  "A quadrilateral has diagonals that bisect each other perpendicularly. Must it be a square? State what can be concluded and give a counterexample."
 ],
 [
  "互相平分先得到平行四邊形，對角線再垂直可得菱形。",
  "Mutual bisection proves a parallelogram; perpendicular diagonals then prove a rhombus."
 ],
 [
  "但沒有保證內角90°或兩對角線等長。",
  "Neither right interior angles nor equal diagonals are guaranteed."
 ],
 [
  "例如對角線長6與8、互相垂直平分所成菱形，四邊長5，但不是正方形。",
  "Perpendicular bisecting diagonals of lengths 6 and 8 form a rhombus with sides 5, but not a square."
 ],
 [
  "先判平行四邊形再到菱形",
  "Establish a parallelogram, then a rhombus"
 ],
 [
  "指出缺少的正方形條件",
  "Identify the missing square condition"
 ],
 [
  "給出可實現的反例",
  "Give a geometrically possible counterexample"
 ],
 [
  "畫一個對角線不等長的菱形。",
  "Draw a rhombus with unequal diagonals."
 ],
 [
  "哪個對應關係以x為自變量時一定定義一個函數？",
  "Which correspondence necessarily defines a function of independent variable x?"
 ],
 [
  "每個x對應唯一的y",
  "Every x corresponds to exactly one y"
 ],
 [
  "每個x都對應兩個不同y",
  "Every x corresponds to two different y values"
 ],
 [
  "只要圖像是連續曲線",
  "Any graph that is a continuous curve"
 ],
 [
  "每個y只對應一個x",
  "Every y corresponds to only one x"
 ],
 [
  "函數要求每個允許輸入有唯一輸出；不同輸入可有相同輸出。",
  "Each allowed input needs a unique output; different inputs may share an output."
 ],
 [
  "重點是由輸入決定輸出。",
  "The input must determine the output."
 ],
 [
  "水箱初有20 L水，每分鐘放出2 L。列出水量模型及合理的時間範圍。有人代入t=15得到−10 L，應怎樣解釋？",
  "A tank starts with 20 L and drains at 2 L per minute. Form the volume model and a reasonable time interval. How should a computed −10 L at t=15 be interpreted?"
 ],
 [
  "放水期間V=20−2t。",
  "While draining, V=20−2t."
 ],
 [
  "物理限制V≥0且t≥0，故0≤t≤10（分鐘）。",
  "Physical constraints V≥0 and t≥0 give 0≤t≤10 minutes."
 ],
 [
  "t=15超出模型適用範圍；水量不會是負數。若放空後保持空箱，須另用V=0描述。",
  "t=15 is outside this model's domain; water volume cannot be negative. If the tank stays empty after draining, describe that separately by V=0."
 ],
 [
  "寫出模型及單位",
  "State the model and units"
 ],
 [
  "給出0至10的定義域",
  "Give domain 0 to 10"
 ],
 [
  "解釋超出範圍及可能的分段模型",
  "Explain the out-of-domain value and a possible piecewise model"
 ],
 [
  "代數式有值不等於情境中合理。",
  "An algebraic expression having a value does not make that value meaningful in context."
 ],
 [
  "一次函數 y=−2x+5，x增加3時，y會？",
  "For y=−2x+5, what happens to y when x increases by 3?"
 ],
 [
  "減少6",
  "Decreases by 6"
 ],
 [
  "增加3",
  "Increases by 3"
 ],
 [
  "增加5",
  "Increases by 5"
 ],
 [
  "減少1",
  "Decreases by 1"
 ],
 [
  "Δy=kΔx=−2×3=−6；截距不影響增量。",
  "Δy=kΔx=−2×3=−6; the intercept does not affect the increment."
 ],
 [
  "用變化量理解斜率。",
  "Interpret gradient through changes in the variables."
 ],
 [
  "印刷方案A每張2元；B先付30元，再每張1.5元。班長預計印40至100張。請寫一份選擇建議，包含臨界張數、兩側比較及模型假設。",
  "Printing plan A costs 2 per sheet; B charges 30 plus 1.5 per sheet. The class expects 40–100 sheets. Recommend a plan, giving the break-even count, comparisons on both sides and model assumptions."
 ],
 [
  "A=2n，B=30+1.5n，相等時n=60。",
  "A=2n, B=30+1.5n; equality occurs at n=60."
 ],
 [
  "40≤n<60時A便宜；n=60相同；60<n≤100時B便宜。",
  "A is cheaper for 40≤n<60; they tie at n=60; B is cheaper for 60<n≤100."
 ],
 [
  "假設品質相同、沒有額外費用、張數為整數、單價固定。",
  "Assume equal quality, no additional fees, integer sheet counts and fixed unit prices."
 ],
 [
  "正確建立兩個模型",
  "Form both models correctly"
 ],
 [
  "解釋臨界值及兩側",
  "Explain the break-even point and both sides"
 ],
 [
  "列至少一個適用假設",
  "State at least one assumption needed for application"
 ],
 [
  "不要只比較固定費或單價。",
  "Do not compare only fixed fees or unit prices."
 ],
 [
  "數據2、3、4、5、100，哪個量較能代表大部分數據的典型位置？",
  "For data 2, 3, 4, 5, 100, which measure better represents the typical location of most values?"
 ],
 [
  "中位數4",
  "Median 4"
 ],
 [
  "平均數22.8",
  "Mean 22.8"
 ],
 [
  "最大值100",
  "Maximum 100"
 ],
 [
  "極差98",
  "Range 98"
 ],
 [
  "大部分集中在2至5；100拉高平均數，中位數受其影響較小。",
  "Most values lie from 2 to 5; 100 raises the mean while affecting the median less."
 ],
 [
  "先看數據的分布與極端值。",
  "Inspect the distribution and extreme values first."
 ],
 [
  "甲組成績60、70、80；乙組69、70、71。比較平均數和方差（以n作分母），為需要穩定表現的任務提出選組建議，並說明限制。",
  "Group A scores 60, 70, 80; group B scores 69, 70, 71. Compare means and variances using denominator n, recommend a group for a task requiring consistency and state a limitation."
 ],
 [
  "兩組平均數都是70。",
  "Both groups have mean 70."
 ],
 [
  "甲方差=(100+0+100)/3=200/3；乙方差=(1+0+1)/3=2/3。",
  "Variance A=(100+0+100)/3=200/3; variance B=(1+0+1)/3=2/3."
 ],
 [
  "以這三次表現的穩定性看，乙較穩定；樣本很少，不能保證日後每次表現。",
  "B is more consistent over these three observations, but the sample is too small to guarantee every future performance."
 ],
 [
  "指出相同平均數",
  "Identify the equal means"
 ],
 [
  "計算兩個方差",
  "Calculate both variances"
 ],
 [
  "建議連結穩定性並承認小樣本限制",
  "Link the recommendation to consistency and acknowledge the small sample"
 ],
 [
  "平均相同，離平均的距離相同嗎？",
  "Equal means do not imply equal distances from those means."
 ],
 [
  "A有3個元素",
  "A has 3 elements"
 ],
 [
  "區分元素與子集，留意大括號。",
  "Distinguish elements from subsets and inspect the braces."
 ],
 [
  "30名學生中，18人參加數學組、16人參加科學組、7人兩組皆參加。這組數據可能嗎？若不可能，兩組皆參加至少要多少人？",
  "Among 30 students, 18 join mathematics, 16 science and 7 both. Are these data possible? If not, how many must join both at minimum?"
 ],
 [
  "容斥：至少一組人數=18+16−7=27≤30，故可能。",
  "By inclusion–exclusion, at least one group has 18+16−7=27≤30 students, so the data are possible."
 ],
 [
  "目前3人兩組都不參加。",
  "Currently 3 students join neither group."
 ],
 [
  "一般須18+16−交集≤30，故交集至少4人；現有7人符合。",
  "In general, 18+16−intersection≤30, so at least 4 must join both; the stated 7 satisfy this."
 ],
 [
  "先檢查而非直接假設矛盾",
  "Check the data instead of assuming a contradiction"
 ],
 [
  "算出並集27及外部3",
  "Find union 27 and outside count 3"
 ],
 [
  "推導交集下限4",
  "Derive the intersection lower bound 4"
 ],
 [
  "全集限制的是並集人數。",
  "The universal-set size bounds the union count."
 ],
 [
  "「存在實數x使x²<0」的否定是？",
  "What is the negation of 'There exists a real x with x²<0'?"
 ],
 [
  "對所有實數x，x²≥0",
  "For every real x, x²≥0"
 ],
 [
  "存在實數x使x²≥0",
  "There exists a real x with x²≥0"
 ],
 [
  "對所有實數x，x²>0",
  "For every real x, x²>0"
 ],
 [
  "不存在實數x",
  "There are no real numbers x"
 ],
 [
  "存在量詞否定為全稱量詞，<的否定是≥。",
  "Negate the existential quantifier to a universal one, and < to ≥."
 ],
 [
  "同時改變量詞及判斷條件。",
  "Change both the quantifier and the condition."
 ],
 [
  "在實數範圍，p：x>2，q：x²>4。判斷p是q的甚麼條件，並用推理及反例分別檢查兩個方向。",
  "Over the reals, let p: x>2 and q: x²>4. Classify p as a condition for q, checking the two directions by reasoning and counterexample."
 ],
 [
  "p⇒q：x>2時x²>4，正向成立。",
  "p⇒q: if x>2 then x²>4, so the forward implication holds."
 ],
 [
  "q不能推出p：x=−3時x²=9>4，但x不大於2。",
  "q does not imply p: x=−3 gives x²=9>4, but x is not greater than 2."
 ],
 [
  "故p是q的充分但不必要條件。",
  "Thus p is sufficient but not necessary for q."
 ],
 [
  "證明正向成立",
  "Prove the forward implication"
 ],
 [
  "給反向反例",
  "Give a counterexample to the reverse"
 ],
 [
  "正確命名充分不必要",
  "Correctly identify sufficient but not necessary"
 ],
 [
  "不要只驗證一個方向。",
  "Do not check only one direction."
 ],
 [
  "不等式 (x−2)²<0 的解集為？",
  "What is the solution set of (x−2)²<0?"
 ],
 [
  "空集",
  "The empty set"
 ],
 [
  "實數平方非負，沒有小於0的情況。",
  "A real square is nonnegative, so it cannot be less than zero."
 ],
 [
  "先看表達式的結構。",
  "Inspect the structure of the expression first."
 ],
 [
  "解不等式 −(x−1)(x−4)≥0，並以數軸或符號表解釋。有人得到x≤1或x≥4，找出他可能漏掉的步驟。",
  "Solve −(x−1)(x−4)≥0 using a number line or sign table. Someone obtains x≤1 or x≥4; identify a likely omitted step."
 ],
 [
  "兩邊乘−1，得(x−1)(x−4)≤0。",
  "Multiply both sides by −1: (x−1)(x−4)≤0."
 ],
 [
  "根為1及4，中間乘積非正，因此1≤x≤4。",
  "The roots are 1 and 4; between them the product is nonpositive, giving 1≤x≤4."
 ],
 [
  "錯誤解集通常因乘負數未反向；代x=2原式為2≥0也可反駁。",
  "The error often comes from failing to reverse the sign when multiplying by a negative. Substitution x=2 also refutes it: the original expression gives 2≥0."
 ],
 [
  "處理負號時反向",
  "Reverse the inequality when handling the negative multiplier"
 ],
 [
  "正確閉區間",
  "Give the correct closed interval"
 ],
 [
  "用符號或代點解釋錯誤",
  "Explain the error through signs or a test value"
 ],
 [
  "先讓首項係數為正。",
  "Make the leading coefficient positive first."
 ],
 [
  "f(x)除以二次多項式後的非零餘式，其次數必須？",
  "After dividing f(x) by a quadratic polynomial, what must the degree of a nonzero remainder satisfy?"
 ],
 [
  "小於2",
  "Less than 2"
 ],
 [
  "等於2",
  "Equal to 2"
 ],
 [
  "大於2",
  "Greater than 2"
 ],
 [
  "等於被除式次數",
  "Equal to the dividend's degree"
 ],
 [
  "除法分解要求餘式次數低於除式，否則還可繼續除。",
  "A remainder has lower degree than the divisor; otherwise division can continue."
 ],
 [
  "回想長除法何時停止。",
  "Recall the stopping rule for polynomial long division."
 ],
 [
  "已知f(1)=3、f(2)=5。求f(x)除以(x−1)(x−2)的餘式，並解釋為何這兩個值就足夠。",
  "Given f(1)=3 and f(2)=5, find the remainder on dividing f(x) by (x−1)(x−2), and explain why these two values suffice."
 ],
 [
  "設餘式ax+b，因其次數小於2。",
  "Let the remainder be ax+b because its degree is below 2."
 ],
 [
  "代x=1、2得到a+b=3、2a+b=5，解得a=2、b=1。",
  "At x=1 and 2, a+b=3 and 2a+b=5, giving a=2 and b=1."
 ],
 [
  "餘式2x+1；兩個不同點能唯一決定一次或常數多項式。",
  "The remainder is 2x+1. Two distinct points uniquely determine a polynomial of degree at most one."
 ],
 [
  "設一次餘式",
  "Set a remainder of degree at most one"
 ],
 [
  "利用除式為零的兩點",
  "Use the two zeros of the divisor"
 ],
 [
  "求2x+1並說明唯一性",
  "Find 2x+1 and explain uniqueness"
 ],
 [
  "代入除式的根會消掉商乘除式。",
  "Substituting a divisor's root removes the quotient-times-divisor term."
 ],
 [
  "函數f(x)=x²在整個實數域上是？",
  "How is f(x)=x² classified on the whole real domain?"
 ],
 [
  "偶函數，但不在整個實數域單調",
  "Even, but not monotonic on the whole real domain"
 ],
 [
  "奇函數且遞增",
  "Odd and increasing"
 ],
 [
  "偶函數且處處遞增",
  "Even and increasing everywhere"
 ],
 [
  "非奇非偶",
  "Neither odd nor even"
 ],
 [
  "f(−x)=f(x)；在負半軸遞減、正半軸遞增。",
  "f(−x)=f(x); it decreases on the negative half-axis and increases on the positive half-axis."
 ],
 [
  "奇偶性與單調性是不同性質。",
  "Parity and monotonicity are different properties."
 ],
 [
  "有人說「f(x)=1/x是奇函數，所以f(0)=0」。指出問題，並說明「奇函數且0在定義域」才可推出f(0)=0的理由。",
  "Someone says 'f(x)=1/x is odd, so f(0)=0.' Identify the problem and explain why an odd function must also have 0 in its domain before this conclusion follows."
 ],
 [
  "1/x的定義域排除0，雖然關於原點對稱且f(−x)=−f(x)，f(0)仍不存在。",
  "The domain of 1/x excludes 0. It is symmetric about the origin and satisfies f(−x)=−f(x), but f(0) does not exist."
 ],
 [
  "若0在奇函數定義域，f(0)=−f(0)，所以2f(0)=0，得f(0)=0。",
  "If 0 belongs to an odd function's domain, f(0)=−f(0), hence 2f(0)=0 and f(0)=0."
 ],
 [
  "先檢查定義域",
  "Check the domain first"
 ],
 [
  "承認1/x是奇函數",
  "Recognise that 1/x is odd"
 ],
 [
  "加上0存在的條件再推導",
  "Include existence at 0 before deriving the result"
 ],
 [
  "性質不能替函數補上未定義的點。",
  "A property cannot define an otherwise undefined function value."
 ],
 [
  "若0<a<1，aᵘ<aᵛ能推出？",
  "If 0<a<1 and aᵘ<aᵛ, what follows?"
 ],
 [
  "u、v必為負數",
  "Both u and v must be negative"
 ],
 [
  "底數介於0和1時指數函數遞減，函數值越小，指數越大。",
  "With base between 0 and 1, the exponential function decreases: a smaller output requires a larger exponent."
 ],
 [
  "先判斷函數增減方向。",
  "Determine whether the function increases or decreases first."
 ],
 [
  "甲方案第一期收入100元，其後每期增加20元；乙方案第一期80元，其後每期乘1.5。比較前四期，並說明用直線模型描述乙方案為何不合理。",
  "Plan A earns 100 in period one, then adds 20 each period; B earns 80 in period one, then multiplies by 1.5 each period. Compare the first four periods and explain why a linear model is unsuitable for B."
 ],
 [
  "甲依次100、120、140、160；乙80、120、180、270。",
  "A: 100, 120, 140, 160; B: 80, 120, 180, 270."
 ],
 [
  "第二期相同，第三期起在這四期中乙較高。",
  "They tie in period two; B is higher from period three within these four periods."
 ],
 [
  "甲固定差，乙固定比；乙相鄰差40、60、90並不相同，所以不是一次函數。",
  "A has constant differences; B has a constant ratio. B's differences 40, 60, 90 are unequal, so it is not linear."
 ],
 [
  "列出四期的兩組數據",
  "List all four periods for both plans"
 ],
 [
  "正確比較",
  "Compare correctly"
 ],
 [
  "以固定差與固定比辨別模型",
  "Distinguish models using constant differences and constant ratios"
 ],
 [
  "先說清楚第一期的起點。",
  "State clearly where period one begins."
 ],
 [
  "θ在第二象限且sinθ=3/5，cosθ是？",
  "θ is in quadrant II and sinθ=3/5. Find cosθ."
 ],
 [
  "cos²θ=1−9/25=16/25，第二象限cosθ<0，所以−4/5。",
  "cos²θ=1−9/25=16/25; quadrant II has cosθ<0, giving −4/5."
 ],
 [
  "平方關係決定大小，象限決定正負。",
  "The squared identity determines magnitude; the quadrant determines sign."
 ],
 [
  "摩天輪半徑10m、中心離地12m。令最低點為t=0，每圈60秒。用h(t)=12−10cos(πt/30)描述座艙高度，檢查t=0、15、30秒，並解釋振幅、週期與最低高度。",
  "A Ferris wheel has radius 10 m and centre 12 m above level ground. The lowest point is at t=0 and one turn takes 60 seconds. Check h(t)=12−10cos(πt/30) at t=0, 15, 30 seconds, and explain amplitude, period and minimum height."
 ],
 [
  "振幅10對應半徑，週期2π/(π/30)=60秒。",
  "Amplitude 10 is the radius; period 2π/(π/30)=60 seconds."
 ],
 [
  "最低12−10=2m；最高22m。模型假設等速旋轉且地面水平。",
  "Minimum=12−10=2 m; maximum=22 m. Assume constant-speed rotation and level ground."
 ],
 [
  "計算三個時刻",
  "Calculate all three times"
 ],
 [
  "連結參數與情境",
  "Connect parameters with the situation"
 ],
 [
  "說明範圍及至少一個假設",
  "State the range and at least one assumption"
 ],
 [
  "角度在公式中用弧度。",
  "The formula uses radians."
 ],
 [
  "非零向量u、v滿足u·v=0，可推出？",
  "For nonzero vectors u and v with u·v=0, what follows?"
 ],
 [
  "u與v垂直",
  "u and v are perpendicular"
 ],
 [
  "u與v平行",
  "u and v are parallel"
 ],
 [
  "u·v=|u||v|cosθ，兩模非零故cosθ=0。",
  "u·v=|u||v|cosθ; both magnitudes are nonzero, so cosθ=0."
 ],
 [
  "非零條件為何必要？",
  "Why is the nonzero condition needed?"
 ],
 [
  "u=(1,2)，v=(2,−1)。證明|u+v|²=|u|²+|v|²，並解釋為何這不是任意兩向量都有的等式。",
  "For u=(1,2), v=(2,−1), prove |u+v|²=|u|²+|v|² and explain why it does not hold for every pair of vectors."
 ],
 [
  "u·v=2−2=0，兩向量垂直。",
  "u·v=2−2=0, so the vectors are perpendicular."
 ],
 [
  "u+v=(3,1)，模平方10；兩模平方各5，合計10。",
  "u+v=(3,1) has squared magnitude 10; each original squared magnitude is 5, summing to 10."
 ],
 [
  "一般|u+v|²=|u|²+2u·v+|v|²，只有交叉項為0時成立。",
  "Generally |u+v|²=|u|²+2u·v+|v|²; the stated equality holds only when the cross term is zero."
 ],
 [
  "計算並比較",
  "Calculate and compare"
 ],
 [
  "辨認垂直",
  "Identify perpendicularity"
 ],
 [
  "寫一般內積展開式",
  "State the general dot-product expansion"
 ],
 [
  "向量版的交叉項是甚麼？",
  "What is the vector cross term here?"
 ],
 [
  "已知三角形兩邊a、b及其夾角C，直接求第三邊c應用？",
  "Given triangle sides a, b and their included angle C, which theorem finds side c directly?"
 ],
 [
  "餘弦定理",
  "The cosine rule"
 ],
 [
  "只用三角形內角和",
  "Only the triangle angle sum"
 ],
 [
  "直接把a、b相加",
  "Add a and b directly"
 ],
 [
  "必須先假設直角",
  "First assume a right angle"
 ],
 [
  "c²=a²+b²−2ab cosC，不要求三角形是直角。",
  "c²=a²+b²−2ab cosC does not require a right triangle."
 ],
 [
  "選擇與已知資料相配的定理。",
  "Choose a theorem matching the given information."
 ],
 [
  "已知△ABC中A=30°、a=5、b=8（小寫為對邊）。利用正弦定理判斷B可能有多少個值，並檢查是否都能組成三角形。",
  "In △ABC, A=30°, a=5 and b=8, where lowercase sides oppose the corresponding angles. Use the sine rule to determine how many B values are possible and whether each forms a triangle."
 ],
 [
  "0°<B<180°內可有B≈53.13°或126.87°。",
  "For 0°<B<180°, B≈53.13° or 126.87°."
 ],
 [
  "A+B分別約83.13°及156.87°，都小於180°，所以兩種三角形均可。",
  "A+B≈83.13° or 156.87°, both below 180°, so both triangles are possible."
 ],
 [
  "算出sinB=0.8",
  "Calculate sinB=0.8"
 ],
 [
  "討論互補的兩角",
  "Discuss the two supplementary angle possibilities"
 ],
 [
  "檢查角和而非只取反正弦主值",
  "Check the angle sum instead of taking only the principal inverse-sine value"
 ],
 [
  "SSA資料可能有兩解。",
  "SSA data can allow two solutions."
 ],
 [
  "圓錐體積公式中h代表？",
  "What does h represent in the cone volume formula?"
 ],
 [
  "頂點到底面的垂直距離",
  "The perpendicular distance from the vertex to the base plane"
 ],
 [
  "母線長",
  "Slant height"
 ],
 [
  "底面直徑",
  "Base diameter"
 ],
 [
  "任一側棱長",
  "Any lateral edge length"
 ],
 [
  "體積V=πr²h/3使用垂直高度，母線用於側面積。",
  "V=πr²h/3 uses perpendicular height; slant height is used for curved surface area."
 ],
 [
  "先區分母線與高。",
  "Distinguish slant height from perpendicular height first."
 ],
 [
  "兩個相似容器長度比2:3。小容器體積80 cm³，問大容器體積。有人用80×3/2，解釋錯誤並求正解。",
  "Similar containers have length ratio 2:3. The smaller holds 80 cm³. Someone calculates the larger volume as 80×3/2. Explain the error and find the correct volume."
 ],
 [
  "體積比為2³:3³=8:27。",
  "Volume ratio=2³:3³=8:27."
 ],
 [
  "大容器=80×27/8=270 cm³。",
  "Larger volume=80×27/8=270 cm³."
 ],
 [
  "三個方向都按3/2放大，所以體積乘(3/2)³，而非一次方。",
  "All three dimensions scale by 3/2, so volume scales by (3/2)³ rather than the first power."
 ],
 [
  "區分長度比與體積比",
  "Distinguish length ratio from volume ratio"
 ],
 [
  "計算270",
  "Calculate 270"
 ],
 [
  "以三維縮放解釋立方",
  "Explain the cube through three-dimensional scaling"
 ],
 [
  "想像長、寬、高各自放大。",
  "Imagine length, width and height each being enlarged."
 ],
 [
  "y=3x+2描述的關係是？",
  "What relationship does y=3x+2 describe?"
 ],
 [
  "部分變化，並非y與x成正變",
  "Partial variation, rather than y varying directly as x"
 ],
 [
  "y與x成正變",
  "y varies directly as x"
 ],
 [
  "y與x成反變",
  "y varies inversely as x"
 ],
 [
  "y與x²成正變",
  "y varies directly as x²"
 ],
 [
  "正變要求y=kx；非零固定部分2使y/x不固定。",
  "Direct variation requires y=kx. The nonzero fixed component 2 makes y/x nonconstant."
 ],
 [
  "正比圖像必經原點。",
  "A direct-proportion graph passes through the origin."
 ],
 [
  "固定工作量下，n人完成工程需t天，假設每人效率相同且互不干擾。6人需10天，求15人所需天數，並提出兩個現實中可能令模型失效的因素。",
  "For a fixed job, n workers take t days, assuming equal efficiency and no interference. Six workers take 10 days. Find the time for 15 workers and give two realistic factors that could invalidate the model."
 ],
 [
  "總人日nt=60，t=60/n。",
  "Total worker-days nt=60, so t=60/n."
 ],
 [
  "15人需4天。",
  "Fifteen workers need 4 days."
 ],
 [
  "溝通成本、工作無法分割、器材限制、效率差異等都可能破壞反比假設。",
  "Communication overhead, indivisible tasks, equipment limits or efficiency differences may violate inverse-proportion assumptions."
 ],
 [
  "建立反變模型",
  "Form the inverse-variation model"
 ],
 [
  "計算4天",
  "Calculate 4 days"
 ],
 [
  "提出兩項與假設相關的限制",
  "State two limitations connected to the assumptions"
 ],
 [
  "人數加倍就一定能把所有工作並行處理嗎？",
  "Does doubling the workforce necessarily make every task parallelisable?"
 ],
 [
  "P=(x−1)²(x+2)，Q=(x−1)(x+2)³，其首一最大公因式是？",
  "P=(x−1)²(x+2), Q=(x−1)(x+2)³. Find their monic greatest common divisor."
 ],
 [
  "共同因式各取較小次數：x−1取1次，x+2取1次。",
  "Take the smaller exponent of each common factor: power 1 for both x−1 and x+2."
 ],
 [
  "最大公因式用最小指數。",
  "Use minimum exponents for the greatest common divisor."
 ],
 [
  "P=(x−2)²(x+1)，Q=(x−2)(x+1)²。求首一GCD及LCM，並用次數關係檢查結果。",
  "P=(x−2)²(x+1), Q=(x−2)(x+1)². Find the monic GCD and LCM, then check their degrees."
 ],
 [
  "次數2+4=3+3；首一多項式滿足GCD×LCM=P×Q。",
  "Degrees satisfy 2+4=3+3; monic polynomials satisfy GCD×LCM=P×Q."
 ],
 [
  "各因式取較小與較大指數",
  "Use smaller and larger exponents for each factor"
 ],
 [
  "寫出兩式",
  "Write both expressions"
 ],
 [
  "以次數或乘積核對",
  "Check by degrees or multiplication"
 ],
 [
  "分別列兩個因式在P、Q出現的次數。",
  "List the exponents of each factor in P and Q separately."
 ],
 [
  "分母為x(x−1)²的真分式，其一般部分分式形式需要？",
  "What general partial-fraction form is needed for a proper fraction with denominator x(x−1)²?"
 ],
 [
  "重複一次因式需保留從一次至最高重數的各次方分母。",
  "A repeated linear factor needs denominators of every power from 1 to its full multiplicity."
 ],
 [
  "重根的各層不能漏。",
  "Do not omit any repeated-factor level."
 ],
 [
  "把1/[x(x+1)]拆成部分分式，再用它求Σ從k=1到n的1/[k(k+1)]。說明n的範圍。",
  "Decompose 1/[x(x+1)] into partial fractions, then sum 1/[k(k+1)] from k=1 to n. State the allowed n."
 ],
 [
  "清分母後1=A(x+1)+Bx，得A=1、B=−1。",
  "Clearing denominators gives 1=A(x+1)+Bx, hence A=1 and B=−1."
 ],
 [
  "所以1/[x(x+1)]=1/x−1/(x+1)，x≠0,−1。",
  "Therefore 1/[x(x+1)]=1/x−1/(x+1), with x≠0,−1."
 ],
 [
  "對正整數n連加，中間項相消，和=1−1/(n+1)=n/(n+1)。",
  "For a positive integer n, the middle terms cancel: sum=1−1/(n+1)=n/(n+1)."
 ],
 [
  "求出係數及禁值",
  "Find the coefficients and excluded values"
 ],
 [
  "寫出相消過程",
  "Show the cancellation"
 ],
 [
  "給正整數n及結果",
  "State positive integer n and the result"
 ],
 [
  "把代數恆等式遷移到有限求和。",
  "Apply the algebraic identity to a finite sum."
 ],
 [
  "空間中兩條直線不相交，就一定平行嗎？",
  "Must two nonintersecting lines in space be parallel?"
 ],
 [
  "不一定，也可能異面",
  "No; they may be skew"
 ],
 [
  "一定平行",
  "They must be parallel"
 ],
 [
  "一定垂直",
  "They must be perpendicular"
 ],
 [
  "一定重合",
  "They must coincide"
 ],
 [
  "空間有不共面的異面直線，不能沿用平面中的二選一判斷。",
  "Space permits noncoplanar skew lines; the two alternatives from plane geometry do not suffice."
 ],
 [
  "先問是否共面。",
  "Ask whether the lines are coplanar first."
 ],
 [
  "有人說「直線l垂直平面內的一條直線m，所以l垂直此平面」。指出缺少的條件，並以正方體中的棱給反例。",
  "Someone says 'Line l is perpendicular to line m in a plane, so l is perpendicular to the plane.' Identify the missing condition and give a counterexample using cube edges."
 ],
 [
  "判定線面垂直通常需l垂直於平面內兩條相交直線。",
  "To establish line–plane perpendicularity, normally show l perpendicular to two intersecting lines in the plane."
 ],
 [
  "正方體底面ABCD內，AB⊥BC，但AB本身在底面內，並不垂直底面。",
  "In the cube's base ABCD, AB⊥BC, but AB lies within the base plane and is not perpendicular to it."
 ],
 [
  "只有一條垂線不足以限制直線在空間中的方向。",
  "One perpendicular line does not determine the line's spatial direction sufficiently."
 ],
 [
  "補上兩條相交直線的條件",
  "Add the condition involving two intersecting lines"
 ],
 [
  "給具體可實現的反例",
  "Give a concrete, geometrically possible counterexample"
 ],
 [
  "說明反例符合已知卻違反結論",
  "Explain how it satisfies the hypothesis but violates the conclusion"
 ],
 [
  "使用底面中的兩條鄰邊。",
  "Use two adjacent edges of the base."
 ],
 [
  "回到本章概念與定義，逐一檢查選項。",
  "Return to the chapter's concepts and definitions and check each option."
 ]
]);
 for(const pair of [
 [
  "數軸上 A 點表示 −{0}，B 點表示它的相反數。AB 的長度是多少？",
  "On a number line, A represents −{0} and B represents its opposite. What is the length of AB?"
 ],
 [
  "B 表示 {0}。",
  "B represents {0}."
 ],
 [
  "已知 |x| = {0}，且 x < 0。求 |x − {1}|。",
  "Given |x| = {0} and x < 0, find |x − {1}|."
 ],
 [
  "由 x < 0，得 x = −{0}。",
  "Since x < 0, x = −{0}."
 ],
 [
  "數軸上 A、B 分別表示 {0}、{1}。點 P 是 AB 的中點，求 P 表示的數。",
  "On a number line, A and B represent {0} and {1}. P is the midpoint of AB. Find the number represented by P."
 ],
 [
  "對所有實數 x，求 |x − ({0})| + |x − ({1})| 的最小值。",
  "For all real x, find the minimum of |x − ({0})| + |x − ({1})|."
 ],
 [
  "兩項分別是點 x 到 {0}、{1} 的距離。",
  "The terms are the distances from x to {0} and {1}."
 ],
 [
  "當 x 位於兩點之間（含端點），距離和為 {0}；移到區間外只會增加。",
  "Between the two points, including endpoints, the distance sum is {0}. Moving outside that interval increases it."
 ],
 [
  "故最小值為 {0}。",
  "Therefore the minimum is {0}."
 ],
 [
  "計算 −{0}² + {1} × (−{2})。",
  "Calculate −{0}² + {1} × (−{2})."
 ],
 [
  "先算乘方：−{0}² = −{1}。",
  "Evaluate the power first: −{0}² = −{1}."
 ],
 [
  "乘法得 −{0}，合計 −{1}。",
  "Multiplication gives −{0}, so the total is −{1}."
 ],
 [
  "每袋以 {0} kg 為標準。有 {1} 袋，每袋偏差平均為 −{2} kg。這批貨的總質量是多少 kg？",
  "The reference mass is {0} kg per bag. There are {1} bags with an average deviation of −{2} kg per bag. What is their total mass in kg?"
 ],
 [
  "平均每袋質量 = {0} − {1} = {2} kg。",
  "Average mass per bag = {0} − {1} = {2} kg."
 ],
 [
  "總質量 = {0} × {1} = {2} kg。",
  "Total mass = {0} × {1} = {2} kg."
 ],
 [
  "賬戶原有 {0} 元，依次存入 {1} 元、取出 {2} 元、存入 {3} 元。問整個過程（包括起初）最高餘額是多少元？",
  "An account starts with {0} currency units. Deposit {1}, withdraw {2}, then deposit {3}. What is the highest balance during the entire process, including the start?"
 ],
 [
  "依次餘額為 {0} 元。",
  "The balances in order are {0} currency units."
 ],
 [
  "逐項比較，最高為 {0} 元。",
  "Comparing them, the highest is {0} currency units."
 ],
 [
  "求 1/(1×2) + 1/(2×3) + … + 1/({0}×{1}) 的值。可輸入分數。",
  "Find 1/(1×2) + 1/(2×3) + … + 1/({0}×{1}). Fractions are accepted."
 ],
 [
  "中間項相消，只剩 1 − 1/{0} = {1}/{2}。",
  "The middle terms cancel, leaving 1 − 1/{0} = {1}/{2}."
 ],
 [
  "當 x = {0}，求 {1}x² − {2} 的值。",
  "When x = {0}, find the value of {1}x² − {2}."
 ],
 [
  "先算 x² = {0}。",
  "First calculate x² = {0}."
 ],
 [
  "代入得 {0} × {1} − {2} = {3}。",
  "Substitution gives {0} × {1} − {2} = {3}."
 ],
 [
  "租用器材需付固定費 {0} 元，每小時另付 {1} 元。連續使用 {2} 小時，共付多少元？",
  "Equipment hire has a fixed fee of {0} plus {1} currency units per hour. What is the cost for {2} consecutive hours?"
 ],
 [
  "固定費與時間無關，總費用 C = {0}t + {1}。",
  "The fixed fee is independent of time: total cost C = {0}t + {1}."
 ],
 [
  "t = {0}，C = {1} 元。",
  "t = {0}, so C = {1} currency units."
 ],
 [
  "用火柴排一列相鄰正方形，相鄰兩個正方形共用一條邊。排 {0} 個正方形，需要幾根火柴？",
  "Adjacent squares in a row share one side. How many matches are needed for {0} squares?"
 ],
 [
  "已知 {0}x + {1}y = {2}，不求 x、y，直接求 {3}x + {4}y + {5} 的值。",
  "Given {0}x + {1}y = {2}, find {3}x + {4}y + {5} directly without finding x and y."
 ],
 [
  "把前兩項合併為 2({0}x + {1}y)。",
  "Group the first two terms as 2({0}x + {1}y)."
 ],
 [
  "原式 = 2 × {0} + {1} = {2}。",
  "The expression = 2 × {0} + {1} = {2}."
 ],
 [
  "化簡 {0}x − {1}(x − {2}) 後，常數項是多少？",
  "After simplifying {0}x − {1}(x − {2}), what is the constant term?"
 ],
 [
  "展開：{0}x − {1}x + {2}。",
  "Expand: {0}x − {1}x + {2}."
 ],
 [
  "合併後常數項為 {0}。",
  "The constant term after combining is {0}."
 ],
 [
  "若 {0}x²yⁿ 與 −{1}x²y⁵ 是同類項，求 n + {2}。",
  "If {0}x²yⁿ and −{1}x²y⁵ are like terms, find n + {2}."
 ],
 [
  "先化簡再求值：{0}x − [{1}x − ({2} − x)]，其中 x = {3}。",
  "Simplify, then evaluate: {0}x − [{1}x − ({2} − x)] when x = {3}."
 ],
 [
  "去中括號得 {0}x − {1}x + {2} − x。",
  "Removing the brackets gives {0}x − {1}x + {2} − x."
 ],
 [
  "合併為 ({0})x + {1}。",
  "Combine to obtain ({0})x + {1}."
 ],
 [
  "代入 x = {0}，得 {1}。",
  "Substituting x = {0} gives {1}."
 ],
 [
  "化簡 ({0}m + {1})x − {2}x + 7 後，結果與 x 無關。求 m。",
  "After simplifying ({0}m + {1})x − {2}x + 7, the result is independent of x. Find m."
 ],
 [
  "解方程 {0}x + {1} = {2}，輸入 x。",
  "Solve {0}x + {1} = {2}. Enter x."
 ],
 [
  "兩邊減 {0}，得 {1}x = {2}。",
  "Subtract {0} on both sides: {1}x = {2}."
 ],
 [
  "再除以 {0}，x = {1}。",
  "Divide by {0}: x = {1}."
 ],
 [
  "一件商品售價為 {0} 元，利潤率是成本的 {1}%。求成本。",
  "An item sells for {0} currency units at a profit of {1}% of its cost. Find the cost."
 ],
 [
  "設成本為 x，售價是 (1 + {0}/100)x。",
  "Let the cost be x; the selling price is (1 + {0}/100)x."
 ],
 [
  "x = {0} ÷ {1} = {2} 元。",
  "x = {0} ÷ {1} = {2} currency units."
 ],
 [
  "甲、乙同向行走，速度分別為 {0}、{1} m/s。甲領先 {2} m，乙從此刻開始追趕。多久追上？",
  "Walkers A and B travel in the same direction at {0} and {1} m/s. A is {2} m ahead when B begins to catch up. How long until B catches A?"
 ],
 [
  "追近速度是 {0} − {1} = {2} m/s。",
  "Closing speed = {0} − {1} = {2} m/s."
 ],
 [
  "所需時間 = {0}/{1} = {2} s。",
  "Time required = {0}/{1} = {2} s."
 ],
 [
  "解方程 ({0}x + {1})/{2} − x = {3}，輸入 x。",
  "Solve ({0}x + {1})/{2} − x = {3}. Enter x."
 ],
 [
  "乘以 {0}，得 ({1} − {2})x + {3} = {4}。",
  "Multiply by {0}: ({1} − {2})x + {3} = {4}."
 ],
 [
  "整理得 x = {0}。",
  "Rearranging gives x = {0}."
 ],
 [
  "一個角的餘角為 {0}°，求這個角的補角。",
  "An angle's complement is {0}°. Find its supplement."
 ],
 [
  "原角 = 90° − {0}° = {1}°。",
  "Original angle = 90° − {0}° = {1}°."
 ],
 [
  "補角 = 180° − {0}° = {1}°。",
  "Supplement = 180° − {0}° = {1}°."
 ],
 [
  "A、B、C 依次在同一直線上，AB = {0}、BC = {1}。M 是 AC 中點，求 MB。",
  "A, B and C lie on a line in that order, with AB = {0} and BC = {1}. M is the midpoint of AC. Find MB."
 ],
 [
  "以 A 為原點，B = {0}，C = {1}。",
  "Take A as the origin: B = {0}, C = {1}."
 ],
 [
  "圓錐底半徑為 {0}、高為 {1}。若體積寫成 kπ，求 k。",
  "A cone has base radius {0} and height {1}. Write its volume as kπ and find k."
 ],
 [
  "射線 OB 位於 ∠AOC 內，∠AOB = {0}°、∠BOC = {1}°。OM、ON 分別平分 ∠AOB、∠BOC，求 ∠MON。",
  "Ray OB lies inside ∠AOC, with ∠AOB = {0}° and ∠BOC = {1}°. OM and ON bisect ∠AOB and ∠BOC respectively. Find ∠MON."
 ],
 [
  "兩角在 OB 兩側，∠MON = ({0} + {1})/2 = {2}°。",
  "The angles lie on opposite sides of OB, so ∠MON = ({0} + {1})/2 = {2}°."
 ],
 [
  "兩平行線被截線所截，一對同旁內角中一角為 {0}°，求另一角。",
  "A transversal cuts two parallel lines. One same-side interior angle is {0}°. Find the other."
 ],
 [
  "另一角 = 180° − {0}° = {1}°。",
  "The other angle = 180° − {0}° = {1}°."
 ],
 [
  "兩平行線被截線所截，一對內錯角分別為 ({0}x + {1})° 與 {2}°。求 x。",
  "A transversal cuts two parallel lines, giving alternate interior angles ({0}x + {1})° and {2}°. Find x."
 ],
 [
  "內錯角相等：{0}x + {1} = {2}。",
  "Alternate interior angles are equal: {0}x + {1} = {2}."
 ],
 [
  "解得 x = {0}。",
  "Solving gives x = {0}."
 ],
 [
  "兩直線相交，其中一個角為 {0}°。求此角的鄰補角與對頂角的差（大角減小角）。",
  "Two lines intersect and one angle is {0}°. Find the difference between its adjacent supplementary angle and its vertically opposite angle, larger minus smaller."
 ],
 [
  "對頂角為 {0}°，鄰補角為 {1}°。",
  "The vertically opposite angle is {0}° and the adjacent supplementary angle is {1}°."
 ],
 [
  "兩角之差 = {0} − {1} = {2}°。",
  "Their difference = {0} − {1} = {2}°."
 ],
 [
  "l ∥ m。A 在 l 上，B 在 m 上，P 在兩線之間。射線 PA、PB 都指向左方；PA 與向左的水平線夾角為 {0}°，PB 與向左的水平線夾角為 {1}°，且兩射線位於該水平線兩側。求 ∠APB。",
  "l ∥ m, with A on l, B on m and P between the lines. PA and PB both point left. PA makes {0}° and PB makes {1}° with the leftward horizontal, on opposite sides of that horizontal. Find ∠APB."
 ],
 [
  "兩角分居水平線兩側，故 ∠APB = {0}° + {1}° = {2}°。",
  "The angles lie on opposite sides of the horizontal, so ∠APB = {0}° + {1}° = {2}°."
 ],
 [
  "一個正數的算術平方根為 {0}，求這個正數。",
  "The principal square root of a positive number is {0}. Find the number."
 ],
 [
  "若 √x = {0}，則 x = {1}²。",
  "If √x = {0}, then x = {1}²."
 ],
 [
  "所以 x = {0}。",
  "Therefore x = {0}."
 ],
 [
  "設整數 n 滿足 n < √{0} < n + 1，求 n。",
  "An integer n satisfies n < √{0} < n + 1. Find n."
 ],
 [
  "因此 {0} < √{1} < {2}，n = {3}。",
  "Thus {0} < √{1} < {2}, so n = {3}."
 ],
 [
  "計算 √{0} + ∛(−{1})。",
  "Calculate √{0} + ∛(−{1})."
 ],
 [
  "結果為 {0}。",
  "The result is {0}."
 ],
 [
  "已知 √(x − ({0})) + (y − ({1}))² = 0，求 x + y。",
  "Given √(x − ({0})) + (y − ({1}))² = 0, find x + y."
 ],
 [
  "所以 x + y = {0}。",
  "Therefore x + y = {0}."
 ],
 [
  "點 P({0}, {1}) 向右平移 {2}、向下平移 {3}。求新點橫、縱坐標的和。",
  "Translate P({0}, {1}) right by {2} and down by {3}. Find the sum of the new coordinates."
 ],
 [
  "新坐標為 ({0}, {1})。",
  "The new coordinates are ({0}, {1})."
 ],
 [
  "坐標和 = {0}。",
  "Coordinate sum = {0}."
 ],
 [
  "P({0}, −{1}) 與 Q 關於 x 軸對稱，求 PQ 的長度。",
  "P({0}, −{1}) reflects in the x-axis to Q. Find PQ."
 ],
 [
  "兩點橫坐標相同，距離為 {0} − (−{1}) = {2}。",
  "The x-coordinates agree, so distance = {0} − (−{1}) = {2}."
 ],
 [
  "O(0,0)、A({0},0)、B(0,{1}) 組成三角形，求面積。",
  "Find the area of the triangle with O(0,0), A({0},0) and B(0,{1})."
 ],
 [
  "面積 = {0} × {1}/2 = {2}。",
  "Area = {0} × {1}/2 = {2}."
 ],
 [
  "A({0},{1})、B({2},{3})，點 P 在 x 軸上且 PA = PB。求 P 的橫坐標。",
  "A({0},{1}) and B({2},{3}) are given. P lies on the x-axis with PA = PB. Find the x-coordinate of P."
 ],
 [
  "AB 水平，中點橫坐標為 ({0}+{1})/2。",
  "AB is horizontal, so its midpoint has x-coordinate ({0}+{1})/2."
 ],
 [
  "故 P = ({0},0)。",
  "Therefore P = ({0},0)."
 ],
 [
  "已知 x + y = {0}，x − y = {1}，求 x。",
  "Given x + y = {0} and x − y = {1}, find x."
 ],
 [
  "兩式相加得 2x = {0}。",
  "Adding the equations gives 2x = {0}."
 ],
 [
  "甲票每張 {0} 元、乙票每張 {1} 元。共售 {2} 張，收入 {3} 元。售出甲票多少張？",
  "Tickets A and B cost {0} and {1} currency units each. A total of {2} tickets brings in {3}. How many A tickets were sold?"
 ],
 [
  "設甲票 x 張，乙票 {0} − x 張。",
  "Let x be the A-ticket count; the B-ticket count is {0} − x."
 ],
 [
  "解得甲票 {0} 張。",
  "Solving gives {0} A tickets."
 ],
 [
  "x+y={0}，y+z={1}，z+x={2}。求 x+y+z。",
  "x+y={0}, y+z={1}, z+x={2}. Find x+y+z."
 ],
 [
  "三式相加得 2(x+y+z) = {0}。",
  "Adding the three equations gives 2(x+y+z) = {0}."
 ],
 [
  "所以 x+y+z = {0}。",
  "Therefore x+y+z = {0}."
 ],
 [
  "方程組 x+y={0}，{1}x+{2}y=k 的解滿足 x−y={3}。求 k。",
  "The solution of x+y={0}, {1}x+{2}y=k also satisfies x−y={3}. Find k."
 ],
 [
  "由和與差，x = {0}，y = {1}。",
  "Using the sum and difference gives x = {0}, y = {1}."
 ],
 [
  "代入 k = {0}x + {1}y = {2}。",
  "Substitute: k = {0}x + {1}y = {2}."
 ],
 [
  "不等式 −{0}x > {1} 可寫成 x < c，求 c。",
  "Write −{0}x > {1} as x < c. Find c."
 ],
 [
  "兩邊除以 −{0}，不等號反向。",
  "Divide both sides by −{0} and reverse the inequality."
 ],
 [
  "x < {0}，所以 c = {1}。",
  "x < {0}, so c = {1}."
 ],
 [
  "同時滿足 x > {0} 與 x ≤ {1} 的整數有幾個？",
  "How many integers satisfy both x > {0} and x ≤ {1}?"
 ],
 [
  "整數解從 {0} 到 {1}。",
  "The integer solutions run from {0} to {1}."
 ],
 [
  "個數 = {0} − ({1}) + 1 = {2}。",
  "Count = {0} − ({1}) + 1 = {2}."
 ],
 [
  "預算 {0} 元，先付固定費 {1} 元，每本書 {2} 元。最多買多少本？",
  "A budget of {0} includes a fixed fee of {1}, then {2} currency units per book. What is the greatest number of books you can buy?"
 ],
 [
  "設買 x 本：{0} + {1}x ≤ {2}。",
  "For x books: {0} + {1}x ≤ {2}."
 ],
 [
  "x ≤ {0}，又 x 為非負整數。",
  "x ≤ {0}, with x a nonnegative integer."
 ],
 [
  "最多 {0} 本。",
  "At most {0} books."
 ],
 [
  "不等式組 x > {0}，x < m 恰有 {1} 個整數解，且 m 是整數。求 m。",
  "The system x > {0}, x < m has exactly {1} integer solutions, with m an integer. Find m."
 ],
 [
  "整數解是 {0}、…、m−1，共 m−{1}−1 個。",
  "The integer solutions are {0}, …, m−1, giving m−{1}−1 integers."
 ],
 [
  "m−{0}−1={1}，所以 m={2}。",
  "m−{0}−1={1}, so m={2}."
 ],
 [
  "調查 {0} 人，其中 {1} 人選 A。A 類佔百分之幾？（輸入百分號前數值）",
  "Of {0} people surveyed, {1} choose A. What percentage choose A? Enter the number before the percent sign."
 ],
 [
  "頻率 = {0}/{1} = {2}/10。",
  "Relative frequency = {0}/{1} = {2}/10."
 ],
 [
  "百分比為 {0}%。",
  "The percentage is {0}%."
 ],
 [
  "某類別佔全部人數的 {0}/12，扇形圖中對應圓心角為多少度？",
  "A category contains {0}/12 of all people. What is its sector angle in a pie chart?"
 ],
 [
  "圓心角 = 360 × {0}/12 = {1}°。",
  "Sector angle = 360 × {0}/12 = {1}°."
 ],
 [
  "隨機訪問 {0} 人，{1} 人每天閱讀。若同一總體有 {2} 人，估計每天閱讀的人數。",
  "Among {0} randomly interviewed people, {1} read every day. Estimate how many read daily in the same population of {2}."
 ],
 [
  "樣本比例 = {0}/10。",
  "Sample proportion = {0}/10."
 ],
 [
  "估計總體人數 = {0} × {1}/10 = {2}。",
  "Estimated population count = {0} × {1}/10 = {2}."
 ],
 [
  "A、B、C 三類互不重疊且涵蓋全部，頻數比為 {0}:{1}:{2}。若總數為 {3}，求 B 類頻數。",
  "Categories A, B and C are disjoint and cover everyone, with frequency ratio {0}:{1}:{2}. If the total is {3}, find the frequency of B."
 ],
 [
  "總份數 = {0}，每份 {1}/{2}=10。",
  "Total ratio parts = {0}; each part = {1}/{2}=10."
 ],
 [
  "B 類 = {0} × 10 = {1}。",
  "Category B = {0} × 10 = {1}."
 ],
 [
  "三角形兩內角為 {0}°、{1}°，求第三角。",
  "Two interior angles of a triangle are {0}° and {1}°. Find the third."
 ],
 [
  "第三角 = 180 − {0} − {1} = {2}°。",
  "Third angle = 180 − {0} − {1} = {2}°."
 ],
 [
  "三角形兩邊長 {0}、{1}，第三邊為整數。共有幾種可能的第三邊長？",
  "Two sides of a triangle are {0} and {1}; the third side has integer length. How many third-side lengths are possible?"
 ],
 [
  "第三邊 x 滿足 |{0}−{1}| < x < {2}。",
  "The third side x satisfies |{0}−{1}| < x < {2}."
 ],
 [
  "整數從 {0} 至 {1}，共 {2} 個。",
  "The integers run from {0} to {1}: {2} possibilities."
 ],
 [
  "三角形一個外角為 {0}°，一個不相鄰內角為 {1}°。求另一個不相鄰內角。",
  "A triangle's exterior angle is {0}°, and one nonadjacent interior angle is {1}°. Find the other nonadjacent interior angle."
 ],
 [
  "另一角 = {0} − {1} = {2}°。",
  "The other angle = {0} − {1} = {2}°."
 ],
 [
  "△ABC 中，∠A = {0}°，BI、CI 分別為 ∠B、∠C 的內角平分線，交於 I。求 ∠BIC。",
  "In △ABC, ∠A = {0}°. Internal bisectors BI and CI meet at I. Find ∠BIC."
 ],
 [
  "在 △BIC 中，∠BIC = 180° − (180°−{0}°)/2。",
  "In △BIC, ∠BIC = 180° − (180°−{0}°)/2."
 ],
 [
  "所以 ∠BIC = {0}°。",
  "Therefore ∠BIC = {0}°."
 ],
 [
  "△ABC ≅ △DEF（順序對應），BC = {0}，EF = 2x + {1}。求 x。",
  "△ABC ≅ △DEF in corresponding order. BC = {0} and EF = 2x + {1}. Find x."
 ],
 [
  "BC 對應 EF，因此 2x + {0} = {1}。",
  "BC corresponds to EF, so 2x + {0} = {1}."
 ],
 [
  "P 在 ∠AOB 的平分線上，PM ⟂ OA、PN ⟂ OB，PM = {0}。△OPM 的周長為 {1}。求 OP + ON。",
  "P lies on the bisector of ∠AOB, with PM ⟂ OA, PN ⟂ OB and PM = {0}. The perimeter of △OPM is {1}. Find OP + ON."
 ],
 [
  "OP+OM = 周長−PM = {0}。",
  "OP+OM = perimeter−PM = {0}."
 ],
 [
  "所以 OP+ON = {0}。",
  "Therefore OP+ON = {0}."
 ],
 [
  "△ABC ≅ △DEF，AB={0}、BC={1}、CA={2}（已知能構成三角形）。求兩個三角形的周長總和。",
  "△ABC ≅ △DEF, with AB={0}, BC={1}, CA={2}, which form a triangle. Find the sum of their perimeters."
 ],
 [
  "總和 = 2({0}+{1}+{2}) = {3}。",
  "Total = 2({0}+{1}+{2}) = {3}."
 ],
 [
  "△ABC 中 AB=AC，D 是 BC 中點。已知 ∠BAD={0}°，求 ∠ABC。",
  "In △ABC, AB=AC and D is the midpoint of BC. If ∠BAD={0}°, find ∠ABC."
 ],
 [
  "故 AD 平分 ∠A，∠A = {0}°。",
  "Thus AD bisects ∠A, giving ∠A = {0}°."
 ],
 [
  "兩底角相等，每個為 (180−{0})/2={1}°。",
  "The base angles are equal, each (180−{0})/2={1}°."
 ],
 [
  "等腰三角形一個底角為 {0}°，求頂角。",
  "An isosceles triangle has a base angle of {0}°. Find its vertex angle."
 ],
 [
  "兩底角相等，均為 {0}°。",
  "Both base angles equal {0}°."
 ],
 [
  "頂角 = 180−2×{0}={1}°。",
  "Vertex angle = 180−2×{0}={1}°."
 ],
 [
  "P({0},−{1}) 先關於 x 軸對稱，再關於 y 軸對稱。求最終點的兩坐標之和。",
  "Reflect P({0},−{1}) in the x-axis and then in the y-axis. Find the sum of the final coordinates."
 ],
 [
  "第一次得到 ({0},{1})。",
  "The first reflection gives ({0},{1})."
 ],
 [
  "第二次得到 (−{0},{1})，坐標和={2}。",
  "The second gives (−{0},{1}); the coordinate sum is {2}."
 ],
 [
  "A({0},{1})，P 在 y 軸上。AP + BP 的最小值是多少？其中 B({2},−{3})，且允許 P 是原點。若答案非整數，保留 3 位小數。",
  "A({0},{1}) and B({2},−{3}) are given, with P on the y-axis, including the origin. Find the minimum AP + BP. If nonintegral, round to 3 decimal places."
 ],
 [
  "把 B 關於 y 軸反射到 B′(−{0},−{1})。",
  "Reflect B in the y-axis to B′(−{0},−{1})."
 ],
 [
  "最小值=√(({0})²+({1})²)≈{2}。",
  "Minimum=√(({0})²+({1})²)≈{2}."
 ],
 [
  "等腰三角形兩種邊長為 {0}、{1}。只有一種能構成三角形（已知 {2} ≤ {3}）。求周長。",
  "An isosceles triangle has distinct side lengths {0} and {1}. Only one arrangement forms a triangle; {2} ≤ {3}. Find its perimeter."
 ],
 [
  "若腰長為 {0}，則兩腰之和 {1} 不大於底 {2}，不成立。",
  "Equal sides of length {0} would sum to {1}, no greater than base {2}, so this is impossible."
 ],
 [
  "所以腰長為 {0}、底長為 {1}，周長={2}。",
  "The equal sides are {0} and the base is {1}; perimeter={2}."
 ],
 [
  "展開 ({0}x − {1})²，求 x 項的係數。",
  "Expand ({0}x − {1})² and find the coefficient of x."
 ],
 [
  "完全平方中間項為 −2×{0}x×{1}。",
  "The middle term is −2×{0}x×{1}."
 ],
 [
  "係數是 −{0}。",
  "Its coefficient is −{0}."
 ],
 [
  "(x+{0})(x+{1}) = x² + mx + n，求 m+n。",
  "(x+{0})(x+{1}) = x² + mx + n. Find m+n."
 ],
 [
  "展開得 x²+{0}x+{1}。",
  "Expansion gives x²+{0}x+{1}."
 ],
 [
  "用乘法公式計算 {0} × {1}。",
  "Use a multiplication identity to calculate {0} × {1}."
 ],
 [
  "寫成 ({0}−{1})({2}+{3})。",
  "Write it as ({0}−{1})({2}+{3})."
 ],
 [
  "平方差={0}²−{1}²={2}。",
  "Difference of squares={0}²−{1}²={2}."
 ],
 [
  "已知 a+b={0}，ab={1}，求 a²+b²。",
  "Given a+b={0} and ab={1}, find a²+b²."
 ],
 [
  "x²+{0}x+{1}=(x+m)(x+n)，求 mn。",
  "x²+{0}x+{1}=(x+m)(x+n). Find mn."
 ],
 [
  "比較係數得 mn={0}。",
  "Comparing coefficients gives mn={0}."
 ],
 [
  "利用因式分解計算 ({0}²−{1})/({2}−{3})。",
  "Use factorisation to evaluate ({0}²−{1})/({2}−{3})."
 ],
 [
  "分子=({0}−{1})({2}+{3})。",
  "Numerator=({0}−{1})({2}+{3})."
 ],
 [
  "約去非零因式 {0}−{1}，結果={2}。",
  "Cancel the nonzero factor {0}−{1}: result={2}."
 ],
 [
  "多項式 {0}x² − {1} 的因式包含 x−k，其中 k>0。求 k。",
  "The polynomial {0}x² − {1} has a factor x−k with k>0. Find k."
 ],
 [
  "先提 {0}：{1}(x²−{2})。",
  "Factor out {0}: {1}(x²−{2})."
 ],
 [
  "分解為 {0}(x−{1})(x+{2})，k={3}。",
  "Factorisation gives {0}(x−{1})(x+{2}), so k={3}."
 ],
 [
  "若 x² − {0}x + k 可分解成 (x−{1})(x−m)，求 k。",
  "If x² − {0}x + k factors as (x−{1})(x−m), find k."
 ],
 [
  "比較 x 項：{0}+m={1}，故 m={2}。",
  "Compare the x-coefficient: {0}+m={1}, so m={2}."
 ],
 [
  "常數 k={0}×{1}={2}。",
  "Constant k={0}×{1}={2}."
 ],
 [
  "分式 1/({0}x−{1}) 有意義時，x 不能等於多少？",
  "For 1/({0}x−{1}) to be defined, which value must x exclude?"
 ],
 [
  "分母不為零：{0}x−{1}≠0。",
  "The denominator is nonzero: {0}x−{1}≠0."
 ],
 [
  "所以 x≠{0}。",
  "Therefore x≠{0}."
 ],
 [
  "解 {0}/(x−{1})=1，輸入 x。",
  "Solve {0}/(x−{1})=1. Enter x."
 ],
 [
  "限制 x≠{0}。",
  "Restriction: x≠{0}."
 ],
 [
  "去分母：{0}=x−{1}，x={2}；檢驗分母非零。",
  "Clear denominators: {0}=x−{1}, so x={2}; check the denominator is nonzero."
 ],
 [
  "當 x={0}，求 (x²−{1})/(x−{2}) 的值。",
  "When x={0}, evaluate (x²−{1})/(x−{2})."
 ],
 [
  "x≠{0}，原式約分為 x+{1}。",
  "For x≠{0}, the expression simplifies to x+{1}."
 ],
 [
  "代入得 {0}+{1}={2}。",
  "Substitution gives {0}+{1}={2}."
 ],
 [
  "方程 (x+k)/(x−{0}) = {1} 去分母後得到的唯一候選根恰為禁值 x={2}，求 k。",
  "Clearing denominators in (x+k)/(x−{0}) = {1} gives a unique candidate root equal to the excluded value x={2}. Find k."
 ],
 [
  "去分母得 x+k={0}(x−{1})。",
  "Clearing denominators gives x+k={0}(x−{1})."
 ],
 [
  "令候選根 x={0}，則 {1}+k=0，k=−{2}。",
  "Set the candidate x={0}: {1}+k=0, giving k=−{2}."
 ],
 [
  "√{0} = k√{1}，求 k。",
  "√{0} = k√{1}. Find k."
 ],
 [
  "把被開方數拆為 {0}²×{1}。",
  "Split the radicand into {0}²×{1}."
 ],
 [
  "√{0}+√{1}=k√{2}，求 k。",
  "√{0}+√{1}=k√{2}. Find k."
 ],
 [
  "兩根式分別為 {0}√{1}、{2}√{3}。",
  "The radicals simplify to {0}√{1} and {2}√{3}."
 ],
 [
  "合併後 k={0}。",
  "Combining gives k={0}."
 ],
 [
  "將 1/(√{0}−√{1}) 有理化後可寫為 √{2}+√{3}。求此數與原分母 √{4}−√{5} 的乘積。",
  "Rationalising 1/(√{0}−√{1}) gives √{2}+√{3}. Find its product with the original denominator √{4}−√{5}."
 ],
 [
  "已知 {0}<x<{1}，化簡 √((x−{2})²)+√((x−{3})²) 後的值是多少？",
  "Given {0}<x<{1}, what is the simplified value of √((x−{2})²)+√((x−{3})²)?"
 ],
 [
  "相加得 {0}。",
  "Their sum is {0}."
 ],
 [
  "直角三角形兩直角邊長 {0}、{1}，求斜邊長。",
  "A right triangle has legs {0} and {1}. Find its hypotenuse."
 ],
 [
  "取正根 c={0}。",
  "Take the positive root c={0}."
 ],
 [
  "梯子長 {0} m，底端距牆 {1} m。求頂端離地高度。",
  "A ladder is {0} m long with its foot {1} m from a wall. Find the height of its top above the ground."
 ],
 [
  "長方形長 {0}、寬 {1}，求對角線長與周長的差（周長減對角線）。",
  "A rectangle has length {0} and width {1}. Find its perimeter minus its diagonal length."
 ],
 [
  "對角線為 √({0}²+{1}²)={2}。",
  "Diagonal = √({0}²+{1}²)={2}."
 ],
 [
  "周長=2({0}+{1})={2}。",
  "Perimeter=2({0}+{1})={2}."
 ],
 [
  "差={0}。",
  "Difference={0}."
 ],
 [
  "等腰三角形腰長 {0}，底長 {1}。求面積。",
  "An isosceles triangle has equal sides {0} and base {1}. Find its area."
 ],
 [
  "作底邊高，底邊被平分為 {0}。",
  "Draw the base altitude, which splits the base into lengths {0}."
 ],
 [
  "高=√({0}²−{1}²)={2}。",
  "Height=√({0}²−{1}²)={2}."
 ],
 [
  "面積={0}×{1}/2={2}。",
  "Area={0}×{1}/2={2}."
 ],
 [
  "求 {0} 邊形的內角和。",
  "Find the interior-angle sum of a {0}-sided polygon."
 ],
 [
  "代入 n={0}，得 {1}°。",
  "Substitute n={0}: {1}°."
 ],
 [
  "菱形兩條對角線長 {0}、{1}，求面積。",
  "A rhombus has diagonals {0} and {1}. Find its area."
 ],
 [
  "面積=對角線乘積/2={0}×{1}/2={2}。",
  "Area=half the product of diagonals={0}×{1}/2={2}."
 ],
 [
  "梯形兩底 {0}、{1}，高 {2}。求面積。",
  "A trapezium has parallel sides {0} and {1}, with height {2}. Find its area."
 ],
 [
  "中位線長=({0}+{1})/2。",
  "Midsegment length=({0}+{1})/2."
 ],
 [
  "面積=中位線×高={0}。",
  "Area=midsegment×height={0}."
 ],
 [
  "平行四邊形 ABCD 面積為 {0}。E 是 AB 中點，F 是 CD 中點。求四邊形 AEFD 的面積。",
  "Parallelogram ABCD has area {0}. E and F are the midpoints of AB and CD. Find the area of AEFD."
 ],
 [
  "面積={0}/2={1}。",
  "Area={0}/2={1}."
 ],
 [
  "函數 y={0}x+{1}，當 x={2} 時 y 是多少？",
  "For y={0}x+{1}, find y when x={2}."
 ],
 [
  "將 x={0} 代入解析式。",
  "Substitute x={0} into the rule."
 ],
 [
  "水箱原有 {0} L，每分鐘注入 {1} L。{2} 分鐘後有多少升水（未注滿）？",
  "A tank initially holds {0} L and receives {1} L per minute. How much water is present after {2} minutes, before it is full?"
 ],
 [
  "空水箱容量 {0} L，以每分鐘 {1} L 注水。模型 V={2}t 只描述注滿前的過程，t 的最大值是多少？",
  "An empty tank holds {0} L and fills at {1} L per minute. V={2}t models only the process up to filling. What is the maximum t?"
 ],
 [
  "注滿時 {0}t={1}。",
  "At capacity, {0}t={1}."
 ],
 [
  "t={0}，因此時間範圍是 [0,{1}]。",
  "t={0}, giving time interval [0,{1}]."
 ],
 [
  "停車首 {0} 小時合共 {1} 元，其後每小時 {2} 元（按整小時計）。停車 {3} 小時要付多少元？",
  "Parking costs {1} for the first {0} hours, then {2} currency units per additional whole hour. What is the cost for {3} hours?"
 ],
 [
  "超出基本時段的時間是 {0}−{1}={2} 小時。",
  "Additional time = {0}−{1}={2} hours."
 ],
 [
  "費用={0}+{1}×{2}={3} 元。",
  "Cost={0}+{1}×{2}={3} currency units."
 ],
 [
  "直線 y={0}x+({1}) 與 y 軸相交於 (0,c)，求 c。",
  "The line y={0}x+({1}) meets the y-axis at (0,c). Find c."
 ],
 [
  "直線通過 (0,{0}) 和 ({1},{2})，求斜率。",
  "A line passes through (0,{0}) and ({1},{2}). Find its gradient."
 ],
 [
  "直線 y={0}x−{1} 與 x 軸交於 (a,0)，求 a。",
  "The line y={0}x−{1} meets the x-axis at (a,0). Find a."
 ],
 [
  "方案 A 收 {0} 元固定費，每次 {1} 元；方案 B 收 {2} 元固定費，每次 {3} 元。使用多少次時兩方案總費用相同？",
  "Plan A charges a fixed {0} plus {1} per use; plan B charges a fixed {2} plus {3} per use. After how many uses are the costs equal?"
 ],
 [
  "設次數 x，{0}+{1}x={2}+{3}x。",
  "For x uses, {0}+{1}x={2}+{3}x."
 ],
 [
  "x={0} 次；超過此數時 B 較便宜。",
  "x={0} uses; beyond this, B is cheaper."
 ],
 [
  "數據 {0}、{1}、{2}、{3}、{4} 的中位數是多少？",
  "Find the median of {0}, {1}, {2}, {3}, {4}."
 ],
 [
  "中央第 3 個數為 {0}。",
  "The third, central value is {0}."
 ],
 [
  "平時 {0} 分佔 {1}%，測驗 {2} 分佔 {3}%。求加權總分。",
  "Coursework score {0} has weight {1}%, and test score {2} has weight {3}%. Find the weighted total."
 ],
 [
  "總分={0}×{1}/10+{2}×{3}/10。",
  "Total={0}×{1}/10+{2}×{3}/10."
 ],
 [
  "結果={0}。",
  "Result={0}."
 ],
 [
  "數據 {0}、{1}、{2} 的方差是多少？本題以數據個數 n=3 作分母，可輸入分數。",
  "Find the variance of {0}, {1}, {2}. Use the data count n=3 as denominator. Fractions are accepted."
 ],
 [
  "平均數為 {0}，離均差是 −{1}、0、{2}。",
  "The mean is {0}; deviations are −{1}, 0 and {2}."
 ],
 [
  "方差=({0}+0+{1})/3={2}/3。",
  "Variance=({0}+0+{1})/3={2}/3."
 ],
 [
  "{0} 個數的平均數是 {1}，加入一個數 x 後，平均數是 {2}（此數值保留 8 位小數）。求 x，取最接近的整數。",
  "The mean of {0} numbers is {1}. After adding x, the mean is {2}, shown to 8 decimal places. Find x, rounded to the nearest integer."
 ],
 [
  "原總和={0}。",
  "Original sum={0}."
 ],
 [
  "新總和≈{0}×{1}={2}。",
  "New sum≈{0}×{1}={2}."
 ],
 [
  "新增數 x≈{0}。",
  "Added number x≈{0}."
 ],
 [
  "A={1,2,…,{0}}，B={{1},{2},…,{3}}。求 |A∩B|。",
  "A={1,2,…,{0}}, B={{1},{2},…,{3}}. Find |A∩B|."
 ],
 [
  "共同元素從 {0} 至 {1}。",
  "The common elements run from {0} to {1}."
 ],
 [
  "個數={0}−{1}+1={2}。",
  "Count={0}−{1}+1={2}."
 ],
 [
  "班中 {0} 人喜歡代數，{1} 人喜歡幾何，{2} 人兩者皆喜歡。至少喜歡一項的有多少人？",
  "In a class, {0} like algebra, {1} like geometry and {2} like both. How many like at least one?"
 ],
 [
  "並集個數={0}+{1}−{2}={3}。",
  "Union count={0}+{1}−{2}={3}."
 ],
 [
  "全集 U={1,2,…,{0}}，A={1,2,…,{1}}。A 的補集有多少個元素？",
  "The universal set is U={1,2,…,{0}}, and A={1,2,…,{1}}. How many elements are in the complement of A?"
 ],
 [
  "補集元素是 {0} 至 {1}。",
  "The complement runs from {0} to {1}."
 ],
 [
  "元素個數={0}。",
  "Number of elements={0}."
 ],
 [
  "A=[{0},{1}]，B=[m,m+{2}]。若 A⊆B，求 m。",
  "A=[{0},{1}], B=[m,m+{2}]. If A⊆B, find m."
 ],
 [
  "包含要求 m≤{0} 且 m+{1}≥{2}。",
  "Inclusion requires m≤{0} and m+{1}≥{2}."
 ],
 [
  "後者給 m≥{0}，故 m={1}。",
  "The latter gives m≥{0}, hence m={1}."
 ],
 [
  "有多少個整數 x 可作為「對所有實數 x，都有 x² > {0}」的反例？",
  "How many integers provide counterexamples to 'x² > {0} for every real x'?"
 ],
 [
  "反例須滿足 x²≤{0}，即 −{1}≤x≤{2}。",
  "A counterexample satisfies x²≤{0}, namely −{1}≤x≤{2}."
 ],
 [
  "整數由 −{0} 至 {1}，共 {2} 個。",
  "Integers from −{0} to {1} give {2} counterexamples."
 ],
 [
  "在實數範圍，「x={0}」是「x²={1}」的甚麼條件？",
  "Over the reals, what kind of condition is 'x={0}' for 'x²={1}'?"
 ],
 [
  "反向還可能 x=−{0}，故不必要。",
  "The reverse also allows x=−{0}, so the condition is not necessary."
 ],
 [
  "命題「所有實數 x 都滿足 x>{0}」的否定是？",
  "What is the negation of 'Every real x satisfies x>{0}'?"
 ],
 [
  "存在實數 x，使 x≤{0}",
  "There exists a real x with x≤{0}"
 ],
 [
  "所有實數 x 都滿足 x≤{0}",
  "Every real x satisfies x≤{0}"
 ],
 [
  "存在實數 x，使 x<{0}",
  "There exists a real x with x<{0}"
 ],
 [
  "所有實數 x 都滿足 x<{0}",
  "Every real x satisfies x<{0}"
 ],
 [
  "在條件 p：x>m，q：x>{0} 中，若 p 是 q 的必要但不充分條件，且 m 為整數，求 m 的最大值。",
  "Let p: x>m and q: x>{0}. If p is necessary but not sufficient for q and m is an integer, find the greatest m."
 ],
 [
  "必要條件要求 q⇒p，故 m≤{0}。",
  "Necessity requires q⇒p, so m≤{0}."
 ],
 [
  "若 m={0} 則充要；不充分要求 m<{1}。",
  "If m={0}, the conditions are equivalent; insufficiency requires m<{1}."
 ],
 [
  "最大整數 m={0}。",
  "The greatest integer is m={0}."
 ],
 [
  "不等式 (x−({0}))(x−({1}))<0 的整數解有幾個？",
  "How many integers satisfy (x−({0}))(x−({1}))<0?"
 ],
 [
  "首項係數為正，解集為 ({0},{1})。",
  "The leading coefficient is positive, so the solution set is ({0},{1})."
 ],
 [
  "整數個數={0}。",
  "Number of integers={0}."
 ],
 [
  "對所有實數 x，x²−{0}x+m≥0。求 m 的最小值。",
  "x²−{0}x+m≥0 for every real x. Find the least m."
 ],
 [
  "配方為 (x−{0})²+m−{1}。",
  "Complete the square: (x−{0})²+m−{1}."
 ],
 [
  "最小值是 m−{0}，故 m≥{1}。",
  "The minimum is m−{0}, so m≥{1}."
 ],
 [
  "不等式 −(x−({0}))(x−({1}))≥0 的解集為 [a,b]，求兩端點之和。",
  "The solution of −(x−({0}))(x−({1}))≥0 is [a,b]. Find a+b."
 ],
 [
  "解集為 [{0},{1}]，端點和={2}。",
  "The solution is [{0},{1}], with endpoint sum {2}."
 ],
 [
  "不等式 x²−{0}x+k<0 的解集為 ({1},{2})，求 k。",
  "The solution of x²−{0}x+k<0 is ({1},{2}). Find k."
 ],
 [
  "由因式分解，常數 k=({0})({1})={2}。",
  "By factorisation, constant k=({0})({1})={2}."
 ],
 [
  "f(x)=x²+({0})x+{1}。求 f(x) 除以 x−({2}) 的餘式。",
  "f(x)=x²+({0})x+{1}. Find the remainder on division by x−({2})."
 ],
 [
  "由餘式定理，餘式為 f({0})。",
  "By the remainder theorem, the remainder is f({0})."
 ],
 [
  "代入得 {0}。",
  "Substitution gives {0}."
 ],
 [
  "若 x−{0} 是 x²+kx−{1} 的因式，求 k。",
  "If x−{0} divides x²+kx−{1}, find k."
 ],
 [
  "因式定理給 {0}²+{1}k−{2}=0。",
  "The factor theorem gives {0}²+{1}k−{2}=0."
 ],
 [
  "除以 {0}：{1}+k−{2}=0，k={3}。",
  "Divide by {0}: {1}+k−{2}=0, giving k={3}."
 ],
 [
  "多項式 f(x) 除以 x−{0} 的餘式為 {1}。求 [2f(x)+x] 除以 x−{2} 的餘式。",
  "Dividing f(x) by x−{0} leaves remainder {1}. Find the remainder when 2f(x)+x is divided by x−{2}."
 ],
 [
  "已知 f({0})={1}。",
  "Given f({0})={1}."
 ],
 [
  "新餘式=2f({0})+{1}={2}。",
  "New remainder=2f({0})+{1}={2}."
 ],
 [
  "f(x) 除以 (x−{0})(x−{1}) 的餘式為 px+q。若 f({2})={3}，f({4})={5}，求 p。",
  "The remainder of f(x) on division by (x−{0})(x−{1}) is px+q. Given f({2})={3} and f({4})={5}, find p."
 ],
 [
  "代兩根得 {0}p+q={1}、{2}p+q={3}。",
  "Substitute the roots: {0}p+q={1} and {2}p+q={3}."
 ],
 [
  "相減：{0}p={1}，p={2}。",
  "Subtract: {0}p={1}, so p={2}."
 ],
 [
  "f(x)={0}x²+1，求 f({1})。",
  "f(x)={0}x²+1. Find f({1})."
 ],
 [
  "代入：{0}×({1})²+1。",
  "Substitute: {0}×({1})²+1."
 ],
 [
  "f(x)={0}x+{1}，g(x)=x²。求 f(g({2}))。",
  "f(x)={0}x+{1}, g(x)=x². Find f(g({2}))."
 ],
 [
  "先算 g({0})={1}。",
  "First g({0})={1}."
 ],
 [
  "再算 f({0})={1}。",
  "Then f({0})={1}."
 ],
 [
  "函數 f(x)=√(x−{0})/(x−{1}) 的定義域是？",
  "What is the domain of f(x)=√(x−{0})/(x−{1})?"
 ],
 [
  "[{0},+∞) 且 x≠{1}",
  "[{0},+∞), with x≠{1}"
 ],
 [
  "({0},+∞) 且 x≠{1}",
  "({0},+∞), with x≠{1}"
 ],
 [
  "根號要求 x≥{0}。",
  "The square root requires x≥{0}."
 ],
 [
  "分母要求 x≠{0}，兩限制同時滿足。",
  "The denominator requires x≠{0}; both conditions must hold."
 ],
 [
  "f 是奇函數，且 f({0})={1}。求 f(−{2})+f(0)。",
  "f is odd, with f({0})={1}. Find f(−{2})+f(0)."
 ],
 [
  "奇函數 f(−{0})=−f({1})=−{2}。",
  "Oddness gives f(−{0})=−f({1})=−{2}."
 ],
 [
  "0 在本題定義域，f(0)=0，因此和為 −{0}。",
  "Zero is in the given domain, so f(0)=0 and the sum is −{0}."
 ],
 [
  "求 log_{0}({1})。",
  "Find log_{0}({1})."
 ],
 [
  "因為 {0}^{1}={2}。",
  "Because {0}^{1}={2}."
 ],
 [
  "故對數值為 {0}。",
  "Therefore the logarithm is {0}."
 ],
 [
  "解 log_{0}(x−{1})={2}，求 x。",
  "Solve log_{0}(x−{1})={2} for x."
 ],
 [
  "先要求 x>{0}。",
  "First require x>{0}."
 ],
 [
  "x−{0}={1}^{2}={3}，x={4}，符合限制。",
  "x−{0}={1}^{2}={3}, so x={4}, satisfying the restriction."
 ],
 [
  "求 log_{0}({1}) − log_{2}({3})。",
  "Find log_{0}({1}) − log_{2}({3})."
 ],
 [
  "兩個對數分別為 {0}、{1}。",
  "The two logarithms are {0} and {1}."
 ],
 [
  "相減得 {0}。",
  "Their difference is {0}."
 ],
 [
  "某模型初值 {0}，每期乘 {1}。首次達到或超過 {2} 的期數是多少？",
  "A model starts at {0} and multiplies by {1} per period. In which period does it first reach or exceed {2}?"
 ],
 [
  "第 t 期值為 {0}×{1}ᵗ。",
  "At period t the value is {0}×{1}ᵗ."
 ],
 [
  "條件化為 {0}ᵗ≥{1}={2}^{3}。",
  "The condition is {0}ᵗ≥{1}={2}^{3}."
 ],
 [
  "a>1，故最小整數 t={0}。",
  "Since a>1, the least integer is t={0}."
 ],
 [
  "{0}°=kπ 弧度，求 k（可用分數）。",
  "{0}°=kπ radians. Find k; fractions are accepted."
 ],
 [
  "y={0}sin({1}x) 的周期寫成 kπ，求 k。",
  "The period of y={0}sin({1}x) is kπ. Find k."
 ],
 [
  "θ 是銳角，sinθ={0}/{1}。求 cos²θ（可用分數）。",
  "θ is acute and sinθ={0}/{1}. Find cos²θ; fractions are accepted."
 ],
 [
  "y={0}sin²x+{1}cos²x 的最大值是多少？",
  "Find the maximum of y={0}sin²x+{1}cos²x."
 ],
 [
  "y={0}+({1})sin²x，且 0≤sin²x≤1。",
  "y={0}+({1})sin²x, with 0≤sin²x≤1."
 ],
 [
  "最大值在端點取得，為 {0}。",
  "The maximum occurs at an endpoint and is {0}."
 ],
 [
  "a=({0},{1})，b=({2},{3})，求 a·b。",
  "a=({0},{1}), b=({2},{3}). Find a·b."
 ],
 [
  "非零向量 ({0},{1}) 與 ({2},k) 垂直，求 k。",
  "Nonzero vectors ({0},{1}) and ({2},k) are perpendicular. Find k."
 ],
 [
  "垂直使內積為 0：{0}+{1}k=0。",
  "Perpendicularity gives zero dot product: {0}+{1}k=0."
 ],
 [
  "a=({0},{1})，b=({2},m)。若 a∥b，求 m。",
  "a=({0},{1}), b=({2},m), with a∥b. Find m."
 ],
 [
  "第一坐標表明比例是 {0}。",
  "The first coordinates give scale factor {0}."
 ],
 [
  "第二坐標也按相同比例：m={0}×{1}={2}。",
  "The second coordinates have the same ratio: m={0}×{1}={2}."
 ],
 [
  "已知 |u|²={0}、|v|²={1}、u·v=0。求 |{2}u−v|²。",
  "Given |u|²={0}, |v|²={1}, u·v=0, find |{2}u−v|²."
 ],
 [
  "垂直使中間項為 0，結果={0}×{1}+{2}={3}。",
  "Perpendicularity removes the middle term: {0}×{1}+{2}={3}."
 ],
 [
  "三角形兩邊 {0}、{1} 的夾角為 90°，求面積。",
  "Two sides of a triangle are {0} and {1}, with included angle 90°. Find its area."
 ],
 [
  "sin90°=1，面積={0}。",
  "sin90°=1, so the area is {0}."
 ],
 [
  "三角形兩邊 a={0}、b={1}，夾角 C=60°。求第三邊長的平方 c²。",
  "Two sides are a={0} and b={1}, with included angle C=60°. Find the third side's squared length c²."
 ],
 [
  "△ABC 中 ∠A=30°、∠B=90°，A 的對邊長為 {0}。求 B 的對邊長。",
  "In △ABC, ∠A=30°, ∠B=90°, and the side opposite A is {0}. Find the side opposite B."
 ],
 [
  "由正弦定理 b/sin90°={0}/sin30°。",
  "By the sine rule, b/sin90°={0}/sin30°."
 ],
 [
  "三角形三邊為 {0}、{1}、{2}。求最大角的餘弦值（可輸入分數）。",
  "A triangle has sides {0}, {1}, {2}. Find the cosine of its largest angle; fractions are accepted."
 ],
 [
  "最大角對最長邊 {0}。",
  "The largest angle is opposite the longest side {0}."
 ],
 [
  "由餘弦定理 cos C=({0}²+{1}²−{2}²)/(2×{3}×{4})={5}/{6}。",
  "By the cosine rule, cos C=({0}²+{1}²−{2}²)/(2×{3}×{4})={5}/{6}."
 ],
 [
  "底面積 {0}、高 {1} 的棱錐，體積是多少？",
  "Find the volume of a pyramid with base area {0} and height {1}."
 ],
 [
  "半徑 {0} 的球，表面積為 kπ。求 k。",
  "A sphere of radius {0} has surface area kπ. Find k."
 ],
 [
  "圓錐底半徑 {0}、高 {1}，總表面積為 k₀π。求 k₀。",
  "A cone has base radius {0} and height {1}, with total surface area k₀π. Find k₀."
 ],
 [
  "母線長=√({0}²+{1}²)={2}。",
  "Slant height=√({0}²+{1}²)={2}."
 ],
 [
  "底面積係數={0}，側面積係數={1}。",
  "Base-area coefficient={0}; curved-area coefficient={1}."
 ],
 [
  "總係數={0}。",
  "Total coefficient={0}."
 ],
 [
  "兩個相似立體的小體積是 {0}，大立體對應邊是小立體的 {1} 倍。求大體積。",
  "A smaller solid has volume {0}. A similar larger solid has corresponding lengths {1} times as large. Find its volume."
 ],
 [
  "相似比為 {0}，體積比是 {1}³。",
  "The length ratio is {0}, so the volume ratio is {1}³."
 ],
 [
  "大體積={0}×{1}={2}。",
  "Larger volume={0}×{1}={2}."
 ],
 [
  "y 與 x 成正變；x={0} 時 y={1}。求 x={2} 時的 y。",
  "y varies directly as x. When x={0}, y={1}. Find y when x={2}."
 ],
 [
  "設 y=cx，c={0}/{1}={2}。",
  "Set y=cx: c={0}/{1}={2}."
 ],
 [
  "x={0} 時 y={1}。",
  "When x={0}, y={1}."
 ],
 [
  "y 與 x 成反變，x={0} 時 y={1}。求 x={2} 時的 y。",
  "y varies inversely as x. When x={0}, y={1}. Find y when x={2}."
 ],
 [
  "反變關係 xy=c，c={0}。",
  "Inverse variation gives xy=c, with c={0}."
 ],
 [
  "新 y=c/{0}={1}。",
  "New y=c/{0}={1}."
 ],
 [
  "y 與 x、z 成聯變，當 x={0}、z={1} 時 y={2}。求 x={3}、z={4} 時的 y。",
  "y varies jointly as x and z. When x={0}, z={1}, y={2}. Find y when x={3}, z={4}."
 ],
 [
  "y=kxz；由已知求比例常數 {0}。",
  "y=kxz; the given values determine constant {0}."
 ],
 [
  "代入得 y={0}。",
  "Substitution gives y={0}."
 ],
 [
  "y 的一部分固定，另一部分與 x 成正變。x=1 時 y={0}，x=2 時 y={1}。求 x={2} 時 y。",
  "One part of y is fixed and another varies directly as x. At x=1, y={0}; at x=2, y={1}. Find y at x={2}."
 ],
 [
  "設 y=A+Bx，兩式相減得 B={0}。",
  "Set y=A+Bx; subtracting the equations gives B={0}."
 ],
 [
  "回代得 A={0}。",
  "Substitution gives A={0}."
 ],
 [
  "x^{0} 與 x^{1} 的首一最大公因式是 x^k，求 k。",
  "The monic greatest common divisor of x^{0} and x^{1} is x^k. Find k."
 ],
 [
  "P=(x−1)^{0}(x+1)，Q=(x−1)(x+1)^{1}。求首一最小公倍式的次數。",
  "P=(x−1)^{0}(x+1), Q=(x−1)(x+1)^{1}. Find the degree of their monic least common multiple."
 ],
 [
  "每個因式取最高次冪，LCM=(x−1)^{0}(x+1)^{1}。",
  "Use the highest power of each factor: LCM=(x−1)^{0}(x+1)^{1}."
 ],
 [
  "次數={0}+{1}={2}。",
  "Degree={0}+{1}={2}."
 ],
 [
  "P=(x−1)^{0}，Q=(x−1)^{1}(x+2)^{2}。求首一最大公因式的次數。",
  "P=(x−1)^{0}, Q=(x−1)^{1}(x+2)^{2}. Find the degree of their monic greatest common divisor."
 ],
 [
  "兩式共有 (x−1)，最低次冪為 {0}。",
  "Both contain (x−1), whose smaller exponent is {0}."
 ],
 [
  "故最大公因式為 (x−1)^{0}，次數={1}。",
  "Thus GCD=(x−1)^{0}, with degree {1}."
 ],
 [
  "非零多項式 P、Q 次數分別為 {0}、{1}，其最大公因式次數為 {2}。求最小公倍式次數。",
  "Nonzero polynomials P and Q have degrees {0} and {1}, with GCD degree {2}. Find their LCM degree."
 ],
 [
  "比較次數：deg LCM={0}+{1}−{2}={3}。",
  "Compare degrees: deg LCM={0}+{1}−{2}={3}."
 ],
 [
  "1/[x(x+{0})]=A/x+B/(x+{1})，求 A。",
  "1/[x(x+{0})]=A/x+B/(x+{1}). Find A."
 ],
 [
  "清分母：1=A(x+{0})+Bx。",
  "Clear denominators: 1=A(x+{0})+Bx."
 ],
 [
  "在多項式恆等式代 x=0，A=1/{0}。",
  "Set x=0 in the polynomial identity: A=1/{0}."
 ],
 [
  "{0}/[x(x+{1})]=A/x+B/(x+{2})，求 A+B。",
  "{0}/[x(x+{1})]=A/x+B/(x+{2}). Find A+B."
 ],
 [
  "清分母：{0}=(A+B)x+{1}A。",
  "Clear denominators: {0}=(A+B)x+{1}A."
 ],
 [
  "1/[(x−{0})(x−{1})]=A/(x−{2})+B/(x−{3})，求 B。",
  "1/[(x−{0})(x−{1})]=A/(x−{2})+B/(x−{3}). Find B."
 ],
 [
  "清分母：1=A(x−{0})+B(x−{1})。",
  "Clear denominators: 1=A(x−{0})+B(x−{1})."
 ],
 [
  "代 x={0} 得 B=1/{1}。",
  "Set x={0}: B=1/{1}."
 ],
 [
  "({0}x+{1})/(x−{2})²=A/(x−{3})+B/(x−{4})²，求 B。",
  "({0}x+{1})/(x−{2})²=A/(x−{3})+B/(x−{4})². Find B."
 ],
 [
  "清分母：{0}x+{1}=A(x−{2})+B。",
  "Clear denominators: {0}x+{1}=A(x−{2})+B."
 ],
 [
  "代 x={0}，B={1}。",
  "Set x={0}: B={1}."
 ],
 [
  "正方體 ABCD–A′B′C′D′ 的棱長為 {0}，求頂點 A 到平面 BCC′B′ 的距離。",
  "Cube ABCD–A′B′C′D′ has edge {0}. Find the distance from A to plane BCC′B′."
 ],
 [
  "垂線段 AB 的長度為 {0}，就是所求距離。",
  "The perpendicular segment AB has length {0}, the required distance."
 ],
 [
  "長方體 AB={0}、BC={1}、AA′={2}，求體對角線 AC′ 長。",
  "A cuboid has AB={0}, BC={1}, AA′={2}. Find space diagonal AC′."
 ],
 [
  "底面對角線 AC=√({0}²+{1}²)={2}。",
  "Base diagonal AC=√({0}²+{1}²)={2}."
 ],
 [
  "棱長 {0} 的正方體 ABCD–A′B′C′D′ 中，AB 與 CC′ 的位置關係是？",
  "In cube ABCD–A′B′C′D′ of edge {0}, how are AB and CC′ positioned?"
 ],
 [
  "正方體棱長 {0}。從頂點 A 到與 A 不相鄰且平行於 AB 的棱 C′D′，最短距離的平方是多少？",
  "A cube has edge {0}. Find the squared shortest distance from A to the nonadjacent edge C′D′ parallel to AB."
 ],
 [
  "取 A=(0,0,0)，AB 沿 x 軸，C′D′ 上點為 (t,{0},{1})。",
  "Set A=(0,0,0), with AB along the x-axis. Points on C′D′ have coordinates (t,{0},{1})."
 ],
 [
  "距離平方=t²+2×{0}²，當 t=0（點 D′）最小。",
  "Squared distance=t²+2×{0}², minimised at t=0, point D′."
 ],
 [
  "最小平方={0}。",
  "Minimum squared distance={0}."
 ],
 [
  "A={1,{2}}，以下哪項正確？",
  "For A={1,{2}}, which statement is correct?"
 ],
 [
  "A的兩個元素是數1與集合{2}；數2不是A的元素。",
  "The two elements of A are the number 1 and the set {2}; the number 2 is not an element of A."
 ]
])I.template(...pair);
})(MathStudioI18n);
