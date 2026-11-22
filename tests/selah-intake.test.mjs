import assert from 'node:assert/strict';
import { test } from 'node:test';
import { catalogue, identifyProblem, q5Id, resolveBoard } from '../src/data/selah-intake.mjs';

test('identifies the three reviewed contest boards by reference or full bilingual question', () => {
  for (const entry of catalogue) {
    for (const text of [entry.edition + ' Q' + entry.number, ...Object.values(entry.question)]) {
      assert.deepEqual(identifyProblem(text), { kind: 'reviewed', id: entry.id });
    }
  }
  assert.equal(identifyProblem('求 √(x − 3) + √(6 − x) 的最大值。').id, q5Id);
});

test('checks the domain, upper bound and feasible witness before offering an original board', () => {
  for (const [a, b] of [[-5, 0], [0, 1], [2, 10], [9999, 10000], [-10000, 10000]]) {
    const first = a < 0 ? 'x+' + -a : 'x-' + a;
    const match = identifyProblem('Find the maximum of sqrt(' + first + ')+sqrt(' + b + '-x).');
    const board = resolveBoard(match.id);
    assert.equal(match.kind, 'generated'); assert.equal(board.id, 'root-sum:' + a + ':' + b);
    assert.equal(board.cues[0].formula, a + ' ≤ x ≤ ' + b);
    const x = (a + b) / 2;
    assert.ok(Math.abs((Math.sqrt(x - a) + Math.sqrt(b - x)) ** 2 - 2 * (b - a)) < 1e-8);
    assert.ok(board.cues[2].formula.includes('x = ' + x + ' '));
  }
});

test('preserves numeric punctuation and refuses changed terms, side conditions and objectives', () => {
  for (const text of [
    '求 √(x−2.5) + √(10−x) 的最大值', '求 √(x−.5) + √(10−x) 的最大值',
    '求 √(x−1,5) + √(10−x) 的最大值', 'Find the maximum of √(x−2) + √(10−x) for x < 3',
    'Find the maximum of 2√(x−2)+√(10−x)', 'Find the maximum of √(x−2)+√(10−x)+7',
    'Find the minimum of √(x−2)+√(10−x)', 'Find the maximum for integer x of √(x−2)+√(10−x)',
    'Find the maximum of √(x−10)+√(2−x)', 'Prove the angle relation shown in the diagram.',
  ]) assert.equal(identifyProblem(text).id, undefined, text);
  assert.equal(identifyProblem('請參考下圖').kind, 'diagram');
  for (const id of ['root-sum:02:10', 'root-sum:-0:1', 'root-sum:2:2', 'root-sum:5:1','root-sum:1:10001']) assert.equal(resolveBoard(id), null);
});
