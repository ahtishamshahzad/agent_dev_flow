# `.ai/workflows/` — Named Workflows (Index)

Named, per-request-type workflows. The canonical pipeline lives in `../system/ORCHESTRATION_WORKFLOW.md`; these are **variants** keyed to request classification. All respect the gates in `../system/QUALITY_GATES.md` and load **only the skills each stage needs** (`../system/SKILL_SELECTION_RULES.md`).

Each workflow documents: **request classification**, **skills required**, **agents involved**, **context required**, **gates**, **documents generated**, **validation**, **handoff**, and a **stop condition**.

## Index

| Workflow | Request type | Emphasis | Key gates |
|----------|--------------|----------|-----------|
| [`new-project`](new-project.md) | new project | Full pipeline: classify → apps → stack → architecture → phases → build → test → release | all 7 (2 & 4 = user approval) |
| [`existing-project`](existing-project.md) | existing enhancement | Audit first, then targeted phases | 1, 3*, 4, 5–7 |
| [`new-feature`](new-feature.md) | feature | Scoped build within existing architecture | 4, 5, 6 |
| [`bugfix`](bugfix.md) | bug | Reproduce → root cause → minimal fix → regression test | 5, 6 |
| [`refactor`](refactor.md) | refactor | Behavior-preserving, small reversible steps, test-backed | 5, 6 |
| [`migration`](migration.md) | migration | Incremental, reversible, backup + rehearse + verify + cutover | 3*, 5, 6, 7* |
| [`security-audit`](security-audit.md) | security audit | Independent assessment; Confirmed vs Potential; route fixes + tests | 6 |
| [`performance-audit`](performance-audit.md) | performance | Measure → diagnose → narrow fix → prove → guard | 5, 6 |
| [`testing-audit`](testing-audit.md) | testing audit | Coverage by risk, not percentage; fill the gaps that matter | 5 |
| [`deployment`](deployment.md) | deployment | Readiness, config, migration ordering, health-gated rollout, rollback | 7 (approval-gated) |
| [`release`](release.md) | release | Gate 7 readiness, versioning, changelog, ship under approval | 7 (approval-gated) |
| [`incident-response`](incident-response.md) | incident (operational) | Detect → mitigate/rollback → root cause → postmortem → regression test | operational + 5–7 for the fix |

\* conditional (only if architecture changes / it ships as a release).

## Execution modes

Every workflow names its agents and picks an execution mode per [`../agents/multi-agent-execution.md`](../agents/multi-agent-execution.md): default **single-agent**; **sequential specialists** for role separation without parallelism; **parallel specialists** only for genuinely independent, disjoint-file streams with contracts defined first, a synchronization point, and a final integration review. **Not multi-agent just because it's possible.**

## Stop conditions (every workflow has one)

Each workflow states explicit stop conditions — e.g. stop at Gates 2/4 for user approval; stop on a failing required check or open critical/high; stop before any unapproved remote/publish/deploy; stop-and-rollback on failed post-deploy smoke. A workflow never advances through a failed gate.

## Conventions

- A workflow names its request type, references the canonical pipeline and gates, and lists the minimum skills + agents.
- It must not contradict `../system/`.
- Skills are loaded per stage and unloaded on switch — no whole-tree loading.

## Related

Pipeline: `../system/ORCHESTRATION_WORKFLOW.md`. Gates: `../system/QUALITY_GATES.md`. Agents: `../agents/`. Hooks: `../hooks/`. Skills: `../skills/README.md`.
