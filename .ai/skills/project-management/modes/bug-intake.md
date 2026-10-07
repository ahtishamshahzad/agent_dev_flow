# Mode: bug intake — "fix this bug"

Part of `../SKILL.md`. Vocabulary: `../../../system/PROJECT_MANAGEMENT_RULES.md`.

No code changes until steps 1–8 are done. On an **untracked project** (no `CURRENT_STATUS.md`), run steps 1–4, 7, 8, and 9 and skip 5–6 — the bug is still recorded and fixed under `../../../workflows/bugfix.md`, without sending it through full planning.

1. **Check for a duplicate:** search `logs/BUG-LOG.md` and `../../../work-items/bugs/`. If it is already recorded, update that bug — new symptoms, environment, priority — and do not open another.
2. **Open the bug:** next `BUG-NNN`, file at `../../../work-items/bugs/BUG-<NNN>.md` (`../../../templates/BUG.md`), status `OPEN`, with reporter, environment, platform, expected and actual behavior.
3. **Diagnose:** hand to `bug-investigation` — inspect the code, reproduce, find the root cause, map the affected areas. Record the findings in the bug file. Then check for a duplicate again, by **root cause**: two reports with different symptoms may be one bug — mark the newer `DUPLICATE` of the older and merge the symptoms.
4. **Prioritize:** P0–P3 by impact; estimate the fix.
5. **Create the fix task:** a `TASK-`/`TECH-` ID that links to the bug, including its regression test.
6. **Schedule it:** add the bug and the task to a week — P0 into the current week, displacing work as `CARRIED_FORWARD`; others by priority and capacity.
7. **Record it:** add a row to `logs/BUG-LOG.md`.
8. **Write the fix plan** in the bug file.
9. **Fix → test → verify:** hand the fix to the owning domain skill under `../../../workflows/bugfix.md` — regression test first (fails before, passes after), then the minimal fix, then `code-review`. This skill does not write the fix; it tracks it. Move the bug through `FIXED` → `VERIFIED` → `CLOSED` only as each is actually true.
10. **Close out:** update the bug file, the week, `BUG-LOG.md`, `DEVELOPMENT-LOG.md`, and `CURRENT_STATUS.md`.

The chain is always `BUG-NNN → task ID → WEEK-NN → fix → test → verify → closed`, visible in the bug file, the week file, and the ledger.
