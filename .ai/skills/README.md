# `.ai/skills/` — Reusable Capability Modules (Index)

Skills are focused, reusable instruction modules for specific kinds of work. Agents discover them **through this index**, then load only the relevant ones (`../system/SKILL_SELECTION_RULES.md`). **Do not load all skills** — see the rule at the bottom.

## How selection works

1. Match the active task / request-type against the index below.
2. Load the **minimum set** (prefer 1–3).
3. Record which skills were loaded and why (in the work item / `../projects/current/`).
4. Unload when moving to unrelated work.

Most work starts at **`project-orchestrator`**, which then loads the right specialist one stage at a time.

## Categories

### Orchestration
| Skill | Description |
|-------|-------------|
| [`project-orchestrator`](project-orchestrator/SKILL.md) | Lead skill; drives the request→approval pipeline and coordinates specialists. Plans and delegates; does not implement every domain. |

### Intake & Planning
| Skill | Description |
|-------|-------------|
| [`request-classification`](request-classification/SKILL.md) | Classify the request into one of the 12 types; selects workflow + gates. |
| [`requirements-analysis`](requirements-analysis/SKILL.md) | Extract requirements + success criteria; separate confirmed / assumptions / questions. |
| [`existing-project-audit`](existing-project-audit/SKILL.md) | Inventory an existing repo (structure, stack, apps, tests, security, state) before changing it. |

### Selection & Architecture
| Skill | Description |
|-------|-------------|
| [`application-selection`](application-selection/SKILL.md) | Decide which applications the project needs; nothing auto-scaffolded. |
| [`stack-recommendation`](stack-recommendation/SKILL.md) | Recommend a stack per area with alternatives; pair DB+data-layer correctly. Requires approval. |
| [`architecture-design`](architecture-design/SKILL.md) | Define boundaries, data flow, integrations, cross-cutting concerns. |
| [`repository-architecture`](repository-architecture/SKILL.md) | Define the on-disk repo layout (single-app vs monorepo, shared code). |

### Work-Item Planning
| Skill | Description |
|-------|-------------|
| [`task-planning`](task-planning/SKILL.md) | Generate dynamic phases + tasks with acceptance criteria (Gate 4). |
| [`feature-planning`](feature-planning/SKILL.md) | Plan a feature within architecture, without scope creep. |
| [`bug-investigation`](bug-investigation/SKILL.md) | Audit → reproduce → root cause → minimal fix → regression test → validate. |
| [`refactor-planning`](refactor-planning/SKILL.md) | Behavior-preserving, test-backed, small reversible steps. |
| [`migration-planning`](migration-planning/SKILL.md) | Incremental, reversible state change with rollback + cutover. |

### Review & Quality
| Skill | Description |
|-------|-------------|
| [`code-review`](code-review/SKILL.md) | Correctness, clarity, conventions; findings by severity. |
| [`security-review`](security-review/SKILL.md) | Security assessment; Confirmed vs Potential; never prints secrets; never claims "secure." |
| [`performance-review`](performance-review/SKILL.md) | Measured bottleneck → safe fix → validate in a representative build. |
| [`ai-output-review`](ai-output-review/SKILL.md) | Review AI output for 11 failure modes (invented facts, false completion, scope creep, etc.). |
| [`final-quality-audit`](final-quality-audit/SKILL.md) | Aggregate reviews into one go/no-go before release. |

### Testing & Documentation
| Skill | Description |
|-------|-------------|
| [`testing-strategy`](testing-strategy/SKILL.md) | Choose levels + tools per risk/app; regression test every bug fix. |
| [`documentation`](documentation/SKILL.md) | Write canonically and concisely; keep adapters thin; archive stale reports. |

### Delivery & Ops
| Skill | Description |
|-------|-------------|
| [`git-workflow`](git-workflow/SKILL.md) | Branch/commit/PR safely; never commit/push unasked; secrets out of history. |
| [`github-repository`](github-repository/SKILL.md) | GitHub ops (create/visibility/PRs); creation requires explicit approval. |
| [`release-planning`](release-planning/SKILL.md) | Validate release readiness (Gate 7); publish/deploy needs approval. |

### Audits
| Skill | Description |
|-------|-------------|
| [`dependency-audit`](dependency-audit/SKILL.md) | Inventory deps; advisories, unused/duplicate/abandoned, license/maintenance risk. |
| [`environment-audit`](environment-audit/SKILL.md) | Env-var validation, secret handling, prod debug, environment parity. |

## Domain skill packs

Domain-specific skills live in subfolders and have their own index. Load a pack's skills only when working in that domain (and only the relevant ones).

