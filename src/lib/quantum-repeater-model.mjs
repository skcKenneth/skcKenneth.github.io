/**
 * Protocol-level quantum repeater model shared by the public teaching labs.
 *
 * The event order is part of the public model contract. Keep it aligned with
 * the private Python implementation and with tests/fixtures/repeater-trace.json.
 */
export const SLOT_ORDER = Object.freeze([
  "age",
  "generate",
  "select-swaps",
  "resolve-swaps",
  "discard",
  "deliver",
]);

export const POLICY_IDS = Object.freeze([
  "swap-asap",
  "fixed-cutoff",
  "probabilistic-cutoff",
  "nominal-stage-aware",
  "risk-sensitive",
]);

const DEFAULTS = Object.freeze({
  generationProbability: 0.2,
  swapProbability: 0.8,
  memoryLifetime: 20,
  cutoff: 8,
  fidelityThreshold: 0.8,
  policy: "risk-sensitive",
  seed: 240819,
  maxSlots: 400,
  initialVisibility: 0.98,
  swapQuality: 0.99,
  probabilisticDiscardHazard: 0.125,
});

const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

export function normaliseConfig(input = {}) {
  const config = { ...DEFAULTS, ...input };
  const policy = POLICY_IDS.includes(config.policy) ? config.policy : DEFAULTS.policy;
  return Object.freeze({
    generationProbability: clamp(Number(config.generationProbability), 0.01, 1),
    swapProbability: clamp(Number(config.swapProbability), 0.01, 1),
    memoryLifetime: clamp(Number(config.memoryLifetime), 1, 500),
    cutoff: clamp(Number(config.cutoff), 1, 200),
    fidelityThreshold: clamp(Number(config.fidelityThreshold), 0.5, 1),
    policy,
    seed: Number(config.seed) >>> 0,
    maxSlots: Math.max(1, Math.floor(Number(config.maxSlots))),
    initialVisibility: clamp(Number(config.initialVisibility), 0, 1),
    swapQuality: clamp(Number(config.swapQuality), 0, 1),
    probabilisticDiscardHazard: clamp(Number(config.probabilisticDiscardHazard), 0, 1),
  });
}

export function fidelityFromVisibility(visibility) {
  return (1 + 3 * clamp(Number(visibility), 0, 1)) / 4;
}

