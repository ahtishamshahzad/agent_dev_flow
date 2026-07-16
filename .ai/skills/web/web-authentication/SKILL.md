---
name: web-authentication
description: Use to plan web authentication — session vs token model, httpOnly cookies vs localStorage risks, CSRF, SSR/middleware auth on Next.js, OAuth/managed-provider evaluation, refresh flow, and logout. The server enforces authentication; client auth state is a UX hint.
---

# Web Authentication

## Purpose

Plan how users prove identity and how the app carries that proof: the session/token model, where credentials live in the browser, how SSR and middleware see auth state, and the login/refresh/logout lifecycle. Enforcement is server-side, always.

## When to Use

- When the app has any authenticated surface (customer app, dashboard).
- When reviewing or replacing an existing auth setup (`existing-web-audit` findings).
- **Not** for role/permission gating (`web-authorization`) or backend identity design.

## Inputs

- Auth requirements: providers (email/password, OAuth/OIDC, SSO), MFA needs, session length.
- Backend boundary (`web-api-integration`) and framework foundation (SSR changes the options).
- Compliance/security constraints (`../../security-review`, `../../system/SECURITY_RULES.md`).

## Discovery Questions

- Build on a managed provider (Auth0/Clerk/Supabase/NextAuth-style) or against an existing backend's auth — what does the evaluation say?
- Cookie sessions or bearer tokens? Same-origin or cross-origin API (cookie scope, CORS credentials)?
- Does SSR need the user (personalized server render), or is auth purely client-visible?
- Session lifetime, refresh policy, and "log out everywhere" requirements?

## Responsibilities

- Decide the **credential carrier**: prefer **httpOnly, Secure, SameSite cookies** for browser apps; treat localStorage-held tokens as XSS-readable and justify any use.
- Plan **CSRF protection** whenever cookies authenticate state-changing requests (SameSite plus token where needed).
- Plan **SSR/middleware auth** on Next.js: reading the session in middleware/server components, redirect flow for protected pages, no auth-only content leaking into static output.
- Evaluate **managed providers vs self-managed** as a decision with trade-offs (cost, lock-in, MFA/SSO needs).
- Define the **lifecycle**: login, refresh (single-flight, rotation), logout (server-side invalidation, not just client state clearing), session expiry UX.
- Keep client auth state a **reflection** of the server's decision — a hint for UX, never the gate.

## Required Workflow

1. Gather providers, session, and compliance requirements.
2. Choose carrier + CSRF strategy against the backend origin layout.
3. Plan SSR/middleware integration (Next.js) or SPA boot auth check (Vite).
4. Define login/refresh/logout flows and failure UX.
5. Record the plan for Gate 2; route enforcement review to `../../security-review`.

## Decision Rules

- Default to httpOnly cookie sessions for same-origin apps; bearer tokens make sense mainly when a separate API/multiple clients demand them — then plan storage and refresh explicitly.
- Any secret the browser JS can read is compromised under XSS — design as if XSS happens (`../../security-review`).
- Middleware/route protection is routing UX; every API/server action re-checks identity itself.
- Managed provider vs self-managed is a recorded evaluation, not a default either way.

## Rules

- No credentials, tokens, or session secrets in logs, error reports, or public env vars.
- Logout invalidates server-side; a cleared client store alone is not logout.
- Auth pages and redirects must not create open-redirect vectors (validate return paths).

## Anti-Patterns

- JWTs in localStorage by habit, with no XSS story.
- Client-side "isLoggedIn" checks guarding data the API serves unauthenticated.
- Refresh logic that fans out (one refresh per parallel 401).
- Rolling custom crypto/session formats instead of vetted mechanisms.

## Validation Checklist

- [ ] Provider/model evaluated and chosen with trade-offs.
- [ ] Credential carrier + CSRF strategy defined for the actual origin layout.
- [ ] SSR/middleware (or SPA boot) auth flow planned.
- [ ] Login/refresh/logout lifecycle defined, server-side invalidation included.
- [ ] Client state confirmed as hint-only; server enforcement points listed.

## Definition of Done

A recorded authentication plan — provider decision, credential carrier, CSRF posture, SSR integration, and full session lifecycle — where every enforcement point is server-side and the client only reflects it.

## Related Skills

`web-authorization`, `web-api-integration`, `web-routing`, `../../security-review`, `../../environment-audit`, `dashboard-permissions`, `nextjs-foundation`.

## Related Knowledge

`../../../knowledge/` (identity model, compliance constraints).

## Related References

`../../../references/web/` (auth flow notes — when populated).

## Context Loading Guidance

- **Requires:** auth requirements, backend/origin layout, framework foundation.
- **Does not require:** UI detail, unrelated feature skills.
- **May load:** `web-authorization` next; `../../security-review` for the enforcement review.
- **Stop when:** the auth plan is recorded for approval.

## Token Efficiency Guidance

Decide from the origin/requirements summary. Record the model as carrier + lifecycle + enforcement points; don't restate general auth theory.
