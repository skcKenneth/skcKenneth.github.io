// Independently transcribed from the official question pages, not derived from authored arrays.
const mc=Array.from({length:15},(_,i)=>`I.${i+1}`);
const parts=s=>s.split(' ');
const standard=(written,pages,key)=>({parts:[...mc,...parts(written)],choice:15,writtenTopLevel:5,optionCounts:Array(15).fill(5),pdfPages:pages,answerKey:key});
const supplementary=(written,pages)=>({parts:parts(written),choice:0,writtenTopLevel:5,optionCounts:[],pdfPages:pages});
export const officialPaperInventory={
  'jm01-2021':standard('II.1(a) II.1(b) II.2(a) II.2(b) II.3(a) II.3(b) II.3(c) II.4(a) II.4(b) II.5(a) II.5(b)',13,'BEABBACDCABEDAC'),
  'jm02-2021':supplementary('1(a)(i) 1(a)(ii) 1(b)(i) 1(b)(ii) 2(a)(i) 2(a)(ii) 2(a)(iii) 2(a)(iv) 2(a)(v) 2(b) 3(a) 3(b)(i) 3(b)(ii) 3(b)(iii) 4(a) 4(b) 4(c)(i) 4(c)(ii) 5(a) 5(b)(i) 5(b)(ii)',17),
  'jm01-2026':standard('II.1(a) II.1(b) II.2(a) II.2(b) II.3(a) II.3(b) II.3(c) II.4(a) II.4(b) II.5(a)(i) II.5(a)(ii) II.5(b)',15,'ABCEDCBDEADADBC'),
  'jm02-2026':supplementary('1(a) 1(b) 1(c) 2(a)(i) 2(a)(ii) 2(a)(iii) 2(a)(iv) 2(a)(v) 2(b) 3(a) 3(b) 3(c) 3(d) 4(a)(i) 4(a)(ii) 4(b)(i) 4(b)(ii) 5(a) 5(b)(i) 5(b)(ii) 5(b)(iii)',15),
  'jm01-2025':standard('II.1(a) II.1(b) II.2(a) II.2(b) II.3(a) II.3(b) II.4(a) II.4(b) II.4(c) II.5(a) II.5(b)',13,'ADACDECCBEEDBDB'),
  'jm02-2025':supplementary('1(a) 1(b) 1(c) 1(d) 2(a)(i) 2(a)(ii) 2(a)(iii) 2(a)(iv) 2(a)(v) 2(b) 3(a) 3(b) 3(c) 3(d) 4(a) 4(b) 4(c) 4(d) 5(a)(i) 5(a)(ii) 5(b)(i) 5(b)(ii)',17),
  'jm01-2024':standard('II.1(a) II.1(b) II.2(a) II.2(b) II.3(a) II.3(b) II.4(a) II.4(b) II.5(a) II.5(b)',13,'BBCCDADACEBCABE'),
  'jm02-2024':supplementary('1(a) 1(b) 1(c) 2(a)(i) 2(a)(ii) 2(a)(iii) 2(a)(iv) 2(a)(v) 2(b) 3(a) 3(b) 3(c) 3(d) 4(a)(i) 4(a)(ii) 4(b) 4(c) 5(a) 5(b)(i) 5(b)(ii) 5(c)',15),
  'jm01-2023':standard('II.1(a) II.1(b) II.1(c) II.2(a) II.2(b) II.2(c) II.3(a) II.3(b) II.3(c) II.4(a) II.4(b) II.5(a) II.5(b) II.5(c)',13,'EDCCDCDAEB AEABE'.replaceAll(' ','')),
  'jm02-2023':supplementary('1(a) 1(b) 1(c) 2(a)(i) 2(a)(ii) 2(a)(iii) 2(a)(iv) 2(b)(i) 2(b)(ii) 3(a)(i) 3(a)(ii) 3(b) 3(c) 4(a) 4(b)(i) 4(b)(ii) 5(a)(i) 5(a)(ii) 5(b)',15),
  'jm01-2022':standard('II.1(a) II.1(b) II.1(c) II.2(a) II.2(b) II.3(a) II.3(b) II.4(a) II.4(b) II.4(c) II.5',15,'BCEBDAADDABECCE'),
  // The source prints (ii) twice in Q4(b). The third item is normalised to (iii), with a visible note.
  'jm02-2022':supplementary('1(a) 1(b)(i) 1(b)(ii) 1(c) 2(a)(i) 2(a)(ii) 2(a)(iii) 2(a)(iv) 2(a)(v) 2(b) 3(a) 3(b) 3(c)(i) 3(c)(ii) 3(c)(iii) 4(a)(i) 4(a)(ii) 4(a)(iii) 4(b)(i) 4(b)(ii) 4(b)(iii) 5(a) 5(b)(i) 5(b)(ii)',16),
};
