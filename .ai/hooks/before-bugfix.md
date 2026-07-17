# Hook: before-bugfix

> Tool-neutral checklist run before a bug fix begins. Read and perform manually; executable integration optional (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

Before implementing a bug fix (bug workflow — `../workflows/bugfix.md`).

## Required Inputs

- The bug report and reproduction (or the plan to reproduce).
- The affected area; the root-cause finding (if investigation is done).

## Checks

- [ ] The bug is **reproduced** (or a concrete reproduction plan exists) — no fixing by guessing (`../skills/bug-investigation`).
- [ ] Root cause is identified, not just the symptom.
- [ ] The fix scope is **minimal** and targeted (no opportunistic refactors bundled in).
- [ ] A **failing-first regression test** at the lowest capturing level is planned (`../skills/testing/regression-testing`).
- [ ] If security-relevant, the security-regression path is noted (`../skills/security/security-regression-testing`).

## Failure Conditions

- No reproduction and no reproduction plan.
- Fixing the symptom without a root cause.
- No regression test planned (the bug could silently return).
- Scope creeping beyond the fix.

## Output

- Confirmation of reproduction, root cause, minimal scope, and a planned regression test — recorded for the implementer.

## Stop Conditions

- **Stop** if the bug can't be reproduced and no path to reproduce exists — investigate first.
- **Stop** if no regression test is planned.
- Otherwise proceed to the minimal fix.

## Related

- Agent: the owning engineer + `../agents/test-engineer.md`. Skill: `../skills/bug-investigation`.
