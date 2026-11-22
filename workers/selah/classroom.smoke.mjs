import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { selahLesson } from "../../src/data/selah-lesson.mjs";

const url = "https://selah-math-whiteboard.kenneth-cheng-research-studio.workers.dev/v1/tutor/ask";
const origin = "https://skckenneth.github.io";
const invite = readFileSync(0, "utf8").trim();
if (!/^[A-Za-z0-9_-]{20,128}$/.test(invite)) throw new Error("Supply the pilot invitation on stdin.");

const q5 = (locale, x, question, history = []) => ({
  locale, lessonId: selahLesson.id, question, history, stepId: "explore",
  board: { cueId: "line", objectId: "line", x },
});
async function post(sample, code = invite) {
  const start = Date.now();
  const response = await fetch(url, {
    method: "POST", headers: { Origin: origin, "Content-Type": "application/json", Authorization: "Bearer " + code },
    redirect: "error", signal: AbortSignal.timeout(25_000), body: JSON.stringify(sample),
  });
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
  return { status: response.status, duration: Date.now() - start, data: await response.json() };
}
async function ask(sample, check) {
  const { status, duration, data } = await post(sample);
  assert.equal(status, 200, `${sample.stepId} live status`);
  assert.equal(data.referenceStepId, sample.stepId);
  assert.ok(!data.answer.includes(invite));
  console.log(JSON.stringify({ question: sample.question, answer: data.answer, highlight: data.highlight, milliseconds: duration }));
  check(data);
  return { question: sample.question, answer: data.answer };
}

const first = q5("zh-Hant", 4.5, "點解呢度最大？");
assert.equal((await post(first, "wrong-invitation-1234567890")).status, 403);
assert.equal((await post({ ...first, board: { ...first.board, x: 10 } })).status, 400);
for (const [locale, here, whySix] of [
  ["zh-Hant", first.question, "咁點解答案唔係 6？"],
  ["en", "Is it largest here? How do I know?", "Then why isn't the answer 6?"],
]) {
  const turn = await ask(q5(locale, 4.5, here), ({ answer, highlight }) => {
    assert.match(answer, /u = v/);
    assert.match(answer, /4\.5/);
    assert.equal(highlight, "point");
  });
  await ask(q5(locale, 4.5, whySix, [turn]), ({ answer, highlight, annotation }) => {
    assert.match(answer, /\(u \+ v\)²/);
    assert.match(answer, /u \+ v ≤ √6/);
    assert.equal(highlight, "line");
    assert.equal(annotation, "bound");
  });
  await ask(q5(locale, 3, here), ({ answer, highlight }) => {
    assert.match(answer, /u = 0/);
    assert.match(answer, /√3/);
    assert.equal(highlight, "point");
  });
}
for (const [lessonId, cueId, question, expected] of [
  ["macau-2022-2023-senior-q6", "detour", "Why is the detour longer?", /AH \+ HB > AB/],
  ["root-sum:2:10", "witness", "At what x does this sum reach its maximum, and what is that value?", /4/],
]) {
  await ask({ lessonId, locale: "en", stepId: cueId, board: { cueId, objectId: cueId }, question }, ({ answer, highlight }) => {
    assert.equal(highlight, cueId);
    assert.match(answer, expected);
    if (cueId === "witness") assert.match(answer, /6/);
  });
}
