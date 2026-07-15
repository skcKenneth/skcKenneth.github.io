---
title: Competition Modeling Studio
slug: competition-pathway
summary: Structured practice in problem framing, team workflow, rapid computation, validation, and report design.
lastUpdated: 2026-07-15
featured: true
topics: [competitions, teamwork, writing]
level: Competition
resourceType: Course pathway
---

This studio is for learners who already understand variables, assumptions, and baseline models. Timed cases are used to practise prioritisation, teamwork, computational discipline, and technical communication under incomplete information.

## Studio principles

- **Baseline before novelty.** A transparent reference model gives the team something to test and improve.
- **One evidence chain.** The question, model, code, figures, and conclusion must describe the same experiment.
- **Roles without silos.** Every team member should be able to explain the central assumptions and primary result.
- **Validation under time pressure.** At least one numerical check, sensitivity test, or competing baseline is planned from the start.
- **Claims stop at the evidence.** A polished report does not turn a synthetic result into field validation.

## Timed case workflow

### Briefing and triage

The team identifies the decision, stakeholders, required outputs, data constraints, and ambiguous terms. Questions are ranked by importance rather than attacked simultaneously.

### Framing sprint

Students draft a system boundary, quantity table, assumption register, and candidate baselines. The team selects a primary question and explicitly defers lower-value extensions.

### Baseline checkpoint

Before complex computation, the team presents a result that can be reproduced by hand or with a short script. A weak baseline is revised before optimisation or simulation begins.

### Experiment log

Each run records its configuration, seed where relevant, output path, and interpretation. Figures are generated from saved results rather than assembled manually at the end.

### Challenge review

One student acts as an internal reviewer: checking units, boundary cases, leakage between training and evaluation, unsupported language, and whether each figure answers the stated question.

### Report integration

The final report is organised around claim-evidence pairs. Methods that did not affect the conclusion are shortened; limitations that affect interpretation remain visible.

### Retrospective

After submission, the team identifies one modelling decision to retain, one to revise, and one test that would be required before the result could support a real decision.

## Team roles

Roles can rotate across cases:

| Role | Primary responsibility | Required cross-check |
|---|---|---|
| Framing lead | question, system boundary, assumptions | verifies that outputs answer the prompt |
| Model lead | equations, baseline, units | explains limiting cases to the team |
| Computation lead | code, configuration, result tables | supplies a reproducible run record |
| Evidence editor | figures, claim map, report structure | challenges unsupported conclusions |

## Evidence used for assessment

The submission is assessed through the model brief, experiment log, reproducible primary figure, validation memo, and final report. Visual polish matters only after the calculation and interpretation agree.

## Public cases

The [coastal-defence article](/writing/2026-01-19-blog-post-4/) supports discussion of multi-objective decisions and uncertainty. [Designing for the Missing Sensor](/writing/designing-for-the-missing-sensor/) is useful for a reliability case in which a strong nominal solution may fail when one measurement disappears.
