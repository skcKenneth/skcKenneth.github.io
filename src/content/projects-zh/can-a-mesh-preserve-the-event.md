---
title: 網格能否保留這個事件？
slug: can-a-mesh-preserve-the-event
sourceSlug: can-a-mesh-preserve-the-event
summary: 這個 matched-work Phase-1 experiment 比較 uniform、residual 與 DWR meshes；在 36 elements 下，uniform 反而最能保留 growing-domain modal-transition time。
year: 2026
lastUpdated: 2026-09-05
status: Reproducible study
featured: false
topics: [數值分析, 數學生物學, 自適應有限元素]
methods: [Uniform P1 finite elements, Residual mesh adaptation, Dual-weighted residual adaptation]
researchQuestion: 在相同 production work 下，one-shot goal-oriented adaptation 能否比 uniform 或 residual meshes 更準確地保留 smooth modal-transition time？
dataType: 合成一維 growing-domain reaction-diffusion trajectories、meshes 與 modal-transition diagnostics
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/can-a-mesh-preserve-the-event/phase1_reference_event.svg
period: 2026
validation: Spectral reference 在 simultaneous space-time refinement 後只移動 0.000641；事件是 transversal，adjoint sensitivity 與 finite difference 的 relative difference 為 8.24e-9，四張 publication figures 均通過原尺寸 overlap 與 clipping 複核。
keyFindings:
  - Independent reference event 是 46.7916；refinement shift 為 0.000641，crossing slope 是 0.0584。
  - 在相同 36-element production work 下，uniform event-time error 為 2.6001、DWR 為 3.2752、residual 為 4.4030。
  - 全部 errors 都超過預定 1.5 ceiling，因此保留 Phase-1 REFRAME verdict，不作 method-superiority claim。
limitations:
  - 這只是一次 deterministic 36-element smoke experiment，不是 convergence study 或一般 adaptive-method ranking。
  - One-shot DWR mesh 承接一個偏遲的 coarse-pilot event，而 residual 混合 spatial、temporal 與 splitting effects。
  - Synthetic one-dimensional model 沒有 biological calibration，matched primal work 亦未包含 estimator overhead。
redirectFrom: []
---

## 編輯導讀

這次實驗已經進入 adaptive comparison：先以 independent spectral solver 建立 verified smooth event，再讓 uniform、residual 與 DWR meshes 使用相同 production DOFs。Uniform 的誤差最小，但所有方法都未通過預定 ceiling。

完整文章請閱讀[網格能否保留這個事件？](/zh/writing/can-a-mesh-preserve-the-event/)，內容包括 model、event sensitivity、matched-work design、四張 publication figures、coarse-pilot diagnosis，以及下一步所需的 refinement ladder。
