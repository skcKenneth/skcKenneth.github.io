// Original bilingual teaching material. Source and answer checks: docs/jae-math-sources.md.
// Stable IDs are shared by both language routes and browser-local progress.
const text = (en, zh) => ({ en, zh });
const step = (en, zh, math) => ({ body: text(en, zh), ...(math ? { math } : {}) });
const option = (id, en, zh, expression) => ({
  id,
  label: text(en, zh),
  ...(expression ? { expression } : {}),
});

export const jaeSyllabus = {
  year: 2027,
  url: 'https://www.must.edu.mo/images/JAE/JM01_Exam_Syllabus_2027.pdf',
  verified: '2026-10-03',
};

export const jaePapers = [
  {
    year: 2025,
    url: 'https://www.utm.edu.mo/admission/filemanager/en/content_94/JM01%202025%20exam%20paper%20and%20suggested%20answers.pdf',
    source: text('Macao University of Tourism · JM01 paper and suggested answers', '澳門旅遊大學・JM01 試題及參考答案'),
    verified: '2026-10-03',
  },
  {
    year: 2024,
    url: 'https://www.utm.edu.mo/admission/filemanager/en/content_94/JM01%202024%20%20exam%20paper%20and%20suggested%20answers.pdf',
    source: text('Macao University of Tourism · JM01 paper and suggested answers', '澳門旅遊大學・JM01 試題及參考答案'),
    verified: '2026-10-03',
  },
  ...[2023, 2022, 2021].map((year) => ({
    year,
    url: 'https://www.must.edu.mo/images/JAE/JEX' + year + '_%E6%95%B8%E5%AD%B8%E6%AD%A3%E5%8D%B7.pdf',
    source: text('Macau University of Science and Technology · JM01 paper and suggested answers', '澳門科技大學・JM01 試題及參考答案'),
    verified: '2026-10-03',
  })),
];

