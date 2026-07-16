---
name: mobile-logging
description: Use to plan logging — structured, level-based logging, dev vs production behavior, and strict exclusion of secrets/PII. Logs aid debugging without leaking sensitive data or bloating production.
---

# Mobile Logging

## Purpose

Plan logging: structured, level-based logs with different dev/production behavior, and strict exclusion of secrets/PII — useful for debugging without leaking or bloating.

## When to Use

- When the app needs diagnostic logging or before production hardening.
- Not for user-facing error UX (that's `mobile-error-handling`).

## Inputs

- Diagnostic needs and log destinations.
- Sensitivity of the data involved.

## Discovery Questions

- What needs logging (events, errors, performance)?
- What levels, and how do dev vs production differ?
- Where do logs go (console, remote, crash reporter)?
- What must never be logged (tokens, PII)?

## Responsibilities

- Define **log levels** and a structured format.
- Differentiate **dev vs production** (verbose dev; minimal, safe prod).
- **Exclude secrets/PII** from all logs (`../../security-review`).
- Route logs appropriately (console/remote) without noise.

## Required Workflow

1. Define what/when to log + levels.
2. Set dev vs production behavior.
3. Add redaction so no secrets/PII are logged.
4. Route logs to destinations.
5. Record the logging plan.

## Decision Rules

- Never log tokens, passwords, or PII — redact.
- Production logging is minimal and safe; verbose logging is dev-only.
- Structured, level-based logs over scattered console noise.
- Strip debug logs from production paths.

## Rules

- No secrets/PII in logs, ever.
- Different dev vs production verbosity.
- Coordinate with error handling + reporting.

## Anti-Patterns

- Logging tokens/PII.
- Verbose console noise in production.
- Unstructured, unleveled logs.
- Debug logs shipped to production.

## Validation Checklist

- [ ] Levels + structured format defined.
- [ ] Dev vs production behavior set.
- [ ] Secrets/PII excluded (redaction).
- [ ] Destinations routed.
- [ ] No debug logs in production.

## Definition of Done

A recorded logging plan: structured level-based logging, distinct dev/production behavior, PII/secret exclusion, and clean routing — helpful for debugging without leaking or bloating.

## Related Skills

`mobile-error-handling`, `../../security-review`, `mobile-environment-config`

## Related Knowledge

`../../../knowledge/` (diagnostic needs).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** diagnostic needs, log destinations, data sensitivity.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-error-handling`, `../../security-review`.
- **Stop when:** the logging plan is recorded.

## Token Efficiency Guidance

Keep it to levels, dev/prod behavior, and redaction rules.
