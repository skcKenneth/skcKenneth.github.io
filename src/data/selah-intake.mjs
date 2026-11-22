const bi = (en, zh) => ({ en, 'zh-Hant': zh });
export const q5Id = 'macau-2023-2024-senior-q5';
const paper = 'https://www.dsedj.gov.mo/~webdsej/www/dsejnews/ce/result/tech/2223/math2223_sen_qust.pdf#page=2';
const source = { url: paper, label: 'DSEDJ · 2022/23 · p. 2' };
const coordinates = [[60, 32], [32, 178], [250, 180], [268, 36]];
const point = (xy, label) => ({ x: xy[0], y: xy[1], label });
const vertices = coordinates.map((xy, i) => point(xy, 'ABCD'[i]));
const edge = (i, j) => [...coordinates[i], ...coordinates[j]];
const boundary = [edge(0, 1), edge(1, 2), edge(2, 3), edge(3, 0)];
const diagonalDiagram = {
  lines: [...boundary, edge(0, 2), edge(1, 3)],
  points: [...vertices, point([153.54, 104.86], 'H')],
};

export const reviewedBoards = [
  {
    id: 'macau-2022-2023-senior-q2',
    title: bi('Three reciprocal logarithms', '三個對數倒數的和'),
    question: bi('Assume the logarithms and reciprocals exist. Find the sum of the reciprocals of log₍xy₎(xyz), log₍yz₎(xyz) and log₍zx₎(xyz).', '設以下各項都有定義。求以 xy、yz、zx 為底、xyz 為真數的三個對數的倒數之和。'),
    source, edition: '2022/23', number: 2,
    cues: [
      { id: 'reciprocal', audioId: 'logs-reciprocal', title: bi('Exchange base and argument', '交換底數與真數'), formula: '1 / logₐ b = logᵦ a',
        caption: bi('Take the reciprocal of each logarithm. This exchanges its base and its argument. All three new logarithms have the same base: x times y times z.', '先將每個對數取倒數，底數同真數就會交換位置。睇返板書，依家三個對數嘅底數都相同，就係三個未知數嘅乘積。') },
      { id: 'product', audioId: 'logs-product', title: bi('Collect the factors', '數一數每個因數'), formula: '(xy)(yz)(zx) = (xyz)²',
        caption: bi('Adding logarithms with the same base multiplies their arguments. Count the factors: x, y and z each appear exactly twice.', '同底嘅對數相加，就將真數相乘。數一數三對括號，每個未知數都啱啱好出現兩次。') },
      { id: 'power', audioId: 'logs-power', title: bi('Read the exponent', '讀出指數'), formula: 'log₍xyz₎ ((xyz)²) = 2',
        caption: bi('The product is the square of the base. A logarithm asks which exponent gives that power, so the required sum is two.', '合埋嘅乘積係底數嘅平方。對數問嘅正正係要用幾多次方，所以原來三項加埋等於二。') },
    ],
  },
  {
    id: 'macau-2022-2023-senior-q6',
    title: bi('How long are the two diagonals?', '兩條對角線加埋有幾長？'),
    question: bi('In a convex quadrilateral ABCD, bound AC + BD by the two sums of opposite sides and by the perimeter.', '在凸四邊形 ABCD 中，比較 AC + BD 與兩組對邊之和以及周長。'),
    source, edition: '2022/23', number: 6,
    cues: [
      { id: 'crossing', audioId: 'quad-crossing', title: bi('Mark the crossing', '標出交點'), formula: 'L = AC + BD', diagram: diagonalDiagram,
        caption: bi('Join opposite vertices. Call the crossing H. H is inside because the quadrilateral is convex. Both diagonals split into two pieces.', '將每對相對嘅頂點連埋，喺交會嗰度標低 H 點。因為呢個係凸四邊形，交點喺圖形入面，兩條對角線各自分成兩截。') },
      { id: 'detour', audioId: 'quad-detour', title: bi('Compare two detours', '比較折路同直路'), formula: 'AB + CD < L,     AD + BC < L', diagram: diagonalDiagram,
        caption: bi('Going from A to B through H takes a longer route. So does going from C to D through H. Together those two detours use exactly both diagonals. Pair A with D and B with C to get the other bound.', '由 A 點經交點行去 B 點，比沿住條邊直行長。對面嗰條邊亦一樣。兩條折路加埋，啱啱用晒兩條對角線。換另外一對對邊再比較，就得到第二個下界。') },
      { id: 'perimeter', audioId: 'quad-perimeter', title: bi('Walk the boundary', '沿邊行兩次'), formula: '2AC < P,     2BD < P     ⇒     L < P', diagram: { lines: boundary, points: vertices },
        caption: bi('From A to C either boundary route is longer than the diagonal. Add both routes: twice A C is below the perimeter. Repeat for B D, then add and halve. The sum of the diagonals is below the perimeter.', '由 A 點去 C 點，沿四邊形兩邊兜，都比行對角線長。兩條路加埋，就睇到兩倍對角線長都細過周長。對另一條對角線做多次，將兩式加埋再除二，就證明到兩條對角線嘅和細過周長。') },
    ],
  },
];

