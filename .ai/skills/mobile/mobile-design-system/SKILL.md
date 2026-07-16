---
name: mobile-design-system
description: Use to plan a mobile design system — tokens, spacing, typography scale, color palette, and reusable component primitives — before building screens. Establishes consistency; coordinates with theme, fonts, and accessibility.
---

# Mobile Design System

## Purpose

Establish a consistent visual foundation: design tokens, spacing/typography scales, color palette, and reusable primitives (buttons, inputs, cards) that screens compose from.

## When to Use

- Before building multiple screens, to avoid ad-hoc styling.
- When UI is inconsistent across screens.
- Not for a single throwaway screen.

## Inputs

- Brand/design guidance or Figma (if any).
- Accessibility and platform constraints.

## Discovery Questions

- Is there a design source (Figma/brand) to derive tokens from?
- What are the spacing, typography, and color scales?
- Which primitive components recur across screens?
- What accessibility contrast/sizing constraints apply?

## Responsibilities

- Define **design tokens** (spacing, radius, color, typography).
- Define **typography and spacing scales**.
- Design **reusable primitives** (buttons, inputs, cards, layout).
- Coordinate **theming** (`mobile-theme`), **fonts** (`mobile-fonts`), **icons** (`mobile-vector-icons`), and **accessibility** (`mobile-accessibility`).

## Required Workflow

1. Derive tokens from the design source (or define a sane default set).
2. Set typography + spacing scales.
3. Build primitive components from tokens.
4. Wire theme + fonts + accessibility.
5. Record the design system.

## Decision Rules

- Tokens are the single source of visual truth; components consume tokens, not hard-coded values.
- Prefer a small set of composable primitives over many one-off styled components.
- Meet accessibility contrast/target-size minimums from the start.
- Match platform conventions where users expect them.

## Rules

- No hard-coded style values in screens — use tokens.
- Coordinate with theme/fonts/accessibility rather than duplicating them.
- Keep the primitive set small and composable.

## Anti-Patterns

- Ad-hoc inline styles diverging per screen.
- A sprawling component library before screens need it.
- Ignoring contrast/target-size accessibility.
- Hard-coded colors/spacing bypassing tokens.

## Validation Checklist

- [ ] Tokens defined.
- [ ] Typography + spacing scales set.
- [ ] Reusable primitives designed from tokens.
- [ ] Theme/fonts/icons/accessibility coordinated.
- [ ] No hard-coded style values in screens.

## Definition of Done

A recorded design system: tokens, scales, and a small set of reusable primitives consumed via tokens — coordinated with theme, fonts, icons, and accessibility.

## Related Skills

`mobile-theme`, `mobile-fonts`, `mobile-vector-icons`, `mobile-accessibility`, `mobile-navigation`

## Related Knowledge

`../../../knowledge/` (brand, design decisions).

## Related References

`../../../references/mobile/screens/` when populated.

## Context Loading Guidance

- **Requires:** design source (if any), accessibility constraints, recurring UI.
- **Does not require:** the whole app source, unrelated references, every mobile skill.
- **May load:** `mobile-theme`, `mobile-fonts`, `mobile-accessibility`.
- **Stop when:** the design system is recorded.

## Token Efficiency Guidance

Derive tokens once; reference them. Keep the primitive list concise; link screen references instead of pasting UI.
