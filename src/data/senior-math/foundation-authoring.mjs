// Small authoring primitives for the original compulsory-course material.
// A bank varies the mathematical task, not just the numbers in one template.
import { L, S, Q, lesson, chapterReview } from './authoring.mjs';

export { L };
export const P = (en, zh) => L(en, zh);
/** Compact bilingual authoring literal; mathematical vertical bars belong in math fields. */
export const B = (text) => { const split = text.indexOf('｜'); if (split < 0) throw new Error(`Missing translation: ${text}`); return P(text.slice(0, split), text.slice(split + 1)); };
export const C = (title, body, formula) => ({ title: B(title), body: B(body), ...(formula ? { formula } : {}) });
export const tex = (s) => typeof s === 'string' ? s.replaceAll('§', String.fromCharCode(92)) : s;
export function n(prompt, expression, answer, strategy, intermediate, derivation, explanation, extra) {
  const p = B(prompt);
  return N(p.en, p.zh, expression, answer, B(strategy), B(intermediate), derivation, B(explanation), extra);
}
export function w(prompt, expression, result, strategy, intermediate, derivation, explanation, extra) {
  const p = B(prompt);
  return W(p.en, p.zh, expression, B(result), B(strategy), B(intermediate), derivation, B(explanation), extra);
}
/** Seven different mathematical tasks per section, each with its own intermediate hint and explanation. */
export function taskBank(strategy, make) {
  return (task, seed, serial) => {
    const row = make(seed, serial)[task];
    if (!row || row.length < 6) throw new Error(`Incomplete foundation task ${task}`);
    const [prompt, expression, answer, derivation, intermediate, explanation, extra] = row;
    return (typeof answer === 'number' ? n : w)(prompt, expression, answer, strategy, intermediate, derivation, explanation, extra);
  };
}
export const exact = (value) => Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(8))}`;
export const sq = (x) => x * x;
export const choose = (n, k) => {
  let v = 1;
  for (let i = 1; i <= k; i++) v = v * (n - i + 1) / i;
  return v;
};

/** The two hints name a strategy and an intermediate relation, respectively. */
export function N(en, zh, expression, answer, strategy, intermediate, derivation, explanation, extra = {}) {
  if (!Number.isFinite(answer)) throw new Error(`Non-finite original answer: ${en}`);
  return { kind: 'number', en, zh, expression, answer, strategy, intermediate, derivation,
    result: P(`The requested value is ${exact(answer)}.`, `所求值為 ${exact(answer)}。`), explanation, ...extra };
}
export function W(en, zh, expression, result, strategy, intermediate, derivation, explanation, extra = {}) {
  return { kind: 'written', en, zh, expression, answer: result, strategy, intermediate, derivation,
    result, explanation, ...extra };
}

export function question(raw, kind, level) {
  const derivation = Array.isArray(raw.derivation) ? raw.derivation : [raw.derivation];
  const steps = [S(raw.strategy.en, raw.strategy.zh), ...derivation.map((part) =>
    typeof part === 'string' ? S('Calculate or simplify this relation.', '計算或化簡此關係式。', tex(part))
      : S(part.en, part.zh, part.math)), S(raw.explanation.en, raw.explanation.zh)];
  return Q(kind || raw.kind, level, raw.en, raw.zh, tex(raw.expression), raw.answer,
    [raw.strategy, raw.intermediate], steps, raw.result, raw.explanation, {
      tolerance: raw.tolerance ?? 1e-7,
      conditions: raw.conditions || [P('Use the domain, units and sampling assumptions stated in the question.', '依題目所列定義域、單位與抽樣假設作答。')],
      skill: raw.skill,
      rubric: raw.kind === 'written' ? [
        P('State the relevant definition, condition or model.', '寫出所用定義、條件或模型。'),
        P('Show a valid calculation, proof or counterexample.', '給出有效計算、證明或反例。'),
        P('Interpret the conclusion with its restrictions.', '連同限制解釋結論。'),
      ] : undefined,
      ...raw.extra,
    });
}

const levels = ['foundation', 'standard', 'transfer',
  'foundation', 'foundation', 'foundation', 'foundation',
  'standard', 'standard', 'standard', 'standard', 'transfer', 'transfer'];

export function buildSection(meta, bank) {
  const questions = levels.map((level, i) => {
    const task = i < 3 ? [0,1,6][i] : (i-3)%7;
    const seed = i < 3 ? 2 : 3 + Math.floor((i-3)/7);
    const raw = bank(task, seed, i);
    return question(raw, i < 3 ? 'example' : undefined, level);
  });
  return lesson({ ...meta, questions });
}

export function buildReview(chapter, banks) {
  const questions = Array.from({ length: 15 }, (_, i) => {
    const bankIndex = i % banks.length;
    const bank = banks[bankIndex];
    const skillIndex = (Math.floor(i / banks.length) * 3 + bankIndex) % 7;
    const raw = bank(skillIndex, 7 + Math.floor(i / banks.length), i + 100);
    raw.extra = {...raw.extra, skills:[`${chapter.id}-${bankIndex+1}`]};
    return question(raw, undefined, i < 6 ? 'foundation' : i < 12 ? 'standard' : 'transfer');
  });
  return chapterReview(chapter.id,
    P(`${chapter.title.en}: mixed assessment`, `${chapter.title.zh}：綜合評估`), questions);
}

export function sectionMeta({ id, bookId, chapterId, section, title, page, pdfPage, focus, concepts,
  misconceptions, prerequisites = [], inquiryType = 'algebra' }) {
  concepts = concepts.map(c => ({...c, ...(c.formula ? {formula:tex(c.formula)}:{})}));
  return {
    id, bookId, chapterId, section, title,
    summary: P(`Build understanding of ${title.en.toLowerCase()} through definitions, contrasting cases and justified applications.`,
      `透過定義、對照例子及有理據的應用，掌握${title.zh}。`),
    source: { documentId: `textbook-${bookId}`, pdfPage, printedPage: page, section },
    objectives: [focus, P('Connect representations and justify the steps, including boundary cases.', '連結不同表示法，說明每步理由，並處理邊界情況。'),
      P('Explain a solution and apply the idea to a changed situation.', '能解釋解法，並把概念用於改變了的情境。')],
    concepts, misconceptions, prerequisites,
    teacher: {
      prompts: [P(`What must be true before using the main rule for ${title.en.toLowerCase()}?`, `使用「${title.zh}」的主要法則前，須满足甚麼條件？`),
        P('Which representation makes this task easier, and why?', '哪一種表示法能使此題較易處理？為甚麼？'),
        P('Change one assumption. Does the conclusion survive?', '改變一項假設後，原結論還成立嗎？')],
      board: [focus, ...concepts.map((c) => ({...P(`${c.title.en}: ${c.body.en}`,
        `${c.title.zh}：${c.body.zh}`), ...(c.formula ? {math:c.formula} : {})})),
        P('Close with: conditions → representation → reasoning → check.', '總結：條件 → 表示 → 推理 → 檢驗。')],
      anticipated: [...concepts.map(c=>P(`Expected reasoning: ${c.body.en}`,`預期理由：${c.body.zh}`)),
        ...misconceptions.map((m) => P(`Expected correction: ${m.en}`, `預期修正：${m.zh}`))],
      rubric: [P('1: identify the givens and required quantity.', '1：辨識已知條件及所求。'),
        P('1: choose a valid definition, representation or method.', '1：選取合適定義、表示或方法。'),
        P('1: present connected, correct reasoning.', '1：推理連貫且正確。'),
        P('1: check conditions and explain the result.', '1：檢驗條件並解釋結果。')],
    },
    inquiry: { type: inquiryType,
      prediction: P(`Before calculating, predict how the conclusion changes when one defining condition in ${title.en.toLowerCase()} changes. Record a reason.`,
        `計算前，預測「${title.zh}」的一項定義條件改變後，結論會怎樣改變，並記錄理由。`),
      explanation: P('Compare two admissible cases and one boundary or invalid case. Explain the observed difference using the stated definition.',
        '比較兩個符合條件的例子及一個邊界或不符合條件的例子，利用所述定義解釋差異。'),
      transfer: P('Construct a new example and a tempting incorrect solution. Repair the solution by naming the missing condition.',
        '自擬新例子及一個容易令人信服的錯誤解法，再指出缺漏條件並修正。') },
  };
}
