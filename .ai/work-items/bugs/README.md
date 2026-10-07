# `.ai/work-items/bugs/` — Bugs

Bug work items: defects to diagnose and fix without regressing behavior.

## Typical shape

1. **Audit** — gather symptoms, environment, affected area.
2. **Reproduction** — a reliable repro (or explicit note if not reproducible).
3. **Root cause** — the actual cause, not the symptom.
4. **Fix** — minimal, behavior-preserving except for the defect.
5. **Regression test** — a test that pins the bug so it can't return (`../../system/TESTING_SELECTION_RULES.md`).
6. **Release validation** — verify in the relevant build/environment.

## Each bug records

One file per bug, `BUG-NNN.md`, from `../../templates/BUG.md`:

- ID, title, P0–P3 priority, status, reporter, environment, platform.
- Repro steps and root-cause finding; affected areas.
- The fix task ID, the week it is scheduled in, and the regression test.

Before opening a bug, search for an existing one — a duplicate is updated, not re-opened (`../../skills/project-management`, bug intake).

## Index

The bug ledger is `logs/BUG-LOG.md` in `../../projects/current/` once a project is tracked — one row per bug, kept there rather than here so there is a single index. _No bugs yet._
