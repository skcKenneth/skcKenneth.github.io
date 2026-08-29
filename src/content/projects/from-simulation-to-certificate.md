---
title: From Simulation to Certificate
slug: from-simulation-to-certificate
summary: A frozen synthetic two-compartment benchmark separates finite spectral checks from verified all-parameter decay certificates and measures a benchmark-specific diagonal restriction gap.
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [Positive systems, Robust control, Numerical verification]
methods: [Lyapunov inequalities, Polytopic uncertainty, Certificate residual audit]
researchQuestion: How does a diagonal restriction change the constructed robust decay lower bound as endpoint imbalance increases in one frozen positive leaky-transfer family?
dataType: Synthetic two-compartment Metzler matrices, finite spectral diagnostics, and verified quadratic certificate records
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/from-simulation-to-certificate/p09_02_certificate_decay_stress.svg
period: 2026
validation: All six frozen benchmark gates and six numerical tests passed; every endpoint certificate passed direct residual checks; the canonical and rerun results are byte-identical; and four figure triples passed two-reviewer original-size PNG and PDF-raster QA after a preserved rev1 rejection.
keyFindings:
  - At zero stress, diagonal and full constructed decay bounds agree to a relative 3.596327e-11 in the manufactured midpoint check.
  - At full stress, the dense finite diagnostic is 0.2676586726, the verified full certificate is 0.2676585204, and the verified diagonal certificate is 0.1040795885, giving a benchmark-specific diagonal gap of 0.6111480807.
  - The maximum full-to-dense gap is 5.686579e-7 and the largest 241-versus-121 construction-grid change is 6.763624e-5; neither statistic establishes global SDP optimality.
limitations:
  - The evidence covers one deliberately selected synthetic two-state affine segment and does not establish a general law of diagonal-LMI conservatism.
  - Dense and seeded spectral sweeps remain finite diagnostics, while the deterministic grid constructs feasible trace-normalized matrices without proving a globally optimal SDP solution.
  - No large-network scaling, physical system, experimental data, controller, safety conclusion, new theorem, or universal certificate ranking is provided.
redirectFrom: []
---

## Editorial overview

The literature gate returned **COMPLETE / REFRAME** because common diagonal, copositive, quadratic, switched, robust and scalable positive-system certificates are established. The local contribution is an auditable two-state evidence-hierarchy benchmark, not new control theory or a new solver.

Read [From Simulation to Certificate](/writing/from-simulation-to-certificate/) for the Metzler family, stress construction, Lyapunov derivation, distinction between finite diagnostics and all-parameter endpoint certificates, exact 6/6 gate audit, development-selection boundary, rejected-to-revised figure history, reproduction hashes and locked next stages.
