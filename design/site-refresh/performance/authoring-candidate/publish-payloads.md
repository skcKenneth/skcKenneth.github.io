# Local built working-tree publication payload audit

Source HEAD (base revision): `9446e5330f594f021677490ba2675c7c28c706ac`
Source state: working-tree
Captured: 2026-10-11T07:52:33.818Z

Offline reads of frozen built dist; publisher marker/language/canonical/counterpart/search-kind/RSS/format validation. MIME type is supplied from the file extension and successful local reads use the validator status200 input. No HTTP requests, live status/header checks, deployment claims or browser/accessibility assertions. PNG/SVG bytes are also compared with immutable source HEAD public assets.

89/90 payloads passed; 14 PNG/SVG commit-byte checks.

| Route | Type | Result | Bytes |
|---|---|---|---:|
| / | home | pass | 18648 |
| /zh/ | home | pass | 18555 |
| /writing/ | writing | pass | 158904 |
| /zh/writing/ | writing | pass | 143148 |
| /topics/ | topics | pass | 17070 |
| /zh/topics/ | topics | pass | 16691 |
| /teaching/ | teaching | pass | 27487 |
| /zh/teaching/ | teaching | pass | 26316 |
| /search/ | search | pass | 196560 |
| /zh/search/ | search | pass | 188107 |
| /rss.xml | rss | pass | 33518 |
| /zh/rss.xml | rss | pass | 33008 |
| /images/og-reader.png | png | pass | 44643 |
| /images/kenneth-woven-knot.svg | svg | Asset SHA-256 differs from the deployed commit | 8348 |
| /writing/archive/ | alias | pass | 2418 |
| /research/ | alias | pass | 2454 |
| /teaching/jae-math/ | alias | pass | 2392 |
| /teaching/senior-math/studios/jae/ | studio | pass | 459968 |
| /teaching/model-laboratory/ | models | pass | 54481 |
| /zh/writing/archive/ | alias | pass | 2433 |
| /zh/research/ | alias | pass | 2469 |
| /zh/teaching/jae-math/ | alias | pass | 2407 |
| /zh/teaching/senior-math/studios/jae/ | studio | pass | 457351 |
| /zh/teaching/model-laboratory/ | models | pass | 15861 |
| /writing/two-networks-one-spectrum-different-alarms/ | article | pass | 198142 |
| /images/reader-shares/two-networks-one-spectrum-different-alarms-en.png | png | pass | 37041 |
| /zh/writing/two-networks-one-spectrum-different-alarms/ | article | pass | 199451 |
| /images/reader-shares/two-networks-one-spectrum-different-alarms-zh-Hant.png | png | pass | 39459 |
| /writing/how-many-equilibria-did-the-optimizer-miss/ | article | pass | 221143 |
| /images/reader-shares/how-many-equilibria-did-the-optimizer-miss-en.png | png | pass | 39204 |
| /zh/writing/how-many-equilibria-did-the-optimizer-miss/ | article | pass | 221746 |
| /images/reader-shares/how-many-equilibria-did-the-optimizer-miss-zh-Hant.png | png | pass | 40147 |
| /writing/what-must-a-traffic-model-remember/ | article | pass | 231308 |
| /images/reader-shares/what-must-a-traffic-model-remember-en.png | png | pass | 36610 |
| /zh/writing/what-must-a-traffic-model-remember/ | article | pass | 236178 |
| /images/reader-shares/what-must-a-traffic-model-remember-zh-Hant.png | png | pass | 49354 |
| /writing/when-the-fit-is-not-the-model/ | article | pass | 60255 |
| /images/reader-shares/when-the-fit-is-not-the-model-en.png | png | pass | 32950 |
| /zh/writing/when-the-fit-is-not-the-model/ | article | pass | 58124 |
| /images/reader-shares/when-the-fit-is-not-the-model-zh-Hant.png | png | pass | 37069 |
| /writing/random-stress-tests-are-not-certificates/ | article | pass | 169758 |
| /images/reader-shares/random-stress-tests-are-not-certificates-en.png | png | pass | 38306 |
| /zh/writing/random-stress-tests-are-not-certificates/ | article | pass | 190900 |
| /images/reader-shares/random-stress-tests-are-not-certificates-zh-Hant.png | png | pass | 43245 |
| /writing/when-solar-power-changes-fast/ | article | pass | 159529 |
| /images/reader-shares/when-solar-power-changes-fast-en.png | png | pass | 48009 |
| /zh/writing/when-solar-power-changes-fast/ | article | pass | 160063 |
| /images/reader-shares/when-solar-power-changes-fast-zh-Hant.png | png | pass | 50263 |
| /concepts/ | guide | pass | 14591 |
| /topics/routes/ | guide | pass | 9114 |
| /concepts/baseline/ | guide | pass | 13616 |
| /concepts/assumption/ | guide | pass | 13273 |
| /concepts/sensitivity/ | guide | pass | 13842 |
| /concepts/identifiability/ | guide | pass | 13742 |
| /concepts/calibration/ | guide | pass | 13322 |
| /concepts/validation/ | guide | pass | 13961 |
| /concepts/robustness/ | guide | pass | 13619 |
| /concepts/uncertainty/ | guide | pass | 13931 |
| /topics/routes/model-trust/ | guide | pass | 12321 |
| /topics/routes/city-models/ | guide | pass | 12455 |
| /zh/concepts/ | guide | pass | 14209 |
| /zh/topics/routes/ | guide | pass | 8952 |
| /zh/concepts/baseline/ | guide | pass | 13461 |
| /zh/concepts/assumption/ | guide | pass | 13038 |
| /zh/concepts/sensitivity/ | guide | pass | 13726 |
| /zh/concepts/identifiability/ | guide | pass | 13348 |
| /zh/concepts/calibration/ | guide | pass | 13025 |
| /zh/concepts/validation/ | guide | pass | 13715 |
| /zh/concepts/robustness/ | guide | pass | 13540 |
| /zh/concepts/uncertainty/ | guide | pass | 13568 |
| /zh/topics/routes/model-trust/ | guide | pass | 11840 |
| /zh/topics/routes/city-models/ | guide | pass | 12027 |
| /writing/after-a-good-fit-what-to-measure/ | note | pass | 28367 |
| /writing/keep-the-result-that-changes-the-question/ | note | pass | 29112 |
| /writing/choose-the-question-before-the-score/ | note | pass | 28923 |
| /about/ | about | pass | 14200 |
| /teaching/classroom-packs/ | classroomIndex | pass | 8721 |
| /teaching/classroom-packs/sampling-bias/ | classroomStudent | pass | 17322 |
| /teaching/classroom-packs/sampling-bias/teacher/ | classroomTeacher | pass | 16766 |
| /teaching/classroom-packs/mixing-tank/ | classroomStudent | pass | 26074 |
| /teaching/classroom-packs/mixing-tank/teacher/ | classroomTeacher | pass | 33241 |
| /zh/writing/after-a-good-fit-what-to-measure/ | note | pass | 28372 |
| /zh/writing/keep-the-result-that-changes-the-question/ | note | pass | 28761 |
| /zh/writing/choose-the-question-before-the-score/ | note | pass | 28739 |
| /zh/about/ | about | pass | 13371 |
| /zh/teaching/classroom-packs/ | classroomIndex | pass | 8474 |
| /zh/teaching/classroom-packs/sampling-bias/ | classroomStudent | pass | 16614 |
| /zh/teaching/classroom-packs/sampling-bias/teacher/ | classroomTeacher | pass | 15776 |
| /zh/teaching/classroom-packs/mixing-tank/ | classroomStudent | pass | 25162 |
| /zh/teaching/classroom-packs/mixing-tank/teacher/ | classroomTeacher | pass | 31943 |

## Separate payload and asset results

90/90 local payload format/marker/language checks passed. 13/14 raw committed PNG/SVG hashes matched. The sole strict raw mismatch remains in the table above.

The woven SVG is 8348 bytes in both dist and the public working-tree copy, with 6 CRLF line endings. The commit copy is 8342 bytes with 0 CRLF line endings. Dist exactly equals the working-tree copy. Converting only CRLF to LF gives exact byte equality with the commit and SHA-256 `d034a060535b649ea72a1a7aa62ecc6d5c24bbec75e10301185a3577ef07f9c0`. No source, icon or dist files were modified.

This offline equivalence diagnosis is not a production hash pass. Formal publication still requires live HTTP response bytes to match the released commit raw SHA-256.
