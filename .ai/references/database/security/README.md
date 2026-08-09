# References — Database / Security

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

Database security reference material: least-privilege role and grant matrices, connection/TLS requirements, encryption-at-rest and field-level encryption decisions, PII inventory and classification, retention/deletion rules, and audit-logging scope. **Never store credentials, connection strings with passwords, or exported data.**

## Supported file types

Markdown (`.md`) for matrices and notes; **redacted** examples only.

## Naming conventions

`kebab-case` by concern (`role-grants.md`, `pii-inventory.md`, `retention-rules.md`).

## How agents should use it

Read when hardening or reviewing data access, alongside `../../../skills/database/database-security` and `../../../skills/security/database-security`. Application-level ownership filtering (`../../../skills/backend/ownership-authorization`) and database-level grants are complementary, not substitutes.

## References are not requirements

Material here is **context, not commitment.** A documented grant matrix is **not** the live grant set until applied and verified. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
