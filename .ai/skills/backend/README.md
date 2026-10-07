# `.ai/skills/backend/` — Backend Skill Pack (Index)

Reusable, tool-neutral skills for planning and building backend APIs (Node/TypeScript: Express or NestJS). Discover them **through this index**, then load only the relevant ones (`../../system/SKILL_SELECTION_RULES.md`). **Do not load the whole pack** — most tasks need 1–3 skills.

Backend skills evaluate requirements rather than apply universal defaults (Express vs NestJS is a decision, not a habit), enforce everything server-side (client checks are UX), keep authorization distinct from authentication *and* from abuse prevention, and never scaffold applications or install dependencies before the approval gates (`../../system/QUALITY_GATES.md`). They coordinate with the core skills (`../`) and the database pack (`../database/`).

## Categories

### Foundation & Stack
| Skill | Description |
|-------|-------------|
| [`backend-stack-selection`](backend-stack-selection/SKILL.md) | Express vs NestJS, evaluated on domains/team/async needs; **no universal default**. |
| [`existing-backend-audit`](existing-backend-audit/SKILL.md) | Inventory an existing backend (structure, API, auth, data, jobs, risks) before changing it. |
| [`express-foundation`](express-foundation/SKILL.md) | Express foundation: layering, middleware order, config, central error handler. |
| [`nestjs-foundation`](nestjs-foundation/SKILL.md) | NestJS foundation: domain modules, DI, pipes/guards/interceptors/filters, config. |

### API Design
| Skill | Description |
|-------|-------------|
| [`backend-api-architecture`](backend-api-architecture/SKILL.md) | Internal layering, domain boundaries, homes for cross-cutting concerns. |
| [`rest-api-design`](rest-api-design/SKILL.md) | Resources, methods, status codes, pagination, versioning, idempotency. |
| [`graphql-api-design`](graphql-api-design/SKILL.md) | Fit decision first; schema, dataloaders (N+1), connections, cost limits, field authz. |
| [`api-contracts`](api-contracts/SKILL.md) | One contract source of truth; type flow; breaking-change policy. |

### Request Handling
| Skill | Description |
|-------|-------------|
| [`backend-validation`](backend-validation/SKILL.md) | Schema validation at every entry point; unknown fields stripped; server authoritative. |
| [`backend-error-handling`](backend-error-handling/SKILL.md) | Error taxonomy, one central handler, one safe response shape, correlated logging. |

### Auth & Access Control
| Skill | Description |
|-------|-------------|
| [`backend-authentication`](backend-authentication/SKILL.md) | Identity: credentials, sessions vs JWT, lifecycle, account flows. Not authorization. |
| [`backend-authorization`](backend-authorization/SKILL.md) | Umbrella: distinguishes authn / role / permission / ownership / tenant / object-level; mandates negative tests. |
| [`role-permission-design`](role-permission-design/SKILL.md) | Role set, permission granularity, claims, central check API, audited assignment. |
| [`ownership-authorization`](ownership-authorization/SKILL.md) | Ownership/tenant/object scope in queries from session context; anti-IDOR; cross-tenant negative tests. |

### Abuse Prevention
| Skill | Description |
|-------|-------------|
| [`rate-limiting`](rate-limiting/SKILL.md) | Per-class limits (signup, login, reset, OTP, contact, search, expensive); keys, stores, 429s. Not authorization. |
| [`captcha-abuse-prevention`](captcha-abuse-prevention/SKILL.md) | CAPTCHA/bot signals for public flows; server-verified, layered with rate limits. Not authorization. |

### Data & Files
| Skill | Description |
|-------|-------------|
| [`file-storage`](file-storage/SKILL.md) | Uploads/storage/serving: presigned vs proxy, magic-byte validation, scoped keys, signed reads. |

### Async & Jobs
| Skill | Description |
|-------|-------------|
| [`background-jobs`](background-jobs/SKILL.md) | What leaves the request path; idempotent handlers, retries, outbox, failure paths. |
| [`queues`](queues/SKILL.md) | Broker choice, queue-per-class topology, workers, at-least-once, DLQs. |
| [`scheduled-jobs`](scheduled-jobs/SKILL.md) | Cron work: single execution across instances, overlap/missed-run policy, absence alerts. |

