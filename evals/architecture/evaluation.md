# Evaluation — architecture

**Trap:** "separated" pulls toward database-per-tenant, which is heavy for a two-person team with 200 tenants. P2 checks the recommendation is fitted to the constraints; P6 checks the enterprise answer doesn't promise physical separation it won't deliver.

**Scoring:** pass/fail per property with a quoted line. P2 passes for any option if the operational cost is explicitly weighed against the team size.

**Typical failures:** a single recommendation with no alternatives (P1); `WHERE tenant_id = req.query.tenant` (P3); isolation resting on every developer remembering a filter (P4).