export function mulberry32(seed) {
  let state = Number(seed) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** A language-neutral random tape for Python/JavaScript event-trace parity. */
export function randomTape(values, { repeat = false } = {}) {
  let cursor = 0;
  return () => {
    if (!values.length) throw new Error("Random tape must contain at least one value.");
    if (cursor >= values.length && !repeat) {
      throw new Error(`Random tape exhausted after ${cursor} draws.`);
    }
    const value = Number(values[cursor % values.length]);
    cursor += 1;
    if (!(value >= 0 && value < 1)) throw new Error(`Invalid random-tape value: ${value}`);
    return value;
  };
}

function spanCutoff(policy, base, span) {
  if (span >= 4 || policy === "swap-asap") return Number.POSITIVE_INFINITY;
  if (policy === "fixed-cutoff" || policy === "probabilistic-cutoff") return base;
  if (policy === "nominal-stage-aware") {
    return base * ({ 1: 0.7, 2: 1, 3: 1.4 }[span] ?? 1);
  }
  return base * ({ 1: 0.55, 2: 1.05, 3: 1.8 }[span] ?? 1);
}

function shouldDiscard(segment, config, random) {
  const limit = spanCutoff(config.policy, config.cutoff, segment.end - segment.start);
  if (config.policy !== "probabilistic-cutoff") return segment.age > limit;
  // Age-oblivious baseline: every stored (age > 0) pair faces the same hazard.
  return segment.age > 0 && random() < config.probabilisticDiscardHazard;
}

const round = (value, digits = 6) => Number(value.toFixed(digits));
const snapshot = (segments) => segments
  .slice()
  .sort((a, b) => a.start - b.start || a.end - b.end)
  .map(({ start, end, age, visibility }) => ({
    start,
    end,
    age: round(age, 4),
    visibility: round(visibility),
  }));

/**
 * Simulate one five-node/four-link episode.
 *
 * Simplifying boundary: active intervals may touch at an endpoint but do not
 * overlap in their elementary-link span. Swaps use the frozen boundary priority
 * 1, 3, 2 from the post-generation snapshot, and newly swapped outputs cannot
 * cascade until the next slot. A successful composite inherits visibility but
 * its scheduling age resets to zero.
 */
export function simulateEpisode(input = {}, options = {}) {
  const config = normaliseConfig(input);
  const random = options.random ?? mulberry32(config.seed);
  let segments = [];
  const trace = [];
  const counters = { generated: 0, swapsAttempted: 0, swapsFailed: 0, discarded: 0 };
  const decay = Math.exp(-1 / config.memoryLifetime);

  for (let slot = 1; slot <= config.maxSlots; slot += 1) {
    const events = [];

    // 1. Age every pair that existed at the beginning of the slot.
    segments = segments.map((segment) => ({
      ...segment,
      age: segment.age + 1,
      visibility: segment.visibility * decay,
    }));
    events.push({ phase: "age", count: segments.length });

    // 2. Attempt every elementary gap not already covered by an active interval.
    const covered = (edge) => segments.some((segment) => segment.start <= edge && segment.end >= edge + 1);
    const generated = [];
    for (let edge = 0; edge < 4; edge += 1) {
      if (!covered(edge) && random() < config.generationProbability) {
        generated.push({ start: edge, end: edge + 1, age: 0, visibility: config.initialVisibility });
      }
    }
    segments.push(...generated);
    counters.generated += generated.length;
    events.push({ phase: "generate", links: generated.map(({ start, end }) => [start, end]) });

    // 3. Select disjoint adjacent pairs from the heralded post-generation state.
    segments.sort((a, b) => a.start - b.start || a.end - b.end);
    const selected = [];
    const used = new Set();
    for (const boundary of [1, 3, 2]) {
      const leftIndex = segments.findIndex((segment, index) => !used.has(index) && segment.end === boundary);
      const rightIndex = segments.findIndex((segment, index) => !used.has(index) && segment.start === boundary);
      if (leftIndex >= 0 && rightIndex >= 0 && leftIndex !== rightIndex) {
        const left = segments[leftIndex];
        const right = segments[rightIndex];
        selected.push({ leftIndex, rightIndex, left, right });
        used.add(leftIndex);
        used.add(rightIndex);
      }
    }
    events.push({
      phase: "select-swaps",
      pairs: selected.map(({ left, right }) => [[left.start, left.end], [right.start, right.end]]),
    });

    // 4. Resolve only those swaps; their outputs are not candidates this slot.
    const retained = segments.filter((_, index) => !used.has(index));
    const swapEvents = [];
    for (const { left, right } of selected) {
      counters.swapsAttempted += 1;
      const success = random() < config.swapProbability;
      if (success) {
        const output = {
          start: left.start,
          end: right.end,
          age: 0,
          visibility: config.swapQuality * left.visibility * right.visibility,
        };
        retained.push(output);
        swapEvents.push({ input: [[left.start, left.end], [right.start, right.end]], success: true, output: [output.start, output.end] });
      } else {
        counters.swapsFailed += 1;
        swapEvents.push({ input: [[left.start, left.end], [right.start, right.end]], success: false, output: null });
      }
    }
    segments = retained;
    events.push({ phase: "resolve-swaps", attempts: swapEvents });

    // 5. Apply the policy to incomplete intervals. Failed swaps have consumed inputs.
    const kept = [];
    const discarded = [];
    for (const segment of segments) {
      if (shouldDiscard(segment, config, random)) discarded.push([segment.start, segment.end]);
      else kept.push(segment);
    }
    segments = kept;
    counters.discarded += discarded.length;
    events.push({ phase: "discard", links: discarded });

    // 6. Delivery is observed only after all earlier phases have completed.
    const delivered = segments.find((segment) => segment.start === 0 && segment.end === 4);
    const delivery = delivered
      ? { delivered: true, fidelity: round(fidelityFromVisibility(delivered.visibility)), useful: fidelityFromVisibility(delivered.visibility) >= config.fidelityThreshold }
      : { delivered: false, fidelity: null, useful: false };
    events.push({ phase: "deliver", ...delivery });
    trace.push({ slot, events, state: snapshot(segments) });

    if (delivered) {
      return {
        config,
        delivered: true,
        censored: false,
        latency: slot,
        fidelity: delivery.fidelity,
        useful: delivery.useful,
        counters,
        trace,
      };
    }
  }

  return {
    config,
    delivered: false,
    censored: true,
    latency: config.maxSlots,
    fidelity: null,
    useful: false,
    counters,
    trace,
  };
}

export function summariseEpisodes(episodes) {
  if (!episodes.length) throw new Error("At least one episode is required.");
  const delivered = episodes.filter((episode) => episode.delivered);
  const latencies = episodes.map((episode) => episode.latency).sort((a, b) => a - b);
  const tailStart = Math.max(0, Math.floor(latencies.length * 0.95));
  const tail = latencies.slice(tailStart);
  const meanLatency = latencies.reduce((sum, value) => sum + value, 0) / latencies.length;
  const usefulProbability = episodes.filter((episode) => episode.useful).length / episodes.length;
  return Object.freeze({
    episodes: episodes.length,
    completionProbability: delivered.length / episodes.length,
    usefulProbability,
    usefulRate: usefulProbability / meanLatency,
    meanLatency,
    cvar95Latency: tail.reduce((sum, value) => sum + value, 0) / tail.length,
    meanFidelity: delivered.length
      ? delivered.reduce((sum, episode) => sum + episode.fidelity, 0) / delivered.length
      : null,
    censored: episodes.length - delivered.length,
    meanDiscards: episodes.reduce((sum, episode) => sum + episode.counters.discarded, 0) / episodes.length,
    meanSwapFailures: episodes.reduce((sum, episode) => sum + episode.counters.swapsFailed, 0) / episodes.length,
  });
}

export function runStudy(input = {}, episodes = 240) {
  const config = normaliseConfig(input);
  const runs = [];
  for (let index = 0; index < episodes; index += 1) {
    const seed = (config.seed + Math.imul(index + 1, 0x9e3779b1)) >>> 0;
    runs.push(simulateEpisode({ ...config, seed }));
  }
  return summariseEpisodes(runs);
}

export function comparePolicies(input = {}, episodes = 160) {
  const config = normaliseConfig(input);
  return POLICY_IDS.map((policy) => ({
    policy,
    ...runStudy({ ...config, policy }, episodes),
  }));
}
