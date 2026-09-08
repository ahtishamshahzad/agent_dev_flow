# `.ai/skills/testing/` — Testing Skill Pack (Index)

Reusable, tool-neutral skills for choosing and building a project's tests. Discover them **through this index**, then load only the relevant ones (`../../system/SKILL_SELECTION_RULES.md`). **Do not load the whole pack** — most tasks need 1–3 skills.

Testing skills select tools by project need (Playwright for web/dashboard E2E, Maestro for mobile E2E/smoke, Supertest for backend API integration, Testing Library for components, Jest/Vitest for unit/integration logic), cover the **required cases** (happy path, invalid input, error path, authorization denial, regression, critical environment validation), and **never chase a coverage percentage without risk justification**. They refine the core `../testing-strategy` and coordinate with the backend, devops, and security packs.

## Categories

### Selection
| Skill | Description |
|-------|-------------|
| [`testing-selection`](testing-selection/SKILL.md) | Choose test types + tools per application; adopt only what the project needs. |

### Specification
| Skill | Description |
|-------|-------------|
| [`gherkin-specifications`](gherkin-specifications/SKILL.md) | Write behavior as Gherkin scenarios — acceptance criteria and required cases, one behavior each, observable outcomes (`../../system/GHERKIN_RULES.md`). |

### Levels
| Skill | Description |
|-------|-------------|
| [`unit-testing`](unit-testing/SKILL.md) | Pure logic with Jest/Vitest; happy/invalid/error paths; isolated, deterministic. |
| [`integration-testing`](integration-testing/SKILL.md) | Real boundaries + real DB; happy/invalid/error + authorization denial. |
| [`api-integration-testing`](api-integration-testing/SKILL.md) | Supertest over real HTTP + real DB; the authorization-denial negative suite. |
| [`contract-testing`](contract-testing/SKILL.md) | Provider↔consumer contract conformance in CI; catches breakage before deploy. |

### End-to-End
| Skill | Description |
|-------|-------------|
| [`playwright-e2e`](playwright-e2e/SKILL.md) | Critical web/dashboard journeys; resilient waits, small stable suite. |
| [`maestro-e2e`](maestro-e2e/SKILL.md) | Critical mobile journeys + smoke on device/emulator. |

### Regression & Confidence
| Skill | Description |
|-------|-------------|
| [`regression-testing`](regression-testing/SKILL.md) | Failing-first test per fixed bug; CI-gated so breakage can't return. |
| [`smoke-testing`](smoke-testing/SKILL.md) | Minimal post-build/post-deploy alive-check as go/no-go. |
| [`visual-regression`](visual-regression/SKILL.md) | Baseline image diffs for design-critical surfaces; adopt only when justified. |

### Data, Environment & Health
| Skill | Description |
|-------|-------------|
| [`test-data-management`](test-data-management/SKILL.md) | Factories, per-test isolation, authorization personas; no production PII. |
| [`test-environment-management`](test-environment-management/SKILL.md) | Production-engine datastores, faked externals, critical env/config validation. |
| [`flaky-test-audit`](flaky-test-audit/SKILL.md) | Find/diagnose/fix flakiness at the root; quarantine only, temporarily. |
| [`test-coverage-audit`](test-coverage-audit/SKILL.md) | Coverage by risk, not percentage; find untested critical + error/denial paths. |

## Selection guidance (testing)

| Situation | Load (only these) |
|---|---|
| Writing acceptance criteria / required cases | `gherkin-specifications` (always — the format is not optional) |
| New project testing | `testing-selection` → the per-level skills the apps need |
| Backend logic + API | `unit-testing` + `api-integration-testing` (+ `integration-testing`) |
| Web app | `playwright-e2e` (critical journeys) + component tests (Testing Library) |
| Mobile app | `maestro-e2e` (critical flows + smoke) |
| Independently deployed client/service | `contract-testing` |
| Every bug fix | `regression-testing` |
| Release confidence | `smoke-testing` (post-deploy) |
| Data/env setup | `test-data-management` + `test-environment-management` |
| CI is red-noisy | `flaky-test-audit` |
| Assessing a suite | `test-coverage-audit` |

## Dependency guidance (how testing skills relate)

- **Specification first** (`gherkin-specifications`): the behavior is written as scenarios before the level is chosen — those scenarios are the acceptance criteria at Gate 4 and the cases every level skill below implements.
- **Selection first** (`testing-selection`) drives which level skills and tools are used, and feeds `../devops/ci-cd` job generation.
- **Levels layer**: unit → integration/API → E2E (few, critical); `contract-testing` guards cross-deploy boundaries.
- **Data + environment** (`test-data-management`, `test-environment-management`) underpin every above-unit test; personas enable authorization-denial coverage.
- **Regression/smoke** protect against reintroduction and bad deploys; `flaky-test-audit` keeps suites trusted; `test-coverage-audit` keeps effort risk-aligned.
- **Cross-pack**: authorization negatives ↔ `../backend/backend-authorization`/`../security/authorization-security`; security negatives ↔ `../security/security-regression-testing`; CI wiring ↔ `../devops/ci-cd`.

## References

`../../references/testing/` — tool-fit notes, helper/factory patterns, E2E and coverage playbooks (populated as the project develops).

## Rule: do NOT load the whole pack

Loading every testing skill wastes context (`../../system/TOKEN_OPTIMIZATION_RULES.md`). Select the minimum relevant set via this index, load one stage at a time, and unload on task switch.
