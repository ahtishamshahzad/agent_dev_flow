---
name: mobile-unit-testing
description: Use to plan unit tests for mobile logic — Jest (or Vitest where supported) for pure functions, hooks, reducers, and utilities. Test behavior, not implementation; align with the approved stack.
---

# Mobile Unit Testing

## Purpose

Plan unit tests for mobile logic: Jest (or Vitest where supported) covering pure functions, hooks, reducers, validation, and utilities — testing behavior, not internals.

## When to Use

- When implementing logic worth verifying in isolation.
- Not for full user flows (`mobile-maestro-e2e`) or rendered components (`mobile-component-testing`).

## Inputs

- The logic under test and its behavior contract.
- Approved test runner (Jest/Vitest).

## Discovery Questions

- Which logic is pure/isolatable (functions, hooks, reducers, validation)?
- What behaviors/edge cases must be covered?
- Which runner does the stack use (Jest typically for RN)?

## Responsibilities

- Plan **unit tests** for pure functions, hooks, reducers, validation, utilities.
- Cover **behavior and edge cases**, not implementation detail.
- Align with the **approved runner** (Jest/Vitest).
- Coordinate broader coverage with `../../testing-strategy`.

## Required Workflow

1. Identify isolatable logic.
2. Define behaviors/edge cases to cover.
3. Write unit tests with the chosen runner.
4. Run + record results (or flag unrun).
5. Record the unit-test plan.

## Decision Rules

- Test behavior and contracts, not churn-prone internals.
- Jest is the common RN runner; use Vitest only where the stack supports it.
- Prioritize logic with real branching/edge cases.
- A bug-fix's regression test starts here where the logic is unit-level.

## Rules

- Align with the approved runner.
- Test behavior, not implementation.
- Run tests or flag 'unverified until run'.

## Anti-Patterns

- Testing implementation detail that will churn.
- Introducing a second runner without cause.
- Skipping edge cases.
- Claiming coverage from unrun tests.

## Validation Checklist

- [ ] Isolatable logic identified.
- [ ] Behaviors/edge cases covered.
- [ ] Approved runner used.
- [ ] Tests run (or flagged).
- [ ] Coordinated with testing-strategy.

## Definition of Done

A recorded unit-test plan and tests: behavior-focused coverage of isolatable logic on the approved runner, run or explicitly flagged unrun — aligned with `../../testing-strategy`.

## Related Skills

`../../testing-strategy`, `mobile-component-testing`, `mobile-maestro-e2e`, `mobile-validation`, `mobile-state-management`

## Related Knowledge

`../../../knowledge/` (behavior contracts).

## Related References

`../../../references/mobile/state/` when populated.

## Context Loading Guidance

- **Requires:** the logic under test + behavior contract, the runner.
- **Does not require:** unrelated modules, the full mobile skill set, unrelated references.
- **May load:** `../../testing-strategy` for the overall plan.
- **Stop when:** unit tests are written and run (or flagged).

## Token Efficiency Guidance

Focus on the logic in scope; don't load the whole app to unit-test a function.
