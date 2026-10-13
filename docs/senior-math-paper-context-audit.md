# Official-paper question-context audit

Reviewed on 2026-10-08: all 287 authored leaf items from the twelve official 2021–2026 JM01/JM02 papers. This is a source-context review, separate from the existing answer recalculation and official-answer comparison. No raw question IDs, answers or worked solutions were changed.

## What was checked

For every leaf, the review compared its bilingual public statement, displayed expression, choices, conditions and question diagram with the official question pages. It then checked the earlier statements in the same top-level question that the new context panel supplies. Particular attention went to definitions on preceding pages, leading shared givens, geometric incidence, argument/domain conditions, and explicit identities that a question asks students to prove.

Source PDFs remain external. The local review used the previously verified PDFs whose SHA-256 hashes are recorded in paper-source-manifest.mjs. The frozen per-item ledger contains the source hash and official question page, public-statement hash, unchanged-answer hash, expected earlier-part IDs and applicable explicit context IDs. The local-source test rechecks all twelve PDF hashes. Page numbers below are one-based PDF pages, not printed page labels.

| Paper | Leaf items | Official question PDF pages | Context review |
|---|---:|---|---|
| 2026 JM01 | 27 | 2–5 | All 15 choice items and 12 written leaves reviewed |
| 2026 JM02 | 21 | 3–7 | All five top-level questions and 21 leaves reviewed |
| 2025 JM01 | 26 | 2–4 | All 15 choice items and 11 written leaves reviewed |
| 2025 JM02 | 22 | 3–7 | All five top-level questions and 22 leaves reviewed |
| 2024 JM01 | 25 | 2–4 | All 15 choice items and 10 written leaves reviewed |
| 2024 JM02 | 21 | 3–7 | All five top-level questions and 21 leaves reviewed |
| 2023 JM01 | 29 | 2–4 | All 15 choice items and 14 written leaves reviewed |
| 2023 JM02 | 19 | 3–7 | All five top-level questions and 19 leaves reviewed |
| 2022 JM01 | 26 | 2–4 | All 15 choice items and 11 written leaves reviewed |
| 2022 JM02 | 24 | 3–7 | All five top-level questions and 24 leaves reviewed |
| 2021 JM01 | 26 | 2–4 | All 15 choice items and 11 written leaves reviewed |
| 2021 JM02 | 21 | 3–7 | All five top-level questions and 21 leaves reviewed |
| Total | **287** | | No omitted leaf records |

The official URLs for each paper are recorded unchanged in the source manifest and in every supplemental context segment. Images were visually inspected when PDF text extraction was incomplete, particularly all five 2022 JM02 question pages; the geometry, conic and parameter pages of 2021 JM02; the 2021/2022 JM01 diagram pages; the 2023 sinusoid and focal-chord diagrams; the 2023/2024/2025 JM02 geometry diagrams; the 2025 JM01 similarity diagram; the 2025 complex-sum target; and the 2026 cube diagram. Source page scans were used in private scratch only and are not added to the public site.

## Restored context

The new paper-shared-stems.mjs contains 19 independently phrased bilingual segments. Each has an explicit list of source-question labels to which it applies, so a later proof target is not inserted into unrelated earlier parts.

| Paper / question | Source PDF page | Restored information |
|---|---:|---|
| 2026 JM01 I.13 | 3 | Sₙ is the geometric sequence's first n-term sum |
| 2026 JM01 II.1(a–b) | 4 | One point per hit, one shot per member, and mutual independence across all six shots |
| 2026 JM01 II.3(a–c) | 4 | Sₙ definition and positive integer indexing |
| 2026 JM02 1(a–c) | 3 | Complete cube vertex incidence, corresponding edges, M on EC, and GM perpendicular to EC, with an original incidence SVG |
| 2026 JM02 4(b)(i–ii) | 6 | The actual quadratic-factorisation identity given as the proof target |
| 2025 JM01 I.13 | 3 | Sₙ definition |
| 2025 JM01 II.1(a–b) | 4 | Which sequence Sₙ sums, indexing and positive geometric ratio |
| 2025 JM01 II.4(a–c) | 4 | The specific equal sides AB=AC and full point order/incidence |
| 2025 JM01 II.5(b) | 4 | O denotes the coordinate origin |
| 2025 JM02 3(a–d) | 5 | Leading ellipse, horizontal major axis, right focus, point and secant givens |
| 2025 JM02 4(c–d) | 6 | The finite complex-sum identity that part (c) asks to prove |
| 2024 JM01 II.3(b) | 4 | Sₙ is the partial sum for each candidate sequence |
| 2024 JM01 II.5(b) | 4 | O denotes the coordinate origin |
| 2024 JM02 3(a–d), segment 1 | 5 | Nonvertical secant, its point, slope, distinct intersections and coordinate labels |
| 2024 JM02 3(a–d), segment 2 | 5 | The exact intersection-abscissa equation required in part (a) |
| 2024 JM02 4(b) | 6 | Positive integer n in the De Moivre power identities |
| 2023 JM02 4(b)(i–ii) | 6 | Explicit sine/cosine/tangent triple-angle targets |
| 2022 JM01 II.3(b) | 4 | Coordinate origin and secant/midpoint definitions |
| 2021 JM01 II.3(a–c) | 4 | The exact completed-square identity requested in part (a) |

