# References — Database / Operations

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Database operations reference material: backup schedule and retention, **restore-test records with dates and outcomes**, point-in-time-recovery capability, failover/replica topology, maintenance windows, capacity and growth tracking, and incident records.

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`backup-schedule.md`, `restore-test-2026-05.md`, `replica-topology.md`).

## How agents should use it

Read when planning backups, restores, or database incidents, alongside `../../../skills/database/backup-recovery` and `../../../skills/devops/incident-readiness`. **An untested backup does not count** — the restore record here is the evidence.

## References are not requirements

Material here is **context, not commitment.** A documented backup policy is **not** a verified recovery capability until a restore has been tested and recorded. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
