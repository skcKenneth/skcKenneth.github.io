import {p,n,w,mathematicalResult,c,meta,build,inquiry} from './advanced-authoring.mjs';
const eq=(en,zh,expr,result,strategy,bridge,derivation,why)=>mathematicalResult(w(en,zh,expr,p(result,result),strategy,bridge,derivation,why),result);
const A=p('Write the defining equation, retain exclusions, and then solve or compare.','寫出定義方程，保留排除條件，再求解或比較。');
const F=p('Express the cash flow or proportional relation before calculating.','先表示現金流或比例關係，再計算。');
const G=p('Identify the relevant geometric theorem and verify its hypotheses.','辨認相關幾何定理，並驗證其前提。');
const banks=[];
function add(id,en,zh,source,focusEn,focusZh,formula,conditionEn,conditionZh,errorEn,errorZh,type,prerequisites,predEn,predZh,transferEn,transferZh,bank){
 const spec=meta('supplement-1-1',p(en,zh),0,p(focusEn,focusZh),[
  c('Model or definition','模型或定義',focusEn,focusZh,formula),c('Conditions','適用條件',conditionEn,conditionZh)
 ],[p(errorEn,errorZh)],prerequisites,inquiry(type,predEn,predZh,'Compare two admissible cases and explain their different results using the stated model.','比較兩個符合條件的情況，利用所述模型解釋結果差異。',transferEn,transferZh),source);
 Object.assign(spec,{id,bookId:'supplement',chapterId:'supplement',section:source.section});
 banks.push({spec,bank});
}
const official=(paper,page,section)=>({documentId:`jae-${paper.toLowerCase()}-2027`,pdfPage:page,printedPage:page,section});
const school=(documentId,pdfPage,section)=>({documentId,pdfPage,printedPage:pdfPage-1,section});

add('sup-partial-fractions','Polynomial division and partial fractions','多項式除法及部分分式',official('JM01',2,'4. Polynomial and rational fractions'),
 'Divide polynomials and choose decomposition numerators matched to each denominator factor.','多項式除法後，按各分母因子選取部分分式的分子。','R(x)=Q(x)+A/(x-a)+B/(x-b)',
 'Record all original excluded roots. Divide improper fractions first; a repeated factor needs every power.','保留原式所有排除根；假分式先作除法，重因子須包括每個次方。','Canceling a factor does not restore an excluded point to the original domain.','約去因子不能把被排除的點加回原定義域。','algebra',['c1-3-1'],
 'Can a canceled factor still create a missing point in the graph?','約去的因子仍會造成圖形上的缺點嗎？','Compare equality as rational expressions with equality of functions on their original domains.','比較有理式相等與原定義域上的函數相等。',(k,t)=>{
 if(k===0)return n('Find the remainder when x²+t is divided by x−2.','求 x²+t 除以 x−2 的餘式。',`t=${t}`,4+t,A,'R=f(2)',[`R=2^2+${t}=${t+4}`],p('The remainder theorem evaluates at the zero of the divisor.','餘式定理使用除式的零點。'));
 if(k===1)return eq('Divide x²+t x+1 by x.','把 x²+t x+1 除以 x。',`t=${t}`,`x+${t}+1/x`,A,'Divide each term by x.',[`(x^2+${t}x+1)/x=x+${t}+1/x`],p('The original domain excludes x=0.','原定義域排除 x=0。'));
 if(k===2)return n('In t/[x(x+1)]=A/x+B/(x+1), find A.','在 t/[x(x+1)]=A/x+B/(x+1) 中，求 A。',`t=${t}`,t,A,'t=A(x+1)+Bx',[`x=0\\Rightarrow A=${t}`,`B=-${t}`],p('Compare polynomial identities after multiplying denominators; the rational identity still excludes 0 and −1.','乘去分母後比較多項式恆等式；有理式恆等式仍排除0及−1。'));
 if(k===3)return n('In (x+t)/[(x−1)(x+1)]=A/(x−1)+B/(x+1), find A.','在所列部分分式中，求 A。',`t=${t},\\quad (x+${t})/[(x-1)(x+1)]`,(t+1)/2,A,'x+t=A(x+1)+B(x-1)',[`x=1\\Rightarrow 1+${t}=2A`,`A=${(t+1)/2}`],p('Evaluating the cleared polynomial identity at x=1 is permitted even though the original fraction excludes that input.','即使原分式排除 x=1，仍可在已乘去分母的多項式恆等式代入該值。'));
 if(k===4)return eq('Decompose the rational expression with its repeated denominator factor.','把含重複分母因子的有理式分解。',`(x+${t})/x^2`,`1/x+${t}/x^2`,A,'A/x+B/x^2', [`Ax+B=x+${t}\\Rightarrow A=1,\\ B=${t}`],p('Both x and x² terms appear; omitting one cannot match the numerator.','須同時保留 x、x² 的分式項；漏掉其中一項便不能配合分子。'));
 if(k===5)return eq('Find quotient and remainder, then express the improper fraction.','求商及餘式，再表示此假分式。',`(x^2+${t})/(x-1)`,`x+1+${t+1}/(x-1)`,A,'x^2+t=(x-1)(x+1)+(t+1)',[`(x-1)(x+1)=x^2-1`,`R=${t+1}`],p('A polynomial part is needed before partial fractions of an improper fraction.','假分式分解前須保留多項式部分。'));
 return eq('Explain the difference between f and g as functions.','說明 f、g 作為函數有何差別。',`f(x)=(x^2-${t*t})/(x-${t}),\\quad g(x)=x+${t}`,`f(x)=g(x)\\ (x\\ne${t});\\quad f(${t})\\text{ undefined}`,A,'x^2-t^2=(x-t)(x+t)',[`f(x)=x+${t}\\quad(x\\ne${t})`],p('The simplified expression agrees on the shared domain but does not fill the hole in f.','化簡式在共同定義域內相等，但不能填補 f 的缺點。'));
});

