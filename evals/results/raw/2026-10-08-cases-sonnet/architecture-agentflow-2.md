# architecture-agentflow-2

- Arm: **agentflow** · Case: `architecture` · Turns: 7 · Cost: $0.118309 · 39 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

# Tenant isolation design

**Recommendation:** use one shared database and schema. Every tenant-owned table gets a `tenant_id`, and PostgreSQL Row-Level Security (RLS) enforces isolation in the database, not only in the Node code. Keep the option of moving a single enterprise customer to its own database later.

I read the project rules. `database-security` requires the tenant-isolation depth decision to be recorded either way, so this should go in `DECISIONS.md` once you approve it. I haven't written anything.

## Why this option

| Option | Verdict for two people, 200 tenants, 30 tables |
|---|---|
| App-level `WHERE tenant_id = ?` only | Too weak. One forgotten filter is a cross-customer breach, and you couldn't give enterprise buyers a real answer. |
| **Shared schema + `tenant_id` + RLS** | **Recommended.** A missed filter returns nothing instead of leaking data, and migrations and operations stay at one-database cost. |
| Schema per tenant | About 6,000 tables and every migration run 200 times. Catalog bloat and migration failures would eat your team's time. |
| Database per tenant | The strongest isolation, but 200 databases to patch, back up and monitor. It's only worth it for a customer who pays for it. |

## Design

**Schema**
- Put `tenant_id NOT NULL` on every tenant-owned table, including child tables. Duplicating it is what makes RLS cheap and simple.
- Use composite keys such as `(tenant_id, id)` and composite foreign keys, so a row can't reference another tenant's row.
- Make uniqueness per tenant, for example `(tenant_id, email)`.
- Explicitly list the few global tables, such as plans and lookup data. Everything else must be tenant-scoped.
- Put `tenant_id` first in indexes.

**Enforcement in Postgres**
- Enable RLS on every tenant table, and use `FORCE ROW LEVEL SECURITY`. The policy compares `tenant_id` to a per-transaction setting.
- Fail closed. If the tenant setting is unset, the policy matches no rows.
- The app connects as a role that is not the table owner, not a superuser, and has no `BYPASSRLS`. Migrations run as a separate owner role.
- Cross-tenant work (support tooling, analytics, billing jobs) uses a separate, audited role and code path. It is never the default connection.
- Views need `security_invoker`. Any `SECURITY DEFINER` function needs review, because both can silently bypass RLS.

**Node API**
- Take the tenant ID only from the verified token or session, never from the request body, URL or headers.
- Funnel all queries through one data-access wrapper. It opens a transaction, sets the tenant with `SET LOCAL` (this stays safe behind a transaction-mode pooler), and runs the work. Raw pool access is banned by lint rule and review.
- Background jobs and queue messages carry `tenant_id` and go through the same wrapper.

**Everything outside Postgres**
- The same boundary must hold in object storage (per-tenant prefixes), cache keys, search indexes, exports and logs. In practice leaks often happen there rather than in the main database.

**Proof, which is what enterprise buyers care about**
- Add a CI check that fails if any table with `tenant_id` lacks enabled and forced RLS.
- Add cross-tenant tests: two tenants, then attempt read, update, delete and insert-with-foreign-ID on every table and endpoint, and expect zero effect.
- Log admin and cross-tenant access.
- Run an independent penetration test before the first enterprise deal closes.

## Known costs

- **Performance:** RLS with simple equality policies and tenant-leading indexes is cheap, but benchmark your heaviest queries.
- **Noisy neighbors:** one tenant can still load the shared database. Add per-tenant rate limits and statement timeouts.
- **Per-tenant restore:** a shared backup can't restore a single tenant cleanly. Plan for logical per-tenant export, and be honest about this with customers.
- **Debuggability:** missing rows from a forgotten tenant setting look like bugs, not errors. The wrapper should make that mistake hard to make.

## What to tell customers

Say this: "Data is logically isolated. Isolation is enforced by the database itself, tested automatically on every release, and access is audited." Don't say "physically separate", because it isn't. For the rare customer who requires physical isolation or data residency, offer a dedicated database or deployment as a premium tier. The `tenant_id`-everywhere design makes that a connection-routing change plus a data copy, not a rewrite.

## Decisions I need from you

1. Does any customer require physical separation, data residency, or customer-managed encryption keys? If so, the premium-tier path moves up the roadmap.
2. Are you aiming for SOC 2 or ISO 27001? That affects how much audit logging to build up front.
3. Do you accept shared-database RLS as the default?

Once you confirm, my next steps would be to draft the Gherkin scenarios for isolation behavior (these need your approval before implementation) and the decision record.
