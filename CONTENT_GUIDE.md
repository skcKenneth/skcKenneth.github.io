# Content guide

## Editorial rule

Final articles are manually written `.md` or `.mdx` files in
`src/content/writing`. Never publish notebooks, raw calculation notes, data
dumps, or every ScienceProject file as prose. A public article selects verified
outputs, interprets them, and states assumptions and limitations.

The private ScienceProject workspace may change code, notebooks, data,
experiments, results, or approved figures. `npm run sync:science` may update only:

- `src/data/generated/science-projects.json`;
- `src/data/generated/science-assets.json`;
- `public/science/asset-manifest.json`;
- approved media under `public/science/<project-slug>/`.

It never writes inside `src/content`.

Curated teaching downloads use a separate boundary. `npm run sync:teaching`
accepts only files declared in a private project's `release/public/` directory,
validates hashes and media types, and writes managed copies under
`public/resources/<resource-slug>/`. It never copies raw TeX, source archives,
official-paper facsimiles, notebooks, or private repository paths, and it never
generates or overwrites the bilingual teaching-page body. Stale managed files
are reported and preserved rather than deleted automatically.

The Projects section has two deliberately separate levels:

- every ScienceProject top-level directory appears as a generated technical
  catalogue entry with a high-level file inventory and review limitations;
- selected projects receive manually written editorial overviews in
  `src/content/projects` after their evidence has been reviewed.

Refreshing the catalogue does not promote an inventory entry into an editorial
overview and does not create a Writing article.

The original `_posts/*.md` files are different: they were already public blog
articles. `npm run migrate:legacy` preserves their full bodies under
`src/content/writing/legacy`, adds archive context and internal ScienceProject
provenance where detectable, and redirects each former public URL to its migrated
article. The generated copies should not be edited directly; revise the source
post or promote a reviewed successor into the curated Writing collection.

## Add a technical project

1. Complete the ScienceProject README, provenance, status, reproduction command,
   limitations, and practical checks.
2. Generate figures from code or notebooks. Select only reviewed figures and
   place copies in `<project-root>/figures/publish/` with lowercase safe names.
3. Add `project_root`, `publish_assets`, alt text, caption, and `generated_by`
   to `ScienceProject/site-manifest/projects.json`.
4. Validate there, then run `npm run sync:science` here.
5. Add or update a curated project overview in `src/content/projects`.

For a newly added top-level ScienceProject directory, first run
`node scripts/build-public-catalog.mjs` in ScienceProject. This guarantees that
the directory becomes discoverable even before it is selected for editorial
promotion.

Supported public media: PNG, JPEG, WebP, AVIF, GIF, and SVG. SVG is preserved
as SVG. Sync fails when a declared asset is missing, reports hash changes, and
keeps reporting stale managed files across later runs. It does not delete stale
or unmanaged assets. `npm run check:science-assets` independently verifies
public paths, hashes, byte counts, SVG titles/descriptions and explicit black
SVG text.

## Write an article

Create a manually authored Markdown or MDX file. In addition to the required
writing schema, a technical article may declare:

```yaml
scienceProject: project-slug
technicalRepository: https://github.com/.../tree/main/project
notebookUrl: https://github.com/.../notebooks
codeUrl: https://github.com/.../main.py
reproductionUrl: https://github.com/.../README.md#reproduce
```

These fields preserve internal provenance. The rendering policy suppresses URLs
that point into the private ScienceProject repository. Links to genuinely public
repositories or teaching resources may still render. Never add fake values to
satisfy a schema.

### Mathematical notation

In Markdown and MDX, use the site's TeX math syntax for mathematics rather than
Unicode approximations or code spans. In Astro teaching components, import
`MathExpression.astro` and pass validated TeX to it; it produces a KaTeX visual
rendering plus accessible MathML. Long display equations must retain the shared
horizontal-scroll treatment on narrow screens. Interactive formulae that change
in the browser must use semantic MathML, with an accessible plain-language
label, rather than concatenated text such as `x^2`.

