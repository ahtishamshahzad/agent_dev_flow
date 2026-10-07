# Project Management Rules

The shared vocabulary and bookkeeping rules for tracking a project once it is planned: IDs, statuses, priorities, estimates, weekly execution, bugs, logs, and reports. Every skill that creates or updates a task or bug uses these — not its own variant. Applied by `../skills/project-management`.

Project management **records and schedules** the work the pipeline approved (`ORCHESTRATION_WORKFLOW.md`). It never replaces a gate: scheduling an approved task into a week needs no new approval; adding scope does (§Scope changes).

## Where it lives

All project-management state is project data, so it lives with the active project — never in `system/` or `skills/`.

```
.ai/projects/current/
├── PROJECT.md            # what and why — brief, stack, platforms, team, dates, links
├── ROADMAP.md            # phases → epics → task IDs, with status
├── CURRENT_STATUS.md     # where we are now — phase, week, progress, gates, next
├── DECISIONS.md          # index of ADR-NNN records (../templates/DECISION_RECORD.md)
├── RISKS.md              # risk register (../templates/RISK_REGISTER.md)
├── phases/PHASE-NN.md    # one per phase (../templates/PHASE_PLAN.md)
├── weekly/WEEK-NN.md     # one per week (../templates/WEEK_PLAN.md)
├── reports/WEEK-NN-REPORT.md   # stakeholder report (../templates/WEEKLY_REPORT.md)
├── meetings/MEETING-NNN.md     # one per meeting (../templates/MEETING_NOTES.md)
└── logs/
    ├── DEVELOPMENT-LOG.md   # append-only session log
    ├── BUG-LOG.md           # the single bug ledger
    └── CHANGE-LOG.md        # scope and plan changes (not a release changelog)

.ai/work-items/bugs/BUG-NNN.md  # one per bug (../templates/BUG.md)
```

Create a file the first time it has something true to say; do not scaffold empty files. Log formats: `../templates/PROJECT_LOGS.md`.

## IDs

| Prefix | For | Example |
|--------|-----|---------|
| `TASK-` | general task | `TASK-001` |
| `FEAT-` | feature task | `FEAT-001` |
| `TECH-` | technical task (infra, refactor, tooling, debt) | `TECH-001` |
| `DEPLOY-` | deployment/release task | `DEPLOY-001` |
| `BUG-` | bug | `BUG-001` |
| `ADR-` | decision | `ADR-001` |
| `RISK-` | risk | `RISK-001` |
| `PHASE-` / `WEEK-` | phase / week, two digits | `PHASE-02`, `WEEK-07` |
| `MEETING-` | meeting | `MEETING-001` |

- Three digits, zero-padded, sequential per prefix. Next ID = highest existing + 1 — find it by searching, never by guessing.
- **IDs are never reused**, including for cancelled or deleted work.
- One task has one ID for its whole life; carrying it to another week keeps the ID.

## Task status

Exactly these values — no others:

`BACKLOG` · `PLANNED` · `READY` · `IN_PROGRESS` · `BLOCKED` · `IN_REVIEW` · `TESTING` · `COMPLETED` · `CANCELLED` · `CARRIED_FORWARD`

- `READY` — dependencies done, acceptance criteria written, can start.
- `BLOCKED` — always names the blocker and who can unblock it.
- `COMPLETED` — acceptance criteria met **and verified** (`TASK_GENERATION_RULES.md`). Unverified work stays `TESTING` or `IN_REVIEW`.
- `CARRIED_FORWARD` — the status in the *old* week; the task appears in the new week with its real status.

## Bug status

`OPEN` → `IN_PROGRESS` → `FIXED` (code changed, regression test passes) → `VERIFIED` (confirmed in the environment where it was reported) → `CLOSED`. Also `DUPLICATE` (points to the original) and `WONT_FIX` (with reason).

## Priority

Used for tasks and bugs alike:

| Priority | Meaning | Bug examples |
|----------|---------|--------------|
| **P0** | Critical / production blocker | production down, data loss, security vulnerability, payments or auth fully broken |
| **P1** | High | major feature broken, significant production issue, large user impact |
| **P2** | Normal | functional bug with limited impact or a workaround |
| **P3** | Low / nice to have | cosmetic, minor UX, small improvement |

A P0 preempts the current week: it is scheduled into the current week immediately and the displaced work is recorded as carried forward.

## Estimates

| Size | Effort |
|------|--------|
| XS | < 2 hours |
| S | 2–4 hours |
| M | 4–8 hours |
| L | 1–2 days |
| XL | 3+ days |

- An XL task is a signal to split, not an estimate to keep. Split until each piece is L or smaller.
- Estimates are effort, not dates. Do not promise a completion date unless capacity and dependencies are known; give a range and its assumptions instead.

