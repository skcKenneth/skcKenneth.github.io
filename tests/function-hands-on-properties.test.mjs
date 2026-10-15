import test from 'node:test';
import assert from 'node:assert/strict';
import { ids, create, reduce, render, check } from '../src/lib/function-hands-on-properties.mjs';

const drag = (id, x, y = 250, extra = {}) => ({ type: 'drag', id, x, y, phase: 'move', ...extra });
const preset = (id, value) => ({ type: 'preset', id, value });
const action = id => ({ type: 'action', id });
const xPixel = (x, lo, hi) => 80 + (x - lo) * 800 / (hi - lo);
const freeze = value => { Object.freeze(value); for (const v of Object.values(value)) if (v && typeof v === 'object') freeze(v); return value; };

test('all four pure APIs reject unknown IDs and preserve source-aligned starting models', () => {
  assert.deepEqual(ids, ['07', '08', '09', '10']);
  for (const method of [create, reduce, render, check]) assert.throws(() => method('11'), RangeError);
  assert.deepEqual(create('07').order, ['a', 'b']);
  assert.equal(create('08').rule, 'water');
  assert.equal(create('09').rule, 'reciprocal-positive');
  assert.equal(create('10').rule, 'square');
  for (const id of ids) {
    const s = freeze(create(id)), before = JSON.stringify(s);
    const moved = reduce(id, s, { type: 'unknown' });
    render(id, s, 'en'); check(id, s, '', 'en');
    assert.equal(JSON.stringify(s), before);
    assert.doesNotThrow(() => JSON.stringify(moved));
  }
});

test('07 actual machine-card drops reorder the pipeline, and the numeric token sends it', () => {
  let s = create('07');
  assert.equal(check('07', s, 'different').status, 'notice');
  const outside = reduce('07', s, drag('machine-a', 500, 200, { phase: 'end' }));
  assert.deepEqual(outside.order, ['a', 'b']);
  s = reduce('07', s, drag('input-token', 120, 325, { phase: 'end', zone: 'feed' }));
  assert.equal(s.sent, true);
  let view = render('07', s);
  assert.deepEqual(view.rows[0].slice(1), ['2', '4', '7']);
  assert.deepEqual(view.rows[1].slice(1), ['2', '5', '10']);
  assert.equal(check('07', s, 'different').status, 'success');
  s = reduce('07', s, drag('machine-b', 320, 185, { phase: 'move', zone: 'slot-0' }));
  assert.deepEqual(s.order, ['a', 'b'], 'card movement must wait for its drop');
  s = reduce('07', s, drag('machine-b', 320, 185, { phase: 'end', zone: 'slot-0' }));
  assert.deepEqual(s.order, ['b', 'a']);
  view = render('07', s);
  assert.deepEqual(view.rows[0].slice(1), ['2', '5', '10']);
  s = reduce('07', s, drag('input', xPixel(0, -3, 5)));
  assert.deepEqual(render('07', s).rows[0].slice(1), ['0', '3', '6']);
});

test('07 a square-root domain rejection stops later stages and distinguishes composite domains', () => {
  let s = reduce('07', create('07'), preset('rule', 'sqrt'));
  s = reduce('07', s, drag('input', xPixel(0, -3, 5)));
  s = reduce('07', s, action('send'));
  let view = render('07', s);
  assert.deepEqual(view.rows[0].slice(1), ['0', '-1', 'Undefined']);
  assert.deepEqual(view.rows[1].slice(1), ['0', '0', '-1']);
  assert.equal(check('07', s, 'different').status, 'success');
  s = reduce('07', s, action('swap'));
  s = reduce('07', s, drag('input', xPixel(-1, -3, 5)));
  view = render('07', s);
  assert.equal(view.rows[0][2], 'Undefined');
  assert.match(view.rows[0][3], /Not run/);
});

test('07 equal outputs at a special input never certify equal functions', () => {
  let s = reduce('07', create('07'), preset('rule', 'sqrt'));
  s = reduce('07', s, drag('input', xPixel(1, -3, 5)));
  s = reduce('07', s, action('send'));
  assert.equal(render('07', s).rows[0][3], '0');
  assert.equal(render('07', s).rows[1][3], '0');
  assert.equal(check('07', s, 'same').status, 'notice');
  assert.equal(check('07', s, 'different').status, 'notice');
});

