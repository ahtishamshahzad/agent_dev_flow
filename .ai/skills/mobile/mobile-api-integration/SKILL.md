---
name: mobile-api-integration
description: Use to plan the HTTP transport layer — fetch vs Axios, base client, interceptors, auth headers, error mapping, and timeouts. Underpins server-state; does not itself cache.
---

# Mobile API Integration

## Purpose

Plan the API client: choose fetch or Axios, build a base client with auth headers, interceptors, timeouts, and error mapping — the transport that `mobile-server-state` caches over.

## When to Use

- When the app talks to a backend/API.
- Not for caching concerns (that's `mobile-server-state`).

## Inputs

- API base URLs/environments (`mobile-environment-config`).
- Auth token model (`mobile-authentication`).

## Discovery Questions

- fetch or Axios (interceptors, cancellation, ergonomics)?
- How are auth tokens attached and refreshed?
- What are the timeout/retry and error-mapping needs?
- How do environments (dev/staging/prod) switch base URLs?

## Responsibilities

- Choose **fetch** or **Axios** with justification.
- Build a **base client**: base URL from env, headers, timeouts.
- Add **interceptors** for auth token attach/refresh and **error mapping**.
- Handle **cancellation** and network failures; hand caching to `mobile-server-state`.

## Required Workflow

1. Confirm API surface + environments + auth model.
2. Choose fetch/Axios.
3. Build the base client + interceptors + error mapping.
4. Wire env-based base URLs.
5. Record the transport plan.

## Decision Rules

- Axios eases interceptors/cancellation; fetch is dependency-free — choose by need, not habit.
- Base URLs come from env config, never hard-coded.
- Auth token attach/refresh lives in one place (interceptor), not per call.
- Transport maps errors to a consistent shape; caching is separate.

## Rules

- No hard-coded base URLs or secrets (`mobile-environment-config`).
- Attach auth centrally; coordinate refresh with `mobile-authentication`.
- Do not implement caching here — that's server-state.

## Anti-Patterns

- Per-call ad-hoc fetch with duplicated headers.
- Hard-coded URLs/keys in client code.
- Swallowing errors without mapping.
- Reimplementing caching in the transport.

## Validation Checklist

- [ ] fetch/Axios chosen + justified.
- [ ] Base client with env base URL + timeouts.
- [ ] Auth attach/refresh centralized.
- [ ] Consistent error mapping.
- [ ] Cancellation/network handling planned.

## Definition of Done

A recorded transport plan: chosen client, env-driven base client with centralized auth and error mapping, cancellation/network handling — leaving caching to server-state.

## Related Skills

`mobile-server-state`, `mobile-authentication`, `mobile-environment-config`, `mobile-error-handling`, `mobile-secure-storage`

## Related Knowledge

`../../../knowledge/` (API contracts).

## Related References

`../../../references/mobile/state/` when populated.

## Context Loading Guidance

- **Requires:** API base URLs/environments, auth token model.
- **Does not require:** the whole app source, unrelated references, every mobile skill.
- **May load:** `mobile-authentication`, `mobile-environment-config`.
- **Stop when:** the transport plan is recorded.

## Token Efficiency Guidance

Plan the client and interceptors only; delegate caching and env detail to their skills.