## Hierarchy and dependencies

`PROJECT → PHASE → EPIC → TASK → SUBTASK`. Small projects skip epics; phases are always dynamic (`PHASE_GENERATION_RULES.md`).

- Every task lists `Depends on:` task IDs (or `none`).
- A task is not scheduled into a week before the week that completes its dependencies, unless the two can genuinely run in parallel against an agreed contract — say which contract.

## Weekly execution

- Weeks are numbered from the project's first planned week (`WEEK-01`) and run on fixed dates recorded in the week file.
- A week holds only work that fits its capacity; the rest stays in later weeks or `BACKLOG`.
- **Every bug in progress appears in a week.** A bug with no week is unscheduled, and the status report says so.
- **Weekly review closes every week** (`../skills/project-management`): each task ends the week as `COMPLETED`, `CARRIED_FORWARD`, `BLOCKED`, or `CANCELLED` (with reason). Nothing is silently dropped.

## Progress

Overall progress is **derived, not asserted**: the sum of estimate weights of `COMPLETED` tasks over the sum for all non-cancelled tasks in the roadmap (XS=1, S=2, M=4, L=8, XL=16). State the method next to the number. If the roadmap is incomplete, say the percentage covers only planned work.

## Scope changes

Behavior not covered by an approved Gherkin scenario is the trigger (`GHERKIN_RULES.md`, scope control). When new work arrives mid-project, classify it first: existing scope · bug · change request · new feature · technical debt · enhancement.

- Existing scope or bug → track normally.
- Anything else → create the task(s), estimate, prioritize, map dependencies, assign phase and week, record it in `logs/CHANGE-LOG.md`, and state the timeline impact.
- If it changes what was approved at Gate 4 (new capability, displaced commitments, or moved dates), flag it **`SCOPE CHANGE`** and get approval before scheduling it. Never fold it silently into a current task.

## Recording work from every workflow

A project is **tracked** once `CURRENT_STATUS.md` exists in `../projects/current/`. On a tracked project, every workflow — and every skill, including domain-pack skills invoked directly — records its output here. No work happens outside a task ID.

| Work | Records |
|------|---------|
| Feature, domain-skill build work | Done under its existing `FEAT-`/`TASK-` ID; status in the week file, a development-log entry |
| Bug | Bug intake (`../skills/project-management`): `BUG-NNN`, priority, fix task, week, `BUG-LOG.md` row |
| Code / security / performance / testing review or audit finding | **Confirmed defect** → bug intake (Critical/High security finding → P0/P1). **Suggestion or gap** → a `TECH-` task in `BACKLOG`, scheduled only if accepted. Nothing is fixed off the record. |
| Refactor | `TECH-` tasks, one per reversible step or group of steps |
| Migration | `TECH-` tasks per step; the cutover as a `DEPLOY-` task |
| Release, deployment | A `DEPLOY-` task in the week; the outcome in the development log; the release in that week's report |
| Incident | A P0/P1 bug for the cause; postmortem action items as tasks; `RISKS.md` updated |
| New or changed scope | Classified per §Scope changes; `CHANGE-LOG.md`; `SCOPE CHANGE` where it alters Gate 4 |

### Untracked projects

Without `CURRENT_STATUS.md` there are no weeks or roadmap to schedule into, and none are invented. A scoped bug fix still follows `../workflows/bugfix.md` (Gates 5–6) and does **not** need full planning first:

- The bug still gets its `BUG-NNN.md` file and a row in `logs/BUG-LOG.md` (create the log if absent) — the duplicate check works from day one.
- The fix-task and week steps are skipped; the bug file notes "untracked project".
- Review findings, refactors, and releases keep their usual work items and reports; nothing else is required.
- Adopting tracking later (`../skills/project-management`, first run) imports the open bugs and work items into the roadmap.

## What is true

When records disagree, trust in this order: **code → tests → `CURRENT_STATUS.md` → week files → roadmap → older logs.** A task marked `COMPLETED` whose code is not in the repository is not complete — correct the record, don't repeat the claim.

## History

- Logs are append-only. Correct a wrong entry with a new dated entry; never delete history.
- Closed weeks, bugs, reports, and meetings are not edited except to add a dated correction.
- Never record work, tests, or results that did not happen. Unrun checks are written as "unverified until run" (`OPERATING_RULES.md`).

## Related

`ORCHESTRATION_WORKFLOW.md` (where tracking sits in the pipeline), `TASK_GENERATION_RULES.md` (what a task contains), `PHASE_GENERATION_RULES.md`, `QUALITY_GATES.md`, `DOCUMENTATION_RULES.md`.
