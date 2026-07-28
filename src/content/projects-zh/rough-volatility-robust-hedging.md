---
title: 粗糙波動下的穩健對沖
slug: rough-volatility-robust-hedging
sourceSlug: rough-volatility-robust-hedging
summary: 在未見過的粗糙度、波動率的波動與交易成本情境中，評估固定無交易帶策略。
year: 2026
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [可靠性與不確定性]
methods: [粗糙波動模擬, 穩健最佳化, 條件風險值]
researchQuestion: 單一、考慮不確定性的無交易帶，能否在模型與成本錯配下同時減少尾部損失及換手？
dataType: 合成市場實驗
codeAvailable: true
dataAvailable: false
studentSuitable: false
heroImage: /science/rough-volatility-robust-hedging/rough_hedging_paths.svg
period: 2026
validation: 留出情境網格、鞅合理性檢查與固定策略比較。
keyFindings:
  - 選出的無交易帶寬度為 0.12。
  - 留出測試的平均 CVaR 由 9.517 降至 8.847，換手同時下降 42.33%。
limitations:
  - 不構成投資或實盤執行主張。
  - 模擬器未以市場數據校準。
redirectFrom: []
---

## 編輯導讀

結果只代表留出模擬情境的比較，並非交易建議。完整文章見[〈面對粗糙波動與交易成本的無交易帶〉](/zh/writing/rough-volatility-robust-hedging/)。
