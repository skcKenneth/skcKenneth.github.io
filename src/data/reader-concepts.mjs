import { canonicalId, localeBase } from './site-reader.mjs';

/** @typedef {'en'|'zh-Hant'} ReaderLocale */
/** @typedef {{definition:string,example:string,misconception:string,scope:string}} ConceptCopy */
/** @typedef {{id:string,label:Record<ReaderLocale,string>,aliases:Record<ReaderLocale,string[]>,topicIds:string[],copy:Record<ReaderLocale,ConceptCopy>,sources:{title:string,url:string,publisher:string,scope:string}[],articleIds:string[],resources?:{label:Record<ReaderLocale,string>,href:Record<ReaderLocale,string>}[]}} ReaderConcept */

/** Reader-facing paraphrases, with domain limits retained alongside each example. @type {ReaderConcept[]} */
export const CONCEPTS = [
  {
    id: 'baseline', label: {en:'Baseline','zh-Hant':'基準'}, aliases: {en:['reference method','comparator'],'zh-Hant':['參照方法','比較基準']},
    topicIds: ['teaching-research-practice','computation-code'],
    copy: {
      en: {
        definition: 'A declared reference method or case used to judge another result, with the comparison conditions made explicit.',
        example: 'The folding study compares independent multistart with continuation while disclosing starting budgets and access to states from previous loads.',
        misconception: 'Beating a baseline proves the answer complete or the method universally superior.',
        scope: 'The reference answers a specified comparison question. Differences in information, initialization and computational cost still need to be reported.'
      },
      'zh-Hant': {
        definition: '用來比較另一結果的指定參照方法或情況；比較條件必須清楚交代。',
        example: '折疊研究比較獨立多初值搜尋與延續法，同時交代初值預算及是否使用上一載荷的狀態。',
        misconception: '超越基準，就代表答案完整或方法普遍較好。',
        scope: '參照方法回答的是指定比較問題；資訊、初始化及計算成本的差異仍須交代。'
      }
    },
    sources: [{title:'Machine Learning Glossary — baseline',url:'https://developers.google.com/machine-learning/glossary#baseline',publisher:'Google for Developers',scope:'Reference models in machine learning; the article example extends the comparison idea to numerical workflows.'}],
    articleIds: ['how-many-equilibria-did-the-optimizer-miss','what-must-a-traffic-model-remember','when-solar-power-changes-fast']
  },
  {
    id: 'assumption', label: {en:'Assumption','zh-Hant':'假設'}, aliases: {en:['model assumption'],'zh-Hant':['模型假設','前提']},
    topicIds: ['mathematical-thinking','teaching-research-practice'],
    copy: {
      en: {
        definition: 'A condition taken as given when constructing a model or argument; its conclusions depend on the relevant conditions holding.',
        example: 'The matched network construction uses acyclic routing, equal total transfer rates at transient nodes and uniform removal.',
        misconception: 'A plausible assumption is an observed fact.',
        scope: 'These restrictions belong to this network construction. Other models and methods require their own assumptions; no single list applies to every analysis.'
      },
      'zh-Hant': {
        definition: '建立模型或推論時採用的條件；結論取決於相關條件是否成立。',
        example: '配對網絡構造採用無環路由、暫態節點相同的總轉移率，以及均勻移除。',
        misconception: '假設合理，就等於已經觀察證實。',
        scope: '這些限制屬於該網絡構造；其他模型與方法需要各自的假設，沒有一份清單適用於所有分析。'
      }
    },
    sources: [{title:'Typical underlying assumptions in process modeling',url:'https://www.itl.nist.gov/div898/handbook/pmd/section2/pmd21.htm',publisher:'NIST/SEMATECH',scope:'Assumptions of statistical process-modeling methods, rather than a universal list for all models.'}],
    articleIds: ['two-networks-one-spectrum-different-alarms','random-stress-tests-are-not-certificates']
  },
  {
    id: 'sensitivity', label: {en:'Sensitivity','zh-Hant':'敏感度'}, aliases: {en:['sensitivity analysis','numerical sensitivity'],'zh-Hant':['敏感度分析','敏感性','數值敏感度']},
    topicIds: ['computation-code','risk-decisions'],
    copy: {
      en: {
        definition: 'How a chosen output or conclusion changes when specified inputs or settings change. Global sensitivity analysis can attribute output uncertainty to uncertain inputs.',
        example: 'The folding study refines numerical integration to check whether computed coefficients, energies and events change.',
        misconception: 'Stability under one small change establishes insensitivity everywhere.',
        scope: 'This example is a numerical sensitivity check, not a global variance decomposition. Agreement on known roots does not enumerate unknown branches.'
      },
      'zh-Hant': {
        definition: '指定輸入或設定改變時，某個輸出或結論如何改變。全域敏感度分析亦可分辨輸入對輸出不確定性的貢獻。',
        example: '折疊研究細化數值積分，檢查計算所得的係數、能量與事件有沒有改變。',
        misconception: '一次小改動沒有影響，就代表任何範圍都不敏感。',
        scope: '此例是數值敏感度檢查，並非全域變異分解；已知根彼此吻合，也不代表已枚舉未知分支。'
      }
    },
    sources: [{title:'Sensitivity Analysis: SAMO',url:'https://joint-research-centre.ec.europa.eu/sensitivity-analysis-samo_en',publisher:'European Commission Joint Research Centre',scope:'Sensitivity and uncertainty analysis of model inputs and outputs; numerical refinement is identified separately in this example.'}],
    articleIds: ['how-many-equilibria-did-the-optimizer-miss','what-must-a-traffic-model-remember','when-solar-power-changes-fast']
  },
  {
    id: 'identifiability', label: {en:'Identifiability','zh-Hant':'可辨識性'}, aliases: {en:['structural identifiability','practical identifiability'],'zh-Hant':['可識別性','結構可識別性','實務可識別性']},
    topicIds: ['data-ai','teaching-research-practice'],
    copy: {
      en: {
        definition: 'Whether the specified model, inputs and observations can distinguish parameter values. Structural identifiability asks about ideal information; practical identifiability asks what the actual finite, noisy experiment determines.',
        example: 'Low-substrate observations of the saturation response can constrain the ratio of its two parameters more strongly than either parameter separately.',
        misconception: 'A small residual proves unique parameters, or a ridge on a finite grid proves structural non-identifiability.',
        scope: 'The browser demonstration concerns a known two-parameter response. Its near-optimal count is a visual diagnostic, not a confidence region or a structural proof.'
      },
      'zh-Hant': {
        definition: '在指定模型、輸入與觀測下，能否分辨不同參數。結構可識別性考慮理想資訊；實務可識別性考慮實際有限、帶雜訊的實驗。',
        example: '飽和反應在低基質濃度下的觀測，可能主要約束兩個參數的比值，而非分別確定它們。',
        misconception: '殘差小就代表參數唯一；有限網格上的谷脊就證明結構不可識別。',
        scope: '瀏覽器示範採用已知雙參數反應；近似最優數量是視覺診斷，並非置信區域或結構證明。'
      }
    },
    sources: [{title:'Structural and practical identifiability analysis of partially observed dynamical models by exploiting the profile likelihood',url:'https://pubmed.ncbi.nlm.nih.gov/19505944/',publisher:'Raue et al., Bioinformatics (2009)',scope:'Original research separating structural relationships from practical limits due to the amount and quality of data.'}],
    articleIds: ['when-the-fit-is-not-the-model'],
    resources: [{label:{en:'Explore the identifiability laboratory','zh-Hant':'探索可識別性實驗（英文互動）'},href:{en:'/teaching/research-inquiry-studio/#identifiability','zh-Hant':'/teaching/research-inquiry-studio/#identifiability'}}]
  },
  {
    id: 'calibration', label: {en:'Calibration','zh-Hant':'校準'}, aliases: {en:['interval calibration','prediction calibration'],'zh-Hant':['預測區間校準','區間校準']},
    topicIds: ['data-ai','risk-decisions'],
    copy: {
      en: {
        definition: 'For prediction intervals here, using held-out observed errors to adjust a band toward a stated coverage target.',
        example: 'The solar experiment holds the underlying forecaster fixed and uses calibration scores to adjust how much its intervals expand.',
        misconception: 'A nominal 90% interval guarantees 90% coverage in every event group or future setting.',
        scope: 'The original CQR result assumes exchangeability and gives marginal coverage. Its guarantee is not automatically inherited by this time-series pipeline; the evaluated deployable candidates all still fail the article’s absolute reliability check. Metrological calibration has a different formal meaning and is not the same as adjusting an instrument.'
      },
      'zh-Hant': {
        definition: '在本站預測區間的語境，利用預留觀測誤差調整區間，以對準指定覆蓋率目標。',
        example: '太陽能實驗固定底層預測器，利用校準分數調整區間擴張幅度。',
        misconception: '標示 90% 就保證每個事件組別及未來情況都有 90% 覆蓋。',
        scope: '原始 CQR 結果假設交換性，提供邊際覆蓋；此時序程序不會自動承繼該保證，受評估的可部署候選方法仍全部未通過文章的絕對可靠性檢查。計量學校準有不同正式定義，亦不等同調整儀器。'
      }
    },
    sources: [
      {title:'Conformalized Quantile Regression',url:'https://proceedings.neurips.cc/paper/8613-conformalized-quantile-regression.pdf',publisher:'Romano, Patterson and Candès, NeurIPS (2019)',scope:'Original CQR method and its exchangeability-based marginal coverage result; not a guarantee for every subgroup or arbitrary time series.'},
      {title:'VIM 2.39 — calibration',url:'https://jcgm.bipm.org/vim/en/2.39.html',publisher:'JCGM/BIPM',scope:'Metrological calibration; included to distinguish this meaning from prediction-interval calibration and instrument adjustment.'}
    ],
    articleIds: ['when-solar-power-changes-fast']
  },
  {
    id: 'validation', label: {en:'Validation','zh-Hant':'驗證'}, aliases: {en:['model validation','validation data'],'zh-Hant':['模型驗證','驗證資料']},
    topicIds: ['teaching-research-practice','data-ai'],
    copy: {
      en: {
        definition: 'Assessing, with appropriate evidence, whether a model or procedure meets requirements for a specified use under stated conditions.',
        example: 'The traffic study splits complete trajectories before building lagged rows. Validation trajectories select settings; separate test trajectories evaluate the frozen choice.',
        misconception: 'A good fit, or a dataset named “validation”, establishes suitability for real-road deployment.',
        scope: 'Validation data used for tuning and evidence of fitness for an intended use are different roles. Clean validation trajectories are available in this synthetic experiment; road-control interventions are not evaluated.'
      },
      'zh-Hant': {
        definition: '利用合適證據，評估模型或程序在指定條件下，是否符合某項用途的要求。',
        example: '交通研究在建立延遲資料列前，先把完整軌跡分組；驗證軌跡選設定，另用測試軌跡評估已固定的選擇。',
        misconception: '擬合好，或資料組叫「驗證集」，就代表已適合道路部署。',
        scope: '用來調參的驗證資料，與支持指定用途的證據，是不同角色。此合成實驗可取得乾淨驗證軌跡，但未評估道路控制措施。'
      }
    },
    sources: [
      {title:'VIM 2.45 — validation',url:'https://jcgm.bipm.org/vim/en/2.45.html',publisher:'JCGM/BIPM',scope:'Validation for an intended use in metrology.'},
      {title:'AI RMF — Valid and Reliable',url:'https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/',publisher:'NIST',scope:'Objective evidence for a specific intended use; performance evaluation and its deployment context.'},
      {title:'How can I tell if a model fits my data?',url:'https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm',publisher:'NIST/SEMATECH',scope:'Statistical model checks; a high fit statistic alone is insufficient.'}
    ],
    articleIds: ['what-must-a-traffic-model-remember','when-the-fit-is-not-the-model','when-solar-power-changes-fast']
  },
  {
    id: 'robustness', label: {en:'Robustness','zh-Hant':'穩健性'}, aliases: {en:['robustness bound'],'zh-Hant':['穩健性界限','穩健性證書']},
    topicIds: ['risk-decisions','dynamics-networks'],
    copy: {
      en: {
        definition: 'The extent to which a specified result or level of performance survives specified changes in circumstances.',
        example: 'For two admitted routes, a valid response-difference bound below the nominal decision margin certifies that their alarms are the same.',
        misconception: 'An inconclusive certificate predicts failure, or robustness to one perturbation covers every perturbation.',
        scope: 'This is a pairwise guarantee for the compared routes under the stated model assumptions. A whole-family guarantee would require a bound uniform over that declared family.'
      },
      'zh-Hant': {
        definition: '情況按指定方式改變後，某個結果或表現能維持到甚麼程度。',
        example: '比較兩個符合假設的路由時，若有效響應差界限小於名義決策裕量，便可證明兩者警報相同。',
        misconception: '證書未能判定就代表失敗；對一種擾動穩健就涵蓋所有擾動。',
        scope: '此保證只適用於指定模型假設下所比較的一對路由；要涵蓋整個路由族，需有對該指定族一致成立的界限。'
      }
    },
    sources: [{title:'AI RMF — Valid and Reliable',url:'https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/',publisher:'NIST',scope:'Maintaining system performance across circumstances; the mathematical pairwise example and its guarantee come from the linked article.'}],
    articleIds: ['two-networks-one-spectrum-different-alarms','what-must-a-traffic-model-remember','how-many-equilibria-did-the-optimizer-miss']
  },
  {
    id: 'uncertainty', label: {en:'Uncertainty','zh-Hant':'不確定性'}, aliases: {en:['measurement uncertainty','uncertainty set'],'zh-Hant':['量測不確定性','不確定集合']},
    topicIds: ['risk-decisions','data-ai'],
    copy: {
      en: {
        definition: 'Incomplete knowledge about a quantity, process or outcome. It may be represented by a probability model, a set of possibilities or a stated qualitative limitation.',
        example: 'The stress-test article uses a declared deterministic parameter box, with no probability distribution attached to it.',
        misconception: 'Every uncertainty interval is a confidence interval, and sample frequencies automatically estimate real-world risk.',
        scope: 'The certificate bounds one synthetic mathematical maximum. Its parameter box is not a measured operating envelope, and its fixed hit counts establish no general miss probability or reactor-safety claim. Measurement uncertainty is a more specific metrological term.'
      },
      'zh-Hant': {
        definition: '對量、過程或結果掌握不完整；可用機率模型、可能值集合或明示的定性限制表達。',
        example: '壓力測試文章採用指定的確定性參數盒，沒有附上參數機率分布。',
        misconception: '所有不確定區間都是置信區間；抽樣頻數可直接估計現實風險。',
        scope: '證書只包住一個合成數學最大值；參數盒並非量測所得的操作範圍，固定命中數亦未建立一般漏檢機率或反應器安全聲稱。量測不確定性是較具體的計量學用語。'
      }
    },
    sources: [
      {title:'SROCC Glossary — Uncertainty',url:'https://www.ipcc.ch/srocc/chapter/glossary/',publisher:'IPCC (2019)',scope:'Incomplete knowledge and quantitative or qualitative representations; the deterministic-set example comes from the linked article.'},
      {title:'VIM 2.26 — measurement uncertainty',url:'https://jcgm.bipm.org/vim/en/2.26.html',publisher:'JCGM/BIPM',scope:'Dispersion of values attributed to a measurand; a narrower meaning than uncertainty in modeling generally.'}
    ],
    articleIds: ['random-stress-tests-are-not-certificates','when-the-fit-is-not-the-model','when-solar-power-changes-fast']
  }
];

