---
name: mobile-native-modules
description: Use to plan native module usage or authoring — evaluating existing packages/config plugins first, and planning custom native modules (iOS/Android) only when needed. Prefer Expo config plugins/dev builds before ejecting.
---

# Mobile Native Modules

## Purpose

Plan native capabilities: evaluate existing community packages and Expo config plugins first, and design custom native modules (iOS/Android) only when no package fits.

## When to Use

- When a feature needs a native capability not covered by JS.
- Not when a maintained package or config plugin already covers it.

## Inputs

- The native capability needed.
- Runtime (Expo dev build vs CLI); existing native project (if any).

## Discovery Questions

- Does a maintained community package or Expo config plugin already cover this?
- If not, what native APIs (iOS/Android) are required?
- Does this force CLI, or can an Expo dev build + config plugin work?
- Who maintains the custom module?

## Responsibilities

- **Evaluate existing packages/config plugins first**.
- If custom is required, design the **native module** interface (iOS/Android) and JS bridge.
- Confirm whether an **Expo dev build + config plugin** suffices vs needing **CLI** (`mobile-stack-selection`).
- Plan build/readiness impact (`mobile-builds`, `ios-readiness`, `android-readiness`).

## Required Workflow

1. Define the native capability.
2. Search for a package/config plugin.
3. If none fits, design the custom module + bridge.
4. Decide dev build vs CLI.
5. Record the native plan + maintenance owner.

## Decision Rules

- Prefer a maintained package or Expo config plugin over writing native code.
- A native need does not automatically mean CLI — Expo dev builds + config plugins cover many.
- Custom native modules add maintenance cost — justify and assign ownership.
- Keep the JS bridge surface minimal and typed.

## Rules

- Don't write native code that a maintained package provides.
- Coordinate the runtime decision with `mobile-stack-selection`.
- Plan for native build/readiness impact.

## Anti-Patterns

- Writing a custom module for a solved problem.
- Ejecting to CLI for something a config plugin covers.
- Unmaintained custom native code with no owner.
- A sprawling, untyped bridge surface.

## Validation Checklist

- [ ] Existing packages/config plugins evaluated.
- [ ] Custom module designed only if needed.
- [ ] Dev build vs CLI decided.
- [ ] Build/readiness impact planned.
- [ ] Maintenance ownership assigned.

## Definition of Done

A recorded native plan: existing-package evaluation, a justified custom module (if any) with a minimal typed bridge, a dev-build-vs-CLI decision, and planned build/readiness impact with an owner.

## Related Skills

`mobile-stack-selection`, `react-native-cli-foundation`, `expo-foundation`, `mobile-builds`, `ios-readiness`, `android-readiness`

## Related Knowledge

`../../../knowledge/` (native capabilities, existing modules).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** the native capability, runtime, existing native project.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-stack-selection`, `mobile-builds`, readiness skills.
- **Stop when:** the native plan is recorded.

## Token Efficiency Guidance

Evaluate packages first from a short search; only design a module if none fits. Keep the bridge spec minimal.
