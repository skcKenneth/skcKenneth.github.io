/** Deterministic mathematics and local progress for the JAE pilot. */
export const STORAGE_KEY = 'jae-math-v1';
export const quadraticValue = (x, a, b, c) => a * x * x + b * x + c;
export function quadraticSummary(a, b, c) {
  if (![a, b, c].every(Number.isFinite)) throw new TypeError('Finite coefficients are required.');
  if (a === 0) return { type: b === 0 ? 'constant' : 'linear', discriminant: null, vertex: null, axis: null, roots: b === 0 ? [] : [-c / b], allReal: b === 0 && c === 0 };
  const discriminant = b * b - 4 * a * c, x = -b / (2 * a);
  let roots = [];
  if (discriminant === 0) roots = [x];
  else if (discriminant > 0) {
    // Stable formula avoids cancellation in the smaller root.
    const q = -.5 * (b + (b >= 0 ? 1 : -1) * Math.sqrt(discriminant));
    roots = [q / a, c / q].sort((left, right) => left - right);
  }
  return { type: 'quadratic', discriminant, vertex: { x, y: quadraticValue(x, a, b, c) }, axis: x, roots, allReal: false };
}
export function trigValue(xDegrees, amplitude, frequency, phaseDegrees, kind = 'sin') {
  const angle = (frequency * xDegrees + phaseDegrees) * Math.PI / 180;
  return amplitude * (kind === 'cos' ? Math.cos(angle) : Math.sin(angle));
}
export function trigSummary(amplitude, frequency, phaseDegrees) {
  if (![amplitude, frequency, phaseDegrees].every(Number.isFinite)) throw new TypeError('Finite parameters are required.');
  const periodic = amplitude !== 0 && frequency !== 0;
  return { amplitude: Math.abs(amplitude), periodDegrees: periodic ? 360 / Math.abs(frequency) : null, periodRadians: periodic ? 2 * Math.PI / Math.abs(frequency) : null, phaseDegrees };
}
/** Parse only finite decimals and simple fractions; never evaluate expressions. */
export function parseNumeric(input) {
  const value = String(input ?? '').trim().replace(/\u2212/g, '-'), decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  if (decimal.test(value)) { const number = Number(value); return Number.isFinite(number) ? number : null; }
  const parts = value.split('/').map(part => part.trim());
  if (parts.length !== 2 || !parts.every(part => decimal.test(part))) return null;
  const numerator = Number(parts[0]), denominator = Number(parts[1]), result = numerator / denominator;
  return denominator !== 0 && Number.isFinite(numerator) && Number.isFinite(denominator) && Number.isFinite(result) ? result : null;
}
export function checkAnswer(question, input) {
  const text = String(input ?? '').trim();
  if (!text) return { status: 'empty' };
  if (question.kind === 'written') return { status: 'reviewed' };
  if (question.kind === 'choice') {
    const value = text.toUpperCase();
    if (!question.choices?.some(choice => choice.id === value)) return { status: 'invalid' };
    return { status: value === question.answer ? 'correct' : 'incorrect', value };
  }
  if (question.kind !== 'number') return { status: 'invalid' };
  const value = parseNumeric(text);
  if (value === null) return { status: 'invalid' };
  return { status: Math.abs(value - question.answer) <= (question.tolerance ?? 1e-8) ? 'correct' : 'incorrect', value };
}
export function initialProgress() {
  return { version: 1, answers: {}, last: { mode: 'study', topic: 'quadratics', question: '' }, updatedAt: null };
}
export function normalizeProgress(value) {
  const progress = initialProgress();
  if (!value || typeof value !== 'object' || value.version !== 1) return progress;
  if (value.answers && typeof value.answers === 'object' && !Array.isArray(value.answers)) {
    for (const [id, record] of Object.entries(value.answers)) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(id) || id.length > 160 || !record || typeof record !== 'object') continue;
      progress.answers[id] = {
        input: typeof record.input === 'string' ? record.input.slice(0, 6000) : '',
        notes: typeof record.notes === 'string' ? record.notes.slice(0, 10000) : '',
        correction: typeof record.correction === 'string' ? record.correction.slice(0, 10000) : '',
        completed: record.completed === true,
        attempts: Number.isSafeInteger(record.attempts) && record.attempts >= 0 ? record.attempts : 0,
        lastResult: ['correct', 'incorrect', 'empty', 'invalid', 'reviewed'].includes(record.lastResult) ? record.lastResult : null,
        ...(typeof record.checkedInput === 'string' ? { checkedInput: record.checkedInput.slice(0, 6000) } : {}),
      };
    }
  }
  if (value.last && typeof value.last === 'object') {
    progress.last.mode = value.last.mode === 'classroom' ? 'classroom' : 'study';
    progress.last.topic = typeof value.last.topic === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.last.topic) ? value.last.topic.slice(0, 160) : 'quadratics';
    progress.last.question = typeof value.last.question === 'string' ? value.last.question.slice(0, 100) : '';
  }
  progress.updatedAt = typeof value.updatedAt === 'string' ? value.updatedAt : null;
  return progress;
}
export function loadProgress(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { progress: initialProgress(), available: true, issue: null };
    try {
      const value = JSON.parse(raw);
      if (value?.version !== 1) return { progress: initialProgress(), available: true, issue: 'corrupt' };
      return { progress: normalizeProgress(value), available: true, issue: null };
    } catch { return { progress: initialProgress(), available: true, issue: 'corrupt' }; }
  } catch { return { progress: initialProgress(), available: false, issue: 'unavailable' }; }
}
export function saveProgress(storage, progress, changedIds) {
  try {
    const safe = normalizeProgress(progress); safe.updatedAt = new Date().toISOString();
    if (changedIds) {
      const latest = loadProgress(storage);
      if (!latest.available || latest.issue === 'corrupt') return false;
      const merged = { ...latest.progress.answers };
      for (const id of changedIds) if (safe.answers[id]) merged[id] = safe.answers[id];
      safe.answers = merged;
    }
    storage.setItem(STORAGE_KEY, JSON.stringify(safe)); progress.updatedAt = safe.updatedAt;
    if (changedIds) progress.answers = safe.answers;
    return true;
  } catch { return false; }
}
