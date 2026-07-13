---
title: Climate-Driven Dengue on a Spatial Grid
slug: climate-driven-dengue
summary: A reaction–diffusion experiment combines temperature-dependent mosquito ecology, long-range dispersal, vaccination allocation, and numerical checks.
year: 2025
lastUpdated: 2026-01-30
status: Reproducible study
featured: true
topics: [Environmental Modeling, Reliability and Uncertainty]
methods: [Reaction–diffusion equations, Sensitivity analysis, Numerical verification]
researchQuestion: How do climate forcing and allocation assumptions change simulated dengue incidence?
dataType: Synthetic spatial experiment matrix
codeAvailable: true
dataAvailable: true
studentSuitable: true
heroImage: /science/climate-driven-dengue/incidence-matrix.png
technicalUrl: https://github.com/skcKenneth/ScienceProject/tree/main/dengue_climate_model
repositoryUrl: https://github.com/skcKenneth/ScienceProject/tree/main/dengue_climate_model
period: 2025–2026
validation: The repository contains numerical verification and a test suite in addition to scenario runs.
keyFindings:
  - Spatial forcing can produce heterogeneous simulated incidence fields.
  - Allocation strategies can be compared under shared synthetic assumptions.
limitations:
  - The published experiment matrix is synthetic.
  - Outputs are scenario comparisons, not forecasts for a specific city.
  - Biological parameters require empirical calibration before applied use.
redirectFrom: [/posts/2025/12/dengue-climate-reaction-diffusion/]
---

## Overview

The model couples host and vector dynamics to diffusion, long-range movement, and temperature-dependent mosquito ecology. Its value is as a controlled computational laboratory: assumptions can be changed and numerical behavior checked without presenting the result as a city forecast.

## Validation

The project includes a numerical verification entry point and automated tests. Those checks address implementation and numerical consistency; they do not substitute for epidemiological calibration or external predictive validation.

## Reproduction

The documented experiment matrix is generated with `python run_experiment_matrix.py --tfinal 365 --grid 30 --dt 0.2 --save 30 --forcing default` inside the project environment.