add('sup-variation-finance','Variation and financial models','變分及財務模型',official('JM01',2,'2, 3 and 8. Percentage, variations, exponential growth'),
 'Identify direct, inverse, joint and partial variation and apply stated interest or depreciation models.','辨認正變、反變、聯變及部分變，運用指定利息或折舊模型。','y=kx;\\ y=k/x;\\ y=kxz;\\ y=a+kx;\\ A=P(1+r)^n',
 'Rates are decimals; all values are idealized models with the stated period and compounding rule.','百分率先轉小數；所有數值均為理想模型，須依指定期間及複利規則計算。','Successive percentage changes multiply their factors rather than add their rates.','連續百分率變化應把變化因子相乘，不是把比率相加。','functions',[],
 'Do a 10% increase and a 10% decrease restore the starting value?','增加10%再減少10%，會回復起始值嗎？','Compare simple, discrete compound and continuous growth under stated hypothetical rates.','在指定假設比率下，比較單利、離散複利及連續增長。',(k,t)=>{
 if(k===0)return n('y varies directly with x; y=t when x=2. Find y when x=6.','y 隨 x 正變；x=2 時 y=t。求 x=6 時 y。',`t=${t}`,3*t,F,'y=kx;\\quad k=t/2',[`y=(${t}/2)6=${3*t}`],p('The constant ratio y/x is preserved.','保持比值 y/x 不變。'));
 if(k===1)return n('y varies inversely with x; y=t at x=2. Find y at x=4.','y 隨 x 反變；x=2 時 y=t。求 x=4 時 y。',`t=${t}`,t/2,F,'xy=k=2t',[`y=${2*t}/4=${t/2}`],p('Doubling x halves y in an inverse model.','反變模型中 x 加倍會使 y 減半。'));
 if(k===2)return n('y varies jointly with x,z and equals t at x=z=1. Find y at x=2,z=3.','y 隨 x、z 聯變；x=z=1 時 y=t。求 x=2、z=3 時 y。',`t=${t}`,6*t,F,'y=kxz;\\quad k=t',[`y=${t}\\cdot2\\cdot3=${6*t}`],p('Both independent multiplicative factors enter the model.','模型包含兩個独立的乘法因子。'));
 if(k===3)return n('y=a+kx; y=t at x=0 and y=t+6 at x=2. Find y at x=3.','y=a+kx；x=0 時 y=t，x=2 時 y=t+6。求 x=3 時 y。',`t=${t}`,t+9,F,'a=t;\\quad 2k=6',[`k=3,\\quad y(${3})=${t}+9=${t+9}`],p('Partial variation has a fixed part as well as a proportional part.','部分變同時具有固定部分及比例部分。'));
 if(k===4)return n('A hypothetical balance starts at 100t and compounds annually at 10% for 2 years. Find final balance.','假設本金為100t，以年利率10%按年複利兩年。求期末結餘。',`t=${t}`,121*t,F,'A=P(1+r)^2',[`A=100(${t})(1.1)^2=${121*t}`],p('This is a stated classroom model, with no extra deposits, charges or rounding policy.','這是題定課堂模型，没有額外存款、費用或舍入規則。'));
 if(k===5)return n('An asset worth 100t loses 20% each year for 2 years. Find final value.','價值100t 的資產每年折舊20%，兩年後值多少？',`t=${t}`,64*t,F,'V=P(1-0.2)^2',[`V=100(${t})(0.8)^2=${64*t}`],p('Depreciation applies to the remaining value each year.','每年折舊作用於當時剩餘價值。'));
 return n('A hypothetical amount 100t grows continuously at rate ln2 per year. Find its value after one year.','假設金額100t 以每年 ln2 的連續增長率增長。求一年後的值。',`t=${t}`,200*t,F,'A=Pe^{ru}',[`A=100(${t})e^{\\ln2}=${200*t}`],p('A continuous rate is used in an exponential, not in the annual discrete-compound factor.','連續比率放在指數函數中，不是離散按年複利因子。'));
});

