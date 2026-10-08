# existing-project-triggers-agentflow-2

- Arm: **agentflow** · Case: `existing-project-triggers` · Turns: 5 · Cost: $0.3371252 · 40 s
- Project files (besides installed `.ai/`): `.nvmrc`, `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package-lock.json`, `package.json`, `src/app.js`, `src/notifications/sendOnStatusChange.js`, `src/services/userService.js`

## Prompt

Add an endpoint so a user can delete one of their company's projects.

## Final response

I've stopped at the first approval gate and haven't written any code. This repo uses the AI Engineering System in `.ai/`, which requires approved Gherkin scenarios before any change in behavior. A delete endpoint is that kind of change.

**Request type:** a feature on an existing project. The current stack (Express 4.19.2, jsonwebtoken 8.5.1, bcrypt 5.1.1, Node 16) stays as it is.

## What I found in the code

- **Endpoints in `src/app.js`:** `GET /users`, `GET /projects/:id`, `PATCH /orders/:id/status` and `POST /login`. All but login use `requireLogin`, which sets `req.user.companyId`.
- **Missing modules:** `src/db`, `src/auth`, `src/events` and `src/mailer` are referenced but aren't in the repo. I searched everything under `src/`. So I can't see the `projects` model's delete API, whether users have roles, or how projects relate to orders.
- **No tests or `.feature` files exist.** I searched for both. `npm test` runs `node --test`.
- **Security bug in `GET /projects/:id` (`src/app.js:18`):** it looks up a project by ID only and never checks `companyId`. Any logged-in user can read another company's project. `PATCH /orders/:id/status` has the same gap. The new delete endpoint must not copy this pattern. I'm treating both as separate bug items rather than fixing them inside this feature.
- **Other things to look at later, not in this scope:**
  - Order status emails are probably sent twice: once from the event listener and once by a direct call.
  - `jsonwebtoken` 8.5.1 has known advisories (fixed in 9.x).
  - Node 16 is end of life.

## Questions that block the plan

1. **Who can delete?** Any user in the company, or only certain roles (for example, admins)? I can't see whether users have a role field.
2. **Hard or soft delete?** Remove the row, or mark it deleted (and hide it from `GET /projects/:id`)?
3. **What happens to related data?** Do orders belong to projects? If they do, should deleting a project with orders be blocked, cascade, or leave the orders in place?

## Draft scenarios (`features/projects/delete-project.feature`)

These assume any company member can delete and the delete is permanent, until you answer the questions above. Another company's project returns 404, so its existence isn't revealed. That matches how `GET /projects/:id` treats unknown IDs.

```gherkin
Feature: Delete a company project
  As a user of a company
  I want to delete one of my company's projects
  So that projects we no longer need are removed

  Background:
    Given company "Acme" has a project "Website"
    And company "Globex" has a project "Rebrand"
    And "alice" is a logged-in user of company "Acme"

  @critical
  Scenario: A user deletes their own company's project
    When "alice" deletes the project "Website"
    Then the response status is 204
    And the project "Website" no longer exists

  @critical
  Scenario: A user cannot delete another company's project
    When "alice" deletes the project "Rebrand"
    Then the response status is 404
    And the project "Rebrand" still exists

  @critical
  Scenario: An anonymous request is rejected
    When an anonymous request deletes the project "Website"
    Then the response status is 401
    And the project "Website" still exists

  Scenario: Deleting a project that does not exist
    When "alice" deletes a project with an unknown ID
    Then the response status is 404

  Scenario: Deleting the same project twice
    Given "alice" has deleted the project "Website"
    When "alice" deletes the project "Website"
    Then the response status is 404
```

**Things that stay the same:** the other endpoints, including `GET /projects/:id` (its bug is tracked separately).

**Planned design, for after approval:** add `DELETE /projects/:id` behind `requireLogin`. The delete query itself will be filtered by both `id` and `req.user.companyId`, rather than fetching the project first and checking it afterwards. Tests will use `node:test` with no new dependencies, and each scenario will map to one named test.

Can you answer questions 1–3 and approve or adjust the scenarios? Then I'll bring back the short task list for the second approval before writing any code. Should I also open the two cross-company access bugs as separate items?
