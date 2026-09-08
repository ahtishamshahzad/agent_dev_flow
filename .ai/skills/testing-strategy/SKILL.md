---
name: testing-strategy
description: Use to choose testing levels and tools per application and change, proportional to risk, and to define what "tested" means for the work. Aligns with the approved stack; every bug fix gets a regression test. Honest about what was actually run.
---

# Testing Strategy

## Purpose

Decide the testing levels and tools for a piece of work, sized to risk, and define the coverage that satisfies Gate 5. Implements `../../system/TESTING_SELECTION_RULES.md`.

## When to Use

- When planning a feature/bug/refactor/migration that needs tests.
- For a **testing audit** request type (assess existing coverage).
- **Not** to mandate blanket coverage regardless of risk.

## Inputs

- The change and its risk profile.
- Approved stack (test tooling must align).
- Existing test setup (`existing-project-audit`).

## Discovery Questions

- What is the risk level (auth/payments/data vs low-risk pure functions)?
- Which application(s) and levels are involved (unit/integration/E2E/contract)?
- What tooling already exists to align with?
- What is the critical path to cover first?

## Responsibilities

- Express what is being tested as **Gherkin scenarios** before choosing levels (`testing/gherkin-specifications`, `../../system/GHERKIN_RULES.md`) — the scenario set is the coverage definition, not a separate document.
- Choose **levels**: unit · integration · E2E · contract · regression.
- Choose **tools** per application (Jest · Vitest · Supertest · Playwright · Maestro · RNTL), aligned to the stack.
- Prioritize the **critical path**; record deferred coverage.
- Ensure every **bug fix has a regression test**.
- Define what "tested" means for the work (the Gate 5 bar).

## Required Workflow

1. Assess risk and affected applications.
2. Select levels matched to risk.
3. Select tools matched to each application and the stack.
4. Define required coverage + critical path.
5. Note what will actually be run vs "unverified until run."

## Decision Rules

- Match level to risk: auth/payments/data integrity → integration + E2E, not just units.
- Match tool to app: web → Playwright; mobile → Maestro; API → Supertest; RN components → RNTL.
- Every bug → a regression test.
- Test behavior and contracts, not churn-prone implementation detail.

## Rules

- Align with the approved stack — don't introduce a second runner without cause.
- Run what the environment allows; quote results.
- Flag unrun tests explicitly with the command.

## Anti-Patterns

- 100% coverage mandates that ignore risk.
- Testing implementation detail instead of behavior.
- Skipping regression tests on bug fixes.
- Claiming coverage from tests that never ran.

## Validation Checklist

- [ ] Levels matched to risk.
- [ ] Tools matched to apps + stack.
- [ ] Critical path prioritized; deferrals recorded.
- [ ] Regression test for any bug fix.
- [ ] "Tested" bar defined for Gate 5.
- [ ] Actually-run vs unrun stated honestly.

## Definition of Done

A recorded testing plan: levels, tools, critical-path coverage, regression tests for fixes, and a clear Gate 5 bar — with honest notes on what was run vs unverified.

## Related Skills

`testing/gherkin-specifications`, `feature-planning`, `bug-investigation`, `refactor-planning`, `migration-planning`, `code-review`, `stack-recommendation`, `project-orchestrator`.

## Related Knowledge

`../../knowledge/` (critical paths, invariants).

## Related References

`../../references/<testing-topic>/` for tool usage if needed.

## Context Loading Guidance

- **Requires:** the change, its risk, the approved stack, existing test setup.
- **Does not require:** unrelated modules, the full reference tree, planning skills' bodies.
- **May load:** the relevant planning skill for context; one testing reference folder.
- **Stop when:** the testing plan/bar is recorded.

## Token Efficiency Guidance

Decide from the risk + stack summary. Keep the plan terse; link tool docs rather than pasting them.
