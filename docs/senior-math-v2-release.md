# Senior Mathematics Studio: second-round release

## Delivered scope

The original 73 textbook-section entries, 14 supplements, 18 chapter reviews, six school routes, twelve official papers, existing question URLs, and `jae-math-v1` storage key remain available. Twenty-four independently navigable bilingual skills add 312 teaching/practice positions and 48 diagnostic questions. These are 360 unique original records; none is counted again as a new question when reused by a diagnostic, learning route, classroom list, or question-bank view. The combined bank contains 2,074 records.

Each new skill has three examples, ten practices (four foundation, four standard, two transfer), two diagnostic choices, at least six practice-task families, layered hints, worked reasoning, concept derivations and conditions, counterexamples, a dedicated interactive model with numerical tables, and a 40-minute teacher pack. Teacher packs include the 5/8/10/12/5-minute sequence, expected correct and incorrect responses, follow-up prompts, remediation, board development, exit questions, and assessment examples.

## Content review and provenance

- [Quadratics and trigonometry author checks](senior-math-quadratics-trig-skills.md) and [independent peer review](skills-quadratics-trig-peer-review.md).
- [Vectors and conics author checks](senior-math-skills-vectors-conics-audit.md) and [independent peer review](skills-vectors-conics-peer-review.md).
- [Calculus and statistics author checks](skills-calculus-statistics.md) and [independent peer review](skills-calculus-statistics-peer-review.md).
- [Official-paper context audit](senior-math-paper-context-audit.md): all 287 leaves compared against the twelve original papers; 19 original context supplements applied to 37 leaves, plus earlier statements from the same top-level question. Context contains givens and requested targets, never answers or worked steps. The source cube diagram is restated with an original incidence sketch.

Pure clarification retains the original ID and answer: this includes the missing probability threshold `t`. Rotational-volume items are explicitly extensions; calculus prerequisite links are corrected. Old generated item difficulty remains provisional, and official papers remain ungraded. These labels do not estimate learner ability. Every original lesson has an inquiry audit; unsuitable generic models are replaced by comparisons of its actual tasks. New skills use dedicated models. Native models state their limited scope.

## Learning and classroom behavior

The site separates independently correct, correct after hints, earlier correct with unknown hint use, written self-assessment, and pending fresh review. Editing or clearing a written response invalidates its current self-assessment while preserving earlier evidence. Correction categories link to targeted task families; three-day and seven-day retries appear inside the site.

Latest answers stay under `jae-math-v1`. Auxiliary history, correction categories, retries, hint evidence, self-assessment snapshots, and the classroom list use `senior-math-study-v2`. History retains at most five assessments per question and at most 1 MiB globally. Trimming history does not remove latest drafts or ever-wrong flags. Text writes coalesce for 250 ms; checks, navigation, export and printing flush immediately. Cross-tab updates merge changed answer fields and changed learning fields, hydrate visible controls, and preserve unsaved session work after failed writes. Corrupt stored bytes are not overwritten.

Backups contain both stores. Import accepts v1 or v2, rejects malformed containers, previews differences, downloads the pre-import backup, retains local conflicts by default, supports individual overwrite choices, and retains unknown question IDs. A failed second-key import attempts to restore both original byte strings and reports failure. Classroom share links contain only up to 30 question IDs, list title, and classroom mode; they contain no answers or notes. Only selected question pages are loaded for classroom teaching and printing.

The arithmetic input parser accepts bounded finite numbers, fractions, pi, square roots and basic operations without evaluating JavaScript. Proofs, drawings and modeling remain self- or teacher-assessed.

## Verification

`pnpm run test:senior-math` runs the existing mathematical/content/runtime gates together with the new author and peer audits, strict decoded-TeX checks, history and backup checks, and regressions against bundled actual client code. `pnpm run build` additionally runs the complete site checks, Astro validation, static build, bilingual route/link checks, search indexing, and built-site checks.

The static bank has 42 pages per language, at most 50 records per page, and readable links and explanations without JavaScript. The built first-page size is checked against the requested 150 KB ceiling. All new routes have reciprocal language links, and search/filter state is encoded in the URL.

Browser and A4-print evidence is recorded in the [browser QA report](senior-math-browser-qa.md). Local validation, browser results and production verification are distinct evidence stages; a successful local build alone is not a deployment claim.

After the Pages workflow succeeds, `node scripts/senior-math-live-check.mjs` checks every non-question course route, every new skill and diagnostic question, every official-paper leaf, both legacy JAE entries, both question-bank indexes, and all built JavaScript/CSS assets against local SHA-256 hashes. It also checks the release marker on all senior-math pages. The detailed production result is written to `.tmp/senior-math-v2/live-verification.json`; it is generated after deployment, not assumed by the source tests.

## Maintained limits

The 13 October classroom revision supersedes earlier multi-tab status. Its final local build and all 13 isolated browser cases passed with zero page errors; the native two-tab case retains assessment history. All 26 actual A4 PDF checks passed. The shared coordinator serializes writes and retains conflicts and recovery snapshots. See [classroom evidence and the actual-record boundary](math-classroom-release-20261013.md). Local acceptance remains distinct from production verification.

There are no accounts, cloud classes, automatic proof marking, timed mock examinations or external reminders. This release does not turn classroom observations into a validated learning-outcome measure. Original textbooks and school PDFs remain preparation sources; public lessons and exercises are original explanations with source alignment. The remaining curriculum retains its first-round depth.
