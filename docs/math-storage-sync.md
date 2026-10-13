# Mathematics storage coordinator

`public/math-shared/storage.js` loads synchronously before browser clients and exposes `MathStorage`. It uses no network or dependencies. All adapted clients use the origin lock `math-learning:writer:v1`.

```js
const store = MathStorage.createStore({
  namespace: 'app-name', storage: localStorage,
  defaults: { 'existing-legacy-key': {} },
  decode(key, raw) { return JSON.parse(raw); },
  normalize(key, document) { return document; }
});
store.edit({ key: 'existing-legacy-key', path: ['item-id', 'notes'],
  kind: 'set', base: previousNotes, value: nextNotes });
await store.flush();
```

`snapshot()` is synchronous and includes pending edits. `state()` and `subscribe(fn)` expose `{snapshot,status,pending,conflicts,recoverySaved,error}`. Status is `saved`, `pending`, `session-only`, `conflict`, `external-change` or `unreadable`. Only `saved` establishes persistence. Do not read a fulfilled promise alone as successful persistence; inspect `result.ok`.

Supported operations: `set` with original `base`; nonnegative `increment`; numeric `max`; `append` with `value.eventId`; `event-remove` with a nonempty `value.eventId` and an array field path; `array-add`, `array-remove`, `array-move` with `{id,beforeId}`; recursive missing-fields-only `seed`; and root `remove-key`. Root `path:[]` supports whole-document replacement. Ordinary patches reject prototype paths. `defaultValue` supplies an absent field's legacy default for conflict comparison.

`event-remove` rereads the current array under the writer lock and removes the selected event identity, preserving concurrent appends. Repeated deletion of the same identity is harmless. Rows without an event ID are retained and exportable; the client must omit unsafe per-row deletion for these legacy rows. Opening an old record does not assign identities or rewrite it. `array-remove` is for primitive ID lists, not JSON object records.

`conflicts()` retains local and remote variants. `resolve(id,'local'|'remote')` queues the chosen field against the latest version. `resume()` is for an explicit acknowledgement after refreshing old tabs; it cannot prove those tabs were closed. `checkpoint()`, `recoveries()`, `exportRecovery()`, `MathStorage.exportAllRecovery()` and `MathStorage.snapshotAll()` support session and conflict backups. Recovery checkpoints contain affected records. They are exported for preview/import, rather than replaying increments twice. `recovery:false` disables checkpoints; `setRecoveryEnabled(false)` also removes this store's own checkpoint for opt-out flows.

Without Web Locks, the coordinator leaves canonical legacy keys unchanged. With storage denial, editing remains in memory. Hosts must provide truthful session/export status in both languages. `pagehide` checkpoints synchronously; queued flushing is best-effort. Export must capture the synchronous snapshot and recovery material, including when a queued flush has not completed.

`transact(async freshDocuments => nextDocuments)` performs parsed-document import under the same writer lock, preserving new edits made while its callback awaits. Call `flush()` first; an unresolved dirty/conflict state prevents starting the import. `MathStorage.restoreRaw({storage,replacements,expected,before,applyOther,rollbackOther})` preserves exact raw legacy bytes across native keys and can include another store such as IndexedDB. It flushes registered stores, validates preview bytes, invokes the before-import backup callback, and reports failed/incomplete rollback. A successful localStorage transaction cannot guarantee recovery if rollback writes are subsequently denied. Commit stamps are per key, so coordinated restores across namespaces do not resemble an old tab.

Run `node --test tests/math-shared-storage.test.mjs` for forced-overlap, conflict, recovery, import, opt-out and legacy-writer scenarios. Source tests do not establish native browser or production acceptance.
