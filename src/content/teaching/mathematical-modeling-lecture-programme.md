---
title: Mathematical Modeling Lecture Programme
slug: mathematical-modeling-lecture-programme
summary: A complete taught sequence connecting mathematical foundations, model construction, computation, decision-making, validation, and technical writing.
lastUpdated: 2026-07-15
featured: true
topics: [curriculum design, mathematical modeling, technical writing]
level: Instructor
resourceType: Course pathway
---

This programme is the organising spine of my mathematical-modeling teaching. The working archive contains **12 main lectures, 10 mathematical-foundation supplements, 5 competition-writing classes, 189 worked examples, 82 exercise sets, and 8 small teaching datasets**. The lesson files remain teaching materials; this page presents the curriculum design rather than distributing the archive itself.

The sequence is designed around a recurring question: **what must a learner understand, produce, and check before a mathematical result becomes a defensible model?**

## Programme architecture

### Strand A — Formulation and empirical models

The opening four lectures move from a vague situation to a model that can be examined against evidence.

| Lecture | Core mathematical work | Modeling judgement |
| --- | --- | --- |
| 1. Discrete models | proportionality, recurrences, logistic difference equations, discrete SIR | deciding what a state variable and update rule represent |
| 2. Scaling relationships | stopping distance, transformed variables, similarity, strength and weight | turning a broad question into a measurable objective |
| 3. Fitting models | least squares, residuals, error measures, linearisation | separating fit quality from structural plausibility |
| 4. Interpolation | linear and polynomial interpolation, differences, splines | choosing a method from data shape and intended use |

The teaching datasets support spring–mass fitting, braking-distance models, sensor fitting, capacity curves, Kepler data, logistic growth, and SIR intervention comparisons. They are small enough for hand checks before students move to code.

### Strand B — Decisions under constraints and uncertainty

Lectures 5–8 introduce computation as a way to compare decisions, not simply to generate output.

| Lecture | Core mathematical work | Modeling judgement |
| --- | --- | --- |
| 5. Simulation | random inputs, Monte Carlo estimation, discrete-event queues | distinguishing one run from a stable decision |
| 6. Linear optimization | feasible regions, binding constraints, slack, integer decisions | explaining what a constraint means in context |
| 7. Decision theory | expected value, decision trees, Bayes updating, EVPI, regret | matching a recommendation to available information |
| 8. Game theory | pure and mixed strategies, dominance, Nash equilibrium | identifying whose incentives the model represents |

Each lecture ends with core practice, a modeling challenge, and an extension route. This creates a shared conceptual lesson while allowing different levels of mathematical independence.

### Strand C — Dynamic, continuous, and qualitative models

Lectures 9–12 widen the model repertoire and make method choice explicit.

| Lecture | Core mathematical work | Modeling judgement |
| --- | --- | --- |
| 9. Differential equations | growth, decay, rate balance, Euler, Heun, RK4, phase planes | checking step size, stability, and extrapolation |
| 10. Continuous optimization | EOQ, gradients, Hessians, Lagrange multipliers, numerical search | interpreting local optima and constrained trade-offs |
| 11. Dimensional analysis | compatible dimensions, Buckingham Pi, scaling and similitude | using units to expose incomplete or implausible models |
| 12. Graphical models | arms races, firm behaviour, tax incidence, discrete updates | making disciplined conclusions when a model is qualitative |

The aim is not to collect techniques. Students compare what each representation makes visible, what it suppresses, and how it can fail.

## Interactive model laboratory

The public [Interactive Model Laboratory](/teaching/model-laboratory/) now provides a searchable route into nine parameter experiments. Three foundation examples connect directly to the core programme:

- a discrete logistic model for equilibrium, overshoot, and convergence;
- an SIR model for transmission, recovery, intervention timing, and peak demand;
- a stopping-distance model for linear and quadratic scaling.

Each example pairs controls with a live graph, calculated quantities, interpretation, and questions to test. The purpose is not to find a visually pleasing curve. Students predict a response, change one assumption, compare the result, and identify what the simplified model still omits.

The separate [Frontier Model Studio](/teaching/frontier-model-studio/) extends this sequence with six research-facing experiments: critical transitions, sparse equation discovery, collective motion, higher-order contagion, operator learning, and persistent homology. Each experiment includes a limitation statement and numbered references so that students can distinguish the teaching mechanism from the claims made in the research literature.

## Mathematical foundations on demand

Ten supplementary units provide a bridge when the modeling task requires mathematics that students have not yet consolidated:

1. sets, relations, functions, domains, and composition;
2. number systems, absolute value, coordinates, and straight-line models;
3. graph interpretation, transformations, periodicity, and asymptotes;
4. limits, continuity, and asymptotic thinking;
5. derivatives as slope, rate, and sensitivity;
6. derivative evidence for optimization and curve diagnosis;
7. integration as accumulated change;
8. probability, distributions, Monte Carlo, and Markov chains;
9. vectors, matrices, systems, least squares, and eigenvalues;
10. multivariable sensitivity, gradients, Hessians, and constrained optimization.

These are not detached revision sheets. Each supplement returns the mathematics to a modeling decision, worked example, differentiated studio, and exercise set.

## Competition writing sequence

Five writing classes run alongside the mathematical lectures.

### W1 — Architecture and traceability

Students design a reader-first paper, map a rubric to evidence, and make assumptions, results, validation, and sensitivity easy to locate.

### W2 — Summary as evidence inventory

Students build the evidence inventory before drafting. They compress the task, strategy, findings, and trust boundaries without turning the summary into a list of methods.

### W3 — Verification, validation, and uncertainty

Students distinguish solving the stated model correctly from showing that the model is adequate for the decision. Assumptions become testable choices rather than ceremonial bullet points.

### W4 — Academic prose and revision

Students match claim strength to evidence strength, integrate equations and visuals into the argument, and revise through structure, reasoning, flow, and concision.

### W5 — Figures, tables, and submission engineering

Students treat each visual as an evidence claim, design pages for scanning and verification, and build a reproducible document rather than a fragile final file.

## Repeated lesson pattern

Across the programme, a lesson typically moves through five phases:

1. **Motivating decision** — a context that needs a quantity, comparison, or recommendation.
2. **Mathematical baseline** — the simplest model that makes the structure visible.
3. **Worked evidence** — a fully reasoned example with units and intermediate checks.
4. **Model critique** — residuals, sensitivity, failure cases, or an alternative assumption.
5. **Differentiated studio** — core, challenge, and extension tasks that produce inspectable work.

## Evidence students produce

The programme assesses the path to the answer as well as the answer itself. Depending on the task, students submit a model brief, variable table, assumption register, fitted or simulated output, residual or sensitivity analysis, validation memo, recommendation, and a publication-ready figure or results page.

## Public boundary

The public Teaching section explains the programme, its progression, and its assessment logic. Detailed lecture source files, solution material, and classroom datasets are retained as teaching resources. Selected public articles and worked cases can be used as companions without exposing the complete notes archive.
