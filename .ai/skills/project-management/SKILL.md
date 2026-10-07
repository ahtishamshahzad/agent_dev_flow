---
name: project-management
description: Use to track an approved project week by week — roadmap, weekly plans, task and bug IDs, status, development/bug/change logs, risks, decisions, and stakeholder or meeting reports in `.ai/projects/current/`. Also handles "fix this bug", "plan next week", "update status", "what are the blockers", and "prepare a weekly/meeting report". Works under project-orchestrator; never bypasses its approval gates.
---

# Project Management

## Purpose

Turn the plan approved by `project-orchestrator` into a living project record: a roadmap, weekly execution plans, every task and bug with an ID and a status, logs of what actually happened, and reports a stakeholder can read. Anyone opening `../../projects/current/` should be able to answer, without asking: what is this project, what phase and week are we in, what is done, in progress, next, blocked, broken, decided, and risky.

The vocabulary — IDs, statuses, priorities, estimates, file layout — is canonical in `../../system/PROJECT_MANAGEMENT_RULES.md`. This skill applies it; it does not restate it.

## When to Use

- After Gate 4 approval, to seed the roadmap, phase files, and the first weeks from the approved phases and tasks.
- A bug is reported ("fix this bug", "X is broken").
- New work arrives mid-project (feature request, change request, client ask).
- Tracking requests: "what should I work on this week", "update project status", "what are the blockers", "what was completed this week", "plan next week".
- Reporting: "prepare weekly report", "prepare meeting report".
- **Not** for producing the plan itself — classification, requirements, architecture, phases, and tasks belong to `project-orchestrator` and `task-planning`. **Not** for diagnosing a bug's cause — that is `bug-investigation`.

## Inputs

- `../../projects/current/` — `CURRENT_STATUS.md` first, then only the files the request needs.
- The approved phases and tasks (Gate 4) and the relevant `../../work-items/` entries.
- The repository and test results — the final word on what is actually done.

## Discovery Questions

Ask only when the answer changes the schedule:
- When does week 1 start, and how much capacity does a week have (people × days)?
- Who owns which areas (or is it one developer)?
- Is there a fixed deadline or milestone the weeks must meet?
- Who reads the reports — client, team, management — and how technical are they?

Without answers, assume one developer, five working days a week starting the next Monday, and no fixed deadline — and write those assumptions into `PROJECT.md`.

## Responsibilities

- Keep `PROJECT.md`, `ROADMAP.md`, `CURRENT_STATUS.md`, `DECISIONS.md`, and `RISKS.md` current.
- Give every task and bug a unique ID; never reuse one; never create a duplicate.
- Schedule tasks into weeks by priority, dependency, and capacity.
- Connect every bug to a task, a week, and the bug ledger.
- Classify mid-project additions and flag `SCOPE CHANGE` when approval is needed.
- Close each week with a review: completed, carried forward, blocked, cancelled.
- Log significant work, bug changes, and scope changes; never delete history.
- Produce weekly and meeting reports in plain business language.
- Reconcile records against the code before reporting anything as done.

## Required Workflow

Each request below is a mode. Run only the mode the request needs.

### 1. First run — set up tracking

1. Inspect the repository (`existing-project-audit` if not already done) and whatever already exists in `../../projects/current/` and `../../work-items/`.
2. If no plan is approved yet → stop and hand to `project-orchestrator`. Tracking starts after Gate 4.
3. Preserve every existing record; extend it. Never overwrite a filled file with a template.
4. Create `PROJECT.md` (`../../templates/PROJECT_BRIEF.md`), `ROADMAP.md` (`../../templates/ROADMAP.md`), and one `phases/PHASE-NN.md` per approved phase.
5. Assign IDs to the approved tasks, estimate them, and record dependencies.
6. Plan `weekly/WEEK-01.md` in detail; leave later weeks as roadmap entries until they are near.
7. Write `CURRENT_STATUS.md` (`../../templates/PROGRESS.md`) and the first `logs/DEVELOPMENT-LOG.md` entry.
8. Where information is missing, write a preliminary plan and mark each assumption.

### 2. Plan a project or a feature

1. If the work has no approved plan, run it through `project-orchestrator` (feature → `feature-planning` → `task-planning`) first.
2. Break approved work into `PHASE → EPIC → TASK`; split anything estimated XL.
3. Order by dependency (typically data → API → client → tests → deploy) and assign each task to a phase and a week.
4. Update `ROADMAP.md`, the affected `PHASE-NN.md` and `WEEK-NN.md` files, and `CURRENT_STATUS.md`.

