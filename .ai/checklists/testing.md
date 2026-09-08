# Checklist: Testing

> Verifiable items for the testing gate. Maps to Gate 5 and `../system/TESTING_SELECTION_RULES.md`.

## Pass Criteria

- [ ] Test types/tools selected **per application need** — Playwright (web E2E), Maestro (mobile E2E/smoke), Supertest (API), Testing Library (components), Jest/Vitest (unit/integration); non-adoptions recorded (`../skills/testing/testing-selection`).
- [ ] Behaviors specified as **Gherkin scenarios** meeting `../system/GHERKIN_RULES.md` — one behavior each, domain-level steps, observable `Then`; each mapped to a named test or explicitly flagged as not yet automated (`../skills/testing/gherkin-specifications`).
- [ ] **Required cases** covered on critical behaviors: happy · invalid input · error · **authorization denial** · regression · critical environment/config validation.
- [ ] Critical paths tested at the right pyramid level; E2E reserved for critical journeys.
- [ ] Test data via factories with personas (A/B/admin/other-tenant); production-engine datastore; externals faked; config validated.
- [ ] Suite hermetic, deterministic, CI-gating; flakiness root-caused not retried (`../skills/testing/flaky-test-audit`).
- [ ] **Coverage assessed by risk, not chased as a percentage** (`../skills/testing/test-coverage-audit`).

## Fail / Stop

- Scenarios that assert "it works", bundle several behaviors, or leak selectors/SQL into step text; missing error/authorization-denial coverage on critical paths; SQLite-for-production-engine; flaky suite bypassed; coverage-number targets without risk justification.

## Related

Template: `../templates/TEST_PLAN.md`. Skills: `../skills/testing/README.md`.
