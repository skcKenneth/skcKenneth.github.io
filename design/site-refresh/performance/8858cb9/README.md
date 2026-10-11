# Local static asset baseline

Source commit: `8858cb9e4931debaa190db9ba31098b52f8d9749`
Captured: 2026-10-11T06:08:40.510Z

Offline reads of a frozen built dist. Declared local asset bytes and static JS imports; no HTTP requests, browser timings, cache behaviour, Web Vitals or real-user measurements. gzip/Brotli values are estimates. Lazy images are declared bytes, not necessarily initial downloads. CSS fonts, responsive candidates and dynamic imports are separate potential dependencies.

| Route | HTML | CSS | Initial JS graph | Declared images |
|---|---:|---:|---:|---:|
| / | 13905 | 64287 | 0 | 40402 |
| /zh/ | 13974 | 64287 | 0 | 40402 |
| /topics/dynamics-networks/ | 13962 | 75139 | 0 | 8348 |
| /zh/topics/dynamics-networks/ | 14073 | 75139 | 0 | 8348 |
| /writing/two-networks-one-spectrum-different-alarms/ | 180622 | 75139 | 6717 | 1205434 |
| /zh/writing/two-networks-one-spectrum-different-alarms/ | 182310 | 75139 | 6717 | 1205434 |
| /writing/how-many-equilibria-did-the-optimizer-miss/ | 203679 | 75139 | 6717 | 839744 |
| /zh/writing/how-many-equilibria-did-the-optimizer-miss/ | 204808 | 75139 | 6717 | 839744 |
| /writing/what-must-a-traffic-model-remember/ | 214398 | 75139 | 6717 | 469480 |
| /zh/writing/what-must-a-traffic-model-remember/ | 219011 | 75139 | 6717 | 469480 |
| /writing/when-the-fit-is-not-the-model/ | 43956 | 75139 | 6717 | 18008 |
| /zh/writing/when-the-fit-is-not-the-model/ | 42240 | 75139 | 6717 | 18008 |
| /writing/random-stress-tests-are-not-certificates/ | 152855 | 75139 | 6717 | 79024 |
| /zh/writing/random-stress-tests-are-not-certificates/ | 173751 | 75139 | 6717 | 79024 |
| /writing/when-solar-power-changes-fast/ | 142058 | 75139 | 6717 | 255395 |
| /zh/writing/when-solar-power-changes-fast/ | 142844 | 75139 | 6717 | 255395 |

All counts are bytes. Unique paths are counted once per route. Inline scripts are already included in HTML. Sharing metadata images, favicon alternatives, CSS/font candidates and dynamic import targets are excluded from the displayed totals.
