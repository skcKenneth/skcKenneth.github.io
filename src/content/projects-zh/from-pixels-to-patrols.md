---
title: 從像素到巡邏
slug: from-pixels-to-patrols
sourceSlug: from-pixels-to-patrols
summary: 一份遵守證據界線的編輯紀錄，介紹 calibration-aware 合成 camera-trap pipeline 如何把類別機率連到網格不確定性與受約束巡邏配置。
year: 2026
lastUpdated: 2026-08-30
status: Submitted
featured: false
topics: [保育科技, 機率校準]
methods: [Temperature scaling, 單調 Platt calibration, Poisson-binomial intervals, 受約束資源配置]
researchQuestion: 在受控合成實驗中，miscalibrated image probabilities 如何傳遞至空間風險估計及 fixed-budget 巡邏決策？
dataType: 二十個合成四類 camera-trap networks，每個包含 400 個空間網格
codeAvailable: false
dataAvailable: false
studentSuitable: true
period: 2026
validation: 已於 2026-08-30 刷新官方 workshop programme 及 publication conditions；所有數值仍屬 manuscript-reported，未經獨立重現。
keyFindings:
  - 手稿報告 task-specific calibration 在二十個 seeded networks 上，把 synthetic oracle-relative patrol regret 由 2.64 percent 降至 0.33 percent。
  - 手稿報告 nominal 0.90 interval 的 held-out calibrated coverage 為 0.932，同時明確不聲稱 distribution-free guarantee。
limitations:
  - 研究只使用合成分類器輸出及景觀，沒有真實影像、巡邏紀錄、指定保護區或 field validation。
  - Human presence 只是 risk proxy，並非 poacher label；allocation model 亦省略路線、authorised-person context、地形、安全與行為適應。
  - Public note 未獨立核對程式、environment、完整 seeds 或數值輸出。
  - 截至 2026-08-30，oral presentation 安排於 2026-08-31；付款、CMT/eCF completion、proceedings publication、IEEE Xplore indexing 與 DOI 均不能由公開資料核實。
redirectFrom: []
---

## 編輯概覽

完整技術導讀請閱讀[從像素到巡邏：校準如何改變合成巡邏規劃](/zh/writing/from-pixels-to-patrols/)，內容包括 probability-to-decision chain、全新解釋圖、manuscript-reported results 與明確聲稱界線。

[AI4Nature@AVSS 2026 官方議程](https://www.ai4nature.tech/program.html)把研究列為 2026 年 8 月 31 日 Oral Session 1A 的 Paper ID 7。本頁只記錄 scheduled status，不聲稱口頭報告、proceedings publication、IEEE Xplore indexing 或 DOI assignment 已經發生。

官方 call 表明 accepted papers 按安排收入 AVSS proceedings 及 IEEE Xplore，但須符合 full paper registration 與 conference process。IEEE 一般 guidance 是收到 proceedings 後約 30–60 日，而 organizers 可能在 event 後數星期才提交；這只是監察範圍，不是 AVSS 保證出版日期。

本頁不會發佈 supplied camera-ready PDF，也沒有抽取其中任何 figure；公開圖像均為全新 editorial explanations。
