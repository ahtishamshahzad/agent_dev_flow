---
name: mobile-stack-selection
description: Use to decide between Expo and React Native CLI for a mobile app, with justification. Evaluates Expo (Go, dev builds, EAS Build/Submit, OTA, common native packages) against React Native CLI (native ownership, custom modules, specialized SDKs, background behavior, CallKit/PushKit, BLE/NFC, existing native projects). Does not default to CLI.
---

# Mobile Stack Selection

## Purpose

Choose the mobile runtime — **Expo** or **React Native CLI** — for the app's real requirements, with a justified recommendation. Feeds `../../stack-recommendation` (mobile area) and the matching foundation skill. Requires user approval before implementation (Gate 2).

## When to Use

- At the start of any mobile project, or when adding a mobile app to a project.
- When re-evaluating an existing mobile app's runtime for a migration.
- **Not** after the runtime is approved and unchanged.

## Inputs

- Requirement baseline (`../../requirements-analysis`) and selected applications (`../../application-selection`).
- Existing mobile project findings (`../mobile-project-audit`) if any.
- Native-capability needs (notifications, BLE/NFC, background, telephony, custom SDKs).

## Discovery Questions

- What native capabilities are required (camera, maps, BLE/NFC, CallKit/PushKit, background audio/location)?
- Are custom native modules or a specialized third-party SDK needed?
- Is there an existing native iOS/Android project to integrate with?
- What is the team's native tooling experience and CI setup?
- Are OTA updates and managed build/submit pipelines valuable here?

## Responsibilities

- Evaluate **Expo**: Expo Go limitations, **development builds**, **EAS Build**, **EAS Submit**, **OTA updates**, and the **common native packages** Expo supports.
- Evaluate **React Native CLI**: direct **native ownership**, **custom native modules**, **specialized SDKs**, **advanced background behavior**, **CallKit/PushKit**, **BLE/NFC**, and **existing native projects**.
- Recommend one runtime with justification and note the trade-offs of the other.
- Hand off to `expo-foundation` or `react-native-cli-foundation`.

## Required Workflow

1. Gather native-capability and integration needs.
2. Check whether Expo (with dev builds + EAS) covers them — it usually does.
3. Only if a hard requirement genuinely needs CLI-level ownership, recommend CLI.
4. Record the recommendation + trade-offs for Gate 2 approval.
5. Hand off to the matching foundation skill.

## Decision Rules

- **Do not default to React Native CLI.** Prefer Expo (with development builds + EAS) unless a requirement truly demands raw native ownership.
- Expo Go alone is a prototyping surface; production apps typically need **development builds** — that is still Expo, not CLI.
- Choose **CLI** when: an existing native project must be integrated, a custom native module/specialized SDK is required that Expo can't accommodate, or advanced background/telephony (CallKit/PushKit) or low-level BLE/NFC exceeds Expo's config plugins.
- Choose **Expo** when: standard app needs, faster iteration, OTA updates, and managed build/submit are valuable — which is most apps.
- If unsure, prototype the risky native need behind an Expo dev build before committing to CLI.

## Rules

- Recommend, don't pre-select; the user approves at Gate 2.
- No dependency installation here.
- Justify the choice against the actual native requirements, not preference.

## Anti-Patterns

- Reaching for CLI "for flexibility" without a concrete native requirement.
- Equating "needs native modules" with "needs CLI" (Expo dev builds + config plugins cover many).
- Judging Expo only by Expo Go's limitations.
- Choosing a runtime before knowing the native-capability needs.

## Validation Checklist

- [ ] Native-capability and integration needs gathered.
- [ ] Expo path evaluated (Go vs dev builds, EAS Build/Submit, OTA, packages).
- [ ] CLI path evaluated (native ownership, custom modules, SDKs, background, CallKit/PushKit, BLE/NFC, existing project).
- [ ] One runtime recommended with justification + trade-offs.
- [ ] Not defaulted to CLI without a concrete reason.
- [ ] Recorded for Gate 2.

## Definition of Done

A recorded, justified Expo-vs-CLI recommendation tied to the app's real native requirements, with trade-offs noted and approval pending — ready to hand to the matching foundation skill.

## Related Skills

`../../stack-recommendation`, `../../application-selection`, `expo-foundation`, `react-native-cli-foundation`, `mobile-project-audit`, `mobile-native-modules`, `mobile-notifications`, `mobile-background-tasks`.

## Related Knowledge

`../../../knowledge/` (mobile constraints, existing native projects).

## Related References

`../../../references/mobile/native/` (native-capability notes, when populated).

## Context Loading Guidance

- **Requires:** requirement baseline, selected apps, native-capability needs.
- **Does not require:** the full mobile skill set, app source, unrelated references.
- **May load:** `mobile-project-audit` (existing app), one foundation skill after the decision.
- **Stop when:** the runtime recommendation is recorded for Gate 2.

## Token Efficiency Guidance

Decide from the requirement/native-needs summary. Keep the recommendation to the decisive capabilities; link `references/mobile/native/` rather than pasting SDK detail.
