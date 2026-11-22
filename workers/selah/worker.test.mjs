import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { selahLesson } from "../../src/data/selah-lesson.mjs";
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

  const zhQuestion = "點解兩個平方根的和是 √6？";
  const zhResponse = await handleAsk(request({ ...QUESTION, locale: "zh-Hant", stepId: "prove", question: zhQuestion }), env);
  assert.deepEqual(await zhResponse.json(), { answer: ANSWER, referenceStepId: "prove" });
  assert.equal(calls.quota, 2);
  const [english, chinese] = calls.model;
  assert.equal(english.model, "@cf/google/gemma-4-26b-a4b-it");
  assert.deepEqual(english.input.messages[1], { role: "user", content: QUESTION.question });
  const [domain, , prove, review] = selahLesson.steps;
  assert.ok(english.input.messages[0].content.includes(JSON.stringify(domain.tutorNotes.en)));
  assert.ok(!english.input.messages[0].content.includes(JSON.stringify(review.tutorNotes.en)));
  assert.ok(!english.input.messages[0].content.includes(TEST_CODE));
  assert.deepEqual(english.input.chat_template_kwargs, { enable_thinking: false });
  assert.equal(english.input.max_completion_tokens, 400);
  assert.equal(english.input.stream, false);
  assert.equal(english.input.store, false);
  assert.equal(english.input.tools, undefined);
  assert.deepEqual(chinese.input.messages[1], { role: "user", content: zhQuestion });
  assert.ok(chinese.input.messages[0].content.includes("Traditional Chinese"));
  assert.ok(chinese.input.messages[0].content.includes(JSON.stringify(prove.tutorNotes["zh-Hant"])));
});

test("a full daily quota responds with Retry-After and skips inference", async () => {
  const { env, calls } = fixture({ reserve: () => ({ admitted: false, retryAfter: 600 }) });
  const response = await handleAsk(request(), env);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "600");
  assert.deepEqual(await response.json(), { error: "rate_limited" });
  assert.equal(calls.model.length, 0);
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
