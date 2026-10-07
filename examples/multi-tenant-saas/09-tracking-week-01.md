# 9 — Tracking: roadmap and week 1

> **Status: PROPOSED.** Fictional example. Stage: `project-management`. Real files: `ROADMAP.md`, `weekly/WEEK-01.md`, `logs/CHANGE-LOG.md` in `.ai/projects/current/`. No week has actually been worked; nothing below is marked complete.

## Roadmap (excerpt)

| Phase | Weeks (estimate) | Status |
|---|---|---|
| PHASE-01 Foundation | WEEK-01 → WEEK-02 | PLANNED |
| PHASE-02 Jobs and templates | WEEK-03 → WEEK-04 | PLANNED |
| PHASE-03 Mobile capture + offline | WEEK-04 → WEEK-07 | PLANNED |
| PHASE-04 Review and reports | WEEK-07 → WEEK-08 | PLANNED |
| PHASE-05 Billing | WEEK-05 → WEEK-06 (parallel if a 2nd developer) | PLANNED |
| PHASE-06 Hardening and release | WEEK-09 → WEEK-10 | PLANNED |

Assumption: one developer, five days a week. Weeks are an ordering with ranges, not promised dates.

## WEEK-01

- **Phase:** PHASE-01 · **Objective:** a user can sign up and create an organisation on a tenancy-safe schema.
- **Capacity:** 1 developer × 5 days (assumed).

| ID | Task | Priority | Estimate | Depends on | Status |
|---|---|---|---|---|---|
| TECH-001 | Monorepo + CI | P1 | M | — | READY |
| TECH-002 | Schema with `org_id` | P0 | M | TECH-001 | PLANNED |
| TECH-003 | Row-level security | P0 | L | TECH-002 | PLANNED |
| FEAT-001 | Sign up, log in, create org | P0 | L | TECH-002 | PLANNED |

FEAT-002 (invites) and TECH-004 (guards) go to WEEK-02: they depend on FEAT-001, and the week is full.

## A change request arrives mid-week

> *Client:* "Can managers also get an SMS when an inspection is submitted?"

1. **Classified:** new feature — not in the approved scope.
2. **Tasks:** FEAT-010 SMS provider integration (M), FEAT-011 notification preferences per manager (S).
3. **Impact:** about 1.5 days; a new third-party integration and a new kind of personal data (phone numbers); moves PHASE-04 later by roughly a day.
4. **`SCOPE CHANGE`** — it changes what Gate 4 approved, so it goes back to the user with that impact. It is **not** added to WEEK-01 or folded into another task.
5. **Logged** in `CHANGE-LOG.md` as *requested, awaiting approval*.
