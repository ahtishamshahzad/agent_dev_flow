---
name: security-review
description: Use to assess a change or codebase for security weaknesses — secrets, auth, authorization/IDOR, injection, PII handling, transport/errors, payments, and production hardening. Reports findings by severity, separates confirmed from potential, never prints secret values, and never claims "secure."
---

# Security Review

## Purpose

Find real, exploitable security weaknesses and report them safely. Implements `../../system/SECURITY_RULES.md`. Supports Gate 6 and any security-audit request.

## When to Use

- Before merge/release for changes touching auth, data, payments, or external input.
- For a **security audit** request type.
- Whenever an audit or review surfaces a security-relevant surface.

## Inputs

- The change/codebase in scope and how it handles secrets, auth, data.
- Whether the app handles money or sensitive PII.

## Discovery Questions

- Does the change touch secrets, auth, authorization, input handling, PII, or payments?
- Is this pre-launch, live, or post-incident?
- What is the trust boundary and the data sensitivity?

## Responsibilities

Assess, per `../../system/SECURITY_RULES.md`:
- **Secrets** (no hardcoding; git history; client-exposed prefixes; correct key placement).
- **Auth** (enforced routes, JWT/session integrity, reset flow, rate limits, no default admin).
- **Authorization/IDOR** (ownership checks, server-side roles, tenant scoping).
- **Input/injection** (parameterized queries, XSS, command, uploads, validation).
- **PII** (minimized in logs/third-party; deletion path).
- **Transport/errors** (TLS, CORS, security headers, generic errors).
- **Payments** (server-side totals, webhook signatures, abuse) when applicable.
- **Production hardening** (debug/test endpoints, env fail-fast, dependency advisories).

Report findings with **severity** and **Confirmed vs Potential**.

## Required Workflow

1. Scope to the change/surface + data sensitivity.
2. Walk the relevant security areas. Check that security behavior is specified as scenarios — cross-tenant and cross-user denial, expired or invalid tokens, role escalation refused (`../../system/GHERKIN_RULES.md`) — and that each has a passing test. A scenario states the expectation; only tests and review are evidence. Never conclude "secure".
3. Run available tools where possible; quote or mark "unverified until run."
4. Record findings (severity, Confirmed/Potential, `file:line`, redacted).
5. List secrets to rotate; recommend human review for money/PII at scale.
6. On a tracked project, record them via `project-management`: each Confirmed finding through bug intake (Critical/High → P0/P1), Potential ones as `TECH-` tasks to verify (`../../system/PROJECT_MANAGEMENT_RULES.md`, recording work).

## Decision Rules

- Never print a discovered secret's value — report location/type, redacted, and flag for rotation.
- Separate Confirmed from Potential; assign severity (Critical/High/Medium/Low).
- Block release on open Critical/High confirmed issues.
- Never claim "secure"; report what was checked and fixed, and what needs human review.

## Rules

- Do no harm: no data exfiltration, no hitting production/third-party systems, no destructive commands.
- Do not weaken existing controls to "make it work."
- Recommend a professional human review for real money / sensitive PII at scale.

## Anti-Patterns

- Printing secret values in the report.
- Claiming the app is "secure."
- Inflating potential findings into confirmed.
- Skipping a check "to save time/tokens."

## Validation Checklist

- [ ] Relevant security areas assessed.
- [ ] Findings: severity + Confirmed/Potential + redacted location.
- [ ] Secrets-to-rotate list produced.
- [ ] Tools run or unrun checks flagged.
- [ ] Human-review recommendation where warranted.
- [ ] No secret values printed; no "secure" claim.

## Definition of Done

A security review report with severity-rated, Confirmed/Potential findings (secrets redacted), a rotation list, verification notes, and — for money/PII-at-scale — a human-review recommendation.

## Related Skills

`code-review`, `dependency-audit`, `environment-audit`, `ai-output-review`, `final-quality-audit`, `release-planning`, `project-orchestrator`, `project-management`.

## Related Knowledge

`../../knowledge/` (data model, trust boundaries).

## Related References

`../../references/security/` (if present) for baselines.

## Context Loading Guidance

- **Requires:** the security-relevant surface, data-sensitivity context.
- **Does not require:** unrelated modules, the full reference tree, planning skills.
- **May load:** `dependency-audit`, `environment-audit` for exposure.
- **Stop when:** the report (with rotation list) is delivered.

## Token Efficiency Guidance

Focus on entry points, auth, data access, and config. Quote decisive lines, redacted; don't paste whole files or any secret value.