add('sup-euclidean-circles','Euclidean figures and circle theorems','平面圖形及圓幾何定理',official('JM01',3,'12. Rectilinear figures and circles'),
 'Use similarity, angle and circle theorems with labeled points and compatible arcs.','用有標示的點及相應弧，運用相似、角度及圓幾何定理。','\\text{similarity length ratio }k\\Rightarrow\\text{area ratio }k^2',
 'Inscribed-angle comparisons must subtend the same arc on the stated side; cyclic opposite angles sum to 180°.','圓周角比較須對應同弧及指定側；內接四邊形對角和為180°。','Arc, chord and radius lengths are different quantities.','弧長、弦長及半徑長是不同量。','conics',[],
 'Do similar triangles with doubled sides have doubled areas?','相似三角形的邊長加倍，面積也只加倍嗎？','Compare one theorem proof and a tempting use with the wrong corresponding arc.','比較一份定理證明及一個錯配弧的容易誤用情況。',(k,t)=>{
 const angle=20+t%40;
 if(k===0)return n('A convex polygon has t+3 sides. Find its interior-angle sum in degrees.','凸多邊形有 t+3 條邊。求內角和（度）。',`t=${t}`,180*(t+1),G,'S=(n-2)180^\\circ',[`S=(${t+3}-2)180=${180*(t+1)}`],p('Triangulation from one vertex gives n−2 triangles.','由一個頂點劃分會得到 n−2 個三角形。'));
 if(k===1)return n('A right triangle has legs 3t,4t. Find the hypotenuse.','直角三角形兩直角邊為3t、4t。求斜邊。',`t=${t}`,5*t,G,'c^2=(3t)^2+(4t)^2',[`c=5(${t})=${5*t}`],p('Pythagoras applies to the legs opposite the right angle.','畢氏定理用於直角兩側的邊及其對面的斜邊。'));
 if(k===2)return n('Similar triangles have length ratio 2:3. The smaller area is 4t. Find the larger area.','相似三角形邊長比2:3，較小面積為4t。求較大面積。',`t=${t}`,9*t,G,'Area ratio=(2/3)^2',[`A_{\\rm large}=4(${t})\\cdot9/4=${9*t}`],p('Area ratios square the corresponding length ratio.','面積比為對應邊長比的平方。'));
 if(k===3)return n('A central angle subtends a minor arc of 2a°. Find an inscribed angle subtending that same arc.','圓心角對應小弧為2a°，求對應同一小弧的圓周角。',`a=${angle}`,angle,G,'\\angle_{\\rm inscribed}=\\angle_{\\rm central}/2',[`\\angle=${2*angle}/2=${angle}^\\circ`],p('The angle must subtend the stated same arc.','該角必須對應題目所述同一弧。'));
 if(k===4)return n('A cyclic quadrilateral has one interior angle a°. Find its opposite interior angle.','圓內接四邊形某內角為 a°。求其對角。',`a=${angle}`,180-angle,G,'Opposite angles sum to 180^\\circ.',[`\\beta=180-${angle}=${180-angle}^\\circ`],p('It is the opposite angle, not an adjacent angle.','所求為對角，不是鄰角。'));
 if(k===5)return n('A circle of radius t has a sector angle π/3 radians. Find its sector area.','半徑 t 的圓，扇形角為 π/3 弧度。求扇形面積。',`t=${t}`,Math.PI*t*t/6,G,'A=r^2\\theta/2',[`A=${t*t}\\pi/6`],p('The radian formula requires radians, and area scales with radius squared.','此公式要求弧度，且面積隨半徑平方變化。'));
 return n('A chord of a circle radius 5t is distance 3t from the center. Find its length.','半徑5t 的圓，弦到圓心距離為3t。求弦長。',`t=${t}`,8*t,G,'The perpendicular from center bisects the chord.',[`(L/2)^2=(${5*t})^2-(${3*t})^2=${16*t*t}`,`L=${8*t}=${8*t}`],p('The right-triangle calculation gives half the chord first.','直角三角形計算先得到半弦長。'));
});

