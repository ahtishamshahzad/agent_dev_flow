---
name: mobile-navigation
description: Use to plan mobile navigation — choose Expo Router or React Navigation, define the navigator structure (stacks/tabs/drawers), route params, and deep-link surface. Evaluates the option against need; keeps navigation state in the navigator.
---

# Mobile Navigation

## Purpose

Plan the app's navigation: pick Expo Router or React Navigation, structure navigators, define typed route params, and expose the deep-link surface — consistent with the chosen runtime.

## When to Use

- When designing the app's screen graph or adding a navigation area.
- When navigation state is duplicated into stores or params are untyped.
- Not for one-off in-screen state (that's local state).

## Inputs

- Approved runtime (Expo/CLI) and screen list.
- Auth model (for protected routes) and deep-link needs.

## Discovery Questions

- Expo Router (file-based) or React Navigation (config-based) — which fits the runtime/team?
- What navigator types are needed (stack/tab/drawer/modal)?
- Which routes are protected vs public?
- What deep links/universal links must resolve?

## Responsibilities

- Choose **Expo Router** or **React Navigation** with justification.
- Define the navigator tree (stacks/tabs/drawers/modals).
- Define typed route params and the protected-route strategy (`mobile-authorization`).
- Coordinate deep linking (`mobile-deep-linking`) and safe-area handling.
- Keep navigation state owned by the navigator (`mobile-state-management`).

## Required Workflow

1. Confirm runtime + screen list.
2. Pick router; justify.
3. Design navigator tree + typed params.
4. Mark protected routes; wire deep-link surface.
5. Record the navigation plan.

## Decision Rules

- Expo Router suits Expo file-based apps; React Navigation suits config-based or CLI apps — choose by fit, not habit.
- Protected routes gate on auth server/session state, not hidden UI.
- Route params are typed; large objects are not passed through params.
- Navigation state lives in the navigator, not a global store.

## Rules

- Match the approved runtime.
- Type route params; avoid passing large payloads.
- Defer auth checks to `mobile-authorization` and deep links to `mobile-deep-linking`.

## Anti-Patterns

- Duplicating navigation state into Redux/Zustand.
- Passing large objects through route params.
- Guarding routes only by hiding UI.
- Mixing two navigation libraries without cause.

## Validation Checklist

- [ ] Router chosen + justified.
- [ ] Navigator tree defined.
- [ ] Route params typed.
- [ ] Protected routes identified.
- [ ] Deep-link surface coordinated.
- [ ] Navigation state owned by navigator.

## Definition of Done

A recorded navigation plan: chosen router, navigator tree, typed params, protected-route strategy, and deep-link surface — consistent with the runtime and with navigation state owned by the navigator.

## Related Skills

`mobile-deep-linking`, `mobile-authorization`, `mobile-authentication`, `mobile-state-management`, `expo-foundation`, `react-native-cli-foundation`

## Related Knowledge

`../../../knowledge/` (screen graph, auth model).

## Related References

`../../../references/mobile/navigation/`, `../../../references/mobile/screens/` when populated.

## Context Loading Guidance

- **Requires:** approved runtime, screen list, auth + deep-link needs.
- **Does not require:** the whole app source, unrelated references, every mobile skill.
- **May load:** `mobile-deep-linking`, `mobile-authorization` for their surfaces.
- **Stop when:** the navigation plan is recorded.

## Token Efficiency Guidance

Plan from the screen list and auth model; delegate deep-link/authorization detail to their skills instead of restating it.
