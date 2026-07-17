# `.ai/` — Canonical AI Engineering System — Complete Usage Guide

> **This directory is the single source of truth.** Every AI coding agent working in this repository — Claude Code, OpenAI Codex, Cursor, Windsurf, GitHub Copilot, Antigravity, or any agent that can read files — must treat `.ai/` as canonical. Editor-specific files (`../CLAUDE.md`, `../.cursor/rules/`, `../.windsurf/rules/`, `../.github/copilot-instructions.md`) are **thin adapters** that point here; they never duplicate this system.

For a copy-paste starting point see `../QUICK_START.md`; to add the system to a project see `../INSTALLATION.md`.

---

## 1. Overview

A reusable, tool-neutral operating system for planning and building software with AI agents. It defines **how work is classified, planned, approved, implemented, tested, reviewed, and released** — without prescribing any application type or technology stack. The stack and applications are chosen **per project, with user approval**, using the rules in `system/`.

It is **documentation and governance**, not application code: it contains no dependencies and commits no stack. What it produces (plans, decisions, reviews) lives in `projects/` and `work-items/`; what you build with it lives in your project.

## 2. Supported AI editors

Any agent that can read files can use `.ai/` directly. Thin adapters make it native in specific editors:

| Editor / agent | Adapter (thin, points to `.ai/`) |
|----------------|----------------------------------|
| **Claude Code** | `../CLAUDE.md` |
| **OpenAI Codex / general agents** | `../AGENTS.md` (the general entry point) |
| **Cursor** | `../.cursor/rules/project.mdc` |
| **Windsurf** | `../.windsurf/rules/project.md` |
| **GitHub Copilot** | `../.github/copilot-instructions.md` |
| **Antigravity** | reads `../AGENTS.md` (documented there; no separate adapter needed) |

Adapters never duplicate the system — they tell the editor to operate through `.ai/`. Every agent starts at `../AGENTS.md` → this file → `system/`.

## 3. Architecture

The system is layered; each layer has one job:

- **`system/`** — the brain: non-negotiable operating rules, the orchestration pipeline, selection rules, and the quality gates.
- **`skills/`** — 174 reusable capability modules (core + mobile/web/backend/database/testing/devops/security packs), loaded selectively.
- **`agents/`** — 13 role definitions for optional multi-agent runs, with explicit file ownership.
- **`hooks/`** — 13 tool-neutral lifecycle checklists (before/after events).
- **`workflows/`** — 12 per-request-type flows keyed to classification.
- **`templates/` · `prompts/` · `checklists/`** — authoring support (fill-in docs, starters, verifiable gate checklists).
- **`knowledge/` · `memory/` · `references/`** — durable knowledge (trust-labeled), broadly reusable lessons, and external project material.
- **`projects/` · `work-items/` · `generated/`** — where per-project state, units of work, and reports live.

## 4. Directory guide

| Path | Purpose |
|------|---------|
| `system/` | Core operating, orchestration, selection, and gate rules — the brain. |
| `skills/` | Reusable capability modules (indexed; loaded selectively). See `skills/README.md`. |
| `agents/` | Agent role definitions for multi-agent runs (optional). See `agents/README.md`. |
| `hooks/` | Tool-neutral workflow gates (before/after events). See `hooks/README.md`. |
| `workflows/` | Named per-request-type workflows. See `workflows/README.md`. |
| `templates/` | Reusable document templates (not app code). See `templates/README.md`. |
| `prompts/` | Reusable, tool-neutral prompt starters. See `prompts/README.md`. |
| `checklists/` | Verifiable gate/hook checklists. See `checklists/README.md`. |
| `knowledge/` | Durable, trust-labeled domain/engineering knowledge. See `knowledge/README.md`. |
| `references/` | External-facing reference material by topic. See `references/README.md`. |
| `memory/` | Broadly reusable lessons across projects. See `memory/README.md`. |
| `projects/` | Per-project workspace; `projects/current/` is the active one. |
| `work-items/` | Features, bugs, refactors, audits, migrations — the unit of work. |
| `generated/` | Machine/agent-generated reports and audits (archivable). |
| `mcp/` | Optional tool/MCP integration rules (permissions, when to enable). |

## 5. New project workflow

Follow `workflows/new-project.md`. Pipeline (`system/ORCHESTRATION_WORKFLOW.md`):

```
Classify → Requirements → (Audit if repo exists) → Missing questions
→ Application selection → Stack recommendation
──── GATE 2: user approves apps + stack ────
→ Architecture → Select skills → Dynamic phases → Tasks
──── GATE 4: user approves phases + tasks ────
→ Implement → Test → Review → Release
```

**No code before Gates 2 and 4.** Outputs go to `projects/current/` (use `templates/REQUIREMENTS.md`, `APPLICATION_SELECTION.md`, `STACK_RECOMMENDATION.md`, `ARCHITECTURE.md`, `PHASE_PLAN.md`, `TASK.md`). Start with the prompt in `prompts/new-project.md`.

## 6. Existing project workflow

