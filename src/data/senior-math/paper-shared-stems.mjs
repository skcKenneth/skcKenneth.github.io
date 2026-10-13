import {L} from './authoring.mjs';
import {paperSourceManifest} from './paper-source-manifest.mjs';

// Original explanatory restatements of public question givens/targets only.
// No answer, hint, worked-step or solution fields are copied into this module.
const T=s=>s?.replaceAll('§','\\');
const urls=Object.fromEntries(paperSourceManifest.map(p=>[p.id,p.url]));
const stem=(paperId,name,appliesTo,pdfPage,en,zh,expression,extra={})=>({
 id:'context-'+paperId+'-'+name,label:'Given context / 題目已知條件',appliesTo,
 prompt:L(en,zh),...(expression?{expression:T(expression)}:{}),
 source:{type:'original-context',paperId,pdfPage,url:urls[paperId],reviewed:'2026-10-08'},...extra,
});
const cubePoints={E:[160,285],F:[325,285],G:[395,220],H:[230,220],A:[160,120],B:[325,120],C:[395,55],D:[230,55]};
const cubeEdges=['AB','BC','CD','DA','EF','FG','GH','HE','AE','BF','CG','DH'];
const cubeSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 340" role="img"><title>Unit cube ABCD–EFGH; M lies on EC and GM is perpendicular to EC / 單位正立方體，M在EC上且GM垂直EC</title><rect width="560" height="340" fill="#fff"/>'+
 cubeEdges.map(([a,b])=>'<path d="M'+cubePoints[a].join(' ')+' L'+cubePoints[b].join(' ')+'" fill="none" stroke="#334155" stroke-width="2"'+(['HE','GH','DH'].includes(a+b)?' stroke-dasharray="6 4"':'')+'/>').join('')+
 '<path d="M160 285 L395 55 M395 220 L305.7 142.4" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="6 4"/><circle cx="305.7" cy="142.4" r="3" fill="#2563eb"/><text x="282" y="162" font-size="17" fill="#0f172a">M</text>'+
 Object.entries(cubePoints).map(([name,[x,y]])=>'<circle cx="'+x+'" cy="'+y+'" r="2.5" fill="#334155"/><text x="'+(x+(name==='A'||name==='E'?-20:6))+'" y="'+(y+(name==='E'||name==='F'||name==='H'?21:-8))+'" font-size="17" fill="#0f172a">'+name+'</text>').join('')+
 '<text x="24" y="324" font-size="13" fill="#475569">Incidence sketch; not to scale / 關聯示意圖，不按比例</text></svg>';

