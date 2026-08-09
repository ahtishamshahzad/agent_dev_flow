# References — Database / Seed Data

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Seed and test-data reference material: the minimum viable dataset per environment, reference/lookup data that must exist, factory definitions, anonymisation rules for production-derived data, and idempotency/reset behaviour of seed scripts. **Never store real user data or production dumps.**

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`dev-dataset.md`, `lookup-data.md`, `anonymisation-rules.md`).

## How agents should use it

Read when creating or reviewing seeds and fixtures, alongside `../../../skills/database/seed-data` and the testing pack. Seeds must be idempotent and safe to re-run; environment-specific data never leaks between environments.

## References are not requirements

Material here is **context, not commitment.** Seed content is **context**, not a schema contract or a production fixture. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
