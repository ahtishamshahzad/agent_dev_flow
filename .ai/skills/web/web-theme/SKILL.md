---
name: web-theme
description: Use to plan light/dark theming on top of design tokens — system preference detection, manual override with persistence, SSR flash avoidance on Next.js, and contrast validation in both themes. Themes switch token values; components never hardcode colors.
---

# Web Theme

## Purpose

Plan light/dark (and any brand) themes as token-value swaps over the `web-design-system` foundation: detection of system preference, a persisted manual override, and a render path that avoids the wrong-theme flash on server-rendered apps.

## When to Use

- After tokens exist, when the product needs light/dark or multiple brands.
- When theme flicker, mixed hardcoded colors, or failing dark-mode contrast appear in an existing app.
- **Not** before `web-design-system` has defined semantic tokens.

## Inputs

- Semantic tokens from `web-design-system`.
- Framework foundation (SSR vs SPA changes the flash-avoidance strategy).
- Requirement: system-follow only, manual toggle, or both.

## Discovery Questions

- Follow `prefers-color-scheme`, offer a manual toggle, or both (typical: both, override persisted)?
- Where is the preference persisted (localStorage, cookie) — and does SSR need it server-side to render correctly?
- Are there more themes than light/dark (brands, high-contrast)?
- Do embedded surfaces (emails, charts, iframes) need theme values too?

## Responsibilities

- Define **theme layers**: semantic tokens resolve to per-theme values (CSS variables are the usual mechanism).
- Plan **detection + override**: default to system preference; manual choice wins and persists.
- Plan **flash avoidance**: on Next.js, set the theme attribute before first paint (inline script or cookie-driven server render); on a Vite SPA, apply before mount.
- Require **contrast validation in both themes** (`web-accessibility`) — dark mode is a first-class theme, not an inversion filter.
- Cover non-component surfaces: charts (`dashboard-reporting`), scrollbars, meta `color-scheme`, favicons where relevant.

## Required Workflow

1. Confirm token readiness; list themes required.
2. Choose the persistence + detection mechanism (SSR-aware if Next.js).
3. Define per-theme token values; validate contrast in each.
4. Plan the switch UX (toggle placement, no layout shift).
5. Record the plan; hand chart/table theming notes to the dashboard skills.

## Decision Rules

- Components consume semantic tokens only; a theme is a token-value set, never per-component conditionals.
- Manual override beats system preference; absence of override follows the system live.
- If SSR renders themed markup, the server must know the preference (cookie) — otherwise render neutral and set it pre-paint.
- Don't add a theming abstraction for a single fixed theme; note the extension point and stop.

## Rules

- No hardcoded colors outside token definitions.
- Both themes ship accessible or the second theme doesn't ship.
- Theme switching must not trigger layout shift or content reflow.

## Anti-Patterns

- Dark mode via `filter: invert()` or ad-hoc `dark:` overrides scattered without token discipline.
- Theme state in a global store re-rendering the world on toggle instead of a root attribute + CSS variables.
- Shipping dark mode that fails contrast because only light was checked.
- SSR pages that flash light-then-dark on every load.

## Validation Checklist

- [ ] Themes enumerated; per-theme token values defined.
- [ ] Detection + persisted override mechanism chosen (SSR-aware if applicable).
- [ ] Flash-avoidance strategy planned.
- [ ] Contrast validated (or planned for validation) in every theme.
- [ ] No hardcoded colors bypassing tokens.

## Definition of Done

A recorded theming plan — themes, token values, detection/persistence, flash avoidance, and contrast validation — where switching themes changes token values only and both themes meet accessibility standards.

## Related Skills

`web-design-system`, `web-accessibility`, `nextjs-foundation`, `vite-react-foundation`, `dashboard-reporting`.

## Related Knowledge

`../../../knowledge/` (brand palette decisions).

## Related References

`../../../references/web/design-system/` (theme token tables — when populated).

## Context Loading Guidance

- **Requires:** semantic tokens, framework foundation, theme requirements.
- **Does not require:** full component inventory, data-layer detail.
- **May load:** `web-accessibility` for contrast criteria.
- **Stop when:** the theming plan is recorded.

## Token Efficiency Guidance

Represent themes as token-value tables. Don't enumerate component-by-component styling — the token layer makes that unnecessary.
