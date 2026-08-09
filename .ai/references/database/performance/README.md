# References — Database / Performance

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Database performance reference material: slow-query inventories with their plans, index analyses (before/after, plan-verified), table/row-count growth notes, partitioning and archival considerations, connection-pool sizing, and cache decisions at the data layer.

## Supported file types

Markdown (`.md`) for analyses; `EXPLAIN`/plan output in fenced blocks.

## Naming conventions

`kebab-case` by concern or date (`slow-queries.md`, `index-analysis-orders.md`, `pool-sizing.md`).

## How agents should use it

Read when investigating database performance, alongside `../../../skills/database/database-performance` (find offenders with evidence) and `../../../skills/database/indexing` (design the fix). Indexes come from real query shapes and are verified with plans — write cost is part of the decision. App-side offenders belong in `../../backend/performance/`.

## References are not requirements

Material here is **context, not commitment.** A plan captured here reflects the data and version it was run against; re-verify before acting on it. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
