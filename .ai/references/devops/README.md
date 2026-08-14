# References — DevOps

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

DevOps reference material: repository and monorepo strategy notes, workspace/tooling configuration decisions (npm/pnpm workspaces, Turborepo), Docker and image-layering patterns, environment matrix and variable **names and purposes** (never values), CI/CD pipeline structure and stage ordering, deployment-target comparisons, staging parity notes, production-readiness records, rollback runbooks, and incident/postmortem records. **Never store secret values, tokens, or credentials — only their names and where they live.**

## Supported file types

Markdown (`.md`) for runbooks, matrices, and decisions; workflow/Dockerfile/compose **templates** in fenced blocks or template files; **no `.env` with real values.**

## Naming conventions

`kebab-case` by concern (`repo-strategy.md`, `ci-pipeline.md`, `env-matrix.md`, `rollback-runbook.md`, `postmortem-2026-05.md`).

## How agents should use it

Read when working on repository structure, CI/CD, containers, environments, deployment, monitoring, rollback, or incidents — alongside the devops pack (`../../skills/devops/README.md`). CI is generated from the applications that actually exist; deploy, publish, and remote-repository actions require **explicit user approval** (`../../system/GIT_WORKFLOW_RULES.md`, `../../system/QUALITY_GATES.md`). Deployment targets and cross-cutting ops runbooks may also live in `../deployment/` — keep one home per topic and cross-link rather than duplicating.

## References are not requirements

Material here is **context, not commitment.** A pipeline or runbook captured here is **not** an approval to deploy, publish, or change infrastructure. Requirements/tasks and gate approval govern the build (`../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
