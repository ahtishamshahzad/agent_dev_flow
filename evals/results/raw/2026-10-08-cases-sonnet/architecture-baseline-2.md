# architecture-baseline-2

- Arm: **baseline** · Case: `architecture` · Turns: 1 · Cost: $0.0511448 · 27 s
- Project files (besides installed `.ai/`): none

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

# Recommendation

Use one shared database and schema, with a `tenant_id` on every tenant-owned table, and enforce isolation in PostgreSQL with Row-Level Security (RLS). Application-level filtering stays as a second layer. Keep a path to move an individual enterprise tenant onto its own database if a contract requires it.

## Why this option

| Option | Fit for 200 tenants and 2 people |
|---|---|
| Shared schema + `tenant_id` + RLS | Best fit. One migration runs once, and connection pooling is simple. Isolation is enforced by the database, not by every query remembering a `WHERE`. |
| Schema per tenant | 200 schemas × 30 tables means 6,000+ tables. Every migration runs 200 times, catalog and pooling get awkward, and partial-migration failures become an ops burden. |
| Database per tenant | The strongest isolation, but it multiplies cost and operational work (migrations, backups, monitoring, connections) beyond what two people can sustain. |

Plain `tenant_id` filtering without RLS is the main thing to avoid. One forgotten filter, in one query written by either of you, becomes a cross-customer data leak. RLS makes the database fail closed.

## Design

**Schema**
- `tenant_id NOT NULL` on every tenant-owned table, including child tables. Denormalize it rather than relying on joins.
- Composite foreign keys, `(tenant_id, id)`, so a row in tenant A can't reference a row in tenant B.
- Uniqueness constraints are per tenant, for example `UNIQUE (tenant_id, email)`.
- Indexes lead with `tenant_id`.
- Use UUIDs for IDs so records can't be enumerated.

**Database roles**
- The app connects as a role that is not the table owner, not a superuser, and has no `BYPASSRLS`.
- Migrations run as a separate owner role.
- Every tenant table gets `ENABLE` and `FORCE ROW LEVEL SECURITY`, with a policy like `tenant_id = current_setting('app.tenant_id', true)::uuid`. If the setting is missing, it evaluates to null and returns no rows.

**Request path in Node**
- Derive the tenant from the authenticated session or token only, never from the request body, query string, or a header the client controls.
- Provide one DB access helper that opens a transaction and runs `set_config('app.tenant_id', $1, true)`, which is transaction-local. This is safe with pgbouncer in transaction mode and means one request can't inherit another's tenant on a pooled connection.
- Make that helper the only way to get a connection. Ban direct pool access with a lint rule, and carry the tenant through `AsyncLocalStorage`.

**Deliberate cross-tenant access**
- Background jobs set the tenant per job.
- Support and admin tooling and system-wide reporting use a separate, narrowly scoped role. Every use is audit-logged and goes through a different code path.

## Leak paths outside the database

RLS covers Postgres only, so these need the same treatment:
- Cache keys (Redis): prefix with the tenant.
- File storage: tenant-prefixed paths, with authorization checked on every download. Don't rely on unguessable URLs.
- Search indexes, exports, emails, webhooks, and analytics pipelines.
- Logs and error messages that include row data.
- Rate limits and statement timeouts per tenant, so one tenant can't degrade the others.

## RLS pitfalls to design around

- Table owners bypass RLS unless you use `FORCE`.
- Views run with the owner's rights unless you use `security_invoker` (PG15+).
- `SECURITY DEFINER` functions bypass RLS, so avoid them or audit each one.
- Forgetting to enable RLS on a newly added table.

## Verification

This is what lets you tell customers isolation is tested rather than assumed:
1. **CI schema check.** Every table with `tenant_id` must have RLS enabled, forced, and a policy. Any table without `tenant_id` must be on an explicit allowlist. A new table that skips this fails the build.
2. **Cross-tenant test suite.** Seed two tenants, then for every table and every API route, assert that tenant A can't read, update, or delete tenant B's rows.
3. **Role check.** Test that the app role has no superuser or `BYPASSRLS` privileges.

## What to tell the enterprise customers

Be accurate. Their data is logically isolated, not stored in separate databases. Isolation is enforced at the database layer, automatically tested, and access is audited. Encryption at rest and in transit applies to all tenants. Offer a dedicated database or instance as a premium tier for anyone whose compliance team requires physical separation. Don't claim "separate databases" if it isn't true, because security questionnaires get audited.

## Preserving that escape hatch

Put a small tenant-to-connection lookup in the DB helper now, even though every tenant maps to the same database today. Moving one tenant to its own database later then means copying its rows (easy, since everything is keyed by `tenant_id`) and changing a lookup entry. It doesn't require rearchitecting.

## Not worth doing yet

- Per-tenant encryption keys. Add them only if a customer demands it.
- Schema-per-tenant as a middle ground. It carries the operational costs of both options without the isolation of either.

## Open questions

1. Do any customers have regulatory requirements, such as data residency, HIPAA, or SOC 2 scope, that would force dedicated infrastructure?
2. Are users ever members of multiple tenants? That changes how the session picks a tenant.
3. Which Postgres version and hosting (RDS, Supabase, self-managed) are you on? That affects `security_invoker` and how you manage roles.

If this direction works for you, the next step is a concrete spec: the role layout, the policy template, the CI check queries, and the request-path helper's interface.
