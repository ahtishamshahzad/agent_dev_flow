# Gherkin examples

> **Status: PROPOSED.** Specification examples — the behavioral contracts a project would approve before building. No implementation or tests exist behind them.

Each file follows `../../.ai/system/GHERKIN_RULES.md` and passes `agentflow gherkin validate`.

| File | Shows |
|---|---|
| [`feature.feature`](feature.feature) | A new feature: happy path, a business rule, a refusal, and a cross-tenant denial |
| [`bug-regression.feature`](bug-regression.feature) | A bug fix's regression scenarios, tagged with the bug ID and kept permanently |
| [`api.feature`](api.feature) | API behavior: pagination, a `Scenario Outline` for boundaries, tenant isolation, authentication |
| [`authentication.feature`](authentication.feature) | Password reset: expiry, single use, no account enumeration, session revocation |
| [`offline-sync.feature`](offline-sync.feature) | Mobile offline: local save, sync, interrupted sync without duplicates, restart survival |
| [`subscription.feature`](subscription.feature) | Payments: upgrade, decline, a duplicated provider confirmation, authorization |
| [`ai-assistant.feature`](ai-assistant.feature) | An AI feature: grounded answers, "I don't know" over guessing, scope, provider failure |

Every scenario states **observable behavior** — what a user or caller sees — never which function or component does it.
