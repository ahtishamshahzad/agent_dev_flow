# `.ai/templates/` — Reusable Templates (Index)

Reusable **document templates** — fill-in-the-blank, tool-neutral. They give consistent shape to briefs, plans, work items, decisions, reviews, and reports. A template is **not** application code and does **not** commit a stack. Copy a template into `../projects/current/` or the active `../work-items/` entry and complete the bracketed sections.

## Index

### Intake & Selection
| Template | Purpose |
|----------|---------|
| [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) | One-page problem/goals/success summary. |
| [`DISCOVERY_QUESTIONS.md`](DISCOVERY_QUESTIONS.md) | Blocking vs non-blocking questions + answers. |
| [`REQUIREMENTS.md`](REQUIREMENTS.md) | Functional/NFR + confirmed/assumptions/questions. |
| [`APPLICATION_SELECTION.md`](APPLICATION_SELECTION.md) | Which applications are needed, with justification. |
| [`STACK_RECOMMENDATION.md`](STACK_RECOMMENDATION.md) | Stack per area, alternatives, DB+data-layer pairing. |

### Architecture & Planning
| Template | Purpose |
|----------|---------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Boundaries, data flow, integrations, file-ownership map. |
| [`REPOSITORY_STRUCTURE.md`](REPOSITORY_STRUCTURE.md) | Single/monorepo layout, shared code. |
| [`PHASE_PLAN.md`](PHASE_PLAN.md) | Dynamic phases with exit criteria and execution mode. |
| [`TASK.md`](TASK.md) | A verifiable task with inputs/outputs/acceptance + scope. |

### Work Items
| Template | Purpose |
|----------|---------|
| [`FEATURE.md`](FEATURE.md) | Feature within architecture, no creep. |
| [`BUG.md`](BUG.md) | Reproduce → root cause → minimal fix → regression test. |
| [`REFACTOR.md`](REFACTOR.md) | Behavior-preserving, small reversible steps. |
| [`MIGRATION.md`](MIGRATION.md) | Incremental, reversible, backup + verify + cutover. |
| [`AUDIT.md`](AUDIT.md) | Read-only findings, Confirmed vs Potential. |

### Domain Plans
| Template | Purpose |
|----------|---------|
| [`API_CONTRACT.md`](API_CONTRACT.md) | Contract source of truth + breaking-change policy. |
| [`DATABASE_PLAN.md`](DATABASE_PLAN.md) | DB + data-layer decision, schema/index/transaction plan. |
| [`SECURITY_PLAN.md`](SECURITY_PLAN.md) | Data classes, threats→mitigations, controls checklist. |
| [`TEST_PLAN.md`](TEST_PLAN.md) | Per-app selection, required cases, coverage-by-risk. |

### Records & Delivery
| Template | Purpose |
|----------|---------|
| [`DECISION_RECORD.md`](DECISION_RECORD.md) | ADR: one decision, options, consequences. |
| [`RISK_REGISTER.md`](RISK_REGISTER.md) | Risks with likelihood/impact/owner/mitigation. |
| [`PROGRESS.md`](PROGRESS.md) | Living stage/gate/ownership record for re-entry. |
| [`PR_DESCRIPTION.md`](PR_DESCRIPTION.md) | What/why, testing, risks, checklist. |
| [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md) | Evidence-based Gate 7 readiness + approval. |
| [`INCIDENT_REPORT.md`](INCIDENT_REPORT.md) | Timeline, root cause, blameless postmortem + regression. |
| [`FINAL_AUDIT.md`](FINAL_AUDIT.md) | Aggregated reviews → go/no-go. |
| [`APP_DOC.md`](APP_DOC.md) | One unit of product documentation — screen, page, endpoint, or job. |

## Conventions

- Fill-in-the-blank and tool-neutral; delete guidance lines when completing.
- A template is not application code and does not commit a stack.
- Templates reference canonical rules/skills by path; they don't duplicate them.
- Register each new template in this index.

## Related

Prompts that drive these: `../prompts/`. Checklists that verify them: `../checklists/`. Rules: `../system/`.
