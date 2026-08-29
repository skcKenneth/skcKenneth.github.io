---
title: 同一個積分器跨越快慢尺度邊界
slug: one-integrator-across-the-fast-slow-boundary
sourceSlug: one-integrator-across-the-fast-slow-boundary
summary: 一項凍結 Michaelis-Menten property audit 驗證 conservation、non-negativity 與 fixed-step slow limit，同時保留 AP update 在 error 上未能勝過 backward Euler 的 null result。
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [酵素動力學, 奇異攝動, 數值分析]
methods: [Linearly implicit AP integration, Radau IIA reference, Backward Euler and RK4 audit]
researchQuestion: 一個簡單 linearly implicit update 能否在 frozen stiffness grid 保留可證 structure 與正確 fixed-step slow limit，而不暗示 error 或 runtime superiority？
dataType: 合成無因次 irreversible Michaelis-Menten trajectories 與 numerical-property diagnostics
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/one-integrator-across-the-fast-slow-boundary/p08_03_null_error_advantage.svg
period: 2026
validation: 全部凍結 reference、invariant、non-negativity、slow-limit、order、uniform-envelope 及 event gates 通過；十一個 mathematical tests 與 repository checks 通過；canonical 與 rerun signatures 完全一致；五組 figure triples 通過 original-size PNG 及 PDF-raster QA。
keyFindings:
  - Closed-form linearly implicit update 可由代數證明保留 exact weighted invariant、保持 nonnegative 且 c 不大於一，並具有正確 fixed-step epsilon-to-zero update。
  - Frozen grid 上 minimum last-pair order 為 0.7885、maximum fixed-step AP-limit discrepancy 為 3.4480e-7、finest-step uniform weighted-error envelope 為 0.0053654。
  - "Comparative hypothesis 為 null：全部 frozen epsilon 的 AP error 都比 backward-Euler error 高，ratio 介乎 1.0143 至 2.0444；RK4 在 28/40 fixed cases 失敗或不再 physical。"
limitations:
  - 證據只涵蓋一個合成無因次 irreversible Michaelis-Menten family、十個 epsilon、四個 fixed steps 與一個 ill-prepared initial condition。
  - 專案沒有提出新 AP/IMEX solver 或 uniform-accuracy theorem，也沒有 external Radau/BDF/VODE work-precision comparison。
  - 沒有 biochemical parameter fit、experiment、biological validation、clinical claim 或 runtime-superiority result。
redirectFrom: []
---

## 編輯導讀

文獻 gate 結論是 **REFRAME**，因為 Michaelis-Menten singular perturbations、IMEX/AP error analysis、uniformly accurate conditions 與 positive conservative kinetics integrators 均有成熟先行研究；Kaiser 與 Schutz（2018）更直接重疊原擬 method headline。

完整文章請閱讀[同一個積分器跨越快慢尺度邊界](/zh/writing/one-integrator-across-the-fast-slow-boundary/)，內容包括模型、update equations、代數 property audit、tolerance-tightened Radau reference、frozen error grid、保留的 backward-Euler comparison null、RK4 failures、reduced-model boundary 與完整 reproduction record。
