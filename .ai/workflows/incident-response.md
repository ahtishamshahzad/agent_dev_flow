# Workflow: Incident Response

> Respond to a production incident: detect → assess severity → mitigate (often rollback) → communicate → root cause → blameless postmortem → regression test. Preparation lives in incident-readiness; this is the response.

## Request Classification

**Primary type:** incident response (an operational path, triggered by a live production problem rather than a planned request). Secondary: bug (for the follow-up fix).

## Skills Required

`../skills/devops/incident-readiness`, `../skills/devops/rollback-planning`, `../skills/devops/monitoring-logging`, `../skills/bug-investigation` (root cause), `../skills/testing/regression-testing` + `../skills/security/security-regression-testing` (guard), `../skills/backend/backend-observability`.

## Agents Involved

`orchestrator` (incident coordinator) → `devops-engineer` (mitigate/rollback, monitoring) → owning engineer (root cause + fix) → `test-engineer` (regression test) → `security-reviewer` (if security incident) → `documentation-engineer` (postmortem/notes).

## Context Required

The alert/symptom, severity definition, monitoring/logs, the rollback plan and its trigger, and the recent change most likely responsible.

## Gates

Operational — mitigation first, then the fix follows the bug/release gates (5–7). The postmortem feeds a regression test (Gate 5).

## Documents Generated

Incident timeline, severity assessment, mitigation record (rollback if used), root-cause analysis, **blameless postmortem** with tracked action items, the regression test that prevents recurrence.

## Validation

Severity correctly assessed and matched to response; mitigation restored service (or rollback executed); root cause identified (not just symptom); a regression test guards recurrence; postmortem is blameless with owned, tracked actions.

## Handoff

Detect → assess → mitigate → communicate → root cause → fix + regression test → postmortem, via Handoff Format.

## Stop Condition

- **Immediate action:** if service is down/degraded and a rollback is available, **mitigate first** (roll back) before deep investigation (`../hooks/after-release.md`).
- **Complete** when service is restored, root cause is fixed and regression-tested, and a blameless postmortem with tracked actions exists.

## Related

Skills: `../skills/devops/incident-readiness`, `rollback-planning`. Hook: `after-release`. Feeds: `bugfix.md` for the durable fix.
