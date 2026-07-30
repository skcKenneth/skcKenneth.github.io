---
title: Non-isothermal CSTR Hysteresis
slug: nonisothermal-cstr-hysteresis
summary: A nonlinear reactor study maps multiplicity, ignition and extinction hysteresis, basin dependence, and critical slowing near a thermal fold.
year: 2026
lastUpdated: 2026-07-30
status: Reproducible study
featured: true
topics: [Nonlinear Dynamics, Chemical Reactor Modelling]
methods: [Equilibrium continuation, Jacobian stability analysis, Stiff ODE simulation]
researchQuestion: How do stability, path history, and recovery rate change as a non-isothermal reactor approaches thermal ignition or extinction?
dataType: Controlled dimensionless reactor simulations
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/nonisothermal-cstr-hysteresis/equilibrium-branch.svg
period: 2026
validation: Three automated tests and a 23-file checksum manifest were independently revalidated.
keyFindings:
  - The configured equilibrium branch folds at coolant values -5.06568 and -2.93432, creating a three-equilibrium interval.
  - Warming and cooling follow different stable branches; recovery time increases as the ignition fold is approached.
limitations:
  - The model is dimensionless and synthetic rather than an industrial reactor calibration.
  - Transport delay, mixing imperfection, multiple reactions, actuator limits, and parameter uncertainty are omitted.
redirectFrom: []
---

## Editorial overview

Read [When One Reactor Has Three Temperatures](/writing/when-one-reactor-has-three-temperatures/) for the model derivation, stability geometry, verified hysteresis experiment, basin interpretation, critical-slowing diagnostic, and five approved figures.

The calculations and executable research materials remain in the private ScienceProject workspace. This page presents only the reviewed public interpretation and approved visual evidence.
