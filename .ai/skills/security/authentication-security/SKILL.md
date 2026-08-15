---
name: authentication-security
description: Use to review authentication for security weaknesses — credential storage, session/token handling, brute-force and enumeration resistance, reset/OTP/MFA flows, and logout/revocation. The security-review lens on identity; backend-authentication is the design/build skill.
---

# Authentication Security

## Purpose

Assess whether the system's **identity handling** resists attack: are credentials stored safely, tokens/sessions handled correctly, flows enumeration- and brute-force-resistant, and revocation real. The review/audit lens; the design and construction live in `../../backend/backend-authentication`.

## When to Use

- Reviewing authentication design or an existing implementation for security.
- As the identity slice of `../../security-review` and `threat-modeling` spoofing/elevation threats.
- **Not** for building auth (`../../backend/backend-authentication`) or authorization (`authorization-security`).

## Inputs

- The authentication design/implementation (`../../backend/backend-authentication`).
- Threat model's identity threats (`threat-modeling`).

## Discovery Questions

- How are passwords stored (adaptive hash?), and are secrets/tokens ever logged?
- Session vs JWT — is revocation actually possible, and does logout/password-change invalidate?
- Are login/reset flows resistant to brute force (`abuse-prevention`) and account enumeration?
- Are reset tokens/OTPs single-use, expiring, and attempt-limited? Is MFA (if present) implemented soundly?

## Responsibilities

- Confirm the credential **input contract** is enforced server-side, not only in the form (`../../auth-form-validation`) — including the breach check and enumeration-safe messages.

- Verify **credential storage**: adaptive hashing (bcrypt/argon2/scrypt), never plaintext or fast hashes; no credentials/tokens in logs, errors, or URLs.
- Assess **session/token handling**: httpOnly/secure/sameSite cookies for browsers (not localStorage tokens); short-lived access + rotating refresh with reuse detection for JWTs; signing keys managed (`secrets-audit`).
- Verify **revocation is real**: logout and password change invalidate sessions/tokens; a pure-stateless JWT with no denylist can't truly revoke — flag the gap.
- Check **brute-force + enumeration resistance**: login/reset/OTP throttled and CAPTCHA-guarded (`abuse-prevention`); responses don't reveal whether an account exists.
- Review **flows**: reset tokens single-use + expiring; OTP attempt-limited + expiring; MFA/recovery-code secrets stored safely; verification flows sound.
- Confirm findings become **security regression tests** (`security-regression-testing`).

## Required Workflow

1. Review credential storage + secret handling.
2. Assess session/token issuance, expiry, rotation, revocation.
3. Check brute-force + enumeration resistance on public flows.
4. Review reset/OTP/MFA flows for reuse/expiry/limits.
5. Record findings (Confirmed vs Potential); route mitigations to build skills + regression tests.

## Decision Rules

- Fast-hash or plaintext passwords = confirmed high-severity finding.
- If revocation is required but the token scheme can't do it, that's a design finding, not a nitpick.
- Enumeration-revealing responses on login/reset are real findings — attackers harvest valid accounts.
- Client-held auth state is a hint, never proof; server must verify every request.

## Rules

- Never print discovered secrets/credentials — reference location, flag rotation (`secrets-audit`).
- Findings separated Confirmed vs Potential; never declare auth "secure" (`../../security-review`).
- Each finding maps to a fix + a regression test.

## Anti-Patterns

- Reviewing auth as if "logged in" implied "authorized" (that's `authorization-security`).
- Passing an implementation with unrevocable long-lived tokens.
- Ignoring account enumeration in error messages/timing.
- Reset links that don't expire or reused OTPs.
- Treating rate limiting as the whole brute-force defense (it's one layer).

## Validation Checklist

- [ ] Credential storage: adaptive hashing; no secret logging.
- [ ] Session/token: secure cookies / rotating refresh; keys managed.
- [ ] Revocation real (logout/password-change invalidate).
- [ ] Brute-force + enumeration resistance verified.
- [ ] Reset/OTP/MFA flows: single-use, expiring, attempt-limited.
- [ ] Findings → fixes → regression tests.

## Definition of Done

A recorded authentication security assessment — credential storage, session/token handling, revocation, brute-force/enumeration resistance, and account flows — with Confirmed/Potential findings routed to fixes and security regression tests, and no "secure" claim.

## Related Skills

`../../backend/backend-authentication`, `authorization-security`, `abuse-prevention`, `secrets-audit`, `security-regression-testing`, `../../security-review`, `threat-modeling`, `web-security`, `mobile-security`.

## Related Knowledge

`../../../knowledge/` (identity threats, provider constraints).

## Related References

`../../../references/security/` (auth review checklists, when populated).

## Context Loading Guidance

- **Requires:** the authentication design/impl, identity threats.
- **Does not require:** authorization model, unrelated code.
- **May load:** `../../backend/backend-authentication`, `abuse-prevention`.
- **Stop when:** findings + routed mitigations/regression tests are recorded.

## Token Efficiency Guidance

The finding table (area → issue → severity → fix → test) is the artifact; never echo real credentials/secrets.
