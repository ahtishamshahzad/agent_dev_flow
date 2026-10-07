---
name: refactor-planning
description: Use to plan a behavior-preserving structural improvement — audit the target, ensure test coverage exists, plan small reversible steps, and verify behavior is unchanged. Any intended behavior change is a feature, not a refactor.
---

# Refactor Planning

## Purpose

Plan a refactor that improves structure or quality **without changing external behavior**, in small reversible steps backed by tests. Produces a refactor work item in `../../work-items/refactors/`.

## When to Use

- Request classified as **refactor**, or cleanup enabling later work.
- **Not** when behavior should change (that's `feature-planning`) or when fixing a defect (`bug-investigation`).

## Inputs

- The target code and its current tests.
- The improvement goal (readability, decoupling, performance-neutral cleanup).

## Discovery Questions

- What is the concrete improvement goal, and how is "better" judged?
- Does adequate test coverage exist to prove behavior is preserved?
- What is the blast radius; who depends on this code?
- Can it be done in small, independently verifiable steps?

## Responsibilities

- **Audit** the target and its dependents.
- **Confirm/establish test coverage** before touching risky areas.
- Plan **small, reversible, behavior-preserving steps**.
- Define **verification** that behavior is unchanged at each step.
- Record the refactor work item.

## Required Workflow

1. Read the target + dependents + tests.
2. If coverage is inadequate, plan to add characterization tests first.
3. Break the refactor into small reversible steps.
4. Define per-step verification (tests green, behavior identical).
5. Record the work item (steps, risk, verification); on a tracked project, each step or group becomes a `TECH-` task scheduled by `project-management` (`../../system/PROJECT_MANAGEMENT_RULES.md`).

## Decision Rules

- Behavior-preserving by definition — any behavior change reclassifies as a feature.
- Add tests before refactoring under-covered risky code.
- Prefer many small steps over a big-bang rewrite.
- If risk is high and value low, recommend deferring.

## Rules

- Do not change observable behavior.
- Keep each step independently verifiable and revertible.
- Preserve public contracts unless the plan explicitly versions them.

## Anti-Patterns

- Big-bang rewrite with no rollback path.
- Refactoring untested, risky code without adding tests first.
- Slipping behavior changes into a "refactor."

## Validation Checklist

- [ ] Improvement goal explicit.
- [ ] Coverage confirmed or characterization tests planned.
- [ ] Steps small and reversible.
- [ ] Per-step verification defined.
- [ ] Behavior-preservation guaranteed by tests.

## Definition of Done

A recorded refactor work item with a clear goal, sufficient test coverage (or a plan to add it), small reversible steps, and per-step verification proving behavior is unchanged.

## Related Skills

`existing-project-audit`, `testing-strategy`, `task-planning`, `code-review`, `performance-review` (if perf-motivated), `project-orchestrator`, `project-management`.

## Related Knowledge

`../../knowledge/` (module contracts, invariants).

## Related References

`../../references/<topic>/` for patterns if needed.

## Context Loading Guidance

- **Requires:** target code, dependents, current tests, the goal.
- **Does not require:** unrelated modules, the full reference tree, unrelated skills.
- **May load:** `testing-strategy` (coverage), `performance-review` (if perf-driven).
- **Stop when:** steps + verification are recorded.

## Token Efficiency Guidance

Scope reading to the target and its direct dependents. Capture steps tersely; rely on tests as the verification record rather than prose.
