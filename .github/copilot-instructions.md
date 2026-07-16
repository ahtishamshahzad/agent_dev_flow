# GitHub Copilot Instructions — AI Engineering System (thin adapter)

> **Canonical source of truth is the `.ai/` directory.** These instructions are a thin pointer and do not duplicate the system.

When assisting in this repository, follow the AI Engineering System defined in `.ai/`.

**Read, in order:** `AGENTS.md` → `.ai/README.md` → `.ai/system/OPERATING_RULES.md` → `.ai/system/ORCHESTRATION_WORKFLOW.md` → `.ai/projects/current/`. Then load only the relevant `.ai/skills/` (via its index), the active `.ai/work-items/` entry, and the relevant `.ai/references/<topic>/`. Do not load everything (`.ai/system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`).

## Non-negotiables (full text in `.ai/`)
- `.ai/` is canonical; keep this adapter thin.
- **Plan before code:** no application code, dependency install, or stack choice before the user-approval gates (`.ai/system/QUALITY_GATES.md`).
- **Classify the request**, then follow `.ai/system/ORCHESTRATION_WORKFLOW.md`.
- **Applications and stack are decisions, not defaults** (`.ai/system/APPLICATION_SELECTION_RULES.md`, `STACK_DECISION_RULES.md`). Public web app ≠ admin dashboard. Pair databases with data layers (e.g. PostgreSQL + Prisma); never compare a database against an ORM.
- **Phases are dynamic** (`.ai/system/PHASE_GENERATION_RULES.md`).
- **Multi-agent optional/controlled** (`.ai/system/MULTI_AGENT_RULES.md`); **hooks tool-neutral** (`HOOK_RULES.md`).
- **Security + git rules apply** (`.ai/system/SECURITY_RULES.md`, `GIT_WORKFLOW_RULES.md`). No remote repo creation or commit/push without explicit approval.
- Be honest: separate done-and-verified from proposed/assumed.
