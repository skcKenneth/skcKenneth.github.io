# Official JAE mathematics paper solution audit

Verification date: **2026-10-03**. This is a content/source ledger, not a deployment record.

Current corpus: **12/12 complete papers; 287 independently authored item/subpart solutions**. The release command below refuses an incomplete set.

## Scope and provenance

The archive covers 2021–2026, both JM01 (standard paper) and JM02 (supplementary paper). Every JM01 multiple-choice item and every written subpart is retained. Every JM02 question is solved, including all five questions although the examination instructs candidates to choose three. No school workbook adaptation is presented as an official item.

Official discovery indices: [MUST JAE syllabus and papers](https://www.must.edu.mo/page/jae.syllabus.html?locale=zh_CN), [UTM JAE syllabus and papers](https://www.utm.edu.mo/admission/tc/undergraduate_programmes/joint-admission-examination/jae-syllabus-and-past-examination-papers/index.html). The exact verified PDF URLs and SHA-256 fingerprints are listed below and fixed in `src/data/senior-math/paper-source-manifest.mjs`.

The site supplies short question summaries, necessary mathematical expressions, independently written Traditional Chinese/English explanations, two progressive hints, worked steps, final results and common-error notes. The official PDFs remain external links. Downloaded PDFs, extracted text and diagnostic page renders are confined to private scratch `.tmp/senior-math/papers/` (excluded from staging and publication); no full official paper or full-page scan is published by this feature. Diagrams in the teaching data are newly authored mathematical SVGs.

Page references always mean **one-based PDF pages**, not an inferred printed page number. Mathematical extraction was visually checked where symbols, fractions, powers or graphics were ambiguous. In particular, the 2022 JM02 embedded-font text is unusable for many formulae; its question pages 3–7 and answer pages 8–12 were read visually.

## Verification contract

A paper is marked `complete` only after all its items/subparts have independent derivations compared with its official suggested answers. An official error or incomplete condition is explained explicitly instead of copied into the solution. The ledger below records the exact part label, question/answer page and independently obtained result. The full derivations and conditions are in the corresponding `paper-jm01-YYYY.mjs` / `paper-jm02-YYYY.mjs` module.

`paper-inventory.mjs` is a separate transcription of the source item labels and multiple-choice keys. It is not generated from the authored question arrays. The checker compares those two representations, checks all five JM02 top-level questions, exact option counts, unique IDs, bilingual fields, two hints, source page bounds, strict KaTeX and safe SVG structure. The 2022 duplicated printed Q4(b)(ii) label is normalised to (iii) with a visible source note.

Independent computational checks supplement the mathematical derivations: exhaustive Bernoulli samples and finite selection counts; finite sequence sums and integer divisibility; determinant identities over parameter grids; direct substitution of roots and parameterised solutions; exact-value trigonometric checks; geometric lengths, perpendicularity and areas; derivative critical values; and independently evaluated integral antiderivatives. These checks do not claim to replace a human proof audit or establish correctness merely from schema validity.

```powershell
node scripts/senior-math-paper-check.mjs          # authoring diagnostic
node scripts/senior-math-paper-check.mjs --full   # requires all 12 complete papers
node scripts/senior-math-paper-audit.mjs          # regenerate this ledger from reviewed data
```

## Coverage and official originals

| Paper | Status | MC / written top-level | Leaf items | Question PDF pages | Answer PDF pages | Official original |
|---|---|---:|---:|---|---|---|
| jm01-2026 | complete | 15 / 5 | 27 | 2, 3, 4, 5 | 6, 7, 8 | [PDF](https://www.utm.edu.mo/admission/filemanager/en/content_94/JM01%202026%20exam%20paper%20and%20suggested%20answers.pdf) |
| jm02-2026 | complete | 0 / 5 | 21 | 3, 4, 5, 6, 7 | 8, 9, 10, 11 | [PDF](https://www.utm.edu.mo/admission/filemanager/en/content_94/JM02%202026%20exam%20paper%20and%20suggested%20answers.pdf) |
| jm01-2025 | complete | 15 / 5 | 26 | 2, 3, 4 | 5, 6, 7 | [PDF](https://www.utm.edu.mo/admission/filemanager/en/content_94/JM01%202025%20exam%20paper%20and%20suggested%20answers.pdf) |
| jm02-2025 | complete | 0 / 5 | 22 | 3, 4, 5, 6, 7 | 8, 9, 10, 11, 12 | [PDF](https://www.utm.edu.mo/admission/filemanager/en/content_94/JM02%202025%20exam%20paper%20and%20suggested%20answers.pdf) |
| jm01-2024 | complete | 15 / 5 | 25 | 2, 3, 4 | 5, 6, 7 | [PDF](https://www.utm.edu.mo/admission/filemanager/en/content_94/JM01%202024%20%20exam%20paper%20and%20suggested%20answers.pdf) |
| jm02-2024 | complete | 0 / 5 | 21 | 3, 4, 5, 6, 7 | 8, 9, 10, 11 | [PDF](https://www.utm.edu.mo/admission/filemanager/en/content_94/JM02%202024%20%20exam%20paper%20and%20suggested%20answers.pdf) |
| jm01-2023 | complete | 15 / 5 | 29 | 2, 3, 4 | 5, 6, 7 | [PDF](https://www.must.edu.mo/images/JAE/JEX2023_%E6%95%B8%E5%AD%B8%E6%AD%A3%E5%8D%B7.pdf) |
| jm02-2023 | complete | 0 / 5 | 19 | 3, 4, 5, 6, 7 | 8, 9, 10, 11 | [PDF](https://www.must.edu.mo/images/JAE/JEX2023_%E6%95%B8%E5%AD%B8%E9%99%84%E5%8A%A0%E5%8D%B7.pdf) |
| jm01-2022 | complete | 15 / 5 | 26 | 2, 3, 4 | 5, 6, 7, 8 | [PDF](https://www.must.edu.mo/images/JAE/JEX2022_%E6%95%B8%E5%AD%B8%E6%AD%A3%E5%8D%B7.pdf) |
| jm02-2022 | complete | 0 / 5 | 24 | 3, 4, 5, 6, 7 | 8, 9, 10, 11, 12 | [PDF](https://www.must.edu.mo/images/JAE/JEX2022_%E6%95%B8%E5%AD%B8%E9%99%84%E5%8A%A0%E5%8D%B7.pdf) |
| jm01-2021 | complete | 15 / 5 | 26 | 2, 3, 4 | 5, 6, 7 | [PDF](https://www.must.edu.mo/images/JAE/JEX2021_%E6%95%B8%E5%AD%B8%E6%AD%A3%E5%8D%B7.pdf) |
| jm02-2021 | complete | 0 / 5 | 21 | 3, 4, 5, 6, 7 | 8, 9, 10, 11, 12 | [PDF](https://www.must.edu.mo/images/JAE/JEX2021_%E6%95%B8%E5%AD%B8%E9%99%84%E5%8A%A0%E5%8D%B7.pdf) |

| Paper | SHA-256 of the verified source PDF | Source PDF pages |
|---|---|---:|
| jm01-2026 | e69379e8561439cae6a13c54afef2b9313972a03e1ed061787b2ccf132471ffc | 15 |
| jm02-2026 | 90ba52e97376ae87ba9abf5438cef2e84469572d00ad370a2a91277f540d340f | 15 |
| jm01-2025 | 530b06e9f3920b7d8206fa86ac36ad8eaca017ee3b854384cd85c2cbaa157f90 | 13 |
| jm02-2025 | 1519d0b0c56eaaee8d087a7a1196695f40bee905c0dd0fd342314bc575b69aac | 17 |
| jm01-2024 | 3128ac9914259d3de315e596a3679660f165eef9445b4a7b1acf85bd98058d92 | 13 |
| jm02-2024 | 3846577dc47a28fcbffe055ae44a1b286fc4af992a2b54b06ca76541c0238914 | 15 |
| jm01-2023 | 78734823fb6dc6c995ef565c746019d5a780fcdcf81cbab98bc905a0358f54f3 | 13 |
| jm02-2023 | b952df198351b041616f6bac31ef72dbfea091e874c47237b7692b886e4187d0 | 15 |
| jm01-2022 | 02996e5bad36dc36e815ff9252a8a076b007dcf45f72fd05bf788345010516fb | 15 |
| jm02-2022 | 81aa00ea18ae3007f17005a596da2794ce15006abcafd2172d5f006aa2e3524b | 16 |
| jm01-2021 | 63349c2c62a21d790d1a1189e08468b1459e0c0c95bbbf0f34cdc07ad9eae6d8 | 13 |
| jm02-2021 | 90c6fa4bd07470539056a27fe759a0c2414fd1da7cfcd225d2213293740fb3e4 | 17 |

## Source discrepancies and interpretation notes

- **jm01-2026 II.5(a)(ii)** (question PDF 5, answer PDF 8): Official question page 5 asks for f(xₙ); official solution page 8 establishes xₙ=3/(n+1). The displayed solution resolves both interpretations explicitly. 官方第 5 頁題目問 f(xₙ)，第 8 頁答案證明 xₙ=3/(n+1)。本解答明確處理兩種表述。
- **jm01-2025 II.3(b)** (question PDF 4, answer PDF 6): The official final value is −7/25. One printed intermediate line omits the factor 2 before (4/5)²; the derivation here retains it. 官方最終值為 −7/25，但其中一行漏印 (4/5)² 前的係數 2；此處推導保留該係數。
- **jm01-2025 II.5(a)** (question PDF 4, answer PDF 7): The official answer gives the ellipse equation without exclusions. The original slope condition excludes its two horizontal vertices; both the equation and this domain detail are retained. 官方答案給出橢圓方程而未列排除點。原斜率條件排除了左右頂點；此處保留方程及此定義域細節。
- **jm01-2023 II.4(a)** (question PDF 4, answer PDF 6): The printed stem omits w>0; the suggested answer uses T=π/w and gives only w=1/3. We retain both period-compatible branches here. Part (b) rules out the negative one. 原題未寫 w>0，參考答案卻用 T=π/w 而只取 w=1/3。此處保留兩個符合週期的分支；(b) 的條件會排除負分支。
- **jm01-2022 II.5** (question PDF 4, answer PDF 8): The suggested answer prints 854÷14=16 in the base-case line. The correct quotient is 61; the divisibility claim and induction argument are unchanged. 參考答案基礎步把 854÷14 印成 16；正確商為 61。整除結論及歸納論證仍成立。
- **jm02-2022 4(b)(iii)** (question PDF 6, answer PDF 11): The final subpart is printed with a second “(ii)” label in both languages. It is recorded here as 4(b)(iii) to keep references unique; its expression is unchanged. 中英文原卷最後小題都重複標成「(ii)」。此處記作 4(b)(iii)，使引用編號唯一；題式不變。
- **jm01-2021 I.7** (question PDF 2, answer PDF 5): The printed stem says “which must hold”. Option B is also a weaker necessary condition, while C is the exact attainable range and the official best answer. This wording ambiguity is retained explicitly. 原題問「哪個一定成立」。B 亦為較弱的必要條件；C 則是確切可取得範圍及官方最佳答案。此處明示這項措辭歧義。
- **jm02-2021 2(a)(iv)** (question PDF 4, answer PDF 9): The English suggested-answer plot headings on PDF14 are shifted by one subpart; the original question and Chinese headings identify this as (iv). 官方英文答案 PDF14 的圖標題小題編號偏移一項；按原題及中文標題，此圖屬 (iv)。
- **jm02-2021 2(a)(v)** (question PDF 4, answer PDF 9): The English suggested-answer plot on PDF14 is labelled (iv); it answers the original (v), as the Chinese version correctly labels it. 官方英文答案 PDF14 把此圖標為 (iv)；它回答原題 (v)，中文版本的編號正確。

Additional condition checks retained in the solutions: 2021 JM01 II.3 uses |a| because the printed parameter sign is not specified; 2023 JM01 II.2(c) uses the diagram’s M-between-C-and-D condition; 2023 JM02 ellipse tangent loci separately restore vertical/horizontal tangent cases; 2025 JM02 the sine-sum solution checks θ=π separately from the preceding identity’s restricted domain. Candidate answers introduced by squaring are checked against original signs and domains.

## Item-by-item independent result ledger

The MC letter is compared to the official answer key. Written results below are the authored conclusions after comparison with the suggested answers; any deviation or repair is covered by the discrepancy notes above. Proof questions retain their complete argument in the module, not merely this short result.

### jm01-2026

Official multiple-choice key: ABCEDCBDEADADBC. All 15 questions retain 5 options.

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| I.1 | 2 / 6 | A: [−2,0]. A：[−2,0]。 |
| I.2 | 2 / 6 | B: 5/8. B：5/8。 |
| I.3 | 2 / 6 | C: −2. C：−2。 |
| I.4 | 2 / 6 | E: k<9. E：k<9。 |
| I.5 | 2 / 6 | D: (1+3¹⁰⁰¹)/4. D：(1+3¹⁰⁰¹)/4。 |
| I.6 | 2 / 6 | C: 21/4. C：21/4。 |
| I.7 | 2 / 6 | B: x/(x−1). B：x/(x−1)。 |
| I.8 | 2 / 6 | D: 3x+4y+16=0. D：3x+4y+16=0。 |
| I.9 | 3 / 6 | E: −66. E：−66。 |
| I.10 | 3 / 6 | A: 180 committees. A：180 種。 |
| I.11 | 3 / 6 | D: {0,3}. D：{0,3}。 |
| I.12 | 3 / 6 | A: −1/7. A：−1/7。 |
| I.13 | 3 / 6 | D: 63. D：63。 |
| I.14 | 3 / 6 | B: a≤−2. B：a≤−2。 |
| I.15 | 3 / 6 | C: [0,∞). C：[0,∞)。 |
| II.1(a) | 4 / 7 | Scores 0,1,2,3 have probabilities 1/24, 1/4, 11/24, 1/4. 得 0、1、2、3 分的概率依次為 1/24、1/4、11/24、1/4。 |
| II.1(b) | 4 / 7 | 63/512. 63/512。 |
| II.2(a) | 4 / 7 | P=(0,5), Q=(2,9). P=(0,5)，Q=(2,9)。 |
| II.2(b) | 4 / 7 | Minimum 10√2, attained at M=(5/7,0). 最小值為 10√2，在 M=(5/7,0) 取得。 |
| II.3(a) | 4 / 7 | aₙ=8n+4 for n≥1. n≥1 時，aₙ=8n+4。 |
| II.3(b) | 4 / 7 | Tₙ=3/16−(1/8)(1/(n+1)+1/(n+2)). Tₙ=3/16−(1/8)(1/(n+1)+1/(n+2))。 |
| II.3(c) | 4 / 7 | The lower bound is attained only at n=1; the upper bound is never attained. 下界只在 n=1 取得；上界不會取得。 |
| II.4(a) | 4 / 7 | x²/4−y²/2=1. x²/4−y²/2=1。 |
| II.4(b) | 4 / 7, 8 | AM⊥BM. AM⊥BM。 |
| II.5(a)(i) | 5 / 8 | x₂=1, x₃=3/4. x₂=1，x₃=3/4。 |
| II.5(a)(ii) | 5 / 8 | xₙ=3/(n+1); therefore f(xₙ)=3/(n+2). xₙ=3/(n+1)，因此 f(xₙ)=3/(n+2)。 |
| II.5(b) | 5 / 8 | Maximum √3/2 at x=√3. 在 x=√3 時取得最大值 √3/2。 |

### jm02-2026

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| 1(a) | 3 / 8 | △CMG≅△CMB≅△CMD by SSS. 由 SSS 得 △CMG≅△CMB≅△CMD。 |
| 1(b) | 3 / 8 | M∈plane BDG and CM⊥plane BDG. M∈平面 BDG，且 CM⊥平面 BDG。 |
| 1(c) | 3 / 8 | 4√3π/27 cubic units. 4√3π/27 立方單位。 |
| 2(a)(i) | 4 / 8 | f′=3x²−2x−1; f″=6x−2. f′=3x²−2x−1；f″=6x−2。 |
| 2(a)(ii) | 4 / 8 | Local maximum 5/27 at x=−1/3; local minimum −1 at x=1. x=−1/3 處局部極大值 5/27；x=1 處局部極小值 −1。 |
| 2(a)(iii) | 4 / 8 | Inflection point (1/3,−11/27). 拐點為 (1/3,−11/27)。 |
| 2(a)(iv) | 4 / 9 | The original generated plot shows the complete graph on [−2,2]. 下方自繪圖展示 [−2,2] 上的完整圖像。 |
| 2(a)(v) | 4 / 9 | The graph is even, with maxima at (±1,1) and endpoints (±2,−2). 圖像為偶對稱，極大點為 (±1,1)，端點為 (±2,−2)。 |
| 2(b) | 4 / 9 | 37/12 square units. 37/12 平方單位。 |
| 3(a) | 5 / 9 | a=√5; Q=(3√5/5,4√5/5). a=√5；Q=(3√5/5,4√5/5)。 |
| 3(b) | 5 / 10 | M=(6√5/5,−2√5/5). M=(6√5/5,−2√5/5)。 |
| 3(c) | 5 / 10 | tan∠QMF₁=4/3. tan∠QMF₁=4/3。 |
| 3(d) | 5 / 10 | Distance 12/5. 距離為 12/5。 |
| 4(a)(i) | 6 / 10 | Arguments π/6 and −π/6, both of modulus one. 幅角為 π/6、−π/6，模均為一。 |
| 4(a)(ii) | 6 / 10 | Four roots with arguments ±π/12 and ±11π/12. 四根的幅角為 ±π/12、±11π/12。 |
| 4(b)(i) | 6 / 10, 11 | The required product follows by pairing conjugate roots. 所求乘積由共軛根配對得出。 |
| 4(b)(ii) | 6 / 11 | cos(π/12)=√(2+√3)/2. cos(π/12)=√(2+√3)/2。 |
| 5(a) | 7 / 11 | (b−a)(c−a)(c−b)(a²+b²+c²+ab+ac+bc). (b−a)(c−a)(c−b)(a²+b²+c²+ab+ac+bc)。 |
| 5(b)(i) | 7 / 11 | (x,y,z)=(1+t,1−2t,t), t∈ℝ. (x,y,z)=(1+t,1−2t,t)，t∈ℝ。 |
| 5(b)(ii) | 7 / 11 | a=2, b=1, c=−6. a=2，b=1，c=−6。 |
| 5(b)(iii) | 7 / 11 | Exactly two triples, corresponding to the consistent upper and lower signs. 恰有兩組解，分別取一致的上方及下方符號。 |

### jm01-2025

Official multiple-choice key: ADACDECCBEEDBDB. All 15 questions retain 5 options.

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| I.1 | 2 / 5 | A: {−4,3}. A：{−4,3}。 |
| I.2 | 2 / 5 | D: 16. D：16。 |
| I.3 | 2 / 5 | A: increase 18.3%. A：增加 18.3%。 |
| I.4 | 2 / 5 | C: m−1, with m>0. C：m−1，且 m>0。 |
| I.5 | 2 / 5 | D: q−p−1. D：q−p−1。 |
| I.6 | 2 / 5 | E: (−1,2)∪(3,6). E：(−1,2)∪(3,6)。 |
| I.7 | 2 / 5 | C: 1440. C：1440。 |
| I.8 | 2 / 5 | C: 8. C：8。 |
| I.9 | 3 / 5 | B: 84. B：84。 |
| I.10 | 3 / 5 | E: 2√2. E：2√2。 |
| I.11 | 3 / 5 | E: 32. E：32。 |
| I.12 | 3 / 5 | D: 58/243. D：58/243。 |
| I.13 | 3 / 5 | B: −8. B：−8。 |
| I.14 | 3 / 5 | D: maximum 10. D：最大值 10。 |
| I.15 | 3 / 5 | B is the incorrect inequality. B 是不正確的不等式。 |
| II.1(a) | 4 / 6 | aₙ=2n+1; bₙ=2·3ⁿ⁻¹. aₙ=2n+1；bₙ=2·3ⁿ⁻¹。 |
| II.1(b) | 4 / 6 | Tₙ=2n·3ⁿ. Tₙ=2n·3ⁿ。 |
| II.2(a) | 4 / 6 | p=4, q=6, r=3. p=4，q=6，r=3。 |
| II.2(b) | 4 / 6 | The real roots are (−3±√3)/2. 實根為 (−3±√3)/2。 |
| II.3(a) | 4 / 6 | cos C=4/5. cos C=4/5。 |
| II.3(b) | 4 / 6 | sin(2B)=−7/25. sin(2B)=−7/25。 |
| II.4(a) | 4 / 6 | △DEG∼△DFE by AA. 由 AA 得 △DEG∼△DFE。 |
| II.4(b) | 4 / 6 | △DEF∼△BDE by AA. 由 AA 得 △DEF∼△BDE。 |
| II.4(c) | 4 / 7 | DG·DF=DB·EF. DG·DF=DB·EF。 |
| II.5(a) | 4 / 7 | Ellipse x²/8+y²/4=1 with the two vertices (±2√2,0) excluded under the literal slope condition. 軌跡為 x²/8+y²/4=1；按斜率條件的字面定義須排除兩頂點 (±2√2,0)。 |
| II.5(b) | 4 / 7 | Slope −1/(2k). 斜率為 −1/(2k)。 |

### jm02-2025

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| 1(a) | 3 / 8 | VM=√3a/2. VM=√3a/2。 |
| 1(b) | 3 / 8 | Volume √3a³/6. 體積為 √3a³/6。 |
| 1(c) | 3 / 8 | tan x=2√3/3. tan x=2√3/3。 |
| 1(d) | 3 / 8 | Total area [2+(√3+√7)/4]a². 總面積為 [2+(√3+√7)/4]a²。 |
| 2(a)(i) | 4 / 8 | x=1 and x=−2; −2 is a double root. x=1、−2，其中 −2 為二重根。 |
| 2(a)(ii) | 4 / 8 | f′=3x²+6x; f″=6x+6. f′=3x²+6x；f″=6x+6。 |
| 2(a)(iii) | 4 / 8, 9 | Local maximum 0 at x=−2; local minimum −4 at x=0. x=−2 處局部極大值為 0；x=0 處局部極小值為 −4。 |
| 2(a)(iv) | 4 / 9 | Inflection point (−1,−2). 拐點為 (−1,−2)。 |
| 2(a)(v) | 4 / 9 | The plotted cubic touches the axis at −2 and crosses at 1. 下圖在 −2 與 x 軸相切，在 1 穿過 x 軸。 |
| 2(b) | 4 / 9 | Area 27/2. 面積為 27/2。 |
| 3(a) | 5 / 9 | y=x−1. y=x−1。 |
| 3(b) | 5 / 9 | F₁=(1,0), F₂=(−1,0). F₁=(1,0)，F₂=(−1,0)。 |
| 3(c) | 5 / 9, 10 | a=√2, b=1; ellipse x²/2+y²=1. a=√2、b=1；橢圓為 x²/2+y²=1。 |
| 3(d) | 5 / 10 | m=±√3. m=±√3。 |
| 4(a) | 6 / 10 | z=−1±√3i. z=−1±√3i。 |
| 4(b) | 6 / 10 | For z=−1±√3i, z²⁰²⁴=−2²⁰²³(1±√3i), using matching signs. 若 z=−1±√3i，則 z²⁰²⁴=−2²⁰²³(1±√3i)，取相同對應符號。 |
| 4(c) | 6 / 10 | The required identity holds; n/2 is an integer and sin(θ/2)≠0. 恆等式成立；n/2 為整數，且 sin(θ/2)≠0。 |
| 4(d) | 6 / 10, 11 | Eleven solutions: kπ/3 (k=1,…,5) and 2mπ/7 (m=1,…,6). 共十一解：kπ/3（k=1,…,5）及 2mπ/7（m=1,…,6）。 |
| 5(a)(i) | 7 / 11 | \|C\|=(a+b+c)[(a−b)²+(b−c)²+(c−a)²]. \|C\|=(a+b+c)[(a−b)²+(b−c)²+(c−a)²]。 |
| 5(a)(ii) | 7 / 11 | All triples (r,s,−r−s), together with all triples (r,r,r). 所有 (r,s,−r−s)，以及所有 (r,r,r)。 |
| 5(b)(i) | 7 / 12 | Unique solution exactly when k≠0 and k≠1. 恰在 k≠0 且 k≠1 時有唯一解。 |
| 5(b)(ii) | 7 / 12 | k=0 requires p+q=4; k=1 requires p+q=6, with the parameterisations above. k=0 須 p+q=4；k=1 須 p+q=6，通解如上。 |

### jm01-2024

Official multiple-choice key: BBCCDADACEBCABE. All 15 questions retain 5 options.

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| I.1 | 2 / 5 | B: a=−6. B：a=−6。 |
| I.2 | 2 / 5 | B: 1. B：1。 |
| I.3 | 2 / 5 | C: y decreases by 2. C：y 減少 2。 |
| I.4 | 2 / 5 | C: 176. C：176。 |
| I.5 | 2 / 5 | D. D。 |
| I.6 | 2 / 5 | A: 1. A：1。 |
| I.7 | 2 / 5 | D: 262144. D：262144。 |
| I.8 | 2 / 5 | A: 4. A：4。 |
| I.9 | 3 / 5 | C. C。 |
| I.10 | 3 / 5 | E: 5. E：5。 |
| I.11 | 3 / 5 | B: 16/3. B：16/3。 |
| I.12 | 3 / 5 | C. C。 |
| I.13 | 3 / 5 | A. A。 |
| I.14 | 3 / 5 | B: 47. B：47。 |
| I.15 | 3 / 5 | E. E。 |
| II.1(a) | 4 / 6 | Probability 1/3. 概率為 1/3。 |
| II.1(b) | 4 / 6 | Expected count 6/5. 期望件數為 6/5。 |
| II.2(a) | 4 / 6 | tan(α+β)=1. tan(α+β)=1。 |
| II.2(b) | 4 / 6 | √26/26. √26/26。 |
| II.3(a) | 4 / 6 | aₙ=3 or aₙ=6n−3. aₙ=3 或 aₙ=6n−3。 |
| II.3(b) | 4 / 6 | No positive n for aₙ=3; least n=6 for aₙ=6n−3. aₙ=3 時不存在；aₙ=6n−3 時最小 n=6。 |
| II.4(a) | 4 / 6 | x∈[1,9]. x∈[1,9]。 |
| II.4(b) | 4 / 6, 7 | a=10±2√2. a=10±2√2。 |
| II.5(a) | 4 / 7 | x²/2−y²/3=1. x²/2−y²/3=1。 |
| II.5(b) | 4 / 7 | m=±2√3. m=±2√3。 |

### jm02-2024

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| 1(a) | 3 / 8 | DA⊥PC. DA⊥PC。 |
| 1(b) | 3 / 8 | Volume √3/3. 體積為 √3/3。 |
| 1(c) | 3 / 8 | Cosine √7/7. 餘弦為 √7/7。 |
| 2(a)(i) | 4 / 8 | V²=π²(x⁴−x⁶)/9, 0≤x≤1. V²=π²(x⁴−x⁶)/9，0≤x≤1。 |
| 2(a)(ii) | 4 / 8 | Local maximum 4π²/243 at x=√6/3; no local minimum on (0,1). x=√6/3 處局部極大值為 4π²/243；(0,1) 內無局部極小值。 |
| 2(a)(iii) | 4 / 8 | Inflection point (√10/5,4π²/375). 拐點為 (√10/5,4π²/375)。 |
| 2(a)(iv) | 4 / 9 | The plot shows the full domain, maximum, and inflection. 圖示完整定義域、極大點及拐點。 |
| 2(a)(v) | 4 / 9 | Maximum volume 2√3π/27 m³. 最大體積為 2√3π/27 立方米。 |
| 2(b) | 4 / 9 | k=√2. k=√2。 |
| 3(a) | 5 / 9 | (m²−4)x²−2√5m²x+5m²+4=0. (m²−4)x²−2√5m²x+5m²+4=0。 |
| 3(b) | 5 / 9 | All real m except ±2. 所有實數 m，±2 除外。 |
| 3(c) | 5 / 9, 10 | m=±2√11/11. m=±2√11/11。 |
| 3(d) | 5 / 10 | Area 20√6. 面積為 20√6。 |
| 4(a)(i) | 6 / 10 | Modulus √2, principal argument −π/12. 模為 √2，主幅角為 −π/12。 |
| 4(a)(ii) | 6 / 10 | 4096√3−4096i. 4096√3−4096i。 |
| 4(b) | 6 / 10 | Both power formulae and the product identity follow. 兩個冪公式及乘積恆等式均得證。 |
| 4(c) | 6 / 11 | α=nπ/2, n∈ℤ. α=nπ/2，n∈ℤ。 |
| 5(a) | 7 / 11 | (a+b+c)(a²+b²+c²−ab−bc−ca). (a+b+c)(a²+b²+c²−ab−bc−ca)。 |
| 5(b)(i) | 7 / 11 | k≠±3. k≠±3。 |
| 5(b)(ii) | 7 / 11 | (x,y,z)=(1−2t,t,t), t∈ℝ. (x,y,z)=(1−2t,t,t)，t∈ℝ。 |
| 5(c) | 7 / 11 | Maximum a=3, attained only at (−1,1,1). a 最大為 3，只在 (−1,1,1) 達到。 |

### jm01-2023

Official multiple-choice key: EDCCDCDAEBAEABE. All 15 questions retain 5 options.

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| I.1 | 2 / 5 | E: [4,6). E：[4,6)。 |
| I.2 | 2 / 5 | D: 7. D：7。 |
| I.3 | 2 / 5 | C: 3/4. C：3/4。 |
| I.4 | 2 / 5 | C: {−1,4}. C：{−1,4}。 |
| I.5 | 2 / 5 | D: a=−3/7 or 3/5. D：a=−3/7 或 3/5。 |
| I.6 | 2 / 5 | C: −160. C：−160。 |
| I.7 | 2 / 5 | D: a≥−1/2. D：a≥−1/2。 |
| I.8 | 2 / 5 | A: −1/12<x<1/12. A：−1/12<x<1/12。 |
| I.9 | 3 / 5 | E: 32/27 m. E：32/27 米。 |
| I.10 | 3 / 5 | B: −82. B：−82。 |
| I.11 | 3 / 5 | A. A。 |
| I.12 | 3 / 5 | E: 8. E：8。 |
| I.13 | 3 / 5 | A. A。 |
| I.14 | 3 / 5 | B: a=−2, b=2. B：a=−2、b=2。 |
| I.15 | 3 / 5 | E: (3,−5). E：(3,−5)。 |
| II.1(a) | 4 / 6 | Probability (13/4)(3/4)⁹. 概率為 (13/4)(3/4)⁹。 |
| II.1(b) | 4 / 6 | 3⁹/4¹⁰. 3⁹/4¹⁰。 |
| II.1(c) | 4 / 6 | (3/4)⁹. (3/4)⁹。 |
| II.2(a) | 4 / 6 | F=(0,1). F=(0,1)。 |
| II.2(b) | 4 / 6 | AB=25/4. AB=25/4。 |
| II.2(c) | 4 / 6 | CD=8√2. CD=8√2。 |
| II.3(a) | 4 / 6 | k=3/2; aₙ=2·3ⁿ. k=3/2；aₙ=2·3ⁿ。 |
| II.3(b) | 4 / 6 | Tₙ=(1−3⁻ⁿ)/4+n+n(n+1)log₂3/2. Tₙ=(1−3⁻ⁿ)/4+n+n(n+1)log₂3/2。 |
| II.3(c) | 4 / 6 | n=2; the maximum is 4/81. n=2；最大值為 4/81。 |
| II.4(a) | 4 / 6 | w=±1/3; the official answer selects the positive branch. w=±1/3；官方答案選用正分支。 |
| II.4(b) | 4 / 7 | sin A=(√5−1)/2. sin A=(√5−1)/2。 |
| II.5(a) | 4 / 7 | The closed triangle with vertices (2,7/2), (5,13/2), (5,−1). 頂點 (2,7/2)、(5,13/2)、(5,−1) 所圍的閉三角形。 |
| II.5(b) | 4 / 7 | −1/5≤z≤7/4. −1/5≤z≤7/4。 |
| II.5(c) | 4 / 7 | Minimum 13 at (3,2). 在 (3,2) 最小值為 13。 |

### jm02-2023

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| 1(a) | 3 / 8 | cos∠DFE=√3/4. cos∠DFE=√3/4。 |
| 1(b) | 3 / 8 | EG⊥plane ABCD. EG 垂直面 ABCD。 |
| 1(c) | 3 / 8 | AE=√13. AE=√13。 |
| 2(a)(i) | 4 / 8 | f′=3x²−12, f″=6x. f′=3x²−12、f″=6x。 |
| 2(a)(ii) | 4 / 8 | Maximum 22 at x=−2; minimum −10 at x=2. x=−2 處局部極大值 22；x=2 處局部極小值 −10。 |
| 2(a)(iii) | 4 / 8 | Inflection point (0,6). 拐點為 (0,6)。 |
| 2(a)(iv) | 4 / 9 | The plot marks all required features; the curve continues beyond the viewing window. 圖中標示所有所需特徵；曲線在視窗外繼續延伸。 |
| 2(b)(i) | 4 / 9 | A=(−2,2). A=(−2,2)。 |
| 2(b)(ii) | 4 / 9 | Area 27/4. 面積為 27/4。 |
| 3(a)(i) | 5 / 9 | The stated condition is necessary and sufficient. 所述條件為充要條件。 |
| 3(a)(ii) | 5 / 9 | Sum 2hk/(h²−9); product (k²−4)/(h²−9). 根和 2hk/(h²−9)；根積 (k²−4)/(h²−9)。 |
| 3(b) | 5 / 9 | The full circle x²+y²=13. 完整圓 x²+y²=13。 |
| 3(c) | 5 / 10 | α=arctan(2√13/7). α=arctan(2√13/7)。 |
| 4(a) | 6 / 10 | z=3+4i. z=3+4i。 |
| 4(b)(i) | 6 / 10 | The sine/cosine identities hold for all θ; the tangent identity requires defined denominators. 正弦、餘弦恆等式對所有 θ 成立；正切式須分母有定義。 |
| 4(b)(ii) | 6 / 10 | tan(−2π/9), tan(π/9), tan(4π/9). tan(−2π/9)、tan(π/9)、tan(4π/9)。 |
| 5(a)(i) | 7 / 11 | Both identities follow by addition-formula cancellation. 由和角公式相減，兩恆等式均得證。 |
| 5(a)(ii) | 7 / 11 | D=−4sinθ sin2θ sin3θ. D=−4sinθ sin2θ sin3θ。 |
| 5(b) | 7 / 11 | θ=π/3; (x,y,z)=(4−t,2,t), t∈ℝ. θ=π/3；(x,y,z)=(4−t,2,t)，t∈ℝ。 |

### jm01-2022

Official multiple-choice key: BCEBDAADDABECCE. All 15 questions retain 5 options.

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| I.1 | 2 / 5 | B. B。 |
| I.2 | 2 / 5 | C. C。 |
| I.3 | 2 / 5 | E: −6. E：−6。 |
| I.4 | 2 / 5 | B: 2−√3. B：2−√3。 |
| I.5 | 2 / 5 | D: p≥−9/7. D：p≥−9/7。 |
| I.6 | 2 / 5 | A: 2. A：2。 |
| I.7 | 2 / 5 | A: 84−48√3. A：84−48√3。 |
| I.8 | 2 / 5 | D: 37/64. D：37/64。 |
| I.9 | 3 / 5 | D: region IV. D：區域 IV。 |
| I.10 | 3 / 5 | A: (0,7/2). A：(0,7/2)。 |
| I.11 | 3 / 5 | B: 5200. B：5200。 |
| I.12 | 3 / 5 | E: m=2. E：m=2。 |
| I.13 | 3 / 5 | C: 3/5. C：3/5。 |
| I.14 | 3 / 5 | C: x=0. C：x=0。 |
| I.15 | 3 / 5 | E: n=√3 or 2√3. E：n=√3 或 2√3。 |
| II.1(a) | 4 / 6 | a=1, b=−4, c=−5. a=1、b=−4、c=−5。 |
| II.1(b) | 4 / 6 | y=(x+1)²−6. y=(x+1)²−6。 |
| II.1(c) | 4 / 6 | Maximum 16; minimum −9. 最大值 16；最小值 −9。 |
| II.2(a) | 4 / 6 | aₙ=4¹⁻ⁿ; bₙ=n/4ⁿ. aₙ=4¹⁻ⁿ；bₙ=n/4ⁿ。 |
| II.2(b) | 4 / 6 | Sₙ=4(1−4⁻ⁿ)/3; Tₙ=4/9−(3n+4)/(9·4ⁿ). Sₙ=4(1−4⁻ⁿ)/3；Tₙ=4/9−(3n+4)/(9·4ⁿ)。 |
| II.3(a) | 4 / 7 | x²/16+y²/32=1. x²/16+y²/32=1。 |
| II.3(b) | 4 / 7 | k₁k₂=−2. k₁k₂=−2。 |
| II.4(a) | 4 / 7 | 2cos(θ+π/6), range [−2,2]. 2cos(θ+π/6)，值域 [−2,2]。 |
| II.4(b) | 4 / 7 | θ=π/2 or 7π/6. θ=π/2 或 7π/6。 |
| II.4(c) | 4 / 7 | √10/4. √10/4。 |
| II.5 | 4 / 8 | Divisible by 14 for every positive integer n. 對所有正整數 n 均可被 14 整除。 |

### jm02-2022

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| 1(a) | 3 / 8 | AC=3/2. AC=3/2。 |
| 1(b)(i) | 3 / 8 | ∠CDE=π/2. ∠CDE=π/2。 |
| 1(b)(ii) | 3 / 8 | ∠CDB=arccos(−1/√10). ∠CDB=arccos(−1/√10)。 |
| 1(c) | 3 / 8 | Dihedral angle arctan√5. 二面角為 arctan√5。 |
| 2(a)(i) | 4 / 9 | x=1, 1−√3, 1+√3. x=1、1−√3、1+√3。 |
| 2(a)(ii) | 4 / 9 | f′=3x²−6x; f″=6x−6. f′=3x²−6x；f″=6x−6。 |
| 2(a)(iii) | 4 / 9 | Local maximum 2 at x=0; local minimum −2 at x=2. x=0 處局部極大值 2；x=2 處局部極小值 −2。 |
| 2(a)(iv) | 4 / 9 | Inflection point (1,0). 拐點為 (1,0)。 |
| 2(a)(v) | 4 / 9 | The plot contains all requested features and continues beyond the window. 圖示包含所有所求特徵，並延伸至視窗外。 |
| 2(b) | 4 / 9 | Area 64/3. 面積為 64/3。 |
| 3(a) | 5 / 10 | Exactly the parabola y²=4x. 恰為拋物線 y²=4x。 |
| 3(b) | 5 / 10 | ab=1. ab=1。 |
| 3(c)(i) | 5 / 10 | P=(4/m²,4/m). P=(4/m²,4/m)。 |
| 3(c)(ii) | 5 / 10 | Tangent slope m/2. 切線斜率 m/2。 |
| 3(c)(iii) | 5 / 10 | m=2±√2. m=2±√2。 |
| 4(a)(i) | 6 / 11 | x−2y+2=0. x−2y+2=0。 |
| 4(a)(ii) | 6 / 11 | The marked points and full perpendicular-bisector line are shown. 圖示標記兩點及完整垂直平分線。 |
| 4(a)(iii) | 6 / 11 | Minimum √5 at z=4+3i. z=4+3i 時最小值 √5。 |
| 4(b)(i) | 6 / 11 | ω⁷=1; the seven-term sum is zero. ω⁷=1；七項和為零。 |
| 4(b)(ii) | 6 / 11 | The identity holds for every positive integer n. 恆等式對每個正整數 n 成立。 |
| 4(b)(iii) | 6 / 11 | 5/4. 5/4。 |
| 5(a) | 7 / 12 | (a−b)(b−c)(c−a)(a+b+c). (a−b)(b−c)(c−a)(a+b+c)。 |
| 5(b)(i) | 7 / 12 | p∈ℝ∖{1,−2}, for any q. 任何 q 下，p∈ℝ∖{1,−2}。 |
| 5(b)(ii) | 7 / 12 | For (p,q)=(1,1): (1−s−t,s,t). For (−2,1): (1+t,t,t). No other multiple-solution cases. (p,q)=(1,1)：(1−s−t,s,t)；(−2,1)：(1+t,t,t)。沒有其他多解情況。 |

### jm01-2021

Official multiple-choice key: BEABBACDCABEDAC. All 15 questions retain 5 options.

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| I.1 | 2 / 5 | B: 3 elements. B：3 個元素。 |
| I.2 | 2 / 5 | E: 60/7 hours. E：60/7 小時。 |
| I.3 | 2 / 5 | A: 19. A：19。 |
| I.4 | 2 / 5 | B: m>√3. B：m>√3。 |
| I.5 | 2 / 5 | B: 7x²−3x+2=0. B：7x²−3x+2=0。 |
| I.6 | 2 / 5 | A: 31−8π cm². A：31−8π cm²。 |
| I.7 | 2 / 5 | C: −3≤k<0 is the exact range. C：−3≤k<0 為確切範圍。 |
| I.8 | 2 / 5 | D: 4. D：4。 |
| I.9 | 2 / 5 | C: the tens digit is 4. C：十位數字為 4。 |
| I.10 | 3 / 5 | A: x=1/4 or 2. A：x=1/4 或 2。 |
| I.11 | 3 / 5 | B: y=3+2cos 2x. B：y=3+2cos 2x。 |
| I.12 | 3 / 5 | E: 3x+y−4=0. E：3x+y−4=0。 |
| I.13 | 3 / 5 | D: mean 10, variance 1. D：平均數 10，方差 1。 |
| I.14 | 3 / 5 | A: 68−2√1155. A：68−2√1155。 |
| I.15 | 3 / 5 | C: 80/9. C：80/9。 |
| II.1(a) | 4 / 6 | 2/7. 2/7。 |
| II.1(b) | 4 / 6 | 1/210. 1/210。 |
| II.2(a) | 4 / 6 | (x−4)²+(y−4)²=16/5. (x−4)²+(y−4)²=16/5。 |
| II.2(b) | 4 / 6 | m=1/2. m=1/2。 |
| II.3(a) | 4 / 7 | (1−m²)y²=a²−(x−my)². (1−m²)y²=a²−(x−my)²。 |
| II.3(b) | 4 / 7 | The maximum occurs when x=my, equivalently y=x/m. 最大值在 x=my，即 y=x/m 時取得。 |
| II.3(c) | 4 / 7 | x=m\|a\|/√(1−m²). x=m\|a\|/√(1−m²)。 |
| II.4(a) | 4 / 7 | aₙ=2n−1. aₙ=2n−1。 |
| II.4(b) | 4 / 7 | n=10. n=10。 |
| II.5(a) | 4 / 7 | sin²C=2/3. sin²C=2/3。 |
| II.5(b) | 4 / 7 | Area =25√2/2. 面積為 25√2/2。 |

### jm02-2021

| Part | Question / answer PDF page | Independent result |
|---|---|---|
| 1(a)(i) | 3 / 8, 13 | Area √6. 面積為 √6。 |
| 1(a)(ii) | 3 / 8, 13 | Volume 2/3; distance √(2/3). 體積為 2/3；距離為 √(2/3)。 |
| 1(b)(i) | 3 / 8, 13 | CB⊥plane PAB. CB 垂直面 PAB。 |
| 1(b)(ii) | 3 / 8, 13 | ADMN is a rectangle; DM∥plane PAB. ADMN 為長方形；DM 平行面 PAB。 |
| 2(a)(i) | 4 / 8, 13 | f′(x)=6x²−18x+12; f″(x)=12x−18. f′(x)=6x²−18x+12；f″(x)=12x−18。 |
| 2(a)(ii) | 4 / 8, 13 | Local maximum 0 at x=1; local minimum −1 at x=2. x=1 處局部極大值為0；x=2 處局部極小值為−1。 |
| 2(a)(iii) | 4 / 8, 13 | Inflection point (3/2,−1/2). 拐點為 (3/2,−1/2)。 |
| 2(a)(iv) | 4 / 9, 14 | The plotted cubic is restricted to [−1,3], with the listed key points. 圖中三次曲線限制於 [−1,3]，並標示上述關鍵點。 |
| 2(a)(v) | 4 / 9, 14 | The plotted reflected-and-shifted curve has a corner at (0,−6). 圖中對稱再下移的曲線在 (0,−6) 有尖角。 |
| 2(b) | 4 / 9, 14 | Total area 16. 總面積為16。 |
| 3(a) | 5 / 9, 14 | c=−2m². c=−2m²。 |
| 3(b)(i) | 5 / 9, 14 | A=(2(m₁+m₂),2m₁m₂). A=(2(m₁+m₂),2m₁m₂)。 |
| 3(b)(ii) | 5 / 10, 15 | The full straight line y=−2. 完整直線 y=−2。 |
| 3(b)(iii) | 5 / 10, 15 | A=(−2,−12) or (14/3,4/3). A=(−2,−12) 或 (14/3,4/3)。 |
| 4(a) | 6 / 10, 15 | The sum-to-product identity follows. 和化積恆等式得證。 |
| 4(b) | 6 / 10, 15 | The identity is proved whenever A+B+C=π. A+B+C=π 時，恆等式得證。 |
| 4(c)(i) | 6 / 11, 16 | The identity holds for all n≥1 and every real x. 此式對所有 n≥1 及每個實數 x 成立。 |
| 4(c)(ii) | 6 / 11, 16 | x=jπ/6 for j=1,2,3,4,5,7,8,9,10,11. x=jπ/6，j=1、2、3、4、5、7、8、9、10、11。 |
| 5(a) | 7 / 11, 16 | D=(a−b)(b−c)(c−a)(ab+bc+ca−1). D=(a−b)(b−c)(c−a)(ab+bc+ca−1)。 |
| 5(b)(i) | 7 / 11, 16 | All real k except −1 and 2. 所有實數 k，但排除−1及2。 |
| 5(b)(ii) | 7 / 12, 17 | p−q+r=0; for the specified values, (x,y,z)=(3+t,−1−t,t), t∈ℝ. p−q+r=0；指定值的解為 (x,y,z)=(3+t,−1−t,t)，t∈ℝ。 |

## Reproduction boundaries

The fetch script follows the fixed official manifest and checks PDF signatures before writing scratch copies. Re-fetching may discover a changed upstream PDF; compare its hash rather than silently treating a different file as the reviewed source. The local corpus does not require a network request during normal website builds.
