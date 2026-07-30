---
title: Michaelis-Menten QSSA 有效性圖譜
slug: michaelis-menten-qssa-validity
sourceSlug: michaelis-menten-qssa-validity
summary: 一個包含 243 組參數的圖譜，量度 Michaelis-Menten 準穩態近似何時能取代完整質量作用模型，以及何時軌跡或反應時間誤差變得重要。
year: 2026
lastUpdated: 2026-07-30
status: Reproducible study
featured: true
topics: [酶動力學, 模型降階]
methods: [快慢 ODE 分析, 參數空間審核, 任務導向誤差指標]
researchQuestion: 在哪些參數區域、輸出與時間尺度下，Michaelis-Menten QSSA 才能準確取代完整質量作用動力學？
dataType: 受控的確定性酶動力學參數掃描
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/michaelis-menten-qssa-validity/qssa-validity-atlas.svg
period: 2026
validation: 已在指定的 Python 3.12 與 SciPy 1.16 環境通過三項測試，並重新驗證全部 21 個輸出的 checksum。
keyFindings:
  - 243 組參數的最大產物軌跡誤差介乎 0.000540 與 0.266198。
  - 最差測試點為 epsilon 0.6、sigma 0.05；時間誤差與軌跡誤差並沒有同一條普遍邊界。
limitations:
  - 圖譜是合成研究，並非任何指定酶的動力學常數估計。
  - 未包含產物抑制、協同結合、擴散、酶失活與低分子數隨機效應。
redirectFrom: []
---

## 編輯導讀

完整文章請閱讀[Michaelis-Menten 何時不再有效](/zh/writing/when-michaelis-menten-stops-being-valid/)，內容包括完整質量作用機制、無因次化、243 組有效性圖譜、事件時間診斷、慢流形幾何與五幅公開圖。

公開文章只報告經核對的結論，不會暴露私有參數表、notebook、程式或原始軌跡。
