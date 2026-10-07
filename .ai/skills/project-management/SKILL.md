---
name: project-management
description: Use after plan approval to track work week by week in `.ai/projects/current/` — roadmap, weekly plans, task/bug IDs, bug intake, scope changes, logs, and weekly/meeting reports. Never bypasses approval gates.
---

# Project Management

## Purpose

Turn the plan approved by `project-orchestrator` into a living record — roadmap, weekly plans, every task and bug with an ID and status, logs of what happened, reports a stakeholder can read — so `../../projects/current/` answers without a conversation: what is this, which phase and week, what is done, in progress, next, blocked, broken, decided, and risky.

Vocabulary and file layout are canonical in `../../system/PROJECT_MANAGEMENT_RULES.md`; this skill applies them.

## When to Use

- After Gate 4, to set up tracking; a bug is reported; new work arrives mid-project; a status, week-planning, or report request; another workflow produced findings, steps, a release, or an incident to record.
- **Not** for producing the plan (`project-orchestrator`, `task-planning`) or diagnosing a bug (`bug-investigation`).

## Inputs

`CURRENT_STATUS.md` first, then only the files the mode needs. The repository and test results are the final word on what is done.

## Discovery Questions

Only when the answer changes the schedule: week-1 start and weekly capacity; who owns which areas; fixed deadlines; who reads the reports.

## Responsibilities

Keep the tracking files current · unique IDs, no duplicates · schedule by priority, dependency, capacity · link every bug to a task, week, and ledger row · flag `SCOPE CHANGE` · close each week with a review · log work; never delete history · report in business language · reconcile records with the code.

## Required Workflow

**Load only the mode the request needs:**

| Request | Mode file |
|---------|-----------|
| First run after Gate 4 · plan a project or feature | [`modes/setup-and-planning.md`](modes/setup-and-planning.md) |
| "Fix this bug" · a bug found during other work | [`modes/bug-intake.md`](modes/bug-intake.md) |
| New request, change request, client ask | [`modes/scope-change.md`](modes/scope-change.md) |
| "Plan next week" · end-of-week review | [`modes/weekly.md`](modes/weekly.md) |
| Status questions · weekly or meeting report | [`modes/reports.md`](modes/reports.md) |
| Output of a review, audit, refactor, migration, release, incident | the table in `../../system/PROJECT_MANAGEMENT_RULES.md` (recording work) |

**After any significant work session:** append to `logs/DEVELOPMENT-LOG.md` (date, work, files, tests actually run and results, issues, task/bug IDs), update task statuses in the week file, update `CURRENT_STATUS.md`.

## Decision Rules

- No approved plan → hand to `project-orchestrator`; don't invent a roadmap. Bugs are the exception (untracked path).
- A bug → bug intake before touching code, every time.
- Addition changes approved scope → `SCOPE CHANGE` and approval; otherwise schedule it.
- Dependency not done → schedule later, unless both sides build against an agreed contract.
- XL estimate → split before scheduling. Unknown capacity → state the assumption; order, don't date.
- Records disagree with the code → the code wins; fix the record.

## Rules

- Statuses, priorities, IDs, estimates only from the rules file. Never reuse an ID or duplicate a task or bug.
- Never mark `COMPLETED`, `FIXED`, or `VERIFIED` without verification; never invent work, results, dates, or progress.
- Logs are append-only. Scope never changes silently. This skill schedules approved work; it approves nothing and writes no fixes.

## Anti-Patterns

Empty scaffolds on day one · one giant week · a bug that lives only in chat · reports that paste the log · percentages without a method · silently dropped tasks · re-planning the whole roadmap weekly.

## Validation Checklist

- [ ] `CURRENT_STATUS.md` matches the code and tests.
- [ ] Every active task: ID, status, priority, estimate, dependencies, week. Every open bug: file, priority, task, week, ledger row.
- [ ] No duplicate IDs or bugs; nothing from a closed week missing.
- [ ] Scope changes logged and flagged; progress shows its method; reports claim nothing unverified.

## Definition of Done

`../../projects/current/` answers every question in Purpose; every task and bug is traceable roadmap → week → log; nothing claims more than the code and tests show.

## Related Skills

`project-orchestrator`, `task-planning`, `feature-planning`, `bug-investigation`, `request-classification`, `release-planning`, `ai-output-review`.

## Related Knowledge

`../../knowledge/product/` (domain language for reports), once populated.

## Related References

Templates: `../../templates/ROADMAP.md`, `WEEK_PLAN.md`, `WEEKLY_REPORT.md`, `MEETING_NOTES.md`, `PROJECT_LOGS.md`, `BUG.md`, `PROGRESS.md`, `PROJECT_BRIEF.md`, `RISK_REGISTER.md`.

## Context Loading Guidance

- **Requires:** `CURRENT_STATUS.md` and the one mode file. The rules file when creating or changing IDs, statuses, or priorities.
- **Does not require:** other modes, closed weeks, old reports, closed bugs, full logs.
- **Stop when:** the mode's records are updated and consistent.

## Token Efficiency Guidance

One mode per request. Search for IDs instead of reading folders; read the tail of a log; detail only the current and next week.
