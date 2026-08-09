# References — Database / Prisma

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Prisma reference material: `schema.prisma` conventions, naming and mapping rules, relation modelling decisions, client instantiation/pooling pattern, generated-type usage, and query patterns that avoid N+1.

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`schema-conventions.md`, `client-pooling.md`, `relation-patterns.md`).

## How agents should use it

Read when the approved data layer is Prisma, alongside `../../../skills/database/prisma-relational` and `../../../skills/database/relational-schema-design`. The database and the data layer are separate decisions — Prisma is the layer, not the store (`../../../skills/database/database-selection`).

## References are not requirements

Material here is **context, not commitment.** Material here does **not** authorize a data-layer choice; that is a gated decision. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