test('08 cursor follows the actual water segments; own markers distinguish local and global extrema', () => {
  let s = create('08');
  s = reduce('08', s, drag('cursor', xPixel(3, 0, 6), 0));
  assert.deepEqual(render('08', s).rows[0].slice(1, 3), ['3', '3.5']);
  assert.equal(check('08', s, 'markers').status, 'revise', 'the local minimum at t=4 is not the global minimum');
  s = reduce('08', s, drag('max-marker', xPixel(2, 0, 6)));
  s = reduce('08', s, drag('min-marker', xPixel(0, 0, 6)));
  assert.equal(check('08', s, 'markers').status, 'success');
  s = reduce('08', s, drag('domain-left', xPixel(3, 0, 6)));
  s = reduce('08', s, drag('max-marker', xPixel(6, 0, 6)));
  s = reduce('08', s, drag('min-marker', xPixel(4, 0, 6)));
  assert.equal(render('08', s).custom, true);
  assert.equal(check('08', s, 'markers').status, 'success', 'trimming removes the original maximum and minimum');
});

test('08 open interval constructs a strictly larger admissible output without declaring a sampled maximum', () => {
  let s = reduce('08', create('08'), preset('rule', 'line'));
  s = reduce('08', s, drag('max-marker', xPixel(1.75, 0, 2)));
  s = reduce('08', s, action('construct-larger'));
  assert.equal(s.maxAt, 1.75);
  assert.equal(s.witness.x, 1.875);
  assert.ok(s.witness.x > s.maxAt && s.witness.x < 2);
  assert.equal(check('08', s, 'counterexample').status, 'success');
  assert.equal(check('08', s, 'markers').status, 'revise');
  assert.equal(check('08', s, 'neither').status, 'success');
  s = reduce('08', s, drag('min-marker', xPixel(.25, 0, 2)));
  s = reduce('08', s, action('construct-smaller'));
  assert.equal(s.witness.x, .125);
  assert.ok(s.witness.x > 0 && s.witness.x < s.minAt);
  assert.equal(check('08', s, 'counterexample').status, 'success');
  s = reduce('08', s, action('toggle-right'));
  s = reduce('08', s, drag('max-marker', xPixel(2, 0, 2)));
  assert.equal(check('08', s, 'no-min').status, 'success', '(0,2] has an attained max and no min');
  s = reduce('08', s, action('toggle-right'));
  assert.equal(render('08', s).handles.find(h => h.id === 'max-marker').y, 420, 'an excluded candidate must not fill the open endpoint on the actual graph');
});

test('08 quadratic domain trimming excludes the original vertex and changes the minimum', () => {
  let s = reduce('08', create('08'), preset('rule', 'quadratic'));
  s = reduce('08', s, drag('domain-left', xPixel(3, 0, 5)));
  s = reduce('08', s, drag('min-marker', xPixel(3, 0, 5)));
  s = reduce('08', s, drag('max-marker', xPixel(5, 0, 5)));
  assert.deepEqual(render('08', s).rows[2].slice(1, 3), ['3', '2']);
  assert.equal(check('08', s, 'markers').status, 'success');
  s = reduce('08', s, action('toggle-left'));
  assert.equal(check('08', s, 'no-min').status, 'success');
});

test('09 input identities remain strictly ordered rather than being silently swapped', () => {
  let s = create('09');
  s = reduce('09', s, drag('x1', xPixel(4, -4, 4)));
  assert.equal(s.x1, 1.75);
  assert.equal(s.x2, 2);
  s = reduce('09', s, drag('x2', xPixel(-4, -4, 4)));
  assert.equal(s.x2, 2);
  assert.ok(s.x1 < s.x2);
  const before = JSON.stringify(s);
  s = reduce('09', s, drag('x1', NaN));
  assert.equal(JSON.stringify(s), before);
});