The cube SVG is a newly drawn incidence sketch, not a copied scan. It labels all eight cube vertices and M, preserves the corresponding edges and M's membership of EC, and draws GM. It does not state M's coordinates, plane membership, lengths or cone volume. The diagram explicitly says it is not to scale; perpendicularity is supplied by the statement, not inferred from a two-dimensional rendering.

## Other source-sensitive cases reviewed

- 2026 JM01 II.3(b–c), II.4(b), and JM02 2(a)(v), 3(c–d), 5(b)(ii) obtain the missing preceding sequence, function, points or system from earlier statements. No solution field is needed.
- 2025 JM01 II.4 already has an original similarity diagram; the new short stem only removes ambiguity about which sides are equal. The equation/domain of its slope-product locus remains as authored.
- 2025 JM02 geometry has a complete verbal specification of the square base, equilateral face, perpendicular planes and midpoint. Its conic problem now includes the leading common ellipse definition even in its first part.
- 2024 JM02 geometry already supplies coplanarity and the opposite-side placement of B,D relative to AC. The cone, hyperbola, complex-number and linear-system branches have all necessary equations through their own or earlier statements.
- 2023 JM01 I.14 describes all numerical information needed from the source graph: minimum 0, maximum 4 and the marked maximum at 5π/3. II.2(c) explicitly preserves M between C and D from the source drawing. The missing sign assumption in II.4 is an existing source discrepancy, not silently invented in a context stem.
- 2023 JM02 geometry gives the rhombus, lengths, angles, midpoint and perpendicular foot in every leaf. Ellipse tangent-slope statements preserve the external point and the separately handled vertical-tangent cases.
- 2022 JM01 I.7 describes the bounded gap between both tangent circles and their common line. I.9 supplies equivalent descriptions of the four original shaded alternatives. The source images confirm these are four alternatives. The algebraic parameters and exceptional linear case are preserved.
- 2022 JM02 source text extraction contains missing glyphs. Visual page inspection confirms the authored geometric lengths/angles, cubic, vector locus, tangent-angle target, seventh roots of unity, repeated printed subpart label, determinant and parameter system. The internal label 4(b)(iii) continues to distinguish the source's second printed “(ii)”.
- 2021 JM01 retains the overlap area of 3 and top/bottom tangency; it does not repeat the erroneous external-tangency claim seen in an unrelated teaching reference. Its graph and circle question SVGs provide the original givens. The source image confirms II.3(b) uses y=x/m and II.5(a) asks sin²C.
- 2021 JM02 already has a complete original trapezoid/pyramid incidence SVG and the required common data in every geometric leaf. The parabola, trigonometric induction and parameter-system targets are explicit. The English suggested-answer graph label discrepancy stays in the original source-discrepancy note.

## Automated gates and limits

Run node scripts/senior-math-paper-context-checks.mjs for all 287 item identities, reviewed public hashes, raw answer preservation, dependency ordering, exact supplemental targeting, strict KaTeX and SVG safety. Add --local-sources in the review workspace to check all twelve private PDF files against their stored official-source hashes.

The test checks that context contains only public statement fields and provenance, never answer, steps, hints, result, explanation or solutionSvg. All earlier statements from the same top-level question are available, which may be more context than the minimum needed. This ledger records a manual completeness review with regression safeguards; it is not an automated proof of mathematical sufficiency and does not certify official marking schemes.
