/** Small, explicit authoring helpers. Mathematics stays in the authored modules. */
// Normalise occasional simplified characters in authored teaching text. Source filenames remain exact.
const simplified='数满态图项从换几识负论结条过给对进证应线与为没现变夹点时写尔圆边实组称遗长内齐参见贝须减递这纳复场单个关阶虽稳贴极网览们风样横释听叶细拦带绪测连转画义体阵导计顶则将积开闭无录层问练偿余云';
const traditional='數滿態圖項從換幾識負論結條過給對進證應線與為沒現變夾點時寫爾圓邊實組稱遺長內齊參見貝須減遞這納複場單個關階雖穩貼極網覽們風樣橫釋聽葉細攔帶緒測連轉畫義體陣導計頂則將積開閉無錄層問練償餘雲';
if(simplified.length!==traditional.length)throw Error('Invalid teaching-text character map');
const chineseMap=new Map([...simplified].map((c,i)=>[c,traditional[i]]));
export const L = (en, zh) => ({ en, zh:[...zh].map(c=>chineseMap.get(c)||c).join('') });
export const S = (en, zh, math) => ({ body: L(en, zh), ...(math ? { math } : {}) });
export function Q(kind, level, en, zh, expression, answer, hints, steps, result, explanation, extra = {}) {
  return { kind, level, prompt: L(en, zh), ...(expression ? { expression } : {}), answer,
    hints, steps, result, explanation, ...extra };
}
export function lesson(spec) {
  const questions = spec.questions.map((question, index) => ({
    ...question,
    id: question.id || `${spec.id}-${question.kind}-${index + 1}`,
    source: question.source || { type: 'original', lessonId: spec.id },
    skills: question.skills || [spec.id],
  }));
  return { ...spec, questions, status: spec.status || 'authored' };
}
export function chapterReview(chapterId, title, questions) {
  return lesson({
    id: `review-${chapterId}`, chapterId, bookId: chapterId.split('-')[0], title,
    summary: L('A mixed assessment: identify the method, justify it and revise your reasoning.', '混合評量：辨認方法、說明理由，再訂正自己的推理。'),
    objectives: [L('Connect the chapter skills without relying on the order of the exercises.', '不依賴題目排列提示，綜合運用本章知識。')],
    concepts: [], misconceptions: [], prerequisites: [],
    teacher: {
      prompts: [L('Ask students to name the relevant condition before calculating.', '計算前，先請學生指出適用條件。')],
      board: [L('Compare valid methods and annotate their conditions.', '比較成立的方法，並標示各自條件。')],
      anticipated: [L('A correct final value may still hide a missing assumption.', '最終數值正確，仍可能遺漏假設。')],
      rubric: [L('Check the method, conditions, reasoning and interpretation separately.', '分別檢核方法、條件、推理與結果解釋。')],
    },
    questions,
  });
}
