# Mode: plan the week · review the week

Part of `../SKILL.md`. Vocabulary: `../../../system/PROJECT_MANAGEMENT_RULES.md`.

## Plan next week

1. Read the current week, items carried forward, open bugs by priority, `ROADMAP.md`, and `RISKS.md`.
2. Order: P0 bugs → carried-forward work → `READY` tasks on the critical path → P1/P2 bugs → the rest by priority.
3. Fill to capacity, respecting dependencies; leave the overflow where it is.
4. Write `weekly/WEEK-NN.md` (`../../../templates/WEEK_PLAN.md`): dates, phase, objective, tasks, bugs, deliverables, risks, blockers.
5. Update `CURRENT_STATUS.md`.

## Review the week (end of week)

1. For each task in the week, check the code and tests; set `COMPLETED` only when verified.
2. Mark each unfinished task `CARRIED_FORWARD`, `BLOCKED` (with the blocker), or `CANCELLED` (with the reason). Nothing is silently removed.
3. Review bugs, blockers, and risks; update `RISKS.md`.
4. Recompute progress using the method in the rules.
5. Write `reports/WEEK-NN-REPORT.md` (`reports.md`) and update `CURRENT_STATUS.md`.
6. Plan the next week (above).
