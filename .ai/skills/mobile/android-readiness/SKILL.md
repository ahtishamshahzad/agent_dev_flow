---
name: android-readiness
description: Use to validate Android release readiness — application id, signing (keystore/Play signing), permissions and manifest, target/compile SDK, 16KB page-size support, and Play policy fit. Read-and-verify; flags gaps before submission.
---

# Android Readiness

## Purpose

Verify the Android app is ready to build and submit: application id, signing, permissions/manifest, target/compile SDK, 16KB page-size support, and Play policy fit.

## When to Use

- Before an Android Play build/submission.
- When adding a permission/capability or bumping SDK targets.
- Not for iOS specifics (`ios-readiness`).

## Inputs

- Android config (applicationId, manifest, Gradle, signing).
- Permissions/capabilities used; native libraries present.

## Discovery Questions

- Is the applicationId correct and stable?
- Is signing (keystore/Play App Signing) configured?
- Do manifest permissions match used features (and none extra)?
- Are target/compile SDK current, and is 16KB page-size support in place for native libs?

## Responsibilities

- Verify **applicationId** and **signing** (keystore / Play App Signing).
- Verify **manifest permissions** match used features (no over-permissioning).
- Verify **target/compile SDK** meet Play requirements.
- Verify **16KB memory page-size** support for native `.so` libraries.
- Check **Play policy/data-safety** fit; flag gaps without changing signing.

## Required Workflow

1. Read Android config + permissions + native libs.
2. Cross-check permissions vs used features.
3. Verify SDK targets + 16KB alignment for native libs.
4. Check Play policy/data-safety.
5. Record readiness findings + gaps.

## Decision Rules

- Manifest permissions must match used features — remove over-permissions (Play rejects/flags them).
- Target SDK must meet current Play minimums.
- Native libraries must support 16KB page sizes for modern devices/Play requirements.
- applicationId and signing are not changed without approval (`../../../system/OPERATING_RULES.md`).

## Rules

- Do not change signing/applicationId without explicit approval.
- No keystore/secrets committed (`../../security-review`).
- Verify against current Play requirements (SDK, 16KB, data safety).

## Anti-Patterns

- Over-permissioned manifest.
- Outdated target SDK.
- Native libs not 16KB-aligned.
- Changing signing/applicationId silently.

## Validation Checklist

- [ ] applicationId + signing verified.
- [ ] Manifest permissions match features (no extras).
- [ ] Target/compile SDK current.
- [ ] 16KB page-size support verified for native libs.
- [ ] Play policy/data-safety reviewed.

## Definition of Done

A recorded Android readiness report: verified applicationId/signing, correct permissions, current SDK targets, 16KB support for native libraries, and Play policy fit — with gaps flagged and no unapproved signing changes.

## Related Skills

`mobile-builds`, `mobile-release`, `mobile-native-modules`, `mobile-notifications`, `mobile-background-tasks`, `mobile-location-maps`, `../../security-review`

## Related Knowledge

`../../../knowledge/` (Android config, Play account).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** Android config, used permissions/capabilities, native libraries.
- **Does not require:** app screen logic, the full mobile skill set, unrelated references.
- **May load:** `mobile-builds`, `mobile-release`, `mobile-native-modules`.
- **Stop when:** Android readiness findings are recorded.

## Token Efficiency Guidance

Read Android/Gradle/manifest config + native libs; don't read app logic. Summarize gaps.
