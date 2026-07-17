# Workflow: Release

> Validate release readiness (Gate 7), handle versioning/changelog, follow git/PR flow, and ship — only under explicit approval.

## Request Classification

**Primary type:** release. Selected when cutting a release/publishing (may wrap a deployment).

## Skills Required

`../skills/release-planning`, `../skills/final-quality-audit`, `../skills/git-workflow`, `../skills/github-repository` + `../skills/devops/production-readiness`, `rollback-planning`.

## Agents Involved

`orchestrator` → `release-manager` (aggregate + go/no-go) ← inputs from `test-engineer`, `code-reviewer`, `security-reviewer`, `devops-engineer`, `documentation-engineer`.

## Context Required

Aggregated stage outputs (tests, reviews, security, production-readiness, docs), version/changelog state, deployment + rollback plan.

## Gates

Gate 7 (release readiness); Gates 1–6 must already have passed.

## Documents Generated

Final quality audit, release-readiness go/no-go, version bump, changelog/release notes, release record in `../projects/current/`.

## Validation

All prior gates passed; release criteria met with evidence (tests green, security/quality clear, docs + changelog updated, version handled, production-readiness verified, rollback rehearsed); go/no-go produced.

## Handoff

Aggregate → go/no-go → (under approval) publish → post-release verification, via Handoff Format.

## Stop Condition

- **Stop (no-go)** if any gate is unmet or a critical/high is open.
- **Stop** until the publish/deploy is **explicitly approved by the user** — never assumed.
- **Complete** when the release is published under approval, verified healthy, and recorded.

## Related

Hooks: `before-release`, `after-release`, `before-pr`/`after-pr`. Rules: Gate 7, `../system/GIT_WORKFLOW_RULES.md`.
