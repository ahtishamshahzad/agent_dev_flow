# insufficient-context-agentflow-1

- Arm: **agentflow** · Case: `insufficient-context` · Turns: 14 · Cost: $0.2709138 · 41 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package.json`, `src/app.js`, `src/notifications/sendOnStatusChange.js`, `src/services/userService.js`

## Prompt

Make deleting a project a soft delete, so a deleted project can be restored later.

## Final response

I didn't change any code. There's nothing to turn into a soft delete yet: the app has no way to delete a project at all. And while looking, I found a security problem that comes first.

## ⚠️ Security issue: any logged-in user can read any company's project

`src/app.js:18-22`: `GET /projects/:id` checks that the caller is logged in, but not that the project belongs to their company. Every other place in the app filters by company (for example, `listUsers(req.user.companyId)`). So a user from Company A can read Company B's projects by trying different IDs.

- **Severity:** I'd rate it P1. I've only confirmed it by reading the code, not by running a request.
- **Smallest safe fix:** look the project up by both `id` and `req.user.companyId`, and return 404 when there's no match. Use 404 rather than 403 so the response doesn't reveal that the project exists.
- **Why it matters here:** a restore endpoint would copy this same lookup, so this should be fixed before or alongside the soft-delete work.

I'd log this as its own bug and fix it under the bug workflow. Do you want me to do that?

## What's in the code now

I searched everything outside `.ai/` for `delete|destroy|deletedAt|paranoid|restore|archiv` and got no matches. The only files under `src/**` are `app.js`, `services/userService.js` and `notifications/sendOnStatusChange.js`.

- **No delete route or function** for projects.
- **The database module and schema aren't in the repo.** `./db`, `./auth`, `./events` and `./mailer` are imported but missing, so I can't see the projects table or the ORM. `db.users.findAll({ where, order })` looks like Sequelize, but I'm guessing.
- **No tests and no Gherkin `.feature` files.** `npm test` runs `node --test`, but there are no test files.
- **No project status file:** `.ai/projects/current/` is in its empty state.
- **`package.json` only lists `express`**, but the code also uses `bcrypt` and `jsonwebtoken`.

So this is a new feature: adding delete, restore and filtering of deleted projects. The project rules require the behaviour scenarios to be approved before any code is written.

## Questions that block a correct plan

1. **Where is the database layer?** Which ORM or driver and which database, and are there migrations? Soft delete is a schema change (for example, a `deletedAt` column), so I need to see how the schema is managed.
2. **Who can delete and restore?** Any logged-in user in the company, only an admin, or only the project owner? There's no role model in the visible code.
3. **Is there a time limit on restoring?** Restorable forever, or permanently removed after N days, which would need a cleanup job?
4. **Can people see deleted projects?** For example, a "trash" list endpoint, or are they only reachable through restore?
5. **What happens to child records** (tasks, files and so on) when a project is deleted? I can't see any.

## Provisional proposal (if you have no strong preferences)

- `DELETE /projects/:id` sets a `deletedAt` timestamp and stores who deleted it.
- `POST /projects/:id/restore` clears it.
- All project reads exclude deleted projects by default. If it is Sequelize, `paranoid: true` does this.
- Every lookup is limited to the caller's company.
- Any logged-in member of the company can delete and restore, with no time limit and no trash list.
- No new libraries and no new stack.

If deleting should be admin-only, that adds a role check. A time limit adds a scheduled cleanup job. Having no ORM means writing the filter by hand on every query.

## Draft scenarios (for your approval)

```gherkin
Feature: Soft-delete and restore projects

  Background:
    Given I am logged in as a member of company "Acme"
    And "Acme" has a project "Apollo"

  @critical
  Scenario: Deleting a project hides it but keeps its data
    When I delete "Apollo"
    Then the response is 204
    And fetching "Apollo" returns 404
    But "Apollo" still exists in storage, marked deleted

  @critical
  Scenario: Restoring a deleted project
    Given "Apollo" has been deleted
    When I restore "Apollo"
    Then the response is 200
    And fetching "Apollo" returns the project unchanged

  @critical @security
  Scenario: Cannot delete or restore another company's project
    Given company "Globex" has a project "Zeus"
    When I delete "Zeus"
    Then the response is 404
    And "Zeus" is not marked deleted
    When "Zeus" has been deleted by Globex and I restore it
    Then the response is 404

  Scenario: Deleting an already-deleted project
    Given "Apollo" has been deleted
    When I delete "Apollo"
    Then the response is 404

  Scenario: Restoring a project that is not deleted
    When I restore "Apollo"
    Then the response is 409

  Scenario: Deleting or restoring a project that never existed
    When I delete project "does-not-exist"
    Then the response is 404

  Scenario: Unauthenticated requests are rejected
    Given I am not logged in
    When I delete "Apollo"
    Then the response is 401
```

**Unchanged:** fetching an existing project that isn't deleted works exactly as it does today, apart from the company check above.

## Unrelated issue I noticed

`src/app.js:27-28` together with `sendOnStatusChange.js:9`: changing an order's status emails the customer twice, once through the event and once through the direct call. That's outside this request, so I've left it as a possible separate bug.

Once you answer the questions and approve or edit the scenarios, the next steps are the design (schema change and routes), the task list, and then your second approval before any code.
