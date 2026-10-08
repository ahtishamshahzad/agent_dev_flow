# Changelog — AI Engineering System

All notable changes to **this system** (not to any application built with it) are documented here. This project adheres to [Semantic Versioning](https://semver.org/).

## [1.8.0] — 2026-10-08

Context engineering: the minimum sufficient context, expanded only on evidence — as an operational part of the workflow, with tooling and measurement. No new rule file: `CONTEXT_MANAGEMENT_RULES.md` became the full policy.

### Changed

- `CONTEXT_MANAGEMENT_RULES.md` is now the context-engineering policy: the principle (*context is an engineering resource — retrieve the minimum sufficient context, expand only when evidence requires it, never trade correctness for token savings*), a priority order with token efficiency last, layers 0–5, escalation levels 1–5 with valid and invalid triggers, stepwise file retrieval (1 → 3 → 8 → module), a "why do I need this?" relevance check with explanations, Gherkin as the primary anchor, adaptive semantic budgets, deduplication and safe compression, stable project summaries with staleness checks, insufficient-context handling (retrieve or ask, never guess), multi-agent isolation, and what is measured. `TOKEN_OPTIMIZATION_RULES` links to it; the principle is in `OPERATING_RULES` §6.
- The workflow assembles minimum sufficient context right after classification; `project-orchestrator`, multi-agent execution (shared baseline + per-agent context pack; refresh on contract change), and the multi-agent checklist apply it. `.ai/projects/current/context/` holds stable summaries.

### Added

- `skills/context-engineering` (core, 181 skills); templates `CONTEXT_PACK.md` (required / optional / excluded with reasons, escalations, shared contracts, ownership) and `PROJECT_CONTEXT.md` (a stable summary with `sources:` and a fingerprint).
- `agentflow context suggest "<task>"` (`lib/context.js`) — deterministic: matching scenarios, skills from the intent index, files (path and content matches), their tests, and direct imports, each with the reason; no embeddings or index to maintain. `agentflow context check [--update]` — fingerprints each summary's sources and reports stale summaries (exit 1).
- `docs/context-engineering.md` and six examples in `examples/context-engineering/`.
- Evals: the runner records tool calls, files read, repeated reads, and — for cases listing their relevant files — retrieval efficiency and recall; `summarize.js` reports tokens (uncached + cache writes + cache reads), tool calls, and files read per arm, "unknown" where not exposed. New case `context-efficiency` on a 27-file fixture (`node-shop`); new workflow check `insufficient-context`.
- Validator: the policy's sections, skill, templates, docs, examples, and wiring; **token-savings percentages must cite `evals/results/`**; `docs/` links are now checked too. 5 new tests.

### Fixed

- A blank line split the workflow-checks table in `evals/workflow-checks/README.md`.

### Totals

- 181 skills · 13 agents · 13 hooks · 12 workflows · 34 templates · 19 prompts · 18 checklists.

## [1.7.0] — 2026-10-08

### Changed

- **Provisional proposal with blocking questions** (`ORCHESTRATION_WORKFLOW` §4, `project-orchestrator`, the new-project prompt): on a new project, the reply that asks blocking questions (about five at most) also gives a clearly labelled provisional applications + stack proposal under the stated assumptions, with how each answer would change it. Gate 2 still waits for the answers and the behavior scenarios. Addresses the planning weakness the blind evaluation found (AgentFlow failed "asks to approve applications and stack" in every run); re-measured in `evals/results/`.

### Added

- Sonnet 5.5 evaluation brought to 3 runs per arm, judged blind.
- Maintainer steps for publishing to npm in `CONTRIBUTING.md` (not published — awaiting a decision).

### Totals

- 180 skills · 13 agents · 13 hooks · 12 workflows · 32 templates · 19 prompts · 18 checklists.

## [1.6.0] — 2026-10-08

Closes the gaps reported after 1.5.0: an automated drift report, machine-checked scenario→test mapping, blind evaluation at a larger sample on two models, live checks with web access and real upgrade triggers, and two behavior fixes the evaluations exposed.

### Added

- `agentflow drift [dir]` (`lib/drift.js`) — installed versions from the lock file, latest **stable** from the registry (a pre-release `latest` tag is skipped), advisories that cover the installed version (checked against each advisory's range, not trusted from the server), deprecations, and Node.js end-of-life from the official schedule. Reports **available vs recommended**, with the **smallest safe version** per advisory (a patch within the same major when one exists). `--json`, `--prod`, `--fail-on security|eol|any` for CI.
- `agentflow gherkin trace [features] --tests <dirs>` (`lib/gherkin-trace.js`) — test names contain their scenario's title; lists scenarios no test names and exits 1 for an untested `@critical` one.
- `evals/score.js` — blind judging by a separate model with arm-identifying text masked; `evals/summarize.js` — per-case, per-arm pass rates with run-to-run spread. Both runners stop on a usage limit instead of recording it, and `--resume` continues.
- Workflow checks with web and `npm view` access (`new-project-versions-web`) and a legacy fixture with real triggers (`existing-project-triggers`: Node 16, `jsonwebtoken` 8.5.1); per-check `tools` and `fixture` files.
- 7 tests for drift (against a local fake registry — no network in CI) and trace.

### Changed

- **Search before claiming absence** (`OPERATING_RULES` §8): never state that code, tests, or usages don't exist without having searched; say what was searched.
- **Security findings are escalated, never footnoted** (`OPERATING_RULES` §9): a vulnerability surfaced by any task is opened as its own P0/P1 bug, first in the reply, verified or labelled unverified, with the smallest safe fix. Found by the `existing-project-triggers` check: agents listed the `jsonwebtoken` advisories as a note. A fix in the audit skill alone had no measurable effect; the operating-rule fix did (see `evals/results/`).
- `existing-project-audit`, the existing-project workflow, and `TECHNOLOGY_GOVERNANCE_RULES` §4 require immediate escalation; dependency audit, technology governance, the Gherkin skill, and the before-release hook use `drift` and `gherkin trace`.

### Totals

- 180 skills · 13 agents · 13 hooks · 12 workflows · 32 templates · 19 prompts · 18 checklists.

## [1.5.0] — 2026-10-07

Technology governance: context-aware version and documentation decisions instead of "always the latest". Additive.

### Added

- `.ai/system/TECHNOLOGY_GOVERNANCE_RULES.md` — decide **new vs existing** first. **New projects:** latest *stable* (no alpha/beta/RC/canary; current LTS for runtimes), verified against registries and official release pages at decision time — **not model memory** — with version-matched official documentation and a compatibility check across the chain; anything unverifiable is labelled. **Existing projects:** the installed stack (from lock files) is a constraint; a newer version existing is not a reason to upgrade; drift is reported as *available* vs *recommended*. Upgrades need a trigger — a vulnerability (escalated through bug intake; security outranks stability), end of life, a required feature, a compatibility requirement, deprecation, a measured problem — plus breaking changes, migration work, regression scenarios, urgency, and scope. Bug fixes and refactors keep the technology unless it is the cause or the goal. Framework-specific official guidance wins over general rules.
- `skills/technology-governance` (core) and `templates/TECHNOLOGY_DECISION.md` (new-project baseline, or an existing project's add/upgrade/replace decision); the stack-recommendation template gains a version baseline.
- `examples/technology-governance/` — new project, existing project keeping a supported version, and an upgrade justified by end of life and a vulnerability.
- A documentation-lookup entry in `mcp/RECOMMENDED_SERVERS.md` (disabled by default), with the registry CLI as the manual fallback.
- Two workflow checks — keeping an existing stack, and versions for a new project with no web access — run and scored in `evals/results/`.

### Changed

- Wired through the workflow (audit records the technology baseline; the stack stage governs versions), Gate 1 (baseline recorded) and Gate 2 (version baseline verified; upgrades name their trigger), operating rules (§4 and "verified, not remembered" in §8), stack rules, the orchestrator, stack recommendation, existing-project audit, dependency audit (available vs recommended), migration planning, bug investigation, refactor and feature planning, both project workflows and prompts, all five adapters (one line each), the intent index, and the README.
- Validator: requires the rules' sections, skill, template, and examples, and their references from the workflow, gates, key skills, and adapters; **fails on absolute version rules** ("always use the latest", "always/never upgrade") unless quoted to reject them.

### Totals

- 180 skills · 13 agents · 13 hooks · 12 workflows · 32 templates · 19 prompts · 18 checklists.

## [1.4.0] — 2026-10-07

Gherkin becomes the mandatory behavioral contract across the lifecycle — specified before design, approved at Gate 2, verified at Gates 5 and 7, kept as regression coverage. Additive; the gates are the same seven, and there are still two approval stops.

### Changed — behavior first

- `GHERKIN_RULES.md` gains a **mandatory policy**: every behavior-changing task has approved scenarios before implementation; exceptions only for changes with no observable effect (formatting, renames, proven zero-change refactors); **when unsure, specify**. It states plainly that Gherkin says what the system must do and tests are the evidence — a scenario proves nothing until its test passes.
- New **behavior specification** stage after requirements and audit, before application selection and architecture (`ORCHESTRATION_WORKFLOW`, `OPERATING_RULES` §2, `project-orchestrator`).
- **Gate 2 is now "behavior + applications + stack"** and fires for every behavior change — a feature on an existing app approves its scenarios there even with no app or stack change. Gate 4 tasks name the scenarios they deliver; Gate 5 needs every scenario's test passing and a regression scenario per fixed bug; Gate 7 needs every `@critical` scenario verified.
- Scenarios now have a **permanent home**, `features/<area>/<behavior>.feature`, whether or not a Cucumber runner is used — work items reference them instead of holding the only copy, so regression coverage outlives the bug.
- **Scope control by scenario**: behavior no approved scenario covers stops for classification; parallel agents share the approved scenarios as their behavioral contract and stop to propose changes rather than reinterpret.
- **Debugging flow** in `workflows/bugfix.md`: find existing scenarios → expected vs actual → regression scenario that fails today → root cause → fix → it passes → stays, tagged `@regression @bug-NNN`.
- Wired through requirements (acceptance criteria are or map to scenarios), architecture (designed from scenarios), feature/task/bug planning, security review (security behavior as scenarios, never a "secure" verdict), release planning, refactor planning, the new-project/existing-project/new-feature workflows, the before-architecture/before-bugfix/before-release hooks, prompts, templates, and all five editor adapters (one line each — the policy stays in `.ai/`).
- `gherkin-specifications` skill: the behavior-change decision, find-existing-first, an edge-case list, tags, and guidance for API, UI/mobile, security, integrations, and AI features (probabilistic — verified by repeated runs, never claimed deterministic).
- README: a behavior-driven development section; the diagram now shows the behavior stage, and its gate labels match the system's (Gate 2, Gate 4 — they read "Gate 1/2" in 1.3.0).

### Added

- `agentflow gherkin validate [path ...]` — zero-dependency linter (`lib/gherkin-lint.js`) for the contract's MUST rules: one titled Feature per file, named and unique scenarios, strict Given → When → Then, no repeated phase or `Or`, no blank lines between steps, 2-space indentation, Background rules, Scenario Outline Examples and placeholders, `@kebab-case` tags and file names. SHOULD rules are warnings. It checks structure, not whether the behavior is right.
- `examples/gherkin/` — seven specifications: a feature, a bug regression, an API with a `Scenario Outline`, password reset, mobile offline sync, a subscription upgrade, and an AI assistant.
- `skills/backend/payments-subscriptions` — checkout, subscriptions, seats, proration, dunning, and entitlements driven by verified, idempotent provider events.
- Tag standard (`@critical` is release-blocking) and change-detection rules.
- `evals/run.js` — runs eval cases against Claude Code headless, both arms, in fresh temp projects with user settings excluded and read-only tools, saving every transcript with turns, tokens, cost, and time. Each case gains a `prompt.md` and optional per-arm setup; `evals/workflow-checks/` adds five lifecycle checks (new feature, bug, API change, security change, pure refactor) against a small fixture API with planted gaps.
- The first recorded runs: the five workflow checks and a six-case pilot (one run per arm) — transcripts in `evals/results/raw/`, scored in `evals/results/`. A pilot, not a benchmark.
- Validator: lints every `.feature` in the repo; requires the mandatory policy and its reference from the workflow, gates, key skills, workflows, and all adapters; **fails on any wording that makes the specification non-mandatory**; checks the CLI's runtime modules ship. 29 new tests for the linter and command; the tarball test runs `gherkin validate` from the packed package.

### Totals

- 179 skills · 13 agents · 13 hooks · 12 workflows · 31 templates · 19 prompts · 18 checklists.

## [1.3.0] — 2026-10-07

Tooling, tests, and CI for the installer and the repository. No rule or skill removed.

### Changed

- `agentflow init --force` no longer overwrites project data: files inside `.ai/projects/`, `work-items/`, `references/`, `knowledge/`, and `memory/` are kept (missing ones are still added). Previously an update with `--force` replaced the project's own state and indexes.
- Installer errors go to stderr; exit codes unchanged.
- Node support is now `>=18` (Node 16 is end-of-life and was never tested). CI runs on Node 18, 20, and 22.

### Added

- `npm test` — zero-dependency `node:test` suites: every CLI option and editor, invalid input and exit codes, existing files, `--force` protection, nested and space-containing paths, a missing bundled file, early-closed pipes, and an install from the **packed tarball** (`npm pack` → unpack → `init`).
- Validator: the installer's file list is read from `bin/cli.js` and must be shipped by `package.json` `files`; the CI Node matrix must start at `engines.node`; the per-pack context-cost figures in `USAGE.md` and `plugins/README.md` are recomputed from the skill descriptions.

- `skills/SKILLS_INDEX.md` — find a skill by intent ("I want to add login"); every entry is a link, so a wrong name fails validation. Payments/subscriptions is listed honestly as having no dedicated skill.
- `CONTRIBUTING.md` and five issue templates (bug, feature, new skill, adapter, evaluation).
- `examples/multi-tenant-saas/` — one fictional SaaS planned through every stage, request to release checklist, including week-1 tracking with a caught scope change. Every file carries a status label (PROPOSED / APPROVED (simulated)); nothing claims to be implemented. Not shipped by the installer.
- `evals/` — effectiveness evaluation, distinct from validation: method (baseline vs AgentFlow, ≥3 runs per arm, blind scoring), a scoresheet, and six cases with planted traps — planning, architecture, bug-fixing, security, testing, scope control. No results recorded; none invented.
- Validator: every relative link in the root guides, `plugins/README.md`, `examples/`, and `evals/` must resolve; every example file must carry a status label; every eval case must have its three files and be listed.
- README: what AgentFlow is in the first screen, a Mermaid diagram of the pipeline (gates, single vs parallel agents, tracking, scope change), which agents get native integration versus an adapter file, and context cost.
- Validator: the intent index must cover every pack; the README's quoted version must match.

### Changed — token cost

- `project-management` is split into a short body plus one file per mode (`modes/`), loaded only for the request at hand: a tracking request costs ~1.6–1.9k tokens instead of ~5.9k. Its description is shorter, so the core pack costs ~1.9k per turn.
- Adapters (`AGENTS.md`, `CLAUDE.md`, Cursor, Windsurf, Copilot) no longer read the 4k-token `.ai/README.md` map on every session start; it is opened when needed. They read `CURRENT_STATUS.md` first when it exists.

### Fixed

- Context-cost figures were stale since 1.2.0; now recomputed and checked (all packs ~12.0k tokens).
- The root README still quoted version 1.0.0.

### Totals

- 178 skills · 13 agents · 13 hooks · 12 workflows · 31 templates · 19 prompts · 18 checklists.

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