| Pack | Index | Covers |
|------|-------|--------|
| **Mobile** (36 skills) | [`mobile/README.md`](mobile/README.md) | Expo vs React Native CLI, foundations, navigation, design system/theme/fonts/icons, state (local/form/shared/server/persisted/navigation), API, auth/authorization, secure storage, notifications, deep linking, media/uploads, location/maps, background tasks, native modules, accessibility, performance, error handling/logging, unit/component/Maestro testing, builds/release, iOS/Android readiness. |
| **Web & Dashboard** (26 skills) | [`web/README.md`](web/README.md) | Next.js vs Vite selection, foundations, existing-app audit, routing, design system/theme, state (local/form/shared/server/URL/persisted), API, forms, auth/authorization, dashboard architecture/permissions/tables/reporting/bulk operations, SEO, accessibility, performance, error handling, unit/component/Playwright testing, deployment. |
| **Backend** (30 skills) | [`backend/README.md`](backend/README.md) | Express vs NestJS (no universal default), foundations, API architecture, REST/GraphQL design, contracts, validation, error handling, authentication, authorization (role/permission/ownership/tenant/object-level + negative tests), rate limiting & CAPTCHA abuse prevention, file storage, background jobs/queues/scheduled jobs, realtime, webhooks, integrations, email, security, observability, performance, unit/integration testing, deployment. |
| **Database** (15 skills) | [`database/README.md`](database/README.md) | Database vs data-layer selection (PostgreSQL/MySQL/MongoDB × Prisma/Drizzle/Mongoose/native), relational & document schema design, migrations, seed data, indexing, transactions, concurrency, security, performance, backup/recovery, data migration. |
| **Testing** (14 skills) | [`testing/README.md`](testing/README.md) | Test-type/tool selection (Playwright web E2E, Maestro mobile E2E/smoke, Supertest API, Testing Library, Jest/Vitest), unit/integration/API/contract testing, E2E, regression/smoke/visual, test data & environment management, flaky-test and risk-based coverage audits. Required cases: happy/invalid/error/authorization-denial/regression/env-validation; no coverage-chasing. |
| **DevOps** (16 skills) | [`devops/README.md`](devops/README.md) | Repository strategy, monorepo tooling (pnpm/npm workspaces, Turborepo), Docker, environment & secrets management, CI/CD generated from selected apps (+ GitHub Actions), deployment selection, staging, production readiness, monitoring/logging, rollback and incident readiness. No infra scaffolding. |
| **Security** (12 skills) | [`security/README.md`](security/README.md) | Threat modeling; authentication/authorization security (IDOR/BOLA, escalation); API/web/mobile/database security; secrets & dependency (supply-chain) audits; abuse prevention; privacy review; security regression testing. Review lens: Confirmed vs Potential, never prints secrets, never claims "secure." |

Pack skills coordinate with the core skills (e.g. `mobile-performance`/`web-performance` ↔ `performance-review`, `backend-security` ↔ `security-review`, `database-selection` ↔ `stack-recommendation`, `testing-selection` refines `testing-strategy`, `web-deployment` ↔ `release-planning`, security-pack skills are the review lens on the backend/database build skills) and with each other (web/mobile ↔ backend API contracts; backend ↔ database ↔ devops ↔ testing ↔ security) — see each skill's Related Skills. Whether a project needs a public web presence, marketing site, customer web app, or admin dashboard is decided **separately per application** (`application-selection`, `../system/APPLICATION_SELECTION_RULES.md`).

## Selection guidance (by request type)

