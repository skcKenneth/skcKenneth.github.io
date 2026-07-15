---
title: "Case Clinic: Ventilation Under a Wrong Timetable"
slug: ventilation-case-clinic
summary: A worked teaching case for mass balance, predictive control, competing metrics, and the difference between a study target and a health claim.
lastUpdated: 2026-07-15
featured: true
topics: [mass balance, control, uncertainty, evidence critique]
level: Advanced
resourceType: Worked example
---

This case turns the public classroom-ventilation study into a sequence of modelling and critique tasks. Students do not need access to the private source repository: the article, equations, approved figures, and reported result tables contain enough evidence for a structured analysis.

## Driving question

Three classrooms share limited outdoor-air capacity. The timetable predicts occupancy, but one class may move without notice and total fan capacity may fall during the day. How should airflow be allocated, and which metric should define a good decision?

## Mathematical ideas

- discrete-time mass balance;
- units and concentration change;
- shared inequality constraints;
- reactive versus predictive control;
- person-weighted and worst-case metrics;
- paired experimental comparison;
- sensitivity and diminishing returns.

## Lesson sequence

### 1. Read the system before the result

Students inspect the shared-airflow diagram in [the public research note](/writing/when-the-timetable-lies/) and identify state variables, control variables, disturbances, constraints, and outputs. They write the system boundary without quoting the reported conclusion.

### 2. Check one mass-balance step

Using a supplied room volume, outdoor concentration, occupancy, and airflow command, students calculate the direction and approximate size of the next concentration change. The purpose is to connect code-scale output to units and conservation.

### 3. Compare controller information

Students build an information table:

| Controller | Uses timetable? | Uses measured CO₂? | Looks ahead? | Handles wrong timetable directly? |
|---|---:|---:|---:|---:|
| Fixed schedule | yes | no | no | no |
| Reactive CO₂ | no | yes | no | after concentration rises |
| Schedule MPC | yes | yes | yes | indirectly |
| Buffered MPC | yes | yes | yes | through a fixed margin |

They predict which controller will use more fan command and which will respond fastest to an unannounced move.

### 4. Interpret two conflicting metrics

The predictive controllers reduce person-weighted occupied exposure in the reported synthetic benchmark, yet their unweighted whole-day peak is higher. Students explain how a shared-capacity objective can improve one metric while worsening another.

### 5. Challenge the 1000 ppm line

Students classify possible statements as supported, unsupported, or requiring more evidence. In particular, they distinguish a consistent experimental target from a universal health or safety threshold.

### 6. Design the next experiment

Groups propose one field-calibration step and one independent evaluation step. A strong answer identifies what would be measured, which parameters would be estimated, what must remain held out, and which success metric would be declared in advance.

## Evidence artefacts

Students submit:

1. a system-boundary diagram;
2. one checked mass-balance calculation;
3. the controller information table;
4. a two-metric interpretation paragraph;
5. a claim-classification table;
6. a one-page next-experiment protocol.

## Assessment focus

The case rewards unit consistency, causal reasoning about controller information, recognition of metric conflict, and disciplined claim boundaries. It does not reward treating the reported controller as a complete building solution.

## Extension

An advanced group can replace the fixed five-student buffer with an uncertainty distribution and formulate a chance constraint. The extension should state what probability is being controlled and how it would be calibrated from independent occupancy records.
