/**
 * Deterministic teaching-scale melt-pond topology model.
 *
 * The browser consumes pre-generated 96 x 96 scalar fields. The fixture file
 * deliberately uses a language-neutral, base64 encoded uint8 row-major format
 * so the same fields and operator order can be replayed by the private Python
 * research pipeline without requiring cross-language PRNG parity.
 */

export const GRID_SIZE = 96;

export const OPERATOR_ORDER = Object.freeze([
  "fixture-decode",
  "seeded-periodic-transform",
  "latent-anisotropic-smoothing",
  "rank-normalise",
  "water-level-threshold",
  "psf-blur",
  "block-average",
  "segmentation-boundary-displacement",
  "boundary-noise",
  "nearest-expand-for-display",
]);

export const CONNECTIVITY_IDS = Object.freeze([
  "pond-4-ice-8",
  "pond-8-ice-4",
]);

export const RESOLUTION_FACTORS = Object.freeze([1, 2, 3, 4, 6, 8, 12]);

const DEFAULTS = Object.freeze({
  waterLevel: 0.46,
  correlation: 1.2,
  anisotropy: 1,
  blur: 0.8,
  resolution: 3,
  segmentationBias: 0,
  boundaryNoise: 0.02,
  connectivity: "pond-4-ice-8",
  seed: 240824,
});

const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const round = (value, digits = 4) => value == null ? null : Number(Number(value).toFixed(digits));

export function normaliseLabConfig(input = {}) {
  const config = { ...DEFAULTS, ...input };
  const requestedResolution = Math.round(Number(config.resolution));
  const resolution = RESOLUTION_FACTORS.includes(requestedResolution) ? requestedResolution : DEFAULTS.resolution;
  return Object.freeze({
    waterLevel: clamp(Number(config.waterLevel), 0.05, 0.95),
    correlation: clamp(Number(config.correlation), 0, 4),
    anisotropy: clamp(Number(config.anisotropy), 0.5, 2),
    blur: clamp(Number(config.blur), 0, 4),
    resolution,
    segmentationBias: clamp(Math.round(Number(config.segmentationBias)), -2, 2),
    boundaryNoise: clamp(Number(config.boundaryNoise), 0, 0.25),
    connectivity: CONNECTIVITY_IDS.includes(config.connectivity) ? config.connectivity : DEFAULTS.connectivity,
    seed: Number(config.seed) >>> 0,
  });
}

function base64ToBytes(encoded) {
  if (typeof encoded !== "string" || encoded.length === 0) {
    throw new Error("A fixture field must be a non-empty base64 string.");
  }
  const binary = globalThis.atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export function decodeFixtureField(fixture) {
  const size = Number(fixture?.size ?? GRID_SIZE);
  if (size !== GRID_SIZE) throw new Error(`Fixture ${fixture?.id ?? "unknown"} must be ${GRID_SIZE} x ${GRID_SIZE}.`);
  if (fixture?.encoding !== "base64-uint8-row-major") {
    throw new Error(`Unsupported fixture encoding: ${fixture?.encoding ?? "missing"}.`);
  }
  const bytes = base64ToBytes(fixture.field);
  if (bytes.length !== size * size) {
    throw new Error(`Fixture ${fixture.id} decoded to ${bytes.length} cells; expected ${size * size}.`);
  }
  const field = new Float64Array(bytes.length);
  for (let index = 0; index < bytes.length; index += 1) field[index] = bytes[index] / 255;
  return field;
}

export function mixUint32(value) {
  let mixed = Number(value) >>> 0;
  mixed = Math.imul(mixed ^ (mixed >>> 16), 0x7feb352d);
  mixed = Math.imul(mixed ^ (mixed >>> 15), 0x846ca68b);
  return (mixed ^ (mixed >>> 16)) >>> 0;
}

export function hashString(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < String(value).length; index += 1) {
    hash ^= String(value).charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function transformField(field, size, seed) {
  const a = mixUint32(seed ^ 0xa341316c);
  const b = mixUint32(seed ^ 0xc8013ea4);
  const dx = a % size;
  const dy = b % size;
  const mirrorX = Boolean(a & 0x10000);
  const mirrorY = Boolean(b & 0x20000);
  const transformed = new Float64Array(field.length);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let sourceX = (x + dx) % size;
      let sourceY = (y + dy) % size;
      if (mirrorX) sourceX = size - 1 - sourceX;
      if (mirrorY) sourceY = size - 1 - sourceY;
      transformed[y * size + x] = field[sourceY * size + sourceX];
    }
  }
  return transformed;
}

