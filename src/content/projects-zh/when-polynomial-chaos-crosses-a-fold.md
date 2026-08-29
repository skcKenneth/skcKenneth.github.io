---
title: 當多項式混沌跨過折疊點
slug: when-polynomial-chaos-crosses-a-fold
sourceSlug: when-polynomial-chaos-crosses-a-fold
summary: 這項可重現的第一階段 CSTR 研究，在同為 16 次 forward-evaluation fit budget 下，比較全域 Legendre surrogate 與 analytic-oracle fold-aligned surrogate。
year: 2026
lastUpdated: 2026-08-29
status: Reproducible study
featured: false
topics: [不確定性量化, 非線性動力學, 分岔]
methods: [Legendre stochastic collocation, Saddle-node bifurcation analysis, Fold-aligned polynomial chaos]
researchQuestion: 在單一 fold-centered uncertainty law 及明確 cold-start quasi-static history 下，oracle fold-aligned surrogate 與全域 polynomial 在相同 fit evaluation budget 的表現有何差別？
dataType: 合成無因次 CSTR equilibria 與 deterministic surrogate audit grids
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/when-polynomial-chaos-crosses-a-fold/p04_02_global_vs_fold_aligned_response.svg
period: 2026
validation: Frozen result 通過全部 16 個 scientific checks、五個 focused pytest functions、repository 與 result validators、deterministic reruns，以及 original-size visual QA。
keyFindings:
  - 每個方法各用 16 次 fit forward evaluations；global response RMSE 為 0.0783280594，oracle fold-aligned degree-7+7 為 0.000248551855。
  - Global 與 fold-aligned Wasserstein-1 error 分別為 0.0439521168 與 5.03489790e-5；RMSE 及 Wasserstein-1 improvement factors 約為 315.14 與 872.95。
  - 在指定 history 下，解析 hot probability 是 0.5；global surrogate 得到 0.4710647474 及 0.0531311035 invalid-support mass，fold-aligned 則得到 0.5 及零 measured invalid-support mass。
limitations:
  - 這只是合成第一階段 benchmark，並以 analytic fold 作 oracle boundary；fold discovery 與 setup cost 被排除，所以不是 adaptive method 或 total-cost comparison。
  - 結果只涵蓋一個無因次 CSTR、一個對稱 fold-centered input law、一個 branch history、一種 polynomial allocation 與一個 16-evaluation fit budget。
  - 沒有 finite-rate dynamics、physical calibration、工業或化學安全結論、automatic partitioning、final sweep 或 universal superiority。
redirectFrom: []
---

## 編輯導讀

文獻 gate 結論是 **REFRAME**，因為 multi-element polynomial chaos、discontinuity detection、stochastic bifurcation analysis 與 uncertain CSTR 均已有直接先行研究。可辯護的本地貢獻是一個透明的單案例 stress test，不是一種新的 generic method。

完整文章請閱讀[當多項式混沌跨過折疊點](/zh/writing/when-polynomial-chaos-crosses-a-fold/)，內容包括 analytic fold derivation、明確 cold-start history、matched 16-call fit design、精確 reliability metrics、保留的 environment 與 visual-QA failures、重現紀錄，以及仍被鎖定的下一階段。
