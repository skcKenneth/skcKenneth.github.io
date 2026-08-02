---
title: American Put Free-Boundary Audit
slug: american-option-free-boundary
summary: A reproducible obstacle-PDE study resolves the American put exercise boundary and audits price, Greeks, convergence, and complementarity across three numerical methods.
year: 2026
lastUpdated: 2026-08-02
status: Reproducible study
featured: true
topics: [Quantitative Finance, Numerical Analysis]
methods: [Variational inequality, PSOR finite differences, Cross-method validation]
researchQuestion: How can an American put price, stopping boundary, and complementarity conditions be validated together?
dataType: Controlled synthetic option-pricing experiments
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/american-option-free-boundary/free-boundary-surface.png
period: 2026
validation: Three automated tests passed in the pinned environment; all 34 declared outputs were regenerated and checksum-validated.
keyFindings:
  - The configured American put price is 8.56494 and the valuation-date exercise boundary is 71.7972.
  - The maximum complementarity residual is 1.20e-8, with independent tree and simulation checks.
limitations:
  - The study is synthetic and is not trading advice.
  - Stochastic volatility, jumps, discrete dividends, transaction costs, and calibration uncertainty are outside scope.
redirectFrom: []
---

## Editorial overview

Read [When Should an American Put Be Exercised?](/writing/when-an-american-put-should-be-exercised/) for the optimal-stopping formulation, obstacle discretisation, Rannacher diagnostic, convergence study, method comparison, sensitivity analysis, term-structure extension, and eight approved figures.

The public article reports reviewed conclusions without exposing the private notebook, solver source, raw tables, or calculation notes.
