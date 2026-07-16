# `.ai/generated/` — Agent/Tool-Generated Output

Reports, audits, and checklists produced by agents/tools during work. This content is **archivable**: when a report is no longer active, archive it so it stops consuming context (`../system/DOCUMENTATION_RULES.md`, `../system/TOKEN_OPTIMIZATION_RULES.md`).

## Subfolders

```
generated/
├── reports/      # progress, status, and general reports
├── audits/       # architecture / security / testing audit reports
└── checklists/   # filled-in checklist runs (instances, not the reusable templates)
```

- **Reusable** checklists live in `../checklists/`. **Filled-in runs** of them live here in `checklists/`.
- **Audit reports** referenced by `../work-items/audits/` are written here in `audits/`.

## Lifecycle

1. Generate into the appropriate subfolder.
2. Reference it from the relevant work item / `../projects/current/`.
3. When no longer active, **archive** (move to an `archive/` subfolder or mark archived) so live paths stay lean.

## Conventions

- Date-stamp report filenames for traceability.
- Never store secrets or unredacted PII in generated reports (`../system/SECURITY_RULES.md`).
- Keep only currently-relevant generated content in the live path.

## Status

_Empty in Phase 1._ Subfolders (`reports/`, `audits/`, `checklists/`) exist and are ready.
