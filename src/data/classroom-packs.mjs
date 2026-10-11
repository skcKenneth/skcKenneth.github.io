const bi = (en, zh) => ({en, 'zh-Hant': zh});
const stage = (id, minutes, title, task, teacher, math = []) => ({id, minutes, title, task, teacher, math});

/** Editorial lesson sequences built around existing activities, not new learning engines. */
export const CLASSROOM_PACKS = [
  {
    id: 'sampling-bias', minutes: 45, topicIds: ['mathematical-thinking', 'data-ai', 'teaching-research-practice'],
    title: bi('Sampling: does more mean better?', '抽樣：問得更多就更準？'),
    question: bi('Can a larger sample still give a misleading picture of the whole school?', '樣本更多，仍會誤解全校的情況嗎？'),
    summary: bi('Compare who is asked, how many are asked and what changes when you draw again.', '比較訪問對象、人數及重抽結果，分清選樣偏差與抽樣波動。'),
    audience: bi('Junior secondary · pairs or groups of 2–4', '初中 · 二人或 2–4 人小組'),
    prerequisites: bi('Frequency, percentages and reading a bar chart. No programming required.', '頻數、百分比及條形圖；不需要程式經驗。'),
    scope: bi('An authored 45-minute sequence using an existing synthetic inquiry. The 200-person school and its activity group are invented, not a real school survey.', '以現有合成探究編成的 45 分鐘活動。200 人校園及活動小組均為自訂資料，並非真實學校調查。'),
    engine: {
      path: '/math-studio/', localized: false,
      title: bi('Mathematics Studio', '數學研習室'),
      language: bi('Traditional Chinese interactive tool; this classroom guide is bilingual.', '互動工具只有繁中；本課堂指引提供中英文。'),
      launch: [bi('Choose Year 7 (初一) first.', '先選「初一」。'), bi('Open Interactive exploration (互動探索), then choose Sampling and charts (抽樣與圖表).', '再開啟「互動探索」，選「抽樣與圖表」。'), bi('Apply the settings below manually. Opening a link does not load these settings or replace your saved inquiry.', '手動輸入下列設定。開啟連結不會載入設定或取代已保存探究。')],
      runtime: bi('The existing activity runs in the browser with JavaScript. If a device is unavailable, use the population and group counts below for a paper comparison; that is not a new random draw.', '現有活動需要瀏覽器 JavaScript。沒有裝置時，可用下列全校與小組人數作紙本比較；紙本比較並非新的隨機抽樣。')
    },
    seed: {min: 1, max: 99999, value: 2026},
    parameterLabels: {size: bi('Sample size', '抽樣人數'), method: bi('Sampling frame', '訪問對象'), baseline: bi('Chart axis starts at (%)', '圖表縱軸起點（%）')},
    valueLabels: {random: bi('Whole school, random', '從全校隨機抽樣'), club: bi('Activity group only', '只訪問活動小組')},
    presets: [
      {id:'school-20',label:bi('Whole school · 20 people', '全校隨機 · 20 人'),params:{size:20,method:'random',baseline:0}},
      {id:'club-20',label:bi('Activity group · 20 people', '活動小組 · 20 人'),params:{size:20,method:'club',baseline:0}},
      {id:'club-40',label:bi('Activity group · 40 people', '活動小組 · 40 人'),params:{size:40,method:'club',baseline:0}},
      {id:'school-40',label:bi('Whole school · 40 people', '全校隨機 · 40 人'),params:{size:40,method:'random',baseline:0}}
    ],
    prepare: [bi('Check that the sampling activity opens. Arrange an operator, recorder and questioner; every learner writes an individual prediction first.', '先確認抽樣活動可開啟。分配操作者、記錄者與提問者；每人先獨立寫預測。'),bi('Keep the chart axis at 0% for the main comparison. The synthetic school has 100 A responses out of 200; the group has 36 out of 40.', '主比較保持縱軸由 0% 開始。合成全校 200 人中 100 人選 A，小組 40 人中 36 人選 A。')],
    stages: [
      stage('predict',5,bi('Predict before asking', '先預測'),bi('Will asking all 40 group members be closer to the school’s 50% than asking 20 randomly chosen pupils? Explain before running.', '問足小組 40 人，會否比全校隨機問 20 人更接近全校的 50%？執行前先解釋。'),bi('Collect reasons before displaying results. Distinguish “more people” from “different people have a chance to be selected”.', '展示結果前先收集理由；區分「人多」與「不同人有機會被選中」。')),
      stage('frame',12,bi('Keep size, change who is asked', '保持人數，改訪問對象'),bi('Use the selected seed (default 2026) to compare school-20 and club-20. Record the A count, sample size and percentage. Save both pieces of evidence in the original tool.', '使用所選種子（預設 2026）比較全校 20 人與小組 20 人。記下 A 人數、樣本數及百分比，在原工具保存兩組證據。'),bi('Only the sampling frame changes. A sample’s percentage uses its own sample size as the denominator, not 200.', '此比較只改抽樣框；樣本百分比的分母是本次樣本數，不是 200。')),
      stage('size',10,bi('Increase size within each frame', '分別增加人數'),bi('Compare club-40 and school-40 with the earlier cases. Which pupils are still excluded by asking only the group?', '把小組 40 人及全校 40 人與之前比較。只問小組仍漏掉哪些人？'),bi('The full group gives 36/40 = 90%, while the full school is 50%. Surveying that entire group removes within-group sampling variability but does not fix its mismatch with the school.', '問完整個小組是 36/40＝90%，全校為 50%。問足小組消除了組內抽樣波動，但未修正小組與全校的差異。')),
      stage('repeat',10,bi('Draw again and revise', '重抽，再修訂'),bi('Use the next-seed control and inspect the listed 30 repeats. Revise “more people always means more accurate”. Do not pick only the nicest result.', '按「換下一個種子重抽」，檢視列出的 30 次結果。修訂「人多就一定更準」；不要只選最好看的結果。'),bi('The 30 repeats begin at the displayed seed. They describe these deterministic draws, not all possible surveys. Larger random samples generally reduce variability; a single draw need not improve.', '30 次重抽由畫面種子開始；只描述這批可重現抽樣，並非所有可能調查。較大隨機樣本通常減少波動，單次不一定更準。')),
      stage('transfer',8,bi('Plan a lunch survey', '設計午餐調查'),bi('A pupil asks only the basketball team about favourite lunches. Propose a better sampling frame, note possible non-response, then answer the exit question.', '同學只問籃球隊最喜歡的午餐。提出更好的抽樣框，指出未回覆的可能影響，再回答離堂問題。'),bi('Look for a whole-grade sampling frame and opportunities across classes/interests. An improved plan still cannot promise an exact population percentage.', '檢查是否使用全級抽樣框，讓不同班別與興趣的人有被選機會；改進方案仍不能保證結果完全等於總體比例。'))
    ],
    deliverables: [bi('Two saved comparisons with method, size, seed and A percentage.', '兩組已保存比較：方法、人數、種子及 A 百分比。'),bi('A revised claim and a lunch-survey plan with one limitation.', '一項修訂主張及附一項限制的午餐調查方案。')],
    worksheet: [bi('My prediction and reason:', '我的預測與理由：'),bi('Case / who was asked / size / seed / A count / A percentage:', '情境／訪問對象／人數／種子／A 人數／A 百分比：'),bi('What changed? What stayed fixed?', '改了甚麼？保持了甚麼？'),bi('My revised claim, evidence and limitation:', '我的修訂主張、證據與限制：'),bi('Lunch-survey plan and exit response:', '午餐調查方案與離堂回答：')],
    exit: bi('If the complete activity group gives 90%, can we claim the whole school is 90%? Why?', '問完整個小組得到 90%，能否宣稱全校亦是 90%？為甚麼？'),
    exitAnswer: bi('No. The observed group is not the whole school. Here the invented school proportion is 50%; increasing the group sample does not include the other pupils.', '不能。該小組不是全校；此合成校園的全校比例為 50%，增加小組樣本沒有納入其他學生。'),
    misconceptions: [bi('A bigger sample automatically fixes selection bias.', '樣本增加就會自動修正選樣偏差。'),bi('A lucky random draw proves the sampling method is always better.', '一次碰巧較準，就證明該方法每次較好。'),bi('Changing the chart axis changes the observations.', '改圖表縱軸就改變了觀測資料。')],
    records: bi('Use Save evidence, Download record and Print in the original inquiry. Its local record stays in this browser; this classroom page does not read, save or import it. Paper responses can be kept separately.', '請用原探究的保存證據、下載紀錄及列印功能。紀錄保存在此瀏覽器；本課堂頁不讀取、保存或匯入它。紙本回答可另外保留。'),
    background: [{path:'/writing/modeling-workflow/',label:bi('Teacher background: from question to reproducible model', '教師延伸閱讀：由問題到可重現模型')}],
    provenance: bi('Sequence adapted from the existing Year 7 sampling inquiry (content g7-1), including its four comparison cases, layered hints and transfer question. The 45-minute pacing is an editorial lesson plan, not a measured learning outcome.', '次序取自現有初一抽樣探究（內容 g7-1）的四組比較、分層提示及遷移問題。45 分鐘是教學編排，並非已量度的學習成效。')
  },
  {
    id: 'mixing-tank', minutes: 50, topicIds: ['mathematical-thinking', 'computation-code', 'teaching-research-practice'],
    title: bi('Mixing tank: can a smooth curve be trusted?', '混合槽：平滑曲線就可信？'),
    question: bi('What does agreement with an analytic solution check, and what does it leave untested?', '符合解析解能檢查甚麼，又有甚麼尚未驗證？'),
    summary: bi('Derive a balance, complete two short functions and separate numerical checks from a physical assumption.', '推導平衡式、完成兩個短函式，分清數值檢查與物理假設。'),
    audience: bi('Introductory modeling · pairs', '建模入門 · 二人合作'),
    prerequisites: bi('Derivatives, units, Python functions and arrays. This is a 50-minute introduction to the existing approximately 150-minute workshop, not its completion.', '導數、單位、Python 函式及陣列。這是原約 150 分鐘工坊的 50 分鐘入門片段，並非完成整個工坊。'),
    scope: bi('The well-mixed tank is an invented teaching system. No measured equipment, mixing validation or plant-safety result is supplied.', '充分混合槽是自訂教學系統，沒有實測設備、混合驗證或工廠安全結果。'),
    engine: {
      path: '/teaching/modeling-workshop/mixing-tank/', localized: true,
      title: bi('Mixing-tank workshop', '混合槽工坊'),
      language: bi('English / Traditional Chinese workshop.', '工坊提供英文及繁體中文。'),
      launch: [bi('Open the workshop and use its task, Python and results panels.', '開啟工坊，使用任務、Python 與結果面板。'),bi('Apply the settings below manually and keep your prediction before running. Opening this link does not load the preset or reset a saved draft.', '手動輸入下列設定，執行前保留預測。開啟連結不會載入預設或重設已存草稿。'),bi('Start Python only when ready. Complete student_model and student_euler before running; unfinished starter functions are expected to fail checks.', '準備好才啟動 Python。執行前完成 student_model 及 student_euler；未完成的起始函式預期未能通過檢查。')],
      runtime: bi('Start Python downloads the scientific runtime on demand from jsDelivr. Test the classroom network beforehand. If loading fails, use the labelled precomputed reference and reference CSV/notebook; these are not a learner’s own run. Notebook execution requires Python with NumPy, SciPy and Matplotlib.', '按「啟動 Python」才從 jsDelivr 下載科學運算環境，請課前測試網絡。載入失敗時可用已標示的預先生成參照及參照 CSV／notebook；這些不是學生自己的運行。執行 notebook 需要裝有 NumPy、SciPy、Matplotlib 的 Python。')
    },
    seed: {min: 0, max: 2147483647, value: 2026},
    parameterLabels: {flow:bi('Flow Q (L/min)', '流量 Q（L/min）'),volume:bi('Volume V (L)', '體積 V（L）'),reaction:bi('Reaction k (1/min)', '反應 k（1/min）'),inlet:bi('Inlet concentration (g/L)', '入口濃度（g/L）'),initial:bi('Initial concentration (g/L)', '初始濃度（g/L）'),dt:bi('Time step (min)', '時間步（min）')},
    valueLabels: {},
    presets: [
      {id:'default',label:bi('Default balance', '預設平衡式'),params:{flow:2,volume:20,reaction:.05,inlet:10,initial:0,dt:.5}},
      {id:'no-reaction',label:bi('No reaction', '沒有反應'),params:{flow:2,volume:20,reaction:0,inlet:10,initial:0,dt:.5}},
      {id:'more-reaction',label:bi('Stronger reaction', '較強反應'),params:{flow:2,volume:20,reaction:.2,inlet:10,initial:0,dt:.5}},
      {id:'half-step',label:bi('Default physics, half step', '預設物理參數，步長減半'),params:{flow:2,volume:20,reaction:.05,inlet:10,initial:0,dt:.25}}
    ],
    prepare: [bi('Check Python loading before class and keep the reference CSV/notebook available. Allow more time or use a teacher projection if Python functions and arrays are unfamiliar.', '課前測試 Python 載入，準備參照 CSV／notebook。不熟悉 Python 函式與陣列時，另加練習時間或由教師投影操作。'),bi('Ask learners to export an existing workshop draft before manually changing it. This pack does not create a second draft or mark any of the workshop’s eight stages complete.', '手動改設定前，請學生先匯出已有工坊草稿。本課堂包不另建草稿，也不把原八階段自動標記完成。')],
    stages: [
      stage('predict',5,bi('Predict the long-run level', '預測長期濃度'),bi('Sketch a 20 L tank: 2 L/min enters at 10 g/L; equal outflow, reaction 0.05/min, initial concentration 0. Will concentration reach 10 g/L?', '畫出 20 L 槽：每分鐘流入 2 L、入口 10 g/L；同量流出，反應 0.05/min，初始濃度 0。濃度會達 10 g/L 嗎？'),bi('The prediction is about an invented system with a positive removal reaction. Keep it before showing the reference curve.', '這是有正反應移除項的自訂系統；展示參照曲線前保留預測。')),
      stage('balance',10,bi('State assumptions and balance mass', '寫假設，平衡質量'),bi('Write accumulation as inflow minus outflow minus reaction. Explain why volume is constant and outlet concentration equals tank concentration; check units.', '寫「累積等於流入減流出減反應」。解釋體積不變及出口濃度等於槽內濃度的條件，再核對單位。'),bi('Equal flows keep volume fixed; perfect mixing sets outlet concentration to the tank concentration; constant temperature supports a fixed reaction rate. These are assumptions, not solver guarantees.', '同量流動令體積固定，充分混合令出口濃度等於槽內濃度，定溫支持固定反應率；這些是假設，不是求解器保證。'),[String.raw`V\frac{dC}{dt}=Q(C_{\mathrm{in}}-C)-kVC`]),
      stage('implement',10,bi('Check two steps, then implement', '先手算兩步，再實作'),bi('Use the initial-value problem below to calculate two Euler steps. Complete student_model and the Euler update in student_euler using your balance.', '按下列初值問題手算兩步 Euler；按平衡式完成 student_model 及 student_euler 更新。'),bi('The hand values are 0.9 and 0.81. Divide the mass balance by volume for the rate, then use the Euler update below. A correct balance and a correct loop are separate checks.', '手算值為 0.9、0.81。把質量平衡式除以體積得到速率，再用下列 Euler 更新。平衡式與迴圈要分開核對。'),[String.raw`y'=-y,\qquad y(0)=1,\qquad h=0.1`,String.raw`y_{n+1}=y_n+h\,f(t_n,y_n)`]),
      stage('compare',15,bi('Run, change one condition, refine', '執行、改一項條件、細化'),bi('Run the default, then set reaction to 0.2 per minute. Return to default physical parameters and halve the time step to 0.25 minutes. Record your actual run’s errors and checks, including failures. If time permits, try zero reaction.', '先執行預設，再把反應率設為每分鐘 0.2。回復預設物理參數，把時間步減半至 0.25 分鐘。記下自己運行的誤差與檢查，包括失敗；有時間可試零反應。'),bi('Use the steady-concentration relation below: default gives 20/3, stronger reaction gives 10/3, zero reaction gives 10 g/L. Compare “Your Euler max error” with “Your half-step max error”; some displayed baseline checks refer to prepared reference calculations, so do not infer that every check validates learner code.', '用下列穩態濃度關係：預設為 20/3，較強反應為 10/3，零反應為 10 g/L。比較「你的 Euler 最大誤差」與「你的半步長最大誤差」；部分基準檢查來自參照計算，不能推斷所有檢查都驗證了學生程式。'),[String.raw`C_{\infty}=\frac{(Q/V)C_{\mathrm{in}}}{Q/V+k}`]),
      stage('limits',5,bi('Separate two kinds of evidence', '分開兩種證據'),bi('What would an analytic-solution match tell you? Propose one tracer observation that would challenge the perfect-mixing assumption.', '符合解析解說明甚麼？提出一項可挑戰充分混合假設的示蹤觀測。'),bi('Agreement checks implementation of the stated equation. It does not test the real tank’s mixing. A tracer experiment could compare concentration over locations or outlet response with the well-mixed prediction.', '一致結果核對指定方程的實作，未測試真實槽體混合。示蹤實驗可比較不同位置濃度或出口反應與充分混合預測。')),
      stage('export',5,bi('Leave a short evidence record', '留下簡短證據紀錄'),bi('Write one result, one check and one limitation. Answer the exit question and export the original workshop’s Draft JSON or report; do not mark the full workshop complete.', '寫一項結果、一項檢查及一項限制。回答離堂題，匯出原工坊草稿 JSON 或報告；不要把整個工坊標為完成。'),bi('Accept clearly labelled failed or unavailable runs. A precomputed reference is useful for discussion but must remain labelled as reference, never the learner’s execution.', '接受清楚標示的失敗或未能執行紀錄。預先生成參照可供討論，但必須保留參照標示，不能當成學生執行。'))
    ],
    deliverables: [bi('A mass balance with units and three assumptions; two hand-calculated Euler values.', '附單位及三項假設的質量平衡式；兩個 Euler 手算值。'),bi('An actual run or explicitly labelled reference, a refinement comparison and a limitation, exported from the original workshop where available.', '實際運行或明示參照、步長比較及一項限制；可用時由原工坊匯出。')],
    worksheet: [bi('My prediction and system boundary:', '我的預測與系統邊界：'),bi('Balance / units / assumptions:', '平衡式／單位／假設：'),bi('Two Euler hand values and update rule:', '兩個 Euler 手算值與更新式：'),bi('Settings / actual run or reference / error / failed checks:', '設定／實際運行或參照／誤差／失敗檢查：'),bi('One result, one check, one limitation and exit response:', '一項結果、一項檢查、一項限制與離堂回答：')],
    exit: bi('Your numerical curve matches the analytic curve. Does that establish perfect mixing in a real tank? What further evidence is needed?', '數值曲線符合解析曲線，能否證明真實槽體充分混合？還需要甚麼證據？'),
    exitAnswer: bi('No. It checks the chosen equation’s implementation. A physical observation, such as a tracer experiment testing spatial concentration or outlet response, is needed to assess mixing.', '不能。它核對所選方程的實作；要評估混合，需要示蹤實驗等物理觀測，例如空間濃度或出口反應。'),
    misconceptions: [bi('A smooth or stable curve establishes a correct physical model.', '平滑或穩定曲線就證明物理模型正確。'),bi('A smaller time step repairs a missing reaction term.', '縮短步長會修正遺漏的反應項。'),bi('A prepared reference figure is evidence that I ran my code.', '預先生成參照圖證明我執行了自己的程式。')],
    records: bi('Use the original workshop’s Draft JSON export/import and report. Drafts stay in this browser; the classroom page never reads or writes them. When storage is unavailable, the workshop labels session-only memory and provides export. Export before changing device.', '沿用原工坊的草稿 JSON 匯出／匯入及報告。草稿只留在此瀏覽器，課堂頁不讀寫它。儲存不可用時，工坊會標明僅限工作階段並提供匯出；換裝置前請先匯出。'),
    background: [{path:'/writing/modeling-workflow/',label:bi('Reading: from question to reproducible model', '閱讀：由問題到可重現模型')},{path:'/concepts/validation/',label:bi('Concept guide: validation and its limits', '概念導讀：驗證及其限制')}],
    provenance: bi('Sequence adapted from workshop-01 “A tank, a boundary, a balance”, v1.0.0, its existing exercise and reference assets. The 50-minute pacing is an introductory lesson plan; nondimensionalization, failure experiments and extended writing remain in the full workshop.', '次序取自 workshop-01「混合槽：從系統邊界到守恆」v1.0.0 及現有練習、參照資產。50 分鐘是入門編排；無量綱化、失效實驗與長篇寫作仍留在完整工坊。')
  }
];

