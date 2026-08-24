import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";

import {
  GRID_SIZE,
  OPERATOR_ORDER,
  analyseMeltPondFixture,
  gaussianBlur,
  summariseAnalysis,
} from "../src/lib/melt-pond-topology-model.mjs";

const outputUrl = new URL("../src/data/melt-pond-topology-fixtures.json", import.meta.url);

function mulberry32(seed) {
  let state = Number(seed) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normalise(values) {
  let minimum = Infinity;
  let maximum = -Infinity;
  for (const value of values) {
    minimum = Math.min(minimum, value);
    maximum = Math.max(maximum, value);
  }
  const scale = maximum > minimum ? 1 / (maximum - minimum) : 1;
  return Float64Array.from(values, (value) => (value - minimum) * scale);
}

function gaussianField(seed, scale, anisotropy, roughness) {
  const random = mulberry32(seed);
  const noise = Float64Array.from({ length: GRID_SIZE * GRID_SIZE }, () => random() * 2 - 1);
  const detail = Float64Array.from({ length: noise.length }, () => random() * 2 - 1);
  const root = Math.sqrt(anisotropy);
  const broad = gaussianBlur(noise, GRID_SIZE, scale * root, scale / root, { wrap: true });
  const fine = gaussianBlur(detail, GRID_SIZE, Math.max(0.5, scale / 3), Math.max(0.5, scale / 3), { wrap: true });
  return normalise(Float64Array.from(broad, (value, index) => value + roughness * fine[index]));
}

function periodicDelta(left, right) {
  const direct = Math.abs(left - right);
  return Math.min(direct, GRID_SIZE - direct);
}

function germGrainField(seed, count, elongation, sizeScale) {
  const random = mulberry32(seed);
  const grains = Array.from({ length: count }, () => {
    const major = sizeScale * (0.65 + 0.9 * random());
    return {
      x: random() * GRID_SIZE,
      y: random() * GRID_SIZE,
      a: major * Math.sqrt(elongation),
      b: major / Math.sqrt(elongation),
      angle: random() * Math.PI,
      offset: 0.12 * (random() - 0.5),
    };
  });
  const field = new Float64Array(GRID_SIZE * GRID_SIZE);
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      let nearest = Infinity;
      for (const grain of grains) {
        const dx0 = periodicDelta(x, grain.x);
        const dy0 = periodicDelta(y, grain.y);
        const dx = x < grain.x ? -dx0 : dx0;
        const dy = y < grain.y ? -dy0 : dy0;
        const c = Math.cos(grain.angle);
        const s = Math.sin(grain.angle);
        const u = c * dx + s * dy;
        const v = -s * dx + c * dy;
        nearest = Math.min(nearest, Math.hypot(u / grain.a, v / grain.b) + grain.offset);
      }
      field[y * GRID_SIZE + x] = nearest;
    }
  }
  return normalise(field);
}

function isingField(seed, temperature, randomFieldStrength, directionalBias) {
  const random = mulberry32(seed);
  let spins = Float64Array.from({ length: GRID_SIZE * GRID_SIZE }, () => random() < 0.5 ? -1 : 1);
  const disorder = Float64Array.from({ length: spins.length }, () => (random() * 2 - 1) * randomFieldStrength);
  for (let iteration = 0; iteration < 28; iteration += 1) {
    const next = new Float64Array(spins.length);
    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const left = spins[y * GRID_SIZE + (x - 1 + GRID_SIZE) % GRID_SIZE];
        const right = spins[y * GRID_SIZE + (x + 1) % GRID_SIZE];
        const up = spins[((y - 1 + GRID_SIZE) % GRID_SIZE) * GRID_SIZE + x];
        const down = spins[((y + 1) % GRID_SIZE) * GRID_SIZE + x];
        const horizontal = (left + right) * directionalBias;
        const vertical = (up + down) / directionalBias;
        const index = y * GRID_SIZE + x;
        next[index] = Math.tanh((0.55 * spins[index] + 0.31 * (horizontal + vertical) + disorder[index]) / temperature);
      }
    }
    spins = next;
  }
  const texture = Float64Array.from({ length: spins.length }, () => random() * 2 - 1);
  const smoothTexture = gaussianBlur(texture, GRID_SIZE, 1.1, 1.1, { wrap: true });
  return normalise(Float64Array.from(spins, (value, index) => value + 0.22 * smoothTexture[index]));
}

function toBytes(values) {
  return Uint8Array.from(values, (value) => Math.max(0, Math.min(255, Math.round(value * 255))));
}