Article structure should cover the question, why it matters, model, data and
assumptions, findings, validation, limitations, and technical record. Label
concepts, synthetic experiments, teaching cases, and work in progress directly.

### Visual evidence rule

Curated long-form articles must not rely on an interactive companion as their
only visual explanation. For non-archived Writing articles dated on or after
2026-07-16, the build requires at least one local figure for 900-1,199 words and
at least two local figures for 1,200 words or more. Each figure must have useful
alt text, a semantic caption, and an existing asset under `public/images` or
`public/science`.

Research figures should use a restrained, publication-ready IEEE-style visual
language: labelled axes or stages, direct series labels where possible, panel
letters for multi-panel compositions, and colour paired with line style or
shape. All figure text must be black (`#111` or `#000`) against a light
background. Figures should explain a claim, mechanism, comparison, or method;
decorative images do not satisfy the rule. Synthetic or schematic values must
be identified as such in the caption.

Run `npm run check:writing-visuals` to apply this editorial gate without a full
site build. New articles remain manually written; the check neither creates
prose nor promotes ScienceProject files into posts.

Every English Projects, Research, Writing and Teaching entry must have exactly
one substantive Traditional Chinese edition whose `sourceSlug` points back to
the English slug. Run `npm run check:bilingual`; the same strict parity gate is
part of the production build.

## Homepage publication requirement

Every new bilingual article publication must update and verify both `/` and
`/zh/`, not only Writing, Projects, or mentoring pages. Latest writing cards
automatically show the three newest non-draft,
non-archived articles by publication date. `featured: false` must not exclude
a newly published article from that section. Show each latest article only once;
the separate Start here selection is centrally curated in `src/data/site-reader.mjs`.
Equal dates use the shared
source slug for deterministic bilingual order; this does not imply an order
of publication within that day. Keep accurate dates and paired metadata.

Verify the homepage article titles, links, images, and mobile layout in the
local production build and again after the matching Pages deployment succeeds.
`test:homepage` and `test:homepage:built` enforce selection and rendered parity;
both run in the complete build. An accepted student-research outcome should
also be reflected in both About pages when requested, using verified mentoring
roles and milestones without inferring presentation or proceedings publication.

## Paired drafts and reader-facing metadata

Create a safe bilingual draft pair without overwriting existing work:

```sh
pnpm content:new --kind writing --slug a-focused-question --topic data-ai
pnpm content:new --kind teaching --slug a-new-learning-unit --topic teaching-research-practice
```

Optional flags are `--title-en`, `--title-zh`, `--date YYYY-MM-DD` and `--dry-run`.
Templates live in `templates/content/`. Both editions start with `draft: true`.
The English `slug` and Chinese `sourceSlug` are the shared identity; language
switching and saved articles use it. A draft template is preparation material,
not evidence of completed research or teaching results.

Declare `topicIds` using one primary category followed by up to two related
categories. Use the eight stable IDs in `src/data/site-reader.mjs`; their order
must agree across editions. Keep detailed `topics` as editorial tags. Optional
`relatedSlugs` names published article source IDs and can override automatic
related-article selection. Generated legacy bodies stay untouched and obtain
their stable classifications from the central registry.

Publication dates must agree across editions. `lastUpdated` records a substantive
change to that edition and may differ when a translation is revised later.
Do not advance it for a routine build or formatting change. Dates may use
YYYY-MM-DD or an ISO timestamp with a timezone. Future content remains a draft.

## Teaching directory and download information

Manage resource entrances in `src/data/teaching-directory.mjs`: audiences are
junior, senior, modeling and teacher; formats are interactive, practice,
past-papers, notes and slides. Each card needs paired names, purpose, truthful
duration guidance and one main action. Mark Traditional-Chinese-only tools
explicitly. Preserve existing anchors, especially `#math-inquiry-lab` and
`#curriculum`, when reorganising the directory.