export const getClassroomPack = id => CLASSROOM_PACKS.find(pack => pack.id === id) || null;
export function classroomPackHref(id, locale = 'en', teacher = false) {
  if (!getClassroomPack(id)) throw new Error(`Unknown classroom pack: ${id}`);
  return `${locale === 'zh-Hant' ? '/zh' : ''}/teaching/classroom-packs/${id}/${teacher ? 'teacher/' : ''}`;
}
export const classroomEngineHref = (pack, locale = 'en') => `${pack.engine.localized && locale === 'zh-Hant' ? '/zh' : ''}${pack.engine.path}`;

/** Only a preset ID and bounded integer seed may enter a share URL. Never accepts progress. */
export function normalizeClassroomSettings(id, raw = {}) {
  const pack = getClassroomPack(id);
  if (!pack) throw new Error(`Unknown classroom pack: ${id}`);
  const preset = pack.presets.some(item => item.id === raw?.preset) ? raw.preset : pack.presets[0].id;
  const text = String(raw?.seed ?? '');
  const number = /^\d{1,10}$/.test(text) ? Number(text) : NaN;
  const seed = Number.isSafeInteger(number) && number >= pack.seed.min && number <= pack.seed.max ? number : pack.seed.value;
  return {preset, seed};
}
export function classroomSharePath(id, raw = {}, locale = 'en') {
  const settings = normalizeClassroomSettings(id, raw);
  return `${classroomPackHref(id, locale)}?${new URLSearchParams({preset:settings.preset,seed:String(settings.seed)})}`;
}
export function classroomSettingRows(id, raw = {}, locale = 'en') {
  const pack = getClassroomPack(id);
  const settings = normalizeClassroomSettings(id, raw);
  const preset = pack.presets.find(item => item.id === settings.preset);
  return [...Object.entries(preset.params).map(([key,value]) => ({key,label:pack.parameterLabels[key][locale],value:pack.valueLabels[String(value)]?.[locale] || String(value)})),{key:'seed',label:locale==='zh-Hant'?'實驗種子':'Experiment seed',value:String(settings.seed)}];
}
