# Workflow: Refactor

> Behavior-preserving change in small, reversible, test-backed steps. Structure/clarity only — no new behavior.

## Request Classification

**Primary type:** refactor. Selected when improving internal structure without changing external behavior.

## Skills Required

`../skills/refactor-planning`, `../skills/testing/test-coverage-audit` + `../skills/testing/regression-testing` (safety net), the relevant domain skill, `../skills/code-review` (+ `../skills/performance-review` if perf-driven).

## Agents Involved

`orchestrator` → the owning engineer → `test-engineer` (safety-net/characterization tests) → `code-reviewer`. Single-agent or sequential; parallel only across genuinely disjoint modules with a shared contract held stable.

## Context Required

The target area, its current behavior, and its test coverage. Bounded to the refactor's scope.

## Gates

Gate 5 (behavior preserved — tests green before and after), Gate 6 (review). Architecture gates only if boundaries change (then it's not a pure refactor).

## Documents Generated

Refactor plan (small steps), characterization/safety-net tests if added, review note.

## Validation

Behavior is **unchanged** — the same tests pass before and after; each step is independently verifiable and reversible; no feature slipped in.

## Handoff

Plan → add safety net → refactor in steps → verify → review, via Handoff Format.

## Stop Condition

- **Stop** if the target behavior is untested and characterization tests aren't added first (`../hooks/before-refactor.md`).
- **Stop** and reclassify if the change alters behavior (feature/bugfix, not refactor).
- **Complete** when structure improved, behavior preserved (tests green), reviewed.

## Related

Hook: `before-refactor`. Skills: `../skills/refactor-planning`, `../skills/testing/test-coverage-audit`.
