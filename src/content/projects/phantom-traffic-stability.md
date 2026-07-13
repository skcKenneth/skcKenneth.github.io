---
title: Phantom Traffic-Jam Stability
slug: phantom-traffic-stability
summary: Microscopic traffic experiments examine when small disturbances grow into persistent stop-and-go waves.
year: 2026
lastUpdated: 2026-01-10
status: Exploratory study
featured: true
topics: [Urban and Mobility Systems]
methods: [Microscopic simulation, IDM, Stability analysis]
researchQuestion: Under which modeled conditions do local speed disturbances become persistent stop-and-go waves?
dataType: Synthetic traffic simulation
codeAvailable: true
dataAvailable: true
studentSuitable: true
heroImage: /science/phantom-traffic-stability/traffic-heatmap.png
technicalUrl: https://github.com/skcKenneth/ScienceProject/tree/main/traffic-idm
repositoryUrl: https://github.com/skcKenneth/ScienceProject/tree/main/traffic-idm
validation: Results are checked through trajectory, heat-map, and fundamental-diagram diagnostics.
keyFindings: [The experiment demonstrates how local car-following rules can produce system-level waves.]
limitations: [The scenarios are synthetic., Driver and controller parameters do not establish performance on a real road network.]
redirectFrom: [/posts/2026/01/traffic-idm-mobil-stability/]
---

## Overview

This is a compact simulation study of an important modeling idea: congestion waves can emerge without a fixed obstruction. The repository provides trajectories, density-flow summaries, and a space-time heat map.

## Teaching connection

The project is suitable for advanced students because it links differential equations, numerical simulation, parameter experiments, and careful interpretation. It is deliberately labeled exploratory.
