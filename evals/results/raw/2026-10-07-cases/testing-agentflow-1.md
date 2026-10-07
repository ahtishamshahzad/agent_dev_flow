# testing-agentflow-1

- Arm: **agentflow** · Case: `testing` · Turns: 12 · Cost: $0.558287 · 130 s

## Prompt

Write the test plan for this endpoint. Don't write the tests yet.

`PATCH /projects/:projectId/members/:userId` — changes a member's role in a project. Body: `{ "role": "viewer" | "editor" | "admin" }`. Only project admins may call it. A project must always keep at least one admin. Returns the updated membership.

## Final response

I didn't find any application code, `features/` folder or approved stack in this repo, and there's no `CURRENT_STATUS.md`. So the plan below doesn't depend on any particular framework, and tool names are left until the stack is approved. Under this repo's rules (`.ai/system/GHERKIN_RULES.md`), the scenarios are the acceptance criteria and need your approval before any code or tests.

**Request type:** feature (new API endpoint). **This step:** behavior spec and test plan, for approval.

---

# Test Plan — Change a project member's role

- **Date:** 2026-10-07 · **Status:** draft, needs approval
- **Feature file (once approved):** `features/project-membership/change-member-role.feature`

## 1. Assumptions to confirm

The expected results below depend on these. Each is my suggested default; tell me where you want something different.

| # | Question | Assumed answer |
|---|---|---|
| A1 | Status code when a change would leave the project with no admin | **409**, with a machine-readable error code |
| A2 | Caller isn't a member of the project, or the project doesn't exist | **404**, so the API doesn't reveal which projects exist |
| A3 | Order of checks | Login (401) → can the caller see the project (404) → is the caller an admin (403) → body validation (400) → target membership exists (404) → at least one admin left (409) |
| A4 | Setting a role the member already has | **200**, membership returned unchanged |
| A5 | Extra fields in the body (`userId`, `projectId`, …) | **400** (strict schema) |
| A6 | Role values | Exactly `viewer`, `editor`, `admin`. Case-sensitive, no trimming |
| A7 | PATCH on a user who isn't a member | **404**. It never creates a membership |
| A8 | Out of scope | Site-wide superadmins, audit log or notifications, archived projects, deactivated users. Raise any of these if they exist |

**Follow-up (not in this scope):** removing a member and leaving a project can also break the at-least-one-admin rule. They need matching scenarios when those endpoints are specified.

## 2. Behavior spec (Gherkin)

