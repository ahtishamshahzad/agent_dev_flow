---
name: web-component-testing
description: Use to plan component tests — React Testing Library with user-event, accessible queries (getByRole first), MSW for network boundaries, testing behavior not implementation, and knowing jsdom's limits (real-browser behavior belongs to Playwright). Avoid snapshot overuse.
---

# Web Component Testing

## Purpose

Plan the component-test layer: rendered components exercised the way users interact with them — accessible queries, real events via user-event, network mocked at the boundary with MSW — asserting behavior, not implementation detail. Sits between `web-unit-testing` and `playwright-e2e`.

## When to Use

- When components carry interaction logic worth verifying (forms, tables, dialogs, gated UI).
- When existing component tests are brittle (implementation-coupled, snapshot-heavy) or missing.
- **Not** for pure logic (`web-unit-testing`) or cross-page journeys (`playwright-e2e`).

## Inputs

- The component inventory, prioritized by interaction complexity and risk.
- Unit-layer runner decision (`web-unit-testing`) — component tests share it (jsdom environment).
- API shapes for MSW handlers (`web-api-integration`).

## Discovery Questions

- Which components have behavior worth testing (conditional rendering, validation UX, async states) vs purely presentational?
- What shared render setup is needed (providers: theme, router, query client)?
- Which API interactions should MSW model, and where do handler defaults live?
- What genuinely needs a real browser (layout, CSS, focus subtleties, portals under real stacking) — and is therefore E2E scope?

## Responsibilities

- Set the **query discipline**: `getByRole` (with accessible name) first, then label/text; `data-testid` as the escape hatch — this makes tests double as accessibility probes (`web-accessibility`).
- Use **user-event** for interaction (typing, clicking, keyboard) over firing synthetic events directly.
- Mock the **network at the boundary with MSW**: shared handler defaults mirroring real API shapes, per-test overrides for error/empty/slow cases — components don't get their fetch layer stubbed internally.
- Test **behavior contracts**: what renders for which state (loading/error/empty/data), what happens on interaction — never internal state, hooks call counts, or DOM structure incidentals.
- Provide a **shared render helper** wrapping required providers so tests stay terse and consistent.
- Constrain **snapshots** to small, intentional cases (if any); assert specifics instead.
- Cover **async UX** properly: `findBy*`/`waitFor` instead of arbitrary sleeps; assert accessible loading/error states (`web-error-handling`).

## Required Workflow

1. Prioritize components by interaction risk.
2. Build the shared render helper + MSW handler baseline.
3. Write behavior tests per priority component, covering data/loading/error/empty and key interactions.
4. Route real-browser concerns to `playwright-e2e` explicitly.
5. Wire into CI beside the unit layer; record coverage decisions.

## Decision Rules

- If the assertion needs `getByRole` gymnastics because the component isn't accessible — fix the component, not the query.
- If the test breaks when internals refactor without behavior change, it's testing the wrong thing.
- jsdom can't verify real layout/painting/focus edge cases — don't fake it; escalate that case to E2E.
- Empty/error states are test cases, not afterthoughts.

## Rules

- Component tests run in CI on every push with the unit layer.
- No mocking of the component under test's children by default — mock boundaries (network, time), not the tree.
- Deterministic: MSW-controlled responses, fake timers where needed, no live endpoints.

## Anti-Patterns

- Snapshot files nobody reads, regenerated on every diff.
- Asserting on CSS classes/DOM structure instead of user-visible behavior.
- Stubbing `fetch`/axios per test instead of MSW at the boundary.
- Re-testing every prop permutation better covered by a unit test of the logic.

## Validation Checklist

- [ ] Components prioritized by interaction risk.
- [ ] Shared render helper + MSW baseline planned.
- [ ] Query discipline (role-first) and user-event usage set as convention.
- [ ] Data/loading/error/empty states covered for priority components.
- [ ] Real-browser cases explicitly routed to E2E.
- [ ] CI wiring recorded.

## Definition of Done

A recorded component-testing plan — priorities, shared setup, MSW boundary, role-first query conventions, and state coverage — yielding tests that survive refactors and double as accessibility checks.

## Related Skills

`web-unit-testing`, `playwright-e2e`, `web-accessibility`, `web-api-integration`, `web-error-handling`, `web-forms`, `../../testing-strategy`.

## Related Knowledge

`../../../knowledge/` (interaction-critical components).

## Related References

`../../../references/web/testing/` (render helper, MSW patterns — when populated).

## Context Loading Guidance

- **Requires:** component priorities, API shapes, unit-layer decisions.
- **Does not require:** deployment detail, full source tree.
- **May load:** `web-accessibility` for query/name expectations; `playwright-e2e` for the layer boundary.
- **Stop when:** conventions and priority coverage are recorded.

## Token Efficiency Guidance

Define conventions and the shared setup once; per-component plans are one line each (component → states → interactions).
