---
name: unit-testing
description: Use to plan and write unit tests for pure logic — functions, services, reducers, hooks — with Jest or Vitest, isolated from I/O, covering happy path, invalid input, and error path deterministically. Risk-driven, not coverage-percentage-driven.
---

# Unit Testing

## Purpose

Test units of logic in isolation — fast, deterministic, independent of network/DB/filesystem — so behavior is pinned and refactors are safe. The base of the pyramid; tooling chosen by `testing-selection`.

## When to Use

- For logic-bearing units: pure functions, service methods, reducers, custom hooks, validators, mappers.
- **Not** for cross-boundary behavior (`integration-testing`, `api-integration-testing`) or UI trees (`../../backend`/component skills / Testing Library).

## Inputs

- Selected runner (Jest or Vitest — `testing-selection`).
- The unit + its dependencies (ideally behind interfaces).

## Discovery Questions

- Which modules hold real logic vs trivial pass-throughs not worth testing?
- Is the unit constructible with test doubles (DI / explicit deps)?
- What must be controlled for determinism (clock, randomness, IDs)?

## Responsibilities

- Take the behavior to be covered from its **Gherkin scenarios** (`gherkin-specifications`) — implement one test per scenario rather than inventing a parallel case list.
- Cover, per unit, the **required cases**: **happy path**, **invalid input** (bad types, out-of-range, empty, boundary), and **error path** (dependency throws, precondition fails) — error behavior is logic, not an afterthought.
- Isolate with focused doubles at **owned boundaries** (repository/provider interfaces); don't mock deep internals or the framework.
- Keep tests **deterministic**: fake clock, seeded/injected randomness and IDs, no real I/O, no order dependence.
- Assert **outcomes**, not implementation (no asserting internal call sequences); name tests by the rule they prove.
- Add a **regression test for every bug fixed** here (`regression-testing`, `../../bug-investigation`).
- Run as the fast CI tier (`../../devops/ci-cd`), gating every change.

## Required Workflow

1. Identify logic-bearing units; skip trivial plumbing.
2. Ensure constructibility with doubles (flag DI gaps upstream).
3. Write happy / invalid-input / error-path cases per unit.
4. Control time/randomness/IDs; verify repeat-run stability.
5. Keep the suite fast and CI-gating.

## Decision Rules

- Risk drives what to test deeply — not a coverage target (`test-coverage-audit`); uncovered *logic* matters, uncovered getters don't.
- Mock at owned interface boundaries only; over-mocking pins implementation and rots on refactor.
- A test that re-computes the implementation's math proves nothing — assert known input→output pairs.
- If a unit is hard to test, that's a design signal — fix the seams, don't pile on mocks.

## Rules

- No network/DB/real-clock in unit tests.
- One behavior per test; a failure names the broken rule.
- Bug fixes land with the failing-then-passing test.

## Anti-Patterns

- Testing only the happy path.
- Mock setup longer than the logic under test.
- Snapshot tests standing in for behavioral assertions.
- Chasing 100% by testing trivial accessors.
- Asserting call order instead of results.

## Validation Checklist

- [ ] Logic-bearing units identified; plumbing skipped.
- [ ] Happy + invalid-input + error-path covered per unit.
- [ ] Doubles at owned boundaries only.
- [ ] Deterministic (clock/ID/randomness/no I/O).
- [ ] Regression tests for fixed bugs.
- [ ] Fast, CI-gating.

## Definition of Done

A fast, deterministic unit suite covering happy, invalid-input, and error paths for the logic that matters — isolated at owned boundaries, risk-prioritized, gating CI.

## Related Skills

`testing-selection`, `integration-testing`, `regression-testing`, `test-coverage-audit`, `../../bug-investigation`, `../../code-review`, `../../devops/ci-cd`.

## Related Knowledge

`../../../knowledge/` (domain rules worth encoding as tests).

## Related References

`../../../references/testing/` (conventions, when populated).

## Context Loading Guidance

- **Requires:** the unit + its interface deps, the chosen runner.
- **Does not require:** the whole app, route/DB setup, unrelated modules.
- **May load:** `regression-testing`, `test-coverage-audit`.
- **Stop when:** the unit's required cases are covered and stable.

## Token Efficiency Guidance

A case → expected-outcome table per unit beats prose; read the unit and its interfaces, not the whole module tree.
