---
name: web-unit-testing
description: Use to plan web unit tests — Vitest (default with Vite, also fine for Next.js) or Jest for pure logic, hooks, utilities, and schema validation; fast, deterministic, colocated. Coverage goes where the logic is; DOM-heavy behavior belongs to component tests.
---

# Web Unit Testing

## Purpose

Plan the unit-test layer: fast, deterministic tests for pure logic — utilities, hooks, reducers/stores, validation schemas, data mappers — under the app's chosen runner. One layer of the strategy from `../../testing-strategy`; component and E2E layers sit above it.

## When to Use

- When setting up the testing foundation for a web app.
- When business logic accumulates untested, or unit tests have become slow/flaky/DOM-entangled.
- **Not** for rendered-component behavior (`web-component-testing`) or user journeys (`playwright-e2e`).

## Inputs

- Framework foundation (Vite → Vitest is the natural fit; Next.js → Vitest or Jest, decided once).
- The logic inventory: where non-trivial pure logic actually lives.
- CI expectations (`../../testing-strategy`, `web-deployment`).

## Discovery Questions

- Which modules hold real logic worth unit coverage (pricing, parsing, permissions mapping, schema rules)?
- Runner decision: Vitest or Jest — what does the stack make natural, and is there an existing investment?
- What's the colocation/naming convention (`*.test.ts` beside source is the default)?
- What runs on every push vs pre-merge (speed budget for the unit layer)?

## Responsibilities

- **Select the runner** with justification (Vitest default on Vite for config unity and speed; either works on Next.js — don't run both).
- Define **what belongs in this layer**: pure functions, hooks (via testing-library's hook utilities where needed), store/reducer logic, Zod/schema validation rules (`web-forms`), API error mapping (`web-api-integration`) — no DOM assertions, no network.
- Set **conventions**: colocated files, clear naming, Arrange-Act-Assert, one behavior per test, table-driven cases for rule matrices.
- Keep tests **deterministic**: fake timers/dates where time matters, no real network/fs, seeded randomness.
- Wire into **CI** as the fast always-on layer; keep the suite fast enough that nobody skips it.
- Target coverage **where logic lives** — business rules and edge cases — not a blanket percentage chased through trivial files.

## Required Workflow

1. Confirm the runner with the foundation skill's stack decision.
2. Inventory logic-bearing modules; rank by risk.
3. Define conventions (location, naming, determinism rules).
4. Plan coverage for the ranked inventory, edge cases first.
5. Wire into CI; record what's covered and what's deliberately not.

## Decision Rules

- If a test needs the DOM, it's a component test — move it up a layer.
- If a test needs a real network or service, it's not a unit test — mock at the module edge or move it up.
- Extract logic out of components to make it unit-testable, rather than testing it through renders.
- A regression test accompanies every logic bug fix (`../../bug-investigation`).

## Rules

- Unit tests run in CI on every push; a red unit suite blocks merge.
- No snapshot tests as a substitute for asserting behavior.
- Test names state the expected behavior, not the function name.

## Anti-Patterns

- Chasing a coverage percentage through index files and type re-exports.
- Unit tests that render half the app to check a formatting function.
- Mock setups so heavy the test verifies the mocks.
- Flaky time/locale-dependent tests nobody trusts.

## Validation Checklist

- [ ] Runner selected with justification; single runner for the layer.
- [ ] Logic inventory ranked; layer boundaries respected (no DOM/network).
- [ ] Conventions defined (colocation, naming, determinism).
- [ ] Edge-case coverage planned for risk-ranked modules.
- [ ] CI wiring defined; suite speed acceptable.

## Definition of Done

A recorded unit-testing plan — runner choice, layer boundaries, conventions, risk-ranked coverage targets, and CI wiring — producing a fast suite the team runs constantly and trusts.

## Related Skills

`../../testing-strategy`, `web-component-testing`, `playwright-e2e`, `web-forms`, `web-api-integration`, `../../bug-investigation`, `vite-react-foundation`, `nextjs-foundation`.

## Related Knowledge

`../../../knowledge/` (business rules worth encoding as tests).

## Related References

`../../../references/web/testing/` (conventions, examples — when populated).

## Context Loading Guidance

- **Requires:** stack decision, logic inventory, CI expectations.
- **Does not require:** UI component detail, deployment specifics.
- **May load:** `web-component-testing` to draw the layer boundary precisely.
- **Stop when:** the plan and conventions are recorded.

## Token Efficiency Guidance

Rank modules by risk in a short table; don't enumerate every function. Conventions stated once govern the whole layer.
