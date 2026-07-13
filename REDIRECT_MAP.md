# Redirect map

GitHub Pages cannot issue server redirects. Astro generates lightweight HTML
pages with a canonical URL, a zero-delay refresh, `noindex`, and a visible
destination link. Redirect pages are excluded from Pagefind.

## Stable destinations

| Old path or class | Destination |
| --- | --- |
| `/year-archive/`, `/page-archive/` | `/writing/archive/` |
| `/portfolio/`, `/collection-archive/` | `/projects/` |
| `/publications/`, `/publication/*` | `/writing/archive/` |
| `/talks/`, `/talkmap.html`, `/talks/*` | `/teaching/` |
| `/categories/`, `/tags/` | `/writing/` |
| `/sitemap/` | `/search/` |
| `/cv/` | `/about/#cv` |
| `/posts/YYYY/MM/<slug>/` | Best matching curated writing/project page, otherwise `/writing/archive/` |
| `/teaching/2014-spring-teaching-1` | `/teaching/` |
| AcademicPages examples (`/markdown/`, `/non-menu-page/`, `/archive-layout-with-content/`) | `/writing/archive/` |

The build-time redirect manifest in `src/data/redirects.ts` is the executable
source of truth. `npm run check:redirects` verifies unique source paths and
safe local destinations.
