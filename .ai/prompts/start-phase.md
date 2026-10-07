# Prompt: Start Phase

> Tool-neutral starter. Begin an approved phase.

---

Start **phase <#>** of the approved plan (`.ai/projects/current/`, `.ai/templates/PHASE_PLAN.md`).

Before implementing, run `.ai/hooks/before-feature.md`:
- Confirm Gate 4 approval and that this phase's tasks have acceptance criteria.
- Load only the skills this phase needs (`.ai/system/SKILL_SELECTION_RULES.md`).
- If running multiple agents in parallel, confirm **disjoint file ownership** and defined shared contracts (`.ai/agents/multi-agent-execution.md`); otherwise run sequentially.

Then execute the phase's tasks within scope, cover the required test cases (happy / invalid input / error / **authorization denial** / regression), keep the project's `CURRENT_STATUS.md` and current week file in `.ai/projects/current/` current (shape: `.ai/templates/PROGRESS.md` — never edit the template itself), and run `.ai/hooks/after-feature.md` / `after-phase.md` at the boundaries.

Stay in scope. Stop and report if a task exceeds the approved plan or a gate check fails.
