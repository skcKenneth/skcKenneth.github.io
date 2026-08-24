import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  GRID_SIZE,
  OPERATOR_ORDER,
  analyseMask,
  analyseMeltPondFixture,
  applyObservation,
  createLatentField,
  decodeFixtureField,
  summariseAnalysis,
} from "../src/lib/melt-pond-topology-model.mjs";

const fixtureUrl = new URL("../src/data/melt-pond-topology-fixtures.json", import.meta.url);
const fixtureDocument = JSON.parse(await readFile(fixtureUrl, "utf8"));

test("the language-neutral fixture contract contains twelve synthetic 96 x 96 fields", () => {
  assert.equal(fixtureDocument.schemaVersion, 1);
  assert.deepEqual(fixtureDocument.operatorOrder, OPERATOR_ORDER);
  assert.deepEqual(fixtureDocument.grid, {
    width: GRID_SIZE,
    height: GRID_SIZE,
    order: "row-major",
    pondRule: "rank_normalised_value <= waterLevel",
  });
  assert.equal(fixtureDocument.fixtures.length, 12);
  assert.equal(new Set(fixtureDocument.fixtures.map(({ id }) => id)).size, 12);
  assert.deepEqual(
    [...new Set(fixtureDocument.fixtures.map(({ family }) => family))].sort(),
    ["germ-grain", "ising-shift", "matern"],
  );
});

test("every encoded field has the declared length and SHA-256", () => {
  for (const fixture of fixtureDocument.fixtures) {
    const bytes = Buffer.from(fixture.field, "base64");
    assert.equal(bytes.length, GRID_SIZE * GRID_SIZE, fixture.id);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), fixture.fieldSha256, fixture.id);
    assert.equal(decodeFixtureField(fixture).length, GRID_SIZE * GRID_SIZE, fixture.id);
  }
});

test("all twelve parity summaries reproduce exactly", () => {
  for (const fixture of fixtureDocument.fixtures) {
    const actual = summariseAnalysis(analyseMeltPondFixture(fixture, fixture.parity.config));
    assert.deepEqual(actual, fixture.parity.expected, fixture.id);
  }
});

test("the identity observation operator preserves the latent mask and topology", () => {
  const fixture = fixtureDocument.fixtures[0];
  const analysis = analyseMeltPondFixture(fixture, {
    waterLevel: 0.43,
    correlation: 1.4,
    anisotropy: 1.25,
    blur: 0,
    resolution: 1,
    segmentationBias: 0,
    boundaryNoise: 0,
    connectivity: "pond-4-ice-8",
    seed: 812,
  });
  assert.deepEqual(analysis.observed.mask, analysis.latent.mask);
  assert.deepEqual(analysis.observed.topology, analysis.latent.topology);
});

test("signed segmentation displacement expands or erodes the observed mask monotonically", () => {
  const mask = new Uint8Array(GRID_SIZE * GRID_SIZE);
  mask[48 * GRID_SIZE + 48] = 1;
  const shared = { blur: 0, resolution: 1, boundaryNoise: 0, seed: 1 };
  const eroded = applyObservation(mask, "displacement-fixture", { ...shared, segmentationBias: -1 }).analysisMask;
  const identity = applyObservation(mask, "displacement-fixture", { ...shared, segmentationBias: 0 }).analysisMask;
  const dilated = applyObservation(mask, "displacement-fixture", { ...shared, segmentationBias: 1 }).analysisMask;
  for (let index = 0; index < mask.length; index += 1) {
    assert.ok(eroded[index] <= identity[index], `erosion violation at ${index}`);
    assert.ok(identity[index] <= dilated[index], `dilation violation at ${index}`);
  }
  assert.equal(identity.reduce((sum, value) => sum + value, 0), 1);
  assert.equal(eroded.reduce((sum, value) => sum + value, 0), 0);
  assert.equal(dilated.reduce((sum, value) => sum + value, 0), 9);
});

test("raising water level creates a nested latent filtration", () => {
  const fixture = fixtureDocument.fixtures[5];
  const shared = { correlation: 0.9, anisotropy: 1.4, seed: 4481 };
  const lower = createLatentField(fixture, { ...shared, waterLevel: 0.3 });
  const lowMask = Uint8Array.from(lower, (value) => value <= 0.3 ? 1 : 0);
  const highMask = Uint8Array.from(lower, (value) => value <= 0.7 ? 1 : 0);
  for (let index = 0; index < lowMask.length; index += 1) {
    assert.ok(lowMask[index] <= highMask[index], `filtration violation at ${index}`);
  }
  assert.ok(analyseMask(lowMask, GRID_SIZE).pondFraction < analyseMask(highMask, GRID_SIZE).pondFraction);
});

test("dual connectivity resolves diagonal ambiguity explicitly", () => {
  const diagonal = new Uint8Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ]);
  const fourEight = analyseMask(diagonal, 3, "pond-4-ice-8");
  const eightFour = analyseMask(diagonal, 3, "pond-8-ice-4");
  assert.equal(fourEight.beta0, 3);
  assert.equal(fourEight.spanning.any, false);
  assert.equal(eightFour.beta0, 1);
  assert.deepEqual(eightFour.spanning, { lr: true, tb: true, any: true, both: true });
});

test("Euler-Poincare bookkeeping counts one enclosed ice hole", () => {
  const ring = new Uint8Array(25).fill(1);
  ring[12] = 0;
  const topology = analyseMask(ring, 5, "pond-4-ice-8");
  assert.equal(topology.beta0, 1);
  assert.equal(topology.beta1, 1);
  assert.equal(topology.chi, 0);
  assert.equal(topology.spanning.both, true);
});

test("a known three-pixel corridor has a finite widest-path throat", () => {
  const mask = new Uint8Array(9 * 9);
  for (let y = 3; y <= 5; y += 1) {
    for (let x = 0; x < 9; x += 1) mask[y * 9 + x] = 1;
  }
  const topology = analyseMask(mask, 9, "pond-4-ice-8");
  assert.equal(topology.spanning.lr, true);
  assert.equal(topology.spanning.tb, false);
  assert.equal(topology.resolvableThroat.lr, 2);
  assert.equal(topology.resolvableThroat.tb, null);
  assert.equal(topology.resolvableThroat.maximum, null);
});

test("the both-direction throat is limited by the narrower directional path", () => {
  const mask = new Uint8Array(9 * 9);
  for (let y = 3; y <= 5; y += 1) {
    for (let x = 0; x < 9; x += 1) mask[y * 9 + x] = 1;
  }
  for (let y = 0; y < 9; y += 1) mask[y * 9 + 4] = 1;
  const topology = analyseMask(mask, 9, "pond-4-ice-8");
  assert.equal(topology.spanning.both, true);
  assert.equal(topology.resolvableThroat.lr, 2);
  assert.equal(topology.resolvableThroat.tb, 1);
  assert.equal(topology.resolvableThroat.maximum, 1);
});

test("seeded analyses are deterministic without a PRNG parity claim", () => {
  const fixture = fixtureDocument.fixtures[10];
  const config = { ...fixtureDocument.defaultConfig, seed: 991827, boundaryNoise: 0.12 };
  assert.deepEqual(
    summariseAnalysis(analyseMeltPondFixture(fixture, config)),
    summariseAnalysis(analyseMeltPondFixture(fixture, config)),
  );
});
