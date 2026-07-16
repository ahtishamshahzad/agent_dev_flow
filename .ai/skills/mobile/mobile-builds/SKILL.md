---
name: mobile-builds
description: Use to plan mobile builds — dev/preview/production builds via EAS Build (Expo) or Fastlane/native tooling (CLI), signing, and native build validation. Coordinates iOS/Android readiness.
---

# Mobile Builds

## Purpose

Plan the build pipeline: dev/preview/production builds (EAS Build for Expo, Fastlane/native tooling for CLI), code signing, and native build validation across platforms.

## When to Use

- When the app needs installable builds beyond the JS bundle.
- Before release or E2E on real devices.
- Not for JS-only changes needing no native rebuild.

## Inputs

- Runtime (Expo/CLI) and build model.
- Signing assets and target platforms.

## Discovery Questions

- EAS Build (Expo) or Fastlane/native tooling (CLI)?
- Which profiles are needed (dev/preview/production)?
- How is code signing handled per platform?
- What validates a native build actually runs?

## Responsibilities

- Define **build profiles** (dev/preview/production).
- Plan **EAS Build** (Expo) or **Fastlane/native** (CLI) pipelines.
- Handle **code signing** for iOS/Android.
- **Validate native builds** run (smoke) and coordinate readiness (`ios-readiness`, `android-readiness`).

## Required Workflow

1. Confirm runtime + required profiles.
2. Set up the build pipeline (EAS or native).
3. Configure signing per platform.
4. Validate builds install/run.
5. Record the build plan.

## Decision Rules

- Expo to EAS Build; CLI to Fastlane/native tooling — match the runtime.
- A green JS build is not a validated native build — run a smoke install.
- Keep signing assets secure (never commit private keys).
- Separate dev/preview/production profiles.

## Rules

- No signing keys/secrets committed (`../../security-review`).
- Validate native builds, don't assume.
- Coordinate readiness for store builds.

## Anti-Patterns

- Assuming a passing bundle equals a working install.
- Committing signing keys.
- One build profile for all stages.
- Skipping native build validation before release.

## Validation Checklist

- [ ] Build profiles defined.
- [ ] EAS/native pipeline set up.
- [ ] Signing configured securely.
- [ ] Native build validated (smoke).
- [ ] Readiness coordinated.

## Definition of Done

A recorded build plan: dev/preview/production profiles, an EAS or native pipeline, secure signing, and validated native builds — coordinated with iOS/Android readiness.

## Related Skills

`ios-readiness`, `android-readiness`, `mobile-release`, `expo-foundation`, `react-native-cli-foundation`, `mobile-native-modules`, `../../release-planning`

## Related Knowledge

`../../../knowledge/` (build/signing setup).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** runtime/build model, signing assets, target platforms.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `ios-readiness`, `android-readiness`, `mobile-release`.
- **Stop when:** the build plan is recorded and a build validated.

## Token Efficiency Guidance

Plan profiles + pipeline + signing; delegate store specifics to readiness skills.
