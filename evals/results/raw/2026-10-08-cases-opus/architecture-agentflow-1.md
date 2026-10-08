# architecture-agentflow-1

- Arm: **agentflow** · Case: `architecture` · Turns: 7 · Cost: $0.2605304 · 46 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

# Tenant data isolation: recommended design

I classified this as an **architecture decision** for an approved stack. I found no `CURRENT_STATUS.md`, so there's no recorded project state yet. I haven't written any code or files.

## Recommendation

**Keep every tenant in one shared database and one shared schema, with a `tenant_id` column on every tenant-owned table. Enforce the separation in two places: the application, and PostgreSQL Row-Level Security (RLS) as a safety net.**

### Why this option

| Option | Separation | Cost for a team of 2 with 200 tenants | Verdict |
|---|---|---|---|
| **Shared schema + `tenant_id` + RLS** | Logical, enforced by the database | One schema and one migration path to run | **Choose this** |
| Schema per tenant | Logical, but each request must switch to the right schema | 200 schemas × 30 tables = **6,000 tables**. Every migration runs 200 times, and partial failures leave tenants on different versions | Only slightly safer, at a much higher running cost |
| Database per tenant | Physical | 200 databases to back up, monitor, migrate and pool connections for | Too much to run, except as a paid enterprise option (see below) |

Schema-per-tenant also adds less safety than it seems. The app connects with the same database role either way, so one bug in choosing the schema leaks data just as a missing `WHERE` would. RLS gives similar protection without running 200 copies of the schema.

## The design

**1. Data model**
- Every tenant-owned table gets `tenant_id NOT NULL`, using the same key type as `tenants.id`. Global reference data (e.g. countries, plan definitions) goes in clearly separate tables with no `tenant_id`.
- **Composite foreign keys:** child tables reference `(tenant_id, id)` rather than just `id`. The database then cannot store an order in tenant A that points at a customer in tenant B. This is cheap to add on day one and hard to add later.
- Unique constraints include the tenant, e.g. `UNIQUE (tenant_id, email)` rather than `UNIQUE (email)`.
- Indexes start with `tenant_id`. This keeps queries fast and makes RLS checks cheap.

**2. Application layer (first line of defense)**
- The tenant always comes from the **authenticated session**. Never take it from the request body, URL or headers. If users can belong to several tenants, check the chosen tenant against a membership table on every request.
- All tenant-data queries go through one shared data-access layer that is tenant-aware. Ad-hoc queries without a tenant should be impossible, or at least obvious in review.

**3. Database layer (second line of defense: RLS)**
- Turn on `ENABLE` and `FORCE ROW LEVEL SECURITY` on every tenant table. Each table gets a policy along the lines of `tenant_id = current_setting('app.tenant_id', true)::uuid`.
- Set the tenant for each transaction with `SET LOCAL` / `set_config(..., true)`. The setting then can't carry over to the next request on a pooled connection, which also works with PgBouncer in transaction mode.
- **If no tenant is set, the query returns no rows rather than all of them.**
- Use separate database roles:
  - The **app role** doesn't own the tables and has no `BYPASSRLS`.
  - A **migration role** owns the schema.
  - A narrow, audited **admin role** handles support and cross-tenant operations. Admin access is a deliberate path, not a side effect.
- Known RLS gaps to close:
  - Table owners and superusers bypass RLS, which is why the app role must not own the tables.
  - Views need `security_invoker = true`.
  - `SECURITY DEFINER` functions need review.

**4. Paths that are easy to miss**
- **Background jobs, queues and cron:** jobs carry an explicit `tenant_id` and open a tenant-scoped transaction. Never run them as the admin role by default.
- **Caches, file storage and search indexes:** include the tenant in every key or path, e.g. `tenant/<id>/...`. Signed URLs must check the tenant.
- **Exports, reports, analytics and logs:** tag them with the tenant, and keep other tenants' data out of error messages.

**5. Proving it works**
This is what you'll actually show enterprise customers.
- **Cross-tenant tests** for every endpoint and job: tenant A's user can't read, update, delete or reference tenant B's data, and a tenant ID supplied by the client is ignored.
- **A CI check against the live schema** that fails if any table has `tenant_id` but no RLS policy, or has neither and isn't on the global allowlist.
- An audit log of admin and support access to tenant data.

**6. Upgrade path for enterprise customers (deferred)**
Because every row carries `tenant_id`, you can later move one enterprise tenant to its own database by copying its rows. Offer that as a **priced tier** only if a contract truly needs physical separation. Don't build it now.

## What to tell customers who ask

> "Your data is logically isolated within our shared infrastructure. Every record is tagged with your organization. Isolation is enforced twice: in our application, and by PostgreSQL row-level security at the database layer, so a single application bug can't expose another customer's data. Automated tests check this on every release. Admin access is restricted and audited. Dedicated infrastructure is available on request."

Don't say "physically separated" or "fully separate databases" unless you sell the dedicated tier. Customers often check those claims in security questionnaires.

## Before implementation (per `.ai/` gates)

Tenant isolation is observable behavior, so it needs **approved Gherkin scenarios** first. I'd propose a small `@critical` set:
- Cross-tenant read, update and delete are denied.
- A tenant ID supplied by the client is ignored.
- A request with no tenant context returns no data.
- A background job only touches its own tenant's data.
- Cross-tenant foreign-key references are rejected.
- Admin access to tenant data is audited.

**Questions that affect the design:**
1. **Users in several tenants:** can one user belong to more than one tenant? This decides whether you need the membership table and a tenant-switching flow.
2. **Data layer:** which ORM or query layer will you use? Prisma, Drizzle and raw SQL wire up per-transaction tenant setting differently.
3. **Contract requirements:** do any enterprise customers need data residency, per-tenant encryption keys, or dedicated infrastructure? That would bring the dedicated tier forward.
4. **Existing code:** is anything already built? If so, I'd audit it before these changes.

If you approve this direction, my next step is to draft the scenarios and record this decision in `.ai/projects/current/`.
