---
name: mobile-component-testing
description: Use to plan component tests — React Native Testing Library for rendering, interaction, and accessibility queries — testing components as users interact with them. Complements unit and E2E tests.
---

# Mobile Component Testing

## Purpose

Plan component tests with React Native Testing Library: render components, simulate interaction, and assert on accessible queries — verifying UI behavior without a full E2E run.

## When to Use

- When components have meaningful rendering/interaction logic.
- Not for pure logic (`mobile-unit-testing`) or full flows (`mobile-maestro-e2e`).

## Inputs

- The components under test and their expected behavior.
- RNTL setup and accessibility queries.

## Discovery Questions

- Which components have interaction/conditional-rendering logic worth testing?
- What user interactions and states must be asserted?
- Are accessible queries (roles/labels) available to select by?

## Responsibilities

- Plan **RNTL tests**: render, interact, assert on **accessible queries**.
- Cover **conditional rendering**, **interaction**, and **state changes**.
- Use **accessibility queries** (encouraging good a11y, `mobile-accessibility`).
- Complement unit and E2E layers (`../../testing-strategy`).

## Required Workflow

1. Identify components with real UI logic.
2. Define interactions/states to assert.
3. Write RNTL tests using accessible queries.
4. Run + record (or flag unrun).
5. Record the component-test plan.

## Decision Rules

- Query by accessible role/label, not brittle test internals.
- Test what the user sees/does, not implementation.
- Reserve full flows for Maestro; component tests stay focused.
- Prefer testIDs/roles that also improve accessibility.

## Rules

- Use RNTL (aligned to the stack).
- Query accessibly; avoid brittle selectors.
- Run tests or flag 'unverified until run'.

## Anti-Patterns

- Selecting by brittle internals instead of roles/labels.
- Re-testing pure logic better suited to units.
- E2E-ing full flows here.
- Claiming coverage from unrun tests.

## Validation Checklist

- [ ] Components with UI logic identified.
- [ ] Interactions/states asserted.
- [ ] Accessible queries used.
- [ ] Tests run (or flagged).
- [ ] Coordinated with unit/E2E layers.

## Definition of Done

A recorded component-test plan and tests: RNTL coverage of rendering/interaction via accessible queries, run or flagged unrun — complementing unit and E2E layers.

## Related Skills

`../../testing-strategy`, `mobile-unit-testing`, `mobile-maestro-e2e`, `mobile-accessibility`, `mobile-design-system`

## Related Knowledge

`../../../knowledge/` (component behavior).

## Related References

`../../../references/mobile/screens/` when populated.

## Context Loading Guidance

- **Requires:** the components under test + expected behavior, RNTL setup.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-accessibility`, `../../testing-strategy`.
- **Stop when:** component tests are written and run (or flagged).

## Token Efficiency Guidance

Test the components in scope; rely on accessible queries rather than reading full trees.