### 3. Bug intake — "fix this bug"

No code changes until steps 1–8 are done.

1. **Check for a duplicate:** search `logs/BUG-LOG.md` and `../../work-items/bugs/`. If it is already recorded, update that bug — new symptoms, environment, priority — and do not open another.
2. **Open the bug:** next `BUG-NNN`, file at `../../work-items/bugs/BUG-<NNN>.md` (`../../templates/BUG.md`), status `OPEN`, with reporter, environment, platform, expected and actual behavior.
3. **Diagnose:** hand to `bug-investigation` — inspect the code, reproduce, find the root cause, map the affected areas. Record the findings in the bug file.
4. **Prioritize:** P0–P3 by impact (`../../system/PROJECT_MANAGEMENT_RULES.md`); estimate the fix.
5. **Create the fix task:** a `TASK-`/`TECH-` ID that links to the bug, including its regression test.
6. **Schedule it:** add the bug and the task to a week — P0 into the current week, displacing work as `CARRIED_FORWARD`; others by priority and capacity.
7. **Record it:** add a row to `logs/BUG-LOG.md`.
8. **Write the fix plan** in the bug file.
9. **Fix → test → verify:** implement, run the regression test (fails before, passes after), and check nearby behavior. Move the bug through `FIXED` → `VERIFIED` → `CLOSED` only as each is actually true.
10. **Close out:** update the bug file, the week, `BUG-LOG.md`, `DEVELOPMENT-LOG.md`, and `CURRENT_STATUS.md`.

The chain is always: `BUG-NNN → task ID → WEEK-NN → fix → test → verify → closed`, visible in all three of the bug file, the week file, and the ledger.

### 4. New work mid-project — scope change

1. Classify the addition: existing scope · bug · change request · new feature · technical debt · enhancement.
2. Bug → mode 3. Existing scope → track it in the current plan.
3. Otherwise: create tasks, estimate, prioritize, map dependencies, assign a phase and week, and record it in `logs/CHANGE-LOG.md` with the timeline impact.
4. If it changes what Gate 4 approved, flag **`SCOPE CHANGE`**, show the impact, and wait for approval before scheduling it.

### 5. Week planning — "plan next week"

1. Read the current week, items carried forward, open bugs by priority, `ROADMAP.md`, and `RISKS.md`.
2. Order: P0 bugs → carried-forward work → `READY` tasks on the critical path → P1/P2 bugs → the rest by priority.
3. Fill to capacity, respecting dependencies; leave the overflow where it is.
4. Write `weekly/WEEK-NN.md` (`../../templates/WEEK_PLAN.md`): dates, phase, objective, tasks, bugs, deliverables, risks, blockers.
5. Update `CURRENT_STATUS.md`.

### 6. Weekly review — end of week

1. For each task in the week, check the code and tests; set `COMPLETED` only when verified.
2. Mark each unfinished task `CARRIED_FORWARD`, `BLOCKED` (with the blocker), or `CANCELLED` (with the reason). Nothing is silently removed.
3. Review bugs, blockers, and risks; update `RISKS.md`.
4. Recompute progress using the method in the rules.
5. Write `reports/WEEK-NN-REPORT.md` (`../../templates/WEEKLY_REPORT.md`) and update `CURRENT_STATUS.md`.
6. Plan the next week (mode 5).

### 7. Status and questions

- **"Update project status"** — reconcile the records with the code and tests, then rewrite `CURRENT_STATUS.md`.
- **"What should I work on this week?"** — the current week's `READY` and `IN_PROGRESS` items, P0/P1 first, with their dependencies.
- **"What are the blockers?"** — `BLOCKED` tasks, open P0/P1 bugs, and high-severity risks, each with who can unblock it.
- **"What was completed this week?"** — only `COMPLETED` items backed by the week file and `DEVELOPMENT-LOG.md` and present in the code.

Answer from the records; correct a record that disagrees with the code.

### 8. Reports — weekly and meeting

