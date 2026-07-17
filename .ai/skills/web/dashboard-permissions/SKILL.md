---
name: dashboard-permissions
description: Use to plan admin-dashboard permissions — admin role granularity, a permission matrix per admin action, server-side enforcement, audit logging of admin actions, impersonation safeguards, and least-privilege defaults. Builds on web-authorization for the admin surface.
---

# Dashboard Permissions

## Purpose

Plan the dashboard's permission model in depth: how admin roles are sliced, which permission each admin action requires, how every action is enforced server-side and audit-logged, and how dangerous capabilities (impersonation, destructive bulk ops) are safeguarded. The admin-surface extension of `web-authorization`.

## When to Use

- After `dashboard-architecture` fixes placement and `web-authorization` defines the base model.
- When an existing dashboard has a single all-powerful "admin" role or unlogged admin actions.
- **Not** for customer-facing access levels (`web-authorization`).

## Inputs

- Base authorization model (`web-authorization`) and dashboard placement (`dashboard-architecture`).
- The dashboard's action inventory (views, edits, deletes, bulk ops, reports, exports).
- Compliance/audit requirements.

## Discovery Questions

- Which distinct admin jobs exist (support, ops, finance, super-admin) — and what does each actually need?
- Which actions are read-only vs mutating vs destructive vs data-exporting?
- Is user impersonation needed for support — under what constraints and logging?
- What must the audit trail answer (who did what to whom, when, from where) and who reads it?

## Responsibilities

- Define **admin roles by job**, each a bundle of granular permissions — no monolithic "admin can do everything" unless the team is genuinely that small (record it if so).
- Build the **permission matrix**: every dashboard action × required permission, deny by default; exports and bulk operations are their own permissions.
- Plan **server-side enforcement** for each action — the dashboard UI is a client like any other; its API calls carry no inherent trust.
- Plan **audit logging**: every mutating/exporting admin action recorded (actor, action, target, timestamp, context), tamper-resistant, PII-conscious.
- Design **impersonation safeguards** if impersonation exists: explicit permission, visible banner, logged start/end, no access to the target's credentials, time-boxed.
- Apply **least privilege**: new admins start minimal; elevation is deliberate and reviewable.

## Required Workflow

1. Inventory dashboard actions (with `dashboard-tables`/`dashboard-bulk-operations`/`dashboard-reporting` scopes).
2. Define roles by job; map the permission matrix, deny by default.
3. Specify enforcement per action at the API/server layer.
4. Specify audit-log events, content, and retention.
5. Record the plan; route review to `../../security-review`.

## Decision Rules

- Granularity follows risk: destructive/bulk/exporting actions get their own permissions even when roles are few.
- Deny by default; an unmapped action fails closed and is a finding.
- Impersonation is a last-resort capability — prefer read-only "view as" where it satisfies support needs.
- Audit logs are append-only from the app's perspective; admins being audited can't edit them.

## Rules

- Every enforcement decision happens server-side; hidden buttons are UX only.
- Bulk operations check permission **per item**, not just per request (`dashboard-bulk-operations`).
- No secrets/credentials in audit-log payloads; log references, not sensitive contents.

## Anti-Patterns

- One "admin" boolean guarding support, finance, and destructive ops alike.
- Admin mutations with no audit trail — invisible incidents.
- Impersonation without visible indication or logging.
- Permission checks in the dashboard UI only, with a wide-open API behind it.

## Validation Checklist

- [ ] Admin roles defined by job with granular permissions.
- [ ] Permission matrix covers every dashboard action, deny by default.
- [ ] Server-side enforcement specified per action.
- [ ] Audit logging specified (events, content, retention, tamper-resistance).
- [ ] Impersonation (if any) safeguarded: permission, banner, logging, time-box.
- [ ] Least-privilege defaults recorded.

## Definition of Done

A recorded admin-permission plan — roles, full action matrix, server enforcement, audit trail, and impersonation safeguards — under which any admin action can be traced and no capability exists without a named permission.

## Related Skills

`web-authorization`, `dashboard-architecture`, `dashboard-bulk-operations`, `dashboard-reporting`, `dashboard-tables`, `web-authentication`, `../../security-review`.

## Related Knowledge

`../../../knowledge/` (admin org structure, compliance requirements).

## Related References

`../../../references/web/dashboard/` (permission matrices — when populated).

## Context Loading Guidance

- **Requires:** base authorization model, dashboard action inventory, audit requirements.
- **Does not require:** customer-app feature detail, UI styling.
- **May load:** `dashboard-bulk-operations` for per-item enforcement; `../../security-review` for verification.
- **Stop when:** the matrix, enforcement, and audit plan are recorded.

## Token Efficiency Guidance

The permission matrix (action × permission × audited?) is the deliverable — keep prose to safeguards and exceptions.
