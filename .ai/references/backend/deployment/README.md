# References — Backend / Deployment

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Backend deployment and release reference material: runtime/process configuration, health and readiness endpoints, migration-vs-deploy ordering, zero-downtime and rollback sequences, scaling notes, and environment variable **names and purposes** (never values).

## Supported file types

Markdown (`.md`) for runbooks and ordering notes; config **templates** in fenced blocks; **no `.env` with real values.**

## Naming conventions

`kebab-case` by concern (`release-ordering.md`, `health-checks.md`, `env-template.md`).

## How agents should use it

Read when planning or reviewing a backend deploy, alongside `../../../skills/backend/backend-deployment` and the devops pack (`../../../skills/devops/README.md`). Cross-cutting pipeline/target material belongs in `../../deployment/`; keep service-specific ordering here.

## References are not requirements

Material here is **context, not commitment.** A deployment note is **not** an approval to deploy — remote/publish/deploy actions require explicit user approval. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
