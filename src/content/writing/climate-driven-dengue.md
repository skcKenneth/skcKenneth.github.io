---
title: Reading a Spatial Dengue Experiment Carefully
slug: climate-driven-dengue
summary: A guide to what a synthetic reaction–diffusion experiment can—and cannot—show about climate-sensitive transmission.
date: 2025-12-26
lastUpdated: 2026-07-13
featured: true
topics: [differential equations, epidemiology, numerical methods]
type: Research Notes
archived: false
technicalUrl: https://github.com/skcKenneth/ScienceProject/tree/main/dengue_climate_model
scienceProject: climate-driven-dengue
technicalRepository: https://github.com/skcKenneth/ScienceProject/tree/main/dengue_climate_model
notebookUrl: https://github.com/skcKenneth/ScienceProject/tree/main/dengue_climate_model
codeUrl: https://github.com/skcKenneth/ScienceProject/blob/main/dengue_climate_model/main.py
reproductionUrl: https://github.com/skcKenneth/ScienceProject/blob/main/dengue_climate_model/README.md#experiment-matrix-synthetic
redirectFrom: [/posts/2025/12/dengue-climate-reaction-diffusion/]
---

The project couples temperature-dependent mosquito dynamics to a spatial reaction–diffusion model. Its experiment matrix is synthetic: it supports comparisons under controlled assumptions, not a forecast for Macau or another specific city.

## A small mathematical core

A spatial compartment can be written schematically as

$$
\frac{\partial I}{\partial t}=D_I\nabla^2 I + \mathcal{T}(S,I,V,T)-\gamma I,
$$

where diffusion represents local movement and $\mathcal{T}$ collects transmission terms that depend on hosts, vectors, and temperature. Long-range dispersal adds a nonlocal process.

## How to read the output

The useful question is whether a comparison remains stable when resolution, step size, or uncertain parameters change. The repository therefore includes numerical verification, tests, and sensitivity runs. These establish implementation confidence; empirical calibration is a separate task.

```python
# Reproduce the documented synthetic matrix inside the project environment
python run_experiment_matrix.py --tfinal 365 --grid 30 --dt 0.2 --save 30
```