const specifications = [
  ["matern-broad-isotropic", "matern", "Broad isotropic basins", "寬闊各向同性盆地", "Smooth, rounded basins with a long correlation scale.", "長相關尺度下形成平滑而圓鈍的盆地。", () => gaussianField(1103, 7.2, 1, 0.18)],
  ["matern-fine-isotropic", "matern", "Fine isotropic texture", "細緻各向同性紋理", "Shorter correlation length with more small components.", "較短相關尺度帶來更多細小連通分量。", () => gaussianField(2197, 3.4, 1, 0.34)],
  ["matern-horizontal-ridges", "matern", "Horizontal ridges", "水平脊紋", "An anisotropic field that favours horizontal corridors.", "傾向形成水平走廊的各向異性場。", () => gaussianField(3301, 6.2, 2.6, 0.2)],
  ["matern-vertical-ridges", "matern", "Vertical ridges", "垂直脊紋", "The rotated directional counterpart of the ridge fixture.", "脊紋 fixture 的垂直方向對照。", () => gaussianField(4421, 6.2, 0.38, 0.2)],
  ["germ-grain-sparse-round", "germ-grain", "Sparse round ponds", "稀疏圓形融池", "Separated round grains that merge only at high water level.", "彼此分離的圓形顆粒，只在較高水位合併。", () => germGrainField(5527, 20, 1, 5.2)],
  ["germ-grain-dense-round", "germ-grain", "Dense coalescing ponds", "密集合併融池", "A denser Boolean germ-grain field close to coalescence.", "接近合併狀態的高密度 Boolean germ-grain 場。", () => germGrainField(6637, 42, 1, 4.7)],
  ["germ-grain-horizontal", "germ-grain", "Elongated horizontal ponds", "水平拉長融池", "Elliptical grains create direction-dependent connectivity.", "橢圓顆粒造成方向相關的連通性。", () => germGrainField(7741, 30, 3.2, 5.1)],
  ["germ-grain-mixed-scale", "germ-grain", "Mixed-scale coalescence", "混合尺度合併", "Irregular throat widths expose resolution-sensitive bridges.", "不規則喉道寬度揭示對解析度敏感的橋接。", () => {
    const coarse = germGrainField(8849, 19, 1.8, 7.1);
    const fine = germGrainField(8851, 38, 0.75, 3.1);
    return normalise(Float64Array.from(coarse, (value, index) => Math.min(value, 0.74 * fine[index] + 0.12)));
  }],
  ["ising-cool-clusters", "ising-shift", "Cool clustered domains", "低溫群聚區域", "Large domains after low-temperature deterministic relaxation.", "低溫確定性鬆弛後形成的大型區域。", () => isingField(9967, 0.62, 0.72, 1)],
  ["ising-warm-fragments", "ising-shift", "Warm fragmented domains", "高溫碎裂區域", "A warmer relaxation leaves a fragmented morphology.", "較高溫鬆弛保留更碎裂的形態。", () => isingField(10103, 1.08, 1.15, 1)],
  ["ising-horizontal-shift", "ising-shift", "Directional domain shift", "方向性區域偏移", "Horizontal coupling creates an unseen anisotropic morphology shift.", "水平耦合造成未參與調校的各向異性形態偏移。", () => isingField(11213, 0.78, 0.92, 1.55)],
  ["ising-disordered-shift", "ising-shift", "Disordered morphology shift", "無序形態偏移", "Stronger quenched disorder supplies a difficult held-out-style fixture.", "較強凍結無序形成更困難的 held-out 風格 fixture。", () => isingField(12323, 0.88, 1.55, 0.82)],
];

const defaultConfig = {
  waterLevel: 0.46,
  correlation: 1.2,
  anisotropy: 1,
  blur: 0.8,
  resolution: 3,
  segmentationBias: 0,
  boundaryNoise: 0.02,
  connectivity: "pond-4-ice-8",
  seed: 240824,
};

const fixtures = specifications.map(([id, family, labelEn, labelZh, descriptionEn, descriptionZh, build], index) => {
  const bytes = toBytes(build());
  const fixture = {
    id,
    family,
    labelEn,
    labelZh,
    descriptionEn,
    descriptionZh,
    size: GRID_SIZE,
    encoding: "base64-uint8-row-major",
    fieldSha256: createHash("sha256").update(bytes).digest("hex"),
    field: Buffer.from(bytes).toString("base64"),
  };
  const parityConfig = { ...defaultConfig, seed: 240824 + index * 97 };
  return {
    ...fixture,
    parity: {
      config: parityConfig,
      expected: summariseAnalysis(analyseMeltPondFixture(fixture, parityConfig)),
    },
  };
});

const document = {
  schemaVersion: 1,
  description: "Twelve deterministic, synthetic 96 x 96 scalar-field fixtures for Python/JavaScript topology parity. No observational pixels are included.",
  grid: { width: GRID_SIZE, height: GRID_SIZE, order: "row-major", pondRule: "rank_normalised_value <= waterLevel" },
  fieldEncoding: "base64-uint8-row-major",
  operatorOrder: OPERATOR_ORDER,
  boundaryNoiseHash: "mix32(seed XOR fnv1a(fixtureId) XOR imul(index + 1, 0x9e3779b1)) / 2^32",
  connectivity: {
    default: "pond-4-ice-8",
    alternative: "pond-8-ice-4",
    beta1Rule: "complementary ice components that do not touch the image boundary",
  },
  defaultConfig,
  fixtures,
};

await writeFile(outputUrl, `${JSON.stringify(document, null, 2)}\n`, "utf8");
console.log(`Wrote ${fixtures.length} fixtures to ${outputUrl.pathname}`);
