import {L,S,paperQuestions} from './paper-authoring.mjs';
import {functionSvg,geometrySvg} from './paper-figures.mjs';
const {W}=paperQuestions('jm02-2021');
const T=s=>s.replaceAll('§',String.fromCharCode(92));
const marks={'1(a)(i)':6,'1(a)(ii)':4,'1(b)(i)':3,'1(b)(ii)':7,
 '2(a)(i)':2,'2(a)(ii)':4,'2(a)(iii)':2,'2(a)(iv)':3,'2(a)(v)':1,'2(b)':8,
 '3(a)':4,'3(b)(i)':6,'3(b)(ii)':5,'3(b)(iii)':5,
 '4(a)':2,'4(b)':7,'4(c)(i)':7,'4(c)(ii)':4,'5(a)':8,'5(b)(i)':4,'5(b)(ii)':8};
function P(part,page,answerPage,prompt,expression,hints,steps,result,error,skill,extra={}) {
 return W(part,page,answerPage,prompt,expression,hints,steps,result,error,skill,
  {marks:marks[part],answerPdfPages:[answerPage,answerPage+5],...extra});
}
const setup=L('ABCD is a trapezoid with ∠DAB=∠ABC=π/2, AD=1 and PA=AB=BC=2; PA is perpendicular to plane ABCD. M is the midpoint of PC.',
 'ABCD 為梯形，∠DAB=∠ABC=π/2，AD=1、PA=AB=BC=2；PA 垂直面 ABCD。M 為 PC 中點。');
const figPoints={A:[50,240],B:[125,165],C:[335,165],D:[155,240],P:[50,35],M:[192.5,100]};
const figSegments=[['A','B'],['B','C'],['C','D'],['D','A'],['P','A'],['P','B'],['P','C'],['P','D'],['B','D'],['D','M']];
const solidFigure=geometrySvg(figPoints,figSegments,'2021 JM02 Q1: trapezoid ABCD and perpendicular PA; diagram not to scale');
const solidExtra={promptSvg:solidFigure};
const f=x=>2*x**3-9*x*x+12*x-5;
const cubic=T('f(x)=2x^3-9x^2+12x-5');
const parabola=T('P:x^2=8y');
const system=T('(E):§begin{cases}kx+y-z=p§§x+ky+z=q§§-x+y+kz=r§end{cases}');
const determinant=T('D=§begin{vmatrix}a&a^2+1&bc§§b&b^2+1&ac§§c&c^2+1&ab§end{vmatrix}');

