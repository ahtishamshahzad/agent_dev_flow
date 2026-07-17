# Workflow: Security Audit

> Independent security assessment across the relevant surfaces. Reports findings (Confirmed vs Potential); routes fixes to owners and regression tests. Never prints secrets; never declares "secure."

## Request Classification

**Primary type:** security audit. Selected when the goal is to assess and harden security (not build a feature).

## Skills Required

`../skills/security-review` + `../skills/security/*` as the surface demands (threat-modeling, authentication/authorization-security, api/web/mobile/database-security, secrets-audit, dependency-security, abuse-prevention, privacy-review, security-regression-testing) + `../skills/dependency-audit`, `../skills/environment-audit`.

## Agents Involved

`orchestrator` → `security-reviewer` (independent) → owning engineers (**fixes only**) → `test-engineer` (security regression tests). The reviewer does not fix its own findings.

## Context Required

Architecture + data-sensitivity map, the surfaces in scope, threat model if present, the diff/system under review. No secret values loaded or printed.

## Gates

Gate 6 (security & quality review) primarily; feeds Gate 7 if pre-release.

## Documents Generated

Threat model (if built), security review report (Confirmed vs Potential, severity, location, fix, regression-test path), remediation plan.

## Validation

Relevant surfaces assessed; findings classified with severity and location; no critical/high left unrouted; each fix has a regression test; no secret values in the report; no "secure" claim.

## Handoff

Assess → report findings → route fixes → verify with regression tests, via Handoff Format.

## Stop Condition

- **Stop** (block release) while any critical/high finding is open and unaccepted.
- **Complete** when all surfaces in scope are assessed, findings are classified and routed, and fixes are regression-tested — reported honestly without a "secure" claim.

## Related

Hooks: `before-pr`, `before-release`. Rules: `../system/SECURITY_RULES.md`, Gate 6.