function gaussianKernel(sigma) {
  if (sigma <= 0.05) return new Float64Array([1]);
  const radius = Math.max(1, Math.ceil(sigma * 3));
  const kernel = new Float64Array(radius * 2 + 1);
  let sum = 0;
  for (let offset = -radius; offset <= radius; offset += 1) {
    const weight = Math.exp(-(offset * offset) / (2 * sigma * sigma));
    kernel[offset + radius] = weight;
    sum += weight;
  }
  for (let index = 0; index < kernel.length; index += 1) kernel[index] /= sum;
  return kernel;
}

function blurAxis(values, size, kernel, horizontal, wrap) {
  if (kernel.length === 1) return values.slice();
  const radius = (kernel.length - 1) / 2;
  const output = new Float64Array(values.length);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let total = 0;
      for (let offset = -radius; offset <= radius; offset += 1) {
        let sampleX = horizontal ? x + offset : x;
        let sampleY = horizontal ? y : y + offset;
        if (wrap) {
          sampleX = (sampleX + size) % size;
          sampleY = (sampleY + size) % size;
        } else {
          sampleX = clamp(sampleX, 0, size - 1);
          sampleY = clamp(sampleY, 0, size - 1);
        }
        total += values[sampleY * size + sampleX] * kernel[offset + radius];
      }
      output[y * size + x] = total;
    }
  }
  return output;
}

export function gaussianBlur(values, size, sigmaX, sigmaY = sigmaX, { wrap = false } = {}) {
  const horizontal = blurAxis(values, size, gaussianKernel(sigmaX), true, wrap);
  return blurAxis(horizontal, size, gaussianKernel(sigmaY), false, wrap);
}

function rankNormalise(values) {
  const order = Array.from({ length: values.length }, (_, index) => index);
  order.sort((left, right) => values[left] - values[right] || left - right);
  const ranked = new Float64Array(values.length);
  const denominator = Math.max(1, values.length - 1);
  for (let rank = 0; rank < order.length; rank += 1) ranked[order[rank]] = rank / denominator;
  return ranked;
}

function thresholdField(values, threshold) {
  const mask = new Uint8Array(values.length);
  for (let index = 0; index < values.length; index += 1) mask[index] = values[index] <= threshold ? 1 : 0;
  return mask;
}

function thresholdWaterProbability(values, threshold) {
  const mask = new Uint8Array(values.length);
  for (let index = 0; index < values.length; index += 1) mask[index] = values[index] >= threshold ? 1 : 0;
  return mask;
}

function blockAverage(values, size, factor) {
  const coarseSize = size / factor;
  const coarse = new Float64Array(coarseSize * coarseSize);
  const denominator = factor * factor;
  for (let coarseY = 0; coarseY < coarseSize; coarseY += 1) {
    for (let coarseX = 0; coarseX < coarseSize; coarseX += 1) {
      let sum = 0;
      for (let localY = 0; localY < factor; localY += 1) {
        for (let localX = 0; localX < factor; localX += 1) {
          sum += values[(coarseY * factor + localY) * size + coarseX * factor + localX];
        }
      }
      coarse[coarseY * coarseSize + coarseX] = sum / denominator;
    }
  }
  return { values: coarse, size: coarseSize };
}

function displaceScalarBoundary(values, size, displacement) {
  const radius = Math.abs(Math.trunc(displacement));
  if (radius === 0) return values.slice();
  const dilate = displacement > 0;
  const output = new Float64Array(values.length);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let selected = dilate ? -Infinity : Infinity;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const sampleX = clamp(x + dx, 0, size - 1);
          const sampleY = clamp(y + dy, 0, size - 1);
          const value = values[sampleY * size + sampleX];
          selected = dilate ? Math.max(selected, value) : Math.min(selected, value);
        }
      }
      output[y * size + x] = selected;
    }
  }
  return output;
}

function boundaryCells(mask, size) {
  const boundary = new Uint8Array(mask.length);
  const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = y * size + x;
      for (const [dx, dy] of offsets) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= size || ny < 0 || ny >= size || mask[ny * size + nx] !== mask[index]) {
          boundary[index] = 1;
          break;
        }
      }
    }
  }
  return boundary;
}

