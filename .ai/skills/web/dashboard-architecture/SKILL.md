---
name: dashboard-architecture
description: Use to decide where an admin dashboard lives — inside the customer web app, as a route group, as a separate application, or in a separate repository — weighing user roles, deployment boundaries, security boundaries, team ownership, UI system sharing, and release cadence. Placement is a decision, not a default.
---

# Dashboard Architecture

## Purpose

Decide the admin dashboard's placement and boundaries **before** any dashboard work: whether it lives inside the customer web app, as an isolated route group, as a separate application, or in a separate repository — with the trade-offs recorded. The dashboard is its own application decision (`../../application-selection`); this skill decides its shape.

## When to Use

- As soon as `../../application-selection` confirms an admin dashboard is needed.
- When an existing embedded dashboard shows strain (security concerns, release coupling, team friction).
- **Not** for dashboard features (tables/reports/bulk ops) — those follow this decision.

## Inputs

- Selected applications and audiences (`../../application-selection`).
- Access model: who are the admins, and do they overlap with customers (`web-authorization`)?
- Team/ownership structure and release expectations.
- Repository layout options (`../../repository-architecture`).

## Discovery Questions

- **User roles:** are admins a small internal group, a customer-facing role, or both? Do people hold both customer and admin identities?
- **Deployment boundaries:** must the dashboard deploy/scale/restrict (VPN, IP allowlist) independently of the customer app?
- **Security boundaries:** what's the blast radius if the customer app is compromised — and should admin code even ship in the public bundle?
- **Team ownership:** does one team own both surfaces, or do separate teams need independent velocity?
- **UI system sharing:** must the dashboard share the design system/components with the customer app (`web-design-system`)?
- **Release cadence:** do the surfaces release together or on different rhythms?

## Responsibilities

- Evaluate the four placements honestly — **inside the customer web app** (shared chrome, same audience mix), **a route group** (same app, isolated layout/layer boundaries), **a separate application** (own build/deploy, possibly own framework via `web-stack-selection`, typically in the same repo/monorepo), **a separate repository** (full independence: code, CI, release, ownership).
- Score each against the six factors above for **this** project.
- Recommend one placement with justification and consequences (repo layout, stack choice scope, auth session sharing, UI sharing mechanism).
- Feed the decision to `../../repository-architecture`, `web-stack-selection` (separate app gets its own framework decision), and `web-routing` (embedded gets a route group plan).

## Required Workflow

1. Gather the six factors (roles, deployment, security, ownership, UI sharing, cadence).
2. Evaluate all four placements against them; note disqualifiers first.
3. Recommend one, with trade-offs of the runners-up.
4. Record consequences: repo/stack/auth/UI-sharing follow-ups.
5. Submit for Gate 2 approval before any dashboard implementation.

## Decision Rules

- Placement is a decision, not a default — do not silently bolt an `/admin` route onto the customer app.
- Strong pull toward **separation** (app or repo): hard security/deployment boundaries (admin must not ship to public clients, network-restricted access), distinct teams, or clashing release cadences.
- Strong pull toward **embedding** (in-app or route group): heavy UI/session/data sharing, one small team, admins who are also product users, low security differential.
- A separate **repository** needs justification beyond a separate **application** — it trades sharing costs for ownership independence; monorepo-with-separate-app covers most separation needs.
- If embedded, prefer a **route group** with its own layout, permission gate, and code-splitting over admin logic woven through customer code.

## Rules

- The recommendation names all six factors explicitly — silent factors become surprise constraints later.
- Whatever the placement, admin access is enforced server-side (`web-authorization`, `dashboard-permissions`).
- Revisit the decision if audience, team, or security facts change materially — placement is migratable, not sacred.

## Anti-Patterns

- Defaulting to "just add /admin" without evaluating boundaries.
- A separate repo for a dashboard one team releases in lockstep with the app.
- Embedding an admin surface that regulation/network policy says must be isolated.
- Sharing a session cookie across customer/admin surfaces that were separated *for* security.

## Validation Checklist

- [ ] All four placements evaluated against the six factors.
- [ ] One placement recommended with justification + runner-up trade-offs.
- [ ] Consequences recorded (repo layout, stack scope, auth/session, UI sharing).
- [ ] Server-side admin enforcement noted regardless of placement.
- [ ] Recorded for Gate 2 approval.

## Definition of Done

A recorded, justified dashboard-placement decision — one of in-app / route group / separate application / separate repository — with the six factors weighed, consequences assigned to follow-up skills, and approval pending.

## Related Skills

`../../application-selection`, `../../repository-architecture`, `web-stack-selection`, `web-routing`, `web-authorization`, `dashboard-permissions`, `web-design-system`, `web-deployment`.

## Related Knowledge

`../../../knowledge/` (team structure, security policy, release model).

## Related References

`../../../references/web/dashboard/` (placement notes — when populated).

## Context Loading Guidance

- **Requires:** application decisions, access model, team/release facts.
- **Does not require:** dashboard feature detail, UI specifics, table/report skills.
- **May load:** `../../repository-architecture` for repo consequences; `web-stack-selection` if a separate app results.
- **Stop when:** the placement decision is recorded for Gate 2.

## Token Efficiency Guidance

Decide from a six-factor summary table. Keep the evaluation to disqualifiers and deciding factors — not an essay per option.
