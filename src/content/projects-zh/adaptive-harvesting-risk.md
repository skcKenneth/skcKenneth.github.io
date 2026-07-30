---
title: Allee 風險下的自適應採收
slug: adaptive-harvesting-risk
sourceSlug: adaptive-harvesting-risk
summary: 一項已驗證的隨機族群研究，比較固定、比例與保護線採收在非線性崩潰門檻附近的表現。
year: 2026
lastUpdated: 2026-07-30
status: Reproducible study
featured: true
topics: [環境模型, 可靠性與不確定性]
methods: [強 Allee 差分方程, Monte Carlo 風險估計, 回饋政策比較]
researchQuestion: 在強 Allee 門檻附近，哪種回饋規則可以在維持產量的同時限制有限期崩潰風險？
dataType: 受控合成族群軌跡
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/adaptive-harvesting-risk/risk-yield-frontier.svg
period: 2026
validation: 六個來源測試、輸出驗證、共用環境序列的 Monte Carlo 比較及摘要雜湊檢查。
keyFindings:
  - 固定配額 8 在 150 次模擬出現 28 次崩潰，配額 7 則只有 1 次。
  - 測試的門檻自適應網格沒有觀察到崩潰，但有限樣本風險上界仍非零。
limitations:
  - 模型沒有校準至任何具名物種或漁業。
  - 未包含觀察誤差、控制延遲、年齡結構與空間動力。
redirectFrom: []
---

## 編輯導覽

本專案研究政策機制，而不是提出管理建議。完整雙語研究筆記〈[當永續採收變成陷阱](/zh/writing/when-sustainable-harvesting-becomes-a-trap/)〉包含模型、Monte Carlo 不確定性、四幅經審核圖，以及由完美狀態變數走向可監測政策的具體路線。
