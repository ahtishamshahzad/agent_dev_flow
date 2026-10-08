# existing-project-triggers-agentflow-1

- Arm: **agentflow** · Case: `existing-project-triggers` · Turns: 5 · Cost: $0.27883179999999996 · 36 s
- Project files (besides installed `.ai/`): `.nvmrc`, `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package-lock.json`, `package.json`, `src/app.js`, `src/notifications/sendOnStatusChange.js`, `src/services/userService.js`

## Prompt

Add an endpoint so a user can delete one of their company's projects.

## Final response

I've read the `.ai/` system and audited the repo. This request counts as a feature on an existing project and changes behavior, so the project rules require you to approve the behavior spec before I write any code. Here is the audit and a draft spec for you to approve or change.

## What's in the repo

**Stack (I'll keep it as is):** Express 4.19.2, jsonwebtoken 8.5.1 and bcrypt 5.1.1 (versions from `package-lock.json`), Node 16 (`.nvmrc`), and the built-in `node --test` runner.

- **Several modules the code imports are missing.** `src/` only contains `app.js`, `services/userService.js` and `notifications/sendOnStatusChange.js`. `src/db`, `src/auth`, `src/events` and `src/mailer` are imported and described in the README, but they aren't in the repo. So I can't confirm what `db.projects` can do (for example, whether it has a delete method or a filter by `companyId`).
- **There are no tests.** I searched for `*.feature` and `*.test.js` and found none.
- **The existing `GET /projects/:id` has a security bug** (`src/app.js:18`). It finds the project by ID without checking `companyId`, so any logged-in user can read another company's project. The new delete endpoint must not copy this. I'm treating it as a separate bug to log, not part of this change.
- **Other problems I'll log separately, not fix here:**
  - `PATCH /orders/:id/status` has the same missing company check.
  - That same route sends the customer two emails per status change: it emits the event, whose listener sends one, and then calls `notifyStatusChange` directly, which sends another.
  - jsonwebtoken 8.x has known advisories that are fixed in 9.x.
  - Node 16 is end-of-life.

## Draft behavior spec (`features/projects/delete-project.feature`)

```gherkin
Feature: Delete a company project
  As a member of a company
  I want to delete one of my company's projects
  So that projects we no longer need are removed

  Scenario: A member deletes a project belonging to their company
    Given "Dana" is signed in as a member of "Acme"
    And "Acme" owns the project "Website Redesign"
    When "Dana" deletes the project "Website Redesign"
    Then the deletion succeeds with no content
    And the project "Website Redesign" no longer exists

  @critical
  Scenario: A member cannot delete another company's project
    Given "Dana" is signed in as a member of "Acme"
    And "Globex" owns the project "Q3 Launch"
    When "Dana" deletes the project "Q3 Launch"
    Then the project is reported as not found
    And the project "Q3 Launch" still exists

  Scenario: Deleting a project that does not exist
    Given "Dana" is signed in as a member of "Acme"
    When "Dana" deletes a project that does not exist
    Then the project is reported as not found

  @critical
  Scenario: An unauthenticated caller cannot delete a project
    Given "Acme" owns the project "Website Redesign"
    When an unauthenticated caller deletes the project "Website Redesign"
    Then the request is rejected as unauthenticated
    And the project "Website Redesign" still exists

  Scenario: Deleting an already-deleted project
    Given "Dana" is signed in as a member of "Acme"
    And "Dana" has already deleted the project "Website Redesign"
    When "Dana" deletes the project "Website Redesign" again
    Then the project is reported as not found
```

**Planned shape:** `DELETE /projects/:id` with `requireLogin`. It deletes only where `id` and `companyId = req.user.companyId`, in a single query (no fetch-then-check). It returns 204 on success. It returns 404 for a project that doesn't exist or belongs to another company, so it doesn't reveal that the project exists. It doesn't change anything else.

## Questions before you approve

1. **Who can delete?** Should any member of the company be able to, or only certain roles such as admin or owner? I haven't found a role field, but the user model isn't in the repo. The draft assumes any member.
2. **Hard or soft delete?** The draft assumes a hard delete. If you want soft delete (`deletedAt`), the GET endpoint would also need to stop returning deleted projects.
3. **Related data:** Do orders or other records point to projects? If they do, should deletion be blocked (409), cascade, or leave them in place?
4. **The missing modules:** Can you add `src/db` and `src/auth`, or tell me what the projects model offers? Without them I'd be guessing at the data-layer API, and the tests would have to stub it.

Once you've answered and approved the scenarios, I'll send a short task list (endpoint plus one named test per scenario) for the second approval, then implement. Should I also log the bugs above as separate work items?
