---
name: ios-readiness
description: Use to validate iOS release readiness — bundle identifier, signing/provisioning, entitlements/capabilities, Info.plist permission strings, privacy manifest, and App Store guidelines. Read-and-verify; flags gaps before submission.
---

# IOS Readiness

## Purpose

Verify the iOS app is ready to build and submit: identifiers, signing/provisioning, entitlements/capabilities, permission usage strings, privacy manifest, and store guideline fit.

## When to Use

- Before an iOS store build/submission.
- When adding a capability that changes entitlements/permissions.
- Not for Android specifics (`android-readiness`).

## Inputs

- iOS project config (bundle id, entitlements, Info.plist).
- The capabilities/permissions the app uses.

## Discovery Questions

- Is the bundle identifier correct and stable?
- Are signing/provisioning and capabilities set for each used feature?
- Do all used permissions have Info.plist usage strings?
- Is a privacy manifest / data-use disclosure needed?

## Responsibilities

- Verify **bundle identifier** and **signing/provisioning**.
- Verify **entitlements/capabilities** match used features (push, background, associated domains).
- Verify **Info.plist usage strings** for every permission requested.
- Check **privacy manifest**/data disclosures and **App Store guideline** fit.
- Flag gaps; don't change signing configs without approval.

## Required Workflow

1. Read iOS config + used capabilities/permissions.
2. Cross-check entitlements/capabilities vs features.
3. Verify permission usage strings.
4. Check privacy manifest + guideline fit.
5. Record readiness findings + gaps.

## Decision Rules

- Every requested permission needs an Info.plist usage string, or the app is rejected.
- Entitlements must match features (push/background/associated domains) or builds fail/reject.
- Bundle identifier and signing are not changed without approval (`../../../system/OPERATING_RULES.md`).
- Privacy/data-use disclosures are required where applicable.

## Rules

- Do not change signing/bundle id without explicit approval.
- No secrets in committed config (`../../security-review`).
- Verify against current App Store requirements.

## Anti-Patterns

- Missing permission usage strings.
- Entitlements not matching used capabilities.
- Changing signing/bundle id silently.
- Ignoring privacy-manifest requirements.

## Validation Checklist

- [ ] Bundle id + signing/provisioning verified.
- [ ] Entitlements/capabilities match features.
- [ ] Info.plist usage strings present.
- [ ] Privacy manifest/disclosures checked.
- [ ] Store guideline fit reviewed.

## Definition of Done

A recorded iOS readiness report: verified identifiers/signing, matched entitlements, complete permission strings, privacy disclosures, and guideline fit — with gaps flagged and no unapproved signing changes.

## Related Skills

`mobile-builds`, `mobile-release`, `mobile-notifications`, `mobile-background-tasks`, `mobile-location-maps`, `mobile-deep-linking`, `../../security-review`

## Related Knowledge

`../../../knowledge/` (iOS config, store account).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** iOS project config, used capabilities/permissions.
- **Does not require:** app screen logic, the full mobile skill set, unrelated references.
- **May load:** `mobile-builds`, `mobile-release`.
- **Stop when:** iOS readiness findings are recorded.

## Token Efficiency Guidance

Read iOS config + permission usage; don't read app logic. Summarize gaps.
