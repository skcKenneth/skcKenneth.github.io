import { evaluateSelah } from '../data/selah-lesson.mjs';

interface LessonProgress {
  stepId?: string;
  resolved?: string[];
  x?: number;
}

function loadProgress(key: string): LessonProgress {
  try {
    const progress: unknown = JSON.parse(localStorage.getItem(key) ?? '{}');
    return progress && typeof progress === 'object' ? progress : {};
  } catch {
    return {};
  }
}

function drawGraph(canvas: HTMLCanvasElement, { u, v, sum }: ReturnType<typeof evaluateSelah>) {
  const context = canvas.getContext('2d');
  if (!context) return;

  const width = 408;
  const height = 292;
  const scale = 100;
  const originX = 100;
  const originY = 249;
  const limit = 2.1;
  const ratio = Math.min(window.devicePixelRatio || 1, 3);
  if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  const x = (value: number) => originX + value * scale;
  const y = (value: number) => originY - value * scale;
  const line = (fromX: number, fromY: number, toX: number, toY: number) => {
    context.beginPath();
    context.moveTo(x(fromX), y(fromY));
    context.lineTo(x(toX), y(toY));
    context.stroke();
  };

  context.font = '14px monospace';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.strokeStyle = '#39594b';
  context.fillStyle = '#ccdbd0';
  context.lineWidth = 1;
  for (const tick of [0.5, 1, 1.5, 2]) {
    line(tick, 0, tick, limit);
    line(0, tick, limit, tick);
    context.fillText(String(tick), x(tick), y(0) + 17);
    context.fillText(String(tick), x(0) - 20, y(tick));
  }

  context.strokeStyle = '#92ad9f';
  line(0, 0, limit, 0);
  line(0, 0, 0, limit);
  context.fillText('0', x(0) - 12, y(0) + 17);
  context.fillText('u', x(limit) + 16, y(0));
  context.fillText('v', x(0), y(limit) - 16);

  context.strokeStyle = '#89c8aa';
  context.lineWidth = 3;
  context.beginPath();
  context.arc(x(0), y(0), Math.sqrt(3) * scale, -Math.PI / 2, 0);
  context.stroke();

  context.strokeStyle = '#f3d284';
  context.lineWidth = 2;
  context.setLineDash([7, 5]);
  line(Math.max(0, sum - limit), Math.min(sum, limit), Math.min(sum, limit), Math.max(0, sum - limit));
  context.setLineDash([]);

  context.fillStyle = '#fff3c2';
  context.strokeStyle = '#1a3029';
  context.lineWidth = 2;
  context.beginPath();
  context.arc(x(u), y(v), 6, 0, 2 * Math.PI);
  context.fill();
  context.stroke();
}

