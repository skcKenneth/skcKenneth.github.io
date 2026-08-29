---
title: 網格能否保留這個事件？
slug: can-a-mesh-preserve-the-event
sourceSlug: can-a-mesh-preserve-the-event
summary: 這項可重現 Phase-1A 審計在 adaptive-mesh 比較前停止，因為凍結的 modal-transfer event 從未通過 50-unit establishment rule。
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [數值分析, 數學生物學, 自適應有限元素]
methods: [Uniform P1 finite elements, Conservative finite differences, Event admissibility audit]
researchQuestion: 在進行任何 goal-adaptive finite-element 比較前，一個凍結的 modal-transfer 定義能否先產生收斂且經獨立方法核對的 reference event？
dataType: 合成一維 growing-domain reaction-diffusion trajectories 與 event diagnostics
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/can-a-mesh-preserve-the-event/p01_01_event_score.svg
period: 2026
validation: 兩次不改設定的 canonical attempts 共用同一 numerical signature；17 個 tests 與獨立 assembly/order checks 全部通過，六組 canonical PNG/PDF figures 亦通過原尺寸 overlap 與 clipping 複核。
keyFindings:
  - 所有 growing-domain FEM 與 FD solves 都在時間約 539.45 至 541.39 出現 diagnostic raw S=0.5 crossing，但沒有一個通過凍結的 50-unit establishment rule。
  - 同時符合 amplitude 與 modal-fraction 條件的最長區間只有 16 time units，因此所有 formal event time 都是 null，terminal verdict 為 STOP_PHASE1A。
  - Residual adaptivity、adjoint、goal marking、estimator effectivity、matched-resolution comparison 與 efficiency claims 均維持 locked，沒有執行。
limitations:
  - 結果只是對一個合成一維 prescribed-growth Schnakenberg benchmark 及一個 event definition 的 reference-feasibility null。
  - Solver verification 通過不能挽救失敗的 event gate，亦不能在看到結果後用 raw score crossing 取代原定義。
  - 不支持 biological calibration、adaptive-mesh result、一般 finite-element 排名或 computational-efficiency 結論。
redirectFrom: []
---

## 編輯導讀

文獻 gate 結論是 **REFRAME**：growing-domain reaction–diffusion pattern、adaptive FEM、nonlinear reaction–diffusion goal adaptivity 與 first-threshold-time error estimation 均已有直接先行研究。因此，專案先處理一個更窄的必要條件：確認某個 smooth modal-transfer event 是否真的存在，並可由獨立數值方法建立 reference。

這個必要條件失敗。完整文章請閱讀[網格能否保留這個事件？](/zh/writing/can-a-mesh-preserve-the-event/)，內容包括凍結 event definition、不能被升格為 event 的 raw crossing、FEM/FD concordance、no-growth control、numerical verification、rejected-to-accepted visual history、精確重現紀錄，以及仍然 locked 的 adaptive claims。
