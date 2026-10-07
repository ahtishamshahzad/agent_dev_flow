# 7 — Testing strategy

> **Status: PROPOSED.** Fictional example. Stage: `testing-strategy`, `testing-selection`. Chosen by risk, not by coverage percentage.

## Highest-risk behaviors and how each is pinned

| Risk | Level | Tool | Must include |
|---|---|---|---|
| Cross-tenant data access (N1) | API integration, every tenant endpoint | Supertest + a two-org fixture | One **authorization-denial** test per endpoint; RLS tested by bypassing the guard in a test-only path |
| Lost or duplicated offline work (N2) | Unit (outbox, idempotent apply) + mobile E2E | Jest · Maestro | Kill the app mid-sync; replay the same batch twice; resume a half-uploaded photo set |
| Billing drift (seats vs inspectors) | Integration with Stripe test mode + webhook fixtures | Supertest | Out-of-order and duplicated webhooks; failed payment → grace → restriction |
| Sign-off locking | API integration | Supertest | Edit after sign-off is refused |
| PDF export time (N4) | Performance check in CI on a 200-photo fixture | Worker script | Fails above 60 s |
| Critical web journeys | E2E | Playwright | Assign → review → sign off → export |
| Critical mobile journeys | E2E | Maestro | Download job → airplane mode → complete with photos → reconnect → synced |

## Required cases per feature

Happy path · invalid input · error path · **authorization denial** · regression test for every fixed bug — each its own scenario (`GHERKIN_RULES.md`).

## What "tested" means for a task

Its Gherkin scenarios each map to a named test that runs in CI and passes. A test that wasn't run is reported as "unverified until run" — never as passing.
