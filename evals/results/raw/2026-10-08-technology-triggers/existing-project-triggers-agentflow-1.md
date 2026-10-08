# existing-project-triggers-agentflow-1

- Arm: **agentflow** · Case: `existing-project-triggers` · Turns: 7 · Cost: $0.4178524 · 64 s
- Project files (besides installed `.ai/`): `.nvmrc`, `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package-lock.json`, `package.json`, `src/app.js`, `src/notifications/sendOnStatusChange.js`, `src/services/userService.js`

## Prompt

Add an endpoint so a user can delete one of their company's projects.

## Final response

I haven't written any code yet. This repo's rules say a change in behavior needs approved Gherkin scenarios first (Gate 2, in `.ai/system/QUALITY_GATES.md`). I also tried to save the plan below as `.ai/work-items/features/FEAT-001-delete-company-project.md` and `.ai/projects/current/CURRENT_STATUS.md`, but that write needed your permission, so neither file exists yet.

## What I found in the repo
- **Request type:** an addition to an existing project. It touches tenant isolation, so a user must never be able to delete another company's project.
- **Stack** (from the lock file and `.nvmrc`): Node 16, express 4.19.2, jsonwebtoken 8.5.1, bcrypt 5.1.1. I'm not proposing any stack change.
- **Only 3 source files exist.** `src/app.js` requires `src/db`, `src/auth`, `src/events` and `src/mailer`, but none of them are in the repo, and `node_modules` isn't installed. That means I can't see what delete method `db.projects` has, and I can't run the app or any tests here.
- **No tests:** I searched for `*.test.*` and `*.feature` files and found none.
- **No roles:** I searched `src`, README and USAGE for role, admin and delete and found nothing. The login token only carries the user ID and `companyId`.

## Proposed behavior (draft, needs your approval)
The endpoint would be `DELETE /projects/:id`, behind `requireLogin`. It deletes only where both the ID and the caller's `companyId` match, and the company always comes from the login token, never from the request. It returns 204 on success and 401 when the caller isn't logged in. It returns 404 both when the project doesn't exist and when it belongs to another company, so users can't discover other companies' project IDs.

```gherkin
Feature: Delete project
  As a member of a company
  I want to delete one of my company's projects
  So that projects we no longer need are removed

  Background:
    Given the company "Acme" has the project "Website Redesign"
    And the company "Globex" has the project "Q3 Launch"

  Scenario: A member deletes one of their company's projects
    Given "dana@acme.com" is signed in as a member of "Acme"
    When "dana@acme.com" deletes the project "Website Redesign"
    Then the deletion is confirmed with no content returned
    And the project "Website Redesign" can no longer be retrieved

  @critical @security @authorization
  Scenario: A member cannot delete another company's project
    Given "dana@acme.com" is signed in as a member of "Acme"
    When "dana@acme.com" attempts to delete the project "Q3 Launch"
    Then the request is refused as not found
    And the project "Q3 Launch" still exists for "Globex"

  @critical @security @authentication
  Scenario: An anonymous caller cannot delete a project
    Given the caller is not signed in
    When the caller attempts to delete the project "Website Redesign"
    Then the request is refused as unauthenticated
    And the project "Website Redesign" still exists for "Acme"

  Scenario: Deleting a project that does not exist
    Given "dana@acme.com" is signed in as a member of "Acme"
    When "dana@acme.com" attempts to delete a project that does not exist
    Then the request is refused as not found

  Scenario: Deleting the same project twice
    Given "dana@acme.com" is signed in as a member of "Acme"
    And "dana@acme.com" has already deleted the project "Website Redesign"
    When "dana@acme.com" deletes the project "Website Redesign" again
    Then the request is refused as not found
```

## Questions before I can finish the plan
1. **Who can delete?** Any member of the company, or only some role? There are no roles today, so I've assumed any member.
2. **Permanent or recoverable?** Should the project be removed for good or just marked as deleted?
3. **Related data:** What should happen to orders or other records linked to the project? I can't check this because `src/db` is missing.
4. **Missing code:** Can you add `src/db` and `src/auth`, or tell me where they live? I need them to write the change and run tests.

## Problems I found outside this request (not fixed)
- **Security:** `GET /projects/:id` looks a project up by ID only, so any logged-in user can read another company's project.
- **Security:** `PATCH /orders/:id/status` has the same problem, so a user can change another company's orders. It also accepts any `status` value without checking it.
- **Bug:** Order status emails go out twice, once from the direct `notifyStatusChange` call and once from the `order.statusChanged` event listener.
- **Old versions:** Node 16 is no longer supported. jsonwebtoken 8.x has published security advisories that 9.x fixes; I haven't checked the current advisory list.

I'd suggest treating the first two as separate bug fixes, and doing them first.

Please approve or edit the scenarios and answer the questions. After that I'll put together the design and task list for your second approval, then write the code and tests. Do you also want me to save the plan to those two `.ai/` files? That's the write that needed permission.
