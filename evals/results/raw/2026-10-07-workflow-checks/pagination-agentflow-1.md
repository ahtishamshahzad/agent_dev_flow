# pagination-agentflow-1

- Arm: **agentflow** · Case: `pagination` · Turns: 15 · Cost: $0.32610320000000004 · 43 s

## Prompt

Add pagination to the users endpoint.

## Final response

I haven't written any code yet. Under this repo's rules (`.ai/system/OPERATING_RULES.md` §2, `GHERKIN_RULES.md`), a change to how an API pages its results changes what clients see. So it needs scenarios you approve (Gate 2) before any design or code. Here's where things stand and what I need from you.

## Request type
**Feature**, existing project enhancement. No new applications, and no stack change beyond what's already used (Express, `node --test`).

## What I found in the code
- `GET /users` (`src/app.js:12`) returns a plain array of every user in the caller's company. It's sorted by `createdAt ASC` (`src/services/userService.js:6`) and has no limit.
- `createdAt` is the only sort key, so two users created at the same moment have no fixed order. Pages could then skip or repeat users, so I'd also sort by `id`.
- There's no `features/` folder and no tests, so nothing existing has to be updated.
- `src/db`, `src/auth` and `src/events` don't exist in this checkout. `bcrypt` and `jsonwebtoken` are used but aren't listed in `package.json`. That means I can't run the app as it stands, only unit tests with the database mocked.
- **Separate issue, not part of this task:** `listUsers` appears to return whole user records, and those likely include `passwordHash`. I'd suggest handling that as its own bug rather than mixing it into this change.

## Decisions I need from you
1. **Response format (this breaks current clients).** Today the endpoint returns a bare array. My recommendation is `{ "data": [...], "nextCursor": "..." | null }`. If existing clients can't change, the other option is to keep the bare array and send the cursor in a `Link` header instead.
2. **How pages are tracked.** I recommend an opaque cursor based on `createdAt` and `id`. The repo's API rule says to use cursors when data keeps growing, and adding or deleting users won't make pages skip or repeat anyone. The simpler option is `?page=` and `?pageSize=` numbers.
3. **Page size.** I'd default to 50 and cap it at 100.
4. **Bad input.** I'd return `400` for a bad `limit` or a cursor that can't be read.

## Draft scenarios (assuming my recommendations)
These would go in `features/users/user-directory-pagination.feature` once you approve them.

```gherkin
Feature: User directory pagination
  As a signed-in company member
  I want to browse my company's users one page at a time
  So that large directories load quickly and predictably

  Background:
    Given the company "Acme" has 120 users
    And "dana@acme.com" is signed in as a member of "Acme"

  @api @critical
  Scenario: First page uses the default page size
    When Dana requests the user directory
    Then Dana receives 50 users ordered from oldest to newest
    And the response includes a cursor for the next page

  @api @critical
  Scenario: Following cursors returns every user exactly once
    When Dana follows the next-page cursor until none is returned
    Then Dana has received all 120 users
    And no user appears more than once

  @api
  Scenario: The last page has no next cursor
    Given Dana has a cursor positioned after the first 100 users
    When Dana requests the user directory with that cursor
    Then Dana receives 20 users
    And the response has no cursor for a next page

  @api
  Scenario: A requested page size is honoured
    When Dana requests the user directory with a page size of 10
    Then Dana receives 10 users

  @api
  Scenario Outline: An invalid page size is rejected
    When Dana requests the user directory with a page size of "<limit>"
    Then the request is rejected as invalid
    And the error explains that the page size must be between 1 and 100

    Examples:
      | limit |
      | 0     |
      | 101   |
      | ten   |

  @api
  Scenario: A malformed cursor is rejected
    When Dana requests the user directory with the cursor "not-a-real-cursor"
    Then the request is rejected as invalid

  @api @security @authorization @critical
  Scenario: Pagination never reveals another company's users
    Given the company "Globex" has 30 users
    When Dana follows the next-page cursor until none is returned
    Then Dana receives no users from "Globex"

  @api @security @authentication
  Scenario: Anonymous visitors cannot list users
    Given no user is signed in
    When a visitor requests the user directory
    Then the request is refused as unauthenticated
```

## After you approve
- I'll record the request and decisions in `.ai/projects/current/`.
- Then I'll propose a short plan (Gate 4): a keyset query in `userService`, input validation and the new response format in the route, and one named `node --test` test per scenario with the database mocked.
- I'll wait for your OK on that plan before writing code.

Can you confirm decisions 1–4, or tell me what to change, and approve the scenarios?