add('sup-linear-programming','Linear programming and discrete feasibility','線性規劃及整數可行性',school('school-t04',11,'III. Simple linear programming'),
 'Draw a feasible region and optimise a linear objective, then check integer restrictions when required.','繪出可行區域並優化線性目標；需要時再檢查整數限制。','z=ax+by',
 'A vertex search needs a nonempty bounded polygon or a justified finite optimum; integer solutions may differ from continuous optima.','頂點搜尋須有非空有界多邊形或合理有限最佳值；整數解可能與連續最佳解不同。','An objective has no optimum if it is unbounded in an improving feasible direction.','若有可行方向使目標無界改善，便没有最佳值。','algebra',['s1-2-2'],
 'Must rounding a continuous optimum preserve feasibility?','把連續最佳解舍入，必定保持可行嗎？','Compare vertex optimisation with explicit enumeration of nearby integer points.','比較頂點最佳化及鄰近整數點的明確列舉。',(k,t)=>{
 if(k===0)return n('Is (t,0) feasible? Enter 1 for yes, 0 for no.','(t,0) 是否可行？是輸入1，否輸入0。',`x,y\\ge0,\\quad x+y\\le${t}`,1,A,'Substitute both coordinates.',[`${t}+0\\le${t}`],p('The boundary is included by the non-strict inequality.','非嚴格不等式包含邊界。'));
 if(k===1)return n('Maximise z=x+y over x,y≥0 and x+y≤t.','在 x,y≥0、x+y≤t 下，求 z=x+y 的最大值。',`t=${t}`,t,A,'The objective equals the bounded constraint.',[`z\\le${t};\\quad (x,y)=(${t},0)\\text{ attains equality}`],p('Every point on the upper boundary attains the same optimum.','上方邊界上的每一點都達到同一最佳值。'));
 if(k===2)return n('Maximise z=2x+y over x,y≥0 and x+y≤t.','在 x,y≥0、x+y≤t 下，求 z=2x+y 的最大值。',`t=${t}`,2*t,A,'Evaluate vertices (0,0),(t,0),(0,t).',[`z=0,${2*t},${t}\\Rightarrow z_{\\max}=${2*t}`],p('The x-resource receives the larger objective coefficient.','x 的目標係數較大。'));
 if(k===3)return n('Minimise x+y for x,y≥0 and x+y≥t.','在 x,y≥0、x+y≥t 下，求 x+y 的最小值。',`t=${t}`,t,A,'The lower boundary is feasible.',[`x+y\\ge${t}\\text{ with equality at }(${t},0)`],p('An unbounded region can still have a finite minimum.','無界區域仍可能有有限最小值。'));
 if(k===4)return eq('Does the displayed objective have a maximum over x,y≥0?','在 x,y≥0 下，所列目標函數有最大值嗎？',`z=${t}x+y`,'\\text{unbounded above}',A,'Try the feasible ray (x,y)=(s,0).',[`z=${t}s\\to\\infty`],p('No resource constraint blocks growth along the feasible ray.','沒有資源限制阻止沿可行射線增長。'));
 if(k===5)return n('For integer x,y≥0 and 2x+2y≤2t+1, find max(x+y).','x、y 為非負整數，2x+2y≤2t+1。求 x+y 的最大值。',`t=${t}`,t,A,'x+y\\le t+1/2;\\quad x+y\\in\\mathbb Z',[`x+y\\le${t}\\text{ and }(${t},0)\\text{ is feasible}`],p('The integer optimum differs from the continuous boundary value t+1/2.','整數最佳值不同於連續邊界值 t+1/2。'));
 return n('Production uses 2 units per x item and 1 per y item, with 2t units available. Profit is 3x+y. Find maximum continuous profit.','產品 x 每件用2單位資源，y 每件用1單位，共有2t；利潤為3x+y。求連續模型最大利潤。',`x,y\\ge0,\\ 2x+y\\le${2*t}`,3*t,A,'Vertices (0,0),(t,0),(0,2t).',[`z=0,${3*t},${2*t}\\Rightarrow z_{\\max}=${3*t}`],p('Compare profit per resource; distinguish the stated continuous model from an integer production model.','比較每單位資源的利潤，並區分題定連續模型與整數生產模型。'));
});

add('sup-matrices','Matrices, determinants and linear systems','矩陣、行列式及線性方程組',official('JM02',2,'3. Systems, matrices and determinants'),
 'Add and multiply matrices, use determinants and solve systems without assuming invertibility.','矩陣加乘、使用行列式及解方程組，避免假設所有矩陣均可逆。','\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc',
 'Matrix products require matched inner dimensions; a square matrix has an inverse only if its determinant is nonzero.','矩陣乘法的內側維度須相同；方陣只有行列式非零時才有逆矩陣。','Matrix multiplication is not generally commutative.','矩陣乘法通常不交換。','algebra',[],
 'Can AB and BA have different entries even when both products exist?','AB、BA 均存在時，元素仍可能不同嗎？','Compare a shear and a coordinate projection in both orders.','以兩種次序比較剪切及座標投影。',(k,t)=>{
 if(k===0)return n('Find det A.','求 det A。',`A=\\begin{pmatrix}${t}&1\\\\2&3\\end{pmatrix}`,3*t-2,A,'det A=ad-bc',[`det A=3(${t})-2=${3*t-2}`],p('Multiply diagonals with the correct subtraction order.','以正確相減次序計算兩條對角線乘積。'));
 if(k===1)return n('Find the (1,2) entry of AB.','求 AB 的 (1,2) 元素。',`A=\\begin{pmatrix}1&${t}\\\\0&1\\end{pmatrix},\\ B=\\begin{pmatrix}2&3\\\\1&4\\end{pmatrix}`,3+4*t,A,'(AB)_{12}=A_{11}B_{12}+A_{12}B_{22}',[`(AB)_{12}=3+4(${t})=${3+4*t}`],p('Use a row of A and a column of B, not matching positions.','使用 A 的一列及 B 的一欄，不是把同位置元素相乘。'));
 if(k===2)return n('Find x in the system.','求聯立方程中的 x。',`x+y=${t+2},\\quad x-y=${t}`,t+1,A,'Add equations to eliminate y.',[`2x=${2*t+2}\\Rightarrow x=${t+1}`],p('The coefficient determinant is nonzero, so the solution is unique.','係數行列式非零，因此解唯一。'));
 if(k===3)return eq('Find A⁻¹.','求 A⁻¹。',`A=\\begin{pmatrix}1&${t}\\\\0&1\\end{pmatrix}`,`A^{-1}=\\begin{pmatrix}1&-${t}\\\\0&1\\end{pmatrix}`,A,'Use the triangular inverse and verify AA^{-1}=I.',[`\\begin{pmatrix}1&${t}\\\\0&1\\end{pmatrix}\\begin{pmatrix}1&-${t}\\\\0&1\\end{pmatrix}=I`],p('An explicit product verifies the inverse without relying on a memorized sign pattern.','明確乘積可驗證逆矩陣，避免只靠記憶正負模式。'));
 if(k===4)return n('Find the determinant of the triangular 3×3 matrix.','求三階三角矩陣的行列式。',`A=\\begin{pmatrix}${t}&1&2\\\\0&2&3\\\\0&0&4\\end{pmatrix}`,8*t,A,'A triangular determinant is the diagonal product.',[`det A=${t}\\cdot2\\cdot4=${8*t}`],p('Off-diagonal entries do not change a triangular determinant.','三角矩陣的非對角元素不改變行列式。'));
 if(k===5)return eq('Classify the solutions of the system.','分類此聯立方程的解。',`x+y=${t},\\quad2x+2y=${2*t}`,`(x,y)=(s,${t}-s),\\ s\\in\\mathbb R`,A,'The second equation is twice the first.',[`y=${t}-x`],p('A zero determinant does not by itself mean no solution; this consistent system has infinitely many.','行列式為零本身不表示無解；此相容系統有無限多解。'));
 return eq('Show AB≠BA for the specified matrices.','對所給矩陣證明 AB≠BA。',`A=\\begin{pmatrix}1&${t}\\\\0&1\\end{pmatrix},\\ B=\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}`,`AB=\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix},\\ BA=\\begin{pmatrix}1&${t}\\\\0&0\\end{pmatrix}`,A,'Compute both products separately.',[`(AB)_{12}=0,\\quad(BA)_{12}=${t}\\ne0`],p('One unequal entry is sufficient to disprove commutativity.','只須一個元素不同即可反證交換性。'));
});

