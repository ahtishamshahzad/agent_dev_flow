# architecture-agentflow-2

- Arm: **agentflow** · Case: `architecture` · Turns: 11 · Cost: $0.30225219999999997 · 53 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

## Recommendation

Keep all tenants in one shared schema. Put a `tenant_id` on every tenant-owned row, and have **PostgreSQL row-level security (RLS) enforce isolation inside the database**, with application-level scoping on top of it. Don't use schema-per-tenant or database-per-tenant now. Design so that one large customer could later be moved to its own database if a contract requires it.

## Why this option

| Option | Isolation strength | Cost for a 2-person team at 200 tenants × 30 tables |
|---|---|---|
| Shared tables, app-level `WHERE tenant_id = …` only | Weak: one missed filter leaks data | Lowest |
| **Shared tables + RLS** | **Strong: the database enforces it even if app code has a bug** | **Low: one schema, one migration path** |
| Schema per tenant | Strong | 6,000 tables, 200× migrations, `search_path` problems with connection pooling, catalog bloat |
| Database per tenant | Strongest (physical) | 200 databases to migrate, back up, monitor and pool. Not realistic for two people |

App-level filtering alone fails in the usual way: someone eventually writes a query without the filter. RLS moves the guarantee into the database, where one mistake no longer causes a leak. Per-schema and per-database isolation add a lot of operational work for a small security gain at this size.

## The design

**1. Data model**
- Every tenant-owned table gets `tenant_id NOT NULL`, with a foreign key to `tenants`. Global tables like plans or countries are listed explicitly as exceptions.
- **Composite foreign keys** `(tenant_id, id)` between tenant tables. A tenant-A invoice then can't reference a tenant-B customer even by mistake.
- Unique constraints include `tenant_id`, e.g. `UNIQUE (tenant_id, email)`.
- Indexes start with `tenant_id`. This also keeps the RLS filter cheap.
- UUIDs instead of sequential IDs, so record IDs can't be guessed.

**2. Database enforcement**
- Each tenant table gets `ENABLE` and `FORCE ROW LEVEL SECURITY`. Its policy checks `tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid`, for both reads and writes (`USING` + `WITH CHECK`).
- **It fails closed:** if no tenant context is set, queries return no rows instead of all rows.
- Three separate roles:
  - **app runtime role:** not the table owner, no `BYPASSRLS`, no DDL.
  - **migration role:** owns the schema.
  - **admin/ops role:** may bypass RLS, used only by audited internal tooling.

**3. Setting the tenant per request (where most implementations go wrong)**
- The tenant always comes from the **authenticated session** and is checked against the user's membership. It is never taken from a request body or a header the client controls.
- Each request runs in a transaction that starts with `SET LOCAL app.tenant_id = …` (or `set_config(..., true)`). It must be *local to the transaction* so a pooled connection can't carry one tenant's context into the next request. This also works with PgBouncer in transaction mode.
- All data access goes through one helper, such as `withTenant(tenantId, fn)`. Nothing queries the pool directly.

**4. Places data can leak outside the database**
- **Background jobs and queues:** every job carries `tenant_id` and opens its own tenant-scoped transaction.
- **Cache keys** start with the tenant ID. **File storage** uses a per-tenant prefix and short-lived signed URLs, checked before signing.
- **Search indexes, exports, analytics, logs:** each is scoped or redacted per tenant.
- **API responses:** another tenant's resource returns **404, not 403**, so the API doesn't reveal that it exists.

**5. Proving it works (this is also your answer to enterprise customers)**
- **A CI check against the Postgres catalog** fails the build if any table has `tenant_id` but no RLS enabled and forced, or has no policy. New tables can't silently skip isolation.
- **Cross-tenant tests:** a fixture with tenants A and B. For each endpoint and job, B tries to read, update, delete and reference A's data, and all attempts must fail.
- **A test with tenant context unset** must return zero rows.

**6. Future option for one customer (don't build it now)**
Because every row carries `tenant_id` and all access goes through one helper, a single enterprise customer could later get a **dedicated database** with the same schema, chosen per tenant at connection time. Treat it as a paid tier if a contract truly requires physical separation.

## What to tell enterprise customers

Be accurate and don't overclaim:

> "Your data is logically isolated. Every record belongs to your organization, and the database itself enforces that requests can only see your organization's records, independently of application code. Isolation is covered by automated tests on every release. Infrastructure (the database server and backups) is shared and encrypted in transit and at rest. A dedicated database is available if your requirements call for physical separation."

Don't say "physically separated" unless you build the dedicated-database option.

## Questions that would change the design
1. **Can one user belong to several companies?** If yes, we need an active-tenant switch that is checked against membership.
2. **Do you need internal support/admin tooling that sees all tenants?** That decides how much we build around the bypass role and its audit trail.
3. **Has any enterprise customer contractually required physical isolation or data residency?** If so, the dedicated-database option becomes a requirement now.
4. **Which data layer and pooler are you using?** Some ORMs make the per-transaction `SET LOCAL` awkward, so this needs checking against the versions you have installed.

## Process status
- Per the project's `.ai/` process, tenant isolation is observable behavior, so it needs **approved Gherkin scenarios** before tasks. I'd draft them next:
  - cross-tenant read, update and reference are denied
  - other tenants' resources return 404
  - no tenant context returns nothing
  - jobs stay in their own tenant
- Nothing has been written to `.ai/projects/current/`, which has no `CURRENT_STATUS.md` yet. Once you approve the approach, I'll record it there as the tenant-isolation decision.
- I haven't checked these Postgres features against your specific Postgres version. RLS and `FORCE` are long-standing features, but I'll confirm the details against the docs for your version before implementation.
