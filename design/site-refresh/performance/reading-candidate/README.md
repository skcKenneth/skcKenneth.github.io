# reading-candidate

Source HEAD: `42a68fcb9e4eaa357a0e5a9661ed5add52fb007a`
Source state: working-tree
HEAD is the base revision; the measured output belongs to an uncommitted working tree, not a release at that commit. Page and asset hashes identify the measured dist snapshot.
Captured: 2026-10-11T07:09:36.496Z

Offline reads of a frozen built dist. Declared local asset bytes and static JS imports; no HTTP requests, browser timings, cache behaviour, Web Vitals or real-user measurements. gzip/Brotli values are estimates. Lazy images are declared bytes, not necessarily initial downloads. CSS fonts, responsive candidates and dynamic imports are separate potential dependencies.

| Route | HTML | CSS | Initial JS graph | Declared images |
|---|---:|---:|---:|---:|
| / | 18750 | 79512 | 0 | 22425 |
| /zh/ | 18747 | 79512 | 0 | 22425 |
| /topics/dynamics-networks/ | 18623 | 79668 | 0 | 18981 |
| /zh/topics/dynamics-networks/ | 18735 | 79668 | 0 | 18981 |
| /writing/two-networks-one-spectrum-different-alarms/ | 198092 | 87600 | 15903 | 1205434 |
| /zh/writing/two-networks-one-spectrum-different-alarms/ | 199405 | 87600 | 15903 | 1205434 |
| /writing/how-many-equilibria-did-the-optimizer-miss/ | 221174 | 87600 | 15903 | 839744 |
| /zh/writing/how-many-equilibria-did-the-optimizer-miss/ | 221785 | 87600 | 15903 | 839744 |
| /writing/what-must-a-traffic-model-remember/ | 231345 | 87600 | 15903 | 469480 |
| /zh/writing/what-must-a-traffic-model-remember/ | 236181 | 87600 | 15903 | 469480 |
| /writing/when-the-fit-is-not-the-model/ | 60202 | 87600 | 15903 | 18008 |
| /zh/writing/when-the-fit-is-not-the-model/ | 58071 | 87600 | 15903 | 18008 |
| /writing/random-stress-tests-are-not-certificates/ | 169769 | 87600 | 15903 | 79024 |
| /zh/writing/random-stress-tests-are-not-certificates/ | 190873 | 87600 | 15903 | 79024 |
| /writing/when-solar-power-changes-fast/ | 159587 | 87600 | 15903 | 255395 |
| /zh/writing/when-solar-power-changes-fast/ | 160034 | 87600 | 15903 | 255395 |

All counts are bytes. Unique paths are counted once per route. Inline scripts are already included in HTML. Sharing metadata images, favicon alternatives, CSS/font candidates and dynamic import targets are excluded from the displayed totals.
