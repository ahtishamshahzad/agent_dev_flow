---
name: project-orchestrator
description: Use as the lead skill for any non-trivial request. It drives the full request→approval pipeline (classify, audit, requirements, applications, stack, architecture, phases, tasks) and coordinates specialist skills. It plans and delegates; it does not implement every domain itself, and it stops before implementation until gates are approved. After approval it hands the plan to project-management for weekly tracking.
---

# Project Orchestrator

## Purpose

The orchestrator turns a raw request into an approved plan by running the canonical pipeline in `../../system/ORCHESTRATION_WORKFLOW.md` and delegating each stage to the right specialist skill. It owns gate enforcement, context discipline, and coordination — not the implementation of every domain.

## When to Use

- Any new project, enhancement, feature, or multi-step request.
- Any request whose type or scope is unclear and must be classified and planned.
- Whenever multiple specialist skills must be sequenced and their outputs reconciled.
- **Not** needed for a trivial, single-file change with an obvious, approved scope — use the specific specialist skill directly.

## Inputs

- The user request (verbatim) and any attached files, links, or repo.
- Current state in `../../projects/current/` (if a project is active) — `CURRENT_STATUS.md` first.
- The system rules in `../../system/` (canonical).

## Discovery Questions

Ask only what blocks a correct plan:
- What outcome does success look like, and for whom?
- Is there an existing codebase, or is this greenfield?
- Are there fixed constraints (platforms, deadlines, existing stack, compliance)?
- Does it handle money or sensitive PII (raises security/testing priority)?
- Any hard exclusions (things explicitly out of scope)?

## Responsibilities

1. **Classify the request** (delegate to `request-classification`).
2. **Inspect provided files and repository** (delegate to `existing-project-audit` when a codebase exists).
3. **Extract requirements** (delegate to `requirements-analysis`).
4. **Separate confirmed facts, assumptions, and questions** — keep these three lists explicit.
5. **Determine required applications** (delegate to `application-selection`).
6. **Recommend stack and alternatives** (delegate to `stack-recommendation`).
7. **Wait for approval** — Gate 2 (`../../system/QUALITY_GATES.md`).
8. **Design architecture** (delegate to `architecture-design`, `repository-architecture`).
9. **Select only relevant skills** (`../../system/SKILL_SELECTION_RULES.md`).
10. **Generate dynamic phases** (delegate to `task-planning`; `../../system/PHASE_GENERATION_RULES.md`).
11. **Generate work items and tasks** (`task-planning`, `feature-planning`, `bug-investigation`, etc.).
12. **Add testing and security requirements** (`testing-strategy`, `security-review`).
13. **Propose Git and GitHub workflow** (`git-workflow`, `github-repository`).
14. **Stop before implementation** until Gate 4 is approved.
15. **Hand off to tracking** — on approval, `project-management` assigns IDs and estimates and writes the roadmap and first week (`../../system/PROJECT_MANAGEMENT_RULES.md`).
16. **Route tracking requests** — status, week planning/review, blockers, reports, and meetings (type *project tracking*) go straight to `project-management`; bugs and mid-project additions go through its intake so they get an ID, a week, and a scope check.

The orchestrator **coordinates specialists**; it must not become the implementation agent for every domain.

## Required Workflow

```
Request
 → request-classification
 → existing-project-audit (if code exists)
 → requirements-analysis  → record confirmed / assumptions / questions
 → application-selection
 → stack-recommendation
 ── GATE 2: user approval (applications + stack) ──
 → architecture-design + repository-architecture
 → select relevant skills
 → dynamic phases + task-planning (+ feature/bug/refactor/migration planning)
 → testing-strategy + security-review requirements
 → git-workflow + github-repository proposal
 ── GATE 4: user approval (phases + tasks) ──
 → project-management: IDs, estimates, ROADMAP, PHASE-NN, WEEK-01, CURRENT_STATUS
 → STOP. Hand off to specialists for implementation, week by week.
```

