# Testing Selection Rules

Choose testing **levels and tools** per application and per change — proportional to risk. Testing is a gate (`QUALITY_GATES.md` gate 5), not an afterthought.

## Test levels

- **Unit** — individual functions/components in isolation.
- **Integration** — modules/services working together (e.g. API + data layer).
- **End-to-end (E2E)** — full user flows through a running application.
- **Contract** — API request/response shapes between client and server.
- **Regression** — a test that pins a fixed bug so it can't return.

## Tool options (decision space, not defaults)

| Area | Options |
|---|---|
| JS/TS unit & integration | Jest · Vitest |
| HTTP/API integration | Supertest |
| Web E2E | Playwright |
| Mobile E2E | Maestro |
| React Native components | React Native Testing Library |

Choose per application; align with the approved stack (`STACK_DECISION_RULES.md`) and prefer one runner per app unless there's a reason to differ.

## How to select

1. **Match level to risk.** Auth, payments, data integrity, and permissions get integration + E2E, not just units. Low-risk pure functions may need only units.
2. **Match tool to application.** Web flows → Playwright; mobile flows → Maestro; API → Supertest + a runner; RN components → RNTL.
3. **Every bug fix gets a regression test** (`PHASE_GENERATION_RULES.md` bug shape).
4. **Test behavior and contracts**, not implementation detail that will churn.
5. **Prioritize the critical path** first when time is constrained; record what's deferred.

## Execution honesty

- Run what the environment allows and quote results.
- If a test can't be run here, provide the exact command and mark it **"unverified until run"** (`OPERATING_RULES.md` §8).
- A green run of the wrong tests is not coverage — state what was actually exercised.

## Recording

Note the chosen levels/tools and the coverage intent in the work item and `../projects/current/`. The testing gate checks that required tests exist and pass (or are explicitly flagged) before review/release.
