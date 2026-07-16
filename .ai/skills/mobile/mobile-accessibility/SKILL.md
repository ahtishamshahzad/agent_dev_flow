---
name: mobile-accessibility
description: Use to plan mobile accessibility — screen-reader labels/roles, focus order, touch target sizes, contrast, and dynamic type — so the app is usable with assistive tech. Bakes accessibility into components, not bolts it on.
---

# Mobile Accessibility

## Purpose

Plan accessibility: screen-reader support (labels/roles/state), focus order, adequate touch targets, sufficient contrast, and dynamic type — built into components.

## When to Use

- Whenever building UI, especially interactive components and forms.
- Never skip for 'later' — build it in.

## Inputs

- The UI/components and their interactions.
- Design tokens (contrast/sizing) and platform a11y APIs.

## Discovery Questions

- What assistive-tech support is required (VoiceOver/TalkBack)?
- Are touch targets and contrast within guidelines?
- Does the app support dynamic type/large text?
- What is the focus order for key flows?

## Responsibilities

- Add **accessibility labels/roles/state** to interactive elements.
- Ensure **focus order** and **screen-reader** flow.
- Meet **touch-target size** and **contrast** minimums (`mobile-design-system`).
- Support **dynamic type**/large text; avoid text truncation that breaks meaning.

## Required Workflow

1. Review components/flows for a11y.
2. Add labels/roles/state + focus order.
3. Verify target sizes + contrast against tokens.
4. Support dynamic type.
5. Record the a11y plan; test with a screen reader.

## Decision Rules

- Accessibility is built into components, not bolted on later.
- Meet platform target-size and contrast minimums.
- Support dynamic type; don't hard-lock font sizes.
- Test key flows with a screen reader (or flag as unverified).

## Rules

- Interactive elements have labels/roles/state.
- Meet contrast/target-size minimums.
- Coordinate with design system and theme.

## Anti-Patterns

- Deferring accessibility indefinitely.
- Icon-only buttons with no labels.
- Tiny touch targets / low contrast.
- Hard-locked font sizes ignoring dynamic type.

## Validation Checklist

- [ ] Labels/roles/state on interactive elements.
- [ ] Focus order defined for key flows.
- [ ] Target sizes + contrast meet minimums.
- [ ] Dynamic type supported.
- [ ] Tested with a screen reader (or flagged).

## Definition of Done

A recorded accessibility plan and applied practices: labeled/role-tagged interactive elements, sensible focus order, compliant targets/contrast, and dynamic-type support — verified with a screen reader or explicitly flagged.

## Related Skills

`mobile-design-system`, `mobile-theme`, `mobile-fonts`, `mobile-component-testing`

## Related Knowledge

`../../../knowledge/` (a11y requirements).

## Related References

`../../../references/mobile/screens/` when populated.

## Context Loading Guidance

- **Requires:** the UI/components + interactions, design tokens, a11y APIs.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-design-system`, `mobile-component-testing`.
- **Stop when:** the a11y plan is applied/verified (or flagged).

## Token Efficiency Guidance

Focus on the interactive components in scope; reuse design tokens for contrast/sizing.
