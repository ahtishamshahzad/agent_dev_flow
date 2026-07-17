---
name: dashboard-reporting
description: Use to plan dashboard reports and charts — server-side aggregation, date-range/filter state in the URL, chart library evaluation, CSV/PDF export, scheduled reports, and handling slow queries (async generation, caching). Numbers must be verifiably correct before charts get pretty.
---

# Dashboard Reporting

## Purpose

Plan the dashboard's reporting surface: which metrics/reports exist, where aggregation happens (the server), how ranges and filters behave, how results render (tables/charts) and export, and how slow or heavy reports stay usable. Correctness of the numbers is the first requirement.

## When to Use

- When the dashboard needs metrics, charts, or downloadable reports.
- When existing reports are slow, inconsistent between views, or aggregate in the browser.
- **Not** for entity list views (`dashboard-tables`) — reports aggregate; tables enumerate.

## Inputs

- The metric/report inventory: definitions, dimensions, ranges, audiences.
- Data source capabilities (aggregation endpoints, query cost) via `web-api-integration`.
- Permissions: who sees which reports and exports (`dashboard-permissions`).

## Discovery Questions

- Which metrics matter, and what is each one's **exact definition** (timezone, inclusion rules, dedup)?
- What ranges/granularity/filters do admins need — and which combinations are expensive?
- Which reports need export (CSV/PDF) or scheduling/emailing?
- How fresh must numbers be — live, hourly, daily?

## Responsibilities

- Pin **metric definitions** in writing — every ambiguity (timezone boundaries, cancelled orders, test accounts) resolved before implementation, so two views never disagree.
- Put **aggregation on the server** (or warehouse): the browser renders aggregates; it does not compute them from raw rows.
- Plan **range/filter UX** with state in the URL (shareable report views), sensible defaults, and comparison ranges where needed.
- **Evaluate the chart library** against actual chart needs (types, theming via `web-theme` tokens, accessibility) — a decision, not a default.
- Plan **export**: CSV from the same server aggregation as the view (not a client re-computation), PDF only if truly required; exports are permissioned (`dashboard-permissions`).
- Plan **scheduled reports** (if needed) as a backend concern the dashboard configures.
- Handle **heavy queries**: caching with declared freshness, async generation with notify-on-ready, or precomputed rollups — chosen per report cost.

## Required Workflow

1. Inventory reports/metrics; pin definitions with the user.
2. Confirm server-side aggregation paths and their cost.
3. Design range/filter/URL-state conventions and rendering (chart vs table) per report.
4. Evaluate the chart library; plan export/scheduling where required.
5. Record the plan, including the freshness/caching contract per report.

## Decision Rules

- If a metric's definition can't be stated in one sentence, it isn't ready to build.
- Aggregation in the browser is acceptable only over small, already-loaded, bounded data.
- Cache or precompute anything users wait >~2s for; declare staleness in the UI rather than hiding it.
- Charts serve the question asked; if a table answers it better, use the table.

## Rules

- The same metric shows the same value everywhere it appears — one aggregation source per metric.
- Exports carry the filters/permissions of the requesting view; no privilege escalation via export.
- Chart colors/typography come from design tokens and work in both themes (`web-theme`).

## Anti-Patterns

- Fetching raw rows to sum them in JavaScript for a "total" tile.
- Two dashboard pages computing "revenue" differently.
- Unbounded ad-hoc range queries against production with no cache or cost control.
- Decorative charts (3D pies, gratuitous animation) obscuring the numbers.

## Validation Checklist

- [ ] Reports/metrics inventoried; definitions pinned and user-confirmed.
- [ ] Server-side aggregation confirmed per report; browser computes nothing material.
- [ ] Range/filter/URL-state conventions defined.
- [ ] Chart library evaluated with justification; theming/accessibility covered.
- [ ] Export/scheduling planned and permissioned where required.
- [ ] Freshness/caching contract recorded per report.

## Definition of Done

A recorded reporting plan — pinned metric definitions, server-side aggregation paths, range/filter conventions, justified chart library, export/scheduling design, and a freshness contract — under which every displayed number has one authoritative source.

## Related Skills

`dashboard-tables`, `dashboard-permissions`, `web-server-state`, `web-api-integration`, `web-theme`, `web-performance`, `web-accessibility`.

## Related Knowledge

`../../../knowledge/` (metric definitions, data model).

## Related References

`../../../references/web/dashboard/` (report specs, metric glossary — when populated).

## Context Loading Guidance

- **Requires:** report inventory, metric definitions, data-source capabilities.
- **Does not require:** entity CRUD detail, customer-app features.
- **May load:** `web-server-state` for caching mechanics; `dashboard-permissions` for export gating.
- **Stop when:** the reporting plan and freshness contracts are recorded.

## Token Efficiency Guidance

Keep a metric glossary table (name → definition → source → freshness) as the core artifact; per-report prose stays minimal.
