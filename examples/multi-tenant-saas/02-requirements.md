# 2 — Requirements

> **Status: PROPOSED.** Fictional example. Stage: `requirements-analysis` · template `REQUIREMENTS.md`.

## Users

| User | Needs |
|---|---|
| Inspector | Today's jobs on the phone; fill checklists; take photos; work offline; sync without losing anything |
| Manager | Assign jobs; review and sign off; export a client-ready PDF |
| Company admin | Invite and remove users, set roles, manage the subscription and seats |
| Platform operator (us) | See tenants and billing health; never see tenant data by default |

## Functional

- F1 Organisations (tenants) with users invited by email; roles: admin, manager, inspector.
- F2 Jobs: site, checklist template, assignee, due date, status.
- F3 Checklist templates per organisation; inspections fill them in.
- F4 Photo capture attached to checklist items, with on-device compression.
- F5 Offline: download assigned jobs, complete them, queue changes and photos, sync on reconnect.
- F6 Manager review: comment, request changes, sign off; sign-off locks the inspection.
- F7 PDF report export of a signed-off inspection.
- F8 Seat-based subscription: card billing, seat count = active inspectors, trial, failed-payment grace period.

## Non-functional

- N1 **Tenant isolation:** no request can read or write another organisation's data — enforced on the server.
- N2 **No lost work offline:** a completed inspection survives app restarts and syncs exactly once.
- N3 Photos: up to 200 per inspection; uploads resume after interruption.
- N4 PDF export of a 200-photo inspection within 60 s.
- N5 Personal data in photos: access-controlled storage, no public URLs, deletion on request.

## Confirmed · Assumptions · Open questions

| Confirmed (from the user) | Assumptions (stated, not asked) | Open (non-blocking) |
|---|---|---|
| Offline start and finish | Up to ~50 tenants and ~1,000 inspectors in year one | Single sign-on for larger customers? |
| Self-serve card billing | English only at launch | Data residency requirements for EU customers? |
| Photos may contain people | iOS and Android both required | Client-facing portal for the end customer? |
| Sell to other companies | Managers use the web dashboard; inspectors mainly use mobile | |

## Out of scope (v1)

Client portal · SSO · custom report designer · marketing site (see 03).
