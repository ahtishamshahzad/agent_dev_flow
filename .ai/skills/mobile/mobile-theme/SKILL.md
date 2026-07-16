---
name: mobile-theme
description: Use to plan theming — light/dark modes, theme tokens, and runtime switching — built on the design system's tokens. Ensures consistent, switchable appearance without hard-coded values.
---

# Mobile Theme

## Purpose

Plan a theming layer over the design tokens: light/dark (and any brand) themes, a theme provider, and runtime switching — so appearance is consistent and switchable.

## When to Use

- When the app needs light/dark or multiple themes.
- When colors are hard-coded and can't switch.
- Not before a design system exists (`mobile-design-system` first).

## Inputs

- Design tokens (`mobile-design-system`).
- Light/dark/brand requirements; system-appearance behavior.

## Discovery Questions

- Which themes are required (light/dark/brand)?
- Follow system appearance, user override, or both?
- Should theme choice persist across restarts?

## Responsibilities

- Define **theme token sets** (light/dark/brand) mapped from design tokens.
- Provide a **theme provider** and hook for components.
- Support **runtime switching** and (if needed) **persistence** (`mobile-secure-storage`/async storage).
- Respect **system appearance** where required.

## Required Workflow

1. Map design tokens into theme sets.
2. Add a theme provider + access hook.
3. Wire runtime switching + optional persistence.
4. Respect system appearance.
5. Record the theming plan.

## Decision Rules

- Themes are token sets; components read theme via a hook, never hard-coded colors.
- Follow system appearance by default; allow user override where specified.
- Persist theme choice only if the requirement calls for it.

## Rules

- No hard-coded colors — resolve via theme.
- Build on design tokens; don't invent a parallel palette.
- Coordinate persistence with storage skills.

## Anti-Patterns

- Hard-coded colors that ignore theme.
- A theme system detached from design tokens.
- Forcing a theme against system appearance without reason.

## Validation Checklist

- [ ] Theme sets defined from tokens.
- [ ] Theme provider + hook in place.
- [ ] Runtime switching supported.
- [ ] Persistence handled if required.
- [ ] System appearance respected.

## Definition of Done

A recorded theming plan: token-derived theme sets, a provider/hook, runtime switching, optional persistence, and system-appearance handling — with no hard-coded colors.

## Related Skills

`mobile-design-system`, `mobile-fonts`, `mobile-accessibility`, `mobile-secure-storage`

## Related Knowledge

`../../../knowledge/` (brand/appearance decisions).

## Related References

`../../../references/mobile/screens/` when populated.

## Context Loading Guidance

- **Requires:** design tokens, theme requirements, appearance behavior.
- **Does not require:** the whole app source, unrelated references, every mobile skill.
- **May load:** `mobile-secure-storage` for persistence.
- **Stop when:** the theming plan is recorded.

## Token Efficiency Guidance

Reuse design tokens; don't restate the palette. Keep theme mapping concise.
