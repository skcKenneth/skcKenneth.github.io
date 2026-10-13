# Independent v2 runtime review

## 2026-10-13 source revision — browser acceptance pending

The current source adds the dependency-free `/math-shared/storage.js` coordinator and the Senior/JAE adapter. A shared origin Web Lock serializes progress, evidence, classroom operations and imports. Draft patches retain their original field baseline; different fields merge, attempts increment and event IDs deduplicate. Same-field conflicts retain both versions and require a visible choice. Classroom additions, removals and moves operate against the fresh list instead of replacing a stale page snapshot.

Each edit checkpoints pending work under its own recovery key before waiting for a lock. Checkpoints contain affected records, rather than duplicating all history on every page. Immediate export and print use the current session snapshot. Older recoverable visits have an accessible download button; their snapshots can be previewed through the existing backup importer. Recovery is not a blind replay of counters. Without Web Locks, canonical legacy keys are read but not rewritten; recovery and session exports remain available. Storage denial still preserves in-memory work until export or page closure.

Per-key commit stamps distinguish coordinated writes across adapters from an older unrefreshed tab. An uncoordinated change pauses canonical writes and preserves competing versions. Web Locks cannot stop an older client that does not use the lock. Imports reread under the same writer lock, download a before-import backup, preserve unknown IDs, and attempt rollback only while the transaction still owns the written bytes. Denied rollback remains an explicit recovery limitation.

Validation against this source: **10 shared coordinator cases**, **19 actual-client peer cases**, and **61 cases in the combined focused source suite passed**. The fixture now loads the real coordinator and awaits its writer queue. Its second-document failure assertion checks rollback of partial progress plus retained session evidence. A shared classroom URL retains its temporary selection on incoming storage events, and only an explicit edit seeds selected IDs before applying the operation; unrelated remote additions survive. No full-site build or production deployment is claimed here.

The latest previously generated browser report failed `real-two-tab-storage-merge-and-invalidation`: answer/notes survived but assessment history was empty. That failure motivated the serialized writer and is not replaced by source tests. A fresh build and passing complete native-browser/PDF run are required before release acceptance. The historical review below describes the earlier implementation only.

## Historical review, 2026-10-08

Reviewed on 2026-10-08. This review reads the shared learning/numeric model and lesson, study, question-bank and workspace clients. It bundles the actual TypeScript clients with esbuild and exercises their event handlers against a small controlled DOM/storage fixture; it does not replace browser layout, accessibility, print-dialog or deployed-route QA.

Run the dedicated regression suite:

```powershell
node --test tests/senior-math-v2-peer-runtime.test.mjs
```

The regression cases cover malformed version-one stored records, undefined 0^0, clean and dirty multi-tab forms, quota failures, independent progress/evidence write failures, field-level draft and learning merges, retry clearing/history retention, print-induced hint events, denied/corrupt classroom persistence, attached download anchors, default-local backup conflicts, URL privacy, malformed backup rejection and rollback after a second-key import failure.

The actual two-tab browser test additionally exposed a first-record race: an absent baseline was treated as `{}`, so untouched default empty fields appeared dirty and could clear another tab's first answer. Dirty-field comparisons now use the same empty-record defaults as record creation. Two actual-client regressions cover first reasoning preserving another tab's answer and first answer preserving another tab's reasoning; all 18 runtime cases pass. The real-browser harness separately tests trusted storage events and retained assessment history.

The root owner fixed the following reproduced defects during this review:

- Version-one answer containers and invalid records were accepted as empty work and could be overwritten. Stored corruption is now preserved and reported; malformed backups are rejected before import.
- Storage events updated the model but left clean answer/notes controls stale. Clean forms now rehydrate before a fresh check or actual-record print. Dirty fields survive failed writes and are merged without overwriting unrelated edits from another tab.
- Inquiry and targeted-reading response textareas also remained stale after cross-tab model updates. Their existing read accessor now rehydrates them on progress events, without dirtying restored responses.
- A hint-only change could overwrite another tab's correction categories for the same question. Only changed learning fields are now merged, while historical evidence remains additive.
- Denied writes/reads and corrupt storage caused classroom selections to reload an older list and lose session additions. Multiple session selections now persist in memory, with explicit session-only feedback.
- Independent retry cleared the answer but left reasoning/correction fields. Both the model and form now clear, while the earlier work remains in attempt history.
- In classroom mode, independent retry closed the details but left the stage-three reveal button disabled. Retry now also resets the active toolbar to the first hint.
- Teacher print opened solutions and recorded that as stage-three hint use. Programmatic print/restoration toggles are excluded from learner evidence.
- Detached workspace download anchors were clicked before attachment. Download anchors now attach before clicking and are removed afterwards.
- The arithmetic parser accepted 0^0 as 1. Undefined zero powers now fail validation while valid powers and precedence remain intact.

At that review point, **18 focused regressions passed** against the repaired source. The four existing inquiry-storage tests also passed, including an explicit no-mutation response hydration check. The later native-browser evidence-loss failure supersedes the earlier closeout assessment.

Source review also verifies that classroom URLs contain only question IDs, a lesson title and the classroom mode. Answers, notes, corrections, history and inquiry responses are not included. Default imports retain local drafts and local settings, merge historical evidence, and overwrite only explicitly selected conflicts; a before-import JSON backup is downloaded first. Actual-record print uses the current model, including unsaved session work after a quota failure.

Compatibility boundaries remain explicit: existing `jae-math-v1` data and stable question IDs are retained; `senior-math-study-v2` supplies additive evidence. Written work remains self-assessment. Same-field simultaneous edits require a last-writer choice; localStorage is not a transactional cross-device service. If both an import write and its rollback are denied, automatic atomic recovery cannot be guaranteed, so the original downloaded backup remains the recovery path. Browser-local denied-storage work survives only in the active session until exported. No native browser, network deployment or general concurrent-writer guarantee is claimed by these controlled tests.
