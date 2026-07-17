# Hook: before-migration

> Tool-neutral checklist run before a data/schema migration begins. Read and perform manually; executable integration optional (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

Before executing a schema or data migration (migration workflow — `../workflows/migration.md`).

## Required Inputs

- The migration plan (source → target, transformation rules), data volume and live-traffic profile, downtime tolerance.
- The rollback plan and a current backup/snapshot point.

## Checks

- [ ] Migration is **incremental and reversible** where possible; sequencing planned (expand → migrate → contract for zero-downtime) (`../skills/database/database-migrations`).
- [ ] A **backup/snapshot** is taken before any mutating run, and a **tested restore** exists (`../skills/database/backup-recovery`).
- [ ] Data migration is **batched, resumable, idempotent**, with pre-agreed **verification criteria** (`../skills/database/data-migration`).
- [ ] Migration files are owned by the **single database engineer** (no concurrent editors — `../agents/database-engineer.md`).
- [ ] Rehearsed on production-scale data (timing, locks) before production.
- [ ] Rollback ruling recorded (roll-forward-only vs reversible) and cutover plan defined.

## Failure Conditions

- No backup/snapshot before mutation, or restore untested.
- Non-idempotent or non-resumable migration on live/large data.
- No verification criteria; no rollback plan.
- Unrehearsed against production-scale data.

## Output

- Confirmation of backup, reversibility/sequencing, idempotent batched runner, verification criteria, and rollback — recorded for the migration.

## Stop Conditions

- **Stop** if there is no backup/tested restore, or no rollback plan.
- **Stop** if the migration isn't idempotent/resumable on live data, or is unrehearsed at scale.
- Otherwise proceed with monitoring.

## Related

- Agent: `../agents/database-engineer.md`. Skills: `../skills/migration-planning`, `../skills/database/data-migration`, `backup-recovery`.
