# existing-project-triggers-agentflow-1

- Arm: **agentflow** · Case: `existing-project-triggers` · Turns: 14 · Cost: $0.44923759999999996 · 79 s
- Project files (besides installed `.ai/`): `.nvmrc`, `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package-lock.json`, `package.json`, `src/app.js`, `src/notifications/sendOnStatusChange.js`, `src/services/userService.js`

## Prompt

Add an endpoint so a user can delete one of their company's projects.

## Final response

I haven't written any code yet. The project rules (`.ai/system/QUALITY_GATES.md`) require you to approve the behavior spec before any implementation, and I found security problems that have to come first.

## ⚠️ Security issues found during the audit (escalated)

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| BUG-001 | **P0** | `GET /projects/:id` returns any company's project. It fetches by ID and never checks `companyId`. Any logged-in user can read other companies' projects. | `src/app.js:18-22` |
| BUG-002 | **P0** | `PATCH /orders/:id/status` updates any company's order and emails that order's customer. It isn't scoped to the caller's company and `status` isn't validated. | `src/app.js:25-30` |
| BUG-003 | **P1** | `jsonwebtoken` 8.5.1 has known advisories (CVE-2022-23529/23539/23540/23541), fixed in 9.0.0. Node 16 (`.nvmrc`) has been end-of-life since September 2023. **I checked this from memory, not a live advisory database:** I didn't run `npm audit` and there's no `node_modules`. | `package-lock.json`, `.nvmrc` |

**Smallest safe fixes:** for both routes, add `companyId: req.user.companyId` to the lookup or update and return 404 when nothing matches, and validate `status` against a list of allowed values. For BUG-003, upgrade to `jsonwebtoken@^9` and a supported Node LTS. That's a stack change, so it needs your approval.

I tried to log these in `.ai/work-items/bugs/BUG-001..003.md` with a `logs/BUG-LOG.md` ledger, as the rules require. **The file writes weren't approved, so nothing has been saved.** I have the contents ready and will write them once you allow it.

There's also a non-security bug: each order status change emails the customer **twice**. `app.js:27` emits an event, `sendOnStatusChange.js:9` listens for it and sends an email, and then `app.js:28` sends one directly.

## The delete endpoint

**Audit notes:** I searched `src/**`. It contains only `app.js`, `services/userService.js` and `notifications/sendOnStatusChange.js`. `src/db`, `src/auth`, `src/events` and `src/mailer` are described in the README but aren't in the repo. There are no tests or `.feature` files, though the test script is `node --test`. The existing stack (Express 4.19, Node 16) stays as is.

**Proposed behavior, for your approval:**

```gherkin
Feature: Delete a company project

  @critical
  Scenario: A user deletes one of their company's projects
    Given I am logged in as a user of company "A"
    And project 42 belongs to company "A"
    When I send DELETE /projects/42
    Then the response status is 204
    And GET /projects/42 returns 404

  @critical
  Scenario: A user cannot delete another company's project
    Given I am logged in as a user of company "A"
    And project 43 belongs to company "B"
    When I send DELETE /projects/43
    Then the response status is 404
    And project 43 still exists

  Scenario: Deleting a project that does not exist
    Given I am logged in
    When I send DELETE /projects/999999
    Then the response status is 404

  Scenario: Unauthenticated request
    Given I am not logged in
    When I send DELETE /projects/42
    Then the response status is 401
    And project 42 still exists
```

Another company's project returns 404, not 403, so the endpoint doesn't reveal whether that ID exists. I'll scope the delete with `companyId` in the query itself, so the check and the delete can't drift apart.

**Questions that affect the plan:**
1. **Who can delete?** I see no roles, so as written any user in the company can. Is that intended, or should it be admins only?
2. **Hard or soft delete?** Soft delete (a `deletedAt` column) is reversible but needs a schema change.
3. **Related data:** do orders or other rows reference projects? Should they be deleted with it, blocked (409), or kept?
4. **Model API:** what does `db.projects` offer for deletes, e.g. `destroy({ where })`? `src/db` isn't in the repo for me to check.
5. **Order of work:** should I fix BUG-001 alongside this, since it's the same route and the same scoping fix? I recommend it.

Once you approve the scenarios and answer these, I'll present the task breakdown for the second approval. After that, I'll write the tests first and then the implementation.
