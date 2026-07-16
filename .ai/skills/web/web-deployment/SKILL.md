---
name: web-deployment
description: Use to plan web deployment — platform selection driven by framework needs (Next.js server/edge features vs Vite static output with SPA fallback), per-environment config and secrets, preview deployments, CDN/caching headers, domains/TLS, and rollback. Deploying/publishing requires explicit approval.
---

# Web Deployment

## Purpose

Plan how each web app ships: a platform that actually supports the framework's features, per-environment configuration, preview flows, caching, domains, and rollback. Executes nothing — deployment and publishing happen only with explicit approval (`../../release-planning`, Gate 7).

## When to Use

- After the framework/foundation is decided (hosting needs differ sharply), before first release planning.
- When an existing app's hosting fights its framework (missing SPA fallback, unsupported SSR features).
- **Not** for release readiness itself (`../../release-planning`) or CI test wiring (`playwright-e2e`).

## Inputs

- Framework decisions per app (`web-stack-selection`) and rendering strategy (`nextjs-foundation`).
- Dashboard placement (`dashboard-architecture`) — separate apps may deploy to separate targets/restrictions.
- Environments, domains, and compliance/network constraints (VPN/IP-restricted admin, data residency).

## Discovery Questions

- Which Next.js features are used — SSR/ISR/middleware/server actions (need a Node/edge-capable platform) or is static export viable?
- (Vite) Where does the static bundle live (CDN/static host), and is the **SPA fallback rewrite** to `index.html` configured for deep links?
- What environments exist, and how do env vars/secrets flow per environment (build-time public vars vs server-side secrets)?
- Are preview deployments per PR wanted? What are the domain/TLS/redirect requirements? Must the dashboard sit behind network restrictions?

## Responsibilities

- **Select the platform per app** with justification: Next.js with server features → Vercel-class platform, container/Node self-hosting, or equivalent — verify feature support (ISR, middleware, image optimization) on the actual target; Vite SPA → static hosting + CDN with fallback rewrites.
- Plan **environment config**: per-environment values, secrets held server-side/in the platform's secret store — public build-time vars (`NEXT_PUBLIC_`/`VITE_`) contain nothing sensitive (`../../environment-audit`).
- Plan **preview deployments** per PR where valuable — with staging/preview kept non-indexable (`web-seo`) and auth-gated where content is private.
- Plan **caching/CDN**: hashed immutable assets cached long; HTML/data responses with deliberate cache headers; ISR/CDN invalidation understood before it surprises anyone.
- Plan **domains/TLS/redirects**: canonical host (apex vs www), HTTPS everywhere, redirect map for moved content; separate admin domain/network restrictions if `dashboard-architecture` requires.
- Plan **rollback and release safety**: instant rollback to a previous build, stale-client handling after deploys (chunk-load reloads, `web-error-handling`), and what gates a deploy (CI green including `playwright-e2e`).

## Required Workflow

1. Collect framework features, environments, and constraints per app.
2. Select the platform(s) with justification; verify feature support explicitly.
3. Define env/secret flow, preview strategy, and caching/domain plans.
4. Define rollback + deploy gating.
5. Record the plan for approval — execute no deployment without it.

## Decision Rules

- The platform must support the framework's used features — "mostly works" is a rejected option.
- Static export/static hosting wins when nothing needs a server; don't pay for SSR infrastructure out of habit.
- One platform per app is the default; the embedded dashboard ships with its host app, a separate dashboard app decides independently.
- Admin surfaces get network restrictions when the placement decision called for them — hosting implements `dashboard-architecture`, not the other way around.

## Rules

- No deploy, platform signup, domain purchase, or publish without explicit user approval.
- Secrets never enter client bundles, repo files, or logs; per-environment separation is absolute.
- Production deploys are gated on the agreed checks (build, tests, E2E) — bypassing gates is a decision the user makes explicitly, recorded.

## Anti-Patterns

- Deploying a Vite SPA with no fallback rewrite — every deep link 404s.
- Choosing a platform, then discovering middleware/ISR silently no-ops there.
- Staging indexable by search engines or open to the world with production data.
- "Rollback" meaning re-running a full build under incident pressure.

## Validation Checklist

- [ ] Platform selected per app with feature-support verification.
- [ ] Env/secret flow defined; nothing sensitive in public vars.
- [ ] Preview deployments planned; staging non-indexable and gated.
- [ ] Caching/CDN and domain/TLS/redirect plans recorded.
- [ ] Rollback path and deploy gating defined.
- [ ] No deployment executed without explicit approval.

## Definition of Done

A recorded deployment plan per app — justified platform, environment/secret flow, preview and caching strategy, domains, rollback, and gating — ready for `../../release-planning`, with all execution awaiting explicit approval.

## Related Skills

`../../release-planning`, `../../environment-audit`, `web-stack-selection`, `nextjs-foundation`, `vite-react-foundation`, `dashboard-architecture`, `web-seo`, `web-performance`, `playwright-e2e`, `../../github-repository`.

## Related Knowledge

`../../../knowledge/` (environment topology, compliance constraints).

## Related References

`../../../references/web/` (platform evaluation notes — when populated).

## Context Loading Guidance

- **Requires:** framework decisions, environments/domains, constraints.
- **Does not require:** feature-level source, component detail.
- **May load:** `../../environment-audit` for secret flow; `../../release-planning` when readiness starts.
- **Stop when:** the deployment plan is recorded for approval.

## Token Efficiency Guidance

One platform-decision table per app (features needed → platform → verified?). Keep header/caching rules as a short table, not prose.
