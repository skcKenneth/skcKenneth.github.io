import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { selahLesson } from "../../src/data/selah-lesson.mjs";
import { q5Cues } from "../../src/data/selah-classroom.mjs";
import { handleAsk } from "./ask.mjs";
import { createQuotaTable, reserveQuestion } from "./quota.mjs";

const ORIGIN = "https://skckenneth.github.io";
const URL = "https://selah.example/v1/tutor/ask";
const TEST_CODE = "fixture-invite-12345678";
const QUESTION = {
  lessonId: selahLesson.id,
  stepId: "domain",
  locale: "en",
  question: "Why can't x be smaller than 3?",
};
const ANSWER = "Look at the first square root. Its radicand x − 3 must be nonnegative.";

function request(payload = QUESTION, options = {}) {
  const headers = new Headers({ Origin: ORIGIN, "Content-Type": "application/json", Authorization: `Bearer ${TEST_CODE}` });
  for (const [name, value] of Object.entries(options.headers ?? {})) {
    if (value === null) headers.delete(name);
    else headers.set(name, value);
  }
  const method = options.method ?? "POST";
  const body = method === "POST" ? options.body ?? JSON.stringify(payload) : undefined;
  return new Request(options.url ?? URL, { method, headers, body });
}

function fixture(options = {}) {
  const calls = { quota: 0, model: [] };
  const env = {
    SELAH_ENABLED: "true",
    SELAH_ORIGIN: ORIGIN,
    SELAH_INVITE_CODE: TEST_CODE,
    SELAH_INVITE_EXPIRES_AT: "2099-01-01T00:00:00Z",
    SELAH_QUOTA: {
      getByName(name) {
        assert.equal(name, "global-daily");
        return { async reserve() {
          calls.quota++;
          return options.reserve?.() ?? { admitted: true, retryAfter: 600 };
        } };
      },
    },
    AI: {
      async run(model, input) {
        calls.model.push({ model, input });
        return options.run?.() ?? { choices: [{ finish_reason: "stop", message: { content: ANSWER } }] };
      },
    },
    ...options.env,
  };
  return { env, calls };
}

test("only the configured origin can post or complete preflight", async () => {
  const { env, calls } = fixture();
  const denied = await handleAsk(request(QUESTION, { headers: { Origin: `${ORIGIN}.example` } }), env);
  assert.equal(denied.status, 403);
  assert.equal(denied.headers.get("Access-Control-Allow-Origin"), null);
  assert.equal((await handleAsk(request(QUESTION, { headers: { Origin: null } }), env)).status, 403);

  const preflight = await handleAsk(request(QUESTION, {
    method: "OPTIONS",
    headers: { "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "authorization,content-type" },
  }), env);
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  assert.equal(preflight.headers.get("Access-Control-Allow-Headers"), "Authorization, Content-Type");
  assert.equal(calls.quota, 0);
});

test("a disabled service, invalid code, or expired code does not reach the model or reserve quota", async () => {
  const disabled = fixture({ env: { SELAH_ENABLED: "false" } });
  const off = await handleAsk(request(), disabled.env);
  assert.equal(off.status, 503);
  assert.deepEqual(await off.json(), { error: "unavailable" });
  assert.equal(disabled.calls.quota, 0);

  const active = fixture();
  const wrong = await handleAsk(request(QUESTION, { headers: { Authorization: `Bearer ${TEST_CODE.toUpperCase()}` } }), active.env);
  assert.equal(wrong.status, 403);
  assert.deepEqual(await wrong.json(), { error: "forbidden" });
  assert.equal(active.calls.quota, 0);

  const expired = fixture({ env: { SELAH_INVITE_EXPIRES_AT: "2025-01-01T00:00:00Z" } });
  assert.equal((await handleAsk(request(), expired.env)).status, 403);
  assert.equal(expired.calls.quota, 0);
  for (const state of [disabled, active, expired]) assert.equal(state.calls.model.length, 0);
});

test("invalid payloads are rejected before quota, including oversized bodies and unsupported locale or step", async () => {
  const { env, calls } = fixture();
  const invalid = [
    request({ ...QUESTION, lessonId: "other-lesson" }),
    request({ ...QUESTION, stepId: "teacher-key" }),
    request({ ...QUESTION, locale: "zh-CN" }),
    request({ ...QUESTION, question: " " }),
    request({ ...QUESTION, question: "問".repeat(601) }),
    request(QUESTION, { body: "{" }),
    request(QUESTION, { body: JSON.stringify({ ...QUESTION, ignored: "x".repeat(4096) }) }),
  ];
  for (const invalidRequest of invalid) {
    const response = await handleAsk(invalidRequest, env);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "invalid_request" });
  }
  assert.equal(calls.quota, 0);
  assert.equal(calls.model.length, 0);
});

