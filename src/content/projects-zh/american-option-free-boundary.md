---
title: 美式賣權自由邊界核證
slug: american-option-free-boundary
sourceSlug: american-option-free-boundary
summary: 一項可重現障礙 PDE 研究，求解美式賣權履約邊界，並以三種數值方法核證價格、Greeks、收斂與互補條件。
year: 2026
lastUpdated: 2026-08-02
status: Reproducible study
featured: true
topics: [量化金融, 數值分析]
methods: [變分不等式, PSOR 有限差分, 跨方法核證]
researchQuestion: 如何同時核證美式賣權價格、最優停止邊界與數值互補條件？
dataType: 受控合成期權定價實驗
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/american-option-free-boundary/free-boundary-surface.png
period: 2026
validation: 已在指定環境通過三項自動測試，並重生及驗證全部 34 個聲明輸出的 checksum。
keyFindings:
  - 設定案例的美式賣權價格為 8.56494，估值日履約邊界為 71.7972。
  - 最大互補殘差為 1.20e-8，並有獨立二項樹與模擬方法作交叉核證。
limitations:
  - 研究使用合成模型，並非交易建議。
  - 未包括隨機波動率、跳躍、離散股息、交易成本與校準不確定性。
redirectFrom: []
---

## 編輯導讀

完整文章請閱讀[美式賣權應該何時提前履約？](/zh/writing/when-an-american-put-should-be-exercised/)，內容包括最優停止、障礙離散化、Rannacher 診斷、收斂研究、方法比較、敏感度分析、term structure 延伸與八幅經審核圖像。

公開文章只報告經核對結論，不會暴露私有 notebook、solver 程式、原始表格或計算筆記。
