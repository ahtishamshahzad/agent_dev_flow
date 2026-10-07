# AI Engineering System

**A reusable, tool-neutral operating system for planning and building software with AI agents.** It defines *how* work is classified, planned, approved, implemented, tested, reviewed, and released — without prescribing any application type or technology stack. The stack and applications are chosen per project, with user approval.

It is **documentation and governance**, not application code: no dependencies, no committed stack. It works with **Claude Code, OpenAI Codex, Cursor, Windsurf, GitHub Copilot, Antigravity**, or any agent that can read files.

> Version **1.0.0** · MIT · The full guide lives in [`.ai/README.md`](.ai/README.md).

---

## What's inside

| Layer | Count | Where |
|-------|-------|-------|
| **Skills** (reusable capability modules) | **178** | [`.ai/skills/`](.ai/skills/README.md) |
| **Agents** (roles for multi-agent runs) | 13 | [`.ai/agents/`](.ai/agents/README.md) |
| **Hooks** (tool-neutral lifecycle checklists) | 13 | [`.ai/hooks/`](.ai/hooks/README.md) |
| **Workflows** (per request type) | 12 | [`.ai/workflows/`](.ai/workflows/README.md) |
| **Templates** (fill-in documents) | 31 | [`.ai/templates/`](.ai/templates/README.md) |
| **Prompts** (tool-neutral starters) | 19 | [`.ai/prompts/`](.ai/prompts/README.md) |
| **Checklists** (verifiable gate/hook checks) | 18 | [`.ai/checklists/`](.ai/checklists/README.md) |

Skills are organized into **8 packs**: core (28), mobile (36), web & dashboard (26), backend (30), database (15), testing (15), devops (16), security (12). Plus system rules, knowledge, memory, and references — all in [`.ai/`](.ai/README.md).

## Install

### Fastest — one command (all editors)

Set up any project with a single command. It copies `.ai/`, the `AGENTS.md` entry point, and your editor adapter(s) — no dependencies, no stack, no repo:

```bash
npx github:ahtishamshahzad/agent_dev_flow init
```

Only the editors you use: `--editor claude,cursor` (values: `claude`, `cursor`, `windsurf`, `copilot`, `codex`, `all`; default `all`). Also `--force`, `--dry-run`, `--help`. This installs the **files**; Claude Code's native skill plugins are the separate step below.

### Claude Code — native plugins

The skills are packaged as installable Claude Code plugins (one per pack):

```
/plugin marketplace add ahtishamshahzad/agent_dev_flow
/plugin install ai-core@agent_dev_flow
```

Add whichever packs a project needs — `ai-mobile`, `ai-web`, `ai-backend`, `ai-database`, `ai-testing`, `ai-devops`, `ai-security`. `ai-core` is the recommended baseline (it has `project-orchestrator`, which drives the whole pipeline). Invoke by namespace: `/ai-core:project-orchestrator`, `/ai-backend:backend-authorization`. See [`plugins/README.md`](plugins/README.md).

### Codex, Cursor, Windsurf, Copilot, Antigravity — copy the files

These read the system through their adapters. The `npx … init` command above sets them all up automatically; to copy manually instead, copy `.ai/` plus the entry point and your editor's adapter into a project:

```bash
cp -r .ai AGENTS.md CLAUDE.md /path/to/your-project/
```

| Editor | Adapter it reads |
|--------|------------------|
| Claude Code | `CLAUDE.md` |
| OpenAI Codex / general agents | `AGENTS.md` |
| Cursor | `.cursor/rules/project.mdc` |
| Windsurf | `.windsurf/rules/project.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Antigravity | `AGENTS.md` |

Full options (copy-in vs. submodule/subtree, per-editor matrix): [`INSTALLATION.md`](INSTALLATION.md).

## Use it

Full walkthrough — per editor, new project and existing project: **[`USAGE.md`](USAGE.md)**. Prompt-only version: [`QUICK_START.md`](QUICK_START.md).

Same prompts in every editor; only the entry file differs (`CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `.windsurf/rules/`, `.github/copilot-instructions.md`). A new project:

