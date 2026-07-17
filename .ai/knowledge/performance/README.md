# Knowledge — Performance

> Durable, reusable performance knowledge. Read only when the task needs it. **Not a tutorial dump.** Every entry carries a trust label; version-sensitive entries carry the metadata block — see `../README.md`. Starts empty.

## What belongs here

- Reusable bottleneck patterns (N+1, missing index, blocking event loop) and their fixes.
- Measurement techniques and what representative load means for this domain.
- Safe-fix patterns (caching-with-invalidation, pooling) with their trade-offs.

## What does NOT belong here

- Generic "make it fast" tutorials — link the source.
- A specific measurement/profile → `../../generated/` / the work item.
- Canonical rules → `../../system/`.

## Quality & source requirements

- Reusable, non-obvious, tied to **measurement** (performance claims without numbers are opinions); cite the source/benchmark.
- Record `affected_versions` where runtime-specific; undated runtime claims are **unverified**.
- Label trust: verified-current / project-convention / opinion / deprecated / unverified.

## Update & deprecation

- Re-verify against current runtime/data volumes; mark superseded advice **deprecated** with a successor.

## How skills reference this

- `../../skills/performance-review`, `../../skills/backend/backend-performance`, `../../skills/database/database-performance` link here for reusable bottleneck/fix patterns.

## Index

| Document | Topic | Trust | Verified | Affected versions |
|----------|-------|-------|----------|-------------------|
| _(none yet)_ | — | — | — | — |
