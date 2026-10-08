# existing-project-triggers-agentflow-2

- Arm: **agentflow** · Case: `existing-project-triggers` · Turns: 10 · Cost: $0.4472936 · 80 s
- Project files (besides installed `.ai/`): `.nvmrc`, `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package-lock.json`, `package.json`, `src/app.js`, `src/notifications/sendOnStatusChange.js`, `src/services/userService.js`

## Prompt

Add an endpoint so a user can delete one of their company's projects.

## Final response

I haven't added the endpoint yet, and I shouldn't until you answer a few things. This project's rules don't allow code until you've approved the behavior. While reviewing the code I also found security problems in what's already there, so those come first.

## ⚠️ Security problems in the existing code

| # | Priority | What I found |
|---|---|---|
| BUG-001 | P0 | **Users can read other companies' projects.** `GET /projects/:id` (`src/app.js:18`) looks a project up by ID without checking its company. Any logged-in user can read any company's project. **Fix:** look it up by `{ id, companyId: req.user.companyId }` and return 404 if it isn't found. |
| BUG-002 | P0 | **Users can change other companies' orders.** `PATCH /orders/:id/status` (`src/app.js:25`) has the same missing check, and it also emails that other company's customer. `status` isn't validated either. **Fix:** filter the update by company, check `status` against the allowed values, and return 404 if not found. Smaller related bug (P2): customers get each status email twice. The route calls `notifyStatusChange` directly (`app.js:28`), and the event listener calls it again (`sendOnStatusChange.js:9`). |
| BUG-003 | P1 | The lockfile pins `jsonwebtoken@8.5.1`, which is covered by the Dec 2022 advisories fixed in 9.0.0 (CVE-2022-23529 and related). **Not checked this session:** running `npm audit` needed your approval and didn't run. **Fix:** upgrade to 9.x. |
| BUG-004 | P1 | The runtime is Node 16 (`.nvmrc`, `engines`), which has been end-of-life since Sept 2023 (from memory, not checked online). **Fix:** move to a currently supported Node LTS. |

BUG-001 matters for your request: a delete endpoint written the same way would let anyone delete any company's project.

## Draft behavior for "delete a project" (needs your approval)

```gherkin
Feature: Delete a project
  As a user of a company
  I want to delete one of my company's projects
  So that projects we no longer need are removed

  @critical
  Scenario: A user deletes one of their company's projects
    Given I am logged in as a user of company "Acme"
    And company "Acme" has a project "Apollo"
    When I delete project "Apollo"
    Then the response status is 204
    And project "Apollo" no longer exists

  @critical @security
  Scenario: A user cannot delete another company's project
    Given I am logged in as a user of company "Acme"
    And company "Globex" has a project "Zeus"
    When I delete project "Zeus"
    Then the response status is 404
    And project "Zeus" still exists

  Scenario: Deleting a project that does not exist
    Given I am logged in as a user of company "Acme"
    When I delete a project that does not exist
    Then the response status is 404

  @security
  Scenario: Deleting a project without logging in
    Given I am not logged in
    And company "Acme" has a project "Apollo"
    When I delete project "Apollo"
    Then the response status is 401
    And project "Apollo" still exists
```

Another company's project returns 404 rather than 403, so callers can't tell whether that project exists.

## Questions before I plan this

1. **Who can delete?** Any user in the company, or only certain roles? I saw no roles in the code.
2. **Permanent or recoverable?** Should deleted projects be gone for good, or kept but hidden (and maybe logged)?
3. **Linked data:** if orders or other records point to a project, should deletion be blocked, delete them too, or unlink them?

## Limits on testing

- `src/db`, `src/auth`, `src/events` and `src/mailer` are used by the code but aren't in this folder (I searched `src/**`). There are also no tests or `.feature` files. I can write the endpoint, but I can't run or test it here until those modules are available.
- I'll keep the existing stack: Express 4.19.2 and `node --test`.

## Records not saved

I tried to save the four bug reports, a bug log, the feature with these scenarios, and a status file under `.ai/`. Creating those files needed your approval, so none were written. If you approve file writes, I'll save them.

**Next step:** answer the three questions and approve or edit the scenarios. I'll then send a short plan for your second approval and only write code after that. Do you also want BUG-001 fixed alongside this, since it's the same problem on the same resource?
