// Explicit editorial pairs checked against Astro's actual heading IDs. Never paired by ordinal position.
export const READER_SECTIONS = {
  'two-networks-one-spectrum-different-alarms': [
    { id: 'sensor-question', en: 'what-the-sensor-asks-is-not-what-stability-asks', 'zh-Hant': '感測器問的問題不是穩定性問的問題' },
    { id: 'route-spectrum', en: 'a-spectrum-can-stay-fixed-while-routes-change', 'zh-Hant': '路線變了整組特徵值仍可以不變' },
    { id: 'prediction-bound', en: 'a-bound-answers-a-different-question-from-a-prediction', 'zh-Hant': '界限回答的問題與預測不同' },
    { id: 'model-limits', en: 'what-the-model-leaves-outside', 'zh-Hant': '模型刻意沒有回答甚麼' },
    { id: 'references', en: 'references', 'zh-Hant': '參考文獻' }
  ],
  'how-many-equilibria-did-the-optimizer-miss': [
    { id: 'stationary-shape', en: 'a-stationary-shape-is-not-necessarily-a-resting-place', 'zh-Hant': '停在原地不一定是停在谷底' },
    { id: 'energy-model', en: 'start-with-an-energy-whose-terms-can-be-checked', 'zh-Hant': '先寫清楚能量再談形狀' },
    { id: 'initialization', en: 'starting-guesses-are-part-of-the-scientific-comparison', 'zh-Hant': '初值也是研究設定的一部分' },
    { id: 'numerical-error', en: 'integration-error-can-imitate-a-model-change', 'zh-Hant': '積分誤差也能看起來像模型變化' },
    { id: 'references', en: 'references', 'zh-Hant': '參考文獻' }
  ],
  'what-must-a-traffic-model-remember': [
    { id: 'ring-model', en: 'a-ring-road-with-an-explicitly-chosen-observation', 'zh-Hant': '一條可以仔細檢查的環形道路' },
    { id: 'driver-order', en: 'driver-order-changes-the-projection-but-not-this-full-spectrum', 'zh-Hant': '同一批駕駛員換位置真實邊界竟然不變' },
    { id: 'noise-history', en: 'noise-can-make-useful-history-look-like-physical-memory', 'zh-Hant': '雜訊也會令歷史變得有用' },
    { id: 'nonlinear-errors', en: 'nonlinear-stress-tests-expose-a-numerical-limit-too', 'zh-Hant': '非線性壓力測試也要先分清數值誤差' },
    { id: 'history-cost', en: 'history-is-measured-in-seconds-and-it-has-a-cost', 'zh-Hant': '記住更多未必代表模型更小' },
    { id: 'references', en: 'references', 'zh-Hant': '參考文獻' }
  ],
  'when-the-fit-is-not-the-model': [
    { id: 'fit-ridge', en: 'a-ridge-hidden-behind-one-optimum', 'zh-Hant': '一個最優點背後隱藏的山脊' },
    { id: 'identifiability', en: 'structural-and-practical-identifiability-are-different-questions', 'zh-Hant': '結構與實務可識別性是不同問題' },
    { id: 'hessian', en: 'why-a-hessian-can-look-more-certain-than-the-problem', 'zh-Hant': '為何-hessian-會令問題看起來比實際更確定' },
    { id: 'experiment-design', en: 'turn-non-identifiability-into-an-experimental-design-problem', 'zh-Hant': '把不可識別性轉化成實驗設計問題' },
    { id: 'demonstration-limits', en: 'what-this-demonstration-does-not-establish', 'zh-Hant': '這個示範沒有證明甚麼' },
    { id: 'references', en: 'references', 'zh-Hant': '參考文獻' }
  ],
  'random-stress-tests-are-not-certificates': [
    { id: 'certified-sampled', en: 'what-was-certifiedand-what-was-only-sampled', 'zh-Hant': '甚麼得到證明甚麼只經抽樣' },
    { id: 'literature', en: 'why-the-literature-changed-the-question', 'zh-Hant': '文獻如何改變研究問題' },
    { id: 'objective', en: 'the-synthetic-objective-and-its-boundary', 'zh-Hant': 'synthetic-objective-與物理邊界' },
    { id: 'certificate-validation', en: 'what-validates-the-certificate', 'zh-Hant': '如何核對-certificate' },
    { id: 'probability-claims', en: 'what-a-probability-claim-would-require', 'zh-Hant': '機率聲稱需要另一種實驗' },
    { id: 'references', en: 'references', 'zh-Hant': '參考文獻' }
  ],
  'when-solar-power-changes-fast': [
    { id: 'findings', en: 'what-the-solar-experiment-found', 'zh-Hant': '這個太陽能實驗發現了甚麼' },
    { id: 'coverage', en: 'what-does-the-90-actually-describe', 'zh-Hant': '90-究竟描述了甚麼' },
    { id: 'calibration', en: 'how-the-calibration-changes-the-interval', 'zh-Hant': '校準如何改變預測區間' },
    { id: 'expansion-methods', en: 'four-ways-to-decide-how-much-expansion-is-needed', 'zh-Hant': '四種決定擴張幅度的方法' },
    { id: 'removed-inputs', en: 'what-was-actually-removed-from-the-inputs', 'zh-Hant': '感測壓力測試究竟移除了甚麼' },
    { id: 'reliability', en: 'improvement-is-a-comparison-reliability-is-a-requirement', 'zh-Hant': '改善是一個比較可靠性是一個要求' },
    { id: 'references', en: 'references', 'zh-Hant': '參考文獻' }
  ]
};
export function getReaderSections(articleId, locale, headings) {
  const sections = READER_SECTIONS[articleId] || [];
  for (const section of sections) if (!headings.some(heading => heading.slug === section[locale])) {
    throw new Error(`Reader section ${articleId}/${section.id}/${locale} does not match a rendered heading`);
  }
  return sections;
}