### Communication & Integration
| Skill | Description |
|-------|-------------|
| [`realtime-communication`](realtime-communication/SKILL.md) | Polling vs SSE vs WebSockets; socket auth, channel authorization, reconnect recovery, fan-out. |
| [`webhooks`](webhooks/SKILL.md) | Inbound: verify/ack/process-async/dedupe. Outbound: sign/retry/track. |
| [`third-party-integrations`](third-party-integrations/SKILL.md) | Provider isolation, timeouts/retries/breakers, error mapping, sandbox separation. |
| [`payments-subscriptions`](payments-subscriptions/SKILL.md) | Checkout, subscriptions, seats, proration, dunning, entitlements from verified provider events; no double charges. |
| [`email-notifications`](email-notifications/SKILL.md) | Transactional email: templates, async sends, deliverability, suppression, abuse-safe triggers. |

### Cross-Cutting Quality
| Skill | Description |
|-------|-------------|
| [`backend-security`](backend-security/SKILL.md) | Baseline hardening: secrets, headers, CORS, injection, request hygiene, audit logs; coordinates specialists. |
| [`backend-observability`](backend-observability/SKILL.md) | Structured correlated logs (PII-safe), metrics, health checks, symptom alerts. |
| [`backend-performance`](backend-performance/SKILL.md) | Measured bottlenecks: N+1, external calls, caching-with-invalidation, event loop, pools. |

### Testing & Delivery
| Skill | Description |
|-------|-------------|
| [`backend-unit-testing`](backend-unit-testing/SKILL.md) | Services/logic in isolation; edges + failure paths; fast, deterministic. |
| [`backend-integration-testing`](backend-integration-testing/SKILL.md) | Real HTTP + real DB; validation rejection; the authorization negative suite. |
| [`backend-deployment`](backend-deployment/SKILL.md) | Target, immutable artifacts, migration ordering, health-gated rollout, rollback; approval-gated. |

## Selection guidance (backend)

| Situation | Load (only these) |
|---|---|
| New backend | `backend-stack-selection` → `express-foundation`/`nestjs-foundation` → `backend-api-architecture` (+ `../database/database-selection`) |
| Existing backend | `existing-backend-audit` first, then the relevant feature skills |
| Designing endpoints | `rest-api-design` or `graphql-api-design` + `api-contracts` + `backend-validation` + `backend-error-handling` |
| Auth work | `backend-authentication` + `backend-authorization` (+ `role-permission-design` / `ownership-authorization` as the model demands) |
| Public/abused endpoints | `rate-limiting` + `captcha-abuse-prevention` (distinct from auth skills) |
| Uploads | `file-storage` + `backend-validation` + `ownership-authorization` |
| Async work | `background-jobs` → `queues` / `scheduled-jobs` |
| Live updates | `realtime-communication` |
| External services | `third-party-integrations` (+ `webhooks`, `email-notifications`) |
| Payments / subscriptions | `payments-subscriptions` (+ `webhooks`, `../database/transactions`) |
| Hardening | `backend-security` → `../security-review` |
| Diagnosing slowness | `backend-performance` (+ `../database/database-performance`) |
| Testing | `backend-unit-testing` / `backend-integration-testing` |
| Shipping | `backend-deployment` (+ `../release-planning`) |

## Dependency guidance (how backend skills relate)

- **Stack is decided first** (`backend-stack-selection`) → one foundation skill; `backend-api-architecture` shapes both.
- **API design** chains: `rest-api-design`/`graphql-api-design` → `api-contracts`; every endpoint passes `backend-validation` and maps errors via `backend-error-handling`.
- **Access control layers**: `backend-authentication` (identity) → `backend-authorization` (umbrella) → `role-permission-design` (action classes) + `ownership-authorization` (resource scope). Negative tests land in `backend-integration-testing`.
- **Abuse prevention** (`rate-limiting`, `captcha-abuse-prevention`) wraps public flows and is never an authorization substitute.
- **Async** chains: `background-jobs` (behavior) → `queues` (transport); `scheduled-jobs` triggers by time; all report through `backend-observability`.
- **Quality** feeds core reviews: `backend-security` → `../security-review`; `backend-performance` ↔ `../performance-review`; `backend-deployment` ↔ `../release-planning`.
- **Database concerns** delegate to the database pack (`../database/`): selection, schema, transactions, indexing, migrations.

## References

Backend reference material (examples, patterns — not permanent skill content) lives under:
`../../references/backend/express/`, `.../nestjs/`, `.../api/`, `.../auth/`, `.../abuse/`, `.../files/`, `.../jobs/`, `.../realtime/`, `.../integrations/`, `.../security/`, `.../observability/`, `.../performance/`, `.../testing/`, `.../deployment/` — populated as the project develops.

## Rule: do NOT load the whole pack

Loading every backend skill wastes context (`../../system/TOKEN_OPTIMIZATION_RULES.md`). Select the minimum relevant set via this index, load one stage at a time, and unload on task switch.
