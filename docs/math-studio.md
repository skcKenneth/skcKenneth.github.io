# Mathematics Studio: GitHub Pages publication

Canonical student URL: https://skckenneth.github.io/math-studio/

The owner requested on 2026-09-19 that this mathematics teaching website and future updates be published on their GitHub instead of relying on ChatGPT Sites access. Preserve this GitHub Pages destination unless the owner explicitly requests a different host.

## Source and delivery

- Repository: skcKenneth/skcKenneth.github.io; production branch: master.
- Editable static application: public/math-studio/. Astro copies this folder unchanged into dist/math-studio/.
- All application scripts and styles are relative to this folder; no ChatGPT, GitHub or other sign-in is required to use the public application.
- The English and Traditional Chinese teaching indexes link to this same Traditional Chinese application.
- Keep the site's existing dependency security gate and full Pages build. Do not bypass or weaken publication checks.
- Do not copy the old Sites hosting manifest, private credentials, user uploads, PDF textbooks or workbook scans into this repository.

## Updating

Edit the files in public/math-studio directly. Question content lives in data.js and question-bank.js; the pilot challenge definitions are in challenge-bank.js. Foundation lessons and comparisons are in learning-content.js and learning-ui.js, random practice in practice.js, inquiry activities in inquiry.js, navigation in app.js, and presentation in style.css. Update the asset query version in index.html when changing assets. See [learning support](math-studio-learning-support.md) for the current sampler and authoring contract.

Run pnpm test:math-studio, pnpm run check:security, and pnpm build. Both mathematics validation suites also run at the start of the existing build command. Review the diff, publish through the normal repository workflow, and confirm that the Pages deployment for the exact merged commit succeeds before reporting it live. Confirm /math-studio/ and every referenced asset are available without authentication.

## Classroom use and persistence

Students choose a grade and chapter, or open random practice / inquiry from the side navigation. Inquiry notes and recent question history stay in the same browser; completed inquiry work can be downloaded as text. This is not a central gradebook or live collaborative editor. Records previously stored on the ChatGPT Sites origin do not automatically transfer to the new GitHub Pages origin.

The initial migration preserved 38 chapters, 304 original/template question families, 12,342 deduplicated prompts including numeric variants, and 12 inquiry units. The learning-support release expands the six pilot chapters; current counts are computed from the active pools. Exercise originality, textbook scope, UbD and School as Learning Community references remain visible in the application.
