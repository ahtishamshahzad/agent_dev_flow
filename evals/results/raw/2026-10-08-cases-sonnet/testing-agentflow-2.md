# testing-agentflow-2

- Arm: **agentflow** · Case: `testing` · Turns: 6 · Cost: $0.10649020000000001 · 28 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

Write the test plan for this endpoint. Don't write the tests yet.

`PATCH /projects/:projectId/members/:userId` — changes a member's role in a project. Body: `{ "role": "viewer" | "editor" | "admin" }`. Only project admins may call it. A project must always keep at least one admin. Returns the updated membership.

## Final response

There's no application code in this repo yet (`.ai/projects/current/` is the empty state, and nothing matches this route). So this plan comes from your spec alone. Under `GHERKIN_RULES.md`, each case below is a scenario title that will map to one named test, and the plan needs your approval before I write the scenarios or tests.

## Test plan: `PATCH /projects/:projectId/members/:userId`

### Questions to settle first
Each of these changes the expected result, so the plan assumes the default shown and I'll adjust if you say otherwise.

| # | Question | Assumed default |
|---|---|---|
| 1 | Can an admin change their own role? This is only blocked if they're the last admin. | Allowed. |
| 2 | What status code and error body does each failure return? | 401 unauthenticated, 403 non-admin, 404 not found, 400 or 422 invalid body, 409 last admin. |
| 3 | Is a non-member caller told 403 or 404? A 404 would avoid revealing that the project exists. | 403. |
| 4 | Is setting a member to their current role a no-op returning 200? | 200 and no change. |
| 5 | Does a role change take effect on the target's existing sessions immediately? | Yes, because permissions are read per request. |
| 6 | Is there audit logging or a notification on role change? | Out of scope. |

### 1. Happy path
- An admin promotes a viewer to editor.
- An admin promotes an editor to admin.
- An admin demotes another admin to editor while a third admin remains.
- An admin demotes an editor to viewer.
- The response is the updated membership (userId, projectId, new role) and matches what a later read returns.
- Setting a member to their current role returns 200 with no change (question 4).

### 2. Authorization denial (`@security`)
- An editor attempts a role change and gets 403, and the role is unchanged.
- A viewer attempts a role change and gets 403, and the role is unchanged.
- A user who isn't a member of the project attempts a role change and is refused (question 3).
- An admin of project A cannot change roles in project B.
- An unauthenticated request gets 401.
- A request with an expired or invalid token gets 401.
- An editor cannot promote themselves to admin.
- An admin who was just demoted can no longer call the endpoint.

### 3. Last-admin invariant (`@critical`)
- Demoting the sole admin (self-demotion) is rejected with 409 and the role is unchanged.
- Demoting the sole admin to each of editor and viewer is rejected for both roles.
- Demoting one of two admins succeeds, leaving exactly one admin.
- Two admins demoting each other concurrently never leaves zero admins. Exactly one request succeeds and the other gets 409.
- An admin changing their own role from admin to admin succeeds when they are the only admin.
- After a rejected demotion, the project still has at least one admin.

### 4. Invalid input
- An unknown role such as `"owner"` is rejected.
- A role in the wrong case, such as `"Admin"`, is rejected.
- An empty string, `null`, a number, or an array for `role` is rejected.
- A missing `role` field is rejected.
- An empty body or a malformed JSON body is rejected.
- Extra fields in the body, such as `userId` or `projectId`, are ignored or rejected. They never change the membership's identity.
- A non-UUID or malformed `projectId` or `userId` is rejected.
- A wrong content type is handled.

### 5. Not found
- A nonexistent project returns 404.
- A nonexistent user returns 404.
- A user who exists but isn't a member of this project returns 404, and no membership is created.
- A soft-deleted or removed member returns 404.
- An archived or deleted project follows the defined behavior.

### 6. Authorization versus validation order
- A non-admin sending an invalid body gets 403, not 400, so validation errors don't leak to unauthorized callers.
- A non-admin targeting a nonexistent user gets 403.

### 7. Side effects and isolation
- Only the target's role changes. Other members' roles and the target's other-project memberships stay the same.
- A failed request (403, 400, 404 or 409) leaves no partial writes.
- A repeated identical request is idempotent.
- Concurrent role changes to the same member leave a valid final state.

### Test layers
- **Unit:** the last-admin rule, as a pure function over (current members, target, new role).
- **Integration (API and database):** everything above, using a real database so transactions and concurrency are exercised.
- **Concurrency tests:** the two cases in sections 3 and 7, run against a real database. Mocks can't show whether the invariant holds under races.

### Test data
- Project P1 with one admin, one editor and one viewer.
- Project P2 with two admins.
- A second project, to test cross-project isolation.
- A user who isn't a member of any project.

### Not covered
- Adding or removing members.
- Project-level permissions that aren't about roles.
- Rate limiting.

Once you've answered the questions (or accepted the defaults), I'll draft the Gherkin scenarios in `features/` for your approval. I'll write the tests only after the stack and test framework are chosen, since none exists in the repo yet.