function initialiseLesson(root: HTMLElement) {
  const all = <T extends HTMLElement>(selector: string) => [...root.querySelectorAll<T>(selector)];
  const find = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector);
  const steps = all<HTMLElement>('[data-selah-step]');
  const links = all<HTMLButtonElement>('[data-selah-step-link]');
  const quizzes = all<HTMLFormElement>('[data-selah-quiz]');
  const previous = find<HTMLButtonElement>('[data-selah-prev]');
  const next = find<HTMLButtonElement>('[data-selah-next]');
  const progress = find('[data-selah-progress]');
  const slider = find<HTMLInputElement>('[data-selah-slider]');
  const canvas = find<HTMLCanvasElement>('[data-selah-canvas]');
  const readouts = all<HTMLElement>('[data-selah-value]');
  const lessonId = root.dataset.lessonId;
  if (!lessonId || !previous || !next || !progress || !steps.length) return;

  const zh = root.dataset.locale === 'zh-Hant';
  const locale = zh ? 'zh-Hant' : 'en';
  const storageKey = `selah:${lessonId}:v1`;
  const saved = loadProgress(storageKey);
  const stepId = (step: HTMLElement) => step.dataset.selahStep ?? '';
  const resolved = new Set(Array.isArray(saved.resolved) ? saved.resolved : []);
  const hasPendingQuiz = (step: HTMLElement) => Boolean(step.querySelector('[data-selah-quiz]')) && !resolved.has(stepId(step));
  const lastReachable = () => {
    const pending = steps.findIndex(hasPendingQuiz);
    return pending < 0 ? steps.length - 1 : pending;
  };

  const requested = steps.findIndex(step => `#${step.id}` === location.hash);
  const restored = steps.findIndex(step => stepId(step) === saved.stepId);
  let current = Math.max(0, Math.min(requested < 0 ? restored : requested, lastReachable()));
  if (slider && typeof saved.x === 'number' && saved.x >= 3 && saved.x <= 6) slider.value = String(saved.x);

  function saveProgress() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        stepId: stepId(steps[current]), resolved: [...resolved], x: slider?.valueAsNumber,
      }));
    } catch {
      // The open lesson keeps working when browser storage is disabled.
    }
  }

  function refreshGraph() {
    if (!slider || !canvas) return;
    const values = evaluateSelah(slider.valueAsNumber);
    for (const readout of readouts) {
      const key = readout.dataset.selahValue as keyof typeof values;
      readout.textContent = values[key].toFixed(key === 'x' ? 2 : 3);
    }
    drawGraph(canvas, values);
  }

  const tutor = initialiseTutor(root, locale, lessonId, () => stepId(steps[current]));

  function render() {
    steps.forEach((step, index) => {
      step.hidden = index !== current;
      const pending = hasPendingQuiz(step);
      step.querySelectorAll<HTMLElement>('[data-selah-reveal]').forEach(element => { element.hidden = pending; });
      const quiz = step.querySelector<HTMLFormElement>('[data-selah-quiz]');
      if (quiz) quiz.hidden = !pending;
    });
    links.forEach((button, index) => {
      button.disabled = index > lastReachable();
      if (index === current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    if (previous) previous.disabled = current === 0;
    if (next) next.disabled = current === steps.length - 1 || hasPendingQuiz(steps[current]);
    if (progress) progress.textContent = `${current + 1} / ${steps.length}`;
  }

  function goTo(index: number) {
    if (index < 0 || index > lastReachable() || index === current) return;
    current = index;
    tutor?.showStep(steps[current]);
    render();
    saveProgress();
    history.replaceState(history.state, '', `#${steps[current].id}`);
    steps[current].querySelector<HTMLElement>('[data-selah-step-heading]')?.focus();
  }

  for (const form of quizzes) {
    const step = form.closest<HTMLElement>('[data-selah-step]');
    const feedback = step?.querySelector<HTMLElement>('[data-selah-quiz-feedback]');
    const showAnswer = form.querySelector<HTMLButtonElement>('[data-selah-show-answer]');
    const explanation = step?.querySelector<HTMLElement>('[data-selah-quiz-explanation]');
    const hint = step?.querySelector<HTMLTemplateElement>('[data-selah-hint]');
    if (!step || !feedback || !showAnswer || !explanation || !hint) continue;
    let neededHint = false;
    const record = (outcome: string, choice = '') => window.dispatchEvent(new CustomEvent('selah:written-progress', {
      detail: {stepId: stepId(step), outcome, choice},
    }));

    const resolve = (correct: boolean) => {
      resolved.add(stepId(step));
      record(correct ? neededHint ? 'assisted' : 'independent' : 'viewed');
      feedback.textContent = correct ? (zh ? '答對了。' : 'Correct.') : '';
      render();
      saveProgress();
      explanation.focus();
    };

    form.addEventListener('submit', event => {
      event.preventDefault();
      const answer = new FormData(form).get('choice');
      if (answer === form.dataset.answerId) {
        resolve(true);
        return;
      }
      feedback.textContent = hint.content.textContent?.trim() ?? '';
      neededHint = true;
      record('hint', String(answer));
      showAnswer.hidden = false;
    });
    showAnswer.addEventListener('click', () => resolve(false));
  }

  links.forEach((button, index) => button.addEventListener('click', () => goTo(index)));
  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  slider?.addEventListener('input', () => {
    refreshGraph();
    saveProgress();
  });

  all('[data-selah-enhanced]').forEach(element => { element.hidden = false; });
  root.dataset.selahReady = '';
  tutor?.showStep(steps[current]);
  render();
  refreshGraph();
}

function initialiseTutor(root: HTMLElement, locale: 'en' | 'zh-Hant', lessonId: string, currentStepId: () => string) {
  const endpoint = root.dataset.apiUrl;
  const form = root.querySelector<HTMLFormElement>('[data-selah-ask-form]');
  const invite = form?.querySelector<HTMLInputElement>('[data-selah-invite-code]');
  const question = form?.querySelector<HTMLTextAreaElement>('[data-selah-question]');
  const submit = form?.querySelector<HTMLButtonElement>('[data-selah-ask-submit]');
  const activeStep = root.querySelector<HTMLElement>('[data-selah-asking-step]');
  const status = root.querySelector<HTMLElement>('[data-selah-ask-status]');
  const reply = root.querySelector<HTMLElement>('[data-selah-answer]');
  const answer = reply?.querySelector<HTMLElement>('[data-selah-answer-text]');
  const reference = reply?.querySelector<HTMLAnchorElement>('[data-selah-answer-reference]');
  if (!endpoint || !form || !invite || !question || !submit || !activeStep || !status || !reply || !answer || !reference) return;

  const zh = locale === 'zh-Hant';
  const unavailable = zh ? '暫時未能取得答覆。你可以先參考這一步的提示或題解。' : 'An answer is unavailable right now. Use the hint or worked explanation for this step.';
  let active: AbortController | undefined;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (active) return;
    const code = invite.value.trim();
    const message = question.value.trim();
    if (!code || !message) {
      status.textContent = zh ? '請輸入試用碼和問題。' : 'Enter your invite code and question.';
      return;
    }

    const stepId = currentStepId();
    const request = new AbortController();
    const timer = window.setTimeout(() => request.abort(), 22_000);
    active = request;
    submit.disabled = true;
    status.textContent = zh ? '等待答覆…' : 'Waiting for an answer…';
    reply.hidden = true;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${code}` },
        body: JSON.stringify({ lessonId, stepId, locale, question: message }),
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        signal: request.signal,
      });
      if (active !== request) return;
      if (!response.ok) {
        status.textContent = response.status === 403
          ? (zh ? '試用碼無效或已到期。' : 'This invite code is invalid or has expired.')
          : response.status === 429
            ? (zh ? '今天的答疑額度已用完。你仍可繼續課堂。' : 'Today’s question limit has been reached. You can continue the lesson.')
            : unavailable;
        return;
      }

      const result: { answer?: unknown; referenceStepId?: unknown } = await response.json();
      if (active !== request) return;
      if (typeof result?.answer !== 'string' || !result.answer.trim() || result.referenceStepId !== stepId) {
        status.textContent = unavailable;
        return;
      }
      answer.textContent = result.answer;
      reference.href = `#selah-step-${stepId}`;
      reference.textContent = zh ? '返回對應板書' : 'See the board for this step';
      reply.hidden = false;
      status.textContent = zh ? '答覆已顯示在下方。' : 'The answer is shown below.';
    } catch {
      if (active === request) status.textContent = unavailable;
    } finally {
      window.clearTimeout(timer);
      if (active === request) {
        active = undefined;
        submit.disabled = false;
      }
    }
  });

  return {
    showStep(step: HTMLElement) {
      active?.abort();
      active = undefined;
      activeStep.textContent = step.querySelector('[data-selah-step-heading]')?.textContent ?? '';
      question.value = '';
      status.textContent = '';
      answer.textContent = '';
      reply.hidden = true;
      submit.disabled = false;
    },
  };
}

document.querySelectorAll<HTMLElement>('[data-selah]').forEach(initialiseLesson);
