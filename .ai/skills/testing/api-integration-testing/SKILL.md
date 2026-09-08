---
name: api-integration-testing
description: Use to plan backend API integration tests with Supertest — real HTTP requests through the full middleware stack against a real database, covering happy path, invalid input, error path, and the authorization-denial negative suite (cross-user, non-admin, cross-tenant, untrusted IDs).
---

# API Integration Testing

## Purpose

Prove the HTTP API behaves correctly end-to-end within the backend: real requests through routing, middleware, validation, authorization, services, and a **real database** — using **Supertest**. This is where the API's validation and authorization guarantees get verified. The backend-pack `../../backend/backend-integration-testing` owns the same discipline from the framework side; this testing-pack skill is its Supertest-centered expression.

## When to Use

- For backend API endpoint behavior, auth flows, and DB-touching request paths.
- **Not** for pure logic (`unit-testing`), non-HTTP integration (`integration-testing`), or browser/device journeys (`playwright-e2e`/`maestro-e2e`).

## Inputs

- Endpoint design + authorization matrix (`../../backend/rest-api-design`, `../../backend/backend-authorization`).
- Real test DB + isolation (`test-environment-management`), personas/factories (`test-data-management`).

## Discovery Questions

- How does a test authenticate as each persona (anonymous, user A, user B, admin, other-tenant)?
- How is the database provisioned and isolated per test (containerized, transaction-rollback)?
- Which endpoints are release-critical and covered first?

## Responsibilities

- Take the behavior to be covered from its **Gherkin scenarios** (`gherkin-specifications`) — implement one test per scenario rather than inventing a parallel case list.
- Send **real HTTP** via Supertest through the assembled app + real production-engine DB (migrations applied, seeded to known state).
- Cover per endpoint the **required cases**: success (status + contract shape — `../../backend/api-contracts`), **invalid input** (malformed / unknown-field / oversize rejected — `../../backend/backend-validation`), **error path** (mapped status + safe shape — `../../backend/backend-error-handling`), and the **authorization-denial suite**:
  - anonymous → 401 on protected routes;
  - **User A cannot access User B's resource**;
  - **non-admin cannot invoke an admin action**;
  - **client-supplied ownership/tenant IDs are ignored** (scope from session);
  - **cross-tenant access is rejected** with a valid guessed ID.
- Cover **auth flows**: signup/login/refresh/logout, expired/tampered token, single-use reset token.
- Fake only true externals (provider clients, email — `../../backend/third-party-integrations` sinks).
- Keep hermetic, parallelizable, CI-gating (`../../devops/ci-cd`).

## Required Workflow

1. Build helpers: app bootstrap, persona auth, seed factories.
2. Choose DB provisioning + per-test isolation.
3. Per endpoint: success + invalid-input + error + authorization-denial cases.
4. Add auth-flow and (where present) webhook/job-path tests.
5. Wire as a CI gate; keep runtime bounded (parallel, scoped seeds).

## Decision Rules

- Production-engine database, always; no SQLite substitution.
- The authorization-denial suite is **mandatory per scoped resource** — omission is a hole in a security control.
- Assert response contracts (status + shape), not implementation artifacts.
- Flaky API tests are fixed or quarantined same-day (`flaky-test-audit`).

## Rules

- No real third-party or email sends from tests.
- Tests own their data; no order dependence.
- Every endpoint bug fix lands with its regression test.

## Anti-Patterns

- Mocking the data layer — that's a unit test wearing an integration label.
- Happy-path-only coverage; skipping the denial suite.
- Shared mutable seed database.
- Asserting exact error strings over codes/shapes.
- A suite too slow to run locally.

## Validation Checklist

- [ ] Supertest over real app + production-engine DB, isolated.
- [ ] Persona auth + factories in place.
- [ ] Per endpoint: success, invalid-input, error, authorization-denial.
- [ ] Cross-user / non-admin / untrusted-ID / cross-tenant present.
- [ ] Auth flows covered; externals faked.
- [ ] Hermetic, parallel, CI-gating.

## Definition of Done

A Supertest suite driving real HTTP against the app and a production-engine database — success, invalid-input, error, and the full authorization-denial suite per endpoint — hermetic, CI-gating, reproducible locally.

## Related Skills

`../../backend/backend-integration-testing`, `testing-selection`, `integration-testing`, `test-data-management`, `test-environment-management`, `../../backend/backend-authorization`, `../../backend/ownership-authorization`, `contract-testing`, `../../devops/ci-cd`.

## Related Knowledge

`../../../knowledge/` (critical endpoints, personas/tenancy).

## Related References

`../../../references/testing/` (helper patterns, when populated).

## Context Loading Guidance

- **Requires:** endpoint + authorization matrix, DB/seed strategy.
- **Does not require:** service internals (tests go over HTTP), provider docs.
- **May load:** `test-data-management`, `../../backend/backend-authorization`.
- **Stop when:** the endpoint × required-case matrix passes hermetically.

## Token Efficiency Guidance

Each cell of the endpoint × required-case matrix is a test; drive from it rather than re-deriving cases in prose.
