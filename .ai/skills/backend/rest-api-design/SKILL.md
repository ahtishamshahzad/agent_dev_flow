---
name: rest-api-design
description: Use to design a REST API surface — resource naming, HTTP methods and status codes, pagination, filtering, versioning, idempotency, and consistent response shapes. Produces an endpoint design, not code.
---

# REST API Design

## Purpose

Design a consistent, predictable REST surface: resources, verbs, status codes, pagination, versioning, and response conventions — recorded as a contract clients can rely on (`api-contracts`).

## When to Use

- When defining or extending a REST API's endpoints.
- **Not** for GraphQL (`graphql-api-design`) or internal layering (`backend-api-architecture`).

## Inputs

- Domain model and client needs (which apps consume this — web/mobile).
- Auth model (`backend-authentication`, `backend-authorization`).

## Discovery Questions

- What resources exist, and what are their relationships/sub-resources?
- Which endpoints return collections — how large can they grow?
- Which operations are unsafe to retry (payments, sends) and need idempotency keys?
- Who consumes this API, and what versioning tolerance do they have?

## Responsibilities

- Name resources as **plural nouns** (`/orders`, `/orders/{id}/items`); actions that don't fit CRUD become explicit sub-resources or verbs done deliberately (`/orders/{id}/cancel`), not scattered RPC.
- Map methods correctly: GET (safe), POST (create/process), PUT/PATCH (replace/partial), DELETE — with correct status codes (200/201/204, 400/401/403/404/409/422, 429, 5xx).
- Require **pagination on every collection** (cursor-based for growing data; offset acceptable for small, stable sets), plus filtering/sorting conventions.
- Define one **error response shape** (`backend-error-handling`) and one envelope convention — used everywhere.
- Plan versioning (URL prefix or header) and what counts as a breaking change (`api-contracts`).
- Mark idempotent operations; require idempotency keys for unsafe-to-retry POSTs.
- Document the unit as it is built — one file per resource under `docs/<app>/api/` (`../../application-documentation`).

## Required Workflow

1. List resources + relationships from the domain model.
2. Define endpoints per resource with methods, status codes, auth requirements.
3. Fix pagination/filter/sort conventions once, apply everywhere.
4. Define the error shape + versioning policy.
5. Record the design in the API contract.

## Decision Rules

- 401 = unauthenticated, 403 = unauthorized, 404 = also acceptable for existence-hiding (`ownership-authorization`) — pick per resource and be consistent.
- Unbounded collections are defects: paginate from day one.
- Prefer 422 for semantic validation failures, 400 for malformed requests — and document the choice.
- Breaking changes require a new version; additive changes don't.

## Rules

- Every endpoint carries an auth requirement annotation (public / authenticated / role / ownership).
- Conventions are decided once and recorded; per-endpoint improvisation is a defect.
- Design output is the contract, not handler code.

## Anti-Patterns

- Verbs in resource paths as the norm (`/getOrders`).
- 200-with-error-body responses.
- Collections without pagination "because it's small now."
- Different error shapes per endpoint.
- Encoding authorization in the client's knowledge of hidden endpoints.

## Validation Checklist

- [ ] Resources named consistently; relationships mapped.
- [ ] Methods + status codes correct per endpoint.
- [ ] Pagination/filter/sort conventions fixed and applied.
- [ ] Single error shape; versioning policy defined.
- [ ] Idempotency handled for unsafe retries.
- [ ] Auth requirement annotated per endpoint.

## Definition of Done

A recorded endpoint design — resources, methods, status codes, conventions, auth annotations — registered in the API contract and consistent across the surface.

## Related Skills

`api-contracts`, `graphql-api-design`, `backend-api-architecture`, `backend-validation`, `backend-error-handling`, `backend-authorization`, `rate-limiting`, `../../application-documentation`.

## Related Knowledge

`../../../knowledge/` (domain model, client constraints).

## Related References

`../../../references/backend/api/` (endpoint conventions, when populated).

## Context Loading Guidance

- **Requires:** domain model, consumer list, auth model summary.
- **Does not require:** implementation code, database internals.
- **May load:** `api-contracts`, `backend-error-handling`.
- **Stop when:** the endpoint design is recorded in the contract.

## Token Efficiency Guidance

Design as an endpoint table (path, method, auth, status codes); state conventions once instead of repeating per endpoint.
