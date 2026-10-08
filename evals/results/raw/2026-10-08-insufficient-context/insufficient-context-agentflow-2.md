# insufficient-context-agentflow-2

- Arm: **agentflow** · Case: `insufficient-context` · Turns: 15 · Cost: $0.2462958 · 33 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package.json`, `src/app.js`, `src/notifications/sendOnStatusChange.js`, `src/services/userService.js`

## Prompt

Make deleting a project a soft delete, so a deleted project can be restored later.

## Final response

I haven't changed any code. There's nothing to convert to a soft delete yet, and the project rules require approved behavior scenarios first. I also found a security problem in the projects code that you should know about first.

## ⚠️ Security issue: any logged-in user can read another company's projects (P1)

`src/app.js:18-22`: `GET /projects/:id` looks up the project by ID only. It never checks `companyId` against `req.user.companyId`. The README describes this as a multi-company API, so a user from company A can read company B's project by guessing or listing IDs. I confirmed this from the code but haven't run it against a server.

**Smallest safe fix:** return 404 unless `project.companyId === req.user.companyId`, or look up with `{ id, companyId }`. This matters for your request too, because a restore endpoint written the same way would let a user restore another company's projects. Per the project rules I'd log this as its own bug (BUG-001) and fix it before or alongside the soft delete. Shall I?

## Why I stopped before writing the soft delete

What I searched and found:
- **There is no delete-project feature.** Searching `src/**` for `delete|destroy|deletedAt|paranoid` found nothing. The only project route is `GET /projects/:id`.
- **The data layer isn't in the repo.** `src/db` is imported and described in the README, but there are no files under it, no migrations or schema, and no ORM listed in `package.json`. So I can't see how `projects` is stored or how to add a `deletedAt` column.
- **There are no tests or `.feature` files, and no current status or work items** under `.ai/projects/current/` or `.ai/work-items/`.

Making the delete soft is a behavior change, so the project rules need approved Gherkin scenarios before any code.

## Proposed scenarios (draft, for your approval)

```gherkin
Feature: Soft-delete and restore projects

  Background:
    Given I am logged in as a user of company "Acme"
    And "Acme" has a project "Website"

  Scenario: Deleting a project hides it but keeps it
    When I delete project "Website"
    Then the response is 204
    And GET /projects/{id} for "Website" returns 404
    And the project row still exists with a deletion timestamp

  Scenario: Restoring a deleted project
    Given project "Website" has been deleted
    When I restore project "Website"
    Then GET /projects/{id} for "Website" returns the project

  Scenario: Cannot delete or restore another company's project
    Given company "Globex" has a project "Secret"
    When I delete or restore project "Secret"
    Then the response is 404
    And "Secret" is unchanged
```

## What I need from you

1. **Should I build the delete route too?** The request assumes deleting already exists, but it doesn't. Should I add `DELETE /projects/:id` plus `POST /projects/:id/restore`, or is there a delete somewhere outside this repo?
2. **What is the data layer?** Is it Sequelize (the `findAll({ where, order })` calls suggest so), Knex, or raw `pg`? Where does `src/db` live, and how are migrations handled?
3. **Who may delete and restore?** Any user in the company, or only admins? Is there a time limit for restoring, or a purge later?
4. **Should deleted projects show up anywhere?** For example, a list of deleted projects for restoring, or an admin view.
5. **What about related data?** Do orders or other records linked to a project need to be hidden or kept?
6. **Should I fix the security issue above first?**

Once you approve the scenarios (edited as needed) and answer 1–3, I'll write the task plan for your sign-off and then implement it.
