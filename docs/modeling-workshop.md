# Modeling Workshop implementation and review

The workshop adds six complete bilingual learning units and a course/source map at `/teaching/modeling-workshop/` and `/zh/teaching/modeling-workshop/`. Existing Notes and laboratory URLs are retained. Entry points appear on the teaching, lecture library and model laboratory pages.

## Local review

```powershell
npm run build
node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1 --port 4322
```

Open `http://localhost:4322/zh/teaching/modeling-workshop/`. The build includes workshop manifest verification, state/export and search tests, Astro checks, Pagefind, internal-link and private-path/output scans, and existing site regressions. The existing Pages workflow deploys pushes to `master` after a successful build.

## Editing and ownership

- `src/data/workshop-lessons.ts`: original bilingual lessons, eight tasks per lesson, three-tier hints, assumptions, comparisons, failure experiments, research extensions, verified book citations and Notes connections.
- `src/types/workshop.ts`: common `WorkshopLesson` and `LearnerProgress` interfaces.
- `src/components/Workshop*.astro`, `src/styles/workshop.css`: landing page, source map, workbench, mobile task/code/result panels and side-by-side baseline comparison.
- `src/scripts/workshop-client.ts`: UI, lazy CodeMirror 6, execution, local progress and downloads.
- `src/lib/workshop-state.mjs`: validated JSON import, version staleness, IndexedDB/session fallback, notebook/Python/report serialization.
- `public/resources/modeling-workshop/worker.mjs`: lazy module worker with pinned Pyodide runtime. A fresh namespace is used for each run; stopping terminates the worker.
- `scripts/sync-workshop.mjs`: validates hashes and a strict public allowlist before copying assets. `SCIENCEPROJECT_DIR` may select a sibling checkout; an absent release falls back to the public snapshot.
- Scientific code and generated artifacts originate in the independent `ScienceProject/modeling-workshop` project. Do not edit the snapshot's generated core, exercises or notebooks by hand.

The six core lesson slugs are stable. Advanced branches are explicitly reading roadmaps, not completed interactive units. All data are synthetic and carry this label.

## Learner data

Database: `kenneth-modeling-workshop`, store: `progress`, key: shared bilingual lesson ID. Records include the lesson version, step, self-marks, original answers, model card, code, parameters, seed, prediction, reflection and last completed run with its submitted code/settings. No account, analytics, cloud sync or automatic execution on import is added.

The model card and step responses support an assumption ledger and claim–evidence table. Text is assessed through a rubric; automated checks target numerical properties. Drafts persist between languages on the same origin. Ports, browsers and devices have distinct storage. A blocked store keeps session memory and offers JSON export. Updating a lesson retains text and marks checks stale. JSON import validates schema and lesson, downloads a backup before replacement, and requires a rerun to verify imported results.

Exports: `.ipynb`, `.py`, JSON, CSV, PNG and Markdown report. Reference plots are labeled precomputed; learner results carry their own parameters, code and seed. Stale runs remain in JSON/reports but cannot be exported as current CSV results.

## Runtime references

- [Pyodide worker usage](https://pyodide.org/en/stable/usage/webworker.html)
- [Worker termination](https://developer.mozilla.org/en-US/docs/Web/API/Worker/terminate)
- [CodeMirror reference](https://codemirror.net/docs/ref/)

Python loads only after pressing Start Python. Startup can take longer than an experiment and has a separate 120-second limit. Execution has a 30-second limit. Termination retains the code; the learner explicitly restarts Python. Reading and reference downloads remain available after a runtime failure.

See `modeling-workshop-acceptance.md` for the recorded acceptance results and boundaries.
