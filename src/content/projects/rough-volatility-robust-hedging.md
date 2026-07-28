---
title: Robust Hedging under Rough Volatility
slug: rough-volatility-robust-hedging
summary: A frozen no-trade band is evaluated across unseen roughness, volatility-of-volatility, and cost regimes.
year: 2026
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [Reliability and Uncertainty]
methods: [Rough-volatility simulation, Robust optimization, CVaR]
researchQuestion: Can one uncertainty-aware no-trade band reduce tail loss and turnover under model and cost misspecification?
dataType: Synthetic market experiment
codeAvailable: true
dataAvailable: false
studentSuitable: false
heroImage: /science/rough-volatility-robust-hedging/rough_hedging_paths.svg
period: 2026
validation: Held-out scenario grid, martingale sanity check, and frozen-policy comparison.
keyFindings: [The selected band is 0.12., Held-out mean CVaR falls from 9.517 to 8.847 while turnover falls 42.33%.]
limitations: [No investment or live-execution claim., Simulator is not calibrated to market data.]
redirectFrom: []
---

## Editorial overview

The result is a held-out simulator comparison, not a trading recommendation. Read [A No-Trade Band for Rough Volatility and Transaction Costs](/writing/rough-volatility-robust-hedging/).

