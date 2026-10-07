# password-reset-agentflow-1

- Arm: **agentflow** · Case: `password-reset` · Turns: 17 · Cost: $0.374817 · 55 s

## Prompt

Add password reset to this app.

## Final response

I've stopped at the first approval gate and haven't written any code. This repo uses the `.ai/` engineering system, which requires you to approve the behavior (as Gherkin scenarios) before any design or code. Here's where things stand.

## 1. Request type
**Feature on an existing app** (`demo-api`, Express + PostgreSQL + JWT). It touches authentication and security, so the security rules apply.

## 2. What the codebase looks like (read-only so far)
- **Login today:** `POST /login` uses `userService.verifyPassword`, which compares a bcrypt hash and normalises the email (trim and lowercase). `issueToken` creates a JWT that is valid for 1 hour, with no way to revoke it.
- **Email:** `src/mailer` has `send(to, text)`, which I can reuse to send the reset link.
- **Missing from the repo:** `src/db`, `src/auth`, `src/mailer` and `src/events` are referenced but aren't in this checkout, so I can't see the user model or add a table for reset tokens yet.
- **Undeclared dependencies:** `bcrypt` and `jsonwebtoken` are used but not listed in `package.json`.
- **No tests:** `node --test` exists as a script, but there are no test files.
- **Problems I'm not fixing here (I can log them as separate items):**
  - `GET /projects/:id` doesn't check the caller's company, so users can read other companies' projects.
  - `PATCH /orders/:id/status` doesn't check the company or validate the status.
  - A status change sends the customer **two emails**: one from the event listener and one from the direct `notifyStatusChange` call.

## 3. Questions I need answered
1. **Where do the missing `src/db`, `src/auth` and `src/mailer` modules live?** I can't build token storage without the data layer.
2. **Reset link destination:** this is an API only, with no web app. Should the email contain a link to a front-end URL set by an `APP_URL` setting, or just a code the client submits?
3. **Existing logins after a reset:** the JWTs can't be revoked today. Should a reset sign the user out everywhere? That needs a change to the token, such as a `passwordChangedAt` check in `requireLogin`. Otherwise old tokens stay valid for up to 1 hour.
4. **Password rules:** there are none today. I propose a minimum of 12 characters.
5. **Rate limiting:** do you want it? It would mean either a new dependency (`express-rate-limit`) or a small in-house limiter, and adding a dependency needs your approval.

## 4. Proposed behavior (draft of `features/authentication/password-reset.feature`)
```gherkin
Feature: Password reset
  As a user who has forgotten their password
  I want to reset it through a link sent to my email
  So that I can sign in again without contacting support

  Background:
    Given a user "dana@northwind.example" exists with password "Old-Passw0rd-2026"

  @critical @security
  Scenario: A registered user requests a reset and receives a reset link
    When a reset is requested for "dana@northwind.example"
    Then the response says "If that account exists, a reset link has been sent"
    And "dana@northwind.example" receives one email containing a reset link

  @critical @security
  Scenario: A reset request for an unknown email reveals nothing
    When a reset is requested for "nobody@northwind.example"
    Then the response says "If that account exists, a reset link has been sent"
    And no email is sent

  Scenario: A reset request matches the email regardless of case and spacing
    When a reset is requested for "  Dana@Northwind.example "
    Then "dana@northwind.example" receives one email containing a reset link

  @critical @security
  Scenario: A valid reset link sets a new password
    Given "dana@northwind.example" has a reset link issued 5 minutes ago
    When the reset link is used with new password "Fresh-Harbor-7781"
    Then the response confirms the password was changed
    And "dana@northwind.example" can sign in with "Fresh-Harbor-7781"
    And "dana@northwind.example" cannot sign in with "Old-Passw0rd-2026"

  @critical @security
  Scenario: A reset link cannot be used twice
    Given "dana@northwind.example" has already used a reset link
    When the same reset link is used with new password "Second-Try-4410"
    Then the reset is refused with "This reset link is invalid or has expired"

  @security
  Scenario: An expired reset link is refused
    Given "dana@northwind.example" has a reset link issued 31 minutes ago
    When the reset link is used with new password "Fresh-Harbor-7781"
    Then the reset is refused with "This reset link is invalid or has expired"
    And "dana@northwind.example" can still sign in with "Old-Passw0rd-2026"

  @security
  Scenario: An unrecognised reset token is refused
    When a reset is attempted with token "not-a-real-token" and new password "Fresh-Harbor-7781"
    Then the reset is refused with "This reset link is invalid or has expired"

  @security
  Scenario: Requesting a new reset link invalidates the earlier one
    Given "dana@northwind.example" has a reset link issued 5 minutes ago
    When another reset is requested for "dana@northwind.example"
    Then the earlier reset link is refused with "This reset link is invalid or has expired"

  Scenario: A new password that is too short is refused
    Given "dana@northwind.example" has a reset link issued 5 minutes ago
    When the reset link is used with new password "short1"
    Then the reset is refused with "Password must be at least 12 characters"
    And the reset link can still be used
```
**These depend on your answers above:**
- If you want a reset to sign the user out everywhere: *"Sessions started before a reset are rejected afterwards."*
- If you want rate limiting: *"Repeated reset requests for one email are throttled."*
- Optional: *"A confirmation email is sent after the password changes."*

## 5. Defaults I'll use unless you say otherwise
- **No new applications.** Everything stays in this API, with two new public endpoints (request a reset, confirm a reset).
- **No change to the stack:**
  - Reset tokens go in a new PostgreSQL table holding only a SHA-256 hash of each token, never the raw value.
  - Tokens are random 32-byte values, valid for 30 minutes and usable once.
  - New passwords are hashed with bcrypt, as login already does.
- **Tests:** each scenario maps to a named test using the built-in `node --test` runner, with no Cucumber runner.

**Next step:** please answer the questions in section 3 and approve or edit the scenarios. I'll then record the decision under `.ai/projects/current/`, design the change, and come back with a phase and task plan for the second approval before writing any code.
