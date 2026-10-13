# Mathematics classroom release — 13 October 2026

The classroom release repairs browser-local concurrent writes and adds the original bilingual Year 8 angle-bisector inquiry. Its direct entry is `/math-studio/#g8/bisector-property`; English can be selected with `?lang=en`. The activity develops perpendicular distance, measurements, an AAS proof, the interior-point HL converse, and an exit task in 18 minutes. Student and teacher A4 editions are separate.

## Local acceptance

An isolated copy of the intended source passed the complete site build, including mathematical/content checks, Astro validation, static routes, bilingual links, search indexing and output validation. The final Senior/JAE browser harness passed all 14 cases with zero page errors, including native trusted two-tab events and retained assessment history. The classroom harness passed all six cases with zero page errors: observation/proof, mobile/keyboard, bilingual two-tab compatibility, denied-storage immediate export, legacy Year 7 two-tab updates, and actual A4 printing.

The independent PDF audits passed 26 Senior/JAE checks and 24 classroom checks. Year 8 Chinese student/teacher worksheets each have two A4 pages; the English student has two and teacher has three. Evidence is generated under `.tmp/` and excluded from publication. Test records are synthetic.

Legacy keys and activity/question IDs remain. Opening a page does not rewrite all records. No Web Locks or unavailable storage means session/recovery work plus export, without unlocked canonical writes. Older unrefreshed clients can be detected as uncoordinated writers; both versions are retained for explicit recovery. See [storage behavior](math-storage-sync.md).

The connected browser did not expose the user's previously used profile. No actual private learning records were inspected or collected. Compatibility with populated legacy records and with a fresh empty browser was tested in disposable contexts; this is not verification of a particular person's historic data.

## Publication acceptance

The merged latest-reader checkout passed the full build and all browser/PDF checks. Classroom release commit `472bb135620d3937306136d51145ce3a513e5dc0` was published successfully by [Pages run 38391224671](https://github.com/skcKenneth/skcKenneth.github.io/actions/runs/38391224671). Ordinary live in-app browser interaction confirmed the Year 8 route and changing OP from 4 to 6 updates both perpendicular distances to approximately 3. The full system is a separate following release. Live route/asset hash evidence is retained outside Git under `.tmp/senior-math-v2/`.
