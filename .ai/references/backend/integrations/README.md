# References — Backend / Integrations

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Third-party integration reference material: provider contracts and payload shapes, inbound/outbound webhook signatures and retry semantics, idempotency-key strategy, sandbox vs production differences, email/notification templates and provider limits, and failure/degradation behaviour. **Never store API keys, tokens, or signing secrets.**

## Supported file types

Markdown (`.md`) for contracts and notes; **redacted** sample payloads in fenced blocks.

## Naming conventions

`kebab-case` by provider or flow (`stripe-webhooks.md`, `email-provider-limits.md`, `outbound-retry.md`).

## How agents should use it

Read when integrating or reviewing an external service, alongside `../../../skills/backend/third-party-integrations`, `../../../skills/backend/webhooks`, and `../../../skills/backend/email-notifications`. Inbound webhooks are verified, acknowledged fast, processed async, and deduped; outbound calls are signed, retried with backoff, and tracked.

## References are not requirements

Material here is **context, not commitment.** A provider capability documented here does **not** make it an approved dependency. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
