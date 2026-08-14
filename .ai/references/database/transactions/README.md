# References — Database / Transactions & Concurrency

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Correctness reference material: the invariants that must hold atomically, transaction boundaries at service level, isolation-level decisions and the anomalies they accept, locking strategy (optimistic vs pessimistic), idempotency-key design, and known race conditions with their resolutions.

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by invariant (`order-placement.md`, `inventory-decrement.md`, `idempotency-keys.md`).

## How agents should use it

Read when correctness under concurrency matters — money, inventory, state machines — alongside `../../../skills/database/transactions` (one operation atomic) and `../../../skills/database/concurrency` (operations colliding). No external calls inside a transaction; use an outbox for side effects. Job handlers rely on this (`../../backend/jobs/`).

## References are not requirements

Material here is **context, not commitment.** A documented invariant is **not** enforced until a constraint or test proves it. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
