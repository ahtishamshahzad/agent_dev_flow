---
name: mobile-authentication
description: Use to plan mobile authentication — login/signup, token/session handling, secure token storage, refresh, and logout — coordinating with secure storage, API integration, and the auth provider. Client auth is UX; the server enforces.
---

# Mobile Authentication

## Purpose

Plan authentication: sign-in/up flows, token/session lifecycle (issue, store, refresh, revoke), and secure token storage — coordinated with the API layer and the chosen provider.

## When to Use

- When the app has user accounts or protected content.
- Not for authorization/role checks (that's `mobile-authorization`).

## Inputs

- Auth provider/model (custom JWT, Supabase/Firebase, Clerk/Auth0).
- API integration and secure storage.

## Discovery Questions

- Which auth provider/model is used?
- How are tokens issued, refreshed, and revoked?
- Where are tokens stored securely (`mobile-secure-storage`)?
- What are the session-expiry and logout behaviors?

## Responsibilities

- Plan **login/signup** and session establishment.
- Handle **token lifecycle**: issue, **secure storage**, **refresh**, revoke on logout.
- Attach tokens via the **API layer** (`mobile-api-integration`).
- Coordinate **protected routes** (`mobile-authorization`, `mobile-navigation`).

## Required Workflow

1. Confirm provider/model + token lifecycle.
2. Plan login/signup + session establishment.
3. Store tokens securely; wire refresh + logout.
4. Attach tokens in the API interceptor.
5. Record the auth plan.

## Decision Rules

- Store tokens in secure storage (Keychain/Keystore), never in plain async storage or app state alone.
- Refresh centrally in the API layer; don't scatter refresh logic.
- Client auth gates UX; the server enforces access (`../../security-review`).

## Rules

- Secure token storage (`mobile-secure-storage`); no tokens in logs.
- No hard-coded credentials/secrets.
- Coordinate enforcement with the backend; client checks are not security.

## Anti-Patterns

- Tokens in plain async storage or logs.
- Scattered refresh logic.
- Treating client-side auth as the security boundary.
- Hard-coded credentials.

## Validation Checklist

- [ ] Provider/model confirmed.
- [ ] Login/signup + session planned.
- [ ] Tokens stored securely; refresh + logout wired.
- [ ] Tokens attached via API layer.
- [ ] Server enforcement noted as authoritative.

## Definition of Done

A recorded authentication plan: login/signup, secure token lifecycle with refresh and logout, API-layer attachment, and protected-route coordination — with server-side enforcement authoritative.

## Related Skills

`mobile-authorization`, `mobile-secure-storage`, `mobile-api-integration`, `mobile-navigation`, `../../security-review`

## Related Knowledge

`../../../knowledge/` (auth model, trust boundaries).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** auth provider/model, API layer, secure storage.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-secure-storage`, `mobile-api-integration`, `mobile-authorization`.
- **Stop when:** the auth plan is recorded.

## Token Efficiency Guidance

Plan the token lifecycle and provider; delegate storage/transport to their skills.
