# Changelog — AI Engineering System

All notable changes to **this system** (not to any application built with it) are documented here. This project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-07-16

### Added — Phase 1: Foundation

- Canonical `.ai/` directory as the single source of truth.
- Top-level `.ai/README.md`, `VERSION`, `CHANGELOG.md`.
- Core system rules in `.ai/system/`:
  - `OPERATING_RULES.md`, `ORCHESTRATION_WORKFLOW.md`
  - `APPLICATION_SELECTION_RULES.md`, `STACK_DECISION_RULES.md`, `SKILL_SELECTION_RULES.md`
  - `PHASE_GENERATION_RULES.md`, `TASK_GENERATION_RULES.md`
  - `CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`
  - `MULTI_AGENT_RULES.md`, `HOOK_RULES.md`, `QUALITY_GATES.md`
  - `DOCUMENTATION_RULES.md`, `TESTING_SELECTION_RULES.md`, `SECURITY_RULES.md`, `GIT_WORKFLOW_RULES.md`
- Directory skeletons with indexes for: `skills/`, `agents/`, `hooks/`, `workflows/`, `knowledge/`, `references/`, `templates/`, `prompts/`, `checklists/`, `memory/`, `projects/` (+ `current/`), `work-items/` (features, bugs, refactors, audits, migrations), `generated/` (reports, audits, checklists).
- MCP/tool governance in `.ai/mcp/`: `TOOL_SELECTION.md`, `PERMISSION_RULES.md`, `RECOMMENDED_SERVERS.md`.
- Thin editor adapters: `AGENTS.md` (general entry), `CLAUDE.md`, `.cursor/rules/project.mdc`, `.windsurf/rules/project.md`, `.github/copilot-instructions.md`. Antigravity documented to read `AGENTS.md`.

### Scope (Phase 1)

- No application code, no dependencies, no selected technology stack.
- No GitHub repository creation.
- No mobile/web/dashboard/backend/database application initialization.

### Not yet included (future phases)

- Concrete skill modules, agent role files, executable hook integrations, and per-project instantiations are added in later phases, per project, under user approval.
