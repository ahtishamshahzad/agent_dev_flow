# architecture-baseline-3

- Arm: **baseline** · Case: `architecture` · Turns: 1 · Cost: $0.056362800000000005 · 28 s
- Project files (besides installed `.ai/`): none

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

# Recommendation

**Use one shared database and schema. Put `tenant_id` on every tenant-owned table, and have PostgreSQL enforce isolation with Row-Level Security (RLS). Keep app-level scoping as a second layer.** Keep the option to move a specific customer to a dedicated database later, but don't build that now.

## Why not the alternatives

- **Schema-per-tenant** means about 200 × 30 = 6,000 tables. Every migration runs 200 times, and connection pooling and catalog bloat get awkward. For a team of two, that is permanent operational drag.
- **Database-per-tenant** gives the strongest isolation story, but it means 200 databases to migrate, back up, monitor and pool. It is too costly at this size, and it's hard to justify before a customer actually requires it.
- **Shared schema with only `WHERE tenant_id = ?` in app code** is cheap, but one forgotten filter is a cross-tenant breach. That is exactly the failure enterprise customers worry about. RLS removes that class of bug.

## Design

**1. Schema**
- `tenant_id NOT NULL` on every tenant-owned table, including child tables. Denormalize it rather than reaching it through joins.
- Use composite keys, `UNIQUE (tenant_id, id)` on parents and composite foreign keys `(tenant_id, parent_id)` on children. The database then can't link a row in tenant A to a row in tenant B.
- Put `tenant_id` in every unique constraint, and lead indexes with it.
- Keep a short, explicit list of global tables, such as plans and reference data. These get no tenant data.

**2. RLS**
- Enable and `FORCE` RLS on every tenant table. The policy is `tenant_id = current_setting('app.tenant_id', true)::uuid`. An unset value yields NULL, so the policy returns no rows and fails closed.
- Use separate Postgres roles:
  - The **app role** doesn't own the tables, isn't a superuser, and has no `BYPASSRLS`.
  - The **migration role** owns the tables.
  - An **admin/ops role** is used only for deliberate, audited cross-tenant work.

**3. Request flow (the part that usually goes wrong)**
- Derive the tenant from the authenticated session or token. Never take it from a URL or body parameter.
- Every request runs inside a transaction that does `set_config('app.tenant_id', …, true)`, which is the same as `SET LOCAL`. Don't use session-level `SET`. With a connection pool, especially PgBouncer in transaction mode, a session-level value leaks to the next request.
- Put this in one shared data-access wrapper. Route handlers should not be able to get a raw connection without a tenant context.
- Background jobs, queue workers, webhooks and cron need the same explicit tenant context. Carry `tenant_id` in the job payload and set it the same way.

**4. Leaks outside the database**
RLS only protects Postgres, so the same discipline applies to everything else that holds tenant data:
- Cache keys and any search index get a tenant prefix or filter.
- File storage uses per-tenant prefixes and short-lived signed URLs.
- Logs, error trackers and analytics must not mix tenant data in ways support staff can casually browse.
- Exports, reports and emails go through the same tenant-scoped path.
- Support or admin impersonation needs an audit trail.

**5. Verification**
- A CI check queries the catalog and fails if any table lacks `tenant_id`, RLS enabled and forced, or a policy.
- Automated two-tenant tests seed tenants A and B, then try to read and write B's data as A. Cover each API endpoint and each background job.
- Test with the production app role. If tests run as a superuser, they bypass RLS and prove nothing.
- Do a periodic manual review of the global-table list and the admin role's usage.

**6. Operational protections**
- Per-tenant rate limits and `statement_timeout`, so one tenant can't degrade the others.
- A tenant-scoped delete path for offboarding, and a documented answer for single-tenant restore. This is the weak spot of a shared database. Backups are whole-database, so per-tenant restore means restoring to a scratch instance and extracting the tenant's rows.

## What to tell the enterprise customers

The honest wording is: *"Tenant data is logically isolated. Isolation is enforced by the database itself through row-level security, not just by application code. We test it automatically, and all access is audited."* Most customers accept that, particularly with SOC 2 or similar evidence behind it.

For the few who require physical isolation, offer a **dedicated database as a paid tier**. To keep that cheap later, store a `database_id` (or connection config) on the tenant record. Resolve the connection through a single function. The schema is already identical per tenant, so moving one customer is a copy-by-`tenant_id` plus a routing change. Don't build the routing now, but don't hard-code a single global connection either.

## Decisions I'd make now
1. Shared schema plus forced RLS plus composite foreign keys.
2. Per-transaction tenant context through a single wrapper.
3. Separate owner, app and admin roles.
4. CI catalog check and cross-tenant tests as release gates.
5. Defer dedicated-database support, but keep connection resolution behind one function.

## Open questions that could change this
- Any data-residency or regional requirements? Those push toward per-region deployments.
- Do any customers require customer-managed encryption keys? That would need per-tenant key design.
- Do you need heavy cross-tenant analytics? If so, build it on a separate, deliberately designed path rather than loosening RLS.

If you agree with this direction, the next step is to write the policy template, the data-access wrapper design and the CI check, in that order.
