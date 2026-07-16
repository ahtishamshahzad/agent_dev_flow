---
name: react-native-cli-foundation
description: Use to plan a React Native CLI mobile foundation after CLI is chosen — native project ownership (iOS/Android), TypeScript, navigation, safe-area, linting, and native tooling. Evaluates each baseline option against need; installs nothing without approval.
---

# React Native CLI Foundation

## Purpose

Plan a clean React Native CLI foundation once `mobile-stack-selection` chose CLI (for native ownership, custom modules, specialized SDKs, or an existing native project): the native project setup, baseline libraries, and tooling — each justified.

## When to Use

- After React Native CLI is the approved runtime, before feature work.
- When standardizing an existing bare RN project's foundation.
- **Not** for Expo projects (`expo-foundation`).

## Inputs

- Approved runtime (CLI) and stack area decisions.
- Requirement baseline; the native needs that justified CLI (`mobile-stack-selection`).
- Existing native project details (if integrating).

## Discovery Questions

- Which native capabilities/SDKs drove the CLI choice?
- Is there an existing iOS/Android project to integrate, or greenfield?
- TypeScript (default yes)? Which navigation; is safe-area needed?
- What native tooling/CI (CocoaPods, Gradle, Fastlane) is in place?

## Responsibilities

- Plan **native project ownership**: iOS (`Podfile`, workspace) and Android (Gradle) setup and conventions.
- Plan **custom native module** integration points if that drove the choice.
- Evaluate baseline libraries by need: TypeScript, navigation (`mobile-navigation`), Safe Area Context, vector icons (`mobile-vector-icons`), ESLint, Prettier.
- Plan native build/tooling (`mobile-builds`, `ios-readiness`, `android-readiness`).
- Keep the foundation minimal; defer feature libraries to their skills.

## Required Workflow

1. Confirm CLI is approved and why.
2. Plan iOS + Android native project setup (or existing-project integration).
3. Select baseline libraries by need; delegate to sub-skills.
4. Plan native build validation and readiness.
5. Record the foundation plan; install nothing without approval.

## Decision Rules

- CLI means owning the native projects — plan `ios/` and `android/` conventions explicitly.
- Custom native modules and specialized SDKs are integrated here, per platform.
- TypeScript by default unless the project mandates otherwise.
- Add a library only when a requirement needs it; don't recreate Expo's managed conveniences by hand unless required.

## Rules

- No dependency installation without approval.
- Respect existing native project conventions when integrating.
- Defer feature concerns (auth, forms, state) to their dedicated skills.

## Anti-Patterns

- Choosing CLI, then not planning the native project ownership it entails.
- Installing a broad "starter kit" of libraries up front.
- Hand-rolling managed features CLI doesn't require.

## Validation Checklist

- [ ] iOS + Android native setup (or integration) planned.
- [ ] Custom native module integration points planned (if applicable).
- [ ] Baseline libraries selected by need.
- [ ] Native build/tooling + readiness planned.
- [ ] TypeScript decision recorded.
- [ ] No unapproved installs.

## Definition of Done

A recorded CLI foundation plan: native iOS/Android ownership, custom-module integration (if any), justified baseline libraries, and native build/readiness — proportional and approval-pending, with feature libraries deferred.

## Related Skills

`mobile-stack-selection`, `mobile-navigation`, `mobile-vector-icons`, `mobile-native-modules`, `mobile-builds`, `ios-readiness`, `android-readiness`, `../../stack-recommendation`.

## Related Knowledge

`../../../knowledge/` (native architecture, existing projects).

## Related References

`../../../references/mobile/native/`, `../../../references/mobile/navigation/` when populated.

## Context Loading Guidance

- **Requires:** approved CLI runtime, the native needs, existing-project details.
- **Does not require:** the full mobile skill set, app source, unrelated references.
- **May load:** `mobile-native-modules`, `mobile-navigation`, `mobile-builds`, readiness skills.
- **Stop when:** the foundation plan is recorded.

## Token Efficiency Guidance

Plan from the requirement + native-needs summary. Delegate specifics to sub-skills; keep the native setup notes to conventions, not full config dumps.
