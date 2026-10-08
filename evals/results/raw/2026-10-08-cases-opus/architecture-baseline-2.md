# architecture-baseline-2

- Arm: **baseline** · Case: `architecture` · Turns: 1 · Cost: $0.11069680000000001 · 34 s
- Project files (besides installed `.ai/`): none

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

# Tenant isolation design

## Recommendation

Keep all tenants in **one database and one schema**. Put a `tenant_id` column on every table that holds tenant data. Enforce isolation in two places:

1. **In the app:** a data-access layer that adds tenant scoping to every query.
2. **In the database:** PostgreSQL Row-Level Security (RLS) as a backstop.

Also plan a paid way to move a large customer onto its own database later. Don't build it now.

## Why this model

| Option | Isolation | Cost for a team of two |
|---|---|---|
| Database per tenant | Strongest | 200 databases to migrate, back up, monitor and pool connections for. Not realistic. |
| Schema per tenant | Strong | About 6,000 tables. Every migration runs 200 times and can partly fail. Connection pools and the query planner suffer. Very painful to run. |
| **Shared schema + `tenant_id` + RLS** | Strong if built well | One migration, one backup. Uses standard Postgres features. Scales well past 200 tenants. |

The main risk with a shared schema is a developer forgetting a `WHERE tenant_id = ?`. RLS removes most of that risk, because the database refuses to return other tenants' rows even when the app code is wrong.

## The design

**1. Data model**
- Every tenant-owned table gets `tenant_id NOT NULL`.
- Keep a short, explicit list of truly global tables (such as plans and feature definitions). Everything else counts as tenant-owned.
- Use **composite foreign keys that include `tenant_id`**, e.g. `(tenant_id, project_id) → projects(tenant_id, id)`. Then a tenant A invoice can't point to a tenant B customer, even through a bug. This is often missed.
- Unique constraints and most indexes should start with `tenant_id`. For example, an email should be unique per tenant, not across all tenants.
- Use UUIDs (v7 if you want them time-ordered) for public IDs, so record IDs can't be guessed.

**2. Database enforcement (RLS)**
- Turn on `ENABLE` and `FORCE ROW LEVEL SECURITY` for every tenant table. Each policy is `tenant_id = current_setting('app.tenant_id')::uuid`.
- The app connects as a **role that doesn't own the tables**, isn't a superuser and doesn't have `BYPASSRLS`. Migrations run under a separate owner role.
- Set the tenant per transaction with `SET LOCAL` (or `set_config(..., true)`), never per session. This keeps it safe with connection pooling, including PgBouncer in transaction mode. Otherwise a pooled connection can carry one tenant's context into another tenant's request.
- **Fail closed:** if the tenant setting is missing, the query returns nothing or errors. It must never fall back to "all tenants".
- Create views with `security_invoker = true` (Postgres 15+). Otherwise a view runs with its owner's rights and skips RLS.

**3. Application layer**
- The tenant comes from the authenticated session or token, **never from request parameters**.
- One middleware opens the transaction and sets the tenant. Route handlers get a tenant-scoped database handle and can't reach a raw pool.
- App-side scoping still matters even with RLS: errors are clearer, query plans are better, and you aren't relying on a single layer.

**4. The parts people forget**
- **Background jobs and queues:** every job carries a `tenant_id` and runs through the same tenant-scoped handle.
- **Caches, file storage and search:** cache keys and object paths are prefixed with the tenant, e.g. `s3://bucket/{tenant_id}/...`. Signed URLs are short-lived.
- **Internal admin and support tools:** use a separate role that is allowed to see across tenants, with audit logging. Don't let the main app role do this.
- **Logs and analytics exports:** include the tenant, and check that exports are filtered.

**5. Proving it works**
- A CI check queries the Postgres system catalog and **fails the build if any table that isn't on the global list lacks `tenant_id` or an RLS policy**. This is what keeps the design intact as the schema grows past 30 tables.
- Automated cross-tenant tests: create tenants A and B, then for each endpoint check that A can't read, update or reference B's data.
- Optionally, a small sample of production queries logged with their tenant for audits.

## What to tell the enterprise customers

Be accurate and avoid overclaiming. Something like:

> "Your data is logically isolated. Every record is tied to your organization. Isolation is enforced by the database itself through PostgreSQL Row-Level Security, on top of checks in the application, and it is verified by automated tests on every release. Data is encrypted in transit and at rest."

Don't say "physically separated". If a customer needs that, offer a **dedicated database as a paid tier**. Because every row already carries `tenant_id`, moving one tenant's data out is mostly a scripted export, so you can sell it later without designing it now. Per-tenant encryption keys are similar: wait until a contract requires them.

If these customers will send security questionnaires, SOC 2 will probably come up next, and this design gives you solid answers for that.

## Questions before building

1. Does any customer have a **data residency** requirement (for example, EU-only)? That would push toward separate regional deployments instead of one shared database.
2. Is there regulated data (healthcare data under HIPAA, payment card data under PCI) in any table? That changes the encryption and audit requirements.
3. Which hosting and pooling setup are you using (RDS, Supabase, PgBouncer)? It affects how the tenant setting is applied per transaction.

If the answers are "no / no / standard", I'd go ahead with the design above. The first step would be the data-access layer and the CI check, before the schema grows.
