# Changelog — AI Engineering System

All notable changes to **this system** (not to any application built with it) are documented here. This project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-07-17

First complete release: the full tool-neutral operating system for planning and building software with AI agents. Governance and documentation only — no application code, no dependencies, no selected stack, no repository creation.

### Foundation (Phase 1)

- Canonical `.ai/` directory as the single source of truth; `README.md`, `VERSION`, `CHANGELOG.md`.
- Core system rules in `.ai/system/`: `OPERATING_RULES`, `ORCHESTRATION_WORKFLOW`, `APPLICATION_SELECTION_RULES`, `STACK_DECISION_RULES`, `SKILL_SELECTION_RULES`, `PHASE_GENERATION_RULES`, `TASK_GENERATION_RULES`, `CONTEXT_MANAGEMENT_RULES`, `TOKEN_OPTIMIZATION_RULES`, `MULTI_AGENT_RULES`, `HOOK_RULES`, `QUALITY_GATES`, `DOCUMENTATION_RULES`, `TESTING_SELECTION_RULES`, `SECURITY_RULES`, `GIT_WORKFLOW_RULES`.
- MCP/tool governance in `.ai/mcp/`: `TOOL_SELECTION`, `PERMISSION_RULES`, `RECOMMENDED_SERVERS`.
- Thin editor adapters: `AGENTS.md` (general entry), `CLAUDE.md`, `.cursor/rules/project.mdc`, `.windsurf/rules/project.md`, `.github/copilot-instructions.md`. Antigravity documented to read `AGENTS.md`.

### Core skills (Phase 2)

- 25 core reusable skills in `.ai/skills/`: orchestration, intake/planning, selection/architecture, work-item planning, review/quality, testing/documentation, delivery/ops, and audits — each in the standard section format, indexed.

### Mobile pack (Phase 3)

- 36 mobile skills (`.ai/skills/mobile/`): Expo vs RN CLI, foundations, navigation, design system/theme/fonts/icons, state, API, auth/authorization, secure storage, native capabilities, accessibility, performance, error handling/logging, unit/component/Maestro testing, builds/release, iOS/Android readiness.
- Mobile reference topic folders under `.ai/references/mobile/`.

### Web & dashboard pack (Phase 4)

- 26 web skills (`.ai/skills/web/`): Next.js vs Vite selection, foundations, existing-app audit, routing, design system/theme, state (local/form/shared/server/URL/persisted), API integration, forms, authentication, authorization, dashboard architecture/permissions/tables/reporting/bulk-operations, SEO, accessibility, performance, error handling, unit/component/Playwright testing, deployment.
- Web reference topic folders under `.ai/references/web/`.

### Backend & database packs (Phase 5)

- 30 backend skills (`.ai/skills/backend/`): Express vs NestJS (no universal default), API architecture, REST/GraphQL, contracts, validation, error handling, authentication, layered authorization (role/permission/ownership/tenant/object-level with negative tests), rate limiting & CAPTCHA abuse prevention, file storage, jobs/queues/scheduling, realtime, webhooks, integrations, email, security, observability, performance, unit/integration testing, deployment.
- 15 database skills (`.ai/skills/database/`): separate database and data-layer selection, relational/document schema design, Prisma/Drizzle/Mongoose, migrations, seed data, indexing, transactions, concurrency, security, performance, backup/recovery, data migration.

### Testing, DevOps & security packs (Phase 6)

- 14 testing skills (`.ai/skills/testing/`): tool selection (Playwright/Maestro/Supertest/Testing Library/Jest/Vitest), unit/integration/API/contract, E2E, regression/smoke/visual, test data/environment management, flaky-test and risk-based coverage audits.
- 16 devops skills (`.ai/skills/devops/`): repository strategy, monorepo tooling, Docker, environment/secrets management, CI/CD generated from selected applications, GitHub Actions, deployment selection, staging, production readiness, monitoring/logging, rollback and incident readiness.
- 12 security skills (`.ai/skills/security/`): threat modeling; authentication/authorization security; API/web/mobile/database security; secrets and dependency audits; abuse prevention; privacy review; security regression testing — review lens, never claims "secure."

### Agents, hooks & workflows (Phase 7)

- 13 agent roles (`.ai/agents/`) with explicit file ownership and handoff rules, plus `multi-agent-execution.md` documenting single/sequential/parallel modes and the disjoint-ownership rule that prevents silent conflicts.
- 13 tool-neutral hooks (`.ai/hooks/`): before-discovery/architecture/feature/bugfix/refactor/migration/commit/pr/release and after-feature/phase/pr/release — each with trigger, checks, failure conditions, output, and stop conditions.
- 12 workflows (`.ai/workflows/`) keyed to request type, each with classification, skills, agents, context, gates, documents, validation, handoff, and a stop condition.

### Templates, prompts, checklists & references (Phase 8)

- 25 fill-in templates (`.ai/templates/`), 19 tool-neutral prompt starters (`.ai/prompts/`), and 18 verifiable gate/hook checklists (`.ai/checklists/`).
- Reference structure (`.ai/references/`) with product, designs, mobile/*, web/*, backend/*, testing/*, deployment topic folders; every terminal folder documents what belongs there, file types, naming, agent usage, and that references are not requirements.

### Knowledge & memory (Phase 9)

- Knowledge system (`.ai/knowledge/`): root + 10 area indexes with a mandatory trust taxonomy (verified-current / project-convention / opinion / deprecated / unverified) and metadata (source, verification date, affected versions, deprecation status) for change-prone knowledge; update and deprecation processes; not a tutorial dump.
- Memory (`.ai/memory/`): index + PROJECT_HISTORY, ARCHITECTURE_HISTORY, COMMON_MISTAKES, REUSABLE_DECISIONS, TOOLING_LESSONS, RETROSPECTIVES, with strict update rules (reusable/validated/recurring/future-value/broadly-applicable), the project-vs-global split, and a no-secrets/no-PII constraint.

### Setup & usage (Phase 10)

- Expanded `.ai/README.md` into a complete 23-section usage guide (overview, editors, architecture, directory guide, all workflows, multi-agent, token efficiency, hooks, MCP, references, knowledge, memory, git/GitHub, phase execution, release, extending, versioning, troubleshooting).
- `QUICK_START.md` (copy-paste starters) and `INSTALLATION.md` (template-copy vs submodule/subtree/source, with trade-offs; package installation optional, not mandatory).

### Totals

- 174 skills · 13 agents · 13 hooks · 12 workflows · 25 templates · 19 prompts · 18 checklists.

### Scope (system-wide)

- No application code, no dependencies installed, no technology stack selected, no GitHub repository created for any application.
- No mobile/web/dashboard/backend/database application initialized. The system plans and governs; applications are built per project under its approval gates.
