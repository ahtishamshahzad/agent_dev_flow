---
name: vite-react-foundation
description: Use to plan a Vite + React SPA foundation after Vite is chosen — TypeScript, project structure, client router selection, env handling (VITE_ exposure, no secrets), build/preview, linting, and SPA host fallback. Plans only; scaffolds and installs nothing without approval.
---

# Vite React Foundation

## Purpose

Plan a clean Vite + React foundation once `web-stack-selection` chose Vite for an app (typically an authenticated SPA or internal dashboard pairing with a separate backend): project structure, client routing, env handling, and baseline tooling — each justified, not blanket-installed. This skill plans; it does **not** scaffold the app.

## When to Use

- After Vite is the approved framework, before feature work.
- When standardizing an existing Vite app's foundation (after `existing-web-audit`).
- **Not** for Next.js apps (`nextjs-foundation`).

## Inputs

- Approved framework (Vite + React) and stack area decisions.
- Requirement baseline; backend boundary from `web-stack-selection` / `web-api-integration`.
- Dashboard placement if this app is (or contains) the dashboard (`dashboard-architecture`).

## Discovery Questions

- Which client router fits (React Router, TanStack Router) — and does anything need typed routes (`web-routing`)?
- What does the separate backend expose, and how are environments configured?
- TypeScript (default yes)? Which styling approach (`web-design-system`)?
- Where will the SPA be hosted, and is the deep-link fallback to `index.html` handled (`web-deployment`)?

## Responsibilities

- Plan the **project structure**: feature-oriented folders, shared UI, clear entry point.
- Select the **client router** by need (delegate detail to `web-routing`).
- Plan **env handling**: only `VITE_`-prefixed vars are embedded in the client bundle — never secrets; per-environment base URLs (`web-api-integration`).
- Plan baseline tooling by need: TypeScript, ESLint, Prettier, Vitest wiring (`web-unit-testing`).
- Note **hosting expectations**: static build output, CDN, SPA fallback rewrite for deep links.
- Keep the foundation minimal; defer feature libraries to their skills.

## Required Workflow

1. Confirm Vite is approved for this app.
2. Sketch the project structure and entry/router layout.
3. Plan env/config strategy per environment; confirm no secrets reach the bundle.
4. Select baseline tooling by need; delegate routing/design/state to their skills.
5. Record the foundation plan; scaffold and install nothing without approval.

## Decision Rules

- Vite apps are client-rendered: anything embedded at build time is public — treat every `VITE_` var as world-readable.
- Pick the router for actual needs (nested layouts, typed params, data loading) — not by habit.
- TypeScript by default unless the project mandates otherwise.
- If a requirement later demands SSR/SEO on this app, escalate back to `web-stack-selection` rather than bolting SSR onto the SPA.
- Add a library only when a requirement needs it (`../../stack-recommendation`).

## Rules

- No scaffolding or dependency installation without approval (Gate 2).
- Auth and authorization remain server-enforced; the SPA only reflects them (`web-authentication`, `web-authorization`).
- Defer feature concerns (forms, state, tables) to their dedicated skills.

## Anti-Patterns

- Putting API secrets in `VITE_` env vars because "it's just config."
- Installing a broad starter kit of libraries up front.
- Rebuilding SSR/SEO machinery inside the SPA instead of revisiting the framework decision.
- Ignoring the SPA fallback so refresh/deep links 404 in production.

## Validation Checklist

- [ ] Project structure and entry/router layout sketched.
- [ ] Client router selected with reason.
- [ ] Env strategy defined; no secrets in the client bundle.
- [ ] Baseline tooling selected by need.
- [ ] SPA hosting/fallback expectations noted for `web-deployment`.
- [ ] No unapproved scaffolding or installs.

## Definition of Done

A recorded Vite + React foundation plan: structure, router choice, env/config strategy, justified baseline tooling, and hosting expectations — proportional and approval-pending, with feature libraries deferred to their skills.

## Related Skills

`web-stack-selection`, `web-routing`, `web-design-system`, `web-api-integration`, `web-state-management`, `web-unit-testing`, `web-deployment`, `../../stack-recommendation`.

## Related Knowledge

`../../../knowledge/` (web architecture decisions, backend boundaries).

## Related References

`../../../references/web/routing/`, `../../../references/web/state/` (when populated).

## Context Loading Guidance

- **Requires:** approved Vite decision, requirement baseline, backend boundary.
- **Does not require:** the full web skill set, app source, unrelated references.
- **May load:** `web-routing`, `web-design-system`, `web-api-integration` as the foundation is assembled.
- **Stop when:** the foundation plan is recorded.

## Token Efficiency Guidance

Plan from the requirement summary. Delegate router/design/state detail to their skills; keep the foundation plan to structure, env strategy, and the tooling list.
