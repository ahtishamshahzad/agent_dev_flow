---
name: integration-testing
description: Use to plan integration tests across module and I/O boundaries — real database, real wiring, faked externals — covering happy path, invalid input, error path, and authorization denial. For HTTP API specifics use api-integration-testing.
---

# Integration Testing

## Purpose

Verify that units work **together across real boundaries** — services + data layer + wiring, with a real database and faked externals — so bugs that live between components (not inside them) are caught. Broader than pure unit tests; the HTTP-endpoint specialization is `api-integration-testing`.

## When to Use

- For behavior spanning modules and I/O: service → repository → database, job pipelines, multi-module workflows.
- **Not** for pure logic (`unit-testing`) or full browser/device journeys (`playwright-e2e`/`maestro-e2e`).

## Inputs

- Runner (Jest/Vitest — `testing-selection`), real datastore for tests (`test-environment-management`), seed/factory strategy (`test-data-management`).
- The workflow under test and its authorization rules.

## Discovery Questions

- What real boundaries must participate (DB, cache, queue) vs be faked (third-party APIs)?
- How does a test get an isolated real datastore per run/test?
- Which workflows carry authorization rules that must be verified, not assumed?

## Responsibilities

- Take the behavior to be covered from its **Gherkin scenarios** (`gherkin-specifications`) — implement one test per scenario rather than inventing a parallel case list.
- Exercise the **real wiring**: real database (same engine as production — never SQLite-for-Postgres), real repositories/services; fake only true externals (`../../backend/third-party-integrations` interfaces).
- Cover the **required cases** per workflow: **happy path**, **invalid input** (rejected at the right boundary), **error path** (dependency failure handled, no partial state — `../../database/transactions`), and **authorization denial** (an actor lacking rights is refused — `../../backend/backend-authorization`).
- Manage data with factories + isolation (`test-data-management`), so tests own their state and don't depend on order.
- Assert observable outcomes: returned values, persisted state, emitted effects — not internal calls.
- Keep the suite hermetic and parallelizable; wire as a CI tier (`../../devops/ci-cd`).

## Required Workflow

1. Choose real-vs-faked boundaries for the workflow.
2. Set up isolated real datastore + factories.
3. Cover happy / invalid-input / error-path / authorization-denial.
4. Assert persisted + returned state; verify no partial writes on failure.
5. Wire into CI; keep runtime bounded.

## Decision Rules

- Same datastore engine as production, always — engine differences hide real bugs.
- Authorization denial is a **required** integration case wherever rules exist — a missing denial test is a missing control.
- Fake externals at your own interface, not by mocking the data layer (that would make it a slow unit test).
- Isolation via transaction-rollback or truncate-per-test; no shared mutable seed database.

## Rules

- No real third-party calls or emails from tests.
- Tests own their data; no execution-order dependence.
- Fixes at this layer land with regression tests (`regression-testing`).

## Anti-Patterns

- Mocking the database in an "integration" test.
- Covering happy paths only; skipping error and authorization-denial cases.
- One shared seeded DB mutated across the suite.
- Asserting exact error strings instead of codes/shapes.
- SQLite standing in for the production engine.

## Validation Checklist

- [ ] Real boundaries participate; externals faked at interfaces.
- [ ] Happy + invalid-input + error-path + authorization-denial covered.
- [ ] Isolated real datastore; factory-driven data.
- [ ] Persisted + returned state asserted; no partial writes on failure.
- [ ] Hermetic, parallel, CI-wired.

## Definition of Done

An integration suite exercising real wiring and a production-engine datastore, covering happy, invalid-input, error, and authorization-denial paths per workflow — hermetic, isolated, and CI-gating.

## Related Skills

`testing-selection`, `unit-testing`, `api-integration-testing`, `test-data-management`, `test-environment-management`, `regression-testing`, `../../backend/backend-authorization`, `../../database/transactions`, `../../devops/ci-cd`.

## Related Knowledge

`../../../knowledge/` (workflows, authorization rules).

## Related References

`../../../references/testing/` (patterns, when populated).

## Context Loading Guidance

- **Requires:** the workflow + its authorization rules, datastore/factory strategy.
- **Does not require:** unit internals, full app source, unrelated workflows.
- **May load:** `test-data-management`, `api-integration-testing`.
- **Stop when:** the workflow's required cases pass hermetically.

## Token Efficiency Guidance

Drive coverage from the workflow × required-case matrix; read the workflow's modules, not the whole app.
