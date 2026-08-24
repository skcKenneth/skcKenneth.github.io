import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { analyseMask } from "../src/lib/melt-pond-topology-model.mjs";

const fixtureUrl = new URL("../src/data/melt-pond-topology-parity.json", import.meta.url);
const document = JSON.parse(await readFile(fixtureUrl, "utf8"));

function decodeRows(rows) {
  assert.ok(rows.length > 0, "a parity fixture must have at least one row");
  const size = rows.length;
  assert.ok(rows.every((row) => row.length === size), "parity fixtures must be square");
  assert.ok(rows.every((row) => /^[01]+$/.test(row)), "parity fixtures must be binary");
  return Uint8Array.from(rows.join(""), (value) => Number(value));
}

test("the canonical Python/JavaScript topology parity document is well formed", () => {
  assert.equal(document.schema_version, 1);
  assert.deepEqual(document.connectivity, { pond: 4, ice: 8 });
  assert.equal(document.fixtures.length, 12);
  assert.equal(new Set(document.fixtures.map(({ id }) => id)).size, 12);
});

for (const fixture of document.fixtures) {
  test(`analyseMask reproduces the canonical ${fixture.id} topology summary`, () => {
    const mask = decodeRows(fixture.rows);
    const topology = analyseMask(mask, fixture.rows.length, "pond-4-ice-8");
    const actual = {
      pond_fraction: topology.pondFraction,
      beta0: topology.beta0,
      beta1: topology.beta1,
      euler: topology.chi,
      horizontal: topology.spanning.lr,
      vertical: topology.spanning.tb,
    };
    assert.deepEqual(actual, fixture.expected);
  });
}
