# Test Plan — <project/feature>

> Fill-in template. Test types/tools chosen per application and risk; required cases covered; coverage risk-driven, not percentage-driven (`../skills/testing/testing-selection`, `../system/TESTING_SELECTION_RULES.md`).

- **Date:** <YYYY-MM-DD> · **Status:** draft | approved

## Selection (per application)

| Application | Unit/integration (Jest/Vitest) | API (Supertest) | Component (Testing Library) | Web E2E (Playwright) | Mobile E2E/smoke (Maestro) | Contract |
|-------------|--------------------------------|-----------------|-----------------------------|----------------------|----------------------------|----------|
| <> | <> | <> | <> | <> | <> | <> |

- **Not adopted (and why):** <e.g. no Playwright — no web app>

## Required Cases (per critical behavior)

Each case is **one Gherkin scenario** (`../system/GHERKIN_RULES.md`, `../skills/testing/gherkin-specifications`) — never bundled into a single scenario:

- [ ] happy path · [ ] invalid input · [ ] error path · [ ] **authorization denial** · [ ] regression · [ ] critical environment/config validation

| Scenario | Level | Test (file/case) | Automated? |
|----------|-------|------------------|------------|
| <scenario title> | <unit/integration/api/e2e> | <> | yes / not yet |

## Coverage by Risk

| Critical path | Tested at level | Gap? |
|---------------|-----------------|------|
| <auth / money / data integrity> | <> | <> |

> No coverage-percentage target without risk justification.

## Data & Environment

- **Factories / personas:** <A / B / admin / other-tenant>
- **Environment:** production-engine datastore; externals faked; config validated.

## Related

- Skills: `../skills/testing/README.md`. Gate 5 (`../system/QUALITY_GATES.md`).
