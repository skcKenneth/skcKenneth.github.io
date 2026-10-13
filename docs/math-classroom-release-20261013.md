# Mathematics classroom release — 13 October 2026

The classroom release repairs browser-local concurrent writes and adds the original bilingual Year 8 angle-bisector inquiry. Its direct entry is `/math-studio/#g8/bisector-property`; English can be selected with `?lang=en`. The activity develops perpendicular distance, measurements, an AAS proof, the interior-point HL converse, and an exit task in 18 minutes. Student and teacher A4 editions are separate.

## Local acceptance

An isolated copy of the intended source passed the complete site build, including mathematical/content checks, Astro validation, static routes, bilingual links, search indexing and output validation. The final Senior/JAE browser harness passed all 13 cases with zero page errors, including native trusted two-tab events and retained assessment history. The classroom harness passed all six cases with zero page errors: observation/proof, mobile/keyboard, bilingual two-tab compatibility, denied-storage immediate export, legacy Year 7 two-tab updates, and actual A4 printing.

The independent PDF audits passed 26 Senior/JAE checks and 24 classroom checks. Year 8 Chinese student/teacher worksheets each have two A4 pages; the English student has two and teacher has three. Evidence is generated under `.tmp/` and excluded from publication. Test records are synthetic.

Legacy keys and activity/question IDs remain. Opening a page does not rewrite all records. No Web Locks or unavailable storage means session/recovery work plus export, without unlocked canonical writes. Older unrefreshed clients can be detected as uncoordinated writers; both versions are retained for explicit recovery. See [storage behavior](math-storage-sync.md).

The connected browser did not expose the user's previously used profile. No actual private learning records were inspected or collected. Compatibility with populated legacy records and with a fresh empty browser was tested in disposable contexts; this is not verification of a particular person's historic data.

## Publication boundary

The latest published reader and teaching updates must be retained during integration. Deployment acceptance requires the merged-source build, successful Pages workflow, live version/asset checks and ordinary live browser interaction. The source acceptance above alone is not a deployment claim. Full mathematics-system consolidation and remaining bilingual legacy materials belong to the next release.
