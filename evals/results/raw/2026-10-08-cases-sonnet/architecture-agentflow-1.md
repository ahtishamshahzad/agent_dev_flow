# architecture-agentflow-1

- Arm: **agentflow** · Case: `architecture` · Turns: 5 · Cost: $0.11225280000000001 · 49 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

Nothing exists in the repo yet, so this is a greenfield design. Your CLAUDE.md requires approved behavior scenarios before architecture is final, so I've listed proposed scenarios at the end for your approval.

## Recommendation

Use **one shared database and schema, with isolation enforced at two independent layers**:

1. **Application layer:** every request runs inside a tenant context taken from the authenticated session.
2. **Database layer:** Postgres Row-Level Security (RLS) on every tenant table, so a missed `WHERE tenant_id = ?` returns nothing instead of leaking data.

I'd also build in a **migration path to a dedicated database for individual customers**, in case an enterprise deal requires one.

## Why this over the alternatives

| Option | Verdict |
|---|---|
| Shared schema + `tenant_id` + RLS | **Chosen.** One migration run and one backup. It's cheap to operate with two people, and RLS makes the enforcement real rather than a convention. |
| Schema per tenant | About 200 × 30 = 6,000 tables, and every migration runs 200 times. Connection pooling and catalog bloat get awkward. It's the most operational pain for a two-person team and adds only a modest isolation gain over RLS. |
| Database per tenant | The strongest isolation, but cost, migrations, monitoring and pooling all multiply by 200. I'd reserve it for the few customers who contractually require it. |
| `tenant_id` only, no RLS | One forgotten filter in one query is a cross-tenant breach. That's too fragile as your only control. |

## Design

**Schema**
- Every tenant-owned table gets `tenant_id NOT NULL`, including child tables, even where it could be derived through a join.
- Use composite foreign keys, `(tenant_id, parent_id)`, so a row can't reference another tenant's row even if the app has a bug.
- Unique constraints and indexes lead with `tenant_id`. This is also good for performance.
- Truly global tables, such as plans and country lists, go on an explicit allowlist. A CI check fails if any other table lacks `tenant_id`.

**RLS**
- On every tenant table, run `ENABLE` and `FORCE ROW LEVEL SECURITY`. The policy compares `tenant_id` to `current_setting('app.tenant_id', true)`.
- If the setting is unset, the comparison is null and no rows match. The default fails closed.
- Set the value with a transaction-local `set_config(..., true)`, never a session-level `SET`. This is what prevents leaks through pooled connections, and it works with PgBouncer in transaction mode.

**Database roles**
- The app role is not a superuser, does not own the tables, and has no `BYPASSRLS`. Owners and superusers skip RLS, so this matters.
- A separate migration/owner role runs schema changes.
- A separate, audited ops role handles cross-tenant work such as billing, support and analytics. It's only reachable through a deliberate code path.

**Node API**
- The tenant ID comes only from verified auth, meaning the token plus a `memberships` table. It never comes from a request body, URL param or header the client controls. If a user can belong to several tenants, they select one and the server verifies the membership.
- Carry the tenant context with `AsyncLocalStorage`.
- Expose one data-access entry point, `withTenant(tenantId, fn)`, which opens a transaction, sets the tenant and runs the work. Lint rules should forbid using the pool directly.

**Everything outside Postgres**
- **Jobs and queues:** put `tenant_id` in the payload and re-establish the context in the worker.
- **Cache keys:** prefix them with the tenant.
- **File storage:** use per-tenant prefixes, and serve files through signed URLs issued after an authorization check.
- **Logs and audit trail:** tag every entry with the tenant, and record access to tenant data.
- **Exports and search indexes:** scope them by tenant the same way.

**Noisy neighbors**
- Add per-tenant rate limits and statement timeouts. This is one shared database, so one tenant's heavy query can slow the rest.

**Dedicated-database path**
- Keep a `tenants` registry with a database-target column from day one.
- Because the schema is identical and every row carries `tenant_id`, moving one large customer to its own database later is a data copy plus a routing change, not a redesign.

## How we prove it

This is what answers the enterprise question with evidence rather than assurance:
- **Cross-tenant test suite:** generated per table, it checks that tenant A cannot read, update, delete or reference tenant B's rows.
- **Fail-closed test:** a query with no tenant context returns zero rows.
- **Pool-reuse test:** after tenant A's request, the next request on the same connection sees nothing of A's data.
- **CI catalog check:** every table with `tenant_id` has RLS enabled, forced and a policy, and the app role has no bypass.
- **Penetration test:** a third-party test focused on tenant escape before your first enterprise onboarding.

## What to tell customers

Say this: "Logical isolation, enforced by the database itself (row-level security) and tested continuously. Encryption is in transit and at rest, access is audited, and a dedicated database is available on request." Don't claim "physically separate" unless you build that tier.

Be upfront about two limits of the shared model. Restoring a single tenant from backup is harder than in a per-tenant database. And "dedicated" means a separate paid tier.

## Open questions

These affect the design but don't block it:
1. **ORM and data layer:** the stack isn't chosen yet. Prisma and Drizzle both work with RLS, but each needs the per-transaction wrapper.
2. **Multi-tenant users:** can one person belong to several companies, such as consultants?
3. **Support access:** will staff need to view tenant data? If so, I'd add impersonation with an audit trail.
4. **Contract requirements:** do any customers need data residency, a dedicated database, customer-managed keys, or SOC 2 / ISO evidence?
5. **Hosting:** is it managed Postgres, and does it support the roles and pooling above?

## Proposed scenarios for approval (Gherkin summaries)

- A user in tenant A cannot read, list, update or delete tenant B's records, by ID or by query.
- A request without a resolved tenant returns no data and an error.
- A client-supplied tenant ID is ignored in favor of the authenticated one.
- A record cannot reference another tenant's record.
- A background job processes only its own tenant's data.
- File access across tenants is denied.
- Concurrent requests from different tenants on a pooled connection never see each other's data.
- Ops access to cross-tenant data is audited.

If you approve the approach and scenarios, my next step is to record them in `.ai/projects/current/` and move on to phases and tasks. I haven't written any files or code.
