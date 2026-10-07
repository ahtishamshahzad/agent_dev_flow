# `.ai/projects/current/` — Active Project State

The live record for the active project. The orchestrator reads and updates this as the pipeline advances (`../../system/ORCHESTRATION_WORKFLOW.md`). Keep it concise; it is the re-entry point for any agent resuming work.

## Layout

Planning outputs (sections below) live here as the pipeline produces them. Once Gate 4 is approved, `../../skills/project-management` adds the tracking files (rules: `../../system/PROJECT_MANAGEMENT_RULES.md`):

```
current/
├── PROJECT.md  ROADMAP.md  CURRENT_STATUS.md  DECISIONS.md  RISKS.md
├── phases/PHASE-NN.md      weekly/WEEK-NN.md
├── reports/WEEK-NN-REPORT.md   meetings/MEETING-NNN.md
└── logs/DEVELOPMENT-LOG.md  BUG-LOG.md  CHANGE-LOG.md
```

Bugs themselves are work items — `BUG-NNN.md` in `../../work-items/bugs/`, indexed by `logs/BUG-LOG.md`. Create each file when it first has something true to say — never as an empty scaffold. **`CURRENT_STATUS.md` is read first on re-entry**; it holds the stage, gate status, phase, week, and open work.

## Sections to maintain (create files/entries as work begins)

1. **Request** — original request + classification (`../../system/ORCHESTRATION_WORKFLOW.md`).
2. **Requirements** — goals, constraints, users, success criteria, assumptions.
3. **Repo audit** — findings, if an existing codebase (else "greenfield").
4. **Open questions** — blocking questions and their answers.
5. **Applications selected** — with justification; deferred/excluded candidates (`../../system/APPLICATION_SELECTION_RULES.md`).
6. **Stack (approved)** — per-area recommendation table + approval note (`../../system/STACK_DECISION_RULES.md`).
7. **Architecture** — boundaries, data flow, integration points.
8. **Skills loaded** — which and why (`../../system/SKILL_SELECTION_RULES.md`).
9. **Phases** — dynamically generated, dependency-ordered (`../../system/PHASE_GENERATION_RULES.md`).
10. **Tasks** — per phase, with acceptance criteria (link to `../../work-items/`).
11. **Gate status** — the checklist below (kept in `CURRENT_STATUS.md` once it exists).
12. **Tracking** — roadmap, weeks, bugs, logs, reports, meetings (after Gate 4; see Layout).

## Gate status (template)

| Gate | Status | Approved by / date | Notes |
|------|--------|--------------------|-------|
| 1. Requirements | ☐ pending | — | — |
| 2. Application & stack (user approval) | ☐ pending | — | — |
| 3. Architecture | ☐ pending | — | — |
| 4. Implementation readiness (user approval) | ☐ pending | — | — |
| 5. Testing | ☐ pending | — | — |
| 6. Security & quality review | ☐ pending | — | — |
| 7. Release readiness | ☐ pending | — | — |

_(See `../../system/QUALITY_GATES.md`. No code before gates 2 and 4 are approved.)_

## Status

No active application project yet — this is the empty, ready state.
