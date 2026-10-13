# Mathematics learning system — 13 October 2026

The bilingual entry points are `/zh/teaching/math/` and `/teaching/math/`. An activity deep link uses `?activity=<registered-id>`; the Year 8 class is `school:inquiry:angle-bisector`. Catalog counts are generated from `createMathCatalog`, including the latest classroom packs when present.

The catalog loads the existing mathematical engines inside the common activity workspace. Previously opened activities remain mounted so session-only drafts survive activity changes. School lessons, Senior/JAE, three Inquiry Labs, Python workshops and fourteen models use the same navigation, classroom sequence, optional reasoning notebook, backup and print entry points. Original routes and native storage keys remain usable. Original source PDFs retain source links.

## Records and compatibility

All cooperating localStorage adapters and workshop IndexedDB writes use `math-learning:writer:v1`. Writers reread current data inside that same-origin lock. Classroom lists use add/remove/move operations. Conflicting fields retain both versions; assessment history appends event IDs and attempts accumulate deltas. Missing locks or denied storage retain session work and exports without unlocked canonical writes. Recovery copies are per tab. Unrefreshed old code cannot be made safe by a new lock; an uncoordinated write is retained and reported for explicit recovery.

The unified JSON envelope retains native raw stores, workshop drafts, pending edits, session-only notebooks and unresolved conflicts. Import previews do not write. Before applying, the browser downloads a pre-import backup; optimistic byte comparisons prevent restoring over a newer preview. Secondary-store rollback restores previous workshop rows and removes newly imported rows only if they are still owned by the failed transaction. Corrupt bytes and unknown activity/question IDs remain recoverable. Legacy Senior v1/v2, Lab JSON and workshop drafts are accepted. Importing a session-only Lab export requires explicit consent before native persistence.

My Learning separates answer checks, written self-assessments, assessment history, practice exposure, inquiry notebooks, workshop drafts and saved model runs. Counts describe records, not attainment. A previous model run can become stale after code, parameters or version change. Original practice scratch answers remain session work; they are not promoted into assessment history.

Lab text and the common notebook require an explicit save choice. Language is local to the current page. Bilingual rendering preserves student-authored text verbatim; it translates authored prompts, controls, diagrams, hints, explanations, exports and teacher instructions. Numerical engines and conditions are independently checked, including degeneracies, perpendicular feet, finite simulation limitations and the distinction between leverage and influence.

## Acceptance and publication

Classroom release `472bb135620d3937306136d51145ce3a513e5dc0` is published: [Pages run](https://github.com/skcKenneth/skcKenneth.github.io/actions/runs/38391224671). Its 1,754 Senior/JAE routes, 40 bundled assets and 23 classroom static files matched live bytes after correcting local Windows line endings to the committed Linux checkout bytes. Ordinary live browser operation confirmed the angle-bisector model and AAS proof.

The integration release adds source tests for catalog, backup, workshop field merges, model localization, all selectable school question families, all school lessons/inquiries and the three Lab numerical engines. Separate disposable Edge harnesses exercise native two-tab events, lock waits, conflict resolution, imports and rollback, English dynamic text, actual downloads, mobile layout and actual A4 PDFs. Reports and synthetic records stay under ignored `.tmp/`; private learner data is never committed. Source/dev checks are interim evidence. Final merged build, frozen browser acceptance, Actions and live-byte checks are required before recording integration deployment as complete.

The connected browser did not expose the user's previous browser profile. Empty state and populated synthetic old formats are tested. No claim is made that a particular person's historical browser data has been inspected, recovered or migrated.
