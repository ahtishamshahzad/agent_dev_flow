---
name: mobile-fonts
description: Use to plan custom font integration — font loading, weights/variants, and typography wiring into the design system — with correct async loading and fallbacks per runtime.
---

# Mobile Fonts

## Purpose

Plan custom font usage: which families/weights, how they load per runtime (Expo font loading vs native linking), fallbacks, and integration into the typography scale.

## When to Use

- When the app uses custom fonts or a specific typographic identity.
- Not when system fonts suffice.

## Inputs

- Design system typography scale.
- Font files/licenses; runtime (Expo/CLI).

## Discovery Questions

- Which families/weights/variants are needed?
- Expo font loading or CLI native font linking?
- What fallback while fonts load?
- Are the font licenses cleared for the platforms?

## Responsibilities

- Select **families/weights** matching the typography scale.
- Plan **loading** per runtime (Expo async load vs CLI linking) with a **fallback**.
- Wire fonts into the **design system/theme typography**.
- Avoid layout shift during load.

## Required Workflow

1. Confirm required families/weights + licenses.
2. Plan runtime-appropriate loading + fallback.
3. Integrate into typography tokens.
4. Handle loading state to avoid shift.
5. Record the font plan.

## Decision Rules

- Load fonts async with a fallback; don't block first render unnecessarily.
- Only include weights/variants actually used.
- Integrate via typography tokens, not per-component font names.

## Rules

- Verify font licenses for iOS/Android.
- Wire through the design system, not ad hoc.
- Handle the loading state (avoid flash/shift).

## Anti-Patterns

- Bundling many unused weights.
- Hard-coding font names per component.
- Ignoring loading state (layout shift/flash).
- Using unlicensed fonts.

## Validation Checklist

- [ ] Families/weights selected + licensed.
- [ ] Runtime-appropriate loading + fallback.
- [ ] Integrated into typography tokens.
- [ ] Loading state handled.

## Definition of Done

A recorded font plan: licensed families/weights, runtime-appropriate async loading with fallback, integration into the typography scale, and handled loading state.

## Related Skills

`mobile-design-system`, `mobile-theme`, `mobile-accessibility`, `mobile-performance`

## Related Knowledge

`../../../knowledge/` (typographic identity).

## Related References

`../../../references/mobile/screens/` when populated.

## Context Loading Guidance

- **Requires:** typography scale, font files/licenses, runtime.
- **Does not require:** the whole app source, unrelated references, every mobile skill.
- **May load:** `mobile-design-system` for typography tokens.
- **Stop when:** the font plan is recorded.

## Token Efficiency Guidance

Keep to the required families/weights; integrate via tokens rather than restating typography.
