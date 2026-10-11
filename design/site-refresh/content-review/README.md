# Local content review queue

This report observes public repository versions and records explicit source audits. It is separate from research reproduction, human approval, upstream release freshness and publication status. The first snapshot creates **no** review receipts. Older material without receipts remains informationally unreviewed; registered pilots, changed reviewed dependencies and due uncertain milestones are actionable.

## Commands

```powershell
pnpm review:content
pnpm review:content --out design/site-refresh/content-review
pnpm review:content record --receipt design/site-refresh/content-review/audit-receipt.json
```

The first command prints Markdown without writing files. `--out` writes only `report.json` and `report.md` inside the selected workspace directory. It cannot target source/public directories, traverse `..`, or follow symlinks/junctions. `record` is the only writing command for audit state: it appends the delimited receipt array in `src/data/content-review-registry.mjs`. It does not edit article dates, content, teaching manifests, event status or browser records.

Prepare the receipt **after actually reviewing** the current public files. Copy the target `key`, `fingerprint` and complete transitive `dependencies` object from a fresh report, then add the real review details:

```json
{
  "key": "guide:when-the-fit-is-not-the-model:zh-Hant",
  "fingerprint": "COPY_CURRENT_TARGET_SHA256_FROM_REPORT",
  "dependencies": {
    "writing:when-the-fit-is-not-the-model:zh-Hant": "COPY_CURRENT_SOURCE_SHA256_FROM_REPORT"
  },
  "reviewedAt": "2026-10-11",
  "reviewedBy": "Codex source audit",
  "scope": "Bilingual editorial question, takeaways and evidence boundary against the public article",
  "conclusion": "consistent",
  "reason": "Describe the actual comparison and any limits; do not copy this placeholder as an audit.",
  "references": ["src/data/reader-guides.mjs", "src/content/writing-zh/when-the-fit-is-not-the-model.md"]
}
```

The example is deliberately invalid until its hashes and reason are replaced. Allowed conclusions are `consistent`, `needs-update` and `pending`. The command refuses incomplete receipts, future dates, unknown targets, stale fingerprints/dependency sets and source changes after an in-memory audit snapshot. Repeating an identical receipt is idempotent. A receipt's reported `reviewed` state applies only to its recorded scope and exact versions; it does not grant human approval. Run the report again after recording to regenerate the saved reports.

## What is tracked

- Content keys use domain + common source ID + locale; a writing article and project with the same ID remain distinct. `sourceSlug` connects actual translated slugs.
- Each translation direction has a separate review target depending on both editions. Guides, reading paths, concepts and the three new notes declare article dependencies explicitly. Changes propagate through transitive dependencies.
- Classroom packs fingerprint each localized pack value independently. Their declared source edges include the existing sampling core/content/UI/navigation/provenance and the mixing-tank lesson/runtime/state/worker/reference assets, plus relevant background article/concept links. A whole shared implementation file is conservatively a source dependency; a change elsewhere in that file can therefore request inspection.
- Managed teaching manifests retain versions, byte counts, hashes, licences, inspection dates and limited source-review scope. BOM/CRLF are normalized. Only explicit absolute machine source-root provenance is ignored (`source_root`, `sourceRoot`, or a top-level filesystem `source`; URLs, relative sources and public root-relative source URLs stay fingerprinted). No private source is opened and no remote source is fetched.
- Milestone dates do not imply outcomes. Overdue AI4Nature remains `programme-listed`/pending until an actual source check resolves the specific unknown fact. The report never changes that status.

Structural errors (duplicate identities, missing dependencies, cycles and malformed receipts) are blocking. Pending/changed audit work is reported as a warning. Initial legacy unknowns are aggregated informationally rather than presented as reviewed or failed research.

## API and tests

`scripts/content-review.mjs` exports:

- `collectReviewGraph(root, { registry }?)`: current nodes, explicit graph errors, receipts and source snapshot hashes.
- `createReviewReport(graph, { receipts, today }?)`: versioned observations, exact dependency hashes, status/reason and actionable queue.
- `checkContentReview(root, options?)`: `{ errors, warnings, checked, report }` for publication integration.
- `dependencyFingerprints(graph, key)`, `recordReviewReceipt(graph, receipt, { today }?)` and `appendReviewReceipt(root, graph, receipt, options?)`: validate a concrete scoped audit; only the final API writes the registry receipt block.
- `writeReviewReports(root, out, report)` and `reviewReportMarkdown(report)`: explicit report output.

Run `node --test tests/reader-content-review.test.mjs`. Tests cover initial unknown state, domain collisions, actual translated IDs, cycles/missing dependencies, source/version/hash changes, localized classroom-pack isolation, stale receipt refusal, pending facts, idempotence and the exact output/write boundary. `--today` is available only for deterministic report generation; recording uses the actual current date.
