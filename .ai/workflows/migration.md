# Workflow: Migration

> Incremental, reversible state change with backup, rehearsal, verification, and cutover. Schema and data migrations owned by a single database engineer.

## Request Classification

**Primary type:** migration. Selected when schema or data must move/transform (backfills, reshaping, store moves, framework/state migrations).

## Skills Required

`../skills/migration-planning`, `../skills/database/database-migrations`, `../skills/database/data-migration`, `../skills/database/backup-recovery` (+ `../skills/dependency-audit`, `../skills/environment-audit` for framework/env migrations).

## Agents Involved

`orchestrator` → `database-engineer` (**sole owner** of schema/migration files) → `backend-engineer` (contract adjustments, coordinated) → `test-engineer` → `code-reviewer` + (if data-sensitive) `security-reviewer`. Not parallel on migration files.

## Context Required

Source→target model + transformation rules, data volume + live-traffic profile, downtime tolerance, backup/rollback plan.

## Gates

Gate 3 if the data model changes shape, Gate 5 (verification), Gate 6 (review), Gate 7 if it ships as part of a release/deploy.

## Documents Generated

Migration plan (expand→migrate→contract), transformation spec + dirty-data rulings, backup/snapshot record, verification criteria + results, rollback ruling.

## Validation

Migration is idempotent, resumable, batched; **backup taken and restore tested**; verification criteria (counts/checksums) pass; rehearsed at production scale; rollback path defined.

## Handoff

Plan → backup → rehearse → run + verify → cut over → contract, via Handoff Format.

## Stop Condition

- **Stop** if there is no backup/tested restore or no rollback plan (`../hooks/before-migration.md`).
- **Stop** if the migration isn't idempotent/resumable on live data or is unrehearsed at scale.
- **Complete** when data is migrated, verified against criteria, old path safely retired, and rollback was available throughout.

## Related

Hook: `before-migration`. Skills: `../skills/migration-planning`, `../skills/database/data-migration`, `backup-recovery`.
