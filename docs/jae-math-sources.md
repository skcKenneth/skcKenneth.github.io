# JAE Mathematics pilot: sources and answer audit

Checked on 2026-10-03. This record accompanies the original bilingual content in src/data/jae-math.mjs.

## Provenance and coverage

The 18 teaching items were newly written for this pilot. They are not transcriptions of official papers or the reference teaching website. Their explanations and distractors were derived from the mathematics below. The official papers remain external links; no paper or answer PDF is rehosted. The site's worked solutions are learning material, not an official marking scheme.

Both topics contain three worked examples and six exercises (four choices and two numerical responses), with foundation, standard and transfer tasks. Every item has two progressively more specific hints and an English/Traditional Chinese solution. The idealised height example is invented and does not represent measured tides, experimental observations or an empirical model.

The [2027 JM01 syllabus](https://www.must.edu.mo/images/JAE/JM01_Exam_Syllabus_2027.pdf) is the curriculum reference. The official syllabus has 16 numbered headings. The two pilot topics are an instructional selection, not a claim to cover the whole examination.

| Pilot | Alignment and limit |
| --- | --- |
| Quadratic equations and functions | Item 5: equations, discriminant, roots and coefficients, completing the square and extrema. Item 15: quadratic graphs and transformations. |
| Trigonometric ratios and function graphs | Selected foundations of item 13: degree/radian conversion and sine/cosine values; selected graphs and transformations from item 15. Compound-angle identities, half-angle identities, auxiliary-angle formulas, triangle rules, inverse functions and the wider trigonometric-equation syllabus remain outside this pilot. |

The coefficient assumptions in the concept cards matter: a quadratic needs a nonzero quadratic coefficient; a nonconstant sine/cosine model needs nonzero vertical and horizontal multipliers. The trigonometric period formulas state their angle units. The supplementary paper JM02 is distinct and is not part of this five-year JM01 index.

## Official link verification

Verification means that the listed official URL was requested through the web retrieval tool, the returned document was identified as the stated PDF, and its examination year and paper type were checked. It is not a promise of future availability, a checksum of a local copy, or a claim that every official answer was audited. The dates in the data mean this source check date, not the PDF publication date.

| Resource | Official host and exact target | Result on 2026-10-03 |
| --- | --- | --- |
| 2027 JM01 syllabus | [MUST PDF](https://www.must.edu.mo/images/JAE/JM01_Exam_Syllabus_2027.pdf) | Six-page PDF; 2027 and Mathematics Standard Paper identified; relevant syllabus paragraphs read. |
| 2021 JM01 paper and suggested answers | [MUST PDF](https://www.must.edu.mo/images/JAE/JEX2021_%E6%95%B8%E5%AD%B8%E6%AD%A3%E5%8D%B7.pdf) | Thirteen-page PDF, cover and answer section identified. |
| 2022 JM01 paper and suggested answers | [MUST PDF](https://www.must.edu.mo/images/JAE/JEX2022_%E6%95%B8%E5%AD%B8%E6%AD%A3%E5%8D%B7.pdf) | Fifteen-page PDF identified. |
| 2023 JM01 paper and suggested answers | [MUST PDF](https://www.must.edu.mo/images/JAE/JEX2023_%E6%95%B8%E5%AD%B8%E6%AD%A3%E5%8D%B7.pdf) | Thirteen-page PDF identified. |
| 2024 JM01 paper and suggested answers | [UTM PDF](https://www.utm.edu.mo/admission/filemanager/en/content_94/JM01%202024%20%20exam%20paper%20and%20suggested%20answers.pdf) | Thirteen-page PDF identified. The two encoded spaces after the year are part of the source URL. |
| 2025 JM01 paper and suggested answers | [UTM PDF](https://www.utm.edu.mo/admission/filemanager/en/content_94/JM01%202025%20exam%20paper%20and%20suggested%20answers.pdf) | Thirteen-page PDF, cover and Standard Paper identified. |

The first direct retrieval attempts for the 2027 syllabus and 2025 paper failed intermittently. Following the PDF links from the official [MUST index](https://www.must.edu.mo/page/jae.syllabus.html?locale=zh_CN) and [UTM index](https://www.utm.edu.mo/admission/tc/undergraduate_programmes/joint-admission-examination/jae-syllabus-and-past-examination-papers/index.html) succeeded in the same verification session. Both indexes list a 2027 syllabus. UTM also lists a 2026 paper; the pilot intentionally retains the selected 2021–2025 archive range rather than labelling 2025 the latest paper.

For future updates, revisit the official indexes, open the linked PDF, and check the cover. Do not construct a guessed filename for a new year or silently substitute a supplementary paper. If a source becomes unavailable, show that state and retain its identity rather than replacing it with an unrelated resource.

## Independent answer derivations

The checks below derive the result from the displayed inputs. They do not use a copied official answer key. Choice labels are stable identifiers shared by both language versions.

| Item ID | Answer | Independent analytic check |
| --- | --- | --- |
| quadratics-example-1 | −5 | 2x²−12x+13 = 2(x−3)²−5; a real square is nonnegative; equality at x=3. Expanding yields 2x²−12x+18−5. |
| quadratics-example-2 | 9 | x²−6x+k = (x−3)²+k−9. Exactly one x-axis intersection requires k−9=0. Independently, Δ=36−4k=0 gives k=9. |
| quadratics-example-3 | 49 | Perimeter 28 gives x+ℓ=14; area x(14−x)=49−(x−7)². The maximiser x=7 lies in 0<x<14 and both sides equal 7. |
| quadratics-choice-1 | B | At x=−2 the squared bracket vanishes, giving y=7. For any real u, f(−2+u)=f(−2−u)=7−3u². Vertex (−2,7). |
| quadratics-choice-2 | D | x²+4x+8=(x+2)²+4 is strictly positive for every real x. Independently Δ=16−32=−16. No real roots. |
| quadratics-choice-3 | C | (2x−1)(x−3)=2x²−7x+3; roots 1/2 and 3. Substitution gives 1/2−7/2+3=0 and 18−21+3=0. Sum 7/2 and product 3/2 match coefficients. |
| quadratics-choice-4 | A | Translate f left by 3 and down by 4: g(x)=f(x+3)−4=((x+3)−1)²+2−4=(x+2)²−2. Vertex (1,2) becomes (−2,−2). |
| quadratics-number-1 | −7 | 3x²+12x+5=3(x+2)²−7; equality at x=−2. Direct substitution gives 12−24+5=−7. |
| quadratics-number-2 | 21 | Root sum 5, product 2, hence α²+β²=(α+β)²−2αβ=25−4=21. Roots are real because Δ=25−8=17>0. |
| trigonometry-example-1 | 1/2 | 150π/180=5π/6; the point is in quadrant II. Reflecting the π/6 point across the vertical axis leaves its y-coordinate 1/2 unchanged. |
| trigonometry-example-2 | 2 (amplitude) | −1≤cos(3x)≤1 implies −1≤1−2cos(3x)≤3. Amplitude=(3−(−1))/2=2. Successive minima occur at x=0 and 2π/3, so period 2π/3. |
| trigonometry-example-3 | 5 | A maximum requires π(t−2)/6=π/2+2πn, giving t=5+12n. Only t=5 lies in [0,14]; height=4+3=7. Adjacent peaks −7 and 17 are outside. |
| trigonometry-choice-1 | B | 2π/3=π−π/3; reflection across the vertical axis changes cos(π/3)=1/2 to −1/2. |
| trigonometry-choice-2 | C | Argument 2x gains a complete turn when 2T=2π, hence T=π. Half this candidate, T=π/2, changes sin(2x) to −sin(2x), so is not a period. |
| trigonometry-choice-3 | D | Replacing x with x−π/4 shifts right π/4; adding 1 shifts up 1. The upward midline crossing moves from (0,0) to (π/4,1). |
| trigonometry-choice-4 | A | Midline (8+2)/2=5, amplitude (8−2)/2=3, positive frequency 2π/(4π)=1/2. Positive cosine starts at 8 when x=0 and reaches 2 at x=2π. The other options fail range, period or initial peak. |
| trigonometry-number-1 | 90 | The argument is explicitly in degrees. 4T=360 gives T=90 degrees; a change of 45 gives a half-cycle, not a full cycle. |
| trigonometry-number-2 | 5/12 | 2x−π/3=π/2+2πn gives x=5π/12+πn. The preceding solution is −7π/12<0; c=x/π=5/12. Substitution gives argument π/2 and y=2. |

The first trigonometry example's numeric answer field records its sine, while the worked solution also gives its radian conversion. The second records amplitude, while its solution also supplies period and range. Worked examples are not multiple-choice answer keys.

## Numerical and presentation checks

- Integer numerical tasks use absolute tolerance 10⁻⁸. The last trigonometry task requests the coefficient c rather than a symbolic multiple of π; tolerance 10⁻⁶ admits a six-decimal approximation of 5/12 without accepting 5π/12.
- All numerical tasks have a single requested numeric quantity with units or normalisation explicitly stated. In particular, the degree-period exercise uses a degree mark on the complete angle 4x.
- Every choice question has exactly one correct option among its four displayed options. Graph-translation choices are checked by their vertex or midline crossing, not only by matching a formula string.
- Worked solutions use exact expressions first; decimal approximations appear only where useful for a numerical entry. The graph is a visual aid, not a substitute for the algebraic derivation.
- Module import, ID uniqueness, bilingual text presence, the 3/4/2 kind counts, two hints per item, answer/choice consistency and KaTeX parsing are checked during implementation. Browser interactions and release validation belong to the feature integration checks.

Implementation check on 2026-10-03: the ES module imported successfully in Node; 18 unique items, 202 bilingual text objects, 93 KaTeX expressions and five paper records passed the structural checks. All 18 answer fields matched the independent ledger. Polynomial expansion and trigonometric-period identities were also sampled across 129 input values. The six-decimal entry 0.416667 passed the final task's tolerance, while entering 5π/12 as a decimal failed its requested c-value comparison. These are content/module checks, not evidence of browser or live-site deployment.
