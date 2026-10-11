---
title: "Choose the Question Before the Score"
slug: choose-the-question-before-the-score
summary: A small error or an improved average answers only its own question. Event timing and worst-group reliability need their own checks.
date: 2026-10-11
lastUpdated: 2026-10-11
draft: false
featured: false
archived: false
type: Teaching Notes
topicIds: [risk-decisions, cities-engineering, data-ai]
topics: [Evaluation design, Event timing, Prediction intervals]
relatedSlugs: [when-a-traffic-solver-invents-a-jam, when-solar-power-changes-fast]
---

A score becomes useful when its connection to the intended question is clear. Before choosing one, ask: **which output must this comparison support?**

## A final state is not an arrival time

In [When a Traffic Solver Invents a Jam](/writing/when-a-traffic-solver-invents-a-jam/), one numerical solution has an exceptionally small final global error because the shock aligns with a cell boundary at the final time. Earlier, its smeared front crosses the fixed sensor threshold late.

Both measurements are valid. The final norm compares cell averages at one time; the event measure checks when a sensor trajectory crosses a declared threshold. Neither substitutes for the other. If arrival time matters, the evaluation needs an arrival-time check, together with its threshold and interpolation rule. This is a dimensionless synthetic benchmark, not evidence about real-road delays or a universal ranking of traffic solvers.

## An improved average can leave a difficult group behind

[When Solar Power Changes Fast](/writing/when-solar-power-changes-fast/) separates relative improvement from an absolute reliability requirement. Descriptor CQR improves the compared worst-group endpoint at every confirmation station and improves aggregate proper interval scores. Yet no deployable candidate clears the study's all-station absolute criterion.

Wider intervals can improve coverage while imposing an efficiency cost elsewhere. Reporting width, coverage, proper score and eligible-group support keeps those trade-offs visible. It does not establish the value of a dispatch decision, which the study did not evaluate.

These examples use different models and data. Their lesson is about evaluation design, not pooling their scores: name the target output, specify the comparison and eligible population, declare the relevant criteria, and retain failures alongside improvements. A successful aggregate score can be part of the answer without becoming permission to stop asking about the quantity that motivated the study.
