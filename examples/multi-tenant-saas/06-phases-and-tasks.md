# 6 — Phases and tasks (Gate 4)

> **Status: APPROVED (simulated).** Fictional example. Stage: `task-planning`. Phases come from this project's dependencies — not a template.

## Phases

| Phase | Goal | Depends on | Exit criteria |
|---|---|---|---|
| PHASE-01 Foundation | Monorepo, CI, API skeleton, database with tenancy, auth, invites | — | A user can sign up, create an org, invite a member; cross-tenant access is denied by test |
| PHASE-02 Jobs and templates | Managers create templates and assign jobs on the web | 01 | A manager assigns a job that only the assignee and their org can see |
| PHASE-03 Mobile capture + offline | Inspectors complete jobs with photos, offline | 01, 02 | An inspection completed in airplane mode syncs exactly once with all photos |
| PHASE-04 Review and reports | Sign-off, locking, PDF export | 03 | A signed-off inspection exports a PDF of 200 photos in < 60 s |
| PHASE-05 Billing | Per-seat subscriptions, trial, grace period | 01 | Seat count follows active inspectors; a failed payment starts the grace period |
| PHASE-06 Hardening and release | Security review, load, store submission, production | 01–05 | Gate 6 and Gate 7 pass |

PHASE-05 only depends on 01, so it can run in parallel with 02–04 if a second developer is available: disjoint files (`apps/api/src/billing`, `apps/web/app/billing`) against the `orgs` contract.

## Sample tasks (PHASE-01)

| ID | Task | Priority | Estimate | Depends on |
|---|---|---|---|---|
| TECH-001 | pnpm monorepo, lint, CI running validate + tests | P1 | M | — |
| TECH-002 | PostgreSQL + Prisma schema: orgs, users, memberships; `org_id` on tenant tables | P0 | M | TECH-001 |
| TECH-003 | Row-level security policies + per-transaction org setting | P0 | L | TECH-002 |
| FEAT-001 | Sign up, log in, create organisation | P0 | L | TECH-002 |
| FEAT-002 | Invite member by email; accept invite; roles | P1 | L | FEAT-001 |
| TECH-004 | TenantGuard + RoleGuard; scoped repository layer | P0 | M | FEAT-001 |

### Acceptance criteria — TECH-004 (Gherkin)

```gherkin
Scenario: A member reads a job in their own organisation
  Given Ana is an inspector in Acme
  And job J1 belongs to Acme and is assigned to Ana
  When Ana requests job J1
  Then she receives job J1

Scenario: A member cannot read another organisation's job by ID
  Given Ben is a manager in Brightline
  And job J1 belongs to Acme
  When Ben requests job J1 by its ID
  Then the response is "not found"
  And no data from job J1 is returned

Scenario: An inspector cannot assign jobs
  Given Ana is an inspector in Acme
  When Ana tries to assign job J2 to another inspector
  Then the request is refused as forbidden
  And job J2's assignee is unchanged
```

Cross-tenant reads return "not found", not "forbidden", so IDs from other organisations can't be probed.

**Gate 4 — phases + tasks:** approved (simulated). Tracking starts in 09.
