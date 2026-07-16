---
name: dashboard-bulk-operations
description: Use to plan dashboard bulk operations — selection scope (page vs all-matching-filter), explicit confirmation with counts, server-side batch endpoints, per-item permission checks, progress and partial-failure reporting, idempotency, undo where feasible, and audit logging.
---

# Dashboard Bulk Operations

## Purpose

Plan multi-item admin actions (bulk edit, delete, export, status change) so they are explicit, permissioned per item, executed server-side as batches, and honest about partial failure. Bulk operations are the dashboard's highest-blast-radius feature — designed, not improvised.

## When to Use

- When admins need to act on many rows at once from `dashboard-tables` selections.
- When an existing dashboard loops client-side requests or has ambiguous "select all" semantics.
- **Not** for single-row actions or report exports (`dashboard-reporting`).

## Inputs

- The bulk-action inventory: which entities, which actions, typical/maximum batch sizes.
- Selection semantics from `dashboard-tables`; permission model from `dashboard-permissions`.
- Backend batch capabilities (`web-api-integration`).

## Discovery Questions

- Which bulk actions are needed, and which are destructive or irreversible?
- Does "select all" need to mean **all matching the filter** (server-defined set) or just the loaded page?
- What batch sizes are realistic — and can the backend process them synchronously, or is a job queue needed?
- What does recovery look like: undo window, soft delete, restore from audit?

## Responsibilities

- Define **selection scope** precisely: page selection vs all-matching-filter, with the UI stating the exact count and scope before any action.
- Require **explicit confirmation** proportional to risk: count + action + scope restated; destructive actions get stronger friction (typed confirmation) — never a silent one-click mass delete.
- Plan **server-side batch endpoints**: one request describing the set (ids or filter + snapshot criteria), not N client-side calls; long batches become **async jobs** with status polling (`web-server-state`).
- Enforce **permissions per item** server-side — a batch containing one forbidden item either fails that item explicitly or rejects, per a decided policy (never silently skips).
- Design **progress + partial-failure reporting**: what succeeded, what failed, why, and what the admin can retry — no "some items may have failed."
- Plan **idempotency** (operation keys so retries don't double-apply) and **undo** where feasible (soft delete/restore window) — and say explicitly when an action is irreversible.
- **Audit-log** every bulk operation: actor, action, item set (or filter), outcome counts (`dashboard-permissions`).

## Required Workflow

1. Inventory bulk actions with risk levels and batch sizes.
2. Fix selection-scope semantics with `dashboard-tables`.
3. Design batch endpoints (sync vs async job) with the backend.
4. Define confirmation UX, partial-failure reporting, idempotency, and undo policy per action.
5. Record the plan; align per-item enforcement and audit with `dashboard-permissions`.

## Decision Rules

- Filter-scoped operations execute against the **server's** evaluation of the filter at execution time — the plan states how drift between "what the admin saw" and "what executes" is handled.
- Async job when the batch can exceed a few seconds or the request-size limit; sync otherwise.
- Prefer soft delete + restore for bulk destructive actions unless storage/compliance forbids it.
- Partial failure is a first-class outcome with per-item results — all-or-nothing only where the domain demands a transaction.

## Rules

- No bulk action ships without confirmation UX, per-item server enforcement, and audit logging.
- Client-side loops issuing hundreds of single-item requests are not a batch implementation.
- Failed items are reported with reasons and remain retryable; success messages state exact counts.

## Anti-Patterns

- "Select all" that silently means the current page (or silently means everything).
- One ambiguous confirm dialog ("Are you sure?") before deleting 10,000 records.
- Swallowing partial failures behind a green toast.
- Retried batches double-applying because nothing was idempotent.

## Validation Checklist

- [ ] Bulk actions inventoried with risk and size profiles.
- [ ] Selection scope semantics exact and surfaced in the UI with counts.
- [ ] Server-side batch (or async job) design per action; no client-side fan-out.
- [ ] Per-item permission policy and audit logging defined.
- [ ] Partial-failure reporting, idempotency, and undo/irreversibility policy recorded per action.

## Definition of Done

A recorded bulk-operations plan — exact selection semantics, confirmation UX, server-side batch/job design, per-item enforcement, partial-failure and undo policy, and audit logging — under which no admin can unknowingly perform a mass action.

## Related Skills

`dashboard-tables`, `dashboard-permissions`, `web-server-state`, `web-api-integration`, `web-error-handling`, `../../security-review`.

## Related Knowledge

`../../../knowledge/` (entity lifecycle, retention/compliance rules).

## Related References

`../../../references/web/dashboard/` (bulk-op specs — when populated).

## Context Loading Guidance

- **Requires:** bulk-action inventory, selection semantics, backend batch capabilities.
- **Does not require:** report/chart detail, customer-app features.
- **May load:** `dashboard-permissions` for enforcement/audit; `web-error-handling` for failure surfacing.
- **Stop when:** per-action semantics and safeguards are recorded.

## Token Efficiency Guidance

One row per action: entity → action → scope → sync/async → undo → audit. Reserve prose for the destructive cases.
