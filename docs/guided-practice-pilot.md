# 初一／初二分層練習試點 · Guided practice pilot

版本：2026-10-14-guided-practice-v1。這是七節課的程式與教材試點；學生學習成效須由實際試教收集，並非由程式測試推定。

## 課堂使用

入口：`/zh/teaching/classroom-packs/`、`/teaching/classroom-packs/`，以及統一研習室。章節入口保留 `linear-equation`、`congruence`、`symmetry` 原 ID；教材標示另列，避免網站舊章次與課本混淆。

| 課堂包 ID | 教材印刷頁碼 | 基訓課時 |
| --- | --- | --- |
| g7-equations-collect | 七上 59–60 | 30 |
| g7-equations-transpose | 七上 61–62 | 31 |
| g8-bisector-distances | 八上 25–26 | 13 |
| g8-bisector-converse | 八上 27–28 | 14 |
| g8-symmetry-recognition | 八上 29–30 | 15 |
| g8-perpendicular-bisector | 八上 31–32 | 16 |
| g8-symmetry-axis-construction | 八上 33–34 | 17 |

每包 16 道固定原創題：示範 1、帶做 1、先備 2、獨立 4、離堂 2、補練 4、進階 2。八道核心指先備、獨立及離堂；學生核心工作紙另含示範與帶做，共十個題框。示範由教師投影解說，學生紙本留白。

普通班：4 分鐘先備、5 分鐘短探究、8 分鐘示範與帶做、15 分鐘獨立、5 分鐘訂正、3 分鐘離堂。進階班：18 分鐘探究、4 分鐘整理、13 分鐘精選練習、5 分鐘離堂；四道核心為首兩道獨立題加兩道離堂題，另選第一道進階題。教師可用環節選單取用其他固定題。

箭咀鍵／上一題、下一題切換；提示及推理每次揭示一層，答案須明確揭示。投影模式可按 Esc 結束。換題、換路線及重載均收起課堂解析。繁中／英文切換保留路線。

## 紙本與紀錄

學生核心預設兩頁 A4；補練另印；教師版附解答、步驟及評量準則。三個列印根節點均從同一份題目資料生成，學生節點沒有解答內容。揭示狀態只存在本分頁記憶體。明確選擇教師／補練列印只適用該次列印，關閉或取消列印後回復學生版，供其後 Ctrl+P 使用。

下載學生 JSON 不含答案、解析、提示、稽核答案或教師準則；教師頁可下載完整教師包。這些是課堂材料，不是學習紀錄。紙筆作答不建立分數、答題事件或新的瀏覽器儲存鍵。研習室題單沿用共用儲存協調器及原備份格式。

課本、基訓與答案冊只作教師本機核對。網站只載原創題與來源頁碼，不包含原 PDF。下冊未列入本次發布，也未聲稱核對下冊答案。

## 教師試教記錄

每課記下班別、日期、採用路線、實際完成核心題數；收集兩道離堂題，以及最常見的兩項錯法。證明核對已知條件、全等判定、頂點對應及結論；尺規作圖核對相同開度、弧交點及核對步驟，接受其他正確方法。這些記錄由教師保管，本頁不收集姓名或紙本答案。

若多數學生未完成核心，先增加帶做、降低跨步或分拆證明，再考慮增加題量。試教後才按進度擴展其餘章節；程式驗收與學習成效分開記錄。

## Reproducible checks

`pnpm run test:guided-practice` checks all authored question contracts, independently evaluates displayed equations, verifies geometry conditions and reflection coordinates, and confirms that the presentation runtime introduces no learner store.

`node scripts/guided-practice-browser-qa.mjs --base http://127.0.0.1:4399 --output .tmp/guided-practice-browser-qa` exercises the frozen built site with real disposable Chromium pages, native storage events, downloads, mobile and keyboard controls. It writes a PDF manifest for all 42 bilingual print editions.

`python scripts/guided-practice-pdf-audit.py .tmp/guided-practice-browser-qa` independently checks A4 page counts, page placement, required prompts and absent solutions. Generated QA artifacts remain outside Git. Production publication additionally requires the full site build, Actions success, live routes, asset hashes and actual search interaction.
