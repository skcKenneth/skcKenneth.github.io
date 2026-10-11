import { canonicalId } from './site-reader.mjs';

// Editorial reading guides summarize the paired article bodies, not new research results.
// Keys are shared article IDs; translated display slugs do not determine the pairing.
export const READER_GUIDES = {
  'two-networks-one-spectrum-different-alarms': {
    en: {
      question: 'How can identical eigenvalues and total-mass decay produce different finite-time alarms?',
      takeaways: [
        'Separate eventual decay from the peak at one sensor before a deadline.',
        'Follow transport routes to see how arrival times change while mass accounting stays the same.',
        'Read successful decision bounds alongside the cases where they remain inconclusive.'
      ],
      audience: 'Readers interested in networks, modelling and risk decisions.',
      prerequisite: 'Network diagrams and exponential decay help; the derivations use linear algebra.',
      evidence: 'This is a controlled synthetic transport study: its compact exact formula assumes an acyclic network, equal transient holding rates and uniform removal, and its thresholds are research choices rather than safety limits.'
    },
    'zh-Hant': {
      question: '相同特徵值與總量衰減，如何出現不同的限時警報？',
      takeaways: [
        '分清最終會衰減，與指定感測器在限時內的峰值。',
        '沿輸運路徑追蹤到達時間，看看總量帳目相同時，局部讀數如何改變。',
        '把成功的決策界限，與仍然無法判定的案例一起閱讀。'
      ],
      audience: '對網絡、數學建模與風險判斷有興趣的讀者。',
      prerequisite: '網絡圖與指數衰減有助理解；推導部分用到線性代數。',
      evidence: '這是受控合成輸運研究：簡潔的精確公式依賴無環網絡、各暫態節點相同的總轉移率及均勻移除，警報門檻是研究設定，並非安全限值。'
    }
  },
  'how-many-equilibria-did-the-optimizer-miss': {
    en: {
      question: 'How do we know which equilibria an optimizer’s folding-shape map contains?',
      takeaways: [
        'Distinguish minima, saddles and the lowest known energy before counting shapes.',
        'Keep the negative result: in the tested settings, the fixed main starts recovered every stable reference state.',
        'See how load patterns, initialization and additional shape modes change discovery and stability.'
      ],
      audience: 'Readers of numerical modelling, mechanics and computational research.',
      prerequisite: 'Functions, derivatives and local minima; Hessians and eigenvalues support the detailed checks.',
      evidence: 'Independent completeness checks concern the declared two-mode controls; higher-mode refinements are local checks, and the reduced static energy does not validate physical transition paths.'
    },
    'zh-Hant': {
      question: '怎樣知道優化器的折疊形狀圖涵蓋了哪些平衡態？',
      takeaways: [
        '先分清極小值、鞍點與最低已知能量，再數圖中有多少形狀。',
        '保留負面結果：在受測設定中，固定主要起點找回了全部穩定參考態。',
        '檢查載荷圖案、初值及新增形狀模態，如何改變發現與穩定性。'
      ],
      audience: '對數值建模、力學與計算研究有興趣的讀者。',
      prerequisite: '函數、導數與局部極小值；細節檢查用到 Hessian 及特徵值。',
      evidence: '獨立完整性檢查限於指定的兩模態控制；高模態細化屬局部檢查，而約化靜態能量未驗證實際物理轉變路徑。'
    }
  },
  'what-must-a-traffic-model-remember': {
    en: {
      question: 'When a traffic model sees only part of the state, can history improve forecasts and stability diagnosis?',
      takeaways: [
        'Separate the headway-only control from the main comparison retaining both headway and velocity modes.',
        'Separate forecasting error, stability signs and the benefit of smoothing noisy observations.',
        'Inspect the cost of longer histories and their sensitivity to numerical errors.'
      ],
      audience: 'Readers interested in prediction, model reduction and traffic dynamics.',
      prerequisite: 'Functions and time-series graphs; the derivations use linear algebra and Fourier modes.',
      evidence: 'All trajectories come from a synthetic 24-car ring model; fitted VAR histories are predictive approximations rather than a certified exact memory kernel, and no road-control intervention is evaluated.'
    },
    'zh-Hant': {
      question: '交通模型只看見部分狀態時，歷史能否改善預測與穩定性判斷？',
      takeaways: [
        '分清只觀察車距的控制例子，與同時保留車距、速度模態的主要比較。',
        '分開比較預測誤差、穩定性符號，以及平滑觀測雜訊帶來的改善。',
        '檢查更長歷史的計算成本，以及它對數值誤差的敏感性。'
      ],
      audience: '對預測、模型約化與交通動態有興趣的讀者。',
      prerequisite: '函數與時間序列圖；推導部分用到線性代數及 Fourier 模態。',
      evidence: '所有軌跡來自合成的 24 車環形模型；擬合 VAR 歷史屬預測近似，未獲認證等於精確記憶核，研究亦未評估道路控制措施。'
    }
  },
  'when-the-fit-is-not-the-model': {
    en: {
      question: 'When different parameters fit equally well, which new observations can distinguish them?',
      takeaways: [
        'Look beyond one optimum to the ridge of parameter values that explain similar data.',
        'Distinguish structural identifiability from the information available in a particular experiment.',
        'Choose new measurements where plausible parameter explanations disagree.'
      ],
      audience: 'Students and readers who fit or interpret mathematical models.',
      prerequisite: 'Graphs and parameter fitting; derivatives help with the uncertainty discussion.',
      evidence: 'The demonstration uses deterministic pseudo-noise and a finite grid for a known two-parameter response; its near-optimal count is a visual diagnostic, not a confidence region or proof of structural non-identifiability.'
    },
    'zh-Hant': {
      question: '不同參數都擬合得好，哪些新觀測能分辨它們？',
      takeaways: [
        '不只看一個最優點，也看能解釋相近資料的整條參數谷脊。',
        '分清結構可識別性，與某次實驗實際提供的資訊。',
        '在合理參數解釋互相分歧的位置，安排新的量度。'
      ],
      audience: '需要擬合或解讀數學模型的學生與讀者。',
      prerequisite: '圖像與參數擬合概念；導數有助理解不確定性部分。',
      evidence: '示範採用確定性偽雜訊及已知雙參數反應的有限網格；近似最優數量是視覺診斷，並非置信區域，也未證明結構不可識別。'
    }
  },
  'random-stress-tests-are-not-certificates': {
    en: {
      question: 'What separates a severe observed case from a bound on the worst case over an entire set?',
      takeaways: [
        'For a maximum, the best evaluated point supplies a feasible lower bound.',
        'A certificate also needs a valid upper bound over the remaining set and a declared gap.',
        'Interpret fixed sampling and local-search outcomes within their recorded designs.'
      ],
      audience: 'Readers interested in uncertainty, optimization and computational evidence.',
      prerequisite: 'Maxima, derivative signs and the meaning of a numerical bound.',
      evidence: 'One synthetic dimensionless function on a declared box is enclosed within a gap below 10⁻⁶; the fixed zero-hit sampling results establish no general miss probability, and the calculation supplies no physical reactor-safety evidence.'
    },
    'zh-Hant': {
      question: '找到很壞的案例，與包住整個集合的最壞情況，差在哪裏？',
      takeaways: [
        '對最大值而言，已評估點中的最佳值提供一個可行下界。',
        '證書還需要包住其餘集合的有效上界，以及事先指定的界限差距。',
        '按已記錄的設計，解讀固定抽樣與局部搜尋的結果。'
      ],
      audience: '對不確定性、最佳化與計算證據有興趣的讀者。',
      prerequisite: '最大值、導數符號，以及數值界限的意思。',
      evidence: '研究在指定 box 內，將一個合成無量綱函數的最大值包在低於 10⁻⁶ 的差距內；固定抽樣零命中未建立一般漏檢機率，計算亦未提供實體反應器安全證據。'
    }
  },
  'when-solar-power-changes-fast': {
    en: {
      question: 'After intervals improve, are they reliable enough during solar ramps and missing inputs?',
      takeaways: [
        'Compare average improvement with coverage in the hardest eligible groups.',
        'Read coverage together with interval width, proper scores and forecast availability.',
        'Separate independent stations, future event labels and the cases missing-data records can support.'
      ],
      audience: 'Readers of forecasting, uncertainty and student research.',
      prerequisite: 'Percentages and prediction intervals; the article explains calibration and coverage.',
      evidence: 'The audit uses public 2019–2020 observations from five confirmation stations; every deployable candidate still fails the absolute reliability check, and origins without current power are excluded.'
    },
    'zh-Hant': {
      question: '區間改善之後，在功率急變及輸入缺失時，是否已足夠可靠？',
      takeaways: [
        '把平均改善，與最困難合資格群組的覆蓋率分開比較。',
        '一起閱讀覆蓋率、區間闊度、適當評分及預測可用率。',
        '分清獨立站點、未來事件標籤，以及缺失資料足以支持哪些比較。'
      ],
      audience: '對預測、不確定性與學生研究有興趣的讀者。',
      prerequisite: '百分比與預測區間；正文會解釋校準及覆蓋率。',
      evidence: '審核使用五個確認站點的 2019–2020 公開觀測；所有可部署候選仍未通過絕對可靠性檢查，缺少當前功率的預測起點亦被排除。'
    }
  }
};

export const READER_GUIDE_IDS = Object.keys(READER_GUIDES);

export function getReaderGuide(data, locale = 'en') {
  const id = typeof data === 'string' ? data : canonicalId(data || {});
  return READER_GUIDES[id]?.[locale] || null;
}
