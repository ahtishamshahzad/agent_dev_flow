# References — Backend / Performance

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Backend performance reference material: profiling output, hotspot analyses, N+1 and over-fetch findings with evidence, caching strategy and invalidation rules, payload-size decisions, and load/soak test results with the conditions they were run under.

## Supported file types

Markdown (`.md`) for analyses; profiler/load-test output in fenced blocks or attached result files.

## Naming conventions

`kebab-case` by concern or date (`n-plus-one-findings.md`, `cache-strategy.md`, `load-test-2026-05.md`).

## How agents should use it

Read when investigating or reviewing performance, alongside `../../../skills/backend/backend-performance`. Measure before optimizing; a claim without a measurement is a guess. Database-side offenders belong in `../../database/performance/` and are fixed via `../../../skills/database/indexing`.

## References are not requirements

Material here is **context, not commitment.** A measured number is **context**, not a target; performance targets come from requirements. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
