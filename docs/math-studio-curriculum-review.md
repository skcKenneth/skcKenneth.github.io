# Practice expansion source review

Reference materials are the user's scanned PDFs. Cover/first-page inventory checked for all 18 attachments; representative interior pages inspected visually, not fully transcribed.

- 同步學練測(第一二章).pdf PDF p.15 (printed pp.26–27): calculation strategies, telescoping fractions, signed quantities, sequential balance reasoning.
- 同步學練測(第五章).pdf PDF p.10 (printed pp.102–103): discount, cost, profit and multi-stage applications; A/B/C progression.
- 提能集訓（上學期）.pdf PDF p.5 (printed pp.8–9): geometric proof/transfer, coefficient comparison, algebraic invariance and contextual area.
- 提能集訓（下學期）.pdf PDF p.8 (printed p.7): function domain, table/graph interpretation, multi-stage charging models.
- First-page samples in 同步學練測 chapters 3,4,6, 八年級全效學習（上學期）, 課堂導學 chapters 1–6 and 八上: graded procedural/conceptual exercises and diagrams.

Implementation uses original, independently solved exercises and controlled parameter variants based on these skill categories. No claim that the full uploaded question corpus or answer booklet has been digitized. Senior exercises are based on the previously verified textbook/syllabus, as these new workbooks are junior-secondary materials.

Coverage: all 38 existing lessons; numerical generation, explanation-choice, and written reasoning/proofs. Exact variants are fingerprinted by normalized question statement, independent of choice order. Browser history is device-local; exhaustion permits the least recently displayed variants and is disclosed.

## Pedagogical sources and original adaptations

- McTighe, J., & Wiggins, G. (2012). Understanding by Design Framework. ASCD, pp.1–6. https://files.ascd.org/staticfiles/ascd/pdf/siteASCD/publications/UbD_WhitePaper0312.pdf
  Alignment of desired results, assessment evidence and learning plan; understanding and transfer, performance tasks plus other evidence.
- International Platform for School as Learning Community. About us. https://school-lc.com/about-us/ (accessed 2026-09-19). Student collaboration, teacher collegiality/lesson study, parent participation, publicness, democracy and excellence; a whole-school approach.
- Saito, E. (2022). Issues of Practising Lesson Study for Learning Community in Vietnam. Vietnam Journal of Education, 6(Special Issue), 70–78. https://doi.org/10.52296/vje.2022.179 . Publisher article/abstract: https://jcepp.org/index.php/journal/article/view/179 . Warns against construing LSLC as a technique change, demonstration lesson or one-day event.

The 12 unit scenarios, predictions, parameter comparisons, dialogue stems, local evidence recorder, transfer tasks, rubrics and teacher observation fields are original design adaptations. Group size and rotating roles are optional website scaffolds, not attributed prescriptions. No claim of experimental validation of this website. Collaboration here means classroom use; no live multi-user service.

## Initial release validation (historical)

`node scripts/validate-math-studio.cjs`: 38 lesson pools, 304 prompt families, 12,342 unique prompts (including controlled numeric variants), 38 written reasoning tasks, 12 inquiry units. Each chapter/difficulty can provide a 15-question set. All numerical answers are finite and accepted at stated precision; choice options are unique and shuffled answer indices retain the correct option. Scope selection, within-set uniqueness, unseen-first selection, exhausted pool reporting, local history across reload, malformed/denied storage, numeric/choice/written delegated handlers and inquiry recording/persistence are checked. Domain-sensitive geometry, quadratic signs, zero-coefficient equations, triangular boundaries, and slider endpoint SVG values have additional checks.

Plain static project, managed-linux profile; no supported browser preview was available. DOM rendering and interaction logic tested using a VM DOM harness, not a real-browser visual or accessibility audit.

The historical counts and per-scope 15-question statement above describe the initial release. The subsequent learning-support release enforces challenge-family caps and explicitly reports shortages in unexpanded chapters. See [the current content, test, and review contract](math-studio-learning-support.md).
