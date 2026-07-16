---
name: expo-foundation
description: Use to plan an Expo mobile foundation after Expo is chosen — development builds vs Expo Go, EAS Build/Submit, OTA updates, TypeScript, navigation, safe-area, linting, and config plugins. Evaluates each option against need; installs nothing without approval.
---

# Expo Foundation

## Purpose

Plan a clean Expo project foundation once `mobile-stack-selection` chose Expo: the build model (Expo Go vs development builds), EAS pipelines, OTA strategy, and the baseline libraries — each justified, not blanket-installed.

## When to Use

- After Expo is the approved runtime, before feature work.
- When standardizing an existing Expo app's foundation.
- **Not** for React Native CLI projects (`react-native-cli-foundation`).

## Inputs

- Approved runtime (Expo) and stack area decisions.
- Requirement baseline; native-capability needs from `mobile-stack-selection`.

## Discovery Questions

- Does the app need native modules requiring **development builds** (vs Expo Go)?
- Will EAS Build/Submit and OTA updates be used?
- TypeScript (default yes)? Which navigation, and is safe-area needed?
- Which config plugins are required for native capabilities?

## Responsibilities

- Decide **build model**: Expo Go for prototyping vs **development builds** for real native packages.
- Plan **EAS Build / EAS Submit** and **OTA update** strategy where valuable.
- Evaluate baseline libraries (install only what's needed): TypeScript, navigation (`mobile-navigation`), Safe Area Context, vector icons (`mobile-vector-icons`), ESLint, Prettier.
- Plan **config plugins** for required native capabilities.
- Keep the foundation minimal; defer feature libraries to their skills.

## Required Workflow

1. Confirm Expo is approved.
2. Choose build model (dev builds if native packages/plugins are needed).
3. Plan EAS + OTA strategy.
4. Select baseline libraries by need; delegate navigation/icons/state to their skills.
5. Record the foundation plan; install nothing without approval.

## Decision Rules

- Use **development builds** the moment a native package/config plugin is required — Expo Go is prototyping only.
- Enable EAS Submit/OTA only when they add value; document the release model (`mobile-release`).
- TypeScript by default unless the project mandates otherwise.
- Add a library only when a requirement needs it (`../../stack-recommendation`).

## Rules

- No dependency installation without approval.
- Match Expo SDK conventions; don't eject to CLI to add something Expo supports.
- Defer feature concerns (auth, forms, state) to their dedicated skills.

## Anti-Patterns

- Staying on Expo Go when native packages are needed.
- Installing a broad "starter kit" of libraries up front.
- Ejecting to CLI for capabilities Expo dev builds already cover.

## Validation Checklist

- [ ] Build model chosen (Go vs dev builds) with reason.
- [ ] EAS Build/Submit + OTA strategy decided.
- [ ] Baseline libraries selected by need.
- [ ] Config plugins planned for native capabilities.
- [ ] TypeScript decision recorded.
- [ ] No unapproved installs.

## Definition of Done

A recorded Expo foundation plan: build model, EAS/OTA strategy, justified baseline libraries, and config plugins — proportional and approval-pending, with feature libraries deferred to their skills.

## Related Skills

`mobile-stack-selection`, `mobile-navigation`, `mobile-vector-icons`, `mobile-environment-config`, `mobile-builds`, `mobile-release`, `../../stack-recommendation`.

## Related Knowledge

`../../../knowledge/` (mobile architecture decisions).

## Related References

`../../../references/mobile/` (screens, navigation) when populated.

## Context Loading Guidance

- **Requires:** approved Expo runtime, requirement baseline, native-capability needs.
- **Does not require:** the full mobile skill set, app source, unrelated references.
- **May load:** `mobile-navigation`, `mobile-vector-icons`, `mobile-builds` as foundation is assembled.
- **Stop when:** the foundation plan is recorded.

## Token Efficiency Guidance

Plan from the requirement summary. Delegate to sub-skills rather than restating navigation/icon/state detail; keep the foundation list terse.
