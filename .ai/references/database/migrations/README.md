# References — Database / Migrations

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Migration reference material: migration playbooks, expand/contract sequences for breaking changes, backfill plans and their batching/throttling, deploy-ordering notes (migrate before or after release), rollback/down-migration strategy, and records of long-running or destructive migrations.

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`expand-contract.md`, `backfill-playbook.md`, `deploy-ordering.md`).

## How agents should use it

Read when planning or reviewing a schema change, alongside `../../../skills/database/database-migrations` and `../../../skills/database/data-migration`. Migrations are reviewed code, not console commands; a destructive step needs an explicit, approved plan and a verified backup (`../operations/`).

## References are not requirements

Material here is **context, not commitment.** A migration plan is **not** approval to run it against real data. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
