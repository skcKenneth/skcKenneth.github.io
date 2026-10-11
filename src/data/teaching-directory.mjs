const bi = (en, zh) => ({ en, 'zh-Hant': zh });
export const TEACHING_AUDIENCES = [
  { id: 'junior', label: bi('Junior secondary', '初中'), description: bi('Build understanding through examples and exploration.', '從例題與探究建立理解。') },
  { id: 'senior', label: bi('Senior secondary', '高中'), description: bi('Follow a course, practise a skill or work through a paper.', '沿教材學習、鞏固知識，或練習歷屆試卷。') },
  { id: 'modeling', label: bi('Mathematical modeling', '建模'), description: bi('Turn a question into a model and inspect the evidence.', '把問題化成模型，再檢查證據。') },
  { id: 'teacher', label: bi('For teachers', '教師'), description: bi('Plan a lesson and review learning evidence.', '準備課堂、選擇教材及檢視學習證據。') },
];
export const TEACHING_FORMATS = [
  { id: 'interactive', label: bi('Interactive', '互動') }, { id: 'practice', label: bi('Practice', '練習') },
  { id: 'past-papers', label: bi('Past papers', '舊卷') }, { id: 'notes', label: bi('Notes', '筆記') }, { id: 'slides', label: bi('Slides', '投影片') },
];
const resource = (id, path, audiences, formats, title, purpose, duration, extra = {}) => ({ id, path, audiences, formats, title, purpose, duration, chineseOnly: false, external: false, anchorAliases: [], ...extra });
const selfPaced = bi('Self-paced; choose one lesson or activity', '自定進度；每次選一課或一個活動');
export const TEACHING_RESOURCES = [
  resource('math-studio', '/math-studio/', ['junior', 'senior', 'teacher'], ['interactive', 'practice', 'notes'], bi('Mathematics Studio — Years 7, 8 and 10', '數學研習室｜初一・初二・高一'), bi('Chapter notes, worked examples, randomized practice and inquiry records.', '章節講解、逐步例題、隨機練習及探究紀錄。'), bi('Inquiry: 25–35 min + optional extension', '探究：25–35 分鐘，可加延伸'), { chineseOnly: true }),
  resource('senior-math', '/teaching/senior-math/', ['senior', 'teacher'], ['interactive', 'practice', 'notes', 'past-papers'], bi('Senior Mathematics Studio', '高中數學研習室'), bi('A textbook course, school routes, the complete JAE foundations studio and JM01/JM02 explanations.', '教材主線、校本路徑、完整四校聯考基礎研習室及 JM01／JM02 舊卷詳解。'), selfPaced, { anchorAliases: ['jae-math'] }),
  resource('math-inquiry-lab', 'https://skckenneth.github.io/math-inquiry-lab/', ['junior', 'senior', 'teacher'], ['interactive', 'practice'], bi('Math Inquiry Lab', '數學探究室 · Math Inquiry Lab'), bi('Predict, experiment and explain quadratic functions, probability and regression.', '透過預測、操作與解釋，探究二次函數、概率及迴歸。'), selfPaced, { chineseOnly: true, external: true }),
  resource('macau-competition', '/teaching/macau-school-math-competition/', ['junior', 'senior', 'teacher'], ['past-papers', 'practice', 'notes'], bi('Macau competition solution archive', '澳門校際／學界數學比賽題解資源庫'), bi('Compare an independent solution with the official question and record your reasoning.', '對照官方原題與獨立題解，記錄解題轉化。'), bi('Suggested: 10–20 min before reading a solution', '建議先獨立嘗試 10–20 分鐘')),
  resource('lecture-library', '/teaching/mathematical-modeling-lecture-programme/', ['modeling', 'teacher'], ['notes', 'slides', 'practice'], bi('Mathematical modeling lecture library', '數學建模教材庫'), bi('27 bilingual Notes units, English slides and eight teaching datasets.', '27 個雙語筆記單元、英文投影片及八組教學資料。'), bi('Duration shown for each unit', '各單元列出預計時間')),
  resource('modeling-workshop', '/teaching/modeling-workshop/', ['modeling', 'teacher'], ['interactive', 'practice', 'notes'], bi('Mathematical Modeling Workshop', '數學建模學習工坊'), bi('Write Python, compare a baseline and export a complete research record.', '編寫 Python、比較基準，再匯出完整研究紀錄。'), bi('About 150 min per workshop', '每個工坊約 150 分鐘')),
  resource('beginner-pathway', '/teaching/beginner-pathway/', ['modeling'], ['notes', 'practice'], bi('First steps in mathematical modeling', '數學建模入門路徑'), bi('Start with quantities, assumptions, a baseline and a check that can fail.', '由數量、假設、基準及可失敗的檢查開始。'), selfPaced),
  resource('python-labs', '/teaching/python-labs/', ['modeling', 'teacher'], ['practice', 'notes'], bi('Python laboratories for modelers', '建模者的 Python 實驗室'), bi('Plan reproducible experiments in simulation, numerical methods and optimization.', '規劃模擬、數值方法及最佳化的可重現實驗。'), selfPaced),
  resource('competition-pathway', '/teaching/competition-pathway/', ['senior', 'modeling', 'teacher'], ['practice', 'notes'], bi('Competition modeling pathway', '數學建模競賽路徑'), bi('Practise question framing, teamwork, evidence and technical writing.', '練習問題定義、合作、證據與技術寫作。'), selfPaced),
  resource('model-laboratory', '/teaching/model-laboratory/', ['modeling', 'teacher'], ['interactive', 'notes'], bi('Interactive model laboratory', '互動模型實驗室'), bi('14 experiments across foundations, frontier models and research inquiry; compare questions, assumptions and limitations.', '14 個實驗，分為基礎、前沿模型與研究探究三階段；按問題、假設與限制選擇。'), selfPaced, { anchorAliases: ['frontier-model-studio', 'research-inquiry-studio'] }),
  resource('melt-pond-topology-lab', '/teaching/melt-pond-topology-lab/', ['modeling', 'teacher'], ['interactive'], bi('Melt-pond topology observation lab', '融池拓撲觀測實驗室'), bi('Test how observation choices change a synthetic connectivity threshold.', '測試觀測選擇如何改變合成連通臨界點。'), selfPaced),
  resource('quantum-repeater-lab', '/teaching/quantum-repeater-lab/', ['modeling', 'teacher'], ['interactive'], bi('Quantum repeater scheduling lab', '量子中繼排程實驗室'), bi('Compare scheduling, memory decay and fidelity in a five-node chain.', '比較五節點鏈的排程、記憶衰減與保真度。'), selfPaced),
  resource('ventilation-case-clinic', '/teaching/ventilation-case-clinic/', ['modeling', 'teacher'], ['notes', 'practice'], bi('Ventilation case clinic', '通風建模案例診療室'), bi('Compare mass balance, predictive control and conflicting evaluation metrics.', '比較質量平衡、預測控制及互相衝突的評估指標。'), selfPaced),
  resource('student-research-studio', '/teaching/student-research-studio/', ['modeling', 'teacher'], ['notes', 'practice'], bi('Student research studio', '學生研究工作室'), bi('Turn an open question into a scoped study with reproducible evidence.', '把開放問題收窄成有可重現證據的研究。'), bi('Project pathway; pace varies', '專題路徑；按研究進度安排')),
  resource('instructor-resources', '/teaching/instructor-resources/', ['teacher'], ['notes'], bi('Instructor resources', '教師資源'), bi('Use assessment rubrics and review the evidence behind a modeling argument.', '使用評量準則，檢視建模論證背後的證據。'), bi('On-demand lesson preparation', '按需要備課')),
];
export const teachingHref = (resource, locale = 'en') => resource.external || resource.chineseOnly ? resource.path : `${locale === 'zh-Hant' ? '/zh' : ''}${resource.path}`;
export function filterTeachingResources({ audience = '', format = '', query = '', locale = 'en' } = {}) {
  const q = query.trim().toLocaleLowerCase();
  return TEACHING_RESOURCES.filter(resource => (!audience || resource.audiences.includes(audience)) && (!format || resource.formats.includes(format)) && (!q || `${resource.title[locale]} ${resource.purpose[locale]}`.toLocaleLowerCase().includes(q)));
}