test("a question uses only the requested step and locale, with a server-selected reference", async () => {
  const { env, calls } = fixture();
  const response = await handleAsk(request({ ...QUESTION, question: ` ${QUESTION.question} ` }), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await response.json(), { answer: ANSWER, referenceStepId: "domain" });

  const zhQuestion = "為甚麼點沿四分一圓移動？";
  const zhResponse = await handleAsk(request({ ...QUESTION, locale: "zh-Hant", stepId: "explore", question: zhQuestion }), env);
  assert.deepEqual(await zhResponse.json(), { answer: ANSWER, referenceStepId: "explore" });
  assert.equal(calls.quota, 2);
  const [english, chinese] = calls.model;
  assert.equal(english.model, "@cf/google/gemma-4-26b-a4b-it");
  assert.deepEqual(english.input.messages[1], { role: "user", content: QUESTION.question });
  const [domain, explore, , review] = selahLesson.steps;
  assert.ok(english.input.messages[0].content.includes(JSON.stringify(domain.tutorNotes.en)));
  assert.ok(english.input.messages[0].content.includes("√(a − b)"));
  assert.ok(!english.input.messages[0].content.includes(JSON.stringify(domain.formulas)));
  assert.ok(!english.input.messages[0].content.includes(JSON.stringify(review.tutorNotes.en)));
  assert.ok(!english.input.messages[0].content.includes(TEST_CODE));
  assert.deepEqual(english.input.chat_template_kwargs, { enable_thinking: false });
  assert.equal(english.input.max_completion_tokens, 400);
  assert.equal(english.input.stream, false);
  assert.equal(english.input.store, false);
  assert.equal(english.input.tools, undefined);
  assert.deepEqual(chinese.input.messages[1], { role: "user", content: zhQuestion });
  assert.ok(chinese.input.messages[0].content.includes("Traditional Chinese"));
  assert.ok(chinese.input.messages[0].content.includes(JSON.stringify(explore.tutorNotes["zh-Hant"])));
});

test("the proof step uses only an approved answer even when the model returns an unexpected label", async () => {
  const proof = selahLesson.steps.find(({ id }) => id === "prove");
  for (const [label, locale, expected] of [
    ["BOUND", "en", "bound"],
    ["equality", "zh-Hant", "equality"],
    ["identity", "en", "identity"],
    ["The unsquared sum is 6.", "zh-Hant", "clarify"],
    ["constructor", "en", "clarify"],
  ]) {
    const { env, calls } = fixture({ run: () => ({ choices: [{ finish_reason: "stop", message: { content: label } }] }) });
    const response = await handleAsk(request({ ...QUESTION, stepId: "prove", locale }), env);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { answer: proof.tutorAnswers[expected][locale], referenceStepId: "prove" });
    assert.equal(calls.model[0].input.max_completion_tokens, 32);
  }
});

test("a full daily quota responds with Retry-After and skips inference", async () => {
  const { env, calls } = fixture({ reserve: () => ({ admitted: false, retryAfter: 600 }) });
  const response = await handleAsk(request(), env);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "600");
  assert.deepEqual(await response.json(), { error: "rate_limited" });
  assert.equal(calls.model.length, 0);
});

const classroom = {
  ...QUESTION, stepId: "explore", question: "點解呢度最大？", locale: "zh-Hant",
  board: { cueId: "line", objectId: "line", x: 4.5 },
};
const modelReturning = content => fixture({
  run: () => ({ choices: [{ finish_reason: "stop", message: { content } }] }),
});

test("the narrated board resolves 'here' against the current coordinates and returns a visible highlight", async () => {
  for (const [x, expected] of [[4.5, /u = v/], [3, /u = 0/], [6, /v = 0/], [3.75, /0.8660/]]) {
    const { env, calls } = modelReturning("position");
    const result = await handleAsk(request({ ...classroom, board: { ...classroom.board, x } }), env);
    assert.equal(result.status, 200);
    const body = await result.json();
    assert.deepEqual([body.highlight, body.referenceStepId], ["point", "explore"]);
    assert.match(body.answer, expected);
    const instructions = calls.model[0].input.messages[0].content;
    assert.ok(instructions.includes('"selectedObject":"line"'));
    assert.ok(instructions.includes(`"x":${x}`));
    assert.ok(instructions.includes(q5Cues.find(cue => cue.id === "line").caption["zh-Hant"]));
  }
});

