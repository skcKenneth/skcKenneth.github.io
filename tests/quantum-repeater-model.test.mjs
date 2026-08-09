import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  fidelityFromVisibility,
  randomTape,
  simulateEpisode,
  SLOT_ORDER,
} from "../src/lib/quantum-repeater-model.mjs";

const fixtureUrl = new URL("./fixtures/quantum-repeater-event-trace.json", import.meta.url);
const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

test("the public slot-order contract stays fixed", () => {
  assert.deepEqual(SLOT_ORDER, fixture.slotOrder);
});

test("fixed random tape reproduces the language-neutral event trace", () => {
  const actual = simulateEpisode(fixture.config, { random: randomTape(fixture.randomTape) });
  const comparable = {
    delivered: actual.delivered,
    censored: actual.censored,
    latency: actual.latency,
    fidelity: actual.fidelity,
    useful: actual.useful,
    counters: actual.counters,
    trace: actual.trace,
  };
  assert.deepEqual(comparable, fixture.expected);
});

test("new swap outputs cannot cascade within the same slot", () => {
  const actual = simulateEpisode(fixture.config, { random: randomTape(fixture.randomTape) });
  assert.deepEqual(actual.trace[0].state.map(({ start, end }) => [start, end]), [[0, 2]]);
  assert.equal(actual.latency, 3);
});

test("the 1, 3, 2 boundary priority and composite-age reset are fixture-locked", () => {
  const actual = simulateEpisode(fixture.config, { random: randomTape(fixture.randomTape) });
  assert.deepEqual(actual.trace[1].events[2].pairs, [[[2, 3], [3, 4]]]);
  assert.deepEqual(actual.trace[1].state.map(({ start, end, age }) => [start, end, age]), [[0, 2, 1], [2, 4, 0]]);
  assert.equal(actual.trace[2].state[0].age, 0);
});

test("seeded episodes are reproducible without claiming cross-language PRNG parity", () => {
  const config = { generationProbability: 0.2, swapProbability: 0.8, seed: 9182, maxSlots: 80 };
  assert.deepEqual(simulateEpisode(config), simulateEpisode(config));
});

test("the age-oblivious baseline uses a constant per-slot discard hazard", () => {
  const values = [0.1, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.2, 0.9, 0.9, 0.9, 0.1];
  const actual = simulateEpisode({
    generationProbability: 0.5,
    swapProbability: 0.8,
    memoryLifetime: 20,
    cutoff: 30,
    policy: "probabilistic-cutoff",
    probabilisticDiscardHazard: 0.125,
    maxSlots: 3,
  }, { random: randomTape(values) });
  assert.deepEqual(actual.trace[1].events[4].links, []);
  assert.deepEqual(actual.trace[2].events[4].links, [[0, 1]]);
});

test("Werner visibility conversion respects its exact boundary values", () => {
  assert.equal(fidelityFromVisibility(0), 0.25);
  assert.equal(fidelityFromVisibility(1), 1);
  assert.equal(fidelityFromVisibility(0.8), 0.8500000000000001);
});
