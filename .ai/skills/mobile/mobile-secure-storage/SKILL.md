---
name: mobile-secure-storage
description: Use to plan secure on-device storage — Keychain/Keystore for tokens and sensitive data vs async storage for non-sensitive data — with clear rules on what may be persisted where. No secrets in plain storage or logs.
---

# Mobile Secure Storage

## Purpose

Plan on-device storage: which data goes in secure storage (Keychain/Keystore) vs plain async storage, and the rules that keep sensitive data protected.

## When to Use

- When the app persists tokens, credentials, or any sensitive data.
- Not for purely in-memory/ephemeral state.

## Inputs

- The data to persist and its sensitivity.
- Runtime secure-storage options (Expo SecureStore / Keychain / Keystore).

## Discovery Questions

- Which values are sensitive (tokens, PII) vs non-sensitive (prefs)?
- Which secure-storage API fits the runtime?
- What is the rehydration and clear-on-logout behavior?

## Responsibilities

- Classify data **sensitive vs non-sensitive**.
- Store **sensitive data** in Keychain/Keystore (secure storage); non-sensitive in async storage.
- Define **rehydration** and **clear-on-logout** behavior.
- Ensure sensitive data never lands in logs or plain storage (`../../security-review`).

## Required Workflow

1. Classify each persisted value.
2. Route sensitive to secure storage, else async storage.
3. Define rehydration + logout-clear.
4. Confirm nothing sensitive is logged.
5. Record the storage plan.

## Decision Rules

- Tokens/credentials/PII to secure storage only.
- Non-sensitive prefs to async storage is fine.
- Clear sensitive storage on logout; never log sensitive values.

## Rules

- No secrets/tokens in plain async storage or logs.
- Use platform secure storage for sensitive data.
- Coordinate with auth for token handling.

## Anti-Patterns

- Tokens/PII in plain async storage.
- Sensitive values in logs.
- No clear-on-logout.
- Encrypting nothing and calling it secure.

## Validation Checklist

- [ ] Data classified by sensitivity.
- [ ] Sensitive to secure storage; non-sensitive to async storage.
- [ ] Rehydration + logout-clear defined.
- [ ] No sensitive data logged.

## Definition of Done

A recorded storage plan: sensitive data in Keychain/Keystore, non-sensitive in async storage, defined rehydration and clear-on-logout, and no sensitive values in logs.

## Related Skills

`mobile-authentication`, `mobile-state-management`, `../../security-review`, `mobile-environment-config`

## Related Knowledge

`../../../knowledge/` (data sensitivity).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** data to persist + sensitivity, runtime secure-storage options.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-authentication` for tokens; `../../security-review` for exposure.
- **Stop when:** the storage plan is recorded.

## Token Efficiency Guidance

Plan from the persisted-value list and sensitivity; keep it short.
