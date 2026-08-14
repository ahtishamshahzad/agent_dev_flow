# References — Backend / Express

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Express application-structure reference material: app/router composition, middleware ordering (parsers → context → auth → route → error), route module conventions, error-middleware shape, and typed request/response helpers used in the project.

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`middleware-order.md`, `router-structure.md`, `error-middleware.md`).

## How agents should use it

Read when building or reviewing an Express service, alongside `../../../skills/backend/express-foundation` and `../../../skills/backend/backend-api-architecture`. Only relevant once Express is the **approved** framework — it is never a default (`../../../skills/backend/backend-stack-selection`).

## References are not requirements

Material here is **context, not commitment.** A pattern captured here does **not** authorize a framework choice or a refactor. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
