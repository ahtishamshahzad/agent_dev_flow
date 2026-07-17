# Hook: after-release

> Tool-neutral checklist run after a release/deploy. Read and perform manually; executable integration optional (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

After a release is published or a production deploy completes.

## Required Inputs

- The release/deploy result, post-deploy checks, and monitoring state.

## Checks

- [ ] **Post-deploy smoke** run against the real environment — the app is alive; config/secrets/connectivity work (`../skills/testing/smoke-testing`).
- [ ] Monitoring/alerts show healthy signals; error/latency within bounds (`../skills/devops/monitoring-logging`).
- [ ] Rollback remains available and its trigger conditions are known (`../skills/devops/rollback-planning`).
- [ ] Version tagged; changelog/release notes published; `../projects/current/` state updated to released.
- [ ] Incident readiness active (on-call, runbooks) for the new version (`../skills/devops/incident-readiness`).

## Failure Conditions

- Post-deploy smoke fails, or monitoring shows a regression.
- No rollback available; release state/notes not recorded.

## Output

- A release-completion record: smoke/monitoring healthy, rollback ready, notes published, state updated.

## Stop Conditions

- **Stop and roll back** if post-deploy smoke fails or monitoring shows a real regression (`../skills/devops/rollback-planning`).
- Otherwise record the release as complete and healthy.

## Related

- Agents: `../agents/release-manager.md`, `../agents/devops-engineer.md`. Skills: `../skills/devops/production-readiness`, `monitoring-logging`, `rollback-planning`, `incident-readiness`.
