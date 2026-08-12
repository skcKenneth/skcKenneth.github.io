import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");

test("built teaching routes contain KaTeX and MathML for every audited static formula", async () => {
  const routes = [
    "teaching/macau-school-math-competition/index.html",
    "zh/teaching/macau-school-math-competition/index.html",
    "teaching/model-laboratory/index.html",
    "teaching/frontier-model-studio/index.html",
    "teaching/research-inquiry-studio/index.html",
    "teaching/quantum-repeater-lab/index.html",
    "zh/teaching/quantum-repeater-lab/index.html",
  ];

  for (const route of routes) {
    const output = await readFile(resolve(root, "dist", route), "utf8");
    assert.match(output, /<math/, `${route} has no MathML`);
    assert.match(output, /class="katex"/, `${route} has no KaTeX visual output`);
  }
});
