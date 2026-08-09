# References — Backend / Security

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Backend security reference material: threat notes for the service, security-header and CORS configuration, input-validation matrices, secret-handling procedure (**names and locations only**), dependency-advisory tracking, and remediation records. **Never store credentials, tokens, or unredacted findings.**

## Supported file types

Markdown (`.md`) for notes and matrices; **redacted** examples only.

## Naming conventions

`kebab-case` by concern (`security-headers.md`, `validation-matrix.md`, `dependency-advisories.md`).

## How agents should use it

Read when hardening or reviewing a backend, alongside `../../../skills/backend/backend-security` and `../../../skills/security/api-security`. Everything is enforced server-side; client checks are UX. Reviews report Confirmed vs Potential and never claim a system is "secure".

## References are not requirements

Material here is **context, not commitment.** A remediation note is **not** a fix — a finding closes only when the fix is implemented and verified. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
