# References — Database / Drizzle

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Drizzle reference material: schema-definition conventions, type inference patterns, relational-query vs core-query usage, migration generation workflow, and connection/pooling setup.

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`schema-conventions.md`, `query-patterns.md`, `migration-workflow.md`).

## How agents should use it

Read when the approved data layer is Drizzle, alongside `../../../skills/database/drizzle-relational` and `../../../skills/database/relational-schema-design`. Pair the layer with the approved store; never compare a database against an ORM.

## References are not requirements

Material here is **context, not commitment.** Material here does **not** authorize a data-layer choice; that is a gated decision. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
