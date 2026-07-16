# AGENTS.md — Entry Point for All AI Agents

> **This is a thin adapter.** The complete system is in the canonical **`.ai/`** directory. This file only points you there. Do not treat this file as the full ruleset, and do not duplicate `.ai/` content into it.

Any AI coding agent — **Claude Code, OpenAI Codex, Cursor, Windsurf, GitHub Copilot, Antigravity**, or any agent that can read repository files — must operate through the AI Engineering System in `.ai/`.

## Start here (read in order)

1. **`.ai/README.md`** — the map of the system.
2. **`.ai/system/OPERATING_RULES.md`** — the non-negotiable operating rules.
3. **`.ai/system/ORCHESTRATION_WORKFLOW.md`** — the request→release pipeline and gates.
4. **`.ai/projects/current/`** — the active project's state, decisions, and gate status.
5. Then load **only what the active task needs**:
   - relevant **`.ai/skills/`** (via the index — not all of them)
   - the relevant **`.ai/work-items/`** entry
   - the relevant **`.ai/references/<topic>/`** folder

Do not load everything. Follow `.ai/system/CONTEXT_MANAGEMENT_RULES.md` and `.ai/system/TOKEN_OPTIMIZATION_RULES.md`.

## Non-negotiables (summary — full text in `.ai/`)

- **`.ai/` is canonical.** Editor files are thin adapters that link here.
- **Plan before code.** No application code, dependency install, or stack choice before the two user-approval gates (`.ai/system/QUALITY_GATES.md`).
- **Classify every request** first (`.ai/system/ORCHESTRATION_WORKFLOW.md`).
- **Applications and stack are decisions, not defaults** (`.ai/system/APPLICATION_SELECTION_RULES.md`, `STACK_DECISION_RULES.md`).
- **Phases are dynamic** (`.ai/system/PHASE_GENERATION_RULES.md`).
- **Load only relevant skills/context** (`.ai/system/SKILL_SELECTION_RULES.md`).
- **Multi-agent is optional and controlled** (`.ai/system/MULTI_AGENT_RULES.md`).
- **Hooks are tool-neutral gates** (`.ai/system/HOOK_RULES.md`).
- **Security and git rules apply** (`.ai/system/SECURITY_RULES.md`, `GIT_WORKFLOW_RULES.md`).
- **Be honest:** distinguish done-and-verified from proposed/assumed.

## Antigravity and other agents

If your editor has no dedicated adapter file in this repo, **read this `AGENTS.md` and then `.ai/`**. That is the intended path for Antigravity and any agent without a specific adapter.

## Scope note (current state)

The repository currently contains **only the AI Engineering System (Phase 1)** — no application code, no dependencies, and no selected stack. Those are produced later, per project, under the gates above.
