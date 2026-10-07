# BUG-<NNN> — <short title>

> Fill-in work-item template, saved as `../work-items/bugs/BUG-<NNN>.md`. Audit → reproduce → root cause → minimal fix → regression test → validate (`../skills/bug-investigation`). Intake, scheduling, and the ledger: `../skills/project-management`. Statuses and priorities: `../system/PROJECT_MANAGEMENT_RULES.md`.

- **Status:** OPEN | IN_PROGRESS | FIXED | VERIFIED | CLOSED | DUPLICATE of BUG-<NNN> | WONT_FIX
- **Priority:** P0 | P1 | P2 | P3 · **Estimate:** XS | S | M | L
- **Reported:** <YYYY-MM-DD> by <user | client | QA | developer> · **Environment:** development | staging | production
- **Platform:** <web | iOS | Android | backend | admin>
- **Fix task:** <TASK-NNN> · **Week:** WEEK-<NN> · **Ledger:** row in `logs/BUG-LOG.md` in `../projects/current/`

## Summary

- **Expected:** <what should happen>
- **Actual:** <what happens>

## Reproduction

1. <Step>
2. <Step>
- **Environment:** <where it reproduces>
- **Reliably reproducible:** yes | no (if no, investigate first)

## Root Cause

<The actual cause, not the symptom. File:line where relevant. Mark "hypothesis" until confirmed.>

## Affected Areas

- <file / component / API / table / service>

## Fix

<The minimal, targeted change. No bundled refactors.>

## Regression Test

Specified as a scenario — the reproduction as `Given`/`When`, the correct behavior as an observable `Then` (`../system/GHERKIN_RULES.md`):

```gherkin
Scenario: <the behavior that was broken, stated correctly>
  Given <the state that triggered the bug>
  When <the action that exposed it>
  Then <the observable correct outcome>
```

- **Level:** unit | integration | api | e2e (lowest that captures it)
- **Fails before fix / passes after:** [ ] confirmed
- **Security regression (if vuln):** <`../skills/security/security-regression-testing`>

## Validation

- [ ] Root cause addressed · [ ] regression test in CI · [ ] no scope creep · [ ] nearby behavior unchanged

## Resolution

- **Resolved:** <YYYY-MM-DD> · **How:** <one line> · **Verified in:** <environment>

## Related

- Workflow: `../workflows/bugfix.md`. Hook: `../hooks/before-bugfix.md`.
