/** Convert the approved C PNG silhouette into vector paths and website icons.
 * Run: node scripts/generate-woven-icon.mjs
 * Uses the sharp dependency already installed by Astro; no network calls.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const sharp = createRequire(import.meta.resolve('astro/package.json'))('sharp');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'design/icon-refresh/concept-c-refined.png'));
const sourceHash = createHash('sha256').update(source).digest('hex');
const { data: alpha, info: { width, height } } = await sharp(source)
  .ensureAlpha().extractChannel('alpha').raw().toBuffer({ resolveWithObject: true });
const filled = (x, y) => x >= 0 && y >= 0 && x < width && y < height && alpha[y * width + x] >= 128;
const edges = [];
const outgoing = new Map();
const vertex = (x, y) => y * (width + 1) + x;
function addEdge(x, y, nx, ny, direction) {
  const start = vertex(x, y);
  const id = edges.length;
  edges.push({ start, end: vertex(nx, ny), direction, used: false });
  if (!outgoing.has(start)) outgoing.set(start, []);
  outgoing.get(start).push(id);
}

// Trace the union of foreground pixels, keeping foreground on the right.
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (!filled(x, y)) continue;
    if (!filled(x, y - 1)) addEdge(x, y, x + 1, y, 0);
    if (!filled(x + 1, y)) addEdge(x + 1, y, x + 1, y + 1, 1);
    if (!filled(x, y + 1)) addEdge(x + 1, y + 1, x, y + 1, 2);
    if (!filled(x - 1, y)) addEdge(x, y + 1, x, y, 3);
  }
}

function simplify(points, tolerance = 0.9) {
  if (points.length <= 2) return points;
  const [ax, ay] = points[0], [bx, by] = points.at(-1);
  const dx = bx - ax, dy = by - ay, denominator = dx * dx + dy * dy;
  let maxDistance = tolerance * tolerance, split = -1;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const t = denominator ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / denominator)) : 0;
    const distance = (px - ax - t * dx) ** 2 + (py - ay - t * dy) ** 2;
    if (distance > maxDistance) { maxDistance = distance; split = i; }
  }
  return split < 0 ? [points[0], points.at(-1)] : [
    ...simplify(points.slice(0, split + 1), tolerance).slice(0, -1),
    ...simplify(points.slice(split), tolerance),
  ];
}

const contours = [];
for (const first of edges) {
  if (first.used) continue;
  let edge = first;
  const points = [];
  do {
    edge.used = true;
    points.push([edge.start % (width + 1), Math.floor(edge.start / (width + 1))]);
    if (edge.end === first.start) break;
    const candidates = (outgoing.get(edge.end) || []).map(id => edges[id]).filter(item => !item.used);
    // Resolve diagonally touching pixels without joining separate outlines.
    const turns = [(edge.direction + 1) % 4, edge.direction, (edge.direction + 3) % 4, (edge.direction + 2) % 4];
    edge = turns.map(direction => candidates.find(item => item.direction === direction)).find(Boolean);
    if (!edge) throw new Error('Open silhouette contour');
  } while (points.length <= edges.length);
  const area = Math.abs(points.reduce((sum, [x, y], i) => {
    const [nx, ny] = points[(i + 1) % points.length];
    return sum + x * ny - nx * y;
  }, 0)) / 2;
  if (area < 16) continue; // Discard isolated sub-pixel-scale raster specks.
  const split = Math.floor(points.length / 2);
  contours.push([
    ...simplify(points.slice(0, split + 1)).slice(0, -1),
    ...simplify([...points.slice(split), points[0]]).slice(0, -1),
  ]);
}
if (!contours.length) throw new Error('No foreground silhouette found');
const path = contours.map(points => `M${points.map(([x, y]) => `${x},${y}`).join('L')}Z`).join('');
const svg = (adaptive = false) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">Kenneth Cheng — woven knot</title>
  <desc id="desc">Four rounded ribbon turns interweave around a diamond-shaped opening, inspired by mathematical connections.</desc>
  <!-- Approved silhouette source SHA-256: ${sourceHash} -->
${adaptive ? '  <style>path{fill:#1f6652}@media(prefers-color-scheme:dark){path{fill:#f5f3ed}}</style>\n' : ''}  <path fill="#1f6652" fill-rule="evenodd" d="${path}"/>
</svg>
`;
const master = Buffer.from(svg());
const png = (size, opaque = false) => {
  let render = sharp(master, { density: 144 }).resize(size, size);
  if (opaque) render = render.flatten({ background: '#f5f3ed' });
  return render.png({ compressionLevel: 9 }).toBuffer();
};
const output = async (name, bytes) => {
  await writeFile(resolve(root, 'public', name), bytes);
  console.log(`${name}: ${bytes.length} bytes`);
};
await output('images/kenneth-woven-knot.svg', master);
await output('favicon.svg', Buffer.from(svg(true)));
for (const size of [192, 512]) await output(`images/kenneth-woven-knot-${size}.png`, await png(size));
await output('favicon-32x32.png', await png(32, true));
await output('apple-touch-icon.png', await png(180, true));

// ICO directory with independently rendered PNG frames, not resized 16 px data.
const sizes = [16, 32, 48, 64];
const frames = await Promise.all(sizes.map(size => png(size, true)));
const directory = Buffer.alloc(6 + 16 * sizes.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
frames.forEach((frame, i) => {
  const entry = 6 + 16 * i;
  directory[entry] = sizes[i]; directory[entry + 1] = sizes[i];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frame.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await output('favicon.ico', Buffer.concat([directory, ...frames]));

// Compare the vector conversion with the approved alpha, at source resolution.
const vectorAlpha = await sharp(master).resize(width, height).ensureAlpha().extractChannel('alpha').raw().toBuffer();
let intersection = 0, union = 0;
for (let i = 0; i < alpha.length; i++) {
  const a = alpha[i] >= 128, b = vectorAlpha[i] >= 128;
  if (a && b) intersection++;
  if (a || b) union++;
}
const overlap = intersection / union;
console.log(JSON.stringify({ contours: contours.length, vertices: contours.reduce((n, c) => n + c.length, 0), silhouetteIoU: overlap, sourceHash }));
if (overlap < 0.99) throw new Error('Vector conversion differs from the approved silhouette');
