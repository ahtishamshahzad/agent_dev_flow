# References — Web / Testing

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Web testing reference material: component/interaction test patterns (Testing Library), critical-journey Playwright scripts, accessible-query conventions, and fixture/seed patterns for web tests.

## Supported file types

Markdown (`.md`) for patterns; small test snippets in fenced blocks.

## Naming conventions

`kebab-case` by concern (`component-testing.md`, `critical-journeys.md`).

## How agents should use it

Read when writing web tests, alongside `../../../skills/web/web-component-testing`, `web-unit-testing`, and `../../../skills/testing/playwright-e2e`. Reserve E2E for critical journeys; cover required cases including authorization-denied states.

## References are not requirements

Material here is **context, not commitment.** A testing reference does **not** automatically become a requirement. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope.
