# Reader experience refresh — 11 October 2026

The implementation follows the approved three-stage plan. The existing ivory,
forest green and woven mark remain. Work started from published commit
`60cef4e` on branch `codex/site-reader-refresh-20261011`, in an isolated checkout.
The original site's staged and unstaged Senior Mathematics work was not edited.

## Delivered

1. Four-destination navigation; reader-first homepage; eight bilingual topics;
   article filters and 12-item pagination; Pagefind filters and pagination;
   article TOC, related articles, dates, breadcrumbs and keyboard figure viewer.
2. Bilingual RSS; canonical-ID reading list with JSON transfer; shared PNG and
   article structured metadata; bilingual 404; email feedback; centrally reviewed
   milestones, download information and responsive/accessibility improvements.
3. An 18-resource audience/format teaching directory; shared learning toolbar
   delegating to existing learning-record formats; paired draft templates;
   `content:new` and `check:publish`; automated post-deployment verification and
   a summary of the actual Git changes in GitHub Actions.

## Local verification

- Final `pnpm run build`: passed, 4,389 generated pages, Astro 0 errors.
- The build ran 259 tests across 35 reported test batches, plus existing
  mathematical validation, content, link, asset and output gates.
- Pagefind: two languages, 4,307 indexed pages. Deep teaching units, individual
  questions and archives require an explicit inclusion or type selection.
- Security gate: 18 tests passed; registry audit reported no known vulnerabilities.
- Publication metadata: 346 published entries passed bilingual, topic, date and
  local-reference checks. AI4Nature's review date is overdue; its programme-listed
  status remains unchanged pending human review.
- All 180 current and nine stale public science assets passed their existing
  receipt checks. On Windows, 133 SVGs needed their already-approved, mixed line
  endings retained to match the existing receipt hashes. Each was compared with
  its previous Git blob after CRLF normalization: no scientific content changed.
  Git now treats hashed science SVGs as binary assets to preserve those bytes.
- Generated reader images have an input/output receipt. Unchanged inputs keep
  the reviewed PNG and WebP bytes across Windows and Linux; the woven SVG input
  is normalized for line endings before calculating the sharing-image fingerprint.

## Actual browser verification

`previews/` contains six real screenshots of the final built home, writing list
and long article at 1280 × 900 and 390 × 900. See [the comparison page](index.html).

Five representative Chinese pages (home, writing, long article, teaching, search)
were checked at widths 360, 390, 768 and 1280, with normal 16 px root text and
200% root text (32 px). All 40 combinations had zero whole-document horizontal
overflow. The 200% check used a local preview response that changes only the root
font size; it is not a statement about every browser's zoom implementation.
Raw measurements are in [responsive-checks.json](responsive-checks.json).

Observed interactions:

- Search “模型”: 112 default results; pages 1 and 2 reachable with keyboard;
  language switch preserves `q` and `page`; browser Back restores them.
- “龘靐齉爩” returns zero results with category exits. With the local Pagefind
  entry temporarily unavailable, the UI explains the failure and offers 13
  title/alias matches over two pages. The original index file was restored.
- Mobile menu opens with Enter; Escape closes it and restores button focus.
- Mobile TOC reaches the real heading below the sticky header (heading top
  93 px, header bottom 77 px in the tested viewport).
- Figure viewer opens by keyboard; Escape closes it and restores image-button
  focus. Original scientific figures retain their proportions and captions.
- A test article was saved, exported, removed and imported. English then showed
  that same canonical article with its English title; the test item was removed.
  Malformed import, blocked storage and cross-tab removal are covered by actual
  compiled-client regression tests.
- Teaching audience “senior” + format “practice” returns six matching resources.
- Browser console was clear in the normal search interaction. A deliberate
  missing-index request is expected to produce a network failure during that test.

These are focused checks using [WCAG 2.2's reference](https://www.w3.org/WAI/WCAG22/quickref/),
including keyboard access, focus, reflow and text resizing; they do not constitute
a formal, exhaustive WCAG conformance audit. Pagefind filter attributes follow
the [official filtering documentation](https://pagefind.app/docs/filtering/).

## Publishing evidence

The post-deploy job checks English and Chinese home, writing, topics, teaching,
search and RSS routes, plus the PNG and woven SVG against the deployed commit's
hashes. Its actual results and commit appear in the GitHub Actions summary.
Local build success alone is not treated as production verification.