Download information is derived at build time from local file sizes and existing
release manifests. Do not invent a licence, language, version or official status
when the release does not specify one. Lecture Notes and slides retain their
CC BY-NC-SA 4.0 declaration; the competition companion retains its independent,
unofficial boundary and links to the official questions. Adding download metadata
does not grant redistribution rights. Learning toolbars delegate to existing
exports and storage; they must not rewrite a learner's saved records.

### One-class activity packs

Maintain paired classroom content in `src/data/classroom-packs.mjs`. The registry
owns stable pack IDs, bilingual tasks and teacher reasoning, timings, source
boundaries, original-tool links and comparison presets. The current packs are
`sampling-bias` (45 minutes) and `mixing-tank` (50 minutes). These timings are
editorial lesson plans, not measured learning outcomes; the tank pack is an
introduction to the longer workshop, not completion of its eight stages.

Student pages live at `/teaching/classroom-packs/<id>/`, with matching `/zh/`
editions. Teacher references use the separate `<id>/teacher/` route. These are
public references, not access-controlled answers. Keep teacher reasoning and
reference answers out of student tasks and student printouts. The teaching
overview uses one compact pack card per activity; do not duplicate the underlying
Math Studio or workshop engine in the resource directory.

Share links target only the student pack page. Permit only a declared `preset`
and an integer `seed` within that activity's existing bounds. Never include names,
responses, code, progress, stored records or a teacher-mode flag. Settings must be
applied manually in the original tool; the link does not preload or reset it.
Keep the visible copying status and bounded manual-copy fallback. Projection
changes only the page display and must retain a clear exit and Escape support.

Do not change either engine's storage schema or import/export format when editing
a pack. The pack page must not read or write the original learning records.
Math Studio's interactive tool remains Traditional-Chinese-only; the workshop is
bilingual and downloads its Python runtime only when requested. A precomputed
reference, paper comparison or failed runtime load must never be labelled as the
student's successful execution. Keep synthetic-data and physical-validation
limits visible in both editions.

Run `node --test tests/classroom-packs.test.mjs` for the source, sharing and
record-isolation checks. After a fresh complete build, run
`node tests/classroom-packs.test.mjs --built`. Serve that production output locally
and render the eight student/teacher × English/Traditional-Chinese documents:

```sh
node scripts/render-classroom-pdfs.mjs http://127.0.0.1:8767/
```

The renderer uses fresh isolated headless Edge profiles and writes PDFs plus a
source/HTML/PDF hash manifest under
`design/site-refresh/classroom-previews/print/`. Inspect the actual A4 output:
formulas and mathematical glyphs, line breaks, writing space, current preset and
seed, source URLs, and the separation of student tasks from teacher answers.
Use `MathExpression.astro` for TeX formulas; semantic rendering must not move a
teacher formula into a student task. Also manually check keyboard, projection,
copy fallback, both languages and manual tool navigation. Passing source tests or
generating PDFs does not itself establish visual, accessibility or learning QA.

When an activity, source asset or linked explanation changes, use the local
content review queue below to inspect the pack's current source dependencies and
both editions. Record a receipt only after that audit; a changed fingerprint or
newly rendered PDF is not approval and must not alter scientific claims or dates.

## Check, publish and verify

1. Create the paired draft and write both editions with reviewed references.
2. Update the central topic, teaching-resource or homepage selections as needed.
3. Preview a local production build, including both languages and a narrow screen.
4. Run `pnpm check:publish`; `--checks-only` runs the new metadata gate on its own.
   The default also runs existing bilingual, reading-time, publication, figure
   and teaching-release checks. After a build, use `pnpm check:publish --built`
   to include output and internal-link validation.
5. Publish only after the complete build succeeds, wait for the matching Pages
   deployment and verify the actual live routes, assets, navigation and search.
6. Report the changes that were actually published and the checks actually run.

