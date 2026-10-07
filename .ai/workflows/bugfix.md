# Workflow: Bug Fix

> Audit → reproduce → root cause → minimal fix → regression test → validate. No fixing by guessing; every fix leaves a failing-first regression test **and a permanent regression scenario**.

## The debugging flow

```
Bug report → record it (intake) → understand the expected behavior → find the existing scenarios
  → reproduce the actual behavior → compare expected vs actual
  → write or update the regression scenario (it fails on the current code)
  → root cause → minimal fix → the scenario's test passes → regression suite passes → close the bug
```

- **Expected behavior first.** If an approved scenario already covers it, that scenario is the expected behavior. If none does, write one; if the expected behavior is disputed or changes what users experience, get it approved (Gate 2) before fixing.
- **The regression scenario is permanent:** it moves into `features/<area>/`, tagged `@regression @bug-NNN` (`../system/GHERKIN_RULES.md`). It is never deleted when the bug closes.
- **Symptom-only fixes are rejected:** the fix must explain why the scenario failed.

## Request Classification

**Primary type:** bug. Selected when existing behavior is wrong and must be corrected.

## Skills Required

`../skills/project-management` (intake: duplicate check, `BUG-NNN`, priority, week, ledger), `../skills/bug-investigation`, `../skills/testing/regression-testing` (+ `../skills/security/security-regression-testing` if security-relevant), `../skills/testing/gherkin-specifications` (the regression scenario), the relevant domain skill for the fix area, `../skills/code-review`.

## Agents Involved

`orchestrator` → the owning engineer (backend/web/mobile/database) → `test-engineer` (regression test) → `code-reviewer` (+ `security-reviewer` if the bug is a vulnerability). Single-agent or short sequential; not parallel.

## Context Required

The bug report + reproduction, the affected code path, and the root-cause finding. Narrow — only the implicated path.

## Gates

Gate 5 (regression test exists and passes), Gate 6 (review). Full pipeline gates not re-run for a scoped fix — including on an untracked project, where the bug is recorded but not sent through planning (`../system/PROJECT_MANAGEMENT_RULES.md`, untracked projects).

## Documents Generated

`../work-items/bugs/BUG-<NNN>.md` (root cause, fix plan, resolution), a `BUG-LOG.md` row, and — on a tracked project — the fix task in the current or next week plus a development-log entry; the fix, the failing-first regression test, review note.

## Validation

The regression scenario and its test **fail on the unfixed code and pass after the fix**; the scenario is in `features/`; the root cause (not just the symptom) is addressed; the regression suite passes; no scope creep; behavior elsewhere unchanged.

## Handoff

Reproduce → root cause → fix + regression test → review, via Handoff Format; ready for PR.

## Stop Condition

- **Stop** if the bug can't be reproduced and no reproduction path exists — investigate first (`../hooks/before-bugfix.md`).
- **Stop** if no regression scenario and test are written.
- **Complete** when the root cause is fixed, guarded by a failing-first regression test, and reviewed.

## Related

Hook: `before-bugfix`. Skills: `../skills/bug-investigation`, `../skills/testing/regression-testing`.