1. Read `PROJECT.md`, `CURRENT_STATUS.md`, `ROADMAP.md`, the current week, recent `DEVELOPMENT-LOG.md` entries, `BUG-LOG.md`, and recent `DECISIONS.md` entries — nothing else.
2. Write for the audience: outcomes, not file names. "Customers can now reset their password" — not "added `/auth/reset` route".
3. Include completed, in progress, bugs fixed and open, blockers, risks, decisions, next week, actions needed from the client or stakeholders, and progress with its method.
4. Weekly → `reports/WEEK-NN-REPORT.md`. Meeting → `meetings/MEETING-NNN.md` (`../../templates/MEETING_NOTES.md`), with agenda items taken from blockers, decisions needed, and stakeholder actions.

### After any significant work session

Append to `logs/DEVELOPMENT-LOG.md` (date, work done, files changed, tests actually run and their results, issues, related task and bug IDs), update the task statuses in the week file, and update `CURRENT_STATUS.md`. This is the project-management half of the `after-feature` and `after-phase` hooks.

## Decision Rules

- No approved plan → hand to `project-orchestrator`; do not invent a roadmap.
- Request is a bug → mode 3 before touching code, every time.
- Addition changes approved scope → `SCOPE CHANGE` and approval; otherwise schedule it.
- A dependency isn't done → schedule the dependent task later, unless both sides can build against an agreed contract.
- A task is estimated XL → split it before scheduling.
- Records disagree with the code → the code wins; fix the record.
- Capacity is unknown → state the assumption; schedule by order, not by date.

## Rules

- Statuses, priorities, IDs, and estimates come only from `../../system/PROJECT_MANAGEMENT_RULES.md`.
- Never create a duplicate task or bug; never reuse an ID.
- Never mark work `COMPLETED`, or a bug `FIXED`/`VERIFIED`, without verification.
- Never invent completed work, test results, dates, or progress.
- Never delete historical logs; correct them with a dated entry.
- Never change scope silently.
- Gates still apply: this skill schedules approved work; it does not approve work.
- Keep files concise — status, IDs, links — not narration (`../../system/TOKEN_OPTIMIZATION_RULES.md`).

## Anti-Patterns

- Scaffolding every file with empty templates on day one.
- One giant week that holds the whole project.
- A bug that exists only in a chat message — no ID, no week, no ledger row.
- Reports that paste the development log.
- Percent-complete numbers with no stated method.
- Quietly dropping an unfinished task at the end of the week.
- Re-planning the whole roadmap every week instead of planning the next one.

## Validation Checklist

- [ ] `CURRENT_STATUS.md` matches the code and tests.
- [ ] Every active task has an ID, status, priority, estimate, dependencies, and a week.
- [ ] Every open bug has a file, a priority, a linked task, a week, and a ledger row.
- [ ] No duplicate IDs and no duplicate bugs.
- [ ] Unfinished tasks from closed weeks are carried forward, blocked, or cancelled — none missing.
- [ ] Scope changes are logged, and flagged where approval is needed.
- [ ] Progress shows its method.
- [ ] Reports are in business language and claim nothing unverified.

## Definition of Done

`../../projects/current/` answers every question in Purpose without a conversation; every task and bug is traceable from roadmap to week to log; and nothing in it claims more than the code and tests show.

## Related Skills

`project-orchestrator` (owns planning and gates), `task-planning` (phase and task mechanics), `feature-planning`, `bug-investigation` (root cause), `request-classification` (the project-tracking type), `documentation` (writing inside `.ai/`), `release-planning` (deployment tasks and Gate 7), `ai-output-review` (catching false completion).

## Related Knowledge

`../../knowledge/product/` (domain language for reports), once populated.

## Related References

None required. Templates: `../../templates/ROADMAP.md`, `WEEK_PLAN.md`, `WEEKLY_REPORT.md`, `MEETING_NOTES.md`, `PROJECT_LOGS.md`, `BUG.md`, `PROGRESS.md`, `PROJECT_BRIEF.md`, `RISK_REGISTER.md`, `DECISION_RECORD.md`.

## Context Loading Guidance

- **Requires:** `../../system/PROJECT_MANAGEMENT_RULES.md` and `CURRENT_STATUS.md`.
- **Does not require:** closed weeks, old reports, closed bugs, or full logs — read the latest entries only.
- **May load:** the current week and roadmap for planning; `bug-investigation` for a bug's diagnosis; the matching template when creating a file.
- **Stop when:** the requested mode's records are updated and consistent — implementation belongs to the specialist skills.

## Token Efficiency Guidance

Start from `CURRENT_STATUS.md`; it should point to everything current. Search for IDs instead of reading whole folders. Read the tail of a log, not all of it. Detail only the current and next week; keep later work at roadmap level.
