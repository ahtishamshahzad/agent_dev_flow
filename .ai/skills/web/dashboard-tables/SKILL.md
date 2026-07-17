---
name: dashboard-tables
description: Use to plan dashboard data tables — server-side vs client-side pagination/sorting/filtering by data size, column architecture, virtualization for large sets, row selection for bulk operations, URL-carried table state, and library evaluation (e.g., TanStack Table).
---

# Dashboard Tables

## Purpose

Plan the dashboard's data tables: where pagination/sorting/filtering execute (server vs client), how columns and row actions are structured, when virtualization is needed, and how table state stays shareable. Tables are the dashboard's workhorse — decided once, reused everywhere.

## When to Use

- When the dashboard lists entities (users, orders, content, jobs) beyond trivial size.
- When an existing dashboard's tables are slow, inconsistent, or client-filtering large sets.
- **Not** for report visualizations (`dashboard-reporting`) or the bulk-action semantics themselves (`dashboard-bulk-operations`).

## Inputs

- Entity inventory: row counts (now and projected), fields, needed filters/sorts.
- API pagination/filter capabilities (`web-api-integration`, `web-server-state`).
- Design-system table primitives (`web-design-system`); permission scopes (`dashboard-permissions`).

## Discovery Questions

- Realistic row counts per table — hundreds (client-side viable) or unbounded (server-side mandatory)?
- Which filters/sorts do admins actually need, and does the API support them server-side?
- Which tables feed bulk operations (row selection semantics) or exports?
- Do any views need dense/virtualized rendering (thousands of visible rows)?

## Responsibilities

- Decide **execution side per table**: server-side pagination/sorting/filtering for unbounded data; client-side only for small, fully-loaded sets — and record the cutoff assumption.
- Define the **table architecture**: column definitions (accessor, header, cell, sortable?, width), row actions, empty/loading/error states, density.
- Plan **URL-carried table state** (page, sort, filters) so views are shareable and survive refresh (`web-routing`, `web-state-management`).
- Plan **row selection** semantics for bulk operations: page-scope vs all-matching-filter scope, selection count surfacing (`dashboard-bulk-operations`).
- Plan **virtualization** where row counts demand it; plan **export** hooks where required (permissioned, `dashboard-permissions`).
- **Evaluate the table library** (headless TanStack Table is the usual candidate; design-system-native tables for simple cases) with justification.
- Keep tables accessible: real table semantics or correct ARIA grid roles, keyboard operability (`web-accessibility`).

## Required Workflow

1. Inventory tables with sizes, filters, sorts, and bulk/export needs.
2. Decide server vs client execution per table; confirm API support.
3. Define the shared table architecture + URL-state conventions.
4. Evaluate the library; plan virtualization/selection/export where needed.
5. Record the plan; hand action semantics to `dashboard-bulk-operations`.

## Decision Rules

- Unbounded or growing data → server-side pagination/filtering, no exceptions "for now."
- One shared table foundation across the dashboard; per-page bespoke tables are a review flag.
- Selection across pages must be explicit ("all 1,204 matching" vs "these 25") — never ambiguous.
- Virtualize when rendering cost hurts, not preemptively everywhere.

## Rules

- Server responses are the source of truth for counts/pages; the client doesn't infer totals.
- Table queries flow through `web-server-state` conventions (keys include filter/sort/page).
- Exports respect the same permissions and filters as the visible table.

## Anti-Patterns

- Fetching all rows and filtering client-side because the dev dataset was small.
- Table state in memory only — refresh loses the admin's filter setup.
- "Select all" silently meaning only the current page during a bulk delete.
- A different table implementation per dashboard page.

## Validation Checklist

- [ ] Tables inventoried with realistic sizes; execution side decided per table.
- [ ] Shared column/row-action architecture defined with empty/loading/error states.
- [ ] Table state URL-carried per conventions.
- [ ] Selection semantics defined where bulk operations exist.
- [ ] Library evaluated with justification; virtualization planned where needed.
- [ ] Accessibility expectations stated for the table foundation.

## Definition of Done

A recorded table plan — per-table execution decisions, one shared architecture, URL-state and selection conventions, and a justified library choice — that every dashboard list view implements consistently.

## Related Skills

`dashboard-bulk-operations`, `dashboard-reporting`, `web-server-state`, `web-routing`, `web-design-system`, `web-accessibility`, `dashboard-permissions`, `web-performance`.

## Related Knowledge

`../../../knowledge/` (entity model, data volumes).

## Related References

`../../../references/web/dashboard/` (table specs — when populated).

## Context Loading Guidance

- **Requires:** entity/table inventory with sizes, API capabilities.
- **Does not require:** report/chart detail, customer-app features.
- **May load:** `dashboard-bulk-operations` for selection→action flow; `web-performance` for virtualization thresholds.
- **Stop when:** the table plan is recorded.

## Token Efficiency Guidance

One row per table: entity → size → execution side → filters/sorts → selection/export. Define the shared architecture once, not per table.
