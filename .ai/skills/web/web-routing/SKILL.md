---
name: web-routing
description: Use to plan web app routing — route tree, layouts, nested routes, dynamic segments, route groups, protected routes, and URL-carried state. Covers Next.js App Router conventions and client router selection (React Router / TanStack Router) for Vite apps. Client-side protection is UX; the server enforces.
---

# Web Routing

## Purpose

Design the app's route architecture: the route/layout tree, dynamic segments, protected areas, and what state lives in the URL. On Next.js this means App Router conventions; on Vite it starts with selecting the client router.

## When to Use

- After the foundation skill, when planning screens/pages and their hierarchy.
- When adding a protected area, route group, or major section (e.g., an embedded dashboard).
- **Not** for API-route design (`web-api-integration`) or auth logic itself (`web-authentication`).

## Inputs

- The approved framework and foundation plan.
- Page/screen inventory from requirements; auth boundaries from `web-authentication`/`web-authorization`.
- Dashboard placement (`dashboard-architecture`) if a dashboard shares this app.

## Discovery Questions

- What is the page inventory, and which pages share layout chrome?
- Which areas are public vs authenticated vs role-gated?
- Which list/filter/pagination state should be shareable via URL?
- (Vite) Do we need typed routes, nested data loading, or search-param APIs strongly enough to prefer TanStack Router over React Router?

## Responsibilities

- Define the **route tree**: layouts, nested routes, dynamic segments, and (Next.js) route groups, loading/error boundaries per segment.
- (Vite) **Select the client router** with justification; plan typed params where valuable.
- Plan **protected routes**: middleware/guards, redirect-to-login with return path — as UX only; the server enforces access (`web-authorization`).
- Treat the **URL as state** for filters, pagination, tabs, and search so views are shareable and back/forward works (`web-state-management`).
- Plan not-found and error routes (`web-error-handling`).

## Required Workflow

1. List pages and group them by shared layout and access level.
2. Draw the route tree (segments, dynamic params, groups); mark protected areas.
3. (Vite) Choose the router by need and record why. (Next.js) Map the tree to App Router conventions.
4. Decide which state is URL-carried per route.
5. Record the plan; hand auth enforcement to `web-authorization`.

## Decision Rules

- Layouts follow ownership of chrome: shared nav/sidebar → shared layout; distinct chrome (e.g., admin area) → separate layout or route group.
- Route-level protection redirects; it never substitutes for server-side checks.
- Prefer URL state for anything a user would bookmark, share, or expect the back button to respect.
- Deep nesting beyond ~3 layout levels usually signals the tree needs restructuring.

## Rules

- Follow the framework's conventions; no custom routing layers over App Router.
- Every dynamic segment validates its param and has a not-found path.
- Keep route modules lean; data and state live in their designated layers.

## Anti-Patterns

- Client-only route guards treated as security.
- Storing filter/pagination state in a global store instead of the URL.
- One giant layout with per-page conditionals instead of nested layouts/groups.
- (Vite) Picking a router by habit without checking typed-routing/data-loading needs.

## Validation Checklist

- [ ] Route tree defined with layouts, segments, and groups.
- [ ] Protected areas marked, with server enforcement noted as the authority.
- [ ] URL-carried state decided per route.
- [ ] (Vite) Router selected with justification.
- [ ] Not-found/error routes planned.

## Definition of Done

A recorded route architecture — tree, layouts, dynamic segments, protection points, and URL-state decisions — consistent with the framework's conventions and ready for feature planning.

## Related Skills

`nextjs-foundation`, `vite-react-foundation`, `web-authorization`, `web-state-management`, `web-error-handling`, `dashboard-architecture`, `web-seo`.

## Related Knowledge

`../../../knowledge/` (page inventory, access model).

## Related References

`../../../references/web/routing/` (when populated).

## Context Loading Guidance

- **Requires:** foundation plan, page inventory, access levels.
- **Does not require:** full app source, data-layer detail, unrelated references.
- **May load:** `web-authorization` for gating detail, `dashboard-architecture` for embedded-dashboard trees.
- **Stop when:** the route architecture is recorded.

## Token Efficiency Guidance

Express the route tree as a compact outline, not per-page prose. Reference layout/access groups once instead of repeating rules per route.
