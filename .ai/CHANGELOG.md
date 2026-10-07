# Changelog — AI Engineering System

All notable changes to **this system** (not to any application built with it) are documented here. This project adheres to [Semantic Versioning](https://semver.org/).

## [1.2.1] — 2026-10-07

Fix: project management reaches every workflow, and a bug on an untracked project has a path.

### Fixed

- A reported bug on a project with no approved plan was routed back through full planning: bugfix required project-management intake, and intake required Gate 4. Bugs are now recorded from day one (`BUG-NNN`, bug-log row) and fixed under the bugfix workflow; the week and fix-task steps apply once the project is tracked, and first-run tracking imports them.
- `project-management` no longer writes fixes itself — it hands the fix to the owning domain skill under the bugfix workflow and tracks it.
- Bug intake re-checks for a duplicate by root cause after diagnosis, not only by symptom.
- The bug prompts, bugfix checklist, and the skills index's bug row now include intake. `start-phase`, the feature checklist, and `.ai/README.md` point at the project's `CURRENT_STATUS.md` instead of the `PROGRESS.md` template.

### Added

- `PROJECT_MANAGEMENT_RULES.md` §Recording work: what each workflow records on a tracked project — review/audit findings (confirmed → bug intake, suggestions → `TECH-` backlog), refactor and migration steps, releases and deployments (`DEPLOY-`), incidents — plus the untracked-project path. `OPERATING_RULES` §10 makes it apply to any skill or plugin, including domain packs invoked directly.
- `code-review`, `security-review`, `release-planning`, `refactor-planning`, `migration-planning`, and the eleven remaining workflows each name what they record.

### Totals

- 178 skills · 13 agents · 13 hooks · 12 workflows · 31 templates · 19 prompts · 18 checklists.

## [1.2.0] — 2026-10-07

Additive: a project-management layer on top of the planning pipeline. No gate, rule, or structure removed; existing templates extended in place.

### Added — project management

- `.ai/system/PROJECT_MANAGEMENT_RULES.md` — the one vocabulary every skill uses for tracking: ID prefixes (`TASK`/`FEAT`/`TECH`/`DEPLOY`/`BUG`/`ADR`/`RISK`, never reused), ten task statuses, bug statuses, P0–P3 priority, XS–XL estimates (XL means split), dependency and weekly-scheduling rules, progress derived from verified completed estimate weight rather than asserted, `SCOPE CHANGE` handling, the code → tests → status → weeks → roadmap → logs order of truth, and append-only history.
- `skills/project-management` — runs after Gate 4: first-run setup, project/feature scheduling, bug intake (duplicate check → `BUG-NNN` → diagnosis via `bug-investigation` → priority → fix task → week → ledger, before any code change), scope changes, week planning and review, status questions, and weekly/meeting reports in business language.
- Templates: `ROADMAP.md`, `WEEK_PLAN.md`, `WEEKLY_REPORT.md`, `MEETING_NOTES.md`, `PROJECT_LOGS.md` (development log, bug ledger, scope change log).
- Request type **project tracking** (status, week planning/review, blockers, reports) — handled by the skill directly; adds no scope and re-runs no gates.

### Changed

- Tracking state lives in `.ai/projects/current/` (`PROJECT.md`, `ROADMAP.md`, `CURRENT_STATUS.md`, `DECISIONS.md`, `RISKS.md`, `phases/`, `weekly/`, `reports/`, `meetings/`, `logs/`); bugs stay work items as `work-items/bugs/BUG-NNN.md`. Not a separate `.AI/` tree: on case-insensitive filesystems it would be the same directory as `.ai/`, and on Linux a second one.
- `project-orchestrator` hands the approved plan to `project-management`, resumes from `CURRENT_STATUS.md`, and routes bugs, new work, and tracking requests through it. `ORCHESTRATION_WORKFLOW` gains a tracking-setup stage after Gate 4.
- `request-classification` (13 types), `task-planning`, `feature-planning`, `bug-investigation`, `workflows/bugfix`, `TASK_GENERATION_RULES`, `DOCUMENTATION_RULES`, and the `after-feature`/`after-phase` hooks use the shared IDs, statuses, and logs.
- `BUG`, `TASK`, `PROGRESS` (now `CURRENT_STATUS.md`), `PROJECT_BRIEF` (now also `PROJECT.md`), and `RISK_REGISTER` templates carry the shared fields. Bug severity is now P0–P3.

### Totals

- 178 skills · 13 agents · 13 hooks · 12 workflows · 31 templates · 19 prompts · 18 checklists.

## [1.1.0] — 2026-09-08

Additive: new rules, skills, and packaging around the 1.0.0 core. No breaking rule or structure changes.

### Added — behavior specification

- `.ai/system/GHERKIN_RULES.md` — the canonical **Gherkin contract** for every behavior this system specifies: one behavior per scenario, domain-level steps, strict Given/When/Then, observable outcomes, formatting and vocabulary rules, and the required-case set expressed one scenario at a time. Binding in every project; adopting a Cucumber-family runner stays a stack decision.
- `skills/testing/gherkin-specifications` — applying that contract: writing and reviewing scenarios, covering the required cases separately, and mapping each scenario to one named test.
- Wired through the flow: `TASK_GENERATION_RULES` (acceptance criteria *are* scenarios), `QUALITY_GATES` (Gates 4 and 5), `TESTING_SELECTION_RULES`, the testing pack index and its level/E2E skills, `web/playwright-e2e`, `mobile/mobile-maestro-e2e`, `testing-strategy`, `task-planning`, `feature-planning`, `bug-investigation`, the feature/bugfix/testing-audit workflows, `hooks/before-feature`, the FEATURE/TASK/BUG/TEST_PLAN templates, and the feature/bugfix/testing checklists.

### Added — skills

- `skills/application-documentation` — the product's `docs/` tree: a folder per app, an index per level, a file per screen/page/endpoint/job; with `templates/APP_DOC.md`.
- `skills/auth-form-validation` — the credential input contract for login/signup/reset: one schema through the RHF resolver, re-enforced server-side, enumeration-safe copy.

### Added — distribution

- `bin/cli.js` — zero-dependency installer (`npx github:ahtishamshahzad/agent_dev_flow init`), copying `.ai/`, `AGENTS.md`, the usage guides, and the selected editor adapters. Installs nothing, selects no stack, creates no repository.
- `scripts/validate.js` + `.github/workflows/validate.yml` — repo consistency checks and an installer smoke test in CI: manifest/version sync, skill frontmatter, plugin symlinks, **every count claimed in prose** (totals and per-pack, across `README.md`, `USAGE.md`, `.ai/README.md`, `.ai/skills/README.md`, `plugins/README.md`, `marketplace.json`), **CHANGELOG newest entry vs `VERSION` and its totals**, installer bundle completeness, and relative-link resolution. A claim that stops matching its pattern fails too — a check that silently stops checking is worse than no check.
- `plugins/` + `.claude-plugin/marketplace.json` — the eight skill packs as installable Claude Code plugins, each `skills/` a symlink to `.ai/skills/`, so there is still one source of truth.
- `USAGE.md` (what to type, per editor), root `README.md`, `LICENSE` (MIT), and the `references/` topic folders the skills point at.

### Changed

- Skill counts corrected across `README.md`, `USAGE.md`, `.ai/README.md`, `.ai/skills/README.md`, `plugins/README.md`, and `marketplace.json` — several still claimed 174 after skills were added. The validator now covers the ones it can check.
- Build-phase language dropped from the system docs; repository references renamed to `agent_dev_flow`.

### Totals

- 177 skills · 13 agents · 13 hooks · 12 workflows · 26 templates · 19 prompts · 18 checklists.

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
