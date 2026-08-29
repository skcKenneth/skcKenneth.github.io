---
title: 當交通求解器製造出一場塞車
slug: when-a-traffic-solver-invents-a-jam
sourceSlug: when-a-traffic-solver-invents-a-jam
summary: 一個保留失敗結果的 LWR benchmark 顯示，final shock-grid alignment 可令 cell-average norm 看似近乎精確，但門檻到達時間與 queue accounting 仍然有偏差。
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [交通流, 數值分析, 守恆律]
methods: [Finite-volume methods, Exact Riemann reference, Operational event diagnostics]
researchQuestion: Final shock-grid alignment 能否令 cell-average refinement gate 產生誤導，而固定的 operational event 與 queue metrics 仍顯示 numerical bias？
dataType: 合成無因次 LWR Riemann trajectories 與 threshold-defined diagnostics
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/when-a-traffic-solver-invents-a-jam/p10_01_shock_profiles.svg
period: 2026
validation: 十個 evidence tests、repository checker、exact-reference 與 invariant checks、兩次 identical numerical signatures 及 original-size PNG/PDF visual QA 均通過；predeclared final-L1 scientific gate 保留 verified null。
keyFindings:
  - 精確 backward shock speed 是 -0.05，固定 sensor arrival 是 4.0；十二個 numerical cases 全部 finite、bounded 及 conservative。
  - N=50 時，因 final shock 與 cell boundary 對齊，Godunov final cell-average L1 error 約為 1.37e-11，但 threshold arrival 仍遲 0.517647。
  - Arrival delay、transition width 及 threshold-defined queue errors 隨 refinement 改善，但 Godunov 與 Rusanov 的 frozen strict final-L1 gate 均失敗。
limitations:
  - Evidence 只涵蓋一個無因次 Greenshields shock、一個 sensor、一個 threshold、一個 CFL 及四層 grid。
  - 沒有 empirical road、detector、calibration、travel-time forecast、safety conclusion 或 transport-policy recommendation。
  - 研究沒有推導 modified-equation coefficient、沒有新 theorem，也沒有 finite-volume schemes 的 universal ranking。
redirectFrom: []
---

## 編輯導讀

文獻 gate 結論是 **REFRAME**，因為 LWR shocks、entropy selection、Godunov 與 cell-transmission methods、numerical diffusion 及 high-resolution comparisons 均是成熟領域。可辯護的貢獻是一個保留 null 的 frozen replication-extension diagnostic，不是新 solver 或 real-traffic claim。

完整文章請閱讀[當交通求解器製造出一場塞車](/zh/writing/when-a-traffic-solver-invents-a-jam/)，內容包括 exact shock derivation、grid-alignment mechanism、四項 operational diagnostics、完整十二案例結果、failure record、reproduction signature 及 claim boundary。