function applyBoundaryNoise(mask, size, probability, seed, fixtureId) {
  if (probability <= 0) return mask.slice();
  const output = mask.slice();
  const boundary = boundaryCells(mask, size);
  const fixtureHash = hashString(fixtureId);
  for (let index = 0; index < mask.length; index += 1) {
    if (!boundary[index]) continue;
    const draw = mixUint32(seed ^ fixtureHash ^ Math.imul(index + 1, 0x9e3779b1)) / 4294967296;
    if (draw < probability) output[index] = mask[index] ? 0 : 1;
  }
  return output;
}

function expandNearest(mask, coarseSize, factor) {
  if (factor === 1) return mask.slice();
  const size = coarseSize * factor;
  const expanded = new Uint8Array(size * size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) expanded[y * size + x] = mask[Math.floor(y / factor) * coarseSize + Math.floor(x / factor)];
  }
  return expanded;
}

function offsetsFor(connectivity) {
  const cardinal = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  if (connectivity === 4) return cardinal;
  return [...cardinal, [1, 1], [1, -1], [-1, 1], [-1, -1]];
}

function componentSummary(mask, size, target, connectivity) {
  const seen = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  const offsets = offsetsFor(connectivity);
  let count = 0;
  let holes = 0;
  let lr = false;
  let tb = false;
  for (let start = 0; start < mask.length; start += 1) {
    if (seen[start] || mask[start] !== target) continue;
    count += 1;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    seen[start] = 1;
    let left = false;
    let right = false;
    let top = false;
    let bottom = false;
    while (head < tail) {
      const current = queue[head++];
      const x = current % size;
      const y = Math.floor(current / size);
      left ||= x === 0;
      right ||= x === size - 1;
      top ||= y === 0;
      bottom ||= y === size - 1;
      for (const [dx, dy] of offsets) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
        const next = ny * size + nx;
        if (!seen[next] && mask[next] === target) {
          seen[next] = 1;
          queue[tail++] = next;
        }
      }
    }
    lr ||= left && right;
    tb ||= top && bottom;
    if (target === 0 && !(left || right || top || bottom)) holes += 1;
  }
  return { count, holes, lr, tb };
}

function boundaryFractalDimension(mask, size) {
  const boundary = boundaryCells(mask, size);
  const scales = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32].filter((scale) => scale <= size / 2);
  const points = [];
  for (const scale of scales) {
    let occupied = 0;
    for (let y0 = 0; y0 < size; y0 += scale) {
      for (let x0 = 0; x0 < size; x0 += scale) {
        let found = false;
        for (let y = y0; y < Math.min(size, y0 + scale) && !found; y += 1) {
          for (let x = x0; x < Math.min(size, x0 + scale); x += 1) {
            if (boundary[y * size + x]) {
              found = true;
              break;
            }
          }
        }
        if (found) occupied += 1;
      }
    }
    if (occupied > 0) points.push([Math.log(size / scale), Math.log(occupied)]);
  }
  if (points.length < 2) return null;
  const meanX = points.reduce((sum, point) => sum + point[0], 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point[1], 0) / points.length;
  let numerator = 0;
  let denominator = 0;
  for (const [x, y] of points) {
    numerator += (x - meanX) * (y - meanY);
    denominator += (x - meanX) ** 2;
  }
  return denominator === 0 ? null : clamp(numerator / denominator, 0, 2);
}

