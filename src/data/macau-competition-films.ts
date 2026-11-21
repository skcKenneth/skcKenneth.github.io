import program2022 from './macau-math-2022-2023-chapters.json';
import program2023 from './macau-math-2023-2024-chapters.json';
import program2024 from './macau-math-2024-2025-chapters.json';

export const competitionArchivePath = '/teaching/macau-school-math-competition/';
export const competitionFilmsPath = competitionArchivePath + 'films/';

const questions2025 = [
  { file: '01-square-root-gaps', seconds: 80, zh: '根號之間的距離', en: 'Gaps between square roots' },
  { file: '02-difference-of-cubes', seconds: 95, zh: '兩個立方數相差 61', en: 'Two cubes that differ by 61' },
  { file: '03-counting-strings', seconds: 120, zh: '逐個字母數字串', en: 'Counting strings one letter at a time' },
  { file: '04-two-reflected-roots', seconds: 80, zh: '平移拋物線，找出指定根', en: 'Shifting a parabola to find the required root' },
  { file: '05-balancing-translations', seconds: 145, zh: '兩次平移，剛好覆蓋', en: 'Two shifts, one exact cover' },
  { file: '06-square-tile-game', seconds: 165, zh: '用平方磚拆解遊戲', en: 'A strategy built from squares' },
  { file: '07-crossing-the-threshold', seconds: 160, zh: '穿過門檻的硬幣', en: 'Coins that cross the threshold' },
  { file: '08-six-shrinking-squares', seconds: 170, zh: '四個數怎樣分才最大？', en: 'Which split maximizes the sum?' },
  { file: '09-the-hidden-midpoint', seconds: 245, zh: '旁切圓、投影與中點', en: 'Excircle, projections and a midpoint' },
] as const;

let end2025 = 12;
const sections2025 = questions2025.map((question, index) => {
  const start = end2025;
  end2025 += question.seconds;
  return { ...question, start, number: index + 1 };
});

function generatedSchedule(program: typeof program2022) {
  return {
    fullStem: program.fullStem,
    duration: program.seconds,
    recapStart: program.sections.at(-1)!.start,
    questionSections: program.sections.flatMap(({ question, ...chapter }) =>
      question === null ? [] : [{ ...chapter, number: question }]),
  };
}

export const competitionEditions = {
  '2025-2026': {
    fullStem: '00-full-contest-2025-2026-with-recap',
    duration: end2025 + 60,
    recapStart: end2025,
    questionSections: sections2025,
    officialPaper: 'https://portal.dsedj.gov.mo/webdsejspace/addon/upload/Upload_viewfile_page.jsp?id=711644',
    description: {
      en: 'Animated solutions to all nine senior-division problems, from number lines and string counts to area dissection and an excircle proof.',
      'zh-Hant': '高中組九題動畫解答。從數線、字串計數和平方磚，到面積拼圖與旁切圓證明。',
    },
    recapTitle: { en: 'Nine methods and answers', 'zh-Hant': '九題解法與答案' },
  },
  '2024-2025': {
    ...generatedSchedule(program2024),
    officialPaper: 'https://www.dsedj.gov.mo/~webdsej/www/dsejnews/ce/result/tech/2425/math2425_sen_qust.pdf',
    description: {
      en: 'Animated solutions to all ten senior-division problems, from telescoping radicals and logarithms to rotating chords, factorials and inequalities.',
      'zh-Hant': '高中組十題動畫解答。從根號相消、對數乘積，到旋轉弦、階乘與不等式。',
    },
    recapTitle: { en: 'Ten methods and answers', 'zh-Hant': '十題解法與答案' },
  },
  '2023-2024': {
    ...generatedSchedule(program2023),
    officialPaper: 'https://www.dsedj.gov.mo/~webdsej/www/dsejnews/ce/result/tech/2324/math2324_sen_qust.pdf',
    description: {
      en: 'Animated solutions to all eleven senior-division problems, from iterating a radical function to proving a ratio in a moving triangle.',
      'zh-Hant': '高中組十一題動畫解答。由反覆套用根式函數，到在變動的三角形中證明線段比例。',
    },
    recapTitle: { en: 'Eleven methods and answers', 'zh-Hant': '十一題解法與答案' },
  },
  '2022-2023': {
    ...generatedSchedule(program2022),
    officialPaper: 'https://www.dsedj.gov.mo/~webdsej/www/dsejnews/ce/result/tech/2223/math2223_sen_qust.pdf',
    description: {
      en: 'Animated solutions to all twelve senior-division problems, from rotating rays and lattice paths to the orthocenter vector.',
      'zh-Hant': '高中組十二題動畫解答。由旋轉射線和格點路徑，解到三角形的垂心向量。',
    },
    recapTitle: { en: 'Twelve methods and answers', 'zh-Hant': '十二題解法與答案' },
  },
};

export type CompetitionEdition = keyof typeof competitionEditions;

export const filmTimestamp = (seconds: number) =>
  String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
