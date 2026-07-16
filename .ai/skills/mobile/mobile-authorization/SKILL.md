---
name: mobile-authorization
description: Use to plan authorization — role/permission gating of screens and actions, protected navigation, and server-verified access. Roles are enforced server-side; the client hides UI only as a convenience.
---

# Mobile Authorization

## Purpose

Plan authorization: gate screens and actions by role/permission, wire protected navigation, and ensure access is verified server-side — the client hides UI only as UX.

## When to Use

- When the app has roles/permissions or gated content/actions.
- Not for authentication (identity) — that's `mobile-authentication`.

## Inputs

- Roles/permissions model and gated screens/actions.
- Auth session (`mobile-authentication`) and navigation (`mobile-navigation`).

## Discovery Questions

- What roles/permissions exist and what do they gate?
- Which screens/actions are protected?
- How is access verified server-side for each protected action?

## Responsibilities

- Map **roles/permissions** to gated **screens and actions**.
- Wire **protected routes** (`mobile-navigation`).
- Ensure **server-verified access** for every protected action (`../../security-review`).
- Hide UI as convenience, never as the security boundary.

## Required Workflow

1. Define roles/permissions + gated surfaces.
2. Wire protected navigation.
3. Confirm server-side checks per protected action.
4. Handle unauthorized states gracefully.
5. Record the authorization plan.

## Decision Rules

- Roles are enforced **server-side**; UI hiding is convenience only.
- Never trust a client-editable role claim as the sole gate.
- Gate both navigation and the underlying action/data access.

## Rules

- Server-side enforcement is authoritative.
- Coordinate with `mobile-authentication` for the session/role source.
- Handle unauthorized gracefully (no crash/leak).

## Anti-Patterns

- Gating by hiding UI only.
- Trusting a client role claim as authoritative.
- Protecting the route but not the action/data.
- Leaking existence of protected resources.

## Validation Checklist

- [ ] Roles/permissions mapped to surfaces.
- [ ] Protected routes wired.
- [ ] Server-side verification confirmed per action.
- [ ] Unauthorized states handled.
- [ ] UI hiding treated as convenience only.

## Definition of Done

A recorded authorization plan: role/permission mapping, protected navigation, and server-verified access for every protected action — with UI hiding as convenience only.

## Related Skills

`mobile-authentication`, `mobile-navigation`, `../../security-review`, `mobile-api-integration`

## Related Knowledge

`../../../knowledge/` (roles, permissions model).

## Related References

`../../../references/mobile/navigation/` when populated.

## Context Loading Guidance

- **Requires:** roles/permissions model, gated surfaces, auth session.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-authentication`, `mobile-navigation`.
- **Stop when:** the authorization plan is recorded.

## Token Efficiency Guidance

Plan from the roles/gated-surface list; delegate identity to authentication and enforcement review to security-review.
