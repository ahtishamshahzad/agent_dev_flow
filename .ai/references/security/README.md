# References — Security

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Security reference material: threat models and trust boundaries, the authorization matrix (role × resource × action), authentication-flow notes, abuse-prevention decisions, dependency-advisory tracking and remediation status, privacy/PII inventory and data-flow maps, secret **names and storage locations**, and security-review records reported as **Confirmed vs Potential**. **Never store credentials, tokens, live findings with exploit payloads, or unredacted evidence.**

## Supported file types

Markdown (`.md`) for models, matrices, and review records; diagrams for trust boundaries and data flows; **redacted** examples only.

## Naming conventions

`kebab-case` by concern (`threat-model.md`, `authorization-matrix.md`, `pii-inventory.md`, `dependency-advisories.md`).

## How agents should use it

Read when threat modelling, hardening, or reviewing — alongside the security pack (`../../skills/security/README.md`). Authentication (identity), authorization (permission), and abuse prevention (volume/automation) are **three distinct concerns**; keep them separate here. Everything is enforced server-side; client checks are UX. Reviews never print secrets and never claim a system is "secure" (`../../system/SECURITY_RULES.md`).

## References are not requirements

Material here is **context, not commitment.** A recorded finding is **not** closed until the fix is implemented and verified, and a threat model is **not** a guarantee. Requirements/tasks and gate approval govern the build (`../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
