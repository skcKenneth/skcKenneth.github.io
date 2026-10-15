import { C, t, fmt, clamp, text, line, circle, rect, plot, dragValue } from './function-hands-on-common.mjs';
import { functionValue } from './function-worksheet-models.mjs';

/** Pure, deterministic direct manipulation for the four properties lessons.
 * Curves are sampled only for drawing. Checks use fixed-rule algebra and the
 * complete piecewise-linear model, never a sampled largest/smallest value.
 */
export const ids = ['07', '08', '09', '10'];
const rules = {
  '07': ['linear', 'square', 'sqrt'],
  '08': ['water', 'line', 'quadratic'],
  '09': ['reciprocal-positive', 'reciprocal-negative', 'reciprocal-whole', 'quadratic'],
  '10': ['square', 'cube', 'shift', 'reciprocal', 'zero'],
};
const numeric = (v, fallback, lo, hi) => clamp(typeof v === 'number' && Number.isFinite(v) ? v : fallback, lo, hi);
const choose = (v, options, fallback) => options.includes(v) ? v : fallback;
const eq = (a, b) => Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(a), Math.abs(b));
const status = (valid, locale) => valid ? t(locale, 'Allowed', '允許') : t(locale, 'Outside the domain', '不屬於定義域');
const valueLabel = (value, locale) => value === null ? t(locale, 'Undefined', '未定義') : fmt(value);
const centerText = (x, y, v, attrs = '') => text(x, y, v, `text-anchor="middle" ${attrs}`);
function lessonId(id) {
  if (!ids.includes(id)) throw new RangeError('Unknown direct-manipulation properties lesson.');
  return id;
}
function initial08(rule = 'water') {
  const hi = rule === 'water' ? 6 : rule === 'quadratic' ? 5 : 2;
  return { rule, lo: 0, hi, leftClosed: rule !== 'line', rightClosed: rule !== 'line', x: rule === 'line' ? 1 : 2, maxAt: rule === 'water' ? 3 : rule === 'quadratic' ? 4 : 1.5, minAt: rule === 'water' ? 4 : rule === 'quadratic' ? 3 : .5, witness: null };
}
function initial10(rule = 'square', domain = 'symmetric') {
  return { rule, domain, trimmed: false, lo: domain === 'restricted' ? 0 : -3, hi: 3, x: 2, transform: 'mirror' };
}
export function create(id) {
  lessonId(id);
  if (id === '07') return { rule: 'linear', order: ['a', 'b'], x: 2, sent: false };
  if (id === '08') return initial08();
  if (id === '09') return { rule: 'reciprocal-positive', x1: 1, x2: 2 };
  return initial10();
}
function stateOf(id, raw = {}) {
  const source = raw && typeof raw === 'object' ? raw : {}, base = create(id);
  const rule = choose(source.rule, rules[id], base.rule);
  if (id === '07') return { rule, order: source.order?.[0] === 'b' && source.order?.[1] === 'a' ? ['b', 'a'] : ['a', 'b'], x: numeric(source.x, 2, -3, 5), sent: source.sent === true };
  if (id === '08') {
    const d = initial08(rule), lo = numeric(source.lo, 0, 0, d.hi - .25), hi = numeric(source.hi, d.hi, lo + .25, d.hi);
    const witness = source.witness && ['larger', 'smaller'].includes(source.witness.kind) && typeof source.witness.x === 'number' && Number.isFinite(source.witness.x) ? { kind: source.witness.kind, x: clamp(source.witness.x, lo, hi) } : null;
    return { rule, lo, hi, leftClosed: typeof source.leftClosed === 'boolean' ? source.leftClosed : d.leftClosed, rightClosed: typeof source.rightClosed === 'boolean' ? source.rightClosed : d.rightClosed, x: numeric(source.x, d.x, lo, hi), maxAt: numeric(source.maxAt, d.maxAt, lo, hi), minAt: numeric(source.minAt, d.minAt, lo, hi), witness };
  }
  if (id === '09') {
    const x1 = numeric(source.x1, 1, -4, 3.75), x2 = numeric(source.x2, 2, x1 + .25, 4);
    return { rule, x1, x2 };
  }
  const domain = choose(source.domain, ['symmetric', 'restricted'], 'symmetric');
  const lo = numeric(source.lo, domain === 'restricted' ? 0 : -3, domain === 'restricted' ? 0 : -3, 2.75), hi = numeric(source.hi, 3, lo + .25, 3);
  return { rule, domain, trimmed: source.trimmed === true, lo, hi, x: numeric(source.x, 2, -3, 3), transform: choose(source.transform, ['mirror', 'rotate'], 'mirror') };
}
function moveNumber(action, lo, hi, step = .25, pixelLo = 80, pixelHi = 880) {
  return dragValue(action, lo, hi, pixelLo, pixelHi, 'x', step);
}
export function reduce(id, raw, action = {}) {
  const s = stateOf(lessonId(id), raw), a = action && typeof action === 'object' ? action : {};
  if (a.type === 'drag' && !['move', 'end'].includes(a.phase)) return s;
  if (a.type === 'preset' && a.id === 'rule' && rules[id].includes(a.value)) {
    if (id === '07') return { ...create(id), rule: a.value };
    if (id === '08') return initial08(a.value);
    if (id === '09') return { rule: a.value, x1: a.value === 'reciprocal-negative' ? -2 : 1, x2: a.value === 'reciprocal-negative' ? -1 : 2 };
    return initial10(a.value, s.domain);
  }
  if (id === '10' && a.type === 'preset' && a.id === 'domain' && ['symmetric', 'restricted'].includes(a.value)) return initial10(s.rule, a.value);
  if (a.type === 'drag' && (typeof a.x !== 'number' || !Number.isFinite(a.x) || typeof a.y !== 'number' || !Number.isFinite(a.y))) return s;
  if (id === '07') {
    if (a.type === 'drag' && a.id === 'input') {
      const x = moveNumber(a, -3, 5, .5); return x === null ? s : { ...s, x };
    }
    if (a.type === 'action' && a.id === 'swap') return { ...s, order: [...s.order].reverse() };
    if (a.type === 'action' && a.id === 'send' || a.type === 'drag' && a.id === 'input-token' && a.phase === 'end' && a.zone === 'feed') return { ...s, sent: true };
    if (a.type === 'drag' && ['machine-a', 'machine-b'].includes(a.id) && a.phase === 'end' && ['slot-0', 'slot-1'].includes(a.zone)) {
      const machine = a.id.slice(-1), slot = Number(a.zone.slice(-1));
      return { ...s, order: slot === 0 ? [machine, machine === 'a' ? 'b' : 'a'] : [machine === 'a' ? 'b' : 'a', machine] };
    }
  }
  if (id === '08') {
    if (a.type === 'action' && ['toggle-left', 'toggle-right'].includes(a.id)) return { ...s, [a.id === 'toggle-left' ? 'leftClosed' : 'rightClosed']: !s[a.id === 'toggle-left' ? 'leftClosed' : 'rightClosed'], witness: null };
    if (a.type === 'action' && ['construct-larger', 'construct-smaller'].includes(a.id) && s.rule === 'line') {
      const larger = a.id === 'construct-larger', candidate = larger ? s.maxAt : s.minAt;
      if (!in08(s, candidate)) return s;
      const x = larger ? (candidate + s.hi) / 2 : (s.lo + candidate) / 2;
      if (in08(s, x) && (larger ? x > candidate : x < candidate)) return { ...s, x, witness: { kind: larger ? 'larger' : 'smaller', x } };
      return s;
    }
    if (a.type === 'drag') {
      const max = initial08(s.rule).hi, x = moveNumber(a, 0, max);
      if (x === null) return s;
      if (a.id === 'domain-left') return { ...s, lo: clamp(x, 0, s.hi - .25), x: clamp(s.x, clamp(x, 0, s.hi - .25), s.hi), witness: null };
      if (a.id === 'domain-right') return { ...s, hi: clamp(x, s.lo + .25, max), x: clamp(s.x, s.lo, clamp(x, s.lo + .25, max)), witness: null };
      if (['cursor', 'max-marker', 'min-marker'].includes(a.id)) return { ...s, [a.id === 'cursor' ? 'x' : a.id === 'max-marker' ? 'maxAt' : 'minAt']: clamp(x, s.lo, s.hi), witness: null };
    }
  }
  if (id === '09' && a.type === 'drag' && ['x1', 'x2'].includes(a.id)) {
    const x = moveNumber(a, -4, 4);
    if (x !== null) return a.id === 'x1' ? { ...s, x1: Math.min(x, s.x2 - .25) } : { ...s, x2: Math.max(x, s.x1 + .25) };
  }
  if (id === '10') {
    if (a.type === 'action' && ['mirror', 'rotate'].includes(a.id)) return { ...s, transform: a.id };
    if (a.type === 'action' && a.id === 'restore-domain') return { ...initial10(s.rule, s.domain), x: s.x, transform: s.transform };
    if (a.type === 'drag' && a.id === 'candidate' && a.phase === 'end' && ['mirror', 'rotate'].includes(a.zone)) return { ...s, transform: a.zone };
    if (a.type === 'drag') {
      const x = moveNumber(a, -3, 3);
      if (x === null) return s;
      if (a.id === 'cursor') return { ...s, x };
      if (a.id === 'domain-left') return { ...s, trimmed: true, lo: clamp(x, s.domain === 'restricted' ? 0 : -3, s.hi - .25) };
      if (a.id === 'domain-right') return { ...s, trimmed: true, hi: Math.max(x, s.lo + .25) };
    }
  }
  return s;
}
function choice(id, label, value, options, locale) {
  return { id, label: t(locale, ...label), value, options: options.map(([value, en, zh]) => ({ value, label: t(locale, en, zh) })) };
}
function scene(title, task, svg, summary, headers, rows, extra = {}) {
  return { title, task, svg, summary, headers, rows: rows.map(row => row.map(String)), handles: [], zones: [], buttons: [], choices: [], claims: [], custom: false, ...extra };
}
function machineDefinitions(rule) {
  if (rule === 'linear') return { a: { label: 'f(u) = 2u', apply: x => 2 * x }, b: { label: 'g(u) = u + 3', apply: x => x + 3 } };
  if (rule === 'square') return { a: { label: 'f(u) = u²', apply: x => x * x }, b: { label: 'g(u) = u + 3', apply: x => x + 3 } };
  return { a: { label: 'g(u) = u − 1', apply: x => x - 1 }, b: { label: 'f(u) = √u', apply: x => x >= 0 ? Math.sqrt(x) : null } };
}
function pipeline(s, order = s.order) {
  const machines = machineDefinitions(s.rule, 'en'), mid = machines[order[0]].apply(s.x);
  const end = mid === null ? null : machines[order[1]].apply(mid);
  return { mid, end, stopped: mid === null ? 1 : end === null ? 2 : 0 };
}
function render07(s, locale) {
  const m = machineDefinitions(s.rule, locale), result = pipeline(s), reverse = pipeline(s, [...s.order].reverse());
  const pending = t(locale, 'Send the input token', '送入輸入數值卡'), stopped = t(locale, 'Not run: previous stage stopped', '未執行：上一階段已停止');
  const mid = !s.sent ? pending : valueLabel(result.mid, locale), end = !s.sent ? pending : result.stopped === 1 ? stopped : valueLabel(result.end, locale);
  let svg = text(60, 48, t(locale, 'Original input → first machine → second machine', '原來輸入 → 第一部機器 → 第二部機器'), 'font-weight="700"');
  svg += rect(230, 135, 180, 100) + rect(550, 135, 180, 100) + centerText(320, 120, t(locale, 'First machine', '第一部機器')) + centerText(640, 120, t(locale, 'Second machine', '第二部機器'));
  svg += rect(40, 290, 160, 70) + centerText(120, 335, t(locale, 'Input tray', '輸入槽'));
  svg += line(200, 325, 235, 325, C.muted, 3) + rect(240, 290, 250, 70) + centerText(365, 280, t(locale, 'Intermediate value', '中間值')) + centerText(365, 333, mid, 'font-size="18"');
  svg += line(495, 325, 535, 325, C.muted, 3) + rect(540, 290, 345, 70) + centerText(710, 280, t(locale, 'Final output', '最後輸出')) + centerText(710, 333, end, 'font-size="18"');
  svg += line(80, 460, 880, 460, C.muted, 5) + text(80, 420, t(locale, `Set numeric token: x = ${fmt(s.x)}`, `設定數值卡：x = ${fmt(s.x)}`)) + text(80, 500, '−3') + text(880, 500, '5', 'text-anchor="end"');
  const rows = [
    [s.order.map(k => m[k].label).join(' → '), fmt(s.x), mid, end],
    [[...s.order].reverse().map(k => m[k].label).join(' → '), fmt(s.x), s.sent ? valueLabel(reverse.mid, locale) : pending, s.sent ? reverse.stopped === 1 ? stopped : valueLabel(reverse.end, locale) : pending],
  ];
  return scene(t(locale, 'Order the function machines', '排列函數機器次序'), t(locale, 'Drag the machine cards into the two slots. Set x, then drop its token into the input tray. Compare the reversed order.', '把機器卡拖入兩個位置。設定 x，再把數值卡放入輸入槽，並比較相反次序。'), svg,
    t(locale, `Input ${fmt(s.x)}; order: ${s.order.map(k => m[k].label).join(' → ')}.`, `輸入 ${fmt(s.x)}；次序：${s.order.map(k => m[k].label).join(' → ')}。`),
    [t(locale, 'Machine order', '機器次序'), 'x', t(locale, 'Intermediate', '中間值'), t(locale, 'Final output', '最後輸出')], rows, {
      handles: [
        ...s.order.map((k, i) => ({ id: `machine-${k}`, kind: 'card', x: 320 + 320 * i, y: 185, w: 170, h: 60, label: m[k].label })),
        { id: 'input-token', kind: 'token', x: 120, y: 185, w: 130, h: 60, label: t(locale, `Numeric input token x = ${fmt(s.x)}`, `輸入數值卡 x = ${fmt(s.x)}`), shortLabel: `x = ${fmt(s.x)}` },
        { id: 'input', kind: 'slider', x: 80 + (s.x + 3) * 100, y: 460, label: t(locale, 'Set starting input x', '設定原來輸入 x'), shortLabel: 'x', value: s.x, min: -3, max: 5, step: .5, nudge: { x: 50, y: 0 } },
      ],
      zones: [{ id: 'slot-0', x: 230, y: 135, w: 180, h: 100, label: t(locale, 'First machine slot', '第一部機器位置') }, { id: 'slot-1', x: 550, y: 135, w: 180, h: 100, label: t(locale, 'Second machine slot', '第二部機器位置') }, { id: 'feed', x: 40, y: 290, w: 160, h: 70, label: t(locale, 'Send numeric input', '送入數值') }],
      buttons: [{ id: 'send', label: t(locale, 'Send token', '送入數值卡') }, { id: 'swap', label: t(locale, 'Swap machines', '交換機器') }],
      choices: [choice('rule', ['Machines', '函數機器'], s.rule, [['linear', 'Double and add 3', '乘 2 與加 3'], ['square', 'Square and add 3', '平方與加 3'], ['sqrt', 'Subtract 1 and square root', '減 1 與開平方']], locale)],
      claims: [{ value: 'different', label: t(locale, 'These orders define different functions', '兩個次序定義不同函數') }, { value: 'same', label: t(locale, 'These orders define the same function', '兩個次序定義相同函數') }], custom: s.order[0] !== 'a',
    });
}
function waterValue(x) {
  const points = [[0, 1], [2, 5], [4, 2], [6, 4]];
  for (let i = 1; i < points.length; i++) if (x <= points[i][0]) {
    const [a, b] = points[i - 1], [c, d] = points[i]; return b + (d - b) * (x - a) / (c - a);
  }
  return 4;
}
const value08 = (s, x) => s.rule === 'water' ? waterValue(x) : s.rule === 'quadratic' ? (x - 2) ** 2 + 1 : x;
function in08(s, x) { return Number.isFinite(x) && x >= s.lo && x <= s.hi && (x !== s.lo || s.leftClosed) && (x !== s.hi || s.rightClosed); }
function interval(s) { return `${s.leftClosed ? '[' : '('}${fmt(s.lo)}, ${fmt(s.hi)}${s.rightClosed ? ']' : ')'}`; }
function extrema08(s) {
  const corners = s.rule === 'water' ? [2, 4] : s.rule === 'quadratic' ? [2] : [];
  const xs = [...new Set([s.lo, s.hi, ...corners.filter(x => x > s.lo && x < s.hi)])];
  const points = xs.map(x => ({ x, y: value08(s, x), attained: in08(s, x) }));
  const max = Math.max(...points.map(p => p.y)), min = Math.min(...points.map(p => p.y));
  return { max, min, hasMax: points.some(p => p.attained && eq(p.y, max)), hasMin: points.some(p => p.attained && eq(p.y, min)) };
}
function graphCurve(c, fn, lo, hi, valid = () => true, color = C.ink, samples = 200) {
  let path = '', active = false;
  for (let i = 0; i <= samples; i++) {
    const x = lo + (hi - lo) * i / samples, y = fn(x), X = c.X(x), Y = c.Y(y);
    if (!valid(x) || !Number.isFinite(y) || Y < 70 || Y > 390) { active = false; continue; }
    path += `${active ? 'L' : 'M'}${fmt(X)},${fmt(Y)} `; active = true;
  }
  return `<path d="${path}" fill="none" stroke="${color}" stroke-width="3"/>`;
}
function chart08(s) {
  const max = initial08(s.rule).hi, ymax = s.rule === 'quadratic' ? 11 : s.rule === 'water' ? 6 : 2.5;
  return { ...plot({ xmin: 0, xmax: max, ymin: 0, ymax, y: 70, h: 320 }), xmax: max, ymax };
}
function pointHandle(id, x, y, label, c, lo, hi, shortLabel, step = .25) {
  return { id, kind: 'point', x: c.X(x), y: clamp(c.Y(y), 70, 390), label, shortLabel, value: x, min: lo, max: hi, step, nudge: { x: 800 * step / (hi - lo), y: 0 } };
}
function render08(s, locale) {
  const c = chart08(s), fn = x => value08(s, x), label = s.rule === 'water' ? t(locale, 'Water level h(t), with straight connecting segments', '水位 h(t)，各點以直線連接') : s.rule === 'quadratic' ? 'y = (x − 2)² + 1' : 'y = x';
  let svg = text(80, 40, label, 'font-weight="700"') + c.svg;
  svg += graphCurve(c, fn, s.lo, s.hi) + circle(c.X(s.lo), c.Y(fn(s.lo)), 7, s.leftClosed ? C.ink : C.paper, C.ink) + circle(c.X(s.hi), c.Y(fn(s.hi)), 7, s.rightClosed ? C.ink : C.paper, C.ink);
  svg += line(c.X(s.lo), 452, c.X(s.hi), 452, C.ink, 5) + text(80, 495, t(locale, 'Trim the domain with L/R; place your max/min candidates on the graph.', '用 L／R 縮窄定義域；把最大／最小候選點放在圖像上。'), 'font-size="18"');
  for (const [x, mark] of [[s.maxAt, 'M'], [s.minAt, 'm']]) svg += centerText(c.X(x), clamp(c.Y(fn(x)) - 23, 63, 370), in08(s, x) ? `${mark}: (${fmt(x)}, ${fmt(fn(x))})` : t(locale, `${mark}: x = ${fmt(x)} excluded`, `${mark}：x = ${fmt(x)} 被排除`), 'font-size="16"');
  if (s.witness) svg += circle(c.X(s.witness.x), c.Y(fn(s.witness.x)), 11, C.paper, C.amber);
  const rows = [
    [t(locale, 'Cursor', '游標'), fmt(s.x), in08(s, s.x) ? fmt(fn(s.x)) : t(locale, 'Undefined', '未定義'), status(in08(s, s.x), locale)],
    [t(locale, 'My maximum candidate', '我的最大值候選'), fmt(s.maxAt), in08(s, s.maxAt) ? fmt(fn(s.maxAt)) : t(locale, 'Undefined', '未定義'), status(in08(s, s.maxAt), locale)],
    [t(locale, 'My minimum candidate', '我的最小值候選'), fmt(s.minAt), in08(s, s.minAt) ? fmt(fn(s.minAt)) : t(locale, 'Undefined', '未定義'), status(in08(s, s.minAt), locale)],
  ];
  if (s.witness) {
    const candidate = s.witness.kind === 'larger' ? s.maxAt : s.minAt;
    rows.push([t(locale, 'Constructed comparison point', '構造的比較點'), fmt(s.witness.x), fmt(fn(s.witness.x)), `Δy = ${fmt(fn(s.witness.x) - fn(candidate))}`]);
  }
  const original = initial08(s.rule);
  return scene(t(locale, 'Place extrema and test attainment', '標示最值，檢查能否取得'), t(locale, 'Move the cursor along the actual graph. Mark your maximum and minimum candidates, or construct a larger/smaller allowed output on y = x.', '沿實際圖像移動游標，標示你的最大及最小值候選；對 y = x，也可構造更大／更小的允許輸出。'), svg,
    t(locale, `Domain ${interval(s)}. Cursor input ${fmt(s.x)}: ${in08(s, s.x) ? `output ${fmt(fn(s.x))}` : 'excluded input'}.`, `定義域 ${interval(s)}。游標輸入 ${fmt(s.x)}：${in08(s, s.x) ? `輸出 ${fmt(fn(s.x))}` : '輸入被排除'}。`),
    [t(locale, 'Point', '點'), s.rule === 'water' ? 't' : 'x', s.rule === 'water' ? 'h(t)' : 'y', t(locale, 'Membership / difference', '所屬／差值')], rows, {
      handles: [
        { ...pointHandle('cursor', s.x, fn(s.x), t(locale, 'Graph cursor', '圖像游標'), c, 0, c.xmax, 'x'), y: in08(s, s.x) ? c.Y(fn(s.x)) : 420 },
        { ...pointHandle('max-marker', s.maxAt, fn(s.maxAt), t(locale, 'My maximum candidate', '我的最大值候選'), c, 0, c.xmax, 'M'), y: in08(s, s.maxAt) ? c.Y(fn(s.maxAt)) : 420 },
        { ...pointHandle('min-marker', s.minAt, fn(s.minAt), t(locale, 'My minimum candidate', '我的最小值候選'), c, 0, c.xmax, 'm'), y: in08(s, s.minAt) ? c.Y(fn(s.minAt)) : 420 },
        { id: 'domain-left', kind: 'slider', x: c.X(s.lo), y: 452, label: t(locale, 'Left domain boundary', '定義域左邊界'), shortLabel: 'L', value: s.lo, min: 0, max: c.xmax, step: .25, nudge: { x: 200 / c.xmax, y: 0 } },
        { id: 'domain-right', kind: 'slider', x: c.X(s.hi), y: 452, label: t(locale, 'Right domain boundary', '定義域右邊界'), shortLabel: 'R', value: s.hi, min: 0, max: c.xmax, step: .25, nudge: { x: 200 / c.xmax, y: 0 } },
      ],
      buttons: [{ id: 'toggle-left', label: t(locale, `Left endpoint: ${s.leftClosed ? 'included' : 'excluded'}`, `左端點：${s.leftClosed ? '包括' : '不包括'}`) }, { id: 'toggle-right', label: t(locale, `Right endpoint: ${s.rightClosed ? 'included' : 'excluded'}`, `右端點：${s.rightClosed ? '包括' : '不包括'}`) }, ...(s.rule === 'line' ? [{ id: 'construct-larger', label: t(locale, 'Construct output above my M', '構造高於 M 的輸出') }, { id: 'construct-smaller', label: t(locale, 'Construct output below my m', '構造低於 m 的輸出') }] : [])],
      choices: [choice('rule', ['Graph model', '圖像模型'], s.rule, [['water', 'Water level on [0, 6]', '水位，定義域 [0,6]'], ['line', 'y = x on (0, 2)', 'y = x，定義域 (0,2)'], ['quadratic', '(x − 2)² + 1 on [0, 5]', '(x−2)²+1，定義域 [0,5]']], locale)],
      claims: [{ value: 'markers', label: t(locale, 'My M and m mark both global extrema', '我的 M 及 m 標示兩個全域最值') }, { value: 'no-max', label: t(locale, 'No maximum; m marks the minimum', '沒有最大值；m 標示最小值') }, { value: 'no-min', label: t(locale, 'No minimum; M marks the maximum', '沒有最小值；M 標示最大值') }, { value: 'neither', label: t(locale, 'Neither maximum nor minimum exists', '最大值及最小值均不存在') }, { value: 'counterexample', label: t(locale, 'My constructed point refutes my marked candidate', '構造點推翻我的最值候選') }],
      custom: s.lo !== original.lo || s.hi !== original.hi || s.leftClosed !== original.leftClosed || s.rightClosed !== original.rightClosed,
    });
}
function value09(s, x) {
  const valid = s.rule === 'quadratic' || s.rule === 'reciprocal-positive' ? x > 0 : s.rule === 'reciprocal-negative' ? x < 0 : x !== 0;
  return { valid, value: valid ? s.rule === 'quadratic' ? 2 * x * x + 1 : 1 / x : null };
}
function render09(s, locale) {
  const quad = s.rule === 'quadratic', c = plot({ xmin: -4, xmax: 4, ymin: quad ? 0 : -5, ymax: quad ? 34 : 5, y: 70, h: 320 }), a = value09(s, s.x1), b = value09(s, s.x2);
  const domain = quad || s.rule === 'reciprocal-positive' ? '(0, ∞)' : s.rule === 'reciprocal-negative' ? '(−∞, 0)' : 'ℝ ∖ {0}';
  let svg = text(80, 40, `${quad ? 'f(x) = 2x² + 1' : 'f(x) = 1/x'}; D = ${domain}`, 'font-weight="700"') + c.svg;
  svg += graphCurve(c, x => quad ? 2 * x * x + 1 : 1 / x, -4, 4, x => value09(s, x).valid);
  if (a.valid && b.valid) svg += line(c.X(s.x1), c.Y(a.value), c.X(s.x2), c.Y(b.value), C.muted, 2, 'stroke-dasharray="6 5"');
  svg += text(80, 475, t(locale, `Ordered inputs: ${fmt(s.x1)} < ${fmt(s.x2)}`, `有序輸入：${fmt(s.x1)} < ${fmt(s.x2)}`)) + text(80, 510, t(locale, 'Seek a counterexample to your selected universal claim.', '尋找反例，檢驗你所選的全稱猜想。'), 'font-size="18"');
  return scene(t(locale, 'Test a monotonicity claim', '檢驗單調性猜想'), t(locale, 'Drag x₁ and x₂ while keeping x₁ < x₂. Choose a claim, then seek a pair whose outputs contradict it.', '拖動 x₁ 及 x₂，保持 x₁<x₂。選擇猜想，再尋找輸出次序與猜想相反的一對。'), svg,
    t(locale, `x₁ = ${fmt(s.x1)}, x₂ = ${fmt(s.x2)}. ${a.valid && b.valid ? `f(x₂) − f(x₁) = ${fmt(b.value - a.value)}.` : 'One or both inputs are outside the domain.'}`, `x₁ = ${fmt(s.x1)}，x₂ = ${fmt(s.x2)}。${a.valid && b.valid ? `f(x₂)−f(x₁) = ${fmt(b.value - a.value)}。` : '至少一個輸入不屬於定義域。'}`),
    ['x₁', 'x₂', 'f(x₁)', 'f(x₂)', 'f(x₂) − f(x₁)'], [[fmt(s.x1), fmt(s.x2), valueLabel(a.value, locale), valueLabel(b.value, locale), a.valid && b.valid ? fmt(b.value - a.value) : '—']], {
      handles: [{ ...pointHandle('x1', s.x1, a.value ?? 0, t(locale, 'First input x₁', '第一個輸入 x₁'), c, -4, 4, 'x₁'), y: a.valid ? clamp(c.Y(a.value), 70, 390) : 440 }, { ...pointHandle('x2', s.x2, b.value ?? 0, t(locale, 'Second input x₂', '第二個輸入 x₂'), c, -4, 4, 'x₂'), y: b.valid ? clamp(c.Y(b.value), 70, 390) : 440 }],
      choices: [choice('rule', ['Function and domain', '函數及定義域'], s.rule, [['reciprocal-positive', '1/x on (0, ∞)', '1/x，在 (0,∞)'], ['reciprocal-negative', '1/x on (−∞, 0)', '1/x，在 (−∞,0)'], ['reciprocal-whole', '1/x on ℝ except 0', '1/x，在除 0 外的實數'], ['quadratic', '2x² + 1 on (0, ∞)', '2x²+1，在 (0,∞)']], locale)],
      claims: [{ value: 'increasing', label: t(locale, 'Strictly increasing on the stated domain', '在所述定義域嚴格遞增') }, { value: 'decreasing', label: t(locale, 'Strictly decreasing on the stated domain', '在所述定義域嚴格遞減') }],
    });
}
function parityValue(s, x) {
  const result = functionValue(s.rule, x);
  const inside = s.trimmed ? x >= s.lo && x <= s.hi : s.domain === 'restricted' ? x >= 0 && x <= 3 : true;
  return { valid: result.valid && inside, value: result.valid && inside ? result.value : null };
}
function parityDomain(s) { return s.trimmed ? `[${fmt(s.lo)}, ${fmt(s.hi)}]${s.rule === 'reciprocal' ? ' ∖ {0}' : ''}` : s.domain === 'restricted' ? s.rule === 'reciprocal' ? '(0, 3]' : '[0, 3]' : s.rule === 'reciprocal' ? 'ℝ ∖ {0}' : 'ℝ'; }
function paritySymmetric(s) { return s.trimmed ? eq(s.lo, -s.hi) : s.domain === 'symmetric'; }
function render10(s, locale) {
  const bounds = s.rule === 'cube' ? [-30, 30] : s.rule === 'square' ? [-10, 10] : s.rule === 'zero' ? [-1, 1] : [-5, 5];
  const c = plot({ xmin: -3, xmax: 3, ymin: bounds[0], ymax: bounds[1], y: 70, h: 320 }), a = parityValue(s, s.x), b = parityValue(s, -s.x), formula = { square: 'x²', cube: 'x³', shift: 'x + 1', reciprocal: '1/x', zero: '0' }[s.rule];
  const cy = a.valid ? s.transform === 'mirror' ? a.value : -a.value : null;
  let svg = text(80, 40, `f(x) = ${formula}; D = ${parityDomain(s)}`, 'font-weight="700"') + c.svg;
  svg += graphCurve(c, x => functionValue(s.rule, x).value ?? NaN, -3, 3, x => parityValue(s, x).valid);
  if (a.valid) svg += `<g data-point="geometric-candidate">${circle(c.X(-s.x), clamp(c.Y(cy), 70, 390), 13, C.paper, C.amber)}${centerText(c.X(-s.x), clamp(c.Y(cy) - 24, 60, 370), t(locale, 'Geometric candidate', '幾何候選點'), 'font-size="16"')}</g>`;
  if (b.valid) svg += `<g data-point="actual-reflected-input">${circle(c.X(-s.x), clamp(c.Y(b.value), 70, 390), 6, C.ink, C.ink)}</g>`;
  const lo = s.trimmed ? s.lo : s.domain === 'restricted' ? 0 : -3, hi = s.trimmed ? s.hi : 3;
  svg += line(c.X(lo), 435, c.X(hi), 435, C.ink, 5) + rect(80, 475, 220, 48) + centerText(190, 505, t(locale, 'Mirror in y-axis', '關於縱軸反射'), 'font-size="18"') + rect(335, 475, 220, 48) + centerText(445, 505, t(locale, 'Rotate 180°', '旋轉 180°'), 'font-size="18"');
  svg += text(600, 485, t(locale, '○ candidate   ● actual', '○ 候選點　● 實際點'), 'font-size="17"');
  const rows = [[t(locale, 'Original graph point', '原圖像點'), fmt(s.x), valueLabel(a.value, locale), status(a.valid, locale)], [t(locale, s.transform === 'mirror' ? 'Mirror candidate (−x, f(x))' : 'Rotation candidate (−x, −f(x))', s.transform === 'mirror' ? '反射候選點 (−x, f(x))' : '旋轉候選點 (−x, −f(x))'), fmt(-s.x), valueLabel(cy, locale), t(locale, 'Geometry only; compare with actual', '只屬幾何構造；須與實際點比較')], [t(locale, 'Actual graph at reflected input', '反射輸入的實際圖像點'), fmt(-s.x), valueLabel(b.value, locale), status(b.valid, locale)]];
  if (a.valid && b.valid) rows.push([t(locale, 'Candidate − actual output', '候選輸出−實際輸出'), fmt(-s.x), fmt(cy - b.value), 'Δy']);
  return scene(t(locale, 'Compare geometric and actual points', '比較幾何候選點與實際點'), t(locale, 'Move P along the actual graph, then drop the transformation card into mirror or rotation. Trim the domain and compare the candidate with the true f(−x).', '沿實際圖像移動 P，把變換卡放入反射或旋轉槽。縮窄定義域，並把候選點與真正的 f(−x) 比較。'), svg,
    t(locale, `Domain ${parityDomain(s)}. f(${fmt(s.x)}) = ${valueLabel(a.value, locale)}; actual f(${fmt(-s.x)}) = ${valueLabel(b.value, locale)}.`, `定義域 ${parityDomain(s)}。f(${fmt(s.x)}) = ${valueLabel(a.value, locale)}；實際 f(${fmt(-s.x)}) = ${valueLabel(b.value, locale)}。`),
    [t(locale, 'Point / operation', '點／操作'), 'x', 'y', t(locale, 'Meaning / membership', '意義／所屬')], rows, {
      handles: [{ ...pointHandle('cursor', s.x, a.value ?? 0, t(locale, 'Original point P at input x', '輸入 x 的原來點 P'), c, -3, 3, 'P'), y: a.valid ? clamp(c.Y(a.value), 70, 390) : 410 }, { id: 'domain-left', kind: 'slider', x: c.X(lo), y: 435, label: t(locale, 'Trim left domain boundary', '縮窄定義域左邊界'), shortLabel: 'L', value: lo, min: s.domain === 'restricted' ? 0 : -3, max: 3, step: .25, nudge: { x: 800 / 24, y: 0 } }, { id: 'domain-right', kind: 'slider', x: c.X(hi), y: 435, label: t(locale, 'Trim right domain boundary', '縮窄定義域右邊界'), shortLabel: 'R', value: hi, min: s.domain === 'restricted' ? 0 : -3, max: 3, step: .25, nudge: { x: 800 / 24, y: 0 } }, { id: 'candidate', kind: 'token', x: 825, y: 505, w: 110, h: 42, label: t(locale, 'Transformation card for point P', '點 P 的變換卡'), shortLabel: t(locale, 'Transform P', '變換 P') }],
      zones: [{ id: 'mirror', x: 80, y: 475, w: 220, h: 48, label: t(locale, 'Reflect P in the y-axis', '把 P 關於縱軸反射') }, { id: 'rotate', x: 335, y: 475, w: 220, h: 48, label: t(locale, 'Rotate P 180 degrees about the origin', '把 P 關於原點旋轉 180 度') }],
      buttons: [{ id: 'mirror', label: t(locale, 'Mirror P', '反射 P') }, { id: 'rotate', label: t(locale, 'Rotate P', '旋轉 P') }, { id: 'restore-domain', label: t(locale, 'Restore selected domain', '還原所選定義域') }],
      choices: [choice('rule', ['Function', '函數'], s.rule, [['square', 'x²', 'x²'], ['cube', 'x³', 'x³'], ['shift', 'x + 1', 'x + 1'], ['reciprocal', '1/x', '1/x'], ['zero', '0', '0']], locale), choice('domain', ['Starting domain', '起始定義域'], s.domain, [['symmetric', 'Natural symmetric domain', '自然對稱定義域'], ['restricted', 'Restricted to [0, 3]', '限制為 [0,3]']], locale)],
      claims: [['even', 'Even only', '只屬偶函數'], ['odd', 'Odd only', '只屬奇函數'], ['both', 'Both odd and even', '同時為奇及偶函數'], ['neither', 'Neither odd nor even', '非奇非偶']].map(([value, en, zh]) => ({ value, label: t(locale, en, zh) })), custom: s.trimmed,
    });
}
export function render(id, raw, locale = 'en') {
  const s = stateOf(lessonId(id), raw);
  return ({ '07': render07, '08': render08, '09': render09, '10': render10 })[id](s, locale);
}
function feedback(status, locale, enTitle, zhTitle, lines) { return { status, title: t(locale, enTitle, zhTitle), lines: lines.map(([en, zh]) => t(locale, en, zh)) }; }
function check07(s, claim, locale) {
  if (!s.sent) return feedback('notice', locale, 'Send an input first', '請先送入輸入數值', [['Set the numeric token and place it in the input tray.', '設定數值卡，再把它放入輸入槽。']]);
  const a = pipeline(s), b = pipeline(s, [...s.order].reverse()), different = (a.end === null) !== (b.end === null) || a.end !== null && b.end !== null && !eq(a.end, b.end);
  if (claim === 'same') return feedback(different ? 'revise' : 'notice', locale, different ? 'This input distinguishes the orders' : 'A matching sample is not a proof', different ? '這個輸入區分兩個次序' : '相同樣本並非證明', [[different ? 'The same starting input gives different outputs or different domain membership in the two orders.' : 'The two orders agree at this input. Try another input and compare their general rules and domains.', different ? '同一原輸入在兩個次序所得輸出或定義域歸屬不同。' : '兩個次序在這個輸入相同。請試另一個輸入，再比較一般規則及定義域。']]);
  if (claim !== 'different') return feedback('notice', locale, 'Choose a claim', '請選擇猜想', [['Compare the actual order with its reverse.', '比較實際次序及相反次序。']]);
  return feedback(different ? 'success' : 'notice', locale, different ? 'A distinguishing input was found' : 'Find a distinguishing input', different ? '已找到區分輸入' : '尋找區分輸入', [[different ? 'One input with unequal outputs, or allowed in only one order, refutes equality of these functions.' : 'This input alone does not distinguish the functions. A match does not prove equality.', different ? '一個輸出不同，或只在一個次序被允許的輸入，已足以否定兩函數相同。' : '這個輸入未能區分兩函數。一次相同不等於證明相同。'], ...(s.rule === 'sqrt' ? [['Subtract 1 then square root requires x ≥ 1; square root then subtract 1 requires x ≥ 0. A rejected stage stops the pipeline.', '先減 1 再開平方要求 x≥1；先開平方再減 1 要求 x≥0。某階段拒絕輸入後，後續階段停止。']] : [])]);
}
function check08(s, claim, locale) {
  const e = extrema08(s), maxOK = in08(s, s.maxAt) && eq(value08(s, s.maxAt), e.max) && e.hasMax, minOK = in08(s, s.minAt) && eq(value08(s, s.minAt), e.min) && e.hasMin;
  if (claim === 'counterexample') {
    const w = s.witness, candidate = w?.kind === 'larger' ? s.maxAt : s.minAt;
    const valid = w && in08(s, candidate) && in08(s, w.x) && (w.kind === 'larger' ? value08(s, w.x) > value08(s, candidate) : value08(s, w.x) < value08(s, candidate));
    return feedback(valid ? 'success' : 'revise', locale, valid ? 'The candidate is refuted' : 'Construct an allowed comparison point', valid ? '候選最值已被推翻' : '請構造允許的比較點', [[valid ? `Candidate output ${fmt(value08(s, candidate))}; comparison output ${fmt(value08(s, w.x))}. Both inputs belong to ${interval(s)}.` : 'For y = x, place an allowed M or m, then use the larger/smaller construction.', valid ? `候選輸出 ${fmt(value08(s, candidate))}；比較輸出 ${fmt(value08(s, w.x))}。兩輸入均屬於 ${interval(s)}。` : '對 y = x，先放置被允許的 M 或 m，再使用構造更大／更小輸出。'], ['A counterexample refutes this candidate. The general midpoint construction applies to every proposed extreme next to an open endpoint.', '反例推翻這個候選點。當端點不包括時，一般中點構造適用於每個候選最值。']]);
  }
  const correct = claim === 'markers' ? maxOK && minOK : claim === 'no-max' ? !e.hasMax && minOK : claim === 'no-min' ? !e.hasMin && maxOK : claim === 'neither' ? !e.hasMax && !e.hasMin : false;
  if (!['markers', 'no-max', 'no-min', 'neither'].includes(claim)) return feedback('notice', locale, 'Choose an extrema claim', '請選擇最值猜想', [['Use your markers or state which extrema do not exist.', '使用你的標記，或指出哪些最值不存在。']]);
  const lines = [
    [e.hasMax ? `Maximum output ${fmt(e.max)} is attained on the stated domain.` : `Upper bound ${fmt(e.max)} is not attained; there is no maximum.`, e.hasMax ? `在所述定義域可取得最大輸出 ${fmt(e.max)}。` : `上界 ${fmt(e.max)} 未被取得，因此沒有最大值。`],
    [e.hasMin ? `Minimum output ${fmt(e.min)} is attained on the stated domain.` : `Lower bound ${fmt(e.min)} is not attained; there is no minimum.`, e.hasMin ? `在所述定義域可取得最小輸出 ${fmt(e.min)}。` : `下界 ${fmt(e.min)} 未被取得，因此沒有最小值。`],
    [s.rule === 'water' ? 'This check uses every endpoint and turning point of the stated straight-segment model.' : s.rule === 'quadratic' ? 'This check uses the vertex and endpoints of (x − 2)² + 1, with endpoint membership.' : 'For any x below an open right endpoint b, (x + b)/2 is allowed and larger. Above an open left endpoint a, (a + x)/2 is allowed and smaller.', s.rule === 'water' ? '本檢核使用指定直線分段模型的所有端點及轉折點。' : s.rule === 'quadratic' ? '本檢核使用 (x−2)²+1 的頂點及端點，並檢查端點是否包括。' : '對開右端點 b 以下任意 x，(x+b)/2 仍被允許且更大；對開左端點 a 以上任意 x，(a+x)/2 仍被允許且更小。'],
    ['The plotted pixels and finitely many cursor samples are not the proof.', '圖像像素及有限游標樣本本身並非證明。'],
  ];
  return feedback(correct ? 'success' : 'revise', locale, correct ? 'The extrema claim matches the model' : 'Revisit attainment and marker positions', correct ? '最值猜想符合模型' : '請重看可取得性及標記位置', lines);
}
function check09(s, claim, locale) {
  if (!['increasing', 'decreasing'].includes(claim)) return feedback('notice', locale, 'Choose a universal claim', '請選擇全稱猜想', [['Choose strictly increasing or strictly decreasing, then seek a counterexample.', '選擇嚴格遞增或嚴格遞減，再尋找反例。']]);
  const a = value09(s, s.x1), b = value09(s, s.x2);
  if (!(s.x1 < s.x2) || !a.valid || !b.valid) return feedback('revise', locale, 'The pair is not admissible', '這對輸入不被允許', [['Both ordered inputs must belong to the stated domain. The reciprocal is undefined at zero.', '兩個有序輸入都必須屬於所述定義域；倒數在零沒有定義。']]);
  const diff = b.value - a.value, refutes = claim === 'increasing' ? diff <= 0 : diff >= 0;
  return feedback(refutes ? 'success' : 'notice', locale, refutes ? 'A counterexample was found' : 'No counterexample in this pair', refutes ? '已找到反例' : '這對輸入未找到反例', [[`With ${fmt(s.x1)} < ${fmt(s.x2)}, f(x₂) − f(x₁) = ${fmt(diff)}.`, `當 ${fmt(s.x1)} < ${fmt(s.x2)}，f(x₂)−f(x₁) = ${fmt(diff)}。`], [refutes ? 'One admissible pair contradicting the required strict output order refutes the universal claim.' : 'This pair agrees with the claim. Even many agreeing pairs cannot prove a statement about every pair.', refutes ? '一對被允許且違反所需嚴格輸出次序的輸入，足以推翻全稱猜想。' : '這對輸入符合猜想。即使很多對都符合，也不能證明關於所有輸入對的命題。'], ['A proof must compare arbitrary x₁ < x₂ throughout the stated domain.', '證明必須比較所述定義域內任意 x₁<x₂。']]);
}
function check10(s, claim, locale) {
  const symmetric = paritySymmetric(s), expected = !symmetric ? 'neither' : s.rule === 'zero' ? 'both' : s.rule === 'square' ? 'even' : ['cube', 'reciprocal'].includes(s.rule) ? 'odd' : 'neither';
  if (!['even', 'odd', 'both', 'neither'].includes(claim)) return feedback('notice', locale, 'Choose a parity claim', '請選擇奇偶性猜想', [['Check the domain before comparing the identities.', '比較恆等式前先檢查定義域。']]);
  const correct = claim === expected, lines = [];
  if (!symmetric) {
    const lo = s.trimmed ? s.lo : 0, hi = s.trimmed ? s.hi : 3, witness = Math.abs(lo) > Math.abs(hi) ? lo : hi;
    lines.push([`The domain is not symmetric: ${fmt(witness)} is allowed but ${fmt(-witness)} is excluded.`, `定義域不對稱：${fmt(witness)} 被允許，但 ${fmt(-witness)} 被排除。`]);
    lines.push(['The formula is unchanged, but this domain cannot define an odd or even function.', '公式雖然未變，這個定義域卻不能定義奇函數或偶函數。']);
  } else {
    lines.push(['The full stated domain is symmetric about zero.', '完整所述定義域關於零對稱。']);
    const identity = { square: ['For every allowed x, f(−x) = (−x)² = x² = f(x). At x = 1, the odd identity fails.', '對每個允許 x，f(−x)＝(−x)²＝x²＝f(x)。在 x＝1，奇函數等式不成立。'], cube: ['For every allowed x, f(−x) = (−x)³ = −x³ = −f(x). Nonzero inputs rule out evenness.', '對每個允許 x，f(−x)＝(−x)³＝−x³＝−f(x)。非零輸入可排除偶性。'], reciprocal: ['For every allowed x ≠ 0, f(−x) = 1/(−x) = −f(x). Zero need not belong to an odd function’s domain.', '對每個允許 x≠0，f(−x)＝1/(−x)＝−f(x)。奇函數的定義域不必包括零。'], zero: ['For every allowed x, f(−x) = 0 = f(x) = −f(x), so both identities hold.', '對每個允許 x，f(−x)＝0＝f(x)＝−f(x)，因此兩個恆等式都成立。'], shift: ['f(−x) = 1 − x is not identically 1 + x; f(0) = 1 also rules out oddness.', 'f(−x)＝1−x 與 1+x 並非恆等；f(0)＝1 也排除奇性。'] }[s.rule];
    // A custom symmetric interval may exclude x = 1; the identity, rather than
    // that illustrative value, establishes the fixed-rule classification.
    if (s.rule === 'square' && s.trimmed) identity[0] = 'For every allowed x, f(−x) = x² = f(x). The symmetric interval includes nonzero inputs, whose positive square rules out oddness.';
    if (s.rule === 'square' && s.trimmed) identity[1] = '對每個允許 x，f(−x)＝x²＝f(x)。對稱區間包括非零輸入，其平方為正，可排除奇性。';
    lines.push(identity);
  }
  lines.push(['A geometric candidate is not automatically an actual graph point. One matching pair alone does not establish either identity.', '幾何候選點不會自動成為實際圖像點；一對相符輸入本身不能確立任何一個恆等式。']);
  return feedback(correct ? 'success' : 'revise', locale, correct ? 'The parity claim matches the fixed rule and domain' : 'Recheck the domain and both identities', correct ? '奇偶性猜想符合固定規則及定義域' : '請重查定義域及兩個恆等式', lines);
}
export function check(id, raw, claim, locale = 'en') {
  const s = stateOf(lessonId(id), raw);
  return ({ '07': check07, '08': check08, '09': check09, '10': check10 })[id](s, claim, locale);
}
