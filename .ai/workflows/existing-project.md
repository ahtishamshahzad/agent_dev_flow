# Workflow: Existing Project Enhancement

> Enhance an existing codebase. **Audit first**, then targeted phases within the current architecture. Never edit before understanding.

## Request Classification

**Primary type:** existing project enhancement. Selected when a codebase already exists and the work extends or improves it.

## Skills Required (per stage)

- Audit: `../skills/existing-project-audit` (+ `../skills/backend/existing-backend-audit`, `../skills/dependency-audit`, `../skills/environment-audit` as relevant).
- Analysis/planning: `../skills/requirements-analysis`, `../skills/feature-planning` or `refactor-planning`/`migration-planning`, `../skills/task-planning`.
- Build/deliver: the relevant domain packs + `../skills/testing-strategy`, review skills — only what the change touches.

## Agents Involved

`orchestrator` → `product-analyst` (+ audit via the relevant engineer/reviewer) → `architect` (only if boundaries change) → implementer(s) for the touched area → `test-engineer` → `code-reviewer` (+ `security-reviewer` if sensitive) → `documentation-engineer` → `release-manager`.

## Context Required

The audit findings, the existing architecture, the enhancement's scope, and the file-ownership scope of the touched area. Do **not** load the whole codebase — sample per the audit.

## Gates

Gate 1 (requirements + audit), Gate 3 if architecture shifts, Gate 4 (tasks) if non-trivial, Gates 5–7 for delivery. Gate 2 only if the change adds applications/stack.

## Documents Generated

Audit report, scoped requirements, (optional) architecture delta, phases/tasks, test + review reports, release record.

## Validation

Change validated against acceptance criteria and the existing behavior it must not break (regression tests); reviews clear; no unauthorized cross-scope edits.

## Handoff

Audit → plan → implement → test → review → release, each via Handoff Format.

## Stop Condition

- **Stop** if editing is attempted before the audit — audit first (`../hooks/before-discovery.md`).
- **Stop** if the change needs new apps/stack without Gate 2 approval.
- **Complete** when the enhancement meets acceptance criteria, breaks nothing (regression green), is reviewed, and delivered.

## Related

Pipeline: `../system/ORCHESTRATION_WORKFLOW.md`. Hooks: `before-discovery` → `before-feature`/`before-refactor`/`before-migration` → `before-commit`/`before-pr` → `after-feature`/`after-phase`.