| Request type | Typical skills (load only these) |
|---|---|
| new project | orchestrator → classification → requirements → application-selection → stack-recommendation → architecture-design → repository-architecture → task-planning → testing-strategy → security-review → git-workflow/github-repository |
| existing enhancement | orchestrator → existing-project-audit → requirements → (feature/refactor/migration)-planning → task-planning → testing-strategy → review skills |
| feature | feature-planning → task-planning → testing-strategy → code-review (+ security-review if sensitive) |
| bug | bug-investigation → testing-strategy → code-review (+ security-review if relevant) |
| refactor | refactor-planning → testing-strategy → code-review → performance-review (if perf-driven) |
| migration | migration-planning → dependency-audit → environment-audit → testing-strategy → release-planning |
| architecture review | existing-project-audit → architecture-design (assessment) → ai-output-review |
| code review | code-review (+ ai-output-review, + security/perf as needed) |
| security audit | security-review → dependency-audit → environment-audit |
| testing audit | testing-strategy → existing-project-audit |
| deployment | release-planning → environment-audit → github-repository |
| release | release-planning → final-quality-audit → git-workflow |
| **mobile project** | mobile-stack-selection → expo/react-native-cli-foundation → mobile-navigation → mobile-design-system → mobile-state-management/server-state → (feature skills as needed) → mobile-unit/component-testing (+ mobile-maestro-e2e for critical flows) → mobile-builds → ios/android-readiness → mobile-release. See [`mobile/README.md`](mobile/README.md). |
| **web project** | application-selection (public web / marketing / customer app / dashboard — each separately) → dashboard-architecture (if dashboard) → web-stack-selection → nextjs/vite-react-foundation → web-routing → web-design-system → web-state-management/server-state → (feature + dashboard skills as needed) → web-unit/component-testing (+ playwright-e2e for critical journeys) → web-deployment. See [`web/README.md`](web/README.md). |
| **backend project** | backend-stack-selection → express/nestjs-foundation → backend-api-architecture → rest/graphql-api-design + api-contracts → backend-validation + backend-error-handling → backend-authentication + backend-authorization (+ role-permission/ownership) → rate-limiting/captcha on public flows → (feature skills as needed) → backend-unit/integration-testing → backend-security → backend-deployment. See [`backend/README.md`](backend/README.md). |
| **database work** | database-selection → relational/document-schema-design → prisma/drizzle/mongoose skill → database-migrations (+ seed-data, indexing) → transactions/concurrency where invariants demand → database-security + backup-recovery before release. See [`database/README.md`](database/README.md). |
| **testing** | testing-selection → per-level skills the apps need (unit/integration/api-integration/contract) → playwright/maestro for critical E2E → regression-testing per bug → smoke pre/post-deploy; test-data/environment-management underneath; flaky-test-audit + test-coverage-audit (risk-based). See [`testing/README.md`](testing/README.md). |
| **devops / CI-CD** | repository-strategy → monorepo-selection (→ turborepo/pnpm/npm foundations) → docker/environment/secrets-management → ci-cd (jobs from selected apps only) → github-actions → deployment-selection → staging-environment → production-readiness; monitoring-logging + rollback-planning + incident-readiness for ops. See [`devops/README.md`](devops/README.md). |
| **security audit (deep)** | threat-modeling → routed specialists (authentication/authorization-security, api/web/mobile/database-security, secrets-audit, dependency-security, abuse-prevention, privacy-review) → security-regression-testing; aggregates into security-review + final-quality-audit. See [`security/README.md`](security/README.md). |

## Dependency guidance (how skills relate)

- **`project-orchestrator`** loads the others **one stage at a time** and unloads them after.
- **Planning skills** (`feature/bug/refactor/migration-planning`) delegate phase/task mechanics to **`task-planning`**.
- **Review skills** route depth to specialists: `code-review` → `security-review` / `performance-review`; everything → `ai-output-review`; all reviews aggregate into **`final-quality-audit`**.
- **Audit skills** (`existing-project-audit`, `dependency-audit`, `environment-audit`) feed selection, migration, and review.
- **Delivery skills** chain: `git-workflow` → `github-repository` → `release-planning`.
- **Domain packs** decide their stack first (mobile runtime / backend framework / database + data layer / repo shape), then load foundations, then feature skills; their quality skills feed the core review skills.
- **Testing** selects tools per app (`testing-selection`), and its selection drives **DevOps CI generation** (`ci-cd` builds jobs only for applications that exist); **Security** skills are the review lens on the build packs and route every finding into `security-regression-testing`, CI-gated via `ci-cd`.
- **DevOps delivery** chains `deployment-selection` → `staging-environment` → `production-readiness`, aligning with core `release-planning`/`git-workflow`/`github-repository`; **security + testing + readiness** aggregate into `final-quality-audit` before release.

Each skill's own **Related Skills** and **Context Loading Guidance** sections state exactly what it may load and when it should stop.

## Rule: do NOT load all skills

Loading every skill for every task wastes context and degrades focus (`../system/TOKEN_OPTIMIZATION_RULES.md`). Select the **minimum relevant set** (usually 1–3) via this index, load specialists one stage at a time, unload on task switch, and never scan the whole `skills/` tree. If no skill fits, proceed with best practice and propose a new skill (under approval) — do not load unrelated skills "to be safe."

## Conventions for a skill

- One skill = one capability, instructional (no long code dumps — examples live in `../references/` or `../templates/`).
- Uses the standard section format (Purpose … Token Efficiency Guidance).
- States what context it requires, what it does not, what it may load, and when to stop.
- Registered as a row in this index.
