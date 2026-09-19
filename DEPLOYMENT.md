# Deployment and rollback

## GitHub Pages

The `pages.yml` workflow runs on `master` and manual dispatch. Pull requests run
the same build without deploying. The job:

1. installs the pinned pnpm/Node toolchain;
   then runs the dependency security gate (all dependency scopes, every severity);
2. runs publication-policy unit tests;
3. fetches or falls back to validated ScienceProject metadata, approved figures, and allowlisted teaching resources;
4. verifies asset hashes, publish-only provenance, teaching-resource boundaries, SVG policy and bilingual parity;
5. validates Astro schemas and TypeScript;
6. builds static output for `https://skckenneth.github.io`;
7. creates the Pagefind index;
8. checks internal links and output hygiene;
9. uploads `dist` and deploys through GitHub Pages Actions.

In repository Settings → Pages, choose **GitHub Actions** as the source. No
secret or custom domain is required. The workflow uses only the standard Pages
token permissions.

## Local production check

```bash
pnpm install --frozen-lockfile
pnpm run check:security
pnpm build
pnpm preview
```

The sibling repository is optional because the generated snapshots and approved
public assets are committed. A temporary GitHub failure therefore does not make
the personal site unbuildable.

For each new article, publication includes the English and Traditional Chinese
homepages. Check their current recommendations locally at desktop and mobile
sizes, then verify both live homepages after Pages reports success for the exact
pushed commit. An article-list check alone does not complete publication.

Every publication also includes dependency security maintenance. Resolve reported
advisories with the smallest compatible dependency/lockfile update, run focused
regression checks and the full build, then verify the exact deployed commit.
The CI security gate blocks deployment on known advisories or an unavailable
audit service; do not add ignored advisories or `--ignore-registry-errors` simply
to publish. When GitHub alert access is available, also verify its current alert
state after the dependency graph refresh. A clean registry audit is not evidence
that inaccessible GitHub alerts were dismissed or closed. Preserve unrelated
worktree changes and do not silently expand a patch into a major-version migration.

## ScienceProject CI

`publication-metadata.yml` validates the technical manifest and rejects local
absolute paths. It intentionally does not install every independent project
environment or run expensive experiments.

## Rollback

The pre-rebuild site is preserved at commit `cb13e6c` and branch
`legacy-jekyll`. To inspect it without disturbing this worktree, create a
separate Git worktree from that branch. Rollback deployment should be a normal
revert or branch merge followed by the matching Pages workflow—never a force
push. The site history and current rebuild branch remain intact.
