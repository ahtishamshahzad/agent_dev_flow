---
name: web-design-system
description: Use to plan the web design system — tokens (color/spacing/typography/radius), scales, reusable primitives, the styling approach (Tailwind, CSS Modules, CSS-in-JS), and component-library evaluation. Also decides how UI is shared across web apps and the dashboard.
---

# Web Design System

## Purpose

Define the visual and component foundation for the web app(s): design tokens, scales, reusable primitives, a justified styling approach, and whether/how the system is shared across multiple web apps (marketing site, customer app, dashboard).

## When to Use

- After the foundation skill, before building screens at scale.
- When UI inconsistency or ad-hoc styling is accumulating in an existing app.
- **Not** for theming mechanics (`web-theme`) or one-off page styling.

## Inputs

- Brand/design direction (if any) and the page inventory.
- Selected applications and dashboard placement (`dashboard-architecture`) — they determine sharing needs.
- Framework foundation (styling integrates differently in Next.js server components vs a Vite SPA).

## Discovery Questions

- Is there an existing brand/design language to encode, or are we establishing one?
- Which styling approach fits the team: Tailwind, CSS Modules, CSS-in-JS (note server-component constraints)?
- Should a headless/component library (e.g., Radix primitives, shadcn/ui-style copies) be evaluated, or is the surface small?
- Do multiple apps (customer app + dashboard) need to share this system — and via what boundary (shared package, copy, monorepo)?

## Responsibilities

- Define **tokens**: color (semantic, theme-ready for `web-theme`), spacing, typography, radius, elevation, breakpoints — as the single styling vocabulary.
- Define **scales** and layout primitives (stack/grid/container) before one-off components.
- Evaluate the **styling approach** and any **component library** as decisions with trade-offs — not defaults.
- Specify the **core primitives** (Button, Input, Card, Dialog, Table shell…) with accessibility expectations built in (`web-accessibility`).
- Decide **UI sharing** across apps: shared package vs duplication, aligned with `dashboard-architecture` and `../../repository-architecture`.

## Required Workflow

1. Gather brand direction and sharing requirements.
2. Define tokens and scales; make color tokens semantic (theme-ready).
3. Choose the styling approach + library candidates with justification.
4. List the primitive set needed by the actual page inventory.
5. Record the plan; install nothing without approval.

## Decision Rules

- Tokens first: no primitive ships with hardcoded values that a token should own.
- Prefer headless/accessible primitives over restyling heavy widget suites.
- CSS-in-JS runtimes conflict with server components — verify compatibility before recommending on Next.js.
- Share UI across apps only when `dashboard-architecture` keeps them in one system; a separate-repo dashboard may deliberately diverge.

## Rules

- Accessibility (roles, focus, contrast) is part of a primitive's definition of done.
- No new one-off variant when a token/primitive extension covers it.
- Long code examples live in `../../../references/web/design-system/`, not in this skill.

## Anti-Patterns

- Building screens first and extracting a "design system" from the wreckage later.
- Adopting a large component library for three primitives.
- Hardcoding hex values/pixel sizes that bypass tokens.
- Duplicating a diverging copy of the system per app without a decision.

## Validation Checklist

- [ ] Tokens and scales defined; colors semantic and theme-ready.
- [ ] Styling approach chosen with justification (server-component compatible if Next.js).
- [ ] Component-library decision recorded (adopt/partial/none) with trade-offs.
- [ ] Primitive set specified with accessibility expectations.
- [ ] Cross-app sharing decision aligned with dashboard placement.

## Definition of Done

A recorded design-system plan — tokens, scales, styling approach, primitive set, and sharing boundary — that screens can be built against consistently, with no unapproved installs.

## Related Skills

`web-theme`, `web-accessibility`, `dashboard-architecture`, `../../repository-architecture`, `nextjs-foundation`, `vite-react-foundation`, `dashboard-tables`.

## Related Knowledge

`../../../knowledge/` (brand direction, UI conventions).

## Related References

`../../../references/web/design-system/` (token tables, primitive specs — when populated).

## Context Loading Guidance

- **Requires:** brand direction, page inventory, sharing needs, framework foundation.
- **Does not require:** full app source, data/state detail.
- **May load:** `web-theme` when tokens are ready; `dashboard-architecture` for sharing boundaries.
- **Stop when:** tokens, approach, and primitive set are recorded.

## Token Efficiency Guidance

Keep token definitions tabular and terse. Specify primitives as one-line contracts; push code samples to references.
