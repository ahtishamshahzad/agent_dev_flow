---
name: release-planning
description: Use to validate release readiness and plan a release — tests green, docs and changelog updated, versioning handled, git workflow followed, and any publish/deploy explicitly approved. Enforces Gate 7; never ships on a failed gate.
---

# Release Planning

## Purpose

Validate that work is ready to ship and plan the release safely. Enforces Gate 7 (`../../system/QUALITY_GATES.md`) and follows `../../system/GIT_WORKFLOW_RULES.md`. Publishing/deploying is outward-facing and requires approval.

## When to Use

- For a **release** or **deployment** request type.
- Before shipping any completed, reviewed work.
- **Not** to publish/deploy without explicit approval or a passed gate.

## Inputs

- The reviewed, tested change set.
- Version/changelog state; release criteria.
- Deploy target and approval status.

## Discovery Questions

- Are tests green and reviews complete (Gates 5–6)?
- Is the changelog/version updated?
- What is the deploy target and rollback plan?
- Has the user approved the publish/deploy step?

## Responsibilities

- Verify **release criteria**: tests green, security/quality review done, docs + changelog updated, version handled.
- Confirm **git workflow** followed (branch/PR/merge state).
- Plan the **release/deploy** with a rollback path.
- Ensure any **publish/deploy** step is explicitly approved.
- Record the release decision and outcome.

## Required Workflow

1. Confirm Gates 5–6 passed.
2. Verify docs, changelog, and version are updated.
3. Confirm git state (merged/tagged as required).
4. Confirm explicit approval for publish/deploy.
5. Execute (or hand off) the approved release with a rollback plan.
6. Verify and record the outcome — on a tracked project as a `DEPLOY-` task in the week, a development-log entry, and the week's report (`project-management`, `../../system/PROJECT_MANAGEMENT_RULES.md`).

## Decision Rules

- Do not ship on a failed gate — stop and report.
- Publish/deploy is outward-facing → explicit approval required.
- No release without a rollback path for risky changes.
- Version/changelog updates precede tagging.

## Rules

- Gate 7 is mandatory; a green build alone is not release readiness.
- Follow `../../system/GIT_WORKFLOW_RULES.md` for tags/branches.
- Never expose secrets in release artifacts (`../../system/SECURITY_RULES.md`).

## Anti-Patterns

- Shipping with failing/absent tests.
- Deploying without approval or rollback.
- Skipping changelog/version.
- Treating a passing CI as sufficient proof of readiness.

## Validation Checklist

- [ ] Gates 5–6 passed.
- [ ] Docs + changelog + version updated.
- [ ] Git state correct (merged/tagged).
- [ ] Rollback plan for risky changes.
- [ ] Publish/deploy explicitly approved.
- [ ] Outcome verified and recorded.

## Definition of Done

Release readiness is validated (Gate 7): tests green, reviews done, docs/changelog/version updated, git state correct, rollback planned, publish/deploy approved and verified — or the release is blocked with a clear reason.

## Related Skills

`git-workflow`, `github-repository`, `testing-strategy`, `security-review`, `final-quality-audit`, `migration-planning` (cutover), `project-orchestrator`, `project-management`.

## Related Knowledge

`../../knowledge/` (deploy targets, environments).

## Related References

`../../mcp/RECOMMENDED_SERVERS.md` (cloud/GitHub tools) when deploying.

## Context Loading Guidance

- **Requires:** review/test status, version/changelog state, deploy target, approval.
- **Does not require:** full source, unrelated references, planning skills' bodies.
- **May load:** `git-workflow`, `github-repository`, or cloud tool rules for the deploy.
- **Stop when:** the release is done and recorded, or blocked at Gate 7.

## Token Efficiency Guidance

Work from gate/status summaries, not raw source. Keep the release record to criteria met, actions taken, and outcome.
