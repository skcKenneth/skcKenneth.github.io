# Deployment and rollback

## GitHub Pages

The `pages.yml` workflow runs on `master` and manual dispatch. Pull requests run
the same build without deploying. The job:

1. installs the pinned pnpm/Node toolchain;
2. fetches or falls back to validated ScienceProject metadata and approved assets;
3. validates Astro schemas and TypeScript;
4. builds static output for `https://skckenneth.github.io`;
5. creates the Pagefind index;
6. checks internal links and output hygiene;
7. uploads `dist` and deploys through GitHub Pages Actions.

In repository Settings → Pages, choose **GitHub Actions** as the source. No
secret or custom domain is required. The workflow uses only the standard Pages
token permissions.

## Local production check

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

The sibling repository is optional because the generated snapshots and approved
public assets are committed. A temporary GitHub failure therefore does not make
the personal site unbuildable.

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
