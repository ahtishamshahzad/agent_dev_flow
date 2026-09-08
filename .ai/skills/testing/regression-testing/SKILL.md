---
name: regression-testing
description: Use to ensure every fixed bug and every critical behavior stays fixed — a failing-first test per bug at the lowest level that reproduces it, plus a maintained regression suite gating CI so old breakage can't silently return.
---

# Regression Testing

## Purpose

Stop fixed bugs from coming back and protect critical behaviors from silent breakage: a **regression test per bug** (written failing, then passing) and a maintained suite that gates every change.

## When to Use

- After every bug fix (`../../bug-investigation` closes with a regression test).
- When protecting a critical behavior from future refactors.
- **Not** as a separate late phase — regression tests are written *with* each fix, at the right level.

## Inputs

- The bug's root cause + reproduction (`../../bug-investigation`).
- The test level that reproduces it (unit / integration / API / E2E).

## Discovery Questions

- What is the minimal reproduction, and at what level does it live (prefer the lowest)?
- Does the test **fail before** the fix and **pass after** (proving it guards the right thing)?
- Is this class of bug likely elsewhere (parametrize/broaden the guard)?

## Responsibilities

- Take the behavior to be covered from its **Gherkin scenarios** (`gherkin-specifications`) — implement one test per scenario rather than inventing a parallel case list.
- For each fixed bug, write a test that **reproduces it and fails on the unfixed code**, then passes with the fix — at the **lowest level** that captures it (unit if logic, integration if wiring, API if endpoint, E2E only if genuinely end-to-end).
- Name the test for the bug/behavior it guards so a future failure is self-explaining.
- **Maintain a regression suite** as part of the normal test suites (not a separate silo), run in CI on every change (`../../devops/ci-cd`) — a regression test that isn't run guards nothing.
- Broaden where a bug reveals a class (boundary families, all enum values) rather than pinning one input.
- Keep regression tests **behavioral** (outcomes), so they survive refactors and still catch the reintroduction.

## Required Workflow

1. Reproduce the bug at the lowest capturing level.
2. Write the test; confirm it **fails** on unfixed code.
3. Apply/confirm the fix; the test now passes.
4. Generalize if it's a class of bug.
5. Land it in the CI-gated suite alongside the fix.

## Decision Rules

- Lowest level that reproduces — a unit regression beats an E2E one for the same bug (faster, stabler).
- A regression test that passes before the fix isn't testing the fix — it must fail first.
- Behavioral assertions over implementation snapshots, so refactors don't force rewrites that lose the guard.
- No fix merges without its regression test (`../../code-review` gate).

## Rules

- Every bug fix ships with a failing-first regression test.
- Regression tests run in CI, not on demand.
- Guards are named for what they protect.

## Anti-Patterns

- Fixing a bug with no test — inviting its return.
- A regression test that never failed (proves nothing).
- Snapshot regressions that break on every refactor and get blanket-updated.
- A separate regression suite nobody runs.
- Pinning one input when the bug is a whole boundary class.

## Validation Checklist

- [ ] Each fixed bug has a test at the lowest capturing level.
- [ ] Test fails on unfixed code, passes after fix.
- [ ] Named for the guarded bug/behavior.
- [ ] Generalized where it's a class.
- [ ] In the CI-gated suite.

## Definition of Done

Every fixed bug guarded by a failing-first, behavioral regression test at the lowest capturing level, living in the CI-gated suite so the breakage cannot silently return.

## Related Skills

`../../bug-investigation`, `unit-testing`, `integration-testing`, `api-integration-testing`, `test-coverage-audit`, `../../code-review`, `../../devops/ci-cd`, `../../security/security-regression-testing`.

## Related Knowledge

`../../../knowledge/` (past incidents, critical behaviors).

## Related References

`../../../references/testing/` (regression patterns, when populated).

## Context Loading Guidance

- **Requires:** the bug's root cause + reproduction, the capturing level.
- **Does not require:** the whole test suite, unrelated modules.
- **May load:** the matching level skill (`unit-testing`/`integration-testing`/...).
- **Stop when:** the failing-first test is in the CI-gated suite.

## Token Efficiency Guidance

One test per bug at the right level; reason about the reproduction, not the surrounding suite.
