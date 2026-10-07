# testing-baseline-1

- Arm: **baseline** · Case: `testing` · Turns: 2 · Cost: $0.1144024 · 29 s

## Prompt

Write the test plan for this endpoint. Don't write the tests yet.

`PATCH /projects/:projectId/members/:userId` — changes a member's role in a project. Body: `{ "role": "viewer" | "editor" | "admin" }`. Only project admins may call it. A project must always keep at least one admin. Returns the updated membership.

## Final response

The workspace is empty, so I couldn't match existing test conventions. This plan comes from the spec only. Questions the spec leaves open are marked **[?]** and listed at the end.

# Test plan: `PATCH /projects/:projectId/members/:userId`

## Fixtures
- **Project P** with members: `A1` (admin), `A2` (admin), `E` (editor), `V` (viewer)
- **Project Q** (single admin): `Q_A` (only admin), `Q_E` (editor)
- **Outsider O**: authenticated, not a member of P
- **X**: admin of a different project R, not a member of P

## 1. Authentication
| # | Case | Expected |
|---|---|---|
| 1.1 | No auth token | 401 |
| 1.2 | Invalid or expired token | 401 |

## 2. Authorization (only admins of *this* project)
| # | Caller | Expected |
|---|---|---|
| 2.1 | Viewer `V` changes `E` | 403, no change |
| 2.2 | Editor `E` changes `V` | 403, no change |
| 2.3 | Editor `E` promotes self to admin | 403, no change (privilege escalation) |
| 2.4 | Viewer `V` promotes self to admin | 403, no change |
| 2.5 | Outsider `O` | 403 or 404 **[?]**, no change |
| 2.6 | `X`, admin of project R, acts on P | 403/404; admin rights must not carry over between projects |
| 2.7 | Admin `A1` changes `E` | 200 (control case) |

## 3. Input validation
| # | Body / params | Expected |
|---|---|---|
| 3.1 | `{}` (role missing) | 400 |
| 3.2 | `{"role": "owner"}` | 400 |
| 3.3 | `{"role": "Admin"}` (case) | 400 **[?]** |
| 3.4 | `{"role": null}`, `{"role": 1}`, `{"role": ["admin"]}` | 400 |
| 3.5 | `{"role": ""}`, `{"role": " admin "}` | 400 |
| 3.6 | Malformed JSON | 400 |
| 3.7 | Wrong / missing `Content-Type` | 400 or 415 |
| 3.8 | Extra fields, e.g. `{"role":"editor","userId":"other","projectId":"other"}` | Ignored or 400 **[?]**; must never change which membership gets updated |
| 3.9 | Malformed `projectId` / `userId` (wrong ID format) | 400 or 404, never 500 |

For every rejected request, also check the stored state is unchanged.

## 4. Resource existence
| # | Case | Expected |
|---|---|---|
| 4.1 | `projectId` doesn't exist | 404 |
| 4.2 | `userId` doesn't exist | 404 |
| 4.3 | `userId` exists but isn't a member of P | 404; no membership is created (no upsert) |
| 4.4 | `userId` is a member of Q but not P, caller is admin of P | 404; Q's membership untouched |
| 4.5 | Order of checks: non-admin targets a nonexistent user | 403, not 404 (no membership enumeration) **[?]** |

## 5. Role transitions (happy paths, caller `A1`)
Test all 6 transitions: viewer→editor, viewer→admin, editor→viewer, editor→admin, admin→editor, admin→viewer. The admin demotions only work while another admin remains.

For each:
- 200 with the updated membership
- A fresh GET or DB read confirms the change persisted
- Other members of P are unchanged
- The target's memberships in other projects are unchanged
- The new permissions take effect: a newly promoted admin can call this endpoint, and a newly demoted admin gets 403 on their next call

**5.x Same role (no-op):** e.g. set `E` to `editor`. Expect 200 with unchanged membership **[?]**. No spurious `updatedAt` bump or audit event, if those exist.

## 6. Last-admin invariant (highest risk)
| # | Case | Expected |
|---|---|---|
| 6.1 | `Q_A` (sole admin) demotes self to editor | 409/422 **[?]**, still admin |
| 6.2 | `Q_A` demotes self to viewer | Rejected, still admin |
| 6.3 | `Q_A` "changes" self to admin (no-op) | 200; the invariant check must not falsely block it |
| 6.4 | P has 2 admins: `A1` demotes `A2` | 200, 1 admin left |
| 6.5 | Then `A1` demotes self | Rejected |
| 6.6 | P has 2 admins: `A1` demotes self | 200; `A1` gets 403 on the next call |
| 6.7 | Promote `E` to admin, then demote the original sole admin | 200; checks the admin count is recomputed, not cached |
| 6.8 | Error body names the reason (e.g. `LAST_ADMIN`) | Clients can tell this apart from validation errors |

### 6.9 Concurrency
- P has exactly 2 admins. `A1` demotes `A2` and `A2` demotes `A1` in parallel.
  - Expect exactly one 200 and one rejection, with 1 admin left. Never 0 admins.
  - Repeat N times (e.g. 50) to catch intermittent races.
- 2 admins each send a self-demotion in parallel. Same expectation.
- If the invariant is only checked in application code with no lock or transaction, these tests should fail. That's what they're for.

## 7. Response contract
- 200 body has the membership fields (e.g. `projectId`, `userId`, `role`, timestamps) **[?]**, with `role` set to the new value
- No sensitive fields leak, such as the user's email or password hash, beyond what other membership endpoints return
- Error responses use the API's standard error shape
- Wrong method, e.g. `PUT` → 405, if routing enforces it

## 8. Side effects (if they exist)
- An audit log or event is recorded with actor, target, old role, and new role
- Nothing is recorded on rejected requests
- Permission caches are invalidated so the role change takes effect immediately

## Open questions to settle before writing the tests
1. Should outsiders and admins of other projects get **403 or 404**? Is hiding that the project exists a goal?
2. What status code for a last-admin violation: **409, 422, or 400**?
3. Should the role value be matched case-sensitively? Should unknown body fields be rejected or ignored?
4. Is a same-role request a 200 no-op, and should it skip audit and `updatedAt` updates?
5. What exactly is in the membership response?
6. Are there other states to cover, like pending invitations, suspended or deleted users, or archived projects?
7. Is there a project owner role outside these three roles that changes the admin-count rule?

Suggested order to implement: §6 (including concurrency) and §2 first, then §5, §3/§4, and §7/§8.
