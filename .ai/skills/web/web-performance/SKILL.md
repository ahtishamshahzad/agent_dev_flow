---
name: web-performance
description: Use to plan and fix web performance from measurements — Core Web Vitals (LCP/CLS/INP) budgets, code splitting, image/font loading, bundle analysis, caching/CDN, rendering-strategy impact, and dashboard-specific costs (tables, charts). Measure first; fix the measured bottleneck; validate in a production build.
---

# Web Performance

## Purpose

Keep the app fast by working from measurements: set budgets on Core Web Vitals, find the actual bottleneck (lab + field data), apply the matching fix, and validate in a representative production build. The web arm of `../../performance-review` — no speculative optimization.

## When to Use

- When metrics regress, users report slowness, or budgets are being set for a new app.
- Before release of performance-sensitive surfaces (public pages feeding SEO, heavy dashboards).
- **Not** for backend query tuning (that's the backend's performance work — coordinate via `../../performance-review`).

## Inputs

- Measurements: Lighthouse runs, Web Vitals field data (if instrumented), bundle analysis output.
- Rendering strategy (`nextjs-foundation`/`vite-react-foundation`) and deployment/CDN setup (`web-deployment`).
- The pages/flows that matter most (public landing vs dashboard grid have different budgets).

## Discovery Questions

- What do lab and field numbers actually show, per key page (LCP element, CLS sources, INP interactions)?
- What are the budgets — and are they differentiated (marketing page vs internal dashboard)?
- What dominates the bundle (analyze, don't guess), and what loads eagerly that could split?
- Are images/fonts optimized (sizing, formats, preload of the LCP asset, `font-display`)?

## Responsibilities

- Set **budgets** per surface: LCP/CLS/INP targets, bundle-size ceilings, and where they're enforced (CI check, review).
- **Measure before fixing**: reproduce the slow path in a production build; identify the specific cause (LCP asset, hydration cost, long task, layout shift source, chatty requests).
- Plan the **standard levers** where measurements point at them: route/component code splitting and lazy loading; image optimization (modern formats, dimensions, responsive sizes, priority on the LCP image); font strategy (subset, preload, `font-display: swap`); caching/CDN headers (`web-deployment`); rendering-strategy adjustments (static/ISR over SSR where content allows, `nextjs-foundation`).
- Cover **dashboard-specific costs**: table virtualization thresholds (`dashboard-tables`), chart rendering weight (`dashboard-reporting`), re-render storms from state misplacement (`web-state-management`).
- **Validate after fixing**: re-measure the same metric in the same conditions; keep the before/after numbers.

## Required Workflow

1. Measure (lab + field where available) and record the baseline per key page.
2. Set/confirm budgets per surface.
3. Diagnose the top bottleneck to a specific cause.
4. Apply the matching fix — smallest change that moves the metric.
5. Re-measure in a production build; record before/after or "unverified until run."

## Decision Rules

- No optimization without a measurement naming the bottleneck.
- Field data outranks lab data when they disagree.
- The fix must match the diagnosis — code splitting doesn't fix an unoptimized LCP image.
- Regressions are prevented by budgets in CI, not by memory.

## Rules

- Performance claims cite numbers and conditions; "feels faster" is not a result.
- Dev-mode measurements don't count — production builds only.
- Don't trade correctness or accessibility for a metric (e.g., skeleton flashes that game LCP but hurt CLS/users).

## Anti-Patterns

- Memoizing everything while the real cost is a 4 MB hero image.
- SSR everywhere "for speed" when static generation serves the same content.
- One global budget applied identically to a landing page and an admin grid.
- Optimizing once and never watching the metric again.

## Validation Checklist

- [ ] Baseline measured per key page (lab; field where available).
- [ ] Budgets set per surface and enforced somewhere (CI/review).
- [ ] Bottlenecks diagnosed to specific causes.
- [ ] Fixes matched to diagnoses; scope minimal.
- [ ] Before/after measurements recorded in production builds (or marked unrun).

## Definition of Done

Recorded budgets, a measured baseline, diagnosed bottlenecks with matched fixes, and before/after production-build measurements — with regression protection wired into CI where budgets exist.

## Related Skills

`../../performance-review`, `nextjs-foundation`, `vite-react-foundation`, `web-deployment`, `dashboard-tables`, `dashboard-reporting`, `web-state-management`, `web-seo`.

## Related Knowledge

`../../../knowledge/` (traffic patterns, device/network profile of users).

## Related References

`../../../references/web/` (perf run logs — when populated).

## Context Loading Guidance

- **Requires:** measurements, rendering strategy, key-page list.
- **Does not require:** full source tree, unrelated feature skills.
- **May load:** `web-deployment` for caching/CDN; `dashboard-tables`/`dashboard-reporting` for dashboard costs.
- **Stop when:** fixes are validated by re-measurement (or explicitly marked unrun).

## Token Efficiency Guidance

Carry numbers, not narratives: metric → page → baseline → target → after. Analyze the top bottleneck at a time instead of auditing everything.
