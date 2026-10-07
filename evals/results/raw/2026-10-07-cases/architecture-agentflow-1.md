# architecture-agentflow-1

- Arm: **agentflow** · Case: `architecture` · Turns: 13 · Cost: $0.37648519999999996 · 63 s

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

# Tenant data isolation design for your multi-tenant app

**My recommendation:** keep all tenants in one database and one schema, with a `tenant_id` column on every tenant-owned table. Enforce it in two places: the API filters every query by tenant, and PostgreSQL row-level security (RLS) blocks other tenants' rows even if the API has a bug. Don't use a schema or database per tenant. If an enterprise customer's contract requires physical separation, run a separate copy of the whole stack for them as a paid tier.

## The three options at your scale

| | Shared schema + RLS | Schema per tenant | Database per tenant |
|---|---|---|---|
| Objects to manage | 30 tables | ~6,000 tables (200 × 30) | 200 databases |
| Each migration runs | once | 200 times, can partly fail | 200 times, can partly fail |
| Connection pooling | simple | fiddly: per-tenant `search_path` leaks across pooled connections | one pool per database |
| Is the database the enforcer? | yes (RLS) | yes | yes, strongest |
| Running cost for a team of two | low | high | very high |

Schema-per-tenant and database-per-tenant are stronger on paper. In practice, a two-person team is more likely to leak data through a migration that half-applied across 200 tenants, or a pooled connection with the wrong `search_path`, than through a shared table protected by RLS.

## The design

### 1. Data model
- **Sort every table into a category:** tenant-owned (most tables), global (plans, reference data) or cross-tenant (for example users, if one user can belong to several companies). Write the list down and check it in CI (step 6).
- **Tenant-owned tables get `tenant_id uuid NOT NULL`**, which references `tenants`.
- **Composite foreign keys:** a child table references its parent on `(tenant_id, parent_id)`, so a row can't point at another tenant's parent. This is the guard people most often leave out.
- **Unique constraints include `tenant_id`**, for example `(tenant_id, email)`. Indexes start with `tenant_id`.
- **Use UUIDs for public IDs**, not sequential integers, so IDs can't be guessed by counting.

### 2. Database enforcement (RLS)
- On every tenant-owned table, turn RLS on and also force it (`ENABLE` and `FORCE ROW LEVEL SECURITY`). Add one policy: `tenant_id = current_setting('app.tenant_id', true)::uuid`, applied both to rows read (`USING`) and rows written (`WITH CHECK`).
- **It fails closed.** If no tenant is set, the setting is null and the query returns zero rows instead of everyone's data.
- **Database roles:**
  - `app_runtime`: the API's login. It can read and write data but doesn't own the tables and can't bypass RLS.
  - `app_migrator`: owns the tables and can change them. Used only when deploying migrations.
  - A separate cross-tenant role: only for a few internal jobs that genuinely need to see every tenant (such as billing totals). Its use is logged.

### 3. Setting the tenant on each request
- The tenant comes **only from the authenticated session**. If a user can belong to several companies, the company they pick is checked against a membership table. A `tenantId` sent in the request body, query string or headers is never trusted.
- Each request runs inside a transaction that sets the tenant with `set_config('app.tenant_id', $1, true)`. The final `true` limits the setting to that transaction, so it's cleared when the transaction ends. **This matters with connection pooling:** a plain `SET` stays on the connection, and the next request on that connection would inherit the previous tenant.
- In Node, store the tenant per request using `AsyncLocalStorage`. Wrap data access so a query can't run without a tenant context.
- Application code still adds `WHERE tenant_id = …` itself. That helps the query planner and makes intent clear. RLS is the backstop.

### 4. Background work and admin tools
- Every job carries a `tenant_id` and sets it the same way requests do. Jobs that cover all tenants loop through tenants one at a time instead of bypassing RLS.
- When support staff access a customer's data, that is an explicit, logged permission, not a query with the filter left off.

### 5. Data outside PostgreSQL
These are where leaks usually happen in practice:
- **File storage:** object keys start with the tenant ID, and download links are signed only after the tenant check passes.
- **Caches and search indexes:** keys include the tenant ID.
- **Exports, emails and webhooks:** each generated in the tenant's context.
- **Logs:** include `tenant_id`, never personal data.

### 6. Proving it works
- **Cross-tenant tests for each endpoint:**
  - Tenant A requests Tenant B's record by ID → 404.
  - A `tenantId` in the request body is ignored.
  - Updates and deletes are covered as well as reads.
- **Database tests:**
  - A query with no tenant set returns zero rows.
  - Inserting a row with another tenant's `tenant_id` is rejected.
- **A CI check against PostgreSQL's catalog:** every table either has `tenant_id` with RLS enabled and forced, or is on the approved list of global tables. A new table can't quietly skip isolation.

## What to tell enterprise customers
You can honestly say:

> "Your data is logically isolated. Every record is tagged to your organization, and access is enforced both by our application and by database-level row security policies, so a defect in application code still can't return another customer's rows. Data is encrypted in transit and at rest, and cross-customer access tests run on every release."

Don't claim physical separation: backups and infrastructure are shared, and you should say so if asked. If a customer contractually needs a dedicated environment or data in a specific region, offer a separate copy of the whole stack as a priced tier rather than redesigning for all 200 tenants.

## Questions before this is final
1. **Which data layer are you using (Prisma, Drizzle, Knex or raw `pg`)?** It decides how the per-transaction tenant setting gets wired in. That's straightforward with Drizzle or Knex and fiddlier with Prisma.
2. **Can one user belong to more than one company?**
3. **How are database connections pooled** (PgBouncer, a managed provider, or the app's own pool)?
4. **Has any enterprise customer *contractually* required physical separation or data residency,** or have they only asked about it?

## Process note
Under `.ai/`, this design is the architecture stage (Gate 3). Two things it depends on aren't recorded yet:
- Your approval of the applications and stack isn't written down in `.ai/projects/current/`.
- No Gherkin scenarios exist for isolation behaviour yet.

The scenarios would be the cross-tenant cases in step 6, marked `@critical` so they block release. I can draft those scenarios and record the approval and this design in `.ai/projects/current/` for you to sign off. I haven't written any files or code.
