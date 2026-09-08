---
name: playwright-e2e
description: Use to plan web/dashboard end-to-end tests with Playwright — a small set of critical user journeys against a real browser and running app, resilient to timing (auto-wait, no sleeps), covering happy path plus key invalid/error/authorization-denied flows. Reserved for flows that justify E2E cost.
---

# Playwright E2E

## Purpose

Verify **critical web/dashboard journeys** work end-to-end in a real browser against the running app — the few flows whose breakage is unacceptable — using **Playwright**, kept small, stable, and meaningful because E2E is the slowest, most expensive tier.

## When to Use

- For a handful of business-critical browser journeys (signup→onboard, checkout, core dashboard workflow).
- **Not** for logic (`unit-testing`), API behavior (`api-integration-testing`), broad UI coverage (Testing Library), or mobile (`maestro-e2e`).

## Inputs

- Selected web/dashboard app + its critical journeys (`testing-selection`).
- A running app + test environment (`test-environment-management`), seeded data (`test-data-management`).

## Discovery Questions

- Which 3–10 journeys are truly critical (revenue, auth, data-integrity) — the ones worth E2E?
- What environment do they run against (ephemeral/staging with known seed state)?
- Which flows include authorization boundaries worth an end-to-end denial check?

## Responsibilities

- Take the behavior to be covered from its **Gherkin scenarios** (`gherkin-specifications`) — implement one test per scenario rather than inventing a parallel case list.
- Cover **critical journeys** end-to-end: the **happy path** through the real UI, plus the key **invalid-input**, **error**, and **authorization-denied** variants that matter at the journey level (e.g. a user can't reach another user's dashboard).
- Write **resilient selectors and waits**: role/label/test-id locators (`../../mobile/mobile-accessibility` parity), Playwright **auto-waiting** — never fixed `sleep`s, which cause flakiness (`flaky-test-audit`).
- Control **data and state**: seed via API/factory before the run, clean up after; deterministic starting state, no dependence on leftover data.
- Keep the suite **small and fast enough** to run in CI on the web app's pipeline (`../../devops/ci-cd`); parallelize; capture traces/screenshots on failure for triage.
- Keep E2E as the **top of the pyramid** — push detailed cases down to component/API tests; don't recreate them here.

## Required Workflow

1. Pick the critical journeys (few, high-value).
2. Set up a running app + seeded, isolated state.
3. Script each journey with resilient locators + auto-wait; add key denial/error variants.
4. Wire into the web CI pipeline with failure artifacts.
5. Keep the set small; move detail down the pyramid.

## Decision Rules

- If a case can be covered at component or API level, it belongs there — E2E is for whole-journey integration only.
- No fixed sleeps — auto-wait on state; timing hacks are future flakes.
- Test IDs / roles over brittle CSS/text selectors.
- A flaky E2E test is worse than none — stabilize or remove (`flaky-test-audit`).

## Rules

- Deterministic seed state per run; tests own their data.
- Runs against a real running app, not mocks-all-the-way.
- Failures produce traces/screenshots for diagnosis.

## Anti-Patterns

- E2E-testing every field and edge case (slow, flaky pyramid inversion).
- `waitForTimeout`/sleeps sprinkled to "fix" flakiness.
- Brittle selectors tied to DOM structure or copy.
- Shared state across tests causing order dependence.
- Reproducing unit/API coverage in the browser.

## Validation Checklist

- [ ] Critical journeys selected (few, high-value).
- [ ] Happy path + key invalid/error/authorization-denied variants.
- [ ] Resilient locators + auto-wait; no sleeps.
- [ ] Deterministic seeded, isolated state.
- [ ] CI-wired with failure artifacts; suite kept small.

## Definition of Done

A small, stable Playwright suite covering the critical web journeys end-to-end — happy path plus key denial/error variants — with resilient waits, deterministic data, and CI integration producing failure traces.

## Related Skills

`testing-selection`, `../../mobile/mobile-maestro-e2e`, `maestro-e2e`, `smoke-testing`, `visual-regression`, `test-data-management`, `test-environment-management`, `flaky-test-audit`, `../../devops/ci-cd`.

## Related Knowledge

`../../../knowledge/` (critical journeys).

## Related References

`../../../references/testing/` (E2E patterns, when populated).

## Context Loading Guidance

- **Requires:** critical journey list, running-app/test-env access, seed strategy.
- **Does not require:** unit internals, unrelated screens.
- **May load:** `test-data-management`, `flaky-test-audit`.
- **Stop when:** critical journeys pass stably in CI.

## Token Efficiency Guidance

List the journeys and their variants; that list bounds the suite. Don't enumerate every UI state — those live lower in the pyramid.
