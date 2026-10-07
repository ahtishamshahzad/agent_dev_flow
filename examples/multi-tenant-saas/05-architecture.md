# 5 — Architecture

> **Status: PROPOSED.** Fictional example. Stage: `architecture-design`, `repository-architecture`.

```
 Mobile (Expo) ──┐                          ┌── Worker (BullMQ): PDFs, image thumbnails, Stripe events
   SQLite outbox │  HTTPS + bearer token    │
 Web (Next.js) ──┼──────────► API (NestJS) ─┼── PostgreSQL (Prisma) — every tenant table has org_id
                 │            TenantGuard   │
 Stripe ─────────┘ webhooks   RoleGuard     └── Object storage (private) ← signed upload/download URLs
```

## Tenancy — the decision everything else depends on

- Every tenant-owned row carries `org_id`. The API resolves the caller's organisation **from the session, never from the request body or URL**.
- A `TenantGuard` scopes every query through a repository layer that requires `orgId`; there is no un-scoped query path for tenant tables.
- **Second line:** PostgreSQL row-level security on tenant tables, with the org set per transaction. A missed check in code fails closed in the database.
- Storage keys are prefixed `org/<org_id>/…`; signed URLs are issued only after the same tenant and role check.

## Modules (API)

`auth` · `orgs` (members, invites, roles) · `jobs` · `templates` · `inspections` (+ sync) · `media` · `reports` · `billing` (Stripe customer, subscription, seat sync, webhooks).

## Offline sync

Mobile writes every change to a local outbox with a client-generated ID. Sync sends the outbox in order; the API applies each change **idempotently** by that ID, so a retried request after a dropped connection cannot create a duplicate (N2). Photos upload separately with resumable, signed uploads; an inspection is complete on the server only when all its photos are confirmed.

## Cross-cutting

- **Errors:** one error shape across the API; mobile maps it to retry / fix / contact-admin.
- **Config:** env validated at boot; the app refuses to start on a missing secret.
- **Seats:** inviting or deactivating an inspector updates the Stripe subscription quantity; a webhook confirms it.

## Repository

```
apps/mobile  apps/web  apps/api  apps/worker
packages/schemas   # zod schemas shared by clients and API
packages/api-types
docs/<app>/…       # product docs (application-documentation)
```