add('sup-polar','Polar coordinates','極座標',official('JM02',2,'4. Coordinate geometry: polar coordinates'),
 'Convert representations and eliminate polar variables without losing the geometric range.','轉換座標表示，消去極座標變量時保留幾何範圍。','x=r\\cos\\theta,\\quad y=r\\sin\\theta',
 'Angles are in radians; r≥0 is used unless a signed-radius convention is explicitly allowed. The origin has no unique polar angle.','角度採弧度；除非明確允許帶符號半徑，否則 r≥0。原點的極角不唯一。','Equivalent angles differ by 2π; the same point may also have a signed negative-radius representation.','等價角可相差2π；帶符號負半徑亦可表示同一點。','trigonometry',[],
 'Does adding π to an angle preserve the point when r stays positive?','半徑保持正數時，極角加 π 會保留同一點嗎？','Compare θ+2π and the signed-radius pair (−r,θ+π).','比較 θ+2π 及帶符號半徑對 (−r,θ+π)。',(k,t)=>{
 if(k===0)return n('Find x for the polar point.','求極座標點的 x。',`(r,\\theta)=(${t},0)`,t,A,'x=r\\cos\\theta',[`x=${t}\\cos0=${t}`],p('Angle zero points along the positive x-axis.','角零指向正 x 軸。'));
 if(k===1)return n('Find y for the polar point.','求極座標點的 y。',`(r,\\theta)=(${t},\\pi/2)`,t,A,'y=r\\sin\\theta',[`y=${t}\\sin(\\pi/2)=${t}`],p('The π/2 direction lies on the positive y-axis.','π/2 方向位於正 y 軸。'));
 if(k===2)return n('Find r≥0 for the Cartesian point.','求直角座標點的 r≥0。',`P=(${3*t},${4*t})`,5*t,A,'r=\\sqrt{x^2+y^2}',[`r=\\sqrt{${9*t*t}+${16*t*t}}=${5*t}`],p('Use the nonnegative distance from the origin.','使用到原點的非負距離。'));
 if(k===3)return eq('Give a positive-radius polar representation of (−t,0).','寫出 (−t,0) 的正半徑極座標表示。',`t=${t}`,`(r,\\theta)=(${t},\\pi)`,A,'The point is on the negative x-axis.',[`x=${t}\\cos\\pi=-${t},\\quad y=0`],p('The angle is π rather than zero when radius is positive.','半徑為正時，此點極角為 π，不是零。'));
 if(k===4)return eq('Convert the polar curve to Cartesian form.','把極座標曲線轉成直角座標式。',`r=${2*t}\\cos\\theta`,`(x-${t})^2+y^2=${t*t}`,A,'Multiply by r and use r²=x²+y².',[`r^2=2(${t})r\\cos\\theta`,`x^2+y^2=${2*t}x`,`(x-${t})^2+y^2=${t*t}`],p('Under r≥0, only cosθ≥0 contributes nonzero points, but the complete Cartesian circle is still traced.','r≥0 時，非零點要求 cosθ≥0，但仍可描出完整直角座標圓。'));
 if(k===5)return eq('Under the signed-radius convention, show that the two polar pairs represent the same point.','在帶符號半徑慣例下，證明兩個極座標對表示同一點。',`(${t},\\pi/3),\\quad(-${t},4\\pi/3)`,`x=${t}/2,\\quad y=${t}\\sqrt3/2`,A,'cos(θ+π)=−cosθ; sin(θ+π)=−sinθ.',[`(-${t})\\cos(4\\pi/3)=${t}/2`,`(-${t})\\sin(4\\pi/3)=${t}\\sqrt3/2`],p('The sign of the radius cancels the reversed direction.','半徑負號抵消反向方向。'));
 const d=2+t%7;return eq('Describe the displayed polar locus with r≥0, and compare it with its full supporting line.','描述所列 r≥0 的極座標軌跡，並與整條支撐直線比較。',`\\theta=\\pi/${d},\\quad r\\ge0`,(d===2?'x=0, y\\ge0':`y=\\tan(\\pi/${d})x,\\quad x\\ge0`),A,p('Use both coordinate relations and retain the nonnegative radius.','使用兩個座標關係，並保留半徑非負的條件。'),[`${d==2?'x=0, y=r\\ge0':`y=\\tan(\\pi/${d})x, x\\ge0`}`],p('The polar locus is a ray; dropping the sign restriction would add the opposite ray.','極座標軌跡為射線；漏掉正負限制會加上反向射線。'));
});

