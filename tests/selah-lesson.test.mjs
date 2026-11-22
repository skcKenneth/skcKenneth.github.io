import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateSelah, selahLesson } from '../src/data/selah-lesson.mjs';
import { filterTeachingResources, teachingHref } from '../src/data/teaching-directory.mjs';
import { gradeTransfer, practiceState, transferProblem } from '../src/data/selah-practice.mjs';
import { q5Cues } from '../src/data/selah-classroom.mjs';
import { generatedCues, reviewedBoards } from '../src/data/selah-intake.mjs';
import { statSync } from 'node:fs';

test('each reviewed cue has both playable recordings in the release', () => {
  for (const cue of [...q5Cues, ...reviewedBoards.flatMap(board => board.cues), ...generatedCues]) {
    for (const locale of ['en','yue']) {
      const file = new URL(`../public/audio/selah/${locale}/${cue.audioId || cue.id}.mp3`, import.meta.url);
      assert.ok(statSync(file).size > 10000, file.href);
    }
  }
});

test('practice intervals attain their upper bounds and check the equality argument', () => {
  assert.deepEqual(transferProblem(0), {low:2, high:10, midpoint:6, maximum:4});
  for (let i=0; i<28; i++) {
    const p = transferProblem(i);
    assert.equal(2*(p.high-p.low), p.maximum**2);
    assert.ok(Math.abs(Math.sqrt(p.midpoint-p.low)+Math.sqrt(p.high-p.midpoint)-p.maximum)<1e-9);
    assert.equal(gradeTransfer(p, String(p.midpoint), String(p.maximum), 'equal'), 'correct');
    assert.equal(gradeTransfer(p, String(p.midpoint), String(p.maximum), 'constant'), 'square');
    assert.equal(gradeTransfer(p, String(p.low), String(p.maximum), 'equal'), 'balance');
  }
  assert.equal(practiceState({resolved:['explore']}).invariant, 'open');
  assert.equal(practiceState({transfer:'viewed'}).transfer, 'viewed');
  assert.equal(practiceState({transfer:'independent'}).transfer, 'independent');
});

test('the square-root sum has the stated bound, equality case and endpoint values', () => {
  const tolerance = 1e-12;
  for (let index = 0; index <= 300; index += 1) {
    const { x, u, v, sum } = evaluateSelah(3 + index / 100);
    assert.ok(Math.abs(u ** 2 + v ** 2 - 3) < tolerance);
    assert.ok(Math.abs(sum ** 2 - (6 - (u - v) ** 2)) < tolerance);
    assert.ok(sum >= Math.sqrt(3) - tolerance && sum <= Math.sqrt(6) + tolerance);
    assert.ok(Math.abs(sum - evaluateSelah(9 - x).sum) < tolerance);
  }
  assert.equal(evaluateSelah(3).sum, Math.sqrt(3));
  assert.equal(evaluateSelah(6).sum, Math.sqrt(3));
  const midpoint = evaluateSelah(4.5);
  assert.equal(midpoint.u, midpoint.v);
  assert.equal(midpoint.sum, Math.sqrt(6));
  for (const outside of [2.99, 6.01, Number.NaN, Number.POSITIVE_INFINITY, '4.5']) {
    assert.throws(() => evaluateSelah(outside), RangeError);
  }
});

test('the bilingual lesson shares stable steps, valid reveal points and two quiz answers', () => {
  const locales = ['en', 'zh-Hant'];
  assert.deepEqual(selahLesson.steps.map((step) => step.id), ['domain', 'explore', 'prove', 'review']);
  assert.deepEqual(selahLesson.steps.filter((step) => step.quiz).map((step) => step.quiz.answerId), ['squared-components', 'same']);
  for (const step of selahLesson.steps) {
    for (const locale of locales) {
      assert.ok(step.title[locale] && step.text[locale] && step.tutorNotes[locale]);
      if (step.quiz) {
        const { options, answerId, revealFrom, prompt, hint, explanation } = step.quiz;
        assert.equal(options.filter((option) => option.id === answerId).length, 1);
        assert.ok(options.every((option) => option.label[locale]));
        assert.ok(prompt[locale] && hint[locale] && explanation[locale]);
        assert.ok(revealFrom > 0 && revealFrom < step.formulas.length);
      }
    }
  }
});

test('the teaching directory finds Selah in both languages', () => {
  for (const [locale, query, prefix] of [['en', 'square roots', ''], ['zh-Hant', '白板', '/zh']]) {
    const resource = filterTeachingResources({ audience: 'senior', format: 'interactive', query, locale })
      .find((entry) => entry.id === 'selah');
    assert.ok(resource);
    assert.equal(teachingHref(resource, locale), `${prefix}/teaching/selah/`);
  }
});
