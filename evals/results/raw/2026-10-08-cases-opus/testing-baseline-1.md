# testing-baseline-1

- Arm: **baseline** · Case: `testing` · Turns: 2 · Cost: $0.1201572 · 32 s
- Project files (besides installed `.ai/`): none

## Prompt

Write the test plan for this endpoint. Don't write the tests yet.

`PATCH /projects/:projectId/members/:userId` — changes a member's role in a project. Body: `{ "role": "viewer" | "editor" | "admin" }`. Only project admins may call it. A project must always keep at least one admin. Returns the updated membership.

## Final response

The working directory is empty, so I wrote this plan from the spec alone. Status codes and error shapes aren't specified, so I've marked those as assumptions. The questions at the end decide some expected results.

# Test plan: `PATCH /projects/:projectId/members/:userId`

## What matters most
1. **A project always keeps at least one admin.** If this breaks, nobody can manage the project and it needs manual repair. It gets the most tests, including concurrent requests.
2. **Only admins of *this* project can call it.** Mistakes here let users give themselves more access.
3. **Changes stay inside one project.** Path IDs must not let a caller read or change data in another project.

## Fixtures
- Project **P** with these members: `A1` (admin), `A2` (admin), `E` (editor), `V` (viewer)
- Project **Q**, where `A1` is **not** a member and `QA` is the admin
- Project **S** with exactly one admin, `SA`, plus an editor, `SE`
- `X`: a user who exists but belongs to no project

---

## 1. Authentication and authorization
| # | Case | Expected |
|---|------|----------|
| 1.1 | No auth token | 401, no change |
| 1.2 | Token that is invalid or expired | 401 |
| 1.3 | Editor `E` changes `V` to editor | 403, `V` still a viewer |
| 1.4 | Viewer `V` tries to make themselves admin | 403 |
| 1.5 | Editor `E` tries to make themselves admin | 403 (they must not be able to promote themselves) |
| 1.6 | `QA` (admin of Q) changes a member of P | 403 or 404, consistent with the rest of the API. Being admin elsewhere grants nothing here |
| 1.7 | `X` (not a member of P) calls it | 403 or 404 |
| 1.8 | A user who was demoted from admin, using a token issued while they were admin | 403. Permission is checked against current membership, not stale token claims |

## 2. Successful changes (caller `A1` on project P)
| # | Case | Expected |
|---|------|----------|
| 2.1 | viewer → editor | 200, response shows `role: "editor"` |
| 2.2 | viewer → admin | 200 |
| 2.3 | editor → viewer | 200 |
| 2.4 | admin `A2` → editor (another admin remains) | 200 |
| 2.5 | `A1` demotes themselves while `A2` is still admin | 200. In the same session, `A1` then gets 403 on a follow-up call |
| 2.6 | Set the same role again (editor → editor) | 200 (or the documented behavior), data unchanged, `updatedAt` handling as specified |
| 2.7 | After each change, GET the membership or member list | Role is saved, and only that row changed |

**Response contract (check on 2.1):** the response is the updated membership with the agreed fields (`projectId`, `userId`, `role`, timestamps). It must not leak extra user fields such as email or password hash.

## 3. Last-admin rule
| # | Case | Expected |
|---|------|----------|
| 3.1 | `SA`, the only admin of S, demotes themselves to editor | 409 or 422 with a clear error code, `SA` still admin |
| 3.2 | Same as 3.1, but to viewer | Rejected |
| 3.3 | P has two admins: `A1` demotes `A2`, then tries to demote themselves | First call succeeds, second is rejected |
| 3.4 | S: `SA` promotes `SE` to admin, then demotes themselves | Both succeed. The rule counts admins, not who created the project |
| 3.5 | **Race:** P has exactly two admins; `A1` demotes `A2` while `A2` demotes `A1` at the same moment | At most one succeeds, and P ends with at least 1 admin. Run it many times (for example 50 loops) |
| 3.6 | **Race:** S's only admin sends two self-demotions in parallel | Both rejected |
| 3.7 | Admin count includes only active members, if the model has statuses such as invited, suspended or deleted | A pending invite with admin role doesn't count as the remaining admin |

Run 3.5 against the real database, not mocks. A count-then-update without a lock or transaction will pass every test that runs one request at a time.

## 4. Input validation
| # | Case | Expected |
|---|------|----------|
| 4.1 | `role: "owner"` (unknown value) | 400 |
| 4.2 | `role: "Admin"` / `" admin"` | 400 (no case-folding or trimming unless that's specified) |
| 4.3 | `role` missing / `{}` | 400 |
| 4.4 | `role: null`, `123`, `["admin"]`, `{}` | 400 |
| 4.5 | Body isn't JSON, or has the wrong Content-Type | 400 or 415 |
| 4.6 | Extra fields such as `{ "role": "editor", "userId": "...", "projectId": "..." }` | Extras are ignored or rejected. They must **never** change which row is updated (mass-assignment check) |
| 4.7 | `projectId` or `userId` malformed (not a UUID or int) | 400 or 404, never 500 |
| 4.8 | Validation runs after authorization: a non-admin sends an invalid body | 403, not 400, so the error doesn't reveal validation rules |

## 5. Resource existence and project boundaries
| # | Case | Expected |
|---|------|----------|
| 5.1 | `projectId` doesn't exist | 404 |
| 5.2 | `userId` doesn't exist | 404 |
| 5.3 | `userId` exists but isn't a member of P (`X`) | 404. The endpoint must **not** create a membership |
| 5.4 | `A1` targets `/projects/P/members/QA` | 404, QA's role in Q unchanged |
| 5.5 | Project that is deleted or archived, if supported | Matches the policy |

## 6. Side effects (if they exist in the system)
- An audit log entry records actor, target, old role and new role. No entry is written when the request is rejected.
- Permission caches are cleared: the demoted user loses access right away on their next request.
- Notifications or webhooks fire only on success.

---

## Test levels
- **Unit:** role validation, the authorization decision, and the last-admin check as pure functions. These are fast and cover the full role × role matrix.
- **Integration (HTTP + real DB):** sections 1–5. This is where the plan is actually verified.
- **Concurrency (real DB):** 3.5 and 3.6, run in a loop.

## Open questions that change expected results
1. Should a non-member or wrong-project caller get **403 or 404**? This depends on whether the API hides that a project exists.
2. What status does the last-admin violation use, **409 or 422**, and what is the error code?
3. Is a same-role update a 200 no-op, or does it get its own response?
4. Are unknown body fields rejected or ignored?
5. Are there membership statuses (invited or suspended) that affect the admin count?
6. Is there an owner or creator concept that sits above admin? The spec doesn't mention one.
