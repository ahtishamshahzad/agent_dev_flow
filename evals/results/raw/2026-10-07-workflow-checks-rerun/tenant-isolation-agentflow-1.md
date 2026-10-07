# tenant-isolation-agentflow-1

- Arm: **agentflow** · Case: `tenant-isolation` · Turns: 19 · Cost: $0.39249120000000004 · 49 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package.json`, `src/app.js`, `src/notifications/sendOnStatusChange.js`, `src/services/userService.js`

## Prompt

Prevent users from accessing another company's resources.

## Final response

I haven't changed any code yet. This repo's rules (`.ai/system/GHERKIN_RULES.md`) count tenant isolation as a behavior change, and it needs your approval before code. Below are what I found and the plan I'm proposing.

## Classification
**Bug, security-relevant:** company isolation is broken. It goes through `.ai/workflows/bugfix.md`.

## Audit findings (confirmed by reading the code)

| Route | Company scoping | Issue |
|---|---|---|
| `GET /users` (`src/app.js:12`) | ✅ Scoped by `req.user.companyId` from the login token | None |
| `GET /projects/:id` (`src/app.js:18`) | ❌ `findById(req.params.id)` only | **Cross-company read:** any logged-in user can read any company's project by guessing or listing IDs. |
| `PATCH /orders/:id/status` (`src/app.js:25`) | ❌ `update(req.params.id, …)` only | **Cross-company write:** any logged-in user can change another company's order status, and that **emails the other company's customer**. |
| `POST /login` | n/a | None. The token's `companyId` comes from the database, not from the client. |

**Root cause:** both routes look up records by ID alone. Being logged in is treated as being allowed, with no ownership check. The fix is to put the company filter in the database query itself, so other companies' records are never loaded, rather than loading them and checking afterwards (`.ai/checklists/authorization.md`).

**Proposed fix (not applied):**
- **Projects:** `db.projects.findOne({ where: { id, companyId: req.user.companyId } })`.
- **Orders:** update only `where: { id, companyId }`. If nothing matches, return 404 and send no event or email.

## Gaps that block testing
- `src/db`, `src/auth`, `src/events` and `src/mailer` are referenced but **don't exist** in the repo.
- `bcrypt` and `jsonwebtoken` are imported but not listed in `package.json`.
- There are **no tests and no `features/` folder**.

So I can't reproduce either bug or run a failing-first regression test as things stand. Writing tests would mean adding stand-in versions of `db` and `auth`.

## Proposed regression scenarios (draft, for `features/authorization/company-isolation.feature`)

```gherkin
Feature: Company isolation
  As a user of a company
  I want my company's data hidden from and protected against other companies
  So that no company can read or change another company's resources

  Background:
    Given company "Acme" has project "Apollo" and order "1042" for customer "dana@acme.example"
    And user "sam@globex.example" belongs to company "Globex"

  @critical @security @authorization @regression
  Scenario: A user cannot view another company's project
    Given "sam@globex.example" is signed in
    When "sam@globex.example" requests project "Apollo"
    Then the response reports that the project is not found
    And no details of project "Apollo" are returned

  @critical @security @authorization @regression
  Scenario: A user cannot change another company's order status
    Given "sam@globex.example" is signed in
    When "sam@globex.example" sets the status of order "1042" to "cancelled"
    Then the response reports that the order is not found
    And order "1042" keeps its previous status
    And "dana@acme.example" receives no status email

  @critical @authorization
  Scenario: A user can view their own company's project
    Given user "lee@acme.example" of company "Acme" is signed in
    When "lee@acme.example" requests project "Apollo"
    Then the details of project "Apollo" are returned
```

A matching same-company scenario for order status would also be included.

## Decisions needed
1. **404 or 403 for another company's resource?** I recommend 404, so nobody can tell that the ID exists in another company.
2. **Test setup:** may I add stand-in `db` and `auth` modules and use the built-in `node --test` runner, which needs no new dependencies? Or do the real modules exist somewhere else?
3. **A separate bug I found but am leaving alone:** every order status change emails the customer **twice**. The route calls `notifyStatusChange` directly (`src/app.js:28`), and the `order.statusChanged` listener (`src/notifications/sendOnStatusChange.js:9`) calls it again. Should I record this as its own bug?

Once you approve the scenarios and answer 1 and 2, I'll record `BUG-001`, write the failing tests, apply the fix and run the tests. I also don't have a file-writing tool in this session, so you'll need to enable one before I can make changes.