export const jaeTopics = [
  {
    id: 'quadratics',
    title: text('Quadratic equations and functions', '二次方程與函數'),
    summary: text(
      'Connect completing the square, roots and the shape of a parabola. This pilot covers quadratic foundations from JM01 syllabus items 5 and 15.',
      '把配方法、方程的根與拋物線圖像連起來。本示範涵蓋 JM01 大綱第 5、15 項中的二次函數基礎。',
    ),
    objectives: [
      text('Complete the square and locate the vertex, axis and extremum.', '用配方法找出頂點、對稱軸與極值。'),
      text('Use the discriminant to predict the number of real roots and x-axis intersections.', '用判別式預測實根數目及圖像與 x 軸的交點數目。'),
      text('Solve quadratic equations and connect their roots to their coefficients.', '解二次方程，並連結根與係數的關係。'),
      text('Explain translations and solve a constrained area problem without calculus.', '解釋平移，並不使用微積分解有範圍限制的面積問題。'),
    ],
    concepts: [
      {
        title: text('One function, three useful forms', '同一函數，三種有用形式'),
        body: text(
          'For a nonzero leading coefficient, the expanded form gives coefficients, the vertex form gives the turning point, and a real factorisation gives the x-intercepts when real roots exist.',
          '二次項係數不為零時，一般式顯示係數，頂點式顯示轉折點；存在實根時，實數因式分解式顯示 x 軸截點。',
        ),
        formula: 'f(x)=ax^2+bx+c=a(x-h)^2+k,\\quad a\\ne0,\\quad h=-\\frac{b}{2a},\\quad k=f(h)',
      },
      {
        title: text('Completing the square and extrema', '配方法與極值'),
        body: text(
          'A real square is nonnegative. The vertex gives a minimum when the parabola opens upwards and a maximum when it opens downwards. On a restricted interval, check whether the vertex is allowed and compare the endpoints.',
          '實數的平方不小於零。開口向上的拋物線在頂點取最小值，開口向下則取最大值。若定義域受限，須檢查頂點是否在範圍內，並比較端點。',
        ),
        formula: 'a>0\\Rightarrow f(x)\\ge k;\\qquad a<0\\Rightarrow f(x)\\le k',
      },
      {
        title: text('Discriminant and the graph', '判別式與圖像'),
        body: text(
          'A positive discriminant gives two distinct real roots; zero gives one repeated real root; a negative value gives no real roots. These cases correspond to two, one or no x-axis intersections.',
          '判別式為正時有兩個相異實根；為零時有一個重實根；為負時沒有實根。圖像分別與 x 軸有兩個、一個或沒有交點。',
        ),
        formula: '\\Delta=b^2-4ac,\\qquad x=\\frac{-b\\pm\\sqrt{\\Delta}}{2a}\\quad(\\Delta\\ge0)',
      },
      {
        title: text('Roots, coefficients and translations', '根、係數與平移'),
        body: text(
          'The sum and product of roots can answer symmetric-expression questions without solving for each root. Replacing x by x minus a positive number moves a graph to the right; adding a constant moves it vertically.',
          '利用根的和與積，可不逐一求根而計算對稱式。把 x 換成 x 減去一個正數會使圖像向右移；在函數外加常數則使圖像上下移。',
        ),
        formula: '\\alpha+\\beta=-\\frac ba,\\quad\\alpha\\beta=\\frac ca,\\qquad g(x)=f(x-p)+q',
      },
    ],
    misconceptions: [
      text('The sign inside a squared bracket is opposite to the vertex x-coordinate: (x + 2)² has its vertex at x = −2.', '平方括號內的符號與頂點橫坐標相反：(x + 2)² 的頂點在 x = −2。'),
      text('A zero discriminant means a repeated real root, not no real roots.', '判別式為零表示有重實根，不是沒有實根。'),
      text('The quadratic formula and discriminant test require a ≠ 0; first check whether a parameter makes the equation linear.', '求根公式與二次方程判別式要求 a ≠ 0；有參數時先檢查方程會否變成一次方程。'),
      text('A graph suggests an answer, but an algebraic calculation is needed to establish an exact value.', '圖像可提示答案，但精確數值仍須用代數計算確定。'),
    ],
    questions: [
      {
        id: 'quadratics-example-1',
        kind: 'example',
        level: 'foundation',
        prompt: text('Complete the square. Locate the vertex and find the minimum value of f over all real x.', '用配方法改寫函數，找出頂點，並求 f 在全體實數上的最小值。'),
        expression: 'f(x)=2x^2-12x+13',
        answer: -5,
        hints: [
          text('Factor 2 out of the two terms containing x before completing the square.', '先把含 x 的兩項提出公因數 2，再配方。'),
          text('Half of −6 is −3. Add and subtract 9 inside the bracket.', '−6 的一半是 −3；在括號內加 9 再減 9。'),
        ],
        steps: [
          step('Isolate the quadratic and linear terms.', '整理二次項與一次項。', 'f(x)=2(x^2-6x)+13'),
          step('Make a perfect square while keeping the expression equal.', '配成完全平方，並保持等式成立。', 'f(x)=2[(x-3)^2-9]+13=2(x-3)^2-5'),
          step('The square is smallest at x = 3. The parabola opens upwards.', '平方項在 x = 3 時最小，且拋物線開口向上。', '(h,k)=(3,-5),\\qquad \\min f=-5'),
        ],
        result: text('Vertex (3, −5); axis x = 3; minimum −5 at x = 3.', '頂點為 (3, −5)，對稱軸為 x = 3；在 x = 3 時最小值為 −5。'),
        explanation: text('Expanding 2(x − 3)² − 5 recovers the original function. The factor 2 stretches the graph vertically without changing the x-coordinate of the vertex.', '展開 2(x − 3)² − 5 可還原原式。係數 2 使圖像縱向伸展，不會改變頂點的橫坐標。'),
      },
      {
        id: 'quadratics-example-2',
        kind: 'example',
        level: 'standard',
        prompt: text('Find the value of k for which the graph touches the x-axis at exactly one point. Give that point as well.', '求使圖像恰好在一點接觸 x 軸的 k 值，並寫出該點坐標。'),
        expression: 'y=x^2-6x+k',
        answer: 9,
        hints: [
          text('Touching the x-axis corresponds to a repeated real root.', '圖像與 x 軸相切，對應方程有重實根。'),
          text('Set the discriminant equal to zero, or make the minimum value zero.', '令判別式等於零，或令函數的最小值等於零。'),
        ],
        steps: [
          step('Identify the coefficients and compute the discriminant.', '辨認係數並計算判別式。', '\\Delta=(-6)^2-4(1)k=36-4k'),
          step('A repeated root requires a zero discriminant.', '有重根時判別式須為零。', '36-4k=0\\Rightarrow k=9'),
          step('Substitute the parameter and factor the expression.', '代入參數並因式分解。', 'y=x^2-6x+9=(x-3)^2'),
        ],
        result: text('k = 9; the graph touches the x-axis at (3, 0).', 'k = 9；圖像在 (3, 0) 與 x 軸相切。'),
        explanation: text('For k < 9 there are two intersections; for k > 9 there are none. Changing k moves the graph vertically while its axis stays at x = 3.', 'k < 9 時有兩個交點；k > 9 時沒有交點。改變 k 會使圖像上下移，而對稱軸仍是 x = 3。'),
      },
      {
        id: 'quadratics-example-3',
        kind: 'example',
        level: 'transfer',
        prompt: text('A rectangular display has perimeter 28 m. Let one side be x metres. Form its area function and find the greatest possible area in square metres.', '一個長方形展示區的周界為 28 米。設其中一邊長為 x 米，建立面積函數，並求最大面積，單位為平方米。'),
        expression: '2(x+\\ell)=28,\\qquad 0<x<14',
        answer: 49,
        hints: [
          text('The sum of the two different side lengths is half the perimeter.', '兩條不同邊長的和是周界的一半。'),
          text('Write the area as 14x − x², then complete the square.', '把面積寫成 14x − x²，再用配方法。'),
        ],
        steps: [
          step('Express the other side in terms of x.', '用 x 表示另一邊長。', '\\ell=14-x'),
          step('Multiply the side lengths and complete the square.', '兩邊長相乘，並配方。', 'A(x)=x(14-x)=49-(x-7)^2'),
          step('The squared term is nonnegative, and x = 7 is in the allowed domain.', '平方項不小於零，而 x = 7 在容許範圍內。', 'A(x)\\le49,\\qquad A(7)=49'),
        ],
        result: text('The greatest area is 49 m², attained by a 7 m × 7 m square.', '最大面積為 49 平方米，在邊長為 7 米的正方形取得。'),
        explanation: text('The downward-opening area graph has vertex (7, 49). Checking the domain matters: a negative or zero side length would not describe the display.', '面積圖像開口向下，頂點是 (7, 49)。須檢查定義域，因為邊長為負或為零均不符合展示區的情境。'),
      },
      {
        id: 'quadratics-choice-1',
        kind: 'choice',
        level: 'foundation',
        prompt: text('Which point is the vertex of this graph?', '以下哪一點是此圖像的頂點？'),
        expression: 'y=-3(x+2)^2+7',
        choices: [
          option('A', 'Positive horizontal coordinate', '橫坐標為正', '(2,7)'),
          option('B', 'Negative horizontal coordinate', '橫坐標為負', '(-2,7)'),
          option('C', 'Both coordinates negative', '兩個坐標皆為負', '(-2,-7)'),
          option('D', 'Coefficient as horizontal coordinate', '把係數當成橫坐標', '(-3,7)'),
        ],
        answer: 'B',
        hints: [
          text('Compare with the vertex form a(x − h)² + k.', '與頂點式 a(x − h)² + k 比較。'),
          text('Find the x-value that makes x + 2 equal to zero.', '找出使 x + 2 等於零的 x 值。'),
        ],
        steps: [
          step('Rewrite the bracket to show h.', '改寫括號，辨認 h。', 'x+2=x-(-2)'),
          step('Read the vertex. The negative leading coefficient changes the opening direction.', '讀出頂點；二次項係數為負會改變開口方向。', '(h,k)=(-2,7)'),
        ],
        result: text('B: the vertex is (−2, 7).', 'B：頂點為 (−2, 7)。'),
        explanation: text('The graph opens downwards and its maximum is 7. The coefficient −3 is not a coordinate of the vertex.', '圖像開口向下，最大值是 7。係數 −3 並不是頂點坐標。'),
      },
      {
        id: 'quadratics-choice-2',
        kind: 'choice',
        level: 'standard',
        prompt: text('How many distinct real roots does this equation have?', '此方程有多少個相異實根？'),
        expression: 'x^2+4x+8=0',
        choices: [
          option('A', 'Two', '兩個'),
          option('B', 'One', '一個'),
          option('C', 'Infinitely many', '無限多個'),
          option('D', 'None', '沒有'),
        ],
        answer: 'D',
        hints: [
          text('Compute b² − 4ac, using the sign of each coefficient.', '按各係數的正負號計算 b² − 4ac。'),
          text('Alternatively, complete the square and compare its minimum with zero.', '也可配方，並比較最小值與零的大小。'),
        ],
        steps: [
          step('Evaluate the discriminant.', '計算判別式。', '\\Delta=4^2-4(1)(8)=-16<0'),
          step('Check the conclusion using the vertex form.', '用頂點式核對結論。', 'x^2+4x+8=(x+2)^2+4\\ge4'),
        ],
        result: text('D: there are no real roots.', 'D：沒有實根。'),
        explanation: text('The whole graph lies above the x-axis. A negative discriminant does not mean the function is negative.', '整條圖像位於 x 軸上方。判別式為負，不代表函數值為負。'),
      },
      {
        id: 'quadratics-choice-3',
        kind: 'choice',
        level: 'standard',
        prompt: text('Which pair gives all the roots?', '哪一組數值列出此方程的全部根？'),
        expression: '2x^2-7x+3=0',
        choices: [
          option('A', 'First pair', '第一組', 'x=-3,\\ -\\tfrac12'),
          option('B', 'Second pair', '第二組', 'x=1,\\ 3'),
          option('C', 'Third pair', '第三組', 'x=\\tfrac12,\\ 3'),
          option('D', 'Fourth pair', '第四組', 'x=2,\\ \\tfrac32'),
        ],
        answer: 'C',
        hints: [
          text('Look for two factors whose product is 2x² − 7x + 3.', '找出相乘後等於 2x² − 7x + 3 的兩個因式。'),
          text('Try factors with first terms 2x and x, and constants −1 and −3.', '試用首項為 2x、x，常數項為 −1、−3 的兩個因式。'),
        ],
        steps: [
          step('Factor the quadratic.', '把二次式因式分解。', '2x^2-7x+3=(2x-1)(x-3)'),
          step('A product is zero when at least one factor is zero.', '乘積為零時，最少一個因式為零。', '2x-1=0\\ \\text{or}\\ x-3=0\\Rightarrow x=\\tfrac12\\ \\text{or}\\ 3'),
        ],
        result: text('C: the roots are 1/2 and 3.', 'C：兩根為 1/2 和 3。'),
        explanation: text('Their sum is 7/2 and product is 3/2, agreeing with −b/a and c/a. Both values also give zero on substitution.', '兩根之和為 7/2，積為 3/2，符合 −b/a 及 c/a；代入原式亦均得到零。'),
      },
      {
        id: 'quadratics-choice-4',
        kind: 'choice',
        level: 'transfer',
        prompt: text('Translate this graph 3 units to the left and 4 units down. Which equation describes the new graph?', '把此圖像向左平移 3 個單位，再向下平移 4 個單位。新圖像的方程是哪一個？'),
        expression: 'y=(x-1)^2+2',
        choices: [
          option('A', 'First equation', '第一個方程', 'y=(x+2)^2-2'),
          option('B', 'Second equation', '第二個方程', 'y=(x-4)^2-2'),
          option('C', 'Third equation', '第三個方程', 'y=(x+2)^2+6'),
          option('D', 'Fourth equation', '第四個方程', 'y=(x-2)^2-2'),
        ],
        answer: 'A',
        hints: [
          text('Track the vertex (1, 2) before writing the new equation.', '先追蹤原頂點 (1, 2) 的位置，再寫新方程。'),
          text('Subtract 3 from the horizontal coordinate and 4 from the vertical coordinate.', '橫坐標減 3，縱坐標減 4。'),
        ],
        steps: [
          step('Move the vertex with the graph.', '把頂點連同圖像一起平移。', '(1,2)\\longmapsto(1-3,2-4)=(-2,-2)'),
          step('Keep the opening and scale; use the new vertex.', '保留開口方向與伸展比例，代入新頂點。', 'y=(x-(-2))^2-2=(x+2)^2-2'),
        ],
        result: text('A: y = (x + 2)² − 2.', 'A：y = (x + 2)² − 2。'),
        explanation: text('A left shift replaces x by x + 3 in the original expression. It does not replace x by x − 3.', '向左平移須把原式的 x 換成 x + 3，而非 x − 3。'),
      },
      {
        id: 'quadratics-number-1',
        kind: 'number',
        level: 'standard',
        prompt: text('Find the minimum value over all real x. Enter the minimum value, not the x-coordinate.', '求函數在全體實數上的最小值。請輸入最小值，而非 x 的值。'),
        expression: 'f(x)=3x^2+12x+5',
        answer: -7,
        tolerance: 1e-8,
        hints: [
          text('Factor 3 out of the terms containing x.', '把含 x 的項提出公因數 3。'),
          text('Use x² + 4x = (x + 2)² − 4.', '利用 x² + 4x = (x + 2)² − 4。'),
        ],
        steps: [
          step('Complete the square.', '配成完全平方。', 'f(x)=3[(x+2)^2-4]+5=3(x+2)^2-7'),
          step('Set the nonnegative square to zero.', '令非負的平方項等於零。', 'f(-2)=-7=\\min f'),
        ],
        result: text('The minimum is −7, reached at x = −2.', '最小值是 −7，在 x = −2 時取得。'),
        explanation: text('The required output is the vertical coordinate of the vertex. Entering −2 gives where the minimum occurs, not the minimum value.', '題目要求頂點的縱坐標。−2 是取得最小值時的 x 值，並非最小值。'),
      },
      {
        id: 'quadratics-number-2',
        kind: 'number',
        level: 'transfer',
        prompt: text('Let α and β be the roots. Find the sum of their squares without calculating the individual roots.', '設 α、β 為此方程的兩根。不逐一求根，計算兩根的平方和。'),
        expression: 'x^2-5x+2=0,\\qquad \\alpha^2+\\beta^2=?',
        answer: 21,
        tolerance: 1e-8,
        hints: [
          text('Read the sum and product of the roots from the coefficients.', '從係數讀出兩根的和與積。'),
          text('Expand (α + β)², then subtract the cross term.', '展開 (α + β)²，再減去交叉項。'),
        ],
        steps: [
          step('Use the relationships between roots and coefficients.', '利用根與係數的關係。', '\\alpha+\\beta=5,\\qquad \\alpha\\beta=2'),
          step('Express the required quantity using that sum and product.', '用已知的和與積表示所求數值。', '\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=25-4=21'),
        ],
        result: text('The sum of the squares is 21.', '兩根的平方和為 21。'),
        explanation: text('Squaring the sum introduces 2αβ. Leaving that term in would give 25, which is not the sum of the squares.', '兩根的和平方後會多出 2αβ；若沒有減去這一項便會得到 25，而不是兩根的平方和。'),
      },
    ],
  },
  {
    id: 'trigonometry',
    title: text('Trigonometric ratios and function graphs', '三角比與三角函數圖像'),
    summary: text(
      'Move from degree and radian measures to sine and cosine graphs, amplitude, period and horizontal shifts. This is a focused introduction to parts of JM01 items 13 and 15, not the full trigonometry syllabus.',
      '由角度制與弧度制，逐步連結正弦、餘弦圖像、振幅、週期與水平平移。本單元是 JM01 第 13、15 項部分內容的入門，並非完整三角大綱。',
    ),
    objectives: [
      text('Convert between degrees and radians and use exact unit-circle values.', '換算角度與弧度，並使用單位圓的精確三角值。'),
      text('Read amplitude, midline, range and period from a sine or cosine equation.', '從正弦或餘弦方程讀出振幅、中線、值域與週期。'),
      text('Distinguish the phase inside a bracket from the horizontal displacement.', '分辨括號內的相位與圖像的水平位移。'),
      text('Build a sinusoidal equation from graph features and interpret a simple periodic model.', '根據圖像特徵建立正弦型方程，並解釋簡單的週期模型。'),
    ],
    concepts: [
      {
        title: text('State the angle unit first', '先確定角的單位'),
        body: text(
          'Half a revolution is 180 degrees or π radians. In a right triangle, sine is opposite over hypotenuse and cosine is adjacent over hypotenuse; the unit circle extends these ratios to other angles.',
          '半周等於 180 度，也等於 π 弧度。在直角三角形中，正弦是對邊除以斜邊，餘弦是鄰邊除以斜邊；單位圓把這些比值推廣至其他角。',
        ),
        formula: '\\theta_{\\mathrm{rad}}=\\frac{\\pi}{180}\\theta_{\\mathrm{deg}},\\qquad P=(\\cos\\theta,\\sin\\theta)',
      },
      {
        title: text('Amplitude, midline and range', '振幅、中線與值域'),
        body: text(
          'For a nonconstant sine or cosine curve, amplitude is the distance from the midline to a peak. A negative multiplier reflects the curve in its midline; amplitude remains nonnegative.',
          '對非恆定的正弦或餘弦曲線，振幅是中線到波峰的距離。乘數為負會使曲線對中線反射，但振幅仍為非負數。',
        ),
        formula: 'y=A\\sin(B(x-h))+D,\\quad A,B\\ne0;\\qquad \\text{amplitude}=|A|,\\quad D-|A|\\le y\\le D+|A|',
      },
      {
        title: text('Period depends on the angle unit', '週期取決於角的單位'),
        body: text(
          'A complete sine or cosine cycle changes its argument by 2π radians or 360 degrees. Divide this full turn by the absolute value of the coefficient multiplying x. These formulas do not apply to a constant graph.',
          '正弦或餘弦完成一個循環時，角會增加 2π 弧度或 360 度。以一周的角量除以 x 的係數絕對值，便得到週期。這些公式不適用於恆定圖像。',
        ),
        formula: 'T=\\frac{2\\pi}{|B|}\\ (\\text{radians}),\\qquad T=\\frac{360}{|B|}\\ (\\text{degrees})',
      },
      {
        title: text('Horizontal displacement', '水平位移'),
        body: text(
          'Factor the coefficient of x out of the entire angle before reading the shift. In B(x − h), a positive h shifts the graph right by h. Different shifts separated by a full period describe the same curve.',
          '先把整個角式中 x 的係數提出，再讀出位移。B(x − h) 中，h 為正表示向右移 h。相差整個週期的位移可表示同一條曲線。',
        ),
        formula: 'Bx+\\varphi=B\\left(x+\\frac{\\varphi}{B}\\right),\\qquad h=-\\frac{\\varphi}{B}',
      },
    ],
    misconceptions: [
      text('Amplitude is |A|, not A; it is never negative.', '振幅是 |A|，不是 A；振幅不會是負數。'),
      text('Multiplying x by 2 halves the period; it does not double it.', '把 x 乘以 2 會使週期減半，不是加倍。'),
      text('The shift of sin(2x − π/3) is π/6 to the right, not π/3.', 'sin(2x − π/3) 的圖像向右移 π/6，而不是 π/3。'),
      text('Degree and radian inputs are different numbers for the same angle. Check the stated unit before evaluating a function.', '同一個角用度與弧度表示時數值不同；計算函數值前先檢查單位。'),
    ],
    questions: [
      {
        id: 'trigonometry-example-1',
        kind: 'example',
        level: 'foundation',
        prompt: text('Convert 150° to radians. Use its position on the unit circle to find its exact sine.', '把 150° 換成弧度，再利用單位圓上的位置，求出其正弦的精確值。'),
        expression: '\\theta=150^\\circ',
        answer: 0.5,
        hints: [
          text('Multiply the degree measure by π/180.', '把度數乘以 π/180。'),
          text('The angle is in quadrant II, with reference angle 30°. Sine is positive there.', '此角在第二象限，參考角為 30°；該象限的正弦值為正。'),
        ],
        steps: [
          step('Use the degree-to-radian conversion.', '把角度換成弧度。', '150^\\circ=150\\cdot\\frac{\\pi}{180}=\\frac{5\\pi}{6}\\ \\text{rad}'),
          step('Reflect the unit-circle point across the vertical axis.', '把單位圓上的點對縱軸反射。', '\\sin150^\\circ=\\sin(180^\\circ-30^\\circ)=\\sin30^\\circ'),
          step('Read the exact vertical coordinate.', '讀出縱坐標的精確值。', '\\sin\\frac{5\\pi}{6}=\\frac12'),
        ],
        result: text('150° = 5π/6 radians, and its sine is 1/2.', '150° = 5π/6 弧度，其正弦為 1/2。'),
        explanation: text('Reflection across the vertical axis preserves the sine value and changes the sign of cosine. A negative sine here would place the point below the horizontal axis.', '對縱軸反射會保留正弦值，並改變餘弦的正負號。若正弦為負，該點便會在橫軸下方。'),
      },
      {
        id: 'trigonometry-example-2',
        kind: 'example',
        level: 'standard',
        prompt: text('For x in radians, find the amplitude, period and range. Explain what the minus sign does to the graph.', 'x 以弧度表示。求振幅、週期與值域，並解釋負號對圖像的影響。'),
        expression: 'y=-2\\cos(3x)+1',
        answer: 2,
        hints: [
          text('Separate the vertical multiplier −2, horizontal multiplier 3 and vertical shift 1.', '分辨縱向乘數 −2、橫向乘數 3，以及向上位移 1。'),
          text('Cosine lies between −1 and 1. Its argument must advance by 2π for a full cycle.', '餘弦值介乎 −1 與 1；角須增加 2π 才完成一個循環。'),
        ],
        steps: [
          step('Amplitude is the magnitude of the vertical multiplier.', '振幅是縱向乘數的絕對值。', '|A|=|-2|=2,\\qquad D=1'),
          step('Solve for a change in x that produces a full cycle.', '求使角增加一周所需的 x 增量。', '3T=2\\pi\\Rightarrow T=\\frac{2\\pi}{3}'),
          step('Add the vertical shift after scaling the range.', '把值域伸展後，加上垂直位移。', '-1\\le\\cos(3x)\\le1\\Rightarrow -1\\le y\\le3'),
        ],
        result: text('Amplitude 2; period 2π/3; midline y = 1; range [−1, 3].', '振幅為 2，週期為 2π/3，中線為 y = 1，值域為 [−1, 3]。'),
        explanation: text('The negative multiplier reflects the cosine curve in its midline. At x = 0 the curve starts at its minimum −1; the amplitude is still positive.', '負乘數使餘弦曲線對中線反射。x = 0 時曲線處於最小值 −1，但振幅仍為正數。'),
      },
      {
        id: 'trigonometry-example-3',
        kind: 'example',
        level: 'transfer',
        prompt: text('In this idealised height model, t is hours after observation begins and h is metres. All trigonometric arguments are in radians. Find the first time the maximum height occurs for 0 ≤ t ≤ 14.', '在此理想化高度模型中，t 是開始觀察後的小時數，h 的單位是米；三角函數的角以弧度表示。求 0 ≤ t ≤ 14 內首次達到最高點的時間。'),
        expression: 'h(t)=4+3\\sin\\left(\\frac{\\pi}{6}(t-2)\\right)',
        answer: 5,
        hints: [
          text('The greatest sine value is 1. Decide which angles produce it.', '正弦的最大值是 1；先找出對應的角。'),
          text('Set the angle equal to π/2 + 2πn, then find the earliest allowed time.', '令角等於 π/2 + 2πn，再選取範圍內最早的時間。'),
        ],
        steps: [
          step('Read the maximum height from the midline and amplitude.', '由中線與振幅讀出最大高度。', 'h_{\\max}=4+3=7'),
          step('Solve the peak condition for time.', '解達到波峰的時間條件。', '\\frac{\\pi}{6}(t-2)=\\frac\\pi2+2\\pi n\\Rightarrow t=5+12n,\\quad n\\in\\mathbb Z'),
          step('Check the observation interval: the preceding peak is before t = 0.', '檢查觀察範圍：前一個波峰在 t = 0 之前。', 't=-7,\\ 5,\\ 17,\\ldots\\Rightarrow t_{\\mathrm{first}}=5'),
        ],
        result: text('The first maximum is at t = 5 hours, when the height is 7 m.', '首次在 t = 5 小時達到最高點，高度為 7 米。'),
        explanation: text('The model has period 12 hours and a right shift of 2 hours. The shift marks an upward midline crossing, not the first maximum. This is an invented model, not a measurement record.', '模型的週期是 12 小時，並向右移 2 小時。此位移對應向上穿越中線的時刻，而非首次最高點。本模型為自編情境，並非實測紀錄。'),
      },
      {
        id: 'trigonometry-choice-1',
        kind: 'choice',
        level: 'foundation',
        prompt: text('The angle is in radians. What is its exact cosine?', '此角以弧度表示。其餘弦的精確值是多少？'),
        expression: '\\cos\\frac{2\\pi}{3}=?',
        choices: [
          option('A', 'Positive half', '正二分之一', '\\tfrac12'),
          option('B', 'Negative half', '負二分之一', '-\\tfrac12'),
          option('C', 'Positive square-root value', '正根式值', '\\tfrac{\\sqrt3}{2}'),
          option('D', 'Negative square-root value', '負根式值', '-\\tfrac{\\sqrt3}{2}'),
        ],
        answer: 'B',
        hints: [
          text('Convert 2π/3 radians to degrees, or identify its quadrant directly.', '把 2π/3 弧度換成度，或直接辨認其象限。'),
          text('It has reference angle π/3 in quadrant II. Cosine is negative in that quadrant.', '它在第二象限，參考角為 π/3；該象限的餘弦為負。'),
        ],
        steps: [
          step('Identify the reference angle.', '辨認參考角。', '\\frac{2\\pi}{3}=\\pi-\\frac\\pi3'),
          step('Reflect the horizontal coordinate on the unit circle.', '把單位圓的橫坐標反射。', '\\cos\\left(\\pi-\\frac\\pi3\\right)=-\\cos\\frac\\pi3=-\\frac12'),
        ],
        result: text('B: −1/2.', 'B：−1/2。'),
        explanation: text('The positive √3/2 is the sine at this angle. Distinguish the horizontal coordinate (cosine) from the vertical coordinate (sine).', '正的 √3/2 是此角的正弦。須分辨橫坐標（餘弦）與縱坐標（正弦）。'),
      },
      {
        id: 'trigonometry-choice-2',
        kind: 'choice',
        level: 'standard',
        prompt: text('With x measured in radians, what is the least positive period?', 'x 以弧度表示。最小正週期是多少？'),
        expression: 'y=3\\sin(2x)',
        choices: [
          option('A', 'First value', '第一個數值', '2\\pi'),
          option('B', 'Second value', '第二個數值', '3\\pi'),
          option('C', 'Third value', '第三個數值', '\\pi'),
          option('D', 'Fourth value', '第四個數值', '\\tfrac\\pi2'),
        ],
        answer: 'C',
        hints: [
          text('The factor 3 affects vertical distances, not the period.', '係數 3 影響縱向距離，不影響週期。'),
          text('Find the smallest positive T for which the angle 2x advances by 2π.', '求使角 2x 增加 2π 的最小正 T。'),
        ],
        steps: [
          step('Set the change in the argument to one full turn.', '令角的增量等於一周。', '2(x+T)-2x=2\\pi'),
          step('Solve for the period in x.', '求出 x 的週期。', '2T=2\\pi\\Rightarrow T=\\pi'),
        ],
        result: text('C: the least positive period is π radians.', 'C：最小正週期為 π 弧度。'),
        explanation: text('In a width of 2π along the x-axis this curve completes two cycles. Its amplitude is 3, independently of its period.', '在 x 軸上長度為 2π 的區間內，此曲線完成兩個循環。振幅為 3，與週期分開判斷。'),
      },
      {
        id: 'trigonometry-choice-3',
        kind: 'choice',
        level: 'standard',
        prompt: text('Using the displayed bracketed form and radians, how is this graph obtained from y = 2 sin x?', '按下列括號形式並以弧度計，如何由 y = 2 sin x 得到此圖像？'),
        expression: 'y=2\\sin\\left(x-\\frac\\pi4\\right)+1',
        choices: [
          option('A', 'Left π/4 and up 1', '向左 π/4，再向上 1'),
          option('B', 'Right π/4 and down 1', '向右 π/4，再向下 1'),
          option('C', 'Right π/2 and up 1', '向右 π/2，再向上 1'),
          option('D', 'Right π/4 and up 1', '向右 π/4，再向上 1'),
        ],
        answer: 'D',
        hints: [
          text('The expression x − h means the original graph is shifted right by h.', 'x − h 表示把原圖像向右平移 h。'),
          text('The +1 is outside sine, so it changes every output by the same amount.', '+1 在正弦函數外，表示所有輸出值都增加同一數量。'),
        ],
        steps: [
          step('Match the angle to x − h.', '把角與 x − h 比較。', 'h=\\frac\\pi4'),
          step('Read the vertical translation and check a reference point.', '讀出垂直位移，並核對一個參考點。', '(0,0)\\longmapsto\\left(\\frac\\pi4,1\\right)'),
        ],
        result: text('D: shift right by π/4 and up by 1.', 'D：向右平移 π/4，再向上平移 1。'),
        explanation: text('At x = π/4 the angle inside sine is zero and the output is 1. This checks the direction of both translations.', 'x = π/4 時，正弦內的角等於零，輸出為 1，可核對兩個平移方向。'),
      },
      {
        id: 'trigonometry-choice-4',
        kind: 'choice',
        level: 'transfer',
        prompt: text('A cosine curve has a maximum of 8 at x = 0, a minimum of 2, and successive maxima 4π apart. With x in radians, which equation fits all three features?', '一條餘弦曲線在 x = 0 時取最大值 8，最小值為 2，相鄰兩個波峰相距 4π。x 以弧度表示。哪個方程符合全部三項特徵？'),
        choices: [
          option('A', 'First model', '第一個模型', 'y=3\\cos\\left(\\frac x2\\right)+5'),
          option('B', 'Second model', '第二個模型', 'y=6\\cos\\left(\\frac x2\\right)+2'),
          option('C', 'Third model', '第三個模型', 'y=3\\cos(2x)+5'),
          option('D', 'Fourth model', '第四個模型', 'y=-3\\cos\\left(\\frac x2\\right)+5'),
        ],
        answer: 'A',
        hints: [
          text('The midline is halfway between the largest and smallest values; amplitude is half their difference.', '中線在最大與最小值的中間；振幅是兩者差的一半。'),
          text('Use T = 2π/B with positive B, then check whether x = 0 is a maximum or a minimum.', '取 B 為正並利用 T = 2π/B，再檢查 x = 0 時是最大值還是最小值。'),
        ],
        steps: [
          step('Recover the vertical parameters.', '求出縱向參數。', 'D=\\frac{8+2}{2}=5,\\qquad A=\\frac{8-2}{2}=3'),
          step('Recover the horizontal multiplier from the period.', '由週期求橫向乘數。', 'B=\\frac{2\\pi}{4\\pi}=\\frac12'),
          step('A positive cosine coefficient gives the required initial peak.', '餘弦係數為正，便得到所需的起始波峰。', 'y(0)=3\\cos0+5=8'),
        ],
        result: text('A: y = 3 cos(x/2) + 5.', 'A：y = 3 cos(x/2) + 5。'),
        explanation: text('B confuses amplitude with the full vertical span; C uses the wrong period; D starts at the minimum. Each stated feature helps rule out a different error.', 'B 把振幅誤作完整高低差；C 的週期錯誤；D 從最小值開始。每一項條件都可排除一種不同錯誤。'),
      },
      {
        id: 'trigonometry-number-1',
        kind: 'number',
        level: 'foundation',
        prompt: text('Here x is a number of degrees, so the whole angle 4x is measured in degrees. Find the least positive period in degrees. Enter only the number.', '此處 x 是以度表示的數值，整個角 4x 均以度計。求最小正週期，單位為度；只需輸入數值。'),
        expression: 'y=2\\cos((4x)^\\circ)-3',
        answer: 90,
        tolerance: 1e-8,
        hints: [
          text('Use 360 degrees for one full turn, not 2π.', '一周用 360 度表示，不用 2π。'),
          text('Find how far x must increase for 4x to increase by 360.', '求使 4x 增加 360 時，x 須增加多少。'),
        ],
        steps: [
          step('Write the full-cycle condition in degrees.', '以度寫出完整循環的條件。', '4T=360'),
          step('Divide by the horizontal multiplier.', '除以橫向乘數。', 'T=\\frac{360}{4}=90'),
        ],
        result: text('The least positive period is 90°.', '最小正週期為 90°。'),
        explanation: text('The amplitude 2 and downward translation 3 do not change the period. The radian value π/2 represents the same angular interval but is not the requested numerical unit.', '振幅 2 與向下位移 3 不改變週期。π/2 弧度表示相同角距，但不是題目要求的數值單位。'),
      },
      {
        id: 'trigonometry-number-2',
        kind: 'number',
        level: 'transfer',
        prompt: text('Let x be measured in radians. Find the least positive x at which y reaches its maximum. Write x = cπ and enter the number c.', 'x 以弧度表示。求使 y 達到最大值的最小正 x。把答案寫成 x = cπ，並輸入數值 c。'),
        expression: 'y=2\\sin\\left(2x-\\frac\\pi3\\right)',
        answer: 5 / 12,
        tolerance: 1e-6,
        hints: [
          text('A maximum requires the angle inside sine to equal π/2 + 2πn.', '最大值要求正弦內的角等於 π/2 + 2πn。'),
          text('Add π/3 before dividing by 2. Then select the least positive solution.', '先加 π/3，再除以 2，最後選最小正解。'),
        ],
        steps: [
          step('Set the argument to the peak angles of sine.', '令函數內的角等於正弦達到波峰時的角。', '2x-\\frac\\pi3=\\frac\\pi2+2\\pi n'),
          step('Solve the linear equation for x.', '解關於 x 的一次方程。', 'x=\\frac{5\\pi}{12}+\\pi n,\\quad n\\in\\mathbb Z'),
          step('The preceding solution is negative; divide the first positive solution by π.', '前一個解為負；把最小正解除以 π。', 'c=\\frac5{12}\\approx0.416666667'),
        ],
        result: text('c = 5/12 ≈ 0.416666667, so the first positive peak is at x = 5π/12.', 'c = 5/12 ≈ 0.416666667，因此第一個正 x 波峰在 x = 5π/12。'),
        explanation: text('The horizontal shift is π/6, and one quarter of the period is π/4. Their sum is 5π/12. For a decimal answer, use at least six decimal places.', '水平位移是 π/6，而四分之一週期為 π/4；兩者相加是 5π/12。若輸入小數，請最少保留六個小數位。'),
      },
    ],
  },
];

