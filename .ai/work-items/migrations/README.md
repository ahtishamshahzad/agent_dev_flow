# `.ai/work-items/migrations/` — Migrations

Migration work items: move from one state to another (framework/version/data/schema/infra) safely and incrementally.

## Typical shape

1. **Audit** — current state, target state, and the gap.
2. **Plan** — incremental, reversible steps; compatibility strategy.
3. **Migrate** — apply steps incrementally; keep the system working between steps where possible.
4. **Verify** — tests and checks at each step (`../../system/TESTING_SELECTION_RULES.md`).
5. **Cut over** — switch to the new state; keep a rollback path.

## Rules

- Prefer incremental, reversible migrations over big-bang cutovers.
- Data/schema migrations require backups and a tested rollback.
- Production migrations are outward-facing — explicit approval (`../../system/OPERATING_RULES.md` §9, `../../mcp/PERMISSION_RULES.md`).

## Each migration records

- Title, from→to, affected applications/data, link to project/phase.
- Step plan; rollback plan; verification per step.

## Index

_No migrations in Phase 1._

| Migration | From → To | Status |
|-----------|-----------|--------|
| _(none yet)_ | — | — |
