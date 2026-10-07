# Workflow: New Feature

> Build a feature within the existing, approved architecture — scoped, tested, reviewed, without scope creep.

## Request Classification

**Primary type:** feature. Selected when adding capability inside an already-defined architecture (no new apps/stack, boundaries unchanged).

## Skills Required (per stage)

- Specify: `../skills/testing/gherkin-specifications` — the feature's scenarios **first**, before design or tasks (`../system/GHERKIN_RULES.md`).
- Plan: `../skills/feature-planning`, `../skills/task-planning`.
- Build: the relevant domain skills for the feature's area (backend/web/mobile/database) — selectively.
- Test/review: `../skills/testing/gherkin-specifications` (acceptance criteria and required cases as scenarios — `../system/GHERKIN_RULES.md`), `../skills/testing-strategy` + the needed `../skills/testing/*`; `../skills/code-review` (+ `../skills/security-review` if sensitive).

## Agents Involved

`orchestrator` → implementer(s) for the feature's area → `test-engineer` → `code-reviewer` (+ `security-reviewer` if the feature touches auth/data/payments) → `documentation-engineer`. Usually single-agent or sequential; parallel only if the feature genuinely splits into disjoint streams with a shared contract.

## Context Required

The feature scope, the relevant architecture slice, the API/data contracts it touches, and the implementer's file-ownership scope. Not the whole codebase.

## Gates

**Gate 2 — the feature's scenarios approved** before design (apps/stack only if the feature unexpectedly needs new ones — then escalate), Gate 4 (tasks, each naming the scenarios it delivers), Gate 5 (every scenario → a passing test), Gate 6 (review). Gate 3 only if the architecture changes.

## Documents Generated

Feature plan + tasks, tests, code/security review notes, and the product docs for the units added (`docs/<app>/…` + index rows — `../skills/application-documentation`).

**Tracking (tracked project):** `FEAT-` task IDs, phase and week assignment, development-log entries; `SCOPE CHANGE` if the feature was not in the approved plan (`../skills/project-management`).

## Validation

Acceptance criteria met; required cases covered (happy, invalid input, error, **authorization denial**, regression); no scope creep (`../skills/ai-output-review`); review clear.

## Handoff

Plan → implement → test → review → docs, via Handoff Format; ready for PR.

## Stop Condition

- **Stop** and escalate if the feature actually needs new apps/stack or an architecture change (wrong workflow — go through Gates 2–3).
- **Stop** if scope creeps beyond the approved tasks — behavior no approved scenario covers is classified and, if new, approved first (`../system/GHERKIN_RULES.md`, scope control).
- **Complete** when the feature meets acceptance criteria, is tested and reviewed, and docs are updated.

## Related

Hooks: `before-feature` → `after-feature` → `before-commit`/`before-pr`. Skills: `../skills/feature-planning`.
