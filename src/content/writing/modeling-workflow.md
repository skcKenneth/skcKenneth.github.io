---
title: From Open Question to Reproducible Model
slug: modeling-workflow
summary: A compact workflow for assumptions, model choice, computation, validation, limitations, and communication.
date: 2026-07-13
lastUpdated: 2026-07-13
featured: true
topics: [modeling education, reproducibility]
type: Teaching Notes
archived: false
redirectFrom: []
---

A strong modeling project is an argument with an audit trail. The governing equation or optimizer matters, but so do the reasons for using it, the data transformations, and the tests that could make us revise the conclusion.

1. State a question narrow enough to test.
2. Separate observed quantities from assumptions.
3. Build the smallest model that exposes the mechanism.
4. Check numerics before interpreting outputs.
5. Compare against a baseline.
6. Perturb important assumptions.
7. Write limitations beside findings, not in an afterthought.
8. Record the command and environment that regenerate the result.
