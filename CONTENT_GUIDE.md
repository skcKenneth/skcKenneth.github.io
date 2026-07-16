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
as SVG. Sync reports missing files, hash changes, and stale managed files. It
does not delete stale or unmanaged assets.

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

## Research and teaching

- Research entries describe programmes and link across projects.
- Teaching entries create learner or instructor pathways rather than PDF lists.
- Project entries always carry a controlled status and limitations.
- Archived writing uses a visible notice and preserves its original date.

Run `pnpm build` before review. Check mathematical overflow, code wrapping,
captions, alt text, metadata links, and the generated Pagefind result.
