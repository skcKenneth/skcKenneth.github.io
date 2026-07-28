---
title: 介入校準 Neural ODE
slug: intervention-calibrated-neural-odes
sourceSlug: intervention-calibrated-neural-odes
summary: 在合成 toggle switch 的強留出介入中，比較符號結構受限與不受限的神經向量場。
year: 2026
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [可靠性與不確定性]
methods: [Neural ODE, 結構約束, 集成校準]
researchQuestion: 符號約束能否同時改善介入預測與不確定性誠實度？
dataType: 合成基因迴路軌跡
codeAvailable: true
dataAvailable: false
studentSuitable: false
heroImage: /science/intervention-calibrated-neural-odes/neural_ode_interventions.svg
period: 2026
validation: 留出介入族、bootstrap 集成、拒答診斷與求解器容差檢查。
keyFindings:
  - 結構模型 RMSE 為 0.237，不受限模型為 0.259。
  - 結構模型雖避免負值預測，覆蓋率仍只有 0.721。
limitations:
  - 只測試合成 toggle switch。
  - 集成分散度未能涵蓋機制缺失的不確定性。
redirectFrom: []
---

## 編輯導讀

核心結果刻意保留負面發現：符合物理結構並不保證不確定性已校準。完整文章見[〈Neural ODE 可以符合物理，卻仍然沒有校準〉](/zh/writing/intervention-calibrated-neural-odes/)。
