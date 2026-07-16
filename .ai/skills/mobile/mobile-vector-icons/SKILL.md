---
name: mobile-vector-icons
description: Use to plan icon usage — an icon set/library choice, sizing/color via theme, and lean bundling — avoiding shipping entire icon fonts unnecessarily.
---

# Mobile Vector Icons

## Purpose

Plan icons: choose an icon set/library, size and color them via theme tokens, and keep the bundle lean.

## When to Use

- When the app needs iconography beyond a few images.
- Not for a one-off image asset.

## Inputs

- Design system tokens (size/color).
- Runtime (Expo/CLI) and icon needs.

## Discovery Questions

- Which icon set(s) does the design require?
- One library or multiple (avoid duplication)?
- Can custom SVG icons be needed alongside a set?

## Responsibilities

- Choose an **icon library/set** appropriate to the runtime.
- Size/color icons via **theme tokens**.
- Prefer **lean/tree-shakeable** usage; avoid shipping unused icon fonts.
- Support **custom SVG** icons where the set falls short.

## Required Workflow

1. Confirm required icons + design intent.
2. Pick a library/set (minimize count).
3. Wire sizing/color via tokens.
4. Add custom SVGs only as needed.
5. Record the icon plan.

## Decision Rules

- Prefer one icon set; add a second only with justification.
- Color/size via theme, not hard-coded per icon.
- Custom SVG for brand-specific glyphs the set lacks.

## Rules

- Avoid bundling entire icon fonts when only a few icons are used, where the library allows.
- Theme-driven sizing/color.
- Coordinate with the design system.

## Anti-Patterns

- Multiple overlapping icon libraries.
- Hard-coded icon colors/sizes.
- Shipping large unused icon fonts.
- Reinventing common icons as custom SVG.

## Validation Checklist

- [ ] Icon set chosen (count minimized).
- [ ] Sizing/color via tokens.
- [ ] Lean bundling considered.
- [ ] Custom SVG only where needed.

## Definition of Done

A recorded icon plan: a minimal set choice, token-driven sizing/color, lean bundling, and custom SVG only where the set falls short.

## Related Skills

`mobile-design-system`, `mobile-theme`, `mobile-performance`

## Related Knowledge

`../../../knowledge/` (design/icon decisions).

## Related References

`../../../references/mobile/screens/` when populated.

## Context Loading Guidance

- **Requires:** required icons, design tokens, runtime.
- **Does not require:** the whole app source, unrelated references, every mobile skill.
- **May load:** `mobile-design-system` for tokens.
- **Stop when:** the icon plan is recorded.

## Token Efficiency Guidance

List only the icons/set needed; reference tokens for size/color.
