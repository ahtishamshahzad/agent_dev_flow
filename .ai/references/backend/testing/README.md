# References — Backend / Testing

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Backend test reference material: unit vs integration boundaries for this service, fixture and factory conventions, database-under-test strategy (transactional rollback, per-worker schema, containers), external-service stubbing rules, contract-test setup, and coverage expectations by area.

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`db-test-strategy.md`, `fixtures.md`, `stubbing-rules.md`).

## How agents should use it

Read when writing or reviewing backend tests, alongside `../../../skills/backend/backend-unit-testing`, `../../../skills/backend/backend-integration-testing`, and `../../testing/api/`. Authorization gets **negative** tests: the wrong user must be proven unable to act.

## References are not requirements

Material here is **context, not commitment.** A documented convention is **not** coverage — tests count only when they run and pass. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
