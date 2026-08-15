---
name: backend-authentication
description: Use to plan backend authentication (who the caller is) — credential storage (hashing), sessions vs JWT, token lifecycle/refresh/revocation, logout, and account flows (signup, password reset, OTP). Authentication is not authorization.
---

# Backend Authentication

## Purpose

Establish the caller's identity safely: credential handling, session/token strategy, lifecycle (issue → refresh → revoke), and the account flows around it. **Authentication answers "who is this?" — what they may do is `backend-authorization`.**

## When to Use

- When designing or reworking login/signup/session handling.
- **Not** for role/permission/ownership decisions (authorization skills) or abuse throttling (`rate-limiting`, `captcha-abuse-prevention`) — those wrap these flows but are distinct concerns.

## Inputs

- Client list (web/mobile/third-party) and their session constraints.
- Requirements: SSO/OAuth providers, MFA/OTP, session duration policy.

## Discovery Questions

- Which clients authenticate, and can they hold secrets (browser vs mobile vs server)?
- Sessions (server-state, revocable) or JWTs (stateless, revocation harder) — what does the system actually need?
- What account flows are in scope: signup, verify, password reset, OTP, MFA?
- What forces logout-everywhere (password change, breach response)?

## Responsibilities

- Credential **input rules** (email normalization, password policy, confirm match) come from `../../auth-form-validation` — one schema, enforced on the server too.

- Store credentials only as strong adaptive hashes (bcrypt/argon2); never reversible, never logged.
- Choose **session vs JWT** on requirements: revocability, horizontal scale, third-party consumption — and record the trade-off. Short-lived access + refresh rotation when JWTs are chosen; httpOnly/secure/sameSite cookies for browsers.
- Define lifecycle: issuance, expiry, refresh rotation (reuse detection), revocation, logout (and logout-all).
- Design account flows: signup + verification, password reset (single-use, expiring, no account enumeration), OTP (expiring, attempt-limited).
- Hand abuse protection of these public flows to `rate-limiting` + `captcha-abuse-prevention`; hand post-login access decisions to `backend-authorization`.

## Required Workflow

1. Gather clients, providers, and session requirements.
2. Choose the credential + session/token strategy; record trade-offs.
3. Define token/session lifecycle including revocation and logout.
4. Design each account flow with its failure and abuse cases.
5. Specify tests: wrong password, expired/tampered token, reused refresh token, reset-token reuse, enumeration responses.

## Decision Rules

- Browsers get httpOnly cookies, not localStorage tokens.
- If instant revocation is a hard requirement, pure stateless JWT is the wrong tool — use sessions or a denylist and record the cost.
- Responses to login/reset must not reveal whether an account exists.
- MFA/OTP secrets and recovery codes are credentials — hash/encrypt accordingly.

## Rules

- Server verifies identity on every request; client-held state is a hint, not proof.
- Secrets (signing keys, provider credentials) follow `../../environment-audit` / `backend-security`.
- Never invent crypto; use vetted libraries and record versions.

## Anti-Patterns

- Confusing authentication with authorization ("logged in" ⇒ "allowed").
- Long-lived access tokens with no refresh/rotation story.
- Password reset links that don't expire or work multiple times.
- Different error messages for "no such user" vs "wrong password."
- Storing plaintext or fast-hash (MD5/SHA1) passwords.

## Validation Checklist

- [ ] Credential storage uses adaptive hashing.
- [ ] Session/JWT choice recorded with trade-offs.
- [ ] Lifecycle covers refresh rotation, revocation, logout(-all).
- [ ] Account flows designed with enumeration resistance.
- [ ] Abuse protection delegated to rate-limiting/CAPTCHA skills.
- [ ] Negative tests specified (tampered/expired/reused tokens).

## Definition of Done

A recorded authentication design — credential handling, session/token strategy with trade-offs, full lifecycle, account flows with enumeration resistance — with negative tests specified and authorization explicitly out of scope.

## Related Skills

`backend-authorization`, `role-permission-design`, `ownership-authorization`, `rate-limiting`, `captcha-abuse-prevention`, `backend-security`, `email-notifications` (verification/reset mail), `../../security-review`.

## Related Knowledge

`../../../knowledge/` (identity providers, session policy).

## Related References

`../../../references/backend/auth/` (flow notes, when populated).

## Context Loading Guidance

- **Requires:** client list, provider/MFA requirements, session policy.
- **Does not require:** role models, endpoint inventory, database internals.
- **May load:** `backend-authorization` (hand-off), `rate-limiting` (flow protection).
- **Stop when:** the authentication design + negative tests are recorded.

## Token Efficiency Guidance

Design from the client/flow list; a lifecycle table (event → token effect) carries more than prose. Delegate authorization and abuse throttling instead of restating them.
