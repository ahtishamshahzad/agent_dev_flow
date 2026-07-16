# AI Engineering System — Windsurf Adapter (thin)

> **Canonical source of truth is the `.ai/` directory.** This rule is a thin pointer and does not duplicate the system. (Copy to project root as `.windsurfrules` if your Windsurf version expects that, or keep here under `.windsurf/rules/`.)

When working in this repository, follow the AI Engineering System. Read, in order:
1. `AGENTS.md`
2. `.ai/README.md`
3. `.ai/system/OPERATING_RULES.md`
4. `.ai/system/ORCHESTRATION_WORKFLOW.md`
5. `.ai/projects/current/`

Then load **only** the relevant `.ai/skills/` (via its index), the active `.ai/work-items/` entry, and the relevant `.ai/references/<topic>/`. Do not load everything — see `.ai/system/CONTEXT_MANAGEMENT_RULES.md` and `TOKEN_OPTIMIZATION_RULES.md`.

## Non-negotiables (full text in `.ai/`)
- `.ai/` is canonical; keep this adapter thin.
- **Plan before code:** no application code, dependency install, or stack choice before the two user-approval gates (`.ai/system/QUALITY_GATES.md`).
- **Classify every request**, then follow `.ai/system/ORCHESTRATION_WORKFLOW.md`.
- **Applications and stack are decisions, not defaults** (`.ai/system/APPLICATION_SELECTION_RULES.md`, `STACK_DECISION_RULES.md`). Public web app ≠ admin dashboard. Never compare a database against an ORM — pair them.
- **Phases are dynamic** (`.ai/system/PHASE_GENERATION_RULES.md`).
- **Multi-agent optional/controlled** (`.ai/system/MULTI_AGENT_RULES.md`); **hooks tool-neutral** (`HOOK_RULES.md`).
- **Security + git rules apply** (`.ai/system/SECURITY_RULES.md`, `GIT_WORKFLOW_RULES.md`). No remote repo creation or commit/push without explicit approval.
- Be honest: separate done-and-verified from proposed/assumed.
