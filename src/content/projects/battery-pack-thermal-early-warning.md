---
title: Graph-Calibrated Battery Thermal Early Warning
slug: battery-pack-thermal-early-warning
summary: A calibrated graph-CUSUM benchmark for warning of local battery-pack thermal faults when a temperature sensor drifts or becomes unavailable.
year: 2026
lastUpdated: 2026-07-13
status: Manuscript in preparation
featured: true
topics: [Reliability and Uncertainty, Battery Safety Monitoring]
methods: [Coupled thermal-network proxy, Graph-CUSUM change detection, Held-out threshold calibration]
researchQuestion: Can common-mode removal and graph-neighbour pooling improve warning before a synthetic battery-pack temperature boundary while keeping false alarms near a held-out calibration target?
dataType: Synthetic 4 x 4 coupled thermal network with generated drift, dropout, and local-fault trajectories
codeAvailable: true
dataAvailable: true
studentSuitable: false
heroImage: /science/battery-pack-thermal-early-warning/benchmark-performance.svg
technicalUrl: https://github.com/skcKenneth/ScienceProject/blob/main/battery-pack-thermal-early-warning/paper/ieee-conference-draft.md
repositoryUrl: https://github.com/skcKenneth/ScienceProject/tree/main/battery-pack-thermal-early-warning
period: 2026
validation: Four detectors use the same 220 healthy calibration trajectories and disjoint sets of 160 healthy plus 160 fault trajectories in each drift/dropout condition.
keyFindings:
  - Under combined 0.010 °C/s sensor drift and one-sensor dropout, graph-CUSUM detected 94.4% of faults before the simulation boundary versus 90.0% for independent CUSUM.
  - Combined-stress false-alarm rates were 6.25% for graph-CUSUM and 5.0% for independent CUSUM; their 95% intervals overlap.
  - A nominally calibrated maximum-temperature threshold reached 95.0% false alarms on healthy combined-stress trajectories, exposing sensitivity to positive sensor bias in this benchmark.
limitations:
  - The coupled thermal network is a controlled proxy rather than a chemistry-specific electrochemical or abuse-test model.
  - The 60 °C endpoint is a study boundary, not a universal thermal-runaway or safety threshold.
  - No instrumented module, production sensor history, cooling controller, or deployed battery-management system is evaluated.
redirectFrom: []
---

## Overview

This study treats a battery module as a graph: each cell exchanges heat with its physical neighbours, and each temperature channel supplies a time-varying signal on that graph. The proposed detector removes pack-wide motion, pools positive residual evidence over adjacent cells, and accumulates that evidence sequentially.

## Why the problem matters

A warning rule should not be judged by fault detection alone. A detector that alarms on nearly every healthy trajectory can appear sensitive while being operationally useless. Temperature-sensor bias creates exactly this risk: a positive drift can eventually cross a fixed threshold even when the underlying cell temperature remains normal.

## Model, data, and assumptions

The benchmark simulates 16 thermally coupled cells for 240 seconds. Baseline load, ambient temperature, cell variation, process noise, and measurement noise are explicit. Fault heat grows locally after 90 seconds. Stress conditions add a positive linear sensor drift, one missing channel, or both.

The 60 °C endpoint is used only to ask whether an alarm was timely. It does not stand for a universal runaway temperature. Important mechanisms—including electrochemistry, venting, gas release, state of charge, ageing, cooling control, and propagation reactions—are outside the proxy.

## Validation and findings

All four main detectors use identical calibration data. Evaluation seeds are disjoint from calibration and shared across methods within each condition. Proportion metrics use Wilson 95% intervals; median warning lead uses bootstrap intervals. The proposed graph-CUSUM shows a modest combined-stress detection advantage over independent CUSUM, but not a statistically decisive universal improvement.

The maximum-temperature baseline is a useful failure case: positive measurement drift drives its healthy false-alarm rate to 95% under combined stress. That observation concerns this nominally calibrated rule, not every temperature-based battery-management strategy.

## Reproduction and next evidence

The technical repository contains configuration, source, unit tests, complete CSV results, thresholds, approved SVG figures, a claim-evidence map, a source ledger, and a conference-oriented draft. The next high-information step is external replay on instrumented module data with independently recorded fault timing and sensor calibration histories.
