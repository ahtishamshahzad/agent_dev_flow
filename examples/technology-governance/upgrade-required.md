# Existing project — when the upgrade is justified

> **Status: PROPOSED.** Fictional.

## What the audit found

| Technology | Installed | Problem | Trigger (rules §4) | Urgency |
|---|---|---|---|---|
| Node.js | `NN` | Past end-of-life on the official release schedule — no more security fixes | End of life | **High** |
| `jsonwebtoken` | `8.x` | A published advisory affects how the app verifies tokens | Vulnerability affecting use | **Critical** |
| ORM | `X.Y` | Newer major available | none | — keep |

The ORM stays: newer is not a reason. The other two have concrete triggers.

## Routing

- **Vulnerability** → bug intake at **P0** (`BUG-021`), fixed now in the current week — security outranks stability.
- **Runtime end-of-life** → a migration work item (`TECH-034`), scheduled, because it's outside the current feature's scope. Logged in `CHANGE-LOG.md`, not folded into the feature.

## Migration plan (Node `NN` → current LTS)

1. Read the official migration notes for every major in between; list breaking changes that touch the app (removed APIs, changed defaults).
2. Check the chain: framework, ORM, native modules, Docker base image, CI image — each must support the target LTS (`npm view <pkg>@<ver> engines`).
3. Upgrade in one environment first (CI → staging), pinned image tags.
4. Rollback: previous image tag retained; deploy is reversible.

## Regression protection — the behavior, not the upgrade

The upgrade isn't a behavior. What users rely on must still hold:

```gherkin
@regression @critical
Feature: Sign-in survives the runtime upgrade

  Scenario: Existing user signs in after the upgrade
    Given Lena has an account created before the upgrade
    When Lena signs in with her password
    Then Lena sees her dashboard

  Scenario: Sessions issued before the upgrade stay valid until they expire
    Given Lena signed in before the upgrade
    When Lena opens the app after the upgrade
    Then Lena is still signed in
```

These pass on the old runtime, then must pass on the new one. Recorded in `TECHNOLOGY_DECISION.md` (change form): trigger, breaking changes, regression scenarios, urgency, scope.