const q5Entry = {
  id: q5Id, number: 5, edition: '2023/24',
  title: bi('When is the sum of two square roots largest?', '兩個平方根的和何時最大？'),
  question: bi('Find the largest k such that √(x − 3) + √(6 − x) ≥ k for some real x.', '求最大的 k，使至少有一個實數 x 滿足 √(x − 3) + √(6 − x) ≥ k。'),
  source: { url: 'https://www.dsedj.gov.mo/~webdsej/www/dsejnews/ce/result/tech/2324/math2324_sen_qust.pdf#page=2', label: 'DSEDJ · 2023/24 · p. 2' },
};
export const catalogue = [q5Entry, ...reviewedBoards];

export const generatedCues = [
  { audioId: 'roots-interval', caption: bi('Both radicands must be nonnegative. The first sets the left endpoint. The second sets the right endpoint. Both ends of the marked interval are included.', '兩個根號入面都要大過或者等於零。第一個根號決定左端點，第二個決定右端點。數線上標住呢兩個端點，都可以取到。') },
  { audioId: 'roots-bound', caption: bi('Call the two roots u and v. Squaring and adding makes x cancel. Twice that constant minus the square of their difference gives the square of their sum. The subtracted square is nonnegative.', '將兩個根式分別用板書上面嘅兩個字母表示。分別平方再加埋，X 就會抵消。將呢個定值乘二，再減去兩者之差嘅平方，就係兩者之和嘅平方。減去嗰一項一定非負。') },
  { audioId: 'roots-witness', caption: bi('At the marked midpoint the two radicands are equal. Their roots are equal too, so the difference vanishes. The upper bound is reached here. Take its nonnegative square root to get the maximum shown on the board.', '去到數線標出嘅中點，兩個根號入面一樣，開方之後亦相等。所以差變咗零，板書入面減去嗰個平方亦係零。依家對上界開正平方根，就得到板書上面嘅最大值。') },
];

function rootSumBoard(a, b) {
  if (![a, b].every(Number.isSafeInteger) || Math.abs(a) > 10000 || Math.abs(b) > 10000 || a >= b) return null;
  const width = b - a;
  const x = (b + a) / 2;
  const square = 2 * width;
  // Check the witness against both the symbolic identity and the original radicals.
  if (x < a || x > b || x - a !== b - x || Math.abs((Math.sqrt(x - a) + Math.sqrt(b - x)) ** 2 - square) > 1e-8) return null;
  const first = a === 0 ? 'x' : a > 0 ? 'x − ' + a : 'x + ' + -a;
  const expression = '√(' + first + ') + √(' + b + ' − x)';
  const maximum = Number.isInteger(Math.sqrt(square)) ? String(Math.sqrt(square)) : '√' + square;
  const numberLine = { lines: [[38, 112, 282, 112]], points: [[38, a], [160, x], [282, b]].map(([px, value]) => ({ x: px, y: 112, label: String(value) })) };
  const arcLine = Array.from({ length: 13 }, (_, i) => {
    const t = Math.PI * i / 24;
    return [72 + 140 * Math.cos(t), 177 - 140 * Math.sin(t)];
  });
  const arc = { lines: [[72, 177, 248, 177], [72, 177, 72, 17], ...arcLine.slice(1).map((xy, i) => [...arcLine[i], ...xy])], points: [point(arcLine[6], 'u = v')] };
  return {
    id: 'root-sum:' + a + ':' + b, title: bi('Maximum of two square roots', '兩個根式和的最大值'),
    question: bi('Find the maximum of ' + expression + ' over real x.', '在實數範圍內，求 ' + expression + ' 的最大值。'),
    cues: [
      { id: 'interval', title: bi('Find the interval', '先求定義域'), formula: a + ' ≤ x ≤ ' + b, diagram: numberLine, ...generatedCues[0] },
      { id: 'bound', title: bi('Bound the sum', '為根式和找上界'), formula: '(u + v)² = ' + square + ' − (u − v)² ≤ ' + square, diagram: arc, ...generatedCues[1] },
      { id: 'witness', title: bi('Attain the bound', '檢查可以取等號'), formula: 'x = ' + x + '    ⇒    u = v,    max(u + v) = ' + maximum, diagram: numberLine, ...generatedCues[2] },
    ],
  };
}

