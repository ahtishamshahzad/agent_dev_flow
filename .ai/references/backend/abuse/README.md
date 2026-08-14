# References — Backend / Abuse Prevention

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Rate-limit and abuse-prevention reference material: limit tiers and the key they are counted by (IP, user, tenant, API key), burst vs sustained windows, lockout and cooldown policy, CAPTCHA/challenge placement decisions, and known abuse patterns observed in production. **No live keys or provider secrets.**

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`rate-limit-tiers.md`, `captcha-placement.md`, `lockout-policy.md`).

## How agents should use it

Read when designing or reviewing throttling and abuse controls, alongside `../../../skills/backend/rate-limiting`, `../../../skills/backend/captcha-abuse-prevention`, and `../../../skills/security/abuse-prevention`. Abuse prevention is distinct from authentication and from authorization — it limits *volume and automation*, not identity or permission.

## References are not requirements

Material here is **context, not commitment.** A documented limit does **not** become the enforced limit until it is implemented and tested. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
