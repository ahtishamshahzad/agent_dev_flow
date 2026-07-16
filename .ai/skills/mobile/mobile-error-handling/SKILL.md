---
name: mobile-error-handling
description: Use to plan error handling — error boundaries, async/network error handling, user-facing fallback UI, and crash reporting (e.g. Sentry) — so failures degrade gracefully and are observed.
---

# Mobile Error Handling

## Purpose

Plan resilient error handling: React error boundaries, consistent async/network error handling, graceful fallback UI, and crash/error reporting.

## When to Use

- When building screens/flows that can fail (network, native, parsing).
- Not as a substitute for fixing root-cause bugs (`../../bug-investigation`).

## Inputs

- The failure surfaces (network, native, render, parse).
- Reporting tool choice (e.g. Sentry) and environment config.

## Discovery Questions

- Where can this flow fail, and how should it degrade?
- What user-facing fallback is appropriate per failure?
- Is crash/error reporting (Sentry) used, and how is PII handled?
- How are network/async errors surfaced consistently?

## Responsibilities

- Add **error boundaries** around risky subtrees with fallback UI.
- Handle **async/network errors** consistently (retry/surface).
- Provide **graceful fallback UX** (not blank/crash).
- Wire **crash/error reporting** (e.g. Sentry) with PII care (`../../security-review`).

## Required Workflow

1. Map failure surfaces.
2. Add boundaries + fallback UI.
3. Standardize async/network error handling.
4. Wire reporting with PII scrubbing.
5. Record the error-handling plan.

## Decision Rules

- Fail gracefully with a fallback; never blank-screen or crash the app on a handled error.
- Report crashes/errors, but scrub PII/secrets from reports.
- Consistent error surfacing beats per-screen ad-hoc handling.
- Errors don't leak internal details to users.

## Rules

- No PII/secrets in error reports or logs (`mobile-logging`, `../../security-review`).
- Consistent, user-friendly error surfacing.
- Coordinate with server-state error mapping.

## Anti-Patterns

- Crashing/blank-screening on handled errors.
- Leaking stack traces/internal details to users.
- Sending PII to the crash reporter.
- Ad-hoc, inconsistent error handling.

## Validation Checklist

- [ ] Failure surfaces mapped.
- [ ] Error boundaries + fallback UI in place.
- [ ] Async/network errors handled consistently.
- [ ] Reporting wired with PII scrubbing.
- [ ] No internal details leaked to users.

## Definition of Done

A recorded error-handling plan: boundaries with fallback UI, consistent async/network handling, and PII-safe crash/error reporting — failures degrade gracefully and are observed.

## Related Skills

`mobile-logging`, `mobile-server-state`, `mobile-api-integration`, `../../security-review`, `../../bug-investigation`

## Related Knowledge

`../../../knowledge/` (failure modes).

## Related References

`../../../references/mobile/screens/` when populated.

## Context Loading Guidance

- **Requires:** failure surfaces, reporting tool, env config.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-logging`, `../../security-review`.
- **Stop when:** the error-handling plan is recorded.

## Token Efficiency Guidance

Plan boundaries + reporting for the flow in scope; delegate logging/PII rules to their skills.
