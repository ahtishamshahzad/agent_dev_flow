# `.ai/agents/` — Agent Role Definitions (Index)

Role definitions for **multi-agent** runs. Used only when multiple agents are justified (`../system/MULTI_AGENT_RULES.md`); single-agent work does not need these. Tool-neutral: where an editor spawns sub-agents the roles run concurrently; where it can't, one agent plays the roles **sequentially**, preserving separation of concerns and independent review.

Execution modes and the conflict-prevention rules are in [`multi-agent-execution.md`](multi-agent-execution.md). **Do not use multi-agent work only because the capability exists** — the mode is chosen from the shape of the work.

## Index

| Agent | Role | Owns (may modify) | Never modifies |
|-------|------|-------------------|----------------|
| [`orchestrator`](orchestrator.md) | Drives the pipeline, assigns disjoint scopes, prevents conflicting edits, integrates and validates. | `../projects/current/`, `../work-items/`, `../generated/` orchestration records | application/source code, another agent's active scope, `../system/` |
| [`product-analyst`](product-analyst.md) | Classify request; analyze requirements + success criteria. | requirements/classification records | source code, architecture/stack/task docs, `../system/` |
| [`architect`](architect.md) | Applications, stack, architecture, repo layout, file-ownership boundaries. | architecture/selection/stack records, `../knowledge/` | source code (recommends, never scaffolds), task docs, `../system/` |
| [`backend-engineer`](backend-engineer.md) | Implement backend API within its scope. | assigned backend source + tests; API contract (by coordination) | web/mobile/db source, migrations, others' scopes, `../system/` |
| [`web-engineer`](web-engineer.md) | Implement web/dashboard frontend within its scope. | assigned web source + tests | backend/mobile/db source, API contract, others' scopes |
| [`mobile-engineer`](mobile-engineer.md) | Implement React Native/Expo app within its scope. | assigned mobile source + tests | backend/web/db source, API contract, others' scopes |
| [`database-engineer`](database-engineer.md) | Schema, data layer, migrations — **sole owner of schema/migration files**. | schema, migrations, data-layer, seeds, DB fixtures | app source, others' scopes, `../system/` |
| [`security-reviewer`](security-reviewer.md) | Independent security assessment (separate from implementer). | `../generated/` security reports; security regression tests (coordinated) | **application source** (reviews, doesn't fix), others' scopes |
| [`test-engineer`](test-engineer.md) | Select test types/tools; author tests for the required cases. | test files, factories, fixtures, test env config; `../generated/` audits | **application source** (hands fixes to owner), others' scopes |
| [`code-reviewer`](code-reviewer.md) | Independent code review by severity + AI-output checks. | `../generated/` code review reports | **application source** (reviews, doesn't rewrite), others' scopes |
| [`devops-engineer`](devops-engineer.md) | Repo/CI/CD, Docker, env/secrets, deploy, ops readiness. | CI/build/deploy config, env templates, runbooks | app source, **real secret values**, others' scopes |
| [`documentation-engineer`](documentation-engineer.md) | Keep docs canonical, thin adapters, archive stale reports. | docs, READMEs/indexes, changelog, adapters | app source, `../system/` authority, behavior |
| [`release-manager`](release-manager.md) | Release readiness, versioning, go/no-go; ships only under approval. | changelog, version, release notes, release records | app source, others' scopes, `../system/` |

## Ownership & conflict prevention (load-bearing)

- Every agent states an explicit **may modify** / **should not modify** scope — ownership is unambiguous.
- **Reviewers (security, code) and the test engineer never edit application source** — they report/route; the owning engineer fixes. This preserves independent review.
- The **database engineer is the sole editor of schema/migration files**; no other agent races them.
- The **orchestrator** builds a disjoint file-ownership map before any parallel run, defines shared contracts first, holds the synchronization point, and runs the final integration review. Two agents editing the same file concurrently is **prevented by construction**, not detected after the fact ([`multi-agent-execution.md`](multi-agent-execution.md)).

## Conventions

- Each agent file documents: role, when to use, required inputs, allowed outputs, relevant skills, context limits, files it may modify, files it should not modify, completion criteria, handoff format.
- Scopes are **disjoint** across concurrently-running agents. A shared/contract file gets **one** owner; others request changes through the orchestrator.
- Agents load only their stage's skills (`../system/SKILL_SELECTION_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`).

## Related

Rules: `../system/MULTI_AGENT_RULES.md`, `ORCHESTRATION_WORKFLOW.md`, `QUALITY_GATES.md`. Hooks: `../hooks/`. Workflows: `../workflows/`.