add('sup-integrals','Integration, area and school extensions','積分、面積及校本延伸',official('JM02',2,'6. Basic calculus: integrals and area'),
 'Find antiderivatives, evaluate definite integrals and distinguish signed accumulation from geometric area.','求原函數及定積分，區分有向累積與幾何面積。','\\int_a^bf(x)dx=F(b)-F(a)',
 'An indefinite integral includes an arbitrary constant; split at sign changes when calculating area. Revolution volumes are a school extension (T06 PDF6–10).','不定積分須有任意常數；計算面積須在正負號改變處分段。旋轉體積屬校本延伸（T06 PDF6–10）。','A negative definite integral is not a negative geometric area.','定積分可為負，但幾何面積不能為負。','calculus',['s2-5-2'],
 'Can the signed integral be zero while the total area is positive?','有向積分為零時，總面積仍可為正嗎？','Compare x on a symmetric interval with |x| on that interval.','比較對稱區間上 x 及 |x| 的積分。',(k,t)=>{
 if(k===0)return eq('Find all antiderivatives of tx².','求 tx² 的所有原函數。',`t=${t}`,`${t}x^3/3+C`,A,'Raise the power and divide by the new exponent.',[`d(${t}x^3/3+C)/dx=${t}x^2`],p('The derivative check confirms the power and constant.','求導檢查可確認指數及常數。'));
 if(k===1)return n('Evaluate the definite integral.','計算定積分。',`\\int_0^{${t}}2x\\,dx`,t*t,A,'F(x)=x^2',[`F(${t})-F(0)=${t*t}`],p('A definite integral has a value, not an arbitrary integration constant.','定積分為數值，不保留任意積分常數。'));
 if(k===2)return n('Evaluate the signed integral.','計算有向積分。',`\\int_{-${t}}^${t}x\\,dx`,0,A,'Use odd symmetry or the antiderivative.',[`[x^2/2]_{-${t}}^${t}=0`],p('The two signed contributions cancel.','兩部分的有向貢獻相消。'));
 if(k===3)return n('Find the geometric area between y=x and the x-axis on [−t,t].','求 [−t,t] 上 y=x 與 x 軸之間的幾何面積。',`t=${t}`,t*t,A,'Area=\\int_{-t}^0(-x)dx+\\int_0^txdx',[`A=${t*t}/2+${t*t}/2=${t*t}`],p('Use the absolute value of the integrand for area.','面積使用被積函數的絕對值。'));
 if(k===4)return n('Find the area between y=t and y=x for 0≤x≤t.','求 0≤x≤t 上 y=t 與 y=x 之間面積。',`t=${t}`,t*t/2,A,'A=\\int_0^t(t-x)dx',[`A=[${t}x-x^2/2]_0^{${t}}=${t*t}/2`],p('Top minus bottom is nonnegative throughout this interval.','此區間中，上方函數減下方函數均非負。'));
 if(k===5)return n('F′(x)=2x and F(0)=t. Find F(2).','F′(x)=2x 且 F(0)=t。求 F(2)。',`t=${t}`,t+4,A,'F(x)=x²+C',[`C=${t}`,`F(2)=4+${t}=${t+4}`],p('An initial condition fixes the integration constant.','初始條件決定積分常數。'));
 return n('School extension: revolve y=x, 0≤x≤t, about the x-axis. Use the disk model to find volume.','校本延伸：把 y=x、0≤x≤t 繞 x 軸旋轉。用圓盤模型求體積。',`t=${t}`,Math.PI*t**3/3,A,'V=\\pi\\int_0^t[y(x)]^2dx',[`V=\\pi[x^3/3]_0^{${t}}=${t**3}\\pi/3`],p('The squared radius enters disk area; integrating y alone would give area rather than volume.','圓盤面積使用半徑平方；只積分 y 得到面積而非體積。'));
});

