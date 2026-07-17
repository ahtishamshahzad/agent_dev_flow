# Workflow: New Feature

> Build a feature within the existing, approved architecture — scoped, tested, reviewed, without scope creep.

## Request Classification

**Primary type:** feature. Selected when adding capability inside an already-defined architecture (no new apps/stack, boundaries unchanged).

## Skills Required (per stage)

- Plan: `../skills/feature-planning`, `../skills/task-planning`.
- Build: the relevant domain skills for the feature's area (backend/web/mobile/database) — selectively.
- Test/review: `../skills/testing-strategy` + the needed `../skills/testing/*`; `../skills/code-review` (+ `../skills/security-review` if sensitive).

## Agents Involved

`orchestrator` → implementer(s) for the feature's area → `test-engineer` → `code-reviewer` (+ `security-reviewer` if the feature touches auth/data/payments) → `documentation-engineer`. Usually single-agent or sequential; parallel only if the feature genuinely splits into disjoint streams with a shared contract.

## Context Required

The feature scope, the relevant architecture slice, the API/data contracts it touches, and the implementer's file-ownership scope. Not the whole codebase.

## Gates

Gate 4 (tasks + acceptance criteria approved), Gate 5 (tests), Gate 6 (review). Gates 2–3 only if the feature unexpectedly needs new apps/stack or architecture change (then escalate).

## Documents Generated

Feature plan + tasks, tests, code/security review notes, doc updates.

## Validation

Acceptance criteria met; required cases covered (happy, invalid input, error, **authorization denial**, regression); no scope creep (`../skills/ai-output-review`); review clear.

## Handoff

Plan → implement → test → review → docs, via Handoff Format; ready for PR.

## Stop Condition

- **Stop** and escalate if the feature actually needs new apps/stack or an architecture change (wrong workflow — go through Gates 2–3).
- **Stop** if scope creeps beyond the approved tasks.
- **Complete** when the feature meets acceptance criteria, is tested and reviewed, and docs are updated.

## Related

Hooks: `before-feature` → `after-feature` → `before-commit`/`before-pr`. Skills: `../skills/feature-planning`.
