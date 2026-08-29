---
title: 當降階通風模型離開訓練範圍
slug: when-a-reduced-ventilation-model-leaves-its-training-regime
sourceSlug: when-a-reduced-ventilation-model-leaves-its-training-regime
summary: 這項可重現的合成 POD 與 POD-DEIM 審計在 nominal inadmissibility 停止，因此不能對 schedule、source-location 或 ventilation shift 作可靠性歸因。
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [降階模型, 室內傳輸, 數值可靠性]
methods: [Proper orthogonal decomposition, Discrete empirical interpolation, Conservative finite-volume transport]
researchQuestion: 在解釋 schedule、source-location 與 ventilation shifts 前，nominally trained POD 與 POD-DEIM 能否先通過凍結的 nominal trust gate？
dataType: 合成二維 passive-scalar trajectories、person-zone summaries 與 reduced-model diagnostics
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_01_basis_nominal_gate.svg
period: 2026
validation: Full-order reference 通過 positivity 與 time-refinement gates；20 個 tests 通過，兩次 canonical attempts 的 numerical JSON byte-equivalent 且共用同一 signature，五組 PNG/PDF figures 亦通過原尺寸 overlap 與 clipping 複核。
keyFindings:
  - Nominal POD 與 POD-DEIM field errors 分別是 0.181929901217 與 0.364300559015，高於凍結的 0.05 gate，因此 phase 在 shift attribution 前停止。
  - 24-point residual warning 與 error 的 Spearman correlation 是 -0.50，低於預先申報的 +0.60 gate，亦未通過 worst-case ranking test。
  - Accepted attempt 的 median POD-DEIM online speedup 是 2.978205301x，未達 5x gate；timing 不包括 offline construction，而且依賴執行環境。
limitations:
  - 因 nominal admissibility 失敗，shifted trajectories 只能作 diagnostics，不能證明 distribution shift 造成額外 reliability loss。
  - 五個 cases 的 sampled-residual 結果只 refute 一條 frozen warning rule，不是否定所有 residual diagnostics 或 POD/DEIM models。
  - Benchmark 是 deterministic synthetic passive-scalar surrogate，不是 calibrated building、health、infection-risk、controller-safety 或 deployment study。
redirectFrom: []
---

## 編輯導讀

文獻 gate 結論是 **REFRAME**，因為室內場 POD、ventilation optimization、boundary interpolation、DEIM hyper-reduction 與 DEIM error estimation 均已有直接先行研究。可辯護的專案是一項透明 trust-gate audit，而不是新 POD 或 DEIM 方法。

Full-order reference 通過驗證，但兩個 reduced models 都在 nominal control 失敗；terminal verdict 是 **STOP_REFERENCE_OR_ROM_INADMISSIBLE**。完整文章請閱讀[當降階通風模型離開訓練範圍](/zh/writing/when-a-reduced-ventilation-model-leaves-its-training-regime/)，內容包括 frozen transport model、training 與 holdout design、精確 nominal failure、不能歸因的 shift diagnostics、被 refute 的 warning 與 speed gates、two-run reproduction record、visual QA，以及仍在範圍外的 real-building claims。