Follow `workflows/existing-project.md`. **Audit before changing anything** (`skills/existing-project-audit`, plus `skills/backend/existing-backend-audit`, `dependency-audit`, `environment-audit`) → `templates/AUDIT.md`. Then analyze the change, pick the right sub-workflow (feature/refactor/migration), and plan scoped phases/tasks. Gate 2 only if new apps/stack are needed. Preserve existing conventions unless a change is justified. Prompt: `prompts/existing-project.md`.

## 7. Feature workflow

Follow `workflows/new-feature.md`. Plan within existing architecture, no scope creep (`skills/feature-planning`) → `work-items/features/` (`templates/FEATURE.md`). Break into tasks with acceptance criteria; define the test approach (required cases: happy · invalid input · error · **authorization denial** · regression). Gate 4 before implementing. Prompts: `prompts/feature-plan.md`, `feature-implementation.md`.

## 8. Bug workflow

Follow `workflows/bugfix.md`. **Reproduce → root cause → minimal fix → failing-first regression test → validate** (`skills/bug-investigation`, `skills/testing/regression-testing`) → `work-items/bugs/` (`templates/BUG.md`). Never fix by guessing; the regression test must fail on the unfixed code and pass after. Prompts: `prompts/bug-investigation.md`, `bug-implementation.md`.

## 9. Refactor workflow

Follow `workflows/refactor.md`. Behavior-preserving, in **small reversible steps**, with a test safety net first (`skills/refactor-planning`, `skills/testing/test-coverage-audit`) → `templates/REFACTOR.md`. If the change alters behavior, reclassify as feature/bugfix. Prompt: `prompts/refactor-plan.md`.

## 10. Migration workflow

Follow `workflows/migration.md`. Incremental, reversible: **backup + tested restore → rehearse → batched/resumable/idempotent runner → verify against pre-agreed criteria → cutover** (`skills/migration-planning`, `skills/database/data-migration`, `backup-recovery`) → `templates/MIGRATION.md`. Schema/migration files have a single owner (`agents/database-engineer.md`). Prompt: `prompts/migration-plan.md`.

## 11. Multi-agent workflow

Multi-agent execution is **optional** (`system/MULTI_AGENT_RULES.md`, `agents/multi-agent-execution.md`). Three modes:

1. **Single-agent** — small/coupled work; the default.
2. **Sequential specialists** — `requirements → architecture → implementation → test → review`, role separation without concurrency.
3. **Parallel specialists** — only for genuinely independent streams, and only with: **non-overlapping file ownership**, **explicit shared contracts defined first**, a **synchronization point**, and a **final integration review**.

The orchestrator (`agents/orchestrator.md`) builds a disjoint file-ownership map and prevents two agents editing the same file — conflicts are prevented by construction. **Do not go multi-agent just because you can.**

## 12. Token-efficient usage

Per `system/TOKEN_OPTIMIZATION_RULES.md` and `CONTEXT_MANAGEMENT_RULES.md`:

- **Load the minimum relevant skills** (usually 1–3) via the indexes; never scan the whole `skills/` tree.
- Load specialists **one stage at a time**; unload on task switch.
- Read **only the relevant** `references/`, `knowledge/`, and `work-items/` for the active task.
- Keep volatile detail (versions, examples) in `knowledge/`/`references/` and **link** to it from durable skills.
- Most work starts at `skills/project-orchestrator`, which loads the right specialist one stage at a time.

## 13. Hook usage

Hooks (`hooks/`) are **tool-neutral checklists** run at lifecycle points; an agent reads the spec and performs the checks (executable integration is optional and additive — **do not assume it exists**). Before: discovery, architecture, feature, bugfix, refactor, migration, commit, pr, release. After: feature, phase, pr, release. Each has a trigger, checks, failure conditions, output, and **stop conditions**. Hooks commonly enforce the gates (`hooks/before-release.md` runs the Gate 7 checks). Verifiable versions live in `checklists/`.

## 14. MCP / tool setup

Optional external tools/MCP servers are governed by `mcp/`:

- `mcp/PERMISSION_RULES.md` — when a tool may be enabled and with what permissions.
- `mcp/TOOL_SELECTION.md` — choosing tools by need, not availability.
- `mcp/RECOMMENDED_SERVERS.md` — vetted starting points.

Tools are opt-in and least-privilege; enabling one that shares data is an outward-facing action requiring approval (`system/SECURITY_RULES.md`).

## 15. Project references

