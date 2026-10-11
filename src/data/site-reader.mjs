import assignments from './topic-assignments.json' with {type:'json'};
/** Stable reader-facing taxonomy. Existing editorial tags remain intact. */
export const TOPICS = [
  {id:'mathematical-thinking',label:{en:'Mathematical thinking','zh-Hant':'數學思考'},description:{en:'Questions, models, geometry and mathematical judgement.','zh-Hant':'從問題、模型、幾何到數學判斷。'},pattern:/mathematical curios|geometry|game theory|博弈|幾何|數學趣|modeling workflow/i},
  {id:'computation-code',label:{en:'Computation & code','zh-Hant':'計算與程式'},description:{en:'Numerical methods, simulation and reproducible computation.','zh-Hant':'數值方法、模擬與可重現計算。'},pattern:/numerical|computation|python|interpolation|simulation|數值|計算|程式|插值|降階|discret|mesh|solver/i},
  {id:'data-ai',label:{en:'Data & AI','zh-Hant':'數據與 AI'},description:{en:'Learning from data while testing what can be inferred.','zh-Hant':'從數據學習，亦檢查可以推論甚麼。'},pattern:/machine learning|data |inverse|inference|identif|assimilat|neural|資料|數據|機器學習|反問題|辨識|同化|entity|signal/i},
  {id:'risk-decisions',label:{en:'Risk & decisions','zh-Hant':'風險與決策'},description:{en:'Uncertainty, reliability and decisions with limits.','zh-Hant':'不確定性、可靠性與有界限的決策。'},pattern:/reliab|uncertain|risk|decision|robust|optim|audit|風險|決策|可靠|不確定|穩健|最佳化|優化|證書|certificate/i},
  {id:'life-environment',label:{en:'Life & environment','zh-Hant':'生命與環境'},description:{en:'Living systems, ecosystems, climate and observation.','zh-Hant':'生命系統、生態、氣候與觀測。'},pattern:/environment|ecosystem|climate|epidem|dengue|biolog|cell |tissue|gene|pond|生態|環境|氣候|疾病|疫情|登革|細胞|基因|融池/i},
  {id:'cities-engineering',label:{en:'Cities & engineering','zh-Hant':'城市與工程'},description:{en:'Transport, energy, infrastructure and engineered systems.','zh-Hant':'交通、能源、基建與工程系統。'},pattern:/urban|traffic|transport|mobility|ventilat|energy|solar|reactor|water |engineer|城市|交通|出行|通風|能源|太陽能|工程|反應器|水網/i},
  {id:'dynamics-networks',label:{en:'Dynamics & networks','zh-Hant':'動態與網絡'},description:{en:'Change, patterns, feedback and connected systems.','zh-Hant':'變化、圖樣、回饋與互相連接的系統。'},pattern:/dynamic|network|bifurcat|stochast|quantum|turing|pattern|equilibr|nonlinear|動態|網絡|分岔|隨機|量子|圖樣|平衡|非線性/i},
  {id:'teaching-research-practice',label:{en:'Teaching & research practice','zh-Hant':'教學與研究實踐'},description:{en:'Learning, mentoring, evidence and research design.','zh-Hant':'學習、指導、證據與研究設計。'},pattern:/education|teaching|student|research design|experiment design|scientific institution|教學|教育|學生|研究設計|實驗設計|科學制度/i}
];
export const TOPIC_IDS = TOPICS.map(topic=>topic.id);
export const START_HERE = ['modeling-workflow','interpolation-guide','climate-driven-dengue'];
export const SITE_URL = 'https://skckenneth.github.io';
export const canonicalId = data => data.sourceSlug || data.slug;
export const localeBase = locale => locale === 'zh-Hant' ? '/zh' : '';
export function getTopicIds(data) {
  if(data.topicIds?.length) return [...new Set(data.topicIds)].filter(id=>TOPIC_IDS.includes(id)).slice(0,3);
  if(assignments[data.sourceSlug||data.slug]) return assignments[data.sourceSlug||data.slug];
  const text=[...(data.topics||[]),data.title||'',data.slug||''].join(' ');
  const matches=TOPICS.filter(topic=>topic.pattern.test(text)).map(topic=>topic.id);
  return matches.length ? matches.slice(0,3) : ['mathematical-thinking'];
}
export function readingMinutes(entry,locale='en') {
  if(entry.data.readingMinutes) return entry.data.readingMinutes;
  const body=entry.body||'';
  const chinese=(body.match(/[\u3400-\u9fff]/g)||[]).length;
  const latin=(body.match(/\b[A-Za-z][A-Za-z'-]*\b/g)||[]).length;
  return Math.max(1,Math.round(chinese/450+latin/220));
}
export function articleType(type,locale='en') {
  const pairs=[['Research Notes','研究筆記'],['Technical Tutorials','技術教程'],['Competition Case Studies','競賽案例'],['Teaching Notes','教學筆記'],['Mathematical Curiosities','數學趣題'],['Archive','文章典藏']];
  const aliases={'技術導讀':'技術教程','教學札記':'教學筆記','數學趣談':'數學趣題','文章庫':'文章典藏'};
  const normalized=aliases[type]||type;
  const pair=pairs.find(p=>p.includes(normalized));
  return pair ? pair[locale==='zh-Hant'?1:0] : type;
}
