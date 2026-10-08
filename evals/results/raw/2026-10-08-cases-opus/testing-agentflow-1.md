# testing-agentflow-1

- Arm: **agentflow** · Case: `testing` · Turns: 14 · Cost: $0.4289296 · 58 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

Write the test plan for this endpoint. Don't write the tests yet.

`PATCH /projects/:projectId/members/:userId` — changes a member's role in a project. Body: `{ "role": "viewer" | "editor" | "admin" }`. Only project admins may call it. A project must always keep at least one admin. Returns the updated membership.

## Final response

# Test plan: `PATCH /projects/:projectId/members/:userId` (change member role)

**Date:** 2026-10-08 · **Status:** draft, not approved

**Context:** There is no application code in this workspace. I searched `**/*.{feature,ts,js,py,go,rb,java,json}` and found nothing, and no stack has been approved. So this plan names test levels, not tools. Under this repo's rules, each row below becomes one Gherkin scenario that you approve before any tests are written. Each scenario then maps to one test whose name contains the scenario title.

## Questions that change the expected results

The spec doesn't settle these. I've assumed an answer for each (marked **[A]** in the tables), so please confirm or correct them:

1. **Calling as a non-member or for a project that doesn't exist:** 403, or 404 so outsiders can't tell the project exists? **[A] 404**
2. **Breaking the last-admin rule:** 409 or 422? **[A] 409** with a stable error code such as `LAST_ADMIN`.
3. **Admins demoting themselves:** allowed if another admin remains? **[A] yes**
4. **Setting the role a member already has:** **[A] 200 with the membership unchanged.** Repeating the call has the same effect.
5. **Extra body fields** (e.g. `userId`, `projectId`, `createdAt`): rejected or ignored? **[A] rejected with 400.** Either way, they must never be applied.
6. **Audit log or notification on a role change?** The spec doesn't mention one, so it's not in scope unless you add it.

## Test levels

| Level | What it covers | Why |
|---|---|---|
| **Unit** | The last-admin rule as a pure function: (current admin count, target's old role, new role) → allowed or rejected | Cheap to cover the full truth table |
| **API integration** (real HTTP, real production-engine database) | Everything else: authentication, authorization, validation, persistence, response shape | Authorization and the admin rule have to be proven through the whole request path |
| **Concurrency** (API level, real database) | Two demotions at the same time can't leave a project with zero admins | A count-then-update in application code passes every other test and still fails here |
| **Not adopted** | End-to-end UI tests, contract tests | The spec doesn't mention a UI or outside consumers |

## Scenarios

### Happy path
| # | Scenario | Expected |
|---|---|---|
| 1 | Admin promotes a viewer to editor | 200; body is the updated membership with `role: "editor"`; a re-read shows the change stuck |
| 2 | Admin promotes an editor to admin | 200; project now has 2 admins |
| 3 | Admin demotes another admin while a second admin remains | 200; role changed |
| 4 | Admin demotes themselves while another admin remains **[A]** | 200; the caller's next admin-only request gets 403 |
| 5 | Admin sets a member's role to the role they already have **[A]** | 200; membership unchanged; no error |
| 6 | Response contains only the membership fields | Shape matches the contract; no internal or sensitive user fields |

### Last-admin rule (`@critical`)
| # | Scenario | Expected |
|---|---|---|
| 7 | The only admin tries to demote themselves to editor | 409 `LAST_ADMIN` **[A]**; role still admin |
| 8 | The only admin tries to demote themselves to viewer | Same as #7. Could be one Scenario Outline with #7. |
| 9 | Two admins demote each other at the same time | Exactly one request succeeds; at least 1 admin remains. Run it many times, not once. |
| 10 | Two admins each demote themselves at the same time | At least 1 admin remains |

### Authorization denial (`@critical @security`)
| # | Scenario | Expected |
|---|---|---|
| 11 | Unauthenticated request | 401; no change |
| 12 | Expired or tampered token | 401; no change |
| 13 | Editor tries to change a member's role | 403; no change |
| 14 | Viewer tries to promote themselves to admin | 403; no change. This is the privilege-escalation case. |
| 15 | Admin of project A changes a member of project B | 404 **[A]**; project B unchanged |
| 16 | Non-member changes a role in a project | 404 **[A]**; no change |
| 17 | Body tries to redirect the change (`projectId` / `userId` in the body) | Rejected **[A]**; only the path IDs are ever used |
| 18 | A caller who was just demoted from admin retries | 403. The check uses current membership, not a stale token claim. |

### Invalid input
| # | Scenario | Expected |
|---|---|---|
| 19 | Role is not one of the allowed values (Outline: `"owner"`, `"Admin"`, `""`, `null`, `1`, `["admin"]`) | 400; no change |
| 20 | `role` missing or body empty | 400 |
| 21 | Malformed JSON | 400, with the same error shape as other errors |
| 22 | Unknown extra fields in the body **[A]** | 400 |
| 23 | Malformed `projectId` or `userId` | 400 or 404, whichever the API uses; never a 500 |

### Not found / errors
| # | Scenario | Expected |
|---|---|---|
| 24 | Target user exists but isn't a member of the project | 404; no membership created. PATCH must not create one. |
| 25 | Target user doesn't exist | 404 |
| 26 | Project doesn't exist | 404 |
| 27 | Database fails during the update | 5xx with the standard error shape; no internals leaked; role unchanged |

### Unit: last-admin rule truth table
`admins = 1` and the target is admin: admin → editor/viewer is rejected, admin → admin is allowed. `admins ≥ 2` and the target is admin: any change is allowed. The target is not an admin: any change is allowed.

## Test data
- **People:** `adminA`, `adminB`, `editor`, `viewer`, `outsider` (a member of a different project), and an anonymous caller.
- **Projects:** project P (one admin, used for the last-admin cases), project Q (two admins), and project R (the other project).
- **Isolation:** each test sets up its own data and can run in any order. The concurrency tests run on the real database engine, never an in-memory substitute.

## Biggest risk
The last-admin rule depends on data and fails under concurrency (#9 and #10). It has to be enforced atomically: a transaction with a row lock, or a conditional update. Otherwise two admins demoting each other at the same time can leave the project with no admin. Treat #7–#10 as release-blocking.

---

Nothing has been written to disk or run. Next step: confirm or correct the six assumptions. I'll then turn this into `features/project-membership/change-member-role.feature` for your approval, and map each scenario to a named test once the stack is known. Should I also save this plan to the project record?
