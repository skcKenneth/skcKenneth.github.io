/** Required subsection targets from the approved plan, independent of authored titles. */
const targets={
 '01':[['Membership','元素與集合'],['Subsets and the empty set','子集與空集'],['Set operations and universe','交並補與全集'],['Inclusion–exclusion','重疊分類與容斥']],
 '02':[['Implication and converse','正逆命題'],['Necessary and sufficient conditions','充分必要條件'],['Universal and existential statements','全稱與存在'],['Negation and counterexamples','否定與反例']],
 '03':[['Signs between roots','兩根之間的符號'],['Repeated and absent real roots','重根與無根'],['Strict endpoints','嚴格與非嚴格端點'],['Contextual domain','情境定義域']],
 '04':[['Division identity','除法恆等式'],['Synthetic division and missing terms','綜合除法與缺項'],['Remainder theorem','餘式定理'],['Factor theorem','因式定理']],
 '05':[['Function mappings','對應是否函數'],['Three elements of a function','函數三要素'],['Intervals','區間'],['Domain and range','定義域與值域'],['Tables, graphs and formulas','表格圖像公式'],['Piecewise boundaries','分段邊界'],['Composition order','複合次序'],['Attained extrema','最值'],['Monotonicity','單調性'],['Parity','奇偶性'],['Basic power functions','基本冪函數'],['Power comparisons','冪函數比較'],['Substitution','換元'],['Model choice','模型選擇'],['Squaring and extraneous roots','平方與增根']],
 '06':[['Negative exponents','負指數'],['Fractional exponents','分數指數'],['Fixed increments and multipliers','固定增量與倍率'],['Base and monotonicity','底數與單調性'],['Logarithms and positive arguments','對數意義與真數限制'],['Inverse reflection','反函數鏡射'],['Logarithm laws and counterexamples','對數法則與反例'],['Equations and growth thresholds','方程與增長閾值'],['Inequality direction','不等式方向']],
 '07':[['Radians and arc length','弧度與弧長'],['Unit circle','單位圓'],['Related-angle identities','誘導公式'],['Same-angle identities','同角關係'],['Circle to sine and cosine','由圓到正弦餘弦圖'],['Tangent and exclusions','正切與禁值'],['Angle sums and differences','和差角'],['Double angles','倍角'],['Amplitude','振幅'],['Period','周期'],['Phase','相位'],['Periodic models','周期情境建模']],
 '08':[['Vector translation','向量平移'],['Vector addition and subtraction','向量加減'],['Scaling and collinearity','數乘與共線'],['Basis and coordinates','基底與坐標'],['Dot product and perpendicularity','內積與垂直'],['Distance and midpoint','兩點距離與中點']],
 '09':[['Sine rule','正弦定理'],['Cosine rule','餘弦定理'],['SSA solution counts','SSA 零一兩解'],['Area and included angle','面積與夾角'],['Inaccessible distances','不可到達距離測量']],
 '10':[['Classifying solids','柱錐台球分類'],['Oblique projection and true length','斜二測與真長'],['Nets and surface area','展開圖與表面積'],['Prism and cone volume','柱錐體積與垂直高'],['Frustum decomposition','台體分割'],['Sphere measures and scaling','球的面積體積與縮放']],
 '11':[['Direct variation','正變'],['Inverse variation','反變'],['Joint variation','聯變'],['Partial variation','部分變']],
 '12':[['Greatest common polynomial factor','最大公因式'],['Least common polynomial multiple','最小公倍式'],['Euclidean algorithm','輾轉相除']],
 '13':[['Distinct linear factors','不同一次因式'],['Repeated factors','重複因式'],['Improper fractions','先除法的假分式'],['Excluded original inputs','化簡後保留禁值']],
 '14':[['Skew lines','異面直線'],['Line–plane parallelism','線面平行'],['Plane–plane parallelism','面面平行'],['Line–plane perpendicularity','線面垂直'],['Plane–plane perpendicularity','面面垂直']],
};
export const requiredInquiryTargets=Object.entries(targets).flatMap(([chapter,rows])=>rows.map(([en,zh],i)=>({id:`g10-${chapter}-${String(i+1).padStart(2,'0')}`,chapter,target:{en,'zh-Hant':zh}}))).sort((a,b)=>a.id.localeCompare(b.id));
