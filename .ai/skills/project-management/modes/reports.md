# Mode: status questions · weekly and meeting reports

Part of `../SKILL.md`.

## Status questions

Answer from the records; correct any record that disagrees with the code.

- **"Update project status"** — reconcile the records with the code and tests, then rewrite `CURRENT_STATUS.md`.
- **"What should I work on this week?"** — the current week's `READY` and `IN_PROGRESS` items, P0/P1 first, with their dependencies.
- **"What are the blockers?"** — `BLOCKED` tasks, open P0/P1 bugs, and high-severity risks, each with who can unblock it.
- **"What was completed this week?"** — only `COMPLETED` items backed by the week file and `DEVELOPMENT-LOG.md` and present in the code.

## Weekly and meeting reports

1. Read `PROJECT.md`, `CURRENT_STATUS.md`, `ROADMAP.md`, the current week, recent `DEVELOPMENT-LOG.md` entries, `BUG-LOG.md`, and recent `DECISIONS.md` entries — nothing else.
2. Write for the audience: outcomes, not file names. "Customers can now reset their password" — not "added `/auth/reset` route".
3. Include completed, in progress, bugs fixed and open, blockers, risks, decisions, next week, actions needed from the client or stakeholders, and progress with its method.
4. Weekly → `reports/WEEK-NN-REPORT.md` (`../../../templates/WEEKLY_REPORT.md`). Meeting → `meetings/MEETING-NNN.md` (`../../../templates/MEETING_NOTES.md`), with agenda items taken from blockers, decisions needed, and stakeholder actions.
