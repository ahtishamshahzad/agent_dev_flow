# Workflow: Bug Fix

> Audit → reproduce → root cause → minimal fix → regression test → validate. No fixing by guessing; every fix leaves a failing-first regression test.

## Request Classification

**Primary type:** bug. Selected when existing behavior is wrong and must be corrected.

## Skills Required

`../skills/bug-investigation`, `../skills/testing/regression-testing` (+ `../skills/security/security-regression-testing` if security-relevant), the relevant domain skill for the fix area, `../skills/code-review`.

## Agents Involved

`orchestrator` → the owning engineer (backend/web/mobile/database) → `test-engineer` (regression test) → `code-reviewer` (+ `security-reviewer` if the bug is a vulnerability). Single-agent or short sequential; not parallel.

## Context Required

The bug report + reproduction, the affected code path, and the root-cause finding. Narrow — only the implicated path.

## Gates

Gate 5 (regression test exists and passes), Gate 6 (review). Full pipeline gates not re-run for a scoped fix.

## Documents Generated

Root-cause note, the fix, the failing-first regression test, review note.

## Validation

The regression test **fails on the unfixed code and passes after the fix**; the root cause (not just the symptom) is addressed; no scope creep; behavior elsewhere unchanged.

## Handoff

Reproduce → root cause → fix + regression test → review, via Handoff Format; ready for PR.

## Stop Condition

- **Stop** if the bug can't be reproduced and no reproduction path exists — investigate first (`../hooks/before-bugfix.md`).
- **Stop** if no regression test is written.
- **Complete** when the root cause is fixed, guarded by a failing-first regression test, and reviewed.

## Related

Hook: `before-bugfix`. Skills: `../skills/bug-investigation`, `../skills/testing/regression-testing`.
