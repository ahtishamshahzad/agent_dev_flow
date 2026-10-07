# tenant-isolation-agentflow-2

- Arm: **agentflow** · Case: `tenant-isolation` · Turns: 16 · Cost: $0.35691760000000006 · 46 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package.json`, `src/app.js`, `src/notifications/sendOnStatusChange.js`, `src/services/userService.js`

## Prompt

Prevent users from accessing another company's resources.

## Final response

I've audited the codebase and haven't changed any files. The project rules don't allow code changes until you approve the behavior (Gate 2), so here's what I found, the scenarios I propose, and the questions I need answered first.

## Classification
**Bug (security: missing tenant authorization).** Some routes check that the user is logged in but never check which company the record belongs to. That needs to go through bug intake as a BUG-NNN, and it needs regression scenarios that fail on the current code.

## What the code does now
| Route | Company check | Problem |
|---|---|---|
| `GET /users` (`src/app.js:12`) | ✅ Filters by `req.user.companyId`, which comes from the login token | None |
| `GET /projects/:id` (`src/app.js:18`) | ❌ Looks up by ID only | **Cross-company read:** anyone logged in can read any company's project by guessing or listing IDs |
| `PATCH /orders/:id/status` (`src/app.js:25`) | ❌ Updates by ID only | **Cross-company write:** anyone logged in can change another company's order, and that company's customer gets an email about it |

Other findings, which I'd treat as separate follow-up work rather than part of this change:
1. **Customers get two emails per status change.** `app.js:27` emits `order.statusChanged`, and the listener at `sendOnStatusChange.js:9` sends an email. Then `app.js:28` calls `notifyStatusChange` and sends another.
2. **The status value isn't checked.** `req.body.status` is written to the order as-is.
3. **The project can't run or be tested yet.** `./db`, `./auth`, `./events` and `./mailer` don't exist. `bcrypt` and `jsonwebtoken` are imported but not listed in `package.json`. There are no tests. Until that's resolved, I can't write the required failing regression tests or show that a fix works.

## Proposed behavior (draft, not yet saved to the project)
```gherkin
Feature: Company data isolation
  As a member of a company
  I want my company's records hidden from and protected against other companies
  So that no company can read or change another company's data

  Background:
    Given the company "Acme Ltd" has a project "Website Redesign" and an order "A-1001" with status "pending"
    And the user "dana@globex.com" is signed in as a member of the company "Globex Inc"

  @critical @security @authorization @regression
  Scenario: A user cannot view another company's project
    When "dana@globex.com" requests the project "Website Redesign"
    Then the request is refused as not found
    And no project details are returned

  @critical @security @authorization @regression
  Scenario: A user cannot change the status of another company's order
    When "dana@globex.com" sets the status of order "A-1001" to "shipped"
    Then the request is refused as not found
    And order "A-1001" still has status "pending"

  @critical @security @authorization @regression
  Scenario: No customer email is sent for a refused cross-company status change
    When "dana@globex.com" sets the status of order "A-1001" to "shipped"
    Then no status email is sent to the customer of order "A-1001"

  @authorization
  Scenario: A user can view their own company's project
    Given the user "sam@acme.com" is signed in as a member of the company "Acme Ltd"
    When "sam@acme.com" requests the project "Website Redesign"
    Then the project "Website Redesign" is returned

  @authorization
  Scenario: A user can change the status of their own company's order
    Given the user "sam@acme.com" is signed in as a member of the company "Acme Ltd"
    When "sam@acme.com" sets the status of order "A-1001" to "shipped"
    Then order "A-1001" has status "shipped"

  @critical @security @authorization
  Scenario: A user lists only their own company's users
    Given the company "Acme Ltd" has the user "sam@acme.com"
    When "dana@globex.com" lists users
    Then "sam@acme.com" is not in the list
```

**How I'd fix it:** add the company filter to the database query itself, using the company ID from the login token. That way another company's rows are never loaded in the first place, rather than being loaded and then checked. Any company ID sent in the request body or URL would be ignored.

## Decisions needed from you
1. **Refusal response:** a 404, which hides whether the record exists (my recommendation, and what the scenarios above assume), or a 403?
2. **Missing modules:** do `db`, `auth`, `events` and `mailer` live somewhere else, or should a minimal tested data layer be part of this work? If it should, that's a scope and stack decision I'd need you to approve.
3. **Duplicate email and status validation:** should I log these as separate bugs, or leave them alone for now?

Once you approve the scenarios and answer these, I'll record the bug and decision in `.ai/projects/current/` and `.ai/work-items/bugs/`, then move to tasks.
