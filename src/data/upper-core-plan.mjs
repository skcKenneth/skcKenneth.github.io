const B=(en,zh)=>({en,'zh-Hant':zh});
export const UPPER_CORE_VERSION='2026-10-14-upper-core-v1';
export const UPPER_CHAPTERS=[
 {id:'g7-c1',grade:'g7',number:1,title:B('Rational numbers','有理數'),lessons:[1,20],pages:[1,40],use:B('Review after teaching','已教內容複習'),packIds:['g7-rational-number-line','g7-rational-operations']},
 {id:'g7-c2',grade:'g7',number:2,title:B('Adding and subtracting algebraic expressions','整式的加減'),lessons:[21,27],pages:[41,54],use:B('Review after teaching','已教內容複習'),packIds:['g7-expressions-values','g7-polynomial-add-subtract']},
 {id:'g7-c3',grade:'g7',number:3,title:B('Linear equations in one unknown','一元一次方程'),lessons:[28,39],pages:[55,78],use:B('Follow the current teaching sequence','配合目前教學進度'),packIds:['g7-equations-meaning','g7-equations-collect','g7-equations-transpose','g7-equations-brackets-fractions','g7-equations-applications']},
 {id:'g7-c4',grade:'g7',number:4,title:B('Geometric foundations','幾何圖形初步'),lessons:[40,50],pages:[79,100],use:B('Practise after the corresponding lessons','配合後續課時練習'),packIds:['g7-geometry-segments','g7-geometry-angles']},
 {id:'g8-c11',grade:'g8',number:11,title:B('Triangles','三角形'),lessons:[1,6],pages:[1,12],use:B('Review after teaching','已教內容複習'),packIds:['g8-triangles-sides','g8-triangles-angles']},
 {id:'g8-c12',grade:'g8',number:12,title:B('Congruent triangles','全等三角形'),lessons:[7,14],pages:[13,28],use:B('Review criteria, then practise the bisector property','複習判定，再練習角平分線性質'),packIds:['g8-congruence-sss-sas','g8-congruence-angle-hl','g8-bisector-distances','g8-bisector-converse']},
 {id:'g8-c13',grade:'g8',number:13,title:B('Reflection symmetry','軸對稱'),lessons:[15,25],pages:[29,50],use:B('Follow the upcoming teaching sequence','配合接下來的教學進度'),packIds:['g8-symmetry-recognition','g8-perpendicular-bisector','g8-symmetry-axis-construction','g8-reflection-coordinates','g8-isosceles-equilateral']},
 {id:'g8-c14',grade:'g8',number:14,title:B('Polynomial multiplication, division and factorisation','整式的乘除與因式分解'),lessons:[26,39],pages:[51,78],use:B('Practise after the corresponding lessons','配合後續課時練習'),packIds:['g8-powers-multiplication','g8-products-division','g8-factorisation']},
 {id:'g8-c15',grade:'g8',number:15,title:B('Rational expressions','分式'),lessons:[40,52],pages:[79,104],use:B('Practise after the corresponding lessons','配合後續課時練習'),packIds:['g8-rational-expressions','g8-rational-operations','g8-rational-equations']},
];
export const UPPER_NEW_PACK_IDS=UPPER_CHAPTERS.flatMap(chapter=>chapter.packIds).filter(id=>!['g7-equations-collect','g7-equations-transpose','g8-bisector-distances','g8-bisector-converse','g8-symmetry-recognition','g8-perpendicular-bisector','g8-symmetry-axis-construction'].includes(id));
