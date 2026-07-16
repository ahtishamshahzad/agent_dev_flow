---
name: web-error-handling
description: Use to plan web error handling — route-level error boundaries (Next.js error.tsx / router errorElement), async and server-state error surfacing, 404/500 pages, PII-safe error reporting, actionable user-facing messages, and retry paths. Users never see raw stack traces.
---

# Web Error Handling

## Purpose

Plan how the app fails: where errors are caught (route-level boundaries, async layers), what users see (actionable messages, recovery paths), and what engineers get (PII-safe reports with context). Every failure mode has a designed surface — nothing white-screens silently.

## When to Use

- Alongside routing and server-state planning (errors surface through both).
- When an existing app white-screens, toasts raw messages, or reports nothing.
- **Not** for form-field validation UX (`web-forms`) or HTTP error mapping mechanics (`web-api-integration`).

## Inputs

- Route tree (`web-routing`) — boundary placement follows it.
- Error taxonomy from `web-api-integration` (network/HTTP/validation/auth unions).
- Reporting/observability expectations (tool, alerting, PII constraints).

## Discovery Questions

- Which failures are recoverable in place (retry a widget) vs page-level vs app-fatal?
- What do 404, 403, 500, and offline/degraded states look like per surface (public page vs dashboard)?
- Which error-reporting service is used (or evaluated), and what must never be sent to it?
- How do auth errors route (401 → login with return path; 403 → denied view, `web-authorization`)?

## Responsibilities

- Place **error boundaries by route segment**: Next.js `error.tsx`/`global-error` conventions or router `errorElement`s — granular enough that a failing widget doesn't take down the shell.
- Surface **async/server-state errors** through the query layer's states (`web-server-state`) with retry affordances where retry can help; distinguish empty from error from loading.
- Design the **error pages**: not-found (404), denied (403 policy per `web-authorization`), server error (500), and offline/degraded behavior where relevant.
- Plan **error reporting**: unhandled exceptions and boundary catches shipped to the reporting service with release/route/user-context — **PII and secrets scrubbed**; sample noisy errors; alert on spikes.
- Write **user-facing messages** that say what happened and what to do next — never raw stack traces, error codes alone, or blamey copy.
- Handle **global cases**: unhandled promise rejections, chunk-load failures after deploys (stale clients → prompt reload), third-party script failures degrading gracefully.

## Required Workflow

1. Map failure modes per route segment and data dependency.
2. Place boundaries and design the recovery UX per level (widget/page/app).
3. Define the 404/403/500/offline pages.
4. Wire reporting with scrubbing rules and alert thresholds.
5. Record the plan; verify the high-traffic paths' error states in tests (`web-component-testing`, `playwright-e2e`).

## Decision Rules

- Catch at the lowest level that can still render something useful; re-throw what it can't handle.
- Retry affordances only where retry can plausibly succeed (network blips — yes; 403 — no).
- 404 vs 403 disclosure policy is decided once with `web-authorization`, not per page.
- Chunk-load errors after a deploy are a reload prompt, not a crash report storm.

## Rules

- No raw exception text, stack traces, or internal identifiers in user-visible UI.
- No PII, credentials, or tokens in error reports or logs.
- Every boundary's fallback is a designed state (message + action), not an empty div.

## Anti-Patterns

- One app-root boundary as the only net — any error blanks the whole app.
- `catch {}` swallowing failures so the UI lies about success.
- Toasting `err.message` from the server directly to users.
- Error tracking that nobody triages, drowning in unsampled noise.

## Validation Checklist

- [ ] Boundaries placed per route segment with designed fallbacks.
- [ ] Async/server-state error surfacing defined with retry policy.
- [ ] 404/403/500/offline pages designed.
- [ ] Reporting wired with PII scrubbing and alerting.
- [ ] Global cases handled (rejections, chunk-load, third-party).
- [ ] Error states of critical paths covered in tests.

## Definition of Done

A recorded error-handling plan — boundary map, recovery UX per level, error pages, PII-safe reporting, and global-case handling — under which every known failure mode renders a designed state and reaches engineers with context.

## Related Skills

`web-routing`, `web-server-state`, `web-api-integration`, `web-forms`, `web-authorization`, `web-component-testing`, `playwright-e2e`, `../../security-review`.

## Related Knowledge

`../../../knowledge/` (observability stack, support workflows).

## Related References

`../../../references/web/` (error-state copy patterns — when populated).

## Context Loading Guidance

- **Requires:** route tree, error taxonomy, reporting expectations.
- **Does not require:** styling detail, unrelated features.
- **May load:** `web-server-state` for query-error states; `web-authorization` for 403 policy.
- **Stop when:** the boundary map and reporting plan are recorded.

## Token Efficiency Guidance

Work from a failure-mode table (mode → boundary level → user sees → reported?). Copywriting detail goes to references.
