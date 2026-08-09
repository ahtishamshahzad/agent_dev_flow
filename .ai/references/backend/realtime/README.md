# References — Backend / Realtime

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Realtime transport reference material: WebSocket/SSE topology, channel and room naming, authentication and authorization **on connect and on subscribe**, presence handling, reconnect and replay semantics, backpressure limits, and horizontal-scale/fan-out notes.

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`channel-naming.md`, `connect-auth.md`, `reconnect-semantics.md`).

## How agents should use it

Read when building or reviewing realtime features, alongside `../../../skills/backend/realtime-communication`. A socket connection is authorized per channel, not once at handshake — pair with `../../../skills/backend/ownership-authorization`.

## References are not requirements

Material here is **context, not commitment.** A topology sketched here is **not** the approved architecture until it passes the architecture gate. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
