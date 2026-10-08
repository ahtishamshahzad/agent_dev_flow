# architecture-baseline-1

- Arm: **baseline** · Case: `architecture` · Turns: 1 · Cost: $0.1117168 · 34 s
- Project files (besides installed `.ai/`): none

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

# Tenant data isolation design

## Recommendation

Keep all tenants in one database and one schema. Every tenant-owned table gets a `tenant_id` column, and PostgreSQL Row-Level Security (RLS) enforces the separation inside the database. The app also filters by tenant, so there are two independent layers.

With 200 tenants, 30 tables and two engineers, this is the only option you can run safely. It also lets you tell enterprise customers something true: the database itself blocks one customer from reading another's rows, even if the application has a bug.

## Why not the alternatives

| Model | Isolation | Cost for your team | Verdict |
|---|---|---|---|
| Database per tenant | Strongest | 200 databases to migrate, back up, monitor and pool connections for | Too much for two people. Offer it later as a paid tier. |
| Schema per tenant | Medium | About 6,000 tables, every migration runs 200 times, catalog bloat, a schema can get stuck halfway through a migration | Most of the cost of separate databases, with only a little more isolation than RLS |
| **Shared schema + RLS** | Good, enforced by the database | One schema, one migration, one pool | **Do this** |
| Shared schema, app filtering only | Weak | Cheapest | One missed `WHERE tenant_id` leaks data. Not acceptable for this question. |

## How it works

**1. Data model**
- Every tenant-owned table has `tenant_id NOT NULL`, and indexes start with it.
- Composite keys stop rows from pointing at another tenant's rows. Give each table `UNIQUE (tenant_id, id)`, and have foreign keys reference `(tenant_id, parent_id)`. This takes a minute per table now and is painful to add later.
- Unique constraints are scoped to the tenant: `UNIQUE (tenant_id, email)`, not `UNIQUE (email)`.
- Use UUIDs rather than sequential IDs, so IDs don't reveal how many records exist and can't be guessed.
- Global tables (plans, feature flags) are marked as global on purpose. If a user can belong to more than one company, use a `memberships` table. Decide that now.

**2. RLS policies**
- Each tenant table has `ENABLE` and `FORCE ROW LEVEL SECURITY` and a policy of the form `tenant_id = current_setting('app.tenant_id')`.
- Write the policy so it fails closed: if no tenant is set, queries return no rows rather than all rows.
- The app connects as a role that does **not** own the tables and does **not** have `BYPASSRLS`. RLS doesn't apply to table owners or superusers, and most failed RLS setups fail for this reason.

**3. Request flow (Node)**
- Middleware takes the tenant from the authenticated session or token, never from a URL or request body the client controls.
- Each request runs inside a transaction that starts with `SET LOCAL app.tenant_id = …`. `SET LOCAL` matters because pooled connections are reused. A plain `SET` would carry one tenant's ID into the next request on that connection. `SET LOCAL` also works safely with PgBouncer in transaction mode.
- Hide the raw database pool behind a helper like `withTenant(tenantId, fn)` so normal code can't skip it.
- Keep the explicit `WHERE tenant_id = …` in queries as well. It helps the query planner and means you have two layers.

**4. Controlled bypass**
- Use a separate admin/migration role with `BYPASSRLS` for migrations, support tooling and cross-tenant analytics. It has its own credentials, isn't used by the API, and its use is logged.
- Background jobs carry `tenant_id` in the job payload and go through the same `withTenant` path.
- Check every view and function: views need `security_invoker`, and `SECURITY DEFINER` functions skip RLS.

**5. Everything outside Postgres** (this is where leaks usually happen)
- Cache keys start with the tenant ID.
- File storage uses per-tenant prefixes, and signed URLs are checked against the tenant.
- Search indexes, exports, emails, webhooks and logs are all tenant-aware. Don't log one tenant's data where support staff could see it under another tenant's context.

**6. Proving it**
- An automated test creates two tenants and checks that tenant A gets zero results for B's data on every endpoint, including by guessing IDs.
- A CI check fails if any table has no `tenant_id` and RLS policy and isn't on the explicit list of global tables.
- Audit logs record who accessed which tenant, especially through the bypass role.

## Performance

At this size RLS adds almost no overhead if:
- indexes start with `tenant_id`, and
- policies are written so the setting is read once per query, not once per row.

If one huge tenant later slows things down for others, partition by `tenant_id` or move that tenant to its own database. Neither needs a redesign.

## What to tell enterprise customers

> "Your data is logically isolated in a shared database. Every query is restricted to your organization by database-level row security, independent of application code, and we test cross-tenant isolation automatically. Data is encrypted in transit and at rest, and administrative access is restricted and audited."

Don't call it "physically separated." If a customer needs that by contract, offer a **dedicated database tier** at a premium price. To keep that option cheap, look up the database connection through a per-tenant routing layer from day one, even though every tenant points to the same database for now. Per-tenant encryption keys belong in that premium conversation, not the default design.

## Decide before writing code

1. Can a user belong to more than one tenant? This shapes the auth and memberships model.
2. Do you need any cross-tenant features (internal analytics, shared catalogs)? Each one needs its own explicit design.
3. Are you using PgBouncer or a managed pooler? It needs transaction mode with `SET LOCAL`, as described above.
4. Is there already code or a schema? If so, adding `tenant_id` and RLS to existing tables needs a migration plan.
