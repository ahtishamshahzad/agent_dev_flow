---
name: nextjs-foundation
description: Use to plan a Next.js foundation after Next.js is chosen — App Router structure, server vs client components, per-route rendering strategy (static/ISR/dynamic), TypeScript, linting, env config, and metadata baseline. Plans only; scaffolds and installs nothing without approval.
---

# Next.js Foundation

## Purpose

Plan a clean Next.js foundation once `web-stack-selection` chose Next.js for an app: App Router structure, the server/client component split, a per-route rendering strategy, and the baseline tooling — each justified, not blanket-installed. This skill plans; it does **not** scaffold the app.

## When to Use

- After Next.js is the approved framework, before feature work.
- When standardizing an existing Next.js app's foundation (after `existing-web-audit`).
- **Not** for Vite apps (`vite-react-foundation`).

## Inputs

- Approved framework (Next.js) and stack area decisions.
- Requirement baseline; SEO/content needs from `web-stack-selection`.
- Dashboard placement if the dashboard lives inside this app (`dashboard-architecture`).

## Discovery Questions

- Which routes are public content (static/ISR candidates) vs personalized (dynamic/SSR)?
- Will integrated server features be used (route handlers, server actions) or is there a separate backend?
- TypeScript (default yes)? Which styling approach (`web-design-system`)?
- Does hosting support the chosen rendering features (`web-deployment`)?

## Responsibilities

- Plan the **App Router** layout: route segments, layouts, route groups, loading/error conventions (`web-routing` for detail).
- Decide the **server/client component split**: server components by default; client components only where interactivity requires them.
- Set a **per-route rendering strategy**: static, ISR, or dynamic/SSR — chosen per route, not globally.
- Plan baseline tooling by need: TypeScript, ESLint, Prettier, env var handling (`NEXT_PUBLIC_` exposure rules).
- Plan the **metadata baseline** (delegate depth to `web-seo`).
- Keep the foundation minimal; defer feature libraries to their skills.

## Required Workflow

1. Confirm Next.js is approved for this app.
2. Sketch the route/layout tree and mark each route's rendering strategy.
3. Decide where server features are used vs a separate backend (`web-api-integration`).
4. Select baseline tooling by need; delegate design/state/auth to their skills.
5. Record the foundation plan; scaffold and install nothing without approval.

## Decision Rules

- **Server components by default**; add `"use client"` only where state, effects, or browser APIs demand it.
- Prefer **static/ISR** for public content; use dynamic rendering only where personalization or freshness requires it.
- Use integrated server features when they replace a backend you'd otherwise build; skip them when a separate backend already owns that logic.
- TypeScript by default unless the project mandates otherwise.
- Only `NEXT_PUBLIC_`-prefixed env vars reach the client — secrets never carry the prefix.

## Rules

- No scaffolding or dependency installation without approval (Gate 2).
- Follow Next.js App Router conventions; don't fight the framework with custom routing.
- Defer feature concerns (auth, forms, state, SEO depth) to their dedicated skills.

## Anti-Patterns

- Marking everything `"use client"` and using Next.js as a plain SPA host.
- Forcing SSR on every route "for SEO" when most content is static.
- Scaffolding with a heavy starter template full of unjustified dependencies.
- Duplicating a separate backend's logic in route handlers.

## Validation Checklist

- [ ] Route/layout tree sketched with route groups where needed.
- [ ] Rendering strategy chosen per route with reason.
- [ ] Server/client component split defined.
- [ ] Server features vs separate backend decided.
- [ ] Baseline tooling selected by need; env exposure rules noted.
- [ ] No unapproved scaffolding or installs.

## Definition of Done

A recorded Next.js foundation plan: route tree, per-route rendering strategy, server/client split, server-feature boundary, and justified baseline tooling — proportional and approval-pending, with feature libraries deferred to their skills.

## Related Skills

`web-stack-selection`, `web-routing`, `web-design-system`, `web-seo`, `web-server-state`, `web-api-integration`, `web-deployment`, `../../stack-recommendation`.

## Related Knowledge

`../../../knowledge/` (web architecture decisions, backend boundaries).

## Related References

`../../../references/web/routing/`, `../../../references/web/seo/` (when populated).

## Context Loading Guidance

- **Requires:** approved Next.js decision, requirement baseline, content/SEO needs.
- **Does not require:** the full web skill set, app source, unrelated references.
- **May load:** `web-routing`, `web-design-system`, `web-deployment` as the foundation is assembled.
- **Stop when:** the foundation plan is recorded.

## Token Efficiency Guidance

Plan from the requirement summary. Delegate routing/design/SEO detail to their skills; keep the foundation plan to the route tree, rendering choices, and tooling list.
