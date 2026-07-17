# Knowledge — Database

> Durable, reusable data-layer knowledge. Read only when the task needs it. **Not a tutorial dump.** Every entry carries a trust label; engine/version-sensitive entries carry the metadata block — see `../README.md`. Starts empty.

## What belongs here

- Reusable modeling, indexing, and transaction/concurrency patterns with trade-offs.
- Engine-specific behaviors (PostgreSQL/MySQL/MongoDB) worth remembering, with versions.
- Migration and backup/restore lessons with future value.

## What does NOT belong here

- Generic SQL/NoSQL tutorials — link the docs.
- Project-specific schema notes → `../../references/backend/database/`.
- Canonical rules → `../../system/`. **No real data or credentials — ever.**

## Quality & source requirements

- Reusable, non-obvious; cite the source (engine docs, EXPLAIN analysis, incident).
- Record `affected_versions` (engine + data-layer); undated engine-behavior claims are **unverified**.
- Label trust: verified-current / project-convention / opinion / deprecated / unverified.

## Update & deprecation

- Re-verify against current engine/data-layer versions; mark superseded advice **deprecated** with a successor.

## How skills reference this

- `../../skills/database/*` and `../../skills/security/database-security` link here for engine-specific/version-sensitive knowledge.

## Index

| Document | Topic | Trust | Verified | Affected versions |
|----------|-------|-------|----------|-------------------|
| _(none yet)_ | — | — | — | — |
