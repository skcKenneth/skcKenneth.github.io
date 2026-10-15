# Authored formula display

This hotfix addresses the existing 28 fixed upper-volume packs and related native Math Studio formula display. It does not change numerical grading, question parameters, learner answers or storage schemas. Lower-volume content is a separate release.

## Display contract

Dedicated question `expression` and `answerExpression` values are canonical TeX. Group the complete exponent with braces: `2^{-3}`, `x^{12}`, `x^{m+2}`. Mathematical audit expressions remain independent; an arithmetic audit may retain `2^(-3)` while its display uses `2^{-3}`. Valid KaTeX syntax alone is insufficient: the old `2^(-3)` rendered only `(` as its exponent.

Authored prose uses explicit `\(...\)` spans. `src/lib/authored-math.mjs` splits these spans and rejects ambiguous exponents. The shared browser bundle is self-hosted with the existing KaTeX dependency; `MathAuthoredMath.render(text)` escapes ordinary text and renders only the marked formulas with trust disabled. Server-rendered `MathText` uses the same boundary contract. Do not apply this renderer to learner drafts, input attributes or saved user notes.

Native question identities are fingerprints of the original prompt. To retain exposure history and English translation keys, existing native strings remain byte-for-byte unchanged. Annotated generated records add only:

```js
math: [{source: '10^5', tex: '10^{5}'}]
```

`MathStudioMath.render(text, record.math)` translates the original authored string first, substitutes only explicitly declared formula fragments with marked canonical TeX, then calls the shared renderer. It does not guess formulas from arbitrary carets. Native foundation, challenge, solution and follow-up text use this authored path. Ordinary escaping remains in place for learner drafts and attributes. The translation walker skips `.katex`, `math` and `[data-authored-math]`, as well as its existing user-content exclusions.

## Source and browser gates

```powershell
node --test tests/formula-rendering.test.mjs tests/math-studio-practice-english.test.cjs tests/math-studio-challenge-english.test.cjs
node scripts/formula-browser-qa.mjs --serve dist --output .tmp/formula-acceptance
```

The five formula source tests inspect the actual rendered MathML exponent child for negative, compound, symbolic and multi-digit powers. They also check all 28 existing packs for unmarked formula syntax, both languages of every annotated selectable native variant, bounded foundation seeds, and escaped learner drafts. A frozen SHA-256 over all selectable keys/prompts/answers/parameters and sampled legacy foundation content is `9bce6682246c8d4082eb6798a22a575d4ddcf95989f4a5eb17b24f21a08677bc`; only the new `math` annotation is excluded. This explicitly guards against orphaning existing exposure history.

The focused real-browser harness uses disposable contexts and synthetic legacy records. It checks:

- Actual bilingual negative/compound/multi-digit/blank superscripts, loaded fonts and 390px layout.
- Trusted native foundation disclosure and language switching, with canonical math annotations preserved and old storage bytes unchanged.
- A real generated scientific-notation practice question, independently calculated numeric grading, preserved raw draft text and retained old exposure entries.
- Reveal-all followed by student exports and default student printing, with no solution markup or forbidden answer fields.

`--base https://skckenneth.github.io` is reserved for a confirmed deployed build. `QA_CASES` permits focused diagnosis; a filtered run is not a complete four-case acceptance. The four focused student PDF probes are separate from full paper acceptance. Because inline math can change line wrapping, the existing pilot and upper collectors/auditors must also regenerate all 168 bilingual editions and recheck A4 pagination, footer/card clearance, option-marker collisions and privacy. Browser MathML checks do not establish physical printer compatibility.

## Evidence status

The combined formula and existing English source gates passed 12/12. The focused frozen-build browser run in `.tmp/formula-acceptance-final/report.json` passed 4/4 on 15 October 2026, with zero page errors or font failures. It served the final build at `http://127.0.0.1:55685`, using Chromium 149.0.7827.55, from `2026-10-15T12:32:55.303Z` to `2026-10-15T12:33:09.811Z`. The full build log is `.tmp-formula-release-build.log`.

The run verified four bilingual upper-pack routes, complete negative/compound/multi-digit/blank exponents, 390px layout, two native foundation sections with trusted language switches, unchanged legacy bytes, and a real generated scientific question graded using its independently calculated value. Raw learner draft text remained unchanged. Reveal-all was followed by four actual student JSON downloads and four default student PDF probes, with no answer markup or forbidden export fields.

The first focused report remains in `.tmp/formula-acceptance-release`. Its three failures were harness assumptions: the exponent used the equivalent multiplication dot `⋅`, a broad A/B selector chose a different question family, and the harness requested a student-only export button from a teacher route. Correcting those assertions/selectors required no application changes. The complete four-case replacement passed in the new directory above.

Full 168-edition physical paper acceptance is recorded separately by the release owner. A local pass is distinct from deployment and production verification; preserve any failed report and label the accepted build and origin explicitly.

Final first-release paper gates passed on 15 October 2026. The original seven-pilot collector passed 8/8 cases with no page errors; its 42 PDF editions passed 289/289 physical checks (`.tmp/formula-pilot-acceptance`). The upper expansion collector passed 8/8 cases with no page errors or print issues; its 126 editions passed 1200/1200 physical checks (`.tmp/formula-upper-acceptance`). All 56 bilingual student core documents remain exactly two A4 pages. The release owner visually inspected the negative-exponent student page, blank-exponent scaffold and Chinese teacher page containing the complete compound exponent. Local security tests passed 20/20; the online dependency audit reported no known vulnerabilities. The first audit attempt could not reach the npm registry from the sandbox; the separate online audit succeeded without dependency or application changes.
