# References — Backend (Topic Index)

> Backend reference material, organized by sub-topic. Agents read **only the relevant sub-folder** for the active task (`../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Each sub-folder starts empty; material is added as the project develops. **Do not create fake reference content.** **Never store secrets or real data here.**

## Sub-topics

| Folder | Covers |
|--------|--------|
| [`auth/`](auth/README.md) | Authentication (identity): session/JWT lifecycle, account flows. |
| [`authorization/`](authorization/README.md) | Authorization matrix, roles/permissions, ownership/tenant scoping, negative tests. |
| [`api/`](api/README.md) | Endpoint conventions, the contract (OpenAPI/GraphQL), pagination/versioning. |
| [`database/`](database/README.md) | Schema/ER notes, data-layer patterns, migration playbooks, index analyses. |
| [`errors/`](errors/README.md) | Error taxonomy, safe response shape, status mapping. |
| [`validation` → `api/`](api/README.md) | Request/response validation shapes live with the contract. |
| [`abuse/`](abuse/README.md) | Rate-limit tiers and keys, lockout policy, CAPTCHA/challenge placement. |
| [`jobs/`](jobs/README.md) | Job catalogue, queue topology, retry/backoff, DLQ, schedules, idempotency. |
| [`integrations/`](integrations/README.md) | Provider contracts, inbound/outbound webhooks, email/notification providers. |
| [`realtime/`](realtime/README.md) | WebSocket/SSE topology, channel naming, connect/subscribe auth, reconnect. |
| [`files/`](files/README.md) | Upload validation, storage layout, signed URLs, retention. |
| [`observability/`](observability/README.md) | Log taxonomy, correlation ids, metrics/SLOs, traces, alert routes. |
| [`performance/`](performance/README.md) | Profiling, hotspots, N+1 findings, caching, load-test results. |
| [`security/`](security/README.md) | Headers/CORS, validation matrices, dependency advisories, remediation records. |
| [`testing/`](testing/README.md) | Unit/integration boundaries, fixtures, DB-under-test strategy, stubbing. |
| [`deployment/`](deployment/README.md) | Runtime config, health checks, migrate-vs-deploy ordering, rollback sequence. |
| [`express/`](express/README.md) | Express app/router composition, middleware order, error middleware. |
| [`nestjs/`](nestjs/README.md) | NestJS modules/providers, guards vs interceptors vs pipes, DTO validation. |

`express/` and `nestjs/` are **framework** folders: populate only the one that matches the approved framework (`../../skills/backend/backend-stack-selection`).

## Where a topic lives

Some concerns span packs — keep **one home** per topic and cross-link rather than duplicating:

| Concern | Home | Also see |
|---------|------|----------|
| Query plans, indexes, schema | [`../database/`](../database/README.md) | `performance/` for the app-side offender |
| CI/CD, containers, environments | [`../devops/`](../devops/README.md) | `deployment/` for service release ordering |
| Threat model, authorization matrix, PII | [`../security/`](../security/README.md) | `security/` for backend-specific config |
| Deploy targets, cross-cutting runbooks | [`../deployment/`](../deployment/README.md) | `deployment/` for this service's ordering |

## Conventions

Each terminal sub-folder's README states what belongs there, file types, naming, how agents use it, and that **references do not automatically become requirements**. Pairs with the backend skills (`../../skills/backend/README.md`).
