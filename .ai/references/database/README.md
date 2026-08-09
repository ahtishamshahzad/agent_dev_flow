# References — Database (Topic Index)

> Database reference material, organized by sub-topic. Agents read **only the relevant sub-folder** for the active task (`../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Each sub-folder starts empty; material is added as the project develops. **Do not create fake reference content.** **Never store credentials, connection strings, or exported data here.**

## Sub-topics

| Folder | Covers |
|--------|--------|
| [`schema/`](schema/README.md) | ER notes, entities/relations, keys and constraints, tenancy/ownership columns. |
| [`migrations/`](migrations/README.md) | Migration playbooks, expand/contract, backfills, deploy ordering, rollback. |
| [`seeds/`](seeds/README.md) | Minimum datasets, lookup data, factories, anonymisation rules. |
| [`indexing` → `performance/`](performance/README.md) | Slow queries with plans, index analyses, pool sizing, growth notes. |
| [`transactions/`](transactions/README.md) | Atomic invariants, isolation, locking, idempotency keys, known races. |
| [`security/`](security/README.md) | Role/grant matrices, PII inventory, encryption, retention, audit scope. |
| [`operations/`](operations/README.md) | Backup schedule, **restore-test records**, replicas/failover, capacity, incidents. |
| [`prisma/`](prisma/README.md) | Prisma schema conventions, client/pooling, relation and query patterns. |
| [`drizzle/`](drizzle/README.md) | Drizzle schema conventions, type inference, query and migration workflow. |
| [`mongoose/`](mongoose/README.md) | Mongoose/MongoDB schema conventions, embed-vs-reference, sessions. |

The last three are **data-layer** folders: populate only the one that matches the approved layer.

## The two decisions stay separate

The **database** (PostgreSQL, MySQL, MongoDB, …) and the **data layer** (Prisma, Drizzle, Mongoose, …) are distinct choices that must be *paired* coherently — never compared against each other (`../../skills/database/database-selection`). Relational stores are usually preferred for payments, orders, inventory, reporting, and strongly related entities; MongoDB fits genuinely variable documents with embedded access patterns.

## Conventions

Each terminal sub-folder's README states what belongs there, file types, naming, how agents use it, and that **references do not automatically become requirements**. Pairs with the database skills (`../../skills/database/README.md`). Backend-side query and cache concerns live in `../backend/performance/`; deployment ordering for migrations pairs with `../backend/deployment/`.

## References are not requirements

Material here is **context, not commitment.** A modelled schema or migration plan does **not** become a requirement or an approval to run it against real data. Requirements/tasks and gate approval govern the build (`../../system/QUALITY_GATES.md`). **Never store secrets here.**