export const paperSharedStems={
 'jm01-2026':[
  stem('jm01-2026','i-13-partial-sum',['I.13'],3,'Sₙ denotes the sum of the first n terms of the geometric sequence, indexed by positive integers.','Sₙ表示等比數列的前n項和，n為正整數。','S_n=§sum_{j=1}^n a_j'),
  stem('jm01-2026','ii-1-scoring-independence',['II.1(a)','II.1(b)'],4,'Each team has three members and each member takes one shot. A hit scores one point and a miss zero. All six hit/miss outcomes are mutually independent. Team A has the three success probabilities below; every member of B has success probability 3/4.','每隊三人，每人射擊一次；命中得一分，否則零分。六次命中與否互相獨立。A隊三人的命中概率如下，B隊每人的命中概率均為3/4。','p_A=(3/4,2/3,1/2),§quad p_B=(3/4,3/4,3/4)'),
  stem('jm01-2026','ii-3-partial-sum',['II.3(a)','II.3(b)','II.3(c)'],4,'Here Sₙ is the sum of the first n terms of the arithmetic sequence, for n≥1.','此處Sₙ為等差數列的前n項和，n≥1。','S_n=§sum_{j=1}^n a_j,§quad n§in§mathbb Z_{>0}'),
 ],
 'jm02-2026':[
  stem('jm02-2026','1-cube',['1(a)','1(b)','1(c)'],3,'The unit cube has opposite square faces ABCD and EFGH, with corresponding edges AE, BF, CG and DH. M lies on the body diagonal EC and GM is perpendicular to EC. The sketch supplies the vertex incidence; it does not give a numerical position for M.','單位正立方體的相對正方形面為ABCD及EFGH，對應棱為AE、BF、CG、DH。M在體對角線EC上，且GM垂直EC。示意圖提供頂點關聯，不給M的數值位置。',null,{promptSvg:cubeSvg}),
  stem('jm02-2026','4-b-factorization-target',['4(b)(i)','4(b)(ii)'],6,'The factorisation to be proved in part (b)(i) is the following identity; it is a target stated in the question.','第(b)(i)題要求證明下列因式分解；此式是題目給出的證明目標。','z^4-§sqrt3z^2+1=§left(z^2-2z§cos§frac§pi{12}+1§right)§left(z^2+2z§cos§frac§pi{12}+1§right)'),
 ],
 'jm01-2025':[
  stem('jm01-2025','i-13-partial-sum',['I.13'],3,'Sₙ denotes the sum of the first n terms of the arithmetic sequence.','Sₙ表示該等差數列的前n項和。','S_n=§sum_{j=1}^n a_j'),
  stem('jm01-2025','ii-1-sequence-definition',['II.1(a)','II.1(b)'],4,'The sequence aₙ is defined through its first n-term sum Sₙ. The second sequence bₙ is geometric and its common ratio is positive. All indices start at n=1.','數列aₙ由其前n項和Sₙ給出；另一數列bₙ為公比正的等比數列。所有數列由n＝1開始。','S_n=§sum_{j=1}^n a_j=n^2+2n'),
  stem('jm01-2025','ii-4-equal-sides-incidence',['II.4(a)','II.4(b)','II.4(c)'],4,'The equal sides of triangle ABC are specifically AB and AC. D lies on AB, and A,E,F,C occur in that order on AC. In addition AD=AE, G is the intersection of DF and BE, and the stated equal-angle condition holds.','三角形ABC中，相等的兩邊明確為AB及AC。D在AB上，A、E、F、C依次位於AC上。此外AD＝AE，G為DF與BE的交點，並有題示等角條件。','AB=AC,§quad AD=AE,§quad §angle AFD=§angle DEB'),
  stem('jm01-2025','ii-5-origin',['II.5(b)'],4,'O denotes the coordinate origin; D is the midpoint of the two intersections of the secant and the locus.','O表示坐標原點；D為割線與軌跡兩交點的中點。','O=(0,0)'),
 ],
 'jm02-2025':[
  stem('jm02-2025','3-ellipse-common-givens',['3(a)','3(b)','3(c)','3(d)'],5,'E is a horizontal ellipse centred at the origin. F₁ is its right focus. The line through F₁ and P=(2,1) meets E at A=(0,−1) and a second point B.','E為以原點為中心、長軸水平的橢圓，F₁為其右焦點。通過F₁及P＝(2,1)的直線，在A＝(0,−1)及另一點B與E相交。','E:§frac{x^2}{a^2}+§frac{y^2}{b^2}=1,§quad a>b>0'),
  stem('jm02-2025','4-c-sum-target',['4(c)','4(d)'],6,'For part (c), the identity below is the stated target. Here n is a positive even integer, w=cosθ+i sinθ, 0<θ<2π and θ≠π.','第(c)題的證明目標為下列恆等式。n為正偶數，w＝cosθ＋i sinθ，0<θ<2π且θ≠π。','1+w+w^2+§cdots+w^n=w^{n/2}§frac{§sin((n+1)§theta/2)}{§sin(§theta/2)}'),
 ],
 'jm01-2024':[
  stem('jm01-2024','ii-3-partial-sum',['II.3(b)'],4,'In this part, Sₙ is the sum of the first n terms of each candidate arithmetic sequence from part (a).','本小題的Sₙ，表示第(a)題每個候選等差數列的前n項和。','S_n=§sum_{j=1}^n a_j'),
  stem('jm01-2024','ii-5-origin',['II.5(b)'],4,'O is the coordinate origin; P and Q are the two points where the line meets the hyperbola.','O為坐標原點；P、Q為直線與雙曲線的兩個交點。','O=(0,0)'),
 ],
 'jm02-2024':[
  stem('jm02-2024','3-secant-common-givens',['3(a)','3(b)','3(c)','3(d)'],5,'L is a nonvertical line through P=(√5,0) and meets H at two distinct points A=(x₁,y₁), B=(x₂,y₂). Its slope is m.','L為通過P＝(√5,0)的非垂直直線，與H交於兩相異點A＝(x₁,y₁)、B＝(x₂,y₂)，其斜率為m。','H:x^2-§frac{y^2}{4}=1,§quad L:y=m(x-§sqrt5)'),
  stem('jm02-2024','3-a-quadratic-target',['3(a)','3(b)','3(c)','3(d)'],5,'Part (a) asks you to prove that both intersection abscissae satisfy the following equation.','第(a)題要求證明兩交點的橫坐標均滿足下列方程。','(m^2-4)x^2-2§sqrt5m^2x+(5m^2+4)=0'),
  stem('jm02-2024','4-b-index-domain',['4(b)'],6,'The two power formulae are to be proved for every positive integer n, with real angle α and ω=cosα+i sinα.','兩個冪次公式須對所有正整數n成立；α為實角，ω＝cosα＋i sinα。','n§in§mathbb Z_{>0}'),
 ],
 'jm01-2023':[],
 'jm02-2023':[
  stem('jm02-2023','4-b-triple-angle-targets',['4(b)(i)','4(b)(ii)'],6,'Part (b)(i) asks for the sine and cosine triple-angle identities and then their tangent quotient, wherever that quotient is defined.','第(b)(i)題要求證明正弦及餘弦三倍角恆等式，再在商有定義時推出正切公式。','§begin{aligned}§cos3§theta&=§cos^3§theta-3§cos§theta§sin^2§theta,§§§sin3§theta&=3§cos^2§theta§sin§theta-§sin^3§theta,§§§tan3§theta&=§frac{3§tan§theta-§tan^3§theta}{1-3§tan^2§theta}.§end{aligned}'),
 ],
 'jm01-2022':[
  stem('jm01-2022','ii-3-origin',['II.3(b)'],4,'O is the coordinate origin. The secant is neither parallel to a coordinate axis nor through O, and M is the midpoint of its two intersections.','O為坐標原點。割線既不平行於坐標軸，也不通過O；M為其兩交點的中點。','O=(0,0)'),
 ],
 'jm02-2022':[],
 'jm01-2021':[
  stem('jm01-2021','ii-3-square-target',['II.3(a)','II.3(b)','II.3(c)'],4,'The exact identity requested in part (a) is displayed below. It follows from the given quadratic relation; it is a proof target rather than an additional assumption.','第(a)題要求證明的確切恆等式如下。它須由已知二次關係推出，是證明目標而非額外假設。','(1-m^2)y^2=a^2-(x-my)^2'),
 ],
 'jm02-2021':[],
};
