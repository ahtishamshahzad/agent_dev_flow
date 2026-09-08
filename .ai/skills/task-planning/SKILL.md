---
name: task-planning
description: Use to generate dynamic phases and break them into concrete, verifiable tasks with inputs, outputs, acceptance criteria, and dependencies. Produces the implementation plan approved at Gate 4. Phases are derived from real work, never a fixed template.
---

# Task Planning

## Purpose

Generate the implementation plan: dependency-ordered dynamic phases and concrete tasks with acceptance criteria. Implements `../../system/PHASE_GENERATION_RULES.md` and `TASK_GENERATION_RULES.md`. Feeds Gate 4.

## When to Use

- After architecture is set, to produce phases and tasks for approval.
- When re-planning because scope, dependencies, or discovered state changed.
- **Not** for a single obvious task with clear acceptance criteria already agreed.

## Inputs

- Architecture + repository layout.
- Selected applications, approved stack, requirement baseline.
- The relevant work-item type planning skill (feature/bug/refactor/migration).

## Discovery Questions

- What must exist before what (dependencies)?
- What is the critical path vs deferrable work?
- Which tasks can run in parallel; which touch the same files?
- What are the exit gates per phase?

## Responsibilities

- **Generate phases dynamically** from applications, dependencies, architecture, security, testing, deployment, and existing state.
- Break each phase into **tasks**: title, context, inputs, outputs, acceptance criteria, required skills, risk.
- Write each task's acceptance criteria as **Gherkin scenarios** (`../../system/GHERKIN_RULES.md`, `testing/gherkin-specifications`) — one behavior per scenario, observable outcomes. The scenario is the criterion; it is not restated in prose.
- Order tasks by dependency; mark **parallel-safe** vs **same-file** tasks.
- Attach an **exit gate** to each phase.
- Record everything in `../../work-items/` and `../../projects/current/`.

## Required Workflow

1. Read architecture + apps + stack + requirements.
2. Derive phases (dependency-ordered, right-sized).
3. For each phase, generate tasks with acceptance criteria.
4. Mark parallelizable tasks (input to `../../system/MULTI_AGENT_RULES.md`).
5. Attach testing/security requirements per phase.
6. Present for Gate 4; record on approval.

## Decision Rules

- No fixed roadmap — phases come from the actual work.
- Foundations (design system, contracts, auth) precede dependent features.
- Every bug work item includes a regression-test task.
- A task is parallel-safe only if its file scope is disjoint from concurrent tasks.
- Right-size: don't 7-phase a one-line change; don't one-phase a marketplace.

## Rules

- Every task states how it is verified (command/test/manual, or "unverified until run").
- Keep task notes concise; link, don't duplicate.
- No implementation before Gate 4 approval.

## Anti-Patterns

- Reusing one template roadmap for every project.
- Tasks with no acceptance criteria.
- Marking file-conflicting tasks as parallel.
- Over-granular tasks whose coordination cost exceeds the work.

## Validation Checklist

- [ ] Phases derived from real inputs (not a template).
- [ ] Dependency ordering explicit.
- [ ] Each task: inputs, outputs, acceptance criteria, skills, risk.
- [ ] Parallel-safe vs same-file tasks marked.
- [ ] Exit gate per phase.
- [ ] Testing/security requirements attached.
- [ ] Presented for Gate 4.

## Definition of Done

Approved dynamic phases and tasks (with acceptance criteria, dependencies, and gates) recorded in `../../work-items/` and `../../projects/current/`, ready for implementation.

## Related Skills

`architecture-design`, `feature-planning`, `bug-investigation`, `refactor-planning`, `migration-planning`, `testing-strategy`, `security-review`, `project-orchestrator`.

## Related Knowledge

`../../knowledge/` (architecture/domain).

## Related References

None typically.

## Context Loading Guidance

- **Requires:** architecture, apps, stack, requirements.
- **Does not require:** full source, unrelated references, review skills' bodies.
- **May load:** the matching work-item planning skill; `testing-strategy` for test tasks.
- **Stop when:** phases + tasks are approved (Gate 4).

## Token Efficiency Guidance

Plan from summaries. Keep task records lean — status, criteria, links. Generate the next phase's tasks in detail; keep later phases coarse until reached.
