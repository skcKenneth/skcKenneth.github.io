const pair = (en, zh) => ({ en, 'zh-Hant': zh });

export const q5Cues = [
  {
    id: 'domain', stepId: 'domain', focus: 'domain',
    title: pair('Read the roots', '睇清兩個根式'),
    caption: pair('Start with the two square roots. Both numbers under the roots must be at least zero, so x can run from three to six.', '先睇吓呢兩個平方根。兩個根號入面嘅數都要大過或者等於零，所以 x 可以由三去到六。'),
  },
  {
    id: 'axes', stepId: 'explore', focus: 'axes',
    title: pair('Set up the axes', '畫出兩條坐標軸'),
    caption: pair('Call the first root u, and the second root v. Put u on the horizontal axis and v on the vertical axis. Each choice of x now gives us a point.', '用橫軸表示第一個平方根，用直軸表示第二個平方根。板書用 u 同 v 代表呢兩個值。每揀一個變數值，圖上面就有一個對應嘅點。'),
  },
  {
    id: 'arc', stepId: 'explore', focus: 'arc',
    title: pair('Trace the arc', '跟住個點畫圓弧'),
    caption: pair('Square u and v and add them. The two terms in x cancel, leaving three. Drag x to see the point follow a quarter circle.', '將兩個平方根分別平方，再加埋。含有變數嘅兩項互相抵消，剩返三。試吓拖動滑桿，你會見到個點沿住四分一圓移動。'),
  },
  {
    id: 'line', stepId: 'explore', focus: 'line',
    title: pair('Follow the sloping line', '留意條斜線'),
    caption: pair('Every point on the gold line has the same sum, u plus v. Move x and watch the line slide. How far from the origin can it go while still touching the arc?', '睇住金色嗰條直線。喺呢條線上面，每一點嘅橫坐標加直坐標都係同一個數。拖動滑桿，試吓將條線移到最遠，但仲掂到條圓弧。'),
  },
  {
    id: 'balance', stepId: 'prove', focus: 'diagonal',
    title: pair('Find the balance point', '搵兩項相等嘅位置'),
    caption: pair('At x equals four and a half, the two roots are equal. The point sits on the diagonal, and the gold line just touches the circle here. Let us prove this is the maximum.', '當滑桿嘅數值係四點五，兩個平方根就相等。個點喺對角線上面，金色直線啱啱喺呢一點同個圓相切。我哋用代數證明，點解個和喺呢度最大。'),
  },
  {
    id: 'square', stepId: 'prove', focus: 'identity',
    title: pair('Prove the upper bound', '證明個上界'),
    caption: pair('The square of the sum equals six minus the square of the difference. A square is at least zero. So the square of the sum reaches six exactly when u equals v.', '個和嘅平方，等於六減去兩項之差嘅平方。平方一定大過或者等於零。只有當兩個根式相等，減去嗰項先至係零，個和嘅平方先至等於六。'),
  },
  {
    id: 'maximum', stepId: 'review', focus: 'result',
    title: pair('Return to the question', '返去答原題'),
    caption: pair('The question asks for the sum itself. Take the positive square root of six. This value really occurs at x equals four and a half, so it is the largest possible k.', '題目問嘅係兩個根式嘅和。個和嘅平方最大係六，所以個和最大係六嘅正平方根。將滑桿拉到四點五，就啱啱做到呢個值。'),
  },
];
