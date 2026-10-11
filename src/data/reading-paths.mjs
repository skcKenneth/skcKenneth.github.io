import { canonicalId, localeBase, readingMinutes } from './site-reader.mjs';

// Curated order and editorial pointers refer to published articles by shared ID.
// Article titles, translated slugs and reading times are always resolved from content.
export const READING_PATHS = [
  {
    id: 'model-trust',
    topicIds: ['risk-decisions', 'data-ai', 'dynamics-networks'],
    title: { en: 'When can we trust a model?', 'zh-Hant': '甚麼時候可以相信模型？' },
    description: { en: 'From a convincing fit to a useful guarantee: ask what the observations, evaluation and bounds actually establish.', 'zh-Hant': '由漂亮擬合走到有用的保證，逐步問清觀測、評估與界限究竟支持甚麼。' },
    boundary: { en: 'These articles examine different models and evidence. Their numerical scores do not form a shared benchmark, and their guarantees keep their stated assumptions.', 'zh-Hant': '各篇研究使用不同模型與證據，數值分數不能當成共同排名；保證亦只在各自列明的假設內成立。' },
    steps: [
      {
        articleId: 'when-the-fit-is-not-the-model',
        purpose: { en: 'See why several parameter explanations can fit the same observations, then ask where a new measurement could separate them.', 'zh-Hant': '理解多組參數為何能解釋相近觀測，再問哪些新量度可以分辨它們。' },
        prerequisite: { en: 'Graphs and the idea of fitting parameters. Derivatives help with the detailed uncertainty discussion.', 'zh-Hant': '圖像與參數擬合概念；導數有助理解較深入的不確定性討論。' },
        boundary: { en: 'A finite-grid demonstration with deterministic pseudo-noise is not a confidence region or a proof of structural non-identifiability.', 'zh-Hant': '有限網格與確定性偽雜訊只作示範，不是置信區域，也未證明結構不可識別。' }
      },
      {
        articleId: 'when-solar-power-changes-fast',
        purpose: { en: 'Distinguish improvement over a baseline from meeting a reliability requirement in the hardest eligible groups.', 'zh-Hant': '分清較基準改善，與在最困難合資格群組符合可靠性要求。' },
        prerequisite: { en: 'Percentages and prediction intervals. The article introduces calibration and coverage.', 'zh-Hant': '百分比與預測區間概念；正文會介紹校準及覆蓋率。' },
        boundary: { en: 'No deployable candidate clears the absolute criterion in the five confirmation stations; origins without current power are excluded.', 'zh-Hant': '五個確認站點中，所有可部署候選均未通過絕對準則；缺少當前功率的預測起點被排除。' }
      },
      {
        articleId: 'random-stress-tests-are-not-certificates',
        purpose: { en: 'Separate the best evaluated value from a valid upper bound over the entire declared set.', 'zh-Hant': '分清已評估點中的最佳值，與包住整個指定集合的有效上界。' },
        prerequisite: { en: 'Maxima, derivative signs and the meaning of a numerical bound.', 'zh-Hant': '最大值、導數符號，以及數值界限的意思。' },
        boundary: { en: 'The certificate concerns one synthetic dimensionless function. Fixed zero-hit designs establish no general miss probability or reactor-safety claim.', 'zh-Hant': '證書只針對一個合成無量綱函數；固定零命中設計未建立一般漏檢機率或反應器安全結論。' }
      },
      {
        articleId: 'two-networks-one-spectrum-different-alarms',
        optional: true,
        purpose: { en: 'Apply the distinction to a specified sensor, deadline and threshold, and see why a valid bound can still leave a decision unresolved.', 'zh-Hant': '把問題落到指定感測器、期限與門檻，理解有效界限為何仍可能無法判定。' },
        prerequisite: { en: 'Network diagrams and exponential decay; the detailed derivations use linear algebra.', 'zh-Hant': '網絡圖與指數衰減；詳細推導使用線性代數。' },
        boundary: { en: 'The compact exact formula assumes an acyclic equal-holding-rate network with uniform removal. The alarm thresholds are research choices, not safety limits.', 'zh-Hant': '簡潔精確公式依賴無環、相同等待率及均勻移除；警報門檻是研究設定，並非安全限值。' }
      }
    ]
  },
  {
    id: 'city-models',
    topicIds: ['cities-engineering', 'computation-code', 'risk-decisions'],
    title: { en: 'City models: from forecasts to decisions', 'zh-Hant': '城市模型：由預測走到判斷' },
    description: { en: 'Start with a classroom timetable, then examine missing traffic states, numerical event errors and the limits of model reduction.', 'zh-Hant': '由課室時間表出發，再檢查交通中缺失的狀態、數值事件誤差，以及模型約化的限制。' },
    boundary: { en: 'The ventilation and traffic articles are separate synthetic studies. They do not share one physical model or establish field performance, policy value or safety.', 'zh-Hant': '通風與交通文章屬不同合成研究，並非同一物理模型，也未建立實地表現、政策效益或安全保證。' },
    steps: [
      {
        articleId: 'when-the-timetable-lies',
        purpose: { en: 'See how room changes and shared fan limits challenge a forecast, and what an occupancy buffer costs.', 'zh-Hant': '看看調課與共用風量限制如何挑戰預測，以及人數餘量需要付出甚麼代價。' },
        prerequisite: { en: 'Proportions, graphs and a simple balance of what enters and leaves a room.', 'zh-Hant': '比例、圖像，以及房間內輸入與流出的簡單收支概念。' },
        boundary: { en: 'Results come from the study’s own synthetic generator. Fan energy is a proxy and independent field validation is still needed.', 'zh-Hant': '結果來自研究自建的合成生成器；風機能耗屬代理量，仍需要獨立實地驗證。' }
      },
      {
        articleId: 'what-must-a-traffic-model-remember',
        purpose: { en: 'Separate omitted state information, projection-induced memory and noise when a longer history improves predictions.', 'zh-Hant': '當較長歷史改善預測時，分清省略狀態、投影產生的記憶與觀測雜訊。' },
        prerequisite: { en: 'Functions and time-series graphs; linear algebra and Fourier modes support the derivations.', 'zh-Hant': '函數與時間序列圖；推導部分使用線性代數及 Fourier 模態。' },
        boundary: { en: 'The main comparison retains both headway and velocity modes in a synthetic 24-car ring. Fitted histories are not certified exact memory kernels.', 'zh-Hant': '主要比較在合成 24 車環路中同時保留車距與速度模態；擬合歷史未獲認證等於精確記憶核。' }
      },
      {
        articleId: 'when-a-traffic-solver-invents-a-jam',
        purpose: { en: 'Check whether a small final global error also supports a threshold arrival time or a queue measure.', 'zh-Hant': '檢查很小的最終整體誤差，是否亦能支持門檻到達時間或排隊指標。' },
        prerequisite: { en: 'Conservation and moving fronts. The finite-volume and differential-equation details are a deeper layer.', 'zh-Hant': '守恆與移動前緣概念；有限體積與微分方程細節可再深入閱讀。' },
        boundary: { en: 'This dimensionless LWR benchmark retains a failed predeclared criterion. It is neither real traffic evidence nor a universal ranking of solvers.', 'zh-Hant': '這個無量綱 LWR 基準保留預先指定判準失敗的結果，並非真實交通證據或求解器的普遍排名。' }
      },
      {
        articleId: 'when-a-reduced-ventilation-model-leaves-its-training-regime',
        optional: true,
        purpose: { en: 'Ask whether a reduced model passes the nominal control before attributing errors to a change of regime.', 'zh-Hant': '先問降階模型能否通過名義控制，再判斷誤差是否由運作範圍改變造成。' },
        prerequisite: { en: 'Matrices and approximation error; POD and DEIM are advanced details.', 'zh-Hant': '矩陣與近似誤差概念；POD 及 DEIM 屬進階細節。' },
        boundary: { en: 'Both reduced models already fail the nominal holdout, so shifted trajectories remain diagnostics. This is not a CO₂ or infection-risk validation.', 'zh-Hant': '兩個降階模型在名義 holdout 已失敗，轉移軌跡只能作診斷；研究不是 CO₂ 或感染風險驗證。' }
      }
    ]
  }
];

