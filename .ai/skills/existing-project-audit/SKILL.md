---
name: existing-project-audit
description: Use when a codebase already exists, before proposing any changes. It inventories structure, stack, applications present, tests, security posture, and implementation state so planning is grounded in reality rather than assumptions.
---

# Existing Project Audit

## Purpose

Understand what already exists before changing it. Produce an accurate picture of the repository — structure, stack, applications, tests, security posture, and state — that requirements, application, and stack decisions can rely on.

## When to Use

- Any request against an existing codebase (enhancement, feature, bug, refactor, migration, review).
- Before recommending changes or a stack for an existing repo.
- **Not** for greenfield work (record "greenfield" and skip).

## Inputs

- Read access to the repository.
- The classified request (to scope the audit).

## Discovery Questions

- Which parts of the repo are in scope for this request?
- Are there known problem areas, recent incidents, or fragile modules?
- What is the current build/test/deploy story?

## Responsibilities

- Inventory **structure** (apps, packages, modules, entry points).
- Detect the **stack** actually in use (frameworks, DB, data layer, testing tools).
- Identify **applications present** (mobile/web/dashboard/backend/worker/etc.).
- Assess **tests** (levels, tools, coverage signal).
- Assess **security posture** at a high level (secrets, auth, exposure) — flag, don't fix here.
- Determine **implementation state** (what's done, in-progress, stubbed).
- Record findings; do **not** edit code during the audit.

## Required Workflow

1. Scope the audit to the request.
2. Map structure and entry points.
3. Detect stack and applications from manifests/config/code, and record the **technology baseline**: installed versions from lock files (not ranges), runtime version (`engines`, `.nvmrc`, Docker/CI images), build tooling. Note what is end-of-life, deprecated, or flagged by advisories — as information; the audit changes nothing (`../../system/TECHNOLOGY_GOVERNANCE_RULES.md` §3).
4. Survey tests and CI.
5. Note security-relevant signals (hand deep analysis to `security-review`).
6. Summarize state and risks in `../../projects/current/` / `../../generated/audits/`.

## Decision Rules

- Report what the repo **proves**, separate from what you **infer**.
- If the request is small, scope the audit to the affected area — don't audit the whole repo needlessly.
- Deep security/performance analysis is delegated (`security-review`, `performance-review`), not done here.

## Rules

- Read-only: no edits during the audit.
- Do not print discovered secret values — flag location/type, redacted (`../../system/SECURITY_RULES.md`).
- Ground later stages in findings, not guesses.

## Anti-Patterns

- Proposing changes before understanding the current state.
- Auditing the entire monorepo for a one-file fix.
- Treating inferences as confirmed facts.

## Validation Checklist

- [ ] Structure and entry points mapped.
- [ ] Stack and applications detected.
- [ ] Tests and CI surveyed.
- [ ] Security signals flagged (redacted).
- [ ] Implementation state and risks recorded.
- [ ] No code edited.

## Definition of Done

A recorded audit (scoped to the request) covering structure, stack, applications, tests, security signals, and state — with confirmed vs inferred separated — ready to inform requirements, applications, and stack.

## Related Skills

`request-classification`, `requirements-analysis`, `application-selection`, `stack-recommendation`, `dependency-audit`, `environment-audit`, `security-review`, `performance-review`.

## Related Knowledge

`../../knowledge/` (existing architecture notes, if any).

## Related References

None typically; a stack reference folder only if an unfamiliar framework is present.

## Context Loading Guidance

- **Requires:** repository read access, the classified request.
- **Does not require:** the full stack decision space, unrelated references, or every skill.
- **May load:** `dependency-audit`, `environment-audit` for deeper inventory; `security-review` for posture.
- **Stop when:** the scoped audit is recorded.

## Token Efficiency Guidance

Read entry points, manifests, and config first; sample representative files rather than reading everything. Summarize into findings; don't paste large files into the record.
