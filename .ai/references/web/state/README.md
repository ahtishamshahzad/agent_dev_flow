# References — Web / State

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Web state-management reference material: where each value lives (local/form/shared/server/URL/persisted), store setup patterns, server-state caching/invalidation (TanStack Query / RTK Query) examples, and URL-state patterns.

## Supported file types

Markdown (`.md`) for patterns/notes; small code snippets in fenced blocks.

## Naming conventions

`kebab-case` by concern (`server-state.md`, `url-state.md`, `store-setup.md`).

## How agents should use it

Read when deciding where state belongs or wiring stores, alongside `../../../skills/web/web-state-management` and `web-server-state`. Keep server and client state separate.

## References are not requirements

Material here is **context, not commitment.** A state reference does **not** automatically become a requirement. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope.
