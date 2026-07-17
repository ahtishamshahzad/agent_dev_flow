---
name: web-stack-selection
description: Use to decide between Next.js and Vite + React for each selected web application, with justification. Next.js tends to fit SEO, SSR/SSG, public content, server components, and integrated server features; Vite tends to fit authenticated SPAs, internal dashboards, separate backends, and no-SEO lightweight clients. Tendencies, not absolute rules — each web app is decided separately.
---

# Web Stack Selection

## Purpose

Choose the web framework — **Next.js** or **Vite + React** — for each selected web application, with a justified recommendation. A project may run more than one web app (marketing site, customer app, admin dashboard); each gets its **own** framework decision. Feeds `../../stack-recommendation` (web area) and the matching foundation skill. Requires user approval before implementation (Gate 2).

## When to Use

- After `../../application-selection` decides which web applications exist (public web, marketing website, customer web app, admin dashboard — each a separate decision).
- When re-evaluating an existing web app's framework for a migration.
- **Not** after the framework is approved and unchanged, and **not** to decide dashboard placement (`dashboard-architecture` does that first).

## Inputs

- Requirement baseline (`../../requirements-analysis`) and selected applications (`../../application-selection`).
- Existing web app findings (`existing-web-audit`) if any.
- Dashboard placement decision (`dashboard-architecture`) if a dashboard is in scope.
- SEO, content, auth, and backend-boundary needs per app.

## Discovery Questions

- Does this app serve public content that must rank or unfurl (SEO, social cards)?
- Is the app fully behind authentication (SPA) or partly public?
- Does a separate backend already exist, or would integrated server features (route handlers, server actions, server components) add value?
- Is SSR/SSG/ISR needed for first-paint, indexing, or content freshness?
- Is this an internal tool/dashboard where a lightweight client architecture suffices?

## Responsibilities

- Evaluate **Next.js**: SSR/SSG/ISR, server components, integrated route handlers/server actions, metadata/SEO support, and their hosting implications.
- Evaluate **Vite + React**: fast lightweight SPA builds, clean pairing with a separate backend, static hosting, simpler mental model for authenticated internal tools.
- Decide **per application** — a Next.js marketing site plus a Vite dashboard is a normal outcome.
- Recommend one framework per app with justification and the other's trade-offs.
- Hand off to `nextjs-foundation` or `vite-react-foundation`.

## Required Workflow

1. Confirm which web applications were selected — evaluate each separately.
2. Gather SEO/content, auth, rendering, and backend-boundary needs per app.
3. Apply the decision rules below as tendencies; test them against this app's actual requirements.
4. Record one recommendation per app with justification + trade-offs for Gate 2 approval.
5. Hand off to the matching foundation skill(s).

## Decision Rules

- **Next.js is normally preferred when:** SEO matters, SSR/SSG matters, public content exists, server components are useful, or integrated server features add value.
- **Vite is normally preferred when:** the app is an authenticated SPA, an internal dashboard, pairs with a separate backend, has no SEO requirement, or a lightweight client architecture is desired.
- **Do not treat these as absolute rules.** A concrete requirement can override either list; justify against the app's real needs, not the heuristic.
- A dashboard placed **inside** the customer web app (`dashboard-architecture`) inherits that app's framework — do not re-decide it.
- Do not split one product into two apps just to use both frameworks; app boundaries come from `../../application-selection` and `dashboard-architecture`.
- If genuinely balanced, prefer the option with lower operational burden for the team and say why.

## Rules

- Recommend, don't pre-select; the user approves at Gate 2.
- No dependency installation or scaffolding here.
- One decision per application, each with its own justification.

## Anti-Patterns

- Defaulting every project to Next.js (or every dashboard to Vite) without evaluating.
- Choosing a framework before the application list and dashboard placement are decided.
- Treating the tendency lists as hard rules when a requirement contradicts them.
- Picking SSR "for performance" when the app is entirely behind a login and SEO-irrelevant.

## Validation Checklist

- [ ] Selected web applications enumerated; each evaluated separately.
- [ ] Next.js path evaluated (SEO, SSR/SSG, public content, server components, integrated server features).
- [ ] Vite path evaluated (authenticated SPA, internal dashboard, separate backend, no SEO, lightweight client).
- [ ] One framework recommended per app with justification + trade-offs.
- [ ] Dashboard placement respected (no re-deciding an inherited framework).
- [ ] Recorded for Gate 2.

## Definition of Done

A recorded, justified Next.js-vs-Vite recommendation for each selected web application, tied to real SEO/rendering/backend needs, with trade-offs noted and approval pending — ready to hand to the matching foundation skill(s).

## Related Skills

`../../application-selection`, `../../stack-recommendation`, `dashboard-architecture`, `nextjs-foundation`, `vite-react-foundation`, `existing-web-audit`, `web-seo`, `web-deployment`.

## Related Knowledge

`../../../knowledge/` (product/content strategy, backend boundaries).

## Related References

`../../../references/web/seo/`, `../../../references/web/routing/` (when populated).

## Context Loading Guidance

- **Requires:** requirement baseline, selected applications, dashboard placement (if any), SEO/backend needs.
- **Does not require:** the full web skill set, app source, unrelated references.
- **May load:** `existing-web-audit` (existing app), one foundation skill after the decision.
- **Stop when:** a framework recommendation per app is recorded for Gate 2.

## Token Efficiency Guidance

Decide from the requirement summary and application list. Keep each recommendation to the decisive factors; do not restate both framework ecosystems in full.