function squaredDistanceTransform1d(values) {
  const length = values.length;
  const output = new Float64Array(length);
  const sites = new Int32Array(length);
  const boundaries = new Float64Array(length + 1);
  let k = 0;
  sites[0] = 0;
  boundaries[0] = -Infinity;
  boundaries[1] = Infinity;
  for (let q = 1; q < length; q += 1) {
    let separation = ((values[q] + q * q) - (values[sites[k]] + sites[k] * sites[k])) / (2 * q - 2 * sites[k]);
    while (separation <= boundaries[k]) {
      k -= 1;
      separation = ((values[q] + q * q) - (values[sites[k]] + sites[k] * sites[k])) / (2 * q - 2 * sites[k]);
    }
    k += 1;
    sites[k] = q;
    boundaries[k] = separation;
    boundaries[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < length; q += 1) {
    while (boundaries[k + 1] < q) k += 1;
    output[q] = (q - sites[k]) ** 2 + values[sites[k]];
  }
  return output;
}

function squaredEuclideanDistanceToIce(mask, size) {
  const big = size * size * 16;
  const horizontal = new Float64Array(mask.length);
  for (let y = 0; y < size; y += 1) {
    const row = new Float64Array(size);
    for (let x = 0; x < size; x += 1) row[x] = mask[y * size + x] ? big : 0;
    horizontal.set(squaredDistanceTransform1d(row), y * size);
  }
  const distance = new Float64Array(mask.length);
  for (let x = 0; x < size; x += 1) {
    const column = new Float64Array(size);
    for (let y = 0; y < size; y += 1) column[y] = horizontal[y * size + x];
    const transformed = squaredDistanceTransform1d(column);
    for (let y = 0; y < size; y += 1) distance[y * size + x] = Math.min(transformed[y], size * size);
  }
  return distance;
}

class MaxHeap {
  constructor() { this.items = []; }
  push(score, index) {
    const item = [score, index];
    this.items.push(item);
    let child = this.items.length - 1;
    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      if (this.items[parent][0] >= score) break;
      this.items[child] = this.items[parent];
      child = parent;
    }
    this.items[child] = item;
  }
  pop() {
    if (!this.items.length) return null;
    const first = this.items[0];
    const last = this.items.pop();
    if (this.items.length) {
      let parent = 0;
      while (true) {
        const left = parent * 2 + 1;
        const right = left + 1;
        if (left >= this.items.length) break;
        const child = right < this.items.length && this.items[right][0] > this.items[left][0] ? right : left;
        if (this.items[child][0] <= last[0]) break;
        this.items[parent] = this.items[child];
        parent = child;
      }
      this.items[parent] = last;
    }
    return first;
  }
}

function widestSpanningThroat(mask, size, connectivity, direction) {
  const distance = squaredEuclideanDistanceToIce(mask, size);
  const best = new Float64Array(mask.length);
  const heap = new MaxHeap();
  const starts = direction === "lr"
    ? Array.from({ length: size }, (_, y) => y * size)
    : Array.from({ length: size }, (_, x) => x);
  for (const index of starts) {
    if (!mask[index]) continue;
    best[index] = distance[index];
    heap.push(best[index], index);
  }
  const offsets = offsetsFor(connectivity);
  while (heap.items.length) {
    const [score, current] = heap.pop();
    if (score < best[current]) continue;
    const x = current % size;
    const y = Math.floor(current / size);
    if ((direction === "lr" && x === size - 1) || (direction === "tb" && y === size - 1)) {
      // Match the research diagnostic: report the maximum admissible EDT
      // radius, not the corresponding full channel diameter.
      return Math.min(size, Math.sqrt(score));
    }
    for (const [dx, dy] of offsets) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
      const next = ny * size + nx;
      if (!mask[next]) continue;
      const candidate = Math.min(score, distance[next]);
      if (candidate > best[next]) {
        best[next] = candidate;
        heap.push(candidate, next);
      }
    }
  }
  return null;
}

export function analyseMask(maskInput, size, connectivityId = DEFAULTS.connectivity) {
  const mask = maskInput instanceof Uint8Array ? maskInput : Uint8Array.from(maskInput, (value) => value ? 1 : 0);
  if (mask.length !== size * size) throw new Error(`Mask contains ${mask.length} cells; expected ${size * size}.`);
  const pondConnectivity = connectivityId === "pond-8-ice-4" ? 8 : 4;
  const iceConnectivity = pondConnectivity === 4 ? 8 : 4;
  const pond = componentSummary(mask, size, 1, pondConnectivity);
  const ice = componentSummary(mask, size, 0, iceConnectivity);
  const pondCount = mask.reduce((sum, value) => sum + value, 0);
  const lrThroat = pond.lr ? widestSpanningThroat(mask, size, pondConnectivity, "lr") : null;
  const tbThroat = pond.tb ? widestSpanningThroat(mask, size, pondConnectivity, "tb") : null;
  return {
    pondFraction: pondCount / mask.length,
    beta0: pond.count,
    beta1: ice.holes,
    chi: pond.count - ice.holes,
    spanning: { lr: pond.lr, tb: pond.tb, any: pond.lr || pond.tb, both: pond.lr && pond.tb },
    fractalDimension: boundaryFractalDimension(mask, size),
    resolvableThroat: {
      lr: lrThroat,
      tb: tbThroat,
      // A path must remain resolvable in both declared directions.  The
      // limiting radius is therefore the smaller of the two directional
      // bottlenecks; a one-direction-only span has no both-direction throat.
      maximum: lrThroat == null || tbThroat == null ? null : Math.min(lrThroat, tbThroat),
    },
  };
}

