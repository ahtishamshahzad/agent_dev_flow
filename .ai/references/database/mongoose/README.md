# References — Database / Mongoose

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Mongoose/MongoDB reference material: schema and sub-document conventions, embed-vs-reference decisions with their access patterns, index declarations, validation placement, and transaction/session usage limits.

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`embed-vs-reference.md`, `schema-conventions.md`, `session-usage.md`).

## How agents should use it

Read when the approved store is MongoDB, alongside `../../../skills/database/mongoose-mongodb` and `../../../skills/database/document-schema-design`. MongoDB fits genuinely variable documents with embedded access patterns — not strongly related relational data (`../../../skills/database/database-selection`).

## References are not requirements

Material here is **context, not commitment.** Material here does **not** authorize a database choice; that is a gated decision. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
