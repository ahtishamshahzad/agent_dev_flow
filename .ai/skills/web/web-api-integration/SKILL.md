---
name: web-api-integration
description: Use to plan the API transport layer — fetch vs Axios, per-environment base URLs, auth headers and refresh interception, typed error mapping, and CORS with a separate backend; on Next.js, when route handlers / server actions act as the backend-for-frontend. No secrets in client code.
---

# Web API Integration

## Purpose

Plan the transport layer between the web app and its backend(s): client choice, environment configuration, auth attachment, error mapping, and — on Next.js — whether route handlers/server actions form a backend-for-frontend. `web-server-state` consumes this layer; it doesn't reinvent it.

## When to Use

- After the backend boundary is known, alongside `web-server-state`.
- When an existing app scatters raw `fetch` calls, base URLs, or error handling across features.
- **Not** for designing the backend API itself, or for caching policy (`web-server-state`).

## Inputs

- Backend surface: separate API(s), or Next.js server features, or both.
- Auth model from `web-authentication` (cookies vs bearer tokens changes everything here).
- Environment list (dev/staging/prod) and their endpoints.

## Discovery Questions

- One backend or several? Same origin or cross-origin (CORS, cookie scope)?
- Cookie-based sessions (credentials, CSRF) or bearer tokens (attach/refresh interceptors)?
- (Next.js) Should server actions/route handlers proxy the backend to keep tokens server-side?
- What error shape does the backend return, and what should features receive?

## Responsibilities

- Choose the **HTTP client** (fetch — default and sufficient for most; Axios only for a justified need like upload progress or an interceptor-heavy setup).
- Centralize **base URLs per environment** via env config — never hardcoded, never secret-bearing on the client (`VITE_`/`NEXT_PUBLIC_` are public).
- Plan **auth attachment**: cookie credentials + CSRF strategy, or bearer header + refresh-on-401 (single-flight, then retry once) — per `web-authentication`.
- Define **typed error mapping**: HTTP/network/validation errors → a small error union features can render (`web-error-handling`).
- Address **CORS** explicitly for cross-origin backends (allowed origins, credentials mode); prefer same-origin proxying when it simplifies auth.
- Keep the layer thin: one client module, no per-feature transport forks.

## Required Workflow

1. Map backends, origins, and environments.
2. Align transport with the auth model (cookies vs tokens).
3. Choose the client and define the wrapper (base URL, headers, error mapping, timeout).
4. (Next.js) Decide the BFF question: proxy via server, or call the API directly from the client.
5. Record conventions; hand caching to `web-server-state`.

## Decision Rules

- Default to `fetch` in a thin wrapper; adopt Axios only for a concrete capability gap.
- Tokens the browser JS can read are exposed tokens — prefer httpOnly cookies or a server-side proxy where feasible (`web-authentication` decides).
- Refresh logic runs once per expiry (single-flight), not per parallel request.
- Timeouts and abort signals are part of the wrapper, not optional extras.

## Rules

- No secrets or privileged API keys in client-side code or public env vars — server-side only.
- All requests flow through the shared client; raw `fetch` in features is a review flag.
- Error mapping never swallows status/context needed for debugging (log safely, `web-error-handling`).

## Anti-Patterns

- Base URLs and headers copy-pasted per feature.
- Refresh storms: every 401 triggering its own refresh call.
- Treating `NEXT_PUBLIC_`/`VITE_` vars as a safe place for API secrets.
- A "temporary" second HTTP client that becomes permanent drift.

## Validation Checklist

- [ ] Backends/origins/environments mapped; CORS strategy explicit if cross-origin.
- [ ] Client chosen with justification; single shared wrapper planned.
- [ ] Auth attachment + refresh strategy aligned with `web-authentication`.
- [ ] Typed error mapping defined for features.
- [ ] No secrets in client code or public env vars.

## Definition of Done

A recorded transport plan — client choice, environment config, auth attachment, error mapping, and CORS/BFF decisions — thin enough that `web-server-state` and features consume one consistent API surface.

## Related Skills

`web-server-state`, `web-authentication`, `web-error-handling`, `nextjs-foundation`, `vite-react-foundation`, `../../environment-audit`, `../../security-review`.

## Related Knowledge

`../../../knowledge/` (backend API contracts, environment topology).

## Related References

`../../../references/web/state/` (transport conventions — when populated).

## Context Loading Guidance

- **Requires:** backend surface, auth model, environment list.
- **Does not require:** full backend source, UI detail.
- **May load:** `web-authentication` for token/cookie decisions; `../../environment-audit` for env handling.
- **Stop when:** transport conventions are recorded.

## Token Efficiency Guidance

Specify the wrapper contract (inputs, headers, error union) once; don't enumerate endpoints. A base-URL-per-environment table suffices.
