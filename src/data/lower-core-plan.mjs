const B=(en,zh)=>({en,'zh-Hant':zh});
export const LOWER_CORE_VERSION='2026-10-15-lower-core-v1';
const use=B('Consolidate after the referenced textbook lessons','配合相應正文課時教學後鞏固');
export const LOWER_CHAPTERS=[
 {id:'g7-c5',grade:'g7',volume:'lower',number:5,title:B('Intersecting and parallel lines','相交線與平行線'),lessons:[1,14],pages:[1,28],use,packIds:['g7-intersections-perpendicular','g7-parallel-conditions','g7-translation']},
 {id:'g7-c6',grade:'g7',volume:'lower',number:6,title:B('Real numbers','實數'),lessons:[15,19],pages:[29,38],use,packIds:['g7-square-cube-roots','g7-real-number-estimation']},
 {id:'g7-c7',grade:'g7',volume:'lower',number:7,title:B('Cartesian coordinates','平面直角坐標系'),lessons:[20,25],pages:[39,50],use,packIds:['g7-coordinate-location-translation']},
 {id:'g7-c8',grade:'g7',volume:'lower',number:8,title:B('Systems of linear equations','二元一次方程組'),lessons:[26,35],pages:[51,70],use,packIds:['g7-systems-elimination','g7-systems-modelling','g7-three-variable-systems']},
 {id:'g7-c9',grade:'g7',volume:'lower',number:9,title:B('Inequalities and systems of inequalities','不等式與不等式組'),lessons:[36,44],pages:[71,88],use,packIds:['g7-linear-inequalities','g7-inequality-systems-applications']},
 {id:'g7-c10',grade:'g7',volume:'lower',number:10,title:B('Collecting, organising and representing data','數據的收集、整理與描述'),lessons:[45,49],pages:[89,98],use,packIds:['g7-statistical-surveys','g7-frequency-histograms']},
 {id:'g8-c16',grade:'g8',volume:'lower',number:16,title:B('Square-root expressions','二次根式'),lessons:[1,6],pages:[1,12],use,packIds:['g8-radicals-meaning','g8-radicals-operations']},
 {id:'g8-c17',grade:'g8',volume:'lower',number:17,title:B('Pythagoras’ theorem','勾股定理'),lessons:[7,13],pages:[13,26],use,packIds:['g8-pythagoras-lengths','g8-pythagoras-converse']},
 {id:'g8-c18',grade:'g8',volume:'lower',number:18,title:B('Parallelograms','平行四邊形'),lessons:[14,24],pages:[27,48],use,packIds:['g8-parallelograms-tests','g8-rectangles-rhombi','g8-squares-classification']},
 {id:'g8-c19',grade:'g8',volume:'lower',number:19,title:B('Linear functions','一次函數'),lessons:[25,37],pages:[49,74],use,packIds:['g8-functions-representations','g8-linear-functions-properties','g8-linear-functions-models']},
 {id:'g8-c20',grade:'g8',volume:'lower',number:20,title:B('Analysing data','數據的分析'),lessons:[38,42],pages:[75,84],use,packIds:['g8-data-centres','g8-data-variance']},
];
export const LOWER_NEW_PACK_IDS=LOWER_CHAPTERS.flatMap(chapter=>chapter.packIds);
