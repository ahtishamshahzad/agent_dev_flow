# keep-existing-stack-agentflow-1

- Arm: **agentflow** · Case: `keep-existing-stack` · Turns: 21 · Cost: $0.41580280000000003 · 60 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package.json`, `src/app.js`, `src/notifications/sendOnStatusChange.js`, `src/services/userService.js`

## Prompt

Add an endpoint so a user can delete one of their company's projects.

## Final response

I haven't written any code yet. The project's rules (`CLAUDE.md` → `.ai/system/QUALITY_GATES.md`) require your approval of the feature's behavior before any behavior-changing code. Below are what I found in the existing code, the behavior I'm proposing, and the questions I need answered.

## Classification
**Existing project enhancement / feature:** a new API endpoint in the existing Express service. No new apps and no stack change.

## Audit of the existing code (read only, nothing edited)
- **Stack:** Express `^4.19.2`, CommonJS, tests via `node --test`. There's no lockfile, so the installed versions can't be confirmed. I'll keep this stack as it is.
- **Can't run as shipped:** `src/app.js` requires `./db`, `./auth`, `./events` and `./mailer`, and none of those files exist. `bcrypt` and `jsonwebtoken` are used in `src/services/userService.js` but aren't listed in `package.json`.
- **No tests and no `features/` folder.** No scenarios exist for projects yet.
- **Login token:** it already carries `companyId` (`userService.js:16`), so company scope can come from the session. There are no roles.
- **Security gap that matters here:** `GET /projects/:id` (`src/app.js:18`) doesn't check company, so any logged-in user can read any company's project. The new endpoint must not copy that pattern. I'd log it as a separate bug rather than fix it quietly as part of this work.
- **Other issues noticed (out of scope, separate bugs):**
  - `PATCH /orders/:id/status` also has no company check and doesn't validate the status value.
  - It emails the customer twice: once directly (`app.js:28`) and again through the event listener (`sendOnStatusChange.js:9`).

## Proposed behavior (draft for `features/projects/delete-project.feature`)
```gherkin
Feature: Delete a company project
  As a user of a company
  I want to delete one of my company's projects
  So that projects we no longer need are removed

  @critical
  Scenario: A user deletes a project owned by their company
    Given "Priya" belongs to the company "Acme"
    And "Acme" owns the project "Website Redesign"
    When "Priya" deletes the project "Website Redesign"
    Then the deletion is confirmed with no content
    And the project "Website Redesign" can no longer be retrieved

  @critical @security @authorization
  Scenario: A user cannot delete a project owned by another company
    Given "Priya" belongs to the company "Acme"
    And "Globex" owns the project "Q3 Launch"
    When "Priya" tries to delete the project "Q3 Launch"
    Then the project is reported as not found
    And the project "Q3 Launch" still exists

  @security @authentication
  Scenario: A caller who is not signed in cannot delete a project
    Given "Acme" owns the project "Website Redesign"
    When a caller who is not signed in tries to delete the project "Website Redesign"
    Then the request is refused as unauthenticated
    And the project "Website Redesign" still exists

  Scenario: Deleting a project that does not exist is reported as not found
    Given "Priya" belongs to the company "Acme"
    When "Priya" tries to delete a project that does not exist
    Then the project is reported as not found

  Scenario: Deleting a project a second time is reported as not found
    Given "Priya" has already deleted the project "Website Redesign"
    When "Priya" deletes the project "Website Redesign" again
    Then the project is reported as not found

  Scenario: Deleting one project leaves the company's other projects unchanged
    Given "Acme" owns the projects "Website Redesign" and "Mobile App"
    When "Priya" deletes the project "Website Redesign"
    Then the project "Mobile App" can still be retrieved

  Scenario: A storage failure does not expose internal details
    Given the project store is unavailable
    When "Priya" tries to delete the project "Website Redesign"
    Then the request fails with a generic server error
    And the response contains no internal error details
```

How these map to HTTP:
- **Endpoint:** `DELETE /projects/:id` behind `requireLogin`.
- **Responses:**
  - `204` on success.
  - `404` both when the project doesn't exist and when it belongs to another company, so other companies' project IDs aren't revealed.
  - `401` when not signed in.
  - Generic `500` on failure.
- **Company check:** the company filter goes inside the delete query itself, using `req.user.companyId` from the session. It never comes from the request.

## Questions that block the plan
1. **Hard delete or soft delete?** I'm assuming a hard delete. If the project has related records (orders, tasks), should those be deleted too, or should the delete be blocked?
2. **Who may delete?** I'm assuming any signed-in member of the owning company, since there are no roles yet. Do you need it limited to admins or owners?
3. **Missing modules:** can you provide `src/db.js` and `src/auth.js`, or tell me which data layer they use? `findAll({ where, order })` looks like Sequelize. I need to know the real delete method and what `requireLogin` sets on `req.user` before I can implement and test this.
4. **Tests:** I'd use the built-in `node:test` runner with no new dependencies, so nothing new to approve. OK?

Once you approve the scenarios (or send changes) and answer these, I'll present a short task list for the second approval gate, then implement it with one named test per scenario.
