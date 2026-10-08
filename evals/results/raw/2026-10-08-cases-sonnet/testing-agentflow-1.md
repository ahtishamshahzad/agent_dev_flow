# testing-agentflow-1

- Arm: **agentflow** · Case: `testing` · Turns: 7 · Cost: $0.1301886 · 25 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

Write the test plan for this endpoint. Don't write the tests yet.

`PATCH /projects/:projectId/members/:userId` — changes a member's role in a project. Body: `{ "role": "viewer" | "editor" | "admin" }`. Only project admins may call it. A project must always keep at least one admin. Returns the updated membership.

## Final response

# Test plan: `PATCH /projects/:projectId/members/:userId`

There is no application code or stack in this repo, so this plan is stack-neutral. Following `GHERKIN_RULES.md` and `backend-integration-testing`, each case below becomes one Gherkin scenario and then one named test. Nothing is written yet.

## Approach
- **Level:** integration tests over real HTTP against the production-engine database. The data layer is not mocked.
- **Personas:** anonymous, project admin, second project admin, editor, viewer, non-member, admin of a different project.
- **Isolation:** each test seeds its own project and memberships, so tests don't depend on order.
- **Unit tests:** a few for the "last admin" rule, if it ends up as a standalone function.
- **Assertions:** check status codes, the error code and the response shape, not exact message strings.

## Cases

**Happy path** (`@critical`)
1. An admin changes an editor to viewer. The response is 200, returns the updated membership, and a follow-up read shows the new role.
2. An admin promotes a viewer to editor, and an editor to admin.
3. An admin demotes another admin to editor when a third admin exists.
4. An admin sets a member to the role they already have. This is idempotent: 200, nothing changes.
5. The response contains only the membership fields in the contract (no leaked user data).

**Authorization denial** (`@security @authorization @critical`)
6. Anonymous request returns 401.
7. Invalid or expired token returns 401.
8. Editor and viewer each get 403, and the role is unchanged.
9. A non-member gets the response chosen under the open question on 403 vs 404 below.
10. An admin of project A can't change a member of project B, even with a valid guessed `projectId`. This is the cross-tenant check.
11. An editor can't promote themselves to admin. This is the self-escalation check.
12. The project ID comes from the path. Any `projectId` or `userId` in the body is ignored.
13. After a demotion, the demoted admin's next call is rejected, so the demotion takes effect immediately even if claims are cached.

**Last-admin invariant** (`@critical`)
14. The sole admin demotes themselves to editor or viewer. This is rejected with a 4xx (likely 409 or 422) and they stay admin.
15. The sole admin is the target and another admin tries to demote them. This can't happen with one admin, so this case is covered by 14.
16. With two admins, one demotes themselves. This succeeds and one admin remains.
17. Two admins demote each other at the same time. Exactly one request succeeds and at least one admin remains. This needs a concurrency test and probably a transaction or row lock.
18. A sole admin "changes" themselves to admin. This is a no-op that succeeds.

**Validation** (`Scenario Outline` where the behavior is the same)
19. Invalid `role` values are rejected with 400 or 422 and no change: `"owner"`, `"ADMIN"`, `""`, `null`, a number, an array, an object.
20. A missing `role` field and an empty body are both rejected.
21. Unknown extra fields (e.g. `{"role":"viewer","isOwner":true}`) are rejected or ignored, per the contract. The membership never gets the extra field.
22. A malformed JSON body returns 400.
23. A malformed `projectId` or `userId` (not a valid ID) returns 400 or 404, per the contract.
24. An oversized body is rejected.

**Not found**
25. The `userId` isn't a member of the project (including a real user who isn't a member) returns 404, with no membership created.
26. The `projectId` doesn't exist returns 404 for an admin-level caller.
27. A deleted or deactivated user is the target. The behavior follows the answer to the open question below.

**Persistence and side effects**
28. A rejected request leaves the DB unchanged (check 8, 14 and 19).
29. Other members' roles don't change.
30. If role changes are audited (see the `role-permission-design` rule that assignment is audited), an audit record is written on success and none on failure. This case only applies if audit logging is in scope.

## Open questions (they decide the expected values)
1. **Non-member caller:** 403 or 404? A 404 avoids revealing that the project exists.
2. **Last-admin violation:** which status and error code (409 or 422)?
3. **Unknown body fields:** reject (400) or ignore?
4. **Self-demotion with other admins present:** allowed? I've assumed yes, per case 16.
5. **Same-role update:** a 200 no-op, as assumed, or a 4xx?
6. **Roles in tokens:** are roles cached in the JWT or session? If so, case 13 needs a refresh or invalidation story.
7. **Audit logging:** is it required for this endpoint?
8. **Stack and test framework:** undecided. This is a stack decision under `STACK_DECISION_RULES.md`, so I won't assume one.

## Next steps
Once you answer the open questions, I'd write these as a `features/projects/change-member-role.feature` file with `@critical` tags on 1, 6–11, 13, 14, 16 and 17. That file needs your approval at Gate 2 before any test code. Do you want me to draft it?
