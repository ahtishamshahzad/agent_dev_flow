# `.ai/work-items/` — Units of Work

Work items are the concrete units the system plans and executes. Each is classified by type and holds its own tasks, decisions, and status.

## Types

| Folder | Type | Typical shape |
|--------|------|---------------|
| `features/` | Feature | scoped phases within existing architecture |
| `bugs/` | Bug | audit → reproduce → root cause → fix → regression test → validate |
| `refactors/` | Refactor | audit → plan → behavior-preserving change → verify |
| `audits/` | Audit | analyze → assess → report (architecture/security/testing) |
| `migrations/` | Migration | audit → plan → incremental migrate → verify → cut over |

## A work item records

- **Type & title**
- **Link to project/phase** in `../projects/current/`
- **Tasks** with inputs/outputs/acceptance criteria (`../system/TASK_GENERATION_RULES.md`)
- **Required skills** (`../system/SKILL_SELECTION_RULES.md`)
- **Status** and decisions (concise — `../system/TOKEN_OPTIMIZATION_RULES.md`)

## Conventions

- One folder per type; one file (or subfolder) per work item.
- Don't load historical/closed work items unless relevant to the current task.
- Keep status current; close items when done.

## Index

_No work items in Phase 1._ Each subfolder has its own README describing that type.
