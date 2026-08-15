---
name: auth-form-validation
description: Use to define the credential input contract for login, signup, password reset, and change-password forms — one schema for email and password rules, wired into React Hook Form on the client and re-enforced identically on the server. Client validation is UX; the server is the authority. Error copy must not reveal whether an account exists.
---

# Auth Form Validation

## Purpose

Define the **credential input contract** once — what a valid email is, what a valid password is, how confirmation is checked — and enforce it in both places it must hold: the form the user types into, and the endpoint that accepts the request. Auth forms are the most attacked inputs in most applications and the ones most often left validated only by the submit button.

Field rules for auth specifically. Form mechanics live in `web/web-forms` and `mobile/mobile-forms`; credential *storage* and session handling live in `security/authentication-security`.

## When to Use

- Building or reviewing **login, signup, password reset (request and confirm), or change password**.
- When an audit finds auth forms submitting unvalidated input, or client and server rules disagreeing.
- **Not** for general forms (`web/web-forms`, `mobile/mobile-forms`), authorization (`security/authorization-security`), or rate limiting (`security/abuse-prevention`).

## Inputs

- The auth flows in scope and the approved stack (`web/web-stack-selection`, `mobile/mobile-stack-selection`).
- Any compliance constraint on password policy.
- Where the schema can be shared from — a shared package in a monorepo (`repository-architecture`).

## Discovery Questions

- Which auth forms exist, and does each have a server endpoint enforcing the same rules?
- Can one schema module be imported by both client and server, or must the rules be mirrored?
- Any compliance requirement that dictates password policy (and does it conflict with current guidance)?
- Is there an existing user base whose passwords won't meet a new policy — what happens at their next login?

## The contract

**One schema module, imported by client and server.** In a monorepo it belongs in a shared package; when the client and server can't share code, the rules are mirrored and a test asserts they agree. Two hand-written copies that drift is the failure this skill exists to prevent.

### Email

| Rule | Value | Where |
|------|-------|-------|
| Trim whitespace | always | schema transform |
| Lowercase | always | schema transform |
| Format | a single permissive check — not a hand-rolled RFC regex | schema |
| Max length | 254 | schema |

Normalize **before** validating and before lookup, or `  User@Example.com ` and `user@example.com` become two accounts. Deliverability is proven by sending a verification email, never by a stricter regex.

### Password

| Rule | Value | Rationale |
|------|-------|-----------|
| Minimum length | **12 characters** | length beats composition |
| Maximum length | **128 characters** | bounds hashing cost; see the bcrypt note below |
| Composition rules | **none** | forced upper/digit/symbol produces predictable passwords (`Password1!`) |
| Never trimmed | leading/trailing spaces are part of the password | trimming silently changes what the user typed |
| Breach check | **server-side**, against a known-compromised list | the single highest-value check |
| Paste | **must work** | blocking paste breaks password managers and weakens passwords |

Length-first policy follows current NIST 800-63B guidance: minimum length, no composition mandates, and screening against known-breached passwords.

> **bcrypt truncates at 72 bytes.** If the approved stack hashes with bcrypt, a 128-character limit is silently a 72-byte one — multi-byte characters hit it sooner. Either cap at 72, pre-hash before bcrypt, or use argon2id. Decide deliberately; don't let it be discovered later.

### Confirm password

Equality with the password field, checked **client-side only** — the server has no use for a second copy. The error attaches to the confirm field, not the form.

## Wiring into React Hook Form

- Attach the schema through the **resolver** — `zodResolver(schema)` — so one definition drives every field. Never re-express rules as inline `register` options.
- **Validation timing**: validate on blur, then re-validate on change once a field has errored. Validating every keystroke from the first character scolds the user mid-typing; validating only on submit hides the problem until too late.
- **Errors are per-field and announced**: tied to the input with `aria-describedby`, `aria-invalid` on the control, focus moved to the first invalid field on failed submit.
- **The submit button stays enabled.** A disabled button with no explanation is the most common way auth forms "validate" — the user cannot tell what is wrong. Submit, then show errors.
- **Server errors map back onto fields** where they belong (email already registered → email field) and to form level otherwise.
- **Prevent double submit** via the form's pending state, not a manual flag.

## Error copy that doesn't leak

Validation messages are an account-enumeration surface (`security/authentication-security`):

| Form | Says | Never says |
|------|------|------------|
| Login | "Email or password is incorrect" | "No account with that email" · "Wrong password" |
| Signup | proceeds, sends email — "Check your email" | "That email is already registered" |
| Reset request | "If an account exists, we've sent a link" | "No account found" |
| Reset confirm | "This link is invalid or expired" | which of the two it was |