test('09 zero is rejected for reciprocal; a crossing-zero pair refutes whole-domain decrease', () => {
  let s = reduce('09', create('09'), preset('rule', 'reciprocal-whole'));
  s = reduce('09', s, drag('x1', xPixel(0, -4, 4)));
  assert.equal(render('09', s).rows[0][2], 'Undefined');
  assert.equal(check('09', s, 'decreasing').status, 'revise');
  s = reduce('09', s, drag('x1', xPixel(-1, -4, 4)));
  s = reduce('09', s, drag('x2', xPixel(1, -4, 4)));
  assert.deepEqual(render('09', s).rows[0], ['-1', '1', '-1', '1', '2']);
  assert.equal(check('09', s, 'decreasing').status, 'success');
  assert.equal(check('09', s, 'increasing').status, 'notice');
  s = reduce('09', s, preset('rule', 'reciprocal-negative'));
  assert.equal(check('09', s, 'decreasing').status, 'notice', 'agreeing pairs are never certified as a proof');
  assert.equal(check('09', s, 'increasing').status, 'success');
});

test('09 positive quadratic sample supports increase but cannot auto-prove it', () => {
  const s = reduce('09', create('09'), preset('rule', 'quadratic'));
  assert.deepEqual(render('09', s).rows[0], ['1', '2', '3', '9', '6']);
  assert.equal(check('09', s, 'increasing').status, 'notice');
  assert.equal(check('09', s, 'decreasing').status, 'success');
  const partial = { rule: 'quadratic', x1: 3.5 };
  const normalized = render('09', partial).rows[0];
  assert.ok(Number(normalized[0]) < Number(normalized[1]), 'fallback x2 must remain above the retained x1');
  assert.equal(check('09', partial, 'increasing').status, 'notice', 'malformed partial state cannot create a reversed-pair counterexample');
});

test('10 mirror and rotation candidates stay distinct from actual f(−x)', () => {
  let s = reduce('10', create('10'), preset('rule', 'shift'));
  let view = render('10', s);
  assert.deepEqual(view.rows[0].slice(1, 3), ['2', '3']);
  assert.deepEqual(view.rows[1].slice(1, 3), ['-2', '3']);
  assert.deepEqual(view.rows[2].slice(1, 3), ['-2', '-1']);
  assert.equal(view.rows[3][2], '4');
  s = reduce('10', s, drag('candidate', 445, 499, { phase: 'move', zone: 'rotate' }));
  assert.equal(s.transform, 'mirror');
  s = reduce('10', s, drag('candidate', 445, 499, { phase: 'end', zone: 'rotate' }));
  view = render('10', s);
  assert.equal(view.rows[1][2], '-3');
  assert.equal(view.rows[2][2], '-1');
  assert.equal(view.rows[3][2], '-2');
  assert.match(view.svg, /data-point="geometric-candidate"/);
  assert.match(view.svg, /data-point="actual-reflected-input"/);
  assert.equal(check('10', s, 'neither').status, 'success');
});

test('10 restricting an unchanged square removes the actual reflected input and evenness', () => {
  let s = create('10');
  assert.equal(check('10', s, 'even').status, 'success');
  s = reduce('10', s, drag('domain-left', xPixel(0, -3, 3)));
  assert.equal(s.rule, 'square');
  const view = render('10', s);
  assert.equal(view.rows[1][2], '4', 'geometric mirror can still be drawn');
  assert.equal(view.rows[2][2], 'Undefined', 'missing reflected input is never manufactured');
  assert.doesNotMatch(view.svg, /data-point="actual-reflected-input"/);
  assert.equal(check('10', s, 'even').status, 'revise');
  assert.equal(check('10', s, 'neither').status, 'success');
  s = reduce('10', s, action('restore-domain'));
  assert.equal(check('10', s, 'even').status, 'success');
});

