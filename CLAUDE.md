# CLAUDE.md — Claude Code Adapter (thin)

> **Thin adapter.** The full system is canonical in **`.ai/`**. This file does not restate it.

Claude Code: operate through the AI Engineering System.

## Read, in order
1. `AGENTS.md` (general entry point)
2. `.ai/README.md`
3. `.ai/system/OPERATING_RULES.md`
4. `.ai/system/ORCHESTRATION_WORKFLOW.md`
5. `.ai/projects/current/`

Then load **only** the relevant `.ai/skills/` (via the index), the active `.ai/work-items/` entry, and the relevant `.ai/references/<topic>/`. Follow `.ai/system/CONTEXT_MANAGEMENT_RULES.md` and `TOKEN_OPTIMIZATION_RULES.md` — do not load everything.

## Must-follow (details in `.ai/`)
- `.ai/` is canonical; this file stays thin.
- No application code, dependency install, or stack choice before the user-approval gates in `.ai/system/QUALITY_GATES.md`.
- Classify the request, then follow the pipeline in `.ai/system/ORCHESTRATION_WORKFLOW.md`.
- Applications/stack are decisions (`.ai/system/APPLICATION_SELECTION_RULES.md`, `STACK_DECISION_RULES.md`); phases are dynamic (`PHASE_GENERATION_RULES.md`).
- Multi-agent optional/controlled (`.ai/system/MULTI_AGENT_RULES.md`); hooks tool-neutral (`HOOK_RULES.md`).
- Security + git rules apply (`.ai/system/SECURITY_RULES.md`, `GIT_WORKFLOW_RULES.md`). Do not create a remote repo or commit/push without explicit approval.

## Claude Code specifics
- Prefer Read/Grep/Glob before editing; run checks via Bash and quote results (mark unrun checks "unverified until run").
- Use plan-first before broad changes; respect the two approval gates.
- Optional Claude Code hooks/subagents may implement `.ai/hooks/` and `.ai/agents/` **only when approved** — they wrap the canonical specs, never replace them.
