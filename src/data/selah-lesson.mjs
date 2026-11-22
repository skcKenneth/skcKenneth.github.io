const bilingual = (en, zh) => ({ en, 'zh-Hant': zh });

const filmPath = '/teaching/macau-school-math-competition/2023-2024-senior/#question-5';

export const selahLesson = {
  id: 'macau-2023-2024-senior-q5',
  title: bilingual('When is the sum of two square roots largest?', '兩個平方根的和何時最大？'),
  source: {
    paper: 'https://www.dsedj.gov.mo/~webdsej/www/dsejnews/ce/result/tech/2324/math2324_sen_qust.pdf#page=2',
    film: bilingual(filmPath, `/zh${filmPath}`),
  },
  steps: [
    {
      id: 'domain',
      title: bilingual('Read the condition', '讀清題意'),
      text: bilingual(
        'Find the largest k for which there is a real x satisfying the inequality. Both square roots must be defined. First decide where x can lie, then predict whether the sum is largest at an endpoint or somewhere between.',
        '找出最大的 k，使得至少有一個實數 x 滿足這條不等式。兩個平方根都要有意義。先定出 x 的取值範圍，再猜想根式的和在哪裏最大：在端點，還是在區間中間？',
      ),
      formulas: [String.raw`\sqrt{x-3}+\sqrt{6-x}\ge k`],
      tutorNotes: bilingual(
        'In √(x − 3) + √(6 − x) ≥ k, the two radicands require x ≥ 3 and x ≤ 6, so the domain is [3,6]. A single x with the sum at least k is enough. Give a hint about the radicands and the meaning of “there is”. Ask for a prediction and leave the actual maximum for a later step.',
        '在 √(x − 3) + √(6 − x) ≥ k 中，兩個被開方數都須非負，因此 x ≥ 3 且 x ≤ 6，取值範圍是 [3,6]。只要有一個 x 令根式和不少於 k 即可。可提示學生檢查兩個被開方數，並理解「存在」的意思。請學生先猜想，留待稍後證明最大值。',
      ),
    },
    {
      id: 'explore',
      title: bilingual('Look for what stays fixed', '找出不變量'),
      text: bilingual(
        'The square roots are real for x between 3 and 6, including both endpoints. Move x and watch the point (u, v) trace a quarter circle. The sloping line joins all points with the same sum u + v. What stays fixed as the point moves?',
        '當 x 介乎 3 和 6 之間（包括兩個端點），兩個平方根都是實數。拖動 x，觀察點 (u, v) 沿四分一圓移動。斜線連起所有 u + v 相同的點。點移動時，哪個量保持不變？',
      ),
      formulas: [
        String.raw`u=\sqrt{x-3},\quad v=\sqrt{6-x}`,
        String.raw`u^2+v^2=(x-3)+(6-x)=3`,
      ],
      quiz: {
        revealFrom: 1,
        prompt: bilingual('Which expression stays constant as x moves?', '當 x 移動時，哪個式子的值保持不變？'),
        options: [
          { id: 'sum', label: bilingual('u + v', 'u + v') },
          { id: 'squared-components', label: bilingual('u² + v²', 'u² + v²') },
          { id: 'difference', label: bilingual('u − v', 'u − v') },
        ],
        answerId: 'squared-components',
        hint: bilingual('Compare x = 3 with x = 4.5. What happens if you square each root before adding?', '比較 x = 3 和 x = 4.5。先把兩個根式分別平方再相加，會有甚麼結果？'),
        explanation: bilingual('Adding the two radicands cancels x and leaves 3. That is why the point stays a fixed distance √3 from the origin.', '把兩個被開方數相加，x 互相抵消，結果是 3。因此，點與原點的距離一直是 √3。'),
      },
      tutorNotes: bilingual(
        'Show how u²=x−3 and v²=6−x explain the quarter circle. u and v are nonnegative, and the radius is √3. The moving line u+v=k is a contour. Encourage testing endpoints and the middle, and use the invariant as a hint. The graph suggests a conjecture, and the next step proves it.',
        '由 u²=x−3 和 v²=6−x 解釋四分一圓。u、v 都非負，半徑為 √3。移動的直線 u+v=k 是等值線。鼓勵學生試端點與中點，並用不變量提示。圖像用來提出猜想，下一步才用代數證明。',
      ),
    },
    {
      id: 'prove',
      title: bilingual('Turn the picture into a proof', '把圖像變成證明'),
      text: bilingual(
        'Expand (u + v)² and (u − v)², then add them. The fixed sum u² + v² gives the first line below. What needs to happen for the upper bound to be reached?',
        '展開 (u + v)² 和 (u − v)²，再把兩式相加。利用 u² + v² 是定值，可得下方第一行。要剛好達到上界，需要甚麼條件？',
      ),
      formulas: [
        String.raw`(u+v)^2=2(u^2+v^2)-(u-v)^2=6-(u-v)^2\le 6`,
        String.raw`u=v\ \Longrightarrow\ x-3=6-x\ \Longrightarrow\ x=\frac{9}{2}`,
      ],
      quiz: {
        revealFrom: 1,
        prompt: bilingual('When is the bound (u + v)² ≤ 6 attained?', '甚麼時候剛好達到 (u + v)² ≤ 6 的上界？'),
        options: [
          { id: 'zero', label: bilingual('u = 0', 'u = 0') },
          { id: 'same', label: bilingual('u = v', 'u = v') },
          { id: 'largest-coordinate', label: bilingual('u is as large as possible', 'u 取得最大值') },
        ],
        answerId: 'same',
        hint: bilingual('The subtracted term is a square. When does that square vanish?', '被減去的是一個平方。這個平方何時等於零？'),
        explanation: bilingual('Equality requires u − v = 0. Squaring u = v gives x − 3 = 6 − x, so x = 9/2 lies within the domain and attains the bound.', '取等號須有 u − v = 0。將 u = v 兩邊平方，得到 x − 3 = 6 − x，故 x = 9/2 在定義域內，確實達到上界。'),
      },
      tutorNotes: bilingual(
        'The identity follows from (u+v)²+(u−v)²=2(u²+v²)=6. Since (u−v)²≥0 everywhere, equality holds exactly at u=v, where x=9/2. The bound 6 applies to the square. Since u+v≥0, the bound on u+v is √6. Lead with the squared term as a hint when the learner is working on equality.',
        '恆等式來自 (u+v)²+(u−v)²=2(u²+v²)=6。由於 (u−v)² 永遠非負，只有 u=v 取到等號，此時 x=9/2。6 是和的平方的上界。由 u+v≥0，和的上界是 √6。學生仍在思考等號時，先提示看看被減去的平方。',
      ),
      tutorAnswers: {
        bound: bilingual(
          'Which expression is being squared? The bound 6 applies to (u + v)². Because u + v ≥ 0, taking the square root gives u + v ≤ √6, so the sum cannot equal 6.',
          '先看哪個式子被平方。6 是 (u + v)² 的上界。由於 u + v ≥ 0，兩邊取平方根可得 u + v ≤ √6，所以兩根式的和不能等於 6。',
        ),
        equality: bilingual(
          'What is the smallest possible value of (u − v)²? In (u + v)² = 6 − (u − v)², the left side is largest when the term subtracted is zero. That happens exactly when u = v.',
          '想想 (u − v)² 的最小值是多少。在 (u + v)² = 6 − (u − v)² 中，減去的量等於零時，左方才達到最大值。這恰好在 u = v 時發生。',
        ),
        identity: bilingual(
          'Compare the middle terms when you expand the two squares. They are +2uv and −2uv, so they cancel in the sum. What is left is 2(u² + v²), which equals 6 because u² + v² = 3.',
          '比較展開兩個平方後的中間項。它們分別是 +2uv 和 −2uv，相加時互相抵消，剩下 2(u² + v²)。由於 u² + v² = 3，結果是 6。',
        ),
        clarify: bilingual(
          'Which part of this board would you like to check: the identity, the bound on the sum, or the condition for equality?',
          '你想核對板書的哪一部分？是恆等式、根式和的上界，還是取等號的條件？',
        ),
      },
    },
    {
      id: 'review',
      title: bilingual('Answer the original question', '回到原題'),
      text: bilingual(
        'The sum cannot exceed √6 anywhere in the domain, and it equals √6 at x = 9/2. This one witness makes k = √6 feasible. Compare this with a different question: how large could k be if the inequality had to hold for every x in the domain?',
        '根式的和在整個定義域都不超過 √6，且在 x = 9/2 時等於 √6。這一個 x 就足以令 k = √6 成立。再想想另一個問題：如果定義域內每個 x 都必須滿足不等式，k 最大可以是多少？',
      ),
      formulas: [String.raw`k_{\max}=\sqrt6\quad\left(x=\frac{9}{2}\right)`],
      extension: {
        label: bilingual('Check the “every x” version', '核對「每個 x」的版本'),
        explanation: bilingual(
          'The largest k that works for every x in [3,6] is √3. Indeed, (u + v)² = 3 + 2uv ≥ 3 because u and v are nonnegative. At either endpoint, one of the roots is zero, so the sum is exactly √3.',
          '若要求 [3,6] 內每個 x 都成立，最大的 k 是 √3。因為 u、v 都非負，所以 (u + v)² = 3 + 2uv ≥ 3。在任一端點，其中一個平方根為零，根式和恰好是 √3。',
        ),
      },
      tutorNotes: bilingual(
        'The original existential problem asks for the maximum of the sum, √6 at x=9/2. The universal version on [3,6] asks for its minimum. Since (u+v)²=u²+v²+2uv=3+2uv≥3, the sum is at least √3, with equality at either endpoint where uv=0. Thus the largest universal k would be √3. Emphasize the specified domain for the universal variant.',
        '原題要求至少有一個實數 x，故找根式和的最大值，在 x=9/2 取得 √6。若要求 [3,6] 內所有 x 都成立，則要找最小值。由 (u+v)²=u²+v²+2uv=3+2uv≥3，可知和至少為 √3；兩端點的 uv=0，達到等號。所以全稱版本最大的 k 是 √3。注意全稱版本限於所指定的定義域。',
      ),
    },
  ],
};

export function evaluateSelah(x) {
  if (!Number.isFinite(x) || x < 3 || x > 6) {
    throw new RangeError('x must lie in [3, 6]');
  }
  const u = Math.sqrt(x - 3);
  const v = Math.sqrt(6 - x);
  return { x, u, v, sum: u + v };
}
