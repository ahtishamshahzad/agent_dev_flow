# architecture-baseline-1

- Arm: **baseline** · Case: `architecture` · Turns: 1 · Cost: $0.1121248 · 40 s

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

# Tenant isolation design

## Recommendation

Keep all tenants in one database and one schema. Every tenant-owned row carries a `tenant_id`. PostgreSQL Row-Level Security (RLS) enforces the separation, and the application checks it too.

Design it so you can later move a single tenant to its own database without changing the schema or the code. Only do that when a customer pays for it.

## Why this model fits your size

| Option | 200 tenants × 30 tables | Verdict |
|---|---|---|
| **Database per tenant** | 200 databases to migrate, back up, monitor and pool connections for | Too much ops work for two people |
| **Schema per tenant** | About 6,000 tables. Migrations run 200 times and can fail partway through. Catalog bloat. Cross-tenant reporting is painful | All the work of separate databases for only a small isolation gain |
| **Shared tables + `tenant_id` + RLS** | One migration, one pool, one backup | **Pick this.** The risk is a leaked row, and RLS addresses that |

The real threat is not someone breaking into your database. It's one missing `WHERE tenant_id = ?` in one of hundreds of queries. RLS turns that kind of bug from "shows another customer's data" into "returns no rows".

## How it works

### 1. Data model rules

- Every tenant-owned table has `tenant_id NOT NULL` with a foreign key to `tenants`. Keep an explicit, short list of truly global tables (plans, currencies, feature definitions). Everything else is tenant-scoped by default.
- Unique constraints include `tenant_id`, e.g. `(tenant_id, email)` rather than just `email`.
- Use composite foreign keys between tenant tables: `(tenant_id, project_id)` references `projects(tenant_id, id)`. The database then refuses to link tenant A's invoice to tenant B's project. People often skip this, and it matters.
- `tenant_id` comes first in composite indexes. This also keeps RLS fast.
- Use UUIDs for public IDs. That's not a security control on its own, but it stops ID enumeration and makes probing for other tenants' records pointless.

### 2. Database enforcement

- Turn on RLS **and** `FORCE ROW LEVEL SECURITY` on every tenant table. Without `FORCE`, the table owner bypasses the policies.
- Each policy compares `tenant_id` to a per-transaction setting (`app.tenant_id`). Include `WITH CHECK` so inserts and updates can't write rows into another tenant.
- Fail closed: if the setting is missing, the policy matches nothing, so you get zero rows rather than every row.
- Use three separate roles:
  - **app_user**: what the API connects as. It doesn't own the tables and has no `BYPASSRLS`.
  - **migrator**: owns the schema and runs migrations only.
  - **admin/ops**: has `BYPASSRLS`. Use it only for audited internal tooling and cross-tenant jobs such as billing rollups, never from request handlers.
- Known ways around RLS:
  - Views run with their owner's rights unless created with `security_invoker` (PostgreSQL 15+).
  - `SECURITY DEFINER` functions bypass it.
  - Superuser connections bypass it.

  Ban all three in the app path, or review each one explicitly.

### 3. Application layer

- The tenant comes **only** from the authenticated session or token. Never take it from a URL, a request body or a header the client controls.
- Request middleware opens a transaction and sets the tenant with `SET LOCAL` (transaction-scoped). This matters with connection pooling. A plain session-level `SET` stays on the pooled connection, and the next request on that connection runs as the previous tenant. That is the most likely serious bug in this design.
- All data access goes through one helper that does "run in tenant context", so handlers can't grab a raw connection.
- Keep the explicit `tenant_id` filters in queries anyway. Then the app and the database each enforce separation independently, and the query planner gets the filter too.
- Background jobs, queues, cron jobs and webhooks must carry `tenant_id` in the job payload and set the same context. This is where teams usually forget.

### 4. Everything outside Postgres

RLS only protects Postgres. Apply the same rule elsewhere:
- **File storage:** a per-tenant prefix (`tenants/{id}/…`), short-lived signed URLs, and a check that the object belongs to the tenant before signing.
- **Caches** (Redis etc.): tenant ID in every key.
- **Search indexes and analytics exports:** filter by tenant.
- **Logs and error tracking:** don't log other tenants' payloads, and keep error messages from echoing data.

### 5. Proving it works (makes the enterprise answer credible)

- **CI catalog check:** a test queries `pg_catalog` and fails the build if any non-allowlisted table lacks `tenant_id`, RLS enabled, or `FORCE`. This catches the "someone added table 31 and forgot" case automatically.
- **Cross-tenant tests:** seed tenants A and B. Acting as A, request B's resources by ID through every endpoint and expect 404, not 403 (so you don't confirm the record exists).
- **Pool test:** run concurrent requests for different tenants on a tiny pool and assert there's no leakage.
- An audit log for anything that uses the bypass role.

### 6. Room to grow for enterprise customers

- Add a `tenant → database connection` lookup now, even though every tenant points to the same database at first. If an enterprise customer later needs (and pays for) a dedicated instance, you copy their rows out by `tenant_id`, point the lookup at the new database, and nothing else changes.
- Because every row has `tenant_id`, per-tenant data export and deletion are simple queries. Enterprise contracts and GDPR requests will ask for both.
- Defer per-tenant encryption keys, separate regions and similar until a contract requires them.

## What to tell the enterprise customers

Be accurate. Don't overclaim:

> "Customer data is logically isolated. Every record is tagged to your organization, and isolation is enforced by the database itself (PostgreSQL row-level security), not just by application code, so a bug in a query cannot return another customer's data. Automated tests verify this on every release. Data is encrypted in transit and at rest. Dedicated database instances are available on request."

**Don't say "physically separated"** unless it's true for that customer. Security questionnaires will ask about this precisely, and a wrong answer causes far more trouble than an honest "logical isolation".

## Tradeoffs you're accepting

- **Noisy neighbours:** one heavy tenant can slow the others. Handle it with per-tenant rate limits and query timeouts, and use the dedicated-instance path if needed.
- **One shared failure domain:** a bad migration affects everyone. It's also only one migration to test.
- **RLS has sharp edges:** pooling, view ownership, `SECURITY DEFINER`. The CI check and the role separation above exist for these.

**My assumption:** the app isn't built yet, or is early. If you already have tables without `tenant_id` or code using a superuser connection, tell me and I'll sketch a migration path. That changes the order of the work, not the target design.