```gherkin
@api
Feature: Change a project member's role
  As a project admin
  I want to change the role of a member of my project
  So that I control who can view, edit, and administer it

  Background:
    Given the project "Apollo" exists
    And "Alice" has the role "admin" in "Apollo"
    And "Bob" has the role "editor" in "Apollo"
    And "Carol" has the role "viewer" in "Apollo"

  @critical
  Scenario: An admin promotes an editor to admin
    When "Alice" changes the role of "Bob" in "Apollo" to "admin"
    Then the response status is 200
    And the response is the membership of "Bob" in "Apollo" with role "admin"
    And "Bob" has the role "admin" in "Apollo"

  Scenario Outline: An admin changes a member to another role
    When "Alice" changes the role of "<member>" in "Apollo" to "<new-role>"
    Then the response status is 200
    And "<member>" has the role "<new-role>" in "Apollo"

    Examples:
      | member | new-role |
      | Bob    | viewer   |
      | Carol  | editor   |
      | Carol  | admin    |

  Scenario: Setting a member's current role leaves the membership unchanged
    When "Alice" changes the role of "Bob" in "Apollo" to "editor"
    Then the response status is 200
    And the response is the membership of "Bob" in "Apollo" with role "editor"

  Scenario: A promoted member can manage roles straight away
    Given "Alice" has changed the role of "Bob" in "Apollo" to "admin"
    When "Bob" changes the role of "Carol" in "Apollo" to "editor"
    Then the response status is 200
    And "Carol" has the role "editor" in "Apollo"

  @critical
  Scenario Outline: The only admin cannot step down
    When "Alice" changes the role of "Alice" in "Apollo" to "<new-role>"
    Then the response status is 409
    And the error states that "Apollo" must keep at least one admin
    And "Alice" has the role "admin" in "Apollo"

    Examples:
      | new-role |
      | editor   |
      | viewer   |

  Scenario: An admin steps down while another admin remains
    Given "Dana" has the role "admin" in "Apollo"
    When "Alice" changes the role of "Alice" in "Apollo" to "viewer"
    Then the response status is 200
    And "Alice" has the role "viewer" in "Apollo"
    And "Dana" has the role "admin" in "Apollo"

  Scenario: An admin demotes the only other admin
    Given "Dana" has the role "admin" in "Apollo"
    When "Alice" changes the role of "Dana" in "Apollo" to "editor"
    Then the response status is 200
    And "Dana" has the role "editor" in "Apollo"
    And "Alice" has the role "admin" in "Apollo"

  Scenario: A demoted admin can no longer change roles
    Given "Dana" has the role "admin" in "Apollo"
    And "Dana" has changed the role of "Alice" in "Apollo" to "editor"
    When "Alice" changes the role of "Carol" in "Apollo" to "editor"
    Then the response status is 403
    And "Carol" has the role "viewer" in "Apollo"

  @critical
  Scenario: Two admins demoting each other at the same moment leave one admin
    Given "Dana" has the role "admin" in "Apollo"
    When "Alice" and "Dana" each change the other's role to "editor" at the same moment
    Then exactly one of the two changes succeeds
    And the other change is refused
    And "Apollo" has exactly one admin

  @critical
  Scenario: Two admins stepping down at the same moment leave one admin
    Given "Dana" has the role "admin" in "Apollo"
    When "Alice" and "Dana" each change their own role to "viewer" at the same moment
    Then exactly one of the two changes succeeds
    And the other change is refused with status 409
    And "Apollo" has exactly one admin

  @critical @security @authorization
  Scenario Outline: A non-admin member cannot change another member's role
    When "<caller>" changes the role of "<target>" in "Apollo" to "admin"
    Then the response status is 403
    And "<target>" has the role "<target-role>" in "Apollo"

    Examples:
      | caller | target | target-role |
      | Bob    | Carol  | viewer      |
      | Carol  | Bob    | editor      |

  @critical @security @authorization
  Scenario: An editor cannot promote themselves to admin
    When "Bob" changes the role of "Bob" in "Apollo" to "admin"
    Then the response status is 403
    And "Bob" has the role "editor" in "Apollo"

  @security @authorization
  Scenario: An admin of another project cannot change roles in this project
    Given the project "Hermes" exists
    And "Erin" has the role "admin" in "Hermes"
    When "Erin" changes the role of "Bob" in "Apollo" to "viewer"
    Then the response status is 404
    And "Bob" has the role "editor" in "Apollo"

  @security @authentication
  Scenario Outline: A request without valid credentials is rejected
    Given the caller presents <credentials>
    When the caller changes the role of "Bob" in "Apollo" to "viewer"
    Then the response status is 401
    And "Bob" has the role "editor" in "Apollo"

    Examples:
      | credentials          |
      | no credentials       |
      | an expired session   |
      | a tampered token     |

  @security
  Scenario: A non-admin's invalid request is refused before it is validated
    When "Bob" changes the role of "Carol" in "Apollo" to "owner"
    Then the response status is 403

  Scenario: The target user is not a member of the project
    Given "Frank" is a registered user with no role in "Apollo"
    When "Alice" changes the role of "Frank" in "Apollo" to "editor"
    Then the response status is 404
    And "Frank" has no role in "Apollo"

  Scenario: The project does not exist
    When "Alice" changes the role of "Bob" in a project that does not exist to "viewer"
    Then the response status is 404

  Scenario Outline: An admin's request with an invalid role is rejected
    When "Alice" sends a role change for "Bob" in "Apollo" with body <body>
    Then the response status is 400
    And "Bob" has the role "editor" in "Apollo"

    Examples:
      | body                 |
      | {"role": "owner"}    |
      | {"role": "Admin"}    |
      | {"role": ""}         |
      | {"role": null}       |
      | {"role": 2}          |
      | {"role": ["admin"]}  |
      | {}                   |

  Scenario: A malformed request body is rejected
    When "Alice" sends a role change for "Bob" in "Apollo" with a body that is not valid JSON
    Then the response status is 400
    And "Bob" has the role "editor" in "Apollo"

  @security
  Scenario: Fields other than the role cannot alter the membership
    Given the project "Hermes" exists
    When "Alice" sends a role change for "Bob" in "Apollo" with body:
      """
      {"role": "viewer", "userId": "<Carol's id>", "projectId": "<Hermes's id>"}
      """
    Then the response status is 400
    And "Bob" has the role "editor" in "Apollo"
    And "Carol" has the role "viewer" in "Apollo"
```

## 3. Test types to use

| Application | Unit | API / integration (real database) | Component | Web E2E | Mobile E2E | Contract |
|---|---|---|---|---|---|---|
| Backend API | **Yes**: the role-change rule on its own | **Yes**: the main suite | No | No | No | Optional: response schema checked in the API tests; a separate contract test only if an OpenAPI spec or outside clients exist |

- **Specific tools:** chosen once the stack is approved. For example, Supertest plus Jest or Vitest if this is Node.
- **Not used, and why:** no UI is in scope, so no component or E2E tests.

**Unit tests for the role-change rule.** These cover the decision logic only, with no HTTP or database.

