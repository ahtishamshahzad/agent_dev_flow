# References — Backend / NestJS

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

NestJS application-structure reference material: module boundaries and imports, provider/DI conventions, guards vs interceptors vs pipes placement, DTO/validation setup, exception filters, and testing-module patterns.

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`module-boundaries.md`, `guards-vs-interceptors.md`, `dto-validation.md`).

## How agents should use it

Read when building or reviewing a NestJS service, alongside `../../../skills/backend/nestjs-foundation` and `../../../skills/backend/backend-api-architecture`. Only relevant once NestJS is the **approved** framework (`../../../skills/backend/backend-stack-selection`).

## References are not requirements

Material here is **context, not commitment.** A pattern captured here does **not** authorize a framework choice or a refactor. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