export function resolveBoard(id) {
  if (typeof id !== 'string' || id.length > 48) return null;
  const known = reviewedBoards.find(board => board.id === id);
  if (known) return known;
  const match = /^root-sum:(-?\d{1,5}):(-?\d{1,5})$/.exec(id);
  if (!match) return null;
  const board = rootSumBoard(Number(match[1]), Number(match[2]));
  return board?.id === id ? board : null;
}

const simplify = (s) => s.normalize('NFKC').toLowerCase().trim().replace(/[−–—]/g, '-').replace(/\\(?:left|right)/g, '').replace(/\\?sqrt\s*[{(]([^{}()]+)[})]/g, '√($1)').replace(/(\d)\s+(?=\d)/g, '$1_').replace(/\s/g, '').replace(/[。?.!]+$/, '');
const objectiveWord = /(?:overallrealx|overrealx|forrealx|maximumvalue|maximum|maximize|maximise|max|largestvalue|largest|calculate|determine|whatis|whenis|find|what|when|the|its|of|occurs|at|在實數範圍內|實數範圍內|及相應的x值|範圍內|實數|請問|找出|最大值|最大|何時|幾時|為何|係幾多|是多少|求|請|問|搵|在|嘅|的)/gy;

export function identifyProblem(input) {
  if (typeof input !== 'string' || input.length > 6000) return { kind: 'unsupported' };
  const s = simplify(input);
  if (!s) return { kind: 'empty' };
  for (const entry of catalogue) {
    const [start, end] = entry.edition.split('/');
    const ref = new RegExp('^(?:(?:澳門)?(?:校際|學界)?數學(?:比賽|競賽)|macau(?:school|interschool)?(?:math|mathematics)?(?:competition)?)?' + start + '[-/](?:20)?' + end + '(?:年度?)?(?:高中組|senior(?:division)?)?(?:q(?:uestion)?|第)' + entry.number + '(?:題)?$');
    if (ref.test(s) || [entry.title, entry.question].some(label => Object.values(label).some(value => simplify(value) === s))) return { kind: 'reviewed', id: entry.id };
  }
  if (/(?:如圖|附圖|下圖|圖中|圖示|shown|diagram|asillustrated|inthefigure)/.test(s)) return { kind: 'diagram' };
  // A paraphrase offers the archived statement for comparison. It never silently
  // substitutes that solution for a student's differently constrained problem.
  if (['xy', 'yz', 'zx', 'xyz'].every(term => s.includes(term)) && /log|對數/.test(s) && /reciprocal|倒數|1\/log/.test(s)) {
    return { kind: 'candidate', id: 'macau-2022-2023-senior-q2' };
  }
  if (/convexquadrilateral|凸四邊形/.test(s) && /diagonal|對角線/.test(s) && /perimeter|周長|周界/.test(s) && /oppositeside|對邊/.test(s)) {
    return { kind: 'candidate', id: 'macau-2022-2023-senior-q6' };
  }
  // Refuse unrecognised multipliers, extra terms, restricted domains and different objectives.
  const roots = /√\(x(?:([+-])(\d{1,5}))?\)\+√\((-?\d{1,5})-x\)/.exec(s);
  if (!roots) return { kind: 'unsupported' };
  if (roots[0] === '√(x-3)+√(6-x)' && /(?:≥|>=)k/.test(s) && /exists|somerealx|至少|存在/.test(s)) {
    return { kind: 'candidate', id: q5Id };
  }
  const words = (s.slice(0, roots.index) + s.slice(roots.index + roots[0].length)).replace(/[,:]/g, '');
  objectiveWord.lastIndex = 0;
  let consumed = 0;
  while (objectiveWord.exec(words)) consumed = objectiveWord.lastIndex;
  if (consumed !== words.length || !/(?:max|largest|最大)/.test(words)) return { kind: 'objective' };
  const a = roots[1] === '+' ? -Number(roots[2]) : Number(roots[2] ?? 0);
  const b = Number(roots[3]);
  const board = rootSumBoard(a, b);
  if (!board) return { kind: 'range' };
  return a === 3 && b === 6 ? { kind: 'reviewed', id: q5Id } : { kind: 'generated', id: board.id };
}