export function createLatentField(fixture, input = {}) {
  const config = normaliseLabConfig(input);
  const decoded = decodeFixtureField(fixture);
  const transformed = transformField(decoded, GRID_SIZE, config.seed);
  const rootAnisotropy = Math.sqrt(config.anisotropy);
  const smoothed = gaussianBlur(
    transformed,
    GRID_SIZE,
    config.correlation * rootAnisotropy,
    config.correlation / rootAnisotropy,
    { wrap: true },
  );
  return rankNormalise(smoothed);
}

export function applyObservation(latentMask, fixtureId, input = {}) {
  const config = normaliseLabConfig(input);
  const floatingMask = Float64Array.from(latentMask);
  const blurred = gaussianBlur(floatingMask, GRID_SIZE, config.blur, config.blur, { wrap: false });
  const coarse = blockAverage(blurred, GRID_SIZE, config.resolution);
  // This mirrors the frozen research operator: positive values apply a
  // square-footprint greyscale dilation and negative values an erosion on the
  // observed scalar grid. Thresholding any displaced scalar field at 0.5 is
  // therefore exactly the corresponding binary boundary displacement.
  const displaced = displaceScalarBoundary(coarse.values, coarse.size, config.segmentationBias);
  const segmented = thresholdWaterProbability(displaced, 0.5);
  const noisy = applyBoundaryNoise(segmented, coarse.size, config.boundaryNoise, config.seed, fixtureId);
  return {
    analysisMask: noisy,
    analysisSize: coarse.size,
    displayMask: expandNearest(noisy, coarse.size, config.resolution),
  };
}

export function analyseMeltPondFixture(fixture, input = {}) {
  const config = normaliseLabConfig(input);
  const scalarField = createLatentField(fixture, config);
  const latentMask = thresholdField(scalarField, config.waterLevel);
  const observed = applyObservation(latentMask, fixture.id, config);
  const latentTopology = analyseMask(latentMask, GRID_SIZE, config.connectivity);
  const observedTopology = analyseMask(observed.analysisMask, observed.analysisSize, config.connectivity);
  const scale = config.resolution;
  const scaledThroat = {
    lr: observedTopology.resolvableThroat.lr == null ? null : observedTopology.resolvableThroat.lr * scale,
    tb: observedTopology.resolvableThroat.tb == null ? null : observedTopology.resolvableThroat.tb * scale,
    maximum: observedTopology.resolvableThroat.maximum == null ? null : observedTopology.resolvableThroat.maximum * scale,
  };
  return {
    schemaVersion: 1,
    fixtureId: fixture.id,
    operatorOrder: OPERATOR_ORDER,
    config,
    latent: { mask: latentMask, size: GRID_SIZE, topology: latentTopology },
    observed: {
      mask: observed.displayMask,
      analysisMask: observed.analysisMask,
      size: GRID_SIZE,
      analysisSize: observed.analysisSize,
      topology: { ...observedTopology, resolvableThroat: scaledThroat },
    },
  };
}

function serialiseTopology(topology) {
  return {
    pondFraction: round(topology.pondFraction, 6),
    beta0: topology.beta0,
    beta1: topology.beta1,
    chi: topology.chi,
    spanning: { ...topology.spanning },
    fractalDimension: round(topology.fractalDimension, 6),
    resolvableThroat: {
      lr: round(topology.resolvableThroat.lr, 6),
      tb: round(topology.resolvableThroat.tb, 6),
      maximum: round(topology.resolvableThroat.maximum, 6),
    },
  };
}

export function summariseAnalysis(analysis) {
  return {
    fixtureId: analysis.fixtureId,
    config: { ...analysis.config },
    latent: serialiseTopology(analysis.latent.topology),
    observed: serialiseTopology(analysis.observed.topology),
    deltas: {
      pondFraction: round(analysis.observed.topology.pondFraction - analysis.latent.topology.pondFraction, 6),
      beta0: analysis.observed.topology.beta0 - analysis.latent.topology.beta0,
      beta1: analysis.observed.topology.beta1 - analysis.latent.topology.beta1,
      chi: analysis.observed.topology.chi - analysis.latent.topology.chi,
    },
  };
}
