# Mode: set up tracking · plan a project or feature

Part of `../SKILL.md`. Vocabulary: `../../../system/PROJECT_MANAGEMENT_RULES.md`.

## First run — set up tracking

1. Inspect the repository (`existing-project-audit` if not already done) and whatever already exists in `../../../projects/current/` and `../../../work-items/`.
2. If no plan is approved yet → stop and hand to `project-orchestrator`. Tracking starts after Gate 4. (Bugs are the exception: they are recorded from day one — `bug-intake.md`.)
3. Preserve every existing record; extend it. Never overwrite a filled file with a template.
4. Create `PROJECT.md` (`../../../templates/PROJECT_BRIEF.md`), `ROADMAP.md` (`../../../templates/ROADMAP.md`), and one `phases/PHASE-NN.md` per approved phase.
5. Assign IDs to the approved tasks, estimate them, and record dependencies. Import bugs and work items recorded before tracking began — open bugs get a fix task and a week; nothing is renumbered.
6. Plan `weekly/WEEK-01.md` in detail (`weekly.md`); leave later weeks as roadmap entries until they are near.
7. Write `CURRENT_STATUS.md` (`../../../templates/PROGRESS.md`) and the first `logs/DEVELOPMENT-LOG.md` entry.
8. Where information is missing, write a preliminary plan and mark each assumption.

Without answers to the discovery questions, assume one developer, five working days a week starting the next Monday, and no fixed deadline — and write those assumptions into `PROJECT.md`.

## Plan a project or a feature

1. If the work has no approved plan, run it through `project-orchestrator` (feature → `feature-planning` → `task-planning`) first.
2. Break approved work into `PHASE → EPIC → TASK`; split anything estimated XL.
3. Order by dependency (typically data → API → client → tests → deploy) and assign each task to a phase and a week.
4. Update `ROADMAP.md`, the affected `PHASE-NN.md` and `WEEK-NN.md` files, and `CURRENT_STATUS.md`.