test("follow-up preserves recent turns as student data and uses the current cue for highlighting", async () => {
  const history = [{ question: "點解呢度最大？", answer: "而家 u = v。" }];
  for (const [cueId, stepId, highlight] of [["line", "explore", "line"], ["square", "prove", "identity"]]) {
    const { env, calls } = modelReturning("bound");
    const result = await handleAsk(request({
      ...classroom, stepId, question: "咁點解唔係 6？", history, board: { ...classroom.board, cueId },
    }), env);
    const body = await result.json();
    assert.equal(body.highlight, highlight);
    assert.equal(body.annotation, "bound");
    assert.match(body.answer, /u \+ v ≤ √6/);
    const messages = calls.model[0].input.messages;
    assert.ok(!messages[0].content.includes(history[0].answer));
    assert.deepEqual(JSON.parse(messages[1].content), { recentDialogue: history, latestQuestion: "咁點解唔係 6？" });
  }
});

test("an additional reviewed board is resolved server-side and may use its own cue ID", async () => {
  const { env, calls } = modelReturning("product");
  const result = await handleAsk(request({
    ...QUESTION, lessonId: "macau-2022-2023-senior-q2", stepId: "product",
    board: { cueId: "product", objectId: "product" }, question: "Why does each factor occur twice?",
  }), env);
  assert.equal(result.status, 200);
  const body = await result.json();
  assert.equal(body.highlight, "product");
  assert.match(body.answer, /\(xy\)\(yz\)\(zx\) = \(xyz\)²/);
  assert.ok(calls.model[0].input.messages[0].content.includes("(xy)(yz)(zx) = (xyz)²"));
});

test("bad board snapshots, out-of-range positions, and unbounded histories are rejected before quota", async () => {
  const { env, calls } = fixture();
  const turn = { question: "Why?", answer: "Use the equality case." };
  for (const payload of [
    { ...classroom, board: { ...classroom.board, x: "3" } },
    { ...classroom, board: { ...classroom.board, x: 7 } },
    { ...classroom, board: { ...classroom.board, objectId: "result" } },
    { ...classroom, board: { ...classroom.board, cueId: "square" } },
    { ...classroom, board: { ...classroom.board, objectId: "unknown" } },
    { ...classroom, history: Array(4).fill(turn) },
    { ...classroom, history: [{ question: "Why?", answer: "x".repeat(1001) }] },
    { ...classroom, board: null },
  ]) assert.equal((await handleAsk(request(payload), env)).status, 400);
  assert.equal(calls.model.length, 0);
  assert.equal(calls.quota, 0);
});

test("additional boards only use verified proof or generated cue text, even if the model confuses diagonal lengths", async () => {
  const question = {
    ...QUESTION, lessonId: "macau-2022-2023-senior-q6", stepId: "detour",
    board: { cueId: "detour", objectId: "detour" }, question: "Why is the detour longer?",
  };
  for (const [modelText, expected] of [["detour", /AH \+ HB > AB/], ["AC + BD < AB + CD", /Which part/]]) {
    const { env } = modelReturning(modelText);
    const reply = await handleAsk(request(question), env);
    assert.match((await reply.json()).answer, expected);
  }
  const generated = {
    ...question, lessonId: "root-sum:2:10", question: "What is the maximum?",
    stepId: "witness", board: { objectId: "witness", cueId: "witness" },
  };
  const { env } = modelReturning("witness");
  const result = await handleAsk(request(generated), env);
  const { answer } = await result.json();
  assert.match(answer, /6/);
  assert.match(answer, /4/);
});

test("upstream errors and incomplete results return an unavailable status", async () => {
  for (const run of [
    () => { throw new Error("fixture upstream error"); },
    () => ({ choices: [{ finish_reason: "length", message: { content: "unfinished" } }] }),
    () => ({ choices: [{ finish_reason: "stop", message: { content: "  ", refusal: "no answer" } }] }),
  ]) {
    const { env, calls } = fixture({ run });
    const response = await handleAsk(request(), env);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "unavailable" });
    assert.equal(calls.quota, 1);
  }
});

test("the SQLite reservation admits exactly 100 per UTC date and cannot move the count backwards", () => {
  const database = new DatabaseSync(":memory:");
  try {
    const sql = { exec: (statement, ...params) => ({ toArray: () => database.prepare(statement).all(...params) }) };
    createQuotaTable({ exec: (statement) => database.exec(statement) });
    const before = new Date("2026-11-22T23:59:58.500Z");
    const after = new Date("2026-11-23T00:00:00.000Z");
    for (let i = 0; i < 100; i++) assert.equal(reserveQuestion(sql, before).admitted, true, `request ${i + 1}`);
    assert.deepEqual(reserveQuestion(sql, before), { admitted: false, retryAfter: 2 });
    assert.deepEqual(reserveQuestion(sql, after), { admitted: true, retryAfter: 86_400 });
    assert.equal(reserveQuestion(sql, before).admitted, false);
    assert.equal(database.prepare("SELECT used FROM quota").get().used, 1);
  } finally {
    database.close();
  }
});