Record stage and gate status in `CURRENT_STATUS.md` in `../../projects/current/` after each stage.

**Re-entry:** if `CURRENT_STATUS.md` exists, resume from it — never restart the pipeline. A project already past Gate 4 is in tracking: route the request by type instead of re-planning.

## Decision Rules

- If requirements are ambiguous and the ambiguity changes the plan → ask; otherwise proceed with a stated assumption.
- If a codebase exists → audit before proposing changes.
- If work divides safely and parallelism helps → propose multi-agent (`../../system/MULTI_AGENT_RULES.md`); else single-agent.
- If a specialist skill covers a stage → delegate; do not reimplement its logic inline.
- If a gate's inputs are unresolved → stop at the gate; do not "proceed to be helpful."
- If the request is a bug or new work on a tracked project → `project-management` intake first (duplicate check, ID, priority, week); new scope that changes the approved plan returns here as a `SCOPE CHANGE` for Gate 4.
- If the request only asks about or updates progress → `project-management`; no gates re-run.

## Rules

- `.ai/` is canonical; never duplicate system rules — reference them.
- No application code, dependency install, or stack commitment before Gates 2 and 4.
- Keep the three lists (confirmed / assumptions / questions) visible through planning.
- Coordinate, don't monopolize: delegate domain work to specialists.
- Keep `../../projects/current/` current; be honest about done vs proposed.

## Anti-Patterns

- Becoming the single agent that writes all code across all domains.
- Skipping classification or the audit and jumping to a stack.
- Presenting a stack before applications are selected and approved.
- Starting implementation before Gate 4.
- Loading every skill "to orchestrate" (violates token rules).

## Validation Checklist

- [ ] Request classified.
- [ ] Existing repo audited (or greenfield noted).
- [ ] Requirements extracted; confirmed/assumptions/questions separated.
- [ ] Applications selected with justification.
- [ ] Stack recommended with alternatives.
- [ ] Gate 2 approval recorded.
- [ ] Architecture + repository structure designed.
- [ ] Relevant skills selected (not all).
- [ ] Dynamic phases + tasks generated.
- [ ] Testing + security requirements attached.
- [ ] Git/GitHub workflow proposed.
- [ ] Stopped before implementation pending Gate 4.
- [ ] After approval: roadmap, IDs, and the first week handed to `project-management`.

## Definition of Done

A complete, approved plan exists in `../../projects/current/`: classification, requirements (with the three lists), selected applications, approved stack, architecture, relevant skills, dynamic phases, tasks with acceptance criteria, testing/security requirements, and a proposed git/GitHub workflow — with Gates 2 and 4 approved and implementation not yet begun.

## Related Skills

`request-classification`, `existing-project-audit`, `requirements-analysis`, `application-selection`, `stack-recommendation`, `architecture-design`, `repository-architecture`, `task-planning`, `project-management`, `feature-planning`, `bug-investigation`, `refactor-planning`, `migration-planning`, `testing-strategy`, `security-review`, `git-workflow`, `github-repository`, `ai-output-review`.

## Related Knowledge

`../../knowledge/` (project architecture/domain, once populated).

## Related References

`../../references/` topic folders relevant to the request (loaded selectively).

## Context Loading Guidance

- **Requires:** the request, `../../system/OPERATING_RULES.md`, `ORCHESTRATION_WORKFLOW.md`, `QUALITY_GATES.md`, and `../../projects/current/`.
- **Does not require:** application source detail, unrelated references, historical work items, or every other skill's body.
- **May load:** the specialist skill for the **current** stage only.
- **Stop when:** the plan is approved (Gate 4) and handed to `project-management` — do not implement.

## Token Efficiency Guidance

Load specialists one stage at a time and unload them after. Summarize each stage's output into `../../projects/current/` rather than carrying full working context forward. Reference system rules by path; never paste them.
