# testing-baseline-2

- Arm: **baseline** · Case: `testing` · Turns: 2 · Cost: $0.1273612 · 42 s
- Project files (besides installed `.ai/`): none

## Prompt

Write the test plan for this endpoint. Don't write the tests yet.

`PATCH /projects/:projectId/members/:userId` — changes a member's role in a project. Body: `{ "role": "viewer" | "editor" | "admin" }`. Only project admins may call it. A project must always keep at least one admin. Returns the updated membership.

## Final response

# Test plan: `PATCH /projects/:projectId/members/:userId`

The working directory is empty, so this plan is based only on the spec you gave. The spec doesn't settle some behaviours. I've marked those **[decide]** and listed them at the end, because their tests can't be written until they're decided.

## Fixtures

- **Project P** with: `adminA`, `adminB`, `editorE`, `viewerV`
- **Project P1** with exactly one admin, `soloAdmin`, plus `editorE1`
- **Project Q**, which is unrelated; `adminQ` is its admin and has no membership in P
- An authenticated user `outsider` who belongs to no project
- An unauthenticated request (no token, or an expired or invalid one)

## 1. Happy path: every role change works

Run each case as `adminA` against P.

| # | Target | From → To | Expect |
|---|---|---|---|
| 1.1 | viewerV | viewer → editor | 200, membership shows `editor` |
| 1.2 | viewerV | viewer → admin | 200 |
| 1.3 | editorE | editor → viewer | 200 |
| 1.4 | editorE | editor → admin | 200 |
| 1.5 | adminB | admin → editor | 200 (adminA is still an admin) |
| 1.6 | adminB | admin → viewer | 200 |
| 1.7 | adminA (self) | admin → editor | 200, because adminB is still an admin **[decide: is self-demotion allowed?]** |

For each case, check:
- The response body is the updated membership: the right `projectId`, `userId` and new `role`, and the documented shape (no extra internal fields leaked).
- The change is actually saved. A follow-up GET or DB read shows the new role.
- No other membership in P or Q changed.
- `updatedAt` or the audit fields change, if the model has them.

## 2. Authorization

| # | Caller | Expect |
|---|---|---|
| 2.1 | Unauthenticated | 401, no change |
| 2.2 | Invalid or expired token | 401 |
| 2.3 | `editorE` | 403, no change |
| 2.4 | `viewerV` | 403 |
| 2.5 | `editorE` trying to promote themselves to admin | 403. This privilege-escalation case is the most important one in this section. |
| 2.6 | `adminQ` (admin of a different project) on P | 403 or 404 **[decide]**. Being admin of Q must give no rights in P. |
| 2.7 | `outsider` | 403 or 404 **[decide]** |
| 2.8 | `adminA` on P where `:userId` is a member of Q but not P | 404. Must not change the Q membership. |
| 2.9 | A caller demoted from admin moments ago, using the same session or token | 403. Permission is checked live, not cached from the token. |

**Order of checks:** a non-admin calling with an invalid body or a nonexistent target should get 403, not 400 or 404. Otherwise the error codes reveal which members and projects exist.

## 3. Last-admin rule

| # | Scenario | Expect |
|---|---|---|
| 3.1 | `soloAdmin` demotes themselves to editor | 409 or 422 **[decide]**, with a clear error code; role unchanged |
| 3.2 | `soloAdmin` demotes themselves to viewer | Rejected, unchanged |
| 3.3 | `soloAdmin` sets themselves to admin (no-op) | 200 and not counted as a demotion **[decide on no-op behaviour]** |
| 3.4 | P has two admins: adminA demotes adminB, then adminB's later attempt to demote adminA | First call 200. The second returns 403, because adminB is no longer an admin. |
| 3.5 | P has two admins: adminA demotes adminB, then adminA tries to demote themselves | First call 200, second rejected as the last admin |
| 3.6 | Promote editorE1 in P1 to admin, then demote soloAdmin | Both 200. Shows that admins are counted live. |
| 3.7 | The admin count includes only P's admins, not Q's | With adminQ around, soloAdmin still can't demote themselves |
| 3.8 | Admin count with soft-deleted, removed, pending or invited admin memberships (if these exist) | They must not count toward "at least one admin" |

### Concurrency (most likely real bug)

A plain "count the admins, then update" implementation is a race condition.

- **3.9:** P has exactly two admins. Send both requests at the same time: adminA demotes adminB, and adminB demotes adminA. Exactly one must succeed, and P must end up with at least one admin. Repeat about 50 times or use a barrier to make the race reliable.
- **3.10:** P has two admins and both demote themselves at the same time. Same requirement: at least one admin remains.
- **3.11:** One request demotes an admin while another removes the other admin from the project (if a DELETE member endpoint exists). The rule must hold across both endpoints.

These need a real database with transactions. Mocks or an in-memory store will hide the race.

## 4. Input validation

All sent as `adminA` against a valid target. Each should return 400 or 422 and leave the role unchanged.

- Missing `role`, or an empty body `{}`
- `role: "owner"`, `""`, `null`, `123`, `true`, `["admin"]`, `{}`
- Case variants: `"Admin"`, `" admin "` **[decide: strict, presumably]**
- Body that isn't JSON or is malformed, or the wrong `Content-Type`
- Extra fields such as `{ "role": "editor", "userId": "other" }` or `{ "role": "editor", "projectId": "Q" }`. Either reject them or ignore them, but they must never override the path parameters.
- Malformed `:projectId` or `:userId` (wrong format, non-UUID, very long): 400 or 404, never a 500
- Nonexistent `:projectId`: 404
- Nonexistent `:userId`, or a real user who isn't in P: 404

## 5. Idempotency and no-ops

- Setting a role to its current value (editor → editor): 200 with the same body **[decide]**. No audit event, or one marked as a no-op.
- Sending the same request twice gives the same final state.

## 6. Side effects (if they exist in the system)

- An audit log entry records who changed whose role, from what, to what.
- Notifications or events are emitted on success and not on failure.
- Permissions update immediately. A user demoted to viewer gets 403 on their next editor-level action, and a user promoted to admin can call this endpoint straight away.
- If permissions are cached, the cache is invalidated.

## 7. Error response contract

- Every failure has the standard error shape, with a machine-readable code that tells "last admin" apart from "forbidden" and "validation".
- No stack traces or internal IDs leak.
- No failure path partly changes data. Check the DB after each negative test.

## Open questions to settle before writing tests

1. **Self-demotion:** can an admin demote themselves when other admins exist? (I've assumed yes.)
2. **Status code for the last-admin rule:** 409 or 422?
3. **Non-member callers:** 403 or 404 (hiding whether the project exists)?
4. **No-op changes:** 200 with no audit entry, or something else?
5. **Membership states:** do pending, invited or soft-deleted memberships exist, and do they count as admins?
6. **Unknown body fields:** reject them or ignore them?
7. **Other endpoints:** do any others (remove member, leave project, delete user account) need to enforce the same last-admin rule? If so, each needs its own tests.

**Priority if time is short:** sections 2.5, 3.1 and 3.9 to 3.10 cover privilege escalation and the race on the last-admin rule. Then the rest of sections 2 and 3, then section 1, then the others.
