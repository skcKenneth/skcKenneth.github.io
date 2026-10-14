# Guided practice acceptance

The pilot contains seven original fixed lessons: two Year 7 equation lessons,
two Year 8 angle-bisector lessons and three Year 8 reflection-symmetry lessons.
Each lesson contains 16 questions (one worked, one guided, two prerequisite,
four independent, two exit, four supplementary and two extension questions).
The ordinary and inquiry routes select from those same authored instances.
No paper response, score, learner identity or answer-reveal state is persisted.

## Reproducible checks

Run the source gate from the repository root:

```powershell
node --test tests/guided-practice.test.mjs
```

After building the frozen `dist` directory, run the actual browser gate with its
own read-only localhost server:

```powershell
node scripts/guided-practice-browser-qa.mjs --serve dist --output .tmp/guided-practice-browser-final
& 'C:\Users\kenneth\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts/guided-practice-pdf-audit.py .tmp/guided-practice-browser-final
```

`QA_BROWSER_EXECUTABLE` can select another installed Chromium-family executable.
The default is the installed Playwright Chromium headless shell. The browser
starts disposable contexts and uses only synthetic legacy records. `QA_CASES`
can narrow a diagnostic run; a complete acceptance run must include every case.
The PDF audit expects the complete 42-document manifest, not a partial run.
Use `--base <origin>` instead of `--serve dist` to verify an existing server or a
published release. The report records the actual origin in either mode.

## Evidence and boundaries

- Source checks solve the displayed Year 7 equations with an independent parser,
  compare them with the coefficients, substitute the computed solution, and
  evaluate the authored arithmetic checks. Geometry checks use theorem conditions,
  lengths and actual coordinate reflections rather than answer-string equality.
- Browser checks exercise teacher navigation, layered reveal, route changes,
  reload, projection, student/teacher exports, and real native chapter links.
  All seven packs are checked at 390 × 844 in both languages, including actual
  global language clicks that retain the inquiry route, and native select keyboard
  behavior without unintended question navigation.
  A held native writer lock forces overlapping classroom additions in two tabs;
  title and order changes must propagate through real storage events.
- Well-formed unknown legacy records, original whitespace, and deliberately
  malformed old stores must remain byte-for-byte unchanged during presentation,
  printing and export. The existing unified backup must restore the saved
  classroom sequence in a fresh context. No new practice store is introduced.
- Chromium generates all 42 bilingual PDFs after the teacher has revealed the
  screen answers: 14 blank core sheets, 14 full teacher references and 14 separate
  supplementary sheets. Blank core sheets must have exactly two physical A4 pages.
  Teacher references and supplementary sheets may require additional pages.
  The harness clears media overrides before each PDF; its print-preview checks
  restore the browser default rather than forcing screen media on later prints.
- The PDF audit checks physical size, nonblank pages, prompt survival, required
  first/second-page grouping, answer visibility, English text and glyph bounds.
  PDFium renders every page for visual review, independently of Chromium's screen
  screenshot. Text extraction and bounds do not establish universal printer or
  font compatibility, so visual review remains part of acceptance.
  NFKC text normalization also maps the font's visually identical CJK LONG radical
  U+2ED1 to 長 (U+9577); the report declares this precise extraction alias.

The generated `report.json` and `pdf-audit.json` are the result authority; this
document does not declare an unexecuted gate passed. Keep failed artifacts
separate from subsequent successful runs. Local acceptance alone is not a
deployment claim; production requires a successful release and live verification.
