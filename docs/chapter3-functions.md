# 第三章・函數 / Chapter 3 · Functions

This chapter accompanies the fourteen existing Senior 1 arts-stream paper worksheets. The paper worksheets remain the individual learning record; the website provides a bilingual teacher projection, inquiry prompts, worked examples, and printable inquiry records. Original Word documents are not uploaded or rewritten.

The entry point is `/zh/teaching/senior-math/function-worksheets/` in Traditional Chinese and `/teaching/senior-math/function-worksheets/` in English. Each language has fourteen lesson pages, numbered `01/` to `14/`. The public chapter title is **第三章・函數 / Chapter 3 · Functions**; the subtitle is **從對應與圖像，走向有根據的選擇 / From mappings and graphs to justified choices**. Worksheet numbers and filenames are teacher cross-references, not the activity titles.

## A forty-minute lesson

| Minutes | Teacher projection | Student paper work |
| --- | --- | --- |
| 0–5 | Present the context and prediction prompt. | Commit to a prediction before seeing a result. |
| 5–17 | Change one condition at a time; compare at least two cases. | Record the inputs, outputs, and evidence; explain to a partner. |
| 17–25 | Reveal hints and the mathematical explanation in stages. | Refine the conjecture and state the conditions under which it holds. |
| 25–37 | Connect the worked example to the original worksheet. | Complete the paper practice and transfer question. |
| 37–40 | Use the exit check with a new example. | State a conclusion and its justification. |

Hints, conclusions, worked solutions, and teacher references are initially hidden. Sampling can suggest a conjecture but does not replace an algebraic argument. Select the student print edition to distribute a record page; use the teacher edition for answers and anticipated misconceptions. Shared classroom notes describe the operator's lesson/preparation record; they are not individual student scores.

## Eight inquiry families

| Worksheets | Inquiry focus |
| --- | --- |
| 01–02 | Repair a mapping with the fewest arrow changes; compare a formula under different domains. |
| 03–04 | Combine restrictions on an input; retain excluded inputs after simplifying a fraction. |
| 05–06 | Compare discrete and continuous representations; diagnose gaps and conflicting boundary outputs. |
| 07, 13 | Exchange the order of two function machines; check whether the intermediate output is allowed. |
| 08–09 | Distinguish a bound from an attained extremum; test monotonicity claims and give a general argument. |
| 10 | Check domain symmetry before testing the odd/even identities; include the zero function. |
| 11–12 | Compare the five selected power functions, including the change across inputs 0 and 1. |
| 14 | Compare rental and printing options, including two equality points and a budget limit. |

## Integration and record compatibility

The unified mathematics catalog contains the overview activity `senior:function-worksheets` and lesson activities `senior:function-worksheet:01` through `:14`. All are Senior 1 (`g10`) native senior activities. Their native IDs begin `function-worksheet-` to avoid collisions with the existing lesson catalog. Existing classroom selection, projection, notes, and backup tools are reused; this chapter does not introduce storage keys or automatic scoring.

The routes use the existing `BaseLayout`, with the matching English/Traditional Chinese alternate path. The chapter manifest stores its own bilingual text and links back to the existing function lessons in compulsory volume 1, chapter 3 (`c1-3`). Only the original document filename is shown in the teacher reference; private drive paths are excluded from public output.

The site's named search catalog includes the chapter entrance and all fourteen native lesson URLs in both languages. It accepts chapter names with or without the middle dot, English or Chinese lesson titles, and the stable activity IDs. All fifteen entries are ordinary teaching results, with the topics `mathematical-thinking` and `teaching-research-practice`; their search records include titles and summaries only, without worked answers or document cross-references. The same topics are emitted as Pagefind metadata on every chapter route.

## Verification

Run these commands from the site checkout:

```powershell
node --test tests/function-worksheets.test.mjs tests/function-worksheet-models.test.mjs
node --test tests/math-system.test.mjs tests/math-shared-storage.test.mjs tests/senior-math-v2-peer-runtime.test.mjs
pnpm run build
node tests/function-worksheets.test.mjs --built
```

Content tests check all fourteen ordered lessons, eight scene families, bilingual teaching fields, two-stage hints, valid lesson cross-references, strictly rendered TeX, and the fifteen activity/search catalog entries. Search tests check bilingual aliases, everyday and topic-filter visibility, paired URLs, and deduplication with Pagefind results. Model tests cover mappings, interval restrictions, representation, composition, extrema, symmetry, powers, and the two decision scenarios. Built-page checks run only with `--built` or `FUNCTION_WORKSHEETS_BUILT=1`, after a fresh build, including the metadata and complete named catalog on both search pages.

Before release, inspect both languages in a real browser: projection size, keyboard operation, reset, staged reveals, the whole-class lesson selection, notes/backup, and student/teacher printing. Deployment is confirmed only after the relevant publishing workflow succeeds and the live bilingual pages and interactions are checked.
