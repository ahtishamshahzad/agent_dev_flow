# References — Backend / Jobs & Queues

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Asynchronous work reference material: the job catalogue (name, trigger, payload, expected duration), queue topology and queue-per-class rationale, retry/backoff policy, dead-letter handling, idempotency requirements, schedule tables for recurring work, and concurrency/worker sizing notes.

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`job-catalogue.md`, `retry-policy.md`, `schedule-table.md`, `dlq-handling.md`).

## How agents should use it

Read when designing or reviewing async work, alongside `../../../skills/backend/background-jobs` (behaviour), `../../../skills/backend/queues` (transport), and `../../../skills/backend/scheduled-jobs` (time triggers). Delivery is at-least-once — handlers must be idempotent (`../../database/transactions/`).

## References are not requirements

Material here is **context, not commitment.** A job listed here is **not** scheduled until it exists and its schedule is approved. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
