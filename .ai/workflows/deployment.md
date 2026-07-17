# Workflow: Deployment

> Get an approved build into an environment safely: readiness, config, migration ordering, health-gated rollout, rollback. Deploys require explicit approval; no infrastructure scaffolded.

## Request Classification

**Primary type:** deployment. Selected when the goal is to deploy to staging/production or set up the deploy path.

## Skills Required

`../skills/devops/deployment-selection`, `staging-environment`, `production-readiness`, `../skills/devops/ci-cd`, `github-actions`, `environment-management`, `secrets-management`, `../skills/backend/backend-deployment`, `../skills/database/database-migrations` + `backup-recovery`, `../skills/devops/rollback-planning`, `../skills/devops/monitoring-logging`.

## Agents Involved

`orchestrator` → `devops-engineer` (build/CI/deploy config) → `database-engineer` (migration ordering on deploy) → `release-manager` (readiness + approval) → post-deploy verification. `security-reviewer` for CI security checks.

## Context Required

Selected applications (CI reflects only apps that exist), deployment target, env/secret model, migration flow, rollback plan.

## Gates

Gate 7 (release/deploy readiness). Deploys are **approval-gated**.

## Documents Generated

Deployment plan (target, artifact promotion, migration ordering, health-gated rollout), rollback runbook, post-deploy smoke result, monitoring/alert setup.

## Validation

One immutable artifact promoted with config injected; migrations ordered safely (expand/contract); readiness verified with evidence (backups + tested restore, monitoring, rollback rehearsed); **post-deploy smoke** green; no jobs/infra for apps that don't exist.

## Handoff

Build → readiness → deploy (staging → prod under approval) → post-deploy smoke → monitor, via Handoff Format.

## Stop Condition

- **Stop** if production-readiness is unverified or the remote/deploy action is not explicitly approved (`../hooks/before-release.md`).
- **Stop and roll back** if post-deploy smoke fails (`../hooks/after-release.md`).
- **Complete** when the approved artifact is deployed, smoke-verified healthy, with rollback available.

## Related

Hooks: `before-release`, `after-release`. Skills: `../skills/devops/production-readiness`, `deployment-selection`.
