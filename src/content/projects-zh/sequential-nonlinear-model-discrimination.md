---
title: 非線性模型的序列分辨
slug: sequential-nonlinear-model-discrimination
sourceSlug: sequential-nonlinear-model-discrimination
summary: 在六輪實驗預算下，以自適應外力實驗分辨 Van der Pol、Rayleigh 與 Duffing 振盪器族。
year: 2026
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [可靠性與不確定性]
methods: [Bayesian 實驗設計, 非線性振盪器, 粒子模型選擇]
researchQuestion: 哪些外力實驗最有效率地分辨互相競爭的非線性機制？
dataType: 合成封閉世界基準
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/sequential-nonlinear-model-discrimination/model_design_landscape.svg
period: 2026
validation: 重複試驗、固定與 oracle 基準、Brier 分數及求解器容差檢查。
keyFindings:
  - 自適應設計達到 100% 準確率及 0.00287 Brier 分數。
  - 固定設計達到 96.19% 準確率及 0.0509 Brier 分數。
limitations:
  - 後驗概率以三個候選模型族為條件。
  - 不聲稱已識別任何真實振盪器。
redirectFrom: []
---

## 編輯導讀

自適應策略選擇能最大化預測分離度的實驗，而非單純追求最大反應幅度。完整文章見[〈向振盪器提出最能分開模型的實驗〉](/zh/writing/sequential-nonlinear-model-discrimination/)。
