---
name: mobile-maestro-e2e
description: Use to plan Maestro end-to-end tests for critical mobile flows on real device/emulator. Select Maestro when critical mobile E2E flows exist; cover the critical path (auth, checkout, core journeys) rather than every screen.
---

# Mobile Maestro E2E

## Purpose

Plan and structure Maestro end-to-end tests that exercise critical mobile user journeys on a real device/emulator, validating the app as users experience it. The mobile E2E arm of `../../testing-strategy`.

## When to Use

- **When critical mobile E2E flows exist** (auth, onboarding, checkout, core journeys) that must not break.
- Before release of flows whose failure is high-impact.
- **Not** for unit/component coverage (`mobile-unit-testing`, `mobile-component-testing`), and not to E2E every screen.

## Inputs

- The critical user flows and their acceptance criteria.
- A runnable build (dev build or release) and device/emulator target.

## Discovery Questions

- Which flows are critical enough to warrant E2E (failure = high impact)?
- What are the stable selectors/testIDs for those flows?
- Which platforms/devices must be covered?
- What test data/auth is needed to run the flow?

## Responsibilities

- Identify the **critical-path flows** to automate (not all screens).
- Define **Maestro flows** with stable selectors and clear assertions.
- Plan **test data/auth** and environment for repeatable runs.
- Integrate runs into the release process (`mobile-release`) where valuable.
- Keep flows resilient (avoid brittle coordinates; prefer testIDs).

## Required Workflow

1. Select critical flows with the user.
2. Ensure stable selectors/testIDs exist (add if missing).
3. Author Maestro flows with assertions.
4. Define test data/auth + target devices.
5. Run on device/emulator; record pass/fail (or "unverified until run").

## Decision Rules

- Select Maestro when critical mobile E2E flows exist; otherwise rely on unit/component tests.
- Automate the critical path first; add breadth only where impact justifies it.
- Prefer stable testIDs over positional/coordinate selectors.
- Run against a representative build, not a broken dev state.

## Rules

- E2E complements, not replaces, unit/component tests.
- Keep flows deterministic (controlled data/auth).
- Flag unrun flows explicitly with the command.

## Anti-Patterns

- E2E-ing every screen (slow, brittle, low value).
- Brittle coordinate-based selectors.
- No E2E on high-impact flows because "units pass."
- Claiming E2E coverage from flows that never ran.

## Validation Checklist

- [ ] Critical flows identified (not all screens).
- [ ] Stable selectors/testIDs in place.
- [ ] Maestro flows authored with assertions.
- [ ] Test data/auth + devices defined.
- [ ] Runs executed or flagged "unverified until run."

## Definition of Done

Maestro flows covering the critical mobile journeys, using stable selectors and deterministic data, run on a representative build (or explicitly flagged unrun), integrated into the release check where valuable.

## Related Skills

`../../testing-strategy`, `mobile-unit-testing`, `mobile-component-testing`, `mobile-release`, `mobile-builds`, `mobile-authentication`.

## Related Knowledge

`../../../knowledge/` (critical user journeys).

## Related References

`../../../references/mobile/screens/`, `../../../references/mobile/navigation/` when populated.

## Context Loading Guidance

- **Requires:** the critical flows, selectors, a runnable build, device target.
- **Does not require:** the whole app source, unit-test detail, unrelated references.
- **May load:** `mobile-release` for integration; `mobile-authentication` for auth flows.
- **Stop when:** critical-flow E2E is authored and run (or flagged unrun).

## Token Efficiency Guidance

Focus on the critical flows and their selectors, not the entire UI. Keep flow specs concise; link screen references rather than pasting UI trees.
