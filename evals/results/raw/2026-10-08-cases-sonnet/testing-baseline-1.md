# testing-baseline-1

- Arm: **baseline** · Case: `testing` · Turns: 1 · Cost: $0.0458688 · 19 s
- Project files (besides installed `.ai/`): none

## Prompt

Write the test plan for this endpoint. Don't write the tests yet.

`PATCH /projects/:projectId/members/:userId` — changes a member's role in a project. Body: `{ "role": "viewer" | "editor" | "admin" }`. Only project admins may call it. A project must always keep at least one admin. Returns the updated membership.

## Final response

# Test plan: `PATCH /projects/:projectId/members/:userId`

I haven't looked at the codebase, so status codes and error shapes below are assumptions (401, 403, 404, 400/422, 409). Adjust them to the API's conventions.

## 1. Happy path
| # | Case | Expected |
|---|---|---|
| 1.1 | Admin changes a viewer to editor | 200, body is the updated membership with `role: "editor"` |
| 1.2 | Admin changes an editor to admin | 200, role is `admin` |
| 1.3 | Admin changes an editor to viewer | 200, role is `viewer` |
| 1.4 | Admin changes an admin to editor or viewer while another admin exists | 200 |
| 1.5 | Each of the 3 roles as target, from each of the other 2 | All 6 transitions succeed |
| 1.6 | Response shape | Contains the membership fields (projectId, userId, role, and so on) and no extra user data such as password hashes |
| 1.7 | Persistence | A follow-up GET of the members list shows the new role |
| 1.8 | Other members are untouched | Only the target's membership changes |

## 2. Authorization
| # | Case | Expected |
|---|---|---|
| 2.1 | No auth token | 401 |
| 2.2 | Invalid or expired token | 401 |
| 2.3 | Caller is an `editor` of the project | 403, role unchanged |
| 2.4 | Caller is a `viewer` of the project | 403, role unchanged |
| 2.5 | Caller is not a member of the project | 403 or 404 (decide which, so project existence isn't leaked) |
| 2.6 | Caller is an admin of a different project, not this one | 403 (no cross-project privilege) |
| 2.7 | Caller is a global or system admin but not a project admin | Whatever the spec says. Clarify this. |
| 2.8 | A former admin who was just demoted tries again | 403 (authorization reads current state, not a cached role) |

## 3. Last-admin invariant
| # | Case | Expected |
|---|---|---|
| 3.1 | Sole admin demotes self to editor | Rejected (409 or 422), role still `admin` |
| 3.2 | Sole admin demotes self to viewer | Rejected, same as above |
| 3.3 | Two admins: one demotes self | 200, one admin remains |
| 3.4 | Two admins: A demotes B | 200 |
| 3.5 | Two admins: A demotes B, then A tries to demote self | Second call rejected |
| 3.6 | Sole admin sets own role to `admin` (no-op) | 200 and unchanged, or a consistent no-op response |
| 3.7 | Sole admin promotes another member to admin, then demotes self | Both succeed |
| 3.8 | Rejected demotion leaves no partial state | Membership and any audit log are unchanged |
| 3.9 | **Concurrency:** two admins demote each other simultaneously | At least one admin remains. Never zero. Needs a real DB, not mocks. |
| 3.10 | **Concurrency:** repeated parallel self-demotions by a sole admin | None succeed |

## 4. Input validation
| # | Case | Expected |
|---|---|---|
| 4.1 | Missing `role` | 400 or 422 |
| 4.2 | `role` is an unknown string (`"owner"`, `"superuser"`) | 400 or 422 |
| 4.3 | Wrong case (`"Admin"`, `"ADMIN"`) | Rejected, or consistently normalized (decide and test) |
| 4.4 | Wrong types (`null`, number, array, object, boolean, `""`) | 400 or 422 |
| 4.5 | Empty body or malformed JSON | 400 |
| 4.6 | Wrong or missing Content-Type | 400 or 415 |
| 4.7 | Extra fields (`userId`, `projectId`, `createdAt`) | Ignored or rejected, never applied (mass-assignment check) |
| 4.8 | Whitespace around the role (`" admin "`) | Rejected |
| 4.9 | Malformed `projectId` or `userId` (non-UUID or non-numeric, depending on the ID format) | 400 or 404, never a 500 |
| 4.10 | SQL or NoSQL injection strings in path params and `role` | Rejected safely, no 500 |

## 5. Resource existence
| # | Case | Expected |
|---|---|---|
| 5.1 | Project doesn't exist | 404 |
| 5.2 | Target user doesn't exist | 404 |
| 5.3 | Target user exists but isn't a member of this project | 404 (no implicit membership creation) |
| 5.4 | Target is a member of another project but not this one | 404, and the other project's membership is unchanged |
| 5.5 | Soft-deleted or archived project | Per spec. Clarify. |
| 5.6 | Deactivated or deleted target user | Per spec. Clarify. |

## 6. Idempotency and state
| # | Case | Expected |
|---|---|---|
| 6.1 | Set the same role the member already has | 200 with unchanged membership (not an error) |
| 6.2 | The same request sent twice | Same result both times |
| 6.3 | `updatedAt` (if present) | Changes on a real change. Decide whether it changes on a no-op. |
| 6.4 | Role takes effect immediately | A newly promoted editor can edit. A demoted admin loses admin endpoints on the next request. |

## 7. Side effects (only if they exist)
- Audit log entry on a role change, with actor, target, old role and new role. No entry on a rejected request.
- Notification or event emitted once per change. Nothing emitted on failure.

## Open questions to resolve before writing tests
1. Is there a separate "owner" concept that bypasses or changes the last-admin rule?
2. Is a no-op change (same role) a 200 or a 409?
3. Should non-members get 403 or 404, to avoid revealing that a project exists?
4. Do global or system admins override project-admin checks?
5. Is the last-admin check enforced at the DB level (constraint or transaction) or only in application code? This decides whether 3.9 and 3.10 are achievable.
6. What are the exact error body format and status codes (400 vs 422, 409 vs 422 for last-admin)?

## Suggested structure
- **Unit tests:** the role validation and the last-admin rule (pure logic, sections 3 and 4).
- **Integration tests:** against a real test DB with seeded projects and members, covering sections 1, 2, 5, 6 and the concurrency cases 3.9 and 3.10.
- **Fixtures:** a project with one admin, a project with two admins, and a mixed-role project. Also a second project to cover the cross-project cases.

Once you've answered the open questions, I can write the tests. Tell me which framework and test layout to use, or I can check the repo conventions.