add('sup-spatial-equations','Spatial lines, planes, spheres and cross products','空間直線、平面、球及外積',school('school-t06',15,'Spatial analytic geometry; also PDF10–11 cross product'),
 'Construct spatial equations and use normals, cross products and direction tests.','建立空間方程，運用法向量、外積及方向檢驗。','\\ell:P+su;\\quad\\Pi:n\\cdot(X-P)=0',
 'Directions and normals must be nonzero; parallel directions do not prove that two spatial lines coincide.','方向及法向量須非零；方向平行不能證明兩條空間直線重合。','Nonparallel spatial lines can be skew instead of intersecting.','不平行的空間直線可能異面而不相交。','vectors',['s1-1-4'],
 'Can two nonparallel space lines have no intersection?','兩條不平行的空間直線可能沒有交點嗎？','Use all three coordinate equations to distinguish intersecting and skew lines.','用全部三個座標方程區分相交及異面直線。',(k,t)=>{
 if(k===0)return eq('Find the plane through (t,0,0) with normal (1,2,3).','求通過 (t,0,0)、法向量 (1,2,3) 的平面。',`t=${t}`,`x+2y+3z=${t}`,A,'n·(X−P)=0',[`(x-${t})+2y+3z=0`],p('The point fixes the constant and the normal fixes the coefficients.','點決定常數，法向量決定係數。'));
 if(k===1)return n('Find the sphere radius.','求球的半徑。',`(x-1)^2+(y+2)^2+(z-${t})^2=9`,3,A,'r²=9',['r=3'],p('A sphere uses three squared coordinate displacements.','球使用三個座標位移平方。'));
 if(k===2)return eq('Find the line through P with direction u.','求通過 P 且方向為 u 的直線。',`P=(1,2,${t}),\\quad u=(2,-1,3)`,`(x,y,z)=(1,2,${t})+s(2,-1,3)`,A,'X=P+su',[`x=1+2s,\\ y=2-s,\\ z=${t}+3s`],p('One parameter controls all coordinates simultaneously.','同一參數同時控制全部座標。'));
 if(k===3)return n('The line X=(0,0,t)+s(1,0,−1) meets z=0. Find s.','直線 X=(0,0,t)+s(1,0,−1) 與 z=0 相交。求 s。',`t=${t}`,t,A,'z=t−s=0',[`s=${t}`],p('Substitute the resulting parameter into every coordinate to obtain the intersection.','須把所得參數代入每個座標才得到交點。'));
 if(k===4)return eq('Calculate u×v.','計算 u×v。',`u=(${t},0,0),\\quad v=(0,2,0)`,`u\\times v=(0,0,${2*t})`,A,'Use the oriented determinant formula.',[`u\\times v=(0,0,${2*t})`],p('Reversing the order changes the cross product sign.','交換次序會改變外積正負號。'));
 if(k===5)return n('Find the parallelogram area spanned by u,v.','求 u、v 張成的平行四邊形面積。',`u=(${t},0,0),\\quad v=(0,2,0)`,2*t,A,'Area=|u×v|',[`A=|(0,0,${2*t})|=${2*t}`],p('Magnitude removes orientation and gives nonnegative area.','取長度消去方向，給出非負面積。'));
 return eq('Classify the two spatial lines.','分類兩條空間直線的位置關係。',`\\ell_1=(s,0,0),\\quad\\ell_2=(0,u,${t})`,'\\text{skew lines}',A,'Equate all three coordinates.',[`s=0,\\ u=0,\\ 0=${t}\\text{ impossible}`],p('Their directions are not parallel but their z-levels prevent intersection.','方向不平行，但不同 z 層使它們不能相交。'));
});

add('sup-parameter-equations','Parametric curves and preserved domains','參數曲線及範圍保留',school('school-t04',27,'V. Parametric equations (PDF27–29)'),
 'Eliminate parameters while retaining ranges, missing points and the geometry of the locus.','消去參數，同時保留範圍、缺點及軌跡的幾何意義。','x=f(s),\\quad y=g(s)',
 'An eliminated equation may contain extra points; retain every restriction implied by the parameter domain.','消元方程可能包含額外點；須保留參數定義域所帶來的全部限制。','The same Cartesian equation does not always define the same parametric locus.','相同的直角座標方程不一定表示相同的參數軌跡。','functions',['s1-3-3'],
 'Do x=s²,y=s⁴ and x=s,y=s² trace the same set?','x=s²、y=s⁴ 與 x=s、y=s² 是否描出相同點集？','Compare restrictions on x after elimination; then build another missing-range example.','比較消元後 x 的限制，再構造另一個範圍缺漏例子。',(k,t)=>{
 if(k===0)return eq('Eliminate s from the line representation.','消去此直線表示中的 s。',`x=s+${t},\\quad y=2s+1`,`y=2x-${2*t-1}`,A,'s=x−t',[`y=2(x-${t})+1=2x-${2*t-1}`],p('An unrestricted real parameter traces the entire line.','無限制的實參數描出整條直線。'));
 if(k===1)return eq('Eliminate s and retain the range.','消去 s 並保留範圍。',`x=s^2,\\quad y=s^4+${t}`,`y=x^2+${t},\\quad x\\ge0`,A,'x=s²≥0',[`y=(s^2)^2+${t}=x^2+${t}`],p('Only the right half of the parabola is traced.','只描出拋物線的右半部。'));
 if(k===2)return eq('Find the Cartesian equation of the parametrised circle.','求參數圓的直角座標式。',`x=1+${t}\\cos s,\\quad y=2+${t}\\sin s`,`(x-1)^2+(y-2)^2=${t*t}`,A,'cos²s+sin²s=1',[`(x-1)^2+(y-2)^2=${t*t}(\\cos^2s+\\sin^2s)`],p('An unrestricted angle traces the complete circle.','無限制的角參數描出完整圓。'));
 if(k===3)return eq('Eliminate s, retaining the excluded point.','消去 s，並保留排除點。',`x=1/s,\\quad y=${t}/s,\\quad s\\ne0`,`y=${t}x,\\quad x\\ne0`,A,'x=1/s cannot equal zero.',[`y=${t}x`],p('The origin satisfies the line equation but is never reached by this parametrisation.','原點符合直線方程，卻永不被此參數表示取到。'));
 if(k===4)return n('A point on x=t cos s,y=2sin s maximises x+ty. Find the maximum.','在 x=t cos s、y=2sin s 上，求 x+ty 的最大值。',`t=${t}`,t*Math.sqrt(5),A,'x+ty=t(cos s+2sin s)',[`\\max=t\\sqrt{1^2+2^2}=${t}\\sqrt5`],p('The full angle range permits the amplitude maximum.','完整角度範圍使振幅最大值可達到。'));
 if(k===5)return eq('Describe the locus when x=t cos s,y=t sin s and 0≤s≤π.','x=t cos s、y=t sin s，0≤s≤π。描述軌跡。',`t=${t}`,`x^2+y^2=${t*t},\\quad y\\ge0`,A,'sin s≥0 on the stated interval.',[`x^2+y^2=${t*t}`,`y=${t}\\sin s\\ge0`],p('The angle restriction traces the upper semicircle only.','角度限制只描出上半圓。'));
 return eq('Eliminate s from x=t+s,y=t−s and find the range if 0≤s≤2.','由 x=t+s、y=t−s 消去 s，並在0≤s≤2時求範圍。',`t=${t}`,`x+y=${2*t},\\quad ${t}\\le x\\le${t+2}`,A,'Add equations and translate the parameter interval.',[`x+y=${2*t}`,`${t}\\le t+s\\le${t+2}`],p('The result is a segment, not the entire supporting line.','結果是線段，不是整條支撐直線。'));
});

