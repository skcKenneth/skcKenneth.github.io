import { quadraticSummary, quadraticValue, trigValue, trigSummary, checkAnswer, loadProgress, saveProgress, initialProgress } from '../lib/jae-math-model.mjs';
import { initializeSeniorInquiries } from './senior-math-inquiry-ui';
import { progressForExport, readableProgress } from '../lib/jae-math-export.mjs';

type Point = { x: number; y: number };
type Stroke = { color: string; points: Point[] };

export function initializeJaeMath(root: HTMLElement) {
  if (root.dataset.ready) return;
  root.dataset.ready = 'true';
  const zh = root.dataset.locale === 'zh-Hant';
  const t = (en: string, ch: string) => zh ? ch : en;
  const q = <T extends Element = HTMLElement>(selector: string, within: ParentNode = root) => within.querySelector<T>(selector)!;
  const qa = <T extends Element = HTMLElement>(selector: string, within: ParentNode = root) => Array.from(within.querySelectorAll<T>(selector));
  const topics: any[] = JSON.parse(root.querySelector('[data-jae-data]')?.textContent || '[]');
  const questions: any[] = topics.flatMap(topic => topic.questions.map((question: any) => ({ ...question, topic: topic.id })));
  const cards = new Map(qa<HTMLElement>('[data-question]').map(card => [card.dataset.question!, card]));
  let storage: Storage | undefined;
  try { storage = window.localStorage; } catch { /* Reading remains available. */ }
  const loaded: any = storage ? loadProgress(storage) : { progress: initialProgress(), available: false, issue: 'unavailable' };
  let progress: any = loaded.progress;
  let persistent = loaded.available;
  // Leave unreadable stored work intact. New work can still be exported.
  if (loaded.issue === 'corrupt') { storage = undefined; persistent = false; }
  const changedIds = new Set<string>();
  const record = (id: string) => { changedIds.add(id); return progress.answers[id] ??= { input: '', notes: '', correction: '', completed: false, attempts: 0, lastResult: null }; };
  const saveStatus = () => { q('[data-save-status]').textContent = loaded.issue === 'corrupt'
    ? t('Earlier local data could not be read; it is preserved. Export this session.', '未能讀取舊紀錄，原資料已保留；請匯出本次紀錄。')
    : persistent ? t('Saved in this browser · no sign-in', '已保存在此瀏覽器 · 免登入') : t('Session only · saving unavailable; please export', '僅本次瀏覽 · 未能本機保存，請匯出紀錄'); };
  const save = () => { persistent = storage ? saveProgress(storage, progress, changedIds) : false; if (persistent) changedIds.clear(); saveStatus(); root.dispatchEvent(new CustomEvent('jae-progress',{bubbles:true,detail:progress})); };
  qa<HTMLElement>('[data-interactive-only], [data-jae-controls]').forEach(element => { element.hidden = false; });
  saveStatus();
  initializeSeniorInquiries(root, record, save, id=>progress.answers[id]);

  const feedback = (card: HTMLElement, status: string | null) => {
    const element = card.querySelector<HTMLElement>('[data-answer-feedback]');
    if (!element) return;
    const messages: Record<string, string> = {
      correct: t('Correct. Explain why your method works before moving on.', '答案正確。繼續之前，試解釋你的方法為甚麼成立。'),
      incorrect: t('Not yet. Recheck the condition or open one hint, then try again.', '暫時未正確。再檢查題目條件，或先看一個提示後重試。'),
      empty: t('Choose or enter an answer first.', '請先選擇或輸入答案。'),
      invalid: t('Enter a finite decimal or a simple fraction such as 3/2. Do not enter symbols or a zero denominator.', '請輸入有限小數或簡單分數（如 3/2），不要輸入符號，分母不可為零。'),
      reviewed: t('Work recorded for self-assessment. Compare every step with the rubric; this is not automatic grading.', '已記錄作答供自評。請按清單逐步對照；這並非自動評分。'),
    };
    element.textContent = status ? messages[status] || '' : '';
    if (status) element.dataset.status = status; else delete element.dataset.status;
  };
  for (const question of questions) {
    const card = cards.get(question.id)!;
    const saved = progress.answers[question.id];
    if (saved) {
      const number = card.querySelector<HTMLInputElement | HTMLTextAreaElement>('[data-number-answer], [data-written-answer]');
      if (number) number.value = saved.input;
      qa<HTMLInputElement>('input[type=radio]', card).forEach(input => { input.checked = input.value === saved.input; });
      qa<HTMLTextAreaElement>('[data-record]', card).forEach(input => { input.value = saved[input.dataset.record!] || ''; });
      q<HTMLInputElement>('[data-completed]', card).checked = saved.completed;
      feedback(card, saved.checkedInput !== undefined && saved.input !== saved.checkedInput ? null : saved.lastResult);
    }
    qa<HTMLInputElement | HTMLTextAreaElement>('input[type=radio], [data-number-answer], [data-written-answer]', card).forEach(input => input.addEventListener('input', () => {
      if (record(question.id).lastResult && record(question.id).checkedInput === undefined) record(question.id).checkedInput = record(question.id).input;
      record(question.id).input = input.value;
      feedback(card, null);
      save();
    }));
    qa<HTMLTextAreaElement>('[data-record]', card).forEach(input => input.addEventListener('input', () => { record(question.id)[input.dataset.record!] = input.value; save(); }));
    q<HTMLInputElement>('[data-completed]', card).addEventListener('change', event => { record(question.id).completed = (event.target as HTMLInputElement).checked; save(); });
    card.querySelector('form')?.addEventListener('submit', event => {
      event.preventDefault();
      const answer = question.kind === 'choice' ? card.querySelector<HTMLInputElement>('input[type=radio]:checked')?.value || '' : q<HTMLInputElement | HTMLTextAreaElement>('[data-number-answer], [data-written-answer]', card).value;
      const result = checkAnswer(question, answer);
      const entry = record(question.id);
      entry.input = answer;
      entry.lastResult = result.status;
      entry.checkedInput = answer;
      if (result.status === 'correct' || result.status === 'incorrect') entry.attempts += 1;
      feedback(card, result.status);
      save();
    });
  }

  // Graphs use the same deterministic functions as the independently checked model.
  const svgNS = 'http://www.w3.org/2000/svg';
  const svgNode = (name: string, attributes: Record<string, string | number>, content?: string) => {
    const element = document.createElementNS(svgNS, name);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
    if (content !== undefined) element.textContent = content;
    return element;
  };
  const numberText = (number: number) => Math.abs(number) < 1e-8 ? '0' : Number(number.toFixed(3)).toString();
  const radiansText = (degrees: number) => {
    if (degrees === 0) return '0 rad';
    if (!Number.isInteger(degrees)) return `≈ ${numberText(degrees / 180)}π rad`;
    let a = Math.abs(degrees), b = 180;
    while (b) { const remainder = a % b; a = b; b = remainder; }
    const numerator = degrees / a, denominator = 180 / a;
    const coefficient = numerator === 1 ? '' : numerator === -1 ? '−' : String(numerator);
    return `${coefficient}π${denominator === 1 ? '' : '/' + denominator} rad`;
  };
  for (const lab of qa<HTMLElement>('[data-graph]')) {
    const svg = q<SVGSVGElement>('[data-plot]', lab);
    const isQuadratic = lab.dataset.graph === 'quadratics';
    const inputs = qa<HTMLInputElement | HTMLSelectElement>('[data-param]', lab);
    const defaults = new Map(inputs.map(input => [input.dataset.param!, input.value]));
    const parameter = (name: string) => inputs.find(input => input.dataset.param === name)!.value;
    const update = () => {
      const radians = !isQuadratic && parameter('units') === 'radians';
      const values: Record<string, number> = Object.fromEntries(inputs.filter(input => input.tagName === 'INPUT').map(input => [input.dataset.param!, Number(input.value)]));
      inputs.forEach(input => {
        const output = lab.querySelector<HTMLOutputElement>(`[data-value="${input.dataset.param}"]`);
        if (output) {
          output.textContent = input.dataset.param === 'phase' ? (radians ? radiansText(Number(input.value)) : `${input.value}°`) : input.value;
          input.setAttribute('aria-valuetext', output.textContent);
        }
      });
      const bounds = isQuadratic ? { xmin: -6, xmax: 6, ymin: -10, ymax: 10 } : { xmin: -360, xmax: 360, ymin: -4, ymax: 4 };
      const area = { left: 46, right: 620, top: 24, bottom: 324 };
      const px = (x: number) => area.left + (x - bounds.xmin) / (bounds.xmax - bounds.xmin) * (area.right - area.left);
      const py = (y: number) => area.bottom - (y - bounds.ymin) / (bounds.ymax - bounds.ymin) * (area.bottom - area.top);
      svg.replaceChildren();
      svg.append(svgNode('title', {}, isQuadratic ? t('Quadratic function graph', '二次函數圖像') : t('Trigonometric function graph', '三角函數圖像')));
      svg.append(svgNode('rect', { width: 640, height: 360, fill: '#fbfcf7' }));
      const clipId = `jae-clip-${lab.dataset.graph}`;
      const defs = svgNode('defs', {}), clip = svgNode('clipPath', { id: clipId });
      clip.append(svgNode('rect', { x: area.left, y: area.top, width: area.right - area.left, height: area.bottom - area.top })); defs.append(clip); svg.append(defs);
      const xTicks = isQuadratic ? [-6, -4, -2, 0, 2, 4, 6] : [-360, -180, 0, 180, 360];
      const yTicks = isQuadratic ? [-10, -5, 0, 5, 10] : [-4, -2, 0, 2, 4];
      xTicks.forEach((x, i) => {
        svg.append(svgNode('line', { x1: px(x), x2: px(x), y1: area.top, y2: area.bottom, stroke: x === 0 ? '#8da48e' : '#e0e8da', 'stroke-width': x === 0 ? 1.5 : 1 }));
        const value = isQuadratic ? String(x) : radians ? ['−2π', '−π', '0', 'π', '2π'][i] : `${x}°`;
        svg.append(svgNode('text', { x: px(x), y: 346, fill: '#5f725d', 'text-anchor': 'middle', 'font-size': 14, 'font-family': 'sans-serif' }, value));
      });
      yTicks.forEach(y => {
        svg.append(svgNode('line', { x1: area.left, x2: area.right, y1: py(y), y2: py(y), stroke: y === 0 ? '#8da48e' : '#e0e8da', 'stroke-width': y === 0 ? 1.5 : 1 }));
        svg.append(svgNode('text', { x: 32, y: py(y) + 5, fill: '#5f725d', 'text-anchor': 'end', 'font-size': 14, 'font-family': 'sans-serif' }, String(y)));
      });
      const f = (x: number) => isQuadratic ? quadraticValue(x, values.a, values.b, values.c) : trigValue(x, values.amplitude, values.frequency, values.phase, parameter('kind'));
      let path = '';
      for (let i = 0; i <= 600; i += 1) { const x = bounds.xmin + i / 600 * (bounds.xmax - bounds.xmin); path += `${i ? 'L' : 'M'}${px(x).toFixed(2)},${py(f(x)).toFixed(2)} `; }
      svg.append(svgNode('path', { d: path, fill: 'none', stroke: '#216a4d', 'stroke-width': 3, 'stroke-linejoin': 'round', 'clip-path': `url(#${clipId})` }));
      svg.append(svgNode('text', { x: 615, y: 16, 'text-anchor': 'end', fill: '#52634b', 'font-size': 13 }, isQuadratic ? 'x' : radians ? 'x (rad)' : 'x (°)'));
      let description = '';
      if (isQuadratic) {
        const summary = quadraticSummary(values.a, values.b, values.c);
        const rootText = summary.allReal ? t('Every real x is a root: the graph lies on the x-axis.', '所有實數 x 都是根：圖像與 x 軸重合。') : summary.roots.length ? t(`Real roots: ${summary.roots.map(numberText).join(', ')}.`, `實根：${summary.roots.map(numberText).join('、')}。`) : t('No real roots.', '沒有實根。');
        if (summary.type === 'quadratic' && summary.vertex) {
          description = t(`Vertex (${numberText(summary.vertex.x)}, ${numberText(summary.vertex.y)}); axis x = ${numberText(summary.axis!)}; discriminant Δ = ${numberText(summary.discriminant!)}. `, `頂點（${numberText(summary.vertex.x)}，${numberText(summary.vertex.y)}）；對稱軸 x = ${numberText(summary.axis!)}；判別式 Δ = ${numberText(summary.discriminant!)}。`) + rootText;
          if (summary.vertex.x >= bounds.xmin && summary.vertex.x <= bounds.xmax && summary.vertex.y >= bounds.ymin && summary.vertex.y <= bounds.ymax) svg.append(svgNode('circle', { cx: px(summary.vertex.x), cy: py(summary.vertex.y), r: 5, fill: '#b66f35', stroke: '#fff', 'stroke-width': 2 }));
          else description += t(' The vertex is outside this fixed viewing window.', ' 頂點位於目前固定顯示範圍之外。');
        } else description = (summary.type === 'linear' ? t('a = 0: this is a linear function, with no quadratic vertex or discriminant. ', 'a = 0：函數退化為一次函數，沒有二次函數的頂點或判別式。') : t('a = b = 0: this is a constant function, with no quadratic vertex. ', 'a = b = 0：這是常數函數，沒有二次函數的頂點。')) + rootText;
      } else {
        const summary = trigSummary(values.amplitude, values.frequency, values.phase);
        const angle = (degrees: number) => radians ? radiansText(degrees) : `${numberText(degrees)}°`;
        qa<HTMLElement>('[data-trig-formula]', lab).forEach(formula => { formula.hidden = formula.dataset.trigFormula !== parameter('kind'); });
        description = summary.periodDegrees === null ? t('The function is constant and has no least positive period. ', '這是常數函數，沒有最小正週期。') : t(`Amplitude ${numberText(summary.amplitude)}; period ${angle(summary.periodDegrees)}; horizontal shift ${angle(-values.phase / values.frequency)} (−φ/k). `, `振幅 ${numberText(summary.amplitude)}；週期 ${angle(summary.periodDegrees)}；水平位移 ${angle(-values.phase / values.frequency)}（−φ/k）。`);
        description += t(`The graph is y = ${values.amplitude} ${parameter('kind')}( ${values.frequency}x + ${angle(values.phase)} ); x and φ use the displayed angle unit.`, `圖像為 y = ${values.amplitude} ${parameter('kind')}（${values.frequency}x + ${angle(values.phase)}）；x 與 φ 均採用所顯示的角度單位。`);
      }
      q('[data-graph-description]', lab).textContent = description;
      svg.append(svgNode('desc', {}, description));
    };
    inputs.forEach(input => input.addEventListener('input', update));
    q('[data-reset-graph]', lab).addEventListener('click', () => { inputs.forEach(input => { input.value = defaults.get(input.dataset.param!)!; }); update(); });
    update();
  }

  let activeIndex = Math.max(0, questions.findIndex(question => question.id === progress.last.question));
  let mode: 'study' | 'classroom' = progress.last.mode === 'classroom' ? 'classroom' : 'study';
  let revealStage = 0;
  let drawTool = 'select';
  const ink = new Map<string, Stroke[]>();
  const canvases = new Map<string, HTMLCanvasElement>();
  const laserPoints = new Map<string, Point>();
  const laserTimers = new Map<string, number>();
  const activeQuestion = () => questions[activeIndex];
  const dialog = q<HTMLDialogElement>('[data-zoom-dialog]');
  let zoomPlaceholder: Comment | null = null;
  let zoomCard: HTMLElement | null = null;
  const restoreZoom = () => { if (zoomCard && zoomPlaceholder) zoomPlaceholder.replaceWith(zoomCard); zoomCard = null; zoomPlaceholder = null; };
  const closeZoom = () => { restoreZoom(); if (dialog.open) dialog.close(); };
  const syncLanguage = () => {
    const link = document.querySelector<HTMLAnchorElement>('.language-switch a');
    if (!link) return;
    const url = new URL(link.href); url.search = location.search; url.hash = location.hash; link.href = url.href;
  };
  const updateUrl = (id?: string) => {
    const url = new URL(location.href);
    if (mode === 'classroom') url.searchParams.set('mode', 'classroom'); else url.searchParams.delete('mode');
    if (id) url.hash = id;
    history.replaceState(null, '', url);
    syncLanguage();
  };
  const redraw = (id: string) => {
    const canvas = canvases.get(id);
    if (!canvas || !canvas.getBoundingClientRect().width) return;
    const rect = canvas.getBoundingClientRect(), ratio = window.devicePixelRatio || 1;
    const width = Math.round(rect.width * ratio), height = Math.round(rect.height * ratio);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0); context.clearRect(0, 0, rect.width, rect.height);
    context.lineCap = 'round'; context.lineJoin = 'round'; context.lineWidth = 3;
    for (const stroke of ink.get(id) || []) {
      context.strokeStyle = stroke.color; context.beginPath();
      // Use width for both coordinates: opening a hint must not stretch existing ink.
      stroke.points.forEach((point, index) => { const x = point.x * rect.width, y = point.y * rect.width; if (index) context.lineTo(x, y); else context.moveTo(x, y); });
      if (stroke.points.length === 1) { const point = stroke.points[0]; context.lineTo(point.x * rect.width + .1, point.y * rect.width + .1); }
      context.stroke();
    }
    const laser = laserPoints.get(id);
    if (laser) { context.beginPath(); context.arc(laser.x * rect.width, laser.y * rect.width, 7, 0, 2 * Math.PI); context.fillStyle = '#ee322bd9'; context.shadowColor = '#fa413b'; context.shadowBlur = 15; context.fill(); context.shadowBlur = 0; }
  };
  const observer = new ResizeObserver(entries => { entries.forEach(entry => { const id = (entry.target as HTMLElement).closest<HTMLElement>('[data-question]')?.dataset.question; if (id) redraw(id); }); });
  for (const [id, card] of cards) {
    const canvas = q<HTMLCanvasElement>('[data-ink]', card);
    canvases.set(id, canvas); observer.observe(q('.jae-question-stage', card));
    let current: Stroke | null = null;
    const point = (event: PointerEvent): Point => { const rect = canvas.getBoundingClientRect(); return { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(rect.height / rect.width, (event.clientY - rect.top) / rect.width)) }; };
    const laser = (event: PointerEvent) => { laserPoints.set(id, point(event)); clearTimeout(laserTimers.get(id)); laserTimers.set(id, window.setTimeout(() => { laserPoints.delete(id); redraw(id); }, 750)); redraw(id); };
    canvas.addEventListener('pointerdown', event => {
      if (mode !== 'classroom' || drawTool === 'select') return;
      event.preventDefault(); canvas.setPointerCapture(event.pointerId);
      if (drawTool === 'laser') { laser(event); return; }
      current = { color: q<HTMLSelectElement>('[data-pen-color]').value, points: [point(event)] };
      const strokes = ink.get(id) || []; strokes.push(current); ink.set(id, strokes); redraw(id);
    });
    canvas.addEventListener('pointermove', event => {
      if (drawTool === 'laser' && mode === 'classroom') { laser(event); return; }
      if (!current) return;
      current.points.push(point(event)); redraw(id);
    });
    const finish = (event: PointerEvent) => { current = null; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); };
    canvas.addEventListener('pointerup', finish); canvas.addEventListener('pointercancel', finish);
    canvas.addEventListener('pointerleave', () => { laserPoints.delete(id); redraw(id); });
  }
  const reveal = (next: number) => {
    revealStage = Math.max(0, Math.min(3, next));
    const card = cards.get(activeQuestion().id)!;
    qa<HTMLDetailsElement>('[data-reveal]', card).forEach(detail => { detail.open = Number(detail.dataset.reveal) <= revealStage; });
    const button = q<HTMLButtonElement>('[data-reveal-next]');
    button.disabled = revealStage === 3;
    button.textContent = revealStage < 2 ? t(`Reveal hint ${revealStage + 1}`, `顯示提示 ${revealStage + 1}`) : revealStage === 2 ? t('Reveal worked solution', '顯示完整解答') : t('All steps revealed', '已展開全部步驟');
    requestAnimationFrame(() => redraw(activeQuestion().id));
  };
  const renderMode = () => {
    root.dataset.mode = mode;
    root.dataset.drawTool = drawTool;
    qa<HTMLButtonElement>('[data-mode-button]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.modeButton === mode)));
    q<HTMLElement>('[data-classroom-controls]').hidden = mode !== 'classroom';
    const active = activeQuestion();
    qa<HTMLElement>('[data-topic]').forEach(topic => { topic.hidden = mode === 'classroom' && topic.dataset.topic !== active.topic; });
    for (const [id, card] of cards) card.hidden = mode === 'classroom' && id !== active.id;
    qa<HTMLAnchorElement>('[data-topic-link]').forEach(link => { if (link.dataset.topicLink === active.topic) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current'); });
    q<HTMLSelectElement>('[data-directory]').value = active.id;
    q('[data-question-position]').textContent = `${activeIndex + 1} / ${questions.length}`;
    q<HTMLButtonElement>('[data-question-nav="prev"]').disabled = activeIndex === 0;
    q<HTMLButtonElement>('[data-question-nav="next"]').disabled = activeIndex === questions.length - 1;
    if (mode === 'classroom') reveal(0);
    requestAnimationFrame(() => redraw(active.id));
  };
  const scrollToLearningPosition = () => {
    const target = mode === 'classroom' ? q<HTMLElement>('[data-classroom-controls]') : cards.get(activeQuestion().id)!;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
  };
  const selectQuestion = (index: number, update = true) => {
    closeZoom();
    activeIndex = Math.max(0, Math.min(questions.length - 1, index));
    const active = activeQuestion();
    progress.last = { mode, topic: active.topic, question: active.id };
    renderMode();
    if (update) { updateUrl(active.id); save(); if (mode === 'classroom') scrollToLearningPosition(); }
  };
  const rememberStudyQuestion = (id: string) => {
    if (mode !== 'study') return;
    const index = questions.findIndex(question => question.id === id);
    if (index < 0) return;
    activeIndex = index;
    const active = activeQuestion();
    progress.last = { mode, topic: active.topic, question: active.id };
    updateUrl(active.id);
    save();
  };
  for (const [id, card] of cards) {
    card.addEventListener('focusin', () => rememberStudyQuestion(id));
    card.addEventListener('input', () => rememberStudyQuestion(id));
  }
  // Keep a reading student's language link at the current question, too.
  const readingCallback: IntersectionObserverCallback = entries => {
    if (mode !== 'study' || printState) return;
    const visible = entries.filter(entry => entry.isIntersecting).sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
    const card = visible[0]?.target as HTMLElement | undefined;
    if (card?.dataset.question && card.dataset.question !== progress.last.question) rememberStudyQuestion(card.dataset.question);
  };
  let readingObserver: IntersectionObserver;
  const observeReading = () => {
    readingObserver?.disconnect();
    // IntersectionObserver percentage margins use width, even vertically.
    readingObserver = new IntersectionObserver(readingCallback, { rootMargin: `${-Math.round(window.innerHeight * .2)}px 0px ${-Math.round(window.innerHeight * .5)}px 0px`, threshold: 0 });
    cards.forEach(card => readingObserver.observe(card));
  };
  observeReading();
  window.addEventListener('resize', observeReading);
  qa<HTMLButtonElement>('[data-mode-button]').forEach(button => button.addEventListener('click', () => {
    closeZoom(); mode = button.dataset.modeButton === 'classroom' ? 'classroom' : 'study'; progress.last.mode = mode; renderMode(); updateUrl(); save();
    scrollToLearningPosition();
  }));
  qa<HTMLAnchorElement>('[data-topic-link]').forEach(link => link.addEventListener('click', event => {
    if (mode !== 'classroom') return;
    event.preventDefault(); selectQuestion(questions.findIndex(question => question.topic === link.dataset.topicLink));
  }));
  q<HTMLSelectElement>('[data-directory]').addEventListener('change', event => selectQuestion(questions.findIndex(question => question.id === (event.target as HTMLSelectElement).value)));
  qa<HTMLButtonElement>('[data-question-nav]').forEach(button => button.addEventListener('click', () => selectQuestion(activeIndex + (button.dataset.questionNav === 'next' ? 1 : -1))));
  q('[data-reveal-next]').addEventListener('click', () => reveal(revealStage + 1));
  q('[data-reveal-reset]').addEventListener('click', () => reveal(0));
  q('[data-toggle-graph]').addEventListener('click', event => { const shown = root.classList.toggle('jae-show-graph'); (event.currentTarget as HTMLElement).setAttribute('aria-pressed', String(shown)); });
  q<HTMLButtonElement>('[data-toggle-graph]').disabled = !root.querySelector('[data-graph-section]');
  qa<HTMLButtonElement>('[data-draw-tool]').forEach(button => button.addEventListener('click', () => {
    drawTool = button.dataset.drawTool!; root.dataset.drawTool = drawTool;
    qa('[data-draw-tool]').forEach(item => item.setAttribute('aria-pressed', String((item as HTMLElement).dataset.drawTool === drawTool)));
    laserPoints.clear(); redraw(activeQuestion().id);
  }));
  q('[data-clear-ink]').addEventListener('click', () => { ink.delete(activeQuestion().id); laserPoints.delete(activeQuestion().id); redraw(activeQuestion().id); });
  q('[data-zoom]').addEventListener('click', () => {
    if (typeof dialog.showModal !== 'function') return;
    zoomCard = cards.get(activeQuestion().id)!; zoomPlaceholder = document.createComment('question position'); zoomCard.before(zoomPlaceholder);
    q('[data-zoom-content]').append(zoomCard); dialog.showModal(); requestAnimationFrame(() => redraw(activeQuestion().id));
  });
  q('[data-zoom-close]').addEventListener('click', closeZoom);
  dialog.addEventListener('close', () => { restoreZoom(); requestAnimationFrame(() => redraw(activeQuestion().id)); });
  q('[data-fullscreen]').addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else if (root.requestFullscreen) await root.requestFullscreen(); else throw new Error('unavailable'); }
    catch { q('[data-save-status]').textContent = t('Full screen is unavailable; use Enlarge question instead.', '此瀏覽器未能使用全螢幕；可使用「放大題目」。'); }
  });
  document.addEventListener('fullscreenchange', () => { q('[data-fullscreen]').textContent = document.fullscreenElement ? t('Exit full screen', '離開全螢幕') : t('Full screen', '全螢幕'); requestAnimationFrame(() => redraw(activeQuestion().id)); });
  document.addEventListener('keydown', event => {
    if (mode !== 'classroom' || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); selectQuestion(activeIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
    else if ((event.code === 'Space' || event.key === ' ') && !target.closest('button, a, summary')) { event.preventDefault(); reveal(revealStage + 1); }
  });
  const useHash = () => {
    let hash = ''; try { hash = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const question = questions.findIndex(item => item.id === hash);
    if (question >= 0) selectQuestion(question, false);
    else if (topics.some(topic => topic.id === hash)) selectQuestion(questions.findIndex(item => item.topic === hash), false);
    else if (hash === 'past-papers' || hash === 'jae-topics') { mode = 'study'; renderMode(); }
    else if (hash === 'teacher') { mode = 'study'; renderMode(); const preparation=root.closest('.senior-math')?.querySelector<HTMLDetailsElement>('#teacher'); if(preparation)preparation.open=true; updateUrl('teacher'); }
    syncLanguage();
  };
  window.addEventListener('hashchange', useHash);
  const queryMode = new URL(location.href).searchParams.get('mode');
  if (queryMode === 'classroom' || queryMode === 'study') mode = queryMode;
  renderMode(); useHash(); syncLanguage();

  const download = (filename: string, body: string, type: string) => { const url = URL.createObjectURL(new Blob([body], { type })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.hidden = true; document.body.append(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 10000); };
  qa<HTMLButtonElement>('[data-export]').forEach(button => button.addEventListener('click', () => {
    const snapshot=progressForExport(storage,progress,changedIds);
    if (button.dataset.export === 'json') download('jae-math-learning-record.json', JSON.stringify(snapshot, null, 2), 'application/json;charset=utf-8');
    else download('jae-math-learning-record.txt',readableProgress(snapshot,questions,zh?'zh-Hant':'en'),'text/plain;charset=utf-8');
  }));
  let printState: { details: [HTMLDetailsElement, boolean][]; hidden: [HTMLElement, boolean][] } | null = null;
  const restorePrint = () => { if (!printState) return; printState.details.forEach(([element, open]) => { element.open = open; }); printState.hidden.forEach(([element, hidden]) => { element.hidden = hidden; }); printState = null; root.dataset.print = 'student'; requestAnimationFrame(() => redraw(activeQuestion().id)); };
  const preparePrint = (edition: string) => {
    closeZoom();
    if (printState) return;
    const teacherDetails=Array.from(root.closest('.senior-math')?.querySelectorAll<HTMLDetailsElement>('.senior-teacher')||[]);
    printState = { details: [...qa<HTMLDetailsElement>('.jae-question details'),...teacherDetails].map(element => [element, element.open]), hidden: qa<HTMLElement>('[data-topic], [data-question]').map(element => [element, element.hidden]) };
    printState.hidden.forEach(([element]) => { element.hidden = false; });
    printState.details.forEach(([element]) => { element.open = edition === 'teacher'; });
    root.dataset.print = edition;
  };
  qa<HTMLButtonElement>('[data-print]').forEach(button => button.addEventListener('click', () => { preparePrint(button.dataset.print!); window.print(); }));
  window.addEventListener('beforeprint', () => preparePrint(root.dataset.print || 'student'));
  window.addEventListener('afterprint', restorePrint);
}
