---
name: backend-validation
description: Use to plan server-side input validation — schema validation at every entry point (body, params, query, headers, files, webhooks, jobs), unknown-field stripping, and type-safe validated output. The server is authoritative; client validation is UX only.
---

# Backend Validation

## Purpose

Ensure every input crossing into the backend is validated against an explicit schema before any logic runs — the server is the enforcement point, whatever clients validate.

## When to Use

- When defining the validation approach for a backend, or adding endpoints/consumers.
- **Not** for client-side form validation (client packs) — that's UX, not enforcement.

## Inputs

- Endpoint design (`rest-api-design` / `graphql-api-design`) and contract (`api-contracts`).
- Chosen framework (validation pipe vs middleware) and schema library preference.

## Discovery Questions

- What entry points exist beyond HTTP bodies — query/params/headers, file uploads, webhooks, queue messages, scheduled-job inputs?
- Can validation schemas derive from the API contract (one definition)?
- What are the domain constraints (lengths, ranges, formats, enums) per input?
- Is this an auth endpoint? Credential rules come from `../../auth-form-validation` and must match the client's schema exactly.

## Responsibilities

- Validate **every entry point**: request body, path/query params, headers where relied on, uploads (`file-storage`), inbound webhooks (`webhooks`), and queue/job payloads (`queues`).
- Use schema validation (e.g. Zod, class-validator per framework) producing **typed, stripped** output — unknown fields removed, not passed through.
- Enforce domain constraints (bounds, enums, formats) — not just types.
- Keep validation errors in the standard error shape with field-level detail (`backend-error-handling`) — without echoing sensitive values back.
- Distinguish validation (shape/constraints) from authorization (who may act — `backend-authorization`); an ID being well-formed says nothing about the caller's right to it.

## Required Workflow

1. Inventory entry points (HTTP and non-HTTP).
2. Define schemas per entry point, aligned with the contract.
3. Wire validation as edge middleware/pipe — handlers receive only validated, typed data.
4. Define the validation-error response once.
5. Add negative tests: malformed, out-of-range, unknown-field, oversized inputs rejected.

## Decision Rules

- Whitelist, don't blacklist: strip unknown fields by default.
- Validate at the edge once; services trust their typed inputs and enforce business rules, not shapes.
- Body size and array-length limits are validation too (`rate-limiting` handles frequency, this handles size).
- Ownership/tenant IDs in payloads are inputs to validate for shape — and to *ignore* for trust (`ownership-authorization` decides the real scope).

## Rules

- No handler reads raw, unvalidated input.
- Schemas and contract must not drift (`api-contracts`).
- Client-side validation never substitutes for server enforcement.

## Anti-Patterns

- Validating only the request body while trusting query/params/headers.
- Manual `if (!field)` chains instead of schemas.
- Passing unknown fields through to the data layer (mass assignment).
- Trusting webhook or queue payloads because they're "internal."
- Returning raw validator internals (or the offending secret value) in errors.

## Validation Checklist

- [ ] All entry points inventoried and schema-covered.
- [ ] Unknown fields stripped; outputs typed.
- [ ] Domain constraints enforced, not just types.
- [ ] Standard validation-error shape wired.
- [ ] Negative tests for malformed/oversized/unknown-field inputs.

## Definition of Done

Every entry point validates against an explicit schema producing typed, stripped data; violations return the standard error shape; negative tests prove rejection.

## Related Skills

`backend-error-handling`, `api-contracts`, `backend-security`, `backend-authorization`, `ownership-authorization`, `file-storage`, `webhooks`, `queues`.

## Related Knowledge

`../../../knowledge/` (domain constraints, formats).

## Related References

`../../../references/backend/` (schema conventions, when populated).

## Context Loading Guidance

- **Requires:** entry-point inventory, contract, framework choice.
- **Does not require:** service implementations, database schema.
- **May load:** `backend-error-handling`, `api-contracts`.
- **Stop when:** schemas, wiring, and negative tests are planned/recorded.

## Token Efficiency Guidance

Work from the entry-point inventory; state constraints as a table per input rather than pasting full schemas.
