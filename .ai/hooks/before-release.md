# Hook: before-release

> Tool-neutral checklist run before releasing/publishing/deploying. Read and perform manually; executable integration optional (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.** This hook runs the Gate 7 release-readiness checks.

## Trigger

Before a release, publish, or production deploy (`../system/ORCHESTRATION_WORKFLOW.md` stage 14; Gate 7).

## Required Inputs

- Aggregated outputs of testing, review, security, devops (production-readiness), and docs stages.
- Version/changelog state; the deployment + rollback plan; evidence artifacts.

## Checks

- [ ] Gates 1–6 all passed and recorded.
- [ ] Tests green (or unrun explicitly flagged); required cases covered; smoke path defined (`../skills/testing/smoke-testing`).
- [ ] Security & quality review clear — no unresolved critical/high (`../skills/security-review`).
- [ ] **Production-readiness verified with evidence** (config/secrets, migrations rehearsed, **backups + tested restore**, monitoring/alerts, rollback **rehearsed**, incident readiness) (`../skills/devops/production-readiness`).
- [ ] Docs + changelog updated; version handled; git workflow followed.
- [ ] **Remote/publish/deploy has explicit user approval** — it is never assumed.

## Failure Conditions

- Any prior gate unmet, or unresolved critical/high issue.
- Production-readiness merely *planned*, not *verified* (untested restore, unrehearsed rollback).
- Missing changelog/version handling.
- No explicit approval for the outward-facing action.

## Output

- An evidence-based **go/no-go** with blockers listed, and the explicit-approval status for shipping.

## Stop Conditions

- **Stop (no-go)** if any gate is unmet, a critical/high is open, or readiness is unverified.
- **Stop** and request approval if the remote/publish/deploy action is not explicitly approved.
- Otherwise proceed to release under approval.

## Related

- Agents: `../agents/release-manager.md`, `../agents/devops-engineer.md`. Rules: Gate 7 (`../system/QUALITY_GATES.md`), `GIT_WORKFLOW_RULES.md`, `OPERATING_RULES.md`.
