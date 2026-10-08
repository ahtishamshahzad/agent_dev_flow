# architecture-baseline-1

- Arm: **baseline** · Case: `architecture` · Turns: 1 · Cost: $0.0457308 · 23 s
- Project files (besides installed `.ai/`): none

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

# Recommendation: shared schema, `tenant_id` on every table, enforced by Postgres Row-Level Security

## Why this model
With 200 tenants, 30 tables and two engineers, the main risk is operational burden and human error, not scale.

| Option | Verdict |
|---|---|
| **Shared schema + `tenant_id` + RLS** | **Chosen.** One migration path, cheap to run, and isolation is enforced by the database rather than by every query being written correctly. |
| Schema per tenant | Rejected. 200 × 30 means about 6,000 tables. Migrations must run 200 times with partial-failure states. Connection and catalog bloat. It's more work than RLS and isolates no better. |
| Database per tenant | Not the default. It's the strongest isolation, but 200 databases to migrate, back up, monitor and pool is too much for two people. Keep it as an escape hatch (see below). |

Application-layer filtering alone (`WHERE tenant_id = ?` everywhere) is not enough. One forgotten clause in one query is a cross-tenant leak, and that is the incident enterprise customers are asking about.

## The design

**1. Schema rules**
- Every tenant-owned table gets `tenant_id NOT NULL`, indexed (usually as the leading column of the main composite indexes).
- Foreign keys between tenant tables are composite, `(tenant_id, id)`, so a row in tenant A can't reference a row in tenant B. This closes a leak path RLS alone doesn't.
- Use UUIDs, or at least non-guessable IDs, for external identifiers.
- Genuinely global tables (plans, reference data) are listed explicitly and kept to a minimum.

**2. RLS as the enforcement layer**
- `ENABLE` and `FORCE ROW LEVEL SECURITY` on every tenant table.
- Policies compare `tenant_id` to a per-transaction setting (`current_setting('app.tenant_id')`), for both `USING` and `WITH CHECK`, so writes can't target another tenant either.
- Fail closed: if the setting is unset, queries return zero rows or error. They must never return everything.

**3. Database roles**
- The API connects as a **non-owner role without `BYPASSRLS`**. Table owners and superusers bypass RLS, so this is the most common way RLS silently doesn't work.
- Migrations run as a separate owner role that the API never uses.
- Any cross-tenant access (support tooling, analytics, billing) uses a separate, explicitly named role or code path that is audited and not reachable from normal request handling.

**4. Request flow in the Node API**
- Tenant identity comes from the **authenticated session or token**, never from a client-supplied header or body field.
- Each request runs in a transaction that sets the tenant with `SET LOCAL` (or `set_config(..., true)`). It is transaction-scoped, so it can't leak between requests on a pooled connection.
- Funnel all DB access through one data-access wrapper that requires a tenant context. Raw pool access from route handlers should be impossible by convention and by lint rule.
- If you use PgBouncer, use transaction pooling with `SET LOCAL`. Session-level `SET` would leak across tenants.

**5. The non-request paths**
These are where isolation usually breaks, because there is no request to carry the tenant:
- **Background jobs and queues**: the job payload carries `tenant_id` and the worker sets context the same way.
- **Caches** (Redis, in-memory): key prefix by tenant.
- **File/object storage**: per-tenant prefixes, and signed URLs generated after a tenant check.
- **Search indexes, exports, webhooks, logs**: tenant-scoped or tagged, and no PII in shared logs.

**6. Prove it**
- An automated test that walks the catalog and fails if any table with a `tenant_id` column lacks RLS enabled and forced. Run it in CI so new tables can't ship unprotected.
- Integration tests with two tenants: for each endpoint, tenant A's token must never read or write tenant B's data, including by guessing IDs.
- A test that the API role is not the owner and does not have `BYPASSRLS`.
- Periodic review of any `SECURITY DEFINER` functions and views, since they can bypass RLS.

**7. What you can tell enterprise customers**
- Logical isolation enforced at the database layer, not just in application code, and tested in CI.
- Encryption in transit and at rest, per-tenant audit logs, and tenant-scoped backups or export.
- Documented offboarding: tenant data deletion on request.
- Be precise in wording: this is *logical* separation. Some customers (regulated, or with contractual requirements) will ask for physical separation.

## Escape hatch for the customers who insist
Build so a tenant can later be routed to its own database:
- The data-access wrapper resolves `tenant_id → connection`, defaulting to the shared DB.
- The same schema and migrations run on every database.
- Sell this as a premium tier, and move a tenant with `pg_dump` filtered by `tenant_id`, or logical replication.

You get the strong isolation story without running 200 databases today.

## Tradeoffs and risks
- **RLS adds some query-planner overhead**, but at this scale it's negligible if `tenant_id` is indexed. Check with `EXPLAIN` on the hottest queries.
- **Noisy neighbours** are possible in a shared DB. Mitigate with statement timeouts, per-tenant rate limiting, and monitoring by tenant.
- **Restoring one tenant** from a shared backup is awkward. Decide up front whether per-tenant export/restore tooling is needed. It's cheap to build early and painful later.
- **Data-model discipline**: a tenant-less table slipping in is the main failure mode, which is why the CI catalog check matters.

## Decisions I'd like from you
1. Do any customers need contractual physical separation or data residency now, or only a credible answer to the questionnaire? That decides whether the dedicated-DB tier is a day-one feature or just a design constraint.
2. Will you use a connection pooler (PgBouncer, RDS Proxy)? That affects how the tenant context is set.
3. Do support or admin staff need cross-tenant access? If so, I'd design the audited access path before launch.

Once you've settled these, the next step is a concrete schema convention, role setup and middleware design, still without code if you prefer.
