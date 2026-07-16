---
name: mobile-notifications
description: Use to plan push/local notifications — provider (Expo push / FCM / APNs), permissions, token registration, handling foreground/background, and deep-link routing from taps. Requires native support (dev build or CLI).
---

# Mobile Notifications

## Purpose

Plan notifications: choose the provider, request permissions, register tokens, handle foreground/background delivery, and route taps (often via deep links).

## When to Use

- When the app sends push or schedules local notifications.
- Not on Expo Go alone (needs a dev build or CLI).

## Inputs

- Notification requirements (push/local, data payloads).
- Provider (Expo push / FCM / APNs); runtime + build model.

## Discovery Questions

- Push, local, or both? What payloads/data?
- Which provider (Expo push / FCM / APNs)?
- How are permissions requested and tokens registered/synced?
- What happens on tap (deep-link routing)?

## Responsibilities

- Choose the **provider** and confirm native support (dev build/CLI).
- Handle **permissions** and **token registration/sync** to the backend.
- Handle **foreground/background/tap** delivery.
- Route taps via **deep linking** (`mobile-deep-linking`, `mobile-navigation`).

## Required Workflow

1. Confirm requirements + provider + native build.
2. Request permissions; register/sync tokens.
3. Handle foreground/background/tap.
4. Wire tap to deep-link routing.
5. Record the notification plan.

## Decision Rules

- Notifications need native support — plan a dev build (Expo) or CLI, not Expo Go.
- Sync device tokens to the backend; handle token refresh.
- Request permission at a contextual moment, not blindly on launch.
- Tap handling routes through the navigation/deep-link layer.

## Rules

- Respect OS permission models and user choice.
- No secrets in notification payloads (`../../security-review`).
- Coordinate routing with deep-linking/navigation.

## Anti-Patterns

- Assuming Expo Go supports push.
- Requesting permission with no context.
- Not syncing/refreshing tokens.
- Ad-hoc tap handling bypassing navigation.

## Validation Checklist

- [ ] Provider chosen + native support confirmed.
- [ ] Permissions + token registration handled.
- [ ] Foreground/background/tap handled.
- [ ] Tap to deep-link routing wired.
- [ ] No sensitive data in payloads.

## Definition of Done

A recorded notification plan: provider with native support, permissions and token sync, delivery handling across states, and tap-to-deep-link routing — with no sensitive payload data.

## Related Skills

`mobile-deep-linking`, `mobile-navigation`, `mobile-background-tasks`, `mobile-native-modules`, `mobile-builds`, `../../security-review`

## Related Knowledge

`../../../knowledge/` (messaging requirements).

## Related References

`../../../references/mobile/notifications/` when populated.

## Context Loading Guidance

- **Requires:** notification requirements, provider, runtime/build model.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-deep-linking`, `mobile-navigation`, `mobile-background-tasks`.
- **Stop when:** the notification plan is recorded.

## Token Efficiency Guidance

Plan provider + handling; delegate routing to deep-linking and builds to mobile-builds.
