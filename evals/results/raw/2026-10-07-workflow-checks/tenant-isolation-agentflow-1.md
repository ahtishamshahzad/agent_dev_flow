# tenant-isolation-agentflow-1

- Arm: **agentflow** · Case: `tenant-isolation` · Turns: 12 · Cost: $0.31477659999999996 · 45 s

## Prompt

Prevent users from accessing another company's resources.

## Final response

I couldn't implement this, because the workspace has no application to change. It contains only the `.ai/` planning system: no source code, data models, API routes or `features/` folder. There's no `CURRENT_STATUS.md`, no work items, and it isn't a git repo. So there's no code where a company check could go, and I've changed nothing.

The project's rules also require you to approve the expected behavior (written as test scenarios) before any code that changes behavior. Keeping companies' data separate counts as one of those changes. So I've done the planning steps and need a few answers from you.

## Where this stands

- **Request type:** Feature, covering security and permissions (who can see which company's data).
- **Step reached:** Describing the behavior. Your approval of it is the first sign-off, and nothing has been designed or built yet.

## What I need from you

1. **Where is the application?** Is it in another folder or repo I should look at, or is this a new project?
2. **What are the "resources"?** For example invoices, projects or files. I've used "invoice" below as a stand-in.
3. **Can a user belong to more than one company?** If so, how do they pick the active one?
4. **What happens when someone asks for another company's resource?** I recommend "not found", so they can't even confirm it exists. The alternative is "access denied".
5. **Can anyone see across companies,** such as your own support staff or a platform admin? If so, should that access be logged?

## Draft scenarios for your approval

These are written in Gherkin and don't depend on any particular technology:

```gherkin
Feature: Company data isolation
  As a member of a company
  I want my company's resources to be visible only to my company
  So that no other company can read or change our data

  Background:
    Given the company "Acme Ltd" owns invoice "INV-1001"
    And the company "Globex Inc" owns invoice "INV-2001"

  @critical @security @authorization
  Scenario: A member views their own company's invoice
    Given "dana@acme.example" is signed in as a member of "Acme Ltd"
    When Dana requests invoice "INV-1001"
    Then Dana sees invoice "INV-1001"

  @critical @security @authorization
  Scenario: A member cannot view another company's invoice
    Given "dana@acme.example" is signed in as a member of "Acme Ltd"
    When Dana requests invoice "INV-2001"
    Then Dana is told the invoice is not found
    And no details of invoice "INV-2001" are revealed

  @critical @security @authorization
  Scenario: A member cannot change another company's invoice
    Given "dana@acme.example" is signed in as a member of "Acme Ltd"
    When Dana tries to update invoice "INV-2001"
    Then Dana is told the invoice is not found
    And invoice "INV-2001" is unchanged

  @critical @security @authorization
  Scenario: A member cannot delete another company's invoice
    Given "dana@acme.example" is signed in as a member of "Acme Ltd"
    When Dana tries to delete invoice "INV-2001"
    Then Dana is told the invoice is not found
    And invoice "INV-2001" still exists

  @critical @security @authorization
  Scenario: Lists show only the member's own company's invoices
    Given "dana@acme.example" is signed in as a member of "Acme Ltd"
    When Dana lists invoices
    Then the list contains "INV-1001"
    And the list does not contain "INV-2001"

  @critical @security @authorization
  Scenario: A company named in the request is ignored
    Given "dana@acme.example" is signed in as a member of "Acme Ltd"
    When Dana creates an invoice that names "Globex Inc" as its company
    Then the new invoice belongs to "Acme Ltd"

  @critical @security @authorization
  Scenario: Exports include only the member's own company's data
    Given "dana@acme.example" is signed in as a member of "Acme Ltd"
    When Dana exports all invoices
    Then the export contains "INV-1001"
    And the export does not contain "INV-2001"
```

**Not yet covered (depends on your answers):** switching between companies (question 3), staff or admin access across companies and its logging (question 5), and background jobs and webhooks working only on their own company's data.

## How it would be built, once approved

This follows the project's permissions checklist (`.ai/checklists/authorization.md`):

- The user's company is always taken from their login, never from anything they send in the request.
- The company filter is applied when the data is fetched, rather than loading the data and checking afterwards. It applies everywhere: lists, single items, updates, deletes, exports, background jobs and admin tools.
- The check lives in one shared place, not repeated in every route.
- Every scenario above gets a matching automated test that must pass.

If you tell me where the code is and answer the questions above, I'll check the existing code, revise the scenarios and send them back for your approval.
