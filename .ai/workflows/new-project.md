# Workflow: New Project

> Full pipeline from a blank request to a shipped first version. The canonical pipeline (`../system/ORCHESTRATION_WORKFLOW.md`) applied end to end, gated per `../system/QUALITY_GATES.md`. Loads only the skills each stage needs.

## Request Classification

**Primary type:** new project. Selected when there is no existing codebase and the work is to design and build something new.

## Skills Required (loaded per stage, not all at once)

- Intake: `../skills/request-classification`, `../skills/requirements-analysis`.
- Selection/architecture: `../skills/application-selection`, `../skills/stack-recommendation`, `../skills/architecture-design`, `../skills/repository-architecture` (+ domain selection skills as areas demand).
- Planning: `../skills/task-planning`.
- Build: the relevant domain packs (`../skills/backend|database|mobile|testing|devops|security/`) — **only the areas selected**.
- Delivery: `../skills/testing-strategy`, `../skills/security-review`, `../skills/release-planning`, `../skills/git-workflow`, `../skills/github-repository`.

## Agents Involved

`orchestrator` → `product-analyst` → `architect` → (implementers: `backend`/`web`/`mobile`/`database` as selected) → `test-engineer` → `code-reviewer` + `security-reviewer` → `devops-engineer` → `documentation-engineer` → `release-manager`. Execution mode chosen per `../agents/multi-agent-execution.md` (default single/sequential; parallel only for disjoint streams).

## Context Required

Requirements, selection/stack decisions, architecture + file-ownership boundaries, approved phases/tasks, the active skills for the current stage. Kept minimal and layered (`../system/CONTEXT_MANAGEMENT_RULES.md`).

## Gates

All seven. **Gate 2** (apps+stack) and **Gate 4** (phases+tasks) require explicit user approval — no code before both.

## Documents Generated

Requirements doc, application+stack decision, architecture doc, repository layout, phases+tasks, test plan, review + security reports, release-readiness go/no-go — in `../projects/current/` and `../generated/`.

## Validation

Each stage validated against its gate; final validation aggregates tests, reviews, security, and production-readiness into a go/no-go (`../skills/final-quality-audit`). Parallel streams get a single integration review.

## Handoff

Between stages via each agent's Handoff Format; final handoff is the release-readiness record and (under approval) the shipped release.

## Stop Condition

- **Stop** at Gate 2 and Gate 4 until the user approves.
- **Stop** if any gate fails — report with evidence, fix or return to the user; do not advance.
- **Complete** when the approved scope is built, validated, and released under explicit approval (or handed off ready to release).

## Related

Pipeline: `../system/ORCHESTRATION_WORKFLOW.md`. Hooks: `../hooks/before-discovery.md` → `before-architecture` → `before-feature` → `before-commit`/`before-pr` → `before-release` → `after-*`.