add('sup-infinite-series','Infinite geometric series and error control','無窮等比級數及誤差控制',school('school-t04',35,'III. Series; infinite geometric series'),
 'Check convergence before summing and interpret recurring decimals and truncation errors.','先檢查收斂，再求和，解釋循環小數及截斷誤差。','S_\\infty=a/(1-q)\\quad(|q|<1)',
 'For nonzero a, convergence requires |q|<1; a finite partial sum formula does not by itself establish an infinite sum.','a 非零時，收斂要求 |q|<1；有限部分和公式本身不能保證無窮和存在。','An oscillating partial-sum sequence with q=−1 does not converge.','q=−1 的部分和震盪而不收斂。','sequences',['s2-4-3'],
 'Does a negative ratio prevent an infinite geometric sum?','公比為負會阻止無窮等比和存在嗎？','Compare q=−1/2 and q=−1 by their partial sums and remainders.','比較 q=−1/2 及 q=−1 的部分和及餘項。',(k,t)=>{
 if(k===0)return n('Find the infinite geometric sum.','求無窮等比和。',`a_1=${t},\\quad q=1/2`,2*t,A,'S∞=a/(1−q)',[`S=${t}/(1-1/2)=${2*t}`],p('The ratio magnitude is less than one.','公比絕對值小於一。'));
 if(k===1)return n('Find the infinite sum with alternating signs.','求正負交替的無窮和。',`a_1=${t},\\quad q=-1/2`,2*t/3,A,'S∞=a/(1−q)',[`S=${t}/(1+1/2)=${2*t}/3`],p('A negative ratio is permitted when its magnitude is below one.','公比為負亦可收斂，只須絕對值小於一。'));
 if(k===2)return eq('Does this geometric series converge? Explain.','此等比級數收斂嗎？說明。',`a_1=${t},\\quad q=-1`,'\\text{divergent}',A,'Inspect even and odd partial sums.',[`S_{2m}=0,\\quad S_{2m+1}=${t}`],p('Two different subsequence limits show nonconvergence.','兩個不同的子列極限顯示不收斂。'));
 if(k===3)return n('Express the repeating decimal 0.dddd… as a fraction value, where the single digit d repeats.','把單一數字 d 循環的小數0.dddd…寫成分數值。',`d=${1+t%9}`,(1+t%9)/9,A,'x=d/10+d/100+⋯',[`x=(${1+t%9}/10)/(1-1/10)=${1+t%9}/9`],p('A one-digit block repeats at ratio 1/10.','一位數循環區塊的公比為1/10。'));
 if(k===4)return n('Find the tail after the first 3 terms of a geometric series.','求無窮等比級數取首3項後的餘項和。',`a_1=${t},\\quad q=1/2`,t/4,A,'Tail=a q³/(1−q)',[`R_3=${t}(1/8)/(1/2)=${t}/4`],p('The tail begins at the fourth term, aq³.','餘項從第四項 aq³ 開始。'));
 if(k===5)return n('Find the least n so the tail of 1+1/2+1/4+… is at most 2^(1−t).','對1+1/2+1/4+…，求使餘項不大於2^(1−t) 的最小 n。',`t=${t}`,t,A,'R_n=2^{1−n}',[`2^{1-n}\\le2^{1-${t}}\\Rightarrow n\\ge${t}`],p('The tail is positive, so it equals the absolute truncation error.','此餘項為正，因此等於絕對截斷誤差。'));
 return n('Evaluate the convergent telescoping series.','計算收斂的裂項級數。',`\\sum_{n=1}^{\\infty}\\frac{${t}}{n(n+1)}`,t,A,'Finite partial sum=t(1−1/(N+1)).',[`S_N=${t}(1-1/(N+1))`,`N\\to\\infty\\Rightarrow S=${t}`],p('First justify a finite telescoping identity, then take its limit.','先建立有限裂項恆等式，再取極限。'));
});

export const advancedSupplementLessons=banks.map(({spec,bank})=>build(spec,bank));