test('10 zero is both on symmetric domains; reciprocal can be odd without being defined at zero', () => {
  let s = reduce('10', create('10'), preset('rule', 'zero'));
  assert.equal(check('10', s, 'both').status, 'success');
  assert.equal(check('10', s, 'even').status, 'revise');
  s = reduce('10', s, preset('domain', 'restricted'));
  s = reduce('10', s, drag('domain-left', xPixel(-2, -3, 3)));
  assert.equal(s.lo, 0, 'trimming cannot extend the selected restricted domain');
  assert.equal(check('10', s, 'both').status, 'revise', 'the zero formula does not override domain symmetry');
  assert.equal(check('10', s, 'neither').status, 'success');
  s = reduce('10', create('10'), preset('rule', 'reciprocal'));
  s = reduce('10', s, drag('cursor', xPixel(0, -3, 3)));
  assert.equal(render('10', s).rows[0][2], 'Undefined');
  assert.equal(render('10', s).rows[2][2], 'Undefined');
  assert.equal(check('10', s, 'odd').status, 'success');
});

test('10 symmetric custom trim uses the actual interval and safely renders cubic endpoints', () => {
  let s = reduce('10', create('10'), preset('rule', 'cube'));
  s = reduce('10', s, drag('cursor', xPixel(3, -3, 3)));
  const view = render('10', s);
  assert.equal(view.rows[0][2], '27');
  const cursor = view.handles.find(h => h.id === 'cursor');
  assert.ok(cursor.y > 70 && cursor.y < 390, 'the endpoint fits the cubic plot scale');
  s = reduce('10', s, drag('domain-left', xPixel(-.5, -3, 3)));
  s = reduce('10', s, drag('domain-right', xPixel(.5, -3, 3)));
  assert.equal(check('10', s, 'odd').status, 'success');
  s = reduce('10', s, preset('rule', 'square'));
  s = reduce('10', s, drag('domain-left', xPixel(-.5, -3, 3)));
  s = reduce('10', s, drag('domain-right', xPixel(.5, -3, 3)));
  assert.equal(check('10', s, 'even').status, 'success');
  assert.doesNotMatch(check('10', s, 'even').lines.join(' '), /At x = 1/);
});

test('render contract is localized, serializable and free of pre-check diagnoses', () => {
  for (const id of ids) for (const locale of ['en', 'zh-Hant']) {
    const view = render(id, create(id), locale);
    for (const key of ['title', 'task', 'svg', 'summary']) assert.equal(typeof view[key], 'string');
    for (const label of [...view.headers, ...view.rows.flat(), ...view.handles.map(h => h.label), ...view.zones.map(z => z.label), ...view.buttons.map(b => b.label), ...view.choices.flatMap(c => [c.label, ...c.options.map(o => o.label)]), ...view.claims.map(c => c.label)]) assert.equal(typeof label, 'string');
    if (locale === 'zh-Hant') assert.match(view.title, /[\u3400-\u9fff]/);
    assert.doesNotMatch(view.summary, /correct|success|refutes|奇函數|偶函數|全域最大值/i);
    assert.doesNotMatch(view.svg, /<script|on(?:click|pointer|key)=/i);
    assert.doesNotMatch(view.svg, /NaN|Infinity/);
    assert.ok(view.handles.every(h => Number.isFinite(h.x) && Number.isFinite(h.y)));
    assert.doesNotThrow(() => JSON.stringify(view));
  }
});

test('nonfinite drag values, unknown drops and invalid presets do not corrupt any state', () => {
  for (const id of ids) {
    const s = create(id);
    assert.deepEqual(reduce(id, s, drag('cursor', Infinity)), s);
    assert.deepEqual(reduce(id, s, drag('cursor', 100, NaN)), s);
    for (const handle of render(id, s).handles) assert.deepEqual(reduce(id, s, drag(handle.id, 750, 200, { phase: 'start' })), s, `${id}:${handle.id}: drag start must not edit state`);
    assert.deepEqual(reduce(id, s, preset('rule', '<script>')), s);
    assert.deepEqual(reduce(id, s, drag('candidate', 0, 0, { phase: 'end', zone: 'unknown' })), s);
    assert.doesNotThrow(() => render(id, { x: NaN, x1: Infinity, lo: -Infinity, hi: null }, 'zh-Hant'));
  }
});
