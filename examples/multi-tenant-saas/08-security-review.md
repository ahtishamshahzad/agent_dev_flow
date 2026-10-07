# 8 — Threat model and security review plan

> **Status: PROPOSED.** Fictional example. Stage: `threat-modeling`, then `security-review` at Gate 6. These are threats to design against — **not findings**. A real review reports Confirmed vs Potential against built code, and never concludes "secure".

## Assets

Tenant inspection data · photos (may show people, plates — N5) · session tokens · Stripe customer link · admin role.

## Threats → mitigations → how it will be verified

| # | Threat | Mitigation (in the design) | Verified by |
|---|---|---|---|
| T1 | Read another org's job by guessing an ID (IDOR) | Org from session; scoped repository; RLS; "not found" on cross-tenant | Denial test per endpoint (07); `authorization-security` review |
| T2 | Inspector escalates to manager or admin | RoleGuard on every mutation; role changes admin-only, audited | Denial tests; review of every `@Roles` usage |
| T3 | Photo URL shared or leaked | Private bucket; short-lived signed URLs issued after tenant + role check | Test that an expired or other-org URL fails |
| T4 | Forged Stripe webhook changes a subscription | Signature verification; idempotency by event ID; no trust in client-sent plan data | Webhook tests with bad signature and replay |
| T5 | Stolen phone exposes offline data | Data in app sandbox; token in secure storage; remote session revoke | `mobile-security` review |
| T6 | Credential stuffing on login | Rate limiting, lockout with backoff, breached-password check | `abuse-prevention`, `auth-form-validation` |
| T7 | Secrets in the repo or the mobile bundle | Secrets only server-side; secret scanning in CI | `secrets-audit` |
| T8 | Personal data kept forever | Retention per org; deletion on request removes photos and derived PDFs | `privacy-review` |

## At Gate 6

`security-review` runs against the built code. Each Confirmed finding goes through bug intake (Critical/High → P0/P1); Potential ones become `TECH-` tasks to verify. Money and personal data at this scale warrant a human security review before launch.
