# 3 — Application selection

> **Status: PROPOSED.** Fictional example. Stage: `application-selection` · rules `APPLICATION_SELECTION_RULES.md`.

Each candidate decided on its own merits — nothing is scaffolded by default.

| Application | Decision | Why |
|---|---|---|
| Mobile app (inspectors) | **Needed** | Camera, offline storage, and on-site use (F4, F5) |
| Web dashboard (managers, admins) | **Needed** | Assignment, review, export, billing (F2, F6–F8) — a desk task |
| Customer-facing public web app | **Not needed** | No end-customer portal in v1 |
| Marketing site | **Deferred** | Selling starts after the first pilot; a static page can come later without touching the product |
| Backend API | **Needed** | Shared by both clients; enforces tenancy and roles (N1) |
| Background worker | **Needed** | PDF generation (N4), image processing, billing webhooks — work that must not block requests |
| Real-time service | **Not needed** | Sync on reconnect and polling cover review status; no live collaboration |
| Database | **Needed** | Relational: tenants, users, jobs, inspections |
| File storage | **Needed** | Photos and PDFs (N3, N5) |
| Shared packages | **Needed, small** | API types and validation schemas shared by mobile, web, and API |

**Approval:** goes to Gate 2 together with the stack (04).
