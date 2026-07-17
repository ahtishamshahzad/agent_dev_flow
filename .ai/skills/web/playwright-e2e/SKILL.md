---
name: playwright-e2e
description: Use to plan Playwright end-to-end tests for critical web journeys — authentication and authorization, forms, dashboards, reports, checkout — with visual regression only when justified, deterministic test data, environment isolation (never prod), CI execution with traces, and regression coverage for fixed bugs. Cover the critical path, not every page.
---

# Playwright E2E

## Purpose

Plan and structure Playwright tests that exercise the app's **critical user journeys** in a real browser, end to end, validating what users actually experience. The web E2E arm of `../../testing-strategy` — the top of the pyramid, reserved for flows whose failure is high-impact.

## When to Use

- When critical journeys exist (auth, checkout, core dashboard workflows, report generation) that must not break.
- Before releases of high-impact flows; when a fixed high-impact bug needs a permanent journey-level guard.
- **Not** for logic (`web-unit-testing`) or component behavior (`web-component-testing`), and never to E2E every page.

## Inputs

- The critical-journey list with acceptance criteria (agreed with the user).
- A deployable build and an isolated test environment with seedable data.
- Auth roles/accounts available for testing (`web-authentication`, `web-authorization`).

## Discovery Questions

- Which journeys are critical enough that failure means incident-level impact?
- Which roles must each journey run as (customer, each admin role) to prove authorization?
- Where do tests run (dedicated environment? ephemeral per-PR?) and how is data seeded/reset?
- Is visual regression justified anywhere (stable, design-critical surfaces with a diff-review process)?

## Responsibilities

- Select **critical user journeys** — signup/login, the product's core loop, checkout if commerce, key dashboard workflows — and keep the suite small and meaningful.
- Test **authentication**: login (success/failure), logout, protected-route redirects with return path, session expiry behavior; reuse authenticated state via `storageState` per role so every test doesn't re-login through the UI.
- Test **authorization**: per role, assert both what's reachable **and** that forbidden routes/actions are denied (direct-URL access, API-backed actions) — proving `web-authorization`'s enforcement from the outside.
- Test **forms**: validation errors surface accessibly, successful submission lands, server errors render (`web-forms`).
- Test **dashboards**: table filtering/sorting/pagination against seeded data, permission-scoped visibility, a guarded bulk operation with its confirmation flow (`dashboard-tables`, `dashboard-bulk-operations`).
- Test **reports**: a seeded dataset produces the expected numbers/rows, ranges/filters apply, export delivers (`dashboard-reporting`).
- Test **checkout** (where commerce exists): the full path to a confirmed order against payment-provider test modes — never live payment rails.
- Apply **visual regression only when justified**: stable design-critical surfaces, deliberate baselines, a review process for diffs — not screenshots of every page that break on each copy change.
- Manage **test data**: seeded per run, unique (no shared mutable records between tests), reset/cleanup guaranteed, tests independent and parallel-safe.
- Enforce **environment isolation**: a dedicated test environment/database, test accounts, external services in test/sandbox mode — **never production**, never real user data.
- Plan **CI execution**: headless on PRs/merges, parallel workers, a deliberate retry policy (retries flag flake for fixing, not for hiding), artifacts on failure (trace, screenshot, video) so failures are debuggable from CI alone.
- Maintain **regression coverage**: every fixed high-impact bug that E2E is the right level for gets a journey test; the suite is pruned as flows change so it stays trusted.

## Required Workflow

1. Agree the critical-journey list and the roles each runs as.
2. Stand up environment isolation + data seeding/reset strategy.
3. Author journeys with stable selectors (roles/labels first, `data-testid` where needed) and web-first assertions — no arbitrary sleeps.
4. Set up per-role `storageState`; add authorization-denial checks per role.
5. Wire CI (headless, parallel, artifacts, retry policy); triage flake to zero tolerance.
6. Add regression journeys as high-impact bugs are fixed; run the suite and record results (or "unverified until run").

## Decision Rules

- A journey earns E2E when its failure is user-visible and high-impact; everything else belongs to cheaper layers.
- Selector preference: accessible role/label → `data-testid` → never brittle CSS/XPath chains.
- Auth via `storageState`/API setup for speed; the login **flow itself** is tested once as its own journey.
- Visual regression is opt-in per surface with a named justification; otherwise assert semantics, not pixels.
- A flaky test is fixed or quarantined the week it flakes — a red-ish suite is a dead suite.

## Rules

- Tests are independent, order-agnostic, and parallel-safe; no test depends on another's leftovers.
- No production environments, production data, or live third-party rails — ever.
- Failures ship with their trace/screenshot; a failure that can't be diagnosed from artifacts is a tooling bug to fix.

## Anti-Patterns

- E2E-ing every page until the suite takes an hour and everyone ignores it.
- `waitForTimeout` sprinkled to outrun race conditions.
- Shared test accounts mutating each other's state across parallel workers.
- Screenshot assertions on volatile pages, regenerated blindly on every failure.
- Retry-until-green as the flake strategy.

## Validation Checklist

- [ ] Critical journeys agreed and listed (auth, authorization, forms, dashboards, reports, checkout where present).
- [ ] Environment isolation + seeded, per-run-unique test data in place.
- [ ] Per-role auth state reuse set up; authorization denials asserted per role.
- [ ] Stable selectors and web-first assertions throughout; no arbitrary sleeps.
- [ ] Visual regression limited to justified surfaces with a baseline-review process.
- [ ] CI runs headless/parallel with failure artifacts and a deliberate retry policy.
- [ ] Regression journeys added for fixed high-impact bugs.
- [ ] Suite executed and passing, or explicitly flagged "unverified until run."

## Definition of Done

A small, trusted Playwright suite covering the agreed critical journeys — auth and per-role authorization, forms, dashboard and reporting workflows, checkout where relevant — running deterministically on isolated data in CI with debuggable artifacts, growing only through justified additions and regression guards.

## Related Skills

`../../testing-strategy`, `web-unit-testing`, `web-component-testing`, `web-authentication`, `web-authorization`, `web-forms`, `dashboard-tables`, `dashboard-bulk-operations`, `dashboard-reporting`, `web-deployment`, `../../bug-investigation`.

## Related Knowledge

`../../../knowledge/` (critical journeys, roles, environment topology).

## Related References

`../../../references/web/testing/` (journey specs, seeding patterns — when populated).

## Context Loading Guidance

- **Requires:** critical-journey list, roles, environment/data strategy.
- **Does not require:** full source tree, component internals, unrelated features.
- **May load:** `web-authentication`/`web-authorization` for auth flows; `dashboard-bulk-operations` for guarded-action journeys.
- **Stop when:** journeys are authored, CI-wired, and run (or flagged unrun).

## Token Efficiency Guidance

Plan journeys as one-line specs (journey → role → seeded state → assertions). Keep selectors/data conventions defined once; link references rather than pasting page trees.
