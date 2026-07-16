# `.ai/workflows/` — Named Workflows (Index)

Named, end-to-end and per-request-type workflows. The canonical pipeline lives in `../system/ORCHESTRATION_WORKFLOW.md`; this folder holds **variants** keyed to request classification.

## Request-type → workflow

Each request type may follow a different flow (all still respect the gates in `../system/QUALITY_GATES.md`):

| Request type | Emphasis |
|---|---|
| new project | full pipeline: classify → applications → stack → architecture → phases → build → test → release |
| existing project enhancement | audit first, then targeted phases |
| feature | scoped phases within existing architecture |
| bug | audit → reproduce → root cause → fix → regression test → validate |
| refactor | audit → plan safe steps → change behavior-preserving → verify |
| migration | audit → plan → migrate incrementally → verify → cut over |
| architecture review | analyze → assess → recommend (usually no code) |
| code review | review against checklists; report findings |
| security audit | security passes per `../system/SECURITY_RULES.md`; report |
| testing audit | assess coverage/levels; recommend/implement tests |
| deployment | release-readiness gate; environment/config; approved deploy |
| release | gate 7 checks; versioning; changelog; approved publish |

## Index

_No concrete workflow files in Phase 1._ Specific workflow documents are added per project/need.

| Workflow file | Request type | Notes |
|---------------|--------------|-------|
| _(none yet)_ | — | — |

## Conventions (when added)

A workflow file names its request type, its stages (referencing the canonical pipeline), its gates, and its typical phase shape. It must not contradict `../system/`.
