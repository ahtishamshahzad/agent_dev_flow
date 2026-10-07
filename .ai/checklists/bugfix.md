# Checklist: Bug Fix

> Verifiable items for a bug fix. Maps to `../hooks/before-bugfix.md`.

## Pass Criteria

- [ ] Bug **recorded** before fixing: not a duplicate (checked by symptom and by root cause), `BUG-NNN.md` exists with a P0–P3 priority, and it has a bug-log row (`../skills/project-management`).
- [ ] On a tracked project: a fix task linked to the bug, scheduled in a week.
- [ ] Bug **reproduced** (or a concrete reproduction established) before fixing.
- [ ] **Root cause** identified, not just the symptom (file:line).
- [ ] Fix is **minimal** and targeted — no bundled refactors.
- [ ] The bug's correct behavior is written as a **scenario** (reproduction as `Given`/`When`, observable correct outcome as `Then` — `../system/GHERKIN_RULES.md`).
- [ ] A **regression test fails on the unfixed code and passes after the fix**, at the lowest capturing level (`../skills/testing/regression-testing`).
- [ ] Security-relevant bugs also get a security regression test (`../skills/security/security-regression-testing`).
- [ ] Nearby behavior unchanged; the regression test lives in the CI-gated suite.
- [ ] Bug status updated in its file and the bug log (`FIXED`, then `VERIFIED`/`CLOSED` only when true).

## Fail / Stop

- No reproduction; symptom-only fix; no regression test; scope creep; a fix with no bug record.

## Related

Template: `../templates/BUG.md`. Workflow: `../workflows/bugfix.md`.
