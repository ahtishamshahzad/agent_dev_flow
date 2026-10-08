# architecture-agentflow-3

- Arm: **agentflow** · Case: `architecture` · Turns: 5 · Cost: $0.09741160000000001 · 31 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

We've approved a multi-tenant B2B app: Node API, PostgreSQL, about 30 tables, around 200 tenant companies, a team of two. A few enterprise customers have asked whether their data is "separated" from other customers. Design how tenant data is isolated and tell us what you'd do and why. Don't write code yet.

## Final response

**Classification:** architecture design, with a security angle. The project folder has no status file, so I'm treating this as the architecture step of an already-approved project. The stack (Node and Postgres) is fixed. Per the pipeline, I'm giving you the design and a draft of the behavior to approve. I haven't written any code.

## Recommendation

Use one shared database and one shared schema. Every tenant-owned table gets a `tenant_id`, and Postgres Row-Level Security (RLS) enforces isolation in the database itself. Application-level filtering is the second layer, not the only one.

### How it works
1. **Tenant identity comes from the verified session or token.** It never comes from a request parameter or body. The API resolves it once per request.
2. **Each request runs in one transaction that sets the tenant.** It sets a transaction-local variable such as `app.tenant_id`. Transaction-local is safe with connection pooling, because the value can't leak to the next request on the same connection.
3. **RLS policies on all ~30 tables** compare `tenant_id` to that variable. If the variable is unset, they return no rows, so a forgotten context fails closed.
4. **Two database roles.** The app connects as a role that doesn't own the tables and has no `BYPASSRLS`. Tables use `FORCE ROW LEVEL SECURITY`. A separate owner role runs migrations, and the app never uses it.
5. **Composite foreign keys.** Child tables reference `(tenant_id, id)` on the parent. A row in tenant A then cannot point at tenant B's row, even through a bug. Uniqueness constraints (emails, slugs, numbers) are scoped per tenant.
6. **Isolation covers everything outside the tables too:**
   - Object storage paths, cache keys, search indexes, queue payloads and background jobs all carry the tenant.
   - Logs and error reports are tagged by tenant.
   - Exports and reports go through the same tenant-scoped path.
7. **Controlled escapes.** Support, admin and cross-tenant analytics use a separate, audited role or path. Nothing in the normal request path can bypass RLS.
8. **Proof, not just design.** An automated cross-tenant test suite runs in CI. It tries reads, writes, updates, joins and ID guessing as tenant A against tenant B's data, and also with the context unset. A new table without RLS and `tenant_id` fails CI.

### Why this and not the alternatives
| Option | Verdict |
|---|---|
| Shared schema + `tenant_id` only (app-layer filters) | Rejected. One missed `WHERE` leaks data, and with two people and ~30 tables that will happen eventually. |
| **Shared schema + RLS** | **Chosen.** The database enforces isolation, so a missing filter returns nothing. Migrations run once, and it's cheap to operate. |
| Schema per tenant | Rejected for now. It means 200 schemas × 30 tables to migrate and monitor, which is a lot of ongoing work for a team of two. |
| Database per tenant | Rejected as the default, but kept as an upgrade path (below). |

### Enterprise customers who want stronger separation
Build the data-access layer so that a tenant maps to a connection target. Don't build dedicated databases now. If a contract requires it, you can move one tenant to its own database or instance without redesigning the app. You can charge for that tier.

### What to tell the customers
You can say: "Tenant data is logically isolated, and the database enforces it with row-level security. We test it automatically for cross-tenant access, and support access is audited."

Don't say "physically separated" or "separate database." That isn't true for this design, and security questionnaires will check.

## Open questions that could change this
- Do any customers require **dedicated infrastructure or data residency** (a specific region or country)? That decides whether the dedicated-database path gets built early.
- Can one **user belong to several tenants** (consultants, agencies)? That affects how the session picks the tenant.
- Do you need **cross-tenant reporting** (internal analytics, billing)? If so, it needs its own audited path.
- Are you using a **connection pooler**, and in which mode? Transaction-local settings work in transaction pooling, but I'd confirm that against your setup and the Postgres docs for your version.
- Do any customers need **per-tenant backup restore or deletion** (offboarding, GDPR)? Shared-schema restores are harder, so decide this early.

## Next steps, per the gates
1. You answer the questions above (or accept my default assumptions: single-tenant users, no residency requirement, no cross-tenant reporting).
2. I draft Gherkin scenarios for the behavior, such as "tenant A cannot read tenant B's records," "a request with no tenant context returns nothing," and "support access is audited."
3. You approve the scenarios, then I break the design into phases and tasks for the second approval.

I found no existing code to audit, since the repo has only the `.ai/` governance files. Nothing here is verified by running anything. It's a design proposal, and version-specific Postgres details should be checked against the docs for your exact version before implementation.
