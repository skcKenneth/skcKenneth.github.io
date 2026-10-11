# 功能入口統整

2026-10-11。基準 `6a54eda`；在獨立分支 `codex/site-consolidation-20261011` 實作，原工作區的高中數學開發保持原狀。

本批先完成相同功能的入口收斂，再開始第二輪美化與擴展。不同內容、課程及儲存資料不按名稱相似便合併。

## 正式入口與相容網址

以下均有英文及繁中版本。

| 功能 | 正式入口 | 相容安排 |
|---|---|---|
| 文章與典藏 | `/writing/`，`archive=1` 開啟典藏 | `/writing/archive/` 及更早的典藏網址轉往同一清單，保留支援的篩選與章節 |
| 主題與研究方向 | `/topics/`；研究方向卡在 `#research-programmes` | `/research/` 轉往該區；四個方向詳情完整保留 |
| 高中數學 | `/teaching/senior-math/` | 保留題庫、課節及逐卷頁；二次與三角完整研習室歸入 `/studios/jae/` |
| 二次與三角研習室 | `/teaching/senior-math/studios/jae/` | `/teaching/jae-math/` 保留模式及原章節／作答欄位錨點，轉往完整同等頁 |
| 聯考原卷與解說 | `/teaching/senior-math/papers/` | 完整研習室保留 `#past-papers` 入口，官方來源由各卷頁提供 |
| 14 個模型實驗 | `/teaching/model-laboratory/` | Frontier／Research 工作台保持可直接開啟；教學總覽不再並列三個重複目錄 |
| 工坊續學 | Modeling Workshop 的共同工具列 | 原重複續學按鈕改為進度摘要 |

相容頁是 GitHub Pages 上的靜態頁，附 canonical、noindex、Pagefind 排除與可點擊後備入口；有 JavaScript 時保留白名單參數及原 hash。無 JavaScript 時固定後備入口仍可使用，不宣稱 HTTP 301。

## 保留的用途差異

- 全站搜尋搜尋全文；文章清單依年份、文章類型及典藏篩選；教學目錄依學習對象與用途篩選；題庫依技能及學習狀態篩選。它們操作規則一致，資料域不同。
- 文章解釋問題與推理；專案概覽記錄成果、限制與資源；研究方向解釋長期問題。29 組相同 slug 並非相同內容，不刪除。
- Notes 是閱讀教材，Workshop 是可執行程式實作；Python Laboratories 是教學規範。保留內容角色，藉共同目錄及相互連結整合。
- 初中 Math Studio、獨立 Math Inquiry Lab、數學競賽題解及建模競賽路徑服務不同任務，保留其引擎與課節 ID。

## 資料與相容邊界

本批不遷移 storage schema。收藏沿用 `kenneth-reading-list:v1`；JAE／Senior 沿用 `jae-math-v1` 及原 26 個題目 ID；Workshop 沿用 IndexedDB `kenneth-modeling-workshop`／`progress`；Math Studio 保留三個原版本化 key。

額外修正：停用的 `legacy-archive` 索引不應出現在搜尋 catalog；跨 collection 相同 slug 的 metadata 及翻譯配對必須按實際 collection／共同 ID 決定；專案與模型目錄的篩選支援重新整理、上一頁及合理的語言切換。

## 驗收與發布

完成後記錄：完整建置、舊路由與 hash、兩語言、搜尋分頁、儲存回歸、桌面／手機實際操作、提交、Actions 及線上檢查。驗收產物另存本目錄，完成前不以先前版本的結果代替。

之後依 `next-round-plan.md` 依次執行：編輯視覺與六篇讀前指南 → 專題路線／概念／接續列印 → 短札記／課堂套件／作者覆核流程。
