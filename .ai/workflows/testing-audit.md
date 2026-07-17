# Workflow: Testing Audit

> Assess whether the right things are tested — by risk, not coverage percentage — and fill the gaps that matter.

## Request Classification

**Primary type:** testing audit. Selected when the goal is to assess/improve test coverage and quality.

## Skills Required

`../skills/testing-strategy` + `../skills/testing/*` (test-coverage-audit, testing-selection, unit/integration/api-integration/contract, playwright/maestro, regression/smoke, flaky-test-audit, test-data/environment-management), `../skills/existing-project-audit` for context.

## Agents Involved

`orchestrator` → `test-engineer` (assess + author tests) → owning engineers for any product fix a test reveals → `code-reviewer`.

## Context Required

The critical-path/risk map, existing suites, optional coverage data (as a hint), and the applications' test selection.

## Gates

Gate 5 (testing) primarily.

## Documents Generated

Coverage-by-risk assessment, gap list (esp. error and **authorization-denial** branches), prioritized test recommendations, new tests, flaky-test findings.

## Validation

Critical paths tested at the right level; required cases present (happy, invalid input, error, authorization denial, regression, critical env validation); **no coverage-percentage chased without risk justification**; flakiness root-caused; suite hermetic and CI-gating.

## Handoff

Assess → prioritize by risk → author gap tests → verify suite health, via Handoff Format.

## Stop Condition

- **Stop** if recommendations are being driven by a coverage number rather than risk — reframe by risk.
- **Complete** when critical-path/required-case gaps are identified and filled, and the suite is trustworthy (not flaky, CI-gating).

## Related

Skills: `../skills/testing/test-coverage-audit`, `testing-selection`. Rule: `../system/TESTING_SELECTION_RULES.md`.
