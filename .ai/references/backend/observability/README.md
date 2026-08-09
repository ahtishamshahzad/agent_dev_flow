# References — Backend / Observability

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Observability reference material: the log taxonomy and required fields, correlation/request-id propagation, metric and SLO catalogue, trace span naming, dashboard inventory, and alert routes with their thresholds and owners. **Sample log lines must be redacted — no PII, tokens, or secrets.**

## Supported file types

Markdown (`.md`) for catalogues and notes; **redacted** log/metric samples in fenced blocks.

## Naming conventions

`kebab-case` by concern (`log-taxonomy.md`, `slo-catalogue.md`, `alert-routes.md`).

## How agents should use it

Read when instrumenting or reviewing a service, alongside `../../../skills/backend/backend-observability` and `../../../skills/devops/monitoring-logging`. An alert without an owner and a runbook is noise — record both here.

## References are not requirements

Material here is **context, not commitment.** A proposed SLO is **not** a commitment until it is agreed and instrumented. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
