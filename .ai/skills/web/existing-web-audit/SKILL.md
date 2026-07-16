---
name: existing-web-audit
description: Use to audit an existing web application before changing it — framework/version, rendering model, routing, state, styling, auth, API layer, tests, build/deploy, and performance/SEO/accessibility baselines. Read-only inventory that feeds planning; fixes nothing during the audit.
---

# Existing Web Audit

## Purpose

Inventory an existing web application before any change: what framework and patterns it actually uses, where the risks are, and what constrains upcoming work. The web-specific arm of `../../existing-project-audit`. The audit reports; it does not fix.

## When to Use

- Before planning changes to an existing web app (feature, refactor, migration, dashboard addition).
- When taking over an unfamiliar web codebase.
- **Not** for greenfield apps (go to `web-stack-selection`).

## Inputs

- Repository access and the app's location within it.
- The upcoming request (so findings can be weighted by relevance).
- Core repo findings from `../../existing-project-audit` if already run.

## Discovery Questions

- Which framework and major version — Next.js (Pages or App Router?) or Vite/CRA/other — and how far from current?
- What is actually server-rendered vs client-rendered vs static?
- Where do auth, API calls, and state live today?
- What tests, CI, and deployment paths exist — and do they pass?

## Responsibilities

- Identify **framework + version**, router model, and rendering strategy per major route.
- Map **routing** structure, **state** patterns (client/server/URL), and **styling/design-system** approach.
- Locate **auth** (session/token, storage, enforcement points) and the **API layer** (transport, error handling, env config).
- Inventory **forms/validation**, **error handling**, and **accessibility/SEO/performance** baselines (measure, don't guess — Lighthouse or equivalent where runnable).
- Inventory **tests** (unit/component/E2E) and **build/deploy** paths, including env/secret handling.
- Report findings by severity/relevance; distinguish **verified** (ran/read it) from **assumed**.

## Required Workflow

1. Read structure, manifests, and configs (framework, router, build, env).
2. Trace one representative flow end-to-end (route → data → render → error path).
3. Inventory the areas above, weighting depth by the upcoming request.
4. Run what's cheap to run (build, tests, lint, Lighthouse) — mark anything unrun "unverified until run."
5. Record findings + constraints that feed planning (`../../task-planning`, `web-stack-selection` if migration).

## Rules

- Read-only: no fixes, upgrades, or refactors during the audit.
- Evidence-based: cite files/paths for claims; never report a check that didn't run.
- Never print discovered secrets; report their handling as a finding (`../../environment-audit`).
- Depth proportional to the request — a small feature doesn't need a full-repo deep-dive.

## Anti-Patterns

- "Auditing" by assumption from the framework name instead of reading the code.
- Fixing issues mid-audit, contaminating the baseline.
- Loading the entire source tree when the request touches one area.
- Reporting stale/aspirational docs as current state without verifying.

## Validation Checklist

- [ ] Framework, version, router, and rendering model identified with evidence.
- [ ] Routing/state/styling/auth/API patterns mapped.
- [ ] Tests, build, and deploy paths inventoried; runnable checks run or flagged unrun.
- [ ] Accessibility/SEO/performance baselines noted where relevant.
- [ ] Findings ranked by severity/relevance to the upcoming request.
- [ ] No changes made to the codebase.

## Definition of Done

A written, evidence-backed inventory of the web app's framework, patterns, quality baselines, and constraints — ranked by relevance to the upcoming work, with verified and assumed clearly separated — ready to feed planning.

## Related Skills

`../../existing-project-audit`, `web-stack-selection`, `../../dependency-audit`, `../../environment-audit`, `web-performance`, `web-accessibility`, `web-seo`, `../../migration-planning`.

## Related Knowledge

`../../../knowledge/` (known constraints, prior decisions about this app).

## Related References

`../../../references/web/` topic folders (when populated).

## Context Loading Guidance

- **Requires:** repo access, the upcoming request, app location.
- **Does not require:** every source file, the full web skill set.
- **May load:** `../../dependency-audit` / `../../environment-audit` for depth in those areas.
- **Stop when:** findings and constraints are recorded for planning.

## Token Efficiency Guidance

Sample representative routes/flows instead of reading everything. Summarize patterns with file-path citations; keep raw file contents out of the report.