`references/` holds **external-facing project material** by topic (product, designs, mobile/*, web/*, backend/*, testing/*, deployment). Every terminal folder's README states what belongs there, file types, naming, and how agents use it. Crucially: **references are not requirements** — a file there is context, not commitment; it becomes a requirement only when reflected in `templates/REQUIREMENTS.md`/tasks and approved at a gate. No secrets or real data in references.

## 16. Knowledge management

`knowledge/` holds **durable, reusable** domain/engineering knowledge by area (architecture, product, mobile, web, backend, database, testing, security, performance, devops) — **not a tutorial dump**. Every entry carries a **trust level** (verified-current / project-convention / opinion / deprecated / unverified), and change-prone technical entries carry **source, verification date, affected versions, and deprecation status**. Skills **link** to knowledge rather than embedding volatile detail. Stale or deprecated guidance is labeled and excluded from new work. See `knowledge/README.md`.

## 17. Memory management

`memory/` holds only **broadly reusable** lessons (project history, architecture history, common mistakes, reusable decisions, tooling lessons, retrospectives). Add to global memory **only when** the lesson is reusable, the decision was validated, a recurring failure pattern was identified, an integration issue has future value, or a testing/release lesson is broadly applicable. **Project-specific memory lives in `projects/current/`.** Never store secrets or unnecessary personal information; do not copy every task log into global memory. See `memory/README.md`.

## 18. Git and GitHub workflow

Per `system/GIT_WORKFLOW_RULES.md` and `skills/git-workflow`, `github-repository`:

- **Never commit or push unasked.** Branch off the default branch; small coherent commits; secrets never committed.
- **Remote repository creation and any push/publish require explicit user approval.** **Never force-push**, never merge to the default branch unasked.
- Inspect status, history, secrets, and the approved repository strategy before acting. Hooks: `hooks/before-commit.md`, `before-pr.md`, `after-pr.md`. Checklists: `checklists/commit.md`, `pull-request.md`. Template: `templates/PR_DESCRIPTION.md`.

## 19. Phase execution

Phases are generated **dynamically** from the actual work (`system/PHASE_GENERATION_RULES.md`), not a fixed template, and tasks get acceptance criteria (`TASK_GENERATION_RULES.md`). To run a phase: read `../AGENTS.md`, `projects/current/` progress, the active phase/tasks, and the relevant skills/references; verify dependencies; run `hooks/before-feature.md`; implement **only the approved phase** in scope; cover the required test cases; run `hooks/after-feature.md`/`after-phase.md`; update `templates/PROGRESS.md`; **stop before the next phase.** Prompt: `prompts/start-phase.md`.

## 20. Release workflow

Follow `workflows/release.md` (and `deployment.md`). Confirm Gates 1–6, aggregate reviews into a go/no-go (`skills/final-quality-audit` → `templates/FINAL_AUDIT.md`), then verify **Gate 7 readiness with evidence** — tests green, security/quality clear, docs + changelog updated, version handled, production-readiness + **rollback rehearsed**, backups + **tested restore** (`templates/RELEASE_CHECKLIST.md`). **Publishing/deploying requires explicit user approval — never assumed.** Post-deploy smoke gates health; roll back on failure. Hooks: `hooks/before-release.md`, `after-release.md`.

## 21. Extending the system

- **New skill:** one capability, standard section format, registered in its pack index (`skills/README.md`); propose under approval — don't add unrelated skills "to be safe."
- **New agent/hook/workflow/template/prompt/checklist:** follow the folder's conventions and register it in that index.
- **New knowledge/reference:** add to the right area with a trust label (knowledge) or terminal-folder rules (references).
- Keep `.ai/` canonical and adapters thin. Nothing here contradicts `system/`.

## 22. Versioning

- `VERSION` — current system version (semver): **1.0.0**.
- `CHANGELOG.md` — history of changes to **this system** (not to any application built with it).
- Follows [Semantic Versioning](https://semver.org/): breaking rule/structure changes → major; additive skills/agents/etc. → minor; fixes/clarifications → patch.

## 23. Troubleshooting

| Symptom | Likely cause / fix |
|---------|--------------------|
| Agent starts coding immediately | Gates 2/4 not enforced — stop, get approval first (`system/QUALITY_GATES.md`). |
| Context bloated / slow | Too many skills loaded — load the minimum set, unload on switch (`system/TOKEN_OPTIMIZATION_RULES.md`). |
| Two agents edited the same file | Parallel run without disjoint ownership — use the orchestrator's file-ownership map or run sequentially (`agents/multi-agent-execution.md`). |
| Guidance seems outdated | Check the knowledge entry's trust level + `verified` date + `affected_versions`; re-verify or treat as unverified (`knowledge/README.md`). |
| A reference drove scope silently | References aren't requirements — only gate-approved requirements/tasks drive scope (`references/README.md`). |
| Bug fix didn't stick | Missing failing-first regression test (`hooks/before-bugfix.md`, `skills/testing/regression-testing`). |
| Deploy broke on config | Run post-deploy smoke against the real environment; validate env/secrets at boot (`hooks/after-release.md`, `skills/devops/environment-management`). |
| "Is it secure?" | The system never claims "secure" — see `skills/security/README.md`; report Confirmed vs Potential findings. |

## Core operating model (summary)

```
Request → Classify → Analyze requirements → Audit existing repo (if any)
→ Ask missing questions → Select applications → Recommend stack
→ USER APPROVAL → Architecture → Select relevant skills
→ Generate phases (dynamic) → Generate tasks → USER APPROVAL
→ Implement → Test → Review → Release
```

**No code begins before the planning gates are approved.** See `system/QUALITY_GATES.md`.

## Scope boundary

This system **plans and governs** application work. It does not itself contain application code, dependencies, or a chosen stack. Those live in the project the system is used to build, chosen per project under the rules here.
