# Example — FieldNotes, a multi-tenant SaaS

> **Status: PROPOSED.** A fictional project, planned end to end to show what each pipeline stage produces. No code exists; gate approvals are simulated.

**FieldNotes** (invented for this example) lets inspection companies send inspectors to sites with a mobile app, capture checklists and photos — offline if needed — and review, sign off, and export reports from a web dashboard. Each company is a tenant paying per seat.

It is deliberately broad, so one example touches every pack: mobile, web, backend, database, auth and roles, subscriptions, media, security, testing, and deployment.

## The lifecycle, one file per stage

| # | Stage | File | Skill(s) behind it |
|---|---|---|---|
| 1 | Request + classification | [`01-request.md`](01-request.md) | `request-classification` |
| 2 | Requirements | [`02-requirements.md`](02-requirements.md) | `requirements-analysis` |
| 3 | Application selection | [`03-application-selection.md`](03-application-selection.md) | `application-selection` |
| 4 | Stack decision — **Gate 2** | [`04-stack-decision.md`](04-stack-decision.md) | `stack-recommendation` + pack selection skills |
| 5 | Architecture | [`05-architecture.md`](05-architecture.md) | `architecture-design`, `repository-architecture` |
| 6 | Phase plan + tasks — **Gate 4** | [`06-phases-and-tasks.md`](06-phases-and-tasks.md) | `task-planning`, `gherkin-specifications` |
| 7 | Testing strategy | [`07-testing-strategy.md`](07-testing-strategy.md) | `testing-strategy`, `testing-selection` |
| 8 | Security review plan | [`08-security-review.md`](08-security-review.md) | `threat-modeling`, `security-review` |
| 9 | Tracking: roadmap + week 1 | [`09-tracking-week-01.md`](09-tracking-week-01.md) | `project-management` |
| 10 | Release checklist | [`10-release-checklist.md`](10-release-checklist.md) | `release-planning` |

In a real project these live in `.ai/projects/current/` under the names the templates give them (`REQUIREMENTS.md`, `ROADMAP.md`, `weekly/WEEK-01.md`, …). They are numbered here so the example reads in order.

## What to notice

- **Assumptions are written down**, not silently made (02).
- **Applications are chosen one by one** — the marketing site is deferred, not scaffolded "just in case" (03).
- **The database is paired with a data layer**, never compared against one (04).
- **Tenant isolation is designed in, then attacked** in the threat model (05, 08).
- **Acceptance criteria are Gherkin scenarios**, including authorization denial (06).
- **Tests are chosen by risk**, not by coverage percentage (07).
- **A change request in week 1 is caught as a SCOPE CHANGE**, not absorbed (09).
