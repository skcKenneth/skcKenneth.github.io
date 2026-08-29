---
title: 一次翻轉究竟有多罕見？
slug: how-rare-is-a-flip
sourceSlug: how-rare-is-a-flip
summary: 這項可重現的第一階段研究，以帶誤差界的有限狀態參考與固定種子的直接 SSA，核對一個合成低 copy 數 exclusive genetic toggle。
year: 2026
lastUpdated: 2026-08-29
status: Reproducible study
featured: true
topics: [隨機反應網絡, 基因開關, 不確定性量化]
methods: [有限狀態投影, Gillespie SSA, Wilson 區間]
researchQuestion: 在嘗試 rare-event benchmark 之前，帶獨立誤差界的有限狀態計算與固定種子的直接模擬，能否在同一個有限時域翻轉事件上互相吻合？
dataType: 合成低 copy 數 exclusive-toggle CTMC
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/how-rare-is-a-flip/p03_02_fsp_vs_naive_ssa.svg
period: 2026
validation: 四項針對性測試、repository policy check 與文件所列的第一階段重現程序均已通過。
keyFindings:
  - 在 cap 20，FSP 機率界為 0.2575946379–0.2575946395，overflow probability 為 1.62e-9。
  - 固定種子的 naive SSA 在 6000 條軌跡中錄得 1580 次命中，即 0.26333；95% Wilson 區間為 0.25234–0.27463。
  - 32 個獨立種子批次之中，有 30 個批次區間與 FSP 機率界相交；這只是 smoke diagnostic，不是最終 coverage study。
limitations:
  - 目前只有合成低 copy 數的第一階段 smoke regime，並非最終預先註冊的 rarity ladder。
  - 保留 cap-18 失敗與通過 cap-20 truncation audit，只能核對參考計算處理方式，不能驗證生物模型。
  - 尚未實作或評估 AMS 與 FFPilot，因此沒有 rare-event speedup 或方法排名結論。
redirectFrom: []
---

## 編輯導讀

文獻 gate 的判斷是 **REFRAME**：基因開關的高效率 rare-event sampling 已有先行研究，籠統聲稱「增強取樣勝過直接模擬」並不新穎。可辯護的方向是可靠性邊界 benchmark，但目前只執行了最小的第一階段基礎。

完整文章請閱讀[一次翻轉究竟有多罕見？](/zh/writing/how-rare-is-a-flip/)，內容包括已申明的 exclusive-toggle CTMC、固定首達事件、有限狀態機率界、固定種子 SSA 對照、被保留的截斷失敗，以及每項結果的解讀界線。
