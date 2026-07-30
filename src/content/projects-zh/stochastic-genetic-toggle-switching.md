---
title: 隨機基因開關的狀態切換
slug: stochastic-genetic-toggle-switching
sourceSlug: stochastic-genetic-toggle-switching
summary: 一項結合確定性與隨機模型的研究，把基因 toggle 的雙穩態連結到有限分子數下的切換、首達時間記憶、穩態分佈與脈衝控制。
year: 2026
lastUpdated: 2026-07-30
status: Reproducible study
featured: true
topics: [合成生物學, 隨機過程]
methods: [ODE 穩定性分析, Gillespie 模擬, 首達時間 Monte Carlo]
researchQuestion: 有限分子數如何把確定性的雙穩態，變成具有可量度切換壽命的隨機記憶？
dataType: 受控的確定性及隨機基因迴路模擬
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/stochastic-genetic-toggle-switching/deterministic-bistability.svg
period: 2026
validation: 已重新通過三項自動測試及 24 個輸出的 checksum manifest 驗證。
keyFindings:
  - 確定性迴路有三個平衡點，其中兩個穩定；有限分子數軌跡卻可跨越吸引域邊界。
  - 在預設 Monte Carlo 實驗中，平均首達時間由系統大小 3 時的 11.99 增至大小 18 時的 99.64。
limitations:
  - 模型未以任何指定生物、啟動子或 plasmid 校準。
  - 未包含顯式 mRNA、轉錄爆發、細胞分裂、延遲、外源噪聲與生長回饋。
redirectFrom: []
---

## 編輯導讀

完整文章請閱讀[噪聲如何翻轉一個基因開關](/zh/writing/how-noise-flips-a-genetic-switch/)，內容包括確定性幾何、精確事件隨機模型、首達時間、穩態分佈、脈衝控制與五幅公開圖。

公開文章不會暴露私有 notebook、重複模擬表、程式碼或動畫原始影格。
