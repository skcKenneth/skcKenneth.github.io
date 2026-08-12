import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");

const corePages = [
  "src/components/MacauCompetitionArchive.astro",
  "src/pages/teaching/model-laboratory.astro",
  "src/pages/teaching/frontier-model-studio.astro",
  "src/pages/teaching/research-inquiry-studio.astro",
  "src/pages/teaching/quantum-repeater-lab.astro",
  "src/pages/zh/teaching/quantum-repeater-lab.astro",
];

test("shared math component builds KaTeX visual and MathML output from TeX", async () => {
  const source = await read("src/components/MathExpression.astro");
  assert.match(source, /renderToString\(expression/);
  assert.match(source, /output:\s*["']htmlAndMathml["']/);
  assert.match(source, /throwOnError:\s*true/);
});

test("all audited teaching formula surfaces use the shared TeX component", async () => {
  for (const path of corePages) {
    const source = await read(path);
    assert.match(source, /MathExpression/, `${path} does not use MathExpression`);
    assert.doesNotMatch(source, /<p class="(?:mc-math|model-equation)"/, `${path} still contains a text-only equation block`);
  }
});

test("interactive recovered equations are generated as semantic MathML rather than Unicode pseudo-math", async () => {
  const source = await read("src/pages/teaching/frontier-model-studio.astro");
  assert.match(source, /document\.createElementNS\(ns, "math"\)/);
  assert.match(source, /document\.createElementNS\(ns, "msup"\)/);
  assert.match(source, /equationMetric\.replaceChildren\(recoveredMath\)/);
});
