# 1 — Request and classification

> **Status: PROPOSED.** Fictional example. Stage: `request-classification`.

## The request, verbatim

> We run building-inspection crews. Inspectors use paper checklists and phone photos, and the office retypes everything. I want an app inspectors use on site — it has to work in basements with no signal — and a web dashboard where managers assign jobs, review reports, and export PDFs for clients. We'd like to sell it to other inspection companies too, charging per inspector per month.

## Classification

- **Primary type:** new project.
- **Secondary:** none yet. Selling to other companies makes this multi-tenant from day one — a requirement, not a separate request.
- **Workflow:** `.ai/workflows/new-project.md`, all gates; Gates 2 and 4 need user approval.

## Questions that block the plan (asked)

1. Offline: must inspectors be able to *start* a new inspection offline, or only finish one already downloaded? → *Start and finish offline; sync later.*
2. Payments: card billing self-serve, or invoiced manually? → *Self-serve card billing.*
3. Data: any regulated personal data beyond names and site addresses? → *Photos may show people and licence plates.*

Everything else proceeds on stated assumptions (see 02).
