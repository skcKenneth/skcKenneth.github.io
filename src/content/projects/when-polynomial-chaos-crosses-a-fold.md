---
title: When Polynomial Chaos Crosses a Fold
slug: when-polynomial-chaos-crosses-a-fold
summary: A reproducible Phase-1 CSTR study compares global and analytic-oracle fold-aligned Legendre surrogates at a matched 16-forward-evaluation fit budget.
year: 2026
lastUpdated: 2026-08-29
status: Reproducible study
featured: false
topics: [Uncertainty quantification, Nonlinear dynamics, Bifurcations]
methods: [Legendre stochastic collocation, Saddle-node bifurcation analysis, Fold-aligned polynomial chaos]
researchQuestion: Under one fold-centered uncertainty law and a declared cold-start quasi-static history, how does an oracle fold-aligned surrogate compare with a global polynomial at a matched forward-evaluation fit budget?
dataType: Synthetic dimensionless CSTR equilibria and deterministic surrogate audit grids
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/when-polynomial-chaos-crosses-a-fold/p04_02_global_vs_fold_aligned_response.svg
period: 2026
validation: The frozen result passed all 16 scientific checks, five focused pytest functions, repository and result validators, deterministic reruns, and original-size visual QA.
keyFindings:
  - At 16 fit forward evaluations per method, response RMSE was 0.0783280594 globally and 0.000248551855 with the oracle fold-aligned degree-7+7 construction.
  - Wasserstein-1 error was 0.0439521168 globally and 5.03489790e-5 fold-aligned, corresponding to improvement factors of about 315.14 and 872.95 for RMSE and Wasserstein-1.
  - Under the declared history, analytic hot probability was 0.5; the global surrogate gave 0.4710647474 and 0.0531311035 invalid-support mass, while the fold-aligned surrogate gave 0.5 and zero measured invalid-support mass.
limitations:
  - This is a Phase-1 synthetic benchmark using an analytic fold as an oracle boundary; fold discovery and setup cost are excluded, so it is neither adaptive nor a total-cost comparison.
  - It covers one dimensionless CSTR, one symmetric fold-centered input law, one branch history, one polynomial allocation, and one 16-evaluation fit budget.
  - It establishes no finite-rate dynamics, physical calibration, industrial or chemical safety conclusion, automatic partitioning, final sweep, or universal superiority.
redirectFrom: []
---

## Editorial overview

The literature gate returned **REFRAME** because multi-element polynomial chaos, discontinuity detection, stochastic bifurcation analysis, and uncertain CSTRs already have direct precedents. The defensible local contribution is a transparent single-case stress test, not a new generic method.

Read [When Polynomial Chaos Crosses a Fold](/writing/when-polynomial-chaos-crosses-a-fold/) for the analytic fold derivation, explicit cold-start history, matched 16-call fit design, exact reliability metrics, retained environment and visual-QA failures, reproduction record, and locked next stages.
