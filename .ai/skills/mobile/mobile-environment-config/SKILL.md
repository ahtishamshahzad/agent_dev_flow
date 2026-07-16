---
name: mobile-environment-config
description: Use to plan mobile environment configuration — dev/staging/prod separation, env-var handling, base URLs and keys via config (not hard-coded), and safe client exposure. No secrets in the client bundle.
---

# Mobile Environment Config

## Purpose

Plan environment configuration: how dev/staging/prod differ, how config/keys are supplied (not hard-coded), and how to avoid shipping secrets in the client bundle.

## When to Use

- When the app has multiple environments or external config/keys.
- Not for a single trivial constant.

## Inputs

- Environments and their differences.
- Which values are public-safe vs sensitive; runtime (Expo/CLI).

## Discovery Questions

- Which environments exist and how do they differ (URLs, keys, flags)?
- How is config supplied per build (Expo extra/env, CLI env)?
- Which values are safe on the client vs must stay server-side?
- How does the build select the environment?

## Responsibilities

- Define **environment separation** (dev/staging/prod).
- Supply config via the **runtime's mechanism** (Expo config/extra, CLI env), not hard-coded.
- Keep **secrets out of the client bundle**; only public-safe values ship (`../../security-review`).
- Wire base URLs/keys into API and services by environment.

## Required Workflow

1. List environments + differences.
2. Choose the runtime config mechanism.
3. Separate public-safe from sensitive values.
4. Wire env into API/services.
5. Record the config plan.

## Decision Rules

- Client bundles are public — never ship a real secret in one; sensitive operations proxy through a backend.
- Config comes from the build's environment mechanism, not literals.
- Fail fast if a required config value is missing.

## Rules

- No secrets or private keys in the client bundle.
- No hard-coded URLs/keys — use config.
- Coordinate deep exposure review with `../../security-review` / `../../environment-audit`.

## Anti-Patterns

- Hard-coded base URLs/keys.
- Shipping backend secrets to the client.
- One config blob with no env separation.
- No failure on missing critical config.

## Validation Checklist

- [ ] Environments defined + differences documented.
- [ ] Runtime config mechanism chosen.
- [ ] Public-safe vs sensitive separated.
- [ ] No secrets in the client bundle.
- [ ] Env wired into API/services; fail-fast on missing config.

## Definition of Done

A recorded environment-config plan: dev/staging/prod separation, runtime-appropriate config supply, sensitive values kept off the client, and fail-fast on missing config.

## Related Skills

`mobile-api-integration`, `mobile-secure-storage`, `../../security-review`, `../../environment-audit`, `expo-foundation`, `react-native-cli-foundation`

## Related Knowledge

`../../../knowledge/` (environments, endpoints).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** environments, value sensitivity, runtime.
- **Does not require:** the whole app source, unrelated references, every mobile skill.
- **May load:** `../../security-review`, `../../environment-audit`.
- **Stop when:** the config plan is recorded.

## Token Efficiency Guidance

Focus on config/env files and value sensitivity; don't read app logic.