The Pages deploy job runs `scripts/publish-summary.mjs --live` after deployment.
It compares the actual pushed Git range, checks English and Chinese home,
Writing, Topics, Teaching, Search and RSS routes, and compares the live share PNG
and brand SVG against the checked-out commit hashes. CDN retries are bounded to
60 seconds. Results and the changed-file list appear in the Actions job summary.
This automated summary does not claim manual browser or full accessibility QA.

Reader thumbnails and the sharing PNG are generated by `pnpm generate:reader-media`.
Commit their `public/images/reader-media-manifest.json` receipt together with the
images. Unchanged inputs reuse reviewed image bytes across operating systems;
when an input changes, inspect the regenerated output before publishing.

Maintain event status, date, review-after date and source together in
`src/data/site-editorial.mjs`. The publication gate reports overdue reviews
without changing event status. A programme listing or an elapsed date never
proves that a presentation occurred or proceedings were published.

## Reading paths, concepts and reading tools

Manage the two reading paths in `src/data/reading-paths.mjs`. Steps use shared
article IDs, resolve actual translated titles and URLs, and derive reading times
from current content. Keep the core/optional distinction, prerequisites and
evidence boundaries with each step. Never infer a translated slug from a title.

The eight sourced concept guides live in `src/data/reader-concepts.mjs`.
`CONCEPT_PLACEMENTS` declares the exact existing section IDs for the six pilot
articles. The Markdown plugin inserts native disclosures without rewriting
prose, formulas, captions or heading IDs; a missing anchor fails publication.
Each guide keeps its definition, example, misconception and scope together.
Search indexes guides by type and topic and recognizes paired names/aliases.

Reading positions use the independent `kenneth-reading-position:v1` key and
shared article ID. Cross-language sections are explicit pairs in
`src/data/reader-sections.mjs`; never align headings by ordinal position.
Removed headings and unmapped translations return a visible status. Clearing a
position must retain saved articles and all teaching records. Print QA checks
actual A4 output, including formulas, captions, tables and code, in both languages.

## Local content review queue

Run `pnpm review:content` to print the local public-source review queue without
changing files. Use `pnpm review:content --out design/site-refresh/content-review`
to save only `report.json` and `report.md`. The JSON records current fingerprints;
observing those versions does not mark them reviewed. Unknown legacy material is
informational. Changed reviewed items, unreviewed registered pilots and overdue
milestone facts are actionable; structural dependency errors block publication.

`src/data/content-review-registry.mjs` declares directional translation links,
article-to-guide/path/concept/note dependencies and managed teaching manifests.
Keys include the content domain, shared source ID and locale. Fingerprints normalize
BOM/line endings, retain metadata dates and keep manifest versions, sizes, hashes,
licences and inspection scope. Only absolute machine source-root provenance is
ignored. The queue reads repository public sources; it does not open private files.

After actually auditing the indicated public versions, prepare a JSON receipt with
`key`, `fingerprint`, the full `dependencies` map from the current report,
`reviewedAt`, `reviewedBy`, a concrete `scope`, `conclusion` (`consistent`,
`needs-update` or `pending`), `reason` and public/workspace `references`. Record it
explicitly with `pnpm review:content record --receipt design/path/to/receipt.json`.
This appends only the registry receipt block and refuses stale target/dependency
hashes. `Codex source audit` identifies a source audit, not human approval or an
independent research reproduction. Keep unconfirmed facts pending, including
AI4Nature presentation/publication outcomes; elapsed dates never resolve them.

Never create receipts merely to clear warnings or accept a new snapshot. Report
generation and receipt recording must not rewrite article publication/update dates,
teaching manifests, scientific evidence, stored learning records or event status.

## Research and teaching

- Research entries describe programmes and link across projects.
- Teaching entries create learner or instructor pathways rather than PDF lists.
- A large teaching PDF is introduced by a bilingual editorial page with audience, coverage, source boundary, and worked examples; the download is not the page itself.
- Project entries always carry a controlled status and limitations.
- Archived writing uses a visible notice and preserves its original date.

Run `pnpm build` before review. Check mathematical overflow, code wrapping,
captions, alt text, metadata links, and the generated Pagefind result.
