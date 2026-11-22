import { gradeTransfer, practiceKey, practiceState, transferProblem } from '../data/selah-practice.mjs';

function initialise(root: HTMLElement) {
  const zh = root.dataset.locale === 'zh-Hant';
  const t = (en: string, tc: string) => zh ? tc : en;
  const get = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  let state = practiceState(null);
  try { state = practiceState(JSON.parse(localStorage.getItem(practiceKey) ?? 'null')); } catch {}
  const invariant = get<HTMLFormElement>('[data-invariant]');
  const transfer = get<HTMLFormElement>('[data-transfer]');
  const feedback = get('[data-transfer-feedback]');
  const labels: Record<string,string> = {
    open: t('to try', '待練習'), assisted: t('completed with a hint', '提示後完成'),
    independent: t('completed independently', '獨立完成'), viewed: t('read the explanation', '已睇解法'),
  };
  const topic: Record<string,string> = {
    arc:t('why the point stays on the arc','點解個點沿住圓弧行'),
    line:t('why the sum changes','點解個和會改變'), balance:t('when the roots are equal','兩個根式幾時相等'),
    square:t('the bound on the square of the sum','和嘅平方有咩上界'),
  };
  function update() {
    const p = transferProblem(state.attempt);
    get('[data-transfer-formula]').textContent = `√(x − ${p.low}) + √(${p.high} − x)`;
    get('[data-remedy]').hidden = !state.misconception;
    get('[data-another]').hidden = state.transfer === 'open';
    get('[data-card-summary]').textContent = t(`Prediction — ${labels[state.invariant]}. New problem — ${labels[state.transfer]}.`,`猜想 · ${labels[state.invariant]}。變式題 · ${labels[state.transfer]}。`);
    const revisit = topic[state.difficulty];
    const task = state.transfer === 'independent' ? t('Try a fresh interval.', '換個區間再試。') : t(`Revisit the maximum on [${p.low}, ${p.high}].`,`重做區間 [${p.low}, ${p.high}] 嘅最大值題。`);
    get('[data-card-next]').textContent = (revisit ? t(`Revisit ${revisit}. `,`重溫「${revisit}」。`) : '') + task;
    try { localStorage.setItem(practiceKey, JSON.stringify(state)); } catch {}
  }
  function showReason() {
    get('[data-invariant-feedback]').textContent = t('The squared roots add to (x − 3) + (6 − x) = 3. The point stays a distance √3 from the origin.', '兩個根式分別平方再加，得到 (x − 3) + (6 − x) = 3，所以個點同原點嘅距離一直係 √3。');
  }
  invariant.addEventListener('submit', event => {
    event.preventDefault();
    const choice = String(new FormData(invariant).get('invariant'));
    if (choice === 'squares') {
      if (state.invariant === 'open') state.invariant = state.misconception ? 'assisted' : 'independent';
      showReason();
    } else {
      state.misconception = choice;
      state.difficulty = choice === 'sum' ? 'line' : 'arc';
      get('[data-invariant-feedback]').textContent = choice === 'sum'
        ? t('Look at u + v in the two rows. Does √3 equal √6? Try the prediction again.', '比較表入面兩個和。√3 同 √6 相等嗎？再估一次。')
        : t('Compare the differences. One is negative and one is zero. Try the prediction again.', '比較兩行嘅差。一個係負數，一個係零，再估一次。');
    }
    update();
  });
  get('[data-reveal-invariant]').addEventListener('click', () => {
    if (state.invariant === 'open') state.invariant = 'viewed';
    showReason(); update();
  });
  function solution() {
    const {low, high, midpoint, maximum} = transferProblem(state.attempt);
    return t(`The squared sum is 2 × (${high} − ${low}) minus the squared difference. It reaches ${maximum ** 2} when the two roots are equal, at x = ${midpoint}. The sum reaches ${maximum}.`,`和嘅平方等於 2 × (${high} − ${low}) 減去兩項之差嘅平方。兩個根式相等時，x = ${midpoint}，和嘅平方達到 ${maximum ** 2}，所以和最大係 ${maximum}。`);
  }
  function hint(kind: string) {
    state.hint = true;
    state.difficulty = kind;
    feedback.textContent = kind === 'balance'
      ? t('Set the two radicands equal, then solve for x.', '令兩個根號入面嘅式相等，解出 x。')
      : t('Square the sum and subtract the squared difference from twice the sum of squares. Which term must vanish? Then take the square root.', '用平方和嘅兩倍減兩項之差嘅平方，就得到和嘅平方。邊一項要等於零？最後記得開平方。');
    update();
  }
  get('[data-hint]').addEventListener('click', () => hint('balance'));
  get('[data-reveal-transfer]').addEventListener('click', () => {
    if (state.transfer === 'open') { state.transfer = 'viewed'; state.difficulty = 'square'; }
    feedback.textContent = solution(); update();
  });
  transfer.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(transfer);
    const field = (name: string) => String(values.get(name) ?? '');
    const verdict = gradeTransfer(transferProblem(state.attempt), field('x'), field('sum'), field('reason'));
    if (verdict === 'correct') {
      if (state.transfer === 'open') state.transfer = state.hint ? 'assisted' : 'independent';
      feedback.textContent = t('Correct. ', '答啱。') + solution(); update();
    } else if (verdict !== 'incomplete') hint(verdict);
  });
  get('[data-another]').addEventListener('click', () => {
    state.attempt++; state.transfer = 'open'; state.hint = false;
    transfer.reset(); feedback.textContent = ''; update();
    get<HTMLInputElement>('[name=x]').focus();
  });
  get('[data-review]').addEventListener('click', () =>
    window.dispatchEvent(new CustomEvent('selah:review-cue', { detail: { id: state.difficulty || 'square' } })));
  window.addEventListener('selah:written-progress', event => {
    const {stepId, outcome, choice} = (event as CustomEvent).detail;
    if (outcome === 'hint') state.difficulty = stepId === 'prove' ? 'square' : choice === 'sum' ? 'line' : 'arc';
    if (stepId === 'explore') {
      if (outcome === 'hint') state.misconception = choice;
      else if (state.invariant === 'open') state.invariant = outcome;
    }
    update();
  });
  if (state.invariant !== 'open') showReason();
  if (state.transfer === 'viewed') feedback.textContent = solution();
  update();
  root.hidden = false;
}
document.querySelectorAll<HTMLElement>('[data-selah-practice]').forEach(initialise);
