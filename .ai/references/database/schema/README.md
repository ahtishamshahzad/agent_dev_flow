# References — Database / Schema

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Schema reference material: ER diagrams, entity and relationship notes, key and constraint decisions (unique, FK, check, not-null) with the invariant each protects, enum/lookup strategy, soft-delete and audit-column conventions, and tenancy/ownership columns.

## Supported file types

Markdown (`.md`) for notes; ER diagrams; DDL excerpts in fenced blocks.

## Naming conventions

`kebab-case` by area (`er-overview.md`, `tenancy-model.md`, `constraints.md`).

## How agents should use it

Read when designing or reviewing schema, alongside `../../../skills/database/relational-schema-design` or `../../../skills/database/document-schema-design`. Constraints enforce invariants — application checks alone do not. Ownership/tenant columns are what `../../../skills/backend/ownership-authorization` filters on.

## References are not requirements

Material here is **context, not commitment.** A modelled entity is **not** a committed schema until its migration is reviewed and applied. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
