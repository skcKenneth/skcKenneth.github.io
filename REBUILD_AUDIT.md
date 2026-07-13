# Rebuild audit

Audit date: 2026-07-13. Baselines: `skcKenneth.github.io` at `cb13e6c` on
`master`; `ScienceProject` at `49721c9` on `main`.

## Safety and deployment

- Both worktrees were clean before the rebuild.
- `legacy-jekyll` preserves the main-site baseline; implementation is on
  `rebuild/astro-site`.
- ScienceProject implementation is on `rebuild/technical-publication`.
- The main site used AcademicPages/Minimal Mistakes, Jekyll, Kramdown and a
  pinned GitHub Actions Pages workflow. Its production origin is
  `https://skckenneth.github.io` with an empty base path.
- Neither repository contains a `CNAME`. ScienceProject had no Pages workflow.
- The old source remains in Git history and is not needed by the Astro build.

## Main-site inventory

| Area | Inventory | Finding | Disposition |
| --- | ---: | --- | --- |
| Posts | 56 | Mixed tutorials, contest cases and long project narratives; several use inflated or unsupported deployment language | Curate representative notes; preserve all old URLs with redirect pages; archive the remainder |
| Project stubs | 5 | Promotional concepts using unsupported “AI-powered” language | Archive, do not feature |
| Teaching | 2 | Template content; both claim the same URL | Replace with pathway-based teaching content; redirect the old path |
| Publication | 1 | A supplied PDF record with inconsistent 2009/2019 dates | Preserve as an archival record without adding claims |
| Pages | 19 | Includes AcademicPages examples, sample talks, talk map, generic sitemap and theme documentation | Replace public navigation; archive or redirect recognizable paths |
| Images | 25 / 0.7 MB | Mostly small legacy images plus avatar/headers | Retain only where content requires them |
| Downloads | 6 sample PDFs / 0.1 MB | `paper1..3.pdf` and `slides1..3.pdf` appear to be template/sample files | Keep reachable during transition; do not present as current CV or teaching evidence |
| Theme assets | 31 / 2.4 MB | jQuery and theme CSS/JS | Not used by Astro |

Important URL defects found before migration:

- `2024-12-27-blog-post-8.md` and `2025-01-05-blog-post-1.md` both declare
  `/posts/2024/12/blog-post-8/`.
- Both teaching samples declare `/teaching/2014-spring-teaching-1`.
- One 2025 post permalink omits its leading slash.
- Encoding artifacts occur in configuration and some technical Markdown.
- Many posts use absolute `/images/...` links and theme-specific frontmatter.

## ScienceProject inventory

ScienceProject is a monorepo of independent Python, C++, notebook and mixed
research projects. The audit found roughly 624 Python files, 470 PNG figures,
151 Markdown files, 115 CSV files, 98 JSON files, 82 PDFs and 40 notebooks.
Dependencies and entry points are project-specific. There is no safe global
experiment or dependency environment.

The repository already has a useful project-per-directory structure, so a
mechanical move into a new `projects/` tree would create risk without improving
reproducibility. The rebuild adds a publication layer instead:

- `site-manifest/projects.json` for curated presentation metadata;
- `site-manifest/projects.schema.json` and a dependency-free validator;
- per-project technical links that point at existing source directories;
- documentation that requires status, data provenance, limitations and a
  reproduction entry point for future featured entries.

## Evidence-based featured set

The initial featured set is deliberately small:

1. Accessible multimodal routing (`SJMMA2026/ProblemA`): code, bilingual
   reports, figures, sensitivity analysis and explicit limitations.
2. Intelligent EV dispatch (`SJMMA2026/ProblemE`): real folder data,
   reproducible pipeline, figures and a report that discloses high MAPE and
   simplified optimization limitations.
3. Climate-driven dengue (`dengue_climate_model`): tests, numerical
   verification and an explicitly synthetic experiment matrix.
4. Phantom-traffic stability (`traffic-idm`): code-backed simulation; labeled
   exploratory until its documentation is strengthened.
5. Coastal defence (`RisingTide`): runnable stochastic optimization teaching
   case; labeled accordingly.
6. Pollination ecosystem (`pollination_ecosystem_model`): code and figures,
   retained as an exploratory study rather than repeating the root README's
   broad policy claims.

## Known limitations

- Old Jekyll pages were not all editorially rewritten; their paths resolve to
  archive/guide pages so bookmarks are not stranded.
- Legacy source may contain claims stronger than its evidence. The Astro site
  does not repeat them without qualification.
- ScienceProject contains generated artifacts and cached Python bytecode.
  Removing these was outside this conservative publication-layer migration.
- External links and GitHub Pages settings can only be fully confirmed after
  pushing the rebuild branches.
