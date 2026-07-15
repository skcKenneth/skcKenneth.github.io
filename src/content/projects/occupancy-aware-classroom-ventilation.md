---
title: Occupancy-Aware Classroom Ventilation
slug: occupancy-aware-classroom-ventilation
summary: A shared-capacity predictive-control benchmark for classroom CO₂ exposure when actual room use departs from the timetable.
year: 2026
lastUpdated: 2026-07-15
status: Exploratory study
featured: true
topics: [Environmental Modeling, Mathematical Modeling Education]
methods: [Multi-zone CO₂ mass balance, Model predictive control, Matched Monte Carlo evaluation]
researchQuestion: Can short-horizon airflow allocation reduce occupied CO₂ exposure when room use and shared ventilation capacity depart from the timetable, and what energy cost accompanies an occupancy buffer?
dataType: Synthetic three-classroom timetable, occupancy perturbations, and well-mixed CO₂ trajectories
codeAvailable: true
dataAvailable: true
studentSuitable: true
heroImage: /science/occupancy-aware-classroom-ventilation/benchmark-exposure-and-energy.svg
technicalUrl: https://github.com/skcKenneth/ScienceProject/blob/main/occupancy-aware-classroom-ventilation/paper/technical-study.md
repositoryUrl: https://github.com/skcKenneth/ScienceProject/tree/main/occupancy-aware-classroom-ventilation
period: 2026
validation: Four controllers are evaluated on 120 matched synthetic days per condition; buffered-versus-schedule MPC differences use paired bootstrap intervals.
keyFindings:
  - Under an unannounced room change plus shared-capacity derating, mean person-weighted exposure above the 1000 ppm study line was 74.5% for fixed schedule, 68.7% for reactive CO₂, 43.4% for schedule MPC, and 42.0% for buffered MPC.
  - Relative to schedule MPC, the five-student buffer changed exposure by -1.45 percentage points while increasing the fan-energy proxy by 0.93 kWh/day.
  - Buffered MPC slightly increased the unweighted whole-day peak, showing that lower occupied exposure does not guarantee a lower worst-room maximum.
limitations:
  - The rooms are well-mixed synthetic zones rather than calibrated classrooms or a commissioned air-handling system.
  - The 1000 ppm line is a benchmark control target and not a universal health, safety, or compliance threshold.
  - Fan energy and ventilation thermal load are proxies; aerosols, filtration, infection risk, and health outcomes are not modelled.
redirectFrom: []
---

## Overview

This study treats ventilation as a shared allocation problem. Three classrooms draw from one limited command budget. Their published timetable is useful but imperfect: attendance varies, one group can change rooms without notice, and available fan capacity can fall during the school day.

Four controllers receive the same synthetic trajectories. A fixed schedule and a reactive CO₂ rule provide simple baselines. Schedule MPC looks 30 minutes ahead using the timetable. Buffered MPC adds five students to each forecast active room before choosing a feasible command.

## Model, data, and assumptions

Each 180 m³ room follows a well-mixed CO₂ mass balance at five-minute resolution. Actual occupancy is generated from nine scheduled class blocks with attendance variation. Stress conditions introduce an unannounced transfer of 10–16 people and a three-hour shared-capacity derating.

The benchmark uses 1000 ppm as a control target so strategies can be compared consistently. It is not presented as a direct health or safety boundary. The model omits airflow geometry, door opening, filtration, aerosols, equipment commissioning, and local ventilation-code requirements.

## Validation and findings

Each controller-condition pair contains 120 replicates. Physical seeds are matched across controllers, so paired differences isolate the control rule rather than a different random day. Means use bootstrap 95% intervals, and buffered-versus-schedule MPC uses a paired bootstrap.

The predictive methods use more fan command and reduce occupied exposure in this generator. The extra occupancy buffer produces a further but small reduction, while increasing fan energy and slightly worsening the unweighted whole-day peak. The result is a trade-off, not a universal controller ranking.

## Reproduction and next evidence

The technical repository contains configuration, source, unit tests, every trial result, aggregate and paired tables, a claim-evidence map, source ledger, approved SVG figures, and a long-form technical study. A credible next step would calibrate the mass balance and fan law against instrumented classrooms, then replay independently recorded timetable deviations without retuning the controller on the test building.

