# testing-agentflow-3

- Arm: **agentflow** · Case: `testing` · Turns: 9 · Cost: $0.1352776 · 39 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

Write the test plan for this endpoint. Don't write the tests yet.

`PATCH /projects/:projectId/members/:userId` — changes a member's role in a project. Body: `{ "role": "viewer" | "editor" | "admin" }`. Only project admins may call it. A project must always keep at least one admin. Returns the updated membership.

## Final response

The repo has no application code or stack yet. So this plan follows `.ai/templates/TEST_PLAN.md` and `GHERKIN_RULES.md`, and it assumes nothing about the framework.

# Test Plan — `PATCH /projects/:projectId/members/:userId`

**Date:** 2026-10-08 · **Status:** draft (needs your approval before any scenarios or tests are written)

## Selection

| Level | Use |
|---|---|
| API integration (Supertest if the stack is Node, otherwise the stack's equivalent) | Almost everything: auth, validation, last-admin invariant, response shape |
| Unit (Jest/Vitest or equivalent) | The role-change policy only: "would this leave zero admins?" |
| Concurrency integration | The last-admin race (see Risks) |

- **Not adopted:** Playwright and Maestro, since this is a backend endpoint. A contract test is also out for now, because there's no consumer yet.
- **Stack is undecided.** Tool choice waits on `STACK_DECISION_RULES.md`. The test levels above don't depend on it.

## Required cases, one Gherkin scenario each

Scenarios go in `features/projects/change-member-role.feature`. Each test name contains its scenario title. Items marked `@critical` block release.

**Happy path**
1. `@critical` An admin changes an editor to viewer and receives the updated membership.
2. An admin promotes a viewer to admin.
3. An admin demotes another admin when a second admin remains.
4. An admin demotes themself when another admin remains.
5. Setting a member to the role they already have leaves it unchanged. This is idempotent and returns 200 with the membership. *(Open question 3.)*
6. The response contains the updated membership: `projectId`, `userId`, and the new `role`. The change is also persisted, which a follow-up read confirms.

**Invalid input** (a `Scenario Outline` for the role values)
7. A role outside `viewer | editor | admin` is rejected. Examples: `"owner"`, `"ADMIN"`, `""`, `null`, `123`, `["admin"]`.
8. A missing `role` field is rejected.
9. An empty or non-JSON body is rejected.
10. Unknown body fields (`userId`, `projectId`, `isOwner`) are ignored and never applied (mass assignment).
11. A malformed `projectId` or `userId` is rejected as a validation error, not a 500.

**Error paths**
12. `@critical` Demoting the only admin, even when they demote themself, is rejected with a conflict. The role is unchanged.
13. The target user is not a member of the project, so the response is not found.
14. The project does not exist, so the response is not found.
15. The error body uses the central safe error shape, with no stack traces or SQL.
16. A failure partway through (simulated datastore error) leaves the role unchanged and returns a safe 500.

**Authorization denial** (`@security @authorization`, each states the actor, the action, and the refusal)
17. `@critical` An editor cannot change a role, and the role stays the same.
18. `@critical` A viewer cannot change a role.
19. `@critical` An admin of project A cannot change roles in project B (cross-project and cross-tenant).
20. A user who isn't a project member gets the decided refusal (403 or 404). *(Open question 1.)*
21. An unauthenticated request, or one with an invalid or expired token, gets 401.
22. An editor cannot promote themself to admin (privilege escalation through role mutation).
23. A `userId` or `projectId` in the body does not override the path or the session scope.
24. A removed or suspended admin can no longer call the endpoint. *(Applies if such states exist.)*

**Regression**
25. `@critical @regression` Two admins demote each other at the same time. At least one admin remains, and one request fails with a conflict. This needs a transaction or row lock, and the test runs both requests in parallel.
26. Two concurrent promotions or demotions of the same member end in a consistent final state.
27. Placeholder: every bug found later gets its own `@bug-NNN` scenario.

**Environment and config**
28. If the roles are configurable or enum-backed, the app fails fast at startup on a mismatch between the API enum and the DB enum. If neither is configurable, this case is marked "not applicable" explicitly.

## Coverage by risk

| Critical path | Level | Gap |
|---|---|---|
| Last-admin invariant (data integrity) | Unit (policy) plus API integration | The race (#25) must hit a real DB with real transactions. A mocked repository can't prove it. |
| Privilege escalation and role authorization | API integration | Query-level scoping is only verifiable against the real schema. |
| Cross-project isolation | API integration, two projects with different admins | None planned |
| Input validation | API integration (outline) | None planned |

No coverage-percentage target.

## Data and environment

- **Personas (factories):** `adminA1`, `adminA2`, `editorA`, `viewerA` (all in project A); `adminB` (project B); `outsider` (no memberships); `soleAdminC` (project C, only admin).
- **Environment:** the production-engine datastore, not SQLite as a stand-in. Auth is real middleware with signed test tokens. Externals are faked.
- **Isolation:** each scenario builds its own data and runs in any order. The concurrency tests use separate projects, so they can't affect other tests.

## Open questions (they change the scenarios)

1. **Non-member or wrong-project caller:** 403 or an existence-hiding 404? This affects #13, #14, and #20.
2. **Last-admin status code:** 409 or 422? Also, does demoting yourself get a distinct message?
3. **No-op role change:** 200 or 204, and does it still write an audit or `updatedAt` entry?
4. **Can an admin change the role of the project's creator or owner?** The spec says nothing about this.
5. **Do pending, invited, or suspended memberships exist,** and are they in scope?
6. **Exact response shape.** Does it include user details or only IDs, and does it include `updatedAt`?
7. **Rate limiting or audit logging** on role changes. If either is required, it needs scenarios.

## Next steps

I need answers to the open questions, at least 1–3. Then I'll draft the `.feature` file for your approval at Gate 2. I haven't written a file, scenario, or test. I can also save this plan to `.ai/projects/current/` if you want it there.