export const CONCEPT_IDS = CONCEPTS.map(concept => concept.id);
export const getConcept = id => CONCEPTS.find(concept => concept.id === id) || null;
/** @param {string} id @param {ReaderLocale} locale */
export const getConceptCopy = (id, locale = 'en') => getConcept(id)?.copy[locale] || null;
/** @param {string} id @param {ReaderLocale} locale */
export const conceptHref = (id, locale = 'en') => `${localeBase(locale)}/concepts/${id}/`;

/**
 * Resolve actual published localized URLs through shared source IDs, never translated titles.
 * @returns {{id:string,title:string,href:string,summary:string}[]}
 */
export function getConceptArticleLinks(concept, entries, locale = 'en') {
  return concept.articleIds.flatMap(id => {
    const entry = entries.find(entry => !entry.data.draft && canonicalId(entry.data) === id);
    return entry ? [{id,title:entry.data.title,href:`${localeBase(locale)}/writing/${entry.data.slug}/`,summary:entry.data.summary}] : [];
  });
}

/** Eight curated placements, paired explicitly because translated article structures differ. */
export const CONCEPT_PLACEMENTS = {
  'two-networks-one-spectrum-different-alarms': [
    {conceptId:'assumption',headingId:{en:'a-spectrum-can-stay-fixed-while-routes-change','zh-Hant':'路線變了整組特徵值仍可以不變'}},
    {conceptId:'robustness',headingId:{en:'a-bound-answers-a-different-question-from-a-prediction','zh-Hant':'界限回答的問題與預測不同'}}
  ],
  'how-many-equilibria-did-the-optimizer-miss': [
    {conceptId:'baseline',headingId:{en:'different-workflows-acquire-different-information','zh-Hant':'不同流程取得資訊的方式並不一樣'}},
    {conceptId:'sensitivity',headingId:{en:'integration-error-can-imitate-a-model-change','zh-Hant':'積分誤差也能看起來像模型變化'}}
  ],
  'what-must-a-traffic-model-remember': [
    {conceptId:'validation',headingId:{en:'what-the-forecast-comparison-actually-measures','zh-Hant':'讓資料選擇與比較各守自己的位置'}}
  ],
  'when-the-fit-is-not-the-model': [
    {conceptId:'identifiability',headingId:{en:'structural-and-practical-identifiability-are-different-questions','zh-Hant':'結構與實務可識別性是不同問題'}}
  ],
  'random-stress-tests-are-not-certificates': [
    {conceptId:'uncertainty',headingId:{en:'the-synthetic-objective-and-its-boundary','zh-Hant':'synthetic-objective-與物理邊界'}}
  ],
  'when-solar-power-changes-fast': [
    {conceptId:'calibration',headingId:{en:'how-the-calibration-changes-the-interval','zh-Hant':'校準如何改變預測區間'}}
  ]
};

export function conceptPlacementsFor(articleId, locale = 'en') {
  const placements = Object.hasOwn(CONCEPT_PLACEMENTS,articleId) ? CONCEPT_PLACEMENTS[articleId] : [];
  return placements.map(placement => ({conceptId:placement.conceptId,headingId:placement.headingId[locale]}));
}
