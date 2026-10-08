# Existing project — summaries instead of re-reading

> **Status: PROPOSED.** Fictional.

**Request:** "Add a CSV export to the reports page." **Budget:** small.

```
$ agentflow context check
fresh            architecture.md  (3 source file(s))
stale            technology.md    (2 source file(s))
fresh            testing.md       (4 source file(s))
```

- `architecture.md` and `testing.md` are fresh → read them (40 lines total) instead of the architecture docs and test config they summarize.
- `technology.md` is **stale** — `package-lock.json` changed since it was written. Re-read the lock file, update the summary (a chart library moved a minor version — nothing relevant), then `context check --update`. Only now is it trusted.
- The existing stack is used: the reports page's table component, the existing download helper, the installed versions' docs. No new library for CSV — the helper already streams text.

**Loaded beyond the summaries:** the reports page, the download helper, their tests. That's Level 2.
