---
name: code-review
description: Use to review a change or diff for correctness, clarity, maintainability, and convention-fit before it advances. Reports findings with severity, separating confirmed defects from suggestions; does not rubber-stamp.
---

# Code Review

## Purpose

Evaluate a change for correctness, readability, maintainability, and consistency with the project's conventions and architecture — and report actionable findings. Supports Gate 6.

## When to Use

- After implementation of a task/feature/fix, before merge/release.
- For a **code review** request type.
- **Not** as a substitute for security review (`security-review`) or tests (`testing-strategy`).

## Inputs

- The diff/change under review and its context (work item, acceptance criteria).
- Project conventions and architecture.

## Discovery Questions

- What was this change supposed to do (acceptance criteria)?
- Which files/modules changed, and what do they touch?
- Are there tests, and do they cover the change?

## Responsibilities

- Verify the change **meets its acceptance criteria**.
- Check **correctness** (logic, edge cases, error handling).
- Check **clarity/maintainability** (naming, structure, duplication).
- Check **convention/architecture fit** and unintended behavior changes.
- Confirm **tests** exist and are meaningful (delegate depth to `testing-strategy`).
- Report findings with **severity** and **confirmed vs suggestion**.

## Required Workflow

1. Read acceptance criteria + the diff.
2. Assess correctness and edge cases.
3. Assess clarity, maintainability, conventions.
4. Check tests cover the change.
5. Flag security/perf concerns to the specialist skills.
6. Report findings (severity, confirmed/suggestion) with `file:line`.
7. On a tracked project, record them via `project-management`: confirmed defects through bug intake, accepted suggestions as `TECH-` tasks (`../../system/PROJECT_MANAGEMENT_RULES.md`, recording work).

## Decision Rules

- Block on confirmed correctness or security defects; suggestions don't block.
- Prefer the smallest correct change; flag scope creep.
- Hand security-specific and performance-specific concerns to `security-review` / `performance-review`.

## Rules

- Be specific: cite `file:line` and the failure scenario.
- Separate confirmed defects from style/preference.
- Don't approve unverified correctness; don't rubber-stamp.

## Anti-Patterns

- Vague feedback with no location or scenario.
- Bikeshedding style while missing correctness.
- Approving without checking the change meets its criteria.

## Validation Checklist

- [ ] Change meets acceptance criteria.
- [ ] Correctness/edge cases assessed.
- [ ] Clarity/maintainability assessed.
- [ ] Conventions/architecture respected.
- [ ] Tests cover the change.
- [ ] Findings have severity + confirmed/suggestion + location.

## Definition of Done

A review report with located, severity-rated findings (confirmed defects vs suggestions), a clear pass/block verdict against acceptance criteria, and any security/perf items routed to specialists.

## Related Skills

`security-review`, `performance-review`, `testing-strategy`, `ai-output-review`, `final-quality-audit`, `project-orchestrator`, `project-management`.

## Related Knowledge

`../../knowledge/` (conventions, architecture).

## Related References

`../../references/<topic>/` for the language/framework idioms if needed.

## Context Loading Guidance

- **Requires:** the diff, acceptance criteria, relevant conventions.
- **Does not require:** the whole repo, unrelated references, planning skills.
- **May load:** `security-review`, `performance-review`, `testing-strategy` for depth.
- **Stop when:** the review report is delivered.

## Token Efficiency Guidance

Review the diff plus only the surrounding context needed to judge it. Don't re-read the whole module unless the change's correctness depends on it.
