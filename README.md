# Kenneth Cheng — research studio
The public editorial layer for [skckenneth.github.io](https://skckenneth.github.io),
built with Astro 7, TypeScript, Markdown/MDX content collections, KaTeX,
Pagefind, and GitHub Pages.

## Repository boundary

```text
code / notebooks / data / experiments
        ↓
ScienceProject results and figures/publish assets
        ↓
manual editorial review
        ↓
Markdown or MDX article in this repository
```

ScienceProject is the computational source of truth. This repository is the
publishing layer. `npm run sync:science` copies approved figures and metadata;
it never creates, edits, or overwrites article bodies.

## Local development

Requirements: Node 22.12+ and pnpm 11.7.

```bash
pnpm install --frozen-lockfile
npm run sync:science
pnpm dev
```

When `../ScienceProject` exists, sync reads it directly. Otherwise it retrieves
the public manifest and approved assets from GitHub, falling back to the last
validated snapshots if the network is unavailable.

```bash
pnpm build       # sync, schema/type check, build, Pagefind, links, output hygiene
pnpm preview     # serve the production output
```

The production origin uses an empty base path. Do not add a repository subpath
to internal links.

## Architecture

- `src/content/{projects,research,writing,teaching}` — validated editorial content;
- `src/pages` — static routes and legacy redirect generator;
- `src/components` and `src/styles` — custom design system;
- `scripts/sync-science-projects.mjs` — approved-asset and metadata sync;
- `public/science/<project-slug>/` — managed copies of approved figures;
- `public/science/asset-manifest.json` — hashes, provenance, status, and stale records;
- `src/data/generated` — validated fallback snapshots;
- `/projects/` — complete technical catalogue plus reviewed editorial overviews;
- `legacy-jekyll` — exact pre-rebuild implementation.

Read [CONTENT_GUIDE.md](CONTENT_GUIDE.md), [DEPLOYMENT.md](DEPLOYMENT.md),
[REBUILD_AUDIT.md](REBUILD_AUDIT.md), [MIGRATION_MAP.md](MIGRATION_MAP.md),
and [REDIRECT_MAP.md](REDIRECT_MAP.md) before making structural changes.
