---
name: feature-planning
description: Use to plan a feature work item — scoping new capability within existing (or planned) architecture, defining its phases, tasks, tests, and acceptance criteria without expanding scope. Delegates general phase/task mechanics to task-planning.
---

# Feature Planning

## Purpose

Plan a feature: define its scope within the architecture, its design decisions, tasks, and tests, so it can be implemented and verified without scope creep. Produces a feature work item in `../../work-items/features/`.

## When to Use

- Request classified as **feature** (or a feature sub-part of a larger plan).
- When adding capability to an existing or planned architecture.
- **Not** for defect fixes (`bug-investigation`) or behavior-preserving cleanup (`refactor-planning`).

## Inputs

- Requirement baseline + success criteria.
- Architecture + repository layout.
- Existing patterns (from `existing-project-audit`) for consistency.

## Discovery Questions

- What exactly is in scope, and what is explicitly out?
- Which applications/modules does it touch?
- What are the acceptance criteria from the user's perspective?
- What tests prove it works (levels/tools)?
- Any security-sensitive surface (auth, payments, PII)?

## Responsibilities

- Define the feature's **scope and boundaries** (in/out).
- Fit it to existing **architecture and patterns**.
- Produce **tasks** (via `task-planning`) with acceptance criteria written as Gherkin scenarios (`testing/gherkin-specifications`, `../../system/GHERKIN_RULES.md`) — including the required cases, one scenario each.
- Attach a **testing plan** (`testing-strategy`) and **security requirements** (`security-review`) where relevant.
- Record the feature work item and its status.

## Required Workflow

1. Read requirements + architecture, and the existing scenarios for the area.
2. Lock scope (in/out) and acceptance criteria **as Gherkin scenarios** — happy, invalid, error, authorization denial, and the relevant edge cases — approved at Gate 2 before design (`../../system/GHERKIN_RULES.md`). The approved scenarios *are* the scope.
3. Identify affected apps/modules and contracts.
4. Generate tasks (delegate mechanics to `task-planning`).
5. Attach tests + security requirements.
6. Record in `../../work-items/features/`.
7. On a tracked project, hand to `project-management` to assign IDs, a phase, and a week — and to flag `SCOPE CHANGE` if the feature wasn't in the approved plan.

## Decision Rules

- Match existing conventions rather than introducing new patterns without cause.
- Security-sensitive features get integration/E2E tests, not just units.
- New work discovered mid-plan → propose a separate work item, don't absorb it.

## Rules

- Stay within the feature's stated scope.
- Preserve unrelated behavior.
- Acceptance criteria are observable and testable.

## Anti-Patterns

- Scope creep ("while I'm here…").
- Introducing a new stack/pattern for one feature.
- Shipping without acceptance criteria or tests.

## Validation Checklist

- [ ] Scope (in/out) explicit.
- [ ] Affected apps/modules identified.
- [ ] Acceptance criteria observable/testable.
- [ ] Tasks generated with criteria.
- [ ] Testing plan attached.
- [ ] Security requirements attached where relevant.

## Definition of Done

A recorded feature work item with locked scope, acceptance criteria, tasks, a testing plan, and any security requirements — ready for implementation under the gates.

## Related Skills

`task-planning`, `architecture-design`, `testing-strategy`, `security-review`, `code-review`, `project-orchestrator`, `project-management`.

## Related Knowledge

`../../knowledge/` (domain rules, patterns).

## Related References

`../../references/<domain-topic>/` when the feature domain needs grounding.

## Context Loading Guidance

- **Requires:** requirements, architecture, affected-area patterns.
- **Does not require:** unrelated modules, the full reference tree, other planning skills' bodies.
- **May load:** `task-planning`, `testing-strategy`, `security-review`.
- **Stop when:** the feature work item is recorded.

## Token Efficiency Guidance

Load only the affected modules' context. Reuse `task-planning` for mechanics rather than restating them. Keep the work item concise.