export const READING_PATH_IDS = READING_PATHS.map(path => path.id);

/** Missing, archived or draft sources suppress the whole path rather than leave broken steps. */
export function resolveReadingPath(id, entries, locale = 'en') {
  const source = READING_PATHS.find(path => path.id === id);
  if (!source || !['en', 'zh-Hant'].includes(locale)) return null;
  const base = localeBase(locale);
  const steps = source.steps.flatMap((step, index) => {
    const entry = entries.find(item => !item.data.draft && !item.data.archived && canonicalId(item.data) === step.articleId);
    return entry ? [{ articleId: step.articleId, optional: Boolean(step.optional), position: index + 1, entry, title: entry.data.title, href: `${base}/writing/${entry.data.slug}/`, minutes: readingMinutes(entry, locale), purpose: step.purpose[locale], prerequisite: step.prerequisite[locale], boundary: step.boundary[locale] }] : [];
  });
  if (steps.length !== source.steps.length) return null;
  const coreSteps = steps.filter(step => !step.optional);
  return { id: source.id, topicIds: source.topicIds, title: source.title[locale], description: source.description[locale], boundary: source.boundary[locale], href: `${base}/topics/routes/${source.id}/`, steps, first: steps[0], coreCount: coreSteps.length, coreMinutes: coreSteps.reduce((total, step) => total + step.minutes, 0), totalMinutes: steps.reduce((total, step) => total + step.minutes, 0) };
}

export function getReadingPaths(entries, locale = 'en') {
  return READING_PATH_IDS.flatMap(id => {
    const path = resolveReadingPath(id, entries, locale);
    return path ? [path] : [];
  });
}

export function getArticleReadingPaths(data, entries, locale = 'en') {
  const id = canonicalId(data);
  return getReadingPaths(entries, locale).flatMap(path => {
    const currentIndex = path.steps.findIndex(step => step.articleId === id);
    return currentIndex < 0 ? [] : [{ ...path, current: path.steps[currentIndex], next: path.steps[currentIndex + 1] || null, coreFinished: currentIndex >= path.coreCount - 1 }];
  });
}
