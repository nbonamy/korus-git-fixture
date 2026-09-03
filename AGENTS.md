# Relayboard contributor guide

Relayboard is intentionally small and dependency-free. Keep domain rules in
`src/task.js`, persistence in `src/store.js`, argument parsing in `src/args.js`,
and command orchestration in `src/app.js`.

Before handing off a change:

```bash
npm run lint
npm test
```

Add or update tests for behavior changes. Preserve the versioned board format
and atomic-write guarantee unless a task explicitly changes them.
