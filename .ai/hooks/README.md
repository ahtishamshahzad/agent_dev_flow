# `.ai/hooks/` — Tool-Neutral Workflow Gates (Index)

Hooks are reusable checklists/workflows attached to lifecycle events. They are **tool-neutral specifications** by default — an agent reads the spec and performs the checks manually. Executable editor integration (Claude Code hooks in `settings.json`, git hooks) is added only where supported and approved, and is a thin wrapper that invokes the same spec, never a replacement (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

Each hook documents: **trigger**, **required inputs**, **checks**, **failure conditions**, **output**, and **stop conditions**.

## Index

### Before
| Hook | Trigger | Purpose |
|------|---------|---------|
| [`before-discovery`](before-discovery.md) | Start of intake | Classifiable request; audit-first if a codebase exists; resume existing state. |
| [`before-architecture`](before-architecture.md) | Before architecture | Gate 1 met; apps+stack approved (Gate 2); no code yet. |
| [`before-feature`](before-feature.md) | Before feature build | Gate 4 approved; scoped; disjoint scope + contracts if parallel. |
| [`before-bugfix`](before-bugfix.md) | Before a bug fix | Reproduced; root cause; minimal scope; failing-first regression test planned. |
| [`before-refactor`](before-refactor.md) | Before a refactor | Behavior-preserving; test safety net; small reversible steps. |
| [`before-migration`](before-migration.md) | Before a migration | Backup + tested restore; idempotent/resumable; verification + rollback. |
| [`before-commit`](before-commit.md) | Before a commit | No secrets; not on default branch; in scope; checks run; authorized. |
| [`before-pr`](before-pr.md) | Before opening a PR | Gates 5–6; no secrets in history; docs current; integration-reviewed. |
| [`before-release`](before-release.md) | Before release/deploy | Gate 7 readiness verified with evidence; explicit approval to ship. |

### After
| Hook | Trigger | Purpose |
|------|---------|---------|
| [`after-feature`](after-feature.md) | After a feature | Acceptance met; required cases covered; docs + state updated. |
| [`after-phase`](after-phase.md) | End of a phase | All tasks met; integrated; tests/reviews clear; state + docs updated. |
| [`after-pr`](after-pr.md) | After PR / at merge | Feedback addressed; CI green; merge authorized; follow-ups captured. |
| [`after-release`](after-release.md) | After release/deploy | Post-deploy smoke; monitoring healthy; rollback ready; notes + state. |

## Hooks ↔ gates

Hooks commonly enforce quality gates (`../system/QUALITY_GATES.md`): `before-architecture` → Gates 1–2; `before-feature` → Gate 4; `before-pr` → Gates 5–6; `before-release` → Gate 7. The gate's authority comes from `QUALITY_GATES.md`; the hook runs its checks.

## Conventions

- Tool-neutral markdown; readable and actionable by any agent.
- Each hook's **stop conditions** say exactly when to halt (missing approval, failing required check, detected secret, unverified readiness).
- Optional editor-executable wrappers are noted separately and invoke the same spec.

## Related

Rules: `../system/HOOK_RULES.md`, `QUALITY_GATES.md`, `GIT_WORKFLOW_RULES.md`. Agents: `../agents/`. Workflows: `../workflows/`.
