---
title: Do More Test-Time Steps Make Better Forecasts?
slug: do-more-test-time-steps-make-better-forecasts
topicIds: [data-ai, dynamics-networks, computation-code]
summary: A small-scale independent reimplementation separates context fitting, clean-future prediction and dynamical identification in recurrent linear attention and a tiny Fourier forecasting model.
year: 2026
date: 2026-10-16T21:07:20+08:00
lastUpdated: 2026-10-16T21:07:20+08:00
period: 2026
status: Reproducible study
featured: true
draft: false
topics: [Test-time forecasting, Dynamic mode decomposition, Linear attention, Fourier models, Inverse problems]
methods: [Least-squares controls, Recurrent linear attention, SVD and total DMD, Differentiable AdamW adaptation, Fourier propagation, Held-out system evaluation]
researchQuestion: When more test-time iterations fit the observed context more closely, do they also improve clean future prediction and support an identifiable dynamical explanation?
dataType: Synthetic stable eight-dimensional affine systems and periodic band-limited advection–diffusion fields; no real-world calibration
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/writing/do-more-test-time-steps-make-better-forecasts/
heroImage: /images/test-time-forecasting/fig-01.svg
validation: Independent quadratic and prediction-space updates, gradient and meta-gradient checks, Fourier grid and sampling controls, paired observations, validation-only tuning and two complete scientific-output comparisons.
keyFindings:
  - A sampled periodic field can have identical propagation at speeds 20 and 84 when the sampling interval is 1/64.
  - At 128 updates, squared LDS models had clean held-out median errors 0.0692118, 0.0636388 and 0.0722670, each over 128 successful trajectories; source-rule models failed on all 128 per seed.
  - Clean held-out Fourier forecasts at 128 updates had pretrained-seed median errors 0.0207394, 0.0258472 and 0.0103202, versus identity 0.0683804; each summary retained 160 successful finite trajectories.
  - Same-class Fourier least squares had clean held-out median error 1.0954e-14 and five-percent-noise median 0.0183728; direct fitting remained a strong reference.
  - Better context fit accompanied worse forecasts in 92 of 4,608 finite LDS pairs and 2,084 of 6,720 AD pairs; all such AD pairs came from random initialization, not identity or pretrained starts.
limitations:
  - This is a small-scale independent reimplementation, not the original authors' full numerical reproduction.
  - Three training seeds and a smaller AdamW budget do not support population-level performance or a general judgement of the source method.
  - Held-out linear systems share a generating law; the PDE parameter sweep changes speed and diffusivity together.
  - Context fit, future accuracy and unique physical identification remain different achievements.
---

## More computation, but no additional observations

A model can spend extra inference time updating its forecast rule against the trajectory already in front of it. That is different from receiving new measurements. This project asks whether the improved fit, if present, transfers to an unseen clean future—and whether the same evidence supports the physical interpretation attached to the forecast.

The study follows selected formulas from Lai and colleagues' *Test-Time Forecasting* v1. It is a small-scale independent reimplementation, not a claim to reproduce the complete original experiments. The established DMD, attention/gradient-descent and Fourier-operator background is credited rather than presented as a new learning principle.

## Two controlled cases

The first case reconstructs a 620-parameter recurrent linear-attention model on stable eight-dimensional affine systems. Fifty-six accepted systems are divided into 32 training, eight validation and 16 entirely held-out systems. Direct, regularized, total-DMD and analytic iterative baselines clarify whether a result depends on learned recurrence or on solving the context regression itself. The source-rule normalization and a squared-norm alternative are retained separately.

The second case uses an analytically propagated periodic advection–diffusion field. A seven-mode Fourier adapter is compared from identity, random and pretrained initialization under matched inner optimizer settings. Its 17 stored real quantities include two fixed scalar maps; 15 quantities enter optimization, and fewer combinations are physically identifiable. A direct Fourier least-squares reference distinguishes incomplete optimization from information limitations.

Both cases use the same observations across methods and score against clean future states. The 1% and 5% noise levels refer to temporal-mean-centered training-context fluctuation RMS, not total field magnitude. Tuning uses validation data only. Three training seeds are separate repetitions; neither time points nor multiple trajectories are portrayed as independent model-training replications.

## Forecasting is not automatically identification

An exact regression control shows why squared-norm step-size conditions and null-space initialization matter. A separate periodic sampling control compares speeds 20 and 84 at interval 1/64: their sampled Fourier propagators are identical even though their continuous motion differs. Better sampled prediction cannot resolve an ambiguity that the observations do not contain.

Two complete runs produced identical scientific outputs. Comparing eight with 128 updates, 92 of 4,608 finite LDS pairs and 2,084 of 6,720 finite AD pairs fit context better while forecasting worse. All such AD cases came from random initialization, not identity or pretrained starts, and some occurred without observation noise. The result is not a universal noise-overfitting claim. The complete tables retain 77,184 LDS and 62,400 AD records, with 28,761 and 2,558 failures respectively; these correlated records are not independent replications.

The contribution is a bounded synthetic comparison and mechanism explanation. It does not establish accuracy for weather, engineering measurements or arbitrary Transformers, and a smaller training run with AdamW does not by itself confirm or refute the original SOAP-based study.

Read [*Do More Test-Time Steps Make Better Forecasts?*](/writing/do-more-test-time-steps-make-better-forecasts/) for the derivations, ten research figures, matched comparisons and the distinction between fitting, forecasting and identifying dynamics.
