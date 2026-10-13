// Task-family routing, not an estimate of learner ability or item difficulty.
const families={
 conditions:/domain|restriction|degener|zero|condition|normaliz|undefined|model|boundary|endpoint|interval|focus|range|support|feasible|locus/i,
 method:/inverse|counterexample|compare|choice|model|interpret|proof|identity|factor|parameter|chain|regression/i,
 algebra:/expand|coeff|factor|sign|simplif|substit|coordinate|basis|rule|product|quotient|chain|calculation/i,
 'missing-solutions':/root|solution|equation|intersection|interval|zero|degener|boundary|endpoint/i,
 diagram:/graph|vertex|transform|circle|locus|curve|projection|reflection|sketch|geometry|geometric|triangle|ellipse|hyperbola|parabola/i,
 expression:/explain|interpret|proof|counterexample|condition|regression|model|identity|reflection/i,
};
export function taskCorrections(taskType=''){return Object.entries(families).filter(([,pattern])=>pattern.test(taskType)).map(([id])=>id);}
/** @type {Record<string,{en:string,zh:string}>} */
export const correctionGuidance={
 conditions:{en:'Write the domain, nonzero denominators and model assumptions before calculating. Test a boundary case.',zh:'計算前列出定義域、非零分母及模型假設，再檢查邊界情況。'},
 method:{en:'State the quantity asked for; compare two available methods and justify your choice.',zh:'先寫所求量，比較兩種可行方法，再說明選法理由。'},
 algebra:{en:'Show one transformation per line and substitute the result into the original relation.',zh:'每行只做一項變形，再把結果代回原關係式。'},
 'missing-solutions':{en:'Separate zero and degenerate cases before division. Enumerate every branch and filter by the original interval.',zh:'除法前分開零值及退化情況，列全分支，再按原區間篩選。'},
 diagram:{en:'Label axes, coordinates and scale; connect each feature with its equation or definition.',zh:'標示坐標軸、坐標及比例，將每項圖像特徵連回方程或定義。'},
 expression:{en:'Connect the givens, the theorem conditions and the conclusion in complete sentences.',zh:'以完整句子連接已知條件、定理的適用條件及結論。'},
};