Format errors ("Enter a valid email") are safe — they describe the input, not the account. Keep response **timing** similar across found/not-found paths too; a fast 404 and a slow 200 leak the same fact.

## Responsibilities

- Write **one schema module** for the credential fields, exported for client and server.
- Wire it into the form through the RHF resolver on every auth form in scope.
- **Re-validate identically on the server** — the endpoint parses with the same schema before touching the database.
- Add the **breach check** server-side on signup and password change.
- Apply the enumeration-safe copy above to every auth message.
- Confirm **rate limiting exists** on these endpoints (`security/abuse-prevention`) — validation rejects malformed input, it does not stop repeated attempts.
- Document each auth screen/page with its rules and failure modes (`application-documentation`).

## Required Workflow

1. List the auth forms in scope and their server endpoints.
2. Write the shared schema (email, password, confirm) with user-facing messages.
3. Wire the resolver into each form; set validation timing and error presentation.
4. Enforce the same schema server-side; add the breach check.
5. Apply enumeration-safe copy; check response timing.
6. Test the required cases below.

## Decision Rules

- **The server is the authority.** A rule that exists only in the client is not enforced — an attacker posts directly to the endpoint.
- **Shared module over mirrored rules**; if mirroring is unavoidable, a test asserts the two agree.
- **Existing users below a new minimum** are not locked out silently — either grandfather them or force a reset at next login, as a decision, not an accident.
- **Compliance beats this default** where it genuinely applies — record the conflict and what was chosen.

## Rules

- Passwords, reset tokens, and their lengths never appear in logs, analytics, or error reports (`security/SECURITY_RULES` via `security/authentication-security`).
- No `maxLength` on the password input below the policy max — it truncates password-manager output.
- Autocomplete attributes set correctly (`username`, `current-password`, `new-password`) so managers work with the form rather than against it.
- Validation is not throttling; both are required.

## Anti-Patterns

- A disabled submit button as the entire validation strategy.
- Hand-rolled email regex that rejects valid addresses (`+` tags, new TLDs, long domains).
- Trimming or lowercasing the **password**.
- Blocking paste "for security."
- Composition rules plus a short minimum — the weakest combination in common use.
- Client-only checks, with the endpoint accepting anything.
- "Email not found" on login, undoing the enumeration protection everywhere else.
- Rules copied into three files and edited in one.

## Validation Checklist

- [ ] One schema module covers email, password, confirm; both sides import or provably mirror it.
- [ ] Every auth form wires it through the RHF resolver — no inline duplicate rules.
- [ ] Server re-validates with the same schema before any lookup or write.
- [ ] Email normalized (trim + lowercase) before validation and lookup.
- [ ] Password: min 12, max 128, no composition mandate, not trimmed, paste allowed.
- [ ] bcrypt 72-byte interaction decided explicitly if bcrypt is the hash.
- [ ] Breach check runs server-side on signup and password change.
- [ ] Messages don't reveal account existence; timing doesn't either.
- [ ] Submit enabled; errors per-field, announced, focus to first error.
- [ ] Rate limiting confirmed on auth endpoints.
- [ ] Tests cover the required cases.

## Required Test Cases

Per form: valid submission; each field invalid in isolation; confirm mismatch; **the server rejecting input the client would have allowed** (post directly, bypassing the form); an existing-email signup returning the same shape as a new one; a login failure message identical for unknown-email and wrong-password.

## Definition of Done

Auth forms whose rules exist in one place, run through the resolver on the client, are re-enforced identically on the server, reject known-breached passwords, and whose messages and timing reveal nothing about which accounts exist — with the bypass case proven by test.

## Related Skills

`web/web-forms`, `mobile/mobile-forms`, `mobile/mobile-validation`, `backend/backend-validation`, `web/web-authentication`, `mobile/mobile-authentication`, `backend/backend-authentication`, `security/authentication-security`, `security/abuse-prevention`, `application-documentation`.

## Related Knowledge

`../../knowledge/` (compliance constraints on credential policy, if any).

## Related References

`../../references/backend/auth/` (account flows), `../../references/security/` (threat model, policy decisions).

## Context Loading Guidance

- **Requires:** the auth forms in scope, their endpoints, the approved stack, any compliance constraint.
- **Does not require:** unrelated forms, session/token internals, the full auth implementation.
- **May load:** `security/authentication-security` for storage and revocation; `security/abuse-prevention` for throttling.
- **Stop when:** the schema, its wiring, and the server enforcement are defined and tested.

## Token Efficiency Guidance

Express the contract as the field table plus the schema module — not prose per field. Reference the enumeration copy table rather than restating it per form.