| Caller role | Target's current role | New role | Admins in project | Expected |
|---|---|---|---|---|
| admin | editor | admin | 1 | allowed |
| admin | admin (self) | editor | 1 | refused: last admin |
| admin | admin (self) | viewer | 2 | allowed |
| admin | admin (other) | editor | 2 | allowed |
| admin | editor | editor | 1 | allowed, no change |
| editor | editor (self) | admin | 1 | forbidden |
| viewer | editor | viewer | 1 | forbidden |

## 4. Required cases

- [x] Happy path: promote; each role-to-role change; no change; new admin rights take effect
- [x] Invalid input: invalid role values, malformed JSON, extra fields
- [x] Error path: last admin (409), target not a member (404), project missing (404)
- [x] **Authorization denial:** editor, viewer, editor promoting themselves, admin of another project, not logged in, demoted admin
- [x] Regression: none yet because the endpoint is new. The last-admin and race scenarios become the permanent regression set.
- [ ] Environment/config: not applicable beyond auth middleware being active, which the 401 scenarios already prove

## 5. Scenarios mapped to tests

| Scenario | Level | Test case | Automated? |
|---|---|---|---|
| An admin promotes an editor to admin | API | `promotes editor to admin and returns membership` | not yet |
| An admin changes a member to another role (3 rows) | API | `changes <member> to <role>` | not yet |
| Setting a member's current role leaves the membership unchanged | API | `same role is a 200 no-op` | not yet |
| A promoted member can manage roles straight away | API | `promoted admin can change roles` | not yet |
| The only admin cannot step down (2 rows) | Unit + API | `rejects last admin demotion with 409` | not yet |
| An admin steps down while another admin remains | API | `admin can step down when another admin remains` | not yet |
| An admin demotes the only other admin | API | `admin can demote other admin leaving one` | not yet |
| A demoted admin can no longer change roles | API | `demoted admin gets 403` | not yet |
| Two admins demoting each other at the same moment leave one admin | API (real database, concurrent) | `concurrent mutual demotion keeps one admin` | not yet |
| Two admins stepping down at the same moment leave one admin | API (real database, concurrent) | `concurrent stepping down keeps one admin` | not yet |
| A non-admin member cannot change another member's role (2 rows) | Unit + API | `<role> caller gets 403` | not yet |
| An editor cannot promote themselves to admin | API | `editor cannot promote self` | not yet |
| An admin of another project cannot change roles in this project | API | `admin of other project gets 404` | not yet |
| A request without valid credentials is rejected (3 rows) | API | `rejects <credentials> with 401` | not yet |
| A non-admin's invalid request is refused before it is validated | API | `authorization is checked before validation` | not yet |
| The target user is not a member of the project | API | `non-member target gets 404 and no membership is created` | not yet |
| The project does not exist | API | `unknown project gets 404` | not yet |
| An admin's request with an invalid role is rejected (7 rows) | API | `rejects invalid body <body> with 400` | not yet |
| A malformed request body is rejected | API | `rejects malformed JSON with 400` | not yet |
| Fields other than the role cannot alter the membership | API | `rejects extra fields and changes nothing` | not yet |

**Checks every API test makes, beyond its own scenario:**
- **Failed requests:** the project's membership table is identical before and after.
- **Successful requests:** only the target's membership changed.
- **Response body:** matches the membership schema exactly, with no user email, password or token fields leaking.
- **Persistence:** the role is re-read from the database, not just from the response.

## 6. Coverage by risk

| Risk | Level tested | Gap? |
|---|---|---|
| Project left with no admin (data integrity) | Unit + API, including both race scenarios | The race tests must run on the same database engine as production. An in-memory or mocked database can't show whether the locking works. |
| Privilege escalation (non-admin or self-promotion) | API | None |
| Cross-project access | API | None |
| Hidden fields changing the membership (mass assignment) | API | None |
| Leaking which projects or memberships exist | API (404 behavior) | Depends on A2 being confirmed |

**Race tests:** each run fires both requests together through a start barrier and repeats about 50 times. The aim is for a naive "count admins, then update" implementation to fail reliably. If the race tests turn out flaky, that points to a real bug, not a test problem.

## 7. Data and environment

- **Test users:** Alice (admin), Bob (editor), Carol (viewer), Dana (second admin, added where a scenario needs one), Erin (admin of Hermes only), Frank (registered, no membership), plus a logged-out caller.
- **Isolation:** each test gets a new project and memberships from factories, so tests can run in any order.
- **Environment:**
  - **Database:** the same engine as production, reset between tests.
  - **Auth:** real auth middleware with test-issued tokens (valid, expired and tampered).
  - **External services:** none involved.

---

**Next steps:**
1. Confirm or change assumptions A1–A8.
2. Approve the scenarios. After that I'll save them to `features/project-membership/change-member-role.feature` and record the plan under `.ai/projects/current/`.

Nothing has been written to disk yet, and no tests have been written or run.
