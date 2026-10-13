# Workshop persistence browser acceptance

Run the native IndexedDB checks against a frozen preview or a quiet development server:

```powershell
node scripts/math-workshop-browser-qa.mjs --base http://127.0.0.1:4398 --output .tmp/math-workshop-browser-qa
```

The harness launches a new headless Edge process and a disposable browser context for each case. It uses synthetic drafts only. It does not open the user's browser profile or alter production learning records. `QA_BROWSER_EXECUTABLE` can select another installed Chromium executable; `PLAYWRIGHT_RUNTIME` can select the package location containing Playwright. `QA_CASES` accepts comma-separated case names for a focused rerun.

To additionally exercise the real scientific runtime, add `--scientific-runtime`, or select only `QA_CASES=workshop-scientific-runtime-two-tab-results`. This case fetches the pinned external Pyodide distribution after pressing Start Python. It runs the reference implementation in two genuine workers with different flow rates while their saves wait for the writer lock. Each run must pass all six checks, match independent analytic/Euler calculations within `1e-9`, produce valid PNG/CSV output, and preserve both atomic run variants after the overlapping saves. No runtime response is mocked or rerouted.

The six cases exercise the rendered Workshop client and the unified import interface:

1. Two tabs save different fields of a previously absent record, receive the other tab's controls, and retain both fields after reload.
2. Two tabs edit the same field while the writer lock is held. Both variants survive, and choosing the saved version updates the visible control.
3. An unresolved conflict survives an unrelated field edit. While a writer lock is held, Download both versions completes within two seconds and preserves both variants plus the new pending field. Choosing this tab's version downloads a recovery file, writes the selected value, and survives refresh.
4. Multiple edits made while waiting for the writer lock retain the newest field values. Draft JSON downloads within two seconds while that lock is still held and contains the latest prediction/reflection plus recovery metadata. The native import interface accepts this additional metadata without executing code. A separate tab closes while its newest edits still wait for the lock; its per-tab recovery bytes retain both fields without changing canonical IndexedDB or replaying the draft on reopening. The public `MathWorkshopStore.flush()` waits for the client submission queue and the IndexedDB queue.
5. A browser without Web Locks reads the earlier IndexedDB record without overwriting it and exports its new session draft.
6. Unified import fails after IndexedDB changes but during a localStorage commit stamp. Rollback restores exact original localStorage bytes and the original Workshop row, removes the newly inserted Workshop row, and retains the pre-import download.

On 2026-10-13 the six cases passed on Edge 155.0.4283.45 against `http://127.0.0.1:4398`, with zero page errors. The machine-readable evidence is `.tmp/math-workshop-browser-qa-verified/report.json`; downloaded synthetic backups are in the same directory. The existing shared-storage, Senior peer runtime, Workshop and unified-system source checks also passed together (47 tests).

The final frozen merged build at `d2f83df` also passed all six persistence cases against `http://127.0.0.1:4399`, with zero page errors (`.tmp/math-workshop-browser-final/report.json`). The additional two-tab scientific runtime case passed using the installed Chromium headless shell, with zero page errors (`.tmp/math-workshop-scientific-shell/report.json` and `scientific-two-tab-recovery.json`). An earlier Edge attempt failed to fetch the pinned CDN module; that failure remains recorded in `.tmp/math-workshop-scientific-edge/report.json` and is not represented as a successful Edge runtime check.

This records local browser acceptance. Production deployment, live-route checks and production asset verification are separate release gates. Earlier development runs encountered hot-reload overlays; a clean full rerun produced the result above. The browser checks also found and verified fixes for incomplete client queue flushing, saved-choice control hydration and unresolved-conflict durability.
