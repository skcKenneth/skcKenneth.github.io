---
title: Heavy-Tailed Financial Risk Stress Test
slug: heavy-tailed-financial-risk
summary: A reproducible VaR and expected-shortfall comparison under volatility clustering, leverage, Student-t innovations, and rare negative jumps.
year: 2026
lastUpdated: 2026-08-02
status: Reproducible study
featured: true
topics: [Financial Risk, Time Series]
methods: [GARCH-family models, Extreme value theory, VaR backtesting]
researchQuestion: How much tail risk can Gaussian forecasts hide when volatility clusters and losses include heavy tails and jumps?
dataType: Controlled synthetic financial returns
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/heavy-tailed-financial-risk/returns-and-volatility.svg
period: 2026
validation: Three automated tests passed in the pinned environment; all 37 declared outputs were regenerated and checksum-validated.
keyFindings:
  - Filtered historical simulation is closest to the nominal 1% exception rate at 0.00972.
  - The fitted Student-t GARCH degrees of freedom is 4.2685, indicating materially heavy innovations.
limitations:
  - The returns are synthetic and the results are not investment advice.
  - Multivariate dependence, liquidity, transaction costs, and structural breaks are outside scope.
redirectFrom: []
---

## Editorial overview

Read [How Much Tail Risk Does a Gaussian Model Hide?](/writing/how-much-tail-risk-a-gaussian-model-hides/) for the stress process, diagnostics, VaR and ES forecasts, backtests, calibration, tail-risk surface, uncertainty, sharpness frontier, and nine approved figures.

The public page interprets reviewed evidence without exposing private code, fitted arrays, notebooks, or intermediate calculations.