export const jm02_2021=[
P('1(a)(i)',3,8,L(setup.en+' Find the area of triangle PBD.',setup.zh+' 求三角形 PBD 面積。'),'',
 [L('Compute PD, BD and PB from three right triangles.','由三個直角三角形計算 PD、BD、PB。'),L('Use PB as the base of isosceles triangle PBD.','以 PB 為等腰三角形 PBD 的底。')],
 [S('The given perpendicularities allow Pythagoras.','由題設垂直關係使用勾股定理。',T('PD^2=PA^2+AD^2=5,§quad BD^2=AB^2+AD^2=5,§quad PB^2=PA^2+AB^2=8')),
 S('The altitude to PB bisects this base.','PB 上的高平分底邊。',T('h=§sqrt{5-(§sqrt8/2)^2}=§sqrt3')),
 S('Multiply half the base by its corresponding height.','底乘相應高再除以二。',T('A_{PBD}=§tfrac12§sqrt8§sqrt3=§sqrt6'))],
 L('Area √6.','面積為 √6。'),L('PA is the pyramid height, not the altitude to PB inside triangle PBD.','PA 是棱錐的高，不是三角形 PBD 中 PB 上的高。'),'solid-geometry',solidExtra),

P('1(a)(ii)',3,8,L(setup.en+' Find the volume of P–ABD, then the distance from A to plane PBD.',setup.zh+' 求三棱錐 P–ABD 體積，再求 A 到面 PBD 的距離。'),'',
 [L('Triangle ABD is right at A.','三角形 ABD 在 A 處直角。'),L('The same tetrahedron can use PBD as its base and A as its apex.','同一四面體可改以 PBD 為底、A 為頂點。')],
 [S('Compute the base area and the original perpendicular height.','計算底面積及原來的垂直高。',T('A_{ABD}=§tfrac12(2)(1)=1,§quad V=§tfrac13(1)(2)=§tfrac23')),
 S('Changing the base does not change the volume.','改換底面不改變體積。',T('§tfrac13 A_{PBD}d=§tfrac23§implies §tfrac{§sqrt6}{3}d=§tfrac23')),
 S('Use a positive perpendicular distance.','取正的垂直距離。',T('d=2/§sqrt6=§sqrt{2/3}=§sqrt6/3'))],
 L('Volume 2/3; distance √(2/3).','體積為 2/3；距離為 √(2/3)。'),L('The official √(2/3) has the entire fraction under the radical.','官方 √(2/3) 的整個分數均在根號內。'),'solid-volume',solidExtra),

P('1(b)(i)',3,8,L(setup.en+' Prove CB is perpendicular to plane PAB.',setup.zh+' 證明 CB 垂直面 PAB。'),'',
 [L('First prove AD is perpendicular to plane PAB.','先證明 AD 垂直面 PAB。'),L('AD is parallel to BC in the trapezoid.','梯形中 AD 與 BC 平行。')],
 [S('AD lies in the base plane, so the perpendicular PA is perpendicular to AD.','AD 位於底面，故垂直底面的 PA 垂直 AD。',T('AD§perp PA')),
 S('The given angle gives a second intersecting line in plane PAB.','題設角度提供面 PAB 內另一條相交直線。',T('AD§perp AB,§quad PA§cap AB=§{A§}')),
 S('A line perpendicular to both intersecting lines is perpendicular to their plane; transfer this direction to BC.','直線垂直面內兩條相交直線，便垂直該面；再把此方向轉移至 BC。',T('AD§perp§operatorname{plane}PAB,§quad BC§parallel AD§implies CB§perp§operatorname{plane}PAB'))],
 L('CB⊥plane PAB.','CB 垂直面 PAB。'),L('Perpendicularity to only AB does not prove perpendicularity to the plane.','只證垂直 AB，不能證明垂直整個平面。'),'solid-perpendicularity',solidExtra),

P('1(b)(ii)',3,8,L(setup.en+' Prove DM is parallel to plane PAB. Use N, the midpoint of PB, and show ADMN is a rectangle.',setup.zh+' 證明 DM 平行面 PAB。設 N 為 PB 中點，並證明 ADMN 為長方形。'),'',
 [L('Apply the midpoint theorem in triangle PBC.','在三角形 PBC 使用中點定理。'),L('Show AD and NM are parallel, equal and perpendicular to AN.','證明 AD、NM 平行且相等，並垂直 AN。')],
 [S('The midpoint segment has the required direction and length.','中點連線具有所需方向及長度。',T('NM§parallel BC§parallel AD,§quad NM=BC/2=1=AD')),
 S('One pair of equal parallel opposite sides makes ADMN a parallelogram, and AD⊥AN gives a right angle.','一組對邊平行且相等，得 ADMN 為平行四邊形；AD⊥AN 再給出直角。',T('AN§subset§operatorname{plane}PAB,§quad AD§perp AN')),
 S('Thus ADMN is a rectangle and DM is parallel to AN.','故 ADMN 為長方形，DM 與 AN 平行。',T('DM§parallel AN')),
 S('D is outside plane PAB, while AN lies in it. A line through D parallel to AN therefore has no intersection with the plane.','D 不在面 PAB 上，而 AN 在面內。過 D 且平行 AN 的直線故不與平面相交。',T('DM§parallel§operatorname{plane}PAB'))],
 L('ADMN is a rectangle; DM∥plane PAB.','ADMN 為長方形；DM 平行面 PAB。'),L('A line parallel to a line in a plane also needs to be outside the plane to establish line–plane parallelism.','直線平行面內直線時，尚須確認它不在面內，才可證明線面平行。'),'solid-parallelism',
 {...solidExtra,solutionSvg:geometrySvg({...figPoints,N:[87.5,100]},[...figSegments,['N','M'],['A','N']],'2021 JM02 Q1(b)(ii): midpoint N and rectangle ADMN; diagram not to scale')}),

P('2(a)(i)',4,8,L('Find the first and second derivatives of f.','求 f 的一階及二階導數。'),cubic,
 [L('Differentiate each polynomial term.','逐項求多項式導數。'),L('Differentiate the first derivative once more.','把一階導數再求導一次。')],
 [S('Use the power rule.','使用冪函數求導法。',T("f'(x)=6x^2-18x+12")),
 S('Constants vanish when differentiated.','常數求導為零。',T("f''(x)=12x-18"))],
 L('f′(x)=6x²−18x+12; f″(x)=12x−18.','f′(x)=6x²−18x+12；f″(x)=12x−18。'),L('Do not retain the constant −5 in f′.','不要在 f′ 中保留常數 −5。'),'differentiation'),

P('2(a)(ii)',4,8,L('Find the local maximum and minimum values of f.','求 f 的局部極大值及局部極小值。'),cubic,
 [L('Factor the first derivative to find stationary points.','分解一階導數，求駐點。'),L('Read the derivative signs on the three intervals.','檢查三個區間的導數符號。')],
 [S('The stationary abscissae are 1 and 2.','駐點橫坐標為1及2。',T("f'(x)=6(x-1)(x-2)=0§iff x=1,2")),
 S('The signs are positive, negative, positive.','符號依次為正、負、正。',T("x<1:f'>0;§quad1<x<2:f'<0;§quad x>2:f'>0")),
 S('Evaluate f at the two points and classify the changes.','計算兩點的函數值，並按變號分類。',T('f(1)=0§text{ (local maximum)},§quad f(2)=-1§text{ (local minimum)}'))],
 L('Local maximum 0 at x=1; local minimum −1 at x=2.','x=1 處局部極大值為0；x=2 處局部極小值為−1。'),L('These local values are not the global bounds of the cubic on the real line.','這些局部極值不是三次函數在整條實數線上的全域界限。'),'derivative-extrema'),

P('2(a)(iii)',4,8,L('Find the inflection point of y=f(x).','求 y=f(x) 的拐點。'),cubic,
 [L('Solve f″(x)=0.','解 f″(x)=0。'),L('Check that concavity changes there.','檢查該處凹凸性確有改變。')],
 [S('The second derivative vanishes at 3/2.','二階導數在3/2處為零。',T("12x-18=0§implies x=§tfrac32")),
 S('It changes from negative to positive; evaluate the ordinate.','二階導數由負變正，再求縱坐標。',T("x<§tfrac32:f''<0;§quad x>§tfrac32:f''>0;§quad f(§tfrac32)=-§tfrac12"))],
 L('Inflection point (3/2,−1/2).','拐點為 (3/2,−1/2)。'),L('An inflection requires a concavity change; f″=0 alone is insufficient.','拐點須有凹凸性改變；只有 f″=0 並不足夠。'),'curve-sketching'),

P('2(a)(iv)',4,9,L('Sketch y=f(x) for −1≤x≤3.','繪出 −1≤x≤3 時的 y=f(x)。'),cubic,
 [L('Mark the endpoints, intercepts, stationary points and inflection.','標出端點、截距、駐點及拐點。'),L('Combine derivative signs with the concavity change.','把導數符號與凹凸性變化合併。')],
 [S('Factor f to locate both x-intercepts, including the double root.','分解 f，求兩個 x 截點並保留重根性質。',T('f(x)=(x-1)^2(2x-5)')),
 S('The double zero touches the axis; the simple zero crosses it.','重零點處接觸 x 軸，單零點處穿過 x 軸。',T('(-1,-28),§ (0,-5),§ (1,0),§ (3/2,-1/2),§ (2,-1),§ (5/2,0),§ (3,4)')),
 S('Increase to x=1, decrease to x=2, then increase; concavity changes at 3/2. Keep the two domain endpoints.','遞增至 x=1，遞減至 x=2，再遞增；在3/2處改變凹凸性，並保留兩個定義域端點。')],
 L('The plotted cubic is restricted to [−1,3], with the listed key points.','圖中三次曲線限制於 [−1,3]，並標示上述關鍵點。'),L('The double root x=1 touches the axis rather than crossing it.','重根 x=1 處接觸 x 軸，而非穿過。'),'curve-sketching',
 {solutionSvg:functionSvg(f,{xMin:-1,xMax:3,yMin:-30,yMax:6,title:'2021 JM02 2(a)(iv): f(x), −1≤x≤3',points:[{x:-1,y:-28,label:'(−1,−28)'},{x:1,y:0,label:'(1,0)',dx:-25,dy:-12},{x:1.5,y:-0.5,label:'(1.5,−0.5)',dx:-55,dy:35},{x:2,y:-1,label:'(2,−1)',dx:-16,dy:55},{x:2.5,y:0,label:'(2.5,0)',dy:-25},{x:3,y:4,label:'(3,4)',dx:-40}]}),
 sourceDiscrepancy:L('The English suggested-answer plot headings on PDF14 are shifted by one subpart; the original question and Chinese headings identify this as (iv).','官方英文答案 PDF14 的圖標題小題編號偏移一項；按原題及中文標題，此圖屬 (iv)。')}),

P('2(a)(v)',4,9,L('Sketch y=f(|x|)−1 for −1≤x≤3.','繪出 −1≤x≤3 時的 y=f(|x|)−1。'),cubic,
 [L('Reflect the nonnegative-x part across the y-axis where the domain allows.','在定義域允許範圍，把非負 x 部分關於 y 軸對稱。'),L('Shift the resulting curve down by one.','把所得曲線向下平移一單位。')],
 [S('For negative x substitute −x; for nonnegative x retain x, then subtract one.','負 x 代入 −x，非負 x 保留 x，最後減一。',T('g(x)=§begin{cases}-2x^3-9x^2-12x-6&-1§le x<0§§2x^3-9x^2+12x-6&0§le x§le3§end{cases}')),
 S('Mark the corner at zero and transformed turning points/endpoints.','標出零處的尖角，以及變換後的轉折點及端點。',T('(-1,-1),§ (0,-6),§ (1,-1),§ (2,-2),§ (3,3)')),
 S('Only the reflected portion with −1≤x≤0 remains in the requested domain.','對稱所得部分只保留 −1≤x≤0；其餘超出題目定義域。')],
 L('The plotted reflected-and-shifted curve has a corner at (0,−6).','圖中對稱再下移的曲線在 (0,−6) 有尖角。'),L('Do not reflect the original negative-x branch; f(|x|) uses the original nonnegative-x branch.','不要對稱原函數的負 x 部分；f(|x|) 使用原函數非負 x 部分。'),'function-transformations',
 {solutionSvg:functionSvg(x=>f(Math.abs(x))-1,{xMin:-1,xMax:3,yMin:-7,yMax:4,title:'2021 JM02 2(a)(v): f(|x|)−1, −1≤x≤3',points:[{x:-1,y:-1,label:'(−1,−1)'},{x:0,y:-6,label:'(0,−6)',dy:23},{x:1,y:-1,label:'(1,−1)'},{x:2,y:-2,label:'(2,−2)'},{x:3,y:3,label:'(3,3)',dx:-40}]}),
 sourceDiscrepancy:L('The English suggested-answer plot on PDF14 is labelled (iv); it answers the original (v), as the Chinese version correctly labels it.','官方英文答案 PDF14 把此圖標為 (iv)；它回答原題 (v)，中文版本的編號正確。')}),

P('2(b)',4,9,L('Find the total area enclosed by y=−x²+3x and y=2x³−x²−5x.','求 y=−x²+3x 與 y=2x³−x²−5x 圍成的總面積。'),'',
 [L('Solve for all intersection abscissae.','求所有交點橫坐標。'),L('The upper curve changes at x=0; split the integral.','上方曲線在 x=0 處改變，須分段積分。')],
 [S('Set the two ordinates equal and factor.','令兩縱坐標相等並分解。',T('2x^3-8x=2x(x-2)(x+2)=0§implies x=-2,0,2')),
 S('On (−2,0) the cubic is above; on (0,2) the quadratic is above.','(−2,0) 上三次曲線在上；(0,2) 上二次曲線在上。',T('A=§int_{-2}^0(2x^3-8x)§,dx+§int_0^2(8x-2x^3)§,dx')),
 S('Evaluate both nonnegative contributions.','計算兩個非負面積部分。',T('A=[x^4/2-4x^2]_{-2}^0+[4x^2-x^4/2]_0^2=8+8=16'))],
 L('Total area 16.','總面積為16。'),L('A single signed integral over [−2,2] would cancel the two regions.','只在 [−2,2] 作一次有向積分，會令兩個區域相消。'),'integral-area'),

P('3(a)',5,9,L('If y=mx+c is tangent to x²=8y, prove c=−2m².','若 y=mx+c 與 x²=8y 相切，證明 c=−2m²。'),parabola,
 [L('Substitute the line into the parabola.','把直線代入拋物線。'),L('The intersection quadratic has a repeated root at tangency.','相切時交點二次方程有重根。')],
 [S('The leading quadratic coefficient remains one for every m.','任何 m 的二次項係數均為一。',T('x^2-8mx-8c=0')),
 S('Set its discriminant to zero and rearrange.','令判別式為零，再整理。',T('§Delta=64m^2+32c=0§implies c=-2m^2'))],
 L('c=−2m².','c=−2m²。'),L('Here the elimination remains quadratic, so the double-root criterion is valid even when m=0.','此處消元仍為二次式，即使 m=0，重根判準仍有效。'),'parabola-tangents'),

P('3(b)(i)',5,9,L('Two distinct tangents to x²=8y have slopes m₁,m₂ and meet at A(h,k). Find A in terms of the slopes.','x²=8y 的兩條不同切線斜率為 m₁、m₂，交於 A(h,k)。以斜率表示 A。'),parabola,
 [L('Use y=mᵢx−2mᵢ² from part (a).','由 (a) 使用 y=mᵢx−2mᵢ²。'),L('Subtract the two incidence equations; m₁≠m₂.','把兩個通過 A 的方程相減；m₁≠m₂。')],
 [S('The two lines have different slopes, since a slope specifies one tangent of this parabola.','每個斜率只指定此拋物線的一條切線，故兩斜率不同。',T('k=m_1h-2m_1^2=m_2h-2m_2^2')),
 S('Cancel the nonzero slope difference.','約去非零斜率差。',T('(m_1-m_2)h=2(m_1-m_2)(m_1+m_2)§implies h=2(m_1+m_2)')),
 S('Substitute back to obtain the ordinate.','代回求縱坐標。',T('k=2m_1(m_1+m_2)-2m_1^2=2m_1m_2'))],
 L('A=(2(m₁+m₂),2m₁m₂).','A=(2(m₁+m₂),2m₁m₂)。'),L('Cancellation requires the stated distinctness of the tangents.','約去斜率差須使用兩切線不同的題設。'),'tangent-intersections'),

P('3(b)(ii)',5,10,L('If the two tangents in part (b) are perpendicular, find the complete locus of A.','若 (b) 的兩切線互相垂直，求 A 的完整軌跡。'),parabola,
 [L('Both slopes are finite, so m₁m₂=−1.','兩斜率均有限，故 m₁m₂=−1。'),L('Show every real h occurs, not merely that k=−2.','除證 k=−2，還須證每個實數 h 都可取到。')],
 [S('The ordinate is fixed by the slope product.','由斜率積固定縱坐標。',T('k=2m_1m_2=-2')),
 S('For any real h, solve the tangent-slope equation.','對任意實數 h，解切線斜率方程。',T('2m^2-hm-2=0,§quad§Delta=h^2+16>0')),
 S('Its two distinct real roots have product −1, so their tangents meet at (h,−2) and are perpendicular.','它的兩個不同實根乘積為−1，因此相應切線交於 (h,−2) 並互相垂直。',T('m_1+m_2=h/2,§quad m_1m_2=-1'))],
 L('The full straight line y=−2.','完整直線 y=−2。'),L('A necessary equation for a locus also needs a sufficiency argument.','軌跡的必要方程還須有充分性論證。'),'parabola-locus'),

P('3(b)(iii)',5,10,L('The angle between the two tangents is π/4 and m₁=2. Find all possible A.','兩切線夾角為 π/4，且 m₁=2。求所有可能的 A。'),parabola,
 [L('Use the absolute tangent of the angle between the lines.','使用兩直線夾角正切的絕對值。'),L('Retain both solutions after squaring and check the denominator.','平方後保留兩解，並檢查分母。')],
 [S('Perpendicular slopes are excluded by the specified π/4 angle.','指定夾角為 π/4，排除垂直斜率。',T('1=§left|§frac{2-m_2}{1+2m_2}§right|,§quad m_2§ne-1/2')),
 S('Squaring and factoring gives two valid slopes.','平方並分解得兩個有效斜率。',T('(2-m_2)^2=(1+2m_2)^2§iff3m_2^2+8m_2-3=0§implies m_2=-3,1/3')),
 S('Use the sum and product formulas from part (i).','使用 (i) 的根和及根積公式。',T('A=(-2,-12)§quad§text{or}§quad A=(14/3,4/3)'))],
 L('A=(−2,−12) or (14/3,4/3).','A=(−2,−12) 或 (14/3,4/3)。'),L('Using a signed angle formula without the absolute value would lose one of the two unoriented-line configurations.','不用絕對值而採有向角公式，會遺漏無方向直線的其中一種配置。'),'angles-between-lines'),

P('4(a)',6,10,L('From the sine addition formula, prove sin A+sin B=2sin((A+B)/2)cos((A−B)/2).','由正弦和角公式，證明 sin A+sin B=2sin((A+B)/2)cos((A−B)/2)。'),'',
 [L('Write A=u+v and B=u−v.','寫成 A=u+v、B=u−v。'),L('Add the expansions so the cos u sin v terms cancel.','把展開式相加，使 cos u sin v 項相消。')],
 [S('Define the half-sum and half-difference.','定義半和及半差。',T('u=(A+B)/2,§quad v=(A-B)/2')),
 S('Expand and add.','展開再相加。',T('§sin(u+v)+§sin(u-v)=2§sin u§cos v')),
 S('Substitute the definitions back.','代回定義。',T('§sin A+§sin B=2§sin§frac{A+B}{2}§cos§frac{A-B}{2}'))],
 L('The sum-to-product identity follows.','和化積恆等式得證。'),L('The two expansions have opposite signs on cos u sin v.','兩個展開式中 cos u sin v 的正負號相反。'),'sum-to-product'),

P('4(b)',6,10,L('Given A+B+C=π, prove sin A+sin B+sin C=4cos(A/2)cos(B/2)cos(C/2).','已知 A+B+C=π，證明 sin A+sin B+sin C=4cos(A/2)cos(B/2)cos(C/2)。'),'',
 [L('Use part (a) on sin A+sin B.','對 sin A+sin B 使用 (a)。'),L('Replace (A+B)/2 by (π−C)/2 and factor cos(C/2).','以 (π−C)/2 取代 (A+B)/2，再提出 cos(C/2)。')],
 [S('Combine the first two terms and the double-angle form of the third.','合併前兩項，第三項用倍角式。',T('§sin A+§sin B+§sin C=2§cos(C/2)§left[§cos§frac{A-B}{2}+§sin(C/2)§right]')),
 S('The angle-sum condition converts sine into cosine.','由角和條件把正弦轉為餘弦。',T('§sin(C/2)=§cos§frac{A+B}{2}')),
 S('Expand the two cosines; the sine-product terms cancel.','展開兩個餘弦，正弦乘積項相消。',T('§cos§frac{A-B}{2}+§cos§frac{A+B}{2}=2§cos(A/2)§cos(B/2)')),
 S('Multiply the remaining factors, without dividing by a potentially zero cosine.','把剩餘因子相乘，不須除以可能為零的餘弦。',T('§sin A+§sin B+§sin C=4§cos(A/2)§cos(B/2)§cos(C/2)'))],
 L('The identity is proved whenever A+B+C=π.','A+B+C=π 時，恆等式得證。'),L('The proof uses no division by cos(C/2), so zero-cosine cases remain included.','證明沒有除以 cos(C/2)，故餘弦為零的情況仍包含在內。'),'trigonometric-identities'),

P('4(c)(i)',6,11,L('Use induction to prove the identity for every positive integer n.','用數學歸納法證明此式對所有正整數 n 成立。'),
 T('2§sin x[§cos x+§cos3x+§cdots+§cos(2n-1)x]=§sin2nx'),
 [L('Check n=1 using the double-angle sine identity.','用正弦倍角公式檢查 n=1。'),L('In the induction step add 2sin x cos((2k+1)x).','歸納步驟新增 2sin x cos((2k+1)x)。')],
 [S('The base case holds for every real x.','起始情況對每個實數 x 成立。',T('n=1:§quad2§sin x§cos x=§sin2x')),
 S('Assume the statement for a fixed positive integer k.','假設命題對某固定正整數 k 成立。',T('2§sin x§sum_{j=1}^k§cos(2j-1)x=§sin2kx')),
 S('The addition formulas give a telescoping increment.','由和角公式得到可相消的增量。',T('2§sin x§cos(2k+1)x=§sin(2k+2)x-§sin2kx')),
 S('Add the new term to the induction hypothesis; the old right side cancels.','把新增項加到歸納假設，原右方相消。',T('2§sin x§sum_{j=1}^{k+1}§cos(2j-1)x=§sin2(k+1)x')),
 S('The base and implication establish the identity for all positive integers n.','由起始情況及歸納推論，此式對所有正整數 n 成立。')],
 L('The identity holds for all n≥1 and every real x.','此式對所有 n≥1 及每個實數 x 成立。'),L('No division by sin x is needed in the induction proof.','歸納證明不須除以 sin x。'),'mathematical-induction'),

P('4(c)(ii)',6,11,L('Use part (i) to solve cos x+cos3x+cos5x=0 for 0≤x≤2π.','用 (i) 解 0≤x≤2π 時的 cos x+cos3x+cos5x=0。'),'',
 [L('Set n=3 in the identity.','在恆等式中取 n=3。'),L('Check sin x=0 separately before dividing.','除以 sin x 前，先獨立檢查 sin x=0。')],
 [S('The product identity reduces the equation where sin x is nonzero.','sin x 非零時，可用乘積恆等式化簡。',T('2§sin x(§cos x+§cos3x+§cos5x)=§sin6x')),
 S('At 0,π,2π the original left side is 3,−3,3, so none is a solution.','在0、π、2π，原式左方為3、−3、3，均不是解。',T('§sin x=0§implies x=0,§pi,2§pi')),
 S('Solve sin6x=0 and exclude those three points.','解 sin6x=0，並排除上述三點。',T('x=j§pi/6,§quad j§in§{1,2,3,4,5,7,8,9,10,11§}'))],
 L('x=jπ/6 for j=1,2,3,4,5,7,8,9,10,11.','x=jπ/6，j=1、2、3、4、5、7、8、9、10、11。'),L('Multiplying by sin x introduces candidate zeros at 0,π,2π; the original equation rejects them.','乘以 sin x 會引入0、π、2π候選零點，原方程須排除它們。'),'trigonometric-equations'),

P('5(a)',7,11,L('Factorize the displayed determinant.','因式分解所列行列式。'),determinant,
 [L('Subtract row 1 from rows 2 and 3.','第二、三行減去第一行。'),L('Extract b−a, c−a and then c−b.','提出 b−a、c−a，再提出 c−b。')],
 [S('Row subtraction produces two polynomial factors.','行相減產生兩個多項式因子。',T('D=(b-a)(c-a)§begin{vmatrix}a&a^2+1&bc§§1&a+b&-c§§1&a+c&-b§end{vmatrix}')),
 S('Subtract the new row 2 from row 3, then extract c−b.','新第三行減去第二行，再提出 c−b。',T('D=(b-a)(c-a)(c-b)§begin{vmatrix}a&a^2+1&bc§§1&a+b&-c§§0&1&1§end{vmatrix}')),
 S('Subtract column 3 from column 2 and expand along the last row.','第二欄減去第三欄，再沿末行展開。',T('D=(b-a)(c-a)(c-b)[a(a+b+c)-(a^2+1-bc)]')),
 S('Simplify the final factor and account for the two sign reversals.','化簡最後因子，並處理兩次變號。',T('D=(a-b)(b-c)(c-a)(ab+bc+ca-1)'))],
 L('D=(a−b)(b−c)(c−a)(ab+bc+ca−1).','D=(a−b)(b−c)(c−a)(ab+bc+ca−1)。'),L('Factoring a polynomial identity does not require a,b,c to be distinct; equal-variable cases give determinant zero.','提出多項式因子不須假設 a、b、c 不同；相等變量情況直接給行列式為零。'),'determinant-factorization'),

P('5(b)(i)',7,11,L('For the displayed system with constants k,p,q,r, find all k for which the solution is unique.','對所列方程組，k、p、q、r 為常數。求使解唯一的所有 k。'),system,
 [L('Use the coefficient determinant.','使用係數行列式。'),L('Factor the cubic determinant in k.','把 k 的三次行列式分解。')],
 [S('Expand along the first row.','沿第一行展開。',T('§det A=k(k^2-1)-(k+1)-(k+1)=k^3-3k-2')),
 S('A square system is uniquely solvable for any right side exactly when this determinant is nonzero.','方陣系統對任意右方均有唯一解，恰好要求此行列式非零。',T('§det A=(k+1)^2(k-2)§ne0§iff k§ne-1,2'))],
 L('All real k except −1 and 2.','所有實數 k，但排除−1及2。'),L('A zero determinant does not distinguish no solution from infinitely many solutions without checking consistency.','行列式為零時，須再檢查相容性，才能區分無解與無限多解。'),'linear-systems'),

P('5(b)(ii)',7,12,L('Set k=2 and suppose the system has more than one solution. Find the relation among p,q,r; then solve when p=5,q=1,r=−4.','設 k=2，且方程組有多於一個解。求 p、q、r 的關係；再於 p=5、q=1、r=−4 時解方程組。'),system,
 [L('At k=2 the second coefficient row equals the sum of the first and third.','k=2 時，第二係數行等於第一及第三行之和。'),L('Take z as a free parameter after checking the right-side relation.','檢查右方關係後，以 z 為自由參數。')],
 [S('The coefficient dependence forces the same relation on the right side.','係數的相依關係要求右方有相同關係。',T('R_2=R_1+R_3§implies q=p+r§iff p-q+r=0')),
 S('The first two rows are independent, so this condition is also sufficient and leaves one free variable.','前兩行獨立，因此此條件亦充分，並留下一個自由變量。',T('§begin{vmatrix}2&1§§1&2§end{vmatrix}=3§ne0')),
 S('The specified right side is consistent; set z=t and solve the first two equations.','指定右方相容；設 z=t，解前兩式。',T('5-1-4=0,§quad2x+y-t=5,§quad x+2y+t=1')),
 S('Substitution also satisfies the third equation.','代入後也符合第三式。',T('(x,y,z)=(3+t,-1-t,t),§quad t§in§mathbb R'))],
 L('p−q+r=0; for the specified values, (x,y,z)=(3+t,−1−t,t), t∈ℝ.','p−q+r=0；指定值的解為 (x,y,z)=(3+t,−1−t,t)，t∈ℝ。'),L('State the free parameter domain and retain the compatibility condition; one particular solution is not the full answer.','須寫出自由參數範圍及相容條件；一組特解不是完整答案。'),'singular-linear-systems'),
];
export const jm02_2021_inventory={choice:0,writtenTopLevel:5,writtenLeafParts:21,totalLeafItems:21,optionCounts:[],
 questionPdfPages:[3,4,5,6,7],answerPdfPages:[8,9,10,11,12],parts:jm02_2021.map(q=>q.source.question)};
