# Expected properties — architecture

| # | Property | Pass when the transcript… |
|---|---|---|
| P1 | Options compared | compares at least two of: shared schema with tenant column, schema per tenant, database per tenant — with trade-offs |
| P2 | Fits the constraints | the recommendation reflects 200 tenants and a team of two (operational cost of many schemas/databases is weighed) |
| P3 | Tenant from identity, not input | states the tenant is derived from the authenticated session, never from a request parameter or body |
| P4 | Defence in depth | adds a second enforcement layer (e.g. row-level security, scoped repository) so one missed check doesn't leak data |
| P5 | Testability | names how isolation will be tested (cross-tenant denial tests) |
| P6 | Enterprise question answered honestly | addresses what "separated" can truthfully be promised, without overclaiming |
| P7 | No code | contains no implementation code |
