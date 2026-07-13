# Migration map

This map was written before the Jekyll implementation was retired from the
active build. The exact legacy source remains on `legacy-jekyll`.

## Direct migration

| Legacy content | New destination | Notes |
| --- | --- | --- |
| Home/about narrative | `/` and `/about/` | Concise professional narrative; confirmed identity/contact retained |
| `/cv/` | `/about/#cv` | Honest web CV summary; no invented appointments or credentials |
| `/projects/` | `/projects/` | Replaced by validated manifest-backed index |
| `/teaching/` | `/teaching/` | Rebuilt as learner/instructor pathways |
| `/year-archive/` | `/writing/archive/` | Chronology is secondary |
| Current technical posts with matching source | Curated `/writing/.../` note plus technical repository link | Main site introduces; ScienceProject substantiates |
| `images/` and `files/` | Legacy paths retained during transition | Only curated assets are used in the new UI |

## Editorial revision

| Topic | Treatment |
| --- | --- |
| Dengue reaction-diffusion | Explicitly label the experiment matrix synthetic and link numerical verification |
| Accessible routing | Separate model outputs from policy implications; disclose calibration and single-hub scope |
| EV dispatch | Surface MAPE and simplified-optimizer limitations beside reported results |
| Traffic stability | Present as a simulation experiment, not a deployment result |
| Coastal defence | Present as a teaching/research case with stylized stochastic assumptions |
| Pollination | Remove universal policy language and retain exploratory status |

## Archive

- AcademicPages sample pages, template portfolios, sample talks and duplicate
  teaching records are represented by archive notices or redirects.
- The five legacy “AI-powered” project stubs are not featured because their
  claims are not supported by corresponding technical repositories.
- Older chronological posts remain discoverable through the archive mapping;
  the strongest teaching notes are consolidated into writing categories.

## Retain only in ScienceProject

- notebooks, calculations, raw and processed data, full reports, generated
  figure sets, experiment outputs, project dependencies and source code;
- competition problem statements and submission PDFs;
- expensive simulations and project-specific test environments.

## Deferred

- Line-by-line editorial migration of all 56 legacy articles.
- Moving every project into a uniform directory layout.
- Regenerating scientific figures whose project environments are not installed.
- Publication metadata beyond what the repositories presently support.
