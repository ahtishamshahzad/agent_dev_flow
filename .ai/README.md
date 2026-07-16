# `.ai/` — Canonical AI Engineering System

> **This directory is the single source of truth.** Every AI coding agent working in this repository — Claude Code, OpenAI Codex, Cursor, Windsurf, GitHub Copilot, Antigravity, or any agent that can read files — must treat `.ai/` as canonical. Editor-specific files (`CLAUDE.md`, `.cursor/rules/`, `.windsurf/rules/`, `.github/copilot-instructions.md`) are **thin adapters** that point here; they never duplicate this system.

## What this is

A reusable, tool-neutral operating system for planning and building software with AI agents. It defines **how work is classified, planned, approved, implemented, tested, reviewed, and released** — without prescribing any application type or technology stack. The stack and applications are chosen per project, with user approval, using the rules in `system/`.

## Read order for an agent starting work

1. `../AGENTS.md` — general entry point (all agents)
2. `README.md` (this file) — the map
3. `system/OPERATING_RULES.md` — the non-negotiable operating rules
4. `system/ORCHESTRATION_WORKFLOW.md` — the end-to-end workflow
5. `projects/current/` — the active project's state, decisions, and phases
6. Only the **relevant** `skills/`, `work-items/`, and `references/` for the active task (see `system/TOKEN_OPTIMIZATION_RULES.md` — do **not** load everything)

## Directory map

| Path | Purpose |
|------|---------|
| `system/` | Core operating, orchestration, selection, and gate rules — the brain |
| `skills/` | Reusable capability modules (indexed; loaded selectively) |
| `agents/` | Agent role definitions for multi-agent runs (optional) |
| `hooks/` | Tool-neutral workflow gates (before/after events) |
| `workflows/` | Named end-to-end and per-request-type workflows |
| `knowledge/` | Durable domain/architecture knowledge for the current work |
| `references/` | External-facing reference material, organized by topic folder |
| `templates/` | Reusable document/scaffold templates (not app code) |
| `prompts/` | Reusable prompt fragments and starters |
| `checklists/` | Reusable review/validation checklists |
| `memory/` | Concise, durable decisions and context worth persisting |
| `projects/` | Per-project workspace; `projects/current/` is the active one |
| `work-items/` | Features, bugs, refactors, audits, migrations (the unit of work) |
| `generated/` | Machine/agent-generated reports, audits, checklists (archivable) |
| `mcp/` | Optional tool/MCP integration rules (permissions, when to enable) |

## Core operating model (summary)

```
Request → Classify → Analyze requirements → Audit existing repo (if any)
→ Ask missing questions → Select applications → Recommend stack
→ USER APPROVAL → Architecture → Select relevant skills
→ Generate phases (dynamic) → Generate tasks → USER APPROVAL
→ Implement → Test → Review → Release
```

**No code begins before the planning gates are approved.** See `system/QUALITY_GATES.md`.

## Versioning

- `VERSION` — current system version (semver).
- `CHANGELOG.md` — history of changes to this system (not to any application).

## Scope boundary

This system **plans and governs** application work. It does not itself contain application code, dependencies, or a chosen stack. Those live in the project the system is used to build, chosen per project under the rules here.
