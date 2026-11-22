import { q5Cues } from '../data/selah-classroom.mjs';
import { evaluateSelah, selahLesson } from '../data/selah-lesson.mjs';

type Locale = 'en' | 'zh-Hant';
type LocalText = Record<Locale, string>;
type Diagram = { lines?: number[][]; points?: { x: number; y: number; label: string }[] };
type Cue = { id: string; title: LocalText; caption: LocalText; audioId?: string; formula?: string; diagram?: Diagram; stepId?: string; focus?: string };
type Lesson = { id: string; title: LocalText; cues: Cue[]; source?: { url: string; label: string }; problemText?: string };
type Exchange = { question: string; answer: string };
const q5: Lesson = { id: selahLesson.id, title: selahLesson.title, cues: q5Cues.map(cue => ({ ...cue, audioId: cue.id })) };
const svgNS = 'http://www.w3.org/2000/svg';

function startStudio(root: HTMLElement) {
  const el = <T extends Element = HTMLElement>(name: string) => root.querySelector<T>(`[data-${name}]`)!;
  const lang: Locale = root.dataset.locale === 'zh-Hant' ? 'zh-Hant' : 'en';
  const t = (en: string, zh: string) => lang === 'en' ? en : zh;
  const audio = el<HTMLAudioElement>('audio');
  const panel = el('panel');
  const chapters = el<HTMLSelectElement>('chapters');
  const slider = el<HTMLInputElement>('x');
  const question = el<HTMLTextAreaElement>('question');
  const objects = Array.from(root.querySelectorAll<HTMLElement | SVGElement>('[data-object]'));
  const layers = Array.from(root.querySelectorAll<HTMLElement | SVGElement>('[data-layer]'));
  const names: Record<string, string> = {
    domain: t('Original inequality', '原題不等式'), axes: t('Coordinate axes', '坐標軸'), arc: t('Quarter circle', '四分一圓'),
    point: t('Moving point', '移動點'), line: t('Gold line', '金色斜線'), diagonal: t('Equality diagonal', '兩項相等嘅對角線'),
    identity: t('Square of the sum', '和嘅平方'), result: t('Greatest k', '最大嘅 k'),
  };
  let lesson = q5;
  let index = 0;
  let playing = false;
  let started = false;
  let finished = false;
  let selected = '';
  let mode: 'audio' | 'speech' | 'captions' = 'audio';
  let elapsed = 0;
  let runFrom = 0;
  let frame = 0;
  let lastAudioChange = 0;
  let lastAudioTime = 0;
  let speech: SpeechSynthesisUtterance | undefined;
  // Some devices load installed voices asynchronously after this first request.
  window.speechSynthesis?.getVoices();
  let controller: AbortController | undefined;
  let generation = 0;
  let history: Exchange[] = [];
  const metrics = new Map<string, { requests: number; failures: number; milliseconds: number }>();
  const cue = () => lesson.cues[index];
  const isQ5 = () => lesson.id === q5.id;
  const seconds = () => mode === 'audio' ? audio.currentTime : elapsed + (playing ? (performance.now() - runFrom) / 1000 : 0);
  const readingTime = () => Math.max(4, lang === 'en' ? cue().caption.en.split(/\s+/).length / 2.5 : cue().caption[lang].length / 4.2);
  const setNotice = (message: string) => { el('notice').textContent = message; };

  function paint(progress: number) {
    const ink = Math.min(1, .05 + progress * 2.5);
    if (!isQ5()) {
      const diagramLines = Array.from(el('extra-diagram').querySelectorAll('line'));
      diagramLines.forEach((line,i) => { line.style.strokeDashoffset = String(1 - Math.max(0, Math.min(1, ink * diagramLines.length - i))); });
      return;
    }
    const interval = el<SVGPathElement>('interval');
    interval.style.strokeDasharray = '1';
    interval.style.strokeDashoffset = index === 0 ? String(1 - ink) : '0';
    const write = el('write');
    write.style.clipPath = index === 5 ? `inset(0 ${100*(1-ink)}% 0 0)` : '';
    for (const layer of layers) {
      if (Number(layer.dataset.layer) !== index) continue;
      for (const path of layer.querySelectorAll<SVGPathElement>('[data-ink]')) {
        path.style.strokeDasharray = '1';
        path.style.strokeDashoffset = String(1 - ink);
      }
    }
  }

  function drawPoint() {
    const { x, u, v, sum } = evaluateSelah(slider.valueAsNumber);
    el('x-out').textContent = x.toFixed(2);
    root.querySelector('[data-object="point"]')!.setAttribute('transform', `translate(${40 + 68*u} ${192 - 68*v})`);
    for (const path of root.querySelectorAll('[data-contour]')) path.setAttribute('d', `M40 ${192 - 68*sum} L${40 + 68*sum} 192`);
    if (!panel.hidden) describeSelection();
  }

  function drawDiagram(diagram?: Diagram) {
    const svg = el<SVGSVGElement>('extra-diagram');
    svg.replaceChildren();
    svg.toggleAttribute('hidden', !diagram);
    if (!diagram) return;
    for (const line of diagram.lines ?? []) {
      const node = document.createElementNS(svgNS, 'line');
      ['x1','y1','x2','y2'].forEach((attr,i) => node.setAttribute(attr, String(line[i])));
      node.setAttribute('stroke', '#9ee2bd');
      node.setAttribute('stroke-width', '3');
      node.setAttribute('pathLength','1');
      node.style.strokeDasharray = '1';
      svg.append(node);
    }
    for (const point of diagram.points ?? []) {
      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('cx', String(point.x)); dot.setAttribute('cy', String(point.y));
      dot.setAttribute('r', '4'); dot.setAttribute('fill','#f2c777');
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', String(point.x + (point.x > 280 ? -13 : 6)));
      label.setAttribute('y', String(point.y + (point.y < 19 ? 17 : -6)));
      label.textContent = point.label;
      svg.append(dot, label);
    }
  }

  function describeSelection() {
    const label = isQ5() ? names[selected] : cue().title[lang];
    el('selection').textContent = [label, isQ5() && index >= 2 ? `x = ${slider.valueAsNumber.toFixed(2)}` : '', cue().title[lang] !== label ? cue().title[lang] : ''].filter(Boolean).join(' · ');
  }
  function highlight(objectId: string) {
    for (const node of objects) node.classList.toggle('is-selected', node.dataset.object === objectId);
    el('equation').classList.toggle('is-selected', !isQ5() && objectId === cue().id);
  }
  function controls() {
    el('play').textContent = playing ? t('Pause', '暫停') : finished ? t('Start again', '重新上堂') : started ? t('Continue', '繼續講解') : t('Start lesson', '開始上堂');
    el('play').setAttribute('aria-pressed', String(playing));
    el('mute').setAttribute('aria-pressed', String(audio.muted));
    el('mute').textContent = audio.muted ? t('Unmute', '開聲') : t('Mute', '靜音');
    root.dataset.cue = cue().id;
    root.dataset.playing = String(playing);
    root.dataset.lesson = lesson.id;
  }
  function scene() {
    chapters.value = cue().id;
    el('count').textContent = `${index + 1} / ${lesson.cues.length}`;
    el('board-title').textContent = cue().title[lang];
    el('caption').textContent = cue().caption[lang];
    el('q5').hidden = !isQ5();
    el('extra').hidden = isQ5();
    el('practice').hidden = !(isQ5() && finished);
    if (isQ5()) {
      el('numberline').toggleAttribute('hidden', index !== 0);
      for (const layer of layers) {
        const step = Number(layer.dataset.layer);
        layer.toggleAttribute('hidden', step > index);
        for (const path of layer.querySelectorAll<SVGPathElement>('[data-ink]')) path.style.strokeDashoffset = '0';
      }
      drawPoint();
    } else {
      el('problem').textContent = lesson.problemText ?? '';
      el('equation').textContent = cue().formula || cue().title[lang];
      drawDiagram(cue().diagram);
    }
    highlight('');
    controls();
  }

  function cancelSpeech() {
    if (speech) {
      speech.onend = null; speech.onerror = null;
      window.speechSynthesis.cancel();
      speech = undefined;
    }
  }
  function pause() {
    if (playing && mode !== 'audio') elapsed = seconds();
    playing = false;
    audio.pause();
    if (speech) window.speechSynthesis.pause();
    cancelAnimationFrame(frame);
    controls();
  }
  function abandonRequest() {
    controller?.abort();
    controller = undefined;
    el<HTMLButtonElement>('submit').disabled = false;
  }
  function closePanel() {
    abandonRequest();
    panel.hidden = true;
    el('hand').setAttribute('aria-expanded','false');
    el('answer-status').textContent = '';
    el('annotation').hidden = true;
    el('view-mark').hidden = true;
    selected = '';
    highlight('');
  }
  function loadCue(position: number) {
    pause();
    generation++;
    cancelSpeech();
    closePanel();
    index = position;
    finished = false;
    elapsed = 0;
    if (isQ5() && cue().id === 'balance') slider.value = '4.5';
    const asset = cue().audioId;
    mode = asset ? 'audio' : 'speech';
    if (asset) audio.setAttribute('src', `/audio/selah/${lang === 'en' ? 'en' : 'yue'}/${encodeURIComponent(asset)}.mp3`);
    else audio.removeAttribute('src');
    audio.load();
    setNotice('');
    scene();
    paint(0);
  }
  function completeCue() {
    if (!playing) return;
    pause();
    paint(1);
    if (index + 1 === lesson.cues.length) {
      finished = true;
      el('practice').hidden = !isQ5();
      setNotice(t('Lesson complete.', '呢堂講完喇。'));
      controls();
      window.dispatchEvent(new CustomEvent('selah:finished', { detail: { id: lesson.id } }));
      return;
    }
    if (isQ5() && cue().id === 'arc') {
      setNotice(t('Try moving x. When you are ready, continue to the gold line.', '試吓拖動 x。準備好就撳「繼續講解」，一齊睇金色斜線。'));
      root.dataset.waiting = 'true';
      return;
    }
    loadCue(index + 1);
    play();
  }
  function captionsOnly() {
    elapsed = seconds();
    audio.pause();
    cancelSpeech();
    mode = 'captions';
    runFrom = performance.now();
    setNotice(t('Using timed captions for this passage.', '呢段以同步字幕播放。'));
  }
  function tick() {
    if (!playing) return;
    const time = seconds();
    const duration = mode === 'audio' && Number.isFinite(audio.duration) ? audio.duration : readingTime();
    paint(time / duration);
    if (mode === 'audio') {
      if (time !== lastAudioTime) { lastAudioTime = time; lastAudioChange = performance.now(); }
      if (performance.now() - lastAudioChange > 8000) captionsOnly();
    } else if (mode === 'captions' && time >= duration || mode === 'speech' && time >= duration * 3 + 4) {
      completeCue();
      return;
    }
    frame = requestAnimationFrame(tick);
  }
  function play() {
    if (!panel.hidden) closePanel();
    if (finished) loadCue(0);
    else if (root.dataset.waiting === 'true') loadCue(index + 1);
    delete root.dataset.waiting;
    if (playing) return;
    started = true;
    playing = true;
    runFrom = lastAudioChange = performance.now();
    lastAudioTime = audio.currentTime;
    setNotice('');
    if (mode === 'audio') {
      const attempt = generation;
      audio.play().catch(() => { if (generation === attempt && playing && mode === 'audio' && audio.paused) captionsOnly(); });
    } else if (mode === 'speech') {
      if (speech) window.speechSynthesis.resume();
      else {
        const synth = window.speechSynthesis;
        const voice = !audio.muted && synth?.getVoices().find(v => lang === 'en' ? /^en/i.test(v.lang) : /^(yue|zh[-_](?:Hant[-_])?(?:HK|MO))/i.test(v.lang));
        if (voice) {
          speech = new SpeechSynthesisUtterance(cue().caption[lang]); speech.voice = voice; speech.lang = voice.lang;
          speech.onend = completeCue; speech.onerror = () => { if (playing) captionsOnly(); };
          synth.resume(); synth.speak(speech);
        } else captionsOnly();
      }
    }
    controls();
    frame = requestAnimationFrame(tick);
  }
  function jump(position: number, autoplay: boolean) {
    if (position < 0 || position >= lesson.cues.length) return;
    delete root.dataset.waiting;
    loadCue(position);
    if (autoplay) play();
    else paint(1);
  }
  function showThread() {
    const thread = el('thread');
    thread.replaceChildren();
    for (const turn of history) {
      const row = document.createElement('article');
      const q = document.createElement('strong');
      q.textContent = turn.question;
      const a = document.createElement('p');
      a.textContent = turn.answer;
      row.append(q, a); thread.append(row);
    }
  }
  function raiseHand(object: string) {
    pause();
    abandonRequest();
    selected = object;
    highlight(object);
    panel.hidden = false;
    el('annotation').hidden = true;
    el('view-mark').hidden = true;
    describeSelection();
    el('hand').setAttribute('aria-expanded','true');
    el('form').hidden = !root.dataset.endpoint;
    el('answer-status').textContent = root.dataset.endpoint ? '' : cue().caption[lang];
    panel.scrollIntoView({ block:'nearest' });
    (root.dataset.endpoint ? question : el('back')).focus({ preventScroll:true });
  }
  el('form').addEventListener('submit', async event => {
    event.preventDefault();
    const prompt = question.value.trim();
    const code = el<HTMLInputElement>('code').value.trim();
    if (!prompt || !code || !root.dataset.endpoint || controller) return;
    const active = new AbortController();
    controller = active;
    const timeout = window.setTimeout(() => active.abort(), 24500);
    const metric = metrics.get(lesson.id) ?? { requests:0, failures:0, milliseconds:0 };
    metrics.set(lesson.id,metric);
    const sent = performance.now();
    metric.requests++;
    el<HTMLButtonElement>('submit').disabled = true;
    el('answer-status').textContent = t('Looking at your board…', '導師睇緊你指住嘅位置…');
    try {
      const body = { lessonId: lesson.id, stepId:cue().stepId ?? cue().id, locale:lang, question:prompt,
        board: { objectId:selected, cueId:cue().id, ...(isQ5() ? {x:slider.valueAsNumber} : {}) }, history:history.slice(-2).map(turn => ({question:turn.question.slice(0,600),answer:turn.answer.slice(0,1000)})) };
      const response = await fetch(root.dataset.endpoint, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${code}` }, body:JSON.stringify(body), signal:active.signal, credentials:'omit', cache:'no-store' });
      if (controller !== active) return;
      if (!response.ok) {
        metric.failures++;
        el('answer-status').textContent = response.status === 403 ? t('Check your invite code and try again.', '請核對試用碼再試。') : response.status === 429 ? t('Today’s question allowance is used. You can resume the board.', '今日答疑額度已用完，可以接住聽講解。') : t('The tutor is unavailable. You can retry or resume this sentence.', '導師暫時未能回覆。可以再試，或者由呢句接住聽。');
        return;
      }
      const data = await response.json();
      if (controller !== active) return;
      if (typeof data.answer !== 'string' || !data.answer.trim() || data.referenceStepId !== body.stepId) throw new Error('Incomplete response');
      history = [...history.slice(-3), {question:prompt,answer:data.answer}];
      showThread();
      const validHighlight = !isQ5() ? data.highlight === cue().id : objects.some(node => node.dataset.object === data.highlight && !node.closest('[hidden]'));
      highlight(validHighlight ? data.highlight : selected);
      el('annotation').hidden = !isQ5() || data.annotation !== 'bound';
      el('view-mark').hidden = false;
      question.value = '';
      el('answer-status').textContent = '';
    } catch {
      if (controller === active) {
        metric.failures++;
        el('answer-status').textContent = t('No reply arrived. Try again or resume at the same place.', '暫時收唔到回覆。可以再試，或者由原位接住聽。');
      }
    } finally {
      clearTimeout(timeout);
      metric.milliseconds += Math.round(performance.now()-sent);
      root.dataset.requestMetrics = JSON.stringify(Object.fromEntries(metrics));
      if (controller === active) { controller = undefined; el<HTMLButtonElement>('submit').disabled = false; }
    }
  });
  audio.addEventListener('ended', () => { if (mode === 'audio' && audio.ended) completeCue(); });
  el('play').addEventListener('click', () => playing ? pause() : play());
  el('replay').addEventListener('click', () => jump(index,true));
  el('mute').addEventListener('click', () => {
    audio.muted = !audio.muted;
    if (audio.muted && speech) captionsOnly();
    controls();
  });
  el('back').addEventListener('click', () => { play(); el('play').focus(); });
  el('view-mark').addEventListener('click', () => {
    const target = el('annotation').hidden ? root.querySelector('.is-selected') : el('annotation');
    target?.scrollIntoView({ block:'center' });
  });
  el('hand').addEventListener('click', () => raiseHand(cue().focus ?? cue().id));
  el('equation').addEventListener('click', () => raiseHand(cue().id));
  const extraDiagram = el<SVGSVGElement>('extra-diagram');
  extraDiagram.addEventListener('click', () => raiseHand(cue().id));
  extraDiagram.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); raiseHand(cue().id); }
  });
  slider.addEventListener('input', () => {
    if (controller) { abandonRequest(); el('answer-status').textContent = ''; }
    drawPoint();
  });
  chapters.addEventListener('change', () => jump(lesson.cues.findIndex(c => c.id === chapters.value),playing));
  for (const node of objects) {
    node.addEventListener('click', () => raiseHand(node.dataset.object!));
    if (node instanceof SVGElement) node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); raiseHand(node.dataset.object!); }
    });
  }
  function switchLesson(next: Lesson) {
    if (!next || typeof next.id !== 'string') return;
    const target = next.id === q5.id ? q5 : next;
    if (!Array.isArray(target.cues) || !target.cues.length || !target.title?.[lang] || !target.cues.every(c => c.caption?.[lang] && c.title?.[lang] && c.id)) return;
    pause();
    lesson = target;
    index = 0;
    started = false;
    history = [];
    showThread();
    question.value = '';
    slider.value = '3.5';
    el('title').textContent = lesson.title[lang];
    const meta = el('meta'); meta.replaceChildren();
    if (isQ5()) meta.textContent = t('2023/24 · Macau · Senior Q5', '2023/24 · 澳門學界數學比賽 · 高中組 Q5');
    else if (lesson.source) {
      const a = document.createElement('a');
      const url = new URL(lesson.source.url,location.href);
      if (url.protocol === 'https:' || url.origin === location.origin) { a.href=url.href; a.textContent=lesson.source.label; meta.append(a); }
    }
    chapters.replaceChildren(...lesson.cues.map(c => new Option(c.title[lang],c.id)));
    jump(0,false);
    window.dispatchEvent(new CustomEvent('selah:active-lesson', { detail:{id:lesson.id} }));
  }
  window.addEventListener('selah:lesson', event => { switchLesson((event as CustomEvent<Lesson>).detail); root.scrollIntoView({block:'start'}); });
  window.addEventListener('selah:review-cue', event => {
    const id = (event as CustomEvent<{id:string}>).detail?.id;
    if (!isQ5()) switchLesson(q5);
    jump(q5.cues.findIndex(c => c.id === id),false);
    root.scrollIntoView({block:'start'}); el('play').focus({preventScroll:true});
  });
  window.addEventListener('pagehide', () => { pause(); cancelSpeech(); abandonRequest(); });
  root.hidden = false;
  loadCue(0);
}

document.querySelectorAll<HTMLElement>('[data-studio]').forEach(startStudio);
