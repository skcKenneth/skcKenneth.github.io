---
title: Instructor Resources and Assessment
slug: instructor-resources
summary: Planning notes for case selection, formative critique, assessment rubrics, and reproducibility review.
lastUpdated: 2026-07-15
featured: true
topics: [assessment, mentoring, curriculum]
level: Instructor
resourceType: Instructor resource
---

These resources support the design and review of open-ended mathematical-modeling work. The central assessment question is not “Did the student obtain the expected answer?” but “Can the student make the chain from question to evidence inspectable?”

## Planning a case

A strong case has:

- a decision or explanation that mathematics can inform;
- enough ambiguity to require modelling choices;
- quantities that can be estimated or sourced;
- a baseline accessible to the intended learners;
- at least one meaningful validation route;
- room for extension without requiring hidden specialist knowledge.

Before release, prepare a case map with the likely system boundary, essential quantities, two plausible baselines, common misconceptions, and evidence that would count against the expected conclusion.

## Formative critique protocol

Short reviews can be organised around four prompts:

1. **Point:** What is the current claim?
2. **Trace:** Which assumption, equation, and output support it?
3. **Challenge:** What alternative explanation or failure case should be tested?
4. **Revise:** What is the smallest next change that would improve the evidence?

This keeps feedback focused on reasoning rather than turning the instructor into a debugger for every line of code.

## Example analytic rubric

The following weighting is a starting point and should be adapted to the case:

| Criterion | Weight | Evidence sought |
|---|---:|---|
| Problem formulation | 15% | focused question, decision context, system boundary |
| Variables and assumptions | 15% | units, provenance, justified simplifications |
| Model and baseline | 20% | coherent mathematics and a meaningful reference case |
| Computation | 15% | reproducible implementation and numerical checks |
| Validation and uncertainty | 20% | sensitivity, comparison, failure analysis, limitations |
| Interpretation and communication | 15% | claim-evidence alignment, readable figures, bounded conclusion |

A well-supported negative or inconclusive result can score highly. Conversely, a visually impressive result should not compensate for missing units, leakage, or an untested assumption.

## Reproducibility review

An instructor or peer reviewer should be able to answer:

- What command or notebook order reproduces the primary result?
- Are source data and generated data distinguished?
- Are random settings and software requirements recorded?
- Does the report quote values that exist in a saved result table?
- Can a figure be regenerated without editing it manually?
- Are private calculations kept separate from the approved public artefacts?

## Feedback across a project

Feedback is most useful when distributed across decision points:

- **framing review** before major computation;
- **baseline review** before advanced methods;
- **evidence review** before report polishing;
- **claim review** before publication or presentation.

This sequence rewards revision and prevents a polished document from hiding a weak research design.

## Public companion

[From Open Question to Reproducible Model](/writing/modeling-workflow/) can be assigned as a common workflow reference. The project and writing archives provide cases for critique, but private technical records remain separate from the public teaching layer.