```
Use the project-orchestrator skill.
This is a new project.
Analyze my requirements, ask missing questions, select required applications,
recommend a stack, generate architecture, dynamic phases, tasks, testing plan
and Git strategy. Store outputs under `.ai/projects/current/`. Do not implement code.
```

An existing one:

```
Use project-orchestrator and existing-project-audit.
Inspect the repository before planning changes.
Preserve current conventions unless change is justified.
Generate the plan under `.ai/projects/current/`. Do not implement code.
```

The agent reads `CLAUDE.md`/`AGENTS.md` → `.ai/` → loads only the relevant skills. It classifies the request, then walks the pipeline, **stopping at two approval gates** before any code:

```
Request → Classify → Requirements → (Audit if repo exists) → Applications → Stack
──── GATE: you approve applications + stack ────
→ Architecture → Dynamic phases → Tasks
──── GATE: you approve phases + tasks ────
→ Track (roadmap, IDs, weekly plan) → Implement → Test → Review → Release
```

### After approval: track it week by week

Once the plan is approved, `project-management` keeps a living record in `.ai/projects/current/`: a roadmap, one plan per week, a unique ID and status for every task and bug, development/bug/scope-change logs, risks, decisions, and reports a client can read.

```
Fix this bug: <describe it>          → duplicate check, BUG-NNN, root cause, priority, week, bug log — then fix
Plan next week.                      → carry-forward + P0 bugs + ready tasks, sized to capacity
Update project status.               → CURRENT_STATUS.md reconciled against the code
What are the current blockers?
Prepare weekly report. / Prepare meeting report.   → business language, verified work only
```

New work that changes the approved plan is flagged **`SCOPE CHANGE`** and comes back to you for approval. Rules: [`.ai/system/PROJECT_MANAGEMENT_RULES.md`](.ai/system/PROJECT_MANAGEMENT_RULES.md).

> **`.ai/` must be present in the project.** Skills reference sibling paths inside it and write your project's state to `.ai/projects/current/`. Claude Code plugins add native skill invocation on top — they do not replace the files.

## How it works (principles)

- **No code before the approval gates.** Applications and stack are decisions, not defaults.
- **Load only what you need** — the minimum relevant skills, one stage at a time.
- **Everything is enforced server-side**; client checks are UX. Authorization is distinct from authentication and from abuse prevention.
- **Multi-agent is optional** and only for genuinely independent work with non-overlapping file ownership — conflicts are prevented by construction, never used just because it's possible.
- **Records claim only verified work** — the code outranks the status file; progress is derived, never asserted; logs are append-only.
- **Reviews report Confirmed vs Potential**, never print secrets, and never claim a system is "secure."
- **`.ai/` is canonical**; editor adapters are thin pointers that never duplicate it.

## Documentation

- [`.ai/README.md`](.ai/README.md) — the complete 23-section usage guide (architecture, all workflows, multi-agent, token efficiency, hooks, MCP, knowledge/memory, git, phases, release, troubleshooting).
- [`USAGE.md`](USAGE.md) — how to drive it from Claude Code, Cursor, Windsurf, Copilot, Codex, Antigravity; new-project and existing-project flows; troubleshooting.
- [`QUICK_START.md`](QUICK_START.md) — copy-paste starters.
- [`INSTALLATION.md`](INSTALLATION.md) — install options and per-editor setup.
- [`plugins/README.md`](plugins/README.md) — Claude Code plugin details.
- [`.ai/CHANGELOG.md`](.ai/CHANGELOG.md) — version history.

## Scope

This system **plans and governs** application work. It contains no application code, dependencies, or chosen stack — those live in the project you build with it, decided per project under the approval gates above.

## License

MIT.
