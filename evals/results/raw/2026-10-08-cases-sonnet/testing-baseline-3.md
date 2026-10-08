# testing-baseline-3

- Arm: **baseline** · Case: `testing` · Turns: 1 · Cost: $0.053662800000000004 · 23 s
- Project files (besides installed `.ai/`): none

## Prompt

Write the test plan for this endpoint. Don't write the tests yet.

`PATCH /projects/:projectId/members/:userId` — changes a member's role in a project. Body: `{ "role": "viewer" | "editor" | "admin" }`. Only project admins may call it. A project must always keep at least one admin. Returns the updated membership.

## Final response

# Test plan: `PATCH /projects/:projectId/members/:userId`

## Assumptions to confirm
The spec doesn't say what happens in these cases, so I've marked the expected results as **(assumed)**:

- **Status codes:** 200 success, 400 invalid body, 401 unauthenticated, 403 caller isn't an admin, 404 project or member not found, 409 or 422 for the last-admin rule.
- **Non-members:** a non-member caller gets 403 or 404. Hiding the project's existence with 404 is a policy choice.
- **No-op change:** setting a member's role to the one they already have returns 200 with the unchanged membership.
- **Self-change:** an admin may change their own role, as long as another admin remains.
- **Response shape:** the membership object includes at least `projectId`, `userId` and `role`. Add `updatedAt` if the API has it.

## 1. Happy path
| # | Case | Expect |
|---|---|---|
| 1.1 | Admin changes viewer → editor | 200, response `role: "editor"` |
| 1.2 | Admin changes editor → admin | 200, role is `admin` |
| 1.3 | Admin changes viewer → admin | 200 |
| 1.4 | Admin demotes another admin → editor or viewer, when 2+ admins exist | 200 |
| 1.5 | Admin demotes editor → viewer | 200 |
| 1.6 | Change is persisted | A follow-up GET or a DB read shows the new role |
| 1.7 | Response is the full updated membership, with the right `projectId` and `userId` and no extra fields such as other members' data | Shape matches the schema |
| 1.8 | Other members' roles and other projects' memberships are untouched | Unchanged |
| 1.9 | Same role as current (no-op) | 200, unchanged **(assumed)** |

## 2. Authorization
| # | Case | Expect |
|---|---|---|
| 2.1 | No auth token | 401, no change |
| 2.2 | Invalid or expired token | 401 |
| 2.3 | Caller is an editor | 403, no change |
| 2.4 | Caller is a viewer | 403, no change |
| 2.5 | Caller is not a member of the project | 403 or 404 **(assumed)** |
| 2.6 | Caller is an admin of a *different* project, not this one | 403 or 404. This guards against cross-project privilege leaks. |
| 2.7 | A formerly-admin caller who was demoted earlier | 403. Authorization is not cached or stale. |
| 2.8 | A non-admin tries to promote themselves to admin | 403, role unchanged (privilege escalation) |

## 3. Last-admin invariant
| # | Case | Expect |
|---|---|---|
| 3.1 | Sole admin demotes themselves to editor or viewer | Rejected (409/422), still admin |
| 3.2 | Two admins, A demotes B | 200, one admin left (A) |
| 3.3 | Two admins, A demotes B, then A tries to demote themselves | Second call rejected |
| 3.4 | Sole admin sets their own role to `admin` (no-op) | 200 |
| 3.5 | Sole admin demotes a non-admin member (no-op or other change) | 200, admin count still 1 |
| 3.6 | **Concurrency:** two admins simultaneously demote each other | At most one succeeds, and at least one admin remains. This is the key race test, and it needs a real DB with transactions or locking. |
| 3.7 | Concurrency: the same demotion request sent twice in parallel | Consistent final state with no error 500 |
| 3.8 | Rejected request leaves no partial writes | Role unchanged and no audit or event emitted |
| 3.9 | The error body clearly identifies the last-admin reason | Distinguishable from other 4xx errors |

## 4. Validation
| # | Case | Expect |
|---|---|---|
| 4.1 | Missing `role` | 400 |
| 4.2 | `role` is an unknown string (`"owner"`, `"superadmin"`) | 400 |
| 4.3 | Wrong case (`"Admin"`, `"ADMIN"`) | 400 **(assumed: strict)** |
| 4.4 | Wrong type (`null`, number, array, object, boolean) | 400 |
| 4.5 | Empty string, or whitespace | 400 |
| 4.6 | Empty body, or invalid JSON | 400 |
| 4.7 | Extra fields (`userId`, `projectId` in body, `isOwner: true`) | Ignored or 400, but never applied |
| 4.8 | Wrong `Content-Type` | 415 or 400 |
| 4.9 | Malformed `projectId` or `userId` (not a UUID or valid ID format) | 400 or 404 **(assumed)** |
| 4.10 | Body `userId` differs from the path `userId` | The path value wins and the body is ignored |

## 5. Resource existence
| # | Case | Expect |
|---|---|---|
| 5.1 | Project doesn't exist | 404 |
| 5.2 | User exists but isn't a member of this project | 404 |
| 5.3 | User doesn't exist at all | 404 |
| 5.4 | Project is deleted or archived | 404 or 403/409 **(assumed, need to confirm)** |
| 5.5 | Target member was removed just before the call | 404 |
| 5.6 | Target is a member of another project only | 404, and no role change in either project |

## 6. Side effects and non-functional
- **6.1** Audit log or domain event (if the system has one) is emitted on success and *not* on failure.
- **6.2** A role change takes effect immediately. The demoted user's next request is checked against the new role, and a promoted user gains the new permissions.
- **6.3** The endpoint is idempotent: repeating the same request gives the same result.
- **6.4** Error responses don't leak internals such as stack traces or other members' data.
- **6.5** Rate limiting, if any, returns 429.
- **6.6** `PUT`, `POST` and `DELETE` on this route aren't accidentally routed to this handler (405).

## Suggested test layering
- **Unit:** the role-change service logic. This covers the permission check, the last-admin rule (including counting admins with the target excluded), and the no-op case.
- **Integration (API + real DB):** sections 1–5, plus the concurrency tests in 3.6 and 3.7. These must run against a real database, since mocks can't prove the race is handled.
- **Contract:** response schema validation against the OpenAPI spec, if one exists.
- **Priority:** the last-admin tests (section 3), authorization (section 2), and the 2.8 privilege-escalation case come first.

## Open questions for you
1. What are the exact status codes for the last-admin violation and for non-member callers?
2. Can an admin demote themselves when another admin exists?
3. Is a no-op change a 200 or a 4xx?
4. Does the project have an "owner" concept beyond admin?
5. What does the test setup have: a real DB, an auth helper, and fixtures for projects and members?

Once you've settled those, I can write the tests. I'd also need to see the codebase's test framework and conventions first.
