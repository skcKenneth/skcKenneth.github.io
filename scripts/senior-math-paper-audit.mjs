import {writeFile} from 'node:fs/promises';
import {examPapers} from '../src/data/senior-math/papers.mjs';
import {officialPaperInventory} from '../src/data/senior-math/paper-inventory.mjs';
const cell=s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ');
const complete=examPapers.filter(p=>p.status==='complete');
const lines=[
'# Official JAE mathematics paper solution audit',
'',
'Verification date: **2026-10-03**. This is a content/source ledger, not a deployment record.',
'',
`Current corpus: **${complete.length}/12 complete papers; ${complete.reduce((n,p)=>n+p.questions.length,0)} independently authored item/subpart solutions**. The release command below refuses an incomplete set.`,
'',
'## Scope and provenance',
'',
'The archive covers 2021–2026, both JM01 (standard paper) and JM02 (supplementary paper). Every JM01 multiple-choice item and every written subpart is retained. Every JM02 question is solved, including all five questions although the examination instructs candidates to choose three. No school workbook adaptation is presented as an official item.',
'',
'Official discovery indices: [MUST JAE syllabus and papers](https://www.must.edu.mo/page/jae.syllabus.html?locale=zh_CN), [UTM JAE syllabus and papers](https://www.utm.edu.mo/admission/tc/undergraduate_programmes/joint-admission-examination/jae-syllabus-and-past-examination-papers/index.html). The exact verified PDF URLs and SHA-256 fingerprints are listed below and fixed in `src/data/senior-math/paper-source-manifest.mjs`.',
'',
'The site supplies short question summaries, necessary mathematical expressions, independently written Traditional Chinese/English explanations, two progressive hints, worked steps, final results and common-error notes. The official PDFs remain external links. Downloaded PDFs, extracted text and diagnostic page renders are confined to private scratch `.tmp/senior-math/papers/` (excluded from staging and publication); no full official paper or full-page scan is published by this feature. Diagrams in the teaching data are newly authored mathematical SVGs.',
'',
'Page references always mean **one-based PDF pages**, not an inferred printed page number. Mathematical extraction was visually checked where symbols, fractions, powers or graphics were ambiguous. In particular, the 2022 JM02 embedded-font text is unusable for many formulae; its question pages 3–7 and answer pages 8–12 were read visually.',
'',
'## Verification contract',
'',
'A paper is marked `complete` only after all its items/subparts have independent derivations compared with its official suggested answers. An official error or incomplete condition is explained explicitly instead of copied into the solution. The ledger below records the exact part label, question/answer page and independently obtained result. The full derivations and conditions are in the corresponding `paper-jm01-YYYY.mjs` / `paper-jm02-YYYY.mjs` module.',
'',
'`paper-inventory.mjs` is a separate transcription of the source item labels and multiple-choice keys. It is not generated from the authored question arrays. The checker compares those two representations, checks all five JM02 top-level questions, exact option counts, unique IDs, bilingual fields, two hints, source page bounds, strict KaTeX and safe SVG structure. The 2022 duplicated printed Q4(b)(ii) label is normalised to (iii) with a visible source note.',
'',
'Independent computational checks supplement the mathematical derivations: exhaustive Bernoulli samples and finite selection counts; finite sequence sums and integer divisibility; determinant identities over parameter grids; direct substitution of roots and parameterised solutions; exact-value trigonometric checks; geometric lengths, perpendicularity and areas; derivative critical values; and independently evaluated integral antiderivatives. These checks do not claim to replace a human proof audit or establish correctness merely from schema validity.',
'',
'```powershell',
'node scripts/senior-math-paper-check.mjs          # authoring diagnostic',
'node scripts/senior-math-paper-check.mjs --full   # requires all 12 complete papers',
'node scripts/senior-math-paper-audit.mjs          # regenerate this ledger from reviewed data',
'```',
'',
'## Coverage and official originals',
'',
'| Paper | Status | MC / written top-level | Leaf items | Question PDF pages | Answer PDF pages | Official original |',
'|---|---|---:|---:|---|---|---|',
...examPapers.map(p=>`| ${p.id} | ${p.status} | ${p.inventory?`${p.inventory.choice} / ${p.inventory.writtenTopLevel}`:'pending'} | ${p.questions.length} | ${p.inventory?.questionPdfPages.join(', ')||'pending'} | ${p.inventory?.answerPdfPages.join(', ')||'pending'} | [PDF](${p.url}) |`),
'',
'| Paper | SHA-256 of the verified source PDF | Source PDF pages |',
'|---|---|---:|',
...examPapers.map(p=>`| ${p.id} | ${p.sha256} | ${officialPaperInventory[p.id]?.pdfPages??'pending'} |`),
'',
'## Source discrepancies and interpretation notes',
'',
...complete.flatMap(p=>p.questions.filter(q=>q.sourceDiscrepancy).map(q=>`- **${p.id} ${q.source.question}** (question PDF ${q.source.pdfPage}, answer PDF ${q.source.answerPdfPage}): ${q.sourceDiscrepancy.en} ${q.sourceDiscrepancy.zh}`)),
'',
'Additional condition checks retained in the solutions: 2021 JM01 II.3 uses |a| because the printed parameter sign is not specified; 2023 JM01 II.2(c) uses the diagram’s M-between-C-and-D condition; 2023 JM02 ellipse tangent loci separately restore vertical/horizontal tangent cases; 2025 JM02 the sine-sum solution checks θ=π separately from the preceding identity’s restricted domain. Candidate answers introduced by squaring are checked against original signs and domains.',
'',
'## Item-by-item independent result ledger',
'',
'The MC letter is compared to the official answer key. Written results below are the authored conclusions after comparison with the suggested answers; any deviation or repair is covered by the discrepancy notes above. Proof questions retain their complete argument in the module, not merely this short result.',
];
for(const p of examPapers){
 lines.push('',`### ${p.id}`,'');
 if(p.status!=='complete'){lines.push('Authoring remains incomplete; no completion claim is made.');continue;}
 const raw=officialPaperInventory[p.id];
 if(raw?.answerKey)lines.push(`Official multiple-choice key: ${raw.answerKey}. All ${p.inventory.choice} questions retain ${p.inventory.optionCounts[0]} options.`,'');
 lines.push('| Part | Question / answer PDF page | Independent result |','|---|---|---|');
 for(const q of p.questions)lines.push(`| ${cell(q.source.question)} | ${q.source.pdfPage} / ${q.answerPdfPages?.join(', ')||q.source.answerPdfPage} | ${cell(q.result.en)} ${cell(q.result.zh)} |`);
}
lines.push('','## Reproduction boundaries','','The fetch script follows the fixed official manifest and checks PDF signatures before writing scratch copies. Re-fetching may discover a changed upstream PDF; compare its hash rather than silently treating a different file as the reviewed source. The local corpus does not require a network request during normal website builds.','');
await writeFile(new URL('../docs/senior-math-papers.md',import.meta.url),lines.join('\n'),'utf8');
console.log(JSON.stringify({papers:complete.length,items:complete.reduce((n,p)=>n+p.questions.length,0),ledger:'docs/senior-math-papers.md'}));
