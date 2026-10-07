# 4 — Stack decision (Gate 2)

> **Status: APPROVED (simulated).** Fictional example. Stage: `stack-recommendation` with `mobile-stack-selection`, `web-stack-selection`, `backend-stack-selection`, `database-selection`. Recommendations reflect this example's requirements, not a default.

| Area | Recommended | Alternative considered | Why this one, here |
|---|---|---|---|
| Mobile | **Expo (React Native), development builds** | React Native CLI | Camera, file system, and SQLite are covered by Expo modules; EAS builds avoid maintaining native toolchains. Revisit if a native SDK without a config plugin is needed. |
| Mobile offline store | **SQLite (expo-sqlite) + an outbox queue** | Persisted query cache only | N2 needs a durable queue of changes and photos that survives restarts — a cache isn't one. |
| Web dashboard | **Next.js** | Vite + React | Authenticated dashboard, server-side PDF preview routes; either works — chosen for routing and server rendering of report pages. |
| Backend API | **NestJS** | Express | Modules, guards, and DI give one obvious place for tenant and role checks across ~40 endpoints. |
| Database + data layer | **PostgreSQL + Prisma** | PostgreSQL + Drizzle | Relational data with strong constraints; Prisma's migrations and types suit a small team. Row-level security as a second line (05). |
| Worker / queue | **BullMQ on Redis** | Postgres-backed queue | PDF and image jobs need retries and concurrency control. |
| File storage | **S3-compatible bucket, private, signed URLs** | Database blobs | 200 photos per inspection (N3); never public (N5). |
| Billing | **Stripe Billing (per-seat subscriptions)** via `third-party-integrations` + `webhooks` | Manual invoicing | User confirmed self-serve card billing. |
| Testing | Jest + Testing Library (web, mobile), Supertest (API), Playwright (web E2E), Maestro (mobile E2E) | — | From `testing-selection`; see 07. |
| Repo | **pnpm workspaces monorepo** | Separate repos | Shared types and schemas (03); one CI. |

Database and data layer are chosen as a **pair** (PostgreSQL + Prisma) — the alternatives differ in the data layer, not by comparing a database against an ORM.

**Gate 2 — applications + stack:** approved (simulated). Recorded as ADR-001 (stack) and ADR-002 (offline outbox).