// Extend the original lessons to the same 3 + 10 contract; original IDs remain unchanged.
const extraPilot = (id,kind,level,en,zh,expression,answer,h1,h2,steps,result,explanation) => ({id,kind,level,prompt:text(en,zh),expression,answer,hints:[h1,h2],steps,result,explanation,...(kind==='written'?{rubric:[text('Identify the equation type and all exceptional parameters.','辨認方程種類及所有特殊參數。'),text('State conditions before applying a discriminant or identity.','使用判別式或恆等式前先說明條件。')]}:{})});
jaeTopics[0].questions.push(
 extraPilot('quadratics-number-3','number','foundation','Find the positive root.','求正根。','x^2=16',4,text('Both square roots solve the equation.','正負平方根均滿足方程。'),text('The question asks for the positive one.','題目要求正的一個。'),[step('Factor the difference of squares.','把平方差因式分解。','(x-4)(x+4)=0'),step('Select the positive root.','選取正根。','x=4')],text('The positive root is 4.','正根為 4。'),text('The full solution set is {−4,4}; the word positive restricts the requested answer.','完整解集為 {−4,4}；「正根」限制了所求答案。')),
 extraPilot('quadratics-number-4','number','foundation','Find the maximum value over real x.','求在實數範圍的最大值。','y=-2(x-1)^2+8',8,text('A real square is nonnegative.','實數的平方不小於零。'),text('Multiplication by −2 makes the squared term nonpositive.','乘以 −2 後平方項不大於零。'),[step('Bound the squared term.','估計平方項。','-2(x-1)^2\\le0'),step('Equality is attained at x=1.','在 x=1 時取等號。','\\max y=8')],text('Maximum 8 at x=1.','在 x=1 時最大值為 8。'),text('The sign of the leading coefficient determines whether the vertex is a maximum or minimum.','二次項係數的正負決定頂點為最大值或最小值。')),
 extraPilot('quadratics-number-5','number','foundation','Calculate the discriminant.','計算判別式。','x^2+2x+5=0',-16,text('Use b²−4ac.','使用 b²−4ac。'),text('Here a=1,b=2,c=5.','此處 a=1、b=2、c=5。'),[step('Substitute the coefficients.','代入係數。','\\Delta=2^2-4(1)(5)'),step('A negative value excludes real roots.','負值表示沒有實根。','\\Delta=-16<0')],text('Discriminant −16; no real roots.','判別式為 −16，沒有實根。'),text('A negative discriminant does not mean there are no complex roots.','判別式為負不代表沒有複數根。')),
 extraPilot('quadratics-written-1','written','standard','Classify the real solutions for every real m.','按所有實數 m 分類實數解。','mx^2+3x-6=0',null,text('First separate m=0 from quadratic cases.','先把 m=0 與二次方程情況分開。'),text('For m≠0, use Δ=9+24m.','m≠0 時使用 Δ=9+24m。'),[step('The zero parameter gives a linear equation.','參數為零時是一次方程。','m=0\\Rightarrow x=2'),step('Classify the quadratic using the discriminant.','按判別式分類二次方程。','m\\ne0:\\quad \\Delta=9+24m'),step('Keep the linear exception distinct.','保留一次方程的特殊情況。','m<-3/8:0;\\quad m=-3/8:1;\\quad m>-3/8,\\ m\\ne0:2')],text('m=0 has one linear root; m=−3/8 a repeated root x=4; the other counts follow Δ.','m=0 有一個一次方程根；m=−3/8 有重根 x=4；其餘根數按判別式分類。'),text('The condition a≠0 is essential; using the quadratic formula at m=0 would divide by zero.','a≠0 不可省略；m=0 時使用求根公式會除以零。')),
);
jaeTopics[1].questions.push(
 extraPilot('trigonometry-number-3','number','foundation','Write 60° as cπ radians. Find c.','把 60° 寫成 cπ 弧度，求 c。','60^\\circ=c\\pi\\,\\mathrm{rad}',1/3,text('180° equals π radians.','180° 等於 π 弧度。'),text('Scale by 60/180.','乘以 60/180。'),[step('Apply the conversion.','使用角度轉換。','60^\\circ=\\frac{60}{180}\\pi'),step('Read the coefficient of π.','讀出 π 的係數。','c=\\frac13')],text('c=1/3.','c=1/3。'),text('The requested number is the coefficient, not the radian value itself.','所求數值是係數，而非弧度值本身。')),
 extraPilot('trigonometry-number-4','number','foundation','Evaluate exactly.','求精確值。','\\sin30^\\circ',.5,text('Use a 30°–60°–90° triangle.','使用 30°–60°–90° 三角形。'),text('The side opposite 30° is half the hypotenuse.','30° 的對邊是斜邊的一半。'),[step('Use opposite divided by hypotenuse.','以對邊除以斜邊。','\\sin30^\\circ=\\frac12'),step('Enter a fraction or decimal.','輸入分數或小數。','\\frac12=0.5')],text('1/2.','1/2。'),text('The angle is in degrees; 30 radians is a different angle.','此角以度為單位；30 弧度是另一個角。')),
 extraPilot('trigonometry-number-5','number','standard','Write the least positive period as cπ. Find c.','把最小正週期寫成 cπ，求 c。','y=\\cos(3x),\\quad x\\text{ in radians}',2/3,text('Cosine repeats after an argument change of 2π.','餘弦的自變量增加 2π 後重複。'),text('Solve 3T=2π.','解 3T=2π。'),[step('Account for the horizontal scale.','考慮水平伸縮。','T=\\frac{2\\pi}{3}'),step('Read the coefficient.','讀出係數。','c=\\frac23')],text('c=2/3.','c=2/3。'),text('Frequency 3 divides the period; it does not multiply it.','頻率參數 3 使週期除以 3，而非乘以 3。')),
 extraPilot('trigonometry-written-1','written','standard','A student claims sin(x+π)=sin x for all real x. Give a counterexample and state the correct identity.','有學生聲稱所有實數 x 均有 sin(x+π)=sin x。給出反例並寫出正確恆等式。','\\sin(x+\\pi)=\\sin x\ ?',null,text('Test an angle whose sine is nonzero.','選取正弦不為零的角。'),text('Try x=π/2, then use the angle-addition formula.','嘗試 x=π/2，再用和角公式。'),[step('One valid counterexample disproves an all-real claim.','一個有效反例足以否定對所有實數的聲稱。','\\sin(3\\pi/2)=-1\\ne1=\\sin(\\pi/2)'),step('Apply the compound-angle identity.','使用和角公式。','\\sin(x+\\pi)=\\sin x\\cos\\pi+\\cos x\\sin\\pi=-\\sin x')],text('Counterexample x=π/2; correct identity sin(x+π)=−sin x.','反例 x=π/2；正確恆等式為 sin(x+π)=−sin x。'),text('A half-turn changes the sign; the full period of sine is 2π.','半周轉動使正弦變號；正弦的完整週期為 2π。')),
);
