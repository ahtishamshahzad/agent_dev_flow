---
name: web-authorization
description: Use to plan web authorization — the role/permission model, server-side enforcement on every request and action, route guards and UI hiding as UX conveniences, and tenant scoping. UI hiding is never access control; the server verifies everything.
---

# Web Authorization

## Purpose

Plan who may do what once authenticated: the role/permission model, where the server enforces it (every API call, server action, and data query), and how the client mirrors those decisions for UX (guarded routes, hidden controls) without ever being the gate.

## When to Use

- When the app has more than one access level (customer vs admin, tiers, tenants).
- Before building any dashboard surface (feeds `dashboard-permissions`).
- **Not** for identity/login itself (`web-authentication`).

## Inputs

- The access model from requirements: roles, permissions, tenancy, ownership rules.
- Route tree (`web-routing`) and API surface (`web-api-integration`).
- Dashboard placement (`dashboard-architecture`) — separate apps simplify some boundaries.

## Discovery Questions

- Roles, granular permissions, or both — and who administers them?
- Is data tenant-scoped or owner-scoped (every query filters by it)?
- Which UI surfaces differ per role (nav, actions, whole route groups)?
- How does the client learn the user's permissions (session claims, profile endpoint) and how stale may that be?

## Responsibilities

- Define the **model**: roles → permissions mapping (prefer permission checks in code over role string checks; roles group permissions).
- Map **server enforcement points**: every API route/server action checks permission; every query scopes by tenant/owner — deny by default.
- Plan **client mirroring**: route guards, hidden/disabled controls, role-aware nav — explicitly labeled convenience, backed by server checks.
- Plan **permission delivery** to the client (claims in session, permissions endpoint) and its refresh on role change.
- Route admin-surface depth (granularity, audit, impersonation) to `dashboard-permissions`.

## Required Workflow

1. Extract the access model from requirements; enumerate roles/permissions/tenancy.
2. Map each API operation and route to its required permission (deny by default).
3. Plan client mirroring for routes/controls per role.
4. Define permission delivery + staleness handling.
5. Record the matrix; hand admin specifics to `dashboard-permissions` and review to `../../security-review`.

## Decision Rules

- **Deny by default**: an operation without a declared permission requirement is a finding, not a pass.
- Check permissions, not roles, at call sites — roles change shape; permissions compose.
- Tenant/ownership scoping lives in the data layer (query-level), not in UI filtering.
- If customer and admin audiences share the app, prefer coarse boundaries (route group + server checks) over sprinkling conditionals (`dashboard-architecture`).

## Rules

- Hidden UI is not access control; every privileged action re-verifies server-side.
- Authorization failures return consistent, non-leaking responses (404 vs 403 policy decided once).
- Changes to roles/permissions take effect without requiring client redeploys where feasible.

## Anti-Patterns

- `if (user.role === 'admin')` scattered through components as the only check.
- APIs trusting a role claim sent from the client body/header.
- Queries returning all rows with the client filtering "their" data.
- Divergence between what UI shows and what the API allows, discovered by users.

## Validation Checklist

- [ ] Role/permission model defined; permissions (not roles) checked at call sites.
- [ ] Every API operation mapped to a required permission; deny-by-default confirmed.
- [ ] Tenant/ownership scoping planned at the query level.
- [ ] Client mirroring planned and labeled as convenience.
- [ ] Permission delivery + staleness handling defined.

## Definition of Done

A recorded authorization plan — model, server enforcement matrix, query-level scoping, and client mirroring — where removing every client-side check would inconvenience users but expose nothing.

## Related Skills

`web-authentication`, `dashboard-permissions`, `web-routing`, `web-api-integration`, `dashboard-architecture`, `../../security-review`.

## Related Knowledge

`../../../knowledge/` (access model, tenancy design).

## Related References

`../../../references/web/dashboard/` (permission matrices — when populated).

## Context Loading Guidance

- **Requires:** access model, route tree, API surface.
- **Does not require:** UI styling detail, unrelated features.
- **May load:** `dashboard-permissions` for admin depth; `../../security-review` for verification.
- **Stop when:** the enforcement matrix is recorded.

## Token Efficiency Guidance

Express the model as a permission matrix (operation × permission), not per-screen prose. State the deny-by-default rule once.
