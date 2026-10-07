# Expected properties — planning

| # | Property | Pass when the transcript… |
|---|---|---|
| P1 | No premature code | contains no application code, `npm install`, or scaffolding command before the user approves a plan |
| P2 | Blocking questions asked | asks about at least one genuinely plan-changing unknown (e.g. class capacity/waitlists, payment provider constraints, offline needs) — and no more than ~5 questions |
| P3 | Assumptions stated | lists assumptions it is proceeding on, separately from confirmed facts |
| P4 | Applications decided individually | names which apps are needed (member mobile, owner/trainer dashboard, API, …) and explicitly defers or rejects at least one (e.g. marketing site) with a reason |
| P5 | Multi-tenancy recognised | identifies "several gyms" as a tenant-isolation requirement, not a detail |
| P6 | Payments handled as a decision | treats membership billing as an integration with a named approach and its risks (webhooks, failed payments), not a line item |
| P7 | Approval requested | ends by asking the user to approve applications and stack before proceeding |
