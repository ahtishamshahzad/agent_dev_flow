# existing-project-triggers-agentflow-2

- Arm: **agentflow** · Case: `existing-project-triggers` · Turns: 6 · Cost: $0.31361659999999997 · 46 s
- Project files (besides installed `.ai/`): `.nvmrc`, `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package-lock.json`, `package.json`, `src/app.js`, `src/notifications/sendOnStatusChange.js`, `src/services/userService.js`

## Prompt

Add an endpoint so a user can delete one of their company's projects.

## Final response

I haven't written any code yet. This repo's rules (`CLAUDE.md` → `.ai/system/OPERATING_RULES.md`) say any change in behavior needs approved Gherkin scenarios before implementation, so I've stopped at that approval step. I tried to save the status to `.ai/projects/current/CURRENT_STATUS.md`, but writing the file needed permission, so the audit is below instead.

**Request type:** a feature added to the existing project. It's mainly an authorization and company-isolation change.

## What I found in the repo
- **Versions (from the lock file and `.nvmrc`):** Node 16, express 4.19.2, jsonwebtoken 8.5.1, bcrypt 5.1.1. I'm not proposing any stack change.
- **Missing modules:** `src/app.js` imports `src/db`, `src/auth`, `src/events` and `src/mailer`, but none of them are in the repo (I listed `src/` recursively). I can't see how the `projects` model deletes rows or whether other tables refer to projects.
- **No tests:** I searched the whole repo for `*.test.js`, `*.spec.js` and `*.feature` and found nothing. `npm test` runs `node --test`. I haven't checked whether Node 16 supports that flag.
- **Security problem in the existing code:** `GET /projects/:id` (`src/app.js:18`) never checks `companyId`, so any logged-in user can read any company's project. The new delete endpoint must not copy that pattern. Fixing the GET is out of scope here; I'm proposing it as a separate bug.
- **Other follow-ups (also out of scope):**
  - `PATCH /orders/:id/status` has no company check.
  - The same endpoint emails the customer twice: once directly and once through the `order.statusChanged` listener.
  - Node 16 is past end of life, and I recall jsonwebtoken 8.x having known security advisories (not checked against current sources yet).

## Proposed behavior (needs your approval)

```gherkin
Feature: Delete a company project
  As a signed-in user
  I want to delete one of my company's projects
  So that projects we no longer need are removed

  Scenario: A user deletes a project belonging to their company
    Given "Dana" is signed in as a member of "Acme"
    And "Acme" owns the project "Website Redesign"
    When Dana deletes the project "Website Redesign"
    Then the deletion is confirmed with no content
    And the project "Website Redesign" can no longer be retrieved

  @critical
  Scenario: A user cannot delete another company's project
    Given "Dana" is signed in as a member of "Acme"
    And "Globex" owns the project "Q4 Launch"
    When Dana tries to delete the project "Q4 Launch"
    Then the project is reported as not found
    And the project "Q4 Launch" still exists

  Scenario: Deleting a project that does not exist
    Given "Dana" is signed in as a member of "Acme"
    When Dana tries to delete a project that does not exist
    Then the project is reported as not found

  @critical
  Scenario: An anonymous caller cannot delete a project
    Given "Acme" owns the project "Website Redesign"
    When an anonymous caller tries to delete the project "Website Redesign"
    Then the request is refused as unauthenticated
    And the project "Website Redesign" still exists
```

In HTTP terms, the plan is `DELETE /projects/:id` with `requireLogin`, scoped to `req.user.companyId`. It returns 204 on success, and 404 both when the project doesn't exist and when it belongs to another company, so other companies' project IDs aren't revealed. Deleting the same project twice returns 404 the second time.

## Questions to answer before I build this
1. **Hard or soft delete?** Should the row be removed, or marked deleted (for example with `deletedAt`)? A soft delete would also change what other reads return.
2. **Who can delete?** I found no roles in the code I can see. Is any member of the company allowed?
3. **Related data:** do orders or other records refer to projects? If so, should the delete be blocked, cascade, or leave those records in place?
4. **Missing modules:** can you add `src/db` and `src/auth` to the repo, or tell me how the `projects` model's delete method works? Otherwise the implementation rests on a guess.

Once you approve or change the scenarios and answer these, I'll draft a short plan with tasks and named tests for your second approval, and only then write the code.
