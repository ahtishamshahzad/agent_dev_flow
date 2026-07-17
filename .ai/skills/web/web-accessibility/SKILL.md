---
name: web-accessibility
description: Use to plan and validate web accessibility — semantic HTML first, landmarks, keyboard operability, focus management on route changes and modals, labeled forms, contrast in every theme, ARIA only where semantics fall short, and automated (axe) plus manual checks. Applies to dashboards as much as public pages.
---

# Web Accessibility

## Purpose

Make the app operable and understandable for everyone: semantic structure, full keyboard support, managed focus, labeled controls, and sufficient contrast — verified with automated and manual checks. Accessibility is part of each component's definition of done, not a post-launch audit line.

## When to Use

- While defining design-system primitives (`web-design-system`) and forms (`web-forms`).
- When auditing an existing app (`existing-web-audit`) or before release (`../../final-quality-audit`).
- Always in scope — internal dashboards included; admins use assistive tech too.

## Inputs

- The component/primitive inventory and page/route tree.
- Theme tokens (`web-theme`) for contrast validation.
- Any explicit conformance target (WCAG 2.1/2.2 AA is the usual bar).

## Discovery Questions

- What conformance target applies (contractual/legal, or team standard — default WCAG AA)?
- Which interactions are custom (menus, dialogs, comboboxes, drag-drop) vs native elements?
- How do route changes announce themselves in the SPA (focus/title management)?
- Which checks run automatically (axe in component tests/E2E) and which manually (keyboard pass, screen reader)?

## Responsibilities

- Enforce **semantic HTML first**: native elements (`button`, `a`, `label`, `select`, headings, lists) before ARIA re-implementations; landmarks (`header/nav/main/footer`) and a logical heading hierarchy per page.
- Plan **keyboard operability**: every action reachable and operable by keyboard, visible focus indicators, no traps, skip link, sensible tab order.
- Plan **focus management**: on SPA route change (focus the new content/heading, update `document.title`), in dialogs (trap while open, restore on close), after destructive/creative actions.
- Require **labeled controls**: every input programmatically labeled; errors associated via `aria-describedby` and announced (`web-forms`).
- Validate **contrast in every theme** against tokens (`web-theme`); never rely on color alone to convey state.
- Use **ARIA only when semantics fall short** — correct roles/states for custom widgets (prefer battle-tested headless primitives over hand-rolled ARIA).
- Define the **checking regime**: automated axe checks wired into component tests (`web-component-testing`) and E2E (`playwright-e2e`), plus a manual keyboard/screen-reader pass on critical flows.

## Required Workflow

1. Fix the conformance target and record it.
2. Bake criteria into design-system primitives and form patterns.
3. Define focus/announcement behavior for routes, dialogs, and async updates.
4. Wire automated checks into the test layers; schedule manual passes on critical flows.
5. Record findings/exceptions honestly — "not yet accessible" is a finding, not a footnote.

## Decision Rules

- Native element vs ARIA widget: if a native element does the job, use it — no `div role="button"`.
- Custom widget needed → adopt an accessible headless primitive before hand-writing ARIA state machines.
- Contrast failures are fixed in tokens, not per-component overrides.
- Automated checks gate regressions; manual passes validate real usability — neither substitutes for the other.

## Rules

- Accessibility criteria are part of a primitive/feature's definition of done.
- Both themes ship accessible or the failing theme doesn't ship (`web-theme`).
- Never claim conformance from automated checks alone; state what was manually verified.

## Anti-Patterns

- Click-handlers on divs; icon buttons with no accessible name.
- Focus lost to `body` after every route change or modal close.
- `aria-*` sprinkled to silence audit tools without behavior behind it.
- Treating the dashboard as exempt "because it's internal."

## Validation Checklist

- [ ] Conformance target recorded.
- [ ] Primitives/forms carry semantic + labeling requirements.
- [ ] Keyboard operability and focus management planned (routes, dialogs, async).
- [ ] Contrast validated per theme at the token level.
- [ ] Automated checks wired into test layers; manual passes scheduled on critical flows.
- [ ] Gaps recorded as findings with owners.

## Definition of Done

A recorded accessibility plan — target, primitive-level criteria, focus/keyboard behavior, contrast validation, and a two-track checking regime — with current gaps stated honestly and no surface exempted by default.

## Related Skills

`web-design-system`, `web-theme`, `web-forms`, `web-component-testing`, `playwright-e2e`, `existing-web-audit`, `../../final-quality-audit`.

## Related Knowledge

`../../../knowledge/` (conformance obligations).

## Related References

`../../../references/web/design-system/` (accessible primitive specs — when populated).

## Context Loading Guidance

- **Requires:** component/page inventory, theme tokens, conformance target.
- **Does not require:** data-layer internals, deployment detail.
- **May load:** `web-component-testing` / `playwright-e2e` to wire checks.
- **Stop when:** criteria, checking regime, and gaps are recorded.

## Token Efficiency Guidance

State criteria once at the primitive level; don't repeat them per page. Report gaps as a findings table (issue → location → severity).
